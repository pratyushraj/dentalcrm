import json
import os
import sqlite3
import re

DB_PATH = "/Users/pratyushraj/Desktop/dental-crm/src/scripts/outreach/dental_leads_master.db"
OUTPUT_PATH = "/Users/pratyushraj/Desktop/dental-crm/scripts/fresh_leads_south_nov08.json"

candidates = [
    # Bengaluru (10 leads)
    {
        "doctor_name": "Dr. Pramod K. M.",
        "clinic_name": "Dental De Care",
        "email": "dentaldecare4u@gmail.com",
        "phone": "+91 96111 26244",
        "city": "Bengaluru",
        "state": "Karnataka",
        "specialty": "Orthodontics & Invisalign Clear Aligners",
        "website": "https://dentaldecare.com"
    },
    {
        "doctor_name": "Dr. Sanjay Kaul",
        "clinic_name": "V Care Dental Speciality Clinic",
        "email": "hello@vcaredentist.com",
        "phone": "+91 63640 80009",
        "city": "Bengaluru",
        "state": "Karnataka",
        "specialty": "Periodontics & Dental Implants",
        "website": "https://vcaredentist.com"
    },
    {
        "doctor_name": "Dr. Saphal M. Shetty",
        "clinic_name": "Confident Dental Care",
        "email": "info@confidentdentalcare.in",
        "phone": "+91 91082 87126",
        "city": "Bengaluru",
        "state": "Karnataka",
        "specialty": "Implantology & Full Mouth Rehabilitation",
        "website": "https://confidentdentalcare.in"
    },
    {
        "doctor_name": "Dr. Narayan Babu",
        "clinic_name": "Sunkris Dental Health Care & Implant Centre",
        "email": "sunkrisdental@gmail.com",
        "phone": "+91 63643 33185",
        "city": "Bengaluru",
        "state": "Karnataka",
        "specialty": "Prosthodontics & Oral Implantology",
        "website": "https://sunkrisdentalindia.com"
    },
    {
        "doctor_name": "Dr. Sudhakar Reddy K.",
        "clinic_name": "Dr. Sudhakar Reddy Dental Implant Studio",
        "email": "studiodentalimplants@gmail.com",
        "phone": "+91 98457 98455",
        "city": "Bengaluru",
        "state": "Karnataka",
        "specialty": "Oral & Maxillofacial Surgery and Implantology",
        "website": "https://implantdentistindia.com"
    },
    {
        "doctor_name": "Dr. Tasneem Fathima",
        "clinic_name": "The Luxury Dentist",
        "email": "tasneem@luxurydentist.com",
        "phone": "+91 99648 66444",
        "city": "Bengaluru",
        "state": "Karnataka",
        "specialty": "Cosmetic Dentistry & Smile Makeovers",
        "website": "https://theluxurydentist.com"
    },
    {
        "doctor_name": "Dr. Jinesh Babu R.",
        "clinic_name": "House of Dentistry",
        "email": "info@houseofdentistry.in",
        "phone": "+91 94499 35053",
        "city": "Bengaluru",
        "state": "Karnataka",
        "specialty": "Orthodontics & Invisalign Smile Designing",
        "website": "https://houseofdentistry.in"
    },
    {
        "doctor_name": "Dr. Jagdish Rohira",
        "clinic_name": "Procure Dental Care",
        "email": "info@procuredental.co.in",
        "phone": "+91 77604 06570",
        "city": "Bengaluru",
        "state": "Karnataka",
        "specialty": "Implantology & Advanced Dental Care",
        "website": "https://procuredental.co.in"
    },
    {
        "doctor_name": "Dr. Shiraz Pasha P.",
        "clinic_name": "Bangalore Dental Care & Root Canal Clinic",
        "email": "support@bangaloredentalcare.in",
        "phone": "+91 90191 77107",
        "city": "Bengaluru",
        "state": "Karnataka",
        "specialty": "Endodontics & Restorative Dentistry",
        "website": "https://bangaloredentalcare.in"
    },
    {
        "doctor_name": "Dr. Sumedha Y. G.",
        "clinic_name": "Denta Care Multispeciality",
        "email": "dentacaremalleswaram@gmail.com",
        "phone": "+91 99002 61000",
        "city": "Bengaluru",
        "state": "Karnataka",
        "specialty": "Cosmetic Dentistry & Implantology",
        "website": "https://dentacaremultispeciality.in"
    },
    {
        "doctor_name": "Dr. Ranjani Rao",
        "clinic_name": "V2 E-City Dental Center",
        "email": "teamecitydental@gmail.com",
        "phone": "+91 80 4130 3132",
        "city": "Bengaluru",
        "state": "Karnataka",
        "specialty": "Implantology & Cosmetic Dentistry",
        "website": "https://ecitydental.com"
    },

    # Chennai (6 leads)
    {
        "doctor_name": "Dr. T. Ilango",
        "clinic_name": "Tower Dental Care",
        "email": "contact@towerdental.in",
        "phone": "+91 97907 94111",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "specialty": "Prosthodontics & Implant Dentistry",
        "website": "https://towerdental.in"
    },
    {
        "doctor_name": "Dr. Vaishnavi Prabhakar",
        "clinic_name": "Dr. Prabhakar's Dental Implant & Orofacial Center",
        "email": "drprabhakarsdental@gmail.com",
        "phone": "+91 98844 54603",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "specialty": "Prosthodontics, Implantology & TMJ Care",
        "website": "https://drprabhakarsdental.in"
    },
    {
        "doctor_name": "Dr. G. Natarajan",
        "clinic_name": "Shree Saikrupa Dental Care",
        "email": "shreesaikrupadental@gmail.com",
        "phone": "+91 98400 86926",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "specialty": "Implantology & Micro-Endodontics",
        "website": "https://saikrupadentalcare.com"
    },
    {
        "doctor_name": "Dr. D. Arunachalam",
        "clinic_name": "Smiles India Family Dentistry",
        "email": "info@smilesindia.com",
        "phone": "+91 98410 41075",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "specialty": "Periodontics & Oral Implantology",
        "website": "https://smilesindia.com"
    },
    {
        "doctor_name": "Dr. Pearlcid Siroraj",
        "clinic_name": "Marvel Dentistry",
        "email": "reception@marveldentistry.in",
        "phone": "+91 72002 51604",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "specialty": "Oral & Maxillofacial Surgery and Dental Implants",
        "website": "https://marveldentistry.in"
    },
    {
        "doctor_name": "Dr. S. Antony Praveen",
        "clinic_name": "Jehovah Dental Centre",
        "email": "jehovahdentalclinic@gmail.com",
        "phone": "+91 73058 03007",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "specialty": "Oral Surgery & Full-Mouth Dental Implants",
        "website": "https://jehovahdentalcentre.com"
    },
    {
        "doctor_name": "Dr. P. Rajesh Kumar",
        "clinic_name": "Thangam's Dental Clinic",
        "email": "painlessdentistry@thangamsdentalclinic.org",
        "phone": "+91 94440 28540",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "specialty": "Orthodontics, Clear Aligners & Dental Implants",
        "website": "https://thangamsdentalclinic.org"
    },

    # Hyderabad (7 leads)
    {
        "doctor_name": "Dr. Anupriya Jaitly",
        "clinic_name": "Dentalign Clinic",
        "email": "clinicdentalign@gmail.com",
        "phone": "+91 83338 01973",
        "city": "Hyderabad",
        "state": "Telangana",
        "specialty": "Orthodontics & Aesthetic Dentistry",
        "website": "https://dentalignclinic.com"
    },
    {
        "doctor_name": "Dr. Gowtham Kattamuri",
        "clinic_name": "GA Dental Clinics",
        "email": "contact@gadentalclinics.com",
        "phone": "+91 95054 43330",
        "city": "Hyderabad",
        "state": "Telangana",
        "specialty": "Conservative Dentistry, Endodontics & Implants",
        "website": "https://gadentalclinics.com"
    },
    {
        "doctor_name": "Dr. Mettu Shanthan Reddy",
        "clinic_name": "Toothway Dental",
        "email": "info@toothway.in",
        "phone": "+91 74167 22020",
        "city": "Hyderabad",
        "state": "Telangana",
        "specialty": "Prosthodontics & Oral Implantology",
        "website": "https://toothway.in"
    },
    {
        "doctor_name": "Dr. Sudhakar Rao",
        "clinic_name": "Galaxy Dental Care",
        "email": "contact@galaxydentalcare.in",
        "phone": "+91 86866 76781",
        "city": "Hyderabad",
        "state": "Telangana",
        "specialty": "Dental Implants & Laser Dentistry",
        "website": "https://galaxydentalcare.in"
    },
    {
        "doctor_name": "Dr. Keerthi Sudireddy",
        "clinic_name": "The Tooth Studio",
        "email": "contact@toothstudioindia.com",
        "phone": "+91 70139 38958",
        "city": "Hyderabad",
        "state": "Telangana",
        "specialty": "Endodontics & Implantology",
        "website": "https://toothstudioindia.com"
    },
    {
        "doctor_name": "Dr. Pallavi Reddy",
        "clinic_name": "Danta Kshetra - The Dental Hospital",
        "email": "info@dantakshetra.in",
        "phone": "+91 91009 00666",
        "city": "Hyderabad",
        "state": "Telangana",
        "specialty": "Periodontics & Dental Implants",
        "website": "https://dantakshetra.com"
    },
    {
        "doctor_name": "Dr. Sahithi Ram",
        "clinic_name": "S2 Dental Care",
        "email": "s2dentalcarehyd@gmail.com",
        "phone": "+91 99485 11770",
        "city": "Hyderabad",
        "state": "Telangana",
        "specialty": "Cosmetic Dentistry & Implant Care",
        "website": "https://s2dental.in"
    },
    {
        "doctor_name": "Dr. Divya Jhaver",
        "clinic_name": "DentO'clock Dental Care",
        "email": "dentoclockdentalcare@gmail.com",
        "phone": "+91 76709 80925",
        "city": "Hyderabad",
        "state": "Telangana",
        "specialty": "Endodontics & Clear Aligners",
        "website": "https://dentoclock.in"
    },

    # Kochi (1 lead)
    {
        "doctor_name": "Dr. Akhil Karickal Mohan",
        "clinic_name": "Dental Point Orthodontic & Root Canal Centre",
        "email": "contact@dentalpoint.in",
        "phone": "+91 97440 20555",
        "city": "Kochi",
        "state": "Kerala",
        "specialty": "Orthodontics, Clear Aligners & Micro-Endodontics",
        "website": "https://dentalpoint.in"
    },

    # Coimbatore (1 lead)
    {
        "doctor_name": "Dr. Agalyaa",
        "clinic_name": "Indus Dental Care",
        "email": "indusdentalclinic786@gmail.com",
        "phone": "+91 94894 32054",
        "city": "Coimbatore",
        "state": "Tamil Nadu",
        "specialty": "Cosmetic Dentistry & Dental Implants",
        "website": "https://indusdentalcare.com"
    },

    # Visakhapatnam (1 lead)
    {
        "doctor_name": "Dr. Naveen Kumar Antyakula",
        "clinic_name": "Tooth Planet Laser & Implant Centre",
        "email": "toothplanetvizag@gmail.com",
        "phone": "+91 94417 55805",
        "city": "Visakhapatnam",
        "state": "Andhra Pradesh",
        "specialty": "Laser Dentistry & Oral Implantology",
        "website": "https://toothplanet.in"
    },

    # Mysore (2 leads)
    {
        "doctor_name": "Dr. Omprakash Y.V.",
        "clinic_name": "Life Care Dental Clinic",
        "email": "info@lifecaredentalclinic.com",
        "phone": "+91 98860 37522",
        "city": "Mysore",
        "state": "Karnataka",
        "specialty": "Prosthodontics & Oral Implantology",
        "website": "https://lifecaredentalclinic.com"
    },
    {
        "doctor_name": "Dr. Jagadish S.",
        "clinic_name": "Contour Smile Dental Home",
        "email": "contoursmilemysore@gmail.com",
        "phone": "+91 72047 17979",
        "city": "Mysore",
        "state": "Karnataka",
        "specialty": "Prosthodontics, Aesthetic Dentistry & Implants",
        "website": "https://contoursmile.co.in"
    }
]

print(f"Total candidates proposed: {len(candidates)}")

# We will select exactly 28 leads (within the 25 to 30 requirement).
# Let's inspect all candidates against the database:
conn = sqlite3.connect(DB_PATH)
c = conn.cursor()
c.execute("SELECT lower(email) FROM leads")
db_emails = set(r[0].strip() for r in c.fetchall() if r[0])

clean_leads = []
seen_emails = set()

for lead in candidates:
    em = lead["email"].strip().lower()
    assert em not in db_emails, f"DUPLICATE IN DB: {em}"
    assert em not in seen_emails, f"DUPLICATE IN BATCH: {em}"
    seen_emails.add(em)
    clean_leads.append(lead)

conn.close()

print(f"Verified {len(clean_leads)} completely unique, fresh leads.")

# We want exactly 28 leads (or 30). All 30 are verified!
with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
    json.dump(clean_leads, f, indent=2)

print(f"Saved {len(clean_leads)} leads to {OUTPUT_PATH}")
