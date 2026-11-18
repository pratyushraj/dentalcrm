import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';

// =========================================================================
// CLINAZA WHATSAPP STORY / STATUS POST (1080 x 1920 - 9:16 Portrait)
// "We Have Started Onboarding Partner Clinics"
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
      {/* ── Background Deep Ambient Glows ── */}
      <div
        style={{
          position: 'absolute',
          top: -100,
          left: -100,
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(8, 103, 232, 0.35) 0%, rgba(2, 6, 23, 0) 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 600,
          right: -120,
          width: 750,
          height: 750,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(2, 6, 23, 0) 70%)',
          filter: 'blur(90px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -80,
          left: '20%',
          width: 650,
          height: 650,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(2, 6, 23, 0) 70%)',
          filter: 'blur(85px)',
          pointerEvents: 'none',
        }}
      />

      {/* Subtle Grid Pattern Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          opacity: 0.6,
          pointerEvents: 'none',
        }}
      />

      {/* ── 1. TOP HEADER BRAND BAR (Y: 60 - 180) ── */}
      <div
        style={{
          position: 'absolute',
          top: 70,
          left: 56,
          right: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Img
            src={staticFile('assets/clinaza-logo.jpg')}
            style={{
              width: 70,
              height: 70,
              borderRadius: 20,
              border: '2px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
              objectFit: 'cover',
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 28, fontWeight: 900, letterSpacing: '0.12em', color: '#FFFFFF' }}>
                CLINAZA
              </span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 900,
                  letterSpacing: '0.08em',
                  background: 'rgba(8, 103, 232, 0.25)',
                  color: '#60A5FA',
                  border: '1px solid rgba(96, 165, 250, 0.4)',
                  padding: '4px 10px',
                  borderRadius: 8,
                }}
              >
                HealthPay
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: '#94A3B8', fontWeight: 700, letterSpacing: '0.04em' }}>
              POINT-OF-CARE HEALTHCARE FINANCING
            </p>
          </div>
        </div>

        {/* Pine Labs Partner Co-brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '10px 18px',
            borderRadius: 30,
            backdropFilter: 'blur(10px)',
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', letterSpacing: '0.08em' }}>
            GATEWAY:
          </span>
          <Img
            src={staticFile('assets/plural_by_pinelabs_transparent.png')}
            style={{ height: 20, width: 'auto', objectFit: 'contain' }}
          />
        </div>
      </div>

      {/* ── 2. LAUNCH ANNOUNCEMENT BADGE & HOOK (Y: 200 - 550) ── */}
      <div
        style={{
          position: 'absolute',
          top: 195,
          left: 56,
          right: 56,
          zIndex: 20,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.2) 0%, rgba(8, 103, 232, 0.2) 100%)',
            border: '1px solid rgba(52, 211, 153, 0.5)',
            padding: '8px 20px',
            borderRadius: 30,
            marginBottom: 20,
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: '#10B981',
              boxShadow: '0 0 12px #10B981',
            }}
          />
          <span
            style={{
              fontSize: 14,
              fontWeight: 900,
              letterSpacing: '0.14em',
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
            fontSize: 56,
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            textTransform: 'none',
          }}
        >
          We Have Officially <br />
          <span
            style={{
              background: 'linear-gradient(90deg, #60A5FA 0%, #38BDF8 50%, #34D399 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Started Onboarding
          </span>{' '}
          <br />
          Partner Clinics!
        </h1>

        <p
          style={{
            marginTop: 18,
            marginBottom: 0,
            fontSize: 22,
            fontWeight: 600,
            color: '#CBD5E1',
            lineHeight: 1.4,
          }}
        >
          Equip your reception desk with instant point-of-care patient EMIs. Turn upfront price resistance into immediate confirmed treatments.
        </p>
      </div>

      {/* ── 3. HERO SHOWCASE CARD: PHYSICAL RECEPTION KIT + 4 INVARIANTS (Y: 560 - 1090) ── */}
      <div
        style={{
          position: 'absolute',
          top: 560,
          left: 56,
          right: 56,
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.88) 0%, rgba(2, 6, 23, 0.95) 100%)',
          borderRadius: 32,
          border: '1.5px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
          padding: 32,
          display: 'flex',
          gap: 28,
          alignItems: 'center',
          zIndex: 20,
        }}
      >
        {/* Left: Authentic Doctor & Tablet Consultation Visual */}
        <div
          style={{
            flex: '0 0 350px',
            height: 420,
            position: 'relative',
            borderRadius: 24,
            overflow: 'hidden',
            border: '1.5px solid rgba(96, 165, 250, 0.35)',
            boxShadow: '0 16px 36px rgba(0, 0, 0, 0.5)',
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
          {/* Subtle bottom gradient overlay for contrast */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(2, 6, 23, 0.05) 45%, rgba(2, 6, 23, 0.9) 100%)',
            }}
          />
          {/* Floating Pill on image */}
          <div
            style={{
              position: 'absolute',
              bottom: 16,
              left: 16,
              right: 16,
              background: 'rgba(15, 23, 42, 0.88)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              borderRadius: 16,
              padding: '10px 14px',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span style={{ fontSize: 16 }}>⚡</span>
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 900, color: '#FFFFFF' }}>
                Instant Front-Desk eKYC
              </p>
              <p style={{ margin: 0, fontSize: 11, color: '#93C5FD', fontWeight: 600 }}>
                2-Min Paperless Patient Approval
              </p>
            </div>
          </div>
        </div>

        {/* Right: The 4 Core Commercial Guarantees */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            {
              title: '100% Upfront T+1 Payouts',
              desc: 'Direct settlement to your clinic current account on next business day.',
              badge: 'T+1 DIRECT',
              color: '#34D399',
            },
            {
              title: '0% Clinic Default Recourse',
              desc: 'Zero risk or collection follow-up on your clinic. Lenders take 100% liability.',
              badge: '0% RECOURSE',
              color: '#60A5FA',
            },
            {
              title: '35+ EMI Modes Supported',
              desc: 'Credit Cards, Debit Cards, and Cardless digital healthcare financing.',
              badge: 'ALL MAJOR BANKS',
              color: '#FBBF24',
            },
            {
              title: '92-Second Front-Desk eKYC',
              desc: 'Paperless OTP check. Instant pre-approval directly chairside or at reception.',
              badge: 'ZERO PAPERWORK',
              color: '#A78BFA',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.09)',
                borderRadius: 18,
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: item.color, fontSize: 16, fontWeight: 900 }}>✓</span>
                  <h4 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#FFFFFF' }}>
                    {item.title}
                  </h4>
                </div>
                <p style={{ margin: '4px 0 0 24px', fontSize: 13, color: '#94A3B8', fontWeight: 500 }}>
                  {item.desc}
                </p>
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 900,
                  letterSpacing: '0.06em',
                  color: item.color,
                  background: 'rgba(0, 0, 0, 0.4)',
                  padding: '4px 10px',
                  borderRadius: 8,
                  border: `1px solid ${item.color}40`,
                  whiteSpace: 'nowrap',
                }}
              >
                {item.badge}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. MULTI-SPECIALTY GRID STRIP (Y: 1115 - 1385) ── */}
      <div
        style={{
          position: 'absolute',
          top: 1120,
          left: 56,
          right: 56,
          zIndex: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 900, letterSpacing: '0.12em', color: '#94A3B8', textTransform: 'uppercase' }}>
            SPECIALTIES ACTIVELY ONBOARDING
          </span>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#34D399' }}>
            ₹15,000 to ₹5,00,000 Tickets
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {[
            {
              emoji: '🦷',
              name: 'Dental Care',
              examples: 'Implants, Aligners & Rehab',
              accent: 'rgba(8, 103, 232, 0.2)',
              border: 'rgba(96, 165, 250, 0.4)',
            },
            {
              emoji: '✨',
              name: 'Aesthetics & Skin',
              examples: 'GFC, PRP, HIFU & Sculpting',
              accent: 'rgba(245, 158, 11, 0.2)',
              border: 'rgba(251, 191, 36, 0.4)',
            },
            {
              emoji: '👶',
              name: 'IVF & Fertility',
              examples: 'IVF Cycles, ICSI & Freezing',
              accent: 'rgba(168, 85, 247, 0.2)',
              border: 'rgba(192, 132, 252, 0.4)',
            },
            {
              emoji: '👁️',
              name: 'Eye & Daycare',
              examples: 'LASIK, SMILE & Cataract',
              accent: 'rgba(16, 185, 129, 0.2)',
              border: 'rgba(52, 211, 153, 0.4)',
            },
          ].map((spec, sIdx) => (
            <div
              key={sIdx}
              style={{
                background: spec.accent,
                border: `1.5px solid ${spec.border}`,
                borderRadius: 20,
                padding: '16px 14px',
                textAlign: 'center',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 6 }}>{spec.emoji}</div>
              <h4 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#FFFFFF' }}>{spec.name}</h4>
              <p style={{ margin: '4px 0 0', fontSize: 11, color: '#CBD5E1', fontWeight: 600 }}>
                {spec.examples}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. TRANSPARENT PRICING & ZERO RECURRING INVARIANTS (Y: 1400 - 1570) ── */}
      <div
        style={{
          position: 'absolute',
          top: 1405,
          left: 56,
          right: 56,
          background: 'linear-gradient(90deg, rgba(8, 103, 232, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)',
          borderRadius: 24,
          border: '1.5px solid rgba(255, 255, 255, 0.15)',
          padding: '18px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 20,
        }}
      >
        <div>
          <span style={{ fontSize: 11, fontWeight: 900, color: '#38BDF8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            TRANSPARENT CLINIC PRICING
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 2 }}>
            <span style={{ fontSize: 32, fontWeight: 900, color: '#FFFFFF' }}>₹999</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#CBD5E1' }}>One-Time Onboarding & Activation Kit Fee</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ display: 'block', fontSize: 16, fontWeight: 900, color: '#34D399' }}>₹0 AMC</span>
            <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>Zero annual fees</span>
          </div>
          <div style={{ width: 1, height: 35, background: 'rgba(255, 255, 255, 0.2)' }} />
          <div style={{ textAlign: 'right' }}>
            <span style={{ display: 'block', fontSize: 16, fontWeight: 900, color: '#34D399' }}>₹0 / Month</span>
            <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>Zero subscription</span>
          </div>
        </div>
      </div>

      {/* ── 6. BOTTOM CALL-TO-ACTION FOR WHATSAPP STORY (Y: 1590 - 1860) ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          left: 56,
          right: 56,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          zIndex: 20,
        }}
      >
        {/* Link Sticker Style Pill */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            color: '#0B2450',
            padding: '12px 28px',
            borderRadius: 30,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
          }}
        >
          <span style={{ fontSize: 16 }}>🔗</span>
          <span style={{ fontSize: 18, fontWeight: 900, letterSpacing: '0.02em' }}>
            clinaza.in/clinic-onboarding
          </span>
        </div>

        {/* Primary Action Button */}
        <div
          style={{
            width: '100%',
            background: 'linear-gradient(90deg, #0867E8 0%, #0052CC 100%)',
            padding: '22px 32px',
            borderRadius: 28,
            border: '2px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 12px 40px rgba(8, 103, 232, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
          }}
        >
          <span style={{ fontSize: 24, fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#FFFFFF' }}>
            Reply "ONBOARD" to Activate Your Clinic
          </span>
          <span style={{ fontSize: 26, fontWeight: 900, color: '#FFFFFF' }}>→</span>
        </div>

        {/* Footer Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 14, color: '#94A3B8', fontWeight: 700 }}>
          <span>Direct WhatsApp: +91 96081 29767</span>
          <span>&bull;</span>
          <span>@clinaza.in</span>
          <span>&bull;</span>
          <span>Pan-India Courier Dispatch</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
