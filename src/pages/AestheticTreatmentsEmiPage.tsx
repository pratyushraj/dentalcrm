import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/seo/SEOHead';
import { 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Calculator, 
  Clock, 
  CreditCard, 
  Sparkles, 
  HeartPulse, 
  Activity,
  Building2,
  Check,
  ChevronRight
} from 'lucide-react';
import { ReadingProgressBar } from '@/components/ReadingProgressBar';
import { PatientEligibilityModal } from '@/components/PatientEligibilityModal';
import { ClinicCityFinder } from '@/components/ClinicCityFinder';

export default function AestheticTreatmentsEmiPage() {
  const [loanAmount, setLoanAmount] = useState(45000);
  const [tenure, setTenure] = useState(12);
  const [isEligibilityOpen, setIsEligibilityOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');

  // Interest calculation (~11.5% p.a.)
  const annualRate = 0.115;
  const monthlyRate = annualRate / 12;
  const emi = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
    (Math.pow(1 + monthlyRate, tenure) - 1)
  );

  const aestheticSchema = [
    {
      "@context": "https://schema.org",
      "@type": "FinancialProduct",
      "name": "Clinaza Aesthetic & Skin Treatment EMI Financing",
      "description": "Instant point-of-care patient medical financing and EMIs for GFC, PRP, HIFU, HIEMT, hair restoration, and wellness packages across India.",
      "provider": {
        "@type": "Organization",
        "name": "Clinaza Technologies",
        "url": "https://www.clinaza.in"
      },
      "areaServed": "IN",
      "amount": {
        "@type": "MonetaryAmount",
        "currency": "INR",
        "minValue": 15000,
        "maxValue": 250000
      },
      "annualPercentageRate": {
        "@type": "QuantitativeValue",
        "minValue": 11.5,
        "maxValue": 15.0,
        "unitText": "PERCENT"
      },
      "feesAndCommissionsSpecification": "Zero physical paperwork. Instant digital approval across 16+ banks & RBI-regulated NBFC partners."
    }
  ];

  const TREATMENTS_LIST = [
    {
      name: "GFC & PRP Skin & Scalp Therapy",
      tagline: "Growth Factor Concentrate & Autologous Platelet Rejuvenation",
      popularSessions: "4 – 6 Sessions Package",
      typicalCost: "₹25,000 – ₹45,000",
      estEmi: "₹2,180/mo",
      keyHighlights: ["Zero chemical additives", "Hair follicle reactivation", "Dermal collagen booster"]
    },
    {
      name: "HIFU Non-Surgical Face & Neck Lift",
      tagline: "High-Intensity Focused Ultrasound Skin Tightening",
      popularSessions: "Full Face + Submental Area",
      typicalCost: "₹35,000 – ₹65,000",
      estEmi: "₹3,050/mo",
      keyHighlights: ["SMAS layer stimulation", "Zero downtime / non-invasive", "Lasts 12–18 months"]
    },
    {
      name: "HIEMT Body Sculpting & Contouring",
      tagline: "High-Intensity Electromagnetic Muscle Stimulation & Fat Burning",
      popularSessions: "6 – 8 Sessions Program",
      typicalCost: "₹45,000 – ₹85,000",
      estEmi: "₹3,930/mo",
      keyHighlights: ["Equivalent to 20,000 crunches/session", "Core & glute toning", "Fat reduction + muscle definition"]
    },
    {
      name: "Medical Aesthetics (Botox & Dermal Fillers)",
      tagline: "Anti-Wrinkle Injections, Jawline & Lip Volumization",
      popularSessions: "Targeted Facial Rejuvenation",
      typicalCost: "₹25,000 – ₹60,000",
      estEmi: "₹2,180/mo",
      keyHighlights: ["US-FDA approved formulations", "Immediate contouring", "Carried out by certified dermatologists"]
    },
    {
      name: "Clinical Nutrition & Metabolic Wellness",
      tagline: "Doctor-Supervised Weight Management & Gut Health Protocols",
      popularSessions: "3 – 6 Months Guided Package",
      typicalCost: "₹18,000 – ₹40,000",
      estEmi: "₹1,570/mo",
      keyHighlights: ["Metabolic blood profiling", "Weekly biometric monitoring", "Sustainable lifestyle reversal"]
    },
    {
      name: "FUE & DHI Hair Restoration",
      tagline: "Permanent Natural Hairline Micro-Graft Implantation",
      popularSessions: "2,000 – 4,000 Grafts",
      typicalCost: "₹55,000 – ₹1,60,000",
      estEmi: "₹4,800/mo",
      keyHighlights: ["Permanent DHT-resistant follicles", "Natural angle & density", "Single-day procedure"]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#0867E8] selection:text-white flex flex-col justify-between relative overflow-hidden">
      <ReadingProgressBar />
      <SEOHead
        title="Aesthetic & Skin Treatments on Flexible Monthly EMI in India (GFC, PRP, HIFU, HIEMT)"
        description="Instant point-of-care patient financing for aesthetic treatments: GFC, PRP, HIFU, HIEMT, botox, and nutrition packages across India. 100% paperless eKYC, flexible 3–24 month EMIs, 16+ banks."
        keywords={[
          "aesthetic treatments on emi", 
          "gfc treatment emi india", 
          "prp treatment on emi", 
          "hifu cost on emi india", 
          "hiemt emi cost", 
          "skin clinic emi facility", 
          "dermatology emi india", 
          "botox cost on emi", 
          "hair transplant emi india"
        ]}
        canonicalUrl="https://www.clinaza.in/aesthetic-treatments-on-emi"
        jsonLd={aestheticSchema}
      />

      {/* Atmospheric Ambient Background Canvas */}
      <div className="absolute inset-0 bg-radial-fintech pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-grid-fintech mask-radial-fade opacity-60 pointer-events-none -z-10" />

      {/* Top Floating Pill Navbar */}
      <header className="fixed top-3 sm:top-5 inset-x-0 z-50 pointer-events-none px-4 sm:px-6">
        <nav className="max-w-5xl mx-auto bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-[0_8px_32px_rgba(15,23,42,0.08)] rounded-full px-3.5 sm:px-5 py-2.5 flex items-center justify-between gap-3 pointer-events-auto transition-all">
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <img 
              src="/assets/clinaza-logo.jpg" 
              alt="CLINAZA" 
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl border border-slate-200 shadow-xs object-cover group-hover:scale-105 transition-transform" 
              width={36}
              height={36}
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-widest text-[#0B2450] uppercase">CLINAZA</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[9px] font-bold text-amber-700">
                  AESTHETICS EMI
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">Point-of-Care Healthcare Financing</span>
            </div>
          </Link>

          {/* Official Pine Labs Badge */}
          <div className="hidden md:flex items-center gap-1.5 pl-3 border-l border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gateway:</span>
            <img
              src="/assets/plural_by_pinelabs_transparent.png"
              alt="Plural by Pine Labs"
              className="h-3.5 w-auto object-contain"
              width={80}
              height={14}
            />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5"></span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="#calculator"
              className="px-4 py-2 min-h-[40px] bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-extrabold uppercase tracking-wider rounded-full transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
            >
              <span>Calculate EMI</span>
              <ArrowRight size={13} />
            </a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-36 pb-12 sm:pb-16 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/90 text-slate-800 text-xs font-semibold shadow-2xs">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span className="text-[#0B2450] font-bold">Paperless Healthcare Financing via Regulated Lending Partners</span>
            <span className="text-slate-300 hidden sm:inline">&bull;</span>
            <span className="text-emerald-700 font-bold hidden sm:inline">16+ Major Banks</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0B2450] tracking-tight leading-[1.15]">
            Aesthetic & Skin Treatments on <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#0867E8] via-[#0756C7] to-amber-600 bg-clip-text text-transparent">
              Flexible Monthly EMIs
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
            Never delay high-impact aesthetic care due to upfront treatment package costs. Convert GFC, PRP, HIFU, HIEMT body sculpting, and wellness plans into easy monthly EMIs.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setIsEligibilityOpen(true)}
              className="px-6 py-3 min-h-[44px] bg-[#0867E8] hover:bg-[#0756C7] text-white text-sm font-extrabold rounded-full transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <Sparkles size={16} />
              <span>Check Pre-Approved EMI Limit</span>
              <ArrowRight size={15} />
            </button>
            <Link
              to="/clinic-onboarding?category=derma"
              className="px-6 py-3 min-h-[44px] bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-sm font-bold rounded-full transition-all shadow-2xs flex items-center gap-2 active:scale-95"
            >
              <Building2 size={16} className="text-amber-600" />
              <span>Are You an Aesthetic Clinic? Onboard &bull; ₹999</span>
            </Link>
          </div>
        </div>
      </section>

      {/* GEO Citability Block for AI Search & Search Engines */}
      <section className="px-4 max-w-5xl mx-auto w-full pt-4 pb-2">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-3 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            How Does Aesthetic &amp; Dermatology Treatment EMI Financing Work in India?
          </h2>
          <div className="bg-slate-50 border-l-4 border-[#0867E8] p-4 text-sm text-slate-800 leading-relaxed rounded-r-2xl">
            <p>
              <strong>Aesthetic and skin treatment EMI in India is a point-of-care medical financing plan allowing patients to convert high-ticket dermatology and wellness packages into flexible monthly installments.</strong> Because standard retail health insurance policies classify aesthetic dermatology (including Growth Factor Concentrate (GFC), Platelet-Rich Plasma (PRP), High-Intensity Focused Ultrasound (HIFU), HIEMT body contouring, chemical peels, and botulinum toxin) as elective out-of-pocket expenses, Clinaza provides digital front-desk financing between ₹15,000 and ₹2,50,000 with annual interest rates starting from ~11.5% via RBI-regulated NBFC partners. Approvals require zero paper documentation and are completed in under 2 minutes using Aadhaar and PAN verification at certified partner clinics across India.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content & Interactive Calculator */}
      <section id="calculator" className="py-8 sm:py-12 px-4 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Interactive EMI Slider Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
                  <Calculator size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-[#0B2450]">Aesthetic Treatment EMI Calculator</h2>
                  <p className="text-xs text-slate-500">Estimate your monthly payment in seconds</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                11.5% – 14.5% p.a.
              </span>
            </div>

            {/* Quick Treatment Presets */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Quick Treatment Presets</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'GFC / PRP 4-Sessions', amt: 32000 },
                  { name: 'HIFU Face Lift', amt: 45000 },
                  { name: 'HIEMT Body Sculpting', amt: 55000 },
                  { name: 'Botox & Fillers', amt: 38000 },
                  { name: 'Hair Transplant', amt: 75000 }
                ].map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setLoanAmount(item.amt)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      loanAmount === item.amt
                        ? 'bg-[#0867E8] text-white border-[#0867E8]'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {item.name} (₹{(item.amt / 1000).toFixed(0)}k)
                  </button>
                ))}
              </div>
            </div>

            {/* Loan Amount Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-slate-700">Treatment Package Amount:</span>
                <span className="text-xl font-black text-[#0B2450]">₹{loanAmount.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="15000"
                max="150000"
                step="5000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0867E8]"
              />
              <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                <span>₹15,000</span>
                <span>₹75,000</span>
                <span>₹1,50,000</span>
              </div>
            </div>

            {/* Tenure Selection */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 block">Select EMI Duration (Tenure)</label>
              <div className="grid grid-cols-4 gap-2">
                {[6, 12, 18, 24].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTenure(t)}
                    className={`py-2.5 text-xs font-extrabold rounded-xl border transition-all cursor-pointer ${
                      tenure === t
                        ? 'bg-[#0B2450] text-white border-[#0B2450] shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {t} Months
                  </button>
                ))}
              </div>
            </div>

            {/* Output Calculation Banner */}
            <div className="bg-gradient-to-br from-blue-50/80 to-amber-50/50 rounded-2xl p-5 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                  Estimated Monthly EMI
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-3xl sm:text-4xl font-black text-[#0867E8]">
                    ₹{emi.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-bold text-slate-500">/ month</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  *Indicative EMI. Final rate depends on bank approval and tenure selection.
                </p>
              </div>

              <button
                onClick={() => setIsEligibilityOpen(true)}
                className="w-full sm:w-auto px-5 py-3 min-h-[44px] bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 shrink-0 active:scale-95 cursor-pointer"
              >
                <span>Get Instant Pre-Approval</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Right: Key Patient & Clinic Benefits */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-black text-[#0B2450] flex items-center gap-2">
                <Sparkles size={18} className="text-amber-600" />
                Why Patients Choose Clinaza for Aesthetics
              </h3>

              <div className="space-y-3">
                {[
                  {
                    title: "No Upfront Price Shock",
                    desc: "Start multi-session GFC or HIFU packages without depleting your emergency savings."
                  },
                  {
                    title: "92-Second Paperless Approval",
                    desc: "Digital eKYC verified via Aadhaar OTP directly at your clinic's front desk."
                  },
                  {
                    title: "Debit & Credit Card EMIs",
                    desc: "Pre-approved limits across HDFC, ICICI, SBI, Axis, Kotak, and 12+ other banks."
                  },
                  {
                    title: "Cardless Healthcare Finance",
                    desc: "Instant digital financing available even for patients without high-limit credit cards."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* B2B Clinic Partner Card */}
            <div className="bg-gradient-to-br from-[#0B2450] to-[#071B3B] text-white rounded-3xl p-6 shadow-md space-y-4">
              <div className="flex items-center gap-2 text-amber-400">
                <Building2 size={20} />
                <span className="text-[11px] font-black uppercase tracking-widest">For Aesthetic Clinics</span>
              </div>
              <h3 className="text-lg font-black leading-snug">
                Stop Losing 60% of Consultation Packages to Upfront Price Friction
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Empower your front desk with instant point-of-care patient EMIs powered by Plural by Pine Labs. 100% upfront T+1 payment to your clinic with 0% default recourse.
              </p>
              <div className="pt-1 flex items-center justify-between text-xs font-bold text-slate-200 border-t border-white/10 pt-3">
                <span>Setup Fee: ₹999 one-time</span>
                <span className="text-emerald-400">₹0 AMC &bull; ₹0 Monthly</span>
              </div>
              <Link
                to="/clinic-onboarding?category=derma"
                className="w-full py-2.5 min-h-[44px] bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Onboard Clinic Partner &bull; ₹999</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Comprehensive Treatments Covered Grid */}
      <section className="py-12 sm:py-16 px-4 bg-white border-y border-slate-200/80">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#0867E8] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              COVERED PROCEDURES
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0B2450]">
              Aesthetic Treatments Available on Clinaza EMI
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
              Transparent upfront financing for leading clinical dermatology, wellness, and anti-aging treatments across India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {TREATMENTS_LIST.map((t, idx) => (
              <div 
                key={idx} 
                className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 hover:border-[#0867E8]/40 hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-black text-[#0B2450]">{t.name}</h3>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-full shrink-0">
                      {t.estEmi}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">{t.tagline}</p>
                  
                  <div className="pt-2 border-t border-slate-200/60 space-y-1">
                    {t.keyHighlights.map((h, hIdx) => (
                      <div key={hIdx} className="flex items-center gap-1.5 text-[11px] text-slate-700 font-medium">
                        <Check size={12} className="text-emerald-600 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-bold">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Typical Package</span>
                    <span className="text-slate-800 font-extrabold">{t.typicalCost}</span>
                  </div>
                  <button
                    onClick={() => {
                      const baseAmt = parseInt(t.typicalCost.replace(/\D/g, '').slice(0, 5)) || 35000;
                      setLoanAmount(baseAmt);
                      const el = document.getElementById('calculator');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-[#0867E8] hover:text-[#0756c7] flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                  >
                    <span>Simulate EMI</span>
                    <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* City Locator Component */}
      <section className="py-12 px-4 max-w-5xl mx-auto w-full">
        <ClinicCityFinder
          title="Find Partner Aesthetic & Skin Clinics Near You"
          subtitle="Explore accredited clinics offering Clinaza point-of-care patient financing across 50+ Indian cities."
          onCheckEligibility={(city) => {
            setSelectedCity(city);
            setIsEligibilityOpen(true);
          }}
        />
      </section>

      {/* Patient Eligibility Modal */}
      <PatientEligibilityModal
        isOpen={isEligibilityOpen}
        onClose={() => setIsEligibilityOpen(false)}
        defaultTreatment="Aesthetic & Skin Treatment"
        sourcePage="Aesthetic Treatments EMI"
        defaultCity={selectedCity}
      />

      {/* Footer Branding */}
      <footer className="py-8 border-t border-slate-200 bg-white text-center text-xs text-slate-500 space-y-2">
        <div className="flex items-center justify-center gap-2">
          <img src="/assets/clinaza-logo.jpg" alt="Clinaza" className="h-5 w-auto rounded" />
          <span className="font-extrabold text-[#0B2450]">CLINAZA HealthPay</span>
          <span>&bull;</span>
          <span>Official Payment Partner: Plural by Pine Labs</span>
        </div>
        <p className="text-[11px] text-slate-400">
          Clinaza Technologies &bull; Direct T+1 settlement to verified clinic bank current accounts.
        </p>
      </footer>
    </div>
  );
}
