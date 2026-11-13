import json
import sqlite3
import glob
import os
import re

DB_PATH = "/Users/pratyushraj/Desktop/dental-crm/src/scripts/outreach/dental_leads_master.db"

def get_existing_emails():
    existing = set()
    if os.path.exists(DB_PATH):
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute("SELECT lower(email) FROM leads")
        for r in c.fetchall():
            if r[0]:
                existing.add(r[0].strip().lower())
        conn.close()

    for f in glob.glob("/Users/pratyushraj/Desktop/dental-crm/scripts/fresh_leads_*.json"):
        try:
            with open(f, "r", encoding="utf-8") as fp:
                data = json.load(fp)
                for item in data:
                    em = item.get("email", "").strip().lower()
                    if em:
                        existing.add(em)
        except Exception:
            pass

    return existing

if __name__ == "__main__":
    emails = get_existing_emails()
    print(f"Total unique blocked/existing emails: {len(emails)}")
