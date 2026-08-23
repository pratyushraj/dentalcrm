import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  MessageSquare, 
  Building2, 
  Check,
  Send,
  HelpCircle,
  ChevronDown,
  UserCheck
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
      toast.success('Partner request submitted! Our clinic onboarding team will contact you shortly.');
    }, 1000);
  };

  const steps = [
    { num: '01', title: 'Patient Chooses Treatment', desc: 'Implants, braces, aligners, crowns, surgeries, and elective healthcare procedures.' },
    { num: '02', title: 'Patient Applies for Financing', desc: 'Clinaza connects the patient with appropriate lending partners directly at checkout.' },
    { num: '03', title: 'Lender Evaluates', desc: 'Independent Bank/NBFC handles eligibility, approval, and loan terms.' },
    { num: '04', title: 'Treatment Proceeds', desc: 'Patient receives treatment while repaying the lender through monthly EMIs.' }
  ];

  const dentalTreatments = ['Implants', 'Braces', 'Aligners', 'Crowns & Bridges', 'Full-mouth Rehabilitation'];
  const healthcareTreatments = ['Orthopaedic Procedures', 'IVF & Fertility', 'Ophthalmology (LASIK/Cataract)', 'Elective Surgeries', 'Other Eligible Treatments'];
  const clinicBenefits = [
    'Give patients a way to manage large treatment costs',
    'Reduce treatment postponement & patient drop-off',
    'No need for the clinic to collect monthly EMIs',
    'Financing handled entirely by lending partners',
    '100% digital, paperless application process',
    'Dedicated support from the Clinaza team'
  ];
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const patientSteps = [
    { num: '1', emoji: '🦷', title: 'Choose your treatment', desc: 'Discuss your treatment plan and total cost with your clinic.' },
    { num: '2', emoji: '📋', title: 'Apply for financing', desc: 'Complete the simple digital application with required KYC documents.' },
    { num: '3', emoji: '✅', title: 'Get an eligibility decision', desc: 'The lending partner reviews your application instantly.' },
    { num: '4', emoji: '💳', title: 'Pay through EMIs', desc: 'If approved, repay the lender according to the agreed repayment schedule.' }
  ];

  const faqs = [
    {
      q: 'Is everyone eligible?',
      a: 'Eligibility is determined by the lending partner based on credit evaluation, income verification, and lender policies.'
    },
    {
      q: 'How much can I finance?',
      a: 'Financing options may range from ₹30,000 to ₹3,00,000, subject to lender approval.'
    },
    {
      q: 'Does Clinaza provide the loan?',
      a: 'Clinaza facilitates access to financing; the loan is provided by the applicable bank/NBFC/lending partner.'
    },
    {
      q: 'Can I choose any treatment?',
      a: 'Financing availability depends on the treatment, clinic, and lending partner.'
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
            {/* Prominent High-Contrast Primary CTA */}
            <a
              href="#partner-form"
              className="px-6 py-3 bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-[#0867E8]/30 flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              Partner With Clinaza <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* ── SECTION 1: HERO (WHITE) ── */}
        <section aria-label="Hero" className="relative pt-14 pb-20 sm:pt-20 sm:pb-24 px-6 text-center max-w-5xl mx-auto space-y-8">
          {/* Label above main hero headline */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#F5F9FC] border border-blue-100 rounded-full text-xs font-bold tracking-wider text-[#0756C7] shadow-sm">
            <Building2 className="h-4 w-4 text-[#0f7a75]" />
            <span>FOR DENTAL CLINICS & HOSPITALS</span>
          </div>

          <div className="flex justify-center">
            <img
              src="/assets/clinaza-logo.jpg"
              alt="CLINAZA — EMI FOR BETTER HEALTH"
              className="h-28 sm:h-36 w-auto rounded-3xl border border-slate-200 shadow-xl object-contain p-2 bg-white"
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

          <div className="inline-block bg-[#F7FAFC] border border-[#12A8A0]/30 px-8 py-3.5 rounded-2xl shadow-sm space-y-1">
            <span className="text-xs font-mono font-bold text-slate-500 block uppercase tracking-widest">PATIENT FINANCING RANGE</span>
            <span className="text-xl sm:text-3xl font-mono font-black text-[#0867E8]">₹30,000 – ₹3,00,000</span>
            {/* Lender disclaimer */}
            <span className="text-[10px] text-slate-500 block max-w-md mx-auto pt-1 leading-tight">
              Financing is subject to lender eligibility, approval and applicable terms. Clinaza does not guarantee loan approval.
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
            <a
              href="#partner-form"
              className="w-full sm:w-auto px-9 py-4 bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-[#0867E8]/30 group"
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

          <p className="text-xs text-slate-500 font-medium max-w-xl mx-auto pt-2">
            Bank/NBFC financing &bull; Digital process &bull; Clinic-focused support<br />
            <span className="italic text-[11px]">Financing handled by our lending partners. Eligibility and approval subject to lender policies.</span>
          </p>
        </section>

        {/* ── SECTION 2: THE PROBLEM (LIGHT BLUE #F5F9FC) ── */}
        <section aria-label="The Problem" className="py-20 px-6 bg-[#F5F9FC] border-y border-blue-50">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <span className="text-[10px] font-black text-[#0f7a75] uppercase tracking-widest">THE CLINIC CHALLENGE</span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#0B2450]">Patients Want Treatment. Cost Makes Them Wait.</h2>
              <p className="text-sm text-slate-600 max-w-2xl mx-auto">High upfront treatment estimates lead to postponement and lost clinic revenue.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { quote: `"I'll do it next month."`, desc: 'Patients delay essential procedures due to temporary cash flow constraints.' },
                { quote: `"It's too expensive right now."`, desc: 'High-ticket estimates (Implants, Aligners, Surgeries) exceed monthly budgets.' },
                { quote: `"Can I pay in installments?"`, desc: 'Patients actively seek flexible installment options before committing.' }
              ].map((card, idx) => (
                <div key={idx} className="bg-white border border-slate-200/80 p-6 sm:p-8 rounded-3xl space-y-3 text-left shadow-sm">
                  <span className="text-xl sm:text-2xl font-serif italic font-bold text-[#0867E8] block">{card.quote}</span>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-white border border-blue-100 p-6 rounded-2xl text-center shadow-sm">
              <p className="text-sm sm:text-base font-bold text-[#0B2450]">
                💡 <span className="text-[#0f7a75]">Clinaza</span> helps your clinic offer a financing option at the point of treatment.
              </p>
            </div>
          </div>
        </section>

        {/* ── SECTION 3: HOW IT WORKS (WHITE) ── */}
        <section aria-label="How Clinaza Works" className="py-20 px-6 max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-black text-[#0756C7] uppercase tracking-widest">STEP-BY-STEP WORKFLOW</span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#0B2450]">How Clinaza Works For Your Clinic</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="bg-[#F7FAFC] border border-slate-200/70 p-6 rounded-3xl space-y-4 text-left shadow-sm">
                <span className="text-3xl font-mono font-black text-[#0f7a75] block">{step.num}</span>
                <h3 className="text-sm font-black text-[#0B2450]">{step.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 4: TREATMENT CATEGORIES (MOVED HIGHER FOR CLINIC AUDIENCE) ── */}
        <section aria-label="Treatment Categories" className="py-20 px-6 bg-[#F7FAFC] border-y border-slate-200/60">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <span className="text-[10px] font-black text-[#0f7a75] uppercase tracking-widest">HIGH-VALUE HEALTHCARE PROCEDURES</span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#0B2450]">Financing For High-Value Healthcare</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white border border-slate-200 p-8 rounded-3xl space-y-6 text-left shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="text-3xl" role="img" aria-label="Dental">🦷</span>
                  <div>
                    <h3 className="text-lg font-black text-[#0B2450]">Dental Treatments</h3>
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Implants & Restorative Care</span>
                  </div>
                </div>
                <ul className="space-y-3">
                  {dentalTreatments.map((t, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                      <CheckCircle2 size={16} className="text-[#0f7a75] shrink-0" aria-hidden="true" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white border border-slate-200 p-8 rounded-3xl space-y-6 text-left shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="text-3xl" role="img" aria-label="Healthcare">🏥</span>
                  <div>
                    <h3 className="text-lg font-black text-[#0B2450]">Healthcare & Specialty</h3>
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Elective Surgeries & Procedures</span>
                  </div>
                </div>
                <ul className="space-y-3">
                  {healthcareTreatments.map((t, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                      <CheckCircle2 size={16} className="text-[#0756C7] shrink-0" aria-hidden="true" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 5: FOR PATIENTS (FOLLOWS HIGH-VALUE HEALTHCARE) ── */}
        <section aria-label="For Patients" className="py-20 px-6 bg-white">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <span className="text-[10px] font-black text-[#0f7a75] uppercase tracking-widest flex items-center justify-center gap-1.5">
                <UserCheck size={14} aria-hidden="true" /> FOR PATIENTS
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#0B2450]">Need Treatment But Worried About the Cost?</h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Explore financing options for eligible treatments through Clinaza's lending partners.
              </p>
            </div>

            {/* Patient Workflow Steps */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-[#0B2450] uppercase tracking-widest text-center">How It Works</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {patientSteps.map((s, idx) => (
                  <div key={idx} className="bg-[#F7FAFC] border border-slate-200 p-6 rounded-3xl space-y-3 text-left shadow-sm">
                    <span className="text-2xl block" role="img" aria-label={s.title}>{s.emoji}</span>
                    <span className="text-[10px] font-mono font-bold text-[#0756C7] uppercase tracking-wider block">Step 0{s.num}</span>
                    <h4 className="text-sm font-black text-[#0B2450]">{s.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Patient CTA Banner — "Ask Your Clinic About Clinaza" */}
            <div className="bg-[#F5F9FC] border border-blue-100 p-8 rounded-3xl text-center space-y-5 shadow-sm max-w-2xl mx-auto">
              <div className="space-y-1">
                <h3 className="text-lg font-black text-[#0B2450]">Need financing for your treatment?</h3>
                <p className="text-xs text-slate-600">Ask your clinic if Clinaza financing is available.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <a
                  href="#partner-form"
                  className="w-full sm:w-auto px-7 py-3 bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-[#0867E8]/20 flex items-center justify-center gap-1.5"
                >
                  Ask Your Clinic About Clinaza <ArrowRight size={14} />
                </a>
                <a
                  href="https://wa.me/917292984244?text=Hi%20Clinaza%2C%20I%20want%20to%20check%20if%20my%20clinic%20offers%20Clinaza%20financing"
                  target="_blank" rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-50 text-[#0B2450] border border-slate-200 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare size={14} className="text-[#0f7a75]" />
                  WhatsApp Us
                </a>
              </div>
            </div>

            {/* Patient FAQ Accordion */}
            <div className="max-w-3xl mx-auto space-y-4 pt-4">
              <div className="flex items-center justify-center gap-2 text-[#0f7a75]">
                <HelpCircle size={18} aria-hidden="true" />
                <h3 className="text-xs font-black uppercase tracking-widest text-[#0B2450]">Frequently Asked Questions</h3>
              </div>
              <div className="space-y-3">
                {faqs.map((faq, idx) => {
                  const isOpen = activeFaq === idx;
                  return (
                    <div key={idx} className="bg-[#F7FAFC] border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all">
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
            </div>
          </div>
        </section>

        {/* ── SECTION 6: WHY CLINICS PARTNER WITH CLINAZA ── */}
        <section aria-label="Why Clinics Partner With Clinaza" className="py-20 px-6 max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-black text-[#0f7a75] uppercase tracking-widest">CLINIC PARTNER ADVANTAGE</span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#0B2450]">More Treatments. Better Patient Conversions.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clinicBenefits.map((b, idx) => (
              <div key={idx} className="bg-[#F7FAFC] border border-slate-200/80 p-6 rounded-3xl flex items-start gap-3 text-left shadow-sm">
                <Check className="text-[#0f7a75] h-5 w-5 shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-xs font-semibold text-[#0B2450] leading-relaxed">{b}</span>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-[#0B2450] to-[#0867E8] p-8 sm:p-12 rounded-3xl text-center space-y-6 text-white shadow-xl">
            <h3 className="text-xl sm:text-3xl font-black">Want to offer financing at your clinic?</h3>
            <a
              href="#partner-form"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#0B2450] hover:bg-slate-100 text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg transform hover:-translate-y-0.5"
            >
              Become a Clinaza Partner &rarr;
            </a>
          </div>
        </section>

        {/* ── SECTION 7: TRUST SECTION ── */}
        <section aria-label="How Financing Works" className="py-16 px-6 bg-[#F5F9FC] border-y border-slate-200/60">
          <div className="max-w-4xl mx-auto bg-white border border-slate-200 p-8 rounded-3xl space-y-4 text-left shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck size={20} className="text-[#0f7a75]" aria-hidden="true" />
              <h3 className="text-sm font-black uppercase tracking-wider text-[#0B2450]">How Financing Works</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Clinaza is a healthcare financing facilitation platform. Financing is provided by independent banks/NBFCs/lending partners. Loan approval, interest rate, tenure, documentation and other terms are determined by the respective lender based on the applicant's eligibility.
            </p>
          </div>
        </section>

        {/* ── SECTION 8: STREAMLINED PARTNER FORM (5 ESSENTIAL FIELDS) ── */}
        <section id="partner-form" aria-label="Clinic Partner Registration" className="py-20 px-6 max-w-2xl mx-auto">
          <div className="bg-[#F7FAFC] border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xl space-y-6 text-left">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-black text-[#0f7a75] uppercase tracking-widest">GET STARTED</span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0B2450]">Ready to offer EMI options to your patients?</h2>
              <p className="text-xs text-slate-600">Tell us about your clinic and we'll get in touch.</p>
            </div>

            {submitted ? (
              <div className="bg-white border border-[#0f7a75]/40 p-8 rounded-2xl text-center space-y-3 shadow-sm">
                <CheckCircle2 size={40} className="text-[#0f7a75] mx-auto" aria-hidden="true" />
                <h3 className="text-lg font-black text-[#0B2450]">Application Received!</h3>
                <p className="text-xs text-slate-600">Our clinic onboarding team will contact you on WhatsApp/Phone shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="doctor-name" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Your Name *</label>
                    <input
                      id="doctor-name"
                      type="text"
                      required
                      placeholder="e.g. Dr. Rajesh Sharma"
                      value={formData.doctorName}
                      onChange={e => setFormData({ ...formData, doctorName: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-[#0B2450] placeholder-slate-400 focus:outline-none focus:border-[#0867E8]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="clinic-name" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Clinic / Hospital Name *</label>
                    <input
                      id="clinic-name"
                      type="text"
                      required
                      placeholder="e.g. Apollo Dental Care"
                      value={formData.clinicName}
                      onChange={e => setFormData({ ...formData, clinicName: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-[#0B2450] placeholder-slate-400 focus:outline-none focus:border-[#0867E8]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="phone-number" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Phone Number *</label>
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
                      placeholder="e.g. Mumbai, Delhi, Patna"
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-[#0B2450] placeholder-slate-400 focus:outline-none focus:border-[#0867E8]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="treatment-speciality" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Treatment Speciality</label>
                  <select
                    id="treatment-speciality"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-[#0B2450] focus:outline-none focus:border-[#0867E8]"
                  >
                    <option value="Dental Implants & Aligners">Dental Implants & Aligners</option>
                    <option value="Orthopaedics">Orthopaedics</option>
                    <option value="Ophthalmology">Ophthalmology</option>
                    <option value="IVF & Fertility">IVF & Fertility</option>
                    <option value="Elective Surgeries">Elective Surgeries & Other</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#0867E8] hover:bg-[#0756C7] disabled:opacity-60 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-[#0867E8]/25 flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                >
                  {isSubmitting ? 'Submitting…' : 'Become a Clinaza Partner'}
                  <Send size={14} aria-hidden="true" />
                </button>

                <p className="text-center text-xs text-slate-500 font-mono pt-1">
                  Or WhatsApp us directly:{' '}
                  <a href="https://wa.me/917292984244" target="_blank" rel="noopener noreferrer" className="text-[#0f7a75] font-bold underline">
                    7292984244
                  </a>
                </p>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200 py-12 px-6 bg-white text-center sm:text-left">
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
