import json
import sqlite3
import re
import os
import glob
import sys

OUTPUT_FILE = "/Users/pratyushraj/Desktop/dental-crm/scripts/fresh_leads_south_nov13.json"
DB_PATH = "/Users/pratyushraj/Desktop/dental-crm/src/scripts/outreach/dental_leads_master.db"

leads = [
    {
        "doctor_name": "Dr. K. R. Nagaraj",
        "clinic_name": "Lalitha Dental Speciality Centre",
        "email": "appointments@ldsc.in",
        "phone": "+91 97409 05904",
        "city": "Bengaluru",
        "state": "Karnataka",
        "specialty": "Dental Implants & Cosmetic Dentistry",
        "website": "https://ldsc.in"
    },
    {
        "doctor_name": "Dr. S. S. Shreyas",
        "clinic_name": "DeVita Dental and Maxillo Facial Care",
        "email": "appointments@devitafacialcare.com",
        "phone": "+91 91106 55755",
        "city": "Bengaluru",
        "state": "Karnataka",
        "specialty": "Maxillofacial Surgery & Dental Implants",
        "website": "https://devitafacialcare.in"
    },
    {
        "doctor_name": "Dr. Gazala Anjum",
        "clinic_name": "ProWhite Dental Clinic",
        "email": "prowhiteclinic@gmail.com",
        "phone": "+91 98866 53298",
        "city": "Bengaluru",
        "state": "Karnataka",
        "specialty": "Dental Implants & Invisible Aligners",
        "website": "https://prowhitedental.nowfloats.com"
    },
    {
        "doctor_name": "Dr. Salman Khan",
        "clinic_name": "Dr. Braces Multispecialty Dental Clinic",
        "email": "drbracesandfaces@gmail.com",
        "phone": "+91 72596 93009",
        "city": "Bengaluru",
        "state": "Karnataka",
        "specialty": "Diamond Invisalign Provider & Dental Implants",
        "website": "https://drbraces.in"
    },
    {
        "doctor_name": "Dr. Arthur Reginold",
        "clinic_name": "Reginolds Dental Clinic",
        "email": "regiarthur@hotmail.com",
        "phone": "+91 98860 67262",
        "city": "Bengaluru",
        "state": "Karnataka",
        "specialty": "Dental Implants & Aesthetic Dentistry",
        "website": "https://reginoldsdental.com"
    },
    {
        "doctor_name": "Dr. Isha S. Singh",
        "clinic_name": "Dental Sanctuary",
        "email": "info@dentalsanctuary.in",
        "phone": "+91 70194 31864",
        "city": "Bengaluru",
        "state": "Karnataka",
        "specialty": "Clear Aligners & Dental Implants",
        "website": "https://dentalsanctuary.in"
    },
    {
        "doctor_name": "Dr. Sujay Gopal",
        "clinic_name": "Sujay's Dental Care",
        "email": "info@sujaysdentalcare.com",
        "phone": "+91 98860 20029",
        "city": "Bengaluru",
        "state": "Karnataka",
        "specialty": "Dental Implants & Prosthodontics",
        "website": "https://sujaysdentalcare.com"
    },
    {
        "doctor_name": "Dr. N.S. Naveenraj",
        "clinic_name": "DivyN The Dentist",
        "email": "hello@divyndentist.in",
        "phone": "+91 79047 19986",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "specialty": "Oral & Maxillofacial Surgery and Dental Implants",
        "website": "https://divynthedentist.com"
    },
    {
        "doctor_name": "Dr. B. Senthil",
        "clinic_name": "Sukam Dental Care",
        "email": "sukamdental@gmail.com",
        "phone": "+91 91761 95689",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "specialty": "Oral Medicine & Dental Implants",
        "website": "https://v0-sukum-dental-clinic.vercel.app"
    },
    {
        "doctor_name": "Dr. Nirmala Madhavan",
        "clinic_name": "Subham Dental and Craniofacial Centre",
        "email": "subhamfoundations@gmail.com",
        "phone": "+91 99411 97179",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "specialty": "Endodontics & Cosmetic Dentistry",
        "website": "https://subhamdental.in"
    },
    {
        "doctor_name": "Dr. Dilip Kumar",
        "clinic_name": "Dr. Dilip Dental Centre",
        "email": "doctor@dilipdentalcentre.com",
        "phone": "+91 98845 20520",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "specialty": "Prosthodontics & Oral Implantology",
        "website": "https://drdilipdentalcentre.com"
    },
    {
        "doctor_name": "Dr. Gurdeep Singh Ubhi",
        "clinic_name": "Jagir Dental Centre",
        "email": "jagirdental@gmail.com",
        "phone": "+91 96770 45201",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "specialty": "Dental Implants & Aesthetic Smile Design",
        "website": "https://jagirdental.com"
    },
    {
        "doctor_name": "Dr. Namratha Chandrahari",
        "clinic_name": "Enamel Dental",
        "email": "enameldental.info@gmail.com",
        "phone": "+91 90005 54063",
        "city": "Hyderabad",
        "state": "Telangana",
        "specialty": "Prosthodontics & Implantology",
        "website": "https://enameldental.co.in"
    },
    {
        "doctor_name": "Dr. Ashwini Kumar",
        "clinic_name": "Sri Sai Super Speciality Dental Hospital",
        "email": "dr32teeth.com@gmail.com",
        "phone": "+91 94400 61246",
        "city": "Hyderabad",
        "state": "Telangana",
        "specialty": "Dental Implantology & Smile Designing",
        "website": "https://dr32teeth.com"
    },
    {
        "doctor_name": "Dr. Sowjanya Kancha",
        "clinic_name": "Sowjanya Dental Hospital",
        "email": "sowjanyadentalhospitals@gmail.com",
        "phone": "+91 75056 00600",
        "city": "Hyderabad",
        "state": "Telangana",
        "specialty": "Prosthodontics & Oral Implantology",
        "website": "https://sowjanyadental.in"
    },
    {
        "doctor_name": "Dr. S.B.V. Ramana Reddy",
        "clinic_name": "Eswar Dental Clinic & Orthodontic Centre",
        "email": "info@eswardentalclinickphb.com",
        "phone": "+91 72071 06868",
        "city": "Hyderabad",
        "state": "Telangana",
        "specialty": "Surgical Orthodontics, Invisalign & Dental Implants",
        "website": "https://eswardentalclinickphb.com"
    },
    {
        "doctor_name": "Dr. S. Nitesh Reddy",
        "clinic_name": "Neoface Dental & Maxillofacial Clinic",
        "email": "neoface2022@gmail.com",
        "phone": "+91 78423 17873",
        "city": "Hyderabad",
        "state": "Telangana",
        "specialty": "Maxillofacial Surgery & Dental Implants",
        "website": "https://neofacedental.com"
    },
    {
        "doctor_name": "Dr. Anood S. Z.",
        "clinic_name": "Smaindyo Dental Care",
        "email": "smaindyodental@gmail.com",
        "phone": "+91 91888 12333",
        "city": "Thiruvananthapuram",
        "state": "Kerala",
        "specialty": "Clear Aligners & Maxillofacial Implantology",
        "website": "https://smaindyo.in"
    },
    {
        "doctor_name": "Dr. Segin Chandran K.R.",
        "clinic_name": "Kamala Dental Super Speciality Hospital",
        "email": "kamaladentaltvm@gmail.com",
        "phone": "+91 95260 66001",
        "city": "Thiruvananthapuram",
        "state": "Kerala",
        "specialty": "Oral & Maxillofacial Surgery and Dental Implants",
        "website": "https://kamaladental.com"
    },
    {
        "doctor_name": "Dr. Ahalia N. Radhakrishnan",
        "clinic_name": "Dwiti Speciality Dental Clinic",
        "email": "asi@dwitispeciality.com",
        "phone": "+91 70344 18900",
        "city": "Kozhikode",
        "state": "Kerala",
        "specialty": "Restorative & Aesthetic Dental Surgery",
        "website": "https://dwitispeciality.com"
    },
    {
        "doctor_name": "Dr. Kurien Varghese",
        "clinic_name": "Aadic Dental Clinic",
        "email": "aadicdental@gmail.com",
        "phone": "+91 94475 35744",
        "city": "Kollam",
        "state": "Kerala",
        "specialty": "Prosthodontics & Oral Implantology",
        "website": "https://aadicdentalkollam.com"
    },
    {
        "doctor_name": "Dr. Ameenath C.K.",
        "clinic_name": "Dr. Ameenath's ProSmile Family Dental Clinic",
        "email": "drameenath.prosmile@gmail.com",
        "phone": "+91 95441 64240",
        "city": "Kannur",
        "state": "Kerala",
        "specialty": "Oral Implantology & Aesthetic Dentistry",
        "website": "https://prosmilefamilydental.in"
    },
    {
        "doctor_name": "Dr. Nandhini",
        "clinic_name": "Nandhini Dental Care",
        "email": "hello@nandhinidentalcare.com",
        "phone": "+91 97872 32533",
        "city": "Coimbatore",
        "state": "Tamil Nadu",
        "specialty": "Orthodontics & Dental Implants",
        "website": "https://nandhinidentalcare.com"
    },
    {
        "doctor_name": "Dr. Vadivelan Jeyachandran",
        "clinic_name": "Dr. VJ Dental Studio",
        "email": "smile@drvjdentalstudio.com",
        "phone": "+91 73959 56423",
        "city": "Salem",
        "state": "Tamil Nadu",
        "specialty": "Oral Maxillofacial Implantology & Smile Designing",
        "website": "https://drvjdentalstudio.com"
    },
    {
        "doctor_name": "Dr. P. Rajessh",
        "clinic_name": "Adithyaa Dental Clinic",
        "email": "adithyaadentalclinic@gmail.com",
        "phone": "+91 93617 74084",
        "city": "Salem",
        "state": "Tamil Nadu",
        "specialty": "Prosthodontics & Clear Aligners",
        "website": "https://adithyaadentalclinic.com"
    },
    {
        "doctor_name": "Dr. S. Ram Kumar",
        "clinic_name": "VR Dental & Implant Centre",
        "email": "vrdentalandimplantcentre@gmail.com",
        "phone": "+91 93440 40435",
        "city": "Trichy",
        "state": "Tamil Nadu",
        "specialty": "Dental Implants & Invisalign Orthodontics",
        "website": "https://vrdentalandimplantcentre.com"
    },
    {
        "doctor_name": "Dr. Leela Krishna",
        "clinic_name": "Krishna Sai Dental Care",
        "email": "krishnasaidentalclinic@gmail.com",
        "phone": "+91 97031 16666",
        "city": "Vijayawada",
        "state": "Andhra Pradesh",
        "specialty": "Basal Implants & Digital Orthodontics",
        "website": "https://krishnasaidental.in"
    },
    {
        "doctor_name": "Dr. Kavitha Reddy",
        "clinic_name": "Kavitha Reddy Dental Hospital",
        "email": "mail@kavithareddydentalhospital.com",
        "phone": "+91 90009 44131",
        "city": "Warangal",
        "state": "Telangana",
        "specialty": "Prosthodontics & Oral Implantology",
        "website": "https://kavithareddydentalhospital.com"
    },
    {
        "doctor_name": "Dr. Lakshmi Sagar",
        "clinic_name": "Sagar Dental Care and Hospital",
        "email": "sagardentalcareandhospital@gmail.com",
        "phone": "+91 98488 99980",
        "city": "Tirupati",
        "state": "Andhra Pradesh",
        "specialty": "Orthodontics & Clear Aligners",
        "website": "https://sagardentalcareandhospital.com"
    },
    {
        "doctor_name": "Dr. Swarna B",
        "clinic_name": "Swarna Dento Care",
        "email": "help@swarnadentocare.com",
        "phone": "+91 81818 98968",
        "city": "Visakhapatnam",
        "state": "Andhra Pradesh",
        "specialty": "Restorative Dentistry & Dental Implants",
        "website": "https://swarnadentocare.com"
    }
]

def main():
    print(f"Total leads compiled: {len(leads)}")
    assert len(leads) == 30, f"Expected 30 leads, got {len(leads)}"

    # Check internal uniqueness
    emails = [l["email"].strip().lower() for l in leads]
    clinics = [l["clinic_name"].strip().lower() for l in leads]
    assert len(emails) == len(set(emails)), "Duplicate emails found inside batch!"
    assert len(clinics) == len(set(clinics)), "Duplicate clinics found inside batch!"

    # Write file
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(leads, f, indent=2, ensure_ascii=False)
    print(f"Successfully saved {len(leads)} leads to {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
