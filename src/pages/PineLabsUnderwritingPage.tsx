import React, { useState, useEffect, useLayoutEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SEOHead } from '@/components/seo/SEOHead';
import { CLINIC_PREVIEW_ROBOTS, clinicLinkPreview, readClinicPreviewIdentity } from '@/lib/clinicLinkPreview.js';
import {
  ShieldCheck,
  Building2,
  FileSpreadsheet,
  Download,
  ExternalLink,
  CheckCircle2,
  Clock,
  Search,
  Lock,
  Phone,
  Mail,
  MapPin,
  Landmark,
  FileText,
  UserCheck,
  CreditCard,
  Copy,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  Eye,
  EyeOff,
  ArrowUpRight,
  Sparkles,
  RefreshCw,
  AlertCircle,
  FolderDown,
  ArrowDownToLine,
  Archive,
  FileCheck,
  X,
  Truck,
  ArrowUpDown
} from 'lucide-react';
import { toast } from 'sonner';
import './underwriting.css';

// Verified Sub-Merchant KYC Dossiers for Pine Labs Plural Underwriting
export interface VerifiedDossier {
  id: string;
  clinic_name: string;
  legal_name: string;
  doctor_name: string;
  dob: string;
  pan: string;
  aadhaar: string;
  phone: string;
  email: string;
  city: string;
  pincode: string;
  address: string;
  residential_address: string;
  specialties: string[];
  submission_badge: string;
  readiness?: 'ready' | 'pending';
  missing_items?: string[];
  bank: {
    bank_name: string;
    account_holder: string;
    account_number: string;
    account_type: string;
    ifsc: string;
    branch: string;
    micr: string;
    cheque_no: string;
  };
  business_proof: {
    type: string;
    number: string;
    category: string;
    date: string;
  };
  docs: {
    signing_pdf: string;
    zip_bundle: string;
    maf_excel: string;
    gst_declaration_pdf?: string;
    gst_certificate?: string;
    board_resolution?: string;
    cancelled_cheque: string;
    doctor_pan: string;
    aadhaar_front: string;
    aadhaar_back?: string;
    udyam_pdf?: string;
    establishment_reg?: string;
    dental_council_reg?: string;
    courier_receipt?: string;
    courier_awb?: string;
  };
  is_signed?: boolean;
  status: string;
}

// Note: Confidential KYC dossiers are served securely via authenticated /api/underwriting API

export default function PineLabsUnderwritingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tokenParam = searchParams.get('access') || searchParams.get('token');
  const clinicParam = searchParams.get('clinic');

  const [allDossiers, setAllDossiers] = useState<VerifiedDossier[]>([]);
  const [isLoadingDossiers, setIsLoadingDossiers] = useState(false);
  const [isSubmittingPin, setIsSubmittingPin] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [showSensitivePii, setShowSensitivePii] = useState(false);

  // Partner authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const auth = sessionStorage.getItem('plural_underwriting_auth');
    const authTime = sessionStorage.getItem('plural_auth_timestamp');
    if (auth === '1' && authTime) {
      const elapsedHours = (Date.now() - parseInt(authTime, 10)) / (1000 * 60 * 60);
      if (elapsedHours > 8) {
        sessionStorage.removeItem('plural_underwriting_auth');
        sessionStorage.removeItem('plural_auth_timestamp');
        sessionStorage.removeItem('plural_uw_token');
        return false;
      }
      return true;
    }
    return Boolean(tokenParam);
  });

  // Secure Server-Side Dossier Fetching
  const fetchDossiers = async (accessPin?: string) => {
    setIsLoadingDossiers(true);
    try {
      const credentialType = searchParams.get('access') ? 'access' : 'token';
      const query = accessPin ? `?${credentialType}=${encodeURIComponent(accessPin)}` : '';
      const storedToken = sessionStorage.getItem('plural_uw_token');
      const headers: Record<string, string> = {};
      if (storedToken) {
        headers['Authorization'] = `Bearer ${storedToken}`;
      }
      const res = await fetch(`/api/underwriting${query}`, {
        headers,
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        if (data.dossiers && Array.isArray(data.dossiers)) {
          const withDocs = data.dossiers.filter((d: VerifiedDossier) => {
            const docs = d.docs || {};
            return Object.entries(docs).some(([k, v]) => k !== 'courier_awb' && typeof v === 'string' && v.trim().length > 0);
          });
          setAllDossiers(withDocs);
          setIsAuthenticated(true);
          sessionStorage.setItem('plural_underwriting_auth', '1');
          sessionStorage.setItem('plural_auth_timestamp', Date.now().toString());
          if (data.token) {
            sessionStorage.setItem('plural_uw_token', data.token);
          }
          return true;
        }
      } else {
        if (res.status === 401 || res.status === 429) {
          setIsAuthenticated(false);
          setAllDossiers([]);
          setPinError(res.status === 429 ? 'Too many login attempts. Please try again later.' : 'Please enter a valid partner access PIN.');
          sessionStorage.removeItem('plural_underwriting_auth');
          sessionStorage.removeItem('plural_auth_timestamp');
          sessionStorage.removeItem('plural_uw_token');
        }
        if (res.status >= 500) toast.error('Clinic applications could not be loaded. Please refresh to retry.');
      }
    } catch (err) {
      console.error('Failed to load underwriting dossiers:', err);
    } finally {
      setIsLoadingDossiers(false);
    }
    return false;
  };

  // Immediate token scrubbing from URL bar & auto-session initialization
  useEffect(() => {
    if (tokenParam) {
      fetchDossiers(tokenParam).then(() => {
        const cleanParams = new URLSearchParams(window.location.search);
        cleanParams.delete('access');
        cleanParams.delete('token');
        setSearchParams(cleanParams, { replace: true });
      });
    } else if (isAuthenticated && allDossiers.length === 0) {
      fetchDossiers();
    }
  }, [tokenParam, isAuthenticated]);

  const maskAadhaar = (val: string) => {
    if (showSensitivePii) return val;
    const clean = (val || '').replace(/\s+/g, '');
    if (clean.length < 4) return val;
    return `•••• •••• ${clean.slice(-4)}`;
  };

  const maskAccountNo = (val: string) => {
    if (showSensitivePii) return val;
    const clean = (val || '').replace(/\s+/g, '');
    if (!/\d{4}$/.test(clean)) return val;
    return `•••• •••• ${clean.slice(-4)}`;
  };

  const handleLockDesk = async () => {
    try {
      await fetch('/api/underwriting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action: 'logout' })
      });
    } catch (_) {}
    sessionStorage.removeItem('plural_underwriting_auth');
    sessionStorage.removeItem('plural_auth_timestamp');
    sessionStorage.removeItem('plural_uw_token');
    setIsAuthenticated(false);
    setAllDossiers([]);
    toast.info('Underwriting Desk locked successfully');
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'ready' | 'pending'>('all');
  const [sortBy, setSortBy] = useState<'ready-first' | 'pending-first' | 'name' | 'city'>('ready-first');
  
  // Selected clinic state: null = View 1 (Queue), string = View 2 (Clinic Dossier & Docs)
  const [selectedDossierId, setSelectedDossierId] = useState<string | null>(() => clinicParam);

  // Sync state if URL parameter changes
  useEffect(() => {
    if (clinicParam !== selectedDossierId) {
      setSelectedDossierId(clinicParam);
    }
  }, [clinicParam]);

  // Strict Invariant: A clinic is 100% Ready for MID ONLY IF all KYC proofs are verified AND the MAF is physically/digitally signed
  const isClinicFullyReady = (d: VerifiedDossier | null) => Boolean(d && (d.readiness || 'ready') === 'ready' && d.is_signed);

  const activeDossier = selectedDossierId
    ? allDossiers.find(
        (d) =>
          d.id.toLowerCase() === selectedDossierId.toLowerCase() ||
          (selectedDossierId === 'hear-one' && d.id === 'c1b4ab14-e0a4-4a60-9a86-ebedc9616675') ||
          (selectedDossierId === 'c1b4ab14-e0a4-4a60-9a86-ebedc9616675' && d.id === 'hear-one') ||
          d.clinic_name.toLowerCase().includes(selectedDossierId.toLowerCase())
      ) || null
    : null;

  const isActiveReady = isClinicFullyReady(activeDossier);

  useLayoutEffect(() => {
    document.getElementById('root')?.scrollTo({ top: 0, behavior: 'instant' });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeDossier?.id]);

  const handleSelectClinic = (id: string) => {
    setSelectedDossierId(id);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('clinic', id);
    setSearchParams(nextParams);
  };

  const handleBackToQueue = () => {
    setSelectedDossierId(null);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('clinic');
    setSearchParams(nextParams);
  };

  const readyCount = useMemo(() => allDossiers.filter((d) => isClinicFullyReady(d)).length, [allDossiers]);
  const pendingCount = useMemo(() => allDossiers.filter((d) => !isClinicFullyReady(d)).length, [allDossiers]);

  const filteredDossiers = useMemo(() => {
    return allDossiers
      .filter((d) => {
        const isReady = isClinicFullyReady(d);
        // 1. Readiness Filter Tab
        if (filterTab === 'ready' && !isReady) return false;
        if (filterTab === 'pending' && isReady) return false;

        // 2. Search query filter
        const q = searchQuery.toLowerCase().trim();
        if (!q) return true;
        return (
          d.clinic_name.toLowerCase().includes(q) ||
          d.doctor_name.toLowerCase().includes(q) ||
          d.city.toLowerCase().includes(q) ||
          d.bank.bank_name.toLowerCase().includes(q) ||
          d.bank.account_number.includes(q) ||
          d.pan.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (sortBy === 'ready-first') {
          const aReady = isClinicFullyReady(a);
          const bReady = isClinicFullyReady(b);
          if (aReady && !bReady) return -1;
          if (!aReady && bReady) return 1;
          return a.clinic_name.localeCompare(b.clinic_name);
        }
        if (sortBy === 'pending-first') {
          const aPending = !isClinicFullyReady(a);
          const bPending = !isClinicFullyReady(b);
          if (aPending && !bPending) return -1;
          if (!aPending && bPending) return 1;
          return a.clinic_name.localeCompare(b.clinic_name);
        }
        if (sortBy === 'name') {
          return a.clinic_name.localeCompare(b.clinic_name);
        }
        if (sortBy === 'city') {
          return a.city.localeCompare(b.city);
        }
        return 0;
      });
  }, [allDossiers, filterTab, searchQuery, sortBy]);
  const [previewDocUrl, setPreviewDocUrl] = useState<string | null>(null);
  const [previewDocTitle, setPreviewDocTitle] = useState<string>('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const pin = pinInput.trim();
    if (!pin) {
      setPinError('Please enter the partner access PIN.');
      return;
    }
    setIsSubmittingPin(true);
    setPinError(null);
    try {
      const res = await fetch('/api/underwriting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ pin })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAllDossiers(data.dossiers || []);
        setIsAuthenticated(true);
        sessionStorage.setItem('plural_underwriting_auth', '1');
        sessionStorage.setItem('plural_auth_timestamp', Date.now().toString());
        if (data.token) {
          sessionStorage.setItem('plural_uw_token', data.token);
        }
        toast.success('Welcome to Pine Labs Underwriting Desk');
      } else {
        setPinError(data.error || 'Invalid access PIN. Contact Underwriting Desk Support at ops@clinaza.in.');
      }
    } catch (err) {
      setPinError('Connection error. Please try again.');
    } finally {
      setIsSubmittingPin(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard API not available');
      }
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
    } catch {
      toast.error(`Could not copy ${label}. Please copy manually.`);
    }
  };

  // Clinic-specific dynamic SEO & Open Graph preview for WhatsApp unfurls
  const spotlightClinic = clinicParam
    ? allDossiers.find(
        (d) =>
          d.id.toLowerCase() === clinicParam.toLowerCase() ||
          (clinicParam === 'hear-one' && d.id === 'c1b4ab14-e0a4-4a60-9a86-ebedc9616675') ||
          (clinicParam === 'c1b4ab14-e0a4-4a60-9a86-ebedc9616675' && d.id === 'hear-one') ||
          d.clinic_name.toLowerCase().includes(clinicParam.toLowerCase())
      )
    : null;

  const targetClinic = (isAuthenticated ? activeDossier : null) || spotlightClinic;
  const preview = clinicLinkPreview('underwriting', targetClinic ? {
    clinic: targetClinic.clinic_name,
    doctor: targetClinic.doctor_name,
    city: targetClinic.city,
  } : readClinicPreviewIdentity(searchParams));

  if (!isAuthenticated) {
    return (
      <div className="underwriting-desk min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4">
        <SEOHead
          {...preview}
          robots={CLINIC_PREVIEW_ROBOTS}
        />
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <img src="/assets/clinaza-logo.jpg" alt="Clinaza" className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-sm" />
              <div>
                <span className="text-sm font-black tracking-widest text-slate-900">CLINAZA</span>
                <span className="block text-[10px] text-[#0867E8] font-bold uppercase tracking-wider">HealthPay</span>
              </div>
            </div>
            <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-1.5">
              <span className="text-[10px] font-black text-slate-500 tracking-wider">PARTNER:</span>
              <img src="/assets/plural_by_pinelabs_transparent.png" alt="Plural by Pine Labs" className="h-4 w-auto object-contain" />
            </div>
          </div>

          <div className="space-y-2 text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-[#0867E8] flex items-center justify-center mx-auto mb-2">
              <Lock size={22} />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900">Pine Labs Underwriting Desk</h1>
            <p className="text-xs text-slate-500 leading-relaxed">
              Confidential partner portal for Advaita Parmar &amp; Pine Labs Risk Team. Enter your access PIN:
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="partner-access-pin" className="block text-xs font-bold text-slate-700 mb-1.5 text-left">
                Partner Access PIN
              </label>
              <input
                id="partner-access-pin"
                name="partnerAccessPin"
                type="password"
                placeholder="Enter Partner Access PIN"
                aria-label="Partner Access PIN"
                aria-invalid={Boolean(pinError)}
                aria-describedby={pinError ? "pin-error-msg" : undefined}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  if (pinError) setPinError(null);
                }}
                disabled={isSubmittingPin}
                className={`w-full px-4 py-3 min-h-[44px] rounded-xl bg-slate-50 border text-slate-900 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all ${
                  pinError ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
                autoFocus
              />
              {pinError && (
                <p id="pin-error-msg" role="alert" className="text-xs text-rose-600 font-medium mt-1.5 flex items-center gap-1">
                  <AlertCircle size={12} className="shrink-0" /> <span>{pinError}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmittingPin}
              className="w-full py-3 min-h-[44px] bg-[#0867E8] hover:bg-[#0756C7] disabled:opacity-75 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-blue-500/25 active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmittingPin ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Unlock Underwriting Desk</span>
                  <ArrowUpRight size={14} />
                </>
              )}
            </button>
          </form>

          <p className="text-[11px] text-center text-slate-400">
            Institutional Aggregator MID: <span className="font-mono text-slate-700 font-bold">111077</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="underwriting-desk min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <SEOHead
        {...preview}
        robots={CLINIC_PREVIEW_ROBOTS}
      />

      {/* ── TOP INSTITUTIONAL BAR ── */}
      <header className="bg-white/95 border-b border-slate-200 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/assets/clinaza-logo.jpg" alt="Clinaza" className="w-9 h-9 rounded-xl object-cover border border-slate-200 shadow-xs" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black tracking-widest text-slate-900">CLINAZA</span>
                <span className="hidden sm:inline text-[9px] bg-blue-50 text-[#0867E8] font-extrabold px-1.5 py-0.5 rounded border border-blue-200">HealthPay</span>
              </div>
              <p className="hidden sm:block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Sub-Merchant Aggregator</p>
            </div>
          </Link>

          <span className="w-px h-5 bg-slate-200 hidden sm:inline-block" />

          <div className="hidden sm:flex items-center gap-2 bg-slate-50 px-2.5 h-9 rounded-xl shadow-2xs border border-slate-200">
            <span className="text-[9.5px] font-black text-slate-500 tracking-wider">GATEWAY:</span>
            <img src="/assets/plural_by_pinelabs_transparent.png" alt="Plural by Pine Labs" className="h-3.5 w-auto object-contain" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="hidden lg:flex items-center gap-2 text-[11px] bg-slate-50 px-3 h-9 rounded-xl border border-slate-200">
            <span className="text-slate-500">Desk Lead:</span>
            <span className="font-bold text-slate-800">Advaita Parmar</span>
            <span className="text-slate-300">&bull;</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Active Session
            </span>
          </div>

          <button
            onClick={() => setShowSensitivePii(!showSensitivePii)}
            className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 hover:text-slate-900 px-3 h-9 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
            title={showSensitivePii ? "Mask sensitive PII (Aadhaar & Bank)" : "Reveal sensitive PII"}
          >
            {showSensitivePii ? <EyeOff size={13} className="text-amber-600" /> : <Eye size={13} className="text-slate-500" />}
            <span>{showSensitivePii ? 'Mask PII' : 'Reveal PII'}</span>
          </button>

          <button
            onClick={handleLockDesk}
            className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 hover:text-slate-900 px-3 h-9 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Lock size={12} />
            <span>Lock Desk</span>
          </button>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">

        {!activeDossier ? (
          /* ══════════════════════════════════════════════════════════════
             PAGE 1: APPLICATIONS READY FOR UNDERWRITING (QUEUE LIST)
             ══════════════════════════════════════════════════════════════ */
          <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-7 shadow-xs space-y-6">
            {/* ── QUEUE HEADER & SEARCH FILTER ── */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-100">
              <div className="min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <h1 className="text-lg sm:text-xl font-black text-[#0B2450] tracking-tight">
                    Underwriting Applications ({filteredDossiers.length})
                  </h1>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-300 shrink-0">
                    Pine Labs Nodal Review
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
                  Select a clinic application below to review doctor identity proofs, verify settlement bank accounts, and download official Pine Labs MAF Excel &amp; signing packages.
                </p>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full lg:w-auto shrink-0">
                <a
                  href="/docs/kyc/Clinaza_All_Clinics_Complete_KYC_Dossiers.zip?download=1"
                  download="Clinaza_All_Clinics_Complete_KYC_Dossiers.zip"
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-2xs whitespace-nowrap cursor-pointer shrink-0"
                  title="Download All 8 Clinic KYC Packages in 1 Consolidated ZIP Archive"
                >
                  <FolderDown size={14} className="text-emerald-400" />
                  <span>Download Master ZIP (All Clinics)</span>
                </a>

                <button
                  onClick={() => fetchDossiers()}
                  disabled={isLoadingDossiers}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-300 shadow-2xs transition-all cursor-pointer shrink-0"
                  title="Refresh Underwriting Queue"
                  aria-label="Refresh Underwriting Queue"
                >
                  <RefreshCw size={14} className={isLoadingDossiers ? 'animate-spin text-[#0867E8]' : ''} />
                </button>

                <div className="relative flex-1 sm:w-72 lg:w-80 sm:flex-initial min-w-[200px]">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    aria-label="Search clinics by name, doctor, city, bank, or PAN"
                    placeholder="Search clinic, doctor, PAN, bank..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-slate-50 sm:bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ── UNDERWRITING EXECUTIVE KPI SUMMARY ── */}
            <div className="grid grid-cols-2 gap-px bg-slate-200/90 rounded-2xl overflow-hidden border border-slate-200/90 shadow-[0_2px_12px_rgba(15,23,42,0.03)]">
              {/* Tile 1: 100% Ready for MID */}
              <button
                type="button"
                onClick={() => setFilterTab(filterTab === 'ready' ? 'all' : 'ready')}
                className={`p-3.5 sm:p-4 text-left transition-all cursor-pointer ${
                  filterTab === 'ready' ? 'bg-emerald-50/60 ring-2 ring-inset ring-emerald-500' : 'bg-white hover:bg-slate-50/70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Ready for MID</span>
                  <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
                    <CheckCircle2 size={13} />
                  </span>
                </div>
                <div className="mt-1.5 flex items-baseline gap-1.5">
                  <span className="text-xl sm:text-2xl font-black text-emerald-700 tabular-nums">{readyCount}</span>
                  <span className="text-xs font-bold text-slate-400">/ {allDossiers.length} Clinics</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 font-medium leading-tight">Doctor Signed Dossiers Complete</p>
              </button>

              {/* Tile 2: Action Required / Pending Items */}
              <button
                type="button"
                onClick={() => setFilterTab(filterTab === 'pending' ? 'all' : 'pending')}
                className={`p-3.5 sm:p-4 text-left transition-all cursor-pointer ${
                  filterTab === 'pending' ? 'bg-amber-50/60 ring-2 ring-inset ring-amber-500' : 'bg-white hover:bg-slate-50/70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Pending Follow-Up</span>
                  <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                    <AlertCircle size={13} />
                  </span>
                </div>
                <div className="mt-1.5 flex items-baseline gap-1.5">
                  <span className="text-xl sm:text-2xl font-black text-amber-700 tabular-nums">{pendingCount}</span>
                  <span className="text-xs font-bold text-slate-400">Clinics</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 font-medium leading-tight">Awaiting Cheque / Signature</p>
              </button>
            </div>

            {/* ── READINESS FILTER TABS & SORTING ── */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1 pb-1">
              <div
                role="tablist"
                aria-label="Underwriting readiness filter"
                className="grid grid-cols-3 sm:inline-flex items-center gap-1 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 w-full sm:w-auto"
              >
                <button
                  role="tab"
                  aria-selected={filterTab === 'all'}
                  aria-controls="underwriting-queue-panel"
                  onClick={() => setFilterTab('all')}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 min-h-[38px] rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                    filterTab === 'all'
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <span className="sm:hidden">All</span>
                  <span className="hidden sm:inline">All Clinics</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-black ${
                    filterTab === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {allDossiers.length}
                  </span>
                </button>

                <button
                  role="tab"
                  aria-selected={filterTab === 'ready'}
                  aria-controls="underwriting-queue-panel"
                  onClick={() => setFilterTab('ready')}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 min-h-[38px] rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                    filterTab === 'ready'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-emerald-800 hover:bg-emerald-50/80'
                  }`}
                >
                  <CheckCircle2 size={13} className={filterTab === 'ready' ? 'text-white' : 'text-emerald-600'} />
                  <span className="sm:hidden">Ready</span>
                  <span className="hidden sm:inline">100% Ready for MID</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-black ${
                    filterTab === 'ready' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {readyCount}
                  </span>
                </button>

                <button
                  role="tab"
                  aria-selected={filterTab === 'pending'}
                  aria-controls="underwriting-queue-panel"
                  onClick={() => setFilterTab('pending')}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 min-h-[38px] rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                    filterTab === 'pending'
                      ? 'bg-amber-600 text-white shadow-2xs'
                      : 'text-amber-800 hover:bg-amber-50/80'
                  }`}
                >
                  <AlertCircle size={13} className={filterTab === 'pending' ? 'text-white' : 'text-amber-600'} />
                  <span className="sm:hidden">Pending</span>
                  <span className="hidden sm:inline">Pending Items</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-black ${
                    filterTab === 'pending' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {pendingCount}
                  </span>
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 self-start lg:self-auto text-xs shrink-0">
                <div className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs transition-colors h-9">
                  <ArrowUpDown size={13} className="text-slate-400 shrink-0" />
                  <label htmlFor="underwriting-sort" className="text-slate-500 font-bold text-[11px] cursor-pointer">Sort:</label>
                  <select
                    id="underwriting-sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent text-slate-800 font-bold focus:outline-none cursor-pointer text-xs pr-1 border-none"
                  >
                    <option value="ready-first">100% Ready First</option>
                    <option value="pending-first">Pending Items First</option>
                    <option value="name">Clinic Name (A–Z)</option>
                    <option value="city">City (A–Z)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ── CLINIC CARDS LIST (FULL-WIDTH BALANCED FLOW) ── */}
            <div className="space-y-4">
              {isLoadingDossiers && allDossiers.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3 shadow-xs">
                  <RefreshCw size={28} className="animate-spin text-[#0867E8] mx-auto" />
                  <p className="text-sm font-bold text-slate-800">Authenticating &amp; Loading Sub-Merchant Dossiers...</p>
                  <p className="text-xs text-slate-400">Verifying Pine Labs partner session credentials</p>
                </div>
              ) : filteredDossiers.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3 shadow-xs">
                  <p className="text-sm font-bold text-slate-800">No clinics found matching criteria</p>
                  <button
                    onClick={() => { setSearchQuery(''); setFilterTab('all'); }}
                    className="text-xs font-bold text-[#0867E8] hover:underline cursor-pointer"
                  >
                    Reset search &amp; filters
                  </button>
                </div>
              ) : (
                filteredDossiers.map((dossier) => {
                const isPending = !isClinicFullyReady(dossier);
                return (
                  <div
                    key={dossier.id}
                    onClick={() => handleSelectClinic(dossier.id)}
                    className="group bg-white hover:bg-slate-50/60 border border-slate-200/90 hover:border-[#0867E8]/50 rounded-2xl p-4 sm:p-6 transition-all duration-300 shadow-[0_4px_20px_rgba(15,23,42,0.03)] hover:shadow-[0_8px_25px_rgba(15,23,42,0.07)] cursor-pointer space-y-4"
                  >
                    {/* Clinic Identity & Header */}
                    <div className="flex items-start justify-between gap-3.5">
                      <div className="flex items-start gap-3.5 min-w-0">
                        <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl font-bold flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs border ${
                          isPending
                            ? 'bg-amber-50 border-amber-200 text-amber-700'
                            : 'bg-blue-50 border-blue-200 text-[#0867E8]'
                        }`}>
                          <Building2 size={22} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base sm:text-lg font-black text-[#0B2450] group-hover:text-[#0867E8] transition-colors">
                              {dossier.clinic_name}
                            </h3>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                              {dossier.city.split(',')[0]}
                            </span>
                          </div>
                          {/* Clean Subtitle (Doctor + Legal Entity + Phone) */}
                          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                            <strong>{dossier.doctor_name}</strong> &bull; {dossier.legal_name} &bull; {dossier.phone}
                          </p>
                        </div>
                      </div>

                      {/* Unified Single Readiness Badge */}
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-xl border shrink-0 flex items-center gap-1.5 ${
                        isPending
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      }`}>
                        {isPending ? <AlertCircle size={13} className="text-amber-600" /> : <CheckCircle2 size={13} className="text-emerald-600" />}
                        <span>{isPending ? `Action Required (${dossier.missing_items?.length || 1} Pending)` : '100% Ready for MID'}</span>
                      </span>
                    </div>

                    {/* Pending Documents Alert Strip (if action required) */}
                    {isPending && dossier.missing_items && dossier.missing_items.length > 0 && (
                      <div className="bg-amber-50/90 border border-amber-200 rounded-xl px-3.5 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-extrabold text-amber-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                            <AlertCircle size={13} className="text-amber-600" />
                            <span>Missing for MID:</span>
                          </span>
                          <span className="font-bold text-amber-950 text-xs bg-white px-2 py-0.5 rounded border border-amber-300 shadow-2xs">
                            {dossier.missing_items.join(', ')}
                          </span>
                        </div>
                        <span className="text-xs text-amber-700 font-semibold hidden sm:inline">Follow-up ongoing with clinic</span>
                      </div>
                    )}

                    {/* Settlement Bank Details - Full Width Structured Strip */}
                    <div className="bg-slate-50/80 rounded-xl p-3 sm:px-4 sm:py-3 border border-slate-200 text-xs sm:text-sm">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900">
                          <Landmark size={15} className="text-emerald-600 shrink-0" />
                          <span className="whitespace-nowrap">{dossier.bank.bank_name}</span>
                        </div>
                        <span className="hidden sm:inline text-slate-300">&bull;</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-500 text-xs">A/C:</span>
                          <span className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200 text-xs whitespace-nowrap">
                            {maskAccountNo(dossier.bank.account_number)}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(dossier.bank.account_number, `${dossier.clinic_name} Account Number`);
                            }}
                            title="Copy Account Number"
                            aria-label={`Copy account number for ${dossier.clinic_name}`}
                            className="w-7 h-7 flex items-center justify-center hover:bg-slate-200 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
                          >
                            <Copy size={13} />
                          </button>
                        </div>
                        <span className="hidden sm:inline text-slate-300">&bull;</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-500 text-xs">IFSC:</span>
                          <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-xs whitespace-nowrap">
                            {dossier.bank.ifsc}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(dossier.bank.ifsc, `${dossier.clinic_name} IFSC`);
                            }}
                            title="Copy IFSC"
                            aria-label={`Copy IFSC for ${dossier.clinic_name}`}
                            className="w-7 h-7 flex items-center justify-center hover:bg-slate-200 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
                          >
                            <Copy size={13} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Verification Badges */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <div className="inline-flex items-center gap-1.5 bg-blue-50 text-[#0867E8] border border-blue-200 px-3 py-1.5 rounded-xl text-xs font-bold">
                        <UserCheck size={14} />
                        <span>Doctor PAN: {dossier.pan}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(dossier.pan, `${dossier.doctor_name} PAN`);
                          }}
                          title="Copy Doctor PAN"
                          aria-label={`Copy doctor PAN for ${dossier.doctor_name}`}
                          className="w-6 h-6 flex items-center justify-center hover:bg-blue-100 rounded text-blue-500 hover:text-blue-800 transition-colors cursor-pointer ml-0.5"
                        >
                          <Copy size={12} />
                        </button>
                      </div>

                      <div className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-700 border border-teal-200 px-3 py-1.5 rounded-xl text-xs font-bold">
                        <FileCheck size={14} />
                        <span>{dossier.is_signed ? 'Doctor Signed PDF (Verified)' : 'Doctor Signing PDF Ready'}</span>
                      </div>

                      {dossier.docs.courier_awb && (
                        <div className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1.5 rounded-xl text-xs font-bold">
                          <Truck size={14} className="text-purple-600" />
                          <span>Hardcopy In Transit ({dossier.docs.courier_awb})</span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Bar: Verification Status & Primary CTA */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                      <div className="text-xs text-slate-500 font-medium">
                        {isPending ? 'Preliminary risk review in progress • MID pending final documents' : 'All mandatory KYC verified • Ready for MID mapping'}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectClinic(dossier.id);
                        }}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] bg-[#0867E8] hover:bg-[#0756C7] active:scale-[0.98] text-white text-xs font-bold rounded-xl shadow-[0_4px_16px_rgba(8,103,232,0.22)] hover:shadow-[0_6px_20px_rgba(8,103,232,0.32)] transition-all cursor-pointer whitespace-nowrap group-hover:scale-[1.01]"
                      >
                        <span>Review Documents &amp; Dossier</span>
                        <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                );
              }))}
            </div>
          </div>
        ) : (
          /* ══════════════════════════════════════════════════════════════
             PAGE 2: DEDICATED CLINIC UNDERWRITING DOSSIER & DOCUMENTS
             (ONLY SHOWN WHEN ADVAITA CLICKS ON A CLINIC)
             ══════════════════════════════════════════════════════════════ */
          <div className="space-y-6">
            {/* Top Navigation & Clinic Quick Switcher */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBackToQueue}
                  className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[40px] bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all cursor-pointer border border-slate-300 shadow-2xs active:scale-98"
                >
                  <ArrowLeft size={15} />
                  <span>Back to Applications Queue</span>
                </button>
                <span className="text-slate-300 hidden sm:inline">&bull;</span>
                <span className="text-xs text-slate-500 font-medium hidden sm:inline">Viewing Dossier:</span>
                <span className="text-xs font-black text-slate-900 hidden sm:inline">{activeDossier.clinic_name}</span>
              </div>

              {/* Mobile Clinic Switcher Dropdown (sm:hidden) */}
              <div className="sm:hidden w-full">
                <label htmlFor="mobile-clinic-switcher" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Switch Clinic Dossier:
                </label>
                <select
                  id="mobile-clinic-switcher"
                  value={activeDossier.id}
                  onChange={(e) => handleSelectClinic(e.target.value)}
                  className="w-full px-3 py-2.5 min-h-[44px] bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs cursor-pointer"
                >
                  {allDossiers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {isClinicFullyReady(d) ? '✓ ' : '⚠ '}{d.clinic_name} ({d.city.split(',')[0]})
                    </option>
                  ))}
                </select>
              </div>

              {/* Desktop Quick Clinic Switcher Pills (hidden sm:flex) */}
              <div className="hidden sm:flex items-center gap-2 overflow-x-auto max-w-full pb-1 scrollbar-none [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]">
                <span className="text-xs text-slate-500 font-bold hidden lg:inline whitespace-nowrap">Switch Clinic:</span>
                {allDossiers.map((d) => {
                  const isSelected = d.id === activeDossier.id;
                  const isReady = isClinicFullyReady(d);
                  const shortName = d.clinic_name
                    .replace(/^Dr\.\s+/i, '')
                    .replace(/\s+(Multispeciality|Speciality|Family|Cosmetic|Implant|Center|Care).*$/i, '')
                    .trim() || d.clinic_name;
                  return (
                    <button
                      key={d.id}
                      onClick={() => handleSelectClinic(d.id)}
                      className={`px-3 py-1.5 min-h-[36px] rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border whitespace-nowrap shrink-0 ${
                        isSelected
                          ? 'bg-blue-50 border-[#0867E8] text-[#0867E8] ring-1 ring-blue-500/20'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full shrink-0 ${isReady ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <span>{shortName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Focused Clinic Underwriting Dossier Card */}
            <div className="rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-7 shadow-[0_4px_25px_rgba(15,23,42,0.04)] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border mt-0.5 sm:mt-0 ${
                    !isActiveReady
                      ? 'bg-amber-50 border-amber-200 text-amber-600'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-600'
                  }`}>
                    {!isActiveReady ? <AlertCircle size={24} /> : <CheckCircle2 size={24} />}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-xl sm:text-2xl font-black text-[#0B2450]">{activeDossier.clinic_name}</h1>
                      <span className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-md border flex items-center gap-1 shrink-0 ${
                        !isActiveReady
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      }`}>
                        {!isActiveReady ? <AlertCircle size={12} className="text-amber-600" /> : <CheckCircle2 size={12} className="text-emerald-600" />}
                        <span>{!isActiveReady ? 'Action Required • Docs Pending' : '100% Ready for MID • MAF Signed'}</span>
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      {activeDossier.doctor_name} &bull; {activeDossier.city} &bull; {activeDossier.phone}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <a
                    href={activeDossier.docs.signing_pdf ? `${activeDossier.docs.signing_pdf}?download=1` : undefined}
                    aria-disabled={!activeDossier.docs.signing_pdf}
                    tabIndex={activeDossier.docs.signing_pdf ? undefined : -1}
                    download={`Plural_MAF_and_Doctor_KYC_Signing_Dossier_${activeDossier.clinic_name.replace(/\s+/g, '_')}.pdf`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer active:scale-98"
                    title={activeDossier.is_signed ? "Download verified signed doctor dossier" : "Download consolidated official MAF + Doctor PAN & Aadhaar signing dossier"}
                  >
                    <FileCheck size={16} />
                    <span>{!activeDossier.docs.signing_pdf ? 'Signing PDF Pending' : activeDossier.is_signed ? 'Doctor Signed PDF (Verified)' : 'Doctor Signing PDF'}</span>
                  </a>

                  <a
                    href={activeDossier.docs.maf_excel ? `${activeDossier.docs.maf_excel}?download=1` : undefined}
                    aria-disabled={!activeDossier.docs.maf_excel}
                    tabIndex={activeDossier.docs.maf_excel ? undefined : -1}
                    download={`Plural_MAF_BO_PEP_${activeDossier.clinic_name.replace(/\s+/g, '_')}.xlsx`}
                    className="inline-flex items-center gap-2 px-3.5 py-2.5 min-h-[44px] bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer active:scale-98"
                    title="Download Pine Labs MAF Excel"
                  >
                    <FileSpreadsheet size={16} />
                    <span>{activeDossier.docs.maf_excel ? 'Download MAF Excel' : 'MAF Excel Pending'}</span>
                  </a>

                  <a
                    href={activeDossier.docs.zip_bundle ? `${activeDossier.docs.zip_bundle}?download=1` : undefined}
                    aria-disabled={!activeDossier.docs.zip_bundle}
                    tabIndex={activeDossier.docs.zip_bundle ? undefined : -1}
                    download={`${activeDossier.clinic_name.replace(/\s+/g, '_')}_Complete_KYC_Dossier.zip`}
                    className="inline-flex items-center gap-2 px-3.5 py-2.5 min-h-[44px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition-all cursor-pointer active:scale-98"
                    title="Download all raw KYC documents in a ZIP package"
                  >
                    <FolderDown size={15} />
                    <span>{activeDossier.docs.zip_bundle ? 'Full ZIP' : 'ZIP Pending'}</span>
                  </a>
                </div>
              </div>

              {/* Dedicated Underwriting Readiness & Checklist Banner */}
              {activeDossier.readiness === 'pending' ? (
                <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                      <AlertCircle size={18} />
                    </div>
                    <div>
                      <span className="font-extrabold text-amber-950 block text-xs sm:text-sm">
                        {activeDossier.missing_items?.length || 1} Action{(activeDossier.missing_items?.length || 1) > 1 ? 's' : ''} Required for Sub-Merchant MID Activation:
                      </span>
                      <p className="text-amber-900 text-xs mt-1 leading-relaxed">
                        Missing document{(activeDossier.missing_items?.length || 1) > 1 ? 's' : ''}: <strong className="underline">{activeDossier.missing_items?.join(', ')}</strong>. Underwriters may proceed with preliminary PAN/account review; final Pine Labs terminal MID will map once attached.
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-1.5 bg-white/90 px-3 py-1.5 rounded-xl border border-amber-200 text-amber-900 font-bold text-xs shadow-2xs">
                    <Clock size={13} className="text-amber-600" />
                    <span>Doctor Follow-Up Ongoing</span>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <span className="font-extrabold text-emerald-950 block text-xs">All Mandatory Documents Verified (100% Ready)</span>
                      <p className="text-emerald-800 text-[11.5px] mt-0.5">
                        Doctor PAN, Aadhaar (Front &amp; Back), Cancelled Cheque, Business Establishment Proof, and 3-sheet Pine Labs MAF Excel are complete and validated.
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-1.5 bg-emerald-100/80 text-emerald-900 px-3 py-1.5 rounded-xl font-black text-[11px] border border-emerald-300">
                    <CheckCircle2 size={13} className="text-emerald-700" />
                    <span>Eligible for Instant MID</span>
                  </div>
                </div>
              )}

              {/* 3-Column Dossier Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Col 1: Entity & Doctor Details */}
                <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200 space-y-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0B2450] flex items-center gap-2">
                    <UserCheck size={14} className="text-[#0867E8]" />
                    <span>Doctor &amp; Entity Identity</span>
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10.5px]">Legal Entity / DBA:</span>
                      <span className="font-bold text-slate-900">{activeDossier.legal_name}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10.5px]">Managing Doctor:</span>
                      <span className="font-bold text-slate-900">{activeDossier.doctor_name} (DOB: {activeDossier.dob})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-slate-500 block text-[10.5px]">Doctor PAN:</span>
                        <span className="font-mono font-bold text-emerald-700 text-sm bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">{activeDossier.pan}</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(activeDossier.pan, 'Doctor PAN')}
                        className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                        title="Copy PAN"
                      >
                        <Copy size={13} />
                      </button>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10.5px]">Aadhaar Number:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-800">{maskAadhaar(activeDossier.aadhaar)}</span>
                        <button
                          onClick={() => setShowSensitivePii(!showSensitivePii)}
                          className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                          title={showSensitivePii ? "Mask Aadhaar" : "Reveal Aadhaar"}
                        >
                          {showSensitivePii ? <EyeOff size={12} /> : <Eye size={12} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10.5px]">Operating Clinic Address:</span>
                      <span className="text-slate-700 leading-tight block">{activeDossier.address}</span>
                    </div>
                  </div>
                </div>

                {/* Col 2: Bank Settlement Details (from Cancelled Cheque) */}
                <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200 space-y-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0B2450] flex items-center gap-2">
                    <Landmark size={14} className="text-emerald-600" />
                    <span>Settlement Bank Account</span>
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10.5px]">Bank Name &amp; Branch:</span>
                      <span className="font-bold text-slate-900">{activeDossier.bank.bank_name}</span>
                      <span className="text-[11px] text-slate-500 block">{activeDossier.bank.branch}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10.5px]">Beneficiary Name:</span>
                      <span className="font-bold text-emerald-700">{activeDossier.bank.account_holder}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-slate-500 block text-[10.5px]">Current Account No:</span>
                        <span className="font-mono font-bold text-slate-900 text-sm bg-slate-200/70 px-2 py-0.5 rounded">{maskAccountNo(activeDossier.bank.account_number)}</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(activeDossier.bank.account_number, 'Account Number')}
                        className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                        title="Copy Account No"
                      >
                        <Copy size={13} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-slate-500 block text-[10.5px]">RTGS / NEFT IFSC:</span>
                        <span className="font-mono font-bold text-blue-700 text-sm bg-blue-50 px-2 py-0.5 rounded border border-blue-200">{activeDossier.bank.ifsc}</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(activeDossier.bank.ifsc, 'IFSC Code')}
                        className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                        title="Copy IFSC"
                      >
                        <Copy size={13} />
                      </button>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-xs">Cheque Verification:</span>
                      {activeDossier.docs.cancelled_cheque && activeDossier.bank.micr && activeDossier.bank.micr !== 'Under Verification' && !activeDossier.missing_items?.some(i => i.toLowerCase().includes('cheque')) ? (
                        <span className="text-emerald-700 font-bold text-xs flex items-center gap-1.5 mt-0.5">
                          <CheckCircle2 size={13} className="text-emerald-600" /> "CANCELLED" verified &bull; MICR {activeDossier.bank.micr}
                        </span>
                      ) : (
                        <span className="text-amber-700 font-bold text-xs flex items-center gap-1.5 mt-0.5">
                          <AlertCircle size={13} className="text-amber-600 shrink-0" /> Awaiting Cancelled Cheque &bull; Bank Linking Pending
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Col 3: Direct KYC Document Access */}
                <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0B2450] flex items-center gap-2">
                      <FileText size={15} className="text-amber-600" />
                      <span>Supporting KYC Documents</span>
                    </h3>
                    <span className="text-[11px] font-bold text-slate-400">Authentic Underwriting Records</span>
                  </div>

                  <div className="space-y-2">
                    {/* GST Document (Exemption Declaration vs Registration Certificate) */}
                    {activeDossier.docs.gst_certificate ? (
                      <a
                        href={activeDossier.docs.gst_certificate}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full min-h-[44px] flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all text-xs group cursor-pointer shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <FileText size={15} className="text-emerald-600 shrink-0" />
                          <div>
                            <span className="font-bold text-slate-800 group-hover:text-emerald-700 transition-colors block text-xs">
                              GST Registration Certificate
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">Active Corporate GSTIN Verified</span>
                          </div>
                        </div>
                        <ExternalLink size={14} className="text-slate-400 group-hover:text-slate-600 shrink-0" />
                      </a>
                    ) : activeDossier.docs.gst_declaration_pdf ? (
                      <a
                        href={activeDossier.docs.gst_declaration_pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full min-h-[44px] flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all text-xs group cursor-pointer shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <FileText size={15} className="text-emerald-600 shrink-0" />
                          <div>
                            <span className="font-bold text-slate-800 group-hover:text-emerald-700 transition-colors block text-xs">
                              {activeDossier.is_signed ? 'GST Exemption Declaration (Signed & Stamped)' : 'GST Exemption Declaration (Sec 23)'}
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">Healthcare Services Statutory Exemption</span>
                          </div>
                        </div>
                        <ExternalLink size={14} className="text-slate-400 group-hover:text-slate-600 shrink-0" />
                      </a>
                    ) : null}

                    {/* Board Resolution (for corporate entities like Elara) */}
                    {activeDossier.docs.board_resolution && (
                      <a
                        href={activeDossier.docs.board_resolution}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full min-h-[44px] flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all text-xs group cursor-pointer shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <FileCheck size={15} className="text-indigo-600 shrink-0" />
                          <div>
                            <span className="font-bold text-slate-800 group-hover:text-indigo-700 transition-colors block text-xs">
                              Signed Board Resolution
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">Pine Labs Multi-Director Authorization</span>
                          </div>
                        </div>
                        <ExternalLink size={14} className="text-slate-400 group-hover:text-slate-600 shrink-0" />
                      </a>
                    )}

                    {/* Bank Cancelled Cheque (with real status verification!) */}
                    {activeDossier.docs.cancelled_cheque ? (
                      <a
                        href={activeDossier.docs.cancelled_cheque}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full min-h-[44px] flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all text-xs group cursor-pointer shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <Landmark size={15} className="text-emerald-600 shrink-0" />
                          <div>
                            <span className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors block text-xs">
                              Bank Cancelled Cheque
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">{activeDossier.bank.bank_name} &bull; A/C Verified</span>
                          </div>
                        </div>
                        <ExternalLink size={14} className="text-slate-400 group-hover:text-slate-600 shrink-0" />
                      </a>
                    ) : (
                      <div className="w-full min-h-[44px] flex items-center justify-between p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-xs">
                        <div className="flex items-center gap-2.5">
                          <Landmark size={15} className="text-amber-600 shrink-0" />
                          <div>
                            <span className="font-bold text-amber-900 block text-xs">
                              Bank Cancelled Cheque
                            </span>
                            <span className="text-[11px] text-amber-700 font-medium">Awaiting Cheque Upload from Clinic</span>
                          </div>
                        </div>
                        <span className="text-[10.5px] font-bold text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded border border-amber-200">
                          Action Required
                        </span>
                      </div>
                    )}

                    {/* Doctor PAN */}
                    {activeDossier.docs.doctor_pan && (
                      <a
                        href={activeDossier.docs.doctor_pan}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full min-h-[44px] flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all text-xs group cursor-pointer shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <UserCheck size={15} className="text-[#0867E8] shrink-0" />
                          <div>
                            <span className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors block text-xs">
                              Doctor PAN Card
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">PAN: {activeDossier.pan}</span>
                          </div>
                        </div>
                        <ExternalLink size={14} className="text-slate-400 group-hover:text-slate-600 shrink-0" />
                      </a>
                    )}

                    {/* Doctor Aadhaar */}
                    {activeDossier.docs.aadhaar_front && (
                      <a
                        href={activeDossier.docs.aadhaar_front}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full min-h-[44px] flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all text-xs group cursor-pointer shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <CreditCard size={15} className="text-sky-600 shrink-0" />
                          <div>
                            <span className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors block text-xs">
                              {activeDossier.docs.aadhaar_back || activeDossier.id === 'elara-ivf' ? 'Doctor Aadhaar (Front & Back)' : 'Doctor Aadhaar Card'}
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">Identity &amp; Address Proof Verified</span>
                          </div>
                        </div>
                        <ExternalLink size={14} className="text-slate-400 group-hover:text-slate-600 shrink-0" />
                      </a>
                    )}

                    {/* Establishment Registration */}
                    {activeDossier.docs.establishment_reg && (
                      <a
                        href={activeDossier.docs.establishment_reg}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full min-h-[44px] flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all text-xs group cursor-pointer shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <Building2 size={15} className="text-indigo-600 shrink-0" />
                          <div>
                            <span className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors block text-xs">
                              {activeDossier.business_proof.type}
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">Reg No: {activeDossier.business_proof.number}</span>
                          </div>
                        </div>
                        <ExternalLink size={14} className="text-slate-400 group-hover:text-slate-600 shrink-0" />
                      </a>
                    )}

                    {/* Dental Council Registration */}
                    {activeDossier.docs.dental_council_reg && (
                      <a
                        href={activeDossier.docs.dental_council_reg}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full min-h-[44px] flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all text-xs group cursor-pointer shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <ShieldCheck size={15} className="text-emerald-600 shrink-0" />
                          <div>
                            <span className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors block text-xs">
                              State Dental Council Registration
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">Official Medical Council Certificate</span>
                          </div>
                        </div>
                        <ExternalLink size={14} className="text-slate-400 group-hover:text-slate-600 shrink-0" />
                      </a>
                    )}

                    {/* Courier Receipt */}
                    {activeDossier.docs.courier_receipt && (
                      <a
                        href={activeDossier.docs.courier_receipt}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full min-h-[44px] flex items-center justify-between p-3 rounded-xl bg-purple-50/60 border border-purple-200 hover:border-purple-400 hover:bg-purple-100/50 transition-all text-xs group cursor-pointer shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <Truck size={15} className="text-purple-600 shrink-0" />
                          <div className="text-left">
                            <span className="font-bold text-slate-900 group-hover:text-purple-700 transition-colors block text-xs">
                              DTDC Physical Hardcopy Courier Receipt
                            </span>
                            <span className="text-[11px] text-purple-700 font-mono font-semibold">
                              {activeDossier.docs.courier_awb} &bull; Consignee: Akhilesh Dhuriya (Pine Labs Noida)
                            </span>
                          </div>
                        </div>
                        <ExternalLink size={14} className="text-purple-500 group-hover:text-purple-700 shrink-0" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
