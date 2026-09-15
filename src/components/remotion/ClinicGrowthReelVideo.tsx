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
  title: '3 Secrets to 3X Your Dental Clinic Revenue in 2026 🦷🚀',
  websiteUrl: 'clinaza.in',
};

export const ClinicGrowthReelComposition: React.FC<ClinicGrowthReelProps> = ({
  websiteUrl = 'clinaza.in',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slide duration: 120 frames (4 seconds per slide, 5 slides total = 600 frames / 20s)
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
      {/* SLIDE 1: HOOK (0 - 4s) */}
      <Sequence from={0} durationInFrames={SLIDE_DURATION}>
        <Slide1 frame={frame} fps={fps} />
      </Sequence>

      {/* SLIDE 2: SECRET #1 - PATIENT EMI (4 - 8s) */}
      <Sequence from={SLIDE_DURATION} durationInFrames={SLIDE_DURATION}>
        <Slide2 frame={frame - SLIDE_DURATION} fps={fps} />
      </Sequence>

      {/* SLIDE 3: SECRET #2 - WHATSAPP REACTIVATION (8 - 12s) */}
      <Sequence from={SLIDE_DURATION * 2} durationInFrames={SLIDE_DURATION}>
        <Slide3 frame={frame - SLIDE_DURATION * 2} fps={fps} />
      </Sequence>

      {/* SLIDE 4: SECRET #3 - GOOGLE REVIEWS (12 - 16s) */}
      <Sequence from={SLIDE_DURATION * 3} durationInFrames={SLIDE_DURATION}>
        <Slide4 frame={frame - SLIDE_DURATION * 3} fps={fps} />
      </Sequence>

      {/* SLIDE 5: CTA (16 - 20s) */}
      <Sequence from={SLIDE_DURATION * 4} durationInFrames={SLIDE_DURATION}>
        <Slide5 frame={frame - SLIDE_DURATION * 4} fps={fps} websiteUrl={websiteUrl} />
      </Sequence>
    </AbsoluteFill>
  );
};

// --- SLIDE 1: HOOK ---
const Slide1: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const scale = spring({ frame, fps, config: { damping: 14 } });
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const imgScale = interpolate(frame, [0, 120], [1, 1.08], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ opacity }}>
      <Img
        src={staticFile('assets/reels/clinic_growth_hero.jpg')}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${imgScale})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(2, 6, 23, 0.95) 0%, rgba(2, 6, 23, 0.6) 50%, rgba(2, 6, 23, 0.4) 100%)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          padding: '80px 48px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span
            style={{
              padding: '10px 22px',
              borderRadius: 999,
              backgroundColor: 'rgba(8, 103, 232, 0.25)',
              border: '1.5px solid #0867E8',
              fontSize: 16,
              fontWeight: 800,
              color: '#38BDF8',
              letterSpacing: 1,
            }}
          >
            CLINAZA PRACTICE INSIGHTS
          </span>
        </div>

        <div style={{ transform: `scale(${scale})`, transformOrigin: 'bottom left' }}>
          <div
            style={{
              display: 'inline-block',
              padding: '8px 18px',
              borderRadius: 12,
              backgroundColor: '#FF6B1A',
              color: '#FFFFFF',
              fontSize: 18,
              fontWeight: 900,
              marginBottom: 20,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            🔥 CLINIC GROWTH GUIDE
          </div>

          <h1
            style={{
              fontSize: 54,
              fontWeight: 900,
              lineHeight: 1.15,
              margin: '0 0 24px 0',
              color: '#FFFFFF',
              textShadow: '0 4px 20px rgba(0,0,0,0.8)',
            }}
          >
            3 Secrets to <span style={{ color: '#38BDF8' }}>3X Your Dental Clinic</span> Revenue in 2026 🦷🚀
          </h1>

          <p style={{ fontSize: 22, color: '#94A3B8', fontWeight: 600, lineHeight: 1.4, margin: 0 }}>
            How top dental surgeons in India convert 80%+ of high-ticket treatment plans effortlessly.
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
  const imgScale = interpolate(frame, [0, 120], [1, 1.06]);

  return (
    <AbsoluteFill>
      <Img
        src={staticFile('assets/reels/patient_emi_tablet.jpg')}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${imgScale})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(2, 6, 23, 0.96) 0%, rgba(2, 6, 23, 0.7) 45%, rgba(2, 6, 23, 0.4) 100%)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          padding: '80px 48px',
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
            padding: '12px 24px',
            borderRadius: 999,
            backgroundColor: '#0867E8',
            color: '#FFFFFF',
            fontSize: 18,
            fontWeight: 900,
            letterSpacing: 1.5,
            width: 'fit-content',
          }}
        >
          SECRET #1
        </div>

        <div style={{ opacity: textOpacity }}>
          <h2
            style={{
              fontSize: 48,
              fontWeight: 900,
              color: '#FFFFFF',
              margin: '0 0 16px 0',
              lineHeight: 1.15,
            }}
          >
            Offer Point-of-Care <span style={{ color: '#10B981' }}>Patient EMI Financing</span> 💳
          </h2>

          <p style={{ fontSize: 24, color: '#CBD5E1', fontWeight: 700, margin: '0 0 32px 0', lineHeight: 1.35 }}>
            Convert ₹50,000+ treatment hesitations (implants, aligners, crowns) into instant monthly EMIs!
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <FeatureBadge icon="✅" text="₹0 Upfront Setup Fee for Dental Clinics" color="#10B981" />
            <FeatureBadge icon="🏦" text="Funded by RBI-Regulated Banks & NBFCs" color="#38BDF8" />
            <FeatureBadge icon="📲" text="2-Minute Soft Digital KYC at Checkout" color="#F59E0B" />
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
  const imgScale = interpolate(frame, [0, 120], [1, 1.06]);

  return (
    <AbsoluteFill>
      <Img
        src={staticFile('assets/reels/whatsapp_reactivation.jpg')}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${imgScale})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(2, 6, 23, 0.96) 0%, rgba(2, 6, 23, 0.7) 45%, rgba(2, 6, 23, 0.4) 100%)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          padding: '80px 48px',
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
            padding: '12px 24px',
            borderRadius: 999,
            backgroundColor: '#25D366',
            color: '#FFFFFF',
            fontSize: 18,
            fontWeight: 900,
            letterSpacing: 1.5,
            width: 'fit-content',
          }}
        >
          SECRET #2
        </div>

        <div style={{ opacity: textOpacity }}>
          <h2
            style={{
              fontSize: 48,
              fontWeight: 900,
              color: '#FFFFFF',
              margin: '0 0 16px 0',
              lineHeight: 1.15,
            }}
          >
            Automate <span style={{ color: '#25D366' }}>WhatsApp Patient Reactivation</span> 💬
          </h2>

          <p style={{ fontSize: 24, color: '#CBD5E1', fontWeight: 700, margin: '0 0 32px 0', lineHeight: 1.35 }}>
            Recover <span style={{ color: '#25D366' }}>30%+ of dormant patient records</span> on 100% autopilot!
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <FeatureBadge icon="🔔" text="Automated 6-Month Recall & Cleaning Reminders" color="#25D366" />
            <FeatureBadge icon="🗓️" text="Zero No-Shows with Instant WhatsApp Confirmations" color="#38BDF8" />
            <FeatureBadge icon="📈" text="Fill Empty Slot Gaps Every Single Week" color="#F59E0B" />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// --- SLIDE 4: SECRET #3 ---
const Slide4: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const badgeSpring = spring({ frame, fps, config: { damping: 12 } });
  const textOpacity = interpolate(frame, [10, 25], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill>
      <Img
        src={staticFile('assets/reels/clinic_growth_hero.jpg')}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'brightness(0.35) blur(4px)',
        }}
      />
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
          padding: '80px 48px',
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
            padding: '12px 24px',
            borderRadius: 999,
            backgroundColor: '#F59E0B',
            color: '#FFFFFF',
            fontSize: 18,
            fontWeight: 900,
            letterSpacing: 1.5,
            width: 'fit-content',
          }}
        >
          SECRET #3
        </div>

        <div style={{ opacity: textOpacity }}>
          <h2
            style={{
              fontSize: 48,
              fontWeight: 900,
              color: '#FFFFFF',
              margin: '0 0 16px 0',
              lineHeight: 1.15,
            }}
          >
            Automated <span style={{ color: '#F59E0B' }}>5-Star Google Reviews</span> ⭐⭐⭐⭐⭐
          </h2>

          <p style={{ fontSize: 24, color: '#CBD5E1', fontWeight: 700, margin: '0 0 32px 0', lineHeight: 1.35 }}>
            Dominate Google Search in your city and build unmatched local clinical trust.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <FeatureBadge icon="⭐" text="Auto-Send Google Review Request After Checkout" color="#F59E0B" />
            <FeatureBadge icon="🏆" text="Outrank Nearby Competitor Dental Clinics" color="#38BDF8" />
            <FeatureBadge icon="🎯" text="Attract High-Paying Organic Patients Monthly" color="#10B981" />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// --- SLIDE 5: CTA ---
const Slide5: React.FC<{ frame: number; fps: number; websiteUrl: string }> = ({
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
        padding: '60px 48px',
        textAlign: 'center',
      }}
    >
      {/* Background Glowing Orb */}
      <div
        style={{
          position: 'absolute',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(8, 103, 232, 0.3) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      <div style={{ transform: `scale(${logoScale})`, zIndex: 10 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 28px',
            borderRadius: 20,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            marginBottom: 32,
          }}
        >
          <span style={{ fontSize: 28, fontWeight: 900, color: '#FFFFFF', letterSpacing: 2 }}>
            CLIN<span style={{ color: '#0867E8' }}>AZA</span>
          </span>
        </div>

        <h2
          style={{
            fontSize: 52,
            fontWeight: 900,
            color: '#FFFFFF',
            lineHeight: 1.15,
            margin: '0 0 20px 0',
          }}
        >
          Ready to <span style={{ color: '#38BDF8' }}>3X Your Dental Practice</span>?
        </h2>

        <p style={{ fontSize: 22, color: '#94A3B8', fontWeight: 600, margin: '0 0 40px 0', maxWidth: 600 }}>
          Join 300+ leading dental clinics offering instant patient EMI financing &amp; automated growth.
        </p>

        <div
          style={{
            transform: `scale(${buttonPulse})`,
            display: 'inline-block',
            padding: '24px 56px',
            borderRadius: 24,
            background: 'linear-gradient(135deg, #0867E8 0%, #0756C7 100%)',
            color: '#FFFFFF',
            fontSize: 26,
            fontWeight: 900,
            boxShadow: '0 12px 40px rgba(8, 103, 232, 0.4)',
            letterSpacing: 1,
            marginBottom: 28,
          }}
        >
          Partner With Clinaza Today →
        </div>

        <div style={{ fontSize: 20, color: '#10B981', fontWeight: 800, letterSpacing: 1 }}>
          ⚡ ₹0 SETUP FEE · 100% FREE FOR CLINICS · {websiteUrl}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const FeatureBadge: React.FC<{ icon: string; text: string; color: string }> = ({
  icon,
  text,
  color,
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '16px 20px',
      borderRadius: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.06)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
    }}
  >
    <span style={{ fontSize: 26 }}>{icon}</span>
    <span style={{ fontSize: 20, fontWeight: 800, color: '#F8FAFC', textAlign: 'left' }}>
      {text}
    </span>
  </div>
);
