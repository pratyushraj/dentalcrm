import os
import sys
import sqlite3

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, SCRIPT_DIR)

from leads_db import init_db, insert_lead, get_db_stats

NEW_HIGH_INTENT_LEADS = [
    # Bengaluru
    {"clinic": "Aesthetic Dental Clinic", "doctor": "Dr. Aesthetic Team", "email": "aestheticdentalcghs@gmail.com", "city": "Bengaluru", "state": "Karnataka", "specialty": "Multispeciality"},
    {"clinic": "You Smile Dental Clinic", "doctor": "Dr. Khushbu", "email": "dr.khushbu1989@gmail.com", "city": "Bengaluru", "state": "Karnataka", "specialty": "Cosmetic Dentistry"},
    {"clinic": "KDC Dental Care", "doctor": "Dr. KDC Team", "email": "kdc.care@gmail.com", "city": "Bengaluru", "state": "Karnataka", "specialty": "General Dental"},
    {"clinic": "Braces & Smile Dental Clinic", "doctor": "Dr. Smile Team", "email": "brace_smiledentalclinic@gmail.com", "city": "Bengaluru", "state": "Karnataka", "specialty": "Orthodontics"},
    {"clinic": "Dental Health Care Clinic", "doctor": "Dr. Aarti S. R.", "email": "aartisr@gmail.com", "city": "Bengaluru", "state": "Karnataka", "specialty": "Restorative & RCT"},
    {"clinic": "Align Dental Clinic", "doctor": "Dr. Align Team", "email": "thealigndentalclinic@gmail.com", "city": "Bengaluru", "state": "Karnataka", "specialty": "Clear Aligners"},
    {"clinic": "VK Dentalcare", "doctor": "Dr. V. K. Team", "email": "vkmaxfacs@gmail.com", "city": "Bengaluru", "state": "Karnataka", "specialty": "Maxillofacial Surgery"},
    {"clinic": "Dr. Ali's Denta Care", "doctor": "Dr. Ali", "email": "dralisdentacare@gmail.com", "city": "Bengaluru", "state": "Karnataka", "specialty": "Dental Implants"},

    # Delhi NCR
    {"clinic": "Dent Ally", "doctor": "Dr. Dent Ally Team", "email": "infodentally@gmail.com", "city": "New Delhi", "state": "Delhi NCR", "specialty": "Aesthetic Dentistry"},
    {"clinic": "Dr. Goyal's Dental Clinic", "doctor": "Dr. Harsh Goyal", "email": "drgoyaldental@gmail.com", "city": "New Delhi", "state": "Delhi NCR", "specialty": "Implantology"},
    {"clinic": "Dental Care 'N' Cure", "doctor": "Dr. Mansi Arora", "email": "drmansiarora@gmail.com", "city": "New Delhi", "state": "Delhi NCR", "specialty": "Prosthodontics"},
    {"clinic": "Bright Smile Dental Clinic", "doctor": "Dr. Naaz", "email": "naaz.pisces@gmail.com", "city": "New Delhi", "state": "Delhi NCR", "specialty": "Cosmetic Smile Makeover"},
    {"clinic": "City Dental Centre", "doctor": "Dr. Anurag Ahuja", "email": "dranuragahuja@gmail.com", "city": "Noida", "state": "Uttar Pradesh", "specialty": "Implantology & Full Mouth"},
    {"clinic": "Hope Dental & Esthetic Clinic", "doctor": "Dr. Bhoj Team", "email": "hopeclinic.bhoj@gmail.com", "city": "Noida", "state": "Uttar Pradesh", "specialty": "Esthetic Dentistry"},
    {"clinic": "Noida Dental Solutions", "doctor": "Dr. Solutions Team", "email": "noidadentalsolutions@gmail.com", "city": "Noida", "state": "Uttar Pradesh", "specialty": "Restorative Dentistry"},
    {"clinic": "Niramaya Dental Implant Clinic", "doctor": "Dr. Pragya", "email": "niramaya.pragya@gmail.com", "city": "Noida", "state": "Uttar Pradesh", "specialty": "Dental Implants"},
    {"clinic": "Tripathy Dental Clinic", "doctor": "Dr. Tripathy", "email": "tripathydentalclinic@gmail.com", "city": "Noida", "state": "Uttar Pradesh", "specialty": "General & Cosmetic"},
    {"clinic": "The Dental Cure", "doctor": "Dr. Pooja Yadav", "email": "thedentalcureg@gmail.com", "city": "Gurgaon", "state": "Haryana", "specialty": "Orthodontics & Aligners"},
    {"clinic": "SmileCity Dental Clinic", "doctor": "Dr. SmileCity Team", "email": "smilecity.gurgaon@gmail.com", "city": "Gurgaon", "state": "Haryana", "specialty": "Advanced Restorative"},
    {"clinic": "Dr. J's Dental Clinic", "doctor": "Dr. J Team", "email": "drjsdentalclinic@gmail.com", "city": "Gurgaon", "state": "Haryana", "specialty": "Implant Center"},
    {"clinic": "The Bright Smile Gurgaon", "doctor": "Dr. Bright Team", "email": "thebrightsmile19@gmail.com", "city": "Gurgaon", "state": "Haryana", "specialty": "Smile Designing"},
    {"clinic": "Dr. Devesh Jain Advance Dental Clinic", "doctor": "Dr. Devesh Jain", "email": "deveshjain7427@gmail.com", "city": "Ghaziabad", "state": "Uttar Pradesh", "specialty": "Laser Implants"},
    {"clinic": "Dr. Aditya Dental Kraft", "doctor": "Dr. Aditya Chauhan", "email": "adityachauhan8055@gmail.com", "city": "Ghaziabad", "state": "Uttar Pradesh", "specialty": "Orthodontics & Implants"},
    {"clinic": "Dr. Urvashi Verma Dental Clinic", "doctor": "Dr. Urvashi Verma", "email": "vermaurvashi12@gmail.com", "city": "Ghaziabad", "state": "Uttar Pradesh", "specialty": "Prosthodontics"},
    {"clinic": "Prime Dental Clinic Vaishali", "doctor": "Dr. Vikas Singh", "email": "drvikassingh01@gmail.com", "city": "Ghaziabad", "state": "Uttar Pradesh", "specialty": "Oral Surgery"},

    # Mumbai & MMR
    {"clinic": "Andheri Dental Clinic", "doctor": "Dr. Andheri Team", "email": "anderidentalclinic999@gmail.com", "city": "Mumbai", "state": "Maharashtra", "specialty": "Cosmetic & Implants"},
    {"clinic": "Apex Dental Clinic Chembur", "doctor": "Dr. Shreya Gandhi", "email": "apexdentalmumbai@gmail.com", "city": "Mumbai", "state": "Maharashtra", "specialty": "Restorative Dentistry"},
    {"clinic": "Procare Dental Clinic", "doctor": "Dr. Pratik Chheda", "email": "pratik.s.chheda@gmail.com", "city": "Mumbai", "state": "Maharashtra", "specialty": "Implantology"},
    {"clinic": "Om Datta Dental Clinic", "doctor": "Dr. Om Datta Team", "email": "omdattadentalclinic@gmail.com", "city": "Mumbai", "state": "Maharashtra", "specialty": "General & Family Dental"},
    {"clinic": "Dr. Neeraj's Dental Clinic", "doctor": "Dr. Neeraj", "email": "dr.neerajdental@gmail.com", "city": "Navi Mumbai", "state": "Maharashtra", "specialty": "Advanced Dental Care"},
    {"clinic": "Smile Please Dental Clinic", "doctor": "Dr. Sharad Kumar", "email": "shharrad@gmail.com", "city": "Navi Mumbai", "state": "Maharashtra", "specialty": "Orthodontics & Aligners"},

    # Hyderabad
    {"clinic": "Redesign Dental Clinics", "doctor": "Dr. Redesign Team", "email": "redesigndental@gmail.com", "city": "Hyderabad", "state": "Telangana", "specialty": "Cosmetic & Implants"},
    {"clinic": "Dental Specialists Hospital", "doctor": "Dr. Specialist Team", "email": "dentalspecialistsindia@gmail.com", "city": "Hyderabad", "state": "Telangana", "specialty": "Full Mouth Rehabilitation"},

    # Pune
    {"clinic": "Vanilla Smiles Dental Clinic", "doctor": "Dr. Abhishek Soni", "email": "vanillasmilesdentalclinic@gmail.com", "city": "Pune", "state": "Maharashtra", "specialty": "Aesthetic Dentistry"},
    {"clinic": "Dixit Dental Clinic", "doctor": "Dr. Manisha Dixit", "email": "dixitclinic@gmail.com", "city": "Pune", "state": "Maharashtra", "specialty": "Root Canal & Crowns"},
    {"clinic": "Dr. Awanthi's Dental Clinic", "doctor": "Dr. Awanthi", "email": "dr.awanthis1234@gmail.com", "city": "Pune", "state": "Maharashtra", "specialty": "Cosmetic Care"},
    {"clinic": "Pathak Dental Clinic", "doctor": "Dr. Manish Pathak", "email": "manishpathak320@gmail.com", "city": "Pune", "state": "Maharashtra", "specialty": "Prosthodontics"},
    {"clinic": "D'Sign Dental Clinic", "doctor": "Dr. Bhushan Phalak", "email": "dsigndentalclinic@gmail.com", "city": "Pune", "state": "Maharashtra", "specialty": "Smile Designing"},
    {"clinic": "Prudent Dental Clinic", "doctor": "Dr. Puja Bansal", "email": "prudenthealthclinic@gmail.com", "city": "Pune", "state": "Maharashtra", "specialty": "Pediatric & Cosmetic"},
    {"clinic": "Dr. Pandit's Dental Clinic", "doctor": "Dr. Vidya Pandit", "email": "vidyaidf32@gmail.com", "city": "Pune", "state": "Maharashtra", "specialty": "Dental Implants"},

    # Kolkata & Chennai
    {"clinic": "Dr. Bhadani’s Dental Clinic", "doctor": "Dr. Harshit Bhadani", "email": "dr.harshitbhadani@gmail.com", "city": "Kolkata", "state": "West Bengal", "specialty": "Oral Surgery & Implants"},
    {"clinic": "Teeth Care Multispeciality Dental Clinic", "doctor": "Dr. Sanket", "email": "drsanketdent@gmail.com", "city": "Kolkata", "state": "West Bengal", "specialty": "Cosmetic Smile Design"},
    {"clinic": "Dr. Kundu’s Dental Clinic", "doctor": "Dr. Kundu", "email": "drkundusdentalclinic@gmail.com", "city": "Kolkata", "state": "West Bengal", "specialty": "General & Restorative"},
    {"clinic": "Dental World India", "doctor": "Dr. Dental World Team", "email": "dentalworldindia@gmail.com", "city": "Kolkata", "state": "West Bengal", "specialty": "Full Mouth Rehab"},
    {"clinic": "Absolute Dental Clinic & Facial Surgical Centre", "doctor": "Dr. Abhilasha B.", "email": "drabhilashab@gmail.com", "city": "Chennai", "state": "Tamil Nadu", "specialty": "Facial Surgery & Implants"},
    {"clinic": "Chitra Dental Clinic", "doctor": "Dr. Chitra", "email": "drchitraa@gmail.com", "city": "Chennai", "state": "Tamil Nadu", "specialty": "Root Canal & Crowns"},

    # Gujarat
    {"clinic": "Dhwanil Dental Clinic", "doctor": "Dr. Krupa Vaidya", "email": "info.dhwanildentalclinic@gmail.com", "city": "Ahmedabad", "state": "Gujarat", "specialty": "Digital Dentistry"},
    {"clinic": "Dr. Patel's Dental Clinic", "doctor": "Dr. Trusha Gajera", "email": "trushagajera@gmail.com", "city": "Ahmedabad", "state": "Gujarat", "specialty": "Restorative & Aesthetic"},
    {"clinic": "Dr. Nidhi's Family Dental Care", "doctor": "Dr. Nidhi", "email": "drnidhifamilydentalcare@gmail.com", "city": "Ahmedabad", "state": "Gujarat", "specialty": "Preventive & Cosmetic"},
    {"clinic": "Somani's Orthodontic & Dental Clinic", "doctor": "Dr. Dhaval Somani", "email": "somanidentalclinic@gmail.com", "city": "Ahmedabad", "state": "Gujarat", "specialty": "Orthodontics & Aligners"},
    {"clinic": "Dr. Panseriya's Dental Clinic", "doctor": "Dr. Panseriya", "email": "drpanseriyadental@gmail.com", "city": "Surat", "state": "Gujarat", "specialty": "Implantology"},
    {"clinic": "RRR Dental Clinic", "doctor": "Dr. RRR Team", "email": "rrdentalclinicofficial@gmail.com", "city": "Surat", "state": "Gujarat", "specialty": "Cosmetic Care"},
    {"clinic": "Krishna Dental Hospital", "doctor": "Dr. Krishna Team", "email": "krishnadentalcareclinic@gmail.com", "city": "Surat", "state": "Gujarat", "specialty": "Oral Surgery"},
    {"clinic": "Pratham Dental Clinic", "doctor": "Dr. Pratham Team", "email": "prathamdental7@gmail.com", "city": "Surat", "state": "Gujarat", "specialty": "Root Canal & Crown"},
    {"clinic": "DentiCare Dental Care Centre", "doctor": "Dr. DentiCare Team", "email": "denticaresurat@gmail.com", "city": "Surat", "state": "Gujarat", "specialty": "Smile Designing"},
    {"clinic": "Dentafix Dental Clinic", "doctor": "Dr. Priya Gupta", "email": "dentafixsurat@gmail.com", "city": "Surat", "state": "Gujarat", "specialty": "Dental Implants"},
    {"clinic": "Ensō Dental Care", "doctor": "Dr. Vrinda Maheshwary", "email": "team.ensodental@gmail.com", "city": "Vadodara", "state": "Gujarat", "specialty": "Aesthetic Dentistry"},
    {"clinic": "Swastik Dental & Face Hospital", "doctor": "Dr. Shah", "email": "swastikdentalclinic2330@gmail.com", "city": "Vadodara", "state": "Gujarat", "specialty": "Maxillofacial & Implants"},
    {"clinic": "Dr. Ashu’s Dental Clinic", "doctor": "Dr. Ashu", "email": "drashudentalclinic@gmail.com", "city": "Vadodara", "state": "Gujarat", "specialty": "General Dental"},
    {"clinic": "Ronak Dental Clinic and Implant Center", "doctor": "Dr. Ronak Team", "email": "ronakdentalclinic@gmail.com", "city": "Vadodara", "state": "Gujarat", "specialty": "Dental Implants"},
    {"clinic": "The Tooth Co.", "doctor": "Dr. Malvika Trivedi", "email": "drmalvikatrivedi@gmail.com", "city": "Vadodara", "state": "Gujarat", "specialty": "Aesthetic Dentistry"},
    {"clinic": "Hi-Tech Dental Clinic & Implant Centre", "doctor": "Dr. Jigar Soni", "email": "drjigarsonihdcdentalclinic@gmail.com", "city": "Vadodara", "state": "Gujarat", "specialty": "Laser Implants"},
    {"clinic": "Vraj Dental Clinic", "doctor": "Dr. Vraj Team", "email": "vrajgroupofdental@gmail.com", "city": "Vadodara", "state": "Gujarat", "specialty": "Multispeciality"},
    {"clinic": "Atladara Dental Clinic", "doctor": "Dr. Dimpi Shah", "email": "drdimpishah@gmail.com", "city": "Vadodara", "state": "Gujarat", "specialty": "Root Canal & Crowns"},
    {"clinic": "Gopi Dental Clinic and Implant Centre", "doctor": "Dr. Gopi Team", "email": "gopidental@gmail.com", "city": "Rajkot", "state": "Gujarat", "specialty": "Dental Implants"},
    {"clinic": "Bhagvati Dental Clinic and Braces Centre", "doctor": "Dr. Harsh Orthodontist", "email": "drharshorthodontist@gmail.com", "city": "Rajkot", "state": "Gujarat", "specialty": "Orthodontics & Aligners"},
    {"clinic": "Dr. Chauhan’s Dental Clinic", "doctor": "Dr. S. A. Chauhan", "email": "drsachauhan@gmail.com", "city": "Bhavnagar", "state": "Gujarat", "specialty": "Implant Center"},

    # Jaipur & Lucknow
    {"clinic": "Thaper Dental Clinic", "doctor": "Dr. Thaper", "email": "drthaper@gmail.com", "city": "Jaipur", "state": "Rajasthan", "specialty": "Implantology"},
    {"clinic": "Care Dental Jaipur", "doctor": "Dr. Care Team", "email": "caredentaljaipur@gmail.com", "city": "Jaipur", "state": "Rajasthan", "specialty": "Cosmetic Dentistry"},
    {"clinic": "Nirvan's Dental Clinic", "doctor": "Dr. U. S. Nirvan", "email": "drusnirvan@gmail.com", "city": "Jaipur", "state": "Rajasthan", "specialty": "Orthodontics & Aligners"},
    {"clinic": "Partani Clinic", "doctor": "Dr. Arun Partani", "email": "arunpartani@gmail.com", "city": "Jaipur", "state": "Rajasthan", "specialty": "Restorative Dentistry"},
    {"clinic": "Marudhar Dental Clinic", "doctor": "Dr. Marudhar Team", "email": "marudhardental01@gmail.com", "city": "Jaipur", "state": "Rajasthan", "specialty": "Full Mouth Rehab"},
    {"clinic": "Dr. Nidhi's Multispeciality Dental Clinic", "doctor": "Dr. Nidhi Goyal", "email": "drnidhigoyal@gmail.com", "city": "Jaipur", "state": "Rajasthan", "specialty": "Pediatric & Cosmetic"},
    {"clinic": "Sudeep Dental & Kids Clinic", "doctor": "Dr. Sudeep", "email": "kidsdentistjaipur@gmail.com", "city": "Jaipur", "state": "Rajasthan", "specialty": "Pediatric Dentistry"},
    {"clinic": "My Dentist Multispeciality Dental Clinic", "doctor": "Dr. Singh", "email": "meetdr.singh@gmail.com", "city": "Lucknow", "state": "Uttar Pradesh", "specialty": "Laser RCT & Implants"},
    {"clinic": "Gupta Dental Clinic", "doctor": "Dr. Awadhesh Kumar Gupta", "email": "awadhesh.kr.gupta@gmail.com", "city": "Lucknow", "state": "Uttar Pradesh", "specialty": "Prosthodontics"},

    # Chandigarh & Punjab
    {"clinic": "Dantaa Dental Clinic", "doctor": "Dr. Nitika Chawla", "email": "drnitikachawla@gmail.com", "city": "Chandigarh", "state": "Punjab / UT", "specialty": "Cosmetic Dentistry"},
    {"clinic": "Oral Surgery & Dental Implant Clinic", "doctor": "Dr. Surgery Team", "email": "oralsurgerychandigarh@gmail.com", "city": "Chandigarh", "state": "Punjab / UT", "specialty": "Oral Surgery"},
    {"clinic": "Dr. Jyotika Dental Clinic", "doctor": "Dr. Jyotika Sharma", "email": "sharma94jyotika@gmail.com", "city": "Chandigarh", "state": "Punjab / UT", "specialty": "Restorative & Root Canal"},
    {"clinic": "Parekh Dental Clinic", "doctor": "Dr. Bhuvan Parekh", "email": "parekhdental@gmail.com", "city": "Amritsar", "state": "Punjab", "specialty": "Orthodontics & Implants"},

    # Madhya Pradesh
    {"clinic": "Dr. Supriya's Dental Clinic", "doctor": "Dr. Supriya", "email": "drsupriyasclinic@gmail.com", "city": "Indore", "state": "Madhya Pradesh", "specialty": "Cosmetic Dentistry"},
    {"clinic": "Care Dental Clinic", "doctor": "Dr. Gagan Jaiswal", "email": "dentistgaganj@gmail.com", "city": "Indore", "state": "Madhya Pradesh", "specialty": "Implantology"},
    {"clinic": "Mahalaxmi Dental Clinic", "doctor": "Dr. Priya Soni", "email": "priyasonidental1@gmail.com", "city": "Indore", "state": "Madhya Pradesh", "specialty": "General Dental"},
    {"clinic": "Smile Dental Clinic Indore", "doctor": "Dr. Smile Team", "email": "smiledental364@gmail.com", "city": "Indore", "state": "Madhya Pradesh", "specialty": "Full Mouth Rehab"},
    {"clinic": "Dr. Pooja's Pearly White Dental", "doctor": "Dr. Pooja", "email": "drpoojaspearlywhite@gmail.com", "city": "Indore", "state": "Madhya Pradesh", "specialty": "Smile Designing"},
    {"clinic": "Revti Dental Clinic", "doctor": "Dr. Rahul Shrivastava", "email": "revtidentalclinic@gmail.com", "city": "Indore", "state": "Madhya Pradesh", "specialty": "Root Canal & Crowns"},
    {"clinic": "Suryawanshi's Dental Care", "doctor": "Dr. Varun Suryawanshi", "email": "varun.suryawanshi@gmail.com", "city": "Indore", "state": "Madhya Pradesh", "specialty": "Orthodontics & Aligners"},
    {"clinic": "Dr. Leena Srivastava's Dental Clinic", "doctor": "Dr. Leena Srivastava", "email": "leena.srivastava@gmail.com", "city": "Indore", "state": "Madhya Pradesh", "specialty": "Periodontics"},
    {"clinic": "Medident Clinic", "doctor": "Dr. Priya Joshi", "email": "drpriyajoshi2010@gmail.com", "city": "Indore", "state": "Madhya Pradesh", "specialty": "Cosmetic Care"},
    {"clinic": "Jain Dental Clinic", "doctor": "Dr. Jain Team", "email": "jaindental22@gmail.com", "city": "Bhopal", "state": "Madhya Pradesh", "specialty": "Root Canal & Crowns"},
    {"clinic": "Dhameja Dental Clinic", "doctor": "Dr. Swapnil Dhameja", "email": "dhameja.swapnil@gmail.com", "city": "Bhopal", "state": "Madhya Pradesh", "specialty": "Orthodontics"},
    {"clinic": "Jeswani Multispeciality Dental", "doctor": "Dr. Jeswani", "email": "jeswanidentalclinic@gmail.com", "city": "Bhopal", "state": "Madhya Pradesh", "specialty": "Multispeciality"},
    {"clinic": "Dr. Mayank Jain Dental Clinic", "doctor": "Dr. Mayank Jain", "email": "dr.mayank86@gmail.com", "city": "Jabalpur", "state": "Madhya Pradesh", "specialty": "Dental Implants"},
    {"clinic": "Kochar Dental Care", "doctor": "Dr. Kochar", "email": "kochardentalcare@gmail.com", "city": "Jabalpur", "state": "Madhya Pradesh", "specialty": "Cosmetic Care"},
    {"clinic": "Vaishali Dental Care", "doctor": "Dr. Piyush Jain", "email": "piyushjain.bds@gmail.com", "city": "Jabalpur", "state": "Madhya Pradesh", "specialty": "Oral Surgery"},

    # East India
    {"clinic": "Dr. Harsh Pathak Dental Clinic", "doctor": "Dr. Harsh Pathak", "email": "pathakdentalclinic@gmail.com", "city": "Bhubaneswar", "state": "Odisha", "specialty": "Implantology"},
    {"clinic": "Shree Krishna Dental Care", "doctor": "Dr. Krishna Team", "email": "shreekrishnadentalcareoffice@gmail.com", "city": "Bhubaneswar", "state": "Odisha", "specialty": "Cosmetic Care"},
    {"clinic": "Elite Dental Clinic Bhubaneswar", "doctor": "Dr. Elite Team", "email": "elitehealthcompany@gmail.com", "city": "Bhubaneswar", "state": "Odisha", "specialty": "Full Mouth Rehab"},
    {"clinic": "Smile Dental Clinic Patna", "doctor": "Dr. Harshit Kumar", "email": "kharshit909@gmail.com", "city": "Patna", "state": "Bihar", "specialty": "Root Canal & Implants"},
    {"clinic": "First Care Dental Clinic", "doctor": "Dr. Azhar Zeya", "email": "firstcaredentalclinicranchi@gmail.com", "city": "Ranchi", "state": "Jharkhand", "specialty": "Dental Implants"},
    {"clinic": "Dant Taru Dental Clinic", "doctor": "Dr. Pawan Kumar", "email": "danttaru.ranchi@gmail.com", "city": "Ranchi", "state": "Jharkhand", "specialty": "Aesthetic Dentistry"},

    # South India (Kerala & Andhra Pradesh)
    {"clinic": "Dr. Manju's Marvel Multi Speciality Dental Care", "doctor": "Dr. Manju Sreeram", "email": "dr.manjusreeram@gmail.com", "city": "Kozhikode", "state": "Kerala", "specialty": "Multispeciality"},
    {"clinic": "Dr. GS Multi Speciality Dental Care", "doctor": "Dr. G. S. Team", "email": "askdrgscare@gmail.com", "city": "Kozhikode", "state": "Kerala", "specialty": "Cosmetic & Implants"},
    {"clinic": "Elite Dental Studio Calicut", "doctor": "Dr. Elite Calicut", "email": "elitedentalstudioreception@gmail.com", "city": "Kozhikode", "state": "Kerala", "specialty": "Smile Designing"},
    {"clinic": "Dentique Dental Studio", "doctor": "Dr. Dentique Team", "email": "dentiquedentalstudio@gmail.com", "city": "Kochi", "state": "Kerala", "specialty": "Aesthetic Dentistry"},
    {"clinic": "Elite Dental Studio Kochi", "doctor": "Dr. Elite Kochi", "email": "elitedentalkochireception@gmail.com", "city": "Kochi", "state": "Kerala", "specialty": "Implant Center"},
    {"clinic": "Chitra Multispeciality Dental Centre", "doctor": "Dr. Mini Jose", "email": "drminijose@gmail.com", "city": "Thiruvananthapuram", "state": "Kerala", "specialty": "Multispeciality"},
    {"clinic": "Dr. Feminath's Ananthapuri Dental", "doctor": "Dr. Feminath", "email": "trivandrumdental@gmail.com", "city": "Thiruvananthapuram", "state": "Kerala", "specialty": "Oral Surgery"},
    {"clinic": "Sivam Dental Clinic", "doctor": "Dr. Sivam Team", "email": "sivamdental95@gmail.com", "city": "Kochi", "state": "Kerala", "specialty": "General Dental"},
    {"clinic": "Happy Dental and General Health Care", "doctor": "Dr. Happy Team", "email": "happydentalhealthcare@gmail.com", "city": "Vijayawada", "state": "Andhra Pradesh", "specialty": "Laser Dentistry"},
    {"clinic": "Sri Sai Swarna Dental Clinic", "doctor": "Dr. Swarna Team", "email": "srisaiswarnadental@gmail.com", "city": "Vijayawada", "state": "Andhra Pradesh", "specialty": "Crown & Bridges"},
    {"clinic": "Yashwanth's Lotus Dental Care", "doctor": "Dr. Ravi Kumar", "email": "yashwanthslotusdentalcare@gmail.com", "city": "Vijayawada", "state": "Andhra Pradesh", "specialty": "Root Canal & Implants"},
    {"clinic": "Madhu Dental Clinic", "doctor": "Dr. A. Madhu Rani", "email": "madhudentalclinic94@gmail.com", "city": "Vijayawada", "state": "Andhra Pradesh", "specialty": "Cosmetic Care"},
    {"clinic": "Dr. Ramya's Dentistry", "doctor": "Dr. Ramya Reddy", "email": "drramyareddy17@gmail.com", "city": "Tirupati", "state": "Andhra Pradesh", "specialty": "Orthodontics & Aligners"},
    {"clinic": "Star Dental Hospital", "doctor": "Dr. Star Team", "email": "stardentaltirupati@gmail.com", "city": "Tirupati", "state": "Andhra Pradesh", "specialty": "Oral Surgery & Implants"},
    {"clinic": "Ratan Krishna Dental Care", "doctor": "Dr. Dinesh Gupta Malla", "email": "ratankrishnadental@gmail.com", "city": "Visakhapatnam", "state": "Andhra Pradesh", "specialty": "Dental Implants"},

    # Karnataka Tier-2
    {"clinic": "Ashvini Multi-Speciality Dental Clinic", "doctor": "Dr. Ashvini", "email": "ashvinidental.mysuru@gmail.com", "city": "Mysuru", "state": "Karnataka", "specialty": "Implant Center"},
    {"clinic": "A V Dental Care", "doctor": "Dr. A. V. Team", "email": "avdcmysore@gmail.com", "city": "Mysuru", "state": "Karnataka", "specialty": "Cosmetic Dentistry"},
    {"clinic": "Dantalaya Dental Clinic Mysuru", "doctor": "Dr. Dantalaya Team", "email": "dantalayadentalclinic@gmail.com", "city": "Mysuru", "state": "Karnataka", "specialty": "General Dental"},
    {"clinic": "Dr. Ashwini’s Smile Zone", "doctor": "Dr. Ashwini", "email": "ashwini.prosthodontist@gmail.com", "city": "Mysuru", "state": "Karnataka", "specialty": "Prosthodontics"},
    {"clinic": "Parvathi Dental Clinic", "doctor": "Dr. Parvathi Team", "email": "parvathidentalcaremysuru@gmail.com", "city": "Mysuru", "state": "Karnataka", "specialty": "Restorative Dentistry"},
    {"clinic": "Whyte Dental Clinic", "doctor": "Dr. Whyte Team", "email": "whytedental@gmail.com", "city": "Mysuru", "state": "Karnataka", "specialty": "Aesthetic Dentistry"},
    {"clinic": "Happy Dent Dental Clinic", "doctor": "Dr. Happy Dent Team", "email": "happydent777@gmail.com", "city": "Mangalore", "state": "Karnataka", "specialty": "Preventive & Cosmetic"},
    {"clinic": "Root & Crown Dental Clinic", "doctor": "Dr. Root & Crown Team", "email": "rootandcrownmlr@gmail.com", "city": "Mangalore", "state": "Karnataka", "specialty": "Endodontics"},
    {"clinic": "S.A. Dental Clinic", "doctor": "Dr. Swajitha Lobo", "email": "loboswajitha@gmail.com", "city": "Mangalore", "state": "Karnataka", "specialty": "Family & Pediatric"},
    {"clinic": "T32 Dental Care & Implant Centre", "doctor": "Dr. T32 Team", "email": "t32dentalcare@gmail.com", "city": "Mangalore", "state": "Karnataka", "specialty": "Dental Implants"},
    {"clinic": "The Tooth Place Dental and Orthodontic", "doctor": "Dr. Tooth Place Team", "email": "thetoothplacehubli@gmail.com", "city": "Hubli", "state": "Karnataka", "specialty": "Orthodontics & Aligners"},
    {"clinic": "Belgaum Dental Care", "doctor": "Dr. Chaitanya Uppin", "email": "drchaitanyauppin@gmail.com", "city": "Belagavi", "state": "Karnataka", "specialty": "Oral Surgery"},
    {"clinic": "OneDentall", "doctor": "Dr. M. Dhakoji", "email": "mdhakoji@gmail.com", "city": "Belagavi", "state": "Karnataka", "specialty": "Smile Makeover"},

    # North Hills & North East
    {"clinic": "Just Smile Dental Clinic", "doctor": "Dr. Neelima", "email": "drneelima1980@gmail.com", "city": "Dehradun", "state": "Uttarakhand", "specialty": "Cosmetic Care"},
    {"clinic": "Smiling Ages Dental Clinic", "doctor": "Dr. Smiling Ages Team", "email": "smilingages@gmail.com", "city": "Dehradun", "state": "Uttarakhand", "specialty": "Pediatric & Family"},
    {"clinic": "Luxmi Dental Clinic", "doctor": "Dr. Luxmi Team", "email": "yaldlaserclinic@gmail.com", "city": "Dehradun", "state": "Uttarakhand", "specialty": "Laser Implants"},
    {"clinic": "Smile Zone Dental Care Centre", "doctor": "Dr. Vivek Vohra", "email": "vgdrvivek@gmail.com", "city": "Dehradun", "state": "Uttarakhand", "specialty": "Implant Center"},
    {"clinic": "Aditi Dental Clinic Dehradun", "doctor": "Dr. Aditi Team", "email": "aditidental01@gmail.com", "city": "Dehradun", "state": "Uttarakhand", "specialty": "Root Canal & Crowns"},
    {"clinic": "Beyond Smiles Dental Clinic", "doctor": "Dr. Beyond Smiles Team", "email": "beyondsmilesrc@gmail.com", "city": "Dehradun", "state": "Uttarakhand", "specialty": "Smile Designing"},
    {"clinic": "MINT Dental Clinic", "doctor": "Dr. Mint Team", "email": "mintdentalclinicddun@gmail.com", "city": "Dehradun", "state": "Uttarakhand", "specialty": "Clear Aligners"},
    {"clinic": "Doon Dental & Implant Centre", "doctor": "Dr. Doon Dental Team", "email": "doondental@gmail.com", "city": "Dehradun", "state": "Uttarakhand", "specialty": "Dental Implants"},
    {"clinic": "My Family Dentist Haridwar", "doctor": "Dr. Family Dentist", "email": "myfamilydentists@gmail.com", "city": "Haridwar", "state": "Uttarakhand", "specialty": "General Dental"},
    {"clinic": "SmartCity Dental Clinic", "doctor": "Dr. Supal Chakraborty", "email": "dental.smartcity@gmail.com", "city": "Guwahati", "state": "Assam", "specialty": "Aesthetic Dentistry"},
    {"clinic": "Magnum Dental Clinic", "doctor": "Dr. Monami Bujarbaruah", "email": "magnumdentalclinic.mbdd@gmail.com", "city": "Guwahati", "state": "Assam", "specialty": "Orthodontics & Aligners"},
    {"clinic": "Dr. D’s Dental Clinic", "doctor": "Dr. Dibyaraj Choudhury", "email": "dr.dibyaraj@gmail.com", "city": "Guwahati", "state": "Assam", "specialty": "Full Mouth Rehabilitation"},
    {"clinic": "Sure Smile Dental Care", "doctor": "Dr. Sure Smile Team", "email": "suresmileguwahati@gmail.com", "city": "Guwahati", "state": "Assam", "specialty": "Cosmetic Care"},
    {"clinic": "The Dental Square", "doctor": "Dr. Sashikant V.", "email": "thedentalsquareghy@gmail.com", "city": "Guwahati", "state": "Assam", "specialty": "Dental Implants"},

    # Maharashtra Tier-2
    {"clinic": "Elite Dental Care Nashik", "doctor": "Dr. Shweta Bachhav", "email": "elitedentalcare@gmail.com", "city": "Nashik", "state": "Maharashtra", "specialty": "Root Canal & Crowns"},
    {"clinic": "Dr. Marathe's Dental Clinic", "doctor": "Dr. Swapnil Marathe", "email": "swapmarathe@gmail.com", "city": "Nashik", "state": "Maharashtra", "specialty": "Implant Center"},
    {"clinic": "MediVista Dental Clinic", "doctor": "Dr. Vrushali Patil", "email": "drvruushalipatil@gmail.com", "city": "Nashik", "state": "Maharashtra", "specialty": "Cosmetic Dentistry"},
    {"clinic": "Dr. Poond's Multispeciality Dental", "doctor": "Dr. Poond Team", "email": "drpoondsdentalclinic@gmail.com", "city": "Nashik", "state": "Maharashtra", "specialty": "Dental Implants"},
    {"clinic": "Khivsara Dental Clinic", "doctor": "Dr. Ankush Khivsara", "email": "ankushkhivsara@gmail.com", "city": "Nashik", "state": "Maharashtra", "specialty": "Orthodontics"},
    {"clinic": "Naik Dental Clinic", "doctor": "Dr. Rutuja Padalkar-Naik", "email": "padalkarrutuja276@gmail.com", "city": "Aurangabad", "state": "Maharashtra", "specialty": "Smile Designing"},
    {"clinic": "Saikrupa Dental Clinic", "doctor": "Dr. Anup Chole Patil", "email": "dr.anupcholepatil@gmail.com", "city": "Aurangabad", "state": "Maharashtra", "specialty": "Implant Center"},
    {"clinic": "Naser Dental Care Centre", "doctor": "Dr. Khan Muzaffar Zama", "email": "khan55zama@gmail.com", "city": "Aurangabad", "state": "Maharashtra", "specialty": "Oral Surgery"},
    {"clinic": "Kranti Multispeciality Dental Clinic", "doctor": "Dr. Sunita Doibale", "email": "drsunitadoibale@gmail.com", "city": "Aurangabad", "state": "Maharashtra", "specialty": "Prosthodontics"},
    {"clinic": "Ojas Dental Clinic", "doctor": "Dr. Ojas Team", "email": "ojasdental@gmail.com", "city": "Aurangabad", "state": "Maharashtra", "specialty": "General Care"},
    {"clinic": "Dr. Dahiwals Facial Aesthetics & Dental", "doctor": "Dr. Pushkar Dahiwal", "email": "drpushkardahiwal@gmail.com", "city": "Aurangabad", "state": "Maharashtra", "specialty": "Facial Aesthetics & Implants"},

    # Tamil Nadu Tier-2
    {"clinic": "Dr. Sunil's Dentistry", "doctor": "Dr. Sunil", "email": "drsunilsdentistry@gmail.com", "city": "Coimbatore", "state": "Tamil Nadu", "specialty": "Smile Designing"},
    {"clinic": "RNS Dental Clinic", "doctor": "Dr. RNS Team", "email": "rnsdental@gmail.com", "city": "Coimbatore", "state": "Tamil Nadu", "specialty": "Cosmetic & Implants"},
    {"clinic": "Rajkumar's Dentistry", "doctor": "Dr. C. R. Rajkumar", "email": "drcrraj@gmail.com", "city": "Coimbatore", "state": "Tamil Nadu", "specialty": "Full Mouth Rehab"},
    {"clinic": "Grace Dental Care", "doctor": "Dr. Grace Team", "email": "gracedentalcarekovai@gmail.com", "city": "Coimbatore", "state": "Tamil Nadu", "specialty": "General & Family Dental"},
    {"clinic": "Dr. Kishor's Dentistry", "doctor": "Dr. Kishor", "email": "drkishorsdentistry@gmail.com", "city": "Coimbatore", "state": "Tamil Nadu", "specialty": "Implant Center"},
    {"clinic": "Shanker Dental & Craniofacial Centre", "doctor": "Dr. Shanker", "email": "orthomax@gmail.com", "city": "Madurai", "state": "Tamil Nadu", "specialty": "Craniofacial & Ortho"},
    {"clinic": "Anbu Dental Clinic", "doctor": "Dr. Anbu Team", "email": "adcmaduraienquiry@gmail.com", "city": "Madurai", "state": "Tamil Nadu", "specialty": "Multispeciality"},
    {"clinic": "Deivam Dental Clinic", "doctor": "Dr. Deivam Team", "email": "deivamdentalmadurai@gmail.com", "city": "Madurai", "state": "Tamil Nadu", "specialty": "Root Canal & Implants"},
    {"clinic": "Zaara Dentistry", "doctor": "Dr. Zaara Team", "email": "zaaradentistry@gmail.com", "city": "Madurai", "state": "Tamil Nadu", "specialty": "Cosmetic Smile Design"},
    {"clinic": "Gem Dentistry", "doctor": "Dr. Gem Team", "email": "gemdentals@gmail.com", "city": "Madurai", "state": "Tamil Nadu", "specialty": "Aesthetic Dentistry"},
    {"clinic": "D Root Dental Clinic", "doctor": "Dr. Root Team", "email": "drootdentalclinic@gmail.com", "city": "Madurai", "state": "Tamil Nadu", "specialty": "Endodontics"},
    {"clinic": "Elites Surya Dental Clinic", "doctor": "Dr. Surya Team", "email": "suryamedigroups@gmail.com", "city": "Madurai", "state": "Tamil Nadu", "specialty": "General Dental"},
    {"clinic": "Beaumont Dental Clinic", "doctor": "Dr. Beaumont Team", "email": "beaumontdentalclinic@gmail.com", "city": "Salem", "state": "Tamil Nadu", "specialty": "Implant Center"},
    {"clinic": "NRS Dental Care", "doctor": "Dr. Sivaranjan", "email": "sivaranjanprostho@gmail.com", "city": "Salem", "state": "Tamil Nadu", "specialty": "Prosthodontics"},
    {"clinic": "Kavitha Multispecialty Dental Clinic", "doctor": "Dr. Kavitha", "email": "kavithadentalclinic@gmail.com", "city": "Salem", "state": "Tamil Nadu", "specialty": "Multispeciality"},
    {"clinic": "Smilepoint Dental Clinic", "doctor": "Dr. Smilepoint Team", "email": "smilepointdentist@gmail.com", "city": "Salem", "state": "Tamil Nadu", "specialty": "Restorative Dentistry"},
    {"clinic": "Universe Dental Care", "doctor": "Dr. Universe Team", "email": "universedentaltrichy@gmail.com", "city": "Tiruchirappalli", "state": "Tamil Nadu", "specialty": "Laser RCT"},
    {"clinic": "Shri Navaladiyan Dental Care", "doctor": "Dr. Prem Ortho", "email": "drpremortho@gmail.com", "city": "Tiruchirappalli", "state": "Tamil Nadu", "specialty": "Orthodontics & Aligners"},
    {"clinic": "Dr. Sam's Dental Clinic", "doctor": "Dr. Sam", "email": "dr.samsdental@gmail.com", "city": "Tiruchirappalli", "state": "Tamil Nadu", "specialty": "Dental Implants"},
    {"clinic": "Rajesh Dental Clinic", "doctor": "Dr. Raja Rajesh", "email": "pedodontistrajarajesh@gmail.com", "city": "Tiruchirappalli", "state": "Tamil Nadu", "specialty": "Pediatric Dentistry"},
    {"clinic": "A.M. Dental Clinic", "doctor": "Dr. A. M. Team", "email": "amdc.smile@gmail.com", "city": "Tiruchirappalli", "state": "Tamil Nadu", "specialty": "Cosmetic Smile Design"},
    {"clinic": "Saikrupa Dental Specialities", "doctor": "Dr. Sai Sathya", "email": "saisathya75@gmail.com", "city": "Tiruchirappalli", "state": "Tamil Nadu", "specialty": "Oral Surgery"}
]

def ingest_leads():
    init_db()
    conn = sqlite3.connect('src/scripts/outreach/dental_leads_master.db')
    cursor = conn.cursor()
    cursor.execute('SELECT email FROM leads')
    existing = set(r[0].strip().lower() for r in cursor.fetchall())
    conn.close()

    inserted = 0
    seen_in_batch = set()
    for lead in NEW_HIGH_INTENT_LEADS:
        em = lead["email"].strip().lower()
        if em in existing or em in seen_in_batch:
            continue
        seen_in_batch.add(em)
        success = insert_lead(
            clinic_name=lead["clinic"],
            doctor_name=lead["doctor"],
            email=lead["email"],
            city=lead["city"],
            state=lead["state"],
            specialty=lead.get("specialty", "Multispeciality Dental"),
            source="fresh_batch_crawl_sept22",
            status="pending"
        )
        if success:
            inserted += 1

    print(f"Successfully inserted {inserted} brand new pending leads!")
    print(get_db_stats())

if __name__ == "__main__":
    ingest_leads()
