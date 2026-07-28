import React, { useEffect, useState } from 'react';
import { CheckCircle2, Zap, ArrowRight, X, ShieldCheck, Sparkles, Building2 } from 'lucide-react';

export default function EmiCallbackPage() {
  const [lenderName, setLenderName] = useState('Partner Bank');
  const [status, setStatus] = useState('approved');
  const [isMerchantFlow, setIsMerchantFlow] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lenderParam = params.get('lender');
    const statusParam = params.get('status');
    const isCodeParam = params.has('code') || params.has('state');
    
    if (lenderParam) setLenderName(decodeURIComponent(lenderParam));
    if (statusParam) setStatus(statusParam);
    if (isCodeParam) setIsMerchantFlow(true);
    
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between p-4 sm:p-6 font-sans text-slate-100 antialiased relative overflow-hidden">
      
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-emerald-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <header className="w-full max-w-md mx-auto flex items-center justify-between py-4 px-2 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-emerald-500 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-white font-black text-xs">
              C
            </div>
          </div>
          <div>
            <h1 className="text-sm font-black text-white tracking-tight leading-none">Clinaza</h1>
            <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Healthcare Operating System</p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-bold">
          <Sparkles size={11} />
          <span>LendSure AI Tech</span>
        </div>
      </header>

      {/* Main Container Card */}
      <div className="relative w-full max-w-md mx-auto bg-slate-900/90 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl shadow-black/80">
        {loading ? (
          <div className="py-12 space-y-4 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
            <p className="text-xs text-slate-400 font-mono tracking-wider uppercase">Verifying Authorization Status...</p>
          </div>
        ) : (
          <>
            {/* Header Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 size={34} />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
                  <Zap size={11} className="text-white fill-white" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                  Status: {status.toUpperCase()}
                </span>
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
                  Financing Application Registered
                </h2>
              </div>
              
              <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto font-medium">
                Your treatment financing request with <strong className="text-white">{lenderName}</strong> has been successfully authorized via LendSure AI.
              </p>

              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 text-left space-y-2 text-xs font-mono text-slate-300 shadow-inner">
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-slate-500">Selected Lender:</span>
                  <span className="text-emerald-400 font-bold">{lenderName}</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-slate-500">Financing Engine:</span>
                  <span className="text-white">LendSure AI Aggregator</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-slate-500">KYC & Consent:</span>
                  <span className="text-emerald-400 font-bold">VERIFIED</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    if (window.opener) {
                      window.close();
                    } else {
                      window.location.href = '/reactivation/patients';
                    }
                  }}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:scale-[0.99] text-white rounded-2xl text-xs font-bold tracking-wider uppercase transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  Return to Patient Dashboard
                </button>
                <p className="text-[10px] text-slate-500 mt-2 font-medium">
                  The clinic coordinator can now view your approved status in real-time.
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="w-full max-w-md mx-auto mt-6 text-center text-xs text-slate-500 py-2">
        <p className="text-[11px] text-slate-400">
          Financing technology powered by LendSure AI · © 2026 Clinaza
        </p>
      </footer>
    </div>
  );
}
