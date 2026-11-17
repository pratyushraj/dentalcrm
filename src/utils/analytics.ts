/**
 * Universal Analytics Utility
 * Supports multiple analytics providers with fallback
 */
import { supabase } from '@/integrations/supabase/client';

export interface AnalyticsEvent {
  event: string;
  category?: string;
  label?: string;
  value?: number;
  userId?: string;
  metadata?: Record<string, unknown>;
}

class Analytics {
  private userId: string | null = null;
  private enabled: boolean = true;

  private shouldSkipClientAnalytics(): boolean {
    if (typeof window === 'undefined') return true;
    const hostname = window.location.hostname || '';
    const userAgent = window.navigator.userAgent || '';
    return (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      window.navigator.webdriver === true ||
      /HeadlessChrome|Playwright|Puppeteer/i.test(userAgent)
    );
  }

  /**
   * Initialize analytics with user ID
   */
  init(userId?: string) {
    this.userId = userId || null;
    this.enabled = typeof window !== 'undefined';
  }

  /**
   * Track an event across all configured analytics providers
   */
  track(event: string, properties?: Record<string, unknown>) {
    if (!this.enabled) {
      console.log('[Analytics]', event, properties);
      return;
    }

    if (this.shouldSkipClientAnalytics()) {
      return;
    }

    const eventData: AnalyticsEvent = {
      event,
      userId: this.userId || undefined,
      ...properties,
    };

    // Google Analytics (gtag)
    if (window.gtag) {
      try {
        window.gtag('event', event, {
          event_category: properties?.category || 'general',
          event_label: properties?.label,
          value: properties?.value,
          ...properties,
        });
      } catch (error) {
        console.warn('[Analytics] gtag error:', error);
      }
    }

    // Facebook Pixel
    if (window.fbq) {
      try {
        window.fbq('track', event, properties);
      } catch (error) {
        console.warn('[Analytics] fbq error:', error);
      }
    }

    const analyticsWindow = window as Window & {
      posthog?: {
        capture: (eventName: string, props?: Record<string, unknown>) => void;
      };
      mixpanel?: {
        track: (eventName: string, props?: Record<string, unknown>) => void;
      };
    };

    // PostHog
    if (analyticsWindow.posthog) {
      try {
        analyticsWindow.posthog.capture(event, {
          ...properties,
          userId: this.userId,
        });
      } catch (error) {
        console.warn('[Analytics] PostHog error:', error);
      }
    }

    // Mixpanel
    if (analyticsWindow.mixpanel) {
      try {
        analyticsWindow.mixpanel.track(event, {
          ...properties,
          distinct_id: this.userId,
        });
      } catch (error) {
        console.warn('[Analytics] Mixpanel error:', error);
      }
    }

    // Backend API (if configured)
    this.sendToBackend(event, eventData).catch((error) => {
      // Silently fail - don't break user experience
      if (import.meta.env.DEV) {
        console.warn('[Analytics] Backend error:', error);
      }
    });

    // Console log in development
    if (import.meta.env.DEV) {
      console.log('[Analytics]', event, eventData);
    }
  }

  /**
   * Send event to backend API (Supabase Edge Function)
   */
  private async sendToBackend(event: string, data: AnalyticsEvent): Promise<void> {
    if (this.shouldSkipClientAnalytics()) {
      return;
    }

    // Get Supabase URL and anon key from environment
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      if (import.meta.env.DEV) {
        console.warn('[Analytics] Supabase URL or key not configured');
      }
      return;
    }

    // Get auth token from session
    const authToken = await this.getAuthToken();
    if (!authToken) {
      // Silently fail if no auth token (user not logged in)
      return;
    }

    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/analytics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
          'apikey': supabaseAnonKey,
        },
        body: JSON.stringify({
          event,
          metadata: {
            ...data,
            userId: this.userId,
          },
          timestamp: new Date().toISOString(),
          page_url: typeof window !== 'undefined' ? window.location.href : null,
        }),
      });

      if (!response.ok) {
        // Handle rate limiting
        if (response.status === 429) {
          const retryAfter = response.headers.get('X-RateLimit-Reset');
          if (import.meta.env.DEV) {
            console.warn('[Analytics] Rate limit exceeded', { retryAfter });
          }
          return;
        }
        
        throw new Error(`Analytics API error: ${response.status}`);
      }

      // Log success in development
      if (import.meta.env.DEV) {
        const result = await response.json();
        console.log('[Analytics] Event sent successfully', result);
      }
    } catch (error) {
      // Retry once after 1 second
      setTimeout(async () => {
        try {
          const retryResponse = await fetch(`${supabaseUrl}/functions/v1/analytics`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`,
              'apikey': supabaseAnonKey,
            },
            body: JSON.stringify({
              event,
              metadata: {
                ...data,
                userId: this.userId,
              },
              timestamp: new Date().toISOString(),
              page_url: typeof window !== 'undefined' ? window.location.href : null,
            }),
          });
          
          if (!retryResponse.ok && retryResponse.status !== 429) {
            throw new Error(`Analytics API retry error: ${retryResponse.status}`);
          }
        } catch (retryError) {
          // Silently fail on retry too
          if (import.meta.env.DEV) {
            console.warn('[Analytics] Retry failed', retryError);
          }
        }
      }, 1000);
    }
  }

  /**
   * Get auth token from Supabase session
   */
  private async getAuthToken(): Promise<string | null> {
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.access_token || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Set user ID for all future events
   */
  setUserId(userId: string) {
    this.userId = userId;
  }

  /**
   * Clear user ID (on logout)
   */
  clearUserId() {
    this.userId = null;
  }

  /**
   * Enable/disable analytics
   */
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  /**
   * Track high-intent Patient Eligibility Check (GA4 recommended event: generate_lead)
   */
  trackPatientLead(data: {
    treatment: string;
    amount?: string;
    city?: string;
    sourcePage?: string;
    phone?: string;
  }) {
    const numericAmount = parseInt((data.amount || '').replace(/[^0-9]/g, '')) || 50000;
    this.track('generate_lead', {
      category: 'Patient Financing',
      label: data.treatment,
      lead_type: 'patient_eligibility_check',
      treatment: data.treatment,
      city: data.city || 'India',
      source_page: data.sourcePage || 'Website',
      value: numericAmount,
      currency: 'INR',
    });
  }

  /**
   * Track Clinic Partner Registration (GA4 recommended event: sign_up & generate_lead)
   */
  trackClinicPartnerLead(data: {
    clinicName: string;
    city: string;
    category?: string;
    phone?: string;
    expectedEmiLoans?: string;
  }) {
    this.track('sign_up', {
      method: 'partner_clinic_form',
      category: 'Clinic Partnership',
      label: data.clinicName,
      lead_type: 'clinic_partner_onboarding',
      clinic_name: data.clinicName,
      city: data.city,
      clinic_category: data.category,
      value: 999,
      currency: 'INR',
    });
    this.track('generate_lead', {
      category: 'Clinic Partnership',
      label: data.clinicName,
      lead_type: 'clinic_partner_onboarding',
      clinic_name: data.clinicName,
      city: data.city,
      value: 999,
      currency: 'INR',
    });
  }

  /**
   * Track Razorpay Kit Purchase (GA4 standard ecommerce event: purchase)
   */
  trackKitPurchase(data: {
    paymentId: string;
    clinicName: string;
    amount?: number;
  }) {
    this.track('purchase', {
      transaction_id: data.paymentId,
      value: data.amount || 999,
      currency: 'INR',
      items: [
        {
          item_name: 'Counter QR Kit + Onboarding',
          affiliation: 'Clinaza',
          price: data.amount || 999,
          quantity: 1,
        },
      ],
    });
  }

  /**
   * Track WhatsApp Support Outreach (GA4 recommended event: contact)
   */
  trackWhatsAppContact(source: string) {
    this.track('contact', {
      method: 'whatsapp',
      category: 'Support',
      label: source,
      source_page: source,
    });
  }

  /**
   * Track Auto-Filled MAF Excel Download (GA4 recommended event: file_download)
   */
  trackMafDownload(clinicName: string) {
    this.track('file_download', {
      category: 'KYC Documents',
      label: clinicName,
      file_name: `Plural_MAF_BO_PEP_${clinicName}.xlsx`,
      file_extension: 'xlsx',
      lead_type: 'maf_excel_download',
    });
    this.track('generate_lead', {
      category: 'KYC Documents',
      label: clinicName,
      lead_type: 'maf_excel_download',
      currency: 'INR',
      value: 500,
    });
  }
}

// Singleton instance
export const analytics = new Analytics();

// Initialize on module load if in browser
if (typeof window !== 'undefined') {
  analytics.init();
}
