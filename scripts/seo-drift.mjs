#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { assertRenderedPage } from './lib/seo-html.mjs';

const site = 'https://www.clinaza.in';
const source = process.env.SEO_DIST_DIR;
const base = process.env.BASE_URL || site;
const routes = [
  '/', '/about', '/dental-implant-loan', '/clear-aligners-on-emi',
  '/ivf-treatment-on-emi', '/lasik-eye-surgery-on-emi', '/hair-transplant-on-emi',
  '/aesthetic-treatments-on-emi', '/gynecomastia-surgery-on-emi', '/hearing-aids-on-emi',
  '/piles-laser-surgery-on-emi', '/maternity-delivery-on-emi', '/tools', '/cities/delhi',
  '/blog/dental-loans-in-india-medical-financing',
];
let failures = 0;
for (const route of routes) {
  try {
    let html;
    if (source) {
      html = await readFile(join(resolve(source), route === '/' ? 'index.html' : route.slice(1) + '.html'), 'utf8');
    } else {
      const response = await fetch(base + route, {
        signal: AbortSignal.timeout(20000),
        headers: { 'User-Agent': 'Clinaza-SEO-Monitor/2.0', 'Cache-Control': 'no-cache' },
      });
      if (response.status !== 200) throw new Error('HTTP ' + response.status);
      if (/noindex|none/i.test(response.headers.get('x-robots-tag') || '')) throw new Error('X-Robots-Tag prevents indexing');
      html = await response.text();
    }
    const result = assertRenderedPage(html, { route, site });
    console.log('[PASS] ' + route + ' (' + result.wordCount + ' words) - ' + result.title);
  } catch (error) {
    failures++;
    console.error('[FAIL] ' + route + ': ' + error.message);
  }
}
console.log('SEO integrity: ' + (routes.length - failures) + ' passed, ' + failures + ' failed.');
if (failures) process.exitCode = 1;
