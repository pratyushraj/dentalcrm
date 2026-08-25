import React, { useState, useEffect } from 'react';
import { ShieldCheck, ArrowRight, CheckCircle2, Lock, Sparkles, ChevronRight, Info, Building2, Check, CreditCard, Shield, Activity, Cpu } from 'lucide-react';
import { toast } from 'sonner';
import { ocenService } from '../services/ocenService';
import { lenderIntegrationService } from '../services/lenderIntegrationService';
import { emailNotificationService } from '../services/emailNotificationService';
import { SEOHead } from '@/components/seo/SEOHead';

interface LenderOffer {
  id: string;
  lenderName: string;
  logoBg: string;
  logoChar: string;
  badge: string;
  interestRate: string;
  tenure: string;
  monthlyEmi: number;
  totalRepayment: number;
  processingFee: number;
  minCibil: number | string;
  sortRate: number;
  isRecommended?: boolean;
}

const LenderLogo = ({ id }: { id: string }) => {
  const [error, setError] = React.useState(false);

  if (error) {
    return (
      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    );
  }

  switch (id) {
    case 'offer-salaryontime':
      return (
        <img 
          src="https://www.salaryontime.com/_next/static/media/logo.0prgo0-8s6a-y.png" 
          alt="Salary On Time" 
          className="w-10 h-10 object-contain rounded-lg"
          onError={() => setError(true)}
        />
      );
    case 'offer-cashvia':
      return (
        <img 
          src="https://cashvia.in/assets/cashvia_logo_icon.png" 
          alt="Cashvia" 
          className="w-8 h-8 object-contain rounded-lg"
          onError={() => setError(true)}
        />
      );
    case 'offer-jupiter':
      return (
        <img 
          src="https://jupiter.money/assets/images/website-v2/jupiter-logo.svg" 
          alt="Jupiter" 
          className="w-8 h-8 object-contain"
          onError={() => setError(true)}
        />
      );
    case 'offer-atmcred':
      return (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <rect x="3" y="5" width="18" height="14" rx="3" />
          <path strokeLinecap="round" d="M3 10h18M7 15h2M11 15h4" />
        </svg>
      );
    case 'offer-surya':
      return (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <circle cx="12" cy="12" r="5" />
          <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      );
    case 'offer-hero':
      return (
        <img 
          src="https://www.herofincorp.com/images/logo.webp" 
          alt="Hero Fincorp" 
          className="w-8 h-8 object-contain rounded-lg"
          onError={() => setError(true)}
        />
      );
    case 'offer-digicredit':
      return (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <rect x="4" y="4" width="16" height="16" rx="4" />
          <circle cx="9" cy="9" r="1.5" />
          <circle cx="15" cy="15" r="1.5" />
          <path d="M9 10.5v3M15 10.5v3M10.5 9h3M10.5 15h3" />
        </svg>
      );
    case 'offer-mmb':
      return (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      );
    case 'offer-tap4credit':
      return (
        <img 
          src="https://tap4credit.in/favicon/favicon.svg" 
          alt="Tap4Credit" 
          className="w-8 h-8 object-contain"
          onError={() => setError(true)}
        />
      );
    case 'offer-myfloat':
      return (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-9v14" />
        </svg>
      );
    case 'offer-timepecash':
      return (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'offer-dhancash':
      return (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      );
    case 'offer-creditsea':
      return (
        <img 
          src="https://www.creditsea.com/_next/static/media/logo.c59c5d80.svg" 
          alt="Creditsea" 
          className="w-8 h-8 object-contain"
          onError={() => setError(true)}
        />
      );
    default:
      return (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      );
  }
};

export default function EmiOnboardPage() {
  const [patientName, setPatientName] = useState('Patient');
  const [amount, setAmount] = useState('0');
  const [rawAmount, setRawAmount] = useState(0);
  const [partnerName, setPartnerName] = useState('Clinaza HealthPay');
  const [isAmountEditable, setIsAmountEditable] = useState(false);

  // Steps: 
  // 0: Consent & Details (PAN/Mobile)
  // 1: Lender Matching (Clinaza / OCEN 4.0 engine)
  // 2: Lender Offers Selection
  // 3: Lender KYC & KFS Approval (Finalizing with chosen bank/NBFC)
  // Steps: 0=Consent, 0.5=Pre-Screen, 1=Matching, 2=Offers, 3=KYC
  const [step, setStep] = useState(0);
  
  const [pan, setPan] = useState('');
  const [mobile, setMobile] = useState('');
  const [cibilScore, setCibilScore] = useState('750');
  
  // Pre-screening answers (Q1–Q4)
  const [employmentType, setEmploymentType] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [loanAmountRange, setLoanAmountRange] = useState('');
  // Note: cibilScore already captures Q3

  // Consents (un-checked by default)
  const [consentEligibility, setConsentEligibility] = useState(false);
  const [consentBankTerms, setConsentBankTerms] = useState(false);

  const [selectedOffer, setSelectedOffer] = useState<LenderOffer | null>(null);
  const [loadingText, setLoadingText] = useState('Initializing OCEN 4.0 protocol...');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nameParam = params.get('name');
    const mobileParam = params.get('mobile');
    const panParam = params.get('pan');
    const amountParam = params.get('amount');
    const partnerParam = params.get('partner');
    
    if (nameParam) setPatientName(decodeURIComponent(nameParam));
    if (mobileParam) setMobile(decodeURIComponent(mobileParam));
    if (panParam) setPan(decodeURIComponent(panParam).toUpperCase());
    if (amountParam) {
      const n = Number(amountParam);
      setRawAmount(n);
      setAmount(n.toLocaleString('en-IN'));
      setIsAmountEditable(false);
    } else {
      setIsAmountEditable(true);
    }
    if (partnerParam) {
      setPartnerName(decodeURIComponent(partnerParam));
    }
  }, []);

  const isLendSure = partnerName.toLowerCase().includes('lendsure');

  // Helper to build the complete list of 13 direct partner lenders from the Marcadeo brief sorted by interest rate (low to high)
  const buildLenderOffers = (amount: number, resultsMap?: Map<string, string>): LenderOffer[] => {
    const list: LenderOffer[] = [
      {
        id: 'offer-salaryontime',
        lenderName: 'Salary On Time Loan',
        logoBg: 'bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white',
        logoChar: 'ST',
        badge: 'Low Salaried Approval',
        interestRate: '7.50%–30% p.a.',
        tenure: '12 Months',
        monthlyEmi: Math.round((amount * 1.15) / 12),
        totalRepayment: Math.round(amount * 1.15),
        processingFee: Math.round(amount * 0.035),
        minCibil: '600',
        sortRate: 7.5,
      },
      {
        id: 'offer-cashvia',
        lenderName: 'Cashvia Personal Loan',
        logoBg: 'bg-gradient-to-tr from-emerald-600 to-teal-600 text-white',
        logoChar: 'CV',
        badge: resultsMap?.get('cashvia') === 'APPROVED' ? 'Live API Pre-Approved' : 'Best Approval Rate',
        interestRate: '12% – 36% p.a.',
        tenure: '12 Months',
        monthlyEmi: Math.round((amount * 1.12) / 12),
        totalRepayment: Math.round(amount * 1.12),
        processingFee: Math.round(amount * 0.03),
        minCibil: '600',
        sortRate: 12.0,
      },
      {
        id: 'offer-jupiter',
        lenderName: 'Jupiter Personal Loan',
        logoBg: 'bg-gradient-to-tr from-purple-700 to-indigo-800 text-white',
        logoChar: 'JU',
        badge: 'Loan Upto 5 Lakh',
        interestRate: '12% – 30% p.a.',
        tenure: '18 Months',
        monthlyEmi: Math.round((amount * 1.15) / 18),
        totalRepayment: Math.round(amount * 1.15),
        processingFee: Math.round(amount * 0.025),
        minCibil: '650',
        sortRate: 12.0,
      },
      {
        id: 'offer-atmcred',
        lenderName: 'ATM Cred Personal Loan',
        logoBg: 'bg-gradient-to-tr from-cyan-600 to-blue-600 text-white',
        logoChar: 'AC',
        badge: 'Low CIBIL Approval',
        interestRate: '18% – 36% p.a.',
        tenure: '12 Months',
        monthlyEmi: Math.round((amount * 1.18) / 12),
        totalRepayment: Math.round(amount * 1.18),
        processingFee: Math.round(amount * 0.035),
        minCibil: '500',
        sortRate: 18.0,
      },
      {
        id: 'offer-surya',
        lenderName: 'Surya Personal Loan',
        logoBg: 'bg-gradient-to-tr from-amber-500 to-yellow-600 text-white',
        logoChar: 'SU',
        badge: 'High Approval Rate',
        interestRate: '18% – 36% p.a.',
        tenure: '12 Months',
        monthlyEmi: Math.round((amount * 1.18) / 12),
        totalRepayment: Math.round(amount * 1.18),
        processingFee: Math.round(amount * 0.03),
        minCibil: '600',
        sortRate: 18.0,
      },
      {
        id: 'offer-hero',
        lenderName: 'Hero Fincorp (HIPL)',
        logoBg: 'bg-gradient-to-tr from-blue-700 to-violet-800 text-white',
        logoChar: 'H',
        badge: resultsMap?.get('herofincorp') === 'APPROVED' ? 'Live API Pre-Approved' : 'Flexible Medical EMI',
        interestRate: '18% – 30% p.a.',
        tenure: '12 Months',
        monthlyEmi: Math.round((amount * 1.18) / 12),
        totalRepayment: Math.round(amount * 1.18),
        processingFee: Math.round(amount * 0.02),
        minCibil: '725',
        sortRate: 18.0,
      },
      {
        id: 'offer-digicredit',
        lenderName: 'DigiCredit Personal Loan',
        logoBg: 'bg-gradient-to-tr from-teal-700 to-green-600 text-white',
        logoChar: 'DC',
        badge: 'Instant Digital Disbursal',
        interestRate: '18% – 36% p.a.',
        tenure: '12 Months',
        monthlyEmi: Math.round((amount * 1.18) / 12),
        totalRepayment: Math.round(amount * 1.18),
        processingFee: Math.round(amount * 0.03),
        minCibil: '650',
        sortRate: 18.0,
      },
      {
        id: 'offer-mmb',
        lenderName: 'MyMoneyBazaar (MMB)',
        logoBg: 'bg-gradient-to-tr from-orange-600 to-amber-600 text-white',
        logoChar: 'MB',
        badge: resultsMap?.get('mmb') === 'APPROVED' ? 'Live API Pre-Approved' : 'Multi-Lender Pre-Check',
        interestRate: '18% – 36% p.a.',
        tenure: '12 Months',
        monthlyEmi: Math.round((amount * 1.18) / 12),
        totalRepayment: Math.round(amount * 1.18),
        processingFee: Math.round(amount * 0.025),
        minCibil: '600',
        sortRate: 18.0,
      },
      {
        id: 'offer-tap4credit',
        lenderName: 'Tap4Credit',
        logoBg: 'bg-gradient-to-tr from-pink-600 to-purple-600 text-white',
        logoChar: 'T4C',
        badge: resultsMap?.get('tap4credit') === 'APPROVED' || resultsMap?.get('tap4credit') === 'EXISTS' ? 'Live API Pre-Approved' : 'Zero Processing Fee Options',
        interestRate: '18% – 36% p.a.',
        tenure: '18 Months',
        monthlyEmi: Math.round((amount * 1.20) / 18),
        totalRepayment: Math.round(amount * 1.20),
        processingFee: Math.round(amount * 0.03),
        minCibil: '650',
        sortRate: 18.0,
      },
      {
        id: 'offer-myfloat',
        lenderName: 'MyFloat Personal Loan',
        logoBg: 'bg-gradient-to-tr from-emerald-500 to-lime-600 text-white',
        logoChar: 'MF',
        badge: 'Best Approval Rate',
        interestRate: '18% – 36% p.a.',
        tenure: '12 Months',
        monthlyEmi: Math.round((amount * 1.18) / 12),
        totalRepayment: Math.round(amount * 1.18),
        processingFee: Math.round(amount * 0.03),
        minCibil: '600',
        sortRate: 18.0,
      },
      {
        id: 'offer-timepecash',
        lenderName: 'TimePeCash Personal Loan',
        logoBg: 'bg-gradient-to-tr from-fuchsia-600 to-rose-600 text-white',
        logoChar: 'TC',
        badge: 'Low Income Approval',
        interestRate: '18% – 36% p.a.',
        tenure: '9 Months',
        monthlyEmi: Math.round((amount * 1.15) / 9),
        totalRepayment: Math.round(amount * 1.15),
        processingFee: Math.round(amount * 0.03),
        minCibil: '600',
        sortRate: 18.0,
      },
      {
        id: 'offer-dhancash',
        lenderName: 'DhanCash Personal Loan',
        logoBg: 'bg-gradient-to-tr from-green-700 to-emerald-800 text-white',
        logoChar: 'DH',
        badge: 'Flexible EMI Plans',
        interestRate: '24% – 36% p.a.',
        tenure: '12 Months',
        monthlyEmi: Math.round((amount * 1.24) / 12),
        totalRepayment: Math.round(amount * 1.24),
        processingFee: Math.round(amount * 0.04),
        minCibil: '650',
        sortRate: 24.0,
      },
      {
        id: 'offer-creditsea',
        lenderName: 'Creditsea',
        logoBg: 'bg-gradient-to-tr from-sky-600 to-blue-700 text-white',
        logoChar: 'CS',
        badge: resultsMap?.get('creditsea') === 'APPROVED' ? 'Live API Pre-Approved' : 'Digital KYC Approval',
        interestRate: '24% – 36% p.a.',
        tenure: '12 Months',
        monthlyEmi: Math.round((amount * 1.24) / 12),
        totalRepayment: Math.round(amount * 1.24),
        processingFee: 0,
        minCibil: '500',
        sortRate: 24.0,
      }
    ];

    // Dynamic CIBIL recommendations mapping
    const score = Number(cibilScore);
    const mappedList = list.map(offer => {
      let isRecommended = false;
      if (score >= 750) {
        // Excellent CIBIL: Best matching premium loans
        isRecommended = ['offer-salaryontime', 'offer-cashvia', 'offer-jupiter'].includes(offer.id);
      } else if (score >= 700) {
        // Good CIBIL: Mid-high tier loans
        isRecommended = ['offer-cashvia', 'offer-jupiter', 'offer-hero'].includes(offer.id);
      } else if (score >= 600) {
        // Fair CIBIL: Reliable subprime options
        isRecommended = ['offer-digicredit', 'offer-tap4credit', 'offer-creditsea'].includes(offer.id);
      } else {
        // Low CIBIL: Specialized bad credit lenders
        isRecommended = ['offer-atmcred', 'offer-surya', 'offer-dhancash'].includes(offer.id);
      }
      return { ...offer, isRecommended };
    });

    // Sort by recommended status first, then by interest rate (low to high)
    return mappedList.sort((a, b) => {
      if (a.isRecommended && !b.isRecommended) return -1;
      if (!a.isRecommended && b.isRecommended) return 1;
      return a.sortRate - b.sortRate;
    });
  };

  const offers = buildLenderOffers(rawAmount);

  const [liveOffers, setLiveOffers] = useState<LenderOffer[]>([]);

  // Filter lenders by pre-screening answers
  const applyPreScreenFilter = (allOffers: LenderOffer[]): LenderOffer[] => {
    return allOffers.filter(offer => {
      // Q1: Employment type filter
      const salaryOnlyIds = ['offer-salaryontime'];
      if (employmentType === 'self-employed' && salaryOnlyIds.includes(offer.id)) return false;
      if (employmentType === 'unemployed') return false;

      // Q2: Monthly income filter
      const minIncome = Number(monthlyIncome);
      if (minIncome > 0) {
        if (minIncome < 15000 && ['offer-salaryontime','offer-surya','offer-timepecash','offer-cashvia','offer-atmcred','offer-creditsea','offer-myfloat','offer-dhancash','offer-tap4credit','offer-hero'].includes(offer.id)) return false;
        if (minIncome < 30000 && ['offer-salaryontime','offer-surya','offer-timepecash'].includes(offer.id)) return false;
      }

      // Q4: Loan amount range filter — hide lenders with too-low caps
      if (loanAmountRange === 'above-300000') {
        if (['offer-digicredit','offer-myfloat','offer-creditsea'].includes(offer.id)) return false;
      }
      if (loanAmountRange === '100000-300000') {
        if (['offer-digicredit','offer-myfloat'].includes(offer.id)) return false;
      }

      return true;
    });
  };

  const handleConsentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentEligibility || !consentBankTerms) {
      toast.error('Please accept both consent items to check your financing options.');
      return;
    }

    setStep(0.5); // Proceed to Pre-Screening Questions
    
    // Send email notification to funnyraj10@gmail.com
    emailNotificationService.sendNotification('New Patient Eligibility Checked', {
      patientName,
      mobile: mobile || 'N/A',
      pan: pan || 'N/A',
      treatmentBillAmount: rawAmount,
      cibilScoreRange: cibilScore
    });
    
    // Call OCEN 4.0 Service
    await ocenService.createLoanApplication({
      borrower: { name: patientName, mobile, pan },
      treatment: { clinicId: 'CLINAZA_PATNA', clinicName: 'Clinaza Partner Dental', procedureName: 'Dental Procedure', invoiceAmount: rawAmount }
    });

    setLoadingText('Querying Hero Fincorp (HIPL) Dedupe & Pre-Check API...');
    
    // Trigger 5-lender API aggregator submission
    const nameParts = patientName.split(' ');
    const firstName = nameParts[0] || 'Patient';
    const lastName = nameParts.slice(1).join(' ') || 'User';
    
    const lenderRes = await lenderIntegrationService.submitPatientToAllLenders({
      firstName,
      lastName,
      mobile: mobile || '9876543210',
      pan: pan.toUpperCase(),
      treatmentAmount: rawAmount,
      incomeMonthly: 60000,
      employmentType: 'Salaried'
    });

    console.log('[EmiOnboardPage] Multi-lender API Aggregator Results:', lenderRes);
    const resultsMap = new Map(lenderRes.lenderResults.map(r => [r.lenderId, r.status]));

    // Generate dynamic offers list for all 14 lenders with API pre-approval statuses injected
    const generatedOffers = buildLenderOffers(rawAmount, resultsMap);

    setLiveOffers(generatedOffers);

    setTimeout(() => {
      setLoadingText('Submitting Lead to Creditsea, Cashvia & Tap4Credit APIs...');
      setTimeout(() => {
        setLoadingText('Verifying My Money Bazaar (MMB) User Dedupe...');
        setTimeout(() => {
          toast.success(`Matched ${generatedOffers.length} Verified Partner Lenders!`);
          setStep(2); // Show offers
        }, 800);
      }, 800);
    }, 800);
  };

  const handleSelectOffer = (offer: LenderOffer) => {
    setSelectedOffer(offer);
    setStep(3); // Proceed to lender KYC & KFS completion

    setTimeout(() => {
      // Map lender ID to affiliate tracking UTM links from Personal Loan Brief Excel
      let trackingUrl = '';
      if (offer.id === 'offer-cashvia') {
        trackingUrl = 'https://partners.marcadeo.com/click?oid=294&uid=1895&lid=242';
      } else if (offer.id === 'offer-atmcred') {
        trackingUrl = 'https://partners.marcadeo.com/click?oid=447&uid=1895&lid=515';
      } else if (offer.id === 'offer-surya') {
        trackingUrl = 'https://partners.marcadeo.com/click?oid=449&uid=1895&lid=517';
      } else if (offer.id === 'offer-jupiter') {
        trackingUrl = 'https://partners.marcadeo.com/click?oid=442&uid=1895&lid=509';
      } else if (offer.id === 'offer-hero') {
        trackingUrl = 'https://partners.marcadeo.com/click?oid=344&uid=1895&lid=335';
      } else if (offer.id === 'offer-digicredit') {
        trackingUrl = 'https://partners.marcadeo.com/click?oid=371&uid=1895&lid=385';
      } else if (offer.id === 'offer-mmb') {
        trackingUrl = 'https://partners.marcadeo.com/click?oid=353&uid=1895&lid=347';
      } else if (offer.id === 'offer-tap4credit') {
        trackingUrl = 'https://partners.marcadeo.com/click?oid=393&uid=1895&lid=420';
      } else if (offer.id === 'offer-myfloat') {
        trackingUrl = 'https://partners.marcadeo.com/click?oid=289&uid=1895&lid=238';
      } else if (offer.id === 'offer-timepecash') {
        // Direct website redirect with partner referral code
        window.location.href = `https://web.timepecash.com/?referrer=OISAID63&mobile=${encodeURIComponent(mobile)}`;
        return;
      } else if (offer.id === 'offer-dhancash') {
        trackingUrl = 'https://partners.marcadeo.com/click?oid=464&uid=1895&lid=535';
      } else if (offer.id === 'offer-creditsea') {
        trackingUrl = 'https://partners.marcadeo.com/click?oid=454&uid=1895&lid=523';
      } else if (offer.id === 'offer-salaryontime') {
        trackingUrl = 'https://partners.marcadeo.com/click?oid=448&uid=1895&lid=516';
      } else {
        // Fallback to default callback
        const params = new URLSearchParams(window.location.search);
        const clientId = params.get('client_id') || 'de01ee08f2ec9266649435867d87da8d';
        window.location.href = `/emi/callback?client_id=${clientId}&status=approved&lender=${encodeURIComponent(offer.lenderName)}&mobile=${encodeURIComponent(mobile)}`;
        return;
      }

      // Append mobile number or click reference to tracking link to identify lead if supported
      window.location.href = `${trackingUrl}&aff_sub=${encodeURIComponent(mobile)}`;
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between p-4 sm:p-6 font-sans text-slate-100 antialiased relative overflow-hidden selection:bg-emerald-500 selection:text-white">
      <SEOHead
        title="Clinaza Patient Onboarding — Point-of-Care Financing"
        description="Check treatment loan eligibility and choose custom monthly EMIs directly at checkout."
        image="https://clinaza.in/og-preview.png"
      />
      
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-emerald-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Top Clinaza Header */}
      <header className="w-full max-w-xl mx-auto flex items-center justify-between py-4 px-2 border-b border-slate-800/80 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-emerald-500 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-white font-black text-sm">
              C
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-white tracking-tight leading-none">Clinaza</h1>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold uppercase tracking-wider">HealthPay</span>
            </div>
            <p className="text-[10.5px] font-semibold text-slate-400 mt-1">Healthcare Operating System</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10.5px] font-bold text-slate-300 shadow-inner">
          <Lock size={12} className="text-emerald-400" />
          <span>256-Bit SSL Encrypted</span>
        </div>
      </header>

      {/* Main Container Card */}
      <main className="w-full max-w-xl mx-auto bg-slate-900/90 backdrop-blur-2xl border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-6 relative">

        {/* Header Titles */}
        <div className="text-center space-y-2.5 pb-5 border-b border-slate-800/70">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Clinaza Treatment Financing
          </h2>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold shadow-sm">
            <Sparkles size={13} className="text-emerald-400 animate-pulse" />
            <span>Financing powered by Clinaza HealthPay</span>
          </div>
        </div>

        {/* Treatment Plan Summary Box */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-inner">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Activity size={12} className="text-indigo-400" />
              Patient Treatment Plan
            </span>
            <h3 className="text-base font-bold text-white tracking-tight">{patientName}</h3>
            <p className="text-xs text-slate-400">Dental / Aesthetic Procedure</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Treatment Bill</span>
            <div className="text-xl font-black text-emerald-400 font-mono tracking-tight">₹{amount}</div>
          </div>
        </div>

        {/* Interactive Stepper Indicator */}
        <div className="grid grid-cols-5 gap-1 text-center text-[8.5px] font-bold uppercase tracking-wider">
          {[
            { num: 1, label: 'Consent', stepVal: 0 },
            { num: 2, label: 'Profile', stepVal: 0.5 },
            { num: 3, label: 'Match', stepVal: 1 },
            { num: 4, label: 'Offers', stepVal: 2 },
            { num: 5, label: 'Apply', stepVal: 3 },
          ].map((s) => {
            const isActive = step === s.stepVal;
            const isCompleted = step > s.stepVal;
            return (
              <div
                key={s.label}
                className={`py-2 px-1 rounded-xl border transition-all duration-200 flex items-center justify-center gap-1 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-500 shadow-md shadow-emerald-600/20'
                    : isCompleted
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-slate-950/50 text-slate-400 border-slate-800/80'
                }`}
              >
                {isCompleted ? <Check size={10} className="stroke-[3]" /> : <span>{s.num}.</span>}
                <span>{s.label}</span>
              </div>
            );
          })}
        </div>

        {/* ─── STEP 0: CONSENT & BASIC DETAILS ─────────────────────────────────── */}
        {step === 0 && (
          <form onSubmit={handleConsentSubmit} className="space-y-6">

            {/* Input Details */}
            <div className="space-y-3.5">
              <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard size={13} className="text-indigo-400" />
                1. Basic Verification Details
              </h4>
              
              <div className={isAmountEditable ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : "w-full"}>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Estimated CIBIL Score</label>
                  <select
                    value={cibilScore}
                    onChange={(e) => setCibilScore(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs font-semibold text-white outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all cursor-pointer"
                  >
                    <option value="750">750+ (Excellent)</option>
                    <option value="700">700 - 750 (Good)</option>
                    <option value="650">600 - 700 (Fair)</option>
                    <option value="550">Below 600 (Needs Improvement)</option>
                  </select>
                </div>

                {isAmountEditable && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Treatment Bill Amount (₹)</label>
                    <input
                      type="number"
                      min={1000}
                      placeholder="Enter amount (e.g. 75000)"
                      value={rawAmount || ''}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setRawAmount(val);
                        setAmount(val.toLocaleString('en-IN'));
                      }}
                      className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs font-semibold font-mono text-white placeholder:text-slate-400 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                      required
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Data Sharing Notice */}
            <div className="flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
              <Info size={16} className="text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-200/90 leading-relaxed font-medium">
                Your estimated CIBIL score helps us filter and suggest the most matching lender with the highest approval rate.
              </p>
            </div>

            {/* Required Consents */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Shield size={13} className="text-emerald-400" />
                2. Mandatory Privacy Consents
              </h4>

              {/* Consent Item 1 */}
              <label htmlFor="consentEligibility" className="flex items-start gap-3 p-4 rounded-2xl border border-slate-800/90 hover:border-slate-700 bg-slate-950/60 cursor-pointer transition-all group">
                <input
                  type="checkbox"
                  id="consentEligibility"
                  checked={consentEligibility}
                  onChange={(e) => setConsentEligibility(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-emerald-500 rounded border-slate-700 bg-slate-900 focus:ring-emerald-500 shrink-0 cursor-pointer"
                />
                <span className="text-xs text-slate-300 leading-relaxed font-medium group-hover:text-slate-200 transition-colors">
                  I consent to Clinaza and its partnered banks/NBFCs pulling my CIBIL score and credit report to evaluate my eligibility for treatment financing.
                </span>
              </label>

              {/* Consent Item 2 */}
              <label htmlFor="consentBankTerms" className="flex items-start gap-3 p-4 rounded-2xl border border-slate-800/90 hover:border-slate-700 bg-slate-950/60 cursor-pointer transition-all group">
                <input
                  type="checkbox"
                  id="consentBankTerms"
                  checked={consentBankTerms}
                  onChange={(e) => setConsentBankTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-emerald-500 rounded border-slate-700 bg-slate-900 focus:ring-emerald-500 shrink-0 cursor-pointer"
                />
                <span className="text-xs text-slate-300 leading-relaxed font-medium group-hover:text-slate-200 transition-colors">
                  I authorize Clinaza to fetch my credit bureau reports and verify my identity records for processing the credit check.
                </span>
              </label>
            </div>

            {/* CTA Button */}
            <button
              type="submit"
              disabled={!consentEligibility || !consentBankTerms}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-xl ${
                consentEligibility && consentBankTerms
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:scale-[0.99] text-white shadow-emerald-500/25 cursor-pointer'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 cursor-not-allowed shadow-none'
              }`}
            >
              Check Financing Options
              <ArrowRight size={15} />
            </button>
          </form>
        )}

        {/* ─── STEP 0.5: PRE-SCREENING QUESTIONS ──────────────────────────── */}
        {step === 0.5 && (
          <div className="space-y-6">
            <div className="text-center space-y-1.5">
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-[10px] font-bold uppercase tracking-wider">Step 2 of 5 — Quick Profile</span>
              <h3 className="text-base font-bold text-white mt-2">Tell us about yourself</h3>
              <p className="text-xs text-slate-400 leading-relaxed">We'll use this to show only lenders you're most likely to get approved by.</p>
            </div>

            <div className="space-y-4">

              {/* Q1: Employment Type */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[9px] font-black">1</span>
                  What is your current employment status?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { val: 'salaried', label: '🏢 Salaried', sub: 'MNC / Govt / Private' },
                    { val: 'self-employed', label: '🏪 Self-Employed', sub: 'Business / Freelancer' },
                    { val: 'doctor', label: '👨‍⚕️ Doctor / Professional', sub: 'Practice Owner' },
                    { val: 'unemployed', label: '❌ Unemployed', sub: 'No active income' },
                  ].map(opt => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => setEmploymentType(opt.val)}
                      className={`p-3 rounded-xl border text-left transition-all duration-150 ${
                        employmentType === opt.val
                          ? 'bg-indigo-500/15 border-indigo-400 text-white'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold">{opt.label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{opt.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Q2: Monthly Income */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[9px] font-black">2</span>
                  What is your approximate monthly take-home income?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { val: '10000', label: 'Below ₹15,000' },
                    { val: '20000', label: '₹15,000 – ₹30,000' },
                    { val: '45000', label: '₹30,000 – ₹60,000' },
                    { val: '80000', label: 'Above ₹60,000' },
                  ].map(opt => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => setMonthlyIncome(opt.val)}
                      className={`p-3 rounded-xl border text-center text-xs font-bold transition-all duration-150 ${
                        monthlyIncome === opt.val
                          ? 'bg-emerald-500/15 border-emerald-400 text-white'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q3: CIBIL Score */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[9px] font-black">3</span>
                  What is your approximate CIBIL credit score?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { val: '750', label: '750+ Excellent', color: 'emerald' },
                    { val: '700', label: '700–750 Good', color: 'teal' },
                    { val: '650', label: '600–700 Fair', color: 'amber' },
                    { val: '550', label: 'Below 600 Poor', color: 'rose' },
                  ].map(opt => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => setCibilScore(opt.val)}
                      className={`p-3 rounded-xl border text-center text-xs font-bold transition-all duration-150 ${
                        cibilScore === opt.val
                          ? 'bg-purple-500/15 border-purple-400 text-white'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q4: Loan Amount Needed */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[9px] font-black">4</span>
                  How much loan are you looking for?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { val: 'under-25000', label: 'Under ₹25,000' },
                    { val: '25000-100000', label: '₹25K – ₹1 Lakh' },
                    { val: '100000-300000', label: '₹1L – ₹3 Lakh' },
                    { val: 'above-300000', label: 'Above ₹3 Lakh' },
                  ].map(opt => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => setLoanAmountRange(opt.val)}
                      className={`p-3 rounded-xl border text-center text-xs font-bold transition-all duration-150 ${
                        loanAmountRange === opt.val
                          ? 'bg-cyan-500/15 border-cyan-400 text-white'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* CTA */}
            <button
              type="button"
              disabled={!employmentType || !monthlyIncome || !cibilScore || !loanAmountRange}
              onClick={async () => {
                if (employmentType === 'unemployed') {
                  toast.error('Unfortunately, most lenders require an active income source. Please consult with your clinic for alternative payment plans.');
                  return;
                }
                setStep(1);
                emailNotificationService.sendNotification('New Patient Eligibility Checked', {
                  patientName,
                  mobile: mobile || 'N/A',
                  pan: pan || 'N/A',
                  treatmentBillAmount: rawAmount,
                  cibilScoreRange: cibilScore,
                  employmentType,
                  monthlyIncome,
                  loanAmountRange,
                });
                await ocenService.createLoanApplication({
                  borrower: { name: patientName, mobile, pan },
                  treatment: { clinicId: 'CLINAZA_PATNA', clinicName: 'Clinaza Partner Dental', procedureName: 'Dental Procedure', invoiceAmount: rawAmount }
                });
                setLoadingText('Querying Hero Fincorp (HIPL) Dedupe & Pre-Check API...');
                const nameParts = patientName.split(' ');
                const firstName = nameParts[0] || 'Patient';
                const lastName = nameParts.slice(1).join(' ') || 'User';
                const lenderRes = await lenderIntegrationService.submitPatientToAllLenders({
                  firstName, lastName,
                  mobile: mobile || '9876543210',
                  pan: pan.toUpperCase(),
                  treatmentAmount: rawAmount,
                  incomeMonthly: Number(monthlyIncome) || 60000,
                  employmentType: employmentType === 'salaried' ? 'Salaried' : 'Self-Employed'
                });
                const resultsMap = new Map(lenderRes.lenderResults.map(r => [r.lenderId, r.status]));
                const allOffers = buildLenderOffers(rawAmount, resultsMap);
                const filtered = applyPreScreenFilter(allOffers);
                setLiveOffers(filtered);
                setTimeout(() => {
                  setLoadingText('Submitting Lead to Creditsea, Cashvia & Tap4Credit APIs...');
                  setTimeout(() => {
                    setLoadingText('Verifying My Money Bazaar (MMB) User Dedupe...');
                    setTimeout(() => {
                      toast.success(`Matched ${filtered.length} Eligible Lenders for Your Profile!`);
                      setStep(2);
                    }, 800);
                  }, 800);
                }, 800);
              }}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-xl ${
                employmentType && monthlyIncome && cibilScore && loanAmountRange
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 active:scale-[0.99] text-white shadow-indigo-500/25 cursor-pointer'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 cursor-not-allowed shadow-none'
              }`}
            >
              Find My Matching Lenders
              <ArrowRight size={15} />
            </button>
          </div>
        )}

        {/* ─── STEP 1: LENDER MATCHING ENGINE ───────────────────────────────── */}
        {step === 1 && (
          <div className="py-12 space-y-6 flex flex-col items-center justify-center text-center">
            <div className="relative flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
              <div className="absolute w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-emerald-500/30">
                L
              </div>
            </div>

            <div className="space-y-2">
              <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                Clinaza Multi-Lender Ecosystem
              </span>
              <h3 className="text-base font-bold text-white">{loadingText}</h3>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed mx-auto font-medium">
                Scanning pre-approved medical loan limits from multiple regulated banking partners...
              </p>
            </div>
          </div>
        )}

        {/* ─── STEP 2: ELIGIBLE BANK/NBFC OFFERS ─────────────────────────────── */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">Eligible Bank & NBFC Offers</h4>
                <p className="text-xs text-slate-400 mt-0.5">Select a financing plan to complete approval</p>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 size={11} /> 5 Lender APIs Verified
              </span>
            </div>

            {/* Custom Recommendation Banner based on CIBIL */}
            <div className="bg-indigo-950/60 border border-indigo-500/20 rounded-2xl p-4 flex items-start gap-3 shadow-inner">
              <Sparkles size={16} className="text-indigo-400 shrink-0 mt-0.5 animate-pulse" />
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider block">Clinaza AI Suggestion Engine</span>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {cibilScore === '750' && "Excellent Credit! We highly recommend Salary On Time (7.5% p.a.) or Cashvia (12.0% p.a.) for the lowest cost of financing."}
                  {cibilScore === '700' && "Good Credit Profile. Cashvia or Jupiter Personal Loans are your best matching partners with instant approval."}
                  {cibilScore === '650' && "Fair Credit Profile. Tap4Credit or DigiCredit offer the highest likelihood of approval with minimal documentation."}
                  {cibilScore === '550' && "Credit Score Needs Improvement. ATM Cred and Surya Personal Loan are specialized in low-CIBIL approvals."}
                </p>
              </div>
            </div>

            <div className="space-y-3.5">
              {(liveOffers.length > 0 ? liveOffers : offers).map((offer) => (
                <div
                  key={offer.id}
                  onClick={() => handleSelectOffer(offer)}
                  className={`group relative p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    offer.isRecommended
                      ? 'bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-emerald-500/50 shadow-lg shadow-emerald-500/10 hover:border-emerald-400'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                  }`}
                >
                  {offer.isRecommended && (
                    <div className="absolute -top-2.5 right-4 px-3 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[9px] font-bold uppercase tracking-wider shadow-sm">
                      Recommended
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-11 h-11 rounded-2xl ${offer.logoBg} flex items-center justify-center shadow-md`}>
                        <LenderLogo id={offer.id} />
                      </div>
                      <div>
                        <h5 className="text-xs sm:text-sm font-bold text-white">{offer.lenderName}</h5>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="inline-block text-[10px] font-semibold text-slate-400">
                            {offer.badge} · {offer.interestRate}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[9px] font-bold">
                            Min CIBIL: {offer.minCibil}+
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm sm:text-base font-black text-emerald-400 font-mono">
                        ₹{offer.monthlyEmi.toLocaleString('en-IN')}<span className="text-[10px] text-slate-400 font-normal font-sans">/mo</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">Tenure: {offer.tenure}</span>
                    </div>
                  </div>

                  <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-end text-[11px] text-slate-400">
                    <div className="flex items-center gap-1 font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
                      Select Plan <ChevronRight size={13} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-center text-slate-400 font-medium">
              Note: Final sanction, KYC, and Key Fact Statement (KFS) will be provided directly by the selected lender.
            </p>
          </div>
        )}

        {/* ─── STEP 3: LENDER KYC & DISBURSAL HANDSHAKE ─────────────────────── */}
        {step === 3 && selectedOffer && (
          <div className="py-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 size={34} />
            </div>

            <div className="space-y-2">
              <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                Redirecting to {selectedOffer.lenderName}
              </span>
              <h3 className="text-base font-bold text-white">Offer Selected Successfully</h3>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed mx-auto">
                Opening {selectedOffer.lenderName}'s secure portal to complete digital KYC, view your Key Fact Statement (KFS), and finalize disbursement...
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-xl mx-auto mt-8 text-center text-xs text-slate-400 space-y-2 py-4 border-t border-slate-800/60">
        <p className="font-semibold text-slate-300">Financing technology powered by Clinaza HealthPay</p>
        <p className="text-[11px] text-slate-400">
          © 2026 Clinaza Health Technologies Ltd. · Clinic Partner Support Portal
        </p>
      </footer>
    </div>
  );
}
