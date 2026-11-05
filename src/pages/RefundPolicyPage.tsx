import React from 'react';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';
import { Clock, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function RefundPolicyPage() {
  return (
    <LegalPageLayout
      title="Cancellation & Refund Policy"
      subtitle="Clear, transparent terms regarding order cancellations, physical kit returns, and refund processing timelines for Clinaza partner clinics and users."
      canonicalPath="/refund-policy"
    >
      <div className="space-y-6">
        <section>
          <h2 className="text-lg font-bold text-[#0B2450] mb-2">1. Overview</h2>
          <p>
            At <strong>CLINAZA</strong> (operated by <strong>MELLOWPRINTS</strong>, Patna, Bihar), we strive to provide seamless software access and premium clinic onboarding kits. This Cancellation and Refund Policy outlines the terms under which cancellations and refunds are granted for our products and services.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#0B2450] mb-2">2. Clinic Activation Kit (₹999) — Cancellation &amp; Returns</h2>
          <div className="space-y-3 mt-2">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <h3 className="font-bold text-[#0B2450] text-sm flex items-center gap-2">
                <Clock size={16} className="text-blue-600" />
                <span>Pre-Dispatch Cancellation (Within 24 Hours)</span>
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                You may cancel your Clinic Activation Kit order within <strong>24 hours of payment</strong> or prior to courier dispatch (whichever is earlier). A <strong>100% full refund</strong> will be initiated immediately with zero cancellation deductions.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <h3 className="font-bold text-[#0B2450] text-sm flex items-center gap-2">
                <RefreshCw size={16} className="text-emerald-600" />
                <span>Damaged, Defective, or Incorrect Physical Standees</span>
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                If your physical reception standee or promotional material arrives cracked, damaged in transit, or printed with incorrect clinic details, please notify us within <strong>7 days of delivery</strong> with photos at <a href="mailto:contact@clinaza.in" className="text-blue-600 underline">contact@clinaza.in</a>. We will dispatch a <strong>free brand-new replacement kit within 48 hours</strong> or process a complete refund if preferred.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#0B2450] mb-2">3. Refund Processing Timeline</h2>
          <p>
            Once a refund request is approved by our billing team:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1.5 text-sm">
            <li><strong>Initiation:</strong> The refund will be initiated within <strong>24 to 48 hours</strong> of verification.</li>
            <li><strong>Credit to Original Payment Method:</strong> Funds will be credited directly back to the original source (Credit Card, Debit Card, Net Banking, or UPI account) within <strong>5 to 7 business days</strong>, depending on your issuing bank's settlement cycle.</li>
            <li><strong>Zero Hidden Fees:</strong> No hidden processing or administrative deductions are levied on approved refunds.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#0B2450] mb-2">4. Patient Treatment Financing Transactions</h2>
          <p>
            For patient loan disbursals and financing transactions:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-xs">
            <li>Once a patient loan is approved, executed, and settled to the clinic for medical treatment rendered, cancellations or treatment revisions are governed by the clinic's internal medical consultation policies and the respective lending partner's loan foreclosure procedures.</li>
            <li>If a treatment is cancelled by mutual doctor-patient agreement prior to procedure execution, the clinic may initiate a loan cancellation or refund to the lending institution via our merchant dashboard, following RBI guidelines.</li>
          </ul>
        </section>

        <section className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <h3 className="font-bold text-blue-900 text-sm mb-1 flex items-center gap-1.5">
            <CheckCircle2 size={16} className="text-blue-600" />
            <span>How to Request a Cancellation or Refund</span>
          </h3>
          <p className="text-xs text-blue-800 leading-relaxed">
            Simply send an email to <a href="mailto:contact@clinaza.in" className="font-bold underline">contact@clinaza.in</a> or message our official WhatsApp helpline at <a href="tel:+917292984244" className="font-bold underline">+91 7292984244</a> with your Order ID, Clinic Name, and payment receipt. Our support team will confirm your refund ticket within 4 hours.
          </p>
        </section>
      </div>
    </LegalPageLayout>
  );
}
