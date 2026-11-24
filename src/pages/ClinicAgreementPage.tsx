import React from 'react';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';
import { Download, FileText, CheckCircle2, ShieldCheck, ExternalLink } from 'lucide-react';

export default function ClinicAgreementPage() {
  return (
    <LegalPageLayout
      title="Clinic Master Services & Sub-Merchant Agreement"
      subtitle="Standard bilateral master terms and conditions governing clinic onboarding, sub-merchant MID mapping, point-of-care payment aggregation, and patient EMI settlements."
      canonicalPath="/clinic-agreement"
      lastUpdated="November 17, 2026"
    >
      <div className="space-y-8 text-slate-700 leading-relaxed">
        {/* Document Download Banners */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 uppercase tracking-wider mb-2">
                Official Compliance Document
              </span>
              <h3 className="text-base font-bold text-[#0B2450]">
                Sub-Merchant Onboarding &amp; Master Services Agreement (MSA)
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Vetted under RBI Payment Aggregator Guidelines (DPSS.CO.PD.No.1810/02.14.008/2019-20) and Section 10A of the Information Technology Act, 2000.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href="/docs/Clinaza_Clinic_Sub_Merchant_Master_Services_Agreement.pdf"
                download="Clinaza_Clinic_Sub_Merchant_Agreement.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#0867E8] text-white hover:bg-blue-700 shadow-sm transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                Download Agreement (PDF)
              </a>
              <a
                href="/docs/Clinaza_Sample_Executed_Pilot_Clinic_Agreement.pdf"
                download="Clinaza_Sample_Executed_Pilot_Agreement.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-slate-700 hover:text-blue-700 border border-slate-300 hover:border-blue-400 shadow-sm transition-all"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                Sample Executed Copy (PDF)
              </a>
            </div>
          </div>
        </div>

        {/* Section 1: Parties */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#0B2450] flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-black flex items-center justify-center">1</span>
            Parties &amp; Corporate Identity
          </h2>
          <p>
            This Clinic Master Services &amp; Sub-Merchant Onboarding Agreement (the <strong>"Agreement"</strong>) constitutes a legally binding contract entered into between:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <span className="font-bold text-[#0867E8] uppercase tracking-wider block">First Part • Technology &amp; Merchant Aggregator</span>
              <p className="font-bold text-slate-900 text-sm">MELLOWPRINTS (Brand: CLINAZA)</p>
              <p><strong>Entity Type:</strong> Sole Proprietorship</p>
              <p><strong>GSTIN:</strong> 10DXRPR3052Q1ZV</p>
              <p><strong>Udyam Registration:</strong> UDYAM-BR-26-0005161</p>
              <p><strong>Registered Office:</strong> Sharma Sadan, Road No-1, Mahesh Nagar, S.K. Puri / P.O. Keshri Nagar, Patna, Bihar - 800024, India.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <span className="font-bold text-emerald-700 uppercase tracking-wider block">Second Part • Sub-Merchant / Partner Clinic</span>
              <p className="font-bold text-slate-900 text-sm">THE REGISTERED DENTAL CLINIC / HEALTHCARE ENTITY</p>
              <p>Represented by its Proprietor, Partner, Director, or Registered Dental Surgeon holding an unencumbered registration from the Dental Council of India (DCI) or relevant State Dental Council, whose details are recorded during clinic onboarding.</p>
            </div>
          </div>
        </section>

        {/* Section 2: Recitals & Authorization */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#0B2450] flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-black flex items-center justify-center">2</span>
            Sub-Merchant Appointment &amp; Payment Gateway Mapping
          </h2>
          <p>
            Clinaza operates a proprietary healthcare fintech, patient financing facilitation, and clinic practice management platform. Clinaza has established payment aggregation and routing infrastructure powered by authorized Payment Aggregators and Gateways (including <strong>Plural by Pine Labs</strong>) and RBI-regulated Scheduled Commercial Banks and NBFCs.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>
              <strong>Sub-MID Mapping:</strong> The Partner Clinic expressly appoints Clinaza as its Technology Facilitator and Merchant Aggregator, authorizing Clinaza and its authorized Payment Aggregator partners to board the Clinic as an authorized <strong>Sub-Merchant</strong> under Clinaza's Master Merchant ID (Master MID).
            </li>
            <li>
              <strong>Escrow / Nodal Collection:</strong> The Partner Clinic authorizes the Payment Aggregator, as the RBI-licensed Payment Aggregator, to collect, process, hold in settlement nodal/escrow accounts, and remit patient payments and loan proceeds directly to the Partner Clinic's verified bank account.
            </li>
            <li>
              <strong>LSP Conduit Role:</strong> Clinaza acts solely as a Lending Service Provider (LSP) and technology facilitator. Clinaza does not disburse credit or loans on its own balance sheet. All loan facilities, interest rates, Key Fact Statements (KFS), and approval decisions are granted solely by partner RBI-regulated lending institutions.
            </li>
          </ul>
        </section>

        {/* Section 3: Commercials Table */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#0B2450] flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-black flex items-center justify-center">3</span>
            Commercial Terms &amp; Settlement Mechanics (Schedule A)
          </h2>
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-800 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3">Commercial Component</th>
                  <th className="p-3">Rate / Fee</th>
                  <th className="p-3">Settlement / Payout Terms</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-semibold text-slate-900">Digital Desk Activation &amp; Underwriting Setup</td>
                  <td className="p-3">₹999 (One-time, all-inclusive)</td>
                  <td className="p-3 text-slate-600">Includes doctor KYC verification, underwriting desk processing, and multi-bank lending gateway setup.</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-semibold text-slate-900">Annual Maintenance Charges (AMC)</td>
                  <td className="p-3 font-bold text-emerald-700">₹0 (Lifetime Zero AMC)</td>
                  <td className="p-3 text-slate-600">Zero recurring hardware rentals or annual platform dues.</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-semibold text-slate-900">Counter UPI Collections (Dynamic QR / Link)</td>
                  <td className="p-3 font-bold text-emerald-700">0.00% Clinic Deduction (Patient Convenience Mode) OR 0.75% MDR (Clinic-Borne)</td>
                  <td className="p-3 text-slate-600">Default: Clinic receives 100% full net payout on T+1; standard ₹19–₹49 patient digital fee covers 0.40% gateway processing &amp; reconciliation.</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-semibold text-slate-900">Debit Cards (Visa / Mastercard)</td>
                  <td className="p-3 font-semibold text-slate-800">1.35% MDR</td>
                  <td className="p-3 text-slate-600">Deducted at source on T+1 settlement.</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-semibold text-slate-900">Credit Cards (Non-EMI Full Payment)</td>
                  <td className="p-3 font-semibold text-slate-800">2.35% MDR</td>
                  <td className="p-3 text-slate-600">Deducted at source on T+1 settlement.</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-semibold text-slate-900">Patient Financing Platform MDR</td>
                  <td className="p-3 font-bold text-slate-900">3.00% MDR</td>
                  <td className="p-3 text-slate-600">Standard platform &amp; payment gateway MDR deducted at source on T+1 loan disbursement.</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-semibold text-slate-900">Patient Interest Rate</td>
                  <td className="p-3 font-bold text-blue-700">1.00% – 1.50% / month (Reducing)</td>
                  <td className="p-3 text-slate-600">Determined dynamically by partner banks &amp; NBFCs based on patient CIBIL score &amp; income profile.</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-semibold text-slate-900">Model 1: Patient-Borne Interest (Standard EMI)</td>
                  <td className="p-3 font-semibold text-emerald-700">Clinic has no patient-interest liability; patient terms are set by the lender</td>
                  <td className="p-3 text-slate-600">Clinic receives 100% treatment invoice value (less standard 3% MDR) on guaranteed T+1 settlement.</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-semibold text-slate-900">Model 2: Clinic-Subvented Interest (No-Cost EMI)</td>
                  <td className="p-3 font-semibold text-indigo-700">Clinic may sponsor a lender-approved promotional subvention</td>
                  <td className="p-3 text-slate-600">Clinic receives net invoice payout (less subvention discount + 3% MDR) on guaranteed T+1 settlement.</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-semibold text-slate-900">Settlement Payout Cycle</td>
                  <td className="p-3 font-bold text-[#0867E8]">T+1 Business Day</td>
                  <td className="p-3 text-slate-600">Net settlement to the verified clinic account after successful processing and underwriting activation.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4: Clinic Obligations */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#0B2450] flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-black flex items-center justify-center">4</span>
            Clinic Partner Obligations &amp; Compliance Standards
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-sm">
            <li><strong>Medical Qualifications:</strong> The Partner Clinic warrants that all clinical dental procedures are performed by qualified practitioners holding valid registrations from the Dental Council of India (DCI) or State Dental Council.</li>
            <li><strong>Bona Fide Services:</strong> All payment requests, QR scans, and EMI disbursements must correspond solely to genuine clinical, surgical, orthodontic, prosthodontic, or diagnostic services rendered to real patients.</li>
            <li><strong>No Cash Surcharges:</strong> The Partner Clinic covenants not to levy additional surcharges or pass transaction fees unlawfully onto patients using digital payment methods.</li>
            <li><strong>KYC Maintenance:</strong> The Partner Clinic agrees to provide its PAN, GSTIN (if applicable), proof of clinic premises, cancelled cheque, and practitioner registration certificate for Sub-MID mapping.</li>
          </ul>
        </section>

        {/* Section 5: Chargebacks & Disputes */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#0B2450] flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-black flex items-center justify-center">5</span>
            Disputes, Refunds &amp; Chargeback Indemnity
          </h2>
          <p className="text-sm">
            Clinaza and Pine Labs Plural provide digital settlement and financing infrastructure and do not intervene in medical, surgical, or clinical disputes between practitioners and patients. The Partner Clinic shall remain solely liable for treatment completion. In the event of a customer dispute or card network chargeback, the Partner Clinic agrees to furnish clinical documentation (patient consent, treatment records) within two (2) business days. Any legitimate chargeback resulting from failure of clinic delivery may be set off against subsequent settlement proceeds.
          </p>
        </section>

        {/* Section 6: Data Protection */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#0B2450] flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-black flex items-center justify-center">6</span>
            Data Privacy &amp; Statutory Compliance (DPDP Act 2023)
          </h2>
          <p className="text-sm">
            Both Parties covenant to process patient personal and health data in compliance with the Digital Personal Data Protection Act, 2023 (DPDP Act) and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011. Cardholder payment credentials are never stored on local clinic machines and are routed through RBI Tokenization-compliant, PCI-DSS certified payment rails.
          </p>
        </section>

        {/* Section 7: Validity & Electronic Acceptance */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#0B2450] flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-black flex items-center justify-center">7</span>
            Electronic Execution &amp; Governing Jurisdiction
          </h2>
          <p className="text-sm">
            In accordance with <strong>Section 10A of the Information Technology Act, 2000</strong>, this Agreement is validly executed when accepted electronically by the Partner Clinic during online onboarding, or when executed physically via bilateral signature. This Agreement shall be governed by the laws of the Republic of India, and the competent courts at <strong>Patna, Bihar</strong> shall have exclusive jurisdiction over all disputes arising hereunder.
          </p>
        </section>

        {/* Download Footer */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            For legal inquiries, tripartite executions, or compliance audits, contact our Grievance Redressal Officer at{' '}
            <a href="mailto:contact@clinaza.in" className="text-blue-600 underline font-semibold">contact@clinaza.in</a>.
          </p>
          <a
            href="/docs/Clinaza_Clinic_Sub_Merchant_Master_Services_Agreement.pdf"
            download
            className="inline-flex items-center gap-2 text-xs font-bold text-[#0867E8] hover:underline"
          >
            <Download className="w-3.5 h-3.5" />
            Download Clean Agreement Template
          </a>
        </div>
      </div>
    </LegalPageLayout>
  );
}
