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

// ── INSTAGRAM REELS OFFICIAL SAFE ZONE (1080 x 1920) ──
// Top 220px: Clears Reels header, search bar, and back icon
// Bottom 360px: Clears doctor handle, caption, sound title, and audio disc
// Left 70px: Balanced left safe margin
// Right 140px: Clears right-side action column (heart, comment, share, bookmark)
// Active safe canvas: Width = 870px, Height = 1340px (from Y = 220px to Y = 1560px)
const INSTA_SAFE_CONTAINER: React.CSSProperties = {
  position: 'absolute',
  top: 220,
  bottom: 360,
  left: 70,
  right: 140,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  zIndex: 10,
};

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
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 2 }}>
      {/* Subtle grid pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.08,
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
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
          opacity: 0.4,
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
          opacity: 0.32,
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
  fontSize?: number;
}> = ({ words, frame, fps, delay = 0, fontSize = 44 }) => {
  return (
    <h1
      style={{
        fontSize,
        fontWeight: 900,
        lineHeight: 1.15,
        margin: '0 0 4px 0',
        color: '#FFFFFF',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px 12px',
        textShadow: '0 4px 20px rgba(0,0,0,0.9)',
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
              transform: `scale(${wordSpring}) translateY(${interpolate(wordSpring, [0, 1], [12, 0])}px)`,
              opacity: wordOpacity,
              color: w.highlight ? (w.color || '#FACC15') : '#FFFFFF',
              background: w.highlight ? 'rgba(250, 204, 21, 0.15)' : 'transparent',
              padding: w.highlight ? '2px 10px' : '0',
              borderRadius: 8,
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
// SCENE 1: VIRAL HOOK (DENTIST + TIGHT VERTICAL SAFE GRID)
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
      {/* Cinematic Background: Real Dentist in Clinic */}
      <Img
        src={staticFile('assets/doctor-consult-real.png')}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${doctorScale})`,
          filter: 'brightness(0.35) contrast(1.15)',
        }}
      />

      <AmbientMotionBackground primaryColor="#DC2626" secondaryColor="#4F46E5" frame={frame} />

      {/* Full Safe Zone Container (Top 220px to Bottom 1560px) */}
      <div style={INSTA_SAFE_CONTAINER}>
        {/* TOP SECTION: Badges + Kinetic Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ transform: `scale(${badgeSpring})`, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 18px',
                borderRadius: 999,
                backgroundColor: 'rgba(15, 23, 42, 0.92)',
                border: '1.5px solid rgba(255, 255, 255, 0.25)',
              }}
            >
              <span style={{ fontSize: 16 }}>👨‍⚕️</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#F8FAFC', letterSpacing: 0.5 }}>
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
                fontSize: 13,
                fontWeight: 900,
                letterSpacing: 1.2,
                boxShadow: '0 0 25px rgba(239, 68, 68, 0.4)',
              }}
            >
              <span>🚨</span> CLINIC REVENUE CRISIS
            </div>
          </div>

          <KineticTitle words={hookWords} frame={frame} fps={fps} delay={5} fontSize={44} />
        </div>

        {/* CENTER SECTION: Large Conversion & Revenue Diagnostic Dashboard */}
        <div
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.94)',
            border: '2px solid rgba(239, 68, 68, 0.45)',
            borderRadius: 30,
            padding: '30px 28px',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
            display: 'flex',
            flexDirection: 'column',
            gap: 22,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 900, color: '#94A3B8', letterSpacing: 1 }}>
                DIAGNOSTIC AUDIT
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#FFFFFF' }}>Case Acceptance Rate</div>
            </div>
            <span
              style={{
                fontSize: 42,
                fontWeight: 900,
                color: '#EF4444',
                transform: `scale(${pulseScale})`,
                textShadow: '0 0 20px rgba(239, 68, 68, 0.6)',
              }}
            >
              {Math.round(meterDrop)}%
            </span>
          </div>

          {/* Animated Plummeting Progress Bar */}
          <div>
            <div
              style={{
                height: 22,
                width: '100%',
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: 999,
                overflow: 'hidden',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${meterDrop}%`,
                  background: 'linear-gradient(90deg, #EF4444, #F87171)',
                  borderRadius: 999,
                  boxShadow: '0 0 20px rgba(239, 68, 68, 0.9)',
                }}
              />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 10,
                fontSize: 14,
                fontWeight: 800,
              }}
            >
              <span style={{ color: '#EF4444' }}>📉 Average Clinic: 30%</span>
              <span style={{ color: '#10B981' }}>🏆 Top Practice: 85%+</span>
            </div>
          </div>

          {/* Revenue Breakdown Stat Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 14,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 20,
              padding: '18px 20px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div>
              <div style={{ fontSize: 13, color: '#94A3B8', fontWeight: 700 }}>UNACCEPTED CASES</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#F87171', marginTop: 4 }}>
                ₹4,80,000<span style={{ fontSize: 14, color: '#94A3B8' }}>/mo</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: '#94A3B8', fontWeight: 700 }}>#1 PATIENT REASON</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#FCD34D', marginTop: 4 }}>
                Upfront Cost (74%)
              </div>
            </div>
          </div>

          {/* Crisis Callout Box */}
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: 16,
              padding: '12px 16px',
              fontSize: 14,
              color: '#FECACA',
              fontWeight: 700,
              lineHeight: 1.4,
            }}
          >
            ⚠️ 7 out of 10 walk-in patients leave without starting high-ticket treatment due to upfront payment shock.
          </div>
        </div>

        {/* BOTTOM SECTION: Key Insight Card (Sits safely above IG caption zone) */}
        <div
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.88)',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 24,
            padding: '22px 24px',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 900, color: '#FACC15', letterSpacing: 1, marginBottom: 6 }}>
            💡 THE BREAKTHROUGH PLAYBOOK
          </div>
          <p style={{ fontSize: 19, color: '#E2E8F0', fontWeight: 600, lineHeight: 1.4, margin: 0 }}>
            It’s NOT your clinical skills. Here are the 4 secrets top clinics use to 3X patient acceptance! ⬇️
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
  const slashProgress = interpolate(frame, [20, 42], [0, 100], { extrapolateRight: 'clamp' });
  const emiReveal = spring({ frame: frame - 35, fps, config: { damping: 10 } });
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
          filter: 'brightness(0.32) contrast(1.15)',
        }}
      />

      <AmbientMotionBackground primaryColor="#059669" secondaryColor="#0284C7" frame={frame} />

      {/* Full Safe Zone Container */}
      <div style={INSTA_SAFE_CONTAINER}>
        {/* TOP SECTION: Secret Badge + Kinetic Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <span
              style={{
                padding: '9px 20px',
                borderRadius: 999,
                backgroundColor: '#059669',
                color: '#FFFFFF',
                fontSize: 14,
                fontWeight: 900,
                letterSpacing: 1.5,
                boxShadow: '0 6px 25px rgba(5, 150, 105, 0.45)',
                display: 'inline-block',
              }}
            >
              SECRET #1: PATIENT FINANCING
            </span>
          </div>

          <h2
            style={{
              fontSize: 42,
              fontWeight: 900,
              color: '#FFFFFF',
              margin: 0,
              lineHeight: 1.15,
              textShadow: '0 4px 20px rgba(0,0,0,0.9)',
            }}
          >
            Turn 80% Cost Hesitations Into <span style={{ color: '#34D399' }}>Instant "YES"</span> 💳
          </h2>
        </div>

        {/* CENTER SECTION: Interactive Payment Transformation Card */}
        <div
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.94)',
            border: '2px solid rgba(16, 185, 129, 0.45)',
            borderRadius: 30,
            padding: '30px 28px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
            transform: `scale(${cardSpring})`,
            backdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 24 }}>🦷</span>
              <span style={{ fontSize: 17, fontWeight: 800, color: '#CBD5E1' }}>
                IMPLANTS &amp; INVISIBLE ALIGNERS
              </span>
            </div>
            <span style={{ fontSize: 13, fontWeight: 900, color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '4px 12px', borderRadius: 999 }}>
              HIGH TICKET
            </span>
          </div>

          {/* Slashed Upfront Price */}
          <div style={{ position: 'relative', display: 'inline-block', margin: '4px 0' }}>
            <div style={{ fontSize: 40, fontWeight: 900, color: '#64748B' }}>
              ₹65,000 <span style={{ fontSize: 20 }}>Upfront Barrier</span>
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
                transform: 'rotate(-5deg)',
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
              borderRadius: 22,
              padding: '22px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transform: `scale(${emiReveal})`,
              boxShadow: '0 10px 40px rgba(16, 185, 129, 0.45)',
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 900, color: '#6EE7B7', letterSpacing: 1 }}>
                PATIENT PAYS JUST
              </div>
              <div style={{ fontSize: 44, fontWeight: 900, color: '#FFFFFF', marginTop: 2 }}>
                ₹2,650<span style={{ fontSize: 18, color: '#A7F3D0' }}>/mo</span>
              </div>
            </div>
            <div style={{ backgroundColor: '#10B981', color: '#042F2E', padding: '12px 22px', borderRadius: 999, fontWeight: 900, fontSize: 16 }}>
              0% EMI ✅
            </div>
          </div>

          {/* Doctor Payout & Acceptance Ribbon */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 16,
              padding: '14px 18px',
              fontSize: 14,
              fontWeight: 800,
            }}
          >
            <span style={{ color: '#38BDF8' }}>🏦 Clinic Paid Full in 24 Hrs</span>
            <span style={{ color: '#34D399' }}>📈 Acceptance: 32% ➔ 88%</span>
          </div>

          {/* 3 Key Benefits */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 13, color: '#94A3B8', fontWeight: 700 }}>
            <div>⚡ 2-Min Digital eKYC</div>
            <div>📄 100% Paperless Process</div>
          </div>
        </div>

        {/* BOTTOM SECTION: Key Takeaway Box */}
        <div
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.88)',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 24,
            padding: '22px 24px',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 900, color: '#34D399', letterSpacing: 1, marginBottom: 6 }}>
            ⚡ 55+ RBI-REGULATED LENDERS
          </div>
          <p style={{ fontSize: 19, color: '#E2E8F0', fontWeight: 600, margin: 0, lineHeight: 1.4 }}>
            Zero paperwork, instant 2-minute digital approval right in your dental operatory.
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
  const chatSpring1 = spring({ frame: frame - 8, fps, config: { damping: 12 } });
  const chatSpring2 = spring({ frame: frame - 38, fps, config: { damping: 12 } });
  const chatSpring3 = spring({ frame: frame - 65, fps, config: { damping: 12 } });
  const bgScale = interpolate(frame, [0, 120], [1.0, 1.06]);

  return (
    <AbsoluteFill>
      {/* Background Dentist Consulting Room */}
      <Img
        src={staticFile('assets/reels/whatsapp_reactivation.jpg')}
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

      <AmbientMotionBackground primaryColor="#22C55E" secondaryColor="#0D9488" frame={frame} />

      {/* Full Safe Zone Container */}
      <div style={INSTA_SAFE_CONTAINER}>
        {/* TOP SECTION: Secret Badge + Kinetic Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <span
              style={{
                padding: '9px 20px',
                borderRadius: 999,
                backgroundColor: '#22C55E',
                color: '#FFFFFF',
                fontSize: 14,
                fontWeight: 900,
                letterSpacing: 1.5,
                boxShadow: '0 6px 25px rgba(34, 197, 94, 0.45)',
                display: 'inline-block',
              }}
            >
              SECRET #2: SMART AUTO-RECALL
            </span>
          </div>

          <h2
            style={{
              fontSize: 42,
              fontWeight: 900,
              color: '#FFFFFF',
              margin: 0,
              lineHeight: 1.15,
              textShadow: '0 4px 20px rgba(0,0,0,0.9)',
            }}
          >
            Recover <span style={{ color: '#4ADE80' }}>₹2-5 Lakhs</span> in Dormant Patients 💬
          </h2>
        </div>

        {/* CENTER SECTION: Real Animated WhatsApp Chat Mockup */}
        <div
          style={{
            backgroundColor: '#0B141A',
            border: '2px solid rgba(34, 197, 94, 0.4)',
            borderRadius: 30,
            padding: '26px 24px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {/* WhatsApp Clinic Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #1F2C34', paddingBottom: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
              🦷
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#E9EDEF' }}>Smile Craft Dental Clinic</div>
              <div style={{ fontSize: 13, color: '#25D366', fontWeight: 600 }}>● 24/7 Smart Recall AI</div>
            </div>
            <span style={{ fontSize: 12, backgroundColor: '#1F2C34', color: '#94A3B8', padding: '5px 12px', borderRadius: 999, fontWeight: 700 }}>
              Automated
            </span>
          </div>

          {/* Outgoing Message: Automated Recall */}
          <div
            style={{
              alignSelf: 'flex-start',
              backgroundColor: '#202C33',
              color: '#E9EDEF',
              padding: '14px 18px',
              borderRadius: '18px 18px 18px 4px',
              maxWidth: '92%',
              transform: `scale(${chatSpring1}) translateY(${interpolate(chatSpring1, [0, 1], [25, 0])}px)`,
              opacity: interpolate(frame, [6, 16], [0, 1], { extrapolateRight: 'clamp' }),
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.4 }}>
              Hi Priya! 👋 It's been 6 months since your cleaning. We reserved a priority slot for your checkup this Saturday at 11:30 AM!
            </div>
            <div style={{ fontSize: 11, color: '#8696A0', textAlign: 'right', marginTop: 4 }}>10:14 AM</div>
          </div>

          {/* Incoming Message: Patient Booking Confirmation */}
          <div
            style={{
              alignSelf: 'flex-end',
              backgroundColor: '#005C4B',
              color: '#E9EDEF',
              padding: '14px 18px',
              borderRadius: '18px 18px 4px 18px',
              maxWidth: '88%',
              transform: `scale(${chatSpring2}) translateY(${interpolate(chatSpring2, [0, 1], [25, 0])}px)`,
              opacity: interpolate(frame, [36, 46], [0, 1], { extrapolateRight: 'clamp' }),
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.4 }}>
              Yes please! Confirm Saturday 11:30 AM. Thanks for reminding me! 🙏
            </div>
            <div style={{ fontSize: 11, color: '#8696A0', textAlign: 'right', marginTop: 4 }}>
              10:16 AM <span style={{ color: '#53BDEB' }}>✓✓</span>
            </div>
          </div>

          {/* Outgoing Message: Confirmation Slip */}
          <div
            style={{
              alignSelf: 'flex-start',
              backgroundColor: '#202C33',
              color: '#E9EDEF',
              padding: '12px 16px',
              borderRadius: '18px 18px 18px 4px',
              maxWidth: '90%',
              transform: `scale(${chatSpring3}) translateY(${interpolate(chatSpring3, [0, 1], [25, 0])}px)`,
              opacity: interpolate(frame, [62, 72], [0, 1], { extrapolateRight: 'clamp' }),
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, color: '#A7F3D0' }}>
              ✅ Confirmed! Dr. Aryan is notified. See you Saturday at 11:30 AM.
            </div>
          </div>

          {/* Bottom Chat Stat Ribbon */}
          <div
            style={{
              backgroundColor: 'rgba(34, 197, 94, 0.12)',
              border: '1px solid rgba(34, 197, 94, 0.25)',
              borderRadius: 14,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 14,
              fontWeight: 800,
              color: '#4ADE80',
            }}
          >
            <span>⚡ 38 Patients Reactivated This Month</span>
            <span>+₹3.4L Added</span>
          </div>
        </div>

        {/* BOTTOM SECTION: Key Takeaway Box */}
        <div
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.88)',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 24,
            padding: '22px 24px',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 900, color: '#4ADE80', letterSpacing: 1, marginBottom: 6 }}>
            🤖 100% HANDS-FREE AUTOMATION
          </div>
          <p style={{ fontSize: 19, color: '#CBD5E1', fontWeight: 600, margin: 0, lineHeight: 1.4 }}>
            Stop letting dormant records gather dust. Fill empty chair slots automatically every week!
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
  const bgScale = interpolate(frame, [0, 120], [1.0, 1.06]);

  return (
    <AbsoluteFill>
      {/* Background Modern Operatory */}
      <Img
        src={staticFile('assets/clinic-hero-real.png')}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${bgScale})`,
          filter: 'brightness(0.32) contrast(1.15)',
        }}
      />

      <AmbientMotionBackground primaryColor="#2563EB" secondaryColor="#9333EA" frame={frame} />

      {/* Full Safe Zone Container */}
      <div style={INSTA_SAFE_CONTAINER}>
        {/* TOP SECTION: Secret Badge + Kinetic Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <span
              style={{
                padding: '9px 20px',
                borderRadius: 999,
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                fontSize: 14,
                fontWeight: 900,
                letterSpacing: 1.5,
                boxShadow: '0 6px 25px rgba(37, 99, 235, 0.45)',
                display: 'inline-block',
              }}
            >
              SECRET #3: GOOGLE AI DOMINATION
            </span>
          </div>

          <h2
            style={{
              fontSize: 42,
              fontWeight: 900,
              color: '#FFFFFF',
              margin: 0,
              lineHeight: 1.15,
              textShadow: '0 4px 20px rgba(0,0,0,0.9)',
            }}
          >
            Dominate <span style={{ color: '#60A5FA' }}>Google AI Overviews</span> 🤖
          </h2>
        </div>

        {/* CENTER SECTION: Simulated Google AI Overview Result Box */}
        <div
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            border: '2px solid rgba(59, 130, 246, 0.5)',
            borderRadius: 30,
            padding: '26px 24px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
            transform: `scale(${cardSpring})`,
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          {/* Google Search Query Bar */}
          <div
            style={{
              backgroundColor: 'rgba(255,255,255,0.08)',
              borderRadius: 16,
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <span style={{ fontSize: 20 }}>🔍</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#93C5FD' }}>
              "Cost of dental implants with EMI near me"
            </span>
          </div>

          {/* AI Overview Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
              borderRadius: 20,
              padding: '18px 20px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <strong style={{ fontSize: 18, color: '#FFFFFF' }}>#1 Clinaza Partner Clinic</strong>
              <span style={{ fontSize: 15, color: '#FACC15', fontWeight: 900 }}>⭐ 4.9 (420+ Reviews)</span>
            </div>
            <p style={{ fontSize: 15, color: '#BFDBFE', margin: 0, lineHeight: 1.45 }}>
              Top recommended practice. Transparent pricing, zero-cost EMI from ₹2,500/mo &amp; same-day digital consults.
            </p>
          </div>

          {/* Advantage Badge */}
          <div
            style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: 14,
              padding: '12px 16px',
              fontSize: 14,
              fontWeight: 800,
              color: '#38BDF8',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>🚀 Ranks Above Paid Competitor Ads</span>
            <span>Zero Ad Spend</span>
          </div>

          <div style={{ fontSize: 13, color: '#94A3B8', fontWeight: 600 }}>
            📌 84% of high-intent patients click the AI Overview box before scrolling to map results.
          </div>
        </div>

        {/* BOTTOM SECTION: Key Takeaway Box */}
        <div
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.88)',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 24,
            padding: '22px 24px',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 900, color: '#60A5FA', letterSpacing: 1, marginBottom: 6 }}>
            📈 ORGANIC PATIENT ACQUISITION
          </div>
          <p style={{ fontSize: 19, color: '#CBD5E1', fontWeight: 600, margin: 0, lineHeight: 1.4 }}>
            Structured medical schema positions your practice as the trusted authority on Google AI!
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
  const bgScale = interpolate(frame, [0, 120], [1.0, 1.06]);

  return (
    <AbsoluteFill>
      {/* Background Operatory Interior */}
      <Img
        src={staticFile('assets/yourdentist/interior_operatory.jpg')}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${bgScale})`,
          filter: 'brightness(0.32) contrast(1.15)',
        }}
      />

      <AmbientMotionBackground primaryColor="#9333EA" secondaryColor="#EC4899" frame={frame} />

      {/* Full Safe Zone Container */}
      <div style={INSTA_SAFE_CONTAINER}>
        {/* TOP SECTION: Secret Badge + Kinetic Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <span
              style={{
                padding: '9px 20px',
                borderRadius: 999,
                backgroundColor: '#9333EA',
                color: '#FFFFFF',
                fontSize: 14,
                fontWeight: 900,
                letterSpacing: 1.5,
                boxShadow: '0 6px 25px rgba(147, 51, 234, 0.45)',
                display: 'inline-block',
              }}
            >
              SECRET #4: GEO (AI SEARCH SEO)
            </span>
          </div>

          <h2
            style={{
              fontSize: 42,
              fontWeight: 900,
              color: '#FFFFFF',
              margin: 0,
              lineHeight: 1.15,
              textShadow: '0 4px 20px rgba(0,0,0,0.9)',
            }}
          >
            Get Recommended by <span style={{ color: '#C084FC' }}>AI Search Engines</span> 🧠
          </h2>
        </div>

        {/* CENTER SECTION: Simulated ChatGPT / Perplexity Recommendation Mockup */}
        <div
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            border: '2px solid rgba(168, 85, 247, 0.5)',
            borderRadius: 30,
            padding: '26px 24px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
            transform: `scale(${cardSpring})`,
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
              borderRadius: 18,
              padding: '18px 20px',
              fontSize: 16,
              color: '#F3E8FF',
              lineHeight: 1.45,
              borderLeft: '4px solid #A855F7',
            }}
          >
            "Based on verified patient outcomes, digital equipment, and point-of-care EMI options, <strong>Dr. Sharma’s Clinic</strong> is ranked #1 in your district."
          </div>

          {/* Metric Badge */}
          <div
            style={{
              backgroundColor: 'rgba(147, 51, 234, 0.15)',
              borderRadius: 14,
              padding: '12px 16px',
              fontSize: 14,
              fontWeight: 800,
              color: '#E9D5FF',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>🏆 #1 AI Cited Practice</span>
            <span>3.8X More High-Ticket Inquiries</span>
          </div>

          <div style={{ fontSize: 13, color: '#94A3B8', fontWeight: 600 }}>
            ⚡ Patients searching via voice assistants and AI bots receive direct links to your booking calendar.
          </div>
        </div>

        {/* BOTTOM SECTION: Key Takeaway Box */}
        <div
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.88)',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 24,
            padding: '22px 24px',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 900, color: '#C084FC', letterSpacing: 1, marginBottom: 6 }}>
            🌐 THE FUTURE OF DENTAL DISCOVERY
          </div>
          <p style={{ fontSize: 19, color: '#CBD5E1', fontWeight: 600, margin: 0, lineHeight: 1.4 }}>
            Generative Engine Optimization (GEO) ensures your clinic is the first name patients hear from AI!
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════
// SCENE 6: HIGH CONVERTING CTA CARD (PERFECTLY FRAMED IN SAFE GRID)
// ══════════════════════════════════════════════════════════════════
const Slide6FinalCTA: React.FC<{ frame: number; fps: number; websiteUrl: string }> = ({
  frame,
  fps,
  websiteUrl,
}) => {
  const logoScale = spring({ frame, fps, config: { damping: 10 } });
  const pulseButton = Math.sin(frame / 7) * 0.04 + 1;
  const bgScale = interpolate(frame, [0, 120], [1.0, 1.06]);

  return (
    <AbsoluteFill>
      {/* Background Modern Dental Clinic */}
      <Img
        src={staticFile('assets/reels/clinic_growth_hero.jpg')}
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

      <AmbientMotionBackground primaryColor="#0867E8" secondaryColor="#38BDF8" frame={frame} />

      {/* Full Safe Zone Container */}
      <div style={INSTA_SAFE_CONTAINER}>
        {/* TOP SECTION: Clinaza Brand Badge */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 30px',
              borderRadius: 999,
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1.5px solid rgba(255, 255, 255, 0.25)',
              boxShadow: '0 10px 30px rgba(8, 103, 232, 0.4)',
            }}
          >
            <span style={{ fontSize: 26, fontWeight: 900, color: '#FFFFFF', letterSpacing: 2 }}>
              CLIN<span style={{ color: '#0867E8' }}>AZA</span>
            </span>
          </div>
        </div>

        {/* CENTER SECTION: Master CTA Card */}
        <div
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.94)',
            border: '2px solid rgba(8, 103, 232, 0.45)',
            borderRadius: 32,
            padding: '36px 30px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
            transform: `scale(${logoScale})`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 20,
          }}
        >
          <h2
            style={{
              fontSize: 42,
              fontWeight: 900,
              color: '#FFFFFF',
              lineHeight: 1.18,
              margin: 0,
            }}
          >
            Stop Losing Patients. <br />
            <span style={{ color: '#38BDF8' }}>3X Your Dental Revenue.</span> 🚀
          </h2>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              width: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 20,
              padding: '18px 20px',
              textAlign: 'left',
            }}
          >
            <div style={{ fontSize: 16, color: '#E2E8F0', fontWeight: 700 }}>
              ✅ 0% Patient EMI Financing (55+ Lenders)
            </div>
            <div style={{ fontSize: 16, color: '#E2E8F0', fontWeight: 700 }}>
              ✅ Automated WhatsApp Recall Campaigns
            </div>
            <div style={{ fontSize: 16, color: '#E2E8F0', fontWeight: 700 }}>
              ✅ #1 Google AI &amp; ChatGPT GEO Visibility
            </div>
          </div>

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
              boxShadow: '0 12px 40px rgba(8, 103, 232, 0.65)',
              letterSpacing: 0.5,
              marginTop: 6,
            }}
          >
            Partner With Clinaza Free →
          </div>
        </div>

        {/* BOTTOM SECTION: Zero Risk Guarantee Ribbon */}
        <div
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.88)',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 20,
            padding: '16px 20px',
            textAlign: 'center',
            fontSize: 16,
            color: '#10B981',
            fontWeight: 900,
            letterSpacing: 1,
            backdropFilter: 'blur(16px)',
          }}
        >
          ⚡ ZERO SETUP COST · 100% FREE FOR CLINICS · {websiteUrl}
        </div>
      </div>
    </AbsoluteFill>
  );
};
