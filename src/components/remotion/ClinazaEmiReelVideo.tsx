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
    '🏦 Funded by 15+ Banks & NBFCs',
    '💳 ₹0 Down Payment Available'
  ],
  partnerLendersCount: 15,
  websiteUrl: 'clinaza.in',
};

export const ClinazaEmiReelComposition: React.FC<ClinazaEmiReelProps> = ({
  headline = "₹65,000 Bill?! Don't Delay Your Dental Treatment 🦷💸",
  treatmentName = 'Dental Implants & Aligners',
  totalCost = 65000,
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
          0% Interest EMI
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

      {/* High-Impact Dialogue Overlay (Safe Zone: bottom 450px to clear IG UI) */}
      <div
        style={{
          position: 'absolute',
          bottom: 450,
          left: 65,
          right: 65,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          textAlign: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            transform: `scale(${scale})`,
            padding: '12px 28px',
            borderRadius: 999,
            backgroundColor: 'rgba(239, 68, 68, 0.95)',
            color: '#FFFFFF',
            fontSize: 20,
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            boxShadow: '0 0 35px rgba(239, 68, 68, 0.7)',
          }}
        >
          😱 "₹{totalCost.toLocaleString('en-IN')} for Dental Care?!"
        </div>

        <div
          style={{
            padding: '24px 26px',
            borderRadius: 26,
            backgroundColor: 'rgba(15, 23, 42, 0.94)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(239, 68, 68, 0.5)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
            width: '100%',
          }}
        >
          <div style={{ fontSize: 32, fontWeight: 900, color: '#FFFFFF', lineHeight: 1.25 }}>
            Don't Postpone Your Health Because of Upfront Cost.
          </div>
          <div style={{ fontSize: 18, color: '#FECACA', marginTop: 10, fontWeight: 700 }}>
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

      {/* Doctor Solution Dialogue & Glowing EMI Card (Insta Safe: bottom 450px) */}
      <div
        style={{
          position: 'absolute',
          bottom: 450,
          left: 65,
          right: 65,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          textAlign: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            padding: '12px 28px',
            borderRadius: 999,
            backgroundColor: 'rgba(16, 185, 129, 0.95)',
            color: '#020617',
            fontSize: 20,
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            boxShadow: '0 0 35px rgba(16, 185, 129, 0.6)',
          }}
        >
          🩺 Doctor: "Pay in Easy EMIs With Clinaza!"
        </div>

        {/* Hero Solution Card */}
        <div
          style={{
            transform: `scale(${scale})`,
            width: '100%',
            padding: '28px 24px',
            borderRadius: 32,
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.4) 0%, rgba(6, 78, 59, 0.94) 80%)',
            border: '3px solid #10B981',
            boxShadow: '0 25px 60px rgba(16, 185, 129, 0.5)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 16, color: '#D1FAE5', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '0.1em' }}>
            Start Treatment Today For Only
          </div>
          <div style={{ fontSize: 58, fontWeight: 900, color: '#FFFFFF', margin: '6px 0', lineHeight: 1.1 }}>
            ₹{monthlyEmi.toLocaleString('en-IN')} <span style={{ fontSize: 20, color: '#A7F3D0' }}>/ month</span>
          </div>
          <div style={{ fontSize: 16, color: '#E2E8F0', fontWeight: 700 }}>
            ⚡ {tenureMonths} Months Flexible Tenure • ₹0 Down Payment
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// =========================================================================
// SCENE 3: 5-STEP 2-MIN DIGITAL APPLICATION FLOW
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
    { num: 1, title: 'Open Website', sub: 'Visit clinaza.in & click Apply Now', icon: '🌐', badge: 'Step 1/5' },
    { num: 2, title: 'Enter Mobile Number', sub: 'Input phone to receive OTP', icon: '📱', badge: 'Step 2/5' },
    { num: 3, title: 'Verify OTP', sub: '6-digit instant verification', icon: '🔒', badge: 'Step 3/5' },
    { num: 4, title: 'Fill Basic Details', sub: '1-min paperless digital KYC', icon: '📋', badge: 'Step 4/5' },
    { num: 5, title: 'Select Loan Offer', sub: 'Choose EMI & get treatment approved', icon: '🎉', badge: 'Step 5/5' },
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
        padding: '240px 65px 460px 65px',
        zIndex: 10,
      }}
    >
      <div style={{ textAlign: 'center', width: '100%' }}>
        <span
          style={{
            fontSize: 15,
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
        <h2 style={{ fontSize: 44, fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
          How to Apply on <span style={{ color: '#38BDF8' }}>clinaza.in</span>
        </h2>
      </div>

      {/* 5 Step Indicator Nodes */}
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
            <div key={s.num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 999,
                  backgroundColor: isCurrent ? '#10B981' : isPassed ? '#059669' : 'rgba(255,255,255,0.1)',
                  color: isCurrent || isPassed ? '#020617' : '#94A3B8',
                  fontSize: 20,
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
              <span style={{ fontSize: 12, fontWeight: isCurrent ? 900 : 700, color: isCurrent ? '#34D399' : '#64748B' }}>
                Step {s.num}
              </span>
            </div>
          );
        })}
      </div>

      {/* Giant Full-Bleed Interactive Phone Simulator (Fits inside y: 240px to 1460px safe area) */}
      <div
        style={{
          width: '100%',
          height: '620px',
          borderRadius: '40px',
          backgroundColor: '#090E17',
          border: '4px solid #1E293B',
          boxShadow: '0 30px 80px rgba(0,0,0,0.9), 0 0 45px rgba(8, 103, 232, 0.35)',
          padding: '18px 22px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
        {/* Dynamic Notch */}
        <div style={{ width: '140px', height: '22px', backgroundColor: '#000000', borderRadius: '999px', margin: '0 auto' }} />

        {/* Screen Content */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, textAlign: 'center' }}>
          <div style={{ fontSize: 48 }}>{current.icon}</div>
          <div style={{ fontSize: 14, padding: '4px 14px', borderRadius: 999, backgroundColor: 'rgba(56, 189, 248, 0.2)', color: '#38BDF8', fontWeight: 900 }}>
            {current.badge}
          </div>
          <div style={{ fontSize: 34, fontWeight: 900, color: '#FFFFFF', lineHeight: 1.15 }}>
            {current.title}
          </div>
          <p style={{ fontSize: 18, color: '#CBD5E1', margin: 0, fontWeight: 600, maxWidth: '90%' }}>
            {current.sub}
          </p>
        </div>

        {/* Action Button inside phone */}
        <div
          style={{
            padding: '16px',
            borderRadius: 16,
            backgroundColor: '#4F46E5',
            color: '#FFFFFF',
            fontSize: 18,
            fontWeight: 900,
            textAlign: 'center',
            boxShadow: '0 12px 35px rgba(79, 70, 229, 0.5)',
          }}
        >
          {activeStep === 5 ? 'Select EMI & Begin Treatment 🦷' : 'Continue to Next Step →'}
        </div>
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
          left: 65,
          right: 65,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          textAlign: 'center',
          alignItems: 'center',
        }}
      >
        <div>
          <h2 style={{ fontSize: 44, fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
            Say "Yes" to Healthy Smiles 😁
          </h2>
          <p style={{ fontSize: 18, color: '#CBD5E1', margin: '4px 0 0 0', fontWeight: 600 }}>
            Ask your dentist for Clinaza EMI or check online.
          </p>
        </div>

        {/* Primary Website CTA Button */}
        <div
          style={{
            width: '100%',
            padding: '22px 28px',
            borderRadius: 24,
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 25px 60px rgba(16, 185, 129, 0.5)',
          }}
        >
          <span style={{ fontSize: 24, fontWeight: 900, color: '#020617', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Visit {websiteUrl} &rarr;
          </span>
        </div>

        {/* Contact & Trust Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 20px',
            borderRadius: 16,
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            border: '1.5px solid rgba(255, 255, 255, 0.2)',
            fontSize: 14,
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
