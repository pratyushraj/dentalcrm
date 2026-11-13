import os
import re
import json
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE
from pptx.dml.color import RGBColor

# ── Modern Typography ──
FONT_NAME = "Helvetica Neue"

# ── Premium Swiss / Pine Labs Green & Navy Fintech Color Palette ──
COLOR_BG_PAGE = RGBColor(241, 245, 249)        # Slate-100 soft tinted canvas
COLOR_HEADER_NAVY = RGBColor(10, 25, 60)       # Deep Navy Header Bar
COLOR_NAVY = RGBColor(10, 25, 60)              # #0A193C Primary Navy
COLOR_NAVY_DARK = RGBColor(6, 16, 42)          # #06102A Cover Navy
COLOR_BLUE = RGBColor(10, 102, 235)            # #0A66EB Clinaza Electric Blue
COLOR_PINE_GREEN = RGBColor(0, 168, 89)        # #00A859 Pine Labs Brand Green Accent
COLOR_PINE_DARK = RGBColor(0, 95, 52)          # #005F34 Pine Deep Green
COLOR_TEAL = RGBColor(13, 148, 136)            # #0D9488 Medical Teal
COLOR_GREEN = RGBColor(16, 185, 129)           # #10B981 Prime Growth Green
COLOR_CARD_WHITE = RGBColor(255, 255, 255)     # Pure Crisp White Card Surface
COLOR_CARD_TINT = RGBColor(248, 250, 252)      # Soft Slate 50
COLOR_TEAL_TINT = RGBColor(240, 253, 250)      # Soft Teal Tint
COLOR_BLUE_TINT = RGBColor(238, 242, 255)      # Soft Blue Tint
COLOR_PINE_TINT = RGBColor(235, 248, 242)      # Soft Pine Labs Tint
COLOR_RED = RGBColor(225, 29, 72)              # Rose/Red for Incumbents
COLOR_ROSE_TINT = RGBColor(255, 241, 242)      # Soft Rose Tint
COLOR_BORDER = RGBColor(203, 213, 225)         # Crisp Slate-300 Border
COLOR_TEXT_PRIMARY = RGBColor(15, 23, 42)      # #0F172A Sharp Charcoal Text
COLOR_TEXT_SECONDARY = RGBColor(51, 65, 85)    # #334155 Slate 700 Clear Reading Text
COLOR_TEXT_MUTED = RGBColor(100, 116, 139)     # #64748B Secondary Text
COLOR_WHITE = RGBColor(255, 255, 255)

LOGO_PATH = os.path.abspath("public/assets/clinaza-logo.jpg")
PINELABS_LOGO_PATH = os.path.abspath("public/assets/pinelabs_logo.png")

TOTAL_PAGES = 4

def create_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    def set_slide_background(slide, color=COLOR_BG_PAGE):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = color
        bg.line.color.rgb = color
        return bg

    def add_chrome(slide, title_text, category_badge, current_page, total_pages=TOTAL_PAGES):
        # 1. Top Integrated Header Banner Bar
        head_banner = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(1.35))
        head_banner.fill.solid()
        head_banner.fill.fore_color.rgb = COLOR_CARD_WHITE
        head_banner.line.color.rgb = COLOR_BORDER
        head_banner.line.width = Pt(1)

        # Bottom accent stripe of header bar
        stripe = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, Inches(1.31), Inches(13.333), Inches(0.04))
        stripe.fill.solid()
        stripe.fill.fore_color.rgb = COLOR_PINE_GREEN
        stripe.line.color.rgb = COLOR_PINE_GREEN

        # Logo on Header
        if os.path.exists(LOGO_PATH):
            slide.shapes.add_picture(LOGO_PATH, Inches(0.8), Inches(0.25), height=Inches(0.80))

        # Title block: Category Tag + 1-Line Headline
        tx = slide.shapes.add_textbox(Inches(1.85), Inches(0.20), Inches(7.3), Inches(0.95))
        tf = tx.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        
        # Category Kicker Tag
        p = tf.paragraphs[0]
        p.text = f"{category_badge.upper()}  •  CLINAZA.IN/PARTNER-PIPELINE"
        p.font.name = FONT_NAME
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = COLOR_PINE_DARK

        # Main Slide Title
        p2 = tf.add_paragraph()
        p2.text = title_text
        p2.font.name = FONT_NAME
        p2.font.size = Pt(18.5)
        p2.font.bold = True
        p2.font.color.rgb = COLOR_NAVY
        p2.space_before = Pt(4)

        # Right Institutional Meta Box & Pine Labs Logo
        rx = slide.shapes.add_textbox(Inches(9.1), Inches(0.18), Inches(2.3), Inches(0.85))
        rf = rx.text_frame
        rf.word_wrap = True
        rf.margin_left = rf.margin_top = rf.margin_right = rf.margin_bottom = 0
        rp = rf.paragraphs[0]
        rp.alignment = PP_ALIGN.RIGHT
        rp.text = "PLURAL BY PINE LABS"
        rp.font.name = FONT_NAME
        rp.font.size = Pt(9.5)
        rp.font.bold = True
        rp.font.color.rgb = COLOR_NAVY
        rp2 = rf.add_paragraph()
        rp2.alignment = PP_ALIGN.RIGHT
        rp2.text = "Strategic ISV Partnership"
        rp2.font.name = FONT_NAME
        rp2.font.size = Pt(8.5)
        rp2.font.color.rgb = COLOR_TEXT_MUTED
        rp2.space_before = Pt(2)

        if os.path.exists(PINELABS_LOGO_PATH):
            slide.shapes.add_picture(PINELABS_LOGO_PATH, Inches(11.55), Inches(0.32), height=Inches(0.62))

        # 2. Bottom Institutional Footer Bar
        foot_bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, Inches(6.92), Inches(13.333), Inches(0.58))
        foot_bar.fill.solid()
        foot_bar.fill.fore_color.rgb = COLOR_CARD_WHITE
        foot_bar.line.color.rgb = COLOR_BORDER
        foot_bar.line.width = Pt(1)

        fx = slide.shapes.add_textbox(Inches(0.8), Inches(7.02), Inches(9.8), Inches(0.35))
        ff = fx.text_frame
        ff.word_wrap = True
        ff.margin_left = ff.margin_top = ff.margin_right = ff.margin_bottom = 0
        fp = ff.paragraphs[0]
        fp.text = "CLINAZA TECHNOLOGIES  |  Strategic ISV Partnership Dossier for Pine Labs Limited (Plural Gateway)"
        fp.font.name = FONT_NAME
        fp.font.size = Pt(9.5)
        fp.font.color.rgb = COLOR_TEXT_MUTED

        px = slide.shapes.add_textbox(Inches(11.0), Inches(7.02), Inches(1.533), Inches(0.35))
        pf = px.text_frame
        pf.margin_left = pf.margin_top = pf.margin_right = pf.margin_bottom = 0
        pp = pf.paragraphs[0]
        pp.alignment = PP_ALIGN.RIGHT
        pp.text = f"{current_page} of {total_pages}"
        pp.font.name = FONT_NAME
        pp.font.size = Pt(9.5)
        pp.font.bold = True
        pp.font.color.rgb = COLOR_NAVY

    def populate_card_text(tf, text_block):
        lines = [line.strip() for line in text_block.strip().split("\n") if line.strip()]
        for i, line in enumerate(lines):
            p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
            p.word_wrap = True
            p.space_after = Pt(3.5)
            p.line_spacing = 1.15
            
            parts = re.split(r'(\*\*.*?\*\*)', line)
            for part in parts:
                if not part:
                    continue
                run = p.add_run()
                run.font.name = FONT_NAME
                if part.startswith("**") and part.endswith("**"):
                    run.text = part[2:-2]
                    run.font.bold = True
                    run.font.size = Pt(10.8)
                    run.font.color.rgb = COLOR_TEXT_PRIMARY
                else:
                    run.text = part
                    run.font.bold = False
                    run.font.size = Pt(10.2)
                    run.font.color.rgb = COLOR_TEXT_SECONDARY

    # ═════════════════════════════════════════════════════════════════════════
    # SLIDE 1: COVER
    # ═════════════════════════════════════════════════════════════════════════
    slide1 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide1, COLOR_NAVY_DARK)

    acc = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(0.12))
    acc.fill.solid()
    acc.fill.fore_color.rgb = COLOR_PINE_GREEN
    acc.line.color.rgb = COLOR_PINE_GREEN

    cover_box = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.2), Inches(0.9), Inches(10.933), Inches(5.7))
    cover_box.fill.solid()
    cover_box.fill.fore_color.rgb = RGBColor(12, 28, 68)
    cover_box.line.color.rgb = RGBColor(30, 58, 138)
    cover_box.line.width = Pt(1.5)

    if os.path.exists(LOGO_PATH):
        slide1.shapes.add_picture(LOGO_PATH, Inches(1.8), Inches(1.4), height=Inches(1.1))

    if os.path.exists(PINELABS_LOGO_PATH):
        pill = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(9.2), Inches(1.4), Inches(2.4), Inches(1.1))
        pill.fill.solid()
        pill.fill.fore_color.rgb = COLOR_WHITE
        pill.line.color.rgb = COLOR_PINE_GREEN
        pill.line.width = Pt(1)
        slide1.shapes.add_picture(PINELABS_LOGO_PATH, Inches(9.35), Inches(1.6), height=Inches(0.70))

    t_box = slide1.shapes.add_textbox(Inches(1.8), Inches(2.75), Inches(9.7), Inches(2.4))
    tf_c = t_box.text_frame
    tf_c.word_wrap = True

    p = tf_c.paragraphs[0]
    p.text = "STRATEGIC ISV PARTNERSHIP & AFFORDABILITY PROPOSAL"
    p.font.name = FONT_NAME
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = COLOR_PINE_GREEN

    p2 = tf_c.add_paragraph()
    p2.text = "Plural by Pine Labs × Clinaza"
    p2.font.name = FONT_NAME
    p2.font.size = Pt(32)
    p2.font.bold = True
    p2.font.color.rgb = COLOR_WHITE
    p2.space_before = Pt(8)

    p3 = tf_c.add_paragraph()
    p3.text = "Full-Stack Payment Routing (100% Clinic Turnover): RuPay CC on UPI, Dynamic Desk QR & Multi-Lender Patient EMIs"
    p3.font.name = FONT_NAME
    p3.font.size = Pt(13.5)
    p3.font.color.rgb = RGBColor(186, 230, 253)
    p3.space_before = Pt(6)

    m_box = slide1.shapes.add_textbox(Inches(1.8), Inches(5.35), Inches(9.7), Inches(0.9))
    mf = m_box.text_frame
    mp = mf.paragraphs[0]
    mp.text = "ATTN: Nishant Gupta (SVP Strategic Alliances) · Pallovi Roy (GTM Head Affordability) · Advaita Parmar (Alliances)"
    mp.font.name = FONT_NAME
    mp.font.size = Pt(11)
    mp.font.bold = True
    mp.font.color.rgb = COLOR_WHITE

    mp2 = mf.add_paragraph()
    mp2.text = "Submitted by Pratyush Raj, Founder — Clinaza Technologies (+91 7292984244 | support@clinaza.in | clinaza.in)"
    mp2.font.name = FONT_NAME
    mp2.font.size = Pt(10)
    mp2.font.color.rgb = COLOR_TEXT_MUTED
    mp2.space_before = Pt(3)

    # ═════════════════════════════════════════════════════════════════════════
    # SLIDE 2: THE FULL-STACK ISV ADVANTAGE & ZERO-HARDWARE MOAT
    # ═════════════════════════════════════════════════════════════════════════
    slide2 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide2)
    add_chrome(slide2, "Strategic Architecture: 100% Clinic Turnover Routed via Plural", "ISV Architecture", 2)

    card_w = Inches(3.75)
    gap = Inches(0.24)
    start_x = Inches(0.8)
    top_y = Inches(1.55)
    card_h = Inches(5.15)

    # Card 1: 100% Wallet Share
    c1 = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x, top_y, card_w, card_h)
    c1.fill.solid()
    c1.fill.fore_color.rgb = COLOR_CARD_WHITE
    c1.line.color.rgb = COLOR_BORDER
    c1.line.width = Pt(1)
    
    hdr1 = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x, top_y, card_w, Inches(0.55))
    hdr1.fill.solid()
    hdr1.fill.fore_color.rgb = COLOR_BLUE_TINT
    hdr1.line.color.rgb = COLOR_BORDER
    p = hdr1.text_frame.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.text = "1. 100% CLINIC WALLET SHARE"
    p.font.name = FONT_NAME
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_BLUE

    tf1 = slide2.shapes.add_textbox(start_x + Inches(0.2), top_y + Inches(0.65), card_w - Inches(0.4), card_h - Inches(0.8)).text_frame
    tf1.word_wrap = True
    populate_card_text(tf1, """
• **Embedded Inside Clinic Software**: Clinaza is the dentist's operating software—handling patient records, treatment plans, and billing.
• **Total Turnover Routed to Plural**: We don't just route sporadic loan cases. We route 100% of clinic transactions:
  • Routine checkups & cleanings (₹1,500 – ₹5,000)
  • Root canals & crowns (₹8,000 – ₹25,000)
  • Implants & Aligners (₹35,000 – ₹1,50,000)
• **10x Volume for Pine Labs**: Captures the entire clinic cash flow, delivering massive continuous transaction volume compared to single-purpose loan apps.
""")

    # Card 2: Zero Hardware Moat
    c2 = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x + card_w + gap, top_y, card_w, card_h)
    c2.fill.solid()
    c2.fill.fore_color.rgb = COLOR_CARD_WHITE
    c2.line.color.rgb = COLOR_BORDER
    c2.line.width = Pt(1)

    hdr2 = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x + card_w + gap, top_y, card_w, Inches(0.55))
    hdr2.fill.solid()
    hdr2.fill.fore_color.rgb = COLOR_PINE_TINT
    hdr2.line.color.rgb = COLOR_BORDER
    p = hdr2.text_frame.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.text = "2. ZERO HARDWARE & ZERO RENTAL"
    p.font.name = FONT_NAME
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_PINE_DARK

    tf2 = slide2.shapes.add_textbox(start_x + card_w + gap + Inches(0.2), top_y + Inches(0.65), card_w - Inches(0.4), card_h - Inches(0.8)).text_frame
    tf2.word_wrap = True
    populate_card_text(tf2, """
• **100% Cloud-Hosted Digital Checkout**: No physical POS machines, no SIM card logistics, and zero hardware capex.
• **Saves Clinics ₹500–₹1,000/mo**: Doctors avoid monthly POS machine rental fees and terminal breakdown frustration.
• **Instant Front-Desk Payment Links**: Reception triggers 1-click Plural payment links via WhatsApp / SMS directly to patient smartphones.
• **Counter Dynamic QR**: Generates dynamic QR codes supporting instant Google Pay, PhonePe, Paytm, and CRED payments.
""")

    # Card 3: RuPay CC on UPI & Affordability
    c3 = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x + (card_w + gap)*2, top_y, card_w, card_h)
    c3.fill.solid()
    c3.fill.fore_color.rgb = COLOR_CARD_WHITE
    c3.line.color.rgb = COLOR_BORDER
    c3.line.width = Pt(1)

    hdr3 = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x + (card_w + gap)*2, top_y, card_w, Inches(0.55))
    hdr3.fill.solid()
    hdr3.fill.fore_color.rgb = COLOR_TEAL_TINT
    hdr3.line.color.rgb = COLOR_BORDER
    p = hdr3.text_frame.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.text = "3. RUPAY CC ON UPI & EMIS"
    p.font.name = FONT_NAME
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_TEAL

    tf3 = slide2.shapes.add_textbox(start_x + (card_w + gap)*2 + Inches(0.2), top_y + Inches(0.65), card_w - Inches(0.4), card_h - Inches(0.8)).text_frame
    tf3.word_wrap = True
    populate_card_text(tf3, """
• **High-Yield RuPay CC on UPI**: Patients scan the desk QR and pay surgical fees (₹25K–₹1L) directly from their credit card line linked in UPI apps (2.10% MDR).
• **16+ Bank CC EMI Suite**: Multi-bank 3 to 24 month EMIs with real-time affordability calculation.
• **Native Cardless EMI**: Direct digital lending via ICICI Bank Cardless & DMI Finance for non-cardholding patients.
• **Direct T+1 Disbursal**: Net funds settle directly to clinic current accounts with zero default liability on Clinaza or clinics.
""")

    # ═════════════════════════════════════════════════════════════════════════
    # SLIDE 3: CLINIC PIPELINE & VOLUME ROADMAP
    # ═════════════════════════════════════════════════════════════════════════
    slide3 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide3)
    add_chrome(slide3, "Market Scale: 28 Verified Clinics & ₹35+ Cr Annualized Throughput", "Pipeline & Scale", 3)

    # 4 KPI Cards across top
    box_w = Inches(2.78)
    box_gap = Inches(0.2)
    b_top = Inches(1.52)
    b_h = Inches(1.15)

    kpis = [
        ("TARGET PIPELINE", "28 Verified Clinic Cohort", COLOR_NAVY),
        ("ALL PAYMENT MODES", "100% Turnover Routed to Plural", COLOR_BLUE),
        ("₹40L – ₹60L / MO", "Phase 1 Blended Run-Rate", COLOR_PINE_DARK),
        ("₹35+ CR / YR", "Year 1 Total Network GMV", COLOR_TEAL)
    ]

    for i, (val, lbl, col) in enumerate(kpis):
        bx = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x + (box_w + box_gap)*i, b_top, box_w, b_h)
        bx.fill.solid()
        bx.fill.fore_color.rgb = COLOR_CARD_WHITE
        bx.line.color.rgb = COLOR_BORDER
        bx.line.width = Pt(1)
        
        btf = bx.text_frame
        btf.margin_top = Pt(10)
        p = btf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        p.text = val
        p.font.name = FONT_NAME
        p.font.size = Pt(17)
        p.font.bold = True
        p.font.color.rgb = col
        
        p2 = btf.add_paragraph()
        p2.alignment = PP_ALIGN.CENTER
        p2.text = lbl
        p2.font.name = FONT_NAME
        p2.font.size = Pt(9.5)
        p2.font.color.rgb = COLOR_TEXT_MUTED
        p2.space_before = Pt(2)

    # Bottom 2 Split Cards: Left = Procedure Economics, Right = Clinic Cohort & Roadmap
    b_y = Inches(2.85)
    b_w = Inches(5.7)
    b_h2 = Inches(3.85)

    # Left: Procedure Catalogue
    card_l3 = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x, b_y, b_w, b_h2)
    card_l3.fill.solid()
    card_l3.fill.fore_color.rgb = COLOR_CARD_WHITE
    card_l3.line.color.rgb = COLOR_BORDER
    card_l3.line.width = Pt(1)

    hl3 = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x, b_y, b_w, Inches(0.50))
    hl3.fill.solid()
    hl3.fill.fore_color.rgb = COLOR_BLUE_TINT
    hl3.line.color.rgb = COLOR_BORDER
    p = hl3.text_frame.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.text = "HEALTHCARE TREATMENT ECONOMICS & MODES"
    p.font.name = FONT_NAME
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = COLOR_BLUE

    tfl3 = slide3.shapes.add_textbox(start_x + Inches(0.20), b_y + Inches(0.55), b_w - Inches(0.40), b_h2 - Inches(0.65)).text_frame
    tfl3.word_wrap = True
    populate_card_text(tfl3, """
• **Dental Implants (Single / Arch)**: ₹35,000 – ₹70,000
  • Mode: Credit Card EMI & RuPay CC on UPI (32% volume).
• **Clear Aligners (Invisible Ortho)**: ₹50,000 – ₹1,20,000
  • Mode: 9–18M CC EMI & Cardless Patient Financing (26% volume).
• **Full-Mouth Rehabilitation**: ₹80,000 – ₹2,50,000
  • Mode: 12–24M Multi-Bank CC EMI & Split Token (14% volume).
• **Cosmetic Veneers & Smile Design**: ₹40,000 – ₹1,10,000
  • Mode: RuPay CC on UPI & Instant Digital PG (13% volume).
• **Routine OPD, Root Canals & Cleaning**: ₹1,500 – ₹25,000
  • Mode: 100% Routed via Dynamic Desk QR & UPI (15% volume).
""")

    # Right: Clinic Pipeline & Growth
    card_r3 = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), b_y, b_w, b_h2)
    card_r3.fill.solid()
    card_r3.fill.fore_color.rgb = COLOR_CARD_WHITE
    card_r3.line.color.rgb = COLOR_BORDER
    card_r3.line.width = Pt(1)

    hr3 = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), b_y, b_w, Inches(0.50))
    hr3.fill.solid()
    hr3.fill.fore_color.rgb = COLOR_PINE_TINT
    hr3.line.color.rgb = COLOR_BORDER
    p = hr3.text_frame.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.text = "VERIFIED CLINIC PIPELINE & GMV PROJECTION"
    p.font.name = FONT_NAME
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = COLOR_PINE_DARK

    tfr3 = slide3.shapes.add_textbox(Inches(7.0), b_y + Inches(0.55), b_w - Inches(0.40), b_h2 - Inches(0.65)).text_frame
    tfr3.word_wrap = True
    populate_card_text(tfr3, """
• **28 Verified Merchant Practices Ready for Onboarding**:
  • Prime Metro Clusters: Delhi NCR (Dwarka, Gurugram, South Delhi), Mumbai MMR (Navi Mumbai, Thane), and Bengaluru.
  • Practice Profile: Multi-chair implant & aesthetic centres with verified Council Registration, Business PAN & GST.
• **12-Month GMV Growth Trajectory**:
  • **Phase 1 (M1–3)**: 15–20 Focus Clinics · ₹42L – ₹63L / mo
  • **Phase 2 (M4–6)**: 40–60 Clinics · ₹1.70 Cr – ₹2.65 Cr / mo
  • **Phase 3 (M7–9)**: 90–120 Clinics · ₹4.40 Cr – ₹6.40 Cr / mo
  • **Phase 4 (M10–12)**: 180–250 Clinics · **₹10.5 Cr – ₹16.0 Cr / mo**
""")

    # ═════════════════════════════════════════════════════════════════════════
    # SLIDE 4: COMMERCIAL ALIGNMENT & ROADMAP
    # ═════════════════════════════════════════════════════════════════════════
    slide4 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide4)
    add_chrome(slide4, "Partnership Roadmap: ISV Commercial Alignment & Next Steps", "Commercial Alignment", 4)

    left_x = Inches(0.8)
    right_x = Inches(6.8)
    left_w = Inches(5.7)
    right_w = Inches(5.7)
    s4_top = Inches(1.52)
    s4_h = Inches(5.18)

    box_l4 = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left_x, s4_top, left_w, s4_h)
    box_l4.fill.solid()
    box_l4.fill.fore_color.rgb = COLOR_CARD_WHITE
    box_l4.line.color.rgb = COLOR_BORDER
    box_l4.line.width = Pt(1)

    hl4 = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left_x, s4_top, left_w, Inches(0.52))
    hl4.fill.solid()
    hl4.fill.fore_color.rgb = COLOR_PINE_TINT
    hl4.line.color.rgb = COLOR_BORDER
    p = hl4.text_frame.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.text = "PROPOSED ISV COMMERCIAL ALIGNMENT"
    p.font.name = FONT_NAME
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = COLOR_PINE_DARK

    tfl4 = slide4.shapes.add_textbox(left_x + Inches(0.22), s4_top + Inches(0.60), left_w - Inches(0.44), s4_h - Inches(0.70)).text_frame
    tfl4.word_wrap = True
    populate_card_text(tfl4, """
• **ISV Full-Stack Model**: Clinaza routes 100% of all clinic payment methods through Plural—routine consultations, advances, UPI, RuPay CC on UPI, and multi-lender EMIs—maximizing blended transaction revenue for Pine Labs.

• **MDR Rates 100% Accepted As Quoted**:
  • **Credit Card / Net Banking**: **1.85%** *(Accepted as quoted)*.
  • **EMI Processing Fee**: **0.50%** *(Accepted as quoted)*.
  • **RuPay Credit Card on UPI**: **2.10%** *(Accepted as quoted)*.
  • **Standard UPI & Desk QR**: **0.40%** *(Accepted as quoted)*.

• **Sole Alignment Request — ₹0 Setup & ₹0 AMC**:
  • Standard retail merchant ₹50,000 fee waived under **Strategic ISV Partner Framework** in lieu of multi-clinic volume aggregation.
  • **Annual Maintenance (AMC)**: **₹0 (Waived)**.
  • **Hardware / POS Machine Rental**: **₹0 (Zero Hardware / 100% Cloud-Hosted)**.

• **Win-Win Partner Structure**: Built-in partner bps markup / revenue share on total clinic volume routed through Plural.

• **Compliance & Zero Liability**: Zero FLDG / zero default risk on Clinaza and clinic network; 100% digital KYC and bank underwriting.
""")

    box_r4 = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, right_x, s4_top, right_w, s4_h)
    box_r4.fill.solid()
    box_r4.fill.fore_color.rgb = COLOR_CARD_WHITE
    box_r4.line.color.rgb = COLOR_BORDER
    box_r4.line.width = Pt(1)

    hr4 = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, right_x, s4_top, right_w, Inches(0.52))
    hr4.fill.solid()
    hr4.fill.fore_color.rgb = COLOR_BLUE_TINT
    hr4.line.color.rgb = COLOR_BORDER
    p = hr4.text_frame.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.text = "14-DAY INTEGRATION & GO-LIVE MILESTONES"
    p.font.name = FONT_NAME
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = COLOR_BLUE

    tfr4 = slide4.shapes.add_textbox(right_x + Inches(0.22), s4_top + Inches(0.60), right_w - Inches(0.44), s4_h - Inches(0.70)).text_frame
    tfr4.word_wrap = True
    populate_card_text(tfr4, """
• **Day 1–3: Executive & Commercial Alignment**:
  Formalize fee schedule, zero-setup ISV onboarding, and agreement with **Nishant Gupta**, **Pallovi Roy** & **Advaita Parmar**.

• **Day 4–7: Sandbox Integration**:
  Generate Plural test sandbox credentials; integrate full-stack PG APIs, Affordability widget, CC on UPI, and Split webhooks in Clinaza staging.

• **Day 8–10: End-to-End Simulation**:
  Validate EMI tenure calculations, RuPay CC on UPI QR flows, child MID direct clinic settlement, and error handling.

• **Day 11–14: Production Go-Live & Pilot Rollout**:
  Activate Master ISV account, initiate child MID setup for Phase 1 clinics, and deploy front-desk checkout links.

• **Direct Contact**:
  **Pratyush Raj**, Founder — Clinaza Technologies
  📞 **+91 7292984244** | ✉️ **support@clinaza.in** | 🌐 **https://clinaza.in**
""")

    output_pptx = "Clinaza_PineLabs_Plural_Affordability_Healthcare_Proposal.pptx"
    prs.save(output_pptx)
    print(f"Presentation saved successfully as {output_pptx}")
    return output_pptx

if __name__ == "__main__":
    create_deck()
