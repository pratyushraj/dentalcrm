import React, { useEffect } from 'react';
import { SEOHead } from '@/components/seo/SEOHead';

const DHANLIFT_WHITELABEL_BASE = 'https://www.dhanlift.com/loans/personal-loan-for-salaried-employees/clinaza-patient-treatment-loan?utm_source=affiliate&utm_medium=partner&utm_campaign=partner-campaign-aff-4&utm_term=03-09-2026';

export default function DhanliftRedirectPage() {
  useEffect(() => {
    const currentParams = new URLSearchParams(window.location.search);
    const mobile = currentParams.get('mobile') || currentParams.get('phone') || currentParams.get('aff_sub') || '';
    
    let targetUrl = DHANLIFT_WHITELABEL_BASE;
    if (mobile) {
      const mob = encodeURIComponent(mobile);
      targetUrl += `&mobile=${mob}&phone=${mob}&phoneNumber=${mob}&aff_sub=${mob}`;
    }
    
    // Slight timeout ensures SEO meta tags load before browser window replaces location
    const timer = setTimeout(() => {
      window.location.replace(targetUrl);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4 font-sans selection:bg-emerald-500 selection:text-white">
      <SEOHead
        title="Clinaza Patient Treatment Loan — Instant Approval"
        description="Apply for low EMI patient financing for dental & medical procedures up to ₹3,00,000. Powered by Dhanlift."
        image="https://clinaza.in/og-preview.png"
        canonicalUrl="https://clinaza.in/apply"
        keywords={['clinaza loan', 'dhanlift clinaza', 'patient treatment loan', 'dental emi loan']}
      />

      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-emerald-500 p-0.5 shadow-lg shadow-emerald-500/20 mb-4 animate-pulse">
        <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-emerald-400 font-black text-xl">
          C
        </div>
      </div>
      <h2 className="text-lg font-bold text-slate-100">Redirecting to Clinaza Loan Partner...</h2>
      <p className="text-xs text-slate-400 mt-1">Checking eligibility on Dhanlift secure portal.</p>
    </div>
  );
}
