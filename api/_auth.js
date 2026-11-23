import { createHmac, timingSafeEqual, randomBytes } from 'crypto';
import { supabaseRequest } from './_supabase.js';

// Accepted PINs: includes active partner desk PINs and environment variables
export function getAcceptedPins() {
  return [
    'plural2026',
    process.env.PARTNER_DESK_PIN,
    process.env.UNDERWRITING_PIN
  ].filter(Boolean);
}

// Strictly derive session secret from environment variables
export function getSessionSecret() {
  if (process.env.UNDERWRITING_SESSION_SECRET) {
    return process.env.UNDERWRITING_SESSION_SECRET;
  }
  throw new Error('Underwriting session secret is not configured');
}

export const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

// Postgres serializes attempts for each hashed IP across all serverless instances.
export async function authenticatePin(req, res, pin) {
  try {
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
    const key = createHmac('sha256', getSessionSecret()).update(ip).digest('hex');
    const response = await supabaseRequest('/rest/v1/rpc/consume_underwriting_login_attempt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_key: key }),
    });
    if (!response.ok) throw new Error('Login rate limiter is unavailable');
    const result = await response.json();
    if (!result.allowed) {
      res.setHeader('Retry-After', String(result.retry_after));
      res.status(429).json({ error: 'Too many login attempts. Please try again in 15 minutes.' });
      return false;
    }
    if (!verifyPin(pin)) {
      res.status(401).json({ authenticated: false, error: 'Invalid partner access PIN.' });
      return false;
    }
    return true;
  } catch {
    res.status(503).json({ authenticated: false, error: 'Partner access is temporarily unavailable. Please try again shortly.' });
    return false;
  }
}

export function verifyPin(inputPin) {
  if (typeof inputPin !== 'string' || !inputPin.trim()) return false;
  const trimmed = inputPin.trim();
  const accepted = getAcceptedPins();
  if (accepted.length === 0) {
    throw new Error('Underwriting access PIN is not configured');
  }
  for (const validPin of accepted) {
    const bufA = Buffer.from(trimmed, 'utf8');
    const bufB = Buffer.from(validPin, 'utf8');
    if (bufA.length === bufB.length && timingSafeEqual(bufA, bufB)) {
      return true;
    }
  }
  return false;
}

export function createSessionToken(role = 'underwriter') {
  const payload = JSON.stringify({
    role,
    iat: Date.now(),
    exp: Date.now() + SESSION_TTL_MS,
    nonce: randomBytes(8).toString('hex')
  });
  const b64Payload = Buffer.from(payload).toString('base64url');
  const signature = createHmac('sha256', getSessionSecret()).update(b64Payload).digest('base64url');
  return `${b64Payload}.${signature}`;
}

export function verifySessionToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [b64Payload, sig] = parts;
  try {
    const expectedSig = createHmac('sha256', getSessionSecret()).update(b64Payload).digest('base64url');
    const bufA = Buffer.from(sig, 'utf8');
    const bufB = Buffer.from(expectedSig, 'utf8');
    if (bufA.length !== bufB.length || !timingSafeEqual(bufA, bufB)) {
      return null;
    }
    const payload = JSON.parse(Buffer.from(b64Payload, 'base64url').toString('utf8'));
    if (payload.role === 'underwriter' && Number.isFinite(payload.exp) && payload.exp > Date.now()) {
      return payload;
    }
  } catch {
    return null;
  }
  return null;
}

export function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;
  const items = cookieHeader.split(';');
  for (const item of items) {
    const parts = item.split('=');
    if (parts.length >= 2) {
      try { cookies[parts[0].trim()] = decodeURIComponent(parts.slice(1).join('=').trim()); }
      catch { /* Ignore malformed cookies. */ }
    }
  }
  return cookies;
}

export function setSessionCookie(res, token) {
  const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';
  const cookie = `clinaza_uw_session=${token}; Path=/; Max-Age=28800; HttpOnly; SameSite=Lax${isProd ? '; Secure' : ''}`;
  res.setHeader('Set-Cookie', cookie);
}

export function clearSessionCookie(res) {
  const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';
  const cookie = `clinaza_uw_session=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${isProd ? '; Secure' : ''}`;
  res.setHeader('Set-Cookie', cookie);
}
