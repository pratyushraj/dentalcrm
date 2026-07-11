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
const EmiOnboardPage = lazy(() => import("@/pages/EmiOnboardPage"));
const BlogHub = lazy(() => import("@/pages/yourdentist/BlogHub"));
const BlogArticlePage = lazy(() => import("@/pages/yourdentist/BlogArticlePage"));
const ReviewAssistant = lazy(() => import("@/pages/yourdentist/ReviewAssistant"));

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

          {/* Review Assistant Landing Page */}
          <Route path="/review/assist" element={<LazyRoute><ReviewAssistant /></LazyRoute>} />

          {/* YOUR DENTIST Patna SEO Patient Guides */}
          <Route path="/yourdentist/blog" element={<LazyRoute><BlogHub /></LazyRoute>} />
          <Route path="/yourdentist/blog/:slug" element={<LazyRoute><BlogArticlePage /></LazyRoute>} />

          <Route path="/dental-trends" element={<LazyRoute><DentalTrendFinder /></LazyRoute>} />
          <Route path="/dentist-proposal" element={<LazyRoute><ContentWorkspace /></LazyRoute>} />
          <Route path="/emi/callback" element={<LazyRoute><EmiCallbackPage /></LazyRoute>} />
          <Route path="/emi/onboard" element={<LazyRoute><EmiOnboardPage /></LazyRoute>} />

          {/* Reactivation Dashboard Portal Routes */}
          {ReactivationRoutes()}

          {/* Fallback wildcard route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <AddToHomeScreen />
      </SidebarProvider>
    </SessionContextProvider>
  );
}
