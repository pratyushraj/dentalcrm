import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/seo/SEOHead';
import { ShieldCheck, CheckCircle2, ArrowRight, Calculator, Clock, CreditCard, Sparkles, User, HelpCircle, Scissors } from 'lucide-react';
import { ReadingProgressBar } from '@/components/ReadingProgressBar';
import { PatientEligibilityModal } from '@/components/PatientEligibilityModal';

export default function HairTransplantEmiPage() {
  const [loanAmount, setLoanAmount] = useState(65000);
  const [tenure, setTenure] = useState(12);
  const [isEligibilityOpen, setIsEligibilityOpen] = useState(false);

  // Interest calculation (~11.5% p.a.)
  const annualRate = 0.115;
  const monthlyRate = annualRate / 12;
  const emi = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
    (Math.pow(1 + monthlyRate, tenure) - 1)
  );

  const hairLoanSchema = [
    {
      "@context": "https://schema.org",
      "@type": "FinancialProduct",
      "name": "Clinaza Hair Transplant EMI & Patient Financing",
      "description": "Instant point-of-care patient financing for FUE, FUT, and DHI hair restoration surgeries across accredited aesthetic clinics in India.",
      "provider": {
        "@type": "Organization",
        "name": "Clinaza Technologies",
        "url": "https://www.clinaza.in"
      },
      "areaServed": "IN",
      "amount": {
        "@type": "MonetaryAmount",
        "currency": "INR",
        "minValue": 30000,
        "maxValue": 250000
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
      "name": "Follicular Unit Extraction (FUE) & Direct Hair Implantation (DHI)",
      "procedureType": "https://schema.org/SurgicalProcedure",
      "bodyLocation": "Scalp",
      "relevantSpecialty": {
        "@type": "MedicalSpecialty",
        "name": "Dermatology"
      },
      "description": "Hair follicle graft harvesting and micro-implantation for male and female pattern baldness and hairline restoration."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#0867E8] selection:text-white flex flex-col justify-between relative overflow-hidden">
      <ReadingProgressBar />
      <SEOHead
        title="Hair Transplant on EMI in India (From ₹2,400/mo) | FUE & DHI"
        description="Finance your FUE & DHI hair transplant on easy monthly EMI in India. 2-min digital approval from ~11.5% p.a. Across 120+ accredited hair restoration clinics."
        keywords={[
          "hair transplant on emi",
          "hair transplant cost on emi",
          "fue hair transplant emi india",
          "hair restoration loan",
          "hair transplant financing india",
          "dhi hair transplant emi",
          "per graft cost emi"
        ]}
        canonicalUrl="https://www.clinaza.in/hair-transplant-on-emi"
        jsonLd={hairLoanSchema}
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
                  HAIR RESTORATION EMI
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">Aesthetic Care Financing</span>
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
            <Scissors size={14} className="text-[#0867E8]" />
            <span className="text-[#0B2450] font-bold">Natural Hairline Restoration on Easy EMI</span>
            <span className="text-slate-300 hidden sm:inline">&bull;</span>
            <span className="text-emerald-700 font-bold hidden sm:inline">13+ Regulated Lenders</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0B2450] leading-tight [text-wrap:balance]">
            Hair Transplant (FUE &amp; DHI) on Flexible Monthly EMI in India
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed [text-wrap:pretty]">
            Restore your natural hairline and youth without draining your emergency savings. Finance 1,500 to 5,000+ graft procedures with instant 2-minute digital approval starting from ~11.5% p.a.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-3 text-xs font-bold">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800">
              <CheckCircle2 size={14} className="text-emerald-600" /> ₹30,000 to ₹2,50,000 Sanction
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
            How Does Hair Transplant EMI Financing Work in India?
          </h2>
          <div className="bg-slate-50 border-l-4 border-[#0867E8] p-4 text-sm text-slate-800 leading-relaxed rounded-r-2xl">
            <p>
              <strong>A hair transplant EMI in India is a point-of-care aesthetic medical loan that divides hair restoration costs into affordable monthly installments.</strong> Because hair transplant surgery (FUE, FUT, DHI, Sapphire FUE) is categorized as an elective cosmetic procedure, it is 100% excluded from retail Mediclaim and corporate health insurance across India. Clinaza eliminates this financial barrier by providing instant front-desk approvals between ₹30,000 and ₹2,50,000 with annual interest rates starting from ~11.5% via RBI-regulated NBFC partners. Approvals require zero paper documentation and are completed in 2 minutes using Aadhaar and PAN at partner dermatology clinics.
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
              Hair Transplant Graft &amp; EMI Calculator
            </h3>
            <p className="text-xs text-slate-500">
              Estimate your monthly installment based on transparent ~11.5% p.a. interest rates across flexible repayment tenures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                  <span>Required Surgery Loan Amount</span>
                  <span className="text-[#0867E8] font-black text-sm">₹{loanAmount.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min={30000}
                  max={200000}
                  step={5000}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full accent-[#0867E8] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>₹30,000 (1,000 Grafts)</span>
                  <span>₹80,000 (2,500 Grafts)</span>
                  <span>₹2,00,000 (Full Crown)</span>
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
                  Check Hair Restoration Pre-Approval →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 2026 Hair Transplant Cost & EMI Table */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="space-y-2 border-b border-slate-100 pb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#0867E8] block">
              2026 GRAFT-WISE PRICING &amp; TENURE BENCHMARKS
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              2026 Hair Transplant Cost &amp; Monthly EMI Breakdown in India
            </h2>
            <p className="text-xs text-slate-500">
              Pricing based on graft count and technique (FUE, Sapphire FUE, DHI) across top cosmetic clinics.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-xs sm:text-sm">
              <thead className="bg-slate-50 font-bold text-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left">Grafts &amp; Baldness Grade</th>
                  <th className="px-4 py-3 text-left">Technique</th>
                  <th className="px-4 py-3 text-right">Avg Package Cost</th>
                  <th className="px-4 py-3 text-right text-[#0867E8]">12-Month EMI (~11.5%)</th>
                  <th className="px-4 py-3 text-center">Hairline Target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                <tr className="hover:bg-slate-50/50">
                  <td className="px-4 py-3.5 font-bold text-slate-900">1,000 – 1,500 Grafts (Norwood II)</td>
                  <td className="px-4 py-3 text-slate-600">Standard Micro-FUE</td>
                  <td className="px-4 py-3 text-right font-medium text-slate-800">₹35,000 – ₹55,000</td>
                  <td className="px-4 py-3 text-right font-black text-[#0867E8]">₹3,400 / mo</td>
                  <td className="px-4 py-3 text-center text-slate-500">Receding temples &amp; touchup</td>
                </tr>
                <tr className="hover:bg-slate-50/50 bg-blue-50/20">
                  <td className="px-4 py-3.5 font-bold text-slate-900">
                    <span className="flex items-center gap-1.5">
                      <Sparkles size={14} className="text-amber-500" />
                      2,000 – 2,500 Grafts (Norwood III)
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">Sapphire FUE / Blade-free</td>
                  <td className="px-4 py-3 text-right font-medium text-slate-800">₹65,000 – ₹95,000</td>
                  <td className="px-4 py-3 text-right font-black text-[#0867E8]">₹5,800 / mo</td>
                  <td className="px-4 py-3 text-center font-bold text-emerald-700">Frontal hairline &amp; mid-scalp</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="px-4 py-3.5 font-bold text-slate-900">3,000 – 3,500 Grafts (Norwood IV-V)</td>
                  <td className="px-4 py-3 text-slate-600">Direct Hair Implantation (DHI)</td>
                  <td className="px-4 py-3 text-right font-medium text-slate-800">₹1,10,000 – ₹1,50,000</td>
                  <td className="px-4 py-3 text-right font-black text-[#0867E8]">₹9,700 / mo</td>
                  <td className="px-4 py-3 text-center text-slate-500">Complete frontal + vertex crown</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="px-4 py-3.5 font-bold text-slate-900">4,000 – 5,000+ Grafts (Mega Session)</td>
                  <td className="px-4 py-3 text-slate-600">Combination Scalp + Beard Grafts</td>
                  <td className="px-4 py-3 text-right font-medium text-slate-800">₹1,60,000 – ₹2,30,000</td>
                  <td className="px-4 py-3 text-right font-black text-[#0867E8]">₹14,200 / mo</td>
                  <td className="px-4 py-3 text-center text-slate-500">Extensive advanced baldness</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Why Choose Clinaza for Hair Restoration */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0867E8] flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-bold text-slate-900">100% Paperless Digital Approval</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Complete instant front-desk verification in under 120 seconds using Aadhaar &amp; PAN card at your clinic.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="font-bold text-slate-900">No Upfront Lump Sum Required</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Lock in your procedure and hairline restoration today with zero cash deposit on approved lender terms.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="font-bold text-slate-900">Leading Surgeons Nationwide</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Financing valid across accredited plastic surgery and hair restoration centers in 87+ Indian cities.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <HelpCircle size={20} className="text-[#0867E8]" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Frequently Asked Questions About Hair Transplant Financing
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <h3 className="font-bold text-sm text-slate-900">Does health insurance cover hair transplant surgery in India?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                No. Standard health insurance (Mediclaim) policies strictly exclude hair restoration because it is classified as elective aesthetic surgery. Only reconstruction following traumatic burn injuries may occasionally be considered, making point-of-care EMI the primary choice for patients.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <h3 className="font-bold text-sm text-slate-900">What documents are needed to apply for a hair restoration loan?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                You only need your PAN card, Aadhaar card, and an active bank account with mobile net banking or UPI autopay. Approvals are completed digitally in 2 minutes right at the clinic reception.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <h3 className="font-bold text-sm text-slate-900">Can I pay off my loan early without penalties?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Yes. Under RBI lending guidelines, retail medical personal loans feature flexible foreclosure and partial prepayment terms through licensed NBFC partners.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="bg-gradient-to-r from-[#0B2450] to-[#0867E8] rounded-3xl p-8 sm:p-10 text-white text-center space-y-4 shadow-md">
          <span className="text-[11px] font-black uppercase tracking-widest text-blue-200">
            RESTORE YOUR CONFIDENCE &amp; HAIRLINE
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold max-w-xl mx-auto">
            Ready to Plan Your Hair Restoration Surgery?
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
              Check Hair Transplant EMI Eligibility Now →
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
        defaultTreatment="Hair Transplant (FUE / DHI)"
      />
    </div>
  );
}
