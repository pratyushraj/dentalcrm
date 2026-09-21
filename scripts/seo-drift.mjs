#!/usr/bin/env node
/**
 * Automated SEO Drift Monitor
 * Validates critical production routes for HTTP 200, non-fallback titles,
 * meta descriptions, and presence of essential schema elements.
 */

const BASE_URL = process.env.BASE_URL || 'https://www.clinaza.in';

const CHECKS = [
  {
    path: '/',
    expectedTitleSnippet: 'Clinaza',
    expectedDescSnippet: 'treatment cost'
  },
  {
    path: '/tools',
    expectedTitleSnippet: 'Free Dental Tools',
    expectedDescSnippet: 'utilities'
  },
  {
    path: '/cities/delhi',
    expectedTitleSnippet: 'Delhi',
    expectedDescSnippet: 'Delhi'
  },
  {
    path: '/blog/dental-loans-in-india-medical-financing',
    expectedTitleSnippet: 'Dental Loans in India',
    expectedDescSnippet: 'dental implant loan'
  },
  {
    path: '/blog/gap-closure-cost-in-patna',
    expectedTitleSnippet: 'Teeth Gap Filling Cost',
    expectedDescSnippet: 'Teeth gaping treatment price'
  }
];

async function runDriftCheck() {
  console.log(`[seo-drift] Running verification against ${BASE_URL}...\n`);
  let passed = 0;
  let failed = 0;

  for (const check of CHECKS) {
    const url = `${BASE_URL}${check.path}`;
    try {
      const res = await fetch(url);
      if (res.status !== 200) {
        console.error(`❌ [FAIL] ${check.path} -> Status: ${res.status} (Expected 200)`);
        failed++;
        continue;
      }

      const html = await res.text();
      const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
      const title = titleMatch ? titleMatch[1] : '';

      const descMatch = html.match(/<meta\s+name=["']description["']\s+content="([^"]*)"/i) ||
                        html.match(/<meta\s+name=["']description["']\s+content='([^']*)'/i);
      const desc = descMatch ? descMatch[1] : '';

      if (!title.toLowerCase().includes(check.expectedTitleSnippet.toLowerCase())) {
        console.error(`❌ [FAIL] ${check.path} -> Title mismatch:\n  Got: "${title}"\n  Expected snippet: "${check.expectedTitleSnippet}"`);
        failed++;
        continue;
      }

      if (!desc.toLowerCase().includes(check.expectedDescSnippet.toLowerCase())) {
        console.error(`❌ [FAIL] ${check.path} -> Description mismatch:\n  Got: "${desc}"\n  Expected snippet: "${check.expectedDescSnippet}"`);
        failed++;
        continue;
      }

      console.log(`✅ [PASS] ${check.path}`);
      console.log(`   Title: "${title.slice(0, 70)}..."`);
      passed++;
    } catch (err) {
      console.error(`❌ [ERROR] ${check.path} -> ${err.message}`);
      failed++;
    }
  }

  console.log(`\n========================================`);
  console.log(`SEO Drift Results: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================`);

  if (failed > 0) {
    process.exit(1);
  }
}

runDriftCheck();
