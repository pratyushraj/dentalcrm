import React from 'react';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      subtitle="How Clinaza and Mellowprints collect, process, store, and safeguard your personal, financial, and clinical data in compliance with Indian privacy laws."
      canonicalPath="/privacy"
    >
      <div className="space-y-6">
        <section>
          <h2 className="text-lg font-bold text-[#0B2450] mb-2">1. Overview &amp; Commitment</h2>
          <p>
            This Privacy Policy describes how <strong>CLINAZA</strong> (operated by <strong>MELLOWPRINTS</strong>, GSTIN: 10DXRPR3052Q1ZV, Patna, Bihar, India) collects, uses, and safeguards personal data obtained from doctors, clinic staff, and patients through our website (<a href="https://www.clinaza.in" className="text-blue-600 underline">www.clinaza.in</a>), software applications, and healthcare checkout interfaces.
          </p>
          <p className="mt-2">
            We are fully committed to protecting your privacy in compliance with the <strong>Information Technology Act, 2000</strong>, the <strong>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</strong>, the <strong>Digital Personal Data Protection Act, 2023 (DPDPA)</strong>, and the <strong>Reserve Bank of India (RBI) Digital Lending Guidelines</strong>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#0B2450] mb-2">2. Information We Collect</h2>
          <p>Depending on whether you are a partner healthcare professional or a patient, we may collect:</p>
          <div className="mt-3 grid sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <h3 className="font-bold text-[#0B2450] text-xs uppercase tracking-wide mb-1.5">For Clinics &amp; Doctors</h3>
              <ul className="list-disc pl-4 space-y-1 text-xs">
                <li>Doctor Full Name, Mobile Number, and Email ID.</li>
                <li>Clinic Name, Physical Clinic Address, and Geographic Location.</li>
                <li>State Dental Council or DCI Registration Number.</li>
                <li>Entity PAN, GSTIN, and Bank Account details for settlement.</li>
              </ul>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <h3 className="font-bold text-[#0B2450] text-xs uppercase tracking-wide mb-1.5">For Patients (Financing Flows)</h3>
              <ul className="list-disc pl-4 space-y-1 text-xs">
                <li>Patient Full Name, Mobile Number, and Residential PIN code.</li>
                <li>Permanent Account Number (PAN) for real-time eligibility check.</li>
                <li>Consensual financial verification via RBI-regulated Account Aggregators.</li>
                <li>Treatment category and billed invoice amount.</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#0B2450] mb-2">3. Purpose &amp; Use of Information</h2>
          <p>We use the collected information solely for legitimate operational and regulatory purposes, including:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Facilitating point-of-care loan eligibility evaluations with partner Banks and NBFCs.</li>
            <li>Enabling instant Aadhaar-based paperless e-KYC and digital mandate creation (UPI AutoPay / eNACH).</li>
            <li>Processing clinic payouts and generating automated reconciliation statements.</li>
            <li>Delivering physical Welcome &amp; Activation Kits to verified clinic addresses.</li>
            <li>Sending critical transactional updates via SMS, WhatsApp, or Email.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#0B2450] mb-2">4. Data Sharing &amp; Third-Party Disclosure</h2>
          <p>
            <strong>We do not sell, rent, or trade your personal data to any third-party advertisers.</strong>
          </p>
          <p className="mt-2">Data is shared strictly on a need-to-know basis with:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Regulated Lending Entities (REs):</strong> Partner Banks and NBFCs (such as Bajaj Finance Ltd, Piramal Finance, Tata Capital, L&amp;T Finance) for credit assessment, underwriting, and loan issuance as mandated by RBI.</li>
            <li><strong>Licensed Payment Aggregators:</strong> Authorized entities (such as Razorpay and Pine Labs Plural) to securely process payment transactions.</li>
            <li><strong>Statutory &amp; Law Enforcement Authorities:</strong> When required by applicable Indian laws or judicial orders.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#0B2450] mb-2">5. Data Security &amp; Storage</h2>
          <p>
            All data in transit is encrypted using industry-standard <strong>256-bit Secure Socket Layer (SSL/TLS)</strong> encryption. Credit card data is never stored on our servers and is processed exclusively via PCI-DSS Level 1 compliant payment gateways. User servers and databases are housed within Tier-4 secure cloud data centers located physically within the territory of India in accordance with RBI data localization mandates.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#0B2450] mb-2">6. Grievance Redressal Officer</h2>
          <p>
            In compliance with the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023, the details of the designated Grievance Officer are provided below:
          </p>
          <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
            <p><strong>Name:</strong> Pratyush Raj</p>
            <p><strong>Designation:</strong> Data Protection &amp; Grievance Officer</p>
            <p><strong>Entity:</strong> Mellowprints (Brand: CLINAZA)</p>
            <p><strong>Address:</strong> Sharma Sadan, Road No-1, Mahesh Nagar, S.K. Puri, Patna, Bihar - 800024, India</p>
            <p><strong>Email:</strong> <a href="mailto:contact@clinaza.in" className="text-blue-600 font-medium">contact@clinaza.in</a></p>
            <p><strong>Helpline:</strong> <a href="tel:+917292984244" className="text-blue-600 font-medium">+91 7292984244</a></p>
            <p className="text-slate-400 mt-1">We acknowledge grievances within 24 hours and resolve them within 15 working days.</p>
          </div>
        </section>
      </div>
    </LegalPageLayout>
  );
}
