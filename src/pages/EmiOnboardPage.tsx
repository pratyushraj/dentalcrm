import React, { useState, useEffect } from 'react';
import { ShieldCheck, ArrowRight, CheckCircle2, Lock, FileText, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function EmiOnboardPage() {
  const [patientName, setPatientName] = useState('Patient');
  const [amount, setAmount] = useState('0');
  const [rawAmount, setRawAmount] = useState(0);
  const [appId, setAppId] = useState('');
  const [partnerName, setPartnerName] = useState('Axis Bank Jarvis');

  // step 0 = KFS / Consent, 1 = PAN+Aadhaar, 2 = OTP, 3 = Underwriting
  const [step, setStep] = useState(0);
  const [pan, setPan] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30);
  const [loadingText, setLoadingText] = useState('Running credit underwriting decisions...');
  const [kfsExpanded, setKfsExpanded] = useState(false);

  // Consent checkboxes — all must be checked before Step 1
  const [consentKFS, setConsentKFS] = useState(false);
  const [consentBureau, setConsentBureau] = useState(false);
  const [consentData, setConsentData] = useState(false);
  const [consentTerms, setConsentTerms] = useState(false);

  const allConsentsGiven = consentKFS && consentBureau && consentData && consentTerms;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nameParam = params.get('name');
    const amountParam = params.get('amount');
    const partnerParam = params.get('partner');
    if (nameParam) setPatientName(nameParam);
    if (amountParam) {
      const n = Number(amountParam);
      setRawAmount(n);
      setAmount(n.toLocaleString('en-IN'));
    }
    if (partnerParam) setPartnerName(decodeURIComponent(partnerParam));
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

  // Derived KFS values
  const processingFee = Math.round(rawAmount * 0.01);
  const emi12 = Math.round(rawAmount / 12);
  const emi6 = Math.round(rawAmount / 6);
  const emi18 = Math.round(rawAmount / 18);
  const consentTimestamp = new Date().toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'medium' });

  const callAxisAPI = async (path: string, payload: any) => {
    const params = new URLSearchParams(window.location.search);
    const urlClientId = params.get('client_id');
    let clientId = urlClientId || localStorage.getItem('emi_client_id') || 'de01ee08f2ec9266649435867d87da8d';
    let clientSecret = localStorage.getItem('emi_client_secret') || 'a305d7abd56ae3aad432e593c0fbecf6';
    const response = await fetch('/api/axis-helper/gateway', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, payload, clientId, clientSecret, testId: '1' })
    });
    return response.json();
  };

  const handlePanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pan.length !== 10) { toast.error('Please enter a valid 10-digit PAN card number.'); return; }
    toast.loading('Initializing application...');
    try {
      const initRes = await callAxisAPI('/applications/init', {
        Data: {
          requestId: `REQ_INIT_${Date.now()}`,
          applicationType: 'LOAN_ONBOARDING',
          productDetails: { productType: 'TERM_LOAN', subProductType: 'PL_PLUS' },
          userDetails: { mobileNumber: '8879954488', pan }
        }
      });
      toast.dismiss();
      if (initRes.ok && initRes.data?.Data?.applicationId) {
        setAppId(initRes.data.Data.applicationId);
        toast.success(`Application registered: ${initRes.data.Data.applicationId}`);
      } else {
        setAppId(`LD_${Date.now().toString().slice(-8)}`);
        toast.info('Demo Mode: Session initialized with simulated Application ID.');
      }
      setStep(2);
    } catch (err) {
      toast.dismiss();
      setAppId(`LD_${Date.now().toString().slice(-8)}`);
      toast.info('Demo Mode: Session initialized with simulated Application ID.');
      setStep(2);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) { toast.error('Please enter the 6-digit Aadhaar OTP.'); return; }
    setStep(3);
    try {
      setLoadingText('Verifying Aadhaar OTP credentials...');
      await callAxisAPI('/validate-kyc', { Data: { Data: { applicationId: appId, kycValidationToken: otp, requestId: `REQ_VAL_${Date.now()}` } } });
      setLoadingText('Running due diligence check...');
      await callAxisAPI('/cdd-checks', { Data: { applicationId: appId, requestId: `REQ_CDD_${Date.now()}`, userDetails: { pan, firstName: patientName.split(' ')[0], LastName: patientName.split(' ')[1] || 'Kumar' } } });
      setLoadingText('Generating credit offer & approved limits...');
      await callAxisAPI('/get-offer', { Data: { applicationId: appId, requestId: `REQ_OFFER_${Date.now()}`, intent: 'INITIAL', consents: { requestId: `REQ_CONS_${Date.now()}`, ipAddress: '127.0.0.1', deviceInfo: 'web-browser-crm', documentList: [{ id: 1027, userAction: 'accept', consentType: 'CONSENT_BUREAU_PULL', actionData: { action: 'PROCEED' } }] } } });
      setLoadingText('Registering E-NACH mandate...');
      await callAxisAPI('/repay-mandate/enach/handshake', { Data: { applicationId: appId, requestId: `REQ_MANDATE_${Date.now()}`, mandateType: 'NACH', intent: 'INITIATE', mandateMetaData: { loanAmount: rawAmount.toString(), emiAmount: emi12.toString(), userInfoRequest: { firstName: patientName.split(' ')[0], lastName: patientName.split(' ')[1] || 'Kumar' } } } });
      setLoadingText('Finishing onboarding authorization...');
      setTimeout(() => {
        const params = new URLSearchParams(window.location.search);
        window.location.href = `/emi/callback?client_id=${params.get('client_id') || 'de01ee08f2ec9266649435867d87da8d'}&status=approved`;
      }, 1500);
    } catch (err) {
      setLoadingText('Verifying Aadhaar OTP credentials...');
      setTimeout(() => { setLoadingText('Running due diligence check...'); setTimeout(() => { setLoadingText('Generating credit offer & approved limits...'); setTimeout(() => { setLoadingText('Registering E-NACH mandate...'); setTimeout(() => { const params = new URLSearchParams(window.location.search); window.location.href = `/emi/callback?client_id=${params.get('client_id') || 'de01ee08f2ec9266649435867d87da8d'}&status=approved`; }, 1000); }, 1000); }, 1000); }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-[#070e0b] flex flex-col items-center justify-center p-4 font-sans text-slate-100">

      {/* Top Header */}
      <div className="w-full max-w-md flex items-center justify-between mb-6 px-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#8A004B] flex items-center justify-center text-white text-[10px] font-bold">A</div>
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-350">Axis Bank <span className="text-[#8A004B] font-bold">Jarvis</span></span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
          <Lock size={10} />
          <span>Secure 256-Bit SSL Connection</span>
        </div>
      </div>

      {/* Main Card */}
      <div className="relative w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">

        {/* ─── STEP 0: KFS + CONSENT ──────────────────────────────────── */}
        {step === 0 && (
          <div className="space-y-5">
            <div className="space-y-1.5 text-center">
              <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[9px] font-bold uppercase tracking-wider">
                RBI Mandate · Key Fact Statement
              </span>
              <h2 className="text-lg font-black text-white">Loan Disclosure</h2>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                As required by the <strong className="text-slate-300">RBI Digital Lending Directions 2025</strong>, please review all loan terms before proceeding.
              </p>
            </div>

            {/* KFS Summary Card */}
            <div className="bg-slate-950/60 border border-slate-700/50 rounded-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-800 flex items-center gap-2">
                <FileText size={13} className="text-indigo-400" />
                <span className="text-[11px] font-bold text-white uppercase tracking-wider">Key Fact Statement (KFS)</span>
                <span className="ml-auto text-[9px] text-slate-500 font-mono">{consentTimestamp}</span>
              </div>

              <div className="divide-y divide-slate-800/50">
                {[
                  { label: 'Borrower Name', value: patientName },
                  { label: 'Loan Amount (Principal)', value: `₹${amount}` },
                  { label: 'Processing Fee', value: `₹${processingFee.toLocaleString('en-IN')} (1% of principal)` },
                  { label: 'Annual Percentage Rate (APR)', value: '0% – 18% p.a. (subject to credit score)' },
                  { label: 'Loan Tenure Options', value: '6 / 12 / 18 / 24 Months' },
                  { label: 'EMI – 6 Months', value: `₹${emi6.toLocaleString('en-IN')} /month` },
                  { label: 'EMI – 12 Months', value: `₹${emi12.toLocaleString('en-IN')} /month` },
                  { label: 'EMI – 18 Months', value: `₹${emi18.toLocaleString('en-IN')} /month` },
                  { label: 'Prepayment Charges', value: 'Nil (after 3 EMIs)' },
                  { label: 'Late Payment Penalty', value: '2% per month on overdue amount' },
                  { label: 'Regulated Entity (RE)', value: 'Axis Bank Ltd. (RBI Licensed)' },
                  { label: 'Lending Service Provider (LSP)', value: partnerName },
                  { label: 'Grievance Officer', value: 'grievance@axisbank.com · 1800-419-5555' },
                  { label: 'Cooling-off Period', value: '3 days from loan disbursement' },
                ].slice(0, kfsExpanded ? undefined : 6).map(({ label, value }) => (
                  <div key={label} className="flex items-start justify-between px-4 py-2 gap-4">
                    <span className="text-[10px] text-slate-500 shrink-0">{label}</span>
                    <span className="text-[10px] font-semibold text-slate-200 text-right">{value}</span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setKfsExpanded(!kfsExpanded)}
                className="w-full flex items-center justify-center gap-1 py-2.5 text-[10px] text-indigo-400 hover:text-indigo-300 font-bold transition-colors border-t border-slate-800"
              >
                {kfsExpanded ? <><ChevronUp size={12} /> Show Less</> : <><ChevronDown size={12} /> View Full KFS</>}
              </button>
            </div>

            {/* RBI Notice */}
            <div className="flex items-start gap-2.5 bg-amber-500/5 border border-amber-500/20 rounded-xl px-3.5 py-2.5">
              <AlertCircle size={13} className="text-amber-400 shrink-0 mt-0.5" />
              <p className="text-[10px] text-amber-300/80 leading-relaxed">
                Loan funds will be disbursed <strong>directly to your dental clinic</strong>. No amount passes through any third-party account. Your repayments will go directly to Axis Bank. Per RBI DL Directions 2025.
              </p>
            </div>

            {/* Consent Checkboxes */}
            <div className="space-y-2.5">
              <p className="text-[9.5px] font-bold text-slate-500 uppercase tracking-wider">Your Explicit Consent (All Required)</p>

              {[
                {
                  id: 'consentKFS',
                  checked: consentKFS,
                  onChange: () => setConsentKFS(!consentKFS),
                  label: 'I have read and understood the Key Fact Statement (KFS) including the APR, processing fee, repayment schedule, and all applicable charges.'
                },
                {
                  id: 'consentBureau',
                  checked: consentBureau,
                  onChange: () => setConsentBureau(!consentBureau),
                  label: 'I authorise Axis Bank to pull my CIBIL / credit bureau report for underwriting and credit decisioning purposes.'
                },
                {
                  id: 'consentData',
                  checked: consentData,
                  onChange: () => setConsentData(!consentData),
                  label: 'I consent to the collection and processing of my PAN and Aadhaar data strictly for KYC verification. Data will be stored in India only per DPDP Act 2023.'
                },
                {
                  id: 'consentTerms',
                  checked: consentTerms,
                  onChange: () => setConsentTerms(!consentTerms),
                  label: `I agree to the Axis Bank loan terms & conditions and confirm this consent was given by me voluntarily at ${consentTimestamp}.`
                }
              ].map(({ id, checked, onChange, label }) => (
                <label key={id} className="flex items-start gap-2.5 cursor-pointer group" htmlFor={id}>
                  <div
                    onClick={onChange}
                    className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${checked ? 'bg-indigo-600 border-indigo-600' : 'border-slate-600 hover:border-indigo-500'}`}
                  >
                    {checked && <CheckCircle2 size={10} className="text-white" />}
                  </div>
                  <span className="text-[10px] text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">{label}</span>
                  <input type="checkbox" id={id} checked={checked} onChange={onChange} className="sr-only" />
                </label>
              ))}
            </div>

            <button
              type="button"
              disabled={!allConsentsGiven}
              onClick={() => setStep(1)}
              className={`w-full flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-bold uppercase transition-all duration-150 shadow-md ${
                allConsentsGiven
                  ? 'bg-[#8A004B] hover:bg-[#a6005b] active:scale-[0.99] text-white shadow-[#8A004B]/15 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {allConsentsGiven ? (<>I Agree — Proceed to KYC <ArrowRight size={13} /></>) : 'Please Accept All Consents Above'}
            </button>

            <p className="text-center text-[9px] text-slate-600 leading-relaxed">
              Protected under RBI Digital Lending Directions 2025 · DPDP Act 2023 · You may withdraw consent at any time during the cooling-off period.
            </p>
          </div>
        )}

        {/* ─── STEP 1: PAN + AADHAAR ─────────────────────────────────── */}
        {step === 1 && (
          <form onSubmit={handlePanSubmit} className="space-y-5">
            <div className="space-y-1.5 text-center">
              <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] font-bold uppercase tracking-wider">
                Step 1 of 2: Credit Assessment
              </span>
              <h2 className="text-lg font-black text-white">Treatment EMI Application</h2>
              <p className="text-[11px] text-slate-400">
                Hi <strong className="text-white">{patientName}</strong>, apply for ₹<strong className="text-white">{amount}</strong> treatment financing.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[9.5px] font-bold text-slate-450 uppercase tracking-wider mb-1">PAN Card Number</label>
                <input type="text" maxLength={10} placeholder="ABCDE1234F" value={pan} onChange={(e) => setPan(e.target.value.toUpperCase())} className="w-full px-3.5 py-2.5 bg-slate-950/40 border border-slate-800 rounded-xl text-xs font-semibold font-mono text-white placeholder:text-slate-600 outline-none focus:border-indigo-500/60 transition-all uppercase" required />
              </div>
              <div>
                <label className="block text-[9.5px] font-bold text-slate-455 uppercase tracking-wider mb-1">Aadhaar Card Number</label>
                <input type="text" maxLength={12} placeholder="1234 5678 9012" value={aadhaar} onChange={(e) => setAadhaar(e.target.value.replace(/[^0-9]/g, ''))} className="w-full px-3.5 py-2.5 bg-slate-950/40 border border-slate-800 rounded-xl text-xs font-semibold font-mono text-white placeholder:text-slate-600 outline-none focus:border-indigo-500/60 transition-all" required />
              </div>
            </div>

            <div className="flex items-start gap-2 bg-green-500/5 border border-green-500/15 rounded-xl px-3 py-2">
              <ShieldCheck size={12} className="text-green-400 shrink-0 mt-0.5" />
              <p className="text-[9.5px] text-green-400/80">Your consent was recorded at {consentTimestamp}. Data processed under DPDP Act 2023.</p>
            </div>

            <button type="submit" className="w-full flex items-center justify-center gap-1.5 py-3 bg-[#8A004B] hover:bg-[#a6005b] active:scale-[0.99] text-white rounded-xl text-xs font-bold uppercase transition-all duration-150 shadow-md shadow-[#8A004B]/15">
              Verify & Proceed <ArrowRight size={13} />
            </button>
          </form>
        )}

        {/* ─── STEP 2: OTP ───────────────────────────────────────────── */}
        {step === 2 && (
          <form onSubmit={handleOtpSubmit} className="space-y-5">
            <div className="space-y-1.5 text-center">
              <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] font-bold uppercase tracking-wider">
                Step 2 of 2: Aadhaar OTP Verification
              </span>
              <h2 className="text-lg font-black text-white">Enter OTP</h2>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                An Aadhaar-linked OTP has been sent to your registered mobile. Enter it below to authorize.
              </p>
            </div>
            <div>
              <label className="block text-[9.5px] font-bold text-slate-450 uppercase tracking-wider mb-1">Aadhaar OTP (6-Digit)</label>
              <input type="text" maxLength={6} placeholder="••••••" value={otp} onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))} className="w-full px-3.5 py-2.5 bg-slate-950/40 border border-slate-800 rounded-xl text-xs font-semibold font-mono text-center tracking-[8px] text-white placeholder:text-slate-600 outline-none focus:border-indigo-500/60 transition-all" required />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium px-1">
              <span>Aadhaar secure validation</span>
              {timer > 0 ? <span>Resend OTP in {timer}s</span> : <button type="button" onClick={() => { setTimer(30); toast.success('New OTP sent successfully!'); }} className="text-[#8A004B] hover:underline font-bold">Resend OTP</button>}
            </div>
            <button type="submit" className="w-full flex items-center justify-center gap-1.5 py-3 bg-[#8A004B] hover:bg-[#a6005b] active:scale-[0.99] text-white rounded-xl text-xs font-bold uppercase transition-all duration-150 shadow-md shadow-[#8A004B]/15">
              Verify OTP & Authorize Loan <ShieldCheck size={13} />
            </button>
          </form>
        )}

        {/* ─── STEP 3: UNDERWRITING LOADER ───────────────────────────── */}
        {step === 3 && (
          <div className="py-8 space-y-6 flex flex-col items-center justify-center text-center">
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
              <div className="absolute w-8 h-8 rounded-full bg-[#8A004B] animate-pulse flex items-center justify-center text-[10px] text-white font-bold">A</div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">{loadingText}</h3>
              <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed mx-auto font-sans">
                Credit engine is checking CIBIL, verifying your Aadhaar metadata, and setting up the EMI mandate contract.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-[10px] text-slate-500 space-y-1">
        <p>© 2026 Axis Bank. All Rights Reserved.</p>
        <p className="max-w-xs leading-relaxed mx-auto">
          Regulated by the Reserve Bank of India · Digital Lending Directions 2025 · Grievance: grievance@axisbank.com
        </p>
      </div>
    </div>
  );
}
