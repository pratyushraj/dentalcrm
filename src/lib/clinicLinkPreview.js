export const CLINIC_PREVIEW_ROBOTS = 'noindex, nofollow';

const previews = {
  checkout: {
    label: 'Patient EMI Checkout',
    title: 'Patient EMI Checkout Flow & Interactive Simulator | Clinaza',
    description: 'Explore paperless patient financing, flexible monthly EMIs, and direct T+1 clinic settlement with Clinaza.',
    details: 'Paperless patient financing, flexible monthly EMIs, and direct T+1 clinic settlement.',
    image: 'https://www.clinaza.in/assets/og-checkout-flow.png',
  },
  kyc: {
    label: 'Clinic Bank Verification & KYC',
    title: 'Clinic Bank Verification & KYC | Clinaza',
    description: 'Secure clinic current account linking, cancelled cheque and doctor PAN verification, and Pine Labs underwriting for T+1 payouts.',
    details: 'Secure clinic current account linking, document verification, and Pine Labs underwriting for T+1 payouts.',
    image: 'https://www.clinaza.in/og-clinic-onboarding.png',
  },
  underwriting: {
    label: 'Pine Labs Underwriting Dossier',
    title: 'Pine Labs Sub-Merchant Underwriting Desk | Clinaza',
    description: 'Secure clinic dossier review for Pine Labs Plural sub-merchant underwriting.',
    details: 'Secure clinic dossier review for Pine Labs Plural sub-merchant underwriting.',
    image: 'https://www.clinaza.in/og-plural-underwriting.png',
  },
};

export function cleanClinicPreviewIdentity(input) {
  if (typeof input !== 'string' || input.length > 160) return '';
  const text = input.normalize('NFKC').trim().replace(/\s+/g, ' ');
  if (!/^[\p{L}\p{M}\p{N} .,'’&()\-]+$/u.test(text) || !/\p{L}/u.test(text)) return '';
  if ((text.match(/\p{N}/gu) || []).length > 5 || /\b[A-Z]{5}\d{4}[A-Z]\b/i.test(text)) return '';
  if (/\b[A-Z]{4}0[A-Z0-9]{6}\b/i.test(text)) return '';
  return text;
}

export function readClinicPreviewIdentity(params) {
  return {
    clinic: cleanClinicPreviewIdentity(params.get('clinic_name') || params.get('name') || params.get('clinic')),
    doctor: cleanClinicPreviewIdentity(params.get('doctor') || params.get('doctor_name') || params.get('dr')),
    city: cleanClinicPreviewIdentity(params.get('city') || params.get('location')),
  };
}

export function clinicLinkPreview(kind, identity) {
  const preview = previews[kind];
  const clinic = cleanClinicPreviewIdentity(identity.clinic);
  const doctor = cleanClinicPreviewIdentity(identity.doctor);
  const city = cleanClinicPreviewIdentity(identity.city);
  if (!clinic) return { title: preview.title, description: preview.description, image: preview.image };

  const context = [doctor, city].filter(Boolean).join(', ');
  const name = context ? `${clinic} (${context})` : clinic;
  return {
    title: `${name} • ${preview.label} | Clinaza`,
    description: `${name}. ${preview.details}`,
    image: preview.image,
  };
}
