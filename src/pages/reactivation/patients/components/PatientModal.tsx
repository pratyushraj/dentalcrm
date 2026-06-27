import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useDealAlertNotifications } from '@/hooks/useDealAlertNotifications';
import { jsPDF } from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Plus,
  Trash2,
  Sparkles,
  UserCheck,
  UserMinus,
  Crown,
  X,
  Send,
  RefreshCw,
  Phone,
  Calendar,
  Stethoscope,
  StickyNote,
  CheckSquare,
  Square,
  Zap,
  Mic,
  Volume2,
  Settings,
  Camera,
  Download,
  Eye,
  Check,
  RotateCcw,
  MoreVertical,
  FileText,
  User,
  Clock,
  ChevronDown,
  Save
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useSession } from '@/contexts/SessionContext';
import { supabase } from '@/lib/supabase';
import { refineTranscriptWithLLM } from '@/lib/ai/gemini';
import { loadClinicProcedures, Procedure, loadWhatsAppTemplates } from '../../ReactivationClinicSettings';
import { logWhatsAppMessage } from '@/utils/whatsappLogger';
import { Customer, CustomerStatus } from '../types';
import { getInitialForm, getToothName, getShortToothLabel, getNextVisitDate } from '../helpers';
import { generateSmileGalleryImage, getProxyUrl, addSmileGalleryToPDF } from '../smileGalleryHelper';
import { CARE_PROGRAMS } from '../carePrograms';
import { AVATAR_COLORS, STATUS_OPTIONS } from '../constants';

// Custom interfaces needed for modal
interface CustomerModalProps {
  open: boolean;
  onClose: () => void;
  customer?: Customer;
  onSave: (c: Customer, isAutosave?: boolean) => void;
}

const CustomerModal: React.FC<CustomerModalProps> = ({ open, onClose, customer, onSave }) => {
  const { profile } = useSession();
  const {
    isSupported: isPushSupported,
    isSubscribed: isPushSubscribed,
    isBusy: isPushBusy,
    enableNotifications: enablePushNotifications
  } = useDealAlertNotifications();
  const isEdit = !!customer?.id;
  const [form, setForm] = useState<Customer>(() => getInitialForm(customer));
  const [activeTab, setActiveTab] = useState<'general' | 'medical' | 'estimates'>('general');
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [showVoiceSettingsModal, setShowVoiceSettingsModal] = useState(false);
  const [selectedRxCategory, setSelectedRxCategory] = useState<string>('All');
  const [selectedRxDays, setSelectedRxDays] = useState<string>('');
  const [selectedRxFrequency, setSelectedRxFrequency] = useState<string>('');
  const [medicationsList, setMedicationsList] = useState<any[]>([]);
  const [searchRxQuery, setSearchRxQuery] = useState<string>('');
  const [isEditingRawPrescription, setIsEditingRawPrescription] = useState<boolean>(false);
  const [rxCollapseDetails, setRxCollapseDetails] = useState<boolean>(false);

  // Clinic branding (loaded from localStorage, used for PDF generation)
  const { organizationId } = useSession();
  const _orgId = organizationId || 'default';
  const proceduresCatalog = useMemo(() => loadClinicProcedures(_orgId), [_orgId]);
  const [clinicBranding, setClinicBranding] = useState(() => {
    try {
      const raw = localStorage.getItem(`clinic_branding_${_orgId}`);
      if (raw) return JSON.parse(raw);
    } catch {}
    return {
      clinicName: profile?.business_name || 'Dental Clinic',
      doctorName: '',
      qualifications: '',
      address: '',
      phone: '',
      email: '',
    };
  });

  const migrateMedications = (meds: any[]): any[] => {
    const defaultMeds = [
      { label: 'Amoxicillin 500mg', text: '• Tab. Amoxicillin 500mg - 1 cap thrice daily for 5 days', category: 'Antibiotics', price: 120 },
      { label: 'Paracetamol 650mg', text: '• Tab. Paracetamol 650mg - 1 tab SOS for pain', category: 'Pain killers', price: 40 },
      { label: 'Zerodol-SP', text: '• Tab. Zerodol-SP - 1 tab twice daily for 3 days', category: 'Pain killers', price: 80 },
      { label: 'Pantocid 40mg', text: '• Tab. Pantocid 40mg - 1 tab once daily before food', category: 'Gas/Acidity', price: 50 },
      { label: 'Hexidine Mouthwash', text: '• Hexidine Mouthwash - rinse twice daily for 7 days', category: 'Mouthwash', price: 110 },
      { label: 'Mox-CL 625mg', text: '• Tab. Mox-CL 625mg - 1 tab twice daily for 5 days', category: 'Antibiotics', price: 140 },
      { label: 'Ketorol-DT', text: '• Tab. Ketorol-DT - 1 tab dissolved in water SOS', category: 'Pain killers', price: 60 },
      { label: 'Sensodyne Toothpaste', text: '• Sensodyne Toothpaste - brush twice daily for sensitive teeth', category: 'Toothpaste', price: 95 },
      { label: 'Metrogyl ER', text: '• Tab. Metrogyl ER - 1 tab twice daily for 5 days', category: 'Antibiotics', price: 75 },
      { label: 'Flagyl ER', text: '• Tab. Flagyl ER - 1 tab twice daily for 5 days', category: 'Antibiotics', price: 65 },
      { label: 'Augmentin 625mg', text: '• Tab. Augmentin 625mg - 1 tab twice daily for 5 days', category: 'Antibiotics', price: 180 },
      { label: 'Clavam 625mg', text: '• Tab. Clavam 625mg - 1 tab twice daily for 5 days', category: 'Antibiotics', price: 160 },
      { label: 'Indclav 625mg', text: '• Tab. Indclav 625mg - 1 tab twice daily for 5 days', category: 'Antibiotics', price: 155 },
      { label: 'Mox CV 625mg', text: '• Tab. Mox CV 625mg - 1 tab twice daily for 5 days', category: 'Antibiotics', price: 145 },
      { label: 'Zocef CV 250mg', text: '• Tab. Zocef CV 250mg - 1 tab twice daily for 5 days', category: 'Antibiotics', price: 210 },
      { label: 'Sporidex CV 200mg', text: '• Tab. Sporidex CV 200mg - 1 tab twice daily for 5 days', category: 'Antibiotics', price: 190 },
      { label: 'Zymoflam D', text: '• Tab. Zymoflam D - 1 tab twice daily for 5 days', category: 'Pain killers', price: 90 },
      { label: 'Intagesic', text: '• Tab. Intagesic - 1 tab twice daily for 5 days', category: 'Pain killers', price: 55 },
      { label: 'Lysoflam', text: '• Tab. Lysoflam - 1 tab twice daily for 5 days', category: 'Pain killers', price: 85 },
      { label: 'Gudgesic SP', text: '• Tab. Gudgesic SP - 1 tab twice daily for 5 days', category: 'Pain killers', price: 70 },
      { label: 'Enzoflam', text: '• Tab. Enzoflam - 1 tab twice daily for 5 days', category: 'Pain killers', price: 95 },
      { label: 'Clohex ADS M/W', text: '• Clohex ADS Mouthwash - rinse twice daily for 7 days', category: 'Mouthwash', price: 120 },
      { label: 'Vantej Aqua M/W', text: '• Vantej Aqua Mouthwash - rinse twice daily for 7 days', category: 'Mouthwash', price: 130 },
      { label: 'Hydent 360 M/W', text: '• Hydent 360 Mouthwash - rinse twice daily for 7 days', category: 'Mouthwash', price: 140 },
      { label: 'Coolora M/W', text: '• Coolora Mouthwash - rinse twice daily for 7 days', category: 'Mouthwash', price: 90 },
      { label: 'Corahex M/W', text: '• Corahex Mouthwash - rinse twice daily for 7 days', category: 'Mouthwash', price: 105 },
      { label: 'Paloxide M/W', text: '• Paloxide Mouthwash - rinse twice daily for 7 days', category: 'Mouthwash', price: 115 },
      { label: 'Xyon-C M/W', text: '• Xyon-C Mouthwash - rinse twice daily for 7 days', category: 'Mouthwash', price: 125 },
      { label: 'Gumex Gum Paint', text: '• Gumex Gum Paint - apply on gums thrice daily', category: 'Mouthwash', price: 80 },
      { label: 'Logum Gel', text: '• Logum Gel - apply on painful ulcers/areas 10 minutes before food', category: 'Gels', price: 70 },
      { label: 'Metrogyl DG Gel', text: '• Metrogyl DG Gel - massage gently on gums twice daily after brushing', category: 'Gels', price: 85 },
      { label: 'Turbocoat Gel', text: '• Turbocoat Gel - apply on sensitive areas once daily after brushing', category: 'Gels', price: 110 },
      { label: 'Vantej Toothpaste', text: '• Vantej Toothpaste - brush twice daily', category: 'Toothpaste', price: 130 },
      { label: 'Reguard Toothpaste', text: '• Reguard Toothpaste - brush twice daily', category: 'Toothpaste', price: 90 },
      { label: 'Perioguard Toothpaste', text: '• Perioguard Toothpaste - brush twice daily', category: 'Toothpaste', price: 100 },
      { label: 'Hydent K Toothpaste', text: '• Hydent K Toothpaste - brush twice daily', category: 'Toothpaste', price: 115 },
      { label: 'Glister Toothpaste', text: '• Glister Toothpaste - brush twice daily', category: 'Toothpaste', price: 140 },
      { label: 'Snowdent Toothpaste', text: '• Snowdent Toothpaste - brush twice daily', category: 'Toothpaste', price: 85 },
      { label: 'Remin Toothpaste', text: '• Remin Toothpaste - brush twice daily', category: 'Toothpaste', price: 120 },
      { label: 'Toothmin Toothpaste', text: '• Toothmin Toothpaste - brush twice daily', category: 'Toothpaste', price: 125 },
      { label: 'Enzoflam CT', text: '• Tab. Enzoflam CT - 1 tab twice daily for 5 days', category: 'Pain killers', price: 100 },
      { label: 'Rantac RD', text: '• Tab. Rantac RD - 1 tab twice daily before food', category: 'Gas/Acidity', price: 45 },
      { label: 'Ranidom-DOM', text: '• Tab. Ranidom-DOM - 1 tab twice daily before food', category: 'Gas/Acidity', price: 55 },
      { label: 'Pan-40', text: '• Tab. Pan-40 - 1 tab once daily before food', category: 'Gas/Acidity', price: 65 },
      { label: 'Cyra-D', text: '• Tab. Cyra-D - 1 tab once daily before food', category: 'Gas/Acidity', price: 60 },
      { label: 'Rabeprazole 20mg', text: '• Tab. Rabeprazole 20mg - 1 tab once daily before food', category: 'Gas/Acidity', price: 50 },
      { label: 'Lycowonder', text: '• Tab. Lycowonder - 1 tab once daily', category: 'Multivitamins', price: 140 },
      { label: 'Lycowonder Forte', text: '• Tab. Lycowonder Forte - 1 tab once daily', category: 'Multivitamins', price: 160 },
      { label: 'Fibrowonder Multi Tab', text: '• Tab. Fibrowonder Multi Tab - 1 tab once daily', category: 'Multivitamins', price: 150 },
      { label: 'Gurodol Mouthwash', text: '• Gurodol Mouthwash - rinse twice daily', category: 'Mouthwash', price: 95 },
      { label: 'Rinse Off Mouthwash', text: '• Rinse Off Mouthwash - rinse twice daily', category: 'Mouthwash', price: 85 },
      { label: 'Rexidin SRS Mouthwash', text: '• Rexidin SRS Mouthwash - rinse twice daily', category: 'Mouthwash', price: 135 },
      { label: 'Keebiotic Tab', text: '• Tab. Keebiotic - 1 tab twice daily for 5 days', category: 'Antibiotics', price: 125 },
      { label: 'Rexidine Mouthwash', text: '• Rexidine Mouthwash - rinse twice daily', category: 'Mouthwash', price: 110 },
      { label: 'Gumsun Gum Paint', text: '• Gumsun Gum Paint - apply on gums thrice daily', category: 'Gels', price: 75 },
      { label: 'Paradontox Toothpaste', text: '• Paradontox Toothpaste - brush twice daily', category: 'Toothpaste', price: 150 },
      { label: 'Zyclav 375mg', text: '• Tab. Zyclav 375mg - 1 tab twice daily for 5 days', category: 'Antibiotics', price: 135 }
    ];

    return meds.map(med => {
      const matched = defaultMeds.find(dm => dm.label.toLowerCase() === med.label.toLowerCase());
      
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

  React.useEffect(() => {
    if (!_orgId || _orgId === 'default') return;
    async function loadMeds() {
      try {
        const { data, error } = await supabase
          .from('reactivation_audit_logs')
          .select('details')
          .eq('organization_id', _orgId)
          .eq('action', 'clinic_medications')
          .order('created_at', { ascending: false })
          .limit(1);

        if (!error && data && data.length > 0) {
          const loadedMeds = data[0].details?.medications;
          if (Array.isArray(loadedMeds) && loadedMeds.length > 0) {
            const migrated = migrateMedications(loadedMeds);
            setMedicationsList(migrated);
            localStorage.setItem(`clinic_medications_${_orgId}`, JSON.stringify(migrated));
            return;
          }
        }
      } catch (e) {
        console.error(e);
      }
      
      try {
        const raw = localStorage.getItem(`clinic_medications_${_orgId}`);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMedicationsList(migrateMedications(parsed));
          }
        }
      } catch (e) {}
    }
    loadMeds();
  }, [_orgId]);

  React.useEffect(() => {
    if (!_orgId || _orgId === 'default') return;
    async function loadClinicBranding() {
      try {
        const { data: clinic } = await supabase
          .from('dental_clinics')
          .select('*')
          .eq('id', _orgId)
          .single();

        if (clinic) {
          let doctorName = '';
          let doctorEmail = '';
          if (clinic.owner_id) {
            const { data: ownerProfile } = await supabase
              .from('profiles')
              .select('first_name, last_name')
              .eq('id', clinic.owner_id)
              .single();
            if (ownerProfile) {
              const firstName = (ownerProfile as any).first_name || '';
              const lastName = (ownerProfile as any).last_name || '';
              doctorName = `${firstName} ${lastName}`.trim();
            }
          }

          setClinicBranding({
            clinicName: clinic.name || 'Dental Clinic',
            doctorName: clinic.doctor_name || doctorName || 'Doctor',
            qualifications: clinic.qualifications || clinic.timings_note || 'B.D.S., M.D.S. | Dental Specialist',
            address: clinic.address || '',
            phone: clinic.phone || '',
            email: clinic.email || doctorEmail || '',
            logoUrl: clinic.logo_url || '',
          });
        }
      } catch (err) {
        console.error('Error fetching clinic details for PDF:', err);
      }
    }
    loadClinicBranding();
  }, [_orgId]);

  // AI Scribe states
  const [activeFieldRecording, setActiveFieldRecording] = useState<'teeth' | 'prescription' | null>(null);
  const [isTranscribing, setIsTranscribing] = useState<'teeth' | 'prescription' | null>(null);
  const [notesTranscribing, setNotesTranscribing] = useState(false);
  const [notesRecording, setNotesRecording] = useState(false);
  const recognitionRef = React.useRef<any>(null);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);
  const initialNotesRef = React.useRef<string>('');
  const sessionTranscriptRef = React.useRef<string>('');

  const [showAdvancedClinical, setShowAdvancedClinical] = useState(false);
  const [deepgramKey, setDeepgramKey] = useState(() => localStorage.getItem('deepgram_api_key') || import.meta.env.VITE_DEEPGRAM_API_KEY || '');
  const [recordingMode, setRecordingMode] = useState<'native' | 'deepgram'>('native');

  // RVG slider state
  const [xraySliderPos, setXraySliderPos] = useState(50);
  const [activeQuadrant, setActiveQuadrant] = useState<'all' | 'UR' | 'UL' | 'LL' | 'LR'>('all');

  // Estimate builder states
  const [estimateItems, setEstimateItems] = useState<Array<{ tooth?: number; procedure: string; cost: number; isCosmetic: boolean }>>([]);
  const [estimateDiscount, setEstimateDiscount] = useState(0);
  const [estimateStatus, setEstimateStatus] = useState<'Draft' | 'Sent' | 'Approved'>('Draft');
  
  // Selected builder item
  const [builderTooth, setBuilderTooth] = useState<string>('');
  const [builderProcedureIdx, setBuilderProcedureIdx] = useState<string>('0');
  const [builderCost, setBuilderCost] = useState<number>(() => {
    return proceduresCatalog.length > 0 ? proceduresCatalog[0].defaultCost : 3500;
  });
  const [copiedEstimate, setCopiedEstimate] = useState(false);
  const lastCustomerIdRef = React.useRef<string | undefined>(undefined);
  const wasOpenRef = React.useRef<boolean>(false);

  React.useEffect(() => {
    setForm(getInitialForm(customer));
    
    const didOpenFresh = open && !wasOpenRef.current;
    wasOpenRef.current = open;

    if (customer?.id !== lastCustomerIdRef.current || didOpenFresh) {
      setActiveTab('general');
      setShowAdvancedClinical(false);
      setCopiedEstimate(false);
      setActiveQuadrant('all');
      
      if (proceduresCatalog.length > 0) {
        setBuilderProcedureIdx('0');
        setBuilderCost(proceduresCatalog[0].defaultCost);
      }
      lastCustomerIdRef.current = customer?.id;
    }
    
    if (customer?.estimates && customer.estimates.length > 0) {
      const activeEst = customer.estimates[0];
      const itemsMapped = (activeEst.items || []).map((it: any) => ({
        tooth: it.tooth,
        procedure: it.procedure || it.name || '',
        cost: Number(it.cost !== undefined ? it.cost : (it.price !== undefined ? it.price : 0)),
        isCosmetic: !!(it.isCosmetic || it.category === 'Cosmetic')
      }));
      setEstimateItems(itemsMapped);
      setEstimateDiscount(activeEst.discount || 0);
      setEstimateStatus(activeEst.status || 'Draft');
    } else {
      setEstimateItems([]);
      setEstimateDiscount(0);
      setEstimateStatus('Draft');
    }
  }, [customer, open]);

  // Sync Rx Medicines to Billing estimateItems
  const syncRxMedicinesToBilling = useCallback((showToastOnNoNew = false) => {
    const rxText = form.prescription || '';
    if (!rxText.trim()) {
      if (showToastOnNoNew) {
        toast.info("No prescription text found to sync medicines from.");
      }
      return;
    }

    const allMeds = medicationsList.length > 0 ? medicationsList : migrateMedications([]);
    const lines = rxText.split('\n').map(l => l.trim()).filter(Boolean);

    setEstimateItems(prev => {
      const newItems: typeof estimateItems = [];
      lines.forEach(line => {
        const matchedMed = allMeds.find(med => 
          line.toLowerCase().includes(med.label.toLowerCase())
        );

        if (matchedMed && matchedMed.price > 0) {
          const procedureName = `[${matchedMed.label}] (Medicine)`;
          const alreadyExists = prev.some(item => item.procedure === procedureName) ||
                                newItems.some(item => item.procedure === procedureName);

          if (!alreadyExists) {
            newItems.push({
              procedure: procedureName,
              cost: matchedMed.price,
              isCosmetic: false
            });
          }
        }
      });

      if (newItems.length > 0) {
        toast.success(`Synced ${newItems.length} medicine(s) from prescription to billing.`);
        return [...prev, ...newItems];
      } else {
        if (showToastOnNoNew) {
          toast.info("All medicines in the prescription are already in the billing list.");
        }
        return prev;
      }
    });
  }, [form.prescription, medicationsList]);

  useEffect(() => {
    if (activeTab === 'estimates') {
      syncRxMedicinesToBilling(false);
    }
  }, [activeTab, syncRxMedicinesToBilling]);

  // Calculation Hooks
  const calculatedSubtotal = useMemo(() => {
    return estimateItems.reduce((sum, item) => sum + item.cost, 0);
  }, [estimateItems]);

  const calculatedDiscountAmount = useMemo(() => {
    return Math.round((calculatedSubtotal * estimateDiscount) / 100);
  }, [calculatedSubtotal, estimateDiscount]);

  const calculatedGST = useMemo(() => {
    return estimateItems.reduce((taxSum, item) => {
      if (!item.isCosmetic) return taxSum;
      const discountedItemCost = item.cost - (item.cost * estimateDiscount) / 100;
      return taxSum + Math.round(discountedItemCost - (discountedItemCost / 1.18));
    }, 0);
  }, [estimateItems, estimateDiscount]);

  const calculatedGrandTotal = useMemo(() => {
    return calculatedSubtotal - calculatedDiscountAmount;
  }, [calculatedSubtotal, calculatedDiscountAmount]);

  // Debounced Autosave Logic with Dirty checking
  const [syncStatus, setSyncStatus] = useState<'saved' | 'saving' | 'dirty' | null>(null);
  
  const initialFormRef = React.useRef<Customer | null>(null);
  const initialEstimateItemsRef = React.useRef<any[]>([]);
  const initialDiscountRef = React.useRef<number>(0);
  const initialStatusRef = React.useRef<string>('Draft');
  
  const lastInitializedIdRef = React.useRef<string | undefined>(undefined);
  const wasOpenAutosaveRef = React.useRef<boolean>(false);

  React.useEffect(() => {
    if (!open) {
      wasOpenAutosaveRef.current = false;
      return;
    }

    const isNewOpen = !wasOpenAutosaveRef.current;
    const isDifferentCustomer = customer?.id !== lastInitializedIdRef.current;

    if (isNewOpen || isDifferentCustomer) {
      wasOpenAutosaveRef.current = true;
      lastInitializedIdRef.current = customer?.id;

      const initForm = getInitialForm(customer);
      setForm(initForm);
      initialFormRef.current = initForm;

      setActiveTab('general');
      setShowAdvancedClinical(false);
      setCopiedEstimate(false);
      setActiveQuadrant('all');
      
      if (proceduresCatalog.length > 0) {
        setBuilderProcedureIdx('0');
        setBuilderCost(proceduresCatalog[0].defaultCost);
      }
      
      let itemsMapped: any[] = [];
      let discount = 0;
      let status: 'Draft' | 'Sent' | 'Approved' = 'Draft';

      if (customer?.estimates && customer.estimates.length > 0) {
        const activeEst = customer.estimates[0];
        itemsMapped = (activeEst.items || []).map((it: any) => ({
          tooth: it.tooth,
          procedure: it.procedure || it.name || '',
          cost: Number(it.cost !== undefined ? it.cost : (it.price !== undefined ? it.price : 0)),
          isCosmetic: !!(it.isCosmetic || it.category === 'Cosmetic')
        }));
        discount = activeEst.discount || 0;
        status = activeEst.status || 'Draft';
      }
      
      setEstimateItems(itemsMapped);
      initialEstimateItemsRef.current = itemsMapped;
      
      setEstimateDiscount(discount);
      initialDiscountRef.current = discount;
      
      setEstimateStatus(status);
      initialStatusRef.current = status;
      
      setSyncStatus(null);
    }
  }, [customer, open]);

  React.useEffect(() => {
    if (!form.name || !form.phone) return;

    // Check if anything actually changed from loaded defaults
    const hasFormChanged = initialFormRef.current ? JSON.stringify(form) !== JSON.stringify(initialFormRef.current) : false;
    const hasItemsChanged = JSON.stringify(estimateItems) !== JSON.stringify(initialEstimateItemsRef.current);
    const hasDiscountChanged = estimateDiscount !== initialDiscountRef.current;
    const hasStatusChanged = estimateStatus !== initialStatusRef.current;

    if (!hasFormChanged && !hasItemsChanged && !hasDiscountChanged && !hasStatusChanged) {
      return;
    }

    setSyncStatus('dirty');
    
    const timer = setTimeout(() => {
      setSyncStatus('saving');
      
      // Auto-update status to 'Active' if prescription or estimates are added/modified during this session
      let finalForm = { ...form };
      const initialPrescription = initialFormRef.current?.prescription || '';
      const currentPrescription = form.prescription || '';
      const isPrescriptionAdded = currentPrescription.trim() !== '' && currentPrescription !== initialPrescription;
      const isEstimatesAddedOrModified = estimateItems.length > 0 && hasItemsChanged;

      if ((isPrescriptionAdded || isEstimatesAddedOrModified) && form.status !== 'Active') {
        finalForm.status = 'Active';
        setForm(prev => ({ ...prev, status: 'Active' }));
      }
      
      const estimateObj = {
        id: customer?.estimates?.[0]?.id || `est_${Date.now()}`,
        date: customer?.estimates?.[0]?.date || new Date().toISOString().split('T')[0],
        items: estimateItems,
        discount: estimateDiscount,
        tax: calculatedGST,
        grandTotal: calculatedGrandTotal,
        status: estimateStatus
      };

      const newCustomer: Customer = {
        ...finalForm,
        id: finalForm.id || '',
        avatarColor: finalForm.avatarColor || AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
        problemTeeth: finalForm.problemTeeth || [],
        xrays: finalForm.xrays || [],
        allergies: finalForm.allergies || [],
        medicalConditions: finalForm.medicalConditions || [],
        toothNotes: finalForm.toothNotes || {},
        toothConditions: finalForm.toothConditions || {},
        vitals: finalForm.vitals || { bp: '', pulse: '', temp: '' },
        estimates: estimateItems.length > 0 ? [estimateObj] : (finalForm.estimates || []),
      };

      // Update the current initial refs so that we don't trigger save again for the same state
      initialFormRef.current = finalForm;
      initialEstimateItemsRef.current = estimateItems;
      initialDiscountRef.current = estimateDiscount;
      initialStatusRef.current = estimateStatus;

      onSave(newCustomer, true);
      setSyncStatus('saved');
    }, 1500);

    return () => clearTimeout(timer);
  }, [form, estimateItems, estimateDiscount, estimateStatus, calculatedGST, calculatedGrandTotal]);

  const toggleNotesVoice = async () => {
    if (notesRecording) {
      if (recordingMode === 'deepgram') {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
        }
      } else {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      }
      setNotesRecording(false);
      return;
    }

    if (recordingMode === 'deepgram') {
      if (!deepgramKey) {
        alert("Please enter your Deepgram API Key first using the settings icon under After Consultation tab.");
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setNotesRecording(true);
        
        audioChunksRef.current = [];
        const mimeOptions = MediaRecorder.isTypeSupported('audio/webm')
          ? { mimeType: 'audio/webm' }
          : MediaRecorder.isTypeSupported('audio/mp4')
            ? { mimeType: 'audio/mp4' }
            : undefined;
        const mediaRecorder = new MediaRecorder(stream, mimeOptions);
        mediaRecorderRef.current = mediaRecorder;
        
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };
        
        mediaRecorder.onstop = async () => {
          setNotesRecording(false);
          setNotesTranscribing(true);
          try {
            const mimeType = mediaRecorder.mimeType || 'audio/webm';
            const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
            const response = await fetch('https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&language=en-IN&filler_words=true', {
              method: 'POST',
              headers: {
                'Authorization': `Token ${deepgramKey}`,
                'Content-Type': mimeType
              },
              body: audioBlob
            });
            
            if (!response.ok) {
              throw new Error(`Deepgram API returned status ${response.status}`);
            }
            
            const result = await response.json();
            const transcript = result.results?.channels?.[0]?.alternatives?.[0]?.transcript || '';
            if (transcript) {
              const refined = await refineTranscriptWithLLM(transcript, 'notes');
              handleChange('notes', (form.notes ? form.notes + ' ' : '') + refined);
            }
          } catch (err: any) {
            console.error('Deepgram transcription error:', err);
            alert(`Deepgram Transcription Error: ${err.message}`);
          } finally {
            setNotesTranscribing(false);
          }
          
          stream.getTracks().forEach(track => track.stop());
        };
        
        mediaRecorder.start(250);
      } catch (err: any) {
        console.error('Failed to start media recorder:', err);
        alert('Could not access microphone: ' + err.message);
      }
    } else {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Speech recognition is not supported in this browser. Please use Chrome.");
        return;
      }

      initialNotesRef.current = form.notes || '';
      sessionTranscriptRef.current = '';
      setNotesRecording(true);
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-IN';

      rec.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          }
        }
        if (finalTranscript) {
          sessionTranscriptRef.current = sessionTranscriptRef.current + finalTranscript;
          handleChange('notes', (initialNotesRef.current ? initialNotesRef.current + ' ' : '') + sessionTranscriptRef.current);
        }
      };

      rec.onerror = (err: any) => {
        console.error('Notes Speech Error:', err);
        setNotesRecording(false);
      };

      rec.onend = async () => {
        setNotesRecording(false);
        if (sessionTranscriptRef.current.trim()) {
          setNotesTranscribing(true);
          try {
            const refined = await refineTranscriptWithLLM(sessionTranscriptRef.current, 'notes');
            handleChange('notes', (initialNotesRef.current ? initialNotesRef.current + ' ' : '') + refined);
          } catch (err) {
            console.error('Failed to refine notes transcript:', err);
          } finally {
            setNotesTranscribing(false);
          }
        }
      };

      recognitionRef.current = rec;
      rec.start();
    }
  };

  const toggleFieldScribe = async (target: 'teeth' | 'prescription') => {
    if (activeFieldRecording === target) {
      if (recordingMode === 'deepgram') {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
        }
      } else {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      }
      setActiveFieldRecording(null);
      return;
    }

    if (activeFieldRecording) {
      if (recordingMode === 'deepgram') {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
        }
      } else {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      }
    }

    if (recordingMode === 'deepgram') {
      if (!deepgramKey) {
        alert("Please enter your Deepgram API Key first in the voice settings at the bottom.");
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setActiveFieldRecording(target);
        
        const mimeOptions = MediaRecorder.isTypeSupported('audio/webm')
          ? { mimeType: 'audio/webm' }
          : MediaRecorder.isTypeSupported('audio/mp4')
            ? { mimeType: 'audio/mp4' }
            : undefined;
        const mediaRecorder = new MediaRecorder(stream, mimeOptions);
        mediaRecorderRef.current = mediaRecorder;
        
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };
        
        mediaRecorder.onstop = async () => {
          setActiveFieldRecording(null);
          setIsTranscribing(target);
          try {
            const mimeType = mediaRecorder.mimeType || 'audio/webm';
            const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
            const response = await fetch('https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&language=en-IN&filler_words=true', {
              method: 'POST',
              headers: {
                'Authorization': `Token ${deepgramKey}`,
                'Content-Type': mimeType
              },
              body: audioBlob
            });
            
            if (!response.ok) {
              throw new Error(`Deepgram API returned status ${response.status}`);
            }
            
            const result = await response.json();
            const transcript = result.results?.channels?.[0]?.alternatives?.[0]?.transcript || '';
            if (transcript) {
              const refined = await refineTranscriptWithLLM(transcript, target);
              parseScribeTranscript(refined, target);
            }
          } catch (err: any) {
            console.error('Deepgram transcription error:', err);
            alert(`Deepgram Transcription Error: ${err.message}`);
          } finally {
            setIsTranscribing(null);
          }
          
          stream.getTracks().forEach(track => track.stop());
        };
        
        mediaRecorder.start(250);
      } catch (err: any) {
        console.error('Failed to start media recorder:', err);
        alert('Could not access microphone: ' + err.message);
      }
    } else {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Speech recognition is not supported in this browser. Please use Chrome.");
        return;
      }

      setActiveFieldRecording(target);
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-IN';

      rec.onresult = async (event: any) => {
        const resultText = event.results[0][0].transcript;
        if (resultText) {
          setIsTranscribing(target);
          try {
            const refined = await refineTranscriptWithLLM(resultText, target);
            parseScribeTranscript(refined, target);
          } catch (err) {
            console.error('Failed to refine field transcript:', err);
            parseScribeTranscript(resultText, target);
          } finally {
            setIsTranscribing(null);
          }
        }
      };

      rec.onerror = (err: any) => {
        console.error('Scribe Speech Error:', err);
        setActiveFieldRecording(null);
      };

      rec.onend = () => {
        setActiveFieldRecording(null);
      };

      recognitionRef.current = rec;
      rec.start();
    }
  };

  const preprocessHinglishTranscript = (text: string): string => {
    let cleaned = text.toLowerCase();
    
    // Replace "meinr ct", "mein r ct", "r ct" with "rct"
    cleaned = cleaned.replace(/\b(?:meinr|mein\s*r|r)\s*ct\b/g, 'rct');
    // Replace "pan number meinr" with "46"
    cleaned = cleaned.replace(/\b(?:pan|pain|pen|form|for|potty|farty)\s*(?:number\s*)?meinr\b/g, '46');
    // Replace "ct scan" with "rct"
    cleaned = cleaned.replace(/\bct\s*scan\b/g, 'rct');
    
    // Map words for numbers
    const wordToNum: Record<string, string> = {
      'one': '1', 'two': '2', 'three': '3', 'four': '4', 'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9'
    };
    
    Object.entries(wordToNum).forEach(([word, num]) => {
      // Forty / Pan / Pain / Pen / Form / For / Potty / Farty
      const fortyRegex = new RegExp(`\\b(forty|farty|potty|pan|pain|pen|form|for)\\s*(?:number\s*)?${word}\\b`, 'g');
      cleaned = cleaned.replace(fortyRegex, `4${num}`);
      
      // Thirty / Tarty / Dirty / Taty
      const thirtyRegex = new RegExp(`\\b(thirty|tarty|dirty|taty)\\s*(?:number\s*)?${word}\\b`, 'g');
      cleaned = cleaned.replace(thirtyRegex, `3${num}`);
      
      // Twenty / Tenty / Twenti
      const twentyRegex = new RegExp(`\\b(twenty|tenty|twenti)\\s*(?:number\s*)?${word}\\b`, 'g');
      cleaned = cleaned.replace(twentyRegex, `2${num}`);
      
      // Teen / Ten / One / On
      const teenRegex = new RegExp(`\\b(teen|ten|one|on)\\s*(?:number\s*)?${word}\\b`, 'g');
      cleaned = cleaned.replace(teenRegex, `1${num}`);
    });

    // Numeric replacements
    const prefixes = ['forty', 'farty', 'potty', 'pan', 'pain', 'pen', 'form', 'for'];
    prefixes.forEach((pref) => {
      cleaned = cleaned.replace(new RegExp(`\\b${pref}\\s*(?:number\s*)?([1-8])\\b`, 'g'), '4$1');
    });
    
    ['thirty', 'tarty', 'dirty', 'taty'].forEach((pref) => {
      cleaned = cleaned.replace(new RegExp(`\\b${pref}\\s*(?:number\s*)?([1-8])\\b`, 'g'), '3$1');
    });

    ['twenty', 'tenty', 'twenti'].forEach((pref) => {
      cleaned = cleaned.replace(new RegExp(`\\b${pref}\\s*(?:number\s*)?([1-8])\\b`, 'g'), '2$1');
    });

    ['teen', 'ten', 'one', 'on'].forEach((pref) => {
      cleaned = cleaned.replace(new RegExp(`\\b${pref}\\s*(?:number\s*)?([1-8])\\b`, 'g'), '1$1');
    });

    // Fallback: if there is still "pan number" or "pain number" but no tooth digits, replace with "46"
    if (cleaned.includes('pan number') || cleaned.includes('pain number') || cleaned.includes('pen number')) {
      if (!cleaned.match(/\b(11|12|13|14|15|16|17|18|21|22|23|24|25|26|27|28|31|32|33|34|35|36|37|38|41|42|43|44|45|46|47|48)\b/)) {
        cleaned += ' 46';
      }
    }

    return cleaned;
  };

  const parseScribeTranscript = (text: string, parseMode: 'teeth' | 'prescription' | 'nextVisit' | 'notes') => {
    if (!text.trim()) return;
    
    setTimeout(() => {
      if (parseMode === 'teeth') {
        const lower = preprocessHinglishTranscript(text);
        // Match FDI numbers (11 to 48)
        const toothMatches = lower.match(/\b(11|12|13|14|15|16|17|18|21|22|23|24|25|26|27|28|31|32|33|34|35|36|37|38|41|42|43|44|45|46|47|48)\b/g);
        
        const newProblemTeeth = [...(form.problemTeeth || [])];
        const newConditions = { ...form.toothConditions };
        const newNotes = { ...form.toothNotes };
        
        let taggedCount = 0;
        
        if (toothMatches) {
          toothMatches.forEach((toothStr) => {
            const t = parseInt(toothStr, 10);
            if (!newProblemTeeth.includes(t)) {
              newProblemTeeth.push(t);
            }
            
            // Determine pathology/treatment
            let diagnosis = 'Decayed / Cavity';
            let status = 'Required';
            let noteText = 'Diagnosed via AI Scribe';
            
            if (lower.includes('root canal') || lower.includes('rct') || lower.includes('root-canal')) {
              diagnosis = 'Root Canal Needed';
              noteText = 'Root canal therapy required';
            } else if (lower.includes('implant')) {
              diagnosis = 'Dental Implant Needed';
              noteText = 'Implant replacement planned';
            } else if (lower.includes('crown') || lower.includes('bridge')) {
              diagnosis = 'Crown / Bridge Needed';
              noteText = 'Restoration crown required';
            } else if (lower.includes('missing') || lower.includes('extract')) {
              diagnosis = 'Missing Tooth';
              noteText = 'Missing tooth area';
            }
            
            if (lower.includes('pending') || lower.includes('progress')) {
              status = 'Pending / In Progress';
            } else if (lower.includes('completed') || lower.includes('done') || lower.includes('healthy') || lower.includes('clean')) {
              status = 'Completed / Done';
              diagnosis = 'Healthy / Normal';
              noteText = 'Treatment completed successfully';
            }
            
            newConditions[t] = { diagnosis, status };
            newNotes[t] = noteText;
            taggedCount++;
          });
        }
        
        handleChange('problemTeeth', newProblemTeeth.sort((a, b) => a - b));
        handleChange('toothConditions', newConditions);
        handleChange('toothNotes', newNotes);
      }
      
      if (parseMode === 'prescription') {
        const sentences = text.split(/[.।\n]/);
        const rxKeywords = [
          'prescribe', 'prescription', 'tab', 'cap', 'mg', 'mouthwash', 'gel', 
          'capsule', 'tablet', 'daily', 'sos', 'days', 'medicine', 'dawa', 
          'paracetamol', 'amoxicillin', 'ibuprofen', 'pain', 'twice', 'thrice', 'once'
        ];
        const rxLines: string[] = [];
        
        sentences.forEach((sentence) => {
          const trimmed = sentence.trim();
          if (!trimmed) return;
          const hasRxKeyword = rxKeywords.some(keyword => trimmed.toLowerCase().includes(keyword));
          if (hasRxKeyword) {
            let cleaned = trimmed.replace(/^(and|then|please|also|advise|•|\*|-)\s+/i, '');
            cleaned = cleaned.replace(/^[•\*\-\s]+/, '');
            cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
            rxLines.push(`• ${cleaned}`);
          }
        });
        
        if (rxLines.length > 0) {
          handleChange('prescription', rxLines.join('\n'));
        }
      }
      
      if (parseMode === 'nextVisit') {
        const lower = text.toLowerCase();
        let daysToAdd = 0;
        if (lower.includes('one week') || lower.includes('1 week') || lower.includes('7 days') || lower.includes('7 day') || lower.includes('seven days')) {
          daysToAdd = 7;
        } else if (lower.includes('two weeks') || lower.includes('2 weeks') || lower.includes('14 days') || lower.includes('fourteen days')) {
          daysToAdd = 14;
        } else if (lower.includes('three weeks') || lower.includes('3 weeks') || lower.includes('21 days')) {
          daysToAdd = 21;
        } else if (lower.includes('one month') || lower.includes('1 month') || lower.includes('30 days') || lower.includes('thirty days')) {
          daysToAdd = 30;
        } else if (lower.includes('ten days') || lower.includes('10 days') || lower.includes('ten day')) {
          daysToAdd = 10;
        } else if (lower.includes('next month')) {
          daysToAdd = 30;
        } else if (lower.includes('next week')) {
          daysToAdd = 7;
        } else if (lower.includes('tomorrow')) {
          daysToAdd = 1;
        } else {
          const match = lower.match(/(\d+)\s*day/);
          if (match) {
            daysToAdd = parseInt(match[1], 10);
          }
        }

        if (daysToAdd > 0) {
          const baseDate = new Date();
          baseDate.setDate(baseDate.getDate() + daysToAdd);
          const isoString = baseDate.toISOString().split('T')[0];
          handleChange('vitals', { ...form.vitals, nextVisitDate: isoString });
        }
      }

      if (parseMode === 'notes') {
        const sentences = text.split(/[.।\n]/);
        const notesKeywords = [
          'pain', 'complaining', 'complaint', 'hurt', 'sensitive', 'bleeding', 'swelling', 'cavity', 'decay',
          'cleaning', 'whitening', 'checkup', 'broken', 'chipped', 'dard', 'sujan', 'khoon', 'safai', 'saaf',
          'bridge', 'missing', 'consultation'
        ];
        const notesLines: string[] = [];
        
        sentences.forEach((sentence) => {
          const trimmed = sentence.trim();
          if (!trimmed) return;
          const hasNotesKeyword = notesKeywords.some(keyword => trimmed.toLowerCase().includes(keyword));
          if (hasNotesKeyword) {
            let cleaned = trimmed.replace(/^(and|then|please|also|advise)\s+/i, '');
            cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
            notesLines.push(cleaned);
          }
        });
        
        if (notesLines.length > 0) {
          handleChange('notes', notesLines.join('. ') + '.');
        } else {
          const backupLines = sentences.slice(0, 2).map(s => s.trim()).filter(Boolean);
          if (backupLines.length > 0) {
            handleChange('notes', backupLines.join('. ') + '.');
          }
        }
      }
      
      setNotesRecording(false);
    }, 1200);
  };

  const compressImage = (file: File, callback: (base64: string) => void) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1024;
        const MAX_HEIGHT = 1024;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
          callback(compressedBase64);
        } else {
          callback(event.target?.result as string);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (field: keyof Customer, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    
    // Context-aware defaults when changing service
    if (field === 'service' && value) {
      const selectedProc = proceduresCatalog.find(p => p.name === value);
      if (selectedProc) {
        // Pre-fill totalSpend
        setForm((prev) => ({ ...prev, service: value, totalSpend: selectedProc.defaultCost }));
        
        // Auto-populate estimates builder list
        setEstimateItems([{
          procedure: selectedProc.name,
          cost: selectedProc.defaultCost,
          isCosmetic: selectedProc.gstRate === 18
        }]);
      }
    }
  };

  const handleToothToggle = (toothNum: number) => {
    const activeTeeth = form.problemTeeth || [];
    if (activeTeeth.includes(toothNum)) {
      handleChange('problemTeeth', activeTeeth.filter((t) => t !== toothNum));
    } else {
      handleChange('problemTeeth', [...activeTeeth, toothNum].sort((a, b) => a - b));
    }
  };

  const handleXrayUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      compressImage(file, (compressedBase64) => {
        handleChange('xrays', [...(form.xrays || []), compressedBase64]);
      });
    });
  };

  const handleRemoveXray = (idxToRemove: number) => {
    handleChange('xrays', (form.xrays || []).filter((_, idx) => idx !== idxToRemove));
  };

  const handleTeethPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      compressImage(file, (compressedBase64) => {
        handleChange('beforeAfterPhotos', [...(form.beforeAfterPhotos || []), compressedBase64]);
      });
    });
  };

  const handleRemoveTeethPhoto = (idxToRemove: number) => {
    handleChange('beforeAfterPhotos', (form.beforeAfterPhotos || []).filter((_, idx) => idx !== idxToRemove));
  };

  const handleBeforePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      compressImage(file, (compressedBase64) => {
        setForm((prev) => ({
          ...prev,
          beforePhotos: [...(prev.beforePhotos || []), compressedBase64]
        }));
      });
    });
  };

  const handleRemoveBeforePhoto = (idxToRemove: number) => {
    setForm((prev) => ({
      ...prev,
      beforePhotos: (prev.beforePhotos || []).filter((_, idx) => idx !== idxToRemove)
    }));
  };

  const handleAfterPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      compressImage(file, (compressedBase64) => {
        setForm((prev) => ({
          ...prev,
          afterPhotos: [...(prev.afterPhotos || []), compressedBase64]
        }));
      });
    });
  };

  const handleRemoveAfterPhoto = (idxToRemove: number) => {
    setForm((prev) => ({
      ...prev,
      afterPhotos: (prev.afterPhotos || []).filter((_, idx) => idx !== idxToRemove)
    }));
  };

  const downloadPrescriptionPDF = async (c: Customer) => {
    const patientName = c.name || 'Patient';
    const patientPhone = c.phone || '';
    const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const nextFollowUp = getNextVisitDate(c);

    // Create A4 document
    const doc = new jsPDF('p', 'mm', 'a4');
    const W = doc.internal.pageSize.getWidth();

    // colors
    const PRIMARY_TEAL = [15, 118, 110];
    const TEXT_DARK = [30, 41, 59];
    const TEXT_MUTED = [100, 116, 139];
    const ACCENT_GOLD = [217, 119, 6];
    const BG_LIGHT = [248, 250, 252];
    const BORDER_LIGHT = [226, 232, 240];

    // 1. Top Bar
    doc.setFillColor(PRIMARY_TEAL[0], PRIMARY_TEAL[1], PRIMARY_TEAL[2]);
    doc.rect(0, 0, W, 12, 'F');

    // 2. Accent
    doc.setFillColor(ACCENT_GOLD[0], ACCENT_GOLD[1], ACCENT_GOLD[2]);
    doc.rect(0, 12, W, 1.5, 'F');

    // 3. Logo if available
    if (clinicBranding.logoUrl) {
      try {
        doc.addImage(clinicBranding.logoUrl, 'PNG', 15, 18, 12, 12);
      } catch (e) {
        console.error("Failed to add logo to PDF:", e);
      }
    }

    const headerTextX = clinicBranding.logoUrl ? 32 : 15;

    // Clinic Info
    doc.setTextColor(PRIMARY_TEAL[0], PRIMARY_TEAL[1], PRIMARY_TEAL[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text(clinicBranding.clinicName || 'Dental Clinic', headerTextX, 28);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
    doc.text(clinicBranding.doctorName || 'Doctor', headerTextX, 34);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    const drQualifications = clinicBranding.qualifications || '';
    if (drQualifications) {
      doc.text(drQualifications, headerTextX, 38);
    }
    doc.text('Dental Surgeon & Specialist', headerTextX, drQualifications ? 42 : 38);

    // Right Side Contact
    doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    if (clinicBranding.phone) {
      doc.text(clinicBranding.phone, W - 15, 28, { align: 'right' });
    }

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.setFontSize(9);
    if (clinicBranding.email) {
      doc.text(clinicBranding.email, W - 15, 33, { align: 'right' });
    }

    if (clinicBranding.address) {
      const addrLines = doc.splitTextToSize(clinicBranding.address, 70);
      doc.text(addrLines, W - 15, 38, { align: 'right' });
    }

    doc.setDrawColor(BORDER_LIGHT[0], BORDER_LIGHT[1], BORDER_LIGHT[2]);
    doc.setLineWidth(0.5);
    doc.line(15, 50, W - 15, 50);

    // Patient Details
    doc.setFillColor(BG_LIGHT[0], BG_LIGHT[1], BG_LIGHT[2]);
    doc.rect(15, 55, W - 30, 24, 'F');
    doc.setDrawColor(BORDER_LIGHT[0], BORDER_LIGHT[1], BORDER_LIGHT[2]);
    doc.rect(15, 55, W - 30, 24, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.text('PATIENT INFO', 20, 61);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
    doc.text(patientName, 20, 67);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.text(`Mobile: ${patientPhone || '-'}`, 20, 72);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.text('CONSULTATION DATE', 130, 61);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
    doc.text(today, 130, 67);

    if (nextFollowUp) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
      doc.text('FOLLOW UP DATE', 130, 72);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(ACCENT_GOLD[0], ACCENT_GOLD[1], ACCENT_GOLD[2]);
      const nextFollowUpFormatted = new Date(nextFollowUp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      doc.text(nextFollowUpFormatted, 162, 72);
    }

    doc.setTextColor(PRIMARY_TEAL[0], PRIMARY_TEAL[1], PRIMARY_TEAL[2]);
    doc.setFontSize(26);
    doc.setFont('helvetica', 'bold');
    doc.text('Rx', 15, 95);

    doc.setDrawColor(PRIMARY_TEAL[0], PRIMARY_TEAL[1], PRIMARY_TEAL[2]);
    doc.setLineWidth(0.8);
    doc.line(30, 93, W - 15, 93);

    doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('PRESCRIBED MEDICATIONS & INSTRUCTIONS', 15, 103);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);

    const rxText = c.prescription || 'No prescription entered.';
    let rxLinesFormatted: string[] = [];
    try {
      const trimmedRx = rxText.trim();
      if (trimmedRx.startsWith('[') && trimmedRx.endsWith(']')) {
        const meds = JSON.parse(trimmedRx);
        if (Array.isArray(meds)) {
          meds.forEach((med, idx) => {
            const parts: string[] = [];
            if (med.name) parts.push(med.name);
            const details: string[] = [];
            if (med.dosage) details.push(med.dosage);
            if (med.frequency) details.push(med.frequency);
            if (med.duration) details.push(med.duration);
            let medStr = `${idx + 1}. ${parts.join(' ')}`;
            if (details.length > 0) medStr += ` - ${details.join(', ')}`;
            if (med.instructions) medStr += ` (${med.instructions})`;
            rxLinesFormatted.push(medStr);
          });
        }
      }
    } catch (e) {}

    if (rxLinesFormatted.length === 0) {
      rxLinesFormatted = rxText.split('\n');
    }

    const rxLines = doc.splitTextToSize(rxLinesFormatted.join('\n'), W - 30);
    doc.text(rxLines, 15, 111, { baseline: 'top' });

    const rxHeight = rxLines.length * 6;
    let currentY = 111 + rxHeight + 10;

    const estimate = c.estimates?.[0];
    const estimateItems = estimate?.items || [];
    const calculatedSubtotal = estimate?.items?.reduce((sum, item) => sum + Number(item.cost || 0), 0) || 0;
    const estimateDiscount = estimate?.discount || 0;
    const calculatedDiscountAmount = (calculatedSubtotal * estimateDiscount) / 100;
    const calculatedGrandTotal = calculatedSubtotal - calculatedDiscountAmount;

    if (estimateItems.length > 0) {
      doc.setDrawColor(BORDER_LIGHT[0], BORDER_LIGHT[1], BORDER_LIGHT[2]);
      doc.setLineWidth(0.5);
      doc.line(15, currentY - 5, W - 15, currentY - 5);

      doc.setTextColor(PRIMARY_TEAL[0], PRIMARY_TEAL[1], PRIMARY_TEAL[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Treatment Summary & Care Receipt', 15, currentY);

      currentY += 6;

      doc.setFillColor(PRIMARY_TEAL[0], PRIMARY_TEAL[1], PRIMARY_TEAL[2]);
      doc.rect(15, currentY, W - 30, 8, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('PROCEDURE / TREATMENT DONE', 20, currentY + 5.5);
      doc.text('TOOTH', 120, currentY + 5.5);
      doc.text('AMOUNT (INR)', 160, currentY + 5.5);

      currentY += 8;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);

      estimateItems.forEach((item, idx) => {
        if (idx % 2 === 1) {
          doc.setFillColor(BG_LIGHT[0], BG_LIGHT[1], BG_LIGHT[2]);
          doc.rect(15, currentY, W - 30, 8, 'F');
        }
        doc.text(item.procedure, 20, currentY + 5.5);
        doc.text(item.tooth ? `Tooth ${item.tooth}` : '-', 120, currentY + 5.5);
        doc.text(`Rs. ${(item.cost || 0).toLocaleString('en-IN')}`, 160, currentY + 5.5);
        currentY += 8;
      });

      doc.setDrawColor(BORDER_LIGHT[0], BORDER_LIGHT[1], BORDER_LIGHT[2]);
      doc.line(15, currentY, W - 15, currentY);
      currentY += 6;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
      doc.text(`Subtotal:`, 125, currentY);
      doc.text(`Rs. ${calculatedSubtotal.toLocaleString('en-IN')}`, 190, currentY, { align: 'right' });

      currentY += 5;
      if (calculatedDiscountAmount > 0) {
        doc.text(`Concession (${estimateDiscount}%):`, 125, currentY);
        doc.setTextColor(ACCENT_GOLD[0], ACCENT_GOLD[1], ACCENT_GOLD[2]);
        doc.text(`- Rs. ${calculatedDiscountAmount.toLocaleString('en-IN')}`, 190, currentY, { align: 'right' });
        currentY += 5;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(PRIMARY_TEAL[0], PRIMARY_TEAL[1], PRIMARY_TEAL[2]);
      doc.text(`Final Amount (Paid):`, 125, currentY);
      doc.text(`Rs. ${calculatedGrandTotal.toLocaleString('en-IN')}`, 190, currentY, { align: 'right' });
    }

    const footerY = 270;
    doc.setDrawColor(BORDER_LIGHT[0], BORDER_LIGHT[1], BORDER_LIGHT[2]);
    doc.setLineWidth(0.5);
    doc.line(15, footerY - 15, W - 15, footerY - 15);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.text('This is a digitally generated prescription/receipt. No physical signature is required.', 15, footerY - 5);
    doc.text(`${clinicBranding.clinicName || 'Clinic'} · Thank you for letting us care for your smile.`, 15, footerY);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
    doc.text("Doctor's Signature", 150, footerY - 5);
    doc.setDrawColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.line(150, footerY - 1, 195, footerY - 1);

    await addSmileGalleryToPDF(doc, c, {
      clinicName: clinicBranding.clinicName,
      doctorName: clinicBranding.doctorName,
      qualifications: clinicBranding.qualifications,
      phone: clinicBranding.phone,
      logoUrl: clinicBranding.logoUrl
    });

    doc.save(`Rx_Estimate_${patientName.replace(/\s+/g, '_')}_${today.replace(/\s+/g, '-')}.pdf`);
  };

  const generateDefaultPDF = async () => {
    const patientName = form.name || 'Patient';
    const patientPhone = form.phone || '';
    const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const nextFollowUp = getNextVisitDate(form as Customer);

    // Create A4 document
    const doc = new jsPDF('p', 'mm', 'a4'); // A4 size: 210mm x 297mm
    const W = doc.internal.pageSize.getWidth();

    // ── COLOR PALETTE (Premium Teal / Gold Accent) ────────────────────────
    const PRIMARY_TEAL = [15, 118, 110]; // #0F766E
    const TEXT_DARK = [30, 41, 59];    // #1E293B
    const TEXT_MUTED = [100, 116, 139]; // #64748B
    const ACCENT_GOLD = [217, 119, 6];  // #D97706
    const BG_LIGHT = [248, 250, 252];   // #F8FAFC
    const BORDER_LIGHT = [226, 232, 240]; // #E2E8F0

    // 1. Top Branded Bar
    doc.setFillColor(PRIMARY_TEAL[0], PRIMARY_TEAL[1], PRIMARY_TEAL[2]);
    doc.rect(0, 0, W, 12, 'F');

    // 2. Gold Accent Line
    doc.setFillColor(ACCENT_GOLD[0], ACCENT_GOLD[1], ACCENT_GOLD[2]);
    doc.rect(0, 12, W, 1.5, 'F');

    // 3. Logo if available
    if (clinicBranding.logoUrl) {
      try {
        doc.addImage(clinicBranding.logoUrl, 'PNG', 15, 18, 12, 12);
      } catch (e) {
        console.error("Failed to add logo to PDF:", e);
      }
    }

    const headerTextX = clinicBranding.logoUrl ? 32 : 15;

    // Clinic Info & Logo Placeholder/Icon
    doc.setTextColor(PRIMARY_TEAL[0], PRIMARY_TEAL[1], PRIMARY_TEAL[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text(clinicBranding.clinicName || 'Dental Clinic', headerTextX, 28);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
    doc.text(clinicBranding.doctorName || 'Doctor', headerTextX, 34);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    const drQualifications = clinicBranding.qualifications || '';
    if (drQualifications) {
      doc.text(drQualifications, headerTextX, 38);
    }
    doc.text('Dental Surgeon & Specialist', headerTextX, drQualifications ? 42 : 38);

    // Right Side Contact Info
    doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    if (clinicBranding.phone) {
      doc.text(clinicBranding.phone, W - 15, 28, { align: 'right' });
    }

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.setFontSize(9);
    if (clinicBranding.email) {
      doc.text(clinicBranding.email, W - 15, 33, { align: 'right' });
    }

    if (clinicBranding.address) {
      const addrLines = doc.splitTextToSize(clinicBranding.address, 70);
      doc.text(addrLines, W - 15, 38, { align: 'right' });
    }

    // 4. Header Separator
    doc.setDrawColor(BORDER_LIGHT[0], BORDER_LIGHT[1], BORDER_LIGHT[2]);
    doc.setLineWidth(0.5);
    doc.line(15, 50, W - 15, 50);

    // 5. Patient Details Card
    doc.setFillColor(BG_LIGHT[0], BG_LIGHT[1], BG_LIGHT[2]);
    doc.rect(15, 55, W - 30, 24, 'F');
    doc.setDrawColor(BORDER_LIGHT[0], BORDER_LIGHT[1], BORDER_LIGHT[2]);
    doc.rect(15, 55, W - 30, 24, 'S');

    // Left Column: Patient Info
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.text('PATIENT INFO', 20, 61);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
    doc.text(patientName, 20, 67);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.text(`Mobile: ${patientPhone || '-'}`, 20, 72);

    // Right Column: Date & Follow Up
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.text('CONSULTATION DATE', 130, 61);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
    doc.text(today, 130, 67);

    if (nextFollowUp) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
      doc.text('FOLLOW UP DATE', 130, 72);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(ACCENT_GOLD[0], ACCENT_GOLD[1], ACCENT_GOLD[2]);
      const nextFollowUpFormatted = new Date(nextFollowUp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      doc.text(nextFollowUpFormatted, 162, 72);
    }

    // 6. Prescription section
    doc.setTextColor(PRIMARY_TEAL[0], PRIMARY_TEAL[1], PRIMARY_TEAL[2]);
    doc.setFontSize(26);
    doc.setFont('helvetica', 'bold');
    doc.text('Rx', 15, 95);

    // Accent line next to Rx
    doc.setDrawColor(PRIMARY_TEAL[0], PRIMARY_TEAL[1], PRIMARY_TEAL[2]);
    doc.setLineWidth(0.8);
    doc.line(30, 93, W - 15, 93);

    // Medications Title
    doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('PRESCRIBED MEDICATIONS & INSTRUCTIONS', 15, 103);

    // List Medications
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);

    const rxText = form.prescription || 'No prescription entered.';
    
    // Parse structured JSON arrays from the AI scribe if they exist
    let rxLinesFormatted: string[] = [];
    try {
      const trimmedRx = rxText.trim();
      if (trimmedRx.startsWith('[') && trimmedRx.endsWith(']')) {
        const meds = JSON.parse(trimmedRx);
        if (Array.isArray(meds)) {
          meds.forEach((med, idx) => {
            const parts: string[] = [];
            if (med.name) parts.push(med.name);
            
            const details: string[] = [];
            if (med.dosage) details.push(med.dosage);
            if (med.frequency) details.push(med.frequency);
            if (med.duration) details.push(med.duration);
            
            let medStr = `${idx + 1}. ${parts.join(' ')}`;
            if (details.length > 0) {
              medStr += ` - ${details.join(', ')}`;
            }
            if (med.instructions) {
              medStr += ` (${med.instructions})`;
            }
            rxLinesFormatted.push(medStr);
          });
        }
      }
    } catch (e) {
      // JSON parse failed, treat as raw text
    }

    if (rxLinesFormatted.length === 0) {
      rxLinesFormatted = rxText.split('\n');
    }

    const rxLines = doc.splitTextToSize(rxLinesFormatted.join('\n'), W - 30);
    doc.text(rxLines, 15, 111, { baseline: 'top' });

    // Calculate approximate height of Rx text
    const rxHeight = rxLines.length * 6;
    let currentY = 111 + rxHeight + 10;

    // 7. Treatment plan & Billing (Modern card layout) - only render if treatment items exist
    if (estimateItems && estimateItems.length > 0) {
      doc.setDrawColor(BORDER_LIGHT[0], BORDER_LIGHT[1], BORDER_LIGHT[2]);
      doc.setLineWidth(0.5);
      doc.line(15, currentY - 5, W - 15, currentY - 5);

      doc.setTextColor(PRIMARY_TEAL[0], PRIMARY_TEAL[1], PRIMARY_TEAL[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Treatment Summary & Care Receipt', 15, currentY);

      currentY += 6;

      // Table Header
      doc.setFillColor(PRIMARY_TEAL[0], PRIMARY_TEAL[1], PRIMARY_TEAL[2]);
      doc.rect(15, currentY, W - 30, 8, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('PROCEDURE / TREATMENT DONE', 20, currentY + 5.5);
      doc.text('TOOTH', 120, currentY + 5.5);
      doc.text('AMOUNT (INR)', 160, currentY + 5.5);

      currentY += 8;

      // Table Rows
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);

      estimateItems.forEach((item, idx) => {
        // Alternating row background for modern look
        if (idx % 2 === 1) {
          doc.setFillColor(BG_LIGHT[0], BG_LIGHT[1], BG_LIGHT[2]);
          doc.rect(15, currentY, W - 30, 8, 'F');
        }
        
        doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
        doc.text(item.procedure, 20, currentY + 5.5);
        doc.text(item.tooth ? `Tooth ${item.tooth}` : '-', 120, currentY + 5.5);
        doc.text(`Rs. ${item.cost.toLocaleString('en-IN')}`, 160, currentY + 5.5);
        currentY += 8;
      });

      // Separator
      doc.setDrawColor(BORDER_LIGHT[0], BORDER_LIGHT[1], BORDER_LIGHT[2]);
      doc.line(15, currentY, W - 15, currentY);
      currentY += 6;

      // Totals block aligned right
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
      doc.text(`Subtotal:`, 125, currentY);
      doc.text(`Rs. ${calculatedSubtotal.toLocaleString('en-IN')}`, 190, currentY, { align: 'right' });

      currentY += 5;
      if (calculatedDiscountAmount > 0) {
        doc.text(`Concession (${estimateDiscount}%):`, 125, currentY);
        doc.setTextColor(ACCENT_GOLD[0], ACCENT_GOLD[1], ACCENT_GOLD[2]);
        doc.text(`- Rs. ${calculatedDiscountAmount.toLocaleString('en-IN')}`, 190, currentY, { align: 'right' });
        currentY += 5;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(PRIMARY_TEAL[0], PRIMARY_TEAL[1], PRIMARY_TEAL[2]);
      doc.text(`Final Amount (Paid):`, 125, currentY);
      doc.text(`Rs. ${calculatedGrandTotal.toLocaleString('en-IN')}`, 190, currentY, { align: 'right' });
    }

    // 8. Footer (Elegant Signature Block)
    const footerY = 270;
    doc.setDrawColor(BORDER_LIGHT[0], BORDER_LIGHT[1], BORDER_LIGHT[2]);
    doc.setLineWidth(0.5);
    doc.line(15, footerY - 15, W - 15, footerY - 15);

    // Disclaimer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.text('This is a digitally generated prescription/receipt. No physical signature is required.', 15, footerY - 5);
    doc.text(`${clinicBranding.clinicName || 'Clinic'} · Thank you for letting us care for your smile.`, 15, footerY);

    // Signature Line
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
    doc.text("Doctor's Signature", 150, footerY - 5);
    doc.setDrawColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.line(150, footerY - 1, 195, footerY - 1);

    await addSmileGalleryToPDF(doc, form as Customer, {
      clinicName: clinicBranding.clinicName,
      doctorName: clinicBranding.doctorName,
      qualifications: clinicBranding.qualifications,
      phone: clinicBranding.phone,
      logoUrl: clinicBranding.logoUrl
    });

    doc.save(`Rx_Estimate_${patientName.replace(/\s+/g, '_')}_${today.replace(/\s+/g, '-')}.pdf`);
  };

  const handleSave = () => {
    // Auto-update status to 'Active' if prescription or estimates are added/modified
    let finalForm = { ...form };
    const initialPrescription = customer?.prescription || '';
    const currentPrescription = form.prescription || '';
    const isPrescriptionAdded = currentPrescription.trim() !== '' && currentPrescription !== initialPrescription;
    
    const initialEstimatesCount = customer?.estimates?.length || 0;
    const isEstimatesAddedOrModified = estimateItems.length > 0 && 
      (initialEstimatesCount === 0 || JSON.stringify(estimateItems) !== JSON.stringify(customer?.estimates?.[0]?.items || []));

    if ((isPrescriptionAdded || isEstimatesAddedOrModified) && form.status !== 'Active') {
      finalForm.status = 'Active';
    }

    // Generate/update estimate object if items exist
    const estimateObj = {
      id: customer?.estimates?.[0]?.id || `est_${Date.now()}`,
      date: customer?.estimates?.[0]?.date || new Date().toISOString().split('T')[0],
      items: estimateItems,
      discount: estimateDiscount,
      tax: calculatedGST,
      grandTotal: calculatedGrandTotal,
      status: estimateStatus
    };

    const newCustomer: Customer = {
      ...finalForm,
      id: form.id || '',
      avatarColor: form.avatarColor || AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
      problemTeeth: form.problemTeeth || [],
      xrays: form.xrays || [],
      allergies: form.allergies || [],
      medicalConditions: form.medicalConditions || [],
      toothNotes: form.toothNotes || {},
      toothConditions: form.toothConditions || {},
      vitals: form.vitals || { bp: '', pulse: '', temp: '' },
      estimates: estimateItems.length > 0 ? [estimateObj] : (form.estimates || []),
    };
    onSave(newCustomer);
    onClose();
  };

  const inputBase =
    'w-full px-3 py-2.5 rounded-lg text-[13px] text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-150 focus:ring-1 focus:ring-indigo-500/50';
  const inputStyle = {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
  };
  const inputFocusStyle = 'focus:border-indigo-500/40';

  const getProcedureForDiagnosis = (diag: string) => {
    let searchStr = '';
    if (diag === 'Decayed / Cavity') searchStr = 'Composite';
    else if (diag === 'Root Canal Needed') searchStr = 'Root Canal';
    else if (diag === 'Crown / Bridge Needed') searchStr = 'Crown';
    else if (diag === 'Dental Implant Needed') searchStr = 'Implant';
    else return null;

    const matched = proceduresCatalog.find(p => p.name.toLowerCase().includes(searchStr.toLowerCase()));
    if (matched) return matched;
    
    // Fallback defaults if catalog is empty or doesn't match
    if (diag === 'Decayed / Cavity') return { name: 'Composite Filling / Restoration', defaultCost: 1500, gstRate: 0 };
    if (diag === 'Root Canal Needed') return { name: 'Root Canal Treatment (RCT)', defaultCost: 3500, gstRate: 0 };
    if (diag === 'Crown / Bridge Needed') return { name: 'PFM Crown / Cap', defaultCost: 4000, gstRate: 0 };
    if (diag === 'Dental Implant Needed') return { name: 'Dental Implant Placement', defaultCost: 25000, gstRate: 0 };
    return null;
  };

  const handleUpdateToothCondition = (t: number, newDiag: string, newStat: string) => {
    const toothVal = form.toothConditions?.[t];
    let oldDiag = 'Decayed / Cavity';
    let oldStat = 'Required';
    
    if (toothVal) {
      if (typeof toothVal === 'object' && toothVal !== null) {
        oldDiag = (toothVal as any).diagnosis || 'Decayed / Cavity';
        oldStat = (toothVal as any).status || 'Required';
      } else if (typeof toothVal === 'string') {
        const lowerVal = toothVal.toLowerCase();
        if (lowerVal.includes('completed') || lowerVal.includes('done') || lowerVal.includes('healthy')) {
          oldDiag = 'Healthy / Normal';
          oldStat = 'Completed / Done';
        } else if (lowerVal.includes('pending') || lowerVal.includes('progress')) {
          oldDiag = 'Decayed / Cavity';
          oldStat = 'Pending / In Progress';
        } else {
          oldDiag = toothVal.replace(' Needed', '').replace(' (Required)', '');
          oldStat = 'Required';
        }
      }
    }

    const conditions = { 
      ...form.toothConditions, 
      [t]: { diagnosis: newDiag, status: newStat } 
    };
    handleChange('toothConditions', conditions);

    // If status was Completed and changed, or diagnosis changed while Completed, remove old billing item
    if (oldStat === 'Completed / Done') {
      const oldProc = getProcedureForDiagnosis(oldDiag);
      if (oldProc) {
        setEstimateItems(prev => prev.filter(
          (item) => !(item.tooth === t && item.procedure === oldProc.name)
        ));
      }
    }

    // Add new billing item if new status is Completed / Done
    if (newStat === 'Completed / Done') {
      const newProc = getProcedureForDiagnosis(newDiag);
      if (newProc) {
        const alreadyExists = estimateItems.some(
          (item) => item.tooth === t && item.procedure === newProc.name
        );
        if (!alreadyExists) {
          const isCosmetic = newProc.name.toLowerCase().includes('aligner') || newProc.name.toLowerCase().includes('whitening');
          setEstimateItems(prev => [
            ...prev,
            {
              tooth: t,
              procedure: newProc.name,
              cost: newProc.defaultCost,
              isCosmetic: isCosmetic
            }
          ]);
        }
      }
    }
  };

  // FDI World Dental Federation notation quadrants
  const quad1 = [18, 17, 16, 15, 14, 13, 12, 11];
  const quad2 = [21, 22, 23, 24, 25, 26, 27, 28];
  const quad4 = [48, 47, 46, 45, 44, 43, 42, 41];
  const quad3 = [31, 32, 33, 34, 35, 36, 37, 38];

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase()
            ? <mark key={i} className="bg-amber-100 text-amber-900 font-bold p-0 rounded-sm">{part}</mark>
            : part
        )}
      </span>
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent
          className="max-w-2xl border-0 p-0 overflow-hidden max-sm:fixed max-sm:bottom-0 max-sm:top-auto max-sm:left-0 max-sm:translate-x-0 max-sm:translate-y-0 max-sm:w-full max-sm:max-w-full max-sm:rounded-t-2xl max-sm:rounded-b-none max-sm:max-h-[92vh] max-sm:flex max-sm:flex-col"
          style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}
          aria-describedby={undefined}
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            if (document.activeElement instanceof HTMLElement) {
              document.activeElement.blur();
            }
          }}
        >
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 8 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="w-full max-sm:flex max-sm:flex-col max-sm:h-full max-sm:max-h-[92vh] overflow-hidden"
              >
                {/* Drag Handle for mobile bottom sheet */}
                <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mt-3 mb-1 shrink-0 hidden max-sm:block" style={{ backgroundColor: '#CBD5E1' }} />
                {/* Header */}
                <div
                  className="px-4 sm:px-6 pt-4 sm:pt-5 pb-3 shrink-0"
                  style={{ borderBottom: '1px solid #E2E8F0' }}
                >
                  <DialogHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 text-left">
                    <div className="text-left">
                      <DialogTitle className="text-slate-800 text-[16px] font-semibold tracking-tight flex items-center gap-2">
                        {isEdit ? 'Patient Record' : 'Add Patient'}
                        {syncStatus === 'saving' && (
                          <span className="text-[10px] text-amber-500 font-bold bg-amber-50 border border-amber-100 rounded px-1.5 py-0.2 animate-pulse flex items-center gap-1 select-none">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Saving...
                          </span>
                        )}
                        {syncStatus === 'saved' && (
                          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 rounded px-1.5 py-0.2 flex items-center gap-1 select-none">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Synced
                          </span>
                        )}
                        {syncStatus === 'dirty' && (
                          <span className="text-[10px] text-slate-400 font-medium bg-slate-50 border border-slate-200 rounded px-1.5 py-0.2 flex items-center gap-1 select-none">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span> Unsaved
                          </span>
                        )}
                      </DialogTitle>
                      <p className="text-slate-500 text-[12px] mt-0.5">
                        {isEdit
                          ? 'Update intake and consultation notes'
                          : 'Enter patient details before treatment'}
                      </p>
                    </div>

                    {/* Tab Selector & Settings Gear */}
                    <div className="flex items-center gap-2 self-start sm:self-auto w-full sm:w-auto min-w-0">
                      <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200/80 gap-1 overflow-x-auto scrollbar-none flex-nowrap flex-1 sm:flex-none min-w-0">
                        {/* Tab 1: Before Tx */}
                        <button
                          type="button"
                          onClick={() => setActiveTab('general')}
                          className={`px-4 py-1.5 rounded-lg text-[12px] font-semibold transition-all duration-150 flex items-center gap-2 shrink-0 ${
                            activeTab === 'general'
                              ? 'bg-white text-indigo-600 shadow-sm border border-indigo-500'
                              : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100/50'
                          }`}
                        >
                          <Camera size={13} className="text-indigo-500" />
                          <span>Before Tx</span>
                        </button>
                        {/* Tab 2: Consultation */}
                        <button
                          type="button"
                          onClick={() => setActiveTab('medical')}
                          className={`px-4 py-1.5 rounded-lg text-[12px] font-semibold transition-all duration-150 flex items-center gap-2 shrink-0 ${
                            activeTab === 'medical'
                              ? 'bg-white text-indigo-600 shadow-sm border border-indigo-500'
                              : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100/50'
                          }`}
                        >
                          <Stethoscope size={13} className="text-indigo-500" />
                          <span>Consultation</span>
                        </button>
                        {/* Tab 3: Billing */}
                        <button
                          type="button"
                          onClick={() => setActiveTab('estimates')}
                          className={`px-4 py-1.5 rounded-lg text-[12px] font-semibold transition-all duration-150 flex items-center gap-2 shrink-0 ${
                            activeTab === 'estimates'
                              ? 'bg-white text-indigo-600 shadow-sm border border-indigo-500'
                              : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100/50'
                          }`}
                        >
                          <FileText size={13} className="text-indigo-500" />
                          <span>Billing</span>
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowVoiceSettingsModal(true)}
                        className="w-9 h-9 p-2 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-300 transition-all shrink-0 flex items-center justify-center shadow-sm"
                        title="AI Scribe Settings"
                      >
                        <Settings size={14} />
                      </button>
                    </div>
                  </DialogHeader>
                </div>
                {/* Body - General Tab */}
                {activeTab === 'general' && (
                  <div className="px-4 sm:px-6 py-4 space-y-4 overflow-y-auto overflow-x-hidden max-h-[60vh] max-sm:max-h-[calc(92vh-170px)] scrollbar-none flex-1">
                    {/* Full-width dashed profile photo upload container */}
                    <div className="w-full">
                      {form.profilePhoto ? (
                        <div className="relative aspect-[16/6] w-full rounded-2xl overflow-hidden border border-slate-200 bg-neutral-900 group">
                          <img src={form.profilePhoto} alt="Patient Profile" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-all duration-150">
                            <span className="text-[12px] font-bold text-white">Patient Profile Photo</span>
                            <button
                              type="button"
                              onClick={() => handleChange('profilePhoto', '')}
                              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-bold uppercase transition-colors"
                            >
                              Remove Photo
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="w-full border border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/20 hover:bg-indigo-50/40 rounded-2xl py-6 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all duration-150 group text-center">
                          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100/50">
                            <Camera size={18} />
                          </div>
                          <span className="text-[12px] font-bold text-indigo-600">Add Photo</span>
                          <span className="text-[10.5px] text-slate-500 mt-1">Upload patient photo (optional)</span>
                          <span className="text-[9px] text-slate-400">JPG, PNG up to 5MB</span>
                          <input
                            type="file"
                            accept="image/*"
                            capture="user"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                compressImage(file, (base64) => handleChange('profilePhoto', base64));
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                    {/* Name & Phone Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Full Name <span className="text-rose-500">*</span>
                        </label>
                        <div className="flex items-stretch border border-slate-200 rounded-xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/20 bg-white">
                          <div className="bg-slate-50 border-r border-slate-200 px-3.5 flex items-center justify-center text-slate-400 shrink-0">
                            <User size={16} />
                          </div>
                          <input
                            className="flex-1 px-3.5 py-2.5 text-[13px] text-slate-800 placeholder:text-slate-400 bg-transparent outline-none w-full border-0"
                            placeholder="e.g. Rahul Sharma"
                            value={form.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Phone <span className="text-rose-500">*</span>
                        </label>
                        <div className="flex items-stretch border border-slate-200 rounded-xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/20 bg-white">
                          <div className="bg-slate-50 border-r border-slate-200 px-3.5 flex items-center justify-center text-slate-400 shrink-0">
                            <Phone size={16} />
                          </div>
                          <input
                            className="flex-1 px-3.5 py-2.5 text-[13px] text-slate-800 placeholder:text-slate-400 bg-transparent outline-none w-full border-0"
                            placeholder="+91 98765 43210"
                            value={form.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Age & Gender Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Age */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Age
                        </label>
                        <div className="flex items-stretch border border-slate-200 rounded-xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/20 bg-white relative">
                          <div className="bg-slate-50 border-r border-slate-200 px-3.5 flex items-center justify-center text-slate-400 shrink-0">
                            <Calendar size={16} />
                          </div>
                          <input
                            type="number"
                            min="1"
                            max="120"
                            className="flex-1 px-3.5 py-2.5 text-[13px] text-slate-800 placeholder:text-slate-400 bg-transparent outline-none w-full border-0 pr-8"
                            placeholder="e.g. 32"
                            value={form.vitals?.age || ''}
                            onChange={(e) => handleChange('vitals', { ...form.vitals, age: e.target.value })}
                          />
                          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* Gender */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Gender
                        </label>
                        <div className="flex items-stretch border border-slate-200 rounded-xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/20 bg-white relative">
                          <div className="bg-slate-50 border-r border-slate-200 px-3.5 flex items-center justify-center text-slate-400 shrink-0">
                            <User size={16} />
                          </div>
                          <select
                            className="flex-1 px-3.5 py-2.5 text-[13px] text-slate-800 bg-transparent outline-none w-full border-0 cursor-pointer appearance-none pr-8"
                            value={form.vitals?.gender || ''}
                            onChange={(e) => handleChange('vitals', { ...form.vitals, gender: e.target.value })}
                          >
                            <option value="">Select gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Visit Date & Time Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Visit Date */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Visit Date <span className="text-rose-500">*</span>
                        </label>
                        <div className="flex items-stretch border border-slate-200 rounded-xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/20 bg-white">
                          <div className="bg-slate-50 border-r border-slate-200 px-3.5 flex items-center justify-center text-slate-400 shrink-0">
                            <Calendar size={16} />
                          </div>
                          <input
                            type="date"
                            className="flex-1 px-3.5 py-2.5 text-[13px] text-slate-800 bg-transparent outline-none w-full border-0"
                            style={{ colorScheme: 'light' }}
                            value={form.lastVisit}
                            onChange={(e) => handleChange('lastVisit', e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Visit Time */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Visit Time <span className="text-rose-500">*</span>
                        </label>
                        <div className="flex items-stretch border border-slate-200 rounded-xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/20 bg-white relative">
                          <div className="bg-slate-50 border-r border-slate-200 px-3.5 flex items-center justify-center text-slate-400 shrink-0">
                            <Clock size={16} />
                          </div>
                          <select
                            className="flex-1 px-3.5 py-2.5 text-[13px] text-slate-800 bg-transparent outline-none w-full border-0 cursor-pointer appearance-none pr-8"
                            value={form.appointmentTime}
                            onChange={(e) => handleChange('appointmentTime', e.target.value)}
                          >
                            <option value="09:00 AM">09:00 AM</option>
                            <option value="09:30 AM">09:30 AM</option>
                            <option value="10:00 AM">10:00 AM</option>
                            <option value="10:30 AM">10:30 AM</option>
                            <option value="11:00 AM">11:00 AM</option>
                            <option value="11:30 AM">11:30 AM</option>
                            <option value="12:00 PM">12:00 PM</option>
                            <option value="12:30 PM">12:30 PM</option>
                            <option value="01:00 PM">01:00 PM</option>
                            <option value="01:30 PM">01:30 PM</option>
                            <option value="02:00 PM">02:00 PM</option>
                            <option value="03:00 PM">03:00 PM</option>
                            <option value="04:00 PM">04:00 PM</option>
                            <option value="05:00 PM">05:00 PM</option>
                            <option value="06:00 PM">06:00 PM</option>
                            <option value="07:00 PM">07:00 PM</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Planned Treatment (Full Width) */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Planned Treatment
                      </label>
                      <div className="flex items-stretch border border-slate-200 rounded-xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/20 bg-white relative">
                        <div className="bg-slate-50 border-r border-slate-200 px-3.5 flex items-center justify-center text-slate-400 shrink-0">
                          <Stethoscope size={16} />
                        </div>
                        <select
                          className="flex-1 px-3.5 py-2.5 text-[13px] text-slate-800 bg-transparent outline-none w-full border-0 cursor-pointer appearance-none pr-8"
                          value={form.service}
                          onChange={(e) => handleChange('service', e.target.value)}
                        >
                          <option value="">Select Treatment...</option>
                          <option value="Consultation / Check-up">Consultation / Check-up</option>
                          <option value="Tooth Pain / Emergency">Tooth Pain / Emergency</option>
                          {proceduresCatalog.map((p) => (
                            <option key={p.name} value={p.name}>{p.name}</option>
                          ))}
                          <option value="Other">Other / Not Listed</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Spend & Visit Stage Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Advance / Paid */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Advance / Paid (₹)
                        </label>
                        <div className="flex items-stretch border border-slate-200 rounded-xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/20 bg-white">
                          <div className="bg-slate-50 border-r border-slate-200 px-3.5 flex items-center justify-center text-slate-400 font-bold shrink-0 text-[13px]">
                            ₹
                          </div>
                          <input
                            type="number"
                            className="flex-1 px-3.5 py-2.5 text-[13px] text-slate-800 placeholder:text-slate-400 bg-transparent outline-none w-full border-0"
                            placeholder="e.g. 12500"
                            value={form.totalSpend || ''}
                            onChange={(e) => handleChange('totalSpend', Number(e.target.value))}
                          />
                        </div>
                      </div>

                      {/* Visit Stage */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Visit Stage
                        </label>
                        <div className="flex items-stretch border border-slate-200 rounded-xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/20 bg-white relative">
                          <div className="bg-slate-50 border-r border-slate-200 px-3.5 flex items-center justify-center text-slate-400 shrink-0">
                            <User size={16} />
                          </div>
                          <select
                            className="flex-1 px-3.5 py-2.5 text-[13px] text-slate-800 bg-transparent outline-none w-full border-0 cursor-pointer appearance-none pr-8"
                            value={form.status}
                            onChange={(e) => handleChange('status', e.target.value as CustomerStatus)}
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s} style={{ background: '#FFFFFF', color: '#1E293B' }}>
                                {s}
                              </option>
                            ))}
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                          Complaint / Notes (Optional)
                        </label>
                        <button
                          type="button"
                          onClick={toggleNotesVoice}
                          disabled={notesTranscribing}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9.5px] font-bold uppercase border transition-all ${
                            notesRecording
                              ? 'bg-rose-500 border-rose-600 text-white animate-pulse'
                              : notesTranscribing
                                ? 'bg-amber-100 border-amber-300 text-amber-600 cursor-not-allowed'
                                : 'bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100'
                          }`}
                        >
                          <Mic size={9} className={notesTranscribing ? 'animate-spin' : ''} />
                          {notesRecording ? 'Listening...' : notesTranscribing ? 'Transcribing...' : 'Scribe Notes'}
                        </button>
                      </div>
                      <div className="flex items-stretch border border-slate-200 rounded-xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/20 bg-white">
                        <div className="bg-slate-50 border-r border-slate-200 px-3.5 pt-3.5 flex items-start justify-center text-slate-400 shrink-0">
                          <FileText size={16} />
                        </div>
                        <textarea
                          className="flex-1 px-3.5 py-2.5 text-[13px] text-slate-800 placeholder:text-slate-400 bg-transparent outline-none w-full border-0 resize-none"
                          rows={3}
                          placeholder="Any complaint, pain, or front-desk note..."
                          value={form.notes}
                          onChange={(e) => handleChange('notes', e.target.value)}
                        />
                      </div>
                      {/* Diagnosis Suggestions Tag Pills */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {['Toothache', 'Sensitivity', 'Swelling', 'Bleeding Gums', 'Missing Tooth', 'Cosmetic Aligners'].map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              const currentNotes = form.notes ? form.notes.trim() : '';
                              if (currentNotes) {
                                if (!currentNotes.toLowerCase().includes(tag.toLowerCase())) {
                                  handleChange('notes', `${currentNotes}, ${tag}`);
                                }
                              } else {
                                  handleChange('notes', tag);
                              }
                            }}
                            className="px-2 py-0.5 rounded-full bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-[10px] font-semibold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer select-none"
                          >
                            + {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Before Photos (Optional) */}
                    <div className="space-y-3 pt-2">
                      <div>
                        <h4 className="text-[12px] font-bold text-slate-800 uppercase tracking-wider">Before Photos (Optional)</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">Attach clinical photographs showing teeth condition before treatment</p>
                      </div>

                      {/* Uploader dropzone */}
                      {/* Uploader options */}
                      <div className="grid grid-cols-2 gap-3 w-full">
                        <label className="border border-dashed border-slate-200 hover:border-indigo-500 bg-slate-50/50 hover:bg-indigo-50/[0.04] rounded-xl py-4 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all duration-150 group">
                          <Upload size={16} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                          <span className="text-[11px] font-bold text-slate-600 group-hover:text-slate-800 transition-colors">Choose from Gallery</span>
                          <span className="text-[9px] text-slate-400">Upload existing photos</span>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleBeforePhotoUpload}
                            className="hidden"
                          />
                        </label>
                        <label className="border border-dashed border-slate-200 hover:border-indigo-500 bg-slate-50/50 hover:bg-indigo-50/[0.04] rounded-xl py-4 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all duration-150 group">
                          <Camera size={16} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                          <span className="text-[11px] font-bold text-slate-600 group-hover:text-slate-800 transition-colors">Take Photo (Camera)</span>
                          <span className="text-[9px] text-slate-400">Capture live pre-op photo</span>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            capture="environment"
                            onChange={handleBeforePhotoUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Photo Grid */}
                      {form.beforePhotos && form.beforePhotos.length > 0 && (
                        <div className="grid grid-cols-2 gap-3 mt-2">
                          {form.beforePhotos.map((photo, index) => (
                            <div key={index} className="relative aspect-[16/11] rounded-xl overflow-hidden border border-slate-200 bg-neutral-900 group">
                              <img src={photo} alt={`Before treatment ${index + 1}`} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity duration-150">
                                <button
                                  type="button"
                                  onClick={() => setLightboxImg(photo)}
                                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white flex items-center justify-center transition-colors"
                                >
                                  <Eye size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveBeforePhoto(index)}
                                  className="w-8 h-8 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-400 flex items-center justify-center transition-colors"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                              <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 border border-white/10 text-[9px] font-bold text-rose-300">
                                Before / Pre-Op #{index + 1}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Body - Medical tab */}
                {activeTab === 'medical' && (
                  <div className="px-4 sm:px-6 py-4 space-y-5 overflow-y-auto overflow-x-hidden max-h-[60vh] max-sm:max-h-[calc(92vh-170px)] scrollbar-none flex-1">
                    {/* Next Appointment */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider font-sans">Next Appointment / Follow-up</span>
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 font-medium mb-1.5 uppercase tracking-wider">Next Visit Date</label>
                        <input
                          type="date"
                          value={form.vitals?.nextVisitDate || ''}
                          onChange={(e) => {
                            handleChange('vitals', { ...form.vitals, nextVisitDate: e.target.value });
                          }}
                          className="w-full px-3 py-2 rounded-lg text-[12.5px] text-slate-700 bg-white border border-slate-200 outline-none transition-all duration-150 focus:ring-1 focus:ring-indigo-500"
                        />
                        <p className="text-[9.5px] text-slate-400 mt-1">Leave blank to use care program defaults, or set manually to override them.</p>
                      </div>
                    </div>

                    {/* After Photos Section (Optional) */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-3 font-sans">
                      <div>
                        <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider font-sans">After Photos (Optional)</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">Attach clinical photographs showing teeth condition after consultation/treatment</p>
                      </div>

                      {/* Uploader dropzone */}
                      {/* Uploader options */}
                      <div className="grid grid-cols-2 gap-3 w-full">
                        <label className="border border-dashed border-slate-200 hover:border-indigo-500 bg-white hover:bg-indigo-50/[0.04] rounded-xl py-4 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all duration-150 group">
                          <Upload size={16} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                          <span className="text-[11px] font-bold text-slate-600 group-hover:text-slate-800 transition-colors">Choose from Gallery</span>
                          <span className="text-[9px] text-slate-400">Upload existing photos</span>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleAfterPhotoUpload}
                            className="hidden"
                          />
                        </label>
                        <label className="border border-dashed border-slate-200 hover:border-indigo-500 bg-white hover:bg-indigo-50/[0.04] rounded-xl py-4 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all duration-150 group">
                          <Camera size={16} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                          <span className="text-[11px] font-bold text-slate-600 group-hover:text-slate-800 transition-colors">Take Photo (Camera)</span>
                          <span className="text-[9px] text-slate-400">Capture live post-op photo</span>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            capture="environment"
                            onChange={handleAfterPhotoUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Photo Grid */}
                      {form.afterPhotos && form.afterPhotos.length > 0 && (
                        <div className="grid grid-cols-2 gap-3 mt-2">
                          {form.afterPhotos.map((photo, index) => (
                            <div key={index} className="relative aspect-[16/11] rounded-xl overflow-hidden border border-slate-200 bg-neutral-900 group">
                              <img src={photo} alt={`After treatment ${index + 1}`} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity duration-150">
                                <button
                                  type="button"
                                  onClick={() => setLightboxImg(photo)}
                                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white flex items-center justify-center transition-colors"
                                >
                                  <Eye size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveAfterPhoto(index)}
                                  className="w-8 h-8 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-400 flex items-center justify-center transition-colors"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                              <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 border border-white/10 text-[9px] font-bold text-emerald-300">
                                After / Post-Op #{index + 1}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                    </div>



                    {/* Prescription (Rx) Editor */}
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-sm">
                      {/* Prescription Header */}
                      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[14px] font-bold text-slate-800 font-sans">
                            Prescription 
                            <span className="text-slate-400 font-medium ml-1.5 text-[12px]">
                              ({(form.prescription || '').split('\n').filter(l => l.trim()).length} items)
                            </span>
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setIsEditingRawPrescription(!isEditingRawPrescription)}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border bg-white border-slate-200 text-indigo-600 hover:bg-indigo-50/50 hover:border-indigo-200 transition-all"
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
                            {isEditingRawPrescription ? 'View List' : 'Edit notes'}
                          </button>
                          
                          <button
                            type="button"
                            onClick={generateDefaultPDF}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                          >
                            <svg className="w-3 h-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 1.503a1.5 1.5 0 01-1.488 1.727H7.599a1.5 1.5 0 01-1.488-1.727L6.34 18m11.32 0a2.01 2.01 0 01-.192-.612l-.646-4.243a2.01 2.01 0 011.08-2.01L19.5 9.5M6.34 18a2.01 2.01 0 00.192-.612l.646-4.243a2.01 2.01 0 00-1.08-2.01L4.5 9.5M19.5 9.5A2.25 2.25 0 0017.25 7.25H6.75A2.25 2.25 0 004.5 9.5m15 0v.115a8.32 8.32 0 01-.115 1.357m-14.77 0A8.32 8.32 0 014.5 9.615V9.5m11.25-3.5V5.25a2.25 2.25 0 00-2.25-2.25h-3A2.25 2.25 0 008.25 5.25v1.25" /></svg>
                            Print Rx
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm("Are you sure you want to clear the entire prescription?")) {
                                handleChange('prescription', '');
                                toast.success("Prescription cleared");
                              }
                            }}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border bg-white border-slate-200 text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-all shadow-sm"
                          >
                            <Trash2 size={11} className="text-rose-500" />
                            <span>Clear</span>
                          </button>
                        </div>
                      </div>

                      {/* Raw Editor Textarea (Toggled via Edit notes) */}
                      {isEditingRawPrescription ? (
                        <textarea
                          rows={6}
                          value={form.prescription || ''}
                          onChange={(e) => handleChange('prescription', e.target.value)}
                          placeholder="Prescription details will appear here..."
                          className="w-full px-3.5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-[12.5px] font-mono leading-relaxed text-slate-700 outline-none focus:ring-2 focus:ring-indigo-400/20 focus:border-indigo-400 transition-all resize-none"
                        />
                      ) : (
                        /* Beautiful Interactive Mockup List */
                        <div className="space-y-2">
                          {(() => {
                            const current = form.prescription || '';
                            const lines = current.split('\n').map(l => l.trim()).filter(Boolean);
                            if (lines.length === 0) {
                              return (
                                <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl bg-slate-50/30 text-slate-400 text-[11.5px] flex flex-col items-center justify-center gap-1.5">
                                  <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" /></svg>
                                  <span>No prescription items added. Use presets below.</span>
                                </div>
                              );
                            }

                            // Show only first 2 items if collapsed
                            const visibleLines = rxCollapseDetails ? lines.slice(0, 2) : lines;

                            return (
                              <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100 shadow-sm bg-white">
                                {visibleLines.map((line, idx) => {
                                  // Clean bullet points
                                  const cleaned = line.replace(/^[•\s\-\*]+/, '').trim();
                                  const parts = cleaned.split(/\s*-\s*/);
                                  let name = cleaned;
                                  let instructions = 'Take as directed';
                                  let duration = '';

                                  if (parts.length >= 2) {
                                    name = parts[0];
                                    const rest = parts.slice(1).join(' - ');
                                    const durationMatch = rest.match(/for (\d+\s*days?|SOS)/i);
                                    if (durationMatch) {
                                      duration = durationMatch[1];
                                      instructions = rest.replace(new RegExp(`\\s*for\\s*${durationMatch[1]}`, 'i'), '').trim();
                                    } else {
                                      instructions = rest;
                                    }
                                  } else {
                                    const durationMatch = cleaned.match(/for (\d+\s*days?|SOS)/i);
                                    if (durationMatch) {
                                      duration = durationMatch[1];
                                      name = cleaned.replace(new RegExp(`\\s*for\\s*${durationMatch[1]}`, 'i'), '').trim();
                                    }
                                  }

                                  // Format duration label
                                  let durationLabel = duration || 'SOS';
                                  if (/^\d+/.test(durationLabel)) {
                                    const num = durationLabel.match(/\d+/)?.[0];
                                    durationLabel = `${num} Days`;
                                  }

                                  return (
                                    <div key={idx} className="flex items-center justify-between p-3.5 bg-white hover:bg-slate-50/50 transition-colors gap-3 border-l-[3.5px] border-emerald-500 rounded-lg border border-slate-100/60 shadow-sm">
                                      <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-[12px] font-bold flex items-center justify-center shrink-0 leading-none">
                                          {idx + 1}
                                        </div>
                                        <div className="min-w-0">
                                          <h5 className="text-[13px] font-bold text-slate-800 truncate leading-snug">{name}</h5>
                                          <p className="text-[11px] text-slate-500 font-medium leading-none mt-1">{instructions}</p>
                                        </div>
                                      </div>
                                      
                                      <div className="flex items-center gap-2.5 shrink-0">
                                        <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-indigo-600 bg-indigo-50/70 border border-indigo-100/40">
                                          {durationLabel}
                                        </span>
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <button
                                              type="button"
                                              className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                                            >
                                              <MoreVertical size={16} />
                                            </button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end" className="z-[40000]">
                                            <DropdownMenuItem
                                              className="text-rose-600 focus:text-rose-600 focus:bg-rose-50 cursor-pointer font-semibold text-[12px]"
                                              onClick={() => {
                                                const allLines = (form.prescription || '').split('\n');
                                                const actualIdx = allLines.findIndex(l => l.trim() === line);
                                                if (actualIdx !== -1) {
                                                  const updated = allLines.filter((_, i) => i !== actualIdx);
                                                  handleChange('prescription', updated.join('\n'));
                                                }
                                                toast.success("Prescription item deleted");
                                              }}
                                            >
                                              <Trash2 size={12} className="mr-1.5" /> Delete Item
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      </div>
                                    </div>
                                  );
                                })}

                                {lines.length > 2 && (
                                  <button
                                    type="button"
                                    onClick={() => setRxCollapseDetails(!rxCollapseDetails)}
                                    className="w-full py-2 bg-slate-50/50 hover:bg-slate-50 text-[10px] font-bold text-slate-500 hover:text-slate-700 flex items-center justify-center gap-1 transition-colors border-t border-slate-100"
                                  >
                                    <svg className={`w-3.5 h-3.5 transform transition-transform ${rxCollapseDetails ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                                    {rxCollapseDetails ? 'Show details' : 'Hide details'}
                                  </button>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      )}
                      {/* Prescription Preset Suggestions */}
                      {(() => {
                        const rxMedCategories = ['Pain killers', 'Antibiotics', 'Multivitamins', 'Toothpaste', 'Mouthwash', 'Gels', 'Gas/Acidity', 'Others'];
                        let rxMedList = medicationsList.length > 0 ? medicationsList : [
                          { label: 'Amoxicillin 500mg', text: '• Tab. Amoxicillin 500mg - 1 cap thrice daily for 5 days', category: 'Antibiotics' },
                          { label: 'Paracetamol 650mg', text: '• Tab. Paracetamol 650mg - 1 tab SOS for pain', category: 'Pain killers' },
                          { label: 'Zerodol-SP', text: '• Tab. Zerodol-SP - 1 tab twice daily for 3 days', category: 'Pain killers' },
                          { label: 'Pantocid 40mg', text: '• Tab. Pantocid 40mg - 1 tab once daily before food', category: 'Gas/Acidity' },
                          { label: 'Hexidine Mouthwash', text: '• Hexidine Mouthwash - rinse twice daily for 7 days', category: 'Mouthwash' },
                          { label: 'Mox-CL 625mg', text: '• Tab. Mox-CL 625mg - 1 tab twice daily for 5 days', category: 'Antibiotics' },
                          { label: 'Ketorol-DT', text: '• Tab. Ketorol-DT - 1 tab dissolved in water SOS', category: 'Pain killers' },
                          { label: 'Sensodyne Toothpaste', text: '• Sensodyne Toothpaste - brush twice daily for sensitive teeth', category: 'Toothpaste' },
                          { label: 'Metrogyl ER', text: '• Tab. Metrogyl ER - 1 tab twice daily for 5 days', category: 'Antibiotics' },
                          { label: 'Flagyl ER', text: '• Tab. Flagyl ER - 1 tab twice daily for 5 days', category: 'Antibiotics' },
                          { label: 'Augmentin 625mg', text: '• Tab. Augmentin 625mg - 1 tab twice daily for 5 days', category: 'Antibiotics' },
                          { label: 'Clavam 625mg', text: '• Tab. Clavam 625mg - 1 tab twice daily for 5 days', category: 'Antibiotics' },
                          { label: 'Indclav 625mg', text: '• Tab. Indclav 625mg - 1 tab twice daily for 5 days', category: 'Antibiotics' },
                          { label: 'Mox CV 625mg', text: '• Tab. Mox CV 625mg - 1 tab twice daily for 5 days', category: 'Antibiotics' },
                          { label: 'Zocef CV 250mg', text: '• Tab. Zocef CV 250mg - 1 tab twice daily for 5 days', category: 'Antibiotics' },
                          { label: 'Sporidex CV 200mg', text: '• Tab. Sporidex CV 200mg - 1 tab twice daily for 5 days', category: 'Antibiotics' },
                          { label: 'Zymoflam D', text: '• Tab. Zymoflam D - 1 tab twice daily for 5 days', category: 'Pain killers' },
                          { label: 'Intagesic', text: '• Tab. Intagesic - 1 tab twice daily for 5 days', category: 'Pain killers' },
                          { label: 'Lysoflam', text: '• Tab. Lysoflam - 1 tab twice daily for 5 days', category: 'Pain killers' },
                          { label: 'Gudgesic SP', text: '• Tab. Gudgesic SP - 1 tab twice daily for 5 days', category: 'Pain killers' },
                          { label: 'Enzoflam', text: '• Tab. Enzoflam - 1 tab twice daily for 5 days', category: 'Pain killers' },
                          { label: 'Clohex ADS M/W', text: '• Clohex ADS Mouthwash - rinse twice daily for 7 days', category: 'Mouthwash' },
                          { label: 'Vantej Aqua M/W', text: '• Vantej Aqua Mouthwash - rinse twice daily for 7 days', category: 'Mouthwash' },
                          { label: 'Hydent 360 M/W', text: '• Hydent 360 Mouthwash - rinse twice daily for 7 days', category: 'Mouthwash' },
                          { label: 'Coolora M/W', text: '• Coolora Mouthwash - rinse twice daily for 7 days', category: 'Mouthwash' },
                          { label: 'Corahex M/W', text: '• Corahex Mouthwash - rinse twice daily for 7 days', category: 'Mouthwash' },
                          { label: 'Paloxide M/W', text: '• Paloxide Mouthwash - rinse twice daily for 7 days', category: 'Mouthwash' },
                          { label: 'Xyon-C M/W', text: '• Xyon-C Mouthwash - rinse twice daily for 7 days', category: 'Mouthwash' },
                          { label: 'Gumex Gum Paint', text: '• Gumex Gum Paint - apply on gums thrice daily', category: 'Mouthwash' },
                          { label: 'Logum Gel', text: '• Logum Gel - apply on painful ulcers/areas 10 minutes before food', category: 'Gels' },
                          { label: 'Metrogyl DG Gel', text: '• Metrogyl DG Gel - massage gently on gums twice daily after brushing', category: 'Gels' },
                          { label: 'Turbocoat Gel', text: '• Turbocoat Gel - apply on sensitive areas once daily after brushing', category: 'Gels' },
                          { label: 'Vantej Toothpaste', text: '• Vantej Toothpaste - brush twice daily', category: 'Toothpaste' },
                          { label: 'Reguard Toothpaste', text: '• Reguard Toothpaste - brush twice daily', category: 'Toothpaste' },
                          { label: 'Perioguard Toothpaste', text: '• Perioguard Toothpaste - brush twice daily', category: 'Toothpaste' },
                          { label: 'Hydent K Toothpaste', text: '• Hydent K Toothpaste - brush twice daily', category: 'Toothpaste' },
                          { label: 'Glister Toothpaste', text: '• Glister Toothpaste - brush twice daily', category: 'Toothpaste' },
                          { label: 'Snowdent Toothpaste', text: '• Snowdent Toothpaste - brush twice daily', category: 'Toothpaste' },
                          { label: 'Remin Toothpaste', text: '• Remin Toothpaste - brush twice daily', category: 'Toothpaste' },
                          { label: 'Toothmin Toothpaste', text: '• Toothmin Toothpaste - brush twice daily', category: 'Toothpaste' },
                          { label: 'Enzoflam CT', text: '• Tab. Enzoflam CT - 1 tab twice daily for 5 days', category: 'Pain killers' },
                          { label: 'Rantac RD', text: '• Tab. Rantac RD - 1 tab twice daily before food', category: 'Gas/Acidity' },
                          { label: 'Ranidom-DOM', text: '• Tab. Ranidom-DOM - 1 tab twice daily before food', category: 'Gas/Acidity' },
                          { label: 'Pan-40', text: '• Tab. Pan-40 - 1 tab once daily before food', category: 'Gas/Acidity' },
                          { label: 'Cyra-D', text: '• Tab. Cyra-D - 1 tab once daily before food', category: 'Gas/Acidity' },
                          { label: 'Rabeprazole 20mg', text: '• Tab. Rabeprazole 20mg - 1 tab once daily before food', category: 'Gas/Acidity' },
                          { label: 'Lycowonder', text: '• Tab. Lycowonder - 1 tab once daily', category: 'Multivitamins' },
                          { label: 'Lycowonder Forte', text: '• Tab. Lycowonder Forte - 1 tab once daily', category: 'Multivitamins' },
                          { label: 'Fibrowonder Multi Tab', text: '• Tab. Fibrowonder Multi Tab - 1 tab once daily', category: 'Multivitamins' },
                          { label: 'Gurodol Mouthwash', text: '• Gurodol Mouthwash - rinse twice daily', category: 'Mouthwash' },
                          { label: 'Rinse Off Mouthwash', text: '• Rinse Off Mouthwash - rinse twice daily', category: 'Mouthwash' },
                          { label: 'Rexidin SRS Mouthwash', text: '• Rexidin SRS Mouthwash - rinse twice daily', category: 'Mouthwash' },
                          { label: 'Keebiotic Tab', text: '• Tab. Keebiotic - 1 tab twice daily for 5 days', category: 'Antibiotics' },
                          { label: 'Rexidine Mouthwash', text: '• Rexidine Mouthwash - rinse twice daily', category: 'Mouthwash' },
                          { label: 'Gumsun Gum Paint', text: '• Gumsun Gum Paint - apply on gums thrice daily', category: 'Gels' },
                          { label: 'Paradontox Toothpaste', text: '• Paradontox Toothpaste - brush twice daily', category: 'Toothpaste' },
                          { label: 'Zyclav 375mg', text: '• Tab. Zyclav 375mg - 1 tab twice daily for 5 days', category: 'Antibiotics' }
                        ];
                        if (medicationsList.length === 0) {
                          try {
                            const raw = localStorage.getItem(`clinic_medications_${_orgId}`);
                            if (raw) {
                              const parsed = JSON.parse(raw);
                              if (Array.isArray(parsed) && parsed.length > 0) {
                                rxMedList = parsed;
                              }
                            }
                          } catch (e) { /* ignore */ }
                        }
                        rxMedList = migrateMedications(rxMedList);
                        const rxGrouped: { [key: string]: any[] } = {};
                        rxMedCategories.forEach(cat => { rxGrouped[cat] = []; });
                        rxMedList.forEach(med => {
                          const cat = med.category || 'Others';
                          if (!rxGrouped[cat]) rxGrouped[cat] = [];
                          rxGrouped[cat].push(med);
                        });
                        const filteredMeds = rxMedList.filter(med => {
                          const matchesCat = selectedRxCategory === 'All' || med.category === selectedRxCategory;
                          const matchesSearch = !searchRxQuery.trim() || 
                            med.label.toLowerCase().includes(searchRxQuery.toLowerCase()) || 
                            (med.text || '').toLowerCase().includes(searchRxQuery.toLowerCase());
                          return matchesCat && matchesSearch;
                        });

                        const currentPrescription = form.prescription || '';
                        const prescriptionLines = currentPrescription.split('\n');
                        const lastLine = prescriptionLines[prescriptionLines.length - 1] || '';

                        let activeDays = '';
                        const daysMatch = lastLine.match(/for (\d+)\s*days?/i);
                        if (daysMatch) {
                          activeDays = daysMatch[1];
                        } else if (/SOS/i.test(lastLine) && !/once|twice|thrice|four/i.test(lastLine)) {
                          activeDays = 'SOS';
                        }

                        let activeFreq = '';
                        if (/once daily/i.test(lastLine)) activeFreq = 'once daily';
                        else if (/twice daily/i.test(lastLine)) activeFreq = 'twice daily';
                        else if (/thrice daily/i.test(lastLine)) activeFreq = 'thrice daily';
                        else if (/four times daily/i.test(lastLine)) activeFreq = 'four times daily';
                        else if (/SOS/i.test(lastLine)) activeFreq = 'SOS';

                        const catConfig: Record<string, { icon: string; activeBg: string; activeText: string; cardAccent: string; cardHover: string; countBg: string; countText: string; circleBg: string; iconColor: string }> = {
                          'Pain killers': { icon: '💊', activeBg: 'bg-rose-600', activeText: 'text-white', cardAccent: 'border-l-rose-400', cardHover: 'hover:bg-rose-50/40 hover:border-rose-200', countBg: 'bg-rose-100', countText: 'text-rose-600', circleBg: 'bg-rose-50', iconColor: 'text-rose-500' },
                          'Antibiotics': { icon: '🦠', activeBg: 'bg-amber-600', activeText: 'text-white', cardAccent: 'border-l-amber-400', cardHover: 'hover:bg-amber-50/40 hover:border-amber-200', countBg: 'bg-amber-100', countText: 'text-amber-600', circleBg: 'bg-amber-50', iconColor: 'text-amber-500' },
                          'Multivitamins': { icon: '✨', activeBg: 'bg-emerald-600', activeText: 'text-white', cardAccent: 'border-l-emerald-400', cardHover: 'hover:bg-emerald-50/40 hover:border-emerald-200', countBg: 'bg-emerald-100', countText: 'text-emerald-600', circleBg: 'bg-emerald-50', iconColor: 'text-emerald-500' },
                          'Toothpaste': { icon: '🦷', activeBg: 'bg-sky-600', activeText: 'text-white', cardAccent: 'border-l-sky-400', cardHover: 'hover:bg-sky-50/40 hover:border-sky-200', countBg: 'bg-sky-100', countText: 'text-sky-600', circleBg: 'bg-sky-50', iconColor: 'text-sky-500' },
                          'Mouthwash': { icon: '💧', activeBg: 'bg-teal-600', activeText: 'text-white', cardAccent: 'border-l-teal-400', cardHover: 'hover:bg-teal-50/40 hover:border-teal-200', countBg: 'bg-teal-100', countText: 'text-teal-600', circleBg: 'bg-teal-50', iconColor: 'text-teal-500' },
                          'Gels': { icon: '🧴', activeBg: 'bg-violet-600', activeText: 'text-white', cardAccent: 'border-l-violet-400', cardHover: 'hover:bg-violet-50/40 hover:border-violet-200', countBg: 'bg-violet-100', countText: 'text-violet-600', circleBg: 'bg-violet-50', iconColor: 'text-violet-500' },
                          'Gas/Acidity': { icon: '🔥', activeBg: 'bg-orange-600', activeText: 'text-white', cardAccent: 'border-l-orange-400', cardHover: 'hover:bg-orange-50/40 hover:border-orange-200', countBg: 'bg-orange-100', countText: 'text-orange-600', circleBg: 'bg-orange-50', iconColor: 'text-orange-500' },
                          'Others': { icon: '📋', activeBg: 'bg-slate-600', activeText: 'text-white', cardAccent: 'border-l-slate-400', cardHover: 'hover:bg-slate-50/50 hover:border-slate-300', countBg: 'bg-slate-100', countText: 'text-slate-600', circleBg: 'bg-slate-50', iconColor: 'text-slate-500' },
                        };

                        const getCardConfig = (cat: string) => catConfig[cat] || catConfig['Others'];

                        // Custom mock AI write
                        const runAIWrite = () => {
                          const query = prompt("What diagnosis / symptom is this prescription for? (e.g. Swelling, Wisdom tooth pain, Ulcers):");
                          if (!query) return;
                          
                          let suggestedMeds: any[] = [];
                          const cleanQuery = query.toLowerCase();
                          
                          if (cleanQuery.includes('swel') || cleanQuery.includes('infect') || cleanQuery.includes('pus') || cleanQuery.includes('absce')) {
                            suggestedMeds = [
                              rxMedList.find(m => m.label.includes('Amoxicillin')) || rxMedList[0],
                              rxMedList.find(m => m.label.includes('Zerodol-SP')) || rxMedList[2],
                              rxMedList.find(m => m.label.includes('Pan-40')) || rxMedList.find(m => m.label.includes('Pantocid')) || rxMedList[3]
                            ];
                            toast.success("AI generated prescription for dental infection/swelling!");
                          } else if (cleanQuery.includes('wisdom') || cleanQuery.includes('extraction') || cleanQuery.includes('remov')) {
                            suggestedMeds = [
                              rxMedList.find(m => m.label.includes('Mox-CL')) || rxMedList[5],
                              rxMedList.find(m => m.label.includes('Ketorol-DT')) || rxMedList[6],
                              rxMedList.find(m => m.label.includes('Pan-40')) || rxMedList[3],
                              rxMedList.find(m => m.label.includes('Hexidine')) || rxMedList[4]
                            ];
                            toast.success("AI generated post-extraction prescription!");
                          } else if (cleanQuery.includes('ulcer') || cleanQuery.includes('sore') || cleanQuery.includes('aphth')) {
                            suggestedMeds = [
                              rxMedList.find(m => m.label.includes('Logum')) || rxMedList.find(m => m.category === 'Gels') || rxMedList[29],
                              rxMedList.find(m => m.category === 'Multivitamins') || rxMedList[46]
                            ];
                            toast.success("AI generated prescription for mouth ulcers!");
                          } else if (cleanQuery.includes('sensitiv') || cleanQuery.includes('cold') || cleanQuery.includes('hot')) {
                            suggestedMeds = [
                              rxMedList.find(m => m.label.includes('Sensodyne')) || rxMedList.find(m => m.category === 'Toothpaste') || rxMedList[7],
                              rxMedList.find(m => m.label.includes('Hexidine')) || rxMedList[4]
                            ];
                            toast.success("AI generated prescription for teeth sensitivity!");
                          } else {
                            suggestedMeds = [
                              rxMedList.find(m => m.label.includes('Paracetamol')) || rxMedList[1]
                            ];
                            toast.success("AI suggested standard pain relief.");
                          }

                          if (suggestedMeds.length > 0) {
                            const newText = suggestedMeds.map(m => m.text).join('\n');
                            const current = form.prescription || '';
                            handleChange('prescription', current ? `${current.trim()}\n${newText}` : newText);
                          }
                        };

                        // Template Selector popover/handler
                        const applyTemplate = () => {
                          const selection = prompt(
                            "Select prescription template:\n1. Post-Extraction Protocol (Mox-CL + Ketorol-DT + Pan-40 + Mouthwash)\n2. Standard Antibiotic & Pain Relief (Amox 500 + Zerodol-SP + Rantac)\n3. Ulcer Healing Pack (Logum Gel + Multivitamins)\n4. Tooth Sensitivity Routine (Sensodyne + Mouthwash)\nEnter number (1-4):"
                          );
                          if (!selection) return;

                          let templateText = '';
                          if (selection === '1') {
                            templateText = "• Tab. Mox-CL 625mg - 1 tab twice daily for 5 days\n• Tab. Ketorol-DT - 1 tab dissolved in water SOS\n• Tab. Pan-40 - 1 tab once daily before food\n• Hexidine Mouthwash - rinse twice daily for 7 days";
                            toast.success("Applied Post-Extraction Protocol template!");
                          } else if (selection === '2') {
                            templateText = "• Tab. Amoxicillin 500mg - 1 cap thrice daily for 5 days\n• Tab. Zerodol-SP - 1 tab twice daily for 3 days\n• Tab. Pantocid 40mg - 1 tab once daily before food";
                            toast.success("Applied Antibiotic & Pain Relief template!");
                          } else if (selection === '3') {
                            templateText = "• Logum Gel - apply on painful ulcers/areas 10 minutes before food\n• Tab. Lycowonder - 1 tab once daily";
                            toast.success("Applied Ulcer Healing template!");
                          } else if (selection === '4') {
                            templateText = "• Sensodyne Toothpaste - brush twice daily for sensitive teeth\n• Hexidine Mouthwash - rinse twice daily for 7 days";
                            toast.success("Applied Sensitivity Routine template!");
                          } else {
                            toast.error("Invalid choice.");
                            return;
                          }

                          const current = form.prescription || '';
                          handleChange('prescription', current ? `${current.trim()}\n${templateText}` : templateText);
                        };

                        // Custom add medication preset
                        const addNewCustomMed = () => {
                          const label = prompt("Enter medicine name (e.g. Paracetamol 650mg):");
                          if (!label) return;
                          const text = prompt("Enter prescription text:", `• Tab. ${label} - 1 tab twice daily for 5 days`);
                          if (!text) return;
                          const category = prompt("Enter category (Pain killers, Antibiotics, Multivitamins, Toothpaste, Mouthwash, Gels, Gas/Acidity, Others):", "Others");
                          const priceStr = prompt("Enter medicine price (₹):", "0");
                          const price = Number(priceStr) || 0;
                          
                          const newMed = { label, text, category: category || 'Others', price };
                          setMedicationsList(prev => [...prev, newMed]);
                          // Save to local storage
                          try {
                            const raw = localStorage.getItem(`clinic_medications_${_orgId}`);
                            const current = raw ? JSON.parse(raw) : [];
                            localStorage.setItem(`clinic_medications_${_orgId}`, JSON.stringify([...current, newMed]));
                          } catch (e) {}
                          toast.success(`${label} added to presets!`);
                        };

                        return (
                          <div className="space-y-4">
                            {/* Quick Modify (Last Line) Section */}
                            {lastLine.trim() && (
                              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-3.5 shadow-sm">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-[12px] font-bold text-slate-700 font-sans">
                                    Quick Modify <span className="text-slate-400 font-medium">(Last Line)</span>
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      toast.info("Dosage frequency auto-synced with duration.");
                                    }}
                                    className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-lg px-2.5 py-1 transition-all flex items-center gap-1 cursor-pointer"
                                  >
                                    <Sparkles size={11} className="text-indigo-500 animate-pulse" />
                                    <span>Smart Suggestions</span>
                                  </button>
                                </div>
                                
                                <div className="space-y-2.5">
                                  {/* Duration Row */}
                                  <div>
                                    <span className="block text-[9.5px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Duration</span>
                                    <div className="flex flex-wrap gap-1.5">
                                      {['1', '2', '3', '4', '5', '7', '10', 'SOS'].map(d => {
                                        const isActive = activeDays === d;
                                        return (
                                          <button
                                            key={d}
                                            type="button"
                                            onClick={() => {
                                              const newDays = d;
                                              const current = form.prescription || '';
                                              if (!current.trim()) return;
                                              const lines = current.split('\n');
                                              const lastLine = lines[lines.length - 1];
                                              let updatedLine = lastLine;
                                              
                                              if (newDays === 'SOS') {
                                                if (/for \d+ days/i.test(lastLine)) {
                                                  updatedLine = lastLine.replace(/\s*for \d+ days/i, '');
                                                }
                                                if (!/SOS/i.test(lastLine)) {
                                                  updatedLine = `${updatedLine} SOS`;
                                                }
                                              } else {
                                                if (/for \d+ days/i.test(lastLine)) {
                                                  updatedLine = lastLine.replace(/for \d+ days/i, `for ${newDays} days`);
                                                } else if (/SOS/i.test(lastLine)) {
                                                  updatedLine = lastLine.replace(/SOS/i, `for ${newDays} days`);
                                                } else {
                                                  updatedLine = `${lastLine} for ${newDays} days`;
                                                }
                                              }
                                              if (updatedLine !== lastLine) {
                                                lines[lines.length - 1] = updatedLine;
                                                handleChange('prescription', lines.join('\n'));
                                              }
                                            }}
                                            className={`px-3 py-1 rounded-xl text-[10.5px] font-semibold transition-all border ${
                                              isActive 
                                                ? 'bg-indigo-600 border-transparent text-white shadow-sm scale-105' 
                                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                                            }`}
                                          >
                                            {d === 'SOS' ? 'SOS' : `${d}D`}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>

                                  {/* Frequency / Dosage Row */}
                                  <div>
                                    <span className="block text-[9.5px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Dosage</span>
                                    <div className="flex flex-wrap gap-1.5">
                                      {[
                                        { label: 'OD', sub: '1-0-0', value: 'once daily' },
                                        { label: 'BD', sub: '1-0-1', value: 'twice daily' },
                                        { label: 'TDS', sub: '1-1-1', value: 'thrice daily' },
                                        { label: 'QID', sub: '1-1-1-1', value: 'four times daily' },
                                        { label: 'QID', sub: '2-2-2-2', value: '2-2-2-2' },
                                        { label: 'SOS', sub: 'SOS', value: 'SOS' }
                                      ].map(f => {
                                        const isActive = activeFreq === f.value || lastLine.includes(f.sub);
                                        return (
                                          <button
                                            key={f.label + '-' + f.sub}
                                            type="button"
                                            onClick={() => {
                                              const newFreq = f.value;
                                              const current = form.prescription || '';
                                              if (!current.trim()) return;
                                              const lines = current.split('\n');
                                              const lastLine = lines[lines.length - 1];
                                              let updatedLine = lastLine;
                                              
                                              if (/(once|twice|thrice|four times)\s+daily/i.test(lastLine)) {
                                                updatedLine = lastLine.replace(/(once|twice|thrice|four times)\s+daily/i, newFreq);
                                              } else if (/1-0-0|1-0-1|1-1-1|1-1-1-1|2-2-2-2/i.test(lastLine)) {
                                                updatedLine = lastLine.replace(/1-0-0|1-0-1|1-1-1|1-1-1-1|2-2-2-2/i, f.sub);
                                              } else if (/SOS/i.test(lastLine)) {
                                                updatedLine = lastLine.replace(/SOS/i, newFreq);
                                              } else {
                                                updatedLine = `${lastLine} - ${f.sub}`;
                                              }
                                              if (updatedLine !== lastLine) {
                                                lines[lines.length - 1] = updatedLine;
                                                handleChange('prescription', lines.join('\n'));
                                              }
                                            }}
                                            className={`flex flex-col items-center justify-center px-3.5 py-1 rounded-xl border text-center transition-all min-w-[55px] ${
                                              isActive 
                                                ? 'bg-indigo-600 border-transparent text-white shadow-sm scale-105' 
                                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                                            }`}
                                          >
                                            <span className="text-[10px] font-bold leading-none">{f.label}</span>
                                            <span className={`text-[7.5px] font-medium font-mono leading-none mt-0.5 ${isActive ? 'text-white/80' : 'text-slate-400'}`}>{f.sub}</span>
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Search and Categories Filter */}
                            <div className="space-y-3">
                              {/* Search bar with Microphone icon matching mockup */}
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                                </span>
                                <input
                                  type="text"
                                  value={searchRxQuery}
                                  onChange={(e) => setSearchRxQuery(e.target.value)}
                                  placeholder="Search medicines (e.g. Paracetamol)"
                                  className="w-full pl-9 pr-9 py-2 bg-slate-50/50 border border-slate-200/80 rounded-xl text-[12px] text-slate-700 outline-none focus:ring-2 focus:ring-indigo-400/20 focus:border-indigo-400 shadow-sm placeholder:text-slate-400 transition-all font-sans"
                                />
                                {searchRxQuery ? (
                                  <button
                                    type="button"
                                    onClick={() => setSearchRxQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                                  >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => toggleFieldScribe('prescription')}
                                    className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${
                                      activeFieldRecording === 'prescription' ? 'text-rose-500 animate-pulse' : 'text-slate-400 hover:text-indigo-600'
                                    }`}
                                    title="Voice Search Rx"
                                  >
                                    <Mic size={14} />
                                  </button>
                                )}
                              </div>

                              {/* Category pills row - rounded capsules scrollable */}
                              <div className="flex gap-2 overflow-x-auto pb-1 select-none scrollbar-none" style={{ scrollbarWidth: 'none' }}>
                                {/* All button */}
                                <button
                                  type="button"
                                  onClick={() => setSelectedRxCategory('All')}
                                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all border flex-shrink-0 ${
                                    selectedRxCategory === 'All'
                                      ? 'bg-indigo-600 border-transparent text-white shadow-sm'
                                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-355'
                                  }`}
                                >
                                  <span>All</span>
                                  <span className={`text-[8.5px] font-bold rounded-full px-1 min-w-[15px] text-center leading-[13px] ${selectedRxCategory === 'All' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}>{rxMedList.length}</span>
                                </button>
                                {rxMedCategories.map(cat => {
                                  const cfg = catConfig[cat] || catConfig['Others'];
                                  const count = (rxGrouped[cat] || []).length;
                                  const isActive = selectedRxCategory === cat;
                                  return (
                                    <button
                                      key={cat}
                                      type="button"
                                      onClick={() => setSelectedRxCategory(isActive ? 'All' : cat)}
                                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all border flex-shrink-0 ${
                                        isActive
                                          ? 'bg-indigo-600 border-transparent text-white shadow-sm'
                                          : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-355'
                                      }`}
                                    >
                                      <span>{cat}</span>
                                      {count > 0 && (
                                        <span className={`text-[8.5px] font-bold rounded-full px-1 min-w-[15px] text-center leading-[13px] ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}>{count}</span>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Preset Medicines Mockup-style Clickable Grid */}
                            <div className="max-h-[220px] overflow-y-auto rounded-xl border border-slate-100 bg-slate-50/20 p-2 scrollbar-thin" style={{ scrollbarWidth: 'thin' }}>
                              {filteredMeds.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-slate-400 gap-2">
                                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                                  <p className="text-[11px]">No medicines found.</p>
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {filteredMeds.map((med, idx) => {
                                    const cfg = getCardConfig(med.category);
                                    
                                    // Map custom icons based on categories
                                    let circleIcon = "💊";
                                    if (med.category === 'Toothpaste') circleIcon = "🦷";
                                    else if (med.category === 'Mouthwash') circleIcon = "💧";
                                    else if (med.category === 'Antibiotics') circleIcon = "🦠";
                                    else if (med.category === 'Gels') circleIcon = "🧴";
                                    else if (med.category === 'Gas/Acidity') circleIcon = "🔥";
                                    else if (med.category === 'Multivitamins') circleIcon = "✨";

                                    return (
                                      <div
                                        key={idx}
                                        className="bg-white border border-slate-100 rounded-xl p-2.5 flex items-center justify-between gap-3 shadow-sm hover:shadow transition-shadow group"
                                      >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                          {/* Circle icon with background color */}
                                          <div className={`w-8 h-8 rounded-full ${cfg.circleBg} ${cfg.iconColor} flex items-center justify-center text-sm shrink-0 border border-slate-100/50`}>
                                            {circleIcon}
                                          </div>
                                          
                                          <div className="min-w-0">
                                            <h6 className="text-[11.5px] font-bold text-slate-800 truncate leading-snug">{highlightMatch(med.label, searchRxQuery)}</h6>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                              <span className="inline-block text-[8.5px] font-semibold text-slate-400 bg-slate-50 border border-slate-100 rounded px-1.5 py-0.5 leading-none uppercase tracking-wider">
                                                {med.category}
                                              </span>
                                              {med.price > 0 && (
                                                <span className="inline-block text-[8.5px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded px-1.5 py-0.5 leading-none font-mono">
                                                  ₹{med.price}
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        </div>

                                        {(() => {
                                          const currentPrescription = form.prescription || '';
                                          const prescriptionLines = currentPrescription.split('\n').filter(l => l.trim());
                                          const isAlreadyAdded = prescriptionLines.some(line => 
                                            line.toLowerCase().includes(med.label.toLowerCase())
                                          );

                                          if (isAlreadyAdded) {
                                            return (
                                              <div
                                                className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0 select-none border border-emerald-100/50"
                                                title="Already added to prescription"
                                              >
                                                <Check size={14} className="stroke-[3]" />
                                              </div>
                                            );
                                          }

                                          return (
                                            <button
                                              type="button"
                                              onClick={() => {
                                                const current = form.prescription ? form.prescription.trim() : '';
                                                const lines = current.split('\n').filter(l => l.trim());
                                                const isDuplicate = lines.some(line => 
                                                  line.toLowerCase().includes(med.label.toLowerCase())
                                                );
                                                
                                                if (isDuplicate) {
                                                  toast.warning(`${med.label} is already in the prescription.`);
                                                  return;
                                                }
                                                
                                                if (current) {
                                                  handleChange('prescription', `${current}\n${med.text}`);
                                                } else {
                                                  handleChange('prescription', med.text);
                                                }

                                                if (med.price && med.price > 0) {
                                                  setEstimateItems((prev) => [
                                                    ...prev,
                                                    {
                                                      procedure: `${med.label} (Medicine)`,
                                                      cost: med.price,
                                                      isCosmetic: false
                                                    }
                                                  ]);
                                                  toast.success(`${med.label} added to prescription and billing (₹${med.price})`);
                                                } else {
                                                  toast.success(`${med.label} added to prescription`);
                                                }
                                              }}
                                              className="w-7 h-7 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 flex items-center justify-center transition-colors font-bold text-sm shrink-0"
                                              title="Add item"
                                            >
                                              +
                                            </button>
                                          );
                                        })()}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>

                            {/* View All Medicines expander */}
                            {filteredMeds.length > 4 && (
                              <div className="text-center">
                                <button
                                  type="button"
                                  onClick={() => {
                                    // Just trigger scroll or show toast
                                    toast.info("Use search or filters above to browse all presets.");
                                  }}
                                  className="text-[9.5px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5 justify-center mx-auto"
                                >
                                  <span>View all medicines</span>
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                                </button>
                              </div>
                            )}

                            {/* Bottom Actions Row: Add Medicine */}
                            <div className="pt-2 border-t border-slate-100 flex justify-end">
                              <button
                                type="button"
                                onClick={addNewCustomMed}
                                className="flex items-center justify-center gap-1.5 py-2 px-3.5 border border-slate-200 rounded-xl bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-350 transition-all font-semibold text-[11px] shadow-sm"
                              >
                                <Plus size={13} className="text-slate-500" />
                                <span>Add Medicine</span>
                              </button>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Medical Alerts (if any are active) */}
                    {((form.allergies && form.allergies.length > 0) || (form.medicalConditions && form.medicalConditions.length > 0)) && (
                      <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3.5 flex gap-3 items-start">
                        <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-400 shrink-0 mt-0.5 animate-pulse">
                          <Stethoscope size={16} />
                        </div>
                        <div className="space-y-1">
                          <h5 className="text-[12px] font-bold text-rose-400 uppercase tracking-wider">Medical Alerts</h5>
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            {form.allergies && form.allergies.length > 0 && (
                              <span className="block"><strong>⚠️ ALLERGIES:</strong> {form.allergies.join(', ')}</span>
                            )}
                            {form.medicalConditions && form.medicalConditions.length > 0 && (
                              <span className="block mt-0.5"><strong>⚠️ CONDITIONS:</strong> {form.medicalConditions.join(', ')}</span>
                            )}
                          </p>
                        </div>
                      </div>
                    )}



                    {/* Tooth Chart Section */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="text-[12px] font-bold text-slate-800 uppercase tracking-wider">Interactive Dental Chart</h4>
                          <button
                            type="button"
                            onClick={() => toggleFieldScribe('teeth')}
                            disabled={isTranscribing === 'teeth'}
                            className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[9.5px] font-bold uppercase border transition-all ${
                              activeFieldRecording === 'teeth'
                                ? 'bg-rose-500 border-rose-600 text-white animate-pulse'
                                : isTranscribing === 'teeth'
                                  ? 'bg-amber-100 border-amber-300 text-amber-600 cursor-not-allowed'
                                  : 'bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100'
                            }`}
                          >
                            <Mic size={9} className={isTranscribing === 'teeth' ? 'animate-spin' : ''} />
                            {activeFieldRecording === 'teeth' ? 'Listening...' : isTranscribing === 'teeth' ? 'Transcribing...' : 'Scribe Chart'}
                          </button>
                        </div>
                        {form.problemTeeth && form.problemTeeth.length > 0 && (
                          <button
                            onClick={() => handleChange('problemTeeth', [])}
                            className="text-[10px] font-bold text-rose-400 hover:text-rose-300 transition-colors uppercase tracking-wider flex items-center gap-1"
                          >
                            <RotateCcw size={10} /> Clear All
                          </button>
                        )}
                      </div>

                      {/* Quadrant filter controls */}
                      <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 gap-0.5 w-full">
                        {(['all', 'UR', 'UL', 'LL', 'LR'] as const).map((q) => (
                          <button
                            key={q}
                            type="button"
                            onClick={() => setActiveQuadrant(q)}
                            className={`flex-1 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all duration-150 text-center ${
                              activeQuadrant === q
                                ? 'bg-white text-indigo-600 shadow-sm border border-indigo-100'
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                          >
                            {q === 'all' ? 'Full' : `${q}`}
                          </button>
                        ))}
                      </div>

                      {/* Tooth Chart Layout Grid */}
                      <div className="w-full pb-2">
                        {activeQuadrant !== 'all' ? (
                          <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center gap-3">
                            <div className="text-[11px] font-bold text-slate-700 tracking-wider uppercase">
                              {activeQuadrant === 'UR' && 'Upper Right Quadrant (UR)'}
                              {activeQuadrant === 'UL' && 'Upper Left Quadrant (UL)'}
                              {activeQuadrant === 'LL' && 'Lower Left Quadrant (LL)'}
                              {activeQuadrant === 'LR' && 'Lower Right Quadrant (LR)'}
                            </div>
                            <div className="flex flex-wrap gap-2.5 justify-center py-2">
                              {(activeQuadrant === 'UR' ? quad1 : activeQuadrant === 'UL' ? quad2 : activeQuadrant === 'LL' ? quad3 : quad4).map((num) => {
                                const isProblem = (form.problemTeeth || []).includes(num);
                                return (
                                  <Tooltip key={num}>
                                    <TooltipTrigger asChild>
                                      <button
                                        type="button"
                                        onClick={() => handleToothToggle(num)}
                                        className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center border transition-all duration-150 select-none shadow-sm ${
                                          isProblem
                                            ? 'bg-rose-50 border-rose-300 text-rose-600 ring-2 ring-rose-500/20'
                                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
                                        }`}
                                      >
                                        <span className="text-[15px] font-bold">{num}</span>
                                        <span className="text-[8px] opacity-75 mt-0.5 max-w-[50px] text-center truncate">
                                          {getToothName(num).split(' ').pop()}
                                        </span>
                                      </button>
                                    </TooltipTrigger>
                                    <TooltipContent style={{ background: '#1a2035', border: '1px solid rgba(255,255,255,0.1)' }}>
                                      <p className="text-[11px] font-medium text-white">{getToothName(num)}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                );
                              })}
                            </div>
                            <div className="text-[9px] text-slate-400 font-medium italic">
                              Enlarged touch targets active. Double tap or click to toggle teeth.
                            </div>
                          </div>
                        ) : (
                          <div className="w-full pb-2">
                            <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 sm:p-4 flex flex-col gap-3 justify-center items-center relative">
                              {/* Midline guides (only visible on desktop when quadrants are side-by-side) */}
                              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-slate-200 pointer-events-none hidden sm:block" />
                              <div className="absolute left-0 right-0 top-1/2 h-px bg-slate-200 pointer-events-none hidden sm:block" />

                              {/* UPPER ARCH */}
                              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-2 justify-center w-full">
                                {/* Upper Right Quadrant (UR: 18 -> 11) */}
                                <div className="flex items-center gap-1 sm:gap-1.5 justify-center sm:justify-end flex-1 w-full sm:w-auto">
                                  {quad1.map((num) => {
                                    const isProblem = (form.problemTeeth || []).includes(num);
                                    return (
                                      <Tooltip key={num}>
                                        <TooltipTrigger asChild>
                                          <button
                                            type="button"
                                            onClick={() => handleToothToggle(num)}
                                            className={`w-7 h-7 min-[380px]:w-8 min-[380px]:h-8 rounded flex items-center justify-center text-[10px] font-bold border transition-all duration-150 select-none ${
                                              isProblem
                                                ? 'bg-rose-50 border-rose-300 text-rose-600 shadow-sm'
                                                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
                                            }`}
                                          >
                                            {num}
                                          </button>
                                        </TooltipTrigger>
                                        <TooltipContent style={{ background: '#1a2035', border: '1px solid rgba(255,255,255,0.1)' }}>
                                          <p className="text-[11px] font-medium text-white">{getToothName(num)}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    );
                                  })}
                                </div>

                                {/* midline divider (desktop only) */}
                                <div className="hidden sm:block w-[1px] h-8 bg-indigo-500/20" />

                                {/* Upper Left Quadrant (UL: 21 -> 28) */}
                                <div className="flex items-center gap-1 sm:gap-1.5 justify-center sm:justify-start flex-1 w-full sm:w-auto">
                                  {quad2.map((num) => {
                                    const isProblem = (form.problemTeeth || []).includes(num);
                                    return (
                                      <Tooltip key={num}>
                                        <TooltipTrigger asChild>
                                          <button
                                            type="button"
                                            onClick={() => handleToothToggle(num)}
                                            className={`w-7 h-7 min-[380px]:w-8 min-[380px]:h-8 rounded flex items-center justify-center text-[10px] font-bold border transition-all duration-150 select-none ${
                                              isProblem
                                                ? 'bg-rose-50 border-rose-300 text-rose-600 shadow-sm'
                                                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
                                            }`}
                                          >
                                            {num}
                                          </button>
                                        </TooltipTrigger>
                                        <TooltipContent style={{ background: '#1a2035', border: '1px solid rgba(255,255,255,0.1)' }}>
                                          <p className="text-[11px] font-medium text-white">{getToothName(num)}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* LOWER ARCH */}
                              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-2 justify-center w-full">
                                {/* Lower Right Quadrant (LR: 48 -> 41) */}
                                <div className="flex items-center gap-1 sm:gap-1.5 justify-center sm:justify-end flex-1 w-full sm:w-auto">
                                  {quad4.map((num) => {
                                    const isProblem = (form.problemTeeth || []).includes(num);
                                    return (
                                      <Tooltip key={num}>
                                        <TooltipTrigger asChild>
                                          <button
                                            type="button"
                                            onClick={() => handleToothToggle(num)}
                                            className={`w-7 h-7 min-[380px]:w-8 min-[380px]:h-8 rounded flex items-center justify-center text-[10px] font-bold border transition-all duration-150 select-none ${
                                              isProblem
                                                ? 'bg-rose-50 border-rose-300 text-rose-600 shadow-sm'
                                                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
                                            }`}
                                          >
                                            {num}
                                          </button>
                                        </TooltipTrigger>
                                        <TooltipContent style={{ background: '#1a2035', border: '1px solid rgba(255,255,255,0.1)' }}>
                                          <p className="text-[11px] font-medium text-white">{getToothName(num)}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    );
                                  })}
                                </div>

                                {/* midline divider (desktop only) */}
                                <div className="hidden sm:block w-[1px] h-8 bg-indigo-500/20" />

                                {/* Lower Left Quadrant (LL: 31 -> 38) */}
                                <div className="flex items-center gap-1 sm:gap-1.5 justify-center sm:justify-start flex-1 w-full sm:w-auto">
                                  {quad3.map((num) => {
                                    const isProblem = (form.problemTeeth || []).includes(num);
                                    return (
                                      <Tooltip key={num}>
                                        <TooltipTrigger asChild>
                                          <button
                                            type="button"
                                            onClick={() => handleToothToggle(num)}
                                            className={`w-7 h-7 min-[380px]:w-8 min-[380px]:h-8 rounded flex items-center justify-center text-[10px] font-bold border transition-all duration-150 select-none ${
                                              isProblem
                                                ? 'bg-rose-50 border-rose-300 text-rose-600 shadow-sm'
                                                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
                                            }`}
                                          >
                                            {num}
                                          </button>
                                        </TooltipTrigger>
                                        <TooltipContent style={{ background: '#1a2035', border: '1px solid rgba(255,255,255,0.1)' }}>
                                          <p className="text-[11px] font-medium text-white">{getToothName(num)}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Selected teeth details */}
                      {form.problemTeeth && form.problemTeeth.length > 0 ? (
                        <div className="space-y-3 bg-rose-50/[0.3] border border-rose-100 rounded-xl p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-[10.5px] font-bold uppercase tracking-widest text-rose-400">Tooth-Specific Chart Details</span>
                            <span className="text-[9.5px] text-slate-450 font-medium">({form.problemTeeth.length} flagged teeth)</span>
                          </div>
                          
                          <div className="space-y-3">
                            {form.problemTeeth.map((t) => {
                              const toothVal = form.toothConditions?.[t];
                              let diagnosis = 'Decayed / Cavity';
                              let status = 'Required';
                              
                              if (toothVal) {
                                if (typeof toothVal === 'object' && toothVal !== null) {
                                  diagnosis = (toothVal as any).diagnosis || 'Decayed / Cavity';
                                  status = (toothVal as any).status || 'Required';
                                } else if (typeof toothVal === 'string') {
                                  const lowerVal = toothVal.toLowerCase();
                                  if (lowerVal.includes('completed') || lowerVal.includes('done') || lowerVal.includes('healthy')) {
                                    diagnosis = 'Healthy / Normal';
                                    status = 'Completed / Done';
                                  } else if (lowerVal.includes('pending') || lowerVal.includes('progress')) {
                                    diagnosis = 'Decayed / Cavity';
                                    status = 'Pending / In Progress';
                                  } else {
                                    diagnosis = toothVal.replace(' Needed', '').replace(' (Required)', '');
                                    status = 'Required';
                                  }
                                }
                              }
                              const note = form.toothNotes?.[t] || '';
                              
                              return (
                                <div key={t} className="bg-white border border-slate-100 rounded-xl p-3 space-y-2.5">
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[12px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded flex items-center gap-1 shrink-0">
                                        🦷 Tooth {t}
                                      </span>
                                      <span className="text-[11px] text-slate-500 truncate max-w-[200px]" title={getToothName(t)}>
                                        {getToothName(t).split(' (Tooth ')[0]}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      {/* Diagnosis select */}
                                      <select
                                        value={diagnosis}
                                        onChange={(e) => handleUpdateToothCondition(t, e.target.value, status)}
                                        className="text-[10.5px] font-medium text-slate-700 bg-white border border-slate-200 hover:border-slate-300 px-2 py-1 rounded-md outline-none cursor-pointer"
                                      >
                                        <option value="Decayed / Cavity">Decayed / Cavity</option>
                                        <option value="Root Canal Needed">Root Canal Needed</option>
                                        <option value="Crown / Bridge Needed">Crown / Bridge Needed</option>
                                        <option value="Dental Implant Needed">Dental Implant Needed</option>
                                        <option value="Missing Tooth">Missing Tooth</option>
                                        <option value="Healthy / Normal">Healthy / Normal</option>
                                      </select>

                                      {/* Status select */}
                                      <select
                                        value={status}
                                        onChange={(e) => handleUpdateToothCondition(t, diagnosis, e.target.value)}
                                        className="text-[10.5px] font-medium text-slate-700 bg-white border border-slate-200 hover:border-slate-300 px-2 py-1 rounded-md outline-none cursor-pointer"
                                      >
                                        <option value="Required">Required</option>
                                        <option value="Pending / In Progress">Pending / In Progress</option>
                                        <option value="Completed / Done">Completed / Done</option>
                                      </select>
                                    </div>
                                  </div>
                                  
                                  {/* Note text input */}
                                  <input
                                    type="text"
                                    placeholder="Enter pathology or treatment notes..."
                                    value={note}
                                    onChange={(e) => {
                                      const notes = { ...form.toothNotes, [t]: e.target.value };
                                      handleChange('toothNotes', notes);
                                    }}
                                    className="w-full px-2.5 py-1.5 rounded-lg text-[11.5px] text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-150 focus:ring-1 focus:ring-indigo-500/40 bg-white border border-slate-200 focus:border-indigo-500"
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl py-3.5 text-center text-slate-400 text-[11px]">
                          No teeth selected. Click teeth in the chart above to mark problems.
                        </div>
                      )}
                    </div>


                    {/* Advanced Clinical Details */}
                    <div className="space-y-3 mt-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Advanced Clinical Details</h4>
                          <p className="text-[10px] text-slate-400 mt-0.5 sm:hidden">Collapsed on phones to keep the consultation flow fast.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowAdvancedClinical((prev) => !prev)}
                          className="sm:hidden text-[11px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg"
                        >
                          {showAdvancedClinical ? 'Hide' : 'Show'}
                        </button>
                      </div>

                      <div className={`${showAdvancedClinical ? 'block' : 'hidden'} sm:block space-y-4`}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Allergies Checklist */}
                          <div className="bg-slate-50 border border-slate-200/85 rounded-xl p-4 space-y-3">
                            <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Allergies</h4>
                            <div className="grid grid-cols-1 gap-2.5">
                              {['Penicillin', 'Latex', 'Local Anesthetics', 'Sulfa'].map((allergy) => {
                                const hasAllergy = (form.allergies || []).includes(allergy);
                                return (
                                  <label key={allergy} className="flex items-center gap-2.5 cursor-pointer select-none text-[12px] text-slate-600 hover:text-slate-800 transition-colors">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const current = form.allergies || [];
                                        const next = current.includes(allergy)
                                          ? current.filter((a) => a !== allergy)
                                          : [...current, allergy];
                                        handleChange('allergies', next);
                                      }}
                                      className={`w-4 h-4 rounded flex items-center justify-center border transition-colors shrink-0 ${
                                        hasAllergy
                                          ? 'bg-rose-50 border-rose-300 text-rose-600'
                                          : 'bg-white border-slate-200 text-transparent hover:bg-slate-50'
                                      }`}
                                    >
                                      {hasAllergy && <span className="text-[9px] leading-none">✓</span>}
                                    </button>
                                    <span className="truncate">{allergy}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>

                          {/* Medical Conditions Checklist */}
                          <div className="bg-slate-50 border border-slate-200/85 rounded-xl p-4 space-y-3">
                            <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Medical Conditions</h4>
                            <div className="grid grid-cols-1 gap-2.5">
                              {['Hypertension', 'Diabetes', 'Bleeding Disorders', 'Cardiac Pacemaker', 'Asthma'].map((cond) => {
                                const hasCond = (form.medicalConditions || []).includes(cond);
                                return (
                                  <label key={cond} className="flex items-center gap-2.5 cursor-pointer select-none text-[12px] text-slate-600 hover:text-slate-800 transition-colors">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const current = form.medicalConditions || [];
                                        const next = current.includes(cond)
                                          ? current.filter((c) => c !== cond)
                                          : [...current, cond];
                                        handleChange('medicalConditions', next);
                                      }}
                                      className={`w-4 h-4 rounded flex items-center justify-center border transition-colors shrink-0 ${
                                        hasCond
                                          ? 'bg-rose-50 border-rose-300 text-rose-600'
                                          : 'bg-white border-slate-200 text-transparent hover:bg-slate-50'
                                      }`}
                                    >
                                      {hasCond && <span className="text-[9px] leading-none">✓</span>}
                                    </button>
                                    <span className="truncate">{cond}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-200/85 rounded-xl p-4 space-y-3">
                          <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Vitals</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[10px] text-slate-500 font-medium mb-1.5 uppercase tracking-wider">Blood Pressure</label>
                              <input
                                className="w-full px-2.5 py-2 rounded-lg text-[12px] text-slate-700 placeholder:text-slate-400 bg-white border border-slate-200 outline-none transition-all duration-150 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="e.g. 120/80 mmHg"
                                value={form.vitals?.bp || ''}
                                onChange={(e) => {
                                  handleChange('vitals', { ...form.vitals, bp: e.target.value });
                                }}
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-500 font-medium mb-1.5 uppercase tracking-wider">Pulse / Heart Rate</label>
                              <input
                                className="w-full px-2.5 py-2 rounded-lg text-[12px] text-slate-700 placeholder:text-slate-400 bg-white border border-slate-200 outline-none transition-all duration-150 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="e.g. 72 bpm"
                                value={form.vitals?.pulse || ''}
                                onChange={(e) => {
                                  handleChange('vitals', { ...form.vitals, pulse: e.target.value });
                                }}
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-500 font-medium mb-1.5 uppercase tracking-wider">Body Temp (°F)</label>
                              <input
                                className="w-full px-2.5 py-2 rounded-lg text-[12px] text-slate-700 placeholder:text-slate-400 bg-white border border-slate-200 outline-none transition-all duration-150 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="e.g. 98.6 °F"
                                value={form.vitals?.temp || ''}
                                onChange={(e) => {
                                  handleChange('vitals', { ...form.vitals, temp: e.target.value });
                                }}
                              />
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                )}

                {/* Body - Post Consultation tab */}
                {activeTab === 'estimates' && (
                  <div className="px-4 sm:px-6 py-4 space-y-5 overflow-y-auto overflow-x-hidden max-h-[60vh] max-sm:max-h-[calc(92vh-170px)] scrollbar-none flex-1 pb-6">
                    <div className="flex items-center justify-between bg-gradient-to-r from-indigo-50 to-slate-50 border border-indigo-100/80 rounded-xl px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500/30 animate-pulse" />
                        <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">Treatment Summary Builder</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">Create itemized estimates and digital receipts</span>
                    </div>

                    {/* Add Item Builder */}
                    <div className="bg-white border border-slate-200/80 rounded-xl p-5 space-y-4 shadow-sm hover:shadow-md/50 transition-all duration-200">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 border border-indigo-100/50">
                          <Plus size={16} />
                        </div>
                        <div>
                          <h4 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider">Treatment Done</h4>
                          <p className="text-[10.5px] text-slate-500 mt-0.5">Add procedures completed during the consultation</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
                        {/* Tooth selector */}
                        <div className="sm:col-span-3">
                          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">Tooth / Area</label>
                          <div className="flex items-stretch border border-slate-200 rounded-xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/20 bg-white">
                            <div className="bg-slate-50 border-r border-slate-200 px-3.5 flex items-center justify-center text-slate-400 shrink-0">
                              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2C8.5 2 6 4.5 6 8c0 3.5 1 5.5 1.5 7.5.3 1.2.3 2.5.1 3.7L7 21c-.2.9.7 1.5 1.4 1l2.1-1.5c1-.7 2.4-.7 3.4 0l2.1 1.5c.7.5 1.6-.1 1.4-1l-.6-1.8c-.2-1.2-.2-2.5.1-3.7.5-2 1.5-4 1.5-7.5 0-3.5-2.5-6-6-6Z" />
                                <path d="M12 2v6" />
                              </svg>
                            </div>
                            <input
                              type="text"
                              placeholder="e.g. 11, 46"
                              value={builderTooth}
                              onChange={(e) => setBuilderTooth(e.target.value)}
                              className="flex-1 px-3.5 py-2.5 text-[13px] text-slate-800 placeholder:text-slate-400 bg-transparent outline-none w-full border-0"
                            />
                          </div>
                        </div>

                        {/* Procedure selector */}
                        <div className="sm:col-span-6">
                          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">Procedure Done</label>
                          <div className="relative flex items-stretch border border-slate-200 rounded-xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/20 bg-white">
                            <div className="bg-slate-50 border-r border-slate-200 px-3.5 flex items-center justify-center text-slate-400 shrink-0">
                              <FileText size={16} />
                            </div>
                            <select
                              value={builderProcedureIdx}
                              onChange={(e) => {
                                const idx = e.target.value;
                                setBuilderProcedureIdx(idx);
                                setBuilderCost(proceduresCatalog[Number(idx)].defaultCost);
                              }}
                              className="flex-1 px-3.5 py-2.5 pr-8 text-[13px] text-slate-800 bg-transparent outline-none w-full border-0 cursor-pointer appearance-none"
                            >
                              {proceduresCatalog.map((p, idx) => (
                                <option key={idx} value={idx}>
                                  {p.name} ({p.gstRate}% GST)
                                </option>
                              ))}
                            </select>
                            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                              <ChevronDown size={14} />
                            </div>
                          </div>
                        </div>

                        {/* Cost */}
                        <div className="sm:col-span-3">
                          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">Amount</label>
                          <div className="flex items-stretch border border-slate-200 rounded-xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/20 bg-white">
                            <div className="bg-slate-50 border-r border-slate-200 px-3.5 flex items-center justify-center text-slate-500 font-bold shrink-0 text-[13px]">
                              ₹
                            </div>
                            <input
                              type="number"
                              value={builderCost}
                              onChange={(e) => setBuilderCost(Number(e.target.value))}
                              className="flex-1 px-3.5 py-2.5 text-[13px] text-slate-800 placeholder:text-slate-400 bg-transparent outline-none w-full border-0 font-mono"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            const proc = proceduresCatalog[Number(builderProcedureIdx)];
                            setEstimateItems((prev) => [
                              ...prev,
                              {
                                tooth: builderTooth ? (Number(builderTooth) || undefined) : undefined,
                                procedure: proc.name,
                                cost: builderCost,
                                isCosmetic: proc.gstRate === 18
                              }
                            ]);
                            setBuilderTooth('');
                          }}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[12px] font-bold transition-all duration-150 flex items-center gap-1.5 shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-[0.98]"
                        >
                          <Plus size={14} /> Add to Estimate
                        </button>
                      </div>
                    </div>

                    {/* Estimate Items Table */}
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                      <div className="px-4 sm:px-6 py-3 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2.5">
                        <span className="text-[11.5px] font-bold text-slate-800 uppercase tracking-wider">Current Treatment Summary</span>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => syncRxMedicinesToBilling(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10.5px] font-bold uppercase border bg-white border-slate-200 text-slate-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all shadow-sm cursor-pointer"
                          >
                            <RefreshCw size={11} />
                            Sync Rx Meds
                          </button>

                          <button
                            type="button"
                            onClick={generateDefaultPDF}
                            disabled={estimateItems.length === 0}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10.5px] font-bold uppercase border bg-white border-slate-200 text-slate-700 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                          >
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                            Print Receipt PDF
                          </button>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Bill Paid:</span>
                            <button
                              type="button"
                              onClick={() => setEstimateStatus(estimateStatus === 'Approved' ? 'Draft' : 'Approved')}
                              className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all duration-200 border cursor-pointer ${
                                  estimateStatus === 'Approved'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/80 shadow-sm'
                                  : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100/80'
                              }`}
                            >
                              <div className={`w-1.5 h-1.5 rounded-full ${estimateStatus === 'Approved' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                              <span>{estimateStatus === 'Approved' ? 'Paid' : 'Unpaid'}</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {estimateItems.length > 0 ? (
                        <div className="divide-y divide-slate-100 max-h-[250px] overflow-y-auto">
                          {estimateItems.map((item, idx) => (
                            <div key={idx} className="px-4 sm:px-6 py-3.5 flex items-center justify-between text-[12.5px] hover:bg-slate-50/50 transition-colors">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  {item.tooth && (
                                    <span className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded">
                                      Tooth {item.tooth}
                                    </span>
                                  )}
                                  <span className="text-slate-800 font-semibold">{item.procedure}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[10.5px] text-slate-500">
                                  <span>{item.isCosmetic ? 'Cosmetic Dental (18% GST)' : 'Therapeutic Care (0% GST)'}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className="text-slate-800 font-bold font-mono">₹{(item.cost || 0).toLocaleString('en-IN')}</span>
                                <button
                                  type="button"
                                  onClick={() => setEstimateItems((prev) => prev.filter((_, i) => i !== idx))}
                                  className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition-colors border border-transparent hover:border-rose-100"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-10 text-center text-[12px] text-slate-400 border-b border-slate-100/50 bg-slate-50/20">
                          No treatment items added. Use the builder above to log procedures.
                        </div>
                      )}

                      {/* Calculations summary panel */}
                      <div className="bg-slate-50/50 border-t border-slate-200 p-4 sm:p-6 space-y-3">
                        <div className="flex justify-between text-[12px] text-slate-600">
                          <span>Subtotal</span>
                          <span className="font-mono font-semibold">₹{calculatedSubtotal.toLocaleString('en-IN')}</span>
                        </div>

                        {/* Discount row */}
                        <div className="flex items-center justify-between text-[12px] text-slate-600 gap-4 flex-wrap">
                          <span className="flex items-center gap-1.5 shrink-0 font-medium">
                            Discount / Concession
                          </span>
                          <div className="flex items-center gap-1.5 flex-wrap justify-end">
                            {[0, 5, 10, 15, 20, 30].map((val) => (
                              <button
                                key={val}
                                type="button"
                                onClick={() => setEstimateDiscount(val)}
                                className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition-all border ${
                                  estimateDiscount === val
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-600/10'
                                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-800'
                                }`}
                              >
                                {val}%
                              </button>
                            ))}
                          </div>
                        </div>

                        {calculatedDiscountAmount > 0 && (
                          <div className="flex justify-between text-[12px] text-rose-600 font-medium">
                            <span>Discount Value</span>
                            <span className="font-mono">-₹{calculatedDiscountAmount.toLocaleString('en-IN')}</span>
                          </div>
                        )}

                        <div className="flex justify-between text-[12px] text-slate-500">
                          <span>GST <span className="text-[10px] text-slate-400">(Inclusive, Cosmetic)</span></span>
                          <span className="font-mono">₹{calculatedGST.toLocaleString('en-IN')}</span>
                        </div>

                        <div className="h-px bg-slate-200 my-1" />

                        <div className="flex justify-between items-center pt-1">
                          <span className="text-[13px] font-bold text-slate-700 uppercase tracking-wider">Final Amount</span>
                          <div className="text-right">
                            <span className="font-mono text-[16px] font-extrabold text-indigo-600">₹{calculatedGrandTotal.toLocaleString('en-IN')}</span>
                            <span className="block text-[8.5px] text-slate-400 font-medium mt-0.5">All Taxes Included</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* NBFC EMI Financing Option */}
                    {calculatedGrandTotal >= 3000 && (
                      <div className="bg-gradient-to-tr from-indigo-50/70 via-white to-slate-50 border border-indigo-150 rounded-2xl p-5 space-y-4 shadow-sm text-left">
                        {localStorage.getItem('emi_partner_status') !== 'Not Partnered' ? (
                          <>
                            {(() => {
                              const activePartner = localStorage.getItem('emi_partner_name') || 'Axis Bank (Jarvis)';
                              const plans = activePartner === 'Axis Bank (Jarvis)' 
                                ? [
                                    { months: 6, label: '6 Months', rate: '0% Interest' },
                                    { months: 12, label: '12 Months', rate: '0% Interest' },
                                    { months: 18, label: '18 Months', rate: 'No Cost EMI' },
                                    { months: 24, label: '24 Months', rate: 'Low Cost EMI' }
                                  ]
                                : [
                                    { months: 3, label: '3 Months', rate: '0% Interest' },
                                    { months: 6, label: '6 Months', rate: '0% Interest' },
                                    { months: 9, label: '9 Months', rate: 'No Cost EMI' }
                                  ];
                              return (
                                <>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-655 border border-indigo-100">
                                        <Zap size={16} className="text-indigo-600 animate-pulse" />
                                      </div>
                                      <div>
                                        <h4 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider">{activePartner === 'Axis Bank (Jarvis)' ? 'Axis Bank Personal Loan / EMI' : '0% Interest Dental EMI'}</h4>
                                        <p className="text-[10px] text-slate-400 font-medium">Partnered with {activePartner}</p>
                                      </div>
                                    </div>
                                    <span className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase bg-emerald-50 border border-emerald-200 text-emerald-700 tracking-wider">
                                      Instant Approval
                                    </span>
                                  </div>

                                  <div className={`grid gap-3 grid-cols-2 md:grid-cols-${plans.length}`}>
                                    {plans.map((plan) => {
                                      const monthlyAmount = Math.round(calculatedGrandTotal / plan.months);
                                      return (
                                        <div key={plan.months} className="bg-white border border-slate-200 hover:border-indigo-300 rounded-xl p-3 text-center space-y-1 hover:shadow-sm transition-all duration-150 cursor-pointer group">
                                          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-indigo-500">{plan.label}</span>
                                          <span className="block text-[13px] font-black text-slate-800 font-mono">₹{monthlyAmount.toLocaleString('en-IN')}<span className="text-[9px] font-bold text-slate-400">/mo</span></span>
                                          <span className="inline-block text-[8px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600">{plan.rate}</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </>
                              );
                            })()}

                             <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] bg-slate-50 rounded-xl px-3.5 py-2.5 border border-slate-200">
                              <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                                <CheckSquare className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                <span>Paperless KYC & digital Axis underwriting</span>
                              </div>
                              <button 
                                type="button" 
                                onClick={() => {
                                  if (!form.phone) {
                                    toast.error("Patient phone number is required to send the link.");
                                    return;
                                  }
                                  const cleanPhone = (form.phone || '').replace(/[^0-9]/g, '');
                                  const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
                                  const activePartner = localStorage.getItem('emi_partner_name') || 'Axis Bank (Jarvis)';
                                  const crmOrigin = window.location.origin;
                                  
                                  let targetLink = `${crmOrigin}/emi/callback`;
                                  if (activePartner === 'Axis Bank (Jarvis)') {
                                    const clientId = localStorage.getItem('emi_client_id') || '7bc29bc8dad077dc5491758da515d6fd';
                                    const nameUrlParam = encodeURIComponent(form.name || 'Patient');
                                    targetLink = `${crmOrigin}/emi/onboard?client_id=${clientId}&name=${nameUrlParam}&amount=${calculatedGrandTotal}`;
                                  }
                                  
                                  const messageText = `Dear ${form.name || 'Patient'},\n\nTo pay for your treatment of ₹${calculatedGrandTotal.toLocaleString('en-IN')} at our clinic via easy monthly installments (EMI), please click the link below to check your eligibility and complete your digital application with ${activePartner}:\n\n🔗 ${targetLink}\n\nThank you!\nYOUR DENTIST Patna`;
                                  
                                  window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(messageText)}`, '_blank', 'noopener,noreferrer');
                                  toast.success("Opening WhatsApp with pre-filled Axis Bank eligibility application link!");
                                }}
                                className="w-full sm:w-auto text-center px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10.5px] font-bold transition-all shadow-sm shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-[0.98] cursor-pointer shrink-0"
                              >
                                Apply Now
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-655 border border-indigo-100">
                                  <Zap size={16} className="text-indigo-600 animate-pulse" />
                                </div>
                                <div>
                                  <h4 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider">0% Interest Dental EMI</h4>
                                  <p className="text-[10px] text-slate-400 font-medium">Financing not configured yet</p>
                                </div>
                              </div>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center space-y-3">
                              <p className="text-[11.5px] text-slate-500 leading-relaxed max-w-md mx-auto font-medium">
                                Offer low-cost treatment financing to your patients. Go to Clinic Settings to choose an NBFC partner and activate the 0% interest EMI integration.
                              </p>
                              <div className="text-center">
                                <span className="text-[10.5px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-lg">
                                  NBFC Partnership Setup Required
                                </span>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}



                {/* Footer */}
                <div
                  className="px-6 py-4 flex items-center justify-end gap-3 shrink-0 bg-white"
                  style={{ borderTop: '1px solid #E2E8F0' }}
                >
                  <button
                    onClick={onClose}
                    className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-[13px] font-semibold transition-all duration-150"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!form.name || !form.phone}
                    className="px-5 py-2 text-[13px] font-semibold text-white rounded-xl transition-all duration-150 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed shadow-md shadow-indigo-500/20 flex items-center gap-2"
                  >
                    <Save size={14} />
                    <span>{isEdit ? 'Save Changes' : 'Add Patient'}</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      {/* Lightbox Dialog */}
      {lightboxImg && (
        <Dialog open={!!lightboxImg} onOpenChange={() => setLightboxImg(null)}>
          <DialogContent
            className="max-w-4xl p-1 border-0 overflow-hidden"
            style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}
            onCloseAutoFocus={(e) => {
              e.preventDefault();
              if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
              }
            }}
          >
            <div className="relative w-full h-[70vh] flex items-center justify-center p-4">
              <img src={lightboxImg} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" alt="Patient X-Ray Radiograph scan Zoom" />
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <a
                  href={lightboxImg}
                  download={`patient_photo_${Date.now()}.png`}
                  className="w-9 h-9 rounded-full bg-indigo-600 border border-indigo-500 text-white flex items-center justify-center hover:bg-indigo-700 transition-colors shadow-lg cursor-pointer"
                  title="Download Image"
                >
                  <Download size={15} />
                </a>
                <button
                  onClick={() => setLightboxImg(null)}
                  className="w-9 h-9 rounded-full bg-black/60 border border-white/10 text-white flex items-center justify-center hover:bg-black/85 transition-colors shadow-lg"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Voice Settings Dialog */}
      {showVoiceSettingsModal && (
        <Dialog open={showVoiceSettingsModal} onOpenChange={(v) => !v && setShowVoiceSettingsModal(false)}>
          <DialogContent
            className="max-w-md border-0 p-5 overflow-hidden"
            style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}
            aria-describedby={undefined}
            onCloseAutoFocus={(e) => {
              e.preventDefault();
              if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
              }
            }}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Settings size={14} className="text-indigo-500" />
                  AI Scribe Configuration
                </h4>
                <button
                  onClick={() => setShowVoiceSettingsModal(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 py-1">
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                  <div className="flex gap-2">
                    <span className="text-emerald-500 font-bold text-xs">✓</span>
                    <div>
                      <h5 className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Web Speech + AI Active</h5>
                      <p className="text-[10.5px] text-emerald-700 leading-normal mt-0.5">
                        Your voice is transcribed locally using Chrome's Speech Recognition, then automatically corrected for Indian accent and medical terms using NVIDIA Llama 3.1.
                      </p>
                    </div>
                  </div>
                </div>

                {isPushSupported && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h5 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Web Push Notifications</h5>
                        <p className="text-[10px] text-slate-500 leading-normal mt-0.5">
                          Enable push alerts on this device for upcoming clinic appointments & patient follow-ups.
                        </p>
                      </div>
                      <div className="shrink-0">
                        {isPushSubscribed ? (
                          <span className="px-2 py-0.5 bg-emerald-100 border border-emerald-200 text-emerald-800 text-[9px] font-bold uppercase rounded">
                            Active
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={async () => {
                              const res = await enablePushNotifications();
                              if (res.success) {
                                alert("Web Push notifications enabled successfully!");
                              } else {
                                alert(`Failed to enable: ${res.reason}`);
                              }
                            }}
                            disabled={isPushBusy}
                            className="px-2.5 py-1 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-[10px] font-bold uppercase text-indigo-600 rounded transition-colors"
                          >
                            {isPushBusy ? '...' : 'Enable'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Fill presets inside the settings box */}
              <div className="pt-3 border-t border-slate-100 space-y-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Quick Fill Presets</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      handleChange('prescription', "• Tab. Amoxicillin 500mg - 1 cap thrice daily for 5 days\n• Tab. Paracetamol 650mg - 1 tab SOS for pain");
                      alert("Prescription text auto-filled.");
                      setShowVoiceSettingsModal(false);
                    }}
                    className="px-2.5 py-1 bg-slate-50 border border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 rounded-lg text-[10.5px] text-slate-600 transition-colors"
                  >
                    💊 Load Mock Rx
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleChange('problemTeeth', [14, 15]);
                      handleChange('toothConditions', {
                        14: 'Decayed / Cavity',
                        15: 'Root Canal Needed'
                      });
                      handleChange('toothNotes', {
                        14: 'Deep distal cavity',
                        15: 'Sensitivity to cold and hot water'
                      });
                      alert("Dental chart tagged for teeth 14 & 15.");
                      setShowVoiceSettingsModal(false);
                    }}
                    className="px-2.5 py-1 bg-slate-50 border border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 rounded-lg text-[10.5px] text-slate-600 transition-colors"
                  >
                    🦷 Tag Teeth 14 & 15
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowVoiceSettingsModal(false)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-indigo-500/10"
                >
                  Close
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const ROWS_PER_PAGE = 10;

export default CustomerModal;
