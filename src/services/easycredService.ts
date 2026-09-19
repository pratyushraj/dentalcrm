/**
 * Easycred Partner DSA Integration Service
 * Initiates loan applications under Clinaza's DSA partner account
 */

export interface InitiateEasycredParams {
  customerName: string;
  mobile: string;
  productCode?: 'ONLINE_PERSONAL' | 'ONLINE_GOLD' | 'ONLINE_SHORT_TERM';
}

export interface InitiateEasycredResponse {
  success: boolean;
  data?: {
    inviteId: string;
    maskedMobile: string;
    customerLink: string;
    smsSent: boolean;
  };
  error?: string;
  fallbackLink?: string;
}

export const easycredService = {
  async initiateApplication(params: InitiateEasycredParams): Promise<InitiateEasycredResponse> {
    const cleanMobile = params.mobile.replace(/\D/g, '').slice(-10);
    const fallbackLink = `https://easycred.co.in/loan/apply?product=PERSONAL_LOAN&mobile=${cleanMobile}&name=${encodeURIComponent(params.customerName)}`;

    try {
      const res = await fetch('/api/lenders/easycred', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customerName: params.customerName,
          mobile: cleanMobile,
          productCode: params.productCode || 'ONLINE_PERSONAL'
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      return data;
    } catch (err: any) {
      console.warn('Direct Easycred API call failed, providing fallback loan invite:', err.message);
      return {
        success: false,
        error: err.message,
        fallbackLink
      };
    }
  }
};
