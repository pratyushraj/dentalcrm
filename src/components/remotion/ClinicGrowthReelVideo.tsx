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
}> = ({ words, frame, fps, delay = 0, fontSize = 52 }) => {
  return (
    <h1
      style={{
        fontSize,
        fontWeight: 900,
        lineHeight: 1.12,
        margin: '0 0 4px 0',
        color: '#FFFFFF',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px 14px',
        textShadow: '0 4px 22px rgba(0,0,0,0.95)',
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
              transform: `scale(${wordSpring}) translateY(${interpolate(wordSpring, [0, 1], [14, 0])}px)`,
              opacity: wordOpacity,
              color: w.highlight ? (w.color || '#FACC15') : '#FFFFFF',
              background: w.highlight ? 'rgba(250, 204, 21, 0.18)' : 'transparent',
              padding: w.highlight ? '4px 14px' : '0',
              borderRadius: 10,
              border: w.highlight ? '1.5px solid rgba(250, 204, 21, 0.45)' : 'none',
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
  const SLIDE_DURATION = 145;

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
// SCENE 1: VIRAL HOOK (FULL-WIDTH 2-LINE COMPOSITION)
// ══════════════════════════════════════════════════════════════════
const Slide1Hook: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  // Sequential motion timing:
  // 0.0s (frame 0)  -> Top Badge
  // 0.2s (frame 6)  -> Headline Kinetic Title
  // 0.5s (frame 15) -> Main Card
  // 0.9s (frame 27) -> Key Value & Barrier
  // 1.3s (frame 39) -> Supporting Line & Playbook Bottom
  const badgeSpring = spring({ frame, fps, config: { damping: 12 } });
  const cardSpring = spring({ frame: frame - 15, fps, config: { damping: 12 } });
  const keyItemsSpring = spring({ frame: frame - 27, fps, config: { damping: 12 } });
  const bottomSpring = spring({ frame: frame - 39, fps, config: { damping: 12 } });
  const doctorScale = interpolate(frame, [0, 120], [1.0, 1.08]);

  // Case acceptance drops dynamically from 78% down to 31% with a dramatic pulse
  const meterDrop = interpolate(frame, [15, 60], [78, 31], { extrapolateRight: 'clamp' });
  const pulseScale = interpolate(frame, [58, 66, 74], [1, 1.15, 1], { extrapolateRight: 'clamp' });

  const line1Words = [
    { text: 'WHY' },
    { text: 'DO' },
    { text: 'PATIENTS', highlight: true, color: '#EF4444' },
    { text: 'SAY' },
  ];

  const line2Words = [
    { text: '“I’LL' },
    { text: 'THINK' },
    { text: 'ABOUT' },
    { text: 'IT”?' },
  ];

  return (
    <AbsoluteFill>
      {/* Cinematic Background: Real Dentist and Patient in Clinic */}
      <Img
        src={staticFile('assets/doctor-consult-real.png')}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center 22%',
          transform: `scale(${doctorScale})`,
          filter: 'brightness(0.38) contrast(1.15)',
        }}
      />

      <AmbientMotionBackground primaryColor="#DC2626" secondaryColor="#4F46E5" frame={frame} />

      {/* Full Safe Zone Container (Top 220px to Bottom 1560px) */}
      <div style={INSTA_SAFE_CONTAINER}>
        {/* TOP SECTION: Clinical Dilemma Badge + Full-Width 2-Line Kinetic Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ transform: `scale(${badgeSpring})`, display: 'flex' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 24px',
                borderRadius: 999,
                backgroundColor: 'rgba(239, 68, 68, 0.28)',
                border: '2px solid #EF4444',
                color: '#FECACA',
                fontSize: 16,
                fontWeight: 900,
                letterSpacing: 1.2,
                boxShadow: '0 0 25px rgba(239, 68, 68, 0.5)',
              }}
            >
              <span>🩺</span> THE PRACTICE CHALLENGE
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <KineticTitle words={line1Words} frame={frame} fps={fps} delay={6} fontSize={54} />
            <KineticTitle words={line2Words} frame={frame} fps={fps} delay={18} fontSize={54} />
          </div>
        </div>

        {/* LOWER SECTION: Grounded Patient Hesitation & Acceptance Card */}
        <div
          style={{
            marginTop: 48,
            backgroundColor: 'rgba(15, 23, 42, 0.96)',
            border: '2px solid rgba(239, 68, 68, 0.5)',
            borderRadius: 30,
            padding: '26px 28px',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.95)',
            transform: `scale(${cardSpring}) translateY(${interpolate(cardSpring, [0, 1], [35, 0])}px)`,
            opacity: interpolate(frame, [14, 24], [0, 1], { extrapolateRight: 'clamp' }),
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          {/* Patient Dialogue Box */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              borderRadius: 20,
              padding: '18px 24px',
              borderLeft: '5px solid #EF4444',
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 900, color: '#94A3B8', letterSpacing: 1.2, marginBottom: 6 }}>
              PATIENT HESITATION
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#FFFFFF', fontStyle: 'italic', lineHeight: 1.3 }}>
              “Doctor, let me think about it and get back to you.”
            </div>
          </div>

          {/* Dynamic Animated Loading Progress Bar */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              borderRadius: 20,
              padding: '18px 22px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              transform: `scale(${keyItemsSpring})`,
              opacity: interpolate(frame, [20, 30], [0, 1], { extrapolateRight: 'clamp' }),
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20 }}>📊</span>
                <span style={{ fontSize: 16, fontWeight: 900, color: '#CBD5E1', letterSpacing: 1.2 }}>
                  DIAGNOSTIC AUDIT: CASE ACCEPTANCE
                </span>
              </div>
              <span
                style={{
                  fontSize: 28,
                  fontWeight: 900,
                  color: '#EF4444',
                  transform: `scale(${pulseScale})`,
                  textShadow: '0 0 22px rgba(239, 68, 68, 0.8)',
                }}
              >
                {Math.round(meterDrop)}%
              </span>
            </div>

            {/* Glowing animated loading bar with shimmer */}
            <div
              style={{
                height: 20,
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                borderRadius: 999,
                overflow: 'hidden',
                position: 'relative',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6)',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${meterDrop}%`,
                  background: 'linear-gradient(90deg, #DC2626 0%, #EF4444 70%, #F87171 100%)',
                  borderRadius: 999,
                  boxShadow: '0 0 20px rgba(239, 68, 68, 0.9)',
                }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 16,
                fontWeight: 800,
              }}
            >
              <span style={{ color: '#EF4444' }}>📉 Average Clinic: ~30%</span>
              <span style={{ color: '#10B981' }}>🏆 Target Benchmark: 75%+</span>
            </div>
          </div>

          {/* Root Cause & Treatment Acceptance Reality */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 16,
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              borderRadius: 20,
              padding: '18px 22px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transform: `scale(${keyItemsSpring})`,
              opacity: interpolate(frame, [26, 36], [0, 1], { extrapolateRight: 'clamp' }),
            }}
          >
            <div>
              <div style={{ fontSize: 16, color: '#94A3B8', fontWeight: 800 }}>THE #1 BARRIER</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#FCD34D', marginTop: 4 }}>
                💳 Upfront Cost
              </div>
            </div>
            <div>
              <div style={{ fontSize: 16, color: '#94A3B8', fontWeight: 800 }}>CLINIC REALITY</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#F87171', marginTop: 4 }}>
                Delayed Treatment
              </div>
            </div>
          </div>

          {/* Subtitle tag - Enlarged text */}
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.16)',
              borderRadius: 16,
              padding: '14px 18px',
              fontSize: 18,
              color: '#FECACA',
              fontWeight: 800,
              lineHeight: 1.4,
              opacity: interpolate(frame, [38, 48], [0, 1], { extrapolateRight: 'clamp' }),
            }}
          >
            ⚠️ High-value treatment plans (Implants, Aligners, Crowns) often pause at the payment counter.
          </div>
        </div>

        {/* BOTTOM SECTION: The Playbook Focus */}
        <div
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.92)',
            border: '1.5px solid rgba(255,255,255,0.18)',
            borderRadius: 24,
            padding: '22px 26px',
            backdropFilter: 'blur(18px)',
            transform: `scale(${bottomSpring}) translateY(${interpolate(bottomSpring, [0, 1], [25, 0])}px)`,
            opacity: interpolate(frame, [38, 48], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 900, color: '#FACC15', letterSpacing: 1.2, marginBottom: 8 }}>
            💡 THE PLAYBOOK
          </div>
          <p style={{ fontSize: 25, color: '#F8FAFC', fontWeight: 800, lineHeight: 1.34, margin: 0 }}>
            Remove the biggest barriers between diagnosis and treatment acceptance. ⬇️
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════
// SCENE 2: SECRET #1 - EMI COST SLASHER (FULL-WIDTH 2-LINE)
// ══════════════════════════════════════════════════════════════════
const Slide2EmiCost: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const badgeSpring = spring({ frame, fps, config: { damping: 12 } });
  const titleSpring = spring({ frame: frame - 6, fps, config: { damping: 12 } });
  const cardSpring = spring({ frame: frame - 15, fps, config: { damping: 12 } });
  const slashProgress = interpolate(frame, [25, 45], [0, 100], { extrapolateRight: 'clamp' });
  const emiReveal = spring({ frame: frame - 28, fps, config: { damping: 10 } });
  const benefitsSpring = spring({ frame: frame - 39, fps, config: { damping: 12 } });
  const bottomSpring = spring({ frame: frame - 45, fps, config: { damping: 12 } });
  const bgScale = interpolate(frame, [0, 120], [1.0, 1.06]);

  return (
    <AbsoluteFill>
      {/* Background: AI Generated Indian Dentist presenting digital EMI options on tablet */}
      <Img
        src={staticFile('assets/reel/scene2-doctor-solution.jpg')}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center 12%',
          transform: `scale(${bgScale})`,
          filter: 'brightness(0.38) contrast(1.15)',
        }}
      />

      <AmbientMotionBackground primaryColor="#059669" secondaryColor="#0284C7" frame={frame} />

      {/* Full Safe Zone Container */}
      <div style={INSTA_SAFE_CONTAINER}>
        {/* TOP SECTION: Secret Badge + Full-Width 2-Line Balanced Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ transform: `scale(${badgeSpring})`, display: 'flex' }}>
            <span
              style={{
                padding: '10px 24px',
                borderRadius: 999,
                backgroundColor: '#059669',
                color: '#FFFFFF',
                fontSize: 16,
                fontWeight: 900,
                letterSpacing: 1.5,
                boxShadow: '0 6px 25px rgba(5, 150, 105, 0.5)',
                display: 'inline-block',
              }}
            >
              SECRET #1: REMOVE THE PRICE BARRIER
            </span>
          </div>

          <h2
            style={{
              fontSize: 50,
              fontWeight: 900,
              color: '#FFFFFF',
              margin: 0,
              lineHeight: 1.15,
              textShadow: '0 4px 22px rgba(0,0,0,0.95)',
              transform: `scale(${titleSpring}) translateY(${interpolate(titleSpring, [0, 1], [25, 0])}px)`,
              opacity: interpolate(frame, [5, 15], [0, 1], { extrapolateRight: 'clamp' }),
            }}
          >
            <div>TURN A ₹65,000 TREATMENT</div>
            <div>INTO AN <span style={{ color: '#34D399' }}>EMI OPTION</span> 💳</div>
          </h2>
        </div>

        {/* CENTER SECTION: Interactive Payment Transformation Card */}
        <div
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            border: '2px solid rgba(16, 185, 129, 0.5)',
            borderRadius: 30,
            padding: '28px 28px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
            transform: `scale(${cardSpring}) translateY(${interpolate(cardSpring, [0, 1], [35, 0])}px)`,
            opacity: interpolate(frame, [14, 24], [0, 1], { extrapolateRight: 'clamp' }),
            backdropFilter: 'blur(22px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 26 }}>🦷</span>
              <span style={{ fontSize: 20, fontWeight: 900, color: '#E2E8F0' }}>
                IMPLANTS &amp; INVISIBLE ALIGNERS
              </span>
            </div>
            <span style={{ fontSize: 14, fontWeight: 900, color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.18)', padding: '6px 14px', borderRadius: 999 }}>
              HIGH-TICKET
            </span>
          </div>

          {/* Slashed Upfront Price */}
          <div style={{ position: 'relative', display: 'inline-block', margin: '4px 0' }}>
            <div style={{ fontSize: 44, fontWeight: 900, color: '#64748B' }}>
              ₹65,000 <span style={{ fontSize: 22 }}>Upfront Barrier</span>
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
                boxShadow: '0 0 16px rgba(239,68,68,0.95)',
              }}
            />
          </div>

          {/* Glowing Green EMI Transformation Box */}
          <div
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              border: '2px solid #10B981',
              borderRadius: 22,
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transform: `scale(${emiReveal})`,
              boxShadow: '0 12px 45px rgba(16, 185, 129, 0.45)',
              opacity: interpolate(frame, [26, 36], [0, 1], { extrapolateRight: 'clamp' }),
            }}
          >
            <div>
              <div style={{ fontSize: 15, fontWeight: 900, color: '#6EE7B7', letterSpacing: 1.2 }}>
                PATIENT PAYS JUST
              </div>
              <div style={{ fontSize: 46, fontWeight: 900, color: '#FFFFFF', marginTop: 2 }}>
                From ₹2,650<span style={{ fontSize: 22, color: '#A7F3D0' }}>/mo*</span>
              </div>
            </div>
            <div style={{ backgroundColor: '#10B981', color: '#042F2E', padding: '12px 22px', borderRadius: 999, fontWeight: 900, fontSize: 16 }}>
              Flexible Tenures ✅
            </div>
          </div>

          {/* Clean 3 Credible Benefits List */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 18,
              padding: '18px 22px',
              fontSize: 18,
              fontWeight: 800,
              color: '#F1F5F9',
              transform: `scale(${benefitsSpring})`,
              opacity: interpolate(frame, [38, 48], [0, 1], { extrapolateRight: 'clamp' }),
            }}
          >
            <div>✓ Seamless digital application right at the front desk</div>
            <div>✓ Multiple financing options for patient choice</div>
            <div>✓ No EMI collection burden for the clinic</div>
          </div>
        </div>

        {/* BOTTOM SECTION: Disclaimer & Terms */}
        <div
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            border: '1.5px solid rgba(255,255,255,0.18)',
            borderRadius: 24,
            padding: '18px 24px',
            backdropFilter: 'blur(18px)',
            transform: `scale(${bottomSpring})`,
            opacity: interpolate(frame, [44, 54], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 900, color: '#34D399', letterSpacing: 1.2, marginBottom: 6 }}>
            💳 PATIENT PAYS LENDER IN MONTHLY EMIs
          </div>
          <p style={{ fontSize: 17, color: '#CBD5E1', fontWeight: 600, margin: 0, lineHeight: 1.4 }}>
            *Subject to lender eligibility, credit approval, chosen tenure and applicable charges.
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════
// SCENE 3: SECRET #2 - ANIMATED WHATSAPP CHAT SIMULATOR (EXPANDED CARD)
// ══════════════════════════════════════════════════════════════════
const Slide3WhatsAppSim: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const badgeSpring = spring({ frame, fps, config: { damping: 12 } });
  const titleSpring = spring({ frame: frame - 6, fps, config: { damping: 12 } });
  const cardSpring = spring({ frame: frame - 14, fps, config: { damping: 12 } });
  const chatSpring1 = spring({ frame: frame - 16, fps, config: { damping: 12 } });
  const chatSpring2 = spring({ frame: frame - 32, fps, config: { damping: 12 } });
  const chatSpring3 = spring({ frame: frame - 46, fps, config: { damping: 12 } });
  const pipelineSpring = spring({ frame: frame - 50, fps, config: { damping: 12 } });
  const bottomSpring = spring({ frame: frame - 56, fps, config: { damping: 12 } });
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
        {/* TOP SECTION: Secret Badge + Full-Width 2-Line Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ transform: `scale(${badgeSpring})`, display: 'flex' }}>
            <span
              style={{
                padding: '10px 24px',
                borderRadius: 999,
                backgroundColor: '#22C55E',
                color: '#FFFFFF',
                fontSize: 16,
                fontWeight: 900,
                letterSpacing: 1.5,
                boxShadow: '0 6px 25px rgba(34, 197, 94, 0.5)',
                display: 'inline-block',
              }}
            >
              SECRET #2: REACTIVATE OLD PATIENTS
            </span>
          </div>

          <h2
            style={{
              fontSize: 52,
              fontWeight: 900,
              color: '#FFFFFF',
              margin: 0,
              lineHeight: 1.15,
              textShadow: '0 4px 22px rgba(0,0,0,0.95)',
              transform: `scale(${titleSpring}) translateY(${interpolate(titleSpring, [0, 1], [25, 0])}px)`,
              opacity: interpolate(frame, [5, 15], [0, 1], { extrapolateRight: 'clamp' }),
            }}
          >
            <div>TURN DORMANT PATIENTS</div>
            <div>INTO <span style={{ color: '#4ADE80', fontSize: 56 }}>APPOINTMENTS</span> 🔄</div>
          </h2>
        </div>

        {/* CENTER SECTION: Real Animated WhatsApp Chat Mockup */}
        <div
          style={{
            backgroundColor: '#0B141A',
            border: '2px solid rgba(34, 197, 94, 0.45)',
            borderRadius: 30,
            padding: '24px 24px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
            transform: `scale(${cardSpring})`,
            opacity: interpolate(frame, [12, 22], [0, 1], { extrapolateRight: 'clamp' }),
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {/* WhatsApp Clinic Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, borderBottom: '1px solid #1F2C34', paddingBottom: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
              🦷
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#E9EDEF' }}>City Dental Clinic</div>
              <div style={{ fontSize: 15, color: '#25D366', fontWeight: 700 }}>● Automated Patient Recall</div>
            </div>
            <span style={{ fontSize: 14, backgroundColor: '#1F2C34', color: '#94A3B8', padding: '6px 14px', borderRadius: 999, fontWeight: 700 }}>
              WhatsApp Verified
            </span>
          </div>

          {/* Outgoing Message: Automated Recall */}
          <div
            style={{
              alignSelf: 'flex-start',
              backgroundColor: '#202C33',
              color: '#E9EDEF',
              padding: '16px 20px',
              borderRadius: '18px 18px 18px 4px',
              maxWidth: '92%',
              transform: `scale(${chatSpring1}) translateY(${interpolate(chatSpring1, [0, 1], [25, 0])}px)`,
              opacity: interpolate(frame, [14, 24], [0, 1], { extrapolateRight: 'clamp' }),
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.4 }}>
              Hi Priya! 👋 It's been 6 months since your last dental cleaning. Would you like us to reserve a check-up slot this Saturday?
            </div>
            <div style={{ fontSize: 13, color: '#8696A0', textAlign: 'right', marginTop: 4 }}>10:14 AM</div>
          </div>

          {/* Incoming Message: Patient Booking Confirmation */}
          <div
            style={{
              alignSelf: 'flex-end',
              backgroundColor: '#005C4B',
              color: '#E9EDEF',
              padding: '16px 20px',
              borderRadius: '18px 18px 4px 18px',
              maxWidth: '88%',
              transform: `scale(${chatSpring2}) translateY(${interpolate(chatSpring2, [0, 1], [25, 0])}px)`,
              opacity: interpolate(frame, [30, 40], [0, 1], { extrapolateRight: 'clamp' }),
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.4 }}>
              Yes please! Confirm Saturday 11:30 AM. 🙏
            </div>
            <div style={{ fontSize: 13, color: '#8696A0', textAlign: 'right', marginTop: 4 }}>
              10:16 AM <span style={{ color: '#53BDEB' }}>✓✓</span>
            </div>
          </div>

          {/* Outgoing Message: Confirmation Slip */}
          <div
            style={{
              alignSelf: 'flex-start',
              backgroundColor: '#202C33',
              color: '#E9EDEF',
              padding: '14px 18px',
              borderRadius: '18px 18px 18px 4px',
              maxWidth: '90%',
              transform: `scale(${chatSpring3}) translateY(${interpolate(chatSpring3, [0, 1], [25, 0])}px)`,
              opacity: interpolate(frame, [44, 54], [0, 1], { extrapolateRight: 'clamp' }),
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 700, color: '#A7F3D0' }}>
              ✅ Confirmed! Slot reserved for Saturday at 11:30 AM.
            </div>
          </div>

          {/* Realistic Funnel Mechanism Pipeline */}
          <div
            style={{
              backgroundColor: 'rgba(34, 197, 94, 0.14)',
              border: '1px solid rgba(34, 197, 94, 0.35)',
              borderRadius: 16,
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 16,
              fontWeight: 800,
              color: '#4ADE80',
              transform: `scale(${pipelineSpring})`,
              opacity: interpolate(frame, [48, 58], [0, 1], { extrapolateRight: 'clamp' }),
            }}
          >
            <span>📁 1,000+ Dormant Records</span>
            <span>➔</span>
            <span>📲 Smart Follow-Up</span>
            <span>➔</span>
            <span>📅 Confirmed Slot</span>
          </div>
        </div>

        {/* BOTTOM SECTION: High-Impact Hierarchical Recall Box */}
        <div
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.94)',
            border: '1.5px solid rgba(255,255,255,0.18)',
            borderRadius: 24,
            padding: '20px 24px',
            backdropFilter: 'blur(18px)',
            transform: `scale(${bottomSpring})`,
            opacity: interpolate(frame, [54, 64], [0, 1], { extrapolateRight: 'clamp' }),
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 900, color: '#4ADE80', letterSpacing: 1.2 }}>
            ⚡ AUTOMATED PATIENT RECALL
          </div>
          <div style={{ fontSize: 26, fontWeight: 900, color: '#FFFFFF', lineHeight: 1.2 }}>
            REACTIVATE OLD PATIENTS
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#FCD34D', lineHeight: 1.2 }}>
            WITHOUT MANUAL CALLING
          </div>
          <div style={{ fontSize: 16, color: '#94A3B8', fontWeight: 600, marginTop: 2 }}>
            Smart WhatsApp follow-ups → Confirmed appointment slots
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════
// SCENE 4: SECRET #3 - SHOW UP WHEN PATIENTS ASK AI (BALANCED)
// ══════════════════════════════════════════════════════════════════
const Slide4GoogleAiMockup: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const badgeSpring = spring({ frame, fps, config: { damping: 12 } });
  const titleSpring = spring({ frame: frame - 6, fps, config: { damping: 12 } });
  const cardSpring = spring({ frame: frame - 15, fps, config: { damping: 12 } });
  const clinicResultSpring = spring({ frame: frame - 27, fps, config: { damping: 12 } });
  const bottomSpring = spring({ frame: frame - 42, fps, config: { damping: 12 } });
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
        {/* TOP SECTION: Secret Badge + Full-Width 2-Line Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ transform: `scale(${badgeSpring})`, display: 'flex' }}>
            <span
              style={{
                padding: '10px 24px',
                borderRadius: 999,
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                fontSize: 16,
                fontWeight: 900,
                letterSpacing: 1.5,
                boxShadow: '0 6px 25px rgba(37, 99, 235, 0.5)',
                display: 'inline-block',
              }}
            >
              SECRET #3: GET FOUND IN AI SEARCH
            </span>
          </div>

          <h2
            style={{
              fontSize: 52,
              fontWeight: 900,
              color: '#FFFFFF',
              margin: 0,
              lineHeight: 1.15,
              textShadow: '0 4px 22px rgba(0,0,0,0.95)',
              transform: `scale(${titleSpring}) translateY(${interpolate(titleSpring, [0, 1], [25, 0])}px)`,
              opacity: interpolate(frame, [5, 15], [0, 1], { extrapolateRight: 'clamp' }),
            }}
          >
            <div>SHOW UP WHEN PATIENTS</div>
            <div><span style={{ color: '#60A5FA', fontSize: 56 }}>ASK AI</span> 🤖</div>
          </h2>
          <div style={{ fontSize: 19, color: '#93C5FD', fontWeight: 700 }}>
            When patients search: “Dentist offering EMI for implants near me”
          </div>
        </div>

        {/* CENTER SECTION: Realistic Google AI Overview Result Box */}
        <div
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            border: '2px solid rgba(59, 130, 246, 0.55)',
            borderRadius: 30,
            padding: '28px 28px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
            transform: `scale(${cardSpring})`,
            opacity: interpolate(frame, [14, 24], [0, 1], { extrapolateRight: 'clamp' }),
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            marginTop: 10,
          }}
        >
          {/* Search Query Input Bar */}
          <div
            style={{
              backgroundColor: 'rgba(255,255,255,0.08)',
              borderRadius: 20,
              padding: '22px 26px',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              border: '1.5px solid rgba(255,255,255,0.16)',
            }}
          >
            <span style={{ fontSize: 28 }}>🔍</span>
            <span style={{ fontSize: 24, fontWeight: 800, color: '#F1F5F9' }}>
              Best dentist for dental implants with EMI near me
            </span>
          </div>

          {/* AI Overview Header with subtle illustrative label */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 28 }}>✨</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: '#60A5FA', letterSpacing: 1.2 }}>
                AI OVERVIEW
              </span>
            </div>
            <span
              style={{
                fontSize: 15,
                fontWeight: 900,
                color: '#CBD5E1',
                backgroundColor: 'rgba(255,255,255,0.14)',
                padding: '8px 16px',
                borderRadius: 10,
                letterSpacing: 0.8,
              }}
            >
              ILLUSTRATIVE AI SEARCH RESULT
            </span>
          </div>

          <div style={{ fontSize: 22, color: '#E2E8F0', fontWeight: 600, lineHeight: 1.4 }}>
            Here are top-rated dental practices offering implant procedures with flexible financing:
          </div>

          {/* Realistic Recommended Dental Clinic Result */}
          <div
            style={{
              backgroundColor: 'rgba(37, 99, 235, 0.22)',
              border: '2px solid rgba(96, 165, 250, 0.75)',
              borderRadius: 24,
              padding: '26px 28px',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              transform: `scale(${clinicResultSpring})`,
              opacity: interpolate(frame, [25, 35], [0, 1], { extrapolateRight: 'clamp' }),
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 30, fontWeight: 900, color: '#FFFFFF' }}>ABC Dental Care</div>
                <div style={{ fontSize: 20, color: '#93C5FD', fontWeight: 700, marginTop: 4 }}>
                  Implantology · EMI Available · 📍 4.2 km
                </div>
              </div>
              <span
                style={{
                  fontSize: 20,
                  color: '#FACC15',
                  fontWeight: 900,
                  backgroundColor: 'rgba(250, 204, 21, 0.22)',
                  padding: '10px 18px',
                  borderRadius: 999,
                  border: '1.5px solid rgba(250, 204, 21, 0.55)',
                }}
              >
                ⭐ 4.9 · 120+ reviews
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1.5px solid rgba(255,255,255,0.15)' }}>
              <span style={{ fontSize: 21, color: '#34D399', fontWeight: 900 }}>
                💳 EMI options available
              </span>
              <span style={{ fontSize: 21, color: '#60A5FA', fontWeight: 900 }}>
                View clinic profile →
              </span>
            </div>
          </div>

          {/* Organic Discovery Mechanism */}
          <div
            style={{
              backgroundColor: 'rgba(255,255,255,0.08)',
              borderRadius: 18,
              padding: '18px 22px',
              fontSize: 20,
              fontWeight: 800,
              color: '#38BDF8',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <span style={{ fontSize: 24 }}>💡</span>
            <span>Clinaza helps structure your clinic’s online information for AI search</span>
          </div>

          <div style={{ fontSize: 18, color: '#CBD5E1', fontWeight: 700 }}>
            📌 AI search relies on structured information it can understand about your practice.
          </div>
        </div>

        {/* BOTTOM SECTION: AI Search Visibility with glowing schema chips */}
        <div
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.94)',
            border: '1.5px solid rgba(255,255,255,0.22)',
            borderRadius: 26,
            padding: '24px 28px',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            transform: `scale(${bottomSpring})`,
            opacity: interpolate(frame, [40, 50], [0, 1], { extrapolateRight: 'clamp' }),
            marginBottom: 8,
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 900, color: '#60A5FA', letterSpacing: 1.4 }}>
            🤖 AI SEARCH OPTIMIZATION
          </div>
          <p style={{ fontSize: 24, color: '#F1F5F9', fontWeight: 800, lineHeight: 1.34, margin: 0 }}>
            Structured clinic data helps search engines and AI systems understand and recommend your practice.
          </p>

          {/* Glowing GEO Mechanism Pipeline */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: 10,
              borderTop: '1.5px solid rgba(255,255,255,0.14)',
            }}
          >
            <div
              style={{
                backgroundColor: 'rgba(59, 130, 246, 0.28)',
                border: '1.5px solid rgba(59, 130, 246, 0.7)',
                color: '#BFDBFE',
                fontSize: 16,
                fontWeight: 800,
                padding: '10px 20px',
                borderRadius: 999,
              }}
            >
              Clinic Website
            </div>
            <span style={{ color: '#60A5FA', fontWeight: 900, fontSize: 18 }}>➔</span>
            <div
              style={{
                backgroundColor: 'rgba(168, 85, 247, 0.28)',
                border: '1.5px solid rgba(168, 85, 247, 0.7)',
                color: '#E9D5FF',
                fontSize: 16,
                fontWeight: 800,
                padding: '10px 20px',
                borderRadius: 999,
              }}
            >
              Structured Data
            </div>
            <span style={{ color: '#A855F7', fontWeight: 900, fontSize: 18 }}>➔</span>
            <div
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.28)',
                border: '1.5px solid rgba(16, 185, 129, 0.7)',
                color: '#A7F3D0',
                fontSize: 16,
                fontWeight: 800,
                padding: '10px 20px',
                borderRadius: 999,
              }}
            >
              AI Search
            </div>
          </div>
          <div style={{ fontSize: 17, color: '#CBD5E1', fontWeight: 700, textAlign: 'center' }}>
            Services • Expertise • Location • FAQs • Reviews
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════
// SCENE 5: SECRET #4 - MAKE YOUR CLINIC AI-READY (ENLARGED)
// ══════════════════════════════════════════════════════════════════
const Slide5ChatGptGeo: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const badgeSpring = spring({ frame, fps, config: { damping: 12 } });
  const titleSpring = spring({ frame: frame - 6, fps, config: { damping: 12 } });
  const cardSpring = spring({ frame: frame - 15, fps, config: { damping: 12 } });
  const answerSpring = spring({ frame: frame - 27, fps, config: { damping: 12 } });
  const bottomSpring = spring({ frame: frame - 40, fps, config: { damping: 12 } });
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
        {/* TOP SECTION: Secret Badge + Full-Width 2-Line Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ transform: `scale(${badgeSpring})`, display: 'flex' }}>
            <span
              style={{
                padding: '10px 24px',
                borderRadius: 999,
                backgroundColor: '#9333EA',
                color: '#FFFFFF',
                fontSize: 16,
                fontWeight: 900,
                letterSpacing: 1.5,
                boxShadow: '0 6px 25px rgba(147, 51, 234, 0.5)',
                display: 'inline-block',
              }}
            >
              SECRET #4: MAKE YOUR CLINIC AI-READY
            </span>
          </div>

          <h2
            style={{
              fontSize: 52,
              fontWeight: 900,
              color: '#FFFFFF',
              margin: 0,
              lineHeight: 1.15,
              textShadow: '0 4px 22px rgba(0,0,0,0.95)',
              transform: `scale(${titleSpring}) translateY(${interpolate(titleSpring, [0, 1], [25, 0])}px)`,
              opacity: interpolate(frame, [5, 15], [0, 1], { extrapolateRight: 'clamp' }),
            }}
          >
            <div>MAKE YOUR CLINIC</div>
            <div><span style={{ color: '#C084FC', fontSize: 58 }}>AI-READY</span> 🧠</div>
          </h2>
          <div style={{ fontSize: 19, color: '#E9D5FF', fontWeight: 700 }}>
            Help search engines and AI assistants understand your clinic
          </div>
        </div>

        {/* CENTER SECTION: Simulated Assistant Card */}
        <div
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            border: '2px solid rgba(168, 85, 247, 0.55)',
            borderRadius: 30,
            padding: '28px 28px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
            transform: `scale(${cardSpring})`,
            opacity: interpolate(frame, [14, 24], [0, 1], { extrapolateRight: 'clamp' }),
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            marginTop: 10,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 50, height: 50, borderRadius: 14, backgroundColor: '#10A37F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
                🤖
              </div>
              <div>
                <div style={{ fontSize: 25, fontWeight: 900, color: '#FFFFFF' }}>Patient Asks AI</div>
                <div style={{ fontSize: 18, color: '#C084FC', fontWeight: 700 }}>Search &amp; Assistant Query</div>
              </div>
            </div>
            <span
              style={{
                fontSize: 15,
                fontWeight: 900,
                color: '#CBD5E1',
                backgroundColor: 'rgba(255,255,255,0.14)',
                padding: '8px 16px',
                borderRadius: 10,
                letterSpacing: 0.8,
              }}
            >
              SIMULATED AI SEARCH EXAMPLE
            </span>
          </div>

          <div
            style={{
              backgroundColor: 'rgba(255,255,255,0.08)',
              borderRadius: 20,
              padding: '22px 26px',
              fontSize: 24,
              color: '#F8FAFC',
              fontStyle: 'italic',
              fontWeight: 700,
              borderLeft: '5px solid #A855F7',
            }}
          >
            "Find a trusted dentist for implants with EMI near me."
          </div>

          <div
            style={{
              backgroundColor: 'rgba(147, 51, 234, 0.22)',
              border: '2px solid rgba(168, 85, 247, 0.7)',
              borderRadius: 24,
              padding: '24px 26px',
              fontSize: 22,
              color: '#F3E8FF',
              lineHeight: 1.45,
              transform: `scale(${answerSpring})`,
              opacity: interpolate(frame, [25, 35], [0, 1], { extrapolateRight: 'clamp' }),
            }}
          >
            <span style={{ fontWeight: 600 }}>Example of how structured clinic information can appear in an AI answer:</span>
            <div
              style={{
                marginTop: 16,
                padding: '18px 22px',
                backgroundColor: 'rgba(255,255,255,0.12)',
                borderRadius: 16,
                fontSize: 25,
                fontWeight: 900,
                color: '#6EE7B7',
                border: '1px solid rgba(110, 231, 183, 0.35)',
              }}
            >
              📍 Dr. Sharma's Dental Care · Implants · EMI Options · ⭐ 4.9
            </div>
          </div>

          {/* Credible GEO Mechanism Benefit */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              borderRadius: 18,
              padding: '18px 22px',
              fontSize: 20,
              fontWeight: 800,
              color: '#C084FC',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <span style={{ fontSize: 24 }}>✨</span>
            <span>Organic visibility without paying for every click</span>
          </div>

          <div style={{ fontSize: 18, color: '#CBD5E1', fontWeight: 700 }}>
            📌 Patients are increasingly using AI to discover local healthcare providers.
          </div>
        </div>

        {/* BOTTOM SECTION: Implementation Pipeline */}
        <div
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.94)',
            border: '1.5px solid rgba(255,255,255,0.22)',
            borderRadius: 26,
            padding: '24px 28px',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            transform: `scale(${bottomSpring})`,
            opacity: interpolate(frame, [38, 48], [0, 1], { extrapolateRight: 'clamp' }),
            marginBottom: 8,
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 900, color: '#C084FC', letterSpacing: 1.4 }}>
            🤖 AI SEARCH VISIBILITY
          </div>
          <p style={{ fontSize: 24, color: '#F1F5F9', fontWeight: 800, lineHeight: 1.34, margin: 0 }}>
            Make your clinic easier for Google and AI search engines to understand, discover, and recommend.
          </p>

          {/* Clean GEO Pipeline */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: 10,
              borderTop: '1.5px solid rgba(255,255,255,0.14)',
            }}
          >
            <div
              style={{
                backgroundColor: 'rgba(168, 85, 247, 0.28)',
                border: '1.5px solid rgba(168, 85, 247, 0.7)',
                color: '#E9D5FF',
                fontSize: 16,
                fontWeight: 800,
                padding: '10px 20px',
                borderRadius: 999,
              }}
            >
              Clinic Website
            </div>
            <span style={{ color: '#C084FC', fontWeight: 900, fontSize: 18 }}>➔</span>
            <div
              style={{
                backgroundColor: 'rgba(168, 85, 247, 0.32)',
                border: '1.5px solid rgba(168, 85, 247, 0.8)',
                color: '#E9D5FF',
                fontSize: 16,
                fontWeight: 800,
                padding: '10px 20px',
                borderRadius: 999,
              }}
            >
              Structured Info
            </div>
            <span style={{ color: '#C084FC', fontWeight: 900, fontSize: 18 }}>➔</span>
            <div
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.28)',
                border: '1.5px solid rgba(16, 185, 129, 0.7)',
                color: '#A7F3D0',
                fontSize: 16,
                fontWeight: 800,
                padding: '10px 20px',
                borderRadius: 999,
              }}
            >
              Search &amp; AI Discovery
            </div>
          </div>
          <div style={{ fontSize: 17, color: '#CBD5E1', fontWeight: 700, textAlign: 'center' }}>
            Clinic profile · Services · FAQs · Location · Doctor expertise
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════
// SCENE 6: HIGH CONVERTING CTA (FULL-WIDTH 2-LINE)
// ══════════════════════════════════════════════════════════════════
const Slide6FinalCTA: React.FC<{ frame: number; fps: number; websiteUrl: string }> = ({
  frame,
  fps,
  websiteUrl,
}) => {
  const badgeSpring = spring({ frame, fps, config: { damping: 12 } });
  const titleSpring = spring({ frame: frame - 6, fps, config: { damping: 12 } });
  const cardSpring = spring({ frame: frame - 15, fps, config: { damping: 12 } });
  const ctaBtnSpring = spring({ frame: frame - 27, fps, config: { damping: 12 } });
  const bottomBoxSpring = spring({ frame: frame - 38, fps, config: { damping: 12 } });
  const pulseButton = Math.sin(frame / 5) * 0.04 + 1;
  const bgScale = interpolate(frame, [0, 120], [1.0, 1.05]);

  return (
    <AbsoluteFill>
      <Img
        src={staticFile('assets/reels/clinic_growth_hero.jpg')}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          transform: `scale(${bgScale})`,
          filter: 'brightness(0.32) contrast(1.15)',
        }}
      />

      <AmbientMotionBackground primaryColor="#0867E8" secondaryColor="#10B981" frame={frame} />

      {/* Full Safe Zone Container */}
      <div style={INSTA_SAFE_CONTAINER}>
        {/* TOP SECTION: Final Call Badge + Full-Width 2-Line Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ transform: `scale(${badgeSpring})`, display: 'flex' }}>
            <span
              style={{
                padding: '10px 24px',
                borderRadius: 999,
                backgroundColor: '#0867E8',
                color: '#FFFFFF',
                fontSize: 16,
                fontWeight: 900,
                letterSpacing: 1.5,
                boxShadow: '0 6px 25px rgba(8, 103, 232, 0.5)',
                display: 'inline-block',
              }}
            >
              THIS IS CLINAZA
            </span>
          </div>

          <h2
            style={{
              fontSize: 50,
              fontWeight: 900,
              color: '#FFFFFF',
              margin: 0,
              lineHeight: 1.15,
              textShadow: '0 4px 22px rgba(0,0,0,0.95)',
              transform: `scale(${titleSpring}) translateY(${interpolate(titleSpring, [0, 1], [25, 0])}px)`,
              opacity: interpolate(frame, [5, 15], [0, 1], { extrapolateRight: 'clamp' }),
            }}
          >
            <div>TURN MORE TREATMENT PLANS</div>
            <div>INTO <span style={{ color: '#60A5FA', fontSize: 56 }}>PATIENTS</span> 🚀</div>
          </h2>
        </div>

        {/* CENTER SECTION: Interactive Transformation Summary Card */}
        <div
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            border: '2px solid rgba(8, 103, 232, 0.5)',
            borderRadius: 30,
            padding: '28px 26px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
            transform: `scale(${cardSpring})`,
            opacity: interpolate(frame, [14, 24], [0, 1], { extrapolateRight: 'clamp' }),
            backdropFilter: 'blur(22px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 18,
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 800, color: '#CBD5E1', alignSelf: 'flex-start' }}>
            Clinaza helps dental clinics with:
          </div>

          {/* 4 Clean Pillars Summary Grid */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              width: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 20,
              padding: '20px 22px',
              textAlign: 'left',
            }}
          >
            <div style={{ fontSize: 20, color: '#F1F5F9', fontWeight: 800 }}>
              ✓ Patient Financing
            </div>
            <div style={{ fontSize: 20, color: '#F1F5F9', fontWeight: 800 }}>
              ✓ Automated Patient Recall
            </div>
            <div style={{ fontSize: 20, color: '#F1F5F9', fontWeight: 800 }}>
              ✓ AI &amp; Google Search Visibility
            </div>
            <div style={{ fontSize: 20, color: '#F1F5F9', fontWeight: 800 }}>
              ✓ Digital Clinic Growth
            </div>
          </div>

          {/* Pulsing CTA Action Button */}
          <div
            style={{
              transform: `scale(${ctaBtnSpring * pulseButton})`,
              opacity: interpolate(frame, [25, 35], [0, 1], { extrapolateRight: 'clamp' }),
              display: 'inline-block',
              padding: '20px 48px',
              borderRadius: 22,
              backgroundColor: '#0867E8',
              color: '#FFFFFF',
              fontSize: 22,
              fontWeight: 900,
              boxShadow: '0 14px 45px rgba(8, 103, 232, 0.7)',
              letterSpacing: 0.5,
              marginTop: 4,
            }}
          >
            PARTNER WITH CLINAZA FREE →
          </div>
        </div>

        {/* BOTTOM SECTION: Staggered Large Two-Line Destination Callout */}
        <div
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.94)',
            border: '2px solid rgba(16, 185, 129, 0.5)',
            borderRadius: 24,
            padding: '18px 24px',
            textAlign: 'center',
            backdropFilter: 'blur(18px)',
            transform: `scale(${bottomBoxSpring})`,
            opacity: interpolate(frame, [36, 46], [0, 1], { extrapolateRight: 'clamp' }),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <div
            style={{
              fontSize: 16,
              color: '#34D399',
              fontWeight: 900,
              letterSpacing: 1.5,
            }}
          >
            ⚡ FREE FOR DENTAL CLINICS
          </div>
          <div
            style={{
              fontSize: 32,
              color: '#FFFFFF',
              fontWeight: 900,
              letterSpacing: 1.2,
              textShadow: '0 0 20px rgba(52, 211, 153, 0.6)',
            }}
          >
            {websiteUrl}
          </div>
        </div>

        {/* Clinaza Logo Endcard */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            opacity: interpolate(frame, [55, 75], [0, 1], { extrapolateRight: 'clamp' }),
            transform: `scale(${interpolate(frame, [55, 75], [0.8, 1], { extrapolateRight: 'clamp' })})`,
          }}
        >
          <Img
            src={staticFile('assets/reels/clinaza-logo.jpg')}
            style={{
              width: 220,
              height: 'auto',
              borderRadius: 20,
              boxShadow: '0 8px 32px rgba(8, 103, 232, 0.5)',
              backgroundColor: '#FFFFFF',
              padding: 10,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};


