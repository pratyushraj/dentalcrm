import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/seo/SEOHead';
import { 
  Building2, 
  Stethoscope, 
  ShieldCheck, 
  TrendingUp, 
  Share2, 
  Check,
  Sparkles,
  Landmark,
  Mail,
  Star,
  Home,
  Globe,
  CreditCard,
  Download,
  ArrowRight,
  QrCode,
  CheckCircle2,
  PackageCheck,
  FileText,
  MessageCircle,
  Baby,
  Clock,
  Search,
  Phone,
  UserCheck,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import { emailNotificationService } from '@/services/emailNotificationService';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { analytics } from '@/utils/analytics';
import { initiateRazorpayPayment, RAZORPAY_CONFIG } from '@/services/razorpayService';
import preloadedClinics from '@/data/onboarded_clinics.json';

export default function PartnerClinicOnboardingPage() {
  const [form, setForm] = useState({
    clinicName: '',
    doctorName: '',
    city: '',
    phone: '',
    email: '',
    website: '',
    chairs: '',
    premisesType: '',
    googleRating: '',
    reviewCount: '',
    specialties: [] as string[],
    avgMonthlyCases: '',
    expectedEmiLoans: '',
    avgTicketSize: '',
    currentPosProvider: '',
    category: 'dental',
    hasCurrentAccount: '',
    businessProofType: '',
    hasCancelledCheque: ''
  });

  const [utmParams, setUtmParams] = useState({ source: '', medium: '', campaign: '' });

  // Smart Identity Lookup states
  const [lookupInput, setLookupInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [matchedClinic, setMatchedClinic] = useState<any | null>(null);
  const [lookupStatus, setLookupStatus] = useState<'idle' | 'found' | 'not_found'>('idle');
  const [showFormForMatched, setShowFormForMatched] = useState(false);

  const handleClinicLookup = async (inputVal?: string) => {
    const raw = (inputVal !== undefined ? inputVal : lookupInput).trim();
    if (!raw) {
      toast.error('Please enter a 10-digit mobile number or email.');
      return;
    }

    setIsSearching(true);
    const cleanPhone = raw.replace(/\D/g, '').slice(-10);
    const isEmail = raw.includes('@');

    try {
      let matched: any = null;

      // 1. Check Supabase clinic_onboardings
      if (cleanPhone.length >= 10) {
        const { data } = await supabase
          .from('clinic_onboardings')
          .select('*')
          .ilike('phone', `%${cleanPhone}%`)
          .order('created_at', { ascending: false })
          .limit(1);

        if (data && data.length > 0) {
          matched = data[0];
        }
      } else if (isEmail) {
        const { data } = await supabase
          .from('clinic_onboardings')
          .select('*')
          .ilike('email', `%${raw}%`)
          .order('created_at', { ascending: false })
          .limit(1);

        if (data && data.length > 0) {
          matched = data[0];
        }
      }

      // 2. Fallback check local preloaded clinics
      if (!matched) {
        const local = (preloadedClinics as any[]).find((c: any) =>
          (cleanPhone.length >= 10 && c.phone && c.phone.replace(/\D/g, '').includes(cleanPhone)) ||
          (isEmail && c.email && c.email.toLowerCase() === raw.toLowerCase()) ||
          (c.id && c.id === raw)
        );
        if (local) {
          matched = {
            id: local.id,
            clinic_name: local.clinic,
            doctor_name: local.doctor,
            phone: local.phone,
            email: local.email,
            city: local.city,
            created_at: local.created_at
          };
        }
      }

      if (matched) {
        setMatchedClinic(matched);
        setSavedClinicId(matched.id || '');
        setLookupStatus('found');
        setForm(prev => ({
          ...prev,
          clinicName: matched.clinic_name || prev.clinicName,
          doctorName: matched.doctor_name || prev.doctorName,
          phone: matched.phone || prev.phone,
          email: matched.email || prev.email,
          city: matched.city || prev.city,
        }));
        toast.success(`Welcome back, ${matched.doctor_name || matched.clinic_name}!`);
      } else {
        setMatchedClinic(null);
        setLookupStatus('not_found');
        if (cleanPhone.length === 10) {
          setForm(prev => ({ ...prev, phone: cleanPhone }));
        } else if (isEmail) {
          setForm(prev => ({ ...prev, email: raw }));
        }
        toast.info('Please complete your clinic profile details below.');
      }
    } catch (err) {
      console.warn('[Clinic lookup error]', err);
      setLookupStatus('not_found');
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const source = params.get('utm_source') || '';
    const medium = params.get('utm_medium') || '';
    const campaign = params.get('utm_campaign') || '';
    const categoryParam = params.get('category') || '';
    
    // Auto-detect category from URL or campaign
    let detectedCategory = 'dental';
    if (categoryParam === 'ivf' || campaign.toLowerCase().includes('ivf')) {
      detectedCategory = 'ivf';
    } else if (categoryParam === 'hospital' || categoryParam === 'multispecialty') {
      detectedCategory = 'hospital';
    } else if (categoryParam === 'derma' || categoryParam === 'aesthetics') {
      detectedCategory = 'derma';
    }

    setForm(prev => ({ ...prev, category: detectedCategory }));

    setUtmParams({
      source,
      medium,
      campaign,
    });

    // Check for auto-lookup params
    const phoneParam = params.get('phone') || '';
    const emailParam = params.get('email') || '';
    const idParam = params.get('id') || '';
    if (phoneParam || emailParam || idParam) {
      const q = phoneParam || emailParam || idParam;
      setLookupInput(q);
      handleClinicLookup(q);
    }
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [savedClinicId, setSavedClinicId] = useState<string>('');
  const [websiteReady, setWebsiteReady] = useState<'yes' | 'no'>('no');
  const [agreedToAgreement, setAgreedToAgreement] = useState(true);

  const handlePayWithRazorpay = () => {
    if (!agreedToAgreement) {
      toast.error('Please accept the Clinic Sub-Merchant Agreement to proceed with onboarding.');
      return;
    }
    initiateRazorpayPayment({
      amount: RAZORPAY_CONFIG.kitAmount,
      name: 'CLINAZA',
      description: `Clinic Kit & Lifetime CRM: ${form.clinicName || 'Partner Clinic'}`,
      prefill: {
        name: form.doctorName || form.clinicName,
        email: form.email,
        contact: form.phone
      },
      notes: {
        clinic_name: form.clinicName,
        city: form.city,
        doctor_name: form.doctorName
      },
      onSuccess: async (res) => {
        setPaymentId(res.razorpay_payment_id);
        toast.success(`Payment of ₹${RAZORPAY_CONFIG.kitAmount} verified! (Ref: ${res.razorpay_payment_id})`);
        
        try {
          // Track GA4 Ecommerce Purchase
          analytics.trackKitPurchase({
            paymentId: res.razorpay_payment_id,
            clinicName: form.clinicName,
            amount: RAZORPAY_CONFIG.kitAmount
          });

          await emailNotificationService.sendNotification(`🎉 ₹999 Clinic Kit Paid via Razorpay: ${form.clinicName}`, {
            'Payment ID': res.razorpay_payment_id,
            'Order ID': res.razorpay_order_id || 'N/A',
            'Clinic Name': form.clinicName,
            'Doctor Name': form.doctorName || 'N/A',
            'Phone': form.phone,
            'City': form.city,
            'Amount': `₹${RAZORPAY_CONFIG.kitAmount}`
          });
        } catch (e) {
          console.warn('[Email] Error sending payment confirmation alert', e);
        }
      }
    });
  };

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

    try {
      // 1. Save directly to Supabase with schema-validated columns
      const payload: Record<string, any> = {
        clinic_name: form.clinicName,
        doctor_name: form.doctorName || null,
        city: form.city,
        phone: form.phone,
        email: form.email || null,
        chairs: form.chairs || null,
        premises_type: form.premisesType || null,
        google_rating: form.googleRating || null,
        review_count: form.reviewCount || null,
        specialties: form.specialties,
        avg_monthly_cases: form.avgMonthlyCases || null,
        expected_emi_loans: form.expectedEmiLoans || null,
        avg_ticket_size: form.avgTicketSize || null,
        has_current_account: form.hasCurrentAccount || 'Yes',
        business_proof_type: form.website ? `Website: ${form.website}` : (form.businessProofType || 'Pending Step 2 Upload'),
        has_cancelled_cheque: form.hasCancelledCheque || 'Pending Step 2 Upload',
        utm_source: utmParams.source || null,
        utm_medium: utmParams.medium || null,
        utm_campaign: utmParams.campaign || null,
        source: 'clinic-onboarding-portal',
        created_at: new Date().toISOString()
      };

      try {
        const { data: insertRes, error: insertError } = await supabase
          .from('clinic_onboardings')
          .insert([payload])
          .select('id')
          .single();

        if (insertRes?.id) {
          setSavedClinicId(insertRes.id);
        } else if (insertError) {
          console.warn('[Supabase] Insert notice:', insertError);
        }
      } catch (dbErr) {
        console.warn('[Supabase] Storing in clinic_onboardings fallback:', dbErr);
        // Fallback to generic leads table if clinic_onboardings does not exist yet
        try {
          await supabase.from('leads').insert([{
            type: 'clinic_onboarding',
            name: form.doctorName || form.clinicName,
            phone: form.phone,
            metadata: payload,
            created_at: new Date().toISOString()
          }]);
        } catch (leadErr) {
          console.warn('[Supabase] Lead store fallback error:', leadErr);
        }
      }

      // 2. Dispatch email notification alert
      const categoryName = form.category === 'ivf' ? '👶 IVF & Fertility Centre' : form.category === 'hospital' ? '🏥 Multi-Specialty Hospital' : form.category === 'derma' ? '✨ Dermatology & Aesthetics' : '🦷 Dental Clinic';
      await emailNotificationService.sendNotification(`🏥 New ${form.category === 'ivf' ? 'IVF Centre' : 'Clinic'} Onboarding Submitted`, {
        'Specialty / Category': categoryName,
        'Clinic / Centre Name': form.clinicName,
        'Doctor / Director Name': form.doctorName || 'Not provided',
        'City / Location': form.city,
        'Contact Phone': form.phone,
        'Email': form.email || 'Not provided',
        'Website': form.website || 'No website',
        'Current POS / Card Machine': form.currentPosProvider || 'None / Not specified',
        'Clinic Space': form.premisesType || 'Not specified',
        'Google Maps Rating': form.googleRating ? `${form.googleRating} ★ (${form.reviewCount || '0'} reviews)` : 'Not provided',
        'Capacity / Infrastructure': form.chairs || 'Not specified',
        'Monthly High-Ticket Cases': form.avgMonthlyCases || 'Not specified',
        'Expected Monthly Loan / EMI Applications': form.expectedEmiLoans || 'Not specified',
        'Avg Treatment / Package Ticket': form.avgTicketSize || 'Not specified',
        'Active Business Current Account': form.hasCurrentAccount,
        'Clinic Business Proof Available': form.businessProofType,
        'Cancelled Cheque Ready': form.hasCancelledCheque,
        'UTM Source': utmParams.source || '(direct)',
        'UTM Medium': utmParams.medium || '(none)',
        'UTM Campaign': utmParams.campaign || '(none)',
        'Estimated Monthly Loan Volume Potential': form.expectedEmiLoans ? `₹${(parseInt(form.expectedEmiLoans.replace(/\D/g, '') || '0') * (form.category === 'ivf' ? 150000 : 40000)).toLocaleString('en-IN')}/month` : 'Pending discussion'
      });

      // Track GA4 Key Lead Event for Clinic Partner
      analytics.trackClinicPartnerLead({
        clinicName: form.clinicName,
        city: form.city,
        category: form.category,
        phone: form.phone,
        expectedEmiLoans: form.expectedEmiLoans
      });

    } catch (err) {
      console.error('Submission error:', err);
    }

    setIsSubmitting(false);
    setSubmitted(true);
    toast.success('Clinic profile accredited successfully!');
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.origin + '/clinic-onboarding');
    setCopiedLink(true);
    toast.success('Share link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#0867E8] selection:text-white pb-24 relative overflow-hidden">
      <SEOHead 
        title="Partner Clinic Onboarding — Clinaza Point-of-Care EMI"
        description="Official onboarding portal for partner dental clinics to activate instant point-of-care patient EMI financing."
        image="https://www.clinaza.in/og-clinic-onboarding.png"
      />

      {/* Atmospheric Ambient Background Canvas */}
      <div className="absolute inset-0 bg-radial-fintech pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-grid-fintech mask-radial-fade opacity-60 pointer-events-none -z-10" />

      {/* Top Floating Pill Navbar */}
      <header className="fixed top-3 sm:top-5 inset-x-0 z-50 pointer-events-none px-4 sm:px-6">
        <nav className="max-w-4xl mx-auto bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-[0_8px_32px_rgba(15,23,42,0.08)] rounded-full px-3.5 sm:px-5 py-2.5 flex items-center justify-between gap-3 pointer-events-auto transition-all">
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
                  ONBOARDING
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">Point-of-Care Healthcare Financing</span>
            </div>
          </Link>

          {/* Official Pine Labs Badge */}
          <div className="hidden md:flex items-center gap-1.5 pl-3 border-l border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Powered by</span>
            <img
              src="/assets/plural_by_pinelabs_transparent.png"
              alt="Plural by Pine Labs"
              className="h-3.5 w-auto object-contain"
              width={80}
              height={14}
            />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5"></span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={copyShareLink}
              title="Share Form"
              className="px-2.5 sm:px-3.5 py-1.5 min-h-[36px] sm:min-h-[38px] rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              {copiedLink ? <Check size={13} className="text-emerald-600" /> : <Share2 size={13} />}
              <span className="hidden sm:inline">{copiedLink ? 'Copied!' : 'Share Form'}</span>
            </button>

            <Link
              to="/reactivation/login"
              className="px-3 sm:px-3.5 py-1.5 min-h-[36px] sm:min-h-[38px] rounded-full bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
            >
              <span className="sm:hidden">Login</span>
              <span className="hidden sm:inline">Doctor Login</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 sm:pt-36 pb-24 sm:pb-12">
        {submitted ? (
          <div className="space-y-6">
            {/* Accreditation Header */}
            <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-5 text-center space-y-2 shadow-2xs">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-black uppercase tracking-wider">
                <CheckCircle2 size={14} />
                <span>Step 1 Complete: Clinic Profile Accredited</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#0B2450]">
                {form.clinicName ? `${form.clinicName} Accredited!` : 'Clinic Details Submitted!'}
              </h2>
              <p className="text-xs text-slate-600 max-w-lg mx-auto">
                Your profile has been logged in the Clinaza partner network. Complete Step 2 below to link your current account for direct T+1 patient treatment payouts.
              </p>
            </div>

            {/* Step 2: Dedicated KYC & Bank Account Linking Card */}
            <div className="bg-gradient-to-r from-[#0B2450] via-[#0867E8] to-[#0756C7] text-white rounded-2xl p-6 sm:p-7 shadow-lg space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-wider">
                  Step 2 of 2: Recommended Next Step
                </span>
                <span className="text-emerald-300 font-bold text-xs flex items-center gap-1">
                  <Sparkles size={13} /> Fast-Track 2-Min Bank Linking
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Link Clinic Current Account for T+1 Treatment Payouts
                </h3>
                <p className="text-xs sm:text-sm text-blue-100/90 mt-1.5 max-w-lg leading-relaxed">
                  Required by Pine Labs &amp; partner banking compliance to verify your bank account so patient treatment funds (₹30,000–₹1,50,000) are disbursed directly to your clinic current account.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to={`/clinic-kyc?id=${savedClinicId}&clinic=${encodeURIComponent(form.clinicName)}&phone=${encodeURIComponent(form.phone)}&doctor=${encodeURIComponent(form.doctorName || '')}&city=${encodeURIComponent(form.city)}&email=${encodeURIComponent(form.email || '')}&website=${encodeURIComponent(form.website || '')}`}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-[#0B2450] text-xs font-black shadow-md transition-all transform hover:-translate-y-0.5"
                >
                  <FileText size={16} className="text-[#0867E8]" />
                  <span>Upload Cheque &amp; Documents on Secure Page &rarr;</span>
                </Link>

                <a
                  href={`https://wa.me/917292984244?text=${encodeURIComponent(
                    `Hi Clinaza, sharing KYC documents to link bank account for clinic payouts:\n• Clinic: ${form.clinicName}\n• Doctor: ${form.doctorName || 'Doctor'}\n• City: ${form.city}\n• Phone: ${form.phone}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-sm"
                >
                  <MessageCircle size={15} />
                  <span>Send via WhatsApp Instead</span>
                </a>
              </div>
            </div>

            {/* Payment Completed Card */}
            {paymentId ? (
              <div className="bg-white border-2 border-emerald-400 rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-sm">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto text-3xl font-black">
                  <PackageCheck size={36} />
                </div>
                <div className="space-y-1">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                    Payment Verified via Razorpay
                  </span>
                  <h3 className="text-xl font-black text-[#0B2450] mt-2">Clinic Activation Kit Queued for Dispatch!</h3>
                  <p className="text-xs text-slate-600 font-mono">
                    Razorpay Reference: <strong className="text-emerald-700">{paymentId}</strong>
                  </p>
                </div>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Your custom countertop acrylic QR standee and staff pitch cards are being laser-printed and will be couriered via Bluedart/Delhivery within 48 hours. Your dedicated Relationship Manager will reach out on WhatsApp shortly!
                </p>
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
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setPaymentId(null);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                  >
                    Submit Another Clinic
                  </button>
                </div>
              </div>
            ) : (
              /* Step 2: Pay ₹999 via Razorpay Card */
              <div className="bg-white border-2 border-[#0867E8] rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#0867E8] text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-bl-xl">
                  Step 2 of 2
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Left: Commercial Details & Pay Button */}
                  <div className="md:col-span-7 space-y-4">
                    <div>
                      <span className="inline-block bg-blue-50 border border-blue-200 text-[#0867E8] text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-1.5">
                        One-Time Clinic Kit Activation
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-[#0B2450]">₹999</span>
                        <span className="text-xs font-bold text-slate-500">One-Time Only &bull; Zero AMC Lifetime</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Includes custom reception acrylic QR standee, full Practice Cloud CRM, and front-desk patient healthcare EMI activation.
                      </p>
                    </div>

                    {/* Features checklist */}
                    <ul className="space-y-2 text-xs text-slate-700 border-t border-b border-slate-100 py-3">
                      <li className="flex items-start gap-2">
                        <Check size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>Custom Acrylic QR Standee:</strong> Laser-printed with your clinic logo.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>Practice CRM &amp; Rx Maker:</strong> Unlimited patients, digital treatment charts.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>Front-Desk Patient EMIs:</strong> Instant 3–24 month patient EMI financing.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>Dedicated Relationship Manager:</strong> WhatsApp priority desk &amp; staff pitch cards.</span>
                      </li>
                    </ul>

                    {/* Agreement Acceptance Checkbox */}
                    <div className="flex items-start gap-2.5 pt-1 text-xs text-slate-600 bg-blue-50/70 border border-blue-100 rounded-xl p-3">
                      <input
                        type="checkbox"
                        id="agreeTerms"
                        checked={agreedToAgreement}
                        onChange={(e) => setAgreedToAgreement(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#0867E8] focus:ring-[#0867E8] cursor-pointer shrink-0"
                      />
                      <label htmlFor="agreeTerms" className="cursor-pointer select-none leading-relaxed text-[11.5px] text-slate-700">
                        I accept the{' '}
                        <Link to="/clinic-agreement" target="_blank" className="text-[#0867E8] font-bold underline hover:text-blue-800">
                          Clinic Master Services &amp; Sub-Merchant Agreement
                        </Link>{' '}
                        and authorize Clinaza &amp; licensed payment partners to map our clinic under the Sub-Merchant Model for payment collection and T+1 patient EMI settlement.
                      </label>
                    </div>

                    {/* Razorpay CTA Button */}
                    <div className="space-y-2 pt-1">
                      <button
                        type="button"
                        onClick={handlePayWithRazorpay}
                        className="w-full bg-[#0867E8] hover:bg-[#0756C7] text-white font-black py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#0867E8]/25 transition-all text-sm"
                      >
                        <CreditCard size={17} />
                        <span>Pay ₹999 via Razorpay</span>
                        <ArrowRight size={16} />
                      </button>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span>Secured by <strong>Razorpay</strong></span>
                        <a
                          href={RAZORPAY_CONFIG.paymentHandle}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#0867E8] font-bold hover:underline inline-flex items-center gap-1"
                        >
                          Direct Web Link (razorpay.me/@clinaza) &rarr;
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Right: Countertop QR Standee Card */}
                  <div className="md:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-4 text-center space-y-2">
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200/90 shadow-2xs inline-block">
                      <img 
                        src={RAZORPAY_CONFIG.qrAsset} 
                        alt="Clinaza Activation QR" 
                        className="w-40 h-auto mx-auto rounded"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[11px] font-black text-[#0B2450]">Scan with Any UPI App</p>
                      <p className="text-[10px] text-slate-500 font-mono">GPay, PhonePe, Paytm, Cred</p>
                      <p className="text-[10px] font-bold text-[#0867E8] font-mono select-all">
                        {RAZORPAY_CONFIG.upiId}
                      </p>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Amount: <strong>₹999</strong> (Fixed)
                    </p>
                  </div>
                </div>

                {/* Bottom Footer Actions */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <a
                    href="/docs/Clinaza_Clinic_Partner_Onboarding_Guide.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-600 hover:text-[#0867E8] font-bold inline-flex items-center gap-1.5 transition-colors"
                  >
                    <Download size={13} />
                    <span>Download Partner Enablement PDF (2 Pages)</span>
                  </a>

                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setPaymentId(null);
                    }}
                    className="text-slate-500 hover:text-slate-800 font-medium transition-colors"
                  >
                    Submit Another Clinic &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : lookupStatus === 'idle' ? (
          /* ── SCREEN 1: PHONE OR EMAIL CHECKPOINT ONLY ── */
          <div className="space-y-6 animate-in fade-in">
            {/* Hero Banner */}
            <div className="text-center space-y-3 mb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0867E8] text-xs font-bold">
                <Sparkles size={13} />
                <span>Healthcare Patient EMI Integration</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0B2450] tracking-tight [text-wrap:balance]">
                Clinic Partner <span className="text-[#0867E8]">Onboarding</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed [text-wrap:pretty]">
                Enter your 10-digit mobile number or official email to verify your registration or activate point-of-care patient financing.
              </p>
            </div>

            {/* Smart Lookup Box */}
            <div className="bg-white border-2 border-[#0867E8]/30 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0867E8] flex items-center justify-center font-bold shrink-0">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-[#0B2450]">
                      Smart Clinic Identity &amp; Auto-Route
                    </h3>
                    <p className="text-xs text-slate-500">
                      Auto-detects registered clinics to fast-track bank KYC or starts fresh
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0867E8] self-start sm:self-auto">
                  Instant Auto-Route
                </span>
              </div>

              {/* Search Bar Input */}
              <form 
                onSubmit={(e) => { e.preventDefault(); handleClinicLookup(); }}
                className="space-y-4"
              >
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                      📞
                    </span>
                    <input
                      type="text"
                      autoFocus
                      value={lookupInput}
                      onChange={(e) => setLookupInput(e.target.value)}
                      placeholder="Enter 10-digit mobile number (e.g. 98765 43210) or official email"
                      className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-slate-300 focus:border-[#0867E8] focus:ring-2 focus:ring-blue-100 text-sm font-medium text-slate-800 placeholder-slate-400 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSearching}
                    className="px-8 py-3.5 rounded-xl bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md shadow-[#0867E8]/20 active:scale-95 disabled:opacity-50 cursor-pointer min-h-[48px]"
                  >
                    {isSearching ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>Checking...</span>
                      </>
                    ) : (
                      <>
                        <span>Continue</span>
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Official Partner Credibility & Commercial Invariants */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-[#0B2450] text-[11px] uppercase tracking-wider">Official Partner:</span>
                  <img
                    src="/assets/plural_by_pinelabs_transparent.png"
                    alt="Plural by Pine Labs"
                    className="h-4 w-auto object-contain"
                    width={84}
                    height={16}
                  />
                </div>
                <span className="text-emerald-700 font-bold text-[11px] bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  ✓ 35+ EMI Modes &bull; Instant Sanction
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-600 shrink-0" />
                  <span><strong>₹999 One-Time</strong> Setup Fee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-600 shrink-0" />
                  <span><strong>₹0 AMC</strong> &bull; Zero Recurring Fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-600 shrink-0" />
                  <span><strong>0% Recourse</strong> &bull; T+1 Payouts</span>
                </div>
              </div>
            </div>
          </div>
        ) : lookupStatus === 'found' && matchedClinic && !showFormForMatched ? (
          /* ── SCREEN 2A: MATCHED REGISTERED CLINIC CARD ── */
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white border-2 border-[#0867E8]/40 rounded-3xl p-6 sm:p-8 shadow-md space-y-5">
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider border border-emerald-300">
                      ✓ Registered Clinic Profile Found
                    </span>
                    {matchedClinic.id && (
                      <span className="text-[11px] text-slate-500 font-mono">
                        Ref: {matchedClinic.id.slice(0, 8)}...
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#0B2450]">
                    Welcome Back, {matchedClinic.doctor_name || 'Doctor'}!
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600">
                    <strong>{matchedClinic.clinic_name}</strong> &bull; {matchedClinic.city || 'India'} &bull; +91 {matchedClinic.phone}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setMatchedClinic(null);
                    setLookupStatus('idle');
                    setLookupInput('');
                    setShowFormForMatched(false);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 underline shrink-0 cursor-pointer"
                >
                  Use Another Number
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Primary Action: Go to KYC */}
                <Link
                  to={`/clinic-kyc?id=${matchedClinic.id || ''}&clinic=${encodeURIComponent(matchedClinic.clinic_name || '')}&doctor=${encodeURIComponent(matchedClinic.doctor_name || '')}&phone=${encodeURIComponent(matchedClinic.phone || '')}&city=${encodeURIComponent(matchedClinic.city || '')}&email=${encodeURIComponent(matchedClinic.email || '')}`}
                  className="p-5 rounded-2xl bg-[#0867E8] hover:bg-[#0756C7] text-white flex items-center justify-between gap-3 shadow-md transition-all active:scale-95 group"
                >
                  <div className="space-y-1 text-left">
                    <span className="text-[10px] font-bold text-blue-200 uppercase tracking-wider block">Recommended Next Step</span>
                    <span className="text-sm sm:text-base font-black block">Resume Bank Linking &amp; KYC &rarr;</span>
                    <span className="text-xs text-blue-100 block">Upload PAN, Aadhaar &amp; Cheque for Payouts</span>
                  </div>
                  <ArrowRight size={20} className="text-white group-hover:translate-x-1 transition-transform shrink-0" />
                </Link>

                {/* Secondary Action: Pay Kit Standee */}
                <button
                  type="button"
                  onClick={handlePayWithRazorpay}
                  className="p-5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 flex items-center justify-between gap-3 shadow-xs transition-all active:scale-95 cursor-pointer text-left"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Counter Standee Kit</span>
                    <span className="text-sm sm:text-base font-black text-[#0B2450] block">Activate Kit (₹999 Setup) &rarr;</span>
                    <span className="text-xs text-slate-500 block">₹0 AMC &bull; Laser-Printed QR Couriered</span>
                  </div>
                  <CreditCard size={20} className="text-[#0867E8] shrink-0" />
                </button>
              </div>

              <div className="pt-3 flex items-center justify-between text-xs border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowFormForMatched(true)}
                  className="text-[#0867E8] hover:text-blue-800 font-bold underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Need to edit or update clinic profile details?</span>
                </button>
                <span className="text-slate-400 text-[11px]">Zero Recourse Platform</span>
              </div>
            </div>
          </div>
        ) : (
          /* ── SCREEN 2B: FULL INTAKE FORM (New Clinic or Edit Profile Mode) ── */
          <div className="space-y-6 animate-in fade-in">
            {/* Top Status Banner */}
            <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#0867E8] shrink-0" />
                <p className="text-xs font-bold text-slate-800">
                  {matchedClinic 
                    ? `Editing profile for ${matchedClinic.clinic_name}`
                    : `Mobile: +91 ${form.phone || lookupInput} • Complete your 60-second setup below`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setLookupStatus('idle');
                  setShowFormForMatched(false);
                }}
                className="text-[11px] text-[#0867E8] hover:underline font-bold shrink-0 cursor-pointer"
              >
                Change Number
              </button>
            </div>

            {/* Category Switcher Tabs */}
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {[
                { id: 'dental', label: 'Dental Clinic', icon: Stethoscope },
                { id: 'ivf', label: 'Fertility & IVF Centre', icon: Baby },
                { id: 'hospital', label: 'Multi-Specialty Hospital', icon: Building2 },
                { id: 'derma', label: 'Dermatology & Aesthetics', icon: Sparkles }
              ].map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setForm(prev => ({ ...prev, category: cat.id }))}
                    className={`px-4 py-2.5 min-h-[44px] rounded-full text-xs font-bold transition-all flex items-center gap-2 active:scale-95 cursor-pointer ${
                      form.category === cat.id
                        ? 'bg-[#0B2450] text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Icon size={14} className={form.category === cat.id ? 'text-white' : 'text-slate-500'} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} id="clinic-onboarding-form" className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-8 shadow-sm space-y-6">
            
            {/* 1. Clinic Identity */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <Building2 className="text-[#0867E8]" size={17} />
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">1. Clinic Profile & Location</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Clinic Name *</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Apex Dental & Implant Clinic"
                    value={form.clinicName}
                    onChange={e => setForm({...form, clinicName: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0867E8] focus:ring-1 focus:ring-[#0867E8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Doctor Name</label>
                  <input 
                    type="text"
                    placeholder="e.g. Dr. Aryan Parmar"
                    value={form.doctorName}
                    onChange={e => setForm({...form, doctorName: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0867E8] focus:ring-1 focus:ring-[#0867E8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">City & State *</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Patna, Bihar or Delhi NCR"
                    value={form.city}
                    onChange={e => setForm({...form, city: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0867E8] focus:ring-1 focus:ring-[#0867E8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Direct WhatsApp / Mobile *</label>
                  <input 
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={form.phone}
                    onChange={e => setForm({...form, phone: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0867E8] focus:ring-1 focus:ring-[#0867E8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                    <Mail size={12} className="text-slate-400" /> Official Email
                  </label>
                  <input 
                    type="email"
                    placeholder={form.category === 'ivf' ? "e.g. contact@aurafertility.in" : "e.g. drparmar@apexdental.in"}
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0867E8] focus:ring-1 focus:ring-[#0867E8]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Globe size={12} className="text-slate-400" /> Is your Clinic Website ready?
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">PG Underwriting</span>
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setWebsiteReady('yes')}
                      className={`py-2.5 px-3 min-h-[42px] rounded-xl border text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                        websiteReady === 'yes'
                          ? 'bg-blue-50 border-[#0867E8] text-[#0867E8] shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Globe size={14} className="shrink-0 text-current" />
                      <span>Yes, Live Website</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setWebsiteReady('no');
                        setForm(prev => ({ ...prev, website: '' }));
                      }}
                      className={`py-2.5 px-3 min-h-[42px] rounded-xl border text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                        websiteReady === 'no'
                          ? 'bg-blue-50 border-[#0867E8] text-[#0867E8] shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Clock size={14} className="shrink-0 text-current" />
                      <span>Not Yet / In Progress</span>
                    </button>
                  </div>

                  {websiteReady === 'yes' ? (
                    <input 
                      type="url"
                      placeholder="e.g. https://www.yourclinic.com"
                      value={form.website}
                      onChange={e => setForm({...form, website: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0867E8] font-mono"
                    />
                  ) : (
                    <p className="text-[10px] text-emerald-700 bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-2 font-medium">
                      ✓ Clinaza auto-assigns an accredited partner profile or uses Google Maps for partner bank verification.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Clinical Infrastructure & Existing POS / Card Machine */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <Stethoscope className="text-[#0867E8]" size={17} />
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  {form.category === 'ivf' ? '2. Facility Setup & Existing Payment Terminal' : '2. Clinical Setup & Card Machine'}
                </h2>
              </div>

              {/* Only show treatments if dental */}
              {form.category === 'dental' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Most Common Treatments at Clinic:</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Dental Implants',
                      'Clear Aligners',
                      'Orthodontic Braces',
                      'Full Mouth Rehabilitation',
                      'Zirconia Crowns & Makeovers',
                      'Root Canal (RCT)'
                    ].map((item) => {
                      const active = form.specialties.includes(item);
                      return (
                        <button
                          type="button"
                          key={item}
                          onClick={() => toggleSpecialty(item)}
                          className={`px-3.5 py-2 min-h-[40px] rounded-xl text-xs font-semibold border transition-all flex items-center justify-center active:scale-95 ${
                            active
                              ? 'bg-blue-50 border-[#0867E8] text-[#0867E8]'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          {active ? '✓ ' : '+ '}{item}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Capacity / Infrastructure */}
              {form.category === 'dental' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Number of Active Dental Chairs</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['1 Chair', '2 Chairs', '3 Chairs', '4+ Chairs'].map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => setForm({...form, chairs: opt})}
                        className={`py-2.5 min-h-[42px] flex items-center justify-center text-xs font-bold rounded-xl border text-center transition-all active:scale-95 ${
                          form.chairs === opt
                            ? 'bg-[#0867E8] text-white border-[#0867E8] shadow-xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Centre Type / Facility Scale</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Standalone IVF Centre', 'Hospital ART Wing', 'Consultation & IUI Unit'].map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => setForm({...form, chairs: opt})}
                        className={`py-2.5 min-h-[42px] flex items-center justify-center text-[11px] font-bold rounded-xl border text-center transition-all active:scale-95 ${
                          form.chairs === opt
                            ? 'bg-[#0867E8] text-white border-[#0867E8] shadow-xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* NEW: Existing POS / PG Machine Question */}
              <div className="pt-1">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Which POS Terminal / Card Machine do you currently use at the billing desk?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    'Pine Labs Plutus',
                    'MSwipe Wisepos',
                    'Bank EDC (HDFC / ICICI / Axis / SBI)',
                    'Paytm All-in-One POS',
                    'PhonePe POS',
                    'BharatPe Swipe',
                    'Innoviti uniPAY',
                    'Mosambee / Dspread',
                    'Razorpay / Ezetap POS',
                    'Worldline / Ingenico',
                    'Bijlipay',
                    'None (Only UPI QR / Cash)'
                  ].map((provider) => (
                    <button
                      type="button"
                      key={provider}
                      onClick={() => setForm({ ...form, currentPosProvider: provider })}
                      className={`py-2.5 px-3 min-h-[44px] text-xs font-medium rounded-xl border text-left transition-all active:scale-95 flex items-center ${
                        form.currentPosProvider === provider
                          ? 'bg-blue-50 border-[#0867E8] text-[#0867E8] font-bold shadow-xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>{provider}</span>
                        {form.currentPosProvider === provider && <Check size={12} className="text-[#0867E8] shrink-0" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Home size={13} className="text-[#0867E8]" /> Clinic Space / Premises
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Owned', 'Rented / Leased'].map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => setForm({ ...form, premisesType: opt })}
                        className={`py-2 text-xs font-bold rounded-xl border text-center transition-all ${
                          form.premisesType === opt
                            ? 'bg-[#0867E8] text-white border-[#0867E8] shadow-xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Star size={13} className="text-amber-500 fill-amber-500" /> Google Maps Rating & Reviews
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="e.g. 4.8 ★"
                      value={form.googleRating}
                      onChange={e => setForm({ ...form, googleRating: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0867E8]"
                    />
                    <input
                      type="text"
                      placeholder="e.g. 150+ reviews"
                      value={form.reviewCount}
                      onChange={e => setForm({ ...form, reviewCount: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0867E8]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. The Core Lending Data: High-Ticket Cases & Expected Loans */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <TrendingUp className="text-emerald-600" size={17} />
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  {form.category === 'ivf' ? '3. IVF Cycle Volume & Patient Financing Demand' : '3. Case Volume & Monthly Loan Demand'}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-800 uppercase tracking-wide">
                    {form.category === 'ivf' ? 'Monthly IVF / IUI Cycles' : 'High-Ticket Cases (>₹25k)'}
                  </label>
                  <p className="text-[10px] text-slate-500">
                    {form.category === 'ivf' ? 'Approx. cycles started per month' : 'Approx. implants/aligners seen per month'}
                  </p>
                  <input 
                    type="text"
                    placeholder={form.category === 'ivf' ? 'e.g. 10 - 20 cycles' : 'e.g. 8 - 12 cases'}
                    value={form.avgMonthlyCases}
                    onChange={e => setForm({...form, avgMonthlyCases: e.target.value})}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:border-[#0867E8]"
                  />
                </div>

                <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3.5 space-y-1.5">
                  <label className="block text-[11px] font-bold text-emerald-800 uppercase tracking-wide">
                    Likely Monthly Loans / EMIs
                  </label>
                  <p className="text-[10px] text-emerald-600/80">Couples/patients opting for monthly EMI</p>
                  <input 
                    type="text"
                    placeholder="e.g. 5 - 8 patients"
                    value={form.expectedEmiLoans}
                    onChange={e => setForm({...form, expectedEmiLoans: e.target.value})}
                    className="w-full bg-white border border-emerald-300 rounded-lg px-3 py-2 text-xs text-emerald-700 font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-800 uppercase tracking-wide">
                    {form.category === 'ivf' ? 'Avg Cycle / Package Cost' : 'Avg Treatment Ticket Size'}
                  </label>
                  <p className="text-[10px] text-slate-500">Typical package cost for these cases</p>
                  <input 
                    type="text"
                    placeholder={form.category === 'ivf' ? 'e.g. ₹1,80,000' : 'e.g. ₹40,000'}
                    value={form.avgTicketSize}
                    onChange={e => setForm({...form, avgTicketSize: e.target.value})}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:border-[#0867E8]"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Settlement Bank Linking Callout */}
            <div className="bg-gradient-to-r from-blue-50/80 to-slate-50 border border-blue-200/90 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0867E8] flex items-center justify-center font-bold shrink-0">
                  <Landmark size={18} />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#0B2450]">
                    Direct Payout Bank Account Linking (KYC)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    To keep registration fast, clinic bank proof (cancelled cheque) is uploaded on a <strong>dedicated secure page in Step 2</strong> or sent via WhatsApp.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Check size={12} /> Zero Upfront Friction
                </span>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-[#0867E8]/20 flex items-center justify-center gap-2 active:scale-98"
              >
                {isSubmitting ? (
                  <span>Submitting Clinic...</span>
                ) : (
                  <>
                    <ShieldCheck size={16} /> Submit Clinic Onboarding
                  </>
                )}
              </button>
              <p className="text-[11px] text-slate-500 text-center mt-2.5">
                Information is confidential and used solely to establish point-of-sale patient financing lines.
              </p>
            </div>
          </form>
        </div>
      )}
    </main>

      {/* Mobile Sticky Bottom Conversion Bar (ONLY when filling form) */}
      {!submitted && (lookupStatus === 'not_found' || showFormForMatched) && (
        <div className="fixed bottom-0 inset-x-0 sm:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-4 py-2.5 z-40 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] flex items-center justify-between gap-3">
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Step 1 of 2</span>
            <span className="text-xs font-black text-[#0B2450] truncate">{form.clinicName || 'Clinic Profile'}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              const formEl = document.querySelector('form#clinic-onboarding-form') as HTMLFormElement || document.querySelector('form');
              if (formEl) formEl.requestSubmit();
            }}
            disabled={isSubmitting}
            className="px-4 py-2.5 min-h-[42px] rounded-xl bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5 shrink-0 active:scale-95 cursor-pointer"
          >
            {isSubmitting ? (
              <span>Submitting...</span>
            ) : (
              <>
                <span>Submit</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
