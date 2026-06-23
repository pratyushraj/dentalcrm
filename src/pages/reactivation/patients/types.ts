export type CustomerStatus = 'Active' | 'Inactive' | 'New Lead' | 'Follow Up Needed';

export interface CareStep {
  day: number;
  message: string;
  subLabel: string;
}

export interface CareProgramTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  steps: CareStep[];
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  lastVisit: string; // ISO date string
  service: string;
  totalSpend: number;
  status: CustomerStatus;
  notes: string;
  avatarColor: string;
  problemTeeth?: number[];
  xrays?: string[];
  beforeAfterPhotos?: string[];
  beforePhoto?: string;
  beforePhotos?: string[];
  profilePhoto?: string;
  afterPhoto?: string;
  afterPhotos?: string[];
  prescription?: string;
  allergies?: string[];
  medicalConditions?: string[];
  toothNotes?: Record<number, string>;
  toothConditions?: Record<number, any>;
  vitals?: {
    bp?: string;
    pulse?: string;
    temp?: string;
    nextVisitDate?: string;
    age?: string;
    gender?: string;
  };
  activeProgramId?: string;
  programEnrollmentDate?: string;
  programCurrentStep?: number;
  programStatus?: 'Active' | 'Paused' | 'Completed';
  estimates?: Array<{
    id: string;
    date: string;
    items: Array<{ tooth?: number; procedure: string; cost: number; isCosmetic: boolean }>;
    discount: number;
    tax: number;
    grandTotal: number;
    status: 'Draft' | 'Sent' | 'Approved';
  }>;
  appointmentTime?: string;
}

export type SortField = 'lastVisit' | 'totalSpend' | null;
export type SortDir = 'asc' | 'desc';
