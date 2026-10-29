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
        <li style="margin-bottom: 6px;"><strong>Zero financial liability or paperwork</strong> on your clinic (100% lender-backed)</li>
        <li><strong>₹0 platform fee & ₹0 setup cost</strong> for the clinic to partner</li>
      </ul>
    </div>

    <p style="font-size: 14px; color: #334155; margin-bottom: 16px;">Would you be open to a quick 5-minute chat or WhatsApp walkthrough to see how partner clinics are using this chairside?</p>

    <div style="text-align: center; margin: 24px 0 16px;">
      <a href="https://clinaza.in/#partner-form" style="display: inline-block; background-color: #0284c7; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 13px; padding: 12px 24px; border-radius: 8px;">Partner With Clinaza Free →</a>
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
- ₹0 platform fee & ₹0 setup cost for the clinic to partner

Would you be open to a quick 5-minute chat or WhatsApp walkthrough to see how partner clinics are using this chairside?

Best regards,
Pratyush Raj
Founder / Partnership Lead, Clinaza
clinaza.in | +91 7292984244"""

def send_email(to_email, doctor_name, clinic_name, city):
    if clinic_name and clinic_name != "your dental practice":
        subject = f"Quick question about implant/aligner drops at {clinic_name}"
    else:
        subject = f"Quick question for {doctor_name}"
        
    html_content = HTML_TEMPLATE.format(doctor_name=doctor_name, clinic_name=clinic_name, city=city)
    plain_content = PLAIN_TEMPLATE.format(doctor_name=doctor_name, clinic_name=clinic_name, city=city)
    
    payload = {
        "from": SENDER,
        "to": [to_email],
        "subject": subject,
        "html": html_content,
        "text": plain_content
    }
    
    req = urllib.request.Request(
        "https://api.resend.com/emails",
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json",
            "User-Agent": "resend-node:2.0.0"
        },
        data=json.dumps(payload).encode("utf-8"),
        method="POST"
    )
    
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read())
            return True, data.get("id")
    except Exception as e:
        err_msg = str(e)
        if hasattr(e, "read"):
            try:
                err_msg += " " + e.read().decode()
            except:
                pass
        return False, err_msg

def update_db(email, doctor_name, clinic_name, city, status, resend_id):
    try:
        if os.path.exists(DB_PATH):
            conn = sqlite3.connect(DB_PATH)
            c = conn.cursor()
            c.execute(
                "INSERT OR REPLACE INTO leads (email, doctor_name, clinic_name, city, status, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
                (email, doctor_name, clinic_name, city, status, datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
            )
            conn.commit()
            conn.close()
    except Exception as e:
        print(f"  [DB Error: {e}]", end=" ")

def main():
    with open("cleaned_target_dentists_oct28.json") as f:
        targets = json.load(f)
        
    print(f"Loaded {len(targets)} targets for dispatch.")
    
    all_sent_path = "src/all_sent_emails.json"
    sent_list = []
    if os.path.exists(all_sent_path):
        with open(all_sent_path) as f:
            sent_list = json.load(f)
            
    results = []
    success_count = 0
    fail_count = 0
    
    for i, t in enumerate(targets, 1):
        email = t["email"].strip().lower()
        doc = t.get("doctor_name") or "Doctor"
        clinic = t.get("clinic_name") or "your dental practice"
        city = t.get("city") or "India"
        
        # Clean doc greeting
        if doc == "Doctor":
            doctor_name_greeting = "Doctor"
        else:
            doctor_name_greeting = doc if doc.startswith("Dr.") else f"Dr. {doc}"
            
        print(f"[{i}/{len(targets)}] Sending to {doctor_name_greeting} ({email}) at {clinic}...", end=" ", flush=True)
        success, res = send_email(email, doctor_name_greeting, clinic, city)
        
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        record = {
            "index": i,
            "email": email,
            "doctor": doctor_name_greeting,
            "clinic": clinic,
            "city": city,
            "status": "sent" if success else "failed",
            "resend_id": res if success else None,
            "error": None if success else res,
            "timestamp": timestamp
        }
        results.append(record)
        
        if success:
            success_count += 1
            print(f"OK ({res})")
            if email not in sent_list:
                sent_list.append(email)
            update_db(email, doctor_name_greeting, clinic, city, "sent", res)
        else:
            fail_count += 1
            print(f"FAILED: {res}")
            update_db(email, doctor_name_greeting, clinic, city, "failed", None)
            
        # Respect rate limits (0.6s delay)
        time.sleep(0.65)
        
        # Incremental save every 10 sends
        if i % 10 == 0:
            with open(all_sent_path, "w") as f:
                json.dump(sent_list, f, indent=2)
            with open("dispatch_results_batch_oct28.json", "w") as f:
                json.dump(results, f, indent=2)
                
    # Final save
    with open(all_sent_path, "w") as f:
        json.dump(sent_list, f, indent=2)
    with open("dispatch_results_batch_oct28.json", "w") as f:
        json.dump(results, f, indent=2)
        
    print("\n==========================================")
    print(f"Dispatch Complete: {success_count} Sent, {fail_count} Failed.")
    print("==========================================")

if __name__ == "__main__":
    main()
