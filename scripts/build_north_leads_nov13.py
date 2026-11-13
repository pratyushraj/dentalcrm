import json
import os
import sys

leads = [
    {
        "doctor_name": "Dr. Parminder Singh Grover",
        "clinic_name": "Dr. Grover's Dental & Implant Center",
        "email": "drparry75@yahoo.com",
        "phone": "+91-9417715465",
        "city": "Dugri, Ludhiana",
        "state": "Punjab",
        "specialty": "Implantologist & Restorative Dentist",
        "website": "https://groverdental.in"
    },
    {
        "doctor_name": "Dr. Jyotsana Singh",
        "clinic_name": "DentWayy Holistic Dental Care Center",
        "email": "info@dentwayy.com",
        "phone": "+91-9927736763",
        "city": "Pilibhit Bypass Road, Bareilly",
        "state": "Uttar Pradesh",
        "specialty": "Implantologist & Aesthetic Dentist",
        "website": "https://dentalclinicbareilly.com"
    },
    {
        "doctor_name": "Dr. Yash Singh",
        "clinic_name": "V Smile Dental Clinic",
        "email": "yashsingh@vsmiledental.co.in",
        "phone": "+91-9554999945",
        "city": "Jagriti Vihar, Meerut",
        "state": "Uttar Pradesh",
        "specialty": "Prosthodontist & Oral Implantologist",
        "website": "https://vsmiledental.co.in"
    },
    {
        "doctor_name": "Dr. Abhey Chowdhry",
        "clinic_name": "ARK Noble Dental Care & Implant Centre",
        "email": "abhheychowdhry@gmail.com",
        "phone": "+91-9888883884",
        "city": "Sector 2, Panchkula",
        "state": "Haryana",
        "specialty": "Oral Implantologist & Orthodontist",
        "website": "https://noble-implant-braces.com"
    },
    {
        "doctor_name": "Dr. Jaanbir Arora",
        "clinic_name": "Lumina Dental Clinic & Implant Centre",
        "email": "info@luminadental.com",
        "phone": "+91-8847410093",
        "city": "Sector 68, Mohali",
        "state": "Punjab",
        "specialty": "Implantologist & Smile Makeovers",
        "website": "https://luminadental.in"
    },
    {
        "doctor_name": "Dr. Ashish Sethi",
        "clinic_name": "International Implant Master",
        "email": "internationalimplantmaster@gmail.com",
        "phone": "+91-8440001985",
        "city": "Sector 21C, Chandigarh",
        "state": "Chandigarh",
        "specialty": "Cortico-Basal Implantologist & Oral Rehab Specialist",
        "website": "https://internationalimplantmaster.com"
    },
    {
        "doctor_name": "Dr. Kumar Saurav Singh",
        "clinic_name": "Glitterz Dental Clinic & Implant Center",
        "email": "glitterzdentalstudio@gmail.com",
        "phone": "+91-9354166741",
        "city": "Indirapuram, Ghaziabad",
        "state": "Uttar Pradesh",
        "specialty": "Periodontist, Implantologist & Smile Design",
        "website": "https://glitterzdental.com"
    },
    {
        "doctor_name": "Dr. Mayank Guptaa",
        "clinic_name": "Raj Dental and Implant Expert",
        "email": "drmayankguptaraj@gmail.com",
        "phone": "+91-9810856850",
        "city": "Sector 1, Vasundhara, Ghaziabad",
        "state": "Uttar Pradesh",
        "specialty": "Periodontist & Oral Implantologist",
        "website": "https://rajdentalandimplantexpert.com"
    },
    {
        "doctor_name": "Dr. Gaurav Singh",
        "clinic_name": "Riga Dentals",
        "email": "rigadentals@gmail.com",
        "phone": "+91-8700911588",
        "city": "Surajkund Road, Faridabad",
        "state": "Haryana",
        "specialty": "Periodontist, Implantologist & Smile Makeovers",
        "website": "https://rigadentals.in"
    },
    {
        "doctor_name": "Dr. Manisha Chowdhary",
        "clinic_name": "Candid Smyles Dental Clinic",
        "email": "thecandidsmyles@gmail.com",
        "phone": "+91-9289496677",
        "city": "Sector 15, Faridabad",
        "state": "Haryana",
        "specialty": "Laser Dentistry, Implants & Clear Aligners",
        "website": "https://drmanishadentistry.com"
    },
    {
        "doctor_name": "Dr. Santosh Mishra",
        "clinic_name": "Dental Cure & Care Centre",
        "email": "dentalcare.noida@gmail.com",
        "phone": "+91-9810768602",
        "city": "Sector 78, Noida",
        "state": "Uttar Pradesh",
        "specialty": "Implantologist & Endodontist",
        "website": "https://dentalcarenoida.com"
    },
    {
        "doctor_name": "Dr. Saurabh Kaushik",
        "clinic_name": "Dental Guards Multispeciality Clinic",
        "email": "dentalguards.104@gmail.com",
        "phone": "+91-8882716637",
        "city": "Sector 128, Noida",
        "state": "Uttar Pradesh",
        "specialty": "Orthodontist & Dentofacial Orthopedics",
        "website": "https://dentalguards.in"
    },
    {
        "doctor_name": "Dr. Anurag Khandelwal",
        "clinic_name": "Vital Dental Care",
        "email": "info@vitaldentalcare.co.in",
        "phone": "+91-8800901692",
        "city": "Sector 65, Gurugram",
        "state": "Haryana",
        "specialty": "Implantologist & Cosmetic Dentist",
        "website": "https://www.vitaldentalcare.co.in"
    },
    {
        "doctor_name": "Dr. Abhinav Kathuria",
        "clinic_name": "Aspen Dentals",
        "email": "hi@aspendentals.com",
        "phone": "+91-9667775530",
        "city": "DLF Phase 5, Gurugram",
        "state": "Haryana",
        "specialty": "Periodontist & Oral Implantologist",
        "website": "https://www.aspendentals.com"
    },
    {
        "doctor_name": "Dr. Aditi Kodesia",
        "clinic_name": "Dr. Kodesia's Dental Studio",
        "email": "draditikodesia@gmail.com",
        "phone": "+91-9810406222",
        "city": "Panchsheel Park, New Delhi",
        "state": "Delhi",
        "specialty": "Cosmetic Dentist, Implants & Aligners",
        "website": "https://drkodesia.com"
    },
    {
        "doctor_name": "Dr. Amit Narang",
        "clinic_name": "Dentinics",
        "email": "support@dentinics.com",
        "phone": "+91-9821006714",
        "city": "Hauz Khas, New Delhi",
        "state": "Delhi",
        "specialty": "Surgical & Prosthetic Implantologist",
        "website": "https://dentinics.com"
    },
    {
        "doctor_name": "Dr. Deepak Punhani",
        "clinic_name": "Punhani Tooth Care",
        "email": "drpunhani@gmail.com",
        "phone": "+91-9810905705",
        "city": "Vikaspuri, New Delhi",
        "state": "Delhi",
        "specialty": "Endodontist, Cosmetic Dentist & Implantologist",
        "website": "https://punhanitoothcare.com"
    },
    {
        "doctor_name": "Dr. Sachin Kundra",
        "clinic_name": "Dr. Kundra Dental Care & Implant Clinic",
        "email": "kundradental@gmail.com",
        "phone": "+91-9810372282",
        "city": "Preet Vihar, Delhi",
        "state": "Delhi",
        "specialty": "Oral Implantologist & Cosmetic Dentist",
        "website": "https://kundradentalclinic.com"
    },
    {
        "doctor_name": "Dr. Sachet Popli",
        "clinic_name": "Dr. Popli's Dental Clinic & Implant Centre",
        "email": "sachetpopli@gmail.com",
        "phone": "+91-9968844479",
        "city": "Anand Vihar, New Delhi",
        "state": "Delhi",
        "specialty": "Prosthodontist & Oral Implantologist",
        "website": "https://drpoplidental.com"
    },
    {
        "doctor_name": "Dr. Vivek Bhutani",
        "clinic_name": "Dr. Bhutani's Smile Makers Dental Clinic",
        "email": "drvivekbhutani@yahoo.com",
        "phone": "+91-9811176355",
        "city": "Pitampura, New Delhi",
        "state": "Delhi",
        "specialty": "Implantologist & Cosmetic Dental Surgeon",
        "website": "https://drbhutanismilemakers.com"
    },
    {
        "doctor_name": "Dr. Sheri Yadav",
        "clinic_name": "Dr. Mohan's Dental Clinic",
        "email": "sheriyadav@ymail.com",
        "phone": "+91-7217624411",
        "city": "Pitampura, New Delhi",
        "state": "Delhi",
        "specialty": "Implantologist & Aesthetic Dentist",
        "website": "https://drmohandentalclinic.com"
    },
    {
        "doctor_name": "Dr. Gaurav Pandav",
        "clinic_name": "Pandav Multispeciality Dental Clinic",
        "email": "pandavdentalcare@gmail.com",
        "phone": "+91-9041417176",
        "city": "Arya Samaj Chowk, Patiala",
        "state": "Punjab",
        "specialty": "Implantologist & Cosmetic Dental Surgeon",
        "website": "https://pandavdentalcare.com"
    },
    {
        "doctor_name": "Dr. Ankur Garg",
        "clinic_name": "Garg Dental Care & Implant Centre",
        "email": "care@gargdentalcentre.com",
        "phone": "+91-9910591338",
        "city": "Model Town, Sonipat",
        "state": "Haryana",
        "specialty": "Oral & Maxillofacial Surgeon, Implantologist",
        "website": "https://gargdentalcentre.com"
    },
    {
        "doctor_name": "Dr. Bhupesh Mukhija",
        "clinic_name": "Mukhija Dental Clinic",
        "email": "info@mukhijadentalclinic.com",
        "phone": "+91-7206722618",
        "city": "Model Town, Sonipat",
        "state": "Haryana",
        "specialty": "Dental Implants, Orthodontics & Oral Surgery",
        "website": "https://www.mukhijadentalclinic.com"
    },
    {
        "doctor_name": "Dr. Sushil Mittal",
        "clinic_name": "Dr. Mittal's Advanced Dental & Orthodontic Clinic",
        "email": "mittaldentals@gmail.com",
        "phone": "+91-9416486808",
        "city": "Sector 15, Sonipat",
        "state": "Haryana",
        "specialty": "Consultant Orthodontist & Clear Aligners Specialist",
        "website": "https://www.mittaldentals.com"
    },
    {
        "doctor_name": "Dr. Sunil Arora",
        "clinic_name": "Shree Dental Care Centre",
        "email": "dentistambala@gmail.com",
        "phone": "+91-8571885718",
        "city": "Ambala City",
        "state": "Haryana",
        "specialty": "Prosthodontist & Implantologist",
        "website": "https://dentistambala.com"
    },
    {
        "doctor_name": "Dr. Rukman Jindal",
        "clinic_name": "Jindal Dental Care & Implant Centre",
        "email": "info@ambaladental.com",
        "phone": "+91-7015928179",
        "city": "Ambala City",
        "state": "Haryana",
        "specialty": "Oral & Maxillofacial Surgeon, Implantologist",
        "website": "https://ambaladental.com"
    },
    {
        "doctor_name": "Dr. Mansi Choudhary",
        "clinic_name": "Dental Studio Panipat",
        "email": "drmansichoudhary@gmail.com",
        "phone": "+91-8930227707",
        "city": "Model Town, Panipat",
        "state": "Haryana",
        "specialty": "Smile Design & Oral Implantology",
        "website": "https://dentalstudio.org.in"
    },
    {
        "doctor_name": "Dr. Amit Arora",
        "clinic_name": "Shine Dental Care & Implant Centre",
        "email": "shinedentalkarnal@gmail.com",
        "phone": "+91-9996009777",
        "city": "Sector 13, Karnal",
        "state": "Haryana",
        "specialty": "Implantologist & Aesthetic Dentist",
        "website": "https://shine.dental-care.co.in"
    },
    {
        "doctor_name": "Dr. Jatin Arya",
        "clinic_name": "Perfect Dental",
        "email": "perfectdental14@gmail.com",
        "phone": "+91-9729745909",
        "city": "Sector 6, Karnal",
        "state": "Haryana",
        "specialty": "Oral Implantologist & Cosmetic Dentist",
        "website": "https://perfectdental.org.in"
    }
]

out_file = "/Users/pratyushraj/Desktop/dental-crm/scripts/fresh_leads_north_nov13.json"
with open(out_file, "w", encoding="utf-8") as f:
    json.dump(leads, f, indent=2)

print(f"Successfully saved {len(leads)} leads to {out_file}")
