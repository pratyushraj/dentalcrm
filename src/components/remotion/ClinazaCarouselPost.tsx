import React from 'react';
import { AbsoluteFill, Sequence, Img, staticFile } from 'remotion';

// =========================================================================
// CLINAZA INSTAGRAM CAROUSEL POST (V4 - HIGH ENGAGEMENT, MINIMAL TEXT, REAL PHOTOS)
// FORMAT: 1080 x 1350 (4:5 Portrait)
// =========================================================================

// Shared Header Logo & Tag
const TopBar: React.FC<{ slide: number; total: number; tag: string }> = ({ slide, total, tag }) => (
  <div
    style={{
      position: 'absolute',
      top: 40,
      left: 45,
      right: 45,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 30,
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(12px)',
        padding: '12px 22px',
        borderRadius: 20,
        boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
      }}
    >
      <Img
        src={staticFile('assets/clinaza-logo.jpg')}
        style={{ width: 58, height: 58, borderRadius: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
      />
      <div>
        <div style={{ fontSize: 24, fontWeight: 900, color: '#0B2450', letterSpacing: '0.04em', lineHeight: 1 }}>
          CLINAZA
        </div>
        <div style={{ fontSize: 13, fontWeight: 900, color: '#0867E8', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 4 }}>
          {tag}
        </div>
      </div>
    </div>

    <div
      style={{
        backgroundColor: '#0F172A',
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 900,
        padding: '12px 22px',
        borderRadius: 999,
        boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
      }}
    >
      {slide} / {total}
    </div>
  </div>
);

// Shared Bottom Bar
const BottomBar: React.FC<{ slide: number; total: number }> = ({ slide, total }) => (
  <div
    style={{
      position: 'absolute',
      bottom: 35,
      left: 45,
      right: 45,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 30,
    }}
  >
    <div
      style={{
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(8px)',
        padding: '10px 20px',
        borderRadius: 999,
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 700,
        display: 'flex',
        gap: 6,
      }}
    >
      <span>Follow</span>
      <span style={{ color: '#38BDF8', fontWeight: 900 }}>@clinaza.in</span>
    </div>

    {slide < total ? (
      <div
        style={{
          backgroundColor: '#0867E8',
          color: '#FFFFFF',
          fontSize: 14,
          fontWeight: 900,
          padding: '10px 22px',
          borderRadius: 999,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          boxShadow: '0 6px 18px rgba(8, 103, 232, 0.4)',
        }}
      >
        <span>SWIPE</span>
        <span style={{ fontSize: 18 }}>👉</span>
      </div>
    ) : (
      <div
        style={{
          backgroundColor: '#10B981',
          color: '#FFFFFF',
          fontSize: 14,
          fontWeight: 900,
          padding: '10px 22px',
          borderRadius: 999,
          boxShadow: '0 6px 18px rgba(16, 185, 129, 0.4)',
        }}
      >
        SAVE POST 📌
      </div>
    )}
  </div>
);

// ── SLIDE 1: HOOK (BRAND NEW UNIQUE SHOCKED PATIENT PHOTO) ──
export const Slide1Hook: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Background Brand New Shocked Patient Photo */}
      <Img
        src={staticFile('assets/carousel_v2/shocked_patient_new.jpg')}
        style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.95)' }}
      />

      {/* Top and Bottom Dark Gradient for Extreme Readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(2,6,23,0.85) 0%, rgba(2,6,23,0.1) 40%, rgba(2,6,23,0.92) 80%, #020617 100%)',
        }}
      />

      <TopBar slide={1} total={5} tag="DENTAL REVENUE" />

      {/* Bottom Floating Headline Card */}
      <div
        style={{
          position: 'absolute',
          bottom: 105,
          left: 45,
          right: 45,
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          borderRadius: 32,
          padding: '40px 38px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.45)',
          zIndex: 20,
        }}
      >
        <div
          style={{
            display: 'inline-block',
            backgroundColor: '#FEE2E2',
            color: '#B91C1C',
            fontSize: 15,
            fontWeight: 900,
            padding: '7px 16px',
            borderRadius: 10,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: 16,
          }}
        >
          ⚠️ Consultation Dilemma
        </div>

        <h1
          style={{
            fontSize: 56,
            fontWeight: 900,
            lineHeight: 1.15,
            color: '#0B2450',
            letterSpacing: '-0.03em',
            margin: '0 0 16px 0',
          }}
        >
          When a patient asks:
          <br />
          <span style={{ color: '#E11D48' }}>“Doctor, itna mehenga kyu hai?”</span>
        </h1>

        <div style={{ fontSize: 26, fontWeight: 700, color: '#334155', lineHeight: 1.35 }}>
          👉 Don't give a discount. <strong>Here is what to say instead.</strong>
        </div>
      </div>

      <BottomBar slide={1} total={5} />
    </AbsoluteFill>
  );
};

// ── SLIDE 2: DON'T DO THIS (VISUAL DOCTOR CONSULTATION BACKGROUND + COMPARISON CHIPS) ──
export const Slide2Mistakes: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Background Indian Clinic Doctor Consultation photo */}
      <Img
        src={staticFile('assets/doctor-consult-real.png')}
        style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.80)' }}
      />

      {/* Dark overlay for contrast */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(2,6,23,0.94) 0%, rgba(2,6,23,0.2) 28%, rgba(2,6,23,0.97) 64%, #020617 100%)',
        }}
      />

      <TopBar slide={2} total={5} tag="WHAT NOT TO DO" />

      {/* Floating Header Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 125,
          left: 45,
          right: 45,
          zIndex: 20,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            backgroundColor: '#EF4444',
            color: '#FFFFFF',
            padding: '10px 22px',
            borderRadius: 999,
            fontSize: 18,
            fontWeight: 900,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: 12,
          }}
        >
          <span>🛑 Fatal Clinic Mistake</span>
        </div>
        <h2
          style={{
            fontSize: 58,
            fontWeight: 900,
            color: '#FFFFFF',
            margin: 0,
            lineHeight: 1.12,
            textShadow: '0 4px 25px rgba(0,0,0,0.9)',
          }}
        >
          What 90% of Dentists Do <span style={{ color: '#F87171' }}>(And Lose The Case)</span>
        </h2>
      </div>

      {/* Bottom Floating Interactive Visual Cards */}
      <div
        style={{
          position: 'absolute',
          bottom: 105,
          left: 45,
          right: 45,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          zIndex: 20,
        }}
      >
        {/* Mistake 1 */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            borderRadius: 24,
            padding: '24px 28px',
            display: 'flex',
            alignItems: 'center',
            gap: 22,
            borderLeft: '12px solid #EF4444',
            boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 18,
              backgroundColor: '#FEE2E2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              flexShrink: 0,
            }}
          >
            📉
          </div>
          <div>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#0F172A' }}>
              Instant 20% Discount <span style={{ color: '#DC2626', fontSize: 20, fontWeight: 900 }}>❌ WRONG</span>
            </div>
            <div style={{ fontSize: 20, color: '#334155', fontWeight: 600, marginTop: 4 }}>
              Patient assumes: <em>"Doctor was overcharging or cutting quality."</em>
            </div>
          </div>
        </div>

        {/* Mistake 2 */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            borderRadius: 24,
            padding: '24px 28px',
            display: 'flex',
            alignItems: 'center',
            gap: 22,
            borderLeft: '12px solid #F59E0B',
            boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 18,
              backgroundColor: '#FEF3C7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              flexShrink: 0,
            }}
          >
            🔬
          </div>
          <div>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#0F172A' }}>
              Lecturing About Lab Costs <span style={{ color: '#D97706', fontSize: 20, fontWeight: 900 }}>❌ IGNORED</span>
            </div>
            <div style={{ fontSize: 20, color: '#334155', fontWeight: 600, marginTop: 4 }}>
              "German titanium, imported scanner..." Patients just hear excuses.
            </div>
          </div>
        </div>

        {/* Mistake 3 */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            borderRadius: 24,
            padding: '24px 28px',
            display: 'flex',
            alignItems: 'center',
            gap: 22,
            borderLeft: '12px solid #8B5CF6',
            boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 18,
              backgroundColor: '#EDE9FE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              flexShrink: 0,
            }}
          >
            ⏳
          </div>
          <div>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#0F172A' }}>
              Informal Clinic Khata <span style={{ color: '#7C3AED', fontSize: 20, fontWeight: 900 }}>❌ BAD DEBT</span>
            </div>
            <div style={{ fontSize: 20, color: '#334155', fontWeight: 600, marginTop: 4 }}>
              "Aadha abhi, baaki baad me." Once pain stops, follow-ups fail.
            </div>
          </div>
        </div>

        {/* Teaser CTA */}
        <div
          style={{
            backgroundColor: '#0867E8',
            color: '#FFFFFF',
            padding: '18px 24px',
            borderRadius: 20,
            textAlign: 'center',
            fontSize: 22,
            fontWeight: 900,
            boxShadow: '0 10px 25px rgba(8, 103, 232, 0.45)',
          }}
        >
          💡 Swipe to see the exact 10-second script that converts 👉
        </div>
      </div>

      <BottomBar slide={2} total={5} />
    </AbsoluteFill>
  );
};

// ── SLIDE 3: THE SCRIPT (AUTHENTIC CLINIC ENTRANCE + CLINICAL FINANCIAL CALCULATOR WIDGET) ──
export const Slide3Psychology: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Background Clinic Glass Door & EMI Sticker Photo */}
      <Img
        src={staticFile('assets/clinaza-clinic-sticker.jpg')}
        style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.78)' }}
      />

      {/* Dark overlay for contrast */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(2,6,23,0.95) 0%, rgba(2,6,23,0.2) 26%, rgba(2,6,23,0.97) 64%, #020617 100%)',
        }}
      />

      <TopBar slide={3} total={5} tag="THE 10-SECOND SCRIPT" />

      {/* Header Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 125,
          left: 45,
          right: 45,
          zIndex: 20,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            backgroundColor: '#10B981',
            color: '#FFFFFF',
            padding: '10px 22px',
            borderRadius: 999,
            fontSize: 18,
            fontWeight: 900,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: 12,
          }}
        >
          <span>🎯 High-Conversion Script</span>
        </div>
        <h2
          style={{
            fontSize: 58,
            fontWeight: 900,
            color: '#FFFFFF',
            margin: 0,
            lineHeight: 1.12,
            textShadow: '0 4px 25px rgba(0,0,0,0.9)',
          }}
        >
          Say This in Under 10 Seconds:
        </h2>
      </div>

      {/* Interactive Script & Price Reframing Comparison Widget */}
      <div
        style={{
          position: 'absolute',
          bottom: 105,
          left: 45,
          right: 45,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          zIndex: 20,
        }}
      >
        {/* Step 1 Dialog Card */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            borderRadius: 24,
            padding: '28px 32px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            borderLeft: '12px solid #0867E8',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 16, fontWeight: 900, color: '#0867E8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              STEP 1: VALIDATE THE VALUE
            </span>
            <span style={{ fontSize: 15, fontWeight: 800, backgroundColor: '#EFF6FF', color: '#0867E8', padding: '6px 14px', borderRadius: 999 }}>
              Don't Lower Price
            </span>
          </div>
          <div style={{ fontSize: 29, fontWeight: 800, color: '#0F172A', lineHeight: 1.35 }}>
            “I completely understand, Sharma ji. Implants are permanent 20+ year investments.”
          </div>
        </div>

        {/* Step 2 Before / After Price Reframe Card */}
        <div
          style={{
            backgroundColor: '#064E3B',
            borderRadius: 28,
            padding: '30px 32px',
            boxShadow: '0 20px 45px rgba(0,0,0,0.45)',
            border: '3px solid #10B981',
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 900, color: '#34D399', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 16 }}>
            STEP 2: REFRAME TO EASY MONTHLY EMI
          </div>

          {/* Visual Price Comparison Split */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 18,
              marginBottom: 20,
            }}
          >
            {/* Lump sum sticker shock */}
            <div
              style={{
                backgroundColor: 'rgba(0,0,0,0.45)',
                borderRadius: 20,
                padding: '18px 20px',
                border: '2px solid rgba(239, 68, 68, 0.45)',
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 800, color: '#F87171', textTransform: 'uppercase' }}>
                Lump Sum Shock ❌
              </div>
              <div style={{ fontSize: 42, fontWeight: 900, color: '#FCA5A5', textDecoration: 'line-through', marginTop: 4 }}>
                ₹55,000
              </div>
              <div style={{ fontSize: 15, color: '#E2E8F0', marginTop: 4, fontWeight: 600 }}>High friction</div>
            </div>

            {/* Flexible EMI breakdown */}
            <div
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.35)',
                borderRadius: 20,
                padding: '18px 20px',
                border: '3px solid #34D399',
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 900, color: '#6EE7B7', textTransform: 'uppercase' }}>
                Instant EMI Plan ✅
              </div>
              <div style={{ fontSize: 46, fontWeight: 900, color: '#FFFFFF', marginTop: 2 }}>
                ₹2,400<span style={{ fontSize: 24, color: '#A7F3D0' }}>/mo</span>
              </div>
              <div style={{ fontSize: 15, color: '#A7F3D0', fontWeight: 800, marginTop: 4 }}>Instant Approval • Paperless</div>
            </div>
          </div>

          <div style={{ fontSize: 26, fontWeight: 800, color: '#ECFDF5', lineHeight: 1.35 }}>
            “You don’t have to pay ₹55,000 today. You can comfortably do ₹2,400/month on an easy EMI right here.”
          </div>
        </div>

        {/* Psychological Result Note */}
        <div
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.96)',
            backdropFilter: 'blur(8px)',
            borderRadius: 20,
            padding: '18px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            border: '1px solid rgba(255, 255, 255, 0.25)',
          }}
        >
          <span style={{ fontSize: 32 }}>⚡</span>
          <div style={{ fontSize: 19, fontWeight: 800, color: '#F1F5F9', lineHeight: 1.3 }}>
            Question changes from <span style={{ color: '#F87171' }}>"Can I afford this?"</span> to <span style={{ color: '#34D399' }}>"Which EMI tenure fits my salary?"</span>
          </div>
        </div>
      </div>

      <BottomBar slide={3} total={5} />
    </AbsoluteFill>
  );
};

// ── SLIDE 4: THE REAL CLINIC PHOTO (DOCTOR SHOWING TABLET) ──
export const Slide4Script: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Background Doctor with Patient Photo */}
      <Img
        src={staticFile('assets/carousel_v2/doctor_tablet_new.jpg')}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />

      {/* Dark Readability Overlays */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(2,6,23,0.85) 0%, rgba(2,6,23,0.1) 40%, rgba(2,6,23,0.92) 80%, #020617 100%)',
        }}
      />

      <TopBar slide={4} total={5} tag="HOW CLINICS DO IT" />

      {/* Floating Insight Card */}
      <div
        style={{
          position: 'absolute',
          bottom: 105,
          left: 45,
          right: 45,
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          borderRadius: 32,
          padding: '40px 38px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.45)',
          zIndex: 20,
        }}
      >
        <div
          style={{
            display: 'inline-block',
            backgroundColor: '#EFF6FF',
            color: '#0867E8',
            fontSize: 15,
            fontWeight: 900,
            padding: '7px 16px',
            borderRadius: 10,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: 16,
          }}
        >
          💳 Point-of-Care Checkout
        </div>

        <h3 style={{ fontSize: 44, fontWeight: 900, color: '#0B2450', margin: '0 0 14px 0', lineHeight: 1.18 }}>
          Patients buy iPhones on EMI.<br />
          <span style={{ color: '#0867E8' }}>They expect it for healthcare too.</span>
        </h3>

        <div style={{ fontSize: 22, color: '#334155', fontWeight: 600, lineHeight: 1.4 }}>
          When you offer 2-minute paperless medical financing at your front desk, case acceptance jumps by <strong>40%+</strong>.
        </div>
      </div>

      <BottomBar slide={4} total={5} />
    </AbsoluteFill>
  );
};

// ── SLIDE 5: CTA / HAPPY PATIENT APPROVED PHOTO ──
export const Slide5Cta: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Background Happy Patient Approved Photo */}
      <Img
        src={staticFile('assets/carousel_v2/patient_approved_new.jpg')}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(2,6,23,0.85) 0%, rgba(2,6,23,0.15) 35%, rgba(2,6,23,0.95) 75%, #020617 100%)',
        }}
      />

      <TopBar slide={5} total={5} tag="GET STARTED FREE" />

      {/* Floating CTA Banner */}
      <div
        style={{
          position: 'absolute',
          bottom: 105,
          left: 45,
          right: 45,
          backgroundColor: '#0867E8',
          borderRadius: 32,
          padding: '40px 38px',
          color: '#FFFFFF',
          boxShadow: '0 25px 60px rgba(8, 103, 232, 0.45)',
          zIndex: 20,
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 900, color: '#BFDBFE', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
          🚀 100% FREE FOR DENTAL PRACTICES
        </div>

        <h3 style={{ fontSize: 46, fontWeight: 900, margin: '0 0 14px 0', lineHeight: 1.18 }}>
          Offer Patient EMIs in 2 Minutes.
        </h3>

        <div style={{ fontSize: 21, color: '#DBEAFE', fontWeight: 600, marginBottom: 24, lineHeight: 1.35 }}>
          Backed by 13+ RBI-regulated NBFCs • Zero clinic liability • Includes free digital consent forms &amp; Rx maker.
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 18,
            padding: '20px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: 24, fontWeight: 900, color: '#0867E8' }}>
            DM "GROWTH" or visit clinaza.in
          </span>
          <span style={{ fontSize: 26 }}>👉</span>
        </div>
      </div>

      <BottomBar slide={5} total={5} />
    </AbsoluteFill>
  );
};

// ── Combined Sequence Composition ──
export const ClinazaCarouselComposition: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Sequence from={0} durationInFrames={30}>
        <Slide1Hook />
      </Sequence>
      <Sequence from={30} durationInFrames={30}>
        <Slide2Mistakes />
      </Sequence>
      <Sequence from={60} durationInFrames={30}>
        <Slide3Psychology />
      </Sequence>
      <Sequence from={90} durationInFrames={30}>
        <Slide4Script />
      </Sequence>
      <Sequence from={120} durationInFrames={30}>
        <Slide5Cta />
      </Sequence>
    </AbsoluteFill>
  );
};
