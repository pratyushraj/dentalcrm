import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  Img,
  Audio,
  staticFile,
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
  headline: "₹65,000 Bill?! Don't Delay Your Dental Treatment 🦷💸",
  treatmentName: "Dental Implants & Aligners",
  totalCost: 65000,
  monthlyEmi: 2650,
  tenureMonths: 24,
  benefits: [
    '⚡ 2-Minute Instant Digital Check',
    '📄 100% Paperless eKYC',
    '🏦 Funded by 55+ Banks & NBFCs',
    '💳 ₹0 Down Payment Available'
  ],
  partnerLendersCount: 55,
  websiteUrl: 'clinaza.in',
};

export const ClinazaEmiReelComposition: React.FC<ClinazaEmiReelProps> = ({
  headline = "₹65,000 Bill?! Don't Delay Your Dental Treatment 🦷💸",
  treatmentName = 'Dental Implants & Aligners',
  totalCost = 65000,
  monthlyEmi = 2650,
  tenureMonths = 24,
  partnerLendersCount = 55,
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
      {/* Dynamic Ambient Background Glows */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '1200px',
          height: '1200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, rgba(8, 103, 232, 0.22) 45%, transparent 70%)',
          filter: 'blur(120px)',
          zIndex: 0,
        }}
      />

      {/* Persistent Top Header Branding Bar (Insta Safe: y: 230px - clear of top 220px) */}
      <div
        style={{
          position: 'absolute',
          top: 230,
          left: 60,
          right: 60,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 70,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 24px',
            borderRadius: 999,
            backgroundColor: 'rgba(15, 23, 42, 0.94)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.6)',
          }}
        >
          <span style={{ fontSize: 24 }}>🦷</span>
          <div>
            <span style={{ fontSize: 19, fontWeight: 900, letterSpacing: '0.06em', color: '#10B981', display: 'block', lineHeight: 1.1 }}>
              CLINAZA
            </span>
            <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Patient Financing
            </span>
          </div>
        </div>

        <div
          style={{
            padding: '10px 22px',
            borderRadius: 999,
            backgroundColor: 'rgba(16, 185, 129, 0.25)',
            border: '2px solid rgba(16, 185, 129, 0.6)',
            fontSize: 15,
            fontWeight: 900,
            color: '#34D399',
            boxShadow: '0 0 25px rgba(16, 185, 129, 0.4)',
          }}
        >
          Easy Dental EMI
        </div>
      </div>

      {/* ─── SCENE 1: THE SHOCKED PATIENT HOOK (0s - 3.5s | Frames 0 - 105) ─── */}
      <Sequence from={0} durationInFrames={105}>
        <Audio src={staticFile('assets/audio/voice-scene1.mp3')} volume={1} />
        <Scene1ShockedPatient totalCost={totalCost} treatmentName={treatmentName} fps={fps} />
      </Sequence>

      {/* ─── SCENE 2: DOCTOR OFFERS CLINAZA SOLUTION (3.5s - 7s | Frames 105 - 210) ─── */}
      <Sequence from={105} durationInFrames={105}>
        <Audio src={staticFile('assets/audio/voice-scene2.mp3')} volume={1} />
        <Scene2DoctorSolution monthlyEmi={monthlyEmi} tenureMonths={tenureMonths} fps={fps} />
      </Sequence>

      {/* ─── SCENE 3: 5-STEP 2-MIN APPLICATION FLOW (7s - 12s | Frames 210 - 360) ─── */}
      <Sequence from={210} durationInFrames={150}>
        <Audio src={staticFile('assets/audio/voice-scene3.mp3')} volume={1} />
        <Scene3StepByStepDemo fps={fps} />
      </Sequence>

      {/* ─── SCENE 4: HAPPY PATIENT & FINAL CONVERSION CTA (12s - 15s | Frames 360 - 450) ─── */}
      <Sequence from={360} durationInFrames={90}>
        <Audio src={staticFile('assets/audio/voice-scene4.mp3')} volume={1} />
        <Scene4HappyPatientCta websiteUrl={websiteUrl} partnerLendersCount={partnerLendersCount} fps={fps} />
      </Sequence>
    </AbsoluteFill>
  );
};

// =========================================================================
// SCENE 1: THE SHOCKED PATIENT (VIRAL EMOTIONAL HOOK)
// =========================================================================
const Scene1ShockedPatient: React.FC<{ totalCost: number; treatmentName: string; fps: number }> = ({
  totalCost,
  treatmentName,
  fps,
}) => {
  const frame = useCurrentFrame();
  const scale = spring({ frame, fps, config: { damping: 10, mass: 0.8 } });
  const opacity = interpolate(frame, [0, 15, 90, 105], [0, 1, 1, 0]);

  return (
    <AbsoluteFill style={{ opacity, zIndex: 10 }}>
      {/* Background Cinematic AI Image */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <Img
          src={staticFile('assets/reel/scene1-shocked-patient.jpg')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${1 + frame * 0.0008})`,
            filter: 'brightness(0.75)',
          }}
        />
        {/* Dark Vignette & Gradient Overlays */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(2,6,23,0.85) 0%, rgba(2,6,23,0.3) 40%, rgba(2,6,23,0.92) 80%, #020617 100%)',
          }}
        />
      </div>

      {/* High-Impact Dialogue Overlay (Positioned at TOP to keep patient face and bill clear) */}
      <div
        style={{
          position: 'absolute',
          top: 310,
          left: 60,
          right: 60,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          textAlign: 'center',
          alignItems: 'center',
          zIndex: 20,
        }}
      >
        <div
          style={{
            transform: `scale(${scale})`,
            padding: '14px 34px',
            borderRadius: 999,
            backgroundColor: 'rgba(239, 68, 68, 0.96)',
            color: '#FFFFFF',
            fontSize: 26,
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            boxShadow: '0 0 35px rgba(239, 68, 68, 0.7)',
          }}
        >
          😱 "₹{totalCost.toLocaleString('en-IN')} Treatment Bill?!"
        </div>

        <div
          style={{
            padding: '24px 30px',
            borderRadius: 28,
            backgroundColor: 'rgba(15, 23, 42, 0.94)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(239, 68, 68, 0.5)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.85)',
            width: '100%',
          }}
        >
          <div style={{ fontSize: 38, fontWeight: 900, color: '#FFFFFF', lineHeight: 1.2 }}>
            Don't Delay Your Dental Care Because of High Expenses.
          </div>
          <div style={{ fontSize: 20, color: '#FECACA', marginTop: 10, fontWeight: 700 }}>
            {treatmentName} • Implants • Aligners • Root Canals
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// =========================================================================
// SCENE 2: DOCTOR OFFERS CLINAZA SOLUTION
// =========================================================================
const Scene2DoctorSolution: React.FC<{ monthlyEmi: number; tenureMonths: number; fps: number }> = ({
  monthlyEmi,
  tenureMonths,
  fps,
}) => {
  const frame = useCurrentFrame();
  const scale = spring({ frame, fps, config: { damping: 9, mass: 0.7 } });
  const opacity = interpolate(frame, [0, 15, 90, 105], [0, 1, 1, 0]);

  return (
    <AbsoluteFill style={{ opacity, zIndex: 10 }}>
      {/* Background Cinematic AI Doctor Image */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <Img
          src={staticFile('assets/reel/scene2-doctor-solution.jpg')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${1.05 - frame * 0.0006})`,
            filter: 'brightness(0.72)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(2,6,23,0.85) 0%, rgba(2,6,23,0.2) 35%, rgba(2,6,23,0.95) 75%, #020617 100%)',
          }}
        />
      </div>

      {/* Doctor Solution Dialogue & Glowing EMI Card (Positioned at TOP to keep doctor and tablet visible) */}
      <div
        style={{
          position: 'absolute',
          top: 310,
          left: 60,
          right: 60,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          textAlign: 'center',
          alignItems: 'center',
          zIndex: 20,
        }}
      >
        <div
          style={{
            padding: '14px 34px',
            borderRadius: 999,
            backgroundColor: 'rgba(16, 185, 129, 0.95)',
            color: '#020617',
            fontSize: 24,
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            boxShadow: '0 0 35px rgba(16, 185, 129, 0.6)',
          }}
        >
          🩺 Doctor: "Convert Your Bill Into Easy EMIs!"
        </div>

        {/* Hero Solution Card */}
        <div
          style={{
            transform: `scale(${scale})`,
            width: '100%',
            padding: '28px 26px',
            borderRadius: 30,
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.4) 0%, rgba(6, 78, 59, 0.95) 80%)',
            border: '3px solid #10B981',
            boxShadow: '0 25px 60px rgba(16, 185, 129, 0.5)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 18, color: '#D1FAE5', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '0.1em' }}>
            Start Treatment Today For Just
          </div>
          <div style={{ fontSize: 68, fontWeight: 900, color: '#FFFFFF', margin: '6px 0', lineHeight: 1.1 }}>
            ₹{monthlyEmi.toLocaleString('en-IN')} <span style={{ fontSize: 24, color: '#A7F3D0' }}>/ month</span>
          </div>
          <div style={{ fontSize: 18, color: '#E2E8F0', fontWeight: 700 }}>
            ⚡ {tenureMonths} Months Flexible Tenure • 55+ Banks & NBFCs
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// =========================================================================
// SCENE 3: 5-STEP 2-MIN DIGITAL APPLICATION FLOW (REALISTIC MOBILE MOCKUP)
// =========================================================================
const Scene3StepByStepDemo: React.FC<{ fps: number }> = ({ fps }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15, 135, 150], [0, 1, 1, 0]);

  let activeStep = 1;
  if (frame >= 120) activeStep = 5;
  else if (frame >= 90) activeStep = 4;
  else if (frame >= 60) activeStep = 3;
  else if (frame >= 30) activeStep = 2;

  const steps = [
    { num: 1, title: 'Visit Site', icon: '🌐' },
    { num: 2, title: 'Phone OTP', icon: '📱' },
    { num: 3, title: 'Verify', icon: '🔒' },
    { num: 4, title: 'Instant KYC', icon: '📋' },
    { num: 5, title: 'Approved', icon: '🎉' },
  ];

  return (
    <AbsoluteFill
      style={{
        opacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '230px 50px 450px 50px',
        zIndex: 10,
      }}
    >
      <div style={{ textAlign: 'center', width: '100%' }}>
        <span
          style={{
            fontSize: 18,
            fontWeight: 900,
            color: '#10B981',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            display: 'block',
            marginBottom: 6,
          }}
        >
          ⚡ Takes Less Than 2 Minutes
        </span>
        <h2 style={{ fontSize: 48, fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
          How to Apply on <span style={{ color: '#38BDF8' }}>clinaza.in</span>
        </h2>
      </div>

      {/* 5 Step Indicator Nodes (Larger & clearer) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 12,
          width: '100%',
        }}
      >
        {steps.map((s) => {
          const isCurrent = s.num === activeStep;
          const isPassed = s.num < activeStep;
          return (
            <div key={s.num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div
                style={{
                  width: 62,
                  height: 62,
                  borderRadius: 999,
                  backgroundColor: isCurrent ? '#10B981' : isPassed ? '#059669' : 'rgba(255,255,255,0.12)',
                  color: isCurrent || isPassed ? '#020617' : '#94A3B8',
                  fontSize: 26,
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: isCurrent ? '3px solid #FFFFFF' : 'none',
                  boxShadow: isCurrent ? '0 0 30px rgba(16, 185, 129, 0.8)' : 'none',
                }}
              >
                {isPassed ? '✓' : s.num}
              </div>
              <span style={{ fontSize: 14, fontWeight: isCurrent ? 900 : 700, color: isCurrent ? '#34D399' : '#94A3B8' }}>
                {s.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Realistic Full-Sized Smartphone Mockup Frame */}
      <div
        style={{
          width: '100%',
          height: '780px',
          borderRadius: '46px',
          backgroundColor: '#0A0F1D',
          border: '5px solid #334155',
          boxShadow: '0 30px 90px rgba(0,0,0,0.95), 0 0 50px rgba(16, 185, 129, 0.3)',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Dynamic Island / Speaker Notch & Status Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 10, padding: '0 10px' }}>
          <span style={{ fontSize: 16, fontWeight: 900, color: '#94A3B8' }}>9:41</span>
          <div style={{ width: '130px', height: '24px', backgroundColor: '#000000', borderRadius: '999px' }} />
          <span style={{ fontSize: 16, fontWeight: 900, color: '#94A3B8' }}>5G 🔋</span>
        </div>

        {/* Mobile Browser URL Address Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            padding: '12px 20px',
            borderRadius: 16,
            backgroundColor: 'rgba(30, 41, 59, 0.9)',
            border: '1.5px solid rgba(255, 255, 255, 0.15)',
            marginBottom: 14,
          }}
        >
          <span style={{ fontSize: 16, color: '#10B981' }}>🔒</span>
          <span style={{ fontSize: 17, fontWeight: 800, color: '#F8FAFC', letterSpacing: '0.02em' }}>
            clinaza.in<span style={{ color: '#94A3B8' }}>/apply</span>
          </span>
        </div>

        {/* Dynamic Screen Content Based On Current Active Step */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 18 }}>
          {activeStep === 1 && (
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
              <div style={{ padding: '8px 20px', borderRadius: 999, backgroundColor: 'rgba(16, 185, 129, 0.25)', color: '#34D399', fontSize: 16, fontWeight: 900 }}>
                🦷 Clinaza Patient EMI Portal
              </div>
              <div style={{ fontSize: 38, fontWeight: 900, color: '#FFFFFF', lineHeight: 1.2 }}>
                Instant Dental Loan in 2 Mins
              </div>
              <div style={{ fontSize: 20, color: '#CBD5E1', fontWeight: 600 }}>
                Easy Monthly EMIs • ₹0 Down • 55+ Banks
              </div>
              <div
                style={{
                  width: '95%',
                  padding: '20px',
                  borderRadius: 20,
                  backgroundColor: '#10B981',
                  color: '#020617',
                  fontSize: 24,
                  fontWeight: 900,
                  boxShadow: '0 10px 30px rgba(16, 185, 129, 0.5)',
                  marginTop: 6,
                }}
              >
                Apply Now &rarr;
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: '#FFFFFF' }}>
                Enter Mobile Number
              </div>
              <div style={{ fontSize: 20, color: '#94A3B8', fontWeight: 600 }}>
                We will send an OTP for paperless verification
              </div>
              <div
                style={{
                  width: '95%',
                  padding: '20px 24px',
                  borderRadius: 20,
                  backgroundColor: '#020617',
                  border: '3px solid #38BDF8',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  boxShadow: '0 0 25px rgba(56, 189, 248, 0.3)',
                }}
              >
                <span style={{ fontSize: 26 }}>🇮🇳</span>
                <span style={{ fontSize: 24, fontWeight: 900, color: '#64748B' }}>+91</span>
                <span style={{ fontSize: 32, fontWeight: 900, color: '#FFFFFF', letterSpacing: '0.08em' }}>98765 43210</span>
              </div>
              <div
                style={{
                  width: '95%',
                  padding: '20px',
                  borderRadius: 20,
                  backgroundColor: '#38BDF8',
                  color: '#020617',
                  fontSize: 24,
                  fontWeight: 900,
                  boxShadow: '0 10px 30px rgba(56, 189, 248, 0.5)',
                }}
              >
                Send OTP &rarr;
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: '#FFFFFF' }}>
                Verify 6-Digit OTP
              </div>
              <div style={{ fontSize: 20, color: '#94A3B8', fontWeight: 600 }}>
                Code sent to +91 98765 43210
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                {['4', '8', '2', '9', '1', '0'].map((digit, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: 58,
                      height: 68,
                      borderRadius: 16,
                      backgroundColor: '#020617',
                      border: '3px solid #10B981',
                      color: '#10B981',
                      fontSize: 32,
                      fontWeight: 900,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
                    }}
                  >
                    {digit}
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 20, color: '#34D399', fontWeight: 900 }}>
                ✓ OTP Verified Successfully!
              </div>
            </div>
          )}

          {activeStep === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '95%', margin: '0 auto' }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#FFFFFF', textAlign: 'center' }}>
                Instant Digital KYC
              </div>
              <div style={{ padding: '16px 20px', borderRadius: 16, backgroundColor: '#020617', border: '2px solid #334155' }}>
                <span style={{ fontSize: 14, color: '#94A3B8', display: 'block', fontWeight: 700 }}>PAN Number</span>
                <span style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF' }}>ABCDE1234F</span>
              </div>
              <div style={{ padding: '16px 20px', borderRadius: 16, backgroundColor: '#020617', border: '2px solid #334155' }}>
                <span style={{ fontSize: 14, color: '#94A3B8', display: 'block', fontWeight: 700 }}>Treatment Estimate</span>
                <span style={{ fontSize: 24, fontWeight: 900, color: '#34D399' }}>₹65,000 (Dental Implants)</span>
              </div>
              <div style={{ fontSize: 18, color: '#A7F3D0', fontWeight: 800, textAlign: 'center' }}>
                ⚡ Instant Approval across 55+ Banks & NBFCs
              </div>
            </div>
          )}

          {activeStep === 5 && (
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
              <div style={{ padding: '6px 18px', borderRadius: 999, backgroundColor: 'rgba(16, 185, 129, 0.25)', color: '#34D399', fontSize: 16, fontWeight: 900 }}>
                🎉 LOAN APPROVED INSTANTLY
              </div>
              <div style={{ fontSize: 34, fontWeight: 900, color: '#FFFFFF', lineHeight: 1.1 }}>
                ₹65,000 Approved
              </div>
              <div
                style={{
                  padding: '16px 24px',
                  borderRadius: 20,
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(6, 78, 59, 0.85) 100%)',
                  border: '2.5px solid #10B981',
                  width: '95%',
                }}
              >
                <div style={{ fontSize: 15, color: '#D1FAE5', textTransform: 'uppercase', fontWeight: 900 }}>
                  Selected Dental EMI Plan
                </div>
                <div style={{ fontSize: 44, fontWeight: 900, color: '#FFFFFF', margin: '4px 0' }}>
                  ₹2,650 <span style={{ fontSize: 20, color: '#A7F3D0' }}>/ mo</span>
                </div>
                <div style={{ fontSize: 16, color: '#E2E8F0', fontWeight: 700 }}>
                  24 Months • ₹0 Down Payment
                </div>
              </div>
              <div
                style={{
                  width: '95%',
                  padding: '18px',
                  borderRadius: 18,
                  backgroundColor: '#10B981',
                  color: '#020617',
                  fontSize: 22,
                  fontWeight: 900,
                  boxShadow: '0 10px 30px rgba(16, 185, 129, 0.5)',
                }}
              >
                Begin Treatment Today 🦷
              </div>
            </div>
          )}
        </div>

        {/* Home Indicator Bar */}
        <div style={{ width: '140px', height: '5px', backgroundColor: '#64748B', borderRadius: '999px', margin: '6px auto 0 auto' }} />
      </div>
    </AbsoluteFill>
  );
};

// =========================================================================
// SCENE 4: HAPPY PATIENT & FINAL CONVERSION CTA
// =========================================================================
const Scene4HappyPatientCta: React.FC<{
  websiteUrl: string;
  partnerLendersCount: number;
  fps: number;
}> = ({ websiteUrl, partnerLendersCount, fps }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1]);

  return (
    <AbsoluteFill style={{ opacity, zIndex: 10 }}>
      {/* Background Cinematic AI Happy Patient Image */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <Img
          src={staticFile('assets/reel/scene4-happy-patient.jpg')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${1 + frame * 0.0006})`,
            filter: 'brightness(0.65)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(2,6,23,0.85) 0%, rgba(2,6,23,0.25) 30%, rgba(2,6,23,0.95) 70%, #020617 100%)',
          }}
        />
      </div>

      {/* Main Conversion CTA Cards (Safe Zone: bottom 450px) */}
      <div
        style={{
          position: 'absolute',
          bottom: 450,
          left: 60,
          right: 60,
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          textAlign: 'center',
          alignItems: 'center',
        }}
      >
        <div>
          <h2 style={{ fontSize: 52, fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
            Say "Yes" to Healthy Smiles 😁
          </h2>
          <p style={{ fontSize: 22, color: '#CBD5E1', margin: '6px 0 0 0', fontWeight: 600 }}>
            Ask your dentist for Clinaza EMI or check online.
          </p>
        </div>

        {/* Primary Website CTA Button */}
        <div
          style={{
            width: '100%',
            padding: '28px 36px',
            borderRadius: 28,
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 25px 60px rgba(16, 185, 129, 0.5)',
          }}
        >
          <span style={{ fontSize: 30, fontWeight: 900, color: '#020617', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Visit {websiteUrl} &rarr;
          </span>
        </div>

        {/* Contact & Trust Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '14px 26px',
            borderRadius: 20,
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            border: '1.5px solid rgba(255, 255, 255, 0.2)',
            fontSize: 18,
            fontWeight: 800,
            color: '#34D399',
          }}
        >
          <span>📞 Call / WhatsApp: 7292984244 • Backed by {partnerLendersCount}+ Banks</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
