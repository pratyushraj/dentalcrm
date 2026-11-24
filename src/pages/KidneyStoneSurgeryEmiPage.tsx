import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/seo/SEOHead';
import { ShieldCheck, CheckCircle2, ArrowRight, Calculator, Clock, CreditCard, Sparkles, Zap, Activity, HelpCircle } from 'lucide-react';
import { ReadingProgressBar } from '@/components/ReadingProgressBar';
import { PatientEligibilityModal } from '@/components/PatientEligibilityModal';

export default function KidneyStoneSurgeryEmiPage() {
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

  const urologyLoanSchema = [
    {
      "@context": "https://schema.org",
      "@type": "FinancialProduct",
      "name": "Clinaza Kidney Stone Laser Surgery & Urology EMI Financing",
      "description": "Instant point-of-care patient financing for RIRS, Laser Lithotripsy, PCNL, and ZSR Circumcision across accredited urology surgical centers in India.",
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
        "maxValue": 200000
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
      "name": "Laser Lithotripsy and RIRS Kidney Stone Removal",
      "procedureType": "SurgicalProcedure",
      "bodyLocation": "Kidney and Urinary Tract",
      "status": "Available"
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is laser kidney stone surgery (RIRS) covered under insurance?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "While hospital room and surgeon charges are generally covered by health insurance, disposable laser fibers, ureteral access sheaths, and DJ stent removals are frequently rejected or capped under policy sub-limits. Clinaza finances the entire uncovered out-of-pocket amount."
          }
        },
        {
          "@type": "Question",
          "name": "What is the turnaround time for surgery loan approval?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our automated digital verification approves patients in less than 2 minutes. The hospital billing counter receives immediate credit confirmation, enabling same-day admission."
          }
        },
        {
          "@type": "Question",
          "name": "Can I get financing for ZSR circumcision?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. ZSR Circumcision (stapler circumcision) is widely financed on Clinaza with monthly EMIs starting around ~₹3,100 per month."
          }
        },
        {
          "@type": "Question",
          "name": "What documents do I need to submit?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Just your PAN card number and mobile OTP verification for bank statement review. No physical papers, collateral, or medical checkups required."
          }
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <ReadingProgressBar />
      <SEOHead
        title="Kidney Stone Laser Surgery & RIRS on EMI | Urology Financing (2026)"
        description="Get pain relief with advanced Laser Lithotripsy, RIRS, and ZSR Circumcision without upfront hospital bill stress. Flexible monthly EMIs starting from ~11.5% p.a."
        keywords={[
          'kidney stone laser surgery on emi',
          'rirs surgery cost emi',
          'laser lithotripsy on emi',
          'kidney stone operation loan india',
          'pcnl surgery on emi',
          'ursl laser treatment emi',
          'zsr circumcision on emi',
          'urology surgery financing'
        ]}
        canonicalUrl="https://www.clinaza.in/kidney-stone-laser-surgery-on-emi"
        jsonLd={urologyLoanSchema}
      />

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0867E8] font-bold text-white shadow-md shadow-blue-500/20">
              C
            </span>
            <div className="leading-tight">
              <span className="text-lg font-black tracking-tight text-slate-900">CLINAZA</span>
              <span className="ml-1.5 hidden rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-amber-800 sm:inline-block">
                UROLOGY FINANCING
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEligibilityOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0867E8] px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-blue-600 transition-colors"
            >
              <span>Check Pre-Approval</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-amber-50/50 via-white to-slate-50 py-12 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 mb-6">
                <Zap className="h-3.5 w-3.5" />
                <span>Daycare Laser Urological Care</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-[1.15]">
                Get Permanent Stone Relief Without <span className="text-[#0867E8]">Hospital Bill Shock</span>.
              </h1>
              <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                Acute renal colic cannot wait for paydays. High-precision RIRS, Holmium laser lithotripsy, and painless ZSR circumcision are now payable in smooth monthly EMIs starting from ~11.5% p.a.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-600 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>No Cut, No Scar Laser Options</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Same-Day 24-Hour Discharge</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Covers Laser Fibers & Stent Removal</span>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setIsEligibilityOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0867E8] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-600 transition-all hover:scale-[1.01]"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Check Instant Pre-Approval</span>
                </button>
                <a
                  href="#calculator"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Calculator className="h-4 w-4" />
                  <span>Calculate Monthly EMI</span>
                </a>
              </div>
            </div>

            {/* Hero Quick Badge Box */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-100">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="rounded-lg bg-amber-100 p-2 text-amber-800">
                      <Activity className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Advanced Laser Urology</h3>
                      <p className="text-xs text-slate-500">RIRS, URSL, PCNL & ZSR Stapler</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                    2-Min Paperless Check
                  </span>
                </div>

                <div className="mt-5 space-y-3.5 text-xs">
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                    <span className="text-slate-500">RIRS Flexible Ureteroscopy (Laser)</span>
                    <span className="font-bold text-slate-900">₹80,000 – ₹1,35,000</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                    <span className="text-slate-500">URSL (Ureteric Stone Laser Removal)</span>
                    <span className="font-bold text-slate-900">₹45,000 – ₹75,000</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                    <span className="text-slate-500">ZSR Circumcision (Painless Stapler)</span>
                    <span className="font-bold text-slate-900">₹30,000 – ₹55,000</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5">
                    <span className="font-semibold text-slate-900">Clinaza Monthly EMI (12 Mo)</span>
                    <span className="font-bold text-[#0867E8]">Starting ~₹3,200 / month</span>
                  </div>
                </div>

                <div className="mt-6 rounded-xl bg-slate-50 p-3.5 text-[11px] text-slate-600 border border-slate-200/80">
                  <p className="flex items-start gap-2">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                    <span>Direct settlement with partner urology centers. Covers expensive laser fiber consumables and DJ stent removal.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive EMI Calculator */}
      <section id="calculator" className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Urology Procedure EMI Calculator
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Estimate your monthly payments for laser stone removal or circumcision based on procedure cost and tenure.
            </p>
          </div>

          <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-10 shadow-sm">
            <div className="grid gap-8 md:grid-cols-12 md:items-center">
              <div className="md:col-span-7 space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Surgery Package Amount
                    </label>
                    <span className="text-lg font-black text-[#0867E8]">
                      ₹{loanAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={30000}
                    max={180000}
                    step={5000}
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0867E8]"
                  />
                  <div className="flex justify-between text-[11px] text-slate-600 mt-1">
                    <span>₹30,000</span>
                    <span>₹1,00,000</span>
                    <span>₹1,80,000</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Repayment Tenure (Months)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[6, 9, 12, 18].map((m) => (
                      <button
                        key={m}
                        onClick={() => setTenure(m)}
                        className={`py-2 text-xs sm:text-sm font-bold rounded-xl border transition-all ${
                          tenure === m
                            ? 'bg-[#0867E8] text-white border-[#0867E8] shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {m} Mo
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Calculator Output */}
              <div className="md:col-span-5 rounded-xl border border-blue-100 bg-white p-6 text-center shadow-md">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Estimated Monthly EMI
                </span>
                <div className="mt-2 text-3xl sm:text-4xl font-black text-slate-900">
                  ₹{emi.toLocaleString('en-IN')}
                  <span className="text-xs font-medium text-slate-500">/mo</span>
                </div>
                <div className="mt-4 border-t border-slate-100 pt-3 space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Financing Amount:</span>
                    <span className="font-semibold text-slate-900">₹{loanAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tenure:</span>
                    <span className="font-semibold text-slate-900">{tenure} Months</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Indicative APR:</span>
                    <span className="font-semibold text-emerald-600">~11.5% p.a.</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsEligibilityOpen(true)}
                  className="mt-6 w-full rounded-xl bg-[#0867E8] py-3 text-xs sm:text-sm font-bold text-white shadow hover:bg-blue-600 transition-colors"
                >
                  Apply in 2 Minutes
                </button>
                <p className="mt-2 text-[10px] text-slate-600">
                  Powered by RBI-regulated NBFC partners. Final APR determined by credit profile.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Procedure Breakdown Table */}
      <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Laser Kidney Stone & Urology Procedures Compared
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Modern minimally invasive urology allows zero open cuts and quick discharge within 24 hours.
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-100/75 border-b border-slate-200 text-slate-700">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6 font-bold">Procedure</th>
                    <th className="py-3.5 px-4 font-bold">Indications & Tech</th>
                    <th className="py-3.5 px-4 font-bold">Average Hospital Cost</th>
                    <th className="py-3.5 px-4 sm:px-6 font-bold text-right">Clinaza EMI (12 Mo)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  <tr>
                    <td className="py-4 px-4 sm:px-6 font-bold text-slate-900">
                      RIRS (Retrograde Intrarenal Laser)
                    </td>
                    <td className="py-4 px-4">Kidney stones up to 20mm, flexible scope, Holmium/Thulium laser dusting</td>
                    <td className="py-4 px-4 font-bold text-slate-900">₹85,000 – ₹1,35,000</td>
                    <td className="py-4 px-4 sm:px-6 font-bold text-[#0867E8] text-right">~₹8,050 / mo</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 sm:px-6 font-bold text-slate-900">
                      URSL (Laser Ureteroscopy)
                    </td>
                    <td className="py-4 px-4">Ureteric stones causing severe blockage, rigid/semi-rigid scope breakdown</td>
                    <td className="py-4 px-4 font-bold text-slate-900">₹45,000 – ₹70,000</td>
                    <td className="py-4 px-4 sm:px-6 font-bold text-[#0867E8] text-right">~₹4,250 / mo</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 sm:px-6 font-bold text-slate-900">
                      Mini-PCNL (Keyhole Surgery)
                    </td>
                    <td className="py-4 px-4">Large kidney stones &gt;20mm or staghorn calculi, micro-incision through back</td>
                    <td className="py-4 px-4 font-bold text-slate-900">₹95,000 – ₹1,55,000</td>
                    <td className="py-4 px-4 sm:px-6 font-bold text-[#0867E8] text-right">~₹9,100 / mo</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 sm:px-6 font-bold text-slate-900">
                      ZSR Circumcision (Stapler)
                    </td>
                    <td className="py-4 px-4">Phimosis, recurrent balanitis, stitchless disposable titanium circular stapler</td>
                    <td className="py-4 px-4 font-bold text-slate-900">₹32,000 – ₹52,000</td>
                    <td className="py-4 px-4 sm:px-6 font-bold text-[#0867E8] text-right">~₹3,100 / mo</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Why Insurance Deductions Hurt in Urology */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid gap-10 md:grid-cols-2 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Insurance Pitfalls</span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-black text-slate-900">
                Why Do Patients End Up Paying ₹25,000–₹50,000 Even With Health Insurance?
              </h2>
              <div className="mt-6 space-y-4 text-sm text-slate-600 leading-relaxed">
                <p>
                  <strong>1. Laser Fiber & Basket Consumables:</strong> Disposable Holmium laser fibers, ureteral access sheaths, and Nitinol stone baskets often cost ₹20,000+ and are routinely marked non-payable by TPAs.
                </p>
                <p>
                  <strong>2. DJ Stent Removal Dispute:</strong> A temporary stent inserted during RIRS must be pulled out after 14 days. Insurers frequently deny or heavily delay cashless approval for this subsequent daycare visit.
                </p>
                <p>
                  <strong>3. Daycare Cap Restrictions:</strong> Many standard policies impose stringent sub-limits (e.g. ₹40,000 cap) for specific daycare procedures, leaving patients with the remaining bill.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8 space-y-4">
              <h3 className="font-bold text-slate-900 text-base">The Clinaza Advantage:</h3>
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex gap-3">
                  <div className="rounded-full bg-emerald-100 p-1 text-emerald-700 shrink-0 h-6 w-6 flex items-center justify-center font-bold">1</div>
                  <p className="text-slate-700"><strong>Co-Pay & Out-of-Pocket Bridge:</strong> Finance only the uncovered portion or the entire hospital surgery with zero hassle.</p>
                </div>
                <div className="flex gap-3">
                  <div className="rounded-full bg-emerald-100 p-1 text-emerald-700 shrink-0 h-6 w-6 flex items-center justify-center font-bold">2</div>
                  <p className="text-slate-700"><strong>Immediate 24/7 Clearance:</strong> Avoid waiting 6 hours in the hospital lobby for TPA settlement discharge approvals.</p>
                </div>
                <div className="flex gap-3">
                  <div className="rounded-full bg-emerald-100 p-1 text-emerald-700 shrink-0 h-6 w-6 flex items-center justify-center font-bold">3</div>
                  <p className="text-slate-700"><strong>No Hidden Penalties:</strong> Transparent interest starting from ~11.5% p.a. with zero foreclosure charges after 3 months.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Key questions about kidney stone laser surgery financing.
            </p>
          </div>

          <div className="mt-10 space-y-4">
            {[
              {
                q: "Is laser kidney stone surgery (RIRS) covered under insurance?",
                a: "While hospital room and surgeon charges are generally covered by health insurance, disposable laser fibers, ureteral access sheaths, and DJ stent removals are frequently rejected or capped under policy sub-limits. Clinaza finances the entire uncovered out-of-pocket amount."
              },
              {
                q: "What is the turnaround time for surgery loan approval?",
                a: "Our automated digital verification approves patients in less than 2 minutes. The hospital billing counter receives immediate credit confirmation, enabling same-day admission."
              },
              {
                q: "Can I get financing for ZSR circumcision?",
                a: "Yes. ZSR Circumcision (stapler circumcision) is widely financed on Clinaza with monthly EMIs starting around ~₹3,100 per month."
              },
              {
                q: "What documents do I need to submit?",
                a: "Just your PAN card number and mobile OTP verification for bank statement review. No physical papers, collateral, or medical checkups required."
              }
            ].map((faq, idx) => (
              <div key={idx} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-[#0867E8] shrink-0" />
                  <span>{faq.q}</span>
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <div className="rounded-3xl bg-gradient-to-br from-[#0867E8] to-blue-700 p-8 sm:p-12 text-white shadow-xl shadow-blue-500/20">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Get Pain Relief Today with Instant Surgery EMI
            </h2>
            <p className="mt-3 text-sm sm:text-base text-blue-100 max-w-xl mx-auto">
              Check your pre-approved financing limit in 2 minutes. Paperless verification, zero collateral, and instant approval.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setIsEligibilityOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-[#0867E8] shadow-md hover:bg-blue-50 transition-colors"
              >
                <span>Check Pre-Approval Now</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-4 text-xs text-blue-200">
              Zero impact on your CIBIL score during pre-eligibility check.
            </p>
          </div>
        </div>
      </section>

      <PatientEligibilityModal
        isOpen={isEligibilityOpen}
        onClose={() => setIsEligibilityOpen(false)}
        defaultTreatment="Kidney Stone Laser & Urology Surgery"
      />
    </div>
  );
}
