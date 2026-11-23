import {
  authenticatePin,
  createSessionToken,
  verifySessionToken,
  parseCookies,
  setSessionCookie,
  clearSessionCookie,
  SESSION_TTL_MS
} from './_auth.js';
import { VERIFIED_DOSSIERS } from './_underwriting-data.js';
import { supabaseRequest, protectedDocumentUrl } from './_supabase.js';

async function fetchDynamicOnboardedDossiers() {
  try {
    const res = await supabaseRequest('/rest/v1/clinic_onboardings?order=created_at.desc&limit=1000');
    if (!res.ok) throw new Error('Clinic applications could not be loaded');
    const rows = await res.json();
    if (!Array.isArray(rows)) return [];

    const dynamicDossiers = [];

    for (const r of rows) {
      if (!r.id || !r.clinic_name) continue;
      const legacy = VERIFIED_DOSSIERS.find(d => d.id === r.id || d.clinic_name.toLowerCase() === r.clinic_name.trim().toLowerCase());
      // Database updates take precedence over legacy verified records.
      if (legacy && !r.underwriting_dossier) continue;

      const clinicName = (r.clinic_name || 'Clinic').trim();
      const doctorName = (r.doctor_name || 'Doctor').trim();
      const city = (r.city || 'India').trim();

      const dossier = {
        clinic_name: clinicName,
        legal_name: clinicName,
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
        status: 'Action Required • Awaiting Doctor KYC & Cancelled Cheque',
      };
      const stored = r.underwriting_dossier || {};
      dynamicDossiers.push({
        ...dossier,
        ...legacy,
        ...stored,
        id: legacy?.id || r.id,
        bank: { ...dossier.bank, ...legacy?.bank, ...stored.bank },
        business_proof: { ...dossier.business_proof, ...legacy?.business_proof, ...stored.business_proof },
        docs: { ...dossier.docs, ...legacy?.docs, ...stored.docs },
      });
    }

    return dynamicDossiers;
  } catch (err) {
    console.error('Failed to load dynamic clinic onboardings:', err.message);
    throw err;
  }
}

async function loadDossiers() {
  const dynamic = await fetchDynamicOnboardedDossiers();
  const dossiers = new Map(VERIFIED_DOSSIERS.map(d => [d.id, d]));
  for (const dossier of dynamic) dossiers.set(dossier.id, dossier);
  return [...dossiers.values()].map(dossier => ({
    ...dossier,
    docs: Object.fromEntries(Object.entries(dossier.docs || {}).map(([name, value]) => [
      name, name === 'courier_awb' ? value : protectedDocumentUrl(value),
    ])),
  }));
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'GET, POST, OPTIONS');
    return res.status(204).end();
  }

  if (req.method === 'POST') {
    const body = req.body || {};
    let parsed;
    try { parsed = typeof body === 'string' ? JSON.parse(body || '{}') : body; }
    catch { return res.status(400).json({ error: 'Invalid request body' }); }
    const { action, pin } = parsed || {};

    if (action === 'logout') {
      clearSessionCookie(res);
      return res.status(200).json({ success: true, loggedOut: true });
    }

    if (!await authenticatePin(req, res, pin)) return;
    try {
      const token = createSessionToken('underwriter');
      setSessionCookie(res, token);
      res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');

      const allDossiers = await loadDossiers();

      return res.status(200).json({
        success: true,
        authenticated: true,
        token,
        expiresAt: Date.now() + SESSION_TTL_MS,
        dossiers: allDossiers
      });
    } catch {
      return res.status(503).json({ error: 'Clinic applications are temporarily unavailable. Please retry.' });
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
        authenticated: false,
        error: 'Unauthorized: Valid partner underwriting session or access PIN required.'
      });
    }

    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');

    try {
      return res.status(200).json({ authenticated: true, dossiers: await loadDossiers() });
    } catch {
      return res.status(503).json({ error: 'Clinic applications are temporarily unavailable. Please retry.' });
    }
  }

  res.setHeader('Allow', 'GET, POST, OPTIONS');
  return res.status(405).json({ error: 'Method not allowed' });
}
