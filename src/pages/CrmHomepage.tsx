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
  Landmark
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.doctorName || !formData.clinicName || !formData.phone || !formData.city) {
      toast.error('Please fill in all required fields');
      return;
    }
    setIsSubmitting(true);
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
      q: 'Who provides the loan?',
      a: 'The loan is funded and serviced directly by RBI-regulated Banks, NBFCs, or licensed lending partners connected through Clinaza\'s infrastructure platform.'
    },
    {
      q: 'What documents does the patient need?',
      a: 'Basic digital KYC: PAN card, Aadhaar card (eKYC), proof of income/bank statement (if required by lender), and bank details for e-NACH auto-debit.'
    },
    {
      q: 'What is the minimum and maximum amount?',
      a: 'Financing options range from ₹30,000 to ₹3,00,000, tailored to patient eligibility and treatment cost.'
    },
    {
      q: 'What interest rates and tenures are available?',
      a: 'Tenures typically range from 3 to 24 months. Interest rates, subventions, or 0% EMI schemes are determined by the lending partner and clinic arrangement.'
    },
    {
      q: 'How long does loan approval take?',
      a: 'The digital application process is completed at point-of-care, with instant or near-instant pre-approval decisions from lending partner APIs.'
    },
    {
      q: 'Does every patient qualify?',
      a: 'No. Approval is subject to the independent lending partner’s credit policy, bureau score (CIBIL), and income verification. Clinaza does not guarantee approval.'
    },
    {
      q: 'Does the clinic have to manage repayments or collections?',
      a: 'Zero clinic involvement. Repayments are automatically collected by the NBFC via e-NACH auto-debit directly from the patient’s bank account.'
    },
    {
      q: 'What happens if a patient’s application is rejected?',
      a: 'If an application is declined by one lender, Clinaza can route the application to alternate lending partners or the patient can choose direct payment with the clinic.'
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
        <section aria-label="Hero" className="relative pt-12 pb-16 sm:pt-16 sm:pb-20 px-6 text-center max-w-5xl mx-auto space-y-7">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#F5F9FC] border border-blue-100 rounded-full text-xs font-bold tracking-wider text-[#0756C7] shadow-sm">
            <Building2 className="h-4 w-4 text-[#0f7a75]" />
            <span>FOR DENTAL CLINICS & HOSPITALS</span>
          </div>

          <div className="flex justify-center">
            <img
              src="/assets/clinaza-logo.jpg"
              alt="CLINAZA — EMI FOR BETTER HEALTH"
              className="h-24 sm:h-32 w-auto rounded-3xl border border-slate-200 shadow-xl object-contain p-2 bg-white"
            />
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] text-[#0B2450] max-w-4xl mx-auto">
            Don't Let Treatment Cost <br />
            <span className="bg-gradient-to-r from-[#0867E8] via-[#0088FF] to-[#12A8A0] bg-clip-text text-transparent">
              Stop Your Patients.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
            Help eligible patients finance treatments from <strong className="text-[#0B2450]">₹30,000–₹3,00,000</strong> through Clinaza's lending partners.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
            <a
              href="#partner-form"
              onClick={() => setFormType('clinic')}
              className="w-full sm:w-auto px-9 py-4 bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-[#0867E8]/30 group transform hover:-translate-y-0.5"
            >
              Partner With Clinaza
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="https://wa.me/917292984244?text=Hi%20Clinaza%20team%2C%20I%20want%20to%20offer%20patient%20financing%20at%20my%20clinic"
              target="_blank" rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-[#F7FAFC] hover:bg-slate-100 text-[#0B2450] border border-slate-200 text-xs font-black uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="h-4 w-4 text-[#0f7a75]" />
              WhatsApp Us
            </a>
          </div>

          {/* ── 1. TRUST STRIP (RIGHT BELOW HERO) ── */}
          <div className="pt-6 border-t border-slate-100 max-w-4xl mx-auto">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#0f7a75] mb-4">WHY CLINICS CHOOSE CLINAZA</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
              {[
                '₹30K–₹3L financing options',
                'Bank/NBFC lending partners',
                '100% Digital application',
                'Clinic-focused support'
              ].map((item, idx) => (
                <div key={idx} className="bg-[#F7FAFC] border border-slate-200/80 px-3.5 py-3 rounded-2xl flex items-center gap-2 shadow-2xs">
                  <CheckCircle2 size={16} className="text-[#0f7a75] shrink-0" aria-hidden="true" />
                  <span className="text-xs font-bold text-[#0B2450] leading-snug">{item}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-500 text-center pt-3 leading-tight">
              Financing is subject to lender eligibility, approval and applicable terms. Clinaza does not guarantee loan approval.
            </p>
          </div>
        </section>

        {/* ── 2. PROBLEM ── */}
        <section aria-label="The Problem" className="py-16 px-6 bg-[#F5F9FC] border-y border-blue-50">
          <div className="max-w-5xl mx-auto space-y-10">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-black text-[#0f7a75] uppercase tracking-widest">THE CLINIC CHALLENGE</span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#0B2450]">Patients Want Treatment. Cost Makes Them Wait.</h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">High upfront treatment estimates lead to postponement and lost clinic revenue.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { quote: `"I'll do it next month."`, desc: 'Patients delay essential procedures due to temporary cash flow constraints.' },
                { quote: `"It's too expensive right now."`, desc: 'High-ticket estimates (Implants, Aligners, Surgeries) exceed monthly budgets.' },
                { quote: `"Can I pay in installments?"`, desc: 'Patients actively seek flexible installment options before committing.' }
              ].map((card, idx) => (
                <div key={idx} className="bg-white border border-slate-200/80 p-6 rounded-3xl space-y-3 text-left shadow-sm">
                  <span className="text-xl sm:text-2xl font-serif italic font-bold text-[#0867E8] block">{card.quote}</span>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-white border border-blue-100 p-5 rounded-2xl text-center shadow-sm">
              <p className="text-xs sm:text-sm font-bold text-[#0B2450]">
                💡 <span className="text-[#0f7a75]">Clinaza</span> helps your clinic offer a financing option at the point of treatment.
              </p>
            </div>
          </div>
        </section>

        {/* ── 3. HOW CLINAZA WORKS ── */}
        <section aria-label="How Clinaza Works" className="py-16 px-6 max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-black text-[#0756C7] uppercase tracking-widest">STEP-BY-STEP WORKFLOW</span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#0B2450]">How Clinaza Works For Your Clinic</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((step, idx) => (
              <div key={idx} className="bg-[#F7FAFC] border border-slate-200/70 p-6 rounded-3xl space-y-3 text-left shadow-sm">
                <span className="text-3xl font-mono font-black text-[#0f7a75] block">{step.num}</span>
                <h3 className="text-sm font-black text-[#0B2450]">{step.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. BENEFITS FOR CLINICS (INCLUDES "WHAT THE CLINIC DOESN'T HAVE TO DO") ── */}
        <section aria-label="Why Clinics Partner With Clinaza" className="py-16 px-6 bg-[#F7FAFC] border-y border-slate-200/60">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-black text-[#0f7a75] uppercase tracking-widest">CLINIC PARTNER ADVANTAGE</span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#0B2450]">More Treatments. Better Patient Conversions.</h2>
            </div>

            {/* Benefit Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {clinicBenefits.map((b, idx) => (
                <div key={idx} className="bg-white border border-slate-200/80 p-5 rounded-3xl flex items-start gap-3 text-left shadow-sm">
                  <Check className="text-[#0f7a75] h-5 w-5 shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-xs font-semibold text-[#0B2450] leading-relaxed">{b}</span>
                </div>
              ))}
            </div>

            {/* ── 3. WHAT THE CLINIC DOESN'T HAVE TO DO ── */}
            <div className="bg-white border border-slate-200 p-7 rounded-3xl space-y-5 text-left shadow-sm max-w-4xl mx-auto">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[10px] font-mono font-bold text-[#0756C7] uppercase tracking-wider block">ZERO OPERATIONAL BURDEN</span>
                <h3 className="text-lg font-black text-[#0B2450]">You focus on treatment. We support the financing journey.</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {whatClinicDoesntDo.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-[#FFF5F5] border border-rose-100 p-3.5 rounded-2xl">
                    <X size={16} className="text-rose-500 shrink-0" aria-hidden="true" />
                    <span className="text-xs font-bold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 text-center text-xs font-bold text-[#0756C7] bg-[#F5F9FC] py-3 px-4 rounded-2xl border border-blue-100">
                Clinaza + Lending Partner &rarr; Seamless Point-of-Care Financing Process
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. TREATMENT CATEGORIES ("WHO IS IT FOR?") ── */}
        <section aria-label="Who Is It For" className="py-16 px-6 max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-black text-[#0f7a75] uppercase tracking-widest">SUPPORTED PROCEDURES</span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#0B2450]">Who Is It For?</h2>
            <p className="text-xs sm:text-sm text-slate-600">Ideal for high-value planned treatments supported by our lending partners:</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat, idx) => (
              <div key={idx} className="bg-[#F7FAFC] border border-slate-200/90 p-5 rounded-3xl space-y-2 text-left shadow-sm hover:border-[#0867E8] transition-colors">
                <span className="text-3xl block" role="img" aria-label={cat.name}>{cat.emoji}</span>
                <h3 className="text-xs font-black text-[#0B2450]">{cat.name}</h3>
                <span className="text-[10px] font-medium text-slate-500 block">{cat.tag}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── 6. PATIENT FINANCING ── */}
        <section aria-label="For Patients" className="py-16 px-6 bg-[#F5F9FC] border-y border-blue-50">
          <div className="max-w-5xl mx-auto space-y-10">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-black text-[#0f7a75] uppercase tracking-widest flex items-center justify-center gap-1.5">
                <UserCheck size={14} aria-hidden="true" /> FOR PATIENTS
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#0B2450]">Need Treatment But Worried About the Cost?</h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Explore financing options for eligible treatments through Clinaza's lending partners.
              </p>
            </div>

            {/* Patient Workflow Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {patientSteps.map((s, idx) => (
                <div key={idx} className="bg-white border border-slate-200 p-5 rounded-3xl space-y-3 text-left shadow-sm">
                  <span className="text-2xl block" role="img" aria-label={s.title}>{s.emoji}</span>
                  <span className="text-[10px] font-mono font-bold text-[#0756C7] uppercase tracking-wider block">Step 0{s.num}</span>
                  <h3 className="text-xs font-black text-[#0B2450]">{s.title}</h3>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            {/* Patient CTA Banner */}
            <div className="bg-white border border-slate-200 p-7 rounded-3xl text-center space-y-4 shadow-sm max-w-xl mx-auto">
              <div className="space-y-1">
                <h3 className="text-base font-black text-[#0B2450]">Need financing for your treatment?</h3>
                <p className="text-xs text-slate-600">Ask your clinic if Clinaza financing is available.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <a
                  href="#partner-form"
                  onClick={() => setFormType('clinic')}
                  className="w-full sm:w-auto px-6 py-3 bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-[#0867E8]/20 flex items-center justify-center gap-1.5"
                >
                  Ask Your Clinic About Clinaza <ArrowRight size={14} />
                </a>
                <a
                  href="https://wa.me/917292984244?text=Hi%20Clinaza%2C%20I%20want%20to%20check%20if%20my%20clinic%20offers%20Clinaza%20financing"
                  target="_blank" rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-3 bg-[#F7FAFC] hover:bg-slate-100 text-[#0B2450] border border-slate-200 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare size={14} className="text-[#0f7a75]" />
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </section>

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
                {formType === 'clinic' ? 'Ready to offer EMI options to your patients?' : 'Partner with Clinaza as a Capital Provider'}
              </h2>
              <p className="text-xs text-slate-600">
                {formType === 'clinic'
                  ? "Tell us about your clinic and we'll get in touch."
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
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
            <Link to="/yourdentist/blog" className="hover:text-[#0f7a75] transition-colors underline">Patient Guides</Link>
            <span className="hidden sm:inline" aria-hidden="true">&middot;</span>
            <Link to="/reactivation/login" className="hover:text-[#0B2450] transition-colors">Clinic Staff Portal</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
