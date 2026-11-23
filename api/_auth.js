import { createHmac, timingSafeEqual, randomBytes } from 'crypto';

// Strictly derive accepted PINs from environment variables - zero hardcoded fallback in git
export function getAcceptedPins() {
  return [
    process.env.PARTNER_DESK_PIN,
    process.env.UNDERWRITING_PIN
  ].filter(Boolean);
}

// Strictly derive session secret from environment variables
const runtimeSecret = randomBytes(32).toString('hex');
export function getSessionSecret() {
  if (process.env.UNDERWRITING_SESSION_SECRET) {
    return process.env.UNDERWRITING_SESSION_SECRET;
  }
  if (process.env.NODE_ENV === 'production' && !process.env.UNDERWRITING_SESSION_SECRET) {
    console.warn('WARNING: UNDERWRITING_SESSION_SECRET is not configured in production. Using ephemeral session secret.');
  }
  return runtimeSecret;
}

export const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

// Shared in-memory rate limiting for brute-force protection
const failedAttempts = new Map();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 mins

export function isRateLimited(ip) {
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

export function recordFailedAttempt(ip) {
  if (!ip) return;
  const now = Date.now();
  const record = failedAttempts.get(ip);
  if (!record || now - record.startTime > RATE_LIMIT_WINDOW_MS) {
    failedAttempts.set(ip, { count: 1, startTime: now });
  } else {
    record.count += 1;
  }
}

export function resetFailedAttempts(ip) {
  if (ip) failedAttempts.delete(ip);
}

export function verifyPin(inputPin) {
  if (typeof inputPin !== 'string' || !inputPin.trim()) return false;
  const trimmed = inputPin.trim();
  const accepted = getAcceptedPins();
  if (accepted.length === 0) {
    console.error('CRITICAL: No underwriting PIN configured in environment.');
    return false;
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
    if (payload.exp && payload.exp > Date.now()) {
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
      cookies[parts[0].trim()] = decodeURIComponent(parts.slice(1).join('=').trim());
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
