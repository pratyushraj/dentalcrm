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
  headline: "Get Patient EMI in Just a Few Steps 🦷✨",
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
  headline = "Get Patient EMI in Just a Few Steps 🦷✨",
  treatmentName = 'Dental Implants & Aligners',
  totalCost = 60000,
  monthlyEmi = 2650,
  tenureMonths = 24,
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
      {/* Background Animated Dynamic Glows */}
      <div
        style={{
          position: 'absolute',
          top: '25%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '900px',
          height: '900px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(8, 103, 232, 0.22) 40%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '800px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, rgba(14, 165, 233, 0.18) 50%, transparent 75%)',
          filter: 'blur(110px)',
        }}
      />

      {/* Top Persistent Header Navigation */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: 45,
          right: 45,
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
            gap: 14,
            padding: '12px 24px',
            borderRadius: 999,
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1.5px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
          }}
        >
          <span style={{ fontSize: 26 }}>🦷</span>
          <div>
            <span style={{ fontSize: 20, fontWeight: 900, letterSpacing: '0.06em', color: '#10B981', display: 'block', lineHeight: 1 }}>
              CLINAZA
            </span>
            <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Patient Financing
            </span>
          </div>
        </div>

        <div
          style={{
            padding: '10px 22px',
            borderRadius: 999,
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            border: '1.5px solid rgba(16, 185, 129, 0.45)',
            fontSize: 15,
            fontWeight: 800,
            color: '#34D399',
            boxShadow: '0 0 25px rgba(16, 185, 129, 0.3)',
          }}
        >
          ₹30,000 – ₹3,00,000
        </div>
      </div>

      {/* SCENE 1: HOOK & VALUE PROP (0s - 3s | Frames 0 - 90) */}
      <Sequence from={0} durationInFrames={90}>
        <HookScene headline={headline} treatmentName={treatmentName} totalCost={totalCost} monthlyEmi={monthlyEmi} fps={fps} />
      </Sequence>

      {/* SCENE 2: THE 5 STEPS APPLICATION FLOW (3s - 12s | Frames 90 - 360) */}
      <Sequence from={90} durationInFrames={270}>
        <StepByStepFlowScene fps={fps} />
      </Sequence>

      {/* SCENE 3: FINAL CTA & HOW TO APPLY (12s - 15s | Frames 360 - 450) */}
      <Sequence from={360} durationInFrames={90}>
        <CtaScene websiteUrl={websiteUrl} partnerLendersCount={partnerLendersCount} fps={fps} />
      </Sequence>
    </AbsoluteFill>
  );
};

// =========================================================================
// SCENE 1: HOOK & VALUE PROP
// =========================================================================
const HookScene: React.FC<{
  headline: string;
  treatmentName: string;
  totalCost: number;
  monthlyEmi: number;
  fps: number;
}> = ({ headline, treatmentName, totalCost, monthlyEmi, fps }) => {
  const frame = useCurrentFrame();
  const scale = spring({ frame, fps, config: { damping: 10, mass: 0.8 } });
  const opacity = interpolate(frame, [0, 15, 75, 90], [0, 1, 1, 0]);

  return (
    <AbsoluteFill
      style={{
        opacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '160px 50px 80px 50px',
        textAlign: 'center',
        gap: 24,
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          padding: '12px 28px',
          borderRadius: 999,
          backgroundColor: 'rgba(8, 103, 232, 0.2)',
          border: '1.5px solid rgba(8, 103, 232, 0.45)',
          fontSize: 16,
          fontWeight: 800,
          color: '#60A5FA',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}
      >
        ✨ For Patients &amp; Clinics
      </div>

      <h1
        style={{
          fontSize: 54,
          fontWeight: 900,
          lineHeight: 1.15,
          color: '#FFFFFF',
          margin: 0,
          letterSpacing: '-0.02em',
        }}
      >
        {headline}
      </h1>

      <p style={{ fontSize: 20, color: '#94A3B8', margin: 0, maxWidth: '90%', lineHeight: 1.4 }}>
        Help your patients say <strong style={{ color: '#34D399' }}>"Yes"</strong> to the treatment they need with 2-min digital EMI.
      </p>

      {/* 3 Core Highlights from Poster */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 14,
          width: '100%',
          marginTop: 8,
        }}
      >
        <div style={{ padding: '22px 14px', borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.12)', textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>👥</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#FFFFFF' }}>₹30K – ₹3L</div>
          <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>Loan Amount</div>
        </div>

        <div style={{ padding: '22px 14px', borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.12)', textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>⚡</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#34D399' }}>2 Minutes</div>
          <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>Quick Process</div>
        </div>

        <div style={{ padding: '22px 14px', borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.12)', textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>💳</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#60A5FA' }}>15+ Lenders</div>
          <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>Banks &amp; NBFCs</div>
        </div>
      </div>

      {/* Price Transformation Card */}
      <div
        style={{
          width: '100%',
          padding: '24px 30px',
          borderRadius: 24,
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(6, 78, 59, 0.7) 100%)',
          border: '2px solid #10B981',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: 14, color: '#A7F3D0', fontWeight: 700 }}>{treatmentName}</div>
          <div style={{ fontSize: 16, color: '#F87171', textDecoration: 'line-through' }}>₹{totalCost.toLocaleString('en-IN')} upfront</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, color: '#94A3B8', textTransform: 'uppercase', fontWeight: 800 }}>Only</div>
          <div style={{ fontSize: 36, fontWeight: 900, color: '#FFFFFF' }}>
            ₹{monthlyEmi.toLocaleString('en-IN')} <span style={{ fontSize: 18, color: '#A7F3D0' }}>/ mo</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// =========================================================================
// SCENE 2: INTERACTIVE 5-STEP PHONE UI CAROUSEL (EXACT POSTER FLOW)
// =========================================================================
const StepByStepFlowScene: React.FC<{ fps: number }> = ({ fps }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15, 255, 270], [0, 1, 1, 0]);

  // Total 270 frames (9s). We switch active step every ~50 frames.
  // Step 1: 0-50, Step 2: 50-100, Step 3: 100-150, Step 4: 150-200, Step 5: 200-270
  let activeStep = 1;
  if (frame >= 200) activeStep = 5;
  else if (frame >= 150) activeStep = 4;
  else if (frame >= 100) activeStep = 3;
  else if (frame >= 50) activeStep = 2;

  const steps = [
    {
      num: 1,
      title: 'Open Website',
      sub: 'Go to clinaza.in & click Apply Now',
      screenTitle: 'Dental Treatment Financing',
      screenBadge: 'Made Simple',
      screenCta: 'Apply Now →',
      screenDetail: 'Instant 2-minute digital check for Implants & Aligners'
    },
    {
      num: 2,
      title: 'Enter Mobile Number',
      sub: "Enter patient's phone number",
      screenTitle: 'Apply for Treatment Loan',
      screenBadge: 'Up to ₹3,00,000',
      screenCta: 'Send OTP',
      screenDetail: '+91 99999 99999'
    },
    {
      num: 3,
      title: 'Verify OTP',
      sub: 'Patient enters 6-digit OTP',
      screenTitle: 'Verify OTP',
      screenBadge: 'OTP sent to mobile',
      screenCta: 'Verify OTP',
      screenDetail: '• • • • • •  (Auto-verified)'
    },
    {
      num: 4,
      title: 'Fill Basic Details',
      sub: 'Name, DOB, City & Treatment',
      screenTitle: 'Patient Details',
      screenBadge: 'Quick 1-Minute eKYC',
      screenCta: 'Proceed to Offers',
      screenDetail: 'Rahul Sharma • Patna • Dental Implants'
    },
    {
      num: 5,
      title: 'Check Loan Options',
      sub: 'Choose best EMI offer & proceed',
      screenTitle: 'Eligible Loan Offers',
      screenBadge: 'Instant Approval',
      screenCta: 'Select & Continue',
      screenDetail: '₹50,000 (₹4,542/mo) • ₹1,00,000 (₹6,321/mo)'
    }
  ];

  const current = steps[activeStep - 1];

  return (
    <AbsoluteFill
      style={{
        opacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '150px 45px 60px 45px',
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
            marginBottom: 4,
          }}
        >
          Takes Less Than 2 Minutes
        </span>
        <h2 style={{ fontSize: 44, fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
          How to Apply on <span style={{ color: '#38BDF8' }}>clinaza.in</span>
        </h2>
      </div>

      {/* 5 Step Indicator Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 10,
          width: '100%',
        }}
      >
        {steps.map((s) => {
          const isCurrent = s.num === activeStep;
          const isPassed = s.num < activeStep;
          return (
            <div
              key={s.num}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 999,
                  backgroundColor: isCurrent ? '#10B981' : isPassed ? '#059669' : 'rgba(255,255,255,0.1)',
                  color: isCurrent || isPassed ? '#020617' : '#94A3B8',
                  fontSize: 18,
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: isCurrent ? '2px solid #FFFFFF' : 'none',
                  boxShadow: isCurrent ? '0 0 20px rgba(16, 185, 129, 0.6)' : 'none',
                  transition: 'all 0.3s ease',
                }}
              >
                {isPassed ? '✓' : s.num}
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: isCurrent ? 800 : 600,
                  color: isCurrent ? '#34D399' : '#64748B',
                  textAlign: 'center',
                  lineHeight: 1.1,
                }}
              >
                Step {s.num}
              </span>
            </div>
          );
        })}
      </div>

      {/* Active Step Headline Card */}
      <div
        style={{
          width: '100%',
          padding: '16px 24px',
          borderRadius: 20,
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          border: '1.5px solid rgba(56, 189, 248, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontSize: 13, color: '#38BDF8', fontWeight: 800, textTransform: 'uppercase' }}>
            STEP {current.num} OF 5
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF' }}>{current.title}</div>
          <div style={{ fontSize: 14, color: '#94A3B8', marginTop: 2 }}>{current.sub}</div>
        </div>
        <div style={{ fontSize: 36 }}>
          {current.num === 1 ? '🌐' : current.num === 2 ? '📱' : current.num === 3 ? '🔒' : current.num === 4 ? '📋' : '🎉'}
        </div>
      </div>

      {/* Authentic High-Resolution Phone Mockup Frame */}
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          height: '560px',
          borderRadius: '40px',
          backgroundColor: '#090E17',
          border: '4px solid #1E293B',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 35px rgba(8, 103, 232, 0.25)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Dynamic Island Notch */}
        <div
          style={{
            width: '140px',
            height: '24px',
            backgroundColor: '#000000',
            borderRadius: '999px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 12px',
          }}
        >
          <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#1E293B' }} />
          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#0284C7' }} />
        </div>

        {/* Screen Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 4px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 14 }}>🔒</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#38BDF8' }}>clinaza.in/emi</span>
          </div>
          <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 999, backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34D399', fontWeight: 800 }}>
            Step {current.num}/5
          </span>
        </div>

        {/* Dynamic Screen Content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 16,
            padding: '10px 6px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              padding: '6px 16px',
              borderRadius: 999,
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              color: '#38BDF8',
              fontSize: 13,
              fontWeight: 800,
              display: 'inline-block',
              margin: '0 auto',
            }}
          >
            {current.screenBadge}
          </div>

          <div style={{ fontSize: 30, fontWeight: 900, color: '#FFFFFF', lineHeight: 1.2 }}>
            {current.screenTitle}
          </div>

          {/* Interactive Screen Preview Box */}
          <div
            style={{
              padding: '20px',
              borderRadius: 20,
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1.5px solid rgba(255,255,255,0.12)',
              fontSize: 17,
              fontWeight: 800,
              color: '#E2E8F0',
            }}
          >
            {current.screenDetail}
          </div>
        </div>

        {/* Action Button inside Phone */}
        <div
          style={{
            padding: '18px',
            borderRadius: 18,
            backgroundColor: '#4F46E5',
            color: '#FFFFFF',
            fontSize: 17,
            fontWeight: 900,
            textAlign: 'center',
            boxShadow: '0 8px 25px rgba(79, 70, 229, 0.4)',
          }}
        >
          {current.screenCta}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// =========================================================================
// SCENE 3: FINAL CTA & HOW TO APPLY (HIGH-CONVERSION)
// =========================================================================
const CtaScene: React.FC<{
  websiteUrl: string;
  partnerLendersCount: number;
  fps: number;
}> = ({ websiteUrl, partnerLendersCount, fps }) => {
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
        padding: '160px 45px 80px 45px',
        textAlign: 'center',
        gap: 22,
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
        <h2 style={{ fontSize: 48, fontWeight: 900, color: '#FFFFFF', margin: '0 0 10px 0', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
          Get Patient EMI Today
        </h2>
        <p style={{ fontSize: 18, color: '#CBD5E1', margin: 0, lineHeight: 1.4, maxWidth: '90%' }}>
          Help your patients say "Yes" to treatments with instant digital financing.
        </p>
      </div>

      {/* Main Website CTA */}
      <div
        style={{
          width: '100%',
          padding: '24px 30px',
          borderRadius: 24,
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          boxShadow: '0 20px 50px rgba(16, 185, 129, 0.4)',
        }}
      >
        <span style={{ fontSize: 24, fontWeight: 900, color: '#020617', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Visit {websiteUrl} &rarr;
        </span>
      </div>

      {/* 4 Trust Highlights from Poster Footer */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          width: '100%',
        }}
      >
        <div style={{ padding: '14px', borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF' }}>⏱️ Quick &amp; Easy</div>
          <div style={{ fontSize: 12, color: '#94A3B8' }}>Takes less than 2 mins</div>
        </div>

        <div style={{ padding: '14px', borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF' }}>📄 No Paperwork</div>
          <div style={{ fontSize: 12, color: '#94A3B8' }}>100% digital eKYC</div>
        </div>

        <div style={{ padding: '14px', borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF' }}>🏦 {partnerLendersCount}+ Lenders</div>
          <div style={{ fontSize: 12, color: '#94A3B8' }}>Best EMI options</div>
        </div>

        <div style={{ padding: '14px', borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF' }}>📈 Higher Acceptance</div>
          <div style={{ fontSize: 12, color: '#94A3B8' }}>Convert more treatments</div>
        </div>
      </div>

      {/* Direct WhatsApp Callout */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '12px 20px',
          borderRadius: 16,
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          fontSize: 14,
          fontWeight: 800,
          color: '#34D399',
        }}
      >
        <span>📞 Call or WhatsApp: 7292984244</span>
      </div>
    </AbsoluteFill>
  );
};
