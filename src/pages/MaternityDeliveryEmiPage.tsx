import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/seo/SEOHead';
import { ShieldCheck, CheckCircle2, ArrowRight, Calculator, Clock, CreditCard, Sparkles, Heart, Baby, HelpCircle } from 'lucide-react';
import { ReadingProgressBar } from '@/components/ReadingProgressBar';
import { PatientEligibilityModal } from '@/components/PatientEligibilityModal';

export default function MaternityDeliveryEmiPage() {
  const [loanAmount, setLoanAmount] = useState(85000);
  const [tenure, setTenure] = useState(12);
  const [isEligibilityOpen, setIsEligibilityOpen] = useState(false);

  // Interest calculation (~11.5% p.a.)
  const annualRate = 0.115;
  const monthlyRate = annualRate / 12;
  const emi = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
    (Math.pow(1 + monthlyRate, tenure) - 1)
  );

  const maternityLoanSchema = [
    {
      "@context": "https://schema.org",
      "@type": "FinancialProduct",
      "name": "Clinaza Maternity & Delivery Hospital Package EMI Financing",
      "description": "Instant point-of-care patient financing for normal deliveries, painless deliveries, and C-sections across boutique maternity hospitals in India.",
      "provider": {
        "@type": "Organization",
        "name": "Clinaza Technologies",
        "url": "https://www.clinaza.in"
      },
      "areaServed": "IN",
      "amount": {
        "@type": "MonetaryAmount",
        "currency": "INR",
        "minValue": 40000,
        "maxValue": 300000
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
      "name": "Maternity Delivery and Obstetric Care",
      "procedureType": "SurgicalProcedure",
      "bodyLocation": "Pelvis",
      "status": "Available"
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Can I use Clinaza alongside my corporate health insurance?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! If your corporate policy pays ₹40,000 towards your delivery, you can use Clinaza financing specifically for the remaining out-of-pocket balance (e.g. ₹60,000) so you pay zero cash on discharge day."
          }
        },
        {
          "@type": "Question",
          "name": "What documents are required to approve maternity EMI?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Only your PAN card, Aadhaar-linked OTP verification, and 3 months digital bank statement. No physical paperwork, collateral, or medical history underwriting required."
          }
        },
        {
          "@type": "Question",
          "name": "Can the father or family member apply on behalf of the mother?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Either the mother, father, or a direct family member with salaried or business income can be the primary applicant."
          }
        },
        {
          "@type": "Question",
          "name": "Does this cover sudden emergency C-sections?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Our digital desk operates 24/7 with instant pre-approvals in under 2 minutes, ensuring zero delays during unplanned surgeries or room shifts."
          }
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <ReadingProgressBar />
      <SEOHead
        title="Maternity Hospital Packages on EMI | Normal & C-Section Delivery Loan (2026)"
        description="Welcome your baby without cash stress at discharge. Finance normal delivery, painless epidural, and C-section packages at boutique maternity hospitals with flexible EMIs starting from ~11.5% p.a."
        keywords={[
          'maternity package on emi',
          'delivery hospital package emi',
          'c section delivery on emi',
          'normal delivery on emi',
          'cloudnine delivery emi',
          'motherhood hospital delivery loan',
          'pregnancy hospital bill emi',
          'painless delivery financing india'
        ]}
        canonicalUrl="https://www.clinaza.in/maternity-delivery-on-emi"
        jsonLd={maternityLoanSchema}
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
              <span className="ml-1.5 hidden rounded bg-pink-100 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-pink-700 sm:inline-block">
                MATERNITY FINANCING
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
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-pink-50/60 via-white to-slate-50 py-12 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-700 mb-6">
                <Baby className="h-3.5 w-3.5" />
                <span>Zero Discharge Day Financial Stress</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-[1.15]">
                Welcome Your Baby Without <span className="text-[#0867E8]">Discharge Bill Anxiety</span>.
              </h1>
              <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                Corporate insurance caps maternity sub-limits at ₹35,000–₹50,000 while boutique delivery packages range from ₹70,000 to ₹1,60,000. Clinaza bridges the gap with paperless monthly EMIs starting from ~11.5% p.a.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-600 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Covers Normal & C-Section</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Room Upgrades & NICU Backup</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Zero Physical Paperwork</span>
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
                    <div className="rounded-lg bg-pink-100 p-2 text-pink-700">
                      <Heart className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Boutique Maternity Coverage</h3>
                      <p className="text-xs text-slate-500">Cloudnine, Motherhood, Apollo Cradle & More</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                    Instant Approval
                  </span>
                </div>

                <div className="mt-5 space-y-3.5 text-xs">
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                    <span className="text-slate-500">Normal / Painless Delivery Package</span>
                    <span className="font-bold text-slate-900">₹65,000 – ₹95,000</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                    <span className="text-slate-500">Cesarean (C-Section) LSCS Package</span>
                    <span className="font-bold text-slate-900">₹90,000 – ₹1,65,000</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                    <span className="text-slate-500">Standard Corporate Mediclaim Limit</span>
                    <span className="font-semibold text-rose-600">Max ₹35,000 – ₹50,000</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5">
                    <span className="font-semibold text-slate-900">Clinaza Out-of-Pocket Bridge EMI</span>
                    <span className="font-bold text-[#0867E8]">From ₹2,450 / month</span>
                  </div>
                </div>

                <div className="mt-6 rounded-xl bg-slate-50 p-3.5 text-[11px] text-slate-600 border border-slate-200/80">
                  <p className="flex items-start gap-2">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                    <span>Disbursed directly to partner hospital billing counters. No hidden upfront charges or pre-closure penalties.</span>
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
              Interactive Maternity EMI Calculator
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Customize your financing amount based on your hospital package and choose a comfortable monthly tenure.
            </p>
          </div>

          <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-10 shadow-sm">
            <div className="grid gap-8 md:grid-cols-12 md:items-center">
              <div className="md:col-span-7 space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Hospital Package Amount
                    </label>
                    <span className="text-lg font-black text-[#0867E8]">
                      ₹{loanAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={40000}
                    max={250000}
                    step={5000}
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0867E8]"
                  />
                  <div className="flex justify-between text-[11px] text-slate-600 mt-1">
                    <span>₹40,000</span>
                    <span>₹1,50,000</span>
                    <span>₹2,50,000</span>
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

      {/* Package Comparison Table */}
      <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Maternity Packages & Typical Hospital Expenses in India
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Understanding where maternity costs go and why corporate insurance rarely covers the entire bill.
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-100/75 border-b border-slate-200 text-slate-700">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6 font-bold">Delivery Package Type</th>
                    <th className="py-3.5 px-4 font-bold">Hospital Inclusions</th>
                    <th className="py-3.5 px-4 font-bold">Average Metro Cost</th>
                    <th className="py-3.5 px-4 sm:px-6 font-bold text-right">Clinaza EMI (12 Mo)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  <tr>
                    <td className="py-4 px-4 sm:px-6 font-bold text-slate-900">
                      Normal Vaginal Delivery
                    </td>
                    <td className="py-4 px-4">2-day stay, labor room charges, basic pediatrician review, nursing fees</td>
                    <td className="py-4 px-4 font-bold text-slate-900">₹65,000 – ₹85,000</td>
                    <td className="py-4 px-4 sm:px-6 font-bold text-[#0867E8] text-right">~₹6,150 / mo</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 sm:px-6 font-bold text-slate-900">
                      Painless Delivery (with Epidural)
                    </td>
                    <td className="py-4 px-4">Normal delivery + epidural analgesia anesthesia, fetal heart monitoring</td>
                    <td className="py-4 px-4 font-bold text-slate-900">₹80,000 – ₹1,05,000</td>
                    <td className="py-4 px-4 sm:px-6 font-bold text-[#0867E8] text-right">~₹7,450 / mo</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 sm:px-6 font-bold text-slate-900">
                      Planned / Emergency C-Section (LSCS)
                    </td>
                    <td className="py-4 px-4">3-4 day stay, OT charges, surgical team, post-op medications, neonatologist</td>
                    <td className="py-4 px-4 font-bold text-slate-900">₹1,10,000 – ₹1,65,000</td>
                    <td className="py-4 px-4 sm:px-6 font-bold text-[#0867E8] text-right">~₹10,500 / mo</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 sm:px-6 font-bold text-slate-900">
                      High-Risk / Twin Delivery Package
                    </td>
                    <td className="py-4 px-4">Specialized obstetrics, dual pediatric standby, advanced fetal diagnostics</td>
                    <td className="py-4 px-4 font-bold text-slate-900">₹1,50,000 – ₹2,40,000</td>
                    <td className="py-4 px-4 sm:px-6 font-bold text-[#0867E8] text-right">~₹14,200 / mo</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Why Insurance Falls Short */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid gap-10 md:grid-cols-2 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-pink-700">The Healthcare Insurance Gap</span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-black text-slate-900">
                Why Do Families Face Unexpected Cash Demand at Hospital Discharge?
              </h2>
              <div className="mt-6 space-y-4 text-sm text-slate-600 leading-relaxed">
                <p>
                  <strong>1. Corporate Sub-Limits:</strong> Most corporate group mediclaim policies cap maternity coverage between ₹35,000 and ₹50,000. When your delivery bill touches ₹1,20,000, you have to settle ₹70,000+ out of pocket.
                </p>
                <p>
                  <strong>2. Retail Insurance Waiting Periods:</strong> Individual health insurance plans usually mandate a 2 to 4 year waiting period before maternity claims are accepted, making them useless for active pregnancies.
                </p>
                <p>
                  <strong>3. Excluded Hospital Consumables:</strong> Epidural kits, newborn screening, nursery room charges, and disposable surgical trays are routinely rejected as non-medical items by insurance TPAs.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8 space-y-4">
              <h3 className="font-bold text-slate-900 text-base">How Clinaza Solves This:</h3>
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex gap-3">
                  <div className="rounded-full bg-emerald-100 p-1 text-emerald-700 shrink-0 h-6 w-6 flex items-center justify-center font-bold">1</div>
                  <p className="text-slate-700"><strong>Direct Counter Settlement:</strong> We settle the copay or full package directly with the hospital desk so you can focus on your newborn.</p>
                </div>
                <div className="flex gap-3">
                  <div className="rounded-full bg-emerald-100 p-1 text-emerald-700 shrink-0 h-6 w-6 flex items-center justify-center font-bold">2</div>
                  <p className="text-slate-700"><strong>Zero Waiting Periods:</strong> Instant digital underwriting via PAN and net-banking statement in 2 minutes.</p>
                </div>
                <div className="flex gap-3">
                  <div className="rounded-full bg-emerald-100 p-1 text-emerald-700 shrink-0 h-6 w-6 flex items-center justify-center font-bold">3</div>
                  <p className="text-slate-700"><strong>Flexible 6 to 18 Month Tenures:</strong> Split a ₹90,000 delivery bill into smooth ₹8,000 monthly chunks starting ~11.5% p.a.</p>
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
              Everything expecting parents need to know about maternity hospital financing.
            </p>
          </div>

          <div className="mt-10 space-y-4">
            {[
              {
                q: "Can I use Clinaza alongside my corporate health insurance?",
                a: "Yes! If your corporate policy pays ₹40,000 towards your delivery, you can use Clinaza financing specifically for the remaining out-of-pocket balance (e.g. ₹60,000) so you pay zero cash on discharge day."
              },
              {
                q: "What documents are required to approve maternity EMI?",
                a: "Only your PAN card, Aadhaar-linked OTP verification, and 3 months digital bank statement. No physical paperwork, collateral, or medical history underwriting required."
              },
              {
                q: "Can the father or family member apply on behalf of the mother?",
                a: "Yes. Either the mother, father, or a direct family member with salaried or business income can be the primary applicant."
              },
              {
                q: "Does this cover sudden emergency C-sections?",
                a: "Yes. Our digital desk operates 24/7 with instant pre-approvals in under 2 minutes, ensuring zero delays during unplanned surgeries or room shifts."
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
              Give Your Child the Best Care Without Financial Stress
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
        defaultTreatment="Maternity & Normal / C-Section Delivery"
      />
    </div>
  );
}
