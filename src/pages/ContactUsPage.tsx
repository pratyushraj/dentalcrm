import React, { useState } from 'react';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';
import { Mail, Phone, MapPin, Building2, Clock, ShieldCheck, Send, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    clinicName: '',
    subject: 'Clinic Partnership / Activation Kit',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate lightweight submission
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <LegalPageLayout
      title="Contact Us & Support Secretariat"
      subtitle="Reach out to Clinaza's operations, clinic onboarding desk, or regulatory secretariat. We are here to support doctors and patients across India."
      canonicalPath="/contact"
    >
      <div className="space-y-8">
        {/* Intro */}
        <section>
          <p className="text-slate-600 leading-relaxed">
            Have questions about partnering with Clinaza, our <strong>₹999 Clinic Activation Kit</strong>, patient healthcare EMI integration, or need help with a transaction? Get in touch with our operations team via phone, email, WhatsApp, or through the direct contact form below.
          </p>
        </section>

        {/* Official Entity & Contact Grid */}
        <div className="grid md:grid-cols-2 gap-5 not-prose">
          {/* Registered Office Box */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2.5 text-[#0B2450]">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <MapPin size={18} />
              </div>
              <h2 className="font-extrabold text-sm sm:text-base text-[#0B2450]">Registered Principal Office</h2>
            </div>
            <div className="text-xs text-slate-600 space-y-1.5 pl-1">
              <p className="font-bold text-slate-800 text-sm">MELLOWPRINTS (Brand: CLINAZA)</p>
              <p className="leading-relaxed">
                Sharma Sadan, Road No-1, Mahesh Nagar,<br />
                S.K. Puri / P.O. Keshri Nagar,<br />
                Patna, Bihar &ndash; 800024, India.
              </p>
              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 space-y-0.5">
                <p><strong>GSTIN:</strong> 10DXRPR3052Q1ZV</p>
                <p><strong>Udyam Registration:</strong> UDYAM-BR-26-0005161</p>
                <p><strong>Proprietor:</strong> Pratyush Raj</p>
              </div>
            </div>
          </div>

          {/* Direct Communication Channels */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2.5 text-[#0B2450]">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Phone size={18} />
              </div>
              <h2 className="font-extrabold text-sm sm:text-base text-[#0B2450]">Direct Helpline &amp; Desk</h2>
            </div>
            <div className="text-xs text-slate-600 space-y-3 pl-1">
              <div>
                <span className="font-semibold text-slate-700 block">Clinic Partnerships &amp; Support:</span>
                <a
                  href="tel:+917292984244"
                  className="text-sm font-bold text-[#0867E8] hover:underline flex items-center gap-1.5 mt-0.5"
                >
                  +91 7292984244
                </a>
                <span className="text-[11px] text-slate-400">Available on Call &amp; WhatsApp Business</span>
              </div>

              <div>
                <span className="font-semibold text-slate-700 block">General &amp; Legal Inquiries:</span>
                <a
                  href="mailto:contact@clinaza.in"
                  className="text-sm font-bold text-[#0867E8] hover:underline flex items-center gap-1.5 mt-0.5"
                >
                  contact@clinaza.in
                </a>
              </div>

              <div className="flex items-start gap-2 pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                <Clock size={14} className="text-slate-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Operating Hours:</strong> Monday &ndash; Saturday, 9:30 AM &ndash; 6:30 PM IST (Excluding Public Holidays)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Section */}
        <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 not-prose">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-3">
              <MessageSquare size={13} />
              <span>Direct Inquiry Form</span>
            </div>
            <h2 className="text-xl font-bold text-[#0B2450] mb-2">Send Us a Direct Message</h2>
            <p className="text-xs text-slate-600 mb-6">
              Fill out the form below. Our clinic operations team typically responds within 2 to 4 business hours.
            </p>

            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                <CheckCircle2 size={36} className="text-emerald-600 mx-auto" />
                <h3 className="font-bold text-emerald-900 text-base">Inquiry Received Successfully!</h3>
                <p className="text-xs text-emerald-700 max-w-md mx-auto">
                  Thank you for contacting Clinaza. Our clinic partnerships manager will connect with you shortly on <strong>{formData.phone || formData.email}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', clinicName: '', subject: 'Clinic Partnership / Activation Kit', message: '' }); }}
                  className="mt-3 inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Dr. Rajesh Sharma"
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mobile / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="doctor@clinic.com"
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Clinic Name &amp; City (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.clinicName}
                      onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                      placeholder="Sharma Dental Clinic, Patna"
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Subject / Area of Inquiry *
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                  >
                    <option value="Clinic Partnership / Activation Kit">Clinic Partnership &amp; Activation Kit (₹999)</option>
                    <option value="Healthcare EMI Integration">Healthcare EMI &amp; Pine Labs/PayU Setup</option>
                    <option value="Billing & Payment Inquiries">Billing, Settlement &amp; Payment Inquiries</option>
                    <option value="Patient Support">Patient EMI Application Assistance</option>
                    <option value="Grievance / Regulatory">Regulatory / Grievance Redressal</option>
                    <option value="Other">Other Query</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Message / Query Details *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us how we can help your clinic or address your query..."
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0B2450] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-50"
                >
                  <Send size={14} />
                  <span>{submitting ? 'Sending Inquiry...' : 'Submit Inquiry'}</span>
                </button>
              </form>
            )}
          </div>
        </section>

        {/* RBI Grievance Redressal Mechanism */}
        <section className="border-t border-slate-200 pt-6">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck size={20} className="text-[#0B2450]" />
            <h2 className="text-lg font-bold text-[#0B2450]">Grievance Redressal Officer (RBI Guidelines)</h2>
          </div>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-3">
            In compliance with the <strong>Reserve Bank of India (RBI) Digital Lending Directions</strong> and the <strong>Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021</strong>, Clinaza has designated a Grievance Redressal Officer to address customer and partner complaints:
          </p>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5 text-slate-700 max-w-xl">
            <p><strong>Officer Name:</strong> Pratyush Raj</p>
            <p><strong>Designation:</strong> Compliance &amp; Operations Head, Clinaza (Mellowprints)</p>
            <p><strong>Office Address:</strong> Sharma Sadan, Road No-1, Mahesh Nagar, S.K. Puri, Patna, Bihar &ndash; 800024</p>
            <p><strong>Direct Grievance Email:</strong> <a href="mailto:contact@clinaza.in" className="text-blue-600 font-bold underline">contact@clinaza.in</a></p>
            <p><strong>Direct Grievance Phone:</strong> <a href="tel:+917292984244" className="text-blue-600 font-bold underline">+91 7292984244</a></p>
            <p className="pt-1 text-[11px] text-slate-500">
              * Grievances are acknowledged within <strong>24 business hours</strong> and resolved within <strong>7 working days</strong>.
            </p>
          </div>
        </section>
      </div>
    </LegalPageLayout>
  );
}
