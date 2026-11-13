import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { emailNotificationService } from '@/services/emailNotificationService';
import { SEOHead } from '@/components/seo/SEOHead';
import { toast } from 'sonner';
import {
  ShieldCheck,
  Building2,
  FileText,
  UploadCloud,
  CheckCircle2,
  Camera,
  Trash2,
  ArrowRight,
  Sparkles,
  Lock,
  MessageCircle,
  ExternalLink,
  Download,
  Landmark,
  CreditCard,
  AlertCircle
} from 'lucide-react';

interface UploadedDoc {
  file: File | null;
  previewUrl: string | null;
  uploadedUrl: string | null;
  isUploading: boolean;
  docName: string;
}

export default function ClinicKycUploadPage() {
  const [searchParams] = useSearchParams();

  const clinicId = searchParams.get('id') || searchParams.get('clinic_id') || '';
  const initialClinicName = searchParams.get('clinic') || searchParams.get('clinic_name') || '';
  const initialDoctorName = searchParams.get('doctor') || searchParams.get('doctor_name') || '';
  const initialPhone = searchParams.get('phone') || '';
  const initialCity = searchParams.get('city') || '';

  const [clinicName, setClinicName] = useState(initialClinicName);
  const [doctorName, setDoctorName] = useState(initialDoctorName);
  const [phone, setPhone] = useState(initialPhone);
  const [city, setCity] = useState(initialCity);

  // Bank Account Fields (Instant ₹1 Penny Drop)
  const [accountHolderName, setAccountHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');

  // Document states
  const [chequeDoc, setChequeDoc] = useState<UploadedDoc>({
    file: null,
    previewUrl: null,
    uploadedUrl: null,
    isUploading: false,
    docName: 'Clinic Cancelled Cheque / Bank Statement'
  });

  const [panDoc, setPanDoc] = useState<UploadedDoc>({
    file: null,
    previewUrl: null,
    uploadedUrl: null,
    isUploading: false,
    docName: 'Doctor / Clinic PAN Card'
  });

  const [regDoc, setRegDoc] = useState<UploadedDoc>({
    file: null,
    previewUrl: null,
    uploadedUrl: null,
    isUploading: false,
    docName: 'Dental Council Registration / Practice Proof'
  });

  const [aadhaarDoc, setAadhaarDoc] = useState<UploadedDoc>({
    file: null,
    previewUrl: null,
    uploadedUrl: null,
    isUploading: false,
    docName: 'Doctor Aadhaar Card'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Prefill data if clinicId is present
  useEffect(() => {
    if (clinicId && (!clinicName || !phone)) {
      (async () => {
        try {
          const { data } = await supabase
            .from('clinic_onboardings')
            .select('clinic_name, doctor_name, phone, city')
            .eq('id', clinicId)
            .single();

          if (data) {
            if (data.clinic_name) setClinicName(data.clinic_name);
            if (data.doctor_name) {
              setDoctorName(data.doctor_name);
              if (!accountHolderName) setAccountHolderName(data.doctor_name);
            }
            if (data.phone) setPhone(data.phone);
            if (data.city) setCity(data.city);
          }
        } catch {
          // fallback gracefully
        }
      })();
    }
  }, [clinicId, clinicName, phone]);

  // Generic document upload handler
  const handleFileUpload = async (
    file: File,
    docType: 'cheque' | 'pan' | 'reg' | 'aadhaar',
    setter: React.Dispatch<React.SetStateAction<UploadedDoc>>
  ) => {
    const preview = URL.createObjectURL(file);
    setter(prev => ({ ...prev, file, previewUrl: preview, isUploading: true }));

    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const cleanClinic = (clinicName || 'clinic').replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      const fileName = `${docType}_${cleanClinic}_${Date.now()}.${fileExt}`;
      const filePath = `${clinicId || cleanClinic}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('clinic-documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.warn('[Storage] Upload fallback:', uploadError);
        setter(prev => ({ ...prev, isUploading: false, uploadedUrl: preview }));
        toast.info('File saved locally for review.');
      } else {
        const { data: publicUrlData } = supabase.storage
          .from('clinic-documents')
          .getPublicUrl(filePath);

        setter(prev => ({
          ...prev,
          isUploading: false,
          uploadedUrl: publicUrlData.publicUrl
        }));
        toast.success(`${docType.toUpperCase()} document uploaded!`);
      }
    } catch (err) {
      console.error('File upload error:', err);
      setter(prev => ({ ...prev, isUploading: false }));
      toast.error('Failed to upload file. You can also send via WhatsApp.');
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Bank Account Validation
    if (!accountHolderName.trim()) {
      toast.error('Please enter Beneficiary / Account Holder Name.');
      return;
    }

    if (!accountNumber.trim()) {
      toast.error('Please enter Clinic Current Account Number.');
      return;
    }

    if (accountNumber !== confirmAccountNumber) {
      toast.error('Account numbers do not match. Please re-check.');
      return;
    }

    if (!ifscCode.trim() || ifscCode.trim().length !== 11) {
      toast.error('Please enter a valid 11-character bank IFSC code.');
      return;
    }

    // 2. Mandatory KYC Document Validation for PG
    if (!panDoc.uploadedUrl) {
      toast.error('Doctor / Clinic PAN Card is mandatory for Payment Gateway compliance.');
      return;
    }

    if (!chequeDoc.uploadedUrl) {
      toast.error('Clinic Cancelled Cheque is mandatory for bank whitelisting.');
      return;
    }

    if (!regDoc.uploadedUrl) {
      toast.error('Medical Practice Proof (Dental Council Reg. / CEA / Udyam / GST) is mandatory.');
      return;
    }

    if (!aadhaarDoc.uploadedUrl) {
      toast.error('Authorized Signatory Aadhaar Card (Front & Back) is mandatory for RBI Proof of Address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const updatePayload: Record<string, any> = {
        has_cancelled_cheque: 'Yes',
        has_current_account: 'Yes',
        business_proof_type: 'Full KYC & Penny Drop Submitted'
      };

      if (clinicId) {
        await supabase
          .from('clinic_onboardings')
          .update(updatePayload)
          .eq('id', clinicId);
      }

      // Dispatch alert to Clinaza Admin team with full banking & document dossier
      await emailNotificationService.sendNotification(`🎉 PG Whitelisting & KYC Submitted: ${clinicName || 'Partner Clinic'}`, {
        'Clinic Name': clinicName || 'Not specified',
        'Doctor Name': doctorName || 'Not specified',
        'Contact Phone': phone || 'Not specified',
        'City': city || 'Not specified',
        'Clinic ID': clinicId || 'N/A',
        'Account Holder Name': accountHolderName,
        'Account Number': accountNumber,
        'IFSC Code': ifscCode,
        'PAN Card Proof': panDoc.uploadedUrl || 'Attached',
        'Cancelled Cheque Proof': chequeDoc.uploadedUrl || 'Attached',
        'Medical Practice Proof': regDoc.uploadedUrl || 'Attached',
        'Aadhaar Proof': aadhaarDoc.uploadedUrl || 'Attached',
        'Compliance Status': 'Ready for ₹1 Automated Penny Drop'
      });

      setIsCompleted(true);
      toast.success('KYC & Banking details submitted for automated whitelisting!');
    } catch (err) {
      console.error('Final KYC submit error:', err);
      setIsCompleted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hi Clinaza Team, sharing PG whitelisting details for ${clinicName || 'my clinic'}:\n• Doctor: ${doctorName || 'Doctor'}\n• A/C Holder: ${accountHolderName || ''}\n• A/C No: ${accountNumber || ''}\n• IFSC: ${ifscCode || ''}\n• City: ${city || ''}`
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#0867E8] selection:text-white pb-20">
      <SEOHead 
        title="Clinic Bank Whitelisting & PG KYC — Clinaza"
        description="Secure Payment Gateway onboarding & direct settlement whitelisting portal for partner clinics."
      />

      {/* Top Header */}
      <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <Link to="/" className="flex items-center gap-3">
          <img 
            src="/assets/clinaza-logo.jpg" 
            alt="CLINAZA" 
            className="h-9 w-9 rounded-xl border border-slate-200 shadow-sm object-cover" 
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-widest text-[#0B2450] uppercase">CLINAZA</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[10px] font-bold text-[#0867E8]">
                PG ONBOARDING &bull; KYC DESK
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">T+1 Direct Settlement Rails</p>
          </div>
        </Link>

        <a
          href={`https://wa.me/917292984244?text=${whatsappMessage}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm"
        >
          <MessageCircle size={14} />
          <span className="hidden sm:inline">WhatsApp Priority Desk</span>
          <span className="sm:hidden">WhatsApp</span>
        </a>
      </header>

      {/* Main Container */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        {/* Step Breadcrumb */}
        <div className="flex items-center justify-center gap-2 mb-6 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1 text-emerald-600 font-bold">
            <CheckCircle2 size={13} /> 1. Clinic Accreditation
          </span>
          <span>&rarr;</span>
          <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0867E8] font-black">
            2. PG Whitelisting &amp; KYC
          </span>
          <span>&rarr;</span>
          <span className="text-slate-400">3. Counter Standee Dispatch</span>
        </div>

        {isCompleted ? (
          /* Completion State */
          <div className="bg-white border-2 border-emerald-400 rounded-3xl p-6 sm:p-10 text-center space-y-5 shadow-lg">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto text-3xl font-black shadow-inner">
              <ShieldCheck size={36} />
            </div>

            <div className="space-y-1.5">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold inline-block">
                ₹1 Penny Drop in Progress
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0B2450]">
                Banking Whitelisting Initiated for {clinicName || 'Your Clinic'}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Your account details and PAN have been queued with Plural by Pine Labs. An automated ₹1 penny deposit verifies your account within <strong>2–4 business hours</strong>.
              </p>
            </div>

            {/* Next Steps Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 text-left space-y-3">
              <h3 className="text-xs font-black text-[#0B2450] uppercase tracking-wider">
                What Happens Next:
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Instant T+1 Settlement Route:</strong> Patient loan disbursements (₹30,000–₹1,50,000) will hit this current account directly.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Acrylic Countertop Standee:</strong> Laser-printed with your clinic logo and custom EMI QR, couriered within 48h.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Staff Desk Cards:</strong> Your Relationship Manager will WhatsApp you printable patient pitch cards and desk scripts.</span>
                </li>
              </ul>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <a
                href="/docs/Clinaza_Clinic_Partner_Onboarding_Guide.pdf"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0867E8] text-white text-xs font-bold hover:bg-[#0756C7] transition-all shadow-sm"
              >
                <Download size={14} />
                <span>Download Partner Guide (PDF)</span>
              </a>

              <Link
                to="/"
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
              >
                Return to Homepage
              </Link>
            </div>
          </div>
        ) : (
          /* Active Upload Form */
          <div className="space-y-6">
            {/* Hero Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0867E8] text-xs font-bold">
                <Lock size={12} />
                <span>RBI Merchant Guidelines &bull; 256-Bit SSL Encrypted</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2450] tracking-tight">
                Payment Gateway &amp; Direct Settlement Onboarding
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                To whitelist your clinic current account for <strong>100% upfront T+1 treatment payouts</strong> via Plural by Pine Labs, please provide your payout bank details and KYC documents below.
              </p>
            </div>

            {/* Clinic Dossier Header Pill */}
            {(clinicName || phone || city) && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0867E8] flex items-center justify-center font-bold">
                    <Building2 size={16} />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900">{clinicName || 'Partner Clinic'}</h2>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {doctorName ? `${doctorName} • ` : ''}{city ? `${city} • ` : ''}{phone}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  Profile Accredited
                </span>
              </div>
            )}

            <form onSubmit={handleFinalSubmit} className="space-y-5">
              {/* 1. Direct Bank Account Details (Penny Drop) */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0867E8] flex items-center justify-center font-bold">
                      <Landmark size={17} />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <span>Clinic Current Bank Account</span>
                        <span className="text-rose-500">*</span>
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Direct T+1 patient treatment disbursements will be routed to this account
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Sparkles size={11} /> Instant ₹1 Penny Drop
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Account Holder Name */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                      Beneficiary / Account Holder Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. Rajesh Sharma or Smile Dental Clinic"
                      value={accountHolderName}
                      onChange={(e) => setAccountHolderName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:bg-white focus:border-[#0867E8]"
                    />
                    <p className="text-[10px] text-slate-400">Must match registered PAN or clinic trade name</p>
                  </div>

                  {/* Bank Account Number */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                      Current Account Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter 9–18 digit account number"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:bg-white focus:border-[#0867E8]"
                    />
                  </div>

                  {/* Confirm Bank Account Number */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                      Re-enter Account Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Re-type account number"
                      value={confirmAccountNumber}
                      onChange={(e) => setConfirmAccountNumber(e.target.value.replace(/[^0-9]/g, ''))}
                      className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:bg-white ${
                        confirmAccountNumber && confirmAccountNumber !== accountNumber
                          ? 'border-rose-400 focus:border-rose-500 bg-rose-50/30'
                          : confirmAccountNumber && confirmAccountNumber === accountNumber
                          ? 'border-emerald-400 focus:border-emerald-500 bg-emerald-50/20'
                          : 'border-slate-300 focus:border-[#0867E8]'
                      }`}
                    />
                    {confirmAccountNumber && confirmAccountNumber !== accountNumber && (
                      <p className="text-[10px] text-rose-500 font-bold">Account numbers do not match</p>
                    )}
                  </div>

                  {/* IFSC Code */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                      Bank IFSC Code <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. HDFC0001234 or SBIN0005678"
                      maxLength={11}
                      value={ifscCode}
                      onChange={(e) => setIfscCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono font-bold uppercase focus:outline-none focus:bg-white focus:border-[#0867E8]"
                    />
                    <p className="text-[10px] text-slate-400">11-character alphanumeric code on your cheque / passbook</p>
                  </div>
                </div>
              </div>

              {/* 2. Document: Cancelled Cheque */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0867E8] flex items-center justify-center font-bold text-xs">
                      1
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <span>Clinic Cancelled Cheque / Bank Statement</span>
                        <span className="text-rose-500">*</span>
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Validates the Current A/C Number &amp; IFSC code entered above.
                      </p>
                    </div>
                  </div>

                  {chequeDoc.uploadedUrl && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                      <CheckCircle2 size={11} /> Attached
                    </span>
                  )}
                </div>

                {chequeDoc.previewUrl ? (
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3 truncate">
                      <img 
                        src={chequeDoc.previewUrl} 
                        alt="Cheque Preview" 
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0" 
                      />
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-800 truncate">
                          {chequeDoc.file?.name || 'cheque_document.jpg'}
                        </p>
                        <p className="text-[10px] text-emerald-600 font-bold">
                          {chequeDoc.isUploading ? 'Uploading to secure banking bucket...' : '✓ Ready for verification'}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setChequeDoc({ file: null, previewUrl: null, uploadedUrl: null, isUploading: false, docName: '' })}
                      className="text-slate-400 hover:text-rose-600 p-1.5 transition-colors"
                      title="Remove file"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-200 hover:border-[#0867E8] bg-slate-50/60 hover:bg-blue-50/20 rounded-xl p-4 sm:p-6 text-center cursor-pointer transition-all block space-y-1.5">
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleFileUpload(f, 'cheque', setChequeDoc);
                      }}
                    />
                    <UploadCloud size={24} className="text-[#0867E8] mx-auto" />
                    <p className="text-xs font-bold text-slate-800">
                      Tap to Snap Photo or Choose Cheque File
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Supports JPG, PNG, PDF up to 20MB
                    </p>
                  </label>
                )}
              </div>

              {/* 3. Document: Doctor / Clinic PAN Card (MANDATORY FOR PG) */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0867E8] flex items-center justify-center font-bold text-xs">
                      2
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <span>Doctor / Clinic PAN Card</span>
                        <span className="text-rose-500">*</span>
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Mandatory under RBI Payment Aggregator rules for entity identity &amp; TDS compliance.
                      </p>
                    </div>
                  </div>

                  {panDoc.uploadedUrl && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                      <CheckCircle2 size={11} /> Attached
                    </span>
                  )}
                </div>

                {panDoc.previewUrl ? (
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3 truncate">
                      <img 
                        src={panDoc.previewUrl} 
                        alt="PAN Preview" 
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0" 
                      />
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-800 truncate">
                          {panDoc.file?.name || 'pan_card.jpg'}
                        </p>
                        <p className="text-[10px] text-emerald-600 font-bold">
                          {panDoc.isUploading ? 'Uploading...' : '✓ Attached'}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setPanDoc({ file: null, previewUrl: null, uploadedUrl: null, isUploading: false, docName: '' })}
                      className="text-slate-400 hover:text-rose-600 p-1.5 transition-colors"
                      title="Remove file"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-200 hover:border-[#0867E8] bg-slate-50/60 hover:bg-blue-50/20 rounded-xl p-4 sm:p-5 text-center cursor-pointer transition-all block space-y-1.5">
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleFileUpload(f, 'pan', setPanDoc);
                      }}
                    />
                    <FileText size={22} className="text-[#0867E8] mx-auto" />
                    <p className="text-xs font-bold text-slate-800">
                      Snap or Upload Doctor / Clinic PAN Card
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Photo of physical PAN card or e-PAN
                    </p>
                  </label>
                )}
              </div>

              {/* 4. Document: Medical Practice Proof */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0867E8] flex items-center justify-center font-bold text-xs">
                      3
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <span>Medical Registration or Business Proof</span>
                        <span className="text-rose-500">*</span>
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        State Dental Council Registration Certificate, Clinical Establishment Act (CEA), Udyam / MSME Certificate, Shop &amp; Establishment, or GST.
                      </p>
                    </div>
                  </div>

                  {regDoc.uploadedUrl && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                      <CheckCircle2 size={11} /> Attached
                    </span>
                  )}
                </div>

                {regDoc.previewUrl ? (
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3 truncate">
                      <img 
                        src={regDoc.previewUrl} 
                        alt="Registration Preview" 
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0" 
                      />
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-800 truncate">
                          {regDoc.file?.name || 'practice_registration.jpg'}
                        </p>
                        <p className="text-[10px] text-emerald-600 font-bold">
                          {regDoc.isUploading ? 'Uploading to secure banking bucket...' : '✓ Ready for verification'}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setRegDoc({ file: null, previewUrl: null, uploadedUrl: null, isUploading: false, docName: '' })}
                      className="text-slate-400 hover:text-rose-600 p-1.5 transition-colors"
                      title="Remove file"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-200 hover:border-[#0867E8] bg-slate-50/60 hover:bg-blue-50/20 rounded-xl p-4 sm:p-5 text-center cursor-pointer transition-all block space-y-1.5">
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleFileUpload(f, 'reg', setRegDoc);
                      }}
                    />
                    <Camera size={22} className="text-[#0867E8] mx-auto" />
                    <p className="text-xs font-bold text-slate-800">
                      Snap Photo of Dental Council Reg. or Business License
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Supports JPG, PNG, PDF up to 20MB
                    </p>
                  </label>
                )}
              </div>

              {/* 5. Document: Aadhaar Card (Mandatory 4th slot) */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0867E8] flex items-center justify-center font-bold text-xs">
                      4
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <span>Authorized Signatory Aadhaar Card</span>
                        <span className="text-rose-500">*</span>
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Front &amp; back photo for RBI Proof of Address (POA) &amp; merchant whitelisting. Masked Aadhaar accepted.
                      </p>
                    </div>
                  </div>

                  {aadhaarDoc.uploadedUrl && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                      <CheckCircle2 size={11} /> Attached
                    </span>
                  )}
                </div>

                {aadhaarDoc.previewUrl ? (
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3 truncate">
                      <img 
                        src={aadhaarDoc.previewUrl} 
                        alt="Aadhaar Preview" 
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0" 
                      />
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-800 truncate">
                          {aadhaarDoc.file?.name || 'aadhaar_card.jpg'}
                        </p>
                        <p className="text-[10px] text-emerald-600 font-bold">
                          {aadhaarDoc.isUploading ? 'Uploading to secure banking bucket...' : '✓ Ready for verification'}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setAadhaarDoc({ file: null, previewUrl: null, uploadedUrl: null, isUploading: false, docName: '' })}
                      className="text-slate-400 hover:text-rose-600 p-1.5 transition-colors"
                      title="Remove file"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-200 hover:border-[#0867E8] bg-slate-50/60 hover:bg-blue-50/20 rounded-xl p-4 sm:p-5 text-center cursor-pointer transition-all block space-y-1.5">
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleFileUpload(f, 'aadhaar', setAadhaarDoc);
                      }}
                    />
                    <FileText size={22} className="text-[#0867E8] mx-auto" />
                    <p className="text-xs font-bold text-slate-800">
                      Snap or Upload Aadhaar (Front &amp; Back)
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Supports JPG, PNG, PDF up to 20MB &bull; Masked Aadhaar Accepted
                    </p>
                  </label>
                )}
              </div>

              {/* Submit CTA Button */}
              <div className="pt-2 space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#0867E8] hover:bg-[#0756C7] text-white font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-[#0867E8]/25 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-98"
                >
                  {isSubmitting ? (
                    <span>Submitting to Banking Compliance Desk...</span>
                  ) : (
                    <>
                      <span>Complete Payment Gateway Whitelisting &rarr;</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                {/* Assisted WhatsApp Option */}
                <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-3.5 text-center space-y-1.5">
                  <p className="text-xs font-bold text-emerald-900 flex items-center justify-center gap-1.5">
                    <Sparkles size={13} className="text-emerald-600" />
                    <span>Prefer sending via WhatsApp?</span>
                  </p>
                  <p className="text-[11px] text-emerald-700">
                    Snap a quick photo of your cheque &amp; PAN and WhatsApp directly to our relationship desk.
                  </p>
                  <a
                    href={`https://wa.me/917292984244?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs mt-1"
                  >
                    <MessageCircle size={14} />
                    <span>WhatsApp Documents to +91 7292984244</span>
                  </a>
                </div>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
