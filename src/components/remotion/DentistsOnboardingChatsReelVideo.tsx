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
// CLINAZA INSTAGRAM REEL: DENTISTS ONBOARDING & REAL WHATSAPP SOCIAL PROOF
// Dimensions: 1080 x 1920 (9:16 Portrait) | Duration: 30s (900 Frames @ 30 FPS)
// Showcasing real dentist WhatsApp messages regarding clinic onboarding
// =========================================================================

export interface DentistsOnboardingChatsProps {
  totalClinicsCount?: number;
  highlightCities?: string;
  websiteUrl?: string;
}

export const dentistsOnboardingDefaults: DentistsOnboardingChatsProps = {
  totalClinicsCount: 195,
  highlightCities: 'Gurugram • Bengaluru • Vizag • Bhopal • Jodhpur • Patna',
  websiteUrl: 'clinaza.in',
};

export const DentistsOnboardingChatsReelVideo: React.FC<DentistsOnboardingChatsProps> = ({
  totalClinicsCount = 195,
  highlightCities = 'Gurugram • Bengaluru • Vizag • Bhopal • Jodhpur • Patna',
  websiteUrl = 'clinaza.in',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Floating background subtle drift
  const bgScale = interpolate(frame, [0, 900], [1.02, 1.12], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#020617',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', 'Segoe UI', Roboto, sans-serif",
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
          opacity: 0.16,
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

      {/* ── Gradient Overlay for Maximum Text Contrast ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(2, 6, 23, 0.94) 0%, rgba(2, 6, 23, 0.88) 40%, rgba(2, 6, 23, 0.96) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Ambient Radial Glows (Clinaza Blue & Emerald) ── */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          left: -80,
          width: 750,
          height: 750,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(8, 103, 232, 0.35) 0%, rgba(2, 6, 23, 0) 70%)',
          filter: 'blur(90px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 200,
          right: -100,
          width: 800,
          height: 800,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, rgba(2, 6, 23, 0) 70%)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Top Bar: Prominent Clinaza Logo + Brand Identity ── */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Img
            src={staticFile('assets/clinaza-logo.jpg')}
            style={{
              width: 68,
              height: 68,
              borderRadius: 18,
              objectFit: 'cover',
              boxShadow: '0 8px 24px rgba(8, 103, 232, 0.45)',
              border: '2px solid rgba(255, 255, 255, 0.25)',
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 32, fontWeight: 900, letterSpacing: '0.04em', color: '#FFFFFF' }}>
                CLINAZA
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  background: 'rgba(8, 103, 232, 0.25)',
                  color: '#38BDF8',
                  padding: '4px 10px',
                  borderRadius: 8,
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                }}
              >
                DOCTOR ONBOARDING
              </span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#94A3B8', marginTop: 2 }}>
              Point-of-Care Patient Healthcare Financing
            </div>
          </div>
        </div>

        {/* Live Active Batch Pill */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1.5px solid rgba(51, 65, 85, 0.8)',
            padding: '10px 18px',
            borderRadius: 30,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          }}
        >
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: '#10B981',
              boxShadow: '0 0 12px #10B981',
            }}
          />
          <span style={{ fontSize: 16, fontWeight: 800, color: '#F1F5F9', letterSpacing: '0.02em' }}>
            {totalClinicsCount}+ Clinics Live
          </span>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* SCENE 1: THE HOOK & INCOMING CHAT BATCH (Frames 0 - 150 = 0s to 5.0s) */}
      {/* ===================================================================== */}
      <Sequence from={0} durationInFrames={155}>
        <Scene1Hook fps={fps} />
      </Sequence>

      {/* ===================================================================== */}
      {/* SCENE 2: DR. SIDDARDHA & THE ACRYLIC STANDEE (Frames 150 - 390 = 5s - 13s) */}
      {/* ===================================================================== */}
      <Sequence from={150} durationInFrames={245}>
        <Scene2StandeeAndChats fps={fps} />
      </Sequence>

      {/* ===================================================================== */}
      {/* SCENE 3: PAPERLESS KYC & RECOURSE (Frames 390 - 630 = 13s - 21s)     */}
      {/* ===================================================================== */}
      <Sequence from={390} durationInFrames={245}>
        <Scene3PaperlessKYC fps={fps} />
      </Sequence>

      {/* ===================================================================== */}
      {/* SCENE 4: THE 3 CORE CLINAZA GUARANTEES (Frames 630 - 780 = 21s - 26s) */}
      {/* ===================================================================== */}
      <Sequence from={630} durationInFrames={155}>
        <Scene4Guarantees fps={fps} />
      </Sequence>

      {/* ===================================================================== */}
      {/* SCENE 5: FINAL CALL TO ACTION (Frames 780 - 900 = 26s - 30s)         */}
      {/* ===================================================================== */}
      <Sequence from={780} durationInFrames={120}>
        <Scene5CallToAction fps={fps} websiteUrl={websiteUrl} />
      </Sequence>

      {/* ── Bottom Safe-Zone Footer Badge ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 45,
          left: 50,
          right: 50,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 40,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#94A3B8' }}>
            Official Desk:
          </span>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#38BDF8' }}>
            @clinaza.in
          </span>
        </div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 800,
            color: '#CBD5E1',
            background: 'rgba(255,255,255,0.08)',
            padding: '6px 14px',
            borderRadius: 20,
            border: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          {highlightCities}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 1: The Hook & Incoming Chat Batch ──────────────────────────────────
const Scene1Hook: React.FC<{ fps: number }> = ({ fps }) => {
  const frame = useCurrentFrame();

  const titleScale = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  const badgeSlide = spring({
    frame: frame - 6,
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  // Staggered chat notification pills
  const notif1 = spring({ frame: frame - 22, fps, config: { damping: 13, stiffness: 105 } });
  const notif2 = spring({ frame: frame - 42, fps, config: { damping: 13, stiffness: 105 } });
  const notif3 = spring({ frame: frame - 62, fps, config: { damping: 13, stiffness: 105 } });
  const footerPop = spring({ frame: frame - 82, fps, config: { damping: 14, stiffness: 100 } });

  return (
    <div
      style={{
        position: 'absolute',
        top: 180,
        left: 50,
        right: 50,
        bottom: 120,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 26,
      }}
    >
      {/* Upper Section: Hook and Pain Point */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        {/* Category Pill */}
        <div
          style={{
            transform: `translateY(${interpolate(badgeSlide, [0, 1], [-25, 0])}px)`,
            opacity: badgeSlide,
            background: 'rgba(8, 103, 232, 0.22)',
            border: '1.5px solid rgba(56, 189, 248, 0.5)',
            borderRadius: 30,
            padding: '10px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 20,
          }}
        >
          <span style={{ fontSize: 24 }}>💬</span>
          <span style={{ fontSize: 20, fontWeight: 900, color: '#38BDF8', letterSpacing: '0.04em' }}>
            WHAT DENTAL CLINIC DIRECTORS ARE ASKING
          </span>
        </div>

        {/* Main Hook Headline */}
        <h1
          style={{
            transform: `scale(${titleScale})`,
            fontSize: 58,
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: '-0.025em',
            color: '#FFFFFF',
            textAlign: 'center',
            margin: 0,
            maxWidth: 960,
            textShadow: '0 4px 30px rgba(0,0,0,0.8)',
          }}
        >
          Why Are <span style={{ color: '#38BDF8' }}>195+ Dental Clinics</span> Texting Us Every Single Week?
        </h1>

        {/* Pain Point Quote Card */}
        <div
          style={{
            marginTop: 24,
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
            border: '2px solid rgba(56, 189, 248, 0.35)',
            borderRadius: 24,
            padding: '24px 32px',
            maxWidth: 960,
            width: '100%',
            boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 26, fontWeight: 800, color: '#F8FAFC', lineHeight: 1.35 }}>
            "How do we stop patients delaying <span style={{ color: '#FCD34D' }}>₹50,000–₹1,50,000</span> treatments chairside without offering discounts or risky clinic debt?"
          </div>
        </div>
      </div>

      {/* Middle Section: Real WhatsApp Inquiries Streaming In */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          🔔 Live WhatsApp Inquiries From Clinics:
        </div>

        {/* Notification 1: Dr. Priyanka */}
        <div
          style={{
            transform: `translateY(${interpolate(notif1, [0, 1], [40, 0])}px)`,
            opacity: notif1,
            background: 'rgba(15, 23, 42, 0.94)',
            border: '2px solid rgba(8, 103, 232, 0.55)',
            borderRadius: 20,
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 10px 28px rgba(0,0,0,0.4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0867E8, #38BDF8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                fontWeight: 900,
              }}
            >
              PK
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#FFF' }}>Dr. Priyanka Kumar • Exldentists (Gurugram)</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#38BDF8', marginTop: 4 }}>
                "We are ready to activate Pine Labs patient EMI gateway for implants & aligners."
              </div>
            </div>
          </div>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#10B981', background: 'rgba(16, 185, 129, 0.15)', padding: '6px 14px', borderRadius: 12 }}>
            Just Now
          </span>
        </div>

        {/* Notification 2: Dr. Siddardha */}
        <div
          style={{
            transform: `translateY(${interpolate(notif2, [0, 1], [40, 0])}px)`,
            opacity: notif2,
            background: 'rgba(15, 23, 42, 0.94)',
            border: '2px solid rgba(16, 185, 129, 0.55)',
            borderRadius: 20,
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 10px 28px rgba(0,0,0,0.4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10B981, #059669)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                fontWeight: 900,
              }}
            >
              SC
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#FFF' }}>Dr. V. Siddardha Chaitanya • Vasantha Dental (Vizag)</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#34D399', marginTop: 4 }}>
                "Can we activate reception EMI checkout today? 10–15 high-ticket cases queued up."
              </div>
            </div>
          </div>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#10B981', background: 'rgba(16, 185, 129, 0.15)', padding: '6px 14px', borderRadius: 12 }}>
            2m ago
          </span>
        </div>

        {/* Notification 3: Dr. Dushyant */}
        <div
          style={{
            transform: `translateY(${interpolate(notif3, [0, 1], [40, 0])}px)`,
            opacity: notif3,
            background: 'rgba(15, 23, 42, 0.94)',
            border: '2px solid rgba(245, 158, 11, 0.55)',
            borderRadius: 20,
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 10px 28px rgba(0,0,0,0.4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                fontWeight: 900,
              }}
            >
              DS
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#FFF' }}>Dr. Dushyant Soni • Impressions Dental (Jodhpur)</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#FCD34D', marginTop: 4 }}>
                "Uploaded Aadhaar, PAN & Udyam certificate. When does checkout go live?"
              </div>
            </div>
          </div>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#10B981', background: 'rgba(16, 185, 129, 0.15)', padding: '6px 14px', borderRadius: 12 }}>
            5m ago
          </span>
        </div>
      </div>

      {/* Bottom Section: Network Scale Strip */}
      <div
        style={{
          width: '100%',
          transform: `scale(${footerPop})`,
          opacity: footerPop,
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1.5px solid rgba(255, 255, 255, 0.15)',
          borderRadius: 22,
          padding: '20px 32px',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#10B981' }}>100%</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#94A3B8' }}>Upfront T+1 Payout</div>
        </div>
        <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.15)' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#38BDF8' }}>0%</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#94A3B8' }}>Clinic Risk / Recourse</div>
        </div>
        <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.15)' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#FCD34D' }}>55+</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#94A3B8' }}>Partner Banks & NBFCs</div>
        </div>
      </div>
    </div>
  );
};

// ── Scene 2: Dr. Siddardha, Real Chat & The Physical Acrylic Standee ─────────
const Scene2StandeeAndChats: React.FC<{ fps: number }> = ({ fps }) => {
  const frame = useCurrentFrame();

  const chatSlide = spring({ frame: frame - 5, fps, config: { damping: 13, stiffness: 100 } });
  const standeePop = spring({ frame: frame - 30, fps, config: { damping: 12, stiffness: 90 } });

  return (
    <div
      style={{
        position: 'absolute',
        top: 180,
        left: 50,
        right: 50,
        bottom: 120,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 24,
      }}
    >
      {/* WhatsApp Chat Simulation Container */}
      <div
        style={{
          transform: `translateY(${interpolate(chatSlide, [0, 1], [-25, 0])}px)`,
          opacity: chatSlide,
          background: 'rgba(15, 23, 42, 0.96)',
          border: '2px solid rgba(16, 185, 129, 0.55)',
          borderRadius: 24,
          padding: '24px 28px',
          boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
        }}
      >
        {/* WhatsApp Doctor Profile Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10B981, #059669)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                fontWeight: 900,
                color: '#FFF',
              }}
            >
              SC
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#FFFFFF' }}>Dr. V. Siddardha Chaitanya</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#94A3B8' }}>
                Vasantha Dental Clinic • Visakhapatnam • <span style={{ color: '#10B981' }}>Online</span>
              </div>
            </div>
          </div>
          <span style={{ fontSize: 14, fontWeight: 800, background: '#10B981', color: '#FFF', padding: '6px 16px', borderRadius: 14 }}>
            10-15 CASES / MO
          </span>
        </div>

        {/* Incoming Doctor Message Bubble */}
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.95)',
            borderLeft: '5px solid #10B981',
            padding: '18px 22px',
            borderRadius: '0 16px 16px 16px',
            fontSize: 22,
            fontWeight: 800,
            color: '#F8FAFC',
            lineHeight: 1.35,
            marginBottom: 16,
            maxWidth: '94%',
          }}
        >
          💬 "Can we activate reception EMI checkout today? We have 10–15 high-ticket cases queued up this week."
          <div style={{ fontSize: 14, fontWeight: 700, color: '#94A3B8', textAlign: 'right', marginTop: 8 }}>10:34 AM ✓✓</div>
        </div>

        {/* Outgoing Clinaza Response Bubble */}
        <div
          style={{
            background: 'rgba(8, 103, 232, 0.35)',
            borderRight: '5px solid #38BDF8',
            padding: '18px 22px',
            borderRadius: '16px 0 16px 16px',
            fontSize: 22,
            fontWeight: 800,
            color: '#E0F2FE',
            lineHeight: 1.35,
            marginLeft: 'auto',
            maxWidth: '94%',
          }}
        >
          ⚡ "Doctor KYC approved! Your instant WhatsApp payment link and front-desk digital checkout portal are live right now."
          <div style={{ fontSize: 14, fontWeight: 700, color: '#38BDF8', textAlign: 'right', marginTop: 8 }}>10:36 AM ✓✓</div>
        </div>
      </div>

      {/* Tangible Proof: Digital Checkout Portal Showcase */}
      <div
        style={{
          transform: `scale(${standeePop})`,
          opacity: standeePop,
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.96) 0%, rgba(30, 41, 59, 0.94) 100%)',
          border: '2px solid rgba(56, 189, 248, 0.5)',
          borderRadius: 24,
          padding: '24px 30px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.65)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            marginBottom: 14,
          }}
        >
          <span
            style={{
              fontSize: 15,
              fontWeight: 800,
              background: 'rgba(16, 185, 129, 0.2)',
              color: '#34D399',
              padding: '8px 18px',
              borderRadius: 14,
              border: '1px solid rgba(16, 185, 129, 0.4)',
            }}
          >
            ⚡ 100% DIGITAL POINT-OF-CARE CHECKOUT
          </span>

          <span
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: '#CBD5E1',
              background: 'rgba(255,255,255,0.08)',
              padding: '6px 14px',
              borderRadius: 12,
            }}
          >
            Live on Mobile & Reception Screen
          </span>
        </div>

        {/* Digital Checkout Image Display */}
        <div
          style={{
            width: '100%',
            height: 480,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle, rgba(8, 103, 232, 0.2) 0%, rgba(0,0,0,0) 70%)',
          }}
        >
          <Img
            src={staticFile('assets/og-checkout-flow.png')}
            style={{
              maxHeight: '100%',
              maxWidth: '92%',
              objectFit: 'contain',
              borderRadius: 16,
              filter: 'drop-shadow(0 25px 40px rgba(0,0,0,0.8))',
            }}
          />
        </div>

        {/* Feature Pills Under Standee */}
        <div
          style={{
            marginTop: 18,
            display: 'flex',
            gap: 16,
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <div
            style={{
              flex: 1,
              background: 'rgba(8, 103, 232, 0.25)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              borderRadius: 16,
              padding: '14px 18px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 900, color: '#38BDF8' }}>Pine Labs Plural</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#94A3B8', marginTop: 2 }}>Multi-Bank Credit/Debit EMI</div>
          </div>

          <div
            style={{
              flex: 1,
              background: 'rgba(16, 185, 129, 0.25)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: 16,
              padding: '14px 18px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 900, color: '#34D399' }}>T+1 Settlements</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#94A3B8', marginTop: 2 }}>Direct to Clinic Current A/c</div>
          </div>

          <div
            style={{
              flex: 1,
              background: 'rgba(245, 158, 11, 0.25)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              borderRadius: 16,
              padding: '14px 18px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 900, color: '#FCD34D' }}>0% Recourse</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#94A3B8', marginTop: 2 }}>Zero Clinic Default Risk</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Scene 3: Paperless KYC & Dr. Dushyant Soni / Dr. Amitha ─────────────────
const Scene3PaperlessKYC: React.FC<{ fps: number }> = ({ fps }) => {
  const frame = useCurrentFrame();

  const card1 = spring({ frame: frame - 5, fps, config: { damping: 13, stiffness: 100 } });
  const card2 = spring({ frame: frame - 35, fps, config: { damping: 13, stiffness: 100 } });
  const timelinePop = spring({ frame: frame - 65, fps, config: { damping: 14, stiffness: 95 } });

  return (
    <div
      style={{
        position: 'absolute',
        top: 180,
        left: 50,
        right: 50,
        bottom: 120,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 24,
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <span
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: '#38BDF8',
            background: 'rgba(8, 103, 232, 0.25)',
            padding: '6px 20px',
            borderRadius: 20,
            border: '1px solid rgba(56, 189, 248, 0.4)',
          }}
        >
          2-MINUTE PAPERLESS ONBOARDING
        </span>
        <h2 style={{ fontSize: 50, fontWeight: 900, color: '#FFFFFF', margin: '12px 0 0 0' }}>
          Send 3 Documents on WhatsApp
        </h2>
      </div>

      {/* Card 1: Dr. Dushyant Soni (Jodhpur) with Attached KYC PDFs */}
      <div
        style={{
          transform: `scale(${card1})`,
          opacity: card1,
          background: 'rgba(15, 23, 42, 0.95)',
          border: '2px solid rgba(245, 158, 11, 0.45)',
          borderRadius: 24,
          padding: '24px 28px',
          boxShadow: '0 12px 36px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                fontWeight: 900,
              }}
            >
              DS
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF' }}>Dr. Dushyant Soni</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#94A3B8' }}>Impressions Dental Clinic • Jodhpur, Rajasthan</div>
            </div>
          </div>
          <span style={{ fontSize: 14, fontWeight: 800, background: '#F59E0B', color: '#000', padding: '6px 14px', borderRadius: 12 }}>
            HDFC LINKED
          </span>
        </div>

        {/* PDF Attachment Simulation */}
        <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
          <div
            style={{
              flex: 1,
              background: 'rgba(30, 41, 59, 0.9)',
              border: '1.5px solid rgba(239, 68, 68, 0.5)',
              borderRadius: 14,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <span style={{ fontSize: 28 }}>📄</span>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#FFF' }}>dushyant_aadhar.pdf</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#10B981' }}>Verified ✓</div>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              background: 'rgba(30, 41, 59, 0.9)',
              border: '1.5px solid rgba(239, 68, 68, 0.5)',
              borderRadius: 14,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <span style={{ fontSize: 28 }}>📄</span>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#FFF' }}>dr_pan_card.pdf</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#10B981' }}>Verified ✓</div>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              background: 'rgba(30, 41, 59, 0.9)',
              border: '1.5px solid rgba(239, 68, 68, 0.5)',
              borderRadius: 14,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <span style={{ fontSize: 28 }}>📄</span>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#FFF' }}>udyam_cert.pdf</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#10B981' }}>Verified ✓</div>
            </div>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(30, 41, 59, 0.8)',
            borderLeft: '5px solid #F59E0B',
            padding: '16px 20px',
            borderRadius: '0 16px 16px 0',
            fontSize: 21,
            fontWeight: 800,
            color: '#F8FAFC',
            lineHeight: 1.35,
          }}
        >
          💬 "Uploaded our Aadhaar, PAN, and Udyam certificate. When does front-desk checkout go live for patient EMIs?"
        </div>
      </div>

      {/* Card 2: Dr. Amitha & Dr. Kevin (Bengaluru) */}
      <div
        style={{
          transform: `scale(${card2})`,
          opacity: card2,
          background: 'rgba(15, 23, 42, 0.95)',
          border: '2px solid rgba(14, 165, 233, 0.5)',
          borderRadius: 24,
          padding: '24px 28px',
          boxShadow: '0 12px 36px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0EA5E9, #0284C7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                fontWeight: 900,
              }}
            >
              AG
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF' }}>Dr. Amitha G & Dr. Kevin</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#94A3B8' }}>Dr. Amitha Family Dental Care • Bengaluru</div>
            </div>
          </div>
          <span style={{ fontSize: 14, fontWeight: 800, background: '#0EA5E9', color: '#FFF', padding: '6px 14px', borderRadius: 12 }}>
            KPME REGISTERED
          </span>
        </div>
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.8)',
            borderLeft: '5px solid #0EA5E9',
            padding: '16px 20px',
            borderRadius: '0 16px 16px 0',
            fontSize: 21,
            fontWeight: 800,
            color: '#F8FAFC',
            lineHeight: 1.35,
          }}
        >
          💬 "KPME license & doctor PAN submitted. We see 25+ cases/month waiting for monthly EMI options at reception."
        </div>
      </div>

      {/* Timeline Strip (Fills Vertical Screen) */}
      <div
        style={{
          transform: `scale(${timelinePop})`,
          opacity: timelinePop,
          background: 'linear-gradient(135deg, rgba(8, 103, 232, 0.2) 0%, rgba(16, 185, 129, 0.18) 100%)',
          border: '1.5px solid rgba(56, 189, 248, 0.4)',
          borderRadius: 22,
          padding: '22px 30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 36 }}>⚡</div>
          <div>
            <div style={{ fontSize: 21, fontWeight: 900, color: '#FFFFFF' }}>Zero Doctor Recourse Guarantee</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#CBD5E1', marginTop: 3 }}>
              If a patient defaults, partner banks absorb 100% credit risk. Clinic keeps 100% upfront fees.
            </div>
          </div>
        </div>
        <span style={{ fontSize: 15, fontWeight: 900, color: '#10B981', background: 'rgba(16, 185, 129, 0.25)', padding: '8px 16px', borderRadius: 14, border: '1px solid rgba(16, 185, 129, 0.4)' }}>
          100% T+1 Payout
        </span>
      </div>
    </div>
  );
};

// ── Scene 4: The 3 Core Guarantees ───────────────────────────────────────────
const Scene4Guarantees: React.FC<{ fps: number }> = ({ fps }) => {
  const frame = useCurrentFrame();

  const anim = spring({ frame: frame - 5, fps, config: { damping: 14, stiffness: 95 } });

  return (
    <div
      style={{
        position: 'absolute',
        top: 180,
        left: 50,
        right: 50,
        bottom: 120,
        transform: `translateY(${interpolate(anim, [0, 1], [30, 0])}px)`,
        opacity: anim,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 28,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <span
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: '#10B981',
            background: 'rgba(16, 185, 129, 0.15)',
            padding: '8px 22px',
            borderRadius: 20,
            border: '1px solid rgba(16, 185, 129, 0.4)',
            marginBottom: 16,
          }}
        >
          THE 3 CLINAZA GUARANTEES
        </span>

        <h2 style={{ fontSize: 52, fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
          What Clinaza Delivers to Your Front Desk:
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 26, width: '100%' }}>
        {/* Guarantee 1 */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.95)',
            border: '2px solid rgba(16, 185, 129, 0.55)',
            borderRadius: 24,
            padding: '30px 34px',
            display: 'flex',
            alignItems: 'center',
            gap: 26,
            boxShadow: '0 14px 34px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ fontSize: 52 }}>⚡</div>
          <div>
            <div style={{ fontSize: 30, fontWeight: 900, color: '#10B981' }}>100% Upfront T+1 Payout</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: '#CBD5E1', marginTop: 6, lineHeight: 1.35 }}>
              Full treatment fee credited directly into your clinic current account on the next banking day.
            </div>
          </div>
        </div>

        {/* Guarantee 2 */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.95)',
            border: '2px solid rgba(8, 103, 232, 0.55)',
            borderRadius: 24,
            padding: '30px 34px',
            display: 'flex',
            alignItems: 'center',
            gap: 26,
            boxShadow: '0 14px 34px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ fontSize: 52 }}>🛡️</div>
          <div>
            <div style={{ fontSize: 30, fontWeight: 900, color: '#38BDF8' }}>0% Clinic Recourse / Zero Risk</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: '#CBD5E1', marginTop: 6, lineHeight: 1.35 }}>
              100% balance-sheet underwritten by partner banks. Zero liability or recovery burden on your clinic.
            </div>
          </div>
        </div>

        {/* Guarantee 3 */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.95)',
            border: '2px solid rgba(245, 158, 11, 0.55)',
            borderRadius: 24,
            padding: '30px 34px',
            display: 'flex',
            alignItems: 'center',
            gap: 26,
            boxShadow: '0 14px 34px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ fontSize: 52 }}>🏷️</div>
          <div>
            <div style={{ fontSize: 30, fontWeight: 900, color: '#FCD34D' }}>₹999 Setup • ₹0 Recurring AMC</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: '#CBD5E1', marginTop: 6, lineHeight: 1.35 }}>
              Includes doctor KYC underwriting + multi-bank lending gateway setup. Zero monthly subscriptions.
            </div>
          </div>
        </div>
      </div>

      {/* Partner Stamp Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1.5px solid rgba(255, 255, 255, 0.12)',
          padding: '16px 32px',
          borderRadius: 24,
        }}
      >
        <span style={{ fontSize: 18, fontWeight: 700, color: '#CBD5E1' }}>
          Lending Gateway Integration:
        </span>
        <Img
          src={staticFile('assets/plural_by_pinelabs_transparent.png')}
          style={{
            height: 38,
            objectFit: 'contain',
          }}
        />
        <span style={{ fontSize: 16, fontWeight: 800, color: '#10B981' }}>
          Sub-Merchant Desk Active
        </span>
      </div>
    </div>
  );
};

// ── Scene 5: Final Call to Action ────────────────────────────────────────────
const Scene5CallToAction: React.FC<{ fps: number; websiteUrl: string }> = ({ fps, websiteUrl }) => {
  const frame = useCurrentFrame();

  const ctaScale = spring({ frame: frame - 5, fps, config: { damping: 13, stiffness: 100 } });

  return (
    <div
      style={{
        position: 'absolute',
        top: 180,
        left: 50,
        right: 50,
        bottom: 120,
        transform: `scale(${ctaScale})`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <span
        style={{
          fontSize: 18,
          fontWeight: 800,
          color: '#38BDF8',
          background: 'rgba(8, 103, 232, 0.25)',
          padding: '10px 28px',
          borderRadius: 30,
          border: '1.5px solid rgba(56, 189, 248, 0.5)',
          marginBottom: 28,
        }}
      >
        JOIN 195+ PARTNER CLINICS ACROSS INDIA
      </span>

      <h2
        style={{
          fontSize: 66,
          fontWeight: 900,
          lineHeight: 1.15,
          color: '#FFFFFF',
          margin: '0 0 24px 0',
        }}
      >
        Activate Your Clinic Desk in <span style={{ color: '#10B981' }}>24 Hours</span>
      </h2>

      <p style={{ fontSize: 24, fontWeight: 600, color: '#CBD5E1', maxWidth: 880, lineHeight: 1.45, margin: '0 0 40px 0' }}>
        Send your 3 basic KYC documents on WhatsApp to activate your instant point-of-care patient EMI desk:
      </p>

      {/* 3 Document Checklist */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 20,
          marginBottom: 50,
          width: '100%',
        }}
      >
        <div
          style={{
            flex: 1,
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1.5px solid rgba(16, 185, 129, 0.5)',
            borderRadius: 18,
            padding: '20px 20px',
            fontSize: 20,
            fontWeight: 800,
            color: '#F1F5F9',
          }}
        >
          ✅ Doctor PAN Card
        </div>
        <div
          style={{
            flex: 1,
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1.5px solid rgba(16, 185, 129, 0.5)',
            borderRadius: 18,
            padding: '20px 20px',
            fontSize: 20,
            fontWeight: 800,
            color: '#F1F5F9',
          }}
        >
          ✅ Doctor Aadhaar Card
        </div>
        <div
          style={{
            flex: 1,
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1.5px solid rgba(16, 185, 129, 0.5)',
            borderRadius: 18,
            padding: '20px 20px',
            fontSize: 20,
            fontWeight: 800,
            color: '#F1F5F9',
          }}
        >
          ✅ Clinic Cancelled Cheque
        </div>
      </div>

      {/* WhatsApp CTA Button */}
      <div
        style={{
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          color: '#FFFFFF',
          padding: '28px 60px',
          borderRadius: 32,
          fontSize: 32,
          fontWeight: 900,
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          boxShadow: '0 24px 60px rgba(16, 185, 129, 0.55)',
          marginBottom: 35,
        }}
      >
        <span style={{ fontSize: 42 }}>📲</span>
        <span>WhatsApp: +91 72929 84244</span>
      </div>

      <div style={{ fontSize: 24, fontWeight: 800, color: '#94A3B8' }}>
        Or apply directly online at <span style={{ color: '#38BDF8' }}>{websiteUrl}/#partner-form</span>
      </div>
    </div>
  );
};