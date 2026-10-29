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

const cIconBase64 = getBase64Image(path.join(__dirname, '../public/docs/clinaza_c_icon.png'));
const clinazaLogoBase64 = getBase64Image(path.join(__dirname, '../public/assets/clinaza-logo.jpg'));
const flexmoneyBase64 = getBase64Image(path.join(__dirname, '../public/assets/flexmoney_logo.png'));
const hdfcBase64 = getBase64Image(path.join(__dirname, '../public/assets/lenders/hdfc.png'));
const iciciBase64 = getBase64Image(path.join(__dirname, '../public/assets/lenders/icici.png'));
const idfcBase64 = getBase64Image(path.join(__dirname, '../public/assets/lenders/idfc.png'));
const bajajBase64 = getBase64Image(path.join(__dirname, '../public/assets/lenders/bajaj.png'));
const lazypayBase64 = getBase64Image(path.join(__dirname, '../public/assets/lenders/lazypay.png'));

// Dark Mode Template
const darkHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    width: 1584px;
    height: 396px;
    background: #060B18;
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    color: #FFFFFF;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
  }

  /* Ambient Glow & Grid */
  .grid-pattern {
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 36px 36px;
    opacity: 0.7;
    z-index: 1;
  }

  .glow-left {
    position: absolute;
    width: 500px;
    height: 500px;
    left: -100px;
    top: -150px;
    background: radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, rgba(6, 11, 24, 0) 70%);
    z-index: 2;
    pointer-events: none;
  }

  .glow-right {
    position: absolute;
    width: 600px;
    height: 500px;
    right: -100px;
    top: -100px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(6, 11, 24, 0) 70%);
    z-index: 2;
    pointer-events: none;
  }

  /* Banner Container - 540px left padding guarantees profile avatar does NOT block text on Mobile or Desktop */
  .container {
    position: relative;
    z-index: 10;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 70px 0 540px; 
  }

  /* Left/Center Content Zone */
  .content-col {
    max-width: 510px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .pill-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(14, 165, 233, 0.12);
    border: 1px solid rgba(14, 165, 233, 0.35);
    padding: 5px 14px;
    border-radius: 9999px;
    width: fit-content;
    margin-bottom: 12px;
  }

  .pill-dot {
    width: 7px;
    height: 7px;
    background: #00F2FE;
    border-radius: 50%;
    box-shadow: 0 0 10px #00F2FE;
  }

  .pill-text {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: #38BDF8;
  }

  .brand-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
  }

  .brand-logo {
    width: 32px;
    height: 32px;
    border-radius: 8px;
  }

  .brand-title {
    font-size: 26px;
    font-weight: 900;
    letter-spacing: -0.5px;
    color: #FFFFFF;
  }

  .brand-title span {
    color: #00F2FE;
  }

  .headline {
    font-size: 26px;
    font-weight: 800;
    line-height: 1.24;
    letter-spacing: -0.5px;
    color: #F8FAFC;
    margin-bottom: 12px;
  }

  .headline .highlight {
    background: linear-gradient(135deg, #00F2FE 0%, #4FACFE 50%, #10B981 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .subhead {
    font-size: 13px;
    font-weight: 500;
    line-height: 1.45;
    color: #94A3B8;
    margin-bottom: 14px;
  }

  /* Feature Pills */
  .features-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 14px;
  }

  .feature-chip {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 4px 10px;
    border-radius: 8px;
    font-size: 11px;
    font-weight: 600;
    color: #E2E8F0;
  }

  .feature-chip .chip-icon {
    font-size: 12px;
  }

  .footer-meta {
    display: flex;
    align-items: center;
    gap: 14px;
    font-size: 11px;
    font-weight: 600;
    color: #64748B;
  }

  .footer-meta .meta-link {
    color: #38BDF8;
    text-decoration: none;
    font-weight: 700;
    letter-spacing: 0.3px;
  }

  .footer-meta .meta-dot {
    width: 3px;
    height: 3px;
    background: #475569;
    border-radius: 50%;
  }

  /* Right Card - Live Clinic Checkout */
  .card-col {
    position: relative;
    width: 410px;
    height: 295px;
    background: rgba(15, 23, 42, 0.75);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 18px;
    box-shadow: 
      0 20px 45px rgba(0, 0, 0, 0.6),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(16px);
    padding: 18px 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    padding-bottom: 12px;
  }

  .card-top-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .live-pulse {
    width: 8px;
    height: 8px;
    background: #10B981;
    border-radius: 50%;
    box-shadow: 0 0 10px #10B981;
  }

  .card-top-title {
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #94A3B8;
  }

  .card-top-badge {
    background: rgba(16, 185, 129, 0.15);
    color: #34D399;
    border: 1px solid rgba(16, 185, 129, 0.3);
    font-size: 11px;
    font-weight: 700;
    padding: 3px 9px;
    border-radius: 6px;
  }

  /* Treatment info */
  .treatment-box {
    margin: 8px 0;
  }

  .treatment-meta {
    font-size: 11px;
    font-weight: 600;
    color: #64748B;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
  }

  .treatment-name {
    font-size: 17px;
    font-weight: 800;
    color: #F8FAFC;
    margin-bottom: 10px;
  }

  .emi-price-row {
    display: flex;
    align-items: baseline;
    gap: 12px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 12px;
    padding: 10px 14px;
  }

  .emi-main {
    font-size: 24px;
    font-weight: 900;
    color: #00F2FE;
    letter-spacing: -0.5px;
  }

  .emi-tenure {
    font-size: 13px;
    font-weight: 600;
    color: #94A3B8;
  }

  .original-price {
    font-size: 13px;
    font-weight: 600;
    color: #64748B;
    text-decoration: line-through;
    margin-left: auto;
  }

  /* Settlement status */
  .settlement-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    font-weight: 600;
    color: #CBD5E1;
    background: rgba(14, 165, 233, 0.08);
    border: 1px solid rgba(14, 165, 233, 0.2);
    border-radius: 10px;
    padding: 8px 12px;
  }

  .settlement-left {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #38BDF8;
  }

  .settlement-right {
    color: #34D399;
    font-weight: 700;
  }

  /* Lender rails row */
  .rails-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    padding-top: 10px;
  }

  .rails-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.8px;
    color: #64748B;
    text-transform: uppercase;
  }

  .rails-logos {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .rail-tag {
    font-size: 11px;
    font-weight: 700;
    color: #94A3B8;
    background: rgba(255, 255, 255, 0.06);
    padding: 3px 8px;
    border-radius: 5px;
  }
</style>
</head>
<body>
  <div class="grid-pattern"></div>
  <div class="glow-left"></div>
  <div class="glow-right"></div>

  <div class="container">
    <!-- Left / Center Content -->
    <div class="content-col">
      <div class="pill-badge">
        <div class="pill-dot"></div>
        <span class="pill-text">Healthcare Financing Infrastructure</span>
      </div>

      <div class="brand-row">
        ${cIconBase64 ? `<img src="${cIconBase64}" class="brand-logo" alt="Clinaza" />` : ''}
        <div class="brand-title">CLINAZA<span>.IN</span></div>
      </div>

      <div class="headline">
        Instant Point-of-Care <br>
        <span class="highlight">Patient EMI Financing</span> for Clinics
      </div>

      <div class="subhead">
        Overcoming patient price resistance at the front desk. Enable instant Card, Cardless & NTB installment plans with zero doctor credit risk.
      </div>

      <div class="features-row">
        <div class="feature-chip"><span class="chip-icon">⚡</span> Instant Digital e-KYC</div>
        <div class="feature-chip"><span class="chip-icon">💳</span> CC, DC & Cardless EMIs</div>
        <div class="feature-chip"><span class="chip-icon">🛡️</span> T+1 Direct Settlement</div>
        <div class="feature-chip"><span class="chip-icon">🏛️</span> 100% RBI PA Nodal Compliant</div>
      </div>

      <div class="footer-meta">
        <span class="meta-link">clinaza.in</span>
        <div class="meta-dot"></div>
        <span>Built for Dental, Ortho & Aesthetic Clinics</span>
        <div class="meta-dot"></div>
        <span>Pan-India Network</span>
      </div>
    </div>

    <!-- Right Card Mockup -->
    <div class="card-col">
      <div class="card-top">
        <div class="card-top-left">
          <div class="live-pulse"></div>
          <span class="card-top-title">Point-of-Care Terminal</span>
        </div>
        <span class="card-top-badge">Instant Approval</span>
      </div>

      <div class="treatment-box">
        <div class="treatment-meta">Treatment Plan • Dr. Sharma Dental Studio</div>
        <div class="treatment-name">Full-Mouth Dental Implants & Zirconia Crown</div>
        
        <div class="emi-price-row">
          <div>
            <div class="emi-main">₹5,416<span style="font-size: 15px; font-weight: 600; color: #94A3B8;">/mo</span></div>
          </div>
          <div class="emi-tenure">12-Month Flexible Plan</div>
          <div class="original-price">₹65,000</div>
        </div>
      </div>

      <div class="settlement-row">
        <div class="settlement-left">
          <span>✓</span>
          <span>Zero Doctor Credit Risk</span>
        </div>
        <div class="settlement-right">T+1 Settled to Clinic</div>
      </div>

      <div class="rails-row">
        <span class="rails-label">Integrated Rails</span>
        <div class="rails-logos">
          <span class="rail-tag">HDFC</span>
          <span class="rail-tag">ICICI</span>
          <span class="rail-tag">IDFC FIRST</span>
          <span class="rail-tag">Flexmoney</span>
          <span class="rail-tag">Cashfree</span>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`;

// Light Mode Template
const lightHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    width: 1584px;
    height: 396px;
    background: #F8FAFC;
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    color: #0F172A;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
  }

  .grid-pattern {
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(rgba(148, 163, 184, 0.12) 1px, transparent 1px),
      linear-gradient(90deg, rgba(148, 163, 184, 0.12) 1px, transparent 1px);
    background-size: 36px 36px;
    opacity: 0.8;
    z-index: 1;
  }

  .glow-left {
    position: absolute;
    width: 600px;
    height: 500px;
    left: -100px;
    top: -150px;
    background: radial-gradient(circle, rgba(14, 165, 233, 0.12) 0%, rgba(248, 250, 252, 0) 70%);
    z-index: 2;
    pointer-events: none;
  }

  .glow-right {
    position: absolute;
    width: 600px;
    height: 500px;
    right: -100px;
    top: -100px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, rgba(248, 250, 252, 0) 70%);
    z-index: 2;
    pointer-events: none;
  }

  .container {
    position: relative;
    z-index: 10;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 70px 0 540px; 
  }

  .content-col {
    max-width: 510px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .pill-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #E0F2FE;
    border: 1px solid #BAE6FD;
    padding: 5px 14px;
    border-radius: 9999px;
    width: fit-content;
    margin-bottom: 12px;
  }

  .pill-dot {
    width: 7px;
    height: 7px;
    background: #0284C7;
    border-radius: 50%;
  }

  .pill-text {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #0369A1;
  }

  .brand-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
  }

  .brand-logo {
    width: 32px;
    height: 32px;
    border-radius: 8px;
  }

  .brand-title {
    font-size: 26px;
    font-weight: 900;
    letter-spacing: -0.5px;
    color: #0A193C;
  }

  .brand-title span {
    color: #0284C7;
  }

  .headline {
    font-size: 26px;
    font-weight: 900;
    line-height: 1.24;
    letter-spacing: -0.5px;
    color: #0A193C;
    margin-bottom: 12px;
  }

  .headline .highlight {
    color: #0284C7;
  }

  .subhead {
    font-size: 13px;
    font-weight: 500;
    line-height: 1.45;
    color: #475569;
    margin-bottom: 14px;
  }

  .features-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 14px;
  }

  .feature-chip {
    display: flex;
    align-items: center;
    gap: 6px;
    background: #FFFFFF;
    border: 1px solid #CBD5E1;
    padding: 4px 10px;
    border-radius: 8px;
    font-size: 11px;
    font-weight: 600;
    color: #1E293B;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .footer-meta {
    display: flex;
    align-items: center;
    gap: 14px;
    font-size: 11px;
    font-weight: 600;
    color: #64748B;
  }

  .footer-meta .meta-link {
    color: #0284C7;
    text-decoration: none;
    font-weight: 700;
  }

  .footer-meta .meta-dot {
    width: 3px;
    height: 3px;
    background: #CBD5E1;
    border-radius: 50%;
  }

  /* Right Card */
  .card-col {
    position: relative;
    width: 410px;
    height: 295px;
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 18px;
    box-shadow: 
      0 20px 40px -15px rgba(15, 23, 42, 0.12),
      0 0 0 1px rgba(15, 23, 42, 0.05);
    padding: 18px 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #F1F5F9;
    padding-bottom: 12px;
  }

  .card-top-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .live-pulse {
    width: 8px;
    height: 8px;
    background: #10B981;
    border-radius: 50%;
  }

  .card-top-title {
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #64748B;
  }

  .card-top-badge {
    background: #ECFDF5;
    color: #059669;
    border: 1px solid #A7F3D0;
    font-size: 11px;
    font-weight: 700;
    padding: 3px 9px;
    border-radius: 6px;
  }

  .treatment-box {
    margin: 8px 0;
  }

  .treatment-meta {
    font-size: 11px;
    font-weight: 600;
    color: #64748B;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
  }

  .treatment-name {
    font-size: 17px;
    font-weight: 800;
    color: #0F172A;
    margin-bottom: 10px;
  }

  .emi-price-row {
    display: flex;
    align-items: baseline;
    gap: 12px;
    background: #F8FAFC;
    border: 1px solid #E2E8F0;
    border-radius: 12px;
    padding: 10px 14px;
  }

  .emi-main {
    font-size: 24px;
    font-weight: 900;
    color: #0284C7;
    letter-spacing: -0.5px;
  }

  .emi-tenure {
    font-size: 13px;
    font-weight: 600;
    color: #475569;
  }

  .original-price {
    font-size: 13px;
    font-weight: 600;
    color: #94A3B8;
    text-decoration: line-through;
    margin-left: auto;
  }

  .settlement-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    font-weight: 600;
    color: #0369A1;
    background: #F0F9FF;
    border: 1px solid #BAE6FD;
    border-radius: 10px;
    padding: 8px 12px;
  }

  .settlement-right {
    color: #059669;
    font-weight: 700;
  }

  .rails-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid #F1F5F9;
    padding-top: 10px;
  }

  .rails-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.8px;
    color: #64748B;
    text-transform: uppercase;
  }

  .rails-logos {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .rail-tag {
    font-size: 11px;
    font-weight: 700;
    color: #334155;
    background: #F1F5F9;
    padding: 3px 8px;
    border-radius: 5px;
  }
</style>
</head>
<body>
  <div class="grid-pattern"></div>
  <div class="glow-left"></div>
  <div class="glow-right"></div>

  <div class="container">
    <div class="content-col">
      <div class="pill-badge">
        <div class="pill-dot"></div>
        <span class="pill-text">Healthcare Financing Infrastructure</span>
      </div>

      <div class="brand-row">
        ${cIconBase64 ? `<img src="${cIconBase64}" class="brand-logo" alt="Clinaza" />` : ''}
        <div class="brand-title">CLINAZA<span>.IN</span></div>
      </div>

      <div class="headline">
        Instant Point-of-Care <br>
        <span class="highlight">Patient EMI Financing</span> for Clinics
      </div>

      <div class="subhead">
        Overcoming patient price resistance at the front desk. Enable instant Card, Cardless & NTB installment plans with zero doctor credit risk.
      </div>

      <div class="features-row">
        <div class="feature-chip"><span>⚡</span> Instant Digital e-KYC</div>
        <div class="feature-chip"><span>💳</span> CC, DC & Cardless EMIs</div>
        <div class="feature-chip"><span>🛡️</span> T+1 Direct Settlement</div>
        <div class="feature-chip"><span>🏛️</span> 100% RBI PA Nodal Compliant</div>
      </div>

      <div class="footer-meta">
        <span class="meta-link">clinaza.in</span>
        <div class="meta-dot"></div>
        <span>Built for Dental, Ortho & Aesthetic Clinics</span>
        <div class="meta-dot"></div>
        <span>Pan-India Network</span>
      </div>
    </div>

    <div class="card-col">
      <div class="card-top">
        <div class="card-top-left">
          <div class="live-pulse"></div>
          <span class="card-top-title">Point-of-Care Terminal</span>
        </div>
        <span class="card-top-badge">Instant Approval</span>
      </div>

      <div class="treatment-box">
        <div class="treatment-meta">Treatment Plan • Dr. Sharma Dental Studio</div>
        <div class="treatment-name">Full-Mouth Dental Implants & Zirconia Crown</div>
        
        <div class="emi-price-row">
          <div>
            <div class="emi-main">₹5,416<span style="font-size: 15px; font-weight: 600; color: #64748B;">/mo</span></div>
          </div>
          <div class="emi-tenure">12-Month Flexible Plan</div>
          <div class="original-price">₹65,000</div>
        </div>
      </div>

      <div class="settlement-row">
        <div><span>✓</span> Zero Doctor Credit Risk</div>
        <div class="settlement-right">T+1 Settled to Clinic</div>
      </div>

      <div class="rails-row">
        <span class="rails-label">Integrated Rails</span>
        <div class="rails-logos">
          <span class="rail-tag">HDFC</span>
          <span class="rail-tag">ICICI</span>
          <span class="rail-tag">IDFC FIRST</span>
          <span class="rail-tag">Flexmoney</span>
          <span class="rail-tag">Cashfree</span>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`;

async function renderBanners() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // Render Dark Banner
  const pageDark = await browser.newPage();
  await pageDark.setViewport({ width: 1584, height: 396, deviceScaleFactor: 2 });
  await pageDark.setContent(darkHtml, { waitUntil: 'load', timeout: 15000 });
  await new Promise(r => setTimeout(r, 600)); // wait for Google Fonts
  const darkOutputPath = path.join(__dirname, '../public/assets/clinaza_linkedin_banner_dark.png');
  const desktopDarkPath = '/Users/pratyushraj/Desktop/Clinaza_LinkedIn_Banner_Dark.png';
  await pageDark.screenshot({ path: darkOutputPath });
  await pageDark.screenshot({ path: desktopDarkPath });
  console.log('Saved Dark Banner to:', desktopDarkPath);
  await pageDark.close();

  // Render Light Banner
  const pageLight = await browser.newPage();
  await pageLight.setViewport({ width: 1584, height: 396, deviceScaleFactor: 2 });
  await pageLight.setContent(lightHtml, { waitUntil: 'load', timeout: 15000 });
  await new Promise(r => setTimeout(r, 600)); // wait for Google Fonts
  const lightOutputPath = path.join(__dirname, '../public/assets/clinaza_linkedin_banner_light.png');
  const desktopLightPath = '/Users/pratyushraj/Desktop/Clinaza_LinkedIn_Banner_Light.png';
  await pageLight.screenshot({ path: lightOutputPath });
  await pageLight.screenshot({ path: desktopLightPath });
  console.log('Saved Light Banner to:', desktopLightPath);
  await pageLight.close();

  await browser.close();
}

renderBanners().catch(console.error);
