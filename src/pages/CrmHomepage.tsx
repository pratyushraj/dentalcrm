import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Sparkles, 
  ArrowRight, 
  Calendar, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  CheckCircle2,
  Activity,
  Layers,
  CreditCard,
  Building2,
  Zap,
  Lock,
  ChevronRight,
  HeartPulse,
  Sparkle
} from 'lucide-react';
import { SEOHead } from '@/components/seo/SEOHead';

export default function CrmHomepage() {
  const [calcAmount, setCalcAmount] = useState<number>(105000);

  const specialties = [
    { name: 'Dental Care', icon: '🦷', desc: 'Implants, Aligners, Braces & Crowns' },
    { name: 'Dermatology & Aesthetics', icon: '✨', desc: 'Laser, Hair Transplant & Skin Care' },
    { name: 'Ophthalmology', icon: '👁️', desc: 'LASIK & Cataract Procedures' },
    { name: 'Orthopedics', icon: '🦵', desc: 'Joint Replacement & Arthroscopy' },
    { name: 'Fertility & IVF', icon: '👶', desc: 'IVF Cycles & Reproductive Care' },
    { name: 'General Healthcare', icon: '🏥', desc: 'Elective Surgeries & Treatments' },
  ];

  const features = [
    {
      icon: <CreditCard className="h-6 w-6 text-[#0066FF]" />,
      title: "1-Click Patient EMI Checkout",
      desc: "Instantly offer 0% and low-cost EMI options (6, 12, 18, 24 months) right at the clinic billing counter."
    },
    {
      icon: <Zap className="h-6 w-6 text-[#00B894]" />,
      title: "Paperless eKYC & Credit Pull",
      desc: "Instant Aadhaar eKYC, PAN verification, and credit bureau decisioning under 2 minutes over OCEN 4.0 protocol."
    },
    {
      icon: <Building2 className="h-6 w-6 text-indigo-500" />,
      title: "Direct Clinic Disbursal",
      desc: "Treatment funds are disbursed directly into the clinic's bank account within 24 hours while patient pays monthly EMIs."
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-[#0066FF]" />,
      title: "WhatsApp Reactivation & Recall",
      desc: "Automatically re-engage dormant patients who haven't visited in 6+ months with personalized recall & treatment offers."
    },
    {
      icon: <Calendar className="h-6 w-6 text-[#00B894]" />,
      title: "Smart Clinic Practice CRM",
      desc: "Integrated patient EHR, treatment estimates, real-time appointment scheduler, and automated no-show prevention."
    },
    {
      icon: <Shield className="h-6 w-6 text-cyan-500" />,
      title: "FLDG LSP Lending Infrastructure",
      desc: "Connected directly to RBI-registered Banks and NBFC capital providers for multi-lender credit approval rates."
    }
  ];

  const stats = [
    { value: "0%", label: "Interest EMI Options" },
    { value: "< 2 mins", label: "Paperless Approval" },
    { value: "3x", label: "Treatment Acceptance" },
    { value: "100%", label: "Upfront Clinic Disbursal" }
  ];

  return (
    <div className="min-h-screen bg-[#070B14] text-white font-sora antialiased overflow-x-hidden selection:bg-[#0066FF] selection:text-white">
      <SEOHead
        title="CLINAZA — EMI for Better Health | Embedded Patient Financing Platform"
        description="Clinaza enables clinics to offer instant 0% interest EMI financing at point of care, boosting treatment acceptance for Implants, Aligners, Aesthetics & Elective Surgeries."
        image="/assets/clinaza-logo.jpg"
        canonicalUrl="https://dental-crm-red.vercel.app/"
      />

      {/* Background Radial Glows matching Logo Palette (#0066FF Blue & #00B894 Teal) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-[#0066FF]/15 via-[#00B894]/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] right-0 w-[450px] h-[450px] bg-[#00B894]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Notification Bar */}
      <div className="bg-gradient-to-r from-[#0066FF] to-[#00B894] py-2 px-4 text-center text-xs font-bold tracking-wide text-white flex items-center justify-center gap-2">
        <Sparkle size={14} className="animate-spin" />
        <span>Clinaza LSP Infrastructure: Connect your clinic with RBI-registered Banks & NBFCs for instant patient EMIs.</span>
        <Link to="/emi/onboard?name=Patient&amount=105000&partner=LendSure+AI" className="underline font-black hover:opacity-90 ml-1">
          Try Live Checkout Demo &rarr;
        </Link>
      </div>

      {/* Header */}
      <header className="border-b border-slate-800/80 backdrop-blur-xl sticky top-0 z-50 bg-[#070B14]/90">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src="/assets/clinaza-logo.jpg" 
              alt="CLINAZA Logo" 
              className="h-10 w-auto rounded-xl border border-slate-800 shadow-md group-hover:scale-105 transition-transform" 
            />
            <div className="hidden sm:block">
              <span className="text-xs font-black tracking-widest text-slate-300 block">CLINAZA</span>
              <span className="text-[9px] font-bold tracking-wider text-[#00B894] block uppercase">EMI For Better Health</span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/emi/onboard?name=Demo+Patient&amount=105000&partner=LendSure+AI"
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 rounded-xl transition-all"
            >
              <Zap size={14} className="text-[#00B894]" />
              Patient EMI Demo
            </Link>
            <Link
              to="/reactivation/login"
              className="px-5 py-2.5 bg-gradient-to-r from-[#0066FF] to-[#00B894] hover:opacity-90 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#0066FF]/20 flex items-center gap-1.5"
            >
              Clinic Portal Login
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 px-6 text-center max-w-5xl mx-auto space-y-8 z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-900/90 border border-slate-800 rounded-full text-xs font-bold tracking-wider text-[#00B894] shadow-inner">
          <Sparkles className="h-4 w-4 text-[#0066FF]" /> 
          <span>Embedded Healthcare Financing & Practice CRM</span>
        </div>

        {/* Brand Logo Banner */}
        <div className="flex justify-center my-4">
          <img 
            src="/assets/clinaza-logo.jpg" 
            alt="CLINAZA - EMI FOR BETTER HEALTH" 
            className="h-32 sm:h-44 w-auto rounded-3xl border-2 border-slate-800/80 shadow-2xl shadow-[#0066FF]/20 object-contain p-2 bg-white" 
          />
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] text-white max-w-4xl mx-auto">
          Make High-Ticket Treatments Affordable with <br />
          <span className="bg-gradient-to-r from-[#0066FF] via-[#00A3FF] to-[#00B894] bg-clip-text text-transparent">
            Instant Point-of-Care EMIs.
          </span>
        </h1>

        <p className="text-sm sm:text-lg text-slate-400 font-medium max-w-3xl mx-auto leading-relaxed">
          Clinaza enables clinics to offer paperless <strong className="text-white">0% interest EMI options</strong> directly at checkout for Implants, Aligners, Cosmetics & Elective Surgeries — turning high treatment estimates into instant approvals.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
          <Link
            to="/emi/onboard?name=Ritika+Bose&amount=105000&partner=LendSure+AI"
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#0066FF] to-[#00B894] hover:opacity-95 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-[#0066FF]/25 group"
          >
            <Zap className="h-4 w-4 fill-white" />
            Try 1-Click Patient EMI Checkout
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            to="/reactivation/login"
            className="w-full sm:w-auto px-8 py-4 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-black uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            <Building2 className="h-4 w-4 text-[#00B894]" />
            Clinic Dashboard Login
          </Link>
        </div>

        {/* Supported Medical Specialties Bar */}
        <div className="pt-8">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-4">
            FINANCING COVERAGE ACROSS ALL SPECIALTIES
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {specialties.map((s, idx) => (
              <div key={idx} className="bg-slate-900/60 border border-slate-800 p-3 rounded-2xl text-center space-y-1 hover:border-[#00B894]/40 transition-all">
                <span className="text-xl block">{s.icon}</span>
                <span className="text-xs font-bold text-white block">{s.name}</span>
                <span className="text-[9px] text-slate-400 block">{s.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 border-y border-slate-800/80 bg-slate-950/60 backdrop-blur-md relative z-10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center space-y-1">
              <span className="block text-3xl sm:text-5xl font-mono font-black bg-gradient-to-r from-[#0066FF] to-[#00B894] bg-clip-text text-transparent">
                {stat.value}
              </span>
              <span className="block text-xs text-slate-400 font-bold uppercase tracking-wider">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive EMI Calculator Section */}
      <section className="py-20 px-6 max-w-5xl mx-auto relative z-10">
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-12 shadow-2xl space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-black text-[#00B894] uppercase tracking-widest">Interactive Patient Financing Calculator</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">See How Affordable Treatment Becomes</h2>
            <p className="text-xs text-slate-400 max-w-xl mx-auto">Adjust the treatment amount to calculate instant zero-cost monthly EMI options for your patient.</p>
          </div>

          <div className="max-w-2xl mx-auto space-y-6">
            <div className="space-y-3 bg-slate-950 p-6 rounded-2xl border border-slate-800">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400">Treatment Plan Estimate:</span>
                <span className="text-2xl font-mono font-black text-[#00B894]">₹{calcAmount.toLocaleString('en-IN')}</span>
              </div>
              <input 
                type="range" 
                min="20000" 
                max="300000" 
                step="5000" 
                value={calcAmount} 
                onChange={(e) => setCalcAmount(Number(e.target.value))} 
                className="w-full accent-[#0066FF] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>₹20,000</span>
                <span>₹1,50,000</span>
                <span>₹3,00,000</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { months: 6, label: '6 Months (0% Int)' },
                { months: 12, label: '12 Months (0% Int)' },
                { months: 18, label: '18 Months Low Cost' },
                { months: 24, label: '24 Months Low Cost' },
              ].map((plan, idx) => {
                const emi = Math.round(calcAmount / plan.months);
                return (
                  <div key={idx} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-center space-y-1 hover:border-[#0066FF] transition-all">
                    <span className="text-[10px] font-bold text-slate-400 block">{plan.label}</span>
                    <span className="text-lg font-mono font-black text-white block">₹{emi.toLocaleString('en-IN')}</span>
                    <span className="text-[9px] text-[#00B894] font-semibold block">/ month</span>
                  </div>
                );
              })}
            </div>

            <div className="text-center pt-2">
              <Link
                to={`/emi/onboard?name=Patient&amount=${calcAmount}&partner=LendSure+AI`}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#0066FF] to-[#00B894] hover:opacity-90 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-[#0066FF]/20"
              >
                Launch Instant Checkout For ₹{calcAmount.toLocaleString('en-IN')}
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="py-16 sm:py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-[10px] font-black text-[#00B894] uppercase tracking-widest">Platform Capabilities</span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase text-white leading-tight">
              Engineered For Modern Healthcare Practices
            </h2>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Clinaza unifies patient financing, recall automation, and clinic management in one seamless cloud workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => (
              <div 
                key={i} 
                className="bg-slate-900/50 border border-slate-800 hover:border-slate-700 p-6 sm:p-8 rounded-3xl space-y-4 hover:bg-slate-900/80 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center border border-slate-800 group-hover:scale-105 transition-transform duration-300">
                  {feat.icon}
                </div>
                <div className="space-y-2 text-left">
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">{feat.title}</h3>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategic LSP / Lender Partnership Section */}
      <section className="py-16 px-6 bg-slate-950/80 border-t border-slate-800/80 relative z-10">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-slate-900 via-slate-900 to-[#0066FF]/10 border border-slate-800 p-8 sm:p-12 rounded-3xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="space-y-2">
              <span className="text-[10px] font-black text-[#00B894] uppercase tracking-widest">FOR BANKS & NBFC CAPITAL PROVIDERS</span>
              <h3 className="text-xl sm:text-3xl font-black text-white">Partner with Clinaza as an LSP</h3>
              <p className="text-xs text-slate-400 max-w-xl">
                We operate as an FLDG-backed Lending Service Provider (LSP) connected via OCEN 4.0 & ULI protocols, routing high-intent healthcare borrowers directly from clinics.
              </p>
            </div>
            <a
              href="mailto:partner@clinaza.com?subject=NBFC%20Lending%20Partnership%20Inquiry"
              className="px-6 py-3.5 bg-white text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-all shrink-0"
            >
              Lender Partnership Inquiry
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-12 px-6 bg-[#070B14] relative z-10 text-center sm:text-left">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img src="/assets/clinaza-logo.jpg" alt="CLINAZA Logo" className="h-8 w-auto rounded-lg border border-slate-800" />
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-slate-300 block">CLINAZA</span>
              <span className="text-[8px] font-bold text-[#00B894] block uppercase">EMI FOR BETTER HEALTH</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 text-[10px] text-slate-500 font-mono uppercase tracking-widest">
            <span>© 2026 CLINAZA Technologies. All Rights Reserved.</span>
            <Link to="/yourdentist/blog" className="hover:text-[#00B894] transition-colors underline">Patient Guides</Link>
            <span className="hidden sm:inline">&middot;</span>
            <Link to="/reactivation/login" className="hover:text-white transition-colors">Clinic Staff Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
