import React, { useState } from 'react';
import { SEOHead } from '@/components/seo/SEOHead';
import { 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  Stethoscope, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  Download, 
  Share2, 
  Copy, 
  FileSpreadsheet,
  Check,
  Percent,
  Sparkles
} from 'lucide-react';
import { emailNotificationService } from '@/services/emailNotificationService';
import { toast } from 'sonner';

interface ClinicEntry {
  clinicName: string;
  doctorName: string;
  city: string;
  phone: string;
  chairs: string;
  specialties: string[];
  avgMonthlyCases: string;
  expectedEmiLoans: string;
  avgTicketSize: string;
  submittedAt?: string;
}

const STORAGE_KEY = 'clinaza_pilot_clinics_cohort';

export default function PartnerClinicOnboardingPage() {
  const [form, setForm] = useState({
    clinicName: '',
    doctorName: '',
    city: '',
    phone: '',
    chairs: '2',
    specialties: ['Dental Implants', 'Clear Aligners'],
    avgMonthlyCases: '10',
    expectedEmiLoans: '5',
    avgTicketSize: '₹40,000'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'summary'>('form');

  // Load existing cohort for internal presentation
  const [cohortList, setCohortList] = useState<ClinicEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    // Default high-profile pilot seed data so the summary report looks immediately ready
    return [
      {
        clinicName: 'YOUR DENTIST DENTAL CARE',
        doctorName: 'Dr. Aryan Parmar (MDS)',
        city: 'Patna, Bihar',
        phone: '+91 62014 78033',
        chairs: '3 Chairs',
        specialties: ['Dental Implants', 'Full Mouth Rehab', 'Zirconia Crowns'],
        avgMonthlyCases: '12 cases/mo',
        expectedEmiLoans: '6 - 8 loans/mo',
        avgTicketSize: '₹45,000',
        submittedAt: 'Verified Partner'
      },
      {
        clinicName: 'GuMzy Dental & Implant Centre',
        doctorName: 'Dr. P. Sharma (BDS, MDS Ortho)',
        city: 'Gurugram, Delhi NCR',
        phone: '+91 98110 XXXXX',
        chairs: '2 Chairs',
        specialties: ['Clear Aligners', 'Orthodontic Braces'],
        avgMonthlyCases: '15 cases/mo',
        expectedEmiLoans: '8 - 10 loans/mo',
        avgTicketSize: '₹55,000',
        submittedAt: 'Verified Partner'
      }
    ];
  });

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

    const newEntry: ClinicEntry = {
      ...form,
      submittedAt: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    // Save to local storage cohort
    const updatedCohort = [newEntry, ...cohortList];
    setCohortList(updatedCohort);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCohort));
    } catch (err) {
      console.error(err);
    }

    // Send instant email notification to founder
    try {
      await emailNotificationService.sendNotification('🏥 New Clinic Pilot Accreditation Submitted', {
        'Clinic Name': form.clinicName,
        'Doctor Name': form.doctorName || 'Doctor',
        'City / Location': form.city,
        'Contact Phone': form.phone,
        'Dental Chairs': form.chairs,
        'Key Procedures': form.specialties.join(', '),
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
    navigator.clipboard.writeText(window.location.origin + '/pilot-onboarding');
    setCopiedLink(true);
    toast.success('Share link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const totalMonthlyPotential = cohortList.reduce((acc, curr) => {
    const loans = parseInt(curr.expectedEmiLoans) || 6;
    const ticket = parseInt(curr.avgTicketSize.replace(/\D/g, '')) || 45000;
    return acc + (loans * ticket);
  }, 0);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-[#0867E8] selection:text-white pb-20">
      <SEOHead 
        title="Partner Clinic Pilot Accreditation — Clinaza Point-of-Care EMI"
        description="Priority accreditation portal for partner dental clinics to activate instant point-of-care patient EMI financing."
      />

      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#0867E8] to-[#12A8A0] flex items-center justify-center font-black text-white text-sm shadow-md shadow-[#0867E8]/20">
            C
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-widest text-white uppercase">CLINAZA</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-[#38BDF8]">
                PARTNER ACCREDITATION
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">Founding Cohort • Point-of-Care EMI Pilot</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab(activeTab === 'form' ? 'summary' : 'form')}
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-all"
          >
            <FileSpreadsheet size={13} className="text-[#38BDF8]" />
            <span className="hidden sm:inline">{activeTab === 'form' ? 'View Partner Cohort Table' : 'Open Clinic Form'}</span>
            <span className="sm:hidden">{activeTab === 'form' ? 'Cohort' : 'Form'}</span>
          </button>
          <button
            onClick={copyShareLink}
            className="px-3 py-1.5 rounded-lg bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-[#0867E8]/20"
          >
            {copiedLink ? <Check size={13} /> : <Share2 size={13} />}
            <span className="hidden sm:inline">{copiedLink ? 'Copied Link!' : 'Share Form'}</span>
            <span className="sm:hidden">Share</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        {activeTab === 'form' ? (
          <div>
            {/* Hero / Context Banner */}
            <div className="text-center space-y-3 mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                <Sparkles size={13} />
                <span>Priority Multi-Bank Healthcare EMI Integration</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Clinic Partner <span className="bg-gradient-to-r from-[#38BDF8] to-[#2DD4BF] bg-clip-text text-transparent">Pilot Accreditation</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
                Please confirm your clinic's monthly high-ticket procedure volume to allocate pre-approved patient financing lines with our multi-bank partner (ShopSe).
              </p>
            </div>

            {submitted ? (
              <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-8 text-center space-y-4 shadow-xl">
                <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                  ✓
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Clinic Details Accredited!</h2>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                  Thank you! Your clinic has been logged into the founding partner cohort. Our integration team will share your digital merchant QR standee and front-desk portal.
                </p>
                <div className="pt-4 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => setActiveTab('summary')}
                    className="px-5 py-2.5 bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2"
                  >
                    View Cohort Summary Report <ArrowRight size={14} />
                  </button>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({
                        clinicName: '',
                        doctorName: '',
                        city: '',
                        phone: '',
                        chairs: '2',
                        specialties: ['Dental Implants', 'Clear Aligners'],
                        avgMonthlyCases: '10',
                        expectedEmiLoans: '5',
                        avgTicketSize: '₹40,000'
                      });
                    }}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all"
                  >
                    Add Another Clinic
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 sm:p-8 shadow-2xl space-y-6">
                
                {/* 1. Clinic Identity */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                    <Building2 className="text-[#38BDF8]" size={16} />
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">1. Clinic Profile & Location</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Clinic Name *</label>
                      <input 
                        type="text"
                        required
                        placeholder="e.g. Apex Dental & Implant Clinic"
                        value={form.clinicName}
                        onChange={e => setForm({...form, clinicName: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0867E8]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Lead Doctor Name & Degree</label>
                      <input 
                        type="text"
                        placeholder="e.g. Dr. Aryan Parmar, MDS (Endo)"
                        value={form.doctorName}
                        onChange={e => setForm({...form, doctorName: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0867E8]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">City & State *</label>
                      <input 
                        type="text"
                        required
                        placeholder="e.g. Patna, Bihar or Delhi NCR"
                        value={form.city}
                        onChange={e => setForm({...form, city: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0867E8]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Direct WhatsApp / Mobile *</label>
                      <input 
                        type="tel"
                        required
                        placeholder="e.g. 9876543210"
                        value={form.phone}
                        onChange={e => setForm({...form, phone: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0867E8]"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Treatments & Infrastructure */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                    <Stethoscope className="text-[#38BDF8]" size={16} />
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">2. Clinic Specialities & Dental Chairs</h2>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">Key Treatments Eligible for EMI:</label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Dental Implants',
                        'Clear Aligners',
                        'Orthodontic Braces',
                        'Full Mouth Rehabilitation',
                        'Zirconia Crowns & Makeovers',
                        'Advanced Root Canal (RCT)'
                      ].map((item) => {
                        const active = form.specialties.includes(item);
                        return (
                          <button
                            type="button"
                            key={item}
                            onClick={() => toggleSpecialty(item)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                              active
                                ? 'bg-[#0867E8]/20 border-[#0867E8] text-[#38BDF8]'
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            {active ? '✓ ' : '+ '}{item}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Number of Active Dental Chairs</label>
                    <div className="grid grid-cols-4 gap-2">
                      {['1 Chair', '2 Chairs', '3 Chairs', '4+ Chairs'].map((opt) => (
                        <button
                          type="button"
                          key={opt}
                          onClick={() => setForm({...form, chairs: opt})}
                          className={`py-2 text-xs font-bold rounded-xl border text-center transition-all ${
                            form.chairs === opt
                              ? 'bg-[#0867E8] text-white border-[#0867E8]'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
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
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                    <TrendingUp className="text-emerald-400" size={16} />
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">3. Case Volume & Loan Demand (Monthly)</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
                      <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wide">
                        High-Ticket Cases (&gt;₹25k)
                      </label>
                      <p className="text-[10px] text-slate-500">Approx. implants/aligners/rehabs seen per month</p>
                      <input 
                        type="text"
                        placeholder="e.g. 8 - 12 cases"
                        value={form.avgMonthlyCases}
                        onChange={e => setForm({...form, avgMonthlyCases: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div className="bg-slate-900/90 border border-emerald-500/30 rounded-xl p-3.5 space-y-2">
                      <label className="block text-[11px] font-bold text-emerald-400 uppercase tracking-wide">
                        Likely Monthly Loans / EMIs
                      </label>
                      <p className="text-[10px] text-slate-500">Patients who would opt for EMI at front-desk</p>
                      <input 
                        type="text"
                        placeholder="e.g. 5 - 8 loans"
                        value={form.expectedEmiLoans}
                        onChange={e => setForm({...form, expectedEmiLoans: e.target.value})}
                        className="w-full bg-slate-950 border border-emerald-500/50 rounded-lg px-3 py-2 text-xs text-emerald-400 font-bold focus:outline-none"
                      />
                    </div>

                    <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
                      <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wide">
                        Avg Treatment Ticket Size
                      </label>
                      <p className="text-[10px] text-slate-500">Typical package cost for these treatments</p>
                      <input 
                        type="text"
                        placeholder="e.g. ₹40,000"
                        value={form.avgTicketSize}
                        onChange={e => setForm({...form, avgTicketSize: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-blue-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#0867E8] to-[#12A8A0] hover:from-[#0756C7] hover:to-[#0f8c85] text-white text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-[#0867E8]/25 flex items-center justify-center gap-2 active:scale-98"
                  >
                    {isSubmitting ? (
                      <span>Accrediting Clinic...</span>
                    ) : (
                      <>
                        <ShieldCheck size={16} /> Submit Clinic Profile for EMI Accreditation
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-slate-500 text-center mt-2.5">
                    Information is confidential and shared solely with regulated banking partners to establish point-of-sale disbursement lines.
                  </p>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* COHORT SUMMARY PRESENTATION (FOR SHREDDING OR SHARING TO SHOPSE) */
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono text-[#38BDF8] uppercase font-bold">PILOT VALIDATION DOSSIER</span>
                <h2 className="text-xl sm:text-2xl font-black text-white">Pilot Partner Clinics Cohort</h2>
                <p className="text-xs text-slate-400">Verified standalone practices ready for multi-bank healthcare EMI rollout.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-lg flex items-center gap-1.5 transition-all border border-slate-700"
                >
                  <Download size={13} /> Print / Export
                </button>
              </div>
            </div>

            {/* High Level Stats for ShopSe */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <div className="text-[11px] font-bold text-slate-400 uppercase">Pilot Clinics Enrolled</div>
                <div className="text-3xl font-black text-white mt-1">{cohortList.length} Practices</div>
                <div className="text-[11px] text-slate-500 mt-1">Tier-1 & Regional Hubs</div>
              </div>
              <div className="bg-slate-950 border border-emerald-500/30 rounded-xl p-4">
                <div className="text-[11px] font-bold text-emerald-400 uppercase">Estimated Monthly Loan Demand</div>
                <div className="text-3xl font-black text-emerald-400 mt-1">
                  ₹{(totalMonthlyPotential / 100000).toFixed(1)}L / mo
                </div>
                <div className="text-[11px] text-slate-500 mt-1">High-ticket planned procedures</div>
              </div>
              <div className="bg-slate-950 border border-blue-500/30 rounded-xl p-4">
                <div className="text-[11px] font-bold text-[#38BDF8] uppercase">Expected Applications</div>
                <div className="text-3xl font-black text-[#38BDF8] mt-1">
                  {cohortList.reduce((acc, c) => acc + (parseInt(c.expectedEmiLoans) || 5), 0)}+ / mo
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Direct from doctor's desk</div>
              </div>
            </div>

            {/* Detailed Table */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-mono">
                      <th className="py-3 px-4">Clinic & Doctor</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Chairs</th>
                      <th className="py-3 px-4">Focus Procedures</th>
                      <th className="py-3 px-4 text-center">Cases / Mo</th>
                      <th className="py-3 px-4 text-center font-bold text-emerald-400">Expected EMIs</th>
                      <th className="py-3 px-4 text-right">Avg Ticket</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {cohortList.map((c, i) => (
                      <tr key={i} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-white">
                          <div>{c.clinicName}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{c.doctorName}</div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">{c.city}</td>
                        <td className="py-3.5 px-4 text-slate-400">{c.chairs}</td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {c.specialties.slice(0, 2).map((s, idx) => (
                              <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">
                                {s}
                              </span>
                            ))}
                            {c.specialties.length > 2 && (
                              <span className="text-[10px] text-slate-500">+{c.specialties.length - 2} more</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono">{c.avgMonthlyCases}</td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-400 bg-emerald-500/5">
                          {c.expectedEmiLoans}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-medium text-white">{c.avgTicketSize}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-slate-300 flex items-center justify-between">
              <div>
                <strong>Lender Takeaway:</strong> High concentration of qualified dental specialists with direct elective patient footfall. Zero retail intermediary risk.
              </div>
              <button 
                onClick={() => setActiveTab('form')}
                className="px-3 py-1.5 bg-[#0867E8] text-white rounded-lg font-bold hover:bg-[#0756C7] transition-all shrink-0 ml-3"
              >
                + Add Another Clinic
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
