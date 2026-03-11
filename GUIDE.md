# Cloning tutor.synthesis.com with Cloudflare Browser Rendering /crawl

## Overview

This workflow uses Cloudflare's `/crawl` REST API to spider `tutor.synthesis.com` with a headless browser, extract the rendered HTML and Markdown, and then use that content to build a clone.

Since the Synthesis Tutor site is a JavaScript-rendered SPA (React), a simple HTTP fetch won't capture the actual content — you need a headless browser. That's exactly what Cloudflare's Browser Rendering does.

---

## Prerequisites

### 1. Cloudflare Account

Sign up at [dash.cloudflare.com](https://dash.cloudflare.com) if you don't have one. The free Workers plan gives you limited browser rendering time (10 min/day). A paid Workers plan ($5/mo) gives much more headroom.

### 2. Get Your Account ID

- Log in to the Cloudflare dashboard
- Click any domain (or go to Workers & Pages)
- Your **Account ID** is in the right sidebar on the Overview page
- Copy it

### 3. Create an API Token

- Go to [dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens)
- Click **Create Token**
- Use the **"Edit Cloudflare Workers"** template, OR create a custom token with:
  - **Account** → **Browser Rendering** → **Edit**
  - **Account** → **Workers Scripts** → **Edit**
- Copy the token (you only see it once)

### 4. Install Node.js

Node 18+ is required (for native `fetch`). Check with:

```bash
node --version
```

---

## Quick Start

```bash
# Set your credentials
export CF_ACCOUNT_ID="your_account_id_here"
export CF_API_TOKEN="your_api_token_here"

# Run the crawl
node crawl-synthesis.js
```

The script will:
1. **POST** to start the crawl job
2. **Poll** every 5 seconds until complete
3. **Download** all crawled pages
4. **Save** HTML + Markdown to `./crawl-output/`

---

## What You'll Get

```
crawl-output/
├── crawl-results.json      # Full structured data (URLs, metadata, content)
├── html/
│   ├── 0_tutor_synthesis_com_.html
│   ├── 1_tutor_synthesis_com_login.html
│   └── ...
└── markdown/
    ├── 0_tutor_synthesis_com_.md
    ├── 1_tutor_synthesis_com_login.md
    └── ...
```

---

## Tuning the Crawl

### If the site blocks the crawl

The Synthesis Tutor app may have bot protection. Options:

1. **Check robots.txt first:**
   ```bash
   curl https://tutor.synthesis.com/robots.txt
   ```

2. **Try with a custom user agent:**
   Add to the crawl payload:
   ```json
   "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
   ```
   Note: This won't bypass bot detection, but may change what content is served.

3. **If the app requires login**, you can pass cookies:
   ```json
   "cookies": [
     {
       "name": "session_token",
       "value": "your_session_cookie_value",
       "domain": "tutor.synthesis.com",
       "path": "/"
     }
   ]
   ```

### If you only want specific pages

Use include/exclude patterns:

```json
"options": {
  "includePatterns": [
    "https://tutor.synthesis.com/",
    "https://tutor.synthesis.com/login",
    "https://tutor.synthesis.com/signup"
  ],
  "excludePatterns": [
    "https://tutor.synthesis.com/api/**"
  ]
}
```

### If you want structured data (AI extraction)

Add JSON format with a prompt:

```json
"formats": ["html", "markdown", "json"],
"jsonOptions": {
  "prompt": "Extract the page layout structure: navigation items, hero section text, feature sections, testimonials, pricing tiers, and footer links",
  "response_format": {
    "type": "json_schema",
    "json_schema": {
      "name": "page_structure",
      "properties": {
        "navigation": "array of strings",
        "hero_heading": "string",
        "hero_subheading": "string",
        "features": "array of objects with title and description",
        "testimonials": "array of objects with quote and author",
        "pricing_tiers": "array of objects with name, price, and features",
        "cta_text": "string"
      }
    }
  }
}
```

This uses Workers AI to intelligently extract structured content — very useful for rebuilding the UI.

---

## Alternative: Screenshot + Content Combo

If you also want visual reference, use the `/screenshot` endpoint separately:

```bash
curl -X POST "https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/browser-rendering/screenshot" \
  -H "Authorization: Bearer ${CF_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://tutor.synthesis.com/",
    "screenshotOptions": {
      "fullPage": true,
      "type": "png"
    },
    "gotoOptions": {
      "waitUntil": "networkidle2"
    },
    "viewport": {
      "width": 1440,
      "height": 900
    }
  }' \
  --output synthesis-screenshot.png
```

---

## After the Crawl: Building the Clone

Once you have the crawl output, bring the `crawl-output/` folder back to Claude and say:

> "Here's the crawled HTML and Markdown from tutor.synthesis.com. Build me a React clone with the same layout, sections, and visual style."

Or use the structured JSON extraction to programmatically rebuild sections.

---

## Pricing Notes

- **Free plan**: 10 min browser time/day, crawl limit of 5 pages per job
- **Workers Paid ($5/mo)**: 2 hours browser time/day, up to 100k pages per job
- `render: false` crawls are free during beta (but won't work for JS-rendered SPAs)
- The `/json` format uses Workers AI, which has its own usage-based pricing

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `cancelled_due_to_limits` | Upgrade to Workers Paid, or reduce `limit` |
| All URLs `disallowed` | `robots.txt` is blocking — check the file |
| All URLs `skipped` | Patterns too restrictive — remove them and retry |
| Empty HTML content | App needs auth — pass session cookies |
| Timeout | Increase `gotoOptions.timeout`, add `waitForSelector` |
