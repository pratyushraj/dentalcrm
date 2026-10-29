import json
import time
import os
import re
import urllib.request
import sqlite3
from datetime import datetime

API_KEY = os.environ.get("RESEND_API_KEY", "")
SENDER = "Pratyush Raj <contact@clinaza.in>"
DB_PATH = "src/scripts/outreach/dental_leads_master.db"
QUEUE_PATH = "fresh_uncontacted_dentists_oct29.json"

HTML_TEMPLATE = """<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 20px; background: #f8fafc;">
  <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 28px 24px;">
    <p style="font-size: 15px; margin-bottom: 16px;">Hi {doctor_name},</p>
    <p style="font-size: 14px; color: #334155; margin-bottom: 14px;">Noticed your practice at <strong>{clinic_name}</strong> in {city}—great work.</p>
    <p style="font-size: 14px; color: #334155; margin-bottom: 14px;">Quick question: how often do patients hesitate or delay treatments like implants, crowns, or aligners simply because paying ₹40,000–₹1,50,000 upfront isn’t feasible for them?</p>
    <p style="font-size: 14px; color: #334155; margin-bottom: 14px;">At <strong>Clinaza</strong>, we help dental clinics convert those hesitant consults by offering <strong>instant, paperless patient EMI financing</strong> (powered by 55+ RBI-regulated banks & NBFCs):</p>
    
    <div style="background: #f0f9ff; border-left: 4px solid #0284c7; padding: 14px 16px; border-radius: 0 8px 8px 0; margin: 18px 0;">
      <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #334155;">
        <li style="margin-bottom: 6px;"><strong>Turn lump-sum shock into easy monthly plans</strong> (e.g. ₹2,400/mo instead of ₹55,000 upfront)</li>
        <li style="margin-bottom: 6px;"><strong>100% digital e-KYC approval in 2 minutes</strong> right chairside</li>
        <li style="margin-bottom: 6px;"><strong>Your clinic gets paid full treatment cost upfront</strong> directly into your current account</li>
        <li><strong>Zero financial liability or paperwork</strong> on your clinic (100% lender-backed)</li>
      </ul>
    </div>

    <p style="font-size: 14px; color: #334155; margin-bottom: 16px;">Would you be open to a quick 5-minute chat or WhatsApp walkthrough to see how partner clinics are using this chairside?</p>

    <div style="text-align: center; margin: 24px 0 16px;">
      <a href="https://clinaza.in/#partner-form" style="display: inline-block; background-color: #0284c7; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 13px; padding: 12px 24px; border-radius: 8px;">Explore Clinic Partnership →</a>
    </div>

    <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #f1f5f9; font-size: 13px; color: #64748b;">
      <p style="margin: 0 0 4px; font-weight: 700; color: #1e293b;">Pratyush Raj</p>
      <p style="margin: 0 0 4px;">Founder / Partnership Lead, Clinaza</p>
      <p style="margin: 0;">🌐 <a href="https://clinaza.in" style="color: #0284c7; text-decoration: none;">clinaza.in</a> | 📱 <a href="tel:+917292984244" style="color: #0284c7; text-decoration: none;">+91 7292984244</a></p>
    </div>
  </div>
</body>
</html>"""

PLAIN_TEMPLATE = """Hi {doctor_name},

Noticed your practice at {clinic_name} in {city}—great work.

Quick question: how often do patients hesitate or delay treatments like implants, crowns, or aligners simply because paying ₹40,000–₹1,50,000 upfront isn’t feasible for them?

At Clinaza, we help dental clinics convert those hesitant consults by offering instant, paperless patient EMI financing (powered by 55+ RBI-regulated banks & NBFCs):
- Turn lump-sum shock into easy monthly plans (e.g. ₹2,400/mo instead of ₹55,000 upfront)
- 100% digital e-KYC approval in 2 minutes right chairside
- Your clinic gets paid the full treatment cost upfront directly into your bank account
- Zero financial liability or paperwork on your clinic (100% lender-backed)

Would you be open to a quick 5-minute chat or WhatsApp walkthrough to see how partner clinics are using this chairside?

Best regards,
Pratyush Raj
Founder / Partnership Lead, Clinaza
clinaza.in | +91 7292984244"""

def send_email(to_email, doctor_name, clinic_name, city):
    if clinic_name and clinic_name != "your dental practice":
        subject = f"Quick question about implant/aligner drops at {clinic_name}"
    else:
        subject = "Quick question regarding patient EMI financing at your practice"
        
    html = HTML_TEMPLATE.format(
        doctor_name=doctor_name,
        clinic_name=clinic_name,
        city=city
    )
    plain = PLAIN_TEMPLATE.format(
        doctor_name=doctor_name,
        clinic_name=clinic_name,
        city=city
    )
    
    payload = {
        "from": SENDER,
        "to": [to_email],
        "subject": subject,
        "html": html,
        "text": plain,
        "reply_to": "contact@clinaza.in"
    }
    
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(
        "https://api.resend.com/emails",
        data=data,
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json",
            "User-Agent": "ClinazaOutreach/2.0"
        }
    )
    
    try:
        with urllib.request.urlopen(req) as resp:
            resp_data = json.loads(resp.read().decode('utf-8'))
            return True, resp_data.get("id")
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode('utf-8')
        return False, f"HTTP {e.code}: {err_msg}"
    except Exception as e:
        return False, str(e)

def log_to_master_db(lead, email_id):
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    
    now = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    
    cur.execute("""
        INSERT INTO leads (
            clinic_name, doctor_name, email, city, state, specialty, 
            status, resend_id, sent_at, source
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        lead.get('clinic_name'),
        lead.get('doctor_name'),
        lead.get('email').strip().lower(),
        lead.get('city'),
        lead.get('state'),
        lead.get('specialty'),
        'sent',
        email_id,
        now,
        'oct29_fresh_scout'
    ))
    
    conn.commit()
    conn.close()

def main():
    import sys
    limit = int(sys.argv[1]) if len(sys.argv) > 1 else 50
    dry_run = "--dry-run" in sys.argv
    
    print(f"Loading leads from {QUEUE_PATH}...")
    with open(QUEUE_PATH, "r", encoding="utf-8") as f:
        leads = json.load(f)
        
    # Check against DB again for safety
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("SELECT lower(email) FROM leads")
    sent = set(r[0] for r in cur.fetchall() if r[0])
    conn.close()
    
    uncontacted = [l for l in leads if l.get('email', '').strip().lower() not in sent]
    print(f"Total uncontacted available in queue: {len(uncontacted)}")
    
    batch = uncontacted[:limit]
    print(f"Selected batch size: {len(batch)} (dry_run={dry_run})")
    
    if dry_run:
        print("\n--- SAMPLE PREVIEW ---")
        for idx, lead in enumerate(batch[:5], 1):
            print(f"{idx}. {lead['doctor_name']} | {lead['clinic_name']} ({lead['city']}) -> {lead['email']}")
        print("\nDry run completed. To send real emails, run without --dry-run.")
        return
        
    successful = 0
    failed = 0
    
    for idx, lead in enumerate(batch, 1):
        email = lead['email'].strip().lower()
        doc = lead['doctor_name']
        clinic = lead['clinic_name']
        city = lead.get('city', 'your area')
        
        print(f"[{idx}/{len(batch)}] Sending to {doc} ({email}) at {clinic}...", end=" ", flush=True)
        ok, res = send_email(email, doc, clinic, city)
        
        if ok:
            successful += 1
            print(f"SUCCESS (Resend ID: {res})")
            log_to_master_db(lead, res)
        else:
            failed += 1
            print(f"FAILED: {res}")
            
        # Respect rate limits: 0.75s pause between sends
        time.sleep(0.75)
        
    print("\n==========================================")
    print(f"DISPATCH COMPLETE: {successful} Sent Successfully | {failed} Failed")
    print("==========================================")

if __name__ == "__main__":
    main()
