#!/usr/bin/env node

/**
 * Process crawl output into site-data.json for the React clone
 *
 * Usage:
 *   npm run process
 *
 * Reads crawl-output/ and produces clone/src/data/site-data.json
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "..");
const CRAWL_DIR = path.join(ROOT, "crawl-output");
const JSON_DIR = path.join(CRAWL_DIR, "json");
const RESULTS_PATH = path.join(CRAWL_DIR, "crawl-results.json");
const OUTPUT_PATH = path.join(ROOT, "clone", "src", "data", "site-data.json");

if (!fs.existsSync(RESULTS_PATH)) {
  console.error("crawl-output/crawl-results.json not found. Run crawl first.");
  process.exit(1);
}

// ─── HTML parsing helpers (basic regex extraction) ──────────────────────────────

function extractTag(html, tag) {
  const match = html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return match ? match[1].trim() : "";
}

function extractMeta(html, name) {
  const match = html.match(
    new RegExp(`<meta[^>]*(?:name|property)=["']${name}["'][^>]*content=["']([^"']*)["']`, "i")
  );
  return match ? match[1] : "";
}

function extractHeadings(html) {
  const headings = [];
  const re = /<(h[1-6])[^>]*>([\s\S]*?)<\/\1>/gi;
  let m;
  while ((m = re.exec(html))) {
    headings.push({ level: parseInt(m[1][1]), text: m[2].replace(/<[^>]+>/g, "").trim() });
  }
  return headings;
}

function extractLinks(html) {
  const links = [];
  const re = /<a[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html))) {
    links.push({ url: m[1], text: m[2].replace(/<[^>]+>/g, "").trim() });
  }
  return links;
}

function extractImages(html) {
  const images = [];
  const re = /<img[^>]*src=["']([^"']*)["'][^>]*/gi;
  let m;
  while ((m = re.exec(html))) {
    const altMatch = m[0].match(/alt=["']([^"']*)/i);
    images.push({ src: m[1], alt: altMatch ? altMatch[1] : "" });
  }
  return images;
}

function classifyPage(url) {
  const p = new URL(url).pathname;
  if (p === "/" || p === "") return "landing";
  if (p.includes("login")) return "login";
  if (p.includes("signup") || p.includes("register")) return "signup";
  if (p.includes("pricing")) return "pricing";
  if (p.includes("about")) return "about";
  return "other";
}

// ─── Main processing ───────────────────────────────────────────────────────────

function main() {
  const records = JSON.parse(fs.readFileSync(RESULTS_PATH, "utf-8"));
  const hasJsonDir = fs.existsSync(JSON_DIR);

  // Load JSON extraction files if available
  const jsonFiles = {};
  if (hasJsonDir) {
    for (const file of fs.readdirSync(JSON_DIR)) {
      if (file.endsWith(".json")) {
        try {
          jsonFiles[file] = JSON.parse(fs.readFileSync(path.join(JSON_DIR, file), "utf-8"));
        } catch {
          // skip malformed JSON
        }
      }
    }
    console.log(`Found ${Object.keys(jsonFiles).length} JSON extraction files`);
  }

  const pages = records.map((record, i) => {
    const slug = record.url
      .replace(/https?:\/\//, "")
      .replace(/[^a-zA-Z0-9]/g, "_")
      .substring(0, 80);

    // Try JSON extraction first
    const jsonKey = `${i}_${slug}.json`;
    const extracted = jsonFiles[jsonKey] || null;

    // Fall back to HTML parsing
    const html = record.html || "";
    const page = {
      url: record.url,
      path: new URL(record.url).pathname || "/",
      type: classifyPage(record.url),
      title: record.metadata?.title || extractTag(html, "title"),
      description: record.metadata?.description || extractMeta(html, "description"),
      headings: extractHeadings(html),
      links: extractLinks(html),
      images: extractImages(html),
    };

    if (extracted) {
      // Merge AI-extracted structure
      page.navigation = extracted.navigation || [];
      page.hero = extracted.hero || {};
      page.features = extracted.features || [];
      page.testimonials = extracted.testimonials || [];
      page.pricing = extracted.pricing || [];
      page.cta_banners = extracted.cta_banners || [];
      page.footer = extracted.footer || [];
      page.colors = extracted.colors || [];
      page.extractedImages = extracted.images || [];
    }

    return page;
  });

  // Build global data from the landing page (or first page)
  const landing = pages.find((p) => p.type === "landing") || pages[0];
  const siteData = {
    pages,
    global: {
      navigation: landing?.navigation || [],
      footer: landing?.footer || [],
      brand: {
        name: "Synthesis Tutor",
        domain: "tutor.synthesis.com",
        colors: landing?.colors || [],
      },
    },
  };

  // Ensure output directory exists
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(siteData, null, 2));

  console.log(`\nGenerated ${OUTPUT_PATH}`);
  console.log(`  ${pages.length} pages processed`);
  console.log(`  ${hasJsonDir ? "With" : "Without"} AI JSON extraction data`);
}

main();
