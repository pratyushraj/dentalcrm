import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { getCityBySlug, CITIES, CityData } from '@/data/cities';
import { SEOHead } from '@/components/seo/SEOHead';
import { ShieldCheck, CheckCircle2, ArrowRight, Building2 } from 'lucide-react';

export default function CityLandingPage() {
  const { city } = useParams<{ city: string }>();
  const cityData = city ? getCityBySlug(city) : undefined;

  // If city slug not found redirect to homepage
  if (!cityData) {
    return <Navigate to="/" replace />;
  }

  const { name, state, tier } = cityData;

  const heroHeadline =
    tier === 1
      ? `Dental Treatment EMI Financing in ${name}`
      : `Affordable Dental EMI Plans for Patients in ${name}`;

  const metaTitle = `Dental Implants, Braces & Crown EMI Plans in ${name}, ${state} | Clinaza`;
  const metaDescription = `Looking for dental treatment on EMI in ${name}? Clinaza connects ${name} patients with financing for implants, aligners, crowns and more. Check eligibility in 2 minutes.`;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Can I get dental implants on EMI in ${name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes. Eligible patients in ${name} can access point-of-care dental financing from ₹30,000 to ₹3,00,000 at Clinaza partner clinics through RBI-regulated banks and NBFCs.`,
        },
      },
      {
        '@type': 'Question',
        name: `How long does the eligibility check take in ${name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The initial soft eligibility check takes under 2 minutes at the clinic and requires only basic KYC details. Final loan approval is subject to lender assessment.`,
        },
      },
      {
        '@type': 'Question',
        name: `Is there any fee for the patient to check eligibility in ${name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `No. The eligibility pre-check is completely free and has no impact on the patient's credit score.`,
        },
      },
    ],
  };

  const procedures = [
    { emoji: '🦷', name: 'Dental Implants', range: '₹35,000 – ₹3,00,000' },
    { emoji: '😁', name: 'Braces & Aligners', range: '₹30,000 – ₹1,80,000' },
    { emoji: '👑', name: 'Crowns & Bridges', range: '₹10,000 – ₹80,000' },
    { emoji: '✨', name: 'Smile Makeovers', range: '₹50,000 – ₹2,00,000' },
    { emoji: '🦴', name: 'Full Mouth Rehab', range: '₹1,50,000 – ₹3,00,000' },
    { emoji: '🪥', name: 'Root Canal + Crown', range: '₹15,000 – ₹60,000' },
  ];

  return (
    <div className="min-h-screen bg-white text-[#0B2450] font-sans antialiased">
      <SEOHead
        title={metaTitle}
        description={metaDescription}
        keywords={[
          `dental emi ${name.toLowerCase()}`,
          `dental implants on emi ${name.toLowerCase()}`,
          `braces cost ${name.toLowerCase()}`,
          `dental financing ${name.toLowerCase()}`,
          `clear aligners ${name.toLowerCase()} emi`,
        ]}
        canonicalUrl={`https://clinaza.in/cities/${city}`}
        jsonLd={faqSchema}
      />

      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/assets/clinaza-logo.png" alt="Clinaza" className="h-9 w-9 rounded-full" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#0B2450] block">CLINAZA</span>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">EMI for Dental Care</span>
            </div>
          </Link>
          <a
            href="https://clinaza.in/#partner-form"
            className="px-4 py-2 bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all"
          >
            Partner With Clinaza →
          </a>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="pt-12 pb-10 px-4 sm:px-6 max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F5F9FC] border border-blue-100 rounded-full text-[10px] font-bold text-[#0756C7]">
            <Building2 size={12} /> DENTAL EMI FINANCING · {name.toUpperCase()}, {state.toUpperCase()}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-[#0B2450]">
            {heroHeadline}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Help patients in <strong>{name}</strong> say YES to high-ticket dental treatments. Clinaza connects clinics with RBI-regulated financing partners — eligible patients pay through easy monthly EMIs from{' '}
            <strong className="text-[#0B2450]">₹30,000 to ₹3 lakh</strong>.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://clinaza.in/#check-eligibility"
              className="px-6 py-3.5 bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#0867E8]/25"
            >
              <ShieldCheck size={15} /> Check Patient Eligibility
            </a>
            <a
              href="https://clinaza.in/#partner-form"
              className="px-5 py-3.5 bg-[#F7FAFC] hover:bg-slate-100 text-[#0B2450] border border-slate-200 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
            >
              Partner With Clinaza <ArrowRight size={13} />
            </a>
          </div>

          <p className="text-[10px] text-slate-400 font-medium">
            ⚡ Initial assessment only · No obligation · Final approval by lender ·{' '}
            <span className="text-[#0f7a75] font-bold">Clinaza connects clinics with financing partners.</span>
          </p>
        </section>

        {/* ₹0 Clinic Fee Banner */}
        <section className="py-6 px-4 sm:px-6 bg-gradient-to-r from-[#0f7a75]/10 to-[#0867E8]/10 border-y border-[#0f7a75]/20">
          <div className="max-w-3xl mx-auto text-center space-y-1">
            <p className="text-2xl font-black text-[#0f7a75]">₹0 Clinic Fees</p>
            <p className="text-xs font-bold text-[#0B2450]">
              No upfront fee or EMI collection responsibility for {name} dental clinics.
            </p>
          </div>
        </section>

        {/* Supported Treatments */}
        <section className="py-12 px-4 sm:px-6 max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-black text-[#0f7a75] uppercase tracking-widest">FINANCING ELIGIBLE PROCEDURES IN {name.toUpperCase()}</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0B2450]">Treatments Patients in {name} Can Finance</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {procedures.map((p, i) => (
              <div key={i} className="bg-white border border-slate-200 p-4 rounded-2xl text-center space-y-1.5 shadow-sm">
                <span className="text-2xl block">{p.emoji}</span>
                <h3 className="text-xs font-black text-[#0B2450] leading-tight">{p.name}</h3>
                <p className="text-[10px] text-slate-500 font-medium">{p.range}</p>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 text-center">
            *Indicative cost ranges only. Actual treatment cost depends on clinic assessment. Final loan approval subject to lender eligibility.
          </p>
        </section>

        {/* How It Works */}
        <section className="py-12 px-4 sm:px-6 bg-[#F7FAFC] border-y border-slate-200/60">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-black text-[#0f7a75] uppercase tracking-widest">HOW IT WORKS IN {name.toUpperCase()}</span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0B2450]">3 Steps to Patient Financing</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              {[
                { step: '01', title: 'Patient Chooses Treatment', desc: `Patient visits a Clinaza partner clinic in ${name} and selects their preferred procedure.` },
                { step: '02', title: 'Check Eligibility', desc: 'A 2-minute soft credit check is performed at the clinic. No credit score impact. Initial assessment only.' },
                { step: '03', title: 'Treatment Goes Ahead', desc: 'If eligible, the lender processes the loan and the patient pays through monthly EMI auto-debit.' },
              ].map((s, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-2 shadow-sm">
                  <span className="text-3xl font-black text-[#0867E8]/20">{s.step}</span>
                  <h3 className="text-sm font-black text-[#0B2450]">{s.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Clinics in this city use Clinaza */}
        <section className="py-12 px-4 sm:px-6 max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-black text-[#0f7a75] uppercase tracking-widest">FOR CLINIC OWNERS IN {name.toUpperCase()}</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0B2450]">Why {name} Clinics Partner With Clinaza</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: '₹0 Upfront Fee', desc: 'Free setup, free branding materials. No monthly charges.' },
              { title: 'No EMI Collection Burden', desc: 'EMIs auto-debited by NBFC. Clinic has zero collection risk.' },
              { title: 'RBI-Regulated Partners', desc: 'All financing provided by licensed banks and NBFCs.' },
              { title: 'Convert High-Ticket Cases', desc: 'Turn ₹50,000+ treatment hesitations into immediate appointments.' },
            ].map((item, i) => (
              <div key={i} className="bg-[#F7FAFC] border border-slate-200 p-5 rounded-2xl space-y-1 shadow-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#0f7a75] shrink-0" />
                  <strong className="text-xs font-black text-[#0B2450]">{item.title}</strong>
                </div>
                <p className="text-[11px] text-slate-600 pl-5 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 px-4 sm:px-6 bg-[#F7FAFC] border-y border-slate-200/60 max-w-4xl mx-auto">
          <div className="space-y-4">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-2xl font-black text-[#0B2450]">Frequently Asked Questions – {name}</h2>
            </div>
            {[
              {
                q: `Can patients in ${name} get dental treatment on EMI?`,
                a: `Yes. Eligible patients visiting Clinaza partner clinics in ${name} can access financing from ₹30,000 to ₹3,00,000 through RBI-regulated banks and NBFCs.`,
              },
              {
                q: `Does checking eligibility affect the patient's credit score?`,
                a: `No. The initial pre-check is a soft assessment and does not impact the patient's CIBIL score. Final hard inquiry only occurs if the patient proceeds with the loan application.`,
              },
              {
                q: `Is there any fee for dental clinics in ${name} to join Clinaza?`,
                a: `No. Clinaza onboarding is completely free for dental clinics in ${name}. There is no monthly subscription, no setup fee, and no EMI collection responsibility for the clinic.`,
              },
            ].map((faq, i) => (
              <div key={i} className="bg-white border border-slate-200 p-5 rounded-2xl space-y-2 shadow-sm">
                <h3 className="text-sm font-black text-[#0B2450]">{faq.q}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-14 px-4 sm:px-6 text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-black text-[#0B2450] leading-tight">
            Ready to help more {name} patients say YES to treatment?
          </h2>
          <p className="text-sm text-slate-600">Offer financing through Clinaza. Tell us about your clinic and we will get in touch.</p>
          <a
            href="https://clinaza.in/#partner-form"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#0867E8] hover:bg-[#0756C7] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#0867E8]/25"
          >
            Partner With Clinaza →
          </a>
          <p className="text-[10px] text-slate-400">
            Initial assessment only. Final loan approval and interest rate are determined independently by the financing partner.
          </p>
        </section>

        {/* Other Cities */}
        <section className="py-10 px-4 sm:px-6 bg-[#F7FAFC] border-t border-slate-200/60">
          <div className="max-w-5xl mx-auto space-y-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">CLINAZA OPERATES ACROSS INDIA</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {CITIES.filter((c) => c.slug !== city)
                .slice(0, 24)
                .map((c) => (
                  <Link
                    key={c.slug}
                    to={`/cities/${c.slug}`}
                    className="px-3 py-1.5 bg-white border border-slate-200 text-[11px] font-bold text-[#0B2450] rounded-lg hover:border-[#0867E8] hover:text-[#0867E8] transition-all"
                  >
                    {c.name}
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 border-t border-slate-200 text-center">
        <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">
          © 2026 CLINAZA Technologies · Connecting Clinics with Financing Partners ·{' '}
          <Link to="/blog" className="underline hover:text-[#0f7a75]">Patient Guides</Link>
        </p>
      </footer>
    </div>
  );
}
