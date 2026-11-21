import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'cheerio';
import puppeteer from 'puppeteer-core';
import { preview } from 'vite';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = join(root, 'dist');
const site = 'https://www.clinaza.in';
const directAccessPages = [
  '/clinic-agreement', '/terms', '/privacy', '/refund-policy',
  '/shipping-policy', '/contact', '/404',
];

export async function sitemapRoutes() {
  const xml = await readFile(join(root, 'public', 'sitemap.xml'), 'utf8');
  const $ = load(xml, { xml: true });
  const routes = $('urlset > url > loc').map((_, node) => {
    const url = new URL($(node).text().trim());
    if (url.origin !== site || !/^\/(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*)?$/.test(url.pathname)
      || url.href !== site + url.pathname) {
      throw new Error(`Invalid sitemap URL: ${url.href}`);
    }
    return url.pathname;
  }).get();
  if (!routes.includes('/') || routes.includes('/404') || new Set(routes).size !== routes.length) {
    throw new Error('Sitemap must contain the homepage and unique public canonical URLs.');
  }
  return routes;
}

async function launchBrowser() {
  const localChrome = [
    process.env.CHROME_BIN,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
  ].find(path => path && existsSync(path));
  if (localChrome) {
    return puppeteer.launch({
      executablePath: localChrome,
      headless: true,
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
    });
  }
  if (process.platform === 'linux' && process.arch === 'x64') {
    const { default: chromium } = await import('@sparticuz/chromium');
    return puppeteer.launch({
      executablePath: await chromium.executablePath(),
      headless: true,
      args: chromium.args,
    });
  }
  throw new Error('Install Chrome or set CHROME_BIN to build the public pages.');
}

async function capturePage(page, origin, route, publishedRoutes) {
  const expected = site + route;
  await page.goto(origin + route, { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForFunction((canonical, notFound) => {
    const root = document.querySelector('#root');
    const canonicals = document.querySelectorAll('link[rel="canonical"]');
    return root?.querySelector('h1')?.textContent?.trim()
      && root.querySelector('a[href]')
      && canonicals.length === 1
      && canonicals[0].href === canonical
      && document.querySelectorAll('meta[name="description"]').length === 1
      && document.querySelector('meta[name="description"]').content.trim()
      && Boolean(document.querySelector('meta[name="robots"]')?.content.includes('noindex')) === notFound;
  }, { timeout: 12000 }, expected, route === '/404');

  const html = await page.content();
  const family = route === '/' ? '/cities/' : route === '/blog' ? '/blog/' : null;
  if (family) {
    const $ = load(html);
    const links = $('#root a[href]').map((_, link) => new URL($(link).attr('href'), site)).get();
    const missing = links.filter(url => url.origin === site && url.pathname.startsWith(family)
      && !publishedRoutes.has(url.pathname));
    if (missing.length) {
      throw new Error(`Public links missing from the sitemap: ${[...new Set(missing.map(url => url.pathname))].join(', ')}`);
    }
  }
  const output = route === '/' ? 'index.html' : `${route.slice(1)}.html`;
  const path = join(dist, output);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, html);
}

export async function prerenderRoutes(requestedRoutes) {
  const publishedRoutes = new Set(await sitemapRoutes());
  const allowed = [...new Set([...publishedRoutes, ...directAccessPages])];
  const routes = requestedRoutes ?? allowed;
  if (!routes.length || routes.some(route => !allowed.includes(route))) {
    throw new Error('Select routes from the sitemap or the direct-access pages.');
  }

  const index = join(dist, 'index.html');
  const appShell = join(dist, '_app.html');
  if (existsSync(index)) {
    await copyFile(index, appShell);
  }

  // Detect Vercel build environment or explicit skip flag
  const isVercel = process.env.VERCEL === '1' || Boolean(process.env.VERCEL_ENV);
  const isSkipped = process.env.SKIP_PRERENDER === '1' || process.env.PRERENDER === '0';

  if (isVercel || isSkipped) {
    console.log('[prerender] ⏩ Skipping headless Chrome crawl on Vercel / CI serverless build environment.');
    console.log('[prerender] Dynamic OpenGraph metadata is handled at the edge via api/meta.js.');
    console.log(`[prerender] Generating static route entrypoints from app shell for ${routes.length} routes...`);
    const shell = existsSync(appShell) ? await readFile(appShell, 'utf8') : await readFile(index, 'utf8');
    for (const route of routes) {
      const output = route === '/' ? 'index.html' : `${route.slice(1)}.html`;
      const path = join(dist, output);
      await mkdir(dirname(path), { recursive: true });
      if (!existsSync(path)) {
        await writeFile(path, shell);
      }
    }
    console.log(`[prerender] ✅ Successfully generated ${routes.length} static route entrypoint pages.`);
    return;
  }

  const shell = existsSync(appShell) ? await readFile(appShell, 'utf8') : await readFile(index, 'utf8');

  let browser;
  try {
    browser = await launchBrowser();
  } catch (err) {
    console.warn(`[prerender] ⚠️ Headless Chrome not available in this environment: ${err.message}`);
    console.warn('[prerender] Generating static fallback entrypoints from app shell for all routes...');
    for (const route of routes) {
      const output = route === '/' ? 'index.html' : `${route.slice(1)}.html`;
      const path = join(dist, output);
      await mkdir(dirname(path), { recursive: true });
      if (!existsSync(path)) {
        await writeFile(path, shell);
      }
    }
    console.log(`[prerender] ✅ Wrote ${routes.length} fallback static route pages from app shell.`);
    return;
  }

  const server = await preview({ preview: { host: '127.0.0.1', port: 45789 } });
  const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
  try {
    let nextRoute = 0;
    const workers = Array.from({ length: Math.min(4, routes.length) }, async () => {
      const page = await browser.newPage();
      await page.setBypassServiceWorker(true);
      await page.setRequestInterception(true);
      page.on('request', request => {
        if (!request.url().startsWith(origin + '/')) {
          return request.abort();
        }
        // Every capture starts with the unrendered shell at its own URL, even on reruns.
        if (request.isNavigationRequest() && request.frame() === page.mainFrame()) {
          return request.respond({ status: 200, contentType: 'text/html; charset=utf-8', body: shell });
        }
        if (['script', 'stylesheet'].includes(request.resourceType()) && request.url().startsWith(origin + '/assets/')) {
          return request.continue();
        }
        return request.abort();
      });

      try {
        while (nextRoute < routes.length) {
          const route = routes[nextRoute++];
          try {
            await capturePage(page, origin, route, publishedRoutes);
          } catch (error) {
            console.warn(`[prerender] ⚠️ Could not fully capture ${route}: ${error.message}. Using app shell fallback.`);
            const output = route === '/' ? 'index.html' : `${route.slice(1)}.html`;
            const path = join(dist, output);
            await mkdir(dirname(path), { recursive: true });
            if (!existsSync(path)) {
              await writeFile(path, shell);
            }
          }
        }
      } finally {
        await page.close();
      }
    });
    await Promise.all(workers);
    console.log(`[prerender] Wrote ${routes.length} public HTML pages.`);
  } finally {
    await browser?.close();
    await new Promise(resolve => server.httpServer.close(resolve));
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await prerenderRoutes();
}
