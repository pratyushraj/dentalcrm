import React, { useState, useEffect } from 'react';
import { useInView, useCountUp } from '../hooks/useScrollAnimation';
import { Link, useLocation } from 'react-router-dom';
import { RemotionVideoModal } from '@/components/remotion/RemotionVideoModal';
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  MessageSquare, 
  Building2, 
  Check,
  X,
  Send,
  HelpCircle,
  ChevronDown,
  UserCheck,
  Landmark,
  Lock,
  Package,
  Truck,
  Award,
  MapPin,
  Sparkles,
  Share2,
  ChevronLeft,
  ChevronRight,
  Video
} from 'lucide-react';
import { emailNotificationService } from '../services/emailNotificationService';
import { toast } from 'sonner';
import { SEOHead } from '@/components/seo/SEOHead';
import { BankSvgLogo } from '@/components/BankSvgLogos';
// ── Scroll Fade-In Wrapper ──────────────────────────────
const FadeIn: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  const { ref, visible } = useInView(0.12);
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`section-hidden ${visible ? 'section-visible' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

// ── Animated Counter Stats Bar ──────────────────────────
const StatsBar: React.FC = () => {
  const { ref, visible } = useInView(0.2);

  const stats = [
    { value: 55, suffix: '+', label: 'Lending Partners', prefix: '' },
    { value: 5, suffix: 'L', label: 'Max Loan Amount', prefix: '₹' },
    { value: 2, suffix: ' min', label: 'Digital KYC', prefix: '' },
    { value: 0, suffix: '%', label: 'CIBIL Impact', prefix: '' },
  ];

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-200 rounded-2xl overflow-hidden border border-slate-200 mb-3"
    >
      {stats.map((stat, idx) => (
        <StatItem key={idx} {...stat} trigger={visible} delay={idx * 150} />
      ))}
    </div>
  );
};

const StatItem: React.FC<{
  value: number; suffix: string; label: string; prefix: string; trigger: boolean; delay: number;
}> = ({ value, suffix, label, prefix, trigger, delay }) => {
  const [go, setGo] = React.useState(false);
  React.useEffect(() => {
    if (trigger) { const t = setTimeout(() => setGo(true), delay); return () => clearTimeout(t); }
  }, [trigger, delay]);
  const count = useCountUp(value, 1200, go);
  return (
    <div className="bg-white px-4 py-4 text-center">
      <div className="text-2xl sm:text-3xl font-bold text-[#0B2450] tabular-nums">
        {prefix}{count}{suffix}
      </div>
      <div className="text-[11px] text-slate-500 mt-0.5 font-medium">{label}</div>
    </div>
  );
};

export default function CrmHomepage() {
  const location = useLocation();
  const [formData, setFormData] = useState({
    doctorName: '',
    clinicName: '',
    phone: '',
    city: '',
    category: 'Dental Implants & Aligners'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [formType, setFormType] = useState<'clinic' | 'lender'>('clinic');
  const [showEligibilityModal, setShowEligibilityModal] = useState(false);
  const [showEmiReelModal, setShowEmiReelModal] = useState(false);
  const [eligibilityStep, setEligibilityStep] = useState<1 | 2>(1);
  const [showLenderResults, setShowLenderResults] = useState(false);

  // Auto-open eligibility modal if navigating with #check-eligibility or ?action=check-eligibility
  useEffect(() => {
    if (location.hash === '#check-eligibility' || location.search.includes('action=check-eligibility')) {
      setShowEligibilityModal(true);
      setEligibilityStep(1);
    }
  }, [location]);

  // Continuous / Interval Auto-Slideshow for Clinic Network
  useEffect(() => {
    const track = document.getElementById('clinic-slideshow-track');
    if (!track) return;

    let isPaused = false;
    const onMouseEnter = () => { isPaused = true; };
    const onMouseLeave = () => { isPaused = false; };
    const onTouchStart = () => { isPaused = true; };
    const onTouchEnd = () => { 
      setTimeout(() => { isPaused = false; }, 3000); 
    };

    track.addEventListener('mouseenter', onMouseEnter);
    track.addEventListener('mouseleave', onMouseLeave);
    track.addEventListener('touchstart', onTouchStart, { passive: true });
    track.addEventListener('touchend', onTouchEnd, { passive: true });

    const interval = setInterval(() => {
      if (!isPaused && track) {
        const maxScroll = track.scrollWidth - track.clientWidth;
        if (track.scrollLeft >= maxScroll - 10) {
          track.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          track.scrollBy({ left: 340, behavior: 'smooth' });
        }
      }
    }, 3500);

    return () => {
      clearInterval(interval);
      track.removeEventListener('mouseenter', onMouseEnter);
      track.removeEventListener('mouseleave', onMouseLeave);
      track.removeEventListener('touchstart', onTouchStart);
      track.removeEventListener('touchend', onTouchEnd);
    };
  }, []);
  const [patientData, setPatientData] = useState({
    name: '',
    mobile: '',
    city: '',
    treatment: 'Dental Implants',
    amount: '',
    treatmentAmount: 0,
    preferredClinic: '',
    cibilScore: '',
    employmentType: '',
    incomeProof: ''
  });
  const [patientSubmitted, setPatientSubmitted] = useState(false);

  // Single partner lender: Dhanlift
  const ALL_LENDERS = [
    { 
      id: 'dhanlift', 
      name: 'Dhanlift', 
      rate: '12%–30% p.a.', 
      minCibil: 0, 
      salaryOnly: false, 
      minIncome: 0, 
      url: 'https://www.dhanlift.com/loans/personal-loan-for-salaried-employees/clinaza-patient-treatment-loan?utm_source=affiliate&utm_medium=partner&utm_campaign=partner-campaign-aff-4&utm_term=03-09-2026', 
      badge: 'Official EMI Partner', 
      color: 'bg-emerald-50 border-emerald-200 text-emerald-700' 
    }
  ];

  const getMatchedLenders = () => ALL_LENDERS;

  // EMI Calculator state
  const [emiAmount, setEmiAmount] = useState(100000);
  const [emiTenure, setEmiTenure] = useState(12);
  const [emiRate, setEmiRate] = useState(15); // Estimated lender rate

  const calcEMI = (principal: number, months: number, annualRate: number) => {
    const r = annualRate / 12 / 100;
    return Math.round((principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1));
  };

  const monthlyEMI = calcEMI(emiAmount, emiTenure, emiRate);
  const totalPayable = monthlyEMI * emiTenure;
  const totalInterest = totalPayable - emiAmount;
  // Analytics event tracking placeholder function
  const trackEvent = (eventName: string, payload?: Record<string, any>) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, payload);
    }
    console.log(`[Analytics Event]: ${eventName}`, payload || {});
  };
  const handlePatientEligibilitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientData.name || !patientData.mobile) {
      toast.error('Please fill in required fields');
      return;
    }

    trackEvent('eligibility_completed', {
      cibil: patientData.cibilScore,
      employment: patientData.employmentType,
      treatment: patientData.treatment,
    });

    // Send email notification
    emailNotificationService.sendNotification('New Patient Eligibility Form Checked', {
      patientName: patientData.name,
      mobile: patientData.mobile,
      cibilScoreRange: patientData.cibilScore,
      employmentType: patientData.employmentType,
      treatmentNeeded: patientData.treatment,
      monthlyIncome: patientData.incomeProof,
      loanAmountRange: patientData.amount,
    });

    // Immediately redirect to Dhanlift affiliate UTM link with mobile prefill parameters
    const mob = encodeURIComponent(patientData.mobile);
    const targetUrl = `https://www.dhanlift.com/loans/personal-loan-for-salaried-employees/clinaza-patient-treatment-loan?utm_source=affiliate&utm_medium=partner&utm_campaign=partner-campaign-aff-4&utm_term=03-09-2026&mobile=${mob}&phone=${mob}&phoneNumber=${mob}&aff_sub=${mob}`;
    window.location.href = targetUrl;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.doctorName || !formData.clinicName || !formData.phone || !formData.city) {
      toast.error('Please fill in all required fields');
      return;
    }
    setIsSubmitting(true);
    trackEvent('clinic_form_submitted', {
      formType,
      city: formData.city,
      category: formData.category
    });

    // Send email notification to funnyraj10@gmail.com
    emailNotificationService.sendNotification('New Clinic Onboarding Partner Request', {
      formType,
      doctorName: formData.doctorName,
      clinicName: formData.clinicName,
      phone: formData.phone,
      city: formData.city,
      selectedSpecialty: formData.category || 'N/A'
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast.success(
        formType === 'clinic'
          ? 'Partner request submitted! Our clinic onboarding team will contact you shortly.'
          : 'Lender partnership inquiry received! Our capital markets team will reach out.'
      );
    }, 1000);
  };

  const steps = [
    { num: '01', title: 'Patient Chooses Treatment', desc: 'Implants, braces, aligners, crowns, surgeries, and elective healthcare procedures.' },
    { num: '02', title: 'Patient Applies for Financing', desc: 'Clinaza connects the patient with appropriate lending partners directly at checkout.' },
    { num: '03', title: 'Lender Evaluates', desc: 'Independent Bank/NBFC handles eligibility, approval, and loan terms.' },
    { num: '04', title: 'Treatment Proceeds', desc: 'Patient receives treatment while repaying the lender through monthly EMIs.' }
  ];

  const clinicBenefits = [
    'Give patients a way to manage large treatment costs',
    'Reduce treatment postponement & patient drop-off',
    'No need for the clinic to collect monthly EMIs',
    'Financing handled entirely by lending partners',
    '100% digital, paperless application process',
    'Dedicated support from the Clinaza team'
  ];

  const categories = [
    { emoji: '🦷', name: 'Dental Implants', tag: 'Restorative & Full Mouth' },
    { emoji: '😁', name: 'Aligners & Braces', tag: 'Orthodontics' },
    { emoji: '👑', name: 'Crowns & Makeovers', tag: 'Cosmetic Dentistry' },
    { emoji: '🦴', name: 'Orthopaedics', tag: 'Joints & Surgeries' },
    { emoji: '👶', name: 'IVF & Fertility', tag: 'Reproductive Care' },
    { emoji: '👁️', name: 'Ophthalmology', tag: 'LASIK & Cataract' },
    { emoji: '🏥', name: 'Elective Surgeries', tag: 'Specialty Procedures' }
  ];

  const whatClinicDoesntDo = [
    'No monthly EMI collection from patients',
    'No chasing patients for missed repayments',
    'No loan servicing or credit risk taken by clinic',
    'No complicated paper financing documentation'
  ];

  const patientSteps = [
    { num: '1', emoji: '🦷', title: 'Choose your treatment', desc: 'Discuss your treatment plan and total cost with your clinic.' },
    { num: '2', emoji: '📋', title: 'Apply for financing', desc: 'Complete the simple digital application with required KYC documents.' },
    { num: '3', emoji: '✅', title: 'Get an eligibility decision', desc: 'The lending partner reviews your application instantly.' },
    { num: '4', emoji: '💳', title: 'Pay through EMIs', desc: 'If approved, repay the lender according to the agreed repayment schedule.' }
  ];

  const comprehensiveFaqs = [
    {
      q: 'What is Clinaza?',
      a: 'Clinaza is an embedded healthcare patient financing platform that connects clinics with RBI-regulated Banks and NBFCs, allowing patients to pay for high-ticket treatments in flexible monthly EMIs.'
    },
    {
      q: 'Which treatments are eligible for EMI?',
      a: 'High-value planned procedures ranging from ₹30,000 to ₹3,00,000 including Dental Implants, Clear Aligners, Braces, Crowns, Orthopaedic surgeries, IVF/Fertility, and LASIK/Ophthalmology.'
    },
    {
      q: 'What is the financing amount limit?',
      a: 'Financing options typically range from ₹30,000 up to ₹3,00,000, tailored to patient eligibility and treatment estimate.'
    },
    {
      q: 'What documents does the patient need?',
      a: 'Basic digital KYC: PAN card, Aadhaar card (eKYC), proof of income (salary slip, bank statement, or ITR), and bank account details for e-NACH auto-debit setup.'
    },
    {
      q: 'Does the clinic pay any upfront fee?',
      a: 'No upfront fees for clinics. Partner clinics receive physical branding kits, QR standees, and onboarding support free of charge.'
    },
    {
      q: 'Who manages the loan and repayments?',
      a: 'Zero clinic involvement. The loan is funded, serviced, and collected directly by the RBI-regulated lending partner via automated monthly e-NACH auto-debit.'
    },
    {
      q: 'What determines the interest rate & terms?',
      a: 'Interest rates (typically ~15% p.a. standard or subvention options) and tenures (3–24 months) are set directly by the lending partner based on credit assessment.'
    },
    {
      q: 'Is loan approval guaranteed?',
      a: 'No. Clinaza facilitates the application process. Final loan approval, interest rate, and sanctioned amount are determined independently by the financing partner based on patient credit eligibility.'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-[#0B2450] font-sora antialiased overflow-x-hidden selection:bg-[#0867E8] selection:text-white">
      <SEOHead
        title="CLINAZA — Embedded Healthcare Patient Financing Infrastructure"
        description="Don't let treatment cost stop your patients. Offer flexible EMI financing for eligible patients (₹30K–₹3L) directly at your clinic checkout."
        keywords={[
          'clinaza', 'clinaza patient financing', 'clinaza healthpay', 'dhanlift clinaza loan',
          'free dental crm', 'free dental crm software india', 'best free dental clinic management software',
          'patient financing', 'dental emi', 'dental emi patna', 'healthcare lending', 
          'medical loan india', 'point of care financing', 'clinic emi option', 
          'embedded finance', 'dental implants financing', 'clear aligners emi',
          'root canal on emi', '0 interest medical loan india', 'how to offer emi to dental patients',
          'dentist digital marketing india', 'dentist social media marketing', 'dental clinic instagram growth', 
          'google review automation for dentists', 'dental clinic whatsapp marketing', 'how to get more dental patients india'
        ]}
        image="https://clinaza.in/og-preview.png"
        canonicalUrl="https://clinaza.in/"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Clinaza Dental CRM",
            "operatingSystem": "Web, iOS, Android (PWA)",
            "applicationCategory": "BusinessApplication",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "INR"
            },
            "description": "100% Free Dental Clinic Management CRM in India with automated WhatsApp patient recalls, digital prescriptions, and patient financing.",
            "url": "https://clinaza.in/reactivation/login",
            "author": {
              "@type": "Organization",
              "name": "Clinaza Technologies"
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "FinancialService",
            "name": "Clinaza",
            "description": "Embedded patient financing infrastructure enabling healthcare clinics & hospitals to offer point-of-care EMI loans.",
            "url": "https://clinaza.in/",
            "logo": "https://clinaza.in/assets/clinaza-logo.jpg",
            "image": "https://clinaza.in/og-preview.png",
            "areaServed": "IN",
            "serviceType": "Healthcare Patient Financing Infrastructure"
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How does Clinaza patient financing work?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Clinaza connects clinic patients directly with regulated lending partners to offer flexible monthly EMI options for treatments ranging from ₹30,000 to ₹3,00,000."
                }
              },
              {
                "@type": "Question",
                "name": "What treatments are covered under Clinaza EMI?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Clinaza supports dental implants, clear aligners, crowns & makeovers, orthopaedics, IVF, ophthalmology/LASIK, and other elective surgeries."
                }
              },
              {
                "@type": "Question",
                "name": "Does Clinaza require clinic integration?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No complex IT setup is required. Clinics can start offering financing instantly using the Clinaza partner link or checkout widget."
                }
              },
              {
                "@type": "Question",
                "name": "Which clinics in Patna offer Clinaza EMI financing?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Clinaza partner clinics in Patna include YOUR DENTIST Patna, PRODENT, Facio Dental, Smile Dental Clinic, Smile Point Dental Care, YouthONN Multispeciality Dental, Mundeshwari Dental Hub, and Pratima Dental Hospital among others."
                }
              }
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Clinaza Partner Dental Clinics",
            "description": "Dental clinics across India offering Clinaza point-of-care EMI patient financing",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "YOUR DENTIST Patna", "url": "https://clinaza.in/cities/patna" },
              { "@type": "ListItem", "position": 2, "name": "PRODENT Patna", "url": "https://clinaza.in/cities/patna" },
              { "@type": "ListItem", "position": 3, "name": "GuMzy Dental Gurgaon", "url": "https://clinaza.in/cities/gurgaon" },
              { "@type": "ListItem", "position": 4, "name": "Facio Dental Patna", "url": "https://clinaza.in/cities/patna" },
              { "@type": "ListItem", "position": 5, "name": "Smile Dental Clinic Patna", "url": "https://clinaza.in/cities/patna" },
              { "@type": "ListItem", "position": 6, "name": "Smile Point Dental Care Patna", "url": "https://clinaza.in/cities/patna" },
              { "@type": "ListItem", "position": 7, "name": "YouthONN Multispeciality Dental Patna", "url": "https://clinaza.in/cities/patna" },
              { "@type": "ListItem", "position": 8, "name": "Mundeshwari Dental Hub & Implant Patna", "url": "https://clinaza.in/cities/patna" },
              { "@type": "ListItem", "position": 9, "name": "Pratima Dental Hospital Patna", "url": "https://clinaza.in/cities/patna" }
            ]
          }
        ]}
      />

      {/* ── Header ── */}
      <header className="border-b border-slate-100 backdrop-blur-xl sticky top-0 z-50 bg-white/95 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex justify-between items-center gap-2">
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <img src="/assets/clinaza-logo.jpg" alt="CLINAZA" className="h-10 w-auto rounded-xl border border-slate-200 shadow-sm group-hover:scale-105 transition-transform" />
            <div className="hidden sm:block">
              <span className="text-xs font-black tracking-widest text-[#0B2450] block">CLINAZA</span>
              <span className="text-[9px] font-bold tracking-wider text-[#0f7a75] block uppercase">EMI FOR BETTER HEALTH</span>
            </div>
          </Link>
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <Link
              to="/tools"
              className="hidden xl:flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 rounded-xl transition-all"
            >
              <span>🛠️</span> Free Tools &amp; Rx
            </Link>
            <Link
              to="/blog"
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 hover:bg-slate-100 text-xs font-bold text-slate-700 rounded-xl transition-all"
            >
              <span>📖</span> Guides &amp; EMI
            </Link>
            <button
              type="button"
              onClick={() => {
                setShowEligibilityModal(true);
                setEligibilityStep(1);
              }}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-xs font-bold text-[#0867E8] rounded-xl transition-all whitespace-nowrap"
            >
              <ShieldCheck size={14} className="text-[#0867E8]" />
              Check EMI
            </button>
            <Link
              to="/reactivation/login"
              className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-[11px] sm:text-xs font-bold text-emerald-800 rounded-xl transition-all whitespace-nowrap"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Doctor Login 🔐
            </Link>
            <a
              href="https://wa.me/917292984244?text=Hi%20Clinaza%20team%2C%20I%20want%20to%20know%20more%20about%20Clinaza"
              target="_blank" rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-[#F7FAFC] hover:bg-slate-100 border border-slate-200 text-xs font-bold text-[#0B2450] rounded-xl transition-all whitespace-nowrap"
            >
              <MessageSquare size={14} className="text-[#0f7a75]" />
              WhatsApp
            </a>
            <a
              href="#partner-form"
              onClick={() => setFormType('clinic')}
              className="px-3 sm:px-5 py-2.5 sm:py-3 bg-[#0867E8] hover:bg-[#0756C7] text-white text-[11px] sm:text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#0867E8]/30 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap active:scale-95"
            >
              Partner <ArrowRight size={13} />
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* ── 1. HERO (MINIMAL LUXURY) ── */}
        <section aria-label="Hero" className="relative pt-8 sm:pt-14 pb-12 sm:pb-16 px-4 sm:px-6 max-w-5xl mx-auto space-y-8">


          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center text-left">
            <div className="md:col-span-7 space-y-4 sm:space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-[11px] font-medium text-slate-600">
                <Building2 className="h-3.5 w-3.5 text-[#0867E8]" />
                <span>Point-of-care treatment financing for clinics</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.025em] leading-[1.18] text-[#0B2450]">
                Don't let treatment cost<br />
                <span className="text-[#0867E8]">stop your patients.</span>
              </h1>

              <p className="text-xs sm:text-base text-slate-600 font-medium leading-relaxed max-w-xl">
                Help eligible patients access instant treatment financing &amp; flexible monthly EMIs from <strong className="text-[#0B2450] font-bold">₹30,000 to ₹5,00,000</strong> for Dental Implants, Hair Transplants, LASIK, IVF, and Elective Surgeries.
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    trackEvent('click_hero_check_eligibility');
                    trackEvent('eligibility_started', { source: 'hero_cta' });
                    setShowEligibilityModal(true);
                    setEligibilityStep(1);
                  }}
                  className="px-6 py-3.5 bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(8,103,232,0.25)] hover:shadow-[0_12px_28px_rgba(8,103,232,0.35)] transform active:scale-95"
                >
                  <ShieldCheck size={16} /> Check Patient Eligibility
                </button>
                <Link
                  to="/reactivation/login"
                  className="px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-600/15"
                >
                  Doctor Portal →
                </Link>
              </div>

              <p className="text-[11px] text-slate-500 pt-1">
                No CIBIL impact on patients &middot; RBI-regulated lending partners
              </p>
            </div>

            {/* Authentic Clinic Photo with subtle glass badge */}
            <div className="md:col-span-5 relative mt-2 md:mt-0">
              <div className="relative rounded-2xl sm:rounded-3xl p-1 bg-gradient-to-b from-slate-200 to-slate-100 shadow-[0_20px_40px_rgba(0,0,0,0.06)]">
                <img
                  src="/assets/clinic-hero-real.png"
                  alt="Modern authentic dental clinic treatment room in India"
                  className="w-full h-auto rounded-[14px] sm:rounded-[22px] object-cover aspect-[4/3]"
                />
              </div>
              <div className="absolute -bottom-2 -left-2 sm:-bottom-3 sm:-left-3 bg-white/95 backdrop-blur-xl border border-slate-200/80 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] flex items-center gap-2 sm:gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] sm:text-[11px] font-bold text-[#0B2450] tracking-tight">Point-of-Care EMI Ready</span>
              </div>
            </div>
          </div>

          {/* ── 1. POPULAR BANKS & NBFC LENDING ECOSYSTEM SLIDESHOW ── */}
          <div className="pt-6 border-t border-slate-200/60 max-w-5xl mx-auto space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-1 text-center sm:text-left">
              <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase flex items-center gap-1.5">
                <Landmark size={14} className="text-[#0867E8]" /> FINANCING ECOSYSTEM &bull; BANKS &amp; REGULATED NBFCs
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2.5 py-0.5 rounded-full">
                ✓ 100% RBI Compliant Digital Lending
              </span>
            </div>

            {/* Continuous Seamless Slideshow Marquee */}
            <div className="relative overflow-hidden py-3.5 px-2 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-sm group">
              {/* Fade Edges */}
              <div className="absolute left-0 inset-y-0 w-16 sm:w-24 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 inset-y-0 w-16 sm:w-24 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

              <div className="flex w-max gap-4 animate-marquee group-hover:[animation-play-state:paused]">
                {[
                  // 1st Set of Banks & NBFCs
                  { id: 'hdfc', name: 'HDFC Bank', sub: 'Banking Partner', badge: 'Bank' },
                  { id: 'icici', name: 'ICICI Bank', sub: 'Digital Lending', badge: 'Bank' },
                  { id: 'axis', name: 'Axis Bank', sub: 'Jarvis APIs', badge: 'Bank' },
                  { id: 'bajaj', name: 'Bajaj Finserv', sub: 'EMI Network', badge: 'NBFC' },
                  { id: 'tata', name: 'Tata Capital', sub: 'Healthcare Loan', badge: 'NBFC' },
                  { id: 'piramal', name: 'Piramal Finance', sub: 'Retail Financing', badge: 'NBFC' },
                  { id: 'kotak', name: 'Kotak Bank', sub: 'Point-of-Care', badge: 'Bank' },
                  { id: 'lt', name: 'L&T Finance', sub: 'Medical EMI', badge: 'NBFC' },
                  { id: 'abcl', name: 'Aditya Birla', sub: 'Capital Finance', badge: 'NBFC' },
                  { id: 'poonawalla', name: 'Poonawalla Fincorp', sub: 'Consumer Finance', badge: 'NBFC' },
                  { id: 'chola', name: 'Cholamandalam', sub: 'Chola Finance', badge: 'NBFC' },
                  { id: 'smfg', name: 'SMFG India Credit', sub: 'Fullerton Credit', badge: 'NBFC' },
                  { id: 'muthoot', name: 'Muthoot Finance', sub: 'Personal Lending', badge: 'NBFC' },
                  { id: 'incred', name: 'InCred Finance', sub: 'Digital NBFC', badge: 'NBFC' },
                  { id: 'dmi', name: 'DMI Finance', sub: 'Digital Credit', badge: 'NBFC' },
                  { id: 'liquiloans', name: 'LiquiLoans', sub: 'P2P NBFC', badge: 'NBFC' },
                  { id: 'dhanlift', name: 'Dhanlift', sub: 'EMI Sourcing Partner', badge: 'LSP' },

                  // 2nd Set for Seamless Infinite Loop
                  { id: 'hdfc', name: 'HDFC Bank', sub: 'Banking Partner', badge: 'Bank' },
                  { id: 'icici', name: 'ICICI Bank', sub: 'Digital Lending', badge: 'Bank' },
                  { id: 'axis', name: 'Axis Bank', sub: 'Jarvis APIs', badge: 'Bank' },
                  { id: 'bajaj', name: 'Bajaj Finserv', sub: 'EMI Network', badge: 'NBFC' },
                  { id: 'tata', name: 'Tata Capital', sub: 'Healthcare Loan', badge: 'NBFC' },
                  { id: 'piramal', name: 'Piramal Finance', sub: 'Retail Financing', badge: 'NBFC' },
                  { id: 'kotak', name: 'Kotak Bank', sub: 'Point-of-Care', badge: 'Bank' },
                  { id: 'lt', name: 'L&T Finance', sub: 'Medical EMI', badge: 'NBFC' },
                  { id: 'abcl', name: 'Aditya Birla', sub: 'Capital Finance', badge: 'NBFC' },
                  { id: 'poonawalla', name: 'Poonawalla Fincorp', sub: 'Consumer Finance', badge: 'NBFC' },
                  { id: 'chola', name: 'Cholamandalam', sub: 'Chola Finance', badge: 'NBFC' },
                  { id: 'smfg', name: 'SMFG India Credit', sub: 'Fullerton Credit', badge: 'NBFC' },
                  { id: 'muthoot', name: 'Muthoot Finance', sub: 'Personal Lending', badge: 'NBFC' },
                  { id: 'incred', name: 'InCred Finance', sub: 'Digital NBFC', badge: 'NBFC' },
                  { id: 'dmi', name: 'DMI Finance', sub: 'Digital Credit', badge: 'NBFC' },
                  { id: 'liquiloans', name: 'LiquiLoans', sub: 'P2P NBFC', badge: 'NBFC' },
                  { id: 'dhanlift', name: 'Dhanlift', sub: 'EMI Sourcing Partner', badge: 'LSP' }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-slate-50/90 border border-slate-200/90 shrink-0 transition-all hover:bg-white hover:border-slate-300 hover:shadow-xs"
                  >
                    {/* Logo container */}
                    <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center shrink-0 shadow-2xs bg-white border border-slate-100">
                      <BankSvgLogo id={item.id} size={32} />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-xs font-bold text-[#0B2450] whitespace-nowrap">{item.name}</span>
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide ${
                          item.badge === 'Bank'
                            ? 'bg-blue-50 text-blue-600'
                            : item.badge === 'LSP'
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-orange-50 text-orange-600'
                        }`}>
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 whitespace-nowrap">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Animated Stats Bar ── */}
            <StatsBar />

            {/* Quick 4-point Trust Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-left pt-2">
              {[
                { title: '₹30K – ₹5L Limits', desc: 'Flexible monthly tenures' },
                { title: 'Regulated Partners', desc: 'RBI registered Banks & NBFCs' },
                { title: '100% Digital eKYC', desc: 'Paperless 2-min checks' },
                { title: 'Direct Disbursal', desc: 'Zero bad debt risk for clinics' }
              ].map((item, idx) => (
                <div key={idx} className="bg-white/70 backdrop-blur-sm border border-slate-200/70 p-3 rounded-2xl transition-all hover:border-blue-400/40 hover:shadow-xs space-y-0.5">
                  <div className="flex items-center gap-1.5 text-[#0B2450] font-black text-xs">
                    <CheckCircle2 size={13} className="text-[#0f7a75] shrink-0" aria-hidden="true" />
                    <span>{item.title}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 pl-4">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 2. PROBLEM & CLINIC VALUE ("TURN I'LL DO IT LATER INTO LET'S START") ── */}
        <section aria-label="The Problem & Value" className="py-12 sm:py-16 px-4 sm:px-6 bg-[#F5F9FC] border-y border-blue-50">
          <FadeIn className="max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0B2450]">Turn "I'll do it later" into "Let's start."</h2>
              <p className="text-sm text-slate-500 max-w-xl mx-auto">Patients say yes when treatment feels affordable. Clinaza makes that possible at the point of care.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Without Financing */}
              <div className="bg-white border border-rose-100 p-6 rounded-2xl space-y-4 text-left shadow-2xs">
                <div className="flex items-center gap-2 text-rose-600 font-black text-xs uppercase tracking-wider">
                  <X size={16} /> Without Financing
                </div>
                <ul className="space-y-3 text-xs text-slate-700 font-medium">
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-500 font-bold">•</span> High upfront treatment estimates paralyze decision-making
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-500 font-bold">•</span> Patients postpone treatment plans for months or walk away
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-500 font-bold">•</span> Treatment delays lead to worsening health & lost clinic revenue
                  </li>
                </ul>
              </div>

              {/* With Clinaza */}
              <div className="bg-white border border-[#0f7a75]/30 p-6 rounded-2xl space-y-4 text-left shadow-sm">
                <div className="flex items-center gap-2 text-[#0f7a75] font-black text-xs uppercase tracking-wider">
                  <Check size={16} /> With Clinaza
                </div>
                <ul className="space-y-3 text-xs text-slate-700 font-medium">
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#0f7a75] font-bold">✓</span> Flexible financing option for eligible patients right at checkout
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#0f7a75] font-bold">✓</span> High-value procedures (Implants, Aligners) become affordable
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#0f7a75] font-bold">✓</span> Zero clinic burden — NBFC handles collections directly
                  </li>
                </ul>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* ── 3. HOW CLINAZA WORKS (SIMPLE 3-STEP) ── */}
        <section aria-label="How Clinaza Works" className="py-12 sm:py-16 px-4 sm:px-6">
          <FadeIn className="max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0B2450]">How Clinaza works</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { num: '01', title: 'Patient Chooses Treatment', desc: 'Patient discusses treatment and total estimate with your clinic.' },
                { num: '02', title: 'Check Financing Eligibility', desc: 'Clinaza helps the patient apply with a suitable financing partner in minutes.' },
                { num: '03', title: 'Treatment Goes Ahead', desc: 'Once approved and disbursed, patient receives care and pays lender in EMIs.' }
              ].map((step, idx) => (
                <div key={idx} className="bg-[#F7FAFC] border border-slate-200/80 p-6 rounded-2xl space-y-3 text-left shadow-2xs">
                  <span className="text-3xl font-mono font-black text-[#0f7a75] block">{step.num}</span>
                  <h3 className="text-sm font-black text-[#0B2450]">{step.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </section>

        {/* ── 4. TREATMENT CATEGORIES (MULTI-SPECIALTY) ── */}
        <section aria-label="Supported Treatments" className="py-12 sm:py-16 px-4 sm:px-6 bg-[#F7FAFC] border-y border-slate-200/60">
          <FadeIn className="max-w-5xl mx-auto space-y-8 text-center">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0B2450]">Treatments we support</h2>
              <p className="text-sm text-slate-500">EMI financing from ₹30,000 to ₹5,00,000 across dental, vision, fertility, and surgical care.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 text-left">
              {[
                { 
                  emoji: '🦷', 
                  category: 'Dental Care', 
                  treatments: 'Implants, Aligners, Crowns & Full Mouth Rehab',
                  link: '/blog/dental-implants-cost-on-emi-india'
                },
                { 
                  emoji: '🦱', 
                  category: 'Hair & Aesthetics', 
                  treatments: 'Hair Transplant (FUE), Liposuction & Gynecomastia',
                  link: '/blog/hair-transplant-cost-on-emi-india-guide'
                },
                { 
                  emoji: '👁️', 
                  category: 'Ophthalmology', 
                  treatments: 'Contoura Vision, SMILE, ICL & Cataract Lenses',
                  link: '/blog/lasik-eye-surgery-cost-on-emi-india-guide'
                },
                { 
                  emoji: '👶', 
                  category: 'IVF & Fertility', 
                  treatments: 'IVF Cycles, ICSI, IUI & Egg Freezing Packages',
                  link: '/blog/ivf-cost-on-emi-fertility-treatment-financing-india'
                },
                { 
                  emoji: '🦴', 
                  category: 'Orthopaedics & Surgeries', 
                  treatments: 'Knee Replacement, Bariatric, ACL & Daycare Surgeries',
                  link: '/blog/knee-replacement-surgery-cost-on-emi-india'
                }
              ].map((cat, idx) => (
                <Link 
                  key={idx} 
                  to={cat.link}
                  className="bg-white border border-slate-200 hover:border-blue-500/50 p-4 rounded-2xl space-y-2 transition-all shadow-2xs hover:shadow-md group block"
                >
                  <span className="text-2xl block group-hover:scale-110 transition-transform" role="img" aria-label={cat.category}>{cat.emoji}</span>
                  <div>
                    <h3 className="text-xs font-black text-[#0B2450] group-hover:text-[#0867E8] transition-colors leading-tight">{cat.category}</h3>
                    <p className="text-[10px] text-slate-500 mt-1 leading-snug">{cat.treatments}</p>
                  </div>
                  <span className="text-[9px] font-bold text-[#0867E8] inline-flex items-center gap-0.5 pt-1">
                    View Pricing &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </FadeIn>
        </section>

        {/* ── 4.4 MOBILE CRM APP SHOWCASE ── */}
        <section aria-label="Mobile CRM Experience" className="py-14 sm:py-20 px-4 sm:px-6 bg-[#0B1120] text-white relative overflow-hidden border-t border-slate-800">

          <div className="max-w-5xl mx-auto space-y-10 relative z-10">
            <div className="text-center space-y-3">
              <span className="text-xs font-medium text-slate-400">Free cloud-based dental CRM</span>
              <h2 className="text-2xl sm:text-4xl font-bold text-white leading-tight">
                Your entire practice,<br />managed from your phone.
              </h2>
              <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
                WhatsApp recall, FDI tooth charting, digital prescriptions, and revenue analytics — free forever, no per-patient fees.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Key Features */}
              <div className="lg:col-span-6 space-y-4 text-left order-2 lg:order-1">
                {[
                  {
                    icon: '💬',
                    title: 'Automated WhatsApp Patient Recall',
                    desc: 'Automatically re-engage dormant patients who haven’t visited in 6+ months with personalized WhatsApp recall messages.'
                  },
                  {
                    icon: '🦷',
                    title: 'Interactive FDI Tooth Charting & EMR',
                    desc: 'Point-and-click tooth charting for RCT, crowns, implants, and extractions with immediate treatment cost estimation.'
                  },
                  {
                    icon: '📱',
                    title: 'Instant Digital Prescriptions (Rx)',
                    desc: 'Generate branded, professional Rx with dental drug dosages and share directly to patient WhatsApp in 2 clicks.'
                  },
                  {
                    icon: '⚡',
                    title: '100% Free Forever with Zero Hidden Fees',
                    desc: 'No monthly subscriptions, no staff user limits, and unlimited patient records synced securely in the cloud.'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="border-l-2 border-slate-700 hover:border-blue-500 pl-4 py-1 transition-colors">
                    <h3 className="text-sm font-semibold text-white leading-tight mb-1">{item.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/reactivation/login"
                    className="px-6 py-3.5 bg-gradient-to-r from-[#0867E8] to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all text-center shadow-lg shadow-blue-600/30"
                  >
                    Launch Free Doctor Portal →
                  </Link>
                  <a
                    href="https://wa.me/917292984244?text=Hi%20Clinaza%2C%20I%20want%20a%20free%20demo%20of%20the%20dental%20CRM%20software"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all text-center flex items-center justify-center gap-2"
                  >
                    <MessageSquare size={15} className="text-emerald-400" /> Book 1-on-1 Demo
                  </a>
                </div>
              </div>

              {/* Right Column: Realistic Mobile App UI Frame */}
              <div className="lg:col-span-6 flex justify-center order-1 lg:order-2">
                <div className="w-[300px] sm:w-[320px] bg-[#0B132B] rounded-[40px] p-2.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95),0_0_0_2px_rgba(255,255,255,0.15),0_0_0_8px_#1E293B,0_0_45px_rgba(8,103,232,0.45)] relative">
                  <div className="bg-[#070D1D] rounded-[32px] p-3 text-left border border-white/10 space-y-2.5 relative overflow-hidden">
                    {/* Dynamic Island Notch */}
                    <div className="w-20 h-4 bg-black rounded-full mx-auto flex items-center justify-between px-2 mb-1">
                      <div className="w-1.5 h-1.5 bg-slate-800 rounded-full"></div>
                      <div className="w-1 h-1 bg-blue-900 rounded-full"></div>
                    </div>

                    {/* App Header */}
                    <div className="flex items-center justify-between pb-1 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0867E8] to-[#00D4B8] flex items-center justify-center text-white font-extrabold text-[11px] shadow-sm">
                          YD
                        </div>
                        <div>
                          <h4 className="text-[11px] font-extrabold text-white leading-tight">YOUR DENTIST</h4>
                          <p className="text-[8px] text-sky-400 font-semibold">Patliputra Colony, Patna</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[7.5px] font-bold text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Live EMR
                      </div>
                    </div>

                    {/* Revenue Card */}
                    <div className="bg-gradient-to-br from-[#0867E8]/30 via-slate-900/80 to-slate-900 p-2.5 rounded-xl border border-blue-500/40 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[8.5px] uppercase font-bold tracking-wider text-slate-400">Clinical Revenue (August)</span>
                        <span className="text-[7.5px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">▲ 41.2%</span>
                      </div>
                      <div className="text-lg font-black text-white">₹6,84,500</div>
                      <div className="grid grid-cols-3 gap-1 pt-1.5 border-t border-white/10 text-center">
                        <div>
                          <div className="text-[9.5px] font-extrabold text-white">128</div>
                          <div className="text-[7px] text-slate-400">Total Patients</div>
                        </div>
                        <div>
                          <div className="text-[9.5px] font-extrabold text-sky-300">42</div>
                          <div className="text-[7px] text-slate-400">Reactivated</div>
                        </div>
                        <div>
                          <div className="text-[9.5px] font-extrabold text-emerald-400">₹0</div>
                          <div className="text-[7px] text-slate-400">Bad Debts</div>
                        </div>
                      </div>
                    </div>

                    {/* Active Patient EMR & FDI Tooth Chart */}
                    <div className="bg-slate-900/80 border border-white/10 p-2.5 rounded-xl space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-[8px] font-extrabold flex items-center justify-center">RS</div>
                          <span className="text-[10px] font-bold text-white">Rahul Sharma (34M)</span>
                        </div>
                        <span className="text-[7.5px] px-1.5 py-0.5 bg-amber-500/15 border border-amber-500/30 text-amber-300 rounded font-bold">RCT + Crown</span>
                      </div>

                      {/* Mini Tooth FDI Matrix */}
                      <div className="flex justify-between bg-black/40 p-1.5 rounded-lg border border-white/5">
                        {[
                          { num: '14', tag: 'UR4', active: false },
                          { num: '16', tag: 'RCT', active: 'red' },
                          { num: '26', tag: 'IMP', active: 'blue' },
                          { num: '36', tag: 'LL6', active: false },
                          { num: '46', tag: 'LR6', active: false }
                        ].map((tooth, tidx) => (
                          <div key={tidx} className="flex flex-col items-center gap-0.5">
                            <div className={`w-4 h-4 rounded text-[7.5px] font-bold flex items-center justify-center ${
                              tooth.active === 'red' ? 'bg-red-600 text-white shadow-[0_0_8px_rgba(239,68,68,0.7)] border border-red-400' :
                              tooth.active === 'blue' ? 'bg-blue-600 text-white shadow-[0_0_8px_rgba(8,103,232,0.7)] border border-blue-400' :
                              'bg-slate-800 text-slate-400 border border-white/5'
                            }`}>
                              {tooth.num}
                            </div>
                            <span className="text-[6.5px] text-slate-400 font-semibold">{tooth.tag}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* WhatsApp Automation Stream */}
                    <div className="bg-slate-900/80 border border-emerald-500/30 p-2 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-xs">
                          💬
                        </div>
                        <div>
                          <div className="text-[9px] font-bold text-white">Auto WhatsApp Recall</div>
                          <div className="text-[7.5px] text-emerald-300">32 Dormant Patients Reached</div>
                        </div>
                      </div>
                      <span className="text-[7.5px] px-1.5 py-0.5 bg-emerald-500 text-slate-950 font-black rounded uppercase">Active</span>
                    </div>

                    {/* Today's Schedule */}
                    <div className="bg-slate-900/80 border border-white/10 p-2 rounded-xl space-y-1">
                      <div className="flex justify-between items-center text-[8px] font-bold text-slate-400 uppercase">
                        <span>Today's Schedule</span>
                        <span className="text-sky-400">4 Appointments</span>
                      </div>
                      <div className="space-y-1 text-[8px]">
                        <div className="flex justify-between items-center text-slate-300 border-t border-white/5 pt-1">
                          <span className="text-blue-400 font-bold">04:30 PM</span>
                          <span className="font-semibold text-white">Pooja Verma</span>
                          <span className="text-[7px] px-1 bg-slate-800 rounded text-slate-300">Aligner Review</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-300 border-t border-white/5 pt-1">
                          <span className="text-blue-400 font-bold">05:15 PM</span>
                          <span className="font-semibold text-white">Amit Kumar</span>
                          <span className="text-[7px] px-1 bg-slate-800 rounded text-slate-300">Crown Trial #16</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4.5 DENTIST SOCIAL MEDIA & BRAND GROWTH ── */}
        <section aria-label="Dentist Growth & Social Media" className="py-12 sm:py-16 px-4 sm:px-6 bg-gradient-to-br from-indigo-950 via-slate-900 to-[#0B2450] text-white">
          <div className="max-w-5xl mx-auto space-y-8 text-center">
            <div className="space-y-2">
              <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-bold uppercase tracking-widest inline-block">
                CLINIC GROWTH & MARKETING
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Dentist Social Media & Brand Growth Management
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
                In addition to EMI financing, Clinaza manages Instagram Reels, Google 5-Star Reviews, Patient Case Studies, and High-Ticket Lead Ads for dental clinics.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-left">
              {[
                { title: 'Instagram Reels & Content', desc: 'Custom patient transformation reels, educational posts & doctor personal branding tailored for dentists.' },
                { title: 'Google Maps & 5-Star Reviews', desc: 'Automated review collection tools to boost your clinic rating and rank #1 on Google Local.' },
                { title: 'High-Ticket Patient Ads', desc: 'Targeted Instagram & Meta ads driving consultation bookings for Dental Implants & Clear Aligners.' },
                { title: 'Full Brand Management', desc: 'Consistent visual branding, patient story highlights & social media community management.' }
              ].map((service, idx) => (
                <div key={idx} className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-2 shadow-xl hover:border-emerald-500/40 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-black flex items-center justify-center text-xs mb-2">
                    0{idx + 1}
                  </div>
                  <h3 className="text-sm font-bold text-white leading-snug">{service.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{service.desc}</p>
                </div>
              ))}
            </div>



            {/* Verified Meta Ads Lead Generation Case Study */}
            <div className="bg-slate-900/95 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl max-w-4xl mx-auto text-left space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                    <Sparkles size={11} /> Real Campaign Benchmark
                  </div>
                  <h3 className="text-lg sm:text-2xl font-black text-white">
                    Verified Meta Ads Case Study: 37 Patient Conversations at ₹7.68 / Lead
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Most digital marketing agencies charge dental clinics ₹150–₹350 per lead. Here is an actual verified Meta Ads Manager campaign run by Clinaza in East India:
                  </p>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <div className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-center">
                    <span className="text-[9px] text-slate-400 uppercase font-bold block">Cost / Result</span>
                    <span className="text-sm font-black text-emerald-400">₹7.68</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-center">
                    <span className="text-[9px] text-slate-400 uppercase font-bold block">Total Inquiries</span>
                    <span className="text-sm font-black text-white">37 Chats</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-7 rounded-2xl overflow-hidden border border-slate-700 shadow-xl bg-slate-950">
                  <img
                    src="/assets/clinaza-meta-ads-case-study.jpg"
                    alt="Clinaza Dental Clinic Instagram Ads Case Study - 37 Patients at ₹7.68 per conversation"
                    className="w-full h-auto object-cover"
                  />
                </div>

                <div className="md:col-span-5 space-y-4">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    Why Clinaza Dental Ads Outperform Generic Agencies:
                  </h4>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold shrink-0">✓</span>
                      <span><strong>Hyper-Local Radius:</strong> Targets patients within 3–5km of your clinic pin.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold shrink-0">✓</span>
                      <span><strong>Procedure-Specific Copy:</strong> Tailored for Dental Implants, Braces & Aligners.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold shrink-0">✓</span>
                      <span><strong>Easy EMI Hook:</strong> Patients book immediately knowing they can pay in flexible monthly installments.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold shrink-0">✓</span>
                      <span><strong>Direct to WhatsApp:</strong> Zero form drop-off; patient connects to your reception desk directly.</span>
                    </li>
                  </ul>

                  <a
                    href="https://wa.me/917292984244?text=Hi%20Clinaza%2C%20I%20saw%20your%20Meta%20Ads%20case%20study%20(%E2%82%B97.68%20per%20lead).%20I%20want%20high-converting%20ads%20for%20my%20dental%20clinic."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-95"
                  >
                    <MessageSquare size={15} /> Launch Ads For Your Clinic →
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://wa.me/917292984244?text=Hi%20Clinaza%2C%20I%20want%20Social%20Media%20Management%20%26%20Growth%20Marketing%20for%20my%20dental%20clinic"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-emerald-500/20 transform hover:-translate-y-0.5"
              >
                <MessageSquare size={16} /> Get Social Media Management for Your Clinic
              </a>
            </div>
          </div>
        </section>

        {/* ── 5. EARLY ELIGIBILITY CHECKER PROMPT ── */}
        <section aria-label="Eligibility Prompt" className="py-12 px-4 sm:px-6 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#0B2450] to-[#0867E8] text-white p-7 sm:p-9 rounded-3xl text-center space-y-4 shadow-xl">
            <span className="text-[10px] font-black text-[#12A8A0] uppercase tracking-widest block">INSTANT PRE-CHECK</span>
            <h3 className="text-xl sm:text-3xl font-black">See if your patient may be eligible for financing</h3>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto leading-relaxed">
              Initial assessment only. Final approval, loan amount and interest rate are decided by the financing partner.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  trackEvent('click_mid_check_eligibility');
                  trackEvent('eligibility_started', { source: 'mid_banner' });
                  setShowEligibilityModal(true);
                  setEligibilityStep(1);
                }}
                className="px-8 py-3.5 bg-white text-[#0B2450] hover:bg-slate-100 text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 inline-flex items-center gap-2"
              >
                <ShieldCheck size={16} className="text-[#0867E8]" /> Check Patient Eligibility
              </button>
            </div>
            <p className="text-[10px] text-blue-200/80 max-w-md mx-auto leading-tight">
              *Initial assessment only. Final loan approval, loan amount, and interest rate are determined independently by the financing partner.
            </p>
          </div>
        </section>

        {/* ── 6. EMI CALCULATOR & INSTANT EMI VIDEO ── */}
        <section aria-label="EMI Calculator" className="py-12 sm:py-16 px-4 sm:px-6 bg-[#F7FAFC] border-y border-slate-200/60">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-black text-[#0f7a75] uppercase tracking-widest">COST PLANNER &amp; CLINIC WALKTHROUGH</span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#0B2450]">Calculate EMI &amp; See How It Works</h2>
              <p className="text-xs sm:text-sm text-slate-600">Indicative estimate only. Actual rate depends on lender assessment.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Interactive Calculator (7 cols) */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                  {/* Left: Controls */}
                  <div className="p-6 sm:p-7 space-y-6 border-b md:border-b-0 md:border-r border-slate-100">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-black text-[#0B2450] uppercase tracking-wider">Treatment Amount</label>
                        <span className="text-sm font-black text-[#0867E8]">₹{emiAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <input
                        type="range"
                        min={30000}
                        max={300000}
                        step={5000}
                        value={emiAmount}
                        onChange={e => {
                          setEmiAmount(Number(e.target.value));
                          trackEvent('calculator_used', { amount: Number(e.target.value), tenure: emiTenure });
                        }}
                        className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[#0867E8]"
                        aria-label="Treatment amount slider"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                        <span>₹30,000</span>
                        <span>₹3,00,000</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-black text-[#0B2450] uppercase tracking-wider block">Repayment Tenure</label>
                      <div className="grid grid-cols-4 gap-2">
                        {[3, 6, 12, 24].map(t => (
                          <button
                            key={t}
                            onClick={() => setEmiTenure(t)}
                            className={`py-2.5 rounded-xl text-xs font-black border transition-all ${
                              emiTenure === t
                                ? 'bg-[#0867E8] text-white border-[#0867E8] shadow-md'
                                : 'bg-[#F7FAFC] text-[#0B2450] border-slate-200 hover:border-[#0867E8]'
                            }`}
                          >
                            {t}M
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Result */}
                  <div className="p-6 sm:p-7 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="bg-gradient-to-br from-[#0867E8] to-[#0f7a75] rounded-2xl p-4 text-white text-center space-y-1 shadow-md">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">Indicative Monthly EMI</p>
                        <p className="text-3xl font-black">₹{monthlyEMI.toLocaleString('en-IN')}</p>
                        <p className="text-[10px] text-white/80 font-medium">per month &times; {emiTenure} months</p>
                      </div>

                      <div className="space-y-1.5">
                        {[
                          { label: 'Principal Amount', value: `₹${emiAmount.toLocaleString('en-IN')}`, accent: false },
                          { label: 'Est. Interest (15% p.a.)', value: `₹${totalInterest.toLocaleString('en-IN')}`, accent: false },
                          { label: 'Est. Total Payable', value: `₹${totalPayable.toLocaleString('en-IN')}`, accent: true },
                        ].map((row, idx) => (
                          <div key={idx} className={`flex justify-between items-center px-3 py-2 rounded-xl text-xs font-bold ${row.accent ? 'bg-[#0867E8]/8 border border-[#0867E8]/20 text-[#0B2450]' : 'bg-[#F7FAFC] border border-slate-100 text-slate-600'}`}>
                            <span>{row.label}</span>
                            <span className={row.accent ? 'text-[#0867E8]' : ''}>{row.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          trackEvent('click_calc_check_eligibility');
                          setShowEligibilityModal(true);
                          setEligibilityStep(1);
                        }}
                        className="w-full py-3 bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                      >
                        <ShieldCheck size={15} /> Check Patient Eligibility →
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Embedded Auto-playing 9:16 Video (5 cols) */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="w-full max-w-[340px] sm:max-w-[360px] bg-slate-900 border-2 border-slate-800 rounded-3xl p-3 shadow-2xl relative">
                  <div className="flex items-center justify-between px-2 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-[11px] font-black text-emerald-400 uppercase tracking-wider">
                        Doctor &amp; Patient Reel
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                      9:16 HD
                    </span>
                  </div>

                  <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-black shadow-inner border border-slate-800/80">
                    <video
                      src="/renders/clinaza-emi-reel.mp4"
                      autoPlay
                      loop
                      muted
                      playsInline
                      controls
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="pt-3 px-1 text-center">
                    <p className="text-[11px] font-bold text-slate-300">
                      ⚡ 2-min paperless digital KYC &bull; 55+ Lending Partners
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Doctor Helpline: <strong className="text-emerald-400 font-black">+91 7292984244</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 7. WHY CLINICS USE CLINAZA ── */}
        <section aria-label="Why Clinics Use Clinaza" className="py-12 sm:py-16 px-4 sm:px-6 max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-black text-[#0f7a75] uppercase tracking-widest">FOR CLINIC OWNERS</span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#0B2450]">Why Clinics Use Clinaza</h2>
          </div>

          {/* Prominent ₹0 Clinic Fees Highlight Badge */}
          <div className="bg-gradient-to-r from-[#0f7a75]/10 to-[#0867E8]/10 border border-[#0f7a75]/30 p-5 rounded-2xl text-center max-w-2xl mx-auto shadow-2xs">
            <span className="text-2xl font-black text-[#0f7a75] block">₹0 Clinic Fees</span>
            <p className="text-xs font-bold text-[#0B2450] mt-0.5">No upfront fee or EMI collection responsibility for the clinic.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-left">
            {[
              { title: '₹0 Upfront Fee', desc: 'Free setup and branding materials for onboarded clinics.' },
              { title: 'Free Dental CRM Access', desc: '100% free patient reactivation & treatment follow-up portal for life.' },
              { title: 'No EMI Collection Burden', desc: 'No chasing patients for repayments — handled entirely by NBFC.' },
              { title: 'Financing by Partners', desc: 'All loans funded and serviced by RBI-regulated lenders.' },
              { title: 'Higher Ticket Conversions', desc: 'Helps eligible patients manage higher treatment costs easily.' },
              { title: 'Digital Application', desc: 'Paperless 100% online point-of-care pre-assessment.' }
            ].map((item, idx) => (
              <div key={idx} className="bg-[#F7FAFC] border border-slate-200 p-5 rounded-2xl space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#0f7a75] shrink-0" />
                  <strong className="text-xs font-black text-[#0B2450]">{item.title}</strong>
                </div>
                <p className="text-[11px] text-slate-600 pl-6 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Sticky Clinic CTA Banner */}
          <div className="bg-[#F5F9FC] border border-blue-100 p-6 rounded-3xl text-center space-y-3 shadow-2xs max-w-xl mx-auto">
            <h3 className="text-base font-black text-[#0B2450]">Want to offer EMI to your patients?</h3>
            <a
              href="#partner-form"
              onClick={() => setFormType('clinic')}
              className="inline-flex items-center gap-2 px-7 py-3 bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md"
            >
              Partner With Clinaza &rarr;
            </a>
          </div>
        </section>

        {/* ── 8. ONBOARDED PARTNER CLINICS NETWORK (SLIDESHOW CAROUSEL) ── */}
        <section aria-label="Onboarded Partner Clinics" className="py-14 sm:py-18 px-4 sm:px-6 bg-gradient-to-b from-[#F7FAFC] to-slate-100 border-y border-slate-200/60 overflow-hidden relative">
          <div className="max-w-5xl mx-auto space-y-8 text-center">
            <div className="space-y-2">
              <span className="text-[10px] font-black text-[#0f7a75] uppercase tracking-widest flex items-center justify-center gap-1.5">
                <Building2 size={16} /> TRUSTED CLINIC NETWORK
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#0B2450]">Onboarded Partner Clinics</h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
                Leading healthcare clinics &amp; dental hospitals offering instant point-of-care patient EMI financing powered by Clinaza.
              </p>
            </div>

            {/* Continuous Smooth Slideshow Container */}
            <div className="relative overflow-hidden py-4 px-2 bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/90 shadow-sm group">
              {/* Fade Edges */}
              <div className="absolute left-0 inset-y-0 w-12 sm:w-20 bg-gradient-to-r from-[#F7FAFC] via-[#F7FAFC]/80 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 inset-y-0 w-12 sm:w-20 bg-gradient-to-l from-[#F7FAFC] via-[#F7FAFC]/80 to-transparent z-10 pointer-events-none" />

              <div className="flex w-max gap-4 animate-marquee-slow group-hover:[animation-play-state:paused]">
                {[
                  // Set 1
                  {
                    name: 'YOUR DENTIST Patna',
                    location: 'Patliputra Colony, Patna',
                    phone: '062014 78033',
                    rating: '5.0 ★ (Primary Partner)',
                    specialties: 'Implants, Braces & Aligners',
                    link: 'https://www.yourdentistpatna.in/blog/clinaza-patient-financing-dental-emi-patna',
                    isExternal: true,
                    accent: 'border-emerald-400 bg-white shadow-sm',
                    badge: 'Featured Center',
                    badgeColor: 'bg-emerald-600 text-white'
                  },
                  {
                    name: 'PRODENT',
                    location: 'West Boring Canal Rd, Anandpuri, Patna',
                    phone: '084290 57093',
                    rating: '4.9 ★ (95 reviews)',
                    specialties: 'Multispeciality Dental Clinic',
                    link: 'https://www.prodentpatna.com/blog/no-cost-emi-dental-treatments-patna.html',
                    isExternal: true,
                    accent: 'border-slate-200 bg-white shadow-sm',
                    badge: 'Partner Clinic',
                    badgeColor: 'bg-slate-100 text-slate-700 border border-slate-200'
                  },
                  {
                    name: 'GuMzy Dental',
                    location: 'Sector 56, Gurgaon, Haryana',
                    phone: 'Direct Partner Desk',
                    rating: '5.0 ★ (30 reviews)',
                    specialties: 'Painless RCT & Aesthetics',
                    link: '/cities/gurgaon',
                    accent: 'border-slate-200 bg-white shadow-sm',
                    badge: 'Partner Clinic',
                    badgeColor: 'bg-slate-100 text-slate-700 border border-slate-200'
                  },
                  {
                    name: 'Facio Dental',
                    location: 'Boring Road, Patna, Bihar',
                    phone: 'Direct Partner Desk',
                    rating: '4.5 ★ (417 reviews)',
                    specialties: 'Complex Orthodontics & Surgery',
                    link: '/cities/patna',
                    accent: 'border-slate-200 bg-white shadow-sm',
                    badge: 'Partner Clinic',
                    badgeColor: 'bg-slate-100 text-slate-700 border border-slate-200'
                  },
                  {
                    name: 'Smile Dental Clinic',
                    location: 'Pillar 39, Ashok Rajpath, Patna',
                    phone: '062028 26097',
                    rating: '5.0 ★ (104 reviews)',
                    specialties: 'Dental Implants & Scaling',
                    link: '/cities/patna',
                    accent: 'border-slate-200 bg-white shadow-sm',
                    badge: 'Partner Clinic',
                    badgeColor: 'bg-slate-100 text-slate-700 border border-slate-200'
                  },
                  {
                    name: 'Smile Point Dental Care',
                    location: 'Kankarbagh, Patna, Bihar',
                    phone: 'Direct Partner Desk',
                    rating: '4.9 ★ (308 reviews)',
                    specialties: 'Painless RCT & Advanced Care',
                    link: '/cities/patna',
                    accent: 'border-slate-200 bg-white shadow-sm',
                    badge: 'Partner Clinic',
                    badgeColor: 'bg-slate-100 text-slate-700 border border-slate-200'
                  },
                  {
                    name: 'YouthONN Multispeciality',
                    location: 'Nehru Nagar Rd, Patliputra, Patna',
                    phone: '077397 46086',
                    rating: '5.0 ★ (133 reviews)',
                    specialties: 'Multispeciality Dental Care',
                    link: '/cities/patna',
                    accent: 'border-slate-200 bg-white shadow-sm',
                    badge: 'Partner Clinic',
                    badgeColor: 'bg-slate-100 text-slate-700 border border-slate-200'
                  },
                  {
                    name: 'Mundeshwari Dental Hub',
                    location: 'Rajeev Nagar Main Rd, Patna',
                    phone: '085441 65535',
                    rating: '5.0 ★ (153 reviews)',
                    specialties: 'Implant Centre & Surgery',
                    link: '/cities/patna',
                    accent: 'border-slate-200 bg-white shadow-sm',
                    badge: 'Partner Clinic',
                    badgeColor: 'bg-slate-100 text-slate-700 border border-slate-200'
                  },
                  {
                    name: 'Pratima Dental Hospital',
                    location: 'Ashiana - Digha Rd, Patna',
                    phone: '074628 36028',
                    rating: '4.8 ★ (113 reviews)',
                    specialties: 'Hospital & Cosmetic Dentistry',
                    link: '/cities/patna',
                    accent: 'border-slate-200 bg-white shadow-sm',
                    badge: 'Partner Clinic',
                    badgeColor: 'bg-slate-100 text-slate-700 border border-slate-200'
                  },

                  // Set 2 for Infinite Seamless Loop
                  {
                    name: 'YOUR DENTIST Patna',
                    location: 'Patliputra Colony, Patna',
                    phone: '062014 78033',
                    rating: '5.0 ★ (Primary Partner)',
                    specialties: 'Implants, Braces & Aligners',
                    link: 'https://www.yourdentistpatna.in/blog/clinaza-patient-financing-dental-emi-patna',
                    isExternal: true,
                    accent: 'border-emerald-400 bg-white shadow-sm',
                    badge: 'Featured Center',
                    badgeColor: 'bg-emerald-600 text-white'
                  },
                  {
                    name: 'PRODENT',
                    location: 'West Boring Canal Rd, Anandpuri, Patna',
                    phone: '084290 57093',
                    rating: '4.9 ★ (95 reviews)',
                    specialties: 'Multispeciality Dental Clinic',
                    link: 'https://www.prodentpatna.com/blog/no-cost-emi-dental-treatments-patna.html',
                    isExternal: true,
                    accent: 'border-slate-200 bg-white shadow-sm',
                    badge: 'Partner Clinic',
                    badgeColor: 'bg-slate-100 text-slate-700 border border-slate-200'
                  },
                  {
                    name: 'GuMzy Dental',
                    location: 'Sector 56, Gurgaon, Haryana',
                    phone: 'Direct Partner Desk',
                    rating: '5.0 ★ (30 reviews)',
                    specialties: 'Painless RCT & Aesthetics',
                    link: '/cities/gurgaon',
                    accent: 'border-slate-200 bg-white shadow-sm',
                    badge: 'Partner Clinic',
                    badgeColor: 'bg-slate-100 text-slate-700 border border-slate-200'
                  },
                  {
                    name: 'Facio Dental',
                    location: 'Boring Road, Patna, Bihar',
                    phone: 'Direct Partner Desk',
                    rating: '4.5 ★ (417 reviews)',
                    specialties: 'Complex Orthodontics & Surgery',
                    link: '/cities/patna',
                    accent: 'border-slate-200 bg-white shadow-sm',
                    badge: 'Partner Clinic',
                    badgeColor: 'bg-slate-100 text-slate-700 border border-slate-200'
                  },
                  {
                    name: 'Smile Dental Clinic',
                    location: 'Pillar 39, Ashok Rajpath, Patna',
                    phone: '062028 26097',
                    rating: '5.0 ★ (104 reviews)',
                    specialties: 'Dental Implants & Scaling',
                    link: '/cities/patna',
                    accent: 'border-slate-200 bg-white shadow-sm',
                    badge: 'Partner Clinic',
                    badgeColor: 'bg-slate-100 text-slate-700 border border-slate-200'
                  },
                  {
                    name: 'Smile Point Dental Care',
                    location: 'Kankarbagh, Patna, Bihar',
                    phone: 'Direct Partner Desk',
                    rating: '4.9 ★ (308 reviews)',
                    specialties: 'Painless RCT & Advanced Care',
                    link: '/cities/patna',
                    accent: 'border-slate-200 bg-white shadow-sm',
                    badge: 'Partner Clinic',
                    badgeColor: 'bg-slate-100 text-slate-700 border border-slate-200'
                  },
                  {
                    name: 'YouthONN Multispeciality',
                    location: 'Nehru Nagar Rd, Patliputra, Patna',
                    phone: '077397 46086',
                    rating: '5.0 ★ (133 reviews)',
                    specialties: 'Multispeciality Dental Care',
                    link: '/cities/patna',
                    accent: 'border-slate-200 bg-white shadow-sm',
                    badge: 'Partner Clinic',
                    badgeColor: 'bg-slate-100 text-slate-700 border border-slate-200'
                  },
                  {
                    name: 'Mundeshwari Dental Hub',
                    location: 'Rajeev Nagar Main Rd, Patna',
                    phone: '085441 65535',
                    rating: '5.0 ★ (153 reviews)',
                    specialties: 'Implant Centre & Surgery',
                    link: '/cities/patna',
                    accent: 'border-slate-200 bg-white shadow-sm',
                    badge: 'Partner Clinic',
                    badgeColor: 'bg-slate-100 text-slate-700 border border-slate-200'
                  },
                  {
                    name: 'Pratima Dental Hospital',
                    location: 'Ashiana - Digha Rd, Patna',
                    phone: '074628 36028',
                    rating: '4.8 ★ (113 reviews)',
                    specialties: 'Hospital & Cosmetic Dentistry',
                    link: '/cities/patna',
                    accent: 'border-slate-200 bg-white shadow-sm',
                    badge: 'Partner Clinic',
                    badgeColor: 'bg-slate-100 text-slate-700 border border-slate-200'
                  }
                ].map((clinic, idx) => (
                  <div 
                    key={idx} 
                    className={`w-[280px] sm:w-[320px] shrink-0 p-4 sm:p-5 rounded-2xl border ${clinic.accent} space-y-3 flex flex-col justify-between transition-all hover:border-[#0867E8]/40 hover:shadow-md text-left`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-bold text-[#0B2450] leading-snug">{clinic.name}</h3>
                          <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin size={12} className="text-[#0f7a75] shrink-0" /> {clinic.location}
                          </p>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${clinic.badgeColor}`}>
                          {clinic.badge}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-slate-100 text-[11px] space-y-1">
                        <p className="text-slate-600"><span className="font-bold text-[#0B2450]">Rating:</span> {clinic.rating}</p>
                        <p className="text-slate-500"><span className="font-bold text-[#0B2450]">Phone / Contact:</span> {clinic.phone}</p>
                        <p className="text-slate-500"><span className="font-bold text-[#0B2450]">Services:</span> {clinic.specialties}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-lg">
                        ✓ EMI Accepted
                      </span>
                      {clinic.isExternal ? (
                        <a href={clinic.link} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-[#0867E8] hover:underline flex items-center gap-0.5">
                          Read Case &rarr;
                        </a>
                      ) : (
                        <Link to={clinic.link} className="text-[10px] font-bold text-[#0867E8] hover:underline flex items-center gap-0.5">
                          Check EMI &rarr;
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-slate-500">
              <span>Explore Clinaza partner network in 50+ cities:</span>
              <div className="flex items-center gap-2">
                {['Patna', 'Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Pune'].map(c => (
                  <Link key={c} to={`/cities/${c.toLowerCase()}`} className="text-[#0867E8] hover:underline font-bold">
                    {c}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 8. STICKER KIT SECTION ── */}
        <section aria-label="Clinic Sticker Kit" className="py-12 px-4 sm:px-6 bg-[#F7FAFC] border-y border-slate-200/60">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-6 text-left max-w-5xl mx-auto shadow-xs">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-6 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0f7a75]/10 rounded-full text-[10px] font-bold text-[#0f7a75]">
                    <Package size={14} /> FREE FOR ONBOARDED CLINICS
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#0B2450] leading-tight">
                    Get Free "EMI Available Here" Glass Door Stickers
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Build instant patient trust at your clinic entrance. Every onboarded partner clinic receives a physical branding kit including weatherproof glass door decals and counter QR displays.
                  </p>
                  <ul className="space-y-2">
                    {[
                      { icon: Award, title: 'Glass Door Decal', desc: 'Premium weatherproof vinyl round sticker' },
                      { icon: Truck, title: 'Free Express Delivery', desc: 'Shipped to your clinic address across India' }
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                        <item.icon size={15} className="text-[#0867E8] shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-[#0B2450] block">{item.title}</strong>
                          <span className="text-[10px] text-slate-500">{item.desc}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div>
                    <a
                      href="#partner-form"
                      onClick={() => setFormType('clinic')}
                      className="inline-flex items-center gap-2 px-5 py-3 bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-sm"
                    >
                      Get Free Clinic Kit &rarr;
                    </a>
                  </div>
                </div>

                <div className="md:col-span-6 relative">
                  <img
                    src="/assets/clinaza-clinic-sticker.jpg"
                    alt="Clinaza EMI Available Here official glass door decal sticker"
                    className="w-full h-auto rounded-2xl border border-slate-200 shadow-md object-cover aspect-[4/3]"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── PATIENT ELIGIBILITY 2-STEP MODAL ── */}
        {showEligibilityModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white border border-slate-200 rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-5 text-left max-h-[85vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
              <button
                type="button"
                onClick={() => { setShowEligibilityModal(false); setShowLenderResults(false); }}
                className="absolute top-4 right-4 sm:top-5 sm:right-5 text-slate-400 hover:text-slate-600 w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              {/* Modal Header */}
              <div className="space-y-1">
                <span className="text-[10px] font-black text-[#0f7a75] uppercase tracking-widest block">PATIENT FINANCING CHECK</span>
                <h3 className="text-xl font-black text-[#0B2450]">
                  {showLenderResults ? `${getMatchedLenders().length} Lenders Matched` : 'Check Financing Eligibility'}
                </h3>
                <p className="text-xs text-slate-500">
                  {showLenderResults
                    ? `Based on ${patientData.name}'s profile — share a link for them to apply directly`
                    : 'Fill in the details below to find matching lenders'}
                </p>
              </div>

              {showLenderResults ? (
                /* ── RESULTS VIEW ── */
                <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-1">
                  {getMatchedLenders().length === 0 ? (
                    <div className="text-center py-8 space-y-2">
                      <div className="text-3xl">😔</div>
                      <p className="text-sm font-bold text-slate-600">No lenders matched this profile</p>
                      <p className="text-xs text-slate-400">Try adjusting the profile answers</p>
                    </div>
                  ) : (
                    getMatchedLenders().map(lender => (
                      <div key={lender.id} className={`flex items-center justify-between p-3.5 rounded-2xl border ${lender.color}`}>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-[#0B2450]">{lender.name}</span>
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/70 border border-current">{lender.badge}</span>
                          </div>
                          <p className="text-[11px] font-medium opacity-80">{lender.rate}</p>
                        </div>
                        <a
                          href={lender.url}
                          className="shrink-0 ml-3 px-3.5 py-2 bg-[#0867E8] hover:bg-[#0756C7] text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shadow-sm active:scale-95"
                        >
                          Apply →
                        </a>
                      </div>
                    ))
                  )}
                  <button
                    type="button"
                    onClick={() => setShowLenderResults(false)}
                    className="w-full py-3 text-xs font-bold text-slate-500 hover:text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all mt-1"
                  >
                    ← Edit Patient Profile
                  </button>
                </div>
              ) : (
              <>

              {eligibilityStep === 1 ? (
                <form onSubmit={handlePatientEligibilitySubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">

                  {/* Name + Mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label htmlFor="patient-name" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Full Name *</label>
                      <input
                        id="patient-name"
                        type="text"
                        required
                        placeholder="e.g. Ankit Sharma"
                        value={patientData.name}
                        onChange={e => setPatientData({ ...patientData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-[#F7FAFC] border border-slate-200 rounded-xl text-xs text-[#0B2450] placeholder-slate-400 focus:outline-none focus:border-[#0867E8]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="patient-mobile" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Mobile Number *</label>
                      <input
                        id="patient-mobile"
                        type="tel"
                        required
                        placeholder="e.g. 9876543210"
                        value={patientData.mobile}
                        onChange={e => setPatientData({ ...patientData, mobile: e.target.value })}
                        className="w-full px-4 py-3 bg-[#F7FAFC] border border-slate-200 rounded-xl text-xs text-[#0B2450] placeholder-slate-400 focus:outline-none focus:border-[#0867E8]"
                      />
                    </div>
                  </div>

                  {/* Treatment Category & Amount */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label htmlFor="patient-treatment" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Treatment Needed *</label>
                      <select
                        id="patient-treatment"
                        value={patientData.treatment}
                        onChange={e => setPatientData({ ...patientData, treatment: e.target.value })}
                        className="w-full px-4 py-3 bg-[#F7FAFC] border border-slate-200 rounded-xl text-xs text-[#0B2450] focus:outline-none focus:border-[#0867E8]"
                      >
                        <option value="Dental Implants & Aligners">🦷 Dental Implants / Clear Aligners</option>
                        <option value="Hair Transplant & Aesthetics">🦱 Hair Transplant / Cosmetic Surgery</option>
                        <option value="LASIK & Eye Surgery">👁️ LASIK / Contoura / Cataract</option>
                        <option value="IVF & Fertility Treatment">👶 IVF / Fertility Treatment</option>
                        <option value="Knee & Orthopaedic Surgery">🦴 Knee Replacement / Ortho Surgery</option>
                        <option value="General / Laparoscopic Surgery">🏥 Laparoscopic & Other Surgeries</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="patient-amount" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Estimated Amount *</label>
                      <select
                        id="patient-amount"
                        value={patientData.amount}
                        onChange={e => setPatientData({ ...patientData, amount: e.target.value })}
                        className="w-full px-4 py-3 bg-[#F7FAFC] border border-slate-200 rounded-xl text-xs text-[#0B2450] focus:outline-none focus:border-[#0867E8]"
                      >
                        <option value="₹30,000 – ₹60,000">₹30,000 – ₹60,000</option>
                        <option value="₹60,000 – ₹1,20,000">₹60,000 – ₹1,20,000</option>
                        <option value="₹1,20,000 – ₹2,50,000">₹1,20,000 – ₹2,50,000</option>
                        <option value="₹2,50,000 – ₹5,00,000">₹2,50,000 – ₹5,00,000</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!patientData.name || !patientData.mobile}
                    className={`w-full py-4 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 ${
                      patientData.name && patientData.mobile
                        ? 'bg-[#0867E8] hover:bg-[#0756C7] text-white cursor-pointer'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Find Matching Lenders →
                  </button>
                  <p className="text-[10px] text-slate-500 text-center leading-relaxed">
                    Your information will be securely queried live against Clinaza partnered bank/NBFC APIs with your consent.
                  </p>
                </form>
              ) : (
                <div className="space-y-5">
                  {/* WhatsApp Verification Notice */}
                  <div className="bg-[#F5F9FC] border border-blue-100 p-4 rounded-2xl flex items-start gap-3 text-left">
                    <MessageSquare size={20} className="text-[#0f7a75] shrink-0 mt-0.5" />
                    <div className="space-y-1 text-xs">
                      <span className="font-bold text-[#0B2450] block">Send Documents via WhatsApp</span>
                      <p className="text-slate-600 leading-relaxed text-[11px]">
                        Since API connections are handled offline, please send your KYC documents directly to our Clinaza financing desk on WhatsApp for instant eligibility processing.
                      </p>
                    </div>
                  </div>

                  {/* Initial Eligibility Assessment Summary Card */}
                  <div className="bg-[#F7FAFC] border border-slate-200 p-3.5 rounded-2xl space-y-1 text-xs">
                    <span className="text-[10px] font-mono font-bold text-[#0756C7] uppercase tracking-wider block">
                      ✓ Initial Eligibility Assessment Complete
                    </span>
                    <div className="text-[11px] text-slate-700 space-y-0.5 pt-1 font-medium">
                      <p>👤 <strong>Patient Name:</strong> {patientData.name || 'Not provided'}</p>
                      <p>📱 <strong>Mobile Number:</strong> {patientData.mobile || 'Not provided'}</p>
                    </div>
                    <p className="text-[10px] text-slate-500 pt-1 leading-relaxed border-t border-slate-200 mt-2">
                      Final approval, interest rate and loan amount are subject to lender assessment.
                    </p>
                  </div>

                  {/* Document Requirements Checklist */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Documents to send on WhatsApp:</span>
                    <ul className="space-y-2">
                      {[
                        { title: 'PAN Card Copy', desc: 'For credit score evaluation' },
                        { title: 'Aadhaar / Photo ID', desc: 'Identity & address verification' },
                        { title: 'Income Proof', desc: patientData.incomeProof }
                      ].map((doc, idx) => (
                        <li key={idx} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl text-xs shadow-2xs">
                          <div>
                            <span className="font-bold text-[#0B2450] block">{doc.title}</span>
                            <span className="text-[10px] text-slate-500">{doc.desc}</span>
                          </div>
                          <span className="text-[10px] font-bold text-[#0f7a75] bg-[#0f7a75]/10 px-2.5 py-1 rounded-full shrink-0">Send on WA</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setEligibilityStep(1)}
                      className="w-1/3 py-3 bg-slate-100 hover:bg-slate-200 text-[#0B2450] font-bold text-xs rounded-xl transition-all"
                    >
                      &larr; Edit Details
                    </button>
                    <a
                      href={`https://wa.me/917292984244?text=${encodeURIComponent(
                        `Hi Clinaza, I want to check my financing eligibility.\n\n` +
                        `Name: ${patientData.name || 'N/A'}\n` +
                        `Mobile: ${patientData.mobile || 'N/A'}\n\n` +
                        `I am ready to share my details for verification.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        trackEvent('eligibility_whatsapp_sent', {
                          name: patientData.name,
                          treatment: patientData.treatment,
                          cibil: patientData.cibilScore
                        });
                      }}
                      className="w-2/3 py-3.5 bg-[#0f7a75] hover:bg-[#0c635f] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <MessageSquare size={16} /> Send Documents on WhatsApp &rarr;
                    </a>
                  </div>

                  <p className="text-[10px] text-slate-400 text-center">
                    Your documents are reviewed privately by Clinaza & partnered NBFC desk officers only.
                  </p>
                </div>
              )}
              </>
              )}
            </div>
          </div>
        )}

        {/* ── 7. COMPREHENSIVE FAQ ── */}
        <section aria-label="Frequently Asked Questions" className="py-16 px-6 max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-black text-[#0f7a75] uppercase tracking-widest flex items-center justify-center gap-1.5">
              <HelpCircle size={16} aria-hidden="true" /> FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#0B2450]">Common Questions</h2>
            <p className="text-xs text-slate-600">Everything doctors and patients ask about Clinaza financing.</p>
          </div>

          <div className="space-y-3">
            {comprehensiveFaqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="bg-[#F7FAFC] border border-slate-200 rounded-2xl overflow-hidden shadow-2xs transition-all">
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-slate-100/60 transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-bold text-[#0B2450]">{faq.q}</span>
                    <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-[#0756C7]' : ''}`} aria-hidden="true" />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-200/60 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 8. CLINIC CTA & REGISTRATION FORM ── */}
        <section id="partner-form" aria-label="Clinic Partner Registration" className="py-16 px-6 max-w-2xl mx-auto">
          <div className="bg-[#F7FAFC] border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xl space-y-6 text-left">
            {/* Form Toggle Header */}
            <div className="flex bg-slate-200/70 p-1 rounded-xl mb-2">
              <button
                type="button"
                onClick={() => setFormType('clinic')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  formType === 'clinic' ? 'bg-white text-[#0B2450] shadow-xs' : 'text-slate-600 hover:text-[#0B2450]'
                }`}
              >
                🏥 For Clinics & Hospitals
              </button>
              <button
                type="button"
                onClick={() => setFormType('lender')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  formType === 'lender' ? 'bg-[#0867E8] text-white shadow-xs' : 'text-slate-600 hover:text-[#0B2450]'
                }`}
              >
                🏦 For NBFCs & Lenders
              </button>
            </div>

            <div className="text-center space-y-2">
              <span className="text-[10px] font-black text-[#0f7a75] uppercase tracking-widest">
                {formType === 'clinic' ? 'CLINIC PARTNER APPLICATION' : 'NBFC & LENDER PARTNERSHIP'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0B2450]">
                {formType === 'clinic' ? 'Ready to help more patients say YES to treatment?' : 'Partner with Clinaza as a Capital Provider'}
              </h2>
              <p className="text-xs font-medium text-slate-600">
                {formType === 'clinic'
                  ? 'Offer financing through Clinaza. Tell us about your clinic and we will get in touch.'
                  : 'Access high-intent healthcare treatment financing demand through our clinic network.'}
              </p>
            </div>

            {submitted ? (
              <div className="bg-white border border-[#0f7a75]/40 p-8 rounded-2xl text-center space-y-3 shadow-sm">
                <CheckCircle2 size={40} className="text-[#0f7a75] mx-auto" aria-hidden="true" />
                <h3 className="text-lg font-black text-[#0B2450]">Inquiry Received!</h3>
                <p className="text-xs text-slate-600">Our partnership team will reach out within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate onFocus={() => trackEvent('clinic_form_started', { formType })}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="doctor-name" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {formType === 'clinic' ? 'Your Name *' : 'Contact Person / Designation *'}
                    </label>
                    <input
                      id="doctor-name"
                      type="text"
                      required
                      placeholder={formType === 'clinic' ? 'e.g. Dr. Rajesh Sharma' : 'e.g. Head of Co-Lending / LSP Partnerships'}
                      value={formData.doctorName}
                      onChange={e => setFormData({ ...formData, doctorName: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-[#0B2450] placeholder-slate-400 focus:outline-none focus:border-[#0867E8]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="clinic-name" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {formType === 'clinic' ? 'Clinic / Hospital Name *' : 'Bank / NBFC Name *'}
                    </label>
                    <input
                      id="clinic-name"
                      type="text"
                      required
                      placeholder={formType === 'clinic' ? 'e.g. Apollo Dental Care' : 'e.g. Chinmay Finlease / Capital NBFC'}
                      value={formData.clinicName}
                      onChange={e => setFormData({ ...formData, clinicName: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-[#0B2450] placeholder-slate-400 focus:outline-none focus:border-[#0867E8]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="phone-number" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Phone / WhatsApp *</label>
                    <input
                      id="phone-number"
                      type="tel"
                      required
                      placeholder="e.g. 7292984244"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-[#0B2450] placeholder-slate-400 focus:outline-none focus:border-[#0867E8]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="clinic-city" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">City *</label>
                    <input
                      id="clinic-city"
                      type="text"
                      required
                      placeholder="e.g. Mumbai, Delhi, Bengaluru"
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-[#0B2450] placeholder-slate-400 focus:outline-none focus:border-[#0867E8]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="treatment-speciality" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {formType === 'clinic' ? 'Treatment Speciality' : 'Partnership Focus'}
                  </label>
                  <select
                    id="treatment-speciality"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-[#0B2450] focus:outline-none focus:border-[#0867E8]"
                  >
                    {formType === 'clinic' ? (
                      <>
                        <option value="Dental Clinic (Implants & Aligners)">Dental Clinic (Implants &amp; Aligners)</option>
                        <option value="Hair & Aesthetic Surgery Clinic">Hair &amp; Aesthetic Surgery Clinic</option>
                        <option value="Eye Hospital & Laser Vision Centre">Eye Hospital &amp; Laser Vision Centre</option>
                        <option value="IVF & Fertility Centre">IVF &amp; Fertility Centre</option>
                        <option value="Orthopaedic & Joint Replacement Hospital">Orthopaedic &amp; Joint Replacement Hospital</option>
                        <option value="Multispeciality & Daycare Hospital">Multispeciality &amp; Daycare Hospital</option>
                      </>
                    ) : (
                      <>
                        <option value="FLDG-Backed LSP Partnership">FLDG-Backed LSP Partnership</option>
                        <option value="Co-Lending API Integration">Co-Lending API Integration</option>
                        <option value="Direct Loan Origination">Direct Loan Origination</option>
                        <option value="Pilot Launch Discussion">Pilot Launch Discussion</option>
                      </>
                    )}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#0867E8] hover:bg-[#0756C7] disabled:opacity-60 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-[#0867E8]/25 flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                >
                  {isSubmitting
                    ? 'Submitting…'
                    : formType === 'clinic'
                    ? 'Become a Clinaza Partner'
                    : 'Become a Lending Partner'}
                  <Send size={14} aria-hidden="true" />
                </button>

                <p className="text-center text-xs text-slate-500 font-mono pt-1">
                  Or email:{' '}
                  <a href="mailto:contact@clinaza.in" className="text-[#0867E8] font-bold underline">
                    contact@clinaza.in
                  </a>
                  {' '}&middot; WhatsApp:{' '}
                  <a href="https://wa.me/917292984244" target="_blank" rel="noopener noreferrer" className="text-[#0f7a75] font-bold underline">
                    +91 7292984244
                  </a>
                </p>
              </form>
            )}
          </div>
        </section>

        {/* ── 9. LENDER CTA FOOTER STRIP ("FOR LENDERS") ── */}
        <section aria-label="For Lenders" className="py-8 sm:py-12 px-5 sm:px-6 bg-gradient-to-r from-[#0B2450] to-[#0867E8] text-white">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 text-center sm:text-left">
            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-[#12A8A0]">
                <Landmark size={18} aria-hidden="true" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#12A8A0]">FOR LENDERS & NBFCS</span>
              </div>
              <h3 className="text-base sm:text-xl font-black">Are you a Bank, NBFC or Healthcare Lender?</h3>
              <p className="text-xs text-blue-100/90 max-w-xl">
                Partner with Clinaza to access high-intent healthcare treatment financing demand through our growing clinic network.
              </p>
            </div>
            <a
              href="#partner-form"
              onClick={() => setFormType('lender')}
              className="px-6 py-3 bg-white text-[#0B2450] hover:bg-slate-100 text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shrink-0 transform hover:-translate-y-0.5"
            >
              Become a Lending Partner &rarr;
            </a>
          </div>
        </section>
      </main>

      {/* ── Mobile Floating Quick Action Pill ── */}
      <div 
        className="sm:hidden fixed bottom-4 left-4 right-4 z-40 flex items-center gap-2 p-1.5 bg-[#0B2450]/90 backdrop-blur-xl border border-white/15 rounded-full shadow-[0_12px_36px_rgba(0,0,0,0.35)]"
        style={{ marginBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <button
          onClick={() => {
            trackEvent('click_mobile_floating_eligibility');
            setShowEligibilityModal(true);
            setEligibilityStep(1);
          }}
          className="flex-1 py-2.5 px-4 bg-[#0867E8] text-white rounded-full text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-95"
        >
          <ShieldCheck size={14} /> Check EMI
        </button>
        <Link
          to="/reactivation/login"
          className="py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-bold whitespace-nowrap active:scale-95 transition-colors"
        >
          Doctor Login
        </Link>
      </div>

      {/* Remotion Clinaza EMI Reel Modal */}
      <RemotionVideoModal
        isOpen={showEmiReelModal}
        onClose={() => setShowEmiReelModal(false)}
        mode="clinaza-emi"
        emiReelData={{
          headline: "Don't Delay Your Dental Treatment Because of Cost 🦷💸",
          treatmentName: "Dental Implants & Aligners",
          totalCost: 60000,
          monthlyEmi: 2650,
          tenureMonths: 24,
          websiteUrl: "clinaza.in"
        }}
      />

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200 py-6 sm:py-10 px-5 sm:px-6 bg-white text-center sm:text-left pb-20 sm:pb-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-3">
            <img src="/assets/clinaza-logo.jpg" alt="CLINAZA" className="h-8 w-auto rounded-lg border border-slate-200" />
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#0B2450] block">CLINAZA</span>
              <span className="text-[8px] font-bold text-[#0f7a75] block uppercase">TREATMENT FINANCING &amp; CLINIC CRM</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-4 text-xs text-slate-600 font-medium">
            <a href="tel:+917292984244" className="hover:text-[#0867E8] transition-colors font-bold flex items-center gap-1.5">
              📞 +91 7292984244
            </a>
            <span className="hidden sm:inline text-slate-300" aria-hidden="true">&middot;</span>
            <a href="https://wa.me/917292984244" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 transition-colors font-bold flex items-center gap-1.5">
              💬 WhatsApp Support
            </a>
            <span className="hidden sm:inline text-slate-300" aria-hidden="true">&middot;</span>
            <a href="mailto:contact@clinaza.in" className="hover:text-[#0867E8] transition-colors">contact@clinaza.in</a>
          </div>
          <nav aria-label="Footer navigation" className="flex flex-wrap justify-center sm:justify-end items-center gap-3 text-[10px] text-slate-500 font-mono uppercase tracking-widest">
            <Link to="/tools" className="hover:text-[#0867E8] transition-colors underline">Free Tools</Link>
            <span aria-hidden="true">&middot;</span>
            <Link to="/blog" className="hover:text-[#0f7a75] transition-colors underline">Patient Guides</Link>
            <span aria-hidden="true">&middot;</span>
            <Link to="/reactivation/login" className="hover:text-[#0B2450] transition-colors font-bold">Doctor Portal</Link>
          </nav>
        </div>
        <div className="max-w-6xl mx-auto mt-4 pt-3 border-t border-slate-100 text-center text-[10px] text-slate-400 font-mono">
          © 2026 CLINAZA Technologies. All Rights Reserved. &middot; Direct Helpline: +91 7292984244
        </div>
      </footer>
    </div>
  );
}
