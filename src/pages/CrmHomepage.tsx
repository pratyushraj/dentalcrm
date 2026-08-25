import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  MessageSquare, 
  Building2, 
  Check,
  X,
  Send,
  HelpCircle,
  ChevronDown,
  UserCheck,
  Landmark,
  Lock,
  Package,
  Truck,
  Award
} from 'lucide-react';
import { toast } from 'sonner';
import { SEOHead } from '@/components/seo/SEOHead';

export default function CrmHomepage() {
  const [formData, setFormData] = useState({
    doctorName: '',
    clinicName: '',
    phone: '',
    city: '',
    category: 'Dental Implants & Aligners'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [formType, setFormType] = useState<'clinic' | 'lender'>('clinic');
  const [showEligibilityModal, setShowEligibilityModal] = useState(false);
  const [eligibilityStep, setEligibilityStep] = useState<1 | 2>(1);
  const [patientData, setPatientData] = useState({
    name: '',
    mobile: '',
    city: '',
    treatment: 'Dental Implants',
    amount: '₹50,000 - ₹1,00,000',
    preferredClinic: '',
    cibilScore: '700+ (Good / Excellent)',
    employmentType: 'Salaried Professional',
    incomeProof: 'Salary Slips / Bank Statement Available'
  });
  const [patientSubmitted, setPatientSubmitted] = useState(false);

  // EMI Calculator state
  const [emiAmount, setEmiAmount] = useState(100000);
  const [emiTenure, setEmiTenure] = useState(12);
  const [emiRate, setEmiRate] = useState(15); // Estimated lender rate

  const calcEMI = (principal: number, months: number, annualRate: number) => {
    const r = annualRate / 12 / 100;
    return Math.round((principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1));
  };

  const monthlyEMI = calcEMI(emiAmount, emiTenure, emiRate);
  const totalPayable = monthlyEMI * emiTenure;
  const totalInterest = totalPayable - emiAmount;
  // Analytics event tracking placeholder function
  const trackEvent = (eventName: string, payload?: Record<string, any>) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, payload);
    }
    console.log(`[Analytics Event]: ${eventName}`, payload || {});
  };
  const handlePatientEligibilitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientData.name || !patientData.mobile || !patientData.city) {
      toast.error('Please fill in required fields');
      return;
    }

    trackEvent('eligibility_completed', {
      cibil: patientData.cibilScore,
      employment: patientData.employmentType,
      treatment: patientData.treatment,
      status: 'redirecting_to_api_checkout'
    });

    toast.success('Connecting to Clinaza Multi-Lender API Engine...');
    setShowEligibilityModal(false);
    
    // Direct redirect to live API checkout portal
    window.location.href = `/emi/onboard?name=${encodeURIComponent(patientData.name)}&amount=75000`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.doctorName || !formData.clinicName || !formData.phone || !formData.city) {
      toast.error('Please fill in all required fields');
      return;
    }
    setIsSubmitting(true);
    trackEvent('clinic_form_submitted', {
      formType,
      city: formData.city,
      category: formData.category
    });
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast.success(
        formType === 'clinic'
          ? 'Partner request submitted! Our clinic onboarding team will contact you shortly.'
          : 'Lender partnership inquiry received! Our capital markets team will reach out.'
      );
    }, 1000);
  };

  const steps = [
    { num: '01', title: 'Patient Chooses Treatment', desc: 'Implants, braces, aligners, crowns, surgeries, and elective healthcare procedures.' },
    { num: '02', title: 'Patient Applies for Financing', desc: 'Clinaza connects the patient with appropriate lending partners directly at checkout.' },
    { num: '03', title: 'Lender Evaluates', desc: 'Independent Bank/NBFC handles eligibility, approval, and loan terms.' },
    { num: '04', title: 'Treatment Proceeds', desc: 'Patient receives treatment while repaying the lender through monthly EMIs.' }
  ];

  const clinicBenefits = [
    'Give patients a way to manage large treatment costs',
    'Reduce treatment postponement & patient drop-off',
    'No need for the clinic to collect monthly EMIs',
    'Financing handled entirely by lending partners',
    '100% digital, paperless application process',
    'Dedicated support from the Clinaza team'
  ];

  const categories = [
    { emoji: '🦷', name: 'Dental Implants', tag: 'Restorative & Full Mouth' },
    { emoji: '😁', name: 'Aligners & Braces', tag: 'Orthodontics' },
    { emoji: '👑', name: 'Crowns & Makeovers', tag: 'Cosmetic Dentistry' },
    { emoji: '🦴', name: 'Orthopaedics', tag: 'Joints & Surgeries' },
    { emoji: '👶', name: 'IVF & Fertility', tag: 'Reproductive Care' },
    { emoji: '👁️', name: 'Ophthalmology', tag: 'LASIK & Cataract' },
    { emoji: '🏥', name: 'Elective Surgeries', tag: 'Specialty Procedures' }
  ];

  const whatClinicDoesntDo = [
    'No monthly EMI collection from patients',
    'No chasing patients for missed repayments',
    'No loan servicing or credit risk taken by clinic',
    'No complicated paper financing documentation'
  ];

  const patientSteps = [
    { num: '1', emoji: '🦷', title: 'Choose your treatment', desc: 'Discuss your treatment plan and total cost with your clinic.' },
    { num: '2', emoji: '📋', title: 'Apply for financing', desc: 'Complete the simple digital application with required KYC documents.' },
    { num: '3', emoji: '✅', title: 'Get an eligibility decision', desc: 'The lending partner reviews your application instantly.' },
    { num: '4', emoji: '💳', title: 'Pay through EMIs', desc: 'If approved, repay the lender according to the agreed repayment schedule.' }
  ];

  const comprehensiveFaqs = [
    {
      q: 'What is Clinaza?',
      a: 'Clinaza is an embedded healthcare patient financing platform that connects clinics with RBI-regulated Banks and NBFCs, allowing patients to pay for high-ticket treatments in flexible monthly EMIs.'
    },
    {
      q: 'Which treatments are eligible for EMI?',
      a: 'High-value planned procedures ranging from ₹30,000 to ₹3,00,000 including Dental Implants, Clear Aligners, Braces, Crowns, Orthopaedic surgeries, IVF/Fertility, and LASIK/Ophthalmology.'
    },
    {
      q: 'What is the financing amount limit?',
      a: 'Financing options typically range from ₹30,000 up to ₹3,00,000, tailored to patient eligibility and treatment estimate.'
    },
    {
      q: 'What documents does the patient need?',
      a: 'Basic digital KYC: PAN card, Aadhaar card (eKYC), proof of income (salary slip, bank statement, or ITR), and bank account details for e-NACH auto-debit setup.'
    },
    {
      q: 'Does the clinic pay any upfront fee?',
      a: 'No upfront fees for clinics. Partner clinics receive physical branding kits, QR standees, and onboarding support free of charge.'
    },
    {
      q: 'Who manages the loan and repayments?',
      a: 'Zero clinic involvement. The loan is funded, serviced, and collected directly by the RBI-regulated lending partner via automated monthly e-NACH auto-debit.'
    },
    {
      q: 'What determines the interest rate & terms?',
      a: 'Interest rates (typically ~15% p.a. standard or subvention options) and tenures (3–24 months) are set directly by the lending partner based on credit assessment.'
    },
    {
      q: 'Is loan approval guaranteed?',
      a: 'No. Clinaza facilitates the application process. Final loan approval, interest rate, and sanctioned amount are determined independently by the financing partner based on patient credit eligibility.'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-[#0B2450] font-sora antialiased overflow-x-hidden selection:bg-[#0867E8] selection:text-white">
      <SEOHead
        title="CLINAZA — Embedded Healthcare Patient Financing Infrastructure"
        description="Don't let treatment cost stop your patients. Offer financing options for eligible patients from ₹30K–₹3L through Clinaza's lending partners."
        keywords={['clinaza', 'patient financing', 'dental emi', 'healthcare lending', 'medical loan india', 'point of care financing', 'clinic emi option', 'embedded finance', 'dental implants financing']}
        image="https://dental-crm-red.vercel.app/assets/clinaza-logo.jpg"
        canonicalUrl="https://dental-crm-red.vercel.app/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "FinancialService",
          "name": "Clinaza",
          "description": "Embedded patient financing infrastructure enabling clinics to offer point-of-care EMI loans.",
          "url": "https://dental-crm-red.vercel.app/",
          "logo": "https://dental-crm-red.vercel.app/assets/clinaza-logo.jpg"
        }}
      />

      {/* ── Header ── */}
      <header className="border-b border-slate-100 backdrop-blur-xl sticky top-0 z-50 bg-white/95 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <img src="/assets/clinaza-logo.jpg" alt="CLINAZA" className="h-10 w-auto rounded-xl border border-slate-200 shadow-sm group-hover:scale-105 transition-transform" />
            <div className="hidden sm:block">
              <span className="text-xs font-black tracking-widest text-[#0B2450] block">CLINAZA</span>
              <span className="text-[9px] font-bold tracking-wider text-[#0f7a75] block uppercase">EMI FOR BETTER HEALTH</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/emi/onboard?name=Patient&amount=50000"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold text-emerald-700 rounded-xl transition-all"
            >
              <ShieldCheck size={14} className="text-emerald-600" />
              Patient Loan API
            </Link>
            <a
              href="https://wa.me/917292984244?text=Hi%20Clinaza%20team%2C%20I%20want%20to%20offer%20patient%20financing%20at%20my%20clinic"
              target="_blank" rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#F7FAFC] hover:bg-slate-100 border border-slate-200 text-xs font-bold text-[#0B2450] rounded-xl transition-all"
            >
              <MessageSquare size={14} className="text-[#0f7a75]" />
              WhatsApp Us
            </a>
            <a
              href="#partner-form"
              onClick={() => setFormType('clinic')}
              className="px-6 py-3 bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-[#0867E8]/30 flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              Partner With Clinaza <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* ── 1. HERO (WHITE) ── */}
        <section aria-label="Hero" className="relative pt-8 sm:pt-14 pb-12 sm:pb-16 px-4 sm:px-6 max-w-5xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center text-left">
            <div className="md:col-span-7 space-y-4 sm:space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F5F9FC] border border-blue-100 rounded-full text-[11px] font-bold text-[#0756C7] shadow-2xs">
                <Building2 className="h-3.5 w-3.5 text-[#0f7a75]" />
                <span>FOR DENTAL CLINICS & HOSPITALS</span>
              </div>

              <h1 className="text-2.5xl sm:text-5xl font-black tracking-tight leading-[1.18] text-[#0B2450]">
                Don't Let Treatment Cost <br />
                <span className="bg-gradient-to-r from-[#0867E8] via-[#0088FF] to-[#12A8A0] bg-clip-text text-transparent">
                  Stop Your Patients
                </span>
              </h1>

              <p className="text-xs sm:text-base text-slate-600 font-medium leading-relaxed max-w-xl">
                Help eligible patients access financing for dental treatments from <strong className="text-[#0B2450]">₹30,000 to ₹3 lakh</strong> and pay through EMIs.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    trackEvent('click_hero_check_eligibility');
                    trackEvent('eligibility_started', { source: 'hero_cta' });
                    setShowEligibilityModal(true);
                    setEligibilityStep(1);
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#0867E8]/25 transform active:scale-95"
                >
                  <ShieldCheck size={16} /> Check Patient Eligibility
                </button>
                <a
                  href="#partner-form"
                  onClick={() => {
                    trackEvent('click_hero_partner_with_clinaza');
                    setFormType('clinic');
                  }}
                  className="w-full sm:w-auto px-5 py-3.5 bg-[#F7FAFC] hover:bg-slate-100 text-[#0B2450] border border-slate-200 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  Partner With Clinaza <ArrowRight size={14} />
                </a>
              </div>

              <p className="text-[10px] text-slate-400 font-medium pt-1">
                ⚡ Quick assessment &middot; No obligation &middot; Final approval by lender &middot; <span className="text-[#0f7a75] font-bold">Clinaza connects clinics with financing partners.</span>
              </p>
            </div>

            {/* Authentic Clinic Photo */}
            <div className="md:col-span-5 relative mt-2 md:mt-0">
              <img
                src="/assets/clinic-hero-real.png"
                alt="Modern authentic dental clinic treatment room in India"
                className="w-full h-auto rounded-2xl sm:rounded-3xl border border-slate-200 shadow-lg object-cover aspect-[4/3]"
              />
              <div className="absolute -bottom-2.5 -left-2.5 sm:-bottom-3 sm:-left-3 bg-white/95 backdrop-blur-md border border-slate-200 px-3.5 py-2 rounded-xl sm:rounded-2xl shadow-md flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0f7a75] animate-pulse"></span>
                <span className="text-[11px] font-bold text-[#0B2450]">Point-of-Care EMI Ready</span>
              </div>
            </div>
          </div>

          {/* ── 1. TRUST STRIP (RIGHT BELOW HERO) ── */}
          <div className="pt-6 border-t border-slate-100 max-w-4xl mx-auto">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#0f7a75] mb-3 text-center sm:text-left">WHY CLINICS CHOOSE CLINAZA</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-left">
              {[
                '₹30K–₹3L financing options',
                'Bank/NBFC lending partners',
                '100% Digital application',
                'Clinic-focused support'
              ].map((item, idx) => (
                <div key={idx} className="bg-[#F7FAFC] border border-slate-200/80 px-3 py-2.5 rounded-xl flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#0f7a75] shrink-0" aria-hidden="true" />
                  <span className="text-[11px] font-bold text-[#0B2450] leading-tight">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 2. PROBLEM & CLINIC VALUE ("TURN I'LL DO IT LATER INTO LET'S START") ── */}
        <section aria-label="The Problem & Value" className="py-12 sm:py-16 px-4 sm:px-6 bg-[#F5F9FC] border-y border-blue-50">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-black text-[#0f7a75] uppercase tracking-widest">CLINIC CONVERSION IMPACT</span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#0B2450]">Turn "I'll do it later" into "Let's start."</h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">Help more patients say YES to necessary high-ticket treatment plans.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Without Financing */}
              <div className="bg-white border border-rose-100 p-6 rounded-2xl space-y-4 text-left shadow-2xs">
                <div className="flex items-center gap-2 text-rose-600 font-black text-xs uppercase tracking-wider">
                  <X size={16} /> Without Financing
                </div>
                <ul className="space-y-3 text-xs text-slate-700 font-medium">
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-500 font-bold">•</span> High upfront treatment estimates paralyze decision-making
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-500 font-bold">•</span> Patients postpone treatment plans for months or walk away
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-500 font-bold">•</span> Treatment delays lead to worsening health & lost clinic revenue
                  </li>
                </ul>
              </div>

              {/* With Clinaza */}
              <div className="bg-white border border-[#0f7a75]/30 p-6 rounded-2xl space-y-4 text-left shadow-sm">
                <div className="flex items-center gap-2 text-[#0f7a75] font-black text-xs uppercase tracking-wider">
                  <Check size={16} /> With Clinaza
                </div>
                <ul className="space-y-3 text-xs text-slate-700 font-medium">
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#0f7a75] font-bold">✓</span> Flexible financing option for eligible patients right at checkout
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#0f7a75] font-bold">✓</span> High-value procedures (Implants, Aligners) become affordable
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#0f7a75] font-bold">✓</span> Zero clinic burden — NBFC handles collections directly
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. HOW CLINAZA WORKS (SIMPLE 3-STEP) ── */}
        <section aria-label="How Clinaza Works" className="py-12 sm:py-16 px-4 sm:px-6 max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-black text-[#0756C7] uppercase tracking-widest">SIMPLE WORKFLOW</span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#0B2450]">How Clinaza Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { num: '01', title: 'Patient Chooses Treatment', desc: 'Patient discusses treatment and total estimate with your clinic.' },
              { num: '02', title: 'Check Financing Eligibility', desc: 'Clinaza helps the patient apply with a suitable financing partner in minutes.' },
              { num: '03', title: 'Treatment Goes Ahead', desc: 'Once approved and disbursed, patient receives care and pays lender in EMIs.' }
            ].map((step, idx) => (
              <div key={idx} className="bg-[#F7FAFC] border border-slate-200/80 p-6 rounded-2xl space-y-3 text-left shadow-2xs">
                <span className="text-3xl font-mono font-black text-[#0f7a75] block">{step.num}</span>
                <h3 className="text-sm font-black text-[#0B2450]">{step.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. TREATMENT CATEGORIES (CONCISE) ── */}
        <section aria-label="Supported Treatments" className="py-12 sm:py-16 px-4 sm:px-6 bg-[#F7FAFC] border-y border-slate-200/60">
          <div className="max-w-5xl mx-auto space-y-8 text-center">
            <div className="space-y-2">
              <span className="text-[10px] font-black text-[#0f7a75] uppercase tracking-widest">ELIGIBLE PROCEDURES</span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#0B2450]">Supported Treatments</h2>
              <p className="text-xs sm:text-sm text-slate-600">Treatment financing available for procedure estimates from ₹30,000 to ₹3,00,000.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {[
                { emoji: '🦷', name: 'Dental Implants' },
                { emoji: '😁', name: 'Braces & Aligners' },
                { emoji: '👑', name: 'Crowns & Bridges' },
                { emoji: '✨', name: 'Smile Makeovers' },
                { emoji: '🏥', name: 'Full Mouth Rehab' },
                { emoji: '🦴', name: 'Other Eligible Treatments' }
              ].map((cat, idx) => (
                <div key={idx} className="bg-white border border-slate-200 p-4 rounded-2xl space-y-2 text-center shadow-2xs">
                  <span className="text-2xl block" role="img" aria-label={cat.name}>{cat.emoji}</span>
                  <h3 className="text-xs font-black text-[#0B2450] leading-tight">{cat.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. EARLY ELIGIBILITY CHECKER PROMPT ── */}
        <section aria-label="Eligibility Prompt" className="py-12 px-4 sm:px-6 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#0B2450] to-[#0867E8] text-white p-7 sm:p-9 rounded-3xl text-center space-y-4 shadow-xl">
            <span className="text-[10px] font-black text-[#12A8A0] uppercase tracking-widest block">INSTANT PRE-CHECK</span>
            <h3 className="text-xl sm:text-3xl font-black">See if your patient may be eligible for financing</h3>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto leading-relaxed">
              Initial assessment only. Final approval, loan amount and interest rate are decided by the financing partner.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  trackEvent('click_mid_check_eligibility');
                  trackEvent('eligibility_started', { source: 'mid_banner' });
                  setShowEligibilityModal(true);
                  setEligibilityStep(1);
                }}
                className="px-8 py-3.5 bg-white text-[#0B2450] hover:bg-slate-100 text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 inline-flex items-center gap-2"
              >
                <ShieldCheck size={16} className="text-[#0867E8]" /> Check Patient Eligibility
              </button>
            </div>
            <p className="text-[10px] text-blue-200/80 max-w-md mx-auto leading-tight">
              *Initial assessment only. Final loan approval, loan amount, and interest rate are determined independently by the financing partner.
            </p>
          </div>
        </section>

        {/* ── 6. EMI CALCULATOR ── */}
        <section aria-label="EMI Calculator" className="py-12 sm:py-16 px-4 sm:px-6 bg-[#F7FAFC] border-y border-slate-200/60">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-black text-[#0f7a75] uppercase tracking-widest">COST PLANNER</span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#0B2450]">See What the EMI Could Look Like</h2>
              <p className="text-xs sm:text-sm text-slate-600">Indicative estimate only. Actual rate depends on lender assessment.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {/* Left: Controls */}
                <div className="p-6 sm:p-8 space-y-6 border-b md:border-b-0 md:border-r border-slate-100">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-black text-[#0B2450] uppercase tracking-wider">Treatment Amount</label>
                      <span className="text-sm font-black text-[#0867E8]">₹{emiAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <input
                      type="range"
                      min={30000}
                      max={300000}
                      step={5000}
                      value={emiAmount}
                      onChange={e => {
                        setEmiAmount(Number(e.target.value));
                        trackEvent('calculator_used', { amount: Number(e.target.value), tenure: emiTenure });
                      }}
                      className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[#0867E8]"
                      aria-label="Treatment amount slider"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                      <span>₹30,000</span>
                      <span>₹3,00,000</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-black text-[#0B2450] uppercase tracking-wider block">Repayment Tenure</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[3, 6, 12, 24].map(t => (
                        <button
                          key={t}
                          onClick={() => setEmiTenure(t)}
                          className={`py-2.5 rounded-xl text-xs font-black border transition-all ${
                            emiTenure === t
                              ? 'bg-[#0867E8] text-white border-[#0867E8] shadow-md'
                              : 'bg-[#F7FAFC] text-[#0B2450] border-slate-200 hover:border-[#0867E8]'
                          }`}
                        >
                          {t}M
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Result */}
                <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-[#0867E8] to-[#0f7a75] rounded-2xl p-5 text-white text-center space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">Indicative Monthly EMI</p>
                      <p className="text-3xl sm:text-4xl font-black">₹{monthlyEMI.toLocaleString('en-IN')}</p>
                      <p className="text-[10px] text-white/80 font-medium">per month &times; {emiTenure} months</p>
                    </div>

                    <div className="space-y-2">
                      {[
                        { label: 'Principal Amount', value: `₹${emiAmount.toLocaleString('en-IN')}`, accent: false },
                        { label: 'Est. Interest (15% p.a.)', value: `₹${totalInterest.toLocaleString('en-IN')}`, accent: false },
                        { label: 'Est. Total Payable', value: `₹${totalPayable.toLocaleString('en-IN')}`, accent: true },
                      ].map((row, idx) => (
                        <div key={idx} className={`flex justify-between items-center px-3.5 py-2.5 rounded-xl text-xs font-bold ${row.accent ? 'bg-[#0867E8]/8 border border-[#0867E8]/20 text-[#0B2450]' : 'bg-[#F7FAFC] border border-slate-100 text-slate-600'}`}>
                          <span>{row.label}</span>
                          <span className={row.accent ? 'text-[#0867E8]' : ''}>{row.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        trackEvent('click_calc_check_eligibility');
                        setShowEligibilityModal(true);
                        setEligibilityStep(1);
                      }}
                      className="w-full py-3 bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <ShieldCheck size={15} /> Check Patient Eligibility →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 7. WHY CLINICS USE CLINAZA ── */}
        <section aria-label="Why Clinics Use Clinaza" className="py-12 sm:py-16 px-4 sm:px-6 max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-black text-[#0f7a75] uppercase tracking-widest">FOR CLINIC OWNERS</span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#0B2450]">Why Clinics Use Clinaza</h2>
          </div>

          {/* Prominent ₹0 Clinic Fees Highlight Badge */}
          <div className="bg-gradient-to-r from-[#0f7a75]/10 to-[#0867E8]/10 border border-[#0f7a75]/30 p-5 rounded-2xl text-center max-w-2xl mx-auto shadow-2xs">
            <span className="text-2xl font-black text-[#0f7a75] block">₹0 Clinic Fees</span>
            <p className="text-xs font-bold text-[#0B2450] mt-0.5">No upfront fee or EMI collection responsibility for the clinic.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-left">
            {[
              { title: '₹0 Upfront Fee', desc: 'Free setup and branding materials for onboarded clinics.' },
              { title: 'No EMI Collection Burden', desc: 'No chasing patients for repayments — handled entirely by NBFC.' },
              { title: 'Financing by Partners', desc: 'All loans funded and serviced by RBI-regulated lenders.' },
              { title: 'Higher Ticket Conversions', desc: 'Helps eligible patients manage higher treatment costs easily.' },
              { title: 'Digital Application', desc: 'Paperless 100% online point-of-care pre-assessment.' },
              { title: 'Multiple Financing Options', desc: 'Connected network of lenders for better eligibility matching.' }
            ].map((item, idx) => (
              <div key={idx} className="bg-[#F7FAFC] border border-slate-200 p-5 rounded-2xl space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#0f7a75] shrink-0" />
                  <strong className="text-xs font-black text-[#0B2450]">{item.title}</strong>
                </div>
                <p className="text-[11px] text-slate-600 pl-6 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Sticky Clinic CTA Banner */}
          <div className="bg-[#F5F9FC] border border-blue-100 p-6 rounded-3xl text-center space-y-3 shadow-2xs max-w-xl mx-auto">
            <h3 className="text-base font-black text-[#0B2450]">Want to offer EMI to your patients?</h3>
            <a
              href="#partner-form"
              onClick={() => setFormType('clinic')}
              className="inline-flex items-center gap-2 px-7 py-3 bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md"
            >
              Partner With Clinaza &rarr;
            </a>
          </div>
        </section>

        {/* ── 8. STICKER KIT SECTION ── */}
        <section aria-label="Clinic Sticker Kit" className="py-12 px-4 sm:px-6 bg-[#F7FAFC] border-y border-slate-200/60">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-6 text-left max-w-5xl mx-auto shadow-xs">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-6 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0f7a75]/10 rounded-full text-[10px] font-bold text-[#0f7a75]">
                    <Package size={14} /> FREE FOR ONBOARDED CLINICS
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#0B2450] leading-tight">
                    Get Free "EMI Available Here" Glass Door Stickers
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Build instant patient trust at your clinic entrance. Every onboarded partner clinic receives a physical branding kit including weatherproof glass door decals and counter QR displays.
                  </p>
                  <ul className="space-y-2">
                    {[
                      { icon: Award, title: 'Glass Door Decal', desc: 'Premium weatherproof vinyl round sticker' },
                      { icon: Truck, title: 'Free Express Delivery', desc: 'Shipped to your clinic address across India' }
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                        <item.icon size={15} className="text-[#0867E8] shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-[#0B2450] block">{item.title}</strong>
                          <span className="text-[10px] text-slate-500">{item.desc}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div>
                    <a
                      href="#partner-form"
                      onClick={() => setFormType('clinic')}
                      className="inline-flex items-center gap-2 px-5 py-3 bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-sm"
                    >
                      Get Free Clinic Kit &rarr;
                    </a>
                  </div>
                </div>

                <div className="md:col-span-6 relative">
                  <img
                    src="/assets/clinaza-clinic-sticker.jpg"
                    alt="Clinaza EMI Available Here official glass door decal sticker"
                    className="w-full h-auto rounded-2xl border border-slate-200 shadow-md object-cover aspect-[4/3]"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── PATIENT ELIGIBILITY 2-STEP MODAL ── */}
        {showEligibilityModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-6 text-left">
              <button
                type="button"
                onClick={() => setShowEligibilityModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>

              {/* Modal Header */}
              <div className="space-y-1">
                <span className="text-[10px] font-black text-[#0f7a75] uppercase tracking-widest block">PATIENT FINANCING CHECK</span>
                <h3 className="text-xl font-black text-[#0B2450]">
                  {eligibilityStep === 1 ? 'Check Financing Eligibility' : 'Upload Documents Securely'}
                </h3>
                <p className="text-xs text-slate-500">
                  {eligibilityStep === 1
                    ? 'Step 1 of 2: Basic treatment & contact details'
                    : 'Step 2 of 2: Lender documentation requirements'}
                </p>
              </div>

              {eligibilityStep === 1 ? (
                <form onSubmit={handlePatientEligibilitySubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="patient-name" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Full Name *</label>
                      <input
                        id="patient-name"
                        type="text"
                        required
                        placeholder="e.g. Ankit Sharma"
                        value={patientData.name}
                        onChange={e => setPatientData({ ...patientData, name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#F7FAFC] border border-slate-200 rounded-xl text-xs text-[#0B2450] placeholder-slate-400 focus:outline-none focus:border-[#0867E8]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="patient-mobile" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Mobile Number *</label>
                      <input
                        id="patient-mobile"
                        type="tel"
                        required
                        placeholder="e.g. 9876543210"
                        value={patientData.mobile}
                        onChange={e => setPatientData({ ...patientData, mobile: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#F7FAFC] border border-slate-200 rounded-xl text-xs text-[#0B2450] placeholder-slate-400 focus:outline-none focus:border-[#0867E8]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="patient-city" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">City *</label>
                      <input
                        id="patient-city"
                        type="text"
                        required
                        placeholder="e.g. Mumbai / Delhi"
                        value={patientData.city}
                        onChange={e => setPatientData({ ...patientData, city: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#F7FAFC] border border-slate-200 rounded-xl text-xs text-[#0B2450] placeholder-slate-400 focus:outline-none focus:border-[#0867E8]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="patient-treatment" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Treatment Needed</label>
                      <select
                        id="patient-treatment"
                        value={patientData.treatment}
                        onChange={e => setPatientData({ ...patientData, treatment: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#F7FAFC] border border-slate-200 rounded-xl text-xs text-[#0B2450] focus:outline-none focus:border-[#0867E8]"
                      >
                        <option value="Dental Implants">Dental Implants</option>
                        <option value="Aligners & Braces">Aligners & Braces</option>
                        <option value="Crowns & Makeovers">Crowns & Makeovers</option>
                        <option value="Orthopaedics">Orthopaedics</option>
                        <option value="IVF & Fertility">IVF & Fertility</option>
                        <option value="Ophthalmology / LASIK">Ophthalmology / LASIK</option>
                        <option value="Other Surgery">Other Surgery</option>
                      </select>
                    </div>
                  </div>

                  {/* Soft-Eligibility Screening Questions Section */}
                  <div className="bg-[#F5F9FC] border border-blue-100 p-4 rounded-2xl space-y-3">
                    <span className="text-[10px] font-mono font-bold text-[#0756C7] uppercase tracking-wider block">
                      ⚡ Soft Eligibility Quick Check
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Q1: CIBIL Score Estimate */}
                      <div className="space-y-1">
                        <label htmlFor="patient-cibil" className="text-[9px] font-bold text-slate-600 uppercase tracking-wider block">
                          1. Estimated CIBIL Score
                        </label>
                        <select
                          id="patient-cibil"
                          value={patientData.cibilScore}
                          onChange={e => setPatientData({ ...patientData, cibilScore: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-[#0B2450] focus:outline-none focus:border-[#0867E8]"
                        >
                          <option value="750+ (Excellent)">750+ (Excellent)</option>
                          <option value="700 - 749 (Good)">700 - 749 (Good)</option>
                          <option value="650 - 699 (Fair)">650 - 699 (Fair)</option>
                          <option value="Below 650 / New to Credit">Below 650 / New to Credit</option>
                          <option value="Don't know / Never checked">Don't know / Never checked</option>
                        </select>
                      </div>

                      {/* Q2: Employment Type */}
                      <div className="space-y-1">
                        <label htmlFor="patient-employment" className="text-[9px] font-bold text-slate-600 uppercase tracking-wider block">
                          2. Employment Type
                        </label>
                        <select
                          id="patient-employment"
                          value={patientData.employmentType}
                          onChange={e => setPatientData({ ...patientData, employmentType: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-[#0B2450] focus:outline-none focus:border-[#0867E8]"
                        >
                          <option value="Salaried Professional">Salaried Professional</option>
                          <option value="Self-Employed / Business Owner">Self-Employed / Business Owner</option>
                          <option value="Professional (Doctor/CA/Lawyer)">Professional (Doctor/CA/Lawyer)</option>
                          <option value="Retired / Homemaker / Student">Retired / Homemaker / Student</option>
                        </select>
                      </div>

                      {/* Q3: Proof Document Available */}
                      <div className="space-y-1">
                        <label htmlFor="patient-[#income-proof]" className="text-[9px] font-bold text-slate-600 uppercase tracking-wider block">
                          3. Income Proof Available
                        </label>
                        <select
                          id="patient-income-proof"
                          value={patientData.incomeProof}
                          onChange={e => setPatientData({ ...patientData, incomeProof: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-[#0B2450] focus:outline-none focus:border-[#0867E8]"
                        >
                          <option value="Salary Slips (Last 3 Months)">Salary Slips (Last 3 Months)</option>
                          <option value="Business ITR (Last 2 Years)">Business ITR (Last 2 Years)</option>
                          <option value="Bank Statement (Last 6 Months)">Bank Statement (Last 6 Months)</option>
                          <option value="Aadhaar + PAN Only">Aadhaar + PAN Only</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#0867E8] hover:bg-[#0756C7] text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    Proceed to Digital Loan API Application &rarr;
                  </button>

                  <p className="text-[10px] text-slate-500 text-center leading-relaxed">
                    Your information will be securely queried live against Clinaza partnered bank/NBFC APIs with your consent.
                  </p>
                </form>
              ) : (
                <div className="space-y-5">
                  {/* WhatsApp Verification Notice */}
                  <div className="bg-[#F5F9FC] border border-blue-100 p-4 rounded-2xl flex items-start gap-3 text-left">
                    <MessageSquare size={20} className="text-[#0f7a75] shrink-0 mt-0.5" />
                    <div className="space-y-1 text-xs">
                      <span className="font-bold text-[#0B2450] block">Send Documents via WhatsApp</span>
                      <p className="text-slate-600 leading-relaxed text-[11px]">
                        Since API connections are handled offline, please send your KYC documents directly to our Clinaza financing desk on WhatsApp for instant eligibility processing.
                      </p>
                    </div>
                  </div>

                  {/* Initial Eligibility Assessment Summary Card */}
                  <div className="bg-[#F7FAFC] border border-slate-200 p-3.5 rounded-2xl space-y-1 text-xs">
                    <span className="text-[10px] font-mono font-bold text-[#0756C7] uppercase tracking-wider block">
                      ✓ Initial Eligibility Assessment Complete
                    </span>
                    <div className="text-[11px] text-slate-700 space-y-0.5 pt-1 font-medium">
                      <p>👤 <strong>Patient:</strong> {patientData.name || 'Not provided'} ({patientData.city || 'City'})</p>
                      <p>🦷 <strong>Treatment:</strong> {patientData.treatment}</p>
                      <p>📊 <strong>CIBIL Range:</strong> {patientData.cibilScore}</p>
                      <p>📄 <strong>Selected Proof:</strong> {patientData.incomeProof}</p>
                    </div>
                    <p className="text-[10px] text-slate-500 pt-1 leading-relaxed border-t border-slate-200 mt-2">
                      Final approval, interest rate and loan amount are subject to lender assessment.
                    </p>
                  </div>

                  {/* Document Requirements Checklist */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Documents to send on WhatsApp:</span>
                    <ul className="space-y-2">
                      {[
                        { title: 'PAN Card Copy', desc: 'For credit score evaluation' },
                        { title: 'Aadhaar / Photo ID', desc: 'Identity & address verification' },
                        { title: 'Income Proof', desc: patientData.incomeProof }
                      ].map((doc, idx) => (
                        <li key={idx} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl text-xs shadow-2xs">
                          <div>
                            <span className="font-bold text-[#0B2450] block">{doc.title}</span>
                            <span className="text-[10px] text-slate-500">{doc.desc}</span>
                          </div>
                          <span className="text-[10px] font-bold text-[#0f7a75] bg-[#0f7a75]/10 px-2.5 py-1 rounded-full shrink-0">Send on WA</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setEligibilityStep(1)}
                      className="w-1/3 py-3 bg-slate-100 hover:bg-slate-200 text-[#0B2450] font-bold text-xs rounded-xl transition-all"
                    >
                      &larr; Edit Details
                    </button>
                    <a
                      href={`https://wa.me/917292984244?text=${encodeURIComponent(
                        `Hi Clinaza, I want to check my financing eligibility.\n\n` +
                        `Name: ${patientData.name || 'N/A'}\n` +
                        `City: ${patientData.city || 'N/A'}\n` +
                        `Treatment: ${patientData.treatment}\n` +
                        `CIBIL Range: ${patientData.cibilScore}\n` +
                        `Employment: ${patientData.employmentType}\n` +
                        `Income Proof: ${patientData.incomeProof}\n\n` +
                        `I am ready to share my documents for verification.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        trackEvent('eligibility_whatsapp_sent', {
                          name: patientData.name,
                          treatment: patientData.treatment,
                          cibil: patientData.cibilScore
                        });
                      }}
                      className="w-2/3 py-3.5 bg-[#0f7a75] hover:bg-[#0c635f] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <MessageSquare size={16} /> Send Documents on WhatsApp &rarr;
                    </a>
                  </div>

                  <p className="text-[10px] text-slate-400 text-center">
                    Your documents are reviewed privately by Clinaza & partnered NBFC desk officers only.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── 7. COMPREHENSIVE FAQ ── */}
        <section aria-label="Frequently Asked Questions" className="py-16 px-6 max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-black text-[#0f7a75] uppercase tracking-widest flex items-center justify-center gap-1.5">
              <HelpCircle size={16} aria-hidden="true" /> FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#0B2450]">Common Questions</h2>
            <p className="text-xs text-slate-600">Everything doctors and patients ask about Clinaza financing.</p>
          </div>

          <div className="space-y-3">
            {comprehensiveFaqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="bg-[#F7FAFC] border border-slate-200 rounded-2xl overflow-hidden shadow-2xs transition-all">
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-slate-100/60 transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-bold text-[#0B2450]">{faq.q}</span>
                    <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-[#0756C7]' : ''}`} aria-hidden="true" />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-200/60 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 8. CLINIC CTA & REGISTRATION FORM ── */}
        <section id="partner-form" aria-label="Clinic Partner Registration" className="py-16 px-6 max-w-2xl mx-auto">
          <div className="bg-[#F7FAFC] border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xl space-y-6 text-left">
            {/* Form Toggle Header */}
            <div className="flex bg-slate-200/70 p-1 rounded-xl mb-2">
              <button
                type="button"
                onClick={() => setFormType('clinic')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  formType === 'clinic' ? 'bg-white text-[#0B2450] shadow-xs' : 'text-slate-600 hover:text-[#0B2450]'
                }`}
              >
                🏥 For Clinics & Hospitals
              </button>
              <button
                type="button"
                onClick={() => setFormType('lender')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  formType === 'lender' ? 'bg-[#0867E8] text-white shadow-xs' : 'text-slate-600 hover:text-[#0B2450]'
                }`}
              >
                🏦 For NBFCs & Lenders
              </button>
            </div>

            <div className="text-center space-y-2">
              <span className="text-[10px] font-black text-[#0f7a75] uppercase tracking-widest">
                {formType === 'clinic' ? 'CLINIC PARTNER APPLICATION' : 'NBFC & LENDER PARTNERSHIP'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0B2450]">
                {formType === 'clinic' ? 'Ready to help more patients say YES to treatment?' : 'Partner with Clinaza as a Capital Provider'}
              </h2>
              <p className="text-xs font-medium text-slate-600">
                {formType === 'clinic'
                  ? 'Offer financing through Clinaza. Tell us about your clinic and we will get in touch.'
                  : 'Access high-intent healthcare treatment financing demand through our clinic network.'}
              </p>
            </div>

            {submitted ? (
              <div className="bg-white border border-[#0f7a75]/40 p-8 rounded-2xl text-center space-y-3 shadow-sm">
                <CheckCircle2 size={40} className="text-[#0f7a75] mx-auto" aria-hidden="true" />
                <h3 className="text-lg font-black text-[#0B2450]">Inquiry Received!</h3>
                <p className="text-xs text-slate-600">Our partnership team will reach out within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate onFocus={() => trackEvent('clinic_form_started', { formType })}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="doctor-name" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {formType === 'clinic' ? 'Your Name *' : 'Contact Person / Designation *'}
                    </label>
                    <input
                      id="doctor-name"
                      type="text"
                      required
                      placeholder={formType === 'clinic' ? 'e.g. Dr. Rajesh Sharma' : 'e.g. Head of Co-Lending / LSP Partnerships'}
                      value={formData.doctorName}
                      onChange={e => setFormData({ ...formData, doctorName: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-[#0B2450] placeholder-slate-400 focus:outline-none focus:border-[#0867E8]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="clinic-name" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {formType === 'clinic' ? 'Clinic / Hospital Name *' : 'Bank / NBFC Name *'}
                    </label>
                    <input
                      id="clinic-name"
                      type="text"
                      required
                      placeholder={formType === 'clinic' ? 'e.g. Apollo Dental Care' : 'e.g. Chinmay Finlease / Capital NBFC'}
                      value={formData.clinicName}
                      onChange={e => setFormData({ ...formData, clinicName: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-[#0B2450] placeholder-slate-400 focus:outline-none focus:border-[#0867E8]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="phone-number" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Phone / WhatsApp *</label>
                    <input
                      id="phone-number"
                      type="tel"
                      required
                      placeholder="e.g. 7292984244"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-[#0B2450] placeholder-slate-400 focus:outline-none focus:border-[#0867E8]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="clinic-city" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">City *</label>
                    <input
                      id="clinic-city"
                      type="text"
                      required
                      placeholder="e.g. Mumbai, Delhi, Bengaluru"
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-[#0B2450] placeholder-slate-400 focus:outline-none focus:border-[#0867E8]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="treatment-speciality" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {formType === 'clinic' ? 'Treatment Speciality' : 'Partnership Focus'}
                  </label>
                  <select
                    id="treatment-speciality"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-[#0B2450] focus:outline-none focus:border-[#0867E8]"
                  >
                    {formType === 'clinic' ? (
                      <>
                        <option value="Dental Implants & Aligners">Dental Implants & Aligners</option>
                        <option value="Orthopaedics">Orthopaedics</option>
                        <option value="Ophthalmology">Ophthalmology</option>
                        <option value="IVF & Fertility">IVF & Fertility</option>
                        <option value="Elective Surgeries">Elective Surgeries & Other</option>
                      </>
                    ) : (
                      <>
                        <option value="FLDG-Backed LSP Partnership">FLDG-Backed LSP Partnership</option>
                        <option value="Co-Lending API Integration">Co-Lending API Integration</option>
                        <option value="Direct Loan Origination">Direct Loan Origination</option>
                        <option value="Pilot Launch Discussion">Pilot Launch Discussion</option>
                      </>
                    )}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#0867E8] hover:bg-[#0756C7] disabled:opacity-60 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-[#0867E8]/25 flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                >
                  {isSubmitting
                    ? 'Submitting…'
                    : formType === 'clinic'
                    ? 'Become a Clinaza Partner'
                    : 'Become a Lending Partner'}
                  <Send size={14} aria-hidden="true" />
                </button>

                <p className="text-center text-xs text-slate-500 font-mono pt-1">
                  Or contact founder directly:{' '}
                  <a href="https://wa.me/917292984244" target="_blank" rel="noopener noreferrer" className="text-[#0f7a75] font-bold underline">
                    +91 7292984244
                  </a>
                </p>
              </form>
            )}
          </div>
        </section>

        {/* ── 9. LENDER CTA FOOTER STRIP ("FOR LENDERS") ── */}
        <section aria-label="For Lenders" className="py-12 px-6 bg-gradient-to-r from-[#0B2450] to-[#0867E8] text-white">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6 text-center sm:text-left">
            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-[#12A8A0]">
                <Landmark size={18} aria-hidden="true" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#12A8A0]">FOR LENDERS & NBFCS</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black">Are you a Bank, NBFC or Healthcare Lender?</h3>
              <p className="text-xs text-blue-100/90 max-w-xl">
                Partner with Clinaza to access high-intent healthcare treatment financing demand through our growing clinic network.
              </p>
            </div>
            <a
              href="#partner-form"
              onClick={() => setFormType('lender')}
              className="px-7 py-3.5 bg-white text-[#0B2450] hover:bg-slate-100 text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shrink-0 transform hover:-translate-y-0.5"
            >
              Become a Lending Partner &rarr;
            </a>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200 py-10 px-6 bg-white text-center sm:text-left">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img src="/assets/clinaza-logo.jpg" alt="CLINAZA" className="h-8 w-auto rounded-lg border border-slate-200" />
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#0B2450] block">CLINAZA</span>
              <span className="text-[8px] font-bold text-[#0f7a75] block uppercase">EMI FOR BETTER HEALTH</span>
            </div>
          </div>
          <nav aria-label="Footer navigation" className="flex flex-col sm:flex-row items-center gap-4 text-[10px] text-slate-500 font-mono uppercase tracking-widest">
            <span>© 2026 CLINAZA Technologies. All Rights Reserved.</span>
            <Link to="/blog" className="hover:text-[#0f7a75] transition-colors underline">Patient Guides</Link>
            <span className="hidden sm:inline" aria-hidden="true">&middot;</span>
            <Link to="/reactivation/login" className="hover:text-[#0B2450] transition-colors">Clinic Staff Portal</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
