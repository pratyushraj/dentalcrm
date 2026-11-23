import os
import re
import json
import glob
import sqlite3
import csv
from datetime import datetime

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
DB_PATH = os.path.join(PROJECT_ROOT, "src", "scripts", "outreach", "dental_leads_master.db")
OUTPUT_DESKTOP_CSV = "/Users/pratyushraj/Desktop/Clinaza_Opened_Emails_Master.csv"
OUTPUT_CLICKERS_CSV = "/Users/pratyushraj/Desktop/Clinaza_High_Intent_Clickers.csv"
OUTPUT_PUBLIC_CSV = os.path.join(PROJECT_ROOT, "public", "docs", "clinaza_opened_emails_master.csv")

def main():
    print("=== SCRAPING ALL CLINIC EMAILS THAT OPENED OUR CAMPAIGNS ===")

    # 1. Gather all email events from Resend MCP steps + Dumps
    opened_map = {} # email -> record dict

    # MCP Step files
    step_pattern = re.compile(
        r'- To:\s*([^|]+)\|\s*Subject:\s*\"([^\"]*)\"\s*\|\s*Status:\s*([^|]+)\|\s*Sent:\s*([^|]+)\|\s*Message ID:\s*([^|]+)\|\s*ID:\s*([a-f0-9-]+)',
        re.IGNORECASE
    )

    steps_dir = os.path.join(os.path.expanduser("~"), ".gemini", "antigravity", "brain", "3eba0a15-e044-4121-8ed8-62cea45025d2", ".system_generated", "steps")
    step_files = glob.glob(os.path.join(steps_dir, "*", "output.txt"))

    print(f"Scanning {len(step_files)} MCP step output files...")
    for sf in step_files:
        try:
            with open(sf, 'r', encoding='utf-8', errors='ignore') as f:
                for line in f:
                    m = step_pattern.search(line)
                    if m:
                        em = m.group(1).strip().lower()
                        subj = m.group(2).strip()
                        status = m.group(3).strip().lower()
                        sent_at = m.group(4).strip()
                        eid = m.group(6).strip()

                        if status in ('opened', 'clicked'):
                            if em not in opened_map:
                                opened_map[em] = {
                                    'email': em,
                                    'status': status.upper(),
                                    'subject': subj,
                                    'sent_at': sent_at,
                                    'resend_id': eid,
                                    'source': 'Live Resend API (Nov 2026)'
                                }
                            elif status == 'clicked':
                                opened_map[em]['status'] = 'CLICKED'
        except Exception:
            pass

    # 2. Resend dump from Oct 28
    dump_path = os.path.join(PROJECT_ROOT, "resend_all_emails_dump.json")
    if os.path.exists(dump_path):
        with open(dump_path, 'r', encoding='utf-8', errors='ignore') as f:
            dump_data = json.load(f)
            for item in dump_data:
                st = (item.get('last_event') or '').lower()
                if st in ('opened', 'clicked'):
                    for t in (item.get('to') or []):
                        em = t.strip().lower()
                        if em:
                            if em not in opened_map:
                                opened_map[em] = {
                                    'email': em,
                                    'status': st.upper(),
                                    'subject': item.get('subject') or '',
                                    'sent_at': item.get('created_at') or '',
                                    'resend_id': item.get('id') or '',
                                    'source': 'Historical Resend Log (Oct 2026)'
                                }
                            elif st == 'clicked':
                                opened_map[em]['status'] = 'CLICKED'

    print(f"Total unique opened/clicked emails captured: {len(opened_map)}")

    # 3. Build rich metadata dictionary
    # A. SQLite DB
    meta_db = {}
    if os.path.exists(DB_PATH):
        try:
            conn = sqlite3.connect(DB_PATH)
            c = conn.cursor()
            c.execute("SELECT email, doctor_name, clinic_name, city, state, specialty FROM leads")
            for row in c.fetchall():
                em = (row[0] or '').strip().lower()
                if em:
                    meta_db[em] = {
                        'doctor_name': row[1] or '',
                        'clinic_name': row[2] or '',
                        'city': row[3] or '',
                        'state': row[4] or '',
                        'specialty': row[5] or ''
                    }
            conn.close()
            print(f"Indexed {len(meta_db)} leads from SQLite DB.")
        except Exception as e:
            print("Notice on SQLite lookup:", e)

    # B. Phone and Lead Maps from all project JSONs
    json_leads = {}
    for root, dirs, files in os.walk(PROJECT_ROOT):
        if any(skip in root for skip in ['node_modules', '.git', '.next', 'dist', 'build']):
            continue
        for f in files:
            if f.endswith('.json') and not f.startswith('package'):
                fpath = os.path.join(root, f)
                try:
                    with open(fpath, 'r', encoding='utf-8', errors='ignore') as fp:
                        data = json.load(fp)
                        items = data if isinstance(data, list) else (data.get('leads') or data.get('dentists') or data.get('data') or [])
                        if isinstance(items, list):
                            for it in items:
                                if isinstance(it, dict):
                                    em = (it.get('email') or it.get('Email') or '').strip().lower()
                                    if em:
                                        if em not in json_leads:
                                            json_leads[em] = {}
                                        
                                        doc = (it.get('doctor_name') or it.get('doctor') or it.get('Name') or it.get('name') or '').strip()
                                        cln = (it.get('clinic_name') or it.get('clinic') or it.get('Clinic') or '').strip()
                                        cty = (it.get('city') or it.get('City') or '').strip()
                                        stt = (it.get('state') or it.get('State') or '').strip()
                                        phn = (it.get('phone') or it.get('Phone') or it.get('contact') or it.get('mobile') or '').strip()
                                        spc = (it.get('specialty') or it.get('Specialty') or '').strip()

                                        if doc and not json_leads[em].get('doctor_name'):
                                            json_leads[em]['doctor_name'] = doc
                                        if cln and not json_leads[em].get('clinic_name'):
                                            json_leads[em]['clinic_name'] = cln
                                        if cty and not json_leads[em].get('city'):
                                            json_leads[em]['city'] = cty
                                        if stt and not json_leads[em].get('state'):
                                            json_leads[em]['state'] = stt
                                        if phn and not json_leads[em].get('phone'):
                                            json_leads[em]['phone'] = phn
                                        if spc and not json_leads[em].get('specialty'):
                                            json_leads[em]['specialty'] = spc
                except Exception:
                    pass

    print(f"Indexed metadata for {len(json_leads)} emails from project JSONs.")

    # 4. Enrich opened records
    enriched_records = []
    clickers_list = []

    for em, rec in opened_map.items():
        db_info = meta_db.get(em, {})
        json_info = json_leads.get(em, {})

        doc = db_info.get('doctor_name') or json_info.get('doctor_name') or ''
        cln = db_info.get('clinic_name') or json_info.get('clinic_name') or ''
        cty = db_info.get('city') or json_info.get('city') or ''
        stt = db_info.get('state') or json_info.get('state') or ''
        phn = json_info.get('phone') or ''
        spc = db_info.get('specialty') or json_info.get('specialty') or ''

        # If doctor name is still empty, try extracting from subject line
        # e.g. "quick question on refractive surgery conversions for Dr. Pradeep Kothari"
        if not doc and rec['subject']:
            m_doc = re.search(r'for\s+(Dr\.\s*[^"|,\n]+)', rec['subject'], re.IGNORECASE)
            if m_doc:
                doc = m_doc.group(1).strip()

        # Categorize Specialty from subject if empty
        if not spc and rec['subject']:
            s_lower = rec['subject'].lower()
            if 'refractive' in s_lower or 'eye' in s_lower or 'lasik' in s_lower:
                spc = 'Ophthalmology / Eye Surgery'
            elif 'ivf' in s_lower or 'fertility' in s_lower:
                spc = 'IVF / Reproductive Medicine'
            elif 'dental' in s_lower or 'implant' in s_lower or 'aligner' in s_lower:
                spc = 'Dental Practice'
            else:
                spc = 'Healthcare Practice'
        elif not spc:
            spc = 'Dental Practice'

        # Infer clinic from email domain if missing
        if not cln and '@' in em:
            domain = em.split('@')[1]
            if domain not in ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'rediffmail.com', 'yahoo.co.in']:
                cln = domain.split('.')[0].replace('-', ' ').title() + " Clinic"

        final_entry = {
            'Email': em,
            'Status': rec['status'],
            'Doctor Name': doc if doc else "Doctor / Medical Director",
            'Clinic Name': cln if cln else "Partner Clinic",
            'Phone / WhatsApp': phn if phn else "-",
            'City': cty if cty else "India",
            'State': stt if stt else "-",
            'Specialty': spc,
            'Last Email Subject': rec['subject'],
            'Sent / Engagement Date': rec['sent_at'],
            'Source': rec['source'],
            'Resend Message ID': rec['resend_id']
        }

        enriched_records.append(final_entry)
        if rec['status'] == 'CLICKED':
            clickers_list.append(final_entry)

    # Sort: Clicked first, then by date descending
    enriched_records.sort(key=lambda x: (0 if x['Status'] == 'CLICKED' else 1, x['Sent / Engagement Date']), reverse=False)

    # 5. Export CSV files
    fieldnames = [
        'Email', 'Status', 'Doctor Name', 'Clinic Name', 'Phone / WhatsApp',
        'City', 'State', 'Specialty', 'Last Email Subject',
        'Sent / Engagement Date', 'Source', 'Resend Message ID'
    ]

    os.makedirs(os.path.dirname(OUTPUT_PUBLIC_CSV), exist_ok=True)

    for out_path in [OUTPUT_DESKTOP_CSV, OUTPUT_PUBLIC_CSV]:
        with open(out_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(enriched_records)
        print(f"Exported Master CSV: {out_path} ({len(enriched_records)} rows)")

    with open(OUTPUT_CLICKERS_CSV, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(clickers_list)
    print(f"Exported High-Intent Clickers CSV: {OUTPUT_CLICKERS_CSV} ({len(clickers_list)} rows)")

    # 6. Summary Statistics
    print("\n" + "="*50)
    print("CAMPAIGN ENGAGEMENT ANALYTICS")
    print("="*50)
    print(f"Total Unique Clinics That Opened / Clicked: {len(enriched_records)}")
    print(f"  🔥 High-Intent Clickers (Visited Website / WhatsApp): {len(clickers_list)}")
    print(f"  👀 Email Openers: {len(enriched_records) - len(clickers_list)}")

    # Specialty Breakdown
    spec_counts = {}
    for r in enriched_records:
        s = r['Specialty']
        spec_counts[s] = spec_counts.get(s, 0) + 1
    print("\nSpecialty Breakdown:")
    for s, c in sorted(spec_counts.items(), key=lambda x: x[1], reverse=True):
        print(f"  • {s}: {c} clinics")

if __name__ == "__main__":
    main()
