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

// ── REUSABLE MOTION GRAPHICS COMPONENTS (INPIRED BY CLAUDE-REMOTION-SKILL) ──

/**
 * Ken Burns Dynamic Image Zoom & Pan Component
 * Adds continuous organic camera motion to static images
 */
const KenBurnsImage: React.FC<{
  src: string;
  frame: number;
  startScale?: number;
  endScale?: number;
  filter?: string;
}> = ({ src, frame, startScale = 1.0, endScale = 1.08, filter }) => {
  const scale = interpolate(frame, [0, 120], [startScale, endScale], {
    extrapolateRight: 'clamp',
  });
  const translateY = interpolate(frame, [0, 120], [0, -12], {
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
 * Film Grain & Noise Overlay
 * Adds subtle texture for agency-grade cinematic polish
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
 * Creates subtle glowing ambient lighting that moves slowly
 */
const AmbientMeshGradient: React.FC<{ color1?: string; color2?: string; frame: number }> = ({
  color1 = '#0867E8',
  color2 = '#8B5CF6',
  frame,
}) => {
  const x = Math.sin(frame / 20) * 40;
  const y = Math.cos(frame / 25) * 30;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color1} 0%, transparent 70%)`,
          opacity: 0.25,
          filter: 'blur(90px)',
          transform: `translate(${x}px, ${y}px)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '5%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color2} 0%, transparent 70%)`,
          opacity: 0.2,
          filter: 'blur(100px)',
          transform: `translate(${-x}px, ${-y}px)`,
        }}
      />
    </div>
  );
};

export const ClinicGrowthReelComposition: React.FC<ClinicGrowthReelProps> = ({
  websiteUrl = 'clinaza.in',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slide duration: 120 frames (4 seconds per slide, 6 slides total = 720 frames / 24s)
  const SLIDE_DURATION = 120;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#020617',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: '#ffffff',
        overflow: 'hidden',
      }}
    >
      {/* Film Grain Across All Slides */}
      <FilmGrainOverlay />

      {/* SLIDE 1: VIRAL HOOK (0 - 4s) */}
      <Sequence from={0} durationInFrames={SLIDE_DURATION}>
        <Slide1 frame={frame} fps={fps} />
      </Sequence>

      {/* SLIDE 2: SECRET #1 - PATIENT EMI (4 - 8s) */}
      <Sequence from={SLIDE_DURATION} durationInFrames={SLIDE_DURATION}>
        <Slide2 frame={frame - SLIDE_DURATION} fps={fps} />
      </Sequence>

      {/* SLIDE 3: SECRET #2 - WHATSAPP PATIENT RECOVERY (8 - 12s) */}
      <Sequence from={SLIDE_DURATION * 2} durationInFrames={SLIDE_DURATION}>
        <Slide3 frame={frame - SLIDE_DURATION * 2} fps={fps} />
      </Sequence>

      {/* SLIDE 4: SECRET #3 - GOOGLE AI OVERVIEWS & SEO (12 - 16s) */}
      <Sequence from={SLIDE_DURATION * 3} durationInFrames={SLIDE_DURATION}>
        <Slide4 frame={frame - SLIDE_DURATION * 3} fps={fps} />
      </Sequence>

      {/* SLIDE 5: SECRET #4 - CHATGPT & PERPLEXITY AI SEARCH GEO (16 - 20s) */}
      <Sequence from={SLIDE_DURATION * 4} durationInFrames={SLIDE_DURATION}>
        <Slide5 frame={frame - SLIDE_DURATION * 4} fps={fps} />
      </Sequence>

      {/* SLIDE 6: SECRET #5 & HIGH-CONVERTING CTA (20 - 24s) */}
      <Sequence from={SLIDE_DURATION * 5} durationInFrames={SLIDE_DURATION}>
        <Slide6 frame={frame - SLIDE_DURATION * 5} fps={fps} websiteUrl={websiteUrl} />
      </Sequence>
    </AbsoluteFill>
  );
};

/**
 * INSTAGRAM REEL SAFE ZONE CONTAINER
 * Top: 240px (avoids IG top header & back button)
 * Right: 140px (avoids Like, Comment, Share, Bookmark side buttons)
 * Bottom: 340px (avoids IG caption text, username, and audio bar)
 * Left: 60px
 */
const INSTA_SAFE_PADDING = '240px 140px 340px 60px';

// --- SLIDE 1: VIRAL HOOK ---
const Slide1: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const scale = spring({ frame, fps, config: { damping: 14 } });
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const breatheY = Math.sin(frame / 12) * 5;

  return (
    <AbsoluteFill style={{ opacity }}>
      <KenBurnsImage src={staticFile('assets/reels/clinic_growth_hero.jpg')} frame={frame} startScale={1.0} endScale={1.12} />
      
      <AmbientMeshGradient color1="#EF4444" color2="#3B82F6" frame={frame} />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(2, 6, 23, 0.98) 0%, rgba(2, 6, 23, 0.65) 50%, rgba(2, 6, 23, 0.45) 100%)',
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span
            style={{
              padding: '8px 18px',
              borderRadius: 999,
              backgroundColor: 'rgba(239, 68, 68, 0.25)',
              border: '1.5px solid #EF4444',
              fontSize: 15,
              fontWeight: 800,
              color: '#FCA5A5',
              letterSpacing: 1,
              boxShadow: '0 0 20px rgba(239, 68, 68, 0.3)',
            }}
          >
            ⚠️ DENTAL PRACTICE WARNING
          </span>
        </div>

        <div style={{ transform: `scale(${scale}) translateY(${breatheY}px)`, transformOrigin: 'bottom left' }}>
          <div
            style={{
              display: 'inline-block',
              padding: '8px 16px',
              borderRadius: 12,
              backgroundColor: '#EF4444',
              color: '#FFFFFF',
              fontSize: 16,
              fontWeight: 900,
              marginBottom: 16,
              textTransform: 'uppercase',
              letterSpacing: 1,
              boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)',
            }}
          >
            ❌ 70% PATIENT DROP-OFF
          </div>

          <h1
            style={{
              fontSize: 44,
              fontWeight: 900,
              lineHeight: 1.15,
              margin: '0 0 18px 0',
              color: '#FFFFFF',
              textShadow: '0 4px 20px rgba(0,0,0,0.9)',
            }}
          >
            Why Are <span style={{ color: '#F87171' }}>70% of Patients Leaving</span> Your Clinic Without Treatment? ❌🦷
          </h1>

          <p style={{ fontSize: 19, color: '#CBD5E1', fontWeight: 600, lineHeight: 1.4, margin: 0 }}>
            Hint: It’s NOT your clinical skills. Here is the 5-step AI &amp; growth framework top clinics use to 3X revenue!
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// --- SLIDE 2: SECRET #1 ---
const Slide2: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const badgeSpring = spring({ frame, fps, config: { damping: 12 } });
  const textOpacity = interpolate(frame, [10, 25], [0, 1], { extrapolateRight: 'clamp' });
  const floatY = Math.sin(frame / 10) * 4;

  return (
    <AbsoluteFill>
      <KenBurnsImage src={staticFile('assets/reels/patient_emi_tablet.jpg')} frame={frame} startScale={1.0} endScale={1.09} />

      <AmbientMeshGradient color1="#0867E8" color2="#10B981" frame={frame} />

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
            backgroundColor: '#0867E8',
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: 900,
            letterSpacing: 1.5,
            width: 'fit-content',
            boxShadow: '0 4px 20px rgba(8, 103, 232, 0.4)',
          }}
        >
          SECRET #1
        </div>

        <div style={{ opacity: textOpacity, transform: `translateY(${floatY}px)` }}>
          <h2
            style={{
              fontSize: 42,
              fontWeight: 900,
              color: '#FFFFFF',
              margin: '0 0 14px 0',
              lineHeight: 1.15,
            }}
          >
            Stop Losing <span style={{ color: '#10B981' }}>₹50,000+ Cases</span> at Checkout 💳
          </h2>

          <p style={{ fontSize: 20, color: '#CBD5E1', fontWeight: 700, margin: '0 0 22px 0', lineHeight: 1.35 }}>
            Patients say NO to Implants &amp; Aligners because of upfront cost. Offer Point-of-Care Monthly EMIs!
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <FeatureBadge icon="✅" text="₹0 Upfront Setup Fee for Dental Clinics" color="#10B981" frame={frame} delay={0} />
            <FeatureBadge icon="🏦" text="Funded by RBI-Regulated Banks & NBFCs" color="#38BDF8" frame={frame} delay={5} />
            <FeatureBadge icon="📲" text="2-Minute Soft Digital Pre-Check at Front Desk" color="#F59E0B" frame={frame} delay={10} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// --- SLIDE 3: SECRET #2 ---
const Slide3: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const badgeSpring = spring({ frame, fps, config: { damping: 12 } });
  const textOpacity = interpolate(frame, [10, 25], [0, 1], { extrapolateRight: 'clamp' });
  const floatY = Math.sin(frame / 10) * 4;

  return (
    <AbsoluteFill>
      <KenBurnsImage src={staticFile('assets/reels/whatsapp_reactivation.jpg')} frame={frame} startScale={1.0} endScale={1.09} />

      <AmbientMeshGradient color1="#25D366" color2="#0867E8" frame={frame} />

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
            backgroundColor: '#25D366',
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: 900,
            letterSpacing: 1.5,
            width: 'fit-content',
            boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
          }}
        >
          SECRET #2
        </div>

        <div style={{ opacity: textOpacity, transform: `translateY(${floatY}px)` }}>
          <h2
            style={{
              fontSize: 42,
              fontWeight: 900,
              color: '#FFFFFF',
              margin: '0 0 14px 0',
              lineHeight: 1.15,
            }}
          >
            Unlock <span style={{ color: '#25D366' }}>₹2-5 Lakhs Hidden</span> in Old Files 💬
          </h2>

          <p style={{ fontSize: 20, color: '#CBD5E1', fontWeight: 700, margin: '0 0 22px 0', lineHeight: 1.35 }}>
            Automate WhatsApp 6-Month Recall &amp; Cleaning Reminders — Recover 30%+ Dormant Patients on Autopilot!
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <FeatureBadge icon="🔔" text="Automated WhatsApp Recall & Cleaning Reminders" color="#25D366" frame={frame} delay={0} />
            <FeatureBadge icon="🗓️" text="Zero No-Shows with Instant 1-Click Confirmations" color="#38BDF8" frame={frame} delay={5} />
            <FeatureBadge icon="📈" text="Fill Empty Chair Slots Every Single Week" color="#F59E0B" frame={frame} delay={10} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// --- SLIDE 4: SECRET #3 - GOOGLE AI OVERVIEWS & SEO ---
const Slide4: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const badgeSpring = spring({ frame, fps, config: { damping: 12 } });
  const textOpacity = interpolate(frame, [10, 25], [0, 1], { extrapolateRight: 'clamp' });
  const floatY = Math.sin(frame / 10) * 4;

  return (
    <AbsoluteFill>
      <KenBurnsImage src={staticFile('assets/reels/clinic_growth_hero.jpg')} frame={frame} filter="brightness(0.3) blur(6px)" startScale={1.0} endScale={1.08} />

      <AmbientMeshGradient color1="#4285F4" color2="#34A853" frame={frame} />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(2, 6, 23, 0.98) 0%, rgba(2, 6, 23, 0.8) 100%)',
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
            backgroundColor: '#4285F4',
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: 900,
            letterSpacing: 1.5,
            width: 'fit-content',
            boxShadow: '0 4px 20px rgba(66, 133, 244, 0.4)',
          }}
        >
          SECRET #3
        </div>

        <div style={{ opacity: textOpacity, transform: `translateY(${floatY}px)` }}>
          <h2
            style={{
              fontSize: 42,
              fontWeight: 900,
              color: '#FFFFFF',
              margin: '0 0 14px 0',
              lineHeight: 1.15,
            }}
          >
            Rank #1 on <span style={{ color: '#60A5FA' }}>Google AI Overviews</span> 🔍🤖
          </h2>

          <p style={{ fontSize: 20, color: '#CBD5E1', fontWeight: 700, margin: '0 0 22px 0', lineHeight: 1.35 }}>
            Structure procedure cost guides (Implants, Braces) to trigger instant Google AI Search answers in your city!
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <FeatureBadge icon="🔍" text="Capture High-Intent Patients Searching Treatment Cost" color="#60A5FA" frame={frame} delay={0} />
            <FeatureBadge icon="⚡" text="Rank Above Paid Competitor Ad Listings" color="#F59E0B" frame={frame} delay={5} />
            <FeatureBadge icon="📈" text="10X Organic Patient Inquiries Every Month" color="#10B981" frame={frame} delay={10} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// --- SLIDE 5: SECRET #4 - CHATGPT & PERPLEXITY GEO (AI SEARCH) ---
const Slide5: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const badgeSpring = spring({ frame, fps, config: { damping: 12 } });
  const textOpacity = interpolate(frame, [10, 25], [0, 1], { extrapolateRight: 'clamp' });
  const floatY = Math.sin(frame / 10) * 4;

  return (
    <AbsoluteFill>
      <KenBurnsImage src={staticFile('assets/reels/whatsapp_reactivation.jpg')} frame={frame} filter="brightness(0.25) blur(6px)" startScale={1.0} endScale={1.08} />

      <AmbientMeshGradient color1="#A855F7" color2="#EC4899" frame={frame} />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(2, 6, 23, 0.98) 0%, rgba(2, 6, 23, 0.85) 100%)',
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
            backgroundColor: '#A855F7',
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: 900,
            letterSpacing: 1.5,
            width: 'fit-content',
            boxShadow: '0 4px 20px rgba(168, 85, 247, 0.4)',
          }}
        >
          SECRET #4
        </div>

        <div style={{ opacity: textOpacity, transform: `translateY(${floatY}px)` }}>
          <h2
            style={{
              fontSize: 42,
              fontWeight: 900,
              color: '#FFFFFF',
              margin: '0 0 14px 0',
              lineHeight: 1.15,
            }}
          >
            Get Recommended by <span style={{ color: '#C084FC' }}>ChatGPT &amp; Perplexity AI</span> 🤖✨
          </h2>

          <p style={{ fontSize: 20, color: '#CBD5E1', fontWeight: 700, margin: '0 0 22px 0', lineHeight: 1.35 }}>
            Optimize Clinic Schema.org data so AI Search engines recommend YOUR clinic when patients ask "Best dentist near me"!
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <FeatureBadge icon="🤖" text="Generative Engine Optimization (GEO) for Clinics" color="#C084FC" frame={frame} delay={0} />
            <FeatureBadge icon="📍" text="Top Recommendation for Local High-Ticket Dental Leads" color="#38BDF8" frame={frame} delay={5} />
            <FeatureBadge icon="🛡️" text="Build Unmatched Authority Over Competitor Practices" color="#10B981" frame={frame} delay={10} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// --- SLIDE 6: SECRET #5 & HIGH-CONVERTING CTA ---
const Slide6: React.FC<{ frame: number; fps: number; websiteUrl: string }> = ({
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
      <AmbientMeshGradient color1="#0867E8" color2="#38BDF8" frame={frame} />

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
            boxShadow: '0 8px 30px rgba(8, 103, 232, 0.25)',
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
          Turn Patient Hesitation Into <span style={{ color: '#38BDF8' }}>Instant Appointments</span> 🚀
        </h2>

        <p style={{ fontSize: 19, color: '#94A3B8', fontWeight: 600, margin: '0 0 28px 0', maxWidth: 540 }}>
          Clinaza — Embedded Patient Financing &amp; AI Practice Growth for Dentists.
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
          Partner With Clinaza Today →
        </div>

        <div style={{ fontSize: 17, color: '#10B981', fontWeight: 800, letterSpacing: 1 }}>
          ⚡ ₹0 SETUP FEE · 100% FREE FOR CLINICS · {websiteUrl}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const FeatureBadge: React.FC<{
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
        padding: '12px 16px',
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.07)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        backdropFilter: 'blur(12px)',
        transform: `translateX(${slideIn}px)`,
        opacity,
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
      }}
    >
      <span style={{ fontSize: 22 }}>{icon}</span>
      <span style={{ fontSize: 17, fontWeight: 800, color: '#F8FAFC', textAlign: 'left' }}>
        {text}
      </span>
    </div>
  );
};
