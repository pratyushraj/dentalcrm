import React, { useState } from 'react';
import { Player } from '@remotion/player';
import { EstimateVideoComposition, EstimateVideoProps } from './EstimateVideo';
import { SocialReelComposition, SocialReelProps } from './SocialReelVideo';
import { ClinazaEmiReelComposition, ClinazaEmiReelProps } from './ClinazaEmiReelVideo';
import { Video, X, Download, Share2, Sparkles, RefreshCw, Play } from 'lucide-react';
import { toast } from 'sonner';

interface RemotionVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'estimate' | 'social' | 'clinaza-emi';
  estimateData?: Partial<EstimateVideoProps>;
  socialData?: Partial<SocialReelProps>;
  emiReelData?: Partial<ClinazaEmiReelProps>;
}

export const RemotionVideoModal: React.FC<RemotionVideoModalProps> = ({
  isOpen,
  onClose,
  mode,
  estimateData,
  socialData,
  emiReelData,
}) => {
  if (!isOpen) return null;

  const defaultEstimate: EstimateVideoProps = {
    patientName: estimateData?.patientName || 'Rahul Sharma',
    clinicName: estimateData?.clinicName || 'Clinaza Partner Dental Care',
    doctorName: estimateData?.doctorName || 'Dr. Aryan Parmar',
    items: estimateData?.items || [
      { name: 'Dental Implant (Titanium)', cost: 35000, tooth: '16' },
      { name: 'Zirconia Crown', cost: 12000, tooth: '16' },
    ],
    grandTotal: estimateData?.grandTotal || 47000,
    monthlyEmi: estimateData?.monthlyEmi || 2150,
    tenureMonths: estimateData?.tenureMonths || 24,
    clinicPhone: estimateData?.clinicPhone || '+91 7292984244',
    clinicAddress: estimateData?.clinicAddress || 'Patliputra Colony, Patna',
  };

  const defaultSocial: SocialReelProps = {
    hookTitle: socialData?.hookTitle || '3 Reasons To Choose Invisible Aligners Over Braces 🦷✨',
    points: socialData?.points || [
      'Virtually Invisible & Discreet in Photos',
      'Removable for Easy Eating & Brushing',
      'Predictable Results with 3D Digital Simulation'
    ],
    callToAction: socialData?.callToAction || 'Book Free 3D Scan & EMI Consultation',
    clinicName: socialData?.clinicName || 'Clinaza Dental Clinic',
    accentColor: socialData?.accentColor || '#10B981',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
        {/* Left Video Player Preview (9:16 Aspect Ratio) */}
        <div className="md:w-1/2 bg-slate-950 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-800">
          <div className="w-[280px] sm:w-[320px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl border border-slate-800 relative bg-black">
            {mode === 'estimate' ? (
              <Player
                component={EstimateVideoComposition}
                inputProps={defaultEstimate}
                durationInFrames={450} // 15 seconds at 30 fps
                fps={30}
                compositionWidth={1080}
                compositionHeight={1920}
                style={{
                  width: '100%',
                  height: '100%',
                }}
                controls
                autoPlay
                loop
              />
            ) : mode === 'clinaza-emi' ? (
              <Player
                component={ClinazaEmiReelComposition}
                inputProps={emiReelData || {}}
                durationInFrames={450} // 15 seconds at 30 fps
                fps={30}
                compositionWidth={1080}
                compositionHeight={1920}
                style={{
                  width: '100%',
                  height: '100%',
                }}
                controls
                autoPlay
                loop
              />
            ) : (
              <Player
                component={SocialReelComposition}
                inputProps={defaultSocial}
                durationInFrames={300} // 10 seconds at 30 fps
                fps={30}
                compositionWidth={1080}
                compositionHeight={1920}
                style={{
                  width: '100%',
                  height: '100%',
                }}
                controls
                autoPlay
                loop
              />
            )}
          </div>
          <span className="text-[11px] text-slate-500 mt-3 flex items-center gap-1">
            <Play size={12} className="text-emerald-400" /> Interactive Remotion 1080×1920 Video (Instagram 9:16)
          </span>
        </div>

        {/* Right Info & Actions Panel */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Remotion Video Engine
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {mode === 'estimate'
                  ? 'Patient Video Estimate'
                  : mode === 'clinaza-emi'
                    ? 'Clinaza EMI Breakdown Reel'
                    : 'Clinic Social Reel'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {mode === 'estimate'
                  ? 'Personalized 15-second care plan breakdown with animated monthly EMI options.'
                  : mode === 'clinaza-emi'
                    ? '15-second high-conversion Instagram Reel breaking down ₹60,000 implants into ₹2,650/month.'
                    : 'Automated kinetic motion typography reel for Instagram, Shorts & WhatsApp Status.'}
              </p>
            </div>

            {mode === 'estimate' ? (
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Patient:</span>
                  <strong className="text-white">{defaultEstimate.patientName}</strong>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Procedures:</span>
                  <strong className="text-white">{defaultEstimate.items.length} items</strong>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Total Value:</span>
                  <strong className="text-white">₹{defaultEstimate.grandTotal.toLocaleString('en-IN')}</strong>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-800/80 text-emerald-400 font-bold">
                  <span>Monthly EMI:</span>
                  <span className="text-sm">₹{defaultEstimate.monthlyEmi.toLocaleString('en-IN')} / mo</span>
                </div>
              </div>
            ) : mode === 'clinaza-emi' ? (
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Treatment:</span>
                  <strong className="text-white">Dental Implants &amp; Aligners</strong>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Upfront Cost:</span>
                  <span className="text-rose-400 line-through font-bold">₹60,000</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-800/80 text-emerald-400 font-bold">
                  <span>Clinaza Monthly EMI:</span>
                  <span className="text-base">₹2,650 / month</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  ⚡ 2-min paperless digital approval &bull; Powered by 15+ Banks &amp; NBFCs
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
                <span className="text-slate-400 block font-semibold">Hook Title:</span>
                <p className="text-white font-bold">{defaultSocial.hookTitle}</p>
                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-slate-400 block mb-1">Key Talking Points:</span>
                  <ul className="space-y-1 text-slate-300">
                    {defaultSocial.points.map((p, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-800">
            <button
              onClick={() => {
                toast.success('Video link ready! WhatsApp preview shared with patient.');
              }}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-500/15 flex items-center justify-center gap-2"
            >
              <Share2 size={16} /> Share Video via WhatsApp
            </button>
            <button
              onClick={() => {
                toast.success('Generating 1080x1920 MP4 Video render...');
              }}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Download size={15} /> Export 1080×1920 MP4
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
