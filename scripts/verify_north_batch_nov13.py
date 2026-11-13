import json
import sqlite3
import glob
import re
import os

DB_PATH = '/Users/pratyushraj/Desktop/dental-crm/src/scripts/outreach/dental_leads_master.db'
TARGET_FILE = '/Users/pratyushraj/Desktop/dental-crm/scripts/fresh_leads_north_nov13.json'

EXCLUDED_CHAINS = [
    "clove", "sabka dentist", "apollo dental", "axiss", "orthosquare", 
    "dentzz", "myoms", "partha dental", "dr batra", "expertrons", "mydentist",
    "dezy", "smiledesigner", "toothsi"
]
EXCLUDED_KEYWORDS = [
    "pediatric only", "charitable", "rotary", "lions club", "trust", 
    "college", "government", "municipal"
]
REQUIRED_FIELDS = ["doctor_name", "clinic_name", "email", "phone", "city", "state", "specialty", "website"]

def run_verification():
    # 1. Load target file
    assert os.path.exists(TARGET_FILE), f"File {TARGET_FILE} not found"
    with open(TARGET_FILE, 'r', encoding='utf-8') as f:
        leads = json.load(f)
    
    print(f"Loaded {len(leads)} leads from {TARGET_FILE}")
    assert len(leads) == 30, f"Expected 30 leads, got {len(leads)}"

    # 2. Load DB records
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT lower(email), lower(clinic_name), lower(doctor_name) FROM leads")
    db_rows = c.fetchall()
    conn.close()

    db_emails = set(r[0].strip().lower() for r in db_rows if r[0])
    db_clinics = set(r[1].strip().lower() for r in db_rows if r[1])
    db_doctors = set(r[2].strip().lower() for r in db_rows if r[2])

    # 3. Load other fresh_leads_*.json files
    other_emails = set()
    other_clinics = set()
    other_doctors = set()

    for fpath in glob.glob('/Users/pratyushraj/Desktop/dental-crm/scripts/fresh_leads_*.json'):
        if 'nov13' in fpath:
            continue
        try:
            with open(fpath, 'r', encoding='utf-8') as fp:
                data = json.load(fp)
                for item in data:
                    if item.get('email'):
                        other_emails.add(item['email'].strip().lower())
                    if item.get('clinic_name'):
                        other_clinics.add(item['clinic_name'].strip().lower())
                    if item.get('doctor_name'):
                        other_doctors.add(item['doctor_name'].strip().lower())
        except Exception:
            pass

    master_emails = db_emails | other_emails
    master_clinics = db_clinics | other_clinics
    master_doctors = db_doctors | other_doctors

    print(f"Master baseline: {len(master_emails)} emails, {len(master_clinics)} clinics, {len(master_doctors)} doctors.")

    batch_emails = set()
    batch_clinics = set()
    batch_doctors = set()

    errors = []

    for idx, lead in enumerate(leads, start=1):
        # Field check
        for field in REQUIRED_FIELDS:
            val = lead.get(field)
            if not val or not str(val).strip():
                errors.append(f"Lead #{idx}: Missing or empty required field '{field}'")

        em = lead.get('email', '').strip().lower()
        cname = lead.get('clinic_name', '').strip().lower()
        dname = lead.get('doctor_name', '').strip().lower()
        spec = lead.get('specialty', '').strip().lower()
        website = lead.get('website', '').strip()

        # Email format
        if not re.match(r"^[^@]+@[^@]+\.[^@]+$", em):
            errors.append(f"Lead #{idx}: Invalid email format '{em}'")

        # Website format
        if not (website.startswith('http://') or website.startswith('https://')):
            errors.append(f"Lead #{idx}: Website must start with http/https '{website}'")

        # Excluded chains & keywords
        for chain in EXCLUDED_CHAINS:
            if chain in cname or chain in dname:
                errors.append(f"Lead #{idx}: Matches excluded chain '{chain}'")
        for kw in EXCLUDED_KEYWORDS:
            if kw in cname or kw in spec:
                errors.append(f"Lead #{idx}: Matches excluded keyword '{kw}'")

        # Uniqueness against master
        if em in master_emails:
            errors.append(f"Lead #{idx}: Email '{em}' exists in master DB/past batches!")
        if cname in master_clinics:
            errors.append(f"Lead #{idx}: Clinic '{cname}' exists in master DB/past batches!")
        
        # Internal batch uniqueness
        if em in batch_emails:
            errors.append(f"Lead #{idx}: Duplicate email inside batch '{em}'")
        batch_emails.add(em)

        if cname in batch_clinics:
            errors.append(f"Lead #{idx}: Duplicate clinic inside batch '{cname}'")
        batch_clinics.add(cname)

        if dname in batch_doctors:
            errors.append(f"Lead #{idx}: Duplicate doctor inside batch '{dname}'")
        batch_doctors.add(dname)

    if errors:
        print(f"\n❌ FOUND {len(errors)} ERRORS:")
        for err in errors:
            print(f"  - {err}")
        sys.exit(1)
    else:
        print("\n✅ PERFECT! ALL 30 LEADS ARE VALID, COMPLETE, AND ZERO DUPLICATES FOUND!")

if __name__ == '__main__':
    run_verification()
