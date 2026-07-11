import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Check, Copy, ExternalLink, Sparkles, AlertCircle, Building2, Smile, Activity } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import confetti from 'canvas-confetti';

// Initialize Supabase using client variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface ClinicConfig {
  id: string;
  name: string;
  phone: string;
  doctor_name: string;
  google_review_url: string;
}

export default function ReviewAssistant() {
  const [searchParams] = useSearchParams();
  const clientId = searchParams.get('client_id') || '';
  const patientName = searchParams.get('name') || 'Guest';

  const [clinic, setClinic] = useState<ClinicConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [reviewText, setReviewText] = useState('');
  const [copied, setCopied] = useState(false);
  const [rating, setRating] = useState<number>(5);

  // Dynamic customization based on business name
  const isOrtho = clinic?.name?.toLowerCase().includes('ortho') || clinic?.name?.toLowerCase().includes('joint') || clinic?.name?.toLowerCase().includes('anvaya');
  const isDermo = clinic?.name?.toLowerCase().includes('skin') || clinic?.name?.toLowerCase().includes('dermo') || clinic?.name?.toLowerCase().includes('solve');

  const tags = isOrtho 
    ? [
        { id: 'treatment', label: 'Effective treatment' },
        { id: 'expert', label: 'Experienced surgeon' },
        { id: 'clean', label: 'Clean clinic' },
        { id: 'friendly', label: 'Friendly staff' },
        { id: 'explain', label: 'Detailed explanation' },
        { id: 'painless', label: 'Minimal pain' },
      ]
    : isDermo
    ? [
        { id: 'result', label: 'Amazing results' },
        { id: 'care', label: 'Detailed care' },
        { id: 'clean', label: 'Clean clinic' },
        { id: 'friendly', label: 'Friendly staff' },
        { id: 'modern', label: 'Modern equipment' },
        { id: 'painless', label: 'Painless procedure' },
      ]
    : [
        { id: 'painless', label: 'Painless treatment' },
        { id: 'friendly', label: 'Friendly dentist' },
        { id: 'clean', label: 'Clean clinic' },
        { id: 'modern', label: 'Modern equipment' },
        { id: 'price', label: 'Transparent pricing' },
        { id: 'explain', label: 'Detailed explanation' },
      ];

  // Fetch clinic details on mount
  useEffect(() => {
    async function loadClinic() {
      if (!clientId) {
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('dental_clinics')
          .select('id, name, phone, doctor_name, google_review_url')
          .eq('id', clientId)
          .single();

        if (!error && data) {
          setClinic(data as ClinicConfig);
        }
      } catch (err) {
        console.error('Failed to load clinic details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadClinic();
  }, [clientId]);

  // Generate review text dynamically
  useEffect(() => {
    if (selectedTags.length === 0) {
      setReviewText('');
      return;
    }

    const doctorTitle = clinic?.doctor_name ? `Dr. ${clinic.doctor_name.replace(/^Dr\.\s+/i, '')}` : 'the doctor';
    const businessType = isOrtho ? 'orthopaedic care' : isDermo ? 'dermatology treatment' : 'dental treatment';
    const clinicName = clinic?.name || 'this clinic';

    let sentences: string[] = [];
    sentences.push(`Had an absolutely wonderful experience getting my ${businessType} done at ${clinicName}.`);

    if (selectedTags.includes('painless')) {
      sentences.push(isOrtho ? `The treatment was very comfortable with minimal pain.` : `The procedures were completely painless and extremely comfortable.`);
    }
    if (selectedTags.includes('friendly') || selectedTags.includes('expert')) {
      sentences.push(`${doctorTitle} and the staff are incredibly professional, experienced, and warm.`);
    }
    if (selectedTags.includes('clean')) {
      sentences.push(`The clinic is clean, hygienic, and follows proper safety protocols.`);
    }
    if (selectedTags.includes('modern')) {
      sentences.push(`They use very modern equipment and advanced techniques.`);
    }
    if (selectedTags.includes('explain')) {
      sentences.push(`${doctorTitle} explained the treatment details and steps very clearly.`);
    }
    if (selectedTags.includes('price')) {
      sentences.push(`The clinic offered very transparent pricing without any hidden charges.`);
    }
    if (selectedTags.includes('treatment') || selectedTags.includes('result')) {
      sentences.push(`The results are amazing, and I am very satisfied with the treatment.`);
    }

    sentences.push('Highly recommended for anyone looking for quality care!');
    setReviewText(sentences.join(' '));
  }, [selectedTags, clinic, isOrtho, isDermo]);

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
    );
  };

  const handleCopyAndRedirect = async () => {
    const finalReview = reviewText || `Highly recommend ${clinic?.name || 'this clinic'}! Had a great experience.`;
    
    // Copy to clipboard
    try {
      await navigator.clipboard.writeText(finalReview);
      setCopied(true);
      
      // Celebrate
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.8 }
      });

      // Reset copied state after 3s
      setTimeout(() => setCopied(false), 3000);

      // Open Google Review Link
      const targetUrl = clinic?.google_review_url || 'https://maps.google.com';
      setTimeout(() => {
        window.open(targetUrl, '_blank');
      }, 1000);

    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Preparing your assistant...</p>
        </div>
      </div>
    );
  }

  if (!clinic) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 text-center shadow-lg space-y-4">
          <div className="w-14 h-14 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-center mx-auto text-rose-500">
            <AlertCircle size={28} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Invalid Link</h2>
            <p className="text-xs text-slate-500 mt-1">This review assistant link appears to be broken or expired.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden flex flex-col">
        {/* Dynamic Header */}
        <div className="p-6 bg-slate-900 border-b border-slate-800 text-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
              {isOrtho ? (
                <Activity size={20} className="text-teal-400" />
              ) : isDermo ? (
                <Sparkles size={20} className="text-pink-400" />
              ) : (
                <Smile size={20} className="text-emerald-400" />
              )}
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">{clinic.name}</h2>
              <p className="text-xs text-slate-400">Review Helper Portal</p>
            </div>
          </div>
          <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-300">
            GMB Partner
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Greeting */}
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-800">Hi {patientName}!</h3>
            <p className="text-xs text-slate-500">Draft a beautiful 5-star review in one tap using our AI builder below.</p>
          </div>

          {/* Interactive Star Rating */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Rating</span>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-transform active:scale-95"
                >
                  <Star
                    size={28}
                    className={`transition-colors ${
                      star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating < 5 && (
              <span className="text-[11px] text-amber-600 font-semibold mt-1">
                ⭐ Draft helpers are optimized for 5-star feedback.
              </span>
            )}
          </div>

          {/* Selection Tags */}
          <div className="space-y-2">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tap what you liked</span>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => {
                const isSelected = selectedTags.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    onClick={() => handleTagToggle(tag.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {tag.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Output Area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Sparkles size={11} className="text-indigo-500 animate-pulse" /> Final Draft Preview
              </span>
              {reviewText && (
                <span className="text-[10px] text-slate-400">Feel free to edit this text</span>
              )}
            </div>
            <div className="relative">
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Choose tags above or write your custom feedback here..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-xs text-slate-800 leading-relaxed outline-none focus:border-indigo-500 focus:bg-white transition-all resize-none min-h-[120px]"
              />
            </div>
          </div>
        </div>

        {/* Action Button Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-200">
          <button
            onClick={handleCopyAndRedirect}
            disabled={!reviewText}
            className={`w-full py-3.5 rounded-2xl text-xs font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
              reviewText
                ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 active:scale-[0.99] cursor-pointer'
                : 'bg-slate-350 shadow-none cursor-not-allowed'
            }`}
          >
            {copied ? (
              <>
                <Check size={16} /> Copied! Opening Google Reviews...
              </>
            ) : (
              <>
                <Copy size={15} /> Copy & Post on Google Reviews <ExternalLink size={13} />
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Instruction Tip */}
      <p className="text-[10px] text-slate-400 text-center mt-4 max-w-sm">
        💡 After copying, the Google Maps page will open automatically. Just <b>Paste (long press)</b> your text into Google's review box and hit post!
      </p>
    </div>
  );
}
