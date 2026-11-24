import { Link } from 'react-router-dom';

export function FinancingAvailabilityNotice() {
  return (
    <aside aria-label="Patient financing availability" className="border-b border-blue-200 bg-blue-50 px-4 pb-4 pt-24 text-sm leading-relaxed text-[#0B2450]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center">
        <p>Clinic onboarding is in progress. Patient financing is not live yet.</p>
        <Link to="/about#financing" className="font-semibold text-[#0867E8] underline underline-offset-4 hover:decoration-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0867E8]">
          How activation works
        </Link>
      </div>
    </aside>
  );
}
