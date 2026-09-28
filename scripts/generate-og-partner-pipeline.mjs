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

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800;900&family=JetBrains+Mono:wght@700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 1200px;
      height: 630px;
      background: linear-gradient(135deg, #030a1a 0%, #061838 50%, #082252 100%);
      font-family: 'Plus Jakarta Sans', sans-serif;
      color: #ffffff;
      padding: 56px 68px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
    }
    .bg-circle-1 {
      position: absolute;
      width: 500px;
      height: 500px;
      right: -100px;
      top: -100px;
      background: radial-gradient(circle, rgba(8, 103, 232, 0.25) 0%, rgba(8, 103, 232, 0) 70%);
      pointer-events: none;
    }
    .bg-circle-2 {
      position: absolute;
      width: 400px;
      height: 400px;
      left: 10%;
      bottom: -150px;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0) 70%);
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
    .brand-icon {
      width: 54px;
      height: 54px;
      background: #0867E8;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      font-weight: 900;
      color: #ffffff;
      box-shadow: 0 10px 25px rgba(8, 103, 232, 0.4);
    }
    .brand-text {
      display: flex;
      flex-direction: column;
    }
    .brand-name {
      font-size: 26px;
      font-weight: 900;
      letter-spacing: -0.02em;
      color: #ffffff;
    }
    .brand-sub {
      font-size: 13px;
      color: #94a3b8;
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(8, 103, 232, 0.18);
      border: 1px solid rgba(56, 189, 248, 0.35);
      color: #38bdf8;
      padding: 8px 18px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .main-content {
      position: relative;
      z-index: 10;
      margin-top: 10px;
    }
    .headline {
      font-size: 52px;
      font-weight: 900;
      line-height: 1.15;
      letter-spacing: -0.03em;
      color: #ffffff;
      max-width: 950px;
      margin-bottom: 14px;
    }
    .headline span {
      background: linear-gradient(90deg, #38bdf8 0%, #60a5fa 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .desc {
      font-size: 20px;
      color: #94a3b8;
      font-weight: 500;
      max-width: 860px;
      line-height: 1.5;
    }
    .stats-row {
      display: flex;
      gap: 20px;
      position: relative;
      z-index: 10;
      margin-top: 24px;
    }
    .stat-card {
      background: rgba(15, 23, 42, 0.75);
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(12px);
      padding: 18px 24px;
      border-radius: 18px;
      flex: 1;
    }
    .stat-label {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #94a3b8;
      margin-bottom: 6px;
    }
    .stat-value {
      font-size: 26px;
      font-weight: 900;
      color: #ffffff;
      letter-spacing: -0.02em;
    }
    .stat-sub {
      font-size: 12px;
      font-weight: 600;
      color: #10b981;
      margin-top: 4px;
    }
    .footer-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 18px;
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
      border-radius: 10px;
      font-size: 12px;
      font-weight: 700;
      color: #cbd5e1;
    }
    .watermark {
      font-size: 13px;
      font-weight: 700;
      color: #64748b;
      letter-spacing: 0.05em;
    }
  </style>
</head>
<body>
  <div class="bg-circle-1"></div>
  <div class="bg-circle-2"></div>

  <div class="top-bar">
    <div class="brand">
      <div class="brand-icon">C</div>
      <div class="brand-text">
        <span class="brand-name">CLINAZA</span>
        <span class="brand-sub">Healthcare Financing Network</span>
      </div>
    </div>
    <div class="badge">
      🛡️ Verified Lender Pipeline
    </div>
  </div>

  <div class="main-content">
    <h1 class="headline">
      Pre-Qualified Dental Merchant Network <span>(Point-of-Care EMI)</span>
    </h1>
    <p class="desc">
      Live merchant pipeline of accredited dental surgeries across Tier 1 & 2 hubs with verified current accounts and high-ticket procedure volume.
    </p>

    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-label">Accredited Clinics</div>
        <div class="stat-value">14 Surgeries</div>
        <div class="stat-sub">100% Verified Footfall</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Current Account KYC</div>
        <div class="stat-value">14 / 14 Ready</div>
        <div class="stat-sub">Direct Disbursals Ready</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Monthly Loan Demand</div>
        <div class="stat-value">₹55L – ₹80L</div>
        <div class="stat-sub">Avg Ticket ₹40K–₹1L</div>
      </div>
    </div>
  </div>

  <div class="footer-bar">
    <div class="chips">
      <span class="chip">🔒 Protected Masked Identifiers</span>
      <span class="chip">📄 KYC Proofs On File</span>
      <span class="chip">⚡ 100% Upfront Settlement</span>
    </div>
    <div class="watermark">clinaza.in/partner-pipeline</div>
  </div>
</body>
</html>`;

  await page.setContent(html, { waitUntil: 'networkidle0' });
  
  const outputPathPng = path.join(process.cwd(), 'public', 'og-partner-pipeline.png');
  const outputPathJpg = path.join(process.cwd(), 'public', 'og-partner-pipeline.jpg');

  await page.screenshot({ path: outputPathPng, type: 'png' });
  await page.screenshot({ path: outputPathJpg, type: 'jpeg', quality: 90 });

  await browser.close();
  console.log('Successfully generated OG preview images at:');
  console.log(' - ' + outputPathPng);
  console.log(' - ' + outputPathJpg);
}

generateOG().catch(console.error);
