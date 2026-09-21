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
const waitFor = pkg.reactSnap?.waitFor || 3000;
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
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
});

let success = 0, failed = 0;

for (const route of routes) {
  try {
    const page = await browser.newPage();
    await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle0', timeout: 30000 });
    // Wait for react-helmet-async to apply tags
    await new Promise(r => setTimeout(r, waitFor));
    const html = await page.content();
    await page.close();

    const filePath = route === '/'
      ? join(DIST, 'index.html')
      : join(DIST, route.replace(/^\//, ''), 'index.html');
    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, html, 'utf-8');
    success++;
    if (success % 20 === 0 || success === routes.length) {
      console.log(`[prerender] ${success}/${routes.length} done...`);
    }
  } catch (e) {
    console.warn(`[prerender] ⚠️  Error at ${route}: ${e.message}`);
    failed++;
  }
}

await browser.close();
preview.kill();
console.log(`[prerender] ✅ Complete: ${success} succeeded, ${failed} failed out of ${routes.length} routes`);
