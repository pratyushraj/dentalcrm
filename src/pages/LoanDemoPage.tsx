import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/seo/SEOHead';
import { 
  Shield, 
  CheckCircle2, 
  ChevronRight, 
  Lock, 
  UserCheck, 
  CreditCard, 
  Building2, 
  Sparkles,
  ArrowRight,
  PhoneCall,
  Clock,
  Check
} from 'lucide-react';

export default function LoanDemoPage() {
  const [kycStep, setKycStep] = useState<'aadhaar' | 'offers' | 'sanction'>('aadhaar');
  const [selectedTenure, setSelectedTenure] = useState(12);
  const [patientName, setPatientName] = useState('Rahul Sharma');
  const [treatment, setTreatment] = useState('Dental Implants');
  const [sanctionAmount, setSanctionAmount] = useState(120000);

  const monthlyEmi = Math.round(sanctionAmount / selectedTenure);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-[#0867E8] selection:text-white">
      <SEOHead
        title="Clinaza Patient Healthcare Financing & Instant EMI Demo"
        description="Experience Clinaza's seamless in-app patient financing journey with 2-minute digital KYC, zero CIBIL impact, and flexible 3-24 month tenure."
        canonicalUrl="https://clinaza.in/demo/loan"
      />

      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#0867E8] text-white flex items-center justify-center font-black text-sm shadow-md">
            C
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-tight text-white flex items-center gap-1.5">
              CLINAZA <span className="text-[10px] font-bold text-[#38bdf8] bg-blue-950/80 border border-blue-800 px-1.5 py-0.2 rounded-md">FINANCING OS</span>
            </span>
            <span className="text-[9px] text-slate-400">Institutional Healthcare Lending Grid</span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden sm:inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-3 py-1 rounded-full">
            <Shield size={12} />
            <span>Interactive Demo Sandbox</span>
          </div>
          <Link
            to="/blog"
            className="text-xs font-bold text-slate-300 hover:text-white transition-colors"
          >
            Guides & Blogs
          </Link>
          <Link
            to="/"
            className="px-3 py-1.5 bg-[#0867E8] hover:bg-[#0756c7] text-white rounded-xl text-xs font-black transition-all shadow-xs"
          >
            Visit Website &rarr;
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
        {/* Banner */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/40 border border-blue-700/60 text-[#38bdf8] text-xs font-black uppercase tracking-wider">
            <Sparkles size={13} /> Interactive In-App Patient Financing Preview
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            See Exactly What Your Patient Sees
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Zero upfront patient fees, 2-minute digital e-KYC, and direct clinic disbursement without ever leaving the Clinaza ecosystem.
          </p>
        </div>

        {/* Demo Stage Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-sm">
          {/* Header Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-5 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-[#38bdf8] shrink-0 shadow-xs">
                <CreditCard size={24} />
              </div>
              <div>
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">
                  INSTANT SANCTION WALKTHROUGH
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  Clinaza Care-Pass &bull; {patientName}
                </h3>
                <p className="text-xs text-slate-400">
                  Treatment: <strong className="text-slate-200">{treatment}</strong> &bull; Total: <strong className="text-emerald-400">₹{sanctionAmount.toLocaleString('en-IN')}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-lg text-slate-300">
                🔒 256-Bit RBI Encrypted
              </span>
            </div>
          </div>

          {/* Interactive Steps Tabs */}
          <div className="grid grid-cols-3 gap-2 bg-slate-950/80 p-1.5 rounded-2xl mb-6 text-center border border-slate-800">
            <button
              type="button"
              onClick={() => setKycStep('aadhaar')}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                kycStep === 'aadhaar'
                  ? 'bg-[#0867E8] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserCheck size={14} />
              <span>1. Digital e-KYC</span>
            </button>
            <button
              type="button"
              onClick={() => setKycStep('offers')}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                kycStep === 'offers'
                  ? 'bg-[#0867E8] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 size={14} />
              <span>2. Sanction & EMI</span>
            </button>
            <button
              type="button"
              onClick={() => setKycStep('sanction')}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                kycStep === 'sanction'
                  ? 'bg-[#0867E8] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CheckCircle2 size={14} />
              <span>3. Clinic Payout</span>
            </button>
          </div>

          {/* Tab 1: Digital KYC */}
          {kycStep === 'aadhaar' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 bg-blue-950/40 border border-blue-800/60 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-[#38bdf8] flex items-center justify-center">
                    <Shield size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Paperless Identity & Soft Eligibility Check</div>
                    <div className="text-[11px] text-slate-400">Zero impact on patient CIBIL score &bull; 100% Digital</div>
                  </div>
                </div>
                <span className="text-[10px] font-black bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-1 rounded-full uppercase">
                  Verified
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Aadhaar Linked Mobile</span>
                  <div className="text-sm font-mono text-slate-200">+91 ••••••3210</div>
                  <div className="text-[10px] text-emerald-400 font-semibold">✓ OTP verified in 8 seconds</div>
                </div>

                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Bureau Assessment</span>
                  <div className="text-sm font-bold text-slate-200">Score: <span className="text-emerald-400">768 (Excellent)</span></div>
                  <div className="text-[10px] text-slate-400">Multi-lender network pre-cleared</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setKycStep('offers')}
                className="w-full py-4 bg-[#0867E8] hover:bg-[#0756c7] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <span>Proceed to Approved Sanction Limits</span>
                <ChevronRight size={15} />
              </button>
            </div>
          )}

          {/* Tab 2: Offers & Tenure Slider */}
          {kycStep === 'offers' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Sanction Hero */}
              <div className="p-5 bg-gradient-to-r from-slate-950 to-blue-950/40 border border-blue-900/60 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <div className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">
                    PRE-APPROVED SANCTION LIMIT
                  </div>
                  <div className="text-3xl font-black text-white mt-1">₹1,50,000</div>
                  <p className="text-xs text-slate-400">Allocated across Easycred &amp; 13 Live RBI-regulated NBFC partners</p>
                </div>
                <div className="bg-blue-600/20 border border-blue-500/30 rounded-xl px-3 py-2 text-right">
                  <div className="text-[10px] text-blue-300 font-bold uppercase">Processing Fee</div>
                  <div className="text-xs font-black text-emerald-400">₹0 (Waived)</div>
                </div>
              </div>

              {/* Tenure Selection */}
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Select Flexible Repayment Tenure
                  </label>
                  <span className="text-xs font-black text-[#38bdf8] bg-blue-950 border border-blue-800 px-2 py-0.5 rounded-lg">
                    {selectedTenure} Months
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2.5">
                  {[3, 6, 12, 24].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedTenure(t)}
                      className={`py-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                        selectedTenure === t
                          ? 'bg-[#0867E8] text-white border-[#0867E8] shadow-md shadow-blue-500/20'
                          : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {t} Months
                    </button>
                  ))}
                </div>
              </div>

              {/* Breakdown Grid */}
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Estimated Monthly EMI</span>
                  <span className="text-base font-black text-white">
                    ₹{monthlyEmi.toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-400">/month</span>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Interest Subvention</span>
                  <span className="font-bold text-emerald-400">Clinaza Healthcare Advantage</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Lender Network Allocation</span>
                  <span className="font-bold text-slate-300">Easycred / Institutional Banking Grid</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setKycStep('sanction')}
                className="w-full py-4 bg-[#0867E8] hover:bg-[#0756c7] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <span>Confirm Plan & Schedule Direct Clinic Payout</span>
                <ChevronRight size={15} />
              </button>
            </div>
          )}

          {/* Tab 3: Clinic Payout */}
          {kycStep === 'sanction' && (
            <div className="space-y-4 animate-in fade-in duration-200 text-center py-2">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <CheckCircle2 size={36} />
              </div>
              <div>
                <h4 className="text-xl font-black text-white">Financing Sanction Confirmed</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  ₹{sanctionAmount.toLocaleString('en-IN')} approved. Payout is scheduled directly to the dental clinic account upon procedure confirmation.
                </p>
              </div>

              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl text-left space-y-2.5 text-xs max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-slate-400">Reference Authorization:</span>
                  <span className="font-mono font-bold text-emerald-400">CLZ-2026-8942</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Patient Name:</span>
                  <span className="font-bold text-slate-200">{patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Treatment:</span>
                  <span className="font-bold text-slate-200">{treatment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Monthly Debit:</span>
                  <span className="font-bold text-slate-200">₹{monthlyEmi.toLocaleString('en-IN')}/mo ({selectedTenure} mos)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Disbursement Channel:</span>
                  <span className="font-bold text-emerald-400">Direct Doctor / Hospital Account</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center max-w-md mx-auto">
                <button
                  type="button"
                  onClick={() => setKycStep('aadhaar')}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                >
                  Restart Demo Walkthrough
                </button>
                <Link
                  to="/"
                  className="w-full py-3 bg-[#0867E8] hover:bg-[#0756c7] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Integrate on Your Clinic</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
