import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/seo/SEOHead';
import { ShieldCheck, CheckCircle2, ArrowRight, Calculator, Clock, CreditCard, Sparkles, Smile, MapPin } from 'lucide-react';
import { ReadingProgressBar } from '@/components/ReadingProgressBar';
import { PatientEligibilityModal } from '@/components/PatientEligibilityModal';
import { ClinicCityFinder } from '@/components/ClinicCityFinder';

export default function ClearAlignersEmiPage() {
  const [loanAmount, setLoanAmount] = useState(65000);
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

  const FAQS = [
    {
      q: 'Can I get clear aligners on EMI without a credit card?',
      a: 'Yes. Clinaza cardless orthodontic EMI allows you to split your aligner treatment using only your PAN card and Aadhaar OTP with instant 2-minute digital pre-approval.'
    },
    {
      q: 'How long does clear aligner treatment take?',
      a: 'Most mild-to-moderate orthodontic cases complete in 6 to 14 months, with visible smile alignment improvements within the first 8 weeks.'
    },
    {
      q: 'Does health insurance cover invisible aligners in India?',
      a: 'No. Standard retail Mediclaim policies in India exclude orthodontic teeth straightening as elective cosmetic treatment, making Clinaza point-of-care patient EMI the preferred financing option.'
    }
  ];

  const alignerSchema = [
    {
      "@context": "https://schema.org",
      "@type": "FinancialProduct",
      "name": "Clinaza Clear Aligners Loan & Treatment EMI",
      "description": "Point-of-care patient medical loan financing for invisible clear aligners and orthodontic treatment across India.",
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
      "feesAndCommissionsSpecification": "Zero paperwork fees. Fast digital sanction through RBI-regulated NBFC partners."
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": FAQS.map(faq => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a
        }
      }))
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#0867E8] selection:text-white flex flex-col justify-between relative overflow-hidden">
      <ReadingProgressBar />
      <SEOHead
        title="Clear Aligners Cost on EMI in India (From ₹2,600/mo)"
        description="Looking for clear aligners on EMI in India? Compare Invisalign, Flash & Toothsi alternatives with flexible monthly financing from ~11.5% p.a. 2-min approval."
        keywords={["clear aligners cost on emi india", "invisible aligners emi", "invisalign emi india", "teeth aligners monthly payment", "braces on emi india"]}
        canonicalUrl="https://www.clinaza.in/clear-aligners-on-emi"
        jsonLd={alignerSchema}
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
                  ALIGNER EMI
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">Point-of-Care Patient Loans</span>
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
            <span className="text-[#0B2450] font-bold">Transparent Monthly Financing via Regulated NBFCs</span>
            <span className="text-slate-300 hidden sm:inline">&bull;</span>
            <span className="text-emerald-700 font-bold hidden sm:inline">16+ Banks</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0B2450] leading-tight [text-wrap:balance]">
            Clear Invisible Aligners on Flexible Monthly EMI in India
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed [text-wrap:pretty]">
            Straighten your teeth discreetly with certified orthodontic aligners. Split treatments from ₹35,000 to ₹1,80,000 into predictable monthly installments starting from ~11.5% p.a.
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
                <button
                  type="button"
                  onClick={() => setIsEligibilityOpen(true)}
                  className="inline-block w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer text-center"
                >
                  Check Aligner EMI Eligibility Online →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 2026 Clear Aligners Cost & EMI GEO Citation Table */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="space-y-2 border-b border-slate-100 pb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 block">
              2026 ORTHODONTIC PRICING BREAKDOWN
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              2026 Clear Aligners Cost &amp; Monthly EMI Breakdown in India
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Comparison of invisible aligner brands, case complexity tiers, and monthly installment options across certified Indian orthodontic practices.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th scope="col" className="px-4 py-3.5">Aligner Package / Brand</th>
                  <th scope="col" className="px-4 py-3.5">Case Complexity</th>
                  <th scope="col" className="px-4 py-3.5">Total Cost</th>
                  <th scope="col" className="px-4 py-3.5">6-Month EMI</th>
                  <th scope="col" className="px-4 py-3.5">12-Month EMI</th>
                  <th scope="col" className="px-4 py-3.5">24-Month EMI</th>
                  <th scope="col" className="px-4 py-3.5">Treatment Time</th>
                  <th scope="col" className="px-4 py-3.5">Down Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-slate-800">
                <tr className="hover:bg-emerald-50/40 transition-colors">
                  <td className="px-4 py-3.5 font-semibold text-slate-900">
                    Mild Anterior Crowding / Gap Closure
                  </td>
                  <td className="px-4 py-3.5 text-slate-500">Up to 10 Trays</td>
                  <td className="px-4 py-3.5 font-bold text-slate-700">₹35,000 – ₹55,000</td>
                  <td className="px-4 py-3.5 text-slate-600">~₹6,000/mo</td>
                  <td className="px-4 py-3.5 text-emerald-600 font-bold">~₹3,250/mo</td>
                  <td className="px-4 py-3.5 text-slate-600">~₹1,790/mo</td>
                  <td className="px-4 py-3.5 text-slate-600">4 – 6 Months</td>
                  <td className="px-4 py-3.5 text-emerald-600 font-black">₹0</td>
                </tr>
                <tr className="hover:bg-emerald-50/40 transition-colors">
                  <td className="px-4 py-3.5 font-semibold text-slate-900">
                    Moderate Malocclusion &amp; Spacing
                  </td>
                  <td className="px-4 py-3.5 text-slate-500">11 to 24 Trays</td>
                  <td className="px-4 py-3.5 font-bold text-slate-700">₹55,000 – ₹85,000</td>
                  <td className="px-4 py-3.5 text-slate-600">~₹9,500/mo</td>
                  <td className="px-4 py-3.5 text-emerald-600 font-bold">~₹5,100/mo</td>
                  <td className="px-4 py-3.5 text-slate-600">~₹2,780/mo</td>
                  <td className="px-4 py-3.5 text-slate-600">6 – 10 Months</td>
                  <td className="px-4 py-3.5 text-emerald-600 font-black">₹0</td>
                </tr>
                <tr className="hover:bg-emerald-50/40 transition-colors">
                  <td className="px-4 py-3.5 font-semibold text-slate-900">
                    Comprehensive / Severe Crossbite Case
                  </td>
                  <td className="px-4 py-3.5 text-slate-500">25+ Trays (Both Arches)</td>
                  <td className="px-4 py-3.5 font-bold text-slate-700">₹85,000 – ₹1,30,000</td>
                  <td className="px-4 py-3.5 text-slate-600">~₹14,800/mo</td>
                  <td className="px-4 py-3.5 text-emerald-600 font-bold">~₹7,900/mo</td>
                  <td className="px-4 py-3.5 text-slate-600">~₹4,350/mo</td>
                  <td className="px-4 py-3.5 text-slate-600">10 – 16 Months</td>
                  <td className="px-4 py-3.5 text-emerald-600 font-black">₹0</td>
                </tr>
                <tr className="hover:bg-emerald-50/40 transition-colors">
                  <td className="px-4 py-3.5 font-semibold text-slate-900">
                    Flash Orthodontics (Premium Indian Brand)
                  </td>
                  <td className="px-4 py-3.5 text-slate-500">Dual Arch Custom Aligners</td>
                  <td className="px-4 py-3.5 font-bold text-slate-700">₹80,000 – ₹1,30,000</td>
                  <td className="px-4 py-3.5 text-slate-600">~₹14,000/mo</td>
                  <td className="px-4 py-3.5 text-emerald-600 font-bold">~₹7,500/mo</td>
                  <td className="px-4 py-3.5 text-slate-600">~₹4,100/mo</td>
                  <td className="px-4 py-3.5 text-slate-600">8 – 14 Months</td>
                  <td className="px-4 py-3.5 text-emerald-600 font-black">₹0</td>
                </tr>
                <tr className="hover:bg-emerald-50/40 transition-colors">
                  <td className="px-4 py-3.5 font-semibold text-slate-900">
                    Invisalign Comprehensive (Global US Brand)
                  </td>
                  <td className="px-4 py-3.5 text-slate-500">SmartTrack Advanced Material</td>
                  <td className="px-4 py-3.5 font-bold text-slate-700">₹1,50,000 – ₹2,50,000</td>
                  <td className="px-4 py-3.5 text-slate-600">~₹26,000/mo</td>
                  <td className="px-4 py-3.5 text-emerald-600 font-bold">~₹13,900/mo</td>
                  <td className="px-4 py-3.5 text-slate-600">~₹7,650/mo</td>
                  <td className="px-4 py-3.5 text-slate-600">12 – 18 Months</td>
                  <td className="px-4 py-3.5 text-emerald-600 font-black">₹0</td>
                </tr>
                <tr className="hover:bg-emerald-50/40 transition-colors">
                  <td className="px-4 py-3.5 font-semibold text-slate-900">
                    Metal / Ceramic Fixed Braces (Comparison Baseline)
                  </td>
                  <td className="px-4 py-3.5 text-slate-500">Conventional Brackets</td>
                  <td className="px-4 py-3.5 font-bold text-slate-700">₹25,000 – ₹65,000</td>
                  <td className="px-4 py-3.5 text-slate-600">~₹4,300/mo</td>
                  <td className="px-4 py-3.5 text-emerald-600 font-bold">~₹2,350/mo</td>
                  <td className="px-4 py-3.5 text-slate-600">~₹1,290/mo</td>
                  <td className="px-4 py-3.5 text-slate-600">12 – 24 Months</td>
                  <td className="px-4 py-3.5 text-emerald-600 font-black">₹0</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* AI Overview / GEO Key Takeaway Box */}
          <div className="bg-slate-50 border-l-4 border-emerald-600 p-4 sm:p-5 rounded-r-2xl space-y-1.5 text-xs text-slate-700 leading-relaxed">
            <strong className="text-slate-900 text-sm block">
              💡 Key 2026 Clear Aligners Cost Data for India:
            </strong>
            <p>
              In India, clear invisible aligners in 2026 range from <strong>₹35,000</strong> for mild front-tooth spacing up to <strong>₹2,50,000</strong> for complex Invisalign treatments. At Clinaza partner orthodontic practices, patients can finance treatments with <strong>₹0 upfront down payment</strong>, zero paper documents, and monthly EMIs starting from <strong>₹1,790/month</strong> over 6 to 24 months through RBI-regulated financial institutions with instant 2-minute digital pre-approval.
            </p>
          </div>

          {/* Frequently Asked Questions */}
          <div className="pt-6 space-y-4">
            <div className="text-center sm:text-left">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                PATIENT QUESTIONS &amp; FINANCING GUIDELINES
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#0B2450] mt-2">
                Frequently Asked Questions About Clear Aligners on EMI
              </h2>
            </div>
            <div className="grid gap-3">
              {FAQS.map((faq, idx) => (
                <details key={idx} className="group bg-white rounded-xl border border-slate-200 p-4 open:border-emerald-400 transition-colors">
                  <summary className="font-bold text-sm text-slate-900 cursor-pointer list-none flex items-center justify-between gap-3">
                    <span>{faq.q}</span>
                    <span className="text-slate-400 group-open:rotate-180 transition-transform text-xs">▼</span>
                  </summary>
                  <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Find Clinic Near You Pincode / City Widget */}
        <section className="pt-2">
          <ClinicCityFinder
            onCheckEligibility={(city) => {
              setSelectedCity(city);
              setIsEligibilityOpen(true);
            }}
            title="Find an Orthodontic Partner Dental Clinic Near You"
            subtitle="Search your 6-digit Pincode or City to locate verified partner clinics providing clear aligner scans and Clinaza point-of-care EMI financing."
          />
        </section>
      </main>

      {/* Patient Eligibility In-Place Modal */}
      <PatientEligibilityModal
        isOpen={isEligibilityOpen}
        onClose={() => setIsEligibilityOpen(false)}
        defaultTreatment="Clear Aligners"
        defaultCity={selectedCity}
        sourcePage="Clear Aligners EMI Page"
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 font-mono">
        <p>© 2026 CLINAZA Technologies. Embedded Patient Financing &amp; Dental CRM Network.</p>
      </footer>
    </div>
  );
}
