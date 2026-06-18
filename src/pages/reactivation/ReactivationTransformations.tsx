import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useSession } from '@/contexts/SessionContext';
import { generateSmileTransformationCaptions } from '@/lib/ai/gemini';
import { toast } from 'sonner';
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
  Search
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

type FrameStyle = 'charcoal' | 'luxury_gold' | 'clean_medical';

export default function ReactivationTransformations() {
  const { organizationId } = useSession();
  const clinicId = organizationId || 'default';

  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Active images (can be base64 or db URL)
  const [beforePhoto, setBeforePhoto] = useState<string | null>(null);
  const [afterPhoto, setAfterPhoto] = useState<string | null>(null);
  const [isSavingPhotos, setIsSavingPhotos] = useState(false);

  // Custom text overlays
  const [clinicName, setClinicName] = useState('Shree Ram Dental Clinic');
  const [treatmentLabel, setTreatmentLabel] = useState('');
  const [activeFrameStyle, setActiveFrameStyle] = useState<FrameStyle>('charcoal');

  // AI captions state
  const [captions, setCaptions] = useState<{ educational: string; emotional: string; short: string } | null>(null);
  const [isGeneratingCaptions, setIsGeneratingCaptions] = useState(false);
  const [copiedType, setCopiedType] = useState<'educational' | 'emotional' | 'short' | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Read clinic name from settings
  useEffect(() => {
    try {
      const raw = localStorage.getItem(`clinic_branding_${clinicId}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.clinicName) {
          setClinicName(parsed.clinicName);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [clinicId]);

  // Fetch database patients
  const loadPatients = async () => {
    if (!clinicId || clinicId === 'default') return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('dental_patients')
        .select('id, name, phone, service, before_photo, after_photo, notes')
        .eq('clinic_id', clinicId);

      if (error) {
        toast.error('Failed to load patient records');
      } else if (data) {
        setPatients(data);
        if (data.length > 0 && !selectedPatientId) {
          setSelectedPatientId(data[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, [clinicId]);

  // Selected patient details
  const activePatient = patients.find(p => p.id === selectedPatientId);

  useEffect(() => {
    if (activePatient) {
      setBeforePhoto(activePatient.before_photo);
      setAfterPhoto(activePatient.after_photo);
      setTreatmentLabel(activePatient.service || 'Smile Makeover');
      setCaptions(null); // Reset captions
    }
  }, [selectedPatientId, activePatient]);

  // File Upload Handlers (converts to base64 & updates patient in Supabase)
  const handlePhotoUpload = async (file: File, type: 'before' | 'after') => {
    if (!selectedPatientId) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      if (type === 'before') {
        setBeforePhoto(base64);
      } else {
        setAfterPhoto(base64);
      }

      // Save to Supabase
      setIsSavingPhotos(true);
      try {
        const payload = type === 'before' ? { before_photo: base64 } : { after_photo: base64 };
        const { error } = await supabase
          .from('dental_patients')
          .update(payload)
          .eq('id', selectedPatientId);

        if (error) {
          toast.error(`Failed to save ${type} photo: ` + error.message);
        } else {
          toast.success(`${type.toUpperCase()} photo updated successfully in database.`);
          // Reload patients local list to keep sync
          setPatients(prev => prev.map(p => p.id === selectedPatientId ? { ...p, ...payload } : p));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsSavingPhotos(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Generate Instagram captions using Gemini AI
  const handleGenerateCaptions = async () => {
    if (!activePatient) return;
    setIsGeneratingCaptions(true);
    try {
      const generated = await generateSmileTransformationCaptions(
        activePatient.name,
        treatmentLabel || activePatient.service || 'Smile Makeover',
        activePatient.notes || 'Routine cosmetic dental care and aesthetic enhancement.',
        clinicName
      );
      setCaptions(generated);
      toast.success('AI Instagram captions generated successfully!');
    } catch (e) {
      toast.error('Failed to generate AI captions');
    } finally {
      setIsGeneratingCaptions(false);
    }
  };

  // Copy to clipboard helper
  const handleCopy = (text: string, type: 'educational' | 'emotional' | 'short') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    toast.success('Caption copied to clipboard!');
    setTimeout(() => setCopiedType(null), 2000);
  };

  // Stitches the before and after photos inside a square canvas (1080x1080) for Instagram
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to 1080x1080 (Square Instagram Post)
    canvas.width = 1080;
    canvas.height = 1080;

    // Apply background colors based on style
    if (activeFrameStyle === 'charcoal') {
      ctx.fillStyle = '#0F172A'; // slate-900
    } else if (activeFrameStyle === 'luxury_gold') {
      ctx.fillStyle = '#1E1B4B'; // deep purple/indigo
    } else {
      ctx.fillStyle = '#FFFFFF'; // clean medical white
    }
    ctx.fillRect(0, 0, 1080, 1080);

    // Helper to draw gold borders / frames
    if (activeFrameStyle === 'luxury_gold') {
      ctx.strokeStyle = '#D97706'; // amber-600 gold border
      ctx.lineWidth = 12;
      ctx.strokeRect(6, 6, 1068, 1068);
    } else if (activeFrameStyle === 'charcoal') {
      ctx.strokeStyle = '#334155'; // slate-700
      ctx.lineWidth = 8;
      ctx.strokeRect(4, 4, 1072, 1072);
    } else {
      ctx.strokeStyle = '#E2E8F0'; // slate-200
      ctx.lineWidth = 8;
      ctx.strokeRect(4, 4, 1072, 1072);
    }

    // Header Branding text
    ctx.textBaseline = 'top';
    if (activeFrameStyle === 'luxury_gold') {
      ctx.fillStyle = '#F59E0B'; // Amber Gold
      ctx.font = 'bold 36px Georgia, serif';
    } else if (activeFrameStyle === 'charcoal') {
      ctx.fillStyle = '#F1F5F9';
      ctx.font = 'bold 34px sans-serif';
    } else {
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 34px sans-serif';
    }
    ctx.textAlign = 'center';
    ctx.fillText(clinicName.toUpperCase(), 540, 50);

    // Treatment subtitle
    if (activeFrameStyle === 'luxury_gold') {
      ctx.fillStyle = '#FBBF24'; // light gold
      ctx.font = 'italic 22px Georgia, serif';
    } else {
      ctx.fillStyle = '#6366F1'; // Indigo-500
      ctx.font = 'bold 20px sans-serif';
    }
    ctx.fillText(treatmentLabel.toUpperCase(), 540, 100);

    // Draw images
    const imgWidth = 490;
    const imgHeight = 760;
    const yOffset = 150;
    const leftX = 40;
    const rightX = 550;

    const drawPhoto = (imgSrc: string | null, x: number, badgeText: string) => {
      if (!imgSrc) {
        // Draw placeholder
        ctx.fillStyle = activeFrameStyle === 'clean_medical' ? '#F1F5F9' : '#1E293B';
        ctx.fillRect(x, yOffset, imgWidth, imgHeight);
        ctx.fillStyle = '#64748B';
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`No ${badgeText} Photo Loaded`, x + imgWidth / 2, yOffset + imgHeight / 2);
        
        // Draw badge
        drawBadge(x, yOffset, badgeText);
        return;
      }

      const img = new Image();
      img.onload = () => {
        ctx.save();
        // Create clipping region for rounded corners (optional)
        ctx.beginPath();
        ctx.roundRect(x, yOffset, imgWidth, imgHeight, 12);
        ctx.clip();
        
        // Cover fit scale math
        const imgRatio = img.width / img.height;
        const boxRatio = imgWidth / imgHeight;
        let sx = 0, sy = 0, sw = img.width, sh = img.height;

        if (imgRatio > boxRatio) {
          sw = img.height * boxRatio;
          sx = (img.width - sw) / 2;
        } else {
          sh = img.width / boxRatio;
          sy = (img.height - sh) / 2;
        }

        ctx.drawImage(img, sx, sy, sw, sh, x, yOffset, imgWidth, imgHeight);
        ctx.restore();

        // Draw badge
        drawBadge(x, yOffset, badgeText);
      };
      img.src = imgSrc;
    };

    const drawBadge = (x: number, y: number, text: string) => {
      ctx.save();
      ctx.font = 'bold 22px sans-serif';
      const textWidth = ctx.measureText(text).width;
      const paddingX = 20;
      const paddingY = 10;
      
      // Draw badge backplate
      ctx.fillStyle = text === 'BEFORE' ? '#EF4444' : '#10B981'; // Red for before, Green for after
      ctx.beginPath();
      ctx.roundRect(x + 15, y + 15, textWidth + paddingX * 2, 44, 8);
      ctx.fill();

      // Text inside badge
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'left';
      ctx.fillText(text, x + 15 + paddingX, y + 23);
      ctx.restore();
    };

    drawPhoto(beforePhoto, leftX, 'BEFORE');
    drawPhoto(afterPhoto, rightX, 'AFTER');

    // Footer overlay (branding details)
    ctx.textBaseline = 'bottom';
    if (activeFrameStyle === 'luxury_gold') {
      ctx.fillStyle = '#FBBF24';
      ctx.font = 'italic 18px Georgia, serif';
    } else {
      ctx.fillStyle = '#94A3B8';
      ctx.font = 'medium 15px sans-serif';
    }
    ctx.textAlign = 'center';
    ctx.fillText("✨ SMILE TRANSFORMATION GALLERY | DENTAL CRM ✨", 540, 1045);
  };

  // Re-draw canvas when styling or image variables change
  useEffect(() => {
    drawCanvas();
    // Wait briefly for images to load, then redraw
    const t = setTimeout(drawCanvas, 350);
    return () => clearTimeout(t);
  }, [beforePhoto, afterPhoto, clinicName, treatmentLabel, activeFrameStyle]);

  // Triggers canvas PNG download
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `Smile_Transformation_${activePatient?.name.replace(/\s+/g, '_') || 'Patient'}.png`;
    a.click();
    toast.success('Branded smile transformation image downloaded!');
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.service.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6">
      {/* ── Left Pane (Patients Selector) ────────────────────────────────── */}
      <div className="w-full lg:w-80 flex-shrink-0 flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm h-[280px] lg:h-[750px]">
        {/* Search Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-1.8 text-xs focus:outline-none focus:border-indigo-500 text-slate-700"
            />
          </div>
        </div>

        {/* Patients stream list */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-8 text-center gap-2">
              <RefreshCw size={24} className="text-indigo-500 animate-spin" />
              <p className="text-xs text-slate-400 font-medium">Loading clinical patients...</p>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="p-8 text-center text-slate-400 flex flex-col items-center gap-2">
              <User size={32} className="text-slate-300" />
              <p className="text-xs font-bold text-slate-600">No patients found</p>
            </div>
          ) : (
            filteredPatients.map(p => {
              const isSelected = p.id === selectedPatientId;
              const hasBefore = !!p.before_photo;
              const hasAfter = !!p.after_photo;

              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPatientId(p.id)}
                  className={`flex items-center gap-3 p-3.5 cursor-pointer transition ${
                    isSelected ? 'bg-indigo-50/70 border-l-4 border-indigo-500' : 'hover:bg-slate-50 border-l-4 border-transparent'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 shadow-sm flex-shrink-0 text-sm">
                    {p.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-bold text-slate-800 truncate">{p.name}</h3>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{p.service || 'Smile Transformation'}</p>
                    
                    {/* Visual indicators for photos */}
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className={`text-[8.5px] font-bold px-1.5 py-0.2 rounded ${hasBefore ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                        B
                      </span>
                      <span className={`text-[8.5px] font-bold px-1.5 py-0.2 rounded ${hasAfter ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                        A
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-slate-300" />
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Right Pane (Transformation Graphic Stretcher & AI Generator) ──── */}
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto lg:h-[750px] pr-1 scrollbar-thin">
        {activePatient ? (
          <>
            {/* Header info */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-[9px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded uppercase tracking-wider">Active Patient</span>
                <h2 className="text-lg font-bold text-slate-800 mt-1">{activePatient.name}</h2>
                <p className="text-xs text-slate-400 font-sans mt-0.5">Configure clinical photos and design a high-res square post.</p>
              </div>
              <button
                onClick={handleGenerateCaptions}
                disabled={isGeneratingCaptions}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg px-4 py-2 flex items-center gap-1.5 shadow-sm transition active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Sparkles size={14} />
                {isGeneratingCaptions ? 'Writing Copy...' : 'Generate AI Captions'}
              </button>
            </div>

            {/* Editor Workspace */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Image Editor canvas */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col items-center gap-4">
                <h3 className="text-xs font-bold text-slate-700 self-start border-b border-slate-100 pb-2 w-full flex items-center gap-1.5">
                  <ImageIcon size={14} className="text-indigo-500" />
                  Visual Template Editor
                </h3>

                {/* Main Preview canvas */}
                <div className="w-full aspect-square max-w-[380px] bg-slate-50 rounded-lg overflow-hidden border border-slate-200/80 shadow-md relative group">
                  <canvas ref={canvasRef} className="w-full h-full object-contain" />
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center pointer-events-none">
                    <p className="text-white text-xs font-bold font-sans tracking-wide">1080x1080 Square Preview</p>
                  </div>
                </div>

                {/* Editor settings */}
                <div className="w-full flex flex-col gap-3 mt-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Clinic Name</label>
                    <input
                      type="text"
                      value={clinicName}
                      onChange={(e) => setClinicName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Treatment Caption Label</label>
                    <input
                      type="text"
                      value={treatmentLabel}
                      placeholder="e.g. Veneer Restoration"
                      onChange={(e) => setTreatmentLabel(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-slate-700"
                    />
                  </div>

                  {/* Frame Styles Selector */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Template Theme Style</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['charcoal', 'luxury_gold', 'clean_medical'] as FrameStyle[]).map(style => (
                        <button
                          key={style}
                          onClick={() => setActiveFrameStyle(style)}
                          className={`border rounded-lg p-2 text-[10px] font-bold capitalize transition cursor-pointer ${
                            activeFrameStyle === style
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {style.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action controls */}
                <button
                  onClick={handleDownload}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg py-2.5 text-xs flex items-center justify-center gap-1.5 shadow-md transition active:scale-[0.98] mt-2 cursor-pointer"
                >
                  <Download size={14} /> Download Graphic Post (PNG)
                </button>
              </div>

              {/* Photo Setup Uploaders */}
              <div className="flex flex-col gap-6">
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col gap-4">
                  <h3 className="text-xs font-bold text-slate-700 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                    <Upload size={14} className="text-indigo-500" />
                    Upload Treatment Photos
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Before Photo Box */}
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Before Photo</p>
                      <label className="w-full aspect-[4/5] bg-slate-50 hover:bg-slate-100/70 border-2 border-dashed border-slate-200 hover:border-indigo-300 rounded-xl flex flex-col items-center justify-center gap-2 p-3 text-center cursor-pointer transition group relative overflow-hidden">
                        {beforePhoto ? (
                          <>
                            <img src={beforePhoto} className="w-full h-full object-cover rounded-lg" />
                            <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-[10px] text-white font-bold">Replace</div>
                          </>
                        ) : (
                          <>
                            <Upload size={18} className="text-slate-400 group-hover:text-indigo-500" />
                            <span className="text-[9.5px] font-bold text-slate-500">Add Photo</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files?.[0]) handlePhotoUpload(e.target.files[0], 'before');
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* After Photo Box */}
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-[10px] font-bold text-slate-500 uppercase">After Photo</p>
                      <label className="w-full aspect-[4/5] bg-slate-50 hover:bg-slate-100/70 border-2 border-dashed border-slate-200 hover:border-indigo-300 rounded-xl flex flex-col items-center justify-center gap-2 p-3 text-center cursor-pointer transition group relative overflow-hidden">
                        {afterPhoto ? (
                          <>
                            <img src={afterPhoto} className="w-full h-full object-cover rounded-lg" />
                            <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-[10px] text-white font-bold">Replace</div>
                          </>
                        ) : (
                          <>
                            <Upload size={18} className="text-slate-400 group-hover:text-indigo-500" />
                            <span className="text-[9.5px] font-bold text-slate-500">Add Photo</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files?.[0]) handlePhotoUpload(e.target.files[0], 'after');
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {isSavingPhotos && (
                    <p className="text-[9.5px] text-indigo-500 font-bold text-center animate-pulse">
                      Saving photos directly to Supabase patient records...
                    </p>
                  )}
                </div>

                {/* Gemini AI Copy display panel */}
                {captions && (
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col gap-4">
                    <h3 className="text-xs font-bold text-slate-700 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                      <Sparkles size={14} className="text-indigo-500" />
                      Gemini AI Instagram Copy
                    </h3>

                    <div className="flex flex-col gap-4">
                      {/* Educational Copy */}
                      <div className="bg-slate-50 border border-slate-150 rounded-xl p-3.5 relative">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[9.5px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-wider">Style: Educational</span>
                          <button
                            onClick={() => handleCopy(captions.educational, 'educational')}
                            className="text-slate-400 hover:text-indigo-600 p-1 rounded transition"
                          >
                            {copiedType === 'educational' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                          </button>
                        </div>
                        <p className="text-[11.5px] leading-relaxed text-slate-600 whitespace-pre-wrap font-sans">{captions.educational}</p>
                      </div>

                      {/* Emotional Copy */}
                      <div className="bg-slate-50 border border-slate-150 rounded-xl p-3.5 relative">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[9.5px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-wider">Style: Emotional Story</span>
                          <button
                            onClick={() => handleCopy(captions.emotional, 'emotional')}
                            className="text-slate-400 hover:text-indigo-600 p-1 rounded transition"
                          >
                            {copiedType === 'emotional' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                          </button>
                        </div>
                        <p className="text-[11.5px] leading-relaxed text-slate-600 whitespace-pre-wrap font-sans">{captions.emotional}</p>
                      </div>

                      {/* Viral Copy */}
                      <div className="bg-slate-50 border border-slate-150 rounded-xl p-3.5 relative">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[9.5px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-wider">Style: Short &amp; Punchy</span>
                          <button
                            onClick={() => handleCopy(captions.short, 'short')}
                            className="text-slate-400 hover:text-indigo-600 p-1 rounded transition"
                          >
                            {copiedType === 'short' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                          </button>
                        </div>
                        <p className="text-[11.5px] leading-relaxed text-slate-600 whitespace-pre-wrap font-sans">{captions.short}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center p-8 text-center text-slate-400 shadow-sm min-h-[300px]">
            <Sparkles size={48} className="text-slate-300 mb-3" />
            <h3 className="text-sm font-bold text-slate-700">No Patient Selected</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-[280px]">Select a patient on the left to start compiling their smile transformation Instagram post.</p>
          </div>
        )}
      </div>
    </div>
  );
}
