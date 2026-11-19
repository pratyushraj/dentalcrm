import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

async function generateOG() {
  const executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const browser = await puppeteer.launch({
    executablePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 });

  const clinazaLogoPath = path.join(process.cwd(), 'public', 'assets', 'clinaza-logo.jpg');
  const pluralLogoPath = path.join(process.cwd(), 'public', 'assets', 'plural_by_pinelabs_transparent.png');

  const clinazaLogoBase64 = fs.existsSync(clinazaLogoPath)
    ? `data:image/jpeg;base64,${fs.readFileSync(clinazaLogoPath).toString('base64')}`
    : '';
  const pluralLogoBase64 = fs.existsSync(pluralLogoPath)
    ? `data:image/png;base64,${fs.readFileSync(pluralLogoPath).toString('base64')}`
    : '';

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=JetBrains+Mono:wght@700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 1200px;
      height: 630px;
      background: linear-gradient(135deg, #0B132B 0%, #101B3B 50%, #0D234A 100%);
      font-family: 'Plus Jakarta Sans', sans-serif;
      color: #ffffff;
      padding: 56px 64px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
    }
    .bg-circle-1 {
      position: absolute;
      width: 550px;
      height: 550px;
      right: -120px;
      top: -120px;
      background: radial-gradient(circle, rgba(8, 103, 232, 0.28) 0%, rgba(8, 103, 232, 0) 70%);
      pointer-events: none;
    }
    .bg-circle-2 {
      position: absolute;
      width: 450px;
      height: 450px;
      left: -80px;
      bottom: -120px;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.20) 0%, rgba(16, 185, 129, 0) 70%);
      pointer-events: none;
    }
    .top-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      z-index: 10;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .brand-logo {
      width: 54px;
      height: 54px;
      border-radius: 14px;
      object-fit: cover;
      border: 1.5px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
    }
    .brand-text {
      display: flex;
      flex-direction: column;
    }
    .brand-name {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .brand-title {
      font-size: 24px;
      font-weight: 900;
      letter-spacing: 0.08em;
      color: #ffffff;
    }
    .brand-tag {
      font-size: 11px;
      font-weight: 800;
      background: rgba(8, 103, 232, 0.25);
      border: 1px solid rgba(8, 103, 232, 0.6);
      color: #60a5fa;
      padding: 3px 8px;
      border-radius: 6px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .brand-sub {
      font-size: 11.5px;
      color: #94a3b8;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      margin-top: 2px;
    }
    .partner-pill {
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.15);
      padding: 10px 18px;
      border-radius: 14px;
      backdrop-filter: blur(10px);
    }
    .partner-label {
      font-size: 11px;
      font-weight: 800;
      color: #94a3b8;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .partner-logo {
      height: 22px;
      width: auto;
      object-fit: contain;
    }

    .main-body {
      position: relative;
      z-index: 10;
      margin: 28px 0;
    }
    .category-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.35);
      color: #34d399;
      padding: 6px 14px;
      border-radius: 100px;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 16px;
    }
    .pulse-dot {
      width: 7px;
      height: 7px;
      background: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 10px #10b981;
    }
    .hero-title {
      font-size: 46px;
      font-weight: 900;
      letter-spacing: -0.025em;
      line-height: 1.15;
      color: #ffffff;
      margin-bottom: 12px;
    }
    .hero-title span {
      background: linear-gradient(135deg, #60a5fa 0%, #38bdf8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero-subtitle {
      font-size: 17px;
      color: #94a3b8;
      font-weight: 500;
      line-height: 1.45;
      max-width: 860px;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      position: relative;
      z-index: 10;
    }
    .feature-card {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 16px 18px;
      backdrop-filter: blur(8px);
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .feature-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      font-weight: 800;
      color: #f1f5f9;
    }
    .feature-icon {
      font-size: 15px;
    }
    .feature-desc {
      font-size: 12px;
      color: #94a3b8;
      font-weight: 500;
      line-height: 1.4;
    }

    .footer-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 18px;
      font-size: 12px;
      color: #64748b;
      position: relative;
      z-index: 10;
    }
    .footer-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .footer-item {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #cbd5e1;
      font-weight: 600;
    }
    .footer-url {
      font-family: 'JetBrains Mono', monospace;
      color: #38bdf8;
      font-weight: 700;
      font-size: 12.5px;
      letter-spacing: -0.01em;
    }
  </style>
</head>
<body>
  <div class="bg-circle-1"></div>
  <div class="bg-circle-2"></div>

  <div class="top-bar">
    <div class="brand">
      <img src="${clinazaLogoBase64}" class="brand-logo" alt="Clinaza" />
      <div class="brand-text">
        <div class="brand-name">
          <span class="brand-title">CLINAZA</span>
          <span class="brand-tag">HealthPay</span>
        </div>
        <span class="brand-sub">Sub-Merchant Aggregator</span>
      </div>
    </div>

    <div class="partner-pill">
      <span class="partner-label">Gateway:</span>
      <img src="${pluralLogoBase64}" class="partner-logo" alt="Plural by Pine Labs" />
    </div>
  </div>

  <div class="main-body">
    <div class="category-badge">
      <span class="pulse-dot"></span>
      <span>Pine Labs Sub-Merchant Desk &bull; Institutional Partnership</span>
    </div>
    <h1 class="hero-title">
      Sub-Merchant Underwriting &amp;<br/>
      <span>T+1 Direct Payout Desk</span>
    </h1>
    <p class="hero-subtitle">
      Verify doctor KYC, cancelled cheques, and auto-generate Pine Labs Sub-Merchant MAF Excel packages for instant terminal MID activation under our locked ₹0 Setup / ₹0 AMC agreement.
    </p>
  </div>

  <div class="features-grid">
    <div class="feature-card">
      <div class="feature-header">
        <span class="feature-icon">📄</span>
        <span>Doctor Signing Dossier</span>
      </div>
      <p class="feature-desc">Official 5-page MAF sheets + Doctor PAN &amp; Aadhaar self-attestation package.</p>
    </div>

    <div class="feature-card">
      <div class="feature-header">
        <span class="feature-icon">📊</span>
        <span>Auto-Filled MAF Excel</span>
      </div>
      <p class="feature-desc">Pre-filled Sub-Merchant MAF, BO, and PEP declaration sheets ready for risk review.</p>
    </div>

    <div class="feature-card">
      <div class="feature-header">
        <span class="feature-icon">🏦</span>
        <span>T+1 Nodal Settlement</span>
      </div>
      <p class="feature-desc">Wholesale Aggregator UAT MID 111077 &bull; Direct nodal bank credit with zero recourse.</p>
    </div>
  </div>

  <div class="footer-bar">
    <div class="footer-left">
      <div class="footer-item">
        <span>Desk Lead:</span>
        <strong style="color: #ffffff;">Advaita Parmar</strong>
      </div>
      <span>&bull;</span>
      <div class="footer-item">
        <span>Confidential Partner Portal</span>
      </div>
    </div>
    <div class="footer-url">
      clinaza.in/partner/underwriting
    </div>
  </div>
</body>
</html>`;

  await page.setContent(html, { waitUntil: 'networkidle0' });
  const outputPath = path.join(process.cwd(), 'public', 'og-plural-underwriting.png');
  await page.screenshot({ path: outputPath, type: 'png' });
  console.log(`Generated OG Image at ${outputPath}`);

  // Also copy to artifacts directory so user can view it in conversation
  const artifactPath = '/Users/pratyushraj/.gemini/antigravity/brain/3eba0a15-e044-4121-8ed8-62cea45025d2/og-plural-underwriting.png';
  fs.copyFileSync(outputPath, artifactPath);
  console.log(`Copied OG Image to artifact path ${artifactPath}`);

  await browser.close();
}

generateOG().catch(console.error);
