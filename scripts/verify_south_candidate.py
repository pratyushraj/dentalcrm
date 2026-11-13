import sqlite3
import glob
import json
import re

DB_PATH = "/Users/pratyushraj/Desktop/dental-crm/src/scripts/outreach/dental_leads_master.db"

def load_all_existing():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    # Check table structure
    cols = [col[1] for col in c.execute("PRAGMA table_info(leads)").fetchall()]
    select_cols = ["email", "clinic_name", "doctor_name"]
    if "phone" in cols:
        select_cols.append("phone")
    if "website" in cols:
        select_cols.append("website")
    
    query = f"SELECT {', '.join(select_cols)} FROM leads"
    rows = c.execute(query).fetchall()
    conn.close()

    emails = set()
    clinics = set()
    doctors = set()
    phones = set()
    domains = set()

    def add_entry(em, cl, doc, ph=None, web=None):
        if em:
            em_clean = em.strip().lower()
            emails.add(em_clean)
            if "@" in em_clean:
                dom = em_clean.split("@")[-1]
                if dom not in ("gmail.com", "yahoo.com", "rediffmail.com", "outlook.com", "hotmail.com", "yahoo.co.in", "icloud.com"):
                    domains.add(dom)
        if cl:
            clinics.add(cl.strip().lower())
        if doc:
            doctors.add(doc.strip().lower())
        if ph:
            p_digits = re.sub(r'[^0-9]', '', str(ph))
            if len(p_digits) >= 10:
                phones.add(p_digits[-10:])
        if web:
            web_clean = web.lower().replace("https://", "").replace("http://", "").replace("www.", "").strip("/")
            dom = web_clean.split("/")[0]
            if dom:
                domains.add(dom)

    for r in rows:
        em = r[0] if len(r) > 0 else None
        cl = r[1] if len(r) > 1 else None
        doc = r[2] if len(r) > 2 else None
        ph = r[3] if len(r) > 3 and "phone" in cols else None
        web = r[4] if len(r) > 4 and "website" in cols else None
        add_entry(em, cl, doc, ph, web)

    for f in glob.glob("/Users/pratyushraj/Desktop/dental-crm/scripts/fresh_leads_*.json"):
        try:
            with open(f, "r") as fp:
                data = json.load(fp)
                for item in data:
                    add_entry(
                        item.get("email"),
                        item.get("clinic_name"),
                        item.get("doctor_name"),
                        item.get("phone"),
                        item.get("website")
                    )
        except Exception:
            pass

    return {
        "emails": emails,
        "clinics": clinics,
        "doctors": doctors,
        "phones": phones,
        "domains": domains
    }

GLOBAL_CACHE = None

def check_candidate(candidate):
    global GLOBAL_CACHE
    if GLOBAL_CACHE is None:
        GLOBAL_CACHE = load_all_existing()
    
    existing = GLOBAL_CACHE
    issues = []

    em = candidate.get("email", "").strip().lower()
    cl = candidate.get("clinic_name", "").strip().lower()
    doc = candidate.get("doctor_name", "").strip().lower()
    ph = candidate.get("phone", "")
    web = candidate.get("website", "")

    # 1. Email check
    if not em or "@" not in em:
        issues.append("Missing or invalid email")
    elif em in existing["emails"]:
        issues.append(f"EMAIL ALREADY EXISTS: {em}")
    else:
        # Check domain collision if custom domain
        dom = em.split("@")[-1]
        if dom not in ("gmail.com", "yahoo.com", "rediffmail.com", "outlook.com", "hotmail.com", "yahoo.co.in", "icloud.com"):
            if dom in existing["domains"]:
                issues.append(f"EMAIL DOMAIN MATCHES EXISTING: {dom}")

    # 2. Clinic name check
    norm_cl = re.sub(r'[^a-z0-9]', '', cl)
    for existing_cl in existing["clinics"]:
        norm_e = re.sub(r'[^a-z0-9]', '', existing_cl)
        if norm_cl and norm_e:
            if norm_cl == norm_e:
                issues.append(f"EXACT CLINIC MATCH: '{cl}' vs '{existing_cl}'")
                break
            # if distinctive name matches
            cl_core = re.sub(r'(dental|clinic|centre|center|implant|speciality|advanced|care|multispeciality|hospital|and)', '', norm_cl)
            e_core = re.sub(r'(dental|clinic|centre|center|implant|speciality|advanced|care|multispeciality|hospital|and)', '', norm_e)
            if len(cl_core) >= 7 and len(e_core) >= 7 and (cl_core == e_core):
                issues.append(f"CLINIC CORE NAME MATCH: '{cl}' ('{cl_core}') vs '{existing_cl}' ('{e_core}')")
                break

    # 3. Doctor name check
    norm_doc = re.sub(r'[^a-z0-9]', '', doc.replace("dr", "").replace(".", ""))
    for existing_doc in existing["doctors"]:
        norm_ed = re.sub(r'[^a-z0-9]', '', existing_doc.replace("dr", "").replace(".", ""))
        if len(norm_doc) >= 6 and len(norm_ed) >= 6:
            if norm_doc == norm_ed:
                issues.append(f"EXACT DOCTOR MATCH: '{doc}' vs '{existing_doc}'")
                break

    # 4. Phone check
    p_digits = re.sub(r'[^0-9]', '', str(ph))
    if len(p_digits) >= 10:
        p10 = p_digits[-10:]
        if p10 in existing["phones"]:
            issues.append(f"PHONE ALREADY EXISTS: {p10}")

    # 5. Website check
    if web:
        web_clean = web.lower().replace("https://", "").replace("http://", "").replace("www.", "").strip("/")
        dom = web_clean.split("/")[0]
        if dom and dom in existing["domains"]:
            issues.append(f"WEBSITE DOMAIN ALREADY EXISTS: {dom}")

    return len(issues) == 0, issues

if __name__ == "__main__":
    import sys
    cache = load_all_existing()
    print(f"Loaded existing: {len(cache['emails'])} emails, {len(cache['clinics'])} clinics, {len(cache['doctors'])} doctors, {len(cache['phones'])} phones, {len(cache['domains'])} domains.")
