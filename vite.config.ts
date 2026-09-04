import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig(() => ({
  server: {
    host: true,
    port: 8080,
    strictPort: true,
    allowedHosts: [
      'localhost',
      '.trycloudflare.com',
      '.ngrok.io',
      '.framer.wtf',
    ],
    hmr: {
      overlay: false,
    },
    headers: {
      'Permissions-Policy': 'accelerometer=(self "https://api.razorpay.com"), gyroscope=(self "https://api.razorpay.com"), magnetometer=(self "https://api.razorpay.com"), payment=(self)',
      'Cross-Origin-Resource-Policy': 'cross-origin'
    },
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
        secure: false,
      },
      '/supabase-proxy': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  build: {
    sourcemap: false,
    assetsDir: 'assets',
    chunkSizeWarningLimit: 1000,
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          // Framer Motion — animations only
          if (id.includes('framer-motion')) return 'vendor-framer';

          // TanStack Query — data fetching
          if (id.includes('@tanstack')) return 'vendor-query';

          // Keep ALL react-* together to avoid TDZ circular init errors
          if (id.includes('react') || id.includes('scheduler')) return 'vendor-react';

          // Supabase — auth & DB, only loaded on authenticated pages
          if (id.includes('@supabase')) return 'vendor-supabase';

          // PDF / document generation — heavy, only on export actions
          if (
            id.includes('jspdf') ||
            id.includes('jszip') ||
            id.includes('pizzip') ||
            id.includes('docxtemplater') ||
            id.includes('html2canvas') ||
            id.includes('pdfkit')
          ) return 'vendor-docs';

          // Sentry monitoring — background, non-critical
          if (id.includes('@sentry')) return 'vendor-sentry';

          // Everything else including recharts, redux, lucide, radix, date-fns
          // (recharts/redux share React internals — splitting causes circular chunks)
          return 'vendor';
        }
      }
    }
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query'],
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'framer-motion',
      'lucide-react',
    ],
  },
}))
