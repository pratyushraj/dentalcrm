

import React, { Component, ReactNode } from 'react';
import { ErrorFallback } from './ErrorFallback';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  variant?: 'full' | 'inline' | 'modal';
  title?: string;
  description?: string;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);

    const isChunkError = Boolean(
      error?.message?.includes('Failed to fetch dynamically imported module') ||
      error?.message?.includes('Importing a module script failed') ||
      error?.message?.includes('Loading chunk') ||
      error?.message?.includes('error loading dynamically imported module') ||
      error?.message?.includes('MIME type of "text/html"') ||
      error?.name === 'ChunkLoadError'
    );

    if (isChunkError) {
      const lastReload = Number(sessionStorage.getItem('clinaza-chunk-reload-ts') || 0);
      const now = Date.now();
      if (now - lastReload > 10000) {
        sessionStorage.setItem('clinaza-chunk-reload-ts', String(now));
        window.location.reload();
        return;
      }
    }
    
    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // TODO: Log to error tracking service (e.g., Sentry)
    // if (window.Sentry) {
    //   window.Sentry.captureException(error, { contexts: { react: errorInfo } });
    // }
  }

  handleReset = () => {
    const isChunkError = Boolean(
      this.state.error?.message?.includes('Failed to fetch dynamically imported module') ||
      this.state.error?.message?.includes('Importing a module script failed') ||
      this.state.error?.message?.includes('Loading chunk') ||
      this.state.error?.message?.includes('error loading dynamically imported module') ||
      this.state.error?.message?.includes('MIME type of "text/html"') ||
      this.state.error?.name === 'ChunkLoadError'
    );

    if (isChunkError) {
      window.location.reload();
      return;
    }

    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback
          error={this.state.error}
          resetError={this.handleReset}
          variant={this.props.variant || 'inline'}
          title={this.props.title}
          description={this.props.description}
        />
      );
    }

    return this.props.children;
  }
}

