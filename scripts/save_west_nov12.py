import json
import sqlite3
import os
import glob
import re

DB_PATH = "/Users/pratyushraj/Desktop/dental-crm/src/scripts/outreach/dental_leads_master.db"
OUTPUT_FILE = "/Users/pratyushraj/Desktop/dental-crm/scripts/fresh_leads_west_mumbai_pune_nov12.json"

LEADS = [
    {
        "doctor_name": "Dr. Rajesh Shetty",
        "clinic_name": "Dazzle Dental Clinic",
        "email": "contact@dazzle.dental",
        "phone": "+91 22 4149 8949",
        "city": "Bandra West, Mumbai",
        "state": "Maharashtra",
        "specialty": "Oral Implantology, Periodontics & Smile Makeover",
        "website": "https://dazzle.dental"
    },
    {
        "doctor_name": "Dr. Amruta Godbole",
        "clinic_name": "Toothfully Yours Dental Care",
        "email": "dramrutagodbole@gmail.com",
        "phone": "+91 97690 05504",
        "city": "Khar West, Mumbai",
        "state": "Maharashtra",
        "specialty": "Aesthetic Dentistry, Restorative Care & Dental Implants",
        "website": "https://toothfullyyoursdentalcare.com"
    },
    {
        "doctor_name": "Dr. Ekta Doctor",
        "clinic_name": "Doctor's Dental Clinic",
        "email": "ddc1972@gmail.com",
        "phone": "+91 98920 54029",
        "city": "Colaba, Mumbai",
        "state": "Maharashtra",
        "specialty": "Cosmetic Dentistry & Oral Implantology",
        "website": "https://doctorsdentalclinic.com"
    },
    {
        "doctor_name": "Dr. Uday B. Shetty",
        "clinic_name": "Perfect Smile Clinic",
        "email": "drudayshetty@yahoo.com",
        "phone": "+91 99698 88181",
        "city": "Dadar West, Mumbai",
        "state": "Maharashtra",
        "specialty": "Restorative Dentistry & Dental Implants",
        "website": "http://drshetty.com"
    },
    {
        "doctor_name": "Dr. Nikhil Ranjan",
        "clinic_name": "Urban Smiles Multispeciality Dental Clinic",
        "email": "urbansmilesdent@gmail.com",
        "phone": "+91 96998 92036",
        "city": "Lower Parel, Mumbai",
        "state": "Maharashtra",
        "specialty": "Advanced Dental Care & Oral Implantology",
        "website": "https://urbansmilesclinic.com"
    },
    {
        "doctor_name": "Dr. Roshni Singh",
        "clinic_name": "Aurum Aesthetic Dental Clinic",
        "email": "aurumdental331@gmail.com",
        "phone": "+91 83559 66463",
        "city": "Lower Parel, Mumbai",
        "state": "Maharashtra",
        "specialty": "Aesthetic Dentistry, Smile Design & Implants",
        "website": "https://roshnidental.in"
    },
    {
        "doctor_name": "Dr. Shonit Marfatia",
        "clinic_name": "Global Smiles Dental Clinic",
        "email": "globalsmiles7@gmail.com",
        "phone": "+91 98209 67386",
        "city": "Peddar Road, Mumbai",
        "state": "Maharashtra",
        "specialty": "Oral Implantology & Aesthetic Rehabilitation",
        "website": "https://globalsmiles.in"
    },
    {
        "doctor_name": "Dr. Pankaj Maheshwari",
        "clinic_name": "Dr. Pankaj Maheshwari Dental Clinic",
        "email": "drpankajmaheshwari@gmail.com",
        "phone": "+91 98211 08807",
        "city": "Andheri West, Mumbai",
        "state": "Maharashtra",
        "specialty": "Implantology & Full-Mouth Restorations",
        "website": "http://drpankajmaheshwari.com"
    },
    {
        "doctor_name": "Dr. Rajiv S. Khosla",
        "clinic_name": "Dr. Khosla's Dental Centre",
        "email": "drkhosla@gmail.com",
        "phone": "+91 98193 63215",
        "city": "Andheri West, Mumbai",
        "state": "Maharashtra",
        "specialty": "Cosmetic Dentistry & Dental Implants",
        "website": "http://drkhosla.com"
    },
    {
        "doctor_name": "Dr. Saurabh Kadali",
        "clinic_name": "Kadali Dental Care",
        "email": "info@kadalidental.com",
        "phone": "+91 98192 01882",
        "city": "Andheri West, Mumbai",
        "state": "Maharashtra",
        "specialty": "Implantology, Full-Mouth Rehab & Aligners",
        "website": "https://kadalidental.com"
    },
    {
        "doctor_name": "Dr. Roopali Chaturvedi",
        "clinic_name": "Aura Dental Care",
        "email": "dr.roopalisharma@gmail.com",
        "phone": "+91 90968 22955",
        "city": "Andheri West, Mumbai",
        "state": "Maharashtra",
        "specialty": "Cosmetic Dentistry & Dental Implants",
        "website": "https://auradentalcaremumbai.com"
    },
    {
        "doctor_name": "Dr. Shrikant Karbelkar",
        "clinic_name": "Karbelkar's Dental Clinic",
        "email": "karbelkarsdentalclinic@gmail.com",
        "phone": "+91 93215 87571",
        "city": "Goregaon West, Mumbai",
        "state": "Maharashtra",
        "specialty": "Prosthodontics & Oral Implantology",
        "website": "https://karbelkarsdentalclinic.com"
    },
    {
        "doctor_name": "Dr. Shalakha Kothari",
        "clinic_name": "Dentaura Dental Clinic",
        "email": "dentauradentalhealth@gmail.com",
        "phone": "+91 90044 53606",
        "city": "Malad West, Mumbai",
        "state": "Maharashtra",
        "specialty": "Full Mouth Rehabilitation & Dental Implants",
        "website": "https://thedentaura.com"
    },
    {
        "doctor_name": "Dr. Amit Kumar",
        "clinic_name": "InterDental Multispeciality Dental Clinic",
        "email": "dramitkumar05@gmail.com",
        "phone": "+91 77180 62800",
        "city": "Kandivali West, Mumbai",
        "state": "Maharashtra",
        "specialty": "Implants, Smile Designing & Orthodontics",
        "website": "https://interdental.in"
    },
    {
        "doctor_name": "Dr. Sneh Mehta",
        "clinic_name": "Gums and Braces Dental Clinic",
        "email": "gnbenquiries@gmail.com",
        "phone": "+91 77770 30618",
        "city": "Ghatkopar East, Mumbai",
        "state": "Maharashtra",
        "specialty": "Orthodontics & Clear Aligners",
        "website": "https://gumsandbraces.com"
    },
    {
        "doctor_name": "Dr. Viral Gada",
        "clinic_name": "Viral's Dental Avenue",
        "email": "gadaviral44@gmail.com",
        "phone": "+91 77198 62020",
        "city": "Mulund West, Mumbai",
        "state": "Maharashtra",
        "specialty": "Prosthodontics, Dental Implants & Cosmetic Dentistry",
        "website": "https://viralsdental.com"
    },
    {
        "doctor_name": "Dr. Shruti Shanbhag",
        "clinic_name": "Toothworks Dental Clinic",
        "email": "toothworksindia@gmail.com",
        "phone": "+91 99202 82234",
        "city": "Mahim West, Mumbai",
        "state": "Maharashtra",
        "specialty": "Prosthodontics, Implantology & Total Oral Rehabilitation",
        "website": "https://toothworksindia.com"
    },
    {
        "doctor_name": "Dr. Angaj Malandkar",
        "clinic_name": "EndoBrace Dental Clinic",
        "email": "endobrace.dental@gmail.com",
        "phone": "+91 90821 43885",
        "city": "Shivaji Park, Dadar West, Mumbai",
        "state": "Maharashtra",
        "specialty": "Orthodontics, Clear Aligners & Endodontics",
        "website": "https://endobrace.in"
    },
    {
        "doctor_name": "Dr. Sagar Meswani",
        "clinic_name": "Meswani Dental Clinic",
        "email": "info@meswanidentalclinics.com",
        "phone": "+91 89284 70206",
        "city": "Santacruz West, Mumbai",
        "state": "Maharashtra",
        "specialty": "Oral & Maxillofacial Surgery and Dental Implants",
        "website": "https://meswanidentalclinics.com"
    },
    {
        "doctor_name": "Dr. Ritika Arora",
        "clinic_name": "Aesthetic Smiles India",
        "email": "contact@aestheticsmilesindia.com",
        "phone": "+91 96199 55929",
        "city": "Santacruz West, Mumbai",
        "state": "Maharashtra",
        "specialty": "Periodontics, Oral Implantology & Facial Aesthetics",
        "website": "https://aestheticsmilesindia.com"
    },
    {
        "doctor_name": "Dr. Shuddhodhan Gaikwad",
        "clinic_name": "LOMA Dental",
        "email": "contact@lomadental.in",
        "phone": "+91 72086 39972",
        "city": "Vashi, Navi Mumbai",
        "state": "Maharashtra",
        "specialty": "Implants & Full Mouth Rehabilitation",
        "website": "https://lomadental.in"
    },
    {
        "doctor_name": "Dr. Vinothini Kannan",
        "clinic_name": "Smilekraft Dental Clinic",
        "email": "smilekraftclinic@gmail.com",
        "phone": "+91 98699 12382",
        "city": "Nerul, Navi Mumbai",
        "state": "Maharashtra",
        "specialty": "Aesthetic Dentistry, Smile Design & Implants",
        "website": "https://smilekraftclinic.com"
    },
    {
        "doctor_name": "Dr. Mugdha Bichile Pimplapure",
        "clinic_name": "EndoCare Dental Clinic",
        "email": "drmugdha@endo-care.in",
        "phone": "+91 90968 82602",
        "city": "Viman Nagar, Pune",
        "state": "Maharashtra",
        "specialty": "Microscopic Endodontics & Dental Implants",
        "website": "https://endo-care.in"
    },
    {
        "doctor_name": "Dr. Viddesh Patil",
        "clinic_name": "Dr. Viddesh Patil's Dental & Implant Clinic",
        "email": "viddeshpatil@gmail.com",
        "phone": "+91 77093 49580",
        "city": "Aundh, Pune",
        "state": "Maharashtra",
        "specialty": "Prosthodontics, Dental Implants & Smile Design",
        "website": "https://drviddeshpatil.com"
    },
    {
        "doctor_name": "Dr. Nupur",
        "clinic_name": "Dentique Dental Clinic",
        "email": "dentique.smiles@gmail.com",
        "phone": "+91 79039 45606",
        "city": "Wakad, Pune",
        "state": "Maharashtra",
        "specialty": "Smile Design, Cosmetic Dentistry & Dental Implants",
        "website": "https://dentique.co.in"
    },
    {
        "doctor_name": "Dr. Nilesh Raisoni",
        "clinic_name": "Raisoni Multispeciality Dental Center",
        "email": "drnileshraisoni@gmail.com",
        "phone": "+91 97661 22287",
        "city": "Mico Circle, Nashik",
        "state": "Maharashtra",
        "specialty": "Dental Implants, Orthodontics & Cosmetic Dentistry",
        "website": "https://raisoniclinic.com"
    },
    {
        "doctor_name": "Dr. Nikshi Kamble",
        "clinic_name": "Dr. Nikshi's Orthodontic Centre & Dental Implant Clinic",
        "email": "drnikshiorthodontic@gmail.com",
        "phone": "+91 86688 62556",
        "city": "Khamla, Nagpur",
        "state": "Maharashtra",
        "specialty": "Orthodontics, Clear Aligners & Dental Implants",
        "website": "https://drnikshisorthodonticcentreanddentalimplantclinicnagpur.com"
    },
    {
        "doctor_name": "Dr. Pramod Dhavalshankh",
        "clinic_name": "Aditya Dental & Implant Clinic",
        "email": "dr.pramoddhavalshankh@gmail.com",
        "phone": "+91 98905 33015",
        "city": "Tarabai Park, Kolhapur",
        "state": "Maharashtra",
        "specialty": "Dental Implants, Aesthetic Dentistry & Endodontics",
        "website": "http://adityadentalclinic.com"
    },
    {
        "doctor_name": "Dr. Ajay Kadam",
        "clinic_name": "Kadam Dental Care",
        "email": "kadamdentalcare2007@gmail.com",
        "phone": "+91 72491 28454",
        "city": "Kapiltirth Market, Kolhapur",
        "state": "Maharashtra",
        "specialty": "Endodontics, Dental Implants & Restorative Dentistry",
        "website": "https://kadamdentalcare.com"
    },
    {
        "doctor_name": "Dr. W. A. Khan",
        "clinic_name": "Easy Dental Clinic",
        "email": "easydentalclinic@gmail.com",
        "phone": "+91 72764 27575",
        "city": "Chhatrapati Sambhajinagar",
        "state": "Maharashtra",
        "specialty": "Restorative Dentistry & Dental Implants",
        "website": "https://easydentalclinic.net"
    }
]

def validate_and_save():
    # 1. Load DB emails
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT lower(email) FROM leads")
    db_emails = set(r[0].strip().lower() for r in c.fetchall() if r[0])
    conn.close()

    # 2. Load all existing json files emails (excluding nov12 itself)
    all_json_emails = set()
    for f in glob.glob("/Users/pratyushraj/Desktop/dental-crm/scripts/fresh_leads_*.json"):
        if "nov12" in f:
            continue
        try:
            with open(f, "r", encoding="utf-8") as fp:
                data = json.load(fp)
                for item in data:
                    em = item.get("email", "").strip().lower()
                    if em:
                        all_json_emails.add(em)
        except Exception:
            pass

    seen_in_batch = set()
    validated_leads = []

    required_fields = ["doctor_name", "clinic_name", "email", "phone", "city", "state", "specialty", "website"]

    for idx, lead in enumerate(LEADS):
        # Check required fields
        for field in required_fields:
            if not lead.get(field):
                raise ValueError(f"Lead {idx} ({lead.get('clinic_name')}) is missing required field: {field}")

        em = lead["email"].strip().lower()
        if "@" not in em:
            raise ValueError(f"Invalid email: {em}")

        if em in db_emails:
            raise ValueError(f"DUPLICATE DETECTED IN MASTER DB: {em} ({lead['clinic_name']})")

        if em in all_json_emails:
            raise ValueError(f"DUPLICATE DETECTED IN PRIOR JSON BATCH: {em} ({lead['clinic_name']})")

        if em in seen_in_batch:
            raise ValueError(f"DUPLICATE IN CURRENT BATCH: {em}")

        seen_in_batch.add(em)
        validated_leads.append(lead)

    print(f"Total leads validated: {len(validated_leads)}")
    assert 25 <= len(validated_leads) <= 30, f"Expected 25-30 leads, got {len(validated_leads)}"

    with open(OUTPUT_FILE, "w", encoding="utf-8") as fp:
        json.dump(validated_leads, fp, indent=2, ensure_ascii=False)

    print(f"Successfully saved {len(validated_leads)} leads to {OUTPUT_FILE}")

if __name__ == "__main__":
    validate_and_save()
