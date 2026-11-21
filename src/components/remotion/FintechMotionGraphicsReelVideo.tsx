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
// CLINAZA INSTAGRAM REEL: FINTECH MOTION GRAPHICS & PRICE TICKER
// Inspired by: reactvideoeditor/remotion-templates
// Stack: Remotion + Live Price Tickers + Split Comparison Cards + Bank Settlement HUD
// Dimensions: 1080 x 1920 (9:16 Portrait) | Duration: 20s (600 Frames @ 30 FPS)
// =========================================================================

export const FintechMotionGraphicsReelVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Subtle background drift
  const bgScale = interpolate(frame, [0, 600], [1.02, 1.12], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#020617',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif",
        color: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
        width: 1080,
        height: 1920,
      }}
    >
      {/* ── Background: Real Clinic Texture with Drift ── */}
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
          background: 'radial-gradient(circle, rgba(8, 103, 232, 0.35) 0%, rgba(2, 6, 23, 0) 70%)',
          filter: 'blur(95px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 200,
          right: -100,
          width: 850,
          height: 850,
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
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
                FINTECH SUITE
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
          <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#10B981', boxShadow: '0 0 12px #10B981' }} />
          <span style={{ fontSize: 16, fontWeight: 800, color: '#F1F5F9' }}>
            195+ Clinics
          </span>
        </div>
      </div>

      {/* ── Sequence 1: Animated Price Ticker Transformation (0s to 6.6s) ── */}
      <Sequence from={0} durationInFrames={205}>
        <ScenePriceTicker fps={fps} />
      </Sequence>

      {/* ── Sequence 2: Split Comparison Card (6.6s to 13.3s) ── */}
      <Sequence from={200} durationInFrames={205}>
        <SceneComparison fps={fps} />
      </Sequence>

      {/* ── Sequence 3: Bank Settlement HUD & CTA (13.3s to 20s) ── */}
      <Sequence from={400} durationInFrames={200}>
        <SceneSettlementAndCta fps={fps} />
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
          <span style={{ fontSize: 16, fontWeight: 700, color: '#94A3B8' }}>Official Desk:</span>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#38BDF8' }}>@clinaza.in</span>
        </div>
        <div style={{ fontSize: 15, fontWeight: 800, color: '#CBD5E1' }}>
          T+1 Settlements • 0% Clinic Risk
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 1: Animated Price Ticker Transformation ────────────────────────────
const ScenePriceTicker: React.FC<{ fps: number }> = ({ fps }) => {
  const frame = useCurrentFrame();

  const titlePop = spring({ frame, fps, config: { damping: 13, stiffness: 100 } });
  const strikeProgress = interpolate(frame, [45, 75], [0, 100], { extrapolateRight: 'clamp' });
  const emiPop = spring({ frame: frame - 65, fps, config: { damping: 12, stiffness: 110 } });

  // Rolling counter from 0 to 2,708
  const animatedEmi = Math.round(
    interpolate(frame, [65, 120], [0, 2708], {
      extrapolateRight: 'clamp',
    })
  );

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
        gap: 32,
      }}
    >
      <span
        style={{
          fontSize: 16,
          fontWeight: 800,
          color: '#FCD34D',
          background: 'rgba(245, 158, 11, 0.18)',
          padding: '8px 24px',
          borderRadius: 24,
          border: '1px solid rgba(245, 158, 11, 0.4)',
        }}
      >
        FINANCIAL PSYCHOLOGY AT RECEPTION
      </span>

      <h1
        style={{
          transform: `scale(${titlePop})`,
          fontSize: 58,
          fontWeight: 900,
          color: '#FFFFFF',
          textAlign: 'center',
          lineHeight: 1.15,
          margin: 0,
          maxWidth: 960,
        }}
      >
        How to Turn a <span style={{ color: '#EF4444' }}>"Thinking About It"</span> Into a Same-Day Surgery:
      </h1>

      {/* Main Transformation Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.96) 0%, rgba(30, 41, 59, 0.94) 100%)',
          border: '2px solid rgba(56, 189, 248, 0.45)',
          borderRadius: 28,
          padding: '40px 45px',
          width: '100%',
          maxWidth: 960,
          boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 28,
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 700, color: '#94A3B8' }}>
          TREATMENT: PREMIUM DENTAL IMPLANT & ZIRCONIA CROWN
        </div>

        {/* Lump Sum with Animated Strike-through */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <div style={{ fontSize: 64, fontWeight: 900, color: 'rgba(255, 255, 255, 0.45)', letterSpacing: '-0.02em' }}>
            ₹65,000 Upfront
          </div>
          {/* Red Strike-Through Bar */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              width: `${strikeProgress}%`,
              height: 6,
              backgroundColor: '#EF4444',
              transform: 'translateY(-50%) rotate(-4deg)',
              boxShadow: '0 0 12px #EF4444',
            }}
          />
        </div>

        {/* Down Arrow Indicator */}
        <div style={{ fontSize: 36, color: '#38BDF8' }}>⬇️ Reframe Chairside to:</div>

        {/* Rolling EMI Price Ticker */}
        <div
          style={{
            transform: `scale(${emiPop})`,
            opacity: emiPop,
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(5, 150, 105, 0.15) 100%)',
            border: '2px solid rgba(16, 185, 129, 0.6)',
            borderRadius: 24,
            padding: '24px 44px',
            textAlign: 'center',
            boxShadow: '0 0 40px rgba(16, 185, 129, 0.35)',
          }}
        >
          <div style={{ fontSize: 72, fontWeight: 900, color: '#10B981', letterSpacing: '-0.02em', textShadow: '0 0 25px rgba(16, 185, 129, 0.6)' }}>
            ₹{animatedEmi.toLocaleString('en-IN')} <span style={{ fontSize: 32, fontWeight: 700, color: '#E0F2FE' }}>/ month</span>
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#A7F3D0', marginTop: 8 }}>
            ⚡ 24-Month Paperless EMI • Front-Desk QR Scan
          </div>
        </div>
      </div>

      {/* Feature Footnote */}
      <div style={{ fontSize: 20, fontWeight: 700, color: '#CBD5E1', textAlign: 'center' }}>
        Patient pays in easy monthly installments. <span style={{ color: '#10B981' }}>Clinic receives 100% upfront in 24 hours.</span>
      </div>
    </div>
  );
};

// ── Scene 2: Split Comparison Card (Without vs With Clinaza) ─────────────────
const SceneComparison: React.FC<{ fps: number }> = ({ fps }) => {
  const frame = useCurrentFrame();

  const titlePop = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const cardLeft = spring({ frame: frame - 15, fps, config: { damping: 13, stiffness: 100 } });
  const cardRight = spring({ frame: frame - 35, fps, config: { damping: 13, stiffness: 100 } });

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
        gap: 30,
      }}
    >
      <span
        style={{
          fontSize: 16,
          fontWeight: 800,
          color: '#38BDF8',
          background: 'rgba(8, 103, 232, 0.22)',
          padding: '8px 24px',
          borderRadius: 24,
          border: '1px solid rgba(56, 189, 248, 0.4)',
        }}
      >
        RECEPTION DESK COMPARISON
      </span>

      <h2
        style={{
          transform: `scale(${titlePop})`,
          fontSize: 54,
          fontWeight: 900,
          color: '#FFFFFF',
          textAlign: 'center',
          margin: 0,
        }}
      >
        Why 195+ Clinics Upgraded Their Checkout:
      </h2>

      {/* Side-by-Side Comparison Container */}
      <div
        style={{
          display: 'flex',
          gap: 24,
          width: '100%',
          maxWidth: 980,
        }}
      >
        {/* Left Side: Without Clinaza ❌ */}
        <div
          style={{
            flex: 1,
            transform: `translateX(${interpolate(cardLeft, [0, 1], [-40, 0])}px)`,
            opacity: cardLeft,
            background: 'rgba(15, 23, 42, 0.95)',
            border: '2px solid rgba(239, 68, 68, 0.5)',
            borderRadius: 24,
            padding: '30px 26px',
            boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 32 }}>❌</span>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#EF4444' }}>Traditional Desk</div>
          </div>

          <div style={{ fontSize: 18, fontWeight: 700, color: '#CBD5E1', lineHeight: 1.4 }}>
            • Asking ₹65k lump sum chairside
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#CBD5E1', lineHeight: 1.4 }}>
            • Offering 15–20% discounts to close
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#CBD5E1', lineHeight: 1.4 }}>
            • Risky internal clinic *khata* / debt
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#CBD5E1', lineHeight: 1.4 }}>
            • 40% patient drop-off on high ticket
          </div>
        </div>

        {/* Right Side: With Clinaza ✅ */}
        <div
          style={{
            flex: 1,
            transform: `translateX(${interpolate(cardRight, [0, 1], [40, 0])}px)`,
            opacity: cardRight,
            background: 'rgba(15, 23, 42, 0.95)',
            border: '2px solid rgba(16, 185, 129, 0.6)',
            borderRadius: 24,
            padding: '30px 26px',
            boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 32 }}>✅</span>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#10B981' }}>Clinaza Desk</div>
          </div>

          <div style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF', lineHeight: 1.4 }}>
            • Instant 3–24 month EMIs via QR
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF', lineHeight: 1.4 }}>
            • 0% Discounting: Protect full margins
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF', lineHeight: 1.4 }}>
            • 100% Upfront T+1 payout to current a/c
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF', lineHeight: 1.4 }}>
            • 0% Doctor Recourse: Banks bear risk
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Scene 3: Bank Settlement HUD & CTA ───────────────────────────────────────
const SceneSettlementAndCta: React.FC<{ fps: number }> = ({ fps }) => {
  const frame = useCurrentFrame();

  const hudPop = spring({ frame, fps, config: { damping: 13, stiffness: 100 } });
  const ctaPop = spring({ frame: frame - 40, fps, config: { damping: 12, stiffness: 100 } });

  // Animated settlement counter
  const settlementAmount = Math.round(
    interpolate(frame, [10, 60], [0, 145000], {
      extrapolateRight: 'clamp',
    })
  );

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
        gap: 32,
      }}
    >
      <span
        style={{
          fontSize: 16,
          fontWeight: 800,
          color: '#10B981',
          background: 'rgba(16, 185, 129, 0.18)',
          padding: '8px 24px',
          borderRadius: 24,
          border: '1px solid rgba(16, 185, 129, 0.4)',
        }}
      >
        AUTOMATED T+1 SETTLEMENTS
      </span>

      {/* Hospital-Grade Bank Settlement HUD */}
      <div
        style={{
          transform: `scale(${hudPop})`,
          opacity: hudPop,
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.96) 0%, rgba(30, 41, 59, 0.94) 100%)',
          border: '2px solid rgba(16, 185, 129, 0.5)',
          borderRadius: 24,
          padding: '30px 40px',
          width: '100%',
          maxWidth: 960,
          boxShadow: '0 20px 50px rgba(0,0,0,0.65)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 36 }}>🏦</span>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#FFF' }}>Clinic Current Account Payout</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#94A3B8' }}>Verified via Cancelled Cheque & Doctor PAN</div>
            </div>
          </div>
          <span style={{ fontSize: 14, fontWeight: 800, background: '#10B981', color: '#FFF', padding: '6px 14px', borderRadius: 12 }}>
            T+1 SETTLED
          </span>
        </div>

        <div style={{ fontSize: 54, fontWeight: 900, color: '#10B981', letterSpacing: '-0.02em', margin: '14px 0' }}>
          +₹{settlementAmount.toLocaleString('en-IN')}
        </div>

        <div style={{ fontSize: 16, fontWeight: 700, color: '#CBD5E1' }}>
          ⚡ 100% underwritten by Pine Labs Plural & partner banks. Zero credit risk on your clinic.
        </div>
      </div>

      {/* Call to Action Button & Activation */}
      <div
        style={{
          transform: `scale(${ctaPop})`,
          opacity: ctaPop,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div style={{ fontSize: 32, fontWeight: 900, color: '#FFFFFF', marginBottom: 16 }}>
          Activate in 24 Hours • ₹999 Setup • ₹0 AMC
        </div>

        <div
          style={{
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            color: '#FFFFFF',
            padding: '24px 50px',
            borderRadius: 28,
            fontSize: 30,
            fontWeight: 900,
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            boxShadow: '0 20px 50px rgba(16, 185, 129, 0.55)',
            marginBottom: 20,
          }}
        >
          <span style={{ fontSize: 36 }}>📲</span>
          <span>WhatsApp: +91 72929 84244</span>
        </div>

        <div style={{ fontSize: 20, fontWeight: 800, color: '#94A3B8' }}>
          Or visit <span style={{ color: '#38BDF8' }}>clinaza.in</span>
        </div>
      </div>
    </div>
  );
};