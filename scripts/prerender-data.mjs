import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));

export const TREATMENT_METADATA = {
  '/dental-implant-loan': {
    title: 'Dental Implant Loan & EMI in India (From ₹2,400/mo) | Clinaza',
    description: 'Finance single, multiple, and full mouth dental implants on flexible monthly EMI in India. 2-min paperless digital approval across partner dental clinics with zero clinic recourse.',
    h1: 'Dental Implant Loan & Instant EMI Financing in India',
    badge: 'DENTAL IMPLANT FINANCING',
    intro: 'Don\'t delay your permanent smile restoration. Clinaza equips partner dental implant centers with instant point-of-care patient financing across 16+ major banks with zero clinic recourse and direct T+1 current account settlement.',
    pricing: [
      { name: 'Single Tooth Implant (Osstem / Dentium)', cost: '₹25,000 – ₹45,000', emi: 'From ₹2,400/mo' },
      { name: 'Premium Swiss Implant (Straumann / Nobel Biocare)', cost: '₹55,000 – ₹85,000', emi: 'From ₹4,500/mo' },
      { name: 'Full Mouth All-on-4 Dental Implants', cost: '₹1,80,000 – ₹3,50,000', emi: 'From ₹8,500/mo' },
      { name: 'Full Mouth All-on-6 Fixed Arch', cost: '₹2,80,000 – ₹5,00,000', emi: 'From ₹12,500/mo' },
    ],
    faqs: [
      { q: 'Can I get dental implants on monthly EMI in India?', a: 'Yes. Through Clinaza partner clinics, patients can finance single, multiple, and full-mouth implants from ₹25,000 to ₹5,00,000 with flexible monthly installments across 16+ banks and RBI-regulated NBFCs.' },
      { q: 'Can I get a dental implant loan without a credit card (Cardless EMI)?', a: 'Yes. Clinaza offers Cardless medical EMIs using only your Aadhaar and PAN OTP verification with instant 2-minute digital approval.' },
      { q: 'Does health insurance cover dental implants in India?', a: 'Standard retail health insurance policies in India exclude dental implants as elective cosmetic or prosthetic procedures unless caused by acute accidental trauma. Clinaza point-of-care patient EMI is the preferred out-of-pocket alternative.' },
      { q: 'How does the clinic receive payment?', a: 'Clinaza partners with Pine Labs Plural to disburse 100% of the procedure invoice directly into your clinic current account on a guaranteed T+1 business day settlement cycle with 0% clinic credit risk.' }
    ]
  },
  '/clear-aligners-on-emi': {
    title: 'Clear Aligners Cost on EMI in India (From ₹2,600/mo) | Clinaza',
    description: 'Finance invisible teeth aligners on easy monthly EMI in India. Paperless approval across partner orthodontic clinics with zero credit card required.',
    h1: 'Clear Aligners & Invisible Braces Cost on Monthly EMI',
    badge: 'ORTHODONTIC FINANCING',
    intro: 'Straighten your teeth discreetly with invisible aligners without paying the full fee upfront. Clinaza enables flexible 3 to 24 month EMIs for leading aligner brands with instant OTP approval.',
    pricing: [
      { name: 'Mild Anterior Crowding / Spacing', cost: '₹45,000 – ₹65,000', emi: 'From ₹2,600/mo' },
      { name: 'Moderate Orthodontic Correction', cost: '₹70,000 – ₹1,10,000', emi: 'From ₹3,800/mo' },
      { name: 'Complex Comprehensive Malocclusion', cost: '₹1,20,000 – ₹1,80,000', emi: 'From ₹5,800/mo' },
      { name: 'Invisalign Comprehensive System', cost: '₹1,50,000 – ₹3,20,000', emi: 'From ₹7,500/mo' },
    ],
    faqs: [
      { q: 'Can I get clear aligners on EMI without a credit card?', a: 'Yes. Clinaza cardless orthodontic EMI allows you to split your aligner treatment using only your PAN card and Aadhaar OTP.' },
      { q: 'How long does clear aligner treatment take?', a: 'Most mild-to-moderate orthodontic cases complete in 6 to 14 months, with visible smile alignment improvements within the first 8 weeks.' },
      { q: 'Does health insurance cover invisible aligners in India?', a: 'No. Retail Mediclaim policies exclude orthodontic teeth straightening as elective cosmetic treatment.' }
    ]
  },
  '/lasik-eye-surgery-on-emi': {
    title: 'LASIK Eye Surgery on EMI in India (From ₹2,900/mo) | Contoura & SMILE',
    description: 'Finance LASIK, Contoura Vision & SMILE eye surgery on easy monthly EMI in India. Instant 2-min digital approval from ~11.5% p.a. Across partner eye hospitals.',
    h1: 'LASIK Eye Surgery Cost on EMI in India (Contoura Vision & SMILE)',
    badge: 'OPHTHALMOLOGY FINANCING',
    intro: 'Achieve crisp 20/20 vision without eyeglasses. Clinaza partners with top laser eye hospitals to provide instant point-of-care patient financing for Femto-LASIK, Contoura Vision, SMILE, and ICL surgeries.',
    pricing: [
      { name: 'Standard Blade Microkeratome LASIK', cost: '₹25,000 – ₹40,000', emi: 'From ₹2,200/mo' },
      { name: 'Blade-Free All-Laser Femto LASIK', cost: '₹45,000 – ₹70,000', emi: 'From ₹2,900/mo' },
      { name: 'Topography-Guided Contoura Vision', cost: '₹75,000 – ₹1,15,000', emi: 'From ₹4,200/mo' },
      { name: 'Flapless Keyhole SMILE / SMILE Pro', cost: '₹95,000 – ₹1,35,000', emi: 'From ₹5,500/mo' },
      { name: 'EVO Visian ICL (High Power / Thin Cornea)', cost: '₹1,10,000 – ₹1,80,000', emi: 'From ₹6,500/mo' },
    ],
    faqs: [
      { q: 'Does health insurance cover LASIK eye surgery in India?', a: 'Under IRDAI regulations, retail health insurance (Mediclaim) excludes refractive surgery unless refractive power in either eye is -7.5 diopters or higher. Elective vision correction (-1D to -6D) is out-of-pocket, making Clinaza point-of-care EMI the preferred option.' },
      { q: 'Can I get LASIK eye surgery on EMI without a credit card (Cardless EMI)?', a: 'Yes. Cardless medical EMIs for vision correction are available across leading RBI-regulated NBFC partners and bank cardless networks using just your Aadhaar and PAN OTP with 2-minute instant digital verification.' },
      { q: 'What documents are needed to apply for a LASIK EMI loan?', a: 'Only your PAN card, Aadhaar card, and an active bank account with net banking/UPI autopay are needed. Approvals are completed digitally in 2 minutes at the hospital billing desk.' },
      { q: 'What are the interest rates and repayment tenures?', a: 'Interest rates range from ~1.0% to 1.5% per month (~11.5% to 15.0% p.a. reducing balance) through RBI-regulated lending partners, with repayment tenures of 3, 6, 9, 12, 18, and 24 months.' },
      { q: 'Can I foreclose or pay off my loan early?', a: 'Yes. Under RBI guidelines, retail personal loans carry flexible prepayment and foreclosure terms with zero or minimal charges depending on the regulated lending partner.' },
      { q: 'How do eye hospitals and refractive centres partner with Clinaza?', a: 'Ophthalmologists and eye hospitals can onboard at clinaza.in/clinic-onboarding to equip reception counters with Pine Labs Plural point-of-care financing, guaranteed T+1 current account payouts, and 0% hospital credit risk.' }
    ]
  },
  '/hair-transplant-on-emi': {
    title: 'Hair Transplant Cost on EMI in India (From ₹2,500/mo) | FUE & DHI Financing',
    description: 'Finance FUE and DHI hair transplants on affordable monthly EMI in India. 2-min instant digital approval from ~11.5% p.a. Across partner hair restoration clinics.',
    h1: 'Hair Transplant Surgery Cost on Monthly EMI in India',
    badge: 'HAIR RESTORATION FINANCING',
    intro: 'Restore your natural hairline and hair density without high upfront payments. Clinaza enables instant 3 to 24 month EMIs for 1,500 to 5,000+ graft procedures across leading hair restoration clinics in India.',
    pricing: [
      { name: '1,500 – 2,500 Grafts (Standard FUE)', cost: '₹35,000 – ₹65,000', emi: 'From ₹2,500/mo' },
      { name: '3,000 – 4,500 Grafts (Advanced Sapphire FUE)', cost: '₹65,000 – ₹1,10,000', emi: 'From ₹3,900/mo' },
      { name: 'DHI / Direct Hair Implantation Technique', cost: '₹85,000 – ₹1,60,000', emi: 'From ₹4,800/mo' },
      { name: 'GFC / PRP Therapy (6 Sessions Package)', cost: '₹25,000 – ₹45,000', emi: 'From ₹1,800/mo' },
    ],
    faqs: [
      { q: 'Does health insurance cover hair transplant surgery in India?', a: 'No. Standard health insurance (Mediclaim) policies strictly exclude hair restoration because it is classified as elective aesthetic surgery. Only reconstruction following traumatic burn injuries may occasionally be considered, making point-of-care EMI the primary choice for patients.' },
      { q: 'Can I finance a hair transplant without a credit card in India?', a: 'Yes. Cardless aesthetic EMIs are available via Aadhaar and PAN OTP across leading RBI-regulated NBFC partners and bank cardless networks with zero physical paperwork.' },
      { q: 'What documents are needed to apply for a hair restoration loan?', a: 'You only need your PAN card, Aadhaar card, and an active bank account with mobile net banking or UPI autopay. Approvals are completed digitally in 2 minutes right at the clinic reception.' },
      { q: 'Can I pay off my loan early without penalties?', a: 'Yes. Under RBI lending guidelines, retail medical personal loans feature flexible foreclosure and partial prepayment terms through licensed NBFC partners.' }
    ]
  },
  '/ivf-treatment-on-emi': {
    title: 'IVF Treatment Cost on EMI in India (From ₹5,500/mo) | Fertility Financing',
    description: 'Finance IVF, ICSI & fertility treatments on flexible monthly EMI in India. Instant 2-min paperless digital approval from ~11.5% p.a. Across accredited fertility centres.',
    h1: 'IVF & Fertility Treatment Cost on Monthly EMI in India',
    badge: 'FERTILITY CARE FINANCING',
    intro: 'Fulfill your dream of parenthood without financial delay. Clinaza connects couples with RBI-regulated patient financing covering complete IVF cycles, ICSI, and fertility medications on flexible 3 to 24 month EMIs.',
    pricing: [
      { name: 'Single Self-Egg IVF Cycle', cost: '₹1,10,000 – ₹1,65,000', emi: 'From ₹5,500/mo' },
      { name: 'IVF with ICSI (Intracytoplasmic Sperm Injection)', cost: '₹1,40,000 – ₹2,10,000', emi: 'From ₹6,800/mo' },
      { name: 'Donor Egg / Donor Sperm IVF Package', cost: '₹1,80,000 – ₹2,75,000', emi: 'From ₹8,500/mo' },
      { name: 'Embryo Freezing & Storage (1-2 Years)', cost: '₹30,000 – ₹55,000', emi: 'From ₹2,100/mo' },
    ],
    faqs: [
      { q: 'Does health insurance cover IVF or ICSI cycles in India?', a: 'Standard retail health insurance policies in India exclude infertility investigations, IVF cycles, and ART procedures under standard IRDAI exclusion guidelines. Only select premium corporate group covers provide capped maternity riders, making Clinaza point-of-care patient EMI the primary financing vehicle.' },
      { q: 'Can couples get an IVF loan without a credit card in India?', a: 'Yes. Cardless fertility EMIs are available via Aadhaar and PAN OTP verification across leading RBI-regulated NBFC partners. No credit card or physical loan paperwork is required.' },
      { q: 'Can either spouse apply for the fertility treatment loan?', a: 'Yes. Either the husband or wife (or both as co-applicants) can apply for the medical loan to maximize sanction limits. Approvals require only Aadhaar, PAN card, and net banking/UPI verification.' },
      { q: 'Are medication costs included in the financing?', a: 'Yes. The sanctioned loan amount covers both hospital cycle charges (egg retrieval, embryology, embryo transfer) and hormonal stimulation injection pharmacy packages.' }
    ]
  },
  '/gynecomastia-surgery-on-emi': {
    title: 'Gynecomastia Surgery Cost on EMI in India (From ₹2,100/mo) | Male Chest Reduction',
    description: 'Finance gynecomastia surgery on easy monthly EMI in India. 2-min digital approval from ~11.5% p.a. Across 120+ accredited cosmetic surgery clinics.',
    h1: 'Gynecomastia Surgery Cost on EMI in India (Male Chest Reduction)',
    badge: 'COSMETIC SURGERY FINANCING',
    intro: 'Overcome male breast enlargement with permanent surgical correction. Clinaza makes gynecomastia surgery affordable through flexible monthly EMIs covering gland excision, VASER liposuction, and post-op compression garments.',
    pricing: [
      { name: 'Grade 1 Gynecomastia (Micro-Liposuction)', cost: '₹40,000 – ₹60,000', emi: 'From ₹2,100/mo' },
      { name: 'Grade 2 Gynecomastia (Liposuction + Gland Excision)', cost: '₹55,000 – ₹80,000', emi: 'From ₹2,900/mo' },
      { name: 'Grade 3 Gynecomastia (Excision + Skin Tightening)', cost: '₹75,000 – ₹1,10,000', emi: 'From ₹3,800/mo' },
      { name: 'Grade 4 Severe Ptosis / Revision Surgery', cost: '₹95,000 – ₹1,45,000', emi: 'From ₹4,900/mo' },
    ],
    faqs: [
      { q: 'Does health insurance cover gynecomastia surgery in India?', a: 'No. Standard health insurance (Mediclaim) policies in India strictly exclude gynecomastia correction, categorizing it as an elective cosmetic procedure. Only rare cases accompanied by severe endocrine pathology and biopsied neoplastic lesions are eligible for review, making point-of-care EMI the primary financing option for patients.' },
      { q: 'What documents are needed to apply for a cosmetic surgery loan?', a: 'You only need your PAN card, Aadhaar card, and an active bank account with mobile net banking or UPI autopay. Approvals are completed digitally in 2 minutes right at the clinic reception.' },
      { q: 'Can I pay off my loan early without penalties?', a: 'Yes. Under RBI lending guidelines, retail medical personal loans feature flexible foreclosure and partial prepayment terms through licensed NBFC partners.' }
    ]
  },
  '/hearing-aids-on-emi': {
    title: 'Digital Hearing Aids on EMI in India (From ₹1,800/mo) | Audiology Financing',
    description: 'Finance premium digital hearing aids on easy monthly EMI in India. Instant 2-min paperless approval across partner audiology clinics with zero credit card required.',
    h1: 'Digital Hearing Aids on Monthly EMI in India',
    badge: 'AUDIOLOGY CARE FINANCING',
    intro: 'Reclaim crisp auditory clarity and never miss another family conversation. Clinaza equips audiology and ENT clinics with instant patient EMI plans covering leading digital hearing aid brands.',
    pricing: [
      { name: 'Basic Digital BTE / RIC Hearing Aid (Pair)', cost: '₹28,000 – ₹55,000', emi: 'From ₹1,800/mo' },
      { name: 'Mid-Tier Rechargeable Bluetooth Hearing Aids', cost: '₹60,000 – ₹1,10,000', emi: 'From ₹3,200/mo' },
      { name: 'Premium AI Noise-Cancelling Hearing Aids', cost: '₹1,20,000 – ₹2,40,000', emi: 'From ₹5,500/mo' },
      { name: 'Invisible-in-Canal (IIC) Custom Hearing Aids', cost: '₹1,40,000 – ₹3,20,000', emi: 'From ₹6,800/mo' },
    ],
    faqs: [
      { q: 'Does health insurance cover digital hearing aids in India?', a: 'No. Standard health insurance (Mediclaim) policies in India strictly exclude external sensory aids and hearing prosthetics under standard IRDAI exclusion terms, making Clinaza point-of-care EMI the primary financing choice.' },
      { q: 'Can senior citizens get hearing aids on EMI without a credit card?', a: 'Yes. Cardless hearing healthcare EMIs are available for patients and family co-applicants using basic Aadhaar and PAN OTP verification with zero paperwork.' },
      { q: 'Can a son or daughter apply on behalf of their elderly parents?', a: 'Yes. Working family members can easily apply as the primary borrower or co-applicant to secure immediate device sanction for senior parents.' },
      { q: 'Are follow-up audiology programming sessions included?', a: 'Yes. Partner audiology clinics bundle the complete device package, including manufacturer warranty (2–4 years) and lifetime digital tuning visits.' }
    ]
  },
  '/piles-laser-surgery-on-emi': {
    title: 'Laser Piles Surgery Cost on EMI in India (From ₹2,200/mo) | Proctology Finance',
    description: 'Finance painless laser piles, fistula & fissure daycare surgery on easy monthly EMI in India. Instant 2-minute digital approval across accredited surgical centers.',
    h1: 'Laser Piles & Daycare Surgery Cost on Monthly EMI',
    badge: 'PROCTOLOGY SURGERY FINANCING',
    intro: 'Get pain-free daycare laser treatment for piles, fissures, and fistulas with zero financial stress. Split procedure costs into manageable monthly installments with immediate T+1 hospital clearance.',
    pricing: [
      { name: 'Laser Hemorrhoidoplasty (LHP - Grade 2/3 Piles)', cost: '₹38,000 – ₹65,000', emi: 'From ₹2,200/mo' },
      { name: 'Laser Fistula Treatment (FiLaC)', cost: '₹45,000 – ₹78,000', emi: 'From ₹2,600/mo' },
      { name: 'Laser Anal Fissure Daycare Surgery', cost: '₹32,000 – ₹55,000', emi: 'From ₹1,900/mo' },
      { name: 'Complex Recurrent Fistula Laser Package', cost: '₹60,000 – ₹1,05,000', emi: 'From ₹3,500/mo' },
    ],
    faqs: [
      { q: 'Does health insurance cover laser piles surgery in India?', a: 'Standard Mediclaim covers proctology hospitalization only when admission exceeds 24 hours or is specifically approved under daycare proctology riders. Clinaza point-of-care EMI covers non-network copays and out-of-pocket expenses.' },
      { q: 'What documents are needed to apply for a proctology loan?', a: 'Approvals are completed digitally in 2 minutes using your PAN card, Aadhaar card, and active bank account with mobile net banking or UPI.' },
      { q: 'How long is recovery after laser piles surgery?', a: 'Laser proctology is a 30-minute daycare procedure. Most patients return to normal desk work within 48 to 72 hours with minimal discomfort.' }
    ]
  },
  '/maternity-delivery-on-emi': {
    title: 'Maternity & Normal / C-Section Delivery on EMI in India | Hospital Financing',
    description: 'Finance hospital delivery packages on flexible monthly EMI in India. Instant 2-min approval covering normal delivery, C-section & newborn nursery care.',
    h1: 'Maternity Hospital Delivery Packages on Monthly EMI',
    badge: 'MATERNITY HEALTHCARE FINANCING',
    intro: 'Welcome your newborn with peace of mind. Clinaza provides expectant parents with flexible monthly EMI plans covering normal delivery, planned or emergency Caesarean (C-section), and neonatal care.',
    pricing: [
      { name: 'Normal Delivery Package (Private Room)', cost: '₹45,000 – ₹75,000', emi: 'From ₹2,500/mo' },
      { name: 'Planned / Emergency C-Section Delivery', cost: '₹75,000 – ₹1,35,000', emi: 'From ₹4,200/mo' },
      { name: 'Luxury Suite Maternity Package', cost: '₹1,20,000 – ₹2,20,000', emi: 'From ₹6,500/mo' },
      { name: 'High-Risk Pregnancy / Neonatal Care Package', cost: '₹1,50,000 – ₹2,80,000', emi: 'From ₹7,800/mo' },
    ],
    faqs: [
      { q: 'Can I pay hospital maternity bills on monthly EMI?', a: 'Yes. Clinaza enables expectant parents to finance hospital delivery packages from ₹40,000 to ₹3,00,000 with flexible 3 to 24 month repayment terms.' },
      { q: 'Does health insurance cover maternity hospital bills?', a: 'Most individual Mediclaim policies enforce a 2 to 4 year waiting period for maternity or cap normal/C-section benefits at ₹35,000–₹50,000. Clinaza EMI covers the remaining out-of-pocket hospital invoice.' },
      { q: 'How fast is the loan approved at hospital admission?', a: 'Approvals take under 2 minutes through digital Aadhaar and PAN verification at the hospital billing desk.' }
    ]
  },
  '/aesthetic-treatments-on-emi': {
    title: 'Aesthetic & Derma Treatments on EMI in India (From ₹1,500/mo) | Clinaza',
    description: 'Finance cosmetic dermatology, anti-aging, laser skin resurfacing & aesthetic packages on easy monthly EMI across verified aesthetic clinics in India.',
    h1: 'Aesthetic & Cosmetic Dermatology Treatments on EMI',
    badge: 'COSMETIC DERMATOLOGY FINANCING',
    intro: 'Elevate your aesthetic transformation without compromising on premium clinical care. Clinaza offers flexible monthly EMIs for clinical dermatology, laser resurfacing, botox, dermal fillers, and body contouring.',
    pricing: [
      { name: 'Laser Skin Resurfacing (Full Face)', cost: '₹22,000 – ₹45,000', emi: 'From ₹1,500/mo' },
      { name: 'Anti-Aging Botox & Dermal Fillers Package', cost: '₹35,000 – ₹75,000', emi: 'From ₹2,400/mo' },
      { name: 'Full Body Laser Hair Reduction (6-8 Sessions)', cost: '₹40,000 – ₹85,000', emi: 'From ₹2,800/mo' },
      { name: 'Comprehensive Facial Rejuvenation Package', cost: '₹60,000 – ₹1,30,000', emi: 'From ₹3,900/mo' },
    ],
    faqs: [
      { q: 'Can I get aesthetic skin treatments on monthly EMI?', a: 'Yes. Clinaza allows patients to finance clinical dermatology and cosmetic treatments from ₹20,000 to ₹2,50,000 with flexible 3 to 18 month EMIs.' },
      { q: 'Does health insurance cover cosmetic dermatology?', a: 'No. Clinical skin rejuvenation and aesthetic dermatology are classified as elective lifestyle procedures and are excluded from all standard retail health insurance.' },
      { q: 'Can I apply without a credit card?', a: 'Yes. Cardless aesthetic EMIs are available via instant PAN and Aadhaar OTP verification.' }
    ]
  },
  '/kidney-stone-laser-surgery-on-emi': {
    title: 'Kidney Stone Laser Surgery (RIRS / PCNL) on EMI in India | Clinaza',
    description: 'Finance advanced laser kidney stone removal (RIRS, PCNL, URS) on flexible monthly EMI in India. Instant 2-minute digital approval across urology hospitals.',
    h1: 'Kidney Stone Laser Surgery (RIRS & PCNL) on EMI',
    badge: 'UROLOGY SURGERY FINANCING',
    intro: 'Access painless Holmium and Thulium laser stone fragmentation without high upfront hospital deposits. Clinaza provides instant patient financing with direct current account hospital settlements.',
    pricing: [
      { name: 'Ureteroscopy (URS) Laser Stone Removal', cost: '₹42,000 – ₹70,000', emi: 'From ₹2,500/mo' },
      { name: 'Retrograde Intrarenal Surgery (RIRS)', cost: '₹65,000 – ₹1,10,000', emi: 'From ₹3,800/mo' },
      { name: 'Percutaneous Nephrolithotomy (PCNL / Mini-PCNL)', cost: '₹75,000 – ₹1,30,000', emi: 'From ₹4,400/mo' },
      { name: 'Bilateral Kidney Stone Laser Package', cost: '₹1,10,000 – ₹1,90,000', emi: 'From ₹6,500/mo' },
    ],
    faqs: [
      { q: 'Can I pay for kidney stone laser surgery in monthly EMIs?', a: 'Yes. Patients can finance RIRS, PCNL, and laser stone removal procedures on flexible 3 to 24 month EMIs.' },
      { q: 'Does health insurance cover RIRS and PCNL laser surgeries?', a: 'Standard Mediclaim covers kidney stone surgeries if medically necessary. However, non-network hospitals, co-pays, and consumable deductibles often require out-of-pocket cash, which Clinaza EMI covers instantly.' }
    ]
  },
  '/acl-knee-surgery-on-emi': {
    title: 'ACL Knee Arthroscopy Surgery Cost on EMI in India | Sports Injury Finance',
    description: 'Finance ACL reconstruction, meniscus repair & knee arthroscopy on flexible monthly EMI in India. 2-min approval across orthopaedic specialty hospitals.',
    h1: 'ACL Knee Reconstruction & Arthroscopy on Monthly EMI',
    badge: 'ORTHOPAEDIC SURGERY FINANCING',
    intro: 'Return to peak athletic mobility and active lifestyle. Clinaza finances minimally invasive knee arthroscopy, ACL graft reconstructions, and meniscus repairs with instant counter approvals.',
    pricing: [
      { name: 'Single Bundle ACL Reconstruction (Hamstring Graft)', cost: '₹75,000 – ₹1,25,000', emi: 'From ₹4,200/mo' },
      { name: 'ACL Reconstruction + Meniscus Repair Package', cost: '₹1,10,000 – ₹1,75,000', emi: 'From ₹6,200/mo' },
      { name: 'Revision ACL Reconstruction with Bio-absorbable Screws', cost: '₹1,35,000 – ₹2,20,000', emi: 'From ₹7,800/mo' },
      { name: 'Knee Diagnostic Arthroscopy & Chondroplasty', cost: '₹55,000 – ₹90,000', emi: 'From ₹3,400/mo' },
    ],
    faqs: [
      { q: 'Can I finance knee arthroscopy on monthly EMI?', a: 'Yes. Clinaza covers ACL surgery, meniscus repairs, and orthopaedic implants with flexible 3 to 24 month monthly installment plans.' },
      { q: 'Does health insurance cover ACL reconstruction surgery in India?', a: 'Mediclaim covers surgical admissions for ACL reconstruction, but high-end bio-absorbable screws, post-op rehabilitation braces, and non-network hospital co-pays require out-of-pocket payments covered by Clinaza.' }
    ]
  }
};

export const DIRECT_PAGE_METADATA = {
  '/about': {
    title: 'About Clinaza & Clinic Pricing | ₹999 One-Time Activation',
    description: 'Clinaza is onboarding clinics for healthcare financing. ₹999 one-time activation, ₹0 AMC and ₹0 monthly fees. Patient financing starts after partner activation.',
    h1: 'About Clinaza & Clinic Pricing',
    intro: 'Clinaza is a healthcare payment and financing technology platform operated by Mellowprints, a sole proprietorship in India. Digital financing desk activation is ₹999 one-time with ₹0 AMC and ₹0 monthly fees.',
    faqs: [
      { q: 'What is Clinaza and who operates it?', a: 'Clinaza is a healthcare payment and financing technology platform operated by Mellowprints, an Indian sole proprietorship. Clinaza facilitates point-of-care patient financing and clinic operating tools in partnership with Pine Labs Plural.' },
      { q: 'What is the clinic activation cost?', a: 'Clinaza charges a nominal ₹999 one-time digital desk activation and merchant underwriting fee. There are ₹0 Annual Maintenance Charges (AMC) and ₹0 monthly subscription fees.' },
      { q: 'Who provides the patient financing and loans?', a: 'Patient financing is provided directly by RBI-regulated banks and NBFCs through Pine Labs Plural gateway rails. The lending institutions underwrite the borrower, determine interest rates, and disburse funds.' },
      { q: 'Does the clinic have recourse or risk on patient defaults?', a: 'No. Partner clinics receive guaranteed T+1 business day settlements with 0% recourse on patient loan defaults or collection risks.' }
    ]
  },
  '/clinic-agreement': {
    title: 'Clinic Sub-Merchant Master Services Agreement | Clinaza',
    description: 'Official Clinaza Clinic Sub-Merchant Master Services Agreement for digital patient financing, Pine Labs payment gateway integration, and T+1 settlements.',
    h1: 'Clinic Sub-Merchant Master Services Agreement'
  },
  '/terms': {
    title: 'Terms of Service | Clinaza Healthcare Technologies',
    description: 'Terms of service governing the use of Clinaza clinic operating system, patient EMI checkout desk, and cloud software.',
    h1: 'Terms of Service'
  },
  '/privacy': {
    title: 'Privacy Policy | Clinaza Healthcare Technologies',
    description: 'Clinaza privacy policy detailing patient and clinic data protection, AES-256 encryption, and regulatory compliance standards.',
    h1: 'Privacy Policy'
  },
  '/refund-policy': {
    title: 'Cancellation & Refund Policy | Clinaza',
    description: 'Clinaza merchant and patient refund policy for point-of-care transactions, subscription services, and digital counter payments.',
    h1: 'Cancellation & Refund Policy'
  },
  '/shipping-policy': {
    title: 'Shipping & Delivery Policy | Clinaza',
    description: 'Clinaza 100% digital service delivery and paperless onboarding policy for dental and healthcare partner clinics.',
    h1: 'Shipping & Delivery Policy'
  },
  '/contact': {
    title: 'Contact Us & Clinic Support Desk | Clinaza',
    description: 'Get in touch with Clinaza healthcare financing and clinic partnership desks via WhatsApp, phone (+91 7292984244), or email.',
    h1: 'Contact Us & Clinic Support Desk'
  },
  '/404': {
    title: 'Page Not Found | Clinaza',
    description: 'The requested page could not be found on Clinaza.',
    h1: '404 - Page Not Found',
    robots: 'noindex'
  }
};

export async function loadDynamicMetadata() {
  const metaMap = new Map();

  // 1. Treatment pages
  for (const [route, meta] of Object.entries(TREATMENT_METADATA)) {
    metaMap.set(route, meta);
  }

  // 2. Direct access pages
  for (const [route, meta] of Object.entries(DIRECT_PAGE_METADATA)) {
    metaMap.set(route, meta);
  }

  // 3. Homepage
  metaMap.set('/', {
    title: 'Clinaza — Point-of-Care Patient Financing & Healthcare EMIs India',
    description: 'Enable instant 2-minute paperless patient treatment financing & EMIs (₹30K–₹5L) across 16+ major banks for dental, IVF & surgery clinics. Direct T+1 settlement with zero default risk.',
    h1: 'Point-of-Care Healthcare Financing & Digital Clinic Operating System'
  });

  // 4. Blog Articles
  try {
    const blogFiles = ['blogs-part1.tsx', 'blogs-part2.tsx', 'blogs-part3.tsx', 'blogs-part4.tsx', 'blogs.tsx'];
    let combinedBlogs = '';
    for (const f of blogFiles) {
      try {
        combinedBlogs += await readFile(join(root, 'src', 'data', f), 'utf8') + '\n';
      } catch {}
    }
    const blogMatches = [...combinedBlogs.matchAll(/slug:\s*['"]([^'"]+)['"],\s*title:\s*['"]([^'"]+)['"].*?summary:\s*['"]([^'"]+)['"]/gs)];
    for (const match of blogMatches) {
      const slug = match[1];
      const title = match[2];
      const summary = match[3];
      metaMap.set(`/blog/${slug}`, {
        title: `${title} | Clinaza`,
        description: summary,
        h1: title,
        isBlog: true
      });
    }
  } catch (err) {
    console.warn('[prerender] Could not extract blog metadata:', err.message);
  }

  // 5. City Pages
  try {
    const citiesFile = await readFile(join(root, 'src', 'data', 'cities.ts'), 'utf8');
    const cityMatches = [...citiesFile.matchAll(/\{\s*slug:\s*['"]([^'"]+)['"],\s*name:\s*['"]([^'"]+)['"],\s*state:\s*['"]([^'"]+)['"]/g)];
    for (const match of cityMatches) {
      const slug = match[1];
      const name = match[2];
      const state = match[3];
      const title = slug === 'kochi'
        ? 'Braces & Dental Treatment Cost in Kochi (From ₹1,200/mo) | Clinaza'
        : `Best Dental Treatment EMI Plans in ${name} | Clinaza`;
      const description = `Flexible zero-recourse patient EMI financing for dental implants, braces, aligners & surgeries across verified dental clinics in ${name}, ${state}.`;
      metaMap.set(`/cities/${slug}`, {
        title,
        description,
        h1: `Dental Treatment & Implants on EMI in ${name}`,
        cityName: name,
        stateName: state,
        isCity: true
      });
    }
  } catch (err) {
    console.warn('[prerender] Could not extract city metadata:', err.message);
  }

  return metaMap;
}
