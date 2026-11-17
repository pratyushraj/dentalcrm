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
  ExternalLink,
  Info,
  Banknote,
  FileText,
  BadgeCheck,
  AlertCircle,
  HelpCircle,
  Zap,
  PhoneCall,
  UserCheck
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
    description: 'RBI-regulated Account Aggregator securely fetches 3-month bank statement (SBI, ICICI, Axis) with 1 OTP.'
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
  { name: 'Single Dental Implant', amount: 45000, tenure: 12, popular: false },
  { name: 'Clear Aligners (Both Arches)', amount: 75000, tenure: 12, popular: true },
  { name: 'Full Mouth Rehab / All-on-4', amount: 160000, tenure: 18, popular: false },
  { name: 'Multiple Implants & Bridges', amount: 95000, tenure: 12, popular: false },
  { name: 'Root Canal + Zirconia Crown', amount: 22000, tenure: 6, popular: false }
];

export default function LoanDemoPage() {
  // Video player state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  // Interactive Simulator state
  const [selectedProcedure, setSelectedProcedure] = useState(PROCEDURES[1]);
  const [customAmount, setCustomAmount] = useState(75000);
  const [selectedTenure, setSelectedTenure] = useState(12);
  const [simulatorStep, setSimulatorStep] = useState<1 | 2 | 3 | 4 | 5>(2);
  const [selectedLender, setSelectedLender] = useState('Piramal Capital');

  // Calculation (Annualized indicative rate ~11.5% p.a. reducing)
  const annualInterestRate = 0.115;
  const monthlyRate = annualInterestRate / 12;
  const calculatedEmi = Math.round(
    (customAmount * monthlyRate * Math.pow(1 + monthlyRate, selectedTenure)) /
    (Math.pow(1 + monthlyRate, selectedTenure) - 1)
  );

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
    toast.success('Link copied to clipboard! Share it with your clinic reception or staff.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-[#0867E8] selection:text-white">
      <SEOHead
        title="Patient EMI Checkout Flow & Infrastructure Demo | Clinaza"
        description="Experience Clinaza's 2-minute paperless patient financing checkout: multi-lender approval (Piramal, Bajaj, Tata, HDFC), 1-click UPI autopay, and T+1 direct clinic settlement."
        canonicalUrl="https://www.clinaza.in/checkout-flow"
      />

      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0867E8] text-white flex items-center justify-center font-black text-base shadow-md shadow-blue-600/30">
            C
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-tight text-white flex items-center gap-2">
              CLINAZA <span className="text-[10px] font-bold text-sky-300 bg-sky-950/90 border border-sky-800 px-1.5 py-0.5 rounded-md">CHECKOUT OS</span>
            </span>
            <span className="text-[10px] text-slate-400">Point-of-Care Healthcare Financing Network</span>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-700/80 text-emerald-300 text-xs font-bold transition-all"
            title="Share with Clinic Reception"
          >
            <Share2 size={13} />
            <span className="hidden sm:inline">Share with Reception</span>
          </button>
          <Link
            to="/clinic-kyc"
            className="px-3.5 py-1.5 bg-[#0867E8] hover:bg-[#0756c7] text-white rounded-xl text-xs font-black transition-all shadow-xs flex items-center gap-1"
          >
            <span>Onboard Clinic</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 sm:px-6 pt-10 pb-8 max-w-6xl mx-auto w-full text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-900/40 border border-blue-600/60 text-sky-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles size={14} className="text-sky-400 animate-pulse" />
          <span>Interactive Patient Checkout & Infrastructure Walkthrough</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
          How Patient EMI Financing Works <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
            At Your Dental Clinic Front Desk
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Zero clinic credit risk, T+1 direct settlement to your current account, and instant multi-lender paperless approval for Dental Implants, Aligners, and Full Mouth Rehab.
        </p>

        {/* Quick Highlights Bar */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-300 font-semibold">
          <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 px-3 py-1 rounded-full">
            <Check size={14} /> 100% Non-Recourse (₹0 Clinic Liability)
          </span>
          <span className="flex items-center gap-1.5 text-sky-300 bg-sky-950/40 border border-sky-900/60 px-3 py-1 rounded-full">
            <Clock size={14} /> 2-Minute Digital Approval
          </span>
          <span className="flex items-center gap-1.5 text-indigo-300 bg-indigo-950/40 border border-indigo-900/60 px-3 py-1 rounded-full">
            <CreditCard size={14} /> No Physical POS Machine Needed
          </span>
        </div>
      </section>

      {/* Main Content Layout */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pb-16 space-y-12">

        {/* 1. Video Infrastructure Demonstration */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-7 shadow-2xl backdrop-blur-md space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-black text-sky-400 uppercase tracking-widest">
                <Play size={12} className="fill-sky-400" />
                <span>End-to-End Infrastructure Video Demo</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                Watch the Full Patient EMI Journey (3:47)
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono bg-blue-950/80 border border-blue-800/80 text-sky-300 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                <Shield size={12} /> Powered by Plural by Pine Labs
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Copy demo link"
              >
                <Copy size={15} />
              </button>
            </div>
          </div>

          {/* Video Player Container */}
          <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-800 aspect-video max-h-[520px] mx-auto shadow-2xl group">
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
                className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px] flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-slate-950/40"
              >
                <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-[#0867E8] text-white flex items-center justify-center shadow-xl shadow-blue-500/30 group-hover:scale-110 transition-transform">
                  <Play size={32} className="ml-1 fill-white" />
                </div>
                <span className="mt-4 text-xs sm:text-sm font-bold text-white tracking-wide bg-slate-900/90 border border-slate-700 px-3.5 py-1.5 rounded-full">
                  Click to Watch 2-Minute Checkout Walkthrough
                </span>
              </div>
            )}

            {/* Controls Bar at Bottom */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/95 via-slate-950/80 to-transparent p-3 sm:p-4 flex items-center justify-between gap-3 text-xs opacity-90 group-hover:opacity-100 transition-opacity">
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
                <span className="text-slate-400 font-mono text-[11px] hidden sm:inline">
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
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
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
                      ? 'bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/10'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="font-bold text-sky-400">{chap.timeStr}</span>
                    {activeChapterIndex === idx && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    )}
                  </div>
                  <span className="text-[11px] font-bold leading-tight line-clamp-2">
                    {chap.shortTitle}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3.5 bg-blue-950/30 border border-blue-900/40 rounded-xl text-xs text-slate-300 flex items-start gap-2.5">
            <Info size={16} className="text-sky-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-white">Confidentiality & Partner Compliance:</strong> This public showcase is Clinaza’s dental-adapted walkthrough of our institutional lending network powered by Plural by Pine Labs. Internal banking partner emails and retail credentials from the confidential CMP deck have been sanitized.
            </p>
          </div>
        </div>

        {/* 2. Interactive In-App Patient Experience Simulator */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-400 uppercase tracking-widest bg-emerald-950/60 border border-emerald-800/80 px-3 py-1 rounded-full">
              <Smartphone size={13} />
              <span>Interactive Patient Simulator</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Test What Your Patient Experiences on Mobile
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Select a dental treatment or customize the amount to see how multi-lender approval, tenure selection, and clinic payout calculate in real time.
            </p>
          </div>

          {/* Procedure Preset Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block text-center">
              Choose Dental Treatment Preset:
            </label>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {PROCEDURES.map((proc, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setSelectedProcedure(proc);
                    setCustomAmount(proc.amount);
                    setSelectedTenure(proc.tenure);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    customAmount === proc.amount
                      ? 'bg-[#0867E8] text-white border-[#0867E8] shadow-md shadow-blue-500/20'
                      : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{proc.name}</span>
                  <span className="ml-1.5 font-mono text-[11px] opacity-80">(₹{proc.amount.toLocaleString('en-IN')})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step Progress Bar */}
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2 max-w-2xl mx-auto pt-2">
            {[
              { num: 1, label: '1. QR / Link' },
              { num: 2, label: '2. Multi-Lender' },
              { num: 3, label: '3. EMI Plan' },
              { num: 4, label: '4. UPI Mandate' },
              { num: 5, label: '5. Clinic Payout' }
            ].map((s) => (
              <button
                key={s.num}
                type="button"
                onClick={() => setSimulatorStep(s.num as any)}
                className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer border ${
                  simulatorStep === s.num
                    ? 'bg-[#0867E8] border-[#0867E8] text-white font-bold shadow-md'
                    : simulatorStep > s.num
                    ? 'bg-slate-950 border-slate-800 text-emerald-400 font-semibold'
                    : 'bg-slate-950/50 border-slate-800/80 text-slate-500'
                }`}
              >
                <div className="text-[10px] sm:text-xs truncate">{s.label}</div>
              </button>
            ))}
          </div>

          {/* Interactive Screen Container (Mobile-like viewport) */}
          <div className="max-w-xl mx-auto bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-inner space-y-5">

            {/* Screen Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#0867E8] text-white flex items-center justify-center font-black text-xs">
                  C
                </div>
                <span className="font-bold text-white">Clinaza Front-Desk Gateway</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-full">
                🔒 256-Bit RBI Compliant
              </span>
            </div>

            {/* Step 1: Front Desk Link Dispatch */}
            {simulatorStep === 1 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="text-center space-y-1">
                  <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Step 1 of 5</span>
                  <h3 className="text-lg font-bold text-white">Chairside QR Scan / WhatsApp Link</h3>
                  <p className="text-xs text-slate-400">
                    Front desk dispatches a payment link to patient's WhatsApp in 5 seconds.
                  </p>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Treatment:</span>
                    <span className="font-bold text-white">{selectedProcedure.name}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Invoice Amount:</span>
                    <span className="font-bold text-emerald-400 font-mono text-sm">
                      ₹{customAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Patient Mobile:</span>
                    <span className="font-mono text-slate-200">+91 98765 •••••</span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-950/30 border border-emerald-900/50 rounded-xl flex items-center gap-2.5 text-xs text-emerald-300">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span>OTP verified via Aadhaar-linked mobile in 8 seconds. Zero hard credit bureau inquiry.</span>
                </div>

                <button
                  type="button"
                  onClick={() => setSimulatorStep(2)}
                  className="w-full py-3.5 bg-[#0867E8] hover:bg-[#0756c7] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Check Instant Pre-Approved Limits</span>
                  <ChevronRight size={15} />
                </button>
              </div>
            )}

            {/* Step 2: Instant Multi-Lender Match Engine */}
            {simulatorStep === 2 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="text-center space-y-1">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Step 2 of 5</span>
                  <h3 className="text-lg font-bold text-white">Multi-Lender Pre-Approval Found!</h3>
                  <p className="text-xs text-slate-400">
                    Patient matched with top RBI-regulated lending rails instantly.
                  </p>
                </div>

                {/* Pre-Approved Hero Limit Card */}
                <div className="p-4 bg-gradient-to-r from-blue-950/60 to-slate-900 border border-blue-800/80 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">
                      Approved Financing Limit
                    </span>
                    <span className="text-2xl font-black text-white font-mono">₹1,50,000</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Covers 100% of treatment cost</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase block">Processing Fee</span>
                    <span className="text-xs font-black text-emerald-400">₹0 (Waived)</span>
                  </div>
                </div>

                {/* Participating Lender Options */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Select Financing Partner:
                  </span>
                  {[
                    { name: 'Piramal Capital', tag: 'ETB Pre-Approved', badge: 'Fastest 30s', rate: '11.5% p.a.' },
                    { name: 'Bajaj Finserv', tag: 'ETB Instant Limit', badge: 'High Approval', rate: '11.8% p.a.' },
                    { name: 'Tata Capital', tag: 'ETB Digital Flexi', badge: 'Zero Foreclosure', rate: '11.6% p.a.' },
                    { name: 'L&T Finance / Aditya Birla', tag: 'NTB Soft Bureau Match', badge: 'New Borrowers', rate: '12.0% p.a.' }
                  ].map((lender, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedLender(lender.name)}
                      className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        selectedLender === lender.name
                          ? 'bg-blue-600/20 border-blue-500 text-white shadow-sm'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          selectedLender === lender.name ? 'border-[#0867E8] bg-[#0867E8]' : 'border-slate-600'
                        }`}>
                          {selectedLender === lender.name && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <div>
                          <div className="text-xs font-bold">{lender.name}</div>
                          <div className="text-[10px] text-slate-400">{lender.tag}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-1.5 py-0.5 rounded-md">
                          {lender.badge}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setSimulatorStep(3)}
                  className="w-full py-3.5 bg-[#0867E8] hover:bg-[#0756c7] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Select Tenure & Calculate EMI</span>
                  <ChevronRight size={15} />
                </button>
              </div>
            )}

            {/* Step 3: Flexible Tenure & EMI Calculator */}
            {simulatorStep === 3 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="text-center space-y-1">
                  <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Step 3 of 5</span>
                  <h3 className="text-lg font-bold text-white">Choose Repayment Duration</h3>
                  <p className="text-xs text-slate-400">
                    Patient selects the monthly installment that fits their family budget.
                  </p>
                </div>

                {/* Amount Slider */}
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-semibold">Treatment Financing Amount:</span>
                    <span className="font-mono font-bold text-white text-sm">₹{customAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min={15000}
                    max={200000}
                    step={5000}
                    value={customAmount}
                    onChange={(e) => setCustomAmount(Number(e.target.value))}
                    className="w-full accent-[#0867E8] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>₹15,000</span>
                    <span>₹1,00,000</span>
                    <span>₹2,00,000</span>
                  </div>
                </div>

                {/* Tenure Selector */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Select Tenure:
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {[3, 6, 12, 18].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSelectedTenure(t)}
                        className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          selectedTenure === t
                            ? 'bg-[#0867E8] border-[#0867E8] text-white shadow-md'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {t} Months
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Monthly Debit Card */}
                <div className="p-4 bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-800/80 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                      Estimated Monthly Debit
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-2xl font-black text-white font-mono">
                        ₹{calculatedEmi.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-400">/mo</span>
                    </div>
                  </div>
                  <div className="text-right text-[11px] text-slate-300 space-y-0.5">
                    <div>Lender: <strong className="text-white">{selectedLender}</strong></div>
                    <div className="text-emerald-400 font-semibold">₹0 Hidden Charges</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSimulatorStep(4)}
                  className="w-full py-3.5 bg-[#0867E8] hover:bg-[#0756c7] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Setup 1-Click UPI Autopay Mandate</span>
                  <ChevronRight size={15} />
                </button>
              </div>
            )}

            {/* Step 4: UPI Autopay Mandate */}
            {simulatorStep === 4 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="text-center space-y-1">
                  <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Step 4 of 5</span>
                  <h3 className="text-lg font-bold text-white">1-Click UPI Autopay Mandate</h3>
                  <p className="text-xs text-slate-400">
                    Patient authorizes recurring monthly debit via their everyday UPI app in 15 seconds.
                  </p>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Monthly Mandate Amount:</span>
                    <span className="font-bold text-white font-mono">₹{calculatedEmi.toLocaleString('en-IN')}/mo</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Frequency:</span>
                    <span className="font-bold text-slate-200">Monthly ({selectedTenure} Cycles)</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Supported UPI Handles:</span>
                    <span className="text-slate-300">Google Pay, PhonePe, Paytm, BHIM</span>
                  </div>
                </div>

                <div className="p-3.5 bg-blue-950/40 border border-blue-900/60 rounded-xl space-y-1 text-xs text-slate-300">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <Shield size={14} className="text-sky-400" />
                    <span>Zero Paperwork, Zero Physical Cheques</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Patient enters their UPI PIN inside Google Pay / PhonePe. The recurring e-mandate is securely registered with NPCI instantly.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSimulatorStep(5)}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20"
                >
                  <CheckCircle2 size={16} />
                  <span>Authorize Mandate & Finalize Disbursement</span>
                </button>
              </div>
            )}

            {/* Step 5: Instant Sanction & T+1 Clinic Payout */}
            {simulatorStep === 5 && (
              <div className="space-y-4 animate-in fade-in duration-200 text-center py-2">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                  <CheckCircle2 size={32} />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">
                    Sanction Confirmed &bull; Non-Recourse
                  </span>
                  <h3 className="text-xl font-black text-white">Treatment Financing Approved!</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Patient can start treatment chairside immediately.
                  </p>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-left space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Clinic Payout Amount:</span>
                    <span className="font-mono font-black text-emerald-400 text-sm">
                      ₹{customAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Settlement Timeline:</span>
                    <span className="font-bold text-white">T+1 (Tomorrow 11:00 AM)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Disbursement Channel:</span>
                    <span className="font-bold text-slate-200">Direct Doctor Current Account (NEFT/IMPS)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Clinic Default Liability:</span>
                    <span className="font-bold text-emerald-400">₹0 (100% Non-Recourse)</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-[11px] text-slate-400 text-left">
                  💡 <strong className="text-slate-200">Doctor Guarantee:</strong> Even if the patient delays or defaults on future monthly EMIs, the bank/NBFC absorbs 100% of the credit risk. The clinic keeps the full treatment fee.
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSimulatorStep(1)}
                    className="w-1/2 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                  >
                    Reset Demo
                  </button>
                  <Link
                    to="/clinic-kyc"
                    className="w-1/2 py-3 bg-[#0867E8] hover:bg-[#0756c7] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Enable at Clinic</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. Clinic KYC & Simple Onboarding Checklist */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-black text-sky-400 uppercase tracking-widest">
                <FileText size={13} />
                <span>Zero Corporate Friction</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                Simple Documents to Onboard Your Dental Clinic
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                90%+ of dental clinics in India operate as Sole Proprietorships. We do NOT require corporate board resolutions or MOA/AOA.
              </p>
            </div>

            <Link
              to="/clinic-kyc"
              className="px-4 py-2 bg-[#0867E8] hover:bg-[#0756c7] text-white rounded-xl text-xs font-black transition-all shadow-xs flex items-center gap-1.5 shrink-0 self-start sm:self-center"
            >
              <span>Upload Clinic KYC Online</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sole Proprietorship Card (Standard) */}
            <div className="p-5 rounded-2xl bg-slate-950 border-2 border-blue-600/50 space-y-4 relative overflow-hidden">
              <div className="absolute top-3 right-3 text-[10px] font-black uppercase tracking-wider bg-[#0867E8] text-white px-2.5 py-1 rounded-full">
                Most Common (95%)
              </div>

              <div>
                <span className="text-xs font-black text-sky-400 uppercase tracking-wider">Category 1</span>
                <h3 className="text-base font-bold text-white mt-0.5">Individual Doctor / Sole Proprietorship Clinic</h3>
                <p className="text-xs text-slate-400">Dr. Clinic Name registered in doctor's individual name.</p>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-start gap-2.5 text-slate-200">
                  <BadgeCheck size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>1. Doctor PAN & Aadhaar Card</strong> (Self-attested)</span>
                </div>
                <div className="flex items-start gap-2.5 text-slate-200">
                  <BadgeCheck size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>2. Clinic Current Account Cancelled Cheque</strong> (or last 3-month statement)</span>
                </div>
                <div className="flex items-start gap-2.5 text-slate-200">
                  <BadgeCheck size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>3. Business Proof</strong> (Any ONE: Udyam MSME / State Dental Council Reg / Shop Act)</span>
                </div>
                <div className="flex items-start gap-2.5 text-slate-200">
                  <BadgeCheck size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>4. Signed Plural MAF</strong> (Merchant Application Form)</span>
                </div>
                <div className="flex items-start gap-2.5 text-slate-200">
                  <BadgeCheck size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>5. GST Exemption Self-Declaration</strong> (Standard 1-page form, healthcare is legally exempt)</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-950/40 border border-emerald-900/60 rounded-xl text-[11px] text-emerald-300 flex items-center gap-2">
                <Check size={14} className="shrink-0" />
                <span>Zero Corporate Hassle: No Company PAN, No Board Resolution, No MOA/AOA needed.</span>
              </div>
            </div>

            {/* Pvt Ltd / LLP Clinic */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div>
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Category 2</span>
                <h3 className="text-base font-bold text-white mt-0.5">Corporate Clinic (Pvt Ltd / LLP / Hospital)</h3>
                <p className="text-xs text-slate-400">Dental chain entities registered under MCA.</p>
              </div>

              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <span>1. Company PAN Card & Certificate of Incorporation (COI)</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <span>2. MOA & AOA / LLP Agreement</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <span>3. Board Resolution (BR) on Company Letterhead</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <span>4. PAN & Aadhaar of Authorized Signatory Directors</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <span>5. Company Current Account Cancelled Cheque & GST Certificate</span>
                </div>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-[11px] text-slate-400">
                Standard corporate KYC processed in 24 hours via Plural by Pine Labs desk.
              </div>
            </div>
          </div>
        </div>

        {/* 4. Frequently Asked Questions by Dentists */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl backdrop-blur-md space-y-5">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <span className="text-xs font-black text-sky-400 uppercase tracking-widest">
              Doctor Clarifications
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Questions Doctors Frequently Ask
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-1.5">
              <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                <HelpCircle size={15} className="text-sky-400" />
                <span>What happens if the patient defaults on EMIs?</span>
              </h4>
              <p className="text-slate-400 leading-relaxed">
                The financing is <strong>100% non-recourse</strong> to the dental clinic. All credit risk is absorbed by the RBI-regulated bank or NBFC (Piramal, Bajaj, Tata, etc.). The clinic is never asked to repay or collect defaulting amounts.
              </p>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-1.5">
              <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                <HelpCircle size={15} className="text-sky-400" />
                <span>Do I need to buy or rent a physical POS machine?</span>
              </h4>
              <p className="text-slate-400 leading-relaxed">
                No hardware POS rental or terminal deposit is needed. The entire checkout flow runs digitally via a secure QR standee at your front desk or a direct WhatsApp payment link dispatched to the patient’s phone.
              </p>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-1.5">
              <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                <HelpCircle size={15} className="text-sky-400" />
                <span>When does the clinic receive the money?</span>
              </h4>
              <p className="text-slate-400 leading-relaxed">
                Settlement is <strong>T+1</strong>. For example, if a patient gets approved for ₹75,000 clear aligners on Monday afternoon, the full settlement lands in the clinic current account on Tuesday by 11:00 AM.
              </p>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-1.5">
              <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                <HelpCircle size={15} className="text-sky-400" />
                <span>Why don’t dental clinics need GST registration?</span>
              </h4>
              <p className="text-slate-400 leading-relaxed">
                Healthcare services provided by clinical establishments and authorized medical/dental practitioners are legally exempt from GST under Ministry of Finance Notification No. 12/2017-Central Tax. A simple self-declaration satisfies compliance.
              </p>
            </div>
          </div>
        </div>

        {/* 5. Bottom Share & Action Bar */}
        <div className="bg-gradient-to-r from-blue-900/40 via-indigo-950/40 to-slate-900 border border-blue-800/60 rounded-3xl p-6 sm:p-10 text-center space-y-4">
          <h3 className="text-xl sm:text-3xl font-black text-white">
            Ready to Offer Instant Patient EMIs at Your Front Desk?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Stop losing high-value implant and aligner cases to price objections. Get your clinic verified in under 24 hours with ₹0 setup fee and ₹0 AMC.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/clinic-kyc"
              className="w-full sm:w-auto px-6 py-3.5 bg-[#0867E8] hover:bg-[#0756c7] text-white rounded-xl text-xs font-black transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
            >
              <span>Submit Clinic Documents</span>
              <ArrowRight size={15} />
            </Link>

            <button
              type="button"
              onClick={handleShare}
              className="w-full sm:w-auto px-6 py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2"
            >
              <Share2 size={15} />
              <span>Share Page via WhatsApp</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
