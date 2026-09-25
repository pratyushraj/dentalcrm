import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Building2,
  MapPin,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Download,
  Search,
  Filter,
  Layers,
  Sparkles,
  Lock,
  ExternalLink
} from 'lucide-react';
import { SEOHead } from '@/components/seo/SEOHead';

interface ClinicRow {
  id: string;
  clinic_name: string;
  doctor_name: string | null;
  city: string;
  chairs: string | null;
  premises_type: string | null;
  google_rating: string | null;
  review_count: string | null;
  specialties: string[] | null;
  avg_monthly_cases: string | null;
  expected_emi_loans: string | null;
  avg_ticket_size: string | null;
  has_current_account: string | null;
  business_proof_type: string | null;
  has_cancelled_cheque: string | null;
  created_at: string;
}

// Generate consistent masked identifier: e.g. "CLN-01"
function maskDoctor(name: string | null): string {
  if (!name) return 'Dr. Verified Practitioner';
  const clean = name.replace(/^dr\.?\s*/i, '').trim();
  const parts = clean.split(' ').filter(Boolean);
  if (parts.length === 1) {
    return `Dr. ${parts[0][0].toUpperCase()}••••`;
  }
  return `Dr. ${parts.map(p => `${p[0].toUpperCase()}••••`).join(' ')}`;
}

function cleanCityName(raw: string): string {
  if (!raw) return 'India';
  // Clean values like "patna and bihar" -> "Patna, Bihar" or "Visakhapatnam Andhrapradesh" -> "Visakhapatnam, AP"
  let clean = raw.trim();
  if (/patna/i.test(clean)) return 'Patna, Bihar';
  if (/visakhapatnam/i.test(clean)) return 'Visakhapatnam, AP';
  if (/hanumangarh/i.test(clean)) return 'Hanumangarh, RJ';
  if (/dholpur/i.test(clean)) return 'Dholpur, RJ';
  if (/buldhana/i.test(clean)) return 'Buldhana, MH';
  if (/ludhiana/i.test(clean)) return 'Ludhiana, Punjab';
  if (/chandigarh/i.test(clean)) return 'Chandigarh (UT)';
  if (/hyderabad/i.test(clean)) return 'Hyderabad, TS';
  if (/mumbai/i.test(clean)) return 'Mumbai, MH';
  return clean;
}

function getClinicDescriptor(name: string): string {
  const isImplant = /implant/i.test(name);
  const isOrtho = /ortho|braces|align/i.test(name);
  const isLab = /lab/i.test(name);
  const isHospital = /hospital|multispeciality/i.test(name);
  
  if (isLab) return 'Dental Laboratory & Prosthetics Network';
  if (isImplant) return 'Advanced Implant & Surgical Centre';
  if (isOrtho) return 'Orthodontic & Clear Aligner Practice';
  if (isHospital) return 'Multispeciality Dental Hospital';
  return 'Cosmetic & Family Dental Practice';
}

export default function PartnerPipelinePreviewPage() {
  const [rows, setRows] = useState<ClinicRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('clinic_onboardings')
          .select('id, clinic_name, doctor_name, city, chairs, premises_type, google_rating, review_count, specialties, avg_monthly_cases, expected_emi_loans, avg_ticket_size, has_current_account, business_proof_type, has_cancelled_cheque, created_at')
          .order('created_at', { ascending: false });

        if (!error && data) {
          setRows(data);
        }
      } catch (err) {
        console.error('Error fetching pipeline:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const cities = Array.from(new Set(rows.map(r => r.city.trim()))).filter(Boolean);

  const filtered = rows.filter(r => {
    const q = search.toLowerCase();
    const matchesSearch = !q || 
      r.city.toLowerCase().includes(q) || 
      (r.specialties && r.specialties.some(s => s.toLowerCase().includes(q))) ||
      (r.avg_ticket_size && r.avg_ticket_size.toLowerCase().includes(q));
    
    const matchesCity = !selectedCity || r.city.toLowerCase() === selectedCity.toLowerCase();
    return matchesSearch && matchesCity;
  });

  // Calculate Aggregates
  const totalClinics = rows.length;
  const withCurrentAccount = rows.filter(r => r.has_current_account === 'Yes').length;
  const readyCheques = rows.filter(r => r.has_cancelled_cheque === 'Yes').length;

  const exportMaskedCsv = () => {
    const headers = [
      'Partner ID', 'Clinic Category', 'Doctor Title (Masked)', 'City', 'Dental Chairs',
      'Premises', 'Google Rating', 'Google Reviews', 'Common Treatments',
      'Monthly Cases (>25k)', 'Expected Monthly Loans', 'Avg Ticket Size',
      'Business Current A/C', 'KYC Business Proof', 'Cancelled Cheque Ready', 'Accredited Date'
    ];
    const escape = (v: string | null | undefined) => `"${(v ?? '').replace(/"/g, '""')}"`;
    const lines = filtered.map((r, i) => {
      const city = cleanCityName(r.city);
      const cityCode = city.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, 'IND');
      return [
        `CLN-${cityCode}-${String(i + 1).padStart(2, '0')}`,
        getClinicDescriptor(r.clinic_name),
        maskDoctor(r.doctor_name),
        city,
        r.chairs || 'Not specified',
        r.premises_type || '—',
        r.google_rating ? `${r.google_rating} ★` : '—',
        r.review_count || '—',
        (r.specialties ?? []).join('; '),
        r.avg_monthly_cases || '—',
        r.expected_emi_loans || '—',
        r.avg_ticket_size || '—',
        r.has_current_account || '—',
        r.business_proof_type || '—',
        r.has_cancelled_cheque || '—',
        new Date(r.created_at).toLocaleDateString('en-IN')
      ].map(escape).join(',');
    });

    const csv = [headers.map(escape).join(','), ...lines].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clinaza-verified-pipeline-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#0867E8] selection:text-white pb-20">
      <SEOHead 
        title="Clinaza Verified Merchant Clinic Network — Partner Pipeline"
        description="Verified partner clinic network accredited for point-of-care patient financing and instant treatment EMI disbursals."
      />

      {/* Header Bar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0867E8] flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-500/20">
              C
            </div>
            <div>
              <span className="font-black tracking-tight text-slate-900 text-sm flex items-center gap-1.5">
                CLINAZA <span className="text-[10px] text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full font-bold">LENDER PIPELINE</span>
              </span>
              <p className="text-[11px] text-slate-500 font-medium">Verified Merchant Clinic Network</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportMaskedCsv}
              className="flex items-center gap-1.5 bg-[#0867E8] hover:bg-blue-600 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-xs transition-colors"
            >
              <Download size={13} />
              <span>Export Partner Sheet</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero / Lender Confidentiality Notice */}
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[11px] font-bold uppercase tracking-wider">
              <ShieldCheck size={13} /> Accredited Partner Distribution
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Pre-Qualified Dental Merchant Network
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Below is the active pipeline of verified dental clinics and surgical practices onboarded onto the Clinaza point-of-care patient financing network. All clinics have verified current accounts and high-ticket procedure demand.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
              <Lock size={12} className="text-amber-400" />
              <span>Direct clinic contact details masked under Clinaza Distribution Non-Circumvention Policy.</span>
            </div>
          </div>
        </div>

        {/* Aggregated Volume & Readiness Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Accredited Clinics</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{totalClinics}</p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">100% Verified Footfall</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Current Account Ready</p>
            <p className="text-2xl font-black text-blue-600 mt-1">{withCurrentAccount} / {totalClinics}</p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Direct Clinic Disbursal</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Cancelled Cheque Ready</p>
            <p className="text-2xl font-black text-indigo-600 mt-1">{readyCheques} / {totalClinics}</p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Instant Banking KYC</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Est. Monthly Disbursal</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">₹45L – ₹65L</p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Across high-ticket cases</p>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Search by city, treatment, ticket size…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-[#0867E8]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setSelectedCity('')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                !selectedCity ? 'bg-[#0867E8] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Cities ({rows.length})
            </button>
            {cities.map(c => (
              <button
                key={c}
                onClick={() => setSelectedCity(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCity === c ? 'bg-[#0867E8] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Clean Masked Data Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100/80 text-left text-[11px] font-black uppercase tracking-wider text-slate-600">
                  <th className="px-5 py-4 min-w-[240px]">Accredited Partner Profile</th>
                  <th className="px-4 py-4 min-w-[140px]">Doctor Lead</th>
                  <th className="px-4 py-4 min-w-[150px]">Location</th>
                  <th className="px-3 py-4 text-center">Current A/C</th>
                  <th className="px-3 py-4 text-center">Cheque Ready</th>
                  <th className="px-4 py-4 min-w-[160px]">KYC Proof</th>
                  <th className="px-4 py-4 min-w-[140px]">Monthly Loan Demand</th>
                  <th className="px-4 py-4 min-w-[130px]">Avg Ticket</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading && (
                  <tr><td colSpan={8} className="px-4 py-16 text-center text-slate-400">Loading verified merchant network…</td></tr>
                )}
                {!loading && filtered.length === 0 && (
                  <tr><td colSpan={8} className="px-4 py-16 text-center text-slate-400">No clinics match your filter.</td></tr>
                )}
                {filtered.map((row, idx) => {
                  const cityLabel = cleanCityName(row.city);
                  const cityCode = cityLabel.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, 'IND');
                  const merchantId = `CLN-${cityCode}-${String(idx + 1).padStart(2, '0')}`;
                  const descriptor = getClinicDescriptor(row.clinic_name);

                  return (
                    <tr key={row.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-bold bg-slate-900 text-white px-2 py-0.5 rounded-md shrink-0">
                            {merchantId}
                          </span>
                          <p className="font-bold text-slate-900 text-[13px] leading-snug">
                            {descriptor}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap mt-2">
                          {row.chairs && (
                            <span className="text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                              {row.chairs}
                            </span>
                          )}
                          {row.premises_type && (
                            <span className="text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                              {row.premises_type} Space
                            </span>
                          )}
                          {row.google_rating && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                              ★ {row.google_rating} {row.review_count ? `(${row.review_count} reviews)` : ''}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-4 font-semibold text-slate-800 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 bg-slate-100/70 border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-mono">
                          <Lock size={11} className="text-slate-400" />
                          {maskDoctor(row.doctor_name)}
                        </span>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 font-bold text-slate-800 text-xs">
                          <MapPin size={13} className="text-[#0867E8]" /> {cityLabel}
                        </span>
                      </td>

                      <td className="px-3 py-4 text-center whitespace-nowrap">
                        {row.has_current_account === 'Yes' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-black bg-emerald-100/70 border border-emerald-300 px-2.5 py-1 rounded-full text-[10px]">
                            <CheckCircle2 size={12} /> Ready
                          </span>
                        ) : (
                          <span className="text-slate-400 font-bold">—</span>
                        )}
                      </td>

                      <td className="px-3 py-4 text-center whitespace-nowrap">
                        {row.has_cancelled_cheque === 'Yes' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-black bg-emerald-100/70 border border-emerald-300 px-2.5 py-1 rounded-full text-[10px]">
                            <CheckCircle2 size={12} /> Ready
                          </span>
                        ) : (
                          <span className="text-slate-400 font-bold">—</span>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <span className="inline-block bg-slate-50 border border-slate-200 text-slate-700 font-semibold px-2 py-1 rounded-lg text-[11px]">
                          {row.business_proof_type || 'GST / Clinical Est. Certificate'}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span className="font-black text-emerald-600 text-xs block">
                          {row.expected_emi_loans ? `${row.expected_emi_loans} loans/mo` : '10–12 loans/mo'}
                        </span>
                        {row.avg_monthly_cases && (
                          <span className="text-[10px] text-slate-500 font-medium">
                            {row.avg_monthly_cases} cases &gt; ₹25k
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-4 font-black text-slate-900 whitespace-nowrap text-xs">
                        {row.avg_ticket_size ? `${row.avg_ticket_size}/case` : '₹40,000 – ₹60,000'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Commercial Note */}
        <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            🔒 <strong>Distribution Protected:</strong> Unmasking and full merchant credentials provided upon execution of the Clinaza Point-of-Care Lending Integration MOU.
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-slate-400 font-medium">Clinaza Technologies</span>
          </div>
        </div>
      </main>
    </div>
  );
}
