# Clinaza Fintech Pipeline, Traction & Operations Dossier

> **Created:** October 25, 2026  
> **Purpose:** Master context file for Clinaza (`clinaza.in`). Access this in any new chat window to instantly retrieve live partnership pipeline status, developer API findings, SEO rankings, and ongoing deal notes.

---

## 1. Key Contacts & Partnership Status

### A. Zaakpay (MobiKwik) — Priority 1 (Call Pending)
* **Lead Contact:** **Saurabh Dayal** (Senior Director at Zaakpay / MobiKwik).
* **Current Status:** Saurabh responded: *"Hey Pratyush. We can do this for sure. Let me call u tomorrow for this"*.
* **Objective:** Enable multi-clinic onboarding with direct split settlements (T+1), Credit Card EMI, Debit Card EMI, and Cardless EMI (MobiKwik ZIP).
* **Key Architecture Verified from Developer Docs (`developer.zaakpay.com`):**
  * **Split Payment API (`/api/v1/splitTxnByAmount`)**: Dedicated split payout mechanism. Clinaza acts as `masterMerchantIdentifier` (receives platform fee) and the clinic is `subMerchantIdentifier` (receives procedure cost directly into clinic current account). This keeps Clinaza 100% compliant with RBI Payment Aggregator nodal guidelines without needing a separate PA license.
  * **EMI Rates Fetch API (`/api/emi/fetch/rates`)**: Strictly for **Cards (Credit & Debit Card EMI)** based on card BIN and bank ID (returns exact tenures 3, 6, 9, 12 months & interest schedule).
  * **Cardless EMI / MobiKwik ZIP**: Dynamic user-level underwriting triggered via hosted checkout/OTP modal (not static rates).
* **Questions for Saurabh on Call:**
  1. What is the maximum ticket size ceiling for Cardless EMI / MobiKwik ZIP (can it support ₹50,000–₹1,50,000 for implants/aligners)?
  2. Sub-merchant onboarding turn-around time for Sole Proprietorship dental clinics (4 basic docs).
  3. Commercials / MDR for CC/DC EMI vs. Cardless.
  4. S2S eligibility check API by mobile number for Cardless.

---

### B. Pine Labs (Plural) — Priority 2 (Warm Leadership Referral)
* **Lead Contact:** **Nishant Gupta** (Former SVP Easebuzz, connected to Pine Labs Affordability).
* **Current Status:** Nishant highlighted: *"Pinelabs has best Affordability suit available in the market... cc emi, cardless, brand emi and 1/4 emi"* and noted: *"will ask team to connect and share the details with you"*. Pratyush shared phone and email (`7292984244`, `pratyushraj@outlook.com`).
* **Objective:** Access Pine Labs’ market-leading Affordability Suite (Online via Plural Gateway API + optional Android Smart POS terminals for high-end clinic counters) under an institutional zero-setup-fee agreement.
* **Key Leverage:** Nishant’s referral flags Clinaza as an SVP/Leadership Inbound lead, avoiding standard sales rep rack fees.

---

### C. Flexmoney (InstaCred) — Anchor Lending Rail (In Final Review)
* **Current Status:** Institutional lending / merchant aggregator agreement in final legal signoff.
* **Underwriting Strength:** Open-market Consumer Durable loan underwriting via **IDFC FIRST Bank** and NBFC partners (supports uncarded patients, open-market approvals up to ₹5–8 Lakhs).
* **IDFC FIRST Bank CD Loan Mechanics (Audited in this session):**
  * Open-market underwriting: Approves non-IDFC bank account holders via digital e-KYC.
  * Age eligibility: 21–68 years; salaried or self-employed with basic banking history.
  * Auto-debit: e-NACH / digital mandate on the borrower's primary bank account.
  * Digital rail distinction: Physical retail stores rely on physical DSE POS reps, whereas Clinaza uses Flexmoney's instant digital checkout API right at the clinic front desk.
* **Clinic Onboarding Guide & Collateral Rules:**
  * Strict policy: Zero mentions of "₹0" or "Zero SaaS". Replaced with institutional performance language (100% Non-Recourse, Direct T+1 Disbursals, 3–12 Month Tenures).
  * Patient Eligibility Matrix: Built-in criteria showing who qualifies (Indians 21–65, PAN + Aadhaar, active bank account/UPI, credit score >650) vs. who doesn't (under 21, no bank account, active loan defaults).
  * Family Financing (Option A): Digital lending is underwritten to one primary earning adult (no joint loans), but earning family members (parents, spouse) can apply on behalf of dependent patients/students.
  * Standard treatments & cost grid: Implants (₹35k–₹60k), Aligners (₹50k–₹1.5L), Full Mouth Rehab (₹1.5L–₹3L), Crowns & RCT (₹15k–₹35k), Smile Makeovers (₹60k–₹1.5L).
  * Materials Updated: The official 2-page clinic onboarding guide (`public/docs/Clinaza_Clinic_Overview_and_Onboarding_Guide.pdf` & on Desktop) prominently features official Flexmoney partnership badges.

---

### D. Easebuzz — Secondary Gateway Track
* **Current Status:** A sales rep previously quoted an arbitrary ₹1 Lakh setup fee for marketplace onboarding.
* **Active Contact 1:** **Rahul Gupta** (AVP - Growth & Strategy, Neo Banking at Easebuzz). Handles SaaS Products, Payouts / Connected Banking, and Embedded Lending.
* **Active Contact 2:** **Pritam Das** (BDM - Neo Banking at Easebuzz | Ex-Fibe / Ex-Juspay). Deeply familiar with healthcare BNPL/checkout financing from his Fibe background.
* **Pitch to Rahul / Pritam:**
  > *"Hi, great connecting! I’m Pratyush, founder of Clinaza (clinaza.in). We aggregate independent dental clinics across India for point-of-care patient EMI financing. We want to use Easebuzz’s Split Payouts API and Affordability suite (Card & Cardless EMI) to settle directly to our partner clinics on T+1. A sales rep earlier quoted a ₹1L setup fee, which doesn't make sense for an aggregator bringing an active pipeline of 50 clinics. Can we connect for a quick 5-min call to set this up under an institutional, zero-fee structure? Best, Pratyush Raj | +91 7292984244"*
* **Escalation Contacts:** **Vijay Thapliyal** (Senior VP - Payments & Banking) and **Yogesh Sharma** (SVP BizDev).

---

### E. Inbound PR Pitch Handled
* **Contact:** **Megha Gowda** (Strategic Communications & PR, Bengaluru/Delhi).
* **Pitch:** Hospital/Healthcare PR at ₹35k–₹50k/month.
* **Response Sent:** Firm and polite deferral. Clinaza is 100% focused on product rollout and clinic partner activations over the next 1–2 months; will reconnect for media announcements once initial clinic cohorts are active.

---

## 2. Live Search & GEO (AI Search) Traction

### Verified Live Google Search Rankings for `dental treatment emi`:
* **Ghaziabad:** **Organic #2** (directly below Bajaj Finserv)
* **Pune:** **Organic #4** (`clinaza.in/cities/pimpri-chinchwad`) — *Directly drove the inbound Pune patient call!*
* **Mumbai:** **Organic #4** (`clinaza.in/cities/vasai-virar`) & **#9** (`clinaza.in/cities/pimpri-chinchwad`) — 2 spots on Page 1
* **Delhi:** **Organic #5** (`clinaza.in/.../delhi`)
* **Bengaluru:** **Organic #7** (`clinaza.in/blog/dental-treatment-on-emi-india-guide`) — Outranking Practo (#10)

### Google Gemini AI Overview Citations:
1. Gemini cites `www.clinaza.in` as the primary ground-truth source for typical dental procedure costs (Implants ₹35k–₹60k, Aligners ₹50k–₹1.5L) and estimated monthly EMIs.
2. Gemini explicitly groups **Clinaza** under *"Leading Dental EMI Providers & Networks"* alongside Bajaj Finserv and GMoney.

---

## 3. LinkedIn Post & Content Distribution
* **Published:** October 24, 2026 on Pratyush Raj's personal profile (500+ followers).
* **Hook:** *"From cold calling 40 dental clinics a day to picking up inbound calls from receptionists asking: 'Doctor wants to know how we onboard our clinic with Clinaza.' And we haven't spent a single rupee on performance ads..."*
* **Story:** Real inbound phone call from a patient in Pune traveling to the UK next week needing high-ticket dental work on EMI; founder tension of Flexmoney agreement in final review; 4-pillar front-desk solution (2-min e-KYC, 3–12 mo tenures, T+1 settlement, 0 doctor credit risk).
* **Visuals Attached:** 
  1. Google Search screenshot showing Clinaza at #2 in Ghaziabad under Bajaj Finserv.
  2. Gemini AI Overview cost & EMI table citing `clinaza.in`.
  3. Gemini listing Clinaza under leading providers.

---

## 4. Key Assets & Document Locations
* **Clinic Onboarding Guide PDF (Desktop):** `/Users/pratyushraj/Desktop/Clinaza_Clinic_Overview_and_Onboarding_Guide.pdf`
* **HTML Template:** `public/docs/clinaza_clinic_onboarding_guide.html`
* **PDF Generator Script:** `scripts/generate_clinic_pdf.cjs`
* **Screenshots & Proofs:** `~/Downloads/iScreen Shoter - Google Chrome - 261024115203.jpg` & `261024115327.jpg`
* **Company / Legal Details:** Clinaza (Legal Entity: Mellowprints, Sole Proprietorship), founder Pratyush Raj. Contact: `contact@clinaza.in` / `pratyushraj@outlook.com` / `+91 7292984244`.
