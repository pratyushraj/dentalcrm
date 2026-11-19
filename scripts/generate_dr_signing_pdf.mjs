import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

async function generatePdf() {
  console.log('Generating Doctor Signing Dossier PDF...');

  // Read images as base64
  const clinazaLogo = fs.readFileSync('public/assets/clinaza-logo.jpg').toString('base64');
  const pluralLogo = fs.readFileSync('public/assets/plural_by_pinelabs_transparent.png').toString('base64');
  const panImg = fs.readFileSync('public/docs/kyc/hear_one/dr_angiras_vishnu_pan.jpg').toString('base64');
  const aadhaarFront = fs.readFileSync('public/docs/kyc/hear_one/dr_angiras_vishnu_aadhaar_front.jpg').toString('base64');
  const aadhaarBack = fs.readFileSync('public/docs/kyc/hear_one/dr_angiras_vishnu_aadhaar_back.jpg').toString('base64');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Pine Labs Plural Sub-Merchant MAF & Doctor KYC — Dr. Angiras Vishnu (HEAR ONE)</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap');

    @page {
      size: A4 portrait;
      margin: 10mm 12mm 10mm 12mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #0f172a;
      background: #ffffff;
      font-size: 11px;
      line-height: 1.45;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .page {
      page-break-after: always;
      height: 277mm;
      max-height: 277mm;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .page:last-child {
      page-break-after: avoid;
    }

    /* Header */
    .header {
      border-bottom: 2px solid #0867E8;
      padding-bottom: 8px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .header-logo {
      width: 44px;
      height: 44px;
      border-radius: 8px;
      object-fit: cover;
      border: 1px solid #cbd5e1;
    }

    .header-title-block h1 {
      font-size: 14px;
      font-weight: 900;
      letter-spacing: 0.5px;
      color: #0f172a;
      text-transform: uppercase;
    }

    .header-title-block p {
      font-size: 9.5px;
      font-weight: 700;
      color: #0867E8;
      letter-spacing: 0.3px;
    }

    .header-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 3px;
    }

    .plural-logo {
      height: 22px;
      width: auto;
      object-fit: contain;
    }

    .partner-badge {
      font-size: 8.5px;
      font-weight: 700;
      color: #475569;
      background: #f1f5f9;
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
    }

    /* Doc Title Banner */
    .doc-banner {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #ffffff;
      padding: 8px 12px;
      border-radius: 8px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .doc-banner h2 {
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.3px;
      text-transform: uppercase;
      color: #ffffff;
    }

    .doc-banner p {
      font-size: 9px;
      color: #94a3b8;
      font-weight: 500;
    }

    .status-pill {
      background: #10b981;
      color: #ffffff;
      font-size: 8.5px;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 999px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Section Cards */
    .section-card {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      margin-bottom: 8px;
      overflow: hidden;
      background: #ffffff;
    }

    .section-header {
      background: #f8fafc;
      padding: 5px 10px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #334155;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .section-body {
      padding: 8px 10px;
    }

    /* Grid Layouts */
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px 14px;
    }

    .grid-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 6px 12px;
    }

    .field {
      display: flex;
      flex-direction: column;
    }

    .field-label {
      font-size: 8.5px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      margin-bottom: 1px;
    }

    .field-value {
      font-size: 10.5px;
      font-weight: 600;
      color: #0f172a;
    }

    .field-value.highlight {
      color: #0867E8;
      font-weight: 700;
    }

    .field-value.mono {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      font-weight: 700;
      color: #047857;
    }

    /* Terms Box */
    .terms-box {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 6px;
      padding: 6px 10px;
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
      font-size: 9px;
      color: #166534;
      font-weight: 600;
    }

    /* Declaration Box */
    .declaration-text {
      font-size: 8.5px;
      line-height: 1.4;
      color: #475569;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 6px 8px;
      margin-bottom: 10px;
      text-align: justify;
    }

    /* Signing Grid */
    .sign-container {
      border: 2px dashed #0867E8;
      border-radius: 8px;
      background: #f8fafc;
      padding: 10px 12px;
      margin-top: auto;
    }

    .sign-grid {
      display: grid;
      grid-template-columns: 1.3fr 1fr;
      gap: 16px;
    }

    .sign-box {
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      background: #ffffff;
      padding: 8px;
      height: 95px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .sign-box-title {
      font-size: 8.5px;
      font-weight: 800;
      text-transform: uppercase;
      color: #0867E8;
      letter-spacing: 0.4px;
    }

    .stamp-box {
      border: 1px dashed #94a3b8;
      border-radius: 6px;
      background: #ffffff;
      padding: 8px;
      height: 95px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    .stamp-box-text {
      font-size: 8px;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .sign-line {
      border-top: 1px solid #0f172a;
      padding-top: 4px;
      font-size: 9px;
      font-weight: 700;
      color: #0f172a;
    }

    .sign-sub {
      font-size: 8px;
      color: #64748b;
    }

    /* Annexure Pages */
    .annexure-banner {
      background: #0f172a;
      color: #ffffff;
      padding: 8px 12px;
      border-radius: 8px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .annexure-banner h2 {
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }

    .annexure-banner .annexure-id {
      background: #0867E8;
      color: #ffffff;
      font-size: 9px;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 4px;
    }

    .doc-meta-strip {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 6px 10px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      font-size: 9.5px;
      font-weight: 600;
      color: #334155;
    }

    .doc-frame {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 8px;
      background: #ffffff;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 10px;
    }

    .doc-img-pan {
      max-height: 125mm;
      width: auto;
      max-width: 90%;
      object-fit: contain;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
    }

    .doc-img-aadhaar {
      max-height: 85mm;
      width: auto;
      max-width: 95%;
      object-fit: contain;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
    }

    /* Footer */
    .footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 8px;
      color: #94a3b8;
    }

    .footer-bold {
      font-weight: 700;
      color: #64748b;
    }
  </style>
</head>
<body>

  <!-- ==================== PAGE 1: MAF & DECLARATION ==================== -->
  <div class="page">
    <div>
      <!-- Institutional Top Bar -->
      <div class="header">
        <div class="header-left">
          <img src="data:image/jpeg;base64,${clinazaLogo}" class="header-logo" alt="Clinaza">
          <div class="header-title-block">
            <h1>CLINAZA HEALTHCARE TECHNOLOGIES</h1>
            <p>Institutional Healthcare Aggregator • Pine Labs Partner MID: 111077</p>
          </div>
        </div>
        <div class="header-right">
          <img src="data:image/png;base64,${pluralLogo}" class="plural-logo" alt="Plural by Pine Labs">
          <span class="partner-badge">SUB-MERCHANT ONBOARDING DESK</span>
        </div>
      </div>

      <!-- Title Banner -->
      <div class="doc-banner">
        <div>
          <h2>Merchant Application Form (MAF) &amp; KYC Attestation</h2>
          <p>Underwriting Dossier for Sub-Merchant MID Issuance • Pine Labs Plural Gateway</p>
        </div>
        <div class="status-pill">Ready for Doctor Sign-Off</div>
      </div>

      <!-- Commercial Wholesale Invariant Note -->
      <div class="terms-box">
        <span>Locked Agreement: ₹0 Setup Fee • ₹0 Annual Maintenance (AMC)</span>
        <span>MDR: Credit Card EMI 1.85% • Debit Card EMI 0.90% • UPI 0.40%</span>
        <span>0% Clinic Recourse • T+1 Nodal Settlement</span>
      </div>

      <!-- Section 1: Business Profile -->
      <div class="section-card">
        <div class="section-header">
          <span>1. Clinic &amp; Enterprise Particulars</span>
          <span style="font-size:8.5px; color:#0867E8;">Sole Proprietorship</span>
        </div>
        <div class="section-body grid-2">
          <div class="field">
            <span class="field-label">Legal Name of Entity</span>
            <span class="field-value">HEAR ONE</span>
          </div>
          <div class="field">
            <span class="field-label">Trade Name / Brand</span>
            <span class="field-value highlight">HEAR ONE Clinic</span>
          </div>
          <div class="field">
            <span class="field-label">Constitution of Business</span>
            <span class="field-value">Sole Proprietorship</span>
          </div>
          <div class="field">
            <span class="field-label">Category / Line of Practice</span>
            <span class="field-value">Audiology, Speech Rehab &amp; Daycare Healthcare</span>
          </div>
          <div class="field" style="grid-column: span 2;">
            <span class="field-label">Registered Clinic Operating Address</span>
            <span class="field-value">Near Civil Station, X/10 (F), Kakkanad, Ernakulam, Kerala - 682030</span>
          </div>
          <div class="field">
            <span class="field-label">Official Contact Number</span>
            <span class="field-value mono">+91 85478 32924</span>
          </div>
          <div class="field">
            <span class="field-label">Registered Email / Website</span>
            <span class="field-value">info@hearone.in • https://hearone.in</span>
          </div>
        </div>
      </div>

      <!-- Section 2: Proprietor / Doctor Profile -->
      <div class="section-card">
        <div class="section-header">
          <span>2. Authorized Signatory / Managing Doctor Profile</span>
          <span style="font-size:8.5px; color:#047857;">KYC Verified</span>
        </div>
        <div class="section-body grid-3">
          <div class="field">
            <span class="field-label">Full Name of Doctor</span>
            <span class="field-value highlight">Dr. Angiras Vishnu</span>
          </div>
          <div class="field">
            <span class="field-label">Designation / Role</span>
            <span class="field-value">Proprietor / Managing Doctor</span>
          </div>
          <div class="field">
            <span class="field-label">Date of Birth (DOB)</span>
            <span class="field-value">16/02/1991</span>
          </div>
          <div class="field">
            <span class="field-label">Doctor Permanent Account Number (PAN)</span>
            <span class="field-value mono">AZHPV0033E</span>
          </div>
          <div class="field">
            <span class="field-label">Doctor Aadhaar Number</span>
            <span class="field-value mono">4451 2414 5591</span>
          </div>
          <div class="field">
            <span class="field-label">Beneficial Ownership (%)</span>
            <span class="field-value highlight">100.00% (Ultimate Beneficial Owner)</span>
          </div>
          <div class="field" style="grid-column: span 3;">
            <span class="field-label">Doctor Residential Address (as per Aadhaar Proof)</span>
            <span class="field-value">Kidangaziyath Mana, West Chalakudy, Chalakudi H.O, Thrissur, Kerala - 680307</span>
          </div>
        </div>
      </div>

      <!-- Section 3: Settlement Bank Account -->
      <div class="section-card">
        <div class="section-header">
          <span>3. Direct Settlement Bank Account (T+1 Nodal Credit)</span>
          <span style="font-size:8.5px; color:#0867E8;">Cheque Leaf Verified (000012)</span>
        </div>
        <div class="section-body grid-3">
          <div class="field">
            <span class="field-label">Bank Name &amp; Branch</span>
            <span class="field-value">Bank of Baroda — Kakkanad Branch</span>
          </div>
          <div class="field">
            <span class="field-label">Beneficiary Account Title</span>
            <span class="field-value highlight">HEAR ONE</span>
          </div>
          <div class="field">
            <span class="field-label">Account Type</span>
            <span class="field-value">Current Account</span>
          </div>
          <div class="field">
            <span class="field-label">Current Account Number</span>
            <span class="field-value mono">30580200000228</span>
          </div>
          <div class="field">
            <span class="field-label">RTGS / NEFT IFSC Code</span>
            <span class="field-value mono">BARB0KAKKAN</span>
          </div>
          <div class="field">
            <span class="field-label">MICR Code</span>
            <span class="field-value">682012009</span>
          </div>
        </div>
      </div>

      <!-- BO & PEP Declaration Summary -->
      <div class="declaration-text">
        <strong>Beneficial Ownership (BO) &amp; PEP Declaration:</strong> I hereby declare that I, <strong>Dr. Angiras Vishnu</strong>, am the sole 100% Beneficial Owner of <strong>HEAR ONE</strong>. I confirm that neither I nor any of my immediate family members are Politically Exposed Persons (PEP) as defined by RBI Master Directions. I confirm that the details furnished above are true and accurate, and authorize Pine Labs Plural to enable payment gateway processing and direct T+1 settlements to the stated Bank of Baroda Current Account.
      </div>
    </div>

    <!-- Sign-Off Container -->
    <div class="sign-container">
      <div class="sign-grid">
        <div class="sign-box">
          <div class="sign-box-title">Doctor / Authorized Signatory Sign-Off</div>
          <div style="flex: 1; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-style: italic; font-size: 10px;">
            ✍️ Sign Inside This Box
          </div>
          <div class="sign-line">
            Dr. Angiras Vishnu (Proprietor, HEAR ONE)
            <div class="sign-sub">Date: _____ / _____ / 2026 • Place: Kakkanad, Ernakulam, Kerala</div>
          </div>
        </div>

        <div class="stamp-box">
          <div class="stamp-box-text">
            Affix Clinic / Practice Seal<br>(Rubber Stamp)
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <span>Plural MAF Ref: <span class="footer-bold">PLURAL-MAF-2026-HEARONE</span> • Pine Labs Aggregator MID: 111077</span>
      <span>Page 1 of 3 (MAF &amp; Undertaking)</span>
    </div>
  </div>


  <!-- ==================== PAGE 2: DOCTOR PAN CARD ==================== -->
  <div class="page">
    <div>
      <!-- Header -->
      <div class="header">
        <div class="header-left">
          <img src="data:image/jpeg;base64,${clinazaLogo}" class="header-logo" alt="Clinaza">
          <div class="header-title-block">
            <h1>CLINAZA HEALTHCARE TECHNOLOGIES</h1>
            <p>Pine Labs Partner MID: 111077 • Doctor KYC Annexure</p>
          </div>
        </div>
        <div class="header-right">
          <img src="data:image/png;base64,${pluralLogo}" class="plural-logo" alt="Plural by Pine Labs">
          <span class="partner-badge">ANNEXURE I</span>
        </div>
      </div>

      <!-- Annexure Title Banner -->
      <div class="annexure-banner">
        <div>
          <h2>Annexure I — Doctor Permanent Account Number (PAN)</h2>
          <p style="font-size:9px; color:#94a3b8;">Mandatory RBI Proof of Identity for Sub-Merchant Underwriting</p>
        </div>
        <span class="annexure-id">PAN: AZHPV0033E</span>
      </div>

      <!-- Doctor Meta Strip -->
      <div class="doc-meta-strip">
        <span>Doctor Name: <strong>Dr. Angiras Vishnu</strong></span>
        <span>Date of Birth: <strong>16/02/1991</strong></span>
        <span>Entity: <strong>HEAR ONE (Sole Proprietorship)</strong></span>
        <span style="color:#047857;">Status: <strong>Verified</strong></span>
      </div>

      <!-- High-Res Document Frame -->
      <div class="doc-frame" style="height: 145mm;">
        <img src="data:image/jpeg;base64,${panImg}" class="doc-img-pan" alt="Doctor PAN Card">
      </div>
    </div>

    <!-- Doctor Self-Attestation Sign Box -->
    <div class="sign-container">
      <div style="font-size:9px; font-weight:700; color:#334155; margin-bottom: 6px;">
        Doctor Self-Attestation Declaration: "I hereby confirm that this is a true and verified copy of my valid PAN card issued by the Income Tax Department of India."
      </div>
      <div class="sign-grid">
        <div class="sign-box" style="height: 85px;">
          <div class="sign-box-title">Self-Attested By Doctor</div>
          <div style="flex: 1; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-style: italic; font-size: 10px;">
            ✍️ Doctor Sign Across PAN Copy
          </div>
          <div class="sign-line">
            Dr. Angiras Vishnu (PAN: AZHPV0033E)
            <div class="sign-sub">Date: _____ / _____ / 2026 • Kakkanad</div>
          </div>
        </div>

        <div class="stamp-box" style="height: 85px;">
          <div class="stamp-box-text">
            Affix Clinic Stamp<br>(HEAR ONE)
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <span>Document: Doctor PAN Card • Identity Proof for Pine Labs Plural MID 111077</span>
      <span>Page 2 of 3 (Doctor PAN)</span>
    </div>
  </div>


  <!-- ==================== PAGE 3: DOCTOR AADHAAR CARD (FRONT & BACK) ==================== -->
  <div class="page">
    <div>
      <!-- Header -->
      <div class="header">
        <div class="header-left">
          <img src="data:image/jpeg;base64,${clinazaLogo}" class="header-logo" alt="Clinaza">
          <div class="header-title-block">
            <h1>CLINAZA HEALTHCARE TECHNOLOGIES</h1>
            <p>Pine Labs Partner MID: 111077 • Doctor KYC Annexure</p>
          </div>
        </div>
        <div class="header-right">
          <img src="data:image/png;base64,${pluralLogo}" class="plural-logo" alt="Plural by Pine Labs">
          <span class="partner-badge">ANNEXURE II</span>
        </div>
      </div>

      <!-- Annexure Title Banner -->
      <div class="annexure-banner">
        <div>
          <h2>Annexure II — Doctor Aadhaar Card (Front &amp; Back)</h2>
          <p style="font-size:9px; color:#94a3b8;">Mandatory RBI Proof of Identity &amp; Residential Address</p>
        </div>
        <span class="annexure-id">AADHAAR: 4451 2414 5591</span>
      </div>

      <!-- Doctor Meta Strip -->
      <div class="doc-meta-strip">
        <span>Signatory: <strong>Dr. Angiras Vishnu</strong></span>
        <span>Residential Address: <strong>Kidangaziyath Mana, West Chalakudy, Thrissur, Kerala - 680307</strong></span>
        <span style="color:#047857;">Status: <strong>Verified</strong></span>
      </div>

      <!-- High-Res Document Frames: Front and Back -->
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <div class="doc-frame" style="height: 68mm; margin-bottom: 0;">
          <img src="data:image/jpeg;base64,${aadhaarFront}" class="doc-img-aadhaar" alt="Doctor Aadhaar Card Front">
        </div>
        <div class="doc-frame" style="height: 68mm; margin-bottom: 6px;">
          <img src="data:image/jpeg;base64,${aadhaarBack}" class="doc-img-aadhaar" alt="Doctor Aadhaar Card Back">
        </div>
      </div>
    </div>

    <!-- Doctor Self-Attestation Sign Box -->
    <div class="sign-container">
      <div style="font-size:9px; font-weight:700; color:#334155; margin-bottom: 6px;">
        Doctor Self-Attestation Declaration: "I hereby confirm that this is a true, authentic, and verified copy of my original Aadhaar card (Front &amp; Back) for Pine Labs Sub-Merchant KYC."
      </div>
      <div class="sign-grid">
        <div class="sign-box" style="height: 85px;">
          <div class="sign-box-title">Self-Attested By Doctor</div>
          <div style="flex: 1; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-style: italic; font-size: 10px;">
            ✍️ Doctor Sign Across Aadhaar Copy
          </div>
          <div class="sign-line">
            Dr. Angiras Vishnu (Aadhaar: 4451 2414 5591)
            <div class="sign-sub">Date: _____ / _____ / 2026 • Kakkanad</div>
          </div>
        </div>

        <div class="stamp-box" style="height: 85px;">
          <div class="stamp-box-text">
            Affix Clinic Stamp<br>(HEAR ONE)
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <span>Document: Doctor Aadhaar Card (Front &amp; Back) • RBI Address Proof for Pine Labs Plural</span>
      <span>Page 3 of 3 (Doctor Aadhaar)</span>
    </div>
  </div>

</body>
</html>`;

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  const outputPaths = [
    'public/docs/kyc/hear_one/Plural_MAF_and_Doctor_KYC_Signing_Dossier_Hear_One.pdf',
    `${process.env.HOME}/Downloads/Plural_MAF_and_Doctor_KYC_Signing_Dossier_Hear_One.pdf`,
    '/Users/pratyushraj/.gemini/antigravity/brain/3eba0a15-e044-4121-8ed8-62cea45025d2/Plural_MAF_and_Doctor_KYC_Signing_Dossier_Hear_One.pdf'
  ];

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true
  });

  for (const p of outputPaths) {
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, pdfBuffer);
    console.log(`Saved PDF to: ${p} (${pdfBuffer.length} bytes)`);
  }

  await browser.close();
  console.log('PDF generation complete!');
}

generatePdf().catch(console.error);
