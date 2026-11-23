export function getServerSupabaseConfig() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Server database credentials are unavailable');
  return { url: url.replace(/\/$/, ''), key };
}

export async function supabaseRequest(path, options = {}) {
  const { url, key } = getServerSupabaseConfig();
  return fetch(`${url}${path}`, {
    ...options,
    headers: { apikey: key, Authorization: `Bearer ${key}`, ...options.headers },
    signal: AbortSignal.timeout(5000),
  });
}

export function protectedDocumentUrl(value) {
  if (typeof value !== 'string' || !value) return '';
  let path = value.startsWith('/docs/kyc/') ? value.slice('/docs/kyc/'.length) : '';
  if (!path) {
    try {
      const url = new URL(value);
      const { url: origin } = getServerSupabaseConfig();
      if (url.origin !== new URL(origin).origin) return '';
      const match = url.pathname.match(/^\/storage\/v1\/object\/(?:public|sign|authenticated)\/clinic-documents\/(.+)$/);
      path = match ? decodeURIComponent(match[1]) : '';
    } catch { return ''; }
  } else {
    try { path = decodeURIComponent(path); } catch { return ''; }
  }
  if (!path || path.includes('..') || /[\u0000-\u001f\\]/.test(path)) return '';
  return `/docs/kyc/${path.split('/').map(encodeURIComponent).join('/')}`;
}
