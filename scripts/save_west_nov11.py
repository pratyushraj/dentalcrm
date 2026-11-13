import json
import sqlite3
import os
import glob
import re

DB_PATH = "/Users/pratyushraj/Desktop/dental-crm/src/scripts/outreach/dental_leads_master.db"
OUTPUT_FILE = "/Users/pratyushraj/Desktop/dental-crm/scripts/fresh_leads_west_mumbai_pune_nov11.json"

LEADS = [
    {
        "doctor_name": "Dr. Tanayy Tamhankar",
        "clinic_name": "Ceramco Dental Care",
        "email": "ceramcoandheri@gmail.com",
        "phone": "+91 99209 23366",
        "city": "Andheri West, Mumbai",
        "state": "Maharashtra",
        "specialty": "Oral Implantology & Clear Aligners",
        "website": "https://ceramcodentalcare.com"
    },
    {
        "doctor_name": "Dr. Parampreet Kohli",
        "clinic_name": "Smile Couture Dental Clinic",
        "email": "inquiries@smilecouturedental.com",
        "phone": "+91 81040 54109",
        "city": "Andheri West, Mumbai",
        "state": "Maharashtra",
        "specialty": "Prosthodontics & Oral Implantology",
        "website": "https://smilecouturedental.com"
    },
    {
        "doctor_name": "Dr. Rohit Sharma",
        "clinic_name": "Dental Innovations",
        "email": "dentalinnovations@gmail.com",
        "phone": "+91 88791 00210",
        "city": "Khar West, Mumbai",
        "state": "Maharashtra",
        "specialty": "Implantology & Cosmetic Dentistry",
        "website": "https://dentalinnovations.in"
    },
    {
        "doctor_name": "Dr. Rinku Jain",
        "clinic_name": "BIOM Dental Clinic",
        "email": "biomclinic@gmail.com",
        "phone": "+91 99209 00448",
        "city": "Khar West, Mumbai",
        "state": "Maharashtra",
        "specialty": "Biomimetic Dentistry & Clear Aligners",
        "website": "https://biomdental.com"
    },
    {
        "doctor_name": "Dr. Kavita Bhat Kumar",
        "clinic_name": "Designer Smiles",
        "email": "info@designersmiles.in",
        "phone": "+91 98212 43274",
        "city": "Vile Parle East, Mumbai",
        "state": "Maharashtra",
        "specialty": "Aesthetic Dentistry & Dental Implants",
        "website": "https://designersmiles.in"
    },
    {
        "doctor_name": "Dr. Aditi Chhajed",
        "clinic_name": "Dr Aditi Chhajed Multispeciality Dental Clinic",
        "email": "aditichhajed12@gmail.com",
        "phone": "+91 90823 23346",
        "city": "Cumballa Hill, Mumbai",
        "state": "Maharashtra",
        "specialty": "Implantology, Veneers & Aligners",
        "website": "https://draditichhajed.com"
    },
    {
        "doctor_name": "Dr. Sumit Bohra",
        "clinic_name": "Braces and Dental Works",
        "email": "bracesanddentalworks@gmail.com",
        "phone": "+91 72899 94109",
        "city": "Prabhadevi, Mumbai",
        "state": "Maharashtra",
        "specialty": "Orthodontics, Clear Aligners & Implantology",
        "website": "https://bracesanddentalworks.co.in"
    },
    {
        "doctor_name": "Dr. Manisha Mehta",
        "clinic_name": "Smile Studio Dental Clinic",
        "email": "smilestudiodentalclinic07@gmail.com",
        "phone": "+91 96649 99039",
        "city": "Worli, Mumbai",
        "state": "Maharashtra",
        "specialty": "Cosmetic Dentistry & Dental Implants",
        "website": "https://smilestudio.co.in"
    },
    {
        "doctor_name": "Dr. Tushita Singh",
        "clinic_name": "Bombay Dental Company",
        "email": "bombaydentalcompany@gmail.com",
        "phone": "+91 88826 72980",
        "city": "Worli, Mumbai",
        "state": "Maharashtra",
        "specialty": "Clear Aligners & Cosmetic Dentistry",
        "website": "https://bombaydentalcompany.com"
    },
    {
        "doctor_name": "Dr. Vidhi Shah",
        "clinic_name": "Smileodontics Orthodontic & Aligner Clinic",
        "email": "drvidhibracesspecialist@gmail.com",
        "phone": "+91 98207 25002",
        "city": "Powai, Mumbai",
        "state": "Maharashtra",
        "specialty": "Orthodontics & Invisalign Clear Aligners",
        "website": "https://bracesdentistmumbai.com"
    },
    {
        "doctor_name": "Dr. Alisha Khan",
        "clinic_name": "Dr. Alisha's Evershine Dental & Cosmetic Clinic",
        "email": "khanalisha36@gmail.com",
        "phone": "+91 88507 13454",
        "city": "Chembur, Mumbai",
        "state": "Maharashtra",
        "specialty": "Cosmetic Dentistry & Dental Implants",
        "website": "https://evershineclinic.com"
    },
    {
        "doctor_name": "Dr. Rutuparn Sasane",
        "clinic_name": "Sasane Dental Clinic & Implant Center",
        "email": "sasanedentalclinic@gmail.com",
        "phone": "+91 90216 21337",
        "city": "Panvel, Navi Mumbai",
        "state": "Maharashtra",
        "specialty": "Prosthodontics & Oral Implantology",
        "website": "https://sasanedental.com"
    },
    {
        "doctor_name": "Dr. Shripal Oswal",
        "clinic_name": "S K Dental Care & Multi Specialty Dental Clinic",
        "email": "smile@droswaldental.com",
        "phone": "+91 97020 89949",
        "city": "Old Panvel, Navi Mumbai",
        "state": "Maharashtra",
        "specialty": "Dental Implants & Cosmetic Dentistry",
        "website": "https://droswaldental.com"
    },
    {
        "doctor_name": "Dr. Ajit Hindlekar",
        "clinic_name": "Dr. Ajit Hindlekar's Dental Clinic",
        "email": "dr.ajithindlekar@gmail.com",
        "phone": "+91 92265 67141",
        "city": "Balewadi, Pune",
        "state": "Maharashtra",
        "specialty": "Dental Implants & Clear Aligners",
        "website": "https://drajithindlekar.com"
    },
    {
        "doctor_name": "Dr. Priyank Mathur",
        "clinic_name": "Smilekraft Dentistry",
        "email": "drpriyank@smilekraftdentistry.com",
        "phone": "+91 84596 47556",
        "city": "Baner, Pune",
        "state": "Maharashtra",
        "specialty": "Full-Mouth Rehabilitation & Implantology",
        "website": "https://smilekraftdentistry.com"
    },
    {
        "doctor_name": "Dr. Shibli Syed",
        "clinic_name": "FDOC Dental & Orthodontic Centre",
        "email": "teamfdoc@gmail.com",
        "phone": "+91 98225 22560",
        "city": "Camp, Pune",
        "state": "Maharashtra",
        "specialty": "Orthodontics & Clear Aligners",
        "website": "https://drshiblisyed.com"
    },
    {
        "doctor_name": "Dr. Ketaki Jadav",
        "clinic_name": "DENTessa Dental Clinic",
        "email": "drketaki.jadav@gmail.com",
        "phone": "+91 95611 11878",
        "city": "Pimple Saudagar, Pune",
        "state": "Maharashtra",
        "specialty": "Aesthetic Dentistry & Dental Implants",
        "website": "https://drketakijadavdentist.com"
    },
    {
        "doctor_name": "Dr. Abhishek Darekar",
        "clinic_name": "Yashwant Dental Clinic & Implant Center",
        "email": "abhishekdarekar@ymail.com",
        "phone": "+91 99709 51075",
        "city": "Nashik",
        "state": "Maharashtra",
        "specialty": "Dental Implants & Restorative Dentistry",
        "website": "https://yashwantdentalclinic.com"
    },
    {
        "doctor_name": "Dr. Abhijeet Surana",
        "clinic_name": "One Sigma Dental Square",
        "email": "onesigmadentalsquare@gmail.com",
        "phone": "+91 77740 01166",
        "city": "Mhasrul, Nashik",
        "state": "Maharashtra",
        "specialty": "Basal & Conventional Dental Implants",
        "website": "https://onesigmadentalsquare.com"
    },
    {
        "doctor_name": "Dr. Mohit Bhangdia",
        "clinic_name": "Ziecon Advanced Dental Clinic and Research Centre",
        "email": "info@zieconclinic.in",
        "phone": "+91 86685 09539",
        "city": "Mahatma Nagar, Nashik",
        "state": "Maharashtra",
        "specialty": "Implant Dentistry & Full Mouth Rehabilitation",
        "website": "https://zieconclinic.in"
    },
    {
        "doctor_name": "Dr. Sailee Joshi",
        "clinic_name": "Dr. Sailee's Dental Clinic",
        "email": "dr.saileejoshi@gmail.com",
        "phone": "+91 77989 20624",
        "city": "Bajaj Nagar, Nagpur",
        "state": "Maharashtra",
        "specialty": "Smile Designing & Aesthetic Dentistry",
        "website": "https://drsaileesdentalclinic.com"
    },
    {
        "doctor_name": "Dr. Abhay Datarkar",
        "clinic_name": "Devanshi Dental Clinic",
        "email": "info@drdatarkar.com",
        "phone": "+91 94032 83607",
        "city": "Pratap Nagar, Nagpur",
        "state": "Maharashtra",
        "specialty": "Oral Implantology & Maxillofacial Surgery",
        "website": "https://drdatarkar.com"
    },
    {
        "doctor_name": "Dr. Rahul Vedpathak",
        "clinic_name": "Smile N Glamour Dental Clinic",
        "email": "smilenglamour@gmail.com",
        "phone": "+91 89835 51357",
        "city": "Manish Nagar, Nagpur",
        "state": "Maharashtra",
        "specialty": "Smile Makeover & Dental Implants",
        "website": "https://smilenglamour.com"
    },
    {
        "doctor_name": "Dr. Divya Trivedi",
        "clinic_name": "Orah - The Dental Clinic",
        "email": "dr.gumora@gmail.com",
        "phone": "+91 76664 35653",
        "city": "Laxmi Nagar, Nagpur",
        "state": "Maharashtra",
        "specialty": "Periodontics & Dental Implants",
        "website": "https://orah-thedentalclinic.com"
    },
    {
        "doctor_name": "Dr. Parth Bhingarde",
        "clinic_name": "ImplaDent Multispeciality Dental Clinic",
        "email": "parthbh1986@gmail.com",
        "phone": "+91 98901 84653",
        "city": "Nagala Park, Kolhapur",
        "state": "Maharashtra",
        "specialty": "Oral Implantology & Clear Aligners",
        "website": "https://idbf.in"
    },
    {
        "doctor_name": "Dr. Nilesh Deshmukh",
        "clinic_name": "My Teeth Facial & Dental Care",
        "email": "visit@myteethclinic.com",
        "phone": "+91 70576 14174",
        "city": "Chhatrapati Sambhajinagar",
        "state": "Maharashtra",
        "specialty": "Advanced Implantology & Maxillofacial Surgery",
        "website": "https://myteethclinic.com"
    },
    {
        "doctor_name": "Dr. Anand Madihalli",
        "clinic_name": "Sagar Dental and Implant Clinic",
        "email": "contact@sagardentalclinic.net",
        "phone": "+91 70831 70324",
        "city": "Panaji",
        "state": "Goa",
        "specialty": "Advanced Implant Surgery & Cosmetic Dentistry",
        "website": "https://sagardentalclinic.net"
    },
    {
        "doctor_name": "Dr. Priya de Sousa",
        "clinic_name": "The Dentist - Dental Care Clinic",
        "email": "drpriyarodrigues@gmail.com",
        "phone": "+91 99600 25441",
        "city": "Mapusa",
        "state": "Goa",
        "specialty": "Periodontics & Oral Implantology",
        "website": "https://thedentistgoa.com"
    },
    {
        "doctor_name": "Dr. Shrungi Nayak",
        "clinic_name": "Way2smile Multispeciality Dental Clinic",
        "email": "way2smilegoa@gmail.com",
        "phone": "+91 79728 45557",
        "city": "Margao",
        "state": "Goa",
        "specialty": "Restorative Dentistry, Implants & Clear Aligners",
        "website": "https://way2smilegoa.com"
    },
    {
        "doctor_name": "Dr. Anuradha Lokare",
        "clinic_name": "Lokare's Dental & Aesthetic Clinic",
        "email": "contact@lokares.com",
        "phone": "+91 96536 36748",
        "city": "Borivali West, Mumbai",
        "state": "Maharashtra",
        "specialty": "Aesthetic Dentistry, Aligners & Dental Implants",
        "website": "https://lokares.com"
    }
]

def validate_and_save():
    # 1. Load DB emails
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT lower(email) FROM leads")
    db_emails = set(r[0].strip().lower() for r in c.fetchall() if r[0])
    conn.close()

    # 2. Load all existing json files emails
    all_json_emails = set()
    for f in glob.glob("/Users/pratyushraj/Desktop/dental-crm/scripts/fresh_leads_*.json"):
        if "nov11" in f:
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
