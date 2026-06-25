import React, { useState, useMemo, useCallback } from 'react';
import { useDealAlertNotifications } from '@/hooks/useDealAlertNotifications';
import { jsPDF } from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Upload,
  Filter,
  RotateCcw,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
  Edit3,
  MessageSquare,
  Star,
  Trash2,
  Sparkles,
  Users,
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
import { loadClinicProcedures, Procedure, loadWhatsAppTemplates } from './ReactivationClinicSettings';
import { logWhatsAppMessage } from '@/utils/whatsappLogger';



// Modular imports
import { Customer, CustomerStatus, SortField, SortDir } from './patients/types';
import { AVATAR_COLORS, SERVICES, STATUS_OPTIONS, DATE_RANGES, STATUS_CONFIG, ROWS_PER_PAGE } from './patients/constants';
import { 
  getInitialForm, getToothName, getShortToothLabel, 
  getInitials, formatDate, timeAgo, formatFollowUpTime, 
  formatSpend, isInDateRange, getNextVisitDate, getFollowUpLabel, getAppointmentWindow
} from './patients/helpers';
import { CARE_PROGRAMS, FOLLOW_UP_RULES } from './patients/carePrograms';
import { generateSmileGalleryImage, getProxyUrl, addSmileGalleryToPDF } from './patients/smileGalleryHelper';
import { Avatar } from './patients/components/Avatar';
import { StatusBadge } from './patients/components/StatusBadge';
import { StatChip } from './patients/components/StatChip';
import { SortIcon } from './patients/components/SortIcon';
import CustomerModal from './patients/components/PatientModal';

// Mock customers default baseline
export const MOCK_CUSTOMERS: Customer[] = [];

const ReactivationCustomers: React.FC = () => {
  const { organizationId, profile } = useSession();
  const clinicId = organizationId || '';
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  // Clinic branding (loaded from Supabase / local storage)
  const [clinicBranding, setClinicBranding] = useState(() => {
    try {
      const raw = localStorage.getItem(`clinic_branding_${clinicId}`);
      if (raw) return JSON.parse(raw);
    } catch {}
    return {
      clinicName: profile?.business_name || 'Dental Clinic',
      doctorName: '',
      qualifications: '',
      address: '',
      phone: '',
      email: '',
      logoUrl: '',
    };
  });

  React.useEffect(() => {
    if (!clinicId || clinicId === 'default') return;
    async function loadClinicBranding() {
      try {
        const { data: clinic } = await supabase
          .from('dental_clinics')
          .select('*')
          .eq('id', clinicId)
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
  }, [clinicId]);

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

  React.useEffect(() => {
    if (!clinicId) return;

    async function fetchPatients() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('dental_patients')
          .select('id, name, phone, last_visit, service, total_spend, status, notes, avatar_color, active_program_id, program_enrollment_date, program_current_step, program_status, created_at')
          .eq('clinic_id', clinicId)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const mapped = data.map((d: any) => ({
            id: d.id,
            name: d.name,
            phone: d.phone,
            lastVisit: d.last_visit,
            service: d.service,
            totalSpend: Number(d.total_spend || 0),
            status: d.status,
            notes: d.notes,
            avatarColor: d.avatar_color,
            problemTeeth: [],
            xrays: [],
            beforeAfterPhotos: [],
            beforePhoto: '',
            beforePhotos: [],
            profilePhoto: '',
            afterPhoto: '',
            afterPhotos: [],
            prescription: '',
            allergies: [],
            medicalConditions: [],
            toothNotes: {},
            toothConditions: {},
            vitals: {},
            activeProgramId: d.active_program_id,
            programEnrollmentDate: d.program_enrollment_date,
            programCurrentStep: d.program_current_step,
            programStatus: d.program_status,
            estimates: []
          }));
          setCustomers(mapped);
        } else {
          setCustomers([]);
        }
      } catch (err) {
        console.error('Error fetching patients:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPatients();
  }, [clinicId]);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [serviceFilter, setServiceFilter] = useState('All Services');
  const [dateRange, setDateRange] = useState('all');
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [dismissedAppointmentIds, setDismissedAppointmentIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>(undefined);

  const stats = useMemo(() => {
    const total = customers.length;
    const active = customers.filter((c) => c.status === 'Active').length;
    const inactive = customers.filter((c) => c.status === 'Inactive').length;
    return { total, active, inactive };
  }, [customers]);

  const upcomingAppointments = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const inSevenDays = todayStart + 7 * 24 * 60 * 60 * 1000;

    return customers
      .map((customer) => {
        const nextVisitDate = getNextVisitDate(customer);
        if (!nextVisitDate) return null;

        const visitTime = new Date(nextVisitDate).getTime();
        const appointmentWindow = getAppointmentWindow(nextVisitDate);
        const isDueSoon = visitTime >= todayStart && visitTime <= inSevenDays;
        const isOverdue = visitTime < todayStart;

        if (!isDueSoon && !isOverdue) return null;
        if (dismissedAppointmentIds.has(customer.id)) return null;

        return {
          id: customer.id,
          name: customer.name,
          phone: customer.phone,
          service: customer.service,
          nextVisitDate,
          appointmentWindow,
          dueLabel: getFollowUpLabel(customer),
          overdue: isOverdue,
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .sort((a, b) => new Date(a.nextVisitDate).getTime() - new Date(b.nextVisitDate).getTime())
      .slice(0, 4);
  }, [customers, dismissedAppointmentIds]);

  // ─── Filtering + Sorting ──────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...customers];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) => c.name.toLowerCase().includes(q) || c.phone.includes(q)
      );
    }

    if (statusFilter !== 'All') {
      list = list.filter((c) => c.status === statusFilter);
    }

    if (serviceFilter !== 'All Services') {
      list = list.filter((c) => c.service === serviceFilter);
    }

    if (dateRange !== 'all') {
      list = list.filter((c) => isInDateRange(c.lastVisit, dateRange));
    }

    if (sortField) {
      list.sort((a, b) => {
        let av: number, bv: number;
        if (sortField === 'lastVisit') {
          av = new Date(a.lastVisit).getTime();
          bv = new Date(b.lastVisit).getTime();
        } else {
          av = a.totalSpend;
          bv = b.totalSpend;
        }
        return sortDir === 'asc' ? av - bv : bv - av;
      });
    }

    return list;
  }, [customers, search, statusFilter, serviceFilter, dateRange, sortField, sortDir]);

  // ─── Pagination ───────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const pageRows = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
    setPage(1);
  };

  const handleSelectAll = () => {
    if (pageRows.every((r) => selectedIds.has(r.id))) {
      const newSet = new Set(selectedIds);
      pageRows.forEach((r) => newSet.delete(r.id));
      setSelectedIds(newSet);
    } else {
      const newSet = new Set(selectedIds);
      pageRows.forEach((r) => newSet.add(r.id));
      setSelectedIds(newSet);
    }
  };

  const handleSelectRow = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const handleOpenAdd = () => {
    setEditingCustomer(undefined);
    setModalOpen(true);
  };

  const handleOpenEdit = async (c: Customer) => {
    const toastId = toast.loading(`Loading patient details for ${c.name || 'patient'}...`);
    try {
      const { data, error } = await supabase
        .from('dental_patients')
        .select('*')
        .eq('id', c.id)
        .single();
      
      if (error) throw error;
      if (data) {
        const mapped: Customer = {
          id: data.id,
          name: data.name,
          phone: data.phone,
          lastVisit: data.last_visit,
          service: data.service,
          totalSpend: Number(data.total_spend || 0),
          status: data.status,
          notes: data.notes,
          avatarColor: data.avatar_color,
          problemTeeth: data.problem_teeth || [],
          xrays: data.xrays || [],
          beforeAfterPhotos: data.before_after_photos || [],
          beforePhoto: data.before_photo,
          beforePhotos: data.before_photos || (data.before_photo ? [data.before_photo] : []),
          profilePhoto: data.profile_photo,
          afterPhoto: data.after_photo,
          afterPhotos: data.after_photos || (data.after_photo ? [data.after_photo] : []),
          prescription: data.prescription,
          allergies: data.allergies || [],
          medicalConditions: data.medical_conditions || [],
          toothNotes: data.tooth_notes || {},
          toothConditions: data.tooth_conditions || {},
          vitals: data.vitals || {},
          activeProgramId: data.active_program_id,
          programEnrollmentDate: data.program_enrollment_date,
          programCurrentStep: data.program_current_step,
          programStatus: data.program_status,
          estimates: data.estimates || []
        };
        setEditingCustomer(mapped);
        setModalOpen(true);
      }
    } catch (err: any) {
      console.error('Failed to load patient details:', err);
      toast.error('Error loading patient details: ' + err.message);
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleCallPatient = (phone: string) => {
    if (!phone) return;
    window.open(`tel:${phone.replace(/[^\d+]/g, '')}`, '_self');
  };

  const handleWhatsAppPatient = (phone: string, name: string) => {
    if (!phone) return;
    const digits = phone.replace(/[^\d]/g, '');
    const message = encodeURIComponent(`Hello ${name}, this is a reminder from the clinic for your upcoming appointment.`);
    window.open(`https://wa.me/${digits}?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  const handleMarkSeen = (id: string) => {
    setDismissedAppointmentIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const sendWhatsAppPrescriptionPDF = async (c: Customer) => {
    try {
      if (!clinicId) return;

      // 1. Fetch clinic configuration
      const { data: clinic } = await supabase
        .from('dental_clinics')
        .select('*')
        .eq('id', clinicId)
        .single();

      if (!clinic || !clinic.whatsapp_phone_number_id || !clinic.whatsapp_access_token) {
        console.warn('WhatsApp API not configured for this clinic, skipping automated PDF.');
        return;
      }

      const wabaPhoneId = clinic.whatsapp_phone_number_id;
      const wabaToken = clinic.whatsapp_access_token ? clinic.whatsapp_access_token.split('|')[0] : '';
      const cleanPhone = c.phone.replace(/[^0-9]/g, '');
      const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

      // Prevent duplicate sends within a 2-minute window to avoid spam
      const { data: recentLogs } = await supabase
        .from('reactivation_audit_logs')
        .select('*')
        .eq('organization_id', clinicId)
        .eq('action', 'waba_message')
        .order('created_at', { ascending: false })
        .limit(3);

      const isDuplicate = recentLogs?.some(log => {
        const details = log.details || {};
        const isSamePhone = details.recipientPhone === formattedPhone;
        const isSameTemplate = details.templateName === 'prescription_pdf_share';
        const isRecent = (new Date().getTime() - new Date(log.created_at).getTime()) < 2 * 60 * 1000; // 2 minutes
        return isSamePhone && isSameTemplate && isRecent;
      });

      if (isDuplicate) {
        console.warn('Skipping duplicate prescription PDF send to prevent spam.');
        return;
      }

      // Fetch doctor full name
      let doctorName = 'Doctor';
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
          doctorName = `${firstName} ${lastName}`.trim() || 'Doctor';
        }
      }

      const clinicInfo = {
        clinicName: clinic.name || 'Dental Clinic',
        doctorName: doctorName,
        qualifications: clinic.timings_note || 'B.D.S., M.D.S. | Dental Specialist',
        address: clinic.address || '',
        phone: clinic.phone || '',
        email: doctorEmail || clinic.email || '',
      };

      // 2. Generate PDF
      const doc = new jsPDF('p', 'mm', 'a4');
      const W = doc.internal.pageSize.getWidth();
      const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      const nextFollowUp = getNextVisitDate(c);

      // Colors
      const PRIMARY_TEAL = [15, 118, 110];
      const TEXT_DARK = [30, 41, 59];
      const TEXT_MUTED = [100, 116, 139];
      const ACCENT_GOLD = [217, 119, 6];
      const BG_LIGHT = [248, 250, 252];
      const BORDER_LIGHT = [226, 232, 240];

      // Draw Top Branded Bar
      doc.setFillColor(PRIMARY_TEAL[0], PRIMARY_TEAL[1], PRIMARY_TEAL[2]);
      doc.rect(0, 0, W, 12, 'F');

      // Gold Accent Line
      doc.setFillColor(ACCENT_GOLD[0], ACCENT_GOLD[1], ACCENT_GOLD[2]);
      doc.rect(0, 12, W, 1.5, 'F');

      // Clinic Info & Logo
      doc.setTextColor(PRIMARY_TEAL[0], PRIMARY_TEAL[1], PRIMARY_TEAL[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.text(clinicInfo.clinicName, 15, 28);

      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
      doc.text(clinicInfo.doctorName, 15, 34);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
      if (clinicInfo.qualifications) {
        doc.text(clinicInfo.qualifications, 15, 38);
      }
      doc.text('Dental Surgeon & Specialist', 15, clinicInfo.qualifications ? 42 : 38);

      // Contact info
      doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      if (clinicInfo.phone) doc.text(clinicInfo.phone, W - 15, 28, { align: 'right' });

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
      doc.setFontSize(9);
      if (clinicInfo.email) doc.text(clinicInfo.email, W - 15, 33, { align: 'right' });

      if (clinicInfo.address) {
        const addrLines = doc.splitTextToSize(clinicInfo.address, 70);
        doc.text(addrLines, W - 15, 38, { align: 'right' });
      }

      // Separator
      doc.setDrawColor(BORDER_LIGHT[0], BORDER_LIGHT[1], BORDER_LIGHT[2]);
      doc.setLineWidth(0.5);
      doc.line(15, 50, W - 15, 50);

      // Patient Details Card
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
      doc.text(c.name || 'Patient', 20, 67);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
      doc.text(`Mobile: ${c.phone || '-'}`, 20, 72);

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

      // Rx Section
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

      // Treatment Plan / Estimates
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

      // Footer
      const footerY = 270;
      doc.setDrawColor(BORDER_LIGHT[0], BORDER_LIGHT[1], BORDER_LIGHT[2]);
      doc.setLineWidth(0.5);
      doc.line(15, footerY - 15, W - 15, footerY - 15);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
      doc.text('This is a digitally generated prescription/receipt. No physical signature is required.', 15, footerY - 5);
      doc.text(`${clinicInfo.clinicName} · Thank you for letting us care for your smile.`, 15, footerY);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
      doc.text("Doctor's Signature", 150, footerY - 5);
      doc.setDrawColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
      doc.line(150, footerY - 1, 195, footerY - 1);

      await addSmileGalleryToPDF(doc, c, {
        clinicName: clinicInfo.clinicName,
        doctorName: clinicInfo.doctorName,
        qualifications: clinicInfo.qualifications,
        phone: clinicInfo.phone,
        logoUrl: clinic.logo_url || ''
      });

      // Upload via serverless function (uses service role key to bypass RLS)
      const pdfBuffer = doc.output('arraybuffer');
      const pdfBytes = new Uint8Array(pdfBuffer);
      let pdfBinary = '';
      const pdfLen = pdfBytes.byteLength;
      for (let i = 0; i < pdfLen; i++) {
        pdfBinary += String.fromCharCode(pdfBytes[i]);
      }
      const pdfBase64 = `data:application/pdf;base64,${btoa(pdfBinary)}`;
      const uniqueFileName = `Rx_Estimate_${c.id || Date.now()}_${Date.now()}.pdf`;

      const uploadRes = await fetch('/api/whatsapp-helper/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pdf: pdfBase64,
          customerId: c.id,
          fileName: uniqueFileName
        })
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok || !uploadData.publicUrl) {
        throw new Error(uploadData.error || 'Failed to upload PDF');
      }

      const publicUrl = uploadData.publicUrl;

      let rxTemplateName = (clinic as any).prescription_template_name;
      if (!rxTemplateName) {
        const syncedTemplates = loadWhatsAppTemplates(clinicId);
        if (syncedTemplates.some(t => t.name === 'prescription_')) {
          rxTemplateName = 'prescription_';
        } else {
          const found = syncedTemplates.find(t => t.name.startsWith('prescription'));
          if (found) rxTemplateName = found.name;
          else rxTemplateName = 'prescription_pdf_share';
        }
      }

      const isPrescriptionUnderscore = rxTemplateName === 'prescription_';
      const components: any[] = [
        {
          type: 'header',
          parameters: [
            {
              type: 'document',
              document: {
                link: publicUrl,
                filename: `Rx_Estimate_${c.name?.replace(/\s+/g, '_') || 'Patient'}.pdf`
              }
            }
          ]
        }
      ];

      if (!isPrescriptionUnderscore) {
        components.push({
          type: 'body',
          parameters: [
            { type: 'text', text: c.name || 'Patient' }
          ]
        });
      }

      // Send payload
      const payload = {
        messaging_product: 'whatsapp',
        to: formattedPhone,
        type: 'template',
        template: {
          name: rxTemplateName,
          language: { code: 'en' },
          components
        }
      };

      const apiRes = await fetch('/api/whatsapp-helper/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          wabaPhoneId,
          wabaToken,
          payload
        })
      });

      const apiData = await apiRes.json();
      if (!apiRes.ok || apiData.ok === false) {
        const errMsg = apiData.error?.message || apiData.error?.error?.message || JSON.stringify(apiData.error) || 'Meta API returned error';
        throw new Error(errMsg);
      }

      toast.success('WhatsApp prescription PDF shared automatically!');
      
      try {
        logWhatsAppMessage(clinicId, {
          recipientName: c.name || 'Patient',
          recipientPhone: c.phone,
          templateName: 'prescription_pdf_share',
          body: `Dear ${c.name || 'Patient'}, please find your digital prescription and care summary attached.`,
          status: 'sent',
          type: 'utility',
          direction: 'outbound',
          variables: [c.name || 'Patient']
        });
      } catch (logErr) {
        console.error('Failed to log WABA message:', logErr);
      }
    } catch (err: any) {
      console.error('Automated WhatsApp PDF dispatch failed:', err);
    }
  };

  const sendWhatsAppBeforeAfter = async (c: Customer) => {
    try {
      if (!clinicId) return;

      const { data: clinic } = await supabase
        .from('dental_clinics')
        .select('*')
        .eq('id', clinicId)
        .single();

      if (!clinic || !clinic.whatsapp_phone_number_id || !clinic.whatsapp_access_token) {
        console.warn('WhatsApp API not configured for this clinic, skipping before/after photo.');
        return;
      }

      const wabaPhoneId = clinic.whatsapp_phone_number_id;
      const wabaToken = clinic.whatsapp_access_token ? clinic.whatsapp_access_token.split('|')[0] : '';
      const cleanPhone = c.phone.replace(/[^0-9]/g, '');
      const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

      let imageUrl = "https://upload.wikimedia.org/wikipedia/commons/e/e0/Placeholder_LCa.png";

      // Determine which photos the patient has
      const beforeSrc = c.beforePhotos?.[0] || c.beforePhoto || null;
      const afterSrc  = c.afterPhotos?.[0]  || c.afterPhoto  || null;
      const combinedSrc = c.beforeAfterPhotos?.[0] || null;

      if (!beforeSrc && !afterSrc && !combinedSrc) {
        toast.error('No before/after photo found for this patient. Please upload a photo first.');
        return;
      }

      toast.info('Generating Smile Gallery image...');

      // Generate branded Smile Gallery image (same as Smile Gallery page)
      let photoBase64: string | null = null;
      try {
        photoBase64 = await generateSmileGalleryImage({
          beforeSrc: combinedSrc ? null : beforeSrc,
          afterSrc:  combinedSrc ? null : afterSrc,
          clinicName:    clinicBranding.clinicName  || 'Dental Clinic',
          treatmentLabel: c.service || 'Smile Makeover',
          doctorName:    clinicBranding.doctorName  || '',
          qualifications: clinicBranding.qualifications || '',
          phone:         clinicBranding.phone        || '',
          logoSrc:       clinicBranding.logoUrl      || null,
        });
        // If we have a combined pre-merged image, overlay it (just use combined as-is with a simple canvas)
        if (combinedSrc && combinedSrc.startsWith('data:image')) {
          photoBase64 = await generateSmileGalleryImage({
            beforeSrc: combinedSrc, afterSrc: null,
            clinicName: clinicBranding.clinicName || 'Dental Clinic',
            treatmentLabel: c.service || 'Smile Makeover',
            doctorName: clinicBranding.doctorName || '',
            qualifications: clinicBranding.qualifications || '',
            phone: clinicBranding.phone || '',
            logoSrc: clinicBranding.logoUrl || null,
          });
        }
      } catch (genErr) {
        console.error('Smile Gallery generation failed, falling back to raw photo:', genErr);
        photoBase64 = combinedSrc || afterSrc || beforeSrc;
      }

      if (photoBase64 && !photoBase64.startsWith('data:')) {
        try {
          const fetchedRes = await fetch(photoBase64);
          const fetchedBlob = await fetchedRes.blob();
          photoBase64 = await new Promise((resolveResolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolveResolve(reader.result as string);
            reader.readAsDataURL(fetchedBlob);
          });
        } catch (convErr) {
          console.error('Failed to convert fallback image URL to base64:', convErr);
        }
      }

      if (!photoBase64) {
        toast.error('Could not generate photo. Please try again.');
        return;
      }

      toast.info('Uploading Smile Gallery image...');
      let mediaId: string | null = null;
      try {
        const uploadRes = await fetch('/api/whatsapp-helper/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: photoBase64,
            customerId: c.id,
            wabaPhoneId,
            wabaToken
          })
        });
        const uploadData = await uploadRes.json();
        if (uploadRes.ok) {
          if (uploadData.mediaId) {
            mediaId = uploadData.mediaId;  // preferred: Meta-hosted media
          }
          if (uploadData.filePath) {
            imageUrl = window.location.origin + '/api/whatsapp-helper/view-image?file=' + encodeURIComponent(uploadData.filePath);
          } else if (uploadData.publicUrl) {
            imageUrl = uploadData.publicUrl;
          }
        } else {
          console.error('Upload error:', uploadData.error || uploadData);
        }
      } catch (uploadErr: any) {
        console.error('Upload fetch error:', uploadErr);
      }

      // Load configurations directly from Supabase columns
      let dbBeforeAfterTemplateName = (clinic as any).before_after_template_name || '';
      
      if (!dbBeforeAfterTemplateName && clinic?.whatsapp_access_token && clinic.whatsapp_access_token.includes('|')) {
        const parts = clinic.whatsapp_access_token.split('|');
        if (parts[3]) dbBeforeAfterTemplateName = parts[3];
      }
      
      if (!dbBeforeAfterTemplateName) {
        const localConfigRaw = localStorage.getItem(`whatsapp_config_${clinicId}`);
        if (localConfigRaw) {
          try {
            const parsed = JSON.parse(localConfigRaw);
            if (parsed.beforeAfterTemplateName) {
              dbBeforeAfterTemplateName = parsed.beforeAfterTemplateName;
            }
          } catch {}
        }
      }

      let templateName = dbBeforeAfterTemplateName;
      if (!templateName) {
        const nameLower = (clinic?.name || clinicBranding.clinicName || '').toLowerCase();
        if (nameLower.includes('shree ram') || nameLower.includes('your dentist')) {
          templateName = 'clinical_image_record';
        } else {
          templateName = 'googlereview';
        }
      }
      const syncedTemplates = loadWhatsAppTemplates(clinicId);
      const baTemplate = syncedTemplates.find(t => t.name === templateName);

      // Prevent duplicate sends within a 2-minute window to avoid spam
      const { data: recentLogs } = await supabase
        .from('reactivation_audit_logs')
        .select('*')
        .eq('organization_id', clinicId)
        .eq('action', 'waba_message')
        .order('created_at', { ascending: false })
        .limit(3);

      const isDuplicate = recentLogs?.some(log => {
        const details = log.details || {};
        const isSamePhone = details.recipientPhone === formattedPhone;
        const isSameTemplate = details.templateName === templateName;
        const isRecent = (new Date().getTime() - new Date(log.created_at).getTime()) < 2 * 60 * 1000; // 2 minutes
        return isSamePhone && isSameTemplate && isRecent;
      });

      if (isDuplicate) {
        console.warn('Skipping duplicate Before/After image template send to prevent spam.');
        return;
      }

      // Load googleReviewUrl from database first, then local storage config
      let googleReviewUrlStr = 'https://maps.app.goo.gl/KJ78ipBjeu7DfV4N9';
      let dbGoogleReviewUrl = (clinic as any).google_review_url || '';
      
      if (!dbGoogleReviewUrl && clinic?.whatsapp_access_token && clinic.whatsapp_access_token.includes('|')) {
        const parts = clinic.whatsapp_access_token.split('|');
        if (parts[2]) dbGoogleReviewUrl = parts[2];
      }
      
      if (dbGoogleReviewUrl) {
        googleReviewUrlStr = dbGoogleReviewUrl;
      } else {
        const localConfigRaw = localStorage.getItem(`whatsapp_config_${clinicId}`);
        if (localConfigRaw) {
          try {
            const parsed = JSON.parse(localConfigRaw);
            if (parsed.googleReviewUrl) {
              googleReviewUrlStr = parsed.googleReviewUrl;
            }
          } catch {}
        }
      }

      // Clean review URL to avoid iOS Google Maps deep link crashes
      const cleanReviewUrl = (url: string) => {
        let cleaned = url.trim();
        try {
          const urlObj = new URL(cleaned);
          urlObj.searchParams.delete('g_st'); // remove the iOS-specific tracking/sharing param
          cleaned = urlObj.toString();
        } catch (e) {}

        let suffix = cleaned;
        if (cleaned.includes('maps.app.goo.gl/')) {
          const parts = cleaned.split('maps.app.goo.gl/');
          suffix = parts[parts.length - 1].split('?')[0];
        } else if (cleaned.includes('g.page/r/')) {
          const parts = cleaned.split('g.page/r/');
          suffix = parts[parts.length - 1].split('?')[0];
        }
        return { full: cleaned, suffix };
      };

      const { full: cleanedUrl, suffix: urlSuffix } = cleanReviewUrl(googleReviewUrlStr);

      const bodyParameters = templateName === 'clinical_image_record' 
        ? [
            { type: 'text', text: c.name || 'Patient' },
            { type: 'text', text: c.service || 'Smile Makeover' },
            { type: 'text', text: clinicBranding.clinicName || clinic?.name || 'Dental Clinic' }
          ]
        : [
            { type: 'text', text: c.name || 'Patient' }
          ];

      const components: any[] = [
        {
          type: 'header',
          parameters: [
            {
              type: 'image',
              image: { link: imageUrl }
            }
          ]
        },
        {
          type: 'body',
          parameters: bodyParameters
        }
      ];

      // Add button parameters if the template uses a dynamic button URL
      if (templateName === 'smile_makeover_google_review' || (baTemplate && baTemplate.hasDynamicButton)) {
        components.push({
          type: 'button',
          sub_type: 'url',
          index: '0',
          parameters: [
            {
              type: 'text',
              text: urlSuffix
            }
          ]
        });
      }

      const templateLanguage = baTemplate?.language || 'en';

      const payload = {
        messaging_product: 'whatsapp',
        to: formattedPhone,
        type: 'template',
        template: {
          name: templateName,
          language: { code: templateLanguage },
          components
        }
      };

      const apiRes = await fetch('/api/whatsapp-helper/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          wabaPhoneId,
          wabaToken,
          payload
        })
      });

      const apiData = await apiRes.json();
      if (!apiRes.ok || apiData.ok === false) {
        const errMsg = apiData.error?.message || apiData.error?.error?.message || JSON.stringify(apiData.error) || 'Meta API returned error';
        throw new Error(errMsg);
      }

      toast.success(`Smile Gallery sent to ${c.name || 'patient'} via WhatsApp! 🦷✨`);

      try {
        logWhatsAppMessage(clinicId, {
          recipientName: c.name || 'Patient',
          recipientPhone: c.phone,
          templateName: templateName,
          body: `Hi ${c.name || 'Patient'}! Look at your incredible smile transformation! 🦷✨`,
          status: 'sent',
          type: 'campaign',
          direction: 'outbound',
          variables: [c.name || 'Patient']
        });
      } catch (logErr) {
        console.error('Failed to log WABA message:', logErr);
      }
    } catch (err: any) {
      console.error('Automated WhatsApp before/after dispatch failed:', err);
      toast.error('Failed to send before/after photo: ' + err.message);
    }
  };

  const handleSave = useCallback(async (c: Customer, isAutosave = false) => {
    if (!clinicId) return;

    const dbRow = {
      clinic_id: clinicId,
      name: c.name,
      phone: c.phone,
      last_visit: c.lastVisit,
      service: c.service,
      total_spend: c.totalSpend,
      status: c.status,
      notes: c.notes,
      avatar_color: c.avatarColor,
      problem_teeth: c.problemTeeth || [],
      xrays: c.xrays || [],
      before_after_photos: c.beforeAfterPhotos || [],
      before_photos: c.beforePhotos || [],
      before_photo: (c.beforePhotos && c.beforePhotos.length > 0) ? c.beforePhotos[0] : null,
      profile_photo: c.profilePhoto || null,
      after_photos: c.afterPhotos || [],
      after_photo: (c.afterPhotos && c.afterPhotos.length > 0) ? c.afterPhotos[0] : null,
      prescription: c.prescription || null,
      allergies: c.allergies || [],
      medical_conditions: c.medicalConditions || [],
      tooth_notes: c.toothNotes || {},
      tooth_conditions: c.toothConditions || {},
      vitals: c.vitals || {},
      active_program_id: c.activeProgramId || null,
      program_enrollment_date: c.programEnrollmentDate || null,
      program_current_step: c.programCurrentStep || null,
      program_status: c.programStatus || null,
      estimates: c.estimates || []
    };

    try {
      const isNew = !c.id || c.id.startsWith('sim-') || c.id === '';
      let savedCustomer = c;
      
      if (isNew) {
        // Insert patient into Supabase
        const { data, error } = await supabase
          .from('dental_patients')
          .insert([dbRow])
          .select()
          .single();

        if (error) throw error;
        if (data) {
          const mapped: Customer = {
            id: data.id,
            name: data.name,
            phone: data.phone,
            lastVisit: data.last_visit,
            service: data.service,
            totalSpend: Number(data.total_spend || 0),
            status: data.status,
            notes: data.notes,
            avatarColor: data.avatar_color,
            problemTeeth: data.problem_teeth || [],
            xrays: data.xrays || [],
            beforeAfterPhotos: data.before_after_photos || [],
            beforePhoto: data.before_photo,
            beforePhotos: data.before_photos || (data.before_photo ? [data.before_photo] : []),
            profilePhoto: data.profile_photo,
            afterPhoto: data.after_photo,
            afterPhotos: data.after_photos || (data.after_photo ? [data.after_photo] : []),
            prescription: data.prescription,
            allergies: data.allergies || [],
            medicalConditions: data.medical_conditions || [],
            toothNotes: data.tooth_notes || {},
            toothConditions: data.tooth_conditions || {},
            vitals: data.vitals || {},
            activeProgramId: data.active_program_id,
            programEnrollmentDate: data.program_enrollment_date,
            programCurrentStep: data.program_current_step,
            programStatus: data.program_status,
            estimates: data.estimates || []
          };
          savedCustomer = mapped;
          setCustomers((prev) => [mapped, ...prev]);
          if (isAutosave) {
            setEditingCustomer(mapped);
          }
        }
      } else {
        // Update patient in Supabase
        const { data, error } = await supabase
          .from('dental_patients')
          .update(dbRow)
          .eq('id', c.id)
          .select()
          .single();

        if (error) throw error;
        if (data) {
          const mapped: Customer = {
            id: data.id,
            name: data.name,
            phone: data.phone,
            lastVisit: data.last_visit,
            service: data.service,
            totalSpend: Number(data.total_spend || 0),
            status: data.status,
            notes: data.notes,
            avatarColor: data.avatar_color,
            problemTeeth: data.problem_teeth || [],
            xrays: data.xrays || [],
            beforeAfterPhotos: data.before_after_photos || [],
            beforePhoto: data.before_photo,
            beforePhotos: data.before_photos || (data.before_photo ? [data.before_photo] : []),
            profilePhoto: data.profile_photo,
            afterPhoto: data.after_photo,
            afterPhotos: data.after_photos || (data.after_photo ? [data.after_photo] : []),
            prescription: data.prescription,
            allergies: data.allergies || [],
            medicalConditions: data.medical_conditions || [],
            toothNotes: data.tooth_notes || {},
            toothConditions: data.tooth_conditions || {},
            vitals: data.vitals || {},
            activeProgramId: data.active_program_id,
            programEnrollmentDate: data.program_enrollment_date,
            programCurrentStep: data.program_current_step,
            programStatus: data.program_status,
            estimates: data.estimates || []
          };
          savedCustomer = mapped;
          setCustomers((prev) => prev.map((x) => x.id === mapped.id ? mapped : x));
          if (isAutosave) {
            setEditingCustomer(mapped);
          }
        }
      }

      const oldCustomer = editingCustomer;

      // Automatically send PDF on save if there is a prescription or billing estimate and it is newly updated (skip on autosave)
      const oldPrescription = editingCustomer?.prescription || '';
      const newPrescription = savedCustomer.prescription || '';
      const oldEstimatesStr = JSON.stringify(editingCustomer?.estimates || []);
      const newEstimatesStr = JSON.stringify(savedCustomer.estimates || []);

      const isPrescriptionNew = !editingCustomer || 
        (newPrescription !== oldPrescription) || 
        (newEstimatesStr !== oldEstimatesStr);

      if (!isAutosave && isPrescriptionNew && ((newPrescription.trim() !== '') || (savedCustomer.estimates && savedCustomer.estimates.length > 0))) {
        sendWhatsAppPrescriptionPDF(savedCustomer).catch(err => console.error('Automated WhatsApp dispatch failed:', err));
      }

      // Automatically send Before/After (Smile Gallery branded) on save if both before & after photos exist and are newly updated (skip autosave)
      const oldBeforePhotos = oldCustomer?.beforePhotos || (oldCustomer?.beforePhoto ? [oldCustomer.beforePhoto] : []);
      const newBeforePhotos = savedCustomer.beforePhotos || (savedCustomer.beforePhoto ? [savedCustomer.beforePhoto] : []);
      const oldAfterPhotos = oldCustomer?.afterPhotos || (oldCustomer?.afterPhoto ? [oldCustomer.afterPhoto] : []);
      const newAfterPhotos = savedCustomer.afterPhotos || (savedCustomer.afterPhoto ? [savedCustomer.afterPhoto] : []);

      const isBeforeChanged = oldBeforePhotos.length !== newBeforePhotos.length || 
        oldBeforePhotos.some((val, idx) => val !== newBeforePhotos[idx]);
      const isAfterChanged = oldAfterPhotos.length !== newAfterPhotos.length || 
        oldAfterPhotos.some((val, idx) => val !== newAfterPhotos[idx]);

      const isPhotoNew = !oldCustomer || isBeforeChanged || isAfterChanged;

      if (!isAutosave && 
          ((savedCustomer.beforePhoto && savedCustomer.afterPhoto) || (newBeforePhotos.length > 0 && newAfterPhotos.length > 0)) && 
          isPhotoNew) {
        sendWhatsAppBeforeAfter(savedCustomer).catch(err => console.error('Automated WhatsApp B&A photo dispatch failed:', err));
      }

      // Automatically insert/upsert corresponding appointment in dental_appointments if a Visit Date is specified
      if (!isAutosave && savedCustomer.lastVisit) {
        try {
          const { data: clinic } = await supabase
            .from('dental_clinics')
            .select('*')
            .eq('id', clinicId)
            .single();
          
          let doctorName = 'Doctor';
          let whatsappBusinessPhone = '';
          let whatsappPhoneNumberId = '';
          let whatsappAccessToken = '';
          if (clinic) {
            whatsappBusinessPhone = clinic.phone || '';
            whatsappPhoneNumberId = clinic.whatsapp_phone_number_id || '';
            whatsappAccessToken = (clinic.whatsapp_access_token || '').split('|')[0];
            
            if (clinic.owner_id) {
              const { data: ownerProfile } = await supabase
                .from('profiles')
                .select('first_name, last_name')
                .eq('id', clinic.owner_id)
                .single();
              if (ownerProfile) {
                const firstName = (ownerProfile as any).first_name || '';
                const lastName = (ownerProfile as any).last_name || '';
                doctorName = `${firstName} ${lastName}`.trim() || 'Doctor';
              }
            }
          }

          const apptDate = savedCustomer.lastVisit;
          const apptTime = '10:00 AM'; // Default time
          const treatmentName = savedCustomer.service || 'Dental Consultation';

          const insertApptRow = {
            clinic_id: clinicId,
            patient_id: savedCustomer.id,
            patient_name: savedCustomer.name,
            patient_phone: savedCustomer.phone,
            appointment_date: apptDate,
            appointment_time: apptTime,
            doctor_name: doctorName,
            treatment_name: treatmentName,
            status: 'Confirmed' as const
          };

          // Check if appointment already exists for this patient on this date
          const { data: existingAppts } = await supabase
            .from('dental_appointments')
            .select('id')
            .eq('patient_id', savedCustomer.id)
            .eq('appointment_date', apptDate);

          if (!existingAppts || existingAppts.length === 0) {
            const { error: apptError } = await supabase
              .from('dental_appointments')
              .insert(insertApptRow);

            if (!apptError) {
              toast.success(`Appointment booked automatically for ${apptDate}`);
              
              // Trigger automated WhatsApp confirmation using approved Meta template if configured
              if (whatsappPhoneNumberId && whatsappAccessToken) {
                const cleanPhone = savedCustomer.phone.replace(/[^0-9]/g, '');
                const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
                const formattedDateString = new Date(apptDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

                const syncedTemplates = loadWhatsAppTemplates(clinicId);
                let fallbackBookingName = (clinic as any).booking_template_name;
                if (!fallbackBookingName) {
                  fallbackBookingName = 'booking';
                  const nameLower = (clinic?.name || '').toLowerCase();
                  if (nameLower.includes('shree ram')) {
                    fallbackBookingName = 'appointment_booking_confirmation';
                  }
                }

                const bookingTemplate = syncedTemplates.find(t => 
                  t.name === 'booking' ||
                  t.name.startsWith('appointment_confirm') || 
                  t.name.startsWith('appointment_book') || 
                  t.name === 'appointment_booking_confirmation'
                ) || { 
                  name: fallbackBookingName, 
                  language: 'en',
                  body: fallbackBookingName === 'booking'
                    ? '🦷 Appointment Confirmed. Hi {{1}}, your appointment has been confirmed for {{2}} at {{3}}.'
                    : 'Hello {{1}}, this is a confirmation for your appointment on {{2}} at {{3}} with {{4}}. Contact {{5}} for queries.'
                };

                const templateBody = bookingTemplate.body || 'Hello {{1}}, this is a confirmation for your appointment on {{2}} at {{3}} with {{4}}. Contact {{5}} for queries.';
                const getTemplateVariablesCount = (bodyText: string) => {
                  const matches = bodyText.match(/\{\{(\d+)\}\}/g);
                  if (!matches) return 0;
                  const nums = matches.map(m => parseInt(m.replace(/[\{\}]/g, ''), 10));
                  return Math.max(...nums, 0);
                };

                const isYourDentist = clinicId === '8800a4c7-a1f5-4edd-8fe8-f698c5928478';
                const finalApptTime = (isYourDentist && bookingTemplate.name === 'booking')
                  ? `${apptTime}\n📍 Directions: https://maps.google.com/?q=YOUR+DENTIST+Tara+Kunj+Road+No+1F+Patliputra+Colony+Patna`
                  : apptTime;

                const paramCount = getTemplateVariablesCount(templateBody);
                const allPossibleParameters = [
                  { type: 'text', text: savedCustomer.name },
                  { type: 'text', text: formattedDateString },
                  { type: 'text', text: finalApptTime },
                  { type: 'text', text: doctorName },
                  { type: 'text', text: whatsappBusinessPhone || '+91 75448 60350' }
                ];
                const parameters = allPossibleParameters.slice(0, paramCount);

                const payload = {
                  messaging_product: 'whatsapp',
                  to: formattedPhone,
                  type: 'template',
                  template: {
                    name: bookingTemplate.name,
                    language: { code: bookingTemplate.language },
                    components: [
                      {
                        type: 'body',
                        parameters
                      }
                    ]
                  }
                };

                await fetch('/api/whatsapp-helper/send-message', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    wabaPhoneId: whatsappPhoneNumberId,
                    wabaToken: whatsappAccessToken,
                    payload
                  })
                });
                toast.success('WhatsApp appointment alert sent automatically!');

                try {
                  const paramTexts = parameters.map(p => p.text);
                  let finalBody = templateBody;
                  paramTexts.forEach((txt, idx) => {
                    finalBody = finalBody.split(`{{${idx + 1}}}`).join(txt);
                  });
                  logWhatsAppMessage(clinicId, {
                    recipientName: savedCustomer.name,
                    recipientPhone: savedCustomer.phone,
                    templateName: bookingTemplate.name,
                    body: finalBody,
                    status: 'sent',
                    type: 'utility',
                    direction: 'outbound',
                    variables: paramTexts
                  });
                } catch (logErr) {
                  console.error('Failed to log WABA message:', logErr);
                }
              }
            }
          }
        } catch (apptErr) {
          console.error('Error inserting auto-appointment:', apptErr);
        }
      }
    } catch (err) {
      console.error('Error saving patient to database:', err);
    }
  }, [clinicId, editingCustomer]);

  const handleDelete = async (id: string) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this patient record? This action cannot be undone.");
    if (!isConfirmed) return;

    try {
      const { error } = await supabase
        .from('dental_patients')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCustomers((prev) => prev.filter((c) => c.id !== id));
      const newSet = new Set(selectedIds);
      newSet.delete(id);
      setSelectedIds(newSet);
      toast.success("Patient record deleted successfully.");
    } catch (err) {
      console.error('Error deleting patient from database:', err);
    }
  };



  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('All');
    setServiceFilter('All Services');
    setDateRange('all');
    setSortField(null);
    setSortDir('desc');
    setPage(1);
  };

  const allPageSelected = pageRows.length > 0 && pageRows.every((r) => selectedIds.has(r.id));
  const somePageSelected = pageRows.some((r) => selectedIds.has(r.id));

  // ─── Dropdown select styling ──────────────────────────────────────────────
  const selectTriggerClass =
    'h-9 text-[12px] text-slate-600 bg-white border-slate-200 hover:bg-slate-50 focus:ring-indigo-500/30 rounded-lg transition-all duration-150 min-w-[130px]';

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex flex-col gap-5 min-h-full pb-6">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[20px] sm:text-[22px] font-bold text-slate-800 tracking-tight">
                Patient Database
              </h1>
              <span
                className="px-2.5 py-1 rounded-full text-[11px] font-bold text-indigo-700 tracking-wide shrink-0 border border-indigo-200/60 bg-indigo-50"
              >
                {stats.total.toLocaleString('en-IN')} patients
              </span>
            </div>
            <p className="text-slate-600 text-[12px] sm:text-[13px] mt-1">
              Manage and track your patient relationships
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-stretch sm:justify-start">
            <button
              onClick={handleOpenAdd}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold text-white transition-all duration-150 hover:opacity-90 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
              }}
            >
              <Plus size={15} />
              Add Patient
            </button>
          </div>
        </motion.div>

        {/* ── Stats Row ────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.06, ease: 'easeOut' }}
          className="grid grid-cols-3 lg:flex lg:items-center gap-2 sm:gap-2.5 w-full"
        >
          <StatChip
            label="Total"
            value={stats.total.toLocaleString('en-IN')}
            icon={<Users size={13} className="text-slate-400" />}
          />
          <StatChip
            label="Active"
            value={stats.active.toLocaleString('en-IN')}
            dot="bg-emerald-500"
          />
          <StatChip
            label="Inactive"
            value={stats.inactive.toLocaleString('en-IN')}
            dot="bg-amber-500"
          />
        </motion.div>

        {/* ── Today’s Appointments ───────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.09, ease: 'easeOut' }}
          className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"
          style={{ boxShadow: '0 10px 30px rgba(15,23,42,0.04)' }}
        >
          <div className="flex items-center justify-between gap-3 mb-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-slate-600 font-semibold">Doctor Queue</p>
              <h2 className="text-sm sm:text-base font-bold text-slate-800">Today&apos;s Appointments</h2>
            </div>
            <div className="text-[11px] text-slate-600 font-medium">
              Based on patient follow-up and treatment history
            </div>
          </div>

          {upcomingAppointments.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
              No appointments due today or in the next 7 days.
            </div>
          ) : (
            <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
              {upcomingAppointments.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 truncate">{item.name}</p>
                      <p className="text-[12px] text-slate-500 truncate">{item.phone}</p>
                    </div>
                    <span
                      className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.overdue
                          ? 'bg-rose-50 border border-rose-200 text-rose-800'
                          : item.appointmentWindow === 'today'
                          ? 'bg-emerald-50 border border-emerald-250 text-emerald-800'
                          : 'bg-amber-50 border border-amber-200/70 text-amber-800'
                      }`}
                    >
                      {item.overdue ? 'Overdue' : item.appointmentWindow}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3 text-[12px]">
                    <span className="text-slate-600 font-medium">{item.service}</span>
                    <span className="font-semibold text-slate-800">
                      {formatDate(item.nextVisitDate)}
                    </span>
                  </div>
                  <div className="mt-2 text-[11.5px] font-medium text-slate-600">
                    {item.dueLabel}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleCallPatient(item.phone)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                    >
                      <Phone size={12} />
                      Call
                    </button>
                    <button
                      type="button"
                      onClick={() => handleWhatsAppPatient(item.phone, item.name)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                    >
                      <MessageSquare size={12} />
                      WhatsApp
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMarkSeen(item.id)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100"
                    >
                      <UserCheck size={12} />
                      Mark Seen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* ── Filter Bar ───────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.1, ease: 'easeOut' }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 items-center"
          style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: 14,
            padding: '12px 16px',
          }}
        >
          {/* Search */}
          <div className="relative col-span-2 sm:col-span-2 lg:col-span-1 w-full">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              className="w-full pl-9 pr-3 py-2 rounded-lg text-[12px] text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-150 focus:ring-1 focus:ring-indigo-500/40"
              style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
              }}
              placeholder="Search name or phone…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          {/* Status filter */}
          <div className="col-span-1 lg:col-span-1 w-full">
            <Select
              value={statusFilter}
              onValueChange={(v) => { setStatusFilter(v); setPage(1); }}
            >
              <SelectTrigger className={`${selectTriggerClass} w-full`}>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent
                style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}
                className="text-slate-700"
              >
                <SelectItem value="All">All Statuses</SelectItem>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Service filter */}
          <div className="col-span-1 lg:col-span-1 w-full">
            <Select
              value={serviceFilter}
              onValueChange={(v) => { setServiceFilter(v); setPage(1); }}
            >
              <SelectTrigger className={`${selectTriggerClass} w-full`}>
                <SelectValue placeholder="All Services" />
              </SelectTrigger>
              <SelectContent
                style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}
                className="text-slate-700 max-h-[260px] overflow-y-auto"
              >
                {SERVICES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date range */}
          <div className="col-span-1 lg:col-span-1 w-full">
            <Select
              value={dateRange}
              onValueChange={(v) => { setDateRange(v); setPage(1); }}
            >
              <SelectTrigger className={`${selectTriggerClass} w-full`}>
                <SelectValue placeholder="Any time" />
              </SelectTrigger>
              <SelectContent
                style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}
                className="text-slate-700"
              >
                {DATE_RANGES.map((r) => (
                  <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reset */}
          <div className="col-span-1 lg:col-span-1 w-full">
            <button
              onClick={handleResetFilters}
              className="flex items-center justify-center gap-1.5 px-3 h-9 rounded-lg text-[12px] font-medium text-slate-500 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors duration-150 border border-slate-200/60 w-full"
            >
              <RotateCcw size={13} />
              Reset
            </button>
          </div>
        </motion.div>

        {/* ── Mobile Cards ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: 0.14, ease: 'easeOut' }}
          className="md:hidden rounded-2xl overflow-hidden flex-1"
          style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
          }}
        >
          <div className="p-3 space-y-3">
            {pageRows.length === 0 ? (
              <div className="py-14 text-center text-slate-400 text-[13px]">
                No patients match your filters.
              </div>
            ) : (
              pageRows.map((customer) => {
                const isSelected = selectedIds.has(customer.id);
                return (
                  <button
                    key={customer.id}
                    type="button"
                    onClick={() => handleOpenEdit(customer)}
                    className="w-full text-left rounded-2xl border p-4 transition-all duration-150 active:scale-[0.99]"
                    style={{
                      background: isSelected ? 'rgba(99,102,241,0.05)' : '#FFFFFF',
                      borderColor: isSelected ? 'rgba(99,102,241,0.25)' : '#E2E8F0',
                      boxShadow: '0 10px 30px rgba(15,23,42,0.04)',
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <Avatar name={customer.name} color={customer.avatarColor} size="sm" profilePhoto={customer.profilePhoto} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-[14px] font-semibold text-slate-800 truncate">
                              {customer.name}
                            </span>
                            {((customer.allergies && customer.allergies.length > 0) || (customer.medicalConditions && customer.medicalConditions.length > 0)) && (
                              <span
                                className="w-2 h-2 rounded-full bg-rose-500 shrink-0"
                                title="Clinical alert"
                              />
                            )}
                          </div>
                          <div className="mt-1 text-[12px] text-slate-500 font-mono">
                            {customer.phone}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <StatusBadge status={customer.status} />
                        <span
                          role="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(customer.id);
                          }}
                          className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-100 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all shadow-sm shrink-0 cursor-pointer"
                          title="Delete Patient"
                        >
                          <Trash2 size={13} />
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 text-[12px]">
                      <div className="rounded-xl bg-slate-50 border border-slate-200 px-2 py-2">
                        <div className="text-slate-400 text-[9px] uppercase tracking-wider">Last visit</div>
                        <div className="text-slate-700 font-medium mt-0.5 text-[11px] leading-tight truncate">{formatDate(customer.lastVisit)}</div>
                        <div className="text-slate-400 text-[10px] mt-0.5 truncate">{timeAgo(customer.lastVisit)}</div>
                      </div>
                      <div className="rounded-xl bg-indigo-50/40 border border-indigo-100/60 px-2 py-2">
                        <div className="text-indigo-400 text-[9px] uppercase tracking-wider">Follow-Up</div>
                        {(() => {
                          const nextDate = getNextVisitDate(customer);
                          if (nextDate) {
                            return (
                              <>
                                <div className="text-indigo-600 font-semibold mt-0.5 text-[11px] leading-tight truncate">{formatDate(nextDate)}</div>
                                <div className="text-indigo-400 text-[10px] mt-0.5 truncate">{formatFollowUpTime(nextDate)}</div>
                              </>
                            );
                          }
                          return (
                            <div className="text-slate-400 font-medium mt-0.5 text-[11px] leading-tight italic truncate">Not Set</div>
                          );
                        })()}
                      </div>
                      <div className="rounded-xl bg-slate-50 border border-slate-200 px-2 py-2">
                        <div className="text-slate-400 text-[9px] uppercase tracking-wider">Paid so far</div>
                        <div className="text-emerald-500 font-semibold mt-0.5 text-[11px] leading-tight truncate">{formatSpend(customer.totalSpend)}</div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Treatment</div>
                      <div className="text-[13px] text-slate-700 mt-1">{customer.service}</div>
                      {customer.problemTeeth && customer.problemTeeth.length > 0 && (
                        <div className="mt-1 text-[11px] text-rose-400 font-semibold">
                          Teeth: {customer.problemTeeth.join(', ')}
                        </div>
                      )}
                    </div>

                    {customer.notes ? (
                      <p className="mt-3 text-[12px] text-slate-500 leading-relaxed line-clamp-2">
                        {customer.notes}
                      </p>
                    ) : (
                      <p className="mt-3 text-[12px] text-slate-300 italic">No notes</p>
                    )}

                    <div className="mt-3 pt-3 border-t border-slate-100 flex justify-end gap-2 flex-wrap">
                      {(customer.prescription || (customer.estimates && customer.estimates.length > 0)) && (
                        <>
                          <span
                            role="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadPrescriptionPDF(customer);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10.5px] font-bold border border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-700 transition-all shadow-sm cursor-pointer"
                          >
                            <Download size={11} />
                            Download Rx
                          </span>
                          <span
                            role="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              sendWhatsAppPrescriptionPDF(customer);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10.5px] font-bold border border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-700 transition-all shadow-sm cursor-pointer"
                          >
                            <Send size={11} />
                            Send Rx (WA)
                          </span>
                        </>
                      )}
                      {((customer.beforeAfterPhotos && customer.beforeAfterPhotos.length > 0) || (customer.beforePhotos && customer.beforePhotos.length > 0) || (customer.afterPhotos && customer.afterPhotos.length > 0) || customer.beforePhoto || customer.afterPhoto) && (
                        <span
                          role="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            sendWhatsAppBeforeAfter(customer);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10.5px] font-bold border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-all shadow-sm cursor-pointer"
                        >
                          <Send size={11} />
                          Send Before/After (WA)
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </motion.div>

        {/* ── Table ────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: 0.14, ease: 'easeOut' }}
          className="hidden md:block rounded-2xl overflow-hidden flex-1"
          style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
                  {/* Checkbox */}
                  <th className="pl-5 pr-2 py-3.5 w-10">
                    <button
                      onClick={handleSelectAll}
                      className="text-slate-300 hover:text-slate-500 transition-colors"
                    >
                      {allPageSelected ? (
                        <CheckSquare size={15} className="text-indigo-500" />
                      ) : somePageSelected ? (
                        <CheckSquare size={15} className="text-slate-400" />
                      ) : (
                        <Square size={15} />
                      )}
                    </button>
                  </th>

                  {[
                    { label: 'Patient', w: 'min-w-[160px]', sortKey: null },
                    { label: 'Phone', w: 'min-w-[140px]', sortKey: null },
                    { label: 'Last Visit', w: 'min-w-[160px]', sortKey: 'lastVisit' as SortField },
                    { label: 'Next Follow-Up', w: 'min-w-[160px]', sortKey: null },
                    { label: 'Service', w: 'min-w-[160px]', sortKey: null },
                    { label: 'Total Spend', w: 'min-w-[120px]', sortKey: 'totalSpend' as SortField },
                    { label: 'Status', w: 'min-w-[150px]', sortKey: null },
                    { label: 'Notes', w: 'min-w-[180px]', sortKey: null },
                    { label: '', w: 'w-12', sortKey: null },
                  ].map((col) => (
                    <th
                      key={col.label}
                      className={`px-3 py-3.5 text-left ${col.w}`}
                    >
                      <button
                        className={`flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase ${
                          col.sortKey ? 'cursor-pointer hover:text-slate-600' : 'cursor-default'
                        } text-slate-400 transition-colors duration-150`}
                        onClick={() => col.sortKey && handleSort(col.sortKey)}
                        disabled={!col.sortKey}
                      >
                        {col.label}
                        {col.sortKey && (
                          <SortIcon field={col.sortKey} active={sortField} dir={sortDir} />
                        )}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                <AnimatePresence mode="popLayout">
                  {pageRows.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-16 text-center text-slate-400 text-[13px]">
                        No customers match your filters.
                      </td>
                    </tr>
                  ) : (
                    pageRows.map((customer, i) => {
                      const isSelected = selectedIds.has(customer.id);
                      return (
                        <motion.tr
                          key={customer.id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.18, delay: i * 0.03, ease: 'easeOut' }}
                          onClick={() => handleOpenEdit(customer)}
                          className="group cursor-pointer transition-all duration-100"
                          style={{
                            borderBottom: '1px solid #F1F5F9',
                            background: isSelected
                              ? 'rgba(99,102,241,0.05)'
                              : undefined,
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected)
                              (e.currentTarget as HTMLTableRowElement).style.background =
                                '#F8FAFC';
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLTableRowElement).style.background = isSelected
                              ? 'rgba(99,102,241,0.07)'
                              : '';
                          }}
                        >
                          {/* Checkbox */}
                          <td className="pl-5 pr-2 py-3.5" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => handleSelectRow(customer.id)}
                              className="text-slate-300 hover:text-slate-500 transition-colors"
                            >
                              {isSelected ? (
                                <CheckSquare size={15} className="text-indigo-500" />
                              ) : (
                                <Square size={15} />
                              )}
                            </button>
                          </td>

                          {/* Name + Avatar */}
                          <td className="px-3 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <Avatar name={customer.name} color={customer.avatarColor} profilePhoto={customer.profilePhoto} />
                              <div className="flex flex-col gap-0.5">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[13px] font-semibold text-slate-800 leading-tight">
                                    {customer.name}
                                  </span>
                                  {((customer.allergies && customer.allergies.length > 0) || (customer.medicalConditions && customer.medicalConditions.length > 0)) && (
                                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" title="Clinical Alert: Review medical history before treatment" />
                                  )}
                                </div>
                                {((customer.allergies && customer.allergies.length > 0) || (customer.medicalConditions && customer.medicalConditions.length > 0)) && (
                                  <div className="flex flex-wrap gap-1 mt-0.5 max-w-[200px]">
                                    {(() => {
                                      const allAlerts = [...(customer.allergies || []), ...(customer.medicalConditions || [])];
                                      const maxVisible = 1;
                                      const visible = allAlerts.slice(0, maxVisible);
                                      const extra = allAlerts.length - maxVisible;
                                      return (
                                        <>
                                          {visible.map((alert) => (
                                            <span key={alert} className="px-1.5 py-0.5 bg-rose-50 border border-rose-200 rounded text-[8.5px] font-extrabold uppercase tracking-widest text-rose-600">
                                              {alert}
                                            </span>
                                          ))}
                                          {extra > 0 && (
                                            <span className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[8.5px] font-bold text-slate-500">
                                              +{extra}
                                            </span>
                                          )}
                                        </>
                                      );
                                    })()}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Phone */}
                          <td className="px-3 py-3.5">
                            <span className="text-[12px] text-slate-500 font-mono tracking-wide">
                              {customer.phone}
                            </span>
                          </td>

                          {/* Last Visit */}
                          <td className="px-3 py-3.5">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[12px] text-slate-700 font-medium">
                                {formatDate(customer.lastVisit)}
                              </span>
                              <span className="text-[11px] text-slate-400">
                                {timeAgo(customer.lastVisit)}
                              </span>
                            </div>
                          </td>

                          {/* Next Follow-Up */}
                          <td className="px-3 py-3.5">
                            {(() => {
                              const nextDate = getNextVisitDate(customer);
                              if (nextDate) {
                                return (
                                  <div className="flex flex-col gap-0.5">
                                    <span className="text-[12px] text-indigo-600 font-medium">
                                      {formatDate(nextDate)}
                                    </span>
                                    <span className="text-[11px] text-indigo-400 font-semibold">
                                      {formatFollowUpTime(nextDate)}
                                    </span>
                                  </div>
                                );
                              }
                              return (
                                <span className="text-[12px] text-slate-400 italic">Not Set</span>
                              );
                            })()}
                          </td>

                          {/* Service */}
                          <td className="px-3 py-3.5">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[12px] text-slate-600">{customer.service}</span>
                              {customer.problemTeeth && customer.problemTeeth.length > 0 && (
                                <span className="text-[10px] text-rose-400 font-semibold tracking-wide flex items-center gap-1 mt-0.5">
                                  🦷 Teeth: {customer.problemTeeth.join(', ')}
                                </span>
                              )}
                              {customer.xrays && customer.xrays.length > 0 && (
                                <span className="text-[9px] text-cyan-400 font-bold uppercase tracking-wider mt-0.5">
                                  📸 X-Ray Attached
                                </span>
                              )}
                              {(customer.beforePhoto || customer.afterPhoto) && (
                                <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider mt-0.5">
                                  🖼️ {customer.beforePhoto && customer.afterPhoto ? 'Before & After' : customer.beforePhoto ? 'Before Photo' : 'After Photo'}
                                </span>
                              )}
                              {customer.vitals && (customer.vitals.bp || customer.vitals.pulse || customer.vitals.temp) && (
                                <span className="text-[9.5px] text-indigo-400 font-medium tracking-wide flex items-center gap-1 mt-0.5" title="Latest clinical vitals (BP, Heart Rate, Temperature)">
                                  🩺 {[
                                    customer.vitals.bp && `BP ${customer.vitals.bp}`,
                                    customer.vitals.pulse && `HR ${customer.vitals.pulse}`,
                                    customer.vitals.temp && `${customer.vitals.temp}`
                                  ].filter(Boolean).join(' | ')}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Total Spend */}
                          <td className="px-3 py-3.5">
                            <span className="text-[13px] font-semibold text-emerald-400">
                              {formatSpend(customer.totalSpend)}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-3 py-3.5">
                            <StatusBadge status={customer.status} />
                          </td>

                          {/* Notes */}
                          <td className="px-3 py-3.5 max-w-[180px]">
                            {customer.notes ? (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="text-[12px] text-slate-500 truncate block max-w-[160px] cursor-default">
                                    {customer.notes}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent
                                  side="top"
                                  className="max-w-[240px] text-[12px] leading-relaxed"
                                  style={{
                                    background: '#1E293B',
                                    border: '1px solid #334155',
                                    color: '#F1F5F9',
                                  }}
                                >
                                  {customer.notes}
                                </TooltipContent>
                              </Tooltip>
                            ) : (
                              <span className="text-[12px] text-slate-300 italic">No notes</span>
                            )}
                          </td>

                          {/* Actions */}
                          <td
                            className="px-3 py-3.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all duration-150 opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                                  <MoreHorizontal size={15} />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="w-44 text-[12px]"
                                style={{
                                  background: '#FFFFFF',
                                  border: '1px solid #E2E8F0',
                                  color: '#1E293B',
                                }}
                              >
                                <DropdownMenuItem
                                  onClick={() => handleOpenEdit(customer)}
                                  className="gap-2.5 cursor-pointer hover:bg-slate-50 focus:bg-slate-50"
                                >
                                  <Eye size={13} className="text-slate-400" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleOpenEdit(customer)}
                                  className="gap-2.5 cursor-pointer hover:bg-slate-50 focus:bg-slate-50"
                                >
                                  <Edit3 size={13} className="text-slate-400" />
                                  Edit
                                </DropdownMenuItem>
                                 {(customer.prescription || (customer.estimates && customer.estimates.length > 0)) && (
                                   <>
                                    <DropdownMenuItem
                                      onClick={() => downloadPrescriptionPDF(customer)}
                                      className="gap-2.5 cursor-pointer hover:bg-slate-50 focus:bg-slate-50 text-teal-600 hover:text-teal-700 font-semibold"
                                    >
                                      <Download size={13} className="text-teal-500" />
                                      Download Prescription
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => sendWhatsAppPrescriptionPDF(customer)}
                                      className="gap-2.5 cursor-pointer hover:bg-slate-50 focus:bg-slate-50 text-teal-600 hover:text-teal-700 font-semibold"
                                    >
                                      <Send size={13} className="text-teal-500" />
                                      Send Prescription (WA)
                                    </DropdownMenuItem>
                                  </>
                                )}
                                <DropdownMenuItem
                                  className="gap-2.5 cursor-pointer hover:bg-slate-50 focus:bg-slate-50"
                                >
                                  <MessageSquare size={13} className="text-slate-400" />
                                  Send Message
                                </DropdownMenuItem>

                                <DropdownMenuSeparator className="bg-slate-200" />
                                <DropdownMenuItem
                                  onClick={() => handleDelete(customer.id)}
                                  className="gap-2.5 cursor-pointer hover:bg-red-500/10 focus:bg-red-500/10"
                                >
                                  <Trash2 size={13} className="text-red-400" />
                                  <span className="text-red-400">Delete</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* ── Pagination ───────────────────────────────────────────────── */}
          <div
            className="flex items-center justify-between px-5 py-3.5"
            style={{ borderTop: '1px solid #E2E8F0' }}
          >
            <span className="text-[12px] text-slate-400">
              Showing{' '}
              <span className="text-slate-600 font-medium">
                {Math.min((page - 1) * ROWS_PER_PAGE + 1, filtered.length)}–
                {Math.min(page * ROWS_PER_PAGE, filtered.length)}
              </span>{' '}
              of{' '}
              <span className="text-slate-600 font-medium">{filtered.length}</span> results
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-150"
              >
                <ChevronLeft size={14} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                  if (idx > 0 && typeof arr[idx - 1] === 'number' && (p as number) - (arr[idx - 1] as number) > 1) {
                    acc.push('...');
                  }
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === '...' ? (
                    <span key={`dots-${i}`} className="text-slate-300 text-[12px] px-1">
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p as number)}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-[12px] font-medium transition-all duration-150 ${
                        page === p
                          ? 'text-white'
                          : 'text-white/40 hover:text-white/70 hover:bg-white/[0.06]'
                      }`}
                      style={
                        page === p
                          ? {
                              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                            }
                          : {}
                      }
                    >
                      {p}
                    </button>
                  )
                )}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-150"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Bulk Action Bar ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: 'spring', stiffness: 420, damping: 36 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <div
              className="flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl"
              style={{
                background: 'rgba(13,18,32,0.95)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.2)',
              }}
            >
              <div className="flex items-center gap-2 pr-3" style={{ borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
                >
                  {selectedIds.size}
                </div>
                <span className="text-[13px] text-white/70 font-medium whitespace-nowrap">
                  {selectedIds.size === 1 ? '1 selected' : `${selectedIds.size} selected`}
                </span>
              </div>

              <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-[12px] font-semibold text-white transition-all duration-150 hover:opacity-90 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' }}>
                <Send size={13} />
                Send Campaign
              </button>

              <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-[12px] font-medium text-white/70 hover:text-white hover:bg-white/[0.08] transition-all duration-150"
                style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                <RefreshCw size={13} />
                Change Status
              </button>

              <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-[12px] font-medium text-red-400 hover:bg-red-500/10 transition-all duration-150"
                style={{ border: '1px solid rgba(239,68,68,0.2)' }}
                onClick={async () => {
                  try {
                    const idsArray = Array.from(selectedIds);
                    const { error } = await supabase
                      .from('dental_patients')
                      .delete()
                      .in('id', idsArray);

                    if (error) throw error;

                    setCustomers((prev) => prev.filter((c) => !selectedIds.has(c.id)));
                    setSelectedIds(new Set());
                  } catch (err) {
                    console.error('Error performing bulk delete:', err);
                  }
                }}>
                <Trash2 size={13} />
                Delete
              </button>

              <button
                onClick={() => setSelectedIds(new Set())}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-all duration-150 ml-1"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Modal ────────────────────────────────────────────────────────────── */}
      <CustomerModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        customer={editingCustomer}
        onSave={handleSave}
      />
    </TooltipProvider>
  );
};

export default ReactivationCustomers;
