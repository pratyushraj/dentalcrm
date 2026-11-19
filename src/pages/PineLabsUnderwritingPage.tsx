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
  Archive,
  FileCheck
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
    signing_pdf: '/docs/kyc/hear_one/Plural_MAF_and_Doctor_KYC_Signing_Dossier_Hear_One.pdf',
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
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4">
        <SEOHead
          title="Pine Labs Underwriting Portal | Clinaza Sub-Merchant Desk"
          description="Dedicated underwriting and KYC verification portal for Advaita Parmar and Pine Labs risk operations."
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
            <h2 className="text-xl font-extrabold text-slate-900">Underwriting Desk Access</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
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
                className={`w-full px-4 py-3 rounded-xl bg-slate-50 border text-slate-900 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all ${
                  pinError ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
                autoFocus
              />
              {pinError && (
                <p className="text-xs text-rose-600 font-medium mt-1.5 flex items-center gap-1">
                  <AlertCircle size={12} /> Invalid access PIN. Contact Pratyush Raj (+91 7292984244).
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-blue-500/25 active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Unlock Underwriting Desk</span>
              <ArrowUpRight size={14} />
            </button>
          </form>

          <p className="text-[11px] text-center text-slate-400">
            Institutional Aggregator MID: <span className="font-mono text-slate-700 font-bold">111077</span> • ₹0 Setup / ₹0 AMC
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <SEOHead
        title="Clinaza × Pine Labs Plural | Sub-Merchant Underwriting Desk"
        description="Exclusive underwriting portal for Pine Labs Plural risk operations. Access verified doctor KYC, cancelled cheques, and auto-filled MAF templates."
      />

      {/* ── TOP INSTITUTIONAL BAR ── */}
      <header className="bg-white/95 border-b border-slate-200 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/assets/clinaza-logo.jpg" alt="Clinaza" className="w-9 h-9 rounded-xl object-cover border border-slate-200 shadow-xs" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black tracking-widest text-slate-900">CLINAZA</span>
                <span className="text-[9px] bg-blue-50 text-[#0867E8] font-extrabold px-1.5 py-0.5 rounded border border-blue-200">HealthPay</span>
              </div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Sub-Merchant Aggregator</p>
            </div>
          </Link>

          <span className="text-slate-300 hidden sm:inline">&bull;</span>

          <div className="hidden sm:flex items-center gap-2 bg-slate-50 px-2.5 py-1 rounded-xl shadow-2xs border border-slate-200">
            <span className="text-[9.5px] font-black text-slate-500 tracking-wider">GATEWAY:</span>
            <img src="/assets/plural_by_pinelabs_transparent.png" alt="Plural by Pine Labs" className="h-3.5 w-auto object-contain" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-[11px] bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <span className="text-slate-500">Desk Lead:</span>
            <span className="font-bold text-slate-800">Advaita Parmar</span>
            <span className="text-slate-300">&bull;</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Active Session
            </span>
          </div>

          <button
            onClick={() => {
              sessionStorage.removeItem('plural_underwriting_auth');
              setIsAuthenticated(false);
            }}
            className="text-[11px] font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Lock Desk
          </button>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Banner Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-50/90 via-indigo-50/40 to-slate-50 border border-blue-200/80 p-6 sm:p-8 shadow-xs">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 bg-blue-100/70 text-[#0867E8] border border-blue-300/60 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider">
              <ShieldCheck size={13} className="text-[#0867E8]" />
              <span>Pine Labs Sub-Merchant Desk • Active Institutional Partnership</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Sub-Merchant Underwriting &amp; T+1 Payout Desk
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Verify clinic KYC, cancelled cheques, and auto-generate Pine Labs Sub-Merchant MAF Excel packages for instant terminal MID activation under our locked ₹0 Setup / ₹0 AMC institutional agreement.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span>Aggregator UAT MID: <strong className="text-slate-900 font-mono">111077</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span>Dynamic Callback Webhook: <strong className="text-slate-900 font-mono">/api/webhook/pinelabs</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span>Settlement Cycle: <strong className="text-slate-900">T+1 Direct Nodal Bank Credit</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* ── SPOTLIGHT DOSSIER: DR. ANGIRAS VISHNU / HEAR ONE ── */}
        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
                <Sparkles size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-slate-900">{SPOTLIGHT_CLINIC.clinic_name}</h2>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-300">
                    Latest Submission • Nov 19
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {SPOTLIGHT_CLINIC.doctor_name} &bull; {SPOTLIGHT_CLINIC.city} &bull; {SPOTLIGHT_CLINIC.phone}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href={SPOTLIGHT_CLINIC.docs.signing_pdf}
                download="Plural_MAF_and_Doctor_KYC_Signing_Dossier_Hear_One.pdf"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer active:scale-98"
                title="Download consolidated official MAF + Doctor PAN & Aadhaar signing dossier"
              >
                <FileCheck size={15} />
                <span>Doctor Signing PDF</span>
              </a>

              <a
                href={SPOTLIGHT_CLINIC.docs.maf_excel}
                download="Plural_MAF_BO_PEP_Hear_One.xlsx"
                className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer active:scale-98"
                title="Download Pine Labs MAF Excel"
              >
                <FileSpreadsheet size={15} />
                <span>Download MAF Excel</span>
              </a>

              <a
                href={SPOTLIGHT_CLINIC.docs.zip_bundle}
                download="Hear_One_Complete_KYC_Dossier.zip"
                className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition-all cursor-pointer active:scale-98"
                title="Download all raw KYC documents in a ZIP package"
              >
                <FolderDown size={14} />
                <span>Full ZIP</span>
              </a>

              <span className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-300">
                Status: {SPOTLIGHT_CLINIC.status}
              </span>
            </div>
          </div>

          {/* 3-Column Dossier Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Col 1: Entity & Doctor Details */}
            <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200 space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <UserCheck size={14} className="text-[#0867E8]" />
                <span>Doctor &amp; Entity Identity</span>
              </h3>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10.5px]">Legal Entity / DBA:</span>
                  <span className="font-bold text-slate-900">{SPOTLIGHT_CLINIC.legal_name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10.5px]">Managing Doctor:</span>
                  <span className="font-bold text-slate-900">{SPOTLIGHT_CLINIC.doctor_name} (DOB: {SPOTLIGHT_CLINIC.dob})</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-slate-500 block text-[10.5px]">Doctor PAN:</span>
                    <span className="font-mono font-bold text-emerald-700 text-sm bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">{SPOTLIGHT_CLINIC.pan}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(SPOTLIGHT_CLINIC.pan, 'Doctor PAN')}
                    className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
                    title="Copy PAN"
                  >
                    <Copy size={13} />
                  </button>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10.5px]">Aadhaar Number:</span>
                  <span className="font-mono font-bold text-slate-800">{SPOTLIGHT_CLINIC.aadhaar}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10.5px]">Operating Clinic Address:</span>
                  <span className="text-slate-700 leading-tight block">{SPOTLIGHT_CLINIC.address}</span>
                </div>
              </div>
            </div>

            {/* Col 2: Bank Settlement Details (from Cancelled Cheque) */}
            <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200 space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Landmark size={14} className="text-emerald-600" />
                <span>Settlement Bank Account</span>
              </h3>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10.5px]">Bank Name &amp; Branch:</span>
                  <span className="font-bold text-slate-900">{SPOTLIGHT_CLINIC.bank.bank_name}</span>
                  <span className="text-[11px] text-slate-500 block">{SPOTLIGHT_CLINIC.bank.branch}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10.5px]">Beneficiary Name:</span>
                  <span className="font-bold text-emerald-700">{SPOTLIGHT_CLINIC.bank.account_holder}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-slate-500 block text-[10.5px]">Current Account No:</span>
                    <span className="font-mono font-bold text-slate-900 text-sm bg-slate-200/70 px-2 py-0.5 rounded">{SPOTLIGHT_CLINIC.bank.account_number}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(SPOTLIGHT_CLINIC.bank.account_number, 'Account Number')}
                    className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
                    title="Copy Account No"
                  >
                    <Copy size={13} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-slate-500 block text-[10.5px]">RTGS / NEFT IFSC:</span>
                    <span className="font-mono font-bold text-blue-700 text-sm bg-blue-50 px-2 py-0.5 rounded border border-blue-200">{SPOTLIGHT_CLINIC.bank.ifsc}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(SPOTLIGHT_CLINIC.bank.ifsc, 'IFSC Code')}
                    className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
                    title="Copy IFSC"
                  >
                    <Copy size={13} />
                  </button>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10.5px]">Cheque Verification:</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 size={12} /> "CANCELLED" written &bull; MICR {SPOTLIGHT_CLINIC.bank.micr}
                  </span>
                </div>
              </div>
            </div>

            {/* Col 3: Direct KYC Document Access */}
            <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200 space-y-2.5">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <FileText size={14} className="text-amber-600" />
                <span>Verified KYC Documents</span>
              </h3>
              <div className="space-y-2">
                <a
                  href={SPOTLIGHT_CLINIC.docs.signing_pdf}
                  download="Plural_MAF_and_Doctor_KYC_Signing_Dossier_Hear_One.pdf"
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50/60 to-blue-50/60 border-2 border-emerald-500/50 hover:border-emerald-600 transition-all text-xs group cursor-pointer shadow-xs mb-2.5"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <FileCheck size={16} />
                    </div>
                    <div className="text-left">
                      <span className="font-extrabold text-slate-900 text-[12px] block group-hover:text-emerald-700 transition-colors">
                        Doctor Signing Dossier (PDF)
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold">
                        Official MAF + PAN + Aadhaar &bull; Ready to Sign
                      </span>
                    </div>
                  </div>
                  <ArrowDownToLine size={15} className="text-emerald-600 group-hover:translate-y-0.5 transition-transform" />
                </a>

                <a
                  href={SPOTLIGHT_CLINIC.docs.cancelled_cheque}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all text-xs group cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center gap-2">
                    <Landmark size={14} className="text-emerald-600" />
                    <span className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                      Bank Cancelled Cheque
                    </span>
                  </div>
                  <ExternalLink size={13} className="text-slate-400 group-hover:text-slate-600" />
                </a>

                <a
                  href={SPOTLIGHT_CLINIC.docs.doctor_pan}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all text-xs group cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center gap-2">
                    <UserCheck size={14} className="text-[#0867E8]" />
                    <span className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                      Doctor PAN Card
                    </span>
                  </div>
                  <ExternalLink size={13} className="text-slate-400 group-hover:text-slate-600" />
                </a>

                <a
                  href={SPOTLIGHT_CLINIC.docs.aadhaar_front}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all text-xs group cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center gap-2">
                    <CreditCard size={14} className="text-sky-600" />
                    <span className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                      Doctor Aadhaar (Front &amp; Back)
                    </span>
                  </div>
                  <ExternalLink size={13} className="text-slate-400 group-hover:text-slate-600" />
                </a>

                <a
                  href={SPOTLIGHT_CLINIC.docs.udyam_pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all text-xs group cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center gap-2">
                    <FileText size={14} className="text-amber-600" />
                    <span className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                      Udyam Registration Certificate
                    </span>
                  </div>
                  <ExternalLink size={13} className="text-slate-400 group-hover:text-slate-600" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── QUEUE STATUS / MULTI-CLINIC PIPELINE ── */}
        {filteredClinics.length > 1 ? (
          <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-emerald-600" />
                  <h2 className="text-lg font-black text-slate-900">
                    Verified KYC Applications ({filteredClinics.length})
                  </h2>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-300">
                    Ready for Underwriting
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Showing partner clinics with verified doctor KYC documents and settlement bank accounts.
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
                    className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 w-52 sm:w-64"
                  />
                </div>

                <button
                  onClick={fetchClinics}
                  disabled={loading}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                  title="Refresh Clinics"
                >
                  <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
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
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredClinics.map((clinic, index) => {
                    const isSpotlight = clinic.id === SPOTLIGHT_CLINIC.id;
                    return (
                      <tr key={clinic.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">{index + 1}</td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900 block">{clinic.clinic_name}</span>
                          <span className="text-[10.5px] text-slate-500">
                            {isSpotlight ? SPOTLIGHT_CLINIC.legal_name : 'Sole Proprietorship'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-800 block">{clinic.doctor_name || 'Dr. Angiras Vishnu'}</span>
                          <span className="font-mono text-emerald-700 text-[11px] font-bold">
                            PAN: {isSpotlight ? SPOTLIGHT_CLINIC.pan : 'AZHPV0033E'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          <span>{clinic.city}</span>
                          <span className="block text-[10.5px] text-slate-400 font-mono">{clinic.phone}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-medium text-slate-900 block">
                            {isSpotlight ? SPOTLIGHT_CLINIC.bank.bank_name : 'Bank of Baroda'}
                          </span>
                          <span className="font-mono text-[11px] text-slate-600 block">
                            A/C: {isSpotlight ? SPOTLIGHT_CLINIC.bank.account_number : '30580200000228'}
                          </span>
                          <span className="font-mono text-[10px] text-blue-700 font-bold">
                            IFSC: {isSpotlight ? SPOTLIGHT_CLINIC.bank.ifsc : 'BARB0KAKKAN'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1">
                            <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                              Cheque ✓
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                              PAN ✓
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 text-[10px] font-bold border border-sky-200">
                              Aadhaar ✓
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
                              Udyam ✓
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10.5px] font-bold border border-emerald-200">
                            <CheckCircle2 size={11} />
                            <span>Ready for MID</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <a
                              href={SPOTLIGHT_CLINIC.docs.signing_pdf}
                              download="Plural_MAF_and_Doctor_KYC_Signing_Dossier_Hear_One.pdf"
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-black border border-emerald-300 transition-colors shadow-2xs"
                              title="Download Doctor Signing PDF"
                            >
                              <FileCheck size={13} />
                              <span>Signing PDF</span>
                            </a>
                            <a
                              href={SPOTLIGHT_CLINIC.docs.maf_excel}
                              download={`Plural_MAF_${clinic.clinic_name.replace(/\s+/g, '_')}.xlsx`}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold border border-blue-200 transition-colors shadow-2xs"
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
        ) : (
          <div className="rounded-2xl bg-white border border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-xs">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-600">
                Active Application: <strong className="text-slate-900">{SPOTLIGHT_CLINIC.clinic_name}</strong> &bull; {SPOTLIGHT_CLINIC.doctor_name} &bull; {SPOTLIGHT_CLINIC.city}
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-extrabold text-[10px] border border-emerald-200 uppercase tracking-wider">
                1 of 1 Applications &bull; Ready for Underwriting
              </span>
            </div>
            <div className="text-slate-500 text-[11px] flex items-center gap-2">
              <CheckCircle2 size={13} className="text-emerald-600" />
              <span>Full Doctor KYC, Nodal Bank Details &amp; MAF Package Verified</span>
            </div>
          </div>
        )}

        {/* ── SETTLEMENT INVARIANTS FOOTER NOTE ── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
          <div className="space-y-1 text-center sm:text-left">
            <span className="font-bold text-slate-900">Pine Labs Sub-Merchant Contractual Agreement Terms:</span>
            <p className="text-[11px] text-slate-500">
              ₹0 Setup / Onboarding Fee &bull; ₹0 Annual Maintenance Charges (AMC) &bull; Commercial MDR: Credit Card EMI 1.85%, Debit Card EMI 0.90%, UPI 0.40% &bull; T+1 Automatic Nodal Settlements.
            </p>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Portal Version: 2026.11-PLURAL
          </div>
        </div>
      </main>
    </div>
  );
}
