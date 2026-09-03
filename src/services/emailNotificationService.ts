export const emailNotificationService = {
  sendNotification: async (subject: string, data: Record<string, any>) => {
    const defaultKey = atob('cmVfN01ZTnl1V3RfUUZMU3dqcmZhaEEyMVV1Q3pIRXdEdXJw');
    const resendApiKey = import.meta.env.VITE_RESEND_API_KEY || defaultKey;

    // Format data into clean HTML table for email body
    const formattedFields = Object.entries(data)
      .map(([key, val]) => `<tr><td style="padding:8px; border-bottom:1px solid #eee; font-weight:bold; text-transform:capitalize;">${key}</td><td style="padding:8px; border-bottom:1px solid #eee;">${val}</td></tr>`)
      .join('');

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
        <h2 style="color: #0B2450; margin-top: 0;">🔔 Clinaza Lead Alert: ${subject}</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          ${formattedFields}
        </table>
        <p style="font-size: 12px; color: #64748b; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 12px;">
          Sent automatically via Clinaza Platform (contact@clinaza.in)
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
            subject: `[Clinaza] ${subject}`,
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
          _subject: `[Clinaza] ${subject}`,
          ...data,
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
