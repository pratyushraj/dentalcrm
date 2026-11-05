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
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

  @page { size: A4 portrait; margin: 0; }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    background: #f1f5f9;
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
    padding: 0;
    margin: 0 auto;
    page-break-after: always;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
  }

  /* ===== SHARED COMPONENTS ===== */

  .topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 22px;
    background: #ffffff;
    border-bottom: 1px solid #e2e8f0;
  }

  .topbar-logo {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .topbar-logo img {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    object-fit: cover;
    border: 1px solid #e2e8f0;
  }

  .topbar-logo .brand {
    font-size: 20px;
    font-weight: 900;
    letter-spacing: -0.5px;
    color: #0b2450;
  }

  .topbar-logo .sub {
    font-size: 9.5px;
    font-weight: 700;
    color: #3b82f6;
    letter-spacing: 0.8px;
    text-transform: uppercase;
  }

  .topbar-right {
    text-align: right;
  }

  .topbar-badge {
    display: inline-block;
    background: linear-gradient(135deg, #0b2450 0%, #1e40af 100%);
    color: #ffffff;
    font-size: 9px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    padding: 5px 12px;
    border-radius: 6px;
  }

  .topbar-sub {
    font-size: 9px;
    color: #94a3b8;
    margin-top: 3px;
    font-weight: 600;
  }

  .page-body {
    flex: 1;
    padding: 12px 22px 0 22px;
    display: flex;
    flex-direction: column;
    gap: 13px;
    justify-content: space-between;
  }

  .page-footer {
    padding: 7px 22px;
    border-top: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 8.5px;
    color: #94a3b8;
    font-weight: 600;
    background: #f8fafc;
  }

  .page-footer strong { color: #475569; font-weight: 800; }

  /* ===== PAGE 1 ===== */

  .hero {
    background: linear-gradient(135deg, #020617 0%, #0f172a 35%, #1e3a8a 100%);
    border-radius: 14px;
    padding: 18px 22px;
    color: #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    overflow: hidden;
  }

  .hero::before {
    content: '';
    position: absolute;
    top: -40px;
    right: -40px;
    width: 160px;
    height: 160px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 70%);
  }

  .hero-left h2 {
    font-size: 20px;
    font-weight: 900;
    line-height: 1.2;
    margin-bottom: 5px;
    letter-spacing: -0.3px;
  }

  .hero-left p {
    font-size: 11.5px;
    color: #cbd5e1;
    line-height: 1.5;
    max-width: 440px;
    font-weight: 500;
  }

  .hero-stats {
    display: flex;
    gap: 10px;
  }

  .hero-stat-card {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.15);
    backdrop-filter: blur(8px);
    border-radius: 10px;
    padding: 10px 14px;
    text-align: center;
    min-width: 90px;
  }

  .hero-stat-card .val {
    font-size: 22px;
    font-weight: 900;
    color: #38bdf8;
    line-height: 1;
  }

  .hero-stat-card .lbl {
    font-size: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #e2e8f0;
    margin-top: 3px;
    font-weight: 700;
  }

  /* Opportunity Stats */
  .opp-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .opp-card {
    border-radius: 10px;
    padding: 10px 12px;
    text-align: center;
  }

  .opp-card.red { background: #fef2f2; border: 1.5px solid #fecaca; }
  .opp-card.amber { background: #fffbeb; border: 1.5px solid #fde68a; }
  .opp-card.green { background: #f0fdf4; border: 1.5px solid #86efac; }

  .opp-card .opp-val {
    font-size: 22px;
    font-weight: 900;
    line-height: 1;
  }

  .opp-card.red .opp-val { color: #dc2626; }
  .opp-card.amber .opp-val { color: #d97706; }
  .opp-card.green .opp-val { color: #16a34a; }

  .opp-card .opp-lbl {
    font-size: 9.5px;
    color: #475569;
    font-weight: 700;
    margin-top: 2px;
  }

  /* Section title */
  .s-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    font-weight: 900;
    color: #0b2450;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .s-title .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #3b82f6;
    display: inline-block;
  }

  /* Script before/after */
  .script-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .script-card {
    border-radius: 10px;
    padding: 10px 13px;
  }

  .script-bad {
    background: #fef2f2;
    border: 1.5px solid #fecaca;
  }

  .script-good {
    background: #f0fdf4;
    border: 1.5px solid #86efac;
  }

  .script-label {
    font-size: 9px;
    font-weight: 900;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .script-bad .script-label { color: #dc2626; }
  .script-good .script-label { color: #16a34a; }

  .script-quote {
    font-size: 12px;
    font-weight: 700;
    color: #0f172a;
    line-height: 1.4;
    margin-bottom: 4px;
  }

  .script-result {
    font-size: 10px;
    font-weight: 600;
    line-height: 1.35;
  }

  .script-bad .script-result { color: #991b1b; }
  .script-good .script-result { color: #166534; }

  /* Flow Diagram */
  .flow-container {
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    border-radius: 12px;
    padding: 10px 14px;
  }

  .flow-title {
    font-size: 10px;
    font-weight: 900;
    color: #0b2450;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 7px;
    text-align: center;
  }

  .flow-steps {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3px;
  }

  .flow-step {
    background: #ffffff;
    border: 1.5px solid #e2e8f0;
    border-radius: 8px;
    padding: 7px 9px;
    text-align: center;
    min-width: 100px;
    max-width: 115px;
  }

  .flow-step .step-num {
    display: inline-block;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #3b82f6;
    color: #ffffff;
    font-size: 9px;
    font-weight: 900;
    line-height: 18px;
    margin-bottom: 3px;
  }

  .flow-step.highlight {
    background: linear-gradient(135deg, #eff6ff, #dbeafe);
    border-color: #3b82f6;
  }

  .flow-step .step-title {
    font-size: 9px;
    font-weight: 800;
    color: #0b2450;
    margin-bottom: 1px;
  }

  .flow-step .step-desc {
    font-size: 8px;
    color: #64748b;
    font-weight: 600;
    line-height: 1.3;
  }

  .flow-arrow {
    font-size: 14px;
    color: #94a3b8;
    font-weight: 700;
  }

  /* Pillars */
  .pillars-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .pillar {
    background: #ffffff;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    padding: 9px 11px;
    position: relative;
    overflow: hidden;
  }

  .pillar::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
  }

  .pillar.p1::before { background: #3b82f6; }
  .pillar.p2::before { background: #10b981; }
  .pillar.p3::before { background: #8b5cf6; }

  .pillar .p-icon {
    font-size: 16px;
    margin-bottom: 3px;
  }

  .pillar h4 {
    font-size: 11px;
    font-weight: 800;
    color: #0b2450;
    margin-bottom: 2px;
    line-height: 1.2;
  }

  .pillar p {
    font-size: 9.5px;
    color: #64748b;
    line-height: 1.35;
    font-weight: 500;
  }

  /* Docs checklist */
  .docs-box {
    background: #ffffff;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    overflow: hidden;
  }

  .docs-header {
    background: linear-gradient(135deg, #0b2450, #1e3a8a);
    color: #ffffff;
    padding: 7px 14px;
    font-size: 10px;
    font-weight: 900;
    display: flex;
    justify-content: space-between;
    align-items: center;
    letter-spacing: 0.4px;
  }

  .docs-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 7px;
    padding: 9px 14px;
    background: #f8fafc;
  }

  .doc-item {
    display: flex;
    align-items: flex-start;
    gap: 8px;
  }

  .doc-num {
    width: 20px;
    height: 20px;
    border-radius: 6px;
    background: #3b82f6;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 10px;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .doc-info strong {
    color: #0b2450;
    display: block;
    font-size: 10.5px;
    font-weight: 800;
  }

  .doc-info span {
    color: #64748b;
    font-size: 9px;
    font-weight: 600;
  }

  /* ===== PAGE 2 ===== */

  /* All-in-one plan */
  .plan-card {
    background: linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%);
    border: 2px solid #3b82f6;
    border-radius: 12px;
    padding: 12px 16px;
    position: relative;
    overflow: hidden;
  }

  .plan-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4);
  }

  .plan-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    padding-bottom: 8px;
    border-bottom: 1px dashed #cbd5e1;
  }

  .plan-header .plan-tag {
    display: inline-block;
    background: #dbeafe;
    color: #1d4ed8;
    font-size: 8.5px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    padding: 3px 8px;
    border-radius: 5px;
    margin-bottom: 3px;
  }

  .plan-header .price {
    font-size: 28px;
    font-weight: 900;
    color: #0b2450;
    line-height: 1;
  }

  .plan-header .price-detail {
    font-size: 11px;
    font-weight: 700;
    color: #3b82f6;
  }

  .plan-header .price-sub {
    font-size: 9.5px;
    font-weight: 600;
    color: #64748b;
  }

  .plan-badge {
    background: linear-gradient(135deg, #1d4ed8, #7c3aed);
    color: #ffffff;
    padding: 8px 14px;
    border-radius: 8px;
    text-align: center;
  }

  .plan-badge .badge-title {
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 0.6px;
  }

  .plan-badge .badge-desc {
    font-size: 8px;
    color: #c7d2fe;
    font-weight: 700;
    margin-top: 1px;
  }

  .features-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .features-grid ul {
    list-style: none;
    font-size: 10px;
    color: #334155;
  }

  .features-grid li {
    display: flex;
    align-items: flex-start;
    gap: 6px;
    margin-bottom: 5px;
    line-height: 1.35;
    font-weight: 600;
  }

  .features-grid li strong {
    color: #0f172a;
    font-weight: 800;
  }

  .check-icon {
    color: #16a34a;
    font-weight: 900;
    flex-shrink: 0;
    margin-top: 1px;
  }

  /* MDR table */
  .mdr-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 9.5px;
    background: #ffffff;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #e2e8f0;
  }

  .mdr-table th {
    background: linear-gradient(135deg, #0b2450, #1e3a8a);
    color: #ffffff;
    padding: 6px 10px;
    text-align: left;
    font-weight: 800;
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .mdr-table td {
    padding: 5px 10px;
    border-bottom: 1px solid #f1f5f9;
    color: #334155;
    font-weight: 600;
  }

  .mdr-table tr:last-child td { border-bottom: none; }
  .mdr-table tr:nth-child(even) { background: #f8fafc; }

  .rate-badge {
    display: inline-block;
    padding: 2px 7px;
    border-radius: 5px;
    font-weight: 900;
    font-size: 9.5px;
  }

  .rate-green { background: #dcfce7; color: #166534; }
  .rate-blue { background: #dbeafe; color: #1e40af; }
  .rate-purple { background: #f3e8ff; color: #6b21a8; }

  /* QR Activation */
  .activation-box {
    background: #f8fafc;
    border: 2px dashed #3b82f6;
    border-radius: 12px;
    padding: 10px 14px;
    display: flex;
    gap: 14px;
    align-items: center;
  }

  .qr-card {
    background: #ffffff;
    padding: 7px;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    flex-shrink: 0;
    text-align: center;
  }

  .qr-card img {
    width: 120px;
    height: auto;
    display: block;
    border-radius: 4px;
  }

  .qr-card .qr-upi {
    font-size: 8px;
    font-weight: 800;
    color: #0b2450;
    margin-top: 4px;
  }

  .act-content { flex: 1; }

  .act-content h3 {
    font-size: 14px;
    font-weight: 900;
    color: #0b2450;
    margin-bottom: 3px;
  }

  .act-content > p {
    font-size: 10px;
    color: #64748b;
    line-height: 1.4;
    margin-bottom: 7px;
    font-weight: 500;
  }

  .act-steps {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
    margin-bottom: 7px;
  }

  .act-step {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    padding: 5px 8px;
    border-radius: 6px;
  }

  .act-step strong {
    display: block;
    font-size: 8.5px;
    font-weight: 800;
    color: #3b82f6;
    margin-bottom: 1px;
  }

  .act-step span {
    font-size: 9px;
    color: #475569;
    font-weight: 600;
  }

  .pay-banner {
    background: #eff6ff;
    border: 1px solid #93c5fd;
    border-radius: 6px;
    padding: 5px 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 9.5px;
    color: #334155;
    font-weight: 600;
  }

  .pay-banner a {
    color: #2563eb;
    font-weight: 800;
    text-decoration: none;
  }

  .pay-banner .pay-amt {
    color: #059669;
    font-size: 11px;
    font-weight: 900;
  }

  /* Competitive advantage */
  .comp-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 9px;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #e2e8f0;
  }

  .comp-table th {
    padding: 5px 10px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    font-size: 8.5px;
  }

  .comp-table th:first-child {
    background: #f1f5f9;
    color: #475569;
    text-align: left;
  }

  .comp-table th:nth-child(2) {
    background: #fee2e2;
    color: #991b1b;
    text-align: center;
  }

  .comp-table th:nth-child(3) {
    background: linear-gradient(135deg, #0b2450, #1e3a8a);
    color: #ffffff;
    text-align: center;
  }

  .comp-table td {
    padding: 4px 10px;
    border-bottom: 1px solid #f1f5f9;
    font-weight: 600;
    color: #334155;
  }

  .comp-table td:nth-child(2),
  .comp-table td:nth-child(3) {
    text-align: center;
  }

  .comp-table tr:last-child td { border-bottom: none; }
  .comp-table tr:nth-child(even) { background: #fafbfc; }

</style>
</head>
<body>

<!-- ===================== PAGE 1 ===================== -->
<div class="page">
  <div class="topbar">
    <div class="topbar-logo">
      <img src="${logoBase64}" alt="Clinaza" />
      <div>
        <div class="brand">CLINAZA</div>
        <div class="sub">Instant Patient Financing &amp; Clinic OS</div>
      </div>
    </div>
    <div class="topbar-right">
      <div class="topbar-badge">Clinic Partner Enablement Guide</div>
      <div class="topbar-sub">Confidential &bull; Practice Revenue Growth</div>
    </div>
  </div>

  <div class="page-body">
    <!-- Hero -->
    <div class="hero">
      <div class="hero-left">
        <h2>Stop Losing Patients to<br/>Upfront Price Objections</h2>
        <p>High-ticket treatments (Implants, Invisalign, All-on-4, Smile Design) face 68% patient drop-off from lump-sum costs. Clinaza equips your front desk with instant paperless EMIs — patients say YES at the chair.</p>
      </div>
      <div class="hero-stats">
        <div class="hero-stat-card">
          <div class="val">+35%</div>
          <div class="lbl">Case Conversion<br/>Uplift</div>
        </div>
        <div class="hero-stat-card">
          <div class="val">&gt;85%</div>
          <div class="lbl">Patient EMI<br/>Approval Rate</div>
        </div>
      </div>
    </div>

    <!-- Opportunity Stats Row -->
    <div class="opp-row">
      <div class="opp-card red">
        <div class="opp-val">68%</div>
        <div class="opp-lbl">Patients drop off at lump-sum billing</div>
      </div>
      <div class="opp-card amber">
        <div class="opp-val">~24 Cr</div>
        <div class="opp-lbl">Indians without credit cards want EMIs</div>
      </div>
      <div class="opp-card green">
        <div class="opp-val">Under 60s</div>
        <div class="opp-lbl">Patient EMI approval at your reception</div>
      </div>
    </div>

    <!-- The 10-Second Script -->
    <div class="s-title"><span class="dot"></span>The 10-Second Front-Desk Reframe Script</div>
    <div class="script-row">
      <div class="script-card script-bad">
        <div class="script-label">❌ Traditional Drop-Off Way</div>
        <div class="script-quote">"Your implant with zirconia crown is ₹55,000. How will you pay today?"</div>
        <div class="script-result"><strong>Patient:</strong> "I'll check with my family and call you back." <em>(Drops out forever)</em></div>
      </div>
      <div class="script-card script-good">
        <div class="script-label">✅ The Clinaza Front-Desk Way</div>
        <div class="script-quote">"Your treatment is ₹55,000, or easy paperless EMIs of ~₹2,450/mo. Shall I check your 2-min digital approval?"</div>
        <div class="script-result"><strong>Patient:</strong> "₹2,450/month is comfortable. Let's start today!" <em>(Immediate YES)</em></div>
      </div>
    </div>

    <!-- Patient Journey Flow -->
    <div class="s-title"><span class="dot"></span>How It Works: Patient EMI Journey at Your Clinic</div>
    <div class="flow-container">
      <div class="flow-steps">
        <div class="flow-step">
          <div class="step-num">1</div>
          <div class="step-title">Patient Arrives</div>
          <div class="step-desc">Treatment plan discussed with doctor</div>
        </div>
        <div class="flow-arrow">→</div>
        <div class="flow-step highlight">
          <div class="step-num">2</div>
          <div class="step-title">EMI Offered</div>
          <div class="step-desc">Reception shows EMI via PAN + Mobile</div>
        </div>
        <div class="flow-arrow">→</div>
        <div class="flow-step">
          <div class="step-num">3</div>
          <div class="step-title">Instant Approval</div>
          <div class="step-desc">Multi-lender match in under 60 seconds</div>
        </div>
        <div class="flow-arrow">→</div>
        <div class="flow-step highlight">
          <div class="step-num">4</div>
          <div class="step-title">Treatment Starts</div>
          <div class="step-desc">Clinic gets full payout T+1</div>
        </div>
      </div>
    </div>

    <!-- 3 Pillars -->
    <div class="s-title"><span class="dot"></span>Three Pillars of Complete Clinic Protection</div>
    <div class="pillars-grid">
      <div class="pillar p1">
        <div class="p-icon">⚡</div>
        <h4>Full Upfront Payout (T+1)</h4>
        <p>100% of the approved amount is disbursed to your clinic bank account within 24–48 hours. Zero waiting for monthly installments.</p>
      </div>
      <div class="pillar p2">
        <div class="p-icon">🛡️</div>
        <h4>Zero Clinic Default Risk</h4>
        <p>RBI-regulated NBFC partners take 100% borrower default risk. Your clinic is never liable for patient EMI repayments or collections.</p>
      </div>
      <div class="pillar p3">
        <div class="p-icon">📲</div>
        <h4>Multi-Lender Orchestration</h4>
        <p>Single integration routes patients to the best-fit lender (Banks + NBFCs). CC/DC holders and cardless patients both approved instantly.</p>
      </div>
    </div>

    <!-- Docs Checklist -->
    <div class="docs-box">
      <div class="docs-header">
        <span>4-Document Clinic Onboarding Checklist</span>
        <span style="font-size: 9px; font-weight: 700; opacity: 0.9;">100% Digital &bull; Verified in 24 Hours</span>
      </div>
      <div class="docs-grid">
        <div class="doc-item">
          <div class="doc-num">1</div>
          <div class="doc-info"><strong>Doctor / Clinic PAN Card</strong><span>Entity identity &amp; Central KYC compliance</span></div>
        </div>
        <div class="doc-item">
          <div class="doc-num">2</div>
          <div class="doc-info"><strong>Dental Council Certificate</strong><span>BDS/MDS degree or State Dental Council proof</span></div>
        </div>
        <div class="doc-item">
          <div class="doc-num">3</div>
          <div class="doc-info"><strong>Bank Cancelled Cheque</strong><span>Current / Savings account for direct payout</span></div>
        </div>
        <div class="doc-item">
          <div class="doc-num">4</div>
          <div class="doc-info"><strong>2 Clinic Photographs</strong><span>1 exterior signboard + 1 interior dental chair</span></div>
        </div>
      </div>
    </div>
  </div>

  <div class="page-footer">
    <div><strong>CLINAZA</strong> &bull; Operated by <strong>MELLOWPRINTS</strong> (GSTIN: 10DXRPR3052Q1ZV &bull; Udyam: UDYAM-BR-26-0005161)</div>
    <div>Helpline: +91 7292984244 &bull; contact@clinaza.in &bull; www.clinaza.in &bull; <strong>Page 1 of 2</strong></div>
  </div>
</div>

<!-- ===================== PAGE 2 ===================== -->
<div class="page">
  <div class="topbar">
    <div class="topbar-logo">
      <img src="${logoBase64}" alt="Clinaza" />
      <div>
        <div class="brand">CLINAZA</div>
        <div class="sub">Commercial Structure &amp; Clinic Activation</div>
      </div>
    </div>
    <div class="topbar-right">
      <div class="topbar-badge">All-Inclusive &bull; ₹999 One-Time</div>
      <div class="topbar-sub">Zero Recurring Fees &bull; Zero Hidden Charges</div>
    </div>
  </div>

  <div class="page-body">
    <!-- All-in-one Plan Card -->
    <div class="s-title"><span class="dot"></span>1. All-Inclusive Clinic Partner Activation Kit</div>
    <div class="plan-card">
      <div class="plan-header">
        <div>
          <span class="plan-tag">Complete Practice Suite &bull; All Included</span>
          <div class="price">₹999 <span class="price-detail">One-Time Onboarding</span></div>
          <div class="price-sub">Everything your clinic needs: CRM software + patient EMI gateway + reception standee. Zero recurring AMC ever.</div>
        </div>
        <div class="plan-badge">
          <div class="badge-title">ALL-IN-ONE</div>
          <div class="badge-desc">Zero Hidden Fees</div>
        </div>
      </div>
      <div class="features-grid">
        <ul>
          <li><span class="check-icon">✓</span> <span><strong>Cloud Practice CRM:</strong> Unlimited patients, digital treatment plans &amp; case records.</span></li>
          <li><span class="check-icon">✓</span> <span><strong>WhatsApp Rx Prescriptions:</strong> 1-click digital prescriptions sent to patients.</span></li>
          <li><span class="check-icon">✓</span> <span><strong>Automated Patient Recalls:</strong> 6-month cleaning &amp; recall WhatsApp reminders.</span></li>
          <li><span class="check-icon">✓</span> <span><strong>Point-of-Care EMIs:</strong> Instant 3–24 mo patient EMI approvals at reception.</span></li>
        </ul>
        <ul>
          <li><span class="check-icon">✓</span> <span><strong>Custom Acrylic Standee:</strong> Laser-printed reception QR with clinic logo &amp; name.</span></li>
          <li><span class="check-icon">✓</span> <span><strong>Front-Desk Pitch Cards:</strong> Ready-made 10-second conversion cards for staff.</span></li>
          <li><span class="check-icon">✓</span> <span><strong>Dedicated Relationship Mgr:</strong> Priority onboarding &amp; direct WhatsApp support.</span></li>
          <li><span class="check-icon">✓</span> <span><strong>Doorstep Express Delivery:</strong> Dispatched via Bluedart/Delhivery in 48 hours.</span></li>
        </ul>
      </div>
    </div>

    <!-- MDR Rates -->
    <div class="s-title"><span class="dot"></span>2. Transparent Processing Rates (MDR)</div>
    <table class="mdr-table">
      <thead>
        <tr>
          <th>Payment Channel</th>
          <th>Supported Modes</th>
          <th>Rate</th>
          <th>Settlement</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>UPI / QR Dynamic Checkout</strong></td>
          <td>GPay, PhonePe, Paytm, BHIM, Cred</td>
          <td><span class="rate-badge rate-green">0.65%</span></td>
          <td>T+1 Day</td>
        </tr>
        <tr>
          <td><strong>Debit Card (Above ₹2,000)</strong></td>
          <td>Visa, Mastercard, RuPay</td>
          <td><span class="rate-badge rate-blue">1.25%</span></td>
          <td>T+1 Day</td>
        </tr>
        <tr>
          <td><strong>Credit Card (Standard)</strong></td>
          <td>Visa, Mastercard, RuPay, Amex</td>
          <td><span class="rate-badge rate-blue">2.10%</span></td>
          <td>T+1 Day</td>
        </tr>
        <tr>
          <td><strong>Credit Card EMI (3–24 Mo)</strong></td>
          <td>HDFC, ICICI, SBI, Axis, Kotak + 16 Banks</td>
          <td><span class="rate-badge rate-purple">2.95%</span></td>
          <td>T+1 Day</td>
        </tr>
        <tr>
          <td><strong>Cardless NBFC EMI</strong></td>
          <td>Bajaj, Piramal, Tata Capital, L&amp;T Finance</td>
          <td><span class="rate-badge rate-green">Custom</span></td>
          <td>Full Upfront (T+1)</td>
        </tr>
      </tbody>
    </table>

    <!-- Competitive Advantage -->
    <div class="s-title"><span class="dot"></span>Why Clinaza vs. Traditional Checkout</div>
    <table class="comp-table">
      <thead>
        <tr>
          <th>Capability</th>
          <th>Traditional / Others</th>
          <th>Clinaza CMP</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Cardless Patient Journey</strong></td>
          <td>❌ Redirected to 3rd-party</td>
          <td>✅ Unified single flow</td>
        </tr>
        <tr>
          <td><strong>KYC Process</strong></td>
          <td>❌ Repeated per lender</td>
          <td>✅ One-time digital KYC</td>
        </tr>
        <tr>
          <td><strong>Lender Coverage</strong></td>
          <td>❌ Single lender / fragmented</td>
          <td>✅ Multi-lender orchestration</td>
        </tr>
        <tr>
          <td><strong>Clinic Software + CRM</strong></td>
          <td>❌ Not included</td>
          <td>✅ Full suite at ₹0 AMC</td>
        </tr>
        <tr>
          <td><strong>Omnichannel (QR + Web)</strong></td>
          <td>❌ Online only</td>
          <td>✅ In-clinic QR + Web + WhatsApp</td>
        </tr>
      </tbody>
    </table>

    <!-- Activation QR -->
    <div class="s-title"><span class="dot"></span>3. Instant Clinic Kit Activation &bull; Scan &amp; Pay ₹999</div>
    <div class="activation-box">
      <div class="qr-card">
        <img src="${qrBase64}" alt="Clinaza Activation QR" />
        <div class="qr-upi">UPI: clinaza255876.rzp@rxairtel</div>
      </div>
      <div class="act-content">
        <h3>Activate Your Clinic in 3 Steps</h3>
        <p>Scan the Razorpay QR with any UPI app to order your custom reception standee and activate your clinic financing portal.</p>
        <div class="act-steps">
          <div class="act-step">
            <strong>STEP 1 &bull; SCAN QR</strong>
            <span>Scan or visit razorpay.me/@clinaza</span>
          </div>
          <div class="act-step">
            <strong>STEP 2 &bull; ADD CLINIC NAME</strong>
            <span>Mention Clinic Name in payment notes</span>
          </div>
        </div>
        <div class="pay-banner">
          <span>Direct Checkout: <a href="https://razorpay.me/@clinaza">https://razorpay.me/@clinaza</a></span>
          <span class="pay-amt">Amount: ₹999 (Fixed)</span>
        </div>
      </div>
    </div>
  </div>

  <div class="page-footer">
    <div><strong>MELLOWPRINTS</strong> (Brand: <strong>CLINAZA</strong>) &bull; Sharma Sadan, Road No-1, Mahesh Nagar, S.K. Puri, Patna, Bihar – 800024</div>
    <div>Helpline: +91 7292984244 &bull; contact@clinaza.in &bull; www.clinaza.in &bull; <strong>Page 2 of 2</strong></div>
  </div>
</div>

</body>
</html>
`;

async function generatePDF() {
  console.log('[PDF] Starting generation for Clinaza Clinic Partner Guide (v3 — CMP-Enhanced)...');
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
