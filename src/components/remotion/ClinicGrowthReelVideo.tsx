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

export interface ClinicGrowthReelProps {
  title?: string;
  websiteUrl?: string;
}

export const clinicGrowthReelDefaultProps: ClinicGrowthReelProps = {
  title: 'Why Are 70% of Dental Patients Leaving Without Treatment? ❌🦷',
  websiteUrl: 'clinaza.in',
};

// ── INSTAGRAM REEL SAFE ZONE (1080 x 1920) ──
// Top 140px: clears status bar & search icon
// Right 60px: clears heart/comment icons edge
// Bottom 240px: clears account caption & audio track
// Left 60px: symmetrical margin
const INSTA_SAFE_PADDING = '140px 60px 240px 60px';

// ── HIGH-END MOTION GRAPHICS UTILITIES ──

/** Film Grain Noise Overlay */
const FilmGrainOverlay: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      opacity: 0.04,
      pointerEvents: 'none',
      zIndex: 50,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    }}
  />
);

/** Dynamic Pulsing Ambient Glow Background */
const AmbientMotionBackground: React.FC<{ primaryColor: string; secondaryColor: string; frame: number }> = ({
  primaryColor,
  secondaryColor,
  frame,
}) => {
  const x1 = Math.sin(frame / 20) * 80;
  const y1 = Math.cos(frame / 24) * 60;
  const x2 = Math.cos(frame / 18) * 70;
  const y2 = Math.sin(frame / 22) * 50;

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
      {/* Subtle grid pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.1,
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: 750,
          height: 750,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${primaryColor} 0%, transparent 65%)`,
          opacity: 0.35,
          filter: 'blur(100px)',
          transform: `translate(${x1}px, ${y1}px)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '5%',
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${secondaryColor} 0%, transparent 65%)`,
          opacity: 0.28,
          filter: 'blur(110px)',
          transform: `translate(${x2}px, ${y2}px)`,
        }}
      />
    </div>
  );
};

/** Kinetic Word-by-Word Highlighting Headline */
const KineticTitle: React.FC<{
  words: { text: string; highlight?: boolean; color?: string }[];
  frame: number;
  fps: number;
  delay?: number;
}> = ({ words, frame, fps, delay = 0 }) => {
  return (
    <h1
      style={{
        fontSize: 46,
        fontWeight: 900,
        lineHeight: 1.18,
        margin: '0 0 16px 0',
        color: '#FFFFFF',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px 14px',
        textShadow: '0 6px 25px rgba(0,0,0,0.9)',
      }}
    >
      {words.map((w, idx) => {
        const wordDelay = delay + idx * 3;
        const wordSpring = spring({
          frame: frame - wordDelay,
          fps,
          config: { damping: 12, mass: 0.4 },
        });
        const wordOpacity = interpolate(frame - wordDelay, [0, 6], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        return (
          <span
            key={idx}
            style={{
              display: 'inline-block',
              transform: `scale(${wordSpring}) translateY(${interpolate(wordSpring, [0, 1], [15, 0])}px)`,
              opacity: wordOpacity,
              color: w.highlight ? (w.color || '#FACC15') : '#FFFFFF',
              background: w.highlight ? 'rgba(250, 204, 21, 0.15)' : 'transparent',
              padding: w.highlight ? '2px 10px' : '0',
              borderRadius: w.highlight ? 8 : 0,
              border: w.highlight ? '1px solid rgba(250, 204, 21, 0.4)' : 'none',
            }}
          >
            {w.text}
          </span>
        );
      })}
    </h1>
  );
};

// ── COMPOSITION ROOT ──
export const ClinicGrowthReelComposition: React.FC<ClinicGrowthReelProps> = ({
  websiteUrl = 'clinaza.in',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 120 frames per slide (4s each, 6 slides = 720 frames / 24s)
  const SLIDE_DURATION = 120;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#030712',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: '#ffffff',
        overflow: 'hidden',
      }}
    >
      <FilmGrainOverlay />

      {/* SLIDE 1: VIRAL HOOK WITH DROP-OFF RADAR (0 - 4s) */}
      <Sequence from={0} durationInFrames={SLIDE_DURATION}>
        <Slide1Hook frame={frame} fps={fps} />
      </Sequence>

      {/* SLIDE 2: SECRET #1 - INTERACTIVE EMI COST SLASHER (4 - 8s) */}
      <Sequence from={SLIDE_DURATION} durationInFrames={SLIDE_DURATION}>
        <Slide2EmiCost frame={frame - SLIDE_DURATION} fps={fps} />
      </Sequence>

      {/* SLIDE 3: SECRET #2 - ANIMATED WHATSAPP CHAT SIMULATOR (8 - 12s) */}
      <Sequence from={SLIDE_DURATION * 2} durationInFrames={SLIDE_DURATION}>
        <Slide3WhatsAppSim frame={frame - SLIDE_DURATION * 2} fps={fps} />
      </Sequence>

      {/* SLIDE 4: SECRET #3 - GOOGLE AI OVERVIEW MOCKUP (12 - 16s) */}
      <Sequence from={SLIDE_DURATION * 3} durationInFrames={SLIDE_DURATION}>
        <Slide4GoogleAiMockup frame={frame - SLIDE_DURATION * 3} fps={fps} />
      </Sequence>

      {/* SLIDE 5: SECRET #4 - CHATGPT GEO SEARCH CARD (16 - 20s) */}
      <Sequence from={SLIDE_DURATION * 4} durationInFrames={SLIDE_DURATION}>
        <Slide5ChatGptGeo frame={frame - SLIDE_DURATION * 4} fps={fps} />
      </Sequence>

      {/* SLIDE 6: HIGH CONVERTING 3D CTA (20 - 24s) */}
      <Sequence from={SLIDE_DURATION * 5} durationInFrames={SLIDE_DURATION}>
        <Slide6FinalCTA frame={frame - SLIDE_DURATION * 5} fps={fps} websiteUrl={websiteUrl} />
      </Sequence>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════
// SCENE 1: VIRAL HOOK (DENTIST + TIGHT VERTICAL COMPOSITION)
// ══════════════════════════════════════════════════════════════════
const Slide1Hook: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const badgeSpring = spring({ frame, fps, config: { damping: 10 } });
  const meterDrop = interpolate(frame, [15, 60], [100, 30], { extrapolateRight: 'clamp' });
  const pulseScale = Math.sin(frame / 6) * 0.05 + 1;
  const doctorScale = interpolate(frame, [0, 120], [1.0, 1.08]);

  const hookWords = [
    { text: 'Why' },
    { text: 'Are' },
    { text: '70%', highlight: true, color: '#EF4444' },
    { text: 'Of' },
    { text: 'Dental' },
    { text: 'Patients' },
    { text: 'Leaving', highlight: true, color: '#F87171' },
    { text: 'Without' },
    { text: 'Treatment? ❌' },
  ];

  return (
    <AbsoluteFill>
      {/* Background Dentist Consulting Patient in Clinic */}
      <Img
        src={staticFile('assets/doctor-consult-real.png')}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${doctorScale})`,
          filter: 'brightness(0.35) contrast(1.1)',
        }}
      />

      <AmbientMotionBackground primaryColor="#DC2626" secondaryColor="#4F46E5" frame={frame} />

      {/* Main Content: Centered, balanced, zero empty dead space */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          padding: INSTA_SAFE_PADDING,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 24,
          zIndex: 10,
        }}
      >
        {/* Top Doctor Profile Tag & Revenue Crisis Badge */}
        <div style={{ transform: `scale(${badgeSpring})`, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 18px',
              borderRadius: 999,
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              border: '1.5px solid rgba(255, 255, 255, 0.25)',
            }}
          >
            <span style={{ fontSize: 16 }}>👨‍⚕️</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#F8FAFC' }}>
              DR. ARYAN PARMAR · DENTAL SURGEON
            </span>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 18px',
              borderRadius: 999,
              backgroundColor: 'rgba(239, 68, 68, 0.25)',
              border: '2px solid #EF4444',
              color: '#FECACA',
              fontSize: 14,
              fontWeight: 900,
              letterSpacing: 1.2,
              boxShadow: '0 0 25px rgba(239, 68, 68, 0.4)',
            }}
          >
            <span>🚨</span> CLINIC REVENUE CRISIS
          </div>
        </div>

        {/* Dynamic Animated Meter UI Card */}
        <div
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.92)',
            border: '2px solid rgba(239, 68, 68, 0.4)',
            borderRadius: 28,
            padding: 28,
            backdropFilter: 'blur(20px)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{ fontSize: 17, fontWeight: 800, color: '#94A3B8' }}>CASE ACCEPTANCE RATE</span>
            <span style={{ fontSize: 32, fontWeight: 900, color: '#EF4444', transform: `scale(${pulseScale})` }}>
              {Math.round(meterDrop)}%
            </span>
          </div>

          {/* Progress Bar with plummeting animation */}
          <div style={{ height: 18, width: '100%', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 999, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${meterDrop}%`,
                background: 'linear-gradient(90deg, #EF4444, #F87171)',
                borderRadius: 999,
                boxShadow: '0 0 20px rgba(239, 68, 68, 0.8)',
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 14, color: '#EF4444', fontWeight: 800 }}>
            <span>📉 Average: 30%</span>
            <span>🏆 Top Clinics: 85%+</span>
          </div>
        </div>

        {/* Kinetic Title & Subtitle */}
        <div
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 28,
            padding: 26,
            backdropFilter: 'blur(16px)',
          }}
        >
          <KineticTitle words={hookWords} frame={frame} fps={fps} delay={5} />
          <p style={{ fontSize: 21, color: '#E2E8F0', fontWeight: 600, lineHeight: 1.45, margin: 0 }}>
            It’s NOT your clinical skills. Here is the 5-step secret playbook top clinics use to 3X case acceptance!
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════
// SCENE 2: SECRET #1 - EMI COST SLASHER
// ══════════════════════════════════════════════════════════════════
const Slide2EmiCost: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const cardSpring = spring({ frame, fps, config: { damping: 11 } });
  const slashProgress = interpolate(frame, [25, 45], [0, 100], { extrapolateRight: 'clamp' });
  const emiReveal = spring({ frame: frame - 40, fps, config: { damping: 10 } });
  const bgScale = interpolate(frame, [0, 120], [1.0, 1.06]);

  return (
    <AbsoluteFill>
      {/* Background Dentist Showing EMI on Tablet */}
      <Img
        src={staticFile('assets/reels/patient_emi_tablet.jpg')}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${bgScale})`,
          filter: 'brightness(0.3) contrast(1.15)',
        }}
      />

      <AmbientMotionBackground primaryColor="#059669" secondaryColor="#0284C7" frame={frame} />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          padding: INSTA_SAFE_PADDING,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 24,
          zIndex: 10,
        }}
      >
        {/* Secret Badge */}
        <div>
          <span
            style={{
              padding: '10px 22px',
              borderRadius: 999,
              backgroundColor: '#059669',
              color: '#FFFFFF',
              fontSize: 15,
              fontWeight: 900,
              letterSpacing: 1.5,
              boxShadow: '0 6px 25px rgba(5, 150, 105, 0.4)',
            }}
          >
            SECRET #1: FINANCING
          </span>
        </div>

        {/* Interactive Payment Transformation Card */}
        <div
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.94)',
            border: '2px solid rgba(16, 185, 129, 0.4)',
            borderRadius: 32,
            padding: 32,
            boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
            transform: `scale(${cardSpring})`,
            backdropFilter: 'blur(20px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span style={{ fontSize: 24 }}>🦷</span>
            <span style={{ fontSize: 17, fontWeight: 800, color: '#94A3B8' }}>
              IMPLANTS &amp; INVISIBLE ALIGNERS
            </span>
          </div>

          {/* Slashed Upfront Price */}
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: 20 }}>
            <div style={{ fontSize: 42, fontWeight: 900, color: '#64748B' }}>
              ₹65,000 <span style={{ fontSize: 22 }}>Upfront</span>
            </div>
            {/* Red Strike-Through Bar */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: -6,
                height: 6,
                width: `${slashProgress}%`,
                backgroundColor: '#EF4444',
                transform: 'rotate(-6deg)',
                borderRadius: 999,
                boxShadow: '0 0 15px rgba(239,68,68,0.9)',
              }}
            />
          </div>

          {/* Glowing Green EMI Transformation Box */}
          <div
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              border: '2px solid #10B981',
              borderRadius: 24,
              padding: '22px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transform: `scale(${emiReveal})`,
              opacity: interpolate(frame, [35, 45], [0, 1], { extrapolateRight: 'clamp' }),
              boxShadow: '0 10px 40px rgba(16, 185, 129, 0.45)',
            }}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 900, color: '#6EE7B7', letterSpacing: 1 }}>
                PATIENT PAYS JUST
              </div>
              <div style={{ fontSize: 44, fontWeight: 900, color: '#FFFFFF' }}>
                ₹2,650<span style={{ fontSize: 20, color: '#A7F3D0' }}>/mo</span>
              </div>
            </div>
            <div style={{ backgroundColor: '#10B981', color: '#042F2E', padding: '12px 22px', borderRadius: 999, fontWeight: 900, fontSize: 16 }}>
              0% EMI ✅
            </div>
          </div>
        </div>

        {/* Content Box */}
        <div
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 28,
            padding: 26,
            backdropFilter: 'blur(16px)',
          }}
        >
          <h2 style={{ fontSize: 42, fontWeight: 900, color: '#FFFFFF', margin: '0 0 12px 0', lineHeight: 1.15 }}>
            Turn 80% Cost Hesitations into <span style={{ color: '#34D399' }}>Instant "YES"</span> 💳
          </h2>
          <p style={{ fontSize: 20, color: '#CBD5E1', fontWeight: 600, margin: 0, lineHeight: 1.4 }}>
            Clinaza lets patients split payments into easy monthly EMIs while your clinic gets paid upfront!
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════
// SCENE 3: SECRET #2 - ANIMATED WHATSAPP CHAT SIMULATOR
// ══════════════════════════════════════════════════════════════════
const Slide3WhatsAppSim: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const chatSpring1 = spring({ frame: frame - 10, fps, config: { damping: 12 } });
  const chatSpring2 = spring({ frame: frame - 45, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill>
      <AmbientMotionBackground primaryColor="#22C55E" secondaryColor="#0D9488" frame={frame} />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          padding: INSTA_SAFE_PADDING,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 24,
          zIndex: 10,
        }}
      >
        {/* Secret Badge */}
        <div>
          <span
            style={{
              padding: '10px 22px',
              borderRadius: 999,
              backgroundColor: '#22C55E',
              color: '#FFFFFF',
              fontSize: 15,
              fontWeight: 900,
              letterSpacing: 1.5,
              boxShadow: '0 6px 25px rgba(34, 197, 94, 0.4)',
            }}
          >
            SECRET #2: WHATSAPP AUTO-RECALL
          </span>
        </div>

        {/* Real Animated WhatsApp Chat Mockup */}
        <div
          style={{
            backgroundColor: '#0B141A',
            border: '2px solid rgba(34, 197, 94, 0.3)',
            borderRadius: 32,
            padding: '26px 24px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {/* WhatsApp Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, borderBottom: '1px solid #1F2C34', paddingBottom: 14 }}>
            <div style={{ width: 46, height: 46, borderRadius: '50%', backgroundColor: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
              🦷
            </div>
            <div>
              <div style={{ fontSize: 19, fontWeight: 800, color: '#E9EDEF' }}>Smile Craft Dental Clinic</div>
              <div style={{ fontSize: 13, color: '#25D366', fontWeight: 600 }}>● Online (Automated Bot)</div>
            </div>
          </div>

          {/* Outgoing Message: Clinic Automated Recall */}
          <div
            style={{
              alignSelf: 'flex-start',
              backgroundColor: '#202C33',
              color: '#E9EDEF',
              padding: '16px 20px',
              borderRadius: '20px 20px 20px 4px',
              maxWidth: '88%',
              transform: `scale(${chatSpring1}) translateY(${interpolate(chatSpring1, [0, 1], [30, 0])}px)`,
              opacity: interpolate(frame, [8, 18], [0, 1], { extrapolateRight: 'clamp' }),
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.4 }}>
              Hi Rahul! 👋 It's been 6 months since your cleaning. We reserved a slot for your free dental checkup this Saturday at 4 PM!
            </div>
            <div style={{ fontSize: 12, color: '#8696A0', textAlign: 'right', marginTop: 6 }}>10:14 AM</div>
          </div>

          {/* Incoming Message: Patient Booking Confirmation */}
          <div
            style={{
              alignSelf: 'flex-end',
              backgroundColor: '#005C4B',
              color: '#E9EDEF',
              padding: '16px 20px',
              borderRadius: '20px 20px 4px 20px',
              maxWidth: '84%',
              transform: `scale(${chatSpring2}) translateY(${interpolate(chatSpring2, [0, 1], [30, 0])}px)`,
              opacity: interpolate(frame, [40, 52], [0, 1], { extrapolateRight: 'clamp' }),
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.4 }}>
              Yes please! Confirm Saturday 4 PM. Thanks for reminding! 🙏
            </div>
            <div style={{ fontSize: 12, color: '#8696A0', textAlign: 'right', marginTop: 6 }}>
              10:16 AM <span style={{ color: '#53BDEB' }}>✓✓</span>
            </div>
          </div>
        </div>

        {/* Content Box */}
        <div
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 28,
            padding: 26,
            backdropFilter: 'blur(16px)',
          }}
        >
          <h2 style={{ fontSize: 42, fontWeight: 900, color: '#FFFFFF', margin: '0 0 12px 0', lineHeight: 1.15 }}>
            Recover <span style={{ color: '#4ADE80' }}>₹2-5 Lakhs</span> in Dormant Patients 💬
          </h2>
          <p style={{ fontSize: 20, color: '#CBD5E1', fontWeight: 600, margin: 0, lineHeight: 1.4 }}>
            Automate 6-month hygiene recall sequences on WhatsApp and fill your empty chair slots on autopilot!
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════
// SCENE 4: SECRET #3 - GOOGLE AI OVERVIEW MOCKUP
// ══════════════════════════════════════════════════════════════════
const Slide4GoogleAiMockup: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const cardSpring = spring({ frame, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill>
      <AmbientMotionBackground primaryColor="#2563EB" secondaryColor="#9333EA" frame={frame} />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          padding: INSTA_SAFE_PADDING,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 24,
          zIndex: 10,
        }}
      >
        {/* Secret Badge */}
        <div>
          <span
            style={{
              padding: '10px 22px',
              borderRadius: 999,
              backgroundColor: '#2563EB',
              color: '#FFFFFF',
              fontSize: 15,
              fontWeight: 900,
              letterSpacing: 1.5,
              boxShadow: '0 6px 25px rgba(37, 99, 235, 0.4)',
            }}
          >
            SECRET #3: GOOGLE AI SEARCH
          </span>
        </div>

        {/* Simulated Google AI Overview Result Box */}
        <div
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            border: '2px solid rgba(59, 130, 246, 0.5)',
            borderRadius: 32,
            padding: 30,
            boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
            transform: `scale(${cardSpring})`,
          }}
        >
          {/* Search Query Bar */}
          <div
            style={{
              backgroundColor: 'rgba(255,255,255,0.08)',
              borderRadius: 18,
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 20,
            }}
          >
            <span style={{ fontSize: 20 }}>🔍</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#93C5FD' }}>
              "Cost of dental implants with EMI in Delhi"
            </span>
          </div>

          {/* AI Overview Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span style={{ fontSize: 22 }}>✨</span>
            <span style={{ fontSize: 16, fontWeight: 900, color: '#60A5FA', letterSpacing: 1 }}>
              AI OVERVIEW (GOOGLE SEARCH)
            </span>
          </div>

          {/* AI Top Result Listing */}
          <div
            style={{
              backgroundColor: 'rgba(37, 99, 235, 0.18)',
              border: '1.5px solid #3B82F6',
              borderRadius: 22,
              padding: '18px 22px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <strong style={{ fontSize: 19, color: '#FFFFFF' }}>#1 Clinaza Partner Clinic</strong>
              <span style={{ fontSize: 15, color: '#FACC15', fontWeight: 900 }}>⭐ 4.9 (420+ Reviews)</span>
            </div>
            <p style={{ fontSize: 15, color: '#BFDBFE', margin: 0, lineHeight: 1.45 }}>
              Top recommended practice. Transparent pricing, zero-cost EMI from ₹2,500/mo &amp; same-day digital consults.
            </p>
          </div>
        </div>

        {/* Content Box */}
        <div
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 28,
            padding: 26,
            backdropFilter: 'blur(16px)',
          }}
        >
          <h2 style={{ fontSize: 42, fontWeight: 900, color: '#FFFFFF', margin: '0 0 12px 0', lineHeight: 1.15 }}>
            Dominate <span style={{ color: '#60A5FA' }}>Google AI Overviews</span> 🤖
          </h2>
          <p style={{ fontSize: 20, color: '#CBD5E1', fontWeight: 600, margin: 0, lineHeight: 1.4 }}>
            Publish procedure pricing guides with medical schema to rank above paid competitor Google ads for free!
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════
// SCENE 5: SECRET #4 - CHATGPT & PERPLEXITY GEO CARD
// ══════════════════════════════════════════════════════════════════
const Slide5ChatGptGeo: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const cardSpring = spring({ frame, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill>
      <AmbientMotionBackground primaryColor="#9333EA" secondaryColor="#EC4899" frame={frame} />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          padding: INSTA_SAFE_PADDING,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 24,
          zIndex: 10,
        }}
      >
        {/* Secret Badge */}
        <div>
          <span
            style={{
              padding: '10px 22px',
              borderRadius: 999,
              backgroundColor: '#9333EA',
              color: '#FFFFFF',
              fontSize: 15,
              fontWeight: 900,
              letterSpacing: 1.5,
              boxShadow: '0 6px 25px rgba(147, 51, 234, 0.4)',
            }}
          >
            SECRET #4: GEO (AI SEARCH SEO)
          </span>
        </div>

        {/* Simulated ChatGPT / Perplexity Recommendation Mockup */}
        <div
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            border: '2px solid rgba(168, 85, 247, 0.5)',
            borderRadius: 32,
            padding: 30,
            boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
            transform: `scale(${cardSpring})`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: '#10A37F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
              🤖
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF' }}>ChatGPT &amp; Perplexity AI</div>
              <div style={{ fontSize: 13, color: '#C084FC', fontWeight: 700 }}>Prompt: "Find best dental surgeon near me"</div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: 'rgba(255,255,255,0.06)',
              borderRadius: 22,
              padding: '18px 20px',
              fontSize: 16,
              color: '#F3E8FF',
              lineHeight: 1.5,
              borderLeft: '4px solid #A855F7',
            }}
          >
            "Based on verified patient outcomes, digital equipment, and point-of-care EMI options, <strong>Dr. Sharma’s Clinic</strong> is ranked #1 in your district."
          </div>
        </div>

        {/* Content Box */}
        <div
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 28,
            padding: 26,
            backdropFilter: 'blur(16px)',
          }}
        >
          <h2 style={{ fontSize: 42, fontWeight: 900, color: '#FFFFFF', margin: '0 0 12px 0', lineHeight: 1.15 }}>
            Get Recommended by <span style={{ color: '#C084FC' }}>AI Search Engines</span> 🧠
          </h2>
          <p style={{ fontSize: 20, color: '#CBD5E1', fontWeight: 600, margin: 0, lineHeight: 1.4 }}>
            Generative Engine Optimization (GEO) ensures your clinic is the first name patients hear from AI!
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════
// SCENE 6: HIGH CONVERTING 3D PERSPECTIVE CTA
// ══════════════════════════════════════════════════════════════════
const Slide6FinalCTA: React.FC<{ frame: number; fps: number; websiteUrl: string }> = ({
  frame,
  fps,
  websiteUrl,
}) => {
  const logoScale = spring({ frame, fps, config: { damping: 10 } });
  const pulseButton = Math.sin(frame / 7) * 0.04 + 1;

  return (
    <AbsoluteFill
      style={{
        background: 'radial-gradient(circle at center, #0F172A 0%, #020617 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: INSTA_SAFE_PADDING,
        textAlign: 'center',
      }}
    >
      <AmbientMotionBackground primaryColor="#0867E8" secondaryColor="#38BDF8" frame={frame} />

      <div style={{ transform: `scale(${logoScale})`, zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        {/* Clinaza Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 30px',
            borderRadius: 999,
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1.5px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 10px 30px rgba(8, 103, 232, 0.4)',
          }}
        >
          <span style={{ fontSize: 28, fontWeight: 900, color: '#FFFFFF', letterSpacing: 2 }}>
            CLIN<span style={{ color: '#0867E8' }}>AZA</span>
          </span>
        </div>

        <div
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            border: '1.5px solid rgba(8, 103, 232, 0.4)',
            borderRadius: 32,
            padding: '36px 30px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <h2
            style={{
              fontSize: 44,
              fontWeight: 900,
              color: '#FFFFFF',
              lineHeight: 1.18,
              margin: '0 0 16px 0',
            }}
          >
            Stop Losing Patients. <br />
            <span style={{ color: '#38BDF8' }}>3X Your Dental Revenue.</span> 🚀
          </h2>

          <p style={{ fontSize: 20, color: '#94A3B8', fontWeight: 600, margin: '0 0 28px 0', maxWidth: 580, lineHeight: 1.4 }}>
            Patient EMI Financing + Automated WhatsApp Recalls + AI Search Optimization in One Platform.
          </p>

          {/* Pulsing CTA Action Button */}
          <div
            style={{
              transform: `scale(${pulseButton})`,
              display: 'inline-block',
              padding: '20px 48px',
              borderRadius: 24,
              backgroundColor: '#0867E8',
              color: '#FFFFFF',
              fontSize: 22,
              fontWeight: 900,
              boxShadow: '0 14px 45px rgba(8, 103, 232, 0.6)',
              letterSpacing: 1,
              marginBottom: 20,
            }}
          >
            Partner With Clinaza Free →
          </div>

          <div style={{ fontSize: 18, color: '#10B981', fontWeight: 900, letterSpacing: 1.5 }}>
            ⚡ ZERO SETUP COST · 100% FREE FOR CLINICS · {websiteUrl}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
