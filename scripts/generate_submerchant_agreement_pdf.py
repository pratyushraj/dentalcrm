import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether, PageBreak
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

def build_pdf(filename, is_sample=False, clinic_info=None):
    pdf_path = os.path.join(os.getcwd(), filename)
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=A4,
        leftMargin=40,
        rightMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()
    
    # Custom Palette
    primary_color = colors.HexColor("#0867E8")
    dark_navy = colors.HexColor("#0B2450")
    text_dark = colors.HexColor("#1E293B")
    border_color = colors.HexColor("#CBD5E1")
    accent_bg = colors.HexColor("#F8FAFC")
    emerald = colors.HexColor("#059669")

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=dark_navy,
        alignment=1, # Center
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=primary_color,
        alignment=1,
        spaceAfter=15
    )

    h1_style = ParagraphStyle(
        'Heading1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=15,
        textColor=dark_navy,
        spaceBefore=10,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=text_dark,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'BulletText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=text_dark,
        leftIndent=15,
        spaceAfter=3
    )

    note_style = ParagraphStyle(
        'NoteText',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#64748B"),
        spaceAfter=4
    )

    story = []

    # Header Badge
    sample_badge = " [SAMPLE EXECUTED PILOT COPY]" if is_sample else ""
    story.append(Paragraph(f"CLINAZA HEALTHCARE TECHNOLOGIES{sample_badge}", subtitle_style))
    story.append(Paragraph("CLINIC MASTER SERVICES &amp; SUB-MERCHANT ONBOARDING AGREEMENT", title_style))
    story.append(Paragraph("Governing Point-of-Care Payment Aggregation, Patient EMI Facilitation &amp; Practice Technology Infrastructure", ParagraphStyle('SubSub', parent=styles['Normal'], fontSize=8.5, textColor=colors.HexColor("#64748B"), alignment=1)))
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=1.5, color=primary_color, spaceAfter=12))

    # Preamble / Parties
    if is_sample:
        eff_date = "1st November 2026"
    elif clinic_info:
        eff_date = datetime.now().strftime("%d %B %Y")
    else:
        eff_date = "______ day of ________________, 2026"

    story.append(Paragraph(f"This Clinic Master Services &amp; Sub-Merchant Onboarding Agreement (the <b>\"Agreement\"</b>) is entered into on this <b>{eff_date}</b> (the <b>\"Effective Date\"</b>), by and between:", body_style))
    
    party1_text = (
        "<b>1. MELLOWPRINTS</b>, a sole proprietorship duly registered under the laws of India, holding GSTIN: <b>10DXRPR3052Q1ZV</b> and "
        "Udyam Registration: <b>UDYAM-BR-26-0005161</b>, having its principal place of business at Sharma Sadan, Road No-1, Mahesh Nagar, "
        "S.K. Puri / P.O. Keshri Nagar, Patna, Bihar - 800024, operating under the proprietary commercial brand <b>\"CLINAZA\"</b> "
        "(hereinafter referred to as <b>\"Clinaza\"</b> or <b>\"Merchant Aggregator\"</b>, which expression shall include its successors and permitted assigns) of the <b>FIRST PART</b>; and"
    )
    story.append(Paragraph(party1_text, body_style))

    if is_sample:
        party2_text = (
            "<b>2. DR. RAJ MULTI-SPECIALITY DENTAL CLINIC &amp; IMPLANT CENTRE</b>, a registered healthcare clinical establishment, "
            "represented by its Proprietor / Chief Dental Surgeon, <b>Dr. Alok Raj (BDS, MDS - Oral Implantology, DCI Reg. No: 14892-A)</b>, "
            "having its clinical premises at Boring Road Crossing, Anandpuri, Patna, Bihar - 800001 (hereinafter referred to as the "
            "<b>\"Sub-Merchant\"</b> or <b>\"Partner Clinic\"</b>, which expression shall include its legal representatives, successors and permitted assigns) of the <b>SECOND PART</b>."
        )
    elif clinic_info:
        party2_text = (
            f"<b>2. {clinic_info['clinic_name'].upper()}</b>, a registered healthcare clinical establishment, "
            f"represented by its Proprietor / Dental Surgeon, <b>{clinic_info['doctor_name']}</b>, "
            f"having its clinical premises at {clinic_info['address']} (hereinafter referred to as the "
            f"<b>\"Sub-Merchant\"</b> or <b>\"Partner Clinic\"</b>, which expression shall include its legal representatives, successors and permitted assigns) of the <b>SECOND PART</b>."
        )
    else:
        party2_text = (
            "<b>2. __________________________________________________________________</b>, a dental clinic / healthcare entity, "
            "represented by its Authorised Signatory / Registered Dental Practitioner, <b>Dr. _________________________________ (Reg. No: _________________)</b>, "
            "having its clinic address at _______________________________________________________________________________________________ "
            "(hereinafter referred to as the <b>\"Sub-Merchant\"</b> or <b>\"Partner Clinic\"</b>) of the <b>SECOND PART</b>."
        )
    story.append(Paragraph(party2_text, body_style))
    story.append(Spacer(1, 6))

    # Recitals
    story.append(Paragraph("<b>RECITALS:</b>", h1_style))
    story.append(Paragraph("<b>WHEREAS:</b>", body_style))
    story.append(Paragraph("A. Clinaza owns and operates a proprietary healthcare fintech, point-of-care payment enablement, and practice management SaaS platform (the <b>\"Platform\"</b>) designed to empower dental clinics across India with automated patient financing, instant EMI links, digital invoicing, and reception payment infrastructure.", bullet_style))
    story.append(Paragraph("B. Clinaza has entered into payment aggregation and processing arrangements with Reserve Bank of India (<b>\"RBI\"</b>) authorized Payment Aggregators and Payment Gateways (including <b>Pine Labs Private Limited / Plural by Pine Labs</b>, hereinafter <b>\"Payment Gateway / PA\"</b>) and regulated Lending Service Providers / Scheduled Banks / NBFCs to facilitate seamless electronic transactions, point-of-sale card processing, UPI collections, and patient EMI loan disbursements.", bullet_style))
    story.append(Paragraph("C. The Partner Clinic is an active healthcare establishment providing dental, orthodontic, implant, and allied clinical services to patients (<b>\"Patients\"</b>).", bullet_style))
    story.append(Paragraph("D. The Partner Clinic desires to be onboarded under Clinaza's Master Merchant Account (<b>\"Master MID\"</b>) as a verified <b>Sub-Merchant</b> on the Payment Aggregator network to enable Patients to pay for treatment charges via digital payment instruments, cardless EMIs, and NBFC healthcare credit, with direct settlement routed to the Partner Clinic's verified bank account.", bullet_style))
    story.append(Spacer(1, 6))

    story.append(Paragraph("<b>NOW, THEREFORE, IT IS MUTUALLY AGREED BY AND BETWEEN THE PARTIES AS FOLLOWS:</b>", body_style))

    # Clause 1
    story.append(Paragraph("1. APPOINTMENT &amp; SUB-MERCHANT AUTHORIZATION", h1_style))
    story.append(Paragraph("1.1. The Partner Clinic hereby appoints Clinaza as its technology provider, digital payment facilitator, and Merchant Aggregator. The Partner Clinic expressly authorizes Clinaza to submit the Partner Clinic's KYC documentation to Pine Labs Plural and allied partner financial institutions for the creation and mapping of a dedicated <b>Sub-Merchant Identifier (Sub-MID)</b> under Clinaza's Master MID.", body_style))
    story.append(Paragraph("1.2. The Partner Clinic authorizes Pine Labs Plural, as the authorized Payment Aggregator and Lending Gateway, to collect, process, hold in escrow/nodal accounts, and route patient treatment payments directly to the Partner Clinic's designated bank account as specified in <b>Schedule B</b> of this Agreement.", body_style))

    # Clause 2
    story.append(Paragraph("2. POINT-OF-CARE PAYMENT &amp; EMI FACILITATION SERVICES", h1_style))
    story.append(Paragraph("2.1. Clinaza shall provide the Partner Clinic with access to the Clinaza Doctor Dashboard, digital payment link generator, dynamic on-screen reception QR checkout portal, and paperless healthcare EMI pre-qualification workflows.", body_style))
    story.append(Paragraph("2.2. Clinaza acts strictly as a technology facilitator and Lending Service Provider (LSP) conduit under the RBI Digital Lending Guidelines. Clinaza does not disburse loans on its own balance sheet. All EMI loans, interest rates, Key Fact Statements (KFS), and approval decisions are granted solely by partner RBI-regulated Scheduled Commercial Banks and NBFCs.", body_style))
    story.append(Paragraph("2.3. <b>Patient Financing Rate &amp; Terms:</b> Monthly interest rates for patient healthcare financing typically range between <b>1.0% to 1.5% per month</b> (reducing balance), determined dynamically by partner banks and NBFCs based on the individual patient's credit bureau score (CIBIL), repayment history, and verified monthly income.", body_style))
    story.append(Paragraph("2.4. <b>Healthcare Financing Commercial Models:</b> Transactions processed through patient financing are subject to a standard <b>3.00% Merchant Discount Rate (MDR)</b>, and can be structured under either of the following two operational modes:<br/>"
                           "&bull; <b>Model 1 (Patient-Borne Interest Mode):</b> The patient pays the applicable monthly interest (1.0% - 1.5%/mo) directly as part of their EMI installment schedule. The Partner Clinic receives 100% of the treatment invoice value (less standard 3.00% MDR) directly into its current account on a guaranteed T+1 settlement schedule with zero interest cost to the clinic.<br/>"
                           "&bull; <b>Model 2 (Clinic-Subvented Promotional Mode):</b> The Partner Clinic may elect to fund a lender-approved promotional subvention, subject to the applicable scheme terms. Net treatment proceeds (invoice minus any approved subvention and 3.00% MDR) are settled directly into the clinic's current account on a T+1 schedule.", body_style))

    # Clause 3
    story.append(Paragraph("3. SETTLEMENT MECHANISM &amp; ESCROW ROUTING", h1_style))
    story.append(Paragraph("3.1. <b>Payout Timeline:</b> In accordance with RBI Payment Aggregator directives, all approved treatment collections and disbursed loan amounts shall be settled into the Partner Clinic's registered bank account on a standard <b>T+1 / T+2 business day schedule</b> (where T is the date of successful transaction confirmation).", body_style))
    story.append(Paragraph("3.2. <b>Deductions:</b> The Payment Aggregator and Clinaza are authorized to automatically deduct the applicable Merchant Discount Rate (MDR) or platform processing charges as agreed under <b>Schedule A</b> prior to remitting net settlement proceeds to the Partner Clinic.", body_style))
    story.append(Paragraph("3.3. <b>Zero AMC Guarantee:</b> Clinaza covenants that the Partner Clinic shall not be charged any hidden recurring monthly POS hardware rentals or Annual Maintenance Charges (AMC).", body_style))

    # Clause 4
    story.append(Paragraph("4. CLINIC OBLIGATIONS &amp; REGULATORY COMPLIANCE", h1_style))
    story.append(Paragraph("4.1. The Partner Clinic warrants that its treating dental surgeons hold valid, active registrations with the Dental Council of India (DCI) or respective State Dental Council, and that the clinic complies with all applicable local Clinical Establishments Acts.", body_style))
    story.append(Paragraph("4.2. <b>Authentic Treatment Delivery:</b> The Partner Clinic covenants that all transactions processed through Clinaza and Pine Labs Plural represent bona fide medical, dental, or surgical treatments rendered to genuine patients.", body_style))
    story.append(Paragraph("4.3. <b>No Duplicate Surcharges:</b> The Partner Clinic agrees not to levy discriminatory surcharges or additional cash markups on patients who choose digital or EMI payment methods over cash.", body_style))

    # Clause 5
    story.append(Paragraph("5. DISPUTES, REFUNDS &amp; CHARGEBACK INDEMNITY", h1_style))
    story.append(Paragraph("5.1. <b>Clinical Discretion:</b> Clinaza and Pine Labs Plural are technology and payment intermediaries and bear zero liability for clinical diagnosis, procedure efficacy, patient outcomes, or doctor-patient medical disputes.", body_style))
    story.append(Paragraph("5.2. <b>Chargeback Liability:</b> In the event of an unauthorized transaction, fraudulent claim, or customer chargeback raised through card networks or partner banks due to clinic service failure, the Partner Clinic shall be solely responsible for providing treatment proof within two (2) working days. If unresolved, the disputed amount may be adjusted against future settlements.", body_style))

    # Clause 6
    story.append(Paragraph("6. DATA PROTECTION &amp; DPDP ACT 2023 COMPLIANCE", h1_style))
    story.append(Paragraph("6.1. Both Parties agree to maintain strict confidentiality of patient personal and medical information in accordance with the Digital Personal Data Protection Act, 2023 (DPDP Act) and Information Technology Act, 2000. Payment data (card numbers, CVV) shall never be stored on clinic premises or uncertified servers, adhering strictly to RBI Tokenization and PCI-DSS standards.", body_style))

    # Clause 7
    story.append(Paragraph("7. TERM, TERMINATION &amp; JURISDICTION", h1_style))
    story.append(Paragraph("7.1. This Agreement shall remain valid for a period of one (1) year from the Effective Date and shall automatically renew for successive one-year terms unless terminated by either Party with thirty (30) days prior written notice.", body_style))
    story.append(Paragraph("7.2. <b>Governing Law &amp; Jurisdiction:</b> This Agreement shall be governed by the laws of India. Any dispute arising out of or in connection with this Agreement shall be subject to the exclusive jurisdiction of the competent courts at <b>Patna, Bihar, India</b>.", body_style))

    story.append(Spacer(1, 10))

    # Schedule A: Commercial Terms Table
    story.append(Paragraph("<b>SCHEDULE A: COMMERCIAL TERMS &amp; SETTLEMENT SCHEDULE</b>", h1_style))
    comm_data = [
        [Paragraph("<b>Component</b>", body_style), Paragraph("<b>Rate / Terms</b>", body_style), Paragraph("<b>Billing / Settlement Mode</b>", body_style)],
        [Paragraph("Digital Desk Activation &amp; Setup", body_style), Paragraph("Rs. 999 (One-time, inclusive of taxes)", body_style), Paragraph("Paid during initial clinic enrollment", body_style)],
        [Paragraph("Annual Maintenance Charges (AMC)", body_style), Paragraph("Rs. 0 (Zero AMC for lifetime)", body_style), Paragraph("No recurring rental or platform fees", body_style)],
        [Paragraph("Patient Financing Platform MDR", body_style), Paragraph("<b>3.00% MDR</b> on loan amount", body_style), Paragraph("Deducted at source on T+1 settlement", body_style)],
        [Paragraph("Patient Monthly Interest Rate", body_style), Paragraph("<b>1.00% - 1.50% / month</b> (Reducing)", body_style), Paragraph("Dynamic based on patient CIBIL &amp; income profile", body_style)],
        [Paragraph("<b>Model 1: Patient-Borne Mode (Standard EMI)</b>", body_style), Paragraph("Patient pays the lender's applicable monthly rate; clinic has no patient-interest liability", body_style), Paragraph("Clinic receives treatment invoice less 3% MDR on T+1", body_style)],
        [Paragraph("<b>Model 2: Clinic-Subvented Promotional Mode</b>", body_style), Paragraph("Clinic may fund a lender-approved promotional subvention", body_style), Paragraph("Clinic receives invoice less approved subvention and 3% MDR on T+1", body_style)],
        [Paragraph("Counter UPI Collections (Dynamic QR / Link)", body_style), Paragraph("0.00% Clinic Deduction (Patient Convenience Fee Mode)", body_style), Paragraph("T+1 Settlement; Rs. 19 - Rs. 49 patient fee absorbs 0.40% gateway MDR", body_style)],
        [Paragraph("Debit / Credit Cards (Non-EMI)", body_style), Paragraph("1.35% (Debit) / 2.35% (Credit)", body_style), Paragraph("Deducted at source on T+1 settlement", body_style)],
        [Paragraph("Settlement Payout Cycle", body_style), Paragraph("Guaranteed T+1 Business Days", body_style), Paragraph("Direct Nodal Bank NEFT/RTGS to Clinic Current Account", body_style)]
    ]
    t_comm = Table(comm_data, colWidths=[150, 195, 170])
    t_comm.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), accent_bg),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('TOPPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_comm)
    story.append(Spacer(1, 10))

    # Schedule B: Bank Details
    story.append(Paragraph("<b>SCHEDULE B: SUB-MERCHANT KYC &amp; SETTLEMENT BANK MANDATE</b>", h1_style))
    if is_sample:
        bank_data = [
            [Paragraph("<b>Legal Clinic Entity Name:</b>", body_style), Paragraph("Dr. Raj Multi-Speciality Dental Clinic &amp; Implant Centre", body_style)],
            [Paragraph("<b>Chief Practitioner / Signatory:</b>", body_style), Paragraph("Dr. Alok Raj (BDS, MDS - Reg: 14892-A)", body_style)],
            [Paragraph("<b>Clinic Registered Address:</b>", body_style), Paragraph("Boring Road Crossing, Anandpuri, Patna, Bihar - 800001", body_style)],
            [Paragraph("<b>Contact Phone / Email:</b>", body_style), Paragraph("+91 94310 28912 | alok.raj.dental@gmail.com", body_style)],
            [Paragraph("<b>Designated Settlement Bank:</b>", body_style), Paragraph("State Bank of India (SBI)", body_style)],
            [Paragraph("<b>Bank Account Number:</b>", body_style), Paragraph("38920198421 (Current Account)", body_style)],
            [Paragraph("<b>IFSC Code:</b>", body_style), Paragraph("SBIN0001235 (Boring Road Branch, Patna)", body_style)],
            [Paragraph("<b>Sub-Merchant MID Mapping:</b>", body_style), Paragraph("Mapped under Clinaza Authorized Payment Gateway (Plural by Pine Labs) Master MID", body_style)]
        ]
    elif clinic_info:
        bank_data = [
            [Paragraph("<b>Legal Clinic Entity Name:</b>", body_style), Paragraph(clinic_info['clinic_name'], body_style)],
            [Paragraph("<b>Chief Practitioner / Signatory:</b>", body_style), Paragraph(clinic_info['doctor_name'], body_style)],
            [Paragraph("<b>Clinic Registered Address:</b>", body_style), Paragraph(clinic_info['address'], body_style)],
            [Paragraph("<b>Contact Phone / Email:</b>", body_style), Paragraph(f"{clinic_info['phone']} | {clinic_info['email']}", body_style)],
            [Paragraph("<b>Designated Settlement Bank:</b>", body_style), Paragraph(clinic_info.get('bank_name', "Verified Clinic Current Account (SBI / HDFC / PNB)"), body_style)],
            [Paragraph("<b>Bank Account Number:</b>", body_style), Paragraph(clinic_info.get('account_no', "To be linked via Cancelled Cheque upload"), body_style)],
            [Paragraph("<b>IFSC Code &amp; Branch:</b>", body_style), Paragraph(clinic_info.get('ifsc', "Chilakaluripet / Haridwar Main Branch"), body_style)],
            [Paragraph("<b>Sub-Merchant MID Mapping:</b>", body_style), Paragraph("To be mapped under Clinaza Authorized Gateway (Pine Labs Plural) Master MID", body_style)]
        ]
    else:
        bank_data = [
            [Paragraph("<b>Legal Clinic Entity Name:</b>", body_style), Paragraph("____________________________________________________________", body_style)],
            [Paragraph("<b>Chief Practitioner / Signatory:</b>", body_style), Paragraph("____________________________________________________________", body_style)],
            [Paragraph("<b>Clinic Registered Address:</b>", body_style), Paragraph("____________________________________________________________", body_style)],
            [Paragraph("<b>Contact Phone / Email:</b>", body_style), Paragraph("____________________________________________________________", body_style)],
            [Paragraph("<b>Designated Settlement Bank:</b>", body_style), Paragraph("____________________________________________________________", body_style)],
            [Paragraph("<b>Bank Account Number:</b>", body_style), Paragraph("____________________________________________________________", body_style)],
            [Paragraph("<b>IFSC Code &amp; Branch:</b>", body_style), Paragraph("____________________________________________________________", body_style)],
            [Paragraph("<b>Sub-Merchant MID Mapping:</b>", body_style), Paragraph("To be mapped under Clinaza Authorized Gateway (Pine Labs Plural) Master MID", body_style)]
        ]
    t_bank = Table(bank_data, colWidths=[180, 335])
    t_bank.setStyle(TableStyle([
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BACKGROUND', (0,0), (0,-1), accent_bg),
    ]))
    story.append(t_bank)
    story.append(Spacer(1, 14))

    # Execution Blocks
    story.append(Paragraph("<b>IN WITNESS WHEREOF, the Parties hereto have executed this Agreement by their duly authorized representatives:</b>", body_style))
    story.append(Spacer(1, 8))

    if is_sample:
        sig_data = [
            [
                Paragraph("<b>For and on behalf of:</b><br/><b>MELLOWPRINTS (CLINAZA)</b><br/><br/><i>[Digitally Signed / Stamped]</i><br/><br/><b>Name:</b> Pratyush Raj<br/><b>Title:</b> Founder &amp; Proprietor<br/><b>Date:</b> 01/11/2026<br/><b>Place:</b> Patna, Bihar", body_style),
                Paragraph("<b>For and on behalf of:</b><br/><b>PARTNER CLINIC (SUB-MERCHANT)</b><br/><br/><i>[Signed &amp; Clinical Seal Affixed]</i><br/><br/><b>Name:</b> Dr. Alok Raj<br/><b>Title:</b> Chief Dental Surgeon &amp; Director<br/><b>Date:</b> 01/11/2026<br/><b>Place:</b> Patna, Bihar", body_style)
            ]
        ]
    elif clinic_info:
        sig_data = [
            [
                Paragraph("<b>For and on behalf of:</b><br/><b>MELLOWPRINTS (CLINAZA)</b><br/><br/><br/>________________________________________<br/><b>Authorized Signatory / Proprietor</b><br/><b>Name:</b> Pratyush Raj<br/><b>Date:</b> 21/11/2026<br/><b>Place:</b> Patna, Bihar", body_style),
                Paragraph(f"<b>For and on behalf of:</b><br/><b>{clinic_info['clinic_name'].upper()}</b><br/><br/><br/>________________________________________<br/><b>Authorized Signatory / Dental Surgeon</b><br/><b>Name:</b> {clinic_info['doctor_name']}<br/><b>Date:</b> ____________________<br/><b>Place:</b> {clinic_info.get('city', 'Haridwar')}", body_style)
            ]
        ]
    else:
        sig_data = [
            [
                Paragraph("<b>For and on behalf of:</b><br/><b>MELLOWPRINTS (CLINAZA)</b><br/><br/><br/>________________________________________<br/><b>Authorized Signatory / Proprietor</b><br/><b>Name:</b> Pratyush Raj<br/><b>Date:</b> ____________________<br/><b>Place:</b> Patna, Bihar", body_style),
                Paragraph("<b>For and on behalf of:</b><br/><b>PARTNER CLINIC (SUB-MERCHANT)</b><br/><br/><br/>________________________________________<br/><b>Authorized Signatory / Dental Practitioner</b><br/><b>Name:</b> ______________________________<br/><b>Date:</b> ____________________<br/><b>Place:</b> ____________________", body_style)
            ]
        ]
    t_sig = Table(sig_data, colWidths=[255, 260])
    t_sig.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 1, primary_color),
        ('BACKGROUND', (0,0), (-1,-1), accent_bg),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
    ]))
    story.append(t_sig)

    doc.build(story)
    print(f"Successfully generated {filename}")

def build_terms_and_recitals_pdf(filename, clinic_info=None):
    pdf_path = os.path.join(os.getcwd(), filename)
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=A4,
        leftMargin=38,
        rightMargin=38,
        topMargin=34,
        bottomMargin=34
    )

    styles = getSampleStyleSheet()
    
    # Custom Palette
    primary_color = colors.HexColor("#0867E8")
    dark_navy = colors.HexColor("#0B2450")
    text_dark = colors.HexColor("#1E293B")
    border_color = colors.HexColor("#CBD5E1")
    accent_bg = colors.HexColor("#F8FAFC")
    emerald = colors.HexColor("#059669")

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=19,
        textColor=dark_navy,
        alignment=1,
        spaceAfter=3
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13,
        textColor=primary_color,
        alignment=1,
        spaceAfter=4
    )

    h1_style = ParagraphStyle(
        'Heading1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=13.5,
        textColor=dark_navy,
        spaceBefore=7,
        spaceAfter=3
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=text_dark,
        spaceAfter=4
    )

    bullet_style = ParagraphStyle(
        'BulletText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=text_dark,
        leftIndent=12,
        spaceAfter=3
    )

    highlight_style = ParagraphStyle(
        'HighlightText',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11.5,
        textColor=dark_navy,
        spaceAfter=3
    )

    story = []

    # Header
    story.append(Paragraph("CLINAZA HEALTHCARE TECHNOLOGIES", subtitle_style))
    story.append(Paragraph("TERMS &amp; CONDITIONS | OPERATIONAL RECITALS &amp; COMMERCIAL TERMS", title_style))
    story.append(Paragraph("Healthcare Point-of-Care Patient Financing, Pine Labs Plural Gateway &amp; Front-Desk Infrastructure", ParagraphStyle('SubSub', parent=styles['Normal'], fontSize=8, textColor=colors.HexColor("#64748B"), alignment=1)))
    story.append(Spacer(1, 4))
    story.append(HRFlowable(width="100%", thickness=1.5, color=primary_color, spaceAfter=6))

    # Prepared For Banner
    if clinic_info:
        clinic_name = clinic_info.get('clinic_name', 'Partner Dental Clinic')
        doc_name = clinic_info.get('doctor_name', 'Dental Surgeon')
        addr = clinic_info.get('address', 'Clinical Premises')
        phone = clinic_info.get('phone', '')
        email = clinic_info.get('email', '')
        meta_text = (
            f"<b>PREPARED EXCLUSIVELY FOR:</b> <b>{clinic_name.upper()}</b> &nbsp;|&nbsp; <b>{doc_name}</b><br/>"
            f"<b>Clinic Address:</b> {addr} &nbsp;|&nbsp; <b>Desk Contact:</b> {phone} &bull; {email}"
        )
    else:
        meta_text = (
            "<b>PREPARED FOR:</b> <b>PARTNER DENTAL CLINIC</b><br/>"
            "<b>Document Classification:</b> Healthcare Patient Financing Operational Recitals &amp; Commercial Terms"
        )
    
    t_meta = Table([[Paragraph(meta_text, body_style)]], colWidths=[519])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#EFF6FF")),
        ('BOX', (0,0), (-1,-1), 1, primary_color),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 5))

    # Section 1: RECITALS
    story.append(Paragraph("1. OPERATIONAL RECITALS (PLATFORM SCOPE &amp; LENDING ARCHITECTURE)", h1_style))
    story.append(Paragraph(
        "<b>A. Platform Scope &amp; Purpose:</b> Clinaza owns and operates a specialized healthcare fintech, point-of-care payment enablement, and practice management SaaS platform designed to empower dental clinics across India with automated patient financing, instant EMI links, digital invoicing, and reception payment infrastructure without requiring costly hardware rentals.",
        bullet_style
    ))
    story.append(Paragraph(
        "<b>B. Regulated Lending &amp; Gateway Infrastructure:</b> Clinaza has entered into payment aggregation and processing arrangements with Reserve Bank of India (<b>\"RBI\"</b>) authorized Payment Aggregators and Payment Gateways (including <b>Pine Labs Private Limited / Plural by Pine Labs</b>) and regulated Lending Service Providers, Scheduled Commercial Banks, and NBFCs (including ICICI Bank, HDFC Bank, Axis Bank, Kotak Mahindra Bank, IDFC FIRST Bank, Bajaj Finance, Tata Capital, and Piramal Finance) to facilitate seamless electronic transactions, point-of-sale card processing, UPI collections, and patient EMI loan disbursements directly at the clinic desk.",
        bullet_style
    ))
    story.append(Paragraph(
        "<b>C. Point-of-Care Patient Treatment Financing:</b> The Partner Clinic is an active healthcare clinical establishment providing dental, orthodontic, implant, and allied clinical services to patients. By integrating with Clinaza, patients can split high-ticket dental procedures (dental implants, full-mouth restorations, aligners, cosmetic smile design) into flexible monthly EMIs with instant OTP pre-qualification and approval right at the clinic reception desk.",
        bullet_style
    ))
    story.append(Paragraph(
        "<b>D. Direct Bank Settlement &amp; Zero Recourse:</b> All approved patient collections and loan disbursements are settled directly into the Partner Clinic's verified bank current account on a guaranteed <b>T+1 business day schedule</b>. Regulated banking partners absorb all patient default, repayment, and credit collection risks; the Partner Clinic bears <b>0% collection liability, risk, or recourse</b> on any patient financing.",
        bullet_style
    ))
    story.append(Spacer(1, 4))

    # Section 2: COMMERCIAL FINANCING STRUCTURE & MODELS
    story.append(Paragraph("2. COMMERCIAL FINANCING STRUCTURE &amp; OPERATING MODELS", h1_style))
    story.append(Paragraph(
        "Clinaza patient healthcare financing offers complete transparency and flexibility, structured under the following parameters:",
        body_style
    ))
    story.append(Paragraph(
        "&bull; <b>Patient Monthly Interest Rate (1.0% to 1.5% / month):</b> Monthly interest rates for patient financing typically range between <b>1.0% to 1.5% per month</b> (reducing balance). The exact interest rate is determined dynamically by partner banks and NBFCs based on the individual patient's credit bureau score (CIBIL), repayment history, and verified monthly income.",
        bullet_style
    ))
    story.append(Paragraph(
        "&bull; <b>Platform Financing MDR (3.00%):</b> All transactions processed through patient healthcare financing are subject to a standard <b>3.00% Merchant Discount Rate (MDR)</b> on the loan amount, deducted at source on settlement.",
        bullet_style
    ))
    story.append(Spacer(1, 3))
    story.append(Paragraph("<b>The Two Operational Financing Models:</b>", highlight_style))

    # Two models detailed cards / table
    model1_text = (
        "<b>MODEL 1: PATIENT-BORNE INTEREST MODE (Standard Patient EMI)</b><br/>"
        "&bull; <b>How It Works:</b> The patient pays the applicable monthly interest (1.0% - 1.5%/month) directly as part of their EMI installment schedule.<br/>"
        "&bull; <b>Clinic Cost:</b> <b>0% Interest Liability</b> for the clinic.<br/>"
        "&bull; <b>Clinic Settlement:</b> The clinic receives <b>100% of the treatment invoice value (less standard 3.00% MDR)</b> directly into its bank current account on a guaranteed T+1 schedule.<br/>"
        "&bull; <i>Illustrative Example:</i> On a Rs. 60,000 dental implant procedure, the clinic receives Rs. 58,200 upfront on T+1. The patient repays Rs. 60,000 + monthly interest over their chosen tenure (e.g. 6, 12, or 24 months)."
    )
    model2_text = (
        "<b>MODEL 2: CLINIC-ABSORBED INTEREST MODE (Promotional Subvention)</b><br/>"
        "&bull; <b>How It Works:</b> For premium procedures or special promotional campaigns, the clinic may elect to absorb/subvent the patient's interest cost.<br/>"
        "&bull; <b>Patient Benefit:</b> The patient pays zero interest or reduced EMI on their treatment plan.<br/>"
        "&bull; <b>Clinic Settlement:</b> The clinic funds the lender-approved promotional subvention. Net treatment proceeds (invoice minus approved subvention and 3.00% MDR) are settled directly into the clinic's account on T+1.<br/>"
        "&bull; <i>Illustrative Example:</i> Enables the clinic to offer attractive promotional payment terms to close high-ticket treatments while still receiving guaranteed upfront T+1 payout."
    )

    t_models = Table([[Paragraph(model1_text, body_style)], [Paragraph(model2_text, body_style)]], colWidths=[519])
    t_models.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F8FAFC")),
        ('BOX', (0,0), (-1,0), 1, colors.HexColor("#CBD5E1")),
        ('BACKGROUND', (0,1), (-1,1), colors.HexColor("#F8FAFC")),
        ('BOX', (0,1), (-1,1), 1, colors.HexColor("#CBD5E1")),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_models)
    
    # Page Break to keep Section 3 table and workflow intact on Page 2
    story.append(PageBreak())

    # Page 2 Running Header
    story.append(Paragraph("CLINAZA HEALTHCARE TECHNOLOGIES &bull; TERMS &amp; CONDITIONS (PAGE 2)", ParagraphStyle('P2Header', parent=styles['Normal'], fontSize=8.5, fontName='Helvetica-Bold', textColor=primary_color, alignment=0, spaceAfter=3)))
    story.append(HRFlowable(width="100%", thickness=0.8, color=colors.HexColor("#CBD5E1"), spaceAfter=8))

    # Section 3: SUMMARY TABLE
    story.append(Paragraph("3. COMMERCIAL TERMS &amp; SETTLEMENT SCHEDULE (SUMMARY)", h1_style))
    comm_data = [
        [Paragraph("<b>Component</b>", body_style), Paragraph("<b>Rate / Terms</b>", body_style), Paragraph("<b>Billing / Settlement Mode</b>", body_style)],
        [Paragraph("Digital Desk Activation &amp; Setup", body_style), Paragraph("Rs. 999 (One-time, inclusive of taxes)", body_style), Paragraph("Paid during initial clinic enrollment", body_style)],
        [Paragraph("Annual Maintenance Charges (AMC)", body_style), Paragraph("Rs. 0 (Zero AMC for lifetime)", body_style), Paragraph("No recurring rental or monthly subscription fees", body_style)],
        [Paragraph("Patient Financing Platform MDR", body_style), Paragraph("<b>3.00% MDR</b> on loan amount", body_style), Paragraph("Deducted at source on T+1 settlement", body_style)],
        [Paragraph("Patient Monthly Interest Rate", body_style), Paragraph("<b>1.00% - 1.50% / month</b> (Reducing)", body_style), Paragraph("Dynamic based on patient CIBIL &amp; income profile", body_style)],
        [Paragraph("<b>Model 1: Patient-Borne Mode</b>", body_style), Paragraph("Patient pays monthly interest; clinic bears 0% interest", body_style), Paragraph("Clinic receives Invoice less 3% MDR on T+1", body_style)],
        [Paragraph("<b>Model 2: Clinic-Absorbed Mode</b>", body_style), Paragraph("Clinic funds lender promotional subvention", body_style), Paragraph("Clinic receives Invoice less subvention &amp; 3% MDR", body_style)],
        [Paragraph("Counter UPI Collections (QR / Link)", body_style), Paragraph("0.00% Clinic Deduction (Patient Convenience Fee Mode)", body_style), Paragraph("T+1 Settlement; patient fee absorbs 0.40% gateway MDR", body_style)],
        [Paragraph("Debit / Credit Cards (Non-EMI)", body_style), Paragraph("1.35% (Debit) / 2.35% (Credit)", body_style), Paragraph("Deducted at source on T+1 settlement", body_style)],
        [Paragraph("Settlement Payout Cycle", body_style), Paragraph("Guaranteed T+1 Business Days", body_style), Paragraph("Direct Nodal Bank NEFT/RTGS to Clinic Current Account", body_style)],
        [Paragraph("Clinic Collection Recourse", body_style), Paragraph("<b>0% Recourse Guarantee</b>", body_style), Paragraph("Regulated lenders absorb all patient credit risk", body_style)]
    ]
    t_comm = Table(comm_data, colWidths=[150, 195, 174])
    t_comm.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), accent_bg),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('TOPPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t_comm)
    story.append(Spacer(1, 6))

    # Section 4: DESK WORKFLOW & COMPLIANCE
    story.append(Paragraph("4. DESK WORKFLOW &amp; COMPLIANCE STANDARDS", h1_style))
    wf_text = (
        "&bull; <b>100% Digital Point-of-Care Checkout:</b> No hardware POS machines, paper forms, or terminal rentals. Front-desk checkout is powered by instant digital payment links (WhatsApp/SMS) and dynamic on-screen QR codes generated directly on the clinic's phone, tablet, or reception computer.<br/>"
        "&bull; <b>Fast 3-Step Patient Approval:</b> 1) Front desk enters treatment amount -&gt; 2) Patient selects tenure (3 to 24 months) and verifies OTP -&gt; 3) Instant digital sanction. Treatment starts immediately, and full funds settle into clinic account on T+1.<br/>"
        "&bull; <b>Secure Account Linking:</b> Clinic bank account is linked securely via cancelled cheque and doctor PAN verification under Pine Labs merchant underwriting desk.<br/>"
        "&bull; <b>RBI Digital Lending Compliance:</b> Clinaza acts as a Lending Service Provider (LSP) conduit. All loan sanctions, Key Fact Statements (KFS), and terms are issued transparently by partner RBI-regulated lending institutions."
    )
    story.append(Paragraph(wf_text, body_style))
    story.append(Spacer(1, 8))

    # Footer note
    footer_text = (
        "<b>CLINAZA TECHNOLOGIES</b> &bull; Empowering India's Dental Clinics with Point-of-Care Patient Healthcare Financing<br/>"
        "Official Institutional Fintech Integration: Pine Labs Plural &bull; Email: support@clinaza.in &bull; Website: clinaza.in"
    )
    t_footer = Table([[Paragraph(footer_text, ParagraphStyle('Foot', parent=styles['Normal'], fontSize=7.5, leading=10, textColor=colors.HexColor("#64748B"), alignment=1))]], colWidths=[519])
    t_footer.setStyle(TableStyle([
        ('LINEABOVE', (0,0), (-1,-1), 0.5, border_color),
        ('TOPPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_footer)

    doc.build(story)
    print(f"Successfully generated {filename}")

if __name__ == '__main__':
    from datetime import datetime
    import shutil

    # 1. Dedicated Terms & Conditions (Recitals & Commercial Terms) for Dr. Shikha Tripathi
    clinic_shikha = {
        "clinic_name": "My Family Dentist Dental Implants Centre",
        "doctor_name": "Dr. Shikha Tripathi",
        "address": "My Family Dentist Dental Implants Centre, Haridwar, Uttarakhand - 249401",
        "city": "Haridwar, Uttarakhand",
        "phone": "+91 94561 90901",
        "email": "myfamilydentists@gmail.com"
    }
    custom_pdf = "public/docs/Clinaza_Terms_and_Conditions_My_Family_Dentist.pdf"
    build_terms_and_recitals_pdf(custom_pdf, clinic_info=clinic_shikha)

    # 2. General Blank Terms & Conditions (Recitals & Commercial Terms)
    build_terms_and_recitals_pdf("public/docs/Clinaza_Terms_and_Conditions_General.pdf", clinic_info=None)

    # 3. Master Formal Sub-Merchant Agreement (Blank Template & Sample Executed)
    build_pdf("public/docs/Clinaza_Clinic_Sub_Merchant_Master_Services_Agreement.pdf", is_sample=False)
    build_pdf("public/docs/Clinaza_Sample_Executed_Pilot_Clinic_Agreement.pdf", is_sample=True)

    # Copy files to ~/Downloads
    downloads_path = os.path.expanduser("~/Downloads")
    shutil.copyfile(custom_pdf, os.path.join(downloads_path, "Clinaza_Terms_and_Conditions_My_Family_Dentist.pdf"))
    shutil.copyfile("public/docs/Clinaza_Terms_and_Conditions_General.pdf", os.path.join(downloads_path, "Clinaza_Terms_and_Conditions_General.pdf"))
    shutil.copyfile("public/docs/Clinaza_Clinic_Sub_Merchant_Master_Services_Agreement.pdf", os.path.join(downloads_path, "Clinaza_Clinic_Sub_Merchant_Master_Services_Agreement.pdf"))
    print("Copied PDFs to ~/Downloads successfully!")
