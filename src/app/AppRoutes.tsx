import { Routes, Route, Navigate } from "react-router-dom";
import { SessionContextProvider } from "@/contexts/SessionContext";
import { SidebarProvider } from "@/contexts/SidebarContext";
import AddToHomeScreen from "@/components/mobile/AddToHomeScreen";
import { ReactivationRoutes } from "./routes/reactivationRoutes";
import { lazy } from "react";
import { LazyRoute } from "./routes/routeElements";

const DentalTrendFinder = lazy(() => import("@/pages/DentalTrendFinder"));
const ContentWorkspace = lazy(() => import("@/pages/ContentWorkspace"));
const CrmHomepage = lazy(() => import("@/pages/CrmHomepage"));
const EmiCallbackPage = lazy(() => import("@/pages/EmiCallbackPage"));
const BlogHub = lazy(() => import("@/pages/yourdentist/BlogHub"));
const BlogArticlePage = lazy(() => import("@/pages/yourdentist/BlogArticlePage"));
const ReviewAssistant = lazy(() => import("@/pages/yourdentist/ReviewAssistant"));
const CityLandingPage = lazy(() => import("@/pages/CityLandingPage"));
const PitchDeckPage = lazy(() => import("@/pages/PitchDeckPage"));
const FreeToolsHub = lazy(() => import("@/pages/FreeToolsHub"));
const LoanDemoPage = lazy(() => import("@/pages/LoanDemoPage"));
const DentalImplantLoanPage = lazy(() => import("@/pages/DentalImplantLoanPage"));
const ClearAlignersEmiPage = lazy(() => import("@/pages/ClearAlignersEmiPage"));
const AestheticTreatmentsEmiPage = lazy(() => import("@/pages/AestheticTreatmentsEmiPage"));
const LasikEyeSurgeryEmiPage = lazy(() => import("@/pages/LasikEyeSurgeryEmiPage"));
const HairTransplantEmiPage = lazy(() => import("@/pages/HairTransplantEmiPage"));
const IvfTreatmentEmiPage = lazy(() => import("@/pages/IvfTreatmentEmiPage"));
const GynecomastiaSurgeryEmiPage = lazy(() => import("@/pages/GynecomastiaSurgeryEmiPage"));
const HearingAidsEmiPage = lazy(() => import("@/pages/HearingAidsEmiPage"));
const PilesLaserSurgeryEmiPage = lazy(() => import("@/pages/PilesLaserSurgeryEmiPage"));
const MaternityDeliveryEmiPage = lazy(() => import("@/pages/MaternityDeliveryEmiPage"));
const KidneyStoneSurgeryEmiPage = lazy(() => import("@/pages/KidneyStoneSurgeryEmiPage"));
const AclKneeSurgeryEmiPage = lazy(() => import("@/pages/AclKneeSurgeryEmiPage"));
const PartnerClinicOnboardingPage = lazy(() => import("@/pages/PartnerClinicOnboardingPage"));
const ClinicKycUploadPage = lazy(() => import("@/pages/ClinicKycUploadPage"));
const AdminClinicOnboardingsPage = lazy(() => import("@/pages/AdminClinicOnboardingsPage"));
const PartnerPipelinePreviewPage = lazy(() => import("@/pages/PartnerPipelinePreviewPage"));
const PineLabsUnderwritingPage = lazy(() => import("@/pages/PineLabsUnderwritingPage"));
const TermsPage = lazy(() => import("@/pages/TermsPage"));
const ClinicAgreementPage = lazy(() => import("@/pages/ClinicAgreementPage"));
const PrivacyPolicyPage = lazy(() => import("@/pages/PrivacyPolicyPage"));
const RefundPolicyPage = lazy(() => import("@/pages/RefundPolicyPage"));
const ShippingPolicyPage = lazy(() => import("@/pages/ShippingPolicyPage"));
const ContactUsPage = lazy(() => import("@/pages/ContactUsPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

export default function AppRoutes() {
  return (
    <SessionContextProvider>
      <SidebarProvider>
        <Routes>
          {/* Root page - Pure CRM homepage */}
          <Route 
            path="/" 
            element={
              <LazyRoute>
                <CrmHomepage />
              </LazyRoute>
            } 
          />

          {/* Dental Implant & Clear Aligner Loan Dedicated Pages */}
          <Route path="/dental-implant-loan" element={<LazyRoute><DentalImplantLoanPage /></LazyRoute>} />
          <Route path="/dental-implants-loan" element={<Navigate to="/dental-implant-loan" replace />} />
          <Route path="/clear-aligners-on-emi" element={<LazyRoute><ClearAlignersEmiPage /></LazyRoute>} />
          <Route path="/clear-aligners-cost-on-emi" element={<Navigate to="/clear-aligners-on-emi" replace />} />

          {/* Aesthetic, Dermatology & Wellness Financing Dedicated Pages */}
          <Route path="/aesthetic-treatments-on-emi" element={<LazyRoute><AestheticTreatmentsEmiPage /></LazyRoute>} />
          <Route path="/aesthetics-emi" element={<Navigate to="/aesthetic-treatments-on-emi" replace />} />
          <Route path="/aesthetics" element={<Navigate to="/aesthetic-treatments-on-emi" replace />} />
          <Route path="/derma-emi" element={<Navigate to="/aesthetic-treatments-on-emi" replace />} />

          {/* LASIK & Refractive Eye Surgery Financing Dedicated Pages */}
          <Route path="/lasik-eye-surgery-on-emi" element={<LazyRoute><LasikEyeSurgeryEmiPage /></LazyRoute>} />
          <Route path="/lasik-on-emi" element={<Navigate to="/lasik-eye-surgery-on-emi" replace />} />
          <Route path="/lasik-loan" element={<Navigate to="/lasik-eye-surgery-on-emi" replace />} />
          <Route path="/contoura-vision-on-emi" element={<Navigate to="/lasik-eye-surgery-on-emi" replace />} />

          {/* Hair Restoration (FUE/DHI) Dedicated Financing Pages */}
          <Route path="/hair-transplant-on-emi" element={<LazyRoute><HairTransplantEmiPage /></LazyRoute>} />
          <Route path="/hair-transplant-cost-on-emi" element={<Navigate to="/hair-transplant-on-emi" replace />} />
          <Route path="/hair-transplant-emi" element={<Navigate to="/hair-transplant-on-emi" replace />} />
          <Route path="/hair-transplant-loan" element={<Navigate to="/hair-transplant-on-emi" replace />} />

          {/* IVF & Fertility Treatment Dedicated Financing Pages */}
          <Route path="/ivf-treatment-on-emi" element={<LazyRoute><IvfTreatmentEmiPage /></LazyRoute>} />
          <Route path="/ivf-on-emi" element={<Navigate to="/ivf-treatment-on-emi" replace />} />
          <Route path="/ivf-cost-on-emi" element={<Navigate to="/ivf-treatment-on-emi" replace />} />
          <Route path="/fertility-loan" element={<Navigate to="/ivf-treatment-on-emi" replace />} />
          <Route path="/ivf-loan" element={<Navigate to="/ivf-treatment-on-emi" replace />} />

          {/* Gynecomastia & Male Chest Reduction Dedicated Financing Pages */}
          <Route path="/gynecomastia-surgery-on-emi" element={<LazyRoute><GynecomastiaSurgeryEmiPage /></LazyRoute>} />
          <Route path="/gynecomastia-on-emi" element={<Navigate to="/gynecomastia-surgery-on-emi" replace />} />
          <Route path="/gynecomastia-cost-on-emi" element={<Navigate to="/gynecomastia-surgery-on-emi" replace />} />
          <Route path="/male-chest-reduction-emi" element={<Navigate to="/gynecomastia-surgery-on-emi" replace />} />
          <Route path="/gynecomastia-loan" element={<Navigate to="/gynecomastia-surgery-on-emi" replace />} />

          {/* Digital Hearing Aids & Audiology Dedicated Financing Pages */}
          <Route path="/hearing-aids-on-emi" element={<LazyRoute><HearingAidsEmiPage /></LazyRoute>} />
          <Route path="/hearing-aid-on-emi" element={<Navigate to="/hearing-aids-on-emi" replace />} />
          <Route path="/hearing-aid-loan" element={<Navigate to="/hearing-aids-on-emi" replace />} />
          <Route path="/hearing-aids-loan" element={<Navigate to="/hearing-aids-on-emi" replace />} />

          {/* Laser Proctology (Piles, Fistula, Fissure) Dedicated Financing Pages */}
          <Route path="/piles-laser-surgery-on-emi" element={<LazyRoute><PilesLaserSurgeryEmiPage /></LazyRoute>} />
          <Route path="/laser-piles-surgery-on-emi" element={<Navigate to="/piles-laser-surgery-on-emi" replace />} />
          <Route path="/piles-surgery-on-emi" element={<Navigate to="/piles-laser-surgery-on-emi" replace />} />
          <Route path="/piles-on-emi" element={<Navigate to="/piles-laser-surgery-on-emi" replace />} />
          <Route path="/fistula-laser-surgery-on-emi" element={<Navigate to="/piles-laser-surgery-on-emi" replace />} />

          {/* Maternity & Delivery Hospital Packages Dedicated Financing Pages */}
          <Route path="/maternity-delivery-on-emi" element={<LazyRoute><MaternityDeliveryEmiPage /></LazyRoute>} />
          <Route path="/maternity-hospital-emi" element={<Navigate to="/maternity-delivery-on-emi" replace />} />
          <Route path="/delivery-on-emi" element={<Navigate to="/maternity-delivery-on-emi" replace />} />
          <Route path="/c-section-delivery-on-emi" element={<Navigate to="/maternity-delivery-on-emi" replace />} />
          <Route path="/maternity-loan" element={<Navigate to="/maternity-delivery-on-emi" replace />} />

          {/* Kidney Stone Laser & Urology Surgery Dedicated Financing Pages */}
          <Route path="/kidney-stone-laser-surgery-on-emi" element={<LazyRoute><KidneyStoneSurgeryEmiPage /></LazyRoute>} />
          <Route path="/kidney-stone-surgery-on-emi" element={<Navigate to="/kidney-stone-laser-surgery-on-emi" replace />} />
          <Route path="/rirs-laser-surgery-on-emi" element={<Navigate to="/kidney-stone-laser-surgery-on-emi" replace />} />
          <Route path="/circumcision-on-emi" element={<Navigate to="/kidney-stone-laser-surgery-on-emi" replace />} />
          <Route path="/zsr-circumcision-emi" element={<Navigate to="/kidney-stone-laser-surgery-on-emi" replace />} />

          {/* Knee Arthroscopy & ACL Sports Surgery Dedicated Financing Pages */}
          <Route path="/acl-knee-surgery-on-emi" element={<LazyRoute><AclKneeSurgeryEmiPage /></LazyRoute>} />
          <Route path="/acl-surgery-on-emi" element={<Navigate to="/acl-knee-surgery-on-emi" replace />} />
          <Route path="/knee-arthroscopy-on-emi" element={<Navigate to="/acl-knee-surgery-on-emi" replace />} />
          <Route path="/acl-reconstruction-loan" element={<Navigate to="/acl-knee-surgery-on-emi" replace />} />

          {/* Direct WhatsApp Share & Demo Links for Loan */}
          <Route path="/loan" element={<Navigate to="/#check-eligibility" replace />} />
          <Route path="/loans" element={<Navigate to="/#check-eligibility" replace />} />
          <Route path="/apply" element={<Navigate to="/#check-eligibility" replace />} />
          <Route path="/checkout-flow" element={<LazyRoute><LoanDemoPage /></LazyRoute>} />
          <Route path="/checkout-demo" element={<Navigate to="/checkout-flow" replace />} />
          <Route path="/demo/loan" element={<LazyRoute><LoanDemoPage /></LazyRoute>} />
          <Route path="/clinic-onboarding" element={<LazyRoute><PartnerClinicOnboardingPage /></LazyRoute>} />
          <Route path="/clinic-kyc" element={<LazyRoute><ClinicKycUploadPage /></LazyRoute>} />
          <Route path="/clinic-onboarding/kyc" element={<Navigate to="/clinic-kyc" replace />} />
          <Route path="/pilot-onboarding" element={<Navigate to="/clinic-onboarding" replace />} />
          <Route path="/clinic-pilot" element={<Navigate to="/clinic-onboarding" replace />} />
          <Route path="/admin/clinics" element={<LazyRoute><AdminClinicOnboardingsPage /></LazyRoute>} />
          <Route path="/partner-pipeline" element={<LazyRoute><PartnerPipelinePreviewPage /></LazyRoute>} />
          <Route path="/pipeline" element={<Navigate to="/partner-pipeline" replace />} />

          {/* Pine Labs Plural Partner Underwriting Desk */}
          <Route path="/partner/underwriting" element={<LazyRoute><PineLabsUnderwritingPage /></LazyRoute>} />
          <Route path="/underwriting" element={<Navigate to="/partner/underwriting" replace />} />
          <Route path="/pinelabs-portal" element={<Navigate to="/partner/underwriting" replace />} />

          {/* Review Assistant Landing Page */}
          <Route path="/review/assist" element={<LazyRoute><ReviewAssistant /></LazyRoute>} />

          {/* Free Practice & Patient Utilities Suite */}
          <Route path="/tools" element={<LazyRoute><FreeToolsHub /></LazyRoute>} />
          <Route path="/rx" element={<LazyRoute><FreeToolsHub /></LazyRoute>} />
          <Route path="/calculator" element={<LazyRoute><FreeToolsHub /></LazyRoute>} />
          <Route path="/costing" element={<LazyRoute><FreeToolsHub /></LazyRoute>} />

          {/* Clinaza SEO Patient & Clinic Guides */}
          <Route path="/blog" element={<LazyRoute><BlogHub /></LazyRoute>} />
          <Route path="/blog/:slug" element={<LazyRoute><BlogArticlePage /></LazyRoute>} />

          {/* City-specific Landing Pages â all Indian cities */}
          <Route path="/cities/:city" element={<LazyRoute><CityLandingPage /></LazyRoute>} />

          {/* Vrozart Partnership Pitch Deck */}
          <Route path="/deck" element={<LazyRoute><PitchDeckPage /></LazyRoute>} />

          {/* Legacy Redirects for SEO Continuity */}
          <Route path="/yourdentist/blog" element={<Navigate to="/blog" replace />} />
          <Route path="/yourdentist/blog/:slug" element={<Navigate to="/blog" replace />} />

          <Route path="/dental-trends" element={<LazyRoute><DentalTrendFinder /></LazyRoute>} />
          <Route path="/dentist-proposal" element={<LazyRoute><ContentWorkspace /></LazyRoute>} />
          <Route path="/emi/callback" element={<LazyRoute><EmiCallbackPage /></LazyRoute>} />

          {/* Reactivation Dashboard Portal Routes */}
          {ReactivationRoutes()}

          {/* Mandatory Regulatory & Legal Compliance Routes (Razorpay / Easebuzz / RBI / MeitY) */}
          <Route path="/clinic-agreement" element={<LazyRoute><ClinicAgreementPage /></LazyRoute>} />
          <Route path="/sub-merchant-terms" element={<Navigate to="/clinic-agreement" replace />} />
          <Route path="/sub-merchant-agreement" element={<Navigate to="/clinic-agreement" replace />} />
          <Route path="/terms" element={<LazyRoute><TermsPage /></LazyRoute>} />
          <Route path="/terms-and-conditions" element={<Navigate to="/terms" replace />} />
          <Route path="/privacy" element={<LazyRoute><PrivacyPolicyPage /></LazyRoute>} />
          <Route path="/privacy-policy" element={<Navigate to="/privacy" replace />} />
          <Route path="/refund-policy" element={<LazyRoute><RefundPolicyPage /></LazyRoute>} />
          <Route path="/cancellation-policy" element={<Navigate to="/refund-policy" replace />} />
          <Route path="/shipping-policy" element={<LazyRoute><ShippingPolicyPage /></LazyRoute>} />
          <Route path="/delivery-policy" element={<Navigate to="/shipping-policy" replace />} />
          <Route path="/contact" element={<LazyRoute><ContactUsPage /></LazyRoute>} />
          <Route path="/contact-us" element={<Navigate to="/contact" replace />} />

          {/* Direct Login Alias */}
          <Route path="/login" element={<Navigate to="/reactivation/login" replace />} />

          {/* Fallback wildcard route */}
          <Route path="*" element={<LazyRoute><NotFoundPage /></LazyRoute>} />
        </Routes>
        <AddToHomeScreen />
      </SidebarProvider>
    </SessionContextProvider>
  );
}
