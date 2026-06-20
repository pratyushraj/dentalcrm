import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Phone, Mail, Save, CheckCircle2, FileText, Stethoscope, Trash2, Plus, MessageSquare, Send, Lock, Globe, RefreshCw, Pill, Upload } from 'lucide-react';
import { useSession } from '@/contexts/SessionContext';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WhatsAppConfig {
  phoneNumberId: string;
  wabaId: string;
  accessToken: string;
}

export interface WhatsAppTemplate {
  name: string;
  language: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  body: string;
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
  { name: 'Clear Aligners (Premium)', defaultCost: 85000, gstRate: 18 }
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
}

export const DEFAULT_MEDICATIONS: Medication[] = [
  { id: '1', label: 'Amoxicillin 500mg', text: '• Tab. Amoxicillin 500mg - 1 cap thrice daily for 5 days' },
  { id: '2', label: 'Paracetamol 650mg', text: '• Tab. Paracetamol 650mg - 1 tab SOS for pain' },
  { id: '3', label: 'Zerodol-SP', text: '• Tab. Zerodol-SP - 1 tab twice daily for 3 days' },
  { id: '4', label: 'Pantocid 40mg', text: '• Tab. Pantocid 40mg - 1 tab once daily before food' },
  { id: '5', label: 'Hexidine Mouthwash', text: '• Hexidine Mouthwash - rinse twice daily for 7 days' },
  { id: '6', label: 'Mox-CL 625mg', text: '• Tab. Mox-CL 625mg - 1 tab twice daily for 5 days' },
  { id: '7', label: 'Ketorol-DT', text: '• Tab. Ketorol-DT - 1 tab dissolved in water SOS' }
];

export const MEDICATIONS_KEY = (orgId: string) => `clinic_medications_${orgId}`;

export const loadClinicMedications = (orgId: string): Medication[] => {
  try {
    const raw = localStorage.getItem(MEDICATIONS_KEY(orgId));
    if (raw) return JSON.parse(raw) as Medication[];
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
    if (raw) return JSON.parse(raw) as WhatsAppConfig;
  } catch {}
  return {
    phoneNumberId: '109283746510293',
    wabaId: '293847561029384',
    accessToken: 'EAAG1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z',
  };
};

export const saveWhatsAppConfig = (orgId: string, data: WhatsAppConfig) => {
  localStorage.setItem(WHATSAPP_KEY(orgId), JSON.stringify(data));
};

export const DEFAULT_TEMPLATES: WhatsAppTemplate[] = [
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
    body: 'Dear {{1}}, thank you for choosing {{2}}. Please share your experience here: {{3}} . We appreciate your feedback!'
  },
  {
    name: 'smile_makeover_google_review',
    language: 'en',
    status: 'Approved',
    body: 'Hi {{1}}! Look at your incredible smile transformation! 🦷✨ We would love it if you shared this before/after photo and your experience on our Google Reviews page: {{2}} . Thank you for helping us grow!'
  }
];

export const TEMPLATES_KEY = (orgId: string) => `whatsapp_templates_${orgId}`;

export const loadWhatsAppTemplates = (orgId: string): WhatsAppTemplate[] => {
  try {
    const raw = localStorage.getItem(TEMPLATES_KEY(orgId));
    if (raw) return JSON.parse(raw) as WhatsAppTemplate[];
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

  const [activeTab, setActiveTab] = useState<'info' | 'prices' | 'whatsapp' | 'medications'>('info');

  const [branding, setBranding] = useState<ClinicBranding>(() =>
    loadClinicBranding(orgId, profile?.business_name)
  );

  const [procedures, setProcedures] = useState<Procedure[]>(() =>
    loadClinicProcedures(orgId)
  );

  const [medications, setMedications] = useState<Medication[]>(() =>
    loadClinicMedications(orgId)
  );

  const [newMedLabel, setNewMedLabel] = useState('');
  const [newMedText, setNewMedText] = useState('');

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
          .select('whatsapp_phone_number_id, whatsapp_access_token, name, address, phone, doctor_name, qualifications, email, logo_url' as any)
          .eq('id', organizationId)
          .single();

        if (error) throw error;
        if (data) {
          setWhatsapp((prev) => ({
            ...prev,
            phoneNumberId: data.whatsapp_phone_number_id || prev.phoneNumberId,
            accessToken: data.whatsapp_access_token || prev.accessToken,
          }));

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

        let status: 'Approved' | 'Pending' | 'Rejected' = 'Approved';
        const rawStatus = metaTpl.status?.toLowerCase();
        if (rawStatus === 'pending') status = 'Pending';
        else if (rawStatus === 'rejected') status = 'Rejected';

        const langCode = metaTpl.language?.split('_')[0] || 'en';

        return {
          name: metaTpl.name,
          language: langCode,
          status,
          body: bodyText
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
      </div>

      {activeTab === 'info' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* ── Left: Form ─────────────────────────────────────── */}
          <div className="space-y-4">
            {/* Clinic Identity */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                  <Building2 size={14} className="text-indigo-500" />
                </div>
                <h3 className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">Clinic Identity</h3>
              </div>

              <div className="space-y-3">
                {/* Clinic Logo Upload */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Clinic Logo
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {branding.logoUrl ? (
                        <img src={branding.logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
                      ) : (
                        <Building2 size={20} className="text-slate-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="cursor-pointer inline-flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-[11px] font-bold px-3 py-2 rounded-lg transition">
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
                          className="ml-2 text-[10px] text-red-500 hover:text-red-700 font-bold transition"
                        >
                          Remove
                        </button>
                      )}
                      <p className="text-[9px] text-slate-400 mt-1.5">PNG or JPG · Used on transformation templates & prescriptions</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Clinic Name
                  </label>
                  <input
                    type="text"
                    value={branding.clinicName}
                    onChange={(e) => handleChange('clinicName', e.target.value)}
                    placeholder="e.g. Sharma Dental Care"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Clinic Address
                  </label>
                  <textarea
                    value={branding.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="123, MG Road, Sector 5, New Delhi — 110001"
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Doctor Profile */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center">
                  <Stethoscope size={14} className="text-violet-500" />
                </div>
                <h3 className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">Doctor Profile</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Doctor Name
                  </label>
                  <input
                    type="text"
                    value={branding.doctorName}
                    onChange={(e) => handleChange('doctorName', e.target.value)}
                    placeholder="e.g. Dr. Priya Sharma"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Qualifications
                  </label>
                  <input
                    type="text"
                    value={branding.qualifications}
                    onChange={(e) => handleChange('qualifications', e.target.value)}
                    placeholder="e.g. BDS, MDS (Orthodontics)"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center">
                  <Phone size={14} className="text-sky-500" />
                </div>
                <h3 className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">Contact Details</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Phone
                  </label>
                  <div className="relative">
                    <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      value={branding.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Email <span className="text-slate-400 normal-case font-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={branding.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="clinic@example.com"
                      className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all"
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
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                <Stethoscope size={14} className="text-indigo-500" />
              </div>
              <h3 className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">Treatment Catalog & Pricing</h3>
            </div>
            <button
              type="button"
              onClick={handleRestoreDefaults}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
            >
              Reset to Defaults
            </button>
          </div>

          {/* Mobile view: list of cards */}
          <div className="block sm:hidden space-y-4">
            {procedures.map((proc, index) => (
              <div key={index} className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-3 relative">
                {/* Header with name and delete button */}
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={proc.name}
                    onChange={(e) => handleProcedureChange(index, 'name', e.target.value)}
                    placeholder="Procedure Name"
                    className="w-full bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 text-[13px] font-bold text-slate-800 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveProcedure(index)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Grid for other fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-1">
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Cost (₹)</label>
                    <input
                      type="number"
                      value={proc.defaultCost}
                      onChange={(e) => handleProcedureChange(index, 'defaultCost', Number(e.target.value))}
                      className="w-full bg-white px-1.5 py-1.5 rounded-lg border border-slate-200 text-[12px] text-slate-800 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all"
                    />
                  </div>

                  <div className="col-span-1">
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">GST</label>
                    <select
                      value={proc.gstRate}
                      onChange={(e) => handleProcedureChange(index, 'gstRate', Number(e.target.value))}
                      className="w-full bg-white px-1.5 py-1.5 rounded-lg border border-slate-200 text-[11.5px] text-slate-700 outline-none cursor-pointer"
                    >
                      <option value={0}>0%</option>
                      <option value={18}>18%</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop view: Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Treatment Name</th>
                  <th className="py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-44">Cost (₹)</th>
                  <th className="py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-36">GST</th>
                  <th className="py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-10 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {procedures.map((proc, index) => (
                  <tr key={index} className="group hover:bg-slate-50/50">
                    <td className="py-2 pl-1 pr-3">
                      <input
                        type="text"
                        value={proc.name}
                        onChange={(e) => handleProcedureChange(index, 'name', e.target.value)}
                        className="w-full bg-transparent px-2 py-1.5 rounded-lg border border-transparent hover:border-slate-200 focus:border-indigo-400 focus:bg-white text-[13px] text-slate-800 outline-none transition-all"
                      />
                    </td>
                    <td className="py-2 pr-3">
                      <input
                        type="number"
                        value={proc.defaultCost}
                        onChange={(e) => handleProcedureChange(index, 'defaultCost', Number(e.target.value))}
                        className="w-full bg-transparent px-2 py-1.5 rounded-lg border border-transparent hover:border-slate-200 focus:border-indigo-400 focus:bg-white text-[13px] text-slate-800 outline-none transition-all"
                      />
                    </td>
                    <td className="py-2 pr-3">
                      <select
                        value={proc.gstRate}
                        onChange={(e) => handleProcedureChange(index, 'gstRate', Number(e.target.value))}
                        className="w-full bg-transparent px-1.5 py-1.5 rounded-lg border border-transparent hover:border-slate-200 focus:border-indigo-400 focus:bg-white text-[12px] text-slate-700 outline-none cursor-pointer transition-all"
                      >
                        <option value={0}>0%</option>
                        <option value={18}>18%</option>
                      </select>
                    </td>
                    <td className="py-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveProcedure(index)}
                        className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
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
            className="w-full flex items-center justify-center gap-1.5 py-2.5 border border-dashed border-slate-300 hover:border-indigo-400 rounded-xl text-[12.5px] font-bold text-slate-500 hover:text-indigo-600 transition-all"
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
              <div className="space-y-3">
                {templates.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 text-xs">
                    No templates registered. Click "Create Template" or "Sync Meta API" to load.
                  </div>
                ) : (
                  templates.map((tpl, index) => (
                    <div key={index} className="border border-slate-100 rounded-xl p-3.5 space-y-2.5 hover:border-slate-200 transition-all bg-slate-50/50 relative group">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1 text-left">
                          <h4 className="text-[12px] font-mono font-bold text-slate-700 break-all">
                            {tpl.name}
                          </h4>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 text-[9.5px] text-slate-400 font-bold bg-white border border-slate-100 rounded-md px-1.5 py-0.5 uppercase">
                              <Globe size={9} /> {tpl.language}
                            </span>
                            <span className={`inline-flex items-center gap-0.5 text-[9.5px] font-bold rounded-md px-1.5 py-0.5 border ${
                              tpl.status === 'Approved'
                                ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                                : tpl.status === 'Pending'
                                ? 'bg-amber-50 border-amber-100 text-amber-700'
                                : 'bg-rose-50 border-rose-100 text-rose-700'
                            }`}>
                              {tpl.status}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveTemplate(index)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <div className="bg-white border border-slate-100 rounded-lg p-2.5 text-[11.5px] text-slate-600 font-medium leading-relaxed text-left">
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
      ) : (
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="md:col-span-1">
                  <label className="block text-[9.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Drug Label / Shortcut</label>
                  <input
                    type="text"
                    value={newMedLabel}
                    onChange={(e) => setNewMedLabel(e.target.value)}
                    placeholder="e.g. Paracetamol 650mg"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-700 font-medium shadow-sm transition-all"
                  />
                </div>
                <div className="md:col-span-2 flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="block text-[9.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Rx Instruction</label>
                    <input
                      type="text"
                      value={newMedText}
                      onChange={(e) => setNewMedText(e.target.value)}
                      placeholder="e.g. • Tab. Paracetamol 650mg - 1 tab SOS for pain"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-700 font-medium shadow-sm transition-all"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!newMedLabel.trim() || !newMedText.trim()) {
                        toast.error("Please fill in both the label and instruction details.");
                        return;
                      }
                      const newItem: Medication = {
                        id: Date.now().toString(),
                        label: newMedLabel.trim(),
                        text: newMedText.trim()
                      };
                      setMedications(prev => [...prev, newItem]);
                      setNewMedLabel('');
                      setNewMedText('');
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {medications.length === 0 ? (
                <p className="col-span-full text-center py-12 text-xs text-slate-400 font-medium bg-slate-50/20 border border-dashed border-slate-200 rounded-xl">
                  No medications configured. Click 'Reset to Defaults' or add custom ones above.
                </p>
              ) : (
                medications.map((med) => (
                  <div 
                    key={med.id} 
                    className="group border border-slate-100 hover:border-slate-200 bg-white rounded-xl p-4 flex flex-col justify-between gap-3 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="min-w-0">
                      <span className="inline-block text-[10px] font-bold text-indigo-700 bg-indigo-50/80 border border-indigo-100 rounded-lg px-2.5 py-0.8 select-none tracking-wide">
                        {med.label}
                      </span>
                      <p className="text-[11.5px] text-slate-600 font-medium mt-2 leading-relaxed break-words pl-0.5">
                        {med.text}
                      </p>
                    </div>
                    <div className="flex justify-end pt-1 border-t border-slate-50">
                      <button
                        type="button"
                        onClick={() => {
                          setMedications(prev => prev.filter(m => m.id !== med.id));
                          setSaved(false);
                          toast.success("Medication preset deleted locally. Save to confirm.");
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 active:scale-95 transition-all opacity-85 group-hover:opacity-100"
                      >
                        <Trash2 size={14} />
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
      )}
    </motion.div>
  );
};

export default ReactivationClinicSettings;
