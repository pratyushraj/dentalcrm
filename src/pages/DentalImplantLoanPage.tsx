import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/seo/SEOHead';
import { ShieldCheck, CheckCircle2, ArrowRight, Calculator, Clock, CreditCard, Sparkles, Building2 } from 'lucide-react';

export default function DentalImplantLoanPage() {
  const [loanAmount, setLoanAmount] = useState(60000);
  const [tenure, setTenure] = useState(12);

  // Interest calculation (~11.5% p.a.)
  const annualRate = 0.115;
  const monthlyRate = annualRate / 12;
  const emi = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
    (Math.pow(1 + monthlyRate, tenure) - 1)
  );

  const implantLoanSchema = [
    {
      "@context": "https://schema.org",
      "@type": "FinancialProduct",
      "name": "Clinaza Dental Implant Loan & Treatment EMI",
      "description": "Instant point-of-care financing for single tooth, multiple implants, and full mouth All-on-4 dental implant surgeries across India.",
      "provider": {
        "@type": "Organization",
        "name": "Clinaza Technologies",
        "url": "https://clinaza.in"
      },
      "areaServed": "IN",
      "amount": {
        "@type": "MonetaryAmount",
        "currency": "INR",
        "minValue": 25000,
        "maxValue": 500000
      },
      "annualPercentageRate": {
        "@type": "QuantitativeValue",
        "minValue": 11.5,
        "maxValue": 15.0,
        "unitText": "PERCENT"
      },
      "feesAndCommissionsSpecification": "Zero paperwork fee. Instant pre-approval via RBI-regulated NBFC partners."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <SEOHead
        title="Dental Implant Loan & EMI in India (From ₹2,400/mo) | Clinaza"
        description="Get a dental implant loan in India. Finance single tooth, multiple implants & All-on-4 surgery with flexible monthly EMI from ~11.5% p.a. 2-min digital approval."
        keywords={["dental implant loan", "dental implants loan", "dental implant on emi india", "dental surgery loan", "medical loan for dental implants", "dental financing india"]}
        canonicalUrl="https://clinaza.in/dental-implant-loan"
        jsonLd={implantLoanSchema}
      />

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight text-[#0B2450]">
              CLIN<span className="text-[#0867E8]">AZA</span>
            </span>
            <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md border border-blue-200">
              Implant Financing
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[11px] font-bold tracking-wide">
            <ShieldCheck size={14} className="text-blue-400" /> Powered by RBI-Regulated NBFC & Banking Partners
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Dental Implant Loans &amp; Flexible Monthly EMIs in India
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Don't let treatment expenses delay your smile restoration. Finance single implants, bridges, or full-mouth All-on-4 procedures with 2-minute digital pre-approval starting from ~11.5% p.a.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 size={16} /> ₹25,000 to ₹5,00,000 Sanction
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
            How Does a Dental Implant Loan Work in India?
          </h2>
          <div className="bg-slate-50 border-l-4 border-[#0867E8] p-4 text-sm text-slate-800 leading-relaxed rounded-r-xl">
            <p>
              <strong>A dental implant loan in India is an unsecured medical personal loan enabling patients to finance restorative dental surgeries in monthly installments.</strong> Through Clinaza's point-of-care lending network, patients access loan amounts between ₹25,000 and ₹5,00,000 with annual interest rates starting from ~11.5% via RBI-regulated NBFC partners. Approvals require zero physical paperwork and are completed digitally in under 2 minutes using Aadhaar and PAN verification. Covered treatments include titanium dental implants, zirconia crowns, sinus lifts, bone grafting, and full-mouth rehabilitations (All-on-4 and All-on-6) across 87+ Indian cities.
            </p>
          </div>
        </section>

        {/* Interactive EMI Calculator */}
        <section id="calculator" className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-1.5 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Calculator size={14} /> Instant Estimator
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              Dental Implant EMI Calculator
            </h3>
            <p className="text-xs text-slate-500">
              Estimate your monthly installment based on transparent ~11.5% p.a. interest rates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                  <span>Required Loan Amount</span>
                  <span className="text-[#0867E8] font-black text-sm">₹{loanAmount.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min={25000}
                  max={300000}
                  step={5000}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full accent-[#0867E8] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>₹25,000</span>
                  <span>₹1,50,000</span>
                  <span>₹3,00,000</span>
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
            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50/70 border border-blue-200 rounded-2xl text-center space-y-3">
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
                <Link
                  to="/#check-eligibility"
                  className="inline-block w-full py-3 bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md"
                >
                  Apply for Implant Loan Online →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Procedures Comparison Table */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Typical Dental Implant Treatment Costs &amp; Estimated EMIs in India
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200 border border-neutral-100 text-sm">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-neutral-500 uppercase text-xs">Implant Procedure</th>
                  <th className="px-4 py-3 text-left font-bold text-neutral-500 uppercase text-xs">Average Cost</th>
                  <th className="px-4 py-3 text-left font-bold text-neutral-500 uppercase text-xs">Typical Monthly EMI</th>
                  <th className="px-4 py-3 text-left font-bold text-neutral-500 uppercase text-xs">Approval Time</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-100 text-xs">
                <tr>
                  <td className="px-4 py-3 font-bold text-slate-800">Single Tooth Titanium Implant + Crown</td>
                  <td className="px-4 py-3 text-neutral-600">₹25,000 – ₹45,000</td>
                  <td className="px-4 py-3 text-emerald-600 font-bold">~₹2,350 / mo (12 mo)</td>
                  <td className="px-4 py-3 text-slate-600">Instant (2 Mins)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-bold text-slate-800">Premium Swiss / German Implant (Nobel / Straumann)</td>
                  <td className="px-4 py-3 text-neutral-600">₹45,000 – ₹70,000</td>
                  <td className="px-4 py-3 text-emerald-600 font-bold">~₹4,100 / mo (12 mo)</td>
                  <td className="px-4 py-3 text-slate-600">Instant (2 Mins)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-bold text-slate-800">Full Mouth All-on-4 Dental Implants (Single Arch)</td>
                  <td className="px-4 py-3 text-neutral-600">₹1,80,000 – ₹3,20,000</td>
                  <td className="px-4 py-3 text-emerald-600 font-bold">~₹8,900 / mo (24 mo)</td>
                  <td className="px-4 py-3 text-slate-600">Same-Day Sanction</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-bold text-slate-800">Full Mouth All-on-6 Both Arches (Upper &amp; Lower)</td>
                  <td className="px-4 py-3 text-neutral-600">₹3,50,000 – ₹5,50,000</td>
                  <td className="px-4 py-3 text-emerald-600 font-bold">~₹14,500 / mo (24 mo)</td>
                  <td className="px-4 py-3 text-slate-600">Same-Day Sanction</td>
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
