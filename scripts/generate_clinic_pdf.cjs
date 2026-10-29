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

const logoBase64 = getBase64Image(path.join(__dirname, '../public/docs/clinaza_c_icon.png'));
const flexmoneyBase64 = getBase64Image(path.join(__dirname, '../public/assets/flexmoney_logo.png'));
const hdfcBase64 = getBase64Image(path.join(__dirname, '../public/assets/lenders/hdfc.png'));
const iciciBase64 = getBase64Image(path.join(__dirname, '../public/assets/lenders/icici.png'));
const idfcBase64 = getBase64Image(path.join(__dirname, '../public/assets/lenders/idfc.png'));
const tvsBase64 = getBase64Image(path.join(__dirname, '../public/assets/lenders/tvs.png'));
const lazypayBase64 = getBase64Image(path.join(__dirname, '../public/assets/lenders/lazypay.png'));
const zypeBase64 = getBase64Image(path.join(__dirname, '../public/assets/lenders/zype.png'));
const kotakBase64 = getBase64Image(path.join(__dirname, '../public/assets/lenders/kotak.png'));
const axisBase64 = getBase64Image(path.join(__dirname, '../public/assets/lenders/axis.png'));

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Clinaza Clinic Overview & Onboarding Guide</title>
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
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
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
    padding: 11mm 13.5mm 9mm 13.5mm;
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
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 9px;
  }

  .logo-block {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .logo-img {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    object-fit: contain;
  }

  .logo-text-wrap h1 {
    font-size: 23px;
    font-weight: 900;
    letter-spacing: -0.6px;
    color: #0b2450;
    line-height: 1.1;
  }

  .partner-tagline {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 2px;
  }

  .partner-pill {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    padding: 1px 6px;
    border-radius: 4px;
  }

  .partner-pill-text {
    font-size: 8px;
    font-weight: 800;
    color: #166534;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }

  .partner-pill-img {
    height: 9px;
    object-fit: contain;
  }

  .header-badge {
    background: #f0f7ff;
    border: 1px solid #bfdbfe;
    padding: 5px 12px;
    border-radius: 999px;
    text-align: right;
  }

  .header-badge .tag {
    font-size: 9.5px;
    font-weight: 800;
    color: #0867e8;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  .header-badge .sub {
    font-size: 8px;
    font-weight: 600;
    color: #64748b;
  }

  /* Hero Section */
  .hero-box {
    background: linear-gradient(135deg, #0b2450 0%, #0d3878 100%);
    border-radius: 12px;
    padding: 15px 18px;
    color: #ffffff;
    box-shadow: 0 4px 14px rgba(11, 36, 80, 0.15);
    margin-top: 9px;
  }

  .hero-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 999px;
    padding: 2.5px 8px;
    font-size: 8.5px;
    font-weight: 800;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: #93c5fd;
    margin-bottom: 5px;
  }

  .hero-title {
    font-size: 19px;
    font-weight: 800;
    line-height: 1.25;
    letter-spacing: -0.3px;
    color: #ffffff;
    margin-bottom: 5px;
  }

  .hero-title span {
    color: #38bdf8;
  }

  .hero-subtitle {
    font-size: 11px;
    font-weight: 500;
    color: #cbd5e1;
    line-height: 1.45;
    max-width: 98%;
  }

  /* 4 Guarantees Grid */
  .grid-title {
    font-size: 11px;
    font-weight: 800;
    color: #0b2450;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    margin-top: 10px;
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .guarantees-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .guarantee-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 9px;
    padding: 9px 11px;
    display: flex;
    gap: 9px;
    align-items: flex-start;
  }

  .card-icon {
    width: 28px;
    height: 28px;
    border-radius: 7px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 900;
    flex-shrink: 0;
  }

  .icon-green { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
  .icon-blue { background: #dbeafe; color: #1d4ed8; border: 1px solid #bfdbfe; }
  .icon-purple { background: #f3e8ff; color: #7e22ce; border: 1px solid #e9d5ff; }
  .icon-amber { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; }

  .card-body h3 {
    font-size: 11.2px;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.2;
    margin-bottom: 2px;
  }

  .card-body p {
    font-size: 9.2px;
    font-weight: 500;
    color: #475569;
    line-height: 1.35;
  }

  /* Before vs After Card */
  .comparison-box {
    background: #ffffff;
    border: 1.5px solid #cbd5e1;
    border-radius: 10px;
    padding: 9px 12px;
    margin-top: 9px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  }

  .comp-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
  }

  .comp-tag {
    font-size: 9.2px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: #0867e8;
  }

  .comp-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .comp-col-old {
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 7px;
    padding: 8px 10px;
  }

  .comp-col-old h4 {
    font-size: 10px;
    font-weight: 800;
    color: #991b1b;
    margin-bottom: 2px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .comp-col-old p {
    font-size: 9px;
    color: #7f1d1d;
    line-height: 1.35;
  }

  .comp-col-new {
    background: #ecfdf5;
    border: 1px solid #a7f3d0;
    border-radius: 7px;
    padding: 8px 10px;
  }

  .comp-col-new h4 {
    font-size: 10px;
    font-weight: 800;
    color: #065f46;
    margin-bottom: 2px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .comp-col-new p {
    font-size: 9px;
    color: #064e3b;
    line-height: 1.35;
  }

  /* 4-Step Process */
  .steps-container {
    margin-top: 9px;
  }

  .steps-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 7px;
    margin-top: 6px;
  }

  .step-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 9px;
    padding: 8px 7px;
    position: relative;
    text-align: center;
  }

  .step-num {
    width: 20px;
    height: 20px;
    background: #0867e8;
    color: #ffffff;
    font-size: 9.5px;
    font-weight: 800;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 4px auto;
  }

  .step-title {
    font-size: 10.2px;
    font-weight: 800;
    color: #0b2450;
    line-height: 1.2;
    margin-bottom: 2px;
  }

  .step-desc {
    font-size: 8.6px;
    font-weight: 500;
    color: #64748b;
    line-height: 1.3;
  }

  /* Treatments & Commercial Value Section (Fills Page 1 beautifully) */
  .treatments-section {
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 10px;
    padding: 9px 12px;
    margin-top: 9px;
  }

  .treatments-title {
    font-size: 10px;
    font-weight: 800;
    color: #0b2450;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .treatments-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 6px;
  }

  .treatment-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 7px;
    padding: 6px 7px;
    text-align: center;
  }

  .treatment-name {
    font-size: 9px;
    font-weight: 800;
    color: #0b2450;
    margin-bottom: 2px;
  }

  .treatment-cost {
    font-size: 8px;
    color: #64748b;
    font-weight: 600;
  }

  .treatment-emi {
    font-size: 8.5px;
    font-weight: 800;
    color: #059669;
    margin-top: 2px;
  }

  .clinic-impact-bar {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
    margin-top: 9px;
  }

  .impact-card {
    background: #f0f7ff;
    border: 1px solid #bfdbfe;
    border-radius: 8px;
    padding: 7px 9px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .impact-icon {
    font-size: 14px;
    flex-shrink: 0;
  }

  .impact-text h5 {
    font-size: 9.5px;
    font-weight: 800;
    color: #0b2450;
    line-height: 1.15;
  }

  .impact-text p {
    font-size: 8px;
    color: #475569;
    font-weight: 500;
    line-height: 1.2;
    margin-top: 1px;
  }

  /* Footer */
  .page-footer {
    border-top: 1px solid #e2e8f0;
    padding-top: 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 8.5px;
    color: #64748b;
    font-weight: 600;
  }

  .page-footer a {
    color: #0867e8;
    text-decoration: none;
    font-weight: 700;
  }

  /* PAGE 2 STYLES */
  .section-badge {
    display: inline-block;
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    color: #166534;
    font-size: 8px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 2px 7px;
    border-radius: 999px;
    margin-bottom: 2px;
  }

  .doc-section {
    background: #ffffff;
    border: 1.5px solid #0867e8;
    border-radius: 10px;
    padding: 8px 11px;
    margin-top: 6px;
    box-shadow: 0 4px 12px rgba(8, 103, 232, 0.05);
  }

  .doc-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 4px;
  }

  .doc-header h2 {
    font-size: 12px;
    font-weight: 800;
    color: #0b2450;
  }

  .doc-header span {
    font-size: 8.5px;
    font-weight: 700;
    color: #059669;
    background: #ecfdf5;
    padding: 2px 6px;
    border-radius: 5px;
    border: 1px solid #a7f3d0;
  }

  .doc-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
  }

  .doc-item {
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    padding: 5px 8px;
  }

  .doc-num {
    font-size: 8px;
    font-weight: 800;
    color: #0867e8;
    text-transform: uppercase;
  }

  .doc-name {
    font-size: 9.8px;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.2;
    margin-bottom: 1px;
  }

  .doc-detail {
    font-size: 8.4px;
    font-weight: 500;
    color: #475569;
    line-height: 1.25;
  }

  /* REDESIGNED ELIGIBILITY SECTION (UPGRADED MODERN CARD UI) */
  .eligibility-section {
    background: #ffffff;
    border: 1.5px solid #0b2450;
    border-radius: 11px;
    padding: 9px 12px;
    margin-top: 6px;
    box-shadow: 0 4px 14px rgba(11, 36, 80, 0.04);
  }

  .elig-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 7px;
    border-bottom: 1.5px solid #e2e8f0;
    padding-bottom: 5px;
  }

  .elig-header h2 {
    font-size: 12.2px;
    font-weight: 800;
    color: #0b2450;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .elig-header span {
    font-size: 8px;
    font-weight: 700;
    color: #1d4ed8;
    background: #dbeafe;
    padding: 2px 7px;
    border-radius: 5px;
  }

  .elig-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .elig-col-pass {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 9px;
    padding: 8px 9px;
  }

  .elig-col-fail {
    background: #fff1f2;
    border: 1px solid #fecdd3;
    border-radius: 9px;
    padding: 8px 9px;
  }

  .elig-col-header {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 6px;
    padding-bottom: 4px;
    border-bottom: 1px solid rgba(0,0,0,0.06);
  }

  .elig-col-header h3 {
    font-size: 10px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  .elig-col-pass .elig-col-header h3 { color: #15803d; }
  .elig-col-fail .elig-col-header h3 { color: #be123c; }

  .elig-items-wrap {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .elig-item-card {
    background: #ffffff;
    border-radius: 5px;
    padding: 4px 7px;
    display: flex;
    align-items: flex-start;
    gap: 6px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.02);
  }

  .elig-col-pass .elig-item-card { border: 1px solid #dcfce7; }
  .elig-col-fail .elig-item-card { border: 1px solid #ffe4e6; }

  .elig-badge {
    width: 13px;
    height: 13px;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 8px;
    font-weight: 900;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .pass-badge { background: #16a34a; color: #ffffff; }
  .fail-badge { background: #e11d48; color: #ffffff; }

  .elig-content {
    flex: 1;
    font-size: 8.5px;
    line-height: 1.25;
  }

  .elig-content strong {
    color: #0f172a;
    font-weight: 800;
  }

  .elig-content span {
    color: #475569;
    font-weight: 500;
  }

  /* Lenders Rail with Flexmoney */
  .lenders-box {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 6px 10px;
    margin-top: 6px;
  }

  .lenders-title {
    font-size: 9.5px;
    font-weight: 800;
    color: #0b2450;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .flexmoney-header-badge {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .lenders-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    align-items: center;
  }

  .lender-chip {
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 5px;
    padding: 2.5px 6px;
    font-size: 8.5px;
    font-weight: 700;
    color: #1e293b;
    display: flex;
    align-items: center;
    gap: 4px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.03);
  }

  .lender-chip img {
    height: 10px;
    max-width: 38px;
    object-fit: contain;
  }

  /* FAQ Section */
  .faq-section {
    margin-top: 6px;
  }

  .faq-title {
    font-size: 10px;
    font-weight: 800;
    color: #0b2450;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
  }

  .faq-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5px;
  }

  .faq-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 5px 8px;
  }

  .faq-q {
    font-size: 9px;
    font-weight: 800;
    color: #0b2450;
    margin-bottom: 1.5px;
    line-height: 1.2;
  }

  .faq-a {
    font-size: 8.2px;
    font-weight: 500;
    color: #475569;
    line-height: 1.25;
  }

  /* Activation Box */
  .cta-box {
    background: linear-gradient(135deg, #0867e8 0%, #0548a8 100%);
    border-radius: 9px;
    padding: 9px 13px;
    color: #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 6px;
    box-shadow: 0 4px 14px rgba(8, 103, 232, 0.2);
  }

  .cta-left h3 {
    font-size: 12px;
    font-weight: 900;
    line-height: 1.2;
    margin-bottom: 2px;
  }

  .cta-left p {
    font-size: 8.5px;
    color: #bfdbfe;
    font-weight: 500;
  }

  .cta-contacts {
    text-align: right;
  }

  .cta-phone {
    font-size: 13px;
    font-weight: 900;
    color: #ffffff;
    letter-spacing: 0.3px;
  }

  .cta-email {
    font-size: 8.5px;
    color: #93c5fd;
    font-weight: 600;
    margin-top: 1px;
  }

  .stamp-badge {
    display: inline-block;
    border: 1px dashed #ffffff;
    background: rgba(255,255,255,0.12);
    padding: 1.5px 5px;
    border-radius: 4px;
    font-size: 7.2px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 2px;
  }
</style>
</head>
<body>

<!-- ================= PAGE 1 ================= -->
<div class="page">
  <div>
    <!-- Top Header -->
    <div class="header">
      <div class="logo-block">
        <img class="logo-img" src="${logoBase64}" alt="Clinaza Logo">
        <div class="logo-text-wrap">
          <h1>CLINAZA</h1>
          <div class="partner-tagline">
            <span style="font-size: 9px; font-weight: 700; color: #0867e8; text-transform: uppercase; letter-spacing: 0.5px;">Point-of-Care Patient EMI</span>
            <span style="font-size: 8px; color: #cbd5e1;">•</span>
            <div class="partner-pill">
              <span class="partner-pill-text">Official Partner of</span>
              <img class="partner-pill-img" src="${flexmoneyBase64}" alt="Flexmoney">
            </div>
          </div>
        </div>
      </div>
      <div class="header-badge">
        <div class="tag">Official Clinic Partnership Brief</div>
        <div class="sub">Powered by Flexmoney InstaCred Lending Rails</div>
      </div>
    </div>

    <!-- Hero Value Box -->
    <div class="hero-box">
      <div class="hero-pill">⚡ Instant Front-Desk Patient Financing</div>
      <div class="hero-title">Turn Treatment Hesitations Into <span>Instant Approvals</span></div>
      <div class="hero-subtitle">
        Clinaza allows dental clinics to offer instant, paperless patient EMIs directly at the front desk. Convert 30–40% more high-ticket implants, aligners, and full-mouth rehabilitations without your clinic taking any credit or default risk.
      </div>
    </div>

    <!-- 4 Core Clinic Guarantees -->
    <div class="grid-title">🛡️ The 4 Fundamentals Every Doctor Needs To Know</div>
    <div class="guarantees-grid">
      <div class="guarantee-card">
        <div class="card-icon icon-green">🛡️</div>
        <div class="card-body">
          <h3>100% Non-Recourse (Zero Clinic Risk)</h3>
          <p>Your clinic bears <strong>zero default liability</strong> (0% FLDG). Regulated institutional lenders handle all repayments. Clinic keeps 100% of treatment fees.</p>
        </div>
      </div>
      <div class="guarantee-card">
        <div class="card-icon icon-blue">⚡</div>
        <div class="card-body">
          <h3>T+1 Direct Bank Disbursal</h3>
          <p>Full treatment cost is settled directly into your clinic current account on the <strong>next business day</strong> via licensed RBI payment gateways.</p>
        </div>
      </div>
      <div class="guarantee-card">
        <div class="card-icon icon-purple">📅</div>
        <div class="card-body">
          <h3>3 to 12 Months Flexible Tenures</h3>
          <p>Disciplined, short-to-medium repayment plans (<strong>3, 6, 9, or 12 months max</strong>). Fits patient monthly salary cycles without dragging into multi-year debt.</p>
        </div>
      </div>
      <div class="guarantee-card">
        <div class="card-icon icon-amber">🏛️</div>
        <div class="card-body">
          <h3>55+ RBI-Regulated Lending Partners</h3>
          <p>Multi-lender institutional cascade via Flexmoney (HDFC, ICICI, IDFC FIRST, TVS Credit, LazyPay, Zype) approving non-credit card holders, salaried, & self-employed.</p>
        </div>
      </div>
    </div>

    <!-- Real Life Impact Comparison -->
    <div class="comparison-box">
      <div class="comp-header">
        <div class="comp-tag">📊 The Chairside Conversion Difference</div>
        <div style="font-size: 9px; font-weight: 700; color: #64748b;">Example: ₹60,000 Dental Implant + Zirconia Crown</div>
      </div>
      <div class="comp-grid">
        <div class="comp-col-old">
          <h4>❌ Without Clinaza (Upfront Shock)</h4>
          <p>Doctor quotes ₹60,000 upfront. Patient says: <em>"Doctor, let me check my finances and get back."</em> <strong>Result:</strong> Patient delays or cancels. Clinic loses ₹60,000 revenue.</p>
        </div>
        <div class="comp-col-new">
          <h4>✅ With Clinaza (Easy Monthly Plan)</h4>
          <p>Receptionist offers: <em>"You can start today for just ₹5,000/month across 12 months with instant digital approval."</em> <strong>Result:</strong> Patient agrees on the spot. Clinic receives full ₹60,000 on T+1.</p>
        </div>
      </div>
    </div>

    <!-- 4-Step Counter Workflow -->
    <div class="steps-container">
      <div class="grid-title">⚡ How It Works At Your Reception Desk (Under 3 Minutes)</div>
      <div class="steps-grid">
        <div class="step-card">
          <div class="step-num">1</div>
          <div class="step-title">Prescribe Plan</div>
          <div class="step-desc">Doctor finalizes clinical treatment plan & cost (₹5,000 to ₹5,00,000).</div>
        </div>
        <div class="step-card">
          <div class="step-num">2</div>
          <div class="step-title">Mobile & PAN</div>
          <div class="step-desc">Receptionist inputs phone & PAN; instant 2-minute paperless digital e-KYC.</div>
        </div>
        <div class="step-card">
          <div class="step-num">3</div>
          <div class="step-title">Instant Approval</div>
          <div class="step-desc">Patient selects 3–12 month tenure & authenticates e-NACH auto-debit on phone.</div>
        </div>
        <div class="step-card">
          <div class="step-num">4</div>
          <div class="step-title">Next-Day Payout</div>
          <div class="step-desc">Full treatment amount credited to clinic bank on T+1. Treatment begins!</div>
        </div>
      </div>
    </div>

    <!-- High-Ticket Procedures Breakdown (Fills Page 1 beautifully) -->
    <div class="treatments-section">
      <div class="treatments-title">
        <span>🦷 Common High-Ticket Treatments Financed via Clinaza (3 to 12 Months)</span>
        <span style="font-size: 8px; color: #0867e8; text-transform: none; font-weight: 700;">Instant Paperless EMI</span>
      </div>
      <div class="treatments-grid">
        <div class="treatment-card">
          <div class="treatment-name">Dental Implants</div>
          <div class="treatment-cost">₹25k – ₹80k</div>
          <div class="treatment-emi">From ₹2,100/mo</div>
        </div>
        <div class="treatment-card">
          <div class="treatment-name">Clear Aligners</div>
          <div class="treatment-cost">₹45k – ₹1,80k</div>
          <div class="treatment-emi">From ₹3,750/mo</div>
        </div>
        <div class="treatment-card">
          <div class="treatment-name">Full Mouth Rehab</div>
          <div class="treatment-cost">₹1.2L – ₹4.0L</div>
          <div class="treatment-emi">From ₹10,000/mo</div>
        </div>
        <div class="treatment-card">
          <div class="treatment-name">Zirconia Crowns</div>
          <div class="treatment-cost">₹10k – ₹35k</div>
          <div class="treatment-emi">From ₹1,200/mo</div>
        </div>
        <div class="treatment-card">
          <div class="treatment-name">Smile Makeover</div>
          <div class="treatment-cost">₹20k – ₹90k</div>
          <div class="treatment-emi">From ₹1,800/mo</div>
        </div>
      </div>
    </div>

    <!-- Commercial Impact Bar -->
    <div class="clinic-impact-bar">
      <div class="impact-card">
        <div class="impact-icon">📈</div>
        <div class="impact-text">
          <h5>Close 35%+ More Cases</h5>
          <p>Eliminate upfront sticker shock chairside.</p>
        </div>
      </div>
      <div class="impact-card">
        <div class="impact-icon">🚫</div>
        <div class="impact-text">
          <h5>Zero Clinic Khata / Debt</h5>
          <p>Banks handle 100% of installment collections.</p>
        </div>
      </div>
      <div class="impact-card">
        <div class="impact-icon">🛡️</div>
        <div class="impact-text">
          <h5>Protect Clinic Margins</h5>
          <p>Stop giving heavy 15–20% fee discounts.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Page 1 Footer -->
  <div class="page-footer">
    <div><strong>Clinaza Technologies</strong> • Official Partner of Flexmoney Technologies • Direct Helpline: +91 7292984244</div>
    <div>Page 1 of 2 • <a href="https://clinaza.in">clinaza.in</a></div>
  </div>
</div>

<!-- ================= PAGE 2 ================= -->
<div class="page">
  <div>
    <!-- Top Header -->
    <div class="header">
      <div class="logo-block">
        <img class="logo-img" src="${logoBase64}" alt="Clinaza Logo">
        <div class="logo-text-wrap">
          <h1>CLINAZA</h1>
          <div class="partner-tagline">
            <span style="font-size: 9px; font-weight: 700; color: #0867e8; text-transform: uppercase; letter-spacing: 0.5px;">Clinic Onboarding & Documentation</span>
            <span style="font-size: 8px; color: #cbd5e1;">•</span>
            <div class="partner-pill">
              <span class="partner-pill-text">Official Partner of</span>
              <img class="partner-pill-img" src="${flexmoneyBase64}" alt="Flexmoney">
            </div>
          </div>
        </div>
      </div>
      <div class="header-badge">
        <div class="tag">Fast-Track Clinic Activation</div>
        <div class="sub">100% Digital • Live Within 24 Hours</div>
      </div>
    </div>

    <!-- Required Documents Box -->
    <div class="doc-section">
      <div class="doc-header">
        <div>
          <span class="section-badge">Required Clinic KYC</span>
          <h2>The 4 Documents Required For Clinic Onboarding</h2>
        </div>
        <span>Fast-Track Activation</span>
      </div>
      <div class="doc-grid">
        <div class="doc-item">
          <div class="doc-num">Document 1</div>
          <div class="doc-name">Doctor / Proprietor PAN Card</div>
          <div class="doc-detail">Clear photo or scan of the primary doctor / clinic owner PAN card. Used for authorized signatory identity verification.</div>
        </div>
        <div class="doc-item">
          <div class="doc-num">Document 2</div>
          <div class="doc-name">Doctor Aadhaar Card (Masked)</div>
          <div class="doc-detail">Address & identity proof of the doctor / owner (first 8 digits masked as per RBI guidelines).</div>
        </div>
        <div class="doc-item">
          <div class="doc-num">Document 3</div>
          <div class="doc-name">Clinic Business Proof (Any ONE)</div>
          <div class="doc-detail">Any valid clinic proof: GST Certificate, Udyam MSME, Shop & Establishment License, State Dental Council Registration, or Clinic Letterhead with rubber stamp.</div>
        </div>
        <div class="doc-item">
          <div class="doc-num">Document 4</div>
          <div class="doc-name">Cancelled Cheque or Bank Passbook</div>
          <div class="doc-detail">Bank proof showing Clinic Name, Account Number, and IFSC code for routing automated T+1 treatment fee payouts.</div>
        </div>
      </div>
    </div>

    <!-- REDESIGNED PATIENT ELIGIBILITY MATRIX (MODERN FINTECH CARD UI) -->
    <div class="eligibility-section">
      <div class="elig-header">
        <h2>🎯 Patient Eligibility Criteria: Who Qualifies & Who Doesn't</h2>
        <span>Instant 2-Min e-KYC Check</span>
      </div>
      <div class="elig-grid">
        <!-- Eligible Column -->
        <div class="elig-col-pass">
          <div class="elig-col-header">
            <span style="font-size: 11px;">✅</span>
            <h3>Who IS Eligible (High Approval Rate)</h3>
          </div>
          <div class="elig-items-wrap">
            <div class="elig-item-card">
              <div class="elig-badge pass-badge">✓</div>
              <div class="elig-content">
                <strong>Age 21 to 65 Years:</strong> <span>Salaried employees (private/govt) or Self-Employed / Business owners.</span>
              </div>
            </div>
            <div class="elig-item-card">
              <div class="elig-badge pass-badge">✓</div>
              <div class="elig-content">
                <strong>Active Indian Bank Account:</strong> <span>Savings or current account across all national & private banks (HDFC, ICICI, SBI, PNB, etc.).</span>
              </div>
            </div>
            <div class="elig-item-card">
              <div class="elig-badge pass-badge">✓</div>
              <div class="elig-content">
                <strong>Digital e-NACH Ready:</strong> <span>Active Netbanking or Debit Card to register paperless monthly auto-debit mandate.</span>
              </div>
            </div>
            <div class="elig-item-card">
              <div class="elig-badge pass-badge">✓</div>
              <div class="elig-content">
                <strong>Aadhaar-Linked Mobile:</strong> <span>Phone number linked with Aadhaar to receive instant RBI-mandated digital OTP.</span>
              </div>
            </div>
            <div class="elig-item-card">
              <div class="elig-badge pass-badge">✓</div>
              <div class="elig-content">
                <strong>Credit Track Record:</strong> <span>Fair to good bureau history (CIBIL 650+ or regular monthly salary/business banking credits).</span>
              </div>
            </div>
            <div class="elig-item-card">
              <div class="elig-badge pass-badge">✓</div>
              <div class="elig-content">
                <strong>Family Financing for Dependents:</strong> <span>Earning spouse, parents, or family members can apply for students or homemakers.</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Ineligible Column -->
        <div class="elig-col-fail">
          <div class="elig-col-header">
            <span style="font-size: 11px;">❌</span>
            <h3>Who IS NOT Eligible (Will Be Rejected)</h3>
          </div>
          <div class="elig-items-wrap">
            <div class="elig-item-card">
              <div class="elig-badge fail-badge">✕</div>
              <div class="elig-content">
                <strong>Severe Loan Defaulters:</strong> <span>Active NPAs, written-off credit accounts, or multiple 90+ day overdue defaults on bureau.</span>
              </div>
            </div>
            <div class="elig-item-card">
              <div class="elig-badge fail-badge">✕</div>
              <div class="elig-content">
                <strong>Unlinked Mobile & Aadhaar:</strong> <span>Patients unable to verify identity via Aadhaar OTP cannot complete digital e-KYC.</span>
              </div>
            </div>
            <div class="elig-item-card">
              <div class="elig-badge fail-badge">✕</div>
              <div class="elig-content">
                <strong>Cash-Only Individuals:</strong> <span>Patients without an active bank account, Netbanking, or Debit Card (cannot set up e-NACH).</span>
              </div>
            </div>
            <div class="elig-item-card">
              <div class="elig-badge fail-badge">✕</div>
              <div class="elig-content">
                <strong>Minors Under 21:</strong> <span>Individuals under 21 years cannot be the primary applicant under RBI lending rules.</span>
              </div>
            </div>
            <div class="elig-item-card">
              <div class="elig-badge fail-badge">✕</div>
              <div class="elig-content">
                <strong>Foreign Nationals:</strong> <span>Applicants without valid Indian PAN and Aadhaar credentials.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Supported Lenders Network with Flexmoney -->
    <div class="lenders-box">
      <div class="lenders-title">
        <div class="flexmoney-header-badge">
          <span>Lending Rails Powered by</span>
          <img src="${flexmoneyBase64}" style="height: 11px; object-fit: contain;">
          <span style="background: #059669; color: #fff; font-size: 7.5px; font-weight: 800; padding: 1px 5px; border-radius: 3px; letter-spacing: 0.3px;">OFFICIAL PARTNER</span>
        </div>
        <span>55+ Banks & NBFCs • MCC 8021 Healthcare</span>
      </div>
      <div class="lenders-chips">
        <div class="lender-chip"><img src="${hdfcBase64}" alt="HDFC"> HDFC Bank</div>
        <div class="lender-chip"><img src="${iciciBase64}" alt="ICICI"> ICICI Bank</div>
        <div class="lender-chip"><img src="${idfcBase64}" alt="IDFC"> IDFC FIRST Bank (₹8L Limit)</div>
        <div class="lender-chip"><img src="${tvsBase64}" alt="TVS"> TVS Credit (e-NACH)</div>
        <div class="lender-chip"><img src="${lazypayBase64}" alt="LazyPay"> LazyPay</div>
        <div class="lender-chip"><img src="${zypeBase64}" alt="Zype"> Zype Healthcare</div>
        <div class="lender-chip"><img src="${kotakBase64}" alt="Kotak"> Kotak Mahindra</div>
        <div class="lender-chip"><img src="${axisBase64}" alt="Axis"> Axis Bank</div>
        <div class="lender-chip" style="background:#0867e8; color:#fff; border-color:#0867e8;">+ 45 More via e-NACH</div>
      </div>
    </div>

    <!-- Doctor FAQ -->
    <div class="faq-section">
      <div class="faq-title">❓ Key Questions Asked By Clinic Directors</div>
      <div class="faq-grid">
        <div class="faq-card">
          <div class="faq-q">Do we need any physical POS hardware?</div>
          <div class="faq-a"><strong>No.</strong> Clinaza is 100% cloud-based. Receptionists can use any mobile phone, iPad, tablet, or reception computer. No paper forms or swipe machines.</div>
        </div>
        <div class="faq-card">
          <div class="faq-q">What if the patient defaults on their monthly EMI?</div>
          <div class="faq-a"><strong>Zero liability.</strong> 100% Non-recourse. Regulated banks & NBFCs hold legal e-NACH mandates and handle collections. Your clinic keeps 100% of the payout.</div>
        </div>
        <div class="faq-card">
          <div class="faq-q">What tenures are offered to patients?</div>
          <div class="faq-a"><strong>3, 6, 9, or 12 months maximum.</strong> Patients choose their preferred repayment plan right at the counter during the 2-minute digital approval.</div>
        </div>
        <div class="faq-card">
          <div class="faq-q">How fast can our clinic start offering this?</div>
          <div class="faq-a">Within <strong>24 hours</strong> of submitting the 4 KYC documents. Your reception team receives an instant 5-minute WhatsApp video walkthrough.</div>
        </div>
      </div>
    </div>

    <!-- Activation CTA -->
    <div class="cta-box">
      <div class="cta-left">
        <div class="stamp-badge">FAST-TRACK ONBOARDING</div>
        <h3>Ready to partner with Clinaza?</h3>
        <p>Send your 4 clinic documents directly via WhatsApp or email to activate.</p>
      </div>
      <div class="cta-contacts">
        <div class="cta-phone">+91 7292984244</div>
        <div class="cta-email">contact@clinaza.in • Pratyush Raj (Founder)</div>
        <div style="font-size: 8.5px; color: #dbeafe; margin-top: 2px;">clinaza.in/clinic-onboarding</div>
      </div>
    </div>
  </div>

  <!-- Page 2 Footer -->
  <div class="page-footer">
    <div><strong>Clinaza Technologies</strong> • Official Partner of Flexmoney Technologies • Nodal Disbursals via Licensed RBI Payment Aggregators</div>
    <div>Page 2 of 2 • <a href="https://clinaza.in">clinaza.in</a></div>
  </div>
</div>

</body>
</html>
`;

async function generatePDF() {
  const htmlPath = path.join(__dirname, '../public/docs/clinaza_clinic_onboarding_guide.html');
  const pdfPath = path.join(__dirname, '../public/docs/Clinaza_Clinic_Overview_and_Onboarding_Guide.pdf');

  fs.writeFileSync(htmlPath, htmlContent);
  console.log('HTML written to:', htmlPath);

  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' }
  });

  await browser.close();
  console.log('PDF generated successfully at:', pdfPath);
}

generatePDF().catch(err => {
  console.error('PDF Generation Failed:', err);
  process.exit(1);
});
