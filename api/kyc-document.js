import { readFile, stat } from 'node:fs/promises';
import { resolve, normalize, basename, extname, sep } from 'node:path';
import { supabaseRequest, getServerSupabaseConfig } from './_supabase.js';
import {
  authenticatePin,
  createSessionToken,
  verifySessionToken,
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
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 1. Authenticate Request
  const cookies = parseCookies(req.headers.cookie);
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const customHeaderToken = req.headers['x-underwriting-token'];
  const queryToken = req.query?.token;
  const accessParam = req.query?.access;

  let session = null;

  if (accessParam) {
    if (!await authenticatePin(req, res, accessParam)) return;
    const newToken = createSessionToken('underwriter');
    setSessionCookie(res, newToken);
    session = { role: 'underwriter' };
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
  if (!rawFile || /[\u0000-\u001f\\]/.test(rawFile) || rawFile.includes('..')) {
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
    if (!candidate.startsWith(baseDir + sep)) continue;
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
      try {
        const { url: supabaseUrl } = getServerSupabaseConfig();
        const path = sanitized.split('/').map(encodeURIComponent).join('/');
        const signRes = await supabaseRequest(`/storage/v1/object/sign/clinic-documents/${path}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ expiresIn: 120 })
        });
        if (signRes.ok) {
          const signData = await signRes.json();
          const signedUrl = signData.signedURL ? `${supabaseUrl}/storage/v1${signData.signedURL}` : signData.signedUrl;
          if (signedUrl) {
            const destination = new URL(signedUrl);
            if (req.query.download === '1') destination.searchParams.set('download', basename(sanitized));
            res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            return res.redirect(302, destination.href);
          }
        }
      } catch (err) {
        console.error('Supabase signed URL error:', err.message);
      }
    return res.status(404).json({ error: 'Requested KYC document not found.' });
  }

  // 5. Stream Local File Securely
  const mimeType = MIME_TYPES[ext] || 'application/octet-stream';
  const fileName = basename(resolvedPath);

  res.setHeader('Content-Type', mimeType);
  res.setHeader('Content-Length', fileStat.size);
  res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  const disposition = req.query.download === '1' ? 'attachment' : 'inline';
  res.setHeader('Content-Disposition', `${disposition}; filename="${fileName}"`);

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
