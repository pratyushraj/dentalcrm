import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
from pptx.dml.color import RGBColor

# ── Modern Typography ──
FONT_NAME = "Helvetica Neue"

# ── Premium Swiss / High-End Fintech Color Palette ──
COLOR_BG_PAGE = RGBColor(241, 245, 249)    # Slate-100 soft tinted canvas (makes pure white cards POP!)
COLOR_HEADER_NAVY = RGBColor(10, 25, 60)   # Deep Navy Header Bar
COLOR_NAVY = RGBColor(10, 25, 60)          # #0A193C Primary Navy
COLOR_NAVY_DARK = RGBColor(6, 16, 42)      # #06102A Cover Navy
COLOR_BLUE = RGBColor(10, 102, 235)        # #0A66EB Clinaza Electric Blue
COLOR_TEAL = RGBColor(13, 148, 136)        # #0D9488 Medical Teal
COLOR_GREEN = RGBColor(16, 185, 129)       # #10B981 Prime Growth Green
COLOR_RED = RGBColor(225, 29, 72)          # #E11D48 Rose / Crimson Red Accent
COLOR_CARD_WHITE = RGBColor(255, 255, 255) # Pure Crisp White Card Surface
COLOR_CARD_TINT = RGBColor(248, 250, 252)  # Soft Slate 50
COLOR_TEAL_TINT = RGBColor(240, 253, 250)  # Soft Teal Tint
COLOR_BLUE_TINT = RGBColor(238, 242, 255)  # Soft Blue Tint
COLOR_ROSE_TINT = RGBColor(255, 241, 242)  # Soft Rose Tint
COLOR_BORDER = RGBColor(203, 213, 225)     # Crisp Slate-300 Border (High Definition)
COLOR_BORDER_STRONG = RGBColor(148, 163, 184) # Slate-400 Strong Border
COLOR_GRID_LINE = RGBColor(226, 232, 240)  # Chart Grid Line
COLOR_TEXT_PRIMARY = RGBColor(15, 23, 42)  # #0F172A Sharp Charcoal Text
COLOR_TEXT_SECONDARY = RGBColor(51, 65, 85) # #334155 Slate 700 Clear Reading Text
COLOR_TEXT_MUTED = RGBColor(100, 116, 139) # #64748B Secondary Text
COLOR_WHITE = RGBColor(255, 255, 255)

LOGO_PATH = os.path.abspath("public/assets/clinaza-logo.jpg")

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

    def add_chrome(slide, title_text, category_badge, current_page, total_pages=7):
        # ── 1. Top Integrated Header Banner Bar ──
        head_banner = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(1.35))
        head_banner.fill.solid()
        head_banner.fill.fore_color.rgb = COLOR_CARD_WHITE
        head_banner.line.color.rgb = COLOR_BORDER
        head_banner.line.width = Pt(1)

        # Bottom accent stripe of header bar
        stripe = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, Inches(1.31), Inches(13.333), Inches(0.04))
        stripe.fill.solid()
        stripe.fill.fore_color.rgb = COLOR_BLUE
        stripe.line.color.rgb = COLOR_BLUE

        # Logo on Header
        if os.path.exists(LOGO_PATH):
            slide.shapes.add_picture(LOGO_PATH, Inches(0.8), Inches(0.25), height=Inches(0.80))

        # Title block: Category Tag + 1-Line Headline in single clean flow
        tx = slide.shapes.add_textbox(Inches(1.85), Inches(0.20), Inches(7.5), Inches(0.95))
        tf = tx.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        
        # Category Kicker Tag
        p = tf.paragraphs[0]
        p.text = f"{category_badge.upper()}  •  CLINAZA.IN"
        p.font.name = FONT_NAME
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = COLOR_BLUE

        # Main Slide Title (Crisp, High Contrast Navy)
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
        rp.text = "JUSPAY HYPERCREDIT PARTNERSHIP"
        rp.font.name = FONT_NAME
        rp.font.size = Pt(10)
        rp.font.bold = True
        rp.font.color.rgb = COLOR_NAVY
        rp2 = rf.add_paragraph()
        rp2.alignment = PP_ALIGN.RIGHT
        rp2.text = "Elective Healthcare Financing Brief"
        rp2.font.name = FONT_NAME
        rp2.font.size = Pt(9.5)
        rp2.font.color.rgb = COLOR_TEXT_MUTED
        rp2.space_before = Pt(2)

        # ── 2. Bottom Institutional Footer Bar ──
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
        fp.text = "CLINAZA × JUSPAY HYPERCREDIT  •  CONFIDENTIAL PARTNERSHIP PROPOSAL  •  2026"
        fp.font.name = FONT_NAME
        fp.font.size = Pt(9.5)
        fp.font.bold = False
        fp.font.color.rgb = COLOR_TEXT_MUTED

        px = slide.shapes.add_textbox(Inches(10.5), Inches(7.02), Inches(2.0), Inches(0.35))
        pf = px.text_frame
        pf.margin_left = pf.margin_top = pf.margin_right = pf.margin_bottom = 0
        pp = pf.paragraphs[0]
        pp.alignment = PP_ALIGN.RIGHT
        pp.text = f"{current_page} / {total_pages}"
        pp.font.name = FONT_NAME
        pp.font.size = Pt(10)
        pp.font.bold = True
        pp.font.color.rgb = COLOR_BLUE

    # ══════════════════════════════════════════════════════════════════
    # SLIDE 1: PROPER INSTITUTIONAL COVER
    # ══════════════════════════════════════════════════════════════════
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1, COLOR_NAVY_DARK)

    card_accent = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.7), Inches(11.733), Inches(6.1))
    card_accent.fill.solid()
    card_accent.fill.fore_color.rgb = COLOR_NAVY
    card_accent.line.color.rgb = COLOR_BLUE
    card_accent.line.width = Pt(1.5)

    if os.path.exists(LOGO_PATH):
        s1.shapes.add_picture(LOGO_PATH, Inches(1.3), Inches(1.15), height=Inches(1.05))

    tx = s1.shapes.add_textbox(Inches(1.3), Inches(2.3), Inches(10.5), Inches(2.4))
    tf = tx.text_frame
    tf.word_wrap = True
    
    p = tf.paragraphs[0]
    p.text = "CLINAZA × JUSPAY HYPERCREDIT"
    p.font.name = FONT_NAME
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = COLOR_BLUE
    
    p2 = tf.add_paragraph()
    p2.text = "Point-of-care financing for elective healthcare"
    p2.font.name = FONT_NAME
    p2.font.size = Pt(34)
    p2.font.bold = True
    p2.font.color.rgb = COLOR_WHITE
    p2.space_before = Pt(8)

    p3 = tf.add_paragraph()
    p3.text = "Starting with Dental  •  Expanding across elective healthcare"
    p3.font.name = FONT_NAME
    p3.font.size = Pt(16)
    p3.font.color.rgb = RGBColor(203, 213, 225)
    p3.space_before = Pt(10)

    # Workflow visual on cover: Patient -> Clinaza -> Juspay -> Lender -> Clinic
    flow_steps = ["Patient", "Clinaza", "Juspay HyperCredit", "Lending Partner", "Verified Clinic"]
    step_w = 1.9
    arrow_w = 0.4
    start_x = 1.3
    y_pos = 4.85

    for idx, step_name in enumerate(flow_steps):
        bx = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(start_x + idx * (step_w + arrow_w)), Inches(y_pos), Inches(step_w), Inches(0.75))
        bx.fill.solid()
        if step_name == "Clinaza":
            bx.fill.fore_color.rgb = COLOR_TEAL
            bx.line.color.rgb = COLOR_WHITE
        elif step_name == "Juspay HyperCredit":
            bx.fill.fore_color.rgb = COLOR_BLUE
            bx.line.color.rgb = COLOR_WHITE
        else:
            bx.fill.fore_color.rgb = COLOR_NAVY_DARK
            bx.line.color.rgb = COLOR_BORDER_STRONG
        bx.line.width = Pt(1.5)
        btf = bx.text_frame
        btf.margin_top = btf.margin_bottom = btf.margin_left = btf.margin_right = 0
        bp = btf.paragraphs[0]
        bp.alignment = PP_ALIGN.CENTER
        bp.text = step_name
        bp.font.name = FONT_NAME
        bp.font.size = Pt(11.5)
        bp.font.bold = True
        bp.font.color.rgb = COLOR_WHITE

        if idx < len(flow_steps) - 1:
            ax = s1.shapes.add_textbox(Inches(start_x + idx * (step_w + arrow_w) + step_w), Inches(y_pos + 0.15), Inches(arrow_w), Inches(0.45))
            atf = ax.text_frame
            atf.margin_top = atf.margin_bottom = atf.margin_left = atf.margin_right = 0
            ap = atf.paragraphs[0]
            ap.alignment = PP_ALIGN.CENTER
            ap.text = "→"
            ap.font.name = FONT_NAME
            ap.font.size = Pt(18)
            ap.font.bold = True
            ap.font.color.rgb = COLOR_BLUE

    cb = s1.shapes.add_textbox(Inches(1.3), Inches(6.0), Inches(10.5), Inches(0.4))
    cbtf = cb.text_frame
    cbtf.margin_top = cbtf.margin_bottom = cbtf.margin_left = cbtf.margin_right = 0
    cbp = cbtf.paragraphs[0]
    cbp.text = "CONFIDENTIAL PARTNERSHIP PROPOSAL  |  PREPARED FOR JUSPAY & INSTITUTIONAL NBFC PARTNERS"
    cbp.font.name = FONT_NAME
    cbp.font.size = Pt(10)
    cbp.font.color.rgb = COLOR_TEXT_MUTED

    # ══════════════════════════════════════════════════════════════════
    # SLIDE 2: MARKET OPPORTUNITY & FUNNEL CHART (Chart 1 of 2)
    # ══════════════════════════════════════════════════════════════════
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2)
    add_chrome(s2, "Macro Opportunity: Out-of-Pocket Healthcare & Market Funnel", "MACRO GAP & MARKET SIZE", 2)

    # Left Half: The Affordability Challenge & Ticket Breakdown (5.6" wide)
    l_card = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.45), Inches(5.6), Inches(4.65))
    l_card.fill.solid()
    l_card.fill.fore_color.rgb = COLOR_CARD_WHITE
    l_card.line.color.rgb = COLOR_BORDER
    l_card.line.width = Pt(1)

    l_bar = s2.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.45), Inches(5.6), Inches(0.06))
    l_bar.fill.solid()
    l_bar.fill.fore_color.rgb = COLOR_BLUE
    l_bar.line.color.rgb = COLOR_BLUE

    ltx = s2.shapes.add_textbox(Inches(1.15), Inches(1.72), Inches(4.9), Inches(4.2))
    ltf = ltx.text_frame
    ltf.word_wrap = True
    ltf.margin_left = ltf.margin_right = ltf.margin_top = ltf.margin_bottom = 0

    lp1 = ltf.paragraphs[0]
    lp1.text = "THE POINT-OF-CARE AFFORDABILITY GAP"
    lp1.font.name = FONT_NAME
    lp1.font.size = Pt(11)
    lp1.font.bold = True
    lp1.font.color.rgb = COLOR_BLUE

    lp2 = ltf.add_paragraph()
    lp2.text = "₹25,000 – ₹1,80,000"
    lp2.font.name = FONT_NAME
    lp2.font.size = Pt(28)
    lp2.font.bold = True
    lp2.font.color.rgb = COLOR_NAVY
    lp2.space_before = Pt(8)

    lp2_sub = ltf.add_paragraph()
    lp2_sub.text = "Typical upfront out-of-pocket ticket across elective specialties"
    lp2_sub.font.name = FONT_NAME
    lp2_sub.font.size = Pt(11)
    lp2_sub.font.bold = True
    lp2_sub.font.color.rgb = COLOR_TEXT_PRIMARY
    lp2_sub.space_before = Pt(6)

    lp3 = ltf.add_paragraph()
    lp3.text = "High-ticket elective procedures create a significant upfront affordability barrier for diagnosed patients. Standard retail Mediclaim excludes routine and planned elective care (OPD exclusions)."
    lp3.font.name = FONT_NAME
    lp3.font.size = Pt(11)
    lp3.font.color.rgb = COLOR_TEXT_SECONDARY
    lp3.space_before = Pt(16)
    lp3.line_spacing = 1.25

    lp4 = ltf.add_paragraph()
    lp4.text = "KEY ELECTIVE SPECIALTIES TARGETED:"
    lp4.font.name = FONT_NAME
    lp4.font.size = Pt(10.5)
    lp4.font.bold = True
    lp4.font.color.rgb = COLOR_NAVY
    lp4.space_before = Pt(18)

    specs = [
        ("Dental Care (Beachhead)", "Implants, Clear Aligners & Full-Mouth Rehab"),
        ("Aesthetics & Dermatology", "Hair Restoration, Acne & Skin Laser Plans"),
        ("Ophthalmology & Day-Care", "Refractive LASIK & Premium Lens Upgrades")
    ]
    for s_title, s_sub in specs:
        sp = ltf.add_paragraph()
        sp.text = f"• {s_title}: "
        sp.font.name = FONT_NAME
        sp.font.size = Pt(10.5)
        sp.font.bold = True
        sp.font.color.rgb = COLOR_TEAL
        sp.space_before = Pt(8)
        r = sp.add_run()
        r.text = s_sub
        r.font.bold = False
        r.font.color.rgb = COLOR_TEXT_SECONDARY

    # Right Half: VIBRANT COLOR-FILLED FUNNEL (5.8" wide)
    r_card = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.7), Inches(1.45), Inches(5.833), Inches(4.65))
    r_card.fill.solid()
    r_card.fill.fore_color.rgb = COLOR_CARD_WHITE
    r_card.line.color.rgb = COLOR_BORDER
    r_card.line.width = Pt(1)

    rtx = s2.shapes.add_textbox(Inches(6.95), Inches(1.68), Inches(5.3), Inches(0.4))
    rtf = rtx.text_frame
    rtf.margin_top = rtf.margin_bottom = rtf.margin_left = rtf.margin_right = 0
    rp1 = rtf.paragraphs[0]
    rp1.text = "MARKET OPPORTUNITY FUNNEL"
    rp1.font.name = FONT_NAME
    rp1.font.size = Pt(12)
    rp1.font.bold = True
    rp1.font.color.rgb = COLOR_NAVY

    funnel_stages = [
        ("TOTAL HEALTHCARE OOP", "₹6 Lakh Cr", "$72B National Out-of-Pocket Spend (>60% of total healthcare)", Inches(5.3), COLOR_NAVY, COLOR_WHITE),
        ("ELECTIVE SPECIALTIES*", "₹85,000 Cr", "Uninsured Elective Treatments (Dental, Derma, Hair, Day-Care)", Inches(4.4), COLOR_BLUE, COLOR_WHITE),
        ("DENTAL BEACHHEAD TAM", "₹26,500 Cr", "High-Ticket Oral Procedures (Clinaza Initial Focus)", Inches(3.5), COLOR_TEAL, COLOR_WHITE)
    ]

    center_x = 6.7 + 5.833 / 2.0
    f_y_starts = [2.2, 3.45, 4.7]
    f_height = 0.96

    for f_idx, (f_title, f_val, f_desc, f_width, f_fill_color, f_text_color) in enumerate(funnel_stages):
        cur_w_val = f_width.inches
        f_left = center_x - cur_w_val / 2.0
        f_y = f_y_starts[f_idx]

        fbx = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(f_left), Inches(f_y), f_width, Inches(f_height))
        fbx.fill.solid()
        fbx.fill.fore_color.rgb = f_fill_color
        fbx.line.color.rgb = f_fill_color

        ftx = s2.shapes.add_textbox(Inches(f_left + 0.15), Inches(f_y + 0.10), Inches(cur_w_val - 0.30), Inches(f_height - 0.20))
        ftf = ftx.text_frame
        ftf.word_wrap = True
        ftf.margin_top = ftf.margin_bottom = ftf.margin_left = ftf.margin_right = 0

        p1 = ftf.paragraphs[0]
        p1.text = f"{f_title}  •  "
        p1.font.name = FONT_NAME
        p1.font.size = Pt(10)
        p1.font.bold = True
        p1.font.color.rgb = RGBColor(224, 231, 255) if f_idx < 2 else RGBColor(204, 251, 241)

        p1_val = p1.add_run()
        p1_val.text = f_val
        p1_val.font.bold = True
        p1_val.font.size = Pt(14)
        p1_val.font.color.rgb = COLOR_WHITE

        p2 = ftf.add_paragraph()
        p2.text = f_desc
        p2.font.name = FONT_NAME
        p2.font.size = Pt(10)
        p2.font.color.rgb = RGBColor(241, 245, 249)
        p2.space_before = Pt(3)

        if f_idx < len(funnel_stages) - 1:
            arr_box = s2.shapes.add_textbox(Inches(center_x - 0.4), Inches(f_y + f_height), Inches(0.8), Inches(0.28))
            atf = arr_box.text_frame
            atf.margin_top = atf.margin_bottom = atf.margin_left = atf.margin_right = 0
            ap = atf.paragraphs[0]
            ap.alignment = PP_ALIGN.CENTER
            ap.text = "↓"
            ap.font.name = FONT_NAME
            ap.font.size = Pt(16)
            ap.font.bold = True
            ap.font.color.rgb = COLOR_BLUE

    # Takeaway Banner at bottom
    takeaway_box = s2.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(6.25), Inches(11.733), Inches(0.48))
    takeaway_box.fill.solid()
    takeaway_box.fill.fore_color.rgb = COLOR_NAVY
    takeaway_box.line.color.rgb = COLOR_NAVY
    t_tf = takeaway_box.text_frame
    t_tf.margin_top = t_tf.margin_bottom = t_tf.margin_left = t_tf.margin_right = 0
    tp = t_tf.paragraphs[0]
    tp.alignment = PP_ALIGN.CENTER
    tp.text = "Key Takeaway: A large portion of elective healthcare remains self-funded; point-of-care patient financing can help clinics improve affordability and reduce treatment deferral."
    tp.font.name = FONT_NAME
    tp.font.size = Pt(11)
    tp.font.bold = True
    tp.font.color.rgb = COLOR_WHITE

    # ══════════════════════════════════════════════════════════════════
    # SLIDE 3: CLINIC DISTRIBUTION STRATEGY: REDESIGNED WITH SOLID ACCENT HEADERS
    # ══════════════════════════════════════════════════════════════════
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3)
    add_chrome(s3, "Market Distribution: Unlocking the Standalone Clinic Ecosystem", "DISTRIBUTION STRATEGY & CLINIC MOAT", 3)

    strat_cards = [
        (
            "CORPORATE CHAINS",
            "The Incumbent Trap",
            "Where Competitors Fight",
            "INCUMBENT FOCUS",
            [
                ("Chasing High Margins", "Incumbents target corporate chains to capture high-margin cases with prime credit profiles for higher patient approval rates."),
                ("Aggressive Subvention", "Chains demand steep lender commissions and discounts, severely squeezing net margins."),
                ("Multi-App Desk Fatigue", "3–4 competing apps at one front desk create operator friction and leave 85%+ standalone practices untouched.")
            ],
            COLOR_RED,
            COLOR_CARD_WHITE,
            COLOR_ROSE_TINT
        ),
        (
            "STANDALONE PRACTICES",
            "Clinaza's Core Focus",
            "The Scalable Independent Majority",
            "PRIMARY MOAT",
            [
                ("Doctor is Decision-Maker", "Zero committee friction; instant onboarding and rapid clinic adoption."),
                ("Deep Conversion Need", "Independent doctors lose high-ticket cases daily; highly motivated to offer EMI."),
                ("Verified Clinic Distribution", "Direct clinic relationships and treatment-linked demand.")
            ],
            COLOR_TEAL,
            COLOR_TEAL_TINT,
            COLOR_TEAL_TINT
        ),
        (
            "SPECIALTY EXPANSION",
            "Horizontal Scalability",
            "The Multi-Clinic Pipeline",
            "EXPANSION VECTOR",
            [
                ("Dental (Beachhead)", "Extensive network of independent clinics; predominantly out-of-pocket; ticket ₹25K–₹1.5L."),
                ("Dermatology / Aesthetics", "Growing elective retail category; ticket ₹20K–₹85K; self-funded."),
                ("Ophthalmology & Day-Care", "High volume of premium lens & refractive surgeries; ticket ₹35K–₹1L.")
            ],
            COLOR_BLUE,
            COLOR_CARD_WHITE,
            COLOR_BLUE_TINT
        )
    ]

    card_w = 3.73
    gap = 0.27
    start_x = 0.8

    for idx, (head_tag, card_title, card_sub, badge_txt, items, c_accent, c_bg, c_top_fill) in enumerate(strat_cards):
        cx = start_x + idx * (card_w + gap)
        
        # 1. Main Container Card
        card = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(cx), Inches(1.45), Inches(card_w), Inches(4.65))
        card.fill.solid()
        card.fill.fore_color.rgb = c_bg
        card.line.color.rgb = c_accent if idx == 1 else COLOR_BORDER
        card.line.width = Pt(2.0 if idx == 1 else 1)

        # 2. Solid Color Header Block for Visual Punch!
        top_header_block = s3.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(cx), Inches(1.45), Inches(card_w), Inches(1.15))
        top_header_block.fill.solid()
        if idx == 1:
            top_header_block.fill.fore_color.rgb = COLOR_TEAL  # Solid Teal Header for the hero center card
            header_text_color = COLOR_WHITE
            sub_text_color = RGBColor(204, 251, 241)
            tag_color = RGBColor(254, 240, 138) # Yellow contrast badge
        elif idx == 0:
            top_header_block.fill.fore_color.rgb = COLOR_ROSE_TINT
            header_text_color = COLOR_NAVY
            sub_text_color = COLOR_TEXT_SECONDARY
            tag_color = COLOR_RED
        else:
            top_header_block.fill.fore_color.rgb = COLOR_BLUE_TINT
            header_text_color = COLOR_NAVY
            sub_text_color = COLOR_TEXT_SECONDARY
            tag_color = COLOR_BLUE

        top_header_block.line.color.rgb = c_accent if idx == 1 else COLOR_BORDER
        top_header_block.line.width = Pt(1)

        # Accent stripe between header block and content
        div_bar = s3.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(cx), Inches(2.60), Inches(card_w), Inches(0.04))
        div_bar.fill.solid()
        div_bar.fill.fore_color.rgb = c_accent
        div_bar.line.color.rgb = c_accent

        # Header Block Text
        htx = s3.shapes.add_textbox(Inches(cx + 0.2), Inches(1.52), Inches(card_w - 0.4), Inches(1.0))
        htf = htx.text_frame
        htf.word_wrap = True
        htf.margin_top = htf.margin_bottom = htf.margin_left = htf.margin_right = 0

        p1 = htf.paragraphs[0]
        p1.text = f"{head_tag}  •  {badge_txt}"
        p1.font.name = FONT_NAME
        p1.font.size = Pt(10)
        p1.font.bold = True
        p1.font.color.rgb = tag_color

        p2 = htf.add_paragraph()
        p2.text = card_title
        p2.font.name = FONT_NAME
        p2.font.size = Pt(19)
        p2.font.bold = True
        p2.font.color.rgb = header_text_color
        p2.space_before = Pt(3)

        p3 = htf.add_paragraph()
        p3.text = card_sub
        p3.font.name = FONT_NAME
        p3.font.size = Pt(11)
        p3.font.color.rgb = sub_text_color
        p3.space_before = Pt(2)

        # Card Body: Crisp content
        tx = s3.shapes.add_textbox(Inches(cx + 0.22), Inches(2.74), Inches(card_w - 0.44), Inches(3.2))
        tf = tx.text_frame
        tf.word_wrap = True
        tf.margin_top = tf.margin_bottom = tf.margin_left = tf.margin_right = 0

        # If Card 1: Add Competitor Logos Ribbon
        if idx == 0:
            comp_lbl = tf.paragraphs[0]
            comp_lbl.text = "INCUMBENTS TARGETING THIS SEGMENT:"
            comp_lbl.font.name = FONT_NAME
            comp_lbl.font.size = Pt(9.5)
            comp_lbl.font.bold = True
            comp_lbl.font.color.rgb = COLOR_RED

            # 4 Competitor Logos in a 2x2 mini grid
            comp_logos = [
                ("savein", 0, 0),
                ("carepay", 1, 0),
                ("fibe", 0, 1),
                ("bajaj", 1, 1)
            ]
            logo_w = 1.55
            logo_h = 0.40
            grid_start_y = 3.02
            for l_name, l_col, l_row in comp_logos:
                l_path = f"public/assets/competitors/{l_name}.png"
                if os.path.exists(l_path):
                    lx = cx + 0.22 + l_col * (logo_w + 0.16)
                    ly = grid_start_y + l_row * (logo_h + 0.10)
                    s3.shapes.add_picture(l_path, Inches(lx), Inches(ly), width=Inches(logo_w), height=Inches(logo_h))

            # Bullets below logos
            b_tx = s3.shapes.add_textbox(Inches(cx + 0.22), Inches(4.10), Inches(card_w - 0.44), Inches(1.9))
            b_tf = b_tx.text_frame
            b_tf.word_wrap = True
            b_tf.margin_top = b_tf.margin_bottom = b_tf.margin_left = b_tf.margin_right = 0

            for b_idx, (b_title, b_desc) in enumerate(items):
                pb = b_tf.paragraphs[0] if b_idx == 0 else b_tf.add_paragraph()
                pb.text = f"• {b_title}: "
                pb.font.name = FONT_NAME
                pb.font.size = Pt(10)
                pb.font.bold = True
                pb.font.color.rgb = COLOR_NAVY
                pb.line_spacing = 1.20
                if b_idx > 0:
                    pb.space_before = Pt(8)

                r = pb.add_run()
                r.text = b_desc
                r.font.bold = False
                r.font.size = Pt(9.5)
                r.font.color.rgb = COLOR_TEXT_SECONDARY
        else:
            for b_idx, (b_title, b_desc) in enumerate(items):
                pb = tf.paragraphs[0] if b_idx == 0 else tf.add_paragraph()
                pb.text = f"• {b_title}: "
                pb.font.name = FONT_NAME
                pb.font.size = Pt(10.5)
                pb.font.bold = True
                pb.font.color.rgb = COLOR_NAVY
                pb.line_spacing = 1.22
                if b_idx > 0:
                    pb.space_before = Pt(10)

                r = pb.add_run()
                r.text = b_desc
                r.font.bold = False
                r.font.size = Pt(10)
                r.font.color.rgb = COLOR_TEXT_SECONDARY

            # Bottom Highlight Pill Box in Card 2 & Card 3 to fill lower area
            hl_box = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(cx + 0.22), Inches(5.45), Inches(card_w - 0.44), Inches(0.52))
            hl_box.fill.solid()
            hl_box.fill.fore_color.rgb = c_top_fill
            hl_box.line.color.rgb = c_accent
            hl_box.line.width = Pt(1)

            htf_b = hl_box.text_frame
            htf_b.margin_top = htf_b.margin_bottom = htf_b.margin_left = htf_b.margin_right = 0
            hp = htf_b.paragraphs[0]
            hp.alignment = PP_ALIGN.CENTER
            hp.text = "★ Strategic Advantage: 100% Doctor Buy-In & Exclusive Case Flow" if idx == 1 else "★ Expansion Potential: Replicable Playbook Across Out-of-Pocket Specialities"
            hp.font.name = FONT_NAME
            hp.font.size = Pt(9)
            hp.font.bold = True
            hp.font.color.rgb = c_accent

    # Takeaway Banner at bottom
    takeaway_box = s3.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(6.25), Inches(11.733), Inches(0.48))
    takeaway_box.fill.solid()
    takeaway_box.fill.fore_color.rgb = COLOR_NAVY
    takeaway_box.line.color.rgb = COLOR_NAVY
    t_tf = takeaway_box.text_frame
    t_tf.margin_top = t_tf.margin_bottom = t_tf.margin_left = t_tf.margin_right = 0
    tp = t_tf.paragraphs[0]
    tp.alignment = PP_ALIGN.CENTER
    tp.text = "Key Takeaway: While incumbents battle for corporate chains to secure prime patient approvals, Clinaza unlocks the vast standalone clinic ecosystem with doctor-led case conversions."
    tp.font.name = FONT_NAME
    tp.font.size = Pt(11)
    tp.font.bold = True
    tp.font.color.rgb = COLOR_WHITE

    # ══════════════════════════════════════════════════════════════════
    # SLIDE 4: VISUAL RISK CARDS
    # ══════════════════════════════════════════════════════════════════
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4)
    add_chrome(s4, "Portfolio Safeguards: Treatment-Linked Financing Controls", "CREDIT INTEGRITY & END-USE SAFEGUARDS", 4)

    risk_cards = [
        (
            "01",
            "🦷 Treatment-Linked",
            "Doctor-referred clinical demand",
            "Borrowers are physically evaluated by licensed practitioners for clinical procedures, providing genuine medical demand rather than speculative consumer borrowing.",
            [
                ("Demand Origin", "In-clinic patient consultation"),
                ("Verification", "Clinical treatment plan entered"),
                ("Borrower Intent", "Necessity-driven healthcare")
            ],
            "Risk Profile: Nil speculative cash-out",
            COLOR_BLUE,
            COLOR_BLUE_TINT
        ),
        (
            "02",
            "📋 Verified Context",
            "Procedure + clinical estimate",
            "Every credit request is tied to a documented clinical case estimate (implants, braces, lasers, refractive care) with verified treatment timing.",
            [
                ("Documentation", "Itemized procedure breakdown"),
                ("Data Capture", "Exact invoice & doctor ID logged"),
                ("Ticket Validation", "Standardized procedure bands")
            ],
            "Data Feed: Real-time API telemetry",
            COLOR_TEAL,
            COLOR_TEAL_TINT
        ),
        (
            "03",
            "🏥 Merchant Settlement",
            "Direct clinic settlement proposed",
            "Financing proceeds are intended to settle directly to verified clinic merchant accounts, strengthening end-use controls and reducing potential cash diversion.",
            [
                ("Fund Flow", "Direct escrow / NBFC to clinic"),
                ("Zero Cash-Out", "Patient never receives liquid cash"),
                ("Clinic Onboarding", "KYC & bank account verified")
            ],
            "Settlement: Direct to registered clinic",
            COLOR_GREEN,
            RGBColor(236, 253, 245)
        ),
        (
            "04",
            "🛡️ Lender-Controlled Risk",
            "Underwriting remains with lender",
            "Lending partners retain 100% control over credit underwriting, bureau cut-offs, pricing, and sanction policies without dilution.",
            [
                ("Decision Engine", "Lender proprietary bureau rules"),
                ("Sanction & APR", "Full lender sovereign control"),
                ("Collections", "Standard lender e-NACH / UPI")
            ],
            "Underwriting: 100% Lender Sovereign",
            COLOR_NAVY,
            COLOR_CARD_TINT
        )
    ]

    card_w = 2.75
    gap = 0.24
    start_x = 0.8

    for idx, (cnum, ctitle, csub, cdesc, checkpoints, tag_footer, ccol, ctint) in enumerate(risk_cards):
        cx = start_x + idx * (card_w + gap)
        card = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(cx), Inches(1.45), Inches(card_w), Inches(4.65))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_CARD_WHITE
        card.line.color.rgb = COLOR_BORDER
        card.line.width = Pt(1)

        # Header block inside card
        r_head = s4.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(cx), Inches(1.45), Inches(card_w), Inches(0.95))
        r_head.fill.solid()
        r_head.fill.fore_color.rgb = ctint
        r_head.line.color.rgb = ccol
        r_head.line.width = Pt(1)

        # Top indicator line
        t_bar = s4.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(cx), Inches(1.45), Inches(card_w), Inches(0.06))
        t_bar.fill.solid()
        t_bar.fill.fore_color.rgb = ccol
        t_bar.line.color.rgb = ccol

        # Number and step tag
        ntx = s4.shapes.add_textbox(Inches(cx + 0.16), Inches(1.52), Inches(card_w - 0.32), Inches(0.85))
        ntf = ntx.text_frame
        ntf.margin_top = ntf.margin_bottom = ntf.margin_left = ntf.margin_right = 0
        p0 = ntf.paragraphs[0]
        p0.text = f"{cnum}  •  PHASE"
        p0.font.name = FONT_NAME
        p0.font.size = Pt(10)
        p0.font.bold = True
        p0.font.color.rgb = ccol

        p0_title = ntf.add_paragraph()
        p0_title.text = ctitle
        p0_title.font.name = FONT_NAME
        p0_title.font.size = Pt(13.5)
        p0_title.font.bold = True
        p0_title.font.color.rgb = COLOR_NAVY
        p0_title.space_before = Pt(2)

        # Body text (Subheading + Detailed Overview)
        tx = s4.shapes.add_textbox(Inches(cx + 0.16), Inches(2.50), Inches(card_w - 0.32), Inches(1.65))
        tf = tx.text_frame
        tf.word_wrap = True
        tf.margin_top = tf.margin_bottom = tf.margin_left = tf.margin_right = 0

        p3 = tf.paragraphs[0]
        p3.text = csub
        p3.font.name = FONT_NAME
        p3.font.size = Pt(11)
        p3.font.bold = True
        p3.font.color.rgb = ccol

        p4 = tf.add_paragraph()
        p4.text = cdesc
        p4.font.name = FONT_NAME
        p4.font.size = Pt(9.5)
        p4.font.color.rgb = COLOR_TEXT_SECONDARY
        p4.space_before = Pt(6)
        p4.line_spacing = 1.22

        # Structured Checkpoints Mini-Container Box (Takes up middle-lower blank area)
        chk_box = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(cx + 0.14), Inches(4.25), Inches(card_w - 0.28), Inches(1.28))
        chk_box.fill.solid()
        chk_box.fill.fore_color.rgb = COLOR_CARD_TINT
        chk_box.line.color.rgb = COLOR_BORDER
        chk_box.line.width = Pt(0.75)

        ct_x = s4.shapes.add_textbox(Inches(cx + 0.22), Inches(4.33), Inches(card_w - 0.44), Inches(1.15))
        ct_tf = ct_x.text_frame
        ct_tf.word_wrap = True
        ct_tf.margin_top = ct_tf.margin_bottom = ct_tf.margin_left = ct_tf.margin_right = 0

        lbl_p = ct_tf.paragraphs[0]
        lbl_p.text = "SAFEGUARD CONTROLS:"
        lbl_p.font.name = FONT_NAME
        lbl_p.font.size = Pt(8.5)
        lbl_p.font.bold = True
        lbl_p.font.color.rgb = COLOR_NAVY

        for cp_k, cp_v in checkpoints:
            p_cp = ct_tf.add_paragraph()
            p_cp.text = f"✔ {cp_k}: "
            p_cp.font.name = FONT_NAME
            p_cp.font.size = Pt(8.5)
            p_cp.font.bold = True
            p_cp.font.color.rgb = ccol
            p_cp.space_before = Pt(3)

            r_v = p_cp.add_run()
            r_v.text = cp_v
            r_v.font.bold = False
            r_v.font.color.rgb = COLOR_TEXT_MUTED

        # Bottom Pill Badge (Fills the lower card base)
        pill = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(cx + 0.14), Inches(5.62), Inches(card_w - 0.28), Inches(0.36))
        pill.fill.solid()
        pill.fill.fore_color.rgb = ctint
        pill.line.color.rgb = ccol
        pill.line.width = Pt(0.75)
        ptf = pill.text_frame
        ptf.margin_top = ptf.margin_bottom = ptf.margin_left = ptf.margin_right = 0
        pp = ptf.paragraphs[0]
        pp.alignment = PP_ALIGN.CENTER
        pp.text = tag_footer
        pp.font.name = FONT_NAME
        pp.font.size = Pt(8.5)
        pp.font.bold = True
        pp.font.color.rgb = ccol

        if idx < len(risk_cards) - 1:
            arr = s4.shapes.add_textbox(Inches(cx + card_w - 0.05), Inches(3.4), Inches(gap + 0.1), Inches(0.5))
            atf = arr.text_frame
            atf.margin_top = atf.margin_bottom = atf.margin_left = atf.margin_right = 0
            ap = atf.paragraphs[0]
            ap.alignment = PP_ALIGN.CENTER
            ap.text = "→"
            ap.font.name = FONT_NAME
            ap.font.size = Pt(18)
            ap.font.bold = True
            ap.font.color.rgb = COLOR_BLUE

    # Takeaway Banner at bottom
    takeaway_box = s4.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(6.25), Inches(11.733), Inches(0.48))
    takeaway_box.fill.solid()
    takeaway_box.fill.fore_color.rgb = COLOR_NAVY
    takeaway_box.line.color.rgb = COLOR_NAVY
    t_tf = takeaway_box.text_frame
    t_tf.margin_top = t_tf.margin_bottom = t_tf.margin_left = t_tf.margin_right = 0
    tp = t_tf.paragraphs[0]
    tp.alignment = PP_ALIGN.CENTER
    tp.text = "Key Takeaway: Treatment-linked financing with direct merchant settlement can strengthen end-use controls and reduce cash-diversion risk."
    tp.font.name = FONT_NAME
    tp.font.size = Pt(11)
    tp.font.bold = True
    tp.font.color.rgb = COLOR_WHITE

    # ══════════════════════════════════════════════════════════════════
    # SLIDE 5: 60/40 FINANCIAL MODEL & COLOR-FILLED 3-STAGE BAR CHART (Chart 2 of 2)
    # ══════════════════════════════════════════════════════════════════
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5)
    add_chrome(s5, "Financing Architecture & Target Growth Rollout", "FINANCIAL PARAMETERS & TARGET SCALE", 5)

    # Left: 55% Width Product Specifications (2x2 Grid)
    left_w = 5.9
    l_card = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.45), Inches(left_w), Inches(4.65))
    l_card.fill.solid()
    l_card.fill.fore_color.rgb = COLOR_CARD_WHITE
    l_card.line.color.rgb = COLOR_BORDER
    l_card.line.width = Pt(1)

    ltx = s5.shapes.add_textbox(Inches(1.05), Inches(1.68), Inches(left_w - 0.5), Inches(0.4))
    ltf = ltx.text_frame
    ltf.margin_top = ltf.margin_bottom = ltf.margin_left = ltf.margin_right = 0
    lp1 = ltf.paragraphs[0]
    lp1.text = "PROPOSED PRODUCT SPECIFICATIONS"
    lp1.font.name = FONT_NAME
    lp1.font.size = Pt(12)
    lp1.font.bold = True
    lp1.font.color.rgb = COLOR_NAVY

    spec_grid = [
        ("₹15K – ₹2.5L", "Ticket Size", "Average anticipated case: ₹45k–₹75k", COLOR_BLUE),
        ("3 – 24 Months", "Tenure Options", "Flexible structured monthly plans", COLOR_TEAL),
        ("Digital KYC", "Borrower Journey", "Subject to lending partner policy", COLOR_GREEN),
        ("Clinic Settlement", "Merchant Settlement", "Subject to approved lender structure", COLOR_NAVY)
    ]

    for s_idx, (s_val, s_lbl, s_sub, s_col) in enumerate(spec_grid):
        r = s_idx // 2
        c = s_idx % 2
        box_x = 1.05 + c * 2.70
        box_y = 2.25 + r * 1.7

        box = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(box_x), Inches(box_y), Inches(2.50), Inches(1.5))
        box.fill.solid()
        box.fill.fore_color.rgb = COLOR_CARD_TINT
        box.line.color.rgb = COLOR_BORDER
        
        btx = s5.shapes.add_textbox(Inches(box_x + 0.15), Inches(box_y + 0.15), Inches(2.20), Inches(1.2))
        btf = btx.text_frame
        btf.word_wrap = True
        bp1 = btf.paragraphs[0]
        bp1.text = s_val
        bp1.font.name = FONT_NAME
        bp1.font.size = Pt(19)
        bp1.font.bold = True
        bp1.font.color.rgb = s_col

        bp2 = btf.add_paragraph()
        bp2.text = s_lbl
        bp2.font.name = FONT_NAME
        bp2.font.size = Pt(12)
        bp2.font.bold = True
        bp2.font.color.rgb = COLOR_TEXT_PRIMARY
        bp2.space_before = Pt(3)

        bp3 = btf.add_paragraph()
        bp3.text = s_sub
        bp3.font.name = FONT_NAME
        bp3.font.size = Pt(10)
        bp3.font.color.rgb = COLOR_TEXT_SECONDARY
        bp3.space_before = Pt(2)

    # Right: 45% Width Volume Upward Column Chart with Y-Axis (5.533" wide)
    right_x = 7.0
    right_w = 5.533

    chart_bg = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(right_x), Inches(1.45), Inches(right_w), Inches(4.65))
    chart_bg.fill.solid()
    chart_bg.fill.fore_color.rgb = COLOR_CARD_WHITE
    chart_bg.line.color.rgb = COLOR_BORDER
    chart_bg.line.width = Pt(1)

    r_hdr = s5.shapes.add_textbox(Inches(right_x + 0.25), Inches(1.68), Inches(right_w - 0.5), Inches(0.4))
    rtf = r_hdr.text_frame
    rtf.margin_top = rtf.margin_bottom = rtf.margin_left = rtf.margin_right = 0
    rp1 = rtf.paragraphs[0]
    rp1.text = "TARGET FINANCING VOLUME (MONTHLY RUN RATE)"
    rp1.font.name = FONT_NAME
    rp1.font.size = Pt(12)
    rp1.font.bold = True
    rp1.font.color.rgb = COLOR_NAVY

    base_line_y = 5.25
    axis_x = right_x + 0.95
    chart_w = right_w - 1.25

    y_ticks = [
        ("₹8 Cr", 2.25),
        ("₹6 Cr", 3.0),
        ("₹4 Cr", 3.75),
        ("₹2 Cr", 4.5),
        ("₹0", 5.25)
    ]

    for y_label, y_pos in y_ticks:
        tx = s5.shapes.add_textbox(Inches(right_x + 0.15), Inches(y_pos - 0.14), Inches(0.75), Inches(0.28))
        tf = tx.text_frame
        tf.margin_top = tf.margin_bottom = tf.margin_left = tf.margin_right = 0
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.RIGHT
        p.text = y_label
        p.font.name = FONT_NAME
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = COLOR_TEXT_MUTED

        gline = s5.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(axis_x), Inches(y_pos), Inches(chart_w), Inches(0.015))
        gline.fill.solid()
        gline.fill.fore_color.rgb = COLOR_GRID_LINE
        gline.line.color.rgb = COLOR_GRID_LINE

    chart_bars = [
        ("PILOT", "25–40 clinics", "₹35L–₹75L", 0.65, COLOR_BLUE),
        ("SCALE", "100+ clinics", "₹1.5–₹3.0 Cr", 1.45, COLOR_TEAL),
        ("12-MONTH TARGET", "350+ clinics", "₹5.0–₹8.0 Cr", 2.85, COLOR_GREEN)
    ]

    b_width = 1.10
    b_gap = 0.36
    b_start_x = axis_x + 0.30

    for b_idx, (b_stage, b_clinics, b_range, b_h, b_col) in enumerate(chart_bars):
        cur_bx = b_start_x + b_idx * (b_width + b_gap)
        cur_by = base_line_y - b_h

        col_bar = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(cur_bx), Inches(cur_by), Inches(b_width), Inches(b_h))
        col_bar.fill.solid()
        col_bar.fill.fore_color.rgb = b_col
        col_bar.line.color.rgb = b_col

        lbl_box = s5.shapes.add_textbox(Inches(cur_bx - 0.25), Inches(cur_by - 0.42), Inches(b_width + 0.5), Inches(0.38))
        ltf = lbl_box.text_frame
        ltf.margin_top = ltf.margin_bottom = ltf.margin_left = ltf.margin_right = 0
        lp = ltf.paragraphs[0]
        lp.alignment = PP_ALIGN.CENTER
        lp.text = b_range
        lp.font.name = FONT_NAME
        lp.font.size = Pt(12)
        lp.font.bold = True
        lp.font.color.rgb = COLOR_NAVY

        x_box = s5.shapes.add_textbox(Inches(cur_bx - 0.2), Inches(base_line_y + 0.08), Inches(b_width + 0.4), Inches(0.60))
        xtf = x_box.text_frame
        xtf.margin_top = xtf.margin_bottom = xtf.margin_left = xtf.margin_right = 0
        xp1 = xtf.paragraphs[0]
        xp1.alignment = PP_ALIGN.CENTER
        xp1.text = b_stage
        xp1.font.name = FONT_NAME
        xp1.font.size = Pt(10.5)
        xp1.font.bold = True
        xp1.font.color.rgb = COLOR_TEXT_PRIMARY

        xp2 = xtf.add_paragraph()
        xp2.alignment = PP_ALIGN.CENTER
        xp2.text = b_clinics
        xp2.font.name = FONT_NAME
        xp2.font.size = Pt(9.5)
        xp2.font.bold = True
        xp2.font.color.rgb = COLOR_TEXT_SECONDARY
        xp2.space_before = Pt(2)

    # Illustrative Target Disclaimer Footnote under chart
    c_disc = s5.shapes.add_textbox(Inches(right_x + 0.3), Inches(base_line_y + 0.55), Inches(chart_w), Inches(0.28))
    c_dtf = c_disc.text_frame
    c_dtf.margin_top = c_dtf.margin_bottom = c_dtf.margin_left = c_dtf.margin_right = 0
    cdp = c_dtf.paragraphs[0]
    cdp.alignment = PP_ALIGN.CENTER
    cdp.text = "*Management illustrative targets; subject to lender approval, clinic onboarding and borrower conversion."
    cdp.font.name = FONT_NAME
    cdp.font.size = Pt(7.5)
    cdp.font.color.rgb = COLOR_TEXT_MUTED

    takeaway_box = s5.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(6.25), Inches(11.733), Inches(0.48))
    takeaway_box.fill.solid()
    takeaway_box.fill.fore_color.rgb = COLOR_NAVY
    takeaway_box.line.color.rgb = COLOR_NAVY
    t_tf = takeaway_box.text_frame
    t_tf.margin_top = t_tf.margin_bottom = t_tf.margin_left = t_tf.margin_right = 0
    tp = t_tf.paragraphs[0]
    tp.alignment = PP_ALIGN.CENTER
    tp.text = "Key Takeaway: Clear path from a focused 25-clinic pilot to ₹5.0Cr+ monthly financing run rate as elective categories scale."
    tp.font.name = FONT_NAME
    tp.font.size = Pt(11)
    tp.font.bold = True
    tp.font.color.rgb = COLOR_WHITE

    # ══════════════════════════════════════════════════════════════════
    # SLIDE 6: THE HERO WORKFLOW PAGE
    # ══════════════════════════════════════════════════════════════════
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6)
    add_chrome(s6, "End-to-End Operational Workflow & Three-Party Architecture", "INTEGRATION & TRANSACTION FLOW", 6)

    flow_boxes = [
        ("CLINIC DESK", "Doctor Diagnosis", "Creates treatment estimate & initiates financing option at consultation", COLOR_NAVY),
        ("CLINAZA", "Financing Initiation", "Front-desk QR / digital link with treatment-tied verification", COLOR_TEAL),
        ("JUSPAY HYPERCREDIT", "Credit Orchestration", "Lender routing & multi-lender credit facilitation", COLOR_BLUE),
        ("LENDING PARTNER", "Underwriting & Policy", "Digital KYC, credit assessment & e-mandate execution", COLOR_GREEN),
        ("VERIFIED CLINIC", "Merchant Settlement", "Disbursement to clinic subject to lender approved structure", COLOR_NAVY)
    ]

    f_width = 2.15
    f_gap = 0.245
    f_start_x = 0.8

    for idx, (head_t, sub_t, desc_t, col_t) in enumerate(flow_boxes):
        cur_x = f_start_x + idx * (f_width + f_gap)
        card = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(cur_x), Inches(1.45), Inches(f_width), Inches(3.05))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_CARD_WHITE
        card.line.color.rgb = COLOR_BORDER
        card.line.width = Pt(1)

        hpill = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(cur_x + 0.1), Inches(1.55), Inches(f_width - 0.2), Inches(0.48))
        hpill.fill.solid()
        hpill.fill.fore_color.rgb = col_t
        hpill.line.color.rgb = col_t
        hptf = hpill.text_frame
        hptf.margin_top = hptf.margin_bottom = hptf.margin_left = hptf.margin_right = 0
        hpp = hptf.paragraphs[0]
        hpp.alignment = PP_ALIGN.CENTER
        hpp.text = head_t
        hpp.font.name = FONT_NAME
        hpp.font.size = Pt(10.5)
        hpp.font.bold = True
        hpp.font.color.rgb = COLOR_WHITE

        tx = s6.shapes.add_textbox(Inches(cur_x + 0.12), Inches(2.15), Inches(f_width - 0.24), Inches(2.2))
        tf = tx.text_frame
        tf.word_wrap = True

        p1 = tf.paragraphs[0]
        p1.text = sub_t
        p1.font.name = FONT_NAME
        p1.font.size = Pt(12.5)
        p1.font.bold = True
        p1.font.color.rgb = COLOR_NAVY

        p2 = tf.add_paragraph()
        p2.text = desc_t
        p2.font.name = FONT_NAME
        p2.font.size = Pt(10.5)
        p2.font.color.rgb = COLOR_TEXT_SECONDARY
        p2.space_before = Pt(6)

        if idx < len(flow_boxes) - 1:
            arr = s6.shapes.add_textbox(Inches(cur_x + f_width - 0.05), Inches(2.6), Inches(f_gap + 0.1), Inches(0.5))
            atf = arr.text_frame
            atf.margin_top = atf.margin_bottom = atf.margin_left = atf.margin_right = 0
            ap = atf.paragraphs[0]
            ap.alignment = PP_ALIGN.CENTER
            ap.text = "→"
            ap.font.name = FONT_NAME
            ap.font.size = Pt(18)
            ap.font.bold = True
            ap.font.color.rgb = COLOR_BLUE

    sep_box = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(4.7), Inches(11.733), Inches(1.4))
    sep_box.fill.solid()
    sep_box.fill.fore_color.rgb = COLOR_CARD_WHITE
    sep_box.line.color.rgb = COLOR_BORDER
    sep_box.line.width = Pt(1)

    stx = s6.shapes.add_textbox(Inches(1.0), Inches(4.82), Inches(11.3), Inches(1.2))
    stf = stx.text_frame
    stf.word_wrap = True

    sp1 = stf.paragraphs[0]
    sp1.text = "THREE-PARTY INSTITUTIONAL SEPARATION OF RESPONSIBILITY"
    sp1.font.name = FONT_NAME
    sp1.font.size = Pt(11)
    sp1.font.bold = True
    sp1.font.color.rgb = COLOR_BLUE

    resps = [
        ("CLINAZA", "Clinic distribution + treatment-linked borrower demand + point-of-care workflow", COLOR_TEAL),
        ("JUSPAY HYPERCREDIT", "Credit orchestration + multi-lender routing + technical connectivity", COLOR_BLUE),
        ("LENDING PARTNER", "Credit underwriting + pricing + mandate execution + portfolio risk", COLOR_NAVY)
    ]

    for r_idx, (r_name, r_desc, r_col) in enumerate(resps):
        rcard = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0 + r_idx * 3.8), Inches(5.15), Inches(3.6), Inches(0.82))
        rcard.fill.solid()
        rcard.fill.fore_color.rgb = COLOR_CARD_TINT
        rcard.line.color.rgb = COLOR_BORDER
        rtf = rcard.text_frame
        rtf.word_wrap = True
        rtf.margin_top = rtf.margin_bottom = Inches(0.08)
        rtf.margin_left = rtf.margin_right = Inches(0.12)
        rp1 = rtf.paragraphs[0]
        rp1.text = r_name
        rp1.font.name = FONT_NAME
        rp1.font.size = Pt(11)
        rp1.font.bold = True
        rp1.font.color.rgb = r_col
        rp2 = rtf.add_paragraph()
        rp2.text = r_desc
        rp2.font.name = FONT_NAME
        rp2.font.size = Pt(9.5)
        rp2.font.color.rgb = COLOR_TEXT_SECONDARY
        rp2.space_before = Pt(2)

    takeaway_box = s6.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(6.25), Inches(11.733), Inches(0.48))
    takeaway_box.fill.solid()
    takeaway_box.fill.fore_color.rgb = COLOR_NAVY
    takeaway_box.line.color.rgb = COLOR_NAVY
    t_tf = takeaway_box.text_frame
    t_tf.margin_top = t_tf.margin_bottom = t_tf.margin_left = t_tf.margin_right = 0
    tp = t_tf.paragraphs[0]
    tp.alignment = PP_ALIGN.CENTER
    tp.text = "Key Takeaway: Clinaza brings specialized clinical demand into the Juspay HyperCredit ecosystem without altering lender underwriting authority."
    tp.font.name = FONT_NAME
    tp.font.size = Pt(11)
    tp.font.bold = True
    tp.font.color.rgb = COLOR_WHITE

    # ══════════════════════════════════════════════════════════════════
    # SLIDE 7: PARTNERSHIP CTA & DISCUSSION ROADMAP
    # ══════════════════════════════════════════════════════════════════
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7)
    add_chrome(s7, "Execution Roadmap & Partnership Onboarding", "EXECUTION ROADMAP & PARTNERSHIP NEXT STEPS", 7)

    pilot_steps = [
        ("50+ Clinic Network", "50+ standalone clinics onboarded & ready"),
        ("Alignment & Criteria", "Lender eligibility, APR & policy alignment"),
        ("Pilot Launch", "Live front-desk rollout with initial cohort"),
        ("Performance Review", "Conversion & credit performance review")
    ]

    p_w = 2.75
    p_gap = 0.24
    for idx, (p_title, p_sub) in enumerate(pilot_steps):
        p_x = 0.8 + idx * (p_w + p_gap)
        p_card = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(p_x), Inches(1.45), Inches(p_w), Inches(1.45))
        p_card.fill.solid()
        p_card.fill.fore_color.rgb = COLOR_CARD_WHITE
        p_card.line.color.rgb = COLOR_BORDER
        p_card.line.width = Pt(1)

        p_bar = s7.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(p_x), Inches(1.45), Inches(p_w), Inches(0.06))
        p_bar.fill.solid()
        p_bar.fill.fore_color.rgb = COLOR_BLUE if idx % 2 == 0 else COLOR_TEAL
        p_bar.line.color.rgb = p_bar.fill.fore_color.rgb

        ptx = s7.shapes.add_textbox(Inches(p_x + 0.15), Inches(1.65), Inches(p_w - 0.3), Inches(1.15))
        ptf = ptx.text_frame
        ptf.word_wrap = True
        pp1 = ptf.paragraphs[0]
        pp1.text = f"STEP 0{idx+1}"
        pp1.font.name = FONT_NAME
        pp1.font.size = Pt(10.5)
        pp1.font.bold = True
        pp1.font.color.rgb = COLOR_BLUE if idx % 2 == 0 else COLOR_TEAL

        pp2 = ptf.add_paragraph()
        pp2.text = p_title
        pp2.font.name = FONT_NAME
        pp2.font.size = Pt(14)
        pp2.font.bold = True
        pp2.font.color.rgb = COLOR_NAVY
        pp2.space_before = Pt(2)

        pp3 = ptf.add_paragraph()
        pp3.text = p_sub
        pp3.font.name = FONT_NAME
        pp3.font.size = Pt(10)
        pp3.font.color.rgb = COLOR_TEXT_SECONDARY
        pp3.space_before = Pt(2)

        if idx < len(pilot_steps) - 1:
            arr = s7.shapes.add_textbox(Inches(p_x + p_w - 0.05), Inches(2.0), Inches(p_gap + 0.1), Inches(0.4))
            atf = arr.text_frame
            atf.margin_top = atf.margin_bottom = atf.margin_left = atf.margin_right = 0
            ap = atf.paragraphs[0]
            ap.alignment = PP_ALIGN.CENTER
            ap.text = "→"
            ap.font.name = FONT_NAME
            ap.font.size = Pt(16)
            ap.font.bold = True
            ap.font.color.rgb = COLOR_BORDER_STRONG

    # Middle Section: Split into 2 Columns (5.8" each)
    # Left Column: TOP 5 PILOT CLINICS FROM CLINAZA PIPELINE
    left_x = 0.8
    col_w = 5.75
    right_x = 6.78

    pipe_card = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left_x), Inches(3.05), Inches(col_w), Inches(2.72))
    pipe_card.fill.solid()
    pipe_card.fill.fore_color.rgb = COLOR_CARD_WHITE
    pipe_card.line.color.rgb = COLOR_BORDER
    pipe_card.line.width = Pt(1)

    p_bar_top = s7.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(left_x), Inches(3.05), Inches(col_w), Inches(0.05))
    p_bar_top.fill.solid()
    p_bar_top.fill.fore_color.rgb = COLOR_TEAL
    p_bar_top.line.color.rgb = COLOR_TEAL

    ptx_head = s7.shapes.add_textbox(Inches(left_x + 0.18), Inches(3.15), Inches(col_w - 0.36), Inches(0.35))
    ptf_h = ptx_head.text_frame
    ptf_h.margin_top = ptf_h.margin_bottom = ptf_h.margin_left = ptf_h.margin_right = 0
    php = ptf_h.paragraphs[0]
    php.text = "50+ READY CLINIC PIPELINE (TOP 5 PILOT CANDIDATES)"
    php.font.name = FONT_NAME
    php.font.size = Pt(11)
    php.font.bold = True
    php.font.color.rgb = COLOR_NAVY

    top_clinics = [
        ("Vasantha Dental & Implant Center", "Visakhapatnam, AP", "3 Chairs", "Implants, Full-Mouth", "₹1,00,000"),
        ("Step to Smile Dental Clinic", "Hyderabad, TS", "2 Chairs", "Implants, Aligners, Rehab", "₹30,000–50K"),
        ("Tirupati Balaji Dental & Face Clinic", "Chandigarh (UT)", "1 Chair", "Cosmetic, Ortho, Rehab", "₹50,000"),
        ("Prodent Multispeciality Clinic", "Patna, Bihar", "1 Chair", "Implants, Zirconia, Braces", "₹35,000"),
        ("Smile Nation Dental Clinic", "Pune / Chinchwad", "2 Chairs", "Clear Aligners, Implants", "₹50,000")
    ]

    for c_i, (c_name, c_city, c_chairs, c_focus, c_ticket) in enumerate(top_clinics):
        c_y = 3.48 + c_i * 0.44
        row_bg = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left_x + 0.14), Inches(c_y), Inches(col_w - 0.28), Inches(0.40))
        row_bg.fill.solid()
        row_bg.fill.fore_color.rgb = COLOR_CARD_TINT if c_i % 2 == 0 else COLOR_CARD_WHITE
        row_bg.line.color.rgb = COLOR_BORDER
        row_bg.line.width = Pt(0.5)

        rtx = s7.shapes.add_textbox(Inches(left_x + 0.22), Inches(c_y + 0.04), Inches(col_w - 0.44), Inches(0.34))
        rtf = rtx.text_frame
        rtf.margin_top = rtf.margin_bottom = rtf.margin_left = rtf.margin_right = 0
        rp = rtf.paragraphs[0]
        rp.text = f"{c_name}"
        rp.font.name = FONT_NAME
        rp.font.size = Pt(9.5)
        rp.font.bold = True
        rp.font.color.rgb = COLOR_NAVY

        rp_sub = rp.add_run()
        rp_sub.text = f"  ({c_city} • {c_chairs})"
        rp_sub.font.bold = False
        rp_sub.font.size = Pt(8.5)
        rp_sub.font.color.rgb = COLOR_TEXT_MUTED

        rp_right = rp.add_run()
        rp_right.text = f"   |   Avg: {c_ticket}"
        rp_right.font.bold = True
        rp_right.font.size = Pt(9)
        rp_right.font.color.rgb = COLOR_TEAL

    # Right Column: WHAT WE'RE LOOKING TO DISCUSS
    disc_card = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(right_x), Inches(3.05), Inches(col_w), Inches(2.72))
    disc_card.fill.solid()
    disc_card.fill.fore_color.rgb = COLOR_CARD_WHITE
    disc_card.line.color.rgb = COLOR_BORDER
    disc_card.line.width = Pt(1)

    d_bar_top = s7.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(right_x), Inches(3.05), Inches(col_w), Inches(0.05))
    d_bar_top.fill.solid()
    d_bar_top.fill.fore_color.rgb = COLOR_BLUE
    d_bar_top.line.color.rgb = COLOR_BLUE

    dtx = s7.shapes.add_textbox(Inches(right_x + 0.18), Inches(3.15), Inches(col_w - 0.36), Inches(0.35))
    dtf = dtx.text_frame
    dtf.margin_top = dtf.margin_bottom = dtf.margin_left = dtf.margin_right = 0
    dp1 = dtf.paragraphs[0]
    dp1.text = "WHAT WE'RE LOOKING TO DISCUSS (IMMEDIATE SCOPE)"
    dp1.font.name = FONT_NAME
    dp1.font.size = Pt(11)
    dp1.font.bold = True
    dp1.font.color.rgb = COLOR_NAVY

    disc_items = [
        ("Lender Eligibility Criteria", "Bureau score cut-offs, minimum income thresholds, and pilot geographical scope."),
        ("Settlement Structure", "Direct settlement mechanics to verified clinics under lender payment & risk policies."),
        ("Commercial Model", "Borrower APR parameters, subvention structures (if applicable), and loan tenure bands."),
        ("Sandbox Activation", "Timeline and criteria for onboarding the initial 15-clinic sandbox cohort.")
    ]

    for d_idx, (d_title, d_desc) in enumerate(disc_items):
        box_y = 3.52 + d_idx * 0.54
        tx_item = s7.shapes.add_textbox(Inches(right_x + 0.18), Inches(box_y), Inches(col_w - 0.36), Inches(0.50))
        tf_item = tx_item.text_frame
        tf_item.word_wrap = True
        tf_item.margin_top = tf_item.margin_bottom = tf_item.margin_left = tf_item.margin_right = 0
        ip1 = tf_item.paragraphs[0]
        ip1.text = f"• {d_title}: "
        ip1.font.name = FONT_NAME
        ip1.font.size = Pt(10)
        ip1.font.bold = True
        ip1.font.color.rgb = COLOR_BLUE

        r = ip1.add_run()
        r.text = d_desc
        r.font.bold = False
        r.font.size = Pt(9)
        r.font.color.rgb = COLOR_TEXT_SECONDARY

    # Bottom Contact Bar
    c_card = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(5.90), Inches(11.733), Inches(0.70))
    c_card.fill.solid()
    c_card.fill.fore_color.rgb = COLOR_NAVY
    c_card.line.color.rgb = COLOR_NAVY

    ctx = s7.shapes.add_textbox(Inches(1.0), Inches(6.02), Inches(11.3), Inches(0.48))
    ctf = ctx.text_frame
    ctf.word_wrap = True
    ctf.margin_top = ctf.margin_bottom = ctf.margin_left = ctf.margin_right = 0
    cp1 = ctf.paragraphs[0]
    cp1.alignment = PP_ALIGN.CENTER
    cp1.text = "PRIMARY CONTACTS:  Pratyush Raj (Founder & CEO, Clinaza: +91 7292984244 | pratyushraj@outlook.com)  •  Subahan Shaik (Juspay Alliances: subahan.shaik@juspay.in)"
    cp1.font.name = FONT_NAME
    cp1.font.size = Pt(10.5)
    cp1.font.bold = True
    cp1.font.color.rgb = COLOR_WHITE

    pptx_path = "Clinaza_Juspay_HyperCredit_Lender_Proposal.pptx"
    prs.save(pptx_path)
    print(f"✅ Generated High-Impact Fintech Redesign PPTX: {pptx_path}")

if __name__ == '__main__':
    create_deck()
