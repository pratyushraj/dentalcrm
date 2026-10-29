import os
import re
import json
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
from pptx.dml.color import RGBColor

# ── Modern Typography ──
FONT_NAME = "Helvetica Neue"

# ── Premium Swiss / PayU Green & Navy Fintech Color Palette ──
COLOR_BG_PAGE = RGBColor(241, 245, 249)    # Slate-100 soft tinted canvas
COLOR_HEADER_NAVY = RGBColor(10, 25, 60)   # Deep Navy Header Bar
COLOR_NAVY = RGBColor(10, 25, 60)          # #0A193C Primary Navy
COLOR_NAVY_DARK = RGBColor(6, 16, 42)      # #06102A Cover Navy
COLOR_BLUE = RGBColor(10, 102, 235)        # #0A66EB Clinaza Electric Blue
COLOR_PHONEPE_PURPLE = RGBColor(95, 37, 159)  # #5F259F PhonePe Brand Purple
COLOR_PHONEPE_DARK = RGBColor(74, 20, 140)
COLOR_TEAL = RGBColor(13, 148, 136)        # #0D9488 Medical Teal
COLOR_GREEN = RGBColor(16, 185, 129)       # #10B981 Prime Growth Green
COLOR_CARD_WHITE = RGBColor(255, 255, 255) # Pure Crisp White Card Surface
COLOR_CARD_TINT = RGBColor(248, 250, 252)  # Soft Slate 50
COLOR_TEAL_TINT = RGBColor(240, 253, 250)  # Soft Teal Tint
COLOR_BLUE_TINT = RGBColor(238, 242, 255)  # Soft Blue Tint
COLOR_PHONEPE_TINT = RGBColor(245, 240, 255)  # Soft PhonePe Purple Tint
COLOR_RED = RGBColor(225, 29, 72)          # Rose/Red for Incumbents
COLOR_ROSE_TINT = RGBColor(255, 241, 242)  # Soft Rose Tint
COLOR_BORDER = RGBColor(203, 213, 225)     # Crisp Slate-300 Border
COLOR_TEXT_PRIMARY = RGBColor(15, 23, 42)  # #0F172A Sharp Charcoal Text
COLOR_TEXT_SECONDARY = RGBColor(51, 65, 85) # #334155 Slate 700 Clear Reading Text
COLOR_TEXT_MUTED = RGBColor(100, 116, 139) # #64748B Secondary Text
COLOR_WHITE = RGBColor(255, 255, 255)

LOGO_PATH = os.path.abspath("public/assets/clinaza-logo.jpg")

with open("scripts/pipeline_clinics_data.json") as f:
    ALL_PIPELINE_CLINICS = json.load(f)

TOTAL_PAGES = 10  # 10 slides total with competitive landscape

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
        stripe.fill.fore_color.rgb = COLOR_PHONEPE_PURPLE
        stripe.line.color.rgb = COLOR_PHONEPE_PURPLE

        # Logo on Header
        if os.path.exists(LOGO_PATH):
            slide.shapes.add_picture(LOGO_PATH, Inches(0.8), Inches(0.25), height=Inches(0.80))

        # Title block: Category Tag + 1-Line Headline
        tx = slide.shapes.add_textbox(Inches(1.85), Inches(0.20), Inches(7.5), Inches(0.95))
        tf = tx.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        
        # Category Kicker Tag
        p = tf.paragraphs[0]
        p.text = f"{category_badge.upper()}  •  CLINAZA.IN/PARTNER-PIPELINE"
        p.font.name = FONT_NAME
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = COLOR_PHONEPE_DARK

        # Main Slide Title
        p2 = tf.add_paragraph()
        p2.text = title_text
        p2.font.name = FONT_NAME
        p2.font.size = Pt(19)
        p2.font.bold = True
        p2.font.color.rgb = COLOR_NAVY
        p2.space_before = Pt(4)

        # Right Institutional Meta Box
        rx = slide.shapes.add_textbox(Inches(9.4), Inches(0.25), Inches(3.133), Inches(0.85))
        rf = rx.text_frame
        rf.word_wrap = True
        rf.margin_left = rf.margin_top = rf.margin_right = rf.margin_bottom = 0
        rp = rf.paragraphs[0]
        rp.alignment = PP_ALIGN.RIGHT
        rp.text = "PHONEPE AFFORDABILITY & EMI SUITE"
        rp.font.name = FONT_NAME
        rp.font.size = Pt(10)
        rp.font.bold = True
        rp.font.color.rgb = COLOR_NAVY
        rp2 = rf.add_paragraph()
        rp2.alignment = PP_ALIGN.RIGHT
        rp2.text = "Healthcare EMI & Split-Settlement Rails"
        rp2.font.name = FONT_NAME
        rp2.font.size = Pt(9.5)
        rp2.font.color.rgb = COLOR_TEXT_MUTED
        rp2.space_before = Pt(2)

        # 2. Bottom Institutional Footer Bar
        foot_bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, Inches(6.92), Inches(13.333), Inches(0.58))
        foot_bar.fill.solid()
        foot_bar.fill.fore_color.rgb = COLOR_CARD_WHITE
        foot_bar.line.color.rgb = COLOR_BORDER
        foot_bar.line.width = Pt(1)

        fx = slide.shapes.add_textbox(Inches(0.8), Inches(7.02), Inches(9.5), Inches(0.35))
        ff = fx.text_frame
        ff.word_wrap = True
        ff.margin_left = ff.margin_top = ff.margin_right = ff.margin_bottom = 0
        fp = ff.paragraphs[0]
        fp.text = "CLINAZA TECHNOLOGIES  |  Live Partner Pipeline (clinaza.in/partner-pipeline) for PhonePe Private Limited"
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
            p.space_after = Pt(4)
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
                    run.font.size = Pt(11)
                    run.font.color.rgb = COLOR_TEXT_PRIMARY
                else:
                    run.text = part
                    run.font.bold = False
                    run.font.size = Pt(10.5)
                    run.font.color.rgb = COLOR_TEXT_SECONDARY

    # ═════════════════════════════════════════════════════════════════════════
    # SLIDE 1: COVER
    # ═════════════════════════════════════════════════════════════════════════
    slide1 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide1, COLOR_NAVY_DARK)

    acc = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(0.12))
    acc.fill.solid()
    acc.fill.fore_color.rgb = COLOR_PHONEPE_PURPLE
    acc.line.color.rgb = COLOR_PHONEPE_PURPLE

    cover_box = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.2), Inches(0.9), Inches(10.933), Inches(5.7))
    cover_box.fill.solid()
    cover_box.fill.fore_color.rgb = RGBColor(12, 28, 68)
    cover_box.line.color.rgb = RGBColor(30, 58, 138)
    cover_box.line.width = Pt(1.5)

    if os.path.exists(LOGO_PATH):
        slide1.shapes.add_picture(LOGO_PATH, Inches(1.8), Inches(1.4), height=Inches(1.1))

    badge = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(3.2), Inches(1.6), Inches(5.6), Inches(0.48))
    badge.fill.solid()
    badge.fill.fore_color.rgb = RGBColor(20, 45, 100)
    badge.line.color.rgb = COLOR_PHONEPE_PURPLE
    badge.line.width = Pt(1.2)
    btf = badge.text_frame
    btf.margin_top = Pt(4)
    bp = btf.paragraphs[0]
    bp.alignment = PP_ALIGN.CENTER
    bp.text = "CLINAZA × PHONEPE PRIVATE LIMITED"
    bp.font.name = FONT_NAME
    bp.font.size = Pt(11)
    bp.font.bold = True
    bp.font.color.rgb = COLOR_WHITE

    tx = slide1.shapes.add_textbox(Inches(1.8), Inches(2.7), Inches(9.8), Inches(2.6))
    tf = tx.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "Scaling Point-of-Care Healthcare EMIs & Sub-Merchant Settlements"
    p.font.name = FONT_NAME
    p.font.size = Pt(28)
    p.font.bold = True
    p.font.color.rgb = COLOR_WHITE

    p2 = tf.add_paragraph()
    p2.text = "Live Accredited Clinic Pipeline from clinaza.in/partner-pipeline Integrated with PhonePe EMI Affordability, Cardless EMI & Sub-Merchant Settlements"
    p2.font.name = FONT_NAME
    p2.font.size = Pt(15)
    p2.font.color.rgb = RGBColor(190, 215, 255)
    p2.space_before = Pt(12)

    meta = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.8), Inches(5.3), Inches(9.7), Inches(0.9))
    meta.fill.solid()
    meta.fill.fore_color.rgb = RGBColor(8, 20, 50)
    meta.line.color.rgb = RGBColor(30, 58, 138)
    mtf = meta.text_frame
    mtf.margin_left = Inches(0.3)
    mtf.margin_top = Pt(10)
    
    mp1 = mtf.paragraphs[0]
    mp1.text = "Prepared For: Nisha Shah & Ankush Puri (Client Acquisition Team) | PhonePe Private Limited"
    mp1.font.name = FONT_NAME
    mp1.font.size = Pt(11)
    mp1.font.bold = True
    mp1.font.color.rgb = COLOR_WHITE

    mp2 = mtf.add_paragraph()
    mp2.text = "Originator: Pratyush Raj, Founder — Clinaza Technologies (support@clinaza.in | +91 7292984244 | clinaza.in)"
    mp2.font.name = FONT_NAME
    mp2.font.size = Pt(10.5)
    mp2.font.color.rgb = COLOR_PHONEPE_PURPLE
    mp2.space_before = Pt(4)

    # ═════════════════════════════════════════════════════════════════════════
    # SLIDE 2: EXECUTIVE SUMMARY
    # ═════════════════════════════════════════════════════════════════════════
    slide2 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide2)
    add_chrome(slide2, "Executive Summary: The Healthcare Affordability Gap & PhonePe Partnership", "Market Context", 2)

    card_w = Inches(3.75)
    gap = Inches(0.24)
    start_x = Inches(0.8)
    top_y = Inches(1.6)
    card_h = Inches(5.05)

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
    p.text = "1. THE UNMET MARKET PAIN"
    p.font.name = FONT_NAME
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_BLUE

    tf1 = slide2.shapes.add_textbox(start_x + Inches(0.2), top_y + Inches(0.65), card_w - Inches(0.4), card_h - Inches(0.8)).text_frame
    tf1.word_wrap = True
    populate_card_text(tf1, """
• **High Drop-Off at Checkout**: 40%+ of dental patients drop out after receiving high-ticket treatment estimates (₹35K–₹2.5L for implants, aligners, crowns).
• **Private Insurance Exclusions**: OPD dental treatments are overwhelmingly excluded from retail health insurance in India.
• **Clinic Liquidity Stress**: Clinics cannot offer in-house credit due to default risk and cash-flow bottlenecks.
• **Manual Friction**: Traditional medical loans involve slow paperwork, heavy document scans, and 24-48 hr approvals.
""")

    c2 = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x + card_w + gap, top_y, card_w, card_h)
    c2.fill.solid()
    c2.fill.fore_color.rgb = COLOR_CARD_WHITE
    c2.line.color.rgb = COLOR_BORDER
    c2.line.width = Pt(1)

    hdr2 = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x + card_w + gap, top_y, card_w, Inches(0.55))
    hdr2.fill.solid()
    hdr2.fill.fore_color.rgb = COLOR_PHONEPE_TINT
    hdr2.line.color.rgb = COLOR_BORDER
    p = hdr2.text_frame.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.text = "2. CLINAZA POINT-OF-CARE EMI"
    p.font.name = FONT_NAME
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_PHONEPE_DARK

    tf2 = slide2.shapes.add_textbox(start_x + card_w + gap + Inches(0.2), top_y + Inches(0.65), card_w - Inches(0.4), card_h - Inches(0.8)).text_frame
    tf2.word_wrap = True
    populate_card_text(tf2, """
• **Primary Driver — Healthcare EMI**: Clinics partner with Clinaza specifically to offer instant patient EMIs and close high-ticket treatment cases.
• **Front-Desk QR & Dynamic Links**: Reception desk triggers instant eligibility and payment links via WhatsApp / SMS with zero friction.
• **Zero Clinic Credit Risk**: 100% of default risk is absorbed by regulated lenders; clinic receives direct lump-sum disbursal.
• **High Consultation Conversion**: Instant monthly EMI options convert 35–45% of patients who would otherwise defer costly dental surgery.
""")

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
    p.text = "3. PHONEPE SYNERGY & VALUE ADD"
    p.font.name = FONT_NAME
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_TEAL

    tf3 = slide2.shapes.add_textbox(start_x + (card_w + gap)*2 + Inches(0.2), top_y + Inches(0.65), card_w - Inches(0.4), card_h - Inches(0.8)).text_frame
    tf3.word_wrap = True
    populate_card_text(tf3, """
• **Comprehensive Affordability Suite**: Instant access to 15+ credit/debit card EMI issuers and leading cardless EMI rails.
• **Automated Sub-Merchant Payouts**: PhonePe Split Settlements disburse procedure fees directly to doctor bank accounts with clean platform fee reconciliation.
• **High GMV Throughput**: Healthcare tickets average ₹45,000–₹1,20,000, creating high-margin processing volume for PhonePe.
• **Enterprise SLA & Reliability**: PhonePe's 99.9% uptime and intelligent routing guarantee smooth clinic checkout.
""")

    # ═════════════════════════════════════════════════════════════════════════
    # SLIDE 3: COMPETITIVE LANDSCAPE & DISTRIBUTION MOAT
    # ═════════════════════════════════════════════════════════════════════════
    slide3_comp = prs.slides.add_slide(blank_layout)
    set_slide_background(slide3_comp)
    add_chrome(slide3_comp, "Competitive Landscape: Incumbents vs Clinaza Distribution", "Market Positioning", 3)

    c_w = Inches(3.75)
    c_gap = Inches(0.24)
    c_y = Inches(1.55)
    c_h = Inches(4.7)

    # Card 1: Incumbents (SaveIN, CarePay, Fibe, Bajaj Finserv)
    b1 = slide3_comp.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x, c_y, c_w, c_h)
    b1.fill.solid()
    b1.fill.fore_color.rgb = COLOR_CARD_WHITE
    b1.line.color.rgb = COLOR_BORDER
    b1.line.width = Pt(1)

    h1 = slide3_comp.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x, c_y, c_w, Inches(0.55))
    h1.fill.solid()
    h1.fill.fore_color.rgb = COLOR_ROSE_TINT
    h1.line.color.rgb = COLOR_BORDER
    hp1 = h1.text_frame.paragraphs[0]
    hp1.alignment = PP_ALIGN.CENTER
    hp1.text = "INCUMBENTS IN HEALTHCARE EMI"
    hp1.font.name = FONT_NAME
    hp1.font.size = Pt(11)
    hp1.font.bold = True
    hp1.font.color.rgb = COLOR_RED

    # 4 Competitor Logos in a 2x2 grid
    comp_logos = [
        ("savein", 0, 0),
        ("carepay", 1, 0),
        ("fibe", 0, 1),
        ("bajaj", 1, 1)
    ]
    logo_w_in = 1.55
    logo_h_in = 0.38
    grid_start_y = 2.18
    for l_name, l_col, l_row in comp_logos:
        l_path = f"public/assets/competitors/{l_name}.png"
        if os.path.exists(l_path):
            lx = 0.8 + 0.22 + l_col * (logo_w_in + 0.16)
            ly = grid_start_y + l_row * (logo_h_in + 0.08)
            slide3_comp.shapes.add_picture(l_path, Inches(lx), Inches(ly), width=Inches(logo_w_in), height=Inches(logo_h_in))

    tfc1 = slide3_comp.shapes.add_textbox(start_x + Inches(0.2), Inches(3.18), c_w - Inches(0.4), Inches(2.95)).text_frame
    tfc1.word_wrap = True
    populate_card_text(tfc1, """
• **Focus Only on Flagship Clinics**: Incumbents (Fibe, Bajaj Finserv, SaveIN, CarePay) focus exclusively on top flagship clinics and luxury corporate chains (Clove, Apollo White).
• **Vast Standalone Market Left Behind**: Over 90% of independent dental practices and OPD centres are completely ignored by incumbents.
• **High Field-Sales Overhead**: Incumbents rely on physical branch agents and costly on-ground reps, making standalone clinic acquisition uneconomical for them.
""")

    # Card 2: Clinaza Operating Advantage
    b2 = slide3_comp.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x + c_w + c_gap, c_y, c_w, c_h)
    b2.fill.solid()
    b2.fill.fore_color.rgb = COLOR_CARD_WHITE
    b2.line.color.rgb = COLOR_PHONEPE_PURPLE
    b2.line.width = Pt(1.5)

    h2 = slide3_comp.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x + c_w + c_gap, c_y, c_w, Inches(0.55))
    h2.fill.solid()
    h2.fill.fore_color.rgb = COLOR_PHONEPE_TINT
    h2.line.color.rgb = COLOR_BORDER
    hp2 = h2.text_frame.paragraphs[0]
    hp2.alignment = PP_ALIGN.CENTER
    hp2.text = "CLINAZA CLINIC REACH"
    hp2.font.name = FONT_NAME
    hp2.font.size = Pt(11)
    hp2.font.bold = True
    hp2.font.color.rgb = COLOR_PHONEPE_DARK

    tfc2 = slide3_comp.shapes.add_textbox(start_x + c_w + c_gap + Inches(0.2), c_y + Inches(0.65), c_w - Inches(0.4), c_h - Inches(0.8)).text_frame
    tfc2.word_wrap = True
    populate_card_text(tfc2, """
• **Direct Standalone Clinic Onboarding**: Clinaza onboards independent, standalone dental clinics that need patient financing to survive and grow.
• **Frictionless Front-Desk Checkout**: Doctors and front desks don't need complex software; patients get instant EMI links or QR codes.
• **Direct Doctor Relationship**: Direct doctor buy-in with zero corporate chain approvals or hospital committee bureaucracy.
• **Zero Clinic Credit Risk**: Partner clinics receive full procedure settlements while regulated lenders absorb borrower risk.
""")

    # Card 3: PayU Strategic Synergy
    b3 = slide3_comp.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x + (c_w + c_gap)*2, c_y, c_w, c_h)
    b3.fill.solid()
    b3.fill.fore_color.rgb = COLOR_CARD_WHITE
    b3.line.color.rgb = COLOR_BORDER
    b3.line.width = Pt(1)

    h3 = slide3_comp.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x + (c_w + c_gap)*2, c_y, c_w, Inches(0.55))
    h3.fill.solid()
    h3.fill.fore_color.rgb = COLOR_BLUE_TINT
    h3.line.color.rgb = COLOR_BORDER
    hp3 = h3.text_frame.paragraphs[0]
    hp3.alignment = PP_ALIGN.CENTER
    hp3.text = "THE PHONEPE DISTRIBUTION ADVANTAGE"
    hp3.font.name = FONT_NAME
    hp3.font.size = Pt(11)
    hp3.font.bold = True
    hp3.font.color.rgb = COLOR_BLUE

    tfc3 = slide3_comp.shapes.add_textbox(start_x + (c_w + c_gap)*2 + Inches(0.2), c_y + Inches(0.65), c_w - Inches(0.4), c_h - Inches(0.8)).text_frame
    tfc3.word_wrap = True
    populate_card_text(tfc3, """
• **Unrivalled Card EMI Coverage**: PhonePe provides 15+ top banking issuers, unlocking immediate access for salaried cardholders.
• **Multi-Lender Fallback**: Seamless fallback across credit card EMI, debit card EMI, and digital NBFC rails maximizes approval TAT.
• **Automated Sub-MID Architecture**: Automated split routing settles net amounts directly to doctor current accounts.
• **Market Capture**: Together, PhonePe and Clinaza outmaneuver single-rail lending apps with enterprise grade reliability and reach.
""")

    # Bottom takeaway strip on slide 3
    t_bar = slide3_comp.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(6.32), Inches(11.733), Inches(0.46))
    t_bar.fill.solid()
    t_bar.fill.fore_color.rgb = COLOR_NAVY
    t_bar.line.color.rgb = COLOR_NAVY
    t_tf = t_bar.text_frame
    t_tf.margin_top = t_tf.margin_bottom = t_tf.margin_left = t_tf.margin_right = 0
    tp = t_tf.paragraphs[0]
    tp.alignment = PP_ALIGN.CENTER
    tp.text = "Strategic Edge: While Fibe, Bajaj, SaveIN & CarePay act as external lending apps, Clinaza embeds PhonePe directly inside clinic daily workflows."
    tp.font.name = FONT_NAME
    tp.font.size = Pt(10.5)
    tp.font.bold = True
    tp.font.color.rgb = COLOR_WHITE

    # ═════════════════════════════════════════════════════════════════════════
    # SLIDE 4: CHECKOUT INTEGRATION
    # ═════════════════════════════════════════════════════════════════════════
    slide3 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide3)
    add_chrome(slide3, "Checkout Integration: Instant Card & Cardless Healthcare EMIs", "Technical Architecture", 4)

    left_w = Inches(5.7)
    right_w = Inches(5.7)
    left_x = Inches(0.8)
    right_x = Inches(6.8)

    box_l = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left_x, top_y, left_w, card_h)
    box_l.fill.solid()
    box_l.fill.fore_color.rgb = COLOR_CARD_WHITE
    box_l.line.color.rgb = COLOR_BORDER
    box_l.line.width = Pt(1)

    hl = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left_x, top_y, left_w, Inches(0.55))
    hl.fill.solid()
    hl.fill.fore_color.rgb = COLOR_BLUE_TINT
    hl.line.color.rgb = COLOR_BORDER
    p = hl.text_frame.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.text = "POINT-OF-CARE PATIENT CHECKOUT JOURNEY"
    p.font.name = FONT_NAME
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_BLUE

    tfl = slide3.shapes.add_textbox(left_x + Inches(0.25), top_y + Inches(0.65), left_w - Inches(0.5), card_h - Inches(0.8)).text_frame
    tfl.word_wrap = True
    populate_card_text(tfl, """
• **Step 1: Clinical Diagnosis & Billing**:
  Doctor generates treatment estimate (e.g. ₹65,000 for 2 Dental Implants) via Clinaza EMR.

• **Step 2: Dynamic QR / SMS Link**:
  Reception desk triggers PhonePe Checkout link via WhatsApp / SMS or displays desk QR.

• **Step 3: Instant Affordability Widget**:
  Patient enters mobile number; PhonePe widget fetches pre-approved credit/debit card limits & cardless eligibility.

• **Step 4: Flexible Tenure Selection**:
  Patient selects 3, 6, 9, 12, or 24-month installment plan with clear APR and monthly breakdown.

• **Step 5: OTP Authentication & Instant Approval**:
  Patient verifies via bank OTP; real-time success webhook triggers instant treatment confirmation.
""")

    box_r = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, right_x, top_y, right_w, card_h)
    box_r.fill.solid()
    box_r.fill.fore_color.rgb = COLOR_CARD_WHITE
    box_r.line.color.rgb = COLOR_BORDER
    box_r.line.width = Pt(1)

    hr = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, right_x, top_y, right_w, Inches(0.55))
    hr.fill.solid()
    hr.fill.fore_color.rgb = COLOR_PHONEPE_TINT
    hr.line.color.rgb = COLOR_BORDER
    p = hr.text_frame.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.text = "PHONEPE AFFORDABILITY & CARDLESS EMI CAPABILITIES"
    p.font.name = FONT_NAME
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_PHONEPE_DARK

    tfr = slide3.shapes.add_textbox(right_x + Inches(0.25), top_y + Inches(0.65), right_w - Inches(0.5), card_h - Inches(0.8)).text_frame
    tfr.word_wrap = True
    populate_card_text(tfr, """
• **Credit Card EMI (15+ Banks)**:
  HDFC, ICICI, SBI, Axis, Kotak, RBL, Bank of Baroda, IndusInd, Federal Bank, Standard Chartered.

• **Debit Card EMI**:
  Pre-approved cardholder limits on HDFC, ICICI, Axis, and Kotak Mahindra debit cards.

• **Cardless EMI & Digital NBFCs**:
  ZestMoney, EarlySalary (Fibe), InstaCred (Flexmoney), and pre-approved personal credit lines.

• **UPI & Netbanking Fallback**:
  Full support for standard down-payments, booking deposits, and token fees via UPI 2.0 & Netbanking.

• **Dynamic Subvention Engine**:
  Ability for clinic or Clinaza to sponsor interest subvention for selective promotional packages.
""")

    # ═════════════════════════════════════════════════════════════════════════
    # SLIDE 5: SUB-MERCHANT / SPLIT SETTLEMENT ARCHITECTURE
    # ═════════════════════════════════════════════════════════════════════════
    slide4 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide4)
    add_chrome(slide4, "Marketplace Payouts: Automated Sub-Merchant Settlement Model", "Settlement Architecture", 5)

    c1 = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x, top_y, card_w, card_h)
    c1.fill.solid()
    c1.fill.fore_color.rgb = COLOR_CARD_WHITE
    c1.line.color.rgb = COLOR_BORDER
    c1.line.width = Pt(1)

    hdr1 = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x, top_y, card_w, Inches(0.55))
    hdr1.fill.solid()
    hdr1.fill.fore_color.rgb = COLOR_BLUE_TINT
    hdr1.line.color.rgb = COLOR_BORDER
    p = hdr1.text_frame.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.text = "1. CLINIC ONBOARDING & SUB-MID"
    p.font.name = FONT_NAME
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_BLUE

    tf1 = slide4.shapes.add_textbox(start_x + Inches(0.2), top_y + Inches(0.65), card_w - Inches(0.4), card_h - Inches(0.8)).text_frame
    tf1.word_wrap = True
    populate_card_text(tf1, """
• **Paperless Clinic Onboarding**:
  Clinaza collects clinic GST, PAN, Drug License/Degree, and verified cancelled cheque.
• **Automated Sub-MID Creation**:
  PhonePe Marketplace APIs create dedicated child / sub-MIDs linked to the partner clinic's verified current account.
• **Zero Manual Bank Reconciliations**:
  Each clinic operates under an isolated settlement ledger for clear auditing.
• **Strict Compliance**:
  Meets RBI aggregator directives ensuring end merchant traceability.
""")

    c2 = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x + card_w + gap, top_y, card_w, card_h)
    c2.fill.solid()
    c2.fill.fore_color.rgb = COLOR_CARD_WHITE
    c2.line.color.rgb = COLOR_BORDER
    c2.line.width = Pt(1)

    hdr2 = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x + card_w + gap, top_y, card_w, Inches(0.55))
    hdr2.fill.solid()
    hdr2.fill.fore_color.rgb = COLOR_PHONEPE_TINT
    hdr2.line.color.rgb = COLOR_BORDER
    p = hdr2.text_frame.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.text = "2. REAL-TIME SPLIT PAYOUTS"
    p.font.name = FONT_NAME
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_PHONEPE_DARK

    tf2 = slide4.shapes.add_textbox(start_x + card_w + gap + Inches(0.2), top_y + Inches(0.65), card_w - Inches(0.4), card_h - Inches(0.8)).text_frame
    tf2.word_wrap = True
    populate_card_text(tf2, """
• **Transaction Example**:
  Patient completes an EMI / payment swipe for a dental procedure at clinic checkout.
• **Direct Clinic Settlement (T+1)**:
  Net procedure amount disburses directly to the partner clinic's registered current account.
• **Clinaza Platform Commission**:
  Platform commission / SaaS facilitation fee is routed dynamically based on mutual agreement.
• **Zero Co-mingling of Funds**:
  Patient funds bypass platform escrow, ensuring clean regulatory pass-through and audit trails.
""")

    c3 = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x + (card_w + gap)*2, top_y, card_w, card_h)
    c3.fill.solid()
    c3.fill.fore_color.rgb = COLOR_CARD_WHITE
    c3.line.color.rgb = COLOR_BORDER
    c3.line.width = Pt(1)

    hdr3 = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x + (card_w + gap)*2, top_y, card_w, Inches(0.55))
    hdr3.fill.solid()
    hdr3.fill.fore_color.rgb = COLOR_TEAL_TINT
    hdr3.line.color.rgb = COLOR_BORDER
    p = hdr3.text_frame.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.text = "3. FINANCIAL CONTROLS & REFUNDS"
    p.font.name = FONT_NAME
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_TEAL

    tf3 = slide4.shapes.add_textbox(start_x + (card_w + gap)*2 + Inches(0.2), top_y + Inches(0.65), card_w - Inches(0.4), card_h - Inches(0.8)).text_frame
    tf3.word_wrap = True
    populate_card_text(tf3, """
• **Dispute & Refund Safeguards**:
  Medical procedures completed prior to disbursal require OTP validation.
• **Automated Invoicing & GST**:
  Platform generates automated GST tax invoices for doctor platform commissions.
• **Instant Webhook Reconciliation**:
  Clinaza CRM records payment status in real time on the patient's dental timeline.
• **Audit Ready Reporting**:
  Monthly reconciliation sheets downloadable for doctor CA filing.
""")

    # ═════════════════════════════════════════════════════════════════════════
    # SLIDE 6: DENTAL PROCEDURES & TICKET SIZES
    # ═════════════════════════════════════════════════════════════════════════
    slide5 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide5)
    add_chrome(slide5, "High-Ticket Healthcare Catalogue: Procedures & Average Ticket Sizes", "Treatment Mix", 6)

    t_top = Inches(1.65)
    t_left = Inches(0.8)
    t_width = Inches(11.733)
    t_height = Inches(4.9)

    rows, cols = 7, 5
    table_shape = slide5.shapes.add_table(rows, cols, t_left, t_top, t_width, t_height)
    t = table_shape.table

    col_widths = [Inches(2.8), Inches(2.2), Inches(2.2), Inches(2.3), Inches(2.233)]
    for i, w in enumerate(col_widths):
        t.columns[i].width = w

    headers = ["Treatment Category", "Procedure Scope", "Avg. Ticket Size", "Preferred Tenure", "Expected Conversion"]
    for i, h in enumerate(headers):
        cell = t.cell(0, i)
        cell.fill.solid()
        cell.fill.fore_color.rgb = COLOR_NAVY
        p = cell.text_frame.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        p.text = h
        p.font.name = FONT_NAME
        p.font.size = Pt(10.5)
        p.font.bold = True
        p.font.color.rgb = COLOR_WHITE

    treatment_data = [
        ("Dental Implants", "Single / Multiple Implants (Titanium)", "₹30,000 – ₹75,000", "6 – 12 Months", "42% with EMI"),
        ("Clear Invisible Aligners", "Mild to Complex Orthodontics", "₹45,000 – ₹1,80,000", "12 – 24 Months", "58% with EMI"),
        ("Full Mouth Rehabilitation", "All-on-4 / All-on-6 Implant Arches", "₹1,50,000 – ₹3,50,000", "18 – 24 Months", "35% with EMI"),
        ("Zirconia Crowns & Bridges", "Full Aesthetic Restorations", "₹20,000 – ₹50,000", "3 – 6 Months", "48% with EMI"),
        ("Surgical Orthodontics", "Impacted Molars & Orthognathic", "₹25,000 – ₹60,000", "6 – 12 Months", "38% with EMI"),
        ("Aesthetic Smile Makeover", "Porcelain Veneers & Gum Contouring", "₹40,000 – ₹1,20,000", "9 – 18 Months", "45% with EMI")
    ]

    for row_idx, data in enumerate(treatment_data, start=1):
        bg_col = COLOR_CARD_WHITE if row_idx % 2 != 0 else COLOR_CARD_TINT
        for col_idx, val in enumerate(data):
            cell = t.cell(row_idx, col_idx)
            cell.fill.solid()
            cell.fill.fore_color.rgb = bg_col
            p = cell.text_frame.paragraphs[0]
            p.text = val
            p.font.name = FONT_NAME
            p.font.size = Pt(10)
            if col_idx == 0:
                p.font.bold = True
                p.font.color.rgb = COLOR_NAVY
                p.alignment = PP_ALIGN.LEFT
            elif col_idx in [2, 4]:
                p.font.bold = True
                p.font.color.rgb = COLOR_PHONEPE_DARK if col_idx == 4 else COLOR_BLUE
                p.alignment = PP_ALIGN.CENTER
            else:
                p.font.color.rgb = COLOR_TEXT_SECONDARY
                p.alignment = PP_ALIGN.CENTER

    # ═════════════════════════════════════════════════════════════════════════
    # SLIDE 7: 12-MONTH VOLUME PROJECTION FOR PAYU
    # ═════════════════════════════════════════════════════════════════════════
    slide6 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide6)
    add_chrome(slide6, "Scale & Throughput: 12-Month GMV & Processing Growth Trajectory", "Volume Roadmap", 7)

    box_w = Inches(2.78)
    box_gap = Inches(0.2)
    b_top = Inches(1.6)
    b_h = Inches(1.2)

    kpis = [
        ("TARGET PIPELINE", "25 Accredited Clinic Cohort", COLOR_NAVY),
        ("₹20L – ₹30L / MO", "Phase 1 Run-Rate (30–50 Loans)", COLOR_BLUE),
        ("₹1.5 CR – ₹2.5 CR", "Phase 3 Monthly GMV", COLOR_PHONEPE_DARK),
        ("₹15+ CR", "Year 1 Annualized Throughput", COLOR_TEAL)
    ]

    for i, (val, lbl, col) in enumerate(kpis):
        bx = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x + (box_w + box_gap)*i, b_top, box_w, b_h)
        bx.fill.solid()
        bx.fill.fore_color.rgb = COLOR_CARD_WHITE
        bx.line.color.rgb = COLOR_BORDER
        bx.line.width = Pt(1)
        
        btf = bx.text_frame
        btf.margin_top = Pt(12)
        p = btf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        p.text = val
        p.font.name = FONT_NAME
        p.font.size = Pt(18)
        p.font.bold = True
        p.font.color.rgb = col
        
        p2 = btf.add_paragraph()
        p2.alignment = PP_ALIGN.CENTER
        p2.text = lbl
        p2.font.name = FONT_NAME
        p2.font.size = Pt(9.5)
        p2.font.color.rgb = COLOR_TEXT_MUTED
        p2.space_before = Pt(2)

    t_top2 = Inches(3.0)
    t_height2 = Inches(3.6)
    table_shape2 = slide6.shapes.add_table(5, 5, t_left, t_top2, t_width, t_height2)
    t2 = table_shape2.table

    for i, w in enumerate(col_widths):
        t2.columns[i].width = w

    headers2 = ["Phase / Timeline", "Target Clinics", "Monthly Transactions", "Avg. Ticket Size", "Monthly GMV Throughput"]
    for i, h in enumerate(headers2):
        cell = t2.cell(0, i)
        cell.fill.solid()
        cell.fill.fore_color.rgb = COLOR_NAVY
        p = cell.text_frame.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        p.text = h
        p.font.name = FONT_NAME
        p.font.size = Pt(10.5)
        p.font.bold = True
        p.font.color.rgb = COLOR_WHITE

    projection_data = [
        ("Phase 1 (Months 1–3)", "10–15 Focus Pilot Clinics", "30 – 50 Loans / mo", "₹55,000", "₹16.5 Lakhs – ₹27.5 Lakhs / mo"),
        ("Phase 2 (Months 4–6)", "35–50 Accredited Clinics", "120 – 180 Loans / mo", "₹58,000", "₹70 Lakhs – ₹1.05 Cr / mo"),
        ("Phase 3 (Months 7–9)", "80–100 Multi-Specialty Clinics", "300 – 450 Loans / mo", "₹60,000", "₹1.80 Cr – ₹2.70 Cr / mo"),
        ("Phase 4 (Months 10–12)", "150–200 Clinics (Pan-India)", "600 – 900 Loans / mo", "₹65,000", "₹3.90 Cr – ₹5.85 Cr / mo")
    ]

    for row_idx, data in enumerate(projection_data, start=1):
        bg_col = COLOR_CARD_WHITE if row_idx % 2 != 0 else COLOR_CARD_TINT
        for col_idx, val in enumerate(data):
            cell = t2.cell(row_idx, col_idx)
            cell.fill.solid()
            cell.fill.fore_color.rgb = bg_col
            p = cell.text_frame.paragraphs[0]
            p.text = val
            p.font.name = FONT_NAME
            p.font.size = Pt(10)
            if col_idx == 0:
                p.font.bold = True
                p.font.color.rgb = COLOR_NAVY
                p.alignment = PP_ALIGN.LEFT
            elif col_idx == 4:
                p.font.bold = True
                p.font.color.rgb = COLOR_PHONEPE_DARK
                p.alignment = PP_ALIGN.CENTER
            else:
                p.font.color.rgb = COLOR_TEXT_SECONDARY
                p.alignment = PP_ALIGN.CENTER

    # ═════════════════════════════════════════════════════════════════════════
    # SLIDE 8: PARTNER PIPELINE (PART 1: CLINICS 1 TO 13)
    # ═════════════════════════════════════════════════════════════════════════
    slide7 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide7)
    add_chrome(slide7, "Partner Pipeline: Verified Merchant Clinics (Batch 1 of 2 — 13 Clinics)", "Merchant Network", 8)

    # 13 clinics table
    t_top7 = Inches(1.52)
    t_h7 = Inches(5.2)
    t_shape7 = slide7.shapes.add_table(14, 7, t_left, t_top7, t_width, t_h7)
    t7 = t_shape7.table

    widths7 = [Inches(2.7), Inches(1.9), Inches(1.7), Inches(1.0), Inches(1.4), Inches(1.3), Inches(1.733)]
    for i, w in enumerate(widths7):
        t7.columns[i].width = w

    headers7 = ["Clinic Name", "Lead Doctor / Founder", "City & State", "Chairs", "Avg. Ticket", "Exp. Volume", "Procedure Focus"]
    for i, h in enumerate(headers7):
        cell = t7.cell(0, i)
        cell.fill.solid()
        cell.fill.fore_color.rgb = COLOR_NAVY
        p = cell.text_frame.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        p.text = h
        p.font.name = FONT_NAME
        p.font.size = Pt(9.5)
        p.font.bold = True
        p.font.color.rgb = COLOR_WHITE

    batch1 = ALL_PIPELINE_CLINICS[:13]
    for row_idx, r in enumerate(batch1, start=1):
        bg_col = COLOR_CARD_WHITE if row_idx % 2 != 0 else COLOR_CARD_TINT
        row_vals = [r['clinic_name'], r['doctor_name'] or 'Chief Dental Surgeon', r['city'], r['chairs'], r['ticket'], r['loans'], r['focus']]
        for col_idx, val in enumerate(row_vals):
            cell = t7.cell(row_idx, col_idx)
            cell.fill.solid()
            cell.fill.fore_color.rgb = bg_col
            p = cell.text_frame.paragraphs[0]
            p.text = val
            p.font.name = FONT_NAME
            p.font.size = Pt(8.5)
            if col_idx == 0:
                p.font.bold = True
                p.font.color.rgb = COLOR_NAVY
                p.alignment = PP_ALIGN.LEFT
            elif col_idx == 1:
                p.font.bold = True
                p.font.color.rgb = COLOR_BLUE
                p.alignment = PP_ALIGN.LEFT
            elif col_idx == 4:
                p.font.bold = True
                p.font.color.rgb = COLOR_PHONEPE_DARK
                p.alignment = PP_ALIGN.CENTER
            elif col_idx == 5:
                p.font.bold = True
                p.font.color.rgb = COLOR_TEAL
                p.alignment = PP_ALIGN.CENTER
            else:
                p.font.color.rgb = COLOR_TEXT_SECONDARY
                p.alignment = PP_ALIGN.CENTER if col_idx in [2, 3] else PP_ALIGN.LEFT

    # ═════════════════════════════════════════════════════════════════════════
    # SLIDE 9: PARTNER PIPELINE (PART 2: CLINICS 14 TO 25)
    # ═════════════════════════════════════════════════════════════════════════
    slide8 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide8)
    add_chrome(slide8, "Partner Pipeline: Verified Merchant Clinics (Batch 2 of 2 — 12 Clinics)", "Merchant Network", 9)

    batch2 = ALL_PIPELINE_CLINICS[13:]
    t_shape8 = slide8.shapes.add_table(len(batch2) + 1, 7, t_left, t_top7, t_width, t_h7)
    t8 = t_shape8.table

    for i, w in enumerate(widths7):
        t8.columns[i].width = w

    for i, h in enumerate(headers7):
        cell = t8.cell(0, i)
        cell.fill.solid()
        cell.fill.fore_color.rgb = COLOR_NAVY
        p = cell.text_frame.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        p.text = h
        p.font.name = FONT_NAME
        p.font.size = Pt(9.5)
        p.font.bold = True
        p.font.color.rgb = COLOR_WHITE

    for row_idx, r in enumerate(batch2, start=1):
        bg_col = COLOR_CARD_WHITE if row_idx % 2 != 0 else COLOR_CARD_TINT
        row_vals = [r['clinic_name'], r['doctor_name'] or 'Chief Dental Surgeon', r['city'], r['chairs'], r['ticket'], r['loans'], r['focus']]
        for col_idx, val in enumerate(row_vals):
            cell = t8.cell(row_idx, col_idx)
            cell.fill.solid()
            cell.fill.fore_color.rgb = bg_col
            p = cell.text_frame.paragraphs[0]
            p.text = val
            p.font.name = FONT_NAME
            p.font.size = Pt(8.5)
            if col_idx == 0:
                p.font.bold = True
                p.font.color.rgb = COLOR_NAVY
                p.alignment = PP_ALIGN.LEFT
            elif col_idx == 1:
                p.font.bold = True
                p.font.color.rgb = COLOR_BLUE
                p.alignment = PP_ALIGN.LEFT
            elif col_idx == 4:
                p.font.bold = True
                p.font.color.rgb = COLOR_PHONEPE_DARK
                p.alignment = PP_ALIGN.CENTER
            elif col_idx == 5:
                p.font.bold = True
                p.font.color.rgb = COLOR_TEAL
                p.alignment = PP_ALIGN.CENTER
            else:
                p.font.color.rgb = COLOR_TEXT_SECONDARY
                p.alignment = PP_ALIGN.CENTER if col_idx in [2, 3] else PP_ALIGN.LEFT

    # ═════════════════════════════════════════════════════════════════════════
    # SLIDE 10: COMMERCIAL PROPOSAL & NEXT STEPS
    # ═════════════════════════════════════════════════════════════════════════
    slide9 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide9)
    add_chrome(slide9, "Partnership Roadmap: Technical Integration Scope & Next Steps", "Next Steps", 10)

    left_x = Inches(0.8)
    right_x = Inches(6.8)
    left_w = Inches(5.7)
    right_w = Inches(5.7)

    box_l9 = slide9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left_x, top_y, left_w, card_h)
    box_l9.fill.solid()
    box_l9.fill.fore_color.rgb = COLOR_CARD_WHITE
    box_l9.line.color.rgb = COLOR_BORDER
    box_l9.line.width = Pt(1)

    hl9 = slide9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left_x, top_y, left_w, Inches(0.55))
    hl9.fill.solid()
    hl9.fill.fore_color.rgb = COLOR_PHONEPE_TINT
    hl9.line.color.rgb = COLOR_BORDER
    p = hl9.text_frame.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.text = "PROPOSED INTEGRATION & COLLABORATION SCOPE"
    p.font.name = FONT_NAME
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_PHONEPE_DARK

    tfl9 = slide9.shapes.add_textbox(left_x + Inches(0.25), top_y + Inches(0.65), left_w - Inches(0.5), card_h - Inches(0.8)).text_frame
    tfl9.word_wrap = True
    populate_card_text(tfl9, """
• **Core Product Scope**:
  1. PhonePe Payment Gateway & Affordability Suite (Credit/Debit Card EMI) (Credit/Debit Card EMI).
  2. PhonePe Cardless EMI & Consumer Credit rails for non-cardholding patients.
  3. PhonePe Marketplace & Sub-Merchant Split Settlement APIs for Sub-MID direct clinic bank account disbursals.

• **Commercial Alignment**:
  • Commercial terms, MDR rates, and payout fees to be mutually aligned based on volume tiers and healthcare sector benchmarks.

• **Compliance & Operational Support**:
  • Zero credit liability to PhonePe: Clinaza performs preliminary practice verification and KYC documentation intake.
  • Strict Anti-Dormancy Safeguards: Ensuring high engagement and consistent transaction activity across active clinics.
""")

    box_r9 = slide9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, right_x, top_y, right_w, card_h)
    box_r9.fill.solid()
    box_r9.fill.fore_color.rgb = COLOR_CARD_WHITE
    box_r9.line.color.rgb = COLOR_BORDER
    box_r9.line.width = Pt(1)

    hr9 = slide9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, right_x, top_y, right_w, Inches(0.55))
    hr9.fill.solid()
    hr9.fill.fore_color.rgb = COLOR_BLUE_TINT
    hr9.line.color.rgb = COLOR_BORDER
    p = hr9.text_frame.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.text = "14-DAY INTEGRATION & GO-LIVE MILESTONES"
    p.font.name = FONT_NAME
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_BLUE

    tfr9 = slide9.shapes.add_textbox(right_x + Inches(0.25), top_y + Inches(0.65), right_w - Inches(0.5), card_h - Inches(0.8)).text_frame
    tfr9.word_wrap = True
    populate_card_text(tfr9, """
• **Day 1–3: Commercial Alignment**:
  Align on fee schedule, Sub-MID settlement mechanics, and formal agreement with PhonePe business team.

• **Day 4–7: Sandbox Integration**:
  Generate PhonePe test credentials, integrate Affordability widget and Split Settlement APIs in Clinaza staging.

• **Day 8–10: End-to-End Testing**:
  Validate EMI calculations, webhook callbacks, child MID settlements, and error fallbacks.

• **Day 11–14: Production Go-Live & Pilot Rollout**:
  Activate Master MID, initiate child MID setup for Phase 1 clinics, and deploy front-desk checkout links.

• **Contact Details**:
  **Pratyush Raj**, Founder — Clinaza Technologies
  📞 **+91 7292984244** | ✉️ **support@clinaza.in** | 🌐 **https://clinaza.in**
""")

    output_pptx = "Clinaza_PhonePe_Affordability_Healthcare_Proposal.pptx"
    prs.save(output_pptx)
    print(f"Presentation saved successfully as {output_pptx}")
    return output_pptx

if __name__ == "__main__":
    create_deck()
