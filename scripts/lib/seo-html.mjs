import { load } from 'cheerio';

export function inspectRenderedPage(html, { route, site = 'https://www.clinaza.in', indexable = true }) {
  const $ = load(html);
  const errors = [];
  const title = $('title').text().trim();
  const descriptions = $('meta[name="description"]');
  const description = descriptions.attr('content')?.trim() || '';
  const canonicals = $('link[rel="canonical"]');
  const canonical = canonicals.attr('href') || '';
  const robots = $('meta[name="robots"]').map((_, node) => $(node).attr('content') || '').get().join(',');
  const h1 = $('#root h1').first().text().replace(/\s+/g, ' ').trim();
  const content = $('#root').clone();
  content.find('script, style, noscript').remove();
  const wordCount = content.text().trim().split(/\s+/).filter(Boolean).length;

  if (!title || $('title').length !== 1) errors.push('expected one non-empty title');
  if (descriptions.length !== 1 || !description) errors.push('expected one non-empty meta description');
  if (canonicals.length !== 1 || canonical !== site + route) errors.push(`expected canonical ${site + route}`);
  if (!h1) errors.push('missing rendered main heading');
  if (!$('#root a[href]').length) errors.push('missing rendered navigation links');
  if ($('#clinaza-app-shell').length || (indexable && wordCount < 40)) errors.push('served an app shell instead of page content');
  const noindex = /(?:^|[,\s])(?:noindex|none)(?:$|[,\s])/i.test(robots);
  if (indexable && noindex) errors.push('public page contains noindex');
  if (!indexable && !noindex) errors.push('non-indexable page is missing noindex');
  if (indexable && /(?:^|[,\s])nosnippet(?:$|[,\s])/i.test(robots)) errors.push('public page disables snippets');
  $('script[type="application/ld+json"]').each((_, node) => {
    try { JSON.parse($(node).text()); } catch { errors.push('invalid JSON-LD'); }
  });
  return { errors, title, description, canonical, h1, wordCount };
}

export function assertRenderedPage(html, options) {
  const result = inspectRenderedPage(html, options);
  if (result.errors.length) throw new Error(`${options.route}: ${result.errors.join('; ')}`);
  return result;
}
