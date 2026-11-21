import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  Img,
  staticFile,
} from 'remotion';

// =========================================================================
// CLINAZA INSTAGRAM REEL: KINETIC WORD-LEVEL SUBTITLES (TIKTOK / HORMOZI STYLE)
// Inspired by: remotion-dev/template-tiktok & gyoridavid/short-video-maker
// Stack: Remotion + Spring Physics + Word-by-Word Kinetic Subtitles + Emoji Pops
// Dimensions: 1080 x 1920 (9:16 Portrait) | Duration: 18s (540 Frames @ 30 FPS)
// =========================================================================

interface TimedWord {
  text: string;
  startFrame: number;
  endFrame: number;
  highlight?: 'yellow' | 'green' | 'cyan' | 'red';
  emoji?: string;
  isBig?: boolean;
}

interface CaptionGroup {
  id: string;
  startFrame: number;
  endFrame: number;
  words: TimedWord[];
  speakerBadge?: string;
}

// ── Word-Level Timed Captions ──
const CAPTION_GROUPS: CaptionGroup[] = [
  {
    id: 'hook',
    startFrame: 0,
    endFrame: 105,
    speakerBadge: '⚠️ DENTAL CLINIC DIRECTORS',
    words: [
      { text: 'Dentists:', startFrame: 5, endFrame: 22, highlight: 'yellow', emoji: '🦷' },
      { text: 'Stop', startFrame: 22, endFrame: 38, highlight: 'red', isBig: true },
      { text: 'losing', startFrame: 38, endFrame: 52 },
      { text: '₹65,000', startFrame: 52, endFrame: 74, highlight: 'yellow', emoji: '💸', isBig: true },
      { text: 'cases', startFrame: 74, endFrame: 90 },
      { text: 'chairside!', startFrame: 90, endFrame: 105, highlight: 'cyan' },
    ],
  },
  {
    id: 'problem',
    startFrame: 105,
    endFrame: 215,
    speakerBadge: '❌ THE USUAL MISTAKE',
    words: [
      { text: 'Offering', startFrame: 110, endFrame: 126 },
      { text: 'cash', startFrame: 126, endFrame: 142 },
      { text: 'discounts', startFrame: 142, endFrame: 165, highlight: 'red', emoji: '📉' },
      { text: 'kills', startFrame: 165, endFrame: 182, highlight: 'red' },
      { text: 'your', startFrame: 182, endFrame: 196 },
      { text: 'profit', startFrame: 196, endFrame: 215, highlight: 'yellow' },
    ],
  },
  {
    id: 'solution',
    startFrame: 215,
    endFrame: 325,
    speakerBadge: '💡 THE CLINAZA FIX',
    words: [
      { text: 'With', startFrame: 220, endFrame: 235 },
      { text: 'Clinaza,', startFrame: 235, endFrame: 255, highlight: 'cyan' },
      { text: 'patients', startFrame: 255, endFrame: 275 },
      { text: 'split', startFrame: 275, endFrame: 295, highlight: 'green', emoji: '💳' },
      { text: 'into', startFrame: 295, endFrame: 310 },
      { text: 'EMIs!', startFrame: 310, endFrame: 325, highlight: 'green', isBig: true },
    ],
  },
  {
    id: 'guarantee',
    startFrame: 325,
    endFrame: 435,
    speakerBadge: '⚡ 100% UPFRONT T+1 PAYOUT',
    words: [
      { text: 'You', startFrame: 330, endFrame: 348 },
      { text: 'get', startFrame: 348, endFrame: 365 },
      { text: 'paid', startFrame: 365, endFrame: 382, highlight: 'green', emoji: '🏦' },
      { text: 'next', startFrame: 382, endFrame: 400 },
      { text: 'day,', startFrame: 400, endFrame: 418, highlight: 'yellow' },
      { text: 'zero', startFrame: 418, endFrame: 435, highlight: 'green', emoji: '🛡️', isBig: true },
    ],
  },
  {
    id: 'cta',
    startFrame: 435,
    endFrame: 540,
    speakerBadge: '📲 ACTIVATE YOUR CLINIC DESK',
    words: [
      { text: 'WhatsApp', startFrame: 440, endFrame: 465, highlight: 'green', emoji: '📲' },
      { text: 'your', startFrame: 465, endFrame: 485 },
      { text: 'docs', startFrame: 485, endFrame: 510, highlight: 'cyan' },
      { text: 'today!', startFrame: 510, endFrame: 540, highlight: 'yellow', emoji: '🚀', isBig: true },
    ],
  },
];

export const KineticSubtitlesReelVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Subtle background zoom
  const bgScale = interpolate(frame, [0, 540], [1.02, 1.15], {
    extrapolateRight: 'clamp',
  });

  // Top progress bar
  const progressPercent = interpolate(frame, [0, 540], [0, 100], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#020617',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Impact', 'Montserrat', 'Inter', sans-serif",
        color: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
        width: 1080,
        height: 1920,
      }}
    >
      {/* ── Background: Real Clinic Photographic Texture with Dynamic Drift ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${bgScale})`,
          opacity: 0.22,
          mixBlendMode: 'luminosity',
          pointerEvents: 'none',
        }}
      >
        <Img
          src={staticFile('assets/carousel_v2/doctor_tablet_new.jpg')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>

      {/* ── High-Contrast Dark Gradient Overlay ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(2, 6, 23, 0.95) 0%, rgba(2, 6, 23, 0.82) 40%, rgba(2, 6, 23, 0.96) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Top Progress Bar (TikTok Native Feeling) ── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${progressPercent}%`,
          height: 8,
          background: 'linear-gradient(90deg, #0867E8 0%, #10B981 50%, #FCD34D 100%)',
          zIndex: 60,
          boxShadow: '0 0 16px rgba(16, 185, 129, 0.8)',
        }}
      />

      {/* ── Top Header: Clinaza Logo & Badge ── */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: 50,
          right: 50,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 40,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Img
            src={staticFile('assets/clinaza-logo.jpg')}
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              objectFit: 'cover',
              boxShadow: '0 8px 24px rgba(8, 103, 232, 0.45)',
            }}
          />
          <div>
            <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: '0.04em', color: '#FFF' }}>
              CLINAZA
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#38BDF8' }}>
              POINT-OF-CARE FINANCING
            </div>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            padding: '8px 18px',
            borderRadius: 30,
            fontSize: 15,
            fontWeight: 800,
            color: '#10B981',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#10B981', boxShadow: '0 0 8px #10B981' }} />
          195+ Clinics
        </div>
      </div>

      {/* ── Active Center: Bouncy Kinetic Subtitles Container ── */}
      <div
        style={{
          position: 'absolute',
          top: 380,
          left: 60,
          right: 60,
          bottom: 360,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          zIndex: 30,
        }}
      >
        {CAPTION_GROUPS.map((group) => {
          if (frame < group.startFrame || frame > group.endFrame) return null;

          return (
            <div
              key={group.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
              }}
            >
              {/* Speaker Category Pill */}
              {group.speakerBadge && (
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: '1.5px solid rgba(56, 189, 248, 0.5)',
                    padding: '8px 24px',
                    borderRadius: 30,
                    fontSize: 18,
                    fontWeight: 900,
                    color: '#38BDF8',
                    letterSpacing: '0.05em',
                    marginBottom: 35,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                  }}
                >
                  {group.speakerBadge}
                </div>
              )}

              {/* Word by Word Wrap */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '14px 22px',
                  maxWidth: 960,
                }}
              >
                {group.words.map((word, wIdx) => {
                  const isWordActive = frame >= word.startFrame && frame < word.endFrame;
                  const isWordPast = frame >= word.endFrame;

                  // Bouncy spring on active word entry
                  const wordSpring = spring({
                    frame: frame - word.startFrame,
                    fps,
                    config: { damping: 10, stiffness: 220, mass: 0.8 },
                  });

                  // Color determination
                  let textColor = '#FFFFFF';
                  let textShadow = '0 6px 20px rgba(0,0,0,0.9)';
                  let bgHighlight = 'transparent';

                  if (isWordActive) {
                    if (word.highlight === 'yellow') {
                      textColor = '#FCD34D';
                      bgHighlight = 'rgba(252, 211, 77, 0.15)';
                      textShadow = '0 0 25px rgba(252, 211, 77, 0.7)';
                    } else if (word.highlight === 'green') {
                      textColor = '#10B981';
                      bgHighlight = 'rgba(16, 185, 129, 0.15)';
                      textShadow = '0 0 25px rgba(16, 185, 129, 0.7)';
                    } else if (word.highlight === 'cyan') {
                      textColor = '#38BDF8';
                      bgHighlight = 'rgba(56, 189, 248, 0.15)';
                      textShadow = '0 0 25px rgba(56, 189, 248, 0.7)';
                    } else if (word.highlight === 'red') {
                      textColor = '#EF4444';
                      bgHighlight = 'rgba(239, 68, 68, 0.15)';
                      textShadow = '0 0 25px rgba(239, 68, 68, 0.7)';
                    } else {
                      textColor = '#FCD34D';
                      textShadow = '0 0 20px rgba(252, 211, 77, 0.6)';
                    }
                  } else if (isWordPast) {
                    textColor = 'rgba(255, 255, 255, 0.85)';
                  } else {
                    textColor = 'rgba(255, 255, 255, 0.3)';
                  }

                  const scale = isWordActive
                    ? interpolate(wordSpring, [0, 1], [0.8, word.isBig ? 1.25 : 1.15])
                    : 1.0;

                  return (
                    <span
                      key={wIdx}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        transform: `scale(${scale})`,
                        color: textColor,
                        fontSize: word.isBig ? 68 : 56,
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: '-0.02em',
                        lineHeight: 1.15,
                        textShadow,
                        backgroundColor: bgHighlight,
                        padding: isWordActive ? '4px 14px' : '0 4px',
                        borderRadius: 14,
                        transition: 'color 0.1s ease',
                      }}
                    >
                      {word.text}
                      {isWordActive && word.emoji && (
                        <span style={{ fontSize: word.isBig ? 54 : 44, transform: 'translateY(-2px)' }}>
                          {word.emoji}
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Visual Anchor Card: Dynamic Context Based on Scene ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 140,
          left: 60,
          right: 60,
          zIndex: 35,
        }}
      >
        {frame < 215 ? (
          /* Hook / Problem Anchor: Lost Revenue Ticker */
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.95)',
              border: '2px solid rgba(239, 68, 68, 0.5)',
              borderRadius: 24,
              padding: '22px 30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 36 }}>❌</span>
              <div>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#EF4444' }}>Chairside Price Hesitation</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#CBD5E1' }}>Patients walk out to "think about" implants</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#FCD34D' }}>-₹2.5L/mo</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#94A3B8' }}>Lost Clinic Revenue</div>
            </div>
          </div>
        ) : frame < 435 ? (
          /* Solution / Guarantee Anchor: Upfront Settlement */
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.95)',
              border: '2px solid rgba(16, 185, 129, 0.5)',
              borderRadius: 24,
              padding: '22px 30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 36 }}>⚡</span>
              <div>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#10B981' }}>100% Upfront T+1 Payout</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#CBD5E1' }}>Direct to Clinic Current A/c • 0% Doctor Risk</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#38BDF8' }}>55+ Banks</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#94A3B8' }}>Pine Labs Plural</div>
            </div>
          </div>
        ) : (
          /* Final CTA Anchor: WhatsApp Desk */
          <div
            style={{
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              borderRadius: 24,
              padding: '24px 32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 20px 50px rgba(16, 185, 129, 0.55)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 36 }}>📲</span>
              <div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#FFF' }}>WhatsApp: +91 72929 84244</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#D1FAE5' }}>Send PAN + Aadhaar + Cheque to Activate</div>
              </div>
            </div>
            <span style={{ fontSize: 18, fontWeight: 900, color: '#064E3B', background: '#FFF', padding: '10px 18px', borderRadius: 14 }}>
              JOIN DESK
            </span>
          </div>
        )}
      </div>

      {/* ── Bottom Safe-Zone Footer ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: 60,
          right: 60,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 16,
          fontWeight: 800,
          color: '#94A3B8',
          zIndex: 40,
        }}
      >
        <span>@clinaza.in</span>
        <span>clinaza.in</span>
      </div>
    </AbsoluteFill>
  );
};