import React, { useEffect } from 'react';

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
    
    window.location.replace(targetUrl);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4 font-sans">
      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4 animate-bounce">
        <span className="text-emerald-400 font-bold text-xl">C</span>
      </div>
      <h2 className="text-lg font-bold">Redirecting to Clinaza Loan Partner...</h2>
      <p className="text-sm text-slate-400 mt-1">Please wait a moment.</p>
    </div>
  );
}
