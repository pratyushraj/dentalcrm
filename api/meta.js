import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  CLINIC_PREVIEW_ROBOTS,
  clinicLinkPreview,
  readClinicPreviewIdentity,
} from '../src/lib/clinicLinkPreview.js';

const origin = 'https://www.clinaza.in';
const routes = new Map([
  ['checkout', { path: '/checkout-flow', kind: 'checkout' }],
  ['demo', { path: '/demo/loan', kind: 'checkout', canonical: '/checkout-flow' }],
  ['kyc', { path: '/clinic-kyc', kind: 'kyc' }],
  ['underwriting', { path: '/partner/underwriting', kind: 'underwriting' }],
]);

// Public display identities used by existing dossier share links.
const hearOne = { clinic: 'HEAR ONE', doctor: 'Dr. Angiras Vishnu', city: 'Kakkanad, Ernakulam, Kerala' };
const knownClinics = new Map([
  ['vasantha-dental', { clinic: 'Vasantha Dental Clinic & Implant Center', doctor: 'Dr. V Siddardha Chaitanya', city: 'Visakhapatnam, Andhra Pradesh' }],
  ['hear-one', hearOne],
  ['c1b4ab14-e0a4-4a60-9a86-ebedc9616675', hearOne],
  ['nitya-dental', { clinic: 'Nitya Dental & Cosmetic Clinic', doctor: 'Dr. Bhanu Prakash Singh', city: 'Bhopal, Madhya Pradesh' }],
  ['exldentist-clinic', { clinic: 'Exldentist Clinic', doctor: 'Dr. Priyanka Kumar', city: 'Gurugram, Haryana' }],
  ['impressions-dental', { clinic: 'Impressions Dental Clinic', doctor: 'Dr. Dushyant Soni', city: 'Jodhpur, Rajasthan' }],
  ['amitha-dental', { clinic: 'Dr. Amitha Family Dental Care', doctor: 'Dr. Amitha G', city: 'Bengaluru, Karnataka' }],
  ['krishna-dental', { clinic: 'Krishna Dental Clinic', doctor: 'Dr. Saravan Kumar Vemula', city: 'Chilakaluripet, Guntur, Andhra Pradesh' }],
  ['elara-ivf', { clinic: 'Elara IVF', doctor: 'Gajendra Singh Chouhan', city: 'Jodhpur, Rajasthan' }],
]);

const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escapeHtml = (value) => value.replace(/[&<>"']/g, (character) => entities[character]);

async function loadShell(req) {
  try {
    return await readFile(join(process.cwd(), 'dist', '_app.html'), 'utf8');
  } catch (error) {
    // Vercel may stage the static build and function in separate builders.
    if (error.code !== 'ENOENT') throw error;
    const requestedHost = req.headers.host?.toLowerCase();
    const deploymentHosts = [process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL]
      .filter((value) => /^[a-z0-9-]+\.vercel\.app$/i.test(value ?? ''))
      .map((value) => value.toLowerCase());
    const productionHost = new URL(origin).host;
    const knownHosts = [...deploymentHosts, productionHost];
    const sameHost = knownHosts.includes(requestedHost);
    const host = sameHost ? requestedHost : deploymentHosts[0];
    if (!host) throw error;

    // A protected preview needs its existing authentication cookie on the same origin.
    const cookie = sameHost && typeof req.headers.cookie === 'string' ? req.headers.cookie : '';
    const response = await fetch(`https://${host}/_app`, {
      headers: cookie ? { cookie } : undefined,
      redirect: 'error',
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok || !response.headers.get('content-type')?.includes('text/html')) {
      throw new Error('The deployment app shell is unavailable');
    }
    return response.text();
  }
}

function renderHead(shell, meta, canonical, previewUrl) {
  const managed = /\b(?:name|property)\s*=\s*(["'])(?:description|robots|og:(?:title|description|image|url)|twitter:(?:title|description|image|url))\1/i;
  const metaTag = (attribute, name, value) =>
    `<meta data-rh="true" ${attribute}="${name}" content="${escapeHtml(value)}">`;
  const tags = [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<link data-rh="true" rel="canonical" href="${escapeHtml(canonical)}">`,
    metaTag('name', 'description', meta.description),
    metaTag('name', 'robots', CLINIC_PREVIEW_ROBOTS),
    ...Object.entries({ title: meta.title, description: meta.description, image: meta.image, url: previewUrl })
      .flatMap(([name, value]) => [metaTag('property', `og:${name}`, value), metaTag('name', `twitter:${name}`, value)]),
  ].join('\n');

  return shell.replace(/<head\b[^>]*>[\s\S]*?<\/head>/i, (head) => head
    .replace(/<title\b[^>]*>[\s\S]*?<\/title>/gi, '')
    .replace(/<meta\b[^>]*>/gi, (tag) => managed.test(tag) ? '' : tag)
    .replace(/<link\b[^>]*>/gi, (tag) => /\brel\s*=\s*(["'])canonical\1/i.test(tag) ? '' : tag)
    .replace(/<\/head>/i, () => `${tags}\n</head>`));
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Robots-Tag', CLINIC_PREVIEW_ROBOTS);
  res.setHeader('Referrer-Policy', 'no-referrer');

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).end();
  }

  const url = new URL(req.url, origin);
  const pathname = url.pathname.replace(/\/$/, '');
  const route = [...routes.values()].find((entry) => entry.path === pathname)
    ?? (pathname === '/api/meta' ? routes.get(req.query?.preview ?? url.searchParams.get('preview')) : undefined);
  if (!route) return res.status(404).end();

  const clinicRef = url.searchParams.get('clinic')?.trim().toLowerCase();
  const identity = knownClinics.get(clinicRef) ?? readClinicPreviewIdentity(url.searchParams);
  const meta = clinicLinkPreview(route.kind, identity);
  const canonical = new URL(route.canonical ?? route.path, origin).href;
  const previewUrl = new URL(route.path, origin);
  if (identity.clinic) {
    previewUrl.searchParams.set('clinic', identity.clinic);
    if (identity.doctor) previewUrl.searchParams.set('doctor', identity.doctor);
    if (identity.city) previewUrl.searchParams.set('city', identity.city);
  }

  try {
    const shell = await loadShell(req);
    if (!/<div\b[^>]*\bid=["']root["']/i.test(shell) || !/<\/head>/i.test(shell)) {
      throw new Error('The deployment app shell is invalid');
    }
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    if (req.method === 'HEAD') return res.status(200).end();
    return res.status(200).send(renderHead(shell, meta, canonical, previewUrl.href));
  } catch (error) {
    console.error('Clinic preview app shell unavailable:', error.message);
    return res.status(503).send('Clinaza link preview is temporarily unavailable.');
  }
}
