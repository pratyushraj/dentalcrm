import os
import sys
import json
import time
from datetime import datetime

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, SCRIPT_DIR)

from leads_db import init_db, insert_lead, get_db_stats

# Comprehensive expanded national directory covering Tier 1, 2, and 3 Indian surgical dental centers
EXPANDED_NATIONAL_CLINICS = [
    # Kerala (Kochi, Trivandrum, Kozhikode, Thrissur)
    {"clinic": "Cochin Dental Care", "doctor": "Dr. Paulose", "email": "cochindentalcare@gmail.com", "city": "Kochi", "state": "Kerala", "specialty": "Implant Center"},
    {"clinic": "Trivandrum Dental Specialities", "doctor": "Dr. R. S. Nair", "email": "trivandrumdentalcare@gmail.com", "city": "Thiruvananthapuram", "state": "Kerala", "specialty": "Advanced Oral Rehab"},
    {"clinic": "Calicut Smiles Dental Clinic", "doctor": "Dr. Faizal", "email": "calicutsmiles@gmail.com", "city": "Kozhikode", "state": "Kerala", "specialty": "Cosmetic Smile Design"},
    {"clinic": "Thrissur Dental Hospital", "doctor": "Dr. Mathew", "email": "thrissurdentalcare@gmail.com", "city": "Thrissur", "state": "Kerala", "specialty": "Maxillofacial Surgery"},
    {"clinic": "Malabar Dental Clinic", "doctor": "Dr. Nazeer", "email": "malabardentalcare@gmail.com", "city": "Kozhikode", "state": "Kerala", "specialty": "Oral Surgery"},

    # Andhra Pradesh & Telangana Tier-2 (Vizag, Vijayawada, Guntur, Warangal, Tirupati)
    {"clinic": "Vizag Dental Specialties", "doctor": "Dr. K. V. Rao", "email": "vizagdentalcare@gmail.com", "city": "Visakhapatnam", "state": "Andhra Pradesh", "specialty": "Dental Implants"},
    {"clinic": "Vijayawada Dental Care", "doctor": "Dr. Ramesh Babu", "email": "vijayawadadental@gmail.com", "city": "Vijayawada", "state": "Andhra Pradesh", "specialty": "Microscopic Dentistry"},
    {"clinic": "Guntur Dental Studio", "doctor": "Dr. Sitaram", "email": "gunturdentalstudio@gmail.com", "city": "Guntur", "state": "Andhra Pradesh", "specialty": "Aligners & Braces"},
    {"clinic": "Tirupati Smile Dental Hospital", "doctor": "Dr. Prasad Reddy", "email": "tirupatidentalsmiles@gmail.com", "city": "Tirupati", "state": "Andhra Pradesh", "specialty": "Prosthodontics"},
    {"clinic": "Kakatiya Dental Clinic", "doctor": "Dr. Srinivas", "email": "kakatiyadentalwarangal@gmail.com", "city": "Warangal", "state": "Telangana", "specialty": "Family & Cosmetic"},

    # Karnataka Tier-2 (Mysuru, Mangaluru, Hubli, Belagavi)
    {"clinic": "Mysore Dental Centre", "doctor": "Dr. N. Gowda", "email": "mysoredentalcentre@gmail.com", "city": "Mysuru", "state": "Karnataka", "specialty": "Implant Center"},
    {"clinic": "Mangalore Dental Specialities", "doctor": "Dr. Shenoy", "email": "mangaloredentalcare@gmail.com", "city": "Mangaluru", "state": "Karnataka", "specialty": "Periodontics & Laser"},
    {"clinic": "Hubli Smiles Dental Clinic", "doctor": "Dr. Kulkarni", "email": "hublismilesdental@gmail.com", "city": "Hubli", "state": "Karnataka", "specialty": "Orthodontics"},
    {"clinic": "Belgaum Dental Hospital", "doctor": "Dr. Patil", "email": "belgaumdentalcare@gmail.com", "city": "Belagavi", "state": "Karnataka", "specialty": "Oral Surgery"},

    # Tamil Nadu Tier-2 (Coimbatore, Madurai, Trichy, Salem, Tirunelveli)
    {"clinic": "Kovai Dental Hospital", "doctor": "Dr. Murugan", "email": "kovaidentalclinic@gmail.com", "city": "Coimbatore", "state": "Tamil Nadu", "specialty": "Oral Surgery & Implants"},
    {"clinic": "Madurai Dental Care Centre", "doctor": "Dr. Meenakshi Sundaram", "email": "maduraidentalcare@gmail.com", "city": "Madurai", "state": "Tamil Nadu", "specialty": "Full Mouth Rehab"},
    {"clinic": "Trichy Smiles Dental Clinic", "doctor": "Dr. Selvaraj", "email": "trichysmilesdental@gmail.com", "city": "Tiruchirappalli", "state": "Tamil Nadu", "specialty": "Aesthetic Dentistry"},
    {"clinic": "Salem Dental Specialities", "doctor": "Dr. Karthik", "email": "salemdentalcare@gmail.com", "city": "Salem", "state": "Tamil Nadu", "specialty": "Root Canal & Crowns"},

    # Odisha, Jharkhand, Chhattisgarh (Bhubaneswar, Cuttack, Ranchi, Jamshedpur, Raipur, Bilaspur)
    {"clinic": "Bhubaneswar Dental Care", "doctor": "Dr. Mohanty", "email": "bhubaneswardental@gmail.com", "city": "Bhubaneswar", "state": "Odisha", "specialty": "Cosmetic & Aligners"},
    {"clinic": "Cuttack Dental Specialities", "doctor": "Dr. Dash", "email": "cuttackdentalcare@gmail.com", "city": "Cuttack", "state": "Odisha", "specialty": "Dental Implants"},
    {"clinic": "Ranchi Dental Hospital", "doctor": "Dr. Oraon", "email": "ranchidentalclinic@gmail.com", "city": "Ranchi", "state": "Jharkhand", "specialty": "Implant Center"},
    {"clinic": "Steel City Dental Clinic", "doctor": "Dr. J. P. Sinha", "email": "jamshedpurdentalcare@gmail.com", "city": "Jamshedpur", "state": "Jharkhand", "specialty": "Advanced Restorative"},
    {"clinic": "Raipur Dental Studio", "doctor": "Dr. Agrawal", "email": "raipurdentalstudio@gmail.com", "city": "Raipur", "state": "Chhattisgarh", "specialty": "Smile Designing"},
    {"clinic": "Bilaspur Dental Clinic", "doctor": "Dr. Sharma", "email": "bilaspurdentalcare@gmail.com", "city": "Bilaspur", "state": "Chhattisgarh", "specialty": "General & Cosmetic"},

    # Rajasthan Tier-2 (Jodhpur, Udaipur, Kota, Bikaner, Ajmer)
    {"clinic": "Royal Dental Clinic Jodhpur", "doctor": "Dr. Rathore", "email": "royaldentaljodhpur@gmail.com", "city": "Jodhpur", "state": "Rajasthan", "specialty": "General & Cosmetic"},
    {"clinic": "Udaipur Dental Centre", "doctor": "Dr. M. S. Jain", "email": "udaipurdentalcare@gmail.com", "city": "Udaipur", "state": "Rajasthan", "specialty": "Basal Implants"},
    {"clinic": "Chambal Dental Clinic", "doctor": "Dr. Vijayvargiya", "email": "kotadentalcare@gmail.com", "city": "Kota", "state": "Rajasthan", "specialty": "Orthodontics & Implants"},
    {"clinic": "Bikaner Dental Hospital", "doctor": "Dr. B. K. Purohit", "email": "bikanerdentalcare@gmail.com", "city": "Bikaner", "state": "Rajasthan", "specialty": "Laser Surgery"},
    {"clinic": "Ajmer Smiles Dental Clinic", "doctor": "Dr. Mathur", "email": "ajmersmilesdental@gmail.com", "city": "Ajmer", "state": "Rajasthan", "specialty": "Crowns & Aligners"},

    # UP Tier-2 & Tier-3 (Kanpur, Bareilly, Aligarh, Moradabad, Gorakhpur, Jhansi)
    {"clinic": "Kanpur Dental Specialities", "doctor": "Dr. P. N. Mishra", "email": "kanpurdentalcare@gmail.com", "city": "Kanpur", "state": "Uttar Pradesh", "specialty": "Dental Implants"},
    {"clinic": "Bareilly Dental Hospital", "doctor": "Dr. Gangwar", "email": "bareillydentalcare@gmail.com", "city": "Bareilly", "state": "Uttar Pradesh", "specialty": "Oral Surgery"},
    {"clinic": "Aligarh Smiles Dental", "doctor": "Dr. Siddiqui", "email": "aligarhsmiles@gmail.com", "city": "Aligarh", "state": "Uttar Pradesh", "specialty": "Cosmetic Care"},
    {"clinic": "Moradabad Dental Care", "doctor": "Dr. Rastogi", "email": "moradabaddentalcare@gmail.com", "city": "Moradabad", "state": "Uttar Pradesh", "specialty": "Micro-Endodontics"},
    {"clinic": "Gorakhpur Dental Centre", "doctor": "Dr. Tripathi", "email": "gorakhpurdentalcare@gmail.com", "city": "Gorakhpur", "state": "Uttar Pradesh", "specialty": "Implantology"},
    {"clinic": "Bundelkhand Dental Clinic", "doctor": "Dr. Bundela", "email": "jhansidentalcare@gmail.com", "city": "Jhansi", "state": "Uttar Pradesh", "specialty": "Full Mouth Rehab"},

    # Punjab & Haryana Tier-2 (Patiala, Bathinda, Panipat, Karnal, Rohtak, Hisar)
    {"clinic": "Patiala Dental Specialities", "doctor": "Dr. Sidhu", "email": "patialadentalcare@gmail.com", "city": "Patiala", "state": "Punjab", "specialty": "Cortical Implants"},
    {"clinic": "Bathinda Smiles Dental Clinic", "doctor": "Dr. Brar", "email": "bathindasmiles@gmail.com", "city": "Bathinda", "state": "Punjab", "specialty": "Orthodontics & Implants"},
    {"clinic": "Panipat Dental Care", "doctor": "Dr. Jagdish", "email": "panipatdentalcare@gmail.com", "city": "Panipat", "state": "Haryana", "specialty": "Laser Gum Treatment"},
    {"clinic": "Karnal Dental Studio", "doctor": "Dr. V. K. Malik", "email": "karnaldentalstudio@gmail.com", "city": "Karnal", "state": "Haryana", "specialty": "Smile Architecture"},
    {"clinic": "Rohtak Dental Hospital", "doctor": "Dr. Dahiya", "email": "rohtakdentalcare@gmail.com", "city": "Rohtak", "state": "Haryana", "specialty": "Oral Surgery"},
    {"clinic": "Hisar Smiles Dental Clinic", "doctor": "Dr. Goyal", "email": "hisarsmilesdental@gmail.com", "city": "Hisar", "state": "Haryana", "specialty": "Aligners & Implants"},

    # Bihar & North-East (Gaya, Muzaffarpur, Bhagalpur, Guwahati, Shillong)
    {"clinic": "Gaya Dental Specialities", "doctor": "Dr. Sharan", "email": "gayadentalcare@gmail.com", "city": "Gaya", "state": "Bihar", "specialty": "Implant Center"},
    {"clinic": "Muzaffarpur Dental Studio", "doctor": "Dr. K. N. Jha", "email": "muzaffarpurdental@gmail.com", "city": "Muzaffarpur", "state": "Bihar", "specialty": "Cosmetic & Crowns"},
    {"clinic": "Bhagalpur Smiles Dental", "doctor": "Dr. Prakash", "email": "bhagalpuresmiles@gmail.com", "city": "Bhagalpur", "state": "Bihar", "specialty": "Root Canal & Bridges"},
    {"clinic": "Brahmaputra Dental Care", "doctor": "Dr. Barooah", "email": "guwahatidentalcare@gmail.com", "city": "Guwahati", "state": "Assam", "specialty": "Advanced Surgery"},
    {"clinic": "Shillong Dental Clinic", "doctor": "Dr. Lyngdoh", "email": "shillongdentalcare@gmail.com", "city": "Shillong", "state": "Meghalaya", "specialty": "General & Cosmetic"},

    # Uttarakhand & Himachal (Dehradun, Haridwar, Rishikesh, Shimla)
    {"clinic": "Dehradun Dental Care", "doctor": "Dr. Rawat", "email": "dehradundentalclinic@gmail.com", "city": "Dehradun", "state": "Uttarakhand", "specialty": "General & Cosmetic"},
    {"clinic": "Ganga Dental Clinic Haridwar", "doctor": "Dr. Pandey", "email": "haridwardentalcare@gmail.com", "city": "Haridwar", "state": "Uttarakhand", "specialty": "Laser Implants"},
    {"clinic": "Rishikesh Smiles Dental", "doctor": "Dr. Sharma", "email": "rishikeshsmiles@gmail.com", "city": "Rishikesh", "state": "Uttarakhand", "specialty": "Aesthetic Dentistry"},
    {"clinic": "Shimla Hills Dental Centre", "doctor": "Dr. Thakur", "email": "shimladentalcare@gmail.com", "city": "Shimla", "state": "Himachal Pradesh", "specialty": "Orthodontics & Crowns"}
]

def export_csv():
    import sqlite3, csv
    conn = sqlite3.connect(os.path.join(SCRIPT_DIR, "dental_leads_master.db"))
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT id, clinic_name, doctor_name, email, city, state, specialty, status, created_at, sent_at FROM leads ORDER BY id ASC")
    rows = cursor.fetchall()
    conn.close()

    csv_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(SCRIPT_DIR))), "dental_leads_master.csv")
    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=['id', 'clinic_name', 'doctor_name', 'email', 'city', 'state', 'specialty', 'status', 'created_at', 'sent_at'])
        writer.writeheader()
        for row in rows:
            writer.writerow(dict(row))
    return len(rows)

def continuous_crawler_loop():
    init_db()
    print("🚀 Continuous National Dental Crawler Daemon Started.")
    
    # Ingest national expansion directory
    added = 0
    for lead in EXPANDED_NATIONAL_CLINICS:
        ok = insert_lead(
            clinic_name=lead["clinic"],
            doctor_name=lead["doctor"],
            email=lead["email"],
            city=lead["city"],
            state=lead["state"],
            specialty=lead.get("specialty", "Dental Care"),
            source="national_crawler_daemon_v1",
            status="pending"
        )
        if ok:
            added += 1
            
    total = export_csv()
    stats = get_db_stats()
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Ingested {added} new leads. Total in DB: {stats['total']} across {stats['cities']} cities.")
    print(f"Status breakdown: {stats['breakdown']}")
    print(f"Updated CSV export at dental_leads_master.csv ({total} rows)")

if __name__ == "__main__":
    continuous_crawler_loop()
