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
const DentistWebsite = lazy(() => import("@/pages/DentistWebsite"));

export default function AppRoutes() {
  const isDentistDomain = typeof window !== 'undefined' && (
    window.location.hostname.toLowerCase().includes('yourdentistpatna') ||
    window.location.hostname.toLowerCase().includes('yourdentist') ||
    window.location.search.includes('domain=dentist')
  );

  return (
    <SessionContextProvider>
      <SidebarProvider>
        <Routes>
          {/* Root page - Conditional based on domain */}
          <Route 
            path="/" 
            element={
              <LazyRoute>
                {isDentistDomain ? <DentistWebsite /> : <CrmHomepage />}
              </LazyRoute>
            } 
          />

          {/* Dental Clinic Landing Pages */}
          <Route path="/dentist-website" element={<LazyRoute><DentistWebsite /></LazyRoute>} />
          <Route path="/dental-trends" element={<LazyRoute><DentalTrendFinder /></LazyRoute>} />
          <Route path="/dentist-proposal" element={<LazyRoute><ContentWorkspace /></LazyRoute>} />

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
