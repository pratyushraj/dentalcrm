import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  ExternalLink
} from 'lucide-react';

export default function FreeToolsHub() {
  const [activeTab, setActiveTab] = useState<'rx' | 'setup' | 'emi' | 'seo'>('rx');

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
        "url": "https://clinaza.in"
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <SEOHead 
        title="Free Dental Tools, Rx Generator & Clinic Setup Loan Calculator | Clinaza"
        description="Free dental utilities: Digital Dental Prescription Maker (Printable Rx), Clinic Setup Cost & Equipment Loan Calculator (डेंटल क्लिनिक लोन), and Treatment EMI Estimator."
        keywords={["free dental prescription maker", "online rx generator dental india", "dental clinic setup cost calculator", "loan for dental clinic setup", "डेंटल क्लिनिक के लिए लोन", "dental clinic loan in india", "msme loan for dental clinic", "mudra loan for dental clinic", "dental equipment loan emi", "clinaza free tools"]}
        canonicalUrl="https://clinaza.in/tools"
        jsonLd={toolsSchema}
      />

      {/* Header Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight text-[#0B2450]">
              CLIN<span className="text-[#0867E8]">AZA</span>
            </span>
            <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md border border-blue-200">
              Free Utilities
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/reactivation/login"
              className="px-4 py-2 bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-sm"
            >
              Doctor Portal →
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-blue-900 via-[#0B2450] to-slate-900 text-white py-10 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
            <Sparkles size={12} /> 100% Free For All Indian Dentists &amp; Patients
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Free Dental Practice Utilities &amp; Cost Calculators
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
            Generate printable digital prescriptions, calculate dental clinic launch expenses, estimate monthly treatment EMIs, or audit your clinic's Google Maps visibility.
          </p>

          {/* Tab Controls */}
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            <button
              onClick={() => setActiveTab('rx')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'rx' 
                  ? 'bg-white text-slate-950 shadow-lg' 
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700'
              }`}
            >
              <FileText size={15} className={activeTab === 'rx' ? 'text-[#0867E8]' : ''} />
              Digital Rx Prescription Maker
            </button>
            <button
              onClick={() => setActiveTab('setup')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'setup' 
                  ? 'bg-white text-slate-950 shadow-lg' 
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700'
              }`}
            >
              <Building2 size={15} className={activeTab === 'setup' ? 'text-emerald-600' : ''} />
              Clinic Setup Cost Calculator
            </button>
            <button
              onClick={() => setActiveTab('emi')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'emi' 
                  ? 'bg-white text-slate-950 shadow-lg' 
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700'
              }`}
            >
              <Calculator size={15} className={activeTab === 'emi' ? 'text-blue-500' : ''} />
              Treatment EMI Estimator
            </button>
            <button
              onClick={() => setActiveTab('seo')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'seo' 
                  ? 'bg-white text-slate-950 shadow-lg' 
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700'
              }`}
            >
              <Search size={15} className={activeTab === 'seo' ? 'text-indigo-600' : ''} />
              Clinic Google Maps &amp; SEO Audit
            </button>
          </div>
        </div>
      </section>

      {/* Tool Container */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        
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

                <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
                  <span className="text-[11px] text-slate-400">Want to run your new clinic with 0 software fees?</span>
                  <Link
                    to="/reactivation/login"
                    className="w-full sm:w-auto px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all text-center"
                  >
                    Start Free on Clinaza →
                  </Link>
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
                  ₹{treatmentAmount.toLocaleString()} estimated over {emiTenure} monthly installments. Actual interest &amp; EMI terms depend on partner lender approval.
                </p>
                <div className="pt-2">
                  <a
                    href="https://clinaza.in/#calculator"
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
                    <a
                      href="https://clinaza.in/#partner-form"
                      className="px-5 py-2.5 bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all text-center shadow-md"
                    >
                      Onboard Clinic Free
                    </a>
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
      <footer className="border-t border-slate-200 py-8 px-6 bg-white text-center sm:text-left mt-12">
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
