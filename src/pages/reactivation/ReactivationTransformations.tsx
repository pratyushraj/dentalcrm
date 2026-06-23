import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useSession } from '@/contexts/SessionContext';
import { generateSmileTransformationCaptions, generateSmileTransformationPrompts, SmileTransformationAssets } from '@/lib/ai/gemini';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Upload,
  Download,
  Copy,
  Check,
  User,
  Image as ImageIcon,
  ChevronRight,
  RefreshCw,
  Search,
  Palette,
  Wand2,
  Star,
  Camera,
  Zap,
  Award,
  ArrowRight,
  Building2,
  Instagram,
  Send
} from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  phone: string;
  service: string;
  before_photo: string | null;
  after_photo: string | null;
  notes: string | null;
}

type FrameStyle = 'charcoal' | 'luxury_gold' | 'clean_medical' | 'ai_theme';

const FRAME_THEMES = [
  { id: 'charcoal' as FrameStyle, label: 'Charcoal', icon: '🌑', description: 'Dark premium', gradient: 'from-slate-800 to-slate-900' },
  { id: 'luxury_gold' as FrameStyle, label: 'Gold', icon: '✨', description: 'Luxury gold', gradient: 'from-amber-700 to-yellow-600' },
  { id: 'clean_medical' as FrameStyle, label: 'Clean', icon: '🏥', description: 'Medical white', gradient: 'from-slate-100 to-white' },
];

export default function ReactivationTransformations() {
  const { organizationId } = useSession();
  const clinicId = organizationId || 'default';

  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [beforePhoto, setBeforePhoto] = useState<string | null>(null);
  const [afterPhoto, setAfterPhoto] = useState<string | null>(null);
  const [isSavingPhotos, setIsSavingPhotos] = useState(false);

  const [clinicName, setClinicName] = useState('Shree Ram Dental Clinic');
  const [clinicLogo, setClinicLogo] = useState<string | null>(null);
  const [doctorName, setDoctorName] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [phone, setPhone] = useState('');
  const [treatmentLabel, setTreatmentLabel] = useState('');
  const [activeFrameStyle, setActiveFrameStyle] = useState<FrameStyle>('clean_medical');

  const [aiTheme, setAiTheme] = useState<SmileTransformationAssets['theme'] | null>(null);
  const [useAiTheme, setUseAiTheme] = useState(false);

  const [beforePrompt, setBeforePrompt] = useState('');
  const [afterPrompt, setAfterPrompt] = useState('');
  const [isGeneratingPrompts, setIsGeneratingPrompts] = useState(false);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);

  const [captions, setCaptions] = useState<{ educational: string; emotional: string; short: string } | null>(null);
  const [isGeneratingCaptions, setIsGeneratingCaptions] = useState(false);
  const [copiedType, setCopiedType] = useState<'educational' | 'emotional' | 'short' | null>(null);
  const [activeCaption, setActiveCaption] = useState<'educational' | 'emotional' | 'short'>('educational');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Instagram credentials state and persistence
  const [instagramAccountId, setInstagramAccountId] = useState(() => localStorage.getItem('instagram_business_account_id') || '');
  const [instagramAccessToken, setInstagramAccessToken] = useState(() => localStorage.getItem('instagram_access_token') || '');

  useEffect(() => {
    localStorage.setItem('instagram_business_account_id', instagramAccountId);
  }, [instagramAccountId]);

  useEffect(() => {
    localStorage.setItem('instagram_access_token', instagramAccessToken);
  }, [instagramAccessToken]);

  useEffect(() => {
    if (!clinicId || clinicId === 'default') return;

    const fetchClinicBranding = async () => {
      try {
        const { data, error } = await supabase
          .from('dental_clinics')
          .select('name, logo_url, doctor_name, qualifications, phone' as any)
          .eq('id', clinicId)
          .single();

        if (error) throw error;
        if (data) {
          if (data.name) setClinicName(data.name);
          if (data.logo_url) setClinicLogo(data.logo_url);
          if (data.doctor_name) setDoctorName(data.doctor_name);
          if (data.qualifications) setQualifications(data.qualifications);
          if (data.phone) setPhone(data.phone);
          return; // Skip fallback if database has values
        }
      } catch (err) {
        console.error('Error loading branding from Supabase:', err);
      }

      // Fallback to local storage if DB has no config/fails
      try {
        const raw = localStorage.getItem(`clinic_branding_${clinicId}`);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.clinicName) setClinicName(parsed.clinicName);
          if (parsed.logoUrl) setClinicLogo(parsed.logoUrl);
          if (parsed.doctorName) setDoctorName(parsed.doctorName);
          if (parsed.qualifications) setQualifications(parsed.qualifications);
          if (parsed.phone) setPhone(parsed.phone);
        }
      } catch (e) { console.error(e); }
    };

    fetchClinicBranding();
  }, [clinicId]);

  const handlePersistBrandingField = async (field: 'clinicName' | 'doctorName' | 'qualifications' | 'phone', value: string) => {
    if (!clinicId || clinicId === 'default') return;
    try {
      const dbField = field === 'clinicName' ? 'name' : 
                      field === 'doctorName' ? 'doctor_name' : 
                      field === 'qualifications' ? 'qualifications' : 
                      field === 'phone' ? 'phone' : '';
      
      if (dbField) {
        await supabase
          .from('dental_clinics')
          .update({ [dbField]: value })
          .eq('id', clinicId);
      }

      const raw = localStorage.getItem(`clinic_branding_${clinicId}`);
      let currentBranding: any = {
        clinicName,
        doctorName,
        qualifications,
        phone,
        logoUrl: clinicLogo || ''
      };
      if (raw) {
        try {
          currentBranding = { ...currentBranding, ...JSON.parse(raw) };
        } catch {}
      }
      currentBranding[field] = value;
      localStorage.setItem(`clinic_branding_${clinicId}`, JSON.stringify(currentBranding));
    } catch (err) {
      console.error('Failed to persist branding field:', err);
    }
  };

  const [loadedImages, setLoadedImages] = useState<{
    before: HTMLImageElement | null;
    after: HTMLImageElement | null;
    logo: HTMLImageElement | null;
  }>({ before: null, after: null, logo: null });

  useEffect(() => {
    let active = true;
    const load = (src: string | null): Promise<HTMLImageElement | null> => {
      if (!src) return Promise.resolve(null);
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
      });
    };

    Promise.all([load(beforePhoto), load(afterPhoto), load(clinicLogo)]).then(([before, after, logo]) => {
      if (active) {
        setLoadedImages({ before, after, logo });
      }
    });

    return () => {
      active = false;
    };
  }, [beforePhoto, afterPhoto, clinicLogo]);

  const loadPatients = async () => {
    if (!clinicId || clinicId === 'default') return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('dental_patients')
        .select('id, name, phone, service, before_photo, after_photo, notes')
        .eq('clinic_id', clinicId);
      if (error) { toast.error('Failed to load patient records'); }
      else if (data) {
        setPatients(data);
        if (data.length > 0 && !selectedPatientId) setSelectedPatientId(data[0].id);
      }
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { loadPatients(); }, [clinicId]);

  const activePatient = patients.find(p => p.id === selectedPatientId);

  useEffect(() => {
    if (activePatient) {
      setBeforePhoto(activePatient.before_photo);
      setAfterPhoto(activePatient.after_photo);
      setTreatmentLabel(activePatient.service || 'Smile Makeover');
      setCaptions(null);
      setAiTheme(null);
      setUseAiTheme(false);
      setActiveFrameStyle('clean_medical');
      setBeforePrompt('');
      setAfterPrompt('');
    }
  }, [selectedPatientId, activePatient]);

  const handlePhotoUpload = async (file: File, type: 'before' | 'after') => {
    if (!selectedPatientId) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      if (type === 'before') setBeforePhoto(base64);
      else setAfterPhoto(base64);
      setIsSavingPhotos(true);
      try {
        const payload = type === 'before' ? { before_photo: base64 } : { after_photo: base64 };
        const { error } = await supabase.from('dental_patients').update(payload).eq('id', selectedPatientId);
        if (error) toast.error(`Failed to save ${type} photo: ` + error.message);
        else {
          toast.success(`${type === 'before' ? 'Before' : 'After'} photo updated!`);
          setPatients(prev => prev.map(p => p.id === selectedPatientId ? { ...p, ...payload } : p));
        }
      } catch (err) { console.error(err); }
      finally { setIsSavingPhotos(false); }
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateCaptions = async () => {
    if (!activePatient) return;
    setIsGeneratingCaptions(true);
    try {
      const generated = await generateSmileTransformationCaptions(
        activePatient.name,
        treatmentLabel || activePatient.service || 'Smile Makeover',
        activePatient.notes || 'Routine cosmetic dental care.',
        clinicName
      );
      setCaptions(generated.captions);
      setAiTheme(generated.theme);
      setUseAiTheme(true);
      setActiveFrameStyle('ai_theme');
      toast.success('AI captions & design theme generated!');
    } catch (e) { toast.error('Failed to generate AI content'); }
    finally { setIsGeneratingCaptions(false); }
  };

  const handleGeneratePrompts = async () => {
    if (!activePatient) return;
    setIsGeneratingPrompts(true);
    try {
      const result = await generateSmileTransformationPrompts(
        treatmentLabel || activePatient.service || 'Smile Makeover',
        activePatient.notes || 'Routine cosmetic dental care.',
        beforePhoto, afterPhoto
      );
      setBeforePrompt(result.beforePrompt);
      setAfterPrompt(result.afterPrompt);
      toast.success('AI image prompts generated!');
    } catch (e) { toast.error('Failed to generate image prompts.'); }
    finally { setIsGeneratingPrompts(false); }
  };

  const fetchImageAsBase64 = async (promptText: string): Promise<string> => {
    const seed = Math.floor(Math.random() * 1000000);
    const finalPrompt = encodeURIComponent(`${promptText}, macro dental close-up photography, ultra-realistic clinical documentation style, 4k`);
    const url = `https://image.pollinations.ai/prompt/${finalPrompt}?width=500&height=760&nologo=true&seed=${seed}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch generated image.');
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleGenerateImages = async () => {
    if (!beforePrompt.trim() || !afterPrompt.trim()) {
      toast.error('Please generate prompts first.');
      return;
    }
    setIsGeneratingImages(true);
    try {
      toast.info('Generating AI Before Photo...');
      const beforeB64 = await fetchImageAsBase64(beforePrompt);
      setBeforePhoto(beforeB64);
      toast.info('Generating AI After Photo...');
      const afterB64 = await fetchImageAsBase64(afterPrompt);
      setAfterPhoto(afterB64);
      if (selectedPatientId) {
        setIsSavingPhotos(true);
        const { error } = await supabase.from('dental_patients').update({ before_photo: beforeB64, after_photo: afterB64 }).eq('id', selectedPatientId);
        if (error) toast.error('Images generated but save failed: ' + error.message);
        else {
          toast.success('AI Photos generated & saved!');
          setPatients(prev => prev.map(p => p.id === selectedPatientId ? { ...p, before_photo: beforeB64, after_photo: afterB64 } : p));
        }
      }
    } catch (e) { toast.error('Failed to generate AI images.'); }
    finally { setIsGeneratingImages(false); setIsSavingPhotos(false); }
  };

  const handleCopy = (text: string, type: 'educational' | 'emotional' | 'short') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    toast.success('Caption copied!');
    setTimeout(() => setCopiedType(null), 2000);
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = 1080;
    canvas.height = 1080;

    if (useAiTheme && aiTheme) {
      const grad = ctx.createLinearGradient(0, 0, 0, 1080);
      grad.addColorStop(0, aiTheme.backgroundGradientStart);
      grad.addColorStop(1, aiTheme.backgroundGradientEnd);
      ctx.fillStyle = grad;
    } else if (activeFrameStyle === 'charcoal') {
      ctx.fillStyle = '#0F172A';
    } else if (activeFrameStyle === 'luxury_gold') {
      ctx.fillStyle = '#1E1B4B';
    } else {
      ctx.fillStyle = '#FFFFFF';
    }
    ctx.fillRect(0, 0, 1080, 1080);

    if (useAiTheme && aiTheme) {
      ctx.strokeStyle = aiTheme.accentColor;
      ctx.lineWidth = aiTheme.frameStyle === 'luxury' ? 12 : 8;
      ctx.strokeRect(6, 6, 1068, 1068);
    } else if (activeFrameStyle === 'luxury_gold') {
      ctx.strokeStyle = '#D97706';
      ctx.lineWidth = 12;
      ctx.strokeRect(6, 6, 1068, 1068);
    } else if (activeFrameStyle === 'charcoal') {
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 8;
      ctx.strokeRect(4, 4, 1072, 1072);
    } else {
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 8;
      ctx.strokeRect(4, 4, 1072, 1072);
    }

    // Draw Clinic Logo in top left
    let logoWidth = 0;
    if (loadedImages.logo) {
      ctx.save();
      const maxW = 110;
      const maxH = 80;
      let w = loadedImages.logo.width;
      let h = loadedImages.logo.height;
      const ratio = w / h;
      if (w > maxW) {
        w = maxW;
        h = w / ratio;
      }
      if (h > maxH) {
        h = maxH;
        w = h * ratio;
      }
      const lx = 40;
      const ly = 45;
      ctx.drawImage(loadedImages.logo, lx, ly, w, h);
      ctx.restore();
      logoWidth = w;
    }

    ctx.textBaseline = 'top';
    const textX = logoWidth > 0 ? 40 + logoWidth + 20 : 40;
    const textY = 45;
    const subY = 98;

    if (useAiTheme && aiTheme) {
      ctx.fillStyle = aiTheme.textColor;
      ctx.font = aiTheme.fontFamily === 'serif' ? 'bold 42px Georgia, serif' : 'bold 38px sans-serif';
    } else if (activeFrameStyle === 'luxury_gold') {
      ctx.fillStyle = '#F59E0B';
      ctx.font = 'bold 36px Georgia, serif';
    } else if (activeFrameStyle === 'charcoal') {
      ctx.fillStyle = '#F1F5F9';
      ctx.font = 'bold 34px sans-serif';
    } else {
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 34px sans-serif';
    }
    ctx.textAlign = 'left';
    ctx.fillText(useAiTheme && aiTheme ? aiTheme.headerText.toUpperCase() : clinicName.toUpperCase(), textX, textY);

    if (useAiTheme && aiTheme) {
      ctx.fillStyle = aiTheme.accentColor;
      ctx.font = aiTheme.fontFamily === 'serif' ? 'italic 22px Georgia, serif' : 'bold 20px sans-serif';
    } else if (activeFrameStyle === 'luxury_gold') {
      ctx.fillStyle = '#FBBF24';
      ctx.font = 'italic 20px Georgia, serif';
    } else {
      ctx.fillStyle = '#6366F1';
      ctx.font = 'bold 18px sans-serif';
    }
    ctx.fillText(useAiTheme && aiTheme ? `${clinicName.toUpperCase()} • ${treatmentLabel.toUpperCase()}` : treatmentLabel.toUpperCase(), textX, subY);

    // Draw 5-Star Ratings in top right
    const drawStar = (cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
      ctx.fill();
    };

    ctx.save();
    ctx.fillStyle = '#FBBF24'; // Gold Star Color
    // Loop 5 times to render five stars side by side in the top-right banner
    const startStarX = 900;
    const starY = 70;
    for (let i = 0; i < 5; i++) {
      drawStar(startStarX + (i * 28), starY, 5, 12, 6);
    }
    ctx.restore();

    const imgWidth = 490, imgHeight = 780, yOffset = 180, leftX = 40, rightX = 550;

    const drawPhoto = (img: HTMLImageElement | null, x: number, badgeText: string) => {
      // 1. Draw Shadow under photo container
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 8;
      ctx.fillStyle = (useAiTheme && aiTheme) ? aiTheme.backgroundGradientStart : (activeFrameStyle === 'clean_medical' ? '#F8FAFC' : '#1E293B');
      ctx.beginPath();
      ctx.roundRect(x, yOffset, imgWidth, imgHeight, 16);
      ctx.fill();
      ctx.restore();

      if (!img) {
        ctx.save();
        ctx.fillStyle = useAiTheme && aiTheme ? aiTheme.textColor : '#94A3B8';
        ctx.font = 'bold 15px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`No ${badgeText} Photo Loaded`, x + imgWidth / 2, yOffset + imgHeight / 2);
        ctx.restore();
        drawBadge(x, yOffset, badgeText);
        return;
      }

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x, yOffset, imgWidth, imgHeight, 16);
      ctx.clip();
      const imgRatio = img.width / img.height;
      const boxRatio = imgWidth / imgHeight;
      let sx = 0, sy = 0, sw = img.width, sh = img.height;
      if (imgRatio > boxRatio) { sw = img.height * boxRatio; sx = (img.width - sw) / 2; }
      else { sh = img.width / boxRatio; sy = (img.height - sh) / 2; }
      ctx.drawImage(img, sx, sy, sw, sh, x, yOffset, imgWidth, imgHeight);
      ctx.restore();

      // Border around the photo
      ctx.save();
      ctx.strokeStyle = useAiTheme && aiTheme ? aiTheme.accentColor : (activeFrameStyle === 'luxury_gold' ? '#D97706' : (activeFrameStyle === 'charcoal' ? '#334155' : '#E2E8F0'));
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(x, yOffset, imgWidth, imgHeight, 16);
      ctx.stroke();
      ctx.restore();

      drawBadge(x, yOffset, badgeText);
    };

    const drawBadge = (x: number, y: number, text: string) => {
      ctx.save();
      ctx.font = 'bold 20px sans-serif';
      const textWidth = ctx.measureText(text).width;
      
      // Shadow for badge
      ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 4;

      ctx.fillStyle = text === 'BEFORE' ? (useAiTheme && aiTheme ? aiTheme.badgeBeforeBg : '#EF4444') : (useAiTheme && aiTheme ? aiTheme.badgeAfterBg : '#10B981');
      ctx.beginPath();
      ctx.roundRect(x + 20, y + 20, textWidth + 30, 38, 8);
      ctx.fill();
      
      ctx.shadowColor = 'transparent'; // Reset shadow for text
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, x + 20 + (textWidth + 30) / 2, y + 20 + 19);
      ctx.restore();
    };

    drawPhoto(loadedImages.before, leftX, 'BEFORE');
    drawPhoto(loadedImages.after, rightX, 'AFTER');

    // Bottom Footer Card Background
    const footerHeight = 80;
    const footerY = 980;
    ctx.save();
    
    // Shadow for footer
    ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 6;

    // Draw footer container background
    if (useAiTheme && aiTheme) {
      ctx.fillStyle = aiTheme.badgeBeforeBg === '#EF4444' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.12)';
      ctx.strokeStyle = aiTheme.accentColor;
    } else if (activeFrameStyle === 'luxury_gold') {
      ctx.fillStyle = 'rgba(217, 119, 6, 0.08)';
      ctx.strokeStyle = '#D97706';
    } else if (activeFrameStyle === 'charcoal') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.strokeStyle = '#334155';
    } else {
      ctx.fillStyle = '#F8FAFC';
      ctx.strokeStyle = '#E2E8F0';
    }
    
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(40, footerY, 1000, footerHeight, 12);
    ctx.fill();
    ctx.shadowColor = 'transparent'; // Turn off shadow before drawing stroke
    ctx.stroke();
    ctx.restore();

    // Draw Doctor & Phone info on the left/right inside the footer container
    ctx.save();
    ctx.textBaseline = 'middle';
    
    if (useAiTheme && aiTheme) {
      ctx.fillStyle = aiTheme.textColor;
    } else if (activeFrameStyle === 'luxury_gold') {
      ctx.fillStyle = '#FBBF24';
    } else if (activeFrameStyle === 'charcoal') {
      ctx.fillStyle = '#F1F5F9';
    } else {
      ctx.fillStyle = '#1E293B';
    }

    // Left side: Dr. Name + Degree
    ctx.textAlign = 'left';
    const drText = doctorName ? `Dr. ${doctorName.replace(/^dr\.?\s+/i, '')}` : '';
    const degreeText = qualifications ? ` (${qualifications})` : '';
    if (drText) {
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(`🩺  ${drText}${degreeText}`, 65, footerY + footerHeight / 2);
    } else {
      ctx.font = 'italic 18px sans-serif';
      ctx.fillText(`✨  Transforming Smiles, Enhancing Confidence`, 65, footerY + footerHeight / 2);
    }

    // Right side: Phone number
    ctx.textAlign = 'right';
    if (phone) {
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(`📞  ${phone}`, 1015, footerY + footerHeight / 2);
    } else {
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('Authorized Signature', 1015, footerY + footerHeight / 2);
    }
    ctx.restore();
  };

  useEffect(() => {
    drawCanvas();
    const t = setTimeout(drawCanvas, 350);
    return () => clearTimeout(t);
  }, [loadedImages, clinicName, treatmentLabel, activeFrameStyle, useAiTheme, aiTheme, clinicLogo, doctorName, qualifications, phone]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `Smile_Transformation_${activePatient?.name.replace(/\s+/g, '_') || 'Patient'}.png`;
    a.click();
    toast.success('Transformation image downloaded!');
  };

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.service.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const captionTypes = [
    { id: 'educational' as const, label: 'Educational', icon: '📚', color: 'indigo' },
    { id: 'emotional' as const, label: 'Emotional', icon: '💛', color: 'amber' },
    { id: 'short' as const, label: 'Short & Punchy', icon: '⚡', color: 'violet' },
  ];

  return (
    <div className="h-full flex flex-col lg:flex-row gap-0 bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">

      {/* ── Left Panel: Patient List ─────────────────────────── */}
      <div className="w-full lg:w-72 flex-shrink-0 flex flex-col bg-white border-r border-slate-100 h-[260px] lg:h-full">
        {/* Header */}
        <div className="px-4 pt-5 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm">
              <Award size={15} className="text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800 leading-none">Smile Gallery</h2>
              <p className="text-[10px] text-slate-400 mt-0.5">Before & After Studio</p>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-[11px] focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400 text-slate-700 transition placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Patient List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-8 gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                <RefreshCw size={18} className="text-indigo-500 animate-spin" />
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Loading patients...</p>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="p-8 text-center flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                <User size={24} className="text-slate-300" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-600">No patients found</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Add patients to create transformations</p>
              </div>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {filteredPatients.map(p => {
                const isSelected = p.id === selectedPatientId;
                const hasBefore = !!p.before_photo;
                const hasAfter = !!p.after_photo;
                const completion = (hasBefore ? 50 : 0) + (hasAfter ? 50 : 0);

                return (
                  <motion.div
                    key={p.id}
                    onClick={() => setSelectedPatientId(p.id)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-xl cursor-pointer transition-all duration-150 border ${
                      isSelected
                        ? 'bg-[#F5F3FF] border-[#DDD6FE] shadow-sm shadow-[#C7D2FE]/20'
                        : 'hover:bg-slate-50/80 bg-white border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-sm transition-all ${
                      isSelected
                        ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {p.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-[12px] font-bold truncate ${isSelected ? 'text-indigo-950' : 'text-slate-800'}`}>{p.name}</h3>
                      <p className={`text-[10px] truncate mt-0.5 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`}>{p.service || 'Smile Transformation'}</p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <div className="flex items-center gap-1">
                          <span className={`text-[8px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${hasBefore ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                            Before
                          </span>
                          <span className={`text-[8px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${hasAfter ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                            After
                          </span>
                        </div>
                        {completion === 100 && (
                          <span className="text-[8px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 flex items-center gap-0.5">
                            ★ READY
                          </span>
                        )}
                      </div>
                    </div>
                    {isSelected && <ChevronRight size={13} className="text-indigo-500 flex-shrink-0" />}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Patient count */}
        {!isLoading && filteredPatients.length > 0 && (
          <div className="p-3 border-t border-slate-100 bg-slate-50/50">
            <p className="text-[10px] text-slate-400 text-center">
              {filteredPatients.length} patient{filteredPatients.length !== 1 ? 's' : ''} · {patients.filter(p => p.before_photo && p.after_photo).length} complete
            </p>
          </div>
        )}
      </div>

      {/* ── Right Panel ─────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-5 lg:p-6 flex flex-col gap-5">
        {activePatient ? (
          <>


            {/* Main 2-col workspace */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">

              {/* Canvas Preview (3/5 width) */}
              <div className="xl:col-span-3 space-y-4">
                {/* Canvas card */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-slate-700 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center">
                        <ImageIcon size={13} className="text-indigo-500" />
                      </div>
                      Visual Template Editor
                    </h3>
                    <span className="text-[9px] text-slate-400 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg font-mono">1080 × 1080 px</span>
                  </div>

                  {/* Canvas preview */}
                  <div className="relative group rounded-xl overflow-hidden bg-slate-900 aspect-square max-w-md mx-auto shadow-2xl shadow-slate-900/30">
                    <canvas ref={canvasRef} className="w-full h-full object-contain" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                      <button
                        onClick={handleDownload}
                        className="bg-white text-slate-900 text-xs font-bold rounded-xl px-5 py-2.5 flex items-center gap-2 shadow-lg transition hover:bg-slate-50 active:scale-95"
                      >
                        <Download size={14} />
                        Download PNG
                      </button>
                    </div>
                  </div>
                </div>

                {/* Theme Selector */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-lg bg-violet-50 flex items-center justify-center">
                      <Palette size={13} className="text-violet-500" />
                    </div>
                    <h3 className="text-xs font-bold text-slate-700">Template Theme</h3>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {FRAME_THEMES.map(theme => (
                      <button
                        key={theme.id}
                        onClick={() => { setUseAiTheme(false); setActiveFrameStyle(theme.id); }}
                        className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                          activeFrameStyle === theme.id && !useAiTheme
                            ? 'border-indigo-500 bg-indigo-50 shadow-sm shadow-indigo-500/20'
                            : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${theme.gradient} shadow-sm`} />
                        <span className={`text-[9px] font-bold leading-tight text-center ${activeFrameStyle === theme.id && !useAiTheme ? 'text-indigo-700' : 'text-slate-600'}`}>
                          {theme.label}
                        </span>
                        {activeFrameStyle === theme.id && !useAiTheme && (
                          <div className="absolute top-1.5 right-1.5 w-3 h-3 bg-indigo-500 rounded-full flex items-center justify-center">
                            <Check size={8} className="text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        if (aiTheme) { setUseAiTheme(true); setActiveFrameStyle('ai_theme'); }
                        else { toast.info('Generating custom AI theme...'); handleGenerateCaptions(); }
                      }}
                      className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                        useAiTheme && activeFrameStyle === 'ai_theme'
                          ? 'border-violet-500 bg-gradient-to-br from-violet-50 to-indigo-50 shadow-sm shadow-violet-500/20'
                          : 'border-dashed border-violet-300 bg-violet-50/50 hover:bg-violet-50'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-sm">
                        <Sparkles size={14} className={`text-white ${useAiTheme ? 'animate-pulse' : ''}`} />
                      </div>
                      <span className={`text-[9px] font-bold leading-tight text-center ${useAiTheme && activeFrameStyle === 'ai_theme' ? 'text-violet-700' : 'text-violet-600'}`}>
                        AI Smart
                      </span>
                      {useAiTheme && activeFrameStyle === 'ai_theme' && (
                        <div className="absolute top-1.5 right-1.5 w-3 h-3 bg-violet-500 rounded-full flex items-center justify-center">
                          <Check size={8} className="text-white" />
                        </div>
                      )}
                    </button>
                  </div>

                  {/* AI Palette preview */}
                  {useAiTheme && aiTheme && (
                    <div className="mt-3 bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 rounded-xl p-3 flex items-center gap-3">
                      <div className="flex -space-x-1.5">
                        {[aiTheme.backgroundGradientStart, aiTheme.backgroundGradientEnd, aiTheme.accentColor, aiTheme.badgeAfterBg].map((c, i) => (
                          <div key={i} className="w-5 h-5 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: c }} title={c} />
                        ))}
                      </div>
                      <span className="text-[10px] text-violet-700 font-semibold">AI Theme: "{aiTheme.headerText}"</span>
                    </div>
                  )}
                </div>

                {/* Text Overlays */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center">
                      <Camera size={13} className="text-slate-500" />
                    </div>
                    Text Overlays
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Clinic Name</label>
                      <input
                        type="text"
                        value={clinicName}
                        onChange={(e) => setClinicName(e.target.value)}
                        onBlur={(e) => handlePersistBrandingField('clinicName', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400 text-slate-700 transition"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Treatment Label</label>
                      <input
                        type="text"
                        value={treatmentLabel}
                        placeholder="e.g. Veneer Restoration"
                        onChange={(e) => setTreatmentLabel(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400 text-slate-700 transition"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Doctor Name</label>
                      <input
                        type="text"
                        value={doctorName}
                        placeholder="e.g. Kumar"
                        onChange={(e) => setDoctorName(e.target.value)}
                        onBlur={(e) => handlePersistBrandingField('doctorName', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400 text-slate-700 transition"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Qualifications</label>
                      <input
                        type="text"
                        value={qualifications}
                        placeholder="e.g. B.D.S., M.D.S."
                        onChange={(e) => setQualifications(e.target.value)}
                        onBlur={(e) => handlePersistBrandingField('qualifications', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400 text-slate-700 transition"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Contact Number</label>
                      <input
                        type="text"
                        value={phone}
                        placeholder="e.g. 7292984244"
                        onChange={(e) => setPhone(e.target.value)}
                        onBlur={(e) => handlePersistBrandingField('phone', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400 text-slate-700 transition"
                      />
                    </div>
                  </div>
                  {/* Clinic Logo Status */}
                  <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg border border-slate-200 bg-white flex items-center justify-center overflow-hidden shrink-0">
                        {clinicLogo ? (
                          <img src={clinicLogo} alt="Logo" className="w-full h-full object-contain p-0.5" />
                        ) : (
                          <Building2 className="text-slate-300" size={18} />
                        )}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-700 block">Clinic Logo Status</span>
                        <span className="text-[9px] text-slate-400">
                          {clinicLogo ? 'Loaded and active' : 'No logo uploaded'}
                        </span>
                      </div>
                    </div>
                    {!clinicLogo && (
                      <span className="text-[9px] text-indigo-600 font-bold bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-lg">
                        Upload in Settings
                      </span>
                    )}
                  </div>
                </div>

                {/* Instagram Integration Settings */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-pink-50 flex items-center justify-center">
                      <Instagram size={13} className="text-pink-600" />
                    </div>
                    Instagram Graph API Setup
                  </h3>
                  <div className="space-y-3.5">
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">IG Business Account ID</label>
                        <span className="text-[8px] font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full uppercase tracking-wider">Required</span>
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. 17841402252239382"
                        value={instagramAccountId}
                        onChange={(e) => setInstagramAccountId(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-pink-400/40 focus:border-pink-400 text-slate-700 transition"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Access Token</label>
                        <span className="text-[8px] font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full uppercase tracking-wider">Required</span>
                      </div>
                      <input
                        type="password"
                        placeholder="EAABw..."
                        value={instagramAccessToken}
                        onChange={(e) => setInstagramAccessToken(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-pink-400/40 focus:border-pink-400 text-slate-700 transition"
                      />
                    </div>
                    <p className="text-[9px] text-slate-400 leading-normal">
                      Leave empty to run in <strong>Simulated Mode</strong>. Posts will upload to storage and return a mock success code.
                    </p>
                  </div>
                </div>

                {/* Download button */}
                <button
                  onClick={handleDownload}
                  className="w-full bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white font-bold rounded-2xl py-3.5 text-sm flex items-center justify-center gap-2.5 shadow-lg transition-all active:scale-[0.98] cursor-pointer"
                >
                  <Download size={16} />
                  Download Branded Graphic (PNG)
                </button>
              </div>

              {/* Right side: Photos + AI captions (2/5 width) */}
              <div className="xl:col-span-2 space-y-4">

                {/* Photo Upload Section */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-slate-700 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
                        <Upload size={13} className="text-emerald-600" />
                      </div>
                      Treatment Photos
                    </h3>
                    {isSavingPhotos && (
                      <span className="text-[9px] font-bold text-indigo-500 flex items-center gap-1 animate-pulse">
                        <RefreshCw size={10} className="animate-spin" /> Saving...
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Before */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5 justify-between">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Before</span>
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-md ${beforePhoto ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400'}`}>
                          {beforePhoto ? '✓ Uploaded' : 'Empty'}
                        </span>
                      </div>
                      <div className={`relative w-full aspect-[3/4] rounded-xl overflow-hidden border-2 border-dashed transition-all ${
                        beforePhoto ? 'border-red-300' : 'border-slate-200'
                      } bg-slate-50 group`}>
                        {beforePhoto ? (
                          <>
                            <img src={beforePhoto} className="w-full h-full object-cover" alt="Before" />
                            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2 rounded-xl p-2">
                              <label className="cursor-pointer text-[10px] text-white font-bold bg-white/20 hover:bg-white/30 backdrop-blur-sm px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition w-28 justify-center">
                                <Upload size={12} />
                                <span>Gallery</span>
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handlePhotoUpload(e.target.files[0], 'before'); }} />
                              </label>
                              <label className="cursor-pointer text-[10px] text-white font-bold bg-white/20 hover:bg-white/30 backdrop-blur-sm px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition w-28 justify-center">
                                <Camera size={12} />
                                <span>Camera</span>
                                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handlePhotoUpload(e.target.files[0], 'before'); }} />
                              </label>
                            </div>
                          </>
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-2 text-center">
                            <label className="cursor-pointer border border-dashed border-slate-300 hover:border-indigo-500 bg-white hover:bg-indigo-50/50 rounded-lg py-2 px-3 flex items-center gap-1.5 transition-all w-32 justify-center">
                              <Upload size={12} className="text-slate-500" />
                              <span className="text-[10px] font-bold text-slate-600">Gallery</span>
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handlePhotoUpload(e.target.files[0], 'before'); }} />
                            </label>
                            <label className="cursor-pointer border border-dashed border-slate-300 hover:border-indigo-500 bg-white hover:bg-indigo-50/50 rounded-lg py-2 px-3 flex items-center gap-1.5 transition-all w-32 justify-center">
                              <Camera size={12} className="text-slate-500" />
                              <span className="text-[10px] font-bold text-slate-600">Camera</span>
                              <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handlePhotoUpload(e.target.files[0], 'before'); }} />
                            </label>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* After */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5 justify-between">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">After</span>
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-md ${afterPhoto ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                          {afterPhoto ? '✓ Uploaded' : 'Empty'}
                        </span>
                      </div>
                      <div className={`relative w-full aspect-[3/4] rounded-xl overflow-hidden border-2 border-dashed transition-all ${
                        afterPhoto ? 'border-emerald-300' : 'border-slate-200'
                      } bg-slate-50 group`}>
                        {afterPhoto ? (
                          <>
                            <img src={afterPhoto} className="w-full h-full object-cover" alt="After" />
                            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2 rounded-xl p-2">
                              <label className="cursor-pointer text-[10px] text-white font-bold bg-white/20 hover:bg-white/30 backdrop-blur-sm px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition w-28 justify-center">
                                <Upload size={12} />
                                <span>Gallery</span>
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handlePhotoUpload(e.target.files[0], 'after'); }} />
                              </label>
                              <label className="cursor-pointer text-[10px] text-white font-bold bg-white/20 hover:bg-white/30 backdrop-blur-sm px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition w-28 justify-center">
                                <Camera size={12} />
                                <span>Camera</span>
                                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handlePhotoUpload(e.target.files[0], 'after'); }} />
                              </label>
                            </div>
                          </>
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-2 text-center">
                            <label className="cursor-pointer border border-dashed border-slate-300 hover:border-indigo-500 bg-white hover:bg-indigo-50/50 rounded-lg py-2 px-3 flex items-center gap-1.5 transition-all w-32 justify-center">
                              <Upload size={12} className="text-slate-500" />
                              <span className="text-[10px] font-bold text-slate-600">Gallery</span>
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handlePhotoUpload(e.target.files[0], 'after'); }} />
                            </label>
                            <label className="cursor-pointer border border-dashed border-slate-300 hover:border-indigo-500 bg-white hover:bg-indigo-50/50 rounded-lg py-2 px-3 flex items-center gap-1.5 transition-all w-32 justify-center">
                              <Camera size={12} className="text-slate-500" />
                              <span className="text-[10px] font-bold text-slate-600">Camera</span>
                              <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handlePhotoUpload(e.target.files[0], 'after'); }} />
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Image Generator */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-lg bg-amber-50 flex items-center justify-center">
                      <Wand2 size={13} className="text-amber-600" />
                    </div>
                    <h3 className="text-xs font-bold text-slate-700">AI Image Generator</h3>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Before Prompt</label>
                      <textarea
                        value={beforePrompt}
                        onChange={(e) => setBeforePrompt(e.target.value)}
                        placeholder="Describe the before state..."
                        rows={2}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[11px] focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 text-slate-700 resize-none transition"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">After Prompt</label>
                      <textarea
                        value={afterPrompt}
                        onChange={(e) => setAfterPrompt(e.target.value)}
                        placeholder="Describe the after result..."
                        rows={2}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[11px] focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 text-slate-700 resize-none transition"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={handleGeneratePrompts}
                        disabled={isGeneratingPrompts}
                        className="bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 text-[10px] font-bold rounded-xl py-2.5 flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                      >
                        <Zap size={12} className={isGeneratingPrompts ? 'animate-pulse' : ''} />
                        {isGeneratingPrompts ? 'Writing...' : 'Auto Prompts'}
                      </button>
                      <button
                        onClick={handleGenerateImages}
                        disabled={isGeneratingImages || !beforePrompt.trim() || !afterPrompt.trim()}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-[10px] font-bold rounded-xl py-2.5 flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Wand2 size={12} className={isGeneratingImages ? 'animate-pulse' : ''} />
                        {isGeneratingImages ? 'Generating...' : 'Generate Photos'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* AI Captions Panel */}
                {captions && (
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center">
                        <Sparkles size={13} className="text-indigo-500" />
                      </div>
                      <h3 className="text-xs font-bold text-slate-700">AI Instagram Captions</h3>
                    </div>

                    {/* Caption type tabs */}
                    <div className="flex gap-1 mb-3 bg-slate-50 rounded-xl p-1">
                      {captionTypes.map(ct => (
                        <button
                          key={ct.id}
                          onClick={() => setActiveCaption(ct.id)}
                          className={`flex-1 text-[9.5px] font-bold rounded-lg py-1.5 transition-all cursor-pointer ${
                            activeCaption === ct.id
                              ? 'bg-white shadow-sm text-slate-800 border border-slate-200/80'
                              : 'text-slate-500 hover:text-slate-700'
                          }`}
                        >
                          {ct.icon} {ct.label}
                        </button>
                      ))}
                    </div>

                    {/* Caption content */}
                    <div className="relative bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <p className="text-[11.5px] leading-relaxed text-slate-700 whitespace-pre-wrap font-sans pr-8">
                        {captions[activeCaption]}
                      </p>
                      <button
                        onClick={() => handleCopy(captions[activeCaption], activeCaption)}
                        className="absolute top-3 right-3 w-7 h-7 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-300 transition shadow-sm"
                      >
                        {copiedType === activeCaption ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                      </button>
                    </div>

                     {/* Copy all & Insta Share options */}
                    <div className="flex flex-col gap-2 mt-3">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleCopy(captions[activeCaption], activeCaption)}
                          className="border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded-xl py-2.5 flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                          {copiedType === activeCaption ? <Check size={12} /> : <Copy size={12} />}
                          {copiedType === activeCaption ? 'Copied!' : 'Copy Caption'}
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            const canvas = canvasRef.current;
                            if (!canvas) {
                              toast.error("Template graphic is empty or loading!");
                              return;
                            }
                            
                            // Copy caption to clipboard
                            const activeCaptionText = captions ? captions[activeCaption] : '';
                            if (activeCaptionText) {
                              navigator.clipboard.writeText(activeCaptionText);
                            }
                            
                            // Download image
                            const dataUrl = canvas.toDataURL('image/png');
                            const link = document.createElement('a');
                            link.download = `${activePatient?.name || 'patient'}_before_after.png`;
                            link.href = dataUrl;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            
                            toast.success("Graphic downloaded & caption copied! Opening Instagram...");
                            setTimeout(() => {
                              window.open('https://www.instagram.com/', '_blank');
                            }, 1200);
                          }}
                          className="border border-pink-200 bg-pink-50 hover:bg-pink-100 text-pink-700 text-[10px] font-bold rounded-xl py-2.5 flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                          <Instagram size={12} />
                          Manual Post
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          const canvas = canvasRef.current;
                          if (!canvas) {
                            toast.error("Template graphic is empty or loading!");
                            return;
                          }
                          
                          const base64Image = canvas.toDataURL('image/jpeg', 0.95);
                          const activeCaptionText = captions ? captions[activeCaption] : '';
                          
                          const loadingToast = toast.loading("Uploading and publishing to Instagram Business account...");
                          
                          try {
                            const response = await fetch('/api/instagram/publish', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json'
                              },
                              body: JSON.stringify({
                                image: base64Image,
                                caption: activeCaptionText,
                                instagramAccountId: instagramAccountId || 'mock_id',
                                accessToken: instagramAccessToken || 'mock_token',
                                patientId: activePatient?.id || 'unknown_patient',
                                clinicId: clinicId,
                                simulate: !instagramAccountId || !instagramAccessToken
                              })
                            });
                            
                            const data = await response.json();
                            toast.dismiss(loadingToast);
                            
                            if (response.ok && data.success) {
                              if (data.simulated) {
                                toast.success("Successfully uploaded to Storage & created mock post! (Simulated Mode - Credentials not fully configured)", { duration: 5000 });
                              } else {
                                toast.success("Successfully posted before & after graphic to your live Instagram feed!", { duration: 5000 });
                              }
                            } else {
                              toast.error(`Publication failed: ${data.error || 'Unknown error'}`);
                            }
                          } catch (err) {
                            toast.dismiss(loadingToast);
                            const errorMsg = err instanceof Error ? err.message : String(err);
                            toast.error(`Request failed: ${errorMsg}`);
                          }
                        }}
                        className="w-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-pink-600 hover:via-red-600 hover:to-orange-500 text-white text-[10px] font-bold rounded-xl py-2.5 flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer"
                      >
                        <Sparkles size={12} />
                        Auto Post to Insta (Direct API)
                      </button>

                      {/* WhatsApp Send Button */}
                      <button
                        type="button"
                        onClick={async () => {
                          const canvas = canvasRef.current;
                          if (!canvas) { toast.error('Template graphic is empty or loading!'); return; }
                          if (!activePatient?.phone) { toast.error('No phone number for this patient.'); return; }

                          const loadingToast = toast.loading('Sending Smile Gallery via WhatsApp...');
                          try {
                            // 1. Fetch clinic WhatsApp config first
                            const { data: clinic } = await supabase
                              .from('dental_clinics')
                              .select('name, whatsapp_phone_number_id, whatsapp_access_token, google_review_url, before_after_template_name')
                              .eq('id', clinicId)
                              .single();

                            if (!clinic?.whatsapp_phone_number_id || !clinic?.whatsapp_access_token) {
                              throw new Error('WhatsApp API not configured. Go to Clinic Settings → WhatsApp API.');
                            }

                            const wabaPhoneId = clinic.whatsapp_phone_number_id;
                            const wabaToken = clinic.whatsapp_access_token.includes('|')
                              ? clinic.whatsapp_access_token.split('|')[0]
                              : clinic.whatsapp_access_token;

                            // 2. Capture branded canvas image
                            const base64Image = canvas.toDataURL('image/jpeg', 0.92);

                            // 3. Upload via serverless function (bypasses RLS)
                            const uploadRes = await fetch('/api/whatsapp-helper/upload', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ 
                                image: base64Image, 
                                customerId: activePatient.id,
                                wabaPhoneId,
                                wabaToken
                              })
                            });
                            const uploadData = await uploadRes.json();
                            if (!uploadRes.ok) throw new Error(uploadData.error || 'Upload failed');

                            const imageUrl = uploadData.filePath
                              ? window.location.origin + '/api/whatsapp-helper/view-image?file=' + encodeURIComponent(uploadData.filePath)
                              : uploadData.publicUrl;

                            const cleanPhone = activePatient.phone.replace(/[^0-9]/g, '');
                            const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

                            // 4. Get Google Review URL and Template Name directly or from packed token
                            let googleReviewUrl = (clinic as any).google_review_url || 'https://maps.app.goo.gl/KJ78ipBjeu7DfV4N9';
                            let dbBeforeAfterTemplateName = (clinic as any).before_after_template_name || '';

                            if (clinic.whatsapp_access_token.includes('|')) {
                              const parts = clinic.whatsapp_access_token.split('|');
                              if (!googleReviewUrl || googleReviewUrl === 'https://maps.app.goo.gl/KJ78ipBjeu7DfV4N9') {
                                if (parts[2]) googleReviewUrl = parts[2];
                              }
                              if (!dbBeforeAfterTemplateName) {
                                if (parts[3]) dbBeforeAfterTemplateName = parts[3];
                              }
                            }
                            try { const u = new URL(googleReviewUrl); u.searchParams.delete('g_st'); googleReviewUrl = u.toString(); } catch {}

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
                              const nameLower = (clinic.name || clinicName || '').toLowerCase();
                              if (nameLower.includes('shree ram') || nameLower.includes('your dentist')) {
                                templateName = 'clinical_image_record';
                              } else {
                                templateName = 'googlereview';
                              }
                            }

                            // Clean review URL to get suffix if needed
                            let urlSuffix = googleReviewUrl;
                            if (googleReviewUrl.includes('maps.app.goo.gl/')) {
                              const parts = googleReviewUrl.split('maps.app.goo.gl/');
                              urlSuffix = parts[parts.length - 1].split('?')[0];
                            } else if (googleReviewUrl.includes('g.page/r/')) {
                              const parts = googleReviewUrl.split('g.page/r/');
                              urlSuffix = parts[parts.length - 1].split('?')[0];
                            }

                            const isClinicalImageRecord = templateName === 'clinical_image_record';
                            const bodyParameters = isClinicalImageRecord
                              ? [
                                  { type: 'text', text: activePatient.name || 'Patient' },
                                  { type: 'text', text: treatmentLabel || activePatient.service || 'Smile Makeover' },
                                  { type: 'text', text: clinic.name || clinicName || 'Dental Clinic' }
                                ]
                              : [
                                  { type: 'text', text: activePatient.name || 'Patient' }
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
                            let hasDynamicButton = templateName === 'smile_makeover_google_review';
                            if (!hasDynamicButton) {
                              try {
                                const localTemplatesRaw = localStorage.getItem(`whatsapp_templates_${clinicId}`);
                                if (localTemplatesRaw) {
                                  const parsed = JSON.parse(localTemplatesRaw);
                                  const matched = parsed.find((t: any) => t.name === templateName);
                                  if (matched && matched.hasDynamicButton) {
                                    hasDynamicButton = true;
                                  }
                                }
                              } catch {}
                            }

                            if (hasDynamicButton) {
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

                            // 5. Send via Meta API
                            const payload = {
                              messaging_product: 'whatsapp',
                              to: formattedPhone,
                              type: 'template',
                              template: {
                                name: templateName,
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
                            if (!apiRes.ok) throw new Error(apiData.error?.message || apiData.error || 'Meta API error');

                            toast.dismiss(loadingToast);
                            toast.success(`Smile Gallery sent to ${activePatient.name} on WhatsApp! 🦷✨`);
                          } catch (err: any) {
                            toast.dismiss(loadingToast);
                            toast.error('Failed to send: ' + err.message);
                          }
                        }}
                        className="w-full mt-1 border border-green-200 bg-green-50 hover:bg-green-100 text-green-700 text-[10px] font-bold rounded-xl py-2.5 flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                      >
                        <Send size={12} />
                        Send Smile Gallery via WhatsApp
                      </button>
                    </div>

                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center min-h-[400px]">
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-100 to-violet-100 border border-indigo-200 flex items-center justify-center shadow-lg">
                <Sparkles size={36} className="text-indigo-400" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center shadow-sm">
                <Star size={12} className="text-white" fill="white" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-slate-800">Smile Transformation Studio</h3>
            <p className="text-sm text-slate-400 mt-2 max-w-xs leading-relaxed">
              Select a patient from the left panel to create a stunning before & after Instagram post with AI-powered captions.
            </p>
            <div className="flex items-center gap-2 mt-6 text-indigo-500">
              <ArrowRight size={16} className="rotate-180" />
              <span className="text-xs font-bold">Choose a patient to get started</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
