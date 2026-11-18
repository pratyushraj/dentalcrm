import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';

// =========================================================================
// CLINAZA WHATSAPP STORY / STATUS POST (1080 x 1920 - 9:16 Portrait)
// Focused announcement graphic:
// - Official Onboarding Partner Clinics Across India
// - Point-of-care patient EMIs for dental, aesthetic, IVF, daycare
// - 100% Upfront T+1 payouts directly to clinic bank account
// - 0% recourse — zero risk on patient EMIs
// Safe Zones: Top 220px, Bottom 260px, Horizontal padding 72px
// =========================================================================

export const WhatsAppOnboardingStoryComposition: React.FC = () => {
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
      {/* ── Layer 1: Subtle Authentic Clinic Backdrop (Atmospheric) ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
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

      {/* ── Layer 2: Deep Dark Obsidian Gradient Overlay ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(2, 6, 23, 0.94) 0%, rgba(2, 6, 23, 0.88) 40%, rgba(2, 6, 23, 0.96) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Layer 3: Vibrant Ambient Neon Radial Glows ── */}
      <div
        style={{
          position: 'absolute',
          top: 150,
          left: -80,
          width: 750,
          height: 750,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(8, 103, 232, 0.38) 0%, rgba(2, 6, 23, 0) 70%)',
          filter: 'blur(95px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 800,
          right: -100,
          width: 800,
          height: 800,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.26) 0%, rgba(2, 6, 23, 0) 70%)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 200,
          left: '20%',
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.22) 0%, rgba(2, 6, 23, 0) 70%)',
          filter: 'blur(90px)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Layer 4: Subtle Tech Grid Pattern ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.035) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.035) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          opacity: 0.6,
          pointerEvents: 'none',
        }}
      />

      {/* ── SAFE ZONE CONTENT WRAPPER ── */}
      {/* Strict boundary: Starts at Y = 220px, ends at Y = 1660px */}
      {/* Leaves 220px top headroom for WhatsApp header and 260px bottom footroom for reply bar */}
      <div
        style={{
          position: 'absolute',
          top: 220,
          bottom: 260,
          left: 72,
          right: 72,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          zIndex: 20,
        }}
      >
        {/* ── 1. BRAND HEADER BAR ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo & Brand Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <Img
              src={staticFile('assets/clinaza-logo.jpg')}
              style={{
                width: 76,
                height: 76,
                borderRadius: 22,
                border: '2px solid rgba(255, 255, 255, 0.25)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
                objectFit: 'cover',
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span
                  style={{
                    fontSize: 32,
                    fontWeight: 900,
                    letterSpacing: '0.12em',
                    color: '#FFFFFF',
                  }}
                >
                  CLINAZA
                </span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 900,
                    letterSpacing: '0.08em',
                    background: 'rgba(8, 103, 232, 0.35)',
                    color: '#60A5FA',
                    border: '1.5px solid rgba(96, 165, 250, 0.55)',
                    padding: '4px 12px',
                    borderRadius: 8,
                  }}
                >
                  HealthPay
                </span>
              </div>
              <p
                style={{
                  margin: '3px 0 0',
                  fontSize: 13.5,
                  color: '#94A3B8',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                Point-of-Care Healthcare Financing
              </p>
            </div>
          </div>

          {/* Announcement Live Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 9,
              background: 'rgba(16, 185, 129, 0.16)',
              border: '1.5px solid rgba(52, 211, 153, 0.5)',
              padding: '9px 18px',
              borderRadius: 24,
              backdropFilter: 'blur(10px)',
            }}
          >
            <span
              style={{
                width: 9,
                height: 9,
                borderRadius: '50%',
                backgroundColor: '#10B981',
                boxShadow: '0 0 10px #10B981',
              }}
            />
            <span
              style={{
                fontSize: 12.5,
                fontWeight: 900,
                letterSpacing: '0.1em',
                color: '#6EE7B7',
                textTransform: 'uppercase',
              }}
            >
              Pan-India Live
            </span>
          </div>
        </div>

        {/* ── 2. MAIN HOOK HEADLINE ── */}
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(255, 255, 255, 0.07)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              padding: '7px 18px',
              borderRadius: 20,
              marginBottom: 16,
            }}
          >
            <span style={{ fontSize: 14 }}>🚀</span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#93C5FD',
              }}
            >
              Partner Clinic Network
            </span>
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: 58,
              fontWeight: 900,
              lineHeight: 1.12,
              letterSpacing: '-0.03em',
            }}
          >
            We have officially <br />
            <span
              style={{
                background: 'linear-gradient(90deg, #60A5FA 0%, #38BDF8 40%, #34D399 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              started onboarding
            </span>{' '}
            <br />
            partner clinics <br />
            across India!
          </h1>
        </div>

        {/* ── 3. SECONDARY EXPLANATORY CARD ── */}
        <div
          style={{
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '1.5px solid rgba(255, 255, 255, 0.14)',
            borderRadius: 26,
            padding: '28px 32px',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 20 }}>⚡</span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 900,
                letterSpacing: '0.14em',
                color: '#38BDF8',
                textTransform: 'uppercase',
              }}
            >
              Chairside & Reception Financing
            </span>
          </div>

          <p
            style={{
              margin: 0,
              fontSize: 27,
              fontWeight: 600,
              color: '#F1F5F9',
              lineHeight: 1.4,
              letterSpacing: '-0.01em',
            }}
          >
            Equip your reception desk with instant point-of-care patient EMIs for{' '}
            <span style={{ color: '#FFFFFF', fontWeight: 800, textDecoration: 'underline', textDecorationColor: '#38BDF8' }}>
              high-ticket dental, aesthetic, IVF, and daycare treatments
            </span>
            :
          </p>
        </div>

        {/* ── 4. THE TWO CORE VALUE CARDS (EXACT BULLET POINTS) ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Bullet 1: 100% Upfront T+1 Payouts */}
          <div
            style={{
              background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.16) 0%, rgba(15, 23, 42, 0.92) 100%)',
              border: '2px solid rgba(52, 211, 153, 0.55)',
              borderRadius: 24,
              padding: '24px 28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 12px 36px rgba(16, 185, 129, 0.15)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 18,
                  background: 'rgba(16, 185, 129, 0.25)',
                  border: '1.5px solid rgba(52, 211, 153, 0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                  flexShrink: 0,
                }}
              >
                ✅
              </div>
              <div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 27,
                    fontWeight: 900,
                    color: '#FFFFFF',
                    letterSpacing: '-0.01em',
                  }}
                >
                  100% Upfront T+1 payouts
                </h3>
                <p
                  style={{
                    margin: '6px 0 0',
                    fontSize: 20,
                    fontWeight: 600,
                    color: '#A7F3D0',
                  }}
                >
                  Directly to your clinic bank account
                </p>
              </div>
            </div>

            <span
              style={{
                fontSize: 12,
                fontWeight: 900,
                letterSpacing: '0.08em',
                color: '#34D399',
                background: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(52, 211, 153, 0.4)',
                padding: '8px 16px',
                borderRadius: 12,
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              T+1 DIRECT
            </span>
          </div>

          {/* Bullet 2: 0% Recourse */}
          <div
            style={{
              background: 'linear-gradient(90deg, rgba(8, 103, 232, 0.16) 0%, rgba(15, 23, 42, 0.92) 100%)',
              border: '2px solid rgba(96, 165, 250, 0.55)',
              borderRadius: 24,
              padding: '24px 28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 12px 36px rgba(8, 103, 232, 0.15)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 18,
                  background: 'rgba(8, 103, 232, 0.25)',
                  border: '1.5px solid rgba(96, 165, 250, 0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                  flexShrink: 0,
                }}
              >
                ✅
              </div>
              <div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 27,
                    fontWeight: 900,
                    color: '#FFFFFF',
                    letterSpacing: '-0.01em',
                  }}
                >
                  0% recourse
                </h3>
                <p
                  style={{
                    margin: '6px 0 0',
                    fontSize: 20,
                    fontWeight: 600,
                    color: '#BAE6FD',
                  }}
                >
                  You carry zero risk on patient EMIs
                </p>
              </div>
            </div>

            <span
              style={{
                fontSize: 12,
                fontWeight: 900,
                letterSpacing: '0.08em',
                color: '#60A5FA',
                background: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(96, 165, 250, 0.4)',
                padding: '8px 16px',
                borderRadius: 12,
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              0% RECOURSE
            </span>
          </div>
        </div>

        {/* ── 5. CLEAN BRAND FOOTER ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 18,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 16 }}>🔗</span>
            <span style={{ fontSize: 17, fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.02em' }}>
              clinaza.in/clinic-onboarding
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 14, color: '#94A3B8', fontWeight: 700 }}>
            <span>Direct WhatsApp: +91 96081 29767</span>
            <span>&bull;</span>
            <span>@clinaza.in</span>
          </div>
        </div>
      </div>

      {/* ── 6. RESERVED SAFE ZONES ── */}
      {/* Top 220px: clean headroom for WhatsApp Story top bars & sender info */}
      {/* Bottom 260px: clean footroom for WhatsApp floating "Reply" message input bar */}
    </AbsoluteFill>
  );
};
