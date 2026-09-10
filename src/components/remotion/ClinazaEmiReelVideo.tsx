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
        backgroundColor: '#020617',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: '#ffffff',
        overflow: 'hidden',
      }}
    >
      {/* Background Animated Ambient Lights */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '700px',
          height: '700px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, rgba(99, 102, 241, 0.12) 50%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(8, 103, 232, 0.2) 0%, transparent 70%)',
          filter: 'blur(90px)',
        }}
      />

      {/* Top Header Floating Badge */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: 40,
          right: 40,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 50,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 20px',
            borderRadius: 999,
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          <span style={{ fontSize: 18 }}>🦷</span>
          <span style={{ fontSize: 14, fontWeight: 900, letterSpacing: '0.05em', color: '#10B981' }}>
            CLINAZA
          </span>
          <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>FINANCING</span>
        </div>

        <div
          style={{
            padding: '8px 16px',
            borderRadius: 999,
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            fontSize: 12,
            fontWeight: 800,
            color: '#34D399',
          }}
        >
          Point-of-Care EMI
        </div>
      </div>

      {/* SCENE 1: HOOK (0s - 3.5s | Frames 0 - 105) */}
      <Sequence from={0} durationInFrames={105}>
        <HookScene headline={headline} fps={fps} />
      </Sequence>

      {/* SCENE 2: THE TREATMENT COST VS EMI COMPARISON (3.5s - 8s | Frames 105 - 240) */}
      <Sequence from={105} durationInFrames={135}>
        <CostComparisonScene
          treatmentName={treatmentName}
          totalCost={totalCost}
          monthlyEmi={monthlyEmi}
          tenureMonths={tenureMonths}
          fps={fps}
        />
      </Sequence>

      {/* SCENE 3: KEY PATIENT BENEFITS & TRUST (8s - 12s | Frames 240 - 360) */}
      <Sequence from={240} durationInFrames={120}>
        <BenefitsScene benefits={benefits} partnerLendersCount={partnerLendersCount} fps={fps} />
      </Sequence>

      {/* SCENE 4: CTA & HOW TO APPLY (12s - 15s | Frames 360 - 450) */}
      <Sequence from={360} durationInFrames={90}>
        <CtaScene websiteUrl={websiteUrl} fps={fps} />
      </Sequence>
    </AbsoluteFill>
  );
};

// SCENE 1: Hook
const HookScene: React.FC<{ headline: string; fps: number }> = ({ headline, fps }) => {
  const frame = useCurrentFrame();
  const scale = spring({ frame, fps, config: { damping: 12 } });
  const opacity = interpolate(frame, [0, 15, 90, 105], [0, 1, 1, 0]);

  return (
    <AbsoluteFill
      style={{
        opacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 40px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          padding: '8px 20px',
          borderRadius: 999,
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          fontSize: 13,
          fontWeight: 800,
          color: '#F87171',
          marginBottom: 24,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}
      >
        ⚠️ Patient Fact
      </div>

      <h1
        style={{
          fontSize: 38,
          fontWeight: 900,
          lineHeight: 1.25,
          color: '#FFFFFF',
          margin: 0,
          maxWidth: '90%',
        }}
      >
        {headline}
      </h1>

      <p style={{ fontSize: 16, color: '#94A3B8', marginTop: 20, maxWidth: '80%', lineHeight: 1.5 }}>
        Get high-quality implants, aligners, and surgeries now. Pay later in small monthly installments.
      </p>
    </AbsoluteFill>
  );
};

// SCENE 2: Cost Comparison & EMI Breakdown
const CostComparisonScene: React.FC<{
  treatmentName: string;
  totalCost: number;
  monthlyEmi: number;
  tenureMonths: number;
  fps: number;
}> = ({ treatmentName, totalCost, monthlyEmi, tenureMonths, fps }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15, 120, 135], [0, 1, 1, 0]);
  const scale = spring({ frame, fps, config: { damping: 10, mass: 0.8 } });

  return (
    <AbsoluteFill
      style={{
        opacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 36px',
        textAlign: 'center',
      }}
    >
      <span
        style={{
          fontSize: 12,
          fontWeight: 900,
          color: '#34D399',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          marginBottom: 12,
        }}
      >
        Procedure: {treatmentName}
      </span>

      {/* Upfront Cost Crossout */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 24px',
          borderRadius: 16,
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: 20,
        }}
      >
        <span style={{ fontSize: 14, color: '#94A3B8' }}>Upfront Lump Sum:</span>
        <span style={{ fontSize: 18, fontWeight: 800, color: '#F87171', textDecoration: 'line-through' }}>
          ₹{totalCost.toLocaleString('en-IN')}
        </span>
      </div>

      <span style={{ fontSize: 14, fontWeight: 700, color: '#E2E8F0', marginBottom: 16 }}>
        ✨ Convert Into Easy Monthly EMI:
      </span>

      {/* Hero Animated EMI Card */}
      <div
        style={{
          transform: `scale(${scale})`,
          width: '100%',
          padding: '32px 24px',
          borderRadius: 28,
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(6, 78, 59, 0.6) 100%)',
          border: '2px solid #10B981',
          boxShadow: '0 20px 50px rgba(16, 185, 129, 0.3)',
        }}
      >
        <span style={{ fontSize: 13, color: '#A7F3D0', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.08em' }}>
          Starting At Only
        </span>
        <div style={{ fontSize: 52, fontWeight: 900, color: '#FFFFFF', margin: '8px 0' }}>
          ₹{monthlyEmi.toLocaleString('en-IN')}
          <span style={{ fontSize: 20, color: '#94A3B8', fontWeight: 600 }}> / month</span>
        </div>
        <p style={{ fontSize: 13, color: '#D1FAE5', margin: 0, fontWeight: 600 }}>
          {tenureMonths} Months Flexible Tenure &bull; Zero Collateral
        </p>
      </div>
    </AbsoluteFill>
  );
};

// SCENE 3: Benefits
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
        padding: '0 36px',
      }}
    >
      <span
        style={{
          fontSize: 12,
          fontWeight: 900,
          color: '#10B981',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: 6,
        }}
      >
        Why Patients Choose Clinaza
      </span>
      <h2 style={{ fontSize: 28, fontWeight: 900, color: '#FFFFFF', margin: '0 0 24px 0' }}>
        Instant Healthcare Credit
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {benefits.map((b, idx) => (
          <div
            key={idx}
            style={{
              padding: '16px 20px',
              borderRadius: 18,
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              fontSize: 15,
              fontWeight: 700,
              color: '#F8FAFC',
              backdropFilter: 'blur(12px)',
            }}
          >
            {b}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <span style={{ fontSize: 12, color: '#94A3B8' }}>
          Backed by {partnerLendersCount}+ Leading Indian Banks &amp; NBFC Partners
        </span>
      </div>
    </AbsoluteFill>
  );
};

// SCENE 4: CTA
const CtaScene: React.FC<{ websiteUrl: string; fps: number }> = ({ websiteUrl, fps }) => {
  const frame = useCurrentFrame();
  const scale = spring({ frame, fps, config: { damping: 12 } });
  const opacity = interpolate(frame, [0, 15], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        opacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 40px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          width: 80,
          height: 80,
          borderRadius: 26,
          background: 'linear-gradient(135deg, #10B981 0%, #0867E8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 40,
          marginBottom: 24,
          boxShadow: '0 16px 40px rgba(16, 185, 129, 0.35)',
        }}
      >
        ✨
      </div>

      <h2 style={{ fontSize: 32, fontWeight: 900, color: '#FFFFFF', margin: '0 0 10px 0' }}>
        Check Your EMI in 2 Mins
      </h2>
      <p style={{ fontSize: 15, color: '#94A3B8', margin: '0 0 28px 0', lineHeight: 1.4 }}>
        Ask your dentist for Clinaza or check your eligibility online.
      </p>

      {/* Website Button */}
      <div
        style={{
          width: '100%',
          padding: '20px 24px',
          borderRadius: 20,
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          boxShadow: '0 16px 36px rgba(16, 185, 129, 0.3)',
        }}
      >
        <span style={{ fontSize: 16, fontWeight: 900, color: '#020617', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Visit {websiteUrl} &rarr;
        </span>
      </div>

      <p style={{ fontSize: 11, color: '#64748B', marginTop: 24 }}>
        Clinaza Technologies &bull; Embedded Healthcare Patient Financing
      </p>
    </AbsoluteFill>
  );
};
