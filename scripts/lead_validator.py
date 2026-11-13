import sqlite3
import glob
import json
import os
import re

DB_PATH = "/Users/pratyushraj/Desktop/dental-crm/src/scripts/outreach/dental_leads_master.db"
JSON_PATHS = glob.glob("/Users/pratyushraj/Desktop/dental-crm/scripts/*.json") + glob.glob("/Users/pratyushraj/Desktop/dental-crm/src/scripts/outreach/*.json")

EXCLUDED_CHAINS = [
    "clove", "sabka dentist", "apollo dental", "axiss", "orthosquare", 
    "dentzz", "myoms", "partha dental", "dr batra", "expertrons", "mydentist"
]
EXCLUDED_KEYWORDS = [
    "pediatric only", "charitable", "rotary", "lions club", "trust", 
    "college", "government", "municipal"
]

def load_existing():
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

def check_lead(lead, existing_emails, existing_clinics, batch_emails, batch_clinics):
    email = lead.get("email", "").strip().lower()
    cname = lead.get("clinic_name", "").strip().lower()
    doc = lead.get("doctor_name", "").strip().lower()
    spec = lead.get("specialty", "").strip().lower()
    
    if not email or "@" not in email:
        return False, "invalid_email"
    if email in existing_emails:
        return False, f"email_in_existing_db ({email})"
    if email in batch_emails:
        return False, f"email_duplicate_in_batch ({email})"
        
    for chain in EXCLUDED_CHAINS:
        if chain in cname or chain in doc:
            return False, f"excluded_chain ({chain})"
            
    for kw in EXCLUDED_KEYWORDS:
        if kw in cname or kw in spec:
            return False, f"excluded_keyword ({kw})"
            
    if cname in existing_clinics:
        return False, f"exact_clinic_name_exists ({cname})"
    if cname in batch_clinics:
        return False, f"clinic_duplicate_in_batch ({cname})"
        
    return True, "ok"

if __name__ == "__main__":
    emails, clinics = load_existing()
    print(f"Loaded {len(emails)} emails and {len(clinics)} clinics.")
