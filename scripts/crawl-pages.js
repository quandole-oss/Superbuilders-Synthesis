#!/usr/bin/env node

/**
 * Crawl specific authenticated pages one at a time
 */

import "dotenv/config";
import fs from "node:fs";
import path from "node:path";

const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
const CF_API_TOKEN = process.env.CF_API_TOKEN;
const BASE_URL = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/browser-rendering/crawl`;
const OUT_DIR = path.join(import.meta.dirname, "..", "crawl-output");

const PAGES = [
  "https://tutor.synthesis.com/",
  "https://tutor.synthesis.com/students",
  "https://tutor.synthesis.com/activity",
  "https://tutor.synthesis.com/account/billing",
  "https://tutor.synthesis.com/account/subscribe",
  "https://tutor.synthesis.com/login",
  "https://tutor.synthesis.com/signup",
  "https://tutor.synthesis.com/forgot-password",
  "https://tutor.synthesis.com/demo",
  "https://tutor.synthesis.com/trial",
  "https://tutor.synthesis.com/gift",
  "https://tutor.synthesis.com/ipad",
  "https://tutor.synthesis.com/referral",
  "https://tutor.synthesis.com/flashcards",
  "https://tutor.synthesis.com/arcade",
];

async function crawlPage(url) {
  const payload = {
    url,
    limit: 1,
    depth: 1,
    render: true,
    formats: ["html", "markdown"],
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
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    gotoOptions: {
      waitUntil: "networkidle2",
      timeout: 60000,
    },
    viewport: { width: 1440, height: 900 },
  };

  // Start crawl
  const startRes = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${CF_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const startData = await startRes.json();
  if (!startData.success) {
    console.error(`  Failed to start: ${JSON.stringify(startData.errors)}`);
    return null;
  }

  const jobId = startData.result;

  // Poll until done
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 5000));

    const pollRes = await fetch(`${BASE_URL}/${jobId}`, {
      headers: { Authorization: `Bearer ${CF_API_TOKEN}` },
    });

    const pollData = await pollRes.json();
    if (!pollData.success || !pollData.result) continue;

    const { status, records } = pollData.result;
    if (status !== "running") {
      return records || [];
    }
  }

  console.error(`  Timed out`);
  return [];
}

async function main() {
  const htmlDir = path.join(OUT_DIR, "html");
  const mdDir = path.join(OUT_DIR, "markdown");
  fs.mkdirSync(htmlDir, { recursive: true });
  fs.mkdirSync(mdDir, { recursive: true });

  const allRecords = [];

  for (const url of PAGES) {
    console.log(`Crawling: ${url}`);
    const records = await crawlPage(url);

    if (!records || records.length === 0) {
      console.log(`  No results\n`);
      continue;
    }

    for (const record of records) {
      allRecords.push(record);
      const slug = record.url
        .replace(/https?:\/\//, "")
        .replace(/[^a-zA-Z0-9]/g, "_")
        .substring(0, 80);

      const idx = allRecords.length - 1;
      if (record.html) {
        fs.writeFileSync(path.join(htmlDir, `${idx}_${slug}.html`), record.html);
      }
      if (record.markdown) {
        fs.writeFileSync(path.join(mdDir, `${idx}_${slug}.md`), record.markdown);
      }

      console.log(`  ${record.url} — ${record.metadata?.title || "N/A"} (${record.metadata?.status || "?"})`);
    }

    // Small delay between jobs to avoid rate limit
    await new Promise((r) => setTimeout(r, 2000));
  }

  // Save combined results
  fs.writeFileSync(
    path.join(OUT_DIR, "crawl-results.json"),
    JSON.stringify(allRecords, null, 2)
  );

  console.log(`\nDone! ${allRecords.length} pages saved to ${OUT_DIR}`);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
