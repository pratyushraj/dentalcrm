import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';

// =========================================================================
// CLINAZA WHATSAPP STORY / STATUS IMAGE (1080 x 1920 - 9:16 Portrait)
// Direct conversion of user's WhatsApp text status into an elite branded graphic:
// - Prominent Clinaza Logo + Brand Header
// - 📢 Clinaza is officially onboarding partner clinics across India!
// - Instant front-desk patient EMIs for dental, aesthetic, IVF & daycare
// - The 2 core guarantees: 100% Upfront T+1 payouts & 0% recourse
// - 📋 Send these 3 docs to activate your clinic:
//     1. Doctor PAN & Aadhaar
//     2. Clinic Current Account Cancelled Cheque
//     3. Business Proof (Udyam / Shop Act / State Council Reg)
// - 📲 Direct reply to story / Official Clinaza WhatsApp: +91 72929 84244
// - Safe Zones: Top 210px free, Bottom 260px free (100% mobile-friendly)
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
      {/* ── Atmospheric Clinic Background (Subtle) ── */}
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

      {/* ── Gradient Overlay ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(2, 6, 23, 0.95) 0%, rgba(2, 6, 23, 0.88) 45%, rgba(2, 6, 23, 0.97) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Ambient Radial Glows (Clinaza Blue & Emerald) ── */}
      <div
        style={{
          position: 'absolute',
          top: 100,
          left: -100,
          width: 800,
          height: 800,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(8, 103, 232, 0.4) 0%, rgba(2, 6, 23, 0) 70%)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 800,
          right: -120,
          width: 850,
          height: 850,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.26) 0%, rgba(2, 6, 23, 0) 70%)',
          filter: 'blur(105px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 160,
          left: '20%',
          width: 750,
          height: 750,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.22) 0%, rgba(2, 6, 23, 0) 70%)',
          filter: 'blur(95px)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Subtle Geometric Grid ── */}
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

      {/* ── SAFE ZONE CONTENT WRAPPER (Strict: Y = 210px to Y = 1660px) ── */}
      <div
        style={{
          position: 'absolute',
          top: 210,
          bottom: 260,
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Img
              src={staticFile('assets/clinaza-logo.jpg')}
              style={{
                width: 74,
                height: 74,
                borderRadius: 22,
                border: '2px solid rgba(255, 255, 255, 0.25)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
                objectFit: 'cover',
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 30, fontWeight: 900, letterSpacing: '0.12em', color: '#FFFFFF' }}>
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
                  fontSize: 13,
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

          {/* Official Announcement Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(16, 185, 129, 0.16)',
              border: '1.5px solid rgba(52, 211, 153, 0.5)',
              padding: '8px 16px',
              borderRadius: 20,
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
            <span style={{ fontSize: 12, fontWeight: 900, letterSpacing: '0.08em', color: '#6EE7B7', textTransform: 'uppercase' }}>
              Pan-India Live
            </span>
          </div>
        </div>

        {/* ── 2. HOOK HEADLINE (Line 1 of User's Text) ── */}
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              padding: '6px 14px',
              borderRadius: 16,
              marginBottom: 10,
            }}
          >
            <span style={{ fontSize: 16 }}>📢</span>
            <span style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#93C5FD' }}>
              Official Announcement
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
            Clinaza is officially <br />
            <span
              style={{
                background: 'linear-gradient(90deg, #60A5FA 0%, #38BDF8 40%, #34D399 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              onboarding partner clinics
            </span>{' '}
            <br />
            across India!
          </h1>
        </div>

        {/* ── 3. SUBHEADLINE (Line 2 of User's Text) ── */}
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
            Instant front-desk patient EMIs for{' '}
            <span style={{ color: '#38BDF8', fontWeight: 800 }}>
              dental, aesthetic, IVF & daycare
            </span>
            :
          </p>
        </div>

        {/* ── 4. THE 2 CORE GUARANTEES (Lines 3 & 4 of User's Text) ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Guarantee 1 */}
          <div
            style={{
              background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.16) 0%, rgba(15, 23, 42, 0.92) 100%)',
              border: '1.5px solid rgba(52, 211, 153, 0.55)',
              borderRadius: 18,
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 26 }}>✅</span>
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

          {/* Guarantee 2 */}
          <div
            style={{
              background: 'linear-gradient(90deg, rgba(8, 103, 232, 0.16) 0%, rgba(15, 23, 42, 0.92) 100%)',
              border: '1.5px solid rgba(96, 165, 250, 0.55)',
              borderRadius: 18,
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 26 }}>✅</span>
              <div>
                <h3 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: '#FFFFFF' }}>
                  0% recourse
                </h3>
                <p style={{ margin: '3px 0 0', fontSize: 16, fontWeight: 600, color: '#BAE6FD' }}>
                  Zero default risk or collection follow-up
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

        {/* ── 5. THE 3 DOCUMENTS SECTION (Lines 5 to 8 of User's Text) ── */}
        <div
          style={{
            background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.92) 0%, rgba(15, 23, 42, 0.98) 100%)',
            border: '2.5px solid #F59E0B',
            borderRadius: 24,
            padding: '24px 26px',
            boxShadow: '0 20px 50px rgba(245, 158, 11, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 24 }}>📋</span>
              <div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 21,
                    fontWeight: 900,
                    color: '#FDE68A',
                    letterSpacing: '-0.01em',
                  }}
                >
                  Send these 3 docs to activate your clinic:
                </h3>
                <p style={{ margin: '3px 0 0', fontSize: 13, color: '#CBD5E1', fontWeight: 600 }}>
                  24-Hour Paperless Desk Underwriting
                </p>
              </div>
            </div>

            <span
              style={{
                fontSize: 11,
                fontWeight: 900,
                color: '#020617',
                background: '#F59E0B',
                padding: '6px 13px',
                borderRadius: 10,
                letterSpacing: '0.06em',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
              }}
            >
              3 EASY DOCS
            </span>
          </div>

          {/* 3 Docs List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            {/* Doc 1 */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1.5px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 16,
                padding: '13px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #0867E8 0%, #0052CC 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  fontWeight: 900,
                  color: '#FFFFFF',
                  flexShrink: 0,
                }}
              >
                1
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 19, fontWeight: 900, color: '#FFFFFF' }}>
                  Doctor PAN & Aadhaar
                </span>
                <span style={{ display: 'block', fontSize: 12.5, color: '#94A3B8', fontWeight: 500, marginTop: 1 }}>
                  Practitioner identity & underwriting verification
                </span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#60A5FA', background: 'rgba(96, 165, 250, 0.15)', padding: '4px 10px', borderRadius: 8 }}>
                Doctor KYC
              </span>
            </div>

            {/* Doc 2 */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1.5px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 16,
                padding: '13px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  fontWeight: 900,
                  color: '#FFFFFF',
                  flexShrink: 0,
                }}
              >
                2
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 19, fontWeight: 900, color: '#FFFFFF' }}>
                  Clinic Current Account Cancelled Cheque
                </span>
                <span style={{ display: 'block', fontSize: 12.5, color: '#94A3B8', fontWeight: 500, marginTop: 1 }}>
                  For direct daily T+1 automated payout routing
                </span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#34D399', background: 'rgba(52, 211, 153, 0.15)', padding: '4px 10px', borderRadius: 8 }}>
                Settlement
              </span>
            </div>

            {/* Doc 3 */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1.5px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 16,
                padding: '13px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  fontWeight: 900,
                  color: '#FFFFFF',
                  flexShrink: 0,
                }}
              >
                3
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 19, fontWeight: 900, color: '#FFFFFF' }}>
                  Business Proof
                </span>
                <span style={{ display: 'block', fontSize: 12.5, color: '#FDE68A', fontWeight: 600, marginTop: 1 }}>
                  Udyam / Shop Act / State Council Reg
                </span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#FBBF24', background: 'rgba(251, 191, 36, 0.15)', padding: '4px 10px', borderRadius: 8 }}>
                Registration
              </span>
            </div>
          </div>
        </div>

        {/* ── 6. DIRECT WHATSAPP ACTION BUTTON & FOOTER ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Direct Button */}
          <div
            style={{
              width: '100%',
              background: 'linear-gradient(90deg, #0867E8 0%, #0052CC 100%)',
              padding: '18px 24px',
              borderRadius: 22,
              border: '2px solid rgba(255, 255, 255, 0.35)',
              boxShadow: '0 10px 36px rgba(8, 103, 232, 0.55)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
            }}
          >
            <span style={{ fontSize: 21, fontWeight: 900, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#FFFFFF' }}>
              WhatsApp docs to +91 72929 84244
            </span>
            <span style={{ fontSize: 22, fontWeight: 900, color: '#FFFFFF' }}>→</span>
          </div>

          {/* Footer Metadata */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 8px',
              fontSize: 13,
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

      {/* ── 7. RESERVED SAFE ZONES ── */}
      {/* Top 210px: pristine space for WhatsApp Story progress bars, sender avatar & time */}
      {/* Bottom 260px: pristine space for WhatsApp's floating "Type a reply..." input box */}
    </AbsoluteFill>
  );
};
