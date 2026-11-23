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
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 24px 16px; background-color: #f8fafc;">
  <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 32px 26px; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
    
    <p style="font-size: 15px; margin: 0 0 16px 0; color: #0f172a;">Hi Dr. {doctor_name},</p>
    
    <p style="font-size: 14px; color: #334155; margin: 0 0 14px 0; line-height: 1.55;">
      Following up on my previous note regarding <strong>{clinic_name}</strong>—I know how hectic patient consultations get during clinic hours.
    </p>
    
    <p style="font-size: 14px; color: #334155; margin: 0 0 16px 0; line-height: 1.55;">
      When patients hesitate on high-ticket treatment plans (₹30,000 to ₹1,50,000+ for implants, clear aligners, or crowns), the drop-off is rarely about trust—it's almost always upfront cash flow.
    </p>

    <div style="background: #f0f9ff; border-left: 4px solid #0867E8; padding: 16px 18px; border-radius: 0 8px 8px 0; margin: 20px 0;">
      <p style="font-size: 13px; font-weight: 700; color: #0369a1; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 0.5px;">How Clinaza Works at Your Front Desk</p>
      <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: #334155; line-height: 1.6;">
        <li style="margin-bottom: 8px;"><strong>⚡ 100% Digital Point-of-Care Checkout:</strong> Zero swipe machines or bulky hardware. Your front desk dispatches an instant payment link via WhatsApp/SMS, or patients scan a dynamic QR on your clinic screen.</li>
        <li style="margin-bottom: 8px;"><strong>🛡️ 0% Clinic Recourse:</strong> Full treatment payout is disbursed directly into your clinic current account on a <strong>T+1 schedule</strong>. Licensed banks and NBFCs absorb all patient credit risk.</li>
        <li><strong>📲 2-Minute Paperless e-KYC:</strong> Patients choose flexible monthly EMI tenures across 16+ major banks directly from their smartphone.</li>
      </ul>
    </div>

    <p style="font-size: 14px; color: #334155; margin: 0 0 24px 0; line-height: 1.55;">
      Activation takes under 24 hours with basic clinic verification (Doctor PAN, Aadhaar, and Cancelled Cheque).
    </p>

    <!-- Prominent Onboarding CTA Button -->
    <div style="text-align: center; margin: 28px 0 24px 0;">
      <a href="https://clinaza.in/#partner-form" style="display: inline-block; background-color: #0867E8; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 10px rgba(8, 103, 232, 0.25);">
        Start Clinic Onboarding →
      </a>
      <div style="font-size: 12px; color: #64748b; margin-top: 8px;">
        Takes 2 minutes • 100% digital desk activation
      </div>
    </div>

    <div style="margin-top: 28px; padding-top: 18px; border-top: 1px solid #f1f5f9; font-size: 13px; color: #64748b; line-height: 1.5;">
      <p style="margin: 0 0 4px 0; font-weight: 700; color: #0f172a;">Pratyush Raj</p>
      <p style="margin: 0 0 4px 0; color: #475569;">Founder, Clinaza</p>
      <p style="margin: 0;">🌐 <a href="https://clinaza.in" style="color: #0867E8; text-decoration: none; font-weight: 600;">clinaza.in</a> &nbsp;|&nbsp; 📱 <a href="https://wa.me/917292984244" style="color: #0867E8; text-decoration: none; font-weight: 600;">+91 72929 84244</a></p>
    </div>

  </div>
</body>
</html>"""

PLAIN_TEMPLATE = """Hi Dr. {doctor_name},

Following up on my previous note regarding {clinic_name}—I know how hectic patient consultations get during clinic hours.

When patients hesitate on high-ticket treatment plans (₹30,000 to ₹1,50,000+ for implants, clear aligners, or crowns), the drop-off is rarely about trust—it's almost always upfront cash flow.

Here is how Clinaza works at your front desk with zero hardware:

1. ⚡ 100% Digital Point-of-Care Checkout: Zero swipe machines. Your front desk dispatches an instant payment link via WhatsApp/SMS, or patients scan a dynamic QR on your clinic screen.
2. 🛡️ 0% Clinic Recourse: Full treatment payout settles directly into your clinic current account on a T+1 schedule. Licensed banks and NBFCs absorb all credit risk.
3. 📲 2-Minute Paperless e-KYC: Patients choose flexible monthly EMI tenures across 16+ major banks directly from their phone.

Activation takes under 24 hours with basic clinic verification (Doctor PAN, Aadhaar, and Cancelled Cheque).

👉 Start Clinic Onboarding: https://clinaza.in/#partner-form

Best regards,
Pratyush Raj
Founder, Clinaza
clinaza.in | WhatsApp: +91 7292984244"""

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
