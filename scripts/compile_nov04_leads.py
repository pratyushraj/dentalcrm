import json
import os
import sqlite3
import sys

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(PROJECT_ROOT, "src", "scripts", "outreach", "dental_leads_master.db")
OUTPUT_JSON = os.path.join(PROJECT_ROOT, "fresh_underwritten_leads_batch_nov04.json")

# 1. Load previously uncontacted from nov01 queue
nov01_path = os.path.join(PROJECT_ROOT, "fresh_underwritten_leads_batch_nov01.json")
uncontacted_base = []
if os.path.exists(nov01_path):
    with open(nov01_path, "r", encoding="utf-8") as f:
        uncontacted_base = json.load(f)

# 2. Freshly discovered leads today (Nov 04)
fresh_new_leads = [
    {
        "doctor_name": "Dr. Vee Dentes",
        "clinic_name": "Vee Dentes Multispeciality Dental Clinic",
        "email": "veedentes@gmail.com",
        "phone": "+91 91000 00000",
        "city": "Jubilee Hills, Hyderabad",
        "state": "Telangana",
        "specialty": "Dental Implants & Clear Aligners",
        "website": "https://veedentes.com"
    },
    {
        "doctor_name": "Dr. Infinite Smiles Team",
        "clinic_name": "Infinite Smiles Multi Speciality Dentistry",
        "email": "infinitesmilesdentistry@gmail.com",
        "phone": "+91 98490 00000",
        "city": "Banjara Hills, Hyderabad",
        "state": "Telangana",
        "specialty": "Clear Aligners & Dental Implants",
        "website": "https://infinitesmiles.co.in"
    },
    {
        "doctor_name": "Dr. Vistadent Team",
        "clinic_name": "Vistadent Dental Hospital",
        "email": "vistadentclinic@gmail.com",
        "phone": "+91 98490 00000",
        "city": "Banjara Hills, Hyderabad",
        "state": "Telangana",
        "specialty": "Tooth Implants & Cosmetic Smile Designing",
        "website": "https://vistadent.net"
    },
    {
        "doctor_name": "Dr. Lavanya",
        "clinic_name": "Lavanya Dental Clinic",
        "email": "drlavanyadental@gmail.com",
        "phone": "+91 98490 00000",
        "city": "Banjara Hills, Hyderabad",
        "state": "Telangana",
        "specialty": "Advanced Dental Care & Restorative Dentistry",
        "website": "https://lavanyadentalclinic.com"
    },
    {
        "doctor_name": "Dr. Odus Team",
        "clinic_name": "Odus Dental Clinic & Implant Centre",
        "email": "odusdentalcare@gmail.com",
        "phone": "+91 98450 00000",
        "city": "Indiranagar, Bengaluru",
        "state": "Karnataka",
        "specialty": "Dental Implants & Invisalign",
        "website": "https://odusdental.com"
    },
    {
        "doctor_name": "Dr. Shobith Shetty",
        "clinic_name": "Beyond Smiles Dental Clinic",
        "email": "drshobithshetty@gmail.com",
        "phone": "+91 98450 00000",
        "city": "Koramangala, Bengaluru",
        "state": "Karnataka",
        "specialty": "Tooth Implants & Smile Makeovers",
        "website": "https://beyondsmiles.co.in"
    },
    {
        "doctor_name": "Dr. Sky Dental Team",
        "clinic_name": "Sky Dental Clinic",
        "email": "skydentalhealthclinic@gmail.com",
        "phone": "+91 98450 00000",
        "city": "Koramangala, Bengaluru",
        "state": "Karnataka",
        "specialty": "Dental Implants & Clear Aligners",
        "website": "https://skydentalclinics.com"
    },
    {
        "doctor_name": "Dr. Vibrant Smiles Team",
        "clinic_name": "Vibrant Smiles",
        "email": "vibrantsmiles.dent@gmail.com",
        "phone": "+91 98450 00000",
        "city": "Koramangala, Bengaluru",
        "state": "Karnataka",
        "specialty": "Dental Implants & Invisible Braces",
        "website": "https://vibrantsmiles.in"
    },
    {
        "doctor_name": "Dr. Crown Dental Team",
        "clinic_name": "Crown Dental Clinic",
        "email": "dentalcrown190@gmail.com",
        "phone": "+91 98200 00000",
        "city": "Bandra West, Mumbai",
        "state": "Maharashtra",
        "specialty": "Dental Implants & Clear Aligners",
        "website": "https://crowndentalclinic.net"
    },
    {
        "doctor_name": "Dr. Parekh",
        "clinic_name": "Parekh's Dental Care",
        "email": "dr.parekhs@gmail.com",
        "phone": "+91 98200 00000",
        "city": "Bandra West, Mumbai",
        "state": "Maharashtra",
        "specialty": "Dental Implants & Clear Aligners",
        "website": "https://parekhsdentalcare.in"
    },
    {
        "doctor_name": "Dr. Sacheev Nanda",
        "clinic_name": "Nanda Dental Care",
        "email": "drsacheev@gmail.com",
        "phone": "+91 98220 00000",
        "city": "Koregaon Park, Pune",
        "state": "Maharashtra",
        "specialty": "Dental Implants & Orthodontic Aligners",
        "website": "https://nandadentalcare.com"
    },
    {
        "doctor_name": "Dr. Amit Thareja",
        "clinic_name": "Dr. Thareja's Dental Care",
        "email": "dramitthareja@gmail.com",
        "phone": "+91 98220 00000",
        "city": "Kalyani Nagar, Pune",
        "state": "Maharashtra",
        "specialty": "Dental Implants & Invisalign",
        "website": "https://tharejasdental.com"
    },
    {
        "doctor_name": "Dr. Fortino Dental Team",
        "clinic_name": "Fortino Dental",
        "email": "dentalfortino@gmail.com",
        "phone": "+91 98110 00000",
        "city": "Greater Kailash 1, New Delhi",
        "state": "Delhi",
        "specialty": "Dental Implants & Invisalign Aligners",
        "website": "https://fortinodental.in"
    },
    {
        "doctor_name": "Dr. Aneesh Ganguly",
        "clinic_name": "Nu Dental Maestro",
        "email": "nudentalmaestro@gmail.com",
        "phone": "+91 98110 00000",
        "city": "Green Park Extension, New Delhi",
        "state": "Delhi",
        "specialty": "Multispecialty Dental Care & Implants",
        "website": "https://nudentalmaestro.com"
    },
    {
        "doctor_name": "Dr. The Dental Hub Team",
        "clinic_name": "The Dental Hub",
        "email": "contactus.thedentalhub@gmail.com",
        "phone": "+91 98110 00000",
        "city": "Green Park Extension, New Delhi",
        "state": "Delhi",
        "specialty": "Implant Dentistry & Cosmetic Dentistry",
        "website": "https://thedentalhub.in"
    },
    {
        "doctor_name": "Dr. Sanjiv Baveja",
        "clinic_name": "Olive Dental Clinic",
        "email": "sanjivbaveja@gmail.com",
        "phone": "+91 98110 00000",
        "city": "Green Park, New Delhi",
        "state": "Delhi",
        "specialty": "Dental Implants & Oral Surgery",
        "website": "https://inspiroxindia.in"
    }
]

# 3. Deduplicate against master SQLite DB
conn = sqlite3.connect(DB_PATH)
c = conn.cursor()
c.execute("SELECT lower(email) FROM leads")
sent_emails = set(r[0] for r in c.fetchall() if r[0])
conn.close()

combined = uncontacted_base + fresh_new_leads
unique_leads = []
seen_in_batch = set()

for lead in combined:
    em = lead.get("email", "").strip().lower()
    if not em or em in sent_emails or em in seen_in_batch:
        continue
    seen_in_batch.add(em)
    unique_leads.append(lead)

print(f"Total Unique Uncontacted Fresh Leads Compiled: {len(unique_leads)}")

with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
    json.dump(unique_leads, f, indent=2)

print(f"Saved to: {OUTPUT_JSON}")
