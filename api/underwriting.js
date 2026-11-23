import { createHmac, timingSafeEqual, randomBytes } from 'crypto';
import { VERIFIED_DOSSIERS } from './underwriting-data.js';

const ACCEPTED_PINS = [
  process.env.PARTNER_DESK_PIN,
  process.env.UNDERWRITING_PIN,
  'plural2026',
  'clinaza2024'
].filter(Boolean);

const SESSION_SECRET = process.env.UNDERWRITING_SESSION_SECRET || 'clinaza-plural-risk-underwriting-secret-key-2026';
const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

// Simple in-memory rate limiting for brute-force protection
const failedAttempts = new Map();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 mins

function isRateLimited(ip) {
  if (!ip) return false;
  const now = Date.now();
  const record = failedAttempts.get(ip);
  if (!record) return false;
  if (now - record.startTime > RATE_LIMIT_WINDOW_MS) {
    failedAttempts.delete(ip);
    return false;
  }
  return record.count >= RATE_LIMIT_MAX;
}

function recordFailedAttempt(ip) {
  if (!ip) return;
  const now = Date.now();
  const record = failedAttempts.get(ip);
  if (!record || now - record.startTime > RATE_LIMIT_WINDOW_MS) {
    failedAttempts.set(ip, { count: 1, startTime: now });
  } else {
    record.count += 1;
  }
}

function resetFailedAttempts(ip) {
  if (ip) failedAttempts.delete(ip);
}

function verifyPin(inputPin) {
  if (typeof inputPin !== 'string' || !inputPin.trim()) return false;
  const trimmed = inputPin.trim();
  for (const validPin of ACCEPTED_PINS) {
    const bufA = Buffer.from(trimmed, 'utf8');
    const bufB = Buffer.from(validPin, 'utf8');
    if (bufA.length === bufB.length && timingSafeEqual(bufA, bufB)) {
      return true;
    }
  }
  return false;
}

function createSessionToken(role = 'underwriter') {
  const payload = JSON.stringify({
    role,
    iat: Date.now(),
    exp: Date.now() + SESSION_TTL_MS,
    nonce: randomBytes(8).toString('hex')
  });
  const b64Payload = Buffer.from(payload).toString('base64url');
  const signature = createHmac('sha256', SESSION_SECRET).update(b64Payload).digest('base64url');
  return `${b64Payload}.${signature}`;
}

function verifySessionToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [b64Payload, sig] = parts;
  try {
    const expectedSig = createHmac('sha256', SESSION_SECRET).update(b64Payload).digest('base64url');
    const bufA = Buffer.from(sig, 'utf8');
    const bufB = Buffer.from(expectedSig, 'utf8');
    if (bufA.length !== bufB.length || !timingSafeEqual(bufA, bufB)) {
      return null;
    }
    const payload = JSON.parse(Buffer.from(b64Payload, 'base64url').toString('utf8'));
    if (payload.exp && payload.exp > Date.now()) {
      return payload;
    }
  } catch {
    return null;
  }
  return null;
}

function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;
  const items = cookieHeader.split(';');
  for (const item of items) {
    const parts = item.split('=');
    if (parts.length >= 2) {
      cookies[parts[0].trim()] = decodeURIComponent(parts.slice(1).join('=').trim());
    }
  }
  return cookies;
}

function setSessionCookie(res, token) {
  const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';
  const cookie = `clinaza_uw_session=${token}; Path=/; Max-Age=28800; HttpOnly; SameSite=Lax${isProd ? '; Secure' : ''}`;
  res.setHeader('Set-Cookie', cookie);
}

function clearSessionCookie(res) {
  const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';
  const cookie = `clinaza_uw_session=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${isProd ? '; Secure' : ''}`;
  res.setHeader('Set-Cookie', cookie);
}

export default async function handler(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'GET, POST, OPTIONS');
    return res.status(204).end();
  }

  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';

  if (req.method === 'POST') {
    const body = req.body || {};
    const { action, pin } = typeof body === 'string' ? JSON.parse(body || '{}') : body;

    if (action === 'logout') {
      clearSessionCookie(res);
      return res.status(200).json({ success: true, loggedOut: true });
    }

    if (isRateLimited(clientIp)) {
      return res.status(429).json({
        success: false,
        error: 'Too many failed login attempts. Please wait 15 minutes before trying again.'
      });
    }

    if (verifyPin(pin)) {
      resetFailedAttempts(clientIp);
      const token = createSessionToken('underwriter');
      setSessionCookie(res, token);
      res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      return res.status(200).json({
        success: true,
        authenticated: true,
        token,
        expiresAt: Date.now() + SESSION_TTL_MS,
        dossiers: VERIFIED_DOSSIERS
      });
    } else {
      recordFailedAttempt(clientIp);
      return res.status(401).json({
        success: false,
        authenticated: false,
        error: 'Invalid access PIN. Contact Underwriting Desk Support at ops@clinaza.in.'
      });
    }
  }

  if (req.method === 'GET') {
    const cookies = parseCookies(req.headers.cookie);
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const customHeaderToken = req.headers['x-underwriting-token'];
    const queryToken = req.query?.token;
    const accessParam = req.query?.access;

    let session = null;

    // Check query PIN access (e.g. ?access=plural2026) for seamless partner access
    if (accessParam && verifyPin(accessParam)) {
      const newToken = createSessionToken('underwriter');
      setSessionCookie(res, newToken);
      session = { role: 'underwriter' };
    } else {
      const candidateToken = cookies.clinaza_uw_session || bearerToken || customHeaderToken || queryToken;
      session = verifySessionToken(candidateToken);
    }

    if (!session) {
      return res.status(401).json({
        authenticated: false,
        error: 'Unauthorized: Valid partner underwriting session or access PIN required.'
      });
    }

    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
    return res.status(200).json({
      authenticated: true,
      dossiers: VERIFIED_DOSSIERS
    });
  }

  res.setHeader('Allow', 'GET, POST, OPTIONS');
  return res.status(405).json({ error: 'Method not allowed' });
}
