import sqlite3
import glob
import json
import re

DB_PATH = '/Users/pratyushraj/Desktop/dental-crm/src/scripts/outreach/dental_leads_master.db'

def get_existing_data():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    db_rows = c.execute('SELECT email, clinic_name, doctor_name FROM leads').fetchall()
    conn.close()

    emails = set()
    clinics = set()
    doctors = set()

    for row in db_rows:
        if row[0]:
            emails.add(row[0].strip().lower())
        if row[1]:
            clinics.add(row[1].strip().lower())
        if row[2]:
            doctors.add(row[2].strip().lower())

    for f in glob.glob('/Users/pratyushraj/Desktop/dental-crm/scripts/fresh_leads_*.json'):
        try:
            with open(f, 'r') as fp:
                data = json.load(fp)
                for item in data:
                    if item.get('email'):
                        emails.add(item['email'].strip().lower())
                    if item.get('clinic_name'):
                        clinics.add(item['clinic_name'].strip().lower())
                    if item.get('doctor_name'):
                        doctors.add(item['doctor_name'].strip().lower())
        except Exception:
            pass

    return emails, clinics, doctors

def verify_lead(lead, emails, clinics, doctors):
    em = lead.get('email', '').strip().lower()
    cname = lead.get('clinic_name', '').strip().lower()
    dname = lead.get('doctor_name', '').strip().lower()
    reasons = []

    if not em or '@' not in em:
        reasons.append('Invalid email')
    if em in emails:
        reasons.append(f"Email '{em}' is already in DB/JSON history")

    norm_cname = re.sub(r'[^a-z0-9]', '', cname)
    for c in clinics:
        norm_c = re.sub(r'[^a-z0-9]', '', c)
        if norm_cname and (norm_cname == norm_c):
            reasons.append(f"Clinic '{cname}' matches existing clinic '{c}'")
            break

    return len(reasons) == 0, reasons

if __name__ == '__main__':
    emails, clinics, doctors = get_existing_data()
    print(f"Loaded {len(emails)} emails, {len(clinics)} clinics from DB and JSON history.")
