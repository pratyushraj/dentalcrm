import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/seo/SEOHead';
import { ShieldCheck, CheckCircle2, ArrowRight, Calculator, Clock, CreditCard, Sparkles, Smile } from 'lucide-react';

export default function ClearAlignersEmiPage() {
  const [loanAmount, setLoanAmount] = useState(65000);
  const [tenure, setTenure] = useState(12);

  // Interest calculation (~11.5% p.a.)
  const annualRate = 0.115;
  const monthlyRate = annualRate / 12;
  const emi = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
    (Math.pow(1 + monthlyRate, tenure) - 1)
  );

  const alignerSchema = [
    {
      "@context": "https://schema.org",
      "@type": "FinancialProduct",
      "name": "Clinaza Clear Aligners Loan & Treatment EMI",
      "description": "Point-of-care patient medical loan financing for invisible clear aligners and orthodontic treatment across India.",
      "provider": {
        "@type": "Organization",
        "name": "Clinaza Technologies",
        "url": "https://clinaza.in"
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
      "feesAndCommissionsSpecification": "Zero paperwork fees. Fast digital sanction through RBI-regulated NBFC partners."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <SEOHead
        title="Clear Aligners Cost on EMI in India (From ₹2,600/mo)"
        description="Looking for clear aligners on EMI in India? Compare Invisalign, Flash & Toothsi alternatives with flexible monthly financing from ~11.5% p.a. 2-min approval."
        keywords={["clear aligners cost on emi india", "invisible aligners emi", "invisalign emi india", "teeth aligners monthly payment", "braces on emi india"]}
        canonicalUrl="https://clinaza.in/clear-aligners-on-emi"
        jsonLd={alignerSchema}
      />

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight text-[#0B2450]">
              CLIN<span className="text-[#0867E8]">AZA</span>
            </span>
            <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md border border-blue-200">
              Aligner Financing
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <a
              href="#calculator"
              className="px-4 py-2 bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-sm"
            >
              Calculate EMI →
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-900 via-[#0B2450] to-slate-900 text-white py-14 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-bold tracking-wide">
            <ShieldCheck size={14} className="text-emerald-400" /> Transparent Monthly Financing via Regulated NBFCs
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Clear Invisible Aligners on Flexible Monthly EMI in India
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Straighten your teeth discreetly with certified orthodontic aligners. Split treatments from ₹35,000 to ₹1,80,000 into predictable monthly installments starting from ~11.5% p.a.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 size={16} /> ₹30,000 to ₹2,50,000 Sanction
            </div>
            <div className="flex items-center gap-1.5 text-blue-300">
              <Clock size={16} /> Instant 2-Minute Digital KYC
            </div>
            <div className="flex items-center gap-1.5 text-indigo-300">
              <CreditCard size={16} /> 3 to 24 Months Tenure
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Content */}
      <main className="max-w-5xl mx-auto px-4 py-10 w-full space-y-12">
        {/* GEO Citability Block */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            How Much Do Clear Aligners Cost on EMI in India?
          </h2>
          <div className="bg-slate-50 border-l-4 border-emerald-600 p-4 text-sm text-slate-800 leading-relaxed rounded-r-xl">
            <p>
              <strong>The cost of clear aligners in India ranges from ₹45,000 to ₹1,50,000 depending on orthodontic complexity, case duration, and manufacturer brand (such as Invisalign, Flash Orthodontics, or certified Indian dental lab aligners).</strong> Through Clinaza's point-of-care patient financing network, treatment costs can be converted into monthly EMI plans starting from approximately ₹2,600 per month (12 to 24-month tenures) with interest rates starting from ~11.5% p.a. via RBI-regulated NBFC partners. Pre-approval requires zero physical paperwork and is completed in 2 minutes via digital Aadhaar/PAN verification at partner dental clinics across India.
            </p>
          </div>
        </section>

        {/* Interactive Aligner EMI Calculator */}
        <section id="calculator" className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-1.5 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Calculator size={14} /> Aligner Loan Calculator
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              Clear Aligner Monthly EMI Estimator
            </h3>
            <p className="text-xs text-slate-500">
              Calculate your exact monthly payments for mild, moderate, or comprehensive aligner packages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                  <span>Aligner Package Cost</span>
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
                  <span>₹30,000 (Mild)</span>
                  <span>₹80,000 (Moderate)</span>
                  <span>₹2,00,000 (Complex)</span>
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
                      className={`py-2 text-xs font-bold rounded-lg border transition-all ${
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
            <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50/70 border border-emerald-200 rounded-2xl text-center space-y-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">
                ESTIMATED MONTHLY INSTALLMENT
              </span>
              <div className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                ₹{emi.toLocaleString('en-IN')}<span className="text-xs font-bold text-slate-500">/month</span>
              </div>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                Total repayment: ₹{(emi * tenure).toLocaleString('en-IN')} over {tenure} months at ~11.5% p.a.
              </p>
              <div className="pt-2">
                <Link
                  to="/#check-eligibility"
                  className="inline-block w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md"
                >
                  Check Aligner EMI Eligibility Online →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Clear Aligner Brand Comparison &amp; Typical Costs in India
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200 border border-neutral-100 text-sm">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-neutral-500 uppercase text-xs">Aligner Option</th>
                  <th className="px-4 py-3 text-left font-bold text-neutral-500 uppercase text-xs">Price Range</th>
                  <th className="px-4 py-3 text-left font-bold text-neutral-500 uppercase text-xs">Estimated Monthly EMI</th>
                  <th className="px-4 py-3 text-left font-bold text-neutral-500 uppercase text-xs">Treatment Time</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-100 text-xs">
                <tr>
                  <td className="px-4 py-3 font-bold text-slate-800">Invisalign Comprehensive (US Brand)</td>
                  <td className="px-4 py-3 text-neutral-600">₹1,50,000 – ₹2,50,000</td>
                  <td className="px-4 py-3 text-emerald-600 font-bold">~₹6,800 / mo (24 mo)</td>
                  <td className="px-4 py-3 text-slate-600">12 – 18 Months</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-bold text-slate-800">Flash Orthodontics (Premium Indian Brand)</td>
                  <td className="px-4 py-3 text-neutral-600">₹80,000 – ₹1,30,000</td>
                  <td className="px-4 py-3 text-emerald-600 font-bold">~₹4,100 / mo (18 mo)</td>
                  <td className="px-4 py-3 text-slate-600">8 – 14 Months</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-bold text-slate-800">Certified Clinic Custom Lab Aligners</td>
                  <td className="px-4 py-3 text-neutral-600">₹45,000 – ₹80,000</td>
                  <td className="px-4 py-3 text-emerald-600 font-bold">~₹2,600 / mo (12 mo)</td>
                  <td className="px-4 py-3 text-slate-600">6 – 10 Months</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 font-mono">
        <p>© 2026 CLINAZA Technologies. Embedded Patient Financing &amp; Dental CRM Network.</p>
      </footer>
    </div>
  );
}
