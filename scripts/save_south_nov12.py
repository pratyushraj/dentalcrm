import json
import sqlite3
import re
import os
import glob

OUTPUT_FILE = "/Users/pratyushraj/Desktop/dental-crm/scripts/fresh_leads_south_nov12.json"
DB_PATH = "/Users/pratyushraj/Desktop/dental-crm/src/scripts/outreach/dental_leads_master.db"

leads = [
    {
        "doctor_name": "Dr. P. Sheshadri",
        "clinic_name": "Srinivasa Dental Clinic & Implant Centre",
        "email": "sheshadripp@gmail.com",
        "phone": "+91 821 2546136",
        "city": "Mysore",
        "state": "Karnataka",
        "specialty": "Periodontics & Dental Implantology",
        "website": "http://srinivasadentalclinic.com"
    },
    {
        "doctor_name": "Dr. Masoom Ahmed",
        "clinic_name": "Masoom Dental Clinic",
        "email": "appointments@masoomdentalclinic.com",
        "phone": "+91 74114 15566",
        "city": "Mangalore",
        "state": "Karnataka",
        "specialty": "Oral Implantology & Clear Aligners",
        "website": "http://masoomdentalclinic.com"
    },
    {
        "doctor_name": "Dr. Srinivas Manohar",
        "clinic_name": "Manohar Dental Care",
        "email": "manohardentalvisakhapatnam@gmail.com",
        "phone": "+91 97032 94358",
        "city": "Visakhapatnam",
        "state": "Andhra Pradesh",
        "specialty": "Dental Implants & Aesthetic Dentistry",
        "website": "http://manohardentalvisakhapatnam.com"
    },
    {
        "doctor_name": "Dr. Surendra Nath Edara",
        "clinic_name": "YOUR DENTIST - Advanced Dental and Maxillofacial Centre",
        "email": "info@yourdentists.in",
        "phone": "+91 92933 98888",
        "city": "Vijayawada",
        "state": "Andhra Pradesh",
        "specialty": "Full Mouth Dental Implants & Maxillofacial Surgery",
        "website": "http://yourdentistimplants.com"
    },
    {
        "doctor_name": "Dr. Anirudh Maadhav",
        "clinic_name": "Kumars Dental Clinic",
        "email": "kumarsdental1@gmail.com",
        "phone": "+91 93539 23627",
        "city": "Trivandrum",
        "state": "Kerala",
        "specialty": "Invisalign Clear Aligners & Dental Implants",
        "website": "http://kumarsdentalclinic.com"
    },
    {
        "doctor_name": "Dr. Shaheed Ali",
        "clinic_name": "Amend Dental Centre",
        "email": "info@amenddental.in",
        "phone": "+91 88482 82800",
        "city": "Kozhikode",
        "state": "Kerala",
        "specialty": "Oral Implantology & Aesthetic Dentistry",
        "website": "http://amenddental.in"
    },
    {
        "doctor_name": "Dr. Athulya KP",
        "clinic_name": "Smile Align Clinic",
        "email": "hello@smilealignclinic.com",
        "phone": "+91 83010 30261",
        "city": "Kozhikode",
        "state": "Kerala",
        "specialty": "Clear Aligners & Orthodontics",
        "website": "https://smilealignclinic.com"
    },
    {
        "doctor_name": "Dr. G. Sivakumar",
        "clinic_name": "Wisdom Dental Care",
        "email": "shivadr1@rediffmail.com",
        "phone": "+91 94879 84977",
        "city": "Trichy",
        "state": "Tamil Nadu",
        "specialty": "Oral & Maxillofacial Surgery and Dental Implants",
        "website": "http://wisdomdentalcare.co.in"
    },
    {
        "doctor_name": "Dr. Sivanesan",
        "clinic_name": "Agaram Dental Clinic",
        "email": "agaramdental@yahoo.com",
        "phone": "+91 93448 55157",
        "city": "Madurai",
        "state": "Tamil Nadu",
        "specialty": "Implantology & Clear Aligners",
        "website": "http://dentalclinicmadurai.com"
    },
    {
        "doctor_name": "Dr. K. Rajashekar",
        "clinic_name": "True Smile Centre for Orthodontics",
        "email": "shekar967@yahoo.com",
        "phone": "+91 98440 29167",
        "city": "Bengaluru",
        "state": "Karnataka",
        "specialty": "Invisalign Clear Aligners & Orthodontics",
        "website": "http://truesmileorthodontist.in"
    },
    {
        "doctor_name": "Dr. Gunaseelan Rajan",
        "clinic_name": "Rajan Dental Clinic",
        "email": "smile@rajandental.com",
        "phone": "+91 97890 01100",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "specialty": "Oral & Maxillofacial Surgery and Dental Implants",
        "website": "http://rajandental.com"
    },
    {
        "doctor_name": "Dr. K. Kowsalya",
        "clinic_name": "Glowora Dental & Aesthetics Clinic",
        "email": "drkowsalyamohan@gmail.com",
        "phone": "+91 77080 91434",
        "city": "Coimbatore",
        "state": "Tamil Nadu",
        "specialty": "Preventive Orthodontics, Clear Aligners & Implants",
        "website": "http://gloworadental.com"
    },
    {
        "doctor_name": "Dr. Deesha Rajendran",
        "clinic_name": "Invisalign Smile Centre",
        "email": "smilecentrebangalore@gmail.com",
        "phone": "+91 63629 84585",
        "city": "Bengaluru",
        "state": "Karnataka",
        "specialty": "Invisalign Clear Aligners & Aesthetic Dentistry",
        "website": "http://invisalignsmilecentre.com"
    },
    {
        "doctor_name": "Dr. Sandhya Rachuri",
        "clinic_name": "The Smile Designerz",
        "email": "thesmiledesignerz@gmail.com",
        "phone": "+91 91486 31662",
        "city": "Bengaluru",
        "state": "Karnataka",
        "specialty": "Dental Implants & Smile Designing",
        "website": "http://thesmiledesignerz.com"
    },
    {
        "doctor_name": "Dr. S. Jabeen",
        "clinic_name": "Tooth Vibes Family Dental",
        "email": "contact.toothvibes@gmail.com",
        "phone": "+91 96320 07056",
        "city": "Bengaluru",
        "state": "Karnataka",
        "specialty": "Clear Aligners & Restorative Dentistry",
        "website": "http://toothvibes.in"
    },
    {
        "doctor_name": "Dr. Nithin Shetty",
        "clinic_name": "Srisha Dental Care",
        "email": "srishadentalcare@gmail.com",
        "phone": "+91 93412 76315",
        "city": "Bengaluru",
        "state": "Karnataka",
        "specialty": "Dental Implants & Clear Aligners",
        "website": "http://srishadentalcare.com"
    },
    {
        "doctor_name": "Dr. Sanjog Agarwal",
        "clinic_name": "Implant Square",
        "email": "care@implantsquare.com",
        "phone": "+91 90353 63033",
        "city": "Bengaluru",
        "state": "Karnataka",
        "specialty": "Oral Implantology & Surgical Dentistry",
        "website": "http://implantsquare.com"
    },
    {
        "doctor_name": "Dr. Priya Vijay Mahimtura",
        "clinic_name": "The Dentist Dental Care",
        "email": "clinic2thedentist@gmail.com",
        "phone": "+91 99726 26100",
        "city": "Bengaluru",
        "state": "Karnataka",
        "specialty": "Dental Implants & Invisible Clear Aligners",
        "website": "http://thedentistbangalore.in"
    },
    {
        "doctor_name": "Dr. Rajasekaran",
        "clinic_name": "Mr. Dentist Maxillofacial Implant & Cosmetic Clinic",
        "email": "mrdentist.oralcare@gmail.com",
        "phone": "+91 99624 27460",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "specialty": "Maxillofacial Surgery, Dental Implants & Aligners",
        "website": "http://mrdentist.in"
    },
    {
        "doctor_name": "Dr. Ramkumar Ravichandran",
        "clinic_name": "Odent Dental Care",
        "email": "contact@odentdentalcare.com",
        "phone": "+91 63813 76835",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "specialty": "Implantology, Clear Aligners & Aesthetic Dentistry",
        "website": "http://odentdentalcare.com"
    },
    {
        "doctor_name": "Dr. Gins Paul",
        "clinic_name": "Dental Designs Family Dental Centre",
        "email": "drgins@gmail.com",
        "phone": "+91 471 272 0740",
        "city": "Trivandrum",
        "state": "Kerala",
        "specialty": "Dental Implants & Clear Aligners",
        "website": "http://dentaldesigns.in"
    },
    {
        "doctor_name": "Dr. Antony Kurian Vallamattam",
        "clinic_name": "Vallamattam Dental & Orthodontic Clinic",
        "email": "vallamattamorthodontics@gmail.com",
        "phone": "+91 92077 31392",
        "city": "Kochi",
        "state": "Kerala",
        "specialty": "Clear Aligners & Orthodontics",
        "website": "http://vallamattamdental.com"
    },
    {
        "doctor_name": "Dr. I. Kaushal",
        "clinic_name": "Kaushal's Dental Care",
        "email": "contact@kaushalsdental.com",
        "phone": "+91 82979 58555",
        "city": "Visakhapatnam",
        "state": "Andhra Pradesh",
        "specialty": "Oral & Maxillofacial Surgery and Dental Implants",
        "website": "http://kaushalsdentalcare.in"
    },
    {
        "doctor_name": "Dr. Swetha Thota",
        "clinic_name": "Swetha Dental Clinic",
        "email": "dr.swethaditya@gmail.com",
        "phone": "+91 72074 43233",
        "city": "Visakhapatnam",
        "state": "Andhra Pradesh",
        "specialty": "Aesthetic Dentistry & Dental Implants",
        "website": "https://swethadentalclinic.vercel.app"
    },
    {
        "doctor_name": "Dr. Nivea Arunan",
        "clinic_name": "Dr. Nivea's Dental Network",
        "email": "smile@drniveasdentalcare.com",
        "phone": "+91 94421 70409",
        "city": "Trichy",
        "state": "Tamil Nadu",
        "specialty": "Invisalign Clear Aligners & Dental Implants",
        "website": "http://drniveasdentalcare.com"
    },
    {
        "doctor_name": "Dr. Praveen Krishnakumar",
        "clinic_name": "Thillai Dental Care",
        "email": "thillaidentalcare@gmail.com",
        "phone": "+91 97912 22122",
        "city": "Trichy",
        "state": "Tamil Nadu",
        "specialty": "Dental Implants & Laser Dentistry",
        "website": "http://thillaidentalcare.com"
    },
    {
        "doctor_name": "Dr. Akshaya",
        "clinic_name": "Akshaya's Dental Clinic",
        "email": "akshayasdentalclinic@gmail.com",
        "phone": "+91 99655 16461",
        "city": "Madurai",
        "state": "Tamil Nadu",
        "specialty": "Dental Implants & Invisalign Clear Aligners",
        "website": "http://akshayasdentalclinic.com"
    },
    {
        "doctor_name": "Dr. Smitha Shaah",
        "clinic_name": "Dr. Smitha's Dental Center",
        "email": "info@drsmithadental.com",
        "phone": "+91 80722 96876",
        "city": "Coimbatore",
        "state": "Tamil Nadu",
        "specialty": "Cosmetic Dentistry, Clear Aligners & Implants",
        "website": "https://drsmithashaah.com"
    },
    {
        "doctor_name": "Dr. Ihsan Ahamed",
        "clinic_name": "MIDAC Dental Centre",
        "email": "mail@midac.in",
        "phone": "+91 92076 44445",
        "city": "Kozhikode",
        "state": "Kerala",
        "specialty": "Dental Implants & Invisalign Clear Aligners",
        "website": "http://midac.in"
    },
    {
        "doctor_name": "Dr. Nandish Shetty",
        "clinic_name": "Elite Dentistry",
        "email": "elitedentistrynd@gmail.com",
        "phone": "+91 99026 08077",
        "city": "Mangalore",
        "state": "Karnataka",
        "specialty": "Oral Implantology & Invisalign Clear Aligners",
        "website": "http://elitedentistrynd.com"
    }
]

def verify_and_save():
    print(f"Total leads in list: {len(leads)}")
    assert 25 <= len(leads) <= 30, f"Expected 25 to 30 leads, got {len(leads)}"

    # Check database deduplication
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT lower(email), lower(clinic_name) FROM leads WHERE email IS NOT NULL")
    db_data = c.fetchall()
    db_emails = set(r[0].strip().lower() for r in db_data if r[0])
    db_clinics = set(r[1].strip().lower() for r in db_data if r[1])
    conn.close()

    # Also load from all existing fresh_leads JSON files
    for f in glob.glob("/Users/pratyushraj/Desktop/dental-crm/scripts/fresh_leads_*.json"):
        if os.path.abspath(f) == os.path.abspath(OUTPUT_FILE):
            continue
        try:
            with open(f, encoding="utf-8") as fp:
                for item in json.load(fp):
                    if "email" in item and item["email"]:
                        db_emails.add(item["email"].strip().lower())
                    if "clinic_name" in item and item["clinic_name"]:
                        db_clinics.add(item["clinic_name"].strip().lower())
        except Exception as e:
            pass

    print(f"Loaded {len(db_emails)} emails and {len(db_clinics)} clinics from master DB & prior batches.")

    seen_emails = set()
    seen_clinics = set()
    required_fields = ["doctor_name", "clinic_name", "email", "phone", "city", "state", "specialty", "website"]

    for i, lead in enumerate(leads, 1):
        for f in required_fields:
            val = lead.get(f)
            assert val and val.strip(), f"Lead {i} missing field: {f}"

        email = lead["email"].strip().lower()
        cname = lead["clinic_name"].strip().lower()

        # Check valid email pattern
        assert re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email), f"Invalid email format: {email}"

        # Master DB check
        if email in db_emails:
            raise ValueError(f"DUPLICATE EMAIL IN DB/BATCHES: {email} ({lead['clinic_name']})")
        if cname in db_clinics:
            raise ValueError(f"DUPLICATE CLINIC IN DB/BATCHES: {cname} ({email})")

        # In-batch check
        if email in seen_emails:
            raise ValueError(f"DUPLICATE EMAIL IN CURRENT BATCH: {email}")
        if cname in seen_clinics:
            raise ValueError(f"DUPLICATE CLINIC IN CURRENT BATCH: {cname}")

        seen_emails.add(email)
        seen_clinics.add(cname)

    print("ALL 30 LEADS PASSED DEDUPLICATION & VALIDATION SUCCESSFULLY!")

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(leads, f, indent=2, ensure_ascii=False)

    print(f"Saved {len(leads)} leads to: {OUTPUT_FILE}")

    # Verify written file
    with open(OUTPUT_FILE, "r", encoding="utf-8") as f:
        loaded = json.load(f)
    assert len(loaded) == len(leads), "File read count mismatch!"
    print("Verification complete. File is valid JSON with exactly 30 fresh leads.")

if __name__ == "__main__":
    verify_and_save()
