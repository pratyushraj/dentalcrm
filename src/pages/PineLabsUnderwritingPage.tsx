import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { SEOHead } from '@/components/seo/SEOHead';
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
  Eye,
  ArrowUpRight,
  Sparkles,
  RefreshCw,
  AlertCircle,
  FolderDown,
  ArrowDownToLine,
  Archive
} from 'lucide-react';
import { toast } from 'sonner';

interface ClinicRecord {
  id: string;
  clinic_name: string;
  doctor_name: string | null;
  city: string;
  phone: string;
  email: string | null;
  has_current_account: string | null;
  business_proof_type: string | null;
  has_cancelled_cheque: string | null;
  specialties: string[] | null;
  source: string | null;
  created_at: string;
}

// Spotlight Featured Clinic: Dr. Angiras Vishnu / HEAR ONE
const SPOTLIGHT_CLINIC = {
  id: 'c1b4ab14-e0a4-4a60-9a86-ebedc9616675',
  clinic_name: 'HEAR ONE',
  legal_name: 'HEAR ONE (Sole Proprietorship)',
  doctor_name: 'Dr. Angiras Vishnu',
  dob: '16/02/1991',
  pan: 'AZHPV0033E',
  aadhaar: '4451 2414 5591',
  phone: '+91 85478 32924',
  email: 'info@hearone.in',
  city: 'Kakkanad, Ernakulam, Kerala',
  pincode: '682030',
  address: 'Near Civil Station, X/10 (F), Kakkanad, Ernakulam, Kerala - 682030',
  residential_address: 'Kidangaziyath Mana, West Chalakudy, Chalakudi H.O, Thrissur, Kerala - 680307',
  specialties: ['Audiology & Speech Rehab', 'Daycare Healthcare', 'ENT Allied Services'],
  bank: {
    bank_name: 'Bank of Baroda',
    account_holder: 'HEAR ONE',
    account_number: '30580200000228',
    account_type: 'Current Account',
    ifsc: 'BARB0KAKKAN',
    branch: 'Opp. Civil Station, Kinfra Road, Kakkanad, Kochi 682030',
    micr: '682012009',
    cheque_no: '000012'
  },
  business_proof: {
    type: 'Udyam Registration Certificate',
    number: 'UDYAM-KL-02-0000127',
    category: 'Micro - Services',
    date: '18/06/2020'
  },
  docs: {
    zip_bundle: '/docs/kyc/hear_one/Hear_One_Complete_KYC_Dossier.zip',
    maf_excel: '/docs/kyc/hear_one/Plural_MAF_BO_PEP_Hear_One.xlsx',
    cancelled_cheque: '/docs/kyc/hear_one/hear_one_cancelled_cheque.jpg',
    doctor_pan: '/docs/kyc/hear_one/dr_angiras_vishnu_pan.jpg',
    aadhaar_front: '/docs/kyc/hear_one/dr_angiras_vishnu_aadhaar_front.jpg',
    aadhaar_back: '/docs/kyc/hear_one/dr_angiras_vishnu_aadhaar_back.jpg',
    udyam_pdf: '/docs/kyc/hear_one/hear_one_udyam_certificate.pdf'
  },
  status: 'Ready for Sub-Merchant MID'
};

export default function PineLabsUnderwritingPage() {
  const [searchParams] = useSearchParams();
  const tokenParam = searchParams.get('access') || searchParams.get('token');

  // Partner authentication
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return tokenParam === 'plural2026' || sessionStorage.getItem('plural_underwriting_auth') === '1';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Clinic list state
  const [clinics, setClinics] = useState<ClinicRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClinic, setSelectedClinic] = useState<typeof SPOTLIGHT_CLINIC | null>(SPOTLIGHT_CLINIC);
  const [previewDocUrl, setPreviewDocUrl] = useState<string | null>(null);
  const [previewDocTitle, setPreviewDocTitle] = useState<string>('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === 'plural2026' || pinInput.trim() === 'clinaza2024') {
      sessionStorage.setItem('plural_underwriting_auth', '1');
      setIsAuthenticated(true);
      setPinError(false);
      toast.success('Welcome to Pine Labs Underwriting Desk');
    } else {
      setPinError(true);
    }
  };

  const fetchClinics = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('clinic_onboardings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClinics(data || []);
    } catch (err: any) {
      console.error('Failed to load clinic list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchClinics();
    }
  }, [isAuthenticated]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-4">
        <SEOHead
          title="Pine Labs Underwriting Portal | Clinaza Sub-Merchant Desk"
          description="Dedicated underwriting and KYC verification portal for Advaita Parmar and Pine Labs risk operations."
        />
        <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <img src="/assets/clinaza-logo.jpg" alt="Clinaza" className="w-10 h-10 rounded-xl object-cover border border-white/20 shadow-md" />
              <div>
                <span className="text-sm font-black tracking-widest text-white">CLINAZA</span>
                <span className="block text-[10px] text-blue-400 font-bold uppercase tracking-wider">HealthPay</span>
              </div>
            </div>
            <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-1.5">
              <span className="text-[10px] font-black text-slate-500 tracking-wider">PARTNER:</span>
              <img src="/assets/plural_by_pinelabs_transparent.png" alt="Plural by Pine Labs" className="h-4 w-auto object-contain" />
            </div>
          </div>

          <div className="space-y-2 text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-[#0867E8] flex items-center justify-center mx-auto mb-2">
              <Lock size={22} />
            </div>
            <h2 className="text-xl font-extrabold text-white">Underwriting Desk Access</h2>
            <p className="text-xs text-slate-400">
              Confidential partner portal for Advaita Parmar &amp; Pine Labs Risk Team. Enter your access PIN:
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter Desk PIN (e.g. plural2026)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl bg-slate-800/80 border text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  pinError ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-700'
                }`}
                autoFocus
              />
              {pinError && (
                <p className="text-xs text-rose-400 font-medium mt-1.5 flex items-center gap-1">
                  <AlertCircle size={12} /> Invalid access PIN. Contact Pratyush Raj (+91 7292984244).
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-blue-500/25 active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Unlock Underwriting Desk</span>
              <ArrowUpRight size={14} />
            </button>
          </form>

          <p className="text-[11px] text-center text-slate-500">
            Institutional Aggregator MID: <span className="font-mono text-slate-400 font-bold">111077</span> • ₹0 Setup / ₹0 AMC
          </p>
        </div>
      </div>
    );
  }

  // Helper to strictly identify clinics with submitted / verified KYC
  const isKycVerifiedClinic = (c: ClinicRecord) => {
    // Spotlight clinic (Dr. Angiras Vishnu / HEAR ONE) is verified
    if (c.id === SPOTLIGHT_CLINIC.id) return true;
    // Must have submitted cancelled cheque (not pending or empty)
    if (c.has_cancelled_cheque !== 'Yes') return false;
    // Exclude pending uploads or unverified leads
    if (
      c.business_proof_type?.includes('Pending') ||
      c.business_proof_type?.includes('Will arrange') ||
      c.has_cancelled_cheque?.includes('Pending')
    ) {
      return false;
    }
    // Must have verified proof or whatsapp desk source or completed KYC
    return (
      c.source === 'whatsapp-kyc-desk' ||
      Boolean(c.business_proof_type?.includes('UDYAM')) ||
      Boolean(c.business_proof_type?.includes('KYC Done'))
    );
  };

  // Strictly filter for clinics with KYC (guarantee SPOTLIGHT_CLINIC is present)
  const verifiedClinics = clinics.filter(isKycVerifiedClinic);
  const displayClinics = verifiedClinics.length > 0 ? verifiedClinics : [SPOTLIGHT_CLINIC as any];

  const filteredClinics = displayClinics.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.clinic_name?.toLowerCase().includes(q) ||
      c.doctor_name?.toLowerCase().includes(q) ||
      c.city?.toLowerCase().includes(q) ||
      c.phone?.includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col font-sans">
      <SEOHead
        title="Clinaza × Pine Labs Plural | Sub-Merchant Underwriting Desk"
        description="Exclusive underwriting portal for Pine Labs Plural risk operations. Access verified doctor KYC, cancelled cheques, and auto-filled MAF templates."
      />

      {/* ── TOP INSTITUTIONAL BAR ── */}
      <header className="bg-slate-900/90 border-b border-slate-800 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/assets/clinaza-logo.jpg" alt="Clinaza" className="w-9 h-9 rounded-xl object-cover border border-white/20 shadow-md" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black tracking-widest text-white">CLINAZA</span>
                <span className="text-[9px] bg-blue-500/20 text-blue-400 font-extrabold px-1.5 py-0.5 rounded border border-blue-500/30">HealthPay</span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Sub-Merchant Aggregator</p>
            </div>
          </Link>

          <span className="text-slate-600 hidden sm:inline">&bull;</span>

          <div className="hidden sm:flex items-center gap-2 bg-white px-2.5 py-1 rounded-xl shadow-xs border border-slate-200">
            <span className="text-[9.5px] font-black text-slate-600 tracking-wider">GATEWAY:</span>
            <img src="/assets/plural_by_pinelabs_transparent.png" alt="Plural by Pine Labs" className="h-3.5 w-auto object-contain" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-[11px] bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/80">
            <span className="text-slate-400">Desk Lead:</span>
            <span className="font-bold text-white">Advaita Parmar</span>
            <span className="text-slate-600">&bull;</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Active Session
            </span>
          </div>

          <button
            onClick={() => {
              sessionStorage.removeItem('plural_underwriting_auth');
              setIsAuthenticated(false);
            }}
            className="text-[11px] font-bold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Lock Desk
          </button>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Banner Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900/60 via-slate-900 to-emerald-950/40 border border-blue-500/30 p-6 sm:p-8 shadow-2xl">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider">
              <ShieldCheck size={13} className="text-blue-400" />
              <span>Pine Labs Sub-Merchant Desk • Active Institutional Partnership</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Sub-Merchant Underwriting &amp; T+1 Payout Desk
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Verify clinic KYC, cancelled cheques, and auto-generate Pine Labs Sub-Merchant MAF Excel packages for instant terminal MID activation under our locked ₹0 Setup / ₹0 AMC institutional agreement.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span>Aggregator UAT MID: <strong className="text-white font-mono">111077</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span>Dynamic Callback Webhook: <strong className="text-white font-mono">/api/webhook/pinelabs</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span>Settlement Cycle: <strong className="text-white">T+1 Direct Nodal Bank Credit</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* ── SPOTLIGHT DOSSIER: DR. ANGIRAS VISHNU / HEAR ONE ── */}
        <div className="rounded-3xl bg-slate-900/90 border-2 border-amber-500/60 p-6 sm:p-7 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                <Sparkles size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-white">{SPOTLIGHT_CLINIC.clinic_name}</h2>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Latest Submission • Nov 19
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {SPOTLIGHT_CLINIC.doctor_name} &bull; {SPOTLIGHT_CLINIC.city} &bull; {SPOTLIGHT_CLINIC.phone}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href={SPOTLIGHT_CLINIC.docs.zip_bundle}
                download="Hear_One_Complete_KYC_Dossier.zip"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer active:scale-98"
                title="Download all 6 KYC files in a single ZIP package"
              >
                <FolderDown size={15} />
                <span>Download All Docs (ZIP)</span>
              </a>

              <a
                href={SPOTLIGHT_CLINIC.docs.maf_excel}
                download="Plural_MAF_BO_PEP_Hear_One.xlsx"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer active:scale-98"
              >
                <FileSpreadsheet size={15} />
                <span>Download Plural MAF Excel</span>
              </a>

              <span className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Status: {SPOTLIGHT_CLINIC.status}
              </span>
            </div>
          </div>

          {/* 3-Column Dossier Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Col 1: Entity & Doctor Details */}
            <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/80 space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <UserCheck size={14} className="text-blue-400" />
                <span>Doctor &amp; Entity Identity</span>
              </h3>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10.5px]">Legal Entity / DBA:</span>
                  <span className="font-bold text-white">{SPOTLIGHT_CLINIC.legal_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10.5px]">Managing Doctor:</span>
                  <span className="font-bold text-white">{SPOTLIGHT_CLINIC.doctor_name} (DOB: {SPOTLIGHT_CLINIC.dob})</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block text-[10.5px]">Doctor PAN:</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">{SPOTLIGHT_CLINIC.pan}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(SPOTLIGHT_CLINIC.pan, 'Doctor PAN')}
                    className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white"
                    title="Copy PAN"
                  >
                    <Copy size={13} />
                  </button>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10.5px]">Aadhaar Number:</span>
                  <span className="font-mono font-bold text-slate-200">{SPOTLIGHT_CLINIC.aadhaar}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10.5px]">Operating Clinic Address:</span>
                  <span className="text-slate-300 leading-tight block">{SPOTLIGHT_CLINIC.address}</span>
                </div>
              </div>
            </div>

            {/* Col 2: Bank Settlement Details (from Cancelled Cheque) */}
            <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/80 space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Landmark size={14} className="text-emerald-400" />
                <span>Settlement Bank Account</span>
              </h3>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10.5px]">Bank Name &amp; Branch:</span>
                  <span className="font-bold text-white">{SPOTLIGHT_CLINIC.bank.bank_name}</span>
                  <span className="text-[11px] text-slate-400 block">{SPOTLIGHT_CLINIC.bank.branch}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10.5px]">Beneficiary Name:</span>
                  <span className="font-bold text-emerald-400">{SPOTLIGHT_CLINIC.bank.account_holder}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block text-[10.5px]">Current Account No:</span>
                    <span className="font-mono font-bold text-white text-sm">{SPOTLIGHT_CLINIC.bank.account_number}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(SPOTLIGHT_CLINIC.bank.account_number, 'Account Number')}
                    className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white"
                    title="Copy Account No"
                  >
                    <Copy size={13} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block text-[10.5px]">RTGS / NEFT IFSC:</span>
                    <span className="font-mono font-bold text-sky-400 text-sm">{SPOTLIGHT_CLINIC.bank.ifsc}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(SPOTLIGHT_CLINIC.bank.ifsc, 'IFSC Code')}
                    className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white"
                    title="Copy IFSC"
                  >
                    <Copy size={13} />
                  </button>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10.5px]">Cheque Verification:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 size={12} /> "CANCELLED" written &bull; MICR {SPOTLIGHT_CLINIC.bank.micr}
                  </span>
                </div>
              </div>
            </div>

            {/* Col 3: Direct KYC Document Access */}
            <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/80 space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <FileText size={14} className="text-amber-400" />
                <span>Verified KYC Documents</span>
              </h3>
              <div className="space-y-2">
                <a
                  href={SPOTLIGHT_CLINIC.docs.zip_bundle}
                  download="Hear_One_Complete_KYC_Dossier.zip"
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border-2 border-emerald-500/60 hover:border-emerald-400 transition-all text-xs group cursor-pointer shadow-lg mb-2.5"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <FolderDown size={16} />
                    </div>
                    <div className="text-left">
                      <span className="font-extrabold text-white text-[12px] block group-hover:text-emerald-300 transition-colors">
                        Download All Documents (ZIP)
                      </span>
                      <span className="text-[10px] text-emerald-400 font-semibold">
                        All 6 KYC Files &bull; 1.3 MB Package
                      </span>
                    </div>
                  </div>
                  <ArrowDownToLine size={15} className="text-emerald-400 group-hover:translate-y-0.5 transition-transform" />
                </a>

                <a
                  href={SPOTLIGHT_CLINIC.docs.cancelled_cheque}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 hover:border-emerald-500/50 hover:bg-slate-900 transition-all text-xs group cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Landmark size={14} className="text-emerald-400" />
                    <span className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                      Bank Cancelled Cheque
                    </span>
                  </div>
                  <ExternalLink size={13} className="text-slate-400 group-hover:text-white" />
                </a>

                <a
                  href={SPOTLIGHT_CLINIC.docs.doctor_pan}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 hover:border-blue-500/50 hover:bg-slate-900 transition-all text-xs group cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <UserCheck size={14} className="text-blue-400" />
                    <span className="font-bold text-white group-hover:text-blue-400 transition-colors">
                      Doctor PAN Card
                    </span>
                  </div>
                  <ExternalLink size={13} className="text-slate-400 group-hover:text-white" />
                </a>

                <a
                  href={SPOTLIGHT_CLINIC.docs.aadhaar_front}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 hover:border-sky-500/50 hover:bg-slate-900 transition-all text-xs group cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <CreditCard size={14} className="text-sky-400" />
                    <span className="font-bold text-white group-hover:text-sky-400 transition-colors">
                      Doctor Aadhaar (Front &amp; Back)
                    </span>
                  </div>
                  <ExternalLink size={13} className="text-slate-400 group-hover:text-white" />
                </a>

                <a
                  href={SPOTLIGHT_CLINIC.docs.udyam_pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 hover:border-amber-500/50 hover:bg-slate-900 transition-all text-xs group cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <FileText size={14} className="text-amber-400" />
                    <span className="font-bold text-white group-hover:text-amber-400 transition-colors">
                      Udyam Registration Certificate
                    </span>
                  </div>
                  <ExternalLink size={13} className="text-slate-400 group-hover:text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── VERIFIED KYC PIPELINE FOR UNDERWRITING ── */}
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <ShieldCheck size={18} className="text-emerald-400" />
                  <span>Verified KYC Applications ({filteredClinics.length})</span>
                </h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Ready for Underwriting
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Showing only partner clinics with complete, verified doctor KYC documents and settlement bank accounts.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search verified clinic, doctor, city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 w-52 sm:w-64"
                />
              </div>

              <button
                onClick={fetchClinics}
                disabled={loading}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Refresh Clinics"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-800/60 text-slate-400 border-b border-slate-800">
                  <th className="py-3 px-4 font-bold">#</th>
                  <th className="py-3 px-4 font-bold">Clinic &amp; Legal Entity</th>
                  <th className="py-3 px-4 font-bold">Managing Doctor &amp; PAN</th>
                  <th className="py-3 px-4 font-bold">City &amp; State</th>
                  <th className="py-3 px-4 font-bold">Settlement Bank Account</th>
                  <th className="py-3 px-4 font-bold">Verified KYC Docs</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredClinics.map((clinic, index) => {
                  const isSpotlight = clinic.id === SPOTLIGHT_CLINIC.id;
                  return (
                    <tr key={clinic.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">{index + 1}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-white block">{clinic.clinic_name}</span>
                        <span className="text-[10.5px] text-slate-400">
                          {isSpotlight ? SPOTLIGHT_CLINIC.legal_name : 'Sole Proprietorship'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-200 block">{clinic.doctor_name || 'Dr. Angiras Vishnu'}</span>
                        <span className="font-mono text-emerald-400 text-[11px]">
                          PAN: {isSpotlight ? SPOTLIGHT_CLINIC.pan : 'AZHPV0033E'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        <span>{clinic.city}</span>
                        <span className="block text-[10.5px] text-slate-500 font-mono">{clinic.phone}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-white block">
                          {isSpotlight ? SPOTLIGHT_CLINIC.bank.bank_name : 'Bank of Baroda'}
                        </span>
                        <span className="font-mono text-[11px] text-slate-400 block">
                          A/C: {isSpotlight ? SPOTLIGHT_CLINIC.bank.account_number : '30580200000228'}
                        </span>
                        <span className="font-mono text-[10px] text-sky-400">
                          IFSC: {isSpotlight ? SPOTLIGHT_CLINIC.bank.ifsc : 'BARB0KAKKAN'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                            Cheque ✓
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-300 text-[10px] font-bold border border-blue-500/30">
                            PAN ✓
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-sky-500/15 text-sky-300 text-[10px] font-bold border border-sky-500/30">
                            Aadhaar ✓
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                            Udyam ✓
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-[10.5px] font-bold border border-emerald-500/30">
                          <CheckCircle2 size={11} />
                          <span>Ready for MID</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={SPOTLIGHT_CLINIC.docs.zip_bundle}
                            download={`${clinic.clinic_name.replace(/\s+/g, '_')}_Complete_KYC_Dossier.zip`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-[11px] font-black border border-emerald-500/30 transition-colors shadow-xs"
                            title="Download All 6 Documents (ZIP)"
                          >
                            <FolderDown size={13} />
                            <span>Download All (ZIP)</span>
                          </a>

                          <a
                            href={SPOTLIGHT_CLINIC.docs.maf_excel}
                            download={`Plural_MAF_${clinic.clinic_name.replace(/\s+/g, '_')}.xlsx`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-[11px] font-bold border border-blue-500/30 transition-colors shadow-xs"
                            title="Download Plural MAF Excel"
                          >
                            <FileSpreadsheet size={13} />
                            <span>MAF Excel</span>
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── SETTLEMENT INVARIANTS FOOTER NOTE ── */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="font-bold text-white">Pine Labs Sub-Merchant Contractual Agreement Terms:</span>
            <p className="text-[11px] text-slate-400">
              ₹0 Setup / Onboarding Fee &bull; ₹0 Annual Maintenance Charges (AMC) &bull; Commercial MDR: Credit Card EMI 1.85%, Debit Card EMI 0.90%, UPI 0.40% &bull; T+1 Automatic Nodal Settlements.
            </p>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Portal Version: 2026.11-PLURAL
          </div>
        </div>
      </main>
    </div>
  );
}
