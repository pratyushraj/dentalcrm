import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import {
  RefreshCw,
  Download,
  Search,
  Building2,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  Wifi,
  WifiOff,
  Tag,
} from 'lucide-react';

const ADMIN_PASSWORD = 'clinaza2024';

interface ClinicRow {
  id: string;
  clinic_name: string;
  doctor_name: string | null;
  city: string;
  phone: string;
  email: string | null;
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
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  source: string | null;
  created_at: string;
}

function yn(val: string | null) {
  if (val === 'Yes') return <span className="text-emerald-600 font-bold flex items-center gap-1"><CheckCircle2 size={13} /> Yes</span>;
  if (val === 'No') return <span className="text-rose-500 font-bold flex items-center gap-1"><XCircle size={13} /> No</span>;
  return <span className="text-slate-400 text-xs">—</span>;
}

function utmBadge(src: string | null) {
  if (!src) return <span className="text-slate-300 text-xs">direct</span>;
  const colors: Record<string, string> = {
    whatsapp: 'bg-green-100 text-green-700',
    instagram: 'bg-pink-100 text-pink-700',
    facebook: 'bg-blue-100 text-blue-700',
    email: 'bg-amber-100 text-amber-700',
    google: 'bg-sky-100 text-sky-700',
  };
  const key = src.toLowerCase();
  const cls = Object.entries(colors).find(([k]) => key.includes(k))?.[1] ?? 'bg-slate-100 text-slate-600';
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${cls}`}>{src}</span>;
}

function exportCsv(rows: ClinicRow[]) {
  const headers = [
    'Clinic Name', 'Doctor', 'City', 'Phone', 'Email', 'Chairs',
    'Premises (Owned/Rented)', 'Google Rating', 'Google Reviews',
    'Specialties', 'Monthly Cases', 'Expected Loans', 'Avg Ticket',
    'Current Account', 'Business Proof', 'Cancelled Cheque',
    'UTM Source', 'UTM Medium', 'UTM Campaign', 'Submitted At'
  ];
  const escape = (v: string | null | undefined) => `"${(v ?? '').replace(/"/g, '""')}"`;
  const lines = rows.map(r => [
    r.clinic_name, r.doctor_name, r.city, r.phone, r.email, r.chairs,
    r.premises_type, r.google_rating, r.review_count,
    (r.specialties ?? []).join('; '), r.avg_monthly_cases, r.expected_emi_loans, r.avg_ticket_size,
    r.has_current_account, r.business_proof_type, r.has_cancelled_cheque,
    r.utm_source, r.utm_medium, r.utm_campaign,
    new Date(r.created_at).toLocaleString('en-IN')
  ].map(escape).join(','));
  const csv = [headers.map(escape).join(','), ...lines].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `clinic-onboardings-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminClinicOnboardingsPage() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('admin_auth') === '1');
  const [pwInput, setPwInput] = useState('');
  const [pwError, setPwError] = useState(false);

  const [rows, setRows] = useState<ClinicRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [selectedRow, setSelectedRow] = useState<ClinicRow | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: sbErr } = await (supabase as any)
        .from('clinic_onboardings')
        .select('*')
        .order('created_at', { ascending: false });
      if (sbErr) throw sbErr;
      setRows(data ?? []);
    } catch (e: any) {
      setError(e.message ?? 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) load();
  }, [authed, load]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwInput === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', '1');
      setAuthed(true);
    } else {
      setPwError(true);
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <form onSubmit={handleAuth} className="bg-white border border-slate-200 rounded-2xl p-8 w-full max-w-sm shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <img src="/assets/clinaza-logo.jpg" alt="Clinaza" className="h-9 w-9 rounded-xl border border-slate-200 object-cover" />
            <span className="text-xs font-black tracking-widest text-[#0B2450] uppercase">Clinaza Admin</span>
          </div>
          <h1 className="text-lg font-bold text-slate-900">Clinic Submissions</h1>
          <p className="text-xs text-slate-500">Enter the admin password to view onboarding pipeline.</p>
          <input
            type="password"
            autoFocus
            placeholder="Admin password"
            value={pwInput}
            onChange={e => { setPwInput(e.target.value); setPwError(false); }}
            className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#0867E8] ${pwError ? 'border-rose-400' : 'border-slate-200'}`}
          />
          {pwError && <p className="text-xs text-rose-500">Incorrect password</p>}
          <button type="submit" className="w-full py-2.5 bg-[#0867E8] hover:bg-[#0756C7] text-white text-sm font-bold rounded-xl transition-all">
            Login
          </button>
        </form>
      </div>
    );
  }

  const allSources = [...new Set(rows.map(r => r.utm_source).filter(Boolean))] as string[];
  const filtered = rows.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = !q || r.clinic_name.toLowerCase().includes(q) || (r.city ?? '').toLowerCase().includes(q) || (r.phone ?? '').includes(q) || (r.doctor_name ?? '').toLowerCase().includes(q);
    const matchSource = !filterSource || r.utm_source === filterSource;
    return matchSearch && matchSource;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30 px-4 sm:px-8 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img src="/assets/clinaza-logo.jpg" alt="Clinaza" className="h-9 w-9 rounded-xl border border-slate-200 object-cover" />
          <div>
            <span className="text-xs font-black tracking-widest text-[#0B2450] uppercase">Clinaza</span>
            <p className="text-[11px] text-slate-400">Clinic Onboarding Pipeline</p>
          </div>
          <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-50 text-[#0867E8] text-[10px] font-bold border border-blue-200">
            {rows.length} total
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => load()}
            disabled={loading}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-all"
            title="Refresh"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <a
            href="/partner-pipeline"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
            title="Open safe masked preview for lenders like ShopSe"
          >
            <span>🔒 Safe Lender View</span>
          </a>
          <button
            onClick={() => exportCsv(filtered)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-bold rounded-xl transition-all"
          >
            <Download size={13} /> Export CSV
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-4">
        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total Clinics', value: rows.length, icon: Building2, color: 'text-blue-600' },
            { label: 'With Current A/C', value: rows.filter(r => r.has_current_account === 'Yes').length, icon: Wifi, color: 'text-emerald-600' },
            { label: 'Without Current A/C', value: rows.filter(r => r.has_current_account === 'No').length, icon: WifiOff, color: 'text-rose-500' },
            { label: 'Via Campaigns', value: rows.filter(r => r.utm_source).length, icon: Tag, color: 'text-purple-600' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white border border-slate-200 rounded-2xl px-4 py-3 flex items-center gap-3">
              <div className={`${color} bg-slate-50 rounded-xl p-2`}><Icon size={16} /></div>
              <div>
                <p className="text-xl font-black text-slate-900">{value}</p>
                <p className="text-[11px] text-slate-500">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative flex-1 min-w-48">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search clinic, doctor, city, phone…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0867E8]"
            />
          </div>
          {allSources.length > 0 && (
            <select
              value={filterSource}
              onChange={e => setFilterSource(e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0867E8]"
            >
              <option value="">All Sources</option>
              {allSources.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          )}
          <span className="text-xs text-slate-400">{filtered.length} results</span>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl px-4 py-3">
            ⚠️ {error} — Make sure the <code>clinic_onboardings</code> table exists in Supabase.
          </div>
        )}

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3">Clinic</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3 text-center">A/C</th>
                  <th className="px-4 py-3 text-center">Cheque</th>
                  <th className="px-4 py-3">Proof</th>
                  <th className="px-4 py-3">Loan Volume</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={9} className="px-4 py-8 text-center text-slate-400">Loading…</td></tr>
                )}
                {!loading && filtered.length === 0 && (
                  <tr><td colSpan={9} className="px-4 py-12 text-center text-slate-400">
                    {rows.length === 0 ? 'No submissions yet. Share the onboarding link to get started!' : 'No results match your search.'}
                  </td></tr>
                )}
                {filtered.map(row => (
                  <tr
                    key={row.id}
                    onClick={() => setSelectedRow(row)}
                    className="border-b border-slate-50 hover:bg-blue-50/40 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="font-bold text-slate-900 leading-tight">{row.clinic_name}</p>
                      <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                        {row.doctor_name && <span className="text-[10px] text-slate-400">{row.doctor_name}</span>}
                        {row.chairs && <span className="text-[10px] text-slate-400">• {row.chairs}</span>}
                        {row.premises_type && (
                          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                            {row.premises_type}
                          </span>
                        )}
                        {row.google_rating && (
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded">
                            {row.google_rating} {row.review_count ? `(${row.review_count})` : ''}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-slate-600">
                        <MapPin size={11} className="text-slate-300 shrink-0" />{row.city}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-slate-600">
                        <Phone size={11} className="text-slate-300 shrink-0" />{row.phone}
                      </span>
                      {row.email && <p className="text-[10px] text-slate-400 mt-0.5">{row.email}</p>}
                    </td>
                    <td className="px-4 py-3 text-center">{yn(row.has_current_account)}</td>
                    <td className="px-4 py-3 text-center">{yn(row.has_cancelled_cheque)}</td>
                    <td className="px-4 py-3 max-w-40">
                      <span className="text-slate-600 leading-snug line-clamp-2">{row.business_proof_type ?? '—'}</span>
                    </td>
                    <td className="px-4 py-3">
                      {row.expected_emi_loans
                        ? <span className="text-emerald-700 font-bold">{row.expected_emi_loans} loans/mo</span>
                        : <span className="text-slate-300">—</span>
                      }
                      {row.avg_ticket_size && <p className="text-[10px] text-slate-400">{row.avg_ticket_size}/case</p>}
                    </td>
                    <td className="px-4 py-3">
                      {utmBadge(row.utm_source)}
                      {row.utm_campaign && <p className="text-[10px] text-slate-400 mt-0.5">{row.utm_campaign}</p>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="flex items-center gap-1 text-slate-400">
                        <Calendar size={10} />
                        {new Date(row.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                      <p className="text-[10px] text-slate-300">
                        {new Date(row.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Detail Drawer */}
      {selectedRow && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setSelectedRow(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">{selectedRow.clinic_name}</h2>
                {selectedRow.doctor_name && <p className="text-xs text-slate-500">{selectedRow.doctor_name}</p>}
              </div>
              <button onClick={() => setSelectedRow(null)} className="text-slate-400 hover:text-slate-700 text-xl font-bold leading-none">&times;</button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {[
                ['City', selectedRow.city],
                ['Phone', selectedRow.phone],
                ['Email', selectedRow.email],
                ['Chairs', selectedRow.chairs],
                ['Premises', selectedRow.premises_type],
                ['Google Rating', selectedRow.google_rating ? `${selectedRow.google_rating} ★` : null],
                ['Google Reviews', selectedRow.review_count],
                ['Monthly Cases', selectedRow.avg_monthly_cases],
                ['Expected Loans/mo', selectedRow.expected_emi_loans],
                ['Avg Ticket Size', selectedRow.avg_ticket_size],
                ['Current Account', selectedRow.has_current_account],
                ['Cancelled Cheque', selectedRow.has_cancelled_cheque],
                ['Business Proof', selectedRow.business_proof_type],
                ['UTM Source', selectedRow.utm_source],
                ['UTM Medium', selectedRow.utm_medium],
                ['UTM Campaign', selectedRow.utm_campaign],
                ['Submitted', new Date(selectedRow.created_at).toLocaleString('en-IN')],
              ].filter(([, v]) => v).map(([k, v]) => (
                <div key={k as string} className="bg-slate-50 rounded-xl p-2.5">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">{k}</p>
                  <p className="font-semibold text-slate-800">{v}</p>
                </div>
              ))}
            </div>

            {selectedRow.specialties && selectedRow.specialties.length > 0 && (
              <div className="bg-slate-50 rounded-xl p-3 space-y-1.5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Treatment Types</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRow.specialties.map(s => (
                    <span key={s} className="px-2 py-0.5 rounded-full bg-blue-50 text-[#0867E8] text-[10px] font-bold border border-blue-200">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
