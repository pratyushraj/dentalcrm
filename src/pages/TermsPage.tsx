import React from 'react';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Terms of Service"
      subtitle="Comprehensive terms and conditions governing the use of Clinaza platform, clinic partnership programs, and healthcare payment technology."
      canonicalPath="/terms"
    >
      <div className="space-y-6">
        <section>
          <h2 className="text-lg font-bold text-[#0B2450] mb-2">1. Introduction &amp; Corporate Identity</h2>
          <p>
            Welcome to <strong>CLINAZA</strong> ("Platform", "we", "us", or "our"). Clinaza is a proprietary healthcare financing and clinic management technology platform owned and operated by <strong>MELLOWPRINTS</strong>, a sole proprietorship registered in India under GSTIN <strong>10DXRPR3052Q1ZV</strong> and Udyam Registration <strong>UDYAM-BR-26-0005161</strong>, with its principal office at <em>Sharma Sadan, Road No-1, Mahesh Nagar, S.K. Puri / P.O. Keshri Nagar, Patna, Bihar - 800024</em>.
          </p>
          <p className="mt-2">
            By accessing or using our website (<a href="https://www.clinaza.in" className="text-blue-600 underline">www.clinaza.in</a>), partnering with our clinic network, deploying our point-of-care financing links or QR codes, or ordering our Clinic Activation Kit, you acknowledge that you have read, understood, and agreed to be bound by these Terms of Service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#0B2450] mb-2">2. Scope of Services</h2>
          <p>Clinaza provides enterprise-grade digital infrastructure for dental clinics and medical practitioners across India, including:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Healthcare Financing Technology:</strong> Facilitating digital payment and point-of-care Equated Monthly Installment (EMI) options for patients seeking dental procedures.</li>
            <li><strong>Lending Service Provider (LSP) Operations:</strong> Acting as a technology conduit connecting clinics and patients to Reserve Bank of India (RBI)-regulated Scheduled Commercial Banks and Non-Banking Financial Companies (NBFCs).</li>
            <li><strong>Clinic Management &amp; Patient Workflow Tools:</strong> Providing prescription generation, appointment automation, and practice utility software.</li>
            <li><strong>Physical Clinic Welcome &amp; Activation Kits:</strong> Providing customized countertop acrylic QR standees, promotional materials, and front-desk enablement resources.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#0B2450] mb-2">3. Role as a Technology Platform (Non-Lender Disclaimer)</h2>
          <p>
            Clinaza is <strong>not a bank, Non-Banking Financial Company (NBFC), or financial institution</strong>. We do not underwrite, originate, or disburse loans on our own balance sheet. All loan facilities, credit approvals, interest rates, tenures, and Key Fact Statements (KFS) are granted and determined solely by our partner RBI-regulated lending institutions (including but not limited to Bajaj Finance Ltd, Piramal Finance, Tata Capital, L&amp;T Finance, and partner banks).
          </p>
          <p className="mt-2">
            Clinaza adheres strictly to the Reserve Bank of India's Digital Lending Guidelines, ensuring 100% transparent borrower disclosure, zero undisclosed fees, and direct loan disbursement into the verified merchant/clinic settlement account.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#0B2450] mb-2">4. Clinic Partner Obligations &amp; Compliance</h2>
          <p>Partner clinics agree to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Hold valid, unencumbered medical or dental registrations from the Dental Council of India (DCI) or relevant State Dental/Medical Council.</li>
            <li>Submit authentic Know Your Customer (KYC) documentation, bank account proof for settlement, and entity credentials upon onboarding.</li>
            <li>Render professional clinical treatments to patients with standard medical due care and honor scheduled appointments.</li>
            <li>Refrain from charging duplicate or surcharged cash fees to patients who utilize digital EMI channels.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#0B2450] mb-2">5. Commercial Terms &amp; Settlement</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Clinic Activation Kit:</strong> A one-time activation and hardware kit fee of <strong>₹999</strong> (inclusive of taxes and pan-India shipping) covers physical reception standees, setup, and dedicated partner management.</li>
            <li><strong>Zero Annual Maintenance Charges (AMC):</strong> Clinics are not subject to recurring monthly hardware rental fees or unexpected annual maintenance dues.</li>
            <li><strong>Merchant Discount Rate (MDR):</strong> Transactions processed through digital channels are subject to standard payment gateway and affordability MDR as specified in the merchant onboarding schedule (typically 1.85% to 2.10% for card transactions, or zero clinic deduction when patient-borne convenience mode is selected).</li>
            <li><strong>Payout Timeline:</strong> Approved treatment funds are settled directly into the clinic's registered current/savings bank account on a standard <strong>T+1 / T+2 business day schedule</strong>.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#0B2450] mb-2">6. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by Indian law, Mellowprints and Clinaza shall not be liable for any indirect, incidental, or consequential damages resulting from clinical disputes between patients and practitioners, patient loan rejections by partner NBFCs, or temporary internet gateway downtime beyond our reasonable control.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#0B2450] mb-2">7. Governing Law &amp; Jurisdiction</h2>
          <p>
            These Terms of Service are governed by and construed in accordance with the laws of the Republic of India. In the event of any dispute, controversy, or claim arising out of or relating to these terms, the competent courts at <strong>Patna, Bihar, India</strong> shall have exclusive jurisdiction.
          </p>
        </section>

        <section className="pt-4 border-t border-slate-200">
          <h3 className="font-bold text-[#0B2450] mb-1">Questions or Formal Inquiries?</h3>
          <p className="text-xs text-slate-500">
            For contractual inquiries, contact our Legal Secretariat at <a href="mailto:contact@clinaza.in" className="text-blue-600 font-medium">contact@clinaza.in</a> or by post at: Mellowprints (Clinaza), Sharma Sadan, Road No-1, Mahesh Nagar, Patna, Bihar - 800024.
          </p>
        </section>
      </div>
    </LegalPageLayout>
  );
}
