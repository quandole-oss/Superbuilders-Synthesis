#!/usr/bin/env node

/**
 * Capture desktop + mobile screenshots of crawled pages
 *
 * Usage:
 *   npm run screenshots
 *
 * Requires crawl-output/crawl-results.json to exist (run crawl first)
 */

import "dotenv/config";
import fs from "node:fs";
import path from "node:path";

const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
const CF_API_TOKEN = process.env.CF_API_TOKEN;
const SCREENSHOT_URL = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/browser-rendering/screenshot`;
const OUT_DIR = path.join(import.meta.dirname, "..", "crawl-output", "screenshots");
const RESULTS_PATH = path.join(import.meta.dirname, "..", "crawl-output", "crawl-results.json");

if (!CF_ACCOUNT_ID || !CF_API_TOKEN) {
  console.error("Set CF_ACCOUNT_ID and CF_API_TOKEN in .env first.");
  process.exit(1);
}

if (!fs.existsSync(RESULTS_PATH)) {
  console.error("crawl-output/crawl-results.json not found. Run `npm run crawl` first.");
  process.exit(1);
}

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 375, height: 812 },
];

async function captureScreenshot(url, viewport) {
  const res = await fetch(SCREENSHOT_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${CF_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url,
      screenshotOptions: {
        fullPage: true,
        type: "png",
      },
      gotoOptions: {
        waitUntil: "networkidle2",
        timeout: 60000,
      },
      viewport: {
        width: viewport.width,
        height: viewport.height,
      },
    }),
  });

  if (!res.ok) {
    console.error(`  Failed ${viewport.name} for ${url}: HTTP ${res.status}`);
    return null;
  }

  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  const records = JSON.parse(fs.readFileSync(RESULTS_PATH, "utf-8"));
  const urls = [...new Set(records.map((r) => r.url))];

  fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log(`Capturing screenshots for ${urls.length} pages...\n`);

  for (const url of urls) {
    const slug = url
      .replace(/https?:\/\//, "")
      .replace(/[^a-zA-Z0-9]/g, "_")
      .substring(0, 80);

    for (const viewport of viewports) {
      const filename = `${slug}_${viewport.name}.png`;
      console.log(`  ${viewport.name} ${url}`);

      const buffer = await captureScreenshot(url, viewport);
      if (buffer) {
        fs.writeFileSync(path.join(OUT_DIR, filename), buffer);
      }

      // Rate-limit: 2s delay between requests
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  console.log(`\nScreenshots saved to: ${OUT_DIR}`);
}

main();
