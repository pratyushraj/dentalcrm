import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from 'remotion';

export interface SocialReelProps {
  hookTitle?: string;
  points?: string[];
  callToAction?: string;
  clinicName?: string;
  accentColor?: string;
}

export const socialReelDefaultProps: SocialReelProps = {
  hookTitle: '3 Reasons To Choose Invisible Aligners Over Braces 🦷✨',
  points: [
    'Virtually Invisible & Discreet in Photos',
    'Removable for Easy Eating & Brushing',
    'Predictable Results with 3D Digital Smile Simulation'
  ],
  callToAction: 'Book Free 3D Scan & EMI Consultation',
  clinicName: 'Clinaza Partner Dental Care',
  accentColor: '#10B981'
};

export const SocialReelComposition: React.FC<SocialReelProps> = ({
  hookTitle = '3 Reasons To Choose Invisible Aligners Over Braces 🦷✨',
  points = [
    'Virtually Invisible & Discreet in Photos',
    'Removable for Easy Eating & Brushing',
    'Predictable Results with 3D Digital Smile Simulation'
  ],
  callToAction = 'Book Free 3D Scan & EMI Consultation',
  clinicName = 'Clinaza Partner Dental Care',
  accentColor = '#10B981',
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
        padding: '60px 40px',
      }}
    >
      {/* Dynamic Animated Gradient Background */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accentColor}25 0%, transparent 70%)`,
          filter: 'blur(100px)',
        }}
      />

      {/* Top Clinic Branding Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          zIndex: 20,
        }}
      >
        <div
          style={{
            padding: '8px 18px',
            borderRadius: 999,
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            fontSize: 13,
            fontWeight: 800,
            color: '#F8FAFC',
            backdropFilter: 'blur(10px)',
          }}
        >
          {clinicName}
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8' }}>#DentalTips</span>
      </div>

      {/* Main Kinetic Content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 28,
          zIndex: 20,
        }}
      >
        {/* Hook Header */}
        <HookHeader title={hookTitle} fps={fps} />

        {/* Dynamic Tip Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {points.map((point, idx) => (
            <Sequence key={idx} from={45 + idx * 40} durationInFrames={200}>
              <TipCard point={point} index={idx} fps={fps} accentColor={accentColor} />
            </Sequence>
          ))}
        </div>
      </div>

      {/* Bottom CTA Card */}
      <Sequence from={180} durationInFrames={120}>
        <BottomCTA ctaText={callToAction} fps={fps} accentColor={accentColor} />
      </Sequence>
    </AbsoluteFill>
  );
};

const HookHeader: React.FC<{ title: string; fps: number }> = ({ title, fps }) => {
  const frame = useCurrentFrame();
  const scale = spring({ frame, fps, config: { damping: 12 } });

  return (
    <div style={{ transform: `scale(${scale})` }}>
      <span
        style={{
          fontSize: 12,
          fontWeight: 900,
          color: '#34D399',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          display: 'block',
          marginBottom: 8,
        }}
      >
        Did You Know?
      </span>
      <h1
        style={{
          fontSize: 32,
          fontWeight: 900,
          lineHeight: 1.25,
          color: '#FFFFFF',
          margin: 0,
        }}
      >
        {title}
      </h1>
    </div>
  );
};

const TipCard: React.FC<{ point: string; index: number; fps: number; accentColor: string }> = ({
  point,
  index,
  fps,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const scale = spring({ frame, fps, config: { damping: 14 } });
  const opacity = interpolate(frame, [0, 10], [0, 1]);

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        opacity,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '18px 20px',
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        backdropFilter: 'blur(16px)',
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 12,
          backgroundColor: accentColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
          fontWeight: 900,
          color: '#FFFFFF',
          flexShrink: 0,
        }}
      >
        {index + 1}
      </div>
      <p style={{ fontSize: 16, fontWeight: 700, color: '#F1F5F9', margin: 0, lineHeight: 1.4 }}>
        {point}
      </p>
    </div>
  );
};

const BottomCTA: React.FC<{ ctaText: string; fps: number; accentColor: string }> = ({
  ctaText,
  fps,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const translateY = interpolate(frame, [0, 15], [30, 0], { extrapolateRight: 'clamp' });
  const opacity = interpolate(frame, [0, 15], [0, 1]);

  return (
    <div
      style={{
        transform: `translateY(${translateY}px)`,
        opacity,
        padding: '18px 24px',
        borderRadius: 20,
        background: `linear-gradient(135deg, ${accentColor} 0%, #059669 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 16px 36px rgba(16, 185, 129, 0.3)',
        zIndex: 30,
      }}
    >
      <div>
        <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: '#D1FAE5' }}>
          Flexible EMI Options Available
        </span>
        <strong style={{ fontSize: 15, display: 'block', color: '#FFFFFF' }}>{ctaText}</strong>
      </div>
      <span style={{ fontSize: 22 }}>👉</span>
    </div>
  );
};
