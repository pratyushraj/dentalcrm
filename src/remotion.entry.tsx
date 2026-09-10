import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { ClinazaEmiReelComposition } from './components/remotion/ClinazaEmiReelVideo';
import { EstimateVideoComposition } from './components/remotion/EstimateVideo';
import { SocialReelComposition } from './components/remotion/SocialReelVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ClinazaEmiReel"
        component={ClinazaEmiReelComposition}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          headline: "Don't Delay Your Dental Treatment Because of Cost 🦷💸",
          treatmentName: "Root Canal & Zirconia Crown",
          totalCost: 60000,
          monthlyEmi: 2650,
          tenureMonths: 24,
          benefits: [
            "⚡ 2-Minute Instant Eligibility Check",
            "📄 100% Paperless Digital eKYC",
            "🏦 Funded by RBI-Regulated Banks & NBFCs",
            "💳 0 Down Payment Options Available"
          ],
          partnerLendersCount: 15,
          websiteUrl: "clinaza.in"
        }}
      />
      <Composition
        id="EstimateVideo"
        component={EstimateVideoComposition}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
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
        }}
      />
      <Composition
        id="SocialReel"
        component={SocialReelComposition}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          hookTitle: '3 Reasons To Choose Invisible Aligners Over Braces 🦷✨',
          points: [
            'Virtually Invisible & Discreet in Photos',
            'Removable for Easy Eating & Brushing',
            'Predictable Results with 3D Digital Smile Simulation'
          ],
          callToAction: 'Book Free 3D Scan & EMI Consultation',
          clinicName: 'Clinaza Partner Dental Care',
          accentColor: '#10B981'
        }}
      />
    </>
  );
};

registerRoot(RemotionRoot);
