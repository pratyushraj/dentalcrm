import json
import sqlite3
import csv
import os
import glob
import re

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
RESEND_DUMP_PATH = os.path.join(PROJECT_ROOT, "resend_all_emails_dump.json")
DB_PATH = os.path.join(PROJECT_ROOT, "src", "scripts", "outreach", "dental_leads_master.db")

def main():
    # 1. Load all emails from Resend dump (1,295 emails)
    with open(RESEND_DUMP_PATH, 'r', encoding='utf-8') as f:
        emails = json.load(f)

    # 2. Excluded: Registered users from Supabase
    env_vars = {}
    env_path = os.path.join(PROJECT_ROOT, ".env")
    if os.path.exists(env_path):
        with open(env_path) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    parts = line.split('=', 1)
                    env_vars[parts[0].strip()] = parts[1].strip().strip('\"').strip('\'')

    import urllib.request
    url = env_vars.get('SUPABASE_URL')
    key = env_vars.get('SUPABASE_SERVICE_ROLE_KEY') or env_vars.get('SUPABASE_ANON_KEY')

    signed_up_emails = {
        'trimurtidentalclinic23@gmail.com', 'contact@clinaza.in', 'shreeramdental@gmail.com',
        'pratyushraj18@gmail.com', 'testdoctor@clinaza.in', 'reception@skinsolve.in',
        'reception@anvayacare.in', 'yourdentistpatna@gmail.com', 'shreeram@dentalcare.com'
    }
    if url and key:
        try:
            req = urllib.request.Request(
                f'{url}/auth/v1/admin/users',
                headers={'apikey': key, 'Authorization': f'Bearer {key}'}
            )
            with urllib.request.urlopen(req, timeout=8) as resp:
                users = json.loads(resp.read()).get('users', [])
                for u in users:
                    em = u.get('email')
                    if em:
                        signed_up_emails.add(em.strip().lower())
        except Exception as e:
            print("Notice loading Supabase auth:", e)

    # 3. Excluded: Clicked emails (e.g. WhatsApp, Links)
    clicked_emails = set()
    for e in emails:
        if e.get('last_event') == 'clicked':
            for t in e.get('to', []):
                clicked_emails.add(t.strip().lower())

    # 4. Identified already retargeted today
    retargeted_today = set()
    today_results_path = os.path.join(PROJECT_ROOT, "dispatch_results_retarget_opened.json")
    if os.path.exists(today_results_path):
        with open(today_results_path) as f:
            for r in json.load(f):
                if r.get('status') == 'sent':
                    retargeted_today.add(r['email'].strip().lower())

    # 5. Build Metadata lookup from SQLite DB + JSON files
    meta_lookup = {}
    if os.path.exists(DB_PATH):
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('SELECT email, doctor_name, clinic_name, city, state, specialty FROM leads')
        for row in c.fetchall():
            em = (row[0] or '').strip().lower()
            if em:
                meta_lookup[em] = {
                    'doctor_name': row[1] or '',
                    'clinic_name': row[2] or '',
                    'city': row[3] or '',
                    'state': row[4] or '',
                    'specialty': row[5] or '',
                    'phone': ''
                }
        conn.close()

    # Enrich phones from all json files
    for fpath in glob.glob(os.path.join(PROJECT_ROOT, "*.json")) + glob.glob(os.path.join(PROJECT_ROOT, "src", "scripts", "outreach", "*.json")):
        if 'resend' in fpath or 'package' in fpath:
            continue
        try:
            with open(fpath, 'r', encoding='utf-8') as f:
                d = json.load(f)
                items = d if isinstance(d, list) else (d.get('leads') or d.get('dentists') or d.get('data') or [])
                if isinstance(items, list):
                    for it in items:
                        if isinstance(it, dict):
                            em = (it.get('email') or it.get('Email') or '').strip().lower()
                            if em:
                                phone = it.get('phone') or it.get('Phone') or it.get('mobile') or ''
                                doc = it.get('doctor_name') or it.get('Doctor Name') or it.get('doctor') or ''
                                clinic = it.get('clinic_name') or it.get('Clinic Name') or it.get('clinic') or ''
                                city = it.get('city') or it.get('City') or ''
                                if em not in meta_lookup:
                                    meta_lookup[em] = {'doctor_name': doc, 'clinic_name': clinic, 'city': city, 'state': '', 'specialty': '', 'phone': phone}
                                else:
                                    if phone and not meta_lookup[em]['phone']:
                                        meta_lookup[em]['phone'] = phone
                                    if doc and not meta_lookup[em]['doctor_name']:
                                        meta_lookup[em]['doctor_name'] = doc
                                    if clinic and not meta_lookup[em]['clinic_name']:
                                        meta_lookup[em]['clinic_name'] = clinic
                                    if city and not meta_lookup[em]['city']:
                                        meta_lookup[em]['city'] = city
        except:
            pass

    # 6. Extract only emails who opened, did NOT sign up, and did NOT click
    qualified_leads = []
    seen = set()

    # Process chronologically descending (newest to oldest)
    for e in sorted(emails, key=lambda x: x.get('created_at', ''), reverse=True):
        to = e.get('to', [])
        if not to: continue
        to_addr = to[0].strip().lower()

        if to_addr in seen:
            continue
        seen.add(to_addr)

        if to_addr in signed_up_emails or to_addr in clicked_emails:
            continue

        if e.get('last_event') == 'opened':
            meta = meta_lookup.get(to_addr, {})
            
            doc_name = meta.get('doctor_name') or ''
            clinic_name = meta.get('clinic_name') or ''
            city = meta.get('city') or ''
            
            # If clinic name missing, attempt to extract from email subject
            subj = e.get('subject') or ''
            if not clinic_name and 'at ' in subj:
                clinic_name = subj.split('at ', 1)[1].strip()
            if not doc_name and 'for Dr. ' in subj:
                doc_name = 'Dr. ' + subj.split('for Dr. ', 1)[1].strip()

            if not doc_name:
                doc_name = "Doctor"
            if not clinic_name:
                clinic_name = "Dental Practice"
            if not city:
                city = "India"

            phone = meta.get('phone') or ''
            if phone:
                # normalize phone
                digits = re.sub(r'[^\d+]', '', phone).strip()
                if len(digits) == 10:
                    phone = f"+91 {digits[:5]} {digits[5:]}"
                elif digits.startswith("91") and len(digits) == 12:
                    phone = f"+91 {digits[2:7]} {digits[7:]}"

            lead_obj = {
                "email": to_addr,
                "doctor_name": doc_name if doc_name.startswith("Dr.") or doc_name == "Doctor" else f"Dr. {doc_name}",
                "clinic_name": clinic_name,
                "phone": phone,
                "city": city.title(),
                "state": meta.get('state', '').title(),
                "specialty": meta.get('specialty', 'Dental Care'),
                "last_sent_at": e.get('created_at', ''),
                "subject": subj,
                "retargeted_today": to_addr in retargeted_today
            }
            qualified_leads.append(lead_obj)

    print(f"Total Qualified Opened (No Signup, No WhatsApp Click): {len(qualified_leads)}")
    print(f"Already Retargeted Today: {sum(1 for l in qualified_leads if l['retargeted_today'])}")
    print(f"Awaiting Retargeting: {sum(1 for l in qualified_leads if not l['retargeted_today'])}")

    # 7. Save outputs
    out_json = os.path.join(PROJECT_ROOT, "opened_no_signup_no_whatsapp.json")
    with open(out_json, "w", encoding="utf-8") as f:
        json.dump(qualified_leads, f, indent=2)

    out_csv = os.path.join(PROJECT_ROOT, "opened_no_signup_no_whatsapp.csv")
    with open(out_csv, "w", newline="", encoding="utf-8") as f:
        fields = ["email", "doctor_name", "clinic_name", "phone", "city", "state", "specialty", "last_sent_at", "subject", "retargeted_today"]
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        writer.writerows(qualified_leads)

    print(f"Saved dataset to:")
    print(f"  • JSON: {out_json}")
    print(f"  • CSV:  {out_csv}")

if __name__ == "__main__":
    main()
