import json
import sqlite3
import re
import socket
import os
import csv

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(PROJECT_ROOT, "src", "scripts", "outreach", "dental_leads_master.db")

conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()
cur.execute("SELECT lower(email) FROM leads WHERE email IS NOT NULL")
contacted_emails = set(r[0].strip().lower() for r in cur.fetchall() if r[0])
conn.close()
print(f"Contacted emails in DB: {len(contacted_emails)}")

log_full = "/Users/pratyushraj/.gemini/antigravity/brain/3eba0a15-e044-4121-8ed8-62cea45025d2/.system_generated/logs/transcript_full.jsonl"
raw_leads = []

with open(log_full, "r", encoding="utf-8") as f:
    for line in f:
        try:
            d = json.loads(line)
            content = d.get("content")
            if not content:
                continue
            content_str = str(content)
            if '"clinic_name"' in content_str and '"email"' in content_str:
                blocks = re.findall(r'```json\s*(\[\s*\{.*?\}\s*\])\s*```', content_str, re.DOTALL)
                for b in blocks:
                    try:
                        leads = json.loads(b)
                        if isinstance(leads, list) and len(leads) >= 10:
                            raw_leads.extend(leads)
                            print(f"Parsed block of {len(leads)} leads")
                    except Exception as e:
                        pass
        except Exception:
            pass

print(f"Total raw leads extracted: {len(raw_leads)}")

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

verified = []
seen = set()
dns_cache = {}
duplicates = 0
dns_fails = 0

for item in raw_leads:
    email = (item.get("email") or "").strip().lower()
    if not email or "@" not in email or "." not in email:
        continue
    if not re.match(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$", email):
        continue
    if email in seen or email in contacted_emails:
        duplicates += 1
        continue

    domain = email.split("@")[1]
    if domain not in dns_cache:
        dns_cache[domain] = check_domain_mx(domain)
    if not dns_cache[domain]:
        dns_fails += 1
        continue

    seen.add(email)
    lead = {
        "doctor_name": clean_doctor_name(item.get("doctor_name")),
        "clinic_name": clean_clinic_name(item.get("clinic_name")),
        "email": email,
        "phone": clean_phone(item.get("phone")),
        "city": (item.get("city") or "").strip().title(),
        "state": (item.get("state") or "").strip().title(),
        "specialty": (item.get("specialty") or "Dental Implants & Aligners").strip(),
        "website": (item.get("website") or "").strip()
    }
    verified.append(lead)

print(f"Duplicates filtered against database: {duplicates}")
print(f"DNS failure count filtered: {dns_fails}")
print(f"FINAL FRESH, VERIFIED LEADS: {len(verified)}")

out_json = os.path.join(PROJECT_ROOT, "fresh_uncontacted_dentists_oct30.json")
with open(out_json, "w", encoding="utf-8") as f:
    json.dump(verified, f, indent=2, ensure_ascii=False)

out_csv = os.path.join(PROJECT_ROOT, "fresh_uncontacted_dentists_oct30.csv")
with open(out_csv, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["doctor_name", "clinic_name", "email", "phone", "city", "state", "specialty", "website"])
    writer.writeheader()
    writer.writerows(verified)

print(f"Successfully saved to {out_json} and {out_csv}!")
