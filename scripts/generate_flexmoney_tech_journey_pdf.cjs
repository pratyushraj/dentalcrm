const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

// Function to encode image to base64
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
const flexmoneyBase64 = getBase64Image(path.join(__dirname, '../public/assets/flexmoney_logo.png'));

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Clinaza x Flexmoney — Top 10 Clinics & Technical Journey Flow</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

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
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background: #f8fafc;
    color: #0f172a;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .page {
    width: 210mm;
    height: 297mm;
    margin: 0 auto;
    background: #ffffff;
    position: relative;
    overflow: hidden;
    padding: 13mm 16mm 11mm 16mm;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    page-break-after: always;
  }

  .page:last-child {
    page-break-after: avoid;
  }

  /* Header */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 4mm;
    border-bottom: 1.5px solid #e2e8f0;
    margin-bottom: 4.5mm;
  }

  .brand-group {
    display: flex;
    align-items: center;
    gap: 3mm;
  }

  .brand-logo {
    width: 11mm;
    height: 11mm;
    border-radius: 2.2mm;
    border: 1px solid #cbd5e1;
    object-fit: cover;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  }

  .brand-text h1 {
    font-size: 14pt;
    font-weight: 900;
    color: #0A193C;
    letter-spacing: -0.3px;
    line-height: 1.1;
  }

  .brand-text span {
    font-size: 7.2pt;
    color: #0867E8;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    display: block;
  }

  .partner-divider {
    font-size: 11pt;
    font-weight: 300;
    color: #94a3b8;
    margin: 0 1.5mm;
  }

  .flexmoney-logo-wrap {
    display: flex;
    align-items: center;
    background: #ffffff;
    padding: 1.2mm 2.8mm;
    border-radius: 2mm;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  }

  .flexmoney-logo-img {
    height: 6.8mm;
    width: auto;
    object-fit: contain;
    display: block;
  }

  .header-badge {
    text-align: right;
  }

  .header-badge .badge-label {
    font-size: 6.8pt;
    font-weight: 800;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.6px;
  }

  .header-badge .badge-val {
    font-size: 9.5pt;
    font-weight: 900;
    color: #0A193C;
  }

  /* Section Kicker & Titles */
  .section-kicker {
    font-size: 7.2pt;
    font-weight: 800;
    color: #0867E8;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-bottom: 1.2mm;
    display: inline-block;
    background: #eff6ff;
    padding: 0.8mm 2.2mm;
    border-radius: 1.2mm;
    border: 1px solid #dbeafe;
  }

  .main-title {
    font-size: 15.5pt;
    font-weight: 900;
    color: #0A193C;
    line-height: 1.2;
    margin-bottom: 1.8mm;
    letter-spacing: -0.4px;
  }

  .subtitle {
    font-size: 8.2pt;
    color: #475569;
    line-height: 1.4;
    margin-bottom: 4mm;
  }

  /* Metrics Grid */
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2.8mm;
    margin-bottom: 4.5mm;
  }

  .metric-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 2.2mm;
    padding: 2.6mm 3mm;
    border-left: 3.5px solid #0867E8;
    box-shadow: 0 1px 2px rgba(0,0,0,0.03);
  }

  .metric-card.green {
    border-left-color: #10b981;
  }

  .metric-card.teal {
    border-left-color: #0d9488;
  }

  .metric-card.navy {
    border-left-color: #0A193C;
  }

  .metric-val {
    font-size: 12.5pt;
    font-weight: 900;
    color: #0A193C;
    line-height: 1.1;
  }

  .metric-lbl {
    font-size: 6.8pt;
    font-weight: 800;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    margin-top: 0.8mm;
  }

  /* Table */
  .table-wrapper {
    border: 1px solid #cbd5e1;
    border-radius: 2.2mm;
    overflow: hidden;
    margin-bottom: 3.8mm;
    box-shadow: 0 1px 3px rgba(0,0,0,0.03);
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 7.8pt;
  }

  th {
    background: #0A193C;
    color: #ffffff;
    font-weight: 800;
    text-align: left;
    padding: 2.4mm 3mm;
    font-size: 7pt;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }

  th.right, td.right {
    text-align: right;
  }

  td {
    padding: 2.2mm 3mm;
    border-bottom: 1px solid #f1f5f9;
    color: #334155;
    line-height: 1.25;
  }

  tr:nth-child(even) td {
    background: #f8fafc;
  }

  tr:last-child td {
    border-bottom: none;
  }

  .clinic-name-cell {
    font-weight: 800;
    color: #0A193C;
  }

  .clinic-city {
    font-weight: 500;
    color: #64748b;
    font-size: 7pt;
  }

  .highlight-gmv {
    font-weight: 800;
    color: #0867E8;
  }

  /* Callout Box */
  .callout-box {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 2.2mm;
    padding: 2.8mm 3.6mm;
    margin-bottom: 3.5mm;
  }

  .callout-title {
    font-size: 7.8pt;
    font-weight: 800;
    color: #166534;
    margin-bottom: 0.8mm;
    display: flex;
    align-items: center;
    gap: 1.5mm;
  }

  .badge-verified {
    display: inline-block;
    padding: 0.4mm 1.6mm;
    border-radius: 0.8mm;
    font-size: 6.5pt;
    font-weight: 800;
    background: #dcfce7;
    color: #15803d;
    border: 1px solid #86efac;
  }

  .callout-desc {
    font-size: 7.2pt;
    color: #1e3a29;
    line-height: 1.4;
  }

  /* Footer */
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #e2e8f0;
    padding-top: 2.6mm;
    font-size: 6.8pt;
    color: #94a3b8;
    font-weight: 600;
  }

  /* PAGE 2 STYLES */
  .flow-step-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 2.2mm;
    margin-bottom: 4mm;
  }

  .flow-card {
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 2.2mm;
    padding: 2.8mm;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    box-shadow: 0 1px 2px rgba(0,0,0,0.03);
  }

  .flow-number {
    font-size: 7.2pt;
    font-weight: 900;
    color: #0867E8;
    margin-bottom: 0.8mm;
    display: flex;
    align-items: center;
    gap: 1mm;
  }

  .flow-title {
    font-size: 8.2pt;
    font-weight: 800;
    color: #0A193C;
    line-height: 1.2;
    margin-bottom: 1.2mm;
  }

  .flow-desc {
    font-size: 6.8pt;
    color: #64748b;
    line-height: 1.35;
  }

  .flow-tag {
    margin-top: 1.8mm;
    font-size: 6.3pt;
    font-weight: 800;
    color: #0A193C;
    background: #eff6ff;
    border: 1px solid #dbeafe;
    padding: 0.6mm 1.4mm;
    border-radius: 0.8mm;
    display: inline-block;
  }

  /* Split Affordability Callout */
  .split-callout-box {
    background: #f0fdf4;
    border: 1px solid #86efac;
    border-radius: 2mm;
    padding: 2.2mm 3.2mm;
    margin-bottom: 3.5mm;
    display: flex;
    align-items: center;
    gap: 2.5mm;
  }

  .split-callout-icon {
    font-size: 11pt;
    line-height: 1;
    flex-shrink: 0;
  }

  .split-callout-title {
    font-size: 7.4pt;
    font-weight: 800;
    color: #166534;
    margin-bottom: 0.6mm;
  }

  .split-callout-text {
    font-size: 6.6pt;
    color: #14532d;
    line-height: 1.35;
  }

  /* Developer Suites Grid (Matching flexmoney.in/developers) */
  .dev-suites-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2.8mm;
    margin-bottom: 4mm;
  }

  .dev-suite-card {
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 2.2mm;
    padding: 2.8mm 3.2mm;
    box-shadow: 0 1px 3px rgba(0,0,0,0.03);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .dev-suite-card.active-card {
    border-left: 3.5px solid #0867E8;
    background: #fafcfe;
  }

  .dev-suite-header {
    display: flex;
    align-items: center;
    gap: 1.5mm;
    margin-bottom: 1.2mm;
    flex-wrap: wrap;
  }

  .dev-suite-title {
    font-size: 8.2pt;
    font-weight: 900;
    color: #0A193C;
  }

  .badge-tag {
    font-size: 5.8pt;
    font-weight: 800;
    padding: 0.4mm 1.6mm;
    border-radius: 0.8mm;
    letter-spacing: 0.3px;
    text-transform: uppercase;
  }

  .badge-tag.blue { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
  .badge-tag.purple { background: #faf5ff; color: #7e22ce; border: 1px solid #e9d5ff; }
  .badge-tag.amber { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }
  .badge-tag.emerald { background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; }

  .badge-role {
    font-size: 5.8pt;
    font-weight: 800;
    padding: 0.4mm 1.6mm;
    border-radius: 0.8mm;
    margin-left: auto;
  }

  .badge-role.primary { background: #0A193C; color: #ffffff; }
  .badge-role.optional { background: #f1f5f9; color: #475569; }
  .badge-role.native { background: #e0f2fe; color: #0369a1; }

  .dev-suite-desc {
    font-size: 6.8pt;
    color: #475569;
    line-height: 1.38;
    margin-bottom: 1.5mm;
  }

  .dev-suite-feats {
    list-style: none;
    font-size: 6.5pt;
    color: #0f172a;
    line-height: 1.4;
  }

  .dev-suite-feats li {
    margin-bottom: 0.5mm;
    color: #334155;
  }

  /* Architecture 3-Column Grid */
  .arch-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 3mm;
    margin-bottom: 3.5mm;
  }

  .arch-box {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 2.2mm;
    padding: 3mm;
    box-shadow: 0 1px 2px rgba(0,0,0,0.03);
  }

  .arch-box.primary {
    border-top: 3px solid #0867E8;
  }

  .arch-box.secondary {
    border-top: 3px solid #0d9488;
  }

  .arch-box.tertiary {
    border-top: 3px solid #0A193C;
  }

  .arch-header {
    font-size: 8.4pt;
    font-weight: 800;
    color: #0A193C;
    margin-bottom: 1.2mm;
  }

  .arch-list {
    list-style: none;
    font-size: 7pt;
    color: #475569;
    line-height: 1.45;
  }

  .arch-list li {
    position: relative;
    padding-left: 2.8mm;
    margin-bottom: 0.8mm;
  }

  .arch-list li::before {
    content: "•";
    position: absolute;
    left: 0;
    color: #0867E8;
    font-weight: bold;
  }
</style>
</head>
<body>

<!-- PAGE 1: TOP 10 CLINIC COHORT & VOLUME -->
<div class="page">
  <div>
    <div class="header">
      <div class="brand-group">
        ${logoBase64 ? `<img src="${logoBase64}" class="brand-logo" alt="Clinaza">` : ''}
        <div class="brand-text">
          <h1>CLINAZA</h1>
          <span>Healthcare Embedded Finance</span>
        </div>
        <div class="partner-divider">✕</div>
        <div class="flexmoney-logo-wrap">
          ${flexmoneyBase64 ? `<img src="${flexmoneyBase64}" class="flexmoney-logo-img" alt="Flexmoney">` : '<span style="font-weight:900;color:#0A193C;">flexmoney</span>'}
        </div>
      </div>
      <div class="header-badge">
        <div class="badge-label">Commercial Integration Rail</div>
        <div class="badge-val">Flexmoney InstaCred Network</div>
      </div>
    </div>

    <div>
      <span class="section-kicker">Launch Execution Cohort</span>
      <h2 class="main-title">Top 10 Launch Clinics & Projected Loan Volumes</h2>
      <p class="subtitle">
        Curated from Clinaza's active network of 25+ dental & elective surgical practices across India. Every clinic is pre-screened with verified Current Account, GST/Udyam, and Cancelled Cheque ready for instant digital onboarding.
      </p>
    </div>

    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-val">10 Clinics</div>
        <div class="metric-lbl">Initial Batch Cohort</div>
      </div>
      <div class="metric-card green">
        <div class="metric-val">₹35.2L – ₹48.6L</div>
        <div class="metric-lbl">Monthly Projected GMV</div>
      </div>
      <div class="metric-card teal">
        <div class="metric-val">₹46,000</div>
        <div class="metric-lbl">Average Ticket Size (ATS)</div>
      </div>
      <div class="metric-card navy">
        <div class="metric-val">100% Ready</div>
        <div class="metric-lbl">KYC & Banking Verified</div>
      </div>
    </div>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th style="width: 44%;">Clinic Name & Location</th>
            <th style="width: 14%;">Chairs</th>
            <th class="right" style="width: 13%;">Avg Ticket</th>
            <th class="right" style="width: 14%;">Monthly Cases</th>
            <th class="right" style="width: 15%;">Est. Monthly GMV</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div class="clinic-name-cell">Vasantha Dental & Implant Center</div>
              <div class="clinic-city">Visakhapatnam, Andhra Pradesh</div>
            </td>
            <td>3 Chairs</td>
            <td class="right font-bold">₹1,00,000</td>
            <td class="right">8 – 10</td>
            <td class="right highlight-gmv">₹6.0L – ₹8.0L</td>
          </tr>
          <tr>
            <td>
              <div class="clinic-name-cell">Step To Smile Dental Clinic</div>
              <div class="clinic-city">Hyderabad, Telangana</div>
            </td>
            <td>2 Chairs</td>
            <td class="right">₹45,000</td>
            <td class="right">6 – 8</td>
            <td class="right highlight-gmv">₹3.6L – ₹4.5L</td>
          </tr>
          <tr>
            <td>
              <div class="clinic-name-cell">My Family Dentist Implant Centre</div>
              <div class="clinic-city">Haridwar, Uttarakhand</div>
            </td>
            <td>3 Chairs</td>
            <td class="right">₹50,000</td>
            <td class="right">10 – 15</td>
            <td class="right highlight-gmv">₹6.0L – ₹7.5L</td>
          </tr>
          <tr>
            <td>
              <div class="clinic-name-cell">Dr. Amitha Family Dental Care</div>
              <div class="clinic-city">Bengaluru, Karnataka</div>
            </td>
            <td>3 Chairs</td>
            <td class="right">₹45,000</td>
            <td class="right">8 – 12</td>
            <td class="right highlight-gmv">₹3.6L – ₹5.4L</td>
          </tr>
          <tr>
            <td>
              <div class="clinic-name-cell">Tirupati Balaji Dental & Face Clinic</div>
              <div class="clinic-city">Chandigarh (UT)</div>
            </td>
            <td>1 Chair</td>
            <td class="right">₹50,000</td>
            <td class="right">5 – 7</td>
            <td class="right highlight-gmv">₹2.5L – ₹3.5L</td>
          </tr>
          <tr>
            <td>
              <div class="clinic-name-cell">Smile Nation Multispeciality Clinic</div>
              <div class="clinic-city">Pune / Pimpri-Chinchwad, Maharashtra</div>
            </td>
            <td>2 Chairs</td>
            <td class="right">₹50,000</td>
            <td class="right">5 – 8</td>
            <td class="right highlight-gmv">₹2.5L – ₹4.0L</td>
          </tr>
          <tr>
            <td>
              <div class="clinic-name-cell">Sai Multispeciality & Implant Center</div>
              <div class="clinic-city">Navi Mumbai, Maharashtra</div>
            </td>
            <td>2 Chairs</td>
            <td class="right">₹35,000</td>
            <td class="right">10 – 15</td>
            <td class="right highlight-gmv">₹3.5L – ₹5.2L</td>
          </tr>
          <tr>
            <td>
              <div class="clinic-name-cell">Trimurti Multispeciality Dental</div>
              <div class="clinic-city">Mumbai, Maharashtra</div>
            </td>
            <td>1 Chair</td>
            <td class="right">₹40,000</td>
            <td class="right">6 – 8</td>
            <td class="right highlight-gmv">₹2.4L – ₹3.2L</td>
          </tr>
          <tr>
            <td>
              <div class="clinic-name-cell">Dental World Multispeciality Center</div>
              <div class="clinic-city">Dwarka, New Delhi</div>
            </td>
            <td>3 Chairs</td>
            <td class="right">₹50,000</td>
            <td class="right">6 – 9</td>
            <td class="right highlight-gmv">₹3.0L – ₹4.5L</td>
          </tr>
          <tr>
            <td>
              <div class="clinic-name-cell">Keep Smiling Dental Clinic</div>
              <div class="clinic-city">New Delhi, NCR</div>
            </td>
            <td>4+ Chairs</td>
            <td class="right">₹35,000</td>
            <td class="right">6 – 8</td>
            <td class="right highlight-gmv">₹2.1L – ₹2.8L</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="callout-box">
      <div class="callout-title">
        <span>⚡ Anti-Dormancy Onboarding Protocol</span>
        <span class="badge-verified">100% Verified Practices</span>
      </div>
      <div class="callout-desc">
        All 10 practices operate active physical consultation counters with designated front-desk staff trained on Clinaza's QR financing workflow. Verified practice documents (PAN, GST/Udyam, Cancelled Cheque) are pre-collected and ready for seamless digital onboarding agreement execution.
      </div>
    </div>
  </div>

  <div class="footer">
    <span>CLINAZA TECHNOLOGIES • CONFIDENTIAL INTEGRATION DOSSIER</span>
    <span>clinaza.in • contact@clinaza.in • Page 1 of 2</span>
  </div>
</div>

<!-- PAGE 2: TECHNICAL JOURNEY FLOW & ARCHITECTURE -->
<div class="page">
  <div>
    <div class="header">
      <div class="brand-group">
        ${logoBase64 ? `<img src="${logoBase64}" class="brand-logo" alt="Clinaza">` : ''}
        <div class="brand-text">
          <h1>CLINAZA</h1>
          <span>Healthcare Embedded Finance</span>
        </div>
        <div class="partner-divider">✕</div>
        <div class="flexmoney-logo-wrap">
          ${flexmoneyBase64 ? `<img src="${flexmoneyBase64}" class="flexmoney-logo-img" alt="Flexmoney">` : '<span style="font-weight:900;color:#0A193C;">flexmoney</span>'}
        </div>
      </div>
      <div class="header-badge">
        <div class="badge-label">Architecture Specification</div>
        <div class="badge-val">Flexmoney InstaCred Suite</div>
      </div>
    </div>

    <div>
      <span class="section-kicker">Technical Integration Specification</span>
      <h2 class="main-title">End-to-End In-Clinic Patient Journey & Architecture</h2>
      <p class="subtitle">
        Doctor pre-checks patient credit limit chairside ➔ Full procedure financed OR Split Payment (Counter Down Payment + Balance EMI) ➔ Patient completes private OTP & e-NACH on smartphone ➔ Instant S2S webhook disbursal.
      </p>
    </div>

    <!-- 5-Step In-Clinic Flow with Split / Down-Payment Logic -->
    <div class="flow-step-grid">
      <div class="flow-card">
        <div>
          <div class="flow-number">STEP 01</div>
          <div class="flow-title">Pre-Check Limit</div>
          <div class="flow-desc">Patient scans static desk QR standee OR desk queries mobile in Clinaza to check pre-approved credit limits.</div>
        </div>
        <div class="flow-tag">Standee QR / In-Store API</div>
      </div>

      <div class="flow-card">
        <div>
          <div class="flow-number">STEP 02</div>
          <div class="flow-title">Estimate & Split</div>
          <div class="flow-desc">If limit covers 100% ➔ Full EMI. If ₹1L cost and ₹70K limit ➔ ₹30K desk down-payment + ₹70K balance EMI.</div>
        </div>
        <div class="flow-tag">Split / Full EMI</div>
      </div>

      <div class="flow-card">
        <div>
          <div class="flow-number">STEP 03</div>
          <div class="flow-title">WhatsApp / SMS Link</div>
          <div class="flow-desc">Desk pushes instant WhatsApp/SMS payment link to patient's phone. Web SDK opens modal for the net balance.</div>
        </div>
        <div class="flow-tag">Instant Mobile Link</div>
      </div>

      <div class="flow-card">
        <div>
          <div class="flow-number">STEP 04</div>
          <div class="flow-title">OTP & e-Mandate</div>
          <div class="flow-desc">Patient selects tenure (3–24 mo), enters bank OTP, and signs digital e-NACH mandate on their own phone.</div>
        </div>
        <div class="flow-tag">Bank OTP / e-NACH</div>
      </div>

      <div class="flow-card">
        <div>
          <div class="flow-number">STEP 05</div>
          <div class="flow-title">Disbursal & Start</div>
          <div class="flow-desc">Flexmoney dispatches real-time webhook. Doctor sees 100% secured funds; treatment starts immediately!</div>
        </div>
        <div class="flow-tag">Real-Time Webhook</div>
      </div>
    </div>

    <!-- Clinaza Split-Affordability Callout Banner -->
    <div class="split-callout-box">
      <div class="split-callout-icon">💡</div>
      <div>
        <div class="split-callout-title">Clinaza Split-Payment Affordability Engine (e.g. ₹1,00,000 Treatment):</div>
        <div class="split-callout-text">
          <strong>Case A (100% Limit Available):</strong> Treatment ₹70,000 | Pre-approved limit ₹80,000 ➔ <strong>100% converted to monthly EMIs</strong> with zero cash down.<br/>
          <strong>Case B (Partial Limit / Co-Pay):</strong> Treatment ₹1,00,000 | Pre-approved limit ₹70,000 ➔ Patient pays <strong>₹30,000 Down Payment</strong> at clinic counter (UPI/Card/Cash) + <strong>₹70,000 balance on monthly EMIs via Flexmoney InstaCred</strong>. Eliminates treatment deferrals and eliminates clinic bad debt!
        </div>
      </div>
    </div>

    <!-- 4 Developer Suites from flexmoney.in/developers -->
    <div style="margin-bottom: 2mm; display: flex; justify-content: space-between; align-items: center;">
      <span style="font-size: 7.4pt; font-weight: 800; color: #0A193C; text-transform: uppercase; letter-spacing: 0.5px;">Flexmoney Developer Integration Suites (flexmoney.in/developers):</span>
      <span style="font-size: 6.8pt; font-weight: 700; color: #0867E8;">Architecture Selection</span>
    </div>

    <div class="dev-suites-grid">
      <!-- 1. Web SDK -->
      <div class="dev-suite-card active-card">
        <div class="dev-suite-header">
          <div class="dev-suite-title">1. Web SDK</div>
          <span class="badge-tag blue">JAVASCRIPT / TYPESCRIPT</span>
          <span class="badge-role primary">PRIMARY PATIENT FLOW</span>
        </div>
        <p class="dev-suite-desc">
          Drop-in responsive checkout modal embedded directly into Clinaza mobile web checkout. When patient clicks the instant WhatsApp / SMS payment link on their smartphone, the SDK handles mobile OTP authentication, multi-lender credit line selection (3–24 months), and digital mandate completion privately on the patient's device.
        </p>
        <ul class="dev-suite-feats">
          <li>✓ Single &lt;script&gt; tag setup with responsive, visually native UI</li>
          <li>✓ Private OTP verification & tenure selection (no receptionist screen peeking)</li>
          <li>✓ Paperless e-NACH auto-debit setup in under 2 minutes</li>
        </ul>
      </div>

      <!-- 2. API Suite — Online -->
      <div class="dev-suite-card active-card">
        <div class="dev-suite-header">
          <div class="dev-suite-title">2. API Suite — Online</div>
          <span class="badge-tag purple">REST API</span>
          <span class="badge-role primary">PRIMARY BACKEND ENGINE</span>
        </div>
        <p class="dev-suite-desc">
          Server-to-server REST integration for complete transaction lifecycle management. Clinaza backend creates order tokens, passes clinic identifiers, tracks transaction states, and consumes real-time webhook callbacks upon loan approval and disbursement to unlock immediate chairside treatment.
        </p>
        <ul class="dev-suite-feats">
          <li>✓ Eligibility check & S2S order token generation</li>
          <li>✓ Multi-lender dynamic routing & offer surfacing across banking rails</li>
          <li>✓ Real-time webhook callbacks for instant sanction & disbursal status</li>
        </ul>
      </div>

      <!-- 3. API Suite — In-store -->
      <div class="dev-suite-card">
        <div class="dev-suite-header">
          <div class="dev-suite-title">3. API Suite — In-store</div>
          <span class="badge-tag amber">REST API</span>
          <span class="badge-role optional">DESK PRE-CHECK</span>
        </div>
        <p class="dev-suite-desc">
          Purpose-built API for assisted counter pre-qualification. Receptionists enter patient mobile number to perform an instant soft credit limit check across lenders before the doctor presents the final high-ticket procedure estimate (implants, aligners, rehabilitation).
        </p>
        <ul class="dev-suite-feats">
          <li>✓ Instant pre-approved credit visibility prior to consultation</li>
          <li>✓ Reduces drop-offs for high-ticket (₹50K–₹2L) planned treatments</li>
          <li>✓ Zero documentation required for pre-qualification</li>
        </ul>
      </div>

      <!-- 4. CRM Integration -->
      <div class="dev-suite-card">
        <div class="dev-suite-header">
          <div class="dev-suite-title">4. CRM Integration</div>
          <span class="badge-tag emerald">REST API / WEBHOOKS</span>
          <span class="badge-role native">PRACTICE OS SYNC</span>
        </div>
        <p class="dev-suite-desc">
          Direct synchronization of Flexmoney transaction events into Clinaza's clinic operating system. Automatically updates patient treatment records, flags approved EMI disbursements, reconciles practice accounts, and schedules procedure appointments.
        </p>
        <ul class="dev-suite-feats">
          <li>✓ Real-time loan status push directly into clinic CRM calendar</li>
          <li>✓ Automated clinical chart update upon disbursal confirmation</li>
          <li>✓ End-of-day financial reconciliation for practice accountants</li>
        </ul>
      </div>
    </div>

    <!-- Division of Responsibilities -->
    <div class="arch-grid">
      <div class="arch-box primary">
        <div class="arch-header">Clinaza (Desk OS & In-Clinic Flow)</div>
        <ul class="arch-list">
          <li>Doctor case creation & treatment estimates</li>
          <li>Standee QR for limit check & WhatsApp billing links</li>
          <li>Real-time practice dashboard & clinic training</li>
          <li>100% treatment verification (zero cash-out)</li>
        </ul>
      </div>

      <div class="arch-box secondary">
        <div class="arch-header">Flexmoney InstaCred (Affordability)</div>
        <ul class="arch-list">
          <li>Pre-qualification check by mobile number</li>
          <li>Multi-lender credit scoring & dynamic routing</li>
          <li>Mobile OTP authentication & e-mandate (e-NACH)</li>
          <li>Drop-in Web SDK checkout modal</li>
        </ul>
      </div>

      <div class="arch-box tertiary">
        <div class="arch-header">Lender Network (Capital Rail)</div>
        <ul class="arch-list">
          <li>Banks: HDFC, ICICI, Kotak, Axis, Federal, IDFC</li>
          <li>NBFCs: TVS Credit, Zype, Fibe instant sanction</li>
          <li>Automated underwriting & risk scoring</li>
          <li>Direct disbursement to clinic Current Account</li>
        </ul>
      </div>
    </div>
  </div>

  <div class="footer">
    <span>CLINAZA TECHNOLOGIES • CONFIDENTIAL INTEGRATION DOSSIER</span>
    <span>clinaza.in • contact@clinaza.in • Page 2 of 2</span>
  </div>
</div>

</body>
</html>
`;

async function generatePDF() {
  const htmlPath = path.join(__dirname, '../public/docs/clinaza_flexmoney_journey_flow.html');
  const pdfDistPath = path.join(__dirname, '../public/docs/Clinaza_Flexmoney_Top10_Clinics_and_Journey_Flow.pdf');
  const desktopPdfPath = '/Users/pratyushraj/Desktop/Clinaza_Flexmoney_Top10_Clinics_and_Journey_Flow.pdf';

  fs.writeFileSync(htmlPath, htmlContent);
  console.log('HTML written to:', htmlPath);

  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  await page.pdf({
    path: pdfDistPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' }
  });

  // Also copy to Desktop for easy WhatsApp drag-and-drop
  fs.copyFileSync(pdfDistPath, desktopPdfPath);

  await browser.close();
  console.log('PDF generated successfully at:', pdfDistPath);
  console.log('Desktop copy ready at:', desktopPdfPath);
}

generatePDF().catch(err => {
  console.error('PDF Generation Failed:', err);
  process.exit(1);
});
