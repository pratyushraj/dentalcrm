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
    desc: "Don't let treatment cost stop your patients. Clinaza enables dental clinics and hospitals to offer flexible EMI financing (₹30K–₹3L) through bank/NBFC partners."
  },
  '/tools': {
    title: 'Free Dental Tools, Rx Generator & Clinic Setup Loan Calculator | Clinaza',
    desc: 'Free dental clinic management utilities: digital prescription maker, loan EMI calculator, consent forms, and clinic setup financing guides.'
  },
  '/rx': {
    title: 'Free Digital Dental Prescription Generator | Clinaza',
    desc: 'Generate professional digital dental prescriptions instantly. Free clinical EMR tool for dentists in India.'
  },
  '/calculator': {
    title: 'Dental Treatment EMI & Clinic Loan Calculator | Clinaza',
    desc: 'Calculate patient treatment monthly EMIs and dental clinic equipment loan repayments instantly.'
  },
  '/blog': {
    title: 'Dental Practice Growth & Patient Financing Blog | Clinaza',
    desc: 'Expert guides on dental clinic financing, treatment costs, digital marketing, and patient acquisition in India.'
  },
  '/dental-implant-loan': {
    title: 'Dental Implant Loan & EMI in India (From ₹2,400/mo) | Clinaza',
    desc: 'Looking for a dental implant loan in India? Finance single tooth, multiple implants & All-on-4 full mouth surgery with 2-minute digital approval from ~11.5% p.a.'
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
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  return res.status(200).send(html);
}
