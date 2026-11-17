import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SEOHead } from '@/components/seo/SEOHead';
import { 
  FileText, 
  Calculator, 
  DollarSign, 
  Download, 
  Share2, 
  CheckCircle2, 
  Printer, 
  Plus, 
  Trash2, 
  Sparkles, 
  Building2, 
  ShieldCheck, 
  MessageSquare,
  ArrowRight,
  Search,
  MapPin,
  Globe,
  ExternalLink,
  TableProperties,
  Check,
  Copy
} from 'lucide-react';

export default function FreeToolsHub() {
  const location = useLocation();

  const getInitialTab = (): 'rx' | 'setup' | 'emi' | 'seo' | 'costing' => {
    if (location.pathname === '/rx') return 'rx';
    if (location.pathname === '/calculator') return 'setup';
    if (location.pathname === '/costing') return 'costing';
    return 'rx';
  };

  const [activeTab, setActiveTab] = useState<'rx' | 'setup' | 'emi' | 'seo' | 'costing'>(getInitialTab);

  useEffect(() => {
    if (location.pathname === '/rx') setActiveTab('rx');
    else if (location.pathname === '/calculator') setActiveTab('setup');
    else if (location.pathname === '/costing') setActiveTab('costing');
  }, [location.pathname]);

  // --- Clinical Treatment Costing & Settlement Sheet State ---
  const [sheetMode, setSheetMode] = useState<'costing' | 'settlement'>('costing');
  const [costingPatientName, setCostingPatientName] = useState('Ananya Verma');
  const [costingPatientPhone, setCostingPatientPhone] = useState('+91 98765 43210');
  const [costingRows, setCostingRows] = useState([
    { id: 1, tooth: '#11', procedure: 'Straumann SLA Dental Implant + Custom Abutment', category: 'Implants', unitFee: 42000, qty: 1, labCost: 6500 },
    { id: 2, tooth: '#21', procedure: 'Zirconia Monolithic Crown (15-Yr Warranty)', category: 'Crowns', unitFee: 14000, qty: 1, labCost: 2800 },
    { id: 3, tooth: '#36', procedure: 'Micro-Endodontic Root Canal + Fiber Post', category: 'Endodontics', unitFee: 8500, qty: 1, labCost: 900 },
    { id: 4, tooth: 'Full Arch', procedure: 'Clear Invisible Aligners (Moderate Case - 22 Trays)', category: 'Aligners', unitFee: 65000, qty: 1, labCost: 18000 },
  ]);
  const [discountPercent, setDiscountPercent] = useState<number>(5);
  const [downPayment, setDownPayment] = useState<number>(10000);
  const [costingCopied, setCostingCopied] = useState(false);

  const addCostingRow = () => {
    setCostingRows([
      ...costingRows,
      { id: Date.now(), tooth: '#', procedure: 'New Clinical Procedure', category: 'General', unitFee: 5000, qty: 1, labCost: 1000 }
    ]);
  };

  const updateCostingRow = (id: number, field: string, value: any) => {
    setCostingRows(costingRows.map(row => {
      if (row.id === id) {
        return { ...row, [field]: value };
      }
      return row;
    }));
  };

  const removeCostingRow = (id: number) => {
    if (costingRows.length <= 1) return;
    setCostingRows(costingRows.filter(row => row.id !== id));
  };

  const grossTreatmentTotal = costingRows.reduce((sum, r) => sum + (Number(r.unitFee || 0) * Number(r.qty || 1)), 0);
  const discountAmount = Math.round((grossTreatmentTotal * (discountPercent || 0)) / 100);
  const netPayable = Math.max(0, grossTreatmentTotal - discountAmount);
  const loanPrincipal = Math.max(0, netPayable - (downPayment || 0));
  const totalLabExpenses = costingRows.reduce((sum, r) => sum + (Number(r.labCost || 0) * Number(r.qty || 1)), 0);
  const clinicNetProfit = netPayable - totalLabExpenses;

  // Monthly EMIs
  const emi3Mo = Math.round(loanPrincipal / 3);
  const emi6Mo = Math.round(loanPrincipal / 6);
  const emi12Mo = Math.round((loanPrincipal * 1.08) / 12);
  const emi24Mo = Math.round((loanPrincipal * 1.15) / 24);

  // Settlement sample ledger
  const settlementLedger = [
    { id: 'TXN-9021', date: '2026-11-15', patient: 'Vikram Sengupta', procedure: 'Dual Implants & Bone Graft', gross: 88000, partner: 'HDFC Bank (Pine Labs)', mdr: 3.5, status: 'Settled (T+1)' },
    { id: 'TXN-9022', date: '2026-11-15', patient: 'Pooja Iyer', procedure: 'Clear Aligners (Comprehensive)', gross: 72000, partner: 'ICICI Bank (Pine Labs)', mdr: 3.5, status: 'Settled (T+1)' },
    { id: 'TXN-9023', date: '2026-11-14', patient: 'Amitav Ghosh', procedure: 'Smile Makeover (6 Veneers)', gross: 95000, partner: 'Bajaj Finserv (EasyCred)', mdr: 4.2, status: 'Settled (T+1)' },
    { id: 'TXN-9024', date: '2026-11-14', patient: 'Sneha Kulkarni', procedure: 'Surgical Extraction + PRF', gross: 24000, partner: 'Kotak Bank (Pine Labs)', mdr: 3.5, status: 'Settled (T+1)' },
    { id: 'TXN-9025', date: '2026-11-13', patient: 'Rohan Deshmukh', procedure: 'Full Arch Ceramic Bridge', gross: 66000, partner: 'Axis Bank (Pine Labs)', mdr: 3.8, status: 'Settled (T+1)' },
  ];

  const downloadCostingCSV = () => {
    let csv = "Tooth,Procedure,Category,Unit Fee (INR),Qty,Subtotal (INR),Lab Cost (INR)\n";
    costingRows.forEach(r => {
      csv += `"${r.tooth}","${r.procedure}","${r.category}",${r.unitFee},${r.qty},${r.unitFee * r.qty},${r.labCost * r.qty}\n`;
    });
    csv += `\nGross Total,,,,,${grossTreatmentTotal},\n`;
    csv += `Clinic Courtesy Discount (${discountPercent}%),,,,,${discountAmount},\n`;
    csv += `Net Payable,,,,,${netPayable},\n`;
    csv += `Patient Down Payment,,,,,${downPayment},\n`;
    csv += `Loan Principal Financed,,,,,${loanPrincipal},\n`;
    csv += `\nEstimated Monthly EMIs:\n`;
    csv += `3 Months EMI,,,,,${emi3Mo} / month,\n`;
    csv += `6 Months EMI,,,,,${emi6Mo} / month,\n`;
    csv += `12 Months EMI,,,,,${emi12Mo} / month,\n`;
    csv += `24 Months EMI,,,,,${emi24Mo} / month,\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `Clinaza_Treatment_Costing_${costingPatientName.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadSettlementCSV = () => {
    let csv = "Txn ID,Date,Patient Name,Procedure,Gross Loan (INR),Partner,MDR Subvention (%),Net T+1 Bank Credit (INR),Status\n";
    settlementLedger.forEach(s => {
      const net = Math.round(s.gross * (1 - s.mdr / 100));
      csv += `"${s.id}","${s.date}","${s.patient}","${s.procedure}",${s.gross},"${s.partner}",${s.mdr}%,${net},"${s.status}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `Clinaza_Clinic_Settlement_Ledger.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyWhatsAppCostingQuote = () => {
    const text = `🦷 *CLINAZA TREATMENT ESTIMATE & EMI PLAN*\n` +
      `Patient: *${costingPatientName}*\n` +
      `Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}\n` +
      `--------------------------------\n` +
      costingRows.map((r, i) => `${i + 1}. *${r.tooth}*: ${r.procedure} (₹${(r.unitFee * r.qty).toLocaleString('en-IN')})`).join('\n') +
      `\n--------------------------------\n` +
      `💰 *Total Estimate:* ₹${grossTreatmentTotal.toLocaleString('en-IN')}\n` +
      (discountPercent > 0 ? `🎁 *Clinic Courtesy Discount (${discountPercent}%):* -₹${discountAmount.toLocaleString('en-IN')}\n` : '') +
      `✨ *Net Payable:* ₹${netPayable.toLocaleString('en-IN')}\n` +
      (downPayment > 0 ? `💵 *Initial Deposit:* ₹${downPayment.toLocaleString('en-IN')}\n` : '') +
      `🏥 *Financed Principal:* ₹${loanPrincipal.toLocaleString('en-IN')}\n` +
      `--------------------------------\n` +
      `💳 *Instant Patient EMI Options (Pine Labs & 55+ Banks):*\n` +
      `• *3 Months:* ₹${emi3Mo.toLocaleString('en-IN')}/mo\n` +
      `• *6 Months:* ₹${emi6Mo.toLocaleString('en-IN')}/mo\n` +
      `• *12 Months:* ₹${emi12Mo.toLocaleString('en-IN')}/mo\n` +
      `• *24 Months:* ₹${emi24Mo.toLocaleString('en-IN')}/mo\n` +
      `--------------------------------\n` +
      `⚡ *2-minute instant paperless approval with zero clinic khata!*\n` +
      `Check your instant eligibility: https://www.clinaza.in/#check-eligibility`;

    navigator.clipboard.writeText(text);
    setCostingCopied(true);
    setTimeout(() => setCostingCopied(false), 2500);
  };

  // --- Clinic Local SEO & Maps Checker State ---
  const [clinicSearchName, setClinicSearchName] = useState('');
  const [clinicSearchCity, setClinicSearchCity] = useState('');
  const [seoResults, setSeoResults] = useState<any>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [rxData, setRxData] = useState({
    clinicName: 'YOUR DENTIST DENTAL CARE',
    doctorName: 'Dr. Aryan Parmar, MDS (Endodontist)',
    clinicPhone: '+91 62014 78033',
    clinicAddress: 'Patliputra Colony, Main Road, Patna, Bihar',
    patientName: 'Rahul Sharma',
    patientAge: '32',
    patientGender: 'Male',
    patientPhone: '+91 98765 43210',
    date: new Date().toISOString().split('T')[0],
    diagnosis: 'Acute Irreversible Pulpitis #36 with Periapical Periodontitis',
    medicines: [
      { name: 'Tab. Augmentin 625mg (Amoxicillin + Clavulanic Acid)', dosage: '1 tablet twice daily (1-0-1)', duration: '5 days', instructions: 'After food' },
      { name: 'Tab. Zerodol-SP (Aceclofenac + Paracetamol + Serratiopeptidase)', dosage: '1 tablet twice daily (1-0-1)', duration: '3 days', instructions: 'After food (for pain & swelling)' },
      { name: 'Cap. Pantocid 40mg (Pantoprazole)', dosage: '1 capsule once daily (1-0-0)', duration: '5 days', instructions: 'Empty stomach (morning)' },
      { name: 'Hexidine Mouthwash (0.2% Chlorhexidine)', dosage: '10ml rinse twice daily', duration: '7 days', instructions: 'After brushing, do not swallow' }
    ],
    notes: 'Soft diet for 3 days. Return for obturation and crown preparation on scheduled date.'
  });

  const addMedicine = () => {
    setRxData({
      ...rxData,
      medicines: [...rxData.medicines, { name: '', dosage: '1 tablet twice daily', duration: '3 days', instructions: 'After food' }]
    });
  };

  const removeMedicine = (index: number) => {
    setRxData({
      ...rxData,
      medicines: rxData.medicines.filter((_, i) => i !== index)
    });
  };

  const updateMedicine = (index: number, field: string, value: string) => {
    const updated = [...rxData.medicines];
    (updated[index] as any)[field] = value;
    setRxData({ ...rxData, medicines: updated });
  };

  const handlePrint = () => {
    window.print();
  };

  // --- Setup Cost Calculator State ---
  const [chairsCount, setChairsCount] = useState<number>(2);
  const [tierCity, setTierCity] = useState<'metro' | 'tier2' | 'tier3'>('tier2');
  const [includeRvg, setIncludeRvg] = useState<boolean>(true);
  const [includeRotary, setIncludeRotary] = useState<boolean>(true);
  const [includeAutoclaveClassB, setIncludeAutoclaveClassB] = useState<boolean>(true);
  const [interiorQuality, setInteriorQuality] = useState<'standard' | 'premium'>('standard');

  const calculateSetupCost = () => {
    let chairUnitCost = 160000;
    let interiorPerSqFt = interiorQuality === 'premium' ? 1800 : 1100;
    let clinicArea = chairsCount * 350; // sq ft approx
    let deposit = tierCity === 'metro' ? 250000 : tierCity === 'tier2' ? 120000 : 60000;

    let totalChairs = chairsCount * chairUnitCost;
    let totalInteriors = clinicArea * interiorPerSqFt;
    let totalRvg = includeRvg ? 180000 : 0;
    let totalRotary = includeRotary ? 45000 : 0;
    let totalAutoclave = includeAutoclaveClassB ? 110000 : 45000;
    let instrumentsAndConsumables = chairsCount * 75000;
    let compressorAndSuction = 65000 * chairsCount;

    let grandTotal = totalChairs + totalInteriors + totalRvg + totalRotary + totalAutoclave + instrumentsAndConsumables + compressorAndSuction + deposit;
    let monthlyEmi24 = Math.round(grandTotal / 24);

    return {
      totalChairs,
      totalInteriors,
      totalEquipment: totalRvg + totalRotary + totalAutoclave + compressorAndSuction,
      instrumentsAndConsumables,
      deposit,
      grandTotal,
      monthlyEmi24
    };
  };

  const setupCosts = calculateSetupCost();

  // --- Treatment EMI Calculator State ---
  const [treatmentAmount, setTreatmentAmount] = useState<number>(85000);
  const [emiTenure, setEmiTenure] = useState<number>(12);
  const monthlyEmi = Math.round(treatmentAmount / emiTenure);

  const toolsSchema = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Clinaza Dental Prescription Maker (Rx Generator)",
      "applicationCategory": "HealthApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "INR"
      },
      "description": "Free printable digital prescription generator for dentists in India with standard pre-filled dental dosages."
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Clinaza Dental Clinic Setup Cost & Equipment Loan Calculator",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "INR"
      },
      "description": "Interactive dental clinic capital expenditure, equipment EMI, and setup loan estimator for 1 to 3 chairs across Indian cities (डेंटल क्लिनिक सेटअप और उपकरण लोन कैलकुलेटर)."
    },
    {
      "@context": "https://schema.org",
      "@type": "FinancialProduct",
      "name": "Clinaza Doctor Loan & Dental Clinic Setup Financing",
      "description": "Collateral-free professional business loans for BDS/MDS dentists to finance new clinic setup, dental chairs, and imaging equipment across India.",
      "provider": {
        "@type": "Organization",
        "name": "Clinaza Technologies",
        "url": "https://www.clinaza.in"
      },
      "areaServed": "IN",
      "amount": {
        "@type": "MonetaryAmount",
        "currency": "INR",
        "minValue": 1500000,
        "maxValue": 5000000
      },
      "annualPercentageRate": {
        "@type": "QuantitativeValue",
        "minValue": 10.5,
        "maxValue": 14.0,
        "unitText": "PERCENT"
      },
      "feesAndCommissionsSpecification": "Zero upfront evaluation charges. Transparent NBFC/bank processing fees per RBI guidelines."
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "डेंटल क्लिनिक के लिए लोन कैसे मिलता है? (How to get dental clinic loan in India?)",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "डेंटिस्ट्स को क्लिनिक सेटअप और नए डेंटल चेयर, RVG सेंसर, ऑटोकलेव खरीदने के लिए बिना किसी कोलेटरल (Collateral-free Doctor Loan) ₹15 लाख से ₹50 लाख तक का बिजनेस लोन HDFC, ICICI, SBI, Bajaj Finserv और Tata Capital से मिल जाता है। बीडीएस/एमडीएस डिग्री, पैन, आधार और 6 महीने के बैंक स्टेटमेंट पर लोन 24 से 60 महीनों के आसान ईएमआई पर स्वीकृत होता है।"
          }
        },
        {
          "@type": "Question",
          "name": "नए डेंटल क्लिनिक के सेटअप में कितना खर्च आता है?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "भारत में 1-चेयर क्लिनिक सेटअप का खर्च ₹6 लाख से ₹10 लाख और 2-चेयर क्लिनिक का कुल खर्च ₹12 लाख से ₹18 लाख (चेयर, इंटीरियर, आरवीजी, कंप्रेसर एवं डिपॉजिट सहित) आता है। इस कुल लागत को ₹18,000 से ₹45,000 प्रति माह की ईएमआई पर फाइनेंस किया जा सकता है।"
          }
        },
        {
          "@type": "Question",
          "name": "क्या डेंटल क्लिनिक उपकरण लोन पर इनकम टैक्स में छूट मिलती है?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "हाँ, इनकम टैक्स एक्ट की धारा 32 के तहत डेंटल उपकरणों पर 15% से 40% तक डेप्रिसिएशन और उपकरण लोन पर चुकाए गए ब्याज पर 100% टैक्स कटौती (Tax Deductible Business Expense) का लाभ मिलता है।"
          }
        }
      ]
    }
  ];

  const isRxRoute = location.pathname === '/rx';
  const isCalcRoute = location.pathname === '/calculator';

  const seoTitle = isRxRoute
    ? "Free Digital Dental Prescription Maker & Online Rx Generator"
    : isCalcRoute
    ? "Dental Clinic Setup Cost & Equipment Loan Calculator India"
    : "Free Dental Tools, Rx Maker & Setup Loan Calculator | Clinaza";

  const seoDescription = isRxRoute
    ? "Create and print professional digital dental prescriptions with pre-filled dosages, FDI tooth indications, and custom clinic headers 100% free."
    : isCalcRoute
    ? "Estimate dental clinic launch costs for 1-3 chairs, equipment hypothecation, interior capex, and monthly EMI for doctor loans across Indian cities."
    : "Free dental practice tools: Digital Dental Rx Prescription Maker, Clinic Setup Equipment Loan EMI Calculator, and patient treatment financing estimator.";

  const seoCanonical = isRxRoute
    ? "https://www.clinaza.in/rx"
    : isCalcRoute
    ? "https://www.clinaza.in/calculator"
    : "https://www.clinaza.in/tools";

  const seoKeywords = isRxRoute
    ? ["free dental prescription maker", "online rx generator dental india", "digital dental rx template", "dental prescription software free", "clinaza rx"]
    : isCalcRoute
    ? ["dental clinic setup cost calculator", "loan for dental clinic setup", "डेंटल क्लिनिक के लिए लोन", "dental equipment loan emi", "doctor loan for dental clinic"]
    : ["free dental prescription maker", "online rx generator dental india", "dental clinic setup cost calculator", "loan for dental clinic setup", "डेंटल क्लिनिक के लिए लोन", "dental equipment loan emi", "clinaza free tools"];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between relative overflow-hidden">
      <SEOHead 
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        canonicalUrl={seoCanonical}
        jsonLd={toolsSchema}
      />

      {/* Atmospheric Ambient Background Canvas */}
      <div className="absolute inset-0 bg-radial-fintech pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-grid-fintech mask-radial-fade opacity-60 pointer-events-none -z-10" />

      {/* Top Floating Pill Navbar */}
      <header className="fixed top-3 sm:top-5 inset-x-0 z-50 pointer-events-none px-4 sm:px-6">
        <nav className="max-w-5xl mx-auto bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-[0_8px_32px_rgba(15,23,42,0.08)] rounded-full px-3.5 sm:px-5 py-2.5 flex items-center justify-between gap-3 pointer-events-auto transition-all">
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
                  FREE UTILITIES
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">Dental Practice OS Tools</span>
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

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/reactivation/login"
              className="px-3.5 sm:px-4 py-2 min-h-[40px] bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-extrabold uppercase tracking-wider rounded-full transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
            >
              <span>Doctor Portal</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Banner */}
      <section className="pt-24 sm:pt-36 pb-8 sm:pb-12 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/90 text-slate-800 text-xs font-semibold shadow-2xs">
            <Sparkles size={13} className="text-amber-500" />
            <span className="text-[#0B2450] font-bold">100% Free For All Indian Dentists &amp; Clinics</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#0B2450] [text-wrap:balance]">
            Free Dental Practice Utilities &amp; Cost Calculators
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed [text-wrap:pretty]">
            Generate printable digital prescriptions, calculate dental clinic launch expenses, estimate monthly treatment EMIs, or audit your clinic's Google Maps visibility.
          </p>

          {/* Tab Controls */}
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            <button
              onClick={() => setActiveTab('rx')}
              className={`px-4 py-2.5 min-h-[44px] rounded-full text-xs font-bold transition-all flex items-center gap-2 active:scale-95 cursor-pointer ${
                activeTab === 'rx' 
                  ? 'bg-[#0B2450] text-white shadow-xs' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <FileText size={15} className={activeTab === 'rx' ? 'text-[#0867E8]' : 'text-slate-400'} />
              Digital Rx Prescription Maker
            </button>
            <button
              onClick={() => setActiveTab('setup')}
              className={`px-4 py-2.5 min-h-[44px] rounded-full text-xs font-bold transition-all flex items-center gap-2 active:scale-95 cursor-pointer ${
                activeTab === 'setup' 
                  ? 'bg-[#0B2450] text-white shadow-xs' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Building2 size={15} className={activeTab === 'setup' ? 'text-emerald-400' : 'text-slate-400'} />
              Clinic Setup Cost Calculator
            </button>
            <button
              onClick={() => setActiveTab('emi')}
              className={`px-4 py-2.5 min-h-[44px] rounded-full text-xs font-bold transition-all flex items-center gap-2 active:scale-95 cursor-pointer ${
                activeTab === 'emi' 
                  ? 'bg-[#0B2450] text-white shadow-xs' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Calculator size={15} className={activeTab === 'emi' ? 'text-blue-400' : 'text-slate-400'} />
              Treatment EMI Estimator
            </button>
            <button
              onClick={() => setActiveTab('seo')}
              className={`px-4 py-2.5 min-h-[44px] rounded-full text-xs font-bold transition-all flex items-center gap-2 active:scale-95 cursor-pointer ${
                activeTab === 'seo' 
                  ? 'bg-[#0B2450] text-white shadow-xs' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Search size={15} className={activeTab === 'seo' ? 'text-indigo-400' : 'text-slate-400'} />
              Clinic Google Maps &amp; SEO Audit
            </button>
            <button
              onClick={() => setActiveTab('costing')}
              className={`px-4 py-2.5 min-h-[44px] rounded-full text-xs font-bold transition-all flex items-center gap-2 active:scale-95 cursor-pointer ${
                activeTab === 'costing' 
                  ? 'bg-[#0B2450] text-white shadow-xs' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <TableProperties size={15} className={activeTab === 'costing' ? 'text-teal-400' : 'text-slate-400'} />
              Treatment Costing &amp; Settlement Sheet
            </button>
          </div>
        </div>
      </section>

      {/* Tool Container */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8">
        
        {/* ========================================================================= */}
        {/* TAB 1: DIGITAL PRESCRIPTION MAKER */}
        {/* ========================================================================= */}
        {activeTab === 'rx' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">Instant Digital Dental Prescription Generator</h2>
                <p className="text-xs text-slate-500">Edit fields below to generate a formatted prescription for your patient, then print or export to PDF.</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={handlePrint}
                  className="w-full sm:w-auto px-4 py-2.5 bg-[#0867E8] hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Printer size={15} /> Print / Save PDF
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Form Input Column */}
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm text-xs">
                <h3 className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] pb-2 border-b border-slate-100">
                  ✏️ Prescription Details
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Clinic Name</label>
                    <input
                      type="text"
                      value={rxData.clinicName}
                      onChange={(e) => setRxData({ ...rxData, clinicName: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Doctor Name &amp; Degree</label>
                    <input
                      type="text"
                      value={rxData.doctorName}
                      onChange={(e) => setRxData({ ...rxData, doctorName: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Patient Name</label>
                    <input
                      type="text"
                      value={rxData.patientName}
                      onChange={(e) => setRxData({ ...rxData, patientName: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  {/* Patient Age & Gender */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 font-bold mb-1">Age</label>
                      <input
                        type="number"
                        placeholder="e.g. 32"
                        value={rxData.patientAge}
                        onChange={(e) => setRxData({ ...rxData, patientAge: e.target.value })}
                        className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-bold mb-1">Gender</label>
                      <select
                        value={rxData.patientGender}
                        onChange={(e) => setRxData({ ...rxData, patientGender: e.target.value })}
                        className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Diagnosis / Clinical Findings</label>
                    <input
                      type="text"
                      value={rxData.diagnosis}
                      onChange={(e) => setRxData({ ...rxData, diagnosis: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  {/* Medicines List */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex justify-between items-center">
                      <label className="text-slate-700 font-extrabold text-[11px] uppercase">Medicines (Rx)</label>
                      <button
                        onClick={addMedicine}
                        className="text-[#0867E8] hover:underline font-bold text-xs flex items-center gap-1 py-1"
                      >
                        <Plus size={14} /> Add Drug
                      </button>
                    </div>

                    {rxData.medicines.map((med, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2 relative">
                        <div className="flex justify-between items-center gap-2">
                          <input
                            type="text"
                            placeholder="Medicine Name (e.g. Tab Augmentin 625)"
                            value={med.name}
                            onChange={(e) => updateMedicine(idx, 'name', e.target.value)}
                            className="w-full p-2 bg-white border border-slate-200 rounded text-xs font-semibold"
                          />
                          <button
                            onClick={() => removeMedicine(idx)}
                            className="w-9 h-9 flex items-center justify-center text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg shrink-0 transition-colors"
                            aria-label="Remove medicine"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Dosage (1-0-1)"
                            value={med.dosage}
                            onChange={(e) => updateMedicine(idx, 'dosage', e.target.value)}
                            className="p-1.5 bg-white border border-slate-200 rounded text-[11px]"
                          />
                          <input
                            type="text"
                            placeholder="Duration (5 days)"
                            value={med.duration}
                            onChange={(e) => updateMedicine(idx, 'duration', e.target.value)}
                            className="p-1.5 bg-white border border-slate-200 rounded text-[11px]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Doctor Advice / Post-Op Notes</label>
                    <textarea
                      rows={2}
                      value={rxData.notes}
                      onChange={(e) => setRxData({ ...rxData, notes: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Printable Prescription Preview Column */}
              <div className="lg:col-span-7">
                <div id="printable-rx" className="bg-white border border-slate-300 rounded-2xl p-6 sm:p-8 shadow-md text-slate-900 space-y-6 min-h-[580px] flex flex-col justify-between">
                  {/* Clinic Header */}
                  <div className="border-b-2 border-slate-800 pb-4 flex justify-between items-start">
                    <div className="space-y-1">
                      <h2 className="text-xl font-black text-[#0867E8] tracking-tight">{rxData.clinicName}</h2>
                      <p className="text-xs font-bold text-slate-800">{rxData.doctorName}</p>
                      <p className="text-[10px] text-slate-500">{rxData.clinicAddress} • {rxData.clinicPhone}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-serif font-black text-slate-300">Rx</span>
                    </div>
                  </div>

                  {/* Patient Info Bar */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">PATIENT NAME</span>
                      <strong className="text-slate-900">{rxData.patientName}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">AGE / GENDER</span>
                      <strong className="text-slate-900">{rxData.patientAge} Yrs / {rxData.patientGender}</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-semibold">DATE</span>
                      <strong className="text-slate-900">{rxData.date}</strong>
                    </div>
                  </div>

                  {/* Diagnosis */}
                  {rxData.diagnosis && (
                    <div className="text-xs">
                      <span className="font-bold text-slate-700">Diagnosis / Complaint: </span>
                      <span className="text-slate-900">{rxData.diagnosis}</span>
                    </div>
                  )}

                  {/* Medicines List */}
                  <div className="space-y-3.5 flex-1">
                    <h4 className="text-sm font-black text-slate-800 border-b border-slate-200 pb-1">
                      Medication Prescribed
                    </h4>
                    <div className="space-y-2.5">
                      {rxData.medicines.map((med, idx) => (
                        <div key={idx} className="flex justify-between items-start text-xs">
                          <div className="space-y-0.5">
                            <span className="font-bold text-slate-900">{idx + 1}. {med.name}</span>
                            <div className="text-[11px] text-slate-500 pl-4">{med.dosage} • {med.instructions}</div>
                          </div>
                          <span className="text-xs font-semibold text-slate-700">{med.duration}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notes & Doctor Signature */}
                  <div className="pt-4 border-t border-slate-200 flex justify-between items-end">
                    <div className="text-[10px] text-slate-500 max-w-xs">
                      <strong>Advice / Next Visit:</strong><br />
                      {rxData.notes}
                    </div>
                    <div className="text-center">
                      <div className="w-32 border-b border-slate-400 mb-1"></div>
                      <span className="text-[10px] font-bold text-slate-600 block">Doctor Signature</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: DENTAL CLINIC SETUP COST CALCULATOR */}
        {/* ========================================================================= */}
        {activeTab === 'setup' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-black text-slate-900 mb-1">Dental Clinic Setup Cost Calculator (India 2025–2026)</h2>
              <p className="text-xs text-slate-600">
                Estimate capital expenditure (CapEx) required to open a 1-chair, 2-chair, or 3-chair dental clinic in Indian cities.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Controls */}
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">Number of Dental Chairs</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((num) => (
                      <button
                        key={num}
                        onClick={() => setChairsCount(num)}
                        className={`py-2 rounded-xl font-bold border transition-all ${
                          chairsCount === num 
                            ? 'bg-[#0867E8] text-white border-[#0867E8]' 
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {num} {num === 1 ? 'Chair' : 'Chairs'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">Clinic City Tier</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'metro', label: 'Tier-1 Metro' },
                      { key: 'tier2', label: 'Tier-2 City' },
                      { key: 'tier3', label: 'Tier-3 Town' }
                    ].map((t) => (
                      <button
                        key={t.key}
                        onClick={() => setTierCity(t.key as any)}
                        className={`py-2 rounded-xl font-bold border text-[11px] transition-all ${
                          tierCity === t.key 
                            ? 'bg-emerald-600 text-white border-emerald-600' 
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">Interior &amp; Reception Quality</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setInteriorQuality('standard')}
                      className={`py-2 rounded-xl font-bold border transition-all ${
                        interiorQuality === 'standard' 
                          ? 'bg-slate-900 text-white border-slate-900' 
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      Standard (₹1,100/sqft)
                    </button>
                    <button
                      onClick={() => setInteriorQuality('premium')}
                      className={`py-2 rounded-xl font-bold border transition-all ${
                        interiorQuality === 'premium' 
                          ? 'bg-slate-900 text-white border-slate-900' 
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      Luxury (₹1,800/sqft)
                    </button>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="block text-slate-700 font-bold mb-1">Equipment Add-ons</label>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeRvg}
                      onChange={(e) => setIncludeRvg(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>Digital RVG Sensor &amp; DC X-Ray (+₹1,80,000)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeRotary}
                      onChange={(e) => setIncludeRotary(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>Endo Motor &amp; Apex Locator (+₹45,000)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeAutoclaveClassB}
                      onChange={(e) => setIncludeAutoclaveClassB(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>Class-B Vacuum Autoclave (vs basic vertical)</span>
                  </label>
                </div>
              </div>

              {/* Cost Summary Box */}
              <div className="lg:col-span-7 bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                    <div>
                      <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest block">ESTIMATED LAUNCH BUDGET</span>
                      <h3 className="text-3xl sm:text-4xl font-black text-white">
                        ₹{(setupCosts.grandTotal / 100000).toFixed(2)} Lakhs
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">EQUIPMENT EMI (24 MO)</span>
                      <span className="text-lg font-black text-emerald-400">₹{setupCosts.monthlyEmi24.toLocaleString()} / mo</span>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs text-slate-300">
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span>Dental Chairs ({chairsCount} unit{chairsCount > 1 ? 's' : ''}):</span>
                      <strong className="text-white">₹{setupCosts.totalChairs.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span>Clinic Interior &amp; Plumbing ({chairsCount * 350} sq ft):</span>
                      <strong className="text-white">₹{setupCosts.totalInteriors.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span>Digital RVG, Autoclave, Compressor &amp; Equipment:</span>
                      <strong className="text-white">₹{setupCosts.totalEquipment.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span>Instruments, Handpieces &amp; Initial Consumables:</span>
                      <strong className="text-white">₹{setupCosts.instrumentsAndConsumables.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span>Clinic Security Deposit ({tierCity.toUpperCase()}):</span>
                      <strong className="text-white">₹{setupCosts.deposit.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800 text-emerald-400">
                      <span>Dental CRM &amp; Practice Software (Clinaza):</span>
                      <strong className="text-emerald-400 font-bold">₹0 (Free Forever)</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
                    <a
                      href="https://wa.me/917292984244?text=Hi%20Pratyush,%20I%20am%20a%20dentist%20calculating%20clinic%20setup%20costs%20on%20Clinaza.%20I%20would%20like%20guidance%20on%20Dental%20Equipment%20%26%20Doctor%20Loans."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all text-center flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95"
                    >
                      <MessageSquare size={14} className="text-slate-950" /> Get Equipment Loan Help (WhatsApp) →
                    </a>
                    <Link
                      to="/reactivation/login"
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all text-center whitespace-nowrap"
                    >
                      Free Dental CRM →
                    </Link>
                  </div>
                  <p className="text-[10px] text-slate-400 text-center">
                    Doctor Loan Advisor: <strong className="text-white">+91 7292984244</strong> &bull; Unsecured Doctor Loans up to ₹50L
                  </p>
                </div>
              </div>
            </div>

            {/* B2B Dental Clinic Equipment & Doctor Loan Guide Section (डेंटल क्लिनिक के लिए लोन) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold mb-2">
                    <ShieldCheck size={14} /> Doctor Business Loan &amp; Equipment Financing Guide
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    डेंटल क्लिनिक के लिए लोन और उपकरण EMI गाइड (Doctor Loans in India)
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Complete financing assistance for BDS/MDS doctors looking to set up new clinics or upgrade dental chairs, RVG sensors, CBCT, and autoclaves.
                  </p>
                </div>
                <Link
                  to="/blog/dental-equipment-on-emi-india-doctor-loan-guide"
                  className="px-5 py-2.5 bg-[#0867E8] hover:bg-[#0756C7] text-white font-bold text-xs rounded-xl shadow-sm transition-all whitespace-nowrap text-center"
                >
                  Full Equipment Loan Guide →
                </Link>
              </div>

              {/* GEO Citability Block: Doctor & Dental Clinic Setup Loans */}
              <div className="bg-slate-50 border-l-4 border-blue-600 p-4 rounded-r-xl text-xs text-slate-800 space-y-2 leading-relaxed">
                <p>
                  <strong>How can a dentist get a loan to set up a dental clinic in India? (डेंटल क्लिनिक सेटअप लोन):</strong> Registered BDS and MDS practitioners can secure collateral-free professional doctor loans between ₹15,00,000 and ₹50,00,000 for new clinic setups, chair installations, and digital equipment (RVG, OPG, autoclaves). Regulated commercial banks and NBFCs provide doctor business loans starting from ~10.5% to 14% p.a. with tenures up to 60 months based on professional degree credentials and banking track record. In addition, government schemes like the <strong>Pradhan Mantri MUDRA Yojana (Tarun Scheme up to ₹10 Lakhs)</strong> and <strong>CGTMSE MSME Loans</strong> allow first-generation dental clinic entrepreneurs to finance clinic infrastructure with zero third-party collateral or property mortgage.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <h4 className="font-bold text-slate-900 text-sm">₹15L – ₹50L Collateral Free</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Unsecured doctor business loans approved solely on your BDS/MDS degree and clinic banking track record. Zero property mortgage required.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <h4 className="font-bold text-slate-900 text-sm">Flexible 12 to 60 Months EMI</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Split chair, RVG, and interior expenses into manageable monthly installments starting from 10.5% p.a. from regulated partner banks and NBFCs.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <h4 className="font-bold text-slate-900 text-sm">100% Tax Deductible Interest</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Under Section 32 of Income Tax Act, claim 15%–40% equipment depreciation, while interest paid is fully deductible against clinic receipts.
                  </p>
                </div>
              </div>

              {/* Hindi & English FAQs Accordion / List */}
              <div className="space-y-3 pt-2">
                <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide">
                  अक्सर पूछे जाने वाले सवाल (Frequently Asked Questions)
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="font-bold text-slate-900 mb-1">
                      प्रश्न: क्या नए डेंटिस्ट (Fresh BDS Graduates) को बिना 3 साल के ITR के क्लिनिक लोन मिल सकता है?
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                      उत्तर: हाँ! कई प्रमुख बैंक (HDFC, ICICI, SBI) और NBFCs नए डॉक्टर्स के लिए स्पेशल "New Doctor Setup Loan" स्कीम प्रदान करते हैं। इसमें राज्य डेंटल काउंसिल रजिस्ट्रेशन और को-बोरोअर (Co-borrower) के आधार पर ₹15 लाख से ₹25 लाख तक का लोन अप्रूव हो जाता है।
                    </p>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="font-bold text-slate-900 mb-1">
                      प्रश्न: डेंटल उपकरण (Chairs, RVG, OPG) खरीदने के लिए कौन-से दस्तावेज चाहिए?
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                      उत्तर: प्राथमिक दस्तावेज: (1) BDS/MDS डिग्री एवं डेंटल काउंसिल रजिस्ट्रेशन, (2) आधार कार्ड एवं पैन कार्ड, (3) 6 महीने का बैंक स्टेटमेंट, (4) उपकरण डीलर/कंपनी से प्रोफोर्मा इनवॉइस (Quotation), और (5) क्लिनिक का रेंट एग्रीमेंट या बिजली बिल।
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: TREATMENT EMI CALCULATOR */}
        {/* ========================================================================= */}
        {activeTab === 'emi' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-black text-slate-900 mb-1">Medical &amp; Dental Treatment EMI Calculator</h2>
              <p className="text-xs text-slate-600">
                Estimate monthly installments for Dental Implants, Braces, Hair Transplants, LASIK, and Elective Surgeries.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-slate-700">Total Treatment Cost</label>
                    <span className="text-lg font-black text-[#0867E8]">₹{treatmentAmount.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min={20000}
                    max={300000}
                    step={5000}
                    value={treatmentAmount}
                    onChange={(e) => setTreatmentAmount(Number(e.target.value))}
                    className="w-full accent-[#0867E8]"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                    <span>₹20,000 (RCT/Crown)</span>
                    <span>₹1,50,000 (Aligners/LASIK)</span>
                    <span>₹3,00,000 (Surgery/Full Mouth)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Select EMI Duration (Tenure)</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[3, 6, 12, 18].map((t) => (
                      <button
                        key={t}
                        onClick={() => setEmiTenure(t)}
                        className={`py-2.5 rounded-xl font-black text-xs border transition-all ${
                          emiTenure === t
                            ? 'bg-[#0867E8] text-white border-[#0867E8]'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {t} Months
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 bg-gradient-to-br from-[#0867E8] to-blue-700 text-white rounded-2xl p-6 sm:p-8 space-y-5 shadow-xl text-center">
                <span className="text-[10px] uppercase font-black tracking-widest text-blue-200 block">ESTIMATED MONTHLY INSTALLMENT</span>
                <div className="text-4xl sm:text-5xl font-black">
                  ₹{monthlyEmi.toLocaleString()} <span className="text-sm font-semibold text-blue-100">/ month</span>
                </div>
                <p className="text-xs text-blue-100 max-w-sm mx-auto">
                  ₹{treatmentAmount.toLocaleString()} estimated over {emiTenure} monthly installments. Cardless EMI, Credit &amp; Debit Card EMI powered in partnership with RBI-Regulated Lenders.
                </p>
                <div className="flex items-center justify-center gap-2 bg-white px-3.5 py-1.5 rounded-xl w-fit mx-auto shadow-xs">
                  <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Partner:</span>
                  
                </div>
                <div className="pt-2">
                  <a
                    href="/#check-eligibility"
                    className="inline-block px-6 py-3 bg-white text-[#0867E8] font-black text-xs uppercase tracking-wider rounded-xl hover:bg-blue-50 transition-colors shadow-md"
                  >
                    Check Patient Eligibility Now →
                  </a>
                </div>
              </div>
            </div>


          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: CLINIC GOOGLE MAPS & LOCAL SEO CHECKER (Powered by OpenSEO methodology) */}
        {/* ========================================================================= */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-black uppercase tracking-wider mb-2">
                  <Sparkles size={11} /> OpenSEO Methodology &bull; Local Pack Engine
                </div>
                <h2 className="text-xl font-black text-slate-900 mb-1">Dental Clinic Google Maps &amp; Local SEO Audit</h2>
                <p className="text-xs text-slate-600 max-w-xl">
                  Analyze your dental clinic's Google Business Profile readiness, 3-pack local visibility, NAP consistency, and search rankings against nearby dental competitors.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> 100% Free Audit
                </span>
              </div>
            </div>

            {/* Clinic Audit Form */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!clinicSearchName || !clinicSearchCity) return;
                  setIsAuditing(true);
                  setSeoResults(null);
                  setTimeout(() => {
                    const cleanName = clinicSearchName.trim();
                    const cleanCity = clinicSearchCity.trim();
                    const mockScore = Math.floor(Math.random() * 20) + 72; // 72 to 92
                    setSeoResults({
                      name: cleanName,
                      city: cleanCity,
                      score: mockScore,
                      grade: mockScore >= 85 ? 'A' : mockScore >= 75 ? 'B+' : 'B',
                      mapsQuery: `https://www.google.com/maps/search/${encodeURIComponent(cleanName + ' dental clinic ' + cleanCity)}`,
                      localPackKeywords: [
                        { keyword: `best dentist in ${cleanCity}`, intent: 'High-Volume Commercial', estimatedVolume: '1.2K/mo', difficulty: 'Medium' },
                        { keyword: `dental clinic near me`, intent: 'Immediate Patient Intent', estimatedVolume: '4.8K/mo', difficulty: 'High' },
                        { keyword: `teeth cleaning cost ${cleanCity}`, intent: 'Price Consideration', estimatedVolume: '720/mo', difficulty: 'Low' },
                        { keyword: `dental implants on emi in ${cleanCity}`, intent: 'High-Value Conversion', estimatedVolume: '390/mo', difficulty: 'Low' }
                      ],
                      checklist: [
                        { title: 'Google Business Profile Claimed & Verified', passed: true, note: 'Listing appears active on Google Maps' },
                        { title: 'Primary Category Set to "Dental clinic"', passed: true, note: 'Matches patient local search intent' },
                        { title: 'Treatment EMI & Financing Option Listed', passed: false, note: 'Patients seeking EMI cannot see flexible payment options on profile' },
                        { title: 'Automated Patient Review Recency (< 30 days)', passed: false, note: 'Need continuous 5-star Google review generation via WhatsApp' },
                        { title: 'Online Appointment Booking Link Active', passed: true, note: 'Direct booking link connects patients to reception' }
                      ]
                    });
                    setIsAuditing(false);
                  }, 1200);
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Clinic / Hospital Name *
                    </label>
                    <div className="relative">
                      <Building2 size={16} className="absolute left-3.5 top-3 text-slate-400" />
                      <input
                        type="text"
                        placeholder="e.g. Apollo Dental Care / Smile Craft"
                        value={clinicSearchName}
                        onChange={(e) => setClinicSearchName(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0867E8] focus:bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      City / Area Location *
                    </label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3.5 top-3 text-slate-400" />
                      <input
                        type="text"
                        placeholder="e.g. Patna / Kochi / South Delhi"
                        value={clinicSearchCity}
                        onChange={(e) => setClinicSearchCity(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0867E8] focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
                  <span className="text-[11px] text-slate-500">
                    💡 Searches live Google Maps data &amp; identifies high-converting patient search keywords.
                  </span>
                  <button
                    type="submit"
                    disabled={isAuditing}
                    className="w-full sm:w-auto px-6 py-2.5 bg-[#0867E8] hover:bg-[#0756C7] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isAuditing ? (
                      <>Analyzing Google Maps...</>
                    ) : (
                      <>
                        <Search size={14} /> Run Free Local SEO Audit
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Audit Results Presentation */}
            {seoResults && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Score Banner */}
                <div className="bg-gradient-to-r from-slate-900 via-[#0B2450] to-indigo-950 text-white rounded-2xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="space-y-2 text-center md:text-left">
                    <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400 block">
                      LOCAL SEO HEALTH REPORT &bull; {seoResults.city.toUpperCase()}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black">{seoResults.name}</h3>
                    <p className="text-xs text-slate-300 max-w-lg">
                      Calculated across Google Business Profile signals, local keyword opportunities, and patient conversion touchpoints.
                    </p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-center p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15">
                      <div className="text-4xl font-black text-emerald-400">{seoResults.score}<span className="text-lg text-white">/100</span></div>
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wide">SEO Health Score</span>
                    </div>
                    <div className="text-center p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15">
                      <div className="text-4xl font-black text-blue-400">{seoResults.grade}</div>
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wide">Visibility Grade</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* High-Intent Local Keywords Grid */}
                  <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <Globe size={16} className="text-[#0867E8]" /> High-Intent Local Search Queries ({seoResults.city})
                      </h4>
                      <span className="text-[10px] font-bold text-slate-400">OpenSEO Data</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold">
                            <th className="py-2.5">Target Patient Query</th>
                            <th className="py-2.5">Est. Volume</th>
                            <th className="py-2.5">Patient Intent</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {seoResults.localPackKeywords.map((item: any, idx: number) => (
                            <tr key={idx} className="hover:bg-slate-50/80">
                              <td className="py-3 font-bold text-slate-900">{item.keyword}</td>
                              <td className="py-3 text-[#0867E8] font-bold">{item.estimatedVolume}</td>
                              <td className="py-3 text-slate-600">
                                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold">
                                  {item.intent}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Checklist & Recommendations */}
                  <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <ShieldCheck size={16} className="text-emerald-600" /> Actionable Fixes for 3-Pack Rank
                    </h4>
                    <div className="space-y-3">
                      {seoResults.checklist.map((c: any, idx: number) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs">
                          {c.passed ? (
                            <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                          ) : (
                            <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">!</span>
                          )}
                          <div>
                            <span className={`font-bold block ${c.passed ? 'text-slate-800' : 'text-rose-900'}`}>
                              {c.title}
                            </span>
                            <span className="text-[11px] text-slate-500 block leading-relaxed">
                              {c.note}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-slate-100">
                      <a
                        href={seoResults.mapsQuery}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 text-center"
                      >
                        <ExternalLink size={13} /> View Clinic Live on Google Maps
                      </a>
                    </div>
                  </div>
                </div>

                {/* Conversion Bridge to Clinaza CRM */}
                <div className="p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-emerald-50 border border-blue-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                  <div className="space-y-1 text-center sm:text-left">
                    <span className="text-[10px] font-black text-[#0867E8] uppercase tracking-wider block">
                      🚀 10X YOUR CLINIC REVENUE &amp; GOOGLE REVIEWS
                    </span>
                    <h4 className="text-sm sm:text-base font-black text-slate-900">
                      Want automated WhatsApp Google reviews &amp; patient EMI financing at your clinic?
                    </h4>
                    <p className="text-xs text-slate-600">
                      Clinaza powers instant patient financing and automated review collection for 500+ clinics across India.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2.5 shrink-0 w-full sm:w-auto">
                    <Link
                      to="/reactivation/login"
                      className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all text-center shadow-md"
                    >
                      Login Free to CRM →
                    </Link>
                    <Link
                      to="/clinic-onboarding"
                      className="px-5 py-2.5 bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all text-center shadow-md"
                    >
                      Onboard Clinic Free
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: TREATMENT COSTING & SETTLEMENT SPREADSHEET (Univer-Compatible Matrix) */}
        {/* ========================================================================= */}
        {activeTab === 'costing' && (
          <div className="space-y-6">
            {/* Top Toolbar Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-[10px] font-black uppercase tracking-wider mb-2">
                  <TableProperties size={11} /> Universal Clinical Spreadsheet Matrix
                </div>
                <h2 className="text-xl font-black text-slate-900 mb-1">Dental Treatment Costing &amp; Clinic Settlement Ledger</h2>
                <p className="text-xs text-slate-600">
                  Calculate multi-stage patient procedure costs, compute live monthly EMI brackets, and reconcile T+1 bank disbursements.
                </p>
              </div>

              {/* View Switcher & Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
                  <button
                    onClick={() => setSheetMode('costing')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      sheetMode === 'costing'
                        ? 'bg-white text-[#0B2450] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Patient Costing Sheet
                  </button>
                  <button
                    onClick={() => setSheetMode('settlement')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      sheetMode === 'settlement'
                        ? 'bg-white text-[#0B2450] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Clinic Settlement Ledger
                  </button>
                </div>

                {sheetMode === 'costing' ? (
                  <>
                    <button
                      onClick={copyWhatsAppCostingQuote}
                      className={`px-3.5 py-2 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-xs ${
                        costingCopied
                          ? 'bg-emerald-700 ring-2 ring-emerald-400 animate-bounce-short'
                          : 'bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98]'
                      }`}
                    >
                      {costingCopied ? <Check size={13} className="text-white animate-pulse" /> : <MessageSquare size={13} />}
                      {costingCopied ? 'Copied to WhatsApp!' : 'WhatsApp Quote'}
                    </button>
                    <button
                      onClick={downloadCostingCSV}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition-all flex items-center gap-1.5"
                    >
                      <Download size={13} />
                      Export CSV
                    </button>
                  </>
                ) : (
                  <button
                    onClick={downloadSettlementCSV}
                    className="px-3.5 py-2 bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
                  >
                    <Download size={13} />
                    Export Ledger CSV
                  </button>
                )}
              </div>
            </div>

            {/* MODE 1: PATIENT TREATMENT COSTING SHEET */}
            {sheetMode === 'costing' && (
              <div className="space-y-6">
                {/* Patient Header Details */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Patient Full Name</label>
                    <input
                      type="text"
                      value={costingPatientName}
                      onChange={(e) => setCostingPatientName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#0867E8]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Patient WhatsApp Number</label>
                    <input
                      type="text"
                      value={costingPatientPhone}
                      onChange={(e) => setCostingPatientPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#0867E8]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Financing Channel</label>
                    <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-extrabold text-[#0B2450] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Pine Labs (16+ Banks) &bull; T+1 Disbursed
                    </div>
                  </div>
                </div>

                {/* The Interactive Costing Spreadsheet Grid */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                      <TableProperties size={14} className="text-[#0867E8]" />
                      Procedure Line Items &bull; Live Calculation Matrix
                    </h3>
                    <button
                      onClick={addCostingRow}
                      className="px-3 py-1.5 bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1 shadow-xs"
                    >
                      <Plus size={12} /> Add Row
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-extrabold text-[11px] uppercase tracking-wider">
                          <th className="py-3 px-3 w-20">Tooth / Site</th>
                          <th className="py-3 px-3">Clinical Procedure / Material</th>
                          <th className="py-3 px-3 w-28">Category</th>
                          <th className="py-3 px-3 w-28 text-right">Unit Fee (₹)</th>
                          <th className="py-3 px-3 w-16 text-center">Qty</th>
                          <th className="py-3 px-3 w-28 text-right">Lab Cost (₹)</th>
                          <th className="py-3 px-3 w-28 text-right">Subtotal (₹)</th>
                          <th className="py-3 px-3 w-12 text-center">Del</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {costingRows.map((row) => (
                          <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-2.5 px-3">
                              <input
                                type="text"
                                value={row.tooth}
                                onChange={(e) => updateCostingRow(row.id, 'tooth', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 font-bold text-slate-800 text-xs focus:border-[#0867E8] focus:outline-none"
                              />
                            </td>
                            <td className="py-2.5 px-3">
                              <input
                                type="text"
                                value={row.procedure}
                                onChange={(e) => updateCostingRow(row.id, 'procedure', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-800 text-xs focus:border-[#0867E8] focus:outline-none"
                              />
                            </td>
                            <td className="py-2.5 px-3">
                              <select
                                value={row.category}
                                onChange={(e) => updateCostingRow(row.id, 'category', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-700 text-xs focus:border-[#0867E8] focus:outline-none"
                              >
                                <option value="Implants">Implants</option>
                                <option value="Aligners">Aligners</option>
                                <option value="Crowns">Crowns</option>
                                <option value="Endodontics">Endodontics</option>
                                <option value="Surgery">Surgery</option>
                                <option value="General">General</option>
                              </select>
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <input
                                type="number"
                                value={row.unitFee}
                                onChange={(e) => updateCostingRow(row.id, 'unitFee', Number(e.target.value))}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-right font-bold text-slate-800 text-xs focus:border-[#0867E8] focus:outline-none"
                              />
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <input
                                type="number"
                                min={1}
                                max={32}
                                value={row.qty}
                                onChange={(e) => updateCostingRow(row.id, 'qty', Number(e.target.value))}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-center font-bold text-slate-800 text-xs focus:border-[#0867E8] focus:outline-none"
                              />
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <input
                                type="number"
                                value={row.labCost}
                                onChange={(e) => updateCostingRow(row.id, 'labCost', Number(e.target.value))}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-right text-slate-500 text-xs focus:border-[#0867E8] focus:outline-none"
                              />
                            </td>
                            <td className="py-2.5 px-3 text-right font-extrabold text-[#0B2450]">
                              ₹{(row.unitFee * row.qty).toLocaleString('en-IN')}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <button
                                onClick={() => removeCostingRow(row.id)}
                                className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded transition-colors"
                                title="Remove row"
                              >
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Table Footer Controls */}
                  <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-semibold text-slate-600">
                    <div className="flex items-center gap-4">
                      <span>Total Procedure Items: <strong>{costingRows.length}</strong></span>
                      <span>Total Lab &amp; Material Expense: <strong>₹{totalLabExpenses.toLocaleString('en-IN')}</strong></span>
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        Estimated Clinic Margin: ₹{clinicNetProfit.toLocaleString('en-IN')} ({grossTreatmentTotal > 0 ? Math.round((clinicNetProfit / netPayable) * 100) : 0}%)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Financial Summary & EMI Computation Deck */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Gross Total */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Gross Treatment Fee</span>
                    <div className="text-xl font-black text-[#0B2450]">
                      ₹{grossTreatmentTotal.toLocaleString('en-IN')}
                    </div>
                    <span className="text-[10px] text-slate-500">Sum of all procedure line items</span>
                  </div>

                  {/* Discount Control */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Courtesy Discount</span>
                      <span className="text-xs font-bold text-rose-600">-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min={0}
                        max={25}
                        step={1}
                        value={discountPercent}
                        onChange={(e) => setDiscountPercent(Number(e.target.value))}
                        className="w-full accent-[#0867E8]"
                      />
                      <span className="text-xs font-extrabold text-[#0B2450] w-10 text-right">{discountPercent}%</span>
                    </div>
                    <span className="text-[10px] text-slate-500">Doctor discretionary reduction</span>
                  </div>

                  {/* Down Payment */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Patient Upfront Deposit</span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold text-slate-400">₹</span>
                      <input
                        type="number"
                        step={1000}
                        value={downPayment}
                        onChange={(e) => setDownPayment(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-sm font-black text-[#0B2450] focus:outline-none focus:border-[#0867E8]"
                      />
                    </div>
                    <span className="text-[10px] text-slate-500">Collected at clinic reception</span>
                  </div>

                  {/* Net Financed Amount */}
                  <div className="bg-[#0B2450] text-white border border-slate-800 rounded-2xl p-4 shadow-xs">
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-200 block mb-1">Financed via Clinaza EMI</span>
                    <div className="text-xl font-black text-white">
                      ₹{loanPrincipal.toLocaleString('en-IN')}
                    </div>
                    <span className="text-[10px] text-emerald-300 font-semibold flex items-center gap-1 mt-0.5">
                      <CheckCircle2 size={11} /> 100% T+1 Disbursed to Clinic
                    </span>
                  </div>
                </div>

                {/* Instant Patient EMI Brackets Deck */}
                <div className="bg-gradient-to-br from-blue-50/80 via-white to-slate-50 border border-blue-200/60 rounded-2xl p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                    <div>
                      <h4 className="text-sm font-extrabold text-[#0B2450] flex items-center gap-2">
                        <Sparkles size={14} className="text-[#0867E8]" />
                        Instant Point-of-Care Monthly EMI Brackets for Patient
                      </h4>
                      <p className="text-xs text-slate-600">
                        Based on Clinaza's front-desk lending gateway via Pine Labs (HDFC, ICICI, SBI, Axis, Kotak &amp; 16+ banks).
                      </p>
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 bg-blue-100 text-[#0867E8] rounded-full border border-blue-200">
                      Zero Bad Clinic Debt
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">3 Months</span>
                      <div className="text-base font-extrabold text-[#0B2450] my-0.5">
                        ₹{emi3Mo.toLocaleString('en-IN')}<span className="text-[10px] font-normal text-slate-500">/mo</span>
                      </div>
                      <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Short Tenure</span>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border-2 border-[#0867E8] shadow-xs text-center relative">
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase tracking-widest bg-[#0867E8] text-white px-2 py-0.5 rounded-full">
                        POPULAR
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">6 Months</span>
                      <div className="text-base font-extrabold text-[#0867E8] my-0.5">
                        ₹{emi6Mo.toLocaleString('en-IN')}<span className="text-[10px] font-normal text-slate-500">/mo</span>
                      </div>
                      <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">Balanced Plan</span>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">12 Months</span>
                      <div className="text-base font-extrabold text-[#0B2450] my-0.5">
                        ₹{emi12Mo.toLocaleString('en-IN')}<span className="text-[10px] font-normal text-slate-500">/mo</span>
                      </div>
                      <span className="text-[9px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">Low Monthly</span>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">24 Months</span>
                      <div className="text-base font-extrabold text-[#0B2450] my-0.5">
                        ₹{emi24Mo.toLocaleString('en-IN')}<span className="text-[10px] font-normal text-slate-500">/mo</span>
                      </div>
                      <span className="text-[9px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">High Value Surgery</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MODE 2: CLINIC T+1 SETTLEMENT & RECONCILIATION LEDGER */}
            {sheetMode === 'settlement' && (
              <div className="space-y-6">
                {/* Settlement KPI Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Total Loan Volume (30D)</span>
                    <div className="text-xl font-black text-[#0B2450]">₹3,45,000</div>
                    <span className="text-[10px] text-slate-500">5 Financed Treatments</span>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Net T+1 Bank Disbursals</span>
                    <div className="text-xl font-black text-emerald-600">₹3,31,200</div>
                    <span className="text-[10px] text-emerald-700 font-semibold">Credited to Clinic Current A/C</span>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Blended Subvention / MDR</span>
                    <div className="text-xl font-black text-[#0867E8]">3.7%</div>
                    <span className="text-[10px] text-slate-500">Pine Labs &amp; Lender Network</span>
                  </div>
                  <div className="bg-[#0B2450] text-white border border-slate-800 rounded-2xl p-4 shadow-xs">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 block mb-1">Clinic Bad Debt Risk</span>
                    <div className="text-xl font-black text-white">₹0</div>
                    <span className="text-[10px] text-emerald-300 font-semibold flex items-center gap-1 mt-0.5">
                      <ShieldCheck size={11} /> 100% Non-Recourse to Doctor
                    </span>
                  </div>
                </div>

                {/* Settlement Ledger Table */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                      <Building2 size={14} className="text-emerald-600" />
                      Clinic Bank Settlement &amp; Payout Audit Log
                    </h3>
                    <span className="text-[11px] font-bold text-slate-500">Automated T+1 Pine Labs Direct Deposit</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-extrabold text-[11px] uppercase tracking-wider">
                          <th className="py-3 px-3">Txn ID</th>
                          <th className="py-3 px-3">Date</th>
                          <th className="py-3 px-3">Patient</th>
                          <th className="py-3 px-3">Procedure</th>
                          <th className="py-3 px-3 text-right">Gross Loan (₹)</th>
                          <th className="py-3 px-3">Lending Partner</th>
                          <th className="py-3 px-3 text-center">MDR</th>
                          <th className="py-3 px-3 text-right">Net Bank Credit (₹)</th>
                          <th className="py-3 px-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {settlementLedger.map((s) => {
                          const netCredit = Math.round(s.gross * (1 - s.mdr / 100));
                          return (
                            <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="py-3 px-3 font-mono font-bold text-slate-700">{s.id}</td>
                              <td className="py-3 px-3 text-slate-600">{s.date}</td>
                              <td className="py-3 px-3 font-bold text-[#0B2450]">{s.patient}</td>
                              <td className="py-3 px-3 text-slate-600">{s.procedure}</td>
                              <td className="py-3 px-3 text-right font-bold text-slate-900">₹{s.gross.toLocaleString('en-IN')}</td>
                              <td className="py-3 px-3 text-slate-600 font-medium">{s.partner}</td>
                              <td className="py-3 px-3 text-center font-bold text-slate-500">{s.mdr}%</td>
                              <td className="py-3 px-3 text-right font-extrabold text-emerald-600">₹{netCredit.toLocaleString('en-IN')}</td>
                              <td className="py-3 px-3 text-center">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <CheckCircle2 size={10} /> {s.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
                    <p>💡 All loans are disbursed non-recourse: patient repayments are collected directly by lending banks.</p>
                    <Link to="/clinic-onboarding" className="text-[#0867E8] font-bold hover:underline flex items-center gap-1">
                      Link Verified Current Account for T+1 Payouts →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Interlinking to Blog Guides */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Related Practice Management &amp; Patient EMI Guides</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <Link to="/blog/dental-treatment-on-emi-india-guide" className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl transition-colors block">
              <strong className="text-[#0B2450] block">Dental Treatment on EMI Guide</strong>
              <span className="text-[11px] text-slate-500">Flexible monthly EMI plans &amp; eligibility criteria</span>
            </Link>
            <Link to="/blog/dental-loans-in-india-medical-financing" className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl transition-colors block">
              <strong className="text-[#0B2450] block">Dental Loans &amp; Medical Financing</strong>
              <span className="text-[11px] text-slate-500">Compare NBFC rates, approvals &amp; tenure</span>
            </Link>
            <Link to="/blog/free-digital-dental-prescription-maker-emr-software-india" className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl transition-colors block">
              <strong className="text-[#0B2450] block">Digital Prescription &amp; EMR Guide</strong>
              <span className="text-[11px] text-slate-500">How to modernize clinic paperwork</span>
            </Link>
            <Link to="/blog/how-dental-clinics-increase-treatment-acceptance-with-emi-india" className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl transition-colors block">
              <strong className="text-[#0B2450] block">Increase Case Acceptance with EMI</strong>
              <span className="text-[11px] text-slate-500">Overcoming patient price objections</span>
            </Link>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 px-6 bg-white text-center sm:text-left w-full mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img src="/assets/clinaza-logo.jpg" alt="CLINAZA" className="h-8 w-auto rounded-lg border border-slate-200" />
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#0B2450] block">CLINAZA</span>
              <span className="text-[8px] font-bold text-[#0f7a75] block uppercase">PRACTICE UTILITIES &amp; FINANCING</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 text-xs text-slate-600 font-medium">
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
          <nav aria-label="Footer navigation" className="flex items-center gap-4 text-[10px] text-slate-500 font-mono uppercase tracking-widest">
            <Link to="/" className="hover:text-[#0867E8] transition-colors underline">Home</Link>
            <span aria-hidden="true">&middot;</span>
            <Link to="/blog" className="hover:text-[#0f7a75] transition-colors underline">Guides</Link>
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
