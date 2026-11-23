import { readFile, stat } from 'node:fs/promises';
import { join, resolve, normalize, basename, extname } from 'node:path';
import {
  verifyPin,
  createSessionToken,
  verifySessionToken,
  isRateLimited,
  recordFailedAttempt,
  resetFailedAttempts,
  parseCookies,
  setSessionCookie
} from './_auth.js';

const MIME_TYPES = {
  '.pdf': 'application/pdf',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.zip': 'application/zip'
};

const ALLOWED_EXTS = new Set(Object.keys(MIME_TYPES));

export default async function handler(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';

  // 1. Authenticate Request
  const cookies = parseCookies(req.headers.cookie);
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const customHeaderToken = req.headers['x-underwriting-token'];
  const queryToken = req.query?.token;
  const accessParam = req.query?.access;

  let session = null;

  if (accessParam) {
    if (isRateLimited(clientIp)) {
      return res.status(429).json({
        error: 'Too many failed login attempts. Please wait 15 minutes before trying again.'
      });
    }
    if (verifyPin(accessParam)) {
      resetFailedAttempts(clientIp);
      const newToken = createSessionToken('underwriter');
      setSessionCookie(res, newToken);
      session = { role: 'underwriter' };
    } else {
      recordFailedAttempt(clientIp);
      return res.status(401).json({
        error: 'Unauthorized: Invalid access PIN.'
      });
    }
  } else {
    const candidateToken = cookies.clinaza_uw_session || bearerToken || customHeaderToken || queryToken;
    session = verifySessionToken(candidateToken);
  }

  if (!session) {
    return res.status(401).json({
      error: 'Unauthorized: Active partner underwriting session required to access KYC documents.'
    });
  }

  // 2. Validate Requested File Path
  const rawFile = (req.query.file || '').toString().trim();
  if (!rawFile || rawFile.includes('\0') || rawFile.includes('..')) {
    return res.status(400).json({ error: 'Invalid document file path' });
  }

  const sanitized = normalize(rawFile).replace(/^[/\\]+/, '');
  const ext = extname(sanitized).toLowerCase();
  if (!ALLOWED_EXTS.has(ext)) {
    return res.status(403).json({ error: 'Unsupported file type' });
  }

  // 3. Resolve File in Private Storage Directories
  const rootDir = process.cwd();
  const searchDirs = [
    resolve(rootDir, 'private/docs/kyc'),
    resolve(rootDir, 'public/docs/kyc')
  ];

  let resolvedPath = null;
  let fileStat = null;

  for (const baseDir of searchDirs) {
    const candidate = resolve(baseDir, sanitized);
    if (!candidate.startsWith(baseDir)) continue; // Traversal guard
    try {
      const s = await stat(candidate);
      if (s.isFile()) {
        resolvedPath = candidate;
        fileStat = s;
        break;
      }
    } catch {
      // Continue to next directory
    }
  }

  // 4. Fallback to Supabase Storage if not on disk
  if (!resolvedPath) {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseKey) {
      try {
        const signEndpoint = `${supabaseUrl}/storage/v1/object/sign/clinic-documents/${sanitized}`;
        const signRes = await fetch(signEndpoint, {
          method: 'POST',
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ expiresIn: 120 })
        });
        if (signRes.ok) {
          const signData = await signRes.json();
          const signedUrl = signData.signedURL ? `${supabaseUrl}/storage/v1${signData.signedURL}` : signData.signedUrl;
          if (signedUrl) {
            res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            return res.redirect(302, signedUrl);
          }
        }
      } catch (err) {
        console.error('Supabase signed URL error:', err.message);
      }
    }

    return res.status(404).json({ error: 'Requested KYC document not found.' });
  }

  // 5. Stream Local File Securely
  const mimeType = MIME_TYPES[ext] || 'application/octet-stream';
  const fileName = basename(resolvedPath);

  res.setHeader('Content-Type', mimeType);
  res.setHeader('Content-Length', fileStat.size);
  res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);

  if (req.method === 'HEAD') {
    return res.status(200).end();
  }

  try {
    const fileContent = await readFile(resolvedPath);
    return res.status(200).send(fileContent);
  } catch (err) {
    console.error('Error reading KYC document:', err);
    return res.status(500).json({ error: 'Failed to read document' });
  }
}
