/**
 * ErrorFallback Component
 * 
 * Premium error fallback UI using design system tokens
 * Used by ErrorBoundary components throughout the app
 */

import React, { useEffect, useState } from 'react';
import { AlertTriangle, RefreshCw, Home, Sparkles } from 'lucide-react';
import { BaseCard } from '@/components/ui/card-variants';
import { typography, spacing, iconSizes, buttons, gradients } from '@/lib/design-system';
import { motion } from 'framer-motion';

const isDebugEnabled = () => {
  if (import.meta.env.DEV) return true;
  try {
    const params = new URLSearchParams(window.location.search);
    return params.has('debug') || params.get('debug') === '1';
  } catch {
    return false;
  }
};

interface ErrorFallbackProps {
  error: Error | null;
  resetError: () => void;
  variant?: 'full' | 'inline' | 'modal';
  title?: string;
  description?: string;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
  variant = 'full',
  title,
  description,
}) => {
  const debug = isDebugEnabled();

  const isChunkError = Boolean(
    error?.message?.includes('Failed to fetch dynamically imported module') ||
    error?.message?.includes('Importing a module script failed') ||
    error?.message?.includes('Loading chunk') ||
    error?.message?.includes('error loading dynamically imported module') ||
    error?.message?.includes('MIME type of "text/html"') ||
    error?.name === 'ChunkLoadError'
  );

  const [isAutoReloading, setIsAutoReloading] = useState(false);

  useEffect(() => {
    if (!isChunkError) return;
    const lastReload = Number(sessionStorage.getItem('clinaza-chunk-reload-ts') || 0);
    const now = Date.now();
    // Guard against reload loops; auto-reload at most once every 10 seconds
    if (now - lastReload > 10000) {
      sessionStorage.setItem('clinaza-chunk-reload-ts', String(now));
      setIsAutoReloading(true);
      const timer = setTimeout(() => {
        window.location.reload();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isChunkError]);

  const handleRetry = () => {
    if (isChunkError) {
      window.location.reload();
    } else {
      resetError();
    }
  };

  const handleGoHome = () => {
    resetError();
    window.location.href = '/';
  };

  const handleCopyError = async () => {
    const payload = [
      `Title: ${title || (isChunkError ? 'New Version Available' : 'Something went wrong')}`,
      error ? `Name: ${error.name}` : '',
      error ? `Message: ${error.message}` : '',
      error?.stack ? `Stack:\n${error.stack}` : '',
    ].filter(Boolean).join('\n');

    try {
      await navigator.clipboard.writeText(payload);
    } catch {
      // Clipboard may be blocked; ignore.
    }
  };

  const resolvedTitle = title || (
    isChunkError
      ? (isAutoReloading ? 'Updating Clinaza...' : 'New Version Available')
      : 'Something went wrong'
  );

  const resolvedDescription = description || (
    isChunkError
      ? (isAutoReloading 
          ? 'A newer version of Clinaza has been deployed. Refreshing your browser to load the latest features...'
          : 'A new deployment is active. Please reload your browser to load the latest features.')
      : (error?.message || 'An unexpected error occurred. Please try again.')
  );

  const content = (
    <div className="text-center text-muted-foreground dark:text-foreground">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
          isChunkError 
            ? 'bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 shadow-sm'
            : 'bg-destructive/15 border border-destructive/20 text-destructive'
        }`}
      >
        {isChunkError ? (
          <RefreshCw className={`${iconSizes.xl} ${isAutoReloading ? 'animate-spin' : ''}`} />
        ) : (
          <AlertTriangle className={`${iconSizes.xl}`} />
        )}
      </motion.div>
      
      <h2 className={`${typography.h3} mb-2 text-foreground font-bold tracking-tight`}>
        {resolvedTitle}
      </h2>
      
      <p className={`${typography.bodySmall} mb-6 max-w-md mx-auto text-muted-foreground dark:text-foreground/80 leading-relaxed`}>
        {resolvedDescription}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          type="button"
          onClick={handleRetry}
          className={`${buttons.primary} flex items-center justify-center gap-2`}
        >
          <RefreshCw className={`${iconSizes.md} ${isAutoReloading ? 'animate-spin' : ''}`} />
          {isChunkError 
            ? (isAutoReloading ? 'Reloading...' : 'Reload App')
            : 'Try Again'
          }
        </button>
        
        <button
          type="button"
          onClick={handleGoHome}
          className={`${buttons.secondary} flex items-center justify-center gap-2`}
        >
          <Home className={iconSizes.md} />
          Go to Clinaza Home
        </button>
      </div>

      {debug && error && (
        <details className="mt-6 text-left max-w-2xl mx-auto">
          <summary className={`${typography.caption} cursor-pointer mb-2 text-muted-foreground dark:text-foreground/70`}>
            Error Details
          </summary>
          <div className="flex items-center justify-end mb-2">
            <button
              type="button"
              onClick={() => void handleCopyError()}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-background text-muted-foreground dark:border-border dark:bg-card dark:hover:bg-secondary/50 dark:text-foreground"
            >
              Copy Error
            </button>
          </div>
          <pre className={`${typography.caption} bg-background/5 dark:bg-card p-4 rounded-lg overflow-auto max-h-48 text-muted-foreground dark:text-foreground/80`}>
            {error.stack || error.toString()}
          </pre>
        </details>
      )}
    </div>
  );

  if (variant === 'inline') {
    return (
      <BaseCard variant="secondary" className={spacing.cardPadding.secondary}>
        {content}
      </BaseCard>
    );
  }

  if (variant === 'modal') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <BaseCard variant="primary" className="max-w-md w-full shadow-2xl">
          {content}
        </BaseCard>
      </div>
    );
  }

  // Full page variant
  return (
    <div className={`nb-screen-height ${gradients.page} flex items-center justify-center ${spacing.page}`}>
      <BaseCard variant="primary" className="max-w-lg w-full shadow-2xl">
        {content}
      </BaseCard>
    </div>
  );
};
