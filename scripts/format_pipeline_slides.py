from dotenv import load_dotenv
import os, urllib.request, json, re

load_dotenv('.env')
load_dotenv('.env.local')

url = os.environ.get('VITE_SUPABASE_URL')
key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY') or os.environ.get('VITE_SUPABASE_ANON_KEY')

req = urllib.request.Request(
    f'{url}/rest/v1/clinic_onboardings?select=id,clinic_name,doctor_name,city,chairs,premises_type,google_rating,review_count,specialties,avg_monthly_cases,expected_emi_loans,avg_ticket_size,has_current_account,business_proof_type,has_cancelled_cheque,created_at&order=created_at.desc',
    headers={'apikey': key, 'Authorization': f'Bearer {key}'}
)

def clean_name(c_name, d_name):
    c = (c_name or '').strip()
    d = (d_name or '').strip()
    if d and not d.lower().startswith('dr'):
        d = f"Dr. {d}"
    
    # Capitalize / clean long names
    if c == "Your dentist payna":
        c = "Your Dentist Patna"
    elif c == "Impressions dental clinic and dr shalini's homeo skin and laser clinic":
        c = "Impressions Dental & Laser Clinic"
    elif c == "Sai Multispeciality Dental Clinic and Implant Center":
        c = "Sai Multispeciality & Implant Center"
    elif c == "Kidz N Family TRUESMILE DENTAL CLINIC":
        c = "Kidz N Family TrueSmile Dental"
    elif c == "Trimurti multi Speciality Dental Clinic":
        c = "Trimurti Multi-Speciality Dental"
    elif c == "Tirupati Balaji Dental and Face Clinic":
        c = "Tirupati Balaji Dental & Face Clinic"
    elif c == "Tandon dental care and implant centre":
        c = "Tandon Dental & Implant Centre"
    elif c == "Vasantha dental clinic and implant center":
        c = "Vasantha Dental & Implant Center"
    elif c == "Whitedent Dental Clinic by Dr Anshuman":
        c = "WhiteDent Dental Clinic"
    elif c == "Auro dental & healthcare":
        c = "Auro Dental & Healthcare"
    elif c == "KEEP SMILING DENTAL CLINIC":
        c = "Keep Smiling Dental Clinic"
    elif c == "RATAN KRISHNA DENTAL CARE":
        c = "Ratan Krishna Dental Care"
    elif c == "AMBIKA DENTAL CARE":
        c = "Ambika Dental Care"
    elif c == "Prodent clinic":
        c = "Prodent Dental Clinic"
    elif c == "Exl dentists":
        c = "EXL Dentists"
    elif c == "Dental world Dwarka":
        c = "Dental World Dwarka"
    elif c == "My Family Dentist Dental Implants Centre":
        c = "My Family Dentist & Implant Centre"
    elif c == "Step to smile dental clinic":
        c = "Step To Smile Dental Clinic"
    elif c == "Smile Dental Clinic":
        c = "Smile Dental Clinic"
    elif c == "Kiran Dental Care":
        c = "Kiran Dental Care"
    elif c == "Smile Nation Multi-speciality Dental Clinic":
        c = "Smile Nation Multi-Speciality Clinic"
    elif c == "Dr. Amitha Family Dental Care":
        c = "Dr. Amitha Family Dental Care"
    elif c == "Dr. Pawar's Advanced Dentistry":
        c = "Dr. Pawar's Advanced Dentistry"
    elif c == "Dantsri Dental Hospital":
        c = "Dantsri Dental Hospital"
    elif c == "YFDL DENTAL LAB EXPERTS LLP":
        c = "YFDL Dental Lab Experts"
        
    return c, d

def clean_city(raw):
    if not raw: return 'India'
    c = raw.strip()
    c = re.sub(r'(?i)and bihar', '', c)
    c = re.sub(r'(?i), bihar', '', c)
    c = re.sub(r'(?i), maharashtra', '', c)
    c = re.sub(r'(?i), rajasthan', '', c)
    c = re.sub(r'(?i), punjab', '', c)
    c = re.sub(r'(?i)andhrapradesh', '', c)
    c = re.sub(r'\d+', '', c)
    c = c.strip(' ,')
    mapping = {
        'delhi': 'New Delhi',
        'gurugram': 'Gurugram, NCR',
        'kurnool': 'Kurnool, AP',
        'navi mumbai': 'Navi Mumbai, MH',
        'thane': 'Thane, MH',
        'bangalore': 'Bengaluru, KA',
        'visakhapatnam': 'Visakhapatnam, AP',
        'jodhpur': 'Jodhpur, RJ',
        'haridwar': 'Haridwar, UK',
        'jhanjharpur': 'Jhanjharpur, BR',
        'patna': 'Patna, BR',
        'mumbai': 'Mumbai, MH',
        'chinchwad pune': 'Pune / Chinchwad, MH',
        'dholpur': 'Dholpur, RJ',
        'hyderabad': 'Hyderabad, TS',
        'chandigarh': 'Chandigarh (UT)',
        'ludhiana': 'Ludhiana, PB',
        'buldhana': 'Buldhana, MH',
        'hanumangarh': 'Hanumangarh, RJ'
    }
    return mapping.get(c.lower(), c.title())

def format_ticket(raw):
    if not raw or raw == 'None': return '₹35,000'
    clean = re.sub(r'[Rs\.₹\s\+]', '', raw).strip()
    if '-' in clean:
        parts = [int(p) for p in re.findall(r'\d+', clean.replace(',', ''))]
        if len(parts) >= 2:
            return f'₹{parts[0]:,} – ₹{parts[1]:,}'
    # Remove all non-digits to get pure integer
    digits = re.sub(r'[^\d]', '', clean)
    if digits:
        val = int(digits)
        if val < 1000: val = val * 1000
        return f'₹{val:,}'
    return '₹35,000'

def get_focus(specs):
    s = specs or []
    if any('Implant' in x for x in s) and any('Aligner' in x or 'Ortho' in x for x in s):
        return 'Implants & Aligners'
    elif any('Implant' in x for x in s) and any('Full Mouth' in x for x in s):
        return 'Implants & Full Mouth'
    elif any('Aligner' in x for x in s):
        return 'Clear Aligners'
    elif any('Implant' in x for x in s):
        return 'Dental Implants'
    elif any('Crown' in x for x in s) or any('RCT' in x for x in s):
        return 'Crown & Restorative'
    return 'Multi-Speciality'

with urllib.request.urlopen(req) as resp:
    data = json.loads(resp.read().decode())
    print(f'Fetched {len(data)} rows')
    
    rows = []
    for i, r in enumerate(data):
        c_name, d_name = clean_name(r.get('clinic_name'), r.get('doctor_name'))
        city = clean_city(r.get('city'))
        chairs = r.get('chairs') or '2 Chairs'
        focus = get_focus(r.get('specialties'))
        ticket = format_ticket(r.get('avg_ticket_size'))
        loans = r.get('expected_emi_loans') or '3–5'
        if loans == 'None': loans = '3–5'
        
        rows.append({
            'clinic_name': c_name,
            'doctor_name': d_name,
            'city': city,
            'chairs': chairs,
            'focus': focus,
            'ticket': ticket,
            'loans': f"{loans} /mo",
            'current_ac': r.get('has_current_account') or 'Yes',
            'cheque': r.get('has_cancelled_cheque') or 'Yes'
        })
    
    with open('scripts/pipeline_clinics_data.json', 'w') as out:
        json.dump(rows, out, indent=2)
    print("Saved pipeline_clinics_data.json successfully with", len(rows), "rows")
