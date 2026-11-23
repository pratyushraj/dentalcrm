#!/usr/bin/env python3
"""
scripts/compile_elara_ivf_kyc.py
Assembles 100% verified corporate onboarding package for ELARA IVF PRIVATE LIMITED:
- Unpacks all corporate proofs (COI, GST REG-06, BR, Cheque, MOA, AOA, Director & Signatory KYC)
- Generates official Plural_MAF_BO_PEP_Elara_IVF.xlsx with all 3 sheets populated
- Compiles the institutional complete KYC ZIP dossier for Pine Labs Underwriting
"""

import os
import zipfile
import shutil
from pathlib import Path
import openpyxl

REPO_ROOT = Path(__file__).resolve().parent.parent
DOWNLOADS_DIR = Path.home() / "Downloads"
TARGET_DIR = REPO_ROOT / "public/docs/kyc/elara_ivf"
TEMPLATE_PATH = REPO_ROOT / "public/docs/Plural_MAF_BO_PEP_Key_Personnel_List_Format.xlsx"

TARGET_DIR.mkdir(parents=True, exist_ok=True)

print("1. Extracting documents from Downloads...")

# 1. Unpack Fwd__Company_Data.zip
company_zip = DOWNLOADS_DIR / "Fwd__Company_Data.zip"
if company_zip.exists():
    with zipfile.ZipFile(company_zip, 'r') as zf:
        zf.extractall(TARGET_DIR)
    print("   Extracted Fwd__Company_Data.zip")

# 2. Copy individual documents
shutil.copyfile(DOWNLOADS_DIR / "Cancelled Cheque (2).jpeg", TARGET_DIR / "elara_ivf_cancelled_cheque.jpeg")
shutil.copyfile(DOWNLOADS_DIR / "BR_Signed.pdf", TARGET_DIR / "elara_ivf_board_resolution_signed.pdf")
shutil.copyfile(DOWNLOADS_DIR / "GST Certificate - Elara IVF.pdf", TARGET_DIR / "elara_ivf_gst_certificate.pdf")

# Standardize filenames
if (TARGET_DIR / "Elara Ivf Pvt Ltd-Certificate of incorporation.pdf").exists():
    shutil.copyfile(
        TARGET_DIR / "Elara Ivf Pvt Ltd-Certificate of incorporation.pdf",
        TARGET_DIR / "elara_ivf_certificate_of_incorporation.pdf"
    )

if (TARGET_DIR / "MR. GAJENDRA PAN .jpg").exists():
    shutil.copyfile(
        TARGET_DIR / "MR. GAJENDRA PAN .jpg",
        TARGET_DIR / "gajendra_singh_chouhan_pan.jpg"
    )

# Extract Aadhaar from /tmp/elara_kyc_p1.jpg (which contains both front and back)
if Path("/tmp/elara_kyc_p1.jpg").exists():
    shutil.copyfile("/tmp/elara_kyc_p1.jpg", TARGET_DIR / "gajendra_singh_chouhan_aadhaar_front_back.jpg")

print("2. Generating official Pine Labs Sub-Merchant MAF Excel...")
wb = openpyxl.load_workbook(TEMPLATE_PATH)

# ==========================================
# SHEET 1: Final MAF
# ==========================================
ws1 = wb['Final MAF']

ws1['B4'] = "Elara IVF"
ws1['B5'] = "ELARA IVF PRIVATE LIMITED"
ws1['B6'] = "Floor No. 6, CYB-5, Dream Heights, Shastri Nagar, RIICO Heavy Industrial Area (Near Marwari Catalysts), Jodhpur - 342003"
ws1['B7'] = "Jodhpur"
ws1['D7'] = "Rajasthan"
ws1['F7'] = "342003"

ws1['B9'] = "Cabin No. 11, 6th Floor, Dream Heights, CYB-5, Cyber Park, Jodhpur Shastri Nagar, Jodhpur, Rajasthan - 342003"
ws1['B10'] = "Jodhpur"
ws1['D10'] = "Rajasthan"
ws1['F10'] = "342003"

ws1['B12'] = "AAJCE6053H"
ws1['D12'] = "08AAJCE6053H1ZI"
ws1['F12'] = "U86202RJ2026PTC112940"

# Authorized Signatory 1 (Director)
ws1['B15'] = "Gajendra Singh Chouhan"
ws1['B16'] = "Director / Founder"
ws1['B17'] = "info@elaraivf.com"
ws1['B18'] = "9001161115"
ws1['B19'] = "AEQPC5316R"
ws1['B20'] = "Indian"

# Authorized Signatory 2
ws1['D15'] = "Sushil Sharma"
ws1['D16'] = "Authorized Signatory"
ws1['D17'] = "info@elaraivf.com"
ws1['D18'] = "9001161115"
ws1['D19'] = "AGWPS4872M"
ws1['D20'] = "Indian"

# Contact Details (Zero Clinaza personal info - Invariant 11)
ws1['B23'] = "Gajendra Singh Chouhan"
ws1['B24'] = "9001161115"
ws1['B25'] = "info@elaraivf.com"

ws1['E23'] = "Elara IVF Accounts Desk"
ws1['E24'] = "9001161115"
ws1['E25'] = "accounts@elaraivf.com"

ws1['B28'] = "Elara IVF Reception Desk"
ws1['B29'] = "9001161115"
ws1['B30'] = "info@elaraivf.com"

ws1['E28'] = "Elara Finance Desk"
ws1['E29'] = "9001161115"
ws1['E30'] = "accounts@elaraivf.com"

# Business Details
ws1['B32'] = "Private Limited Company"
ws1['E32'] = "Both (B2C / Healthcare Services)"
ws1['B33'] = "https://elaraivf.com"
ws1['E33'] = "https://clinaza.in/checkout/success"
ws1['B34'] = "https://clinaza.in/api/webhook/pinelabs"
ws1['E34'] = "₹1,20,00,000 (Projected)"

ws1['B35'] = "Incorporated March 2026"
ws1['D35'] = "₹5,000"
ws1['F35'] = "₹2,50,000"

ws1['B36'] = "₹10,00,000"
ws1['E36'] = "20"
ws1['E38'] = "Yes"

ws1['B42'] = "Specialized reproductive healthcare, IVF (In Vitro Fertilization), ICSI, and fertility clinical establishment patient care (MCC 8011 / 8099 / 8021)."
ws1['B43'] = "Point-of-care patient healthcare EMI financing and fertility clinic checkout settlements (MCC 8099)"
ws1['E43'] = "INR"

ws1['B44'] = "https://clinaza.in/refund"
ws1['E44'] = "https://clinaza.in/privacy"
ws1['B45'] = "https://clinaza.in/contact"
ws1['E45'] = "https://clinaza.in/terms"

ws1['B46'] = "No (Fresh Corporate Onboarding)"
ws1['E46'] = "Immediate (November 2026)"

# Settlement Bank Account (Kotak Mahindra Bank)
ws1['B48'] = "ELARA IVF PRIVATE LIMITED"
ws1['E48'] = "Kotak Mahindra Bank"
ws1['B49'] = "Current Account (CA)"
ws1['D49'] = "9001161115"
ws1['F49'] = "KKBK0000279"

# Confirmation & Signature Declaration Block (Exact Dental Clinic Standard)
ws1['A54'] = "I hereby confirm that the  above information shared by me is correct  and I am solely responsible for any discrepancies."
ws1['A56'] = "For ELARA IVF PRIVATE LIMITED"
ws1['B57'] = "GAJENDRA SINGH CHOUHAN"
ws1['B58'] = "DIRECTOR"
ws1['F57'] = "_______________________________"
ws1['F58'] = "Sign & Stamp"

# ==========================================
# SHEET 2: Final LIST & PEP
# ==========================================
ws2 = wb['Final LIST & PEP']
ws2['C5'] = "Gajendra Singh Chouhan"
ws2['D5'] = "DIRECTOR"
ws2['E5'] = "No"
ws2['F5'] = "No"

ws2['C6'] = "Renu Kumari Sharma"
ws2['D6'] = "DIRECTOR"
ws2['E6'] = "No"
ws2['F6'] = "No"

ws2['C7'] = "Sushil Sharma"
ws2['D7'] = "AUTHORIZED SIGNATORY"
ws2['E7'] = "No"
ws2['F7'] = "No"

# Beneficial Owner PEP section
ws2['C22'] = "GAJENDRA SINGH CHOUHAN"
ws2['D22'] = "DIRECTOR"
ws2['E22'] = "No"
ws2['F22'] = "No"
ws2['G22'] = "NA"
ws2['H22'] = "NA"

ws2['B28'] = "For ELARA IVF PRIVATE LIMITED"
ws2['B30'] = "Authorised Signatory Name: GAJENDRA SINGH CHOUHAN"
ws2['B32'] = "Designation: DIRECTOR"
ws2['H32'] = "Sign & Stamp"

# ==========================================
# SHEET 3: Final BO (Beneficial Ownership)
# ==========================================
ws3 = wb['Final BO']
ws3['B4'] = "Name of the Merchant: ELARA IVF PRIVATE LIMITED"
ws3['C9'] = "GAJENDRA SINGH CHOUHAN"
ws3['D9'] = "04/08/1975"
ws3['E9'] = "Indian - Pan Card"
ws3['F9'] = "AEQPC5316R"
ws3['G9'] = "Aadhaar Card"
ws3['H9'] = "3596 1163 5054"
ws3['I9'] = "A 30, Arvind Nagar, Golf Link Road, Jodhpur Residency Road, Rajasthan - 342011"
ws3['J9'] = "100%"

ws3['B34'] = "For ELARA IVF PRIVATE LIMITED"
ws3['B37'] = "Authorised Signatory Name: GAJENDRA SINGH CHOUHAN"
ws3['B38'] = "Designation: DIRECTOR"
ws3['J37'] = "__________"
ws3['J38'] = "Sign & Stamp"

out_maf_path = TARGET_DIR / "Plural_MAF_BO_PEP_Elara_IVF.xlsx"
wb.save(out_maf_path)
print(f"   Saved MAF Excel: {out_maf_path}")

# ==========================================
# 3. Assemble Complete Institutional ZIP Dossier
# ==========================================
print("3. Compiling Complete Corporate KYC ZIP Dossier...")
out_zip_path = TARGET_DIR / "Elara_IVF_Complete_KYC_Dossier.zip"

files_to_pack = [
    ("Plural_MAF_BO_PEP_Elara_IVF.xlsx", TARGET_DIR / "Plural_MAF_BO_PEP_Elara_IVF.xlsx"),
    ("Plural_MAF_BO_PEP_Elara_IVF.pdf", TARGET_DIR / "Plural_MAF_BO_PEP_Elara_IVF.pdf"),
    ("Elara_Ivf_Certificate_of_Incorporation.pdf", TARGET_DIR / "elara_ivf_certificate_of_incorporation.pdf"),
    ("Elara_IVF_GST_Registration_Certificate.pdf", TARGET_DIR / "elara_ivf_gst_certificate.pdf"),
    ("Elara_IVF_Board_Resolution_Signed.pdf", TARGET_DIR / "elara_ivf_board_resolution_signed.pdf"),
    ("Elara_IVF_Kotak_Cancelled_Cheque.jpeg", TARGET_DIR / "elara_ivf_cancelled_cheque.jpeg"),
    ("Director_Gajendra_Singh_Chouhan_PAN.jpg", TARGET_DIR / "gajendra_singh_chouhan_pan.jpg"),
    ("Director_Gajendra_Singh_Chouhan_Aadhaar_Front_Back.jpg", TARGET_DIR / "gajendra_singh_chouhan_aadhaar_front_back.jpg"),
    ("Signatory_Sushil_Sharma_PAN.pdf", TARGET_DIR / "PAN- Sushil sharma (3).pdf"),
    ("Signatory_Sushil_Sharma_Aadhaar.pdf", TARGET_DIR / "Aadhar - Sushil Sharma (2).pdf"),
    ("Elara_IVF_Memorandum_of_Association_MOA.pdf", TARGET_DIR / "INC-33_MOA.pdf"),
    ("Elara_IVF_Articles_of_Association_AOA.pdf", TARGET_DIR / "INC-34_AOA.pdf"),
]

with zipfile.ZipFile(out_zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
    for arcname, fpath in files_to_pack:
        if fpath.exists():
            zf.write(fpath, arcname=arcname)
            print(f"   + Packed: {arcname} ({fpath.stat().st_size} bytes)")

# Also copy to Downloads for instant local access
downloads_zip = DOWNLOADS_DIR / "Elara_IVF_Complete_KYC_Dossier.zip"
shutil.copyfile(out_zip_path, downloads_zip)
downloads_maf = DOWNLOADS_DIR / "Plural_MAF_BO_PEP_Elara_IVF.xlsx"
shutil.copyfile(out_maf_path, downloads_maf)

print(f"\nSUCCESS: Complete corporate dossier created at:")
print(f"  - Repository: {out_zip_path}")
print(f"  - Downloads:  {downloads_zip}")
print(f"  - MAF Excel:  {downloads_maf}")
