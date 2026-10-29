import json
import time
import os
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
    
    <p style="font-size: 14px; color: #334155; margin-bottom: 14px;">Following up on my previous note regarding <strong>{clinic_name}</strong>—I know how hectic patient consultations get during clinic hours.</p>
    
    <p style="font-size: 14px; color: #334155; margin-bottom: 14px;">I wanted to share the 3 most common clarifications dental surgeons usually ask us before activating chairside financing:</p>
    
    <div style="background: #f0f9ff; border-left: 4px solid #0284c7; padding: 14px 16px; border-radius: 0 8px 8px 0; margin: 18px 0;">
      <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #334155;">
        <li style="margin-bottom: 8px;"><strong>Zero Doctor Credit Risk:</strong> Handled 100% by licensed RBI NBFCs & banks. If a patient defaults, your clinic keeps the full treatment payout with zero liability.</li>
        <li style="margin-bottom: 8px;"><strong>T+1 Direct Settlement:</strong> Funds settle directly into your clinic’s current bank account the very next working day.</li>
        <li><strong>No Paperwork at Front Desk:</strong> Patients scan a counter QR code or get an SMS link, completing 2-minute digital e-KYC directly on their own phone.</li>
      </ul>
    </div>

    <p style="font-size: 14px; color: #334155; margin-bottom: 16px;">Would you be open to a quick 5-minute call or a 60-second video demo to see how partner clinics are converting ₹40,000–₹1,00,000 cases chairside?</p>

    <div style="text-align: center; margin: 24px 0 16px;">
      <a href="https://clinaza.in/#partner-form" style="display: inline-block; background-color: #0284c7; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 13px; padding: 12px 24px; border-radius: 8px;">View Clinic Onboarding Demo →</a>
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

Following up on my previous note regarding {clinic_name}—I know how hectic patient consultations get during clinic hours.

I wanted to share the 3 most common clarifications dental surgeons usually ask us before activating chairside financing:

1. Zero Doctor Credit Risk: Handled 100% by licensed RBI NBFCs & banks. If a patient defaults, your clinic keeps the full treatment payout with zero liability.
2. T+1 Direct Settlement: Funds settle directly into your clinic’s current bank account the very next working day.
3. No Paperwork at Front Desk: Patients scan a counter QR code or get an SMS link, completing 2-minute digital e-KYC directly on their own phone.

Would you be open to a quick 5-minute call or a 60-second video demo to see how partner clinics are converting ₹40,000–₹1,00,000 cases chairside?

Best regards,
Pratyush Raj
Founder / Partnership Lead, Clinaza
clinaza.in | +91 7292984244"""

def send_retarget_email(to_email, doctor_name, clinic_name, city):
    if clinic_name and clinic_name != "your dental practice":
        subject = f"Re: Quick question about implant/aligner drops at {clinic_name}"
    else:
        subject = f"Re: Quick question for {doctor_name}"
        
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

def main():
    with open("retarget_leads_opened_no_signup.json") as f:
        targets = json.load(f)
        
    print(f"Loaded {len(targets)} qualified retargeting targets.")
    
    results = []
    success_count = 0
    fail_count = 0
    
    for i, t in enumerate(targets, 1):
        email = t["email"].strip().lower()
        doc = t.get("doctor_name") or "Doctor"
        clinic = t.get("clinic_name") or "your dental practice"
        city = t.get("city") or "India"
        
        doctor_name_greeting = doc if doc.startswith("Dr.") or doc == "Doctor" else f"Dr. {doc}"
            
        print(f"[{i}/{len(targets)}] Retargeting {doctor_name_greeting} ({email}) at {clinic}...", end=" ", flush=True)
        success, res = send_retarget_email(email, doctor_name_greeting, clinic, city)
        
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
        else:
            fail_count += 1
            print(f"FAILED: {res}")
            
        time.sleep(0.8)
        
    with open("dispatch_results_retarget_opened.json", "w") as f:
        json.dump(results, f, indent=2)
        
    print("\n==========================================")
    print(f"Retargeting Complete: {success_count} Sent, {fail_count} Failed.")
    print("==========================================")

if __name__ == "__main__":
    main()
