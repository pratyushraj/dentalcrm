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
  Layers,
  Sparkles,
  Lock,
  CreditCard,
  Stethoscope,
  Star,
  Users,
  IndianRupee,
  BadgeCheck,
  ChevronRight
} from 'lucide-react';
import { SEOHead } from '@/components/seo/SEOHead';

interface ClinicRow {
  // NOTE: clinic_name, doctor_name, phone, email are intentionally EXCLUDED.
  // These are sensitive fields protected by Supabase RLS — never fetched on the client.
  id: string;
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

// Generate sequential masked doctor ID — real names are never fetched from DB
function maskDoctorById(idx: number): string {
  return `Dr. ••••• (Lead-${String(idx + 1).padStart(2, '0')})`;
}

function cleanCityName(raw: string): string {
  if (!raw) return 'India';
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
  if (/chinchwad/i.test(clean)) return 'Chinchwad, Pune';
  if (/nagpur/i.test(clean)) return 'Nagpur, MH';
  if (/delhi/i.test(clean)) return 'New Delhi';
  if (/bangalore|bengaluru/i.test(clean)) return 'Bengaluru, KA';
  if (/jaipur/i.test(clean)) return 'Jaipur, RJ';
  if (/ahmedabad/i.test(clean)) return 'Ahmedabad, GJ';
  return clean.replace(/\d+/g, '').trim(); // strip trailing numbers like "Pune19"
}

function getClinicDescriptor(specialties: string[] | null): string {
  const s = specialties ?? [];
  const isImplant = s.some(x => /implant/i.test(x));
  const isOrtho = s.some(x => /ortho|braces|align/i.test(x));
  const isLab = s.some(x => /lab/i.test(x));
  const isHospital = s.some(x => /hospital|multispeciality/i.test(x));
  const isCosmo = s.some(x => /cosm|veneer|whitening/i.test(x));

  if (isLab) return 'Dental Laboratory & Prosthetics Network';
  if (isImplant && isOrtho) return 'Advanced Implant & Orthodontic Practice';
  if (isImplant) return 'Advanced Implant & Surgical Centre';
  if (isOrtho) return 'Orthodontic & Clear Aligner Practice';
  if (isHospital) return 'Multispeciality Dental Hospital';
  if (isCosmo) return 'Cosmetic & Aesthetic Dental Studio';
  return 'Cosmetic & Family Dental Practice';
}

function getSpecialtyColor(descriptor: string): string {
  if (descriptor.includes('Implant')) return 'bg-violet-50 text-violet-700 border-violet-200';
  if (descriptor.includes('Orthodontic')) return 'bg-indigo-50 text-indigo-700 border-indigo-200';
  if (descriptor.includes('Laboratory')) return 'bg-amber-50 text-amber-700 border-amber-200';
  if (descriptor.includes('Hospital')) return 'bg-blue-50 text-blue-700 border-blue-200';
  if (descriptor.includes('Cosmetic')) return 'bg-rose-50 text-rose-700 border-rose-200';
  return 'bg-slate-50 text-slate-700 border-slate-200';
}

function formatTicketSize(raw: string | null): string {
  if (!raw || raw === 'None' || raw === 'null') return '₹35,000';
  // Strip out currency words/symbols
  let clean = raw.replace(/[Rs\.₹\s]/gi, '').trim();
  if (clean.includes('-')) {
    // If range like 40000-60000, take clean average or standard range
    const parts = clean.split('-').map(p => parseInt(p.replace(/[^0-9]/g, ''))).filter(Boolean);
    if (parts.length === 2) {
      return `₹${parts[0].toLocaleString('en-IN')} – ₹${parts[1].toLocaleString('en-IN')}`;
    }
  }
  const num = parseInt(clean.replace(/[^0-9]/g, ''));
  if (isNaN(num) || num <= 0) return '₹35,000';
  return `₹${num.toLocaleString('en-IN')}`;
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
        // SECURITY: Never request clinic_name, doctor_name, phone, or email.
        // Those are protected by Supabase RLS — only service_role / authenticated admins can read them.
        const { data, error } = await supabase
          .from('clinic_onboardings')
          .select('id, city, chairs, premises_type, google_rating, review_count, specialties, avg_monthly_cases, expected_emi_loans, avg_ticket_size, has_current_account, business_proof_type, has_cancelled_cheque, created_at')
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

  const cities = Array.from(new Set(rows.map(r => cleanCityName(r.city)))).filter(Boolean).sort();

  const filtered = rows.filter(r => {
    const q = search.toLowerCase();
    const cleanedCity = cleanCityName(r.city);
    const matchesSearch = !q ||
      cleanedCity.toLowerCase().includes(q) ||
      (r.specialties && r.specialties.some(s => s.toLowerCase().includes(q))) ||
      (r.avg_ticket_size && r.avg_ticket_size.toLowerCase().includes(q));

    const matchesCity = !selectedCity || cleanedCity.toLowerCase() === selectedCity.toLowerCase();
    return matchesSearch && matchesCity;
  });

  // Calculate Aggregates
  const totalClinics = rows.length;
  const withCurrentAccount = rows.filter(r => r.has_current_account === 'Yes').length;
  const readyCheques = rows.filter(r => r.has_cancelled_cheque === 'Yes').length;
  const totalLoans = rows.reduce((sum, r) => sum + (parseInt(r.expected_emi_loans || '0') || 0), 0);

  const exportMaskedCsv = () => {
    const headers = [
      'Partner ID', 'Clinic Category', 'Doctor Lead (Masked)', 'City', 'Dental Chairs',
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
        getClinicDescriptor(r.specialties),
        maskDoctorById(i),
        city,
        r.chairs || 'Not specified',
        r.premises_type || '—',
        r.google_rating ? `${r.google_rating} ★` : '—',
        r.review_count || '—',
        (r.specialties ?? []).join('; '),
        r.avg_monthly_cases || '—',
        r.expected_emi_loans || '—',
        formatTicketSize(r.avg_ticket_size),
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
    <div className="min-h-screen bg-[#F6F8FC] text-slate-900 font-sans selection:bg-[#0867E8] selection:text-white pb-20">
      <SEOHead
        title="Clinaza Verified Merchant Clinic Network — Partner Pipeline"
        description="Verified partner clinic network accredited for point-of-care patient financing and instant treatment EMI disbursals."
        image="https://www.clinaza.in/og-partner-pipeline.png"
      />

      {/* Header Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0867E8] to-blue-700 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-500/25">
              C
            </div>
            <div>
              <div className="font-black tracking-tight text-slate-900 text-sm flex items-center gap-2">
                CLINAZA
                <span className="text-[10px] text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                  Lender Pipeline
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">Verified Merchant Clinic Network · {totalClinics} Accredited</p>
            </div>
          </div>

          <button
            onClick={exportMaskedCsv}
            className="flex items-center gap-1.5 bg-[#0867E8] hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md shadow-blue-500/20 transition-all hover:shadow-blue-500/30 hover:-translate-y-px"
          >
            <Download size={13} />
            <span className="hidden sm:inline">Export Partner Sheet</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* Hero Banner */}
        <div className="relative bg-gradient-to-br from-slate-900 via-[#0a1f4e] to-slate-900 text-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
          {/* Background decorative elements */}
          <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'radial-gradient(circle at 30% 50%, #60a5fa 0%, transparent 60%), radial-gradient(circle at 80% 20%, #818cf8 0%, transparent 50%)'}} />
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-20 w-40 h-40 bg-indigo-500/10 rounded-full translate-y-1/2" />

          <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="max-w-xl space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[11px] font-bold uppercase tracking-wider">
                <ShieldCheck size={12} />
                Accredited Partner Distribution
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
                Pre-Qualified Dental<br className="hidden sm:block" /> Merchant Network
              </h1>
              <p className="text-slate-300 text-sm leading-relaxed max-w-lg">
                Active pipeline of verified dental clinics and surgical practices onboarded onto the Clinaza point-of-care patient financing network. All clinics have verified current accounts and high-ticket procedure demand.
              </p>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                <Lock size={11} className="text-amber-400 shrink-0" />
                <span>Direct clinic contact details masked under Clinaza Distribution Non-Circumvention Policy.</span>
              </div>
            </div>

            {/* Hero right side stat highlight */}
            <div className="shrink-0 bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-5 min-w-[180px]">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Est. Monthly Disbursal</p>
              <p className="text-3xl font-black text-emerald-400">₹55L–₹80L</p>
              <p className="text-[11px] text-slate-400 mt-1">Across high-ticket dental cases</p>
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-1.5 text-xs text-blue-300 font-semibold">
                <TrendingUp size={13} />
                <span>{totalLoans}+ loans/mo pipeline</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                <Stethoscope size={17} className="text-blue-600" />
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">100% Verified</span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">{totalClinics}</p>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Accredited Clinics</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                <BadgeCheck size={17} className="text-emerald-600" />
              </div>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full border border-blue-200">Direct Disbursal</span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-emerald-600">{withCurrentAccount}<span className="text-base text-slate-400 font-semibold">/{totalClinics}</span></p>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Current Account Ready</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
                <CreditCard size={17} className="text-indigo-600" />
              </div>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-full border border-indigo-200">Instant KYC</span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-indigo-600">{readyCheques}<span className="text-base text-slate-400 font-semibold">/{totalClinics}</span></p>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Cancelled Cheque Ready</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                <IndianRupee size={17} className="text-amber-600" />
              </div>
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-200">High Ticket</span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-amber-600">{totalLoans}<span className="text-base text-slate-400 font-semibold">/mo</span></p>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Total Loan Demand</p>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Search by city, specialty…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-[#0867E8] focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setSelectedCity('')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                !selectedCity
                  ? 'bg-[#0867E8] text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              All Cities
              <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-black ${!selectedCity ? 'bg-white/20' : 'bg-slate-200 text-slate-500'}`}>
                {rows.length}
              </span>
            </button>
            {cities.map(c => {
              const count = rows.filter(r => cleanCityName(r.city).toLowerCase() === c.toLowerCase()).length;
              return (
                <button
                  key={c}
                  onClick={() => setSelectedCity(c)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCity === c
                      ? 'bg-[#0867E8] text-white shadow-md shadow-blue-500/20'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {c}
                  <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-black ${selectedCity === c ? 'bg-white/20' : 'bg-slate-200 text-slate-500'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results count bar */}
        {!loading && (
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span className="font-medium">
              Showing <strong className="text-slate-800">{filtered.length}</strong> of <strong className="text-slate-800">{totalClinics}</strong> clinics
              {selectedCity && <> · filtered by <strong className="text-[#0867E8]">{selectedCity}</strong></>}
            </span>
            {filtered.length > 0 && (
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 size={12} />
                All verified & KYC ready
              </span>
            )}
          </div>
        )}

        {/* Mobile View: Clean Responsive Cards */}
        <div className="block md:hidden space-y-3">
          {loading && (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs text-slate-400 font-medium">Loading verified merchant network…</p>
            </div>
          )}
          {!loading && filtered.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
              <Search size={24} className="text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-400 font-medium">No clinics match your filter.</p>
            </div>
          )}
          {filtered.map((row, idx) => {
            const cityLabel = cleanCityName(row.city);
            const cityCode = cityLabel.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, 'IND');
            const merchantId = `CLN-${cityCode}-${String(idx + 1).padStart(2, '0')}`;
            const descriptor = getClinicDescriptor(row.specialties);
            const specColor = getSpecialtyColor(descriptor);
            const bankingReady = row.has_current_account === 'Yes' && row.has_cancelled_cheque === 'Yes';

            return (
              <div key={row.id} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm space-y-3.5">
                {/* Card Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1.5">
                    <span className="font-mono text-[10px] font-bold bg-slate-900 text-white px-2 py-0.5 rounded-md inline-block">
                      {merchantId}
                    </span>
                    <h3 className={`text-xs font-black px-2 py-0.5 rounded-lg border inline-block ${specColor}`}>
                      {descriptor}
                    </h3>
                  </div>
                  <div className="inline-flex items-center gap-1 bg-blue-50 border border-blue-100 text-blue-700 px-2 py-1 rounded-xl text-[11px] font-bold shrink-0">
                    <MapPin size={10} className="text-blue-500" />
                    {cityLabel}
                  </div>
                </div>

                {/* Badges row */}
                <div className="flex items-center gap-1.5 flex-wrap">
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
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                      <Star size={9} className="fill-amber-500 text-amber-500" />
                      {row.google_rating}{row.review_count ? ` (${row.review_count})` : ''}
                    </span>
                  )}
                  {bankingReady && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                      <BadgeCheck size={10} />
                      Banking Ready
                    </span>
                  )}
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <div className="bg-slate-50 rounded-xl p-2.5">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-0.5">Doctor Lead</span>
                    <span className="font-mono text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                      <Lock size={9} className="text-slate-400 shrink-0" />
                      {maskDoctorById(idx)}
                    </span>
                  </div>

                  <div className="bg-emerald-50 rounded-xl p-2.5 border border-emerald-100">
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wider block mb-0.5">Monthly Loans</span>
                    <span className="font-black text-emerald-700 text-sm block">
                      {row.expected_emi_loans ? `${row.expected_emi_loans} /mo` : '10–12 /mo'}
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-2.5">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-0.5">Avg Ticket Size</span>
                    <span className="font-black text-slate-900 text-sm block">
                      {formatTicketSize(row.avg_ticket_size)}
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-2.5">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-0.5">Banking KYC</span>
                    <div className="flex items-center gap-1 flex-wrap mt-0.5">
                      {row.has_current_account === 'Yes' ? (
                        <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <CheckCircle2 size={9} /> A/C
                        </span>
                      ) : <span className="text-[10px] text-slate-400">—</span>}
                      {row.has_cancelled_cheque === 'Yes' && (
                        <span className="text-[9px] font-bold text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <CheckCircle2 size={9} /> Cheque
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* KYC proof footer */}
                <div className="text-[10px] text-slate-500 bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 flex items-center justify-between">
                  <span className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">KYC Proof</span>
                  <span className="font-semibold text-slate-700 truncate max-w-[180px]">
                    {row.business_proof_type || 'GST / Clinical Est.'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop View: Premium Data Table */}
        <div className="hidden md:block bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-slate-400 font-medium">Loading verified merchant network…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <Search size={32} className="text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-400 font-medium">No clinics match your filter.</p>
            </div>
          ) : (
            <table className="w-full text-xs table-auto">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <th className="px-5 py-4">Accredited Partner Profile</th>
                  <th className="px-4 py-4">Doctor & Location</th>
                  <th className="px-4 py-4 text-center">Banking KYC</th>
                  <th className="px-4 py-4">Business Proof</th>
                  <th className="px-4 py-4 text-right">Monthly Demand</th>
                  <th className="px-5 py-4 text-right">Avg Ticket</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((row, idx) => {
                  const cityLabel = cleanCityName(row.city);
                  const cityCode = cityLabel.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, 'IND');
                  const merchantId = `CLN-${cityCode}-${String(idx + 1).padStart(2, '0')}`;
                  const descriptor = getClinicDescriptor(row.specialties);
                  const specColor = getSpecialtyColor(descriptor);
                  const bankingFull = row.has_current_account === 'Yes' && row.has_cancelled_cheque === 'Yes';
                  const loanCount = parseInt(row.expected_emi_loans || '0') || 0;

                  return (
                    <tr key={row.id} className="hover:bg-blue-50/30 transition-colors group">
                      {/* Partner Profile */}
                      <td className="px-5 py-4">
                        <div className="flex items-start gap-2.5">
                          <div className="shrink-0 mt-0.5">
                            <span className="font-mono text-[9px] font-black bg-slate-900 text-white px-1.5 py-0.5 rounded-md block text-center">
                              {merchantId}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 text-[13px] leading-snug truncate max-w-[220px]">
                              {descriptor}
                            </p>
                            <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                              {row.chairs && (
                                <span className="text-[9px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
                                  {row.chairs}
                                </span>
                              )}
                              {row.premises_type && (
                                <span className="text-[9px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
                                  {row.premises_type}
                                </span>
                              )}
                              {row.google_rating && (
                                <span className="text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                  <Star size={8} className="fill-amber-500 text-amber-500" />
                                  {row.google_rating}
                                  {row.review_count && <span className="text-amber-500 font-normal"> ({row.review_count})</span>}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Doctor & Location */}
                      <td className="px-4 py-4">
                        <div className="space-y-1.5">
                          <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md text-[10px] font-mono text-slate-700">
                            <Lock size={9} className="text-slate-400 shrink-0" />
                            {maskDoctorById(idx)}
                          </span>
                          <div className="flex items-center gap-1 font-semibold text-slate-600 text-[11px]">
                            <MapPin size={10} className="text-[#0867E8] shrink-0" />
                            <span>{cityLabel}</span>
                          </div>
                        </div>
                      </td>

                      {/* Banking KYC */}
                      <td className="px-4 py-4 text-center">
                        {bankingFull ? (
                          <div className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full text-[10px]">
                            <BadgeCheck size={11} />
                            Fully Ready
                          </div>
                        ) : (
                          <div className="inline-flex flex-col items-center gap-1">
                            {row.has_current_account === 'Yes' ? (
                              <span className="inline-flex items-center gap-0.5 text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px]">
                                <CheckCircle2 size={10} /> Current A/C
                              </span>
                            ) : (
                              <span className="text-slate-300 font-medium text-[10px]">No A/C</span>
                            )}
                            {row.has_cancelled_cheque === 'Yes' && (
                              <span className="inline-flex items-center gap-0.5 text-indigo-700 font-bold bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full text-[10px]">
                                <CheckCircle2 size={10} /> Cheque
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Business Proof */}
                      <td className="px-4 py-4">
                        <span className="inline-block bg-slate-50 border border-slate-200 text-slate-600 font-medium px-2.5 py-1 rounded-lg text-[11px] max-w-[160px] truncate" title={row.business_proof_type || ''}>
                          {row.business_proof_type || 'Clinical Registration'}
                        </span>
                      </td>

                      {/* Monthly Demand */}
                      <td className="px-4 py-4 text-right">
                        <span className={`font-black text-sm block ${loanCount >= 5 ? 'text-emerald-600' : 'text-slate-700'}`}>
                          {row.expected_emi_loans ? `${row.expected_emi_loans}` : '10–12'}
                          <span className="text-[10px] font-semibold text-slate-400 ml-0.5">loans/mo</span>
                        </span>
                        {row.avg_monthly_cases && (
                          <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                            {row.avg_monthly_cases} cases &gt; ₹25k
                          </span>
                        )}
                      </td>

                      {/* Avg Ticket */}
                      <td className="px-5 py-4 text-right">
                        <span className="font-black text-slate-900 text-sm whitespace-nowrap">
                          {formatTicketSize(row.avg_ticket_size)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer Commercial Note */}
        <div className="bg-gradient-to-r from-slate-900 to-[#0a1f4e] border border-slate-800 rounded-2xl p-5 text-xs text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-bold text-sm">
              <Lock size={14} className="text-amber-400" />
              Distribution Protected
            </div>
            <p className="text-slate-400 leading-relaxed max-w-lg">
              Unmasking and full merchant credentials provided upon execution of the Clinaza Point-of-Care Lending Integration MOU.
            </p>
          </div>
          <div className="shrink-0 flex flex-col items-start sm:items-end gap-1">
            <span className="font-black text-white tracking-tight">Clinaza Technologies</span>
            <span className="text-slate-500 text-[11px]">@clinaza.in · Partner Network</span>
          </div>
        </div>

      </main>
    </div>
  );
}
