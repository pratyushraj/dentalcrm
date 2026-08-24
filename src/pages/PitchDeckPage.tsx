import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Building2, 
  TrendingUp, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  Handshake, 
  Target, 
  ArrowRight,
  Download,
  Share2,
  CheckCircle2,
  FileText,
  Smartphone,
  ExternalLink
} from 'lucide-react';
import { SEOHead } from '@/components/seo/SEOHead';

export default function PitchDeckPage() {
  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = 10;
  const touchStartX = React.useRef<number | null>(null);

  const nextSlide = () => {
    if (currentSlide < totalSlides) setCurrentSlide(currentSlide + 1);
  };

  const prevSlide = () => {
    if (currentSlide > 1) setCurrentSlide(currentSlide - 1);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) {
      if (delta > 0) nextSlide();
      else prevSlide();
    }
    touchStartX.current = null;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col justify-between selection:bg-[#0867E8] selection:text-white">
      <SEOHead 
        title="Clinaza x Vrozart — Strategic Partnership Deck"
        description="Investor and Partnership Presentation for Clinaza Healthcare Financing Infrastructure"
        image="https://clinaza.in/deck-og.png"
      />

      {/* Top Bar Navigation */}
      <header className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-xl bg-gradient-to-tr from-[#0867E8] to-[#12A8A0] flex items-center justify-center font-black text-white text-xs shrink-0">
            C
          </div>
          <div>
            <h1 className="text-[11px] sm:text-xs font-black tracking-wider uppercase text-white leading-tight">CLINAZA <span className="text-slate-400 font-normal">| Deck</span></h1>
            <p className="text-[9px] sm:text-[10px] text-slate-400 font-mono hidden sm:block">Partner Presentation for Vrozart</p>
          </div>
        </div>

        {/* Mobile: slide counter pill */}
        <div className="flex sm:hidden items-center gap-2">
          <span className="px-3 py-1 bg-slate-800 text-xs font-mono text-slate-300 rounded-full">
            {currentSlide} / {totalSlides}
          </span>
        </div>

        {/* Desktop: Slide Indicators */}
        <div className="hidden sm:flex items-center gap-2">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx + 1)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === idx + 1 
                  ? 'w-8 bg-[#0867E8]' 
                  : 'w-2 bg-slate-700 hover:bg-slate-500'
              }`}
              title={`Slide ${idx + 1}`}
            />
          ))}
          <span className="ml-3 text-xs font-mono text-slate-400">
            {currentSlide} / {totalSlides}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => window.print()}
            className="px-2.5 sm:px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all"
          >
            <Download size={13} /> <span className="hidden sm:inline">Export PDF</span><span className="sm:hidden">PDF</span>
          </button>
        </div>
      </header>

      {/* Main Slide Viewer Canvas */}
      <main className="flex-1 flex items-center justify-center p-3 sm:p-8 max-w-6xl mx-auto w-full">
        {/* Mobile: responsive scrollable container | Desktop: fixed 16:9 canvas */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="w-full bg-white text-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl relative border border-slate-200 print:shadow-none print:w-full
                     aspect-auto min-h-[460px] sm:aspect-[16/9] sm:max-h-[720px] overflow-y-auto sm:overflow-hidden flex flex-col justify-between">
          
          {/* SLIDE 1: COVER */}
          {currentSlide === 1 && (
            <div className="h-full p-5 sm:p-14 flex flex-col justify-between bg-gradient-to-br from-white via-slate-50 to-blue-50/50 min-h-[460px] sm:min-h-0">
              <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-3 sm:gap-0">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-2xl bg-[#0867E8] flex items-center justify-center text-white font-black text-base sm:text-lg shadow-lg shadow-[#0867E8]/20">
                    C
                  </div>
                  <div>
                    <span className="text-lg sm:text-xl font-black tracking-tight text-[#0B2450] block">CLINAZA</span>
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[#0f7a75]">Healthcare Financing Layer</span>
                  </div>
                </div>
                <div className="px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-[10px] sm:text-[11px] font-mono font-bold text-[#0867E8]">
                  CONFIDENTIAL &middot; PARTNERSHIP DECK
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6 max-w-2xl my-6 sm:my-0">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0f7a75]/10 text-[#0f7a75] rounded-full text-[11px] sm:text-xs font-bold">
                  <span>Partnership Opportunity with Vrozart</span>
                </div>
                <h1 className="text-3xl sm:text-6xl font-black text-[#0B2450] tracking-tight leading-[1.1]">
                  EMI for <br />
                  <span className="bg-gradient-to-r from-[#0867E8] to-[#12A8A0] bg-clip-text text-transparent">
                    Better Health
                  </span>
                </h1>
                <p className="text-sm sm:text-lg text-slate-600 font-medium leading-relaxed">
                  Building the point-of-care financing infrastructure connecting dental clinics, patients, and regulated lenders across India.
                </p>
              </div>

              <div className="pt-6 border-t border-slate-200/80 flex justify-between items-center text-xs text-slate-500 font-medium">
                <div>Prepared for Senior Management & Leadership Team</div>
                <div className="font-mono text-[#0867E8] font-bold">VROZART &times; CLINAZA</div>
              </div>
            </div>
          )}

          {/* SLIDE 2: MARKET FRICTION / PROBLEM */}
          {currentSlide === 2 && (
            <div className="h-full p-5 sm:p-14 flex flex-col justify-between space-y-4 sm:space-y-0">
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-[#0867E8] uppercase tracking-widest">01 / MARKET FRICTION</span>
                <h2 className="text-3xl sm:text-4xl font-black text-[#0B2450]">The Healthcare Affordability Gap</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-auto">
                <div className="bg-slate-50 border border-slate-200/80 p-6 rounded-2xl space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
                    01
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Patients Defer Care</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Planned dental procedures (implants, aligners, full mouth rehabs) require ₹30,000 to ₹3,00,000 upfront, forcing patients to delay or cancel necessary treatments.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 p-6 rounded-2xl space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                    02
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Clinics Lose Conversions</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Doctors spend consultation time diagnosing, only to lose treatment acceptance at the front desk when patients cannot arrange lump-sum funds.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 p-6 rounded-2xl space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0867E8] flex items-center justify-center font-bold">
                    03
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Lenders Lack Distribution</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Banks & NBFCs have lending capital but lack point-of-care digital origination at the doctor's desk to acquire high-intent healthcare credit demand.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-xs text-[#0B2450] font-medium flex items-center justify-between">
                <span>Core Opportunity: High-ticket planned healthcare financing with point-of-care distribution.</span>
                <span className="font-mono text-[#0867E8] font-bold">Clinaza distribution layer</span>
              </div>
            </div>
          )}

          {/* SLIDE 3: CLINAZA SOLUTION */}
          {currentSlide === 3 && (
            <div className="h-full p-5 sm:p-14 flex flex-col justify-between space-y-4 sm:space-y-0">
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-[#0f7a75] uppercase tracking-widest">02 / OUR ARCHITECTURE</span>
                <h2 className="text-3xl sm:text-4xl font-black text-[#0B2450]">The Clinaza Operating Model</h2>
              </div>

              {/* Workflow Diagram */}
              <div className="my-auto space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[10px] font-mono text-slate-400 block font-bold">STEP 01</span>
                    <strong className="text-xs text-[#0B2450] block mt-1">Doctor Consultation</strong>
                    <span className="text-[10px] text-slate-500">Treatment Plan Created</span>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[10px] font-mono text-slate-400 block font-bold">STEP 02</span>
                    <strong className="text-xs text-[#0867E8] block mt-1">Clinaza Pre-Check</strong>
                    <span className="text-[10px] text-slate-500">2-Min Digital Eligibility</span>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[10px] font-mono text-slate-400 block font-bold">STEP 03</span>
                    <strong className="text-xs text-[#0f7a75] block mt-1">Lender API Underwriting</strong>
                    <span className="text-[10px] text-slate-500">Sanction & Agreement</span>
                  </div>

                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <span className="text-[10px] font-mono text-emerald-600 block font-bold">STEP 04</span>
                    <strong className="text-xs text-emerald-800 block mt-1">Disbursement & EMI</strong>
                    <span className="text-[10px] text-emerald-600">Treatment Starts Immediately</span>
                  </div>
                </div>

                <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                    <ShieldCheck size={16} /> Strict Operational Boundaries
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <strong>Clinaza is NOT a lender.</strong> We do not take credit risk or hold a balance sheet. Regulated lending partners (Banks/NBFCs) handle credit policy, underwriting, sanction, loan agreement, and servicing. Clinaza focuses purely on clinic network distribution, software infrastructure, and patient acquisition.
                  </p>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 font-mono flex justify-between">
                <span>Distribution & Platform: Clinaza</span>
                <span>Underwriting & Balance Sheet: Lending Partner</span>
              </div>
            </div>
          )}

          {/* SLIDE 4: TRACTION */}
          {currentSlide === 4 && (
            <div className="h-full p-8 sm:p-14 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-[#0867E8] uppercase tracking-widest">03 / EARLY VALIDATION</span>
                <h2 className="text-3xl sm:text-4xl font-black text-[#0B2450]">Current Network Traction</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-auto">
                <div className="p-6 bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-2xl text-center space-y-1">
                  <span className="text-4xl sm:text-5xl font-black text-[#0867E8] block">20+</span>
                  <span className="text-xs font-bold text-[#0B2450] block uppercase tracking-wider">Clinics Onboarded</span>
                  <span className="text-[10px] text-slate-500 block">Dental centers in network</span>
                </div>

                <div className="p-6 bg-gradient-to-br from-teal-50 to-white border border-teal-200 rounded-2xl text-center space-y-1">
                  <span className="text-4xl sm:text-5xl font-black text-[#0f7a75] block">Active</span>
                  <span className="text-xs font-bold text-[#0B2450] block uppercase tracking-wider">Network Growth</span>
                  <span className="text-[10px] text-slate-500 block">Expanding doctor network</span>
                </div>

                <div className="p-6 bg-gradient-to-br from-indigo-50 to-white border border-indigo-200 rounded-2xl text-center space-y-1">
                  <span className="text-3xl sm:text-4xl font-black text-indigo-600 block">Incoming</span>
                  <span className="text-xs font-bold text-[#0B2450] block uppercase tracking-wider">Patient Enquiries</span>
                  <span className="text-[10px] text-slate-500 block">Active loan requests</span>
                </div>

                <div className="p-6 bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl text-center space-y-1">
                  <span className="text-2xl sm:text-3xl font-black text-[#0B2450] block">₹30K–₹3L</span>
                  <span className="text-xs font-bold text-[#0B2450] block uppercase tracking-wider">Ticket Size</span>
                  <span className="text-[10px] text-slate-500 block">Planned dental treatments</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs text-slate-600">
                <div className="font-bold text-[#0B2450]">Initial Focus Vertical: Dental Care Procedures</div>
                <div className="text-[11px]">Primary use cases: Implants, clear aligners, ceramic braces, crowns, and full mouth rehabilitations.</div>
              </div>
            </div>
          )}

          {/* SLIDE 5: WHY THIS CAN SCALE */}
          {currentSlide === 5 && (
            <div className="h-full p-8 sm:p-14 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-[#0f7a75] uppercase tracking-widest">04 / FLYWHEEL</span>
                <h2 className="text-3xl sm:text-4xl font-black text-[#0B2450]">The Healthcare Distribution Flywheel</h2>
              </div>

              <div className="my-auto space-y-6">
                <div className="relative p-8 bg-slate-50 border border-slate-200 rounded-3xl overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-center items-center">
                    <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
                      <strong className="text-xs text-[#0B2450] block">More Clinics Onboarded</strong>
                    </div>

                    <div className="text-[#0867E8] font-bold text-center flex justify-center">→</div>

                    <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
                      <strong className="text-xs text-[#0867E8] block">More Patient EMI Requests</strong>
                    </div>

                    <div className="text-[#0867E8] font-bold text-center flex justify-center">→</div>

                    <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
                      <strong className="text-xs text-[#0f7a75] block">More Lender Approvals</strong>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2">
                    <h3 className="font-bold text-xs text-[#0B2450] uppercase tracking-wider">Point-of-Care Advantage</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Financing intent is captured inside the consultation room when the treatment decision is being made — yielding higher intent than generic personal loan channels.
                    </p>
                  </div>

                  <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2">
                    <h3 className="font-bold text-xs text-[#0B2450] uppercase tracking-wider">Scalable Distribution Layer</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Clinaza standardizes clinic onboarding and digital pre-checks, enabling lenders to tap thousands of doctors through a single integration.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 font-mono">
                Goal: Become India's leading distribution platform for healthcare financing.
              </div>
            </div>
          )}

          {/* SLIDE 6: WHAT CLINAZA NEEDS FROM VROZART */}
          {currentSlide === 6 && (
            <div className="h-full p-8 sm:p-14 flex flex-col justify-between bg-gradient-to-br from-slate-900 to-[#0B2450] text-white">
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-[#12A8A0] uppercase tracking-widest">05 / STRATEGIC ALIGNMENT</span>
                <h2 className="text-3xl sm:text-4xl font-black text-white">What We Are Seeking from Vrozart</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-auto">
                {[
                  { title: 'Lending Partner Access', desc: 'Introductions to Banks, NBFCs & capital partners for ₹30K–₹3L ticket sizes.' },
                  { title: 'Suitable Credit Products', desc: 'Structuring personal loan / healthcare EMI products fitting patient profiles.' },
                  { title: 'API & Tech Infrastructure', desc: 'Co-building or leveraging existing embedded finance APIs.' },
                  { title: 'Underwriting Guidance', desc: 'Expertise on credit policy, bureau checks & risk boundaries.' },
                  { title: 'Compliance & Workflow', desc: 'Guidance on digital lending compliance (LSP / FLDG / RBI rules).' },
                  { title: 'Strategic Mentorship', desc: 'Founder guidance on scaling a regulated lending ecosystem.' },
                ].map((item, idx) => (
                  <div key={idx} className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-2 hover:border-[#12A8A0] transition-all">
                    <div className="text-xs font-black text-[#12A8A0] uppercase tracking-wider flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#12A8A0]"></span>
                      {item.title}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-white/10 border border-white/15 rounded-xl text-xs text-slate-200 flex justify-between items-center">
                <span><strong>Core Synergy:</strong> "Clinaza brings distribution and healthcare demand. Vrozart helps build the lending layer."</span>
                <span className="text-[#12A8A0] font-mono font-bold">Strategic Win-Win</span>
              </div>
            </div>
          )}

          {/* SLIDE 7: TECHNOLOGY & API ARCHITECTURE */}
          {currentSlide === 7 && (
            <div className="h-full p-8 sm:p-14 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-[#0867E8] uppercase tracking-widest">06 / TECH CAPABILITY</span>
                <h2 className="text-3xl sm:text-4xl font-black text-[#0B2450]">Developer-Led Integration Stack</h2>
              </div>

              <div className="my-auto space-y-6">
                <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
                  Clinaza is developer-led. We can seamlessly integrate via REST APIs, webhooks, or SDKs to connect clinic front-desks directly into a lender's underwriting engine.
                </p>

                {/* Architecture Flowchart */}
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                  <div className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider text-center">
                    PROPOSED EMBEDDED INTEGRATION ARCHITECTURE
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center text-xs">
                    <div className="p-3 bg-white border border-slate-200 rounded-xl font-bold text-[#0B2450]">
                      Clinic / Patient Application
                    </div>
                    <div className="p-3 bg-white border border-slate-200 rounded-xl font-bold text-[#0867E8]">
                      KYC & Consent
                    </div>
                    <div className="p-3 bg-white border border-slate-200 rounded-xl font-bold text-[#0f7a75]">
                      Lender API Engine
                    </div>
                    <div className="p-3 bg-white border border-slate-200 rounded-xl font-bold text-indigo-600">
                      Bureau & Sanction
                    </div>
                    <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl font-bold text-emerald-800">
                      eSign & Disbursement
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
                    <strong className="text-[#0867E8] block mb-1">Flexibility</strong>
                    <span className="text-slate-600">Ready to integrate with custom REST endpoints or third-party LOS/LMS platforms.</span>
                  </div>
                  <div className="p-4 bg-teal-50/50 border border-teal-100 rounded-xl">
                    <strong className="text-[#0f7a75] block mb-1">Status Sync</strong>
                    <span className="text-slate-600">Real-time webhook updates back to clinics for seamless doctor & patient experience.</span>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 font-mono">
                *Proposed integration workflow. Ready to adapt based on lender technical stack.
              </div>
            </div>
          )}

          {/* SLIDE 8: PARTNERSHIP MODEL */}
          {currentSlide === 8 && (
            <div className="h-full p-8 sm:p-14 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-[#0867E8] uppercase tracking-widest">07 / OPERATIONAL SPLIT</span>
                <h2 className="text-3xl sm:text-4xl font-black text-[#0B2450]">Clear Responsibility Division</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-auto">
                <div className="p-5 bg-blue-50/40 border border-blue-200 rounded-2xl space-y-3">
                  <div className="text-xs font-black text-[#0867E8] uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 size={16} /> CLINAZA ROLE
                  </div>
                  <ul className="space-y-2 text-xs text-slate-600">
                    <li className="flex items-start gap-1.5"><CheckCircle2 size={14} className="text-[#0867E8] shrink-0 mt-0.5" /> 20+ clinic network growth</li>
                    <li className="flex items-start gap-1.5"><CheckCircle2 size={14} className="text-[#0867E8] shrink-0 mt-0.5" /> Clinic onboarding & support</li>
                    <li className="flex items-start gap-1.5"><CheckCircle2 size={14} className="text-[#0867E8] shrink-0 mt-0.5" /> Patient application journey</li>
                    <li className="flex items-start gap-1.5"><CheckCircle2 size={14} className="text-[#0867E8] shrink-0 mt-0.5" /> Technical API integration</li>
                  </ul>
                </div>

                <div className="p-5 bg-teal-50/40 border border-teal-200 rounded-2xl space-y-3">
                  <div className="text-xs font-black text-[#0f7a75] uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck size={16} /> LENDING PARTNER
                  </div>
                  <ul className="space-y-2 text-xs text-slate-600">
                    <li className="flex items-start gap-1.5"><CheckCircle2 size={14} className="text-[#0f7a75] shrink-0 mt-0.5" /> Credit policy & underwriting</li>
                    <li className="flex items-start gap-1.5"><CheckCircle2 size={14} className="text-[#0f7a75] shrink-0 mt-0.5" /> Bureau check & loan approval</li>
                    <li className="flex items-start gap-1.5"><CheckCircle2 size={14} className="text-[#0f7a75] shrink-0 mt-0.5" /> Sanction & loan agreement</li>
                    <li className="flex items-start gap-1.5"><CheckCircle2 size={14} className="text-[#0f7a75] shrink-0 mt-0.5" /> Disbursement & EMI servicing</li>
                  </ul>
                </div>

                <div className="p-5 bg-indigo-50/40 border border-indigo-200 rounded-2xl space-y-3">
                  <div className="text-xs font-black text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Handshake size={16} /> VROZART PARTNER
                  </div>
                  <ul className="space-y-2 text-xs text-slate-600">
                    <li className="flex items-start gap-1.5"><CheckCircle2 size={14} className="text-indigo-600 shrink-0 mt-0.5" /> Lender introductions</li>
                    <li className="flex items-start gap-1.5"><CheckCircle2 size={14} className="text-indigo-600 shrink-0 mt-0.5" /> Product structuring guidance</li>
                    <li className="flex items-start gap-1.5"><CheckCircle2 size={14} className="text-indigo-600 shrink-0 mt-0.5" /> Ecosystem & API support</li>
                    <li className="flex items-start gap-1.5"><CheckCircle2 size={14} className="text-indigo-600 shrink-0 mt-0.5" /> Strategic scale partnership</li>
                  </ul>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 font-mono text-center">
                Clean separation ensures compliance with Digital Lending Guidelines (LSP model).
              </div>
            </div>
          )}

          {/* SLIDE 9: COMMERCIAL MODEL */}
          {currentSlide === 9 && (
            <div className="h-full p-8 sm:p-14 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-[#0f7a75] uppercase tracking-widest">08 / MONETIZATION STRUCTURE</span>
                <h2 className="text-3xl sm:text-4xl font-black text-[#0B2450]">Commercial Models & Principles</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-auto">
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-[#0B2450] uppercase tracking-wider">Possible Commercial Options</h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <strong className="text-xs text-[#0867E8] block">01. Referral / Origination Fee</strong>
                      <span className="text-xs text-slate-600">LSP origination fee per sanctioned / disbursed loan file.</span>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <strong className="text-xs text-[#0f7a75] block">02. Disbursement-Based Revenue Share</strong>
                      <span className="text-xs text-slate-600">Percentage share on total monthly disbursed volume.</span>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <strong className="text-xs text-indigo-600 block">03. Strategic Joint Partnership</strong>
                      <span className="text-xs text-slate-600">Co-building healthcare financing distribution with revenue sharing.</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-slate-900 to-[#0B2450] text-white p-6 rounded-2xl flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest">PATIENT & CLINIC PRINCIPLES</div>
                    <h4 className="text-xl font-bold text-white">₹0 Fee to Dental Clinics</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Clinaza does NOT charge clinics any financing setup or subscription fee. The lender charges the borrower according to approved loan terms.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10 text-[11px] text-slate-400">
                    Commercial arrangements between Clinaza and Vrozart / lending partner can be finalized upon mutual discussion.
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 font-mono">
                *Subject to discussion and regulatory compliance with partner banks/NBFCs.
              </div>
            </div>
          )}

          {/* SLIDE 10: THE ASK & NEXT STEPS */}
          {currentSlide === 10 && (
            <div className="h-full p-8 sm:p-14 flex flex-col justify-between bg-gradient-to-br from-white via-blue-50/30 to-slate-50">
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-[#0867E8] uppercase tracking-widest">09 / NEXT STEPS</span>
                <h2 className="text-3xl sm:text-4xl font-black text-[#0B2450]">Let's Build the Healthcare Financing Layer Together</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-auto items-center">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-[#0f7a75] uppercase tracking-widest">PROPOSED ACTION PLAN</h3>
                  <div className="space-y-3 text-xs text-slate-700">
                    <div className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
                      <span className="font-bold text-[#0867E8]">01</span>
                      <span>Identify 1–2 suitable lending partners / NBFC channels</span>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
                      <span className="font-bold text-[#0867E8]">02</span>
                      <span>Evaluate Clinaza's 20+ clinic network pipeline & demand</span>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
                      <span className="font-bold text-[#0867E8]">03</span>
                      <span>Define product eligibility parameters for ₹30K–₹3L ticket sizes</span>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
                      <span className="font-bold text-[#0867E8]">04</span>
                      <span>Agree on pilot & scale conversion across clinics</span>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-[#0B2450] text-white rounded-3xl space-y-6 shadow-xl text-center sm:text-left">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-[#12A8A0] uppercase tracking-widest block">FOUNDER CLOSING</span>
                    <p className="text-sm font-medium text-slate-200 leading-relaxed">
                      "Clinaza brings the healthcare distribution. We are looking for the right financial and strategic partner in Vrozart to build the lending layer."
                    </p>
                  </div>

                  <div className="pt-6 border-t border-white/10 space-y-2 text-xs">
                    <div className="font-bold text-white">Contact & Web:</div>
                    <div className="flex flex-wrap gap-4 text-slate-300 text-xs font-mono">
                      <span>🌐 clinaza.in</span>
                      <span>💬 WA: 7292984244</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-slate-500 font-mono border-t border-slate-200 pt-4">
                <span>Clinaza Technologies &times; Vrozart Partnership</span>
                <span className="text-[#0867E8] font-bold">Ready to Start Pilot</span>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Footer Navigation Bar */}
      <footer className="px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-3">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 1}
          className={`px-4 sm:px-5 py-3 sm:py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition-all flex-1 sm:flex-none justify-center sm:justify-start ${
            currentSlide === 1 
              ? 'opacity-40 cursor-not-allowed text-slate-500 bg-slate-900' 
              : 'bg-slate-800 hover:bg-slate-700 text-white'
          }`}
        >
          <ChevronLeft size={16} /> <span className="hidden sm:inline">Previous</span><span className="sm:hidden">Prev</span>
        </button>

        <div className="text-[10px] text-slate-500 font-mono text-center hidden sm:block">
          Use buttons or swipe to present
        </div>
        <div className="text-[10px] text-slate-500 font-mono text-center sm:hidden">
          Swipe ← → to navigate
        </div>

        <button
          onClick={nextSlide}
          disabled={currentSlide === totalSlides}
          className={`px-4 sm:px-6 py-3 sm:py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition-all flex-1 sm:flex-none justify-center sm:justify-start ${
            currentSlide === totalSlides 
              ? 'opacity-40 cursor-not-allowed text-slate-500 bg-slate-900' 
              : 'bg-[#0867E8] hover:bg-[#0756C7] text-white shadow-lg shadow-[#0867E8]/20'
          }`}
        >
          Next <ChevronRight size={16} />
        </button>
      </footer>
    </div>
  );
}
