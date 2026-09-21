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

          {/* Dental Implant Loan Dedicated Page */}
          <Route path="/dental-implant-loan" element={<LazyRoute><DentalImplantLoanPage /></LazyRoute>} />
          <Route path="/dental-implants-loan" element={<Navigate to="/dental-implant-loan" replace />} />

          {/* Direct WhatsApp Share & Demo Links for Loan */}
          <Route path="/loan" element={<Navigate to="/#check-eligibility" replace />} />
          <Route path="/loans" element={<Navigate to="/#check-eligibility" replace />} />
          <Route path="/apply" element={<Navigate to="/#check-eligibility" replace />} />
          <Route path="/demo/loan" element={<LazyRoute><LoanDemoPage /></LazyRoute>} />
          <Route path="/loan/demo" element={<LazyRoute><LoanDemoPage /></LazyRoute>} />

          {/* Review Assistant Landing Page */}
          <Route path="/review/assist" element={<LazyRoute><ReviewAssistant /></LazyRoute>} />

          {/* Free Practice & Patient Utilities Suite */}
          <Route path="/tools" element={<LazyRoute><FreeToolsHub /></LazyRoute>} />
          <Route path="/rx" element={<LazyRoute><FreeToolsHub /></LazyRoute>} />
          <Route path="/calculator" element={<LazyRoute><FreeToolsHub /></LazyRoute>} />

          {/* Clinaza SEO Patient & Clinic Guides */}
          <Route path="/blog" element={<LazyRoute><BlogHub /></LazyRoute>} />
          <Route path="/blog/:slug" element={<LazyRoute><BlogArticlePage /></LazyRoute>} />

          {/* City-specific Landing Pages – all Indian cities */}
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

          {/* Direct Login Alias */}
          <Route path="/login" element={<Navigate to="/reactivation/login" replace />} />

          {/* Fallback wildcard route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <AddToHomeScreen />
      </SidebarProvider>
    </SessionContextProvider>
  );
}
