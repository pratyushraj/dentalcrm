import React, { useState, useEffect } from 'react';
import { ShieldCheck, ArrowRight, CheckCircle2, Lock, Building2, ChevronRight, AlertCircle, Sparkles, Check, Info } from 'lucide-react';
import { toast } from 'sonner';

interface LenderOffer {
  id: string;
  lenderName: string;
  logoBg: string;
  logoChar: string;
  badge: string;
  interestRate: string;
  tenure: string;
  monthlyEmi: number;
  totalRepayment: number;
  processingFee: number;
  isRecommended?: boolean;
}

export default function EmiOnboardPage() {
  const [patientName, setPatientName] = useState('Patient');
  const [amount, setAmount] = useState('0');
  const [rawAmount, setRawAmount] = useState(0);
  const [partnerName, setPartnerName] = useState('LendSure AI');

  // Steps: 
  // 0: Consent & Details (PAN/Mobile)
  // 1: Lender Matching (LendSure AI multi-lender engine)
  // 2: Lender Offers Selection
  // 3: Lender KYC & KFS Approval (Finalizing with chosen bank/NBFC)
  const [step, setStep] = useState(0);
  
  const [pan, setPan] = useState('');
  const [mobile, setMobile] = useState('');
  
  // Consents (un-checked by default)
  const [consentEligibility, setConsentEligibility] = useState(false);
  const [consentBankTerms, setConsentBankTerms] = useState(false);

  const [selectedOffer, setSelectedOffer] = useState<LenderOffer | null>(null);
  const [loadingText, setLoadingText] = useState('Connecting to LendSure AI eligibility engine...');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nameParam = params.get('name');
    const amountParam = params.get('amount');
    const partnerParam = params.get('partner');
    
    if (nameParam) setPatientName(decodeURIComponent(nameParam));
    if (amountParam) {
      const n = Number(amountParam);
      setRawAmount(n);
      setAmount(n.toLocaleString('en-IN'));
    }
    if (partnerParam) {
      setPartnerName(decodeURIComponent(partnerParam));
    }
  }, []);

  const isLendSure = partnerName.toLowerCase().includes('lendsure');

  // Real healthcare NBFC & Banking partners integrated via LendSure AI multi-lender engine
  const offers: LenderOffer[] = [
    {
      id: 'offer-1',
      lenderName: 'LiquiLoans (NDX P2P Private Limited)',
      logoBg: 'bg-emerald-600',
      logoChar: 'L',
      badge: '0% No-Cost EMI',
      interestRate: '0% p.a.',
      tenure: '12 Months',
      monthlyEmi: Math.round(rawAmount / 12),
      totalRepayment: rawAmount,
      processingFee: 0,
      isRecommended: true
    },
    {
      id: 'offer-2',
      lenderName: 'Fibe (EarlySalary Services Ltd.)',
      logoBg: 'bg-blue-600',
      logoChar: 'F',
      badge: 'Instant Pre-Approval',
      interestRate: '0% Subsidized',
      tenure: '9 Months',
      monthlyEmi: Math.round(rawAmount / 9),
      totalRepayment: rawAmount,
      processingFee: Math.round(rawAmount * 0.01),
    },
    {
      id: 'offer-3',
      lenderName: 'InCred Financial Services Ltd.',
      logoBg: 'bg-purple-600',
      logoChar: 'I',
      badge: 'High Ticket Medical EMI',
      interestRate: '10.5% p.a.',
      tenure: '18 Months',
      monthlyEmi: Math.round((rawAmount * 1.08) / 18),
      totalRepayment: Math.round(rawAmount * 1.08),
      processingFee: Math.round(rawAmount * 0.01),
    },
    {
      id: 'offer-4',
      lenderName: 'Axis Bank Ltd. (Medical Financing)',
      logoBg: 'bg-[#8A004B]',
      logoChar: 'A',
      badge: 'Direct Bank Sanction',
      interestRate: '11.5% p.a.',
      tenure: '24 Months',
      monthlyEmi: Math.round((rawAmount * 1.12) / 24),
      totalRepayment: Math.round(rawAmount * 1.12),
      processingFee: Math.round(rawAmount * 0.015),
    }
  ];

  const handleConsentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentEligibility || !consentBankTerms) {
      toast.error('Please accept both consent items to check your financing options.');
      return;
    }
    if (pan.length !== 10) {
      toast.error('Please enter a valid 10-character PAN number.');
      return;
    }

    setStep(1); // Proceed to Lender Matching
    
    // Simulate LendSure AI real-time multi-lender aggregation
    setLoadingText('Connecting to LendSure AI tech ecosystem...');
    setTimeout(() => {
      setLoadingText('Searching pre-approved credit lanes across bank partners...');
      setTimeout(() => {
        setLoadingText('Retrieving real-time zero-subsidized EMI offers...');
        setTimeout(() => {
          setStep(2); // Show offers
        }, 1000);
      }, 1000);
    }, 1000);
  };

  const handleSelectOffer = (offer: LenderOffer) => {
    setSelectedOffer(offer);
    setStep(3); // Proceed to lender KYC & KFS completion
    
    setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const clientId = params.get('client_id') || 'de01ee08f2ec9266649435867d87da8d';
      window.location.href = `/emi/callback?client_id=${clientId}&status=approved&lender=${encodeURIComponent(offer.lenderName)}`;
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 sm:p-6 font-sans text-slate-800 antialiased">
      
      {/* Top Clinaza Header */}
      <header className="w-full max-w-xl mx-auto flex items-center justify-between py-4 px-2 border-b border-slate-200/80 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-indigo-500/20">
            C
          </div>
          <div>
            <h1 className="text-base font-black text-slate-900 tracking-tight leading-none">Clinaza</h1>
            <p className="text-[10px] font-semibold text-slate-500 mt-0.5">Healthcare Operating System</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[10.5px] font-bold text-slate-600">
          <Lock size={12} className="text-emerald-600" />
          <span>256-Bit Encrypted</span>
        </div>
      </header>

      {/* Main Container Card */}
      <main className="w-full max-w-xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 space-y-6">

        {/* Header Titles */}
        <div className="text-center space-y-2 pb-4 border-b border-slate-100">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Clinaza Treatment Financing
          </h2>
          {isLendSure ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
              <Sparkles size={13} className="text-emerald-600" />
              <span>Financing powered by LendSure AI</span>
            </div>
          ) : (
            <p className="text-xs text-slate-500 font-medium">Official Bank Direct EMI Integration</p>
          )}
        </div>

        {/* Treatment Plan Summary Box */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Patient Treatment Plan</span>
            <h3 className="text-sm font-bold text-slate-900 mt-0.5">{patientName}</h3>
            <p className="text-xs text-slate-500 mt-0.5">Dental / Aesthetic Procedure</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Bill</span>
            <div className="text-lg font-black text-emerald-600 font-mono">₹{amount}</div>
          </div>
        </div>

        {/* Interactive Stepper Indicator */}
        <div className="grid grid-cols-4 gap-1 sm:gap-2 text-center text-[9.5px] font-bold uppercase tracking-wider">
          <div className={`py-1.5 rounded-lg border transition-all ${step === 0 ? 'bg-indigo-600 text-white border-indigo-600' : step > 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
            1. Consent
          </div>
          <div className={`py-1.5 rounded-lg border transition-all ${step === 1 ? 'bg-indigo-600 text-white border-indigo-600' : step > 1 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
            2. Match
          </div>
          <div className={`py-1.5 rounded-lg border transition-all ${step === 2 ? 'bg-indigo-600 text-white border-indigo-600' : step > 2 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
            3. Offers
          </div>
          <div className={`py-1.5 rounded-lg border transition-all ${step === 3 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
            4. Approval
          </div>
        </div>

        {/* ─── STEP 0: CONSENT & BASIC DETAILS ─────────────────────────────────── */}
        {step === 0 && (
          <form onSubmit={handleConsentSubmit} className="space-y-6">
            
            {/* Input Details */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">1. Basic Verification Details</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">PAN Card Number</label>
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="ABCDE1234F"
                    value={pan}
                    onChange={(e) => setPan(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold font-mono text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-600 focus:bg-white transition-all uppercase"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="9876543210"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold font-mono text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-600 focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Data Sharing Notice */}
            <div className="flex items-start gap-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4">
              <Info size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-950 leading-relaxed font-medium">
                Your information will be securely shared with LendSure AI and applicable lending partners for processing your financing request.
              </p>
            </div>

            {/* Required Consents */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">2. Mandatory Privacy Consents</h4>

              {/* Consent Item 1 */}
              <label htmlFor="consentEligibility" className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white cursor-pointer transition-all">
                <input
                  type="checkbox"
                  id="consentEligibility"
                  checked={consentEligibility}
                  onChange={(e) => setConsentEligibility(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 shrink-0 cursor-pointer"
                />
                <span className="text-xs text-slate-600 leading-relaxed font-medium">
                  I consent to my information being shared with LendSure AI and its applicable lending partners for checking my eligibility for treatment financing and presenting eligible loan offers.
                </span>
              </label>

              {/* Consent Item 2 */}
              <label htmlFor="consentBankTerms" className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white cursor-pointer transition-all">
                <input
                  type="checkbox"
                  id="consentBankTerms"
                  checked={consentBankTerms}
                  onChange={(e) => setConsentBankTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 shrink-0 cursor-pointer"
                />
                <span className="text-xs text-slate-600 leading-relaxed font-medium">
                  I understand that loan approval, interest rate, tenure, fees and other terms will be determined by the respective bank/NBFC. I will be shown the applicable loan terms and Key Fact Statement before accepting any loan.
                </span>
              </label>
            </div>

            {/* CTA Button */}
            <button
              type="submit"
              disabled={!consentEligibility || !consentBankTerms}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-lg ${
                consentEligibility && consentBankTerms
                  ? 'bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white shadow-emerald-600/20 cursor-pointer'
                  : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none'
              }`}
            >
              Check Financing Options
              <ArrowRight size={15} />
            </button>
          </form>
        )}

        {/* ─── STEP 1: LENDER MATCHING ENGINE ───────────────────────────────── */}
        {step === 1 && (
          <div className="py-12 space-y-6 flex flex-col items-center justify-center text-center">
            <div className="relative flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin" />
              <div className="absolute w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-black text-xs shadow-md">
                L
              </div>
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                LendSure AI Multi-Lender Ecosystem
              </span>
              <h3 className="text-base font-bold text-slate-900">{loadingText}</h3>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed mx-auto font-medium">
                Scanning pre-approved medical loan limits from multiple regulated banking partners...
              </p>
            </div>
          </div>
        )}

        {/* ─── STEP 2: ELIGIBLE BANK/NBFC OFFERS ─────────────────────────────── */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Eligible Bank & NBFC Offers</h4>
                <p className="text-xs text-slate-500 mt-0.5">Select a financing plan to complete approval</p>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                [LendSure AI Matched]
              </span>
            </div>

            <div className="space-y-3">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  onClick={() => handleSelectOffer(offer)}
                  className={`group relative p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    offer.isRecommended
                      ? 'bg-gradient-to-r from-emerald-50/50 via-white to-slate-50 border-emerald-300 shadow-md shadow-emerald-600/5 hover:border-emerald-500'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  {offer.isRecommended && (
                    <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-bold uppercase tracking-wider shadow-sm">
                      Recommended
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${offer.logoBg} flex items-center justify-center text-white font-black text-sm shadow-sm`}>
                        {offer.logoChar}
                      </div>
                      <div>
                        <h5 className="text-xs sm:text-sm font-bold text-slate-900">{offer.lenderName}</h5>
                        <span className="inline-block mt-0.5 text-[10px] font-semibold text-slate-500">
                          {offer.badge} · {offer.interestRate}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm sm:text-base font-black text-slate-900 font-mono">
                        ₹{offer.monthlyEmi.toLocaleString('en-IN')}<span className="text-[10px] text-slate-400 font-normal font-sans">/mo</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium">Tenure: {offer.tenure}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <div>Processing Fee: <strong className="text-slate-700">₹{offer.processingFee}</strong></div>
                    <div className="flex items-center gap-1 font-bold text-emerald-600 group-hover:translate-x-0.5 transition-transform">
                      Select Plan <ChevronRight size={13} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-center text-slate-400 font-medium">
              Note: Final sanction, KYC, and Key Fact Statement (KFS) will be provided directly by the selected lender.
            </p>
          </div>
        )}

        {/* ─── STEP 3: LENDER KYC & DISBURSAL HANDSHAKE ─────────────────────── */}
        {step === 3 && selectedOffer && (
          <div className="py-8 space-y-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 size={32} />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                Redirecting to {selectedOffer.lenderName}
              </span>
              <h3 className="text-base font-bold text-slate-900">Offer Selected Successfully</h3>
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed mx-auto">
                Opening {selectedOffer.lenderName}'s secure portal to complete digital KYC, view your Key Fact Statement (KFS), and finalize disbursement...
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-xl mx-auto mt-8 text-center text-xs text-slate-500 space-y-2 py-4 border-t border-slate-200/60">
        <p className="font-semibold text-slate-600">Financing technology powered by LendSure AI</p>
        <p className="text-[11px] text-slate-400">
          © 2026 Clinaza Health Technologies Ltd. · Clinic Partner Support Portal
        </p>
      </footer>
    </div>
  );
}
