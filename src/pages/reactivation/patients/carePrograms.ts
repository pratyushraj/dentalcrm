import { CareProgramTemplate, Customer } from './types';

export const CARE_PROGRAMS: CareProgramTemplate[] = [
  {
    id: 'extraction',
    name: '7-Day Post-Extraction Care',
    category: 'Dental',
    description: 'Precautions, bleeding, and recovery tracking post-extraction.',
    steps: [
      { day: 1, message: 'Hi {name}, how is the bleeding and discomfort? Keep cotton pack pressed. Avoid spitting and hot liquids today.', subLabel: 'Immediate post-op checklist' },
      { day: 3, message: 'Hi {name}, is the swelling starting to decrease? You can start warm salt water rinses 4-5 times a day from today.', subLabel: 'Swelling & hygiene' },
      { day: 7, message: 'Hi {name}, healing should be completed. If you have non-dissolvable sutures, let us schedule a suture removal slot.', subLabel: 'Final healing check' }
    ]
  },
  {
    id: 'implant',
    name: '14-Day Dental Implant Osseointegration',
    category: 'Dental',
    description: 'Post-op guidance during critical healing weeks after implant placement.',
    steps: [
      { day: 1, message: 'Hi {name}, congrats on your new implant! Keep diet soft and cool. Do not rinse or spit aggressively today.', subLabel: 'Immediate implant care' },
      { day: 4, message: 'Hi {name}, minor discomfort is expected. Continue soft diet, maintain hygiene, and do not chew directly on the site.', subLabel: 'Osseointegration hygiene' },
      { day: 14, message: 'Hi {name}, let us schedule your implant healing check and suture removal visit. Reply to book a slot!', subLabel: 'Healing review' }
    ]
  },
  {
    id: 'aligners',
    name: '6-Month Clear Aligners Compliance Track',
    category: 'Dental',
    description: 'Tray compliance monitoring and scan reminders.',
    steps: [
      { day: 1, message: 'Hi {name}, tray 1 is in! Wear aligners 22 hours daily. Clean with cold water only. Let is get that smile! 🚀', subLabel: 'Compliance onboarding' },
      { day: 30, message: 'Hi {name}, time to change to tray 3. Any soreness or gaps? Text us if you need help.', subLabel: 'Tray check-in' },
      { day: 90, message: 'Hi {name}, 3 months done! Let us book a mid-course check-in scan to make sure trays match your 3D smile model.', subLabel: 'Mid-term scan review' },
      { day: 180, message: 'Hi {name}, you have reached final tray! Let us book your retainer impressions to secure your new smile permanently.', subLabel: 'Retainer phase start' }
    ]
  },
  {
    id: 'rct',
    name: 'Post-RCT sensitivity & Crown follow-up',
    category: 'Dental',
    description: 'Checks post root canal to confirm occlusion and schedule crown placement.',
    steps: [
      { day: 2, message: 'Hi {name}, how is the root-canal treated tooth? Mild sensitivity is normal. Let us know if bite feels too high.', subLabel: 'Bite & pain check' },
      { day: 10, message: 'Hi {name}, your RCT tooth is now ready for a permanent ceramic/zirconia crown to prevent fracture. Let us book a slot!', subLabel: 'Crown appointment' }
    ]
  }
];

export const FOLLOW_UP_RULES: Array<{
  match: (customer: Customer) => boolean;
  days: number;
  label: string;
}> = [
  {
    match: (customer) => /root canal|rct/i.test(customer.service) || !!(customer.toothNotes && Object.values(customer.toothNotes).some((note) => /rct/i.test(note))),
    days: 7,
    label: 'RCT review',
  },
  {
    match: (customer) => /implant/i.test(customer.service),
    days: 14,
    label: 'Implant review',
  },
  {
    match: (customer) => /crown|bridge/i.test(customer.service),
    days: 14,
    label: 'Crown trial',
  },
  {
    match: (customer) => /extraction|surgery/i.test(customer.service),
    days: 7,
    label: 'Healing check',
  },
  {
    match: (customer) => /cleaning|scaling|polish|checkup|whitening/i.test(customer.service),
    days: 90,
    label: 'Recall visit',
  },
  {
    match: (customer) => /braces|aligner/i.test(customer.service),
    days: 30,
    label: 'Progress review',
  },
];
