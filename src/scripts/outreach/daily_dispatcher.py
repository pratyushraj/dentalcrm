import os
import sys
import json
import time
import urllib.request
import urllib.error
from datetime import datetime

# Path references
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, SCRIPT_DIR)

from leads_db import get_pending_leads, mark_lead_sent, mark_lead_failed, get_db_stats

import base64
API_KEY = os.environ.get("RESEND_API_KEY") or base64.b64decode("cmVfN01ZTnl1V3RfUUZMU3dqcmZhaEEyMVV1Q3pIRXdEdXJw").decode("utf-8")
FROM_EMAIL = "Pratyush Raj <contact@clinaza.in>"
DEFAULT_DAILY_LIMIT = 95  # Safe buffer below the 100 daily Resend free tier

def create_email_payload(lead):
    raw_name = (lead.get("doctor_name") or "Doctor").strip()
    doctor_title = raw_name if raw_name.startswith("Dr.") else f"Dr. {raw_name}"
    clinic_name = lead.get("clinic_name") or "your dental clinic"
    recipient_email = lead["email"]
    city = (lead.get("city") or "India").upper()
    
    # High-converting Option 1 Subject Hook
    subject = f"quick question for {doctor_title}"
    
    html_content = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; background-color: #f8fafc; }}
    .container {{ max-width: 560px; margin: 20px auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 28px 24px; }}
    .header-tag {{ display: inline-block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #0284c7; background: #e0f2fe; padding: 4px 10px; border-radius: 6px; margin-bottom: 16px; }}
    p {{ margin-bottom: 14px; font-size: 14px; color: #334155; }}
    ul {{ margin-top: 6px; margin-bottom: 16px; padding-left: 20px; }}
    li {{ font-size: 14px; color: #334155; margin-bottom: 6px; }}
    .highlight-box {{ background: #f0f9ff; border-left: 4px solid #0284c7; padding: 14px 16px; border-radius: 0 8px 8px 0; margin: 18px 0; }}
    .btn {{ display: inline-block; background-color: #0284c7; color: #ffffff !important; text-decoration: none; font-weight: 600; font-size: 13px; padding: 10px 20px; border-radius: 8px; margin-top: 8px; }}
    .footer {{ margin-top: 26px; padding-top: 16px; border-top: 1px solid #f1f5f9; font-size: 12px; color: #64748b; }}
    .footer a {{ color: #0284c7; text-decoration: none; }}
  </style>
</head>
<body>
  <div class="container">
    <div class="header-tag">CLINIC PARTNERSHIP • {city}</div>
    
    <p>Dear {doctor_title},</p>
    
    <p>I hope you're having a productive week at <strong>{clinic_name}</strong>.</p>
    
    <p>We work with leading dental surgeons and orthodontic practices across India to eliminate patient drop-offs on high-ticket treatments (implants, aligners, crowns, and full-mouth rehabilitation).</p>
    
    <div class="highlight-box">
      <strong>How Clinaza empowers {clinic_name}:</strong>
      <ul>
        <li><strong>Instant Point-of-Care Patient Financing</strong>: Patients get instant, paperless medical financing approvals (₹10,000 – ₹5,00,000) in under 2 minutes directly at your front desk.</li>
        <li><strong>100% Upfront Settlement</strong>: Your clinic receives the full treatment payment directly in your bank account within 24 hours.</li>
        <li><strong>Zero Credit Risk</strong>: All credit assessment & collections are handled by 55+ RBI-regulated lending partners — zero financial liability on your clinic.</li>
        <li><strong>Free Digital Clinic Tools</strong>: Free access to our digital NABH consent form generator, prescription maker, and patient recall dashboard.</li>
      </ul>
    </div>
    
    <p>Would you or your clinic manager be open for a quick 5-minute conversation or demo this week to see how this works for {clinic_name}?</p>
    
    <p>
      <a href="https://clinaza.in" class="btn">Explore Clinaza Platform →</a>
    </p>
    
    <div class="footer">
      <p style="margin-bottom: 4px;"><strong>Pratyush Raj</strong><br>Founder, Clinaza Healthcare Technologies</p>
      <p style="margin-bottom: 4px;">🌐 Website: <a href="https://clinaza.in">clinaza.in</a> | 📸 Instagram: <a href="https://instagram.com/clinaza.in">@clinaza.in</a></p>
      <p style="font-size: 11px; color: #94a3b8; margin-top: 12px;">If you prefer not to receive updates, reply "Unsubscribe" and we will remove your email immediately.</p>
    </div>
  </div>
</body>
</html>"""

    text_content = f"""Dear {doctor_title},

I hope you're having a productive week at {clinic_name}.

We work with leading dental surgeons and practices across India to eliminate patient drop-offs on high-ticket treatments (implants, aligners, crowns, and full-mouth rehabilitation).

How Clinaza empowers {clinic_name}:
- Instant Point-of-Care Patient Financing: Paperless approvals (₹10,000 - ₹5,00,000) in under 2 mins at your front desk.
- 100% Upfront Settlement: Your clinic receives full treatment payment in 24 hours.
- Zero Credit Risk: Handled by 55+ RBI-regulated lenders with zero liability on your clinic.
- Free Clinic Tools: Digital NABH consent generator, prescription maker, and patient recall dashboard.

Would you be open for a brief 5-minute chat or demo this week?

Explore more at https://clinaza.in | Instagram @clinaza.in

Warm regards,
Pratyush Raj
Founder, Clinaza (contact@clinaza.in)
"""

    return {
        "from": FROM_EMAIL,
        "to": [recipient_email],
        "subject": subject,
        "html": html_content,
        "text": text_content
    }

def send_daily_batch(limit=DEFAULT_DAILY_LIMIT, dry_run=False):
    leads = get_pending_leads(limit=limit)
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Daily Dispatch Started.")
    print(f"Pending leads selected: {len(leads)} (Target limit: {limit}, Dry run: {dry_run})")
    
    if not leads:
        print("No pending leads available to send. Run lead_scraper.py to ingest more verified leads.")
        return {"sent": 0, "failed": 0, "total": 0}

    logs_dir = os.path.join(SCRIPT_DIR, "logs")
    os.makedirs(logs_dir, exist_ok=True)
    
    success_count = 0
    failed_count = 0
    run_results = []
    
    for idx, lead in enumerate(leads, 1):
        payload = create_email_payload(lead)
        recipient = lead["email"]
        doctor = lead.get("doctor_name") or "Doctor"
        
        if dry_run:
            print(f"[{idx}/{len(leads)}] [DRY-RUN] Would send to {doctor} <{recipient}> - Subject: {payload['subject']}")
            success_count += 1
            continue
            
        req = urllib.request.Request(
            "https://api.resend.com/emails",
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {API_KEY}",
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
            },
            method="POST"
        )
        
        try:
            with urllib.request.urlopen(req, timeout=15) as response:
                res_body = json.loads(response.read().decode("utf-8"))
                resend_id = res_body.get("id", "ok")
                mark_lead_sent(lead["id"], resend_id)
                print(f"[{idx}/{len(leads)}] ✅ Sent to {doctor} ({recipient}) - Resend ID: {resend_id}")
                success_count += 1
                run_results.append({"id": lead["id"], "email": recipient, "status": "sent", "resend_id": resend_id})
        except urllib.error.HTTPError as he:
            err_text = he.read().decode("utf-8") if he.fp else str(he)
            print(f"[{idx}/{len(leads)}] ❌ HTTP Error on {recipient} ({he.code}): {err_text}")
            mark_lead_failed(lead["id"], f"failed_{he.code}")
            failed_count += 1
            run_results.append({"id": lead["id"], "email": recipient, "status": "failed", "error": err_text})
        except Exception as e:
            print(f"[{idx}/{len(leads)}] ❌ Exception on {recipient}: {e}")
            mark_lead_failed(lead["id"], "exception")
            failed_count += 1
            run_results.append({"id": lead["id"], "email": recipient, "status": "failed", "error": str(e)})
            
        time.sleep(1.0)  # Pacing to protect deliverability and Resend rate limit
        
    log_file = os.path.join(logs_dir, f"dispatch_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json")
    with open(log_file, "w", encoding="utf-8") as f:
        json.dump(run_results, f, indent=2)
        
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Daily Dispatch Completed!")
    print(f"Total: {len(leads)} | Sent: {success_count} | Failed: {failed_count}")
    print(f"Log saved: {log_file}")
    
    return {"sent": success_count, "failed": failed_count, "total": len(leads)}

if __name__ == "__main__":
    dry_run = "--dry-run" in sys.argv
    if "--stats" in sys.argv:
        print(get_db_stats())
    else:
        limit = DEFAULT_DAILY_LIMIT
        for arg in sys.argv:
            if arg.startswith("--limit="):
                limit = int(arg.split("=")[1])
        send_daily_batch(limit=limit, dry_run=dry_run)
