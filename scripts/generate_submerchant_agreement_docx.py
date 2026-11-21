import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT

doc = docx.Document()

# Set standard margins
for section in doc.sections:
    section.top_margin = Inches(0.8)
    section.bottom_margin = Inches(0.8)
    section.left_margin = Inches(0.8)
    section.right_margin = Inches(0.8)

# Header Title
p_title = doc.add_paragraph()
p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
run_top = p_title.add_run("CLINAZA HEALTHCARE TECHNOLOGIES\n")
run_top.font.name = "Arial"
run_top.font.size = Pt(11)
run_top.font.bold = True
run_top.font.color.rgb = RGBColor(8, 103, 232)

run_main = p_title.add_run("CLINIC MASTER SERVICES & SUB-MERCHANT ONBOARDING AGREEMENT\n")
run_main.font.name = "Arial"
run_main.font.size = Pt(16)
run_main.font.bold = True
run_main.font.color.rgb = RGBColor(11, 36, 80)

run_sub = p_title.add_run("Governing Point-of-Care Payment Aggregation, Patient EMI Facilitation & Practice SaaS Infrastructure")
run_sub.font.name = "Arial"
run_sub.font.size = Pt(9.5)
run_sub.font.italic = True
run_sub.font.color.rgb = RGBColor(100, 116, 139)

doc.add_paragraph()

# Preamble
p_preamble = doc.add_paragraph()
r = p_preamble.add_run("This Clinic Master Services & Sub-Merchant Onboarding Agreement (\"Agreement\") is entered into on this ______ day of ________________, 2026 (\"Effective Date\"), by and between:\n\n")
r.font.size = Pt(10)

r1 = p_preamble.add_run("1. MELLOWPRINTS, a sole proprietorship duly registered under the laws of India, holding GSTIN: 10DXRPR3052Q1ZV and Udyam Registration: UDYAM-BR-26-0005161, having its principal place of business at Sharma Sadan, Road No-1, Mahesh Nagar, S.K. Puri / P.O. Keshri Nagar, Patna, Bihar - 800024, operating under the proprietary commercial brand \"CLINAZA\" (hereinafter referred to as \"Clinaza\" or \"Merchant Aggregator\") of the FIRST PART; and\n\n")
r1.font.size = Pt(10)

r2 = p_preamble.add_run("2. __________________________________________________________________, a dental healthcare establishment / clinical entity, represented by its Chief Dental Surgeon / Authorized Signatory, Dr. _________________________________ (Reg. No: _________________), having its clinic address at _______________________________________________________________________________________________ (hereinafter referred to as the \"Sub-Merchant\" or \"Partner Clinic\") of the SECOND PART.\n")
r2.font.size = Pt(10)

def add_heading(text):
    h = doc.add_paragraph()
    r = h.add_run(text)
    r.font.name = "Arial"
    r.font.size = Pt(11.5)
    r.font.bold = True
    r.font.color.rgb = RGBColor(11, 36, 80)
    h.paragraph_format.space_before = Pt(8)
    h.paragraph_format.space_after = Pt(2)
    return h

def add_body(text):
    p = doc.add_paragraph()
    r = p.add_run(text)
    r.font.name = "Arial"
    r.font.size = Pt(9.5)
    p.paragraph_format.space_after = Pt(4)
    return p

add_heading("RECITALS:")
add_body("A. Clinaza owns and operates a proprietary healthcare fintech, point-of-care payment enablement, and practice management SaaS platform designed to empower dental clinics across India with automated patient financing, instant EMI links, digital invoicing, and reception payment infrastructure.")
add_body("B. Clinaza has entered into payment aggregation and processing arrangements with Reserve Bank of India (\"RBI\") authorized Payment Aggregators and Payment Gateways (including Pine Labs Private Limited / Plural by Pine Labs, hereinafter \"Payment Gateway / PA\") and regulated Lending Service Providers / Scheduled Banks / NBFCs to facilitate seamless electronic transactions, point-of-sale card processing, UPI collections, and patient EMI loan disbursements.")
add_body("C. The Partner Clinic desires to be onboarded under Clinaza's Master Merchant Account (\"Master MID\") as a verified Sub-Merchant on the Payment Aggregator network to enable Patients to pay for treatment charges via digital payment instruments, cardless EMIs, and NBFC healthcare credit, with direct settlement routed to the Partner Clinic's verified bank account.")

add_heading("1. APPOINTMENT & SUB-MERCHANT AUTHORIZATION")
add_body("1.1. The Partner Clinic hereby appoints Clinaza as its technology provider, digital payment facilitator, and Merchant Aggregator. The Partner Clinic expressly authorizes Clinaza to submit the Partner Clinic's KYC documentation to Pine Labs Plural and allied partner financial institutions for the creation and mapping of a dedicated Sub-Merchant Identifier (Sub-MID) under Clinaza's Master MID.")
add_body("1.2. The Partner Clinic authorizes Pine Labs Plural, as the authorized Payment Aggregator and Lending Gateway, to collect, process, hold in escrow/nodal accounts, and route patient treatment payments directly to the Partner Clinic's designated bank account as specified in Schedule B of this Agreement.")

add_heading("2. POINT-OF-CARE PAYMENT & EMI FACILITATION SERVICES")
add_body("2.1. Clinaza shall provide the Partner Clinic with access to the Clinaza Doctor Dashboard, digital payment link generator, dynamic on-screen reception QR checkout portal, and cardless healthcare EMI pre-qualification workflows.")
add_body("2.2. Clinaza acts strictly as a technology facilitator and Lending Service Provider (LSP) conduit under the RBI Digital Lending Guidelines. Clinaza does not disburse loans on its own balance sheet. All EMI loans, interest rates, Key Fact Statements (KFS), and approval decisions are granted solely by partner RBI-regulated Scheduled Commercial Banks and NBFCs.")

add_heading("3. SETTLEMENT MECHANISM & ESCROW ROUTING")
add_body("3.1. Payout Timeline: In accordance with RBI Payment Aggregator directives, all approved treatment collections and disbursed loan amounts shall be settled into the Partner Clinic's registered bank account on a standard T+1 / T+2 business day schedule (where T is the date of successful transaction confirmation).")
add_body("3.2. Deductions: The Payment Aggregator and Clinaza are authorized to automatically deduct the applicable Merchant Discount Rate (MDR) or platform processing charges as agreed under Schedule A prior to remitting net settlement proceeds to the Partner Clinic.")
add_body("3.3. Zero AMC Guarantee: Clinaza covenants that the Partner Clinic shall not be charged any hidden recurring monthly POS hardware rentals or Annual Maintenance Charges (AMC).")

add_heading("4. CLINIC OBLIGATIONS & REGULATORY COMPLIANCE")
add_body("4.1. The Partner Clinic warrants that its treating dental surgeons hold valid, active registrations with the Dental Council of India (DCI) or respective State Dental Council, and that the clinic complies with all applicable local Clinical Establishments Acts.")
add_body("4.2. Authentic Treatment Delivery: The Partner Clinic covenants that all transactions processed through Clinaza and Pine Labs Plural represent bona fide medical, dental, or surgical treatments rendered to genuine patients.")
add_body("4.3. No Duplicate Surcharges: The Partner Clinic agrees not to levy discriminatory surcharges or additional cash markups on patients who choose digital or EMI payment methods over cash.")

add_heading("5. DISPUTES, REFUNDS & CHARGEBACK INDEMNITY")
add_body("5.1. Clinical Discretion: Clinaza and Pine Labs Plural are technology and payment intermediaries and bear zero liability for clinical diagnosis, procedure efficacy, patient outcomes, or doctor-patient medical disputes.")
add_body("5.2. Chargeback Liability: In the event of an unauthorized transaction, fraudulent claim, or customer chargeback raised through card networks or partner banks due to clinic service failure, the Partner Clinic shall be solely responsible for providing treatment proof within two (2) working days. If unresolved, the disputed amount may be adjusted against future settlements.")

add_heading("6. DATA PROTECTION & DPDP ACT 2023 COMPLIANCE")
add_body("6.1. Both Parties agree to maintain strict confidentiality of patient personal and medical information in accordance with the Digital Personal Data Protection Act, 2023 (DPDP Act) and Information Technology Act, 2000. Payment data (card numbers, CVV) shall never be stored on clinic premises or uncertified servers, adhering strictly to RBI Tokenization and PCI-DSS standards.")

add_heading("7. TERM, TERMINATION & JURISDICTION")
add_body("7.1. This Agreement shall remain valid for a period of one (1) year from the Effective Date and shall automatically renew for successive one-year terms unless terminated by either Party with thirty (30) days prior written notice.")
add_body("7.2. Governing Law & Jurisdiction: This Agreement shall be governed by the laws of India. Any dispute arising out of or in connection with this Agreement shall be subject to the exclusive jurisdiction of the competent courts at Patna, Bihar, India.")

# Schedule A
add_heading("SCHEDULE A: COMMERCIAL TERMS & SETTLEMENT SCHEDULE")
table_a = doc.add_table(rows=1, cols=3)
table_a.alignment = WD_TABLE_ALIGNMENT.CENTER
hdr_cells = table_a.rows[0].cells
hdr_cells[0].text = "Component"
hdr_cells[1].text = "Rate / Terms"
hdr_cells[2].text = "Billing / Settlement Mode"

items_a = [
    ("Digital Desk Activation & Setup", "₹999 (One-time, inclusive of taxes)", "Paid during initial clinic enrollment"),
    ("Annual Maintenance Charges (AMC)", "₹0 (Zero AMC for lifetime)", "No recurring rental or platform fees"),
    ("Patient Financing Platform MDR", "3.00% MDR on loan amount", "Deducted at source on T+1 settlement"),
    ("Patient Monthly Interest Rate", "1.00% – 1.50% / month (Reducing)", "Dynamic based on patient CIBIL & income profile"),
    ("Model 1: Patient-Borne Mode (Standard EMI)", "Patient pays the lender's applicable monthly rate", "Clinic receives invoice less 3% MDR on T+1"),
    ("Model 2: Clinic-Subvented Promotional Mode", "Clinic may fund a lender-approved promotional subvention", "Clinic receives invoice less approved subvention and 3% MDR on T+1"),
    ("UPI Collections (Dynamic QR / Link)", "0.00% Clinic Deduction (Patient Convenience Fee Mode)", "T+1 Settlement; absorbs gateway MDR"),
    ("Debit / Credit Cards (Non-EMI)", "1.35% (Debit) / 2.35% (Credit)", "Deducted at source on T+1 settlement"),
    ("Settlement Payout Cycle", "Guaranteed T+1 Business Days", "Direct Nodal Bank NEFT/RTGS to Clinic")
]
for item, rate, mode in items_a:
    row_cells = table_a.add_row().cells
    row_cells[0].text = item
    row_cells[1].text = rate
    row_cells[2].text = mode

# Schedule B
add_heading("SCHEDULE B: SUB-MERCHANT KYC & SETTLEMENT BANK MANDATE")
table_b = doc.add_table(rows=0, cols=2)
table_b.alignment = WD_TABLE_ALIGNMENT.CENTER
items_b = [
    ("Legal Clinic Entity Name:", "____________________________________________________________"),
    ("Chief Practitioner / Signatory:", "____________________________________________________________"),
    ("Clinic Registered Address:", "____________________________________________________________"),
    ("Contact Phone / Email:", "____________________________________________________________"),
    ("Designated Settlement Bank:", "____________________________________________________________"),
    ("Bank Account Number:", "____________________________________________________________"),
    ("IFSC Code & Branch:", "____________________________________________________________"),
    ("Sub-Merchant MID Mapping:", "To be mapped under Clinaza Authorized Gateway (Pine Labs Plural) Master MID")
]
for label, val in items_b:
    row_cells = table_b.add_row().cells
    row_cells[0].text = label
    row_cells[1].text = val

add_heading("SIGNATURES & EXECUTION")
table_sig = doc.add_table(rows=1, cols=2)
table_sig.alignment = WD_TABLE_ALIGNMENT.CENTER
s_cells = table_sig.rows[0].cells
s_cells[0].text = "For and on behalf of:\nMELLOWPRINTS (CLINAZA)\n\n\n\n________________________________________\nAuthorized Signatory / Proprietor\nName: Pratyush Raj\nDate: ____________________\nPlace: Patna, Bihar"
s_cells[1].text = "For and on behalf of:\nPARTNER CLINIC (SUB-MERCHANT)\n\n\n\n________________________________________\nAuthorized Signatory / Dental Practitioner\nName: ______________________________\nDate: ____________________\nPlace: ____________________"

doc.save("public/docs/Clinaza_Clinic_Sub_Merchant_Master_Services_Agreement.docx")
print("Successfully generated Word agreement docx!")
