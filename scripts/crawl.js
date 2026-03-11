#!/usr/bin/env node

/**
 * Crawl tutor.synthesis.com using Cloudflare Browser Rendering /crawl endpoint
 *
 * Usage:
 *   npm run crawl
 */

import "dotenv/config";
import fs from "node:fs";
import path from "node:path";

const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
const CF_API_TOKEN = process.env.CF_API_TOKEN;
const BASE_URL = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/browser-rendering/crawl`;
const OUT_DIR = path.join(import.meta.dirname, "..", "crawl-output");

if (!CF_ACCOUNT_ID || !CF_API_TOKEN) {
  console.error("Set CF_ACCOUNT_ID and CF_API_TOKEN in .env first.");
  console.error("Copy .env.example to .env and fill in your values.");
  process.exit(1);
}

// ─── Step 1: Start crawl job ────────────────────────────────────────────────────
async function startCrawl() {
  console.log("Starting crawl of tutor.synthesis.com ...\n");

  const payload = {
    url: "https://tutor.synthesis.com/",
    limit: 50,
    depth: 3,
    render: true,
    formats: ["html", "markdown"],
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    gotoOptions: {
      waitUntil: "networkidle2",
      timeout: 60000,
    },
    cookies: process.env.SESSION_COOKIE
      ? [
          {
            name: "tutor-session-v2",
            value: process.env.SESSION_COOKIE,
            domain: "tutor.synthesis.com",
            path: "/",
          },
        ]
      : undefined,
    rejectResourceTypes: ["media", "font"],
    options: {
      includeExternalLinks: false,
      includeSubdomains: false,
    },
  };

  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${CF_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    console.error(`HTTP ${res.status}: ${res.statusText}`);
    const text = await res.text();
    console.error(text);
    process.exit(1);
  }

  const data = await res.json();

  if (!data.success) {
    console.error("Failed to start crawl:", JSON.stringify(data, null, 2));
    process.exit(1);
  }

  const jobId = data.result;
  console.log(`Crawl job started — Job ID: ${jobId}\n`);
  return jobId;
}

// ─── Step 2: Poll until crawl completes ─────────────────────────────────────────
async function waitForCompletion(jobId) {
  const maxAttempts = 120;
  const delayMs = 5000;

  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, delayMs));

    const res = await fetch(`${BASE_URL}/${jobId}`, {
      headers: { Authorization: `Bearer ${CF_API_TOKEN}` },
    });

    const data = await res.json();

    // Job may not be available yet
    if (!data.success || !data.result) {
      process.stdout.write(`\rWaiting for job to start... (${i + 1})    `);
      continue;
    }

    const status = data.result.status;
    const finished = data.result.finished || 0;
    const total = data.result.total || 0;

    process.stdout.write(
      `\rStatus: ${status} | Progress: ${finished}/${total} pages    `
    );

    if (status !== "running") {
      console.log(`\n\nFinal status: ${status}`);
      console.log(`Browser seconds used: ${data.result.browserSecondsUsed || "N/A"}`);
      return data;
    }
  }

  throw new Error("Crawl timed out after 10 minutes of polling.");
}

// ─── Step 3: Fetch all results (paginated) ──────────────────────────────────────
async function fetchResults(jobId) {
  console.log("\nFetching crawl results...\n");

  let allRecords = [];
  let cursor = null;

  while (true) {
    let url = `${BASE_URL}/${jobId}?status=completed`;
    if (cursor) url += `&cursor=${cursor}`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${CF_API_TOKEN}` },
    });

    const data = await res.json();
    const records = data.result.records || [];
    allRecords = allRecords.concat(records);

    console.log(`  Fetched ${records.length} records (total: ${allRecords.length})`);

    if (data.result.cursor && records.length > 0) {
      cursor = data.result.cursor;
    } else {
      break;
    }
  }

  return allRecords;
}

// ─── Step 4: Save results to files ──────────────────────────────────────────────
function saveResults(records) {
  const htmlDir = path.join(OUT_DIR, "html");
  const mdDir = path.join(OUT_DIR, "markdown");

  fs.mkdirSync(htmlDir, { recursive: true });
  fs.mkdirSync(mdDir, { recursive: true });

  fs.writeFileSync(
    path.join(OUT_DIR, "crawl-results.json"),
    JSON.stringify(records, null, 2)
  );

  records.forEach((record, i) => {
    const slug = record.url
      .replace(/https?:\/\//, "")
      .replace(/[^a-zA-Z0-9]/g, "_")
      .substring(0, 80);

    if (record.html) {
      fs.writeFileSync(path.join(htmlDir, `${i}_${slug}.html`), record.html);
    }
    if (record.markdown) {
      fs.writeFileSync(path.join(mdDir, `${i}_${slug}.md`), record.markdown);
    }

    console.log(`  ${record.url}`);
    console.log(`    Title: ${record.metadata?.title || "N/A"}`);
    console.log(`    Status: ${record.metadata?.status || "N/A"}`);
  });

  console.log(`\nResults saved to: ${OUT_DIR}`);
}

// ─── Main ───────────────────────────────────────────────────────────────────────
async function main() {
  try {
    const jobId = await startCrawl();
    const completedData = await waitForCompletion(jobId);
    const status = completedData.result.status;

    if (status === "completed") {
      // Records may be in the completion response already
      let records = completedData.result.records || [];

      // If not included or paginated, fetch them
      if (records.length === 0) {
        records = await fetchResults(jobId);
      }

      if (records.length === 0) {
        console.log("\nNo pages were crawled. Possible reasons:");
        console.log("  - robots.txt is blocking the crawler");
        console.log("  - Bot protection active");
        console.log("  - Site requires authentication");
      } else {
        saveResults(records);
        console.log("\nDone! Run `npm run process` next to generate site-data.json");
      }
    } else {
      console.log(`\nCrawl ended with status: ${status}`);
    }
  } catch (err) {
    console.error("\nError:", err.message);
    process.exit(1);
  }
}

main();
