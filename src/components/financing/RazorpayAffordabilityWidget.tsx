import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, CreditCard, ChevronRight, Info } from 'lucide-react';

interface RazorpayAffordabilityWidgetProps {
  amount: number; // in Indian Rupees (INR)
  keyId?: string; // optional override; defaults to VITE_RAZORPAY_KEY_ID or fallback
  className?: string;
  theme?: 'light' | 'dark';
  hideFallbackBadge?: boolean;
}

declare global {
  interface Window {
    RazorpayAffordabilitySuite?: any;
  }
}

export const RazorpayAffordabilityWidget: React.FC<RazorpayAffordabilityWidgetProps> = ({
  amount,
  keyId,
  className = '',
  theme = 'light',
  hideFallbackBadge = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRendered, setIsRendered] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  // Use environment variable or provided keyId
  const activeKey =
    keyId ||
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_RAZORPAY_KEY_ID) ||
    'rzp_live_default';

  useEffect(() => {
    let isCancelled = false;
    let timeoutId: any = null;

    const initWidget = () => {
      if (isCancelled) return;

      if (typeof window !== 'undefined' && window.RazorpayAffordabilitySuite && containerRef.current) {
        try {
          // Amount in paise
          const amountInPaise = Math.round(Number(amount || 0) * 100);

          // Clear previous render if any
          containerRef.current.innerHTML = '<div id="razorpay-affordability-widget"></div>';

          const widgetConfig = {
            key: activeKey,
            amount: amountInPaise,
            currency: 'INR'
          };

          const suite = new window.RazorpayAffordabilitySuite(widgetConfig);
          suite.render();
          setIsRendered(true);
          setHasError(false);
        } catch (err) {
          console.warn('[RazorpayAffordabilityWidget] Render notice:', err);
          setHasError(true);
        }
      } else {
        // Retry for up to 3 seconds while script downloads
        timeoutId = setTimeout(initWidget, 350);
      }
    };

    initWidget();

    return () => {
      isCancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [amount, activeKey]);

  // Indicative monthly calculation (e.g. 12 or 24 months starting from ~1.2% / mo)
  const minMonthly = Math.round(amount / 24);

  return (
    <div className={`w-full ${className}`}>
      {/* Container for Razorpay SDK to inject the live Affordability Suite */}
      <div ref={containerRef} className="w-full min-h-[42px]">
        <div id="razorpay-affordability-widget" />
      </div>

      {/* Elegant fallback / instant preview banner if SDK is loading or on test sandbox */}
      {(!isRendered || hasError) && !hideFallbackBadge && (
        <div className="w-full bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-200/80 rounded-xl p-3 sm:p-3.5 flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#0867E8] text-white flex items-center justify-center shrink-0 shadow-sm">
              <CreditCard size={15} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] sm:text-xs font-black text-slate-800 tracking-tight">
                  Flexible EMI from ₹{minMonthly.toLocaleString('en-IN')}/mo
                </span>
                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100/90 px-1.5 py-0.5 rounded leading-none uppercase">
                  16+ Banks &amp; NBFCs
                </span>
              </div>
              <p className="text-[10px] text-slate-500 truncate mt-0.5">
                Instant front-desk approval with HDFC, ICICI, SBI, Axis &amp; Cardless EMI
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-[#0867E8] shrink-0">
            <span>View Plans</span>
            <ChevronRight size={13} />
          </div>
        </div>
      )}
    </div>
  );
};

export default RazorpayAffordabilityWidget;
