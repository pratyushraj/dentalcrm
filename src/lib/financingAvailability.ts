export const FINANCING_IS_LIVE = false;
export const FINANCING_STATUS = 'Clinaza is onboarding clinics. Patient financing is not live yet.';

export function isPublicFinancingPath(pathname: string) {
  return pathname === '/' || pathname === '/clinic-onboarding' || pathname === '/checkout-flow'
    || /^\/(?:cities|blog)(?:\/|$)/.test(pathname) || /(?:-on-emi|-implant-loan)$/.test(pathname);
}
