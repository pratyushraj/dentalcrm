const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

// ── Load Logo Assets ──
const clinazaIconPath = path.join(__dirname, '../public/docs/clinaza_c_icon.png');
const easebuzzSvgPath = path.join(__dirname, '../public/assets/easebuzz_logo.svg');

let clinazaBase64 = '';
if (fs.existsSync(clinazaIconPath)) {
  clinazaBase64 = 'data:image/png;base64,' + fs.readFileSync(clinazaIconPath).toString('base64');
}

let easebuzzSvg = '';
if (fs.existsSync(easebuzzSvgPath)) {
  easebuzzSvg = fs.readFileSync(easebuzzSvgPath, 'utf8');
}

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Clinaza × Easebuzz — Cardless EMI Review Dossier</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;600;700;800&display=swap');

  @page { size: A4 portrait; margin: 0; }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    background: #ffffff;
    color: #1a1a2e;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    font-size: 12px;
    line-height: 1.55;
  }

  .page {
    width: 210mm;
    height: 297mm;
    padding: 18mm 20mm 14mm 20mm;
    background: #ffffff;
    margin: 0 auto;
    page-break-after: always;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .page-content { flex: 1; }

  /* ═══════════════ HEADER ═══════════════ */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 12px;
    margin-bottom: 16px;
    border-bottom: 3px solid #0f172a;
  }

  .brand-lockup {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .clinaza-icon {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .clinaza-icon img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .brand-name {
    font-size: 20px;
    font-weight: 900;
    letter-spacing: -0.5px;
    color: #0b2450;
    line-height: 1.1;
  }

  .brand-sub {
    font-size: 9px;
    font-weight: 700;
    color: #0284c7;
    letter-spacing: 0.8px;
    text-transform: uppercase;
  }

  .cross-mark {
    color: #94a3b8;
    font-size: 18px;
    font-weight: 300;
  }

  .easebuzz-logo {
    display: flex;
    align-items: center;
  }

  .easebuzz-logo svg {
    height: 26px;
    width: auto;
  }

  .header-right {
    text-align: right;
  }

  .header-tag {
    display: inline-block;
    background: #0f172a;
    color: #ffffff;
    font-size: 9.5px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    padding: 4px 10px;
    border-radius: 4px;
  }

  .header-date {
    font-size: 10px;
    color: #64748b;
    margin-top: 4px;
  }

  /* ═══════════════ FOOTER ═══════════════ */
  .footer {
    padding-top: 10px;
    border-top: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    color: #64748b;
  }

  .footer a {
    color: #0284c7;
    text-decoration: none;
    font-weight: 600;
  }

  /* ═══════════════ TITLES ═══════════════ */
  .page-title {
    margin-bottom: 16px;
  }

  .page-title h1 {
    font-size: 23px;
    font-weight: 900;
    color: #0f172a;
    letter-spacing: -0.6px;
    line-height: 1.25;
  }

  .page-title p {
    font-size: 12px;
    color: #475569;
    margin-top: 4px;
    font-weight: 500;
  }

  /* ═══════════════ KPI CARDS ═══════════════ */
  .kpi-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin-bottom: 16px;
  }

  .kpi-box {
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    border-top: 4px solid #0284c7;
    border-radius: 8px;
    padding: 10px 12px;
  }

  .kpi-box.green { border-top-color: #10b981; }
  .kpi-box.orange { border-top-color: #ea580c; }
  .kpi-box.purple { border-top-color: #8b5cf6; }

  .kpi-box .label {
    font-size: 9.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #64748b;
    margin-bottom: 2px;
  }

  .kpi-box .value {
    font-size: 19px;
    font-weight: 900;
    color: #0f172a;
    letter-spacing: -0.4px;
    font-family: 'JetBrains Mono', monospace;
  }

  .kpi-box.green .value { color: #047857; }
  .kpi-box.orange .value { color: #c2410c; }
  .kpi-box.purple .value { color: #0f172a; }

  .kpi-box .sub {
    font-size: 9px;
    color: #64748b;
    margin-top: 2px;
    font-weight: 500;
  }

  /* ═══════════════ SECTION HEADS ═══════════════ */
  .section-head {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
  }

  .section-head .dot {
    width: 7px;
    height: 7px;
    background: #0284c7;
    border-radius: 2px;
  }

  .section-head .dot.orange { background: #ea580c; }

  .section-head h2 {
    font-size: 12.5px;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: 0.4px;
    text-transform: uppercase;
  }

  .section-head .tag {
    font-size: 9px;
    font-weight: 700;
    background: #e0f2fe;
    color: #0369a1;
    padding: 2px 7px;
    border-radius: 4px;
    margin-left: auto;
  }

  /* ═══════════════ CARD CONTAINERS ═══════════════ */
  .card {
    background: #ffffff;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    padding: 12px 16px;
    margin-bottom: 12px;
  }

  .card h3 {
    font-size: 12.5px;
    font-weight: 800;
    color: #0f172a;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .card h3 .pill {
    font-size: 9.5px;
    font-weight: 700;
    background: #e0f2fe;
    color: #0369a1;
    border: 1px solid #bae6fd;
    padding: 2px 8px;
    border-radius: 12px;
  }

  .card p {
    font-size: 11px;
    color: #475569;
    line-height: 1.5;
  }

  /* ═══════════════ TABLE STYLES ═══════════════ */
  .clean-table {
    width: 100%;
    border-collapse: collapse;
    margin: 8px 0 10px 0;
  }

  .clean-table th {
    background: #f8fafc;
    color: #475569;
    font-size: 9.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 6px 10px;
    border-bottom: 1.5px solid #e2e8f0;
    text-align: left;
  }

  .clean-table th.num { text-align: right; }

  .clean-table td {
    padding: 6px 10px;
    font-size: 11px;
    color: #1e293b;
    border-bottom: 1px solid #f1f5f9;
  }

  .clean-table tr:last-child td {
    border-bottom: none;
  }

  .clean-table .num {
    text-align: right;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 600;
  }

  .clean-table .total-row td {
    background: #ecfdf5;
    border-top: 2px solid #10b981;
    color: #065f46;
    font-weight: 800;
    font-size: 11.5px;
  }

  .clean-table .gmv { color: #0284c7; font-weight: 800; }

  /* Compact variant for 28-clinic table on Page 2 */
  .page.page-table {
    padding: 10mm 14mm 8mm 14mm;
  }

  .clean-table.compact {
    margin: 3px 0 4px 0;
  }

  .clean-table.compact th {
    padding: 3.5px 5px;
    font-size: 8px;
    white-space: nowrap;
    background: #f1f5f9;
    border-bottom: 1.5px solid #cbd5e1;
  }

  .clean-table.compact td {
    padding: 2.6px 5px;
    font-size: 8.8px;
    line-height: 1.2;
    white-space: nowrap;
    border-bottom: 1px solid #f1f5f9;
  }

  .clean-table.compact tbody tr:nth-child(even) {
    background: #f8fafc;
  }

  .clean-table.compact .clinic-name {
    font-weight: 700;
    color: #0f172a;
    display: inline;
    white-space: nowrap;
  }

  .clean-table.compact .total-row td {
    padding: 4.5px 5px;
    font-size: 9.5px;
    background: #ecfdf5;
  }

  /* ═══════════════ CALLOUT BOX ═══════════════ */
  .callout {
    background: #f8fafc;
    border-left: 4px solid #0284c7;
    border-radius: 0 8px 8px 0;
    padding: 9px 12px;
    margin-top: 8px;
    font-size: 11px;
    color: #334155;
    line-height: 1.45;
  }

  .callout.orange { border-left-color: #ea580c; background: #fff7ed; }
  .callout strong { color: #0f172a; }

  /* ═══════════════ TWO COL LAYOUT ═══════════════ */
  .two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  /* ═══════════════ TRAFFIC BAR ═══════════════ */
  .traffic-section {
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    padding: 12px 16px;
    margin-bottom: 12px;
  }

  .traffic-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .traffic-header span {
    font-size: 11px;
    font-weight: 700;
    color: #0f172a;
  }

  .traffic-header .conv {
    color: #64748b;
    font-weight: 600;
  }

  .bar-track {
    height: 26px;
    border-radius: 6px;
    display: flex;
    overflow: hidden;
    margin-bottom: 10px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  }

  .bar-etb {
    width: 60%;
    background: linear-gradient(90deg, #0284c7, #38bdf8);
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 11px; font-weight: 800;
    font-family: 'JetBrains Mono', monospace;
  }

  .bar-ntb {
    width: 40%;
    background: linear-gradient(90deg, #ea580c, #f97316);
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 11px; font-weight: 800;
    font-family: 'JetBrains Mono', monospace;
  }

  .traffic-cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .t-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 10px 12px;
  }

  .t-card h4 {
    font-size: 11.5px;
    font-weight: 800;
    color: #0f172a;
    margin-bottom: 3px;
  }

  .t-card .tag {
    display: inline-block;
    font-size: 9.5px;
    font-weight: 700;
    padding: 1.5px 7px;
    border-radius: 4px;
    margin-bottom: 5px;
  }

  .t-card .tag.blue { background: #e0f2fe; color: #0369a1; }
  .t-card .tag.orange { background: #ffedd5; color: #c2410c; }

  .t-card p {
    font-size: 10.5px;
    color: #475569;
    line-height: 1.45;
  }

  /* ═══════════════ DARK BANNER ═══════════════ */
  .dark-banner {
    background: #0f172a;
    border-radius: 10px;
    padding: 12px 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    margin-top: 12px;
  }

  .dark-banner h4 {
    font-size: 12.5px;
    font-weight: 800;
    color: #f8fafc;
    margin-bottom: 2px;
  }

  .dark-banner p {
    font-size: 10.5px;
    color: #94a3b8;
    line-height: 1.35;
  }

  .dark-banner .big-num {
    font-size: 24px;
    font-weight: 900;
    color: #4ade80;
    font-family: 'JetBrains Mono', monospace;
    text-align: right;
    white-space: nowrap;
  }

  .dark-banner .big-label {
    font-size: 9px;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    text-align: right;
    white-space: nowrap;
  }

  /* ═══════════════ STEPS ═══════════════ */
  .step-box {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 8px 12px;
    margin-bottom: 6px;
  }

  .step-box .step-head {
    font-size: 11px;
    font-weight: 800;
    color: #0f172a;
    display: flex;
    align-items: center;
    gap: 7px;
    margin-bottom: 2px;
  }

  .step-num {
    background: #0284c7;
    color: #fff;
    font-size: 9.5px;
    font-weight: 900;
    padding: 1px 6px;
    border-radius: 4px;
    font-family: 'JetBrains Mono', monospace;
  }

  .step-num.orange { background: #ea580c; }

  .step-box p {
    font-size: 10px;
    color: #475569;
    line-height: 1.4;
    margin-left: 26px;
  }

  /* ═══════════════ SIGNOFF ═══════════════ */
  .signoff {
    background: #ffffff;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    padding: 10px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
  }

  .signoff-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .avatar {
    width: 38px; height: 38px;
    background: #0b2450;
    color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 900;
  }

  .signoff-info h4 {
    font-size: 12px;
    font-weight: 800;
    color: #0f172a;
  }

  .signoff-info p {
    font-size: 10px;
    color: #64748b;
    margin-top: 2px;
  }

  .signoff-info a {
    color: #0284c7;
    text-decoration: none;
    font-weight: 600;
  }

  .ready-pill {
    background: #ecfdf5;
    border: 1.5px solid #86efac;
    color: #065f46;
    font-size: 10.5px;
    font-weight: 800;
    padding: 5px 12px;
    border-radius: 20px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .ready-pill::before {
    content: '';
    width: 7px; height: 7px;
    background: #10b981;
    border-radius: 50%;
  }

  .signoff-right {
    text-align: right;
  }

  .signoff-right .small {
    font-size: 9px;
    color: #64748b;
    margin-top: 3px;
  }
</style>
</head>
<body>

<!-- ══════════════════════════════════════════════════════
     PAGE 1 — UNDERWRITING & METRICS OVERVIEW
     ══════════════════════════════════════════════════════ -->
<div class="page">
  <div class="page-content">

    <!-- Header -->
    <div class="header">
      <div class="brand-lockup">
        <div class="clinaza-icon">
          <img src="${clinazaBase64}" alt="Clinaza" />
        </div>
        <div>
          <div class="brand-name">CLINAZA</div>
          <div class="brand-sub">Healthcare Financing</div>
        </div>
        <div class="cross-mark">×</div>
        <div class="easebuzz-logo">
          ${easebuzzSvg}
        </div>
      </div>
      <div class="header-right">
        <div class="header-tag">Confidential — Risk & Underwriting Review</div>
        <div class="header-date">Easebuzz Lead: <strong>Pritam Das</strong> (BDM - Neo Banking) · 28 Oct 2026</div>
      </div>
    </div>

    <!-- Page Title -->
    <div class="page-title">
      <h1>Cardless EMI & Patient Financing<br/>Business Profile</h1>
      <p>Submission for Easebuzz Product & Risk Review Committee · Full 28-Clinic Network Onboarding</p>
    </div>

    <!-- 4 KPI Cards -->
    <div class="kpi-row">
      <div class="kpi-box">
        <div class="label">1. Blended ATS</div>
        <div class="value">₹48K–₹55K</div>
        <div class="sub">High-ticket elective dental</div>
      </div>
      <div class="kpi-box green">
        <div class="label">2. Monthly Cases</div>
        <div class="value">200–250/mo</div>
        <div class="sub">Immediate Cohort · 28 clinics</div>
      </div>
      <div class="kpi-box orange">
        <div class="label">3. Monthly GMV</div>
        <div class="value">₹1.0+ Cr/mo</div>
        <div class="sub">₹12 Cr+ annualized run-rate</div>
      </div>
      <div class="kpi-box purple">
        <div class="label">4. Desk Traffic</div>
        <div class="value">750–850/mo</div>
        <div class="sub">60% ETB + 40% NTB</div>
      </div>
    </div>

    <!-- Underwriting Answers -->
    <div class="section-head">
      <div class="dot"></div>
      <h2>Underwriting Responses</h2>
      <div class="tag">Easebuzz Intake</div>
    </div>

    <!-- Card 1: ATS -->
    <div class="card">
      <h3>
        1. Average Ticket Size (ATS) & Procedure Breakdown
        <span class="pill">Blended ATS ₹50,000</span>
      </h3>
      <p>Clinaza's clinic network focuses on <strong>high-ticket elective procedures</strong> where patients defer treatment due to upfront lump-sum costs:</p>
      <table class="clean-table">
        <thead>
          <tr>
            <th>Procedure</th>
            <th class="num">Ticket Range</th>
            <th class="num">EMI Tenure</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Dental Implants</strong> (Single / Full Arch)</td>
            <td class="num">₹35,000 – ₹70,000</td>
            <td class="num">6–12 months</td>
          </tr>
          <tr>
            <td><strong>Invisible Aligners</strong> (Clear Aligner Therapy)</td>
            <td class="num">₹50,000 – ₹1,20,000</td>
            <td class="num">9–18 months</td>
          </tr>
          <tr>
            <td><strong>Full-Mouth Rehabilitation</strong> & Prosthodontics</td>
            <td class="num">₹40,000 – ₹1,50,000</td>
            <td class="num">12–24 months</td>
          </tr>
          <tr>
            <td><strong>Cosmetic Smile Design</strong> & Root Canal</td>
            <td class="num">₹18,000 – ₹35,000</td>
            <td class="num">3–6 months</td>
          </tr>
        </tbody>
      </table>
      <div class="callout">
        <strong>Low Default Risk:</strong> Healthcare EMI portfolios carry the lowest NPA rates in retail lending (&lt;1.2%) — patients maintain repayment discipline due to ongoing clinical follow-ups and a trusted doctor relationship.
      </div>
    </div>

    <!-- Card 2: Cases & GMV -->
    <div class="card">
      <h3>
        2 & 3. Projected Cardless EMI Cases & Monthly GMV
        <span class="pill">Growth Trajectory</span>
      </h3>
      <table class="clean-table">
        <thead>
          <tr>
            <th>Onboarding Stage</th>
            <th class="num">Active Clinics</th>
            <th class="num">Loans / Month</th>
            <th class="num">Monthly GMV</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Immediate Network Launch</strong> — Full Active Cohort</td>
            <td class="num">28 Clinics</td>
            <td class="num">200 – 250</td>
            <td class="num gmv"><strong>₹1.00 – ₹1.15 Crore</strong></td>
          </tr>
          <tr>
            <td><strong>Expansion Phase</strong> — Months 3–6 Scale</td>
            <td class="num">55 Clinics</td>
            <td class="num">400 – 450</td>
            <td class="num gmv"><strong>₹2.00 – ₹2.25 Crore</strong></td>
          </tr>
          <tr>
            <td><strong>Annual Run-Rate Horizon</strong> — Year 1 Target</td>
            <td class="num">100+ Clinics</td>
            <td class="num">800+</td>
            <td class="num gmv"><strong>₹4.00+ Crore</strong></td>
          </tr>
        </tbody>
      </table>
      <div class="callout orange">
        <strong>Conversion Benchmark:</strong> 1 in 3 chairside consultations quoted above ₹35,000 opts for monthly EMIs — immediately unblocking deferred treatments and lifting clinic revenue by 25–40%.
      </div>
    </div>

  </div>

  <div class="footer">
    <div><strong>Clinaza Technologies</strong> × Easebuzz Neo Banking · Review Dossier</div>
    <div>Page 1 of 3 · <a href="https://clinaza.in">clinaza.in</a></div>
  </div>
</div>


<!-- ══════════════════════════════════════════════════════
     PAGE 2 — COMPLETE 28-CLINIC ONBOARDING COHORT
     ══════════════════════════════════════════════════════ -->
<div class="page page-table">
  <div class="page-content">

    <div class="header">
      <div class="brand-lockup">
        <div class="clinaza-icon">
          <img src="${clinazaBase64}" alt="Clinaza" />
        </div>
        <div>
          <div class="brand-name">CLINAZA</div>
          <div class="brand-sub">Healthcare Financing</div>
        </div>
        <div class="cross-mark">×</div>
        <div class="easebuzz-logo">
          ${easebuzzSvg}
        </div>
      </div>
      <div class="header-right">
        <div class="header-tag" style="background: #0284c7;">Full Network Onboarding · 28 Clinics Ready</div>
        <div class="header-date">100% Documentation Ready · <strong>Sub-Merchant IDs to be Generated</strong></div>
      </div>
    </div>

    <!-- 28 Clinics Table -->
    <div class="section-head" style="margin-bottom: 5px;">
      <div class="dot"></div>
      <h2>Full Network Onboarding Cohort — All 28 Verified Dental Clinics</h2>
      <div class="tag">KYC Verified · Bank A/C Ready</div>
    </div>

    <table class="clean-table compact" style="border: 1.5px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <thead>
        <tr>
          <th style="width: 3%;">#</th>
          <th style="width: 28%;">Clinic Name</th>
          <th style="width: 19%;">Lead Doctor</th>
          <th style="width: 15%;">City & State</th>
          <th class="num" style="width: 5%;">Chairs</th>
          <th class="num" style="width: 11%;">Avg Ticket</th>
          <th class="num" style="width: 6%;">Loans</th>
          <th class="num" style="width: 13%;">GMV / mo</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td><span class="clinic-name">Vasantha Dental & Implant Center</span></td>
          <td>Dr. Siddardha Chaitanya</td>
          <td>Visakhapatnam, AP</td>
          <td class="num">3</td>
          <td class="num">₹1,00,000</td>
          <td class="num">10</td>
          <td class="num gmv">₹10,00,000</td>
        </tr>
        <tr>
          <td>2</td>
          <td><span class="clinic-name">Sai Multispeciality & Implant Center</span></td>
          <td>Dr. S. Vishwakarma</td>
          <td>Navi Mumbai, MH</td>
          <td class="num">2</td>
          <td class="num">₹35,000</td>
          <td class="num">25</td>
          <td class="num gmv">₹8,75,000</td>
        </tr>
        <tr>
          <td>3</td>
          <td><span class="clinic-name">My Family Dentist & Implant</span></td>
          <td>Dr. Shikha Tripathi</td>
          <td>Haridwar, UK</td>
          <td class="num">3</td>
          <td class="num">₹50,000</td>
          <td class="num">15</td>
          <td class="num gmv">₹7,50,000</td>
        </tr>
        <tr>
          <td>4</td>
          <td><span class="clinic-name">Shan Glow Healthcare</span></td>
          <td>Dr. Shanmuga Teja</td>
          <td>Chennai, TN</td>
          <td class="num">Multi</td>
          <td class="num">₹35,000</td>
          <td class="num">20</td>
          <td class="num gmv">₹7,00,000</td>
        </tr>
        <tr>
          <td>5</td>
          <td><span class="clinic-name">Dr. Amitha Family Dental Care</span></td>
          <td>Dr. Amitha</td>
          <td>Bengaluru, KA</td>
          <td class="num">3</td>
          <td class="num">₹40,000</td>
          <td class="num">15</td>
          <td class="num gmv">₹6,00,000</td>
        </tr>
        <tr>
          <td>6</td>
          <td><span class="clinic-name">Dantsri Dental Hospital</span></td>
          <td>Medical Director</td>
          <td>Jhanjharpur, BR</td>
          <td class="num">4+</td>
          <td class="num">₹35,000</td>
          <td class="num">14</td>
          <td class="num gmv">₹4,90,000</td>
        </tr>
        <tr>
          <td>7</td>
          <td><span class="clinic-name">Trimurti Multi-Speciality Dental</span></td>
          <td>Dr. Priyal Patel</td>
          <td>Mumbai, MH</td>
          <td class="num">1</td>
          <td class="num">₹40,000</td>
          <td class="num">10</td>
          <td class="num gmv">₹4,00,000</td>
        </tr>
        <tr>
          <td>8</td>
          <td><span class="clinic-name">WhiteDent Dental Clinic</span></td>
          <td>Dr. Anshuman Nagre</td>
          <td>Buldhana, MH</td>
          <td class="num">1</td>
          <td class="num">₹60,000</td>
          <td class="num">6</td>
          <td class="num gmv">₹3,60,000</td>
        </tr>
        <tr>
          <td>9</td>
          <td><span class="clinic-name">YFDL Dental Lab Experts</span></td>
          <td>Dr. Nihar Bhayani</td>
          <td>Mumbai, MH</td>
          <td class="num">2</td>
          <td class="num">₹45,000</td>
          <td class="num">8</td>
          <td class="num gmv">₹3,60,000</td>
        </tr>
        <tr>
          <td>10</td>
          <td><span class="clinic-name">Kids and Braces Dental Clinic</span></td>
          <td>Dr. Rahul Tiwari</td>
          <td>Prayagraj, UP</td>
          <td class="num">2</td>
          <td class="num">₹50,000</td>
          <td class="num">7</td>
          <td class="num gmv">₹3,50,000</td>
        </tr>
        <tr>
          <td>11</td>
          <td><span class="clinic-name">Lotus Family Dental</span></td>
          <td>Dr. Monika Pandey</td>
          <td>Prayagraj, UP</td>
          <td class="num">1</td>
          <td class="num">₹50,000</td>
          <td class="num">7</td>
          <td class="num gmv">₹3,50,000</td>
        </tr>
        <tr>
          <td>12</td>
          <td><span class="clinic-name">EXL Dentists</span></td>
          <td>Dr. Priyanka Kumar</td>
          <td>Gurugram, NCR</td>
          <td class="num">2</td>
          <td class="num">₹50,000</td>
          <td class="num">6</td>
          <td class="num gmv">₹3,00,000</td>
        </tr>
        <tr>
          <td>13</td>
          <td><span class="clinic-name">Impressions Dental & Laser Clinic</span></td>
          <td>Dr. Dushyant Soni</td>
          <td>Jodhpur, RJ</td>
          <td class="num">3</td>
          <td class="num">₹50,000</td>
          <td class="num">6</td>
          <td class="num gmv">₹3,00,000</td>
        </tr>
        <tr>
          <td>14</td>
          <td><span class="clinic-name">Auro Dental & Healthcare</span></td>
          <td>Dr. Akshit Juneja</td>
          <td>Hanumangarh, RJ</td>
          <td class="num">2</td>
          <td class="num">₹50,000</td>
          <td class="num">6</td>
          <td class="num gmv">₹3,00,000</td>
        </tr>
        <tr>
          <td>15</td>
          <td><span class="clinic-name">Step To Smile Dental Clinic</span></td>
          <td>Dr. Naveen Konatham</td>
          <td>Hyderabad, TS</td>
          <td class="num">2</td>
          <td class="num">₹35,000</td>
          <td class="num">8</td>
          <td class="num gmv">₹2,80,000</td>
        </tr>
        <tr>
          <td>16</td>
          <td><span class="clinic-name">Keep Smiling Dental Clinic</span></td>
          <td>Dr. Anil Sangwan</td>
          <td>New Delhi</td>
          <td class="num">4+</td>
          <td class="num">₹35,000</td>
          <td class="num">8</td>
          <td class="num gmv">₹2,80,000</td>
        </tr>
        <tr>
          <td>17</td>
          <td><span class="clinic-name">Smile Nation Multi-Speciality</span></td>
          <td>Dr. Komal Bagde</td>
          <td>Pune, MH</td>
          <td class="num">2</td>
          <td class="num">₹50,000</td>
          <td class="num">5</td>
          <td class="num gmv">₹2,50,000</td>
        </tr>
        <tr>
          <td>18</td>
          <td><span class="clinic-name">Dr. Pawar's Advanced Dentistry</span></td>
          <td>Dr. Pallavi Pawar</td>
          <td>Thane, MH</td>
          <td class="num">1</td>
          <td class="num">₹40,000</td>
          <td class="num">6</td>
          <td class="num gmv">₹2,40,000</td>
        </tr>
        <tr>
          <td>19</td>
          <td><span class="clinic-name">Kiran Dental Care</span></td>
          <td>Dr. S. Dangroliya</td>
          <td>Dholpur, RJ</td>
          <td class="num">1</td>
          <td class="num">₹30,000</td>
          <td class="num">7</td>
          <td class="num gmv">₹2,10,000</td>
        </tr>
        <tr>
          <td>20</td>
          <td><span class="clinic-name">Prodent Dental Clinic</span></td>
          <td>Dr. Sakshi</td>
          <td>Patna, BR</td>
          <td class="num">1</td>
          <td class="num">₹35,000</td>
          <td class="num">6</td>
          <td class="num gmv">₹2,10,000</td>
        </tr>
        <tr>
          <td>21</td>
          <td><span class="clinic-name">Smile Dental Clinic</span></td>
          <td>Dr. Harshit Kumar</td>
          <td>Patna, BR</td>
          <td class="num">1</td>
          <td class="num">₹35,000</td>
          <td class="num">6</td>
          <td class="num gmv">₹2,10,000</td>
        </tr>
        <tr>
          <td>22</td>
          <td><span class="clinic-name">Dental World Dwarka</span></td>
          <td>Dr. Anuradha Singh</td>
          <td>New Delhi</td>
          <td class="num">3</td>
          <td class="num">₹50,000</td>
          <td class="num">4</td>
          <td class="num gmv">₹2,00,000</td>
        </tr>
        <tr>
          <td>23</td>
          <td><span class="clinic-name">Tandon Dental & Implant Centre</span></td>
          <td>Dr. Devan Tandon</td>
          <td>Ludhiana, PB</td>
          <td class="num">2</td>
          <td class="num">₹40,000</td>
          <td class="num">5</td>
          <td class="num gmv">₹2,00,000</td>
        </tr>
        <tr>
          <td>24</td>
          <td><span class="clinic-name">Ambika Dental Care</span></td>
          <td>Dr. Anant Kumar</td>
          <td>Patna, BR</td>
          <td class="num">1</td>
          <td class="num">₹30,000</td>
          <td class="num">6</td>
          <td class="num gmv">₹1,80,000</td>
        </tr>
        <tr>
          <td>25</td>
          <td><span class="clinic-name">Ratan Krishna Dental Care</span></td>
          <td>Dr. Dinesh Gupta</td>
          <td>Visakhapatnam, AP</td>
          <td class="num">1</td>
          <td class="num">₹30,000</td>
          <td class="num">6</td>
          <td class="num gmv">₹1,80,000</td>
        </tr>
        <tr>
          <td>26</td>
          <td><span class="clinic-name">Kidz N Family TrueSmile Dental</span></td>
          <td>Dr. Y. Sreedhara</td>
          <td>Kurnool, AP</td>
          <td class="num">2</td>
          <td class="num">₹30,000</td>
          <td class="num">5</td>
          <td class="num gmv">₹1,50,000</td>
        </tr>
        <tr>
          <td>27</td>
          <td><span class="clinic-name">Tirupati Balaji Dental & Face</span></td>
          <td>Dr. Himanshu Garg</td>
          <td>Chandigarh (UT)</td>
          <td class="num">1</td>
          <td class="num">₹50,000</td>
          <td class="num">3</td>
          <td class="num gmv">₹1,50,000</td>
        </tr>
        <tr>
          <td>28</td>
          <td><span class="clinic-name">Your Dentist Patna</span></td>
          <td>Dr. Aryan Parmar</td>
          <td>Patna, BR</td>
          <td class="num">2</td>
          <td class="num">₹30,000</td>
          <td class="num">4</td>
          <td class="num gmv">₹1,20,000</td>
        </tr>
        <tr class="total-row">
          <td colspan="4"><strong>COHORT TOTAL — ALL 28 CLINICS ONBOARDING</strong></td>
          <td class="num"><strong>55+</strong></td>
          <td class="num"><strong>₹48K avg</strong></td>
          <td class="num"><strong>~230</strong></td>
          <td class="num" style="font-size: 11px; color: #047857;"><strong>₹1,06,25,000 / mo</strong></td>
        </tr>
      </tbody>
    </table>

  </div>

  <div class="footer">
    <div><strong>Clinaza Technologies</strong> × Easebuzz Neo Banking · Review Dossier</div>
    <div>Page 2 of 3 · <a href="https://clinaza.in">clinaza.in</a></div>
  </div>
</div>


<!-- ══════════════════════════════════════════════════════
     PAGE 3 — TRAFFIC & SETTLEMENT ARCHITECTURE
     ══════════════════════════════════════════════════════ -->
<div class="page">
  <div class="page-content">

    <div class="header">
      <div class="brand-lockup">
        <div class="clinaza-icon">
          <img src="${clinazaBase64}" alt="Clinaza" />
        </div>
        <div>
          <div class="brand-name">CLINAZA</div>
          <div class="brand-sub">Healthcare Financing</div>
        </div>
        <div class="cross-mark">×</div>
        <div class="easebuzz-logo">
          ${easebuzzSvg}
        </div>
      </div>
      <div class="header-right">
        <div class="header-tag" style="background: #0284c7;">Technical & Settlement Architecture</div>
        <div class="header-date">EasySplit API · <strong>RBI Nodal Compliant</strong></div>
      </div>
    </div>

    <!-- Q4: ETB vs NTB -->
    <div class="section-head" style="margin-bottom: 8px;">
      <div class="dot orange"></div>
      <h2>4. Expected Desk Traffic — ETB vs NTB Split</h2>
      <div class="tag" style="background: #fff7ed; color: #c2410c;">Counter Intake Dynamics</div>
    </div>

    <div class="traffic-section">
      <div class="traffic-header">
        <span>750–850 front-desk patient eligibility checks per month</span>
        <span class="conv">Blended disbursal conversion: ~30%</span>
      </div>
      <div class="bar-track">
        <div class="bar-etb">60% ETB — Pre-Approved Limits (~480–510)</div>
        <div class="bar-ntb">40% NTB — Fresh e-KYC (~320–340)</div>
      </div>
      <div class="traffic-cards">
        <div class="t-card">
          <h4>ETB: Existing-to-Bank Pre-Approved</h4>
          <div class="tag blue">~480–510 inquiries / month</div>
          <p>
            Urban salaried patients holding <strong>pre-approved cardless credit limits</strong> with Easebuzz lender partners (IDFC FIRST, HDFC, ICICI, Fibe, TVS Credit, Zype). Instant OTP verification yields <strong>65%–70% checkout conversion</strong>.
          </p>
        </div>
        <div class="t-card">
          <h4>NTB: Fresh Chairside e-KYC</h4>
          <div class="tag orange">~320–340 inquiries / month</div>
          <p>
            Patients without existing credit limits who complete a <strong>2-minute digital bureau check</strong> (CIBIL &gt;650) and paperless Aadhaar/PAN verification at the front desk. Approval rate: <strong>40%–50%</strong>.
          </p>
        </div>
      </div>
    </div>

    <!-- Settlement Architecture -->
    <div class="section-head" style="margin-bottom: 8px;">
      <div class="dot"></div>
      <h2>EasySplit Settlement Architecture & Front-Desk UX Flow</h2>
      <div class="tag">Automated T+1</div>
    </div>

    <div class="two-col">
      <div class="card" style="margin-bottom: 0;">
        <h3>
          Direct T+1 Split Settlement
          <span class="pill" style="background: #ecfdf5; color: #065f46; border-color: #86efac;">Nodal Flow</span>
        </h3>
        <p style="margin-bottom: 8px;">
          Easebuzz's <strong>EasySplit API</strong> automatically bifurcates each transaction at settlement — zero manual reconciliation:
        </p>

        <div class="step-box">
          <div class="step-head">
            <span class="step-num">1</span>
            Sub-Merchant Principal Disbursal
          </div>
          <p>Treatment principal (e.g. 98.5%) settles directly into the clinic's verified current account on <strong>T+1</strong>.</p>
        </div>

        <div class="step-box">
          <div class="step-head">
            <span class="step-num">2</span>
            Platform Fee Split
          </div>
          <p>Clinaza platform enablement fee (e.g. 1.5%) routes into Clinaza's current account simultaneously.</p>
        </div>

        <div class="step-box">
          <div class="step-head">
            <span class="step-num">3</span>
            RBI Nodal Compliance
          </div>
          <p>Zero fund custody or co-mingling. Clinaza never holds or pools medical transaction proceeds at any point.</p>
        </div>
      </div>

      <div class="card" style="margin-bottom: 0;">
        <h3>
          Chairside Front-Desk Checkout UX
          <span class="pill" style="background: #fff7ed; color: #c2410c; border-color: #fed7aa;">3-Minute Flow</span>
        </h3>
        <p style="margin-bottom: 8px;">
          Zero hardware footprint. The entire checkout happens on the patient's phone at the front desk:
        </p>

        <div class="step-box">
          <div class="step-head">
            <span class="step-num orange">1</span>
            Reception Quote & QR Scan
          </div>
          <p>Receptionist creates treatment estimate (e.g. ₹60,000). Patient scans Clinaza-Easebuzz QR on counter.</p>
        </div>

        <div class="step-box">
          <div class="step-head">
            <span class="step-num orange">2</span>
            Instant Underwriting & OTP
          </div>
          <p>Patient enters mobile. Easebuzz checks ETB pre-approved limits or triggers 2-min paperless KYC.</p>
        </div>

        <div class="step-box">
          <div class="step-head">
            <span class="step-num orange">3</span>
            Immediate Disbursal & Booking
          </div>
          <p>Loan approved chairside in real-time. Clinic receives instant SMS confirmation — treatment starts immediately.</p>
        </div>
      </div>
    </div>

    <!-- Dark Summary Banner -->
    <div class="dark-banner">
      <div>
        <h4>Zero Setup Fee Aggregator Model</h4>
        <p>Clinaza aggregates 28 verified clinics delivering ₹1+ Crore monthly healthcare payment volume on Easebuzz's licensed PA rails.</p>
      </div>
      <div>
        <div class="big-num">₹1.0+ Cr</div>
        <div class="big-label">Immediate Monthly GMV</div>
      </div>
    </div>

    <!-- Signoff -->
    <div class="signoff">
      <div class="signoff-left">
        <div class="avatar">PR</div>
        <div class="signoff-info">
          <h4>Pratyush Raj — Founder & CEO, Clinaza Technologies</h4>
          <p>
            Direct: <strong>+91 7292984244</strong> · Email: <a href="mailto:contact@clinaza.in">contact@clinaza.in</a> · Web: <a href="https://clinaza.in">clinaza.in</a>
          </p>
        </div>
      </div>
      <div class="signoff-right">
        <div class="ready-pill">Ready for 28 Sub-Merchant Creations</div>
        <div class="small">28 verified current accounts & cancelled cheques on standby</div>
      </div>
    </div>

  </div>

  <div class="footer">
    <div><strong>Clinaza Technologies</strong> × Easebuzz Neo Banking · Review Dossier</div>
    <div>Page 3 of 3 · <a href="https://clinaza.in">clinaza.in</a></div>
  </div>
</div>

</body>
</html>
`;

async function generatePDF() {
  const desktopPdfPath = '/Users/pratyushraj/Desktop/Clinaza_Easebuzz_Cardless_EMI_Review.pdf';
  const repoPdfPath = path.join(__dirname, '../public/docs/Clinaza_Easebuzz_Cardless_EMI_Review.pdf');
  const preview1Path = path.join(__dirname, '../public/docs/easebuzz_preview_p1.png');
  const preview2Path = path.join(__dirname, '../public/docs/easebuzz_preview_p2.png');
  const preview3Path = path.join(__dirname, '../public/docs/easebuzz_preview_p3.png');

  console.log('Launching Chrome...');
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1697, deviceScaleFactor: 2 });
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  await page.pdf({
    path: desktopPdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' }
  });

  fs.copyFileSync(desktopPdfPath, repoPdfPath);

  const pageElements = await page.$$('.page');
  if (pageElements[0]) await pageElements[0].screenshot({ path: preview1Path });
  if (pageElements[1]) await pageElements[1].screenshot({ path: preview2Path });
  if (pageElements[2]) await pageElements[2].screenshot({ path: preview3Path });

  await browser.close();

  const sizeKB = Math.round(fs.statSync(desktopPdfPath).size / 1024);
  console.log(`✅ PDF generated (${sizeKB} KB):`);
  console.log('   Desktop:', desktopPdfPath);
  console.log('   Repo:   ', repoPdfPath);
  console.log('   Previews:', preview1Path, preview2Path, preview3Path);
}

generatePDF().catch(err => {
  console.error('Failed:', err);
  process.exit(1);
});
