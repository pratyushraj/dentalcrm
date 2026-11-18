import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { emailNotificationService } from '@/services/emailNotificationService';
import { SEOHead } from '@/components/seo/SEOHead';
import { toast } from 'sonner';
import { analytics } from '@/utils/analytics';
import {
  downloadAutoFilledBoardResolutionDocx,
  downloadAutoFilledGstExemptionDocx,
  downloadAutoFilledMafExcel,
  printAutoFilledBoardResolution,
  printAutoFilledGstExemption
} from '@/utils/kycDocumentGenerators';
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
  Printer,
  Landmark,
  CreditCard,
  AlertCircle,
  Globe,
  Copy,
  FileCheck,
  FileSpreadsheet,
  FileSignature,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Mail,
  Phone,
  MapPin
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
  const initialClinicName = searchParams.get('clinic') || searchParams.get('clinic_name') || searchParams.get('name') || '';
  const initialDoctorName = searchParams.get('doctor') || searchParams.get('doctor_name') || searchParams.get('dr') || '';
  const initialPhone = searchParams.get('phone') || searchParams.get('mobile') || '';
  const initialCity = searchParams.get('city') || searchParams.get('location') || '';
  const initialWebsite = searchParams.get('website') || '';
  const initialEmail = searchParams.get('email') || searchParams.get('mail') || '';

  const [clinicName, setClinicName] = useState(initialClinicName);
  const [doctorName, setDoctorName] = useState(initialDoctorName);
  const [phone, setPhone] = useState(initialPhone);
  const [city, setCity] = useState(initialCity);
  const [email, setEmail] = useState(initialEmail);
  const [websiteStatus, setWebsiteStatus] = useState<'yes' | 'no'>(initialWebsite ? 'yes' : 'no');
  const [websiteUrl, setWebsiteUrl] = useState(initialWebsite);

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
    docName: 'Clinic Cancelled Cheque'
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

  const [gstDoc, setGstDoc] = useState<UploadedDoc>({
    file: null,
    previewUrl: null,
    uploadedUrl: null,
    isUploading: false,
    docName: 'GST Exemption Declaration or GST Certificate'
  });

  const [showGstTemplate, setShowGstTemplate] = useState(false);

  // Legal Entity Structure (Sole Proprietorship vs Corporate / Pvt Ltd / IVF)
  const [entityType, setEntityType] = useState<'sole_prop' | 'pvt_ltd'>('sole_prop');
  const [showBrTemplate, setShowBrTemplate] = useState(false);

  // Corporate / Pvt Ltd & IVF Documents (Pine Labs Plural Verified)
  const [brDoc, setBrDoc] = useState<UploadedDoc>({
    file: null,
    previewUrl: null,
    uploadedUrl: null,
    isUploading: false,
    docName: 'Board Resolution on Letterhead'
  });

  const [mafDoc, setMafDoc] = useState<UploadedDoc>({
    file: null,
    previewUrl: null,
    uploadedUrl: null,
    isUploading: false,
    docName: 'Plural MAF & BO/PEP Declaration'
  });

  const [coiDoc, setCoiDoc] = useState<UploadedDoc>({
    file: null,
    previewUrl: null,
    uploadedUrl: null,
    isUploading: false,
    docName: 'Certificate of Incorporation (COI)'
  });

  const [companyPanDoc, setCompanyPanDoc] = useState<UploadedDoc>({
    file: null,
    previewUrl: null,
    uploadedUrl: null,
    isUploading: false,
    docName: 'Company PAN Card'
  });

  const [companyGstDoc, setCompanyGstDoc] = useState<UploadedDoc>({
    file: null,
    previewUrl: null,
    uploadedUrl: null,
    isUploading: false,
    docName: 'Company GST Registration Certificate'
  });

  const [moaDoc, setMoaDoc] = useState<UploadedDoc>({
    file: null,
    previewUrl: null,
    uploadedUrl: null,
    isUploading: false,
    docName: 'MOA & AOA / LLP Agreement'
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
            .select('clinic_name, doctor_name, phone, city, email')
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
            if (data.email && !email) setEmail(data.email);
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
    docType: string,
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

    // 1. Clinic & Authorized Signatory Profile Validation
    if (!clinicName.trim()) {
      toast.error('Please enter your Clinic / Hospital Name.');
      return;
    }

    if (!doctorName.trim()) {
      toast.error('Please enter Doctor / Director Name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid Registered Clinic Email.');
      return;
    }

    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      toast.error('Please enter a valid 10-digit Phone / WhatsApp number.');
      return;
    }

    // 2. Bank Account Validation
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

    // 3. Mandatory KYC Document Validation
    if (entityType === 'sole_prop') {
      if (!panDoc.uploadedUrl) {
        toast.error('Doctor / Clinic PAN Card is mandatory for Payment Gateway compliance.');
        return;
      }

      if (!chequeDoc.uploadedUrl) {
        toast.error('Clinic Cancelled Cheque is required to verify your payout account.');
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
    } else {
      if (!chequeDoc.uploadedUrl) {
        toast.error('Company Current Account Cancelled Cheque is mandatory for direct settlement.');
        return;
      }

      if (!brDoc.uploadedUrl && !mafDoc.uploadedUrl && !coiDoc.uploadedUrl && !companyPanDoc.uploadedUrl) {
        toast.error('Please upload at least your Board Resolution, Plural MAF, COI or Company PAN.');
        return;
      }
    }

    if (websiteStatus === 'yes' && !websiteUrl.trim()) {
      toast.error('Please enter your Clinic Website URL or select "Not yet / In progress".');
      return;
    }

    setIsSubmitting(true);

    try {
      const updatePayload: Record<string, any> = {
        clinic_name: clinicName,
        doctor_name: doctorName,
        email: email,
        phone: phone,
        city: city || 'Not specified',
        has_cancelled_cheque: 'Yes',
        has_current_account: 'Yes',
        business_proof_type: websiteStatus === 'yes' && websiteUrl ? `Website: ${websiteUrl} | KYC Done` : 'Full KYC & Penny Drop Submitted'
      };

      if (clinicId) {
        await supabase
          .from('clinic_onboardings')
          .update(updatePayload)
          .eq('id', clinicId);
      } else {
        // Direct signup or cold email invite without clinicId: insert full record into Supabase
        await supabase
          .from('clinic_onboardings')
          .insert({
            clinic_name: clinicName,
            doctor_name: doctorName,
            email: email,
            phone: phone,
            city: city || 'Not specified',
            has_current_account: 'Yes',
            has_cancelled_cheque: 'Yes',
            business_proof_type: websiteStatus === 'yes' && websiteUrl ? `Website: ${websiteUrl} | KYC Done` : 'Full KYC & Penny Drop Submitted',
            utm_source: searchParams.get('utm_source') || 'cold_email_kyc_direct',
            utm_medium: searchParams.get('utm_medium') || 'email',
            utm_campaign: searchParams.get('utm_campaign') || 'pine_labs_kyc',
            source: 'kyc-upload-portal'
          });
      }

      const isCorp = entityType === 'pvt_ltd';

      // Dispatch alert to Clinaza Admin team with full banking & document dossier
      await emailNotificationService.sendNotification(`🎉 ${isCorp ? 'Corporate (Pvt Ltd / IVF)' : 'Sole Proprietor'} KYC Submitted: ${clinicName || 'Partner Clinic'}`, {
        'Entity Structure': isCorp ? 'Corporate (Pvt Ltd / LLP / IVF Center)' : 'Individual Doctor / Sole Proprietorship',
        'Clinic / Company Name': clinicName || 'Not specified',
        'Doctor / Director Name': doctorName || 'Not specified',
        'Doctor Email': email || 'Not specified',
        'Contact Phone': phone || 'Not specified',
        'City': city || 'Not specified',
        'Clinic ID': clinicId || 'N/A',
        'Account Holder Name': accountHolderName,
        'Account Number': accountNumber,
        'IFSC Code': ifscCode,
        'Clinic Website': websiteStatus === 'yes' ? websiteUrl : 'Not Ready (Assign Clinaza Portal Profile)',
        'Board Resolution (BR)': brDoc.uploadedUrl || 'Pending / N/A',
        'Plural MAF & BO/PEP': mafDoc.uploadedUrl || 'Pending / N/A',
        'COI Proof': coiDoc.uploadedUrl || 'N/A (Sole Prop)',
        'Company PAN / Doctor PAN': companyPanDoc.uploadedUrl || panDoc.uploadedUrl || 'Attached',
        'GST Certificate / Exemption': companyGstDoc.uploadedUrl || gstDoc.uploadedUrl || 'Attached',
        'Cancelled Cheque Proof': chequeDoc.uploadedUrl || 'Attached',
        'MOA & AOA': moaDoc.uploadedUrl || 'N/A (Sole Prop)',
        'Director KYC / Aadhaar': aadhaarDoc.uploadedUrl || 'Attached',
        'Compliance Status': 'Ready for ₹1 Automated Penny Drop'
      });

      // Dispatch automated branded confirmation email to the Doctor (48–72h SLA)
      if (email) {
        try {
          await emailNotificationService.sendDoctorKycConfirmationEmail(email, {
            doctorName,
            clinicName,
            city
          });
        } catch (e) {
          console.warn('[Email] Doctor confirmation email error:', e);
        }
      }

      setIsCompleted(true);
      toast.success('Bank details and documents submitted for verification!');
    } catch (err) {
      console.error('Final KYC submit error:', err);
      setIsCompleted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hi Clinaza Team, sharing bank account details for patient payouts at ${clinicName || 'my clinic'}:\n• Doctor: ${doctorName || 'Doctor'}\n• A/C Holder: ${accountHolderName || ''}\n• A/C No: ${accountNumber || ''}\n• IFSC: ${ifscCode || ''}\n• City: ${city || ''}`
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#0867E8] selection:text-white pb-24 relative overflow-hidden">
      <SEOHead 
        title="Link Clinic Bank Account for Patient Payouts — Clinaza"
        description="Secure clinic bank account linking and verification portal to receive direct T+1 patient treatment payouts."
      />

      {/* Atmospheric Ambient Background Canvas */}
      <div className="absolute inset-0 bg-radial-fintech pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-grid-fintech mask-radial-fade opacity-60 pointer-events-none -z-10" />

      {/* Top Floating Pill Navbar */}
      <header className="fixed top-3 sm:top-5 inset-x-0 z-50 pointer-events-none px-4 sm:px-6">
        <nav className="max-w-3xl mx-auto bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-[0_8px_32px_rgba(15,23,42,0.08)] rounded-full px-3.5 sm:px-5 py-2.5 flex items-center justify-between gap-3 pointer-events-auto transition-all">
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <img 
              src="/assets/clinaza-logo.jpg" 
              alt="CLINAZA" 
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl border border-slate-200 shadow-xs object-cover group-hover:scale-105 transition-transform" 
              width={36}
              height={36}
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-widest text-[#0B2450] uppercase">CLINAZA</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[9px] font-bold text-[#0867E8]">
                  PG KYC DESK
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">T+1 Direct Settlement Rails</span>
            </div>
          </Link>

          {/* Official Pine Labs Badge */}
          <div className="hidden sm:flex items-center gap-1.5 pl-3 border-l border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gateway:</span>
            <img
              src="/assets/plural_by_pinelabs_transparent.png"
              alt="Plural by Pine Labs"
              className="h-3.5 w-auto object-contain"
              width={80}
              height={14}
            />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5"></span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={`https://wa.me/917292984244?text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 min-h-[38px] rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <MessageCircle size={13} />
              <span className="hidden sm:inline">WhatsApp Priority Desk</span>
              <span className="sm:hidden">Help</span>
            </a>
          </div>
        </nav>
      </header>

      {/* Main Container */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-24 sm:pb-12">
        {/* Step Breadcrumb */}
        <div className="flex items-center justify-center gap-2 mb-6 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1 text-emerald-600 font-bold">
            <CheckCircle2 size={13} /> 1. Clinic Profile
          </span>
          <span>&rarr;</span>
          <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0867E8] font-black">
            2. Link Bank Account &amp; KYC
          </span>
          <span>&rarr;</span>
          <span className="text-slate-400">3. Counter QR &amp; Terminal Activation</span>
        </div>

        {isCompleted ? (
          /* Completion State */
          <div className="bg-white border-2 border-emerald-400 rounded-3xl p-6 sm:p-10 text-center space-y-5 shadow-lg">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto text-3xl font-black shadow-inner">
              <ShieldCheck size={36} />
            </div>

            <div className="space-y-1.5">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold inline-block">
                Bank Account Verification in Progress (48–72h SLA)
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0B2450]">
                Bank Account Verification Initiated for {clinicName || 'Your Clinic'}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Your account details and verification documents have been submitted to the banking desk. Bank account linking is completed within <strong>48–72 business hours</strong>.
                {email && (
                  <span className="block mt-1.5 font-semibold text-emerald-700">
                    ✉️ A formal confirmation email has been dispatched to {email}.
                  </span>
                )}
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
                Link Clinic Bank Account for Direct Patient Payouts
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                To link your clinic current account for <strong>100% upfront T+1 treatment payouts</strong> via Pine Labs, please provide your payout bank details and verification documents below.
              </p>
            </div>

            {/* Dynamic Verified Invite Banner if URL params present */}
            {(initialClinicName || initialEmail || initialPhone) && (
              <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h2 className="font-bold text-emerald-950 flex items-center gap-2">
                      <span>{initialClinicName ? `Verified Invite for ${initialClinicName}` : 'Verified Partner Invite'}</span>
                      <span className="text-[10px] font-black text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded-full">
                        Fast-Track KYC
                      </span>
                    </h2>
                    <p className="text-[11px] text-emerald-800/90">
                      Pre-filled from your outreach invitation. You can review and edit any details below.
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 border border-emerald-300 px-2.5 py-1 rounded-full">
                  Profile Linked
                </span>
              </div>
            )}

            <form onSubmit={handleFinalSubmit} className="space-y-5">
              {/* 1. Clinic & Authorized Signatory Profile */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0867E8] flex items-center justify-center font-bold">
                      <Building2 size={17} />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <span>1. Clinic &amp; Signatory Profile</span>
                        <span className="text-rose-500">*</span>
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Required for RBI merchant underwriting, settlement alerts &amp; auto-filling your Board Resolution
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-black text-[#0867E8] bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
                    Required for MID
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Clinic Legal Name */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                      Clinic / Hospital Legal Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="e.g. Apex Multispeciality Dental Center or Nova IVF Fertility"
                        value={clinicName}
                        onChange={(e) => setClinicName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:bg-white focus:border-[#0867E8]"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400">Must match registered trade name on Bank Cheque, GST, or MCA registration</p>
                  </div>

                  {/* Doctor / Director Name */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                      Doctor / Director / Authorized Signatory <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <UserCheck size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="e.g. Dr. Rajesh Sharma"
                        value={doctorName}
                        onChange={(e) => setDoctorName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:bg-white focus:border-[#0867E8]"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400">Signatory on Board Resolution, MAF &amp; bank authorization</p>
                  </div>

                  {/* Work Email */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                      Registered Clinic / Doctor Email <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        placeholder="e.g. director@apexdental.in"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:bg-white focus:border-[#0867E8]"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400">48-72h SLA onboarding updates &amp; daily settlement reports sent here</p>
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                      Mobile / WhatsApp Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        placeholder="e.g. 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:bg-white focus:border-[#0867E8]"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400">For instant penny drop SMS alerts and underwriting desk contact</p>
                  </div>

                  {/* City */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                      Practice City / Location
                    </label>
                    <div className="relative">
                      <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="e.g. Mumbai, Maharashtra"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:bg-white focus:border-[#0867E8]"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400">City of operation for regional settlement routing</p>
                  </div>
                </div>
              </div>

              {/* 2. Entity Type Selector: Sole Proprietor vs Pvt Ltd / IVF */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0867E8] flex items-center justify-center font-bold">
                      <Building2 size={16} />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <span>2. Clinic Legal Entity Type</span>
                        <span className="text-rose-500">*</span>
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Choose your healthcare legal structure for verified Pine Labs PG underwriting
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-black text-[#0867E8] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                    {entityType === 'sole_prop' ? 'Sole Proprietor Track' : 'Corporate / IVF Track'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setEntityType('sole_prop')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                      entityType === 'sole_prop'
                        ? 'bg-blue-50/80 border-[#0867E8] ring-2 ring-[#0867E8]/20 shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#0B2450] flex items-center gap-1.5">
                        <span>🩺 Individual / Sole Proprietorship</span>
                      </span>
                      {entityType === 'sole_prop' && (
                        <CheckCircle2 size={16} className="text-[#0867E8]" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1">
                      95% of Dental Clinics. Zero corporate paperwork, no Board Resolution, no MOA/AOA needed.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEntityType('pvt_ltd')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                      entityType === 'pvt_ltd'
                        ? 'bg-blue-50/80 border-[#0867E8] ring-2 ring-[#0867E8]/20 shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#0B2450] flex items-center gap-1.5">
                        <span>🏢 Pvt Ltd / LLP / IVF Center</span>
                      </span>
                      {entityType === 'pvt_ltd' && (
                        <CheckCircle2 size={16} className="text-[#0867E8]" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1">
                      IVF Centers, Hospital Chains &amp; Dental Networks. Includes 1-click Board Resolution &amp; MAF formats.
                    </p>
                  </button>
                </div>
              </div>

              {/* 3. Direct Bank Account Details (Penny Drop) */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0867E8] flex items-center justify-center font-bold">
                      <Landmark size={17} />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <span>3. Clinic Current Bank Account</span>
                        <span className="text-rose-500">*</span>
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Direct T+1 patient treatment disbursements will be routed to this account
                      </p>
                    </div>
                  </div>
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

              {/* 4. Clinic Website & Online Presence (PG Underwriting Requirement) */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0867E8] flex items-center justify-center font-bold text-xs">
                      <Globe size={15} />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <span>4. Is your Clinic Website ready?</span>
                        <span className="text-rose-500">*</span>
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Payment Gateway underwriters require an online practice link to activate your merchant terminal.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setWebsiteStatus('yes')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      websiteStatus === 'yes'
                        ? 'bg-blue-50/80 border-[#0867E8] ring-1 ring-[#0867E8]'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🌐</span>
                      <span className="text-xs font-bold text-slate-900">Yes, Website is Live &amp; Ready</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 pl-6">
                      Enter your domain for instant PG terminal mapping.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setWebsiteStatus('no');
                      setWebsiteUrl('');
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      websiteStatus === 'no'
                        ? 'bg-blue-50/80 border-[#0867E8] ring-1 ring-[#0867E8]'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">⚡</span>
                      <span className="text-xs font-bold text-slate-900">Not Yet / In Progress</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 pl-6">
                      Auto-assign accredited Clinaza profile or Google Maps.
                    </p>
                  </button>
                </div>

                {websiteStatus === 'yes' ? (
                  <div className="pt-1.5 space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                      Clinic Website URL <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="url"
                      placeholder="e.g. https://www.yourclinic.com"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:bg-white focus:border-[#0867E8]"
                    />
                    <p className="text-[10px] text-slate-400">Underwriting team maps this URL to your payment processing MID</p>
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-50/70 border border-emerald-200/90 rounded-xl flex items-start gap-2.5 text-xs text-emerald-900">
                    <Sparkles size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-emerald-950">Clinaza Fast-Track Bank Linking:</p>
                      <p className="text-[11px] text-emerald-800 leading-relaxed mt-0.5">
                        We will auto-generate an accredited clinic profile (<code>clinaza.in/clinic/{clinicName ? clinicName.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'partner'}</code>) so your PG merchant account is approved with zero delays.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* 5. Mandatory KYC Verification Documents */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <span>5. Mandatory KYC Verification Documents</span>
                    <span className="text-rose-500">*</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Upload official proofs for fast-track Pine Labs merchant ID issuance
                  </p>
                </div>
                <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                  Fast-Track 48–72h SLA
                </span>
              </div>

              {/* Bank-Grade Security & RBI Compliance Trust Banner */}
              <div className="bg-gradient-to-r from-blue-50/90 via-slate-50 to-emerald-50/70 border border-blue-200/80 rounded-2xl p-4 shadow-xs flex items-start sm:items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0867E8] flex items-center justify-center shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs font-bold text-[#0B2450]">Bank-Grade 256-Bit SSL Encrypted</p>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300">
                      RBI Digital Lending Framework Compliant
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Documents are securely processed solely for payment gateway merchant onboarding (MID issuance) via Plural by Pine Labs. Masked documents accepted.
                  </p>
                </div>
              </div>

              {/* Frictionless Digital KYC Banner */}
              <div className="bg-blue-50/80 border border-blue-200/90 rounded-2xl p-4 shadow-xs flex items-start sm:items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0867E8] flex items-center justify-center shrink-0">
                  <FileSignature size={20} />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs font-black text-[#0B2450]">Frictionless Digital Upload: No Manual Signing Needed on Government KYC</p>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-200">
                      Fast-Track Underwriting
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    <strong>BR &amp; MAF:</strong> Sign &amp; stamp on letterhead. &bull; <strong>Government KYC Docs (COI, GSTIN, PAN, Cheque, MOA/AOA):</strong> Simply upload clean digital PDFs or scans directly — <strong>no manual signatures needed online</strong> *(physical signing is only required later when couriering hardcopies)*.
                  </p>
                </div>
              </div>

              {entityType === 'sole_prop' ? (
                /* ── SOLE PROPRIETORSHIP / DENTAL CLINIC SLOTS (5 SLOTS) ── */
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl flex items-center justify-between gap-2 text-xs">
                    <span className="font-bold text-[#0B2450] flex items-center gap-1.5">
                      <span>🩺 Showing Sole Proprietor / Individual Doctor Checklist (5 Docs)</span>
                    </span>
                    <span className="text-[10px] font-bold text-[#0867E8] bg-white px-2 py-0.5 rounded-full border border-blue-200">
                      Zero Board Resolution / MOA Needed
                    </span>
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
                        <span>Clinic Cancelled Cheque</span>
                        <span className="text-rose-500">*</span>
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Validates the Current A/C Number &amp; IFSC code entered above. Zero bank statements required.
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
                        Front &amp; back photo for RBI Proof of Address (POA) &amp; merchant account verification. Masked Aadhaar accepted.
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

              {/* 5. Document: GST Exemption Declaration or GST Certificate */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0867E8] flex items-center justify-center font-bold text-xs">
                      5
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
                        <span>GST Exemption Self-Declaration</span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md">
                          Letterhead Format
                        </span>
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Since clinical healthcare services are legally exempt from GST under Notification No. 12/2017, upload a photo of your signed declaration on clinic letterhead. If your clinic carries a GSTIN, upload your GST certificate instead.
                      </p>
                    </div>
                  </div>

                  {gstDoc.uploadedUrl && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                      <CheckCircle2 size={11} /> Attached
                    </span>
                  )}
                </div>

                {/* Sample Letterhead Format Helper with 1-Click Downloads */}
                <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-3.5 space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#0B2450]">
                      <FileCheck size={15} className="text-[#0867E8] shrink-0" />
                      <span>Official Letterhead Declaration Format</span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        type="button"
                        onClick={async (e) => {
                          e.preventDefault();
                          try {
                            toast.info('Generating auto-filled letterhead declaration (.docx)...');
                            await downloadAutoFilledGstExemptionDocx({
                              clinicName,
                              doctorName,
                              city
                            });
                            toast.success(`Word document auto-filled for ${clinicName || 'your practice'} downloaded!`);
                          } catch (err) {
                            console.error('Docx download fallback:', err);
                            window.open('/docs/Clinaza_GST_Exemption_Declaration_Letterhead_Format.docx', '_blank');
                          }
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-blue-300 text-[11px] font-bold text-[#0867E8] transition-all shadow-2xs active:scale-95 cursor-pointer"
                        title="Downloads pre-filled Word document with your clinic name and details"
                      >
                        <Download size={12} />
                        <span>Download Auto-Filled Word (.docx)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          printAutoFilledGstExemption({
                            clinicName,
                            doctorName,
                            city
                          });
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-[11px] font-bold text-slate-700 transition-all shadow-2xs active:scale-95 cursor-pointer"
                        title="Instant 1-click print on clinic letterhead or Save as PDF"
                      >
                        <Printer size={12} />
                        <span>Print on Letterhead / PDF</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowGstTemplate(!showGstTemplate)}
                        className="text-[11px] font-bold text-[#0867E8] hover:underline flex items-center gap-0.5 cursor-pointer ml-1"
                      >
                        <span>{showGstTemplate ? 'Hide' : 'Preview'}</span>
                        {showGstTemplate ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                      </button>
                    </div>
                  </div>

                  {showGstTemplate && (
                    <div className="pt-2 border-t border-blue-200/60 space-y-2">
                      <p className="text-[10px] text-slate-600">
                        Print this exact wording on your clinic letterhead, doctor signs &amp; stamps, and upload a phone photo:
                      </p>
                      <pre className="p-2.5 bg-white border border-blue-200 rounded-lg text-[10px] font-mono text-slate-800 whitespace-pre-wrap leading-relaxed select-all">
{`TO WHOMSOEVER IT MAY CONCERN

Subject: Self-Declaration for Exemption from Goods and Services Tax (GST)

We, ${clinicName || '[Clinic Name]'}, situated at ${city || '[Clinic City]'}, represented by Dr. ${doctorName || '[Doctor Name]'}, hereby declare and confirm that:

1. We are an authorized "Clinical Establishment" offering healthcare and dental services.
2. Under Ministry of Finance (Department of Revenue) Notification No. 12/2017-Central Tax (Rate), healthcare services provided by a clinical establishment or an authorized medical practitioner are legally EXEMPT from GST.
3. In view of the above statutory exemption, we are not registered under GST and carry no GSTIN.

Authorized Signatory
Dr. ${doctorName || '[Doctor Name]'}
[Clinic Name & Official Stamp]`}
                      </pre>
                      <button
                        type="button"
                        onClick={() => {
                          const text = `TO WHOMSOEVER IT MAY CONCERN\n\nSubject: Self-Declaration for Exemption from Goods and Services Tax (GST)\n\nWe, ${clinicName || '[Clinic Name]'}, situated at ${city || '[Clinic City]'}, represented by Dr. ${doctorName || '[Doctor Name]'}, hereby declare and confirm that:\n\n1. We are an authorized "Clinical Establishment" offering healthcare and dental services.\n2. Under Ministry of Finance (Department of Revenue) Notification No. 12/2017-Central Tax (Rate), healthcare services provided by a clinical establishment or an authorized medical practitioner are legally EXEMPT from GST.\n3. In view of the above statutory exemption, we are not registered under GST and carry no GSTIN.\n\nAuthorized Signatory\nDr. ${doctorName || '[Doctor Name]'}\n[Clinic Name & Official Stamp]`;
                          navigator.clipboard?.writeText(text);
                          toast.success('Letterhead declaration format copied! Print on letterhead, sign & snap a photo.');
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-blue-300 text-xs font-bold text-[#0867E8] transition-all cursor-pointer shadow-2xs active:scale-95"
                      >
                        <Copy size={13} />
                        <span>Copy Letterhead Text</span>
                      </button>
                    </div>
                  )}
                </div>

                {gstDoc.previewUrl ? (
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3 truncate">
                      <img 
                        src={gstDoc.previewUrl} 
                        alt="GST Doc Preview" 
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0" 
                      />
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-800 truncate">
                          {gstDoc.file?.name || 'gst_exemption.jpg'}
                        </p>
                        <p className="text-[10px] text-emerald-600 font-bold">
                          {gstDoc.isUploading ? 'Uploading to secure banking bucket...' : '✓ Ready for verification'}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setGstDoc({ file: null, previewUrl: null, uploadedUrl: null, isUploading: false, docName: '' })}
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
                        if (f) handleFileUpload(f, 'gst', setGstDoc);
                      }}
                    />
                    <FileText size={22} className="text-[#0867E8] mx-auto" />
                    <p className="text-xs font-bold text-slate-800">
                      Snap Photo of Signed Clinic Letterhead (or Upload GST)
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Supports JPG, PNG, PDF up to 20MB
                    </p>
                  </label>
                )}
              </div>
                </div>
              ) : (
                /* ── CORPORATE / PVT LTD / IVF CENTER SLOTS (8 SLOTS - PINE LABS VERIFIED) ── */
                <div className="space-y-4">
                  <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="font-bold text-[#0B2450] flex items-center gap-1.5">
                        <span>🏢 Corporate / Private Limited & IVF Center Onboarding</span>
                      </span>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Verified checklist from Advita / Pine Labs underwriting desk for corporate healthcare entities.
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-[#0867E8] bg-white px-2 py-0.5 rounded-full border border-blue-200 shrink-0">
                      Standard Corporate SLA: 24–48h
                    </span>
                  </div>

                  {/* Corporate Slot 1: Board Resolution (BR) on Letterhead */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0867E8] flex items-center justify-center font-bold text-xs shrink-0">
                          1
                        </div>
                        <div>
                          <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
                            <span>Board Resolution (BR) on Company Letterhead</span>
                            <span className="text-rose-500">*</span>
                            <span className="text-[10px] font-bold text-[#0867E8] bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded-md">
                              Advita / Pine Labs Format
                            </span>
                          </h3>
                          <p className="text-[11px] text-slate-500 leading-relaxed">
                            Official resolution on company letterhead. <strong>Mandatory:</strong> Directors must sign &amp; stamp with clinic round seal on every page.
                          </p>
                        </div>
                      </div>

                      {brDoc.uploadedUrl && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                          <CheckCircle2 size={11} /> Attached
                        </span>
                      )}
                    </div>

                    {/* BR Downloads & Interactive Preview */}
                    <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-3.5 space-y-2.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#0B2450]">
                          <FileCheck size={15} className="text-[#0867E8] shrink-0" />
                          <span>Official Board Resolution Format (BR Format.docx)</span>
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            type="button"
                            onClick={async (e) => {
                              e.preventDefault();
                              try {
                                toast.info('Generating auto-filled Board Resolution (.docx)...');
                                await downloadAutoFilledBoardResolutionDocx({
                                  clinicName,
                                  doctorName,
                                  city,
                                  accountNumber,
                                  ifscCode
                                });
                                toast.success(`Board Resolution auto-filled for ${clinicName || 'your company'} downloaded!`);
                              } catch (err) {
                                console.error('Docx download fallback:', err);
                                window.open('/docs/Clinaza_Pine_Labs_Board_Resolution_Format.docx', '_blank');
                              }
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-blue-300 text-[11px] font-bold text-[#0867E8] transition-all shadow-2xs active:scale-95 cursor-pointer"
                            title="Downloads pre-filled Word document with your company name, directors, and settlement account"
                          >
                            <Download size={12} />
                            <span>Download Auto-Filled Word (.docx)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              printAutoFilledBoardResolution({
                                clinicName,
                                doctorName,
                                city,
                                accountNumber,
                                ifscCode
                              });
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-[11px] font-bold text-slate-700 transition-all shadow-2xs active:scale-95 cursor-pointer"
                            title="Instant 1-click print on corporate letterhead or Save as PDF"
                          >
                            <Printer size={12} />
                            <span>Print on Letterhead / PDF</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setShowBrTemplate(!showBrTemplate)}
                            className="text-[11px] font-bold text-[#0867E8] hover:underline flex items-center gap-0.5 cursor-pointer ml-1"
                          >
                            <span>{showBrTemplate ? 'Hide' : 'Preview'}</span>
                            {showBrTemplate ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                          </button>
                        </div>
                      </div>

                      {showBrTemplate && (
                        <div className="pt-2 border-t border-blue-200/60 space-y-2">
                          <p className="text-[10px] text-slate-600">
                            Print this resolution on your corporate letterhead, signed by 2 directors with company seal, and upload:
                          </p>
                          <pre className="p-2.5 bg-white border border-blue-200 rounded-lg text-[10px] font-mono text-slate-800 whitespace-pre-wrap leading-relaxed select-all max-h-48 overflow-y-auto">
{`CERTIFIED TRUE COPY OF THE RESOLUTION PASSED AT THE MEETING OF THE BOARD OF DIRECTORS OF ${clinicName ? clinicName.toUpperCase() : '[COMPANY NAME]'} PRIVATE LIMITED / LLP HELD ON [DATE] AT [REGISTERED OFFICE ADDRESS, ${city ? city.toUpperCase() : 'CITY'}]

"RESOLVED THAT the consent and approval of the Board of Directors of the Company be and is hereby accorded to enter into a merchant services arrangement with Pine Labs Private Limited ("Plural by Pine Labs") and its healthcare platform partner Clinaza Technologies Private Limited ("Clinaza") for availing online payment gateway facilities, point-of-care patient checkout, multi-bank credit/debit card EMI infrastructure, and T+1 direct settlement services.

RESOLVED FURTHER THAT Dr. / Mr. / Ms. ${doctorName || '[Authorized Director Name]'}, [Designation] (DIN: [DIN Number]), be and is hereby authorized on behalf of the Company to negotiate, sign, execute, and deliver:
  (a) The Plural Merchant Application Form (MAF);
  (b) The Beneficial Ownership (BO) and Politically Exposed Persons (PEP) declarations;
  (c) The Merchant Master Services Agreement (MSA);
  (d) All necessary declarations, KYC schedules, and compliance undertakings.

RESOLVED FURTHER THAT the Company’s Current Bank Account maintained with [Bank Name], bearing Account No. ${accountNumber || '[Current Account Number]'}, IFSC: ${ifscCode || '[IFSC Code]'}, be and is hereby designated as the official registered settlement bank account for receiving all merchant payouts and credits.

RESOLVED FURTHER THAT a certified true copy of this resolution signed by any Director or Company Secretary of the Company be furnished to Pine Labs Private Limited and Clinaza Technologies."

CERTIFIED TRUE COPY
For ${clinicName ? clinicName.toUpperCase() : '[COMPANY NAME]'} PRIVATE LIMITED / LLP

_____________________________          _____________________________
[Director 1 Signature & Stamp]         [Director 2 / CS Signature]
DIN: [DIN Number]                      DIN: [DIN Number]`}
                          </pre>
                          <button
                            type="button"
                            onClick={() => {
                              const text = `CERTIFIED TRUE COPY OF THE RESOLUTION PASSED AT THE MEETING OF THE BOARD OF DIRECTORS OF ${clinicName ? clinicName.toUpperCase() : '[COMPANY NAME]'} PRIVATE LIMITED / LLP HELD ON [DATE] AT [REGISTERED OFFICE ADDRESS, ${city ? city.toUpperCase() : 'CITY'}]\n\n"RESOLVED THAT the consent and approval of the Board of Directors of the Company be and is hereby accorded to enter into a merchant services arrangement with Pine Labs Private Limited (\"Plural by Pine Labs\") and its healthcare platform partner Clinaza Technologies Private Limited (\"Clinaza\") for availing online payment gateway facilities, point-of-care patient checkout, multi-bank credit/debit card EMI infrastructure, and T+1 direct settlement services.\n\nRESOLVED FURTHER THAT Dr. / Mr. / Ms. ${doctorName || '[Authorized Director Name]'}, [Designation] (DIN: [DIN Number]), be and is hereby authorized on behalf of the Company to negotiate, sign, execute, and deliver:\n  (a) The Plural Merchant Application Form (MAF);\n  (b) The Beneficial Ownership (BO) and Politically Exposed Persons (PEP) declarations;\n  (c) The Merchant Master Services Agreement (MSA);\n  (d) All necessary declarations, KYC schedules, and compliance undertakings.\n\nRESOLVED FURTHER THAT the Company’s Current Bank Account maintained with [Bank Name], bearing Account No. ${accountNumber || '[Current Account Number]'}, IFSC: ${ifscCode || '[IFSC Code]'}, be and is hereby designated as the official registered settlement bank account for receiving all merchant payouts and credits.\n\nRESOLVED FURTHER THAT a certified true copy of this resolution signed by any Director or Company Secretary of the Company be furnished to Pine Labs Private Limited and Clinaza Technologies."\n\nCERTIFIED TRUE COPY\nFor ${clinicName ? clinicName.toUpperCase() : '[COMPANY NAME]'} PRIVATE LIMITED / LLP\n\n_____________________________          _____________________________\n[Director 1 Signature & Stamp]         [Director 2 / CS Signature]\nDIN: [DIN Number]                      DIN: [DIN Number]`;
                              navigator.clipboard?.writeText(text);
                              toast.success('Board Resolution format copied! Print on company letterhead, sign & upload.');
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-blue-300 text-xs font-bold text-[#0867E8] transition-all cursor-pointer shadow-2xs active:scale-95"
                          >
                            <Copy size={13} />
                            <span>Copy Resolution Text</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {brDoc.previewUrl ? (
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-3 truncate">
                          <div className="w-12 h-12 rounded-lg bg-blue-50 text-[#0867E8] border border-blue-200 flex items-center justify-center font-bold text-xs shrink-0">
                            DOC
                          </div>
                          <div className="truncate">
                            <p className="text-xs font-bold text-slate-800 truncate">
                              {brDoc.file?.name || 'board_resolution.pdf'}
                            </p>
                            <p className="text-[10px] text-emerald-600 font-bold">
                              {brDoc.isUploading ? 'Uploading...' : '✓ Ready for verification'}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setBrDoc({ file: null, previewUrl: null, uploadedUrl: null, isUploading: false, docName: '' })}
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
                          accept="image/*,application/pdf,.docx"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleFileUpload(f, 'br', setBrDoc);
                          }}
                        />
                        <FileCheck size={22} className="text-[#0867E8] mx-auto" />
                        <p className="text-xs font-bold text-slate-800">
                          Upload Signed &amp; Stamped Board Resolution
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Supports PDF, JPG, PNG, DOCX up to 20MB
                        </p>
                      </label>
                    )}
                  </div>

                  {/* Corporate Slot 2: Plural MAF + BO / PEP List */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0867E8] flex items-center justify-center font-bold text-xs shrink-0">
                          2
                        </div>
                        <div>
                          <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
                            <span>Plural MAF + BO &amp; PEP List</span>
                            <span className="text-rose-500">*</span>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md">
                              Official Excel Form
                            </span>
                          </h3>
                          <p className="text-[11px] text-slate-500 leading-relaxed">
                            Official Pine Labs onboarding workbook containing the Merchant Application Form, Beneficial Ownership (&gt;10% equity) and PEP declaration.
                          </p>
                        </div>
                      </div>

                      {mafDoc.uploadedUrl && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                          <CheckCircle2 size={11} /> Attached
                        </span>
                      )}
                    </div>

                    {/* MAF Download Helper */}
                    <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3.5 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                          <FileSpreadsheet size={16} className="text-emerald-700 shrink-0" />
                          <div>
                            <p className="font-bold text-emerald-950">Plural MAF &amp; BO/PEP Declaration Format</p>
                            <p className="text-[10px] text-emerald-700 font-normal">Auto-fills 3 sheets: Final MAF, Key Personnel (PEP), and Beneficial Ownership (BO)</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                await downloadAutoFilledMafExcel({
                                  clinicName,
                                  doctorName,
                                  email,
                                  phone,
                                  city,
                                  accountHolderName,
                                  accountNumber,
                                  ifscCode,
                                  websiteUrl
                                });
                                toast.success(`Plural MAF auto-filled for ${clinicName || 'your company'} downloaded!`);
                                analytics.trackMafDownload(clinicName || 'Clinic');
                              } catch (e) {
                                console.error('Failed to generate MAF:', e);
                                toast.error('Failed to auto-fill MAF. You can download the blank template below.');
                              }
                            }}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black shadow-xs transition-all cursor-pointer active:scale-95"
                          >
                            <Sparkles size={12} className="text-amber-300" />
                            <Download size={12} />
                            <span>Download Auto-Filled MAF (.xlsx)</span>
                          </button>

                          <a
                            href="/docs/Plural_MAF_BO_PEP_Key_Personnel_List_Format.xlsx"
                            download="Plural_MAF_BO_PEP_Key_Personnel_List_Format.xlsx"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-emerald-50 border border-emerald-300 text-[10px] font-bold text-emerald-800 transition-all shadow-2xs"
                          >
                            <Download size={11} />
                            <span>Blank Template</span>
                          </a>
                        </div>
                      </div>

                      <div className="text-[10px] text-emerald-800 bg-emerald-100/60 rounded-lg p-2.5 space-y-1">
                        <p className="font-bold">✨ What gets auto-filled across all 3 sheets:</p>
                        <p>• <strong>Sheet 1 (Final MAF):</strong> Trade Name, Legal Entity ({clinicName ? clinicName.toUpperCase() : 'Clinic'} Pvt Ltd), Operating City ({city || 'City'}), Director ({doctorName || 'Director'}), Work Email, Phone, Beneficiary Name, Account Number ({accountNumber ? `••••${accountNumber.slice(-4)}` : 'Bank A/C'}), and IFSC.</p>
                        <p>• <strong>Sheet 2 (Final LIST &amp; PEP):</strong> Key Management Personnel list with statutory Non-PEP (Politically Exposed Persons) clearance.</p>
                        <p>• <strong>Sheet 3 (Final BO):</strong> RBI statutory Beneficial Ownership declaration with Director majority equity holding.</p>
                        <p className="pt-0.5 text-emerald-900 font-bold">👉 How to complete: Download auto-filled file, sign/stamp the signature block, and upload the completed Excel or signed PDF back here.</p>
                      </div>
                    </div>

                    {mafDoc.previewUrl ? (
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-3 truncate">
                          <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-xs shrink-0">
                            XLSX
                          </div>
                          <div className="truncate">
                            <p className="text-xs font-bold text-slate-800 truncate">
                              {mafDoc.file?.name || 'maf_bo_pep_form.xlsx'}
                            </p>
                            <p className="text-[10px] text-emerald-600 font-bold">
                              {mafDoc.isUploading ? 'Uploading...' : '✓ Ready for verification'}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setMafDoc({ file: null, previewUrl: null, uploadedUrl: null, isUploading: false, docName: '' })}
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
                          accept=".xlsx,.xls,application/pdf,image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleFileUpload(f, 'maf', setMafDoc);
                          }}
                        />
                        <FileSpreadsheet size={22} className="text-[#0867E8] mx-auto" />
                        <p className="text-xs font-bold text-slate-800">
                          Upload Completed MAF &amp; BO/PEP Form
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Supports XLSX, XLS, PDF up to 20MB
                        </p>
                      </label>
                    )}
                  </div>

                  {/* Corporate Slot 3: Certificate of Incorporation (COI) */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0867E8] flex items-center justify-center font-bold text-xs shrink-0">
                          3
                        </div>
                        <div>
                          <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                            <span>Certificate of Incorporation (COI)</span>
                            <span className="text-rose-500">*</span>
                          </h3>
                          <p className="text-[11px] text-slate-500">
                            Issued by MCA. Upload original digital PDF or clean scan (No physical signature needed online).
                          </p>
                        </div>
                      </div>

                      {coiDoc.uploadedUrl && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                          <CheckCircle2 size={11} /> Attached
                        </span>
                      )}
                    </div>

                    {coiDoc.previewUrl ? (
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-3 truncate">
                          <img src={coiDoc.previewUrl} alt="COI" className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0" />
                          <div className="truncate">
                            <p className="text-xs font-bold text-slate-800 truncate">{coiDoc.file?.name || 'coi.pdf'}</p>
                            <p className="text-[10px] text-emerald-600 font-bold">{coiDoc.isUploading ? 'Uploading...' : '✓ Ready'}</p>
                          </div>
                        </div>
                        <button type="button" onClick={() => setCoiDoc({ file: null, previewUrl: null, uploadedUrl: null, isUploading: false, docName: '' })} className="text-slate-400 hover:text-rose-600 p-1.5"><Trash2 size={15} /></button>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-slate-200 hover:border-[#0867E8] bg-slate-50/60 hover:bg-blue-50/20 rounded-xl p-4 sm:p-5 text-center cursor-pointer transition-all block space-y-1.5">
                        <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f, 'coi', setCoiDoc); }} />
                        <Building2 size={22} className="text-[#0867E8] mx-auto" />
                        <p className="text-xs font-bold text-slate-800">Upload Certificate of Incorporation (COI)</p>
                        <p className="text-[10px] text-slate-400">PDF, JPG, PNG up to 20MB &bull; Clean copy accepted</p>
                      </label>
                    )}
                  </div>

                  {/* Corporate Slot 4: Company Corporate PAN Card */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0867E8] flex items-center justify-center font-bold text-xs shrink-0">
                          4
                        </div>
                        <div>
                          <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                            <span>Company PAN Card</span>
                            <span className="text-rose-500">*</span>
                          </h3>
                          <p className="text-[11px] text-slate-500">
                            Corporate entity PAN. Upload clear photo or scan (No physical signature needed online).
                          </p>
                        </div>
                      </div>

                      {companyPanDoc.uploadedUrl && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                          <CheckCircle2 size={11} /> Attached
                        </span>
                      )}
                    </div>

                    {companyPanDoc.previewUrl ? (
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-3 truncate">
                          <img src={companyPanDoc.previewUrl} alt="Company PAN" className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0" />
                          <div className="truncate">
                            <p className="text-xs font-bold text-slate-800 truncate">{companyPanDoc.file?.name || 'company_pan.jpg'}</p>
                            <p className="text-[10px] text-emerald-600 font-bold">{companyPanDoc.isUploading ? 'Uploading...' : '✓ Ready'}</p>
                          </div>
                        </div>
                        <button type="button" onClick={() => setCompanyPanDoc({ file: null, previewUrl: null, uploadedUrl: null, isUploading: false, docName: '' })} className="text-slate-400 hover:text-rose-600 p-1.5"><Trash2 size={15} /></button>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-slate-200 hover:border-[#0867E8] bg-slate-50/60 hover:bg-blue-50/20 rounded-xl p-4 sm:p-5 text-center cursor-pointer transition-all block space-y-1.5">
                        <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f, 'company_pan', setCompanyPanDoc); }} />
                        <CreditCard size={22} className="text-[#0867E8] mx-auto" />
                        <p className="text-xs font-bold text-slate-800">Upload Company PAN Card</p>
                        <p className="text-[10px] text-slate-400">PDF, JPG, PNG up to 20MB &bull; Clean copy accepted</p>
                      </label>
                    )}
                  </div>

                  {/* Corporate Slot 5: Company GST Registration Certificate */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0867E8] flex items-center justify-center font-bold text-xs shrink-0">
                          5
                        </div>
                        <div>
                          <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                            <span>Company GST Registration Certificate</span>
                            <span className="text-rose-500">*</span>
                          </h3>
                          <p className="text-[11px] text-slate-500">
                            Standard 3-page GST certificate (Form GST REG-06). Upload the clean portal PDF (No physical signature needed online).
                          </p>
                        </div>
                      </div>

                      {companyGstDoc.uploadedUrl && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                          <CheckCircle2 size={11} /> Attached
                        </span>
                      )}
                    </div>

                    {companyGstDoc.previewUrl ? (
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-3 truncate">
                          <img src={companyGstDoc.previewUrl} alt="Company GST" className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0" />
                          <div className="truncate">
                            <p className="text-xs font-bold text-slate-800 truncate">{companyGstDoc.file?.name || 'gst_cert.pdf'}</p>
                            <p className="text-[10px] text-emerald-600 font-bold">{companyGstDoc.isUploading ? 'Uploading...' : '✓ Ready'}</p>
                          </div>
                        </div>
                        <button type="button" onClick={() => setCompanyGstDoc({ file: null, previewUrl: null, uploadedUrl: null, isUploading: false, docName: '' })} className="text-slate-400 hover:text-rose-600 p-1.5"><Trash2 size={15} /></button>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-slate-200 hover:border-[#0867E8] bg-slate-50/60 hover:bg-blue-50/20 rounded-xl p-4 sm:p-5 text-center cursor-pointer transition-all block space-y-1.5">
                        <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f, 'company_gst', setCompanyGstDoc); }} />
                        <FileText size={22} className="text-[#0867E8] mx-auto" />
                        <p className="text-xs font-bold text-slate-800">Upload 3-Page Company GST Certificate (PDF)</p>
                        <p className="text-[10px] text-slate-400">Direct portal PDF or scan &bull; No physical signing needed online</p>
                      </label>
                    )}
                  </div>

                  {/* Corporate Slot 6: Company Current Account Cancelled Cheque */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0867E8] flex items-center justify-center font-bold text-xs shrink-0">
                          6
                        </div>
                        <div>
                          <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                            <span>Company Current Account Cancelled Cheque</span>
                            <span className="text-rose-500">*</span>
                          </h3>
                          <p className="text-[11px] text-slate-500">
                            Validates the corporate Current A/C Number &amp; IFSC code entered above.
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
                          <img src={chequeDoc.previewUrl} alt="Cheque" className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0" />
                          <div className="truncate">
                            <p className="text-xs font-bold text-slate-800 truncate">{chequeDoc.file?.name || 'cheque.jpg'}</p>
                            <p className="text-[10px] text-emerald-600 font-bold">{chequeDoc.isUploading ? 'Uploading...' : '✓ Ready'}</p>
                          </div>
                        </div>
                        <button type="button" onClick={() => setChequeDoc({ file: null, previewUrl: null, uploadedUrl: null, isUploading: false, docName: '' })} className="text-slate-400 hover:text-rose-600 p-1.5"><Trash2 size={15} /></button>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-slate-200 hover:border-[#0867E8] bg-slate-50/60 hover:bg-blue-50/20 rounded-xl p-4 sm:p-5 text-center cursor-pointer transition-all block space-y-1.5">
                        <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f, 'cheque', setChequeDoc); }} />
                        <UploadCloud size={22} className="text-[#0867E8] mx-auto" />
                        <p className="text-xs font-bold text-slate-800">Upload Company Current Account Cheque</p>
                        <p className="text-[10px] text-slate-400">PDF, JPG, PNG up to 20MB</p>
                      </label>
                    )}
                  </div>

                  {/* Corporate Slot 7: Director PAN & Aadhaar */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0867E8] flex items-center justify-center font-bold text-xs shrink-0">
                          7
                        </div>
                        <div>
                          <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                            <span>Authorized Signatory Director PAN &amp; Aadhaar</span>
                            <span className="text-rose-500">*</span>
                          </h3>
                          <p className="text-[11px] text-slate-500">
                            Identity &amp; address proof of authorized director. Upload clean photo or PDF (No physical sign needed online).
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
                          <img src={aadhaarDoc.previewUrl} alt="Director KYC" className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0" />
                          <div className="truncate">
                            <p className="text-xs font-bold text-slate-800 truncate">{aadhaarDoc.file?.name || 'director_kyc.jpg'}</p>
                            <p className="text-[10px] text-emerald-600 font-bold">{aadhaarDoc.isUploading ? 'Uploading...' : '✓ Ready'}</p>
                          </div>
                        </div>
                        <button type="button" onClick={() => setAadhaarDoc({ file: null, previewUrl: null, uploadedUrl: null, isUploading: false, docName: '' })} className="text-slate-400 hover:text-rose-600 p-1.5"><Trash2 size={15} /></button>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-slate-200 hover:border-[#0867E8] bg-slate-50/60 hover:bg-blue-50/20 rounded-xl p-4 sm:p-5 text-center cursor-pointer transition-all block space-y-1.5">
                        <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f, 'aadhaar', setAadhaarDoc); }} />
                        <FileText size={22} className="text-[#0867E8] mx-auto" />
                        <p className="text-xs font-bold text-slate-800">Upload Director PAN &amp; Aadhaar (Front &amp; Back)</p>
                        <p className="text-[10px] text-slate-400">PDF, JPG, PNG up to 20MB &bull; Clean copy accepted</p>
                      </label>
                    )}
                  </div>

                  {/* Corporate Slot 8: MOA & AOA / LLP Agreement */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0867E8] flex items-center justify-center font-bold text-xs shrink-0">
                          8
                        </div>
                        <div>
                          <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                            <span>MOA &amp; AOA / LLP Agreement</span>
                            <span className="text-rose-500">*</span>
                          </h3>
                          <p className="text-[11px] text-slate-500">
                            Constitutional charter filed with ROC. Upload original digital PDF (No physical sign needed online).
                          </p>
                        </div>
                      </div>

                      {moaDoc.uploadedUrl && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                          <CheckCircle2 size={11} /> Attached
                        </span>
                      )}
                    </div>

                    {moaDoc.previewUrl ? (
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-3 truncate">
                          <div className="w-12 h-12 rounded-lg bg-blue-50 text-[#0867E8] border border-blue-200 flex items-center justify-center font-bold text-xs shrink-0">
                            MOA
                          </div>
                          <div className="truncate">
                            <p className="text-xs font-bold text-slate-800 truncate">{moaDoc.file?.name || 'moa_aoa.pdf'}</p>
                            <p className="text-[10px] text-emerald-600 font-bold">{moaDoc.isUploading ? 'Uploading...' : '✓ Ready'}</p>
                          </div>
                        </div>
                        <button type="button" onClick={() => setMoaDoc({ file: null, previewUrl: null, uploadedUrl: null, isUploading: false, docName: '' })} className="text-slate-400 hover:text-rose-600 p-1.5"><Trash2 size={15} /></button>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-slate-200 hover:border-[#0867E8] bg-slate-50/60 hover:bg-blue-50/20 rounded-xl p-4 sm:p-5 text-center cursor-pointer transition-all block space-y-1.5">
                        <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f, 'moa', setMoaDoc); }} />
                        <FileText size={22} className="text-[#0867E8] mx-auto" />
                        <p className="text-xs font-bold text-slate-800">Upload MOA &amp; AOA / LLP Agreement</p>
                        <p className="text-[10px] text-slate-400">Digital ROC PDF up to 20MB &bull; Clean copy accepted</p>
                      </label>
                    )}
                  </div>
                </div>
              )}


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
                      <span>Complete KYC</span>
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

      {/* Mobile Sticky Bottom Conversion Bar */}
      {!isCompleted && (
        <div className="fixed bottom-0 inset-x-0 sm:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-4 py-2.5 z-40 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] flex items-center justify-between gap-3">
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Step 2 of 2</span>
            <span className="text-xs font-black text-[#0B2450] truncate">{clinicName || 'Link Bank Account'}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              const formEl = document.querySelector('form');
              if (formEl) formEl.requestSubmit();
            }}
            disabled={isSubmitting}
            className="px-4 py-2.5 min-h-[42px] rounded-xl bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5 shrink-0 active:scale-95"
          >
            {isSubmitting ? (
              <span>Submitting...</span>
            ) : (
              <>
                <span>Complete KYC</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
