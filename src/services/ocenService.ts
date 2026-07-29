/**
 * OCEN 4.0 & ULI (Unified Lending Interface) Integration Service for Clinaza
 * 
 * Provides standardized protocol interfaces for:
 * 1. Loan Application Initialization (Loan Agent Role)
 * 2. Consent & Data Fetch via Account Aggregator (AA) & ULI
 * 3. Multi-Lender Offer Aggregation
 * 4. Key Fact Statement (KFS) & Disbursal Trigger
 */

export interface OcenBorrowerProfile {
  name: string;
  mobile: string;
  pan: string;
  email?: string;
}

export interface OcenTreatmentDetails {
  clinicId: string;
  clinicName: string;
  patientId?: string;
  procedureName: string;
  invoiceAmount: number;
}

export interface OcenLoanApplicationRequest {
  borrower: OcenBorrowerProfile;
  treatment: OcenTreatmentDetails;
  productType?: 'HEALTHCARE_CHECKOUT_EMI' | 'ELECTIVE_DENTAL_FINANCING';
}

export interface OcenLenderOffer {
  offerId: string;
  lenderId: string;
  lenderName: string;
  lenderType: 'BANK' | 'NBFC';
  badge: string;
  sanctionedAmount: number;
  tenureMonths: number;
  monthlyEmi: number;
  totalRepayment: number;
  processingFee: number;
  apr: number;
  kfsUrl: string;
  isRecommended?: boolean;
}

export interface OcenApplicationState {
  applicationId: string;
  status: 'CREATED' | 'CONSENT_PENDING' | 'UNDERWRITING' | 'OFFERS_GENERATED' | 'OFFER_ACCEPTED' | 'DISBURSED';
  offers: OcenLenderOffer[];
  createdAt: string;
}

class OcenProtocolService {
  private agentId = 'CLINAZA_LA_IND_2026';
  private apiEndpoint = '/api/ocen/v4';

  /**
   * Initializes a new OCEN 4.0 Loan Application
   */
  async createLoanApplication(req: OcenLoanApplicationRequest): Promise<OcenApplicationState> {
    // In production, this calls the OCEN 4.0 Gateway or LendSure AI proxy endpoint
    console.log(`[OCEN 4.0] Initializing Loan Application for ${req.borrower.name} - Amount: ₹${req.treatment.invoiceAmount}`);
    
    // Simulate real-time OCEN 4.0 application creation
    const appId = `OCEN-LA-${Date.now().toString(36).toUpperCase()}`;

    return {
      applicationId: appId,
      status: 'CONSENT_PENDING',
      offers: [],
      createdAt: new Date().toISOString()
    };
  }

  /**
   * Triggers ULI / Account Aggregator Consent Flow
   */
  async initiateConsent(applicationId: string, pan: string, mobile: string): Promise<{ consentId: string; status: string }> {
    console.log(`[ULI Gateway] Initiating AA & Bureau Consent for App: ${applicationId}`);
    return {
      consentId: `ULI-CONSENT-${Date.now()}`,
      status: 'ACTIVE'
    };
  }

  /**
   * Aggregates real-time loan offers from OCEN Capital Providers (Banks & NBFCs)
   */
  async fetchLenderOffers(applicationId: string, amount: number): Promise<OcenLenderOffer[]> {
    console.log(`[OCEN 4.0 Engine] Aggregating capital provider offers for ₹${amount}`);
    
    return [
      {
        offerId: `OFFER-A-${Date.now()}`,
        lenderId: 'LENDER-BANK-A',
        lenderName: 'Partner Bank A',
        lenderType: 'BANK',
        badge: '0% No-Cost EMI',
        sanctionedAmount: amount,
        tenureMonths: 12,
        monthlyEmi: Math.round(amount / 12),
        totalRepayment: amount,
        processingFee: 0,
        apr: 0.0,
        kfsUrl: `https://kfs.ocen.dev/preview/bank-a-${applicationId}`,
        isRecommended: true
      },
      {
        offerId: `OFFER-B-${Date.now()}`,
        lenderId: 'LENDER-NBFC-B',
        lenderName: 'Partner NBFC B',
        lenderType: 'NBFC',
        badge: 'Instant Pre-Approval',
        sanctionedAmount: amount,
        tenureMonths: 9,
        monthlyEmi: Math.round(amount / 9),
        totalRepayment: amount,
        processingFee: Math.round(amount * 0.01),
        apr: 0.0,
        kfsUrl: `https://kfs.ocen.dev/preview/nbfc-b-${applicationId}`
      },
      {
        offerId: `OFFER-C-${Date.now()}`,
        lenderId: 'LENDER-NBFC-C',
        lenderName: 'Partner NBFC C',
        lenderType: 'NBFC',
        badge: 'Flexible Tenure',
        sanctionedAmount: amount,
        tenureMonths: 18,
        monthlyEmi: Math.round((amount * 1.09) / 18),
        totalRepayment: Math.round(amount * 1.09),
        processingFee: Math.round(amount * 0.015),
        apr: 11.5,
        kfsUrl: `https://kfs.ocen.dev/preview/nbfc-c-${applicationId}`
      }
    ];
  }

  /**
   * Accepts selected offer & triggers e-Mandate + Disbursal
   */
  async acceptOffer(applicationId: string, offerId: string): Promise<{ status: string; redirectUrl: string }> {
    console.log(`[OCEN 4.0] Offer ${offerId} accepted for App: ${applicationId}`);
    return {
      status: 'DISBURSAL_INITIATED',
      redirectUrl: `/emi/callback?client_id=ocen_clinaza_2026&status=approved&lender=Partner%20Bank%20A`
    };
  }
}

export const ocenService = new OcenProtocolService();
