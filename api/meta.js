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
    desc: 'Offer instant point-of-care patient EMI financing (₹30K–₹5L) powered by Plural by Pine Labs & multi-bank cardless EMI partners. Plus, 100% Free Dental Clinic CRM software.',
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
    desc: 'Explore Clinaza\\\'s healthcare point-of-care patient financing network, NBFC underwriting architecture, and partner clinic distribution model.',
    h1: 'Clinaza Healthcare Financing & Strategic Partnership Overview'
  },
  '/checkout-flow': {
    title: 'Patient EMI Checkout Flow & Interactive Simulator | Clinaza',
    desc: 'Experience Clinaza\'s 2-minute paperless patient financing checkout: multi-lender approval, 1-click UPI autopay, and T+1 direct clinic settlement.',
    h1: 'Interactive Patient EMI Checkout Flow & Clinic Simulator',
    image: 'https://www.clinaza.in/assets/og-checkout-flow.png'
  },
  '/demo/loan': {
    title: 'Patient EMI Checkout Flow & Interactive Simulator | Clinaza',
    desc: 'Experience Clinaza\'s 2-minute paperless patient financing checkout: multi-lender approval, 1-click UPI autopay, and T+1 direct clinic settlement.',
    h1: 'Interactive Patient EMI Checkout Flow & Clinic Simulator',
    image: 'https://www.clinaza.in/assets/og-checkout-flow.png'
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
  '/clinic-kyc': {
    title: 'Clinic Bank Verification & KYC Portal | Clinaza',
    desc: 'Secure digital bank account verification and merchant underwriting documentation portal for Clinaza partner dental clinics.',
    h1: 'Clinic Bank Verification & Onboarding Documentation',
    robots: 'noindex, nofollow'
  },
  '/clinic-onboarding/kyc': {
    title: 'Clinic Bank Verification & KYC Portal | Clinaza',
    desc: 'Secure digital bank account verification and merchant underwriting documentation portal for Clinaza partner dental clinics.',
    h1: 'Clinic Bank Verification & Onboarding Documentation',
    robots: 'noindex, nofollow'
  },
  '/pilot-onboarding': {
    title: 'Partner Clinic Onboarding — Clinaza Point-of-Care EMI',
    desc: 'Official partner clinic onboarding portal to activate instant point-of-care patient EMI financing.',
    h1: 'Partner Clinic Onboarding & Point-of-Care EMI Activation',
    image: 'https://www.clinaza.in/og-clinic-onboarding.png'
  },
  '/partner-pipeline': {
    title: 'Clinaza Verified Merchant Clinic Network — Partner Pipeline',
    desc: 'Verified partner clinic network accredited for point-of-care patient financing and instant treatment EMI disbursals.',
    h1: 'Pre-Qualified Dental Merchant Network',
    image: 'https://www.clinaza.in/og-partner-pipeline.png',
    robots: 'noindex, nofollow'
  },
  '/clinic-agreement': {
    title: 'Clinic Master Services & Sub-Merchant Agreement | Clinaza',
    desc: 'Standard bilateral agreement governing dental clinic onboarding, sub-merchant MID mapping, point-of-care payment collection, and T+1 patient EMI settlement under RBI guidelines.',
    h1: 'Clinic Master Services & Sub-Merchant Agreement'
  },
  '/sub-merchant-terms': {
    title: 'Clinic Sub-Merchant Agreement | Clinaza',
    desc: 'Standard bilateral agreement governing dental clinic onboarding, sub-merchant MID mapping, point-of-care payment collection, and T+1 patient EMI settlement under RBI guidelines.',
    h1: 'Clinic Master Services & Sub-Merchant Agreement'
  },
  '/sub-merchant-agreement': {
    title: 'Clinic Sub-Merchant Agreement | Clinaza',
    desc: 'Standard bilateral agreement governing dental clinic onboarding, sub-merchant MID mapping, point-of-care payment collection, and T+1 patient EMI settlement under RBI guidelines.',
    h1: 'Clinic Master Services & Sub-Merchant Agreement'
  },
  '/terms': {
    title: 'Terms of Service | Clinaza',
    desc: 'Terms of service and operating conditions for Clinaza healthcare financing platform. Owned and operated by MELLOWPRINTS (GSTIN: 10DXRPR3052Q1ZV, Patna, Bihar).',
    h1: 'Terms of Service & Platform Conditions'
  },
  '/terms-and-conditions': {
    title: 'Terms of Service | Clinaza',
    desc: 'Terms of service and operating conditions for Clinaza healthcare financing platform. Owned and operated by MELLOWPRINTS (GSTIN: 10DXRPR3052Q1ZV, Patna, Bihar).',
    h1: 'Terms of Service & Platform Conditions'
  },
  '/privacy': {
    title: 'Privacy Policy | Clinaza',
    desc: 'Clinaza privacy policy complying with IT Act 2000, DPDPA 2023, and RBI Digital Lending Guidelines. Operated by MELLOWPRINTS.',
    h1: 'Privacy & Data Protection Policy'
  },
  '/privacy-policy': {
    title: 'Privacy Policy | Clinaza',
    desc: 'Clinaza privacy policy complying with IT Act 2000, DPDPA 2023, and RBI Digital Lending Guidelines. Operated by MELLOWPRINTS.',
    h1: 'Privacy & Data Protection Policy'
  },
  '/refund-policy': {
    title: 'Cancellation & Refund Policy | Clinaza',
    desc: 'Clear terms on Clinic Activation Kit cancellations, physical reception standee returns, and refund processing timelines by MELLOWPRINTS.',
    h1: 'Cancellation & Refund Policy'
  },
  '/cancellation-policy': {
    title: 'Cancellation & Refund Policy | Clinaza',
    desc: 'Clear terms on Clinic Activation Kit cancellations, physical reception standee returns, and refund processing timelines by MELLOWPRINTS.',
    h1: 'Cancellation & Refund Policy'
  },
  '/shipping-policy': {
    title: 'Shipping & Delivery Policy | Clinaza',
    desc: 'Fulfillment schedules, courier timelines, and delivery terms for physical clinic welcome kits and digital platform activation.',
    h1: 'Shipping & Delivery Policy'
  },
  '/delivery-policy': {
    title: 'Shipping & Delivery Policy | Clinaza',
    desc: 'Fulfillment schedules, courier timelines, and delivery terms for physical clinic welcome kits and digital platform activation.',
    h1: 'Shipping & Delivery Policy'
  },
  '/contact': {
    title: 'Contact Us & Grievance Officer | Clinaza',
    desc: 'Contact Clinaza (MELLOWPRINTS) at Sharma Sadan, Road No-1, Mahesh Nagar, Patna, Bihar - 800024. Phone: +91 7292984244, Email: contact@clinaza.in. Includes RBI Grievance Officer.',
    h1: 'Contact Us & Regulatory Secretariat'
  },
  '/contact-us': {
    title: 'Contact Us & Grievance Officer | Clinaza',
    desc: 'Contact Clinaza (MELLOWPRINTS) at Sharma Sadan, Road No-1, Mahesh Nagar, Patna, Bihar - 800024. Phone: +91 7292984244, Email: contact@clinaza.in. Includes RBI Grievance Officer.',
    h1: 'Contact Us & Regulatory Secretariat'
  }
};

const CRAWLER_USER_AGENTS = [
  'googlebot',
  'bingbot',
  'yandex',
  'baiduspider',
  'duckduckbot',
  'slurp',
  'twitterbot',
  'facebookexternalhit',
  'linkedinbot',
  'whatsapp',
  'slackbot',
  'telegrambot',
  'pinterest',
  'applebot',
  'semrushbot',
  'ahrefsbot',
  'dotbot',
  'mj12bot',
  'openseo',
  'crawler',
  'spider',
  'robot',
  'crawling',
  'curl',
  'wget',
  'screaming frog',
  'bytespider',
  'seznambot',
  'ia_archiver'
];

function isSearchBot(userAgent) {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return CRAWLER_USER_AGENTS.some(bot => ua.includes(bot));
}

const BRANDED_SHELL = `
    <div id="clinaza-app-shell" style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #ffffff; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px;">
      <div style="width: 52px; height: 52px; border-radius: 14px; background: linear-gradient(135deg, #0867E8 0%, #0B2450 100%); display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 25px -5px rgba(8,103,232,0.35); margin-bottom: 16px;">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
      </div>
      <div style="font-size: 1.15rem; font-weight: 800; letter-spacing: -0.02em; color: #0B2450;">CLINAZA</div>
      <div style="font-size: 0.75rem; font-weight: 600; color: #64748b; letter-spacing: 0.05em; margin-top: 4px; text-transform: uppercase;">Healthcare Financing</div>
      <div style="width: 120px; height: 3px; background: #f1f5f9; border-radius: 99px; margin-top: 16px; overflow: hidden; position: relative;">
        <div style="position: absolute; top: 0; left: 0; bottom: 0; width: 45%; background: #0867E8; border-radius: 99px; animation: clinaza-shimmer 1.2s infinite ease-in-out;"></div>
      </div>
    </div>
    <style>
      @keyframes clinaza-shimmer {
        0% { transform: translateX(-100%); }
        50% { transform: translateX(100%); }
        100% { transform: translateX(250%); }
      }
    </style>`;

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
    html = html.replace(/<meta\s+(?:property|name)=["']og:image["']\s+content=["'][\s\S]*?["']\s*\/?>/gi, `<meta property="og:image" content="${ogImage}" />`);
    html = html.replace(/<meta\s+(?:property|name)=["']twitter:image["']\s+content=["'][\s\S]*?["']\s*\/?>/gi, `<meta property="twitter:image" content="${ogImage}" />`);
    if (meta.robots) {
      html = html.replace(/<meta\s+name=["']robots["']\s+content=["'][\s\S]*?["']\s*\/?>/i, `<meta name="robots" content="${meta.robots}" />`);
    }
    const canonical = `https://www.clinaza.in${pathname === '/' ? '' : pathname}`;
    if (/rel=["']canonical["']/i.test(html)) {
      html = html.replace(/<link\s+rel=["']canonical["']\s+href=["'][^"']*["']/i, `<link rel="canonical" href="${canonical}"`);
    } else {
      html = html.replace(/<\/head>/i, `<link rel="canonical" href="${canonical}" />\n</head>`);
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
    const isBot = isSearchBot(userAgent);

    if (isBot) {
      // For search bots and crawlers: inject semantic SSR text into root so crawlers
      // see H1, description text, and outgoing links immediately.
      if (html.includes('<!--ssr-start-->') && html.includes('<!--ssr-end-->')) {
        html = html.replace(/<!--ssr-start-->[\s\S]*?<!--ssr-end-->/, `<!--ssr-start-->${ssrContent}<!--ssr-end-->`);
      } else if (html.includes('<div id="root"></div>')) {
        html = html.replace('<div id="root"></div>', `<div id="root">${ssrContent}</div>`);
      }
    } else {
      // For real human visitors: deliver clean, branded loading shell to completely eliminate FOUC.
      if (html.includes('<!--ssr-start-->') && html.includes('<!--ssr-end-->')) {
        html = html.replace(/<!--ssr-start-->[\s\S]*?<!--ssr-end-->/, `<!--ssr-start-->${BRANDED_SHELL}<!--ssr-end-->`);
      } else if (html.includes('<div id="root"></div>')) {
        html = html.replace('<div id="root"></div>', `<div id="root">${BRANDED_SHELL}</div>`);
      }
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    return res.status(200).send(html);
  }

  // Route not found in STATIC_ROUTES or metaMap -> Return 404
  html = html.replace(/<title>[^<]*<\/title>/i, `<title>404 Page Not Found | Clinaza</title>`);
  html = html.replace(/<meta\s+name=["']robots["']\s+content=["'][\s\S]*?["']\s*\/?>/i, `<meta name="robots" content="noindex, nofollow" />`);
  const notFoundContent = `
    <div style="max-width:600px;margin:80px auto;padding:24px 16px;text-align:center;font-family:system-ui,-apple-system,sans-serif;color:#1e293b;">
      <h1 style="font-size:2.5rem;font-weight:800;color:#0B2450;margin-bottom:12px;">404 - Page Not Found</h1>
      <p style="font-size:1.05rem;color:#64748b;margin-bottom:24px;">The page you are looking for doesn't exist or has moved.</p>
      <a href="/" style="display:inline-block;padding:12px 24px;background-color:#0867E8;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;">Return Home</a>
    </div>`;
  if (html.includes('<!--ssr-start-->') && html.includes('<!--ssr-end-->')) {
    html = html.replace(/<!--ssr-start-->[\s\S]*?<!--ssr-end-->/, `<!--ssr-start-->${notFoundContent}<!--ssr-end-->`);
  }
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  return res.status(404).send(html);
}
