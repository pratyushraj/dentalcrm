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
  ArrowRight
} from 'lucide-react';

export default function FreeToolsHub() {
  const [activeTab, setActiveTab] = useState<'rx' | 'setup' | 'emi'>('rx');

  // --- Rx Maker State ---
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SEOHead 
        title="Free Dental Tools & Calculators — Rx Maker, Setup Cost & Medical EMI Calculator | Clinaza"
        description="Free online utility tools for dentists and patients in India: Digital Dental Prescription Maker (Printable Rx), Clinic Setup Cost Estimator, and Treatment Monthly EMI Calculator."
        keywords={["free dental prescription maker", "online rx generator dental india", "dental clinic setup cost calculator", "dental emi calculator", "medical treatment emi calculator", "clinaza free tools"]}
        canonicalUrl="https://clinaza.in/tools"
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
            Generate printable digital prescriptions, calculate dental clinic launch expenses, or estimate 0% treatment EMIs instantly.
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
              Treatment 0% EMI Estimator
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

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-600 font-bold mb-1">Patient Name</label>
                      <input
                        type="text"
                        value={rxData.patientName}
                        onChange={(e) => setRxData({ ...rxData, patientName: e.target.value })}
                        className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-bold mb-1">Age / Gender</label>
                      <input
                        type="text"
                        value={`${rxData.patientAge} / ${rxData.patientGender}`}
                        onChange={(e) => {
                          const [age, gender] = e.target.value.split('/');
                          setRxData({ ...rxData, patientAge: age?.trim() || '30', patientGender: gender?.trim() || 'M' });
                        }}
                        className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                      />
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
                        className="text-[#0867E8] hover:underline font-bold text-[10px] flex items-center gap-1"
                      >
                        <Plus size={12} /> Add Drug
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
                            className="w-full p-1.5 bg-white border border-slate-200 rounded text-xs font-semibold"
                          />
                          <button
                            onClick={() => removeMedicine(idx)}
                            className="text-red-500 hover:text-red-700 p-1 shrink-0"
                          >
                            <Trash2 size={13} />
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

      </main>
    </div>
  );
}
