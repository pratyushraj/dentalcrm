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
  headline: "Dentists: Stop Patients Walking Out on ₹65,000 Estimates! 🦷💼",
  treatmentName: "Dental Implants & Aligners",
  totalCost: 65000,
  monthlyEmi: 2650,
  tenureMonths: 24,
  benefits: [
    '⚡ Upfront Clinic Payout in 24 Hours',
    '📄 100% Paperless Digital eKYC',
    '🏦 Backed by 55+ Banks & NBFCs',
    '🚀 Increase Case Acceptance by 40%'
  ],
  partnerLendersCount: 55,
  websiteUrl: 'clinaza.in',
};

export const ClinazaEmiReelComposition: React.FC<ClinazaEmiReelProps> = ({
  headline = "Dentists: Stop Patients Walking Out on ₹65,000 Estimates! 🦷💼",
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



      {/* ─── CONTINUOUS MASTER VOICEOVER AUDIO ─── */}
      <Audio src={staticFile('assets/audio/voiceover.mp3')} volume={1} />

      {/* ─── SCENE 1: THE SHOCKED PATIENT HOOK (0s - 3.8s | Frames 0 - 115) ─── */}
      <Sequence from={0} durationInFrames={115}>
        <Scene1ShockedPatient totalCost={totalCost} treatmentName={treatmentName} fps={fps} />
      </Sequence>

      {/* ─── SCENE 2: DOCTOR OFFERS CLINAZA SOLUTION (3.8s - 7.5s | Frames 115 - 225) ─── */}
      <Sequence from={115} durationInFrames={110}>
        <Scene2DoctorSolution monthlyEmi={monthlyEmi} tenureMonths={tenureMonths} fps={fps} />
      </Sequence>

      {/* ─── SCENE 3: 4-STEP IN-CLINIC DEMO (7.5s - 14.2s | Frames 225 - 425 = 200 Frames) ─── */}
      <Sequence from={225} durationInFrames={200}>
        <Scene3StepByStepDemo fps={fps} />
      </Sequence>

      {/* ─── SCENE 4: CTA & COMMENT EMI (14.2s - 18s | Frames 425 - 540 = 115 Frames) ─── */}
      <Sequence from={425} durationInFrames={115}>
        <Scene4HappyPatientCta websiteUrl={websiteUrl} partnerLendersCount={partnerLendersCount} fps={fps} />
      </Sequence>
    </AbsoluteFill>
  );
};

// =========================================================================
// SCENE 1: THE DENTIST HOOK - STOP LOSING PATIENTS TO ESTIMATE SHOCK
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
            filter: 'brightness(0.72)',
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

      {/* High-Impact B2B Dentist Dialogue Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 310,
          left: 50,
          right: 50,
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
            padding: '16px 36px',
            borderRadius: 999,
            backgroundColor: 'rgba(239, 68, 68, 0.96)',
            color: '#FFFFFF',
            fontSize: 28,
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            boxShadow: '0 0 40px rgba(239, 68, 68, 0.75)',
          }}
        >
          📉 Losing Patients on ₹{totalCost.toLocaleString('en-IN')} Estimates?
        </div>

        <div
          style={{
            padding: '28px 32px',
            borderRadius: 30,
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(24px)',
            border: '2.5px solid rgba(239, 68, 68, 0.6)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
            width: '100%',
          }}
        >
          <div style={{ fontSize: 44, fontWeight: 900, color: '#FFFFFF', lineHeight: 1.28 }}>
            Stop Patients Walking Out <br />
            <span style={{ color: '#34D399' }}>Offer Instant EMIs!</span>
          </div>
          <div style={{ fontSize: 26, color: '#FECACA', marginTop: 12, fontWeight: 800 }}>
            Boost Case Acceptance for <span style={{ color: '#FFFFFF' }}>Implants • Aligners • Braces</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// =========================================================================
// SCENE 2: THE CLINIC SOLUTION - UPFRONT PAYOUT & INSTANT EMI
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

      {/* Doctor Solution Dialogue & Glowing EMI Card */}
      <div
        style={{
          position: 'absolute',
          top: 310,
          left: 50,
          right: 50,
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
            padding: '16px 36px',
            borderRadius: 999,
            backgroundColor: 'rgba(16, 185, 129, 0.95)',
            color: '#020617',
            fontSize: 27,
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            boxShadow: '0 0 35px rgba(16, 185, 129, 0.6)',
          }}
        >
          🚀 40% Higher Case Acceptance For Your Clinic!
        </div>

        {/* Hero Solution Card */}
        <div
          style={{
            transform: `scale(${scale})`,
            width: '100%',
            padding: '30px 28px',
            borderRadius: 32,
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.4) 0%, rgba(6, 78, 59, 0.95) 80%)',
            border: '3px solid #10B981',
            boxShadow: '0 25px 60px rgba(16, 185, 129, 0.5)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 22, color: '#D1FAE5', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '0.1em' }}>
            Patient Pays Easy Monthly EMI
          </div>
          <div style={{ fontSize: 74, fontWeight: 900, color: '#FFFFFF', margin: '8px 0', lineHeight: 1.1 }}>
            ₹{monthlyEmi.toLocaleString('en-IN')} <span style={{ fontSize: 26, color: '#A7F3D0' }}>/ month</span>
          </div>
          <div style={{ fontSize: 22, color: '#E2E8F0', fontWeight: 800 }}>
            ⚡ Upfront Clinic Payout • Backed by 55+ Banks & NBFCs
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// --- Crisp Official Bank SVG Logos ---
const HdfcLogo: React.FC<{ size?: number }> = ({ size = 52 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: 12,
      backgroundColor: '#004C8F',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '2px solid #ED232A',
      flexShrink: 0,
      boxShadow: '0 4px 12px rgba(0, 76, 143, 0.4)',
    }}
  >
    <svg width={size * 0.72} height={size * 0.72} viewBox="0 0 100 100" fill="none">
      <rect width="100" height="100" rx="8" fill="#004C8F" />
      <rect x="8" y="8" width="38" height="38" fill="#ED232A" />
      <rect x="54" y="8" width="38" height="38" fill="#ED232A" />
      <rect x="8" y="54" width="38" height="38" fill="#ED232A" />
      <rect x="54" y="54" width="38" height="38" fill="#ED232A" />
      <rect x="36" y="20" width="28" height="60" fill="#004C8F" />
      <rect x="20" y="36" width="60" height="28" fill="#004C8F" />
      <rect x="42" y="42" width="16" height="16" fill="#FFFFFF" />
    </svg>
  </div>
);

const AxisLogo: React.FC<{ size?: number }> = ({ size = 52 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: 12,
      backgroundColor: '#97144D',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      boxShadow: '0 4px 12px rgba(151, 20, 77, 0.4)',
    }}
  >
    <svg width={size * 0.72} height={size * 0.72} viewBox="0 0 100 100" fill="none">
      <path d="M50 12 L88 88 L66 88 L50 54 L34 88 L12 88 Z" fill="#FFFFFF" />
      <path d="M50 36 L64 64 L36 64 Z" fill="#97144D" />
    </svg>
  </div>
);

const BajajLogo: React.FC<{ size?: number }> = ({ size = 52 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: 12,
      backgroundColor: '#0072CE',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      boxShadow: '0 4px 12px rgba(0, 114, 206, 0.4)',
    }}
  >
    <svg width={size * 0.72} height={size * 0.72} viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="42" fill="#0072CE" stroke="#FFFFFF" strokeWidth="4" />
      <path d="M22 52 Q50 30 78 52 Q50 40 22 52 Z" fill="#FFFFFF" />
      <path d="M28 64 Q50 48 72 64 Q50 55 28 64 Z" fill="#FFFFFF" />
      <circle cx="50" cy="34" r="6.5" fill="#FFFFFF" />
    </svg>
  </div>
);

// --- Animated Confetti Component for Loan Disbursement ---
const ConfettiBurst: React.FC<{ frame: number }> = ({ frame }) => {
  const particles = Array.from({ length: 40 }).map((_, i) => {
    const seed = (i + 1) * 37;
    const left = (seed * 17) % 100;
    const speed = 6 + (seed % 7);
    const delay = (i % 10) * 1.5;
    const activeF = Math.max(0, frame - delay);
    const top = (activeF * speed * 3.5) % 850;
    const rot = activeF * (seed % 2 === 0 ? 10 : -10);
    const colors = ['#10B981', '#38BDF8', '#F59E0B', '#EC4899', '#A7F3D0', '#60A5FA', '#FCD34D', '#34D399'];
    const color = colors[i % colors.length];
    const width = 10 + (seed % 8);
    const height = 6 + (seed % 6);
    const opacity = activeF > 0 && activeF < 60 ? 1 : 0;
    return { left, top, rot, color, width, height, opacity };
  });

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 40 }}>
      {particles.map((p, idx) => (
        <div
          key={idx}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: `${p.top - 40}px`,
            width: `${p.width}px`,
            height: `${p.height}px`,
            backgroundColor: p.color,
            borderRadius: '2px',
            transform: `rotate(${p.rot}deg)`,
            opacity: p.opacity,
            boxShadow: `0 0 10px ${p.color}`,
          }}
        />
      ))}
    </div>
  );
};

// =========================================================================
// SCENE 3: HOW IT WORKS AT CLINIC RECEPTION (2-MIN DIGITAL PROCESS)
// =========================================================================
const Scene3StepByStepDemo: React.FC<{ fps: number }> = ({ fps }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12, 190, 200], [0, 1, 1, 0]);

  // Extended pacing across 200 frames (50 frames per step)
  let activeStep = 1;
  let stepRelFrame = frame;
  if (frame >= 150) {
    activeStep = 4;
    stepRelFrame = frame - 150;
  } else if (frame >= 100) {
    activeStep = 3;
    stepRelFrame = frame - 100;
  } else if (frame >= 50) {
    activeStep = 2;
    stepRelFrame = frame - 50;
  }

  // Smooth spring physics for step transitions
  const stepScale = spring({ frame: stepRelFrame, fps, config: { damping: 12, mass: 0.5 } });
  const phoneScale = spring({ frame, fps, config: { damping: 14, mass: 0.8 } });

  const steps = [
    { num: 1, title: 'Patient Phone', icon: '📱' },
    { num: 2, title: 'PAN & Aadhaar', icon: '🪪' },
    { num: 3, title: '55+ Banks', icon: '🏦' },
    { num: 4, title: 'Clinic Paid', icon: '🎉' },
  ];

  // Dynamic typing simulations inside phone inputs
  const rawPhone = "98765 43210";
  const typedPhoneLen = Math.min(rawPhone.length, Math.floor(stepRelFrame / 2.2));
  const displayedPhone = rawPhone.slice(0, typedPhoneLen);

  const rawPan = "ABCDE1234F";
  const typedPanLen = Math.min(rawPan.length, Math.floor(stepRelFrame / 2.5));
  const displayedPan = rawPan.slice(0, typedPanLen);

  // Offer Selection State in Step 3
  const isOfferSelected = activeStep === 3 && stepRelFrame >= 24;
  const selectSpring = spring({ frame: Math.max(0, stepRelFrame - 24), fps, config: { damping: 8, mass: 0.5 } });

  return (
    <AbsoluteFill
      style={{
        opacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '230px 40px 450px 40px',
        zIndex: 10,
      }}
    >
      <div style={{ textAlign: 'center', width: '100%' }}>
        <span
          style={{
            fontSize: 20,
            fontWeight: 900,
            color: '#10B981',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            display: 'block',
            marginBottom: 6,
          }}
        >
          ⚡ Seamless 2-Minute Process at Reception
        </span>
        <h2 style={{ fontSize: 50, fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
          How Clinaza Works at <span style={{ color: '#38BDF8' }}>Your Clinic</span>
        </h2>
      </div>

      {/* 4 Step Indicator Nodes */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          width: '780px',
          margin: '0 auto',
        }}
      >
        {steps.map((s) => {
          const isCurrent = s.num === activeStep;
          const isPassed = s.num < activeStep;
          return (
            <div key={s.num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 999,
                  backgroundColor: isCurrent ? '#10B981' : isPassed ? '#059669' : 'rgba(255,255,255,0.12)',
                  color: isCurrent || isPassed ? '#020617' : '#94A3B8',
                  fontSize: 30,
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: isCurrent ? '4px solid #FFFFFF' : 'none',
                  boxShadow: isCurrent ? '0 0 30px rgba(16, 185, 129, 0.8)' : 'none',
                  transform: isCurrent ? `scale(${1 + Math.sin(frame * 0.15) * 0.05})` : 'scale(1)',
                }}
              >
                {isPassed ? '✓' : s.num}
              </div>
              <span style={{ fontSize: 16, fontWeight: isCurrent ? 900 : 700, color: isCurrent ? '#34D399' : '#94A3B8' }}>
                {s.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Sleek Vertical Mobile Smartphone Mockup Frame */}
      <div
        style={{
          transform: `scale(${phoneScale})`,
          width: '780px',
          height: '840px',
          margin: '0 auto',
          borderRadius: '54px',
          backgroundColor: '#0A0F1D',
          border: '6px solid #334155',
          boxShadow: '0 30px 90px rgba(0,0,0,0.95), 0 0 50px rgba(16, 185, 129, 0.3)',
          padding: '22px 26px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Confetti Overlay in Step 4 */}
        {activeStep === 4 && <ConfettiBurst frame={stepRelFrame} />}

        {/* Dynamic Island & Status Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 10, padding: '0 8px' }}>
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
            marginBottom: 12,
          }}
        >
          <span style={{ fontSize: 17, color: '#10B981' }}>🔒</span>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#F8FAFC', letterSpacing: '0.02em' }}>
            clinaza.in<span style={{ color: '#94A3B8' }}>/partner-desk</span>
          </span>
        </div>

        {/* Dynamic Screen Content Based On Current Active Step */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 14,
            transform: `scale(${stepScale})`,
            transformOrigin: 'center center',
          }}
        >
          {activeStep === 1 && (
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
              <div style={{ fontSize: 38, fontWeight: 900, color: '#FFFFFF' }}>
                Enter Patient Phone
              </div>
              <div style={{ fontSize: 20, color: '#94A3B8', fontWeight: 600 }}>
                Instant eligibility scan across 55+ lenders
              </div>
              <div
                style={{
                  width: '95%',
                  padding: '20px 24px',
                  borderRadius: 22,
                  backgroundColor: '#020617',
                  border: '3.5px solid #38BDF8',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  boxShadow: '0 0 25px rgba(56, 189, 248, 0.35)',
                }}
              >
                <span style={{ fontSize: 28 }}>🇮🇳</span>
                <span style={{ fontSize: 25, fontWeight: 900, color: '#64748B' }}>+91</span>
                <span style={{ fontSize: 34, fontWeight: 900, color: '#FFFFFF', letterSpacing: '0.08em', minWidth: '220px', textAlign: 'left' }}>
                  {displayedPhone}
                  {typedPhoneLen < rawPhone.length && <span style={{ color: '#38BDF8', fontWeight: 300 }}>|</span>}
                </span>
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
                Verify Patient &rarr;
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', width: '100%' }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: '#FFFFFF', lineHeight: 1.1 }}>
                Digital eKYC Verification
              </div>
              <div style={{ fontSize: 18, color: '#94A3B8', fontWeight: 600 }}>
                Instant 100% paperless verification
              </div>

              {/* PAN Card Input Box */}
              <div
                style={{
                  width: '95%',
                  padding: '16px 20px',
                  borderRadius: 20,
                  backgroundColor: '#020617',
                  border: '2.5px solid #10B981',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 0 20px rgba(16, 185, 129, 0.25)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontSize: 28 }}>🪪</span>
                  <div style={{ textAlign: 'left' }}>
                    <span style={{ fontSize: 12, color: '#94A3B8', display: 'block', fontWeight: 800 }}>PAN NUMBER</span>
                    <span style={{ fontSize: 22, fontWeight: 900, color: '#FFFFFF', letterSpacing: '0.06em' }}>
                      {displayedPan}
                      {typedPanLen < rawPan.length && <span style={{ color: '#10B981', fontWeight: 300 }}>|</span>}
                    </span>
                  </div>
                </div>
                <div style={{ padding: '6px 14px', borderRadius: 999, backgroundColor: 'rgba(16, 185, 129, 0.25)', color: '#34D399', fontSize: 14, fontWeight: 900, border: '1.5px solid #10B981' }}>
                  ✓ VERIFIED
                </div>
              </div>

              {/* Aadhaar Card Input Box */}
              <div
                style={{
                  width: '95%',
                  padding: '16px 20px',
                  borderRadius: 20,
                  backgroundColor: '#020617',
                  border: '2.5px solid #10B981',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 0 20px rgba(16, 185, 129, 0.25)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontSize: 28 }}>🆔</span>
                  <div style={{ textAlign: 'left' }}>
                    <span style={{ fontSize: 12, color: '#94A3B8', display: 'block', fontWeight: 800 }}>AADHAAR CARD</span>
                    <span style={{ fontSize: 22, fontWeight: 900, color: '#FFFFFF', letterSpacing: '0.08em' }}>•••• •••• 4321</span>
                  </div>
                </div>
                <div style={{ padding: '6px 14px', borderRadius: 999, backgroundColor: 'rgba(16, 185, 129, 0.25)', color: '#34D399', fontSize: 14, fontWeight: 900, border: '1.5px solid #10B981' }}>
                  ✓ MATCHED
                </div>
              </div>

              <div style={{ fontSize: 20, color: '#34D399', fontWeight: 900, marginTop: 4 }}>
                ⚡ eKYC Approved in 15 Seconds!
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: '#FFFFFF', lineHeight: 1.1 }}>
                    ⚡ 3 Bank Offers Approved
                  </div>
                  <div style={{ fontSize: 14, color: '#10B981', fontWeight: 800, marginTop: 2 }}>
                    55+ Lenders Scanned • Instant Digital Match
                  </div>
                </div>
                <div style={{ padding: '6px 14px', borderRadius: 999, backgroundColor: 'rgba(16, 185, 129, 0.2)', border: '1.5px solid #10B981', fontSize: 15, fontWeight: 900, color: '#34D399' }}>
                  ₹65,000 Loan
                </div>
              </div>

              {/* Offer 1: HDFC Bank (With Selection Animation) */}
              <div
                style={{
                  transform: isOfferSelected ? `scale(${1 + (selectSpring - 1) * 0.05})` : `scale(${spring({ frame: stepRelFrame, fps, config: { damping: 10, mass: 0.5 } })})`,
                  padding: '14px 18px',
                  borderRadius: 18,
                  backgroundColor: '#0F172A',
                  border: isOfferSelected ? '3px solid #10B981' : '2px solid rgba(16, 185, 129, 0.6)',
                  boxShadow: isOfferSelected ? '0 0 35px rgba(16, 185, 129, 0.75)' : '0 8px 25px rgba(16, 185, 129, 0.3)',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: -10,
                    right: 14,
                    backgroundColor: isOfferSelected ? '#10B981' : '#059669',
                    color: '#020617',
                    padding: '3px 12px',
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 900,
                    boxShadow: isOfferSelected ? '0 0 15px rgba(16, 185, 129, 0.8)' : 'none',
                  }}
                >
                  {isOfferSelected ? '✓ SELECTED OFFER' : '✨ BEST MATCH'}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <HdfcLogo size={50} />
                    <div>
                      <span style={{ fontSize: 22, fontWeight: 900, color: '#FFFFFF', display: 'block', lineHeight: 1.1 }}>HDFC Bank</span>
                      <span style={{ fontSize: 14, color: '#94A3B8', fontWeight: 700 }}>24 Mo Dental EMI</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 28, fontWeight: 900, color: '#34D399' }}>₹2,650</span>
                    <span style={{ fontSize: 15, color: '#94A3B8', fontWeight: 700 }}> /mo</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: 15, fontWeight: 800 }}>
                  <span style={{ color: '#E2E8F0' }}>Interest: <strong style={{ color: '#F8FAFC' }}>9.99% p.a.</strong></span>
                  <span style={{ color: '#10B981' }}>Processing Fee: <strong style={{ color: '#34D399' }}>2%</strong></span>
                </div>
              </div>

              {/* Tap Hand Indicator Animation */}
              {stepRelFrame >= 18 && stepRelFrame <= 35 && (
                <div
                  style={{
                    position: 'absolute',
                    top: 80,
                    right: 70,
                    fontSize: 42,
                    transform: `scale(${stepRelFrame >= 24 ? 0.9 : 1.1}) translateY(${stepRelFrame >= 24 ? 6 : 0}px)`,
                    filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.8))',
                    zIndex: 50,
                    transition: 'transform 0.1s ease',
                  }}
                >
                  👆
                </div>
              )}

              {/* Offer 2: Axis Bank */}
              <div
                style={{
                  transform: `scale(${spring({ frame: Math.max(0, stepRelFrame - 4), fps, config: { damping: 10, mass: 0.5 } })})`,
                  padding: '14px 18px',
                  borderRadius: 18,
                  backgroundColor: '#0F172A',
                  border: '1.5px solid #334155',
                  opacity: isOfferSelected ? 0.7 : 1,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <AxisLogo size={50} />
                    <div>
                      <span style={{ fontSize: 22, fontWeight: 900, color: '#FFFFFF', display: 'block', lineHeight: 1.1 }}>Axis Bank</span>
                      <span style={{ fontSize: 14, color: '#94A3B8', fontWeight: 700 }}>24 Mo Dental EMI</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 26, fontWeight: 900, color: '#F8FAFC' }}>₹2,710</span>
                    <span style={{ fontSize: 15, color: '#94A3B8', fontWeight: 700 }}> /mo</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: 15, fontWeight: 800 }}>
                  <span style={{ color: '#E2E8F0' }}>Interest: <strong style={{ color: '#F8FAFC' }}>10.5% p.a.</strong></span>
                  <span style={{ color: '#10B981' }}>Processing Fee: <strong style={{ color: '#34D399' }}>2%</strong></span>
                </div>
              </div>

              {/* Offer 3: Bajaj Finserv */}
              <div
                style={{
                  transform: `scale(${spring({ frame: Math.max(0, stepRelFrame - 8), fps, config: { damping: 10, mass: 0.5 } })})`,
                  padding: '14px 18px',
                  borderRadius: 18,
                  backgroundColor: '#0F172A',
                  border: '1.5px solid #334155',
                  opacity: isOfferSelected ? 0.7 : 1,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <BajajLogo size={50} />
                    <div>
                      <span style={{ fontSize: 22, fontWeight: 900, color: '#FFFFFF', display: 'block', lineHeight: 1.1 }}>Bajaj Finserv</span>
                      <span style={{ fontSize: 14, color: '#94A3B8', fontWeight: 700 }}>24 Mo Dental EMI</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 26, fontWeight: 900, color: '#F8FAFC' }}>₹2,735</span>
                    <span style={{ fontSize: 15, color: '#94A3B8', fontWeight: 700 }}> /mo</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: 15, fontWeight: 800 }}>
                  <span style={{ color: '#E2E8F0' }}>Interest: <strong style={{ color: '#F8FAFC' }}>10.9% p.a.</strong></span>
                  <span style={{ color: '#10B981' }}>Processing Fee: <strong style={{ color: '#34D399' }}>2%</strong></span>
                </div>
              </div>
            </div>
          )}

          {activeStep === 4 && (
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
              <div
                style={{
                  transform: `scale(${spring({ frame: stepRelFrame, fps, config: { damping: 9, mass: 0.6 } })})`,
                  padding: '6px 20px',
                  borderRadius: 999,
                  backgroundColor: 'rgba(16, 185, 129, 0.25)',
                  color: '#34D399',
                  fontSize: 16,
                  fontWeight: 900,
                  boxShadow: '0 0 25px rgba(16, 185, 129, 0.6)',
                }}
              >
                🎉 TREATMENT FUNDED UPFRONT
              </div>
              <div style={{ fontSize: 36, fontWeight: 900, color: '#FFFFFF', lineHeight: 1.1 }}>
                ₹65,000 Paid to Clinic
              </div>
              <div
                style={{
                  transform: `scale(${spring({ frame: Math.max(0, stepRelFrame - 4), fps, config: { damping: 9, mass: 0.6 } })})`,
                  padding: '16px 24px',
                  borderRadius: 22,
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(6, 78, 59, 0.85) 100%)',
                  border: '2.5px solid #10B981',
                  width: '95%',
                  boxShadow: '0 10px 30px rgba(16, 185, 129, 0.35)',
                }}
              >
                <div style={{ fontSize: 16, color: '#D1FAE5', textTransform: 'uppercase', fontWeight: 900 }}>
                  Patient EMI Confirmed
                </div>
                <div style={{ fontSize: 46, fontWeight: 900, color: '#FFFFFF', margin: '4px 0' }}>
                  ₹2,650 <span style={{ fontSize: 20, color: '#A7F3D0' }}>/ mo</span>
                </div>
                <div style={{ fontSize: 17, color: '#E2E8F0', fontWeight: 700 }}>
                  Zero Follow-Up Required from Doctor
                </div>
              </div>
              <div
                style={{
                  transform: `scale(${spring({ frame: Math.max(0, stepRelFrame - 8), fps, config: { damping: 9, mass: 0.6 } })})`,
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
                Start Treatment Immediately 🦷
              </div>
            </div>
          )}
        </div>

        {/* Bottom Home Indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: 8 }}>
          <div style={{ width: '180px', height: '6px', backgroundColor: '#64748B', borderRadius: '999px' }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// =========================================================================
// SCENE 4: DENTIST PARTNERSHIP CALL TO ACTION & ENGAGEMENT
// =========================================================================
const Scene4HappyPatientCta: React.FC<{
  websiteUrl: string;
  partnerLendersCount: number;
  fps: number;
}> = ({ websiteUrl, partnerLendersCount, fps }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1]);
  const scale = spring({ frame, fps, config: { damping: 10, mass: 0.7 } });

  return (
    <AbsoluteFill style={{ opacity, zIndex: 10 }}>
      {/* Background Cinematic AI Happy Doctor & Clinic Image */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <Img
          src={staticFile('assets/reel/scene4-happy-patient.jpg')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${1 + frame * 0.0006})`,
            filter: 'brightness(0.62)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(2,6,23,0.85) 0%, rgba(2,6,23,0.2) 25%, rgba(2,6,23,0.95) 65%, #020617 100%)',
          }}
        />
      </div>

      {/* Main Conversion CTA Cards (Safe Zone: bottom 450px) */}
      <div
        style={{
          position: 'absolute',
          bottom: 450,
          left: 50,
          right: 50,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          textAlign: 'center',
          alignItems: 'center',
          transform: `scale(${scale})`,
        }}
      >
        <div>
          <h2 style={{ fontSize: 52, fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
            Grow Your Clinic Revenue 🚀
          </h2>
          <p style={{ fontSize: 24, color: '#CBD5E1', margin: '6px 0 0 0', fontWeight: 700 }}>
            ₹0 Setup Fee • Instant Upfront Payout • 55+ Lenders
          </p>
        </div>

        {/* High Engagement Comment EMI Card */}
        <div
          style={{
            width: '100%',
            padding: '20px 24px',
            borderRadius: 24,
            background: 'rgba(15, 23, 42, 0.95)',
            border: '2.5px solid #38BDF8',
            boxShadow: '0 0 35px rgba(56, 189, 248, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
          }}
        >
          <span style={{ fontSize: 34 }}>💬</span>
          <div style={{ textAlign: 'left' }}>
            <span style={{ fontSize: 28, fontWeight: 900, color: '#FFFFFF', display: 'block', lineHeight: 1.15 }}>
              Comment <span style={{ color: '#38BDF8' }}>"EMI"</span> Below
            </span>
            <span style={{ fontSize: 18, color: '#94A3B8', fontWeight: 700 }}>
              To activate Instant EMIs for your dental clinic!
            </span>
          </div>
        </div>

        {/* Primary Website CTA Button */}
        <div
          style={{
            width: '100%',
            padding: '26px 36px',
            borderRadius: 26,
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 25px 60px rgba(16, 185, 129, 0.5)',
          }}
        >
          <span style={{ fontSize: 28, fontWeight: 900, color: '#020617', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            PARTNER YOUR CLINIC &rarr; {websiteUrl}
          </span>
        </div>

        {/* Large Prominent Doctor Helpline Number Card */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            padding: '16px 28px',
            borderRadius: 20,
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            border: '2px solid rgba(16, 185, 129, 0.6)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
          }}
        >
          <span style={{ fontSize: 28 }}>📞</span>
          <span style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF' }}>
            Doctor Helpline: <strong style={{ color: '#34D399', fontSize: 28, letterSpacing: '0.04em' }}>7292984244</strong>
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
