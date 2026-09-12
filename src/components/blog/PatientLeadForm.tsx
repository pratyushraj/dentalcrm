import React, { useState } from 'react';
import { CheckCircle2, Phone, ShieldCheck, Sparkles, Send, ArrowRight } from 'lucide-react';

interface PatientLeadFormProps {
  defaultTreatment?: string;
  sourceArticle?: string;
}

export const PatientLeadForm: React.FC<PatientLeadFormProps> = ({
  defaultTreatment = 'Dental Implants',
  sourceArticle = 'Cheapest Dental Implants Guide',
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [treatment, setTreatment] = useState(defaultTreatment);
  const [emiNeeded, setEmiNeeded] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setError('Please enter your full name and a valid 10-digit mobile number.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/patient-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          city: city.trim() || 'India',
          treatment,
          emiNeeded,
          pageSource: sourceArticle,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || 'Unable to submit right now. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again or WhatsApp our care desk.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-white border border-emerald-200 rounded-3xl p-8 my-8 text-center space-y-4 shadow-sm">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Inquiry Received Successfully!</h3>
        <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
          Thank you, <strong>{name}</strong>. Our clinical care coordinator is reviewing affordable partner clinics and EMI options in <strong>{city || 'your city'}</strong> and will WhatsApp/call you shortly on <strong>+91 {phone.replace(/\D/g, '').slice(-10)}</strong>.
        </p>
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-100 px-4 py-2 rounded-full">
          <ShieldCheck className="w-4 h-4" /> 100% Free Consultation • No Obligation
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#0B2450] via-[#084298] to-[#0867E8] text-white rounded-3xl p-6 sm:p-8 my-8 shadow-xl relative overflow-hidden border border-blue-400/20">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        <div className="inline-flex items-center gap-2 bg-white/15 text-blue-100 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Lowest Price Guarantee & Free Consultation
        </div>

        <div className="space-y-1">
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Find the Most Affordable Dental Clinic in Your City
          </h3>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl leading-relaxed">
            Get transparent treatment estimates, compare implant/aligner prices, and unlock <strong>instant monthly EMI plans</strong> at top verified clinics near you.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-400 text-red-100 text-xs px-4 py-2.5 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div>
            <label className="block text-[11px] font-semibold text-blue-100 mb-1">Your Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-blue-200/60 focus:outline-none focus:ring-2 focus:ring-white/40 focus:bg-white/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-blue-100 mb-1">WhatsApp / Mobile Number *</label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-sm text-blue-200/80 font-medium">+91</span>
              <input
                type="tel"
                required
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="98765 43210"
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-3.5 py-2.5 text-sm text-white placeholder-blue-200/60 focus:outline-none focus:ring-2 focus:ring-white/40 focus:bg-white/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-blue-100 mb-1">Your City / Area</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Patna, Delhi, Ahmedabad"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-blue-200/60 focus:outline-none focus:ring-2 focus:ring-white/40 focus:bg-white/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-blue-100 mb-1">Treatment Required</label>
            <select
              value={treatment}
              onChange={(e) => setTreatment(e.target.value)}
              className="w-full bg-[#0B2450] border border-white/20 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
            >
              <option value="Single Dental Implant" className="bg-[#0B2450] text-white">Single Tooth Dental Implant</option>
              <option value="Multiple Implants / Full Mouth" className="bg-[#0B2450] text-white">Multiple Implants / Full Mouth</option>
              <option value="Invisible Clear Aligners" className="bg-[#0B2450] text-white">Invisible Clear Aligners</option>
              <option value="Hair Transplant (FUE/DHI)" className="bg-[#0B2450] text-white">Hair Transplant (FUE / DHI / Grafts)</option>
              <option value="LASIK / Contoura Vision Surgery" className="bg-[#0B2450] text-white">LASIK / Contoura Vision Eye Surgery</option>
              <option value="IVF / Fertility Treatment" className="bg-[#0B2450] text-white">IVF / Fertility Treatment</option>
              <option value="Root Canal (RCT) & Crown" className="bg-[#0B2450] text-white">Root Canal (RCT) & Crown</option>
              <option value="Braces / Smile Makeover" className="bg-[#0B2450] text-white">Braces / Smile Makeover</option>
            </select>
          </div>

          <div className="sm:col-span-2 flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="emi-check"
              checked={emiNeeded}
              onChange={(e) => setEmiNeeded(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-white/30 bg-white/20"
            />
            <label htmlFor="emi-check" className="text-xs text-blue-100 cursor-pointer select-none">
              I want to explore <strong>monthly EMI financing options</strong> (0 impact on CIBIL to check).
            </label>
          </div>

          <div className="sm:col-span-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-[#0867E8] hover:bg-blue-50 font-bold text-sm uppercase tracking-wider py-3.5 px-6 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer"
            >
              {loading ? (
                <>Connecting to Care Desk...</>
              ) : (
                <>
                  Find Cheapest Partner Clinic Near Me <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-blue-200/80 pt-1">
          <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> 100% Verified Clinics</span>
          <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Free Price Estimates</span>
          <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Instant WhatsApp Callback</span>
        </div>
      </div>
    </div>
  );
};
