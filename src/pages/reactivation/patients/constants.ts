import { CustomerStatus } from './types';

export const AVATAR_COLORS = [
  '#6366F1', '#8B5CF6', '#EC4899', '#F59E0B',
  '#10B981', '#3B82F6', '#EF4444', '#14B8A6',
  '#F97316', '#84CC16',
];

export const SERVICES = [
  'All Services',
  'Teeth Cleaning',
  'Teeth Whitening',
  'Scaling & Polishing',
  'Root Canal',
  'Dental Implants',
  'Crown / Bridge',
  'Braces & Aligners',
  'Veneers (Porcelain)',
  'Composite Veneer',
  'Pulpectomy',
  'Dental X-Ray',
  'Extraction',
  'Oral Surgery',
  'Pediatric Dental',
  'Gum Treatment',
  'Smile Design',
  'Dental Checkup',
  'Medicine Bill',
];

export const STATUS_OPTIONS: CustomerStatus[] = ['Active', 'Inactive', 'New Lead', 'Follow Up Needed'];

export const DATE_RANGES = [
  { label: 'All Time', value: 'all' },
  { label: 'Last 30 days', value: '30' },
  { label: '30–90 days', value: '30-90' },
  { label: '90–180 days', value: '90-180' },
  { label: '6+ months', value: '180+' },
];

export const STATUS_CONFIG: Record<
  CustomerStatus,
  { bg: string; text: string; dot: string; border: string }
> = {
  Active: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    dot: 'bg-emerald-500',
    border: 'border-emerald-500/25',
  },
  Inactive: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    dot: 'bg-amber-500',
    border: 'border-amber-500/25',
  },
  'New Lead': {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    dot: 'bg-blue-500',
    border: 'border-blue-500/25',
  },
  'Follow Up Needed': {
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    dot: 'bg-red-500',
    border: 'border-red-500/25',
  },
};

export const ROWS_PER_PAGE = 10;
