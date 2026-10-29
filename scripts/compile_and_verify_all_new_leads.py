import json
import sqlite3
import csv
import re
import socket
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
DB_PATH = os.path.join(PROJECT_ROOT, "src", "scripts", "outreach", "dental_leads_master.db")
RESEND_DUMP_PATH = os.path.join(PROJECT_ROOT, "resend_all_emails_dump.json")

def clean_doctor_name(name):
    if not name or not isinstance(name, str):
        return "Doctor"
    name = re.sub(r'["\']', '', name).strip()
    if not name.startswith("Dr.") and not name.startswith("Dr "):
        name = f"Dr. {name}"
    return name.replace("Dr ", "Dr. ").strip()

def clean_clinic_name(name):
    if not name or not isinstance(name, str):
        return "Dental Practice"
    name = re.sub(r'["\']', '', name).strip()
    # Strip any trailing dash or city if attached awkwardly
    name = re.sub(r'\s*-\s*(Mumbai|Delhi|Bengaluru|Pune|Chennai|Hyderabad|Kolkata|Ahmedabad|Jaipur|Surat)$', '', name, flags=re.I).strip()
    return name

def clean_phone(phone):
    if not phone or not isinstance(phone, str):
        return ""
    digits = re.sub(r'[^\d+]', '', phone).strip()
    if digits.startswith("91") and len(digits) == 12:
        return f"+91 {digits[2:7]} {digits[7:]}"
    if len(digits) == 10:
        return f"+91 {digits[:5]} {digits[5:]}"
    if digits.startswith("+91") and len(digits) == 13:
        return f"+91 {digits[3:8]} {digits[8:]}"
    return phone.strip()

def check_domain_mx(domain):
    try:
        socket.gethostbyname(domain)
        return True
    except Exception:
        return False

def main():
    print("==================================================")
    print("Compiling & Verifying Fresh Indian Dental Clinic Leads...")
    print("==================================================")

    # 1. Load contacted emails from SQLite master database
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("SELECT lower(email) FROM leads WHERE email IS NOT NULL")
    contacted_emails = set(r[0].strip().lower() for r in cur.fetchall() if r[0])
    conn.close()
    print(f"Master Database Contacted Emails: {len(contacted_emails)}")

    # 2. Load suppressed/bounced emails from Resend dump
    bounced_emails = set()
    if os.path.exists(RESEND_DUMP_PATH):
        try:
            with open(RESEND_DUMP_PATH, 'r', encoding='utf-8') as f:
                dump = json.load(f)
                emails = dump.get('data', []) if isinstance(dump, dict) else dump
                for em in emails:
                    if isinstance(em, dict):
                        # check if bounced or complained
                        if em.get('last_event') in ['bounced', 'complained', 'delivery_delayed']:
                            to_list = em.get('to', [])
                            for t in to_list:
                                bounced_emails.add(t.strip().lower())
        except Exception as e:
            print("Notice loading resend dump:", e)
    print(f"Resend Bounced/Suppressed Emails: {len(bounced_emails)}")

    # Exclusions
    excluded_emails = contacted_emails.union(bounced_emails)

    # 3. Load regional scout JSON files
    source_files = [
        ("North", os.path.join(PROJECT_ROOT, "fresh_north_dentists.json")),
        ("West", os.path.join(PROJECT_ROOT, "fresh_west_dentists.json")),
        ("South", os.path.join(PROJECT_ROOT, "fresh_south_dentists.json")),
        ("Central/East", os.path.join(PROJECT_ROOT, "fresh_central_east_dentists.json"))
    ]

    raw_leads = []
    for region, fpath in source_files:
        if os.path.exists(fpath):
            with open(fpath, 'r', encoding='utf-8') as f:
                leads = json.load(f)
                for l in leads:
                    l['region'] = region
                raw_leads.extend(leads)
                print(f"Loaded {len(leads)} leads from {region} ({os.path.basename(fpath)})")
        else:
            print(f"Warning: {fpath} not found!")

    print(f"\nTotal Raw Leads Sourced: {len(raw_leads)}")

    # 4. Filter, Deduplicate & Verify
    verified_leads = []
    seen_in_batch = set()
    rejected_duplicates = 0
    rejected_format = 0
    rejected_dns = 0

    dns_cache = {}

    for item in raw_leads:
        email = (item.get('email') or '').strip().lower()
        if not email or '@' not in email or '.' not in email:
            rejected_format += 1
            continue
        
        # Check RFC basic syntax
        if not re.match(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$", email):
            rejected_format += 1
            continue

        if email in seen_in_batch or email in excluded_emails:
            rejected_duplicates += 1
            continue

        domain = email.split('@')[1]
        if domain not in dns_cache:
            dns_cache[domain] = check_domain_mx(domain)

        if not dns_cache[domain]:
            rejected_dns += 1
            continue

        seen_in_batch.add(email)

        lead = {
            "doctor_name": clean_doctor_name(item.get("doctor_name")),
            "clinic_name": clean_clinic_name(item.get("clinic_name")),
            "email": email,
            "phone": clean_phone(item.get("phone")),
            "city": (item.get("city") or "").strip().title(),
            "state": (item.get("state") or "").strip().title(),
            "region": item.get("region"),
            "specialty": (item.get("specialty") or "General & Restorative Dentistry").strip(),
            "website": (item.get("website") or "").strip()
        }
        verified_leads.append(lead)

    print(f"\n--- Verification & Filtering Results ---")
    print(f"Verified Fresh Leads: {len(verified_leads)}")
    print(f"Rejected Duplicates (Existing DB / Resend): {rejected_duplicates}")
    print(f"Rejected Invalid Email Format: {rejected_format}")
    print(f"Rejected Failed DNS Resolution: {rejected_dns}")

    # 5. Save verified outputs
    out_json = os.path.join(PROJECT_ROOT, "fresh_verified_dental_leads_pool.json")
    with open(out_json, "w", encoding="utf-8") as f:
        json.dump(verified_leads, f, indent=2)

    out_csv = os.path.join(PROJECT_ROOT, "fresh_verified_dental_leads_pool.csv")
    with open(out_csv, "w", newline="", encoding="utf-8") as f:
        fields = ["doctor_name", "clinic_name", "email", "phone", "city", "state", "region", "specialty", "website"]
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        writer.writerows(verified_leads)

    print(f"\nSuccessfully saved verified leads to:")
    print(f"  • JSON: {out_json}")
    print(f"  • CSV:  {out_csv}")

    # 6. City & Specialty Breakdown
    city_counts = {}
    specialty_counts = {}
    for l in verified_leads:
        c = l['city']
        city_counts[c] = city_counts.get(c, 0) + 1
        spec = l['specialty']
        specialty_counts[spec] = specialty_counts.get(spec, 0) + 1

    print("\nTop 15 Cities Covered:")
    for city, count in sorted(city_counts.items(), key=lambda x: x[1], reverse=True)[:15]:
        print(f"  • {city}: {count} clinics")

    print(f"\nTotal Unique Cities Covered: {len(city_counts)}")
    print("==================================================")

if __name__ == "__main__":
    main()
