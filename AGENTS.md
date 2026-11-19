# Clinaza Instagram Carousel Design Guidelines & Preferences

When the user asks to generate an Instagram carousel post for Clinaza (`@clinaza.in`), adhere strictly to the following verified design preferences:

## 1. Visual & Photographic Style
- **Real Authentic Photography**: Never use empty, flat plain-colored backgrounds or generic low-contrast templates. Every slide must feature or integrate authentic, photorealistic clinic photography (Indian dentists, reception areas, patient consultations, or clinical signage).
- **No Recycled Old Reel Assets**: Do not reuse the generic `assets/reel/*` photos from previous campaigns. Use fresh or specialized clinic assets from `assets/carousel_v2/` or real clinic photography.
- **High Visual Contrast & Readability**: Always use gradient overlays (`linear-gradient(180deg, rgba(2,6,23,0.92) ...)`) behind floating cards so white and colored text pops crisply on mobile screens.

## 2. Typography & Text Hierarchy (Mobile-Optimized)
- **Large Text Only**: No small, wall-of-text copy or long paragraphs. Dentists scroll fast on mobile Instagram.
  - **Slide 1 Hook Headline**: 54px - 60px bold/black font.
  - **Secondary Headers**: 44px - 54px.
  - **Dialogue Quotes / Key Script lines**: 24px - 28px bold.
  - **Card Titles**: 22px - 26px bold.
  - **Card Body / Explanations**: 18px - 20px semi-bold.
  - **CTA Button Text**: 22px - 26px bold.
- **Punchy Formats**: Use comparison chips, strike-through price reframing (e.g. ~~₹55,000~~ vs ₹2,400/mo), and quick 1-sentence takeaways with clear emoji markers (❌, ✅, 💡, 👉).

## 3. Brand Identity & Logo Prominence
- **Clinaza Logo Size**: Keep the Clinaza logo prominent in the top bar (`width: 58px, height: 58px` or larger, rounded corners, drop shadow).
- **Brand Text**: "CLINAZA" in 24px+ bold lettering with a clear uppercase category badge (e.g. `DENTAL REVENUE`, `WHAT NOT TO DO`, `THE 10-SECOND SCRIPT`).
- **Footer**: Include `@clinaza.in` pill badge and clear swipe/save action indicators.

## 4. Content Angles & Messaging
- Focus on practical, clinic-revenue pain points: overcoming patient price objections, eliminating clinic discounts, stopping bad clinic debt (*khata*), and enabling instant point-of-care patient healthcare EMIs.
- **Never claim 0% interest or zero-interest EMIs**: Always frame financing as *flexible monthly EMIs*, *easy paperless EMIs*, or *instant front-desk patient financing* unless explicitly instructed.
- Do not make generic NABH or compliance-heavy content unless explicitly requested.

## 5. Remotion Technical Rendering
- **Dimensions**: Standard 4:5 Instagram Portrait: `1080 x 1350`.
- **Render Command**: Always pass `--gl=angle` when running `npx remotion still` on macOS to avoid GPU shader crashes:
  ```bash
  npx remotion still src/remotion.entry.tsx <CompositionId> <OutputPath> --gl=angle
  ```

---

# Clinaza Fintech Partnerships & Contractual Invariants

Adhere strictly to the following active commercial contracts and partner agreements:

## 1. Pine Labs / Plural (Active Agreement)
- **Signed Commercial Terms**: Clinaza (Mellowprints) is fully signed and onboarded under an institutional agreement with **₹0 Setup / Onboarding Fee**, **₹0 Annual Maintenance Charges (AMC)**, and **No minimum monthly commitment**.
- **Never Re-negotiate Setup Fees**: Never ask for, accept, or suggest setup/onboarding fees with Pine Labs. All discussions with Advaita Parmar or technical teams must assume the ₹0 onboarding agreement is already locked and active.
- **Transaction-Based MDR Only**: Multi-Bank Credit Card EMI (1.85%), EMI processing fee (0.50%), Debit Card EMI (0.90%), RuPay (0.00%), and UPI (0.40%).
- **Integration Setup**: Online Gateway (UAT MID `111077`, Production pending). No hardware POS rental or terminal deposit. Dynamic return/callback URLs with live webhook at `/api/webhook/pinelabs`.

## 2. Easebuzz (Active Sub-Merchant Integration)
- **Model**: Sub-merchant model with EasySplit for automated T+1 clinic settlements.
- **Agreements**: Clinic Sub-Merchant Master Services Agreement and executed pilot agreements hosted publicly at `/docs/Clinaza_Clinic_Sub_Merchant_Master_Services_Agreement.pdf` and `/clinic-agreement`.

## 3. Patient Healthcare Financing Rules
- **No 0% Interest Claims**: Never claim 0% interest or zero-interest financing in outreach, UI, or marketing unless explicitly authorized by a specific subvention scheme. Always use *flexible monthly EMIs*, *paperless EMIs*, or *instant point-of-care patient financing*.

## 4. Commercial UPI & Payment Processing Invariants
- **UPI is NOT Free for Payment Gateways**: In commercial merchant aggregations and payment gateway integrations, UPI is **not free**. Never state or assume that UPI carries 0% cost for Clinaza.
- **Contracted UPI MDR**: Under Clinaza's executed Pine Labs agreement, standard UPI incurs a commercial MDR of **0.40%** (and PPI / Wallet UPI up to 1.10%).
- **Margin & Settlement Modeling**:
  - Always factor in the wholesale **0.40% UPI cost** when designing clinic settlement splits, revenue projections, or platform markups.
  - To monetize counter UPI transactions, apply either a **B2C Digital Convenience Fee** (₹19–₹49 per transaction) or a **B2B Smart Reconciliation Fee** (0.60%–0.75%), ensuring a positive net margin after absorbing the 0.40% gateway MDR.

## 5. Clinaza Clinic B2B Commercial Pricing Invariants
- **₹999 One-Time Setup Fee**: Clinaza charges partner dental clinics a nominal **₹999 one-time onboarding / activation kit fee** (covers physical reception acrylic QR standee, pan-India courier shipping, clinic verification, and lending gateway integration).
- **Never Claim ₹0 Setup Fee for Clinics**: Never write, state, or imply in clinic outreach, emails, KYC requests, or marketing that the setup fee is ₹0 or free for clinics.
- **₹0 Recurring Fees**: Always emphasize that there are **₹0 Annual Maintenance Charges (AMC)** and **₹0 monthly subscription fees**.
- **0% Clinic Recourse**: Highlight that clinics get paid upfront on a T+1 schedule with 0% risk or collection responsibility on patient EMIs.
- **Distinguish Wholesale vs. Retail**:
  - *Wholesale*: Pine Labs charges Clinaza ₹0 setup fee and ₹0 AMC under our institutional agreement.
  - *Retail (Clinics)*: Clinaza charges clinics ₹999 one-time setup fee + ₹0 AMC.

## 6. No Penny Drop Verification Invariant
- **Never Claim or Mention "Penny Drop"**: Never write, state, or imply "penny drop", "₹1 penny drop", or "automated penny drop" in clinic onboarding, KYC pages, customer emails, WhatsApp desk copy, or marketing.
- **Document-Based Bank Verification Only**: Clinic bank accounts and IFSC details are verified via **cancelled cheque upload, doctor PAN verification, and Pine Labs merchant underwriting desk reviews**.
- **Accurate Copy Wording**: Always frame bank linking as:
  - *Secure bank current account linking*
  - *Cancelled cheque & doctor PAN verification*
  - *Pine Labs underwriting & T+1 payout activation*

## 7. Fast Development & Build Speed Invariants
- **Never Run Full `npm run build` During Iterative Tasks**: `npm run build` executes `scripts/prerender.mjs`, which crawls and snapshots all 195+ routes in headless Chrome, taking 4+ minutes (250+ seconds). Never run this during routine coding, UI changes, or intermediate iterations.
- **Fast 6-Second Verification**: Always use `npx tsc --noEmit` (~6–8 seconds) to verify TypeScript safety, syntax, and imports during code changes.
- **Prerender on Final Milestones Only**: Execute the full `npm run build` (or `node scripts/prerender.mjs`) ONLY when explicitly instructed by the user or when cutting a final production deployment.
- **Immediate Backgrounding**: Long-running commands (such as batch outreach or heavy scripts) must be run asynchronously as background tasks so the user is never blocked from interacting.

## 8. Pine Labs Sub-Merchant Desk & Partner Portal UI Invariants
- **Hospital-Grade Light Theme Only**: Never use dark/black palettes (`bg-[#020617]`, `bg-slate-900`) for underwriting portals, partner desks, or risk reviews. Use hospital-grade light themes: `bg-slate-50` canvas, crisp `bg-white` cards, `border-slate-200`, high-contrast text (`text-slate-900`, `text-slate-600`), and Clinaza Blue (`#0867E8`) accents.
- **De-cluttered Action Layout**: Avoid duplicating table rows and action buttons on single-clinic reviews. Keep action bars unified: *Doctor Signing PDF* (primary emerald), *Download MAF Excel* (brand blue), and *Full ZIP* (slate).
- **No Filler Disclaimers**: Do not add repetitive contractual disclaimer footer cards or legal boilerplates unless explicitly requested.

## 9. Doctor KYC Signing Dossier (5-Page Standard)
- **Strict 5-Page Structure**: When generating a dossier for the doctor to sign:
  - **Pages 1–3**: Untouched official Pine Labs Sub-Merchant MAF sheets, converted directly from the `.xlsx` template via LibreOffice `soffice`.
  - **Page 4**: Clean white page with Doctor PAN Card (`125mm` width) + Doctor Self-Attestation declaration & signature line.
  - **Page 5**: Clean white page with Doctor Aadhaar Card (`110mm` width) + Doctor Self-Attestation declaration & signature line.
- **Exclude Clinic Docs**: Never include clinic business proofs (Udyam, establishment license, or cancelled cheques) in the doctor signing PDF unless explicitly requested.

## 10. Instant Clinic Onboarding & Zero-Redeploy Invariant
- **Never Redeploy Vercel for New Clinics**: Never commit static KYC files to Git or push to `main` for routine clinic onboardings. Full Vercel builds trigger headless Chrome pre-rendering on 195+ routes (taking 4+ minutes).
- **Dynamic Database & Script-Driven Ingestion**: New clinic onboardings must be handled dynamically via database records (`clinic_onboardings`) and cloud storage, or through automated ingestion scripts (`scripts/process_clinic_kyc.py`) executing OCR, MAF generation, and dossier creation locally in under 10 seconds.



