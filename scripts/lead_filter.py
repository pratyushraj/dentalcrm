"""
Clinaza Lead Qualification & Underwriting Filter Module
Ensures 100% compliance with high-ticket dental clinic targeting and fintech loan-approval criteria.
"""

import re

# 1. CORPORATE CHAINS (Zero local branch authority)
CORPORATE_CHAINS = [
    r'clovedental',
    r'sabkadentist',
    r'apollowhite',
    r'apollodental',
    r'parthadental',
    r'myoms',
    r'dentzz',
    r'orthosquare',
    r'32smiles',
    r'axissdental',
    r'partha\s*dental'
]

# 2. PEDIATRIC / KIDS ONLY (Zero high-ticket implants/aligners)
PEDIATRIC_TERMS = [
    r'\bpediatric\b',
    r'\bpedodont',
    r'\bkids?\s*dental',
    r'\bchildren',
    r'\blittle\s*teeth',
    r'\btiny\s*teeth',
    r'\bchild\s*dental',
    r'\bkids\s*dentist\b'
]

# 3. CHARITY, TRUST, GOVT & ACADEMIC COLLEGES (No commercial fintech authority)
CHARITY_GOVT_COLLEGE = [
    r'\btrust\b',
    r'\bcharit',
    r'\brotary\b',
    r'\blions\s*club',
    r'\bmission\b',
    r'\bgovt\b',
    r'\bgovernment\b',
    r'\baiims\b',
    r'\besic\b',
    r'\brailway\b',
    r'\bdental\s*college',
    r'\bmedical\s*college',
    r'\buniversity\b',
    r'\bfaculty\b',
    r'\bprofessor\b',
    r'\blecturer\b',
    r'\bhospital\s*resident\b'
]

# 4. LOW-INCOME / INFORMAL CASH-ECONOMY / INDUSTRIAL ZONES
# (High bank rejection rate, no ITR/salary proof, high default risk)
LOW_APPROVAL_ZONES = [
    # Delhi NCR informal/industrial
    r'\bseelampur\b',
    r'\bjahangirpuri\b',
    r'\bmangolpuri\b',
    r'\bsultanpuri\b',
    r'\bnangloi\b',
    r'\bmundka\b',
    r'\bbawana\b',
    r'\bnarela\b',
    r'\bmayapuri\s*ind',
    r'\bkarawal\s*nagar\b',
    r'\bmustafabad\b',
    
    # Mumbai MMR informal/industrial
    r'\bdharavi\b',
    r'\bgovandi\b',
    r'\bmankhurd\b',
    r'\bmalwani\b',
    r'\bmumbra\b',
    r'\bbhiwandi\b',
    r'\bnalasopara\s*east\b',
    r'\bturbhe\s*midc\b',
    r'\brabale\s*midc\b',
    
    # Bengaluru industrial
    r'\bpeenya\b',
    
    # Gujarat industrial
    r'\bvatva\s*gidc\b',
    r'\bnaroda\s*gidc\b',
    r'\bpandewara\b',
    
    # General terms
    r'\bindustrial\s*estate\b',
    r'\bwholesale\s*mandi\b'
]

# 5. PRIME HIGH-APPROVAL TARGET HUBS (High CIBIL, Salaried Corporate & Affluent Business)
HIGH_APPROVAL_HUBS = [
    # Delhi NCR
    'greater kailash', 'gk', 'south extension', 'south ext', 'vasant vihar', 'defence colony',
    'green park', 'hauz khas', 'punjabi bagh', 'rajouri garden', 'dwarka', 'golf course',
    'dlf', 'cyber city', 'sector 54', 'sector 56', 'sohna road', 'noida sector 18', 'sector 50', 'sector 62',
    # Mumbai
    'bandra', 'juhu', 'khar', 'santacruz', 'worli', 'prabhadevi', 'colaba', 'powai', 'hiranandani',
    'lokhandwala', 'versova', 'andheri west', 'borivali west', 'vashi', 'seawoods', 'palm beach',
    # Bengaluru
    'indiranagar', 'koramangala', 'hsr', 'whitefield', 'bellandur', 'sarjapur', 'jayanagar',
    'jp nagar', 'malleshwaram', 'sadashivanagar', 'richmond town', 'lavelle road',
    # Hyderabad
    'jubilee hills', 'banjara hills', 'gachibowli', 'madhapur', 'hitec city', 'kondapur', 'kphb',
    # Pune
    'koregaon park', 'kalyani nagar', 'viman nagar', 'baner', 'aundh', 'balewadi', 'wakad', 'kothrud',
    # Ahmedabad
    'sindhu bhavan', 'sbr', 'bodakdev', 'satellite', 'prahlad nagar', 'ambawadi', 'vastrapur',
    # Chandigarh Tricity
    'chandigarh sector', 'sector 8', 'sector 9', 'sector 17', 'sector 35', 'mohali phase', 'panchkula sector',
    # Jaipur
    'c-scheme', 'civil lines', 'malviya nagar', 'vaishali nagar',
    # Chennai
    'adyar', 'anna nagar', 'alwarpet', 'nungambakkam', 'omr', 'velachery',
    # Kolkata
    'salt lake', 'new town', 'park street', 'ballygunge', 'alipore',
    # Others
    'vijay nagar', 'palasia', 'race course', 'panampilly nagar'
]

def evaluate_lead(lead):
    """
    Evaluates a dental lead dictionary.
    Returns: (is_qualified: bool, reason: str, tier: str)
    """
    clinic = (lead.get("clinic_name") or "").lower()
    doctor = (lead.get("doctor_name") or "").lower()
    email = (lead.get("email") or "").lower()
    city = (lead.get("city") or "").lower()
    specialty = (lead.get("specialty") or "").lower()
    website = (lead.get("website") or "").lower()
    full_text = f"{clinic} {doctor} {email} {city} {specialty} {website}"

    # Check 1: Corporate Chains
    for pat in CORPORATE_CHAINS:
        if re.search(pat, full_text):
            return False, f"Corporate chain excluded ({pat})", "DISQUALIFIED"

    # Check 2: Pediatric Only
    for pat in PEDIATRIC_TERMS:
        if re.search(pat, clinic) or re.search(pat, specialty) or re.search(pat, email):
            return False, f"Pediatric only excluded ({pat})", "DISQUALIFIED"

    # Check 3: Charity, Govt, Trust, Academic
    for pat in CHARITY_GOVT_COLLEGE:
        if re.search(pat, clinic) or re.search(pat, email) or re.search(pat, doctor):
            return False, f"Charity/Govt/College excluded ({pat})", "DISQUALIFIED"

    # Check 4: Low-Income / Informal / Industrial Zones
    for pat in LOW_APPROVAL_ZONES:
        if re.search(pat, full_text):
            return False, f"Low loan approval informal/industrial zone ({pat})", "DISQUALIFIED"

    # Determine Credit Tier
    is_prime_hub = any(hub in full_text for hub in HIGH_APPROVAL_HUBS)
    is_high_ticket = any(term in full_text for term in ['implant', 'aligner', 'invisalign', 'aesthetic', 'cosmetic', 'smile', 'prosthodont', 'orthodont'])

    if is_prime_hub and is_high_ticket:
        tier = "TIER_1_PRIME"
    elif is_prime_hub or is_high_ticket:
        tier = "TIER_2_QUALIFIED"
    else:
        tier = "GENERAL_QUALIFIED"

    return True, "Passed all underwriting and clinical filters", tier

if __name__ == "__main__":
    # Test cases
    test_leads = [
        {"clinic_name": "Clove Dental Green Park", "email": "greenpark@clovedental.in", "city": "Delhi"},
        {"clinic_name": "Little Teeth Kids Clinic", "email": "info@littleteeth.com", "city": "Bengaluru"},
        {"clinic_name": "Rotary Charitable Dental Centre", "email": "rotary@gmail.com", "city": "Mumbai"},
        {"clinic_name": "Dharavi Smile Centre", "email": "dharavi@gmail.com", "city": "Mumbai"},
        {"clinic_name": "Apex Dental Implants & Aligners", "email": "info@apexdental.com", "city": "Bengaluru", "specialty": "Dental Implants & Invisalign", "clinic_name": "Apex Dental Indiranagar"},
        {"clinic_name": "Bandra Aesthetic Dental Studio", "email": "drsharma@gmail.com", "city": "Mumbai", "specialty": "Cosmetic Smile Design"}
    ]
    for tl in test_leads:
        ok, reason, tier = evaluate_lead(tl)
        print(f"[{'PASS' if ok else 'FAIL'}] {tl.get('clinic_name')}: {reason} ({tier})")
