import {
  verifyPin,
  createSessionToken,
  verifySessionToken,
  isRateLimited,
  recordFailedAttempt,
  resetFailedAttempts,
  parseCookies,
  setSessionCookie,
  clearSessionCookie,
  SESSION_TTL_MS
} from './_auth.js';
import { VERIFIED_DOSSIERS } from './underwriting-data.js';

async function fetchDynamicOnboardedDossiers() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return [];

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/clinic_onboardings?order=created_at.desc&limit=25`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`
        },
        signal: AbortSignal.timeout(3500)
      }
    );
    if (!res.ok) return [];
    const rows = await res.json();
    if (!Array.isArray(rows)) return [];

    const existingIds = new Set(VERIFIED_DOSSIERS.map((d) => d.id.toLowerCase()));
    const dynamicDossiers = [];

    for (const r of rows) {
      if (!r.id || !r.clinic_name) continue;
      const lowerId = r.id.toLowerCase();
      // Skip if already in hardcoded / verified dossiers
      if (existingIds.has(lowerId)) continue;

      const clinicName = (r.clinic_name || 'Clinic').trim();
      const doctorName = (r.doctor_name || 'Doctor').trim();
      const city = (r.city || 'India').trim();

      dynamicDossiers.push({
        id: r.id,
        clinic_name: clinicName,
        legal_name: `${clinicName.toUpperCase()} (Sole Proprietorship)`,
        doctor_name: doctorName,
        dob: 'Under Verification',
        pan: 'Under Verification',
        aadhaar: 'Under Verification',
        phone: r.phone || 'Under Verification',
        email: r.email || 'Under Verification',
        city: city,
        pincode: 'Under Verification',
        address: `${city}, India`,
        residential_address: `${city}, India`,
        specialties: ['General Dentistry', 'Patient Healthcare Financing'],
        submission_badge: 'Action Required • KYC Verification Pending',
        readiness: 'pending',
        missing_items: ['Doctor PAN & Aadhaar Self-Attestation', 'Settlement Bank Cancelled Cheque', 'Signed Doctor MAF Form'],
        bank: {
          bank_name: 'Current Account (Under Bank Linking)',
          account_holder: clinicName.toUpperCase(),
          account_number: 'Pending Cheque Upload',
          account_type: 'Current Account',
          ifsc: 'Under Verification',
          branch: city,
          micr: 'Under Verification',
          cheque_no: 'Pending Cheque Upload'
        },
        business_proof: {
          type: r.business_proof_type || 'Clinical Establishment Proof',
          number: 'Under Verification',
          category: 'Healthcare Clinical Establishment',
          date: new Date(r.created_at || Date.now()).toLocaleDateString('en-GB')
        },
        docs: {
          signing_pdf: '',
          zip_bundle: '',
          maf_excel: '',
          cancelled_cheque: '',
          doctor_pan: '',
          aadhaar_front: ''
        },
        is_signed: false,
        status: 'Action Required • Awaiting Doctor KYC & Cancelled Cheque'
      });
    }

    return dynamicDossiers;
  } catch (err) {
    console.error('Failed to load dynamic clinic onboardings:', err.message);
    return [];
  }
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

      const dynamicDossiers = await fetchDynamicOnboardedDossiers();
      const allDossiers = [...VERIFIED_DOSSIERS, ...dynamicDossiers];

      return res.status(200).json({
        success: true,
        authenticated: true,
        token,
        expiresAt: Date.now() + SESSION_TTL_MS,
        dossiers: allDossiers
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

    // Check query PIN access (e.g. ?access=...) with rate limiting
    if (accessParam) {
      if (isRateLimited(clientIp)) {
        return res.status(429).json({
          authenticated: false,
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
          authenticated: false,
          error: 'Unauthorized: Invalid access PIN.'
        });
      }
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

    const dynamicDossiers = await fetchDynamicOnboardedDossiers();
    const allDossiers = [...VERIFIED_DOSSIERS, ...dynamicDossiers];

    return res.status(200).json({
      authenticated: true,
      dossiers: allDossiers
    });
  }

  res.setHeader('Allow', 'GET, POST, OPTIONS');
  return res.status(405).json({ error: 'Method not allowed' });
}
