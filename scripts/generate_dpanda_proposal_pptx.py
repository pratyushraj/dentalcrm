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

# ── Premium Swiss / DPanda Royal Blue & Navy Fintech Color Palette ──
COLOR_BG_PAGE = RGBColor(241, 245, 249)    # Slate-100 soft tinted canvas
COLOR_HEADER_NAVY = RGBColor(10, 25, 60)   # Deep Navy Header Bar
COLOR_NAVY = RGBColor(10, 25, 60)          # #0A193C Primary Navy
COLOR_NAVY_DARK = RGBColor(6, 16, 42)      # #06102A Cover Navy
COLOR_BLUE = RGBColor(10, 102, 235)        # #0A66EB Clinaza Electric Blue
COLOR_DPANDA_BLUE = RGBColor(26, 63, 218)  # #1A3FDA DPanda Brand Royal Blue
COLOR_DPANDA_LIGHT = RGBColor(59, 94, 248) # #3B5EF8 Secondary Accent
COLOR_TEAL = RGBColor(13, 148, 136)        # #0D9488 Medical Teal
COLOR_GREEN = RGBColor(16, 185, 129)       # #10B981 Prime Growth Green
COLOR_CARD_WHITE = RGBColor(255, 255, 255) # Pure Crisp White Card Surface
COLOR_CARD_TINT = RGBColor(248, 250, 252)  # Soft Slate 50
COLOR_TEAL_TINT = RGBColor(240, 253, 250)  # Soft Teal Tint
COLOR_BLUE_TINT = RGBColor(238, 242, 255)  # Soft Blue Tint
COLOR_DPANDA_TINT = RGBColor(238, 242, 255)# Soft DPanda Tint
COLOR_RED = RGBColor(225, 29, 72)          # Rose/Red for Incumbents
COLOR_ROSE_TINT = RGBColor(255, 241, 242)  # Soft Rose Tint
COLOR_BORDER = RGBColor(203, 213, 225)     # Crisp Slate-300 Border
COLOR_TEXT_PRIMARY = RGBColor(15, 23, 42)  # #0F172A Sharp Charcoal Text
COLOR_TEXT_SECONDARY = RGBColor(51, 65, 85) # #334155 Slate 700 Clear Reading Text
COLOR_TEXT_MUTED = RGBColor(100, 116, 139) # #64748B Secondary Text
COLOR_WHITE = RGBColor(255, 255, 255)

LOGO_PATH = os.path.abspath("public/assets/clinaza-logo.jpg")
DPANDA_LOGO_PATH = os.path.abspath("public/assets/dpanda_logo.png")
DPANDA_BANNER_PATH = os.path.abspath("public/assets/dpanda_banner_logo.png")

with open("scripts/pipeline_clinics_data.json") as f:
    ALL_PIPELINE_CLINICS = json.load(f)

TOTAL_PAGES = 10  # 10 slides total

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

        # Bottom accent stripe of header bar (DPanda Royal Blue)
        stripe = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, Inches(1.31), Inches(13.333), Inches(0.04))
        stripe.fill.solid()
        stripe.fill.fore_color.rgb = COLOR_DPANDA_BLUE
        stripe.line.color.rgb = COLOR_DPANDA_BLUE

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
        p.font.color.rgb = COLOR_DPANDA_BLUE

        # Main Slide Title
        p2 = tf.add_paragraph()
        p2.text = title_text
        p2.font.name = FONT_NAME
        p2.font.size = Pt(19)
        p2.font.bold = True
        p2.font.color.rgb = COLOR_NAVY
        p2.space_before = Pt(4)

        # Right Institutional Meta Box & DPanda Logo
        rx = slide.shapes.add_textbox(Inches(9.2), Inches(0.18), Inches(2.4), Inches(0.85))
        rf = rx.text_frame
        rf.word_wrap = True
        rf.margin_left = rf.margin_top = rf.margin_right = rf.margin_bottom = 0
        rp = rf.paragraphs[0]
        rp.alignment = PP_ALIGN.RIGHT
        rp.text = "DPANDA FASTEMI LOS"
        rp.font.name = FONT_NAME
        rp.font.size = Pt(9.5)
        rp.font.bold = True
        rp.font.color.rgb = COLOR_NAVY
        rp2 = rf.add_paragraph()
        rp2.alignment = PP_ALIGN.RIGHT
        rp2.text = "Cardless Healthcare EMI Rails"
        rp2.font.name = FONT_NAME
        rp2.font.size = Pt(8.5)
        rp2.font.color.rgb = COLOR_TEXT_MUTED
        rp2.space_before = Pt(2)

        if os.path.exists(DPANDA_LOGO_PATH):
            slide.shapes.add_picture(DPANDA_LOGO_PATH, Inches(11.85), Inches(0.25), height=Inches(0.72))

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
        fp.text = "CLINAZA TECHNOLOGIES  |  Live Partner Pipeline (clinaza.in/partner-pipeline) for DPanda FastEMI (los.dpanda.in)"
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

    def populate_card_text(tf, text_block, font_size=10.5, bold_size=11, space_after=4, line_spacing=1.15):
        lines = [line.strip() for line in text_block.strip().split("\n") if line.strip()]
        for i, line in enumerate(lines):
            p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
            p.word_wrap = True
            p.space_after = Pt(space_after)
            p.line_spacing = line_spacing
            
            parts = re.split(r'(\*\*.*?\*\*)', line)
            for part in parts:
                if not part:
                    continue
                run = p.add_run()
                run.font.name = FONT_NAME
                if part.startswith("**") and part.endswith("**"):
                    run.text = part[2:-2]
                    run.font.bold = True
                    run.font.size = Pt(bold_size)
                    run.font.color.rgb = COLOR_TEXT_PRIMARY
                else:
                    run.text = part
                    run.font.bold = False
                    run.font.size = Pt(font_size)
                    run.font.color.rgb = COLOR_TEXT_SECONDARY

    # ═════════════════════════════════════════════════════════════════════════
    # SLIDE 1: COVER
    # ═════════════════════════════════════════════════════════════════════════
    slide1 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide1, COLOR_NAVY_DARK)

    acc = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(0.12))
    acc.fill.solid()
    acc.fill.fore_color.rgb = COLOR_DPANDA_BLUE
    acc.line.color.rgb = COLOR_DPANDA_BLUE

    cover_box = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.2), Inches(0.9), Inches(10.933), Inches(5.7))
    cover_box.fill.solid()
    cover_box.fill.fore_color.rgb = RGBColor(12, 28, 68)
    cover_box.line.color.rgb = RGBColor(30, 58, 138)
    cover_box.line.width = Pt(1.5)

    if os.path.exists(LOGO_PATH):
        slide1.shapes.add_picture(LOGO_PATH, Inches(1.8), Inches(1.4), height=Inches(1.1))

    # White backing pill for DPanda logo on dark background
    pill = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(9.2), Inches(1.4), Inches(2.4), Inches(1.1))
    pill.fill.solid()
    pill.fill.fore_color.rgb = COLOR_WHITE
    pill.line.color.rgb = COLOR_DPANDA_BLUE
    pill.line.width = Pt(1.5)
    if os.path.exists(DPANDA_LOGO_PATH):
        slide1.shapes.add_picture(DPANDA_LOGO_PATH, Inches(9.45), Inches(1.55), height=Inches(0.80))
    elif os.path.exists(DPANDA_BANNER_PATH):
        slide1.shapes.add_picture(DPANDA_BANNER_PATH, Inches(9.3), Inches(1.55), width=Inches(2.2))

    badge = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(3.2), Inches(1.6), Inches(5.6), Inches(0.48))
    badge.fill.solid()
    badge.fill.fore_color.rgb = RGBColor(20, 45, 100)
    badge.line.color.rgb = COLOR_DPANDA_BLUE
    badge.line.width = Pt(1.2)
    btf = badge.text_frame
    btf.margin_top = Pt(4)
    bp = btf.paragraphs[0]
    bp.alignment = PP_ALIGN.CENTER
    bp.text = "CLINAZA × DPANDA FASTEMI (LOS.DPANDA.IN)"
    bp.font.name = FONT_NAME
    bp.font.size = Pt(11)
    bp.font.bold = True
    bp.font.color.rgb = COLOR_WHITE

    tx = slide1.shapes.add_textbox(Inches(1.8), Inches(2.7), Inches(9.8), Inches(2.6))
    tf = tx.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "Powering In-Clinic Cardless EMIs Across Outpatient Healthcare"
    p.font.name = FONT_NAME
    p.font.size = Pt(28)
    p.font.bold = True
    p.font.color.rgb = COLOR_WHITE

    p2 = tf.add_paragraph()
    p2.text = "Connecting DPanda's 11+ Cardless EMI Lending Rails (HDFC, ICICI, LazyPay, Snapmint, InstaCred, IDFC First) to Clinaza's Accredited Network of Dental, IVF & Surgical Clinics"
    p2.font.name = FONT_NAME
    p2.font.size = Pt(13.5)
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
    mp1.text = "Prepared For: DPanda FastEMI Partnerships Team (los.dpanda.in/pages/cardless-emi.html)"
    mp1.font.name = FONT_NAME
    mp1.font.size = Pt(10.5)
    mp1.font.bold = True
    mp1.font.color.rgb = COLOR_WHITE

    mp2 = mtf.add_paragraph()
    mp2.text = "Originator: Pratyush Raj, Founder — Clinaza Technologies (support@clinaza.in | +91 7292984244 | clinaza.in)"
    mp2.font.name = FONT_NAME
    mp2.font.size = Pt(9.5)
    mp2.font.color.rgb = RGBColor(190, 215, 255)
    mp2.space_before = Pt(2)

    # ═════════════════════════════════════════════════════════════════════════
    # SLIDE 2: EXECUTIVE SUMMARY
    # ═════════════════════════════════════════════════════════════════════════
    slide2 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide2)
    add_chrome(slide2, "Executive Summary: The Healthcare Affordability Gap & DPanda Synergy", "Market Context", 2)

    start_x = Inches(0.8)
    top_y = Inches(1.55)
    card_w = Inches(3.75)
    card_h = Inches(5.15)
    gap = Inches(0.24)

    # Column 1: Unmet Market Pain
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
• **High Drop-Off at Checkout**: 40%+ of dental, IVF, and cosmetic patients defer or abandon high-ticket treatment estimates (₹35,000–₹2,50,000) due to upfront cost shock.
• **The 400M No-Credit-Card Reality**: Less than 8% of Indians own a credit card. Traditional card EMI fails to serve the vast majority of outpatient clinic walk-ins.
• **Private Insurance Exclusions**: OPD dental, fertility, and elective day-care procedures are almost universally excluded from retail health insurance in India.
• **Clinic Bad Debt**: Clinics are forced into risky informal credit (*khata*), causing cash-flow bottlenecks and unrecovered bills.
""")

    # Column 2: Clinaza Point-of-Care Model
    c2 = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x + card_w + gap, top_y, card_w, card_h)
    c2.fill.solid()
    c2.fill.fore_color.rgb = COLOR_CARD_WHITE
    c2.line.color.rgb = COLOR_DPANDA_BLUE
    c2.line.width = Pt(1.5)

    hdr2 = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x + card_w + gap, top_y, card_w, Inches(0.55))
    hdr2.fill.solid()
    hdr2.fill.fore_color.rgb = COLOR_DPANDA_TINT
    hdr2.line.color.rgb = COLOR_BORDER
    p = hdr2.text_frame.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.text = "2. CLINAZA POINT-OF-CARE EMI"
    p.font.name = FONT_NAME
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_DPANDA_BLUE

    tf2 = slide2.shapes.add_textbox(start_x + card_w + gap + Inches(0.2), top_y + Inches(0.65), card_w - Inches(0.4), card_h - Inches(0.8)).text_frame
    tf2.word_wrap = True
    populate_card_text(tf2, """
• **Chairside Point-of-Care Conversion**: Front desk enters treatment quote into Clinaza Desk or triggers instant payment link via WhatsApp.
• **Paperless Instant Flow**: Patient scans clinic QR, enters Aadhaar & PAN, and receives multi-lender approval in 60 seconds with zero paperwork.
• **Direct Lump-Sum Payout**: Full procedure cost is disbursed directly into the doctor's bank account upfront; doctor takes zero default liability.
• **Proven Uplift**: Converts 35–45% of patients who would otherwise delay or reject surgical implants, aligners, or IVF cycles.
""")

    # Column 3: DPanda Synergy
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
    p.text = "3. DPANDA FASTEMI SYNERGY"
    p.font.name = FONT_NAME
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_TEAL

    tf3 = slide2.shapes.add_textbox(start_x + (card_w + gap)*2 + Inches(0.2), top_y + Inches(0.65), card_w - Inches(0.4), card_h - Inches(0.8)).text_frame
    tf3.word_wrap = True
    populate_card_text(tf3, """
• **11+ Cardless Lending Partners**: Pre-approved access across HDFC, ICICI, LazyPay, Snapmint, InstaCred, IDFC First EasyBuy, and Axio in a single QR.
• **Zero Credit Card Prerequisite**: Enables instant medical loans for salaried, self-employed, and first-time borrowers without a physical card.
• **High Healthcare Ticket Size**: Healthcare tickets (₹45,000–₹1,50,000) deliver 4x–8x higher average ticket value than retail consumer electronics.
• **High Quality, In-Person Verification**: In-person clinical consults with doctor-certified prescriptions and signed treatment consent eliminate fraudulent borrower risk.
""")

    # ═════════════════════════════════════════════════════════════════════════
    # SLIDE 3: COMPETITIVE LANDSCAPE
    # ═════════════════════════════════════════════════════════════════════════
    slide3_comp = prs.slides.add_slide(blank_layout)
    set_slide_background(slide3_comp)
    add_chrome(slide3_comp, "Competitive Landscape: Incumbents vs Clinaza × DPanda Distribution", "Market Positioning", 3)

    c_w = Inches(3.75)
    c_gap = Inches(0.24)
    c_y = Inches(1.55)
    c_h = Inches(4.7)

    # Card 1: Incumbents
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

    comp_logos = [("savein", 0, 0), ("carepay", 1, 0), ("fibe", 0, 1), ("bajaj", 1, 1)]
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
• **Focus Only on Luxury Corporate Chains**: Incumbents (Fibe, Bajaj, SaveIN, CarePay) focus almost exclusively on luxury corporate chains (Clove, Apollo White).
• **Vast Standalone Market Left Behind**: Over 90% of independent dental practices and OPD centres are completely ignored by incumbents.
• **High Field-Sales Overhead**: Incumbents rely on physical branch agents and costly on-ground reps, making standalone clinic acquisition uneconomical for them.
""")

    # Card 2: Clinaza Reach
    b2 = slide3_comp.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x + c_w + c_gap, c_y, c_w, c_h)
    b2.fill.solid()
    b2.fill.fore_color.rgb = COLOR_CARD_WHITE
    b2.line.color.rgb = COLOR_DPANDA_BLUE
    b2.line.width = Pt(1.5)

    h2 = slide3_comp.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x + c_w + c_gap, c_y, c_w, Inches(0.55))
    h2.fill.solid()
    h2.fill.fore_color.rgb = COLOR_DPANDA_TINT
    h2.line.color.rgb = COLOR_BORDER
    hp2 = h2.text_frame.paragraphs[0]
    hp2.alignment = PP_ALIGN.CENTER
    hp2.text = "CLINAZA CLINIC REACH"
    hp2.font.name = FONT_NAME
    hp2.font.size = Pt(11)
    hp2.font.bold = True
    hp2.font.color.rgb = COLOR_DPANDA_BLUE

    tfc2 = slide3_comp.shapes.add_textbox(start_x + c_w + c_gap + Inches(0.2), c_y + Inches(0.65), c_w - Inches(0.4), c_h - Inches(0.8)).text_frame
    tfc2.word_wrap = True
    populate_card_text(tfc2, """
• **Direct Standalone Clinic Onboarding**: Clinaza onboards independent, standalone dental and specialty clinics that urgently need patient financing.
• **Frictionless Front-Desk Checkout**: Doctors and front desks don't need complex software; patients get instant EMI links or QR codes.
• **Direct Doctor Relationship**: Direct doctor buy-in with zero corporate chain approvals or hospital committee bureaucracy.
• **Zero Clinic Credit Risk**: Partner clinics receive full procedure settlements while regulated lenders absorb borrower risk.
""")

    # Card 3: DPanda Advantage
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
    hp3.text = "THE DPANDA FASTEMI ADVANTAGE"
    hp3.font.name = FONT_NAME
    hp3.font.size = Pt(11)
    hp3.font.bold = True
    hp3.font.color.rgb = COLOR_BLUE

    tfc3 = slide3_comp.shapes.add_textbox(start_x + (c_w + c_gap)*2 + Inches(0.2), c_y + Inches(0.65), c_w - Inches(0.4), c_h - Inches(0.8)).text_frame
    tfc3.word_wrap = True
    populate_card_text(tfc3, """
• **Unrivalled Cardless Coverage**: 11+ top lenders including HDFC, ICICI, LazyPay, Snapmint, InstaCred, IDFC First EasyBuy, and Axio.
• **Multi-Lender Fallback Engine**: Cascading bureau checks across all cardless lenders ensure industry-leading approval rates in under 60 seconds.
• **Automated Sub-MID Architecture**: Automated split routing settles net amounts directly to doctor current accounts.
• **Market Capture**: Together, DPanda and Clinaza unlock high-margin healthcare GTV that competitors completely miss.
""")

    # Bottom takeaway strip
    t_bar = slide3_comp.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(6.32), Inches(11.733), Inches(0.46))
    t_bar.fill.solid()
    t_bar.fill.fore_color.rgb = COLOR_NAVY
    t_bar.line.color.rgb = COLOR_NAVY
    t_tf = t_bar.text_frame
    t_tf.margin_top = t_tf.margin_bottom = t_tf.margin_left = t_tf.margin_right = 0
    tp = t_tf.paragraphs[0]
    tp.alignment = PP_ALIGN.CENTER
    tp.text = "Strategic Edge: While Fibe, Bajaj & SaveIN operate as single-app lenders, Clinaza embeds DPanda's multi-lender LOS directly inside clinic workflows."
    tp.font.name = FONT_NAME
    tp.font.size = Pt(10)
    tp.font.bold = True
    tp.font.color.rgb = COLOR_WHITE

    # ═════════════════════════════════════════════════════════════════════════
    # SLIDE 4: TECHNICAL ARCHITECTURE & JOURNEY
    # ═════════════════════════════════════════════════════════════════════════
    slide4_arch = prs.slides.add_slide(blank_layout)
    set_slide_background(slide4_arch)
    add_chrome(slide4_arch, "Cardless Point-of-Care Patient Journey & DPanda LOS Integration", "Technical Architecture", 4)

    left_w = Inches(5.7)
    right_w = Inches(5.7)
    left_x = Inches(0.8)
    right_x = Inches(6.8)

    box_l = slide4_arch.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left_x, top_y, left_w, card_h)
    box_l.fill.solid()
    box_l.fill.fore_color.rgb = COLOR_CARD_WHITE
    box_l.line.color.rgb = COLOR_BORDER
    box_l.line.width = Pt(1)

    hl = slide4_arch.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left_x, top_y, left_w, Inches(0.55))
    hl.fill.solid()
    hl.fill.fore_color.rgb = COLOR_BLUE_TINT
    hl.line.color.rgb = COLOR_BORDER
    p = hl.text_frame.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.text = "POINT-OF-CARE CARDLESS EMI JOURNEY"
    p.font.name = FONT_NAME
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_BLUE

    tfl = slide4_arch.shapes.add_textbox(left_x + Inches(0.25), top_y + Inches(0.65), left_w - Inches(0.5), card_h - Inches(0.8)).text_frame
    tfl.word_wrap = True
    populate_card_text(tfl, """
• **Step 1: Clinical Diagnosis & Billing**:
  Doctor generates treatment estimate (e.g. ₹65,000 for 2 Dental Implants) via Clinaza EMR.

• **Step 2: Instant Front-Desk Trigger**:
  • Receptionist enters patient mobile number and procedure amount into Clinaza Desk.
  • Dynamic payment/EMI link triggered instantly via WhatsApp & SMS.

• **Step 3: Patient Scans / Opens DPanda FastEMI**:
  • Zero app download required; clean mobile web flow.
  • Patient enters Aadhaar OTP + PAN for instant verification.

• **Step 4: Real-Time Multi-Lender Bureau Check**:
  • DPanda LOS runs automated parallel check across 11+ lenders (HDFC, ICICI, LazyPay, Snapmint, InstaCred, IDFC First).
  • Patient selects best tenure (3, 6, 9, 12, 18, 24 months) and signs digitally.

• **Step 5: Direct Lump-Sum Settlement & Confirmation**:
  • Disbursal locks in seconds; funds route directly to the clinic's verified bank account via split payout. Treatment commences immediately.
""")

    box_r = slide4_arch.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, right_x, top_y, right_w, card_h)
    box_r.fill.solid()
    box_r.fill.fore_color.rgb = COLOR_CARD_WHITE
    box_r.line.color.rgb = COLOR_BORDER
    box_r.line.width = Pt(1)

    hr = slide4_arch.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, right_x, top_y, right_w, Inches(0.55))
    hr.fill.solid()
    hr.fill.fore_color.rgb = COLOR_DPANDA_TINT
    hr.line.color.rgb = COLOR_BORDER
    p = hr.text_frame.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.text = "DPANDA FASTEMI LENDER NETWORK"
    p.font.name = FONT_NAME
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_DPANDA_BLUE

    tfr = slide4_arch.shapes.add_textbox(right_x + Inches(0.25), top_y + Inches(0.65), right_w - Inches(0.5), card_h - Inches(0.8)).text_frame
    tfr.word_wrap = True
    populate_card_text(tfr, """
• **Multi-Lender Coverage on Single QR**:
  • **Banking Giants**: HDFC Bank Cardless EMI, ICICI Bank Cardless EMI.
  • **Digital NBFCs & BNPL**: LazyPay (up to ₹1L), Snapmint (No-Cost options), InstaCred (Aadhaar instant KYC).
  • **High-Limit Consumer Finance**: IDFC First EasyBuy (limits up to ₹5,00,000 for high-ticket surgeries & implants).

• **Cascading Approval Engine**:
  • If a patient's primary bank account lacks pre-approval, DPanda instantly evaluates secondary digital NBFCs.
  • Eliminates single-lender rejections chairside.

• **Down Payment + EMI Hybrid Option**:
  • Patient can pay 20–30% initial lab fee via UPI, and finance the balance seamlessly through DPanda Cardless EMI.
""")

    # ═════════════════════════════════════════════════════════════════════════
    # SLIDE 5: SETTLEMENT ARCHITECTURE
    # ═════════════════════════════════════════════════════════════════════════
    slide5_settle = prs.slides.add_slide(blank_layout)
    set_slide_background(slide5_settle)
    add_chrome(slide5_settle, "Settlement Architecture: Direct Payouts & Automated Split Models", "Settlement Architecture", 5)

    c1 = slide5_settle.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x, top_y, card_w, card_h)
    c1.fill.solid()
    c1.fill.fore_color.rgb = COLOR_CARD_WHITE
    c1.line.color.rgb = COLOR_BORDER
    c1.line.width = Pt(1)

    hdr1 = slide5_settle.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x, top_y, card_w, Inches(0.55))
    hdr1.fill.solid()
    hdr1.fill.fore_color.rgb = COLOR_BLUE_TINT
    hdr1.line.color.rgb = COLOR_BORDER
    p = hdr1.text_frame.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.text = "PHASE 1: DIRECT CLINIC SETTLEMENT"
    p.font.name = FONT_NAME
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_BLUE

    tf1 = slide5_settle.shapes.add_textbox(start_x + Inches(0.2), top_y + Inches(0.65), card_w - Inches(0.4), card_h - Inches(0.8)).text_frame
    tf1.word_wrap = True
    populate_card_text(tf1, """
• **100% Direct Clinic Settlement**:
  Disbursed loan funds settle directly into the clinic's registered business current account via standard T+1 cycles.

• **Clinaza Platform Fee Invoicing**:
  Clinaza raises a bi-weekly / monthly automated tax invoice to the clinic for platform facilitation fees.

• **Automated e-NACH / Auto-Debit Option**:
  Alternatively, clinic authorizes a monthly mandate/auto-debit (UPI Autopay / e-NACH) for platform charges, eliminating all manual payment delays.

• **Fastest Regulatory Onboarding**:
  Requires zero complex escrow/aggregator paperwork upfront, allowing immediate Day-1 go-live.
""")

    c2 = slide5_settle.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x + card_w + gap, top_y, card_w, card_h)
    c2.fill.solid()
    c2.fill.fore_color.rgb = COLOR_CARD_WHITE
    c2.line.color.rgb = COLOR_DPANDA_BLUE
    c2.line.width = Pt(1.5)

    hdr2 = slide5_settle.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x + card_w + gap, top_y, card_w, Inches(0.55))
    hdr2.fill.solid()
    hdr2.fill.fore_color.rgb = COLOR_DPANDA_TINT
    hdr2.line.color.rgb = COLOR_BORDER
    p = hdr2.text_frame.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.text = "PHASE 2: AUTOMATED SPLIT PAYOUTS"
    p.font.name = FONT_NAME
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_DPANDA_BLUE

    tf2 = slide5_settle.shapes.add_textbox(start_x + card_w + gap + Inches(0.2), top_y + Inches(0.65), card_w - Inches(0.4), card_h - Inches(0.8)).text_frame
    tf2.word_wrap = True
    populate_card_text(tf2, """
• **Volume-Triggered Migration**:
  Once network throughput crosses agreed transaction volume benchmarks, DPanda activates automated marketplace split payouts.

• **Real-Time Dynamic Split**:
  At loan sanction & disbursal, procedure funds split automatically:
  • **Net Treatment Amount** → Disbursed directly to clinic current account.
  • **Platform Facilitation Fee** → Routed to Clinaza Master account.

• **Zero Invoicing Overhead**:
  100% automated ledger reconciliation with zero post-facto billing or manual collection effort.
""")

    c3 = slide5_settle.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x + (card_w + gap)*2, top_y, card_w, card_h)
    c3.fill.solid()
    c3.fill.fore_color.rgb = COLOR_CARD_WHITE
    c3.line.color.rgb = COLOR_BORDER
    c3.line.width = Pt(1)

    hdr3 = slide5_settle.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x + (card_w + gap)*2, top_y, card_w, Inches(0.55))
    hdr3.fill.solid()
    hdr3.fill.fore_color.rgb = COLOR_TEAL_TINT
    hdr3.line.color.rgb = COLOR_BORDER
    p = hdr3.text_frame.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.text = "FINANCIAL AUDIT & REPORTING"
    p.font.name = FONT_NAME
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_TEAL

    tf3 = slide5_settle.shapes.add_textbox(start_x + (card_w + gap)*2 + Inches(0.2), top_y + Inches(0.65), card_w - Inches(0.4), card_h - Inches(0.8)).text_frame
    tf3.word_wrap = True
    populate_card_text(tf3, """
• **Instant Webhook Reconciliation**:
  Clinaza CRM records payment reference & UTR numbers in real time against the patient's medical timeline.

• **Automated Invoicing & GST Compliance**:
  System generates compliant B2B tax invoices with clear GST breakdowns for doctor accounting.

• **No Co-mingling of Funds**:
  Patient loan funds disburse directly to verified clinic bank accounts, fully complying with RBI digital lending guidelines.

• **Doctor CA-Ready Statements**:
  One-click monthly settlement and deduction reports downloadable from clinic portal.
""")

    # ═════════════════════════════════════════════════════════════════════════
    # SLIDE 6: HIGH-TICKET HEALTHCARE CATALOGUE
    # ═════════════════════════════════════════════════════════════════════════
    slide6_cat = prs.slides.add_slide(blank_layout)
    set_slide_background(slide6_cat)
    add_chrome(slide6_cat, "High-Ticket Healthcare Catalogue: Procedures & Average Ticket Sizes", "Treatment Mix", 6)

    t_left = Inches(0.8)
    t_top = Inches(1.55)
    t_width = Inches(11.733)
    t_height = Inches(5.1)

    table_shape = slide6_cat.shapes.add_table(7, 5, t_left, t_top, t_width, t_height)
    t = table_shape.table

    col_widths = [Inches(2.8), Inches(3.4), Inches(2.0), Inches(1.8), Inches(1.733)]
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

    cat_data = [
        ("Dental Implants", "Single / Multiple Implants (Titanium)", "₹30,000 – ₹75,000", "6 – 12 Months", "42% with Cardless EMI"),
        ("Clear Invisible Aligners", "Mild to Complex Orthodontics", "₹45,000 – ₹1,80,000", "12 – 24 Months", "58% with Cardless EMI"),
        ("Full Mouth Rehabilitation", "All-on-4 / All-on-6 Implant Arches", "₹1,50,000 – ₹3,50,000", "18 – 24 Months", "35% with Cardless EMI"),
        ("IVF & Fertility Cycles", "ICSI, Egg Retrieval & Embryo Transfer", "₹90,000 – ₹3,50,000", "12 – 24 Months", "52% with Cardless EMI"),
        ("Hair Transplant & Restoration", "FUE / DHI Hair Grafts (2,500 - 4,500)", "₹40,000 – ₹1,40,000", "6 – 18 Months", "48% with Cardless EMI"),
        ("Aesthetic Smile Makeover", "Porcelain Veneers & Gum Contouring", "₹40,000 – ₹1,20,000", "9 – 18 Months", "45% with Cardless EMI")
    ]

    for row_idx, data in enumerate(cat_data, start=1):
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
            elif col_idx == 2:
                p.font.bold = True
                p.font.color.rgb = COLOR_DPANDA_BLUE
                p.alignment = PP_ALIGN.CENTER
            elif col_idx == 4:
                p.font.bold = True
                p.font.color.rgb = COLOR_GREEN
                p.alignment = PP_ALIGN.CENTER
            else:
                p.font.color.rgb = COLOR_TEXT_SECONDARY
                p.alignment = PP_ALIGN.CENTER if col_idx == 3 else PP_ALIGN.LEFT

    # ═════════════════════════════════════════════════════════════════════════
    # SLIDE 7: VOLUME ROADMAP & PROJECTIONS
    # ═════════════════════════════════════════════════════════════════════════
    slide7_vol = prs.slides.add_slide(blank_layout)
    set_slide_background(slide7_vol)
    add_chrome(slide7_vol, "Scale & Throughput: 12-Month GMV & Cardless EMI Growth Trajectory", "Volume Roadmap", 7)

    box_w = Inches(2.7)
    box_gap = Inches(0.31)
    b_h = Inches(1.05)
    b_top = Inches(1.55)

    kpis = [
        ("25+ ACCREDITED", "Target Focus Pilot Clinics", COLOR_NAVY),
        ("₹25L – ₹40L / MO", "Phase 1 Run-Rate (40–60 Loans)", COLOR_DPANDA_BLUE),
        ("₹2.0 CR – ₹3.5 CR", "Phase 3 Monthly GMV", COLOR_GREEN),
        ("₹20+ CR", "Year 1 Annualized Throughput", COLOR_TEAL)
    ]

    for i, (val, lbl, col) in enumerate(kpis):
        bx = slide7_vol.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x + (box_w + box_gap)*i, b_top, box_w, b_h)
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

    t_top2 = Inches(2.9)
    t_height2 = Inches(3.7)
    table_shape2 = slide7_vol.shapes.add_table(5, 5, t_left, t_top2, t_width, t_height2)
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
        ("Phase 1 (Months 1–3)", "15–20 Focus Pilot Clinics", "40 – 60 Loans / mo", "₹58,000", "₹23.2 Lakhs – ₹34.8 Lakhs / mo"),
        ("Phase 2 (Months 4–6)", "45–60 Accredited Clinics", "150 – 220 Loans / mo", "₹60,000", "₹90 Lakhs – ₹1.32 Cr / mo"),
        ("Phase 3 (Months 7–9)", "100–140 Multi-Specialty Clinics", "400 – 600 Loans / mo", "₹62,000", "₹2.48 Cr – ₹3.72 Cr / mo"),
        ("Phase 4 (Months 10–12)", "200–300 Clinics (Pan-India)", "800 – 1,200 Loans / mo", "₹65,000", "₹5.20 Cr – ₹7.80 Cr / mo")
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
                p.font.color.rgb = COLOR_DPANDA_BLUE
                p.alignment = PP_ALIGN.CENTER
            else:
                p.font.color.rgb = COLOR_TEXT_SECONDARY
                p.alignment = PP_ALIGN.CENTER

    # ═════════════════════════════════════════════════════════════════════════
    # SLIDE 8: PARTNER PIPELINE (BATCH 1)
    # ═════════════════════════════════════════════════════════════════════════
    slide8_pip1 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide8_pip1)
    add_chrome(slide8_pip1, "Partner Pipeline: Verified Merchant Clinics (Batch 1 of 2 — 13 Clinics)", "Merchant Network", 8)

    t_top7 = Inches(1.52)
    t_h7 = Inches(5.2)
    t_shape7 = slide8_pip1.shapes.add_table(14, 7, t_left, t_top7, t_width, t_h7)
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
                p.font.color.rgb = COLOR_DPANDA_BLUE
                p.alignment = PP_ALIGN.CENTER
            elif col_idx == 5:
                p.font.bold = True
                p.font.color.rgb = COLOR_TEAL
                p.alignment = PP_ALIGN.CENTER
            else:
                p.font.color.rgb = COLOR_TEXT_SECONDARY
                p.alignment = PP_ALIGN.CENTER if col_idx in [2, 3] else PP_ALIGN.LEFT

    # ═════════════════════════════════════════════════════════════════════════
    # SLIDE 9: PARTNER PIPELINE (BATCH 2)
    # ═════════════════════════════════════════════════════════════════════════
    slide9_pip2 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide9_pip2)
    add_chrome(slide9_pip2, "Partner Pipeline: Verified Merchant Clinics (Batch 2 of 2 — 12 Clinics)", "Merchant Network", 9)

    batch2 = ALL_PIPELINE_CLINICS[13:]
    t_shape8 = slide9_pip2.shapes.add_table(len(batch2) + 1, 7, t_left, t_top7, t_width, t_h7)
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
                p.font.color.rgb = COLOR_DPANDA_BLUE
                p.alignment = PP_ALIGN.CENTER
            elif col_idx == 5:
                p.font.bold = True
                p.font.color.rgb = COLOR_TEAL
                p.alignment = PP_ALIGN.CENTER
            else:
                p.font.color.rgb = COLOR_TEXT_SECONDARY
                p.alignment = PP_ALIGN.CENTER if col_idx in [2, 3] else PP_ALIGN.LEFT

    # ═════════════════════════════════════════════════════════════════════════
    # SLIDE 10: PARTNERSHIP ROADMAP & NEXT STEPS
    # ═════════════════════════════════════════════════════════════════════════
    slide10_next = prs.slides.add_slide(blank_layout)
    set_slide_background(slide10_next)
    add_chrome(slide10_next, "Partnership Roadmap: Technical Integration Scope & Next Steps", "Next Steps", 10)

    left_x = Inches(0.8)
    right_x = Inches(6.8)
    left_w = Inches(5.7)
    right_w = Inches(5.7)

    box_l9 = slide10_next.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left_x, top_y, left_w, card_h)
    box_l9.fill.solid()
    box_l9.fill.fore_color.rgb = COLOR_CARD_WHITE
    box_l9.line.color.rgb = COLOR_BORDER
    box_l9.line.width = Pt(1)

    hl9 = slide10_next.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left_x, top_y, left_w, Inches(0.55))
    hl9.fill.solid()
    hl9.fill.fore_color.rgb = COLOR_DPANDA_TINT
    hl9.line.color.rgb = COLOR_BORDER
    p = hl9.text_frame.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.text = "PROPOSED INTEGRATION & COLLABORATION SCOPE"
    p.font.name = FONT_NAME
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_DPANDA_BLUE

    tfl9 = slide10_next.shapes.add_textbox(left_x + Inches(0.25), top_y + Inches(0.65), left_w - Inches(0.5), card_h - Inches(0.8)).text_frame
    tfl9.word_wrap = True
    populate_card_text(tfl9, """
• **Core Product Scope**:
  1. **DPanda FastEMI Widget / Dynamic Links**: Embedded into Clinaza front-desk checkout and WhatsApp payment links.
  2. **11+ Cardless Lending Partners**: Instant Aadhaar + PAN approval across HDFC, ICICI, LazyPay, Snapmint, InstaCred, and IDFC First.
  3. **Healthcare Ticket Sizing**: Enabling instant cardless credit lines from ₹15,000 up to ₹2,50,000 for surgeries, implants, and fertility treatments.
  4. **Phased Settlement Architecture**: 100% direct clinic account settlement in Phase 1, migrating to automated DPanda split payouts in Phase 2.

• **Commercial Alignment & ₹0 Onboarding**:
  • **₹0 Setup & Onboarding Fees**: Zero platform setup fee, zero annual maintenance charges (AMC), and zero sub-merchant registration fees for onboarding Clinaza partner clinics.
  • **Pure Success-Based Model**: Transparent subvention / MDR fee sharing aligned to healthcare volume benchmarks and loan ticket tiers.

• **Compliance & Operational Support**:
  • **Zero Credit Liability to DPanda**: 100% borrower risk borne by regulated banking & NBFC partners; Clinaza conducts doctor KYC and clinic authentication.
  • **Strict Verification Safeguards**: In-person clinical consults with doctor-certified prescriptions eliminate fraudulent merchant or borrower traffic.
""", font_size=9.5, bold_size=10.0, space_after=2.5, line_spacing=1.10)

    box_r9 = slide10_next.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, right_x, top_y, right_w, card_h)
    box_r9.fill.solid()
    box_r9.fill.fore_color.rgb = COLOR_CARD_WHITE
    box_r9.line.color.rgb = COLOR_BORDER
    box_r9.line.width = Pt(1)

    hr9 = slide10_next.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, right_x, top_y, right_w, Inches(0.55))
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

    tfr9 = slide10_next.shapes.add_textbox(right_x + Inches(0.25), top_y + Inches(0.65), right_w - Inches(0.5), card_h - Inches(0.8)).text_frame
    tfr9.word_wrap = True
    populate_card_text(tfr9, """
• **Day 1–3: Commercial & Scope Alignment**:
  Finalize commercial MDR/subvention terms, lender coverage, and partnership agreement.

• **Day 4–7: Sandbox Integration**:
  Generate DPanda FastEMI API credentials, integrate LOS widget and webhook listeners in Clinaza staging.

• **Day 8–10: End-to-End Testing**:
  Validate Aadhaar/PAN credit checks, loan sanction webhooks, and doctor payout reconciliation.

• **Day 11–14: Production Go-Live & Pilot Rollout**:
  Roll out DPanda FastEMI checkout QR codes and WhatsApp links across the initial cohort of 25 accredited clinics.

• **Contact Details**:
  **Pratyush Raj**, Founder — Clinaza Technologies
  📞 **+91 7292984244** | ✉️ **support@clinaza.in** | 🌐 **https://clinaza.in**
""")

    output_pptx = "Clinaza_DPanda_Cardless_EMI_Healthcare_Proposal.pptx"
    prs.save(output_pptx)
    print(f"Presentation saved successfully as {output_pptx}")
    return output_pptx

if __name__ == "__main__":
    create_deck()
