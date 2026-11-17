import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Mail, Phone, MapPin, Building2, ExternalLink } from 'lucide-react';
import { SEOHead } from '@/components/seo/SEOHead';

interface LegalPageLayoutProps {
  title: string;
  subtitle: string;
  lastUpdated?: string;
  children: React.ReactNode;
  canonicalPath: string;
}

export const LegalPageLayout: React.FC<LegalPageLayoutProps> = ({
  title,
  subtitle,
  lastUpdated = 'November 05, 2026',
  children,
  canonicalPath,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-blue-100 selection:text-blue-900 relative">
      <SEOHead
        title={`${title} | Clinaza`}
        description={subtitle}
        canonicalUrl={`https://www.clinaza.in${canonicalPath}`}
      />

      {/* Atmospheric ambient fintech canvas */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-radial-fintech" />
        <div className="absolute inset-0 bg-grid-fintech mask-radial-fade opacity-60" />
      </div>

      {/* Floating Frosted Pill Navbar */}
      <header className="sticky top-3 sm:top-5 z-50 px-3 sm:px-6 max-w-6xl mx-auto w-full transition-all duration-300">
        <div className="bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-[0_8px_32px_rgba(15,23,42,0.08)] rounded-full px-3.5 sm:px-5 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group">
              <img
                src="/assets/clinaza-logo.jpg"
                alt="CLINAZA"
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl border border-slate-200/80 shadow-xs group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-black tracking-widest text-[#0B2450] leading-none">
                  CLINAZA
                </span>
                <span className="text-[9px] font-bold tracking-wider text-[#0f7a75] uppercase leading-tight mt-0.5">
                  Healthcare Financing
                </span>
              </div>
            </Link>
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100/80 border border-slate-200/60 text-[10px] font-semibold text-slate-600">
              <ShieldCheck size={12} className="text-emerald-600" />
              <span>RBI Compliance Framework</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0867E8] transition-colors py-2 px-3 rounded-full hover:bg-slate-100 min-h-[44px]"
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Home</span>
            </Link>
            <Link
              to="/reactivation/login"
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 bg-[#0B2450] hover:bg-slate-800 text-white text-xs font-bold rounded-full transition-all shadow-xs hover:shadow-md min-h-[44px]"
            >
              Doctor Login
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pt-6 pb-12 sm:pt-8 sm:pb-16 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Top Title Banner */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-4">
              <ShieldCheck size={14} />
              <span>Official Regulatory &amp; Compliance Policy</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2450] tracking-tight mb-2">
              {title}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {subtitle}
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
              <div>
                <span className="font-semibold text-slate-700">Operating Entity:</span> Mellowprints (Trade Name: CLINAZA)
              </div>
              <div>
                <span className="font-semibold text-slate-700">Last Revised:</span> {lastUpdated}
              </div>
            </div>
          </div>

          {/* Legal Document Body */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm prose prose-slate max-w-none text-slate-700 text-sm sm:text-[15px] leading-relaxed">
            {children}
          </div>

          {/* Compliance & Verification Card */}
          <div className="mt-8 bg-slate-100 border border-slate-200 rounded-xl p-5 text-xs text-slate-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-bold text-slate-800">Mellowprints • Legal &amp; Regulatory Secretariat</p>
              <p className="mt-0.5 text-slate-500">GSTIN: 10DXRPR3052Q1ZV &nbsp;|&nbsp; Udyam: UDYAM-BR-26-0005161 &nbsp;|&nbsp; RBI Compliance Framework</p>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/contact" className="px-3 py-1.5 bg-white border border-slate-300 hover:border-slate-400 rounded-lg text-slate-700 font-bold transition-colors">
                Contact Legal
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white/80 backdrop-blur-md py-8 text-xs text-slate-500 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-slate-700">© 2026 CLINAZA (A Mellowprints Enterprise). All Rights Reserved.</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Sharma Sadan, Road No-1, Mahesh Nagar, Patna, Bihar - 800024</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-600">
            <Link to="/clinic-agreement" className="hover:text-[#0867E8] transition-colors font-semibold">Clinic Sub-Merchant Agreement</Link>
            <span>&bull;</span>
            <Link to="/terms" className="hover:text-[#0867E8] transition-colors">Terms of Service</Link>
            <span>&bull;</span>
            <Link to="/privacy" className="hover:text-[#0867E8] transition-colors">Privacy Policy</Link>
            <span>&bull;</span>
            <Link to="/refund-policy" className="hover:text-[#0867E8] transition-colors">Refund Policy</Link>
            <span>&bull;</span>
            <Link to="/shipping-policy" className="hover:text-[#0867E8] transition-colors">Shipping &amp; Delivery</Link>
            <span>&bull;</span>
            <Link to="/contact" className="hover:text-[#0867E8] transition-colors">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
