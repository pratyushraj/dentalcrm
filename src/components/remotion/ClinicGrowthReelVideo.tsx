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
      {/* SLIDE 1: VIRAL HOOK (0 - 4s) */}
      <Sequence from={0} durationInFrames={SLIDE_DURATION}>
        <Slide1 frame={frame} fps={fps} />
      </Sequence>

      {/* SLIDE 2: SECRET #1 - STOP LOSING ₹50K CASES (4 - 8s) */}
      <Sequence from={SLIDE_DURATION} durationInFrames={SLIDE_DURATION}>
        <Slide2 frame={frame - SLIDE_DURATION} fps={fps} />
      </Sequence>

      {/* SLIDE 3: SECRET #2 - UNLOCK HIDDEN FILE REVENUE (8 - 12s) */}
      <Sequence from={SLIDE_DURATION * 2} durationInFrames={SLIDE_DURATION}>
        <Slide3 frame={frame - SLIDE_DURATION * 2} fps={fps} />
      </Sequence>

      {/* SLIDE 4: SECRET #3 - DOMINATE LOCAL GOOGLE SEARCH (12 - 16s) */}
      <Sequence from={SLIDE_DURATION * 3} durationInFrames={SLIDE_DURATION}>
        <Slide4 frame={frame - SLIDE_DURATION * 3} fps={fps} />
      </Sequence>

      {/* SLIDE 5: HIGH-CONVERTING CTA (16 - 20s) */}
      <Sequence from={SLIDE_DURATION * 4} durationInFrames={SLIDE_DURATION}>
        <Slide5 frame={frame - SLIDE_DURATION * 4} fps={fps} websiteUrl={websiteUrl} />
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
          background: 'linear-gradient(to top, rgba(2, 6, 23, 0.98) 0%, rgba(2, 6, 23, 0.7) 50%, rgba(2, 6, 23, 0.5) 100%)',
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
            }}
          >
            ⚠️ DENTAL PRACTICE WARNING
          </span>
        </div>

        <div style={{ transform: `scale(${scale})`, transformOrigin: 'bottom left' }}>
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
            }}
          >
            ❌ 70% PATIENT DROP-OFF
          </div>

          <h1
            style={{
              fontSize: 46,
              fontWeight: 900,
              lineHeight: 1.15,
              margin: '0 0 20px 0',
              color: '#FFFFFF',
              textShadow: '0 4px 20px rgba(0,0,0,0.9)',
            }}
          >
            Why Are <span style={{ color: '#F87171' }}>70% of Patients Leaving</span> Your Clinic Without Treatment? ❌🦷
          </h1>

          <p style={{ fontSize: 20, color: '#CBD5E1', fontWeight: 600, lineHeight: 1.4, margin: 0 }}>
            Hint: It’s NOT your clinical skills. Here is the 3-step growth framework top clinics use to fix it!
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
          }}
        >
          SECRET #1
        </div>

        <div style={{ opacity: textOpacity }}>
          <h2
            style={{
              fontSize: 44,
              fontWeight: 900,
              color: '#FFFFFF',
              margin: '0 0 14px 0',
              lineHeight: 1.15,
            }}
          >
            Stop Losing <span style={{ color: '#10B981' }}>₹50,000+ Cases</span> at Checkout 💳
          </h2>

          <p style={{ fontSize: 21, color: '#CBD5E1', fontWeight: 700, margin: '0 0 24px 0', lineHeight: 1.35 }}>
            Patients say NO to Implants &amp; Aligners because they can't pay ₹50k upfront. Offer Point-of-Care Monthly EMIs!
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <FeatureBadge icon="✅" text="₹0 Upfront Setup Fee for Dental Clinics" color="#10B981" />
            <FeatureBadge icon="🏦" text="Funded by RBI-Regulated Banks & NBFCs" color="#38BDF8" />
            <FeatureBadge icon="📲" text="2-Minute Soft Digital Pre-Check at Front Desk" color="#F59E0B" />
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
          }}
        >
          SECRET #2
        </div>

        <div style={{ opacity: textOpacity }}>
          <h2
            style={{
              fontSize: 44,
              fontWeight: 900,
              color: '#FFFFFF',
              margin: '0 0 14px 0',
              lineHeight: 1.15,
            }}
          >
            Unlock <span style={{ color: '#25D366' }}>₹2-5 Lakhs Hidden</span> in Old Patient Files 💬
          </h2>

          <p style={{ fontSize: 21, color: '#CBD5E1', fontWeight: 700, margin: '0 0 24px 0', lineHeight: 1.35 }}>
            Automate WhatsApp 6-Month Recall &amp; Cleaning Reminders — Recover 30%+ Dormant Patients on Autopilot!
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <FeatureBadge icon="🔔" text="Automated WhatsApp Recall & Cleaning Reminders" color="#25D366" />
            <FeatureBadge icon="🗓️" text="Zero No-Shows with Instant 1-Click Confirmations" color="#38BDF8" />
            <FeatureBadge icon="📈" text="Fill Empty Chair Slots Every Single Week" color="#F59E0B" />
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
            backgroundColor: '#F59E0B',
            color: '#FFFFFF',
            fontSize: 16,
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
              fontSize: 44,
              fontWeight: 900,
              color: '#FFFFFF',
              margin: '0 0 14px 0',
              lineHeight: 1.15,
            }}
          >
            Dominate <span style={{ color: '#F59E0B' }}>Google Search in Your City</span> ⭐⭐⭐⭐⭐
          </h2>

          <p style={{ fontSize: 21, color: '#CBD5E1', fontWeight: 700, margin: '0 0 24px 0', lineHeight: 1.35 }}>
            92% of new patients check Google reviews before booking. Automate post-checkout review requests!
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <FeatureBadge icon="⭐" text="Auto-Trigger 5-Star Google Review Requests" color="#F59E0B" />
            <FeatureBadge icon="🏆" text="Outrank Nearby Competitor Dental Clinics" color="#38BDF8" />
            <FeatureBadge icon="🎯" text="Attract High-Paying Organic Patient Consults" color="#10B981" />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// --- SLIDE 5: HIGH-CONVERTING CTA ---
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
        padding: INSTA_SAFE_PADDING,
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
          background: 'radial-gradient(circle, rgba(8, 103, 232, 0.35) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

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
            marginBottom: 24,
          }}
        >
          <span style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF', letterSpacing: 2 }}>
            CLIN<span style={{ color: '#0867E8' }}>AZA</span>
          </span>
        </div>

        <h2
          style={{
            fontSize: 44,
            fontWeight: 900,
            color: '#FFFFFF',
            lineHeight: 1.15,
            margin: '0 0 16px 0',
          }}
        >
          Turn Patient Hesitation Into <span style={{ color: '#38BDF8' }}>Instant Appointments</span> 🚀
        </h2>

        <p style={{ fontSize: 20, color: '#94A3B8', fontWeight: 600, margin: '0 0 32px 0', maxWidth: 540 }}>
          Clinaza — Embedded Patient Financing &amp; Automated Practice Growth for Dentists.
        </p>

        <div
          style={{
            transform: `scale(${buttonPulse})`,
            display: 'inline-block',
            padding: '20px 48px',
            borderRadius: 22,
            background: 'linear-gradient(135deg, #0867E8 0%, #0756C7 100%)',
            color: '#FFFFFF',
            fontSize: 22,
            fontWeight: 900,
            boxShadow: '0 12px 40px rgba(8, 103, 232, 0.4)',
            letterSpacing: 1,
            marginBottom: 24,
          }}
        >
          Partner With Clinaza Today →
        </div>

        <div style={{ fontSize: 18, color: '#10B981', fontWeight: 800, letterSpacing: 1 }}>
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
      gap: 14,
      padding: '14px 18px',
      borderRadius: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.06)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
    }}
  >
    <span style={{ fontSize: 24 }}>{icon}</span>
    <span style={{ fontSize: 18, fontWeight: 800, color: '#F8FAFC', textAlign: 'left' }}>
      {text}
    </span>
  </div>
);
