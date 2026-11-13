import json
import time
import os
import re
import urllib.request
import sqlite3
from datetime import datetime

def get_resend_api_key():
    key = os.environ.get("RESEND_API_KEY", "")
    if key:
        return key
    cfg_path = os.path.expanduser("~/.gemini/antigravity/mcp_config.json")
    if os.path.exists(cfg_path):
        try:
            with open(cfg_path) as f:
                cfg = json.load(f)
            auth = cfg.get("mcpServers", {}).get("resend", {}).get("headers", {}).get("Authorization", "")
            if auth.startswith("Bearer "):
                return auth.split(" ")[1].strip()
        except Exception:
            pass
    return ""

API_KEY = get_resend_api_key()
SENDER = "Pratyush Raj <contact@clinaza.in>"
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(PROJECT_ROOT, "src", "scripts", "outreach", "dental_leads_master.db")
QUEUE_PATH = os.path.join(PROJECT_ROOT, "fresh_underwritten_leads_batch_nov11.json")

HTML_TEMPLATE = """<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 20px; background: #f8fafc;">
  <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 28px 24px;">
    <p style="font-size: 15px; margin-bottom: 16px;">Hi {doctor_name},</p>
    <p style="font-size: 14px; color: #334155; margin-bottom: 14px;">Noticed your practice at <strong>{clinic_name}</strong> in {city}—great work.</p>
    <p style="font-size: 14px; color: #334155; margin-bottom: 14px;">Quick question: how often do patients hesitate or delay high-value treatments like implants, full-mouth rehabilitations, or clear aligners simply because paying ₹40,000–₹1,50,000 upfront isn’t feasible for them?</p>
    <p style="font-size: 14px; color: #334155; margin-bottom: 14px;">At <strong>Clinaza</strong>, we help private dental clinics convert hesitant consults by enabling <strong>instant point-of-care patient EMI financing</strong> (across 16+ major banks & cardless healthcare NBFCs):</p>
    
    <div style="background: #f0f9ff; border-left: 4px solid #0284c7; padding: 14px 16px; border-radius: 0 8px 8px 0; margin: 18px 0;">
      <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #334155;">
        <li style="margin-bottom: 6px;"><strong>Multi-Bank Credit & Debit Card EMIs:</strong> 3–24 month tenures across HDFC, ICICI, SBI, Axis, Kotak, IndusInd & 10+ others</li>
        <li style="margin-bottom: 6px;"><strong>Paperless Cardless Healthcare EMI:</strong> Digital Aadhaar/PAN e-KYC in 2 minutes for patients without credit cards</li>
        <li style="margin-bottom: 6px;"><strong>Full Treatment Fees Upfront:</strong> 100% credited directly into your clinic current account (T+1 banking day)</li>
        <li><strong>Zero Clinic Risk:</strong> 100% balance-sheet underwritten by partner financial institutions (0% default recourse on your clinic)</li>
      </ul>
    </div>

    <p style="font-size: 14px; color: #334155; margin-bottom: 16px;">You can review our 2-page Clinic Partner Onboarding Guide here: <a href="https://www.clinaza.in/docs/Clinaza_Clinic_Partner_Onboarding_Guide.pdf" style="color: #0284c7; font-weight: 600; text-decoration: underline;">Download Clinic Guide (PDF)</a>.</p>

    <div style="text-align: center; margin: 24px 0 16px;">
      <a href="https://clinaza.in/#partner-form" style="display: inline-block; background-color: #0284c7; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 13px; padding: 12px 24px; border-radius: 8px;">Explore Clinic Partnership →</a>
    </div>

    <p style="font-size: 13px; color: #64748b; margin-top: 20px;">Would you be open to a quick 5-minute chat or WhatsApp walkthrough to see how dental clinics in {city} are using this at their front desk?</p>

    <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #f1f5f9; font-size: 13px; color: #64748b;">
      <p style="margin: 0 0 4px; font-weight: 700; color: #1e293b;">Pratyush Raj</p>
      <p style="margin: 0 0 4px;">Founder & Partnership Lead, Clinaza</p>
      <p style="margin: 0;">🌐 <a href="https://clinaza.in" style="color: #0284c7; text-decoration: none;">clinaza.in</a> | 📱 <a href="tel:+917292984244" style="color: #0284c7; text-decoration: none;">+91 7292984244</a></p>
    </div>
  </div>
</body>
</html>"""

PLAIN_TEMPLATE = """Hi {doctor_name},

Noticed your practice at {clinic_name} in {city}—great work.

Quick question: how often do patients hesitate or delay treatments like implants, crowns, or aligners simply because paying ₹40,000–₹1,50,000 upfront isn’t feasible for them?

At Clinaza, we help dental clinics convert hesitant consults by enabling instant point-of-care patient EMI financing (across 16+ major banks & cardless healthcare NBFCs):
- Multi-Bank Credit & Debit Card EMIs: 3–24 month tenures across HDFC, ICICI, SBI, Axis, Kotak, IndusInd & 10+ others
- Paperless Cardless Healthcare EMI: Digital Aadhaar/PAN e-KYC in 2 minutes for patients without credit cards
- Full Treatment Fees Upfront: 100% credited directly into your clinic current account (T+1)
- Zero Clinic Risk: 100% underwritten by partner financial institutions (0% default recourse on your clinic)

You can view our 2-page Clinic Partner Onboarding Guide here: https://www.clinaza.in/docs/Clinaza_Clinic_Partner_Onboarding_Guide.pdf

Would you be open to a quick 5-minute chat or WhatsApp walkthrough to see how partner clinics are using this chairside?

Best regards,
Pratyush Raj
Founder & Partnership Lead, Clinaza
clinaza.in | +91 7292984244"""

def send_email(to_email, doctor_name, clinic_name, city):
    if clinic_name and clinic_name.lower() not in ["dental practice", "dental clinic", "your dental practice"]:
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
        "reply_to": "contact@clinaza.in",
        "subject": subject,
        "html": html,
        "text": plain
    }
    
    req = urllib.request.Request(
        "https://api.resend.com/emails",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json",
            "User-Agent": "ClinazaOutreach/1.0"
        },
        method="POST"
    )
    
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return True, data.get("id", "ok")
    except urllib.error.HTTPError as e:
        err = e.read().decode("utf-8")
        return False, f"HTTP {e.code}: {err}"
    except Exception as e:
        return False, str(e)

def log_to_master_db(lead, resend_id):
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    cur.execute("""
        INSERT OR REPLACE INTO leads (
            clinic_name, doctor_name, email, city, state, specialty, 
            status, resend_id, sent_at, source
        ) VALUES (?, ?, ?, ?, ?, ?, 'sent', ?, ?, ?)
    """, (
        lead.get('clinic_name', 'Dental Clinic'),
        lead.get('doctor_name', 'Doctor'),
        lead['email'].strip().lower(),
        lead.get('city', ''),
        lead.get('state', ''),
        lead.get('specialty', 'Dentistry'),
        resend_id,
        now,
        'nov11_fresh_batch'
    ))
    
    conn.commit()
    conn.close()

def main():
    import sys
    limit = int(sys.argv[1]) if len(sys.argv) > 1 and sys.argv[1].isdigit() else 100
    dry_run = "--dry-run" in sys.argv
    
    if not API_KEY and not dry_run:
        print("ERROR: RESEND_API_KEY not found!")
        sys.exit(1)
        
    print(f"Loading leads from {QUEUE_PATH}...")
    if not os.path.exists(QUEUE_PATH):
        print(f"File not found: {QUEUE_PATH}. Please compile leads first.")
        sys.exit(1)
        
    with open(QUEUE_PATH, "r", encoding="utf-8") as f:
        leads = json.load(f)
        
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
        for idx, lead in enumerate(batch[:10], 1):
            print(f"{idx}. {lead['doctor_name']} | {lead['clinic_name']} ({lead['city']}) -> {lead['email']}")
        print(f"\nDry run completed for {len(batch)} leads. To send real emails, run without --dry-run.")
        return
        
    successful = 0
    failed = 0
    dispatch_results = []
    
    for idx, lead in enumerate(batch, 1):
        email = lead['email'].strip().lower()
        doc = lead.get('doctor_name', 'Doctor')
        clinic = lead.get('clinic_name', 'Dental Clinic')
        city = lead.get('city', 'your city')
        
        print(f"[{idx}/{len(batch)}] Sending to {doc} <{email}> ({clinic})... ", end="", flush=True)
        
        ok, res = send_email(email, doc, clinic, city)
        if ok:
            print(f"SUCCESS (ID: {res})")
            successful += 1
            log_to_master_db(lead, res)
            dispatch_results.append({
                "email": email,
                "doctor": doc,
                "clinic": clinic,
                "city": city,
                "resend_id": res,
                "status": "sent",
                "timestamp": datetime.now().isoformat()
            })
        else:
            print(f"FAILED: {res}")
            failed += 1
            dispatch_results.append({
                "email": email,
                "doctor": doc,
                "clinic": clinic,
                "city": city,
                "error": res,
                "status": "failed",
                "timestamp": datetime.now().isoformat()
            })
            
        time.sleep(0.6)  # Resend rate-limiting (max 2 req/sec)
        
    print("\n==========================================")
    print(f"DISPATCH COMPLETED: {successful} Sent, {failed} Failed out of {len(batch)}")
    print("==========================================")
    
    results_path = os.path.join(PROJECT_ROOT, "scripts", "dispatch_results_nov11.json")
    with open(results_path, "w", encoding="utf-8") as f:
        json.dump(dispatch_results, f, indent=2)
    print(f"Logged run results to {results_path}")

if __name__ == "__main__":
    main()
