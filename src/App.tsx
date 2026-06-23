import React, { useState, useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppToaster from "./components/AppToaster";
import FacebookPixelTracker from "./components/FacebookPixelTracker";
import GoogleAnalyticsTracker from "./components/GoogleAnalyticsTracker";
import { ErrorBoundary } from "./components/ui/error-boundary";
import { GlobalLoadingBar } from "./components/GlobalLoadingBar";
import NetworkStatusWrapper from "./components/NetworkStatusWrapper";
import ScrollToTop from "./components/ScrollToTop";
import AppRoutes from "./app/AppRoutes";
import { useKeyboardNavigation } from "@/lib/hooks/useKeyboardNavigation";
import { usePerformanceMonitoring, WebVitalsTracker } from "@/lib/hooks/usePerformanceMonitoring";

const APP_SHELL_VERSION = '2026-05-03-1';

const RouterInstrumentation = () => {
  usePerformanceMonitoring();
  return null;
};

const App = () => {
  // Enhanced accessibility with keyboard navigation
  useKeyboardNavigation();

  // Force unregister service worker to prevent route caching and 404 issues on APIs
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    navigator.serviceWorker.getRegistrations().then(registrations => {
      let unregisteredAny = false;
      const unregisterPromises = registrations.map(registration => {
        console.log('[App] Unregistering Service Worker:', registration.scope);
        return registration.unregister().then(success => {
          if (success) unregisteredAny = true;
        });
      });

      Promise.all(unregisterPromises).then(() => {
        if (unregisteredAny) {
          console.log('[App] Successfully unregistered Service Worker. Reloading page...');
          // Force reload to completely clear any intercepted routing state
          window.location.reload();
        }
      });
    }).catch(err => {
      console.error('[App] Failed to query service worker registrations:', err);
    });
  }, []);

  // Removed the temporary useEffect block for role update
  const [appLoaded, setAppLoaded] = useState(false);

  // Redirect hash-based public token URLs to path-based URLs (BrowserRouter uses pathname, not hash)
  useEffect(() => {
    const pathname = window.location.pathname;
    const hash = window.location.hash;
    if (pathname !== "/" || !hash || !hash.startsWith("#/")) return;
    const pathFromHash = hash.slice(1);
    const hashRouteMatch = pathFromHash.match(
      /^\/(contract-ready|ship|deal-details|deal\/brand-response|deal|proposal-sent|feedback|brand-reply|brand\/response)\/[^/]+/
    );
    if (hashRouteMatch) {
      window.location.replace(window.location.origin + pathFromHash);
    }
  }, []);

  // Mark app as loaded (prefetch removed - not needed for SPA routing)
  useEffect(() => {
    if (!appLoaded) {
      setAppLoaded(true);
    }
  }, [appLoaded]);



  // Handle OAuth errors and malformed OAuth URLs (before routing)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const errorCode = urlParams.get('error_code');
    const errorDescription = urlParams.get('error_description');

    // Check for malformed OAuth callback (tokens in pathname instead of hash)
    const pathname = window.location.pathname;
    const hasOAuthInPathname = pathname.includes('access_token=') || pathname.includes('refresh_token=');

    if (hasOAuthInPathname) {
      console.log('[App] Detected OAuth tokens in pathname, moving to hash...');

      // Extract tokens from pathname
      const tokenPart = pathname.substring(pathname.indexOf('access_token='));
      const newHash = '#' + tokenPart;

      // Clean the URL and set hash
      window.history.replaceState({}, '', '/');
      window.location.hash = newHash;

      return; // Exit early, let SessionContext handle the OAuth flow
    }

    if (error || errorCode || errorDescription) {
      // Clean the URL immediately to prevent routing to error string
      const cleanPath = window.location.pathname;
      const cleanUrl = cleanPath;
      window.history.replaceState({}, '', cleanUrl);

      // Redirect to login page where error will be displayed
      if (window.location.pathname !== '/login') {
        window.location.replace('/login');
      }
    }
  }, []);

  return (
    <ErrorBoundary>
      <GlobalLoadingBar />
      <AppToaster />

      <div className="min-h-dvh bg-[#020D0A]">
          <RouterInstrumentation />
          <ScrollToTop />
          <NetworkStatusWrapper>
            <FacebookPixelTracker />
            <GoogleAnalyticsTracker /> {/* Add GA4 tracker here */}
            <WebVitalsTracker />
            <TooltipProvider delayDuration={400}>
              <AppRoutes />
            </TooltipProvider>
          </NetworkStatusWrapper>
        </div>
    </ErrorBoundary>
  );
};

export default App;
