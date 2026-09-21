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
    title: 'Clinaza — Patient Financing, Healthcare EMIs & Free Dental CRM India',
    desc: "Don't let treatment cost stop your patients. Clinaza enables dental clinics and hospitals to offer flexible EMI financing (₹30K–₹3L) through bank/NBFC partners.",
    h1: 'Dental Treatment on EMI. Zero Patient Drop-Offs.'
  },
  '/tools': {
    title: 'Free Dental Tools, Rx Generator & Clinic Setup Loan Calculator | Clinaza',
    desc: 'Free dental clinic management utilities: digital prescription maker, loan EMI calculator, consent forms, and clinic setup financing guides.',
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
    title: 'Dental Practice Growth & Patient Financing Blog | Clinaza',
    desc: 'Expert guides on dental clinic financing, treatment costs, digital marketing, and patient acquisition in India.',
    h1: 'Medical & Dental Guides, Treatment Costs & EMI Plans'
  },
  '/dental-implant-loan': {
    title: 'Dental Implant Loan & EMI in India (From ₹2,400/mo) | Clinaza',
    desc: 'Looking for a dental implant loan in India? Finance single tooth, multiple implants & All-on-4 full mouth surgery with 2-minute digital approval from ~11.5% p.a.',
    h1: 'Dental Implant Loans & Flexible Monthly EMIs in India'
  },
  '/clear-aligners-on-emi': {
    title: 'Clear Aligners Cost on EMI in India (From ₹2,600/mo) | Clinaza',
    desc: 'Looking for clear aligners on EMI in India? Compare Invisalign, Flash & Toothsi alternatives with flexible monthly financing from ~11.5% p.a. 2-min approval.',
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
    html = html.replace(/<meta\s+property=["']twitter:description["']\s+content=["'][\s\S]*?["']\s*\/?>/i, `<meta property="twitter:description" content="${meta.desc.replace(/"/g, '&quot;')}" />`);
    const canonical = `https://www.clinaza.in${pathname === '/' ? '' : pathname}`;
    if (html.includes('rel="canonical"')) {
      html = html.replace(/<link\s+rel=["']canonical["']\s+href=["'][^"']*["']/i, `<link rel="canonical" href="${canonical}"`);
    }

    const h1Text = meta.h1 || meta.title.split('|')[0].trim();
    const ssrContent = `
    <div style="max-width:1200px;margin:0 auto;padding:24px 16px;font-family:system-ui,-apple-system,sans-serif;">
      <header>
        <h1 style="font-size:2rem;font-weight:800;color:#0B2450;margin-bottom:12px;">${h1Text}</h1>
      </header>
      <p style="font-size:1.1rem;line-height:1.6;color:#334155;margin-bottom:24px;">${meta.desc}</p>
      <nav aria-label="Essential Links" style="margin-top:20px;padding-top:16px;border-top:1px solid #e2e8f0;display:flex;gap:16px;flex-wrap:wrap;">
        <a href="/" style="color:#0867E8;text-decoration:none;font-weight:600;">Home</a>
        <a href="/dental-implant-loan" style="color:#0867E8;text-decoration:none;font-weight:600;">Dental Implant Loan</a>
        <a href="/clear-aligners-on-emi" style="color:#0867E8;text-decoration:none;font-weight:600;">Clear Aligners on EMI</a>
        <a href="/tools" style="color:#0867E8;text-decoration:none;font-weight:600;">Free Clinic Tools</a>
        <a href="/blog" style="color:#0867E8;text-decoration:none;font-weight:600;">Guides &amp; Articles</a>
      </nav>
    </div>`;

    if (html.includes('<div id="root"></div>')) {
      html = html.replace('<div id="root"></div>', `<div id="root">${ssrContent}</div>`);
    } else if (html.includes('<div id="root">')) {
      html = html.replace(/<div id="root">[\s\S]*?<\/div>/, `<div id="root">${ssrContent}</div>`);
    }
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  return res.status(200).send(html);
}
