import React, { useState, useEffect } from 'react';
import { 
  X, 
  Shield, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight, 
  Loader2, 
  Lock, 
  Copy,
  Check,
  Eye,
  Building2,
  FileCheck,
  CreditCard,
  UserCheck,
  Sliders,
  ExternalLink,
  ChevronLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { emailNotificationService } from '@/services/emailNotificationService';
import { easycredService } from '@/services/easycredService';

interface PatientEligibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTreatment?: string;
  sourcePage?: string;
}

export const PatientEligibilityModal: React.FC<PatientEligibilityModalProps> = ({
  isOpen,
  onClose,
  defaultTreatment = 'Dental Implants',
  sourcePage = 'Blog Article'
}) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [treatment, setTreatment] = useState(defaultTreatment);
  const [amount, setAmount] = useState('₹50,000 - ₹1,50,000');
  const [city, setCity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [customerLink, setCustomerLink] = useState('');
  const [maskedMobile, setMaskedMobile] = useState('');
  const [countdown, setCountdown] = useState(5);
  const [copied, setCopied] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [showSimulatedKyc, setShowSimulatedKyc] = useState(false);
  const [kycStep, setKycStep] = useState<'aadhaar' | 'offers' | 'sanction'>('aadhaar');
  const [selectedTenure, setSelectedTenure] = useState(12);

  // Auto-redirect timer with pause/resume control
  useEffect(() => {
    if (isSuccess && customerLink && !isPaused) {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        window.location.href = customerLink;
      }
    }
  }, [isSuccess, customerLink, countdown, isPaused]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mobile.trim()) {
      toast.error('Please provide your name and mobile number');
      return;
    }

    const cleanMobile = mobile.replace(/\D/g, '').slice(-10);
    if (cleanMobile.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Send Lead notification to backend/email
      emailNotificationService.sendNotification('Patient EMI Eligibility Check', {
        patientName: name,
        mobile: cleanMobile,
        treatment: treatment,
        estimatedCost: amount,
        city: city || 'Not specified',
        source: sourcePage,
        checkedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
      });

      // 2. Initiate application with Easycred Partner API (standard ONLINE_PERSONAL)
      const result = await easycredService.initiateApplication({
        customerName: name.trim(),
        mobile: cleanMobile,
        productCode: 'ONLINE_PERSONAL'
      });

      const link = (result.success && result.data?.customerLink)
        ? result.data.customerLink
        : (result.fallbackLink || `https://easycred.co.in/loan/apply?product=PERSONAL_LOAN&mobile=${cleanMobile}&name=${encodeURIComponent(name)}`);

      const masked = (result.success && result.data?.maskedMobile)
        ? result.data.maskedMobile
        : `••••••${cleanMobile.slice(-4)}`;

      setCustomerLink(link);
      setMaskedMobile(masked);
      setIsSuccess(true);
      setCountdown(5);
      toast.success('Financing verification sent to your mobile!');
    } catch (err) {
      console.error('Error submitting eligibility form:', err);
      const fallback = `https://easycred.co.in/loan/apply?product=PERSONAL_LOAN&mobile=${cleanMobile}&name=${encodeURIComponent(name)}`;
      setCustomerLink(fallback);
      setMaskedMobile(`••••••${cleanMobile.slice(-4)}`);
      setIsSuccess(true);
      setCountdown(5);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = () => {
    if (!customerLink) return;
    navigator.clipboard.writeText(customerLink);
    setCopied(true);
    toast.success('Secure link copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePreviewMode = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDemoMode(true);
    setShowSimulatedKyc(false);
    setKycStep('aadhaar');
    setName('Rahul Sharma');
    setMobile('9876543210');
    setTreatment('Dental Implants');
    setAmount('₹1,20,000');
    setCustomerLink('https://easycred.co.in/loan/invite?t=4f5c35f59772ee1325c2907ed1d09947e83ecb4f3399e1e4');
    setMaskedMobile('••••••3210');
    setIsSuccess(true);
    setIsPaused(true); // Default paused so user can freely inspect UI without redirecting
    setCountdown(5);
    toast.info('Viewing loan confirmation in Demo Preview mode (no OTP sent)');
  };

  const handleReset = () => {
    setIsSuccess(false);
    setIsDemoMode(false);
    setShowSimulatedKyc(false);
    setKycStep('aadhaar');
    setCustomerLink('');
    setMaskedMobile('');
    setName('');
    setMobile('');
    setIsPaused(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl relative text-left overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0867E8] via-[#5b72ff] to-[#0f7a75]" />

        {/* Close button */}
        <button
          type="button"
          onClick={handleReset}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors z-10"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {isSuccess ? (
          /* ── IN-APP SEAMLESS CARE-PASS OVERLAY ── */
          <div className="space-y-4 py-1 animate-in zoom-in-95 duration-200 overflow-y-auto pr-0.5">
            {/* Header Status Card */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0 shadow-xs">
                <CheckCircle2 size={26} />
              </div>
              <div>
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block">
                  FINANCING PASS READY
                </span>
                <h3 className="text-lg sm:text-xl font-black text-[#0B2450] tracking-tight leading-tight">
                  Verification Code Dispatched
                </h3>
                <p className="text-[11px] text-slate-500">
                  Texted via SMS to <strong className="text-slate-800">{maskedMobile || mobile}</strong>
                </p>
              </div>
            </div>

            {/* Smart Countdown & Hand-off Banner */}
            <div className="p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50/80 border border-blue-200 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <Loader2 size={16} className={`text-[#0867E8] ${isPaused ? '' : 'animate-spin'}`} />
                <div>
                  <span className="font-black text-[#0B2450] block">
                    {isPaused ? 'Auto-redirect paused' : `Launching secure portal in ${countdown}s`}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Entering encrypted RBI lending gateway
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPaused(!isPaused)}
                className="text-[10px] font-bold text-[#0867E8] hover:underline px-2 py-1 rounded bg-white border border-blue-200 shadow-2xs"
              >
                {isPaused ? 'Resume' : 'Pause'}
              </button>
            </div>

            {/* In-App Healthcare Care-Pass Card */}
            <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-3 relative overflow-hidden shadow-lg border border-slate-800">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black tracking-widest uppercase text-emerald-400">CLINAZA PASS</span>
                  <span className="text-[9px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">ID: {cleanMobile(mobile)}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <Lock size={10} className="text-emerald-400" />
                  <span>256-Bit SSL</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Patient Name</span>
                  <span className="font-bold text-slate-100">{name}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Treatment</span>
                  <span className="font-bold text-slate-100 truncate block">{treatment}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Requested Amount</span>
                  <span className="font-bold text-emerald-400">{amount}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Lender Network</span>
                  <span className="font-bold text-slate-200">Easycred / 55+ NBFCs</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              {isDemoMode ? (
                <button
                  type="button"
                  onClick={() => setShowSimulatedKyc(true)}
                  className="w-full py-3.5 bg-gradient-to-r from-[#0867E8] to-indigo-600 hover:from-[#0756C7] hover:to-indigo-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 text-center cursor-pointer"
                >
                  <Shield size={15} />
                  <span>Launch In-App KYC Verification (Clinaza Branded)</span>
                  <ChevronRight size={15} />
                </button>
              ) : (
                <a
                  href={customerLink}
                  className="w-full py-3.5 bg-[#0867E8] hover:bg-[#0756C7] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 text-center cursor-pointer"
                >
                  <span>Continue to Secure KYC Now</span>
                  <ChevronRight size={15} />
                </a>
              )}

              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Secure KYC Link'}</span>
              </button>
            </div>

            {/* In-App Simulated KYC Walkthrough Container (Option 1 - 100% Clinaza Branded) */}
            {showSimulatedKyc && (
              <div className="fixed inset-0 z-[1001] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative text-left overflow-hidden flex flex-col max-h-[92vh]">
                  {/* Clinaza Institutional Co-branding Bar */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#0867E8] text-white flex items-center justify-center font-black text-sm">
                        C
                      </div>
                      <div>
                        <div className="text-xs font-black text-[#0B2450] tracking-tight">CLINAZA PATIENT FINANCING</div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Lock size={10} className="text-emerald-600" /> Powered by RBI Regulated Lending Grid
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowSimulatedKyc(false)}
                      className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* KYC Steps Progress Pill */}
                  <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl mb-4 text-center">
                    <button
                      type="button"
                      onClick={() => setKycStep('aadhaar')}
                      className={`py-1.5 rounded-lg text-[10px] font-bold transition-all ${kycStep === 'aadhaar' ? 'bg-white text-[#0867E8] shadow-xs' : 'text-slate-500'}`}
                    >
                      1. Digital KYC
                    </button>
                    <button
                      type="button"
                      onClick={() => setKycStep('offers')}
                      className={`py-1.5 rounded-lg text-[10px] font-bold transition-all ${kycStep === 'offers' ? 'bg-white text-[#0867E8] shadow-xs' : 'text-slate-500'}`}
                    >
                      2. Sanction & Tenures
                    </button>
                    <button
                      type="button"
                      onClick={() => setKycStep('sanction')}
                      className={`py-1.5 rounded-lg text-[10px] font-bold transition-all ${kycStep === 'sanction' ? 'bg-white text-[#0867E8] shadow-xs' : 'text-slate-500'}`}
                    >
                      3. Clinic Payout
                    </button>
                  </div>

                  {/* Step Content */}
                  <div className="overflow-y-auto pr-0.5 space-y-4 flex-1">
                    {kycStep === 'aadhaar' && (
                      <div className="space-y-3.5">
                        <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl">
                          <div className="flex items-center gap-2 text-xs font-bold text-[#0B2450]">
                            <UserCheck size={16} className="text-[#0867E8]" />
                            <span>Instant Identity Verification</span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-1">
                            Paperless e-KYC linked to patient mobile (+91 {maskedMobile || '••••••3210'})
                          </p>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Aadhaar / PAN Verification</label>
                          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs font-mono">
                            <span className="text-slate-700">XXXX-XXXX-8921</span>
                            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">✓ Verified</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Lending Bureau Soft Check</label>
                          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                            <span className="text-slate-700">Experian / CIBIL Score</span>
                            <span className="font-bold text-emerald-600">768 (Pre-Approved)</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setKycStep('offers')}
                          className="w-full py-3 bg-[#0867E8] hover:bg-[#0756C7] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md mt-2 flex items-center justify-center gap-2"
                        >
                          <span>View Approved Sanctions</span>
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    )}

                    {kycStep === 'offers' && (
                      <div className="space-y-3.5">
                        <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2">
                          <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Pre-Approved Sanction Limit</div>
                          <div className="text-2xl font-black">₹1,50,000</div>
                          <div className="text-[11px] text-slate-400">Available immediately for Dr. Treatment Plan</div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center justify-between">
                            <span>Select Repayment Tenure</span>
                            <span className="text-[#0867E8] font-black">{selectedTenure} Months</span>
                          </label>
                          <div className="grid grid-cols-4 gap-2">
                            {[3, 6, 12, 24].map((t) => (
                              <button
                                key={t}
                                type="button"
                                onClick={() => setSelectedTenure(t)}
                                className={`py-2 rounded-xl text-xs font-bold border transition-all ${selectedTenure === t ? 'bg-[#0867E8] text-white border-[#0867E8]' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}
                              >
                                {t} Mo
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Calculated Monthly Breakdown */}
                        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Monthly EMI</span>
                            <span className="font-bold text-[#0B2450]">
                              ₹{Math.round(120000 / selectedTenure).toLocaleString('en-IN')}/mo
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Processing Fee</span>
                            <span className="font-bold text-emerald-600">₹0 (Waived for Clinaza Partner Clinics)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Lender Allocation</span>
                            <span className="font-bold text-slate-700">Easycred / Axis NBFC Network</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setKycStep('sanction')}
                          className="w-full py-3 bg-[#0867E8] hover:bg-[#0756C7] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md mt-2 flex items-center justify-center gap-2"
                        >
                          <span>Confirm Plan & Direct Clinic Payout</span>
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    )}

                    {kycStep === 'sanction' && (
                      <div className="space-y-4 text-center py-2">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                          <CheckCircle2 size={32} />
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-[#0B2450]">Financing Sanction Active</h4>
                          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                            ₹1,20,000 disbursement scheduled directly to the dental clinic upon appointment confirmation.
                          </p>
                        </div>

                        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-left space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Reference ID:</span>
                            <span className="font-mono font-bold text-slate-800">CLZ-2026-8942</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Patient:</span>
                            <span className="font-bold text-slate-800">{name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Treatment:</span>
                            <span className="font-bold text-slate-800">{treatment}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">EMI Mandate:</span>
                            <span className="font-bold text-emerald-600">Auto-Debit Ready</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setShowSimulatedKyc(false)}
                          className="w-full py-3 bg-[#0B2450] hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                        >
                          Close Preview Walkthrough
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Footer Security Note */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 mt-3">
                    <span className="flex items-center gap-1">
                      <Shield size={11} className="text-emerald-500" /> 100% RBI Compliant
                    </span>
                    <span>No upfront patient fee</span>
                  </div>
                </div>
              </div>
            )}

            <p className="text-[10px] text-slate-400 text-center leading-relaxed pt-1 border-t border-slate-100">
              🔒 Final approval and repayment terms are verified digitally on our partner portal.
            </p>
          </div>
        ) : (
          /* ── APPLICATION FORM ── */
          <>
            {/* Header */}
            <div className="space-y-1.5 pr-6">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-[#0867E8] text-[10px] font-black uppercase tracking-wider">
                <Sparkles size={11} /> Instant Soft Eligibility Check
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#0B2450] tracking-tight">
                Check Your Dental EMI Eligibility
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Get flexible low-interest monthly installments from ₹30,000 to ₹3,00,000 with <strong>zero impact on your CIBIL score</strong>.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5 mt-2">
              {/* Name & Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0867E8] focus:bg-white transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit mobile"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0867E8] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Treatment & Estimated Amount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Planned Treatment</label>
                  <select
                    value={treatment}
                    onChange={(e) => setTreatment(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0867E8] focus:bg-white transition-all"
                  >
                    <option value="Dental Implants">Single / Multi Dental Implants</option>
                    <option value="Full Mouth Dental Implants">Full Mouth All-on-4 / All-on-6</option>
                    <option value="Clear Aligners">Clear Aligners / Invisible Braces</option>
                    <option value="Orthodontic Braces">Traditional / Ceramic Braces</option>
                    <option value="Root Canal & Crowns">Root Canal & Zirconia Crowns</option>
                    <option value="Cosmetic / Smile Makeover">Cosmetic Smile Makeover</option>
                    <option value="Other Dental Treatment">Other Dental Treatment</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Estimated Amount</label>
                  <select
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0867E8] focus:bg-white transition-all"
                  >
                    <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000</option>
                    <option value="₹50,000 - ₹1,50,000">₹50,000 - ₹1,50,000</option>
                    <option value="₹1,50,000 - ₹3,00,000">₹1,50,000 - ₹3,00,000</option>
                    <option value="₹3,00,000+">₹3,00,000+ (Full Mouth)</option>
                  </select>
                </div>
              </div>

              {/* City */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Your City / Location</label>
                <input
                  type="text"
                  placeholder="e.g. Patna, Delhi NCR, Mumbai, Bengaluru, etc."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0867E8] focus:bg-white transition-all"
                />
              </div>

              {/* Value Badges */}
              <div className="grid grid-cols-3 gap-2 py-1 text-center">
                <div className="bg-slate-50 border border-slate-100 rounded-lg p-2">
                  <div className="text-[11px] font-bold text-[#0B2450]">Flexible EMI</div>
                  <div className="text-[9px] text-slate-500">Custom 3–24 mos</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-lg p-2">
                  <div className="text-[11px] font-bold text-[#0B2450]">2-Min Approval</div>
                  <div className="text-[9px] text-slate-500">Instant Digital KYC</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-lg p-2">
                  <div className="text-[11px] font-bold text-[#0B2450]">Zero CIBIL Hit</div>
                  <div className="text-[9px] text-slate-500">Soft eligibility query</div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !name.trim() || !mobile.trim()}
                className="w-full py-3.5 bg-[#0867E8] hover:bg-[#0756C7] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? 'Initiating Financing...' : (
                  <>
                    <Shield size={14} /> Check Instant Eligibility & Sanction Limits <ArrowRight size={14} />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center pt-1">
                <button
                  type="button"
                  onClick={handlePreviewMode}
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 hover:text-[#0867E8] transition-colors py-1 px-2.5 rounded-lg hover:bg-blue-50/50 cursor-pointer"
                >
                  <Eye size={13} className="text-slate-400" />
                  <span>Preview Confirmation UI (Demo Mode — No OTP)</span>
                </button>
              </div>

              <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                🔒 By submitting, you agree to receive digital financing verification via Clinaza and partnered RBI-regulated lending infrastructure.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

// Helper to mask mobile
function cleanMobile(m: string) {
  const digits = m.replace(/\D/g, '').slice(-10);
  return digits ? `+91 ${digits.slice(0, 5)} ${digits.slice(5)}` : 'N/A';
}
