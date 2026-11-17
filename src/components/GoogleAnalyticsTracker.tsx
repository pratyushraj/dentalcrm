

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GA_MEASUREMENT_ID = 'G-PYTGVWEEVP';

const GoogleAnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if gtag function is available
    const gtag = (window as any).gtag;
    if (gtag) {
      // Send a page view event for client-side navigation
      gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: location.pathname + location.search,
        send_to: GA_MEASUREMENT_ID,
      });
    }
  }, [location.pathname, location.search]);

  // Delegated tracking for high-intent external CTAs (WhatsApp, Tel)
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a');
      if (!target) return;
      const href = target.getAttribute('href') || '';
      const gtag = (window as any).gtag;
      if (!gtag) return;

      if (href.includes('wa.me') || href.includes('whatsapp.com')) {
        gtag('event', 'contact', {
          method: 'whatsapp',
          event_category: 'Direct Outreach',
          event_label: target.innerText?.trim() || href,
          page_path: location.pathname,
        });
      } else if (href.startsWith('tel:')) {
        gtag('event', 'contact', {
          method: 'phone_call',
          event_category: 'Direct Outreach',
          event_label: href.replace('tel:', ''),
          page_path: location.pathname,
        });
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, [location.pathname]);

  return null;
};

export default GoogleAnalyticsTracker;