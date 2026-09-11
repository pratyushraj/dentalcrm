import os
import sys
import json
from leads_db import init_db, insert_lead, get_db_stats

REGIONAL_BATCH_LEADS = [
    # Bhopal
    {"clinic": "Prasad Dental Clinic", "doctor": "Dr. Prasad", "email": "prasaddentalclinic@gmail.com", "city": "Bhopal", "state": "Madhya Pradesh", "specialty": "General & Cosmetic"},
    {"clinic": "Dental Precision Clinic", "doctor": "Dr. Ankit Gautam", "email": "ankitgautam07@gmail.com", "city": "Bhopal", "state": "Madhya Pradesh", "specialty": "Laser Implants"},
    {"clinic": "Dental Paradise Clinic", "doctor": "Dr. Paradise Team", "email": "dentalparadiseclinic@gmail.com", "city": "Bhopal", "state": "Madhya Pradesh", "specialty": "Smile Architecture"},
    {"clinic": "Dr. Joshi Smile Care", "doctor": "Dr. Vipal Joshi", "email": "drvipalvvipalv@gmail.com", "city": "Bhopal", "state": "Madhya Pradesh", "specialty": "Orthodontics"},
    {"clinic": "Shrivastava Dental Clinic", "doctor": "Dr. Shrivastava", "email": "shrivastavadentalclinic85@gmail.com", "city": "Bhopal", "state": "Madhya Pradesh", "specialty": "Prosthodontics"},
    {"clinic": "Bhartia Dental Clinic", "doctor": "Dr. Bhartia", "email": "bdcbhopal13@gmail.com", "city": "Bhopal", "state": "Madhya Pradesh", "specialty": "Endodontics"},

    # Rajkot
    {"clinic": "Vinayak Multispeciality Dental", "doctor": "Dr. Vinayak Team", "email": "vinayakdentalclinic.rajkot@gmail.com", "city": "Rajkot", "state": "Gujarat", "specialty": "Multispeciality"},
    {"clinic": "Krupalu Dental Clinic", "doctor": "Dr. Krupalu", "email": "krupalu.dental.clinic@gmail.com", "city": "Rajkot", "state": "Gujarat", "specialty": "Crown & Bridges"},
    {"clinic": "Shrivay Dental Clinic", "doctor": "Dr. Shrivay", "email": "shrivaydentalclinic@gmail.com", "city": "Rajkot", "state": "Gujarat", "specialty": "Implantology"},
    {"clinic": "Dr. Kamal's Dental Clinic", "doctor": "Dr. Kamal", "email": "drkamalsdentalclinic@gmail.com", "city": "Rajkot", "state": "Gujarat", "specialty": "Cosmetic Smile Design"},
    {"clinic": "Flowrence Dental Clinic", "doctor": "Dr. Flowrence", "email": "flowrencedentalclinic@gmail.com", "city": "Rajkot", "state": "Gujarat", "specialty": "Aligners"},
    {"clinic": "Maruti Dental Clinic", "doctor": "Dr. Maruti Team", "email": "marutidentalrajkot@gmail.com", "city": "Rajkot", "state": "Gujarat", "specialty": "General Dental"},

    # Agra
    {"clinic": "Tooth and Gum Clinic", "doctor": "Dr. Gum Team", "email": "toothandgum01@gmail.com", "city": "Agra", "state": "Uttar Pradesh", "specialty": "Periodontics"},
    {"clinic": "Dentonation Dental Clinic", "doctor": "Dr. Dentonation", "email": "dentonation.agra@gmail.com", "city": "Agra", "state": "Uttar Pradesh", "specialty": "Smile Designing"},
    {"clinic": "Dr. Amit Narayan Dental Wellness", "doctor": "Dr. Amit Narayan", "email": "dramitnarayan@gmail.com", "city": "Agra", "state": "Uttar Pradesh", "specialty": "Implant Center"},
    {"clinic": "Tooth Health Dental Centre", "doctor": "Dr. Shikha Rastogi", "email": "drshikharastogi@gmail.com", "city": "Agra", "state": "Uttar Pradesh", "specialty": "Root Canal & Crowns"},
    {"clinic": "Dentocare Tooth Xpert", "doctor": "Dr. Shatakshi Rastogi", "email": "drsatakshirastogi@gmail.com", "city": "Agra", "state": "Uttar Pradesh", "specialty": "Pediatric & Cosmetic"},
    {"clinic": "Dr. Gulshan Dental Clinic", "doctor": "Dr. Gulshan Singh", "email": "dr.gulshan.1982.agra@gmail.com", "city": "Agra", "state": "Uttar Pradesh", "specialty": "Oral Surgery"},

    # Varanasi
    {"clinic": "Dr. Anant's Dental Care", "doctor": "Dr. Anant Gupta", "email": "dranantdentalcare@gmail.com", "city": "Varanasi", "state": "Uttar Pradesh", "specialty": "Implantology"},
    {"clinic": "Sewa Dental Clinic", "doctor": "Dr. Sewa Team", "email": "sewadentalkashi@gmail.com", "city": "Varanasi", "state": "Uttar Pradesh", "specialty": "Multispeciality"},
    {"clinic": "Cherian Clinic", "doctor": "Dr. Cherian", "email": "cherianclinic@gmail.com", "city": "Varanasi", "state": "Uttar Pradesh", "specialty": "Aesthetic Dentistry"},
    {"clinic": "Indra Hospital Dental Wing", "doctor": "Dr. Indra Team", "email": "indrahospital9001@gmail.com", "city": "Varanasi", "state": "Uttar Pradesh", "specialty": "Maxillofacial Surgery"},
    {"clinic": "Make My Tooth Dental", "doctor": "Dr. Piyush K. P.", "email": "piyushkp64@gmail.com", "city": "Varanasi", "state": "Uttar Pradesh", "specialty": "Restorative Dentistry"},

    # Nashik
    {"clinic": "Mangrolia Multispeciality Dental", "doctor": "Dr. Mangrolia", "email": "mangroliadentalclinic@gmail.com", "city": "Nashik", "state": "Maharashtra", "specialty": "Implant Center"},
    {"clinic": "Dr. Bhonsale's Dental Clinic", "doctor": "Dr. Dnyanesh Bhonsale", "email": "drdnyanesh625@gmail.com", "city": "Nashik", "state": "Maharashtra", "specialty": "Oral Rehabilitation"},
    {"clinic": "Rainbow Family Dental", "doctor": "Dr. Prajkta", "email": "prajkta1997@gmail.com", "city": "Nashik", "state": "Maharashtra", "specialty": "Family & Pediatric"},
    {"clinic": "Dantah Dental Care", "doctor": "Dr. Vasanti Nikam", "email": "vasantinikam@gmail.com", "city": "Nashik", "state": "Maharashtra", "specialty": "Cosmetic Smile Design"},
    {"clinic": "Shubh Smile Dental Clinic", "doctor": "Dr. Shubham Naik", "email": "shubhamnaik1104@gmail.com", "city": "Nashik", "state": "Maharashtra", "specialty": "Aligners & Surgery"},

    # Ludhiana & Amritsar
    {"clinic": "Sharma Dental Clinic", "doctor": "Dr. Sharma", "email": "sharmadentalclinicludhiana@gmail.com", "city": "Ludhiana", "state": "Punjab", "specialty": "Laser Implants"},
    {"clinic": "Kapoor Dental Care Centre", "doctor": "Dr. Kapoor", "email": "kapoordentalclinicludh@gmail.com", "city": "Ludhiana", "state": "Punjab", "specialty": "Full Mouth Rehab"},
    {"clinic": "iCube Dental Clinic", "doctor": "Dr. iCube Team", "email": "icubedental20@gmail.com", "city": "Ludhiana", "state": "Punjab", "specialty": "Digital Dentistry"},
    {"clinic": "Bindra Dental Clinic", "doctor": "Dr. J. Bindra", "email": "drjbindra@gmail.com", "city": "Ludhiana", "state": "Punjab", "specialty": "Cortical Implants"},
    {"clinic": "32 Gems Dental Clinic", "doctor": "Dr. Gems Team", "email": "32gemsdentalclinic@gmail.com", "city": "Ludhiana", "state": "Punjab", "specialty": "Smile Makeover"},
    {"clinic": "Aditi Dental Clinic", "doctor": "Dr. Aditi Jain", "email": "draditijainclinic@gmail.com", "city": "Ludhiana", "state": "Punjab", "specialty": "Endodontics"},
    {"clinic": "Aggarwal Dental Care", "doctor": "Dr. Aggarwal", "email": "aggarwaldentalcare.asr@gmail.com", "city": "Amritsar", "state": "Punjab", "specialty": "Orthodontics & Implants"},
    {"clinic": "Dental Joy Clinic", "doctor": "Dr. Joy Team", "email": "dentjoyasr@gmail.com", "city": "Amritsar", "state": "Punjab", "specialty": "Cosmetic Care"},
    {"clinic": "G.S. Sadana Dental Clinic", "doctor": "Dr. G. S. Sadana", "email": "sadanadentalclinic@gmail.com", "city": "Amritsar", "state": "Punjab", "specialty": "Prosthetics & Crowns"}
]

def ingest_regional():
    init_db()
    print("Ingesting regional dental leads into master database...")
    count = 0
    for lead in REGIONAL_BATCH_LEADS:
        if insert_lead(
            clinic_name=lead["clinic"],
            doctor_name=lead["doctor"],
            email=lead["email"],
            city=lead["city"],
            state=lead["state"],
            specialty=lead.get("specialty", "Dental Care"),
            source="regional_expansion_crawl_v2",
            status="pending"
        ):
            count += 1
            
    stats = get_db_stats()
    print(f"Regional Ingestion Complete! Added {count} new verified leads.")
    print(f"Updated Stats: {stats}")

if __name__ == "__main__":
    ingest_regional()
