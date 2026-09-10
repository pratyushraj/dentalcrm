export const emailNotificationService = {
  sendNotification: async (subject: string, data: Record<string, any>) => {
    const defaultKey = atob('cmVfN01ZTnl1V3RfUUZMU3dqcmZhaEEyMVV1Q3pIRXdEdXJw');
    const resendApiKey = import.meta.env.VITE_RESEND_API_KEY || defaultKey;

    // Collect rich visitor context automatically (UTMs, Referrer, Current URL, Device)
    let visitorContext: Record<string, string> = {};
    if (typeof window !== 'undefined') {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const utmSource = urlParams.get('utm_source') || '';
        const utmMedium = urlParams.get('utm_medium') || '';
        const utmCampaign = urlParams.get('utm_campaign') || '';
        const utmTerm = urlParams.get('utm_term') || '';
        const utmContent = urlParams.get('utm_content') || '';

        const referrer = document.referrer ? document.referrer : 'Direct / Organic / WhatsApp';
        const landingPage = window.location.href;
        const screenRes = `${window.screen?.width || 0}x${window.screen?.height || 0}`;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const deviceType = isMobile ? 'Mobile Device' : 'Desktop / Laptop';

        visitorContext = {
          'Submitted At': new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' (IST)',
          'Page URL': landingPage,
          'Referring Source': referrer,
          'Device': `${deviceType} (${screenRes})`,
          ...(utmSource ? { 'UTM Source': utmSource } : {}),
          ...(utmMedium ? { 'UTM Medium': utmMedium } : {}),
          ...(utmCampaign ? { 'UTM Campaign': utmCampaign } : {}),
          ...(utmTerm ? { 'UTM Term / Keyword': utmTerm } : {}),
          ...(utmContent ? { 'UTM Content': utmContent } : {}),
        };
      } catch (e) {
        console.warn('Error reading visitor context:', e);
      }
    }

    const mergedData = {
      ...data,
      ...visitorContext,
    };

    // Format data into clean HTML table for email body
    const formattedFields = Object.entries(mergedData)
      .map(([key, val]) => `<tr><td style="padding:10px 12px; border-bottom:1px solid #e2e8f0; font-weight:600; color:#334155; width:35%; text-transform:capitalize;">${key}</td><td style="padding:10px 12px; border-bottom:1px solid #e2e8f0; color:#0f172a; font-weight:500;">${val}</td></tr>`)
      .join('');

    const htmlBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; padding: 28px; background: #ffffff; box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom: 20px;">
          <h2 style="color: #0B2450; margin: 0; font-size: 20px; font-weight: 800;">🔔 Clinaza Lead Alert: ${subject}</h2>
        </div>
        <p style="font-size: 13px; color: #64748b; margin-top: 0; margin-bottom: 16px;">
          A new request was submitted on Clinaza with the following verified details and traffic source info:
        </p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 8px; border: 1px solid #f1f5f9; border-radius: 8px; overflow: hidden;">
          ${formattedFields}
        </table>
        <div style="margin-top: 24px; padding: 12px 16px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
          <p style="font-size: 12px; color: #475569; margin: 0;">
            💡 <strong>Lead Tip:</strong> Call or WhatsApp the doctor within 15 minutes for maximum onboarding conversion.
          </p>
        </div>
        <p style="font-size: 11px; color: #94a3b8; margin-top: 20px; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 12px;">
          Sent automatically via Clinaza Healthcare Platform &middot; contact@clinaza.in
        </p>
      </div>
    `;

    // 1. Try sending via Resend API if API Key is available
    if (resendApiKey) {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'Clinaza Leads <contact@clinaza.in>',
            to: ['funnyraj10@gmail.com'],
            subject: `[Clinaza Lead] ${subject}`,
            html: htmlBody
          })
        });
        const result = await response.json();
        console.log('[EmailNotification] Sent via Resend:', result);
        return result;
      } catch (error) {
        console.warn('[EmailNotification] Resend failed, falling back to FormSubmit:', error);
      }
    }

    // 2. Fallback to FormSubmit (no API Key required)
    try {
      const response = await fetch('https://formsubmit.co/ajax/funnyraj10@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `[Clinaza Lead] ${subject}`,
          ...mergedData,
          _replyto: 'contact@clinaza.in',
          _honey: ''
        })
      });
      const result = await response.json();
      console.log('[EmailNotification] Notification sent via FormSubmit:', result);
      return result;
    } catch (error) {
      console.error('[EmailNotification] Failed to send email notification:', error);
      return null;
    }
  }
};

