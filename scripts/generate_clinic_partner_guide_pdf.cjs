const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

function getBase64Image(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath).replace('.', '') || 'png';
      const mime = ext === 'jpg' ? 'jpeg' : ext;
      const data = fs.readFileSync(filePath).toString('base64');
      return `data:image/${mime};base64,${data}`;
    }
  } catch (e) {
    console.error('Error reading image:', filePath, e.message);
  }
  return '';
}

const logoBase64 = getBase64Image(path.join(__dirname, '../public/assets/clinaza-logo.jpg'));
const qrBase64 = getBase64Image(path.join(__dirname, '../public/assets/clinaza_activation_kit_qr.png'));

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Clinaza Clinic Partner Enablement Guide</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

  @page {
    size: A4 portrait;
    margin: 0;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    background: #e2e8f0;
    color: #0f172a;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .page {
    width: 210mm;
    height: 297mm;
    max-height: 297mm;
    background: #ffffff;
    box-sizing: border-box;
    padding: 8mm 10mm 7mm 10mm;
    margin: 0 auto;
    page-break-after: always;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
    position: relative;
  }

  /* Header */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2.5px solid #e2e8f0;
    padding-bottom: 8px;
  }

  .logo-block {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .logo-img {
    width: 46px;
    height: 46px;
    border-radius: 12px;
    object-fit: cover;
    border: 1.5px solid #cbd5e1;
    box-shadow: 0 2px 5px rgba(0,0,0,0.06);
  }

  .logo-text h1 {
    font-size: 24px;
    font-weight: 900;
    letter-spacing: -0.6px;
    color: #0b2450;
    line-height: 1.1;
  }

  .logo-text p {
    font-size: 11px;
    font-weight: 800;
    color: #0867e8;
    letter-spacing: 0.8px;
    text-transform: uppercase;
  }

  .header-badge {
    text-align: right;
  }

  .badge-pill {
    display: inline-block;
    background: #eff6ff;
    border: 1.5px solid #93c5fd;
    color: #1d4ed8;
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    padding: 4px 10px;
    border-radius: 999px;
  }

  .badge-sub {
    font-size: 10px;
    color: #64748b;
    margin-top: 3px;
    font-weight: 700;
  }

  /* Section Title */
  .section-title {
    font-size: 15px;
    font-weight: 900;
    color: #0b2450;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 7px;
  }

  .section-title span.dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #0867e8;
    display: inline-block;
  }

  /* Hero Banner */
  .hero-box {
    background: linear-gradient(135deg, #0b2450 0%, #1e3a8a 100%);
    border-radius: 14px;
    padding: 14px 18px;
    color: #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 14px rgba(11, 36, 80, 0.18);
  }

  .hero-text h2 {
    font-size: 19px;
    font-weight: 900;
    line-height: 1.25;
    margin-bottom: 4px;
  }

  .hero-text p {
    font-size: 12.5px;
    color: #e2e8f0;
    line-height: 1.45;
    max-width: 460px;
    font-weight: 500;
  }

  .hero-stat {
    text-align: right;
    background: rgba(255, 255, 255, 0.12);
    border: 1.5px solid rgba(255, 255, 255, 0.25);
    padding: 10px 14px;
    border-radius: 10px;
    min-width: 150px;
  }

  .hero-stat .num {
    font-size: 26px;
    font-weight: 900;
    color: #38bdf8;
    line-height: 1;
  }

  .hero-stat .lbl {
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: #ffffff;
    margin-top: 3px;
    font-weight: 800;
  }

  /* Script Cards (Stacked Mobile Layout) */
  .script-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .script-card {
    border-radius: 12px;
    padding: 11px 15px;
    font-size: 13px;
    line-height: 1.45;
  }

  .script-bad {
    background: #fef2f2;
    border: 1.5px solid #fecaca;
  }

  .script-good {
    background: #f0fdf4;
    border: 2px solid #86efac;
    box-shadow: 0 2px 8px rgba(34, 197, 94, 0.12);
  }

  .script-header-bad {
    color: #b91c1c;
    font-weight: 900;
    font-size: 11.5px;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .script-header-good {
    color: #15803d;
    font-weight: 900;
    font-size: 11.5px;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .quote-box {
    font-weight: 700;
    color: #0f172a;
    font-size: 13.5px;
    margin-bottom: 4px;
  }

  .result-tag {
    font-size: 12px;
    font-weight: 600;
  }

  /* 3 Clinic Protection Pillars */
  .pillars-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 9px;
  }

  .pillar-box {
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    padding: 10px 12px;
  }

  .pillar-box h4 {
    font-size: 12.5px;
    font-weight: 800;
    color: #0b2450;
    margin-bottom: 3px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .pillar-box p {
    font-size: 11px;
    color: #475569;
    line-height: 1.4;
    font-weight: 500;
  }

  /* 4 Documents Checklist Box */
  .docs-box {
    background: #ffffff;
    border: 2px solid #cbd5e1;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(0,0,0,0.04);
  }

  .docs-header {
    background: #0b2450;
    color: #ffffff;
    padding: 8px 14px;
    font-size: 12px;
    font-weight: 900;
    display: flex;
    justify-content: space-between;
    align-items: center;
    letter-spacing: 0.5px;
  }

  .docs-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 9px;
    padding: 11px 14px;
    background: #f8fafc;
  }

  .doc-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }

  .doc-num {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #0867e8;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 11px;
    shrink: 0;
    margin-top: 2px;
  }

  .doc-info strong {
    color: #0b2450;
    display: block;
    font-size: 12.5px;
    font-weight: 800;
  }

  .doc-info span {
    color: #64748b;
    font-size: 11px;
    font-weight: 600;
  }

  /* Page 2: Commercial Cards */
  .commercial-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .plan-card {
    border-radius: 14px;
    padding: 14px 16px;
    position: relative;
  }

  .plan-software {
    background: #f0fdf4;
    border: 2px solid #86efac;
  }

  .plan-kit {
    background: #eff6ff;
    border: 2.5px solid #0867e8;
    box-shadow: 0 4px 12px rgba(8, 103, 232, 0.12);
  }

  .plan-tag {
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 0.7px;
    text-transform: uppercase;
    display: inline-block;
    padding: 3px 8px;
    border-radius: 6px;
    margin-bottom: 6px;
  }

  .tag-green { background: #dcfce7; color: #15803d; }
  .tag-blue { background: #dbeafe; color: #1d4ed8; }

  .plan-price {
    font-size: 32px;
    font-weight: 900;
    color: #0b2450;
    line-height: 1.05;
    margin-bottom: 4px;
  }

  .plan-sub {
    font-size: 11.5px;
    color: #475569;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .plan-features {
    list-style: none;
    font-size: 11.5px;
    color: #334155;
  }

  .plan-features li {
    display: flex;
    align-items: flex-start;
    gap: 7px;
    margin-bottom: 5px;
    line-height: 1.35;
  }

  .plan-features li strong {
    color: #0f172a;
    font-weight: 800;
  }

  /* MDR Rates Table (Mobile Cleaned) */
  .mdr-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 11px;
    background: #ffffff;
    border-radius: 10px;
    overflow: hidden;
    border: 1.5px solid #cbd5e1;
  }

  .mdr-table th {
    background: #0b2450;
    color: #ffffff;
    padding: 8px 12px;
    text-align: left;
    font-weight: 800;
    font-size: 10.5px;
    text-transform: uppercase;
    letter-spacing: 0.6px;
  }

  .mdr-table td {
    padding: 7px 12px;
    border-bottom: 1px solid #e2e8f0;
    color: #334155;
    font-weight: 600;
  }

  .mdr-table tr:last-child td {
    border-bottom: none;
  }

  .mdr-table tr:nth-child(even) {
    background: #f8fafc;
  }

  .rate-badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 6px;
    font-weight: 900;
    font-size: 11px;
  }

  .rate-green { background: #dcfce7; color: #166534; }
  .rate-blue { background: #dbeafe; color: #1e40af; }
  .rate-purple { background: #f3e8ff; color: #6b21a8; }

  /* Activation Container with Large QR */
  .activation-container {
    background: #f8fafc;
    border: 2.5px dashed #0867e8;
    border-radius: 14px;
    padding: 12px 16px;
    display: flex;
    gap: 18px;
    align-items: center;
  }

  .qr-box {
    background: #ffffff;
    padding: 8px;
    border-radius: 12px;
    border: 1.5px solid #cbd5e1;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 4px 10px rgba(0,0,0,0.08);
    shrink: 0;
  }

  .qr-img {
    width: 140px;
    height: auto;
    display: block;
    border-radius: 6px;
  }

  .qr-label {
    font-size: 9.5px;
    font-weight: 800;
    color: #0b2450;
    margin-top: 5px;
    text-align: center;
  }

  .act-info {
    flex: 1;
  }

  .act-info h3 {
    font-size: 16px;
    font-weight: 900;
    color: #0b2450;
    margin-bottom: 4px;
  }

  .act-info p {
    font-size: 11.5px;
    color: #475569;
    line-height: 1.45;
    margin-bottom: 8px;
    font-weight: 500;
  }

  .payment-steps {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 9px;
  }

  .step-pill {
    background: #ffffff;
    border: 1.5px solid #cbd5e1;
    padding: 6px 10px;
    border-radius: 8px;
    font-size: 10.5px;
    color: #334155;
    font-weight: 600;
  }

  .step-pill strong {
    color: #0867e8;
    display: block;
    font-size: 10.5px;
    font-weight: 800;
    margin-bottom: 1px;
  }

  .pay-handle-banner {
    background: #eff6ff;
    border: 1.5px solid #93c5fd;
    border-radius: 8px;
    padding: 7px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 11px;
    font-weight: 700;
  }

  .pay-handle-banner a {
    color: #0867e8;
    font-weight: 900;
    text-decoration: underline;
  }

  /* Footer */
  .footer {
    border-top: 2px solid #e2e8f0;
    padding-top: 7px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 9.5px;
    color: #64748b;
    font-weight: 600;
  }

  .footer strong {
    color: #0f172a;
    font-weight: 800;
  }

  .footer-links span {
    margin: 0 4px;
    color: #cbd5e1;
  }
</style>
</head>
<body>

<!-- ================= PAGE 1: REVENUE GROWTH & SCRIPT ================= -->
<div class="page">
  <!-- Header -->
  <div class="header">
    <div class="logo-block">
      <img src="${logoBase64}" alt="Clinaza" class="logo-img" />
      <div class="logo-text">
        <h1>CLINAZA</h1>
        <p>Healthcare Financing &amp; Clinic Operating System</p>
      </div>
    </div>
    <div class="header-badge">
      <div class="badge-pill">Clinic Partner Onboarding Guide</div>
      <div class="badge-sub">Confidential &bull; Practice Enablement</div>
    </div>
  </div>

  <!-- Hero Box -->
  <div class="hero-box">
    <div class="hero-text">
      <h2>Stop Losing Patients to Upfront Price Objections</h2>
      <p>High-ticket treatments like Dental Implants, Invisalign, All-on-4, and Smile Makeovers face 68% patient drop-off due to lump-sum costs. Clinaza equips your front desk with instant point-of-care monthly EMIs so patients say YES immediately.</p>
    </div>
    <div class="hero-stat">
      <div class="num">+35% to 50%</div>
      <div class="lbl">Implant &amp; Aligner Case Conversion</div>
    </div>
  </div>

  <!-- The 10-Second Script (Stacked Mobile View) -->
  <div>
    <div class="section-title">
      <span class="dot"></span>
      The 10-Second Front-Desk Reframe Script
    </div>
    <div class="script-container">
      <div class="script-card script-bad">
        <div class="script-header-bad">❌ The Traditional Drop-Off Way</div>
        <div class="quote-box">"Doctor said your single implant with zirconia crown is ₹55,000. How will you pay today?"</div>
        <div class="result-tag" style="color: #991b1b;">
          <strong>Patient Reaction:</strong> "I will check with my family and call you back." <em>(Result: Patient delays or drops out forever).</em>
        </div>
      </div>

      <div class="script-card script-good">
        <div class="script-header-good">✅ The Clinaza Front-Desk Way</div>
        <div class="quote-box">"Your total treatment is ₹55,000, or you can split it into easy paperless EMIs of ~₹2,450/month. Shall I check your 2-minute digital approval?"</div>
        <div class="result-tag" style="color: #166534;">
          <strong>Patient Reaction:</strong> "₹2,450 a month is very comfortable. Let's start the scan today!" <em>(Result: Immediate treatment start).</em>
        </div>
      </div>
    </div>
  </div>

  <!-- 3 Clinic Safety Pillars -->
  <div>
    <div class="section-title">
      <span class="dot"></span>
      Three Pillars of Complete Clinic Protection
    </div>
    <div class="pillars-grid">
      <div class="pillar-box">
        <h4>⚡ 1. Upfront Full Payout (T+1)</h4>
        <p>100% of the approved treatment amount is disbursed straight into your clinic bank account within 24–48 hours. No waiting for monthly installments.</p>
      </div>

      <div class="pillar-box">
        <h4>🛡️ 2. Zero Clinic Risk (No Khata)</h4>
        <p>RBI-regulated NBFC partners take 100% borrower default risk. Your clinic is never liable for patient repayments or debt collection.</p>
      </div>

      <div class="pillar-box">
        <h4>📲 3. Multi-Lender Approval</h4>
        <p>Instant digital KYC via Account Aggregator &amp; DigiLocker. Approves both carded patients (CC/DC) and non-carded salaried/self-employed patients.</p>
      </div>
    </div>
  </div>

  <!-- 4 Documents Box -->
  <div class="docs-box">
    <div class="docs-header">
      <span>THE 4-DOCUMENT CLINIC ONBOARDING CHECKLIST</span>
      <span style="font-size: 10px; font-weight: 700; opacity: 0.95;">100% Digital Activation &bull; Verified in 24 Hours</span>
    </div>
    <div class="docs-grid">
      <div class="doc-item">
        <div class="doc-num">1</div>
        <div class="doc-info">
          <strong>Doctor / Clinic PAN Card</strong>
          <span>Entity identity verification &amp; Central KYC compliance</span>
        </div>
      </div>

      <div class="doc-item">
        <div class="doc-num">2</div>
        <div class="doc-info">
          <strong>Degree or State Dental Council Certificate</strong>
          <span>BDS/MDS degree or DCI / State Dental Council registration proof</span>
        </div>
      </div>

      <div class="doc-item">
        <div class="doc-num">3</div>
        <div class="doc-info">
          <strong>Bank Account Cancelled Cheque</strong>
          <span>Current Account or Savings Account for direct payout settlements</span>
        </div>
      </div>

      <div class="doc-item">
        <div class="doc-num">4</div>
        <div class="doc-info">
          <strong>2 Clinic Photographs</strong>
          <span>1 Front exterior with name signboard + 1 Interior operatory dental chair</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div>
      <strong>CLINAZA</strong> &bull; Operated by <strong>MELLOWPRINTS</strong> (GSTIN: 10DXRPR3052Q1ZV &bull; Udyam: UDYAM-BR-26-0005161)
    </div>
    <div class="footer-links">
      <span>Helpline: +91 7292984244</span> &bull; <span>contact@clinaza.in</span> &bull; <span>www.clinaza.in</span> &bull; <strong>Page 1 of 2</strong>
    </div>
  </div>
</div>

<!-- ================= PAGE 2: COMMERCIALS & QR ACTIVATION ================= -->
<div class="page">
  <!-- Header -->
  <div class="header">
    <div class="logo-block">
      <img src="${logoBase64}" alt="Clinaza" class="logo-img" />
      <div class="logo-text">
        <h1>CLINAZA</h1>
        <p>Commercial Structure &amp; Clinic Activation</p>
      </div>
    </div>
    <div class="header-badge">
      <div class="badge-pill">Transparent Commercials</div>
      <div class="badge-sub">₹0 AMC &bull; Zero Disguised Platform Fees</div>
    </div>
  </div>

  <!-- Commercial Plans -->
  <div>
    <div class="section-title">
      <span class="dot"></span>
      1. Platform Membership &amp; Clinic Starter Kit
    </div>
    <div class="commercial-grid">
      <!-- Card 1: Cloud CRM Software -->
      <div class="plan-card plan-software">
        <span class="plan-tag tag-green">Lifetime Zero Software Fee</span>
        <div class="plan-price">₹0 <span style="font-size: 14px; font-weight: 800; color: #166534;">/ Lifetime Free</span></div>
        <div class="plan-sub">Cloud Dental CRM &amp; Practice Utility Suite</div>
        <ul class="plan-features">
          <li>✓ <strong>Cloud Practice CRM:</strong> Unlimited patients, digital treatment records &amp; case notes.</li>
          <li>✓ <strong>Rx Prescription Maker:</strong> 1-click WhatsApp &amp; PDF printable dental prescriptions.</li>
          <li>✓ <strong>Patient Recall Automation:</strong> Automated 6-month cleaning &amp; recall WhatsApp reminders.</li>
          <li>✓ <strong>Zero AMC Forever:</strong> No monthly software rent, no annual maintenance renewals.</li>
        </ul>
      </div>

      <!-- Card 2: Activation Kit -->
      <div class="plan-card plan-kit">
        <span class="plan-tag tag-blue">One-Time Activation</span>
        <div class="plan-price">₹999 <span style="font-size: 14px; font-weight: 800; color: #1e40af;">One-Time Only</span></div>
        <div class="plan-sub">Custom Clinic Welcome &amp; Front-Desk Standee Kit</div>
        <ul class="plan-features">
          <li>✓ <strong>Countertop Acrylic Standee:</strong> Laser-printed reception QR standee with clinic logo.</li>
          <li>✓ <strong>Staff Script &amp; Pitch Cards:</strong> Ready-made 10-second conversion cards for reception staff.</li>
          <li>✓ <strong>Dedicated Relationship Manager:</strong> Priority onboarding &amp; instant WhatsApp support desk.</li>
          <li>✓ <strong>Doorstep Courier Delivery:</strong> Dispatched via Bluedart/Delhivery within 48 business hours.</li>
        </ul>
      </div>
    </div>
  </div>

  <!-- MDR Rates -->
  <div>
    <div class="section-title">
      <span class="dot"></span>
      2. Transparent Point-of-Care Processing Rates (MDR)
    </div>
    <table class="mdr-table">
      <thead>
        <tr>
          <th>Payment Channel</th>
          <th>Supported Modes</th>
          <th>Rate (MDR)</th>
          <th>Settlement Speed</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>UPI / QR Dynamic Checkout</strong></td>
          <td>GPay, PhonePe, Paytm, BHIM, Cred</td>
          <td><span class="rate-badge rate-green">0.65%</span></td>
          <td>T+1 Banking Day</td>
        </tr>
        <tr>
          <td><strong>Debit Card (Above ₹2,000)</strong></td>
          <td>Visa, Mastercard, RuPay</td>
          <td><span class="rate-badge rate-blue">1.25%</span></td>
          <td>T+1 Banking Day</td>
        </tr>
        <tr>
          <td><strong>Credit Card (Standard Swipe)</strong></td>
          <td>Visa, Mastercard, RuPay, Amex</td>
          <td><span class="rate-badge rate-blue">2.10%</span></td>
          <td>T+1 Banking Day</td>
        </tr>
        <tr>
          <td><strong>Credit Card EMI (3 – 24 Mo)</strong></td>
          <td>HDFC, ICICI, SBI, Axis, Kotak, IndusInd (16+ Banks)</td>
          <td><span class="rate-badge rate-purple">2.95%</span></td>
          <td>T+1 Banking Day</td>
        </tr>
        <tr>
          <td><strong>Cardless Healthcare NBFC EMI</strong></td>
          <td>Bajaj Finserv, Piramal, Tata Capital, L&amp;T Finance</td>
          <td><span class="rate-badge rate-green">Custom Plan</span></td>
          <td>Full Upfront Payout (T+1)</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Activation QR Box -->
  <div>
    <div class="section-title">
      <span class="dot"></span>
      3. Instant Clinic Kit Activation &bull; Scan &amp; Pay ₹999
    </div>
    <div class="activation-container">
      <div class="qr-box">
        <img src="${qrBase64}" alt="Clinaza Activation QR" class="qr-img" />
        <div class="qr-label">UPI ID: clinaza255876.rzp@rxairtel</div>
      </div>
      <div class="act-info">
        <h3>Activate Your Clinic in 3 Simple Steps</h3>
        <p>Scan the Razorpay QR code with any UPI app (GPay, PhonePe, Paytm) to order your custom reception acrylic standee and activate your clinic financing portal.</p>
        
        <div class="payment-steps">
          <div class="step-pill">
            <strong>STEP 1 &bull; SCAN QR CODE</strong>
            Scan QR or visit <span style="color:#0867e8;font-weight:800;">razorpay.me/@clinaza</span>
          </div>
          <div class="step-pill">
            <strong>STEP 2 &bull; ADD CLINIC NAME</strong>
            Mention Clinic Name in the payment notes/comment
          </div>
        </div>

        <div class="pay-handle-banner">
          <div>
            <span>Direct Web Checkout: </span>
            <a href="https://razorpay.me/@clinaza" target="_blank">https://razorpay.me/@clinaza</a>
          </div>
          <strong style="color: #059669; font-size: 12.5px;">Amount: ₹999 (Fixed)</strong>
        </div>
      </div>
    </div>
  </div>

  <!-- Corporate Legal Secretariat Footer -->
  <div class="footer">
    <div>
      <strong>MELLOWPRINTS</strong> (Brand: <strong>CLINAZA</strong>) &bull; Sharma Sadan, Road No-1, Mahesh Nagar, S.K. Puri, Patna, Bihar - 800024
    </div>
    <div class="footer-links">
      <span>Helpline: +91 7292984244</span> &bull; <span>contact@clinaza.in</span> &bull; <span>www.clinaza.in</span> &bull; <strong>Page 2 of 2</strong>
    </div>
  </div>
</div>

</body>
</html>
`;

async function generatePDF() {
  console.log('[PDF] Starting Puppeteer generation for Clinaza Clinic Partner Guide (Mobile-Optimized)...');
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  const targetDirs = [
    '/Users/pratyushraj/Desktop',
    path.join(__dirname, '../public/docs'),
    path.join(__dirname, '../dist/docs')
  ];

  for (const dir of targetDirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const outputPath = path.join(dir, 'Clinaza_Clinic_Partner_Onboarding_Guide.pdf');
    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true
    });
    console.log('[PDF] Saved successfully to:', outputPath);
  }

  await browser.close();
  console.log('[PDF] All PDF outputs generated cleanly.');
}

generatePDF().catch(err => {
  console.error('[PDF] Generation error:', err);
  process.exit(1);
});
