import sqlite3
import glob
import json
import re
import sys
import os

PROJECT_ROOT = "/Users/pratyushraj/Desktop/dental-crm"
DB_PATH = os.path.join(PROJECT_ROOT, "src", "scripts", "outreach", "dental_leads_master.db")

EXCLUDED_CHAINS = [
    "clove", "sabka dentist", "apollo dental", "axiss", "orthosquare", 
    "dentzz", "myoms", "partha dental", "dr batra", "expertrons",
    "facio", "ident", "partha"
]
EXCLUDED_KEYWORDS = [
    "pediatric only", "charitable", "rotary", "lions club", "trust", 
    "hospital & college", "dental college", "government", "municipal"
]

def get_known_emails():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('SELECT lower(email) FROM leads WHERE email IS NOT NULL AND email != ""')
    emails = set(r[0].strip().lower() for r in c.fetchall())
    conn.close()

    for f in glob.glob(os.path.join(PROJECT_ROOT, "scripts", "*.json")):
        try:
            with open(f) as fp:
                data = json.load(fp)
                if isinstance(data, list):
                    for item in data:
                        if isinstance(item, dict) and 'email' in item:
                            em = item['email'].strip().lower()
                            if em:
                                emails.add(em)
        except:
            pass
    return emails

def check_lead(lead, known_emails):
    email = lead.get("email", "").strip().lower()
    if not email or "@" not in email:
        return False, f"Invalid email: {email}"
    if email in known_emails:
        return False, f"Email already in DB/JSON: {email}"
    
    clinic = lead.get("clinic_name", "").lower()
    doc = lead.get("doctor_name", "").lower()
    spec = lead.get("specialty", "").lower()
    
    for ch in EXCLUDED_CHAINS:
        if ch in clinic or ch in doc:
            return False, f"Matches excluded chain: {ch}"
            
    for kw in EXCLUDED_KEYWORDS:
        if kw in clinic or kw in spec:
            return False, f"Matches excluded keyword: {kw}"
            
    return True, "OK"

if __name__ == "__main__":
    known = get_known_emails()
    print(f"Total known emails loaded: {len(known)}")
    if len(sys.argv) > 1:
        email = sys.argv[1].strip().lower()
        if email in known:
            print(f"EXISTS: {email}")
        else:
            print(f"FRESH: {email}")
