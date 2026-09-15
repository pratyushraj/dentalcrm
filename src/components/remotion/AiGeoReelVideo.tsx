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

export interface AiGeoReelProps {
  title?: string;
  websiteUrl?: string;
}

export const aiGeoReelDefaultProps: AiGeoReelProps = {
  title: 'How Dentists Rank #1 on Google AI & ChatGPT Search 🤖🦷',
  websiteUrl: 'clinaza.in',
};

// ── REMOTION BEST PRACTICES & MOTION DESIGN UTILITIES ──

/**
 * Ken Burns Dynamic Image Zoom & Pan Component
 */
const KenBurnsImage: React.FC<{
  src: string;
  frame: number;
  startScale?: number;
  endScale?: number;
  filter?: string;
}> = ({ src, frame, startScale = 1.0, endScale = 1.1, filter }) => {
  const scale = interpolate(frame, [0, 120], [startScale, endScale], {
    extrapolateRight: 'clamp',
  });
  const translateY = interpolate(frame, [0, 120], [0, -10], {
    extrapolateRight: 'clamp',
  });

  return (
    <Img
      src={src}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transform: `scale(${scale}) translateY(${translateY}px)`,
        filter: filter || 'none',
      }}
    />
  );
};

/**
 * Film Grain Noise Overlay (Agency-grade texture)
 */
const FilmGrainOverlay: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      opacity: 0.04,
      pointerEvents: 'none',
      zIndex: 5,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    }}
  />
);

/**
 * Organic Mesh Gradient Backdrop
 */
const AmbientMeshGradient: React.FC<{ color1?: string; color2?: string; frame: number }> = ({
  color1 = '#38BDF8',
  color2 = '#8B5CF6',
  frame,
}) => {
  const x = Math.sin(frame / 18) * 45;
  const y = Math.cos(frame / 22) * 35;

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          top: '25%',
          left: '15%',
          width: 550,
          height: 550,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color1} 0%, transparent 70%)`,
          opacity: 0.28,
          filter: 'blur(95px)',
          transform: `translate(${x}px, ${y}px)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '10%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color2} 0%, transparent 70%)`,
          opacity: 0.22,
          filter: 'blur(105px)',
          transform: `translate(${-x}px, ${-y}px)`,
        }}
      />
    </div>
  );
};

/**
 * INSTAGRAM REEL SAFE ZONE MARGINS
 */
const INSTA_SAFE_PADDING = '240px 140px 340px 60px';

export const AiGeoReelComposition: React.FC<AiGeoReelProps> = ({
  websiteUrl = 'clinaza.in',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const SLIDE_DURATION = 120; // 4s per slide (3 slides total = 360 frames / 12s)

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#020617',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: '#ffffff',
        overflow: 'hidden',
      }}
    >
      <FilmGrainOverlay />

      {/* SLIDE 1: VIRAL AI SEARCH HOOK (0 - 4s) */}
      <Sequence from={0} durationInFrames={SLIDE_DURATION}>
        <Slide1Hook frame={frame} fps={fps} />
      </Sequence>

      {/* SLIDE 2: THE 3-STEP GEO BLUEPRINT (4 - 8s) */}
      <Sequence from={SLIDE_DURATION} durationInFrames={SLIDE_DURATION}>
        <Slide2Blueprint frame={frame - SLIDE_DURATION} fps={fps} />
      </Sequence>

      {/* SLIDE 3: CLINAZA AI CTA (8 - 12s) */}
      <Sequence from={SLIDE_DURATION * 2} durationInFrames={SLIDE_DURATION}>
        <Slide3CTA frame={frame - SLIDE_DURATION * 2} fps={fps} websiteUrl={websiteUrl} />
      </Sequence>
    </AbsoluteFill>
  );
};

// ── SLIDE 1: HOOK ──
const Slide1Hook: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const badgeSpring = spring({ frame, fps, config: { damping: 12 } });
  const textOpacity = interpolate(frame, [10, 25], [0, 1], { extrapolateRight: 'clamp' });
  const floatY = Math.sin(frame / 12) * 5;

  return (
    <AbsoluteFill>
      <KenBurnsImage src={staticFile('assets/reels/clinic_growth_hero.jpg')} frame={frame} filter="brightness(0.35) blur(4px)" />
      <AmbientMeshGradient color1="#38BDF8" color2="#A855F7" frame={frame} />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(2, 6, 23, 0.98) 0%, rgba(2, 6, 23, 0.75) 50%, rgba(2, 6, 23, 0.45) 100%)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          padding: INSTA_SAFE_PADDING,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          zIndex: 10,
        }}
      >
        <div
          style={{
            transform: `scale(${badgeSpring})`,
            display: 'inline-block',
            padding: '10px 20px',
            borderRadius: 999,
            backgroundColor: '#0284C7',
            color: '#FFFFFF',
            fontSize: 15,
            fontWeight: 900,
            letterSpacing: 1.5,
            width: 'fit-content',
            boxShadow: '0 4px 20px rgba(2, 132, 199, 0.4)',
          }}
        >
          🤖 2026 DENTAL SEO GAMECHANGER
        </div>

        <div style={{ opacity: textOpacity, transform: `translateY(${floatY}px)` }}>
          <h1
            style={{
              fontSize: 44,
              fontWeight: 900,
              lineHeight: 1.15,
              margin: '0 0 16px 0',
              color: '#FFFFFF',
              textShadow: '0 4px 20px rgba(0,0,0,0.9)',
            }}
          >
            Patients Don’t Google Anymore — They Ask <span style={{ color: '#38BDF8' }}>ChatGPT &amp; Perplexity!</span> 🔍✨
          </h1>

          <p style={{ fontSize: 20, color: '#CBD5E1', fontWeight: 700, lineHeight: 1.4, margin: 0 }}>
            Here is how top dental clinics trigger instant AI recommendations when patients search "Best dentist near me"!
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── SLIDE 2: BLUEPRINT ──
const Slide2Blueprint: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const badgeSpring = spring({ frame, fps, config: { damping: 12 } });
  const textOpacity = interpolate(frame, [10, 25], [0, 1], { extrapolateRight: 'clamp' });
  const floatY = Math.sin(frame / 10) * 4;

  return (
    <AbsoluteFill>
      <KenBurnsImage src={staticFile('assets/reels/whatsapp_reactivation.jpg')} frame={frame} filter="brightness(0.3) blur(6px)" />
      <AmbientMeshGradient color1="#10B981" color2="#38BDF8" frame={frame} />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(2, 6, 23, 0.98) 0%, rgba(2, 6, 23, 0.75) 50%, rgba(2, 6, 23, 0.5) 100%)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          padding: INSTA_SAFE_PADDING,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          zIndex: 10,
        }}
      >
        <div
          style={{
            transform: `scale(${badgeSpring})`,
            display: 'inline-block',
            padding: '10px 20px',
            borderRadius: 999,
            backgroundColor: '#10B981',
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: 900,
            letterSpacing: 1.5,
            width: 'fit-content',
            boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
          }}
        >
          THE GEO FORMULA
        </div>

        <div style={{ opacity: textOpacity, transform: `translateY(${floatY}px)` }}>
          <h2
            style={{
              fontSize: 40,
              fontWeight: 900,
              color: '#FFFFFF',
              margin: '0 0 16px 0',
              lineHeight: 1.15,
            }}
          >
            3 Steps to Rank <span style={{ color: '#34D399' }}>#1 in AI Search</span> 🏆
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <FeatureStep icon="📍" text="Add Structured Schema.org Medical Data" color="#34D399" frame={frame} delay={0} />
            <FeatureStep icon="💰" text="Publish Procedure Cost & EMI Guides" color="#38BDF8" frame={frame} delay={5} />
            <FeatureStep icon="⭐" text="Automate 5-Star Patient Review Loops" color="#F59E0B" frame={frame} delay={10} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── SLIDE 3: CTA ──
const Slide3CTA: React.FC<{ frame: number; fps: number; websiteUrl: string }> = ({
  frame,
  fps,
  websiteUrl,
}) => {
  const logoScale = spring({ frame, fps, config: { damping: 10 } });
  const buttonPulse = Math.sin(frame / 8) * 0.04 + 1;

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
      <AmbientMeshGradient color1="#38BDF8" color2="#0867E8" frame={frame} />

      <div style={{ transform: `scale(${logoScale})`, zIndex: 10 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 24px',
            borderRadius: 20,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            marginBottom: 20,
            boxShadow: '0 8px 30px rgba(56, 189, 248, 0.25)',
          }}
        >
          <span style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF', letterSpacing: 2 }}>
            CLIN<span style={{ color: '#0867E8' }}>AZA</span>
          </span>
        </div>

        <h2
          style={{
            fontSize: 42,
            fontWeight: 900,
            color: '#FFFFFF',
            lineHeight: 1.15,
            margin: '0 0 14px 0',
          }}
        >
          Get Your Clinic <span style={{ color: '#38BDF8' }}>AI-Search Ready</span> Today 🚀
        </h2>

        <p style={{ fontSize: 19, color: '#94A3B8', fontWeight: 600, margin: '0 0 28px 0', maxWidth: 540 }}>
          Clinaza — Automated GEO AI Search Optimization &amp; Patient Financing for Modern Clinics.
        </p>

        <div
          style={{
            transform: `scale(${buttonPulse})`,
            display: 'inline-block',
            padding: '18px 44px',
            borderRadius: 22,
            backgroundColor: '#0867E8',
            color: '#FFFFFF',
            fontSize: 22,
            fontWeight: 900,
            boxShadow: '0 12px 40px rgba(8, 103, 232, 0.5)',
            letterSpacing: 1,
            marginBottom: 20,
          }}
        >
          Boost Your Clinic Search →
        </div>

        <div style={{ fontSize: 17, color: '#10B981', fontWeight: 800, letterSpacing: 1 }}>
          ⚡ 100% FREE FOR CLINICS · {websiteUrl}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const FeatureStep: React.FC<{
  icon: string;
  text: string;
  color: string;
  frame?: number;
  delay?: number;
}> = ({ icon, text, color, frame = 0, delay = 0 }) => {
  const slideIn = interpolate(frame - delay, [0, 15], [30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '14px 18px',
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.07)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        backdropFilter: 'blur(12px)',
        transform: `translateX(${slideIn}px)`,
        opacity,
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
      }}
    >
      <span style={{ fontSize: 24 }}>{icon}</span>
      <span style={{ fontSize: 17, fontWeight: 800, color: '#F8FAFC', textAlign: 'left' }}>
        {text}
      </span>
    </div>
  );
};
