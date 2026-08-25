import React, { useEffect, useState } from 'react';
import { CheckCircle2, Zap, Phone, Clock, ArrowRight, ShieldCheck, Sparkles, MessageCircle, CreditCard, ExternalLink } from 'lucide-react';

interface LenderStep {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

function getLenderSteps(lenderName: string): { steps: LenderStep[]; eta: string; color: string } {
  const ln = lenderName.toLowerCase();

  if (ln.includes('tap4credit')) {
    return {
      color: 'from-pink-500 to-rose-500',
      eta: '24–48 hours',
      steps: [
        { icon: <CheckCircle2 size={15} />, title: 'Lead Registered', desc: 'Your application is submitted to Tap4Credit\'s live system.' },
        { icon: <Phone size={15} />, title: 'Call Back Expected', desc: 'Tap4Credit executive will call you within 24–48 hours on your registered mobile.' },
        { icon: <CreditCard size={15} />, title: 'KYC & Disbursal', desc: 'Complete eKYC digitally. Loan disbursed directly to clinic within 48 hours post-approval.' },
      ],
    };
  }

  if (ln.includes('cashvia') || ln.includes('digicredit')) {
    return {
      color: 'from-emerald-500 to-teal-500',
      eta: '12–24 hours',
      steps: [
        { icon: <CheckCircle2 size={15} />, title: 'Pre-Approval Done', desc: 'Cashvia has pre-approved your application via live API check.' },
        { icon: <MessageCircle size={15} />, title: 'SMS / WhatsApp Link', desc: 'You\'ll receive a KYC link on your registered mobile within 1–2 hours.' },
        { icon: <CreditCard size={15} />, title: 'No-Cost EMI Activated', desc: 'Complete eKYC and 0% EMI plan will be activated for your treatment.' },
      ],
    };
  }

  if (ln.includes('creditsea')) {
    return {
      color: 'from-blue-500 to-indigo-500',
      eta: '2–4 hours',
      steps: [
        { icon: <CheckCircle2 size={15} />, title: 'Partner Lead Created', desc: 'Your details have been sent to Creditsea\'s digital onboarding system.' },
        { icon: <ExternalLink size={15} />, title: 'Digital KYC Link', desc: 'Complete eKYC on Creditsea\'s portal. Link sent to your mobile.' },
        { icon: <CreditCard size={15} />, title: 'Instant Disbursal', desc: 'Funds disbursed to clinic within 4 hours of KYC completion.' },
      ],
    };
  }

  // Default
  return {
    color: 'from-emerald-500 to-teal-500',
    eta: '24–48 hours',
    steps: [
      { icon: <CheckCircle2 size={15} />, title: 'Application Registered', desc: 'Your financing request has been submitted successfully.' },
      { icon: <Phone size={15} />, title: 'Lender Contact', desc: 'A lender representative will contact you on your registered mobile.' },
      { icon: <CreditCard size={15} />, title: 'Disbursal', desc: 'Upon KYC completion, funds are disbursed directly to the clinic.' },
    ],
  };
}

export default function EmiCallbackPage() {
  const [lenderName, setLenderName] = useState('Partner Lender');
  const [status, setStatus] = useState('approved');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lenderParam = params.get('lender');
    const statusParam = params.get('status');
    const mobileParam = params.get('mobile');
    if (lenderParam) setLenderName(decodeURIComponent(lenderParam));
    if (statusParam) setStatus(statusParam);
    if (mobileParam) setMobile(mobileParam);
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const { steps, eta, color } = getLenderSteps(lenderName);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between p-4 sm:p-6 font-sans text-slate-100 antialiased relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-emerald-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <header className="w-full max-w-md mx-auto flex items-center justify-between py-4 px-2 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-emerald-500 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-white font-black text-xs">C</div>
          </div>
          <div>
            <h1 className="text-sm font-black text-white tracking-tight leading-none">Clinaza</h1>
            <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Healthcare Operating System</p>
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-bold">
          <Sparkles size={11} />
          <span>LendSure AI</span>
        </div>
      </header>

      {/* Card */}
      <div className="relative w-full max-w-md mx-auto bg-slate-900/90 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-6">
        {loading ? (
          <div className="py-12 space-y-4 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
            <p className="text-xs text-slate-400 font-mono tracking-wider uppercase">Confirming Lender Registration...</p>
          </div>
        ) : (
          <>
            {/* Success Icon */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 size={34} />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
                  <Zap size={11} className="text-white fill-white" />
                </div>
              </div>
              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                  Application {status.toUpperCase()}
                </span>
                <h2 className="text-xl font-black tracking-tight text-white mt-2">Plan Confirmed</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Your EMI plan is registered with <strong className="text-white">{lenderName}</strong>
                </p>
              </div>
            </div>

            {/* ETA Badge */}
            <div className="flex items-center justify-center gap-2 bg-slate-950/60 border border-slate-800 rounded-2xl py-3">
              <Clock size={14} className="text-amber-400" />
              <span className="text-xs font-bold text-amber-300">Expected next step within: <span className="text-white">{eta}</span></span>
            </div>

            {/* Steps */}
            <div className="space-y-3">
              {steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3 bg-slate-950/60 border border-slate-800/60 rounded-2xl p-4">
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${color} flex items-center justify-center text-white flex-shrink-0 shadow-md`}>
                    {step.icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{`Step ${i + 1}: ${step.title}`}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Registered Mobile */}
            {mobile && (
              <div className="flex items-center gap-3 bg-slate-950/60 border border-slate-700/60 rounded-2xl p-3.5">
                <Phone size={14} className="text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-500 font-medium">Registered Mobile</p>
                  <p className="text-sm font-black text-white tracking-widest">{mobile}</p>
                </div>
                <ShieldCheck size={14} className="text-emerald-400 ml-auto flex-shrink-0" />
              </div>
            )}

            {/* CTA */}
            <button
              onClick={() => {
                if (window.opener) window.close();
                else window.location.href = '/reactivation/patients';
              }}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:scale-[0.99] text-white rounded-2xl text-xs font-bold tracking-wider uppercase transition-all shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Back to Patient Dashboard</span>
              <ArrowRight size={14} />
            </button>
            <p className="text-[10px] text-slate-500 text-center">
              The clinic coordinator can view your application status in real-time.
            </p>
          </>
        )}
      </div>

      <footer className="w-full max-w-md mx-auto mt-6 text-center text-[11px] text-slate-500 py-2">
        Financing technology powered by LendSure AI · © 2026 Clinaza
      </footer>
    </div>
  );
}
