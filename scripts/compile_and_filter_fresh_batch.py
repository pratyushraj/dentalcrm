import json
import sqlite3
import re
import socket
import os
import csv
import sys

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(PROJECT_ROOT, "src", "scripts", "outreach", "dental_leads_master.db")

sys.path.insert(0, os.path.join(PROJECT_ROOT, "scripts"))
from lead_filter import evaluate_lead

# 1. Load existing contacted emails in DB
conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()
cur.execute("SELECT lower(email) FROM leads WHERE email IS NOT NULL")
contacted_emails = set(r[0].strip().lower() for r in cur.fetchall() if r[0])
conn.close()
print(f"Existing contacted emails in DB: {len(contacted_emails)}")

# 2. Extract leads from parent messages
parent_log = "/Users/pratyushraj/.gemini/antigravity/brain/3eba0a15-e044-4121-8ed8-62cea45025d2/.system_generated/logs/transcript_full.jsonl"
sids = {
    "45fda3ec-5df2-4473-a268-1803d3e1eebb": "North India",
    "cf0b41fc-fc28-4d92-92d3-4e941619129e": "Western India",
    "e3faa13f-8d22-4dcc-b1e3-6ba75778df39": "South India",
    "2725a7e1-825e-4348-811e-1ffce8fbccd3": "Central & East India"
}

raw_leads = []
with open(parent_log, "r", encoding="utf-8") as f:
    for line in f:
        try:
            d = json.loads(line)
            content = str(d.get("content", ""))
            for sid, region in sids.items():
                if sid in content and "```json" in content:
                    match = re.search(r"```json\s*(\[\s*\{.*?\}\s*\])\s*```", content, re.DOTALL)
                    if match:
                        leads = json.loads(match.group(1))
                        if len(leads) > 10:
                            for l in leads:
                                l["region"] = region
                            raw_leads.extend(leads)
                            print(f"[{region}] Extracted {len(leads)} leads")
        except Exception:
            pass

print(f"\nTotal raw leads harvested: {len(raw_leads)}")

def check_domain_mx(domain):
    try:
        socket.gethostbyname(domain)
        return True
    except Exception:
        return False

verified_leads = []
seen_emails = set()
dns_cache = {}

filter_stats = {
    "db_duplicates": 0,
    "internal_duplicates": 0,
    "underwriting_rejected": 0,
    "dns_invalid": 0
}

filtered_out_details = []

for lead in raw_leads:
    email = (lead.get("email") or "").strip().lower()
    
    # Email syntax validation
    if not email or "@" not in email or "." not in email:
        filter_stats["dns_invalid"] += 1
        continue
    if not re.match(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$", email):
        filter_stats["dns_invalid"] += 1
        continue
    
    # Internal deduplication
    if email in seen_emails:
        filter_stats["internal_duplicates"] += 1
        continue
    
    # DB deduplication
    if email in contacted_emails:
        filter_stats["db_duplicates"] += 1
        continue

    # 3. Clinical & Locational Underwriting Filter
    passed, reason, tier = evaluate_lead(lead)
    if not passed:
        filter_stats["underwriting_rejected"] += 1
        filtered_out_details.append(f"{lead.get('clinic_name')} ({lead.get('city')}) -> {reason}")
        continue

    # 4. DNS Check
    domain = email.split("@")[1]
    if domain not in dns_cache:
        dns_cache[domain] = check_domain_mx(domain)
    if not dns_cache[domain]:
        filter_stats["dns_invalid"] += 1
        continue

    seen_emails.add(email)
    lead["email"] = email
    lead["tier"] = tier
    verified_leads.append(lead)

print("\n--- UNDERWRITING & FILTERING AUDIT ---")
print(f"Raw leads harvested: {len(raw_leads)}")
print(f"Duplicates already in DB (1,948 contacted): {filter_stats['db_duplicates']}")
print(f"Internal duplicate entries: {filter_stats['internal_duplicates']}")
print(f"Underwriting & Clinical Exclusions: {filter_stats['underwriting_rejected']}")
for detail in filtered_out_details:
    print(f"   [FILTERED] {detail}")
print(f"Invalid Email / DNS failures: {filter_stats['dns_invalid']}")
print(f"\nFinal Qualified, Underwritten & Verified Leads: {len(verified_leads)}")

# Summary by Tier and Region
tier_counts = {}
region_counts = {}
for l in verified_leads:
    tier_counts[l["tier"]] = tier_counts.get(l["tier"], 0) + 1
    region_counts[l["region"]] = region_counts.get(l["region"], 0) + 1

print("\n--- BREAKDOWN BY CREDIT & SPECIALTY TIER ---")
for t, c in tier_counts.items():
    print(f"  {t}: {c}")

print("\n--- BREAKDOWN BY REGION ---")
for r, c in region_counts.items():
    print(f"  {r}: {c}")

# Save to JSON and CSV
json_out = os.path.join(PROJECT_ROOT, "fresh_underwritten_leads_batch.json")
csv_out = os.path.join(PROJECT_ROOT, "fresh_underwritten_leads_batch.csv")

with open(json_out, "w", encoding="utf-8") as f:
    json.dump(verified_leads, f, indent=2, ensure_ascii=False)

fields = ["doctor_name", "clinic_name", "email", "phone", "city", "state", "specialty", "tier", "region", "website"]
with open(csv_out, "w", encoding="utf-8", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=fields)
    writer.writeheader()
    for l in verified_leads:
        writer.writerow({k: l.get(k, "") for k in fields})

print(f"\nSuccessfully written to:")
print(f"  - {json_out}")
print(f"  - {csv_out}")
