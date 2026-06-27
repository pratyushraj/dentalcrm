import React, { useState, useEffect } from 'react';
import { ShieldCheck, ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function EmiOnboardPage() {
  const [patientName, setPatientName] = useState('Patient');
  const [amount, setAmount] = useState('0');
  
  const [step, setStep] = useState(1); // 1: Info/PAN, 2: Aadhaar OTP, 3: Underwriting loader
  const [pan, setPan] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nameParam = params.get('name');
    const amountParam = params.get('amount');
    if (nameParam) setPatientName(nameParam);
    if (amountParam) setAmount(Number(amountParam).toLocaleString('en-IN'));
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handlePanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pan.length !== 10) {
      toast.error('Please enter a valid 10-digit PAN card number.');
      return;
    }
    setStep(2);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error('Please enter the 6-digit Aadhaar OTP.');
      return;
    }
    
    setStep(3);
    
    // Simulate Axis Underwriting and credit checks
    setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      // Redirect back to our callback page
      window.location.href = `/emi/callback?client_id=${params.get('client_id') || '7bc29bc8dad077dc5491758da515d6fd'}&status=approved`;
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#070e0b] flex flex-col items-center justify-center p-4 font-sans text-slate-100">
      {/* Top Header */}
      <div className="w-full max-w-md flex items-center justify-between mb-6 px-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#8A004B] flex items-center justify-center text-white text-[10px] font-bold">
            A
          </div>
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-350">Axis Bank <span className="text-[#8A004B] font-bold">Jarvis</span></span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
          <Lock size={10} />
          <span>Secure 256-Bit SSL Connection</span>
        </div>
      </div>

      {/* Main Card */}
      <div className="relative w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
        
        {step === 1 && (
          <form onSubmit={handlePanSubmit} className="space-y-5">
            <div className="space-y-1.5 text-center">
              <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] font-bold uppercase tracking-wider">
                Step 1 of 2: Credit Assessment
              </span>
              <h2 className="text-lg font-black text-white">Treatment EMI Application</h2>
              <p className="text-[11px] text-slate-400">
                Hi <strong className="text-white">{patientName}</strong>, apply for ₹<strong className="text-white">{amount}</strong> treatment loan at <strong className="text-white">YOUR DENTIST Patna</strong>.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[9.5px] font-bold text-slate-450 uppercase tracking-wider mb-1">PAN Card Number</label>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="ABCDE1234F"
                  value={pan}
                  onChange={(e) => setPan(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 bg-slate-950/40 border border-slate-800 rounded-xl text-xs font-semibold font-mono text-white placeholder:text-slate-600 outline-none focus:border-indigo-500/60 transition-all uppercase"
                  required
                />
              </div>

              <div>
                <label className="block text-[9.5px] font-bold text-slate-455 uppercase tracking-wider mb-1">Aadhaar Card Number</label>
                <input
                  type="text"
                  maxLength={12}
                  placeholder="1234 5678 9012"
                  value={aadhaar}
                  onChange={(e) => setAadhaar(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full px-3.5 py-2.5 bg-slate-950/40 border border-slate-800 rounded-xl text-xs font-semibold font-mono text-white placeholder:text-slate-600 outline-none focus:border-indigo-500/60 transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-1.5 py-3 bg-[#8A004B] hover:bg-[#a6005b] active:scale-[0.99] text-white rounded-xl text-xs font-bold uppercase transition-all duration-150 shadow-md shadow-[#8A004B]/15"
            >
              Verify & Proceed
              <ArrowRight size={13} />
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleOtpSubmit} className="space-y-5">
            <div className="space-y-1.5 text-center">
              <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] font-bold uppercase tracking-wider">
                Step 2 of 2: Aadhaar OTP Verification
              </span>
              <h2 className="text-lg font-black text-white">Enter OTP</h2>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                An Aadhaar-linked OTP has been sent to the registered mobile ending in **350. Enter it below to authorize.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[9.5px] font-bold text-slate-450 uppercase tracking-wider mb-1">Aadhaar OTP (6-Digit)</label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="••••••"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full px-3.5 py-2.5 bg-slate-950/40 border border-slate-800 rounded-xl text-xs font-semibold font-mono text-center tracking-[8px] text-white placeholder:text-slate-600 outline-none focus:border-indigo-500/60 transition-all"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium px-1">
              <span>Aadhaar secure validation</span>
              {timer > 0 ? (
                <span>Resend OTP in {timer}s</span>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setTimer(30);
                    toast.success('New OTP sent successfully!');
                  }}
                  className="text-[#8A004B] hover:underline font-bold"
                >
                  Resend OTP
                </button>
              )}
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-1.5 py-3 bg-[#8A004B] hover:bg-[#a6005b] active:scale-[0.99] text-white rounded-xl text-xs font-bold uppercase transition-all duration-150 shadow-md shadow-[#8A004B]/15"
            >
              Verify OTP & Authorize Loan
              <ShieldCheck size={13} />
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="py-8 space-y-6 flex flex-col items-center justify-center text-center">
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
              <div className="absolute w-8 h-8 rounded-full bg-[#8A004B] animate-pulse flex items-center justify-center text-[10px] text-white font-bold">
                A
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Running Underwriting Decisions...</h3>
              <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed mx-auto font-sans">
                Axis Bank credit engine is checking CIBIL, verifying your Aadhaar metadata, and setting up the EMI mandate contract.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <div className="mt-8 text-center text-[10px] text-slate-500 space-y-1">
        <p>© 2026 Axis Bank. All Rights Reserved.</p>
        <p className="max-w-xs leading-relaxed">
          Disclaimer: Personal loans and financing facilities are subject to terms, credit guidelines, and underwriting criteria of Axis Bank Ltd.
        </p>
      </div>
    </div>
  );
}
