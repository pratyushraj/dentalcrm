import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/seo/SEOHead';
import { 
  Shield, 
  CheckCircle2, 
  ChevronRight, 
  CreditCard, 
  Building2, 
  Sparkles,
  ArrowRight,
  Clock,
  Check,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Share2,
  Copy,
  Smartphone,
  Info,
  BadgeCheck,
  HelpCircle,
  Zap,
  PhoneCall,
  UserCheck,
  Send,
  Lock,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Receipt,
  FileCheck2,
  MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';

interface Chapter {
  title: string;
  shortTitle: string;
  time: number;
  timeStr: string;
  description: string;
}

const CHAPTERS: Chapter[] = [
  {
    title: '1. WhatsApp Link & Customer Verification',
    shortTitle: '1. WhatsApp & OTP',
    time: 0,
    timeStr: '0:00',
    description: 'Patient receives secure financing link via clinic WhatsApp or chairside QR.'
  },
  {
    title: '2. Pre-Approved ETB Multi-Lender Limits',
    shortTitle: '2. Pre-Approved Limits',
    time: 35,
    timeStr: '0:35',
    description: 'Instant multi-lender credit limit check (Piramal, Bajaj, Tata, HDFC, Kotak) with zero CIBIL impact.'
  },
  {
    title: '3. Tenure Selection & Transparent EMI',
    shortTitle: '3. Flexible Tenure',
    time: 75,
    timeStr: '1:15',
    description: 'Patient selects repayment duration (3 to 24 months) with crystal clear monthly debit figures.'
  },
  {
    title: '4. 1-Click Mandate (UPI Autopay / eNACH)',
    shortTitle: '4. UPI Autopay Mandate',
    time: 110,
    timeStr: '1:50',
    description: '15-second paperless mandate authentication using Google Pay, PhonePe, Paytm, or NetBanking.'
  },
  {
    title: '5. Account Aggregator (AA) for New Borrowers',
    shortTitle: '5. Bank Account Aggregator',
    time: 150,
    timeStr: '2:30',
    description: 'RBI-regulated Account Aggregator securely fetches bank statement (SBI, ICICI, Axis) with 1 OTP.'
  },
  {
    title: '6. Sanction Confirmation & T+1 Settlement',
    shortTitle: '6. T+1 Clinic Settlement',
    time: 200,
    timeStr: '3:20',
    description: 'Instant loan sanction pass generated; 100% treatment fee settled T+1 to clinic current account.'
  }
];

const PROCEDURES = [
  { id: 'aligners', name: 'Clear Aligners', amount: 75000, tenure: 12, tag: 'Most Popular', emiEst: '₹6,680' },
  { id: 'implant-single', name: 'Single Dental Implant', amount: 45000, tenure: 12, tag: 'High Conversion', emiEst: '₹4,010' },
  { id: 'full-mouth', name: 'Full Mouth Rehab / All-on-4', amount: 160000, tenure: 18, tag: 'High Ticket', emiEst: '₹9,720' },
  { id: 'implants-multi', name: 'Multiple Implants & Bridges', amount: 95000, tenure: 12, tag: 'Common Case', emiEst: '₹8,460' },
  { id: 'rct-crown', name: 'Root Canal + Zirconia Crown', amount: 22000, tenure: 6, tag: 'Daily Flow', emiEst: '₹3,790' }
];

export default function LoanDemoPage() {
  // Main view mode: 'simulator' or 'video'
  const [viewMode, setViewMode] = useState<'simulator' | 'video'>('simulator');

  // Video player state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  // Interactive Simulator state
  const [selectedProcId, setSelectedProcId] = useState('aligners');
  const [customAmount, setCustomAmount] = useState(75000);
  const [selectedTenure, setSelectedTenure] = useState(12);
  const [simulatorStep, setSimulatorStep] = useState<1 | 2 | 3 | 4 | 5>(2);
  const [selectedLender, setSelectedLender] = useState('Piramal Capital');
  const [patientName, setPatientName] = useState('Rahul Sharma');
  const [clinicName, setClinicName] = useState('Dr. Sharma’s Dental Clinic');

  // Calculation (Annualized indicative rate ~11.5% p.a. reducing)
  const annualInterestRate = 0.115;
  const monthlyRate = annualInterestRate / 12;
  const calculatedEmi = Math.round(
    (customAmount * monthlyRate * Math.pow(1 + monthlyRate, selectedTenure)) /
    (Math.pow(1 + monthlyRate, selectedTenure) - 1)
  );

  const selectedProcedure = PROCEDURES.find(p => p.id === selectedProcId) || PROCEDURES[0];

  // Video helpers
  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleSeek = (timeInSeconds: number, index: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = timeInSeconds;
    setActiveChapterIndex(index);
    if (!isPlaying) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const time = videoRef.current.currentTime;
    setCurrentTime(time);

    // Update active chapter
    for (let i = CHAPTERS.length - 1; i >= 0; i--) {
      if (time >= CHAPTERS[i].time - 1) {
        setActiveChapterIndex(i);
        break;
      }
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-[#0867E8] selection:text-white">
      <SEOHead
        title="Patient EMI Checkout Flow & Infrastructure Demo | Clinaza"
        description="Experience Clinaza's 2-minute paperless patient financing checkout: multi-lender approval, 1-click UPI autopay, and T+1 direct clinic settlement."
        canonicalUrl="https://www.clinaza.in/checkout-flow"
      />

      {/* Top Professional Header */}
      <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0867E8] text-white flex items-center justify-center font-black text-base shadow-md shadow-blue-500/20">
            C
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-tight text-[#0B2450] flex items-center gap-2">
              CLINAZA <span className="text-[10px] font-bold text-[#0867E8] bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded-md">CHECKOUT OS</span>
            </span>
            <span className="text-[10px] text-slate-500 font-medium">Point-of-Care Healthcare Financing Network</span>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold transition-all shadow-xs"
            title="Share with Clinic Reception"
          >
            <Share2 size={13} className="text-emerald-600" />
            <span className="hidden sm:inline">Share with Reception</span>
          </button>
          <Link
            to="/clinic-kyc"
            className="px-4 py-2 bg-[#0867E8] hover:bg-[#0756c7] text-white rounded-xl text-xs font-black transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5 active:scale-95"
          >
            <span>Onboard Clinic</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </header>

      {/* Hero Showcase Section */}
      <section className="px-4 sm:px-6 pt-10 pb-6 max-w-6xl mx-auto w-full text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#0867E8] text-xs font-extrabold uppercase tracking-wider shadow-xs">
          <Sparkles size={13} className="text-blue-600 animate-pulse" />
          <span>Interactive Patient Checkout & Infrastructure Walkthrough</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#0B2450] max-w-4xl mx-auto leading-tight">
          How Patient EMI Financing Works <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0867E8] via-[#0284c7] to-[#0f766e]">
            At Your Dental Clinic Front Desk
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Zero clinic credit risk, guaranteed T+1 direct settlement to your current account, and instant multi-lender paperless approval in under 120 seconds.
        </p>

        {/* 3 Core Doctor Invariants */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs font-bold">
          <span className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full shadow-xs">
            <Check size={14} className="text-emerald-600 stroke-[3]" /> 100% Non-Recourse (₹0 Clinic Liability)
          </span>
          <span className="flex items-center gap-1.5 text-blue-800 bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-full shadow-xs">
            <Clock size={14} className="text-blue-600 stroke-[2.5]" /> 2-Minute Digital Approval
          </span>
          <span className="flex items-center gap-1.5 text-purple-800 bg-purple-50 border border-purple-200 px-3.5 py-1.5 rounded-full shadow-xs">
            <CreditCard size={14} className="text-purple-600 stroke-[2.5]" /> No Physical POS Machine Needed
          </span>
        </div>

        {/* View Mode Toggle Pill (Simulator vs. Video) */}
        <div className="pt-4 flex items-center justify-center">
          <div className="p-1 bg-slate-200/80 rounded-2xl flex items-center gap-1 border border-slate-300/80 shadow-inner">
            <button
              type="button"
              onClick={() => setViewMode('simulator')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                viewMode === 'simulator'
                  ? 'bg-white text-[#0B2450] shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone size={16} className={viewMode === 'simulator' ? 'text-[#0867E8]' : 'text-slate-400'} />
              <span>Interactive Patient Simulator</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode('video');
                setTimeout(() => videoRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
              }}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                viewMode === 'video'
                  ? 'bg-white text-[#0B2450] shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Play size={15} className={viewMode === 'video' ? 'text-[#0867E8] fill-[#0867E8]' : 'text-slate-400'} />
              <span>Watch Video Walkthrough (3:47)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Experience Grid */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pb-20 space-y-12">

        {/* ── MODE 1: INTERACTIVE SPLIT-SCREEN SIMULATOR ── */}
        {viewMode === 'simulator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-300">
            
            {/* Left Column (7 cols): Front-Desk Control Center & Case Economics */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Card 1: Procedure Selector */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] font-black text-[#0867E8] uppercase tracking-widest block">
                      CHAIRSIDE CASE CONFIGURATOR
                    </span>
                    <h3 className="text-xl font-extrabold text-[#0B2450] mt-0.5">
                      1. Select Dental Treatment Case
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg font-bold">
                    T+1 Payout
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PROCEDURES.map((proc) => {
                    const isSelected = selectedProcId === proc.id;
                    return (
                      <button
                        key={proc.id}
                        type="button"
                        onClick={() => {
                          setSelectedProcId(proc.id);
                          setCustomAmount(proc.amount);
                          setSelectedTenure(proc.tenure);
                        }}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
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
                        <div className="flex items-baseline justify-between pt-1">
                          <span className="text-base font-black text-[#0B2450] font-mono">
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
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">Or Slide Custom Treatment Cost:</span>
                    <span className="text-base font-black text-[#0867E8] font-mono">
                      ₹{customAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={15000}
                    max={250000}
                    step={5000}
                    value={customAmount}
                    onChange={(e) => setCustomAmount(Number(e.target.value))}
                    className="w-full accent-[#0867E8] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>₹15,000</span>
                    <span>₹1,00,000</span>
                    <span>₹2,50,000</span>
                  </div>
                </div>

                {/* Live Settlement & Non-Recourse Guarantee Box */}
                <div className="p-4 bg-gradient-to-r from-emerald-50/80 to-blue-50/50 border border-emerald-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-widest block">
                      DOCTOR SETTLEMENT BREAKDOWN
                    </span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-2xl font-black text-[#0B2450] font-mono">
                        ₹{customAmount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                        Direct Current Account
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 block mt-0.5">
                      Settles T+1 • Zero Default Risk to Clinic • Bank manages collections
                    </span>
                  </div>

                  <div className="bg-white border border-emerald-300 rounded-xl px-3.5 py-2 text-right shadow-xs shrink-0">
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Clinic Recourse</span>
                    <span className="text-xs font-black text-emerald-700">₹0 (Zero Risk)</span>
                  </div>
                </div>
              </div>

              {/* Card 2: The 10-Second Chairside Script (Doctor Objection Handling) */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-[#0867E8]">
                  <MessageSquare size={18} />
                  <h4 className="text-base font-extrabold text-[#0B2450]">
                    The 10-Second Chairside Closing Script
                  </h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  When a patient hesitates at high treatment quotes, train your doctor and reception to use this exact 2-sentence script:
                </p>

                <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs">
                  <div className="flex items-start gap-2.5">
                    <span className="font-black text-[#0867E8] shrink-0 bg-blue-100 px-2 py-0.5 rounded-md">Doctor:</span>
                    <p className="text-slate-800 font-medium italic leading-relaxed">
                      "Rahul, the complete aligner treatment is ₹{customAmount.toLocaleString('en-IN')}. Would you prefer paying full today, or would you like us to set up an easy monthly EMI of around ₹{calculatedEmi.toLocaleString('en-IN')}/mo on your phone in 2 minutes?"
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5 pt-1 border-t border-slate-200">
                    <span className="font-black text-emerald-700 shrink-0 bg-emerald-100 px-2 py-0.5 rounded-md">Patient:</span>
                    <p className="text-slate-800 font-medium italic leading-relaxed">
                      "Wait doctor, I can do ₹{calculatedEmi.toLocaleString('en-IN')}/mo without a credit card?"
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5 pt-1 border-t border-slate-200">
                    <span className="font-black text-[#0867E8] shrink-0 bg-blue-100 px-2 py-0.5 rounded-md">Doctor:</span>
                    <p className="text-slate-800 font-medium italic leading-relaxed">
                      "Yes, our front desk sends a secure link to your WhatsApp right now. You verify your Aadhaar OTP, approve in Google Pay or PhonePe, and we start your digital 3D scan today."
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 font-medium">
                  <span>Result:</span>
                  <strong className="text-emerald-700">+45% Case Acceptance Rate Chairside</strong>
                </div>
              </div>

              {/* Card 3: Step-by-Step Stage Navigator */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                  FAST-FORWARD MOBILE SCREEN ON THE RIGHT:
                </span>
                <div className="grid grid-cols-5 gap-1.5">
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
                      onClick={() => setSimulatorStep(item.s as any)}
                      className={`py-2 px-1 text-center rounded-xl border text-[11px] font-extrabold transition-all cursor-pointer ${
                        simulatorStep === item.s
                          ? 'bg-[#0867E8] text-white border-[#0867E8] shadow-sm'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column (5 cols): Realistic iPhone 16 Device Frame */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="sticky top-20 w-full max-w-[360px]">
                
                {/* Device Frame */}
                <div className="relative bg-[#0F172A] rounded-[52px] p-3.5 shadow-2xl border-[5px] border-[#334155] shadow-slate-900/40">
                  
                  {/* Dynamic Island Notch */}
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-30 flex items-center justify-between px-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>

                  {/* Device Screen Content */}
                  <div className="bg-white rounded-[40px] overflow-hidden min-h-[580px] flex flex-col justify-between text-slate-900 relative">
                    
                    {/* iOS Status Bar */}
                    <div className="pt-3 px-6 pb-2 flex justify-between items-center text-[11px] font-bold text-slate-800 border-b border-slate-100 bg-white">
                      <span>9:41</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono">5G</span>
                        <div className="w-5 h-2.5 border border-slate-800 rounded-sm p-0.5">
                          <div className="w-full h-full bg-slate-800 rounded-xs" />
                        </div>
                      </div>
                    </div>

                    {/* App Header */}
                    <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
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
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-4">

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

                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-slate-700 space-y-1">
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
                            className="w-full py-3 bg-[#0867E8] hover:bg-[#0756c7] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <span>Open EMI Pre-Approval</span>
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      )}

                      {/* Screen 2: Multi-Lender Match Engine */}
                      {simulatorStep === 2 && (
                        <div className="space-y-3 animate-in fade-in duration-200">
                          <div className="text-center space-y-0.5">
                            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                              STEP 2: PRE-APPROVAL FOUND
                            </span>
                            <h5 className="text-sm font-extrabold text-slate-900">
                              Instant Multi-Lender Limits
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

                          {/* Lender Choices */}
                          <div className="space-y-1.5">
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                              Select Lending Partner:
                            </span>
                            {[
                              { name: 'Piramal Capital', tag: 'ETB Pre-Approved', badge: 'Fastest (30s)' },
                              { name: 'Bajaj Finserv', tag: 'ETB Instant Limit', badge: 'High Approval' },
                              { name: 'Tata Capital', tag: 'ETB Flexi EMI', badge: '₹0 Foreclosure' },
                              { name: 'L&T Finance / Aditya Birla', tag: 'NTB Bureau Match', badge: 'New Borrowers' }
                            ].map((lender, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => setSelectedLender(lender.name)}
                                className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
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
                            className="w-full py-3 bg-[#0867E8] hover:bg-[#0756c7] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
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

                          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs">
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
                                  onClick={() => setSelectedTenure(t)}
                                  className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                    selectedTenure === t
                                      ? 'bg-[#0867E8] border-[#0867E8] text-white shadow-xs'
                                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                                  }`}
                                >
                                  {t}M
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Live Monthly Debit Card */}
                          <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl space-y-1 text-center">
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
                            className="w-full py-3 bg-[#0867E8] hover:bg-[#0756c7] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
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

                          <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl space-y-2 text-xs">
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

                          <div className="p-3 bg-white border border-slate-200 rounded-xl text-[11px] text-slate-600 space-y-1">
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
                            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 cursor-pointer"
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

                          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-left space-y-2 text-xs">
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
                            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                          >
                            Restart Patient Journey
                          </button>
                        </div>
                      )}

                    </div>

                    {/* Bottom Home Indicator Bar */}
                    <div className="py-2 flex justify-center bg-white">
                      <div className="w-28 h-1 bg-slate-300 rounded-full" />
                    </div>

                  </div>
                </div>

                <div className="mt-3 text-center">
                  <span className="text-[11px] text-slate-500 font-medium">
                    ⚡ Live simulator reflects exact mobile browser UX
                  </span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ── MODE 2: INFRASTRUCTURE VIDEO PLAYER ── */}
        {viewMode === 'video' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#0867E8] uppercase tracking-widest">
                  <Play size={13} className="fill-[#0867E8]" />
                  <span>Real Infrastructure Video Walkthrough (3:47)</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#0B2450] tracking-tight mt-0.5">
                  End-to-End Banking Rails & Lending Network Demo
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono bg-blue-50 border border-blue-200 text-[#0867E8] px-3 py-1 rounded-xl flex items-center gap-1.5 font-bold">
                  <Shield size={12} /> Powered by Plural by Pine Labs
                </span>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  title="Copy demo link"
                >
                  <Copy size={15} />
                </button>
              </div>
            </div>

            {/* Video Player Container */}
            <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-800 aspect-video max-h-[520px] mx-auto shadow-xl group">
              <video
                ref={videoRef}
                src="/videos/checkout-demo.mp4"
                className="w-full h-full object-contain cursor-pointer"
                onClick={handlePlayPause}
                onTimeUpdate={handleTimeUpdate}
                playsInline
                preload="metadata"
              />

              {/* Custom Overlay Play Button when Paused */}
              {!isPlaying && (
                <div 
                  onClick={handlePlayPause}
                  className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-slate-950/30"
                >
                  <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-[#0867E8] text-white flex items-center justify-center shadow-xl shadow-blue-500/30 group-hover:scale-110 transition-transform">
                    <Play size={32} className="ml-1 fill-white" />
                  </div>
                  <span className="mt-4 text-xs sm:text-sm font-bold text-white tracking-wide bg-slate-900/90 border border-slate-700 px-4 py-1.5 rounded-full">
                    Click to Play 2-Minute Checkout Walkthrough
                  </span>
                </div>
              )}

              {/* Controls Bar at Bottom */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/95 via-slate-950/80 to-transparent p-3 sm:p-4 flex items-center justify-between gap-3 text-xs text-white opacity-90 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={handlePlayPause}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors"
                  >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} className="fill-white" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSeek(0, 0)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    title="Restart"
                  >
                    <RotateCcw size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                  </button>
                  <span className="text-slate-300 font-mono text-[11px] hidden sm:inline">
                    {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')} / 3:47
                  </span>
                </div>

                <div className="truncate max-w-[240px] sm:max-w-md text-right">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Current Stage</span>
                  <span className="text-xs font-bold text-sky-300 truncate block">
                    {CHAPTERS[activeChapterIndex].shortTitle}
                  </span>
                </div>
              </div>
            </div>

            {/* Jump to Chapter Buttons */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <span>Fast-Forward to Key Checkout Stages:</span>
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {CHAPTERS.map((chap, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSeek(chap.time, idx)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                      activeChapterIndex === idx
                        ? 'bg-blue-50 border-[#0867E8] text-[#0B2450] shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="font-bold text-[#0867E8]">{chap.timeStr}</span>
                      {activeChapterIndex === idx && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      )}
                    </div>
                    <span className="text-[11px] font-bold leading-tight line-clamp-2">
                      {chap.shortTitle}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl text-xs text-slate-700 flex items-start gap-2.5">
              <Info size={16} className="text-[#0867E8] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong className="text-[#0B2450]">Confidentiality Notice:</strong> This public showcase is Clinaza’s clinical adaptation of our institutional credit infrastructure (powered by Plural by Pine Labs Credit Marketplace) tailored exclusively for dental clinic treatments.
              </p>
            </div>
          </div>
        )}

        {/* ── SECTION 2: WHY CLINICS CHOOSE CLINAZA OVER DISCOUNTS & KHATA ── */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1.5">
            <span className="text-[10px] font-black text-[#0867E8] uppercase tracking-widest">
              PRACTICE MARGIN PROTECTION
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B2450] tracking-tight">
              Stop Slashing 25% Margins or Chasing Khata Installments
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              How Clinaza’s point-of-care financing transforms clinical revenue and collections.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            
            {/* Column 1: Forced Cash Discount */}
            <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm">
                ✕
              </div>
              <div>
                <h4 className="font-extrabold text-[#0B2450] text-sm">Forced Cash Discounts</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Doctor slashes ₹15,000–₹25,000 on implants just to get the case closed today. Clinic absorbs the heavy revenue loss.
                </p>
              </div>
              <div className="text-[11px] font-bold text-rose-700 bg-white border border-rose-200 p-2 rounded-xl">
                Result: Destroys Practice Profit Margin
              </div>
            </div>

            {/* Column 2: In-House Khata / Bad Debt */}
            <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
                !
              </div>
              <div>
                <h4 className="font-extrabold text-[#0B2450] text-sm">In-House Clinic Installments (Khata)</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Patient pays 40% upfront and promises post-dated cheques. After month 3, patient delays visits or stops paying.
                </p>
              </div>
              <div className="text-[11px] font-bold text-amber-800 bg-white border border-amber-200 p-2 rounded-xl">
                Result: Doctor becomes an unpaid debt collector
              </div>
            </div>

            {/* Column 3: The Clinaza Advantage */}
            <div className="p-5 rounded-2xl bg-emerald-50/70 border-2 border-emerald-400 space-y-3 shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                ✓
              </div>
              <div>
                <h4 className="font-extrabold text-[#0B2450] text-sm">Clinaza Point-of-Care Financing</h4>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                  Patient gets comfortable ₹4,000–₹6,500/mo EMI on phone in 2 mins. Clinic gets 100% of treatment fee deposited T+1.
                </p>
              </div>
              <div className="text-[11px] font-extrabold text-emerald-800 bg-white border border-emerald-300 p-2 rounded-xl">
                Result: 100% Revenue Protected • Zero Risk
              </div>
            </div>

          </div>
        </div>

        {/* ── SECTION 3: SIMPLE SOLE PROPRIETOR CLINIC ONBOARDING ── */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
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
              className="px-5 py-2.5 bg-[#0867E8] hover:bg-[#0756c7] text-white rounded-xl text-xs font-black transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5 shrink-0 self-start sm:self-center"
            >
              <span>Upload Clinic KYC Online</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Sole Proprietorship Card (Highlighted) */}
            <div className="p-6 rounded-2xl bg-blue-50/40 border-2 border-[#0867E8] space-y-4 relative overflow-hidden">
              <div className="inline-block text-[10px] font-black uppercase tracking-wider bg-[#0867E8] text-white px-2.5 py-1 rounded-full">
                Most Common (95% of Clinics)
              </div>

              <div>
                <h3 className="text-base font-extrabold text-[#0B2450]">
                  Individual Doctor / Sole Proprietorship Clinic
                </h3>
                <p className="text-xs text-slate-600">Standard practice registered in doctor's individual name.</p>
              </div>

              <div className="space-y-2.5 text-xs text-slate-800">
                <div className="flex items-start gap-2.5">
                  <BadgeCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>1. Doctor PAN &amp; Aadhaar Card</strong> (Self-attested)</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <BadgeCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>2. Clinic Current Account Cancelled Cheque</strong> (or last 3-month statement)</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <BadgeCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>3. Business Proof</strong> (Any ONE: Udyam MSME / State Dental Council Reg / Shop Act)</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <BadgeCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>4. Signed Plural MAF</strong> (Merchant Application Form)</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <BadgeCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>5. GST Exemption Self-Declaration</strong> (Standard 1-page form, healthcare is legally exempt)</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-100/80 border border-emerald-300 rounded-xl text-[11px] text-emerald-900 flex items-center gap-2 font-medium">
                <Check size={14} className="text-emerald-700 stroke-[3] shrink-0" />
                <span>Zero Corporate Friction: No Company PAN, No Board Resolution, No MOA/AOA needed.</span>
              </div>
            </div>

            {/* Pvt Ltd / LLP Clinic */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="inline-block text-[10px] font-black uppercase tracking-wider bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full">
                Corporate / Chains
              </div>

              <div>
                <h3 className="text-base font-extrabold text-[#0B2450]">
                  Corporate Clinic (Pvt Ltd / LLP / Hospital)
                </h3>
                <p className="text-xs text-slate-600">Dental chain entities registered under MCA.</p>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <span>1. Company PAN Card &amp; Certificate of Incorporation (COI)</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <span>2. MOA &amp; AOA / LLP Agreement</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <span>3. Board Resolution (BR) on Company Letterhead</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <span>4. PAN &amp; Aadhaar of Authorized Signatory Directors</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <span>5. Company Current Account Cancelled Cheque &amp; GST</span>
                </div>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl text-[11px] text-slate-500">
                Standard corporate KYC processed in 24 hours via Plural by Pine Labs underwriting desk.
              </div>
            </div>

          </div>
        </div>

        {/* ── SECTION 4: DOCTOR FAQ ACCORDION ── */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <span className="text-[10px] font-black text-[#0867E8] uppercase tracking-widest">
              DOCTOR CLARIFICATIONS
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#0B2450]">
              Questions Doctors Frequently Ask
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
              <h4 className="font-extrabold text-[#0B2450] text-sm flex items-center gap-1.5">
                <HelpCircle size={15} className="text-[#0867E8]" />
                <span>What happens if the patient defaults on EMIs?</span>
              </h4>
              <p className="text-slate-600 leading-relaxed">
                The financing is <strong>100% non-recourse</strong> to the dental clinic. All credit risk is absorbed by the RBI-regulated bank or NBFC (Piramal, Bajaj, Tata, etc.). The clinic is never asked to repay or collect defaulting amounts.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
              <h4 className="font-extrabold text-[#0B2450] text-sm flex items-center gap-1.5">
                <HelpCircle size={15} className="text-[#0867E8]" />
                <span>Do I need to buy or rent a physical POS machine?</span>
              </h4>
              <p className="text-slate-600 leading-relaxed">
                No hardware POS rental or terminal deposit is needed. The entire checkout flow runs digitally via a secure QR standee at your front desk or a direct WhatsApp payment link dispatched to the patient’s phone.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
              <h4 className="font-extrabold text-[#0B2450] text-sm flex items-center gap-1.5">
                <HelpCircle size={15} className="text-[#0867E8]" />
                <span>When does the clinic receive the money?</span>
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Settlement is <strong>guaranteed T+1</strong>. For example, if a patient gets approved for ₹75,000 clear aligners on Monday afternoon, the full settlement lands in the clinic current account on Tuesday by 11:00 AM.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
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

        {/* ── SECTION 5: BOTTOM CONVERSION & WHATSAPP SHARE ── */}
        <div className="bg-gradient-to-r from-[#0B2450] to-[#0F172A] text-white rounded-3xl p-6 sm:p-10 text-center space-y-4 shadow-xl">
          <h3 className="text-2xl sm:text-3xl font-black">
            Ready to Offer Instant Patient EMIs at Your Front Desk?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Stop losing high-value implant and aligner cases to price objections. Get your clinic verified in under 24 hours with ₹0 setup fee and ₹0 AMC.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/clinic-kyc"
              className="w-full sm:w-auto px-6 py-3.5 bg-[#0867E8] hover:bg-[#0756c7] text-white rounded-xl text-xs font-black transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
            >
              <span>Submit Clinic Documents Online</span>
              <ArrowRight size={15} />
            </Link>

            <button
              type="button"
              onClick={handleShare}
              className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-900/30"
            >
              <Share2 size={15} />
              <span>Share Flow via WhatsApp</span>
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}
