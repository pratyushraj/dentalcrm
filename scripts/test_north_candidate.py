import sqlite3
import glob
import json
import re

DB_PATH = '/Users/pratyushraj/Desktop/dental-crm/src/scripts/outreach/dental_leads_master.db'

def load_all_existing():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT lower(email), lower(clinic_name), lower(doctor_name) FROM leads")
    db_rows = c.fetchall()
    conn.close()

    emails = set()
    clinics = set()
    doctors = set()

    for em, cl, doc in db_rows:
        if em: emails.add(em.strip().lower())
        if cl: clinics.add(cl.strip().lower())
        if doc: doctors.add(doc.strip().lower())

    for f in glob.glob('/Users/pratyushraj/Desktop/dental-crm/scripts/fresh_leads_*.json'):
        if 'nov13' in f: continue
        try:
            with open(f, 'r') as fp:
                data = json.load(fp)
                for item in data:
                    if item.get('email'): emails.add(item['email'].strip().lower())
                    if item.get('clinic_name'): clinics.add(item['clinic_name'].strip().lower())
                    if item.get('doctor_name'): doctors.add(item['doctor_name'].strip().lower())
        except Exception:
            pass

    return emails, clinics, doctors

def check_one(cand, emails, clinics, doctors):
    em = cand.get('email', '').strip().lower()
    cname = cand.get('clinic_name', '').strip().lower()
    dname = cand.get('doctor_name', '').strip().lower()

    issues = []
    if not em or '@' not in em:
        issues.append(f"Invalid email: {em}")
    elif em in emails:
        issues.append(f"Email duplicate: {em}")

    norm_cname = re.sub(r'[^a-z0-9]', '', cname)
    for c in clinics:
        norm_c = re.sub(r'[^a-z0-9]', '', c)
        if norm_cname and (norm_cname == norm_c or (len(norm_cname) > 8 and (norm_cname in norm_c or norm_c in norm_cname))):
            issues.append(f"Clinic match: '{cname}' ~= '{c}'")
            break

    norm_doc = re.sub(r'[^a-z0-9]', '', dname.replace('dr', ''))
    for d in doctors:
        norm_d = re.sub(r'[^a-z0-9]', '', d.replace('dr', ''))
        if len(norm_doc) > 6 and (norm_doc == norm_d or norm_doc in norm_d or norm_d in norm_doc):
            issues.append(f"Doctor match: '{dname}' ~= '{d}'")
            break

    return issues

if __name__ == '__main__':
    emails, clinics, doctors = load_all_existing()
    print(f"Loaded {len(emails)} emails, {len(clinics)} clinics, {len(doctors)} doctors.")
