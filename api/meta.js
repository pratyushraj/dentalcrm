import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let metaMap = {};
try {
  const metaMapPath = path.join(__dirname, 'meta-map.json');
  metaMap = JSON.parse(fs.readFileSync(metaMapPath, 'utf8'));
} catch (e) {
  console.error('Error loading meta-map.json', e);
}

const STATIC_ROUTES = {
  '/': {
    title: 'Clinaza — Healthcare EMIs & Free Dental CRM India',
    desc: 'Offer instant point-of-care patient EMI financing (₹30K–₹5L) with 13 Live RBI-regulated NBFCs. Plus, 100% Free Dental Clinic CRM & WhatsApp recall software.',
    h1: 'Dental Treatment on EMI. Zero Patient Drop-Offs.'
  },
  '/tools': {
    title: 'Free Dental Tools & Loan Calculator | Clinaza',
    desc: 'Free dental clinic utilities: digital prescription maker, treatment EMI calculator, consent forms, and clinic setup financing guides with instant approval.',
    h1: 'Free Dental Practice Utilities & Cost Calculators'
  },
  '/rx': {
    title: 'Free Digital Dental Prescription Generator | Clinaza',
    desc: 'Generate professional digital dental prescriptions instantly. Free clinical EMR tool for dentists in India.',
    h1: 'Free Digital Dental Prescription Generator'
  },
  '/calculator': {
    title: 'Dental Treatment EMI & Clinic Loan Calculator | Clinaza',
    desc: 'Calculate patient treatment monthly EMIs and dental clinic equipment loan repayments instantly.',
    h1: 'Dental Treatment EMI & Clinic Setup Loan Calculator'
  },
  '/blog': {
    title: 'Patient Guides: Dental & Medical Treatment Costs | Clinaza',
    desc: 'Expert guides on dental clinic financing, treatment costs, digital marketing, and patient acquisition in India.',
    h1: 'Medical & Dental Guides, Treatment Costs & EMI Plans'
  },
  '/dental-implant-loan': {
    title: 'Dental Implant Loan & EMI in India (From ₹2,400/mo)',
    desc: 'Get a dental implant loan in India. Finance single tooth, multiple implants & All-on-4 with flexible monthly EMI from ~11.5% p.a. 2-min digital approval.',
    h1: 'Dental Implant Loans & Flexible Monthly EMIs in India'
  },
  '/clear-aligners-on-emi': {
    title: 'Clear Aligners Cost on EMI India (From ₹2,600/mo)',
    desc: 'Compare Invisalign, Flash & Toothsi alternatives with flexible monthly financing from ~11.5% p.a. 2-min digital approval across partner clinics.',
    h1: 'Clear Invisible Aligners on Flexible Monthly EMI in India'
  },
  '/deck': {
    title: 'Clinaza Strategic Healthcare Financing & Partnership Deck',
    desc: 'Explore Clinaza’s healthcare point-of-care patient financing network, NBFC underwriting architecture, and partner clinic distribution model.',
    h1: 'Clinaza Healthcare Financing & Strategic Partnership Overview'
  },
  '/demo/loan': {
    title: 'Clinaza Patient Healthcare Financing & Instant EMI Demo',
    desc: 'Experience Clinaza’s seamless point-of-care patient financing journey with 2-minute digital KYC, zero CIBIL impact, and flexible monthly tenures.',
    h1: 'Interactive Patient EMI & Healthcare Financing Demo Sandbox'
  },
  '/review/assist': {
    title: 'Review Assistant | Clinaza',
    desc: 'Automated Google review helper and patient feedback generator for Clinaza partner clinics.',
    h1: 'Clinic Review & Patient Feedback Assistant',
    robots: 'noindex, nofollow'
  },
  '/clinic-onboarding': {
    title: 'Partner Clinic Onboarding — Clinaza Point-of-Care EMI',
    desc: 'Official partner clinic onboarding portal to activate instant point-of-care patient EMI financing.',
    h1: 'Partner Clinic Onboarding & Point-of-Care EMI Activation',
    image: 'https://www.clinaza.in/og-clinic-onboarding.png'
  },
  '/pilot-onboarding': {
    title: 'Partner Clinic Onboarding — Clinaza Point-of-Care EMI',
    desc: 'Official partner clinic onboarding portal to activate instant point-of-care patient EMI financing.',
    h1: 'Partner Clinic Onboarding & Point-of-Care EMI Activation',
    image: 'https://www.clinaza.in/og-clinic-onboarding.png'
  }
};

export default async function handler(req, res) {
  const url = new URL(req.url, `https://${req.headers.host || 'www.clinaza.in'}`);
  let pathname = url.pathname.replace(/\/$/, '') || '/';
  if (req.query && req.query.path) {
    pathname = '/' + req.query.path.replace(/^\//, '');
  }

  const meta = STATIC_ROUTES[pathname] || metaMap[pathname];

  let html = '';
  const indexPath = path.join(process.cwd(), 'dist', 'index.html');
  if (fs.existsSync(indexPath)) {
    html = fs.readFileSync(indexPath, 'utf8');
  } else {
    try {
      const host = req.headers['x-forwarded-host'] || req.headers.host || 'www.clinaza.in';
      const proto = req.headers['x-forwarded-proto'] || 'https';
      const r = await fetch(`${proto}://${host}/index.html`);
      html = await r.text();
    } catch (err) {
      return res.status(500).send('Error loading base page');
    }
  }

  if (meta) {
    html = html.replace(/<title>[^<]*<\/title>/i, `<title>${meta.title}</title>`);
    html = html.replace(/<meta\s+name=["']description["']\s+content=["'][\s\S]*?["']\s*\/?>/i, `<meta name="description" content="${meta.desc.replace(/"/g, '&quot;')}" />`);
    html = html.replace(/<meta\s+property=["']og:title["']\s+content=["'][\s\S]*?["']\s*\/?>/i, `<meta property="og:title" content="${meta.title.replace(/"/g, '&quot;')}" />`);
    html = html.replace(/<meta\s+property=["']twitter:title["']\s+content=["'][\s\S]*?["']\s*\/?>/i, `<meta property="twitter:title" content="${meta.title.replace(/"/g, '&quot;')}" />`);
    html = html.replace(/<meta\s+property=["']og:description["']\s+content=["'][\s\S]*?["']\s*\/?>/i, `<meta property="og:description" content="${meta.desc.replace(/"/g, '&quot;')}" />`);
    const ogImage = meta.image || 'https://www.clinaza.in/og-clinaza.png';
    html = html.replace(/<meta\s+property=["']og:image["']\s+content=["'][\s\S]*?["']\s*\/?>/i, `<meta property="og:image" content="${ogImage}" />`);
    html = html.replace(/<meta\s+property=["']twitter:image["']\s+content=["'][\s\S]*?["']\s*\/?>/i, `<meta property="twitter:image" content="${ogImage}" />`);
    if (meta.robots) {
      html = html.replace(/<meta\s+name=["']robots["']\s+content=["'][\s\S]*?["']\s*\/?>/i, `<meta name="robots" content="${meta.robots}" />`);
    }
    const canonical = `https://www.clinaza.in${pathname === '/' ? '' : pathname}`;
    if (html.includes('rel="canonical"')) {
      html = html.replace(/<link\s+rel=["']canonical["']\s+href=["'][^"']*["']/i, `<link rel="canonical" href="${canonical}"`);
    }

    const h1Text = meta.h1 || meta.title.split('|')[0].trim();
    const isBlog = pathname.startsWith('/blog/');
    const isCity = pathname.startsWith('/cities/');

    const ssrContent = `
    <div style="max-width:1200px;margin:0 auto;padding:24px 16px;font-family:system-ui,-apple-system,sans-serif;color:#1e293b;">
      <header style="margin-bottom:20px;">
        <nav aria-label="Breadcrumb" style="font-size:0.875rem;color:#64748b;margin-bottom:12px;">
          <a href="/" style="color:#0867E8;text-decoration:none;">Home</a> &gt; 
          <a href="${isBlog ? '/blog' : isCity ? '/#cities' : '/'}" style="color:#0867E8;text-decoration:none;">${isBlog ? 'Guides' : isCity ? 'Cities' : 'Services'}</a> &gt; 
          <span>${h1Text}</span>
        </nav>
        <h1 style="font-size:2.25rem;font-weight:800;color:#0B2450;line-height:1.2;margin-bottom:14px;">${h1Text}</h1>
      </header>

      <section style="font-size:1.05rem;line-height:1.7;color:#334155;margin-bottom:28px;">
        <p style="margin-bottom:16px;font-weight:500;">${meta.desc}</p>
        <p style="margin-bottom:16px;">
          Clinaza is India's leading healthcare patient financing and embedded medical loan network. We empower patients to access essential and elective dental, orthodontic, implant, and aesthetic treatments through convenient monthly payment options starting from ~11.5% p.a. via RBI-regulated NBFC partners with transparent tenures from 3 to 24 months.
        </p>
        <div style="background-color:#f8fafc;border-left:4px solid #0867E8;padding:16px;border-radius:6px;margin:20px 0;">
          <h2 style="font-size:1.15rem;font-weight:700;color:#0B2450;margin-top:0;margin-bottom:8px;">Transparent Patient Financing Highlights</h2>
          <ul style="margin:0;padding-left:20px;line-height:1.6;">
            <li>Pre-approved credit limits ranging from ₹30,000 to ₹5,00,000 based on digital KYC.</li>
            <li>Instant 2-minute paperless verification with zero CIBIL impact during eligibility checks.</li>
            <li>Point-of-care clinic disbursals directly to healthcare providers, eliminating financial stress.</li>
            <li>Wide coverage across major metros and Tier-2/Tier-3 cities throughout India.</li>
          </ul>
        </div>
      </section>

      <section style="margin-top:32px;padding-top:20px;border-top:1px solid #e2e8f0;">
        <h2 style="font-size:1.35rem;font-weight:700;color:#0B2450;margin-bottom:14px;">Frequently Asked Questions</h2>
        <div style="margin-bottom:16px;">
          <h3 style="font-size:1rem;font-weight:600;color:#0f172a;margin-bottom:4px;">How does dental and medical treatment financing work?</h3>
          <p style="font-size:0.95rem;color:#475569;margin:0;">Eligible patients can apply online or directly at partnered clinics. Once approved by RBI-regulated lending institutions, treatment costs are disbursed directly to the clinic, and patients repay in comfortable monthly EMIs.</p>
        </div>
        <div style="margin-bottom:16px;">
          <h3 style="font-size:1rem;font-weight:600;color:#0f172a;margin-bottom:4px;">What treatments qualify for monthly EMI plans?</h3>
          <p style="font-size:0.95rem;color:#475569;margin:0;">High-ticket dental and healthcare procedures including single and full-mouth dental implants (All-on-4 / All-on-6), invisible clear aligners, orthodontic braces, root canal treatments with zirconia crowns, cosmetic smile makeovers, LASIK eye surgeries, and hair transplants.</p>
        </div>
      </section>

      <nav aria-label="Explore Clinaza Network" style="margin-top:32px;padding-top:20px;border-top:1px solid #cbd5e1;display:flex;gap:16px;flex-wrap:wrap;font-size:0.95rem;">
        <a href="/" style="color:#0867E8;text-decoration:none;font-weight:600;">Home</a>
        <a href="/dental-implant-loan" style="color:#0867E8;text-decoration:none;font-weight:600;">Dental Implant Loan</a>
        <a href="/clear-aligners-on-emi" style="color:#0867E8;text-decoration:none;font-weight:600;">Clear Aligners on EMI</a>
        <a href="/tools" style="color:#0867E8;text-decoration:none;font-weight:600;">Free Clinic Tools</a>
        <a href="/blog" style="color:#0867E8;text-decoration:none;font-weight:600;">Dental &amp; Health Guides</a>
        <a href="/cities/delhi" style="color:#0867E8;text-decoration:none;font-weight:600;">Delhi Clinics</a>
        <a href="/cities/mumbai" style="color:#0867E8;text-decoration:none;font-weight:600;">Mumbai Clinics</a>
        <a href="/cities/bengaluru" style="color:#0867E8;text-decoration:none;font-weight:600;">Bengaluru Clinics</a>
      </nav>
    </div>`;

    const userAgent = req.headers['user-agent'] || '';
    const isBot = /bot|googlebot|crawler|spider|robot|crawling|whatsapp|facebookexternalhit|meta-externalagent|twitterbot|linkedinbot|slackbot|telegrambot|applebot|bingbot|yandex|duckduckbot|baiduspider/i.test(userAgent);

    if (isBot) {
      if (html.includes('<div id="root"></div>')) {
        html = html.replace('<div id="root"></div>', `<div id="root">${ssrContent}</div>`);
      } else if (html.includes('<div id="root">')) {
        html = html.replace(/<div id="root">[\s\S]*?<\/div>/, `<div id="root">${ssrContent}</div>`);
      }
    }
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  return res.status(200).send(html);
}
