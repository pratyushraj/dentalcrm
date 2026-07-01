import { CareProgramTemplate, Customer } from './types';

export const CARE_PROGRAMS: CareProgramTemplate[] = [
  {
    id: 'joint_replacement',
    name: '90-Day Joint Replacement Recovery (TKR/THR)',
    category: 'Orthopaedic',
    description: 'Post-discharge recovery track for Total Knee or Hip Replacements.',
    steps: [
      { day: 1, message: 'Hi {name}, how are your post-discharge pain levels? Remember to take your blood thinners as prescribed and keep the leg elevated.', subLabel: 'Immediate post-discharge audit' },
      { day: 7, message: 'Hi {name}, it is time to check on your wound dressing. Let us schedule your stitch removal appointment for this week.', subLabel: 'Stitch removal alert' },
      { day: 14, message: 'Hi {name}, how is your physiotherapy mobilization going? You should be able to bend your knee to 90 degrees by now.', subLabel: 'Physio mobilization check' },
      { day: 30, message: 'Hi {name}, 1 month post-op! Any swelling or warmth in the joint? Let us schedule your 1-month clinical assessment.', subLabel: '1-Month clinical audit' },
      { day: 90, message: 'Hi {name}, 3 months done! Let us book your follow-up checkup with Dr. Dev Jaiswal and get a digital X-ray to check implant alignment.', subLabel: 'X-Ray review appointment' }
    ]
  },
  {
    id: 'fracture_cast',
    name: '30-Day Fracture & Plaster Cast Care',
    category: 'Orthopaedic',
    description: 'Cast tightness, circulation checks, and cast removal scheduling.',
    steps: [
      { day: 2, message: 'Hi {name}, is the plaster cast too tight? Check your fingers/toes for any numbness, bluish color, or coldness. Contact us immediately if you feel these.', subLabel: 'Circulation & fit check' },
      { day: 14, message: 'Hi {name}, how is the pain and swelling inside the cast? Keep the cast dry and do not insert any objects inside to scratch.', subLabel: 'Cast hygiene & comfort' },
      { day: 30, message: 'Hi {name}, your bone healing timeline is reaching the 4-week mark. Let us schedule a digital X-ray and cast removal appointment.', subLabel: 'Cast removal check' }
    ]
  },
  {
    id: 'acl_recovery',
    name: '6-Week ACL Reconstruction Track',
    category: 'Orthopaedic',
    description: 'Knee bracing milestones and bending angle tracking post-ligament repair.',
    steps: [
      { day: 3, message: 'Hi {name}, keep your brace locked in full extension while sleeping or walking. Perform your ankle pumps hourly.', subLabel: 'Brace compliance check' },
      { day: 14, message: 'Hi {name}, let us schedule your suture removal. You can start passive knee bending up to 90 degrees with your physical therapist.', subLabel: 'Suture removal & bending' },
      { day: 45, message: 'Hi {name}, 6 weeks post-op! You should be weaning off the crutches and walking normally with the brace unlocked. Let us book a progress review.', subLabel: 'Weaning off crutches' }
    ]
  },
  {
    id: 'back_pain',
    name: '14-Day Spine & Slip Disc Care',
    category: 'Orthopaedic',
    description: 'Posture guidelines, anti-inflammatory checks, and core exercises.',
    steps: [
      { day: 2, message: 'Hi {name}, how is the back pain? Avoid forward bending and sitting on low chairs. Apply hot fermentation if helpful.', subLabel: 'Posture compliance' },
      { day: 10, message: 'Hi {name}, as your acute spasm reduces, let us introduce gentle core stretching exercises. Let us know if pain radiates down your leg.', subLabel: 'Sciatica monitoring' }
    ]
  }
];

export const FOLLOW_UP_RULES: Array<{
  match: (customer: Customer) => boolean;
  days: number;
  label: string;
}> = [
  {
    match: (customer) => /replacement|knee|hip|tkr|thr/i.test(customer.service),
    days: 7,
    label: 'Post-op review',
  },
  {
    match: (customer) => /fracture|cast|plaster|bone/i.test(customer.service),
    days: 14,
    label: 'Cast review',
  },
  {
    match: (customer) => /acl|ligament|meniscus|arthroscopy/i.test(customer.service),
    days: 14,
    label: 'Post-op review',
  },
  {
    match: (customer) => /spine|disc|back|sciatica/i.test(customer.service),
    days: 10,
    label: 'Spine review',
  },
  {
    match: (customer) => /arthritis|joint pain|osteoarthritis/i.test(customer.service),
    days: 30,
    label: 'Physio follow-up',
  },
  {
    match: (customer) => /consultation|checkup|second opinion/i.test(customer.service),
    days: 15,
    label: 'Recall visit',
  },
];
