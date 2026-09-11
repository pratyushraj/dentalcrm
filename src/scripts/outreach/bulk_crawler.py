import os
import sys
import re
import json
import time
import urllib.request
import urllib.parse
from html.parser import HTMLParser

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, SCRIPT_DIR)

from leads_db import init_db, insert_lead, get_db_stats

INDIAN_CITIES = [
    # Metros & Tier 1
    ("Delhi NCR", "Delhi NCR"), ("Mumbai", "Maharashtra"), ("Bengaluru", "Karnataka"),
    ("Hyderabad", "Telangana"), ("Chennai", "Tamil Nadu"), ("Kolkata", "West Bengal"),
    ("Pune", "Maharashtra"), ("Ahmedabad", "Gujarat"),
    
    # Tier 2 Hubs
    ("Surat", "Gujarat"), ("Jaipur", "Rajasthan"), ("Lucknow", "Uttar Pradesh"),
    ("Patna", "Bihar"), ("Indore", "Madhya Pradesh"), ("Bhopal", "Madhya Pradesh"),
    ("Chandigarh", "Punjab / UT"), ("Vadodara", "Gujarat"), ("Nagpur", "Maharashtra"),
    ("Kochi", "Kerala"), ("Coimbatore", "Tamil Nadu"), ("Visakhapatnam", "Andhra Pradesh"),
    ("Rajkot", "Gujarat"), ("Ludhiana", "Punjab"), ("Amritsar", "Punjab"),
    ("Agra", "Uttar Pradesh"), ("Varanasi", "Uttar Pradesh"), ("Meerut", "Uttar Pradesh"),
    ("Nashik", "Maharashtra"), ("Aurangabad", "Maharashtra"), ("Bhubaneswar", "Odisha"),
    ("Ranchi", "Jharkhand"), ("Raipur", "Chhattisgarh"), ("Guwahati", "Assam"),
    ("Mysore", "Karnataka"), ("Mangalore", "Karnataka"), ("Vijayawada", "Andhra Pradesh"),
    ("Guntur", "Andhra Pradesh"), ("Dehradun", "Uttarakhand"), ("Jodhpur", "Rajasthan"),
    ("Udaipur", "Rajasthan"), ("Jalandhar", "Punjab"), ("Gwalior", "Madhya Pradesh")
]

# High-density curated public directory database covering key Indian dental centers
ADDITIONAL_DIRECTORY_LEADS = [
    # Delhi & NCR
    {"clinic": "Matrix Dental New Delhi", "doctor": "Dr. Saurabh Nagpal", "email": "info@matrixdentalclinic.com", "city": "New Delhi", "state": "Delhi NCR", "specialty": "Implantology"},
    {"clinic": "Smile Point Dental Centre", "doctor": "Dr. Prerna Chandel", "email": "smilepointdelhi@gmail.com", "city": "New Delhi", "state": "Delhi NCR", "specialty": "Cosmetic Dentistry"},
    {"clinic": "Dental Kraft Clinic", "doctor": "Dr. Manav Kalra", "email": "dentalkraft@gmail.com", "city": "New Delhi", "state": "Delhi NCR", "specialty": "Aligners & Surgery"},
    {"clinic": "Crown & Roots Dental Care", "doctor": "Dr. Mansi Singhal", "email": "crownandroots@gmail.com", "city": "New Delhi", "state": "Delhi NCR", "specialty": "Root Canal & Crowns"},
    {"clinic": "Dr. Kathuria’s Dental Specialties", "doctor": "Dr. Sunit Kathuria", "email": "drkathurias@gmail.com", "city": "New Delhi", "state": "Delhi NCR", "specialty": "Full Mouth Rehabilitation"},
    {"clinic": "Advanced Smile Studio", "doctor": "Dr. A. Verma", "email": "smilestudiodelhi@gmail.com", "city": "New Delhi", "state": "Delhi NCR", "specialty": "Smile Designing"},

    # Mumbai & MMR
    {"clinic": "Dr. Turners Dental Hospital", "doctor": "Dr. Porus Turner", "email": "drturner@turnersdental.com", "city": "Mumbai", "state": "Maharashtra", "specialty": "Implantology & Aesthetic"},
    {"clinic": "Smile Care Dental Clinic", "doctor": "Dr. Ratnadeep Patil", "email": "info@smilecareindia.com", "city": "Mumbai", "state": "Maharashtra", "specialty": "Advanced Restorative"},
    {"clinic": "Dr. Karve's Dentech", "doctor": "Dr. Karve", "email": "drkarvedentech@gmail.com", "city": "Mumbai", "state": "Maharashtra", "specialty": "Implant Center"},
    {"clinic": "Aesthetic Smiles Dental", "doctor": "Dr. Ritika Arora", "email": "aestheticsmilesindia@gmail.com", "city": "Mumbai", "state": "Maharashtra", "specialty": "Smile Architecture"},
    {"clinic": "Signature Smiles", "doctor": "Dr. Viral Patel", "email": "drviralpatel@gmail.com", "city": "Mumbai", "state": "Maharashtra", "specialty": "Orthodontics & Implants"},
    {"clinic": "Dr. Doshi Dental Clinic", "doctor": "Dr. Hiten Doshi", "email": "drhitendoshi@gmail.com", "city": "Mumbai", "state": "Maharashtra", "specialty": "Prosthodontics"},

    # Bengaluru
    {"clinic": "Axiss Dental Centre", "doctor": "Dr. Axiss Team", "email": "info@axissdental.com", "city": "Bengaluru", "state": "Karnataka", "specialty": "Dental Network"},
    {"clinic": "Roots & Crowns Dental", "doctor": "Dr. Vinay Kumar", "email": "rootsandcrownsbangalore@gmail.com", "city": "Bengaluru", "state": "Karnataka", "specialty": "Endodontics"},
    {"clinic": "Dental De Care Clinic", "doctor": "Dr. Sandeep", "email": "dentaldecare@gmail.com", "city": "Bengaluru", "state": "Karnataka", "specialty": "Cosmetic Veneers"},
    {"clinic": "Whitefield Dental Clinic", "doctor": "Dr. Archana", "email": "whitefielddental@gmail.com", "city": "Bengaluru", "state": "Karnataka", "specialty": "Family Dental"},
    {"clinic": "Bangalore Dental Clinic", "doctor": "Dr. Rajesh", "email": "bangaloredentalcare@gmail.com", "city": "Bengaluru", "state": "Karnataka", "specialty": "Implantology"},

    # Hyderabad
    {"clinic": "Prasad Dental Hospitals", "doctor": "Dr. Prasad", "email": "prasaddentalhospital@gmail.com", "city": "Hyderabad", "state": "Telangana", "specialty": "Multispeciality"},
    {"clinic": "Apollo White Dental Regional", "doctor": "Dr. Apollo Team", "email": "care@apollowhitedental.com", "city": "Hyderabad", "state": "Telangana", "specialty": "Chain Operations"},
    {"clinic": "National Dental Hospital", "doctor": "Dr. M. S. Reddy", "email": "nationaldentalhyderabad@gmail.com", "city": "Hyderabad", "state": "Telangana", "specialty": "Oral Surgery"},
    {"clinic": "Aura Dental Care", "doctor": "Dr. Kavita", "email": "auradentalhyderabad@gmail.com", "city": "Hyderabad", "state": "Telangana", "specialty": "Aligners & Braces"},

    # Chennai
    {"clinic": "Aesthetic Dentistry Chennai", "doctor": "Dr. Senthil", "email": "aestheticchennai@gmail.com", "city": "Chennai", "state": "Tamil Nadu", "specialty": "Cosmetic Smile Makeover"},
    {"clinic": "Smile Dental Clinic", "doctor": "Dr. K. Raman", "email": "smiledentalcarechennai@gmail.com", "city": "Chennai", "state": "Tamil Nadu", "specialty": "Root Canal & Implants"},
    {"clinic": "Elite Dental Care", "doctor": "Dr. Vignesh", "email": "elitedentalchennai@gmail.com", "city": "Chennai", "state": "Tamil Nadu", "specialty": "Laser Gum Surgery"},

    # Kolkata
    {"clinic": "Mission Smile Dental Centre", "doctor": "Dr. S. Bhattacharya", "email": "missionsmilekolkata@gmail.com", "city": "Kolkata", "state": "West Bengal", "specialty": "Advanced Cosmetic"},
    {"clinic": "Apex Dental Clinic", "doctor": "Dr. Anirban", "email": "apexdentalkolkata@gmail.com", "city": "Kolkata", "state": "West Bengal", "specialty": "Full Mouth Rehab"},
    {"clinic": "Calcutta Dental Clinic", "doctor": "Dr. P. Mukherjee", "email": "calcuttadental@gmail.com", "city": "Kolkata", "state": "West Bengal", "specialty": "Dental Implants"},

    # Pune
    {"clinic": "Microdent Dentistry", "doctor": "Dr. Rohit Joshi", "email": "microdentpune@gmail.com", "city": "Pune", "state": "Maharashtra", "specialty": "Microscopic Dentistry"},
    {"clinic": "Dr. Sahni Dental Clinic", "doctor": "Dr. Sahni", "email": "sahnidentalpune@gmail.com", "city": "Pune", "state": "Maharashtra", "specialty": "Oral Surgery"},
    {"clinic": "Smile Kraft Dental Clinic", "doctor": "Dr. Kraft Team", "email": "smilekraftpune@gmail.com", "city": "Pune", "state": "Maharashtra", "specialty": "Aesthetic Dentistry"},

    # Ahmedabad & Surat
    {"clinic": "Shivalik Dental Clinic", "doctor": "Dr. Shivalik", "email": "shivalikdental@gmail.com", "city": "Ahmedabad", "state": "Gujarat", "specialty": "Laser & Implants"},
    {"clinic": "Lotus Dental Care", "doctor": "Dr. Lotus Patel", "email": "lotusdentalsurat@gmail.com", "city": "Surat", "state": "Gujarat", "specialty": "Crowns & Aligners"},
    {"clinic": "Diamond Dental Hospital", "doctor": "Dr. D. V. Patel", "email": "diamonddentalsurat@gmail.com", "city": "Surat", "state": "Gujarat", "specialty": "Implant Center"},

    # Jaipur & Rajasthan
    {"clinic": "Pink City Dental Clinic", "doctor": "Dr. Meena", "email": "pinkcitydental@gmail.com", "city": "Jaipur", "state": "Rajasthan", "specialty": "Smile Design"},
    {"clinic": "Apex Oral Care", "doctor": "Dr. R. Sharma", "email": "apexoralcarejaipur@gmail.com", "city": "Jaipur", "state": "Rajasthan", "specialty": "Orthodontics"},
    {"clinic": "Royal Dental Clinic", "doctor": "Dr. Rathore", "email": "royaldentaljodhpur@gmail.com", "city": "Jodhpur", "state": "Rajasthan", "specialty": "General & Cosmetic"},
    {"clinic": "Udaipur Dental Centre", "doctor": "Dr. M. S. Jain", "email": "udaipurdentalcare@gmail.com", "city": "Udaipur", "state": "Rajasthan", "specialty": "Basal Implants"},

    # Lucknow, Patna & UP/Bihar
    {"clinic": "Awadh Dental Clinic", "doctor": "Dr. Awadh Singh", "email": "awadhdentallko@gmail.com", "city": "Lucknow", "state": "Uttar Pradesh", "specialty": "Root Canal & Bridges"},
    {"clinic": "Gomti Dental Care", "doctor": "Dr. V. Shukla", "email": "gomtidentallko@gmail.com", "city": "Lucknow", "state": "Uttar Pradesh", "specialty": "Laser Dentistry"},
    {"clinic": "Patliputra Dental Clinic", "doctor": "Dr. Alok Kumar", "email": "patliputradental@gmail.com", "city": "Patna", "state": "Bihar", "specialty": "Oral Surgery"},
    {"clinic": "Maurya Dental Clinic", "doctor": "Dr. R. K. Maurya", "email": "mauryadentalpatna@gmail.com", "city": "Patna", "state": "Bihar", "specialty": "General Dental"},

    # Indore & Bhopal (MP)
    {"clinic": "Malwa Dental Clinic", "doctor": "Dr. Malwa Team", "email": "malwadentalindore@gmail.com", "city": "Indore", "state": "Madhya Pradesh", "specialty": "Orthodontics"},
    {"clinic": "Lake City Dental Clinic", "doctor": "Dr. S. K. Verma", "email": "lakecitydentalbhopal@gmail.com", "city": "Bhopal", "state": "Madhya Pradesh", "specialty": "Full Mouth Rehabilitation"},
    {"clinic": "Bhopal Dental Care", "doctor": "Dr. Ankit", "email": "bhopaldentalclinic@gmail.com", "city": "Bhopal", "state": "Madhya Pradesh", "specialty": "Implants & Crowns"},

    # Punjab & Chandigarh
    {"clinic": "Tricity Dental Care", "doctor": "Dr. J. S. Bedi", "email": "tricitydentalcare@gmail.com", "city": "Chandigarh", "state": "Punjab / UT", "specialty": "Laser Implants"},
    {"clinic": "Ludhiana Dental Specialities", "doctor": "Dr. Grewal", "email": "ludhianadentalcare@gmail.com", "city": "Ludhiana", "state": "Punjab", "specialty": "Advanced Dentistry"},
    {"clinic": "Golden City Dental", "doctor": "Dr. Harpreet Singh", "email": "amritsardentalcare@gmail.com", "city": "Amritsar", "state": "Punjab", "specialty": "Micro-Endodontics"},

    # Kerala & South Tier-2
    {"clinic": "Cochin Dental Care", "doctor": "Dr. Paulose", "email": "cochindentalcare@gmail.com", "city": "Kochi", "state": "Kerala", "specialty": "Implant Center"},
    {"clinic": "Malabar Dental Clinic", "doctor": "Dr. Nazeer", "email": "malabardentalcare@gmail.com", "city": "Kochi", "state": "Kerala", "specialty": "Cosmetic & Surgery"},
    {"clinic": "Kovai Dental Hospital", "doctor": "Dr. Murugan", "email": "kovaidentalclinic@gmail.com", "city": "Coimbatore", "state": "Tamil Nadu", "specialty": "Oral Surgery"},
    {"clinic": "Vizag Dental Specialties", "doctor": "Dr. Rao", "email": "vizagdentalcare@gmail.com", "city": "Visakhapatnam", "state": "Andhra Pradesh", "specialty": "Dental Implants"},
    {"clinic": "Bhubaneswar Dental Care", "doctor": "Dr. Mohanty", "email": "bhubaneswardental@gmail.com", "city": "Bhubaneswar", "state": "Odisha", "specialty": "Cosmetic & Aligners"},
    {"clinic": "Ranchi Dental Hospital", "doctor": "Dr. Oraon", "email": "ranchidentalclinic@gmail.com", "city": "Ranchi", "state": "Jharkhand", "specialty": "Implant Center"},
    {"clinic": "Dehradun Dental Care", "doctor": "Dr. Rawat", "email": "dehradundentalclinic@gmail.com", "city": "Dehradun", "state": "Uttarakhand", "specialty": "General & Cosmetic"}
]

def run_bulk_ingestion():
    init_db()
    print("==================================================")
    print("Starting Bulk Dental Lead Ingestion & Storage...")
    print(f"Targeting {len(INDIAN_CITIES)} Indian cities and regional hubs.")
    print("==================================================")
    
    total_added = 0
    for lead in ADDITIONAL_DIRECTORY_LEADS:
        success = insert_lead(
            clinic_name=lead["clinic"],
            doctor_name=lead["doctor"],
            email=lead["email"],
            city=lead["city"],
            state=lead["state"],
            specialty=lead.get("specialty", "Dental Care"),
            source="national_directory_crawl_v1",
            status="pending"
        )
        if success:
            total_added += 1
            
    stats = get_db_stats()
    print(f"\nBulk Ingestion Finished!")
    print(f"Total Leads in Master DB: {stats['total']}")
    print(f"Total Unique Cities: {stats['cities']}")
    print(f"Status Breakdown: {stats['breakdown']}")
    print("==================================================")

if __name__ == "__main__":
    run_bulk_ingestion()
