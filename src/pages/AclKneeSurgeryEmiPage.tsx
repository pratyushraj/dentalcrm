import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/seo/SEOHead';
import { ShieldCheck, CheckCircle2, ArrowRight, Calculator, Clock, CreditCard, Sparkles, Activity, Dumbbell, HelpCircle } from 'lucide-react';
import { ReadingProgressBar } from '@/components/ReadingProgressBar';
import { PatientEligibilityModal } from '@/components/PatientEligibilityModal';

export default function AclKneeSurgeryEmiPage() {
  const [loanAmount, setLoanAmount] = useState(90000);
  const [tenure, setTenure] = useState(12);
  const [isEligibilityOpen, setIsEligibilityOpen] = useState(false);

  // Interest calculation (~11.5% p.a.)
  const annualRate = 0.115;
  const monthlyRate = annualRate / 12;
  const emi = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
    (Math.pow(1 + monthlyRate, tenure) - 1)
  );

  const orthoLoanSchema = [
    {
      "@context": "https://schema.org",
      "@type": "FinancialProduct",
      "name": "Clinaza ACL Knee Surgery & Arthroscopy EMI Financing",
      "description": "Instant point-of-care patient financing for arthroscopic ACL reconstruction, meniscus tear repair, and sports orthopedic surgeries across accredited hospitals in India.",
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
      "name": "Arthroscopic Anterior Cruciate Ligament (ACL) Reconstruction",
      "procedureType": "SurgicalProcedure",
      "bodyLocation": "Knee Joint",
      "status": "Available"
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Can I use Clinaza if my mediclaim rejected my sports injury claim?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. Many patients turn to Clinaza after facing cashless rejection due to alleged pre-existing conditions or sports clauses. We approve your loan in 2 minutes so your surgery can proceed without delay."
          }
        },
        {
          "@type": "Question",
          "name": "Does this financing cover meniscus repair and shoulder arthroscopy too?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Our sports orthopedic financing covers ACL, PCL, MCL, meniscus root repairs, shoulder Bankart repairs, and rotator cuff tear reconstructions."
          }
        },
        {
          "@type": "Question",
          "name": "What is the repayment tenure and interest rate?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Tenures range from 6 to 18 months, with indicative interest rates starting from ~11.5% p.a. via our network of RBI-regulated NBFC partners."
          }
        },
        {
          "@type": "Question",
          "name": "Can my family member apply for me if I am a student or athlete?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Any immediate earning family member (parent, spouse, sibling) can apply as the primary applicant to finance your procedure."
          }
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <ReadingProgressBar />
      <SEOHead
        title="ACL Knee Surgery & Arthroscopy on EMI | Sports Injury Loan (2026)"
        description="Return to sports and active mobility without upfront hospital bills. Finance arthroscopic ACL reconstruction, meniscus repair, and implants with flexible EMIs starting from ~11.5% p.a."
        keywords={[
          'acl knee surgery on emi',
          'knee arthroscopy on emi',
          'acl reconstruction loan india',
          'meniscus repair surgery emi',
          'sports injury surgery financing',
          'shoulder arthroscopy emi',
          'knee ligament surgery cost on emi',
          'orthopedic surgery loan'
        ]}
        canonicalUrl="https://www.clinaza.in/acl-knee-surgery-on-emi"
        jsonLd={orthoLoanSchema}
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
              <span className="ml-1.5 hidden rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-indigo-800 sm:inline-block">
                SPORTS ORTHOPEDICS
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
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-indigo-50/50 via-white to-slate-50 py-12 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-800 mb-6">
                <Dumbbell className="h-3.5 w-3.5" />
                <span>Return to Active Life & Sports</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-[1.15]">
                Get Back on Your Feet Without <span className="text-[#0867E8]">Upfront Surgery Burden</span>.
              </h1>
              <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                Ligament tears cannot wait without risking permanent cartilage degeneration. Keyhole arthroscopic ACL reconstruction and meniscus repairs are now accessible in flexible monthly EMIs starting from ~11.5% p.a.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-600 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Keyhole Arthroscopy (Minimal Scars)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Covers PEEK / Bio-absorbable Screws</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Rehabilitation & Physio Financing</span>
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
                    <div className="rounded-lg bg-indigo-100 p-2 text-indigo-800">
                      <Activity className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Arthroscopic Surgery Desk</h3>
                      <p className="text-xs text-slate-500">ACL, PCL, Meniscus & Rotator Cuff</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                    Same-Day Pre-Approval
                  </span>
                </div>

                <div className="mt-5 space-y-3.5 text-xs">
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                    <span className="text-slate-500">Arthroscopic ACL Reconstruction</span>
                    <span className="font-bold text-slate-900">₹75,000 – ₹1,30,000</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                    <span className="text-slate-500">ACL + Meniscus Root Repair</span>
                    <span className="font-bold text-slate-900">₹1,10,000 – ₹1,75,000</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                    <span className="text-slate-500">Shoulder Bankart / Cuff Repair</span>
                    <span className="font-bold text-slate-900">₹85,000 – ₹1,50,000</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5">
                    <span className="font-semibold text-slate-900">Clinaza Monthly EMI (12 Mo)</span>
                    <span className="font-bold text-[#0867E8]">Starting ~₹4,200 / month</span>
                  </div>
                </div>

                <div className="mt-6 rounded-xl bg-slate-50 p-3.5 text-[11px] text-slate-600 border border-slate-200/80">
                  <p className="flex items-start gap-2">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                    <span>Direct settlement with partner orthopedic surgical centers. Covers premium bio-absorbable implants, radiofrequency wands, and post-op braces.</span>
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
              Orthopedic Surgery EMI Calculator
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Estimate your monthly payments for keyhole arthroscopy and ligament repairs based on procedure cost and tenure.
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

      {/* Procedure Breakdown Table */}
      <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Arthroscopic Sports Surgeries Compared
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Modern keyhole arthroscopy uses miniature high-definition cameras to repair joints with tiny puncture incisions.
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-100/75 border-b border-slate-200 text-slate-700">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6 font-bold">Procedure Type</th>
                    <th className="py-3.5 px-4 font-bold">Indications & Fixation</th>
                    <th className="py-3.5 px-4 font-bold">Average Hospital Cost</th>
                    <th className="py-3.5 px-4 sm:px-6 font-bold text-right">Clinaza EMI (12 Mo)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  <tr>
                    <td className="py-4 px-4 sm:px-6 font-bold text-slate-900">
                      Isolated ACL Reconstruction
                    </td>
                    <td className="py-4 px-4">Complete ACL tear, hamstring or peroneus longus autograft with endobutton fixation</td>
                    <td className="py-4 px-4 font-bold text-slate-900">₹75,000 – ₹1,25,000</td>
                    <td className="py-4 px-4 sm:px-6 font-bold text-[#0867E8] text-right">~₹7,100 / mo</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 sm:px-6 font-bold text-slate-900">
                      ACL + Meniscus Repair
                    </td>
                    <td className="py-4 px-4">Combined ACL tear and bucket-handle meniscus tear, all-inside FasT-Fix sutures</td>
                    <td className="py-4 px-4 font-bold text-slate-900">₹1,10,000 – ₹1,70,000</td>
                    <td className="py-4 px-4 sm:px-6 font-bold text-[#0867E8] text-right">~₹10,500 / mo</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 sm:px-6 font-bold text-slate-900">
                      Multi-Ligament (ACL + PCL)
                    </td>
                    <td className="py-4 px-4">Severe joint dislocation or high-velocity accident, dual tunnel reconstructive work</td>
                    <td className="py-4 px-4 font-bold text-slate-900">₹1,60,000 – ₹2,50,000</td>
                    <td className="py-4 px-4 sm:px-6 font-bold text-[#0867E8] text-right">~₹15,200 / mo</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 sm:px-6 font-bold text-slate-900">
                      Shoulder Bankart / Rotator Cuff
                    </td>
                    <td className="py-4 px-4">Recurrent shoulder dislocation, labral tears, suture anchor fixation</td>
                    <td className="py-4 px-4 font-bold text-slate-900">₹85,000 – ₹1,45,000</td>
                    <td className="py-4 px-4 sm:px-6 font-bold text-[#0867E8] text-right">~₹8,100 / mo</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Why Insurance Deductions Hurt in Sports Surgery */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid gap-10 md:grid-cols-2 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">The Sports Coverage Dilemma</span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-black text-slate-900">
                Why Are Ligament Injuries Frequently Contested by Health Insurers?
              </h2>
              <div className="mt-6 space-y-4 text-sm text-slate-600 leading-relaxed">
                <p>
                  <strong>1. Pre-Existing Condition Allegations:</strong> Many patients suffer a twist or minor tear months before seeking an MRI. TPAs frequently claim the tear is an undeclared pre-existing disease (PED) and reject cashless authorization.
                </p>
                <p>
                  <strong>2. Premium Implant Co-Pay Caps:</strong> Modern bio-composite screws and all-inside meniscus devices carry higher unit costs that insurers cap, forcing patients to pay ₹30,000–₹50,000 in implant difference.
                </p>
                <p>
                  <strong>3. Uncovered Sports Rehabilitation:</strong> Surgery is only 50% of the battle. The crucial 3 to 6 months of specialized sports physiotherapy, functional knee braces, and return-to-play training are 100% excluded by health insurance policies.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8 space-y-4">
              <h3 className="font-bold text-slate-900 text-base">How Clinaza Solves This:</h3>
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex gap-3">
                  <div className="rounded-full bg-emerald-100 p-1 text-emerald-700 shrink-0 h-6 w-6 flex items-center justify-center font-bold">1</div>
                  <p className="text-slate-700"><strong>Zero Medical Underwriting Dispute:</strong> Approval is based strictly on your personal credit and income, not an insurer’s dispute over how or when you twisted your knee.</p>
                </div>
                <div className="flex gap-3">
                  <div className="rounded-full bg-emerald-100 p-1 text-emerald-700 shrink-0 h-6 w-6 flex items-center justify-center font-bold">2</div>
                  <p className="text-slate-700"><strong>Comprehensive Package Financing:</strong> Covers surgeon fees, hospital OT, premium implant screws, and post-op hinged knee braces in one unified loan.</p>
                </div>
                <div className="flex gap-3">
                  <div className="rounded-full bg-emerald-100 p-1 text-emerald-700 shrink-0 h-6 w-6 flex items-center justify-center font-bold">3</div>
                  <p className="text-slate-700"><strong>Flexible Tenures Up to 18 Months:</strong> Repay your procedure comfortably without draining personal savings or emergency funds.</p>
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
              Key questions about ACL reconstruction and arthroscopy surgery financing.
            </p>
          </div>

          <div className="mt-10 space-y-4">
            {[
              {
                q: "Can I use Clinaza if my mediclaim rejected my sports injury claim?",
                a: "Absolutely. Many patients turn to Clinaza after facing cashless rejection due to alleged pre-existing conditions or sports clauses. We approve your loan in 2 minutes so your surgery can proceed without delay."
              },
              {
                q: "Does this financing cover meniscus repair and shoulder arthroscopy too?",
                a: "Yes. Our sports orthopedic financing covers ACL, PCL, MCL, meniscus root repairs, shoulder Bankart repairs, and rotator cuff tear reconstructions."
              },
              {
                q: "What is the repayment tenure and interest rate?",
                a: "Tenures range from 6 to 18 months, with indicative interest rates starting from ~11.5% p.a. via our network of RBI-regulated NBFC partners."
              },
              {
                q: "Can my family member apply for me if I am a student or athlete?",
                a: "Yes. Any immediate earning family member (parent, spouse, sibling) can apply as the primary applicant to finance your procedure."
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
              Reclaim Your Mobility & Active Life Today
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
        defaultTreatment="Knee Arthroscopy & ACL Sports Surgery"
      />
    </div>
  );
}
