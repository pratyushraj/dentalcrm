import React, { useState, useEffect } from 'react';
import { useInView, useCountUp } from '../hooks/useScrollAnimation';
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
  Clock
} from 'lucide-react';
import { emailNotificationService } from '../services/emailNotificationService';
import { easycredService } from '../services/easycredService';
import { toast } from 'sonner';
import { SEOHead } from '@/components/seo/SEOHead';
import { BankSvgLogo } from '@/components/BankSvgLogos';
import { CITIES } from '@/data/cities';
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
        : (result.fallbackLink || `https://clinaza.in/partner?ref=cardless_emi&mobile=${cleanMobile}&name=${encodeURIComponent(patientData.name)}`);

      const masked = (result.success && result.data?.maskedMobile)
        ? result.data.maskedMobile
        : `••••••${cleanMobile.slice(-4)}`;

      setCustomerLink(redirectUrl);
      setMaskedMobile(masked);
      setIsFinancingSuccess(true);
    } catch (err) {
      console.error('Error initiating financing:', err);
      const fallbackUrl = `https://clinaza.in/partner?ref=cardless_emi&mobile=${cleanMobile}&name=${encodeURIComponent(patientData.name)}`;
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

  const comprehensiveFaqs = [
    {
      q: 'What is Clinaza?',
      a: 'Clinaza is an embedded healthcare patient financing platform that connects clinics with RBI-regulated Banks and NBFCs, allowing patients to pay for high-ticket treatments in flexible monthly EMIs.'
    },
    {
      q: 'How does Clinaza patient financing work?',
      a: 'Clinaza connects clinic patients directly with regulated lending partners to offer flexible monthly EMI options for treatments ranging from ₹30,000 to ₹5,00,000 with 2-minute paperless digital KYC.'
    },
    {
      q: 'Which treatments are eligible for EMI?',
      a: 'High-value planned procedures ranging from ₹30,000 to ₹5,00,000 including Dental Implants, Clear Aligners, Braces, Crowns, Orthopaedic surgeries, IVF/Fertility, and LASIK/Ophthalmology.'
    },
    {
      q: 'Can patients get treatment on EMI without a credit card (Cardless EMI)?',
      a: 'Yes. Clinaza powers Cardless EMIs exclusively in partnership with PayU and Flexmoney (InstaCred) cardless lenders (including Fibe, Axio, LazyPay, CASHe, KreditBee, TVS Credit, and Home Credit). Patients without a credit card only need a valid PAN and Aadhaar OTP to split treatments into monthly EMIs. Additionally, Credit Card EMI across 21+ banks, Debit Card EMI, and Down Payment + EMI options are fully supported.'
    },
    {
      q: 'Are IVF and fertility treatments eligible for monthly EMI financing?',
      a: 'Yes. Clinaza covers high-ticket IVF cycles, ICSI, IUI, and reproductive healthcare packages from ₹50,000 to ₹5,00,000 with upfront clinic disbursement and flexible 3 to 24 month repayment tenures.'
    },
    {
      q: 'Does the clinic bear any credit risk?',
      a: 'Zero credit risk on the clinic. The loan is funded, serviced, and collected directly by PayU & Flexmoney regulated lending partners via automated monthly e-NACH auto-debit.'
    },
    {
      q: 'Does the clinic pay any upfront fee?',
      a: 'No upfront fees for clinics. Partner clinics receive physical branding kits, QR standees, and onboarding support free of charge.'
    },
    {
      q: 'What documents does the patient need?',
      a: 'Basic digital KYC: PAN card, Aadhaar card (eKYC), proof of income (salary slip, bank statement, or ITR), and bank account details for e-NACH auto-debit setup.'
    },
    {
      q: 'What determines the interest rate & terms?',
      a: 'Interest rates (starting from ~11.5% to 15% p.a.) and tenures (3–24 months) are set directly by the lending partner based on credit assessment.'
    },
    {
      q: 'Is loan approval guaranteed?',
      a: 'No. Clinaza facilitates the application process. Final loan approval, interest rate, and sanctioned amount are determined independently by the financing partner based on patient credit eligibility.'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-[#0B2450] font-sora antialiased overflow-x-hidden selection:bg-[#0867E8] selection:text-white">
      <SEOHead
        title="Clinaza — Healthcare EMIs & Free Dental CRM India"
        description="Offer instant point-of-care patient EMI financing (₹30K–₹5L) with PayU & Flexmoney cardless EMI lenders. Plus, 100% Free Dental Clinic CRM software."
        keywords={[
          'clinaza', 'clinaza patient financing', 'clinaza healthpay', 'clinaza healthcare emi',
          'medical equipment loan for dentist', 'loan for dental clinic', 'loan for dentist', 'dental equipment loan emi',
          'dental clinic setup cost calculator', 'डेंटल क्लिनिक के लिए लोन',
          'patient financing india', 'healthcare emi india', 'dental emi', 'dental loan india',
          'point of care patient financing', 'dental implants emi', 'clear aligners emi cost',
          'free dental crm', 'free dental crm software india', 'best free dental clinic management software',
          'dental prescription software free', 'whatsapp patient recall dental',
          'lasik on emi', 'ivf treatment emi', 'hair transplant financing india'
        ]}
        image="https://clinaza.in/og-clinaza.png"
        canonicalUrl="https://clinaza.in/"
        jsonLd={[
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
            "url": "https://clinaza.in/",
            "author": {
              "@type": "Organization",
              "name": "Clinaza Technologies",
              "url": "https://clinaza.in"
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "FinancialService",
            "name": "Clinaza",
            "description": "Embedded patient financing infrastructure enabling healthcare clinics & hospitals to offer point-of-care EMI loans.",
            "url": "https://clinaza.in/",
            "logo": "https://clinaza.in/assets/clinaza-logo.jpg",
            "image": "https://clinaza.in/og-clinaza.png",
            "areaServed": "IN",
            "serviceType": "Healthcare Patient Financing Infrastructure"
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
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
                  "text": "Zero credit risk on the clinic. The loan is funded, serviced, and collected directly by PayU & Flexmoney regulated lending partners via automated monthly e-NACH auto-debit."
                }
              },
              {
                "@type": "Question",
                "name": "Does the clinic pay any upfront fee?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No upfront fees for clinics. Partner clinics receive physical branding kits, QR standees, and onboarding support free of charge."
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
                  "text": "Yes. Clinaza powers Cardless EMIs exclusively in partnership with PayU and Flexmoney (InstaCred) cardless lenders (including Fibe, Axio, LazyPay, CASHe, KreditBee, TVS Credit, and Home Credit). Patients without a credit card only need a valid PAN and Aadhaar OTP to split treatments into monthly EMIs. Additionally, Credit Card EMI across 21+ banks, Debit Card EMI, and Down Payment + EMI options are fully supported."
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
              { "@type": "ListItem", "position": 1, "name": "YOUR DENTIST Patna", "url": "https://clinaza.in/cities/patna" },
              { "@type": "ListItem", "position": 2, "name": "PRODENT Patna", "url": "https://clinaza.in/cities/patna" },
              { "@type": "ListItem", "position": 3, "name": "GuMzy Dental Gurgaon", "url": "https://clinaza.in/cities/gurgaon" },
              { "@type": "ListItem", "position": 4, "name": "Facio Dental Patna", "url": "https://clinaza.in/cities/patna" },
              { "@type": "ListItem", "position": 5, "name": "Smile Dental Clinic Patna", "url": "https://clinaza.in/cities/patna" },
              { "@type": "ListItem", "position": 6, "name": "Smile Point Dental Care Patna", "url": "https://clinaza.in/cities/patna" },
              { "@type": "ListItem", "position": 7, "name": "YouthONN Multispeciality Dental Patna", "url": "https://clinaza.in/cities/patna" },
              { "@type": "ListItem", "position": 8, "name": "Mundeshwari Dental Hub & Implant Patna", "url": "https://clinaza.in/cities/patna" },
              { "@type": "ListItem", "position": 9, "name": "Pratima Dental Hospital Patna", "url": "https://clinaza.in/cities/patna" },
              { "@type": "ListItem", "position": 10, "name": "Dantsri Dental Hospital Jhanjharpur", "url": "https://www.instagram.com/dantsri_dental/" }
            ]
          }
        ]}
      />

      {/* ── Header ── */}
      <header className="border-b border-slate-100 backdrop-blur-xl sticky top-0 z-50 bg-white/95 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 sm:h-20 flex justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              <img src="/assets/clinaza-logo.jpg" alt="CLINAZA" className="h-9 sm:h-10 w-auto rounded-xl border border-slate-200 shadow-sm group-hover:scale-105 transition-transform" />
              <div className="hidden sm:block">
                <span className="text-xs font-black tracking-widest text-[#0B2450] block">CLINAZA</span>
                <span className="text-[9px] font-bold tracking-wider text-[#0f7a75] block uppercase">EMI FOR BETTER HEALTH</span>
              </div>
            </Link>

            {/* Header Co-brand Trust Pill */}
            <div className="hidden xl:flex items-center gap-2.5 px-3 py-1.5 bg-slate-50/90 border border-slate-200/90 rounded-xl shadow-2xs">
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Affordability Partners:</span>
              <img src="/assets/payu_logo.svg" alt="PayU" style={{ height: '13px', width: 'auto' }} className="object-contain shrink-0" />
              <span className="text-slate-300">|</span>
              <img src="/assets/flexmoney_logo.png" alt="Flexmoney" style={{ height: '18px', width: 'auto' }} className="object-contain shrink-0" />
            </div>
          </div>
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
              }}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-xs font-bold text-[#0867E8] rounded-xl transition-all whitespace-nowrap"
            >
              <ShieldCheck size={14} className="text-[#0867E8]" />
              Check EMI
            </button>
            <Link
              to="/reactivation/login"
              className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-[11px] sm:text-xs font-bold text-emerald-800 rounded-xl transition-all whitespace-nowrap"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="hidden sm:inline">Doctor </span>Login 🔐
            </Link>
            <a
              href="https://wa.me/917292984244?text=Hi%20Clinaza%20team%2C%20I%20want%20to%20know%20more%20about%20Clinaza"
              target="_blank" rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-[#F7FAFC] hover:bg-slate-100 border border-slate-200 text-xs font-bold text-[#0B2450] rounded-xl transition-all whitespace-nowrap"
            >
              <MessageSquare size={14} className="text-[#0f7a75]" />
              WhatsApp
            </a>
            <Link
              to="/clinic-onboarding"
              className="px-3 sm:px-5 py-2 sm:py-3 bg-[#0867E8] hover:bg-[#0756C7] text-white text-[11px] sm:text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md sm:shadow-lg shadow-[#0867E8]/25 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap active:scale-95"
            >
              <span className="sm:hidden">Onboarding</span>
              <span className="hidden sm:inline">Clinic Onboarding</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* ── 1. HERO (MINIMAL LUXURY) ── */}
        <section aria-label="Hero" className="relative pt-6 sm:pt-14 pb-10 sm:pb-16 px-4 sm:px-6 max-w-5xl mx-auto space-y-6 sm:space-y-8">


          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center text-left">
            <div className="md:col-span-7 space-y-3.5 sm:space-y-5">
              <div className="inline-flex items-center gap-2 sm:gap-2.5 px-3 sm:px-3.5 py-1 sm:py-1.5 bg-gradient-to-r from-blue-50/90 to-slate-100 border border-blue-200/80 rounded-full text-xs font-semibold text-slate-800 shadow-2xs flex-wrap">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Official Partnership:</span>
                <img src="/assets/payu_logo.svg" alt="PayU" style={{ height: '13px', width: 'auto' }} className="object-contain shrink-0" />
                <span className="text-slate-400 font-normal">&amp;</span>
                <img src="/assets/flexmoney_logo.png" alt="Flexmoney InstaCred" style={{ height: '17px', width: 'auto' }} className="object-contain shrink-0" />
                <span className="text-slate-300 hidden sm:inline">&bull;</span>
                <span className="text-[10px] font-bold text-slate-600 hidden sm:inline">35+ EMI Modes</span>
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-[-0.025em] leading-[1.2] text-[#0B2450]">
                Healthcare Treatments on EMI.<br />
                <span className="text-[#0867E8]">Stop patient drop-offs.</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-xl">
                Offer instant point-of-care patient financing &amp; medical loans from <strong className="text-[#0B2450] font-bold">₹30,000 to ₹5,00,000</strong> across Dental, IVF &amp; Fertility, Dermatology, Ophthalmology, and Outpatient Specialty Clinics.
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    trackEvent('click_hero_check_eligibility');
                    trackEvent('eligibility_started', { source: 'hero_cta' });
                    setShowEligibilityModal(true);
                  }}
                  className="px-5 sm:px-6 py-3 sm:py-3.5 bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(8,103,232,0.25)] hover:shadow-[0_12px_28px_rgba(8,103,232,0.35)] transform active:scale-95"
                >
                  <ShieldCheck size={16} /> Check Patient Eligibility
                </button>
                <Link
                  to="/clinic-onboarding"
                  className="px-5 py-3 sm:py-3.5 bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 hover:border-slate-300 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm"
                >
                  Clinic Onboarding →
                </Link>
              </div>

              {/* ── Official PayU & Flexmoney Partnership Institutional Card ── */}
              <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-white via-slate-50 to-blue-50/50 border border-blue-200/90 shadow-sm space-y-2">
                <div className="flex items-center justify-between gap-2 border-b border-slate-200/80 pb-2">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-300/80 px-2 py-0.5 rounded-full flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Verified Lending Partnership
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 hidden sm:inline">&bull; RBI-Regulated Rails</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-[#0867E8] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                    35+ EMI Modes Live
                  </span>
                </div>

                {/* Desktop detailed text + logo block */}
                <div className="hidden sm:flex flex-row items-center justify-between gap-3.5 pt-0.5">
                  <div className="space-y-1">
                    <p className="text-sm font-black text-[#0B2450] tracking-tight">
                      Healthcare Affordability In Partnership with PayU &amp; Flexmoney
                    </p>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Clinaza has partnered with <strong>PayU</strong> and <strong>Flexmoney (InstaCred)</strong> to provide point-of-care patient financing directly at dental and outpatient clinic counters. Patients get paperless Cardless EMIs, pre-approved Debit Card EMIs, and 21+ major banks' Credit Card EMIs in 2 minutes.
                    </p>
                  </div>
                  <div className="flex items-center gap-3.5 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-2xs shrink-0">
                    <img src="/assets/payu_logo.svg" alt="PayU Official Affordability Partner" style={{ height: '15px', width: 'auto' }} className="object-contain shrink-0" />
                    <span className="h-5 w-px bg-slate-200" />
                    <img src="/assets/flexmoney_logo.png" alt="Flexmoney Official InstaCred Partner" style={{ height: '20px', width: 'auto' }} className="object-contain shrink-0" />
                  </div>
                </div>

                {/* Mobile streamlined row */}
                <div className="sm:hidden flex items-center justify-between gap-2 pt-1">
                  <p className="text-[11px] text-slate-600 font-medium">
                    Cardless &amp; Card EMIs powered by
                  </p>
                  <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs shrink-0">
                    <img src="/assets/payu_logo.svg" alt="PayU" style={{ height: '12px', width: 'auto' }} className="object-contain shrink-0" />
                    <span className="text-slate-300">|</span>
                    <img src="/assets/flexmoney_logo.png" alt="Flexmoney" style={{ height: '15px', width: 'auto' }} className="object-contain shrink-0" />
                  </div>
                </div>
              </div>
            </div>

            {/* Authentic Clinic Photo with subtle glass badge */}
            <div className="md:col-span-5 relative mt-2 md:mt-0">
              <div className="relative rounded-2xl sm:rounded-3xl p-1 bg-gradient-to-b from-slate-200 to-slate-100 shadow-[0_20px_40px_rgba(0,0,0,0.06)]">
                <picture>
                  <source srcSet="/assets/clinic-hero-real.webp" type="image/webp" />
                  <img
                    src="/assets/clinic-hero-real.png"
                    alt="Modern authentic dental clinic treatment room in India"
                    fetchPriority="high"
                    loading="eager"
                    decoding="async"
                    width={800}
                    height={600}
                    className="w-full h-auto rounded-[14px] sm:rounded-[22px] object-cover aspect-[4/3]"
                  />
                </picture>
              </div>
              <div className="absolute -bottom-2 -left-2 sm:-bottom-3 sm:-left-3 bg-white/95 backdrop-blur-xl border border-slate-200/80 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] flex items-center gap-2 sm:gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] sm:text-[11px] font-bold text-[#0B2450] tracking-tight">Point-of-Care EMI Ready</span>
              </div>
            </div>
          </div>

          {/* ── 1. POPULAR BANKS & NBFC LENDING ECOSYSTEM SLIDESHOW ── */}
          <div className="pt-6 border-t border-slate-200/60 max-w-5xl mx-auto space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1 text-center sm:text-left">
              <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-start">
                <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase flex items-center gap-1.5">
                  <Landmark size={14} className="text-[#0867E8]" /> AFFORDABILITY &amp; LENDING PARTNERS
                </span>
                <span className="text-slate-300 hidden sm:inline">&bull;</span>
                <div className="flex items-center gap-2.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Powered by</span>
                  <img src="/assets/payu_logo.svg" alt="PayU" style={{ height: '13px', width: 'auto' }} className="object-contain shrink-0" />
                  <span className="text-slate-300">|</span>
                  <img src="/assets/flexmoney_logo.png" alt="Flexmoney" style={{ height: '18px', width: 'auto' }} className="object-contain shrink-0" />
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2.5 py-0.5 rounded-full shrink-0">
                ✓ 35+ EMI Options &bull; Credit, Debit &amp; Cardless
              </span>
            </div>

            {/* Continuous Seamless Slideshow Marquee */}
            <div className="relative overflow-hidden py-3.5 px-2 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-sm group">
              {/* Fade Edges */}
              <div className="absolute left-0 inset-y-0 w-16 sm:w-24 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 inset-y-0 w-16 sm:w-24 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

              <div className="flex w-max gap-4 animate-marquee group-hover:[animation-play-state:paused]">
                {[
                  { id: 'payu', name: 'PayU', sub: 'Affordability Gateway', badge: 'Gateway' },
                  { id: 'flexmoney', name: 'Flexmoney', sub: 'InstaCred Network', badge: 'Cardless' },
                  { id: 'fibe', name: 'FIBE', sub: 'Instant Cardless Credit', badge: 'Cardless' },
                  { id: 'axio', name: 'Axio', sub: 'Zest Digital Credit', badge: 'Cardless' },
                  { id: 'lazypay', name: 'LazyPay', sub: 'PayU 1-Click Credit', badge: 'Cardless' },
                  { id: 'cashe', name: 'CASHe', sub: 'Cardless Healthcare Credit', badge: 'Cardless' },
                  { id: 'kreditbee', name: 'KreditBee', sub: 'Cardless Checkout EMI', badge: 'Cardless' },
                  { id: 'tvs', name: 'TVS Credit', sub: 'Point-of-Sale Finance', badge: 'Cardless' },
                  { id: 'homecredit', name: 'Home Credit', sub: 'Instant Retail EMI', badge: 'Cardless' },
                  { id: 'idfc', name: 'IDFC FIRST Bank', sub: 'Cardless Digital EMI', badge: 'Bank' },
                  { id: 'icici', name: 'ICICI Bank', sub: 'Cardless & Debit EMI', badge: 'Bank' },
                  { id: 'hdfc', name: 'HDFC Bank', sub: 'Credit & Debit Card EMI', badge: 'Bank' },
                  { id: 'kotak', name: 'Kotak Bank', sub: 'Smart EMI & Debit Card', badge: 'Bank' },
                  { id: 'axis', name: 'Axis Bank', sub: 'Credit & Debit Card EMI', badge: 'Bank' },
                  { id: 'federal', name: 'Federal Bank', sub: 'Pre-Approved Debit EMI', badge: 'Bank' }
                ].concat([
                  { id: 'payu', name: 'PayU', sub: 'Affordability Gateway', badge: 'Gateway' },
                  { id: 'flexmoney', name: 'Flexmoney', sub: 'InstaCred Network', badge: 'Cardless' },
                  { id: 'fibe', name: 'FIBE', sub: 'Instant Cardless Credit', badge: 'Cardless' },
                  { id: 'axio', name: 'Axio', sub: 'Zest Digital Credit', badge: 'Cardless' },
                  { id: 'lazypay', name: 'LazyPay', sub: 'PayU 1-Click Credit', badge: 'Cardless' },
                  { id: 'cashe', name: 'CASHe', sub: 'Cardless Healthcare Credit', badge: 'Cardless' },
                  { id: 'kreditbee', name: 'KreditBee', sub: 'Cardless Checkout EMI', badge: 'Cardless' },
                  { id: 'tvs', name: 'TVS Credit', sub: 'Point-of-Sale Finance', badge: 'Cardless' },
                  { id: 'homecredit', name: 'Home Credit', sub: 'Instant Retail EMI', badge: 'Cardless' },
                  { id: 'idfc', name: 'IDFC FIRST Bank', sub: 'Cardless Digital EMI', badge: 'Bank' },
                  { id: 'icici', name: 'ICICI Bank', sub: 'Cardless & Debit EMI', badge: 'Bank' },
                  { id: 'hdfc', name: 'HDFC Bank', sub: 'Credit & Debit Card EMI', badge: 'Bank' },
                  { id: 'kotak', name: 'Kotak Bank', sub: 'Smart EMI & Debit Card', badge: 'Bank' },
                  { id: 'axis', name: 'Axis Bank', sub: 'Credit & Debit Card EMI', badge: 'Bank' },
                  { id: 'federal', name: 'Federal Bank', sub: 'Pre-Approved Debit EMI', badge: 'Bank' }
                ]).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-slate-50/90 border border-slate-200/90 shrink-0 transition-all hover:bg-white hover:border-slate-300 hover:shadow-xs"
                  >
                    {/* Logo container */}
                    <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center shrink-0 shadow-2xs bg-white border border-slate-100 p-0.5">
                      <BankSvgLogo id={item.id} size={28} />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-xs font-bold text-[#0B2450] whitespace-nowrap">{item.name}</span>
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide ${
                          item.badge === 'Bank'
                            ? 'bg-blue-50 text-blue-600'
                            : item.badge === 'Gateway'
                            ? 'bg-purple-50 text-purple-700'
                            : item.badge === 'Cardless'
                            ? 'bg-emerald-50 text-emerald-700'
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
              <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">Free Cloud-Based Clinic Management Software</span>
              <h2 className="text-2xl sm:text-4xl font-bold text-white leading-tight">
                Your entire practice,<br />managed from your phone.
              </h2>
              <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
                Automated WhatsApp recall, specialty clinical EMR, digital prescriptions, and revenue analytics — 100% free forever for outpatient clinics.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Key Features */}
              <div className="lg:col-span-6 space-y-4 text-left order-2 lg:order-1">
                {[
                  {
                    icon: '💬',
                    title: 'Automated WhatsApp Patient Recall',
                    desc: 'Automatically re-engage dormant patients who haven’t visited in 3–6 months with personalized WhatsApp recall messages.'
                  },
                  {
                    icon: '📋',
                    title: 'Specialty EMR & Clinical Charting',
                    desc: 'Tooth charting for dental, procedural logs for aesthetics, IVF, & daycare with immediate treatment cost estimation.'
                  },
                  {
                    icon: '📱',
                    title: 'Instant Digital Prescriptions (Rx)',
                    desc: 'Generate branded, professional Rx with pre-filled drug dosages and share directly to patient WhatsApp in 2 clicks.'
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
                    href="https://wa.me/917292984244?text=Hi%20Clinaza%2C%20I%20want%20a%20free%20demo%20of%20the%20clinic%20CRM%20software"
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
                          CC
                        </div>
                        <div>
                          <h4 className="text-[11px] font-extrabold text-white leading-tight">CLINAZA EMR</h4>
                          <p className="text-[8px] text-sky-400 font-semibold">Specialty &amp; Dental Practice</p>
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
                          <span className="text-[7px] px-1 bg-slate-800 rounded text-slate-300">Aligner / Skin Review</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-300 border-t border-white/5 pt-1">
                          <span className="text-blue-400 font-bold">05:15 PM</span>
                          <span className="font-semibold text-white">Amit Kumar</span>
                          <span className="text-[7px] px-1 bg-slate-800 rounded text-slate-300">Procedure Session #2</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* ── 6. EMI CALCULATOR & FRONT-DESK WORKFLOW ── */}
        <section aria-label="EMI Calculator" className="py-12 sm:py-16 px-4 sm:px-6 bg-[#F7FAFC] border-y border-slate-200/60">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-black text-[#0f7a75] uppercase tracking-widest">AFFORDABILITY SUITE &amp; RECEPTION WORKFLOW</span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#0B2450]">Calculate Patient EMI &amp; Reception Workflow</h2>
              <p className="text-xs sm:text-sm text-slate-600">35+ EMI payment modes powered in partnership with PayU &amp; Flexmoney.</p>
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

                      {/* Quick Treatment Presets */}
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {[
                          { label: '🦷 Implant', amount: 45000 },
                          { label: '😁 Aligners', amount: 75000 },
                          { label: '👶 IVF Cycle', amount: 150000 },
                          { label: '✨ Full Mouth', amount: 250000 },
                        ].map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => {
                              setEmiAmount(preset.amount);
                              trackEvent('calculator_preset_clicked', { preset: preset.label, amount: preset.amount });
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                              emiAmount === preset.amount
                                ? 'bg-[#0867E8] text-white border-[#0867E8]'
                                : 'bg-[#F7FAFC] text-slate-700 border-slate-200 hover:border-[#0867E8]'
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
                        onChange={e => {
                          setEmiAmount(Number(e.target.value));
                          trackEvent('calculator_used', { amount: Number(e.target.value), tenure: emiTenure });
                        }}
                        className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[#0867E8]"
                        aria-label="Treatment amount slider"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                        <span>₹30,000</span>
                        <span>₹5,00,000</span>
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
                        }}
                        className="w-full py-3 bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                      >
                        <ShieldCheck size={15} /> Check Patient Eligibility →
                      </button>
                    </div>

                  </div>
                </div>
              </div>

              {/* Right Column: 4-Step Front-Desk Approval Workflow (5 cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between h-full bg-[#0B132B] border-2 border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl text-left text-white relative overflow-hidden">
                {/* Glow accent */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-[11px] font-black text-emerald-400 uppercase tracking-wider">
                        Reception Desk Flow
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/10 border border-white/15 px-2 py-1 rounded-lg">
                      <span className="text-[8px] uppercase tracking-wider text-slate-300 font-bold">Partnered with</span>
                      <img src="/assets/payu_logo.svg" alt="PayU" style={{ height: '11px', width: 'auto' }} className="object-contain" />
                      <span className="text-[9px] text-slate-400">&amp;</span>
                      <img src="/assets/flexmoney_logo.png" alt="Flexmoney" style={{ height: '14px', width: 'auto' }} className="object-contain" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
                      How Patient Financing Works At Your Counter
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Zero paperwork for clinic staff. Instant digital approval in 4 simple steps.
                    </p>
                  </div>

                  {/* 4 Steps */}
                  <div className="space-y-3">
                    {[
                      {
                        step: '1',
                        icon: <QrCode size={16} className="text-sky-400" />,
                        title: 'Scan Clinic Counter Standee',
                        desc: 'Patient scans your custom Clinaza QR standee with their phone camera. No app download needed.',
                        badge: 'Zero hardware cost'
                      },
                      {
                        step: '2',
                        icon: <ShieldCheck size={16} className="text-emerald-400" />,
                        title: 'Cardless, Credit or Debit Card EMI',
                        desc: 'Choose from 35+ modes: Cardless EMI (2-min Aadhaar OTP via PayU & Flexmoney), 21+ Credit Card EMIs, or Debit Card EMI.',
                        badge: 'Cardless + Card'
                      },
                      {
                        step: '3',
                        icon: <Clock size={16} className="text-amber-400" />,
                        title: 'Real-Time Sanction (PayU & Flexmoney Network)',
                        desc: 'Algorithm matches patient with best lender offer. Patient selects flexible 3 to 24-month EMI plan.',
                        badge: 'High approval rate'
                      },
                      {
                        step: '4',
                        icon: <Building2 size={16} className="text-blue-400" />,
                        title: '100% Upfront Clinic Disbursal',
                        desc: 'Treatment amount is disbursed directly into your clinic account. Start treatment immediately.',
                        badge: '₹0 clinic credit risk'
                      }
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.04] border border-white/5 hover:border-blue-500/30 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-xl bg-slate-800/90 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 flex-wrap">
                            <span className="text-xs font-black text-white">
                              {item.step}. {item.title}
                            </span>
                            <span className="text-[9px] font-bold text-slate-400 bg-slate-800/60 px-1.5 py-0.5 rounded">
                              {item.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer bar */}
                <div className="relative z-10 pt-4 mt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10.5px]">
                  <span className="text-slate-400">
                    Counter setup: <strong className="text-white">Under 5 minutes</strong>
                  </span>
                  <a
                    href="https://wa.me/917292984244?text=Hi%20Clinaza%2C%20I%20want%20to%20set%20up%20patient%20EMI%20QR%20at%20my%20clinic"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 font-bold hover:underline flex items-center gap-1"
                  >
                    <span>Doctor Line: +91 7292984244</span>
                  </a>
                </div>
              </div>
            </div>

            {/* ── Supported Payment Modes from Affordability Suite ── */}
            <div className="pt-6 border-t border-slate-200/80 space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#0B2450]">
                    35+ Ways For Patients To Pay Over Time
                  </h3>
                  <p className="text-xs text-slate-500">
                    Integrated directly at the clinic counter in partnership with PayU &amp; Flexmoney.
                  </p>
                </div>
                <div className="flex items-center gap-3 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-xs">
                  <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider">Official Partners:</span>
                  <img src="/assets/payu_logo.svg" alt="PayU Affordability Partner" style={{ height: '15px', width: 'auto' }} className="object-contain shrink-0" />
                  <span className="text-slate-300">|</span>
                  <img src="/assets/flexmoney_logo.png" alt="Flexmoney InstaCred Partner" style={{ height: '21px', width: 'auto' }} className="object-contain shrink-0" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-left">
                {[
                  {
                    title: 'Cardless EMI',
                    partner: 'PayU & Flexmoney InstaCred',
                    desc: 'No credit or debit card required. 2-min paperless digital KYC via Aadhaar & PAN OTP with instant loan sanction.',
                    badge: 'Most Popular',
                    tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  },
                  {
                    title: 'Credit Card EMI',
                    partner: '21+ Major Scheduled Banks',
                    desc: 'Split high-ticket treatment fees on credit cards from HDFC, ICICI, SBI, Axis, Kotak, IndusInd, RBL & more with 3–24M tenures.',
                    badge: '21+ Banks',
                    tagColor: 'bg-blue-50 text-blue-700 border-blue-200'
                  },
                  {
                    title: 'Debit Card EMI',
                    partner: 'HDFC, ICICI, Axis, Kotak, Federal',
                    desc: 'Pre-approved EMIs directly on patient’s existing savings bank debit card with zero additional paperwork.',
                    badge: 'No New Credit Card',
                    tagColor: 'bg-purple-50 text-purple-700 border-purple-200'
                  },
                  {
                    title: 'Down Payment + EMI',
                    partner: 'Flexible Co-Payment Mode',
                    desc: 'Patient pays a small down payment (10%–30%) via UPI or Card, and converts the remaining treatment balance into low-interest EMI.',
                    badge: 'Lower Monthly Cost',
                    tagColor: 'bg-amber-50 text-amber-800 border-amber-200'
                  }
                ].map((mode, idx) => (
                  <div key={idx} className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-2 shadow-2xs hover:shadow-xs transition-shadow">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-black text-[#0B2450]">{mode.title}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${mode.tagColor}`}>
                        {mode.badge}
                      </span>
                    </div>
                    <div className="text-[10px] font-bold text-[#0867E8]">{mode.partner}</div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{mode.desc}</p>
                  </div>
                ))}
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
                Leading healthcare clinics &amp; specialized centres offering instant point-of-care patient EMI financing powered by Clinaza.
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
                        <span className="font-bold text-slate-200">PayU &amp; Flexmoney (35+ Options)</span>
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
                        <img src="/assets/payu_logo.svg" alt="PayU" style={{ height: '11px', width: 'auto' }} className="object-contain" />
                        <span className="text-[8px] text-slate-400">&amp;</span>
                        <img src="/assets/flexmoney_logo.png" alt="Flexmoney" style={{ height: '14px', width: 'auto' }} className="object-contain" />
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
                🏥 For Clinics &amp; Specialty Centres
              </button>
              <button
                type="button"
                onClick={() => setFormType('lender')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  formType === 'lender' ? 'bg-[#0867E8] text-white shadow-xs' : 'text-slate-600 hover:text-[#0B2450]'
                }`}
              >
                🏦 For NBFCs &amp; Lenders
              </button>
            </div>

            {/* Modern Partner CTA card */}
            <div className="text-center space-y-3">
              <span className="text-[11px] font-black text-[#0867E8] uppercase tracking-widest bg-blue-50 border border-blue-200 px-3 py-1 rounded-full inline-block">
                {formType === 'clinic' ? 'DIRECT CLINIC DISBURSEMENT LIVE' : 'NBFC & LENDER PARTNERSHIP'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0B2450] tracking-tight">
                {formType === 'clinic' ? 'Activate Point-of-Care Patient Financing For Your Clinic' : 'Partner with Clinaza as a Capital Provider'}
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-600 max-w-lg mx-auto">
                {formType === 'clinic'
                  ? 'Zero clinic discount, zero credit risk, and loan amount disbursed directly to your clinic current account on sanction.'
                  : 'Access high-ticket healthcare treatment financing demand through our pre-qualified clinic network.'}
              </p>
            </div>

            {formType === 'clinic' ? (
              <div className="space-y-5 pt-2">
                {/* Feature Chips */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-[11px]">✓</span>
                    <span className="font-semibold text-slate-800">Direct Clinic Bank Payout</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-[11px]">✓</span>
                    <span className="font-semibold text-slate-800">Paperless Front-Desk Approval</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-[11px]">✓</span>
                    <span className="font-semibold text-slate-800">Zero Liability on Non-Payment</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-[11px]">✓</span>
                    <span className="font-semibold text-slate-800">60-Second Instant Onboarding</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <Link
                    to="/clinic-onboarding?utm_source=homepage&utm_medium=website&utm_campaign=partner_form_cta"
                    className="w-full py-4 bg-[#0867E8] hover:bg-[#0756C7] text-white font-black text-sm uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-[#0867E8]/25 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 text-center"
                  >
                    <span>Complete Clinic Onboarding (60s)</span>
                    <ArrowRight size={16} />
                  </Link>

                  {/* Quick Specialty Deep-Links */}
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    <span className="text-[11px] text-slate-500 font-medium">Quick link:</span>
                    <Link
                      to="/clinic-onboarding?category=dental"
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 transition-colors"
                    >
                      🦷 Dental Clinic
                    </Link>
                    <Link
                      to="/clinic-onboarding?category=ivf"
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 transition-colors"
                    >
                      👶 IVF &amp; Fertility Centre
                    </Link>
                    <Link
                      to="/clinic-onboarding?category=aesthetics"
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 transition-colors"
                    >
                      ✨ Skin &amp; Hair Clinic
                    </Link>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-emerald-600" /> PayU &amp; Flexmoney Regulated Partner Network
                  </span>
                  <span>&middot;</span>
                  <a href="https://wa.me/917292984244?text=Hi%20Pratyush,%20interested%20in%20Clinaza%20onboarding" target="_blank" rel="noopener noreferrer" className="text-emerald-600 font-bold hover:underline">
                    Quick Question on WhatsApp →
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

      {/* ── Mobile Floating Quick Action Pill (Appears only after scrolling past hero) ── */}
      <div 
        className={`sm:hidden fixed bottom-4 left-4 right-4 z-40 transition-all duration-300 transform ${
          showMobileFloating ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-12 opacity-0 pointer-events-none'
        } flex items-center gap-2 p-1.5 bg-[#0B2450]/95 backdrop-blur-xl border border-white/15 rounded-full shadow-[0_12px_36px_rgba(0,0,0,0.35)]`}
        style={{ marginBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <button
          onClick={() => {
            trackEvent('click_mobile_floating_eligibility');
            setShowEligibilityModal(true);
          }}
          className="flex-1 py-3 px-4 bg-[#0867E8] text-white rounded-full text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-95"
        >
          <ShieldCheck size={15} /> Check Patient Eligibility
        </button>
      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200 py-10 px-5 sm:px-8 bg-white text-center sm:text-left pb-24 sm:pb-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Main Footer Directory Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-left">
            {/* Col 1: Brand & Contact */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img src="/assets/clinaza-logo.jpg" alt="CLINAZA" className="h-8 w-auto rounded-lg border border-slate-200" />
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-[#0B2450] block">CLINAZA</span>
                  <span className="text-[8px] font-bold text-[#0f7a75] block uppercase">TREATMENT FINANCING &amp; CLINIC CRM</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Empowering healthcare clinics with point-of-care EMI financing and 100% free cloud practice management software.
              </p>
              <div className="space-y-1.5 text-xs text-slate-600 font-medium pt-1">
                <a href="tel:+917292984244" className="hover:text-[#0867E8] transition-colors font-bold flex items-center gap-2">
                  📞 +91 7292984244
                </a>
                <a href="https://wa.me/917292984244" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 transition-colors font-bold flex items-center gap-2">
                  💬 WhatsApp Support
                </a>
                <a href="mailto:contact@clinaza.in" className="hover:text-[#0867E8] transition-colors block">
                  ✉️ contact@clinaza.in
                </a>
              </div>

              {/* Footer Partnership Trust Badge */}
              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Official Affordability Partners
                </span>
                <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl w-fit">
                  <img src="/assets/payu_logo.svg" alt="PayU" style={{ height: '14px', width: 'auto' }} className="object-contain shrink-0" />
                  <span className="text-slate-300">|</span>
                  <img src="/assets/flexmoney_logo.png" alt="Flexmoney" style={{ height: '18px', width: 'auto' }} className="object-contain shrink-0" />
                </div>
              </div>
            </div>

            {/* Col 2: Popular Patient Guides & Blogs */}
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
                  <Link to="/blog/gap-closure-cost-in-patna" className="hover:text-[#0867E8] transition-colors">
                    Teeth Gap Filling &amp; Treatment Cost
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

            {/* Col 3: Free Tools & Clinic Software */}
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
                  <Link to="/reactivation/login" className="hover:text-[#0867E8] transition-colors font-bold text-[#0B2450]">
                    Free Cloud Dental CRM Login 🔐
                  </Link>
                </li>
                <li>
                  <Link to="/reactivation/login" className="hover:text-[#0867E8] transition-colors">
                    WhatsApp Patient Recall Portal
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Partner Cities Directory */}
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

          {/* Bottom Copyright & Disclaimer Strip */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 font-mono">
            <p>© 2026 CLINAZA Technologies. All Rights Reserved. &middot; Direct Helpline: +91 7292984244</p>
            <div className="flex items-center gap-4 text-slate-500">
              <a 
                href="https://instagram.com/clinaza.in" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-pink-600 font-sans font-semibold inline-flex items-center gap-1 text-slate-600 transition-colors"
              >
                <svg className="w-4 h-4 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Follow on Instagram
              </a>
              <span className="text-slate-300">&middot;</span>
              <Link to="/tools" className="hover:text-[#0867E8] underline">Free Tools</Link>
              <Link to="/blog" className="hover:text-[#0867E8] underline">Blog Hub</Link>
              <Link to="/reactivation/login" className="hover:text-[#0B2450] font-bold">Doctor Login</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
