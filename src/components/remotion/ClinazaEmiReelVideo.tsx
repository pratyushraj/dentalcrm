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
        backgroundColor: '#020617',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: '#ffffff',
        overflow: 'hidden',
        width: 1080,
        height: 1920,
      }}
    >
      {/* Dynamic Animated Ambient Mesh Glows */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '1200px',
          height: '1200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.35) 0%, rgba(8, 103, 232, 0.25) 45%, transparent 70%)',
          filter: 'blur(120px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '1100px',
          height: '1100px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.28) 0%, rgba(14, 165, 233, 0.22) 50%, transparent 75%)',
          filter: 'blur(130px)',
        }}
      />

      {/* Top Persistent Header Bar */}
      <div
        style={{
          position: 'absolute',
          top: 70,
          left: 60,
          right: 60,
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
            gap: 16,
            padding: '16px 32px',
            borderRadius: 999,
            backgroundColor: 'rgba(15, 23, 42, 0.88)',
            backdropFilter: 'blur(25px)',
            border: '2px solid rgba(255, 255, 255, 0.18)',
            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.5)',
          }}
        >
          <span style={{ fontSize: 32 }}>🦷</span>
          <div>
            <span style={{ fontSize: 26, fontWeight: 900, letterSpacing: '0.06em', color: '#10B981', display: 'block', lineHeight: 1.1 }}>
              CLINAZA
            </span>
            <span style={{ fontSize: 13, color: '#94A3B8', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Patient Financing
            </span>
          </div>
        </div>

        <div
          style={{
            padding: '14px 30px',
            borderRadius: 999,
            backgroundColor: 'rgba(16, 185, 129, 0.22)',
            border: '2px solid rgba(16, 185, 129, 0.55)',
            fontSize: 20,
            fontWeight: 900,
            color: '#34D399',
            boxShadow: '0 0 30px rgba(16, 185, 129, 0.35)',
          }}
        >
          ₹30K – ₹3 Lakhs
        </div>
      </div>

      {/* SCENE 1: HOOK & VALUE PROP (0s - 3s | Frames 0 - 90) */}
      <Sequence from={0} durationInFrames={90}>
        <HookScene headline={headline} treatmentName={treatmentName} totalCost={totalCost} monthlyEmi={monthlyEmi} fps={fps} />
      </Sequence>

      {/* SCENE 2: FULL-SCREEN 5-STEP PHONE DEMO (3s - 12s | Frames 90 - 360) */}
      <Sequence from={90} durationInFrames={270}>
        <StepByStepFlowScene fps={fps} />
      </Sequence>

      {/* SCENE 3: FINAL CALL TO ACTION (12s - 15s | Frames 360 - 450) */}
      <Sequence from={360} durationInFrames={90}>
        <CtaScene websiteUrl={websiteUrl} partnerLendersCount={partnerLendersCount} fps={fps} />
      </Sequence>
    </AbsoluteFill>
  );
};

// =========================================================================
// SCENE 1: FULL 1080x1920 BLEED HOOK & VALUE PROPOSITION
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
        justifyContent: 'space-between',
        padding: '210px 70px 140px 70px',
        textAlign: 'center',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <div
          style={{
            transform: `scale(${scale})`,
            padding: '16px 36px',
            borderRadius: 999,
            backgroundColor: 'rgba(8, 103, 232, 0.25)',
            border: '2px solid rgba(8, 103, 232, 0.5)',
            fontSize: 20,
            fontWeight: 900,
            color: '#60A5FA',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
          }}
        >
          ✨ Healthcare Patient EMI
        </div>

        <h1
          style={{
            fontSize: 66,
            fontWeight: 900,
            lineHeight: 1.15,
            color: '#FFFFFF',
            margin: 0,
            letterSpacing: '-0.02em',
          }}
        >
          {headline}
        </h1>

        <p style={{ fontSize: 26, color: '#94A3B8', margin: 0, maxWidth: '95%', lineHeight: 1.4, fontWeight: 600 }}>
          Help your patients say <strong style={{ color: '#34D399' }}>"Yes"</strong> to the treatments they need with 2-minute digital EMI.
        </p>
      </div>

      {/* 3 Large Highlight Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 20,
          width: '100%',
        }}
      >
        <div style={{ padding: '36px 20px', borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.07)', border: '2px solid rgba(255,255,255,0.15)', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>👥</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: '#FFFFFF' }}>₹30K – ₹3L</div>
          <div style={{ fontSize: 16, color: '#94A3B8', marginTop: 6, fontWeight: 700 }}>Loan Amount</div>
        </div>

        <div style={{ padding: '36px 20px', borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.07)', border: '2px solid rgba(255,255,255,0.15)', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>⚡</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: '#34D399' }}>2 Minutes</div>
          <div style={{ fontSize: 16, color: '#94A3B8', marginTop: 6, fontWeight: 700 }}>Instant Digital</div>
        </div>

        <div style={{ padding: '36px 20px', borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.07)', border: '2px solid rgba(255,255,255,0.15)', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🏦</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: '#60A5FA' }}>15+ Banks</div>
          <div style={{ fontSize: 16, color: '#94A3B8', marginTop: 6, fontWeight: 700 }}>RBI Regulated</div>
        </div>
      </div>

      {/* Price Transformation Card */}
      <div
        style={{
          width: '100%',
          padding: '36px 44px',
          borderRadius: 36,
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(6, 78, 59, 0.85) 100%)',
          border: '3px solid #10B981',
          boxShadow: '0 25px 60px rgba(16, 185, 129, 0.4)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: 20, color: '#A7F3D0', fontWeight: 800 }}>{treatmentName}</div>
          <div style={{ fontSize: 24, color: '#F87171', textDecoration: 'line-through', marginTop: 4, fontWeight: 700 }}>
            ₹{totalCost.toLocaleString('en-IN')} upfront
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 16, color: '#D1FAE5', textTransform: 'uppercase', fontWeight: 800 }}>Converted into EMI</div>
          <div style={{ fontSize: 52, fontWeight: 900, color: '#FFFFFF', lineHeight: 1.1 }}>
            ₹{monthlyEmi.toLocaleString('en-IN')} <span style={{ fontSize: 24, color: '#A7F3D0' }}>/ month</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// =========================================================================
// SCENE 2: MASSIVE FULL-HEIGHT 5-STEP PHONE DEMO (NO EMPTY SPACE)
// =========================================================================
const StepByStepFlowScene: React.FC<{ fps: number }> = ({ fps }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15, 255, 270], [0, 1, 1, 0]);

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
      screenIcon: '🌐',
      screenTitle: 'Dental Treatment Financing',
      screenBadge: 'Made Simple',
      screenCta: 'Apply Now →',
      screenFields: [
        { label: 'Instant Approval', value: '2-Minute Digital Check' },
        { label: 'Coverage', value: 'Implants, Aligners & Surgeries' },
        { label: 'Down Payment', value: '₹0 Upfront Available' }
      ]
    },
    {
      num: 2,
      title: 'Enter Patient Mobile',
      sub: 'Enter patient phone for instant OTP',
      screenIcon: '📱',
      screenTitle: 'Apply for Treatment Loan',
      screenBadge: 'Up to ₹3,00,000',
      screenCta: 'Send OTP →',
      screenFields: [
        { label: 'Patient Mobile Number', value: '+91 98765 43210' },
        { label: 'Verification', value: 'Direct SMS OTP verification' },
        { label: 'Privacy', value: '100% Secure & RBI Compliant' }
      ]
    },
    {
      num: 3,
      title: 'Verify OTP',
      sub: 'Patient inputs 6-digit secure code',
      screenIcon: '🔒',
      screenTitle: 'Verify Secure OTP',
      screenBadge: 'OTP Sent to Mobile',
      screenCta: 'Verify & Continue →',
      screenFields: [
        { label: 'Enter 6-Digit OTP', value: '8  4  2  9  1  5' },
        { label: 'Status', value: 'Verified in Real-Time ⚡' },
        { label: 'Resend', value: 'Resend OTP in 00:25' }
      ]
    },
    {
      num: 4,
      title: 'Fill Basic Details',
      sub: 'Name, DOB, City & Treatment Type',
      screenIcon: '📋',
      screenTitle: 'Patient EMR Details',
      screenBadge: '1-Minute Paperless KYC',
      screenCta: 'Proceed to Loan Offers →',
      screenFields: [
        { label: 'Full Name', value: 'Rahul Sharma (32M)' },
        { label: 'City & Clinic', value: 'Patna • YOUR DENTIST' },
        { label: 'Treatment Required', value: 'Dental Implants + Crown' }
      ]
    },
    {
      num: 5,
      title: 'Check Loan Options',
      sub: 'Select best EMI plan & proceed',
      screenIcon: '🎉',
      screenTitle: 'Eligible Bank & NBFC Offers',
      screenBadge: 'Instant Sanction Ready',
      screenCta: 'Select & Disburse →',
      screenFields: [
        { label: 'Option A (12 Months)', value: '₹50,000 → ₹4,542 / mo' },
        { label: 'Option B (18 Months)', value: '₹1,00,000 → ₹6,321 / mo' },
        { label: 'Option C (24 Months)', value: '₹2,00,000 → ₹9,843 / mo' }
      ]
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
        justifyContent: 'space-between',
        padding: '190px 60px 100px 60px',
        gap: 20,
      }}
    >
      {/* Top Header & 5-Step Bar */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{ textAlign: 'center' }}>
          <span
            style={{
              fontSize: 16,
              fontWeight: 900,
              color: '#10B981',
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              display: 'block',
              marginBottom: 6,
            }}
          >
            Takes Less Than 2 Minutes
          </span>
          <h2 style={{ fontSize: 52, fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
            How to Apply on <span style={{ color: '#38BDF8' }}>clinaza.in</span>
          </h2>
        </div>

        {/* 5-Step Progress Tabs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 14,
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
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: 999,
                    backgroundColor: isCurrent ? '#10B981' : isPassed ? '#059669' : 'rgba(255,255,255,0.1)',
                    color: isCurrent || isPassed ? '#020617' : '#94A3B8',
                    fontSize: 24,
                    fontWeight: 900,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: isCurrent ? '3px solid #FFFFFF' : 'none',
                    boxShadow: isCurrent ? '0 0 30px rgba(16, 185, 129, 0.7)' : 'none',
                  }}
                >
                  {isPassed ? '✓' : s.num}
                </div>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: isCurrent ? 900 : 700,
                    color: isCurrent ? '#34D399' : '#64748B',
                    textAlign: 'center',
                  }}
                >
                  Step {s.num}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Step Indicator Pill */}
      <div
        style={{
          width: '100%',
          padding: '20px 32px',
          borderRadius: 24,
          backgroundColor: 'rgba(15, 23, 42, 0.92)',
          border: '2px solid rgba(56, 189, 248, 0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontSize: 15, color: '#38BDF8', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            STEP {current.num} OF 5
          </div>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#FFFFFF', marginTop: 2 }}>{current.title}</div>
          <div style={{ fontSize: 18, color: '#94A3B8', marginTop: 2 }}>{current.sub}</div>
        </div>
        <div style={{ fontSize: 50 }}>{current.screenIcon}</div>
      </div>

      {/* HUGE Full-Scale Realistic Phone Container (Fills Entire Mid-Screen) */}
      <div
        style={{
          width: '100%',
          height: '840px',
          borderRadius: '52px',
          backgroundColor: '#090E17',
          border: '5px solid #1E293B',
          boxShadow: '0 30px 80px rgba(0,0,0,0.9), 0 0 45px rgba(8, 103, 232, 0.3)',
          padding: '24px 28px',
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
            width: '190px',
            height: '32px',
            backgroundColor: '#000000',
            borderRadius: '999px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#1E293B' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#0284C7' }} />
        </div>

        {/* Screen Top Status Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 6px',
            borderBottom: '1.5px solid rgba(255,255,255,0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>🔒</span>
            <span style={{ fontSize: 18, fontWeight: 900, color: '#38BDF8' }}>clinaza.in/emi</span>
          </div>
          <span style={{ fontSize: 14, padding: '4px 14px', borderRadius: 999, backgroundColor: 'rgba(16, 185, 129, 0.25)', color: '#34D399', fontWeight: 900 }}>
            Live Application Step {current.num}/5
          </span>
        </div>

        {/* Dynamic Main Body Content inside phone */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            padding: '14px 6px',
          }}
        >
          <div
            style={{
              padding: '8px 24px',
              borderRadius: 999,
              backgroundColor: 'rgba(56, 189, 248, 0.18)',
              color: '#38BDF8',
              fontSize: 16,
              fontWeight: 900,
              display: 'inline-block',
              alignSelf: 'center',
            }}
          >
            {current.screenBadge}
          </div>

          <div style={{ fontSize: 40, fontWeight: 900, color: '#FFFFFF', textAlign: 'center', lineHeight: 1.15 }}>
            {current.screenTitle}
          </div>

          {/* Itemized Field Cards inside Mockup */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {current.screenFields.map((f, i) => (
              <div
                key={i}
                style={{
                  padding: '20px 24px',
                  borderRadius: 22,
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1.5px solid rgba(255, 255, 255, 0.14)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: 18, color: '#94A3B8', fontWeight: 700 }}>{f.label}:</span>
                <span style={{ fontSize: 20, fontWeight: 900, color: '#F8FAFC' }}>{f.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Big Action Button inside phone mockup */}
        <div
          style={{
            padding: '26px',
            borderRadius: 24,
            backgroundColor: '#4F46E5',
            color: '#FFFFFF',
            fontSize: 24,
            fontWeight: 900,
            textAlign: 'center',
            boxShadow: '0 12px 35px rgba(79, 70, 229, 0.5)',
            letterSpacing: '0.04em',
          }}
        >
          {current.screenCta}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// =========================================================================
// SCENE 3: FINAL CALL TO ACTION (DENSE, VIBRANT, CONVERTING)
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
        justifyContent: 'space-between',
        padding: '210px 70px 120px 70px',
        textAlign: 'center',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <div
          style={{
            transform: `scale(${scale})`,
            width: 120,
            height: 120,
            borderRadius: 40,
            background: 'linear-gradient(135deg, #10B981 0%, #0867E8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 60,
            boxShadow: '0 25px 60px rgba(16, 185, 129, 0.5)',
          }}
        >
          ✨
        </div>

        <h2 style={{ fontSize: 62, fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
          Get Patient EMI Today
        </h2>
        <p style={{ fontSize: 24, color: '#CBD5E1', margin: 0, lineHeight: 1.4, maxWidth: '90%', fontWeight: 600 }}>
          Help your patients say "Yes" to treatments with instant digital point-of-care financing.
        </p>
      </div>

      {/* Main Website CTA Button */}
      <div
        style={{
          width: '100%',
          padding: '34px 40px',
          borderRadius: 32,
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 25px 60px rgba(16, 185, 129, 0.45)',
        }}
      >
        <span style={{ fontSize: 32, fontWeight: 900, color: '#020617', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Visit {websiteUrl} &rarr;
        </span>
      </div>

      {/* 4 Poster Trust Highlights */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
          width: '100%',
        }}
      >
        <div style={{ padding: '20px 24px', borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.14)', textAlign: 'left' }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#FFFFFF' }}>⏱️ Quick &amp; Easy</div>
          <div style={{ fontSize: 15, color: '#94A3B8', marginTop: 4 }}>Takes less than 2 mins</div>
        </div>

        <div style={{ padding: '20px 24px', borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.14)', textAlign: 'left' }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#FFFFFF' }}>📄 No Paperwork</div>
          <div style={{ fontSize: 15, color: '#94A3B8', marginTop: 4 }}>100% digital eKYC</div>
        </div>

        <div style={{ padding: '20px 24px', borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.14)', textAlign: 'left' }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#FFFFFF' }}>🏦 {partnerLendersCount}+ Lenders</div>
          <div style={{ fontSize: 15, color: '#94A3B8', marginTop: 4 }}>Best EMI options</div>
        </div>

        <div style={{ padding: '20px 24px', borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.14)', textAlign: 'left' }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#FFFFFF' }}>📈 Higher Acceptance</div>
          <div style={{ fontSize: 15, color: '#94A3B8', marginTop: 4 }}>Convert more treatments</div>
        </div>
      </div>

      {/* Direct Contact Callout */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '16px 30px',
          borderRadius: 20,
          backgroundColor: 'rgba(16, 185, 129, 0.18)',
          border: '1.5px solid rgba(16, 185, 129, 0.4)',
          fontSize: 18,
          fontWeight: 800,
          color: '#34D399',
        }}
      >
        <span>📞 For any assistance, call or WhatsApp: 7292984244</span>
      </div>
    </AbsoluteFill>
  );
};
