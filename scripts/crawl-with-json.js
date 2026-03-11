#!/usr/bin/env node

/**
 * Enhanced crawl with AI-powered JSON extraction
 *
 * Usage:
 *   npm run crawl:json
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
  process.exit(1);
}

async function startCrawl() {
  console.log("Starting crawl with JSON extraction...\n");

  const payload = {
    url: "https://tutor.synthesis.com/",
    limit: 50,
    depth: 3,
    render: true,
    formats: ["html", "markdown", "json"],
    jsonOptions: {
      prompt:
        "Extract the page structure: navigation items (labels and URLs), hero heading, hero subheading, hero CTA button text, feature sections (title, description, icon description), testimonials (quote, author name, author role), pricing tiers (name, price, period, feature list, CTA text), call-to-action banners, footer links (grouped by column heading), image URLs with alt text, and any color values found in inline styles or CSS classes.",
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "page_structure",
          schema: {
            type: "object",
            properties: {
              navigation: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    label: { type: "string" },
                    url: { type: "string" },
                  },
                },
              },
              hero: {
                type: "object",
                properties: {
                  heading: { type: "string" },
                  subheading: { type: "string" },
                  cta_text: { type: "string" },
                  cta_url: { type: "string" },
                },
              },
              features: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                    icon: { type: "string" },
                  },
                },
              },
              testimonials: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    quote: { type: "string" },
                    author: { type: "string" },
                    role: { type: "string" },
                  },
                },
              },
              pricing: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    price: { type: "string" },
                    period: { type: "string" },
                    features: { type: "array", items: { type: "string" } },
                    cta_text: { type: "string" },
                  },
                },
              },
              cta_banners: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    heading: { type: "string" },
                    subtext: { type: "string" },
                    button_text: { type: "string" },
                  },
                },
              },
              footer: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    heading: { type: "string" },
                    links: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          label: { type: "string" },
                          url: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
              images: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    src: { type: "string" },
                    alt: { type: "string" },
                  },
                },
              },
              colors: {
                type: "array",
                items: { type: "string" },
              },
            },
          },
        },
      },
    },
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

async function waitForCompletion(jobId) {
  const maxAttempts = 120;
  const delayMs = 5000;

  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, delayMs));

    const res = await fetch(`${BASE_URL}/${jobId}`, {
      headers: { Authorization: `Bearer ${CF_API_TOKEN}` },
    });

    const data = await res.json();

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

  throw new Error("Crawl timed out after 10 minutes.");
}

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

function saveResults(records) {
  const htmlDir = path.join(OUT_DIR, "html");
  const mdDir = path.join(OUT_DIR, "markdown");
  const jsonDir = path.join(OUT_DIR, "json");

  fs.mkdirSync(htmlDir, { recursive: true });
  fs.mkdirSync(mdDir, { recursive: true });
  fs.mkdirSync(jsonDir, { recursive: true });

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
    if (record.json) {
      fs.writeFileSync(
        path.join(jsonDir, `${i}_${slug}.json`),
        JSON.stringify(record.json, null, 2)
      );
    }

    console.log(`  ${record.url}`);
    console.log(`    Title: ${record.metadata?.title || "N/A"}`);
    if (record.json) console.log(`    JSON: extracted`);
  });

  console.log(`\nResults saved to: ${OUT_DIR}`);
}

async function main() {
  try {
    const jobId = await startCrawl();
    const completedData = await waitForCompletion(jobId);
    const status = completedData.result.status;

    if (status === "completed") {
      let records = completedData.result.records || [];
      if (records.length === 0) {
        records = await fetchResults(jobId);
      }
      if (records.length === 0) {
        console.log("\nNo pages were crawled.");
      } else {
        saveResults(records);
        console.log("\nDone! Run `npm run process` next.");
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
