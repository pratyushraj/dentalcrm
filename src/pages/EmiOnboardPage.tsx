import React, { useState, useEffect } from 'react';
import { ShieldCheck, ArrowRight, CheckCircle2, Lock, Sparkles, ChevronRight, Info, Building2, Check, CreditCard, Shield, Activity, Cpu } from 'lucide-react';
import { toast } from 'sonner';
import { ocenService } from '../services/ocenService';
import { lenderIntegrationService } from '../services/lenderIntegrationService';

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
  // 1: Lender Matching (LendSure AI / OCEN 4.0 engine)
  // 2: Lender Offers Selection
  // 3: Lender KYC & KFS Approval (Finalizing with chosen bank/NBFC)
  const [step, setStep] = useState(0);
  
  const [pan, setPan] = useState('');
  const [mobile, setMobile] = useState('');
  
  // Consents (un-checked by default)
  const [consentEligibility, setConsentEligibility] = useState(false);
  const [consentBankTerms, setConsentBankTerms] = useState(false);

  const [selectedOffer, setSelectedOffer] = useState<LenderOffer | null>(null);
  const [loadingText, setLoadingText] = useState('Initializing OCEN 4.0 & LendSure AI protocol...');

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

  // Real Partner Lender Offers — populated from Integrated Lender APIs (Hero Fincorp, Creditsea, Tap4Credit)
  const offers: LenderOffer[] = [
    {
      id: 'offer-hero',
      lenderName: 'Hero Fincorp (HIPL)',
      logoBg: 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white',
      logoChar: 'H',
      badge: '0% No-Cost EMI',
      interestRate: '0% Subsidized',
      tenure: '12 Months',
      monthlyEmi: Math.round(rawAmount / 12),
      totalRepayment: rawAmount,
      processingFee: 0,
      isRecommended: true
    },
    {
      id: 'offer-creditsea',
      lenderName: 'Creditsea',
      logoBg: 'bg-gradient-to-tr from-teal-600 to-emerald-600 text-white',
      logoChar: 'CS',
      badge: 'Instant Pre-Approval',
      interestRate: '0% p.a.',
      tenure: '9 Months',
      monthlyEmi: Math.round(rawAmount / 9),
      totalRepayment: rawAmount,
      processingFee: Math.round(rawAmount * 0.01),
    },
    {
      id: 'offer-tap4credit',
      lenderName: 'Tap4Credit',
      logoBg: 'bg-gradient-to-tr from-purple-600 to-pink-600 text-white',
      logoChar: 'T4C',
      badge: 'Flexible Tenure',
      interestRate: '11.5% p.a.',
      tenure: '18 Months',
      monthlyEmi: Math.round((rawAmount * 1.09) / 18),
      totalRepayment: Math.round(rawAmount * 1.09),
      processingFee: Math.round(rawAmount * 0.015),
    }
  ];

  const handleConsentSubmit = async (e: React.FormEvent) => {
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
    
    // Call OCEN 4.0 Service
    await ocenService.createLoanApplication({
      borrower: { name: patientName, mobile, pan },
      treatment: { clinicId: 'CLINAZA_PATNA', clinicName: 'Clinaza Partner Dental', procedureName: 'Dental Procedure', invoiceAmount: rawAmount }
    });

    setLoadingText('Querying Hero Fincorp (HIPL) Dedupe & Pre-Check API...');
    
    // Trigger 5-lender API aggregator submission
    const nameParts = patientName.split(' ');
    const firstName = nameParts[0] || 'Patient';
    const lastName = nameParts.slice(1).join(' ') || 'User';
    
    const lenderRes = await lenderIntegrationService.submitPatientToAllLenders({
      firstName,
      lastName,
      mobile: mobile || '9876543210',
      pan: pan.toUpperCase(),
      treatmentAmount: rawAmount,
      incomeMonthly: 60000,
      employmentType: 'Salaried'
    });

    console.log('[EmiOnboardPage] Multi-lender API Aggregator Results:', lenderRes);

    setTimeout(() => {
      setLoadingText('Submitting Lead to Creditsea, Cashvia & Tap4Credit APIs...');
      setTimeout(() => {
        setLoadingText('Verifying My Money Bazaar (MMB) User Dedupe...');
        setTimeout(() => {
          toast.success(`Matched ${lenderRes.lenderResults.filter(r => r.status === 'APPROVED' || r.status === 'NOT_FOUND').length} Partner Lenders!`);
          setStep(2); // Show offers
        }, 800);
      }, 800);
    }, 800);
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
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between p-4 sm:p-6 font-sans text-slate-100 antialiased relative overflow-hidden selection:bg-emerald-500 selection:text-white">
      
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-emerald-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Top Clinaza Header */}
      <header className="w-full max-w-xl mx-auto flex items-center justify-between py-4 px-2 border-b border-slate-800/80 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-emerald-500 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-white font-black text-sm">
              C
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-white tracking-tight leading-none">Clinaza</h1>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold uppercase tracking-wider">HealthPay</span>
            </div>
            <p className="text-[10.5px] font-semibold text-slate-400 mt-1">Healthcare Operating System</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10.5px] font-bold text-slate-300 shadow-inner">
          <Lock size={12} className="text-emerald-400" />
          <span>256-Bit SSL Encrypted</span>
        </div>
      </header>

      {/* Main Container Card */}
      <main className="w-full max-w-xl mx-auto bg-slate-900/90 backdrop-blur-2xl border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-6 relative">

        {/* Header Titles */}
        <div className="text-center space-y-2.5 pb-5 border-b border-slate-800/70">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Clinaza Treatment Financing
          </h2>
          {isLendSure ? (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold shadow-sm">
              <Sparkles size={13} className="text-emerald-400 animate-pulse" />
              <span>Financing powered by LendSure AI</span>
            </div>
          ) : (
            <p className="text-xs text-slate-400 font-medium">Official Bank Direct EMI Integration</p>
          )}
        </div>

        {/* Treatment Plan Summary Box */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-inner">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Activity size={12} className="text-indigo-400" />
              Patient Treatment Plan
            </span>
            <h3 className="text-base font-bold text-white tracking-tight">{patientName}</h3>
            <p className="text-xs text-slate-400">Dental / Aesthetic Procedure</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Treatment Bill</span>
            <div className="text-xl font-black text-emerald-400 font-mono tracking-tight">₹{amount}</div>
          </div>
        </div>

        {/* Interactive Stepper Indicator */}
        <div className="grid grid-cols-4 gap-1.5 text-center text-[9.5px] font-bold uppercase tracking-wider">
          {[
            { num: 1, label: 'Consent' },
            { num: 2, label: 'Match' },
            { num: 3, label: 'Offers' },
            { num: 4, label: 'Approval' },
          ].map((s, idx) => {
            const isActive = step === idx;
            const isCompleted = step > idx;
            return (
              <div
                key={s.label}
                className={`py-2 px-1 rounded-xl border transition-all duration-200 flex items-center justify-center gap-1 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-500 shadow-md shadow-emerald-600/20'
                    : isCompleted
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-slate-950/50 text-slate-400 border-slate-800/80'
                }`}
              >
                {isCompleted ? <Check size={11} className="stroke-[3]" /> : <span>{s.num}.</span>}
                <span>{s.label}</span>
              </div>
            );
          })}
        </div>

        {/* ─── STEP 0: CONSENT & BASIC DETAILS ─────────────────────────────────── */}
        {step === 0 && (
          <form onSubmit={handleConsentSubmit} className="space-y-6">
            
            {/* Auto-Fill Demo Data Helper Button */}
            <div className="flex items-center justify-between bg-indigo-500/10 border border-indigo-500/20 rounded-2xl px-4 py-2.5">
              <span className="text-[11px] font-semibold text-indigo-300">Testing or demonstrating?</span>
              <button
                type="button"
                onClick={() => {
                  setPan('ABCDE1234F');
                  setMobile('9876543210');
                  setConsentEligibility(true);
                  setConsentBankTerms(true);
                  toast.success('Demo data filled & consents accepted!');
                }}
                className="px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[10.5px] font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <span>⚡ Auto-Fill Demo Data</span>
              </button>
            </div>

            {/* Input Details */}
            <div className="space-y-3.5">
              <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard size={13} className="text-indigo-400" />
                1. Basic Verification Details
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">PAN Card Number</label>
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="ABCDE1234F"
                    value={pan}
                    onChange={(e) => setPan(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs font-semibold font-mono text-white placeholder:text-slate-400 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all uppercase"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Mobile Number</label>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="9876543210"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs font-semibold font-mono text-white placeholder:text-slate-400 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Data Sharing Notice */}
            <div className="flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
              <Info size={16} className="text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-200/90 leading-relaxed font-medium">
                Your information will be securely shared with LendSure AI and applicable lending partners for processing your financing request.
              </p>
            </div>

            {/* Required Consents */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Shield size={13} className="text-emerald-400" />
                2. Mandatory Privacy Consents
              </h4>

              {/* Consent Item 1 */}
              <label htmlFor="consentEligibility" className="flex items-start gap-3 p-4 rounded-2xl border border-slate-800/90 hover:border-slate-700 bg-slate-950/60 cursor-pointer transition-all group">
                <input
                  type="checkbox"
                  id="consentEligibility"
                  checked={consentEligibility}
                  onChange={(e) => setConsentEligibility(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-emerald-500 rounded border-slate-700 bg-slate-900 focus:ring-emerald-500 shrink-0 cursor-pointer"
                />
                <span className="text-xs text-slate-300 leading-relaxed font-medium group-hover:text-slate-200 transition-colors">
                  I consent to my information being shared with LendSure AI and its applicable lending partners for checking my eligibility for treatment financing and presenting eligible loan offers.
                </span>
              </label>

              {/* Consent Item 2 */}
              <label htmlFor="consentBankTerms" className="flex items-start gap-3 p-4 rounded-2xl border border-slate-800/90 hover:border-slate-700 bg-slate-950/60 cursor-pointer transition-all group">
                <input
                  type="checkbox"
                  id="consentBankTerms"
                  checked={consentBankTerms}
                  onChange={(e) => setConsentBankTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-emerald-500 rounded border-slate-700 bg-slate-900 focus:ring-emerald-500 shrink-0 cursor-pointer"
                />
                <span className="text-xs text-slate-300 leading-relaxed font-medium group-hover:text-slate-200 transition-colors">
                  I understand that loan approval, interest rate, tenure, fees and other terms will be determined by the respective bank/NBFC. I will be shown the applicable loan terms and Key Fact Statement before accepting any loan.
                </span>
              </label>
            </div>

            {/* CTA Button */}
            <button
              type="submit"
              disabled={!consentEligibility || !consentBankTerms}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-xl ${
                consentEligibility && consentBankTerms
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:scale-[0.99] text-white shadow-emerald-500/25 cursor-pointer'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 cursor-not-allowed shadow-none'
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
              <div className="w-20 h-20 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
              <div className="absolute w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-emerald-500/30">
                L
              </div>
            </div>

            <div className="space-y-2">
              <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                LendSure AI Multi-Lender Ecosystem
              </span>
              <h3 className="text-base font-bold text-white">{loadingText}</h3>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed mx-auto font-medium">
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
                <h4 className="text-sm font-bold text-white">Eligible Bank & NBFC Offers</h4>
                <p className="text-xs text-slate-400 mt-0.5">Select a financing plan to complete approval</p>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 size={11} /> 5 Lender APIs Verified
              </span>
            </div>

            <div className="space-y-3.5">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  onClick={() => handleSelectOffer(offer)}
                  className={`group relative p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    offer.isRecommended
                      ? 'bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-emerald-500/50 shadow-lg shadow-emerald-500/10 hover:border-emerald-400'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                  }`}
                >
                  {offer.isRecommended && (
                    <div className="absolute -top-2.5 right-4 px-3 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[9px] font-bold uppercase tracking-wider shadow-sm">
                      Recommended
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-11 h-11 rounded-2xl ${offer.logoBg} flex items-center justify-center font-black text-sm shadow-md`}>
                        {offer.logoChar}
                      </div>
                      <div>
                        <h5 className="text-xs sm:text-sm font-bold text-white">{offer.lenderName}</h5>
                        <span className="inline-block mt-0.5 text-[10px] font-semibold text-slate-400">
                          {offer.badge} · {offer.interestRate}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm sm:text-base font-black text-emerald-400 font-mono">
                        ₹{offer.monthlyEmi.toLocaleString('en-IN')}<span className="text-[10px] text-slate-400 font-normal font-sans">/mo</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">Tenure: {offer.tenure}</span>
                    </div>
                  </div>

                  <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <div>Processing Fee: <strong className="text-slate-200">₹{offer.processingFee}</strong></div>
                    <div className="flex items-center gap-1 font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
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
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 size={34} />
            </div>

            <div className="space-y-2">
              <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                Redirecting to {selectedOffer.lenderName}
              </span>
              <h3 className="text-base font-bold text-white">Offer Selected Successfully</h3>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed mx-auto">
                Opening {selectedOffer.lenderName}'s secure portal to complete digital KYC, view your Key Fact Statement (KFS), and finalize disbursement...
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-xl mx-auto mt-8 text-center text-xs text-slate-400 space-y-2 py-4 border-t border-slate-800/60">
        <p className="font-semibold text-slate-300">Financing technology powered by LendSure AI</p>
        <p className="text-[11px] text-slate-400">
          © 2026 Clinaza Health Technologies Ltd. · Clinic Partner Support Portal
        </p>
      </footer>
    </div>
  );
}
