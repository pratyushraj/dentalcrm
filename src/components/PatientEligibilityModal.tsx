import React, { useState } from 'react';
import { X, Shield, Sparkles, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { emailNotificationService } from '@/services/emailNotificationService';

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

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mobile.trim()) {
      toast.error('Please provide your name and mobile number');
      return;
    }

    // Basic 10-digit validation
    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Send Lead notification to backend/email
      emailNotificationService.sendNotification('Blog Patient EMI Eligibility Check', {
        patientName: name,
        mobile: cleanMobile,
        treatment: treatment,
        estimatedCost: amount,
        city: city || 'Not specified',
        source: sourcePage,
        checkedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
      });

      toast.success('Eligibility check initiated! Redirecting to secure verification...');

      // 2. Redirect to Dhanlift partner KYC / loan application URL with prefilled parameters
      const mob = encodeURIComponent(cleanMobile);
      const nameParam = encodeURIComponent(name);
      const targetUrl = `https://www.dhanlift.com/loans/personal-loan-for-salaried-employees/clinaza-patient-treatment-loan?utm_source=affiliate&utm_medium=partner&utm_campaign=partner-campaign-aff-4&utm_term=03-09-2026&mobile=${mob}&phone=${mob}&phoneNumber=${mob}&aff_sub=${mob}&name=${nameParam}&treatment=${encodeURIComponent(treatment)}`;

      setTimeout(() => {
        window.location.href = targetUrl;
      }, 700);
    } catch (err) {
      console.error('Error submitting eligibility form:', err);
      // Still forward user to partner page
      const mob = encodeURIComponent(cleanMobile);
      window.location.href = `https://www.dhanlift.com/loans/personal-loan-for-salaried-employees/clinaza-patient-treatment-loan?utm_source=affiliate&utm_medium=partner&utm_campaign=partner-campaign-aff-4&utm_term=03-09-2026&mobile=${mob}`;
    }
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
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="space-y-1.5 pr-6">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-[#0867E8] text-[10px] font-black uppercase tracking-wider">
            <Sparkles size={11} /> Instant Soft Eligibility Check
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#0B2450] tracking-tight">
            Check Your Dental EMI Eligibility
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Get 0% or low-interest EMIs from ₹30,000 to ₹3,00,000 with <strong>zero impact on your CIBIL score</strong>.
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
              <div className="text-[11px] font-bold text-[#0B2450]">0% / Low EMI</div>
              <div className="text-[9px] text-slate-500">Flexible 3–24 mos</div>
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
            {isSubmitting ? 'Checking Lenders...' : (
              <>
                <Shield size={14} /> Check Instant Eligibility & Sanction Limits <ArrowRight size={14} />
              </>
            )}
          </button>

          <p className="text-[10px] text-slate-400 text-center leading-relaxed">
            🔒 By submitting, you agree to receive digital financing verification via Clinaza and RBI-regulated lending partner Dhanlift.
          </p>
        </form>
      </div>
    </div>
  );
};
