import json
import sqlite3
import os
import glob
import re
import sys

sys.path.append('/Users/pratyushraj/Desktop/dental-crm/scripts')
import check_lead_uniqueness as clu

DB_PATH = "/Users/pratyushraj/Desktop/dental-crm/src/scripts/outreach/dental_leads_master.db"
OUTPUT_FILE = "/Users/pratyushraj/Desktop/dental-crm/scripts/fresh_leads_west_mumbai_pune_nov13.json"

LEADS = [
    # --- PUNE (6 LEADS) ---
    {
        "doctor_name": "Dr. Himanshu Ajwani",
        "clinic_name": "Dr. Ajwani's Dental Center",
        "email": "ajwanidentalcare@gmail.com",
        "phone": "+91 77091 52097",
        "city": "Koregaon Park, Pune",
        "state": "Maharashtra",
        "specialty": "Oral Implantology & Aesthetic Dentistry",
        "website": "https://drajwanis.com"
    },
    {
        "doctor_name": "Dr. Priti Munde",
        "clinic_name": "DDS Dental Clinic",
        "email": "dr.pritimunde@gmail.com",
        "phone": "+91 96730 04407",
        "city": "Shivaji Nagar, Pune",
        "state": "Maharashtra",
        "specialty": "Cosmetic Dentistry & Oral Implantology",
        "website": "https://ddspune.com"
    },
    {
        "doctor_name": "Dr. Krishna Lahoti",
        "clinic_name": "Matoshree Multispeciality Dental Clinic",
        "email": "dentist.lahoti@gmail.com",
        "phone": "+91 92840 41202",
        "city": "Shivaji Nagar, Pune",
        "state": "Maharashtra",
        "specialty": "Prosthodontics, Dental Implants & Crown & Bridge",
        "website": "https://matoshreedental.com"
    },
    {
        "doctor_name": "Dr. Resham Kiswani",
        "clinic_name": "Dev's Oral Care",
        "email": "info@devsoralcare.com",
        "phone": "+91 98812 01966",
        "city": "Camp, Pune",
        "state": "Maharashtra",
        "specialty": "Oral Implantology & Digital Smile Design",
        "website": "https://devsoralcare.com"
    },
    {
        "doctor_name": "Dr. Vijay Deshmukh",
        "clinic_name": "Smilex Dental Implant & Aligner Centers",
        "email": "smilex.info1@gmail.com",
        "phone": "+91 97654 07660",
        "city": "Prabhat Road, Pune",
        "state": "Maharashtra",
        "specialty": "Oral Implantology & Invisalign Clear Aligners",
        "website": "https://smilex.co.in"
    },
    {
        "doctor_name": "Dr. Amruta Gotkhinde",
        "clinic_name": "Ultra Care Orthodontics",
        "email": "dramrutagotkhinde@gmail.com",
        "phone": "+91 91751 75005",
        "city": "Wanowrie, Pune",
        "state": "Maharashtra",
        "specialty": "Orthodontics, Braces & Clear Aligners",
        "website": "https://ultracaredentalclinic.co.in"
    },

    # --- THANE & NAVI MUMBAI (6 LEADS) ---
    {
        "doctor_name": "Dr. Krushnakumar Modi",
        "clinic_name": "Dantam Dental Care",
        "email": "dantamsmile@gmail.com",
        "phone": "+91 84840 92077",
        "city": "Majiwada, Thane",
        "state": "Maharashtra",
        "specialty": "Oral Implantology & Aesthetic Dentistry",
        "website": "https://dantamclinics.com"
    },
    {
        "doctor_name": "Dr. Kirti Nagrani",
        "clinic_name": "The Golden Tooth Multispecialty Dental Clinic",
        "email": "tgtdentalclinic@gmail.com",
        "phone": "+91 99306 15554",
        "city": "Majiwada, Thane",
        "state": "Maharashtra",
        "specialty": "Cosmetic Dentistry & Oral Implantology",
        "website": "https://thegoldentooth.in"
    },
    {
        "doctor_name": "Dr. Satish Kumar Menon",
        "clinic_name": "SK Smile Dental Clinic and Implant Centre",
        "email": "sksmiledental@gmail.com",
        "phone": "+91 82918 83844",
        "city": "Airoli, Navi Mumbai",
        "state": "Maharashtra",
        "specialty": "Periodontics & Oral Implantology",
        "website": "https://sksmiledental.com"
    },
    {
        "doctor_name": "Dr. V. Chivate",
        "clinic_name": "Dentrust Dental Clinic",
        "email": "info@dentrust.in",
        "phone": "+91 90821 92556",
        "city": "Brahmand, Thane",
        "state": "Maharashtra",
        "specialty": "Restorative Dentistry & Dental Implants",
        "website": "https://dentrust.in"
    },
    {
        "doctor_name": "Dr. H. Dongre",
        "clinic_name": "Smylift Dental",
        "email": "smyliftdental@gmail.com",
        "phone": "+91 84549 19267",
        "city": "Kolshet Road, Thane",
        "state": "Maharashtra",
        "specialty": "Aesthetic Dentistry & Endodontics",
        "website": "https://smyliftdental.com"
    },
    {
        "doctor_name": "Dr. Jenifa Parveen",
        "clinic_name": "The Dental Wellness Clinic",
        "email": "dr.jenifaparveensaquibshaikh@gmail.com",
        "phone": "+91 98218 51026",
        "city": "Seawoods, Navi Mumbai",
        "state": "Maharashtra",
        "specialty": "Restorative Dentistry & Oral Implantology",
        "website": "https://thedentalwellness.in"
    },

    # --- MUMBAI (6 LEADS) ---
    {
        "doctor_name": "Dr. Mehernosh Dotivala",
        "clinic_name": "MBrace Orthodontic Clinic",
        "email": "mdotivala@gmail.com",
        "phone": "+91 98202 33924",
        "city": "Nariman Point, Mumbai",
        "state": "Maharashtra",
        "specialty": "Orthodontics, Clear Aligners & Aesthetic Dentistry",
        "website": "https://mdotivala.com"
    },
    {
        "doctor_name": "Dr. Choksey Mehta",
        "clinic_name": "Divinity Dental Care",
        "email": "divinitydentalcare@gmail.com",
        "phone": "+91 98213 50549",
        "city": "Malabar Hill, Mumbai",
        "state": "Maharashtra",
        "specialty": "Aesthetic Dentistry & Oral Rehabilitation",
        "website": "http://www.divinitydentalcare.com"
    },
    {
        "doctor_name": "Dr. Adil Gandevivala",
        "clinic_name": "Expressions Maxillofacial Surgery and Dentistry",
        "email": "expressionstardeoclinic@gmail.com",
        "phone": "+91 70211 70579",
        "city": "Tardeo, Mumbai",
        "state": "Maharashtra",
        "specialty": "Maxillofacial Surgery, Dental Implants & Facial Aesthetics",
        "website": "https://expressionstardeoclinic.com"
    },
    {
        "doctor_name": "Dr. N. Shiwalkar",
        "clinic_name": "Dent-O-Fit Total Dental Fitness Centre",
        "email": "dentofitpowai@gmail.com",
        "phone": "+91 70458 88007",
        "city": "Powai, Mumbai",
        "state": "Maharashtra",
        "specialty": "Oral Implantology & Aesthetic Dentistry",
        "website": "https://dentofitpowai.com"
    },
    {
        "doctor_name": "Dr. Ninal",
        "clinic_name": "All Smiles Dental Clinic Santacruz",
        "email": "completedentalcare@hotmail.com",
        "phone": "+91 98691 90226",
        "city": "Santacruz West, Mumbai",
        "state": "Maharashtra",
        "specialty": "Dental Implants, Aesthetic Dentistry & Laser Care",
        "website": "https://allsmilesclinic.com"
    },
    {
        "doctor_name": "Dr. Binal",
        "clinic_name": "Smilora Dental Clinic",
        "email": "contact@smilora.in",
        "phone": "+91 77108 44636",
        "city": "Chembur, Mumbai",
        "state": "Maharashtra",
        "specialty": "Prosthodontics, Dental Implants & Invisible Aligners",
        "website": "https://www.smilora.in"
    },

    # --- GUJARAT (7 LEADS) ---
    {
        "doctor_name": "Dr. Prapti Vora",
        "clinic_name": "XL Smiles Dental Clinic",
        "email": "info@xlsmiles.com",
        "phone": "+91 99252 77959",
        "city": "Gotri, Vadodara",
        "state": "Gujarat",
        "specialty": "Endodontics, Restorative Dentistry & Oral Care",
        "website": "https://www.xlsmiles.com"
    },
    {
        "doctor_name": "Dr. Chintan Dobariya",
        "clinic_name": "Akshar Dental Care & Implant Centre",
        "email": "info@akshardentalcare.in",
        "phone": "+91 87809 09887",
        "city": "Prahlad Nagar, Ahmedabad",
        "state": "Gujarat",
        "specialty": "Oral Implantology & Full Mouth Rehabilitation",
        "website": "https://www.akshardentalcare.co.in"
    },
    {
        "doctor_name": "Dr. P. Sirodaria",
        "clinic_name": "Roots Dentistry Rajkot",
        "email": "rootsdentalrajkot@gmail.com",
        "phone": "+91 99040 19439",
        "city": "150 Feet Ring Road, Rajkot",
        "state": "Gujarat",
        "specialty": "Dental Implants, Aesthetic Restorations & Endodontics",
        "website": "https://rootsdentistry.in"
    },
    {
        "doctor_name": "Dr. Rima Kikani",
        "clinic_name": "Orbit Dental Clinic & Implant Center",
        "email": "orbitdentalclinic@gmail.com",
        "phone": "+91 93757 67335",
        "city": "Bopal, Ahmedabad",
        "state": "Gujarat",
        "specialty": "Dental Implants, Restorative Care & Smile Design",
        "website": "https://www.orbitdentalclinic.co.in"
    },
    {
        "doctor_name": "Dr. Ipsit Trivedi",
        "clinic_name": "AesthAlign Dental & Orthodontic Clinic",
        "email": "dripsittrivedi@gmail.com",
        "phone": "+91 98252 86343",
        "city": "Bopal-Ambli, Ahmedabad",
        "state": "Gujarat",
        "specialty": "Orthodontics, Invisalign Clear Aligners & Aesthetic Dentistry",
        "website": "https://aesthaligndental.com"
    },
    {
        "doctor_name": "Dr. Reshma Nilak",
        "clinic_name": "Shreeji Dental Care Manjalpur",
        "email": "info@shreejidentalcare.com",
        "phone": "+91 90990 77734",
        "city": "Manjalpur, Vadodara",
        "state": "Gujarat",
        "specialty": "Restorative Dentistry, Dental Implants & Cosmetic Care",
        "website": "https://www.shreejidentalcare.com"
    },
    {
        "doctor_name": "Dr. D. Patel",
        "clinic_name": "Ami Dental Clinic & Implant Center",
        "email": "21amidental@gmail.com",
        "phone": "+91 98791 74654",
        "city": "Naranpura, Ahmedabad",
        "state": "Gujarat",
        "specialty": "Dental Implants, Cosmetic Dentistry & Restorative Care",
        "website": "https://www.amidentalclinic.com"
    },

    # --- MADHYA PRADESH (5 LEADS) ---
    {
        "doctor_name": "Dr. Barkha Maheshwari",
        "clinic_name": "The Retreat Clinic",
        "email": "dr.barkha@yahoo.com",
        "phone": "+91 99260 53550",
        "city": "Geeta Bhawan, Indore",
        "state": "Madhya Pradesh",
        "specialty": "Oral Implantology, Cosmetic Dentistry & Smile Makeover",
        "website": "https://retreatclinicindore.com"
    },
    {
        "doctor_name": "Dr. Shubhangi",
        "clinic_name": "Dental Square A Family Dental Clinic",
        "email": "info@dentalsquarebhopal.com",
        "phone": "+91 98276 01992",
        "city": "Kolar Road, Bhopal",
        "state": "Madhya Pradesh",
        "specialty": "Dental Implants, Restorative Care & Smile Design",
        "website": "https://dentalsquarebhopal.com"
    },
    {
        "doctor_name": "Dr. Mimansha",
        "clinic_name": "My Dentist Indore",
        "email": "mydentistindore@gmail.com",
        "phone": "+91 87704 72878",
        "city": "AB Road, Indore",
        "state": "Madhya Pradesh",
        "specialty": "Oral Medicine, Invisible Aligners & Smile Correction",
        "website": "https://www.mydentistindore.com"
    },
    {
        "doctor_name": "Dr. Jindal",
        "clinic_name": "Smile Avenue Dental Clinic MP Nagar",
        "email": "drankitajindal@smileavenues.com",
        "phone": "+91 99811 98016",
        "city": "MP Nagar, Bhopal",
        "state": "Madhya Pradesh",
        "specialty": "Periodontics, Oral Implantology & Laser Dentistry",
        "website": "https://smileavenues.com"
    },
    {
        "doctor_name": "Dr. Nimit Jain",
        "clinic_name": "Arihant Superspeciality Dental Care and Implant Centre",
        "email": "arihantdentalcarebhopal@gmail.com",
        "phone": "+91 62608 32019",
        "city": "Nehru Nagar, Bhopal",
        "state": "Madhya Pradesh",
        "specialty": "Prosthodontics, Dental Implants & Full Mouth Rehabilitation",
        "website": "https://arihantdentalcare.com"
    }
]

def verify_and_save():
    print(f"Total candidate leads: {len(LEADS)}")
    assert len(LEADS) == 30, f"Expected 30 leads, got {len(LEADS)}"

    # Required fields check
    req_fields = ["doctor_name", "clinic_name", "email", "phone", "city", "state", "specialty", "website"]
    for i, lead in enumerate(LEADS, 1):
        for f in req_fields:
            assert f in lead and lead[f], f"Lead #{i} missing required field '{f}': {lead}"

    # Master database deduplication check
    emails, clinics, doctors = clu.get_existing_data()
    print(f"Loaded master database: {len(emails)} emails, {len(clinics)} clinics, {len(doctors)} doctors.")

    seen_emails = set()
    seen_clinics = set()

    for i, lead in enumerate(LEADS, 1):
        em = lead["email"].strip().lower()
        cl = lead["clinic_name"].strip().lower()

        # Internal duplicate check
        assert em not in seen_emails, f"Internal duplicate email in batch: {em}"
        assert cl not in seen_clinics, f"Internal duplicate clinic in batch: {cl}"
        seen_emails.add(em)
        seen_clinics.add(cl)

        # External uniqueness check
        fresh, reasons = clu.check_candidate(lead, emails, clinics, doctors)
        if not fresh:
            print(f"FAILED LEAD #{i}: {lead['clinic_name']} -> {reasons}")
            sys.exit(1)
        else:
            print(f"✓ Lead #{i:02d} verified fresh: {lead['clinic_name']} ({lead['city']}) - {lead['email']}")

    # Save to output file
    with open(OUTPUT_FILE, "w", encoding="utf-8") as fp:
        json.dump(LEADS, fp, indent=2, ensure_ascii=False)

    print(f"\nSUCCESS! Exactly 30 leads saved to {OUTPUT_FILE}")
    print(f"File size: {os.path.getsize(OUTPUT_FILE)} bytes.")

if __name__ == "__main__":
    verify_and_save()
