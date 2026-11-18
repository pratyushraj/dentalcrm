import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';

// =========================================================================
// CLINAZA WHATSAPP STORY / STATUS POST (1080 x 1920 - 9:16 Portrait)
// 100% Mobile Safe-Zone & Crop-Area Friendly:
// - Top Safe Zone: 210px (Clean space for WhatsApp status bars, sender DP, time)
// - Bottom Safe Zone: 260px (Clean space for WhatsApp floating reply bar & gestures)
// - Left/Right Margin: 64px (Safe from curved edge screens)
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
          top: 100,
          left: -80,
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(8, 103, 232, 0.35) 0%, rgba(2, 6, 23, 0) 70%)',
          filter: 'blur(90px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 650,
          right: -100,
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, rgba(2, 6, 23, 0) 70%)',
          filter: 'blur(90px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 120,
          left: '25%',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, rgba(2, 6, 23, 0) 70%)',
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
            linear-gradient(to right, rgba(255, 255, 255, 0.035) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.035) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          opacity: 0.65,
          pointerEvents: 'none',
        }}
      />

      {/* ── SAFE ZONE CONTENT WRAPPER ── */}
      {/* Strict boundary: Starts at Y = 210px, ends at Y = 1660px (260px bottom headroom) */}
      <div
        style={{
          position: 'absolute',
          top: 210,
          left: 64,
          right: 64,
          height: 1450,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          zIndex: 20,
        }}
      >
        {/* ── 1. SAFE ZONE TOP HEADER ── */}
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
                width: 64,
                height: 64,
                borderRadius: 18,
                border: '2px solid rgba(255, 255, 255, 0.25)',
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
                    background: 'rgba(8, 103, 232, 0.35)',
                    color: '#60A5FA',
                    border: '1px solid rgba(96, 165, 250, 0.5)',
                    padding: '3px 10px',
                    borderRadius: 8,
                  }}
                >
                  HealthPay
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: '#94A3B8', fontWeight: 700, letterSpacing: '0.05em' }}>
                POINT-OF-CARE HEALTHCARE FINANCING
              </p>
            </div>
          </div>

          {/* Pine Labs Partner Pill - Crisp High Contrast */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: '#FFFFFF',
              border: '1.5px solid rgba(255, 255, 255, 0.4)',
              padding: '8px 16px',
              borderRadius: 24,
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.35)',
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 900, color: '#475569', letterSpacing: '0.08em' }}>
              GATEWAY:
            </span>
            <Img
              src={staticFile('assets/plural_by_pinelabs_transparent.png')}
              style={{ height: 20, width: 'auto', objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* ── 2. LAUNCH ANNOUNCEMENT BADGE & HOOK HEADLINE ── */}
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.25) 0%, rgba(8, 103, 232, 0.25) 100%)',
              border: '1.5px solid rgba(52, 211, 153, 0.6)',
              padding: '7px 18px',
              borderRadius: 24,
              marginBottom: 12,
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
              fontSize: 50,
              fontWeight: 900,
              lineHeight: 1.12,
              letterSpacing: '-0.025em',
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
              marginTop: 10,
              marginBottom: 0,
              fontSize: 20,
              fontWeight: 600,
              color: '#CBD5E1',
              lineHeight: 1.35,
            }}
          >
            Equip your reception desk with instant point-of-care patient EMIs. Turn upfront price resistance into immediate booked treatments.
          </p>
        </div>

        {/* ── 3. HERO SHOWCASE CARD: DOCTOR VISUAL + 4 GUARANTEES ── */}
        <div
          style={{
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.9) 0%, rgba(2, 6, 23, 0.96) 100%)',
            borderRadius: 26,
            border: '1.5px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
            padding: 24,
            display: 'flex',
            gap: 22,
            alignItems: 'center',
          }}
        >
          {/* Left: Authentic Indian Doctor Consultation Visual */}
          <div
            style={{
              flex: '0 0 310px',
              height: 360,
              position: 'relative',
              borderRadius: 20,
              overflow: 'hidden',
              border: '1.5px solid rgba(96, 165, 250, 0.35)',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)',
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
            {/* Bottom gradient overlay for text readability */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(2, 6, 23, 0.05) 50%, rgba(2, 6, 23, 0.92) 100%)',
              }}
            />
            {/* Floating Pill on image */}
            <div
              style={{
                position: 'absolute',
                bottom: 14,
                left: 12,
                right: 12,
                background: 'rgba(15, 23, 42, 0.92)',
                border: '1px solid rgba(56, 189, 248, 0.5)',
                borderRadius: 14,
                padding: '8px 12px',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span style={{ fontSize: 16 }}>⚡</span>
              <div>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 900, color: '#FFFFFF' }}>
                  Instant Front-Desk eKYC
                </p>
                <p style={{ margin: 0, fontSize: 10, color: '#93C5FD', fontWeight: 600 }}>
                  2-Min Paperless Patient Approval
                </p>
              </div>
            </div>
          </div>

          {/* Right: The 4 Core Commercial Guarantees */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              {
                title: '100% Upfront T+1 Payouts',
                desc: 'Direct settlement to your clinic current account on next business day.',
                badge: 'T+1 DIRECT',
                color: '#34D399',
              },
              {
                title: '0% Clinic Default Recourse',
                desc: 'Zero risk or collection follow-up on your clinic. Lenders absorb 100% liability.',
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
                  borderRadius: 15,
                  padding: '11px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: item.color, fontSize: 15, fontWeight: 900 }}>✓</span>
                    <h4 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#FFFFFF' }}>
                      {item.title}
                    </h4>
                  </div>
                  <p style={{ margin: '3px 0 0 22px', fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>
                    {item.desc}
                  </p>
                </div>
                <span
                  style={{
                    fontSize: 9.5,
                    fontWeight: 900,
                    letterSpacing: '0.06em',
                    color: item.color,
                    background: 'rgba(0, 0, 0, 0.45)',
                    padding: '4px 9px',
                    borderRadius: 7,
                    border: `1px solid ${item.color}45`,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.badge}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── 4. MULTI-SPECIALTY STRIP ── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 }}>
            <span style={{ fontSize: 12, fontWeight: 900, letterSpacing: '0.12em', color: '#94A3B8', textTransform: 'uppercase' }}>
              SPECIALTIES ACTIVELY ONBOARDING
            </span>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#34D399' }}>
              ₹15,000 to ₹5,00,000 Tickets
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
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
                  borderRadius: 18,
                  padding: '13px 12px',
                  textAlign: 'center',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <div style={{ fontSize: 26, marginBottom: 4 }}>{spec.emoji}</div>
                <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#FFFFFF' }}>{spec.name}</h4>
                <p style={{ margin: '3px 0 0', fontSize: 10.5, color: '#CBD5E1', fontWeight: 600 }}>
                  {spec.examples}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 5. TRANSPARENT PRICING & ZERO RECURRING INVARIANTS ── */}
        <div
          style={{
            background: 'linear-gradient(90deg, rgba(8, 103, 232, 0.16) 0%, rgba(16, 185, 129, 0.16) 100%)',
            borderRadius: 20,
            border: '1.5px solid rgba(255, 255, 255, 0.16)',
            padding: '14px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <span style={{ fontSize: 10.5, fontWeight: 900, color: '#38BDF8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              TRANSPARENT CLINIC PRICING
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 2 }}>
              <span style={{ fontSize: 27, fontWeight: 900, color: '#FFFFFF' }}>₹999</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#CBD5E1' }}>One-Time Onboarding & Activation Kit Fee</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ display: 'block', fontSize: 15, fontWeight: 900, color: '#34D399' }}>₹0 AMC</span>
              <span style={{ fontSize: 10.5, color: '#94A3B8', fontWeight: 600 }}>Zero annual fees</span>
            </div>
            <div style={{ width: 1, height: 30, background: 'rgba(255, 255, 255, 0.2)' }} />
            <div style={{ textAlign: 'right' }}>
              <span style={{ display: 'block', fontSize: 15, fontWeight: 900, color: '#34D399' }}>₹0 / Month</span>
              <span style={{ fontSize: 10.5, color: '#94A3B8', fontWeight: 600 }}>Zero subscription</span>
            </div>
          </div>
        </div>

        {/* ── 6. BOTTOM ACTION AREA ── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}
        >
          {/* Link Sticker Style Pill */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              color: '#0B2450',
              padding: '9px 24px',
              borderRadius: 24,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            }}
          >
            <span style={{ fontSize: 15 }}>🔗</span>
            <span style={{ fontSize: 16.5, fontWeight: 900, letterSpacing: '0.02em' }}>
              clinaza.in/clinic-onboarding
            </span>
          </div>

          {/* Primary Action Button */}
          <div
            style={{
              width: '100%',
              background: 'linear-gradient(90deg, #0867E8 0%, #0052CC 100%)',
              padding: '17px 28px',
              borderRadius: 22,
              border: '2px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 10px 36px rgba(8, 103, 232, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
            }}
          >
            <span style={{ fontSize: 20, fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#FFFFFF' }}>
              Reply "ONBOARD" to Activate Your Clinic
            </span>
            <span style={{ fontSize: 22, fontWeight: 900, color: '#FFFFFF' }}>→</span>
          </div>

          {/* Support & Brand Footer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 13, color: '#94A3B8', fontWeight: 700 }}>
            <span>Direct WhatsApp: +91 96081 29767</span>
            <span>&bull;</span>
            <span>@clinaza.in</span>
            <span>&bull;</span>
            <span>Pan-India Courier Dispatch</span>
          </div>
        </div>
      </div>

      {/* ── 7. BOTTOM SAFE ZONE RESERVED SPACE (Y: 1660px to 1920px) ── */}
      {/* 260px of pristine breathing room where WhatsApp's "Type a reply..." floating input bar and home navigation bar sit without overlapping any text or buttons */}
    </AbsoluteFill>
  );
};
