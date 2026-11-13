import json
import sqlite3
import re
import os

OUTPUT_FILE = "/Users/pratyushraj/Desktop/dental-crm/scripts/fresh_leads_south_nov11.json"
DB_PATH = "/Users/pratyushraj/Desktop/dental-crm/src/scripts/outreach/dental_leads_master.db"

leads = [
    {
        "doctor_name": "Dr. Ashok Koratti Ramadorai",
        "clinic_name": "First Impressions Dental Clinic",
        "email": "fidcadyar@gmail.com",
        "phone": "+91 90439 27417",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "specialty": "Oral & Maxillofacial Surgery and Dental Implants",
        "website": "http://firstimpressionsdentalclinic.com"
    },
    {
        "doctor_name": "Dr. R. Udayapriya Deenchakkaravarthy",
        "clinic_name": "Udayaravi Dental Clinic",
        "email": "urdental.trichy@gmail.com",
        "phone": "+91 93633 42123",
        "city": "Trichy",
        "state": "Tamil Nadu",
        "specialty": "Implantologist & Clear Aligner Specialist",
        "website": "https://urdental.in"
    },
    {
        "doctor_name": "Dr. Yazhini Shanmya",
        "clinic_name": "Krishna Advanced Dental & Implant Centre",
        "email": "krishnaadvanceddental@gmail.com",
        "phone": "+91 93639 80591",
        "city": "Trichy",
        "state": "Tamil Nadu",
        "specialty": "Prosthodontics & Oral Implantology",
        "website": "https://krishnaadvanceddental.com"
    },
    {
        "doctor_name": "Dr. Naveen Kumar Antyakula",
        "clinic_name": "Tooth Planet Laser & Implant Centre",
        "email": "toothplanetvizag@gmail.com",
        "phone": "+91 94417 55805",
        "city": "Visakhapatnam",
        "state": "Andhra Pradesh",
        "specialty": "Laser Dentistry & Dental Implantology",
        "website": "http://toothplanet.in"
    },
    {
        "doctor_name": "Dr. Anne Ravikanth",
        "clinic_name": "Ravi Dental Care & Implant Center",
        "email": "ravidentalcareandimplantcentre@gmail.com",
        "phone": "+91 93473 63515",
        "city": "Vijayawada",
        "state": "Andhra Pradesh",
        "specialty": "Prosthodontics & Implantology",
        "website": "http://ravidentalcare.in"
    },
    {
        "doctor_name": "Dr. Ravikumar R.",
        "clinic_name": "Malkan Dental Surgery Clinic",
        "email": "malkandentalsurgery@gmail.com",
        "phone": "+91 95357 19952",
        "city": "Bengaluru",
        "state": "Karnataka",
        "specialty": "Implant Dentistry & Oral Surgery",
        "website": "http://malkandentalsurgery.com"
    },
    {
        "doctor_name": "Dr. Manish Kumar Singh",
        "clinic_name": "Manaswa Facial Surgery & Dental Implant Center",
        "email": "info@manaswa.com",
        "phone": "+91 98801 68585",
        "city": "Bengaluru",
        "state": "Karnataka",
        "specialty": "Oral & Maxillofacial Surgeon and Implantologist",
        "website": "https://manaswa.com"
    },
    {
        "doctor_name": "Dr. Chaitra Tejas",
        "clinic_name": "Dr. Chaitra's Dental Clinic & Implant Centre",
        "email": "dr.chaitratejas@gmail.com",
        "phone": "+91 99863 36226",
        "city": "Bengaluru",
        "state": "Karnataka",
        "specialty": "Dental Implants & Invisalign",
        "website": "http://drchaitrasdental.in"
    },
    {
        "doctor_name": "Dr. Sucheta V",
        "clinic_name": "Smile Formula Dental Clinic",
        "email": "smileformula@gmail.com",
        "phone": "+91 95388 08496",
        "city": "Bengaluru",
        "state": "Karnataka",
        "specialty": "Implantology & Full Mouth Rehabilitation",
        "website": "http://smileformuladental.com"
    },
    {
        "doctor_name": "Dr. Deepu Krishna S",
        "clinic_name": "Smile Craft Dental Clinic & Implant Centre",
        "email": "deepuomdr@gmail.com",
        "phone": "+91 94499 51690",
        "city": "Bengaluru",
        "state": "Karnataka",
        "specialty": "Oral Medicine, Radiologist & Implantologist",
        "website": "http://smilecraftimplantcentre.com"
    },
    {
        "doctor_name": "Dr. Vijay R",
        "clinic_name": "Vijaya Dental International",
        "email": "vijayadental20@gmail.com",
        "phone": "+91 92424 36961",
        "city": "Bengaluru",
        "state": "Karnataka",
        "specialty": "Zygomatic & Corticobasal Dental Implantology",
        "website": "http://vijayadentalinternational.com"
    },
    {
        "doctor_name": "Dr. Navatha Mortha",
        "clinic_name": "Gnathos Dental",
        "email": "gnathosdentalcare@gmail.com",
        "phone": "+91 99557 08885",
        "city": "Hyderabad",
        "state": "Telangana",
        "specialty": "Oral Implantology & Guided Implant Surgery",
        "website": "http://gnathosdental.in"
    },
    {
        "doctor_name": "Dr. T. Sampath Kumar",
        "clinic_name": "Kalyani Dental Hospital & Implant Centre",
        "email": "drtsampathkumar@gmail.com",
        "phone": "+91 90322 27148",
        "city": "Hyderabad",
        "state": "Telangana",
        "specialty": "Prosthodontics & Oral Implantology",
        "website": "https://kalyanidental.com"
    },
    {
        "doctor_name": "Dr. Ashok Chandra",
        "clinic_name": "Pradham Dental",
        "email": "pradhamdental@gmail.com",
        "phone": "+91 95024 99938",
        "city": "Hyderabad",
        "state": "Telangana",
        "specialty": "Implants & Invisalign Specialist",
        "website": "https://pradhamdental.com"
    },
    {
        "doctor_name": "Dr. Neha Ohatker",
        "clinic_name": "SuDanta Dental Care",
        "email": "sudantadentalcarecenter@gmail.com",
        "phone": "+91 79977 22709",
        "city": "Hyderabad",
        "state": "Telangana",
        "specialty": "Periodontist & Implantologist",
        "website": "https://sudantadentalcare.com"
    },
    {
        "doctor_name": "Dr. Jhansi Rani Ragala",
        "clinic_name": "Dr. Jhansi Dental & Implant Center",
        "email": "ragala.jhansi@gmail.com",
        "phone": "+91 99121 44448",
        "city": "Hyderabad",
        "state": "Telangana",
        "specialty": "Prosthodontics & Oral Implantology",
        "website": "http://drjhansidental.in"
    },
    {
        "doctor_name": "Prof. Dr. Manjunatha Reddy C.",
        "clinic_name": "Star Smiles Dental Care",
        "email": "starsmilesdentalcare@gmail.com",
        "phone": "+91 90302 71023",
        "city": "Hyderabad",
        "state": "Telangana",
        "specialty": "Orthodontics & Implantology",
        "website": "https://starsmilesdentalcare.com"
    },
    {
        "doctor_name": "Dr. Boominathan",
        "clinic_name": "Quality Dentistry",
        "email": "qualitydentistry3@gmail.com",
        "phone": "+91 63695 12336",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "specialty": "Implantology & Digital Restorative Dentistry",
        "website": "https://qualitydigitaldentistry.in"
    },
    {
        "doctor_name": "Dr. Janani B",
        "clinic_name": "Right Dental Clinic",
        "email": "info@rightdentalclinic.com",
        "phone": "+91 95662 99961",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "specialty": "Dental Implants & Cosmetic Dentistry",
        "website": "http://rightdentalclinic.com"
    },
    {
        "doctor_name": "Dr. Ajay Sathya",
        "clinic_name": "Athreya Dental Clinic",
        "email": "athreyadentalclinic@gmail.com",
        "phone": "+91 78100 28515",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "specialty": "Prosthodontics, Implantology & Orthodontics",
        "website": "https://athreyadentalclinic.com"
    },
    {
        "doctor_name": "Dr. Sourav Mukherjee",
        "clinic_name": "Shakthi Dental Clinic",
        "email": "shakthidentalbangalore@gmail.com",
        "phone": "+91 91108 53536",
        "city": "Bengaluru",
        "state": "Karnataka",
        "specialty": "Implant Dentistry & Oral Rehabilitation",
        "website": "http://shakthidentalclinic.co.in"
    },
    {
        "doctor_name": "Dr. Thomas Nechupadam",
        "clinic_name": "Nechupadam Dental Clinic",
        "email": "thomasnechupadam@gmail.com",
        "phone": "+91 99466 02221",
        "city": "Kochi",
        "state": "Kerala",
        "specialty": "Dental Implants & Clear Aligners",
        "website": "http://nechupadam.com"
    },
    {
        "doctor_name": "Dr. Thomas V. Issac",
        "clinic_name": "Yoha Dental Clinic",
        "email": "yoha22993@gmail.com",
        "phone": "+91 88483 75345",
        "city": "Kochi",
        "state": "Kerala",
        "specialty": "Implantology & Restorative Dentistry",
        "website": "http://yohadentalcare.in"
    },
    {
        "doctor_name": "Dr. Lin Kovoor",
        "clinic_name": "Kovoor Dental Clinic & Implant Centre",
        "email": "linkovoor@gmail.com",
        "phone": "+91 98470 47435",
        "city": "Trivandrum",
        "state": "Kerala",
        "specialty": "Prosthodontics & Implant Dentistry",
        "website": "http://kovoordental.com"
    },
    {
        "doctor_name": "Dr. Bishma S. M.",
        "clinic_name": "Dr. Bishma's Dental Clinic & Implant Center",
        "email": "drbishmasdentalclinic@gmail.com",
        "phone": "+91 80751 55997",
        "city": "Trivandrum",
        "state": "Kerala",
        "specialty": "Dental Implantology & Cosmetic Dentistry",
        "website": "http://bdcimplants.in"
    },
    {
        "doctor_name": "Dr. Jana Narayanan V. S.",
        "clinic_name": "V K V Dental Clinic and Implant Centre",
        "email": "vkvimplantclinic@gmail.com",
        "phone": "+91 80509 68552",
        "city": "Trivandrum",
        "state": "Kerala",
        "specialty": "Oral Implantology (FICOI) & Prosthodontics",
        "website": "https://findadentistonline.com/listing/v-k-v-dental-clinic-implant-centre"
    },
    {
        "doctor_name": "Dr. Dhanush R",
        "clinic_name": "MCR Dental and Implant Super Speciality Clinic",
        "email": "mcrdentalandimplant@gmail.com",
        "phone": "+91 97400 23971",
        "city": "Mysore",
        "state": "Karnataka",
        "specialty": "Prosthodontics & Oral Implantology",
        "website": "http://mcrdentalmysuru.com"
    },
    {
        "doctor_name": "Dr. Deepthi Jagadish",
        "clinic_name": "Vrushabha Dental",
        "email": "vrushabhadental@gmail.com",
        "phone": "+91 95351 87471",
        "city": "Mysore",
        "state": "Karnataka",
        "specialty": "Implant Dentistry & Smile Makeovers",
        "website": "http://vrushabhadental.com"
    },
    {
        "doctor_name": "Dr. Rohan Mascarenhas",
        "clinic_name": "Dr. Rohan Mascarenhas Orthodontic & Dental Clinic",
        "email": "rohanorthodontics@gmail.com",
        "phone": "+91 96866 75408",
        "city": "Mangalore",
        "state": "Karnataka",
        "specialty": "Orthodontics, Clear Aligners & Cosmetic Dentistry",
        "website": "http://rohanmasc.in"
    },
    {
        "doctor_name": "Dr. G. Suresh",
        "clinic_name": "Esthetics Dental Clinic",
        "email": "estheticsdentalclinic@gmail.com",
        "phone": "+91 78714 64641",
        "city": "Coimbatore",
        "state": "Tamil Nadu",
        "specialty": "Maxillofacial Surgery, Dental Implants & Esthetic Dentistry",
        "website": "http://estheticsdental.in"
    }
]

def verify_and_save():
    print(f"Total leads in list: {len(leads)}")
    assert 25 <= len(leads) <= 30, f"Expected 25 to 30 leads, got {len(leads)}"

    # Check database deduplication
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT lower(email), lower(clinic_name) FROM leads")
    db_data = c.fetchall()
    db_emails = set(r[0].strip().lower() for r in db_data if r[0])
    db_clinics = set(r[1].strip().lower() for r in db_data if r[1])
    conn.close()

    print(f"Loaded {len(db_emails)} emails and {len(db_clinics)} clinics from master DB.")

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
            raise ValueError(f"DUPLICATE EMAIL IN DB: {email} ({lead['clinic_name']})")
        if cname in db_clinics:
            raise ValueError(f"DUPLICATE CLINIC IN DB: {cname} ({email})")

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
