import json
import os
import re
import time
import urllib.request
import urllib.parse
from leads_db import init_db, insert_lead, get_db_stats

# Curated seed database of high-intent Indian Dental Clinics & Surgeons across 20+ cities
SEED_CLINICS = [
    # Ahmedabad & Gujarat
    {"clinic": "Vyom Orthodontics & Dental Care", "doctor": "Dr. Kalyani Trivedi", "email": "kalyanimtrivedi@gmail.com", "city": "Ahmedabad", "state": "Gujarat", "specialty": "Orthodontics & Aligners"},
    {"clinic": "Brij Dental Clinic & Implant Center", "doctor": "Dr. Brijesh Patel", "email": "brijdentalclinic@gmail.com", "city": "Ahmedabad", "state": "Gujarat", "specialty": "Dental Implants & Laser"},
    {"clinic": "Sheth Dental Clinic", "doctor": "Dr. Sheth", "email": "shethdentalclinicgogreen@gmail.com", "city": "Ahmedabad", "state": "Gujarat", "specialty": "Multispeciality Dental"},
    {"clinic": "The Dental Wellness Centre", "doctor": "Dr. Mable Patel", "email": "drmableortho@gmail.com", "city": "Ahmedabad", "state": "Gujarat", "specialty": "Orthodontics & Braces"},
    {"clinic": "A2Z Dental Solutions", "doctor": "Dr. Amit Shah", "email": "a2zdentalclinic@gmail.com", "city": "Ahmedabad", "state": "Gujarat", "specialty": "Restorative & Root Canal"},
    {"clinic": "Dr. Rathi’s Cosmetic Dental Clinic", "doctor": "Dr. Vimal Rathi", "email": "dr.vimalrathi@gmail.com", "city": "Surat", "state": "Gujarat", "specialty": "Cosmetic Smile Design"},
    {"clinic": "White Line Dental Clinic", "doctor": "Dr. Sangna Bhuva", "email": "sangnabhuva@gmail.com", "city": "Surat", "state": "Gujarat", "specialty": "Aesthetic & Restorative"},
    {"clinic": "Ocean Dental", "doctor": "Dr. Abhishek Desai", "email": "drabhishekdesai@gmail.com", "city": "Vadodara", "state": "Gujarat", "specialty": "Digital Implantology"},
    {"clinic": "Ashirvad Dental Clinic", "doctor": "Dr. Adrija Kar", "email": "dradrijakar@gmail.com", "city": "Vadodara", "state": "Gujarat", "specialty": "Endodontics & Crowns"},
    {"clinic": "Dr. Radhika Dental Clinic", "doctor": "Dr. Radhika Mavani", "email": "radhikamavani12@gmail.com", "city": "Vadodara", "state": "Gujarat", "specialty": "Preventive & Family Dental"},
    {"clinic": "Shree Rang Dental Care", "doctor": "Dr. Rang", "email": "shreerangdentalcaresurat@gmail.com", "city": "Surat", "state": "Gujarat", "specialty": "Multispeciality"},
    {"clinic": "ToothWorks Dental Care", "doctor": "Dr. S. Mundhada", "email": "smundhada1369@gmail.com", "city": "Vadodara", "state": "Gujarat", "specialty": "Dental Implants"},

    # Delhi NCR & North India
    {"clinic": "Dr. Garg's Multispeciality Dental Center", "doctor": "Dr. Nimit Garg", "email": "drnimitgarg@gmail.com", "city": "New Delhi", "state": "Delhi NCR", "specialty": "Implantology & Full Mouth"},
    {"clinic": "Dentifique Dental Clinic", "doctor": "Dr. Mrinalini Ahuja", "email": "dr.mrinaliniahuja@gmail.com", "city": "New Delhi", "state": "Delhi NCR", "specialty": "Aesthetic Dentistry"},
    {"clinic": "Dr. Sharma's Dental Clinic", "doctor": "Dr. Poonam Sharma", "email": "rampalpoonam176@gmail.com", "city": "New Delhi", "state": "Delhi NCR", "specialty": "Root Canal & Prosthodontics"},
    {"clinic": "Dr. Soni's Dental Clinic", "doctor": "Dr. Rajiv Soni", "email": "advancedentallajpat@gmail.com", "city": "New Delhi", "state": "Delhi NCR", "specialty": "Laser RCT & Implants"},
    {"clinic": "Dental Avenue Clinic", "doctor": "Dr. Avenue Team", "email": "dentalavenueclinic.12@gmail.com", "city": "New Delhi", "state": "Delhi NCR", "specialty": "Cosmetic & Aligners"},
    {"clinic": "Neo Dental Care", "doctor": "Dr. Suhrab Singh", "email": "suhrab.singh@gmail.com", "city": "Noida", "state": "Uttar Pradesh", "specialty": "Single Sitting RCT"},
    {"clinic": "Singh Dental Clinic", "doctor": "Dr. J. P. Singh", "email": "singhdental62@gmail.com", "city": "Noida", "state": "Uttar Pradesh", "specialty": "Prosthetics & Aligners"},
    {"clinic": "The Dental Cares", "doctor": "Dr. Harpreet Singh", "email": "thedentalcares8@gmail.com", "city": "Chandigarh", "state": "Punjab / UT", "specialty": "Root Canal & Prostho"},
    {"clinic": "Chandigarh Dental Clinic", "doctor": "Dr. Viveek Bhalla", "email": "drviveekbhalla@gmail.com", "city": "Chandigarh", "state": "Punjab / UT", "specialty": "Immediate Load Implants"},
    {"clinic": "The Perfect Smile Dental Clinic", "doctor": "Dr. Sarabjeet Singh", "email": "sarabjeet3400@yahoo.co.in", "city": "Chandigarh", "state": "Punjab / UT", "specialty": "Orthodontics & Implants"},
    {"clinic": "Advanced Dental Care Centre", "doctor": "Dr. Anshu Gupta", "email": "chandigarhdentist@yahoo.com", "city": "Chandigarh", "state": "Punjab / UT", "specialty": "Cosmetic Smile Makeover"},

    # Mumbai, Pune & Maharashtra
    {"clinic": "Dr. Goyal's Orthodontic & Dental Care", "doctor": "Dr. N. Goyal", "email": "ngoyal826@gmail.com", "city": "Pune", "state": "Maharashtra", "specialty": "Orthodontics & Braces"},
    {"clinic": "Dr. Ekta's Dental Care Clinic", "doctor": "Dr. Ekta Varma", "email": "ektavarma1993@gmail.com", "city": "Pune", "state": "Maharashtra", "specialty": "Cosmetic & Restorative"},
    {"clinic": "Phadke's Vitality Dental Clinic", "doctor": "Dr. Phadke", "email": "phadkedentalclinic@gmail.com", "city": "Pune", "state": "Maharashtra", "specialty": "General & Family Dental"},
    {"clinic": "Smileinn Dental Clinic", "doctor": "Dr. Anish Joshi", "email": "smileinn@gmail.com", "city": "Pune", "state": "Maharashtra", "specialty": "Prosthodontics & Crowns"},
    {"clinic": "Birla Dental Clinic", "doctor": "Dr. Birla", "email": "birladental@gmail.com", "city": "Pune", "state": "Maharashtra", "specialty": "Family & Cosmetic"},
    {"clinic": "Dr. Raut Dental and Implant Clinic", "doctor": "Dr. Nikhil Raut", "email": "drrautdentalclinic@gmail.com", "city": "Nagpur", "state": "Maharashtra", "specialty": "Basal & Cortical Implants"},
    {"clinic": "Dr. Mistry's Orthodontic Care Centre", "doctor": "Dr. Mistry", "email": "dr.mistry.clinic@gmail.com", "city": "Mumbai", "state": "Maharashtra", "specialty": "Orthodontics & Invisible Aligners"},

    # Bengaluru & South India
    {"clinic": "Chisel Dental Clinic", "doctor": "Dr. Chisel Team", "email": "chiseldentalclinics@gmail.com", "city": "Bengaluru", "state": "Karnataka", "specialty": "Advanced Cosmetic Dentistry"},
    {"clinic": "Dr. Shailaja Prasad's Dental Clinic", "doctor": "Dr. Shailaja Prasad", "email": "shailajak.prasad@gmail.com", "city": "Bengaluru", "state": "Karnataka", "specialty": "Periodontics & Preventive"},
    {"clinic": "Dr. C. Jagadeesh Dental Clinic", "doctor": "Dr. C. Jagadeesh", "email": "drcjagadeeshdentalclinic@gmail.com", "city": "Bengaluru", "state": "Karnataka", "specialty": "Implantology & Surgery"},
    {"clinic": "Amaya Dental Clinic", "doctor": "Dr. Maya S.", "email": "amayadental.ind@gmail.com", "city": "Bengaluru", "state": "Karnataka", "specialty": "Microscopic Dentistry"},
    {"clinic": "Dr Care Dental Hospital", "doctor": "Dr. Vinod", "email": "dr.vinod9999@gmail.com", "city": "Hyderabad", "state": "Telangana", "specialty": "Multispeciality Oral Surgery"},
    {"clinic": "Dr. Keerti's Multi Speciality Dental", "doctor": "Dr. Keerti", "email": "drkeertisdental@gmail.com", "city": "Hyderabad", "state": "Telangana", "specialty": "Single Sitting RCT"},
    {"clinic": "Dr. Mohan Rayapudi Dental Clinic", "doctor": "Dr. Mohan Rayapudi", "email": "dr.rayapudimohan@gmail.com", "city": "Hyderabad", "state": "Telangana", "specialty": "Laser Dental Implants"},
    {"clinic": "Dr. Keerthy Dental Clinic", "doctor": "Dr. Keerthy", "email": "drkeerthydentalclinic@gmail.com", "city": "Hyderabad", "state": "Telangana", "specialty": "Cosmetic & Aligners"},
    {"clinic": "Braceline Orthodontics", "doctor": "Dr. Suhas", "email": "bracelineorthodontics1@gmail.com", "city": "Hyderabad", "state": "Telangana", "specialty": "Braces & Aligners"},
    {"clinic": "Dr. Sridhar Dental Hospital", "doctor": "Dr. Sridhar", "email": "dr.sridhardental@gmail.com", "city": "Hyderabad", "state": "Telangana", "specialty": "Dental Implants"},
    {"clinic": "Smart Dental Clinic", "doctor": "Dr. Sreenivasulu", "email": "smartdentalcareind@gmail.com", "city": "Hyderabad", "state": "Telangana", "specialty": "Digital Aligners"},
    {"clinic": "Sendhil Dental Clinic", "doctor": "Dr. D. Nathan", "email": "drdnathan@gmail.com", "city": "Chennai", "state": "Tamil Nadu", "specialty": "Oral & Maxillofacial"},
    {"clinic": "Rayen Dental Care Centre", "doctor": "Dr. Roshan Rayen", "email": "roshanrayen77@gmail.com", "city": "Chennai", "state": "Tamil Nadu", "specialty": "Implantology & Full Rehab"},
    {"clinic": "Dr. Hari's Dental Centre", "doctor": "Dr. Hari", "email": "drharisdentalcentre@gmail.com", "city": "Chennai", "state": "Tamil Nadu", "specialty": "Digital Smile Designing"},
    {"clinic": "Dr. Arun Care Dental Clinic", "doctor": "Dr. Arun", "email": "caredentalhospitalchennai@gmail.com", "city": "Chennai", "state": "Tamil Nadu", "specialty": "Maxillofacial & Laser"},
    {"clinic": "Rootz Dental Care & Implant Center", "doctor": "Dr. Rootz Team", "email": "rootzdentalcare@gmail.com", "city": "Chennai", "state": "Tamil Nadu", "specialty": "Implants & Aligners"},
    {"clinic": "Pearls Dentistry", "doctor": "Dr. Arunkumar", "email": "pearlstnagar@gmail.com", "city": "Chennai", "state": "Tamil Nadu", "specialty": "Cosmetic Dentistry"},
    {"clinic": "Saratha Dental Clinic", "doctor": "Dr. Saratha", "email": "sarathamedicalcentre@gmail.com", "city": "Chennai", "state": "Tamil Nadu", "specialty": "General & Ortho"},
    {"clinic": "Radiant Smilez Dental", "doctor": "Dr. Arthi Krishnan", "email": "radiantsmilezdental@gmail.com", "city": "Chennai", "state": "Tamil Nadu", "specialty": "Aesthetic Smile Design"},
    {"clinic": "Kumaran Dental Clinic", "doctor": "Dr. Selva", "email": "selvaperio@gmail.com", "city": "Chennai", "state": "Tamil Nadu", "specialty": "Periodontics & Laser"},

    # Madhya Pradesh, Rajasthan & Central India
    {"clinic": "Care Dental Clinic", "doctor": "Dr. Gagan Jaiswal", "email": "dentistgaganj@gmail.com", "city": "Indore", "state": "Madhya Pradesh", "specialty": "General & Cosmetic"},
    {"clinic": "Dr. Leena Srivastava Dental Clinic", "doctor": "Dr. Leena Srivastava", "email": "leena.srivastava@gmail.com", "city": "Indore", "state": "Madhya Pradesh", "specialty": "Comprehensive Family Dental"},
    {"clinic": "Dr. Supriya’s Dental Clinic", "doctor": "Dr. Supriya", "email": "drsupriyasclinic@gmail.com", "city": "Indore", "state": "Madhya Pradesh", "specialty": "Laser Gum Treatment"},
    {"clinic": "Grace Dental Clinic", "doctor": "Dr. Shubhda Gandhi", "email": "drshubhdag@gmail.com", "city": "Indore", "state": "Madhya Pradesh", "specialty": "Periodontics & Implants"},
    {"clinic": "Medident Clinic", "doctor": "Dr. Priya Joshi", "email": "drpriyajoshi2010@gmail.com", "city": "Indore", "state": "Madhya Pradesh", "specialty": "Prosthodontics & Rehab"},
    {"clinic": "Smile Dental Clinic", "doctor": "Dr. Smile Team", "email": "smiledental364@gmail.com", "city": "Indore", "state": "Madhya Pradesh", "specialty": "Root Canal & Crowns"},
    {"clinic": "Shivaay Dental Clinic", "doctor": "Dr. Rashmi Rathore", "email": "rashmiirathore80@gmail.com", "city": "Indore", "state": "Madhya Pradesh", "specialty": "Implant Center"},
    {"clinic": "Dr. Mathur's Dental Clinic & Implant Center", "doctor": "Dr. Mathur", "email": "drmathursclinic@gmail.com", "city": "Jaipur", "state": "Rajasthan", "specialty": "Dental Implants & Cosmetic"},
    {"clinic": "Marudhar Dental Centre", "doctor": "Dr. Rimmi Shekhawat", "email": "marudhardental01@gmail.com", "city": "Jaipur", "state": "Rajasthan", "specialty": "Clear Aligners & Veneers"},
    {"clinic": "FaceKraft Dental Implant Clinic", "doctor": "Dr. Prateek Jain", "email": "dr.jainprateek@gmail.com", "city": "Jaipur", "state": "Rajasthan", "specialty": "Basal & Cortical Implants"},
    {"clinic": "Thaper Dental Clinic", "doctor": "Dr. Thaper", "email": "drthaper@gmail.com", "city": "Jaipur", "state": "Rajasthan", "specialty": "Dental Implants & Laser"},
    {"clinic": "Nirvan’s Dental Clinic", "doctor": "Dr. U. S. Nirvan", "email": "drusnirvan@gmail.com", "city": "Jaipur", "state": "Rajasthan", "specialty": "Advanced Ortho & RCT"},
    {"clinic": "YouDent Hospital", "doctor": "Dr. YouDent Team", "email": "youdentindia@gmail.com", "city": "Jaipur", "state": "Rajasthan", "specialty": "Full Mouth Rehabilitation"},
    {"clinic": "Kanodia Clinic", "doctor": "Dr. Anupam Kanodia", "email": "kanodiaanupam@gmail.com", "city": "Jaipur", "state": "Rajasthan", "specialty": "Implantology & Surgery"},
    {"clinic": "Partani Dental Clinic", "doctor": "Dr. Arun Partani", "email": "arunpartani@gmail.com", "city": "Jaipur", "state": "Rajasthan", "specialty": "Endodontics & Crowns"},

    # UP, Bihar & West Bengal
    {"clinic": "My Dentist Multispeciality Dental", "doctor": "Dr. Singh", "email": "meetdr.singh@gmail.com", "city": "Lucknow", "state": "Uttar Pradesh", "specialty": "Oral Surgery & Implants"},
    {"clinic": "Gupta Dental Clinic", "doctor": "Dr. Awadhesh Kumar Gupta", "email": "awadhesh.kr.gupta@gmail.com", "city": "Lucknow", "state": "Uttar Pradesh", "specialty": "Root Canal & Restorations"},
    {"clinic": "Dr. Aishwarya Dental Studio", "doctor": "Dr. Aishwarya R.", "email": "aishwaryar819@gmail.com", "city": "Patna", "state": "Bihar", "specialty": "Cosmetic Smile Architecture"},
    {"clinic": "Prasad Multispeciality Dental Clinic", "doctor": "Dr. Kunal Prasad", "email": "prasadmultispeciality@gmail.com", "city": "Patna", "state": "Bihar", "specialty": "Micro-Endodontics & Implants"},
    {"clinic": "Magadh Oro Dental", "doctor": "Dr. Oro Team", "email": "magadhorodentalpatna@gmail.com", "city": "Patna", "state": "Bihar", "specialty": "Oral Surgery & Rehab"},
    {"clinic": "Teeth Care Multispeciality Dental Clinic", "doctor": "Dr. Sanket", "email": "drsanketdent@gmail.com", "city": "Kolkata", "state": "West Bengal", "specialty": "Laser Dentistry & Implants"},
    {"clinic": "Dr. Bhadani’s Dental Clinic", "doctor": "Dr. Harshit Bhadani", "email": "dr.harshitbhadani@gmail.com", "city": "Kolkata", "state": "West Bengal", "specialty": "Cosmetic Dentistry & Veneers"},
    {"clinic": "Dr. Indra’s Dental Clinic", "doctor": "Dr. Subha Indra", "email": "subha.indra@gmail.com", "city": "Kolkata", "state": "West Bengal", "specialty": "Advanced Oral Rehab"},
    {"clinic": "Dr. Anuradha Bose Dental Clinic", "doctor": "Dr. Anuradha Bose", "email": "dranuradhabosedentalclinic@gmail.com", "city": "Kolkata", "state": "West Bengal", "specialty": "General & Orthodontics"},
    {"clinic": "Dentistree Clinic", "doctor": "Dr. Dentistree Team", "email": "dentistreekolkata@gmail.com", "city": "Kolkata", "state": "West Bengal", "specialty": "Smile Designing & Aligners"},
    {"clinic": "Great Lakes Dental Clinic", "doctor": "Dr. Abhisek Ghosh", "email": "dr.abhisek24@gmail.com", "city": "Kolkata", "state": "West Bengal", "specialty": "Implantology & Rehab"}
]

def seed_database():
    init_db()
    print(f"Ingesting seed verified leads into Clinaza Master Database...")
    inserted = 0
    for item in SEED_CLINICS:
        ok = insert_lead(
            clinic_name=item["clinic"],
            doctor_name=item["doctor"],
            email=item["email"],
            city=item["city"],
            state=item["state"],
            specialty=item.get("specialty", ""),
            source="curated_seed_v1",
            status="pending"
        )
        if ok:
            inserted += 1
            
    # Mark the 40 leads we already sent earlier as 'sent'
    previously_sent = [
        "kalyanimtrivedi@gmail.com", "brijdentalclinic@gmail.com", "drnimitgarg@gmail.com",
        "dr.mrinaliniahuja@gmail.com", "rampalpoonam176@gmail.com", "ngoyal826@gmail.com",
        "ektavarma1993@gmail.com", "phadkedentalclinic@gmail.com", "dr.mistry.clinic@gmail.com",
        "chiseldentalclinics@gmail.com", "shailajak.prasad@gmail.com", "dr.vinod9999@gmail.com",
        "drkeertisdental@gmail.com", "dr.rayapudimohan@gmail.com", "drdnathan@gmail.com",
        "roshanrayen77@gmail.com", "drharisdentalcentre@gmail.com", "drmathursclinic@gmail.com",
        "marudhardental01@gmail.com", "dr.jainprateek@gmail.com", "dr.vimalrathi@gmail.com",
        "sangnabhuva@gmail.com", "drabhishekdesai@gmail.com", "dradrijakar@gmail.com",
        "dentistgaganj@gmail.com", "leena.srivastava@gmail.com", "drsupriyasclinic@gmail.com",
        "drshubhdag@gmail.com", "drpriyajoshi2010@gmail.com", "meetdr.singh@gmail.com",
        "awadhesh.kr.gupta@gmail.com", "aishwaryar819@gmail.com", "prasadmultispeciality@gmail.com",
        "drsanketdent@gmail.com", "dr.harshitbhadani@gmail.com", "subha.indra@gmail.com",
        "dranuradhabosedentalclinic@gmail.com", "youdentindia@gmail.com", "kanodiaanupam@gmail.com",
        "caredentalhospitalchennai@gmail.com"
    ]
    
    from leads_db import get_db_connection
    conn = get_db_connection()
    c = conn.cursor()
    for s_email in previously_sent:
        c.execute("UPDATE leads SET status = 'sent', sent_at = CURRENT_TIMESTAMP WHERE email = ?", (s_email.lower(),))
    conn.commit()
    conn.close()

    stats = get_db_stats()
    print(f"Seeding completed successfully!")
    print(f"Stats: {stats}")

if __name__ == "__main__":
    seed_database()
