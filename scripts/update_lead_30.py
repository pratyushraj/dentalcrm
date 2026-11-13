import json

with open("scripts/fresh_leads_north_nov13.json", "r", encoding="utf-8") as f:
    leads = json.load(f)

# Replace lead 30 (Perfect Dental) with Smile Art Dental Clinic & Implantology Centre
leads[29] = {
    "doctor_name": "Dr. Achint Khullar",
    "clinic_name": "Smile Art Dental Clinic & Implantology Centre",
    "email": "smileart.in@gmail.com",
    "phone": "+91-7681987972",
    "city": "Sector 15-A, Chandigarh",
    "state": "Chandigarh",
    "specialty": "Prosthodontist & Oral Implantologist",
    "website": "https://smileart.in"
}

with open("scripts/fresh_leads_north_nov13.json", "w", encoding="utf-8") as f:
    json.dump(leads, f, indent=2)

print("Updated Lead 30 successfully!")
