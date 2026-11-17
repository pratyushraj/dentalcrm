#!/usr/bin/env node
/**
 * Custom prerender script using puppeteer + system Chrome + vite preview.
 * Snapshots all routes listed in package.json reactSnap.include.
 * Falls back gracefully if Chrome is not found (non-fatal).
 */
import { spawn } from 'child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf-8'));
const routes = pkg.reactSnap?.include || ['/'];

let metaMap = {};
try {
  metaMap = JSON.parse(readFileSync(join(ROOT, 'api', 'meta-map.json'), 'utf-8'));
} catch {}

const cityNames = {};
try {
  const citiesCode = readFileSync(join(ROOT, 'src', 'data', 'cities.ts'), 'utf-8');
  for (const m of citiesCode.matchAll(/{\s*slug:\s*"([^"]+)",\s*name:\s*"([^"]+)"/g)) {
    cityNames[m[1]] = m[2];
  }
} catch {}

// Allow skipping prerender via SKIP_PRERENDER=1 or PRERENDER=0
if (process.env.SKIP_PRERENDER === '1' || process.env.PRERENDER === '0') {
  console.log('[prerender] ⏩ Skipping prerender via environment flag.');
  process.exit(0);
}

const CONCURRENCY = parseInt(process.env.PRERENDER_CONCURRENCY || '4', 10);
const waitFor = Math.min(pkg.reactSnap?.waitFor || 1000, 1200);
const PORT = pkg.reactSnap?.port || 45789;

const chromePaths = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium',
];
const executablePath = chromePaths.find(p => existsSync(p));

if (!executablePath) {
  console.warn('[prerender] ⚠️  No Chrome found — skipping prerender.');
  console.warn('[prerender] SEO tags still work via react-helmet-async on client-side navigation.');
  process.exit(0);
}

console.log(`[prerender] Chrome: ${executablePath}`);
console.log(`[prerender] Concurrency: ${CONCURRENCY} workers | waitFor: ${waitFor}ms`);

// Dynamic import of puppeteer (may be puppeteer or puppeteer-core)
let puppeteer;
try {
  puppeteer = (await import('puppeteer')).default;
} catch {
  try {
    puppeteer = (await import('puppeteer-core')).default;
  } catch {
    console.warn('[prerender] ⚠️  puppeteer not available — skipping prerender.');
    process.exit(0);
  }
}

// Start vite preview server
console.log('[prerender] Starting vite preview server...');
const preview = spawn(
  './node_modules/.bin/vite',
  ['preview', '--port', String(PORT), '--strictPort'],
  { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] }
);

// Wait for preview to be ready
await new Promise((resolve, reject) => {
  const timeout = setTimeout(() => reject(new Error('Server start timeout')), 15000);
  preview.stdout.on('data', (d) => {
    if (d.toString().includes('Local')) { clearTimeout(timeout); resolve(); }
  });
  preview.stderr.on('data', (d) => {
    if (d.toString().includes('Local')) { clearTimeout(timeout); resolve(); }
  });
  preview.on('error', reject);
});

console.log(`[prerender] Server ready at http://localhost:${PORT}`);

const browser = await puppeteer.launch({
  executablePath,
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--disable-extensions',
    '--blink-settings=imagesEnabled=false' // Skip image downloads during static HTML snapshotting for maximum speed
  ],
});

let success = 0, failed = 0;
let queueIndex = 0;

async function worker() {
  const page = await browser.newPage();
  // Block heavy assets (images, fonts, media) to make DOM snapshotting blazing fast
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    const resourceType = req.resourceType();
    if (['image', 'media', 'font'].includes(resourceType)) {
      req.abort();
    } else {
      req.continue();
    }
  });

  while (queueIndex < routes.length) {
    const route = routes[queueIndex++];
    if (!route) break;

    try {
      await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      if (route !== '/') {
        await page.waitForFunction(
          () => document.title && !document.title.startsWith('Clinaza — Point-of-Care'),
          { timeout: 3500 }
        ).catch(() => {});
      } else {
        await page.waitForSelector('#root > *', { timeout: 3500 }).catch(() => {});
      }
      if (waitFor > 0) {
        await new Promise(r => setTimeout(r, waitFor));
      }
      let html = await page.content();
      const pageTitle = await page.title();
      let resolvedTitle = pageTitle;
      if (!resolvedTitle || resolvedTitle.startsWith('Clinaza — Point-of-Care Patient Financing')) {
        const cityMatch = route.match(/^\/cities\/([a-z0-9-]+)/i);
        if (cityMatch) {
          const cSlug = cityMatch[1];
          const cName = cityNames[cSlug] || (cSlug.charAt(0).toUpperCase() + cSlug.slice(1));
          resolvedTitle = cSlug === 'kochi'
            ? 'Braces & Dental Treatment Cost in Kochi (From ₹1,200/mo) | Clinaza'
            : `Best Dental Treatment EMI Plans in ${cName} | Clinaza`;
        } else if (route === '/dental-implant-loan') {
          resolvedTitle = 'Dental Implant Loan & EMI in India (From ₹2,400/mo)';
        } else if (route === '/clear-aligners-on-emi') {
          resolvedTitle = 'Clear Aligners Cost on EMI in India (From ₹2,600/mo)';
        } else if (route === '/checkout-flow' || route === '/demo/loan') {
          resolvedTitle = 'Patient EMI Checkout Flow & Infrastructure Demo | Clinaza';
        } else if (metaMap[route]?.title) {
          resolvedTitle = metaMap[route].title;
        }
      }
      if (resolvedTitle) {
        html = html.replace(/<title>[^<]*<\/title>/i, `<title>${resolvedTitle}</title>`);
      }

      let resolvedDesc = null;
      try {
        const metaDesc = await page.$eval('meta[name="description"]', (el) => el.getAttribute('content'));
        if (metaDesc && !metaDesc.startsWith('Enable instant 2-minute paperless patient')) {
          resolvedDesc = metaDesc;
        }
      } catch {}

      if (!resolvedDesc) {
        const cityMatch = route.match(/^\/cities\/([a-z0-9-]+)/i);
        if (cityMatch) {
          const cSlug = cityMatch[1];
          const cName = cityNames[cSlug] || (cSlug.charAt(0).toUpperCase() + cSlug.slice(1));
          resolvedDesc = cSlug === 'kochi'
            ? 'Compare braces cost in Kochi (₹18K–₹50K) & dental implants on EMI. Explore easy monthly financing (₹30K–₹3L) at top clinics with 2-min instant approval.'
            : `Compare dental costs in ${cName}. Explore easy EMI options (₹30K–₹3L) for dental implants, braces, aligners & RCT at top clinics. Fast 2-min approval.`;
        } else if (route === '/dental-implant-loan') {
          resolvedDesc = 'Get a dental implant loan in India. Finance single tooth, multiple implants & All-on-4 with flexible monthly EMI from ~11.5% p.a. 2-min digital approval.';
        } else if (route === '/clear-aligners-on-emi') {
          resolvedDesc = 'Looking for clear aligners on EMI in India? Compare Invisalign, Flash & Toothsi alternatives with flexible monthly financing from ~11.5% p.a. 2-min approval.';
        } else if (route === '/checkout-flow' || route === '/demo/loan') {
          resolvedDesc = 'Experience Clinaza’s 2-minute paperless patient financing checkout: multi-lender approval, 1-click UPI autopay, and T+1 direct clinic settlement.';
        } else if (metaMap[route]?.desc) {
          resolvedDesc = metaMap[route].desc;
        }
      }

      if (resolvedDesc) {
        html = html.replace(/<meta\s+name=["']description["']\s+content="[^"]*"/i, `<meta name="description" content="${resolvedDesc.replace(/"/g, '&quot;')}"`);
      }

      if (route === '/checkout-flow' || route === '/demo/loan') {
        const ogImg = 'https://www.clinaza.in/assets/og-checkout-flow.png';
        html = html.replace(/<meta\s+property=["']og:image["']\s+content="[^"]*"/i, `<meta property="og:image" content="${ogImg}"`);
        html = html.replace(/<meta\s+property=["']twitter:image["']\s+content="[^"]*"/i, `<meta property="twitter:image" content="${ogImg}"`);
      }

      if (!/rel=["']canonical["']/i.test(html)) {
        const canonicalUrl = `https://www.clinaza.in${route === '/' ? '/' : route.replace(/\/$/, '')}`;
        html = html.replace(/<\/head>/i, `<link rel="canonical" href="${canonicalUrl}" />\n</head>`);
      }

      const filePath = route === '/'
        ? join(DIST, 'index.html')
        : join(DIST, route.replace(/^\//, ''), 'index.html');
      mkdirSync(dirname(filePath), { recursive: true });
      writeFileSync(filePath, html, 'utf-8');
      success++;

      if (success % 25 === 0 || success === routes.length) {
        console.log(`[prerender] ${success}/${routes.length} routes snapshotted...`);
      }
    } catch (e) {
      console.warn(`[prerender] ⚠️  Error at ${route}: ${e.message}`);
      failed++;
    }
  }

  try {
    await page.close();
  } catch {}
}

console.log(`[prerender] Running ${CONCURRENCY} parallel workers across ${routes.length} routes...`);
const startTime = Date.now();
const workers = Array.from({ length: CONCURRENCY }, () => worker());
await Promise.all(workers);

try {
  await browser.close();
} catch {}
try {
  preview.kill();
} catch {}
const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(1);
console.log(`[prerender] ⚡ Finished in ${elapsedSec}s: ${success} succeeded, ${failed} failed out of ${routes.length} routes`);
