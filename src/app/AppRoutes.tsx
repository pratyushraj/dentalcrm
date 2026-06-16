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

export default function AppRoutes() {
  return (
    <SessionContextProvider>
      <SidebarProvider>
        <Routes>
          {/* Root page - CRM Homepage */}
          <Route path="/" element={<LazyRoute><CrmHomepage /></LazyRoute>} />

          {/* Dental Clinic Landing Pages */}

          <Route path="/dental-trends" element={<LazyRoute><DentalTrendFinder /></LazyRoute>} />
          <Route path="/dentist-proposal" element={<LazyRoute><ContentWorkspace /></LazyRoute>} />

          {/* Reactivation Dashboard Portal Routes */}
          {ReactivationRoutes()}
        </Routes>
        <AddToHomeScreen />
      </SidebarProvider>
    </SessionContextProvider>
  );
}
