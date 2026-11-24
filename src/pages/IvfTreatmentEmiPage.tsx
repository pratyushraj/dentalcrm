import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/seo/SEOHead';
import { ShieldCheck, CheckCircle2, ArrowRight, Calculator, Clock, CreditCard, Sparkles, Heart, HelpCircle } from 'lucide-react';
import { ReadingProgressBar } from '@/components/ReadingProgressBar';
import { PatientEligibilityModal } from '@/components/PatientEligibilityModal';

export default function IvfTreatmentEmiPage() {
  const [loanAmount, setLoanAmount] = useState(150000);
  const [tenure, setTenure] = useState(12);
  const [isEligibilityOpen, setIsEligibilityOpen] = useState(false);

  // Interest calculation (~11.5% p.a.)
  const annualRate = 0.115;
  const monthlyRate = annualRate / 12;
  const emi = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
    (Math.pow(1 + monthlyRate, tenure) - 1)
  );

  const ivfLoanSchema = [
    {
      "@context": "https://schema.org",
      "@type": "FinancialProduct",
      "name": "Clinaza IVF & Fertility Treatment EMI Financing",
      "description": "Instant point-of-care patient financing for IVF cycles, ICSI, donor eggs, and fertility treatments across partner hospitals in India.",
      "provider": {
        "@type": "Organization",
        "name": "Clinaza Technologies",
        "url": "https://www.clinaza.in"
      },
      "areaServed": "IN",
      "amount": {
        "@type": "MonetaryAmount",
        "currency": "INR",
        "minValue": 50000,
        "maxValue": 500000
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
      "name": "In Vitro Fertilization (IVF) & Intracytoplasmic Sperm Injection (ICSI)",
      "procedureType": "https://schema.org/PercutaneousProcedure",
      "bodyLocation": "Female Reproductive System",
      "relevantSpecialty": {
        "@type": "MedicalSpecialty",
        "name": "Obstetrics & Gynecology"
      },
      "description": "Assisted reproductive technology (ART) procedure including ovarian stimulation, egg retrieval, fertilization, and embryo transfer."
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Does health insurance cover IVF or ICSI cycles in India?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Standard retail health insurance policies in India exclude infertility investigations, IVF cycles, and ART procedures under standard IRDAI exclusion guidelines. Only select premium corporate group covers provide capped maternity riders, making Clinaza point-of-care patient EMI the primary financing vehicle."
          }
        },
        {
          "@type": "Question",
          "name": "Can couples get an IVF loan without a credit card in India?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Cardless fertility EMIs are available via Aadhaar and PAN OTP verification across leading RBI-regulated NBFC partners. No credit card or physical loan paperwork is required."
          }
        },
        {
          "@type": "Question",
          "name": "Can either spouse apply for the fertility treatment loan?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Either the husband or wife (or both as co-applicants) can apply for the medical loan to maximize sanction limits. Approvals require only Aadhaar, PAN card, and net banking/UPI verification."
          }
        },
        {
          "@type": "Question",
          "name": "Are medication costs included in the financing?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. The sanctioned loan amount covers both hospital cycle charges (egg retrieval, embryology, embryo transfer) and hormonal stimulation injection pharmacy packages."
          }
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#0867E8] selection:text-white flex flex-col justify-between relative overflow-hidden">
      <ReadingProgressBar />
      <SEOHead
        title="IVF Treatment Cost on EMI in India (From ₹5,900/mo) | Fertility Loans"
        description="Finance IVF cycles, ICSI & fertility treatments on easy monthly EMI in India. 2-min digital approval from ~11.5% p.a. Across 150+ accredited fertility centres."
        keywords={[
          "ivf on emi",
          "ivf cost on emi",
          "ivf treatment on emi india",
          "fertility loan india",
          "icsi cost on emi",
          "ivf financing india",
          "infertility medical loan"
        ]}
        canonicalUrl="https://www.clinaza.in/ivf-treatment-on-emi"
        jsonLd={ivfLoanSchema}
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
                  FERTILITY EMI
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">Reproductive Care Financing</span>
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
            <Heart size={14} className="text-[#0867E8]" />
            <span className="text-[#0B2450] font-bold">Compassionate Parenthood Financing</span>
            <span className="text-slate-300 hidden sm:inline">&bull;</span>
            <span className="text-emerald-700 font-bold hidden sm:inline">13+ Regulated Lenders</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0B2450] leading-tight [text-wrap:balance]">
            IVF &amp; Fertility Treatment on Flexible Monthly EMI in India
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed [text-wrap:pretty]">
            Never let treatment finances delay your dream of becoming a parent. Finance IVF cycles, ICSI, and fertility care with instant 2-minute digital approval starting from ~11.5% p.a.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-3 text-xs font-bold">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800">
              <CheckCircle2 size={14} className="text-emerald-600" /> ₹50,000 to ₹5,00,000 Sanction
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
            How Does IVF Treatment EMI Financing Work in India?
          </h2>
          <div className="bg-slate-50 border-l-4 border-[#0867E8] p-4 text-sm text-slate-800 leading-relaxed rounded-r-2xl">
            <p>
              <strong>An IVF EMI in India is a specialized medical personal loan that allows couples to divide high-ticket fertility treatment cycles into predictable monthly payments.</strong> Under standard Indian insurance regulations, retail health insurance policies categorically exclude Assisted Reproductive Technologies (ART) like In Vitro Fertilization (IVF), ICSI, and embryo freezing. Clinaza eliminates the stress of lump-sum clinic payments by offering instant front-desk approvals between ₹50,000 and ₹5,00,000 with annual interest rates starting from ~11.5% via RBI-regulated NBFC partners. Approvals require zero paper documentation and are completed in 2 minutes using Aadhaar and PAN at partner fertility hospitals.
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
              IVF Cycle &amp; Fertility EMI Calculator
            </h3>
            <p className="text-xs text-slate-500">
              Estimate your monthly installment based on transparent ~11.5% p.a. interest rates across flexible repayment tenures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                  <span>Required Cycle Loan Amount</span>
                  <span className="text-[#0867E8] font-black text-sm">₹{loanAmount.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min={50000}
                  max={350000}
                  step={10000}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full accent-[#0867E8] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>₹50,000 (IUI / FET)</span>
                  <span>₹1,50,000 (Standard IVF)</span>
                  <span>₹3,50,000 (Multi-Cycle + ICSI)</span>
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
                  Check Fertility Loan Pre-Approval →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 2026 IVF Treatment Cost & EMI Table */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="space-y-2 border-b border-slate-100 pb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#0867E8] block">
              2026 PROCEDURE-WISE PRICING &amp; TENURE BENCHMARKS
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              2026 IVF Cycle Cost &amp; Monthly EMI Breakdown in India
            </h2>
            <p className="text-xs text-slate-500">
              Pricing based on ART procedures (Self-Cycle, Donor, ICSI) across accredited fertility centres.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-xs sm:text-sm">
              <thead className="bg-slate-50 font-bold text-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left">Treatment Procedure</th>
                  <th className="px-4 py-3 text-left">Clinical Scope</th>
                  <th className="px-4 py-3 text-right">Avg Package Cost</th>
                  <th className="px-4 py-3 text-right text-[#0867E8]">12-Month EMI (~11.5%)</th>
                  <th className="px-4 py-3 text-center">Protocol Scope</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                <tr className="hover:bg-slate-50/50">
                  <td className="px-4 py-3.5 font-bold text-slate-900">IUI (Intrauterine Insemination)</td>
                  <td className="px-4 py-3 text-slate-600">Sperm preparation + ovulation induction</td>
                  <td className="px-4 py-3 text-right font-medium text-slate-800">₹15,000 – ₹30,000</td>
                  <td className="px-4 py-3 text-right font-black text-[#0867E8]">₹2,600 / mo</td>
                  <td className="px-4 py-3 text-center text-slate-500">First-line fertility step</td>
                </tr>
                <tr className="hover:bg-slate-50/50 bg-blue-50/20">
                  <td className="px-4 py-3.5 font-bold text-slate-900">
                    <span className="flex items-center gap-1.5">
                      <Sparkles size={14} className="text-amber-500" />
                      Self-Cycle IVF (Complete Cycle)
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">Stimulation + OPU + ET + Medication</td>
                  <td className="px-4 py-3 text-right font-medium text-slate-800">₹1,20,000 – ₹1,75,000</td>
                  <td className="px-4 py-3 text-right font-black text-[#0867E8]">₹11,000 / mo</td>
                  <td className="px-4 py-3 text-center font-bold text-emerald-700">Standard self-egg cycle</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="px-4 py-3.5 font-bold text-slate-900">IVF with ICSI &amp; Blastocyst</td>
                  <td className="px-4 py-3 text-slate-600">Intracytoplasmic sperm injection + Day 5</td>
                  <td className="px-4 py-3 text-right font-medium text-slate-800">₹1,50,000 – ₹2,20,000</td>
                  <td className="px-4 py-3 text-right font-black text-[#0867E8]">₹14,200 / mo</td>
                  <td className="px-4 py-3 text-center text-slate-500">Male factor &amp; low motility</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="px-4 py-3.5 font-bold text-slate-900">Donor Egg IVF Cycle</td>
                  <td className="px-4 py-3 text-slate-600">Donor compensation + ICSI + Transfer</td>
                  <td className="px-4 py-3 text-right font-medium text-slate-800">₹2,00,000 – ₹3,00,000</td>
                  <td className="px-4 py-3 text-right font-black text-[#0867E8]">₹18,500 / mo</td>
                  <td className="px-4 py-3 text-center text-slate-500">Advanced maternal age / low AMH</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Why Choose Clinaza for Fertility Care */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0867E8] flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-bold text-slate-900">Dignified, Discrete Approval</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Paperless 2-minute digital credit decision without intrusive questions or prolonged underwriting delays.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="font-bold text-slate-900">Zero Insurance Barrier</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bypass Mediclaim fertility exclusion clauses and start your cycle immediately with transparent monthly EMIs.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="font-bold text-slate-900">Top ART Centres Nationwide</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Financing accepted across accredited fertility hospital chains and embryology labs in 87+ Indian cities.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <HelpCircle size={20} className="text-[#0867E8]" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Frequently Asked Questions About IVF Financing
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <h3 className="font-bold text-sm text-slate-900">Does health insurance cover IVF or ICSI cycles in India?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Standard retail health insurance policies in India exclude infertility investigations, IVF cycles, and ART procedures under standard IRDAI exclusion guidelines. Only select premium corporate group covers provide capped maternity riders, making Clinaza point-of-care patient EMI the primary financing vehicle.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <h3 className="font-bold text-sm text-slate-900">Can couples get an IVF loan without a credit card in India?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Yes. Cardless fertility EMIs are available via Aadhaar and PAN OTP verification across leading RBI-regulated NBFC partners. No credit card or physical loan paperwork is required.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <h3 className="font-bold text-sm text-slate-900">Can either spouse apply for the fertility treatment loan?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Yes. Either the husband or wife (or both as co-applicants) can apply for the medical loan to maximize sanction limits. Approvals require only Aadhaar, PAN card, and net banking/UPI verification.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <h3 className="font-bold text-sm text-slate-900">Are medication costs included in the financing?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Yes. The sanctioned loan amount covers both hospital cycle charges (egg retrieval, embryology, embryo transfer) and hormonal stimulation injection pharmacy packages.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="bg-gradient-to-r from-[#0B2450] to-[#0867E8] rounded-3xl p-8 sm:p-10 text-white text-center space-y-4 shadow-md">
          <span className="text-[11px] font-black uppercase tracking-widest text-blue-200">
            EMBARK ON YOUR PARENTHOOD JOURNEY
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold max-w-xl mx-auto">
            Ready to Begin Your Fertility Treatment?
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
              Check IVF EMI Pre-Approval Now →
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
        defaultTreatment="IVF &amp; Fertility Treatment"
      />
    </div>
  );
}
