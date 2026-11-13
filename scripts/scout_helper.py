import sqlite3
import glob
import json
import re

DB_PATH = '/Users/pratyushraj/Desktop/dental-crm/src/scripts/outreach/dental_leads_master.db'

def get_existing_records(exclude_file=None):
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
        if exclude_file and exclude_file in f:
            continue
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

def is_duplicate(candidate, emails, clinics, doctors):
    em = candidate.get('email', '').strip().lower()
    cname = candidate.get('clinic_name', '').strip().lower()
    dname = candidate.get('doctor_name', '').strip().lower()

    if em in emails:
        return True, f"Email '{em}' is already in DB or past JSON batches"

    # exact clinic match
    if cname in clinics:
        return True, f"Clinic '{cname}' exactly matches an existing clinic"

    # stripped clinic match (e.g. without punctuation)
    norm_cname = re.sub(r'[^a-z0-9]', '', cname)
    if len(norm_cname) > 8:
        for c in clinics:
            norm_c = re.sub(r'[^a-z0-9]', '', c)
            if norm_cname == norm_c:
                return True, f"Clinic '{cname}' normalized matches existing '{c}'"

    # exact doctor match (ignoring 'dr.' prefix)
    doc_core = re.sub(r'^(dr\.?|doctor)\s+', '', dname).strip()
    if len(doc_core) > 5:
        for d in doctors:
            d_core = re.sub(r'^(dr\.?|doctor)\s+', '', d).strip()
            if doc_core == d_core:
                return True, f"Doctor '{dname}' matches existing doctor '{d}'"

    return False, "FRESH"

if __name__ == '__main__':
    emails, clinics, doctors = get_existing_records()
    print(f"Master & past batches loaded: {len(emails)} emails, {len(clinics)} clinics, {len(doctors)} doctors.")
