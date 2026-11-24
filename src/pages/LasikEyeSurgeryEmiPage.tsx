import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/seo/SEOHead';
import { ShieldCheck, CheckCircle2, ArrowRight, Calculator, Clock, CreditCard, Sparkles, Building2, MapPin, Eye, Check, HelpCircle } from 'lucide-react';
import { ReadingProgressBar } from '@/components/ReadingProgressBar';
import { PatientEligibilityModal } from '@/components/PatientEligibilityModal';

export default function LasikEyeSurgeryEmiPage() {
  const [loanAmount, setLoanAmount] = useState(75000);
  const [tenure, setTenure] = useState(12);
  const [isEligibilityOpen, setIsEligibilityOpen] = useState(false);

  // Interest calculation (~11.5% p.a.)
  const annualRate = 0.115;
  const monthlyRate = annualRate / 12;
  const emi = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
    (Math.pow(1 + monthlyRate, tenure) - 1)
  );

  const lasikLoanSchema = [
    {
      "@context": "https://schema.org",
      "@type": "FinancialProduct",
      "name": "Clinaza LASIK & Contoura Vision Eye Surgery EMI Financing",
      "description": "Instant point-of-care patient financing for Blade-Free Femto-LASIK, Contoura Vision, and SMILE eye surgery across partner eye hospitals in India.",
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
      "name": "Laser-Assisted In Situ Keratomileusis (LASIK)",
      "procedureType": "https://schema.org/PercutaneousProcedure",
      "bodyLocation": "Eye",
      "relevantSpecialty": {
        "@type": "MedicalSpecialty",
        "name": "Ophthalmology"
      },
      "description": "Refractive corneal laser eye surgery for vision correction of myopia, hyperopia, and astigmatism using Femtosecond and Excimer laser platforms."
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Does health insurance cover LASIK eye surgery in India?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Under IRDAI regulations, retail health insurance (Mediclaim) excludes refractive surgery unless refractive power in either eye is -7.5 diopters or higher. Elective vision correction (-1D to -6D) is out-of-pocket, making Clinaza point-of-care EMI the preferred option."
          }
        },
        {
          "@type": "Question",
          "name": "Can I get LASIK eye surgery on EMI without a credit card (Cardless EMI)?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Cardless medical EMIs for vision correction are available across leading RBI-regulated NBFC partners and bank cardless networks using just your Aadhaar and PAN OTP with 2-minute instant digital verification."
          }
        },
        {
          "@type": "Question",
          "name": "What documents are needed to apply for a LASIK EMI loan?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Only your PAN card, Aadhaar card, and an active bank account with net banking/UPI autopay are needed. Approvals are completed digitally in 2 minutes at the hospital billing desk."
          }
        },
        {
          "@type": "Question",
          "name": "What are the interest rates and repayment tenures?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Interest rates range from ~1.0% to 1.5% per month (~11.5% to 15.0% p.a. reducing balance) through RBI-regulated lending partners, with repayment tenures of 3, 6, 9, 12, 18, and 24 months."
          }
        },
        {
          "@type": "Question",
          "name": "Can I foreclose or pay off my loan early?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Under RBI guidelines, retail personal loans carry flexible prepayment and foreclosure terms with zero or minimal charges depending on the regulated lending partner."
          }
        },
        {
          "@type": "Question",
          "name": "How do eye hospitals and refractive centres partner with Clinaza?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Ophthalmologists and eye hospitals can onboard at clinaza.in/clinic-onboarding to equip reception counters with Pine Labs Plural point-of-care financing, guaranteed T+1 current account payouts, and 0% hospital credit risk."
          }
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#0867E8] selection:text-white flex flex-col justify-between relative overflow-hidden">
      <ReadingProgressBar />
      <SEOHead
        title="LASIK Eye Surgery on EMI in India (From ₹2,900/mo) | Contoura & SMILE"
        description="Finance LASIK, Contoura Vision & SMILE eye surgery on easy monthly EMI in India. Instant 2-min digital approval from ~11.5% p.a. Across partner eye hospitals."
        keywords={[
          "lasik on emi",
          "lasik eye surgery on emi",
          "contoura vision on emi",
          "lasik loan india",
          "smile eye surgery emi",
          "laser eye surgery finance india",
          "lasik without insurance emi",
          "femto lasik cost emi"
        ]}
        canonicalUrl="https://www.clinaza.in/lasik-eye-surgery-on-emi"
        jsonLd={lasikLoanSchema}
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
                  EYE SURGERY EMI
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">Refractive Care Financing</span>
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
            <Eye size={14} className="text-[#0867E8]" />
            <span className="text-[#0B2450] font-bold">100% Spectacle Freedom on Easy EMI</span>
            <span className="text-slate-300 hidden sm:inline">&bull;</span>
            <span className="text-emerald-700 font-bold hidden sm:inline">13+ Regulated Lenders</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0B2450] leading-tight [text-wrap:balance]">
            LASIK &amp; Contoura Vision Eye Surgery on Flexible Monthly EMI
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed [text-wrap:pretty]">
            Say goodbye to spectacles and contact lenses without draining your savings. Finance Blade-Free Femto-LASIK, Topography-Guided Contoura Vision, and SMILE with instant 2-minute digital approval starting from ~11.5% p.a.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-3 text-xs font-bold">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800">
              <CheckCircle2 size={14} className="text-emerald-600" /> ₹30,000 to ₹1,50,000 Sanction
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
            How Does LASIK Eye Surgery EMI Work in India?
          </h2>
          <div className="bg-slate-50 border-l-4 border-[#0867E8] p-4 text-sm text-slate-800 leading-relaxed rounded-r-2xl">
            <p>
              <strong>A LASIK eye surgery EMI in India is a point-of-care medical loan allowing patients to divide elective laser vision correction costs into affordable monthly installments.</strong> Under standard IRDAI guidelines, retail Mediclaim health insurance policies exclude LASIK, Contoura Vision, and SMILE unless refractive error is extreme (greater than -7.5 diopters). Because over 90% of vision correction surgeries are out-of-pocket elective expenses, Clinaza provides instant digital front-desk financing between ₹30,000 and ₹1,50,000 with annual interest rates starting from ~11.5% via RBI-regulated NBFC partners. Approvals require zero paper documentation and are completed in under 2 minutes using Aadhaar and PAN at partner eye hospitals.
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
              LASIK &amp; Contoura Vision EMI Calculator
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
                  max={150000}
                  step={5000}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full accent-[#0867E8] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>₹30,000 (Basic LASIK)</span>
                  <span>₹75,000 (Contoura)</span>
                  <span>₹1,50,000 (SMILE Pro)</span>
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
                  Check Eye Surgery Pre-Approval →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 2026 Laser Eye Surgery Cost & EMI Table */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="space-y-2 border-b border-slate-100 pb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#0867E8] block">
              2026 REFRACTIVE LASER TECHNOLOGY BENCHMARKS
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              2026 LASIK Surgery Cost &amp; Monthly EMI Breakdown in India (Both Eyes)
            </h2>
            <p className="text-xs text-slate-500">
              Representative surgery charges and estimated 12-month installments at NABH-accredited laser eye centers.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-xs sm:text-sm">
              <thead className="bg-slate-50 font-bold text-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left">Laser Technology</th>
                  <th className="px-4 py-3 text-left">Procedure Type</th>
                  <th className="px-4 py-3 text-right">Avg Cost (Both Eyes)</th>
                  <th className="px-4 py-3 text-right text-[#0867E8]">12-Month EMI (~11.5%)</th>
                  <th className="px-4 py-3 text-center">Ideal For</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                <tr className="hover:bg-slate-50/50">
                  <td className="px-4 py-3.5 font-bold text-slate-900">Standard Microkeratome LASIK</td>
                  <td className="px-4 py-3 text-slate-600">Bladed corneal flap + Excimer laser</td>
                  <td className="px-4 py-3 text-right font-medium text-slate-800">₹30,000 – ₹45,000</td>
                  <td className="px-4 py-3 text-right font-black text-[#0867E8]">₹2,900 / mo</td>
                  <td className="px-4 py-3 text-center text-slate-500">Budget spectacle removal</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="px-4 py-3.5 font-bold text-slate-900">Blade-Free Femto-LASIK</td>
                  <td className="px-4 py-3 text-slate-600">All-laser flap creation (Femtosecond)</td>
                  <td className="px-4 py-3 text-right font-medium text-slate-800">₹45,000 – ₹70,000</td>
                  <td className="px-4 py-3 text-right font-black text-[#0867E8]">₹4,100 / mo</td>
                  <td className="px-4 py-3 text-center text-slate-500">Low-glare corneal precision</td>
                </tr>
                <tr className="hover:bg-slate-50/50 bg-blue-50/20">
                  <td className="px-4 py-3.5 font-bold text-slate-900">
                    <span className="flex items-center gap-1.5">
                      <Sparkles size={14} className="text-amber-500" />
                      Contoura Vision (Topography-Guided)
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">22,000 corneal elevation mapping</td>
                  <td className="px-4 py-3 text-right font-medium text-slate-800">₹75,000 – ₹1,10,000</td>
                  <td className="px-4 py-3 text-right font-black text-[#0867E8]">₹6,600 / mo</td>
                  <td className="px-4 py-3 text-center font-bold text-emerald-700">Night drivers &amp; HD vision</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="px-4 py-3.5 font-bold text-slate-900">Flapless SMILE / SMILE Pro</td>
                  <td className="px-4 py-3 text-slate-600">2mm keyhole incision, zero corneal flap</td>
                  <td className="px-4 py-3 text-right font-medium text-slate-800">₹95,000 – ₹1,40,000</td>
                  <td className="px-4 py-3 text-right font-black text-[#0867E8]">₹8,400 / mo</td>
                  <td className="px-4 py-3 text-center text-slate-500">Athletes, dry eyes, military</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="px-4 py-3.5 font-bold text-slate-900">ICL (Implantable Collamer Lens)</td>
                  <td className="px-4 py-3 text-slate-600">Phakic intraocular lens implantation</td>
                  <td className="px-4 py-3 text-right font-medium text-slate-800">₹1,20,000 – ₹1,80,000</td>
                  <td className="px-4 py-3 text-right font-black text-[#0867E8]">₹10,600 / mo</td>
                  <td className="px-4 py-3 text-center text-slate-500">High power (&gt; -8D) &amp; thin cornea</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Why Choose Clinaza for Laser Eye Surgery Financing */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0867E8] flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-bold text-slate-900">Zero Documentation Delay</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Paperless front-desk digital verification using your Aadhaar and PAN card with approvals in under 120 seconds.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="font-bold text-slate-900">Zero Insurance Rejection Friction</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bypass IRDAI refractive exclusion clauses and proceed with surgery today rather than battling claim rejections.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="font-bold text-slate-900">Top Eye Centers Nationwide</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Financing accepted across accredited ophthalmic hospital suites in 87+ Indian cities with direct T+1 hospital settlement.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <HelpCircle size={20} className="text-[#0867E8]" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Frequently Asked Questions About LASIK Financing
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <h3 className="font-bold text-sm text-slate-900">Does health insurance cover LASIK eye surgery in India?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Under IRDAI regulations, retail health insurance (Mediclaim) excludes refractive surgery unless refractive power in either eye is -7.5 diopters or higher. Elective vision correction (-1D to -6D) is out-of-pocket, making Clinaza point-of-care EMI the preferred option.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <h3 className="font-bold text-sm text-slate-900">Can I get LASIK eye surgery on EMI without a credit card (Cardless EMI)?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Yes. Cardless medical EMIs for vision correction are available across leading RBI-regulated NBFC partners and bank cardless networks using just your Aadhaar and PAN OTP with 2-minute instant digital verification.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <h3 className="font-bold text-sm text-slate-900">What documents are needed to apply for a LASIK EMI loan?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Only your PAN card, Aadhaar card, and an active bank account with net banking/UPI autopay are needed. Approvals are completed digitally in 2 minutes at the hospital billing desk.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <h3 className="font-bold text-sm text-slate-900">What are the interest rates and repayment tenures?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Interest rates range from ~1.0% to 1.5% per month (~11.5% to 15.0% p.a. reducing balance) through RBI-regulated lending partners, with repayment tenures of 3, 6, 9, 12, 18, and 24 months.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <h3 className="font-bold text-sm text-slate-900">Can I foreclose or pay off my loan early?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Yes. Under RBI guidelines, retail personal loans carry flexible prepayment and foreclosure terms with zero or minimal charges depending on the regulated lending partner.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <h3 className="font-bold text-sm text-slate-900">How do eye hospitals and refractive centres partner with Clinaza?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ophthalmologists and eye hospitals can onboard at clinaza.in/clinic-onboarding to equip reception counters with Pine Labs Plural point-of-care financing, guaranteed T+1 current account payouts, and 0% hospital credit risk.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="bg-gradient-to-r from-[#0B2450] to-[#0867E8] rounded-3xl p-8 sm:p-10 text-white text-center space-y-4 shadow-md">
          <span className="text-[11px] font-black uppercase tracking-widest text-blue-200">
            EXPERIENCE CRISP 20/20 VISION TODAY
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold max-w-xl mx-auto">
            Ready to Say Goodbye to Spectacles and Contact Lenses?
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
              Check EMI Eligibility Now →
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
        defaultTreatment="LASIK / Contoura Vision Eye Surgery"
      />
    </div>
  );
}
