export interface TrialStatus {
  isTrial: boolean;
  isExpired: boolean;
  daysLeft: number;
  trialLocked: boolean;
  trialStartedAt: Date | null | string;
  trialExpiresAt: Date | null | string;
}

export function getTrialStatus(profile: any): TrialStatus {
  return {
    isTrial: false,
    isExpired: false,
    daysLeft: 0,
    trialLocked: false,
    trialStartedAt: null,
    trialExpiresAt: null
  };
}

export async function lockTrialIfExpired(userId: string): Promise<boolean> {
  return false;
}

export function isTrialFeatureRestricted(profile: any, messagesSent: number, maxAllowed?: number): boolean {
  return false;
}
