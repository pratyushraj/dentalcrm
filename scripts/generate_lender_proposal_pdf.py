import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, Image, PageBreak
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.graphics.shapes import Drawing, Rect, String, Group, Line

def create_market_size_chart():
    # Width: 540, Height: 44
    d = Drawing(540, 44)
    
    # Background container
    d.add(Rect(0, 0, 540, 44, fillColor=colors.HexColor("#f8fafc"), strokeColor=colors.HexColor("#cbd5e1"), strokeWidth=0.5, rx=3, ry=3))
    
    # Segment 1: Total Healthcare Out-of-Pocket TAM ($72B / ₹6,00,000 Cr) - width: 220
    d.add(Rect(12, 18, 190, 16, fillColor=colors.HexColor("#081F4D"), strokeColor=None, rx=2, ry=2))
    d.add(String(20, 22, "TOTAL OOP HEALTHCARE: $72B (₹6 Lakh Cr)", fontName="Helvetica-Bold", fontSize=7.2, fillColor=colors.white))
    d.add(String(12, 6, "60%+ of total national healthcare spend is out-of-pocket", fontName="Helvetica", fontSize=6.5, fillColor=colors.HexColor("#64748b")))
    
    # Segment 2: Out-of-Pocket Dental TAM ($3.2B / ₹26,500 Cr) - width: 160
    d.add(Rect(212, 18, 160, 16, fillColor=colors.HexColor("#0867E8"), strokeColor=None, rx=2, ry=2))
    d.add(String(220, 22, "DENTAL TAM: $3.2B (₹26,500 Cr)", fontName="Helvetica-Bold", fontSize=7.2, fillColor=colors.white))
    d.add(String(212, 6, "100% Uninsured / Zero Mediclaim coverage across India", fontName="Helvetica", fontSize=6.5, fillColor=colors.HexColor("#64748b")))

    # Segment 3: High-Ticket Elective SAM (Clinaza Target: ₹11,200 Cr) - width: 146
    d.add(Rect(382, 18, 146, 16, fillColor=colors.HexColor("#0D9488"), strokeColor=None, rx=2, ry=2))
    d.add(String(390, 22, "CLINAZA SAM: ₹11,200 Cr / yr", fontName="Helvetica-Bold", fontSize=7.2, fillColor=colors.white))
    d.add(String(382, 6, "Implants, Aligners, Full-Mouth (₹35k-₹1.8L ticket)", fontName="Helvetica", fontSize=6.5, fillColor=colors.HexColor("#0D9488")))

    return d

def generate_pdf():
    pdf_filename = "Clinaza_Juspay_HyperCredit_Lender_Proposal.pdf"
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=22,
        bottomMargin=20
    )

    styles = getSampleStyleSheet()

    # Premium Fintech Color Palette
    PRIMARY = colors.HexColor("#081F4D")    # Midnight Corporate Navy
    ACCENT = colors.HexColor("#0867E8")     # Clinaza High-Trust Electric Blue
    SECONDARY = colors.HexColor("#0D9488")  # Medical Teal
    DARK_TEXT = colors.HexColor("#0f172a")  # Slate 900
    MUTED_TEXT = colors.HexColor("#475569") # Slate 600
    BG_LIGHT = colors.HexColor("#f8fafc")   # Slate 50
    CARD_BG = colors.HexColor("#f1f5f9")    # Slate 100
    BORDER_COLOR = colors.HexColor("#cbd5e1")
    SUCCESS = colors.HexColor("#16a34a")

    # Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=15.5,
        leading=19,
        textColor=PRIMARY,
        spaceAfter=1.5
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11.5,
        textColor=ACCENT,
        spaceAfter=4
    )

    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=PRIMARY,
        spaceBefore=3.5,
        spaceAfter=2
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.6,
        leading=10.4,
        textColor=DARK_TEXT,
        spaceAfter=2
    )

    table_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.2,
        leading=9.2,
        textColor=colors.white
    )

    table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.0,
        leading=9.0,
        textColor=DARK_TEXT
    )

    story = []

    # ── Top Branding Header with Logo ──
    logo_path = os.path.abspath("public/logo.png")
    if os.path.exists(logo_path):
        logo_img = Image(logo_path, width=34, height=34)
    else:
        logo_img = Paragraph("<b>CLINAZA</b>", title_style)

    brand_text = Paragraph(
        "<b><font size='11' color='#081F4D'>CLINAZA</font></b> &nbsp;<font color='#0867E8' size='7'><b>|</b> clinaza.in</font><br/>"
        "<font color='#475569' size='6.6'>Point-of-Care Healthcare Financing Network &bull; India</font>",
        body_style
    )

    dossier_meta = Paragraph(
        "<font color='#0867E8'><b>INSTITUTIONAL PARTNERSHIP DOSSIER</b></font><br/>"
        "<font color='#64748b' size='6.6'>Prepared for Juspay HyperCredit &amp; Lending Partners</font><br/>"
        "<font color='#16a34a' size='6.3'><b>&bull; PRE-SCREENED MERIT PIPELINE</b></font>",
        ParagraphStyle('RAlign', parent=body_style, alignment=2)
    )

    header_table = Table([[logo_img, brand_text, dossier_meta]], colWidths=[40, 230, 270])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
    ]))
    story.append(header_table)
    story.append(HRFlowable(width="100%", thickness=1.5, color=ACCENT, spaceBefore=1, spaceAfter=4))

    # ── Title Banner ──
    story.append(Paragraph("Point-of-Care Healthcare Financing Network", title_style))
    story.append(Paragraph("Accelerating Prime Elective Dental Lending via Juspay HyperCredit Infrastructure", subtitle_style))

    # ── 1. Executive Summary & Market Gap ──
    story.append(Paragraph("1. Executive Overview & Market Opportunity", section_heading))
    story.append(Paragraph(
        "<b>Clinaza</b> (clinaza.in) is an embedded healthcare financing network partnering with verified dental practices across India. "
        "Over <b>60% of total healthcare spend in India is out-of-pocket</b>, and dental treatments "
        "are <b>100% excluded under standard health insurance (Mediclaim) policies</b>. "
        "While clinical procedures range from <b>₹35,000 to ₹1,80,000</b>, over <b>45%–55% of diagnosed patients drop out or delay care</b> due to lump-sum payment friction.",
        body_style
    ))

    # ── Visual Market Size Opportunity Chart ──
    story.append(Spacer(1, 1))
    story.append(create_market_size_chart())
    story.append(Spacer(1, 3))

    # ── 2. Competitive Landscape: How Clinaza Wins Against Competitors ──
    story.append(Paragraph("2. Competitive Landscape & Clinaza’s Distribution Moat", section_heading))
    story.append(Paragraph(
        "Lenders frequently evaluate how Clinaza’s distribution model compares to incumbent medical loan aggregators and consumer lenders in India:",
        body_style
    ))

    comp_data = [
        [
            Paragraph("Platform", table_header),
            Paragraph("Distribution Model", table_header),
            Paragraph("Structural Limitation for Lenders", table_header),
            Paragraph("Clinaza’s Strategic Advantage", table_header)
        ],
        [
            Paragraph("<b>SaveIN</b><br/>(YC Backed, ~$12M raised)", table_cell),
            Paragraph("Standee & QR-driven 'Care Now Pay Later' across outpatient clinics.", table_cell),
            Paragraph("Passive standees; pivoted into retail/lifestyle (travel/furniture) causing poor clinic recall and high dropouts.", table_cell),
            Paragraph("<b>Consultation-Room Alignment:</b> Doctors introduce financing directly chairside during treatment acceptance, ensuring genuine medical borrower intent.", table_cell)
        ],
        [
            Paragraph("<b>CarePay</b><br/>(Carecoin, Pre-Seed)", table_cell),
            Paragraph("Multi-lender checkout payment link for elective healthcare.", table_cell),
            Paragraph("Pure front-desk checkout link; high merchant churn and friction after invoice generation.", table_cell),
            Paragraph("<b>Chairside Treatment Acceptance:</b> Captured during diagnosis, unlocking 2.5x higher conversion than front-desk checkout links.", table_cell)
        ],
        [
            Paragraph("<b>Fibe (EarlySalary)</b><br/>(Healthcare Vertical)", table_cell),
            Paragraph("Direct-to-consumer app-based personal & medical loans.", table_cell),
            Paragraph("Heavy D2C performance marketing CAC; loans disburse to patient bank accounts, creating high cash diversion and credit risk.", table_cell),
            Paragraph("<b>Zero End-Use Diversion:</b> Zero CAC clinical sourcing; funds disburse 100% direct to verified clinic accounts against surgical invoices.", table_cell)
        ],
        [
            Paragraph("<b>Bajaj Finserv Health</b><br/>(Health EMI Network Card)", table_cell),
            Paragraph("Card-based closed-loop POS medical financing network.", table_cell),
            Paragraph("Requires pre-issued EMI cards or cumbersome offline POS terminal swipes with heavy merchant subvention charges on clinics.", table_cell),
            Paragraph("<b>100% Instant Digital Rails:</b> Zero physical card dependency; paperless OTP journey completed in &lt;3 minutes via Juspay rails at no clinic burden.", table_cell)
        ]
    ]
    comp_table = Table(comp_data, colWidths=[85, 135, 160, 160])
    comp_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BG_LIGHT]),
        ('PADDING', (0, 0), (-1, -1), 2.8),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(comp_table)

    # PAGE BREAK to ensure crisp 2-page symmetry
    story.append(PageBreak())

    # ── Page 2 Top Header ──
    p2_header = Table([[
        Paragraph("<b>CLINAZA TECHNOLOGIES</b> &bull; Institutional Lending Dossier", body_style),
        Paragraph("<font color='#0867E8'>Page 2 of 2</font>", ParagraphStyle('R3', parent=body_style, alignment=2))
    ]], colWidths=[350, 190])
    p2_header.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
    ]))
    story.append(p2_header)
    story.append(HRFlowable(width="100%", thickness=1, color=ACCENT, spaceBefore=2, spaceAfter=6))

    # ── 3. Underwriting Moat: Why Lenders Win (Low NPA) ──
    story.append(Paragraph("3. Underwriting Moat & Low-NPA Protections for Lending Partners", section_heading))
    
    moat_data = [
        [
            Paragraph("<b>Doctor-Vetted Prime Borrowers</b>", ParagraphStyle('M1', parent=body_style, fontName='Helvetica-Bold', textColor=PRIMARY, fontSize=7.5)),
            Paragraph("Borrowers are physically examined, diagnosed, and KYC-validated by licensed dental surgeons (MDS/BDS). Sourced from stable middle-to-high income salaried and business households.", table_cell)
        ],
        [
            Paragraph("<b>Inelastic Medical Need (High Intent)</b>", ParagraphStyle('M2', parent=body_style, fontName='Helvetica-Bold', textColor=PRIMARY, fontSize=7.5)),
            Paragraph("Unlike discretionary gadgets or lifestyle loans, dental procedures are essential medical and oral interventions, historically exhibiting significantly lower willful default rates.", table_cell)
        ],
        [
            Paragraph("<b>Zero End-Use Diversion Fraud</b>", ParagraphStyle('M3', parent=body_style, fontName='Helvetica-Bold', textColor=PRIMARY, fontSize=7.5)),
            Paragraph("Loan proceeds are never disbursed to personal borrower wallets. Funds disburse directly to verified clinic bank accounts via Juspay settlement rails against specific clinical invoices.", table_cell)
        ],
        [
            Paragraph("<b>Zero Tech Overhead for Lender</b>", ParagraphStyle('M4', parent=body_style, fontName='Helvetica-Bold', textColor=PRIMARY, fontSize=7.5)),
            Paragraph("Institutional lending partners leverage their existing, pre-configured Juspay HyperCredit integration—requiring zero custom development or engineering spend.", table_cell)
        ]
    ]
    moat_table = Table(moat_data, colWidths=[170, 370])
    moat_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), BG_LIGHT),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('PADDING', (0, 0), (-1, -1), 4),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(moat_table)
    story.append(Spacer(1, 3))

    # ── 4. Lending Specifications & Rollout Projections ──
    story.append(Paragraph("4. Lending Specifications & Projected Volume Rollout", section_heading))

    spec_proj_data = [
        [
            Paragraph("Loan Ticket Range", table_header),
            Paragraph("₹15,000 to ₹3,00,000 (Avg ticket: ₹55,000 – ₹85,000)", table_cell),
            Paragraph("Phase 1 (Months 1–3)", table_header),
            Paragraph("<b>₹35L – ₹75 Lakhs / month GMV</b> (25–40 Dental Centers)", table_cell)
        ],
        [
            Paragraph("Tenures Available", table_header),
            Paragraph("3, 6, 9, 12, 18, and 24 Months flexible plans", table_cell),
            Paragraph("Phase 2 (Months 4–6)", table_header),
            Paragraph("<b>₹1.2 Cr – ₹2.5 Crores / month GMV</b> (75–120 Practices)", table_cell)
        ],
        [
            Paragraph("KYC & Onboarding", table_header),
            Paragraph("100% Paperless OTP (Aadhaar + PAN + e-NACH) in &lt;3 mins", table_cell),
            Paragraph("Phase 3 (Scale 12 Mo)", table_header),
            Paragraph("<b>₹3.5 Cr – ₹6.0 Crores / month GMV</b> (250+ Clinics)", table_cell)
        ],
        [
            Paragraph("Settlement Cycle", table_header),
            Paragraph("T+1 / T+2 direct clinic settlement via Juspay rails", table_cell),
            Paragraph("Credit Liability", table_header),
            Paragraph("100% Balance-Sheet Underwritten by Lender. Zero clinic risk.", table_cell)
        ]
    ]
    spec_proj_table = Table(spec_proj_data, colWidths=[105, 165, 110, 160])
    spec_proj_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), PRIMARY),
        ('BACKGROUND', (2, 0), (2, -1), SECONDARY),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (1, 0), (1, -1), [colors.white]),
        ('ROWBACKGROUNDS', (3, 0), (3, -1), [colors.white]),
        ('PADDING', (0, 0), (-1, -1), 4),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(spec_proj_table)
    story.append(Spacer(1, 5))

    # ── 5. Integration Architecture ──
    story.append(Paragraph("5. Partnership Onboarding & Technical Execution", section_heading))
    story.append(Paragraph(
        "Clinaza seamlessly plugs into the pre-existing <b>Juspay HyperCredit SDK / Gateway</b>. "
        "Upon lender credit committee sign-off, clinic merchant IDs are provisioned on Juspay rails without requiring bespoke core-banking development. "
        "Disbursement settlements and repayment mandates run through automated e-NACH rails directly under the lending partner's license.",
        body_style
    ))

    # ── 6. Sign-Off Footer ──
    story.append(Spacer(1, 4))
    story.append(HRFlowable(width="100%", thickness=0.8, color=BORDER_COLOR, spaceBefore=3, spaceAfter=4))
    
    footer_data = [
        [
            Paragraph("<b>Pratyush Raj</b> &bull; Founder, Clinaza Technologies<br/>Email: <b>pratyushraj@outlook.com</b> | Phone: <b>+91 7292984244</b> | Web: <b>https://clinaza.in</b>", body_style),
            Paragraph("<b>Juspay HyperCredit Coordination</b><br/>POC: Subahan Shaik / Anirudh Aggitakalya (Affordability Strategy)", ParagraphStyle('R2', parent=body_style, alignment=2))
        ]
    ]
    footer_table = Table(footer_data, colWidths=[270, 270])
    footer_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('PADDING', (0, 0), (-1, -1), 2),
    ]))
    story.append(footer_table)

    doc.build(story)
    print(f"✅ Generated executive PDF with Market Size Chart: {pdf_filename}")

if __name__ == '__main__':
    generate_pdf()
