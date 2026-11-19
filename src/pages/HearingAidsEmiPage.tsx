import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/seo/SEOHead';
import { ShieldCheck, CheckCircle2, ArrowRight, Calculator, Clock, CreditCard, Sparkles, Volume2, HelpCircle } from 'lucide-react';
import { ReadingProgressBar } from '@/components/ReadingProgressBar';
import { PatientEligibilityModal } from '@/components/PatientEligibilityModal';

export default function HearingAidsEmiPage() {
  const [loanAmount, setLoanAmount] = useState(80000);
  const [tenure, setTenure] = useState(12);
  const [isEligibilityOpen, setIsEligibilityOpen] = useState(false);

  // Interest calculation (~11.5% p.a.)
  const annualRate = 0.115;
  const monthlyRate = annualRate / 12;
  const emi = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
    (Math.pow(1 + monthlyRate, tenure) - 1)
  );

  const hearingLoanSchema = [
    {
      "@context": "https://schema.org",
      "@type": "FinancialProduct",
      "name": "Clinaza Digital Hearing Aid EMI & Patient Financing",
      "description": "Instant point-of-care patient financing for premium digital hearing aids, cochlear implants, and audiology care across partner clinics in India.",
      "provider": {
        "@type": "Organization",
        "name": "Clinaza Technologies",
        "url": "https://www.clinaza.in"
      },
      "areaServed": "IN",
      "amount": {
        "@type": "MonetaryAmount",
        "currency": "INR",
        "minValue": 25000,
        "maxValue": 350000
      },
      "annualPercentageRate": {
        "@type": "QuantitativeValue",
        "minValue": 11.5,
        "maxValue": 15.0,
        "unitText": "PERCENT"
      },
      "feesAndCommissionsSpecification": "Paperless instant digital verification. Flexible monthly installments via RBI-regulated NBFC partners."
    },
    {
      "@context": "https://schema.org",
      "@type": "MedicalProcedure",
      "name": "Audiological Evaluation & Digital Hearing Aid Fitting",
      "procedureType": "https://schema.org/NonInvasiveProcedure",
      "bodyLocation": "Ear",
      "relevantSpecialty": {
        "@type": "MedicalSpecialty",
        "name": "Otolaryngology"
      },
      "description": "Pure tone audiometry testing, digital hearing aid programming, and prescription fitting for sensorineural and conductive hearing impairment."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#0867E8] selection:text-white flex flex-col justify-between relative overflow-hidden">
      <ReadingProgressBar />
      <SEOHead
        title="Digital Hearing Aids on EMI in India (From ₹2,400/mo) | Phonak, Oticon & Signia"
        description="Finance premium digital hearing aids on easy monthly EMI in India. 2-min digital approval from ~11.5% p.a. Across 100+ accredited audiology centres."
        keywords={[
          "hearing aid on emi",
          "digital hearing aids on emi",
          "hearing machine price on emi",
          "phonak hearing aid emi india",
          "hearing aid loan india",
          "oticon hearing aid monthly installment",
          "audiology financing india"
        ]}
        canonicalUrl="https://www.clinaza.in/hearing-aids-on-emi"
        jsonLd={hearingLoanSchema}
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
                <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[9px] font-bold text-[#0867E8]">
                  HEARING CARE EMI
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">Audiology Care Financing</span>
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
            <Volume2 size={14} className="text-[#0867E8]" />
            <span className="text-[#0B2450] font-bold">Crystal-Clear Hearing on Flexible EMI</span>
            <span className="text-slate-300 hidden sm:inline">&bull;</span>
            <span className="text-emerald-700 font-bold hidden sm:inline">13+ Regulated Lenders</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0B2450] leading-tight [text-wrap:balance]">
            Premium Digital Hearing Aids on Easy Monthly EMI in India
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed [text-wrap:pretty]">
            Reclaim clear conversations with loved ones without lump-sum sticker shock. Finance invisible CIC, rechargeable RIC, and Bluetooth hearing aids with instant 2-minute digital approval starting from ~11.5% p.a.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-3 text-xs font-bold">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800">
              <CheckCircle2 size={14} className="text-emerald-600" /> ₹25,000 to ₹3,50,000 Sanction
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800">
              <Clock size={14} className="text-[#0867E8]" /> Instant 2-Minute Digital KYC
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
              <CreditCard size={14} className="text-slate-600" /> 3 to 24 Months Tenure
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Content */}
      <main className="max-w-5xl mx-auto px-4 py-6 w-full space-y-12">
        {/* GEO & Clinical Context Block */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            How Does Hearing Aid EMI Financing Work in India?
          </h2>
          <div className="bg-slate-50 border-l-4 border-[#0867E8] p-4 text-sm text-slate-800 leading-relaxed rounded-r-2xl">
            <p>
              <strong>A hearing aid EMI in India is a specialized medical personal loan that allows patients and their families to divide hearing aid technology costs into predictable monthly installments.</strong> Under IRDAI regulations, retail Mediclaim health insurance policies categorically exclude hearing aids, classified as external prosthetic sensory devices. Because digital hearing aids cost between ₹35,000 and ₹3,50,000 per ear, Clinaza eliminates this out-of-pocket burden with instant front-desk approvals starting from ~11.5% p.a. via RBI-regulated NBFC partners. Approvals require zero paper documentation and are completed in 2 minutes using Aadhaar and PAN at partner audiology suites.
            </p>
          </div>
        </section>

        {/* Interactive EMI Calculator */}
        <section id="calculator" className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-1.5 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Calculator size={14} /> Instant Estimator
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              Hearing Aid Device &amp; EMI Calculator
            </h3>
            <p className="text-xs text-slate-500">
              Estimate your monthly installment based on transparent ~11.5% p.a. interest rates across flexible repayment tenures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                  <span>Required Device Loan Amount</span>
                  <span className="text-[#0867E8] font-black text-sm">₹{loanAmount.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min={25000}
                  max={250000}
                  step={5000}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full accent-[#0867E8] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>₹25,000 (Basic Digital)</span>
                  <span>₹80,000 (Rechargeable RIC)</span>
                  <span>₹2,50,000 (Premium AI Pair)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                  <span>Repayment Tenure</span>
                  <span className="text-[#0867E8] font-black text-sm">{tenure} Months</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[6, 12, 18, 24].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setTenure(m)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        tenure === m
                          ? 'bg-[#0867E8] text-white border-[#0867E8] shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {m} Mo
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Calculated Output Card */}
            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50/70 border border-blue-200 rounded-3xl text-center space-y-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#0867E8]">
                ESTIMATED MONTHLY INSTALLMENT
              </span>
              <div className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                ₹{emi.toLocaleString('en-IN')}<span className="text-xs font-bold text-slate-500">/month</span>
              </div>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                Total repayment: ₹{(emi * tenure).toLocaleString('en-IN')} over {tenure} months at ~11.5% p.a.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsEligibilityOpen(true)}
                  className="inline-block w-full py-3.5 bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-98 cursor-pointer text-center"
                >
                  Check Hearing Care Pre-Approval →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 2026 Hearing Aid Cost & EMI Table */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="space-y-2 border-b border-slate-100 pb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#0867E8] block">
              2026 TECHNOLOGY-WISE AUDIOLOGY BENCHMARKS
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              2026 Digital Hearing Aid Cost &amp; Monthly EMI Breakdown in India
            </h2>
            <p className="text-xs text-slate-500">
              Pricing based on form factor and microchip tier (Phonak, Oticon, Signia, Widex) across accredited audiology clinics.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-xs sm:text-sm">
              <thead className="bg-slate-50 font-bold text-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left">Device Model &amp; Style</th>
                  <th className="px-4 py-3 text-left">Technology Scope</th>
                  <th className="px-4 py-3 text-right">Avg Price (Per Ear)</th>
                  <th className="px-4 py-3 text-right text-[#0867E8]">12-Month EMI (~11.5%)</th>
                  <th className="px-4 py-3 text-center">Lifestyle Fit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                <tr className="hover:bg-slate-50/50">
                  <td className="px-4 py-3.5 font-bold text-slate-900">Standard BTE (Behind-the-Ear)</td>
                  <td className="px-4 py-3 text-slate-600">Basic 8–12 channel digital sound</td>
                  <td className="px-4 py-3 text-right font-medium text-slate-800">₹25,000 – ₹45,000</td>
                  <td className="px-4 py-3 text-right font-black text-[#0867E8]">₹2,600 / mo</td>
                  <td className="px-4 py-3 text-center text-slate-500">Quiet home environments</td>
                </tr>
                <tr className="hover:bg-slate-50/50 bg-blue-50/20">
                  <td className="px-4 py-3.5 font-bold text-slate-900">
                    <span className="flex items-center gap-1.5">
                      <Sparkles size={14} className="text-amber-500" />
                      Rechargeable RIC (Receiver-in-Canal)
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">Bluetooth streaming + Lithium-ion battery</td>
                  <td className="px-4 py-3 text-right font-medium text-slate-800">₹65,000 – ₹1,10,000</td>
                  <td className="px-4 py-3 text-right font-black text-[#0867E8]">₹5,800 / mo</td>
                  <td className="px-4 py-3 text-center font-bold text-emerald-700">Active seniors &amp; professionals</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="px-4 py-3.5 font-bold text-slate-900">Invisible-in-Canal (IIC / CIC)</td>
                  <td className="px-4 py-3 text-slate-600">Custom molded 100% deep canal fit</td>
                  <td className="px-4 py-3 text-right font-medium text-slate-800">₹80,000 – ₹1,50,000</td>
                  <td className="px-4 py-3 text-right font-black text-[#0867E8]">₹7,100 / mo</td>
                  <td className="px-4 py-3 text-center text-slate-500">Zero aesthetic visibility</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="px-4 py-3.5 font-bold text-slate-900">Premium AI Directional Pair</td>
                  <td className="px-4 py-3 text-slate-600">Deep neural noise cancellation (Binaural)</td>
                  <td className="px-4 py-3 text-right font-medium text-slate-800">₹1,75,000 – ₹3,20,000</td>
                  <td className="px-4 py-3 text-right font-black text-[#0867E8]">₹15,500 / mo</td>
                  <td className="px-4 py-3 text-center text-slate-500">Crowds, meetings, restaurants</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Why Choose Clinaza for Audiology Financing */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0867E8] flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-bold text-slate-900">Zero Family Financial Strain</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Adult children or senior citizens can split premium hearing devices into manageable monthly installments from ₹2,400/mo.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="font-bold text-slate-900">Zero Paperwork Delay</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Fast 2-minute digital approval right after your clinical audiometry hearing test with Aadhaar and PAN verification.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="font-bold text-slate-900">Top Audiologists Nationwide</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Accepted across certified ENT and audiology clinics (including HEAR ONE, Widex Sound Centres) in 87+ Indian cities.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <HelpCircle size={20} className="text-[#0867E8]" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Frequently Asked Questions About Hearing Aid Financing
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <h3 className="font-bold text-sm text-slate-900">Does health insurance cover digital hearing aids in India?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                No. Standard health insurance (Mediclaim) policies in India strictly exclude external sensory aids and hearing prosthetics under standard IRDAI exclusion terms, making Clinaza point-of-care EMI the primary financing choice.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <h3 className="font-bold text-sm text-slate-900">Can a son or daughter apply on behalf of their elderly parents?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Yes. Working family members can easily apply as the primary borrower or co-applicant to secure immediate device sanction for senior parents.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <h3 className="font-bold text-sm text-slate-900">Are follow-up audiology programming sessions included?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Yes. Partner audiology clinics bundle the complete device package, including manufacturer warranty (2–4 years) and lifetime digital tuning visits.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="bg-gradient-to-r from-[#0B2450] to-[#0867E8] rounded-3xl p-8 sm:p-10 text-white text-center space-y-4 shadow-md">
          <span className="text-[11px] font-black uppercase tracking-widest text-blue-200">
            NEVER MISS ANOTHER FAMILY CONVERSATION
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold max-w-xl mx-auto">
            Ready to Experience Natural Sound Quality?
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-md mx-auto">
            Check your pre-approved financing limit in 60 seconds with zero impact on your CIBIL score.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setIsEligibilityOpen(true)}
              className="px-8 py-3.5 bg-white hover:bg-blue-50 text-[#0B2450] text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Check Hearing Aid EMI Eligibility Now →
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200 bg-white py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto space-y-2">
          <p>
            &copy; 2026 Clinaza Healthcare Technologies. Point-of-care patient healthcare financing platform.
          </p>
          <p className="text-[10px] text-slate-400">
            Loans are originated through licensed RBI-regulated NBFC and banking partners. Terms, approval, and rates (~11.5%–15% p.a.) depend on applicant creditworthiness.
          </p>
        </div>
      </footer>

      {/* Patient Eligibility Modal */}
      <PatientEligibilityModal
        isOpen={isEligibilityOpen}
        onClose={() => setIsEligibilityOpen(false)}
        defaultTreatment="Digital Hearing Aids (Audiology)"
      />
    </div>
  );
}
