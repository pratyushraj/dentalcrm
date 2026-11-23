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
const pluralLogoBase64 = getBase64Image(path.join(__dirname, '../public/assets/plural_by_pinelabs_transparent.png'));
const qrBase64 = getBase64Image(path.join(__dirname, '../public/assets/clinaza_activation_kit_qr.png'));

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Clinaza Patient EMI Checkout Flow & Technical Architecture Guide</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap');

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
    padding: 8mm 12mm 7mm 12mm;
    margin: 0 auto;
    page-break-after: always;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
  }

  /* Header */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 5px;
    border-bottom: 1.5px solid #e2e8f0;
  }

  .brand-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .logo-img {
    width: 34px;
    height: 34px;
    border-radius: 8px;
    object-fit: cover;
    border: 1px solid #cbd5e1;
  }

  .brand-title {
    font-size: 14px;
    font-weight: 900;
    letter-spacing: 0.06em;
    color: #0f172a;
    line-height: 1.1;
  }

  .brand-sub {
    font-size: 9px;
    font-weight: 700;
    color: #0867E8;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .partner-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    padding: 3px 8px;
    border-radius: 20px;
    font-size: 8.5px;
    font-weight: 700;
    color: #475569;
  }

  .partner-logo {
    height: 12px;
    width: auto;
    object-contain: fit;
  }

  .doc-ref {
    font-family: 'JetBrains Mono', monospace;
    font-size: 8px;
    font-weight: 600;
    color: #64748b;
    background: #f1f5f9;
    padding: 2px 6px;
    border-radius: 4px;
  }

  /* Titles */
  .hero-tag {
    display: inline-block;
    background: #eff6ff;
    color: #0867E8;
    border: 1px solid #bfdbfe;
    font-size: 8px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 2px 7px;
    border-radius: 12px;
    margin-bottom: 4px;
  }

  .hero-title {
    font-size: 19px;
    font-weight: 900;
    color: #0B2450;
    letter-spacing: -0.02em;
    line-height: 1.2;
    margin-bottom: 3px;
  }

  .hero-desc {
    font-size: 10px;
    color: #475569;
    line-height: 1.4;
  }

  /* Metrics Bar */
  .metrics-bar {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 7px;
    margin: 8px 0;
  }

  .metric-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 6px 8px;
    text-align: center;
  }

  .metric-val {
    font-size: 13px;
    font-weight: 900;
    color: #0867E8;
    font-family: 'JetBrains Mono', monospace;
  }

  .metric-lbl {
    font-size: 8px;
    font-weight: 700;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-top: 1px;
  }

  /* Section Card */
  .section-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 9px 11px;
    margin-bottom: 7px;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
  }

  .section-title {
    font-size: 11px;
    font-weight: 800;
    color: #0B2450;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  /* 5-Step Checkout Horizontal Grid */
  .steps-flow-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 6px;
    margin-top: 4px;
  }

  .flow-step-box {
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    padding: 7px 6px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 180px;
  }

  .flow-step-box.highlight {
    background: #f0fdf4;
    border-color: #86efac;
  }

  .flow-step-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 4px;
  }

  .flow-step-num {
    width: 17px;
    height: 17px;
    border-radius: 50%;
    background: #0867E8;
    color: #ffffff;
    font-size: 8.5px;
    font-weight: 900;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .flow-step-badge {
    font-size: 7px;
    font-weight: 800;
    padding: 1.5px 4.5px;
    border-radius: 4px;
    text-transform: uppercase;
    background: #e2e8f0;
    color: #334155;
  }

  .flow-step-title {
    font-size: 9.5px;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.25;
    margin-bottom: 4px;
  }

  .flow-screen-mockup {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 5px;
    margin-top: auto;
    font-size: 8px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.04);
  }

  .mockup-header {
    font-size: 7.5px;
    font-weight: 700;
    color: #64748b;
    border-bottom: 1px solid #f1f5f9;
    padding-bottom: 2px;
    margin-bottom: 3px;
    display: flex;
    justify-content: space-between;
  }

  .mockup-highlight {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    font-weight: 800;
    color: #059669;
    background: #ecfdf5;
    padding: 1.5px 4px;
    border-radius: 3px;
    text-align: center;
    margin: 2px 0;
  }

  .mockup-desc {
    font-size: 7.5px;
    color: #475569;
    line-height: 1.3;
  }

  /* Comparison Matrix Table */
  .comp-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 8.5px;
    margin-top: 4px;
  }

  .comp-table th {
    background: #0B2450;
    color: #ffffff;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    padding: 5px 8px;
    text-align: left;
    font-size: 8px;
  }

  .comp-table th:first-child {
    border-top-left-radius: 6px;
  }

  .comp-table th:last-child {
    border-top-right-radius: 6px;
  }

  .comp-table td {
    padding: 4.5px 8px;
    border-bottom: 1px solid #e2e8f0;
    line-height: 1.3;
  }

  .comp-table tr:nth-child(even) {
    background: #f8fafc;
  }

  .comp-tag {
    display: inline-block;
    padding: 1px 4px;
    border-radius: 3px;
    font-size: 7px;
    font-weight: 800;
    text-transform: uppercase;
  }

  .comp-tag.good {
    background: #dcfce7;
    color: #15803d;
    border: 1px solid #bbf7d0;
  }

  .comp-tag.bad {
    background: #fee2e2;
    color: #b91c1c;
    border: 1px solid #fecaca;
  }

  /* Multi-Lender Match Engine */
  .lender-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
    margin-top: 5px;
  }

  .lender-card {
    border: 1px solid #e2e8f0;
    background: #f8fafc;
    border-radius: 6px;
    padding: 5px 7px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .lender-name {
    font-size: 9px;
    font-weight: 800;
    color: #0f172a;
  }

  .lender-type {
    font-size: 7.5px;
    color: #64748b;
  }

  .lender-stat {
    font-size: 8px;
    font-weight: 700;
    color: #059669;
    margin-top: 2px;
  }

  /* FAQ Accordion Grid */
  .faq-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 7px;
    margin-top: 4px;
  }

  .faq-box {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 7px;
    padding: 6px 8px;
  }

  .faq-q {
    font-size: 8.5px;
    font-weight: 800;
    color: #0B2450;
    margin-bottom: 2px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .faq-a {
    font-size: 8px;
    color: #334155;
    line-height: 1.35;
  }

  /* Onboarding Blueprint Bar */
  .onboarding-steps-bar {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
    margin-top: 5px;
  }

  .onboard-step-card {
    border: 1px solid #e2e8f0;
    border-radius: 7px;
    padding: 7px 8px;
    background: #ffffff;
  }

  .onboard-num {
    display: inline-block;
    background: #0867E8;
    color: #ffffff;
    font-size: 8px;
    font-weight: 900;
    width: 15px;
    height: 15px;
    text-align: center;
    line-height: 15px;
    border-radius: 50%;
    margin-bottom: 3px;
  }

  .onboard-title {
    font-size: 9px;
    font-weight: 800;
    color: #0B2450;
    margin-bottom: 2px;
  }

  .onboard-desc {
    font-size: 7.5px;
    color: #475569;
    line-height: 1.3;
  }

  /* Bottom Call to Action Card */
  .cta-banner {
    background: linear-gradient(135deg, #0B2450 0%, #0867E8 100%);
    color: #ffffff;
    border-radius: 9px;
    padding: 9px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 4px;
  }

  .cta-text-title {
    font-size: 11.5px;
    font-weight: 900;
    margin-bottom: 2px;
  }

  .cta-text-sub {
    font-size: 8px;
    color: #bfdbfe;
    line-height: 1.3;
  }

  .cta-qr-box {
    display: flex;
    align-items: center;
    gap: 7px;
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.25);
    padding: 4px 7px;
    border-radius: 7px;
  }

  .cta-qr-img {
    width: 32px;
    height: 32px;
    border-radius: 4px;
    background: #ffffff;
    padding: 1.5px;
  }

  /* Footer */
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 5px;
    border-top: 1px solid #e2e8f0;
    font-size: 7.5px;
    color: #64748b;
  }

  .footer-links {
    display: flex;
    gap: 12px;
  }

  .footer-links span {
    font-weight: 600;
  }
</style>
</head>
<body>

<!-- ========================================================================= -->
<!-- PAGE 1: THE 5-STEP POINT-OF-CARE PATIENT CHECKOUT FLOW                    -->
<!-- ========================================================================= -->
<div class="page">
  <div>
    <!-- Top Bar -->
    <div class="header">
      <div class="brand-group">
        <img src="${logoBase64}" class="logo-img" alt="Clinaza">
        <div>
          <div class="brand-title">CLINAZA</div>
          <div class="brand-sub">Healthcare Affordability & Checkout</div>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <div class="partner-badge">
          <span>POWERED BY:</span>
          <img src="${pluralLogoBase64}" class="partner-logo" alt="Plural by Pine Labs">
        </div>
        <div class="doc-ref">REF: CLZ-CHECKOUT-V2</div>
      </div>
    </div>

    <!-- Hero Header -->
    <div style="margin-top: 7px;">
      <span class="hero-tag">Interactive Checkout Simulator Blueprint • V2.0</span>
      <h1 class="hero-title">Point-of-Care Patient Healthcare EMI Checkout Flow</h1>
      <p class="hero-desc">
        How partner dental and surgical practices convert high-ticket treatments (Clear Aligners, Dental Implants, Full-Mouth Rehabilitation, Laser Care) chairside into instant, paperless monthly installments with 100% upfront T+1 clinic disbursal.
      </p>
    </div>

    <!-- Core Metrics -->
    <div class="metrics-bar">
      <div class="metric-card">
        <div class="metric-val">₹0 Down Payment</div>
        <div class="metric-lbl">100% Treatment Coverage</div>
      </div>
      <div class="metric-card">
        <div class="metric-val">2 Minutes</div>
        <div class="metric-lbl">Paperless Digital KYC</div>
      </div>
      <div class="metric-card">
        <div class="metric-val">16+ Banks</div>
        <div class="metric-lbl">Multi-Lender Waterfall</div>
      </div>
      <div class="metric-card">
        <div class="metric-val">0% Recourse</div>
        <div class="metric-lbl">T+1 Direct Clinic Payout</div>
      </div>
    </div>

    <!-- 5-Step Visual Progression -->
    <div class="section-card" style="margin-top: 3px;">
      <div class="section-header">
        <div class="section-title">
          <span>⚡</span> The 5-Step Linear Patient Checkout Experience (Zero Redirects)
        </div>
        <span style="font-size: 8px; font-weight: 700; color: #0867E8; background: #eff6ff; padding: 2px 6px; border-radius: 4px;">
          Live Simulator at clinaza.in/checkout-flow
        </span>
      </div>

      <div class="steps-flow-grid">
        <!-- Step 1 -->
        <div class="flow-step-box">
          <div>
            <div class="flow-step-top">
              <div class="flow-step-num">1</div>
              <span class="flow-step-badge">Chairside Scan</span>
            </div>
            <div class="flow-step-title">Scan QR / WhatsApp Link</div>
          </div>
          <div class="flow-screen-mockup">
            <div class="mockup-header">
              <span>RECEPTION DESK</span>
              <span>📱 QR</span>
            </div>
            <div class="mockup-desc">
              Doctor or reception generates a secure WhatsApp link or on-screen QR checkout.
            </div>
            <div class="mockup-highlight">₹75,000 Treatment</div>
            <div class="mockup-desc" style="color: #0867E8; font-weight: 700;">
              👉 clinaza.in/pay/clz-9842
            </div>
          </div>
        </div>

        <!-- Step 2 -->
        <div class="flow-step-box">
          <div>
            <div class="flow-step-top">
              <div class="flow-step-num">2</div>
              <span class="flow-step-badge">Pre-Approval</span>
            </div>
            <div class="flow-step-title">Multi-Lender Match</div>
          </div>
          <div class="flow-screen-mockup">
            <div class="mockup-header">
              <span>PRE-APPROVED</span>
              <span>⚡ 20 SEC</span>
            </div>
            <div class="mockup-desc">
              Auto-routed across multi-bank network based on patient credit profile.
            </div>
            <div class="mockup-highlight">Limit: ₹1,50,000</div>
            <div class="mockup-desc">
              • Tata Capital (0% Foreclosure)<br>
              • Piramal Finance (Flexible EMI)<br>
              • HDFC / ICICI / SBI CC-DC
            </div>
          </div>
        </div>

        <!-- Step 3 -->
        <div class="flow-step-box">
          <div>
            <div class="flow-step-top">
              <div class="flow-step-num">3</div>
              <span class="flow-step-badge">Tenure Choice</span>
            </div>
            <div class="flow-step-title">Select Monthly EMI</div>
          </div>
          <div class="flow-screen-mockup">
            <div class="mockup-header">
              <span>TENURE: 12 MOS</span>
              <span>₹0 PENALTY</span>
            </div>
            <div class="mockup-desc">
              Transparent tenures (3, 6, 9, 12, 18, 24 mos) with live monthly math.
            </div>
            <div class="mockup-highlight">₹6,680 / month</div>
            <div class="mockup-desc">
              Total: ₹75,000 over 12 months.<br>
              Replaces ₹75k upfront shock.
            </div>
          </div>
        </div>

        <!-- Step 4 -->
        <div class="flow-step-box">
          <div>
            <div class="flow-step-top">
              <div class="flow-step-num">4</div>
              <span class="flow-step-badge">AutoPay Mandate</span>
            </div>
            <div class="flow-step-title">UPI AutoPay & e-Sign</div>
          </div>
          <div class="flow-screen-mockup">
            <div class="mockup-header">
              <span>e-MANDATE</span>
              <span>🔒 NPCI</span>
            </div>
            <div class="mockup-desc">
              1-Minute auto-debit setup via Google Pay, PhonePe, Paytm or Netbanking.
            </div>
            <div class="mockup-highlight">5th of Every Month</div>
            <div class="mockup-desc">
              One-Time Aadhaar OTP digital loan agreement sign. Zero physical paper.
            </div>
          </div>
        </div>

        <!-- Step 5 -->
        <div class="flow-step-box highlight">
          <div>
            <div class="flow-step-top">
              <div class="flow-step-num" style="background: #059669;">5</div>
              <span class="flow-step-badge" style="background: #dcfce7; color: #15803d;">Disbursal</span>
            </div>
            <div class="flow-step-title" style="color: #065f46;">T+1 Direct Settlement</div>
          </div>
          <div class="flow-screen-mockup" style="border-color: #86efac;">
            <div class="mockup-header">
              <span style="color: #15803d; font-weight: 800;">CONFIRMED</span>
              <span>🎉 100%</span>
            </div>
            <div class="mockup-desc">
              Full treatment fee credited directly into clinic current account.
            </div>
            <div class="mockup-highlight" style="color: #065f46; background: #d1fae5;">₹75,000 Disbursed</div>
            <div class="mockup-desc">
              • Direct T+1 Bank Payout<br>
              • 0% Default Risk on Clinic
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Chairside Impact Highlight -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 7px; margin-top: 3px;">
      <div class="section-card" style="margin-bottom: 0;">
        <div style="font-size: 10px; font-weight: 800; color: #0B2450; margin-bottom: 3px;">
          🩺 Patient Psychological Friction Elimination
        </div>
        <div style="font-size: 8px; color: #475569; line-height: 1.35;">
          When an implant or aligner case is quoted at ₹50,000–₹1,50,000, 68% of hesitant patients cite upfront liquidity pressure. Reframing the treatment as <strong>₹4,010/month</strong> or <strong>₹6,680/month</strong> removes price hesitation chairside and stops patients from postponing care.
        </div>
      </div>
      <div class="section-card" style="margin-bottom: 0;">
        <div style="font-size: 10px; font-weight: 800; color: #0B2450; margin-bottom: 3px;">
          🛡️ Zero Clinic Balance-Sheet Recourse
        </div>
        <div style="font-size: 8px; color: #475569; line-height: 1.35;">
          Unlike informal clinic credit or installments (khata), Clinaza patient loans are 100% balance-sheet underwritten by partner financial institutions. The clinic receives 100% of the treatment fee upfront on T+1, with <strong>0% default liability</strong> if a patient later misses an EMI.
        </div>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div class="footer-links">
      <span>🌐 www.clinaza.in/checkout-flow</span>
      <span>📞 +91 7292984244</span>
      <span>✉️ contact@clinaza.in</span>
    </div>
    <div>Page 1 of 3 • Clinaza Patient Checkout Architecture</div>
  </div>
</div>

<!-- ========================================================================= -->
<!-- PAGE 2: TECHNICAL ARCHITECTURE & MULTI-LENDER WATERFALL ENGINE            -->
<!-- ========================================================================= -->
<div class="page">
  <div>
    <!-- Top Bar -->
    <div class="header">
      <div class="brand-group">
        <img src="${logoBase64}" class="logo-img" alt="Clinaza">
        <div>
          <div class="brand-title">CLINAZA</div>
          <div class="brand-sub">Multi-Lender Waterfall Engine</div>
        </div>
      </div>
      <div class="partner-badge">
        <span>ARCHITECTURAL BENCHMARK:</span>
        <strong style="color: #0867E8;">76.4% MATCH RATE</strong>
      </div>
    </div>

    <!-- Section: The Waterfall Engine -->
    <div style="margin-top: 7px;">
      <span class="hero-tag">System Architecture • Single-Screen Journey</span>
      <h2 class="hero-title" style="font-size: 16px;">Multi-Bank & Cardless Healthcare Waterfall Engine</h2>
      <p class="hero-desc">
        Why legacy point-of-sale finance fails at the dental front desk: single-lender desks reject 55%+ of non-prime patients. Clinaza utilizes an intelligent multi-lender waterfall that evaluates patients simultaneously across cards and digital NBFC lines in under 30 seconds.
      </p>
    </div>

    <!-- Comparison Matrix Table -->
    <div class="section-card" style="margin-top: 6px;">
      <div class="section-header">
        <div class="section-title">
          <span>⚖️</span> Architecture Matrix: Clinaza HealthPay vs Traditional Counter Finance
        </div>
      </div>
      <table class="comp-table">
        <thead>
          <tr>
            <th style="width: 24%;">Finance Capability</th>
            <th style="width: 38%;">Traditional Financing / 3rd-Party POS</th>
            <th style="width: 38%;">Clinaza Point-of-Care Checkout Flow</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Patient Checkout Flow</strong></td>
            <td>Redirected to external 3rd-party banking portals with complex logins (45%+ drop-off).</td>
            <td><strong>Unified single linear screen</strong> on mobile with zero third-party redirects. <span class="comp-tag good">Zero Drops</span></td>
          </tr>
          <tr>
            <td><strong>Income Verification</strong></td>
            <td>Manual salary slips, PDF bank statement uploads & netbanking password fatigue.</td>
            <td><strong>1-Minute Paperless Account Aggregator OTP</strong> (Zero passbooks or PDFs). <span class="comp-tag good">1 OTP Only</span></td>
          </tr>
          <tr>
            <td><strong>Identity & e-KYC</strong></td>
            <td>Repeated paperwork per lender with physical Aadhaar photocopies.</td>
            <td><strong>100% Digital One-Time Aadhaar e-KYC</strong> via UIDAI encrypted gateway. <span class="comp-tag good">Instant</span></td>
          </tr>
          <tr>
            <td><strong>Lender Architecture</strong></td>
            <td>Single lender tie-up (rejects 55%–60% of patients who lack high CIBIL scores).</td>
            <td><strong>Multi-Bank Waterfall Engine</strong> (Auto-routes across Tata, Piramal, Bajaj, L&T). <span class="comp-tag good">Auto-Backup</span></td>
          </tr>
          <tr>
            <td><strong>Approval Rate</strong></td>
            <td>35% – 42% single-shot approval rate at counter.</td>
            <td><strong>76.4% Multi-Lender Match Benchmark</strong> (+20% case conversion uplift). <span class="comp-tag good">+20% Uplift</span></td>
          </tr>
          <tr>
            <td><strong>Hardware & POS Rentals</strong></td>
            <td>₹600–₹1,200/month POS terminal machine rental + security deposit + printer rolls.</td>
            <td><strong>₹0 Hardware</strong> (Counter acrylic QR standee + dynamic chairside WhatsApp links). <span class="comp-tag good">₹0 Rental</span></td>
          </tr>
          <tr>
            <td><strong>Default & Khata Recourse</strong></td>
            <td>Clinic handles collection calls; doctor suffers bad debt if patient stops paying.</td>
            <td><strong>0% Clinic Risk</strong> (100% non-recourse: lenders collect directly; clinic keeps 100%). <span class="comp-tag good">0% Recourse</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Multi-Lender Match Network -->
    <div class="section-card" style="margin-top: 4px;">
      <div class="section-header">
        <div class="section-title">
          <span>🏦</span> Integrated Multi-Bank & Healthcare Affordability Network
        </div>
        <span style="font-size: 8px; font-weight: 700; color: #475569;">16+ Institutional Lenders</span>
      </div>
      <div class="lender-grid">
        <div class="lender-card">
          <div class="lender-name">Tata Capital</div>
          <div class="lender-type">Healthcare Retail Line</div>
          <div class="lender-stat">₹0 Pre-closure Charges</div>
        </div>
        <div class="lender-card">
          <div class="lender-name">Piramal Finance</div>
          <div class="lender-type">Cardless Medical Line</div>
          <div class="lender-stat">3–24 Mo Flexible Tenures</div>
        </div>
        <div class="lender-card">
          <div class="lender-name">Bajaj Finserv</div>
          <div class="lender-type">Digital Health EMI</div>
          <div class="lender-stat">Instant e-Mandate Link</div>
        </div>
        <div class="lender-card">
          <div class="lender-name">L&T Finance</div>
          <div class="lender-type">Elective Surgery Line</div>
          <div class="lender-stat">High-Ticket Implants</div>
        </div>
      </div>
      <div style="margin-top: 6px; padding: 5px 8px; background: #f1f5f9; border-radius: 6px; font-size: 8px; color: #475569; display: flex; justify-content: space-between; align-items: center;">
        <span><strong>Credit & Debit Card EMIs:</strong> HDFC, ICICI, SBI, Axis, Kotak, IndusInd, Federal, Standard Chartered (1.85% wholesale MDR).</span>
        <span style="font-weight: 700; color: #0867E8;">Live via Pine Labs Gateway</span>
      </div>
    </div>

    <!-- Settlement Timeline Flow -->
    <div class="section-card" style="margin-top: 4px; margin-bottom: 0;">
      <div class="section-header">
        <div class="section-title">
          <span>⏱️</span> Automated T+1 Settlement & Reconciliation Timeline
        </div>
      </div>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px; font-size: 8px;">
        <div style="background: #f8fafc; padding: 6px; border-radius: 6px; border: 1px solid #e2e8f0;">
          <div style="font-weight: 800; color: #0B2450; margin-bottom: 2px;">1. Chairside Approval (Day 0)</div>
          <div style="color: #475569; line-height: 1.3;">Patient completes 2-minute OTP flow. Digital loan agreement signed via Aadhaar e-Sign. Clinic receives instant SMS/WhatsApp confirmation.</div>
        </div>
        <div style="background: #f8fafc; padding: 6px; border-radius: 6px; border: 1px solid #e2e8f0;">
          <div style="font-weight: 800; color: #0B2450; margin-bottom: 2px;">2. Direct Settlement (Day T+1)</div>
          <div style="color: #475569; line-height: 1.3;">100% treatment fee credited directly into clinic current account via automated banking clearinghouse. No manual withdrawal request needed.</div>
        </div>
        <div style="background: #f8fafc; padding: 6px; border-radius: 6px; border: 1px solid #e2e8f0;">
          <div style="font-weight: 800; color: #0B2450; margin-bottom: 2px;">3. Zero Collection Follow-up</div>
          <div style="color: #475569; line-height: 1.3;">Automated monthly debit handled via NPCI UPI AutoPay / e-NACH on patient's account. Clinic has 0% responsibility for ongoing collections.</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div class="footer-links">
      <span>🌐 www.clinaza.in/checkout-flow</span>
      <span>📞 +91 7292984244</span>
      <span>✉️ contact@clinaza.in</span>
    </div>
    <div>Page 2 of 3 • Clinaza Multi-Lender Architecture</div>
  </div>
</div>

<!-- ========================================================================= -->
<!-- PAGE 3: CLINIC COMMERCIALS, STATUTORY ONBOARDING & FAQ                    -->
<!-- ========================================================================= -->
<div class="page">
  <div>
    <!-- Top Bar -->
    <div class="header">
      <div class="brand-group">
        <img src="${logoBase64}" class="logo-img" alt="Clinaza">
        <div>
          <div class="brand-title">CLINAZA</div>
          <div class="brand-sub">Clinic Partnership & Enablement</div>
        </div>
      </div>
      <div class="partner-badge">
        <span>STATUTORY COMPLIANCE:</span>
        <strong style="color: #059669;">CGST SEC 23 EXEMPT</strong>
      </div>
    </div>

    <!-- Section: Clinic Commercial Terms -->
    <div style="margin-top: 7px;">
      <span class="hero-tag">Transparent B2B Commercial Invariants</span>
      <h2 class="hero-title" style="font-size: 16px;">Partner Clinic Commercial Economics & Setup</h2>
      <p class="hero-desc">
        Clinaza is designed specifically for private independent clinics and sole proprietors. Zero recurring software costs, zero hardware lock-in, and zero financial risk on patient loan defaults.
      </p>
    </div>

    <!-- Commercials 3-Box Grid -->
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px; margin-top: 6px;">
      <div class="section-card" style="margin-bottom: 0; text-align: center; padding: 8px;">
        <div style="font-size: 8px; font-weight: 800; color: #64748b; text-transform: uppercase;">One-Time Activation Kit</div>
        <div style="font-size: 18px; font-weight: 900; color: #0867E8; font-family: 'JetBrains Mono', monospace; margin: 2px 0;">₹999</div>
        <div style="font-size: 7.5px; color: #475569; line-height: 1.3;">
          Includes clinic underwriting, digital checkout activation, secure payment links, and on-screen QR setup.
        </div>
      </div>
      <div class="section-card" style="margin-bottom: 0; text-align: center; padding: 8px;">
        <div style="font-size: 8px; font-weight: 800; color: #64748b; text-transform: uppercase;">Recurring Platform AMC</div>
        <div style="font-size: 18px; font-weight: 900; color: #059669; font-family: 'JetBrains Mono', monospace; margin: 2px 0;">₹0 / Year</div>
        <div style="font-size: 7.5px; color: #475569; line-height: 1.3;">
          Zero Annual Maintenance Charges, zero monthly software subscription fees, and zero portal renewal fees.
        </div>
      </div>
      <div class="section-card" style="margin-bottom: 0; text-align: center; padding: 8px;">
        <div style="font-size: 8px; font-weight: 800; color: #64748b; text-transform: uppercase;">Clinic Default Risk</div>
        <div style="font-size: 18px; font-weight: 900; color: #0B2450; font-family: 'JetBrains Mono', monospace; margin: 2px 0;">0% Recourse</div>
        <div style="font-size: 7.5px; color: #475569; line-height: 1.3;">
          100% balance-sheet underwritten by partner NBFCs. Clinic has zero collection or financial liability.
        </div>
      </div>
    </div>

    <!-- Onboarding 3-Step Bar -->
    <div class="section-card" style="margin-top: 6px;">
      <div class="section-header">
        <div class="section-title">
          <span>📋</span> Streamlined 3-Step Clinic Onboarding & Pine Labs Verification
        </div>
        <span style="font-size: 8px; font-weight: 700; color: #059669;">Turnaround: 24–48 Hours</span>
      </div>
      <div class="onboarding-steps-bar">
        <div class="onboard-step-card">
          <div class="onboard-num">1</div>
          <div class="onboard-title">Online Application</div>
          <div class="onboard-desc">
            Submit clinic name, doctor credentials, and contact details via <strong>clinaza.in/#partner-form</strong>.
          </div>
        </div>
        <div class="onboard-step-card">
          <div class="onboard-num">2</div>
          <div class="onboard-title">KYC Document Upload</div>
          <div class="onboard-desc">
            Provide Doctor PAN, Aadhaar, Cancelled Cheque (for T+1 current account linking), and Udyam/establishment license.
          </div>
        </div>
        <div class="onboard-step-card">
          <div class="onboard-num">3</div>
          <div class="onboard-title">Sub-Merchant Activation</div>
          <div class="onboard-desc">
            Pine Labs underwrites the file, allocates the Sub-Merchant MID, and Clinaza activates the digital checkout desk.
          </div>
        </div>
      </div>
    </div>

    <!-- Doctor FAQ Accordion -->
    <div class="section-card" style="margin-top: 5px;">
      <div class="section-header">
        <div class="section-title">
          <span>❓</span> Frequently Asked Questions by Clinic Directors & Dental Surgeons
        </div>
      </div>
      <div class="faq-grid">
        <div class="faq-box">
          <div class="faq-q"><span>Q:</span> When does our clinic receive the treatment funds?</div>
          <div class="faq-a"><strong>100% on T+1 banking day.</strong> As soon as the patient completes the 2-minute OTP agreement, the funds are cleared and deposited directly into your linked bank current account on the next banking day.</div>
        </div>
        <div class="faq-box">
          <div class="faq-q"><span>Q:</span> What happens if the patient stops paying their EMI?</div>
          <div class="faq-a"><strong>Zero impact on your clinic.</strong> Clinaza operates on a strict 100% non-recourse framework. Partner lenders assume all credit underwriting; your clinic never faces clawbacks, deductions, or recovery calls.</div>
        </div>
        <div class="faq-box">
          <div class="faq-q"><span>Q:</span> Are there monthly machine rental or hardware charges?</div>
          <div class="faq-a"><strong>Zero hardware rentals.</strong> You do not need expensive EDC/POS swipe terminals. Patient checkout works seamlessly via your clinic's counter acrylic QR standee or instant chairside WhatsApp links.</div>
        </div>
        <div class="faq-box">
          <div class="faq-q"><span>Q:</span> Which clinical procedures are eligible for EMI?</div>
          <div class="faq-a">All major dental and day-care surgical treatments from <strong>₹10,000 to ₹5,00,000+</strong> (Clear Aligners, Implants, Full-Mouth Rehab, Ceramic Braces, Zirconia Makeovers, RCTs, Hair/Laser Care).</div>
        </div>
      </div>
    </div>

    <!-- CTA & QR Activation Banner -->
    <div class="cta-banner">
      <div>
        <div class="cta-text-title">Ready to Enable Instant Patient EMI at Your Reception?</div>
        <div class="cta-text-sub">
          Join 195+ verified partner clinics across India offering point-of-care patient healthcare financing.<br>
          Experience the interactive simulator: <strong>www.clinaza.in/checkout-flow</strong>
        </div>
      </div>
      <div class="cta-qr-box">
        <img src="${qrBase64}" class="cta-qr-img" alt="Scan QR">
        <div style="font-size: 7.5px; font-weight: 700; line-height: 1.25;">
          <span>SCAN TO TEST</span><br>
          <span style="color: #93c5fd;">INTERACTIVE DEMO</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div class="footer-links">
      <span>🌐 www.clinaza.in/checkout-flow</span>
      <span>📞 +91 7292984244</span>
      <span>✉️ contact@clinaza.in</span>
      <span>📍 Gurugram • Bengaluru • Pan-India</span>
    </div>
    <div>Page 3 of 3 • Clinaza Partner Clinic Commercials</div>
  </div>
</div>

</body>
</html>`;

async function generatePDF() {
  console.log('[PDF] Launching headless browser to compile Checkout Flow Guide...');
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

  const fileName = 'Clinaza_Patient_Checkout_Flow_Guide.pdf';

  for (const dir of targetDirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const outputPath = path.join(dir, fileName);
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
