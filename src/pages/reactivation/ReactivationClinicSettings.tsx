import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Phone, Mail, Save, CheckCircle2, FileText, Stethoscope, Trash2, Plus, MessageSquare, Send, Lock, Globe, RefreshCw, Pill, Upload, Bell, VolumeX, Clock, Settings, CreditCard, Zap, CheckSquare } from 'lucide-react';
import { useSession } from '@/contexts/SessionContext';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useDealAlertNotifications } from '@/hooks/useDealAlertNotifications';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WhatsAppConfig {
  phoneNumberId: string;
  wabaId: string;
  accessToken: string;
  googleReviewUrl?: string;
  beforeAfterTemplateName?: string;
  prescriptionTemplateName?: string;
  bookingTemplateName?: string;
}

export interface WhatsAppTemplate {
  name: string;
  language: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  body: string;
  hasDynamicButton?: boolean;
}

export interface ClinicBranding {
  clinicName: string;
  doctorName: string;
  qualifications: string;
  address: string;
  phone: string;
  email: string;
  logoUrl?: string; // base64 clinic logo
}

export interface NotificationPrefs {
  emailEnabled: boolean;
  pushEnabled: boolean;
  inAppEnabled: boolean;
  doNotDisturb: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  newLeads: boolean;
  appointmentReminders: boolean;
  campaignAlerts: boolean;
}

export interface Procedure {
  name: string;
  defaultCost: number;
  gstRate: number; // 0 or 18
}

export const DEFAULT_PROCEDURES: Procedure[] = [
  { name: 'Root Canal Treatment (RCT)', defaultCost: 3500, gstRate: 0 },
  { name: 'Composite Filling / Restoration', defaultCost: 1500, gstRate: 0 },
  { name: 'Dental Implant Placement', defaultCost: 25000, gstRate: 0 },
  { name: 'PFM Crown / Cap', defaultCost: 4000, gstRate: 0 },
  { name: 'Zirconia Premium Crown', defaultCost: 8000, gstRate: 0 },
  { name: 'Scaling & Deep Polishing', defaultCost: 1200, gstRate: 0 },
  { name: 'Laser Teeth Whitening', defaultCost: 12000, gstRate: 18 },
  { name: 'Clear Aligners (Standard)', defaultCost: 45000, gstRate: 18 },
  { name: 'Clear Aligners (Premium)', defaultCost: 85000, gstRate: 18 },
  { name: 'Porcelain Veneer (per tooth)', defaultCost: 12000, gstRate: 18 },
  { name: 'Composite Veneer (per tooth)', defaultCost: 2500, gstRate: 0 },
  { name: 'Dental X-Ray (RVG)', defaultCost: 200, gstRate: 0 },
  { name: 'Tooth Extraction (Standard)', defaultCost: 1000, gstRate: 0 },
  { name: 'Pulpectomy (Child RCT)', defaultCost: 2000, gstRate: 0 },
  { name: 'Orthodontic Braces (Metal)', defaultCost: 25000, gstRate: 18 },
  { name: 'Medicine Bill', defaultCost: 500, gstRate: 0 }
];

export const BRANDING_KEY = (orgId: string) => `clinic_branding_${orgId}`;
export const PROCEDURES_KEY = (orgId: string) => `clinic_procedures_${orgId}`;

export const loadClinicBranding = (orgId: string, fallbackName?: string | null): ClinicBranding => {
  try {
    const raw = localStorage.getItem(BRANDING_KEY(orgId));
    if (raw) return JSON.parse(raw) as ClinicBranding;
  } catch {}
  return {
    clinicName: fallbackName || '',
    doctorName: '',
    qualifications: 'BDS, MDS',
    address: '',
    phone: '',
    email: '',
    logoUrl: '',
  };
};

export const saveClinicBranding = (orgId: string, data: ClinicBranding) => {
  localStorage.setItem(BRANDING_KEY(orgId), JSON.stringify(data));
};

export const loadClinicProcedures = (orgId: string): Procedure[] => {
  try {
    const raw = localStorage.getItem(PROCEDURES_KEY(orgId));
    if (raw) return JSON.parse(raw) as Procedure[];
  } catch {}
  return [...DEFAULT_PROCEDURES];
};

export const saveClinicProcedures = (orgId: string, data: Procedure[]) => {
  localStorage.setItem(PROCEDURES_KEY(orgId), JSON.stringify(data));
};

export interface Medication {
  id: string;
  label: string;
  text: string;
  category?: string;
  price?: number;
}

export const DEFAULT_MEDICATIONS: Medication[] = [
  { id: '1', label: 'Amoxicillin 500mg', text: '• Tab. Amoxicillin 500mg - 1 cap thrice daily for 5 days', category: 'Antibiotics', price: 120 },
  { id: '2', label: 'Paracetamol 650mg', text: '• Tab. Paracetamol 650mg - 1 tab SOS for pain', category: 'Pain killers', price: 40 },
  { id: '3', label: 'Zerodol-SP', text: '• Tab. Zerodol-SP - 1 tab twice daily for 3 days', category: 'Pain killers', price: 80 },
  { id: '4', label: 'Pantocid 40mg', text: '• Tab. Pantocid 40mg - 1 tab once daily before food', category: 'Others', price: 50 },
  { id: '5', label: 'Hexidine Mouthwash', text: '• Hexidine Mouthwash - rinse twice daily for 7 days', category: 'Mouthwash', price: 110 },
  { id: '6', label: 'Mox-CL 625mg', text: '• Tab. Mox-CL 625mg - 1 tab twice daily for 5 days', category: 'Antibiotics', price: 140 },
  { id: '7', label: 'Ketorol-DT', text: '• Tab. Ketorol-DT - 1 tab dissolved in water SOS', category: 'Pain killers', price: 60 },
  { id: '8', label: 'Sensodyne Toothpaste', text: '• Sensodyne Toothpaste - brush twice daily for sensitive teeth', category: 'Toothpaste', price: 95 },
  { id: '9', label: 'Metrogyl ER', text: '• Tab. Metrogyl ER - 1 tab twice daily for 5 days', category: 'Antibiotics', price: 75 },
  { id: '10', label: 'Flagyl ER', text: '• Tab. Flagyl ER - 1 tab twice daily for 5 days', category: 'Antibiotics', price: 65 },
  { id: '11', label: 'Augmentin 625mg', text: '• Tab. Augmentin 625mg - 1 tab twice daily for 5 days', category: 'Antibiotics', price: 180 },
  { id: '12', label: 'Clavam 625mg', text: '• Tab. Clavam 625mg - 1 tab twice daily for 5 days', category: 'Antibiotics', price: 160 },
  { id: '13', label: 'Indclav 625mg', text: '• Tab. Indclav 625mg - 1 tab twice daily for 5 days', category: 'Antibiotics', price: 155 },
  { id: '14', label: 'Mox CV 625mg', text: '• Tab. Mox CV 625mg - 1 tab twice daily for 5 days', category: 'Antibiotics', price: 145 },
  { id: '15', label: 'Zocef CV 250mg', text: '• Tab. Zocef CV 250mg - 1 tab twice daily for 5 days', category: 'Antibiotics', price: 210 },
  { id: '16', label: 'Sporidex CV 200mg', text: '• Tab. Sporidex CV 200mg - 1 tab twice daily for 5 days', category: 'Antibiotics', price: 190 },
  { id: '17', label: 'Zymoflam D', text: '• Tab. Zymoflam D - 1 tab twice daily for 5 days', category: 'Pain killers', price: 90 },
  { id: '18', label: 'Intagesic', text: '• Tab. Intagesic - 1 tab twice daily for 5 days', category: 'Pain killers', price: 55 },
  { id: '19', label: 'Lysoflam', text: '• Tab. Lysoflam - 1 tab twice daily for 5 days', category: 'Pain killers', price: 85 },
  { id: '20', label: 'Gudgesic SP', text: '• Tab. Gudgesic SP - 1 tab twice daily for 5 days', category: 'Pain killers', price: 70 },
  { id: '21', label: 'Enzoflam', text: '• Tab. Enzoflam - 1 tab twice daily for 5 days', category: 'Pain killers', price: 95 },
  { id: '22', label: 'Clohex ADS M/W', text: '• Clohex ADS Mouthwash - rinse twice daily for 7 days', category: 'Mouthwash', price: 120 },
  { id: '23', label: 'Vantej Aqua M/W', text: '• Vantej Aqua Mouthwash - rinse twice daily for 7 days', category: 'Mouthwash', price: 130 },
  { id: '24', label: 'Hydent 360 M/W', text: '• Hydent 360 Mouthwash - rinse twice daily for 7 days', category: 'Mouthwash', price: 140 },
  { id: '25', label: 'Coolora M/W', text: '• Coolora Mouthwash - rinse twice daily for 7 days', category: 'Mouthwash', price: 90 },
  { id: '26', label: 'Corahex M/W', text: '• Corahex Mouthwash - rinse twice daily for 7 days', category: 'Mouthwash', price: 105 },
  { id: '27', label: 'Paloxide M/W', text: '• Paloxide Mouthwash - rinse twice daily for 7 days', category: 'Mouthwash', price: 115 },
  { id: '28', label: 'Xyon-C M/W', text: '• Xyon-C Mouthwash - rinse twice daily for 7 days', category: 'Mouthwash', price: 125 },
  { id: '29', label: 'Gumex Gum Paint', text: '• Gumex Gum Paint - apply on gums thrice daily', category: 'Mouthwash', price: 80 },
  { id: '30', label: 'Logum Gel', text: '• Logum Gel - apply on painful ulcers/areas 10 minutes before food', category: 'Gels', price: 70 },
  { id: '31', label: 'Metrogyl DG Gel', text: '• Metrogyl DG Gel - massage gently on gums twice daily after brushing', category: 'Gels', price: 85 },
  { id: '32', label: 'Turbocoat Gel', text: '• Turbocoat Gel - apply on sensitive areas once daily after brushing', category: 'Gels', price: 110 },
  { id: '33', label: 'Vantej Toothpaste', text: '• Vantej Toothpaste - brush twice daily', category: 'Toothpaste', price: 130 },
  { id: '34', label: 'Reguard Toothpaste', text: '• Reguard Toothpaste - brush twice daily', category: 'Toothpaste', price: 90 },
  { id: '35', label: 'Perioguard Toothpaste', text: '• Perioguard Toothpaste - brush twice daily', category: 'Toothpaste', price: 100 },
  { id: '36', label: 'Hydent K Toothpaste', text: '• Hydent K Toothpaste - brush twice daily', category: 'Toothpaste', price: 115 },
  { id: '37', label: 'Glister Toothpaste', text: '• Glister Toothpaste - brush twice daily', category: 'Toothpaste', price: 140 },
  { id: '38', label: 'Snowdent Toothpaste', text: '• Snowdent Toothpaste - brush twice daily', category: 'Toothpaste', price: 85 },
  { id: '39', label: 'Remin Toothpaste', text: '• Remin Toothpaste - brush twice daily', category: 'Toothpaste', price: 120 },
  { id: '40', label: 'Toothmin Toothpaste', text: '• Toothmin Toothpaste - brush twice daily', category: 'Toothpaste', price: 125 },
  { id: '41', label: 'Enzoflam CT', text: '• Tab. Enzoflam CT - 1 tab twice daily for 5 days', category: 'Pain killers', price: 100 },
  { id: '42', label: 'Rantac RD', text: '• Tab. Rantac RD - 1 tab twice daily before food', category: 'Gas/Acidity', price: 45 },
  { id: '43', label: 'Ranidom-DOM', text: '• Tab. Ranidom-DOM - 1 tab twice daily before food', category: 'Gas/Acidity', price: 55 },
  { id: '44', label: 'Pan-40', text: '• Tab. Pan-40 - 1 tab once daily before food', category: 'Gas/Acidity', price: 65 },
  { id: '45', label: 'Cyra-D', text: '• Tab. Cyra-D - 1 tab once daily before food', category: 'Gas/Acidity', price: 60 },
  { id: '46', label: 'Rabeprazole 20mg', text: '• Tab. Rabeprazole 20mg - 1 tab once daily before food', category: 'Gas/Acidity', price: 50 },
  { id: '47', label: 'Lycowonder', text: '• Tab. Lycowonder - 1 tab once daily', category: 'Multivitamins', price: 140 },
  { id: '48', label: 'Lycowonder Forte', text: '• Tab. Lycowonder Forte - 1 tab once daily', category: 'Multivitamins', price: 160 },
  { id: '49', label: 'Fibrowonder Multi Tab', text: '• Tab. Fibrowonder Multi Tab - 1 tab once daily', category: 'Multivitamins', price: 150 },
  { id: '50', label: 'Gurodol Mouthwash', text: '• Gurodol Mouthwash - rinse twice daily', category: 'Mouthwash', price: 95 },
  { id: '51', label: 'Rinse Off Mouthwash', text: '• Rinse Off Mouthwash - rinse twice daily', category: 'Mouthwash', price: 85 },
  { id: '52', label: 'Rexidin SRS Mouthwash', text: '• Rexidin SRS Mouthwash - rinse twice daily', category: 'Mouthwash', price: 135 },
  { id: '53', label: 'Keebiotic Tab', text: '• Tab. Keebiotic - 1 tab twice daily for 5 days', category: 'Antibiotics', price: 125 },
  { id: '54', label: 'Rexidine Mouthwash', text: '• Rexidine Mouthwash - rinse twice daily', category: 'Mouthwash', price: 110 },
  { id: '55', label: 'Gumsun Gum Paint', text: '• Gumsun Gum Paint - apply on gums thrice daily', category: 'Gels', price: 75 },
  { id: '56', label: 'Paradontox Toothpaste', text: '• Paradontox Toothpaste - brush twice daily', category: 'Toothpaste', price: 150 },
  { id: '57', label: 'Zyclav 375mg', text: '• Tab. Zyclav 375mg - 1 tab twice daily for 5 days', category: 'Antibiotics', price: 135 }
];

export const MEDICATIONS_KEY = (orgId: string) => `clinic_medications_${orgId}`;

export const migrateMedications = (meds: Medication[]): Medication[] => {
  return meds.map(med => {
    const matched = DEFAULT_MEDICATIONS.find(dm => dm.label.toLowerCase() === med.label.toLowerCase());
    
    // Dynamically assign realistic prices based on category if undefined or 0
    let defaultPrice = 0;
    const cat = med.category || (matched ? matched.category : 'Others');
    if (cat === 'Antibiotics') defaultPrice = 120;
    else if (cat === 'Pain killers') defaultPrice = 60;
    else if (cat === 'Multivitamins') defaultPrice = 150;
    else if (cat === 'Mouthwash') defaultPrice = 110;
    else if (cat === 'Gels') defaultPrice = 85;
    else if (cat === 'Toothpaste') defaultPrice = 95;
    else if (cat === 'Gas/Acidity') defaultPrice = 50;
    else defaultPrice = 40;

    const price = med.price !== undefined ? med.price : (matched && matched.price !== undefined ? matched.price : defaultPrice);

    if (matched) return { ...med, category: matched.category, price };
    if (med.category && med.category !== 'Others') return { ...med, price };
    
    const text = (med.text || '').toLowerCase();
    const label = (med.label || '').toLowerCase();
    let computedCategory = 'Others';
    if (label.includes('gel') || text.includes('gel') || text.includes('apply on')) computedCategory = 'Gels';
    else if (label.includes('mouthwash') || label.includes('m/w') || text.includes('mouthwash') || text.includes('rinse')) computedCategory = 'Mouthwash';
    else if (label.includes('toothpaste') || label.includes('paste') || text.includes('toothpaste') || text.includes('brush')) computedCategory = 'Toothpaste';
    else if (label.includes('pan-') || label.includes('pantocid') || label.includes('rantac') || label.includes('ranidom') || label.includes('cyra') || label.includes('rabeprazole') || text.includes('before food') || text.includes('acidity')) computedCategory = 'Gas/Acidity';
    else if (label.includes('paracetamol') || label.includes('zerodol') || label.includes('ketorol') || label.includes('pain') || label.includes('enzoflam') || label.includes('intagesic') || label.includes('lysoflam') || label.includes('gudgesic') || label.includes('zymoflam') || label.includes('ct')) computedCategory = 'Pain killers';
    else if (label.includes('wonder') || label.includes('lyco') || label.includes('fibro') || label.includes('vitamin') || text.includes('multivitamin') || text.includes('vitamin')) computedCategory = 'Multivitamins';
    else if (label.includes('amox') || label.includes('mox') || label.includes('clavam') || label.includes('aug') || label.includes('zocef') || label.includes('spori') || label.includes('metro') || label.includes('flagyl') || label.includes('antibiotic') || label.includes('zyclav') || label.includes('keebiotic') || text.includes('cap') || text.includes('tab.')) computedCategory = 'Antibiotics';
    
    return { ...med, category: computedCategory, price };
  });
};

export const loadClinicMedications = (orgId: string): Medication[] => {
  try {
    const raw = localStorage.getItem(MEDICATIONS_KEY(orgId));
    if (raw) {
      const parsed = JSON.parse(raw) as Medication[];
      return migrateMedications(parsed);
    }
  } catch {}
  return [...DEFAULT_MEDICATIONS];
};

export const saveClinicMedications = (orgId: string, data: Medication[]) => {
  localStorage.setItem(MEDICATIONS_KEY(orgId), JSON.stringify(data));
};

export const WHATSAPP_KEY = (orgId: string) => `whatsapp_config_${orgId}`;

export const loadWhatsAppConfig = (orgId: string): WhatsAppConfig => {
  try {
    const raw = localStorage.getItem(WHATSAPP_KEY(orgId));
    if (raw) {
      const config = JSON.parse(raw) as WhatsAppConfig;
      if (!config.googleReviewUrl) {
        config.googleReviewUrl = 'https://maps.app.goo.gl/KJ78ipBjeu7DfV4N9';
      }
      if (!config.beforeAfterTemplateName) {
        config.beforeAfterTemplateName = 'clinical_image_record';
      }
      if (!config.prescriptionTemplateName) {
        config.prescriptionTemplateName = 'prescription_pdf_share';
      }
      if (!config.bookingTemplateName) {
        config.bookingTemplateName = 'booking';
      }
      return config;
    }
  } catch {}
  return {
    phoneNumberId: '109283746510293',
    wabaId: '293847561029384',
    accessToken: 'EAAG1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z',
    googleReviewUrl: 'https://maps.app.goo.gl/KJ78ipBjeu7DfV4N9',
    beforeAfterTemplateName: 'clinical_image_record',
    prescriptionTemplateName: 'prescription_pdf_share',
    bookingTemplateName: 'booking',
  };
};

export const saveWhatsAppConfig = (orgId: string, data: WhatsAppConfig) => {
  localStorage.setItem(WHATSAPP_KEY(orgId), JSON.stringify(data));
};

export const DEFAULT_TEMPLATES: WhatsAppTemplate[] = [
  {
    name: 'booking',
    language: 'en',
    status: 'Approved',
    body: '🦷 Appointment Confirmed – YOUR DENTIST\n\nHi {{1}},\n\nYour appointment with Dr. Aryan Parmar has been confirmed. ✅\n\n📅 Date: {{2}}\n⏰ Time: {{3}}\n📍 Clinic: YOUR DENTIST, Patliputra Colony, Patna\n\nPlease arrive 10 minutes before your scheduled slot.\n\nFor rescheduling or queries, call us at:\n📞 6201478033\n\nThank you for choosing YOUR DENTIST\n😊'
  },
  {
    name: 'patient_recall_followup',
    language: 'en',
    status: 'Approved',
    body: 'Hi {{1}}, it is time for your dental checkup at {{2}}. Book your slot today!'
  },
  {
    name: 'google_review_request',
    language: 'en',
    status: 'Approved',
    body: 'Dear {{1}}, thank you for choosing {{2}}. Please share your experience here: {{3}} . We appreciate your feedback!'
  },
  {
    name: 'googlereview',
    language: 'en',
    status: 'Approved',
    body: 'Hi {{1}}! Look at your incredible smile transformation! 🦷✨ We would love it if you shared this before/after photo and your experience on our Google Reviews page: {{2}} . Thank you for helping us grow!'
  },
  {
    name: 'smile_makeover_google_review',
    language: 'en',
    status: 'Approved',
    body: 'Hi {{1}}! Look at your incredible smile transformation! 🦷✨ We would love it if you shared this before/after photo and your experience on Google. Please tap the button below. Thank you for helping us grow!'
  }
];

export const TEMPLATES_KEY = (orgId: string) => `whatsapp_templates_${orgId}`;

export const loadWhatsAppTemplates = (orgId: string): WhatsAppTemplate[] => {
  try {
    const raw = localStorage.getItem(TEMPLATES_KEY(orgId));
    if (raw) {
      const list = JSON.parse(raw) as WhatsAppTemplate[];
      return list.map(t => {
        if (t.name === 'appointment_booking_confirmation') {
          return {
            ...t,
            name: 'booking',
            body: '🦷 Appointment Confirmed – YOUR DENTIST\n\nHi {{1}},\n\nYour appointment with Dr. Aryan Parmar has been confirmed. ✅\n\n📅 Date: {{2}}\n⏰ Time: {{3}}\n📍 Clinic: YOUR DENTIST, Patliputra Colony, Patna\n\nPlease arrive 10 minutes before your scheduled slot.\n\nFor rescheduling or queries, call us at:\n📞 6201478033\n\nThank you for choosing YOUR DENTIST\n😊'
          };
        }
        return t;
      });
    }
  } catch {}
  return [...DEFAULT_TEMPLATES];
};

export const saveWhatsAppTemplates = (orgId: string, data: WhatsAppTemplate[]) => {
  localStorage.setItem(TEMPLATES_KEY(orgId), JSON.stringify(data));
};

// ─── Prescription Preview ─────────────────────────────────────────────────────

const PrescriptionPreview: React.FC<{ branding: ClinicBranding }> = ({ branding }) => (
  <div
    className="rounded-xl border border-indigo-200/60 overflow-hidden shadow-lg shadow-indigo-500/10"
    style={{ fontFamily: 'Georgia, serif' }}
  >
    {/* Header */}
    <div
      className="px-6 py-5"
      style={{ background: 'linear-gradient(135deg, #EEF2FF 0%, #F0F9FF 100%)', borderBottom: '2px solid #4F46E5' }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          {branding.logoUrl && (
            <img src={branding.logoUrl} alt="Logo" className="w-12 h-12 object-contain rounded-xl border border-indigo-100 bg-white p-1 shadow-sm shrink-0" />
          )}
          <div className="min-w-0 flex-1">
            <h2 className="text-[18px] font-bold text-indigo-900 leading-tight tracking-tight truncate">
              {branding.clinicName || <span className="text-slate-400 italic text-[15px]">Clinic Name</span>}
            </h2>
            <p className="text-[12px] text-indigo-700 mt-0.5 font-medium truncate">
              {branding.doctorName || <span className="text-slate-400 italic font-normal">Doctor Name</span>}
              {branding.qualifications && branding.doctorName && (
                <span className="text-indigo-500 font-normal ml-1">· {branding.qualifications}</span>
              )}
            </p>
          </div>
        </div>
        <div className="text-right text-[10px] text-slate-500 space-y-0.5 leading-snug shrink-0">
          {branding.phone && <div>📞 {branding.phone}</div>}
          {branding.email && <div>✉ {branding.email}</div>}
        </div>
      </div>
      {branding.address && (
        <p className="text-[10px] text-slate-500 mt-2">📍 {branding.address}</p>
      )}
    </div>

    {/* Patient strip */}
    <div className="bg-white px-6 py-2.5 flex gap-6 border-b border-slate-100">
      {[['Patient', 'Ravi Kumar'], ['Date', new Date().toLocaleDateString('en-IN')], ['Age/Sex', '34 / M']].map(([label, val]) => (
        <div key={label}>
          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">{label}</span>
          <p className="text-[11px] text-slate-800 font-medium">{val}</p>
        </div>
      ))}
    </div>

    {/* Rx body */}
    <div className="bg-white px-6 py-3">
      <div className="flex items-start gap-3">
        <span className="text-[26px] text-indigo-400 font-serif leading-none mt-0.5">℞</span>
        <div className="space-y-0.5 text-[11px] text-slate-700">
          <p>• Tab. Amoxicillin 500mg — 1 cap thrice daily × 5 days</p>
          <p>• Tab. Paracetamol 650mg — 1 tab SOS for pain</p>
          <p>• Hexidine Mouthwash — rinse twice daily</p>
        </div>
      </div>
    </div>

    {/* Footer */}
    <div
      className="px-6 py-2 flex items-center justify-between"
      style={{ background: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}
    >
      <span className="text-[9px] text-slate-400">Valid for 30 days · Not valid without signature</span>
      <span className="text-[9px] text-slate-400 italic">Signature ___________</span>
    </div>
  </div>
);

const ReactivationClinicSettings: React.FC = () => {
  const { organizationId, profile } = useSession();
  const orgId = organizationId || 'default';

  const [activeTab, setActiveTab] = useState<'info' | 'prices' | 'whatsapp' | 'medications' | 'notifications' | 'emi'>('info');

  const {
    permission: pushPermission,
    isSupported: isPushSupported,
    isSubscribed: isPushSubscribed,
    enableNotifications: enablePushNotifications,
    disableNotifications: disablePushNotifications,
    sendTestPush,
    isIOSNeedsInstall
  } = useDealAlertNotifications();

  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPrefs>({
    emailEnabled: true,
    pushEnabled: false,
    inAppEnabled: true,
    doNotDisturb: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
    newLeads: true,
    appointmentReminders: true,
    campaignAlerts: true,
  });

  useEffect(() => {
    const fetchPrefs = async () => {
      let loaded = false;

      // Primary source: reactivation_audit_logs
      if (organizationId && organizationId !== 'default') {
        try {
          const { data: logData, error: logError } = await supabase
            .from('reactivation_audit_logs')
            .select('details')
            .eq('organization_id', organizationId)
            .eq('action', 'notification_preferences')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (!logError && logData?.details?.notificationPrefs) {
            setNotificationPrefs(logData.details.notificationPrefs);
            loaded = true;
          }
        } catch (err) {
          console.warn('Failed to load from reactivation_audit_logs:', err);
        }
      }

      // Fallback: localStorage
      if (!loaded) {
        try {
          const local = localStorage.getItem(`notification_preferences_${orgId}`);
          if (local) {
            setNotificationPrefs(JSON.parse(local));
          }
        } catch (err) {
          console.warn('Failed to load from localStorage:', err);
        }
      }
    };

    fetchPrefs();
  }, [profile, orgId]);

  const [branding, setBranding] = useState<ClinicBranding>(() =>
    loadClinicBranding(orgId, profile?.business_name)
  );

  const [procedures, setProcedures] = useState<Procedure[]>(() =>
    loadClinicProcedures(orgId)
  );

  const [emiStatus, setEmiStatus] = useState<'Not Partnered' | 'Pending' | 'Active'>(() => {
    // Automatically configure and activate Axis Bank (Jarvis) with the generated credentials
    const saved = localStorage.getItem('emi_partner_status');
    if (!saved || saved === 'Not Partnered' || saved === 'Pending') {
      localStorage.setItem('emi_partner_status', 'Active');
      localStorage.setItem('emi_partner_name', 'Axis Bank (Jarvis)');
      localStorage.setItem('emi_client_id', '097a2aae64b345452adb98c1ce89a137');
      localStorage.setItem('emi_client_secret', 'd91a7137b22f0f1532f661953d122bc6');
      return 'Active';
    }
    return saved as any;
  });
  const [selectedNBFC, setSelectedNBFC] = useState<string | null>(null);
  const [emiForm, setEmiForm] = useState(() => ({
    legalName: '',
    doctorName: '',
    panNumber: '',
    bankAccount: '',
    ifsc: '',
    averageBilling: '5-10L',
    clientId: localStorage.getItem('emi_client_id') || '097a2aae64b345452adb98c1ce89a137',
    clientSecret: localStorage.getItem('emi_client_secret') || 'd91a7137b22f0f1532f661953d122bc6',
  }));

  useEffect(() => {
    if (branding) {
      setEmiForm(prev => ({
        ...prev,
        legalName: branding.clinicName || profile?.business_name || '',
        doctorName: branding.doctorName || '',
      }));
    }
  }, [branding, profile]);

  const [medications, setMedications] = useState<Medication[]>(() =>
    loadClinicMedications(orgId)
  );

  const [newMedLabel, setNewMedLabel] = useState('');
  const [newMedText, setNewMedText] = useState('');
  const [newMedCategory, setNewMedCategory] = useState('Pain killers');
  const [newMedPrice, setNewMedPrice] = useState('0');

  const [whatsapp, setWhatsapp] = useState<WhatsAppConfig>(() =>
    loadWhatsAppConfig(orgId)
  );

  const [templates, setTemplates] = useState<WhatsAppTemplate[]>(() =>
    loadWhatsAppTemplates(orgId)
  );

  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateLang, setNewTemplateLang] = useState('en');
  const [newTemplateBody, setNewTemplateBody] = useState('');
  const [showAddTemplateForm, setShowAddTemplateForm] = useState(false);
  const [isFetchingFromAPI, setIsFetchingFromAPI] = useState(false);

  const [testNumber, setTestNumber] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [saved, setSaved] = useState(false);

  // Reload all states from local storage when organization ID changes (e.g. session loads)
  useEffect(() => {
    setBranding(loadClinicBranding(orgId, profile?.business_name));
    setProcedures(loadClinicProcedures(orgId));
    setMedications(loadClinicMedications(orgId));
    setWhatsapp(loadWhatsAppConfig(orgId));
    setTemplates(loadWhatsAppTemplates(orgId));
  }, [orgId]);

  // Sync clinic name from profile on first load if empty
  useEffect(() => {
    if (!branding.clinicName && profile?.business_name) {
      setBranding((prev) => ({ ...prev, clinicName: profile.business_name || '' }));
    }
  }, [profile?.business_name, orgId]);

  // Load clinic details from Supabase dental_clinics table
  useEffect(() => {
    if (!organizationId || organizationId === 'default') return;

    const fetchClinicConfig = async () => {
      try {
        const { data, error } = await supabase
          .from('dental_clinics')
          .select('whatsapp_phone_number_id, whatsapp_access_token, name, address, phone, doctor_name, qualifications, email, logo_url, waba_id, google_review_url, before_after_template_name, prescription_template_name, booking_template_name' as any)
          .eq('id', organizationId)
          .single();

        if (error) throw error;
        if (data) {
          setWhatsapp((prev) => {
            const rawToken = data.whatsapp_access_token || '';
            let token = prev.accessToken;
            let dbWabaId = (data as any).waba_id || '';
            let dbGoogleReviewUrl = (data as any).google_review_url || '';
            let dbBeforeAfterTemplateName = (data as any).before_after_template_name || '';
            let dbPrescriptionTemplateName = (data as any).prescription_template_name || '';
            let dbBookingTemplateName = (data as any).booking_template_name || '';

            // Fallback for legacy composite token
            if (rawToken && rawToken.includes('|')) {
              const parts = rawToken.split('|');
              token = parts[0] || prev.accessToken;
              if (!dbWabaId) dbWabaId = parts[1] || '';
              if (!dbGoogleReviewUrl) dbGoogleReviewUrl = parts[2] || '';
              if (!dbBeforeAfterTemplateName) dbBeforeAfterTemplateName = parts[3] || 'googlereview';
            } else if (rawToken) {
              token = rawToken;
            }

            return {
              ...prev,
              phoneNumberId: data.whatsapp_phone_number_id || prev.phoneNumberId,
              accessToken: token,
              wabaId: dbWabaId || prev.wabaId,
              googleReviewUrl: dbGoogleReviewUrl || prev.googleReviewUrl || '',
              beforeAfterTemplateName: dbBeforeAfterTemplateName || prev.beforeAfterTemplateName || 'clinical_image_record',
              prescriptionTemplateName: dbPrescriptionTemplateName || prev.prescriptionTemplateName || 'prescription_pdf_share',
              bookingTemplateName: dbBookingTemplateName || prev.bookingTemplateName || 'booking',
            };
          });

          setBranding((prev) => ({
            ...prev,
            clinicName: data.name || prev.clinicName,
            address: data.address || prev.address,
            phone: data.phone || prev.phone,
            doctorName: data.doctor_name || prev.doctorName,
            qualifications: data.qualifications || prev.qualifications,
            email: data.email || prev.email,
            logoUrl: data.logo_url || prev.logoUrl,
          }));
        }
      } catch (err) {
        console.error('Error loading clinic details from Supabase:', err);
      }

      try {
        const { data: logsData, error: logsError } = await supabase
          .from('reactivation_audit_logs')
          .select('details')
          .eq('organization_id', organizationId)
          .eq('action', 'clinic_medications')
          .order('created_at', { ascending: false })
          .limit(1);

        if (!logsError && logsData && logsData.length > 0) {
          const loadedMeds = logsData[0].details?.medications;
          if (Array.isArray(loadedMeds) && loadedMeds.length > 0) {
            const migrated = migrateMedications(loadedMeds);
            setMedications(migrated);
            localStorage.setItem(MEDICATIONS_KEY(orgId), JSON.stringify(migrated));
          }
        }
      } catch (err) {
        console.error('Error loading clinic medications from Supabase:', err);
      }
    };

    fetchClinicConfig();
  }, [organizationId]);

  const handleChange = (field: keyof ClinicBranding, value: string) => {
    setBranding((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleWhatsAppChange = (field: keyof WhatsAppConfig, value: string) => {
    setWhatsapp((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleProcedureChange = (index: number, field: keyof Procedure, value: any) => {
    setProcedures((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
    setSaved(false);
  };

  const handleAddProcedure = () => {
    setProcedures((prev) => [
      ...prev,
      { name: 'New Procedure', defaultCost: 1000, gstRate: 0 }
    ]);
    setSaved(false);
  };

  const handleRemoveProcedure = (index: number) => {
    setProcedures((prev) => prev.filter((_, i) => i !== index));
    setSaved(false);
  };

  const handleRestoreDefaults = () => {
    setProcedures([...DEFAULT_PROCEDURES]);
    setSaved(false);
  };

  const handleSendTestMessage = () => {
    if (!testNumber.trim()) {
      toast.error('Please enter a phone number to send a test message');
      return;
    }
    setIsSendingTest(true);
    setTimeout(() => {
      setIsSendingTest(false);
      toast.success('Test WhatsApp message delivered successfully (Simulated)!');
    }, 1200);
  };

  const handleAddTemplate = () => {
    if (!newTemplateName.trim()) {
      toast.error('Please enter a template name');
      return;
    }
    const sanitizedName = newTemplateName.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
    if (!newTemplateBody.trim()) {
      toast.error('Please enter the template body text');
      return;
    }

    const newTemplate: WhatsAppTemplate = {
      name: sanitizedName,
      language: newTemplateLang,
      status: 'Approved',
      body: newTemplateBody.trim()
    };

    const updated = [...templates, newTemplate];
    setTemplates(updated);
    saveWhatsAppTemplates(orgId, updated);

    // Clear inputs and close form
    setNewTemplateName('');
    setNewTemplateBody('');
    setShowAddTemplateForm(false);
    toast.success(`Template "${sanitizedName}" created & approved successfully!`);
  };

  const handleRemoveTemplate = (index: number) => {
    const templateToRemove = templates[index];
    const updated = templates.filter((_, i) => i !== index);
    setTemplates(updated);
    saveWhatsAppTemplates(orgId, updated);
    toast.success(`Template "${templateToRemove.name}" removed successfully.`);
  };

  const handleFetchTemplatesFromAPI = async () => {
    if (!whatsapp.wabaId || !whatsapp.accessToken) {
      toast.error('WABA ID and System Access Token are required to fetch templates');
      return;
    }
    setIsFetchingFromAPI(true);
    const toastId = toast.loading('Connecting to Meta API and fetching templates...');

    try {
      const isMockToken = whatsapp.accessToken === 'EAAG1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z';
      if (isMockToken) {
        await new Promise((resolve) => setTimeout(resolve, 1200));
        const mockAPITemplates: WhatsAppTemplate[] = [
          {
            name: 'appointment_booking_confirmation',
            language: 'en',
            status: 'Approved',
            body: 'Hello {{1}}, this is a confirmation for your appointment on {{2}} at {{3}} with {{4}}. Contact {{5}} for queries.'
          },
          {
            name: 'patient_recall_followup',
            language: 'en',
            status: 'Approved',
            body: 'Hi {{1}}, it is time for your dental checkup at {{2}}. Book your slot today!'
          },
          {
            name: 'google_review_request',
            language: 'en',
            status: 'Approved',
            body: 'Dear {{1}}, thank you for choosing {{2}}. Please share your experience here: {{3}}'
          },
          {
            name: 'treatment_plan_estimate',
            language: 'en',
            status: 'Approved',
            body: 'Hi {{1}}, here is your estimated treatment plan for {{2}} at {{3}}. Total cost is ₹{{4}}.'
          },
          {
            name: 'festival_greeting_discount',
            language: 'hi',
            status: 'Approved',
            body: 'नमस्ते {{1}}, आपके और आपके परिवार को त्योहार की हार्दिक शुभकामनाएं! इस महीने डेंटल क्लीनिंग पर 20% की छूट पाएं।'
          }
        ];
        setTemplates(mockAPITemplates);
        saveWhatsAppTemplates(orgId, mockAPITemplates);
        toast.success(`Successfully loaded ${mockAPITemplates.length} templates from Meta API (Simulated)!`, { id: toastId });
        return;
      }

      let activeWabaId = whatsapp.wabaId;

      if (!isMockToken && (!activeWabaId || activeWabaId === '293847561029384')) {
        // Query Phone Number details to find parent WhatsApp Business Account (WABA ID)
        if (!whatsapp.phoneNumberId) {
          throw new Error('Phone Number ID is required to auto-resolve WABA ID.');
        }
        const phoneUrl = `https://graph.facebook.com/v20.0/${whatsapp.phoneNumberId}?fields=whatsapp_business_account`;
        const phoneRes = await fetch(phoneUrl, {
          headers: {
            'Authorization': `Bearer ${whatsapp.accessToken}`
          }
        });
        if (phoneRes.ok) {
          const phoneData = await phoneRes.json();
          if (phoneData.whatsapp_business_account && phoneData.whatsapp_business_account.id) {
            activeWabaId = phoneData.whatsapp_business_account.id;
            setWhatsapp((prev) => ({ ...prev, wabaId: activeWabaId }));
          } else {
            throw new Error('No WhatsApp Business Account associated with this Phone Number.');
          }
        } else {
          const errBody = await phoneRes.json().catch(() => ({}));
          throw new Error(errBody?.error?.message || 'Failed to auto-resolve WABA ID from Phone Number ID.');
        }
      }

      const url = `https://graph.facebook.com/v20.0/${activeWabaId}/message_templates?limit=100`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${whatsapp.accessToken}`
        }
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `API error (${response.status})`);
      }

      const res = await response.json();
      const metaTemplates: any[] = res.data || [];

      if (metaTemplates.length === 0) {
        toast.success('No templates found in this WhatsApp Business Account.', { id: toastId });
        return;
      }

      const parsedTemplates: WhatsAppTemplate[] = metaTemplates.map((metaTpl) => {
        const bodyComp = metaTpl.components?.find((c: any) => c.type === 'BODY');
        const bodyText = bodyComp?.text || 'No body content';

        const buttonsComp = metaTpl.components?.find((c: any) => c.type === 'BUTTONS');
        const hasDynamicButton = buttonsComp?.buttons?.some((b: any) => 
          b.type === 'URL' && b.url && b.url.includes('{{1}}')
        ) || false;

        let status: 'Approved' | 'Pending' | 'Rejected' = 'Approved';
        const rawStatus = metaTpl.status?.toLowerCase();
        if (rawStatus === 'pending') status = 'Pending';
        else if (rawStatus === 'rejected') status = 'Rejected';

        const langCode = metaTpl.language || 'en';

        return {
          name: metaTpl.name,
          language: langCode,
          status,
          body: bodyText,
          hasDynamicButton
        };
      });

      setTemplates(parsedTemplates);
      saveWhatsAppTemplates(orgId, parsedTemplates);
      toast.success(`Successfully loaded ${parsedTemplates.length} templates from Meta API!`, { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error(`Failed to fetch templates: ${err.message}`, { id: toastId });
    } finally {
      setIsFetchingFromAPI(false);
    }
  };

  const handleSave = async () => {
    saveClinicBranding(orgId, branding);
    saveClinicProcedures(orgId, procedures);
    saveClinicMedications(orgId, medications);
    saveWhatsAppConfig(orgId, whatsapp);

    if (organizationId && organizationId !== 'default') {
      try {
        const { error } = await supabase
          .from('dental_clinics')
          .update({
            whatsapp_phone_number_id: whatsapp.phoneNumberId,
            whatsapp_access_token: whatsapp.accessToken,
            waba_id: whatsapp.wabaId || null,
            google_review_url: whatsapp.googleReviewUrl || null,
            before_after_template_name: whatsapp.beforeAfterTemplateName || 'clinical_image_record',
            prescription_template_name: whatsapp.prescriptionTemplateName || 'prescription_pdf_share',
            booking_template_name: whatsapp.bookingTemplateName || 'booking',
            name: branding.clinicName,
            address: branding.address,
            phone: branding.phone,
            doctor_name: branding.doctorName,
            qualifications: branding.qualifications,
            email: branding.email,
            logo_url: branding.logoUrl,
          } as any)
          .eq('id', organizationId);

        if (error) throw error;

        // Save medications library to Supabase log
        const { error: medError } = await supabase
          .from('reactivation_audit_logs')
          .insert({
            organization_id: organizationId,
            action: 'clinic_medications',
            details: { medications }
          });

        if (medError) throw medError;

        // Save notification preferences to reactivation_audit_logs and localStorage
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
          try {
            await supabase
              .from('reactivation_audit_logs')
              .insert({
                organization_id: organizationId,
                action: 'notification_preferences',
                details: { notificationPrefs }
              });
          } catch (e) {
            console.warn('Failed to insert into reactivation_audit_logs:', e);
          }
        }

        // Also save to localStorage
        try {
          localStorage.setItem(`notification_preferences_${orgId}`, JSON.stringify(notificationPrefs));
        } catch (e) {
          console.warn('Failed to save to localStorage:', e);
        }
      } catch (err) {
        console.error('Error saving clinic configuration to Supabase:', err);
        toast.error('Failed to sync settings with database.');
      }
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="max-w-5xl mx-auto space-y-6 pb-12"
    >
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-bold text-slate-800 tracking-tight">Clinic Settings</h1>
          <p className="text-[12px] text-slate-500 mt-0.5">
            Manage your clinic identity details, prescription branding, and treatment baseline prices.
          </p>
        </div>
        <button
          onClick={handleSave}
          className={`hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all duration-200 shadow-sm ${
            saved
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20 shadow-md'
          }`}
        >
          {saved ? (
            <><CheckCircle2 size={15} /> Saved!</>
          ) : (
            <><Save size={15} /> Save Changes</>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200/50 mb-6 overflow-x-auto gap-1.5 scrollbar-none shrink-0 text-left">
        <button
          type="button"
          onClick={() => setActiveTab('info')}
          className={`flex-1 min-w-[125px] flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none ${
            activeTab === 'info'
              ? 'bg-white text-indigo-600 shadow-sm border border-slate-100'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Building2 size={13} />
          Clinic Info
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('prices')}
          className={`flex-1 min-w-[125px] flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none ${
            activeTab === 'prices'
              ? 'bg-white text-indigo-600 shadow-sm border border-slate-100'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Stethoscope size={13} />
          Service Catalog
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('whatsapp')}
          className={`flex-1 min-w-[125px] flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none ${
            activeTab === 'whatsapp'
              ? 'bg-white text-indigo-600 shadow-sm border border-slate-100'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <MessageSquare size={13} />
          WhatsApp API
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('medications')}
          className={`flex-1 min-w-[125px] flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none ${
            activeTab === 'medications'
              ? 'bg-white text-indigo-600 shadow-sm border border-slate-100'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Pill size={13} />
          Prescription Presets
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('notifications')}
          className={`flex-1 min-w-[125px] flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none ${
            activeTab === 'notifications'
              ? 'bg-white text-indigo-600 shadow-sm border border-slate-100'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Bell size={13} />
          Notifications
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('emi')}
          className={`flex-1 min-w-[125px] flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none ${
            activeTab === 'emi'
              ? 'bg-white text-indigo-600 shadow-sm border border-slate-100'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <CreditCard size={13} />
          EMI Partners
        </button>
      </div>

      {activeTab === 'info' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* ── Left: Form ─────────────────────────────────────── */}
          <div className="space-y-4">
            {/* Clinic Identity */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                  <Building2 size={14} className="text-indigo-500" />
                </div>
                <h3 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Clinic Identity</h3>
              </div>

              <div className="space-y-4">
                {/* Clinic Logo Upload */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Clinic Logo
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl border border-dashed border-indigo-200 bg-indigo-50/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {branding.logoUrl ? (
                        <img src={branding.logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
                      ) : (
                        <Building2 size={20} className="text-indigo-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="cursor-pointer inline-flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-[11px] font-bold px-3 py-2 rounded-lg transition active:scale-95 duration-150">
                        <Upload size={12} />
                        {branding.logoUrl ? 'Replace Logo' : 'Upload Logo'}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              handleChange('logoUrl', ev.target?.result as string);
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                      </label>
                      {branding.logoUrl && (
                        <button
                          onClick={() => handleChange('logoUrl', '')}
                          className="ml-3 text-[10px] text-rose-600 hover:text-rose-700 font-bold uppercase transition"
                        >
                          Remove
                        </button>
                      )}
                      <p className="text-[9.5px] text-slate-400 mt-1.5 leading-relaxed">PNG or JPG · Used on transformation templates & prescriptions</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Clinic Name
                  </label>
                  <div className="flex items-stretch border border-slate-200 rounded-xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/20 bg-white">
                    <div className="bg-slate-50 border-r border-slate-200 px-3.5 flex items-center justify-center text-slate-400 shrink-0">
                      <Building2 size={16} />
                    </div>
                    <input
                      type="text"
                      value={branding.clinicName}
                      onChange={(e) => handleChange('clinicName', e.target.value)}
                      placeholder="e.g. Sharma Dental Care"
                      className="flex-1 px-3.5 py-2.5 text-[13px] text-slate-800 placeholder:text-slate-400 bg-transparent outline-none w-full border-0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Clinic Address
                  </label>
                  <div className="flex items-stretch border border-slate-200 rounded-xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/20 bg-white">
                    <div className="bg-slate-50 border-r border-slate-200 px-3.5 flex items-center justify-center text-slate-400 shrink-0">
                      <Globe size={16} />
                    </div>
                    <textarea
                      value={branding.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      placeholder="123, MG Road, Sector 5, New Delhi — 110001"
                      rows={2}
                      className="flex-1 px-3.5 py-2 text-[13px] text-slate-800 placeholder:text-slate-400 bg-transparent outline-none w-full border-0 resize-none leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Doctor Profile */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center">
                  <Stethoscope size={14} className="text-violet-500" />
                </div>
                <h3 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Doctor Profile</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Doctor Name
                  </label>
                  <div className="flex items-stretch border border-slate-200 rounded-xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/20 bg-white">
                    <div className="bg-slate-50 border-r border-slate-200 px-3.5 flex items-center justify-center text-slate-400 shrink-0">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={branding.doctorName}
                      onChange={(e) => handleChange('doctorName', e.target.value)}
                      placeholder="e.g. Dr. Priya Sharma"
                      className="flex-1 px-3.5 py-2.5 text-[13px] text-slate-800 placeholder:text-slate-400 bg-transparent outline-none w-full border-0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Qualifications
                  </label>
                  <div className="flex items-stretch border border-slate-200 rounded-xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/20 bg-white">
                    <div className="bg-slate-50 border-r border-slate-200 px-3.5 flex items-center justify-center text-slate-400 shrink-0">
                      <Stethoscope size={16} />
                    </div>
                    <input
                      type="text"
                      value={branding.qualifications}
                      onChange={(e) => handleChange('qualifications', e.target.value)}
                      placeholder="e.g. BDS, MDS (Orthodontics)"
                      className="flex-1 px-3.5 py-2.5 text-[13px] text-slate-800 placeholder:text-slate-400 bg-transparent outline-none w-full border-0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center">
                  <Phone size={14} className="text-sky-500" />
                </div>
                <h3 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Contact Details</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Phone
                  </label>
                  <div className="flex items-stretch border border-slate-200 rounded-xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/20 bg-white">
                    <div className="bg-slate-50 border-r border-slate-200 px-3.5 flex items-center justify-center text-slate-400 shrink-0">
                      <Phone size={16} />
                    </div>
                    <input
                      type="tel"
                      value={branding.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="+91 98765 43210"
                      className="flex-1 px-3.5 py-2.5 text-[13px] text-slate-800 placeholder:text-slate-400 bg-transparent outline-none w-full border-0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Email <span className="text-slate-450 normal-case font-normal">(optional)</span>
                  </label>
                  <div className="flex items-stretch border border-slate-200 rounded-xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/20 bg-white">
                    <div className="bg-slate-50 border-r border-slate-200 px-3.5 flex items-center justify-center text-slate-400 shrink-0">
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      value={branding.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="clinic@example.com"
                      className="flex-1 px-3.5 py-2.5 text-[13px] text-slate-800 placeholder:text-slate-400 bg-transparent outline-none w-full border-0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Save button (bottom, for mobile) */}
            <button
              onClick={handleSave}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-semibold transition-all duration-200 lg:hidden ${
                saved
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/20'
              }`}
            >
              {saved ? <><CheckCircle2 size={15} /> Saved!</> : <><Save size={15} /> Save Changes</>}
            </button>
          </div>

          {/* ── Right: Preview ─────────────────────────────────── */}
          <div className="space-y-3 lg:sticky lg:top-4">
            <div className="flex items-center gap-2">
              <FileText size={14} className="text-slate-400" />
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Live Prescription Preview</span>
            </div>
            <PrescriptionPreview branding={branding} />
            <p className="text-[10.5px] text-slate-400 text-center">
              This is how your clinic header will appear on printed prescription PDFs.
            </p>
          </div>
        </div>
      ) : activeTab === 'prices' ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                <Stethoscope size={14} className="text-indigo-500" />
              </div>
              <h3 className="text-[12.5px] font-bold text-slate-800 uppercase tracking-wider">Treatment Catalog & Pricing</h3>
            </div>
            <button
              type="button"
              onClick={handleRestoreDefaults}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-bold bg-indigo-50 hover:bg-indigo-100/80 px-2.5 py-1.5 rounded-lg border border-indigo-100 transition-colors"
            >
              Reset to Defaults
            </button>
          </div>

          {/* Mobile view: list of cards */}
          <div className="block sm:hidden space-y-4">
            {procedures.map((proc, index) => (
              <div key={index} className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-3 relative shadow-sm">
                {/* Header with name and delete button */}
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={proc.name}
                    onChange={(e) => handleProcedureChange(index, 'name', e.target.value)}
                    placeholder="Procedure Name"
                    className="w-full bg-white px-2.5 py-2 rounded-lg border border-slate-200 text-[13px] font-semibold text-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/25 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveProcedure(index)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all shrink-0 border border-transparent hover:border-rose-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Grid for other fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-1">
                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Cost (₹)</label>
                    <div className="flex items-stretch border border-slate-200 rounded-lg overflow-hidden bg-white focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/25">
                      <div className="bg-slate-50 border-r border-slate-200 px-2 flex items-center justify-center text-slate-550 text-[11px] font-bold shrink-0">₹</div>
                      <input
                        type="number"
                        value={proc.defaultCost}
                        onChange={(e) => handleProcedureChange(index, 'defaultCost', Number(e.target.value))}
                        className="w-full bg-transparent px-2 py-1.5 text-[12px] text-slate-800 outline-none border-0 font-mono font-semibold"
                      />
                    </div>
                  </div>

                  <div className="col-span-1">
                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">GST / Tax</label>
                    <select
                      value={proc.gstRate}
                      onChange={(e) => handleProcedureChange(index, 'gstRate', Number(e.target.value))}
                      className="w-full bg-white px-2 py-1.5 rounded-lg border border-slate-200 text-[12px] text-slate-700 outline-none cursor-pointer focus:border-indigo-500"
                    >
                      <option value={0}>0% GST (Therapeutic)</option>
                      <option value={18}>18% GST (Cosmetic)</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop view: Table */}
          <div className="hidden sm:block overflow-x-auto border border-slate-100 rounded-xl bg-slate-50/20">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/80">
                  <th className="py-3 px-4.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-4">Treatment Name</th>
                  <th className="py-3 px-4.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider w-56">Baseline Cost (₹)</th>
                  <th className="py-3 px-4.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider w-48">Tax Rate</th>
                  <th className="py-3 px-4.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider w-12 text-center pr-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {procedures.map((proc, index) => (
                  <tr key={index} className="group hover:bg-slate-50/40 transition-colors">
                    <td className="py-2.5 pl-4 pr-3">
                      <input
                        type="text"
                        value={proc.name}
                        onChange={(e) => handleProcedureChange(index, 'name', e.target.value)}
                        className="w-full bg-transparent px-3 py-2 rounded-xl border border-transparent hover:border-slate-200 focus:border-indigo-500 focus:bg-white text-[13px] text-slate-800 outline-none transition-all font-medium"
                      />
                    </td>
                    <td className="py-2.5 pr-3">
                      <div className="flex items-stretch border border-transparent hover:border-slate-200 rounded-xl overflow-hidden focus-within:border-indigo-500 focus-within:bg-white group-hover:border-slate-100/80 bg-transparent transition-all">
                        <div className="bg-slate-50/30 border-r border-slate-200/50 px-3 flex items-center justify-center text-slate-400 font-bold text-[12px] shrink-0">₹</div>
                        <input
                          type="number"
                          value={proc.defaultCost}
                          onChange={(e) => handleProcedureChange(index, 'defaultCost', Number(e.target.value))}
                          className="w-full bg-transparent px-3 py-2 text-[13px] text-slate-800 outline-none border-0 font-mono font-bold"
                        />
                      </div>
                    </td>
                    <td className="py-2.5 pr-3">
                      <select
                        value={proc.gstRate}
                        onChange={(e) => handleProcedureChange(index, 'gstRate', Number(e.target.value))}
                        className={`w-full bg-transparent px-2.5 py-2 rounded-xl border border-transparent hover:border-slate-200 focus:border-indigo-500 focus:bg-white text-[12px] outline-none cursor-pointer transition-all font-semibold ${
                          proc.gstRate === 18 ? 'text-indigo-600' : 'text-emerald-600'
                        }`}
                      >
                        <option value={0}>0% (Therapeutic Care)</option>
                        <option value={18}>18% (Cosmetic Care)</option>
                      </select>
                    </td>
                    <td className="py-2.5 text-center pr-4">
                      <button
                        type="button"
                        onClick={() => handleRemoveProcedure(index)}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 border border-transparent hover:border-rose-100"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            onClick={handleAddProcedure}
            className="w-full flex items-center justify-center gap-1.5 py-3 border border-dashed border-slate-300 hover:border-indigo-400 rounded-xl text-[12.5px] font-bold text-slate-500 hover:text-indigo-600 transition-all bg-slate-50/20 hover:bg-indigo-50/10 active:scale-[0.99] duration-150"
          >
            <Plus size={15} /> Add New Procedure
          </button>

          {/* Save button (bottom, for mobile/tablet) */}
          <button
            onClick={handleSave}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-semibold transition-all duration-200 lg:hidden ${
              saved
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/20'
            }`}
          >
            {saved ? <><CheckCircle2 size={15} /> Saved!</> : <><Save size={15} /> Save Changes</>}
          </button>
        </div>
      ) : activeTab === 'whatsapp' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left: Configuration Form */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                  <MessageSquare size={14} className="text-emerald-500" />
                </div>
                <h3 className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">WhatsApp Business API Setup</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    WhatsApp Phone Number ID
                  </label>
                  <input
                    type="text"
                    value={whatsapp.phoneNumberId}
                    onChange={(e) => handleWhatsAppChange('phoneNumberId', e.target.value)}
                    placeholder="e.g. 102938475610293"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                  />
                  <p className="text-[9.5px] text-slate-400 mt-1">Found in your Meta App Dashboard under WhatsApp &gt; API Setup.</p>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    WhatsApp Business Account ID (WABA ID)
                  </label>
                  <input
                    type="text"
                    value={whatsapp.wabaId}
                    onChange={(e) => handleWhatsAppChange('wabaId', e.target.value)}
                    placeholder="e.g. 293847561029384"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                  />
                  <p className="text-[9.5px] text-slate-400 mt-1">Also listed on the WhatsApp API Setup page in Meta Business suite.</p>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    System User Access Token
                  </label>
                  <div className="relative">
                    <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      value={whatsapp.accessToken}
                      onChange={(e) => handleWhatsAppChange('accessToken', e.target.value)}
                      placeholder="EAAGxxxxxxxxxxxxxxxxxxxxxxxx"
                      className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                    />
                  </div>
                  <p className="text-[9.5px] text-slate-400 mt-1">Permanent system user token with whatsapp_business_messaging permissions.</p>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Google Review / Maps Link (Custom Button URL)
                  </label>
                  <div className="relative">
                    <Globe size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={whatsapp.googleReviewUrl || ''}
                      onChange={(e) => handleWhatsAppChange('googleReviewUrl', e.target.value)}
                      placeholder="e.g. https://maps.app.goo.gl/KJ78ipBjeu7DfV4N9"
                      className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                    />
                  </div>
                  <p className="text-[9.5px] text-slate-400 mt-1">Used for custom button review link in before/after smile dispatches. (Note: iOS tracking parameters like ?g_st=ic will be cleaned automatically to prevent Google Maps app crashes).</p>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Before/After Photo Sharing Template
                  </label>
                  <div className="relative">
                    <select
                      value={whatsapp.beforeAfterTemplateName || 'clinical_image_record'}
                      onChange={(e) => handleWhatsAppChange('beforeAfterTemplateName', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all cursor-pointer font-medium"
                    >
                      <option value="clinical_image_record">clinical_image_record (Utility Category Standard - Recommended)</option>
                      <option value="googlereview">googlereview (Default Website Button)</option>
                      <option value="smile_makeover_google_review">smile_makeover_google_review (Quick Reply Bot Reply)</option>
                      <option value="clinical_image_record">clinical_image_record (Utility Category Standard)</option>
                      {templates
                        .filter(t => t.name !== 'googlereview' && t.name !== 'smile_makeover_google_review' && t.name !== 'clinical_image_record')
                        .map(t => (
                          <option key={t.name} value={t.name}>{t.name}</option>
                        ))
                      }
                    </select>
                  </div>
                  <p className="text-[9.5px] text-slate-400 mt-1">Select which template is used when dispatching patient before/after smile photos automatically or manually.</p>
                </div>
              </div>
            </div>

            {/* WhatsApp Message Templates Section */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                    <MessageSquare size={14} className="text-indigo-500" />
                  </div>
                  <h3 className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">Message Templates</h3>
                </div>
                {!showAddTemplateForm && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleFetchTemplatesFromAPI}
                      disabled={isFetchingFromAPI}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-50 rounded-lg text-[11px] font-bold transition-all border border-slate-200"
                    >
                      <RefreshCw size={12} className={isFetchingFromAPI ? 'animate-spin' : ''} />
                      Sync Meta API
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddTemplateForm(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-bold transition-all shadow-sm"
                    >
                      <Plus size={13} /> Create Template
                    </button>
                  </div>
                )}
              </div>

              {/* Add Template Form */}
              {showAddTemplateForm && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <h4 className="text-[11.5px] font-bold text-slate-700 uppercase tracking-wider">New Custom Template</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Template Name
                      </label>
                      <input
                        type="text"
                        value={newTemplateName}
                        onChange={(e) => setNewTemplateName(e.target.value)}
                        placeholder="e.g. follow_up_recall"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-[12.5px] text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-400"
                      />
                      <p className="text-[9.5px] text-slate-400 mt-1">
                        Use lowercase letters, numbers, and underscores only.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Language
                        </label>
                        <select
                          value={newTemplateLang}
                          onChange={(e) => setNewTemplateLang(e.target.value)}
                          className="w-full px-2 py-2 rounded-lg border border-slate-200 bg-white text-[12px] text-slate-700 outline-none cursor-pointer"
                        >
                          <option value="en">English (en)</option>
                          <option value="hi">Hindi (hi)</option>
                          <option value="es">Spanish (es)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Approval Simulation
                        </label>
                        <div className="w-full px-3 py-2 rounded-lg border border-emerald-100 bg-emerald-50 text-[12px] text-emerald-700 font-bold flex items-center gap-1.5">
                          <CheckCircle2 size={13} /> Approved Instantly
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Template Body Content
                      </label>
                      <textarea
                        value={newTemplateBody}
                        onChange={(e) => setNewTemplateBody(e.target.value)}
                        placeholder="Dear {{1}}, this is to remind you of your appointment on {{2}}."
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-[12.5px] text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-400 resize-none"
                      />
                      <p className="text-[9.5px] text-slate-400 mt-1">
                        Use double curly braces like {"{{1}}"}, {"{{2}}"} as dynamic placeholders.
                      </p>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddTemplateForm(false);
                          setNewTemplateName('');
                          setNewTemplateBody('');
                        }}
                        className="px-3 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-lg text-[11px] font-bold transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleAddTemplate}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-bold transition-all shadow-sm"
                      >
                        Add Template
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Templates List */}
              <div className="space-y-3.5">
                {templates.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    No templates registered. Click "Create Template" or "Sync Meta API" to load.
                  </div>
                ) : (
                  templates.map((tpl, index) => (
                    <div key={index} className="border border-slate-200/60 rounded-xl p-4 space-y-3 hover:border-slate-300 transition-all bg-slate-50/30 relative group shadow-sm hover:shadow-md/50">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1.5 text-left">
                          <h4 className="text-[12px] font-mono font-bold text-slate-700 break-all bg-slate-100/60 px-2 py-0.5 rounded border border-slate-200/40 inline-block">
                            {tpl.name}
                          </h4>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1 text-[9px] text-slate-500 font-bold bg-white border border-slate-200 rounded-md px-2 py-0.5 uppercase tracking-wide">
                              <Globe size={10} /> {tpl.language}
                            </span>
                            <span className={`inline-flex items-center gap-1 text-[9px] font-bold rounded-md px-2 py-0.5 border uppercase tracking-wider ${
                              tpl.status === 'Approved'
                                ? 'bg-emerald-50 border-emerald-250 text-emerald-700'
                                : tpl.status === 'Pending'
                                ? 'bg-amber-50 border-amber-250 text-amber-700'
                                : 'bg-rose-50 border-rose-250 text-rose-700'
                            }`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${tpl.status === 'Approved' ? 'bg-emerald-500' : tpl.status === 'Pending' ? 'bg-amber-500 animate-pulse' : 'bg-rose-500'}`} />
                              <span>{tpl.status}</span>
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveTemplate(index)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <div className="bg-white border border-slate-200/50 rounded-lg p-3 text-[12px] text-slate-700 font-medium leading-relaxed text-left font-sans">
                        {tpl.body}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Save Button for Mobile */}
            <button
              onClick={handleSave}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-semibold transition-all duration-200 lg:hidden ${
                saved
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/20'
              }`}
            >
              {saved ? <><CheckCircle2 size={15} /> Saved!</> : <><Save size={15} /> Save Changes</>}
            </button>
          </div>

          {/* Right: Status and Testing Connection */}
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Connection Status</h3>
              
              {whatsapp.phoneNumberId && whatsapp.wabaId && whatsapp.accessToken ? (
                <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-[12px] font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  Connected & Active (Simulated)
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 text-slate-500 rounded-xl text-[12px] font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  Not Configured / Inactive
                </div>
              )}

              <p className="text-[10px] text-slate-400 leading-relaxed">
                Configure your Meta developer account credentials. Valid config values enable the CRM to deliver simulated campaign templates and automations in real-time.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Test Messaging</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  value={testNumber}
                  onChange={(e) => setTestNumber(e.target.value)}
                  placeholder="Recipient Mobile e.g. 9876543210"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-[12.5px] outline-none"
                />
                <button
                  type="button"
                  onClick={handleSendTestMessage}
                  disabled={isSendingTest}
                  className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold rounded-lg text-[12px] transition-all flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/15"
                >
                  <Send size={13} />
                  {isSendingTest ? 'Delivering...' : 'Send Simulated Test'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'medications' ? (
        <div className="space-y-6 text-left animate-fadeIn">
          {/* Medications list config (Full Width) */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm">
                  <Pill size={16} className="text-indigo-500 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider">Medications Preset Library</h3>
                  <p className="text-[10px] text-slate-400 font-medium">Add or manage frequently used prescriptions</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Restore default dental medications? This will overwrite custom medications.")) {
                    setMedications([...DEFAULT_MEDICATIONS]);
                    setSaved(false);
                    toast.success("Medications reset to defaults.");
                  }
                }}
                className="text-xs text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer border border-indigo-100/50"
              >
                Reset to Defaults
              </button>
            </div>

            {/* Add form */}
            <div className="bg-slate-50/50 border border-slate-200/60 rounded-xl p-5 space-y-4 shadow-inner">
              <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                Add New Medication Preset
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-3">
                  <label className="block text-[9.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Drug Label / Shortcut</label>
                  <input
                    type="text"
                    value={newMedLabel}
                    onChange={(e) => setNewMedLabel(e.target.value)}
                    placeholder="e.g. Paracetamol 650mg"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-700 font-medium shadow-sm transition-all"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-[9.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Category</label>
                  <select
                    value={newMedCategory}
                    onChange={(e) => setNewMedCategory(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-700 font-medium shadow-sm transition-all h-[34px] cursor-pointer"
                  >
                    <option value="Pain killers">Pain killers</option>
                    <option value="Antibiotics">Antibiotics</option>
                    <option value="Multivitamins">Multivitamins</option>
                    <option value="Toothpaste">Toothpaste</option>
                    <option value="Mouthwash">Mouthwash</option>
                    <option value="Gels">Gels</option>
                    <option value="Gas/Acidity">Gas/Acidity</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[9.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Price (₹)</label>
                  <input
                    type="number"
                    value={newMedPrice}
                    onChange={(e) => setNewMedPrice(e.target.value)}
                    placeholder="0"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-700 font-mono shadow-sm transition-all"
                  />
                </div>
                <div className="md:col-span-4 flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="block text-[9.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Rx Instruction (Optional)</label>
                    <input
                      type="text"
                      value={newMedText}
                      onChange={(e) => setNewMedText(e.target.value)}
                      placeholder="e.g. • Tab. Paracetamol - 1 SOS"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-700 font-medium shadow-sm transition-all"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!newMedLabel.trim()) {
                        toast.error("Please fill in the drug label/shortcut name.");
                        return;
                      }
                      
                      let finalInstruction = newMedText.trim();
                      if (!finalInstruction) {
                        const name = newMedLabel.trim();
                        if (newMedCategory === 'Antibiotics') finalInstruction = `• Tab. ${name} - 1 cap thrice daily for 5 days`;
                        else if (newMedCategory === 'Pain killers') finalInstruction = `• Tab. ${name} - 1 tab SOS for pain`;
                        else if (newMedCategory === 'Multivitamins') finalInstruction = `• Tab. ${name} - 1 tab once daily`;
                        else if (newMedCategory === 'Toothpaste') finalInstruction = `• ${name} - brush twice daily`;
                        else if (newMedCategory === 'Mouthwash') finalInstruction = `• ${name} - rinse twice daily for 7 days`;
                        else if (newMedCategory === 'Gels') finalInstruction = `• ${name} - apply on affected area twice daily`;
                        else if (newMedCategory === 'Gas/Acidity') finalInstruction = `• Tab. ${name} - 1 tab once daily before food`;
                        else finalInstruction = `• Tab. ${name} - 1 tab twice daily`;
                      }

                      const newItem: Medication = {
                        id: Date.now().toString(),
                        label: newMedLabel.trim(),
                        text: finalInstruction,
                        category: newMedCategory,
                        price: Number(newMedPrice) || 0
                      };
                      setMedications(prev => [...prev, newItem]);
                      setNewMedLabel('');
                      setNewMedText('');
                      setNewMedPrice('0');
                      setSaved(false);
                      toast.success("Medication added. Click 'Save Changes' to save.");
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg px-4 py-2 text-xs transition-all active:scale-95 cursor-pointer shadow-md shadow-indigo-500/15 border border-indigo-700/10"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Grid / List of current presets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4.5">
              {medications.length === 0 ? (
                <p className="col-span-full text-center py-12 text-xs text-slate-400 font-medium bg-slate-50/20 border border-dashed border-slate-200 rounded-xl">
                  No medications configured. Click 'Reset to Defaults' or add custom ones above.
                </p>
              ) : (
                medications.map((med) => (
                  <div 
                    key={med.id} 
                    className="group border border-slate-200 hover:border-slate-350 bg-white rounded-xl p-4 flex flex-col justify-between gap-3 shadow-sm hover:shadow-md/50 transition-all duration-200"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-1.5">
                        <div className="w-full sm:w-auto flex-1">
                          <input
                            type="text"
                            value={med.label}
                            onChange={(e) => {
                              const val = e.target.value;
                              setMedications(prev => prev.map(m => m.id === med.id ? { ...m, label: val } : m));
                              setSaved(false);
                            }}
                            className="w-full text-[9.5px] sm:text-[10px] font-bold text-indigo-700 bg-indigo-50/80 border border-indigo-100 rounded-lg px-2.5 py-1 sm:py-0.5 outline-none focus:ring-1 focus:ring-indigo-400 font-sans"
                            title="Edit Medicine Name"
                          />
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                          {med.category && (
                            <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-md border uppercase tracking-wider ${
                              med.category === 'Pain killers' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                              med.category === 'Antibiotics' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                              med.category === 'Multivitamins' ? 'bg-pink-50 text-pink-600 border-pink-100' :
                              med.category === 'Toothpaste' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                              med.category === 'Mouthwash' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                              med.category === 'Gels' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                              med.category === 'Gas/Acidity' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                              'bg-slate-50 text-slate-500 border-slate-200'
                            }`}>
                              {med.category}
                            </span>
                          )}
                          <div className="inline-flex items-center gap-0.5 bg-emerald-50 border border-emerald-100 rounded-md px-1.5 py-0.5 max-w-[78px] font-mono select-none">
                            <span className="text-[9.5px] font-bold text-emerald-700">₹</span>
                            <input
                              type="number"
                              value={med.price || 0}
                              onChange={(e) => {
                                const val = Number(e.target.value) || 0;
                                setMedications(prev => prev.map(m => m.id === med.id ? { ...m, price: val } : m));
                                setSaved(false);
                              }}
                              className="w-full bg-transparent outline-none border-0 text-[9.5px] font-bold text-emerald-700 font-mono p-0 focus:ring-0 select-text [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              title="Edit Price"
                            />
                          </div>
                        </div>
                      </div>
                      <textarea
                        value={med.text}
                        onChange={(e) => {
                          const val = e.target.value;
                          setMedications(prev => prev.map(m => m.id === med.id ? { ...m, text: val } : m));
                          setSaved(false);
                        }}
                        rows={2}
                        className="w-full text-[12px] text-slate-700 font-medium mt-2 bg-transparent border-0 focus:ring-1 focus:ring-indigo-100 outline-none resize-none p-1 font-sans rounded-md leading-relaxed text-left"
                        title="Edit Instruction"
                      />
                    </div>
                    <div className="flex justify-end pt-1.5 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          setMedications(prev => prev.filter(m => m.id !== med.id));
                          setSaved(false);
                          toast.success("Medication preset deleted locally. Save to confirm.");
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 active:scale-95 transition-all opacity-85 group-hover:opacity-100 border border-transparent hover:border-rose-100"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Bottom Grid: Info & Save */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Quick Information</h3>
              <p className="text-[11.5px] text-slate-500 leading-relaxed font-sans">
                These medication shortcuts will populate as clickable selection bubbles under the <strong>Prescription (Rx)</strong> textarea in the patient details file. 
              </p>
              <p className="text-[11.5px] text-slate-500 leading-relaxed font-sans mt-2">
                Clicking any medication preset adds the full instruction automatically without requiring manual transcription or typing.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Confirm Settings</h3>
                <p className="text-[10px] text-slate-400 mt-1">Make sure to save changes after modifying presets.</p>
              </div>
              <button
                type="button"
                onClick={handleSave}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12.5px] font-bold transition-all duration-200 ${
                  saved
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/15 cursor-pointer'
                }`}
              >
                {saved ? <><CheckCircle2 size={14} /> Settings Saved</> : <><Save size={14} /> Save Presets</>}
              </button>
            </div>
          </div>
        </div>
      ) : activeTab === 'notifications' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 1. Web Push Settings */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                  <Bell size={14} className="text-indigo-500" />
                </div>
                <h3 className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">Web Push Alerts</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-left">
                  <div>
                    <h4 className="text-xs font-bold text-slate-700">Browser Push Status</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {!isPushSupported 
                        ? "Unsupported on this device/browser"
                        : `Current permission: ${pushPermission}`
                      }
                    </p>
                  </div>
                  {isPushSupported && (
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          if (isPushSubscribed) {
                            await disablePushNotifications();
                            setNotificationPrefs(prev => ({ ...prev, pushEnabled: false }));
                            toast.success('Push notifications disabled.');
                          } else {
                            const res = await enablePushNotifications();
                            if (res?.success) {
                              setNotificationPrefs(prev => ({ ...prev, pushEnabled: true }));
                              toast.success('Push notifications enabled successfully!');
                            } else {
                              const reason = res?.reason;
                              if (reason === 'denied') {
                                toast.error('Notification permission denied. Please allow notifications in your browser address bar/settings.');
                              } else if (reason === 'localhost_disabled') {
                                toast.error('Push notifications cannot be enabled on localhost without a secure tunnel override.');
                              } else if (reason === 'missing_vapid_key') {
                                toast.error('VAPID public key configuration is missing.');
                              } else if (reason === 'server_error_503') {
                                toast.error('Notification server is suspended. Please check the Render dashboard for creatorarmour-api.');
                              } else {
                                toast.error(`Failed to enable notifications: ${reason || 'Unknown error'}`);
                              }
                            }
                          }
                        } catch (err: any) {
                          console.error(err);
                          toast.error(`Error configuring notifications: ${err?.message || err}`);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[10.5px] font-bold transition-all ${
                        isPushSubscribed
                          ? 'bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100/50'
                          : 'bg-indigo-50 border border-indigo-100 text-indigo-600 hover:bg-indigo-100/50'
                      }`}
                    >
                      {isPushSubscribed ? 'Turn Off' : 'Turn On'}
                    </button>
                  )}
                </div>

                {isPushSubscribed && (
                  <button
                    type="button"
                    onClick={async () => {
                      await sendTestPush();
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-2 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-700 bg-white rounded-lg text-xs font-semibold transition-all"
                  >
                    Send Test Push Notification
                  </button>
                )}

                {!isPushSupported && (
                  <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl text-left text-[11px] text-amber-800 leading-relaxed space-y-1">
                    <p className="font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      iPadOS / iOS Push Requirements:
                    </p>
                    <p>
                      Apple requires webapps to be installed on the home screen to enable push alerts.
                    </p>
                    <p className="text-[10px] text-amber-700/90 mt-1.5">
                      💡 Tap the browser share button (square with arrow) and choose <strong>"Add to Home Screen"</strong>, then launch the app from your home screen.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 2. DND / Quiet Hours */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center">
                  <VolumeX size={14} className="text-rose-500" />
                </div>
                <h3 className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">Quiet Hours / DND</h3>
              </div>

              <div className="space-y-4 text-left">
                <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationPrefs.doNotDisturb}
                    onChange={(e) => setNotificationPrefs(prev => ({ ...prev, doNotDisturb: e.target.checked }))}
                    className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-700">Do Not Disturb</h4>
                    <p className="text-[10px] text-slate-400">Mute all incoming notifications immediately</p>
                  </div>
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Quiet Hours Start
                    </label>
                    <input
                      type="time"
                      disabled={notificationPrefs.doNotDisturb}
                      value={notificationPrefs.quietHoursStart}
                      onChange={(e) => setNotificationPrefs(prev => ({ ...prev, quietHoursStart: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-800 disabled:opacity-50 outline-none focus:border-indigo-400 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Quiet Hours End
                    </label>
                    <input
                      type="time"
                      disabled={notificationPrefs.doNotDisturb}
                      value={notificationPrefs.quietHoursEnd}
                      onChange={(e) => setNotificationPrefs(prev => ({ ...prev, quietHoursEnd: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-800 disabled:opacity-50 outline-none focus:border-indigo-400 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Channels */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center">
                  <Settings size={14} className="text-amber-500" />
                </div>
                <h3 className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">Alert Channels</h3>
              </div>

              <div className="space-y-3 text-left">
                <label className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-all">
                  <input
                    type="checkbox"
                    checked={notificationPrefs.emailEnabled}
                    onChange={(e) => setNotificationPrefs(prev => ({ ...prev, emailEnabled: e.target.checked }))}
                    className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-700">Email Notifications</h4>
                    <p className="text-[10px] text-slate-400">Receive summaries and urgent reports in your inbox</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-all">
                  <input
                    type="checkbox"
                    checked={notificationPrefs.inAppEnabled}
                    onChange={(e) => setNotificationPrefs(prev => ({ ...prev, inAppEnabled: e.target.checked }))}
                    className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-700">In-App Dashboard Alerts</h4>
                    <p className="text-[10px] text-slate-400">Populate notifications under the top header bell icon</p>
                  </div>
                </label>
              </div>
            </div>

            {/* 4. Events */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                  <Bell size={14} className="text-emerald-500" />
                </div>
                <h3 className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">Event Triggers</h3>
              </div>

              <div className="space-y-3 text-left">
                <label className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-all">
                  <input
                    type="checkbox"
                    checked={notificationPrefs.newLeads}
                    onChange={(e) => setNotificationPrefs(prev => ({ ...prev, newLeads: e.target.checked }))}
                    className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-700">New Website Leads</h4>
                    <p className="text-[10px] text-slate-400">Notify as soon as a user books a checkup or submits a query</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-all">
                  <input
                    type="checkbox"
                    checked={notificationPrefs.appointmentReminders}
                    onChange={(e) => setNotificationPrefs(prev => ({ ...prev, appointmentReminders: e.target.checked }))}
                    className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-700">Daily Appointment Reminders</h4>
                    <p className="text-[10px] text-slate-400">Notify every morning with a schedule of daily appointments</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-all">
                  <input
                    type="checkbox"
                    checked={notificationPrefs.campaignAlerts}
                    onChange={(e) => setNotificationPrefs(prev => ({ ...prev, campaignAlerts: e.target.checked }))}
                    className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-700">Campaign Activities</h4>
                    <p className="text-[10px] text-slate-400">Notify when automation campaigns trigger custom patient follow-ups</p>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* Confirm & Save block */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 space-y-3 text-left">
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">About Preferences</h3>
              <p className="text-[11.5px] text-slate-500 leading-relaxed font-sans">
                Your notification preferences are saved securely and synchronized in real-time. Enabling web push lets you receive updates even when the CRM dashboard is minimized or closed.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-4">
              <div className="text-left">
                <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Confirm Settings</h3>
                <p className="text-[10px] text-slate-400 mt-1">Make sure to save changes after modifying preferences.</p>
              </div>
              <button
                type="button"
                onClick={handleSave}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12.5px] font-bold transition-all duration-200 ${
                  saved
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/15 cursor-pointer'
                }`}
              >
                {saved ? <><CheckCircle2 size={14} /> Settings Saved</> : <><Save size={14} /> Save Preferences</>}
              </button>
            </div>
          </div>
        </div>
      ) : activeTab === 'emi' ? (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                <CreditCard size={15} className="text-indigo-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">NBFC Treatment Financing</h3>
                <p className="text-[11px] text-slate-400">Offer 0% interest monthly installments to your patients through premium NBFC partners.</p>
              </div>
            </div>
          </div>

          {emiStatus === 'Not Partnered' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Left Column: NBFC List */}
              <div className="lg:col-span-2 space-y-4 text-left">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Available NBFC Partners</h3>
                
                {[
                  {
                    name: 'Axis Bank (Jarvis)',
                    desc: 'Official Axis Bank Personal Loan & EMI integration. Provides automated digital KYC, instant underwriting support, and real-time processing.',
                    tenures: '6, 12, 18, 24 Months',
                    interest: '0% or Subsidized Interest',
                    approvalTime: 'Instant (API-driven)',
                    fee: '1% processing fee'
                  },
                  {
                    name: 'LiquiLoans',
                    desc: 'India\'s largest digital healthcare financing platform. Offers high approval rates and rapid processing.',
                    tenures: '3, 6, 9 Months',
                    interest: '0% Interest (No Cost)',
                    approvalTime: 'Instant (under 5 mins)',
                    fee: '1.5% processing fee'
                  },
                  {
                    name: 'Fibe (formerly EarlySalary)',
                    desc: 'Specialized medical loan provider. Ideal for clear aligners, dental implants, and cosmetic makeovers.',
                    tenures: '3, 6, 12 Months',
                    interest: '0% or Low-Interest EMIs',
                    approvalTime: '15 minutes',
                    fee: '2% processing fee'
                  },
                  {
                    name: 'SaveIn',
                    desc: 'Premium checkout financing for dental clinics. 100% paperless KYC and instant digital payouts.',
                    tenures: '3, 6 Months',
                    interest: '0% Interest (No Cost)',
                    approvalTime: 'Instant',
                    fee: '1% processing fee'
                  }
                ].map((partner) => (
                  <div key={partner.name} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-indigo-300 transition-all duration-200">
                    <div className="space-y-2 max-w-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-black text-slate-800 tracking-tight">{partner.name}</span>
                        {partner.name.includes('Axis') && (
                          <span className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-indigo-700 text-[9px] font-bold uppercase tracking-wider">New</span>
                        )}
                        {partner.name === 'LiquiLoans' && (
                          <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-100 text-emerald-700 text-[9px] font-bold uppercase tracking-wider">Preferred</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed font-sans">{partner.desc}</p>
                      
                      <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-1.5 text-[10.5px] font-medium text-slate-400 font-mono">
                        <div><strong className="text-slate-600 font-sans">Tenures:</strong> {partner.tenures}</div>
                        <div><strong className="text-slate-600 font-sans">Rates:</strong> {partner.interest}</div>
                        <div><strong className="text-slate-600 font-sans">Approvals:</strong> {partner.approvalTime}</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedNBFC(partner.name)}
                      className="px-4 py-2 border border-indigo-100 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-150 self-start sm:self-center shrink-0 cursor-pointer shadow-sm hover:shadow-indigo-500/10"
                    >
                      Apply to Partner
                    </button>
                  </div>
                ))}
              </div>

              {/* Right Column: Dynamic Form or Instructions */}
              <div className="space-y-4 text-left">
                {selectedNBFC ? (
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Partner with {selectedNBFC}</h3>
                      <button 
                        type="button" 
                        onClick={() => setSelectedNBFC(null)} 
                        className="text-slate-400 hover:text-slate-600 text-xs font-bold font-sans uppercase tracking-wider"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="space-y-3.5">
                      {selectedNBFC === 'Axis Bank (Jarvis)' && (
                        <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl space-y-2">
                          <h4 className="text-[10px] font-black text-indigo-700 uppercase tracking-wider">Developer Portal Setup</h4>
                          <p className="text-[10px] text-indigo-600 leading-relaxed font-sans">
                            Paste the OAuth Redirect URL below into your Axis Developer Portal application settings.
                          </p>
                          <div className="flex gap-1.5 items-center bg-white border border-indigo-200 px-2 py-1.5 rounded-lg">
                            <input 
                              type="text" 
                              readOnly 
                              value={`${window.location.origin}/emi/callback`} 
                              className="w-full bg-transparent outline-none border-0 text-[10px] font-mono text-slate-700 font-semibold"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(`${window.location.origin}/emi/callback`);
                                toast.success("Redirect URL copied!");
                              }}
                              className="text-[9px] font-bold text-indigo-600 hover:text-indigo-850 uppercase shrink-0"
                            >
                              Copy
                            </button>
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-[9.5px] font-bold text-slate-500 uppercase tracking-wider mb-1">Clinic Legal Name</label>
                        <input
                          type="text"
                          value={emiForm.legalName}
                          onChange={(e) => setEmiForm(prev => ({ ...prev, legalName: e.target.value }))}
                          className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-indigo-400 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-[9.5px] font-bold text-slate-500 uppercase tracking-wider mb-1">Doctor Name / MDS Reg No.</label>
                        <input
                          type="text"
                          value={emiForm.doctorName}
                          onChange={(e) => setEmiForm(prev => ({ ...prev, doctorName: e.target.value }))}
                          className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-indigo-400 transition-all"
                        />
                      </div>

                      {selectedNBFC === 'Axis Bank (Jarvis)' ? (
                        <>
                          <div>
                            <label className="block text-[9.5px] font-bold text-slate-500 uppercase tracking-wider mb-1">Axis Client ID / App ID</label>
                            <input
                              type="text"
                              placeholder="e.g., jarvis_client_id_..."
                              value={emiForm.clientId}
                              onChange={(e) => setEmiForm(prev => ({ ...prev, clientId: e.target.value }))}
                              className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-indigo-400 transition-all font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[9.5px] font-bold text-slate-500 uppercase tracking-wider mb-1">Axis Client Secret / Key</label>
                            <input
                              type="password"
                              placeholder="••••••••••••••••"
                              value={emiForm.clientSecret}
                              onChange={(e) => setEmiForm(prev => ({ ...prev, clientSecret: e.target.value }))}
                              className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-indigo-400 transition-all font-mono"
                            />
                          </div>
                        </>
                      ) : (
                        <div>
                          <label className="block text-[9.5px] font-bold text-slate-500 uppercase tracking-wider mb-1">PAN Card Number</label>
                          <input
                            type="text"
                            placeholder="ABCDE1234F"
                            value={emiForm.panNumber}
                            onChange={(e) => setEmiForm(prev => ({ ...prev, panNumber: e.target.value.toUpperCase() }))}
                            className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-indigo-400 transition-all font-mono"
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[9.5px] font-bold text-slate-500 uppercase tracking-wider mb-1">Settlement Bank A/C</label>
                          <input
                            type="text"
                            placeholder="0123456789"
                            value={emiForm.bankAccount}
                            onChange={(e) => setEmiForm(prev => ({ ...prev, bankAccount: e.target.value }))}
                            className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-indigo-400 transition-all font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[9.5px] font-bold text-slate-500 uppercase tracking-wider mb-1">Bank IFSC Code</label>
                          <input
                            type="text"
                            placeholder="HDFC0001234"
                            value={emiForm.ifsc}
                            onChange={(e) => setEmiForm(prev => ({ ...prev, ifsc: e.target.value.toUpperCase() }))}
                            className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-indigo-400 transition-all font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[9.5px] font-bold text-slate-500 uppercase tracking-wider mb-1">Monthly Billing Volume</label>
                        <select
                          value={emiForm.averageBilling}
                          onChange={(e) => setEmiForm(prev => ({ ...prev, averageBilling: e.target.value }))}
                          className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-indigo-400 transition-all"
                        >
                          <option value="Under 2L">Under ₹2 Lakhs</option>
                          <option value="2-5L">₹2 Lakhs - ₹5 Lakhs</option>
                          <option value="5-10L">₹5 Lakhs - ₹10 Lakhs</option>
                          <option value="Above 10L">Above ₹10 Lakhs</option>
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (!emiForm.legalName || !emiForm.doctorName || !emiForm.bankAccount || !emiForm.ifsc || (selectedNBFC === 'Axis Bank (Jarvis)' && (!emiForm.clientId || !emiForm.clientSecret))) {
                            toast.error("Please fill in all onboarding and credential details before applying.");
                            return;
                          }
                          localStorage.setItem('emi_partner_status', 'Pending');
                          localStorage.setItem('emi_partner_name', selectedNBFC || 'LiquiLoans');
                          if (selectedNBFC === 'Axis Bank (Jarvis)') {
                            localStorage.setItem('emi_client_id', emiForm.clientId);
                            localStorage.setItem('emi_client_secret', emiForm.clientSecret);
                          }
                          setEmiStatus('Pending');
                          toast.success(`Onboarding credentials submitted for ${selectedNBFC}! Verification pending.`);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
                      >
                        Submit Integration Credentials
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3.5">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">How onboarding works</h3>
                    <div className="space-y-3 text-xs text-slate-500 leading-relaxed font-sans">
                      <p className="flex gap-2">
                        <span className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-650 shrink-0">1</span>
                        <span>Select one of the preferred NBFC partners and submit your clinic registration/bank settlement details.</span>
                      </p>
                      <p className="flex gap-2">
                        <span className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-650 shrink-0">2</span>
                        <span>The NBFC verifies documents (KYC, doctor license) and issues a digital merchant account in 24 hours.</span>
                      </p>
                      <p className="flex gap-2">
                        <span className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-650 shrink-0">3</span>
                        <span>Once verified, 0% EMI options are automatically unlocked inside your patient checkout/treatment builder!</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {emiStatus === 'Pending' && (
            <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 text-center space-y-5 shadow-sm text-left">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 animate-pulse">
                  <RefreshCw size={24} />
                </div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Partnership Verification In Progress</h3>
                <p className="text-xs text-slate-500 font-sans leading-relaxed max-w-md">
                  Your registration details are currently being screened by the NBFC credit risk team. Verification takes 24-48 business hours.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4.5 space-y-3">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Onboarding Checklist</h4>
                <div className="space-y-2 text-xs font-sans text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-500" />
                    <span>Clinic registration details received</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                    <span className="text-slate-800 font-medium">NBFC Document validation (In Progress)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <div className="w-3 h-3 rounded-full border border-slate-300" />
                    <span>API keys generation & sandbox activation</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem('emi_partner_status', 'Active');
                    setEmiStatus('Active');
                    toast.success("Sandbox Integration activated successfully! Patient treatment builder EMIs are now enabled.");
                  }}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-150 cursor-pointer shadow-md shadow-emerald-600/10"
                >
                  Skip Review & Auto-Approve (For Demo Testing)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem('emi_partner_status', 'Not Partnered');
                    setEmiStatus('Not Partnered');
                    setSelectedNBFC(null);
                    toast.info("Partnership request reset.");
                  }}
                  className="px-4 py-2.5 border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all duration-150"
                >
                  Reset Form
                </button>
              </div>
            </div>
          )}

          {emiStatus === 'Active' && (
            <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-left space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                    <CheckSquare size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">NBFC Integration Active</h3>
                    <p className="text-[10px] text-slate-400">Merchant integration fully configured with {localStorage.getItem('emi_partner_name') || 'LiquiLoans'}</p>
                  </div>
                </div>
                
                <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-black uppercase tracking-wider">
                  Live & Checkout-Ready
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-200/80 rounded-xl p-4 space-y-2 bg-slate-50/50">
                  <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">Merchant Details</span>
                  <div className="text-xs space-y-1.5 text-slate-600 font-sans">
                    <div><strong>Clinic Name:</strong> {emiForm.legalName || branding?.clinicName || 'Clinic'}</div>
                    <div><strong>License / Reg No:</strong> {emiForm.doctorName || branding?.doctorName || 'Doctor'}</div>
                    {localStorage.getItem('emi_partner_name') === 'Axis Bank (Jarvis)' ? (
                      <div><strong>Client ID / App ID:</strong> {emiForm.clientId || localStorage.getItem('emi_client_id')}</div>
                    ) : (
                      <div><strong>PAN/GSTIN ID:</strong> {emiForm.panNumber || 'ABCDE1234F'}</div>
                    )}
                  </div>
                </div>

                <div className="border border-slate-200/80 rounded-xl p-4 space-y-2 bg-slate-50/50">
                  <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">Settlement Account</span>
                  <div className="text-xs space-y-1.5 text-slate-600 font-sans">
                    <div><strong>Settlement Type:</strong> T+1 Next-Day Payout</div>
                    <div><strong>Bank A/C:</strong> {emiForm.bankAccount || 'XXXXXXXX1234'}</div>
                    <div><strong>IFSC Code:</strong> {emiForm.ifsc || 'HDFC0001234'}</div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl space-y-2">
                <h4 className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">Patient Checkout Settings</h4>
                <p className="text-[11px] text-indigo-600 leading-relaxed font-sans">
                  Whenever treatment plans or receipts are generated in the patient details modal, patients will see monthly breakup tables for active {localStorage.getItem('emi_partner_name') || 'LiquiLoans'} plans. Launch any patient card to review the live integration.
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem('emi_partner_status', 'Not Partnered');
                    localStorage.removeItem('emi_partner_name');
                    localStorage.removeItem('emi_client_id');
                    localStorage.removeItem('emi_client_secret');
                    setEmiStatus('Not Partnered');
                    setSelectedNBFC(null);
                    toast.info("NBFC integration deactivated.");
                  }}
                  className="px-4 py-2 bg-rose-50 border border-rose-100 hover:bg-rose-100/50 text-rose-600 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-150 cursor-pointer"
                >
                  Deactivate Partner
                </button>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </motion.div>
  );
};

export default ReactivationClinicSettings;
