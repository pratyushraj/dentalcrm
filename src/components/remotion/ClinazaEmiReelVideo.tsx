import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from 'remotion';

export interface ClinazaEmiReelProps {
  headline?: string;
  treatmentName?: string;
  totalCost?: number;
  monthlyEmi?: number;
  tenureMonths?: number;
  benefits?: string[];
  partnerLendersCount?: number;
  websiteUrl?: string;
}

export const clinazaEmiDefaultProps: ClinazaEmiReelProps = {
  headline: "Don't Delay Your Dental Treatment Because of Cost 🦷💸",
  treatmentName: "Dental Implants & Aligners",
  totalCost: 60000,
  monthlyEmi: 2650,
  tenureMonths: 24,
  benefits: [
    '⚡ 2-Minute Instant Eligibility Check',
    '📄 100% Paperless Digital eKYC',
    '🏦 Funded by RBI-Regulated Banks & NBFCs',
    '💳 0 Down Payment Options Available'
  ],
  partnerLendersCount: 15,
  websiteUrl: 'clinaza.in',
};

export const ClinazaEmiReelComposition: React.FC<ClinazaEmiReelProps> = ({
  headline = "Don't Delay Your Dental Treatment Because of Cost 🦷💸",
  treatmentName = 'Dental Implants & Aligners',
  totalCost = 60000,
  monthlyEmi = 2650,
  tenureMonths = 24,
  benefits = [
    '⚡ 2-Minute Instant Eligibility Check',
    '📄 100% Paperless Digital eKYC',
    '🏦 Funded by RBI-Regulated Banks & NBFCs',
    '💳 0 Down Payment Options Available'
  ],
  partnerLendersCount = 15,
  websiteUrl = 'clinaza.in',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#030712',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: '#ffffff',
        overflow: 'hidden',
      }}
    >
      {/* Background Animated Dynamic Mesh & Ambient Glows */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '850px',
          height: '850px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.28) 0%, rgba(8, 103, 232, 0.2) 45%, transparent 70%)',
          filter: 'blur(110px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '5%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '750px',
          height: '750px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.22) 0%, rgba(99, 102, 241, 0.15) 50%, transparent 75%)',
          filter: 'blur(100px)',
        }}
      />

      {/* Persistent High-Impact Top Header Glass Navigation */}
      <div
        style={{
          position: 'absolute',
          top: 70,
          left: 50,
          right: 50,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 60,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 24px',
            borderRadius: 999,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(20px)',
            border: '1.5px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
          }}
        >
          <span style={{ fontSize: 24 }}>🦷</span>
          <div>
            <span style={{ fontSize: 18, fontWeight: 900, letterSpacing: '0.08em', color: '#10B981', display: 'block', lineHeight: 1.1 }}>
              CLINAZA
            </span>
            <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Healthcare EMI
            </span>
          </div>
        </div>

        <div
          style={{
            padding: '10px 20px',
            borderRadius: 999,
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            border: '1.5px solid rgba(16, 185, 129, 0.45)',
            fontSize: 14,
            fontWeight: 800,
            color: '#34D399',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.25)',
          }}
        >
          0% Interest EMI
        </div>
      </div>

      {/* SCENE 1: VIRAL HOOK & PATIENT PROBLEM (0s - 3.5s | Frames 0 - 105) */}
      <Sequence from={0} durationInFrames={105}>
        <HookScene headline={headline} fps={fps} />
      </Sequence>

      {/* SCENE 2: TREATMENT & DRAMATIC COST TO EMI REVEAL (3.5s - 8s | Frames 105 - 240) */}
      <Sequence from={105} durationInFrames={135}>
        <CostComparisonScene
          treatmentName={treatmentName}
          totalCost={totalCost}
          monthlyEmi={monthlyEmi}
          tenureMonths={tenureMonths}
          fps={fps}
        />
      </Sequence>

      {/* SCENE 3: RICH BENEFITS & BANK TRUST ECOSYSTEM (8s - 12s | Frames 240 - 360) */}
      <Sequence from={240} durationInFrames={120}>
        <BenefitsScene benefits={benefits} partnerLendersCount={partnerLendersCount} fps={fps} />
      </Sequence>

      {/* SCENE 4: HIGH-CONVERSION CTA & HOW TO APPLY (12s - 15s | Frames 360 - 450) */}
      <Sequence from={360} durationInFrames={90}>
        <CtaScene websiteUrl={websiteUrl} fps={fps} />
      </Sequence>
    </AbsoluteFill>
  );
};

// =========================================================================
// SCENE 1: HOOK (DENSE, VIBRANT, FULL-SCREEN 1080x1920)
// =========================================================================
const HookScene: React.FC<{ headline: string; fps: number }> = ({ headline, fps }) => {
  const frame = useCurrentFrame();
  const scale = spring({ frame, fps, config: { damping: 10, mass: 0.8 } });
  const opacity = interpolate(frame, [0, 15, 90, 105], [0, 1, 1, 0]);

  return (
    <AbsoluteFill
      style={{
        opacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '180px 50px 100px 50px',
        textAlign: 'center',
        gap: 28,
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          padding: '12px 28px',
          borderRadius: 999,
          backgroundColor: 'rgba(239, 68, 68, 0.18)',
          border: '1.5px solid rgba(239, 68, 68, 0.4)',
          fontSize: 16,
          fontWeight: 800,
          color: '#F87171',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          boxShadow: '0 0 25px rgba(239, 68, 68, 0.25)',
        }}
      >
        ⚠️ Patient Notice &bull; Don't Delay
      </div>

      <h1
        style={{
          fontSize: 52,
          fontWeight: 900,
          lineHeight: 1.18,
          color: '#FFFFFF',
          margin: 0,
          maxWidth: '100%',
          letterSpacing: '-0.02em',
          textShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}
      >
        {headline}
      </h1>

      {/* Visual Contrast Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
          width: '100%',
          marginTop: 10,
        }}
      >
        <div
          style={{
            padding: '24px 18px',
            borderRadius: 24,
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            border: '1.5px solid rgba(239, 68, 68, 0.25)',
            textAlign: 'left',
          }}
        >
          <div style={{ fontSize: 26, marginBottom: 8 }}>❌ Delaying Care</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#FECACA', lineHeight: 1.3 }}>
            Pain worsens, infections spread &amp; costs multiply
          </div>
        </div>

        <div
          style={{
            padding: '24px 18px',
            borderRadius: 24,
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            border: '1.5px solid rgba(16, 185, 129, 0.35)',
            textAlign: 'left',
          }}
        >
          <div style={{ fontSize: 26, marginBottom: 8 }}>✅ Clinaza EMI</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#A7F3D0', lineHeight: 1.3 }}>
            Start treatment immediately with easy monthly EMIs
          </div>
        </div>
      </div>

      {/* Bottom Trust Line */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '14px 24px',
          borderRadius: 18,
          backgroundColor: 'rgba(255, 255, 255, 0.07)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          fontSize: 16,
          color: '#CBD5E1',
          fontWeight: 600,
        }}
      >
        <span>🏥 Available at 50+ Top Partner Clinics Across India</span>
      </div>
    </AbsoluteFill>
  );
};

// =========================================================================
// SCENE 2: COST TRANSFORMATION (BIG, BOLD, VIBRANT CARD REVEAL)
// =========================================================================
const CostComparisonScene: React.FC<{
  treatmentName: string;
  totalCost: number;
  monthlyEmi: number;
  tenureMonths: number;
  fps: number;
}> = ({ treatmentName, totalCost, monthlyEmi, tenureMonths, fps }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15, 120, 135], [0, 1, 1, 0]);
  const scale = spring({ frame, fps, config: { damping: 9, mass: 0.7 } });

  return (
    <AbsoluteFill
      style={{
        opacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '170px 50px 100px 50px',
        textAlign: 'center',
        gap: 22,
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 22px',
          borderRadius: 999,
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          border: '1.5px solid rgba(16, 185, 129, 0.35)',
          fontSize: 15,
          fontWeight: 900,
          color: '#34D399',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        ✨ Treatment: {treatmentName}
      </div>

      {/* Upfront Lump Sum Crossout Card */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '18px 28px',
          borderRadius: 22,
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          border: '1.5px solid rgba(255, 255, 255, 0.12)',
        }}
      >
        <span style={{ fontSize: 18, color: '#94A3B8', fontWeight: 600 }}>Standard Lump Sum Fee:</span>
        <span style={{ fontSize: 28, fontWeight: 900, color: '#F87171', textDecoration: 'line-through' }}>
          ₹{totalCost.toLocaleString('en-IN')}
        </span>
      </div>

      {/* Hero Animated EMI Card - Takes Prime Visual Focus */}
      <div
        style={{
          transform: `scale(${scale})`,
          width: '100%',
          padding: '40px 30px',
          borderRadius: 36,
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(6, 78, 59, 0.85) 60%, rgba(2, 44, 34, 0.95) 100%)',
          border: '2.5px solid #10B981',
          boxShadow: '0 25px 60px rgba(16, 185, 129, 0.35), 0 0 40px rgba(16, 185, 129, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            padding: '6px 18px',
            borderRadius: 999,
            backgroundColor: '#10B981',
            color: '#020617',
            fontSize: 14,
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          Special Subvention EMI
        </div>

        <span style={{ fontSize: 16, color: '#D1FAE5', fontWeight: 700, marginTop: 4 }}>
          Pay In Low Monthly Installments
        </span>

        <div style={{ fontSize: 74, fontWeight: 900, color: '#FFFFFF', lineHeight: 1, margin: '8px 0', letterSpacing: '-0.03em' }}>
          ₹{monthlyEmi.toLocaleString('en-IN')}
          <span style={{ fontSize: 24, color: '#A7F3D0', fontWeight: 700 }}> / mo</span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
            width: '100%',
            marginTop: 12,
            paddingTop: 16,
            borderTop: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          <div style={{ padding: '10px', borderRadius: 14, backgroundColor: 'rgba(0,0,0,0.25)', textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: '#94A3B8' }}>Tenure</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF' }}>{tenureMonths} Months</div>
          </div>
          <div style={{ padding: '10px', borderRadius: 14, backgroundColor: 'rgba(0,0,0,0.25)', textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: '#94A3B8' }}>Down Payment</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#34D399' }}>₹0 Upfront</div>
          </div>
        </div>
      </div>

      <div style={{ fontSize: 15, color: '#94A3B8', fontWeight: 600 }}>
        ⚡ No heavy credit card block &bull; Instant e-NACH auto-debit
      </div>
    </AbsoluteFill>
  );
};

// =========================================================================
// SCENE 3: KEY PATIENT BENEFITS & 15+ LENDER ECOSYSTEM (RICH CARDS)
// =========================================================================
const BenefitsScene: React.FC<{
  benefits: string[];
  partnerLendersCount: number;
  fps: number;
}> = ({ benefits, partnerLendersCount, fps }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15, 105, 120], [0, 1, 1, 0]);

  return (
    <AbsoluteFill
      style={{
        opacity,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '170px 50px 100px 50px',
        gap: 20,
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <span
          style={{
            fontSize: 14,
            fontWeight: 900,
            color: '#10B981',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            display: 'block',
            marginBottom: 6,
          }}
        >
          Why Choose Clinaza
        </span>
        <h2 style={{ fontSize: 44, fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
          Point-of-Care Health Lending
        </h2>
      </div>

      {/* Itemized Benefit Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {benefits.map((b, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '20px 24px',
              borderRadius: 22,
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              border: '1.5px solid rgba(255, 255, 255, 0.14)',
              fontSize: 19,
              fontWeight: 800,
              color: '#F8FAFC',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
            }}
          >
            {b}
          </div>
        ))}
      </div>

      {/* Bank Partner Trust Strip */}
      <div
        style={{
          marginTop: 10,
          padding: '18px 24px',
          borderRadius: 22,
          backgroundColor: 'rgba(8, 103, 232, 0.15)',
          border: '1.5px solid rgba(8, 103, 232, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: 17, fontWeight: 900, color: '#FFFFFF' }}>
            {partnerLendersCount}+ Leading Bank &amp; NBFC Partners
          </div>
          <div style={{ fontSize: 13, color: '#93C5FD', fontWeight: 600 }}>
            HDFC &bull; ICICI &bull; Axis &bull; Bajaj &bull; Tata Capital &bull; Piramal
          </div>
        </div>
        <span style={{ fontSize: 28 }}>🏛️</span>
      </div>
    </AbsoluteFill>
  );
};

// =========================================================================
// SCENE 4: CTA (VIBRANT, DENSE, HIGH-URGENCY CONVERSION)
// =========================================================================
const CtaScene: React.FC<{ websiteUrl: string; fps: number }> = ({ websiteUrl, fps }) => {
  const frame = useCurrentFrame();
  const scale = spring({ frame, fps, config: { damping: 10, mass: 0.8 } });
  const opacity = interpolate(frame, [0, 15], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        opacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '170px 50px 100px 50px',
        textAlign: 'center',
        gap: 24,
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          width: 96,
          height: 96,
          borderRadius: 32,
          background: 'linear-gradient(135deg, #10B981 0%, #0867E8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 48,
          boxShadow: '0 20px 50px rgba(16, 185, 129, 0.45)',
        }}
      >
        ✨
      </div>

      <div>
        <h2 style={{ fontSize: 46, fontWeight: 900, color: '#FFFFFF', margin: '0 0 10px 0', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
          Get Started in 2 Minutes
        </h2>
        <p style={{ fontSize: 18, color: '#CBD5E1', margin: 0, lineHeight: 1.4, maxWidth: '90%' }}>
          Ask your dentist for Clinaza or check your treatment EMI eligibility online.
        </p>
      </div>

      {/* Website Button */}
      <div
        style={{
          width: '100%',
          padding: '26px 30px',
          borderRadius: 26,
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          boxShadow: '0 20px 50px rgba(16, 185, 129, 0.4)',
        }}
      >
        <span style={{ fontSize: 22, fontWeight: 900, color: '#020617', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Visit {websiteUrl} &rarr;
        </span>
      </div>

      {/* Trust Details Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 14,
          width: '100%',
        }}
      >
        <div style={{ padding: '16px', borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: 20 }}>⚡ Instant</div>
          <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 4 }}>2-min paperless check</div>
        </div>
        <div style={{ padding: '16px', borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: 20 }}>🛡️ Safe</div>
          <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 4 }}>100% RBI regulated</div>
        </div>
      </div>

      <p style={{ fontSize: 13, color: '#64748B', margin: 0, fontWeight: 600 }}>
        Clinaza Technologies &bull; Embedded Healthcare Patient Financing
      </p>
    </AbsoluteFill>
  );
};
