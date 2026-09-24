import os
import sys
from reportlab.lib.pagesizes import landscape, letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.pdfgen import canvas
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

PDF_PATH = "/Users/pratyushraj/Desktop/Clinaza_Pitch_Deck.pdf"
PPTX_PATH = "/Users/pratyushraj/Desktop/Clinaza_Pitch_Deck.pptx"

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setStrokeColor(colors.HexColor("#0284c7"))
        self.setLineWidth(3)
        self.line(40, 575, 752, 575)

        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#0369a1"))
        self.drawString(40, 25, "CLINAZA HEALTHCARE")
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))
        self.drawString(145, 25, "• Point-of-Care Dental Financing Gateway • clinaza.in")
        page_text = f"Slide {self._pageNumber} of {page_count}"
        self.drawRightString(752, 25, page_text)
        self.restoreState()

def build_pdf():
    doc = SimpleDocTemplate(
        PDF_PATH,
        pagesize=landscape(letter),
        leftMargin=40,
        rightMargin=40,
        topMargin=45,
        bottomMargin=45
    )

    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=28,
        leading=34,
        textColor=colors.HexColor('#0f172a'),
        spaceAfter=10
    )
    
    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=14,
        leading=20,
        textColor=colors.HexColor('#0284c7'),
        spaceAfter=22
    )

    slide_heading = ParagraphStyle(
        'SlideHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=19,
        leading=25,
        textColor=colors.HexColor('#0f172a'),
        spaceAfter=12
    )

    tag_style = ParagraphStyle(
        'TagStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=11,
        textColor=colors.HexColor('#0284c7'),
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10.5,
        leading=15,
        textColor=colors.HexColor('#334155'),
        spaceAfter=8
    )

    card_title_style = ParagraphStyle(
        'CardTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11.5,
        leading=15,
        textColor=colors.HexColor('#0f172a'),
        spaceAfter=4
    )

    card_text_style = ParagraphStyle(
        'CardText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor('#475569')
    )

    metric_val_style = ParagraphStyle(
        'MetricVal',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#0284c7'),
        alignment=1,
        spaceAfter=4
    )

    metric_lbl_style = ParagraphStyle(
        'MetricLbl',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#64748b'),
        alignment=1
    )

    story = []

    # ─────────────────────────────────────────────────────────
    # SLIDE 1: COVER
    # ─────────────────────────────────────────────────────────
    story.append(Spacer(1, 35))
    story.append(Paragraph("HEALTHCARE FINTECH • POINT-OF-CARE FINANCING", tag_style))
    story.append(Paragraph("Clinaza: The Dental Financing Gateway", title_style))
    story.append(Paragraph("Democratizing Subvented 0% Point-of-Care Credit for India's 95% Standalone Dental Clinics", subtitle_style))
    
    cover_table_data = [
        [
            Paragraph("<b>Founder:</b> Pratyush Raj<br/><b>Location:</b> India (Patna / Delhi NCR / Tricity)<br/><b>Contact:</b> contact@clinaza.in | +91 7292984244", body_style),
            Paragraph("<b>Core Thesis:</b> Aggregating standalone clinics to unlock direct clinic disbursement & low-interest healthcare lending.<br/><b>Live Platform:</b> <font color='#0284c7'><u>https://clinaza.in</u></font>", body_style)
        ]
    ]
    t_cover = Table(cover_table_data, colWidths=[350, 360])
    t_cover.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#e2e8f0')),
        ('PADDING', (0,0), (-1,-1), 16),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_cover)
    story.append(PageBreak())

    # ─────────────────────────────────────────────────────────
    # SLIDE 2: THE REAL PROBLEM & MARKET GAP
    # ─────────────────────────────────────────────────────────
    story.append(Paragraph("THE MARKET BOTTLENECK", tag_style))
    story.append(Paragraph("The Unserved 95%: Why Standalone Clinics Lose High-Ticket Patients", slide_heading))
    story.append(Paragraph("SaveIN, Bajaj Finserv, and CarePay fight exclusively for the top 5% luxury hospital chains (Clove, Apollo White) with INR 20L+ monthly billing.", body_style))
    story.append(Spacer(1, 8))

    gap_cards = [
        [
            Paragraph("<b>1. Standalone Clinics Locked Out</b>", card_title_style),
            Paragraph("<b>2. Punitive 15%+ Interest Rates</b>", card_title_style),
            Paragraph("<b>3. The NBFC Catch-22</b>", card_title_style)
        ],
        [
            Paragraph("Over 2,00,000 independent dental clinics in India have zero point-of-care financing. They cannot meet Bajaj/SaveIN high-volume threshold requirements.", card_text_style),
            Paragraph("Current market options treat treatments as unsecured personal loans (15–24% APR) instead of 8% subvented healthcare credit, causing 70% patient drop-off.", card_text_style),
            Paragraph("No tier-1 NBFC offers direct-to-clinic disbursement or low rates without guaranteed bulk volume. Individual clinics cannot negotiate alone.", card_text_style)
        ]
    ]
    t_gap = Table(gap_cards, colWidths=[232, 232, 232])
    t_gap.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#fef2f2')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#fecaca')),
        ('PADDING', (0,0), (-1,-1), 12),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_gap)
    story.append(PageBreak())

    # ─────────────────────────────────────────────────────────
    # SLIDE 3: THE SOLUTION & STRATEGY
    # ─────────────────────────────────────────────────────────
    story.append(Paragraph("THE CLINAZA SOLUTION", tag_style))
    story.append(Paragraph("The Aggregated Dental Financing Gateway", slide_heading))
    story.append(Paragraph("Clinaza aggregates independent clinics into a single high-volume network to secure direct-to-clinic disbursement and low 8-10% interest rates.", body_style))
    story.append(Spacer(1, 8))

    sol_cards = [
        [
            Paragraph("<b>1. Aggregated Volume Gateway</b>", card_title_style),
            Paragraph("<b>2. Direct Clinic Disbursement</b>", card_title_style),
            Paragraph("<b>3. Merchant Subvention (MDR)</b>", card_title_style)
        ],
        [
            Paragraph("Clinaza acts as the master institutional partner for NBFCs, bundling hundreds of Tier-1/2 standalone clinics to reach institutional volume scale.", card_text_style),
            Paragraph("Capital disburses directly into the clinic's bank account within 24 hours — eliminating patient cash diversion and clinic bad-debt risk.", card_text_style),
            Paragraph("Clinics gladly pay 2–3% subvention fee to subsidize patient interest down to 0% / 8%, turning lost INR 80,000+ implant/aligner quotes into cash-in-bank.", card_text_style)
        ]
    ]
    t_sol = Table(sol_cards, colWidths=[232, 232, 232])
    t_sol.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f0f9ff')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#bae6fd')),
        ('PADDING', (0,0), (-1,-1), 12),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_sol)
    story.append(PageBreak())

    # ─────────────────────────────────────────────────────────
    # SLIDE 4: COMPETITIVE WEDGE
    # ─────────────────────────────────────────────────────────
    story.append(Paragraph("COMPETITIVE LANDSCAPE", tag_style))
    story.append(Paragraph("Why Clinaza Wins the Long Tail While Incumbents Ignore It", slide_heading))
    story.append(Spacer(1, 8))

    comp_rows = [
        [
            Paragraph("<b>Dimension</b>", card_title_style),
            Paragraph("<b>Bajaj Finserv / Health EMI</b>", card_title_style),
            Paragraph("<b>SaveIN / CarePay</b>", card_title_style),
            Paragraph("<b>Clinaza Healthcare</b>", card_title_style)
        ],
        [
            Paragraph("<b>Clinic Focus</b>", card_text_style),
            Paragraph("Corporate hospital chains & large clinics only", card_text_style),
            Paragraph("Premium urban clinics (INR 15L+ monthly target)", card_text_style),
            Paragraph("<b>The 95% standalone independent dental clinics</b>", card_text_style)
        ],
        [
            Paragraph("<b>Onboarding Friction</b>", card_text_style),
            Paragraph("Heavy paperwork, POS machine, strict audits", card_text_style),
            Paragraph("Selective partnership, field sales dependent", card_text_style),
            Paragraph("<b>Instant digital onboarding via web & QR</b>", card_text_style)
        ],
        [
            Paragraph("<b>Disbursement Model</b>", card_text_style),
            Paragraph("Direct to clinic (closed ecosystem)", card_text_style),
            Paragraph("Direct to clinic (high volume pre-req)", card_text_style),
            Paragraph("<b>Aggregated pool direct settlement</b>", card_text_style)
        ],
        [
            Paragraph("<b>Interest Structure</b>", card_text_style),
            Paragraph("0% via heavy merchant subvention", card_text_style),
            Paragraph("Subsidized 8-12% APR", card_text_style),
            Paragraph("<b>Transitioning from 15% personal to 8% subvented</b>", card_text_style)
        ]
    ]
    t_comp = Table(comp_rows, colWidths=[150, 185, 185, 190])
    t_comp.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0f172a')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('GRID', (0,0), (-1,-1), 1, colors.HexColor('#e2e8f0')),
        ('PADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BACKGROUND', (3,1), (3,-1), colors.HexColor('#f0f9ff')),
    ]))
    story.append(t_comp)
    story.append(PageBreak())

    # ─────────────────────────────────────────────────────────
    # SLIDE 5: UNIT ECONOMICS & REVENUE MODEL
    # ─────────────────────────────────────────────────────────
    story.append(Paragraph("BUSINESS MODEL & UNIT ECONOMICS", tag_style))
    story.append(Paragraph("Pure Software Margins on High-Ticket Healthcare Disbursals", slide_heading))
    story.append(Spacer(1, 8))

    econ_rows = [
        [
            Paragraph("<b>Revenue Driver</b>", card_title_style),
            Paragraph("<b>Rate / Take Rate</b>", card_title_style),
            Paragraph("<b>Unit Economics Example (INR 1,00,000 Treatment)</b>", card_title_style)
        ],
        [
            Paragraph("<b>1. NBFC Lending Payout</b>", card_title_style),
            Paragraph("1.5% to 2.5% payout from lending partner on disbursed volume.", card_text_style),
            Paragraph("<b>INR 1,500 – INR 2,500</b> gross revenue generated instantly upon disbursement.", card_text_style)
        ],
        [
            Paragraph("<b>2. Clinic Subvention (MDR)</b>", card_title_style),
            Paragraph("2.0% to 3.0% paid by the clinic to offer 0% / low-interest patient EMI.", card_text_style),
            Paragraph("<b>INR 2,000 – INR 3,000</b> shared between Clinaza & NBFC to subsidize interest rate.", card_text_style)
        ],
        [
            Paragraph("<b>3. Blended Take Rate</b>", card_title_style),
            Paragraph("Net take rate of <b>2.5% to 3.5%</b> per successful patient case.", card_text_style),
            Paragraph("At 100 clinics doing INR 3L monthly financing volume = <b>INR 7.5L – INR 10.5L/mo revenue</b>.", card_text_style)
        ]
    ]
    t_econ = Table(econ_rows, colWidths=[200, 240, 270])
    t_econ.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0284c7')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('GRID', (0,0), (-1,-1), 1, colors.HexColor('#e2e8f0')),
        ('PADDING', (0,0), (-1,-1), 10),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_econ)
    story.append(PageBreak())

    # ─────────────────────────────────────────────────────────
    # SLIDE 6: TRACTION & EARLY DISCOVERY
    # ─────────────────────────────────────────────────────────
    story.append(Paragraph("EARLY VALIDATION", tag_style))
    story.append(Paragraph("Validation of Organic Demand & Bottleneck Identification", slide_heading))
    story.append(Spacer(1, 8))

    val_cards = [
        [
            Paragraph("<b>Live Consumer Flow</b>", card_title_style),
            Paragraph("<b>Discovered Drop-Off Point</b>", card_title_style),
            Paragraph("<b>Distribution Footprint</b>", card_title_style)
        ],
        [
            Paragraph("Live digital financing journey at <code>https://clinaza.in</code>. Generated real inbound patient applicants without paid advertising.", card_text_style),
            Paragraph("Real-world testing proved that 15%+ personal loan rates create 'No Offers Available' drops. Confirms 8-10% subvented credit is the missing piece.", card_text_style),
            Paragraph("Direct database of 1,000+ verified dental practices across Punjab, Haryana, Delhi NCR, and Tier-2 hubs ready for aggregated rollout.", card_text_style)
        ]
    ]
    t_val = Table(val_cards, colWidths=[232, 232, 232])
    t_val.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f0fdf4')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#86efac')),
        ('PADDING', (0,0), (-1,-1), 12),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_val)
    story.append(PageBreak())

    # ─────────────────────────────────────────────────────────
    # SLIDE 7: THE ASK & PARTNERSHIP AT VROZARTX
    # ─────────────────────────────────────────────────────────
    story.append(Spacer(1, 20))
    story.append(Paragraph("STRATEGIC ACCELERATOR ASK", tag_style))
    story.append(Paragraph("How VrozartX Unlocks the Clinaza Flywheel", title_style))
    story.append(Paragraph("We know exactly what is required to win: NBFC Institutional Alignment & Regional Density.", subtitle_style))
    story.append(Spacer(1, 10))

    ask_points = [
        [
            Paragraph("<b>What We Need from VrozartX / Mentors:</b>", card_title_style)
        ],
        [
            Paragraph("<b>1. NBFC Institutional Co-Lending Introductions:</b> Connect with progressive NBFCs willing to pilot direct-to-clinic disbursement with 8-10% interest rates backed by aggregate clinic volume.<br/><br/>"
                      "<b>2. Capital for Volume Escrow / Pilot FLDG:</b> Initial seed capital to meet institutional NBFC minimum guarantee thresholds and unlock merchant subvention.<br/><br/>"
                      "<b>3. Regional Clinic Density (Punjab / Tricity Pilot):</b> Leverage local networks in Mohali, Chandigarh, and Punjab to onboard the initial cohort of 50–100 dental practices.", body_style)
        ]
    ]
    t_ask = Table(ask_points, colWidths=[710])
    t_ask.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f0f9ff')),
        ('BOX', (0,0), (-1,-1), 1.5, colors.HexColor('#0284c7')),
        ('PADDING', (0,0), (-1,-1), 16),
    ]))
    story.append(t_ask)
    story.append(Spacer(1, 15))

    contact_mini = [
        [
            Paragraph("<b>Pratyush Raj</b> • Founder, Clinaza Healthcare • <b>Mobile/WhatsApp:</b> +91 7292984244 • <b>Email:</b> contact@clinaza.in • <b>Web:</b> https://clinaza.in", body_style)
        ]
    ]
    t_mini = Table(contact_mini, colWidths=[710])
    t_mini.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
        ('PADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(t_mini)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Generated PDF successfully at {PDF_PATH}")

def build_pptx():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    PRIMARY = RGBColor(2, 132, 199)
    DARK = RGBColor(15, 23, 42)
    MUTED = RGBColor(100, 116, 139)
    BG_LIGHT = RGBColor(248, 250, 252)

    blank_layout = prs.slide_layouts[6]

    slides_data = [
        {
            "tag": "HEALTHCARE FINTECH • POINT-OF-CARE FINANCING",
            "title": "Clinaza: The Dental Financing Gateway",
            "body": "Democratizing Subvented 0% Point-of-Care Credit for India's 95% Standalone Dental Clinics\n\n• Founder: Pratyush Raj • contact@clinaza.in • +91 7292984244 • https://clinaza.in\n• Thesis: Aggregating standalone clinics to unlock direct clinic disbursement & low-interest healthcare lending."
        },
        {
            "tag": "THE MARKET BOTTLENECK",
            "title": "The Unserved 95%: Why Standalone Clinics Lose High-Ticket Patients",
            "body": "SaveIN, Bajaj Finserv, and CarePay fight exclusively for the top 5% luxury hospital chains (Clove, Apollo White) with INR 20L+ monthly billing.\n\n1. Standalone Clinics Locked Out: Over 2,00,000 independent dental clinics in India have zero point-of-care financing.\n2. Punitive 15%+ Interest Rates: Current market treats treatments as unsecured personal loans (15–24% APR) instead of 8% subvented credit, causing 70% patient drop-off.\n3. The NBFC Catch-22: No tier-1 NBFC offers direct-to-clinic disbursement or low rates without guaranteed bulk volume."
        },
        {
            "tag": "THE CLINAZA SOLUTION",
            "title": "The Aggregated Dental Financing Gateway",
            "body": "Clinaza aggregates independent clinics into a single high-volume network to secure direct-to-clinic disbursement and low 8-10% interest rates.\n\n1. Aggregated Volume Gateway: Master institutional partner for NBFCs, bundling hundreds of Tier-1/2 standalone clinics to reach institutional volume scale.\n2. Direct Clinic Disbursement: Capital disburses directly into clinic's bank account in 24 hours — zero bad-debt risk on clinic.\n3. Merchant Subvention (MDR): Clinics pay 2–3% subvention fee to subsidize patient interest down to 0% / 8%."
        },
        {
            "tag": "COMPETITIVE LANDSCAPE",
            "title": "Why Clinaza Wins the Long Tail While Incumbents Ignore It",
            "body": "• Bajaj / SaveIN: Focus only on luxury chains (INR 15L+ monthly billing). High friction, strict paperwork, rigid minimums.\n• Clinaza: Focuses on the 95% standalone independent dental practices.\n• Instant digital onboarding via QR/web. Direct aggregate pool settlement.\n• Transitioning the long-tail from 15%+ personal loan rates down to 8% subvented healthcare credit."
        },
        {
            "tag": "BUSINESS MODEL & UNIT ECONOMICS",
            "title": "Pure Software Margins on High-Ticket Healthcare Disbursals",
            "body": "1. NBFC Lending Payout: 1.5% to 2.5% payout from lending partner on disbursed volume (INR 1,500 – INR 2,500 on INR 1 Lakh case).\n2. Clinic Subvention (MDR): 2.0% to 3.0% paid by the clinic to offer 0% / low-interest patient EMI.\n3. Blended Take Rate: Net take rate of 2.5% to 3.5% per successful patient case.\n• At 100 clinics doing INR 3L monthly financing volume = INR 7.5L – INR 10.5L/mo revenue."
        },
        {
            "tag": "EARLY VALIDATION",
            "title": "Validation of Organic Demand & Bottleneck Identification",
            "body": "1. Live Consumer Flow: Live digital financing journey at https://clinaza.in. Generated real inbound patient applicants without paid advertising.\n2. Discovered Drop-Off Point: Real-world testing proved that 15%+ personal loan rates create 'No Offers Available' drops. Confirms 8-10% subvented credit is the missing piece.\n3. Distribution Footprint: Direct database of 1,000+ verified dental practices across Punjab, Haryana, Delhi NCR, and Tier-2 hubs."
        },
        {
            "tag": "STRATEGIC ACCELERATOR ASK",
            "title": "How VrozartX Unlocks the Clinaza Flywheel",
            "body": "What We Need from VrozartX / Mentors:\n\n1. NBFC Institutional Co-Lending Introductions: Connect with progressive NBFCs willing to pilot direct-to-clinic disbursement with 8-10% interest rates backed by aggregate clinic volume.\n2. Capital for Volume Escrow / Pilot FLDG: Initial seed capital to meet institutional NBFC minimum guarantee thresholds and unlock merchant subvention.\n3. Regional Clinic Density (Punjab / Tricity Pilot): Leverage local networks in Mohali, Chandigarh, and Punjab to onboard the initial cohort of 50–100 dental practices.\n\nFounder: Pratyush Raj • +91 7292984244 • contact@clinaza.in"
        }
    ]

    for item in slides_data:
        s = prs.slides.add_slide(blank_layout)
        bg = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_LIGHT
        bg.line.color.rgb = BG_LIGHT

        # Top Tag
        tag_box = s.shapes.add_textbox(Inches(0.8), Inches(0.6), Inches(11.5), Inches(0.4))
        p_tag = tag_box.text_frame.paragraphs[0]
        p_tag.text = item["tag"]
        p_tag.font.bold = True
        p_tag.font.size = Pt(11)
        p_tag.font.color.rgb = PRIMARY

        # Title
        title_box = s.shapes.add_textbox(Inches(0.8), Inches(1.0), Inches(11.5), Inches(0.8))
        p_title = title_box.text_frame.paragraphs[0]
        p_title.text = item["title"]
        p_title.font.bold = True
        p_title.font.size = Pt(22)
        p_title.font.color.rgb = DARK

        # Body
        body_box = s.shapes.add_textbox(Inches(0.8), Inches(2.0), Inches(11.5), Inches(4.8))
        tf = body_box.text_frame
        tf.word_wrap = True
        p_body = tf.paragraphs[0]
        p_body.text = item["body"]
        p_body.font.size = Pt(14)
        p_body.font.color.rgb = DARK

    prs.save(PPTX_PATH)
    print(f"Generated PPTX successfully at {PPTX_PATH}")

if __name__ == "__main__":
    build_pdf()
    build_pptx()
