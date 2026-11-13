import json
import os
import sqlite3
import sys
import csv

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(PROJECT_ROOT, "src", "scripts", "outreach", "dental_leads_master.db")
OUTPUT_JSON = os.path.join(PROJECT_ROOT, "fresh_underwritten_leads_batch_nov13.json")
OUTPUT_CSV = os.path.join(PROJECT_ROOT, "fresh_underwritten_leads_batch_nov13.csv")

EXCLUDED_CHAINS = [
    "clove", "sabka dentist", "apollo dental", "axiss", "orthosquare", 
    "dentzz", "myoms", "partha dental", "dr batra", "expertrons"
]
EXCLUDED_KEYWORDS = [
    "pediatric only", "charitable", "rotary", "lions club", "trust", 
    "hospital & college", "dental college", "government", "municipal"
]

def load_master_sent_emails():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT lower(email) FROM leads")
    emails = set(r[0].strip() for r in c.fetchall() if r[0])
    conn.close()
    return emails

def main():
    sent_emails = load_master_sent_emails()
    print(f"Loaded {len(sent_emails)} previously sent/disqualified emails from master DB.")

    input_files = [
        os.path.join(PROJECT_ROOT, "scripts", "fresh_leads_north_nov13.json"),
        os.path.join(PROJECT_ROOT, "scripts", "fresh_leads_west_mumbai_pune_nov13.json"),
        os.path.join(PROJECT_ROOT, "scripts", "fresh_leads_south_nov13.json"),
        os.path.join(PROJECT_ROOT, "scripts", "fresh_leads_central_east_nov13.json"),
    ]

    # Also load the 20 reserve leads from nov12 if available
    reserve_file = os.path.join(PROJECT_ROOT, "fresh_underwritten_leads_batch_nov12.json")
    all_raw_leads = []

    if os.path.exists(reserve_file):
        try:
            with open(reserve_file, "r", encoding="utf-8") as f:
                res_leads = json.load(f)
                res_clean = [l for l in res_leads if l.get("email", "").strip().lower() not in sent_emails]
                print(f"Loaded {len(res_clean)} unsent reserve leads from Nov 12 batch.")
                all_raw_leads.extend(res_clean)
        except Exception as e:
            print(f"Error loading reserve file: {e}")

    for fp in input_files:
        if os.path.exists(fp):
            try:
                with open(fp, "r", encoding="utf-8") as f:
                    leads = json.load(f)
                    print(f"Loaded {len(leads)} leads from {os.path.basename(fp)}")
                    all_raw_leads.extend(leads)
            except Exception as e:
                print(f"Error loading {fp}: {e}")
        else:
            print(f"Waiting for {os.path.basename(fp)} to be generated...")

    unique_fresh_leads = []
    seen = set()

    for lead in all_raw_leads:
        em = lead.get("email", "").strip().lower()
        if not em or "@" not in em or "." not in em.split("@")[-1]:
            continue
        if em in sent_emails:
            continue
        if em in seen:
            continue

        cname = lead.get("clinic_name", "").lower()
        spec = lead.get("specialty", "").lower()
        doc = lead.get("doctor_name", "").lower()

        if any(chain in cname or chain in doc for chain in EXCLUDED_CHAINS):
            continue
        if any(kw in cname or kw in spec for kw in EXCLUDED_KEYWORDS):
            continue

        seen.add(em)
        unique_fresh_leads.append(lead)

    print(f"\n==========================================")
    print(f"Total Unique Fresh Uncontacted Leads: {len(unique_fresh_leads)}")
    print(f"==========================================")

    # City breakdown
    cities = {}
    for l in unique_fresh_leads:
        city = l.get("city", "Unknown")
        cities[city] = cities.get(city, 0) + 1

    print("\nGeographic distribution:")
    for city, count in sorted(cities.items(), key=lambda x: x[1], reverse=True)[:20]:
        print(f"  - {city}: {count}")

    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(unique_fresh_leads, f, indent=2)
    print(f"\nSaved clean verified batch JSON to: {OUTPUT_JSON}")

    # Also save CSV
    if unique_fresh_leads:
        keys = ["doctor_name", "clinic_name", "email", "phone", "city", "state", "specialty", "website"]
        with open(OUTPUT_CSV, "w", encoding="utf-8", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=keys, extrasaction="ignore")
            writer.writeheader()
            writer.writerows(unique_fresh_leads)
        print(f"Saved clean verified batch CSV to: {OUTPUT_CSV}")

if __name__ == "__main__":
    main()
