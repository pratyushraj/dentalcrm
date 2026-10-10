import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

async function generateHomepageOG() {
  const executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const browser = await puppeteer.launch({
    executablePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 });

  // Read assets
  const payuSvgRaw = fs.readFileSync(path.join(process.cwd(), 'public/assets/payu_logo.svg'), 'utf8');
  // Strip xml header from svg if present
  const payuSvg = payuSvgRaw.replace(/<\?xml[\s\S]*?\?>/i, '').trim();

  const flexPngBase64 = fs.readFileSync(path.join(process.cwd(), 'public/assets/flexmoney_logo.png')).toString('base64');
  const clinazaJpgBase64 = fs.readFileSync(path.join(process.cwd(), 'public/assets/clinaza-logo.jpg')).toString('base64');

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
      background: linear-gradient(135deg, #020716 0%, #081d45 45%, #051430 100%);
      font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
      color: #ffffff;
      padding: 44px 54px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
    }
    .bg-circle-1 {
      position: absolute;
      width: 520px;
      height: 520px;
      right: -100px;
      top: -120px;
      background: radial-gradient(circle, rgba(8, 103, 232, 0.32) 0%, rgba(8, 103, 232, 0) 70%);
      pointer-events: none;
    }
    .bg-circle-2 {
      position: absolute;
      width: 480px;
      height: 480px;
      left: -80px;
      bottom: -140px;
      background: radial-gradient(circle, rgba(0, 173, 125, 0.22) 0%, rgba(0, 173, 125, 0) 70%);
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
    .brand-logo-img {
      width: 54px;
      height: 54px;
      border-radius: 15px;
      border: 1.5px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 10px 25px rgba(8, 103, 232, 0.45);
      object-fit: cover;
    }
    .brand-text {
      display: flex;
      flex-direction: column;
    }
    .brand-name {
      font-size: 27px;
      font-weight: 900;
      letter-spacing: -0.02em;
      color: #ffffff;
      line-height: 1.1;
    }
    .brand-sub {
      font-size: 11.5px;
      color: #94a3b8;
      font-weight: 700;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      margin-top: 2px;
    }
    .top-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(8, 103, 232, 0.18);
      border: 1px solid rgba(56, 189, 248, 0.35);
      color: #38bdf8;
      padding: 8px 18px;
      border-radius: 999px;
      font-size: 12.5px;
      font-weight: 800;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .badge-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 10px #10b981;
    }
    .main-content {
      position: relative;
      z-index: 10;
      margin-top: 6px;
    }
    .category-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #38bdf8;
      margin-bottom: 8px;
      background: rgba(56, 189, 248, 0.1);
      border: 1px solid rgba(56, 189, 248, 0.2);
      padding: 4px 12px;
      border-radius: 6px;
    }
    .headline {
      font-size: 42px;
      font-weight: 900;
      line-height: 1.15;
      letter-spacing: -0.03em;
      color: #ffffff;
      max-width: 1040px;
      margin-bottom: 10px;
    }
    .headline span {
      background: linear-gradient(90deg, #38bdf8 0%, #60a5fa 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .desc {
      font-size: 17px;
      color: #94a3b8;
      font-weight: 500;
      max-width: 980px;
      line-height: 1.45;
      margin-bottom: 18px;
    }
    .desc strong {
      color: #f1f5f9;
      font-weight: 700;
    }
    /* Partner Card */
    .partner-card {
      background: rgba(15, 23, 42, 0.82);
      border: 1.5px solid rgba(56, 189, 248, 0.32);
      backdrop-filter: blur(14px);
      border-radius: 20px;
      padding: 16px 24px;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
    }
    .partner-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
      padding-bottom: 10px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .partner-title-group {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .partner-title {
      font-size: 11.5px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #94a3b8;
    }
    .partner-subtag {
      font-size: 11px;
      font-weight: 700;
      color: #10b981;
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.25);
      padding: 3px 10px;
      border-radius: 999px;
      letter-spacing: 0.04em;
    }
    .partner-logos-row {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .logo-box {
      background: #ffffff;
      border-radius: 16px;
      padding: 11px 18px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 7px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.22);
      width: 250px;
      height: 86px;
      flex-shrink: 0;
    }
    .payu-svg-container {
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .payu-svg-container svg {
      height: 32px;
      width: auto;
    }
    .flex-img-container {
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .flex-img {
      height: 27px;
      width: auto;
      object-fit: contain;
    }
    .logo-badge-payu {
      font-size: 10px;
      font-weight: 800;
      color: #0284c7;
      background: #f0f9ff;
      border: 1px solid #bae6fd;
      padding: 2.5px 10px;
      border-radius: 6px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      white-space: nowrap;
    }
    .logo-badge-flex {
      font-size: 10px;
      font-weight: 800;
      color: #059669;
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
      padding: 2.5px 10px;
      border-radius: 6px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      white-space: nowrap;
    }
    .plus-badge {
      color: #94a3b8;
      font-size: 26px;
      font-weight: 900;
    }
    .partner-perks {
      display: flex;
      flex-direction: column;
      gap: 7px;
      margin-left: auto;
      padding-left: 20px;
      border-left: 1px solid rgba(255, 255, 255, 0.1);
    }
    .perk-item {
      display: flex;
      align-items: center;
      gap: 9px;
    }
    .perk-check {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: rgba(16, 185, 129, 0.2);
      color: #10b981;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 900;
      flex-shrink: 0;
    }
    .perk-text {
      font-size: 12.5px;
      font-weight: 700;
      color: #f1f5f9;
      letter-spacing: -0.01em;
    }
    /* Footer */
    .footer-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 16px;
      position: relative;
      z-index: 10;
    }
    .chips {
      display: flex;
      gap: 12px;
    }
    .chip {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      padding: 6px 14px;
      border-radius: 9px;
      font-size: 12px;
      font-weight: 700;
      color: #cbd5e1;
    }
    .watermark {
      font-size: 15px;
      font-weight: 800;
      color: #38bdf8;
      letter-spacing: 0.02em;
    }
  </style>
</head>
<body>
  <div class="bg-circle-1"></div>
  <div class="bg-circle-2"></div>

  <!-- Top Bar -->
  <div class="top-bar">
    <div class="brand">
      <img src="data:image/jpeg;base64,${clinazaJpgBase64}" alt="Clinaza" class="brand-logo-img" />
      <div class="brand-text">
        <span class="brand-name">CLINAZA</span>
        <span class="brand-sub">Healthcare Patient Financing & Free Dental CRM</span>
      </div>
    </div>
    <div class="top-badge">
      <span class="badge-dot"></span>
      <span>Front-Desk Patient EMIs Live</span>
    </div>
  </div>

  <!-- Main Content -->
  <div class="main-content">
    <div class="category-tag">
      <span>⚡ Instant Patient Financing &bull; ₹30,000 – ₹5,00,000</span>
    </div>
    <h1 class="headline">
      Treatment on Flexible Monthly EMI. <span>Zero Patient Drop-Offs.</span>
    </h1>
    <p class="desc">
      Convert dental, IVF & aesthetic consultations instantly. <strong>Direct clinic bank payout</strong> on sanction, zero credit risk for doctors, and <strong>100% Free Clinic CRM</strong> with automated WhatsApp recalls.
    </p>

    <!-- Partner Card with PayU and Flexmoney Logos -->
    <div class="partner-card">
      <div class="partner-header">
        <div class="partner-title-group">
          <span>🤝</span>
          <span class="partner-title">OFFICIAL CARDLESS EMI &amp; AFFORDABILITY PARTNERS</span>
        </div>
        <span class="partner-subtag">🛡️ RBI-Regulated Lender Network</span>
      </div>
      <div class="partner-logos-row">
        <!-- PayU Card -->
        <div class="logo-box">
          <div class="payu-svg-container">
            ${payuSvg}
          </div>
          <span class="logo-badge-payu">PayU &bull; Cardless &amp; Debit EMI</span>
        </div>

        <span class="plus-badge">+</span>

        <!-- Flexmoney Card -->
        <div class="logo-box">
          <div class="flex-img-container">
            <img src="data:image/png;base64,${flexPngBase64}" alt="Flexmoney" class="flex-img" />
          </div>
          <span class="logo-badge-flex">InstaCred &bull; Cardless Credit</span>
        </div>

        <!-- Benefits on the right -->
        <div class="partner-perks">
          <div class="perk-item">
            <span class="perk-check">✓</span>
            <span class="perk-text">No Credit Card Needed (Aadhaar / Mobile OTP)</span>
          </div>
          <div class="perk-item">
            <span class="perk-check">✓</span>
            <span class="perk-text">Direct Payout to Clinic Current Account</span>
          </div>
          <div class="perk-item">
            <span class="perk-check">✓</span>
            <span class="perk-text">Zero Non-Payment Liability for Clinic</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer-bar">
    <div class="chips">
      <span class="chip">⚡ 60-Sec Paperless Approval</span>
      <span class="chip">🏦 T+1 Clinic Settlement</span>
      <span class="chip">🦷 100% Free Dental CRM &amp; Recalls</span>
    </div>
    <div class="watermark">www.clinaza.in</div>
  </div>
</body>
</html>`;

  await page.setContent(html, { waitUntil: 'networkidle0' });

  const ogPreviewPath = path.join(process.cwd(), 'public', 'og-preview.png');
  const ogClinazaPath = path.join(process.cwd(), 'public', 'og-clinaza.png');

  // Write both public/og-preview.png and public/og-clinaza.png
  await page.screenshot({ path: ogPreviewPath, type: 'png' });
  await page.screenshot({ path: ogClinazaPath, type: 'png' });

  // Also write to dist/ if dist exists
  const distDir = path.join(process.cwd(), 'dist');
  if (fs.existsSync(distDir)) {
    fs.copyFileSync(ogPreviewPath, path.join(distDir, 'og-preview.png'));
    fs.copyFileSync(ogClinazaPath, path.join(distDir, 'og-clinaza.png'));
  }

  await browser.close();
  console.log('Successfully generated updated OG preview images:');
  console.log(' - ' + ogPreviewPath);
  console.log(' - ' + ogClinazaPath);
}

generateHomepageOG().catch(console.error);
