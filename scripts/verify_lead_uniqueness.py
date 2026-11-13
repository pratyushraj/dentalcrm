import json
import sqlite3
import sys
import os

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(PROJECT_ROOT, "src", "scripts", "outreach", "dental_leads_master.db")

EXCLUDED_CHAINS = [
    "clove", "sabka dentist", "apollo dental", "axiss", "orthosquare", 
    "dentzz", "myoms", "partha dental", "dr batra", "expertrons"
]
EXCLUDED_KEYWORDS = [
    "pediatric only", "charitable", "rotary", "lions club", "trust", 
    "hospital & college", "dental college", "government", "municipal"
]

def load_db_emails():
    if not os.path.exists(DB_PATH):
        return set()
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT lower(email) FROM leads")
    emails = set(r[0].strip() for r in c.fetchall() if r[0])
    conn.close()
    return emails

def is_valid_new_lead(lead, db_emails, seen_in_batch=None):
    if seen_in_batch is None:
        seen_in_batch = set()
    
    email = lead.get("email", "").strip().lower()
    if not email or "@" not in email:
        return False, "invalid_email"
    if email in db_emails:
        return False, "already_in_master_db"
    if email in seen_in_batch:
        return False, "duplicate_in_current_batch"
        
    cname = lead.get("clinic_name", "").lower()
    spec = lead.get("specialty", "").lower()
    doc = lead.get("doctor_name", "").lower()
    
    for chain in EXCLUDED_CHAINS:
        if chain in cname or chain in doc:
            return False, f"excluded_chain_{chain}"
            
    for kw in EXCLUDED_KEYWORDS:
        if kw in cname or kw in spec:
            return False, f"excluded_keyword_{kw}"
            
    return True, "valid"

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1].endswith(".json"):
        json_file = sys.argv[1]
        with open(json_file, "r", encoding="utf-8") as f:
            data = json.load(f)
        db_emails = load_db_emails()
        print(f"Loaded {len(db_emails)} existing emails from master DB.")
        valid = []
        seen = set()
        for l in data:
            ok, reason = is_valid_new_lead(l, db_emails, seen)
            if ok:
                em = l.get("email", "").strip().lower()
                seen.add(em)
                valid.append(l)
            else:
                pass
        print(f"Input: {len(data)} leads -> Valid & completely fresh: {len(valid)}")
        out_path = json_file.replace(".json", "_verified_fresh.json")
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(valid, f, indent=2)
        print(f"Wrote to: {out_path}")
