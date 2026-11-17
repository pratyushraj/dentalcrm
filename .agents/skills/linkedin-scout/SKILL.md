---
name: linkedin-scout
description: Scrape, crawl, and extract LinkedIn profiles, activity, experience, and executive contacts for B2B partnerships and clinic outreach. Use when the user wants to crawl a LinkedIn profile, find leads, investigate decision makers on LinkedIn, or extract company data.
metadata:
  internal: true
---

# LinkedIn Scout Skill

This skill provides instructions for crawling, extracting, and analyzing LinkedIn profiles, activity, and company pages using a dual-track strategy:
1. **Authenticated Extraction (via `linkedin-mcp`)**: Deep profile, full work experience, recent posts, and company details.
2. **Zero-Login Public X-Ray (via Google SERP / OpenSEO / Web Tools)**: High-speed, unauthenticated search for profiles and posts without triggering rate limits or session restrictions.

---

## 1. Track A: Authenticated Crawling via `linkedin-mcp`

The environment is configured with `mcp-server-linkedin` (Patchright stealth Chromium browser) in `~/.gemini/antigravity/mcp_config.json`.

### First-Time Session Setup:
Before making automated tool calls, ensure the local session is initialized:
```bash
# Option 1: Interactive Login (Recommended for 100% reliable session)
uvx mcp-server-linkedin@latest --login

# Option 2: Auto-import from existing Chrome session
uvx mcp-server-linkedin@latest --import-from-browser chrome
```
Once saved, the session persists in `~/.linkedin-mcp/profile` and runs fully headless.

### Available MCP Capabilities:
- **`get_profile`**: Extract full biography, current company, experience history, skills, and education.
- **`search_people`**: Search candidates or executives by query, title, company, or location.
- **`get_company`**: Extract company overview, headcount, industry, and specialties.
- **`search_posts` / `get_post`**: Extract user activity, recent posts, and engagement.

---

## 2. Track B: Zero-Login Public X-Ray (Safe Bulk Prospecting)

When looking up profiles in bulk or without logging in, use Google SERP search queries to pull indexed LinkedIn data:

### Doctor & Clinic Owner Discovery:
```text
site:linkedin.com/in ("Dentist" OR "Dental Surgeon" OR "Orthodontist" OR "Implantologist") ("Mumbai" OR "Delhi" OR "Bengaluru") -intitle:jobs
```

### Fintech & Lending Decision Makers:
```text
site:linkedin.com/in ("Pine Labs" OR "Juspay" OR "Easebuzz" OR "Fibe" OR "IDFC FIRST") ("GTM" OR "Lending" OR "Affordability" OR "Credit")
```

### Finding Recent Posts / Mentions:
```text
site:linkedin.com/posts/ "Pine Labs" "Credit Marketplace" OR "Affordability"
```

---

## 3. Extracting and Structuring Output

Always format extracted LinkedIn data into structured JSON or clean Markdown:

```json
{
  "name": "Full Name",
  "headline": "Professional Headline",
  "company": "Current Organization",
  "location": "City, Country",
  "profile_url": "https://www.linkedin.com/in/username",
  "summary": "About section summary",
  "key_experience": [
    {
      "role": "Role Title",
      "company": "Company Name",
      "duration": "Start - End",
      "highlights": ["Key achievements"]
    }
  ],
  "relevance_to_clinaza": "High / Medium / Low — rationale"
}
```

---

## 4. Rate-Limiting & Anti-Detection Rules

1. **Max 15 profile lookups per batch** when using authenticated session.
2. Introduce a 3–5 second delay (`--slow-mo` or script pauses) between profile navigations to avoid triggering LinkedIn security checkpoints.
3. For bulk scanning (>50 profiles), always use **Track B (Public Google X-Ray)** to identify URLs, then scrape only the top 10% highest-value targets via Track A.
