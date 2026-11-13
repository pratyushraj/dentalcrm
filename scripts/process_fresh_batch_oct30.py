import json
import sqlite3
import re
import socket
import os
import glob

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
DB_PATH = os.path.join(PROJECT_ROOT, "src", "scripts", "outreach", "dental_leads_master.db")

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

def extract_leads_from_logs():
    subagent_cids = [
        "14afc5f9-2ca6-49f6-8a82-23b86025d07e",
        "73c95ec8-8fcb-41c9-9cfd-a14c56792b3d",
        "d15e4c26-ba13-467f-b60f-1f7477308c4f"
    ]
    raw_leads = []
    for cid in subagent_cids:
        log_full = f"/Users/pratyushraj/.gemini/antigravity/brain/{cid}/.system_generated/logs/transcript_full.jsonl"
        log_compact = f"/Users/pratyushraj/.gemini/antigravity/brain/{cid}/.system_generated/logs/transcript.jsonl"
        
        path_to_read = log_full if os.path.exists(log_full) else log_compact
        if not os.path.exists(path_to_read):
            continue
            
        with open(path_to_read, 'r', encoding='utf-8') as f:
            for line in f:
                try:
                    d = json.loads(line)
                    # Check text content for JSON blocks
                    content = d.get("content", "") or ""
                    # Also check tool_calls if any
                    for tc in d.get("tool_calls", []):
                        if tc.get("function", {}).get("name") == "send_message":
                            content += " " + tc.get("function", {}).get("arguments", {}).get("Message", "")
                    
                    if "clinic_name" in content and "email" in content:
                        # find json array
                        matches = re.findall(r'\[\s*\{.*?\}\s*\]', content, re.DOTALL)
                        for m in matches:
                            try:
                                parsed = json.loads(m)
                                if isinstance(parsed, list):
                                    raw_leads.extend(parsed)
                            except Exception:
                                pass
                except Exception:
                    pass
    return raw_leads

def process():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("SELECT lower(email) FROM leads WHERE email IS NOT NULL")
    contacted_emails = set(r[0].strip().lower() for r in cur.fetchall() if r[0])
    conn.close()

    raw_leads = extract_leads_from_logs()
    print(f"Total raw leads extracted from subagents: {len(raw_leads)}")

    verified = []
    seen = set()
    dns_cache = {}

    for item in raw_leads:
        email = (item.get("email") or "").strip().lower()
        if not email or "@" not in email or "." not in email:
            continue
        if not re.match(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$", email):
            continue
        if email in seen or email in contacted_emails:
            continue

        domain = email.split("@")[1]
        if domain not in dns_cache:
            dns_cache[domain] = check_domain_mx(domain)
        if not dns_cache[domain]:
            continue

        seen.add(email)
        verified.append({
            "doctor_name": clean_doctor_name(item.get("doctor_name")),
            "clinic_name": clean_clinic_name(item.get("clinic_name")),
            "email": email,
            "phone": clean_phone(item.get("phone")),
            "city": (item.get("city") or "").strip().title(),
            "state": (item.get("state") or "").strip().title(),
            "specialty": (item.get("specialty") or "Dental Implants & Aligners").strip(),
            "website": (item.get("website") or "").strip()
        })

    print(f"Total FRESH, deduplicated & verified leads: {len(verified)}")
    out_path = os.path.join(PROJECT_ROOT, "fresh_uncontacted_dentists_oct30.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(verified, f, indent=2, ensure_ascii=False)
    print(f"Saved to {out_path}")
    return verified

if __name__ == "__main__":
    process()
