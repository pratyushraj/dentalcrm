import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';

// =========================================================================
// CLINAZA DIWALI INSTAGRAM POST (1080 x 1350 - 4:5 Portrait)
// Premium Festive Visual for @clinaza.in
// =========================================================================

export const DiwaliPostComposition: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#020617',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        color: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
        width: 1080,
        height: 1350,
      }}
    >
      {/* ── Background Deep Ambient Glows ── */}
      <div
        style={{
          position: 'absolute',
          top: -120,
          right: -100,
          width: 550,
          height: 550,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.22) 0%, rgba(2, 6, 23, 0) 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 100,
          left: -120,
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(217, 119, 6, 0.18) 0%, rgba(2, 6, 23, 0) 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Top Bar ── */}
      <div
        style={{
          position: 'absolute',
          top: 44,
          left: 48,
          right: 48,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 40,
        }}
      >
        {/* Clinaza Brand Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            backgroundColor: 'rgba(15, 23, 42, 0.88)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            backdropFilter: 'blur(16px)',
            padding: '12px 24px',
            borderRadius: 22,
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)',
          }}
        >
          <Img
            src={staticFile('assets/clinaza-logo.jpg')}
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              border: '1px solid rgba(245, 158, 11, 0.6)',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)',
            }}
          />
          <div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 900,
                color: '#FFFFFF',
                letterSpacing: '0.04em',
                lineHeight: 1,
              }}
            >
              CLINAZA
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 800,
                color: '#FBBF24',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginTop: 4,
              }}
            >
              FESTIVAL OF LIGHTS & SMILES
            </div>
          </div>
        </div>

        {/* Shubh Deepawali Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            backgroundColor: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.55)',
            color: '#FDE68A',
            fontSize: 17,
            fontWeight: 800,
            padding: '12px 22px',
            borderRadius: 999,
            boxShadow: '0 4px 20px rgba(245, 158, 11, 0.2)',
            letterSpacing: '0.03em',
          }}
        >
          <span>🪔</span>
          <span>SHUBH DEEPAWALI</span>
        </div>
      </div>

      {/* ── Main Photo Container (Central Focal Point) ── */}
      <div
        style={{
          position: 'absolute',
          top: 140,
          left: 48,
          right: 48,
          height: 680,
          borderRadius: 32,
          overflow: 'hidden',
          border: '1.5px solid rgba(245, 158, 11, 0.4)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(245, 158, 11, 0.15)',
          zIndex: 10,
        }}
      >
        <Img
          src={staticFile('assets/diwali/diwali_portrait_clean.jpg')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 20%',
          }}
        />

        {/* Inner Gradient Overlays for Cinematic Depth */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(2, 6, 23, 0.15) 0%, rgba(2, 6, 23, 0.0) 40%, rgba(2, 6, 23, 0.85) 100%)',
          }}
        />

        {/* Floating Diya Wish Tag in Image */}
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            left: 28,
            right: 28,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(245, 158, 11, 0.5)',
              backdropFilter: 'blur(10px)',
              padding: '8px 18px',
              borderRadius: 14,
              fontSize: 14,
              fontWeight: 700,
              color: '#FDE68A',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span>✨</span>
            <span>Celebrating Confident, Radiant Smiles</span>
          </div>

          <div
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              padding: '8px 16px',
              borderRadius: 14,
              fontSize: 13,
              fontWeight: 700,
              color: '#E2E8F0',
            }}
          >
            Diwali 2026
          </div>
        </div>
      </div>

      {/* ── Lower Card: Greetings & Message ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 110,
          left: 48,
          right: 48,
          backgroundColor: 'rgba(15, 23, 42, 0.92)',
          border: '1.5px solid rgba(245, 158, 11, 0.35)',
          backdropFilter: 'blur(20px)',
          borderRadius: 28,
          padding: '34px 38px 28px',
          boxShadow: '0 16px 45px rgba(0, 0, 0, 0.6), 0 0 30px rgba(245, 158, 11, 0.1)',
          zIndex: 30,
        }}
      >
        {/* Main Headline */}
        <div
          style={{
            fontSize: 44,
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            marginBottom: 14,
            textAlign: 'center',
          }}
        >
          <span>May Every Smile in Your Practice </span>
          <span
            style={{
              background: 'linear-gradient(90deg, #FDE68A 0%, #F59E0B 50%, #FBBF24 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block',
            }}
          >
            Shine Brighter ✨
          </span>
        </div>

        {/* Subtitle Message */}
        <div
          style={{
            fontSize: 20,
            lineHeight: 1.45,
            color: '#CBD5E1',
            textAlign: 'center',
            fontWeight: 500,
            marginBottom: 24,
            maxWidth: 880,
            margin: '0 auto 24px auto',
          }}
        >
          Wishing all our doctor partners, clinic teams, and patients a festival filled with joy, radiant health, and boundless prosperity.
        </div>

        {/* 3 Festive Value Badges */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              padding: '10px 20px',
              borderRadius: 16,
              fontSize: 16,
              fontWeight: 700,
              color: '#FDE68A',
            }}
          >
            <span>🪔</span>
            <span>Flourishing Practices</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              padding: '10px 20px',
              borderRadius: 16,
              fontSize: 16,
              fontWeight: 700,
              color: '#FDE68A',
            }}
          >
            <span>🦷</span>
            <span>Painless Patient Financing</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              padding: '10px 20px',
              borderRadius: 16,
              fontSize: 16,
              fontWeight: 700,
              color: '#FDE68A',
            }}
          >
            <span>✨</span>
            <span>Confident Healthy Smiles</span>
          </div>
        </div>
      </div>

      {/* ── Footer Bar ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 34,
          left: 48,
          right: 48,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 40,
        }}
      >
        {/* Clinaza Handle Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            padding: '8px 20px',
            borderRadius: 999,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: '#10B981',
              boxShadow: '0 0 10px #10B981',
            }}
          />
          <div style={{ fontSize: 16, fontWeight: 800, color: '#F8FAFC' }}>
            @clinaza.in
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: '#94A3B8',
            letterSpacing: '0.02em',
          }}
        >
          Empowering Dental Care & Affordability Across India 🇮🇳
        </div>
      </div>
    </AbsoluteFill>
  );
};
