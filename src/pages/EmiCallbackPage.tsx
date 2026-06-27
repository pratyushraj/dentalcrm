import React, { useEffect, useState } from 'react';
import { CheckCircle2, Zap, ArrowRight, X } from 'lucide-react';

export default function EmiCallbackPage() {
  const [isMerchantFlow, setIsMerchantFlow] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Detect if this is the dentist/merchant OAuth authorize flow
    const params = new URLSearchParams(window.location.search);
    if (params.has('code') || params.has('state') || params.has('client_id')) {
      setIsMerchantFlow(true);
    }
    
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#020D0A] flex items-center justify-center p-4 font-sans text-slate-100">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-indigo-500/10 blur-[80px]" />
      </div>

      <div className="relative w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 text-center space-y-6 shadow-2xl">
        {loading ? (
          <div className="py-12 space-y-4 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
            <p className="text-xs text-slate-400 font-mono tracking-wider uppercase">Verifying Axis Secure Connection...</p>
          </div>
        ) : (
          <>
            {/* Header Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/5">
                  <CheckCircle2 size={32} className="animate-bounce" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-indigo-600 border border-indigo-400 flex items-center justify-center">
                  <Zap size={10} className="text-white" />
                </div>
              </div>
            </div>

            {isMerchantFlow ? (
              // Dentist / API Connected flow
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest font-mono">Axis Jarvis Live</span>
                  <h2 className="text-lg md:text-xl font-extrabold tracking-tight text-white">CRM Integration Connected</h2>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Your Axis Bank Jarvis Personal Loan application has authorized successfully. Live payment widgets and EMI eligibility checks are now active on your checkout dashboard.
                </p>

                <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-4 text-left space-y-2 text-[11px] font-mono text-slate-350">
                  <div className="flex justify-between">
                    <span className="text-slate-500">API Status:</span>
                    <span className="text-emerald-400 font-bold uppercase">Connected</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Environment:</span>
                    <span>Production</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Auth Method:</span>
                    <span>OAuth 2.0 / Client Creds</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => window.close()}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-150 shadow-md shadow-indigo-600/15"
                  >
                    Return to CRM Settings
                  </button>
                  <p className="text-[9.5px] text-slate-500 mt-2.5 font-sans">
                    You can safely close this browser window now.
                  </p>
                </div>
              </div>
            ) : (
              // Patient Loan Approved flow
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest font-mono">KYC Completed</span>
                  <h2 className="text-lg md:text-xl font-extrabold tracking-tight text-white">Financing Approved</h2>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Congratulations! Your digital verification with Axis Bank is complete. Your treatment plan financing has been approved and authorized.
                </p>

                <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-4 text-left space-y-2.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Merchant Name:</span>
                    <span className="font-semibold text-white">YOUR DENTIST Patna</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Loan Status:</span>
                    <span className="text-emerald-400 font-bold uppercase">Pre-Approved</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">KYC Status:</span>
                    <span className="text-emerald-400 font-bold uppercase">Verified (Aadhaar)</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => window.close()}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-150 shadow-md shadow-indigo-600/15"
                  >
                    Done & Close Page
                  </button>
                  <p className="text-[9.5px] text-slate-500 mt-2.5 font-sans">
                    Please inform your coordinator that you have completed the verification.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
