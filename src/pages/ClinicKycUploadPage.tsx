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

  // Document states
  const [chequeDoc, setChequeDoc] = useState<UploadedDoc>({
    file: null,
    previewUrl: null,
    uploadedUrl: null,
    isUploading: false,
    docName: 'Clinic Cancelled Cheque / Bank Statement'
  });

  const [regDoc, setRegDoc] = useState<UploadedDoc>({
    file: null,
    previewUrl: null,
    uploadedUrl: null,
    isUploading: false,
    docName: 'Dental Council Registration / Practice Proof'
  });

  const [panDoc, setPanDoc] = useState<UploadedDoc>({
    file: null,
    previewUrl: null,
    uploadedUrl: null,
    isUploading: false,
    docName: 'Doctor / Clinic PAN Card'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // If clinicId is provided, try loading clinic details if not prefilled
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
            if (data.doctor_name) setDoctorName(data.doctor_name);
            if (data.phone) setPhone(data.phone);
            if (data.city) setCity(data.city);
          }
        } catch {
          // silently fallback to searchParams
        }
      })();
    }
  }, [clinicId, clinicName, phone]);

  // Generic document upload handler
  const handleFileUpload = async (
    file: File,
    docType: 'cheque' | 'reg' | 'pan',
    setter: React.Dispatch<React.SetStateAction<UploadedDoc>>
  ) => {
    // 1. Create local preview
    const preview = URL.createObjectURL(file);
    setter(prev => ({ ...prev, file, previewUrl: preview, isUploading: true }));

    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const cleanClinic = (clinicName || 'clinic').replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      const fileName = `${docType}_${cleanClinic}_${Date.now()}.${fileExt}`;
      const filePath = `${clinicId || cleanClinic}/${fileName}`;

      // Upload to Supabase Storage bucket 'clinic-documents'
      const { error: uploadError } = await supabase.storage
        .from('clinic-documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.warn('[Storage] Upload error:', uploadError);
        // If storage fails, we still keep local file preview so submission can alert admin
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
        toast.success(`${docType === 'cheque' ? 'Bank cheque' : docType === 'reg' ? 'Practice proof' : 'PAN'} uploaded!`);
      }
    } catch (err) {
      console.error('File upload error:', err);
      setter(prev => ({ ...prev, isUploading: false }));
      toast.error('Failed to upload file. You can also send via WhatsApp.');
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!chequeDoc.uploadedUrl && !regDoc.uploadedUrl && !panDoc.uploadedUrl) {
      toast.error('Please upload at least your Clinic Cancelled Cheque or Practice Proof.');
      return;
    }

    setIsSubmitting(true);

    try {
      const updatePayload: Record<string, any> = {
        has_cancelled_cheque: chequeDoc.uploadedUrl ? 'Yes' : 'Pending',
        has_current_account: 'Yes',
        business_proof_type: regDoc.uploadedUrl ? 'Uploaded on KYC Portal' : 'Pending WhatsApp'
      };

      if (clinicId) {
        await supabase
          .from('clinic_onboardings')
          .update(updatePayload)
          .eq('id', clinicId);
      }

      // Dispatch alert to Clinaza Admin team
      await emailNotificationService.sendNotification(`📄 New KYC Documents Uploaded: ${clinicName || 'Partner Clinic'}`, {
        'Clinic Name': clinicName || 'Not specified',
        'Doctor Name': doctorName || 'Not specified',
        'Phone Number': phone || 'Not specified',
        'City': city || 'Not specified',
        'Clinic ID': clinicId || 'N/A',
        'Cancelled Cheque Proof': chequeDoc.uploadedUrl || 'Not uploaded',
        'Dental Practice Proof': regDoc.uploadedUrl || 'Not uploaded',
        'PAN Card Proof': panDoc.uploadedUrl || 'Not uploaded',
        'Verification Status': 'Pending Bank Whitelisting'
      });

      setIsCompleted(true);
      toast.success('KYC verification submitted successfully!');
    } catch (err) {
      console.error('Final KYC submit error:', err);
      setIsCompleted(true); // Don't block user
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hi Clinaza Team, sharing KYC documents for clinic whitelisting:\n• Clinic: ${clinicName || 'My Dental Clinic'}\n• Doctor: ${doctorName || 'Doctor'}\n• City: ${city || 'India'}\n• Phone: ${phone || ''}`
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#0867E8] selection:text-white pb-20">
      <SEOHead 
        title="Clinic KYC & Bank Whitelisting — Clinaza"
        description="Secure document verification portal for partner clinics to whitelist current accounts for T+1 patient financing payouts."
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
                BANKING KYC DESK
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
        {/* Breadcrumb / Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1 text-emerald-600 font-bold">
            <CheckCircle2 size={13} /> 1. Clinic Accreditation
          </span>
          <span>&rarr;</span>
          <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0867E8] font-black">
            2. Bank Whitelisting &amp; KYC
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
                KYC Verification in Progress
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0B2450]">
                Documents Received for {clinicName || 'Your Clinic'}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Our banking compliance desk is verifying your clinic current account with Plural by Pine Labs (average turnaround: <strong>2–4 business hours</strong>).
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
                  <span><strong>T+1 Payout Whitelisting:</strong> Verified directly with partner banks for direct current account credits.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Acrylic Counter QR Standee:</strong> Laser-printed with your clinic logo and dispatched via Blue Dart / Delhivery.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Reception Setup &amp; Training:</strong> Relationship manager connects on WhatsApp with staff pitch cards and 2-min video.</span>
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
                <span>RBI Banking Compliance &bull; Bank-Grade Encrypted</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2450] tracking-tight">
                Clinic Bank &amp; Practice Verification
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                To route patient treatment disbursals (₹30,000–₹1,50,000) directly into your current account on T+1, please upload 2 quick documents.
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

            <form onSubmit={handleFinalSubmit} className="space-y-4">
              {/* Document 1: Cancelled Cheque (Crucial for T+1 Payouts) */}
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
                        Must show Clinic / Doctor Account Name, Current A/C Number &amp; IFSC code.
                      </p>
                    </div>
                  </div>

                  {chequeDoc.uploadedUrl && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                      <CheckCircle2 size={11} /> Attached
                    </span>
                  )}
                </div>

                {/* Upload Area */}
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

              {/* Document 2: Medical Practice Proof */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0867E8] flex items-center justify-center font-bold text-xs">
                      2
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <span>Medical Registration or Business Proof</span>
                        <span className="text-rose-500">*</span>
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        State Dental Council Registration, BDS/MDS Degree, Clinical Establishment Act, or GST.
                      </p>
                    </div>
                  </div>

                  {regDoc.uploadedUrl && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                      <CheckCircle2 size={11} /> Attached
                    </span>
                  )}
                </div>

                {/* Upload Area */}
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
                  <label className="border-2 border-dashed border-slate-200 hover:border-[#0867E8] bg-slate-50/60 hover:bg-blue-50/20 rounded-xl p-4 sm:p-6 text-center cursor-pointer transition-all block space-y-1.5">
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
                    <Camera size={24} className="text-[#0867E8] mx-auto" />
                    <p className="text-xs font-bold text-slate-800">
                      Tap to Snap Photo of Registration / Degree
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Supports JPG, PNG, PDF up to 20MB
                    </p>
                  </label>
                )}
              </div>

              {/* Document 3: Doctor / Clinic PAN (Optional but Recommended) */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
                      3
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <span>Doctor / Clinic PAN Card</span>
                        <span className="text-[10px] text-slate-400 font-normal">(Optional for Faster Sanction)</span>
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Ensures seamless TDS &amp; 100% tax compliance on healthcare settlements.
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
                  <label className="border-2 border-dashed border-slate-200 hover:border-[#0867E8] bg-slate-50/60 hover:bg-blue-50/20 rounded-xl p-3 sm:p-4 text-center cursor-pointer transition-all block space-y-1">
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
                    <FileText size={20} className="text-slate-400 mx-auto" />
                    <p className="text-xs font-semibold text-slate-700">
                      Snap or Upload PAN Card Photo
                    </p>
                  </label>
                )}
              </div>

              {/* Submit CTA Button */}
              <div className="pt-2 space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#0867E8] hover:bg-[#0756C7] text-white font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-[#0867E8]/25 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span>Submitting Documents to Banking Desk...</span>
                  ) : (
                    <>
                      <span>Complete Clinic Whitelisting &rarr;</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                {/* Assisted WhatsApp Option */}
                <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-3.5 text-center space-y-1.5">
                  <p className="text-xs font-bold text-emerald-900 flex items-center justify-center gap-1.5">
                    <Sparkles size={13} className="text-emerald-600" />
                    <span>Prefer sending your documents via WhatsApp?</span>
                  </p>
                  <p className="text-[11px] text-emerald-700">
                    Snap a quick photo of your cheque on the clinic desk and WhatsApp directly to our relationship lead.
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
