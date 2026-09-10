import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from 'remotion';

export interface EstimateItem {
  name: string;
  cost: number;
  qty?: number;
  tooth?: string;
}

export interface EstimateVideoProps {
  patientName?: string;
  clinicName?: string;
  doctorName?: string;
  items?: EstimateItem[];
  grandTotal?: number;
  monthlyEmi?: number;
  tenureMonths?: number;
  clinicPhone?: string;
  clinicAddress?: string;
}

export const estimateDefaultProps: EstimateVideoProps = {
  patientName: 'Vikram Sharma',
  clinicName: 'Dr. Aryan Dental & Implant Clinic',
  doctorName: 'Dr. Aryan Parmar',
  items: [
    { name: 'Dental Implant (Titanium)', cost: 35000, qty: 1, tooth: '16' },
    { name: 'Zirconia Crown', cost: 12000, qty: 1, tooth: '16' }
  ],
  grandTotal: 47000,
  monthlyEmi: 2150,
  tenureMonths: 24,
  clinicPhone: '+91 7292984244',
  clinicAddress: 'Patliputra Colony, Patna'
};

export const EstimateVideoComposition: React.FC<EstimateVideoProps> = ({
  patientName = 'Patient',
  clinicName = 'Dental Clinic',
  doctorName = 'Dr. Aryan Parmar',
  items = [
    { name: 'Dental Implant (Titanium)', cost: 35000, qty: 1, tooth: '16' },
    { name: 'Zirconia Crown', cost: 12000, qty: 1, tooth: '16' }
  ],
  grandTotal = 47000,
  monthlyEmi = 2150,
  tenureMonths = 24,
  clinicPhone = '+91 7292984244',
  clinicAddress = 'Patliputra Colony, Patna',
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
      {/* Background Ambient Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Top Clinic Branding Bar */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 40,
          right: 40,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: 20,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          zIndex: 50,
        }}
      >
        <div>
          <span style={{ fontSize: 18, fontWeight: 900, letterSpacing: '0.05em', color: '#10B981' }}>
            {clinicName.toUpperCase()}
          </span>
          <p style={{ fontSize: 12, color: '#94A3B8', margin: 0 }}>Verified Partner Clinic</p>
        </div>
        <div
          style={{
            padding: '6px 14px',
            borderRadius: 999,
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            fontSize: 12,
            fontWeight: 700,
            color: '#34D399',
          }}
        >
          Care Plan
        </div>
      </div>

      {/* SEQUENCE 1: Personalized Intro (0 - 3s) */}
      <Sequence from={0} durationInFrames={90}>
        <IntroSlide patientName={patientName} doctorName={doctorName} fps={fps} />
      </Sequence>

      {/* SEQUENCE 2: Recommended Procedures (3s - 7s) */}
      <Sequence from={90} durationInFrames={120}>
        <ProceduresSlide items={items} grandTotal={grandTotal} fps={fps} />
      </Sequence>

      {/* SEQUENCE 3: Flexible EMI Breakdown (7s - 11s) */}
      <Sequence from={210} durationInFrames={120}>
        <EmiRevealSlide grandTotal={grandTotal} monthlyEmi={monthlyEmi} tenureMonths={tenureMonths} fps={fps} />
      </Sequence>

      {/* SEQUENCE 4: Clinic Booking & Next Steps (11s - 15s) */}
      <Sequence from={330} durationInFrames={120}>
        <CallToActionSlide clinicName={clinicName} phone={clinicPhone} address={clinicAddress} fps={fps} />
      </Sequence>
    </AbsoluteFill>
  );
};

const IntroSlide: React.FC<{ patientName: string; doctorName: string; fps: number }> = ({
  patientName,
  doctorName,
  fps,
}) => {
  const frame = useCurrentFrame();
  const scale = spring({ frame, fps, config: { damping: 12 } });
  const opacity = interpolate(frame, [0, 15, 75, 90], [0, 1, 1, 0]);

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
          borderRadius: 24,
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 36,
          marginBottom: 24,
          boxShadow: '0 12px 30px rgba(16, 185, 129, 0.3)',
        }}
      >
        🦷
      </div>
      <p style={{ fontSize: 14, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
        Personalized Treatment Estimate
      </p>
      <h1 style={{ fontSize: 34, fontWeight: 900, margin: '8px 0 12px 0', color: '#FFFFFF' }}>
        Hello, {patientName} 👋
      </h1>
      <p style={{ fontSize: 16, color: '#CBD5E1', maxWidth: '85%', lineHeight: 1.5, margin: 0 }}>
        Here is your customized clinical care plan prepared by <strong style={{ color: '#6EE7B7' }}>{doctorName}</strong>.
      </p>
    </AbsoluteFill>
  );
};

const ProceduresSlide: React.FC<{ items: EstimateItem[]; grandTotal: number; fps: number }> = ({
  items,
  grandTotal,
  fps,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15, 105, 120], [0, 1, 1, 0]);
  const translateY = interpolate(frame, [0, 20], [40, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 32px',
      }}
    >
      <span style={{ fontSize: 12, fontWeight: 800, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        Proposed Procedures
      </span>
      <h2 style={{ fontSize: 24, fontWeight: 900, margin: '4px 0 20px 0' }}>Your Treatment Roadmap</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.slice(0, 3).map((item, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '14px 18px',
              borderRadius: 16,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div>
              <strong style={{ fontSize: 15, color: '#F8FAFC', display: 'block' }}>{item.name}</strong>
              {item.tooth && <span style={{ fontSize: 11, color: '#94A3B8' }}>Tooth #{item.tooth}</span>}
            </div>
            <span style={{ fontSize: 15, fontWeight: 800, color: '#6EE7B7' }}>
              ₹{item.cost.toLocaleString('en-IN')}
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 20,
          padding: '12px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: 12,
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          border: '1px dashed rgba(99, 102, 241, 0.3)',
        }}
      >
        <span style={{ fontSize: 13, color: '#CBD5E1', fontWeight: 600 }}>Total Treatment Value:</span>
        <span style={{ fontSize: 18, fontWeight: 900, color: '#FFFFFF' }}>₹{grandTotal.toLocaleString('en-IN')}</span>
      </div>
    </AbsoluteFill>
  );
};

const EmiRevealSlide: React.FC<{ grandTotal: number; monthlyEmi: number; tenureMonths: number; fps: number }> = ({
  grandTotal,
  monthlyEmi,
  tenureMonths,
  fps,
}) => {
  const frame = useCurrentFrame();
  const scale = spring({ frame, fps, config: { damping: 10, mass: 0.8 } });
  const opacity = interpolate(frame, [0, 15, 105, 120], [0, 1, 1, 0]);

  return (
    <AbsoluteFill
      style={{
        opacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 32px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          padding: '6px 16px',
          borderRadius: 999,
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          fontSize: 12,
          fontWeight: 800,
          color: '#34D399',
          marginBottom: 16,
          textTransform: 'uppercase',
        }}
      >
        Don't Delay Your Dental Health
      </div>

      <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 16px 0', color: '#E2E8F0' }}>
        Pay In Easy Monthly Installments
      </h2>

      <div
        style={{
          transform: `scale(${scale})`,
          width: '100%',
          padding: '28px 20px',
          borderRadius: 24,
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 78, 59, 0.4) 100%)',
          border: '2px solid #10B981',
          boxShadow: '0 16px 40px rgba(16, 185, 129, 0.25)',
          marginBottom: 16,
        }}
      >
        <span style={{ fontSize: 13, color: '#A7F3D0', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.08em' }}>
          Starting At Just
        </span>
        <div style={{ fontSize: 44, fontWeight: 900, color: '#FFFFFF', margin: '6px 0' }}>
          ₹{monthlyEmi.toLocaleString('en-IN')}
          <span style={{ fontSize: 18, color: '#94A3B8', fontWeight: 600 }}> / month</span>
        </div>
        <p style={{ fontSize: 12, color: '#D1FAE5', margin: 0 }}>
          {tenureMonths} Months Tenure &bull; 0 Hidden Processing Fees
        </p>
      </div>

      <p style={{ fontSize: 12, color: '#94A3B8', margin: 0 }}>
        ⚡ Instant 2-min paperless digital approval at the clinic reception.
      </p>
    </AbsoluteFill>
  );
};

const CallToActionSlide: React.FC<{ clinicName: string; phone: string; address: string; fps: number }> = ({
  clinicName,
  phone,
  address,
  fps,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1]);
  const scale = spring({ frame, fps, config: { damping: 12 } });

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
      <div
        style={{
          transform: `scale(${scale})`,
          width: 72,
          height: 72,
          borderRadius: 24,
          backgroundColor: '#25D366',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 34,
          marginBottom: 20,
          boxShadow: '0 12px 30px rgba(37, 211, 102, 0.3)',
        }}
      >
        💬
      </div>

      <h2 style={{ fontSize: 26, fontWeight: 900, margin: '0 0 8px 0', color: '#FFFFFF' }}>
        Start Your Treatment Today
      </h2>
      <p style={{ fontSize: 14, color: '#94A3B8', margin: '0 0 24px 0', lineHeight: 1.4 }}>
        Contact <strong style={{ color: '#FFFFFF' }}>{clinicName}</strong> to reserve your appointment slot.
      </p>

      <div
        style={{
          width: '100%',
          padding: '16px',
          borderRadius: 16,
          backgroundColor: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        <span style={{ fontSize: 16, fontWeight: 800, color: '#34D399' }}>📞 {phone}</span>
        <span style={{ fontSize: 12, color: '#CBD5E1' }}>📍 {address}</span>
      </div>

      <p style={{ fontSize: 11, color: '#64748B', marginTop: 24 }}>
        Powered by Clinaza Healthcare Financing Infrastructure
      </p>
    </AbsoluteFill>
  );
};
