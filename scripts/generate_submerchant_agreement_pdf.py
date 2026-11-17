import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

def build_pdf(filename, is_sample=False):
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
    eff_date = "1st November 2026" if is_sample else "______ day of ________________, 2026"
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
    story.append(Paragraph("B. Clinaza has entered into payment aggregation and processing arrangements with Reserve Bank of India (<b>\"RBI\"</b>) authorized Payment Aggregators (including <b>Easebuzz Private Limited</b>, hereinafter <b>\"Easebuzz / PA\"</b>) and regulated Lending Service Providers / Scheduled Banks / NBFCs to facilitate seamless electronic transactions, point-of-sale card processing, UPI collections, and patient EMI loan disbursements.", bullet_style))
    story.append(Paragraph("C. The Partner Clinic is an active healthcare establishment providing dental, orthodontic, implant, and allied clinical services to patients (<b>\"Patients\"</b>).", bullet_style))
    story.append(Paragraph("D. The Partner Clinic desires to be onboarded under Clinaza's Master Merchant Account (<b>\"Master MID\"</b>) as a verified <b>Sub-Merchant</b> on the Payment Aggregator network to enable Patients to pay for treatment charges via digital payment instruments, cardless EMIs, and NBFC healthcare credit, with direct settlement routed to the Partner Clinic's verified bank account.", bullet_style))
    story.append(Spacer(1, 6))

    story.append(Paragraph("<b>NOW, THEREFORE, IT IS MUTUALLY AGREED BY AND BETWEEN THE PARTIES AS FOLLOWS:</b>", body_style))

    # Clause 1
    story.append(Paragraph("1. APPOINTMENT &amp; SUB-MERCHANT AUTHORIZATION", h1_style))
    story.append(Paragraph("1.1. The Partner Clinic hereby appoints Clinaza as its technology provider, digital payment facilitator, and Merchant Aggregator. The Partner Clinic expressly authorizes Clinaza to submit the Partner Clinic's KYC documentation to Easebuzz and allied partner financial institutions for the creation and mapping of a dedicated <b>Sub-Merchant Identifier (Sub-MID)</b> under Clinaza's Master MID.", body_style))
    story.append(Paragraph("1.2. The Partner Clinic authorizes Easebuzz, as the RBI-licensed Payment Aggregator, to collect, process, hold in escrow/nodal accounts, and route patient treatment payments directly to the Partner Clinic's designated bank account as specified in <b>Schedule B</b> of this Agreement.", body_style))

    # Clause 2
    story.append(Paragraph("2. POINT-OF-CARE PAYMENT &amp; EMI FACILITATION SERVICES", h1_style))
    story.append(Paragraph("2.1. Clinaza shall provide the Partner Clinic with access to the Clinaza Doctor Dashboard, digital payment link generator, physical countertop acrylic QR standee kit, and cardless healthcare EMI pre-qualification workflows.", body_style))
    story.append(Paragraph("2.2. Clinaza acts strictly as a technology facilitator and Lending Service Provider (LSP) conduit under the RBI Digital Lending Guidelines. Clinaza does not disburse loans on its own balance sheet. All EMI loans, interest rates, Key Fact Statements (KFS), and approval decisions are granted solely by partner RBI-regulated Scheduled Commercial Banks and NBFCs.", body_style))

    # Clause 3
    story.append(Paragraph("3. SETTLEMENT MECHANISM &amp; ESCROW ROUTING", h1_style))
    story.append(Paragraph("3.1. <b>Payout Timeline:</b> In accordance with RBI Payment Aggregator directives, all approved treatment collections and disbursed loan amounts shall be settled into the Partner Clinic's registered bank account on a standard <b>T+1 / T+2 business day schedule</b> (where T is the date of successful transaction confirmation).", body_style))
    story.append(Paragraph("3.2. <b>Deductions:</b> The Payment Aggregator and Clinaza are authorized to automatically deduct the applicable Merchant Discount Rate (MDR) or platform processing charges as agreed under <b>Schedule A</b> prior to remitting net settlement proceeds to the Partner Clinic.", body_style))
    story.append(Paragraph("3.3. <b>Zero AMC Guarantee:</b> Clinaza covenants that the Partner Clinic shall not be charged any hidden recurring monthly POS hardware rentals or Annual Maintenance Charges (AMC).", body_style))

    # Clause 4
    story.append(Paragraph("4. CLINIC OBLIGATIONS &amp; REGULATORY COMPLIANCE", h1_style))
    story.append(Paragraph("4.1. The Partner Clinic warrants that its treating dental surgeons hold valid, active registrations with the Dental Council of India (DCI) or respective State Dental Council, and that the clinic complies with all applicable local Clinical Establishments Acts.", body_style))
    story.append(Paragraph("4.2. <b>Authentic Treatment Delivery:</b> The Partner Clinic covenants that all transactions processed through Clinaza and Easebuzz represent bona fide medical, dental, or surgical treatments rendered to genuine patients.", body_style))
    story.append(Paragraph("4.3. <b>No Duplicate Surcharges:</b> The Partner Clinic agrees not to levy discriminatory surcharges or additional cash markups on patients who choose digital or EMI payment methods over cash.", body_style))

    # Clause 5
    story.append(Paragraph("5. DISPUTES, REFUNDS &amp; CHARGEBACK INDEMNITY", h1_style))
    story.append(Paragraph("5.1. <b>Clinical Discretion:</b> Clinaza and Easebuzz are technology and payment intermediaries and bear zero liability for clinical diagnosis, procedure efficacy, patient outcomes, or doctor-patient medical disputes.", body_style))
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
        [Paragraph("Clinic Onboarding &amp; Hardware Activation Kit", body_style), Paragraph("₹999 (One-time, inclusive of taxes &amp; shipping)", body_style), Paragraph("Paid during initial clinic enrollment", body_style)],
        [Paragraph("Annual Maintenance Charges (AMC)", body_style), Paragraph("₹0 (Zero AMC for lifetime)", body_style), Paragraph("No recurring rental fees", body_style)],
        [Paragraph("Counter UPI Collections (Dynamic QR / Link)", body_style), Paragraph("0.00% Clinic Deduction (Patient Convenience Mode) OR 0.75% MDR (Clinic-Borne Mode)", body_style), Paragraph("T+1 Settlement; standard ₹19–₹49 patient digital fee covers 0.40% gateway MDR + reconciliation", body_style)],
        [Paragraph("Debit Cards (Visa / Mastercard)", body_style), Paragraph("1.35% MDR", body_style), Paragraph("Deducted at source on T+1 settlement", body_style)],
        [Paragraph("Credit Cards (Non-EMI Full Payment)", body_style), Paragraph("2.35% MDR", body_style), Paragraph("Deducted at source on T+1 settlement", body_style)],
        [Paragraph("Multi-Bank Card EMI (Financed)", body_style), Paragraph("3.75% Subvention (or 0% Clinic deduction if patient-borne)", body_style), Paragraph("100% full invoice credit to Clinic on T+1", body_style)],
        [Paragraph("Healthcare Cardless EMIs / NBFC Loans", body_style), Paragraph("As per Lender Grid (3%–5% subvention or 0% clinic deduction)", body_style), Paragraph("Direct T+1 disbursement to Clinic Bank Account", body_style)],
        [Paragraph("Settlement Payout Cycle", body_style), Paragraph("Guaranteed T+1 Business Days", body_style), Paragraph("Direct Nodal Bank NEFT/RTGS to Clinic Account", body_style)]
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
            [Paragraph("<b>Sub-Merchant MID Mapping:</b>", body_style), Paragraph("Mapped under Clinaza Authorized Payment Gateway (Plural by Pine Labs / Easebuzz) Master MID", body_style)]
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
            [Paragraph("<b>Sub-Merchant MID Mapping:</b>", body_style), Paragraph("To be mapped under Clinaza Easebuzz Master MID", body_style)]
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

if __name__ == '__main__':
    # 1. Blank Template Agreement for Easebuzz & Clinics
    build_pdf("public/docs/Clinaza_Clinic_Sub_Merchant_Master_Services_Agreement.pdf", is_sample=False)
    # 2. Sample Executed Pilot Agreement with Dr. Raj Clinic
    build_pdf("public/docs/Clinaza_Sample_Executed_Pilot_Clinic_Agreement.pdf", is_sample=True)
