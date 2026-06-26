import { Customer } from './types';
import { FOLLOW_UP_RULES } from './carePrograms';

export const EMPTY_CUSTOMER: Customer = {
  id: '',
  name: '',
  phone: '',
  lastVisit: new Date().toISOString().split('T')[0],
  service: 'Dental Checkup',
  totalSpend: 0,
  status: 'New Lead',
  notes: '',
  avatarColor: '#6366F1',
  problemTeeth: [],
  xrays: [],
  beforeAfterPhotos: [],
  prescription: '',
  allergies: [],
  medicalConditions: [],
  toothNotes: {},
  toothConditions: {},
  vitals: {
    bp: '',
    pulse: '',
    temp: '',
    nextVisitDate: '',
    age: '',
    gender: 'Male',
  },
  estimates: [],
};

export const getInitialForm = (customer?: Customer): Customer => {
  if (!customer) return { ...EMPTY_CUSTOMER };
  return {
    ...EMPTY_CUSTOMER,
    ...customer,
    vitals: {
      ...EMPTY_CUSTOMER.vitals,
      ...(customer.vitals || {}),
    },
    toothNotes: customer.toothNotes || {},
    toothConditions: customer.toothConditions || {},
  };
};

export const getToothName = (num: number): string => {
  const code = num % 10;
  const quadrant = Math.floor(num / 10);
  const quadNames = ["", "Upper Right", "Upper Left", "Lower Left", "Lower Right"];
  const toothNames = [
    "",
    "Central Incisor",
    "Lateral Incisor",
    "Canine",
    "First Premolar",
    "Second Premolar",
    "First Molar",
    "Second Molar",
    "Third Molar",
  ];
  return `${quadNames[quadrant]} ${toothNames[code]} (Tooth ${num})`;
};

export const getShortToothLabel = (num: number): string => {
  const code = num % 10;
  const shortNames = [
    "",
    "C. Incisor",
    "L. Incisor",
    "Canine",
    "1st Premolar",
    "2nd Premolar",
    "1st Molar",
    "2nd Molar",
    "3rd Molar",
  ];
  return `Tooth ${num} (${shortNames[code]})`;
};

export function addDays(dateStr: string, days: number): string {
  const base = new Date(dateStr);
  base.setDate(base.getDate() + days);
  return base.toISOString();
}

export function getNextVisitDate(customer: Customer): string | null {
  if (customer.vitals?.nextVisitDate) {
    return customer.vitals.nextVisitDate;
  }
  if (customer.programStatus === 'Active' && customer.programEnrollmentDate) {
    const step = Math.max(1, Number(customer.programCurrentStep || 1));
    const baseRule = FOLLOW_UP_RULES.find((rule) => rule.match(customer));
    const stepDays = baseRule ? baseRule.days : 30;
    return addDays(customer.programEnrollmentDate, stepDays * step);
  }

  const rule = FOLLOW_UP_RULES.find((entry) => entry.match(customer));
  if (rule) return addDays(customer.lastVisit, rule.days);

  if (customer.status === 'Follow Up Needed') return addDays(customer.lastVisit, 7);
  return null;
}

export function getFollowUpLabel(customer: Customer): string {
  const rule = FOLLOW_UP_RULES.find((entry) => entry.match(customer));
  if (rule) return rule.label;
  if (customer.programStatus === 'Active') return 'Care program';
  if (customer.status === 'Follow Up Needed') return 'Follow-up';
  return 'Review';
}

export function getAppointmentWindow(dateIso: string): 'today' | 'tomorrow' | 'upcoming' {
  const now = new Date();
  const target = new Date(dateIso);
  const startOfNow = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfTarget = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();
  const diffDays = Math.round((startOfTarget - startOfNow) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'tomorrow';
  return 'upcoming';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export function formatDate(isoDate: string): string {
  if (!isoDate) return '-';
  const d = new Date(isoDate);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function timeAgo(isoDate: string): string {
  if (!isoDate) return '-';
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const then = new Date(isoDate);
  then.setHours(0, 0, 0, 0);
  const diffMs = now.getTime() - then.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (days < 0) return 'In the future';
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) !== 1 ? 's' : ''} ago`;
  if (days < 365) return `${Math.floor(days / 30)} month${Math.floor(days / 30) !== 1 ? 's' : ''} ago`;
  return `${Math.floor(days / 365)} year${Math.floor(days / 365) !== 1 ? 's' : ''} ago`;
}

export function formatFollowUpTime(isoDate: string): string {
  if (!isoDate) return '-';
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const then = new Date(isoDate);
  then.setHours(0, 0, 0, 0);
  const diffMs = then.getTime() - now.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (days < 0) {
    const absDays = Math.abs(days);
    return `Overdue by ${absDays} day${absDays !== 1 ? 's' : ''}`;
  }
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days < 7) return `In ${days} day${days !== 1 ? 's' : ''}`;
  if (days < 30) return `In ${Math.floor(days / 7)} week${Math.floor(days / 7) !== 1 ? 's' : ''}`;
  return `In ${Math.floor(days / 30)} month${Math.floor(days / 30) !== 1 ? 's' : ''}`;
}

export function formatSpend(amount: number): string {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount}`;
}

export function isInDateRange(isoDate: string, range: string): boolean {
  if (range === 'all') return true;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const then = new Date(isoDate);
  then.setHours(0, 0, 0, 0);
  const days = Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24));
  if (range === '30') return days <= 30;
  if (range === '30-90') return days > 30 && days <= 90;
  if (range === '90-180') return days > 90 && days <= 180;
  if (range === '180+') return days > 180;
  return true;
}
