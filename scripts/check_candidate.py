import sqlite3
import re

DB_PATH = "/Users/pratyushraj/Desktop/dental-crm/src/scripts/outreach/dental_leads_master.db"

def check_candidate(email=None, clinic=None, doctor=None, website=None):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    
    reasons = []
    
    if email:
        em = email.strip().lower()
        c.execute("SELECT id, clinic_name, doctor_name, email, city FROM leads WHERE lower(email) = ?", (em,))
        res = c.fetchall()
        if res:
            reasons.append(f"EMAIL MATCH: {res}")
            
    if clinic:
        cl = clinic.strip().lower()
        # Clean clinic name common terms
        c.execute("SELECT id, clinic_name, doctor_name, email, city FROM leads WHERE lower(clinic_name) = ?", (cl,))
        res = c.fetchall()
        if res:
            reasons.append(f"EXACT CLINIC MATCH: {res}")
        else:
            # check key words
            words = [w for w in re.split(r'[^a-zA-Z0-9]', cl) if len(w) > 4 and w not in ('dental', 'clinic', 'center', 'centre', 'speciality', 'care', 'hospital')]
            for w in words:
                c.execute("SELECT id, clinic_name, doctor_name, email, city FROM leads WHERE lower(clinic_name) LIKE ?", (f"%{w}%",))
                m = c.fetchall()
                if m:
                    for row in m:
                        reasons.append(f"CLINIC KEYWORD '{w}' MATCH: id={row[0]}, clinic={row[1]}, doc={row[2]}, city={row[4]}")
                        
    if doctor:
        doc = doctor.strip().lower().replace("dr.", "").replace("dr", "").strip()
        parts = [p for p in doc.split() if len(p) > 2]
        if len(parts) >= 2:
            query = f"%{parts[0]}%{parts[-1]}%"
            c.execute("SELECT id, clinic_name, doctor_name, email, city FROM leads WHERE lower(doctor_name) LIKE ?", (query,))
            res = c.fetchall()
            if res:
                reasons.append(f"DOCTOR NAME MATCH: {res}")
                
    if website:
        domain = website.replace("https://", "").replace("http://", "").split("/")[0].replace("www.", "").lower()
        if domain:
            c.execute("SELECT id, clinic_name, doctor_name, email, city FROM leads WHERE lower(email) LIKE ?", (f"%{domain}%",))
            res = c.fetchall()
            if res:
                reasons.append(f"DOMAIN IN EMAIL MATCH: {res}")

    conn.close()
    return reasons

if __name__ == "__main__":
    import sys
    print("Check candidate script ready.")
