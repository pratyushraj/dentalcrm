import sqlite3
import glob
import json
import os
import re

DB_PATH = "/Users/pratyushraj/Desktop/dental-crm/src/scripts/outreach/dental_leads_master.db"
JSON_PATHS = glob.glob("/Users/pratyushraj/Desktop/dental-crm/scripts/*.json") + glob.glob("/Users/pratyushraj/Desktop/dental-crm/src/scripts/outreach/*.json")

EXCLUDED_CHAINS = [
    "clove", "sabka dentist", "apollo dental", "axiss", "orthosquare", 
    "dentzz", "myoms", "partha dental", "dr batra", "expertrons", "mydentist",
    "dezy", "smiledesigner", "toothsi"
]
EXCLUDED_KEYWORDS = [
    "pediatric only", "charitable", "rotary", "lions club", "trust", 
    "college", "government", "municipal"
]

def load_database():
    existing_emails = set()
    existing_clinics = set()
    
    if os.path.exists(DB_PATH):
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute("SELECT lower(email), lower(clinic_name) FROM leads")
        for em, cname in c.fetchall():
            if em:
                existing_emails.add(em.strip().lower())
            if cname:
                existing_clinics.add(cname.strip().lower())
        conn.close()
        
    for p in JSON_PATHS:
        # Ignore our target file if it already exists during editing
        if "fresh_leads_central_east_nov12" in p:
            continue
        try:
            with open(p, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, list):
                    for item in data:
                        if isinstance(item, dict):
                            em = item.get("email")
                            if em:
                                existing_emails.add(em.strip().lower())
                            cn = item.get("clinic_name")
                            if cn:
                                existing_clinics.add(cn.strip().lower())
        except Exception:
            pass
            
    return existing_emails, existing_clinics

def validate_lead(lead, existing_emails, existing_clinics, batch_emails=None, batch_clinics=None):
    if batch_emails is None: batch_emails = set()
    if batch_clinics is None: batch_clinics = set()
    
    required_fields = ["doctor_name", "clinic_name", "email", "phone", "city", "state", "specialty", "website"]
    for field in required_fields:
        if field not in lead or not str(lead[field]).strip():
            return False, f"Missing required field: {field}"
            
    email = lead.get("email", "").strip().lower()
    cname = lead.get("clinic_name", "").strip().lower()
    doc = lead.get("doctor_name", "").strip().lower()
    spec = lead.get("specialty", "").strip().lower()
    
    if not re.match(r"^[^@]+@[^@]+\.[^@]+$", email):
        return False, f"Invalid email format: {email}"
        
    if email in existing_emails:
        return False, f"Email exists in master DB / prior batches: {email}"
        
    if email in batch_emails:
        return False, f"Email duplicate in current batch: {email}"
        
    for chain in EXCLUDED_CHAINS:
        if chain in cname or chain in doc:
            return False, f"Excluded chain ({chain})"
            
    for kw in EXCLUDED_KEYWORDS:
        if kw in cname or kw in spec:
            return False, f"Excluded keyword ({kw})"
            
    if cname in existing_clinics:
        return False, f"Clinic name exists in prior batches/DB: {cname}"
        
    if cname in batch_clinics:
        return False, f"Clinic duplicate in current batch: {cname}"
        
    return True, "OK"

if __name__ == "__main__":
    emails, clinics = load_database()
    print(f"Loaded {len(emails)} emails and {len(clinics)} clinics.")
