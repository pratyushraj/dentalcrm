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
  },

  /**
   * Option A: Alert Clinic / Admin whenever an EMI loan application is rejected or declined.
   * Sends clear breakdown of failure reason and actionable recovery tips (e.g. Co-applicant).
   */
  sendRejectionAlert: async (data: {
    patientName?: string;
    mobile?: string;
    treatment?: string;
    amount?: string | number;
    lender?: string;
    reason?: string;
    cibilScore?: string | number;
    employmentType?: string;
    suggestedAction?: string;
  }) => {
    const defaultKey = atob('cmVfN01ZTnl1V3RfUUZMU3dqcmZhaEEyMVV1Q3pIRXdEdXJw');
    const resendApiKey = import.meta.env.VITE_RESEND_API_KEY || defaultKey;

    const patientName = data.patientName || 'Patient';
    const mobile = data.mobile || 'N/A';
    const treatment = data.treatment || 'Dental / Aesthetic Procedure';
    const lender = data.lender || 'Easycred / Partner NBFC';
    const reason = data.reason || 'Bureau Cutoff / Incomplete Eligibility / Low Credit Score';
    const amount = data.amount ? `₹${data.amount}` : 'N/A';
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' (IST)';

    // Analyze reason to provide smart recovery recommendation
    let recoveryTip = 'Advise patient to apply with an earning family member (spouse, parent, or working sibling) as primary or co-applicant to guarantee instant approval.';
    const rLower = reason.toLowerCase();
    if (rLower.includes('cibil') || rLower.includes('bureau') || rLower.includes('score')) {
      recoveryTip = 'Credit Bureau score below cutoff. Immediate Solution: Re-run eligibility with an earning co-applicant (spouse/parent) having 700+ CIBIL, or offer clinic in-house milestone installments.';
    } else if (rLower.includes('foir') || rLower.includes('debt') || rLower.includes('obligation') || rLower.includes('income')) {
      recoveryTip = 'Existing monthly debt ratio too high. Solution: Reduce requested loan amount with a small upfront clinic down-payment (20-30%) and finance the remainder over 12-18 months.';
    } else if (rLower.includes('pincode') || rLower.includes('negative') || rLower.includes('location')) {
      recoveryTip = 'Pincode serviceable constraint by primary NBFC. Solution: Route application through alternate NBFC partner on Easycred network or use co-applicant with metro/urban permanent address.';
    } else if (rLower.includes('kyc') || rLower.includes('pan') || rLower.includes('aadhaar')) {
      recoveryTip = 'KYC mismatch or mobile-Aadhaar link issue. Solution: Verify patient mobile matches Aadhaar OTP and PAN name matches dental records exactly.';
    }

    const htmlBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; border: 1px solid #fee2e2; border-radius: 16px; padding: 28px; background: #ffffff; box-shadow: 0 4px 20px rgba(220,38,38,0.06);">
        <!-- Header Banner -->
        <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="background: #ef4444; color: #ffffff; width: 32px; height: 32px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px; text-align: center; line-height: 32px;">!</div>
            <div>
              <h2 style="color: #991b1b; margin: 0; font-size: 18px; font-weight: 800;">Financing Alert: Patient Loan Declined</h2>
              <p style="color: #b91c1c; font-size: 12px; margin: 2px 0 0 0;">Immediate action recommended by Clinic Treatment Coordinator</p>
            </div>
          </div>
        </div>

        <p style="font-size: 14px; color: #334155; line-height: 1.5; margin-bottom: 20px;">
          A treatment financing application submitted for <strong>${patientName}</strong> was rejected by the lending partner. Review the rejection reason and suggested recovery step below:
        </p>

        <!-- Breakdown Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; border: 1px solid #f1f5f9; border-radius: 10px; overflow: hidden;">
          <tbody>
            <tr style="background: #f8fafc;">
              <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 600; color: #475569; width: 38%;">Patient Name</td>
              <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 700; color: #0f172a;">${patientName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 600; color: #475569;">Mobile Number</td>
              <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 600; color: #0284c7;">${mobile}</td>
            </tr>
            <tr style="background: #f8fafc;">
              <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 600; color: #475569;">Treatment</td>
              <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 600; color: #0f172a;">${treatment}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 600; color: #475569;">Estimated Amount</td>
              <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 700; color: #0f172a;">${amount}</td>
            </tr>
            <tr style="background: #f8fafc;">
              <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 600; color: #475569;">Lending Partner</td>
              <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 600; color: #475569;">${lender}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; border-bottom: 1px solid #fecaca; font-size: 13px; font-weight: 600; color: #991b1b; background: #fff1f2;">Decline Reason</td>
              <td style="padding: 10px 14px; border-bottom: 1px solid #fecaca; font-size: 13px; font-weight: 700; color: #dc2626; background: #fff1f2;">
                ❌ ${reason}
              </td>
            </tr>
            <tr style="background: #f8fafc;">
              <td style="padding: 10px 14px; font-size: 12px; font-weight: 600; color: #64748b;">Timestamp</td>
              <td style="padding: 10px 14px; font-size: 12px; color: #64748b;">${timestamp}</td>
            </tr>
          </tbody>
        </table>

        <!-- Actionable Recovery Section (Option A Focus) -->
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
          <h3 style="color: #166534; font-size: 14px; font-weight: 700; margin: 0 0 8px 0; display: flex; align-items: center; gap: 6px;">
            💡 Recommended Patient Recovery Action (Option A):
          </h3>
          <p style="font-size: 13px; color: #15803d; line-height: 1.5; margin: 0 0 12px 0;">
            ${recoveryTip}
          </p>
          <div style="border-top: 1px dashed #bbf7d0; padding-top: 10px; font-size: 12px; color: #166534;">
            <strong>Step 1:</strong> Call patient at <a href="tel:${mobile}" style="color: #0d9488; text-decoration: underline; font-weight: bold;">${mobile}</a><br/>
            <strong>Step 2:</strong> Propose adding a co-applicant (working spouse/parent) or splitting the procedure into dual-stage payments.
          </div>
        </div>

        <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0; border-top: 1px solid #f1f5f9; padding-top: 14px;">
          Clinaza LendSure AI &middot; Automated Risk & Rejection Dispatcher &middot; contact@clinaza.in
        </p>
      </div>
    `;

    const emailSubject = `⚠️ [Financing Alert] Loan Declined: ${patientName} (${mobile}) - ${reason}`;

    // 1. Try Resend
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
            subject: emailSubject,
            html: htmlBody
          })
        });
        const result = await response.json();
        console.log('[EmailNotification] Rejection alert sent via Resend:', result);
        return result;
      } catch (error) {
        console.warn('[EmailNotification] Resend rejection alert failed, falling back to FormSubmit:', error);
      }
    }

    // 2. Fallback FormSubmit
    try {
      const response = await fetch('https://formsubmit.co/ajax/funnyraj10@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: emailSubject,
          patientName,
          mobile,
          treatment,
          amount,
          lender,
          reason,
          recoveryTip,
          _replyto: 'contact@clinaza.in',
          _honey: ''
        })
      });
      const result = await response.json();
      console.log('[EmailNotification] Rejection alert sent via FormSubmit:', result);
      return result;
    } catch (error) {
      console.error('[EmailNotification] Failed to send rejection alert email:', error);
      return null;
    }
  }
};


