import json
import os
import sqlite3
import re

OUTPUT_FILE = "/Users/pratyushraj/Desktop/dental-crm/scripts/fresh_leads_south_nov09.json"
DB_PATH = "/Users/pratyushraj/Desktop/dental-crm/src/scripts/outreach/dental_leads_master.db"

leads = [
  {
    "doctor_name": "Dr. Asif Shaik",
    "clinic_name": "Alux Dental",
    "email": "info@aluxdental.com",
    "phone": "+91 76761 11999",
    "city": "Hyderabad",
    "state": "Telangana",
    "specialty": "Implantology & Cosmetic Dental Surgery",
    "website": "https://aluxdental.com"
  },
  {
    "doctor_name": "Dr. Sreedhar Reddy",
    "clinic_name": "Esthetix Dental Hospital",
    "email": "info@esthetixdental.in",
    "phone": "+91 83414 97999",
    "city": "Hyderabad",
    "state": "Telangana",
    "specialty": "Implant Dentistry & Cosmetic Dental Surgery",
    "website": "https://esthetixdental.in"
  },
  {
    "doctor_name": "Dr. Haritha Mikkilineni",
    "clinic_name": "VK Dental Implant Centre",
    "email": "vkdentalimplantcentre@gmail.com",
    "phone": "+91 80193 49075",
    "city": "Hyderabad",
    "state": "Telangana",
    "specialty": "Prosthodontics & Oral Implantology",
    "website": "https://vkdentalcentre.com"
  },
  {
    "doctor_name": "Dr. Ram Mohan",
    "clinic_name": "V R Dental Maxillofacial Surgery & Implant Center",
    "email": "vrdentalandimplantclinic@gmail.com",
    "phone": "+91 77804 75090",
    "city": "Hyderabad",
    "state": "Telangana",
    "specialty": "Oral & Maxillofacial Surgery and Dental Implants",
    "website": "https://vrdental.co.in"
  },
  {
    "doctor_name": "Dr. E. Santhosh Kumar",
    "clinic_name": "Eledent Dental Hospital",
    "email": "contact@eledenthospitals.com",
    "phone": "+91 77996 19994",
    "city": "Hyderabad",
    "state": "Telangana",
    "specialty": "Oral & Maxillofacial Surgery, Implants & Clear Aligners",
    "website": "https://eledenthospitals.com"
  },
  {
    "doctor_name": "Dr. R.S. Mohan Kumar",
    "clinic_name": "Yours Dentally",
    "email": "yddentalclinic@gmail.com",
    "phone": "+91 44 2433 5003",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "specialty": "Implantology & Cosmetic Dentistry",
    "website": "https://www.yoursdentally.com"
  },
  {
    "doctor_name": "Dr. Muralidharan Balaji",
    "clinic_name": "M & M Advanced Dentistry",
    "email": "mandmdentistry24@gmail.com",
    "phone": "+91 98408 56606",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "specialty": "Prosthodontics, Dental Implants & Clear Aligners",
    "website": "https://www.mandmdentistry.in"
  },
  {
    "doctor_name": "Dr. B. J. Barun",
    "clinic_name": "Dr. Barun's Dental Centre",
    "email": "care@barunsdental.com",
    "phone": "+91 78100 06070",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "specialty": "Dental Implants, Clear Aligners & Cosmetic Dentistry",
    "website": "https://www.barunsdental.com"
  },
  {
    "doctor_name": "Dr. Subramoniam S.",
    "clinic_name": "Lakshmi Dental Care and Implant Center",
    "email": "drsubramoniam@yahoo.com",
    "phone": "+91 98405 41581",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "specialty": "Periodontics & Oral Implantology",
    "website": "http://lakshmidentalcare.in"
  },
  {
    "doctor_name": "Dr. C. Murugavel",
    "clinic_name": "Chinthamani Laser Dental Clinic & Implant Centre",
    "email": "chinthamanidental@gmail.com",
    "phone": "+91 96000 30601",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "specialty": "Oral & Maxillofacial Surgery and Basal Implantology",
    "website": "https://chinthamanilaserdentalclinic.com"
  },
  {
    "doctor_name": "Dr. Rijesh Krishnan",
    "clinic_name": "Say Cheese! Advanced Oral Care",
    "email": "contact@saycheesedentalcare.com",
    "phone": "+91 63821 80220",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "specialty": "Prosthodontics, Implantology & Clear Aligners",
    "website": "https://www.saycheesedentalcare.com"
  },
  {
    "doctor_name": "Dr. Daya Raveendran",
    "clinic_name": "Sara Dental Care",
    "email": "saradentalcare@gmail.com",
    "phone": "+91 87545 75404",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "specialty": "Implantology, Orthodontics & Cosmetic Dentistry",
    "website": "https://www.saradentalcare.com"
  },
  {
    "doctor_name": "Dr. J. E. Nijesh",
    "clinic_name": "Dent Temple",
    "email": "denttemple@gmail.com",
    "phone": "+91 98845 78885",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "specialty": "Dental Implants, Clear Aligners & Cosmetic Dentistry",
    "website": "https://denttemple.in"
  },
  {
    "doctor_name": "Dr. S. Vasanth",
    "clinic_name": "Dr. Vasanth's Dental Clinic",
    "email": "drvasanthdentalclinic@gmail.com",
    "phone": "+91 44 2474 3512",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "specialty": "Dental Implants, Invisalign & Orthodontics",
    "website": "https://www.vasanthdental.com"
  },
  {
    "doctor_name": "Dr. Sangeeta Honnur",
    "clinic_name": "Smile Elements Dental",
    "email": "smileelementsdentalcenter@gmail.com",
    "phone": "+91 80 4099 3615",
    "city": "Bengaluru",
    "state": "Karnataka",
    "specialty": "Cosmetic Dentistry & Oral Implantology",
    "website": "https://smileelementsdental.com"
  },
  {
    "doctor_name": "Dr. Nandini Nelivigi",
    "clinic_name": "Nelivigi Dental Clinic",
    "email": "nelivigidentalclinic@gmail.com",
    "phone": "+91 81238 03803",
    "city": "Bengaluru",
    "state": "Karnataka",
    "specialty": "Prosthodontics, Dental Implants & Cosmetic Dentistry",
    "website": "https://nelivigidentalclinic.com"
  },
  {
    "doctor_name": "Dr. G.S. Suman Reddy",
    "clinic_name": "SR Dental Zone",
    "email": "contact@srdentalzone.com",
    "phone": "+91 80508 08811",
    "city": "Bengaluru",
    "state": "Karnataka",
    "specialty": "Oral Implantology & Digital Orthodontics",
    "website": "https://www.srdentalzone.com"
  },
  {
    "doctor_name": "Dr. Trupti Gulashetti",
    "clinic_name": "TruSmile Dental & Orthodontics",
    "email": "trusmiledentalorthodontics@gmail.com",
    "phone": "+91 93807 86401",
    "city": "Bengaluru",
    "state": "Karnataka",
    "specialty": "Orthodontics, Clear Aligners & Dental Implants",
    "website": "https://trusmiledental.co.in"
  },
  {
    "doctor_name": "Dr. Shalini A. S.",
    "clinic_name": "Dental Tribe",
    "email": "connect@dentaltribe.in",
    "phone": "+91 98883 33724",
    "city": "Bengaluru",
    "state": "Karnataka",
    "specialty": "Oral Implantology, Cosmetic Dentistry & Orthodontics",
    "website": "https://dentaltribe.in"
  },
  {
    "doctor_name": "Dr. Yokesh V. R.",
    "clinic_name": "Smile Dental Clinic Dollars Colony",
    "email": "yokeshvratnam@gmail.com",
    "phone": "+91 95131 51235",
    "city": "Bengaluru",
    "state": "Karnataka",
    "specialty": "Cosmetic Dentistry & Oral Implantology",
    "website": "http://smilebangalore.com"
  },
  {
    "doctor_name": "Dr. R. Saraaj Bhuvan",
    "clinic_name": "Vihana Dental Care",
    "email": "sanchunags@gmail.com",
    "phone": "+91 98943 17823",
    "city": "Coimbatore",
    "state": "Tamil Nadu",
    "specialty": "Periodontics & Oral Implantology",
    "website": "https://vihanadental.in"
  },
  {
    "doctor_name": "Dr. M. Praveen",
    "clinic_name": "Infinity Dental & Root Canal Centre",
    "email": "infinitydental.rootcanalcentre@gmail.com",
    "phone": "+91 84387 87884",
    "city": "Coimbatore",
    "state": "Tamil Nadu",
    "specialty": "Restorative Dentistry, Endodontics & Dental Implants",
    "website": "http://www.infinitydentalandrootcanalcentre.com"
  },
  {
    "doctor_name": "Dr. Rachel Thomas",
    "clinic_name": "Simply Dental",
    "email": "simplydentalkochi@gmail.com",
    "phone": "+91 99617 02999",
    "city": "Kochi",
    "state": "Kerala",
    "specialty": "Invisalign Clear Aligners & Dental Implants",
    "website": "https://simplydentalkochi.com"
  },
  {
    "doctor_name": "Dr. Sachin Johnson",
    "clinic_name": "Dr. Sachin's Dental Speciality Centre",
    "email": "info@drsachinsdentalclinic.com",
    "phone": "+91 88915 20227",
    "city": "Kochi",
    "state": "Kerala",
    "specialty": "Periodontics, Dental Implants & Smile Design",
    "website": "https://drsachinsdentalclinic.com"
  },
  {
    "doctor_name": "Dr. Abhilash V. Jacob",
    "clinic_name": "Dr. Jacob's Omega Dental Clinic & Implant Centre",
    "email": "drjacobsdental@gmail.com",
    "phone": "+91 98460 53333",
    "city": "Trivandrum",
    "state": "Kerala",
    "specialty": "Periodontics, Implantology & Cosmetic Dentistry",
    "website": "https://www.omegadentalclinic.com"
  },
  {
    "doctor_name": "Dr. Kashi Vishwanath",
    "clinic_name": "Dr. Kashi's Ashwathi Super Speciality Dental Clinic",
    "email": "info@my-dentist.org",
    "phone": "+91 96452 29797",
    "city": "Trivandrum",
    "state": "Kerala",
    "specialty": "Dental Implants, Orthodontics & Clear Aligners",
    "website": "http://www.my-dentist.org"
  },
  {
    "doctor_name": "Dr. Roopali Shetty",
    "clinic_name": "Mangalore Implant Centre",
    "email": "contact@mangaloreimplantcentre.com",
    "phone": "+91 98456 91849",
    "city": "Mangalore",
    "state": "Karnataka",
    "specialty": "Orthodontics & Master of Oral Implantology",
    "website": "http://mangaloreimplantcentre.com"
  },
  {
    "doctor_name": "Dr. Bharath Kumar Garla",
    "clinic_name": "Smile Dental Care Mysuru",
    "email": "drbharathgarla@gmail.com",
    "phone": "+91 98451 62272",
    "city": "Mysore",
    "state": "Karnataka",
    "specialty": "Invisalign Clear Aligners, Periodontics & Dental Implants",
    "website": "https://smiledentalcaremysuru.com"
  },
  {
    "doctor_name": "Dr. Mallika Kalepu",
    "clinic_name": "MK Dental & Orthodontics",
    "email": "info@mkdentalclinics.com",
    "phone": "+91 91827 96770",
    "city": "Visakhapatnam",
    "state": "Andhra Pradesh",
    "specialty": "Orthodontics, Clear Aligners & Dental Implants",
    "website": "https://mkdentalclinics.com"
  },
  {
    "doctor_name": "Dr. Vardhini B.",
    "clinic_name": "Dr. Teeth Dental Clinic",
    "email": "info@thedrteeth.com",
    "phone": "+91 79975 99222",
    "city": "Visakhapatnam",
    "state": "Andhra Pradesh",
    "specialty": "Conservative Dentistry, Endodontics & Teeth Aligners",
    "website": "https://www.thedrteeth.com"
  }
]

# Validation
conn = sqlite3.connect(DB_PATH)
c = conn.cursor()
c.execute("SELECT lower(email) FROM leads WHERE email IS NOT NULL")
db_emails = set(r[0].strip() for r in c.fetchall() if r[0])
conn.close()

assert len(leads) == 30, f"Expected 30 leads, got {len(leads)}"

for i, l in enumerate(leads):
    assert "@" in l["email"] and "." in l["email"].split("@")[-1], f"Invalid email: {l['email']}"
    assert l["email"].lower() not in db_emails, f"Duplicate email in DB: {l['email']}"
    assert l["phone"], f"Missing phone in lead {i}"
    assert l["doctor_name"], f"Missing doctor_name in lead {i}"
    assert l["clinic_name"], f"Missing clinic_name in lead {i}"
    assert l["city"], f"Missing city in lead {i}"
    assert l["state"], f"Missing state in lead {i}"
    assert l["specialty"], f"Missing specialty in lead {i}"
    assert l["website"], f"Missing website in lead {i}"

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(leads, f, indent=2)

print(f"Successfully validated and saved {len(leads)} leads to {OUTPUT_FILE}")
