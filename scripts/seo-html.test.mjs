import test from 'node:test';
import assert from 'node:assert/strict';
import { inspectRenderedPage } from './lib/seo-html.mjs';

const page = `<html><head><title>Dental Implant Financing | Clinaza</title>
<meta name="description" content="Dental treatment financing options and clinic pricing.">
<meta name="robots" content="index,follow">
<link rel="canonical" href="https://www.clinaza.in/dental-implant-loan"></head>
<body><div id="root"><main><h1>Dental Implant Financing</h1><p>${'Treatment information for patients and clinic owners. '.repeat(12)}</p>
<a href="/about">About Clinaza</a></main></div></body></html>`;
const options = { route: '/dental-implant-loan' };

test('accepts rendered public content and canonical metadata', () => {
  assert.deepEqual(inspectRenderedPage(page, options).errors, []);
});

test('rejects an app shell even when title and canonical appear valid', () => {
  const shell = page.replace(/<main>[\s\S]*?<\/main>/, '<div id="clinaza-app-shell">Loading Clinaza</div>');
  const errors = inspectRenderedPage(shell, options).errors.join(';');
  assert.match(errors, /app shell/);
  assert.match(errors, /heading/);
});

test('rejects initial noindex, duplicate descriptions, and wrong canonicals', () => {
  const broken = page.replace('index,follow', 'noindex,follow')
    .replace('</head>', '<meta name="description" content="Duplicate"></head>')
    .replace('href="https://www.clinaza.in/dental-implant-loan"', 'href="https://www.clinaza.in/"');
  const errors = inspectRenderedPage(broken, options).errors.join(';');
  assert.match(errors, /noindex/);
  assert.match(errors, /description/);
  assert.match(errors, /canonical/);
});

test('requires noindex for a deliberately excluded page', () => {
  assert.match(inspectRenderedPage(page, { ...options, indexable: false }).errors.join(';'), /missing noindex/);
  assert.deepEqual(inspectRenderedPage(page.replace('index,follow', 'noindex,follow'), { ...options, indexable: false }).errors, []);
});

test('rejects malformed structured data and snippet suppression', () => {
  const broken = page.replace('index,follow', 'index,nosnippet')
    .replace('</head>', '<script type="application/ld+json">{broken}</script></head>');
  const errors = inspectRenderedPage(broken, options).errors.join(';');
  assert.match(errors, /JSON-LD/);
  assert.match(errors, /snippets/);
});
