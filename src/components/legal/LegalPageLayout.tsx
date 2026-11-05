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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-blue-100 selection:text-blue-900">
      <SEOHead
        title={`${title} | Clinaza`}
        description={subtitle}
        canonicalUrl={`https://www.clinaza.in${canonicalPath}`}
      />

      {/* Header */}
      <header className="border-b border-slate-200/80 sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <img
                src="/assets/clinaza-logo.jpg"
                alt="CLINAZA"
                className="h-9 w-auto rounded-xl border border-slate-200 shadow-2xs group-hover:scale-105 transition-transform"
              />
              <div>
                <span className="text-xs font-black tracking-widest text-[#0B2450] block">CLINAZA</span>
                <span className="text-[9px] font-bold tracking-wider text-[#0f7a75] block uppercase">Healthcare Financing</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0867E8] transition-colors py-1.5 px-3 rounded-lg hover:bg-slate-100"
            >
              <ArrowLeft size={14} />
              <span>Back to Home</span>
            </Link>
            <Link
              to="/reactivation/login"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0B2450] text-white hover:bg-slate-800 text-xs font-bold rounded-lg transition-colors"
            >
              Doctor Login
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 py-10 sm:py-14">
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
      <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-slate-700">© 2026 CLINAZA (A Mellowprints Enterprise). All Rights Reserved.</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Sharma Sadan, Road No-1, Mahesh Nagar, Patna, Bihar - 800024</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-600">
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
