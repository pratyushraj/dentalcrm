import os

def build_guizang_deck():
    template_path = ".agents/skills/guizang-ppt-skill/assets/template-swiss.html"
    with open(template_path, "r", encoding="utf-8") as f:
        template = f.read()

    # Locate #deck injection boundaries
    deck_start_idx = template.find('<div id="deck">') + len('<div id="deck">\n')
    # Locate closing of #deck (the last </section>\n\n</div> before nav)
    deck_end_marker = '</section>\n\n</div>\n\n<div id="nav">'
    deck_end_idx = template.find(deck_end_marker) + len('</section>')

    header_part = template[:deck_start_idx]
    footer_part = template[deck_end_idx:]

    # Update Title in header
    header_part = header_part.replace(
        "<title>[必填] 替换为 PPT 标题 · Deck Title</title>",
        "<title>Clinaza · Point-of-Care Healthcare Financing Network · Institutional Dossier</title>"
    )

    slides_html = """
<!-- ============================================================
     SLIDE 01 · S01 / SWISS-COVER-ASCII · Hero Cover (IKB 满屏 + ASCII 呼吸场)
     ============================================================ -->
<section class="slide accent" data-layout="SWISS-COVER-ASCII" data-animate="hero" data-slide-id="cover">
  <div class="canvas-card">
    <canvas class="ascii-bg" aria-hidden="true"></canvas>
    <div class="chrome-min">
      <div class="l">CLINAZA TECHNOLOGIES · clinaza.in</div>
      <div class="r">JUSPAY HYPERCREDIT · 01 / 07</div>
    </div>
    <div style="flex:1;padding:0;display:grid;grid-template-rows:auto 1fr auto;gap:2.6vh">
      <div data-anim="kicker" class="t-meta" style="color:rgba(255,255,255,.78);letter-spacing:.22em">POINT-OF-CARE HEALTHCARE FINANCING</div>
      <h1 data-anim="title" style="align-self:center;font-family:var(--sans),var(--sans-zh);font-weight:200;font-size:min(7.2vw,12vh);line-height:.96;letter-spacing:-.025em;color:#fff">
        Accelerating Prime Elective Dental Lending<br/>
        via <span style="font-style:italic;font-weight:300">Juspay HyperCredit</span> Rails
      </h1>
      <div data-anim="bottom" style="display:grid;grid-template-rows:auto auto;gap:1.6vh;border-top:1px solid rgba(255,255,255,.22);padding-top:2vh">
        <div data-anim="lead" class="lead" style="max-width:54ch;color:rgba(255,255,255,.86);font-weight:300">
          Executive Partnership Dossier Prepared for Institutional Lending Partners &amp; Healthcare NBFCs. Pre-screened clinical originations with zero end-use cash diversion.
        </div>
        <div style="display:flex;justify-content:space-between;align-items:end">
          <div class="t-meta" style="color:rgba(255,255,255,.6)">Pratyush Raj · Founder &amp; CEO · clinaza.in</div>
          <div class="t-meta" style="color:rgba(255,255,255,.6)">→ Swipe or Use Arrow Keys [P for Presenter]</div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ============================================================
     SLIDE 02 · S06 · Market Gap & Opportunity (KPI Tower 不等高柱状)
     ============================================================ -->
<section class="slide light" data-layout="S06" data-animate="measure-up" data-slide-id="market-gap">
  <div class="canvas-card">
    <div class="chrome-min">
      <div class="l">MACRO PROBLEM &amp; ADDRESSABLE MARKET</div>
      <div class="r">02 / 07</div>
    </div>
    <div style="flex:1;padding:0;display:grid;grid-template-rows:auto 1fr;gap:4.5vh">
      <div data-anim="head" style="display:grid;grid-template-columns:1fr 1fr;gap:3vw;align-items:start">
        <div>
          <div class="t-meta">100% OUT-OF-POCKET HEALTHCARE</div>
          <h2 style="font-family:var(--sans),var(--sans-zh);font-weight:200;font-size:min(5.2vw,8.8vh);line-height:.98;letter-spacing:-.03em;color:var(--text-primary)">
            60%+ Out-of-Pocket Spend.<br/>Zero Dental Insurance.
          </h2>
        </div>
        <div>
          <p class="lead" style="font-weight:300;color:var(--text-secondary);max-width:44ch">
            Dental treatments (implants, aligners, surgeries) are 100% excluded under standard Indian Mediclaim policies. When procedures exceed ₹35,000, over 50% of diagnosed patients drop out due to lump-sum payment friction.
          </p>
        </div>
      </div>

      <div class="kpi-tower-row" data-anim="up" style="display:grid;grid-template-columns:repeat(4,1fr);gap:2vw;align-items:end">
        <div class="tower-col" style="display:flex;flex-direction:column;gap:1vh;align-items:flex-start">
          <div class="t-meta">TOTAL OOP TAM</div>
          <span style="font-family:var(--sans);font-weight:200;font-size:min(4.8vw,8vh);line-height:.9;letter-spacing:-.04em">$72B</span>
          <span class="body-sm" style="color:var(--text-helper)">₹6 Lakh Crore unorganized health spend</span>
          <div class="bar-tower" style="width:100%;height:18vh;background:var(--grey-1);border-top:2px solid var(--ink)"></div>
        </div>
        <div class="tower-col" style="display:flex;flex-direction:column;gap:1vh;align-items:flex-start">
          <div class="t-meta">DENTAL TAM</div>
          <span style="font-family:var(--sans);font-weight:200;font-size:min(4.8vw,8vh);line-height:.9;letter-spacing:-.04em;color:var(--accent)">$3.2B</span>
          <span class="body-sm" style="color:var(--text-helper)">₹26,500 Cr 100% uninsured market</span>
          <div class="bar-tower" style="width:100%;height:24vh;background:rgba(0,47,167,.12);border-top:2px solid var(--accent)"></div>
        </div>
        <div class="tower-col" style="display:flex;flex-direction:column;gap:1vh;align-items:flex-start">
          <div class="t-meta">CLINAZA SAM</div>
          <span style="font-family:var(--sans);font-weight:200;font-size:min(4.8vw,8vh);line-height:.9;letter-spacing:-.04em;color:var(--accent)">₹11,200 Cr</span>
          <span class="body-sm" style="color:var(--text-helper)">Aligners, Implants, Full-Mouth Rehabs</span>
          <div class="bar-tower" style="width:100%;height:30vh;background:rgba(0,47,167,.2);border-top:2px solid var(--accent)"></div>
        </div>
        <div class="tower-col" style="display:flex;flex-direction:column;gap:1vh;align-items:flex-start">
          <div class="t-meta">CASE ABANDONMENT</div>
          <span style="font-family:var(--sans);font-weight:200;font-size:min(4.8vw,8vh);line-height:.9;letter-spacing:-.04em">52%</span>
          <span class="body-sm" style="color:var(--text-helper)">Dropouts at front-desk payment stage</span>
          <div class="bar-tower" style="width:100%;height:14vh;background:var(--grey-1);border-top:2px solid var(--ink)"></div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ============================================================
     SLIDE 03 · S19 · Competitive Landscape (Four Cards 四列均分卡)
     ============================================================ -->
<section class="slide light" data-layout="S19" data-animate="four-cards" data-slide-id="competitors">
  <div class="canvas-card">
    <div class="chrome-min">
      <div class="l">COMPETITIVE MATRIX &amp; STRUCTURAL MOAT</div>
      <div class="r">03 / 07</div>
    </div>
    <div style="flex:1;padding:0;display:grid;grid-template-rows:auto 1fr;gap:4vh">
      <div data-anim="head" style="display:flex;flex-direction:column;gap:1.2vh">
        <div style="width:80px;height:2px;background:var(--accent)"></div>
        <div class="t-meta">DISTRIBUTION &amp; SOURCING COMPARISON</div>
        <h2 style="font-family:var(--sans),var(--sans-zh);font-weight:200;font-size:min(4.8vw,8vh);line-height:.98;letter-spacing:-.03em">
          Why Clinaza Outperforms Incumbents
        </h2>
      </div>

      <div class="four-cards" data-anim="up" style="display:grid;grid-template-columns:repeat(4,1fr);gap:1.6vw">
        <!-- SaveIN -->
        <article class="card-fill" style="padding:3vh 1.8vw;display:flex;flex-direction:column;justify-content:space-between;border-top:2px solid var(--border-subtle)">
          <div>
            <span class="t-meta" style="color:var(--text-helper)">01 · STAND-ALONE QR</span>
            <h3 style="font-family:var(--sans);font-weight:400;font-size:min(1.8vw,3vh);margin:1vh 0 .5vh">SaveIN</h3>
            <p class="body-sm" style="color:var(--text-helper);margin-bottom:1.8vh">YC Backed · ~$12M Raised</p>
            <div style="font-size:13px;line-height:1.5;color:var(--text-secondary)">
              <strong>Limitation:</strong> Relies on passive front-desk acrylic standees. Pivot into retail/furniture diluted clinical staff recall.
            </div>
          </div>
          <div style="border-top:1px solid var(--border-subtle);padding-top:1.5vh;margin-top:2vh">
            <span class="t-cat" style="color:var(--accent)">Clinaza Wedge</span>
            <p style="font-size:13px;line-height:1.45;color:var(--text-primary);font-weight:500;margin-top:.4vh">
              Chairside consultation alignment embeds financing during diagnosis, securing genuine medical intent.
            </p>
          </div>
        </article>

        <!-- CarePay -->
        <article class="card-fill" style="padding:3vh 1.8vw;display:flex;flex-direction:column;justify-content:space-between;border-top:2px solid var(--border-subtle)">
          <div>
            <span class="t-meta" style="color:var(--text-helper)">02 · POST-INVOICE LINK</span>
            <h3 style="font-family:var(--sans);font-weight:400;font-size:min(1.8vw,3vh);margin:1vh 0 .5vh">CarePay</h3>
            <p class="body-sm" style="color:var(--text-helper);margin-bottom:1.8vh">Carecoin · Pre-Seed</p>
            <div style="font-size:13px;line-height:1.5;color:var(--text-secondary)">
              <strong>Limitation:</strong> Pure checkout payment link triggered only after final invoice generation, causing high dropouts.
            </div>
          </div>
          <div style="border-top:1px solid var(--border-subtle);padding-top:1.5vh;margin-top:2vh">
            <span class="t-cat" style="color:var(--accent)">Clinaza Wedge</span>
            <p style="font-size:13px;line-height:1.45;color:var(--text-primary);font-weight:500;margin-top:.4vh">
              Financing integrated at treatment planning stage, achieving 2.5x higher conversion than front-desk links.
            </p>
          </div>
        </article>

        <!-- Fibe -->
        <article class="card-fill" style="padding:3vh 1.8vw;display:flex;flex-direction:column;justify-content:space-between;border-top:2px solid var(--border-subtle)">
          <div>
            <span class="t-meta" style="color:var(--text-helper)">03 · D2C CONSUMER LOAN</span>
            <h3 style="font-family:var(--sans);font-weight:400;font-size:min(1.8vw,3vh);margin:1vh 0 .5vh">Fibe (EarlySalary)</h3>
            <p class="body-sm" style="color:var(--text-helper);margin-bottom:1.8vh">Healthcare Vertical</p>
            <div style="font-size:13px;line-height:1.5;color:var(--text-secondary)">
              <strong>Limitation:</strong> High performance marketing CAC. Loans disburse directly to patient accounts with high cash diversion risk.
            </div>
          </div>
          <div style="border-top:1px solid var(--border-subtle);padding-top:1.5vh;margin-top:2vh">
            <span class="t-cat" style="color:var(--accent)">Clinaza Wedge</span>
            <p style="font-size:13px;line-height:1.45;color:var(--text-primary);font-weight:500;margin-top:.4vh">
              Zero CAC doctor sourcing. 100% of sanctioned funds disburse direct to verified clinic current accounts.
            </p>
          </div>
        </article>

        <!-- Bajaj Finserv Health -->
        <article class="card-accent" style="padding:3vh 1.8vw;display:flex;flex-direction:column;justify-content:space-between;background:var(--accent);color:#fff">
          <div>
            <span class="t-meta" style="color:rgba(255,255,255,.75)">04 · HARDWARE CLOSED-LOOP</span>
            <h3 style="font-family:var(--sans);font-weight:400;font-size:min(1.8vw,3vh);margin:1vh 0 .5vh;color:#fff">Bajaj Finserv Health</h3>
            <p class="body-sm" style="color:rgba(255,255,255,.75);margin-bottom:1.8vh">Health EMI Card Network</p>
            <div style="font-size:13px;line-height:1.5;color:rgba(255,255,255,.9)">
              <strong>Limitation:</strong> Requires pre-issued plastic cards or POS terminal swipes with punitive subvention charges on clinics.
            </div>
          </div>
          <div style="border-top:1px solid rgba(255,255,255,.3);padding-top:1.5vh;margin-top:2vh">
            <span class="t-cat" style="color:#fff;letter-spacing:.1em">CLINAZA ADVANTAGE</span>
            <p style="font-size:13px;line-height:1.45;color:#fff;font-weight:500;margin-top:.4vh">
              100% digital, zero physical card requirement; paperless OTP journey completed in &lt;3 mins via Juspay rails.
            </p>
          </div>
        </article>
      </div>
    </div>
  </div>
</section>

<!-- ============================================================
     SLIDE 04 · S04 · Underwriting Moat & Low-NPA Protections (Six Cells)
     ============================================================ -->
<section class="slide light" data-layout="S04" data-animate="grid-reveal" data-slide-id="underwriting-moat">
  <div class="canvas-card">
    <div class="chrome-min">
      <div class="l">RISK ARCHITECTURE &amp; FRAUD IMMUNITY</div>
      <div class="r">04 / 07</div>
    </div>
    <div style="flex:1;padding:0;display:grid;grid-template-rows:auto 1fr;gap:4vh">
      <div data-anim="head">
        <div class="t-meta">INSTITUTIONAL PORTFOLIO SAFEGUARDS</div>
        <h2 style="font-family:var(--sans),var(--sans-zh);font-weight:200;font-size:min(4.8vw,8vh);line-height:.98;letter-spacing:-.03em">
          Underwriting Moats Protecting Partner Lenders
        </h2>
      </div>

      <div class="sub-grid-3-2" data-anim="up" style="display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(2,1fr);gap:1.8vh 1.8vw">
        <article class="card-fill" style="padding:2.5vh 1.8vw;display:flex;flex-direction:column;justify-content:space-between">
          <div class="t-meta" style="color:var(--accent)">01 · DOCTOR-VETTED BORROWERS</div>
          <h4 style="font-size:min(1.4vw,2.4vh);font-weight:500;margin:.6vh 0">Clinical Examination &amp; KYC</h4>
          <p class="body-sm" style="color:var(--text-secondary)">
            Borrowers are physically evaluated, diagnosed, and KYC-verified by licensed dental surgeons (MDS/BDS). Sourced from stable salaried and business households.
          </p>
        </article>

        <article class="card-fill" style="padding:2.5vh 1.8vw;display:flex;flex-direction:column;justify-content:space-between">
          <div class="t-meta" style="color:var(--accent)">02 · ZERO END-USE CASH DIVERSION</div>
          <h4 style="font-size:min(1.4vw,2.4vh);font-weight:500;margin:.6vh 0">100% Direct Clinic Disbursement</h4>
          <p class="body-sm" style="color:var(--text-secondary)">
            Funds never credit to personal borrower bank accounts or wallets. Proceeds disburse directly to verified clinic bank accounts against registered invoices.
          </p>
        </article>

        <article class="card-fill" style="padding:2.5vh 1.8vw;display:flex;flex-direction:column;justify-content:space-between">
          <div class="t-meta" style="color:var(--accent)">03 · INELASTIC MEDICAL NECESSITY</div>
          <h4 style="font-size:min(1.4vw,2.4vh);font-weight:500;margin:.6vh 0">Essential Oral Health &amp; Function</h4>
          <p class="body-sm" style="color:var(--text-secondary)">
            Unlike consumer lifestyle gadgets or retail electronics, dental surgeries resolve severe pain and masticatory function, yielding historically lower willful default.
          </p>
        </article>

        <article class="card-fill" style="padding:2.5vh 1.8vw;display:flex;flex-direction:column;justify-content:space-between">
          <div class="t-meta" style="color:var(--accent)">04 · PRE-CONFIGURED JUSPAY INFRA</div>
          <h4 style="font-size:min(1.4vw,2.4vh);font-weight:500;margin:.6vh 0">Zero IT Development Cycles</h4>
          <p class="body-sm" style="color:var(--text-secondary)">
            Your institution is already integrated with Juspay HyperCredit. Onboarding Clinaza requires zero custom API builds, zero SDK changes, and zero core-banking dev.
          </p>
        </article>

        <article class="card-fill" style="padding:2.5vh 1.8vw;display:flex;flex-direction:column;justify-content:space-between">
          <div class="t-meta" style="color:var(--accent)">05 · AUTOMATED E-NACH MANDATES</div>
          <h4 style="font-size:min(1.4vw,2.4vh);font-weight:500;margin:.6vh 0">Paperless Auto-Debit Repayment</h4>
          <p class="body-sm" style="color:var(--text-secondary)">
            Repayments are locked in via instant NPCI e-NACH mandates during the 3-minute OTP checkout flow, ensuring frictionless monthly collections.
          </p>
        </article>

        <article class="card-fill" style="padding:2.5vh 1.8vw;display:flex;flex-direction:column;justify-content:space-between;border-left:2px solid var(--accent)">
          <div class="t-meta" style="color:var(--accent)">06 · INSTITUTIONAL CREDIT ALIGNMENT</div>
          <h4 style="font-size:min(1.4vw,2.4vh);font-weight:500;margin:.6vh 0">Full Policy Control</h4>
          <p class="body-sm" style="color:var(--text-secondary)">
            Lender retains 100% discretion over credit underwriting rules, credit bureau cut-offs, interest pricing, and risk tiering across clinic cohorts.
          </p>
        </article>
      </div>
    </div>
  </div>
</section>

<!-- ============================================================
     SLIDE 05 · S21 · Lending Specifications & Scale (Tech Spec Sheet)
     ============================================================ -->
<section class="slide light" data-layout="S21" data-animate="tech-spec" data-slide-id="lending-specs">
  <div class="canvas-card">
    <div class="chrome-min">
      <div class="l">COMMERCIAL PARAMETERS &amp; VOLUME PROJECTIONS</div>
      <div class="r">05 / 07</div>
    </div>
    <div style="flex:1;padding:0;display:grid;grid-template-rows:auto 1fr;gap:4vh">
      <div data-anim="head">
        <div class="t-meta">PORTFOLIO SPECIFICATIONS &amp; SCALE ROADMAP</div>
        <h2 style="font-family:var(--sans),var(--sans-zh);font-weight:200;font-size:min(4.8vw,8vh);line-height:.98;letter-spacing:-.03em">
          Lending Product Parameters &amp; Rollout
        </h2>
      </div>

      <div style="display:grid;grid-template-columns:1.2fr 1fr;gap:3vw;align-items:start" data-anim="up">
        <!-- Left: Specifications Ledger -->
        <div style="display:flex;flex-direction:column;gap:1.6vh">
          <div style="display:flex;justify-content:space-between;border-bottom:1px solid var(--border-subtle);padding-bottom:1vh">
            <span class="t-meta">TICKET SIZE RANGE</span>
            <span style="font-family:var(--sans);font-weight:500;font-size:min(1.4vw,2.4vh)">₹15,000 to ₹3,00,000 (Avg: ₹55k–₹85k)</span>
          </div>
          <div style="display:flex;justify-content:space-between;border-bottom:1px solid var(--border-subtle);padding-bottom:1vh">
            <span class="t-meta">TENURE OPTIONS</span>
            <span style="font-family:var(--sans);font-weight:500;font-size:min(1.4vw,2.4vh)">3, 6, 9, 12, 18, and 24 Months Flexible</span>
          </div>
          <div style="display:flex;justify-content:space-between;border-bottom:1px solid var(--border-subtle);padding-bottom:1vh">
            <span class="t-meta">BORROWER JOURNEY</span>
            <span style="font-family:var(--sans);font-weight:500;font-size:min(1.4vw,2.4vh)">100% Paperless OTP (&lt;3 Minutes via Juspay)</span>
          </div>
          <div style="display:flex;justify-content:space-between;border-bottom:1px solid var(--border-subtle);padding-bottom:1vh">
            <span class="t-meta">SETTLEMENT RAILS</span>
            <span style="font-family:var(--sans);font-weight:500;font-size:min(1.4vw,2.4vh)">T+1 / T+2 Direct Clinic Settlement</span>
          </div>
          <div style="display:flex;justify-content:space-between;border-bottom:1px solid var(--border-subtle);padding-bottom:1vh">
            <span class="t-meta">CREDIT MANDATE</span>
            <span style="font-family:var(--sans);font-weight:500;font-size:min(1.4vw,2.4vh)">Automated e-NACH Auto-Debit</span>
          </div>
          <div style="display:flex;justify-content:space-between;border-bottom:2px solid var(--accent);padding-bottom:1vh">
            <span class="t-meta" style="color:var(--accent)">ELIGIBLE PROCEDURES</span>
            <span style="font-family:var(--sans);font-weight:500;font-size:min(1.4vw,2.4vh);color:var(--accent)">Aligners, Implants, Root Canals, Full-Mouth</span>
          </div>
        </div>

        <!-- Right: 3-Phase Projected Volume -->
        <div style="display:flex;flex-direction:column;gap:1.8vh">
          <div class="card-fill" style="padding:2.2vh 1.8vw;display:flex;justify-content:space-between;align-items:center">
            <div>
              <div class="t-meta">PHASE 1 (MONTHS 1–3)</div>
              <p style="font-size:13px;color:var(--text-secondary);margin-top:.4vh">25–40 Dental Centers across Tier-1/2 Metros</p>
            </div>
            <div style="text-align:right">
              <span style="font-family:var(--sans);font-weight:200;font-size:min(3.2vw,5.2vh);color:var(--accent)">₹35L – ₹75L</span>
              <div class="t-meta" style="color:var(--text-helper)">/ Month GMV</div>
            </div>
          </div>

          <div class="card-fill" style="padding:2.2vh 1.8vw;display:flex;justify-content:space-between;align-items:center">
            <div>
              <div class="t-meta">PHASE 2 (MONTHS 4–6)</div>
              <p style="font-size:13px;color:var(--text-secondary);margin-top:.4vh">75–120 Dental Practices &amp; Regional Chains</p>
            </div>
            <div style="text-align:right">
              <span style="font-family:var(--sans);font-weight:200;font-size:min(3.2vw,5.2vh);color:var(--accent)">₹1.2Cr – ₹2.5Cr</span>
              <div class="t-meta" style="color:var(--text-helper)">/ Month GMV</div>
            </div>
          </div>

          <div class="card-fill" style="padding:2.2vh 1.8vw;display:flex;justify-content:space-between;align-items:center;border-left:2px solid var(--accent)">
            <div>
              <div class="t-meta" style="color:var(--accent)">PHASE 3 (SCALE 12 MO)</div>
              <p style="font-size:13px;color:var(--text-secondary);margin-top:.4vh">250+ Partner Dental Practices Nationwide</p>
            </div>
            <div style="text-align:right">
              <span style="font-family:var(--sans);font-weight:200;font-size:min(3.2vw,5.2vh);color:var(--accent)">₹3.5Cr – ₹6.0Cr</span>
              <div class="t-meta" style="color:var(--text-helper)">/ Month GMV</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ============================================================
     SLIDE 06 · S11 · Technical Architecture & Juspay Flow (Horizontal Timeline)
     ============================================================ -->
<section class="slide light" data-layout="S11" data-animate="timeline-walk" data-slide-id="juspay-flow">
  <div class="canvas-card">
    <div class="chrome-min">
      <div class="l">INTEGRATION &amp; WORKFLOW ARCHITECTURE</div>
      <div class="r">06 / 07</div>
    </div>
    <div style="flex:1;padding:0;display:grid;grid-template-rows:auto 1fr auto;gap:4vh">
      <div data-anim="head">
        <div class="t-meta">END-TO-END POINT-OF-CARE RAILS</div>
        <h2 style="font-family:var(--sans),var(--sans-zh);font-weight:200;font-size:min(4.8vw,8vh);line-height:.98;letter-spacing:-.03em">
          Pre-Activated on Existing Juspay HyperCredit Rails
        </h2>
      </div>

      <div class="timeline-h" data-anim="up" style="display:grid;grid-template-columns:repeat(4,1fr);gap:2vw;position:relative;margin:4vh 0">
        <div class="tl-h-node" style="display:flex;flex-direction:column;gap:1.5vh">
          <span class="t-meta" style="color:var(--accent)">STEP 01</span>
          <div style="height:2px;background:var(--accent);width:100%"></div>
          <h4 style="font-size:min(1.4vw,2.4vh);font-weight:500">Diagnosis &amp; Estimate</h4>
          <p class="body-sm" style="color:var(--text-secondary)">
            Doctor formulates treatment plan (e.g. ₹65,000 implants) and triggers instant financing link directly chairside.
          </p>
        </div>

        <div class="tl-h-node" style="display:flex;flex-direction:column;gap:1.5vh">
          <span class="t-meta" style="color:var(--accent)">STEP 02</span>
          <div style="height:2px;background:var(--accent);width:100%"></div>
          <h4 style="font-size:min(1.4vw,2.4vh);font-weight:500">Instant KYC &amp; Sanction</h4>
          <p class="body-sm" style="color:var(--text-secondary)">
            Patient inputs PAN/Aadhaar. Juspay HyperCredit routes to partner lender for real-time risk decisioning in &lt;90 seconds.
          </p>
        </div>

        <div class="tl-h-node" style="display:flex;flex-direction:column;gap:1.5vh">
          <span class="t-meta" style="color:var(--accent)">STEP 03</span>
          <div style="height:2px;background:var(--accent);width:100%"></div>
          <h4 style="font-size:min(1.4vw,2.4vh);font-weight:500">E-NACH &amp; OTP Sign</h4>
          <p class="body-sm" style="color:var(--text-secondary)">
            Borrower signs loan agreement via Aadhaar OTP and authorizes auto-debit repayment via NPCI e-NACH with zero paperwork.
          </p>
        </div>

        <div class="tl-h-node" style="display:flex;flex-direction:column;gap:1.5vh">
          <span class="t-meta" style="color:var(--accent)">STEP 04</span>
          <div style="height:2px;background:var(--accent);width:100%"></div>
          <h4 style="font-size:min(1.4vw,2.4vh);font-weight:500">Direct Disbursement</h4>
          <p class="body-sm" style="color:var(--text-secondary)">
            100% of sanctioned loan capital is disbursed directly to the verified clinic's current bank account via Juspay settlement rails.
          </p>
        </div>
      </div>

      <div class="card-fill" data-anim="lead" style="padding:2.6vh 2.4vw;border-left:3px solid var(--accent)">
        <span class="t-cat" style="color:var(--accent)">Zero Integration Sprint Cycles</span>
        <p style="font-size:max(14px,1vw);color:var(--text-primary);line-height:1.5;margin-top:.4vh">
          Because your institution is already integrated and active on Juspay HyperCredit, launching with Clinaza requires no technical heavy-lifting. Clinaza sources doctor-vetted cases and routes them through the standard HyperCredit gateway your team already uses.
        </p>
      </div>
    </div>
  </div>
</section>

<!-- ============================================================
     SLIDE 07 · SWISS-CLOSING-ASCII / S10 · Split Closing Manifesto & Contacts
     ============================================================ -->
<section class="slide split" data-layout="SWISS-CLOSING-ASCII" data-animate="split-statement" data-slide-id="closing">
  <div class="canvas-card">
    <div class="split-half">
      <!-- Left: IKB Accent + ASCII Noise -->
      <div class="half b-accent" style="padding:5.6vh 3.6vw 4.4vh;justify-content:space-between;position:relative;overflow:hidden">
        <canvas class="ascii-bg" aria-hidden="true"></canvas>
        <div class="chrome-min" style="margin-bottom:0;position:relative;z-index:1">
          <div class="l">07 / 07</div>
          <div class="r">PARTNERSHIP EXECUTION</div>
        </div>

        <div data-anim="manifesto" style="display:flex;flex-direction:column;gap:2vh;position:relative;z-index:1">
          <div class="t-meta" style="color:rgba(255,255,255,.78);letter-spacing:.22em;margin-bottom:1.6vh">INSTITUTIONAL ROLLOUT</div>
          <h2 style="font-family:var(--sans),var(--sans-zh);font-size:min(6vw,10vh);line-height:.96;letter-spacing:-.025em;font-weight:200;color:#fff">
            High Quality.<br/>Zero Diversion.<br/><span style="font-style:italic;font-weight:300">Live in 14 Days.</span>
          </h2>
          <div style="font-family:var(--sans),var(--sans-zh);font-size:max(14px,1vw);line-height:1.6;color:rgba(255,255,255,.86);font-weight:300;max-width:38ch;margin-top:1.4vh">
            Instant point-of-care patient financing for India's ₹26,500 Cr dental market, powered by verified clinic originations.
          </div>
        </div>

        <div data-anim="signature" style="display:flex;justify-content:space-between;align-items:end;border-top:1px solid rgba(255,255,255,.22);padding-top:2vh;position:relative;z-index:1">
          <div class="t-meta" style="color:rgba(255,255,255,.62)">Clinaza Technologies · Bengaluru</div>
          <div class="t-meta" style="color:rgba(255,255,255,.62)">clinaza.in</div>
        </div>
      </div>

      <!-- Right: Next Steps & Key Contacts -->
      <div class="half" style="padding:5.6vh 3.6vw 4.4vh;justify-content:space-between">
        <div class="chrome-min">
          <div class="l">NEXT STEPS &amp; CONTACTS</div>
          <div class="r">ONBOARDING</div>
        </div>

        <div data-anim="rules" style="display:flex;flex-direction:column;gap:0">
          <div style="display:grid;grid-template-columns:auto 1fr;gap:1.5vw;align-items:start;padding:2vh 0;border-top:1px solid var(--border-subtle)">
            <div style="font-family:var(--sans);font-weight:200;font-size:min(3.2vw,5vh);line-height:.9;color:var(--text-primary)">01</div>
            <div>
              <h3 style="font-family:var(--sans),var(--sans-zh);font-weight:500;font-size:max(16px,1.4vw);line-height:1.2;color:var(--text-primary);margin-bottom:.6vh">Lender Credit Alignment Call</h3>
              <p style="font-size:13px;line-height:1.5;color:var(--text-secondary);font-weight:400">Joint meeting with partner NBFC underwriting and product teams facilitated by Juspay HyperCredit.</p>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:auto 1fr;gap:1.5vw;align-items:start;padding:2vh 0;border-top:1px solid var(--border-subtle)">
            <div style="font-family:var(--sans);font-weight:200;font-size:min(3.2vw,5vh);line-height:.9;color:var(--text-primary)">02</div>
            <div>
              <h3 style="font-family:var(--sans),var(--sans-zh);font-weight:500;font-size:max(16px,1.4vw);line-height:1.2;color:var(--text-primary);margin-bottom:.6vh">Commercial &amp; Risk Parameters Sign-Off</h3>
              <p style="font-size:13px;line-height:1.5;color:var(--text-secondary);font-weight:400">Finalize interest subvention / borrower APR parameters and risk tiering across dental clinic cohorts.</p>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:auto 1fr;gap:1.5vw;align-items:start;padding:2vh 0;border-top:1px solid var(--border-subtle);border-bottom:2px solid var(--accent)">
            <div style="font-family:var(--sans);font-weight:200;font-size:min(3.2vw,5vh);line-height:.9;color:var(--accent)">03</div>
            <div>
              <h3 style="font-family:var(--sans),var(--sans-zh);font-weight:500;font-size:max(16px,1.4vw);line-height:1.2;color:var(--accent);margin-bottom:.6vh">Sandbox / Pilot Launch (10 Clinics)</h3>
              <p style="font-size:13px;line-height:1.5;color:var(--text-secondary);font-weight:400">Deploy paperless patient financing across 10 top-producing clinics in Bengaluru &amp; Delhi NCR within 14 days.</p>
            </div>
          </div>
        </div>

        <div style="border-top:1px solid var(--border-subtle);padding-top:1.8vh;display:flex;justify-content:space-between;align-items:flex-end">
          <div>
            <div class="t-meta" style="color:var(--accent)">PRIMARY FOUNDER POC</div>
            <div style="font-weight:600;font-size:14px;color:var(--text-primary);margin-top:.2vh">Pratyush Raj · +91 7292984244</div>
            <div style="font-size:12px;color:var(--text-secondary)">pratyushraj@outlook.com · clinaza.in</div>
          </div>
          <div style="text-align:right">
            <div class="t-meta">JUSPAY ALLIANCES POC</div>
            <div style="font-weight:500;font-size:13px;color:var(--text-primary);margin-top:.2vh">Subahan Shaik</div>
            <div style="font-size:12px;color:var(--text-secondary)">subahan.shaik@juspay.in</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
"""

    speaker_notes_script = """
<!-- 演讲备注 -->
<script>
const SPEAKER_NOTES = [
  {
    id: 'cover', title: 'Clinaza x Juspay HyperCredit', section: 'Cover', minutes: 1.0,
    purpose: 'Introduce Clinaza and establish institutional alignment with Juspay lending partners',
    talk: [
      'Welcome everyone. Clinaza is building India\\'s premier point-of-care healthcare financing network.',
      'We partner with licensed dental clinics to deliver instant front-desk patient financing.',
      'Because our distribution integrates chairside and connects to your existing Juspay HyperCredit gateway, we offer institutional lenders prime originations with zero tech overhead.'
    ],
    transition: 'Let us examine the massive macroeconomic gap in elective healthcare spend.'
  },
  {
    id: 'market-gap', title: 'Macro Problem & Market Size', section: 'Market Gap', minutes: 1.5,
    purpose: 'Quantify the 100% out-of-pocket nature of dental and our addressable SAM',
    talk: [
      'Over 60% of healthcare spend in India is entirely out-of-pocket.',
      'Crucially, dental procedures are 100% excluded under standard health insurance (Mediclaim).',
      'This creates a $3.2B (₹26,500 Cr) completely uninsured market where over half of diagnosed patients abandon treatment due to lump-sum payment friction.'
    ],
    transition: 'Here is how Clinaza fundamentally outperforms existing medical loan aggregators.'
  },
  {
    id: 'competitors', title: 'Competitive Landscape & Moat', section: 'Competition', minutes: 2.0,
    purpose: 'Directly address SaveIN, CarePay, Fibe, and Bajaj to prove Clinaza\\'s distribution edge',
    talk: [
      'SaveIN relied on passive acrylic standees and diluted into retail and furniture financing.',
      'CarePay offers a checkout link triggered after invoicing, causing severe front-desk dropoffs.',
      'Fibe spends heavily on D2C marketing and disburses into patient bank accounts, creating severe cash diversion risk.',
      'Bajaj requires physical EMI cards and heavy merchant subventions on clinics.',
      'Clinaza captures financing chairside during diagnosis, disbursing 100% direct to verified clinic accounts.'
    ],
    transition: 'Let us review the underwriting safeguards protecting your portfolio from NPAs.'
  },
  {
    id: 'underwriting-moat', title: 'Underwriting Moat & Low-NPA Protections', section: 'Risk Moat', minutes: 2.0,
    purpose: 'Demonstrate doctor vetting, zero cash diversion, and automated e-NACH collections',
    talk: [
      'First, 100% of borrowers are examined and KYC-vetted by licensed dental surgeons.',
      'Second, zero end-use cash diversion—funds disburse strictly to the clinic current account.',
      'Third, repayments are locked via automated NPCI e-NACH auto-debit mandates.'
    ],
    transition: 'Now let us look at the financial product parameters and projected rollout.'
  },
  {
    id: 'lending-specs', title: 'Lending Parameters & Volume Roadmap', section: 'Rollout', minutes: 1.5,
    purpose: 'Review ticket sizes, tenures, and our 3-phase GMV scale roadmap',
    talk: [
      'Average tickets range from ₹55,000 to ₹85,000 across 3 to 24 month flexible tenures.',
      'We scale from ₹35L–₹75L/month in Phase 1 to ₹3.5Cr–₹6Cr/month in Phase 3 across 250+ clinics.'
    ],
    transition: 'Here is the seamless end-to-end operational flow powered by Juspay HyperCredit.'
  },
  {
    id: 'juspay-flow', title: 'Juspay HyperCredit Technical Flow', section: 'Architecture', minutes: 1.5,
    purpose: 'Reassure lenders that zero new IT or API integration work is required',
    talk: [
      'Because your institution already operates live on Juspay HyperCredit, this is purely an institutional activation.',
      'The entire patient journey from PAN entry to sanction and e-NACH takes under 3 minutes.'
    ],
    transition: 'Finally, our immediate onboarding milestones and contacts.'
  },
  {
    id: 'closing', title: 'Next Steps & Contacts', section: 'Closing', minutes: 1.0,
    purpose: 'Outline the 14-day pilot onboarding timeline and provide direct contacts',
    talk: [
      'We can launch a 10-clinic sandbox pilot in Bengaluru and Delhi NCR within 14 days of credit alignment.',
      'Looking forward to working closely with your risk and underwriting teams.'
    ],
    transition: 'Opening for Q&A.'
  }
];
</script>
"""

    # Inject into footer_part (replace sample SPEAKER_NOTES)
    notes_start = footer_part.find('const SPEAKER_NOTES = [')
    if notes_start != -1:
        notes_end = footer_part.find('];', notes_start) + 2
        # replace script section
        footer_part = footer_part[:footer_part.rfind('<script>', 0, notes_start)] + speaker_notes_script + footer_part[footer_part.find('</script>', notes_end) + len('</script>'):]

    final_html = header_part + slides_html + footer_part

    out_file = "clinaza_deck_swiss/index.html"
    with open(out_file, "w", encoding="utf-8") as f:
        f.write(final_html)

    print(f"✅ Generated Swiss-Style Interactive Web Presentation Deck: {out_file}")

if __name__ == '__main__':
    build_guizang_deck()
