import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/seo/SEOHead';

const linkStyle = 'font-semibold text-[#0867E8] underline underline-offset-4 decoration-blue-200 hover:decoration-[#0867E8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0867E8]';

export default function AboutClinazaPage() {
  return (
    <div className="min-h-screen bg-white font-jakarta text-slate-900 selection:bg-blue-100">
      <SEOHead
        title="About Clinaza & Clinic Pricing | ₹999 One-Time Activation"
        description="Clinaza is onboarding clinics for healthcare financing. ₹999 one-time activation, ₹0 AMC and ₹0 monthly fees. Patient financing starts after partner activation."
        canonicalUrl="https://www.clinaza.in/about"
        image="https://www.clinaza.in/assets/clinaza-logo.jpg"
        imageAlt="Official Clinaza blue and green C logo"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            '@id': 'https://www.clinaza.in/about#page',
            url: 'https://www.clinaza.in/about',
            name: 'About Clinaza & Clinic Pricing',
            dateModified: '2026-11-24',
            about: { '@id': 'https://www.clinaza.in/#organization' },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            '@id': 'https://www.clinaza.in/about#activation',
            name: 'Clinaza clinic digital financing desk activation',
            provider: { '@id': 'https://www.clinaza.in/#organization' },
            description: 'Clinaza is currently onboarding clinics. Patient financing becomes available only after clinic verification, partner underwriting and payment activation. ₹999 one-time activation, ₹0 AMC and ₹0 monthly subscription fees.',
            offers: {
              '@type': 'Offer',
              url: 'https://www.clinaza.in/clinic-onboarding',
              name: 'One-time clinic activation',
              price: '999',
              priceCurrency: 'INR',
              description: 'One-time activation fee. Applicable transaction charges are separate.',
            },
          },
        ]}
      />

      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:p-3 focus:text-[#0867E8] focus:outline focus:outline-2">
        Skip to content
      </a>
      <header className="border-b border-slate-200">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-5 px-5 py-5 sm:px-8">
          <Link to="/" aria-label="Clinaza home" className="flex items-center gap-3 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0867E8]">
            <img src="/assets/clinaza-logo.jpg" alt="Clinaza" width={58} height={58} className="h-[58px] w-[58px] rounded-xl border border-slate-200" />
            <span className="text-lg font-extrabold tracking-widest text-[#0B2450]">CLINAZA</span>
          </Link>
          <nav aria-label="Page navigation" className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <a href="#pricing" className={linkStyle}>Clinic pricing</a>
            <a href="#financing" className={linkStyle}>Patient financing</a>
            <a href="#case-studies" className={linkStyle}>Partner clinics</a>
            <Link to="/contact" className={linkStyle}>Contact</Link>
          </nav>
        </div>
      </header>

      <main id="main-content">
        <div className="border-b border-slate-200 bg-slate-50">
          <div className="mx-auto grid max-w-6xl gap-9 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-end lg:gap-16">
            <div>
              <p className="mb-4 text-sm font-bold uppercase tracking-widest text-[#0867E8]">Company facts &amp; clinic pricing</p>
              <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-[#0B2450] sm:text-5xl">About Clinaza</h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
                Healthcare financing technology for clinics and patients in India. Operated by Mellowprints, Clinaza is preparing digital financing desks alongside everyday clinic tools.
              </p>
              <p className="mt-5 max-w-2xl border-l-4 border-[#0867E8] pl-4 text-base font-semibold leading-relaxed text-[#0B2450]">
                Clinaza is currently onboarding clinics. Patient financing becomes available only after clinic verification, partner underwriting and payment activation.
              </p>
              <p className="mt-5 text-sm text-slate-500">Updated <time dateTime="2026-11-24">24 November 2026</time></p>
            </div>
            <aside aria-label="Clinic activation price" className="border-l-4 border-[#0867E8] bg-white px-6 py-5">
              <p className="text-sm font-semibold text-slate-600">Clinic digital desk activation</p>
              <p className="mt-2 text-5xl font-extrabold tracking-tight text-[#0B2450]">₹999</p>
              <p className="mt-2 font-semibold text-slate-700">One-time activation</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">₹0 AMC · ₹0 monthly subscription fees</p>
              <Link to="/clinic-onboarding" className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#0867E8] px-5 py-3 text-sm font-bold text-white hover:bg-[#0757c5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0867E8]">Start clinic onboarding</Link>
            </aside>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <section aria-labelledby="what-is-clinaza" className="grid gap-5 border-b border-slate-200 py-10 sm:py-12 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-16">
            <h2 id="what-is-clinaza" className="text-2xl font-bold leading-snug tracking-tight text-[#0B2450]">What is Clinaza?</h2>
            <div className="space-y-4 text-base leading-relaxed text-slate-600">
              <p>Clinaza is a healthcare payment and financing technology platform operated by <strong className="font-semibold text-slate-900">Mellowprints, a sole proprietorship in India</strong>. Clinaza also provides core clinic management tools, including patient records, digital prescriptions and follow-up workflows.</p>
              <p>Clinaza is designed to facilitate access to payment and financing providers once a clinic is activated. Regulated banks and NBFCs make lending decisions, set borrower terms and collect repayments. The planned payment gateway integration uses Plural by Pine Labs under Clinaza’s institutional agreement.</p>
              <p>After activation, the financing desk will use payment links, dashboard checkout and on-screen QR codes. Clinic activation requires document-based verification, merchant underwriting and payment activation.</p>
            </div>
          </section>

          <section id="pricing" aria-labelledby="pricing-heading" className="grid scroll-mt-6 gap-5 border-b border-slate-200 py-10 sm:py-12 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-16">
            <h2 id="pricing-heading" className="text-2xl font-bold leading-snug tracking-tight text-[#0B2450]">What does clinic activation cost?</h2>
            <div className="space-y-5 text-base leading-relaxed text-slate-600">
              <p>Clinics pay <strong className="font-semibold text-slate-900">₹999 once</strong> for digital financing desk activation and merchant underwriting. This covers clinic verification, doctor KYC underwriting and Pine Labs lending gateway integration.</p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm sm:text-base">
                  <caption className="pb-3 text-left font-semibold text-slate-900">Clinaza clinic charges</caption>
                  <thead className="border-y border-slate-200 bg-slate-50 text-slate-900">
                    <tr><th scope="col" className="px-3 py-3 font-semibold">Item</th><th scope="col" className="px-3 py-3 text-right font-semibold">Charge</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr><th scope="row" className="px-3 py-4 font-medium text-slate-700">Digital desk activation</th><td className="px-3 py-4 text-right font-semibold text-[#0B2450]">₹999 once</td></tr>
                    <tr><th scope="row" className="px-3 py-4 font-medium text-slate-700">Annual maintenance (AMC)</th><td className="px-3 py-4 text-right font-semibold text-[#0B2450]">₹0</td></tr>
                    <tr><th scope="row" className="px-3 py-4 font-medium text-slate-700">Monthly subscription</th><td className="px-3 py-4 text-right font-semibold text-[#0B2450]">₹0</td></tr>
                    <tr><th scope="row" className="px-3 py-4 font-medium text-slate-700">Core clinic CRM</th><td className="px-3 py-4 text-right font-semibold text-[#0B2450]">Free</td></tr>
                    <tr><th scope="row" className="px-3 py-4 font-medium text-slate-700">Financed loan platform MDR</th><td className="px-3 py-4 text-right font-semibold text-[#0B2450]">3.00% per transaction</td></tr>
                  </tbody>
                </table>
              </div>
              <p>The free core CRM is separate from financing desk activation. Transaction charges and patient lender charges are separate from the one-time activation fee. The <Link to="/clinic-agreement" className={linkStyle}>clinic agreement</Link> sets out applicable commercial terms.</p>
            </div>
          </section>

          <section id="financing" aria-labelledby="financing-heading" className="grid scroll-mt-6 gap-5 border-b border-slate-200 py-10 sm:py-12 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-16">
            <h2 id="financing-heading" className="text-2xl font-bold leading-snug tracking-tight text-[#0B2450]">How do patient EMI options work?</h2>
            <div className="space-y-6 text-base leading-relaxed text-slate-600">
              <p>Patient financing is not live at any clinic yet. After clinic verification, partner underwriting and payment activation, the supported payment options will depend on the provider and patient’s eligibility.</p>
              <dl className="divide-y divide-slate-200 border-y border-slate-200">
                <div className="py-4"><dt className="font-semibold text-slate-900">Credit Card EMI</dt><dd className="mt-1">After activation, eligible credit cards may convert a supported treatment payment into instalments, subject to the issuing bank’s terms and available limit.</dd></div>
                <div className="py-4"><dt className="font-semibold text-slate-900">Debit Card EMI</dt><dd className="mt-1">Intended for patients with a qualifying pre-approved offer from their bank, where supported by the activated checkout provider.</dd></div>
                <div className="py-4"><dt className="font-semibold text-slate-900">Cardless financing</dt><dd className="mt-1">Where supported after activation, a regulated lender will assess the patient’s application. Approval depends on the lender’s checks and documentation requirements.</dd></div>
              </dl>
              <p>Before accepting a loan, patients review the lender’s approved amount, interest rate, APR, fees, tenure and repayment schedule in the Key Facts Statement (KFS) and loan terms. An eligibility check does not guarantee approval.</p>
              <p>Explore treatment information for <Link to="/dental-implant-loan" className={linkStyle}>dental implants</Link>, <Link to="/ivf-treatment-on-emi" className={linkStyle}>IVF</Link>, <Link to="/lasik-eye-surgery-on-emi" className={linkStyle}>LASIK</Link> and <Link to="/hair-transplant-on-emi" className={linkStyle}>hair restoration</Link>.</p>
            </div>
          </section>

          <section aria-labelledby="settlement-heading" className="grid gap-5 border-b border-slate-200 py-10 sm:py-12 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-16">
            <h2 id="settlement-heading" className="text-2xl font-bold leading-snug tracking-tight text-[#0B2450]">How much does the clinic receive?</h2>
            <div className="space-y-5 text-base leading-relaxed text-slate-600">
              <p>Under the scheduled terms for activated clinics, the clinic would receive the treatment amount less applicable MDR and any agreed clinic-funded subvention. T+1 business-day settlement would follow successful processing of an eligible transaction after underwriting and payment activation.</p>
              <div className="border-l-4 border-blue-200 bg-slate-50 px-5 py-5">
                <h3 className="font-bold text-[#0B2450]">Illustrative settlement in patient-borne mode</h3>
                <dl className="mt-4 space-y-3 text-sm sm:text-base">
                  <div className="flex justify-between gap-5"><dt>Treatment invoice</dt><dd className="font-semibold text-slate-900">₹60,000</dd></div>
                  <div className="flex justify-between gap-5"><dt>Platform MDR at 3%</dt><dd className="font-semibold text-slate-900">−₹1,800</dd></div>
                  <div className="flex justify-between gap-5 border-t border-slate-200 pt-3 font-bold text-[#0B2450]"><dt>Net clinic settlement</dt><dd>₹58,200</dd></div>
                </dl>
                <p className="mt-4 text-sm leading-relaxed">This is an illustrative calculation for a future transaction after clinic activation, before any other applicable agreed charges. It is not a completed patient financing transaction. The patient would pay the approved lender charges. Agreed clinic-funded promotional subvention would also reduce the clinic’s net payout.</p>
              </div>
              <p>The lender collects patient loan repayments, and the clinic has no patient credit-default recourse or EMI collection responsibility. The clinic remains responsible for treatment delivery, refunds and chargebacks under its agreement.</p>
            </div>
          </section>

          <section id="case-studies" aria-labelledby="case-studies-heading" className="grid scroll-mt-6 gap-5 border-b border-slate-200 py-10 sm:py-12 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-16">
            <h2 id="case-studies-heading" className="text-2xl font-bold leading-snug tracking-tight text-[#0B2450]">Verified partner clinics &amp; case studies</h2>
            <div className="space-y-6 text-base leading-relaxed text-slate-600">
              <p>Clinaza works directly with independent clinics and specialty healthcare practices across India to prepare digital patient financing. Below are verified partner clinic profiles and documented clinical financing implementations:</p>
              
              <div className="grid gap-5 sm:grid-cols-2">
                <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0867E8] bg-blue-50 px-2 py-0.5 rounded-full">DENTAL IMPLANTS</span>
                  <h3 className="mt-2 text-base font-bold text-[#0B2450]">Vasantha Dental Clinic &amp; Implant Center</h3>
                  <p className="mt-1 text-xs text-slate-500">Dr. V Siddardha Chaitanya · Visakhapatnam, Andhra Pradesh</p>
                  <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                    <strong>Challenge:</strong> Patients delaying multi-unit implant bridges and All-on-4 full-arch rehabilitations due to lump-sum upfront costs (₹60,000–₹2,50,000).<br />
                    <strong>Outcome:</strong> 2-minute point-of-care digital financing desk, enabling patients to spread implant costs into ₹2,400–₹8,500/month installments with T+1 clinic current account payouts and 0% doctor recourse.
                  </p>
                </article>

                <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">AUDIOLOGY</span>
                  <h3 className="mt-2 text-base font-bold text-[#0B2450]">HEAR ONE Hearing &amp; Speech Clinic</h3>
                  <p className="mt-1 text-xs text-slate-500">Dr. Angiras Vishnu · Kakkanad, Ernakulam, Kerala</p>
                  <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                    <strong>Challenge:</strong> Standard retail Mediclaim policies in India strictly exclude external hearing aids and sensory prosthetics, leaving senior citizens with heavy out-of-pocket expenses.<br />
                    <strong>Outcome:</strong> Cardless senior-citizen patient EMI via Aadhaar &amp; PAN OTP, financing premium digital hearing aids from ₹1,800/month.
                  </p>
                </article>

                <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">ORTHODONTICS</span>
                  <h3 className="mt-2 text-base font-bold text-[#0B2450]">Nitya Dental &amp; Cosmetic Clinic</h3>
                  <p className="mt-1 text-xs text-slate-500">Dr. Bhanu Prakash Singh · Bhopal, Madhya Pradesh</p>
                  <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                    <strong>Challenge:</strong> Younger working professionals and students seeking invisible clear aligners but lacking credit cards or high credit limits.<br />
                    <strong>Outcome:</strong> Cardless digital orthodontic loans starting from ₹2,600/month across 16+ banking and NBFC partners, eliminating clinic credit risk.
                  </p>
                </article>

                <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">REPRODUCTIVE MEDICINE</span>
                  <h3 className="mt-2 text-base font-bold text-[#0B2450]">Elara IVF &amp; Fertility Center</h3>
                  <p className="mt-1 text-xs text-slate-500">Director Gajendra Singh Chouhan · Jodhpur, Rajasthan</p>
                  <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                    <strong>Challenge:</strong> Retail health insurance policies exclude infertility investigations and IVF cycles under standard IRDAI guidelines.<br />
                    <strong>Outcome:</strong> Instant 3 to 24 month medical EMI packages covering IVF cycles, ICSI, and fertility medications with zero paperwork friction.
                  </p>
                </article>
              </div>

              <p className="text-xs text-slate-500">
                Partner clinics are onboarded under statutory documentation (Doctor PAN, cancelled current account cheque, establishment license / Udyam) and underwritten via Pine Labs Plural for automated T+1 settlement.
              </p>
            </div>
          </section>

          <section aria-labelledby="verification-heading" className="grid gap-5 py-10 sm:py-12 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-16">
            <h2 id="verification-heading" className="text-2xl font-bold leading-snug tracking-tight text-[#0B2450]">Where can I verify Clinaza’s details?</h2>
            <div className="space-y-5 text-base leading-relaxed text-slate-600">
              <ul className="list-disc space-y-3 pl-5 marker:text-[#0867E8]">
                <li><Link to="/terms" className={linkStyle}>Terms of Service</Link> identify Mellowprints as the platform operator and describe Clinaza’s technology role.</li>
                <li><Link to="/clinic-agreement" className={linkStyle}>Clinic Sub-Merchant Agreement</Link> sets out activation, transaction charges, settlement and clinic responsibilities.</li>
                <li><Link to="/privacy" className={linkStyle}>Privacy Policy</Link> explains how platform information is handled.</li>
                <li><a href="/assets/clinaza-logo.jpg" className={linkStyle}>Official Clinaza logo</a> provides the blue and green C with the CLINAZA wordmark.</li>
              </ul>
              <p>For clinic onboarding, confirm your clinic details and provide doctor PAN, Aadhaar, clinic proof and cancelled cheque documentation for the applicable verification and underwriting review.</p>
              <p>For questions about a clinic’s supported payment options or commercial terms, <Link to="/contact" className={linkStyle}>contact Clinaza</Link> or email <a href="mailto:contact@clinaza.in" className={linkStyle}>contact@clinaza.in</a>.</p>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-5 px-5 py-7 text-sm text-slate-600 sm:flex-row sm:px-8">
          <p>© 2026 Clinaza. Operated by Mellowprints.</p>
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-3">
            <Link to="/" className={linkStyle}>Home</Link>
            <Link to="/terms" className={linkStyle}>Terms</Link>
            <Link to="/privacy" className={linkStyle}>Privacy</Link>
            <Link to="/contact" className={linkStyle}>Contact</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
