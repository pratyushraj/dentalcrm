import openpyxl
import os
import shutil

source_path = '/Users/pratyushraj/Downloads/Plural _MAF_BO_PEP_Key Personnel List_Format.xlsx'
backup_path = '/Users/pratyushraj/Downloads/Plural _MAF_BO_PEP_Key Personnel List_Format_ORIGINAL_BACKUP.xlsx'

if not os.path.exists(backup_path):
    shutil.copyfile(source_path, backup_path)
    print("Backup created at:", backup_path)

wb = openpyxl.load_workbook(source_path)

# ==========================================
# 1. SHEET: Final MAF
# ==========================================
ws_maf = wb['Final MAF']

# Row 4: Merchant DBA / Trade Name
ws_maf['B4'] = "Clinaza"

# Row 5: Merchant Legal Name
ws_maf['B5'] = "Mellowprints"

# Row 6: Operating Address Line 1
ws_maf['B6'] = "Road No-1, Mahesh Nagar, S.K. Puri, Patna"

# Row 7: City, State, PIN
ws_maf['B7'] = "Patna"
ws_maf['D7'] = "Bihar"
ws_maf['F7'] = "800024"

# Row 9: Registered Address Line 1
ws_maf['B9'] = "Sharma Sadan, Road No-1, Mahesh Nagar, P.O. Keshri Nagar, Patna"

# Row 10: City, State, PIN
ws_maf['B10'] = "Patna"
ws_maf['D10'] = "Bihar"
ws_maf['F10'] = "800024"

# Row 12: Company PAN, GST, Business Identifier (Udyam)
ws_maf['B12'] = "DXRPR3052Q"
ws_maf['D12'] = "10DXRPR3052Q1ZV"
ws_maf['F12'] = "UDYAM-BR-26-0005161"

# Row 15 - 20: Authorized Signatory Details
ws_maf['B15'] = "PRATYUSH RAJ"
ws_maf['B16'] = "Proprietor / Founder"
ws_maf['B17'] = "pratyushraj@outlook.com"
ws_maf['B18'] = "7292984244"
ws_maf['B19'] = "DXRPR3052Q"
ws_maf['B20'] = "Indian"

# Row 23 - 25: Primary Contact Details
ws_maf['B23'] = "Pratyush Raj"
ws_maf['E23'] = "Pratyush Raj"
ws_maf['B24'] = "7292984244"
ws_maf['E24'] = "7292984244"
ws_maf['B25'] = "contact@clinaza.in"
ws_maf['E25'] = "pratyushraj@outlook.com"

# Row 28 - 30: Alternate Contact Details
ws_maf['B28'] = "Clinic Reception Desk"
ws_maf['E28'] = "Clinic Accounts Desk"
ws_maf['B29'] = None
ws_maf['E29'] = None
ws_maf['B30'] = "clinic-reception@example.com"
ws_maf['E30'] = "clinic-accounts@example.com"

# Row 32: Business Entity Type & Business Type
ws_maf['B32'] = "Proprietorship"
ws_maf['E32'] = "Both"

# Row 33: Website URL & Return URL
ws_maf['B33'] = "https://clinaza.in"
ws_maf['E33'] = "https://clinaza.in/checkout/success"

# Row 34: Webhook & Turnover
ws_maf['B34'] = "https://api.clinaza.in/webhook/plural"
ws_maf['E34'] = "₹1,50,00,000 (Projected)"

# Row 35: Experience & Ticket Sizes
ws_maf['B35'] = "4 Years (Registered Nov 2020)"
ws_maf['D35'] = "₹2,000"
ws_maf['F35'] = "₹1,50,000"

# Row 36: Expected Monthly Card Turnover & Transactions
ws_maf['B36'] = "₹20,00,000"
ws_maf['E36'] = "80"

# Row 38: Web Only
ws_maf['E38'] = "Yes"

# Row 42: Line of Business Description
ws_maf['B42'] = "Point-of-care healthcare financing & dental practice management software platform facilitating patient EMI options and clinic desk collections across partner dental clinics."

# Row 43: Purpose & Acceptance Mode
ws_maf['B43'] = "Patient treatment EMI collections and clinic checkout settlements (MCC 8021)"
ws_maf['E43'] = "INR"

# Row 44 - 45: Policy URLs
ws_maf['B44'] = "https://clinaza.in/refund"
ws_maf['E44'] = "https://clinaza.in/privacy"
ws_maf['B45'] = "https://clinaza.in/contact"
ws_maf['E45'] = "https://clinaza.in/terms"

# Row 46: Competition & Go Live
ws_maf['B46'] = "No (Fresh Onboarding)"
ws_maf['E46'] = "Immediate (November 2026)"

# Row 48 - 49: Bank Details (HDFC Current Account for Mellowprints)
ws_maf['B48'] = "MELLOWPRINTS"
ws_maf['E48'] = "HDFC Bank"
ws_maf['B49'] = "Current Account (CA)"
ws_maf['D49'] = "50200068453280"
ws_maf['F49'] = "HDFC0006215"

# Row 56 - 58: Signatory Footer
ws_maf['A56'] = "For MELLOWPRINTS (CLINAZA)"
ws_maf['B57'] = "PRATYUSH RAJ"
ws_maf['B58'] = "PROPRIETOR"


# ==========================================
# 2. SHEET: Final LIST & PEP
# ==========================================
ws_list = wb['Final LIST & PEP']

# Annexure 1 - Key Personnel
ws_list['C5'] = "PRATYUSH RAJ"
ws_list['D5'] = "PROPRIETOR / FOUNDER"
ws_list['E5'] = "No"
ws_list['F5'] = "No"
ws_list['G5'] = "NA"
ws_list['H5'] = "NA"

# Annexure 1 - PEP Declaration for Beneficial Owners
ws_list['C22'] = "PRATYUSH RAJ"
ws_list['D22'] = "PROPRIETOR / 100% BENEFICIAL OWNER"
ws_list['E22'] = "No"
ws_list['F22'] = "No"
ws_list['G22'] = "NA"
ws_list['H22'] = "NA"

ws_list.column_dimensions["C"].width = 22
ws_list.column_dimensions["D"].width = 28
ws_list["D5"].alignment = openpyxl.styles.Alignment(wrap_text=True, vertical="center")
ws_list["D22"].alignment = openpyxl.styles.Alignment(wrap_text=True, vertical="center")
ws_list["B28"] = "For MELLOWPRINTS (CLINAZA)"
ws_list["B30"] = "Authorised Signatory Name: PRATYUSH RAJ"
ws_list["B32"] = "Designation: PROPRIETOR"


# ==========================================
# 3. SHEET: Final BO
# ==========================================
ws_bo = wb['Final BO']

ws_bo['B4'] = "Name of the Merchant: MELLOWPRINTS / CLINAZA (Sole Proprietorship)"
ws_bo['B5'] = "CIN / Registration Number : UDYAM-BR-26-0005161 | GSTIN: 10DXRPR3052Q1ZV"

# Row 9: Natural Person 1 (100% BO)
ws_bo['C9'] = "PRATYUSH RAJ"
ws_bo['D9'] = "07/07/2000"
ws_bo['E9'] = "Indian - Pan Card"
ws_bo['F9'] = "DXRPR3052Q"
ws_bo['G9'] = "Aadhaar Card"
ws_bo['H9'] = "XXXX-XXXX-7898"
ws_bo['I9'] = "Sharma Sadan, Road No-1, Mahesh Nagar, S.K. Puri, Patna, Bihar, 800024"
ws_bo['J9'] = "100%"

ws_bo["B34"] = "For MELLOWPRINTS (CLINAZA)"
ws_bo["B37"] = "Authorised Signatory Name: PRATYUSH RAJ"
ws_bo["B38"] = "Designation: PROPRIETOR"


# ==========================================
# 4. SHEET: PEP Declaration_Megha 
# ==========================================
ws_pep = wb['PEP Declaration_Megha ']
ws_pep.sheet_state = "visible"

ws_pep['C5'] = "No"
ws_pep['D5'] = "No"
ws_pep['E5'] = "No"
ws_pep['F5'] = "NA"
ws_pep['G5'] = "NA"

ws_pep['C6'] = "No"
ws_pep['D6'] = "No"
ws_pep['E6'] = "No"
ws_pep['F6'] = "NA"
ws_pep['G6'] = "NA"

ws_pep['B11'] = "For MELLOWPRINTS (CLINAZA)"
ws_pep['B14'] = "Authorised Signatory Name: "
ws_pep['C14'] = "PRATYUSH RAJ"
ws_pep['B15'] = "Designation : "
ws_pep['C15'] = "PROPRIETOR"


# ==========================================
# 5. PRINT PAGE SETUP (A4 Portrait, 1 page wide/tall each)
# ==========================================
ws_maf.print_area = "A1:F58"
ws_maf.sheet_properties.pageSetUpPr.fitToPage = True
ws_maf.page_setup.fitToWidth = 1
ws_maf.page_setup.fitToHeight = 1
ws_maf.page_setup.orientation = ws_maf.ORIENTATION_PORTRAIT
ws_maf.page_setup.paperSize = ws_maf.PAPERSIZE_A4

ws_list.print_area = None
ws_list.sheet_properties.pageSetUpPr.fitToPage = True
ws_list.page_setup.fitToWidth = 1
ws_list.page_setup.fitToHeight = 1
ws_list.page_setup.orientation = ws_list.ORIENTATION_PORTRAIT
ws_list.page_setup.paperSize = ws_list.PAPERSIZE_A4

ws_bo.print_area = None
ws_bo.sheet_properties.pageSetUpPr.fitToPage = True
ws_bo.page_setup.fitToWidth = 1
ws_bo.page_setup.fitToHeight = 1
ws_bo.page_setup.orientation = ws_bo.ORIENTATION_PORTRAIT
ws_bo.page_setup.paperSize = ws_bo.PAPERSIZE_A4

ws_pep.print_area = None
ws_pep.sheet_properties.pageSetUpPr.fitToPage = True
ws_pep.page_setup.fitToWidth = 1
ws_pep.page_setup.fitToHeight = 1
ws_pep.page_setup.orientation = ws_pep.ORIENTATION_PORTRAIT
ws_pep.page_setup.paperSize = ws_pep.PAPERSIZE_A4


# Save updated workbook
wb.save(source_path)

# Also save copies to Desktop and public/docs for easy reference
desktop_copy = '/Users/pratyushraj/Desktop/Plural_MAF_Clinaza_Mellowprints.xlsx'
repo_copy = '/Users/pratyushraj/Desktop/dental-crm/public/docs/Plural_MAF_Clinaza_Mellowprints.xlsx'
wb.save(desktop_copy)
wb.save(repo_copy)

print("SUCCESS: Updated Plural MAF saved to:")
print("  1.", source_path)
print("  2.", desktop_copy)
print("  3.", repo_copy)

# Automated PDF Export
import subprocess
sheets_info = [
    ("Final MAF", "sheet_0_Final_MAF"),
    ("Final LIST & PEP", "sheet_1_Final_LIST_and_PEP"),
    ("Final BO", "sheet_2_Final_BO"),
    ("PEP Declaration_Megha ", "sheet_3_PEP_Declaration_Megha")
]
temp_export_dir = "/tmp/plural_maf_sheets_fixed"
os.makedirs(temp_export_dir, exist_ok=True)
pdf_parts = []

for sname, base in sheets_info:
    swb = openpyxl.load_workbook(desktop_copy)
    for name in swb.sheetnames:
        if name != sname:
            del swb[name]
        else:
            swb[name].sheet_state = "visible"
    s_xlsx = os.path.join(temp_export_dir, f"{base}.xlsx")
    swb.save(s_xlsx)
    subprocess.run([
        "/opt/homebrew/bin/soffice", "--headless", "--convert-to", "pdf",
        s_xlsx, "--outdir", temp_export_dir
    ], check=True)
    pdf_parts.append(os.path.join(temp_export_dir, f"{base}.pdf"))

final_pdf = "/Users/pratyushraj/Desktop/PineLabs_Plural_MAF_Complete_Ready_To_Print.pdf"
subprocess.run(["/opt/homebrew/bin/pdfunite"] + pdf_parts + [final_pdf], check=True)
print(f"SUCCESS: Generated 4-page print-ready PDF at: {final_pdf}")
