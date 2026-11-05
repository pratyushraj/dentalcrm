import React from 'react';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';
import { Truck, PackageCheck, Clock, MapPin, Zap } from 'lucide-react';

export default function ShippingPolicyPage() {
  return (
    <LegalPageLayout
      title="Shipping & Delivery Policy"
      subtitle="Fulfillment schedules, courier timelines, and delivery terms for Clinaza physical clinic welcome kits and digital platform access."
      canonicalPath="/shipping-policy"
    >
      <div className="space-y-6">
        <section>
          <h2 className="text-lg font-bold text-[#0B2450] mb-2">1. Overview</h2>
          <p>
            At <strong>CLINAZA</strong> (operated by <strong>MELLOWPRINTS</strong>), we deliver both digital platform access and physical point-of-care marketing kits to partner clinics across India. This Shipping &amp; Delivery Policy outlines our fulfillment timelines and courier standards.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#0B2450] mb-3">2. Digital vs. Physical Deliverables</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={18} className="text-blue-600" />
                <h3 className="font-bold text-[#0B2450] text-sm">Digital Platform Access</h3>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-xs text-slate-600">
                <li><strong>Delivery Mode:</strong> Online via email, SMS, and WhatsApp.</li>
                <li><strong>Timeline:</strong> Within <strong>24 to 48 hours</strong> of completing KYC and entity verification.</li>
                <li><strong>Includes:</strong> Clinic dashboard credentials, digital payment links, and dynamic QR setup.</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <PackageCheck size={18} className="text-emerald-600" />
                <h3 className="font-bold text-[#0B2450] text-sm">Physical Clinic Starter Kit</h3>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-xs text-slate-600">
                <li><strong>Delivery Mode:</strong> Premium express surface/air courier.</li>
                <li><strong>Timeline:</strong> Delivered in <strong>4 to 7 business days</strong> pan-India.</li>
                <li><strong>Includes:</strong> Customized heavy-duty acrylic reception standee with clinic QR, patient brochures, and reception table-tops.</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#0B2450] mb-2">3. Shipping Timelines &amp; Dispatch</h2>
          <ul className="list-disc pl-5 mt-2 space-y-1.5 text-sm">
            <li><strong>Dispatch Window:</strong> All physical orders are customized with clinic details and handed over to our courier partner within <strong>24 to 48 hours</strong> of payment confirmation.</li>
            <li><strong>Delivery Timeline:</strong>
              <ul className="list-circle pl-5 mt-1 space-y-1 text-xs text-slate-600">
                <li><strong>Metro Cities (Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata):</strong> 3 to 5 business days.</li>
                <li><strong>Tier-2 &amp; Tier-3 Cities &amp; Rest of India:</strong> 5 to 7 business days.</li>
              </ul>
            </li>
            <li><strong>Courier Partners:</strong> We ship exclusively through insured national courier networks including <strong>Blue Dart, Delhivery, DTDC, and India Post Speed Post</strong>.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#0B2450] mb-2">4. Shipping Charges</h2>
          <p>
            <strong>Free Pan-India Shipping:</strong> All shipping and packaging costs for the Clinic Activation Kit (₹999) are fully borne by Clinaza. There are no additional shipping fees, fuel surcharges, or hidden delivery costs at the time of delivery.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#0B2450] mb-2">5. Live Shipment Tracking</h2>
          <p>
            As soon as your package is dispatched from our fulfillment facility, a live tracking number and courier tracking link will be shared with the registered clinic mobile number via <strong>WhatsApp and SMS</strong>. You can monitor your shipment's transit status in real time.
          </p>
        </section>

        <section className="p-4 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-600">
          <p className="font-bold text-slate-800 mb-1">Delivery Address Changes or Assistance</p>
          <p>
            Need to update your clinic delivery address or track a delayed package? Reach our dispatch desk at <a href="mailto:contact@clinaza.in" className="text-blue-600 font-bold underline">contact@clinaza.in</a> or call <a href="tel:+917292984244" className="text-blue-600 font-bold underline">+91 7292984244</a>.
          </p>
        </section>
      </div>
    </LegalPageLayout>
  );
}
