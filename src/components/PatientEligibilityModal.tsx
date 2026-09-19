import React, { useState, useEffect } from 'react';
import { X, Shield, Sparkles, ArrowRight, CheckCircle2, MessageSquare, ExternalLink, Loader2 } from 'lucide-react';
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
  const [countdown, setCountdown] = useState(2);

  // Auto-redirect timer once customerLink is set
  useEffect(() => {
    if (isSuccess && customerLink) {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        window.location.href = customerLink;
      }
    }
  }, [isSuccess, customerLink, countdown]);

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

      // 2. Initiate application with Easycred Partner API
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
      setCountdown(2);
      toast.success('Verification link & OTP dispatched!');
    } catch (err) {
      console.error('Error submitting eligibility form:', err);
      const fallback = `https://easycred.co.in/loan/apply?product=PERSONAL_LOAN&mobile=${cleanMobile}&name=${encodeURIComponent(name)}`;
      setCustomerLink(fallback);
      setMaskedMobile(`••••••${cleanMobile.slice(-4)}`);
      setIsSuccess(true);
      setCountdown(2);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setCustomerLink('');
    setMaskedMobile('');
    setName('');
    setMobile('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-5 text-left overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0867E8] via-[#5b72ff] to-[#0f7a75]" />

        {/* Close button */}
        <button
          type="button"
          onClick={handleReset}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {isSuccess ? (
          /* ── SUCCESS CONFIRMATION SCREEN WITH AUTO-REDIRECT (NO "0%" MENTIONS) ── */
          <div className="space-y-5 py-2 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm mx-auto sm:mx-0">
              <CheckCircle2 size={32} />
            </div>

            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block">
                APPLICATION INITIATED
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#0B2450] tracking-tight">
                Financing Verification Sent
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                We have texted your 6-digit code to <strong className="text-slate-800">{maskedMobile || mobile}</strong>.
              </p>
            </div>

            <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-4 space-y-2.5 text-xs text-slate-700">
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Applicant Name</span>
                <span className="font-bold text-[#0B2450]">{name}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Selected Treatment</span>
                <span className="font-bold text-[#0B2450]">{treatment}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 font-medium">Financing Limit</span>
                <span className="font-bold text-emerald-600">{amount}</span>
              </div>
            </div>

            {/* Auto-redirect Banner */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs text-[#0867E8] font-bold">
              <span className="flex items-center gap-2">
                <Loader2 size={15} className="animate-spin" />
                Auto-redirecting in {countdown}s...
              </span>
              <span className="text-[10px] uppercase font-black tracking-wider text-blue-500">Secure Portal</span>
            </div>

            <div className="space-y-2.5 pt-1">
              <a
                href={customerLink}
                className="w-full py-3.5 bg-[#0867E8] hover:bg-[#0756C7] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 text-center cursor-pointer"
              >
                <span>Continue Immediately to Secure KYC</span>
                <ExternalLink size={14} />
              </a>

              <a
                href={`https://wa.me/917292984244?text=${encodeURIComponent(
                  `Hi Clinaza Desk, I initiated treatment financing for ${treatment} (Mobile: ${mobile}, Name: ${name}). Please guide me through approval.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 text-center"
              >
                <MessageSquare size={14} className="text-emerald-600" />
                <span>Need assistance? Chat with Clinaza Desk</span>
              </a>
            </div>

            <p className="text-[10px] text-slate-400 text-center leading-relaxed">
              🔒 Final approval and repayment schedules are verified digitally by our RBI-registered lending partner.
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
            <form onSubmit={handleSubmit} className="space-y-3.5">
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
