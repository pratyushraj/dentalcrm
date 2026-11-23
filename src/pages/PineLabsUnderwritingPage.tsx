import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SEOHead } from '@/components/seo/SEOHead';
import { CLINIC_PREVIEW_ROBOTS, clinicLinkPreview, readClinicPreviewIdentity } from '@/lib/clinicLinkPreview.js';
import {
  ShieldCheck,
  Building2,
  FileSpreadsheet,
  Download,
  ExternalLink,
  CheckCircle2,
  Clock,
  Search,
  Lock,
  Phone,
  Mail,
  MapPin,
  Landmark,
  FileText,
  UserCheck,
  CreditCard,
  Copy,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  Eye,
  EyeOff,
  ArrowUpRight,
  Sparkles,
  RefreshCw,
  AlertCircle,
  FolderDown,
  ArrowDownToLine,
  Archive,
  FileCheck,
  X,
  Truck
} from 'lucide-react';
import { toast } from 'sonner';

// Verified Sub-Merchant KYC Dossiers for Pine Labs Plural Underwriting
export interface VerifiedDossier {
  id: string;
  clinic_name: string;
  legal_name: string;
  doctor_name: string;
  dob: string;
  pan: string;
  aadhaar: string;
  phone: string;
  email: string;
  city: string;
  pincode: string;
  address: string;
  residential_address: string;
  specialties: string[];
  submission_badge: string;
  readiness?: 'ready' | 'pending';
  missing_items?: string[];
  bank: {
    bank_name: string;
    account_holder: string;
    account_number: string;
    account_type: string;
    ifsc: string;
    branch: string;
    micr: string;
    cheque_no: string;
  };
  business_proof: {
    type: string;
    number: string;
    category: string;
    date: string;
  };
  docs: {
    signing_pdf: string;
    zip_bundle: string;
    maf_excel: string;
    gst_declaration_pdf?: string;
    cancelled_cheque: string;
    doctor_pan: string;
    aadhaar_front: string;
    aadhaar_back?: string;
    udyam_pdf?: string;
    establishment_reg?: string;
    dental_council_reg?: string;
    courier_receipt?: string;
    courier_awb?: string;
  };
  is_signed?: boolean;
  status: string;
}

const VERIFIED_DOSSIERS: VerifiedDossier[] = [
  {
    id: 'elara-ivf',
    clinic_name: 'Elara IVF',
    legal_name: 'ELARA IVF PRIVATE LIMITED',
    doctor_name: 'Gajendra Singh Chouhan',
    dob: '04/08/1975',
    pan: 'AAJCE6053H',
    aadhaar: '3596 1163 5054',
    phone: '+91 90011 61115',
    email: 'info@elaraivf.com',
    city: 'Jodhpur, Rajasthan',
    pincode: '342003',
    address: 'Floor No. 6, CYB-5, Dream Heights, Shastri Nagar, RIICO Heavy Industrial Area (Near Marwari Catalysts), Jodhpur, Rajasthan - 342003',
    residential_address: 'A 30, Arvind Nagar, Golf Link Road, Jodhpur Residency Road, Rajasthan - 342011',
    specialties: ['Reproductive Medicine', 'In Vitro Fertilization (IVF)', 'ICSI & Fertility Care', 'Daycare Clinical Procedures'],
    submission_badge: '100% Ready for MID • Corporate KYC Verified',
    readiness: 'ready',
    missing_items: [],
    bank: {
      bank_name: 'Kotak Mahindra Bank',
      account_holder: 'ELARA IVF PRIVATE LIMITED',
      account_number: '9001161115',
      account_type: 'Current Account',
      ifsc: 'KKBK0000279',
      branch: 'Commercial Complex Branch, Jodhpur - 342012',
      micr: '342485002',
      cheque_no: '000001'
    },
    business_proof: {
      type: 'Certificate of Incorporation (MCA)',
      number: 'U86202RJ2026PTC112940',
      category: 'Private Limited Company (Healthcare / MCC 8099)',
      date: '30/03/2026'
    },
    docs: {
      signing_pdf: '/docs/kyc/elara_ivf/Plural_MAF_and_Doctor_KYC_Signing_Dossier_Elara_IVF.pdf',
      zip_bundle: '/docs/kyc/elara_ivf/Elara_IVF_Complete_KYC_Dossier.zip',
      maf_excel: '/docs/kyc/elara_ivf/Plural_MAF_BO_PEP_Elara_IVF.xlsx',
      gst_declaration_pdf: '/docs/kyc/elara_ivf/elara_ivf_gst_certificate.pdf',
      cancelled_cheque: '/docs/kyc/elara_ivf/elara_ivf_cancelled_cheque.jpeg',
      doctor_pan: '/docs/kyc/elara_ivf/gajendra_singh_chouhan_pan.jpg',
      aadhaar_front: '/docs/kyc/elara_ivf/gajendra_singh_chouhan_aadhaar_front_back.jpg',
      establishment_reg: '/docs/kyc/elara_ivf/elara_ivf_certificate_of_incorporation.pdf',
      udyam_pdf: '/docs/kyc/elara_ivf/elara_ivf_gst_certificate.pdf'
    },
    is_signed: true,
    status: '100% Complete Corporate Pack • Ready for Pine Labs MID'
  },
  {
    id: 'vasantha-dental',
    clinic_name: 'Vasantha Dental Clinic & Implant Center',
    legal_name: 'VASANTHA DENTAL CLINIC AND IMPLANT CENTER (Sole Proprietorship)',
    doctor_name: 'Dr. V Siddardha Chaitanya',
    dob: '03/08/1984',
    pan: 'AIVPV7704K',
    aadhaar: '2777 8569 7017',
    phone: '+91 79896 96670',
    email: 'Drchaitu.2011@gmail.com',
    city: 'Visakhapatnam, Andhra Pradesh',
    pincode: '530017',
    address: 'D.No 1-56-23, Bank of India Lane, Sector 2, MVP Colony, Visakhapatnam, Andhra Pradesh - 530017',
    residential_address: 'D.No 10-33, G-2, Visalakshi Nagar, Kailasagiri Circle, Visakhapatnam, Andhra Pradesh - 530043',
    specialties: ['General Dentistry', 'Dental Implants', 'Oral Surgery'],
    submission_badge: '100% Ready for MID • Doctor Signed Dossier',
    readiness: 'ready',
    missing_items: [],
    bank: {
      bank_name: 'Bank of India (BOI)',
      account_holder: 'VASANTHA DENTAL CLINIC AND IMPLANT CENTER',
      account_number: '560320110000200',
      account_type: 'Current Account',
      ifsc: 'BKID0005603',
      branch: 'MVP COLONY Branch, Visakhapatnam, Andhra Pradesh - 530017',
      micr: '530013008',
      cheque_no: '1045107'
    },
    business_proof: {
      type: 'Udyam Registration Certificate',
      number: 'UDYAM-AP-10-0132936',
      category: 'Micro - Services',
      date: '06/05/2026'
    },
    docs: {
      signing_pdf: 'https://sqqocqujxlgoxbcnfbfb.supabase.co/storage/v1/object/public/clinic-documents/vasantha_dental/Signed_Doctor_KYC_Dossier_Dr_V_Siddardha_Chaitanya.pdf',
      zip_bundle: '/docs/kyc/vasantha_dental/Vasantha_Dental_Complete_KYC_Dossier.zip',
      maf_excel: '/docs/kyc/vasantha_dental/Plural_MAF_BO_PEP_Vasantha_Dental.xlsx',
      gst_declaration_pdf: '/docs/kyc/vasantha_dental/GST_Exemption_Declaration_vasantha_dental.pdf',
      cancelled_cheque: '/docs/kyc/vasantha_dental/vasantha_dental_cancelled_cheque.jpg',
      doctor_pan: '/docs/kyc/vasantha_dental/dr_siddardha_chaitanya_pan.jpg',
      aadhaar_front: '/docs/kyc/vasantha_dental/dr_siddardha_chaitanya_aadhaar.jpg',
      udyam_pdf: '/docs/kyc/vasantha_dental/vasantha_dental_udyam_certificate.pdf',
      establishment_reg: '/docs/kyc/vasantha_dental/vasantha_dental_ap_establishment_registration.jpg',
      dental_council_reg: '/docs/kyc/vasantha_dental/dr_siddardha_chaitanya_dental_council_registration.jpg',
      courier_receipt: 'https://sqqocqujxlgoxbcnfbfb.supabase.co/storage/v1/object/public/clinic-documents/vasantha_dental/dtdc_courier_receipt_vasantha_dental.jpg',
      courier_awb: 'DTDC AWB: N11002335698'
    },
    is_signed: true,
    status: 'Doctor Signed & Verified • Ready for MID'
  },
  {
    id: 'c1b4ab14-e0a4-4a60-9a86-ebedc9616675',
    clinic_name: 'HEAR ONE',
    legal_name: 'HEAR ONE (Sole Proprietorship)',
    doctor_name: 'Dr. Angiras Vishnu',
    dob: '16/02/1991',
    pan: 'AZHPV0033E',
    aadhaar: '4451 2414 5591',
    phone: '+91 85478 32924',
    email: 'info@hearone.in',
    city: 'Kakkanad, Ernakulam, Kerala',
    pincode: '682030',
    address: 'Near Civil Station, X/10 (F), Kakkanad, Ernakulam, Kerala - 682030',
    residential_address: 'Kidangaziyath Mana, West Chalakudy, Chalakudi H.O, Thrissur, Kerala - 680307',
    specialties: ['Audiology & Speech Rehab', 'Daycare Healthcare', 'ENT Allied Services'],
    submission_badge: '100% Ready for MID • Doctor Signed Dossier',
    readiness: 'ready',
    missing_items: [],
    bank: {
      bank_name: 'Bank of Baroda',
      account_holder: 'HEAR ONE',
      account_number: '30580200000228',
      account_type: 'Current Account',
      ifsc: 'BARB0KAKKAN',
      branch: 'Opp. Civil Station, Kinfra Road, Kakkanad, Kochi 682030',
      micr: '682012009',
      cheque_no: '000012'
    },
    business_proof: {
      type: 'Udyam Registration Certificate',
      number: 'UDYAM-KL-02-0000127',
      category: 'Micro - Services',
      date: '18/06/2020'
    },
    docs: {
      signing_pdf: 'https://sqqocqujxlgoxbcnfbfb.supabase.co/storage/v1/object/public/clinic-documents/hear_one/Signed_Doctor_KYC_Dossier_Dr_Angiras_Vishnu.pdf',
      zip_bundle: 'https://sqqocqujxlgoxbcnfbfb.supabase.co/storage/v1/object/public/clinic-documents/hear_one/Hear_One_Complete_KYC_Dossier.zip',
      maf_excel: '/docs/kyc/hear_one/Plural_MAF_BO_PEP_Hear_One.xlsx',
      gst_declaration_pdf: '/docs/kyc/hear_one/GST_Exemption_Declaration_hear_one.pdf',
      cancelled_cheque: '/docs/kyc/hear_one/hear_one_cancelled_cheque.jpg',
      doctor_pan: '/docs/kyc/hear_one/dr_angiras_vishnu_pan.jpg',
      aadhaar_front: '/docs/kyc/hear_one/dr_angiras_vishnu_aadhaar_front.jpg',
      aadhaar_back: '/docs/kyc/hear_one/dr_angiras_vishnu_aadhaar_back.jpg',
      udyam_pdf: '/docs/kyc/hear_one/hear_one_udyam_certificate.pdf'
    },
    is_signed: true,
    status: 'Doctor Signed & Verified • Ready for MID'
  },
  {
    id: 'nitya-dental',
    clinic_name: 'Nitya Dental & Cosmetic Clinic',
    legal_name: 'NITYA DENTAL AND COSMETIC CLINIC (Sole Proprietorship)',
    doctor_name: 'Dr. Bhanu Prakash Singh',
    dob: '25/12/1986',
    pan: 'BZUPS9855B',
    aadhaar: 'VID: 9104 2807 6329 2177 (XXXX 6013)',
    phone: '+91 89890 14483',
    email: 'bcds143@gmail.com',
    city: 'Bhopal, Madhya Pradesh',
    pincode: '462023',
    address: 'Shop No. 48, Minal Gate No. 1, J. K. Road, Raj Capital, Block No. 2, Bhopal, Madhya Pradesh - 462023',
    residential_address: 'House No. 2-H, Shri Ram Chandra Hights, Ayodhya By Pass Road, Huzur, Ayodhya Nagar, Bhopal, Madhya Pradesh - 462041',
    specialties: ['Dental Implants', 'Cosmetic Dentistry', 'Laser & Hair', 'Clear Aligners', 'Root Canal'],
    submission_badge: '100% Ready for MID • Doctor Signed Dossier',
    readiness: 'ready',
    missing_items: [],
    bank: {
      bank_name: 'HDFC Bank',
      account_holder: 'NITYA DENTAL AND COSMETIC CLINIC',
      account_number: '50200096846950',
      account_type: 'Current Account',
      ifsc: 'HDFC0008228',
      branch: 'STAR SQUARE, Kasturba Nagar, Bhopal - 462023',
      micr: '462240032',
      cheque_no: '000002'
    },
    business_proof: {
      type: 'Shop & Establishment Registration',
      number: 'BHOP240911SE006766',
      category: 'Labour Dept, Bhopal',
      date: '11/09/2024'
    },
    docs: {
      signing_pdf: 'https://sqqocqujxlgoxbcnfbfb.supabase.co/storage/v1/object/public/clinic-documents/nitya_dental/Signed_Doctor_KYC_Dossier_Dr_Bhanu_Prakash_Singh.pdf',
      zip_bundle: '/docs/kyc/nitya_dental/Nitya_Dental_Complete_KYC_Dossier.zip',
      maf_excel: '/docs/kyc/nitya_dental/Plural_MAF_BO_PEP_Nitya_Dental.xlsx',
      gst_declaration_pdf: '/docs/kyc/nitya_dental/GST_Exemption_Declaration_nitya_dental.pdf',
      cancelled_cheque: '/docs/kyc/nitya_dental/nitya_dental_cancelled_cheque.jpg',
      doctor_pan: '/docs/kyc/nitya_dental/dr_bhanu_prakash_pan.jpg',
      aadhaar_front: '/docs/kyc/nitya_dental/dr_bhanu_prakash_aadhaar_front.jpg',
      aadhaar_back: '/docs/kyc/nitya_dental/dr_bhanu_prakash_aadhaar_back.jpg',
      establishment_reg: '/docs/kyc/nitya_dental/nitya_dental_establishment_registration.jpg'
    },
    is_signed: true,
    status: 'Doctor Signed & Verified • Ready for MID'
  },
  {
    id: 'exldentist-clinic',
    clinic_name: 'Exldentist Clinic',
    legal_name: 'EXLDENTIST CLINIC (Sole Proprietorship)',
    doctor_name: 'Dr. Priyanka Kumar',
    dob: '03/05/1981',
    pan: 'AEKPB4894H',
    aadhaar: '2507 3633 1374',
    phone: '+91 99101 19555',
    email: 'kumarpriyankaa@gmail.com',
    city: 'Gurugram, Haryana',
    pincode: '122009',
    address: 'Flat No. 7702, Basement, 77th Avenue, DLF Phase 4, Gurugram, Haryana - 122009',
    residential_address: 'Flat No. 7702, 77th Avenue, DLF Phase 4, Gurugram, Haryana - 122009',
    specialties: ['Preventive Dentistry', 'Aesthetic & Cosmetic Dentistry', 'Dental Restorations', 'Root Canal Therapy'],
    submission_badge: 'Action Required • Aadhaar Back Pending',
    readiness: 'pending',
    missing_items: ['Aadhaar Card (Back Side with Address)'],
    bank: {
      bank_name: 'Axis Bank',
      account_holder: 'EXLDENTIST CLINIC',
      account_number: '920020052899970',
      account_type: 'Current Account',
      ifsc: 'UTIB0000131',
      branch: 'DLF Gurgaon Branch, Haryana - 122002',
      micr: '110211019',
      cheque_no: '000029'
    },
    business_proof: {
      type: 'Udyam Registration Certificate',
      number: 'UDYAM-HR-05-0120345',
      category: 'Micro - Services',
      date: '15/10/2024'
    },
    docs: {
      signing_pdf: 'https://sqqocqujxlgoxbcnfbfb.supabase.co/storage/v1/object/public/clinic-documents/exldentist_clinic/Signed_Doctor_KYC_Signing_Dossier_Dr_Priyanka_Kumar.pdf',
      zip_bundle: 'https://sqqocqujxlgoxbcnfbfb.supabase.co/storage/v1/object/public/clinic-documents/exldentist_clinic/Exldentist_Clinic_Complete_KYC_Dossier.zip',
      maf_excel: 'https://sqqocqujxlgoxbcnfbfb.supabase.co/storage/v1/object/public/clinic-documents/exldentist_clinic/Plural_MAF_BO_PEP_Exldentist_Clinic.xlsx',
      gst_declaration_pdf: 'https://sqqocqujxlgoxbcnfbfb.supabase.co/storage/v1/object/public/clinic-documents/exldentist_clinic/Signed_GST_Exemption_Declaration_exldentist_clinic.pdf',
      cancelled_cheque: 'https://sqqocqujxlgoxbcnfbfb.supabase.co/storage/v1/object/public/clinic-documents/exldentist_clinic/exldentist_cancelled_cheque.jpg',
      doctor_pan: 'https://sqqocqujxlgoxbcnfbfb.supabase.co/storage/v1/object/public/clinic-documents/exldentist_clinic/dr_priyanka_kumar_pan.jpg',
      aadhaar_front: 'https://sqqocqujxlgoxbcnfbfb.supabase.co/storage/v1/object/public/clinic-documents/exldentist_clinic/dr_priyanka_kumar_aadhaar.jpg',
      dental_council_reg: 'https://sqqocqujxlgoxbcnfbfb.supabase.co/storage/v1/object/public/clinic-documents/exldentist_clinic/dr_priyanka_kumar_dental_council_registration.jpg',
      udyam_pdf: 'https://sqqocqujxlgoxbcnfbfb.supabase.co/storage/v1/object/public/clinic-documents/exldentist_clinic/exldentist_udyam_certificate.jpg'
    },
    is_signed: true,
    status: 'Action Required • Awaiting Doctor Aadhaar Back Card'
  },
  {
    id: 'impressions-dental',
    clinic_name: 'Impressions Dental Clinic',
    legal_name: 'IMPRESSIONS DENTAL CLINIC (Sole Proprietorship)',
    doctor_name: 'Dr. Dushyant Soni',
    dob: '05/12/1982',
    pan: 'BMEPS1952G',
    aadhaar: '2871 6120 8712',
    phone: '+91 94131 45672',
    email: 'dushyantsoni5@gmail.com',
    city: 'Jodhpur, Rajasthan',
    pincode: '342008',
    address: 'Plot No. 119, Shri Krishna Nagar, Nahar Road Chopasani, Jodhpur, Rajasthan - 342008',
    residential_address: 'Plot No. 119, Nahar Road, Opp Balaji Hospital, Shri Krishna Nagar, Jodhpur, Rajasthan - 342008',
    specialties: ['Dental Implants', 'Full Mouth Rehabilitation', 'Cosmetic Dentistry', 'Laser & Restorations'],
    submission_badge: '100% Ready for MID • All Documents Verified',
    readiness: 'ready',
    missing_items: [],
    bank: {
      bank_name: 'HDFC Bank',
      account_holder: 'IMPRESSIONS DENTAL CLINIC',
      account_number: '50200099811004',
      account_type: 'Current Account',
      ifsc: 'HDFC0000142',
      branch: 'Sardarpura, Jodhpur (0142)',
      micr: '342240002',
      cheque_no: '000097'
    },
    business_proof: {
      type: 'Udyam Registration Certificate',
      number: 'UDYAM-RJ-22-0141614',
      category: 'Micro - Services',
      date: '11/11/2024'
    },
    docs: {
      signing_pdf: '/docs/kyc/impressions_dental/Plural_MAF_and_Doctor_KYC_Signing_Dossier_impressions_dental.pdf',
      zip_bundle: '/docs/kyc/impressions_dental/impressions_dental_Complete_KYC_Dossier.zip',
      maf_excel: '/docs/kyc/impressions_dental/Plural_MAF_BO_PEP_impressions_dental.xlsx',
      gst_declaration_pdf: '/docs/kyc/impressions_dental/GST_Exemption_Declaration_impressions_dental.pdf',
      cancelled_cheque: '/docs/kyc/impressions_dental/Cancelled_Cheque_impressions_dental.jpeg',
      doctor_pan: '/docs/kyc/impressions_dental/dr_dushyant_soni_pan.jpg',
      aadhaar_front: '/docs/kyc/impressions_dental/dr_dushyant_soni_aadhaar.jpg',
      udyam_pdf: '/docs/kyc/impressions_dental/impressions_dental_udyam_certificate.pdf'
    },
    is_signed: false,
    status: '100% Complete • HDFC Cheque & Udyam Verified'
  },
  {
    id: 'amitha-dental',
    clinic_name: 'Dr. Amitha Family Dental Care',
    legal_name: 'DR. AMITHA FAMILY DENTAL CARE (Sole Proprietorship)',
    doctor_name: 'Dr. Amitha G',
    dob: '01/05/1986',
    pan: 'CEXPG0906G',
    aadhaar: '7536 4100 6720',
    phone: '+91 99454 22014',
    email: 'info@dramithadental.com',
    city: 'Bengaluru, Karnataka',
    pincode: '560077',
    address: 'No. 90 and 91, 6th Cross, Double Road, MCECHS Layout, Hegde Nagar, Bangalore, Karnataka - 560077',
    residential_address: 'No. 563, 10th Cross, MCECHS Layout, R K Hegde Nagar, Dr. S R K Nagar Post, Bengaluru, Karnataka - 560077',
    specialties: ['Dental Implants', 'Clear Aligners', 'Full Mouth Rehabilitation', 'Zirconia Crowns & Ortho'],
    submission_badge: 'Action Required • Cancelled Cheque Pending',
    readiness: 'pending',
    missing_items: ['Settlement Bank Cancelled Cheque'],
    bank: {
      bank_name: 'Current Account (Under Bank Linking)',
      account_holder: 'DR. AMITHA FAMILY DENTAL CARE',
      account_number: 'Pending Cheque Upload',
      account_type: 'Current Account',
      ifsc: 'Under Verification',
      branch: 'Bengaluru Urban, Karnataka',
      micr: 'Under Verification',
      cheque_no: 'Pending Cheque Upload'
    },
    business_proof: {
      type: 'KPME Registration Certificate',
      number: 'BLU05843ALDEN',
      category: 'Dental Lab or Clinic (KPME Act 2018)',
      date: '09/11/2023'
    },
    docs: {
      signing_pdf: '/docs/kyc/amitha_dental/Plural_MAF_and_Doctor_KYC_Signing_Dossier_amitha_dental.pdf',
      zip_bundle: '/docs/kyc/amitha_dental/amitha_dental_Complete_KYC_Dossier.zip',
      maf_excel: '/docs/kyc/amitha_dental/Plural_MAF_BO_PEP_amitha_dental.xlsx',
      gst_declaration_pdf: '/docs/kyc/amitha_dental/GST_Exemption_Declaration_amitha_dental.pdf',
      cancelled_cheque: '/docs/kyc/amitha_dental/dr_amitha_kpme_certificate.jpg',
      doctor_pan: '/docs/kyc/amitha_dental/dr_amitha_pan.jpg',
      aadhaar_front: '/docs/kyc/amitha_dental/dr_amitha_aadhaar.jpg',
      establishment_reg: '/docs/kyc/amitha_dental/dr_amitha_kpme_certificate.jpg'
    },
    is_signed: false,
    status: 'Action Required • Awaiting Cancelled Cheque from Doctor'
  },
  {
    id: 'krishna-dental',
    clinic_name: 'Krishna Dental Clinic',
    legal_name: 'KRISHNA DENTAL CLINIC (Sole Proprietorship)',
    doctor_name: 'Dr. Saravan Kumar Vemula',
    dob: '11/12/1991',
    pan: 'BBRPV8925N',
    aadhaar: '3337 0525 4877',
    phone: '+91 93939 88929',
    email: 'krishnadentalcpt@gmail.com',
    city: 'Chilakaluripet, Guntur, Andhra Pradesh',
    pincode: '522616',
    address: 'Redla Bazzar, Opp Aryavyshya Kalyana Mandapam, Pasumuru Post, Chilakaluripeta, Guntur Dist, Andhra Pradesh - 522616',
    residential_address: '12-206/12, Purushotha Patnam, Chilakaluripet, Guntur, Andhra Pradesh - 522616',
    specialties: ['Dental Implants', 'Oral Surgery', 'Root Canal Treatments', 'Zirconia Crowns & Orthodontics'],
    submission_badge: '100% Ready for MID • All Documents Verified',
    readiness: 'ready',
    missing_items: [],
    bank: {
      bank_name: 'State Bank of India',
      account_holder: 'KRISHNA DENTAL CLINIC',
      account_number: '42028265432',
      account_type: 'Current Account',
      ifsc: 'SBIN0020507',
      branch: 'Kalamandir Centre, Chilakaluripet (20507)',
      micr: '522002405',
      cheque_no: '000647'
    },
    business_proof: {
      type: 'Udyam Registration Certificate',
      number: 'UDYAM-AP-04-0025994',
      category: 'Hospital Activities (NIC 86100)',
      date: '18/07/2022'
    },
    docs: {
      signing_pdf: '/docs/kyc/krishna_dental/Plural_MAF_and_Doctor_KYC_Signing_Dossier_krishna_dental.pdf',
      zip_bundle: '/docs/kyc/krishna_dental/krishna_dental_Complete_KYC_Dossier.zip',
      maf_excel: '/docs/kyc/krishna_dental/Plural_MAF_BO_PEP_krishna_dental.xlsx',
      gst_declaration_pdf: '/docs/kyc/krishna_dental/GST_Exemption_Declaration_krishna_dental.pdf',
      cancelled_cheque: '/docs/kyc/krishna_dental/Cancelled_Cheque_krishna_dental.jpeg',
      doctor_pan: '/docs/kyc/krishna_dental/Doctor_PAN_Card_krishna_dental.jpeg',
      aadhaar_front: '/docs/kyc/krishna_dental/Doctor_Aadhaar_Card_krishna_dental.jpeg',
      establishment_reg: '/docs/kyc/krishna_dental/Udyam_Registration_Certificate_krishna_dental.pdf'
    },
    is_signed: false,
    status: '100% Complete • SBI Cheque & Udyam Verified'
  }
];

// Backwards-compatibility alias
const SPOTLIGHT_CLINIC = VERIFIED_DOSSIERS[0];

export default function PineLabsUnderwritingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tokenParam = searchParams.get('access') || searchParams.get('token');
  const clinicParam = searchParams.get('clinic');

  // Partner authentication
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const auth = sessionStorage.getItem('plural_underwriting_auth');
    const authTime = sessionStorage.getItem('plural_auth_timestamp');
    if (auth === '1' && authTime) {
      const elapsedHours = (Date.now() - parseInt(authTime, 10)) / (1000 * 60 * 60);
      if (elapsedHours > 4) {
        sessionStorage.removeItem('plural_underwriting_auth');
        sessionStorage.removeItem('plural_auth_timestamp');
        return false;
      }
      return true;
    }
    return tokenParam === 'plural2026';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [showSensitivePii, setShowSensitivePii] = useState(false);

  // Clean up token parameter from browser address bar immediately so it is never exposed in browser history or copy-pastes
  useEffect(() => {
    if (tokenParam === 'plural2026') {
      sessionStorage.setItem('plural_underwriting_auth', '1');
      sessionStorage.setItem('plural_auth_timestamp', Date.now().toString());
      setIsAuthenticated(true);
      const cleanParams = new URLSearchParams(window.location.search);
      cleanParams.delete('access');
      cleanParams.delete('token');
      const newQuery = cleanParams.toString();
      const newUrl = window.location.pathname + (newQuery ? `?${newQuery}` : '');
      window.history.replaceState({}, '', newUrl);
    }
  }, [tokenParam]);

  const maskAadhaar = (val: string) => {
    if (showSensitivePii) return val;
    const clean = (val || '').replace(/\s+/g, '');
    if (clean.length < 4) return val;
    return `•••• •••• ${clean.slice(-4)}`;
  };

  const maskAccountNo = (val: string) => {
    if (showSensitivePii) return val;
    const clean = (val || '').replace(/\s+/g, '');
    if (clean.length < 4) return val;
    return `•••• •••• ${clean.slice(-4)}`;
  };

  const handleLockDesk = () => {
    sessionStorage.removeItem('plural_underwriting_auth');
    sessionStorage.removeItem('plural_auth_timestamp');
    setIsAuthenticated(false);
    toast.info('Underwriting Desk locked successfully');
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'ready' | 'pending'>('all');
  
  // Selected clinic state: null = View 1 (Queue), string = View 2 (Clinic Dossier & Docs)
  const [selectedDossierId, setSelectedDossierId] = useState<string | null>(() => clinicParam);

  // Sub-Merchant Underwriting Desk displays strictly the verified clinic dossiers with compiled Pine Labs documentation
  const allDossiers: VerifiedDossier[] = useMemo(() => {
    return [...VERIFIED_DOSSIERS];
  }, []);

  // Sync state if URL parameter changes
  useEffect(() => {
    if (clinicParam !== selectedDossierId) {
      setSelectedDossierId(clinicParam);
    }
  }, [clinicParam]);

  const activeDossier = selectedDossierId
    ? allDossiers.find(
        (d) =>
          d.id.toLowerCase() === selectedDossierId.toLowerCase() ||
          (selectedDossierId === 'hear-one' && d.id === 'c1b4ab14-e0a4-4a60-9a86-ebedc9616675') ||
          (selectedDossierId === 'c1b4ab14-e0a4-4a60-9a86-ebedc9616675' && d.id === 'hear-one') ||
          d.clinic_name.toLowerCase().includes(selectedDossierId.toLowerCase())
      ) || null
    : null;

  const handleSelectClinic = (id: string) => {
    setSelectedDossierId(id);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('clinic', id);
    setSearchParams(nextParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToQueue = () => {
    setSelectedDossierId(null);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('clinic');
    setSearchParams(nextParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const readyCount = useMemo(() => allDossiers.filter((d) => (d.readiness || 'ready') === 'ready').length, [allDossiers]);
  const pendingCount = useMemo(() => allDossiers.filter((d) => d.readiness === 'pending').length, [allDossiers]);

  const filteredDossiers = allDossiers.filter((d) => {
    // 1. Readiness Filter Tab
    if (filterTab === 'ready' && d.readiness === 'pending') return false;
    if (filterTab === 'pending' && (d.readiness || 'ready') !== 'pending') return false;

    // 2. Search query filter
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      d.clinic_name.toLowerCase().includes(q) ||
      d.doctor_name.toLowerCase().includes(q) ||
      d.city.toLowerCase().includes(q) ||
      d.bank.bank_name.toLowerCase().includes(q) ||
      d.bank.account_number.includes(q) ||
      d.pan.toLowerCase().includes(q)
    );
  });
  const [previewDocUrl, setPreviewDocUrl] = useState<string | null>(null);
  const [previewDocTitle, setPreviewDocTitle] = useState<string>('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === 'plural2026' || pinInput.trim() === 'clinaza2024') {
      sessionStorage.setItem('plural_underwriting_auth', '1');
      sessionStorage.setItem('plural_auth_timestamp', Date.now().toString());
      setIsAuthenticated(true);
      setPinError(false);
      toast.success('Welcome to Pine Labs Underwriting Desk');
    } else {
      setPinError(true);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  // Clinic-specific dynamic SEO & Open Graph preview for WhatsApp unfurls
  const spotlightClinic = clinicParam
    ? allDossiers.find(
        (d) =>
          d.id.toLowerCase() === clinicParam.toLowerCase() ||
          (clinicParam === 'hear-one' && d.id === 'c1b4ab14-e0a4-4a60-9a86-ebedc9616675') ||
          (clinicParam === 'c1b4ab14-e0a4-4a60-9a86-ebedc9616675' && d.id === 'hear-one') ||
          d.clinic_name.toLowerCase().includes(clinicParam.toLowerCase())
      )
    : null;

  const targetClinic = (isAuthenticated ? activeDossier : null) || spotlightClinic;
  const preview = clinicLinkPreview('underwriting', targetClinic ? {
    clinic: targetClinic.clinic_name,
    doctor: targetClinic.doctor_name,
    city: targetClinic.city,
  } : readClinicPreviewIdentity(searchParams));

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4">
        <SEOHead
          {...preview}
          robots={CLINIC_PREVIEW_ROBOTS}
        />
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <img src="/assets/clinaza-logo.jpg" alt="Clinaza" className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-sm" />
              <div>
                <span className="text-sm font-black tracking-widest text-slate-900">CLINAZA</span>
                <span className="block text-[10px] text-[#0867E8] font-bold uppercase tracking-wider">HealthPay</span>
              </div>
            </div>
            <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-1.5">
              <span className="text-[10px] font-black text-slate-500 tracking-wider">PARTNER:</span>
              <img src="/assets/plural_by_pinelabs_transparent.png" alt="Plural by Pine Labs" className="h-4 w-auto object-contain" />
            </div>
          </div>

          <div className="space-y-2 text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-[#0867E8] flex items-center justify-center mx-auto mb-2">
              <Lock size={22} />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">Underwriting Desk Access</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Confidential partner portal for Advaita Parmar &amp; Pine Labs Risk Team. Enter your access PIN:
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter Desk PIN (e.g. plural2026)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl bg-slate-50 border text-slate-900 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all ${
                  pinError ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
                autoFocus
              />
              {pinError && (
                <p className="text-xs text-rose-600 font-medium mt-1.5 flex items-center gap-1">
                  <AlertCircle size={12} /> Invalid access PIN. Contact Pratyush Raj (+91 7292984244).
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-blue-500/25 active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Unlock Underwriting Desk</span>
              <ArrowUpRight size={14} />
            </button>
          </form>

          <p className="text-[11px] text-center text-slate-400">
            Institutional Aggregator MID: <span className="font-mono text-slate-700 font-bold">111077</span> • ₹0 Setup / ₹0 AMC
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <SEOHead
        {...preview}
        robots={CLINIC_PREVIEW_ROBOTS}
      />

      {/* ── TOP INSTITUTIONAL BAR ── */}
      <header className="bg-white/95 border-b border-slate-200 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/assets/clinaza-logo.jpg" alt="Clinaza" className="w-9 h-9 rounded-xl object-cover border border-slate-200 shadow-xs" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black tracking-widest text-slate-900">CLINAZA</span>
                <span className="text-[9px] bg-blue-50 text-[#0867E8] font-extrabold px-1.5 py-0.5 rounded border border-blue-200">HealthPay</span>
              </div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Sub-Merchant Aggregator</p>
            </div>
          </Link>

          <span className="text-slate-300 hidden sm:inline">&bull;</span>

          <div className="hidden sm:flex items-center gap-2 bg-slate-50 px-2.5 py-1 rounded-xl shadow-2xs border border-slate-200">
            <span className="text-[9.5px] font-black text-slate-500 tracking-wider">GATEWAY:</span>
            <img src="/assets/plural_by_pinelabs_transparent.png" alt="Plural by Pine Labs" className="h-3.5 w-auto object-contain" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-[11px] bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <span className="text-slate-500">Desk Lead:</span>
            <span className="font-bold text-slate-800">Advaita Parmar</span>
            <span className="text-slate-300">&bull;</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Active Session
            </span>
          </div>

          <button
            onClick={() => setShowSensitivePii(!showSensitivePii)}
            className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
            title={showSensitivePii ? "Mask sensitive PII (Aadhaar & Bank)" : "Reveal sensitive PII"}
          >
            {showSensitivePii ? <EyeOff size={13} className="text-amber-600" /> : <Eye size={13} className="text-slate-500" />}
            <span>{showSensitivePii ? 'Mask PII' : 'Reveal PII'}</span>
          </button>

          <button
            onClick={handleLockDesk}
            className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Lock size={12} />
            <span>Lock Desk</span>
          </button>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">

        {!activeDossier ? (
          /* ══════════════════════════════════════════════════════════════
             PAGE 1: APPLICATIONS READY FOR UNDERWRITING (QUEUE LIST)
             ══════════════════════════════════════════════════════════════ */
          <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-7 shadow-xs space-y-6">
            {/* ── QUEUE HEADER & SEARCH FILTER ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                    Applications Ready for Underwriting ({filteredDossiers.length})
                  </h2>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-300">
                    Pine Labs Nodal Review
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Select a clinic application below to review doctor identity proofs, verify settlement bank accounts, and download official Pine Labs MAF Excel &amp; signing packages.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto shrink-0">
                <a
                  href="/docs/kyc/Clinaza_All_Clinics_Complete_KYC_Dossiers.zip"
                  download="Clinaza_All_Clinics_Complete_KYC_Dossiers.zip"
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-2xs whitespace-nowrap cursor-pointer"
                  title="Download All 8 Clinic KYC Packages in 1 Consolidated ZIP Archive"
                >
                  <FolderDown size={14} className="text-emerald-400" />
                  <span>Download Master ZIP (All Clinics)</span>
                </a>

                <div className="relative">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    aria-label="Search clinics by name, doctor, city, bank, or PAN"
                    placeholder="Search clinic, doctor, city, bank, PAN..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-64 pl-9 pr-8 py-2.5 rounded-xl bg-slate-50 sm:bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ── READINESS FILTER TABS ── */}
            <div role="tablist" aria-label="Underwriting readiness filter" className="flex flex-wrap items-center gap-2 pt-1 pb-1">
              <button
                role="tab"
                aria-selected={filterTab === 'all'}
                aria-controls="underwriting-queue-panel"
                onClick={() => setFilterTab('all')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterTab === 'all'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 border border-slate-200'
                }`}
              >
                <span>All Clinics</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-black ${
                  filterTab === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {allDossiers.length}
                </span>
              </button>

              <button
                role="tab"
                aria-selected={filterTab === 'ready'}
                aria-controls="underwriting-queue-panel"
                onClick={() => setFilterTab('ready')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterTab === 'ready'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <CheckCircle2 size={13} className={filterTab === 'ready' ? 'text-white' : 'text-emerald-600'} />
                <span>100% Ready for MID</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-black ${
                  filterTab === 'ready' ? 'bg-white/20 text-white' : 'bg-emerald-200/70 text-emerald-900'
                }`}>
                  {readyCount}
                </span>
              </button>

              <button
                role="tab"
                aria-selected={filterTab === 'pending'}
                aria-controls="underwriting-queue-panel"
                onClick={() => setFilterTab('pending')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterTab === 'pending'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                <AlertCircle size={13} className={filterTab === 'pending' ? 'text-white' : 'text-amber-600'} />
                <span>Pending Items</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-black ${
                  filterTab === 'pending' ? 'bg-white/20 text-white' : 'bg-amber-200/70 text-amber-900'
                }`}>
                  {pendingCount}
                </span>
              </button>
            </div>

            {/* ── CLINIC CARDS LIST (FULL-WIDTH BALANCED FLOW) ── */}
            <div className="space-y-4">
              {filteredDossiers.map((dossier) => {
                const isPending = dossier.readiness === 'pending';
                return (
                  <div
                    key={dossier.id}
                    onClick={() => handleSelectClinic(dossier.id)}
                    className="group bg-white hover:bg-slate-50/50 border border-slate-200 hover:border-[#0867E8]/60 rounded-2xl p-4 sm:p-6 transition-all shadow-xs hover:shadow-md cursor-pointer space-y-4"
                  >
                    {/* Clinic Identity & Header */}
                    <div className="flex items-start gap-3.5">
                      <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl font-bold flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs border ${
                        isPending
                          ? 'bg-amber-50 border-amber-200 text-amber-700'
                          : 'bg-blue-50 border-blue-200 text-[#0867E8]'
                      }`}>
                        <Building2 size={22} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-[#0867E8] transition-colors">
                            {dossier.clinic_name}
                          </h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                            {dossier.city.split(',')[0]}
                          </span>
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border shrink-0 flex items-center gap-1 ${
                            isPending
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          }`}>
                            {isPending ? <AlertCircle size={11} className="text-amber-600" /> : <CheckCircle2 size={11} className="text-emerald-600" />}
                            <span>{dossier.submission_badge}</span>
                          </span>
                        </div>
                        {/* Clean Non-Redundant Subtitle (Doctor + Legal Entity + Phone) */}
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          <strong>{dossier.doctor_name}</strong> &bull; {dossier.legal_name} &bull; {dossier.phone}
                        </p>
                      </div>
                    </div>

                    {/* Pending Documents Alert Strip (if action required) */}
                    {isPending && dossier.missing_items && dossier.missing_items.length > 0 && (
                      <div className="bg-amber-50/90 border border-amber-200 rounded-xl px-3.5 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-extrabold text-amber-900 text-[10.5px] uppercase tracking-wider flex items-center gap-1">
                            <AlertCircle size={12} className="text-amber-600" />
                            <span>Pending for MID:</span>
                          </span>
                          <span className="font-bold text-amber-950 text-[11px] bg-white px-2 py-0.5 rounded border border-amber-300 shadow-2xs">
                            {dossier.missing_items.join(', ')}
                          </span>
                        </div>
                        <span className="text-[10px] text-amber-700 font-semibold hidden sm:inline">Follow-up ongoing with clinic</span>
                      </div>
                    )}

                    {/* Settlement Bank Details - Full Width Structured Strip */}
                    <div className="bg-slate-50/80 rounded-xl p-3 sm:px-4 sm:py-3 border border-slate-200 text-xs">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900">
                          <Landmark size={14} className="text-emerald-600 shrink-0" />
                          <span className="whitespace-nowrap">{dossier.bank.bank_name}</span>
                        </div>
                        <span className="hidden sm:inline text-slate-300">&bull;</span>
                        <div className="flex items-center gap-1">
                          <span className="text-slate-500 text-[11px]">A/C:</span>
                          <span className="font-mono font-bold text-slate-800 bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[11px] whitespace-nowrap">
                            {maskAccountNo(dossier.bank.account_number)}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(dossier.bank.account_number, `${dossier.clinic_name} Account Number`);
                            }}
                            title="Copy Account Number"
                            aria-label={`Copy account number for ${dossier.clinic_name}`}
                            className="p-1 hover:bg-slate-200 text-slate-400 hover:text-slate-700 rounded transition-colors"
                          >
                            <Copy size={11} />
                          </button>
                        </div>
                        <span className="hidden sm:inline text-slate-300">&bull;</span>
                        <div className="flex items-center gap-1">
                          <span className="text-slate-500 text-[11px]">IFSC:</span>
                          <span className="font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 text-[11px] whitespace-nowrap">
                            {dossier.bank.ifsc}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(dossier.bank.ifsc, `${dossier.clinic_name} IFSC`);
                            }}
                            title="Copy IFSC"
                            aria-label={`Copy IFSC for ${dossier.clinic_name}`}
                            className="p-1 hover:bg-slate-200 text-slate-400 hover:text-slate-700 rounded transition-colors"
                          >
                            <Copy size={11} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Verification Badges */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <div className="inline-flex items-center gap-1.5 bg-blue-50 text-[#0867E8] border border-blue-200 px-2.5 py-1 rounded-xl text-[11px] font-bold">
                        <UserCheck size={13} />
                        <span>Doctor PAN: {dossier.pan}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(dossier.pan, `${dossier.doctor_name} PAN`);
                          }}
                          title="Copy Doctor PAN"
                          aria-label={`Copy doctor PAN for ${dossier.doctor_name}`}
                          className="p-0.5 hover:bg-blue-100 rounded text-blue-500 hover:text-blue-800 transition-colors"
                        >
                          <Copy size={11} />
                        </button>
                      </div>

                      <div className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-700 border border-teal-200 px-2.5 py-1 rounded-xl text-[11px] font-bold">
                        <FileCheck size={13} />
                        <span>{dossier.is_signed ? 'Doctor Signed PDF (Verified)' : 'Doctor Signing PDF Ready'}</span>
                      </div>

                      {dossier.docs.courier_awb && (
                        <div className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-xl text-[11px] font-bold">
                          <Truck size={13} className="text-purple-600" />
                          <span>Hardcopy In Transit ({dossier.docs.courier_awb})</span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Bar: Status Pill on Left, Primary CTA on Right */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3.5 border-t border-slate-100">
                      <div className="w-fit">
                        <span className={`text-[11px] font-black uppercase px-3 py-1.5 rounded-xl border tracking-wider inline-flex items-center gap-1.5 ${
                          isPending
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        }`}>
                          {isPending ? <AlertCircle size={13} className="text-amber-600" /> : <CheckCircle2 size={13} className="text-emerald-600" />}
                          <span>{dossier.status}</span>
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectClinic(dossier.id);
                        }}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer whitespace-nowrap group-hover:scale-102"
                      >
                        <span>Review Documents &amp; Dossier</span>
                        <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredDossiers.length === 0 && (
                <div className="text-center py-12 text-slate-500 text-xs bg-slate-50 rounded-2xl border border-slate-200">
                  No verified clinic application matching "{searchQuery}".
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ══════════════════════════════════════════════════════════════
             PAGE 2: DEDICATED CLINIC UNDERWRITING DOSSIER & DOCUMENTS
             (ONLY SHOWN WHEN ADVAITA CLICKS ON A CLINIC)
             ══════════════════════════════════════════════════════════════ */
          <div className="space-y-6">
            {/* Top Navigation & Clinic Quick Switcher */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBackToQueue}
                  className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all cursor-pointer border border-slate-300 shadow-2xs hover:scale-102"
                >
                  <ArrowLeft size={14} />
                  <span>Back to Applications Queue</span>
                </button>
                <span className="text-slate-300 hidden sm:inline">&bull;</span>
                <span className="text-xs text-slate-500 font-medium hidden sm:inline">Viewing Dossier:</span>
                <span className="text-xs font-black text-slate-900">{activeDossier.clinic_name}</span>
              </div>

              {/* Quick Clinic Switcher Pills */}
              <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 scrollbar-none" style={{ WebkitOverflowScrolling: 'touch' }}>
                <span className="text-[11px] text-slate-500 font-bold hidden lg:inline whitespace-nowrap">Switch Clinic:</span>
                {allDossiers.map((d) => {
                  const isSelected = d.id === activeDossier.id;
                  const isReady = d.readiness !== 'pending';
                  return (
                    <button
                      key={d.id}
                      onClick={() => handleSelectClinic(d.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border whitespace-nowrap shrink-0 ${
                        isSelected
                          ? 'bg-blue-50 border-[#0867E8] text-[#0867E8] ring-1 ring-blue-500/20'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full shrink-0 ${isReady ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <span>{d.clinic_name.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Focused Clinic Underwriting Dossier Card */}
            <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3.5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                    activeDossier.readiness === 'pending'
                      ? 'bg-amber-50 border-amber-200 text-amber-600'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-600'
                  }`}>
                    {activeDossier.readiness === 'pending' ? <AlertCircle size={24} /> : <CheckCircle2 size={24} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-black text-slate-900">{activeDossier.clinic_name}</h2>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                        activeDossier.readiness === 'pending'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      }`}>
                        {activeDossier.readiness === 'pending' ? <AlertCircle size={11} className="text-amber-600" /> : <CheckCircle2 size={11} className="text-emerald-600" />}
                        <span>{activeDossier.readiness === 'pending' ? 'Action Required' : '100% Ready for MID'}</span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {activeDossier.doctor_name} &bull; {activeDossier.city} &bull; {activeDossier.phone}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <a
                    href={activeDossier.docs.signing_pdf}
                    download={`Plural_MAF_and_Doctor_KYC_Signing_Dossier_${activeDossier.clinic_name.replace(/\s+/g, '_')}.pdf`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer active:scale-98"
                    title={activeDossier.is_signed ? "Download verified signed doctor dossier" : "Download consolidated official MAF + Doctor PAN & Aadhaar signing dossier"}
                  >
                    <FileCheck size={15} />
                    <span>{activeDossier.is_signed ? 'Doctor Signed PDF (Verified)' : 'Doctor Signing PDF'}</span>
                  </a>

                  <a
                    href={activeDossier.docs.maf_excel}
                    download={`Plural_MAF_BO_PEP_${activeDossier.clinic_name.replace(/\s+/g, '_')}.xlsx`}
                    className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer active:scale-98"
                    title="Download Pine Labs MAF Excel"
                  >
                    <FileSpreadsheet size={15} />
                    <span>Download MAF Excel</span>
                  </a>

                  <a
                    href={activeDossier.docs.zip_bundle}
                    download={`${activeDossier.clinic_name.replace(/\s+/g, '_')}_Complete_KYC_Dossier.zip`}
                    className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition-all cursor-pointer active:scale-98"
                    title="Download all raw KYC documents in a ZIP package"
                  >
                    <FolderDown size={14} />
                    <span>Full ZIP</span>
                  </a>

                  <span className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border ${
                    activeDossier.readiness === 'pending'
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  }`}>
                    Status: {activeDossier.status}
                  </span>
                </div>
              </div>

              {/* Dedicated Underwriting Readiness & Checklist Banner */}
              {activeDossier.readiness === 'pending' ? (
                <div className="bg-amber-50/80 border border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                      <AlertCircle size={16} />
                    </div>
                    <div>
                      <span className="font-extrabold text-amber-950 block text-xs">1 Action Required for Sub-Merchant MID Activation:</span>
                      <p className="text-amber-900 text-[11.5px] mt-0.5">
                        Missing document: <strong className="underline">{activeDossier.missing_items?.join(', ')}</strong>. Underwriters may proceed with preliminary PAN/account verification, but final Pine Labs terminal MID will map once this document is attached.
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-1.5 bg-white/90 px-3 py-1.5 rounded-xl border border-amber-200 text-amber-900 font-bold text-[11px] shadow-2xs">
                    <Clock size={13} className="text-amber-600" />
                    <span>Doctor Follow-Up Ongoing</span>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <span className="font-extrabold text-emerald-950 block text-xs">All Mandatory Documents Verified (100% Ready)</span>
                      <p className="text-emerald-800 text-[11.5px] mt-0.5">
                        Doctor PAN, Aadhaar (Front &amp; Back), Cancelled Cheque, Business Establishment Proof, and 3-sheet Pine Labs MAF Excel are complete and validated.
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-1.5 bg-emerald-100/80 text-emerald-900 px-3 py-1.5 rounded-xl font-black text-[11px] border border-emerald-300">
                    <CheckCircle2 size={13} className="text-emerald-700" />
                    <span>Eligible for Instant MID</span>
                  </div>
                </div>
              )}

              {/* 3-Column Dossier Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Col 1: Entity & Doctor Details */}
                <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200 space-y-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <UserCheck size={14} className="text-[#0867E8]" />
                    <span>Doctor &amp; Entity Identity</span>
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10.5px]">Legal Entity / DBA:</span>
                      <span className="font-bold text-slate-900">{activeDossier.legal_name}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10.5px]">Managing Doctor:</span>
                      <span className="font-bold text-slate-900">{activeDossier.doctor_name} (DOB: {activeDossier.dob})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-slate-500 block text-[10.5px]">Doctor PAN:</span>
                        <span className="font-mono font-bold text-emerald-700 text-sm bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">{activeDossier.pan}</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(activeDossier.pan, 'Doctor PAN')}
                        className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                        title="Copy PAN"
                      >
                        <Copy size={13} />
                      </button>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10.5px]">Aadhaar Number:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-800">{maskAadhaar(activeDossier.aadhaar)}</span>
                        <button
                          onClick={() => setShowSensitivePii(!showSensitivePii)}
                          className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                          title={showSensitivePii ? "Mask Aadhaar" : "Reveal Aadhaar"}
                        >
                          {showSensitivePii ? <EyeOff size={12} /> : <Eye size={12} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10.5px]">Operating Clinic Address:</span>
                      <span className="text-slate-700 leading-tight block">{activeDossier.address}</span>
                    </div>
                  </div>
                </div>

                {/* Col 2: Bank Settlement Details (from Cancelled Cheque) */}
                <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200 space-y-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <Landmark size={14} className="text-emerald-600" />
                    <span>Settlement Bank Account</span>
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10.5px]">Bank Name &amp; Branch:</span>
                      <span className="font-bold text-slate-900">{activeDossier.bank.bank_name}</span>
                      <span className="text-[11px] text-slate-500 block">{activeDossier.bank.branch}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10.5px]">Beneficiary Name:</span>
                      <span className="font-bold text-emerald-700">{activeDossier.bank.account_holder}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-slate-500 block text-[10.5px]">Current Account No:</span>
                        <span className="font-mono font-bold text-slate-900 text-sm bg-slate-200/70 px-2 py-0.5 rounded">{maskAccountNo(activeDossier.bank.account_number)}</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(activeDossier.bank.account_number, 'Account Number')}
                        className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                        title="Copy Account No"
                      >
                        <Copy size={13} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-slate-500 block text-[10.5px]">RTGS / NEFT IFSC:</span>
                        <span className="font-mono font-bold text-blue-700 text-sm bg-blue-50 px-2 py-0.5 rounded border border-blue-200">{activeDossier.bank.ifsc}</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(activeDossier.bank.ifsc, 'IFSC Code')}
                        className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                        title="Copy IFSC"
                      >
                        <Copy size={13} />
                      </button>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10.5px]">Cheque Verification:</span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 size={12} /> "CANCELLED" written &bull; MICR {activeDossier.bank.micr}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Col 3: Direct KYC Document Access */}
                <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200 space-y-2.5">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <FileText size={14} className="text-amber-600" />
                    <span>Verified KYC Documents</span>
                  </h3>
                  <div className="space-y-2">
                    <a
                      href={activeDossier.docs.signing_pdf}
                      download={`Plural_MAF_and_Doctor_KYC_Signing_Dossier_${activeDossier.clinic_name.replace(/\s+/g, '_')}.pdf`}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50/60 to-blue-50/60 border-2 border-emerald-500/50 hover:border-emerald-600 transition-all text-xs group cursor-pointer shadow-xs mb-2.5"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                          <FileCheck size={16} />
                        </div>
                        <div className="text-left">
                          <span className="font-extrabold text-slate-900 text-[12px] block group-hover:text-emerald-700 transition-colors">
                            {activeDossier.id === 'elara-ivf' ? 'Signed Board Resolution (PDF)' : activeDossier.is_signed ? 'Doctor Signed Dossier (PDF)' : 'Doctor Signing Dossier (PDF)'}
                          </span>
                          <span className="text-[10px] text-emerald-700 font-semibold">
                            {activeDossier.id === 'elara-ivf'
                              ? 'Pine Labs Arrangement Authorized • 3 Directors Signed (Corporate Resolution)'
                              : activeDossier.is_signed
                              ? 'Official MAF + GST Exemption + PAN + Aadhaar • Signed & Stamped (6 Pages Verified)'
                              : 'Official MAF + GST Exemption + PAN + Aadhaar • Ready to Sign'}
                          </span>
                        </div>
                      </div>
                      <ArrowDownToLine size={15} className="text-emerald-600 group-hover:translate-y-0.5 transition-transform" />
                    </a>

                    {activeDossier.docs.gst_declaration_pdf && (
                      <a
                        href={activeDossier.docs.gst_declaration_pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all text-xs group cursor-pointer shadow-2xs"
                      >
                        <div className="flex items-center gap-2">
                          <FileText size={14} className="text-emerald-600" />
                          <span className="font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                            {activeDossier.is_signed ? 'GST Exemption Declaration (Signed & Stamped)' : 'GST Exemption Declaration (Sec 23)'}
                          </span>
                        </div>
                        <ExternalLink size={13} className="text-slate-400 group-hover:text-slate-600" />
                      </a>
                    )}

                    <a
                      href={activeDossier.docs.cancelled_cheque}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all text-xs group cursor-pointer shadow-2xs"
                    >
                      <div className="flex items-center gap-2">
                        <Landmark size={14} className="text-emerald-600" />
                        <span className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                          Bank Cancelled Cheque
                        </span>
                      </div>
                      <ExternalLink size={13} className="text-slate-400 group-hover:text-slate-600" />
                    </a>

                    <a
                      href={activeDossier.docs.doctor_pan}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all text-xs group cursor-pointer shadow-2xs"
                    >
                      <div className="flex items-center gap-2">
                        <UserCheck size={14} className="text-[#0867E8]" />
                        <span className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                          Doctor PAN Card
                        </span>
                      </div>
                      <ExternalLink size={13} className="text-slate-400 group-hover:text-slate-600" />
                    </a>

                    <a
                      href={activeDossier.docs.aadhaar_front}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all text-xs group cursor-pointer shadow-2xs"
                    >
                      <div className="flex items-center gap-2">
                        <CreditCard size={14} className="text-sky-600" />
                        <span className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                          {activeDossier.docs.aadhaar_back || activeDossier.id === 'elara-ivf' ? 'Doctor Aadhaar (Front & Back)' : 'Doctor Aadhaar Card'}
                        </span>
                      </div>
                      <ExternalLink size={13} className="text-slate-400 group-hover:text-slate-600" />
                    </a>

                    <a
                      href={activeDossier.docs.udyam_pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all text-xs group cursor-pointer shadow-2xs"
                    >
                      <div className="flex items-center gap-2">
                        <FileText size={14} className="text-amber-600" />
                        <span className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                          {activeDossier.id === 'elara-ivf' ? 'GST Registration Certificate' : 'Udyam Registration Certificate'}
                        </span>
                      </div>
                      <ExternalLink size={13} className="text-slate-400 group-hover:text-slate-600" />
                    </a>

                    {activeDossier.docs.establishment_reg && (
                      <a
                        href={activeDossier.docs.establishment_reg}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all text-xs group cursor-pointer shadow-2xs"
                      >
                        <div className="flex items-center gap-2">
                          <ShieldCheck size={14} className="text-indigo-600" />
                          <span className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                            {activeDossier.business_proof.type || 'Medical Establishment Registration'}
                          </span>
                        </div>
                        <ExternalLink size={13} className="text-slate-400 group-hover:text-slate-600" />
                      </a>
                    )}

                    {activeDossier.docs.dental_council_reg && (
                      <a
                        href={activeDossier.docs.dental_council_reg}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all text-xs group cursor-pointer shadow-2xs"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-teal-600" />
                          <span className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                            State Dental Council Registration
                          </span>
                        </div>
                        <ExternalLink size={13} className="text-slate-400 group-hover:text-slate-600" />
                      </a>
                    )}

                    {activeDossier.docs.courier_receipt && (
                      <a
                        href={activeDossier.docs.courier_receipt}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-between p-2.5 rounded-xl bg-purple-50/60 border border-purple-200 hover:border-purple-400 hover:bg-purple-100/50 transition-all text-xs group cursor-pointer shadow-2xs"
                      >
                        <div className="flex items-center gap-2">
                          <Truck size={14} className="text-purple-600" />
                          <div className="text-left">
                            <span className="font-bold text-slate-900 group-hover:text-purple-700 transition-colors block">
                              DTDC Physical Hardcopy Courier Receipt
                            </span>
                            <span className="text-[10px] text-purple-700 font-mono font-semibold">
                              {activeDossier.docs.courier_awb} &bull; Consignee: Akhilesh Dhuriya (Pine Labs Noida)
                            </span>
                          </div>
                        </div>
                        <ExternalLink size={13} className="text-purple-500 group-hover:text-purple-700" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
