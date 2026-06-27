import React from 'react';
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
  CheckCircle,
  Activity,
  Layers
} from 'lucide-react';
import { SEOHead } from '@/components/seo/SEOHead';

export default function CrmHomepage() {
  const features = [
    {
      icon: <MessageSquare className="h-6 w-6 text-[#5b72ff]" />,
      title: "WhatsApp Reactivation",
      desc: "Automatically message patients who haven't visited in 6+ months with personalized recall offers."
    },
    {
      icon: <Calendar className="h-6 w-6 text-emerald-500" />,
      title: "Smart Scheduler",
      desc: "Synchronized slots with real-time availability. Automatically prevents double bookings."
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-amber-500" />,
      title: "Revenue Analytics",
      desc: "Track ROI on reactivation campaigns, average patient lifetime value, and clinic growth metrics."
    },
    {
      icon: <Users className="h-6 w-6 text-purple-500" />,
      title: "Patient Segmentation",
      desc: "Filter patients by treatment history (Implants, Aligners, Cleaning) and tag for targeted campaigns."
    },
    {
      icon: <Activity className="h-6 w-6 text-rose-500" />,
      title: "No-Show Prevention",
      desc: "Automated WhatsApp confirmations with active confirmation links to lock in the calendar."
    },
    {
      icon: <Layers className="h-6 w-6 text-cyan-500" />,
      title: "Multi-Clinic Isolation",
      desc: "Manage multiple clinic branches with secure role-based receptionist and dentist permissions."
    }
  ];

  const stats = [
    { value: "40%", label: "Recall Rate Increase" },
    { value: "10x", label: "Average Campaign ROI" },
    { value: "2,500+", label: "Appointments Booked" },
    { value: "0 mins", label: "Manual Follow-up Time" }
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sora antialiased overflow-x-hidden selection:bg-white selection:text-neutral-950">
      <SEOHead
        title="DENTAL CRM | Intelligent Patient Reactivation & Scheduling"
        description="Automate patient recalls, prevent appointment no-shows, and track clinic revenue with the next-generation Dental CRM."
        image="/assets/yourdentist/interior_operatory.jpg"
        canonicalUrl="https://dental-crm-gray.vercel.app/"
      />

      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#5b72ff]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-white/5 backdrop-blur-md sticky top-0 z-50 bg-neutral-950/80">
        <div className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#5b72ff] to-indigo-600 flex items-center justify-center shadow-lg shadow-[#5b72ff]/20">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-widest leading-none block">DENTAL CRM</span>
              <span className="text-[8px] text-neutral-500 font-bold uppercase tracking-wider mt-0.5 block">
                Managed by{' '}
                <a href="https://creatorarmour.com" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-300 transition-colors underline">
                  Creator Armour
                </a>
              </span>
            </div>
          </div>

          <Link
            to="/reactivation/login"
            className="px-5 py-2 bg-white hover:bg-neutral-100 text-neutral-950 text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-white/10"
          >
            Login to CRM
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 sm:py-28 px-6 text-center max-w-4xl mx-auto space-y-8 z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-[#5b72ff] animate-pulse">
          <Sparkles className="h-3 w-3" /> Intelligent Patient Recall System
        </div>

        <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight leading-[1.08] text-white">
          Reactivate Patients. <br />
          <span className="bg-gradient-to-r from-[#5b72ff] via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
            Automate Clinic Growth.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-neutral-400 font-medium max-w-2xl mx-auto leading-relaxed">
          The next-generation Dental CRM engineered to automatically re-engage dormant patients, eliminate appointment no-shows over WhatsApp, and scale branch revenue.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Link
            to="/reactivation/login"
            className="w-full sm:w-auto px-8 py-4 bg-[#5b72ff] hover:bg-[#4a5fed] text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 group shadow-lg shadow-[#5b72ff]/20"
          >
            Access Dashboard
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="#features"
            className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-black uppercase tracking-widest rounded-xl transition-all"
          >
            Explore Features
          </a>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-10 border-y border-white/5 bg-neutral-950/40 backdrop-blur-sm relative z-10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center space-y-1">
              <span className="block text-2xl sm:text-4xl font-mono font-black text-white">{stat.value}</span>
              <span className="block text-[8px] sm:text-[9px] text-neutral-500 font-black uppercase tracking-widest">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="py-20 sm:py-32 px-6 relative z-10">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-[9px] font-black text-[#5b72ff] uppercase tracking-widest">Core Capabilities</span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase text-white leading-tight">
              Engineered For Modern Practices
            </h2>
            <p className="text-xs text-neutral-400 font-medium leading-relaxed">
              Designed from the ground up to reduce administrative workloads, automate patient pipelines, and track performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => (
              <div 
                key={i} 
                className="bg-neutral-900/40 border border-white/5 hover:border-white/10 p-6 sm:p-8 rounded-3xl space-y-4 hover:bg-neutral-900/60 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:scale-105 transition-transform duration-300">
                  {feat.icon}
                </div>
                <div className="space-y-1.5 text-left">
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">{feat.title}</h3>
                  <p className="text-xs text-neutral-400 font-medium leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6 bg-neutral-950 relative z-10 text-center sm:text-left">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
              <Shield className="h-4.5 w-4.5 text-neutral-400" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">DENTAL CRM Portal</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 text-[9px] text-neutral-600 font-mono font-black uppercase tracking-widest">
            <span>
              © 2026{' '}
              <a href="https://www.yourdentistpatna.in/" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-400 transition-colors underline">
                YOUR DENTIST Patna
              </a>
              . Managed by{' '}
              <a href="https://creatorarmour.com" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-400 transition-colors underline">
                Creator Armour
              </a>
              .
            </span>
            <span className="hidden sm:inline">&middot;</span>
            <Link to="/reactivation/login" className="hover:text-white transition-colors">Staff Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
