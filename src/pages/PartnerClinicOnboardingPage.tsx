import React, { useState } from 'react';
import { SEOHead } from '@/components/seo/SEOHead';
import { 
  Building2, 
  Stethoscope, 
  ShieldCheck, 
  TrendingUp, 
  Share2, 
  Check,
  Sparkles
} from 'lucide-react';
import { emailNotificationService } from '@/services/emailNotificationService';
import { toast } from 'sonner';

export default function PartnerClinicOnboardingPage() {
  const [form, setForm] = useState({
    clinicName: '',
    doctorName: '',
    city: '',
    phone: '',
    chairs: '2 Chairs',
    specialties: ['Dental Implants', 'Clear Aligners'],
    avgMonthlyCases: '10',
    expectedEmiLoans: '5',
    avgTicketSize: '₹40,000'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const toggleSpecialty = (item: string) => {
    setForm(prev => {
      const exists = prev.specialties.includes(item);
      return {
        ...prev,
        specialties: exists 
          ? prev.specialties.filter(s => s !== item)
          : [...prev.specialties, item]
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clinicName || !form.phone || !form.city) {
      toast.error('Please fill in clinic name, city, and phone number.');
      return;
    }

    setIsSubmitting(true);

    try {
      await emailNotificationService.sendNotification('🏥 New Clinic Pilot Accreditation Submitted', {
        'Clinic Name': form.clinicName,
        'Doctor Name': form.doctorName || 'Doctor',
        'City / Location': form.city,
        'Contact Phone': form.phone,
        'Dental Chairs': form.chairs,
        'Most Common Treatments': form.specialties.join(', '),
        'Monthly High-Ticket Cases (>₹25k)': form.avgMonthlyCases,
        'Expected Monthly Loan / EMI Applications': form.expectedEmiLoans,
        'Avg Treatment Ticket': form.avgTicketSize,
        'Estimated Monthly Loan Volume Potential': `₹${(parseInt(form.expectedEmiLoans || '5') * 40000).toLocaleString('en-IN')}/month`
      });
    } catch (err) {
      console.error(err);
    }

    setIsSubmitting(false);
    setSubmitted(true);
    toast.success('Clinic profile accredited successfully!');
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.origin + '/clinic-onboarding');
    setCopiedLink(true);
    toast.success('Share link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#0867E8] selection:text-white pb-20">
      <SEOHead 
        title="Partner Clinic Onboarding — Clinaza Point-of-Care EMI"
        description="Official onboarding portal for partner dental clinics to activate instant point-of-care patient EMI financing."
        image="https://www.clinaza.in/og-clinaza.png"
      />

      {/* Top Header */}
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <img 
            src="/assets/clinaza-logo.jpg" 
            alt="CLINAZA" 
            className="h-10 w-10 rounded-xl border border-slate-200 shadow-sm object-cover" 
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-widest text-[#0B2450] uppercase">CLINAZA</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[10px] font-bold text-[#0867E8]">
                CLINIC ONBOARDING
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">Point-of-Care Patient EMI Network</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyShareLink}
            className="px-3.5 py-1.5 rounded-xl bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm shadow-[#0867E8]/20"
          >
            {copiedLink ? <Check size={13} /> : <Share2 size={13} />}
            <span className="hidden sm:inline">{copiedLink ? 'Copied Link!' : 'Share Form'}</span>
            <span className="sm:hidden">Share</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        {/* Hero Banner */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0867E8] text-xs font-bold">
            <Sparkles size={13} />
            <span>Healthcare Patient EMI Integration</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#0B2450] tracking-tight">
            Clinic Partner <span className="text-[#0867E8]">Onboarding</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            Please confirm your clinic's high-ticket procedure volume to activate pre-approved patient financing lines with our lending partner (ShopSe).
          </p>
        </div>

        {submitted ? (
          <div className="bg-white border border-emerald-200 rounded-2xl p-8 text-center space-y-4 shadow-sm">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
              ✓
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Clinic Details Submitted!</h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Thank you! Your clinic has been logged for merchant accreditation. Our team will share your digital merchant QR standee and front-desk portal.
            </p>
            <div className="pt-4 flex justify-center">
              <button
                onClick={() => {
                  setSubmitted(false);
                  setForm({
                    clinicName: '',
                    doctorName: '',
                    city: '',
                    phone: '',
                    chairs: '2 Chairs',
                    specialties: ['Dental Implants', 'Clear Aligners'],
                    avgMonthlyCases: '10',
                    expectedEmiLoans: '5',
                    avgTicketSize: '₹40,000'
                  });
                }}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all"
              >
                Submit Another Clinic
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-8 shadow-sm space-y-6">
            
            {/* 1. Clinic Identity */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <Building2 className="text-[#0867E8]" size={17} />
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">1. Clinic Profile & Location</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Clinic Name *</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Apex Dental & Implant Clinic"
                    value={form.clinicName}
                    onChange={e => setForm({...form, clinicName: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0867E8] focus:ring-1 focus:ring-[#0867E8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Doctor Name</label>
                  <input 
                    type="text"
                    placeholder="e.g. Dr. Aryan Parmar"
                    value={form.doctorName}
                    onChange={e => setForm({...form, doctorName: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0867E8] focus:ring-1 focus:ring-[#0867E8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">City & State *</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Patna, Bihar or Delhi NCR"
                    value={form.city}
                    onChange={e => setForm({...form, city: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0867E8] focus:ring-1 focus:ring-[#0867E8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Direct WhatsApp / Mobile *</label>
                  <input 
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={form.phone}
                    onChange={e => setForm({...form, phone: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0867E8] focus:ring-1 focus:ring-[#0867E8]"
                  />
                </div>
              </div>
            </div>

            {/* 2. Most Common Treatments & Chairs */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <Stethoscope className="text-[#0867E8]" size={17} />
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">2. Most Common Treatments & Chairs</h2>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Most Number of Treatment Types at Clinic:</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Dental Implants',
                    'Clear Aligners',
                    'Orthodontic Braces',
                    'Full Mouth Rehabilitation',
                    'Zirconia Crowns & Makeovers',
                    'Root Canal (RCT)'
                  ].map((item) => {
                    const active = form.specialties.includes(item);
                    return (
                      <button
                        type="button"
                        key={item}
                        onClick={() => toggleSpecialty(item)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          active
                            ? 'bg-blue-50 border-[#0867E8] text-[#0867E8]'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {active ? '✓ ' : '+ '}{item}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Number of Active Dental Chairs</label>
                <div className="grid grid-cols-4 gap-2">
                  {['1 Chair', '2 Chairs', '3 Chairs', '4+ Chairs'].map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => setForm({...form, chairs: opt})}
                      className={`py-2 text-xs font-bold rounded-xl border text-center transition-all ${
                        form.chairs === opt
                          ? 'bg-[#0867E8] text-white border-[#0867E8] shadow-xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. The Core Lending Data: High-Ticket Cases & Expected Loans */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <TrendingUp className="text-emerald-600" size={17} />
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">3. Case Volume & Monthly Loan Demand</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-800 uppercase tracking-wide">
                    High-Ticket Cases (&gt;₹25k)
                  </label>
                  <p className="text-[10px] text-slate-500">Approx. implants/aligners/rehabs seen per month</p>
                  <input 
                    type="text"
                    placeholder="e.g. 8 - 12 cases"
                    value={form.avgMonthlyCases}
                    onChange={e => setForm({...form, avgMonthlyCases: e.target.value})}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:border-[#0867E8]"
                  />
                </div>

                <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3.5 space-y-1.5">
                  <label className="block text-[11px] font-bold text-emerald-800 uppercase tracking-wide">
                    Likely Monthly Loans / EMIs
                  </label>
                  <p className="text-[10px] text-emerald-600/80">Patients opting for EMI at front-desk</p>
                  <input 
                    type="text"
                    placeholder="e.g. 5 - 8 loans"
                    value={form.expectedEmiLoans}
                    onChange={e => setForm({...form, expectedEmiLoans: e.target.value})}
                    className="w-full bg-white border border-emerald-300 rounded-lg px-3 py-2 text-xs text-emerald-700 font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-800 uppercase tracking-wide">
                    Avg Treatment Ticket Size
                  </label>
                  <p className="text-[10px] text-slate-500">Typical package cost for these cases</p>
                  <input 
                    type="text"
                    placeholder="e.g. ₹40,000"
                    value={form.avgTicketSize}
                    onChange={e => setForm({...form, avgTicketSize: e.target.value})}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:border-[#0867E8]"
                  />
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-[#0867E8]/20 flex items-center justify-center gap-2 active:scale-98"
              >
                {isSubmitting ? (
                  <span>Submitting Clinic...</span>
                ) : (
                  <>
                    <ShieldCheck size={16} /> Submit Clinic Profile for EMI Accreditation
                  </>
                )}
              </button>
              <p className="text-[11px] text-slate-500 text-center mt-2.5">
                Information is confidential and used solely to establish point-of-sale patient financing lines.
              </p>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
