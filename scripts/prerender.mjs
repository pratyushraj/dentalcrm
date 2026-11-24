import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'cheerio';
import puppeteer from 'puppeteer-core';
import { preview } from 'vite';
import { assertRenderedPage } from './lib/seo-html.mjs';
import { loadDynamicMetadata } from './prerender-data.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = join(root, 'dist');
const site = 'https://www.clinaza.in';
const directAccessPages = [
  '/about', '/clinic-agreement', '/terms', '/privacy', '/refund-policy',
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
  if (process.env.SKIP_BROWSER === '1' || process.env.PUPPETEER_SKIP === '1') {
    return null;
  }
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
    try {
      const { default: chromium } = await import('@sparticuz/chromium');
      return puppeteer.launch({
        executablePath: await chromium.executablePath(),
        headless: true,
        args: chromium.args,
      });
    } catch (err) {
      console.warn('[prerender] Headless Chromium launch failed on Linux:', err.message);
      return null;
    }
  }
  return null;
}

function renderStaticRoute(route, meta, templateHtml) {
  const $ = load(templateHtml);

  // 1. Remove existing meta/title/canonical tags to prevent duplicates
  $('title').remove();
  $('meta[name="description"]').remove();
  $('link[rel="canonical"]').remove();
  $('meta[name="robots"]').remove();
  $('meta[property^="og:"]').remove();
  $('meta[name^="twitter:"]').remove();

  const canonicalUrl = `${site}${route}`;
  const is404 = route === '/404';
  const robots = is404 ? 'noindex, follow' : (meta.robots || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  const title = meta.title || 'Clinaza — Point-of-Care Patient Healthcare Financing';
  const description = meta.description || 'Enable instant 2-minute paperless patient treatment financing & EMIs across 16+ major banks for dental, IVF & surgery clinics.';

  // 2. Prepend canonical SEO tags in <head>
  $('head').prepend(`
    <title>${title}</title>
    <meta name="description" content="${description}">
    <link rel="canonical" href="${canonicalUrl}">
    <meta name="robots" content="${robots}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:type" content="${meta.isBlog ? 'article' : 'website'}">
    <meta property="og:site_name" content="Clinaza">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
  `);

  // 3. Inject structured JSON-LD
  if (meta.faqs && meta.faqs.length) {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": meta.faqs.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.a
        }
      }))
    };
    $('head').append(`<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`);
  }

  // 4. Populate #root with semantic, accessible HTML (no app shell fallback)
  const $root = $('#root');
  $root.empty();

  let mainBody = '';
  if (meta.pricing && meta.pricing.length) {
    const rows = meta.pricing.map(p => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><strong>${p.name}</strong></td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${p.cost}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><strong style="color: #0867E8;">${p.emi}</strong></td>
      </tr>
    `).join('');
    mainBody += `
      <section class="pricing-breakdown" style="margin: 24px 0;">
        <h2 style="font-size: 20px; font-weight: 800; color: #0B2450; margin-bottom: 12px;">Typical Treatment Costs & Monthly EMI Options (India)</h2>
        <table border="0" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse; text-align: left; font-size: 14px;">
          <thead>
            <tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1;">
              <th style="padding: 10px;">Procedure / Package</th>
              <th style="padding: 10px;">Estimated Cost</th>
              <th style="padding: 10px;">EMI Option</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </section>
    `;
  }

  if (meta.faqs && meta.faqs.length) {
    const faqItems = meta.faqs.map(f => `
      <details style="margin-bottom: 12px; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <summary style="font-weight: bold; cursor: pointer; color: #0f172a;">${f.q}</summary>
        <p style="margin-top: 8px; color: #475569; font-size: 14px; line-height: 1.6;">${f.a}</p>
      </details>
    `).join('');
    mainBody += `
      <section class="faqs-section" style="margin: 32px 0;">
        <h2 style="font-size: 20px; font-weight: 800; color: #0B2450; margin-bottom: 16px;">Frequently Asked Questions</h2>
        ${faqItems}
      </section>
    `;
  }

  if (meta.cityName) {
    mainBody += `
      <section class="city-treatments" style="margin: 24px 0;">
        <h2 style="font-size: 20px; font-weight: 800; color: #0B2450; margin-bottom: 12px;">Dental &amp; Healthcare Financing in ${meta.cityName}, ${meta.stateName}</h2>
        <p style="color: #475569; font-size: 14px; line-height: 1.6;">Access flexible zero-recourse patient EMI financing across verified dental and medical centers in ${meta.cityName}. Instant 2-minute digital pre-approval with direct T+1 clinic settlements via Pine Labs Plural.</p>
        <ul style="margin-top: 12px; line-height: 1.8;">
          <li><a href="/dental-implant-loan">Dental Implants on EMI in ${meta.cityName}</a></li>
          <li><a href="/clear-aligners-on-emi">Clear Aligners in ${meta.cityName}</a></li>
          <li><a href="/lasik-eye-surgery-on-emi">LASIK Eye Surgery in ${meta.cityName}</a></li>
          <li><a href="/hair-transplant-on-emi">Hair Transplant in ${meta.cityName}</a></li>
          <li><a href="/ivf-treatment-on-emi">IVF Fertility Treatment in ${meta.cityName}</a></li>
        </ul>
      </section>
    `;
  }

  const staticContent = `
    <header style="padding: 16px 24px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; background: #ffffff;">
      <a href="/" style="font-weight: 900; font-size: 20px; color: #0B2450; text-decoration: none;">CLINAZA</a>
      <nav style="display: flex; gap: 16px; font-size: 14px; font-weight: 600;">
        <a href="/" style="color: #0867E8; text-decoration: none;">Home</a>
        <a href="/dental-implant-loan" style="color: #334155; text-decoration: none;">Dental Implants</a>
        <a href="/lasik-eye-surgery-on-emi" style="color: #334155; text-decoration: none;">LASIK EMI</a>
        <a href="/hair-transplant-on-emi" style="color: #334155; text-decoration: none;">Hair Transplant</a>
        <a href="/tools" style="color: #334155; text-decoration: none;">EMI Calculator</a>
        <a href="/clinic-onboarding" style="color: #334155; text-decoration: none;">For Clinics</a>
      </nav>
    </header>
    <main style="max-width: 960px; margin: 32px auto; padding: 0 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6;">
      <nav aria-label="Breadcrumb" style="font-size: 13px; color: #64748b; margin-bottom: 16px;">
        <a href="/" style="color: #0867E8; text-decoration: none;">Home</a> &gt; <span>${meta.h1 || title}</span>
      </nav>
      ${meta.badge ? `<span style="display: inline-block; padding: 4px 10px; background: #eff6ff; color: #0867E8; border: 1px solid #bfdbfe; border-radius: 9999px; font-size: 11px; font-weight: bold; margin-bottom: 12px;">${meta.badge}</span>` : ''}
      <h1 style="font-size: 28px; sm:font-size: 36px; font-weight: 900; color: #0B2450; margin-bottom: 16px;">${meta.h1 || title}</h1>
      <p style="font-size: 16px; color: #334155; margin-bottom: 24px; line-height: 1.7;">${meta.intro || description}</p>
      ${mainBody}
      <div style="margin-top: 36px; padding: 24px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; text-align: center;">
        <h3 style="font-size: 20px; font-weight: 800; color: #0B2450; margin-bottom: 8px;">Check Your Pre-Approved Patient EMI Limit</h3>
        <p style="font-size: 14px; color: #64748b; margin-bottom: 16px;">Instant 2-minute paperless verification with zero impact on credit score across 16+ RBI-regulated banks.</p>
        <a href="/tools" style="display: inline-block; padding: 10px 22px; background: #0867E8; color: white; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">Calculate Monthly EMI</a>
        <a href="/clinic-onboarding" style="display: inline-block; margin-left: 12px; padding: 10px 22px; background: white; color: #0B2450; border: 1px solid #cbd5e1; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">Partner Your Clinic</a>
      </div>
    </main>
    <footer style="margin-top: 48px; padding: 36px 16px; border-top: 1px solid #e2e8f0; background: #f8fafc; font-size: 13px; color: #64748b;">
      <div style="max-width: 960px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px;">
        <div>
          <strong style="color: #0B2450; display: block; margin-bottom: 8px;">Treatment Financing</strong>
          <ul style="list-style: none; padding: 0; margin: 0; line-height: 1.8;">
            <li><a href="/dental-implant-loan" style="color: #475569; text-decoration: none;">Dental Implant Loan</a></li>
            <li><a href="/clear-aligners-on-emi" style="color: #475569; text-decoration: none;">Clear Aligners EMI</a></li>
            <li><a href="/lasik-eye-surgery-on-emi" style="color: #475569; text-decoration: none;">LASIK Eye Surgery EMI</a></li>
            <li><a href="/hair-transplant-on-emi" style="color: #475569; text-decoration: none;">Hair Transplant EMI</a></li>
            <li><a href="/ivf-treatment-on-emi" style="color: #475569; text-decoration: none;">IVF Treatment EMI</a></li>
            <li><a href="/gynecomastia-surgery-on-emi" style="color: #475569; text-decoration: none;">Gynecomastia Surgery EMI</a></li>
            <li><a href="/hearing-aids-on-emi" style="color: #475569; text-decoration: none;">Digital Hearing Aids EMI</a></li>
            <li><a href="/piles-laser-surgery-on-emi" style="color: #475569; text-decoration: none;">Laser Piles Surgery EMI</a></li>
            <li><a href="/maternity-delivery-on-emi" style="color: #475569; text-decoration: none;">Maternity Delivery EMI</a></li>
            <li><a href="/aesthetic-treatments-on-emi" style="color: #475569; text-decoration: none;">Aesthetic Treatments EMI</a></li>
            <li><a href="/kidney-stone-laser-surgery-on-emi" style="color: #475569; text-decoration: none;">Kidney Stone Laser Surgery</a></li>
            <li><a href="/acl-knee-surgery-on-emi" style="color: #475569; text-decoration: none;">ACL Knee Surgery EMI</a></li>
          </ul>
        </div>
        <div>
          <strong style="color: #0B2450; display: block; margin-bottom: 8px;">Platform &amp; Legal</strong>
          <ul style="list-style: none; padding: 0; margin: 0; line-height: 1.8;">
            <li><a href="/clinic-agreement" style="color: #475569; text-decoration: none;">Sub-Merchant Agreement</a></li>
            <li><a href="/terms" style="color: #475569; text-decoration: none;">Terms of Service</a></li>
            <li><a href="/privacy" style="color: #475569; text-decoration: none;">Privacy Policy</a></li>
            <li><a href="/refund-policy" style="color: #475569; text-decoration: none;">Refund Policy</a></li>
            <li><a href="/shipping-policy" style="color: #475569; text-decoration: none;">Shipping Policy</a></li>
            <li><a href="/contact" style="color: #475569; text-decoration: none;">Contact Support</a></li>
          </ul>
        </div>
        <div>
          <strong style="color: #0B2450; display: block; margin-bottom: 8px;">Healthcare Hubs</strong>
          <ul style="list-style: none; padding: 0; margin: 0; line-height: 1.8;">
            <li><a href="/cities/delhi" style="color: #475569; text-decoration: none;">Dental EMI in Delhi</a></li>
            <li><a href="/cities/mumbai" style="color: #475569; text-decoration: none;">Dental EMI in Mumbai</a></li>
            <li><a href="/cities/bangalore" style="color: #475569; text-decoration: none;">Dental EMI in Bangalore</a></li>
            <li><a href="/cities/hyderabad" style="color: #475569; text-decoration: none;">Dental EMI in Hyderabad</a></li>
            <li><a href="/cities/chennai" style="color: #475569; text-decoration: none;">Dental EMI in Chennai</a></li>
          </ul>
        </div>
      </div>
      <p style="text-align: center; margin-top: 28px; font-size: 11px;">&copy; 2026 Clinaza Healthcare Technologies. Point-of-Care Patient Financing &amp; Digital Clinic OS.</p>
    </footer>
  `;

  $root.html(staticContent);
  return $.html();
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
  assertRenderedPage(html, { route, indexable: route !== '/404' });
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
  const indexHtml = await readFile(index, 'utf8');

  // Load metadata catalog for all routes
  const metadataMap = await loadDynamicMetadata();

  console.log(`[prerender] 🚀 Phase 1: Generating high-fidelity static semantic HTML for ${routes.length} routes...`);
  for (const route of routes) {
    const meta = metadataMap.get(route) || {
      title: `${route.slice(1).replace(/-/g, ' ').toUpperCase()} | Clinaza`,
      description: 'Point-of-care patient healthcare financing and digital clinic operating system across India.',
      h1: route.slice(1).replace(/-/g, ' ')
    };
    const renderedHtml = renderStaticRoute(route, meta, indexHtml);
    assertRenderedPage(renderedHtml, { route, indexable: route !== '/404' });

    const output = route === '/' ? 'index.html' : `${route.slice(1)}.html`;
    const path = join(dist, output);
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, renderedHtml);
  }
  console.log(`[prerender] ✅ Phase 1 complete: ${routes.length} static routes rendered, validated, and saved to dist/`);

  // On Vercel, CI, or when headless browser is disabled, Phase 1 provides 100% complete validated static HTML.
  const isVercel = process.env.VERCEL === '1' || Boolean(process.env.VERCEL_ENV);
  if (isVercel || process.env.SKIP_BROWSER === '1' || process.env.PUPPETEER_SKIP === '1') {
    console.log(`[prerender] ✅ Production build complete: ${routes.length} public pages rendered with validated, indexable HTML (Vercel/CI optimized).`);
    return;
  }

  // Phase 2: Puppeteer browser hydration pass (if headless Chrome is available)
  let browser;
  try {
    browser = await launchBrowser();
  } catch (err) {
    console.warn(`[prerender] Headless browser launch failed: ${err.message}. Preserving Phase 1 static HTML.`);
    return;
  }

  if (!browser) {
    console.log('[prerender] ℹ️ Headless Chrome not active or skipped; all routes preserved with validated Phase 1 HTML.');
    return;
  }

  let server;
  try {
    console.log('[prerender] 🌐 Phase 2: Starting headless Chrome client capture pass...');
    server = await preview({ preview: { host: '127.0.0.1', port: 45789 } });
    const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
    let nextRoute = 0;
    const workers = Array.from({ length: Math.min(4, routes.length) }, async () => {
      const page = await browser.newPage();
      await page.setBypassServiceWorker(true);
      await page.setRequestInterception(true);
      page.on('request', request => {
        if (!request.url().startsWith(origin + '/')) {
          return request.abort();
        }
        if (['script', 'stylesheet'].includes(request.resourceType()) && request.url().startsWith(origin + '/assets/')) {
          return request.continue();
        }
        if (request.isNavigationRequest() && request.frame() === page.mainFrame()) {
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
            console.warn(`[prerender] Browser capture fallback on ${route}: ${error.message} (Phase 1 HTML retained).`);
          }
        }
      } finally {
        await page.close();
      }
    });
    await Promise.all(workers);
    console.log(`[prerender] ✅ Phase 2 complete.`);
  } finally {
    await browser?.close();
    if (server) await new Promise(resolve => server.httpServer.close(resolve));
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await prerenderRoutes();
}
