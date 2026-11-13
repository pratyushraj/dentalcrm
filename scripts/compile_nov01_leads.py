import json
import os
import re
import sqlite3
import socket
import csv
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import lead_filter

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(PROJECT_ROOT, "src", "scripts", "outreach", "dental_leads_master.db")
OUTPUT_JSON = os.path.join(PROJECT_ROOT, "fresh_underwritten_leads_batch_nov01.json")
OUTPUT_CSV = os.path.join(PROJECT_ROOT, "fresh_underwritten_leads_batch_nov01.csv")

PARENT_TRANSCRIPT = "/Users/pratyushraj/.gemini/antigravity/brain/3eba0a15-e044-4121-8ed8-62cea45025d2/.system_generated/logs/transcript_full.jsonl"
SUBAGENT_IDS = [
    "78ff849c-84c4-4a8b-97b6-f06c737773a3", # North / NCR
    "1f645247-47ef-4546-8884-b9958dca8a5d", # Mumbai / Pune / Goa
    "c58de166-2fac-4b0d-b442-3894e256bef9", # South Tech
    "1f69ab1c-6ad1-4c71-bf0a-146c2750d8e9"  # Gujarat / Central
]

def extract_leads_from_transcript():
    all_leads = []
    seen_subagents = set()
    
    with open(PARENT_TRANSCRIPT, "r") as f:
        for line in f:
            try:
                data = json.loads(line)
                content = data.get("content", "")
                for sid in SUBAGENT_IDS:
                    if sid in content and "```json" in content:
                        start = content.find("```json") + 7
                        end = content.find("```", start)
                        if end != -1:
                            json_str = content[start:end].strip()
                            try:
                                parsed = json.loads(json_str)
                                if isinstance(parsed, list) and len(parsed) > 10:
                                    print(f"Loaded {len(parsed)} leads from subagent {sid}")
                                    all_leads.extend(parsed)
                                    seen_subagents.add(sid)
                            except Exception as e:
                                pass
            except:
                pass
    return all_leads

def load_oct31_uncontacted():
    oct31_path = os.path.join(PROJECT_ROOT, "fresh_underwritten_leads_batch.json")
    if not os.path.exists(oct31_path):
        return []
    with open(oct31_path) as f:
        data = json.load(f)
    print(f"Loaded {len(data)} leads from Oct 31 batch queue")
    return data

def get_existing_db_emails():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT LOWER(TRIM(email)) FROM leads WHERE email IS NOT NULL")
    existing = set(row[0] for row in cursor.fetchall())
    conn.close()
    return existing

mx_cache = {}
def has_mx_record(domain):
    if domain in mx_cache:
        return mx_cache[domain]
    try:
        import dns.resolver
        answers = dns.resolver.resolve(domain, 'MX')
        res = len(answers) > 0
    except Exception:
        # Fallback to gethostbyname
        try:
            socket.gethostbyname(domain)
            res = True
        except:
            res = False
    mx_cache[domain] = res
    return res

def main():
    print("--- COMPILING FRESH UNDERWRITTEN LEADS ---")
    raw_leads = extract_leads_from_transcript()
    oct31_leads = load_oct31_uncontacted()
    
    combined_raw = raw_leads + oct31_leads
    print(f"Total raw candidates collected: {len(combined_raw)}")
    
    db_emails = get_existing_db_emails()
    print(f"Existing DB emails to deduplicate against: {len(db_emails)}")
    
    seen_emails = set()
    qualified_leads = []
    disqualified_count = 0
    duplicate_count = 0
    dns_fail_count = 0
    
    for lead in combined_raw:
        email = (lead.get("email") or "").strip().lower()
        if not email or "@" not in email:
            continue
            
        # Deduplication
        if email in seen_emails or email in db_emails:
            duplicate_count += 1
            continue
            
        # Underwriting filter
        is_qual, reason, tier = lead_filter.evaluate_lead(lead)
        if not is_qual:
            disqualified_count += 1
            print(f"Disqualified: {lead.get('clinic_name')} ({email}) -> {reason}")
            continue
            
        # MX Verification
        domain = email.split("@")[1]
        if not has_mx_record(domain):
            dns_fail_count += 1
            print(f"DNS MX Failed: {email}")
            continue
            
        seen_emails.add(email)
        lead["underwriting_tier"] = tier
        qualified_leads.append(lead)
        
    print(f"\nResults:")
    print(f"Total Qualified & Verified Fresh Leads: {len(qualified_leads)}")
    print(f"Duplicates Removed: {duplicate_count}")
    print(f"Disqualified by Underwriting: {disqualified_count}")
    print(f"DNS Failures: {dns_fail_count}")
    
    # Save JSON
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(qualified_leads, f, indent=2)
    print(f"Saved JSON to: {OUTPUT_JSON}")
    
    # Save CSV
    if qualified_leads:
        keys = ["doctor_name", "clinic_name", "email", "phone", "city", "state", "specialty", "underwriting_tier", "website"]
        with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=keys, extrasaction="ignore")
            writer.writeheader()
            for row in qualified_leads:
                writer.writerow(row)
        print(f"Saved CSV to: {OUTPUT_CSV}")

if __name__ == "__main__":
    main()
