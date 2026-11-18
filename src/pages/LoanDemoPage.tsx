import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/seo/SEOHead';
import { 
  Shield, 
  ShieldCheck,
  CheckCircle2, 
  ChevronRight, 
  CreditCard, 
  Sparkles,
  ArrowRight,
  Clock,
  Check,
  Share2,
  Copy,
  Smartphone,
  BadgeCheck,
  HelpCircle,
  MessageSquare,
  Zap,
  TrendingUp,
  Layers,
  ArrowUpRight,
  FileText,
  AlertCircle,
  RefreshCw,
  Wallet,
  Building2,
  Sliders,
  ChevronDown,
  Lock,
  Landmark,
  Download
} from 'lucide-react';
import { toast } from 'sonner';

const PROCEDURES = [
  { id: 'aligners', name: 'Clear Aligners', amount: 75000, tenure: 12, tag: 'Most Popular', emiEst: '₹6,680' },
  { id: 'implant-single', name: 'Single Dental Implant', amount: 45000, tenure: 12, tag: 'High Conversion', emiEst: '₹4,010' },
  { id: 'ortho-braces', name: 'Ceramic / Metal Braces', amount: 40000, tenure: 12, tag: 'Teen & Young Adult', emiEst: '₹3,560' },
  { id: 'full-mouth', name: 'Full Mouth Rehab / All-on-4', amount: 160000, tenure: 18, tag: 'High Ticket', emiEst: '₹9,720' },
  { id: 'veneers', name: 'Smile Makeover / Veneers', amount: 65000, tenure: 12, tag: 'Aesthetic Flow', emiEst: '₹5,790' },
  { id: 'implants-multi', name: 'Multiple Implants & Bridges', amount: 95000, tenure: 12, tag: 'Common Case', emiEst: '₹8,460' },
  { id: 'rct-crown', name: 'Root Canal + Zirconia Crown', amount: 22000, tenure: 6, tag: 'Daily Flow', emiEst: '₹3,790' }
];

const COMPARISON_METRICS = [
  {
    capability: 'Patient Checkout Journey',
    traditional: 'Redirected to 3rd-party banking sites (45%+ drop-off)',
    clinaza: 'Unified single linear screen (Zero redirects)',
    tag: 'Zero Redirects'
  },
  {
    capability: 'Bank Statement Verification',
    traditional: 'Manual PDF uploads + password friction',
    clinaza: '1-Minute Paperless Bank OTP (Zero passbooks/PDFs)',
    tag: '1 OTP Only'
  },
  {
    capability: 'Identity & KYC Verification',
    traditional: 'Repeated per lender with offline paperwork',
    clinaza: '100% Digital One-Time Aadhaar e-KYC',
    tag: 'Paperless'
  },
  {
    capability: 'Lender Network Architecture',
    traditional: 'Single bank (rejects 60%+ patients at counter)',
    clinaza: 'Multi-Bank Waterfall (Auto-routes across Piramal, Tata, Bajaj, L&T)',
    tag: 'Auto-Backup'
  },
  {
    capability: 'Approval Rate Benchmark',
    traditional: '35% – 42% single-shot approval',
    clinaza: '76.4% Multi-Lender Match Benchmark',
    tag: '+20% Uplift'
  },
  {
    capability: 'Hardware & Machine Rental',
    traditional: '₹600–₹1,200/mo POS machine rental & deposit',
    clinaza: '₹0 Hardware (Counter QR Standee & WhatsApp Links)',
    tag: '₹0 Hardware'
  },
  {
    capability: 'Clinic Default Recourse',
    traditional: 'Collection follow-ups & bad clinic debt risk',
    clinaza: '0% Clinic Risk (100% Non-Recourse T+1 Payout)',
    tag: '₹0 Recourse'
  }
];

export default function LoanDemoPage() {
  // Mobile View Switcher: 'phone' or 'controls'
  const [mobileTab, setMobileTab] = useState<'phone' | 'controls'>('phone');

  // Interactive Simulator state
  const [selectedProcId, setSelectedProcId] = useState('aligners');
  const [customAmount, setCustomAmount] = useState(75000);
  const [selectedTenure, setSelectedTenure] = useState(12);
  const [simulatorStep, setSimulatorStep] = useState<1 | 2 | 3 | 4 | 5>(2);
  const [selectedLender, setSelectedLender] = useState('Piramal Capital');
  const [selectedPaymentModality, setSelectedPaymentModality] = useState<'cardless' | 'debit_emi' | 'credit_emi' | 'bnpl'>('cardless');
  const [clinicName] = useState('Dr. Sharma’s Dental Clinic');

  // Calculation (Annualized indicative rate ~11.5% p.a. reducing)
  const annualInterestRate = 0.115;
  const monthlyRate = annualInterestRate / 12;
  const calculatedEmi = Math.round(
    (customAmount * monthlyRate * Math.pow(1 + monthlyRate, selectedTenure)) /
    (Math.pow(1 + monthlyRate, selectedTenure) - 1)
  );

  const selectedProcedure = PROCEDURES.find(p => p.id === selectedProcId) || PROCEDURES[0];

  const handleShare = () => {
    const url = 'https://www.clinaza.in/checkout-flow';
    const text = 'Check out Clinaza’s 2-minute Patient EMI Checkout Flow. Instant multi-lender sanction, 1-click UPI mandate, and T+1 direct clinic settlement for dental treatments:';
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${text} ${url}`)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://www.clinaza.in/checkout-flow');
    toast.success('Link copied! Share it with your clinic reception or staff.');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0B2450] flex flex-col font-jakarta antialiased selection:bg-[#0867E8] selection:text-white pb-24 sm:pb-0 relative overflow-x-hidden">
      <SEOHead
        title="Patient EMI Checkout Flow & Interactive Simulator | Clinaza"
        description="Experience Clinaza's 2-minute paperless patient financing checkout: 76.4% multi-lender approval, 1-click UPI autopay, and T+1 direct clinic settlement."
        canonicalUrl="https://www.clinaza.in/checkout-flow"
        image="https://www.clinaza.in/assets/og-checkout-flow.png"
      />

      {/* ── Precision Floating Frosted-Glass Pill Navigation (Identical to Homepage) ── */}
      <header className="fixed top-3 sm:top-5 inset-x-0 z-50 max-w-7xl mx-auto px-3 sm:px-6 pointer-events-none">
        <nav className="pointer-events-auto bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-full px-3.5 sm:px-5 py-2 sm:py-2.5 shadow-[0_8px_32px_rgba(15,23,42,0.08)] flex items-center justify-between gap-2 sm:gap-3 transition-all duration-300">
          {/* Left Brand & Co-Brand Group */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <Link to="/" className="flex items-center gap-2.5 group shrink-0 min-h-[44px] min-w-[44px] p-0.5">
              <img
                src="/assets/clinaza-logo.jpg"
                alt="CLINAZA"
                className="h-8 sm:h-9 w-auto rounded-xl border border-slate-200 shadow-2xs group-hover:scale-105 transition-transform shrink-0"
                width={36}
                height={36}
              />
              <div className="hidden sm:block text-left shrink-0">
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  <span className="text-xs sm:text-[13px] font-extrabold tracking-wider text-[#0B2450]">CLINAZA</span>
                  <span className="text-[8px] font-black uppercase tracking-widest bg-blue-50 text-[#0867E8] px-1.5 py-0.5 rounded border border-blue-200/60">
                    HealthPay
                  </span>
                </div>
                <span className="hidden xl:block text-[9px] font-bold tracking-wider text-[#0f7a75] uppercase whitespace-nowrap">
                  Point-of-Care Patient Financing
                </span>
              </div>
            </Link>

            {/* Pine Labs Official Gateway Micro-Pill (visible on ultra-wide screens to maintain breathing room) */}
            <div className="hidden 2xl:flex items-center gap-2 px-3 py-1 bg-slate-50/90 border border-slate-200/80 rounded-full shrink-0">
              <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Gateway:</span>
              <img
                src="/assets/plural_by_pinelabs_transparent.png"
                alt="Plural by Pine Labs"
                className="h-3.5 w-auto object-contain"
                width={80}
                height={14}
              />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5"></span>
            </div>
          </div>

          {/* Center Navigation Links (Desktop: lg+) */}
          <div className="hidden lg:flex items-center gap-0.5 xl:gap-1 text-[11.5px] xl:text-xs font-semibold text-slate-600 shrink-0">
            <Link to="/#how-it-works" className="px-2 xl:px-2.5 py-1.5 rounded-full hover:text-[#0867E8] hover:bg-slate-50 transition-colors whitespace-nowrap">
              How It Works
            </Link>
            <Link to="/checkout-flow" className="px-2 xl:px-2.5 py-1.5 rounded-full bg-blue-50/80 text-[#0867E8] font-bold transition-colors whitespace-nowrap flex items-center gap-1">
              <span>Checkout Flow</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping"></span>
            </Link>
            <Link to="/#calculator" className="px-2 xl:px-2.5 py-1.5 rounded-full hover:text-[#0867E8] hover:bg-slate-50 transition-colors whitespace-nowrap">
              Practice ROI
            </Link>
            <Link to="/#treatments" className="px-2 xl:px-2.5 py-1.5 rounded-full hover:text-[#0867E8] hover:bg-slate-50 transition-colors whitespace-nowrap">
              Treatments
            </Link>
            <Link to="/tools" className="px-2 xl:px-2.5 py-1.5 rounded-full hover:text-[#0867E8] hover:bg-slate-50 transition-colors whitespace-nowrap">
              Free Rx Tools
            </Link>
            <Link to="/blog" className="px-2 xl:px-2.5 py-1.5 rounded-full hover:text-[#0867E8] hover:bg-slate-50 transition-colors whitespace-nowrap">
              Guides
            </Link>
          </div>

          {/* Right Action Group */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Link
              to="/reactivation/login"
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 min-h-[44px] bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 rounded-full transition-all whitespace-nowrap shrink-0 active:scale-95"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="hidden sm:inline">Doctor </span>Login
              <Lock size={12} className="text-slate-500 ml-0.5" />
            </Link>

            <Link
              to="/clinic-onboarding"
              className="relative overflow-hidden group px-3 sm:px-4 xl:px-5 py-2 sm:py-2.5 min-h-[44px] bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-extrabold uppercase tracking-wider rounded-full transition-all shadow-[0_4px_16px_rgba(8,103,232,0.25)] hover:shadow-[0_6px_20px_rgba(8,103,232,0.35)] flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 active:scale-95"
            >
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full" aria-hidden="true">
                <div className="w-16 h-full bg-gradient-to-r from-transparent via-white/35 to-transparent absolute top-0 -left-16 animate-cta-sheen" />
              </div>
              <span className="sm:hidden relative z-10">ONBOARD</span>
              <span className="hidden sm:inline xl:hidden relative z-10">Onboard &bull; ₹999</span>
              <span className="hidden xl:inline relative z-10">Onboard Clinic &bull; ₹999</span>
              <ArrowRight size={13} className="relative z-10" />
            </Link>
          </div>
        </nav>
      </header>

      {/* Subtle Atmospheric Ambient Background (Matching Homepage) */}
      <div className="absolute inset-0 bg-radial-fintech pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-grid-fintech mask-radial-fade opacity-60 pointer-events-none -z-10" />

      {/* Hero Showcase Section */}
      <section className="px-4 sm:px-6 pt-24 sm:pt-34 pb-4 max-w-6xl mx-auto w-full text-center space-y-4">
        {/* Category Pill Badge Matching Homepage */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-full text-xs font-semibold text-slate-800 shadow-2xs">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="text-[10px] font-extrabold text-[#0867E8] uppercase tracking-wider">OFFICIAL GATEWAY PARTNER:</span>
          <span className="text-[11px] font-bold text-slate-800">Plural by Pine Labs</span>
          <span className="text-slate-300 hidden sm:inline">&bull;</span>
          <span className="text-[10px] font-bold text-slate-500 hidden sm:inline">16+ Banks &bull; T+1 Settlement</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-extrabold tracking-[-0.035em] leading-[1.08] text-[#0B2450] [text-wrap:balance]">
          How Patient EMI Financing Works <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-[#0867E8] via-[#0D72EB] to-[#0f7a75] bg-clip-text text-transparent">
            At Your Dental Clinic Front Desk
          </span>
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto [text-wrap:pretty]">
          Zero clinic credit risk, guaranteed T+1 direct settlement to your current account, and instant multi-lender paperless approval in under 120 seconds.
        </p>

        {/* ── POINT 3: HARD PRODUCTION BENCHMARKS TICKER (Institutional Co-Brand Guarantee Strip) ── */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-[0_4px_24px_rgba(11,36,80,0.05)] space-y-2.5 max-w-4xl mx-auto">
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2 text-left">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wide bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200/60 flex items-center gap-1">
                <ShieldCheck size={11} className="text-emerald-600" />
                RBI Regulated Lenders
              </span>
              <span className="text-[10px] text-slate-400 hidden sm:inline">&bull;</span>
              <span className="text-[10px] font-bold text-slate-600 hidden sm:inline">
                Piramal &bull; Bajaj &bull; Tata Capital &bull; L&amp;T Finance
              </span>
            </div>
            <span className="text-[10px] font-bold text-slate-500">ISO 27001 &bull; PCI-DSS Level 1</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-left">
            <div className="bg-slate-50/90 p-2.5 sm:p-3 rounded-xl border border-slate-200/70">
              <div className="flex items-center gap-1 text-slate-400 mb-0.5">
                <TrendingUp size={11} className="text-emerald-600" />
                <span className="text-[9px] font-bold uppercase tracking-wider">Multi-Lender Match</span>
              </div>
              <div className="text-lg sm:text-2xl font-black text-emerald-600 font-mono">76.4%</div>
              <span className="text-[9.5px] text-slate-500 block truncate">Platform benchmark</span>
            </div>

            <div className="bg-slate-50/90 p-2.5 sm:p-3 rounded-xl border border-slate-200/70">
              <div className="flex items-center gap-1 text-slate-400 mb-0.5">
                <Zap size={11} className="text-blue-600" />
                <span className="text-[9px] font-bold uppercase tracking-wider">Instant Bank Limit</span>
              </div>
              <div className="text-lg sm:text-2xl font-black text-[#0867E8] font-mono">&lt; 60s</div>
              <span className="text-[9.5px] text-slate-500 block truncate">Instant OTP verification</span>
            </div>

            <div className="bg-slate-50/90 p-2.5 sm:p-3 rounded-xl border border-slate-200/70">
              <div className="flex items-center gap-1 text-slate-400 mb-0.5">
                <Layers size={11} className="text-purple-600" />
                <span className="text-[9px] font-bold uppercase tracking-wider">Approval Uplift</span>
              </div>
              <div className="text-lg sm:text-2xl font-black text-purple-600 font-mono">+15% to 20%</div>
              <span className="text-[9.5px] text-slate-500 block truncate">Over single-lender</span>
            </div>

            <div className="bg-slate-50/90 p-2.5 sm:p-3 rounded-xl border border-slate-200/70">
              <div className="flex items-center gap-1 text-slate-400 mb-0.5">
                <Clock size={11} className="text-emerald-600" />
                <span className="text-[9px] font-bold uppercase tracking-wider">Doctor Recourse</span>
              </div>
              <div className="text-lg sm:text-2xl font-black text-emerald-700 font-mono">₹0 Risk</div>
              <span className="text-[9.5px] text-slate-500 block truncate">100% Non-recourse T+1</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Experience Grid */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3.5 sm:px-6 pb-28 sm:pb-16 space-y-10 sm:space-y-12">

        {/* ── 1. INTERACTIVE SPLIT-SCREEN SIMULATOR (Scoped container for sticky mobile switcher) ── */}
        <div className="relative">

          {/* Mobile Tab Segmented Switcher (Sticky ONLY while exploring the simulator) */}
          <div className="lg:hidden sticky top-[68px] sm:top-[76px] z-30 bg-[#F8FAFC]/95 backdrop-blur-md pt-2 pb-2.5 -mx-3.5 px-3.5 border-b border-slate-200/80 shadow-xs mb-4">
            <div role="tablist" aria-label="Simulator Views" className="p-1 bg-slate-200/80 rounded-2xl flex items-center gap-1 border border-slate-300/80 shadow-inner w-full max-w-md mx-auto">
              <button
                type="button"
                role="tab"
                aria-selected={mobileTab === 'phone'}
                aria-controls="patient-screen-panel"
                onClick={() => setMobileTab('phone')}
                className={`flex-1 py-2.5 min-h-[44px] rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  mobileTab === 'phone'
                    ? 'bg-white text-[#0B2450] shadow-sm border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone size={15} className={mobileTab === 'phone' ? 'text-[#0867E8]' : 'text-slate-400'} />
                <span>Patient Screen</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mobileTab === 'controls'}
                aria-controls="clinic-controls-panel"
                onClick={() => setMobileTab('controls')}
                className={`flex-1 py-2.5 min-h-[44px] rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  mobileTab === 'controls'
                    ? 'bg-white text-[#0B2450] shadow-sm border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sliders size={15} className={mobileTab === 'controls' ? 'text-[#0867E8]' : 'text-slate-400'} />
                <span>Clinic Controls &amp; Script</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start animate-in fade-in duration-300">
          
          {/* Left Column (7 cols): Front-Desk Control Center & Case Economics */}
          <div id="clinic-controls-panel" role="tabpanel" aria-labelledby="clinic-controls-tab" className={`lg:col-span-7 space-y-5 sm:space-y-6 ${mobileTab === 'controls' ? 'block' : 'hidden lg:block'}`}>
            
            {/* ── POINT 5: MULTI-MODALITY PAYMENT MODES SWITCHER ── */}
            <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-[10px] font-black text-[#0867E8] uppercase tracking-widest block">
                  FULL AFFORDABILITY SPECTRUM
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                  All Patient Segments Covered
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'cardless', title: 'Cardless EMI', sub: 'Up to ₹2.5L (Uncarded)', icon: Wallet },
                  { id: 'debit_emi', title: 'Debit Card EMI', sub: 'HDFC, ICICI, Kotak, Axis', icon: CreditCard },
                  { id: 'credit_emi', title: 'Credit Card EMI', sub: '16+ Banks (Zero Paper)', icon: Layers },
                  { id: 'bnpl', title: 'PayLater / BNPL', sub: '₹3k–₹25k (RCT & Scaling)', icon: Zap }
                ].map((mode) => {
                  const Icon = mode.icon;
                  const isSelected = selectedPaymentModality === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setSelectedPaymentModality(mode.id as any)}
                      className={`p-2.5 min-h-[52px] rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1 active:scale-98 ${
                        isSelected
                          ? 'bg-blue-50/80 border-[#0867E8] shadow-xs'
                          : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <Icon size={14} className={isSelected ? 'text-[#0867E8]' : 'text-slate-400'} />
                      <div>
                        <div className={`text-xs font-extrabold ${isSelected ? 'text-[#0867E8]' : 'text-[#0B2450]'}`}>
                          {mode.title}
                        </div>
                        <div className="text-[9px] text-slate-500 leading-tight">{mode.sub}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Card 1: Procedure Selector */}
            <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-7 shadow-sm space-y-4 sm:space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                <div>
                  <span className="text-[10px] font-black text-[#0867E8] uppercase tracking-widest block">
                    CHAIRSIDE CASE CONFIGURATOR
                  </span>
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#0B2450] mt-0.5">
                    1. Select Dental Treatment Case
                  </h3>
                </div>
                <span className="text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg font-bold">
                  T+1 Direct Payout
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                {PROCEDURES.map((proc) => {
                  const isSelected = selectedProcId === proc.id;
                  return (
                    <button
                      key={proc.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => {
                        setSelectedProcId(proc.id);
                        setCustomAmount(proc.amount);
                        setSelectedTenure(proc.tenure);
                      }}
                      className={`p-3 min-h-[54px] rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 active:scale-98 ${
                        isSelected
                          ? 'bg-blue-50/70 border-[#0867E8] shadow-xs'
                          : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1.5">
                        <span className={`text-xs font-extrabold ${isSelected ? 'text-[#0867E8]' : 'text-[#0B2450]'}`}>
                          {proc.name}
                        </span>
                        <span className="text-[9px] font-extrabold text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded-md shrink-0">
                          {proc.tag}
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between pt-0.5">
                        <span className="text-sm sm:text-base font-black text-[#0B2450] font-mono">
                          ₹{proc.amount.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[11px] font-bold text-emerald-600">
                          ~{proc.emiEst}/mo
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom Amount Slider */}
              <div className="p-3.5 sm:p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">Or Slide Custom Treatment Cost:</span>
                  <span className="text-sm sm:text-base font-black text-[#0867E8] font-mono">
                    ₹{customAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min={15000}
                  max={250000}
                  step={5000}
                  value={customAmount}
                  aria-label="Custom Treatment Cost"
                  aria-valuemin={15000}
                  aria-valuemax={250000}
                  aria-valuenow={customAmount}
                  onChange={(e) => setCustomAmount(Number(e.target.value))}
                  className="w-full accent-[#0867E8] cursor-pointer h-2"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>₹15,000</span>
                  <span>₹1,00,000</span>
                  <span>₹2,50,000</span>
                </div>
              </div>

              {/* Live Settlement & Non-Recourse Guarantee Box */}
              <div className="p-3.5 sm:p-4 bg-gradient-to-r from-emerald-50/80 to-blue-50/50 border border-emerald-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-widest block">
                    DOCTOR SETTLEMENT BREAKDOWN
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-xl sm:text-2xl font-black text-[#0B2450] font-mono">
                      ₹{customAmount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                      Direct Current Account
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Settles T+1 • Zero Default Risk to Clinic • Bank manages collections
                  </span>
                </div>

                <div className="bg-white border border-emerald-300 rounded-xl px-3 py-1.5 sm:px-3.5 sm:py-2 text-left sm:text-right shadow-xs shrink-0 flex items-center sm:block justify-between">
                  <span className="text-[10px] text-slate-500 uppercase font-bold sm:block">Clinic Recourse</span>
                  <span className="text-xs font-black text-emerald-700">₹0 (Zero Risk)</span>
                </div>
              </div>
            </div>

            {/* Card 2: The 10-Second Chairside Script (Doctor Objection Handling) */}
            <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-7 shadow-sm space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 text-[#0867E8]">
                <MessageSquare size={18} />
                <h4 className="text-sm sm:text-base font-extrabold text-[#0B2450]">
                  The 10-Second Chairside Closing Script
                </h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                When a patient hesitates at high treatment quotes, train your doctor and reception to use this exact 2-sentence script:
              </p>

              <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-2xl p-3 sm:p-4 text-xs">
                <div className="flex items-start gap-2 sm:gap-2.5">
                  <span className="font-black text-[#0867E8] shrink-0 bg-blue-100 px-1.5 py-0.5 rounded text-[11px]">Doctor:</span>
                  <p className="text-slate-800 font-medium italic leading-relaxed text-[11px] sm:text-xs">
                    "Rahul, the complete treatment plan is ₹{customAmount.toLocaleString('en-IN')}. Would you prefer paying in full today, or should we set up an easy monthly installment of around ₹{calculatedEmi.toLocaleString('en-IN')}/mo on your phone in 2 minutes?"
                  </p>
                </div>
                <div className="flex items-start gap-2 sm:gap-2.5 pt-1 border-t border-slate-200">
                  <span className="font-black text-emerald-700 shrink-0 bg-emerald-100 px-1.5 py-0.5 rounded text-[11px]">Patient:</span>
                  <p className="text-slate-800 font-medium italic leading-relaxed text-[11px] sm:text-xs">
                    "Wait doctor, I can do ₹{calculatedEmi.toLocaleString('en-IN')}/mo without a credit card? Are there hidden fees or high interest?"
                  </p>
                </div>
                <div className="flex items-start gap-2 sm:gap-2.5 pt-1 border-t border-slate-200">
                  <span className="font-black text-[#0867E8] shrink-0 bg-blue-100 px-1.5 py-0.5 rounded text-[11px]">Doctor:</span>
                  <p className="text-slate-800 font-medium italic leading-relaxed text-[11px] sm:text-xs">
                    "No hidden traps at all. It's transparent bank reducing interest—about ₹150–₹200/mo on your EMI, far cheaper than a credit card penalty. Our front desk sends a secure link to your WhatsApp right now, you approve the exact schedule inside Google Pay or PhonePe, and we start your procedure today."
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 font-medium">
                <span>Result:</span>
                <strong className="text-emerald-700">+45% Case Acceptance Rate Chairside</strong>
              </div>
            </div>

            {/* Card 3: Step-by-Step Stage Navigator */}
            <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-sm space-y-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                FAST-FORWARD MOBILE SCREEN:
              </span>
              <div className="grid grid-cols-5 gap-1 sm:gap-1.5">
                {[
                  { s: 1, label: '1. WhatsApp' },
                  { s: 2, label: '2. Lenders' },
                  { s: 3, label: '3. Tenure' },
                  { s: 4, label: '4. Autopay' },
                  { s: 5, label: '5. Payout' }
                ].map((item) => (
                  <button
                    key={item.s}
                    type="button"
                    aria-current={simulatorStep === item.s ? 'step' : undefined}
                    onClick={() => {
                      setSimulatorStep(item.s as any);
                      setMobileTab('phone');
                    }}
                    className={`py-2 px-1 min-h-[44px] text-center rounded-xl border text-[10px] sm:text-[11px] font-extrabold transition-all cursor-pointer flex items-center justify-center ${
                      simulatorStep === item.s
                        ? 'bg-[#0867E8] text-white border-[#0867E8] shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Realistic iPhone 16 Device Frame (Full-width responsive on mobile) */}
          <div id="patient-screen-panel" role="tabpanel" aria-labelledby="patient-screen-tab" className={`lg:col-span-5 flex flex-col items-center ${mobileTab === 'phone' ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-20 w-full max-w-[360px] mx-auto">
              
              {/* Quick Case Switcher Strip on Mobile */}
              <div className="lg:hidden mb-3 bg-white border border-slate-200 rounded-2xl p-2.5 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-bold">Selected Case:</span>
                  <span className="font-extrabold text-[#0867E8]">{selectedProcedure.name}</span>
                </div>
                <div className="relative">
                  <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar pr-6">
                    {PROCEDURES.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        aria-pressed={selectedProcId === p.id}
                        onClick={() => {
                          setSelectedProcId(p.id);
                          setCustomAmount(p.amount);
                          setSelectedTenure(p.tenure);
                        }}
                        className={`px-3 py-2 min-h-[44px] rounded-xl text-[11px] font-bold whitespace-nowrap border shrink-0 transition-all active:scale-95 flex items-center justify-center ${
                          selectedProcId === p.id
                            ? 'bg-[#0867E8] text-white border-[#0867E8] shadow-xs font-black'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {p.name.split(' ')[0]} (₹{(p.amount/1000).toFixed(0)}k)
                      </button>
                    ))}
                  </div>
                  <div className="absolute right-0 top-0 bottom-1 w-6 bg-gradient-to-l from-white to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Device Frame */}
              <div className="relative bg-[#0F172A] rounded-3xl sm:rounded-[52px] p-2.5 sm:p-3.5 shadow-2xl border-2 sm:border-[5px] border-[#334155] shadow-slate-900/40">
                
                {/* Dynamic Island Notch */}
                <div className="absolute top-5 sm:top-6 left-1/2 -translate-x-1/2 w-24 sm:w-28 h-5 sm:h-6 bg-black rounded-full z-30 flex items-center justify-between px-2 sm:px-2.5">
                  <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-slate-900 border border-slate-800" />
                  <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                {/* Device Screen Content */}
                <div className="bg-white rounded-2xl sm:rounded-[40px] overflow-hidden min-h-[550px] sm:min-h-[580px] flex flex-col justify-between text-slate-900 relative">
                  
                  {/* iOS Status Bar */}
                  <div className="pt-2.5 sm:pt-3 px-5 sm:px-6 pb-2 flex justify-between items-center text-[10px] sm:text-[11px] font-bold text-slate-800 border-b border-slate-100 bg-white">
                    <span>9:41</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono">5G</span>
                      <div className="w-4.5 sm:w-5 h-2 sm:h-2.5 border border-slate-800 rounded-sm p-0.5">
                        <div className="w-full h-full bg-slate-800 rounded-xs" />
                      </div>
                    </div>
                  </div>

                  {/* App Header */}
                  <div className="bg-slate-900 text-white px-3.5 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-[#0867E8] text-white flex items-center justify-center font-black text-xs">
                        C
                      </div>
                      <div>
                        <div className="text-[11px] font-bold leading-tight">Clinaza Care-Pass</div>
                        <div className="text-[9px] text-slate-400">Institutional Patient Finance</div>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full">
                      🔒 RBI Regulated
                    </span>
                  </div>

                  {/* Dynamic Screen States */}
                  <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3.5 sm:space-y-4">

                    {/* Screen 1: WhatsApp Dispatch Simulation */}
                    {simulatorStep === 1 && (
                      <div className="space-y-3 animate-in fade-in duration-200">
                        <div className="text-center space-y-0.5">
                          <span className="text-[10px] font-bold text-[#0867E8] uppercase tracking-wider">
                            STEP 1: PATIENT WHATSAPP
                          </span>
                          <h5 className="text-sm font-extrabold text-slate-900">
                            Instant WhatsApp Link Received
                          </h5>
                        </div>

                        {/* WhatsApp Bubble Preview */}
                        <div className="p-3 bg-[#E7F8EC] border border-[#BCE7CA] rounded-2xl space-y-2 text-xs">
                          <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-[11px]">
                            <span>💬 {clinicName}</span>
                          </div>
                          <p className="text-[11px] text-slate-800 leading-relaxed">
                            Hi Rahul! Here is your paperless EMI link for <strong>{selectedProcedure.name}</strong> (₹{customAmount.toLocaleString('en-IN')}).
                          </p>
                          <div className="p-2 bg-white rounded-xl border border-emerald-200 text-[10px] space-y-1">
                            <div className="font-bold text-[#0867E8]">👉 clinaza.in/pay/clz-9842</div>
                            <div className="text-slate-500">2-min paperless check • No credit card required</div>
                          </div>
                        </div>

                        <div className="p-2.5 sm:p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-slate-700 space-y-1">
                          <div className="font-bold text-[#0B2450] flex items-center gap-1.5">
                            <Shield size={13} className="text-blue-600" />
                            <span>Zero CIBIL Impact Soft Pull</span>
                          </div>
                          <p className="text-[10px] text-slate-500 leading-normal">
                            Patient enters Aadhaar-linked mobile &amp; verifies OTP in 8 seconds.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSimulatorStep(2)}
                          className="w-full py-3 min-h-[44px] bg-[#0867E8] hover:bg-[#0756c7] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                        >
                          <span>Open EMI Pre-Approval</span>
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    )}

                    {/* Screen 2: Multi-Lender Match Engine with Waterfall Cascading */}
                    {simulatorStep === 2 && (
                      <div className="space-y-3 animate-in fade-in duration-200">
                        <div className="text-center space-y-0.5">
                          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                            STEP 2: PRE-APPROVAL FOUND
                          </span>
                          <h5 className="text-sm font-extrabold text-slate-900">
                            76.4% Multi-Lender Match
                          </h5>
                        </div>

                        {/* Sanction Limit Banner */}
                        <div className="p-3 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl space-y-0.5">
                          <div className="text-[9px] uppercase tracking-wider text-blue-200 font-bold">
                            Pre-Approved Limit
                          </div>
                          <div className="text-xl font-black font-mono">₹1,50,000</div>
                          <div className="text-[10px] text-blue-200">Covers 100% of ₹{customAmount.toLocaleString('en-IN')}</div>
                        </div>

                        {/* Lender Choices with Multi-Bank waterfall indicator */}
                        <div className="space-y-1.5">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                            Matched via Multi-Bank Approval Engine:
                          </span>
                          {[
                            { name: 'Piramal Capital', tag: 'Pre-Approved Instant Limit', badge: 'Fastest (30s)' },
                            { name: 'Bajaj Finserv', tag: 'Instant Cardless Limit', badge: 'High Approval' },
                            { name: 'Tata Capital', tag: 'Flexible Monthly EMI', badge: '₹0 Foreclosure' },
                            { name: 'L&T Finance / Aditya Birla', tag: 'New Patient Bureau Match', badge: 'New Borrowers' }
                          ].map((lender, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setSelectedLender(lender.name)}
                              className={`w-full p-2.5 min-h-[44px] rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between active:scale-98 ${
                                selectedLender === lender.name
                                  ? 'bg-blue-50/80 border-[#0867E8] text-[#0B2450] shadow-xs'
                                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                              }`}
                            >
                              <div>
                                <div className="text-xs font-bold leading-tight">{lender.name}</div>
                                <div className="text-[9px] text-slate-500">{lender.tag}</div>
                              </div>
                              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md">
                                {lender.badge}
                              </span>
                            </button>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => setSimulatorStep(3)}
                          className="w-full py-3 min-h-[44px] bg-[#0867E8] hover:bg-[#0756c7] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                        >
                          <span>Choose Repayment Tenure</span>
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    )}

                    {/* Screen 3: Flexible Tenure & Live EMI */}
                    {simulatorStep === 3 && (
                      <div className="space-y-3 animate-in fade-in duration-200">
                        <div className="text-center space-y-0.5">
                          <span className="text-[10px] font-bold text-[#0867E8] uppercase tracking-wider">
                            STEP 3: FLEXIBLE TENURE
                          </span>
                          <h5 className="text-sm font-extrabold text-slate-900">
                            Select Monthly Installment
                          </h5>
                        </div>

                        <div className="p-2.5 sm:p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs">
                          <span className="text-slate-500 font-bold">Treatment Amount:</span>
                          <span className="font-black text-[#0B2450] font-mono text-sm">
                            ₹{customAmount.toLocaleString('en-IN')}
                          </span>
                        </div>

                        {/* Tenure Pills */}
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                            Repayment Duration:
                          </span>
                          <div className="grid grid-cols-4 gap-1.5">
                            {[3, 6, 12, 18].map((t) => (
                              <button
                                key={t}
                                type="button"
                                aria-pressed={selectedTenure === t}
                                onClick={() => setSelectedTenure(t)}
                                className={`py-2.5 min-h-[44px] rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center active:scale-98 ${
                                  selectedTenure === t
                                    ? 'bg-[#0867E8] border-[#0867E8] text-white shadow-xs font-black'
                                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                                }`}
                              >
                                {t}M
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Live Monthly Debit Card */}
                        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl space-y-1 text-center">
                          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                            Monthly Debit
                          </span>
                          <div className="text-2xl font-black text-emerald-900 font-mono">
                            ₹{calculatedEmi.toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-600">/mo</span>
                          </div>
                          <span className="text-[10px] text-slate-600 block">
                            Duration: {selectedTenure} Months &bull; Zero Prepayment Penalty
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSimulatorStep(4)}
                          className="w-full py-3 min-h-[44px] bg-[#0867E8] hover:bg-[#0756c7] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                        >
                          <span>Setup 1-Click UPI Autopay</span>
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    )}

                    {/* Screen 4: 1-Click UPI Autopay Mandate */}
                    {simulatorStep === 4 && (
                      <div className="space-y-3 animate-in fade-in duration-200">
                        <div className="text-center space-y-0.5">
                          <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">
                            STEP 4: UPI AUTOPAY
                          </span>
                          <h5 className="text-sm font-extrabold text-slate-900">
                            15-Second e-Mandate
                          </h5>
                        </div>

                        <div className="p-2.5 sm:p-3 bg-purple-50 border border-purple-200 rounded-2xl space-y-1.5 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Monthly Debit:</span>
                            <span className="font-bold text-[#0B2450] font-mono">₹{calculatedEmi.toLocaleString('en-IN')}/mo</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Debit Day:</span>
                            <span className="font-bold text-slate-700">5th of Every Month</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Supported Apps:</span>
                            <span className="font-bold text-purple-800">Google Pay, PhonePe, Paytm</span>
                          </div>
                        </div>

                        <div className="p-2.5 sm:p-3 bg-white border border-slate-200 rounded-xl text-[11px] text-slate-600 space-y-1">
                          <div className="font-bold text-slate-900 flex items-center gap-1">
                            <CheckCircle2 size={13} className="text-emerald-600" />
                            <span>Zero Physical Cheques or Paperwork</span>
                          </div>
                          <p className="text-[10px] text-slate-500 leading-normal">
                            Patient enters their normal UPI PIN inside Google Pay / PhonePe to register the NPCI mandate.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSimulatorStep(5)}
                          className="w-full py-3 min-h-[44px] bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                        >
                          <CheckCircle2 size={15} />
                          <span>Authorize Mandate with UPI PIN</span>
                        </button>
                      </div>
                    )}

                    {/* Screen 5: Sanction Confirmed & T+1 Settlement */}
                    {simulatorStep === 5 && (
                      <div className="space-y-3 animate-in fade-in duration-200 text-center py-1">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                          <CheckCircle2 size={28} />
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest block">
                            SANCTION CONFIRMED
                          </span>
                          <h5 className="text-base font-black text-slate-900">
                            Treatment Can Start Today!
                          </h5>
                        </div>

                        <div className="p-2.5 sm:p-3 bg-slate-50 border border-slate-200 rounded-2xl text-left space-y-1.5 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Clinic Payout:</span>
                            <span className="font-mono font-black text-emerald-700 text-sm">
                              ₹{customAmount.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Settlement:</span>
                            <span className="font-bold text-slate-800">T+1 Direct to Clinic Current A/c</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Doctor Liability:</span>
                            <span className="font-bold text-emerald-700">₹0 (100% Non-Recourse)</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSimulatorStep(1)}
                          className="w-full py-2.5 min-h-[44px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center"
                        >
                          Restart Patient Journey
                        </button>
                      </div>
                    )}

                  </div>

                  {/* Bottom Home Indicator Bar */}
                  <div className="py-2 flex justify-center bg-white">
                    <div className="w-24 sm:w-28 h-1 bg-slate-300 rounded-full" />
                  </div>

                </div>
              </div>

              <div className="mt-2.5 text-center">
                <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
                  ⚡ 100% Client-side instant simulation • Zero latency
                </span>
              </div>
            </div>
          </div>

        </div>
        </div>

        {/* ── POINT 2: THE MULTI-LENDER BRE & ACCOUNT AGGREGATOR ARCHITECTURE ── */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 shadow-sm space-y-5 sm:space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1.5">
            <span className="text-[10px] font-black text-[#0867E8] uppercase tracking-widest">
              INTELLIGENT ROUTING ENGINE
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold text-[#0B2450] tracking-tight">
              Why Multi-Lender Cascading Drives 76.4% Approvals
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Single-lender integrations reject 60%+ of patients. Clinaza connects to a unified multi-partner credit layer with automated waterfall matching.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-1">
            
            <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-1.5 sm:space-y-2">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-100 text-[#0867E8] flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h4 className="font-extrabold text-[#0B2450] text-sm">Soft Bureau Pre-Check</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Non-intrusive credit assessment that checks eligibility across multiple lenders with <strong>zero impact on patient's CIBIL score</strong>.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-1.5 sm:space-y-2">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h4 className="font-extrabold text-[#0B2450] text-sm">Auto-Backup Matching</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Intelligent waterfall routing: if Bank A declines, the engine automatically matches to Lender B in milliseconds so your patient isn't rejected at the counter.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-1.5 sm:space-y-2">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h4 className="font-extrabold text-[#0B2450] text-sm">1-Min Paperless Verification</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fetches real-time verified bank cashflows with a simple 1-time OTP. <strong>Zero PDF password uploads</strong>, zero passbook scanning, and zero printouts.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-1.5 sm:space-y-2">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
                04
              </div>
              <h4 className="font-extrabold text-[#0B2450] text-sm">Transparent Cost Schedule</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                RBI-mandated Key Fact Statement generated upfront. 100% transparent terms with ₹0 hidden charges, protecting doctor-patient trust.
              </p>
            </div>

          </div>
        </div>

        {/* ── POINT 1: WHY TRADITIONAL EMI FAILS VS CLINAZA ── */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 shadow-sm space-y-5 sm:space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1.5">
            <span className="text-[10px] font-black text-[#0867E8] uppercase tracking-widest">
              THE LAST-MILE DROP-OFF PROBLEM
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold text-[#0B2450] tracking-tight">
              Why Traditional Patient Financing Fails at the Counter
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Why dental practices lose high-value cases when relying on traditional bank agents or standalone apps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 pt-1">
            
            {/* Pitfall 1 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                ✕
              </div>
              <h4 className="font-extrabold text-[#0B2450] text-sm">Multiple External Redirections</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Patients are bounced between merchant links and third-party bank sites. Slow page loads and expired sessions break the checkout flow chairside.
              </p>
              <div className="text-[10px] sm:text-[11px] font-bold text-rose-700 bg-white border border-rose-200 p-2 rounded-xl">
                Impact: 45%+ Patient Abandonment
              </div>
            </div>

            {/* Pitfall 2 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                ✕
              </div>
              <h4 className="font-extrabold text-[#0B2450] text-sm">Manual PDF Bank Statement Uploads</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Asking a patient to search their email for password-protected PDF bank statements causes instant fatigue. Most patients postpone treatment indefinitely.
              </p>
              <div className="text-[10px] sm:text-[11px] font-bold text-rose-700 bg-white border border-rose-200 p-2 rounded-xl">
                Impact: Lost Implant &amp; Aligner Cases
              </div>
            </div>

            {/* Pitfall 3 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                ✕
              </div>
              <h4 className="font-extrabold text-[#0B2450] text-sm">Narrow Single-Lender Criteria</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Standalone lenders reject any borrower who doesn't fit their narrow credit score box. A rejected patient feels embarrassed and walks away.
              </p>
              <div className="text-[10px] sm:text-[11px] font-bold text-rose-700 bg-white border border-rose-200 p-2 rounded-xl">
                Impact: 60%+ Hard Rejection Rates
              </div>
            </div>

          </div>
        </div>

        {/* ── POINT 4: COMPLETE COMPETITIVE COMPARISON MATRIX (MOBILE-OPTIMIZED) ── */}
        <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-8 shadow-sm space-y-5">
          <div className="text-center max-w-2xl mx-auto space-y-1.5">
            <span className="text-[10px] font-black text-[#0867E8] uppercase tracking-widest">
              COMPETITIVE BENCHMARKS
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold text-[#0B2450] tracking-tight">
              Clinaza vs. Traditional Financing Solutions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              See why leading dental practices choose Clinaza’s unified point-of-care financing network.
            </p>
          </div>

          {/* Mobile Card Comparison (Zero Horizontal Scroll Needed - Side-by-Side Clarity) */}
          <div className="block sm:hidden space-y-3">
            {COMPARISON_METRICS.map((row) => (
              <div key={row.capability} className="p-3.5 bg-slate-50/80 border border-slate-200/90 rounded-2xl space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-black text-[#0B2450]">{row.capability}</span>
                  <span className="text-[9px] font-bold text-[#0867E8] bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded-md shrink-0">
                    {row.tag}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 bg-white border border-rose-200/80 rounded-xl space-y-1 shadow-2xs">
                    <div className="text-[9px] font-black uppercase text-rose-600 tracking-wider flex items-center gap-1">
                      <span>✕ Traditional</span>
                    </div>
                    <div className="text-rose-950 leading-tight font-medium text-[11px]">{row.traditional}</div>
                  </div>
                  <div className="p-2.5 bg-blue-50/90 border border-blue-200 rounded-xl space-y-1 shadow-2xs">
                    <div className="text-[9px] font-black uppercase text-[#0867E8] tracking-wider flex items-center gap-1">
                      <CheckCircle2 size={11} className="text-[#0867E8] shrink-0" />
                      <span>Clinaza OS</span>
                    </div>
                    <div className="text-blue-950 leading-tight font-extrabold text-[11px]">{row.clinaza}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop & Tablet Wide Table View */}
          <div className="hidden sm:block overflow-x-auto pb-2">
            <table className="w-full min-w-[560px] text-left text-xs border border-slate-200 rounded-2xl overflow-hidden">
              <thead className="bg-slate-100/90 text-slate-800 font-black">
                <tr>
                  <th className="p-3 sm:p-4">Financing Capability</th>
                  <th className="p-3 sm:p-4 text-slate-500">Traditional Bank / NBFC Rep</th>
                  <th className="p-3 sm:p-4 text-[#0867E8] bg-blue-50/80">Clinaza Unified Checkout OS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {COMPARISON_METRICS.map((row) => (
                  <tr key={row.capability}>
                    <td className="p-3 sm:p-4 font-bold text-slate-900">{row.capability}</td>
                    <td className="p-3 sm:p-4 text-rose-600">{row.traditional}</td>
                    <td className="p-3 sm:p-4 font-bold text-emerald-700 bg-blue-50/40">✓ {row.clinaza}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── SECTION: SIMPLE SOLE PROPRIETOR CLINIC ONBOARDING ── */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 shadow-sm space-y-5 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-100 pb-4 sm:pb-5">
            <div>
              <span className="text-[10px] font-black text-[#0867E8] uppercase tracking-widest block">
                ZERO CORPORATE COMPLEXITY
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#0B2450] tracking-tight mt-0.5">
                Simple Documents to Onboard Your Dental Practice
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                95% of dental clinics in India operate as Sole Proprietorships. We do NOT require corporate board resolutions or MOA/AOA.
              </p>
            </div>

            <Link
              to="/clinic-kyc"
              className="px-4 sm:px-5 py-2.5 min-h-[44px] bg-[#0867E8] hover:bg-[#0756c7] text-white rounded-xl text-xs font-black transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 shrink-0 self-start sm:self-center active:scale-95"
            >
              <span>Upload Clinic KYC Online</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
            
            {/* Sole Proprietorship Card (Highlighted) */}
            <div className="p-4 sm:p-6 rounded-2xl bg-blue-50/40 border-2 border-[#0867E8] space-y-3.5 sm:space-y-4 relative overflow-hidden">
              <div className="inline-block text-[10px] font-black uppercase tracking-wider bg-[#0867E8] text-white px-2.5 py-1 rounded-full">
                Most Common (95% of Clinics)
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-[#0B2450]">
                  Individual Doctor / Sole Proprietorship Clinic
                </h3>
                <p className="text-xs text-slate-600">Standard practice registered in doctor's individual name.</p>
              </div>

              <div className="space-y-2 sm:space-y-2.5 text-xs text-slate-800">
                <div className="flex items-start gap-2 sm:gap-2.5">
                  <BadgeCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>1. Doctor PAN &amp; Aadhaar Card</strong> (Self-attested)</span>
                </div>
                <div className="flex items-start gap-2 sm:gap-2.5">
                  <BadgeCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>2. Clinic Current Account Cancelled Cheque</strong> (Zero bank statements required)</span>
                </div>
                <div className="flex items-start gap-2 sm:gap-2.5">
                  <BadgeCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>3. Business Proof</strong> (Any ONE: Udyam MSME / State Dental Council Reg / Shop Act)</span>
                </div>
                <div className="flex items-start gap-2 sm:gap-2.5">
                  <BadgeCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>4. Signed Plural MAF</strong> (Merchant Application Form)</span>
                </div>
                <div className="flex items-start gap-2 sm:gap-2.5">
                  <BadgeCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span><strong>5. GST Exemption Self-Declaration</strong> (Simple clinic letterhead format)</span>
                    <a
                      href="/docs/Clinaza_GST_Exemption_Declaration_Letterhead_Format.docx"
                      download="Clinaza_GST_Exemption_Declaration_Letterhead_Format.docx"
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0867E8] bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded hover:bg-blue-100 transition-colors"
                    >
                      <Download size={10} />
                      <span>Download .docx</span>
                    </a>
                    <a
                      href="/docs/Clinaza_GST_Exemption_Declaration_Letterhead_Format.pdf"
                      target="_blank"
                      rel="noreferrer"
                      download="Clinaza_GST_Exemption_Declaration_Letterhead_Format.pdf"
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded hover:bg-slate-200 transition-colors"
                    >
                      <Download size={10} />
                      <span>PDF</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-2.5 sm:p-3 bg-emerald-100/80 border border-emerald-300 rounded-xl text-[11px] text-emerald-900 flex items-center gap-2 font-medium">
                <Check size={14} className="text-emerald-700 stroke-[3] shrink-0" />
                <span>Zero Friction: No Bank Statements, No Company PAN, No Board Resolution, No MOA/AOA needed.</span>
              </div>
            </div>

            {/* Pvt Ltd / LLP Clinic */}
            <div className="p-4 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3.5 sm:space-y-4">
              <div className="inline-block text-[10px] font-black uppercase tracking-wider bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full">
                Corporate / Chains &amp; IVF Centers
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-[#0B2450]">
                  Corporate Practice (Pvt Ltd / LLP / IVF Center)
                </h3>
                <p className="text-xs text-slate-600">IVF &amp; dental chain entities registered under MCA.</p>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div className="flex items-start gap-2 sm:gap-2.5">
                    <CheckCircle2 size={16} className="text-slate-400 shrink-0 mt-0.5" />
                    <span>1. <strong>Board Resolution (BR)</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 ml-6 sm:ml-0">
                    <a
                      href="/docs/Clinaza_Pine_Labs_Board_Resolution_Format.docx"
                      download="Clinaza_Pine_Labs_Board_Resolution_Format.docx"
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0867E8] bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded hover:bg-blue-100 transition-colors"
                    >
                      <Download size={10} />
                      <span>Download .docx</span>
                    </a>
                    <a
                      href="/docs/Clinaza_Pine_Labs_Board_Resolution_Format.pdf"
                      target="_blank"
                      rel="noreferrer"
                      download="Clinaza_Pine_Labs_Board_Resolution_Format.pdf"
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded hover:bg-slate-200 transition-colors"
                    >
                      <Download size={10} />
                      <span>PDF</span>
                    </a>
                  </div>
                </div>

                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div className="flex items-start gap-2 sm:gap-2.5">
                    <CheckCircle2 size={16} className="text-slate-400 shrink-0 mt-0.5" />
                    <span>2. <strong>Plural MAF + BO &amp; PEP List</strong></span>
                  </div>
                  <div className="ml-6 sm:ml-0">
                    <a
                      href="/docs/Plural_MAF_BO_PEP_Key_Personnel_List_Format.xlsx"
                      download="Plural_MAF_BO_PEP_Key_Personnel_List_Format.xlsx"
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded hover:bg-emerald-100 transition-colors"
                    >
                      <Download size={10} />
                      <span>Download .xlsx</span>
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-2 sm:gap-2.5">
                  <CheckCircle2 size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <span>3. Company PAN Card &amp; Certificate of Incorporation (COI)</span>
                </div>
                <div className="flex items-start gap-2 sm:gap-2.5">
                  <CheckCircle2 size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <span>4. Company Current Account Cancelled Cheque &amp; GSTIN</span>
                </div>
                <div className="flex items-start gap-2 sm:gap-2.5">
                  <CheckCircle2 size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <span>5. PAN &amp; Aadhaar of Authorized Signatory Directors</span>
                </div>
                <div className="flex items-start gap-2 sm:gap-2.5">
                  <CheckCircle2 size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <span>6. MOA &amp; AOA / LLP Agreement</span>
                </div>
              </div>

              <div className="p-2.5 sm:p-3 bg-white border border-slate-200 rounded-xl text-[11px] text-slate-500">
                Standard corporate underwriting processed in 24 hours via Plural by Pine Labs.
              </div>
            </div>

          </div>
        </div>

        {/* ── SECTION: DOCTOR FAQ ACCORDION ── */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 shadow-sm space-y-5">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <span className="text-[10px] font-black text-[#0867E8] uppercase tracking-widest">
              DOCTOR CLARIFICATIONS
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#0B2450]">
              Questions Doctors Frequently Ask
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-xs">
            <div className="p-3.5 sm:p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
              <h4 className="font-extrabold text-[#0B2450] text-sm flex items-center gap-1.5">
                <HelpCircle size={15} className="text-[#0867E8]" />
                <span>What happens if the patient defaults on EMIs?</span>
              </h4>
              <p className="text-slate-600 leading-relaxed">
                The financing is <strong>100% non-recourse</strong> to the dental clinic. All credit risk is absorbed by the RBI-regulated bank or NBFC (Piramal, Bajaj, Tata, etc.). The clinic is never asked to repay or collect defaulting amounts.
              </p>
            </div>

            <div className="p-3.5 sm:p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
              <h4 className="font-extrabold text-[#0B2450] text-sm flex items-center gap-1.5">
                <HelpCircle size={15} className="text-[#0867E8]" />
                <span>Do I need to buy or rent a physical POS machine?</span>
              </h4>
              <p className="text-slate-600 leading-relaxed">
                No hardware POS rental or terminal deposit is needed. The entire checkout flow runs digitally via a secure QR standee at your front desk or a direct WhatsApp payment link dispatched to the patient’s phone.
              </p>
            </div>

            <div className="p-3.5 sm:p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
              <h4 className="font-extrabold text-[#0B2450] text-sm flex items-center gap-1.5">
                <HelpCircle size={15} className="text-[#0867E8]" />
                <span>When does the clinic receive the money?</span>
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Settlement is <strong>guaranteed T+1</strong>. For example, if a patient gets approved for ₹75,000 clear aligners on Monday afternoon, the full settlement lands in the clinic current account on Tuesday by 11:00 AM.
              </p>
            </div>

            <div className="p-3.5 sm:p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
              <h4 className="font-extrabold text-[#0B2450] text-sm flex items-center gap-1.5">
                <HelpCircle size={15} className="text-[#0867E8]" />
                <span>Why don’t dental clinics need GST registration?</span>
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Healthcare services provided by clinical establishments and authorized medical/dental practitioners are legally exempt from GST under Ministry of Finance Notification No. 12/2017-Central Tax. A simple self-declaration satisfies compliance.
              </p>
            </div>
          </div>
        </div>

        {/* ── SECTION: BOTTOM CONVERSION & WHATSAPP SHARE ── */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#0B2450] via-[#091E42] to-[#0F172A] text-white rounded-3xl p-6 sm:p-12 text-center space-y-4 shadow-xl border border-slate-800">
          <div className="absolute inset-0 bg-radial-fintech opacity-20 pointer-events-none" />
          
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-[10px] font-extrabold uppercase tracking-wider">
              <Sparkles size={12} className="text-blue-400" />
              <span>Instant Front-Desk Activation</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white max-w-2xl mx-auto [text-wrap:balance]">
              Ready to Offer Instant Patient EMIs at Your Front Desk?
            </h3>
            
            <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
              Stop losing high-value implant and aligner cases to price objections. Get your clinic verified in under 24 hours with ₹0 monthly subscription, ₹0 AMC, and a nominal ₹999 one-time activation kit.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <Link
                to="/clinic-onboarding"
                className="relative overflow-hidden group w-full sm:w-auto px-7 py-3.5 sm:py-4 min-h-[48px] bg-[#0867E8] hover:bg-[#0756c7] text-white rounded-2xl text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all shadow-[0_10px_25px_rgba(8,103,232,0.25)] hover:shadow-[0_14px_30px_rgba(8,103,232,0.35)] flex items-center justify-center gap-2 active:scale-95"
              >
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl" aria-hidden="true">
                  <div className="w-20 h-full bg-gradient-to-r from-transparent via-white/35 to-transparent absolute top-0 -left-20 animate-cta-sheen" />
                </div>
                <span className="relative z-10">Onboard Clinic &bull; ₹999 Setup</span>
                <ArrowRight size={15} className="relative z-10" />
              </Link>

              <button
                type="button"
                onClick={handleShare}
                className="w-full sm:w-auto px-6 py-3.5 sm:py-4 min-h-[48px] bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-900/30 active:scale-95"
              >
                <Share2 size={15} />
                <span>Share Flow via WhatsApp</span>
              </button>
            </div>
          </div>
        </div>

      </main>

      {/* ── STICKY MOBILE ACTION BAR (Fixed at bottom for easy thumb access on mobile) ── */}
      <aside aria-label="Mobile Action Bar" className="fixed bottom-0 inset-x-0 z-40 bg-white/90 backdrop-blur-xl border-t border-slate-200/90 px-3 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] flex sm:hidden items-center justify-between gap-2 shadow-[0_-8px_24px_rgba(15,23,42,0.06)]">
        <button
          type="button"
          onClick={handleShare}
          className="flex-1 min-h-[44px] px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200/90 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-2xs active:scale-95"
        >
          <Share2 size={14} className="text-[#0867E8]" />
          <span>Share Flow</span>
        </button>
        <Link
          to="/clinic-onboarding"
          className="relative overflow-hidden group flex-1 min-h-[44px] px-3 py-2 bg-[#0867E8] hover:bg-[#0756c7] text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
        >
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl" aria-hidden="true">
            <div className="w-16 h-full bg-gradient-to-r from-transparent via-white/35 to-transparent absolute top-0 -left-16 animate-cta-sheen" />
          </div>
          <span className="relative z-10">Onboard Clinic</span>
          <ArrowRight size={14} className="relative z-10" />
        </Link>
      </aside>

    </div>
  );
}
