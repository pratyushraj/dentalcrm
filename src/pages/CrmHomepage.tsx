import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  MessageSquare, 
  Building2, 
  ChevronRight, 
  HeartPulse, 
  Sparkles,
  HelpCircle,
  PhoneCall,
  Check,
  Stethoscope,
  Activity,
  Layers,
  Send,
  Lock
} from 'lucide-react';
import { toast } from 'sonner';
import { SEOHead } from '@/components/seo/SEOHead';

export default function CrmHomepage() {
  // Partner Registration Form state
  const [formData, setFormData] = useState({
    clinicName: '',
    doctorName: '',
    phone: '',
    city: '',
    categories: [] as string[],
    monthlyVolume: '10-30 patients'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleCategoryToggle = (cat: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clinicName || !formData.doctorName || !formData.phone || !formData.city) {
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
    {
      num: '01',
      title: 'Patient Chooses Treatment',
      desc: 'Implants, braces, aligners, crowns, surgeries, and elective healthcare procedures.'
    },
    {
      num: '02',
      title: 'Patient Applies for Financing',
      desc: 'Clinaza connects the patient with appropriate lending partners directly at checkout.'
    },
    {
      num: '03',
      title: 'Lender Evaluates',
      desc: 'Independent Bank/NBFC handles eligibility, approval, and loan terms.'
    },
    {
      num: '04',
      title: 'Treatment Proceeds',
      desc: 'Patient receives treatment while repaying the lender through monthly EMIs.'
    }
  ];

  const dentalTreatments = [
    'Implants',
    'Braces',
    'Aligners',
    'Crowns & Bridges',
    'Full-mouth Rehabilitation'
  ];

  const healthcareTreatments = [
    'Orthopaedic Procedures',
    'IVF & Fertility',
    'Ophthalmology (LASIK/Cataract)',
    'Elective Surgeries',
    'Other Eligible Treatments'
  ];

  const clinicBenefits = [
    'Give patients a way to manage large treatment costs',
    'Reduce treatment postponement & patient drop-off',
    'No need for the clinic to collect monthly EMIs',
    'Financing handled entirely by lending partners',
    '100% digital, paperless application process',
    'Dedicated support from the Clinaza team'
  ];

  return (
    <div className="min-h-screen bg-[#070B14] text-white font-sora antialiased overflow-x-hidden selection:bg-[#0066FF] selection:text-white">
      <SEOHead
        title="CLINAZA — Healthcare Financing Infrastructure for Clinics & Hospitals"
        description="Don't let treatment cost stop your patients. Offer financing options for eligible patients from ₹30K–₹3L. Partner with Clinaza."
        image="/assets/clinaza-logo.jpg"
        canonicalUrl="https://dental-crm-red.vercel.app/"
      />

      {/* Header */}
      <header className="border-b border-slate-800/80 backdrop-blur-xl sticky top-0 z-50 bg-[#070B14]/90">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src="/assets/clinaza-logo.jpg" 
              alt="CLINAZA Logo" 
              className="h-10 w-auto rounded-xl border border-slate-800 shadow-md group-hover:scale-105 transition-transform" 
            />
            <div className="hidden sm:block">
              <span className="text-xs font-black tracking-widest text-slate-200 block">CLINAZA</span>
              <span className="text-[9px] font-bold tracking-wider text-[#00B894] block uppercase">EMI FOR BETTER HEALTH</span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/917292984244?text=Hi%20Clinaza%20team%2C%20I%20want%20to%20offer%20patient%20financing%20at%20my%20clinic"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 rounded-xl transition-all"
            >
              <MessageSquare size={14} className="text-[#00B894]" />
              Talk on WhatsApp
            </a>
            <a
              href="#partner-form"
              className="px-5 py-2.5 bg-gradient-to-r from-[#0066FF] to-[#00B894] hover:opacity-90 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#0066FF]/20 flex items-center gap-1.5"
            >
              Partner With Clinaza
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </header>

      {/* SECTION 1: HERO SECTION */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 px-6 text-center max-w-5xl mx-auto space-y-8 z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-900/90 border border-slate-800 rounded-full text-xs font-bold tracking-wider text-[#00B894] shadow-inner">
          <Building2 className="h-4 w-4 text-[#0066FF]" /> 
          <span>B2B Financing Infrastructure for Clinics & Hospitals</span>
        </div>

        {/* Brand Logo Display */}
        <div className="flex justify-center my-2">
          <img 
            src="/assets/clinaza-logo.jpg" 
            alt="CLINAZA - EMI FOR BETTER HEALTH" 
            className="h-28 sm:h-36 w-auto rounded-3xl border-2 border-slate-800/80 shadow-2xl shadow-[#0066FF]/20 object-contain p-2 bg-white" 
          />
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] text-white max-w-4xl mx-auto">
          Don't Let Treatment Cost <br />
          <span className="bg-gradient-to-r from-[#0066FF] via-[#00A3FF] to-[#00B894] bg-clip-text text-transparent">
            Stop Your Patients.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-300 font-medium max-w-3xl mx-auto leading-relaxed">
          Offer easy financing options for eligible patients — while you focus on treatment.
        </p>

        {/* Financing Amount Badge */}
        <div className="inline-block bg-slate-900/80 border border-slate-800 px-6 py-2.5 rounded-2xl">
          <span className="text-xs font-mono font-bold text-slate-400 block uppercase tracking-widest">PATIENT FINANCING RANGE</span>
          <span className="text-lg sm:text-2xl font-mono font-black text-[#00B894]">₹30,000 – ₹3,00,000</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
          <a
            href="#partner-form"
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#0066FF] to-[#00B894] hover:opacity-95 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-[#0066FF]/25 group"
          >
            Partner With Clinaza
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>

          <a
            href="https://wa.me/917292984244?text=Hi%20Clinaza%20team%2C%20I%20want%20to%20offer%20patient%20financing%20at%20my%20clinic"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-black uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            <MessageSquare className="h-4 w-4 text-[#00B894]" />
            Talk on WhatsApp
          </a>
        </div>

        {/* Small Trust Line */}
        <p className="text-[11px] text-slate-500 font-medium max-w-xl mx-auto pt-2">
          Bank/NBFC financing &bull; Digital process &bull; Clinic-focused support. <br />
          <span className="italic">Financing handled by our lending partners. Eligibility and approval subject to lender policies.</span>
        </p>
      </section>

      {/* SECTION 2: SHOW THE PROBLEM */}
      <section className="py-20 px-6 bg-slate-950/80 border-y border-slate-800/80 relative z-10">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-black text-[#00B894] uppercase tracking-widest">THE CLINIC CHALLENGE</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">Patients Want Treatment. Cost Makes Them Wait.</h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
              High upfront treatment estimates lead to postponement and lost clinic revenue.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { quote: '"I’ll do it next month."', desc: 'Patients delay essential procedures due to temporary cash flow constraints.' },
              { quote: '"It’s too expensive right now."', desc: 'High-ticket estimates (Implants, Aligners, Surgeries) exceed monthly budgets.' },
              { quote: '"Can I pay in installments?"', desc: 'Patients actively seek flexible installment options before committing.' }
            ].map((card, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-3 text-left">
                <span className="text-xl sm:text-2xl font-serif italic font-bold text-[#0066FF] block">{card.quote}</span>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-[#0066FF]/10 via-slate-900 to-[#00B894]/10 border border-slate-800 p-6 rounded-2xl text-center">
            <p className="text-sm sm:text-base font-bold text-white">
              💡 <span className="text-[#00B894]">Clinaza</span> helps your clinic offer a financing option at the point of treatment.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: HOW CLINAZA WORKS */}
      <section className="py-20 px-6 max-w-6xl mx-auto relative z-10 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-[10px] font-black text-[#0066FF] uppercase tracking-widest">STEP-BY-STEP WORKFLOW</span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">How Clinaza Works For Your Clinic</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div key={idx} className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4 text-left relative">
              <span className="text-3xl font-mono font-black text-[#00B894] block">{step.num}</span>
              <h3 className="text-sm font-black text-white">{step.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: TREATMENT CATEGORIES */}
      <section className="py-20 px-6 bg-slate-950/90 border-y border-slate-800/80 relative z-10">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-black text-[#00B894] uppercase tracking-widest">HIGH-VALUE HEALTHCARE PROCEDURES</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">Financing For High-Value Healthcare</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Dental */}
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6 text-left">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🦷</span>
                <div>
                  <h3 className="text-lg font-black text-white">Dental Treatments</h3>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Implants & Restorative Care</span>
                </div>
              </div>
              <ul className="space-y-3">
                {dentalTreatments.map((t, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-xs text-slate-200 font-medium">
                    <CheckCircle2 size={16} className="text-[#00B894] shrink-0" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Healthcare */}
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6 text-left">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🏥</span>
                <div>
                  <h3 className="text-lg font-black text-white">Healthcare & Specialty</h3>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Elective Surgeries & Procedures</span>
                </div>
              </div>
              <ul className="space-y-3">
                {healthcareTreatments.map((t, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-xs text-slate-200 font-medium">
                    <CheckCircle2 size={16} className="text-[#0066FF] shrink-0" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: WHY CLINICS PARTNER WITH CLINAZA */}
      <section className="py-20 px-6 max-w-5xl mx-auto relative z-10 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-[10px] font-black text-[#00B894] uppercase tracking-widest">CLINIC PARTNER ADVANTAGE</span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">More Treatments. Better Patient Conversions.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clinicBenefits.map((b, idx) => (
            <div key={idx} className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl flex items-start gap-3 text-left">
              <Check className="text-[#00B894] h-5 w-5 shrink-0 mt-0.5" />
              <span className="text-xs font-semibold text-slate-200 leading-relaxed">{b}</span>
            </div>
          ))}
        </div>

        {/* Big CTA */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-[#0066FF]/20 border border-slate-800 p-8 sm:p-12 rounded-3xl text-center space-y-6">
          <h3 className="text-xl sm:text-3xl font-black text-white">Want to offer financing at your clinic?</h3>
          <a
            href="#partner-form"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#0066FF] to-[#00B894] hover:opacity-95 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-[#0066FF]/20"
          >
            Become a Clinaza Partner &rarr;
          </a>
        </div>
      </section>

      {/* SECTION 6: TRUST & TRANSPARENCY SECTION */}
      <section className="py-16 px-6 bg-slate-950 border-y border-slate-800/80 relative z-10">
        <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-4 text-left">
          <div className="flex items-center gap-2 text-[#00B894]">
            <ShieldCheck size={20} />
            <h3 className="text-sm font-black uppercase tracking-wider text-white">How Financing Works & Disclaimers</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Clinaza is a healthcare financing facilitation platform. Financing is provided by independent banks/NBFCs/lending partners. Loan approval, interest rate, tenure, documentation, and other terms are determined by the respective lender based on the applicant’s eligibility.
          </p>
        </div>
      </section>

      {/* SECTION 7: PARTNER REGISTRATION FORM */}
      <section id="partner-form" className="py-20 px-6 max-w-3xl mx-auto relative z-10">
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-12 shadow-2xl space-y-8 text-left">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-black text-[#00B894] uppercase tracking-widest">GET STARTED</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">Ready to offer EMI options to your patients?</h2>
            <p className="text-xs text-slate-400">Tell us about your clinic and we’ll get in touch.</p>
          </div>

          {submitted ? (
            <div className="bg-slate-950 border border-[#00B894]/40 p-8 rounded-2xl text-center space-y-3">
              <CheckCircle2 size={40} className="text-[#00B894] mx-auto" />
              <h3 className="text-lg font-black text-white">Application Received!</h3>
              <p className="text-xs text-slate-400">Our clinic onboarding team will contact you on WhatsApp/Phone shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Clinic / Hospital Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apollo Dental / City Care Clinic"
                    value={formData.clinicName}
                    onChange={e => setFormData({ ...formData, clinicName: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Doctor / Administrator Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Rajesh Sharma"
                    value={formData.doctorName}
                    onChange={e => setFormData({ ...formData, doctorName: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 7292984244"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mumbai, Delhi, Patna"
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Treatment Categories Offered</label>
                <div className="flex flex-wrap gap-2">
                  {['Dental Implants & Aligners', 'Orthopaedics', 'Ophthalmology', 'IVF', 'Elective Surgeries'].map((cat, idx) => {
                    const active = formData.categories.includes(cat);
                    return (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => handleCategoryToggle(cat)}
                        className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                          active 
                            ? 'bg-[#0066FF] border-[#0066FF] text-white font-bold' 
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Approx. Monthly Patient Volume</label>
                <select
                  value={formData.monthlyVolume}
                  onChange={e => setFormData({ ...formData, monthlyVolume: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
                >
                  <option value="Under 10 patients">Under 10 patients</option>
                  <option value="10-30 patients">10-30 patients</option>
                  <option value="30-100 patients">30-100 patients</option>
                  <option value="100+ patients">100+ patients</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-[#0066FF] to-[#00B894] hover:opacity-95 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-[#0066FF]/20 flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Submitting Request...' : 'Get Started & Become A Partner'}
                <Send size={14} />
              </button>

              <p className="text-center text-xs text-slate-500 font-mono">
                Or WhatsApp us directly: <a href="https://wa.me/917292984244" target="_blank" rel="noopener noreferrer" className="text-[#00B894] font-bold underline">7292984244</a>
              </p>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-12 px-6 bg-[#070B14] relative z-10 text-center sm:text-left">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img src="/assets/clinaza-logo.jpg" alt="CLINAZA Logo" className="h-8 w-auto rounded-lg border border-slate-800" />
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-slate-300 block">CLINAZA</span>
              <span className="text-[8px] font-bold text-[#00B894] block uppercase">EMI FOR BETTER HEALTH</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 text-[10px] text-slate-500 font-mono uppercase tracking-widest">
            <span>© 2026 CLINAZA Technologies. All Rights Reserved.</span>
            <Link to="/yourdentist/blog" className="hover:text-[#00B894] transition-colors underline">Patient Guides</Link>
            <span className="hidden sm:inline">&middot;</span>
            <Link to="/reactivation/login" className="hover:text-white transition-colors">Clinic Staff Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
