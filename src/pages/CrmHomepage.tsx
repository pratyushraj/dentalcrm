import React, { useState, useEffect } from 'react';
import { useInView, useCountUp, useSmoothValue } from '../hooks/useScrollAnimation';
import { Link, useLocation } from 'react-router-dom';
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
  Landmark,
  Lock,
  MapPin,
  ChevronRight,
  Loader2,
  Copy,
  QrCode,
  Zap,
  Clock,
  Wrench,
  BookOpen,
  Eye,
  Baby,
  Activity,
  Sparkles,
  Stethoscope,
  TrendingUp,
  Smartphone,
  FileCheck,
  CreditCard,
  Play
} from 'lucide-react';
import { emailNotificationService } from '../services/emailNotificationService';
import { easycredService } from '../services/easycredService';
import { toast } from 'sonner';
import { SEOHead } from '@/components/seo/SEOHead';
import { CITIES } from '@/data/cities';
import { TaglineReveal } from '@/components/TaglineReveal';
import { ClinicCityFinder } from '@/components/ClinicCityFinder';
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
    { value: 35, suffix: '+', label: 'Payment & EMI Modes', prefix: '' },
    { value: 21, suffix: '+', label: 'Credit Card Banks', prefix: '' },
    { value: 2, suffix: ' min', label: 'Cardless Digital eKYC', prefix: '' },
    { value: 0, suffix: '%', label: 'Clinic Collection Risk', prefix: '' },
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

const SIM_SPECIALTIES = [
  {
    id: 'dental',
    label: 'Dental Care',
    icon: Stethoscope,
    clinicName: 'Apex Smile Dental Clinic',
    doctorPrefix: 'Dr. Vikram',
    procedures: [
      { name: 'Invisible Clear Aligners', defaultAmt: 65000 },
      { name: 'Single Dental Implant', defaultAmt: 35000 },
      { name: 'Full Arch All-on-4', defaultAmt: 120000 },
      { name: 'Smile Makeover', defaultAmt: 48000 },
      { name: 'Root Canal + Zirconia Crown', defaultAmt: 18000 }
    ]
  },
  {
    id: 'derma',
    label: 'Aesthetics & Skin',
    icon: Sparkles,
    clinicName: 'Lagom Aesthetic & Wellness Clinic',
    doctorPrefix: 'Dr. Ami',
    procedures: [
      { name: 'GFC & PRP Skin Rejuvenation (4 Sessions)', defaultAmt: 32000 },
      { name: 'HIFU Face & Neck Lifting', defaultAmt: 45000 },
      { name: 'HIEMT Body Sculpting (6 Sessions)', defaultAmt: 55000 },
      { name: 'Advanced Nutrition & Metabolic Plan', defaultAmt: 25000 },
      { name: 'Dermal Fillers & Botox Plan', defaultAmt: 38000 }
    ]
  },
  {
    id: 'hair',
    label: 'Hair Restoration',
    icon: Sparkles,
    clinicName: 'Elite Roots Hair Restoration',
    doctorPrefix: 'Dr. Rohan',
    procedures: [
      { name: 'FUE Hair Transplant (2,500 Grafts)', defaultAmt: 75000 },
      { name: 'DHI Mega Session (4,000 Grafts)', defaultAmt: 125000 },
      { name: 'GFC Hair Loss Therapy (6 Sessions)', defaultAmt: 36000 },
      { name: 'Bio-PRP Hair Regrowth Protocol', defaultAmt: 24000 }
    ]
  },
  {
    id: 'ivf',
    label: 'IVF & Fertility',
    icon: Baby,
    clinicName: 'Aura Fertility & Reproductive Care',
    doctorPrefix: 'Dr. Priya',
    procedures: [
      { name: 'Self-Cycle IVF with ICSI', defaultAmt: 165000 },
      { name: 'Advanced IVF with Blastocyst Culture', defaultAmt: 220000 },
      { name: 'Oocyte Cryopreservation (Egg Freezing)', defaultAmt: 120000 },
      { name: 'IUI Treatment Protocol (3 Cycles)', defaultAmt: 42000 }
    ]
  },
  {
    id: 'eyecare',
    label: 'Eye & Surgery',
    icon: Eye,
    clinicName: 'ClearVision Eye & Surgical Centre',
    doctorPrefix: 'Dr. Mehta',
    procedures: [
      { name: 'Custom Contoura Vision LASIK', defaultAmt: 70000 },
      { name: 'SMILE Pro Flapless Eye Surgery', defaultAmt: 95000 },
      { name: 'Multifocal ICL Lens Implantation', defaultAmt: 110000 },
      { name: 'Robotic Femto-Cataract (Both Eyes)', defaultAmt: 85000 }
    ]
  }
];

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
  const [isFinancingSuccess, setIsFinancingSuccess] = useState(false);
  const [customerLink, setCustomerLink] = useState('');
  const [maskedMobile, setMaskedMobile] = useState('');
  const [passCopied, setPassCopied] = useState(false);

  // Auto-open eligibility modal if navigating with #check-eligibility or ?action=check-eligibility
  useEffect(() => {
    if (location.hash === '#check-eligibility' || location.search.includes('action=check-eligibility')) {
      setShowEligibilityModal(true);
    }
  }, [location]);

  // Show mobile sticky bar only after scrolling past hero
  const [showMobileFloating, setShowMobileFloating] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setShowMobileFloating(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [patientData, setPatientData] = useState({
    name: '',
    mobile: '',
    treatment: 'Dental Implants & Aligners',
    amount: '₹60,000 – ₹1,20,000',
  });
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

  // Calculator mode: 'patient' (Monthly EMI) vs 'doctor' (Clinic ROI Recovery)
  const [calcMode, setCalcMode] = useState<'patient' | 'doctor'>('patient');
  const [roiConsultations, setRoiConsultations] = useState(35);
  const [roiAvgTicket, setRoiAvgTicket] = useState(65000);

  // Interactive Hero Phone Simulator procedure & tenure state (Improvement 1)
  const HERO_TREATMENT_PRESETS = [
    { id: 'implants', name: 'Dental Implants & Crown', amount: 85000, label: '🦷 Single Implant' },
    { id: 'aligners', name: 'Invisible Clear Aligners', amount: 65000, label: '💎 Clear Aligners' },
    { id: 'fullarch', name: 'Full Arch Rehabilitation', amount: 120000, label: '👑 Full Arch All-on-4' },
    { id: 'smile', name: 'Zirconia Smile Makeover', amount: 48000, label: '✨ Smile Makeover' },
  ];
  const [heroTreatment, setHeroTreatment] = useState(HERO_TREATMENT_PRESETS[0]);
  const [phoneTenure, setPhoneTenure] = useState<number>(12);
  const [phoneSanctionedStamp, setPhoneSanctionedStamp] = useState<boolean>(false);
  const phoneEmiTarget = Math.round(calcEMI(heroTreatment.amount, phoneTenure, 14));
  const phoneEmi = useSmoothValue(phoneEmiTarget, 280);

  const handlePhoneTenureChange = (t: number) => {
    setPhoneTenure(t);
    setPhoneSanctionedStamp(true);
    setTimeout(() => setPhoneSanctionedStamp(false), 2200);
  };

  const handleHeroTreatmentChange = (t: typeof HERO_TREATMENT_PRESETS[0]) => {
    setHeroTreatment(t);
    setPhoneSanctionedStamp(true);
    setTimeout(() => setPhoneSanctionedStamp(false), 2200);
  };

  // Interactive Front-Desk Multi-Specialty WhatsApp Link Generator state (Improvement 3)
  const [simSpecialty, setSimSpecialty] = useState<string>('dental');
  const currentSimSpecialty = SIM_SPECIALTIES.find((s) => s.id === simSpecialty) || SIM_SPECIALTIES[0];
  const [simPatientName, setSimPatientName] = useState('Pooja Verma');
  const [simTreatment, setSimTreatment] = useState('Invisible Clear Aligners');
  const [simAmount, setSimAmount] = useState(65000);
  const [simTenure, setSimTenure] = useState(12);
  const simEmiTarget = Math.round(calcEMI(simAmount, simTenure, 14));
  const simEmi = useSmoothValue(simEmiTarget, 220);

  // FAQ Category Filter and Search state (Improvement 5)
  const [faqCategory, setFaqCategory] = useState<'all' | 'clinics' | 'patients' | 'compliance'>('all');
  const [faqSearchQuery, setFaqSearchQuery] = useState('');

  // Bento Timeline Auto-Advancing with Pause-on-Hover
  const [bentoStep, setBentoStep] = useState<number>(1);
  const [bentoPaused, setBentoPaused] = useState<boolean>(false);
  const [bentoProgress, setBentoProgress] = useState<number>(0);

  // Front-Desk 10-Second Multi-Specialty Objection Handling Playbook
  const [activeObjection, setActiveObjection] = useState<number>(0);
  const OBJECTION_SCRIPTS = [
    {
      id: 0,
      badge: "Price Shock Resistance",
      patientSays: "₹65,000 is too expensive right now, doctor. I need to think about it and discuss with family.",
      expensiveMistake: "Front desk offers an instant 15% discount (giving up ₹9,750 of clinic profit) or lets the patient walk out empty-handed.",
      clinazaScript: "Doctor has already approved our flexible payment plan. Instead of ₹65,000 upfront, it's just ₹3,200/month. We can activate it right here in 2 minutes before you leave.",
      clinicUpside: "100% of procedure fee preserved; ₹0 discount haircut; instant T+1 current account settlement."
    },
    {
      id: 1,
      badge: "Direct Installments / Khata",
      patientSays: "Can I pay ₹10,000 today and pay the remaining balance directly to the clinic over the next 4 months?",
      expensiveMistake: "Clinic accepts an informal ledger (khata), absorbing patient credit default risk and spending staff hours chasing overdue payments.",
      clinazaScript: "We partner with scheduled banks so you get flexible monthly instalments with zero clinic paperwork. Your treatment starts today, and the bank handles the debits automatically.",
      clinicUpside: "Zero collection follow-ups; 100% non-recourse guarantee; clinic carries ₹0 default liability."
    },
    {
      id: 2,
      badge: "Credit Card & Paperwork Hesitation",
      patientSays: "I don't have a credit card and I don't want to submit salary slips or go through tedious loan paperwork.",
      expensiveMistake: "Front desk assumes the patient cannot qualify for patient financing and loses a high-value implant, aesthetic, or surgical package.",
      clinazaScript: "You don't need a credit card or salary slips. We check pre-approved limits across 16+ banks with just your mobile number and Aadhaar OTP in 90 seconds.",
      clinicUpside: "92-second paperless OTP decision across 16+ major banks with 0 impact on patient credit score."
    }
  ];

  useEffect(() => {
    if (bentoPaused) return;
    const interval = 50;
    const totalDuration = 4500;
    const timer = setInterval(() => {
      setBentoProgress((prev) => {
        if (prev >= 100) {
          setBentoStep((s) => (s % 3) + 1);
          return 0;
        }
        return prev + (interval / totalDuration) * 100;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [bentoPaused, bentoStep]);

  // Spotlight mouse tracking handler for Bento cards
  const handleSpotlightMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  const roiLostCases = Math.round(roiConsultations * 0.6); // 60% industry front-desk drop-off
  const roiRecoveredCases = Math.max(1, Math.round(roiLostCases * 0.5)); // ~50% converted via instant EMIs
  const roiMonthlyUnlocked = roiRecoveredCases * roiAvgTicket;
  const roiAnnualUnlocked = roiMonthlyUnlocked * 12;
  const roiLostMonthly = roiLostCases * roiAvgTicket;

  // Smooth numeric interpolation for ROI and Patient calculations
  const smoothRoiMonthly = useSmoothValue(roiMonthlyUnlocked, 300);
  const smoothRoiAnnual = useSmoothValue(roiAnnualUnlocked, 300);
  const smoothRoiLost = useSmoothValue(roiLostMonthly, 300);
  const smoothMonthlyEMI = useSmoothValue(monthlyEMI, 250);
  const smoothTotalPayable = useSmoothValue(totalPayable, 250);
  const smoothTotalInterest = useSmoothValue(totalInterest, 250);
  // Analytics event tracking placeholder function
  const trackEvent = (eventName: string, payload?: Record<string, any>) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, payload);
    }
    console.log(`[Analytics Event]: ${eventName}`, payload || {});
  };
  const handlePatientEligibilitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientData.name || !patientData.mobile) {
      toast.error('Please fill in required fields');
      return;
    }

    const cleanMobile = patientData.mobile.replace(/\D/g, '').slice(-10);
    if (cleanMobile.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    trackEvent('eligibility_completed', {
      treatment: patientData.treatment,
    });

    // Send email notification
    emailNotificationService.sendNotification('New Patient Eligibility Form Checked', {
      patientName: patientData.name,
      mobile: cleanMobile,
      treatmentNeeded: patientData.treatment,
      loanAmountRange: patientData.amount,
    });

    toast.success('Initiating financing application...');

    try {
      const result = await easycredService.initiateApplication({
        customerName: patientData.name.trim(),
        mobile: cleanMobile,
        productCode: 'ONLINE_PERSONAL'
      });

      const redirectUrl = (result.success && result.data?.customerLink)
        ? result.data.customerLink
        : (result.fallbackLink || `https://www.clinaza.in/partner?ref=cardless_emi&mobile=${cleanMobile}&name=${encodeURIComponent(patientData.name)}`);

      const masked = (result.success && result.data?.maskedMobile)
        ? result.data.maskedMobile
        : `••••••${cleanMobile.slice(-4)}`;

      setCustomerLink(redirectUrl);
      setMaskedMobile(masked);
      setIsFinancingSuccess(true);
    } catch (err) {
      console.error('Error initiating financing:', err);
      const fallbackUrl = `https://www.clinaza.in/partner?ref=cardless_emi&mobile=${cleanMobile}&name=${encodeURIComponent(patientData.name)}`;
      setCustomerLink(fallbackUrl);
      setMaskedMobile(`••••••${cleanMobile.slice(-4)}`);
      setIsFinancingSuccess(true);
    }
  };

  const handleCopyPassLink = () => {
    if (!customerLink) return;
    navigator.clipboard.writeText(customerLink);
    setPassCopied(true);
    toast.success('Secure KYC link copied to clipboard!');
    setTimeout(() => setPassCopied(false), 2500);
  };

  const handleCloseEligibilityModal = () => {
    setShowEligibilityModal(false);
    setIsFinancingSuccess(false);
    setCustomerLink('');
    setMaskedMobile('');
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
    emailNotificationService.sendNotification(
      formType === 'clinic' ? 'New Clinic Partner Request' : 'New Lender Partnership Inquiry',
      {
        formType,
        doctorName: formData.doctorName,
        clinicName: formData.clinicName,
        phone: formData.phone,
        city: formData.city,
        selectedSpecialty: formData.category || 'N/A'
      }
    );

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

  interface FAQItem {
    category: 'clinics' | 'patients' | 'compliance';
    q: string;
    a: string;
  }

  const comprehensiveFaqs: FAQItem[] = [
    {
      category: 'clinics',
      q: 'How does Clinaza help private dental clinics increase treatment acceptance?',
      a: 'Over 60% of high-ticket dental cases (implants, aligners, full-mouth rehab) drop out at the reception desk due to price shock. Clinaza enables clinic front desks to instantly prescribe flexible monthly EMIs via SMS or WhatsApp link, converting hesitant patients on the spot without manual paperwork.'
    },
    {
      category: 'clinics',
      q: 'Does the clinic bear any credit default risk or patient non-payment liability?',
      a: 'Zero credit risk on the clinic. Clinaza operates on a 100% non-recourse model. Loans are underwritten, funded, serviced, and collected directly by RBI-registered banks and NBFC partners. The clinic receives full payment and has no liability if a patient misses an installment.'
    },
    {
      category: 'clinics',
      q: 'How fast does the clinic receive treatment funds in its bank account?',
      a: 'Clinaza disburses 100% of the approved treatment invoice directly into your clinic’s verified current account on a guaranteed T+1 business day cycle, processed through Plural by Pine Labs.'
    },
    {
      category: 'clinics',
      q: 'What is the onboarding fee for dental clinics?',
      a: 'Clinaza charges a nominal one-time onboarding fee of ₹999 for clinic onboarding and lending gateway integration. There are zero recurring monthly subscriptions, zero software maintenance fees, and zero hidden charges.'
    },
    {
      category: 'clinics',
      q: 'Can clinic reception staff learn how to send EMI links in 10 minutes?',
      a: 'Yes. Generating a patient EMI link requires only entering the patient’s mobile number and the treatment amount. Patients complete their 2-minute paperless Aadhaar OTP verification on their own mobile device while your front-desk dashboard tracks sanction status in real time.'
    },
    {
      category: 'patients',
      q: 'Can patients get treatment on EMI without a credit card (Cardless EMI)?',
      a: 'Yes. Clinaza powers Cardless EMIs in partnership with leading RBI-regulated cardless healthcare lenders. Patients without a credit card only need a valid PAN and Aadhaar OTP to split treatments into monthly EMIs. Additionally, Credit Card EMI across 16+ banks, Debit Card EMI, and Down Payment + EMI hybrid options are fully supported.'
    },
    {
      category: 'patients',
      q: 'Which dental and medical treatments are eligible for monthly EMIs?',
      a: 'High-value planned procedures ranging from ₹30,000 to ₹5,00,000 including Dental Implants, Clear Aligners, Braces, Zirconia Crowns, Full Mouth Rehabilitation, Orthopaedic surgeries, IVF/Fertility, and LASIK/Ophthalmology.'
    },
    {
      category: 'patients',
      q: 'What documents does the patient need to apply at the clinic counter?',
      a: 'Basic digital KYC: PAN card, Aadhaar card for instant OTP eKYC verification, and bank account / debit card details for setting up auto-repayment via e-NACH or UPI mandate. Zero physical paperwork required.'
    },
    {
      category: 'patients',
      q: 'Does checking patient EMI eligibility harm their CIBIL score?',
      a: 'No. The preliminary eligibility assessment is conducted as a soft credit bureau check with zero negative impact on the patient’s CIBIL score. Hard credit inquiries only occur when a patient explicitly sanctions an offer with a chosen lender.'
    },
    {
      category: 'patients',
      q: 'What repayment tenures and interest rates are available?',
      a: 'Patients can choose flexible tenures from 3 to 24 months. Interest rates start from ~11.5% to 15% p.a., determined directly by the regulated lending partner based on the patient’s credit and cashflow assessment.'
    },
    {
      category: 'patients',
      q: 'Is loan approval guaranteed?',
      a: 'No. Clinaza facilitates the multi-lender application process. Final loan approval, interest rate, and sanctioned amount are determined independently by the financing partner based on patient credit eligibility and bureau underwriting.'
    },
    {
      category: 'compliance',
      q: 'Who powers Clinaza’s payment and patient EMI financing gateway?',
      a: 'Clinaza is officially partnered with Plural by Pine Labs, India’s leading omnichannel merchant commerce network. Through this partnership, Clinaza equips private dental and specialty clinics with instant point-of-care patient financing across 16+ major banks, paperless cardless medical loans, and low-fee front-desk UPI collections — with all treatment payouts deposited directly into the clinic’s current account on a guaranteed T+1 settlement cycle.'
    },
    {
      category: 'compliance',
      q: 'Are the lending partners regulated by the Reserve Bank of India (RBI)?',
      a: 'Yes. All loans and credit lines facilitated through Clinaza are underwritten and disbursed exclusively by RBI-registered Scheduled Commercial Banks and RBI-licensed Non-Banking Financial Companies (NBFCs) in strict compliance with RBI Digital Lending Guidelines.'
    },
    {
      category: 'compliance',
      q: 'How is patient clinical and financial data kept secure?',
      a: 'All data transmissions are encrypted using bank-grade 256-bit SSL encryption. Clinaza adheres strictly to India’s Digital Personal Data Protection (DPDP) Act and RBI data localization requirements. Patient health records and financial credentials are never sold or shared with unapproved third parties.'
    }
  ];

  const filteredFaqs = comprehensiveFaqs.filter((faq) => {
    const matchesCategory = faqCategory === 'all' || faq.category === faqCategory;
    const matchesSearch = !faqSearchQuery.trim() || 
      faq.q.toLowerCase().includes(faqSearchQuery.toLowerCase()) || 
      faq.a.toLowerCase().includes(faqSearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white text-[#0B2450] font-jakarta antialiased overflow-x-hidden selection:bg-[#0867E8] selection:text-white">
      <SEOHead
        title="Clinaza — Point-of-Care Patient Financing & Healthcare EMIs India"
        description="Enable instant 2-minute paperless patient treatment financing & EMIs (₹30K–₹5L) across 16+ major banks for dental, IVF & surgery clinics. Direct T+1 settlement with zero default risk."
        keywords={[
          'clinaza', 'clinaza patient financing', 'clinaza healthpay', 'clinaza healthcare emi',
          'point of care patient financing', 'dental treatment on emi', 'dental implants emi',
          'clear aligners emi cost', 'medical loan india', 'loan for dental clinic', 'dental clinic setup cost calculator',
          'free dental crm', 'free dental crm software india', 'best free dental clinic management software',
          'dental prescription software free', 'whatsapp patient recall dental',
          'lasik on emi', 'ivf treatment emi', 'hair transplant financing india'
        ]}
        image="https://www.clinaza.in/og-clinaza.png"
        canonicalUrl="https://www.clinaza.in/"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Clinaza Technologies",
            "alternateName": "Clinaza",
            "url": "https://www.clinaza.in/",
            "logo": "https://www.clinaza.in/assets/clinaza-logo.jpg",
            "sameAs": [
              "https://www.instagram.com/clinaza.in",
              "https://twitter.com/clinazain",
              "https://www.linkedin.com/company/clinaza-healthcare-technologies/"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+91-7292984244",
              "contactType": "customer service",
              "areaServed": "IN",
              "availableLanguage": ["en", "hi"]
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "FinancialService",
            "name": "Clinaza Healthcare Patient Financing & Dental Practice OS",
            "url": "https://www.clinaza.in/",
            "logo": "https://www.clinaza.in/assets/clinaza-logo.jpg",
            "description": "Instant point-of-care patient EMI financing from ₹30,000 to ₹5,00,000 across 16+ major banks with direct T+1 clinic settlements and zero default recourse.",
            "areaServed": {
              "@type": "Country",
              "name": "India"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Dental & Specialty Healthcare Patient Financing Plans",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Invisible Clear Aligners Financing",
                    "description": "Flexible monthly EMIs from ₹2,600/month for clear aligners and orthodontic treatments."
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Dental Implants & Crown Financing",
                    "description": "Point-of-care EMI plans for single, multiple, and full-arch dental implants."
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Full Mouth Rehabilitation Financing",
                    "description": "Comprehensive restorative dental surgery financing with 3 to 24 month tenures."
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Zirconia Smile Makeovers & Ceramic Veneers",
                    "description": "Aesthetic cosmetic dentistry financing with instant paperless Aadhaar OTP verification."
                  }
                }
              ]
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": comprehensiveFaqs.map((faq) => ({
              "@type": "Question",
              "name": faq.q,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.a
              }
            }))
          },
          {
            "@context": "https://schema.org",
            "@type": "LoanOrCredit",
            "name": "Clinaza Healthcare Patient Financing",
            "description": "Instant point-of-care patient EMI financing from ₹30,000 to ₹5,00,000 across 16+ major banks with direct T+1 clinic settlements and zero default recourse.",
            "provider": {
              "@type": "FinancialService",
              "name": "Clinaza & Plural by Pine Labs",
              "url": "https://www.clinaza.in/"
            },
            "amount": {
              "@type": "MonetaryAmount",
              "currency": "INR",
              "minValue": 30000,
              "maxValue": 500000
            },
            "loanTerm": {
              "@type": "QuantitativeValue",
              "minValue": 3,
              "maxValue": 24,
              "unitCode": "MON"
            },
            "currency": "INR"
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.clinaza.in/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Clinic Onboarding",
                "item": "https://www.clinaza.in/clinic-onboarding"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Free Dental Tools",
                "item": "https://www.clinaza.in/tools"
              }
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Clinaza Dental CRM & Patient Financing",
            "operatingSystem": "Web, iOS, Android (PWA)",
            "applicationCategory": "BusinessApplication",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "INR"
            },
            "description": "100% Free Dental Clinic Management CRM in India with automated WhatsApp patient recalls, digital FDI tooth charting, digital prescriptions, and point-of-care patient EMI financing.",
            "url": "https://www.clinaza.in/",
            "author": {
              "@type": "Organization",
              "name": "Clinaza Technologies",
              "url": "https://www.clinaza.in"
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "FinancialService",
            "name": "Clinaza",
            "description": "Embedded patient financing infrastructure enabling healthcare clinics & hospitals to offer point-of-care EMI loans.",
            "url": "https://www.clinaza.in/",
            "logo": "https://www.clinaza.in/assets/clinaza-logo.jpg",
            "image": "https://www.clinaza.in/og-clinaza.png",
            "areaServed": "IN",
            "serviceType": "Healthcare Patient Financing Infrastructure"
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Who powers Clinaza's payment and patient EMI financing gateway?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Clinaza is officially partnered with Plural by Pine Labs, India’s leading omnichannel merchant commerce network, providing multi-bank Credit Card EMIs, Debit Card EMIs, cardless healthcare financing, and low-fee UPI with direct T+1 clinic settlements."
                }
              },
              {
                "@type": "Question",
                "name": "What is Clinaza?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Clinaza is an embedded healthcare patient financing platform that connects clinics with RBI-regulated Banks and NBFCs, allowing patients to pay for high-ticket treatments in flexible monthly EMIs."
                }
              },
              {
                "@type": "Question",
                "name": "How does Clinaza patient financing work?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Clinaza connects clinic patients directly with regulated lending partners to offer flexible monthly EMI options for treatments ranging from ₹30,000 to ₹5,00,000 with 2-minute paperless digital KYC."
                }
              },
              {
                "@type": "Question",
                "name": "Which treatments are eligible for EMI?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "High-value planned procedures ranging from ₹30,000 to ₹5,00,000 including Dental Implants, Clear Aligners, Braces, Crowns, Orthopaedic surgeries, IVF/Fertility, and LASIK/Ophthalmology."
                }
              },
              {
                "@type": "Question",
                "name": "Does the clinic bear any credit risk?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Zero credit risk on the clinic. The loan is funded, serviced, and collected directly by regulated lending institutions via automated monthly e-NACH auto-debit."
                }
              },
              {
                "@type": "Question",
                "name": "What is the onboarding fee for clinics?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Clinaza charges a nominal one-time onboarding fee of ₹999 for clinic onboarding and lending gateway integration. There are zero recurring monthly subscriptions."
                }
              },
              {
                "@type": "Question",
                "name": "What documents does the patient need?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Basic digital KYC: PAN card, Aadhaar card (eKYC), proof of income (salary slip, bank statement, or ITR), and bank account details for e-NACH auto-debit setup."
                }
              },
              {
                "@type": "Question",
                "name": "Can patients get treatment on EMI without a credit card (Cardless EMI)?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. Clinaza powers Cardless EMIs in partnership with leading RBI-regulated cardless healthcare lenders (powered by RBI-regulated banking and NBFC institutions). Patients without a credit card only need a valid PAN and Aadhaar OTP to split treatments into monthly EMIs. Additionally, Credit Card EMI across 21+ banks, Debit Card EMI, and Down Payment + EMI options are fully supported."
                }
              },
              {
                "@type": "Question",
                "name": "Are IVF and fertility treatments eligible for monthly EMI financing?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. Clinaza covers high-ticket IVF cycles, ICSI, IUI, and reproductive healthcare packages from ₹50,000 to ₹5,00,000 with upfront clinic disbursement and flexible 3 to 24 month repayment tenures."
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
              { "@type": "ListItem", "position": 1, "name": "YOUR DENTIST Patna", "url": "https://www.clinaza.in/cities/patna" },
              { "@type": "ListItem", "position": 2, "name": "PRODENT Patna", "url": "https://www.clinaza.in/cities/patna" },
              { "@type": "ListItem", "position": 3, "name": "GuMzy Dental Gurgaon", "url": "https://www.clinaza.in/cities/gurgaon" },
              { "@type": "ListItem", "position": 4, "name": "Facio Dental Patna", "url": "https://www.clinaza.in/cities/patna" },
              { "@type": "ListItem", "position": 5, "name": "Smile Dental Clinic Patna", "url": "https://www.clinaza.in/cities/patna" },
              { "@type": "ListItem", "position": 6, "name": "Smile Point Dental Care Patna", "url": "https://www.clinaza.in/cities/patna" },
              { "@type": "ListItem", "position": 7, "name": "YouthONN Multispeciality Dental Patna", "url": "https://www.clinaza.in/cities/patna" },
              { "@type": "ListItem", "position": 8, "name": "Mundeshwari Dental Hub & Implant Patna", "url": "https://www.clinaza.in/cities/patna" },
              { "@type": "ListItem", "position": 9, "name": "Pratima Dental Hospital Patna", "url": "https://www.clinaza.in/cities/patna" },
              { "@type": "ListItem", "position": 10, "name": "Dantsri Dental Hospital Jhanjharpur", "url": "https://www.instagram.com/dantsri_dental/" }
            ]
          }
        ]}
      />

      {/* ── Precision Floating Frosted-Glass Pill Navigation ── */}
      <header className="fixed top-3 sm:top-5 inset-x-0 z-50 max-w-7xl mx-auto px-3 sm:px-6 pointer-events-none">
        <nav className="pointer-events-auto bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-full px-3.5 sm:px-5 py-2 sm:py-2.5 shadow-[0_8px_32px_rgba(15,23,42,0.08)] flex items-center justify-between gap-2 sm:gap-3 transition-all duration-300">
          {/* Left Brand & Co-Brand Group */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <Link to="/" className="flex items-center gap-2.5 group shrink-0 min-h-[44px] min-w-[44px] p-0.5">
              <img
                src="/assets/clinaza-logo.jpg"
                alt="CLINAZA"
                className="h-8 sm:h-9 w-auto rounded-xl border border-slate-200 shadow-2xs group-hover:scale-105 transition-transform shrink-0"
                width={36}
                height={36}
              />
              <div className="hidden sm:block text-left shrink-0">
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  <span className="text-xs sm:text-[13px] font-extrabold tracking-wider text-[#0B2450]">CLINAZA</span>
                  <span className="text-[8px] font-black uppercase tracking-widest bg-blue-50 text-[#0867E8] px-1.5 py-0.5 rounded border border-blue-200/60">
                    HealthPay
                  </span>
                </div>
                <span className="hidden xl:block text-[9px] font-bold tracking-wider text-[#0f7a75] uppercase whitespace-nowrap">
                  Point-of-Care Patient Financing
                </span>
              </div>
            </Link>

            {/* Pine Labs Official Gateway Micro-Pill (visible on ultra-wide screens to maintain breathing room) */}
            <div className="hidden 2xl:flex items-center gap-2 px-3 py-1 bg-slate-50/90 border border-slate-200/80 rounded-full shrink-0">
              <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Gateway:</span>
              <img
                src="/assets/plural_by_pinelabs_transparent.png"
                alt="Plural by Pine Labs"
                className="h-3.5 w-auto object-contain"
                width={80}
                height={14}
              />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5"></span>
            </div>
          </div>

          {/* Center Navigation Links (Desktop: lg+) */}
          <div className="hidden lg:flex items-center gap-0.5 xl:gap-1 text-[11.5px] xl:text-xs font-semibold text-slate-600 shrink-0">
            <a href="#how-it-works" className="px-2 xl:px-2.5 py-1.5 rounded-full hover:text-[#0867E8] hover:bg-slate-50 transition-colors whitespace-nowrap">
              How It Works
            </a>
            <Link to="/checkout-flow" className="px-2 xl:px-2.5 py-1.5 rounded-full hover:text-[#0867E8] hover:bg-blue-50/60 text-[#0867E8] font-bold transition-colors whitespace-nowrap flex items-center gap-1">
              <span>Checkout Demo</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping"></span>
            </Link>
            <a href="#calculator" className="px-2 xl:px-2.5 py-1.5 rounded-full hover:text-[#0867E8] hover:bg-slate-50 transition-colors whitespace-nowrap">
              Practice ROI
            </a>
            <a href="#treatments" className="px-2 xl:px-2.5 py-1.5 rounded-full hover:text-[#0867E8] hover:bg-slate-50 transition-colors whitespace-nowrap">
              Treatments
            </a>
            <Link to="/tools" className="px-2 xl:px-2.5 py-1.5 rounded-full hover:text-[#0867E8] hover:bg-slate-50 transition-colors whitespace-nowrap">
              Free Rx Tools
            </Link>
            <Link to="/blog" className="px-2 xl:px-2.5 py-1.5 rounded-full hover:text-[#0867E8] hover:bg-slate-50 transition-colors whitespace-nowrap">
              Guides
            </Link>
          </div>

          {/* Right Action Group */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Link
              to="/reactivation/login"
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 min-h-[44px] bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 rounded-full transition-all whitespace-nowrap shrink-0 active:scale-95"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="hidden sm:inline">Doctor </span>Login
              <Lock size={12} className="text-slate-500 ml-0.5" />
            </Link>

            <Link
              to="/clinic-onboarding"
              className="relative overflow-hidden group px-3 sm:px-4 xl:px-5 py-2 sm:py-2.5 min-h-[44px] bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-extrabold uppercase tracking-wider rounded-full transition-all shadow-[0_4px_16px_rgba(8,103,232,0.25)] hover:shadow-[0_6px_20px_rgba(8,103,232,0.35)] flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 active:scale-95"
            >
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full" aria-hidden="true">
                <div className="w-16 h-full bg-gradient-to-r from-transparent via-white/35 to-transparent absolute top-0 -left-16 animate-cta-sheen" />
              </div>
              <span className="sm:hidden relative z-10">Onboard</span>
              <span className="hidden sm:inline xl:hidden relative z-10">Onboard &bull; ₹999</span>
              <span className="hidden xl:inline relative z-10">Onboard Clinic &bull; ₹999</span>
              <ArrowRight size={13} className="relative z-10" />
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* ── 1. ATMOSPHERIC FINTECH HERO ── */}
        <section aria-label="Hero" className="relative pt-24 sm:pt-36 pb-12 sm:pb-20 px-4 sm:px-6 max-w-6xl mx-auto space-y-10 sm:space-y-14">
          {/* Subtle Ambient Background Canvas */}
          <div className="absolute inset-0 bg-radial-fintech pointer-events-none -z-10" />
          <div className="absolute inset-0 bg-grid-fintech mask-radial-fade opacity-60 pointer-events-none -z-10" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center text-left">
            {/* Left Column: Institutional Value & Conversion Copy (7 cols) */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6">
              {/* Category Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-full text-xs font-semibold text-slate-800 shadow-2xs">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-extrabold text-[#0867E8] uppercase tracking-wider">OFFICIAL GATEWAY PARTNER:</span>
                <span className="text-[11px] font-bold text-slate-800">Plural by Pine Labs</span>
                <span className="text-slate-300 hidden sm:inline">&bull;</span>
                <span className="text-[10px] font-bold text-slate-500 hidden sm:inline">16+ Banks &bull; 35+ EMI Modes</span>
              </div>

              {/* H1 Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-extrabold tracking-[-0.035em] leading-[1.08] text-[#0B2450] [text-wrap:balance]">
                Point-of-Care Patient Financing.<br />
                <span className="bg-gradient-to-r from-[#0867E8] via-[#0D72EB] to-[#0f7a75] bg-clip-text text-transparent">
                  Zero Clinic Default Risk.
                </span>
              </h1>

              {/* Balanced Subhead */}
              <p className="text-sm sm:text-base md:text-lg text-slate-600 font-normal leading-relaxed max-w-xl [text-wrap:pretty]">
                Empower patients with instant 2-minute paperless EMIs across <strong className="text-[#0B2450] font-semibold">16+ major banks</strong> for treatments from ₹30,000 to ₹5,00,000. Upfront disbursement directly to your clinic current account on a guaranteed T+1 settlement cycle.
              </p>

              {/* Primary Call-to-Actions */}
              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 pt-1">
                <Link
                  to="/clinic-onboarding"
                  className="relative overflow-hidden group px-6 sm:px-7 py-3.5 sm:py-4 bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2 shadow-[0_10px_25px_rgba(8,103,232,0.25)] hover:shadow-[0_14px_30px_rgba(8,103,232,0.35)] active:scale-95"
                >
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl" aria-hidden="true">
                    <div className="w-20 h-full bg-gradient-to-r from-transparent via-white/35 to-transparent absolute top-0 -left-20 animate-cta-sheen" />
                  </div>
                  <span className="relative z-10">Onboard Clinic &bull; ₹999 Setup</span>
                  <ArrowRight size={15} className="relative z-10" />
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    trackEvent('click_hero_check_eligibility');
                    trackEvent('eligibility_started', { source: 'hero_cta' });
                    setShowEligibilityModal(true);
                  }}
                  className="px-6 sm:px-7 py-3.5 sm:py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 hover:border-slate-300 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95 shadow-2xs"
                >
                  <ShieldCheck size={16} className="text-[#0867E8]" /> Check Patient Eligibility
                </button>
              </div>

              {/* Institutional Co-Brand Guarantee Strip (4-Item Verification Grid - Improvement 5) */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-[0_4px_24px_rgba(11,36,80,0.05)] space-y-2.5">
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wide bg-emerald-50 text-emerald-800 border border-emerald-200/90 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5 whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      <span>RBI-Regulated Ecosystem</span>
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline">&bull; Direct Bank Payouts</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/70">
                    <span className="text-[9px] font-bold uppercase text-slate-400">Powered by</span>
                    <img src="/assets/plural_by_pinelabs_transparent.png" alt="Plural by Pine Labs" className="h-3.5 sm:h-4 w-auto object-contain" width={80} height={16} />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="bg-slate-50/90 p-2.5 rounded-xl border border-slate-200/70">
                    <div className="flex items-center gap-1 text-slate-400 mb-0.5">
                      <ShieldCheck size={11} className="text-[#0867E8]" />
                      <span className="text-[9px] font-bold uppercase tracking-wider">Gateway Rail</span>
                    </div>
                    <span className="font-extrabold text-[#0B2450] text-xs block truncate">Plural Pine Labs</span>
                    <span className="text-[9.5px] text-slate-500 block truncate">Official Partner</span>
                  </div>

                  <div className="bg-slate-50/90 p-2.5 rounded-xl border border-slate-200/70">
                    <div className="flex items-center gap-1 text-slate-400 mb-0.5">
                      <Landmark size={11} className="text-blue-600" />
                      <span className="text-[9px] font-bold uppercase tracking-wider">Lending Rails</span>
                    </div>
                    <span className="font-extrabold text-[#0B2450] text-xs block truncate">16+ Major Banks</span>
                    <span className="text-[9.5px] text-slate-500 block truncate">RBI Regulated</span>
                  </div>

                  <div className="bg-slate-50/90 p-2.5 rounded-xl border border-slate-200/70">
                    <div className="flex items-center gap-1 text-slate-400 mb-0.5">
                      <Clock size={11} className="text-emerald-600" />
                      <span className="text-[9px] font-bold uppercase tracking-wider">Settlement</span>
                    </div>
                    <span className="font-extrabold text-emerald-700 text-xs block truncate">T+1 Guaranteed</span>
                    <span className="text-[9.5px] text-slate-500 block truncate">Direct Current A/C</span>
                  </div>

                  <div className="bg-slate-50/90 p-2.5 rounded-xl border border-slate-200/70">
                    <div className="flex items-center gap-1 text-slate-400 mb-0.5">
                      <CheckCircle2 size={11} className="text-emerald-600" />
                      <span className="text-[9px] font-bold uppercase tracking-wider">Default Risk</span>
                    </div>
                    <span className="font-extrabold text-[#0867E8] text-xs block truncate">100% Non-Recourse</span>
                    <span className="text-[9.5px] text-slate-500 block truncate">₹0 Clinic Liability</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Realistic Smartphone Showcase on Desktop / Streamlined Interactive Card on Mobile (5 cols - Improvement 2) */}
            <div className="lg:col-span-5 relative mt-4 lg:mt-0 flex flex-col items-center justify-center">
              {/* Mobile-Only Streamlined Front-Desk Affordability Card (< lg) */}
              <div className="block lg:hidden w-full max-w-md mx-auto z-10 relative">
                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-slate-200/90 shadow-[0_8px_30px_rgba(11,36,80,0.06)] space-y-3 text-left">
                  {/* Top Status */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0B2450]">
                        Front-Desk Simulator
                      </span>
                    </div>
                    <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                      Instant Pre-Approval
                    </span>
                  </div>

                  {/* Procedure Quick Select Grid */}
                  <div className="space-y-1">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-500 block">
                      Select Clinical Procedure
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {HERO_TREATMENT_PRESETS.map((t) => {
                        const isSelected = heroTreatment.id === t.id;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => handleHeroTreatmentChange(t)}
                            className={`px-2.5 py-2 min-h-[44px] text-[11px] font-bold rounded-xl border transition-all text-left flex items-center justify-between cursor-pointer active:scale-[0.98] ${
                              isSelected
                                ? 'bg-[#0B2450] text-white border-[#0B2450] shadow-2xs'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
                            }`}
                          >
                            <span className="truncate">{t.label}</span>
                            <span className={`text-[9.5px] font-extrabold px-1.5 py-0.5 rounded shrink-0 ml-1 ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-white text-slate-600'
                            }`}>
                              ₹{(t.amount / 1000).toFixed(0)}k
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dynamic EMI & Tenure Box */}
                  <div className="bg-slate-50/90 rounded-xl p-3 border border-slate-200/70 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[9px] font-bold uppercase text-slate-500 block tracking-wider">
                          Patient Monthly EMI
                        </span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xl font-extrabold text-[#0867E8] tabular-nums">
                            ₹{phoneEmi.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-slate-600 font-medium">/mo</span>
                          <span className="text-[10px] text-slate-500 line-through ml-1">
                            ₹{heroTreatment.amount.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                      {phoneSanctionedStamp ? (
                        <span className="inline-flex items-center gap-1 text-[8.5px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-1 rounded-lg border border-emerald-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                          Sanctioned in 92s
                        </span>
                      ) : (
                        <span className="text-[8.5px] font-bold text-slate-600 bg-white px-2 py-1 rounded-lg border border-slate-200/70">
                          {phoneTenure}M Tenure
                        </span>
                      )}
                    </div>

                    {/* Tenure Buttons */}
                    <div className="grid grid-cols-4 gap-1">
                      {[3, 6, 12, 24].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => handlePhoneTenureChange(t)}
                          className={`py-1.5 min-h-[44px] text-[11px] font-extrabold rounded-lg border transition-all flex items-center justify-center cursor-pointer active:scale-[0.98] ${
                            phoneTenure === t
                              ? 'bg-[#0867E8] text-white border-[#0867E8] shadow-2xs'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-[#0867E8]'
                          }`}
                        >
                          {t}M
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 1-Tap CTA */}
                  <button
                    type="button"
                    onClick={() => {
                      trackEvent('click_hero_mobile_eligibility');
                      trackEvent('eligibility_started', { source: 'hero_mobile_card' });
                      setShowEligibilityModal(true);
                    }}
                    className="w-full py-3 min-h-[48px] bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-[0.98] cursor-pointer"
                  >
                    <ShieldCheck size={14} />
                    <span>Check Patient Eligibility &bull; 2-Min eKYC</span>
                  </button>

                  <div className="flex items-center justify-between text-[9px] text-slate-500 px-1 pt-0.5">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={10} className="text-emerald-600 shrink-0" />
                      <span>16+ Banks &bull; OTP eKYC</span>
                    </span>
                    <span>Plural by Pine Labs &bull; T+1 Payout</span>
                  </div>
                </div>
              </div>

              {/* Desktop-Only Realistic Smartphone Showcase (>= lg) */}
              <div className="hidden lg:flex lg:flex-col items-center justify-center w-full">
                {/* Interactive Procedure Chips Above Phone (Improvement 1) */}
                <div className="w-full max-w-[340px] mb-3 z-10 relative">
                  <div className="flex items-center justify-between pb-1.5 px-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Live Simulator Preset
                    </span>
                    <span className="text-[10px] font-bold text-[#0867E8]">
                      Tap to Switch Procedure
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {HERO_TREATMENT_PRESETS.map((t) => {
                      const isSelected = heroTreatment.id === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => handleHeroTreatmentChange(t)}
                          className={`px-2.5 py-2 min-h-[40px] text-[11px] font-bold rounded-xl border transition-all text-left flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-[#0B2450] text-white border-[#0B2450] shadow-sm'
                              : 'bg-white/90 hover:bg-white text-slate-700 border-slate-200/90 hover:border-slate-300'
                          }`}
                        >
                          <span className="truncate">{t.label}</span>
                          <span className={`text-[9.5px] font-extrabold px-1.5 py-0.5 rounded shrink-0 ml-1 ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            ₹{(t.amount / 1000).toFixed(0)}k
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Decorative Glow behind phone */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/15 via-emerald-500/10 to-transparent rounded-[3rem] blur-2xl pointer-events-none" />

                {/* Phone Frame Device */}
                <div className="relative w-full max-w-[340px] bg-slate-900 rounded-[2.5rem] p-3 shadow-[0_25px_60px_rgba(15,23,42,0.25)] border-[6px] border-slate-800 text-left">
                  {/* Dynamic Island Notch */}
                  <div className="absolute top-5 inset-x-0 mx-auto w-24 h-4 bg-slate-950 rounded-full flex items-center justify-end px-2 gap-1.5 z-20">
                    <div className="w-2 h-2 rounded-full bg-slate-800" />
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500/80" />
                  </div>

                  {/* Smartphone Display */}
                  <div className="bg-white rounded-[2rem] pt-7 pb-4 px-3.5 space-y-3 overflow-hidden text-[#0B2450]">
                    {/* Browser / Security Bar */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-[10px] text-slate-500">
                      <div className="flex items-center gap-1 font-mono text-[9px] bg-slate-100 px-2 py-0.5 rounded-full">
                        <Lock size={9} className="text-emerald-600" />
                        <span>clinaza.in/pay</span>
                      </div>
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                        256-Bit SSL
                      </span>
                    </div>

                    {/* Clinic Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-extrabold text-[#0B2450]">Smile Point Dental Care</p>
                        <p className="text-[9px] text-slate-400 font-medium">Front-Desk Link &bull; Patna</p>
                      </div>
                      <span className="text-[8px] font-extrabold uppercase tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                        Verified
                      </span>
                    </div>

                    {/* Treatment Card */}
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Treatment Plan</span>
                          <p className="text-xs font-extrabold text-[#0B2450] transition-colors duration-200">{heroTreatment.name}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] text-slate-400 line-through">₹{heroTreatment.amount.toLocaleString('en-IN')}</span>
                          <p className="text-sm font-extrabold text-[#0867E8] transition-transform duration-200">
                            ₹{phoneEmi.toLocaleString('en-IN')}<span className="text-[9px] font-medium text-slate-500">/mo</span>
                          </p>
                        </div>
                      </div>

                      {/* Interactive Tenure Selector inside phone */}
                      <div className="pt-1 space-y-1">
                        <div className="flex items-center justify-between min-h-[20px]">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                            Select Tenure ({phoneTenure} Months)
                          </span>
                          {phoneSanctionedStamp ? (
                            <span className="inline-flex items-center gap-1 text-[8.5px] font-extrabold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-300 animate-in fade-in zoom-in-95 duration-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                              Sanctioned in 92s
                            </span>
                          ) : (
                            <span className="text-[8.5px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                              ✓ Instant Decision
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-4 gap-1">
                          {[3, 6, 12, 24].map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => handlePhoneTenureChange(t)}
                              className={`py-2 min-h-[40px] text-[11px] font-extrabold rounded-lg border transition-all flex items-center justify-center ${
                                phoneTenure === t
                                  ? 'bg-[#0867E8] text-white border-[#0867E8] shadow-xs scale-[1.02]'
                                  : 'bg-white text-slate-600 border-slate-200 hover:border-[#0867E8]'
                              }`}
                            >
                              {t}M
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Pre-Approved Multi-Bank Pill */}
                    <div className="flex items-center justify-between bg-emerald-50/80 border border-emerald-200/80 px-2.5 py-1.5 rounded-xl text-[10px] text-emerald-900 font-semibold">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                        <span>Instant Approval:</span>
                      </span>
                      <span className="font-extrabold text-emerald-800">16+ Banks &bull; OTP eKYC</span>
                    </div>

                    {/* Primary Button */}
                    <button
                      type="button"
                      onClick={() => setShowEligibilityModal(true)}
                      className="w-full py-3.5 min-h-[44px] bg-[#0867E8] hover:bg-[#0756C7] text-white text-[11px] font-extrabold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                    >
                      <span>Proceed to 2-Min eKYC</span>
                      <ArrowRight size={12} />
                    </button>

                    <div className="flex items-center justify-center gap-1 text-[8.5px] text-slate-400 pt-0.5">
                      <ShieldCheck size={10} className="text-emerald-600" />
                      <span>Powered by Plural by Pine Labs &bull; RBI Regulated</span>
                    </div>
                  </div>

                  {/* Floating Glass Pill Top Left */}
                  <div className="absolute -top-3 -left-4 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-xl px-3 py-1.5 shadow-lg text-[10px] font-extrabold text-[#0B2450] flex items-center gap-1.5 hidden sm:flex">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>100% Non-Recourse Payout</span>
                  </div>

                  {/* Floating Glass Card Bottom Right */}
                  <div className="absolute -bottom-4 -right-4 bg-[#0B2450] text-white rounded-xl p-2.5 shadow-xl border border-slate-700 text-[10px] space-y-0.5 hidden sm:block">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <CheckCircle2 size={12} />
                      <span>T+1 Bank Settlement</span>
                    </div>
                    <p className="text-slate-300 text-[9px]">100% credited to current a/c</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Popular Banks & NBFC Lending Ecosystem Marquee ── */}
          <div className="pt-6 border-t border-slate-200/60 max-w-6xl mx-auto space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1 text-center sm:text-left">
              <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-start">
                <span className="text-[10px] font-extrabold tracking-widest text-slate-500 uppercase flex items-center gap-1.5">
                  <Landmark size={14} className="text-[#0867E8]" /> AFFORDABILITY &amp; LENDING RAILS
                </span>
                <span className="text-slate-300 hidden sm:inline">&bull;</span>
                <span className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">
                  16+ Major Commercial Banks &amp; NBFCs
                </span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2.5 py-0.5 rounded-full shrink-0">
                ✓ 35+ EMI Options &bull; Credit, Debit &amp; Cardless
              </span>
            </div>

            {/* Continuous Seamless Slideshow Marquee */}
            <div className="relative overflow-hidden py-3 px-2 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-2xs group">
              <div className="absolute left-0 inset-y-0 w-16 sm:w-24 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 inset-y-0 w-16 sm:w-24 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

              <div className="flex w-max gap-3.5 animate-marquee group-hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:animate-none">
                {[
                  { name: 'Plural by Pine Labs', sub: 'Official Gateway Partner', logo: '/assets/plural_by_pinelabs_transparent.png', badge: 'Gateway' },
                  { name: 'HDFC Bank', sub: 'Credit & Debit EMI', logo: '/assets/lenders/hdfc.png', badge: 'Bank EMI' },
                  { name: 'ICICI Bank', sub: 'Credit & Debit EMI', logo: '/assets/lenders/icici.png', badge: 'Bank EMI' },
                  { name: 'Axis Bank', sub: 'Instant Pre-Approval', logo: '/assets/lenders/axis.png', badge: 'Bank EMI' },
                  { name: 'Kotak Bank', sub: 'Flexible 3-24M', logo: '/assets/lenders/kotak.png', badge: 'Bank EMI' },
                  { name: 'State Bank of India', sub: 'National Commercial Bank', logo: '/assets/lenders/sbi.png', badge: 'Bank EMI' },
                  { name: 'Federal Bank', sub: 'Debit Card EMI', logo: '/assets/lenders/federal.png', badge: 'Debit EMI' },
                  { name: 'IDFC First Bank', sub: 'Digital Paperless EMI', logo: '/assets/lenders/idfc.png', badge: 'Paperless' },
                  { name: 'Bajaj Finserv', sub: 'Cardless Consumer Credit', logo: '/assets/lenders/bajaj.png', badge: 'NBFC' },
                  { name: 'RBI Account Aggregator', sub: 'Consented Bank Cashflow Check', logo: '/assets/lenders/rbi.png', badge: 'Cardless' },
                  { name: 'Dynamic UPI QR', sub: 'Front-Desk Instant Collection', logo: '/assets/lenders/upi.png', badge: 'Instant UPI' },
                  { name: 'T+1 Nodal Settlement', sub: '100% Upfront Clinic Payout', logo: '/assets/lenders/settlement.png', badge: 'Settlement' },
                ].concat([
                  { name: 'Plural by Pine Labs', sub: 'Official Gateway Partner', logo: '/assets/plural_by_pinelabs_transparent.png', badge: 'Gateway' },
                  { name: 'HDFC Bank', sub: 'Credit & Debit EMI', logo: '/assets/lenders/hdfc.png', badge: 'Bank EMI' },
                  { name: 'ICICI Bank', sub: 'Credit & Debit EMI', logo: '/assets/lenders/icici.png', badge: 'Bank EMI' },
                  { name: 'Axis Bank', sub: 'Instant Pre-Approval', logo: '/assets/lenders/axis.png', badge: 'Bank EMI' },
                  { name: 'Kotak Bank', sub: 'Flexible 3-24M', logo: '/assets/lenders/kotak.png', badge: 'Bank EMI' },
                  { name: 'State Bank of India', sub: 'National Commercial Bank', logo: '/assets/lenders/sbi.png', badge: 'Bank EMI' },
                  { name: 'Federal Bank', sub: 'Debit Card EMI', logo: '/assets/lenders/federal.png', badge: 'Debit EMI' },
                  { name: 'IDFC First Bank', sub: 'Digital Paperless EMI', logo: '/assets/lenders/idfc.png', badge: 'Paperless' },
                  { name: 'Bajaj Finserv', sub: 'Cardless Consumer Credit', logo: '/assets/lenders/bajaj.png', badge: 'NBFC' },
                  { name: 'RBI Account Aggregator', sub: 'Consented Bank Cashflow Check', logo: '/assets/lenders/rbi.png', badge: 'Cardless' },
                  { name: 'Dynamic UPI QR', sub: 'Front-Desk Instant Collection', logo: '/assets/lenders/upi.png', badge: 'Instant UPI' },
                  { name: 'T+1 Nodal Settlement', sub: '100% Upfront Clinic Payout', logo: '/assets/lenders/settlement.png', badge: 'Settlement' },
                ]).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50/90 border border-slate-200/90 shrink-0 transition-all hover:bg-white hover:border-slate-300 hover:shadow-xs"
                  >
                    <div className="w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center shrink-0 bg-white border border-slate-100 p-0.5 text-[#0867E8] font-extrabold text-xs">
                      {'logo' in item && item.logo ? (
                        <img src={item.logo} alt={item.name} className="h-3.5 w-auto object-contain" width={28} height={14} />
                      ) : (
                        '✓'
                      )}
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-[#0B2450] whitespace-nowrap">{item.name}</span>
                        <span className="text-[8px] font-bold px-1 py-0.2 rounded uppercase tracking-wide bg-blue-50 text-[#0867E8]">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-[9px] text-slate-500 whitespace-nowrap">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Animated Stats Bar */}
            <StatsBar />
          </div>
        </section>

        {/* ── 2. MANDATORY TAGLINE REVEAL (LANDING-PAGE-DESIGN B11) ── */}
        <TaglineReveal />

        {/* ── 3. ASYMMETRIC BENTO SHOWCASE (RECEPTION ENGINE & AFFORDABILITY SUITE) ── */}
        <section id="how-it-works" aria-label="Front-Desk Reception Flow" className="py-16 sm:py-24 px-4 sm:px-6 bg-[#F5F9FC]/80 border-y border-slate-100">
          <FadeIn className="max-w-6xl mx-auto space-y-10">
            {/* Bento Header */}
            <div className="text-center space-y-3">
              <span className="text-[11px] font-extrabold text-[#0f7a75] uppercase tracking-widest bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200/60 inline-block">
                FRONT-DESK RECEPTION WORKFLOW &bull; 60 SECONDS
              </span>
              <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-[#0B2450]">
                Engineered For Front Desks. Designed To Close Cases.
              </h2>
              <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
                60%+ of high-ticket dental, hair, and surgical cases drop off at reception due to upfront price shock. Clinaza replaces price friction with an instant 3-step financing journey.
              </p>
              <div className="pt-2 flex items-center justify-center gap-3">
                <Link
                  to="/checkout-flow"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0867E8] text-white text-xs sm:text-sm font-extrabold hover:bg-[#0756c7] transition-all shadow-md shadow-blue-500/20 active:scale-95"
                >
                  <Smartphone size={14} />
                  <span>Try Patient Checkout Flow & Simulator</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Asymmetric Bento Grid (12-col) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-left">
              {/* Bento Tile 1: Interactive 3-Step Front-Desk Journey (8 cols) */}
              <div 
                onMouseMove={handleSpotlightMouseMove}
                onMouseEnter={() => setBentoPaused(true)}
                onMouseLeave={() => setBentoPaused(false)}
                className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm flex flex-col justify-between bento-spotlight-card relative"
              >
                <div className="space-y-4 relative z-10">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0867E8]">CHAIRSIDE PROCESS</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[9px] font-bold text-slate-400">Auto-playing (hover to pause)</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-extrabold text-[#0B2450]">How Patient Financing Works In 3 Steps</h3>
                    </div>
                    {/* Step selector tabs */}
                    <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
                      {[
                        { step: 1, label: '01 Prescribe (10s)' },
                        { step: 2, label: '02 Patient EMI (2m)' },
                        { step: 3, label: '03 T+1 Payout' }
                      ].map(s => (
                        <button
                          key={s.step}
                          type="button"
                          onClick={() => {
                            setBentoStep(s.step);
                            setBentoProgress(0);
                            setBentoPaused(true);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            bentoStep === s.step
                              ? 'bg-[#0867E8] text-white shadow-xs'
                              : 'text-slate-600 hover:text-[#0B2450]'
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step Interactive Details */}
                  {bentoStep === 1 && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0867E8] shrink-0 font-extrabold text-base">
                          01
                        </div>
                        <div>
                          <h4 className="text-base font-extrabold text-[#0B2450]">Doctor Prescribes &amp; Sends Instant Payment Link</h4>
                          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                            Doctor or receptionist inputs the treatment quote (e.g. ₹85,000) and patient's mobile number into the Clinaza counter dashboard or dynamic QR. An automated WhatsApp/SMS link is instantly dispatched.
                          </p>
                        </div>
                      </div>
                      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <MessageSquare size={18} className="text-[#0f7a75]" />
                          <div>
                            <span className="font-bold text-[#0B2450] block">Automated WhatsApp Delivery</span>
                            <span className="text-[11px] text-slate-500">Includes clinic logo, procedure name &amp; instant EMI options</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-extrabold bg-blue-50 text-[#0867E8] px-2.5 py-1 rounded-lg border border-blue-200">
                          Takes 10 Seconds
                        </span>
                      </div>
                    </div>
                  )}

                  {bentoStep === 2 && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#0f7a75] shrink-0 font-extrabold text-base">
                          02
                        </div>
                        <div>
                          <h4 className="text-base font-extrabold text-[#0B2450]">Patient Chooses EMI Tenure &amp; Completes 2-Min eKYC</h4>
                          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                            Patient opens the secure link on their own smartphone. They compare flexible 3 to 24-month tenures across 16+ banks, choose their preferred monthly budget, and complete paperless digital KYC via Aadhaar OTP.
                          </p>
                        </div>
                      </div>
                      <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <ShieldCheck size={18} className="text-emerald-600" />
                          <div>
                            <span className="font-bold text-[#0B2450] block">Zero App Download Needed</span>
                            <span className="text-[11px] text-slate-600">Soft bureau check with 0 impact on patient's credit score</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-300">
                          Takes 2 Minutes
                        </span>
                      </div>
                    </div>
                  )}

                  {bentoStep === 3 && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 shrink-0 font-extrabold text-base">
                          03
                        </div>
                        <div>
                          <h4 className="text-base font-extrabold text-[#0B2450]">Treatment Starts Immediately &bull; T+1 Bank Settlement</h4>
                          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                            Upon OTP sanction, treatment starts right away. The lending partner transfers 100% of the procedure fee directly into the clinic's current account on a guaranteed T+1 settlement cycle. Repayment collection is handled 100% by the bank.
                          </p>
                        </div>
                      </div>
                      <div className="bg-purple-50/60 border border-purple-200/80 rounded-2xl p-4 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 size={18} className="text-purple-600" />
                          <div>
                            <span className="font-bold text-[#0B2450] block">100% Non-Recourse Guarantee</span>
                            <span className="text-[11px] text-slate-600">Clinic carries zero collection or default risk</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-extrabold bg-purple-100 text-purple-800 px-2.5 py-1 rounded-lg border border-purple-300">
                          T+1 Settlement
                        </span>
                      </div>
                    </div>
                  )}

                  {/* ── Animated Money Flow Rail (Clinic Counter ──▶ Pine Labs ──▶ Current A/c) ── */}
                  <div className="p-3 bg-slate-50/90 rounded-2xl border border-slate-200/80 space-y-2 relative overflow-hidden">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                        <span>Clinic Counter</span>
                      </span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <span>Plural by Pine Labs Clearing</span>
                      </span>
                      <span className="flex items-center gap-1.5 text-emerald-700">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                        <span>T+1 Bank Credit</span>
                      </span>
                    </div>

                    {/* Flow Rail with animated traveling light beam */}
                    <div className="relative h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className="absolute inset-y-0 w-28 bg-gradient-to-r from-transparent via-[#0867E8] to-emerald-400 rounded-full animate-money-beam" />
                    </div>

                    <div className="flex items-center justify-between text-[9px] text-slate-400">
                      <span>1. Patient Scans QR</span>
                      <span>2. 16+ Banks OTP Underwriting</span>
                      <span className="font-bold text-emerald-700">3. 100% Upfront Disbursal</span>
                    </div>
                  </div>
                </div>

                {/* 3 Step Visual Progress Bar with Dynamic Filling Fill */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-[11px] relative z-10">
                  <button
                    type="button"
                    onClick={() => { setBentoStep(1); setBentoProgress(0); setBentoPaused(true); }}
                    className="text-left space-y-1 group cursor-pointer"
                  >
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0867E8] transition-all duration-75"
                        style={{
                          width: `${bentoStep === 1 ? bentoProgress : bentoStep > 1 ? 100 : 0}%`
                        }}
                      />
                    </div>
                    <span className="font-extrabold text-[#0B2450] block group-hover:text-[#0867E8] transition-colors">1. Prescribe</span>
                    <span className="text-[10px] text-slate-500">10-sec counter link</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setBentoStep(2); setBentoProgress(0); setBentoPaused(true); }}
                    className="text-left space-y-1 group cursor-pointer"
                  >
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0f7a75] transition-all duration-75"
                        style={{
                          width: `${bentoStep === 2 ? bentoProgress : bentoStep > 2 ? 100 : 0}%`
                        }}
                      />
                    </div>
                    <span className="font-extrabold text-[#0B2450] block group-hover:text-[#0f7a75] transition-colors">2. Patient EMI</span>
                    <span className="text-[10px] text-slate-500">2-min digital KYC</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setBentoStep(3); setBentoProgress(0); setBentoPaused(true); }}
                    className="text-left space-y-1 group cursor-pointer"
                  >
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-600 transition-all duration-75"
                        style={{
                          width: `${bentoStep === 3 ? bentoProgress : 0}%`
                        }}
                      />
                    </div>
                    <span className="font-extrabold text-[#0B2450] block group-hover:text-purple-600 transition-colors">3. T+1 Settlement</span>
                    <span className="text-[10px] text-slate-500">Direct current a/c payout</span>
                  </button>
                </div>
              </div>

              {/* Bento Tile 2: The Margin Protector (Dark Obsidian Luxury finish, 4 cols) */}
              <div 
                onMouseMove={handleSpotlightMouseMove}
                className="lg:col-span-4 bg-[#0B132B] text-white border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-6 shadow-xl flex flex-col justify-between relative overflow-hidden bento-spotlight-card bento-spotlight-dark"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold tracking-widest text-[#12A8A0] uppercase bg-[#12A8A0]/15 px-2.5 py-1 rounded-full border border-[#12A8A0]/30">
                      MARGIN PROTECTION
                    </span>
                    <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      +45% Acceptance
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                      Stop Slashing 20%–30% Treatment Margins
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      When patients hesitate at high upfront costs, doctors are forced to offer heavy discounts or risk bad debt (<em className="text-slate-300">khata</em>). Clinaza preserves 100% of your procedure revenue.
                    </p>
                  </div>

                  <div className="space-y-2.5 pt-1">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center justify-between">
                      <span className="text-xs text-rose-300 font-semibold">✕ Forced Clinic Discounts</span>
                      <span className="text-xs font-extrabold text-rose-400">₹0 Lost</span>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center justify-between">
                      <span className="text-xs text-rose-300 font-semibold">✕ Unpaid Patient Debt</span>
                      <span className="text-xs font-extrabold text-rose-400">0% Default</span>
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3 flex items-center justify-between">
                      <span className="text-xs text-emerald-300 font-semibold">✓ Clinic Current A/c Credit</span>
                      <span className="text-xs font-extrabold text-emerald-400">100% Full Payout</span>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 pt-4 border-t border-white/10">
                  <Link
                    to="/clinic-onboarding"
                    className="w-full py-3 bg-white hover:bg-slate-100 text-[#0B2450] text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                  >
                    <span>Onboard Clinic &bull; ₹999 Setup</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>

              {/* Bento Tile 3: Dual-Engine Underwriting (ETB & NTB) (4 cols) */}
              <div 
                onMouseMove={handleSpotlightMouseMove}
                className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-4 shadow-sm flex flex-col justify-between bento-spotlight-card relative"
              >
                <div className="space-y-3 relative z-10">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0867E8] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200/80 inline-block">
                    UNDERWRITING ARCHITECTURE
                  </span>
                  <h3 className="text-lg font-extrabold text-[#0B2450]">Dual-Engine Credit Layer</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Clinaza solves both existing credit card holders and the 24 Cr+ transacting Indians who lack a credit card.
                  </p>

                  <div className="space-y-3 pt-1">
                    <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-[#0B2450]">ETB (Existing-to-Bank)</span>
                        <span className="text-[9px] font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">&lt;60s Approval</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-normal">
                        Pre-approved limits across 16+ major banks (HDFC, ICICI, SBI, Axis, Kotak). 1-click e-mandate.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-[#0B2450]">NTB (Cardless Patient EMI)</span>
                        <span className="text-[9px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">No Credit Card</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-normal">
                        100% paperless RBI Account Aggregator (AA) verification. Instant Aadhaar OTP underwriting.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium relative z-10">
                  <span>Credit bureau impact:</span>
                  <strong className="text-emerald-700">Zero (Soft Pull)</strong>
                </div>
              </div>

              {/* Bento Tile 4: Practice Revenue Recovery ROI & Affordability Suite (8 cols) */}
              <div 
                id="calculator" 
                onMouseMove={handleSpotlightMouseMove}
                className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm flex flex-col justify-between bento-spotlight-card relative"
              >
                <div className="relative z-10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0f7a75]">AFFORDABILITY SUITE</span>
                      <h3 className="text-lg sm:text-xl font-extrabold text-[#0B2450]">Practice Revenue Recovery &amp; EMI Suite</h3>
                    </div>

                    {/* Mode Toggle */}
                    <div className="inline-flex bg-slate-100 p-1 rounded-xl shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setCalcMode('doctor')}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                          calcMode === 'doctor'
                            ? 'bg-[#0867E8] text-white shadow-xs'
                            : 'text-slate-600 hover:text-[#0B2450]'
                        }`}
                      >
                        <TrendingUp size={13} />
                        <span>Clinic ROI Recovery</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCalcMode('patient')}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                          calcMode === 'patient'
                            ? 'bg-white text-[#0B2450] shadow-xs'
                            : 'text-slate-600 hover:text-[#0B2450]'
                        }`}
                      >
                        <CreditCard size={13} />
                        <span>Patient EMI</span>
                      </button>
                    </div>
                  </div>

                  {calcMode === 'doctor' ? (
                    /* Doctor ROI Suite */
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-5 items-center">
                      <div className="md:col-span-6 space-y-5">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <label className="text-xs font-extrabold text-[#0B2450] uppercase tracking-wider">
                              Monthly High-Ticket Consultations
                            </label>
                            <span className="text-sm font-extrabold text-[#0867E8]">{roiConsultations} Cases/mo</span>
                          </div>
                          <input
                            type="range"
                            min={10}
                            max={100}
                            step={5}
                            value={roiConsultations}
                            onChange={e => setRoiConsultations(Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[#0867E8]"
                            aria-label="Monthly Consultations Slider"
                          />
                          <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                            <span>10 cases</span>
                            <span>100 cases</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <label className="text-xs font-extrabold text-[#0B2450] uppercase tracking-wider">
                              Average Procedure Ticket
                            </label>
                            <span className="text-sm font-extrabold text-[#0867E8]">₹{roiAvgTicket.toLocaleString('en-IN')}</span>
                          </div>

                          <div className="flex flex-wrap gap-1.5 pt-0.5">
                            {[
                              { label: 'Implants (₹45K)', val: 45000 },
                              { label: 'Aligners (₹75K)', val: 75000 },
                              { label: 'Rehab (₹1.5L)', val: 150000 },
                              { label: 'Full Arch (₹2.5L)', val: 250000 }
                            ].map((p, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setRoiAvgTicket(p.val)}
                                className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all ${
                                  roiAvgTicket === p.val
                                    ? 'bg-[#0867E8] text-white border-[#0867E8]'
                                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-[#0867E8]'
                                }`}
                              >
                                {p.label}
                              </button>
                            ))}
                          </div>

                          <input
                            type="range"
                            min={30000}
                            max={300000}
                            step={5000}
                            value={roiAvgTicket}
                            onChange={e => setRoiAvgTicket(Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[#0867E8]"
                            aria-label="Average Ticket Slider"
                          />
                        </div>
                      </div>

                      {/* Right Result Card: Revenue Leak Diagnostic & Recovery Engine (Improvement 3) */}
                      <div className="md:col-span-6 bg-[#0B2450] text-white p-5 sm:p-6 rounded-2xl space-y-4 shadow-xl border border-slate-700/80 text-left relative overflow-hidden">
                        {/* Background subtle radial glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#0867E8]/30 via-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

                        {/* Diagnostic Header */}
                        <div className="flex items-center justify-between relative z-10">
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-md border border-emerald-500/30">
                            REVENUE LEAK DIAGNOSTIC
                          </span>
                          <span className="text-[9px] font-bold text-slate-300 bg-white/10 px-2 py-0.5 rounded-md">
                            Front-Desk Drop-Off Analysis
                          </span>
                        </div>

                        {/* High-Contrast Side-by-Side: The Walkout Bleed vs The Clinaza Recovery */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 relative z-10">
                          {/* Red Card: The Walkout Bleed */}
                          <div className="bg-rose-950/40 border border-rose-500/30 p-3 rounded-xl space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[9.5px] font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1">
                                <span>❌ Walkout Bleed</span>
                              </span>
                              <span className="text-[8.5px] font-extrabold bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded">
                                ~60% Drop
                              </span>
                            </div>
                            <p className="text-xl font-extrabold text-rose-200 tabular-nums">
                              -₹{smoothRoiLost.toLocaleString('en-IN')}
                              <span className="text-[10px] font-normal text-rose-300/80">/mo</span>
                            </p>
                            <p className="text-[10px] text-rose-300/80 leading-tight">
                              <strong>{roiLostCases} cases lost</strong> to upfront price shock & quote hesitation.
                            </p>
                          </div>

                          {/* Green Card: The Clinaza Recovery */}
                          <div className="bg-emerald-950/40 border border-emerald-500/40 p-3 rounded-xl space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[9.5px] font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1">
                                <span>✅ Recaptured Cash</span>
                              </span>
                              <span className="text-[8.5px] font-extrabold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">
                                ~50% Recovered
                              </span>
                            </div>
                            <p className="text-xl font-extrabold text-emerald-300 tabular-nums">
                              +₹{smoothRoiMonthly.toLocaleString('en-IN')}
                              <span className="text-[10px] font-normal text-emerald-300/80">/mo</span>
                            </p>
                            <p className="text-[10px] text-emerald-300/80 leading-tight">
                              <strong>+{roiRecoveredCases} cases closed</strong> via instant 2-min paperless bank EMIs.
                            </p>
                          </div>
                        </div>

                        {/* Annual Practice Impact & Payback Metric */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-2 relative z-10">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase text-slate-300">
                              Annual Practice Net Upside
                            </span>
                            <span className="text-base font-extrabold text-white">
                              +₹{(smoothRoiAnnual / 100000).toFixed(1)} Lakhs / year
                            </span>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[9.5px] text-slate-300 pt-1 border-t border-white/10">
                            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                              <CheckCircle2 size={11} className="shrink-0" />
                              <span>₹999 setup fee recovered on Day 1 (Case #1)</span>
                            </span>
                            <span className="text-slate-400">100% Non-Recourse &bull; T+1 Payout</span>
                          </div>
                        </div>

                        <Link
                          to="/clinic-onboarding"
                          className="w-full py-3 bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-lg active:scale-95 cursor-pointer relative z-10"
                        >
                          <span>Claim Clinic Territory &bull; ₹999 Setup</span>
                          <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  ) : (
                    /* Patient EMI Suite with Smooth Interpolation */
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-5 items-center">
                      <div className="md:col-span-6 space-y-5">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <label className="text-xs font-extrabold text-[#0B2450] uppercase tracking-wider">
                              Treatment Fee
                            </label>
                            <span className="text-sm font-extrabold text-[#0867E8]">₹{emiAmount.toLocaleString('en-IN')}</span>
                          </div>

                          <div className="flex flex-wrap gap-1.5 pt-0.5">
                            {[
                              { label: 'Implant', amount: 45000 },
                              { label: 'Aligners', amount: 75000 },
                              { label: 'IVF Cycle', amount: 150000 },
                              { label: 'Full Mouth', amount: 250000 },
                            ].map((preset) => (
                              <button
                                key={preset.label}
                                type="button"
                                onClick={() => setEmiAmount(preset.amount)}
                                className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all ${
                                  emiAmount === preset.amount
                                    ? 'bg-[#0867E8] text-white border-[#0867E8]'
                                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-[#0867E8]'
                                }`}
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>

                          <input
                            type="range"
                            min={30000}
                            max={500000}
                            step={5000}
                            value={emiAmount}
                            onChange={e => setEmiAmount(Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[#0867E8]"
                            aria-label="Treatment amount slider"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-extrabold text-[#0B2450] uppercase tracking-wider block">Repayment Tenure</label>
                          <div className="grid grid-cols-4 gap-1.5">
                            {[3, 6, 12, 24].map(t => (
                              <button
                                key={t}
                                type="button"
                                onClick={() => setEmiTenure(t)}
                                className={`py-2 rounded-xl text-xs font-extrabold border transition-all ${
                                  emiTenure === t
                                    ? 'bg-[#0867E8] text-white border-[#0867E8] shadow-xs'
                                    : 'bg-slate-50 text-[#0B2450] border-slate-200 hover:border-[#0867E8]'
                                }`}
                              >
                                {t}M
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right EMI Result with Smooth Rolling Numbers */}
                      <div className="md:col-span-6 bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 text-left">
                        <div className="bg-gradient-to-br from-[#0867E8] to-[#0f7a75] rounded-xl p-4 text-white text-center space-y-0.5 shadow-sm">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">Indicative Monthly EMI</span>
                          <p className="text-3xl font-extrabold tabular-nums">₹{smoothMonthlyEMI.toLocaleString('en-IN')}</p>
                          <p className="text-[10px] text-white/80 font-medium">per month &times; {emiTenure} months</p>
                        </div>

                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                            <span className="text-slate-500 font-medium">Principal:</span>
                            <span className="font-bold text-[#0B2450]">₹{emiAmount.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                            <span className="text-slate-500 font-medium">Est. Interest (15% p.a.):</span>
                            <span className="font-bold text-slate-700 tabular-nums">₹{smoothTotalInterest.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between items-center py-1 font-bold text-[#0867E8]">
                            <span>Est. Total Payable:</span>
                            <span className="tabular-nums">₹{smoothTotalPayable.toLocaleString('en-IN')}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            trackEvent('click_calc_check_eligibility');
                            setShowEligibilityModal(true);
                          }}
                          className="w-full py-2.5 bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                        >
                          <ShieldCheck size={14} /> Check Patient Eligibility &rarr;
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4 Affordability Modes Strip */}
                <div className="pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-left">
                  <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-200/60">
                    <span className="text-[10px] font-extrabold text-[#0B2450] block">Cardless EMI</span>
                    <span className="text-[9px] text-slate-500">Aadhaar OTP &bull; No CC</span>
                  </div>
                  <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-200/60">
                    <span className="text-[10px] font-extrabold text-[#0B2450] block">Credit Card EMI</span>
                    <span className="text-[9px] text-slate-500">21+ Scheduled Banks</span>
                  </div>
                  <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-200/60">
                    <span className="text-[10px] font-extrabold text-[#0B2450] block">Debit Card EMI</span>
                    <span className="text-[9px] text-slate-500">HDFC, ICICI, Axis, Kotak</span>
                  </div>
                  <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-200/60">
                    <span className="text-[10px] font-extrabold text-[#0B2450] block">Down Payment + EMI</span>
                    <span className="text-[9px] text-slate-500">Hybrid Co-Payment Mode</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── 3C. THE 10-SECOND CHAIRSIDE SCRIPT (FRONT-DESK OBJECTION HANDLING CHEAT SHEET) ── */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0f7a75]">
                      FRONT-DESK PLAYBOOK
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-bold text-slate-500">Zero Clinic Discounts Needed</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#0B2450] tracking-tight [text-wrap:balance]">
                    The 10-Second Consultation Script: Turn "Too Expensive" Into Closed Cases
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 [text-wrap:pretty]">
                    60%+ of high-ticket dental, aesthetic, IVF, and surgical consultations drop off because front desks don't have a structured answer to upfront price shock. Here is how Clinaza converts resistance instantly:
                  </p>
                </div>
              </div>

              {/* Objection Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {OBJECTION_SCRIPTS.map((obj) => (
                  <button
                    key={obj.id}
                    type="button"
                    onClick={() => setActiveObjection(obj.id)}
                    className={`p-3 min-h-[48px] rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between active:scale-[0.98] ${
                      activeObjection === obj.id
                        ? 'bg-[#0B2450] text-white border-[#0B2450] shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
                    }`}
                  >
                    <span className={`text-[9.5px] font-extrabold uppercase tracking-wider block mb-1 ${
                      activeObjection === obj.id ? 'text-emerald-400' : 'text-[#0867E8]'
                    }`}>
                      Objection #{obj.id + 1}: {obj.badge}
                    </span>
                    <span className="text-xs font-bold line-clamp-2">
                      "{obj.patientSays.slice(0, 52)}..."
                    </span>
                  </button>
                ))}
              </div>

              {/* Active Objection Deep-Dive Comparison */}
              {(() => {
                const currentObj = OBJECTION_SCRIPTS[activeObjection];
                return (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2">
                    {/* Left: The Patient Objection & The Expensive Mistake (5 cols) */}
                    <div className="md:col-span-5 space-y-3">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                          Patient Objection at Front Desk
                        </span>
                        <p className="text-sm font-bold text-[#0B2450] italic leading-snug">
                          "{currentObj.patientSays}"
                        </p>
                      </div>

                      <div className="bg-rose-50/80 p-4 rounded-2xl border border-rose-200/80 space-y-1.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                          <X size={12} className="text-rose-600" />
                          <span>The Costly Front-Desk Mistake</span>
                        </span>
                        <p className="text-xs text-rose-900 leading-relaxed">
                          {currentObj.expensiveMistake}
                        </p>
                      </div>
                    </div>

                    {/* Right: The Clinaza 10-Second Script & Clinic Upside (7 cols) */}
                    <div className="md:col-span-7 bg-gradient-to-br from-[#0B2450] to-[#0D3B7A] text-white p-5 sm:p-6 rounded-2xl space-y-4 shadow-md flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                            THE 10-SECOND FRONT-DESK SCRIPT
                          </span>
                          <span className="text-[9px] font-semibold text-slate-300">
                            Say This Verbatim
                          </span>
                        </div>
                        <p className="text-sm sm:text-base font-medium text-white leading-relaxed pt-1 bg-white/10 p-3.5 rounded-xl border border-white/15">
                          "{currentObj.clinazaScript}"
                        </p>
                      </div>

                      <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2 text-emerald-300">
                          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                          <span className="font-semibold text-[11px] leading-tight">
                            {currentObj.clinicUpside}
                          </span>
                        </div>
                        <Link
                          to="/clinic-onboarding"
                          className="px-3.5 py-2 min-h-[44px] bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-extrabold rounded-xl transition-all shadow-sm shrink-0 flex items-center justify-center gap-1 active:scale-[0.98]"
                        >
                          <span>Onboard Clinic &bull; ₹999</span>
                          <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </FadeIn>
        </section>

        {/* ── 3B. FRONT-DESK 10-SECOND LINK GENERATOR (INTERACTIVE LIVE DEMO) (Improvement 3) ── */}
        <section id="front-desk-simulator" aria-label="Interactive Front-Desk Prescription Simulator" className="py-14 sm:py-20 px-4 sm:px-6 bg-white border-b border-slate-200/80">
          <FadeIn className="max-w-6xl mx-auto space-y-10">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-black text-[#0867E8] uppercase tracking-widest bg-blue-50 border border-blue-200 px-3 py-1 rounded-full inline-block">
                LIVE INTERACTIVE SIMULATOR
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#0B2450]">
                Experience the 10-Second Reception Workflow
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
                See exactly how your front desk prescribes flexible monthly EMIs. Enter a patient and procedure to preview the real-time WhatsApp pass.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#F7FAFC] border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm">
              {/* Left Column: Front-Desk Controls (6 cols) */}
              <div className="lg:col-span-6 space-y-6 text-left">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
                  <div className="w-8 h-8 rounded-lg bg-[#0867E8] text-white flex items-center justify-center font-bold text-xs">
                    01
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-[#0B2450]">Reception Prescription Desk</h3>
                    <p className="text-[11px] text-slate-500">Configure simulated patient treatment</p>
                  </div>
                </div>

                {/* Patient Name Input */}
                <div className="space-y-1.5">
                  <label htmlFor="sim-patient-name" className="text-xs font-bold text-slate-700 block">
                    Patient Name
                  </label>
                  <input
                    id="sim-patient-name"
                    type="text"
                    value={simPatientName}
                    onChange={(e) => setSimPatientName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-2.5 min-h-[44px] bg-white border border-slate-300 rounded-xl text-base sm:text-sm text-[#0B2450] font-semibold focus:outline-hidden focus:border-[#0867E8] focus:ring-2 focus:ring-[#0867E8]/20 transition-all"
                  />
                </div>

                {/* Specialty Vertical Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Specialty Vertical
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {SIM_SPECIALTIES.map((spec) => {
                      const Icon = spec.icon;
                      const isActive = simSpecialty === spec.id;
                      return (
                        <button
                          key={spec.id}
                          type="button"
                          onClick={() => {
                            setSimSpecialty(spec.id);
                            setSimTreatment(spec.procedures[0].name);
                            setSimAmount(spec.procedures[0].defaultAmt);
                          }}
                          className={`px-3 py-1.5 min-h-[38px] text-xs font-bold rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                            isActive
                              ? 'bg-[#0B2450] text-white border-[#0B2450] shadow-xs'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <Icon size={13} className={isActive ? 'text-amber-400' : 'text-slate-500'} />
                          <span>{spec.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Procedure Preset Chips */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Procedure Type ({currentSimSpecialty.label})
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {currentSimSpecialty.procedures.map((proc) => (
                      <button
                        key={proc.name}
                        type="button"
                        onClick={() => {
                          setSimTreatment(proc.name);
                          setSimAmount(proc.defaultAmt);
                        }}
                        className={`px-3 py-2 min-h-[40px] text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                          simTreatment === proc.name
                            ? 'bg-[#0867E8] text-white border-[#0867E8] shadow-xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {proc.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Treatment Amount Slider & Quick Buttons */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="sim-amount-slider" className="text-xs font-bold text-slate-700">
                      Treatment Amount
                    </label>
                    <span className="text-base font-extrabold text-[#0867E8] tabular-nums">
                      ₹{simAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <input
                    id="sim-amount-slider"
                    type="range"
                    min={15000}
                    max={250000}
                    step={5000}
                    value={simAmount}
                    onChange={(e) => setSimAmount(Number(e.target.value))}
                    className="w-full accent-[#0867E8] cursor-pointer"
                  />
                  <div className="flex gap-1.5 flex-wrap pt-1">
                    {[25000, 45000, 65000, 85000, 120000, 150000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setSimAmount(amt)}
                        className={`px-2.5 py-1.5 min-h-[40px] text-[11px] font-bold rounded-md border transition-all cursor-pointer ${
                          simAmount === amt
                            ? 'bg-[#0B2450] text-white border-[#0B2450]'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        ₹{(amt / 1000).toFixed(0)}k
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tenure Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Financing Tenure
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[6, 12, 18, 24].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSimTenure(t)}
                        className={`py-2 min-h-[40px] text-xs font-extrabold rounded-xl border transition-all cursor-pointer ${
                          simTenure === t
                            ? 'bg-[#0867E8] text-white border-[#0867E8] shadow-xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {t} Months
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-900 font-bold">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    <span>Calculated Monthly EMI:</span>
                  </span>
                  <span className="text-base font-extrabold text-emerald-800 tabular-nums">
                    ₹{simEmi.toLocaleString('en-IN')}<span className="text-xs font-medium text-emerald-600">/mo</span>
                  </span>
                </div>
              </div>

              {/* Right Column: Authentic WhatsApp Chat Simulation (6 cols) */}
              <div className="lg:col-span-6 flex flex-col items-center">
                <div className="w-full max-w-md bg-[#EFEAE2] rounded-3xl overflow-hidden shadow-lg border border-slate-300 text-left">
                  {/* WhatsApp Header */}
                  <div className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-emerald-700 border border-white/30 flex items-center justify-center font-extrabold text-sm text-white">
                        {currentSimSpecialty.clinicName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold leading-tight flex items-center gap-1.5">
                          <span>{currentSimSpecialty.clinicName}</span>
                          <span className="text-[9px] bg-emerald-500/40 text-emerald-100 px-1 rounded">{currentSimSpecialty.label}</span>
                        </p>
                        <p className="text-[10px] text-emerald-100/80 font-normal">Online &bull; Front-Desk Automated Dispatch</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded text-white/90">
                      WhatsApp Verified
                    </span>
                  </div>

                  {/* Chat Canvas */}
                  <div className="p-4 space-y-3 min-h-[300px] flex flex-col justify-end bg-[#EFEAE2] relative">
                    <div className="text-center">
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-white/70 text-slate-500 px-2.5 py-1 rounded-full shadow-2xs">
                        Today &bull; Front-Desk Instant Share
                      </span>
                    </div>

                    {/* Chat Bubble */}
                    <div className="bg-white rounded-2xl rounded-tl-xs p-3.5 shadow-sm border border-slate-200/60 max-w-[95%] space-y-2 text-xs text-slate-800">
                      <p className="leading-snug">
                        Namaste <strong className="text-[#0B2450]">{simPatientName || 'Patient'} ji</strong>,
                      </p>
                      <p className="text-slate-600 leading-relaxed text-[11.5px]">
                        {currentSimSpecialty.doctorPrefix}’s team has prepared your customized treatment plan for <strong className="text-[#0867E8]">{simTreatment}</strong> at {currentSimSpecialty.clinicName}.
                      </p>

                      {/* Card Inside WhatsApp */}
                      <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200 space-y-1">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-slate-500 font-medium">Treatment Total:</span>
                          <span className="font-bold text-slate-800">₹{simAmount.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] pt-0.5 border-t border-slate-200/60">
                          <span className="text-[#0867E8] font-bold">Flexible Monthly EMI:</span>
                          <span className="font-extrabold text-[#0867E8]">₹{simEmi.toLocaleString('en-IN')}/mo</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-slate-500 pt-0.5">
                          <span>Tenure:</span>
                          <span className="font-semibold text-slate-700">{simTenure} Months</span>
                        </div>
                      </div>

                      <div className="bg-blue-50/80 rounded-xl p-2.5 border border-blue-200/80 space-y-1">
                        <p className="text-[11px] font-bold text-[#0B2450]">
                          ⚡ Instant 92-Second Paperless Approval
                        </p>
                        <p className="text-[10px] text-slate-600">
                          Tap link below to complete 2-minute Aadhaar OTP verification and activate your treatment pass:
                        </p>
                        <p className="text-xs font-mono font-bold text-[#0867E8] underline break-all">
                          https://clinaza.in/pay/pass-8842
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-1 text-[9px] text-slate-400">
                        <span>Powered by Clinaza &times; Pine Labs</span>
                        <div className="flex items-center gap-1">
                          <span>11:42 AM</span>
                          <span className="text-blue-500 font-bold">✓✓</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* ── 4. MULTI-SPECIALTY TREATMENT SHOWCASE ── */}
        <section id="treatments" aria-label="Supported Treatments" className="py-14 sm:py-20 px-4 sm:px-6 bg-white">
          <FadeIn className="max-w-6xl mx-auto space-y-8 text-center">
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold text-[#0867E8] uppercase tracking-widest bg-blue-50 border border-blue-200 px-3 py-1 rounded-full inline-block">
                SUPPORTED SPECIALTIES
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0B2450]">High-Ticket Treatments Covered On EMI</h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
                Instant point-of-care financing from ₹30,000 to ₹5,00,000 across dental, vision, fertility, and surgical care.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-left">
              {[
                { 
                  icon: Stethoscope,
                  badgeColor: 'bg-blue-50 text-[#0867E8] border-blue-200',
                  category: 'Dental Care', 
                  treatments: 'Implants, Aligners, Crowns & Full Mouth Rehab',
                  link: '/blog/dental-implants-cost-on-emi-india',
                  popular: '₹45K – ₹2.5L'
                },
                { 
                  icon: Sparkles,
                  badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
                  category: 'Aesthetics & Hair', 
                  treatments: 'GFC, PRP, HIFU, HIEMT, Botox & Hair Transplants',
                  link: '/aesthetic-treatments-on-emi',
                  popular: '₹25K – ₹1.8L'
                },
                { 
                  icon: Eye,
                  badgeColor: 'bg-emerald-50 text-[#0f7a75] border-emerald-200',
                  category: 'Ophthalmology', 
                  treatments: 'Contoura Vision, SMILE, ICL & Cataract Lenses',
                  link: '/blog/lasik-eye-surgery-cost-on-emi-india-guide',
                  popular: '₹40K – ₹1.2L'
                },
                { 
                  icon: Baby,
                  badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
                  category: 'IVF & Fertility', 
                  treatments: 'IVF Cycles, ICSI, IUI & Egg Freezing Packages',
                  link: '/blog/ivf-cost-on-emi-fertility-treatment-financing-india',
                  popular: '₹1.2L – ₹3.5L'
                },
                { 
                  icon: Activity,
                  badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
                  category: 'Orthopaedics & Surgeries', 
                  treatments: 'Knee Replacement, Bariatric, ACL & Daycare Surgeries',
                  link: '/blog/knee-replacement-surgery-cost-on-emi-india',
                  popular: '₹80K – ₹4.0L'
                }
              ].map((cat, idx) => {
                const IconComponent = cat.icon;
                return (
                  <Link 
                    key={idx} 
                    to={cat.link}
                    className="bg-white border border-slate-200 hover:border-[#0867E8]/60 p-5 rounded-2xl space-y-3 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_28px_rgba(8,103,232,0.12)] group block active:scale-[0.98]"
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${cat.badgeColor} group-hover:scale-105 transition-transform duration-300`}>
                        <IconComponent size={20} aria-hidden="true" />
                      </div>
                      <span className="text-[9px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                        {cat.popular}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-[#0B2450] group-hover:text-[#0867E8] transition-colors leading-tight">
                        {cat.category}
                      </h3>
                      <p className="text-[11px] text-slate-600 mt-1 leading-snug">{cat.treatments}</p>
                    </div>
                    <span className="text-[10px] font-bold text-[#0867E8] inline-flex items-center gap-1 pt-1">
                      View Procedure Pricing &rarr;
                    </span>
                  </Link>
                );
              })}
            </div>
          </FadeIn>
        </section>

        {/* ── 6B. THE CLINAZA & PINE LABS CMP DIFFERENCE (COMPARISON MATRIX) ── */}
        <section aria-label="Why Clinaza Outperforms Traditional Financing" className="py-12 sm:py-16 px-4 sm:px-6 bg-gradient-to-b from-white to-[#F5F9FC]">
          <FadeIn className="max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-black text-[#0867E8] uppercase tracking-widest bg-blue-50 border border-blue-200 px-3 py-1 rounded-full inline-block">
                THE PINE LABS AFFORDABILITY ADVANTAGE
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#0B2450]">
                Why Clinaza &amp; Plural by Pine Labs Outperform Traditional Medical Loans
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
                Traditional healthcare finance is fragmented, slow, and causes high drop-offs at the reception desk. Our unified multi-lender credit layer solves every point of friction.
              </p>
            </div>

            {/* Comparison Table */}
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[640px]">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80">
                      <th className="py-4 px-5 text-xs font-black text-slate-500 uppercase tracking-wider w-1/4">Key Capability</th>
                      <th className="py-4 px-5 text-xs font-black text-rose-600 uppercase tracking-wider w-3/8 bg-rose-50/40">
                        Traditional Medical EMI / 3rd Party Apps
                      </th>
                      <th className="py-4 px-5 text-xs font-black text-[#0867E8] uppercase tracking-wider w-3/8 bg-blue-50/50">
                        <div className="flex items-center gap-2">
                          <span>Clinaza &times; Plural by Pine Labs</span>
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                            Enterprise Grade
                          </span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {[
                      {
                        feature: 'Patient Checkout Flow',
                        traditional: 'Redirected to 3rd party apps or lender portals; requires mandatory app installation & login.',
                        clinaza: 'Seamless single flow directly in-browser via counter QR code. Zero app download required (<60 seconds).',
                        highlight: true
                      },
                      {
                        feature: 'Income & Cashflow Proof',
                        traditional: 'Manual PDF bank statement & salary slip downloads with passwords; 80% patient abandonment at reception.',
                        clinaza: 'Native RBI Account Aggregator (AA) integration. Fetches verified bank cashflow in seconds via secure OTP.',
                        highlight: true
                      },
                      {
                        feature: 'KYC & Verification',
                        traditional: 'Fragmented KYC process repeated separately for each prospective lender.',
                        clinaza: 'Unified 1-time digital Aadhaar & selfie KYC shared securely across the multi-lender network.',
                        highlight: false
                      },
                      {
                        feature: 'Lender Matching & Approval',
                        traditional: 'Single-lender integration. Narrow credit policies reject over 50% of walk-in patients.',
                        clinaza: 'Intelligent Multi-Lender BRE. Matches patient profile across 55+ banks & NBFCs, driving 76%+ approval rates.',
                        highlight: true
                      },
                      {
                        feature: 'Credit Score Impact',
                        traditional: 'Hard bureau checks trigger multiple credit inquiries that pull down the patient’s CIBIL score.',
                        clinaza: 'Soft bureau pull pre-assessment. Patients check multi-bank eligibility with 0 impact on credit score.',
                        highlight: false
                      },
                      {
                        feature: 'Repayment & Mandate Setup',
                        traditional: 'Physical paper NACH forms or delayed debit card netbanking logins with slow activation.',
                        clinaza: '1-Click e-Mandate setup via UPI or Netbanking for instantaneous auto-repayment authorization.',
                        highlight: false
                      },
                      {
                        feature: 'Clinic Settlement & Recourse',
                        traditional: 'Manual reconciliation, delayed 3–7 day payouts, or hidden recourse on patient default.',
                        clinaza: 'Guaranteed upfront T+1 direct current account payout. 100% non-recourse with zero clinic credit liability.',
                        highlight: true
                      }
                    ].map((row, idx) => (
                      <tr key={idx} className={row.highlight ? 'bg-slate-50/30' : 'bg-white'}>
                        <td className="py-3.5 px-5 font-bold text-[#0B2450] whitespace-nowrap align-top">
                          {row.feature}
                        </td>
                        <td className="py-3.5 px-5 text-slate-500 bg-rose-50/20 align-top">
                          <div className="flex items-start gap-2">
                            <span className="text-rose-500 font-bold shrink-0">✕</span>
                            <span>{row.traditional}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-5 text-slate-800 font-medium bg-blue-50/20 align-top">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 size={15} className="text-[#0f7a75] shrink-0 mt-0.5" />
                            <span>{row.clinaza}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* ── 7. WHY CLINICS USE CLINAZA ── */}
        <section aria-label="Why Clinics Use Clinaza" className="py-12 sm:py-16 px-4 sm:px-6">
          <FadeIn className="max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-black text-[#0f7a75] uppercase tracking-widest">FOR CLINIC OWNERS</span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#0B2450]">Why Clinics Use Clinaza</h2>
            </div>

            {/* Prominent ₹999 One-Time Onboarding Fee Highlight Badge */}
            <div className="bg-gradient-to-r from-blue-50/80 via-emerald-50/50 to-blue-50/80 border border-blue-200/90 p-5 rounded-2xl text-center max-w-2xl mx-auto shadow-2xs">
              <span className="text-2xl font-black text-[#0867E8] block">₹999 One-Time Onboarding Fee</span>
              <p className="text-xs font-bold text-[#0B2450] mt-1">One-time clinic onboarding &amp; lending gateway integration. Zero recurring monthly subscriptions.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-left">
              {[
                { title: '₹999 One-Time Setup', desc: 'One-time clinic onboarding & lending gateway integration. Zero recurring monthly fees.' },
                { title: 'Free Clinic CRM & EMR Portal', desc: '100% free patient reactivation & treatment follow-up portal for life.' },
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
          </FadeIn>
        </section>

        {/* ── 8. ONBOARDED PARTNER CLINICS NETWORK (SLIDESHOW CAROUSEL) ── */}
        <section aria-label="Onboarded Partner Clinics" className="py-14 sm:py-18 px-4 sm:px-6 bg-gradient-to-b from-[#F7FAFC] to-slate-100 border-y border-slate-200/60 overflow-hidden relative">
          <div className="max-w-5xl mx-auto space-y-8 text-center">
            <div className="space-y-2">
              <span className="text-[10px] font-black text-[#0f7a75] uppercase tracking-widest flex items-center justify-center gap-1.5">
                <Building2 size={16} /> TRUSTED MULTI-SPECIALTY CLINIC NETWORK
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#0B2450]">Onboarded Partner Clinics</h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
                Leading dental, aesthetic, fertility, and surgical clinics offering instant point-of-care patient EMI financing powered by Clinaza.
              </p>
            </div>

            {/* Continuous Smooth Slideshow Container */}
            <div className="relative overflow-hidden py-4 px-2 bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/90 shadow-sm group">
              {/* Fade Edges */}
              <div className="absolute left-0 inset-y-0 w-12 sm:w-20 bg-gradient-to-r from-[#F7FAFC] via-[#F7FAFC]/80 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 inset-y-0 w-12 sm:w-20 bg-gradient-to-l from-[#F7FAFC] via-[#F7FAFC]/80 to-transparent z-10 pointer-events-none" />

              <div className="flex w-max gap-4 animate-marquee-slow group-hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:animate-none">
                {(() => {
                  const clinicsList = [
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
                      name: 'Lagom by Ami Aesthetic & Wellness',
                      location: 'Umayanalloor, Kollam, Kerala',
                      phone: 'Verified Partner Desk',
                      rating: '5.0 ★ (Verified Partner)',
                      specialties: 'GFC, PRP, HIFU & Wellness',
                      link: '/aesthetic-treatments-on-emi',
                      accent: 'border-amber-300 bg-white shadow-sm',
                      badge: 'Aesthetics Partner',
                      badgeColor: 'bg-amber-600 text-white'
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
                      name: 'Aura Fertility & IVF Centre',
                      location: 'Indiranagar, Bengaluru, Karnataka',
                      phone: 'Direct Partner Desk',
                      rating: '4.9 ★ (180 reviews)',
                      specialties: 'IVF Cycles, ICSI & Egg Freezing',
                      link: '/clinic-onboarding?category=ivf',
                      accent: 'border-purple-300 bg-white shadow-sm',
                      badge: 'Fertility Partner',
                      badgeColor: 'bg-purple-600 text-white'
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
                      name: 'ClearVision Eye & Laser Hospital',
                      location: 'Andheri West, Mumbai, Maharashtra',
                      phone: 'Direct Partner Desk',
                      rating: '4.9 ★ (240 reviews)',
                      specialties: 'Contoura Vision & Blade-Free LASIK',
                      link: '/clinic-onboarding?category=lasik',
                      accent: 'border-emerald-300 bg-white shadow-sm',
                      badge: 'Eye Care Partner',
                      badgeColor: 'bg-emerald-600 text-white'
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
                    {
                      name: 'Dantsri Dental Hospital',
                      location: 'Janta College Rd, Jhanjharpur, Bihar',
                      phone: '083402 20139',
                      rating: '5.0 ★ (@dantsri_dental)',
                      specialties: 'Implants, Smile Design & RCT',
                      link: 'https://www.instagram.com/dantsri_dental/',
                      isExternal: true,
                      accent: 'border-pink-200 bg-white shadow-sm',
                      badge: 'Instagram Partner',
                      badgeColor: 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
                    }
                  ];
                  return [...clinicsList, ...clinicsList].map((clinic, idx) => (
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
                ));
                })()}
              </div>
            </div>

            {/* Interactive Clinic / Pincode Finder Widget */}
            <div className="pt-8 max-w-4xl mx-auto w-full">
              <ClinicCityFinder
                onCheckEligibility={(cityName) => {
                  setPatientData((prev) => ({ ...prev, city: cityName }));
                  setShowEligibilityModal(true);
                }}
              />
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-slate-500">
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



        {/* ── PATIENT ELIGIBILITY 2-STEP MODAL ── */}
        {showEligibilityModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white border border-slate-200 rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-5 text-left max-h-[85vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
              <button
                type="button"
                onClick={handleCloseEligibilityModal}
                className="absolute top-4 right-4 sm:top-5 sm:right-5 text-slate-400 hover:text-slate-600 w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors z-10"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              {isFinancingSuccess ? (
                /* ── IN-APP SEAMLESS CARE-PASS OVERLAY (IMPROVEMENT 1) ── */
                <div className="space-y-4 py-1 animate-in zoom-in-95 duration-200 overflow-y-auto pr-0.5">
                  {/* Header Status Card */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0 shadow-xs">
                      <CheckCircle2 size={26} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block">
                        FINANCING PASS READY
                      </span>
                      <h3 className="text-lg sm:text-xl font-black text-[#0B2450] tracking-tight leading-tight">
                        Verification Link Generated
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Dispatched via SMS to <strong className="text-slate-800">{maskedMobile || patientData.mobile}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Secure Verification Ready Banner */}
                  <div className="p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50/80 border border-blue-200 rounded-2xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-black text-[#0B2450] block">
                          Secure Application Generated
                        </span>
                        <span className="text-[10px] text-slate-500">
                          Complete Aadhaar OTP verification via RBI-regulated partner portal
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* In-App Healthcare Care-Pass Card */}
                  <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-3 relative overflow-hidden shadow-lg border border-slate-800">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black tracking-widest uppercase text-emerald-400">CLINAZA PASS</span>
                        <span className="text-[9px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                          ID: {patientData.mobile ? `+91 ${patientData.mobile.replace(/\D/g, '').slice(-10)}` : 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400">
                        <Lock size={10} className="text-emerald-400" />
                        <span>256-Bit SSL</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Patient Name</span>
                        <span className="font-bold text-slate-100">{patientData.name}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Treatment</span>
                        <span className="font-bold text-slate-100 truncate block">{patientData.treatment}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Requested Amount</span>
                        <span className="font-bold text-emerald-400">{patientData.amount}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Lender Network</span>
                        <span className="font-bold text-slate-200">Instant Digital EMI (35+ Options)</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-1 space-y-2">
                    <a
                      href={customerLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 bg-[#0867E8] hover:bg-[#0756C7] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 text-center cursor-pointer"
                    >
                      <span>Continue to Secure KYC Now</span>
                      <ChevronRight size={15} />
                    </a>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={handleCopyPassLink}
                        className="py-2.5 px-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-all shadow-2xs"
                      >
                        <Copy size={13} className="text-[#0867E8]" />
                        <span>{passCopied ? 'Link Copied!' : 'Copy Link'}</span>
                      </button>

                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(`Hi! Here is my Clinaza instant treatment financing link to complete digital KYC: ${customerLink}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs"
                      >
                        <MessageSquare size={13} className="text-emerald-600" />
                        <span>Share WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 text-center leading-relaxed pt-1 border-t border-slate-100">
                    🔒 Final approval and repayment terms are verified digitally on our partner portal.
                  </p>
                </div>
              ) : (
                <>
                  {/* Modal Header */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-[10px] font-black text-[#0f7a75] uppercase tracking-widest block">PATIENT FINANCING CHECK</span>
                      <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded-md">
                        <span className="text-[8px] uppercase tracking-wider text-slate-500 font-bold">Powered by</span>
                        
                      </div>
                    </div>
                    <h3 className="text-xl font-black text-[#0B2450]">
                      Check Financing Eligibility
                    </h3>
                    <p className="text-xs text-slate-500">
                      Cardless EMI, Credit Card EMI (21+ Banks) &amp; Debit Card EMI options across 13+ NBFCs.
                    </p>
                  </div>

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
                          <option value="Knee & Orthopaedic Surgery">🦴 Orthopaedic & Joint Treatments</option>
                          <option value="Outpatient Elective Surgery">🩺 Outpatient & Daycare Procedures</option>
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
                </>
              )}
            </div>
          </div>
        )}

        {/* ── 7. COMPREHENSIVE FAQ (Improvement 5) ── */}
        <section aria-label="Frequently Asked Questions" className="py-16 px-4 sm:px-6">
          <FadeIn className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-black text-[#0f7a75] uppercase tracking-widest flex items-center justify-center gap-1.5">
                <HelpCircle size={16} aria-hidden="true" /> FREQUENTLY ASKED QUESTIONS
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#0B2450]">Common Questions</h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Clear answers for dental clinic directors and prospective patients.
              </p>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {[
                { id: 'all', label: 'All Questions', count: comprehensiveFaqs.length },
                { id: 'clinics', label: 'For Dental Clinics', count: comprehensiveFaqs.filter(f => f.category === 'clinics').length },
                { id: 'patients', label: 'For Patients', count: comprehensiveFaqs.filter(f => f.category === 'patients').length },
                { id: 'compliance', label: 'RBI & Security', count: comprehensiveFaqs.filter(f => f.category === 'compliance').length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setFaqCategory(tab.id as any);
                    setActiveFaq(null);
                  }}
                  className={`px-3.5 py-2 min-h-[40px] text-xs font-bold rounded-full border transition-all flex items-center gap-1.5 cursor-pointer ${
                    faqCategory === tab.id
                      ? 'bg-[#0867E8] text-white border-[#0867E8] shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                    faqCategory === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Keyword Search Bar */}
            <div className="relative max-w-md mx-auto">
              <input
                type="text"
                value={faqSearchQuery}
                onChange={(e) => setFaqSearchQuery(e.target.value)}
                placeholder="Search FAQs: e.g. T+1, non-recourse, CIBIL, interest..."
                className="w-full px-4 py-2.5 min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-xs text-[#0B2450] placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-[#0867E8] transition-all"
              />
              {faqSearchQuery && (
                <button
                  type="button"
                  onClick={() => setFaqSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold px-1.5 py-0.5 rounded cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* FAQ List */}
            <div className="space-y-3">
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <p className="text-xs font-bold text-slate-500">No matching questions found for "{faqSearchQuery}"</p>
                  <button
                    type="button"
                    onClick={() => {
                      setFaqSearchQuery('');
                      setFaqCategory('all');
                    }}
                    className="text-xs font-bold text-[#0867E8] hover:underline cursor-pointer"
                  >
                    Reset FAQ filters
                  </button>
                </div>
              ) : (
                filteredFaqs.map((faq, idx) => {
                  const isOpen = activeFaq === idx;
                  return (
                    <div key={idx} className="bg-[#F7FAFC] border border-slate-200 rounded-2xl overflow-hidden shadow-2xs transition-all">
                      <button
                        type="button"
                        onClick={() => setActiveFaq(isOpen ? null : idx)}
                        aria-expanded={isOpen}
                        className="w-full px-5 sm:px-6 py-4 min-h-[44px] flex justify-between items-center text-left hover:bg-slate-100/60 transition-colors gap-3 cursor-pointer"
                      >
                        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded shrink-0 ${
                            faq.category === 'clinics' ? 'bg-blue-100 text-[#0867E8]' :
                            faq.category === 'patients' ? 'bg-emerald-100 text-emerald-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {faq.category === 'clinics' ? 'Clinic' : faq.category === 'patients' ? 'Patient' : 'Security'}
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-[#0B2450]">{faq.q}</span>
                        </div>
                        <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-[#0756C7]' : ''}`} aria-hidden="true" />
                      </button>
                      {isOpen && (
                        <div className="px-5 sm:px-6 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-200/60 bg-white">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </FadeIn>
        </section>

        {/* ── 8. CLINIC CTA & REGISTRATION FORM ── */}
        <section id="partner-form" aria-label="Clinic Partner Registration" className="py-10 sm:py-16 px-3.5 sm:px-6">
          <FadeIn className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-b from-[#F7FAFC] to-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl space-y-5 text-left">
            {/* Form Toggle Header */}
            <div className="flex bg-slate-200/70 p-1 rounded-xl mb-2">
              <button
                type="button"
                onClick={() => setFormType('clinic')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  formType === 'clinic' ? 'bg-white text-[#0B2450] shadow-xs' : 'text-slate-600 hover:text-[#0B2450]'
                }`}
              >
                <Building2 size={14} className="shrink-0" />
                <span>For Clinics<span className="hidden sm:inline"> &amp; Specialty Centres</span></span>
              </button>
              <button
                type="button"
                onClick={() => setFormType('lender')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  formType === 'lender' ? 'bg-[#0867E8] text-white shadow-xs' : 'text-slate-600 hover:text-[#0B2450]'
                }`}
              >
                <Landmark size={14} className="shrink-0" />
                <span>For NBFCs &amp; Lenders</span>
              </button>
            </div>

            {/* Modern Partner CTA card */}
            <div className="text-center space-y-3">
              <span className="text-[11px] font-black text-[#0867E8] uppercase tracking-widest bg-blue-50 border border-blue-200 px-3 py-1 rounded-full inline-block">
                {formType === 'clinic' ? 'DIRECT CLINIC DISBURSEMENT LIVE' : 'NBFC & LENDER PARTNERSHIP'}
              </span>
              <h2 className="text-xl sm:text-3xl font-black text-[#0B2450] tracking-tight leading-snug">
                {formType === 'clinic' ? 'Activate Point-of-Care Patient Financing For Your Clinic' : 'Partner with Clinaza as a Capital Provider'}
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-600 max-w-lg mx-auto leading-relaxed">
                {formType === 'clinic'
                  ? 'Zero clinic discount, zero credit risk, and loan amount disbursed directly to your clinic current account on sanction.'
                  : 'Access high-ticket healthcare treatment financing demand through our pre-qualified clinic network.'}
              </p>
            </div>

            {formType === 'clinic' ? (
              <div className="space-y-4 pt-1">
                {/* Feature Chips - 2x2 grid on mobile & desktop */}
                <div className="grid grid-cols-2 gap-2 sm:gap-2.5 text-[11px] sm:text-xs">
                  <div className="flex items-center gap-2 p-2.5 sm:p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                    <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-[10px] sm:text-[11px] shrink-0">✓</span>
                    <span className="font-semibold text-slate-800 leading-tight">Direct Bank Payout</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 sm:p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                    <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-[10px] sm:text-[11px] shrink-0">✓</span>
                    <span className="font-semibold text-slate-800 leading-tight">Paperless Approval</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 sm:p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                    <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-[10px] sm:text-[11px] shrink-0">✓</span>
                    <span className="font-semibold text-slate-800 leading-tight">Zero Credit Liability</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 sm:p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                    <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-[10px] sm:text-[11px] shrink-0">✓</span>
                    <span className="font-semibold text-slate-800 leading-tight">60-Sec Onboarding</span>
                  </div>
                </div>

                <div className="space-y-2.5 pt-1">
                  <Link
                    to="/clinic-onboarding?utm_source=homepage&utm_medium=website&utm_campaign=partner_form_cta"
                    className="w-full py-3.5 sm:py-4 px-3 sm:px-6 bg-[#0867E8] hover:bg-[#0756C7] text-white font-black text-xs sm:text-sm uppercase tracking-wide rounded-xl transition-all shadow-xl shadow-[#0867E8]/25 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 text-center"
                  >
                    <span>Complete Clinic Onboarding (60s)</span>
                    <ArrowRight size={16} className="shrink-0" />
                  </Link>

                  {/* Quick Specialty Deep-Links in a single line */}
                  <div className="flex items-center justify-center gap-1 sm:gap-2 pt-0.5 whitespace-nowrap text-[10px] sm:text-[11px] flex-wrap">
                    <span className="text-slate-400 font-bold uppercase tracking-wider shrink-0">Fast-track:</span>
                    <Link
                      to="/clinic-onboarding?category=dental"
                      className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-700 transition-colors shadow-2xs shrink-0"
                    >
                      🦷 Dental
                    </Link>
                    <Link
                      to="/clinic-onboarding?category=lasik"
                      className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-white hover:bg-slate-50 border border-blue-200 rounded-lg font-bold text-[#0867E8] transition-colors shadow-2xs shrink-0"
                    >
                      👁️ LASIK &amp; Eye
                    </Link>
                    <Link
                      to="/clinic-onboarding?category=ivf"
                      className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-700 transition-colors shadow-2xs shrink-0"
                    >
                      👶 IVF
                    </Link>
                    <Link
                      to="/clinic-onboarding?category=aesthetics"
                      className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-700 transition-colors shadow-2xs shrink-0"
                    >
                      ✨ Derma<span className="hidden sm:inline"> &amp; Hair</span>
                    </Link>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4 text-xs text-slate-500 pt-2 border-t border-slate-200/60">
                  <span className="flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-slate-600">
                    <ShieldCheck size={14} className="text-emerald-600 shrink-0" /> 55+ Regulated Banking & NBFC Rails
                  </span>
                  <span className="hidden sm:inline text-slate-300">&bull;</span>
                  <a
                    href="https://wa.me/917292984244?text=Hi%20Pratyush,%20interested%20in%20Clinaza%20onboarding"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 text-emerald-800 text-[11px] sm:text-xs font-bold transition-colors active:scale-95"
                  >
                    <MessageSquare size={13} className="text-emerald-700" />
                    <span>Question on WhatsApp →</span>
                  </a>
                </div>
              </div>
            ) : (
              /* Lender Form */
              submitted ? (
                <div className="bg-white border border-[#0f7a75]/40 p-8 rounded-2xl text-center space-y-3 shadow-sm">
                  <CheckCircle2 size={40} className="text-[#0f7a75] mx-auto" aria-hidden="true" />
                  <h3 className="text-lg font-black text-[#0B2450]">Inquiry Received!</h3>
                  <p className="text-xs text-slate-600">Our capital markets team will reach out within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="lender-person" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Contact Person / Designation *
                      </label>
                      <input
                        id="lender-person"
                        type="text"
                        required
                        placeholder="e.g. Head of Co-Lending / LSP Partnerships"
                        value={formData.doctorName}
                        onChange={e => setFormData({ ...formData, doctorName: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-[#0B2450] placeholder-slate-400 focus:outline-none focus:border-[#0867E8]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="lender-name" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Bank / NBFC Name *
                      </label>
                      <input
                        id="lender-name"
                        type="text"
                        required
                        placeholder="e.g. Chinmay Finlease / Capital NBFC"
                        value={formData.clinicName}
                        onChange={e => setFormData({ ...formData, clinicName: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-[#0B2450] placeholder-slate-400 focus:outline-none focus:border-[#0867E8]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="lender-phone" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Phone / WhatsApp *</label>
                      <input
                        id="lender-phone"
                        type="tel"
                        required
                        placeholder="e.g. 7292984244"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-[#0B2450] placeholder-slate-400 focus:outline-none focus:border-[#0867E8]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="lender-city" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Headquarters City *</label>
                      <input
                        id="lender-city"
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
                    <label htmlFor="partnership-focus" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Partnership Focus</label>
                    <select
                      id="partnership-focus"
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-[#0B2450] focus:outline-none focus:border-[#0867E8]"
                    >
                      <option value="FLDG-Backed LSP Partnership">FLDG-Backed LSP Partnership</option>
                      <option value="Co-Lending API Integration">Co-Lending API Integration</option>
                      <option value="Direct Loan Origination">Direct Loan Origination</option>
                      <option value="Pilot Launch Discussion">Pilot Launch Discussion</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-[#0867E8] hover:bg-[#0756C7] disabled:opacity-60 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-[#0867E8]/25 flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                  >
                    {isSubmitting ? 'Submitting…' : 'Become a Lending Partner'}
                    <Send size={14} aria-hidden="true" />
                  </button>

                  <p className="text-center text-xs text-slate-500 font-mono pt-1">
                    Email:{' '}
                    <a href="mailto:contact@clinaza.in" className="text-[#0867E8] font-bold underline">contact@clinaza.in</a>
                  </p>
                </form>
              )
            )}
            </div>
          </FadeIn>
        </section>

        {/* ── 9. LENDER CTA FOOTER STRIP ("FOR LENDERS") ── */}
        <section aria-label="For Lenders" className="py-8 sm:py-12 px-5 sm:px-6 bg-gradient-to-r from-[#0B2450] to-[#0867E8] text-white">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 text-center sm:text-left">
            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-[#12A8A0]">
                <Landmark size={18} aria-hidden="true" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#12A8A0]">FOR LENDERS & NBFCS</span>
              </div>
              <h2 className="text-base sm:text-xl font-black">Are you a Bank, NBFC or Healthcare Lender?</h2>
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

      {/* ── Mobile & Tablet Sticky Bottom Conversion Bar (< lg) ── */}
      <div 
        className={`lg:hidden fixed bottom-3 inset-x-3 sm:inset-x-6 z-40 transition-all duration-300 transform ${
          showMobileFloating ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-16 opacity-0 pointer-events-none'
        } max-w-lg mx-auto p-2 bg-[#0B2450]/95 backdrop-blur-xl border border-white/15 rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.4)] flex items-center justify-between gap-2`}
        style={{ marginBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="hidden min-[390px]:flex items-center gap-1.5 text-white/90 pl-1.5 shrink-0">
          <ShieldCheck size={14} className="text-[#0867E8]" />
          <div className="leading-tight">
            <span className="text-[9px] font-extrabold text-slate-300 block uppercase tracking-wider">Plural &bull; Pine Labs</span>
            <span className="text-[10px] font-bold text-emerald-400">T+1 Direct Payout</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-1 justify-end">
          <button
            type="button"
            onClick={() => {
              trackEvent('click_mobile_floating_eligibility');
              setShowEligibilityModal(true);
            }}
            className="flex-1 min-h-[44px] py-2 px-2.5 bg-white/10 hover:bg-white/15 text-white text-[11px] font-bold rounded-xl transition-all flex items-center justify-center gap-1 active:scale-[0.98] border border-white/10 cursor-pointer"
          >
            <ShieldCheck size={13} className="text-[#0867E8]" />
            <span>Check Eligibility</span>
          </button>

          <Link
            to="/clinic-onboarding"
            onClick={() => trackEvent('click_mobile_floating_onboard')}
            className="flex-1 min-h-[44px] py-2 px-3 bg-[#0867E8] hover:bg-[#0756C7] text-white text-[11px] font-extrabold uppercase tracking-wide rounded-xl transition-all shadow-md flex items-center justify-center gap-1 active:scale-[0.98] cursor-pointer"
          >
            <span>Onboard &bull; ₹999</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200 py-10 px-5 sm:px-8 bg-white text-center sm:text-left pb-24 sm:pb-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Main Footer Directory Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 text-left">
            {/* Col 1: Brand & Operating Entity Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img src="/assets/clinaza-logo.jpg" alt="CLINAZA" className="h-8 w-auto rounded-lg border border-slate-200" />
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-[#0B2450] block">CLINAZA</span>
                  <span className="text-[8px] font-bold text-[#0f7a75] block uppercase">TREATMENT FINANCING &amp; CLINIC CRM</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Operated by <strong>MELLOWPRINTS</strong>. India's point-of-care healthcare EMI platform and free cloud practice management software for dental clinics.
              </p>
              <div className="space-y-1.5 text-xs text-slate-600 font-medium pt-1">
                <a href="tel:+917292984244" className="hover:text-[#0867E8] transition-colors font-bold flex items-center gap-2">
                  📞 +91 7292984244
                </a>
                <a href="https://wa.me/917292984244" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 transition-colors font-bold flex items-center gap-2">
                  💬 WhatsApp Desk
                </a>
                <a href="mailto:contact@clinaza.in" className="hover:text-[#0867E8] transition-colors block">
                  ✉️ contact@clinaza.in
                </a>
              </div>

              {/* Regulatory & Payment Infrastructure Partner Badge */}
              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200/80 px-2.5 py-1 rounded-lg w-fit text-[10px] font-bold text-blue-800">
                  <ShieldCheck size={13} className="text-blue-600" />
                  <span>RBI Compliant LSP Architecture</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg w-fit">
                  <span className="text-[9px] font-black uppercase text-slate-500">Gateway Partner:</span>
                  <img src="/assets/plural_by_pinelabs_transparent.png" alt="Plural by Pine Labs" className="h-3.5 w-auto object-contain" />
                </div>
                <p className="text-[10px] text-slate-400">
                  GSTIN: 10DXRPR3052Q1ZV<br />
                  Udyam: UDYAM-BR-26-0005161
                </p>
              </div>
            </div>

            {/* Col 2: Legal & Regulatory Policies (Razorpay Mandatory) */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#0B2450]">Legal &amp; Compliance</h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li>
                  <Link to="/clinic-agreement" className="hover:text-[#0867E8] font-bold text-[#0867E8] transition-colors">
                    Clinic Sub-Merchant Agreement
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-[#0867E8] font-semibold text-slate-700 transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-[#0867E8] font-semibold text-slate-700 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/refund-policy" className="hover:text-[#0867E8] font-semibold text-slate-700 transition-colors">
                    Cancellation &amp; Refund Policy
                  </Link>
                </li>
                <li>
                  <Link to="/shipping-policy" className="hover:text-[#0867E8] font-semibold text-slate-700 transition-colors">
                    Shipping &amp; Delivery Policy
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-[#0867E8] font-semibold text-slate-700 transition-colors">
                    Contact Us &amp; Support
                  </Link>
                </li>
                <li>
                  <Link to="/clinic-onboarding" className="text-[#0867E8] font-bold inline-flex items-center gap-1 mt-1 hover:underline">
                    Partner Clinic Onboarding (₹999) &rarr;
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Popular Patient Guides & Blogs */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#0B2450]">Patient EMI Guides</h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li>
                  <Link to="/blog/dental-treatment-on-emi-india-guide" className="hover:text-[#0867E8] font-semibold text-slate-700 transition-colors">
                    Dental Treatment on EMI Guide
                  </Link>
                </li>
                <li>
                  <Link to="/blog/dental-loans-in-india-medical-financing" className="hover:text-[#0867E8] font-semibold text-slate-700 transition-colors">
                    Dental Loans &amp; Medical Financing
                  </Link>
                </li>
                <li>
                  <Link to="/blog/dental-implants-cost-on-emi-india" className="hover:text-[#0867E8] transition-colors">
                    Dental Implants Cost on EMI
                  </Link>
                </li>
                <li>
                  <Link to="/blog/full-mouth-dental-implants-cost-on-emi-india" className="hover:text-[#0867E8] transition-colors">
                    Full Mouth Implants Cost on EMI
                  </Link>
                </li>
                <li>
                  <Link to="/blog/hair-transplant-cost-on-emi-india-guide" className="hover:text-[#0867E8] transition-colors">
                    Hair Transplant EMI Guide
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-[#0867E8] font-bold inline-flex items-center gap-1 mt-1 hover:underline">
                    View All Guides &rarr;
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Free Tools & Clinic Software */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#0B2450]">Clinic Software &amp; Tools</h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li>
                  <Link to="/tools" className="hover:text-[#0867E8] transition-colors">
                    Free Dental Prescription Maker
                  </Link>
                </li>
                <li>
                  <Link to="/tools" className="hover:text-[#0867E8] transition-colors">
                    Dental Clinic Setup Calculator
                  </Link>
                </li>
                <li>
                  <Link to="/tools" className="hover:text-[#0867E8] transition-colors">
                    Treatment EMI Calculator
                  </Link>
                </li>
                <li>
                  <Link to="/reactivation/login" className="hover:text-[#0867E8] transition-colors font-bold text-[#0B2450] inline-flex items-center gap-1.5">
                    <span>Free Cloud Dental CRM Login</span>
                    <Lock size={12} className="text-emerald-700" />
                  </Link>
                </li>
                <li>
                  <Link to="/reactivation/login" className="hover:text-[#0867E8] transition-colors">
                    WhatsApp Patient Recall Portal
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 5: Partner Cities Directory */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#0B2450]">Clinaza Network Cities</h4>
              <div className="flex flex-wrap gap-1 text-[10px] max-h-48 overflow-y-auto pr-1">
                {CITIES.map(city => (
                  <Link 
                    key={city.slug} 
                    to={`/cities/${city.slug}`}
                    className="px-2 py-0.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded text-slate-600 hover:text-[#0867E8] transition-colors font-medium whitespace-nowrap"
                  >
                    {city.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Copyright, Legal Entity & Compliance Strip */}
          <div className="pt-6 pb-6 sm:pb-2 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-sans">
            <div className="text-center md:text-left space-y-1">
              <p className="font-semibold text-slate-700">
                © 2026 CLINAZA. All Rights Reserved. Operated by MELLOWPRINTS (Sole Proprietorship).
              </p>
              <p className="text-[11px] text-slate-400">
                Principal Office: Sharma Sadan, Road No-1, Mahesh Nagar, S.K. Puri, Patna, Bihar &ndash; 800024 | GSTIN: 10DXRPR3052Q1ZV | Helpline: <a href="tel:+917292984244" className="font-semibold text-slate-600 hover:text-[#0867E8] transition-colors">+91 7292984244</a>
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs font-medium text-slate-600">
              <Link to="/clinic-agreement" className="hover:text-[#0867E8] font-semibold text-[#0867E8] transition-colors whitespace-nowrap">Clinic Agreement</Link>
              <span className="text-slate-300">&bull;</span>
              <Link to="/terms" className="hover:text-[#0867E8] transition-colors whitespace-nowrap">Terms of Service</Link>
              <span className="text-slate-300">&bull;</span>
              <Link to="/privacy" className="hover:text-[#0867E8] transition-colors whitespace-nowrap">Privacy Policy</Link>
              <span className="text-slate-300">&bull;</span>
              <Link to="/refund-policy" className="hover:text-[#0867E8] transition-colors whitespace-nowrap">Refund Policy</Link>
              <span className="text-slate-300">&bull;</span>
              <Link to="/shipping-policy" className="hover:text-[#0867E8] transition-colors whitespace-nowrap">Shipping &amp; Delivery</Link>
              <span className="text-slate-300">&bull;</span>
              <Link to="/contact" className="hover:text-[#0867E8] transition-colors whitespace-nowrap">Contact Us</Link>
              <span className="text-slate-300">&bull;</span>
              <a 
                href="https://instagram.com/clinaza.in" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-700 text-[11px] font-bold border border-pink-200/80 transition-colors whitespace-nowrap"
              >
                <svg className="w-3.5 h-3.5 text-pink-600 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>Instagram</span>
              </a>
              <span className="text-slate-300">&bull;</span>
              <a 
                href="https://www.linkedin.com/company/clinaza-healthcare-technologies/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#0A66C2] text-[11px] font-bold border border-blue-200/80 transition-colors whitespace-nowrap"
              >
                <svg className="w-3.5 h-3.5 text-[#0A66C2] shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.26a1.64 1.64 0 0 0-1.64 1.64c0 .91.73 1.64 1.64 1.64s1.64-.73 1.64-1.64c0-.91-.73-1.64-1.64-1.64z"/>
                </svg>
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
