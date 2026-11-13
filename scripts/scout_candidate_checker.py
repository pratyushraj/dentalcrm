import sqlite3
import glob
import json
import re
import sys

DB_PATH = "/Users/pratyushraj/Desktop/dental-crm/src/scripts/outreach/dental_leads_master.db"

def get_existing_set():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT lower(email), lower(clinic_name) FROM leads WHERE email IS NOT NULL")
    db_records = c.fetchall()
    conn.close()

    db_emails = set(r[0].strip().lower() for r in db_records if r[0])
    db_clinics = set(r[1].strip().lower() for r in db_records if r[1])

    for f in glob.glob("/Users/pratyushraj/Desktop/dental-crm/scripts/fresh_leads_*.json"):
        try:
            with open(f) as fp:
                for item in json.load(fp):
                    if "email" in item and item["email"]:
                        db_emails.add(item["email"].strip().lower())
                    if "clinic_name" in item and item["clinic_name"]:
                        db_clinics.add(item["clinic_name"].strip().lower())
        except:
            pass
    return db_emails, db_clinics

def check_candidates(candidates):
    db_emails, db_clinics = get_existing_set()
    results = []
    for cand in candidates:
        email = cand.get("email", "").strip().lower()
        clinic = cand.get("clinic_name", "").strip().lower()
        email_match = email in db_emails if email else False
        clinic_match = clinic in db_clinics if clinic else False
        
        # also check partial clinic name matching
        partial_matches = [c for c in db_clinics if clinic and (clinic in c or c in clinic) and len(clinic) > 8]
        
        is_fresh = (not email_match) and (not clinic_match)
        results.append({
            "candidate": cand,
            "is_fresh": is_fresh,
            "email_exists": email_match,
            "clinic_exists": clinic_match,
            "partial_matches": partial_matches[:2]
        })
    return results

if __name__ == "__main__":
    db_emails, db_clinics = get_existing_set()
    print(f"Total deduplication database loaded: {len(db_emails)} emails, {len(db_clinics)} clinics.")
