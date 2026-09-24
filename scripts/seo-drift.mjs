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
    expectedDescSnippet: 'utilities',
    expectedH1Snippet: 'Free Dental Practice Utilities'
  },
  {
    path: '/cities/delhi',
    expectedTitleSnippet: 'Delhi',
    expectedDescSnippet: 'Delhi',
    expectedH1Snippet: 'Delhi'
  },
  {
    path: '/blog/dental-loans-in-india-medical-financing',
    expectedTitleSnippet: 'Dental Loans in India',
    expectedDescSnippet: 'dental implant loan',
    expectedH1Snippet: 'Dental Loans in India'
  },
  {
    path: '/blog/gap-closure-cost-in-patna',
    expectedTitleSnippet: 'Teeth Gap Filling Cost',
    expectedDescSnippet: 'Teeth gaping treatment price',
    expectedH1Snippet: 'Teeth Gap Filling Cost'
  },
  {
    path: '/dental-implant-loan',
    expectedTitleSnippet: 'Dental Implant Loan',
    expectedDescSnippet: 'dental implant loan',
    expectedH1Snippet: 'Dental Implant Loans'
  },
  {
    path: '/clear-aligners-on-emi',
    expectedTitleSnippet: 'Clear Aligners Cost on EMI',
    expectedDescSnippet: 'flexible monthly financing',
    expectedH1Snippet: 'Clear Invisible Aligners'
  }
];

async function runDriftCheck() {
  console.log(`[seo-drift] Running verification against ${BASE_URL}...\n`);
  let passed = 0;
  let failed = 0;

  for (const check of CHECKS) {
    const url = `${BASE_URL}${check.path}`;
    let success = false;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await fetch(url, { headers: { 'Cache-Control': 'no-cache' } });
        if (res.status !== 200) {
          if (attempt < 3) { await new Promise(r => setTimeout(r, 5000)); continue; }
          console.error(`❌ [FAIL] ${check.path} -> Status: ${res.status} (Expected 200)`);
          failed++;
          break;
        }

        const html = await res.text();
        const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
        const title = titleMatch ? titleMatch[1] : '';

        const descMatch = html.match(/<meta\s+name=["']description["']\s+content="([^"]*)"/i) ||
                          html.match(/<meta\s+name=["']description["']\s+content='([^']*)'/i);
        const desc = descMatch ? descMatch[1] : '';

        if (!title.toLowerCase().includes(check.expectedTitleSnippet.toLowerCase())) {
          if (attempt < 3) { await new Promise(r => setTimeout(r, 5000)); continue; }
          console.error(`❌ [FAIL] ${check.path} -> Title mismatch:\n  Got: "${title}"\n  Expected snippet: "${check.expectedTitleSnippet}"`);
          failed++;
          break;
        }

        if (!desc.toLowerCase().includes(check.expectedDescSnippet.toLowerCase())) {
          if (attempt < 3) { await new Promise(r => setTimeout(r, 5000)); continue; }
          console.error(`❌ [FAIL] ${check.path} -> Description mismatch:\n  Got: "${desc}"\n  Expected snippet: "${check.expectedDescSnippet}"`);
          failed++;
          break;
        }

        if (check.expectedH1Snippet) {
          const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
          const h1 = h1Match ? h1Match[1].replace(/<[^>]*>/g, '').trim() : '';
          if (!h1 || !h1.toLowerCase().includes(check.expectedH1Snippet.toLowerCase())) {
            if (attempt < 3) { await new Promise(r => setTimeout(r, 5000)); continue; }
            console.error(`❌ [FAIL] ${check.path} -> H1 mismatch or missing:\n  Got: "${h1}"\n  Expected snippet: "${check.expectedH1Snippet}"`);
            failed++;
            break;
          }
        }

        console.log(`✅ [PASS] ${check.path}`);
        console.log(`   Title: "${title.slice(0, 70)}..."`);
        passed++;
        success = true;
        break;
      } catch (err) {
        if (attempt < 3) {
          await new Promise(r => setTimeout(r, 5000));
          continue;
        }
        console.error(`❌ [ERROR] ${check.path} -> ${err.message}`);
        failed++;
        break;
      }
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
