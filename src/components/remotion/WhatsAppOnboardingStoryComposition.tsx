import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';

// =========================================================================
// CLINAZA WHATSAPP STORY / STATUS POST (1080 x 1920 - 9:16 Portrait)
// Balanced, high-density layout:
// - Official Pan-India Onboarding Announcement
// - Point-of-Care Patient EMIs for Dental, Aesthetic, IVF, Daycare
// - Core Guarantees: 100% Upfront T+1 payouts & 0% Recourse
// - 3 Mandatory Onboarding Documents:
//   1. Doctor PAN & Aadhaar
//   2. Clinic Current Account Cancelled Cheque
//   3. Business Proof (Udyam / Shop Act / State Dental Council Reg)
// - Safe Zones: Top 210px free, Bottom 260px free for WhatsApp Reply field
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
      {/* ── Background Layer 1: Atmospheric Clinic Visual ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
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

      {/* ── Background Layer 2: Deep Obsidian Tint Overlay ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(2, 6, 23, 0.95) 0%, rgba(2, 6, 23, 0.88) 45%, rgba(2, 6, 23, 0.97) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Background Layer 3: Vibrant Radial Ambient Glows ── */}
      <div
        style={{
          position: 'absolute',
          top: 120,
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
          top: 750,
          right: -100,
          width: 800,
          height: 800,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(2, 6, 23, 0) 70%)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 180,
          left: '20%',
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.22) 0%, rgba(2, 6, 23, 0) 70%)',
          filter: 'blur(90px)',
          pointerEvents: 'none',
        }}
      />

      {/* Subtle Grid Pattern Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.035) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.035) 1px, transparent 1px)
          `,
          backgroundSize: '44px 44px',
          opacity: 0.6,
          pointerEvents: 'none',
        }}
      />

      {/* ── SAFE ZONE CONTENT WRAPPER ── */}
      {/* Strict boundary: Starts at Y = 210px, ends at Y = 1650px (270px bottom safe zone) */}
      <div
        style={{
          position: 'absolute',
          top: 210,
          bottom: 270,
          left: 64,
          right: 64,
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Img
              src={staticFile('assets/clinaza-logo.jpg')}
              style={{
                width: 70,
                height: 70,
                borderRadius: 20,
                border: '2px solid rgba(255, 255, 255, 0.25)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
                objectFit: 'cover',
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span
                  style={{
                    fontSize: 28,
                    fontWeight: 900,
                    letterSpacing: '0.12em',
                    color: '#FFFFFF',
                  }}
                >
                  CLINAZA
                </span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 900,
                    letterSpacing: '0.08em',
                    background: 'rgba(8, 103, 232, 0.35)',
                    color: '#60A5FA',
                    border: '1.5px solid rgba(96, 165, 250, 0.55)',
                    padding: '3px 10px',
                    borderRadius: 8,
                  }}
                >
                  HealthPay
                </span>
              </div>
              <p
                style={{
                  margin: '2px 0 0',
                  fontSize: 12.5,
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

          {/* Plural by Pine Labs Partner Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#FFFFFF',
              border: '1.5px solid rgba(255, 255, 255, 0.4)',
              padding: '7px 15px',
              borderRadius: 22,
              boxShadow: '0 6px 18px rgba(0, 0, 0, 0.35)',
            }}
          >
            <span style={{ fontSize: 10.5, fontWeight: 900, color: '#475569', letterSpacing: '0.08em' }}>
              GATEWAY:
            </span>
            <Img
              src={staticFile('assets/plural_by_pinelabs_transparent.png')}
              style={{ height: 19, width: 'auto', objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* ── 2. MAIN HOOK HEADLINE ── */}
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.22) 0%, rgba(8, 103, 232, 0.22) 100%)',
              border: '1.5px solid rgba(52, 211, 153, 0.55)',
              padding: '6px 16px',
              borderRadius: 20,
              marginBottom: 10,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#10B981',
                boxShadow: '0 0 10px #10B981',
              }}
            />
            <span
              style={{
                fontSize: 12,
                fontWeight: 900,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#A7F3D0',
              }}
            >
              OFFICIAL ANNOUNCEMENT • NOW LIVE
            </span>
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: 50,
              fontWeight: 900,
              lineHeight: 1.12,
              letterSpacing: '-0.025em',
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
            partner clinics across India!
          </h1>
        </div>

        {/* ── 3. SECONDARY EXPLANATORY CARD ── */}
        <div
          style={{
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.88) 0%, rgba(15, 23, 42, 0.96) 100%)',
            border: '1.5px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 20,
            padding: '18px 24px',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)',
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 21,
              fontWeight: 600,
              color: '#E2E8F0',
              lineHeight: 1.35,
            }}
          >
            Equip your reception desk with instant point-of-care patient EMIs for{' '}
            <span style={{ color: '#38BDF8', fontWeight: 800 }}>
              high-ticket dental, aesthetic, IVF, and daycare treatments
            </span>
            :
          </p>
        </div>

        {/* ── 4. THE 2 CORE GUARANTEES ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Bullet 1 */}
          <div
            style={{
              background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)',
              border: '1.5px solid rgba(52, 211, 153, 0.5)',
              borderRadius: 18,
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 24 }}>✅</span>
              <div>
                <h3 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: '#FFFFFF' }}>
                  100% Upfront T+1 payouts
                </h3>
                <p style={{ margin: '3px 0 0', fontSize: 16, fontWeight: 600, color: '#A7F3D0' }}>
                  Directly to your clinic bank account
                </p>
              </div>
            </div>
            <span
              style={{
                fontSize: 10.5,
                fontWeight: 900,
                letterSpacing: '0.06em',
                color: '#34D399',
                background: 'rgba(0, 0, 0, 0.45)',
                border: '1px solid rgba(52, 211, 153, 0.4)',
                padding: '6px 12px',
                borderRadius: 8,
                whiteSpace: 'nowrap',
              }}
            >
              T+1 DIRECT
            </span>
          </div>

          {/* Bullet 2 */}
          <div
            style={{
              background: 'linear-gradient(90deg, rgba(8, 103, 232, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)',
              border: '1.5px solid rgba(96, 165, 250, 0.5)',
              borderRadius: 18,
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 24 }}>✅</span>
              <div>
                <h3 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: '#FFFFFF' }}>
                  0% recourse
                </h3>
                <p style={{ margin: '3px 0 0', fontSize: 16, fontWeight: 600, color: '#BAE6FD' }}>
                  You carry zero risk on patient EMIs
                </p>
              </div>
            </div>
            <span
              style={{
                fontSize: 10.5,
                fontWeight: 900,
                letterSpacing: '0.06em',
                color: '#60A5FA',
                background: 'rgba(0, 0, 0, 0.45)',
                border: '1px solid rgba(96, 165, 250, 0.4)',
                padding: '6px 12px',
                borderRadius: 8,
                whiteSpace: 'nowrap',
              }}
            >
              0% RECOURSE
            </span>
          </div>
        </div>

        {/* ── 5. REQUIRED DOCUMENTS FOR ACTIVATION (NEW HERO SECTION) ── */}
        <div
          style={{
            background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.85) 0%, rgba(15, 23, 42, 0.96) 100%)',
            border: '2px solid rgba(251, 191, 36, 0.45)',
            borderRadius: 24,
            padding: '22px 24px',
            boxShadow: '0 18px 45px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
          }}
        >
          {/* Header of docs card */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 22 }}>📋</span>
              <div>
                <h4
                  style={{
                    margin: 0,
                    fontSize: 18,
                    fontWeight: 900,
                    letterSpacing: '0.04em',
                    color: '#FDE68A',
                    textTransform: 'uppercase',
                  }}
                >
                  Documents Required for Instant Activation
                </h4>
                <p style={{ margin: '2px 0 0', fontSize: 12.5, color: '#94A3B8', fontWeight: 600 }}>
                  Fast-track paperless desk approval within 24 hours
                </p>
              </div>
            </div>

            <span
              style={{
                fontSize: 11,
                fontWeight: 900,
                color: '#F59E0B',
                background: 'rgba(245, 158, 11, 0.18)',
                border: '1px solid rgba(245, 158, 11, 0.45)',
                padding: '5px 12px',
                borderRadius: 10,
                letterSpacing: '0.06em',
              }}
            >
              3 EASY DOCS
            </span>
          </div>

          {/* The 3 Documents List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Doc 1 */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 14,
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #0867E8 0%, #0052CC 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  fontWeight: 900,
                  color: '#FFFFFF',
                  flexShrink: 0,
                }}
              >
                1
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 17.5, fontWeight: 900, color: '#FFFFFF' }}>
                  Doctor PAN & Aadhaar
                </span>
                <span style={{ display: 'block', fontSize: 12, color: '#94A3B8', fontWeight: 500, marginTop: 1 }}>
                  Primary practitioner identity & underwriting verification
                </span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#60A5FA', background: 'rgba(96, 165, 250, 0.12)', padding: '3px 8px', borderRadius: 6 }}>
                Identity
              </span>
            </div>

            {/* Doc 2 */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 14,
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  fontWeight: 900,
                  color: '#FFFFFF',
                  flexShrink: 0,
                }}
              >
                2
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 17.5, fontWeight: 900, color: '#FFFFFF' }}>
                  Clinic Current Account Cancelled Cheque
                </span>
                <span style={{ display: 'block', fontSize: 12, color: '#94A3B8', fontWeight: 500, marginTop: 1 }}>
                  For direct daily T+1 automated payout routing
                </span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#34D399', background: 'rgba(52, 211, 153, 0.12)', padding: '3px 8px', borderRadius: 6 }}>
                Settlement
              </span>
            </div>

            {/* Doc 3 */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 14,
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  fontWeight: 900,
                  color: '#FFFFFF',
                  flexShrink: 0,
                }}
              >
                3
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 17.5, fontWeight: 900, color: '#FFFFFF' }}>
                  Business Proof
                </span>
                <span style={{ display: 'block', fontSize: 12, color: '#CBD5E1', fontWeight: 600, marginTop: 1 }}>
                  Udyam Registration / Shop Act / State Dental Council Reg
                </span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#FBBF24', background: 'rgba(251, 191, 36, 0.12)', padding: '3px 8px', borderRadius: 6 }}>
                Registration
              </span>
            </div>
          </div>
        </div>

        {/* ── 6. TRANSPARENT COMMERCIALS STRIP ── */}
        <div
          style={{
            background: 'linear-gradient(90deg, rgba(8, 103, 232, 0.16) 0%, rgba(16, 185, 129, 0.16) 100%)',
            borderRadius: 18,
            border: '1.5px solid rgba(255, 255, 255, 0.14)',
            padding: '12px 22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <span style={{ fontSize: 10, fontWeight: 900, color: '#38BDF8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              TRANSPARENT CLINIC PRICING
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 1 }}>
              <span style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF' }}>₹999</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#CBD5E1' }}>One-Time Onboarding & Activation Kit</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ display: 'block', fontSize: 14, fontWeight: 900, color: '#34D399' }}>₹0 AMC</span>
              <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600 }}>Zero annual fees</span>
            </div>
            <div style={{ width: 1, height: 26, background: 'rgba(255, 255, 255, 0.2)' }} />
            <div style={{ textAlign: 'right' }}>
              <span style={{ display: 'block', fontSize: 14, fontWeight: 900, color: '#34D399' }}>₹0 / Month</span>
              <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600 }}>Zero subscription</span>
            </div>
          </div>
        </div>

        {/* ── 7. PRIMARY ACTION BUTTON & FOOTER ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Action Button */}
          <div
            style={{
              width: '100%',
              background: 'linear-gradient(90deg, #0867E8 0%, #0052CC 100%)',
              padding: '16px 24px',
              borderRadius: 20,
              border: '2px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 30px rgba(8, 103, 232, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
            }}
          >
            <span style={{ fontSize: 19, fontWeight: 900, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#FFFFFF' }}>
              Reply with your docs to WhatsApp +91 96081 29767
            </span>
            <span style={{ fontSize: 20, fontWeight: 900, color: '#FFFFFF' }}>→</span>
          </div>

          {/* Footer Metadata */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 8px',
              fontSize: 12.5,
              color: '#94A3B8',
              fontWeight: 700,
            }}
          >
            <span>🔗 clinaza.in/clinic-onboarding</span>
            <span>&bull;</span>
            <span>@clinaza.in</span>
            <span>&bull;</span>
            <span>Pan-India Courier Dispatch</span>
          </div>
        </div>
      </div>

      {/* ── 8. RESERVED SAFE ZONES ── */}
      {/* Top 210px: pristine space for WhatsApp Story progress bars, sender avatar & time */}
      {/* Bottom 270px: pristine space for WhatsApp's floating "Type a reply..." input box */}
    </AbsoluteFill>
  );
};
