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

# ── Premium Swiss Fintech Color Palette (Matching PayU & DPanda decks) ──
COLOR_BG_PAGE = RGBColor(241, 245, 249)    # Slate-100 soft canvas
COLOR_HEADER_NAVY = RGBColor(10, 25, 60)   # Deep Navy Header
COLOR_NAVY = RGBColor(10, 25, 60)          # #0A193C Primary Navy
COLOR_NAVY_DARK = RGBColor(6, 16, 42)      # #06102A Cover Navy
COLOR_BLUE = RGBColor(10, 102, 235)        # #0A66EB Clinaza Electric Blue
COLOR_TEAL = RGBColor(13, 148, 136)        # #0D9488 Medical Teal
COLOR_GREEN = RGBColor(16, 185, 129)       # #10B981 Prime Growth Green
COLOR_CARD_WHITE = RGBColor(255, 255, 255) # Pure White Card
COLOR_CARD_TINT = RGBColor(248, 250, 252)  # Soft Slate 50
COLOR_TEAL_TINT = RGBColor(240, 253, 250)  # Soft Teal Tint
COLOR_BLUE_TINT = RGBColor(238, 242, 255)  # Soft Blue Tint
COLOR_PAYU_TINT = RGBColor(240, 253, 244)  # Soft Green Tint
COLOR_RED = RGBColor(225, 29, 72)          # Rose/Red for Incumbent issues
COLOR_ROSE_TINT = RGBColor(255, 241, 242)  # Soft Rose Tint
COLOR_BORDER = RGBColor(203, 213, 225)     # Crisp Slate-300 Border
COLOR_TEXT_PRIMARY = RGBColor(15, 23, 42)  # #0F172A Sharp Charcoal Text
COLOR_TEXT_SECONDARY = RGBColor(51, 65, 85) # #334155 Slate 700 Clear Reading Text
COLOR_TEXT_MUTED = RGBColor(100, 116, 139) # #64748B Secondary Text
COLOR_WHITE = RGBColor(255, 255, 255)

LOGO_PATH = os.path.abspath("public/assets/clinaza-logo.jpg")

TOTAL_PAGES = 10

def populate_card_text(text_frame, markdown_text, default_size=10, default_color=COLOR_TEXT_SECONDARY):
    text_frame.word_wrap = True
    lines = markdown_text.strip().split("\n")
    first = True
    for line in lines:
        line = line.strip()
        if not line:
            continue
        p = text_frame.paragraphs[0] if first else text_frame.add_paragraph()
        first = False
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
                run.font.size = Pt(default_size)
                run.font.color.rgb = COLOR_TEXT_PRIMARY
            else:
                run.text = part
                run.font.bold = False
                run.font.size = Pt(default_size)
                run.font.color.rgb = default_color

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
        head_banner.fill.fore_color.rgb = COLOR_HEADER_NAVY
        head_banner.line.color.rgb = COLOR_HEADER_NAVY

        # Subtle cyan brand line
        subtle_line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, Inches(1.32), Inches(13.333), Inches(0.03))
        subtle_line.fill.solid()
        subtle_line.fill.fore_color.rgb = COLOR_BLUE
        subtle_line.line.color.rgb = COLOR_BLUE

        # 2. Clinaza Logo
        if os.path.exists(LOGO_PATH):
            slide.shapes.add_picture(LOGO_PATH, Inches(0.65), Inches(0.18), width=Inches(0.95), height=Inches(0.95))

        # 3. Category & Title Block
        header_tf = slide.shapes.add_textbox(Inches(1.8), Inches(0.18), Inches(9.2), Inches(0.95)).text_frame
        header_tf.word_wrap = True
        header_tf.margin_left = Inches(0)
        header_tf.margin_top = Inches(0)

        p0 = header_tf.paragraphs[0]
        p0.text = f"CLINAZA  //  {category_badge.upper()}"
        p0.font.name = FONT_NAME
        p0.font.size = Pt(10)
        p0.font.bold = True
        p0.font.color.rgb = COLOR_BLUE
        p0.space_after = Pt(2)

        p1 = header_tf.add_paragraph()
        p1.text = title_text
        p1.font.name = FONT_NAME
        p1.font.size = Pt(18)
        p1.font.bold = True
        p1.font.color.rgb = COLOR_WHITE

        # 4. Top Right Metadata Pill
        meta_shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(11.1), Inches(0.25), Inches(1.6), Inches(0.8))
        meta_shape.fill.solid()
        meta_shape.fill.fore_color.rgb = RGBColor(18, 38, 80)
        meta_shape.line.color.rgb = RGBColor(30, 58, 110)
        meta_tf = meta_shape.text_frame
        meta_tf.word_wrap = True
        p_m1 = meta_tf.paragraphs[0]
        p_m1.alignment = PP_ALIGN.CENTER
        p_m1.text = f"SLIDE {current_page} OF {total_pages}"
        p_m1.font.name = FONT_NAME
        p_m1.font.size = Pt(10)
        p_m1.font.bold = True
        p_m1.font.color.rgb = COLOR_WHITE
        p_m2 = meta_tf.add_paragraph()
        p_m2.alignment = PP_ALIGN.CENTER
        p_m2.text = "STARTUP PITCH DECK"
        p_m2.font.name = FONT_NAME
        p_m2.font.size = Pt(7.5)
        p_m2.font.color.rgb = RGBColor(148, 163, 184)

        # 5. Bottom Status Strip
        bot_banner = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, Inches(7.05), Inches(13.333), Inches(0.45))
        bot_banner.fill.solid()
        bot_banner.fill.fore_color.rgb = COLOR_HEADER_NAVY
        bot_banner.line.color.rgb = COLOR_HEADER_NAVY

        bot_tf = slide.shapes.add_textbox(Inches(0.65), Inches(7.08), Inches(12.0), Inches(0.35)).text_frame
        bot_p = bot_tf.paragraphs[0]
        bot_p.text = "CLINAZA TECHNOLOGIES • Point-of-Care Healthcare Financing OS • 55+ RBI-Regulated Lending Rails • clinaza.in"
        bot_p.font.name = FONT_NAME
        bot_p.font.size = Pt(9)
        bot_p.font.bold = True
        bot_p.font.color.rgb = RGBColor(148, 163, 184)

    # ═════════════════════════════════════════════════════════════
    # SLIDE 1: COVER SLIDE
    # ═════════════════════════════════════════════════════════════
    slide1 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide1, COLOR_NAVY_DARK)

    # Ambient Accent Glow Shape
    glow = slide1.shapes.add_shape(MSO_SHAPE.OVAL, Inches(8.5), Inches(-1.5), Inches(6.0), Inches(6.0))
    glow.fill.solid()
    glow.fill.fore_color.rgb = RGBColor(14, 40, 95)
    glow.line.color.rgb = RGBColor(14, 40, 95)

    # Cover Header Logos
    if os.path.exists(LOGO_PATH):
        slide1.shapes.add_picture(LOGO_PATH, Inches(0.85), Inches(0.85), width=Inches(1.2), height=Inches(1.2))

    # Badge Pill
    badge = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(2.25), Inches(0.95), Inches(4.2), Inches(0.42))
    badge.fill.solid()
    badge.fill.fore_color.rgb = RGBColor(18, 38, 80)
    badge.line.color.rgb = COLOR_BLUE
    bp = badge.text_frame.paragraphs[0]
    bp.alignment = PP_ALIGN.CENTER
    bp.text = "SEED STAGE ACCELERATOR PITCH DECK // 2026"
    bp.font.name = FONT_NAME
    bp.font.size = Pt(10)
    bp.font.bold = True
    bp.font.color.rgb = COLOR_WHITE

    # Main Cover Headline
    title_tf = slide1.shapes.add_textbox(Inches(0.85), Inches(2.25), Inches(11.5), Inches(2.2)).text_frame
    title_tf.word_wrap = True
    tp1 = title_tf.paragraphs[0]
    tp1.text = "CLINAZA: POINT-OF-CARE HEALTHCARE FINANCING OS"
    tp1.font.name = FONT_NAME
    tp1.font.size = Pt(32)
    tp1.font.bold = True
    tp1.font.color.rgb = COLOR_WHITE
    tp1.space_after = Pt(10)

    tp2 = title_tf.add_paragraph()
    tp2.text = "Democratizing Instant Chairside Healthcare EMIs for India's 95% Standalone Clinics • 100% Upfront Payout • Zero Clinic Credit Liability"
    tp2.font.name = FONT_NAME
    tp2.font.size = Pt(16)
    tp2.font.color.rgb = RGBColor(148, 163, 184)

    # 3 Summary Pillar Cards
    card_w = Inches(3.65)
    card_h = Inches(1.8)
    card_y = Inches(4.7)

    pillars = [
        ("THE OPPORTUNITY", "68% Procedure Drop-Offs", "₹1,20,000 Cr ($15B+) out-of-pocket elective healthcare market in India with 0% insurance penetration.", COLOR_BLUE_TINT, COLOR_BLUE),
        ("THE SOLUTION", "2-Minute Digital e-KYC", "Dynamic reception QR & web simulator routing through 55+ RBI-regulated bank and NBFC rails.", COLOR_TEAL_TINT, COLOR_TEAL),
        ("THE ASK & SCALE", "Raising ₹50 Lakhs Seed", "Scaling 25+ verified pilot clinics to 250 clinics, achieving Month-18 operational break-even.", COLOR_PAYU_TINT, COLOR_GREEN)
    ]

    for idx, (p_tag, p_head, p_body, tint_c, text_c) in enumerate(pillars):
        cx = Inches(0.85) + idx * Inches(3.95)
        card = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, card_y, card_w, card_h)
        card.fill.solid()
        card.fill.fore_color.rgb = RGBColor(15, 30, 65)
        card.line.color.rgb = RGBColor(30, 58, 110)
        
        ctf = card.text_frame
        ctf.word_wrap = True
        ctf.margin_left = Inches(0.2)
        ctf.margin_top = Inches(0.15)

        p = ctf.paragraphs[0]
        p.text = p_tag
        p.font.name = FONT_NAME
        p.font.size = Pt(9)
        p.font.bold = True
        p.font.color.rgb = text_c
        p.space_after = Pt(2)

        p_h = ctf.add_paragraph()
        p_h.text = p_head
        p_h.font.name = FONT_NAME
        p_h.font.size = Pt(13)
        p_h.font.bold = True
        p_h.font.color.rgb = COLOR_WHITE
        p_h.space_after = Pt(4)

        p_b = ctf.add_paragraph()
        p_b.text = p_body
        p_b.font.name = FONT_NAME
        p_b.font.size = Pt(9)
        p_b.font.color.rgb = RGBColor(203, 213, 225)

    # Footer Strip
    cover_ft = slide1.shapes.add_textbox(Inches(0.85), Inches(6.8), Inches(11.5), Inches(0.4)).text_frame
    cp = cover_ft.paragraphs[0]
    cp.text = "Founder: Pratyush Raj • +91 7292984244 • pratyushraj@outlook.com • https://clinaza.in • Pitch Deck v2.4"
    cp.font.name = FONT_NAME
    cp.font.size = Pt(9.5)
    cp.font.color.rgb = RGBColor(148, 163, 184)

    # ═════════════════════════════════════════════════════════════
    # SLIDE 2: THE MARKET PROBLEM
    # ═════════════════════════════════════════════════════════════
    slide2 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide2)
    add_chrome(slide2, "The Core Market Problem: The Healthcare Affordability Bottleneck", "Market Bottleneck", 2)

    col_w = Inches(3.8)
    col_h = Inches(5.1)
    top_y = Inches(1.6)

    prob_cards = [
        ("THE DROP-OFF CRISIS", "68%+ Procedure Abandonment", COLOR_ROSE_TINT, COLOR_RED, """
• **Chairside Payment Shock**:
  High-ticket elective procedures (Implants ₹40K–₹90K, Clear Aligners ₹60K–₹1.5L, Full-Mouth Rehab) are presented as lump-sum bills.

• **No Insurance Shield**:
  Over **80% of elective treatments in India** are 100% out-of-pocket expenses with zero private medical insurance coverage.

• **Lost Clinic Revenue**:
  Patients leave consults promising to "think about it" and never return, costing clinics **₹3L–₹6L per chair per month** in lost billings.
"""),
        ("THE CLINIC DILEMMA", "Dangerous Khata & Bad Debt", COLOR_CARD_WHITE, COLOR_NAVY, """
• **Informal Khata Books**:
  To prevent patient drop-offs, doctors are forced to offer informal monthly clinic installments (*khata*).

• **High Default Rates**:
  Clinics suffer **15% to 20% bad-debt defaults** as patients stop paying once active dental pain subsides.

• **Doctors as Debt Collectors**:
  Reception staff spends hundreds of hours uncomfortably chasing overdue patient payments instead of clinical patient care.
"""),
        ("THE LENDER CATCH-22", "95% Standalone Clinics Locked Out", COLOR_CARD_WHITE, COLOR_NAVY, """
• **Incumbent Focus on Chains**:
  Legacy financiers (Bajaj Finserv, SaveIN) exclusively target top 5% corporate hospital chains with ₹20L+ monthly billing.

• **Heavy Hardware Barriers**:
  Mandatory proprietary POS terminals, physical branch audits, and ₹10,000+ onboarding deposits.

• **Unserved 2,00,000+ Clinics**:
  India's massive long-tail of independent dental practices has **zero automated point-of-care financing rails**.
""")
    ]

    for idx, (tag, title, bg_c, text_c, content) in enumerate(prob_cards):
        cx = Inches(0.65) + idx * Inches(4.05)
        card = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, top_y, col_w, col_h)
        card.fill.solid()
        card.fill.fore_color.rgb = bg_c
        card.line.color.rgb = COLOR_BORDER

        hdr = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, top_y, col_w, Inches(0.65))
        hdr.fill.solid()
        hdr.fill.fore_color.rgb = bg_c
        hdr.line.color.rgb = COLOR_BORDER
        htf = hdr.text_frame
        p = htf.paragraphs[0]
        p.text = tag
        p.font.name = FONT_NAME
        p.font.size = Pt(9.5)
        p.font.bold = True
        p.font.color.rgb = text_c
        p2 = htf.add_paragraph()
        p2.text = title
        p2.font.name = FONT_NAME
        p2.font.size = Pt(12)
        p2.font.bold = True
        p2.font.color.rgb = COLOR_TEXT_PRIMARY

        body_tf = slide2.shapes.add_textbox(cx + Inches(0.2), top_y + Inches(0.75), col_w - Inches(0.4), col_h - Inches(0.85)).text_frame
        populate_card_text(body_tf, content)

    # ═════════════════════════════════════════════════════════════
    # SLIDE 3: THE CLINAZA SOLUTION
    # ═════════════════════════════════════════════════════════════
    slide3 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide3)
    add_chrome(slide3, "The Clinaza Solution: Universal Point-of-Care Affordability OS", "The Solution", 3)

    sol_cards = [
        ("INSTANT 2-MIN e-KYC", "Zero POS Hardware Required", COLOR_TEAL_TINT, COLOR_TEAL, """
• **Dynamic QR Checkout**:
  Patient scans the Clinaza QR code at the clinic reception or receives an instant WhatsApp link.

• **Paperless Verification**:
  100% digital Aadhaar OTP & PAN credit scoring in **under 120 seconds** directly chairside.

• **Universal Device Coverage**:
  Runs entirely on any smartphone, clinic tablet, or desktop browser. No physical POS machine rentals or hardware maintenance.
"""),
        ("100% UPFRONT DISBURSAL", "Doctors Get Paid Immediately", COLOR_BLUE_TINT, COLOR_BLUE, """
• **Direct Bank Settlement**:
  Upon treatment sanction, the full procedure amount is disbursed directly into the doctor's bank account.

• **Predictable Working Capital**:
  Eliminates clinic cash-flow volatility, enabling doctors to pay lab bills and order implant kits upfront.

• **Clean Accounting**:
  Automated settlement reconciliation and daily payout ledger synced right to the clinic dashboard.
"""),
        ("ZERO CREDIT LIABILITY", "100% Non-Recourse Financing", COLOR_PAYU_TINT, COLOR_GREEN, """
• **Zero Merchant Risk**:
  If a patient delays or defaults on monthly payments, the lending partner absorbs 100% of the risk—never the clinic.

• **Stops Bad Clinic Debt**:
  Doctors completely exit the debt-collection business and focus solely on high-quality clinical treatment.

• **Zero Setup Cost**:
  ₹0 onboarding fees, ₹0 annual subscription, and ₹0 deposit for partner clinics.
""")
    ]

    for idx, (tag, title, bg_c, text_c, content) in enumerate(sol_cards):
        cx = Inches(0.65) + idx * Inches(4.05)
        card = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, top_y, col_w, col_h)
        card.fill.solid()
        card.fill.fore_color.rgb = bg_c
        card.line.color.rgb = COLOR_BORDER

        hdr = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, top_y, col_w, Inches(0.65))
        hdr.fill.solid()
        hdr.fill.fore_color.rgb = bg_c
        hdr.line.color.rgb = COLOR_BORDER
        htf = hdr.text_frame
        p = htf.paragraphs[0]
        p.text = tag
        p.font.name = FONT_NAME
        p.font.size = Pt(9.5)
        p.font.bold = True
        p.font.color.rgb = text_c
        p2 = htf.add_paragraph()
        p2.text = title
        p2.font.name = FONT_NAME
        p2.font.size = Pt(12)
        p2.font.bold = True
        p2.font.color.rgb = COLOR_TEXT_PRIMARY

        body_tf = slide3.shapes.add_textbox(cx + Inches(0.2), top_y + Inches(0.75), col_w - Inches(0.4), col_h - Inches(0.85)).text_frame
        populate_card_text(body_tf, content)

    # ═════════════════════════════════════════════════════════════
    # SLIDE 4: PRODUCT & ARCHITECTURE (WATERFALL)
    # ═════════════════════════════════════════════════════════════
    slide4 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide4)
    add_chrome(slide4, "Product & Tech Stack: Multi-Lender Waterfall Routing Engine", "Technical Stack", 4)

    # 2-Column Split: Left (Architecture) | Right (Workflow)
    left_w = Inches(5.8)
    right_w = Inches(5.8)
    card_h_split = Inches(5.1)

    # Left: Waterfall Architecture
    card_l = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.65), top_y, left_w, card_h_split)
    card_l.fill.solid()
    card_l.fill.fore_color.rgb = COLOR_CARD_WHITE
    card_l.line.color.rgb = COLOR_BORDER

    hl = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.65), top_y, left_w, Inches(0.6))
    hl.fill.solid()
    hl.fill.fore_color.rgb = COLOR_BLUE_TINT
    hl.line.color.rgb = COLOR_BORDER
    pl = hl.text_frame.paragraphs[0]
    pl.text = "MULTI-LENDER WATERFALL ROUTING ENGINE"
    pl.font.name = FONT_NAME
    pl.font.size = Pt(11)
    pl.font.bold = True
    pl.font.color.rgb = COLOR_BLUE

    tfl = slide4.shapes.add_textbox(Inches(0.85), top_y + Inches(0.7), left_w - Inches(0.4), card_h_split - Inches(0.85)).text_frame
    populate_card_text(tfl, """
• **Tier 1: Cardless & NTB (New To Bank)**:
  Queries Cardless EMI rails (Flexmoney InstaCred with 55+ NBFCs, DPanda FastEMI). High approval rate for non-card holders and gig workers.

• **Tier 2: Debit Card & Credit Card EMI**:
  Seamless fallback through PayU Healthcare Affordability covering all major tier-1 private & PSU banks (HDFC, ICICI, SBI, Axis, Kotak).

• **Tier 3: Low-Cost / Subvented Medical EMI**:
  Clinic can optionally sponsor 2–3% merchant subvention to offer 0% or single-digit subsidized patient interest rates.

• **Omnichannel Fallback**:
  If credit approval is rejected, checkout gracefully redirects to standard UPI, Net Banking, or split-card deposit payment.
""")

    # Right: Front-Desk OS
    card_r = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), top_y, right_w, card_h_split)
    card_r.fill.solid()
    card_r.fill.fore_color.rgb = COLOR_CARD_WHITE
    card_r.line.color.rgb = COLOR_BORDER

    hr = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), top_y, right_w, Inches(0.6))
    hr.fill.solid()
    hr.fill.fore_color.rgb = COLOR_TEAL_TINT
    hr.line.color.rgb = COLOR_BORDER
    pr = hr.text_frame.paragraphs[0]
    pr.text = "CHAIRSIDE FRONT-DESK RECEPTION OS"
    pr.font.name = FONT_NAME
    pr.font.size = Pt(11)
    pr.font.bold = True
    pr.font.color.rgb = COLOR_TEAL

    tfr = slide4.shapes.add_textbox(Inches(7.0), top_y + Inches(0.7), right_w - Inches(0.4), card_h_split - Inches(0.85)).text_frame
    populate_card_text(tfr, """
• **Chairside Cost Simulator**:
  Doctor keys in treatment estimate (e.g. ₹55,000 for implants). Screen instantly showcases patient monthly breakdowns (e.g. ₹2,400/mo).

• **Automated Patient Reactivation**:
  Embedded clinic CRM tags dropped consults and dispatches automated WhatsApp EMI affordability options to re-engage patients.

• **Real-Time Settlement Ledger**:
  Live tracking of loan approval webhooks, disbursement IDs, bank reference numbers, and merchant payouts.

• **Staff Training & Zero Latency**:
  Front-desk receptionist can generate and complete financing in under 3 minutes with zero prior financial training.
""")

    # ═════════════════════════════════════════════════════════════
    # SLIDE 5: MARKET SIZE (TAM / SAM / SOM)
    # ═════════════════════════════════════════════════════════════
    slide5 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide5)
    add_chrome(slide5, "Market Size: $15B+ Indian Elective Healthcare Out-of-Pocket Market", "Market Sizing", 5)

    tam_cards = [
        ("TAM // TOTAL ADDRESSABLE MARKET", "₹1,20,000 Cr ($15B+ USD)", COLOR_BLUE_TINT, COLOR_BLUE, """
• **Overall Out-of-Pocket Elective Healthcare**:
  Covers Dental, Aesthetic Dermatology, Trichology/Hair Transplant, Cosmetic Surgeries, and Day-care Elective Procedures in India.

• **Zero Insurance Shield**:
  Over 85% of elective procedures have no health insurance reimbursement.

• **Rapid Disposable Income Growth**:
  Tier-1 and Tier-2 middle-income consumers prioritize smile design and aesthetic self-care when made affordable via monthly payments.
"""),
        ("SAM // SERVICEABLE ADDRESSABLE MARKET", "₹22,000 Cr ($2.6B+ USD)", COLOR_TEAL_TINT, COLOR_TEAL, """
• **Private Dental Care Expenditure**:
  Annual expenditure across India's **2,00,000+ standalone dental practices**.

• **High-Ticket Treatment Surge**:
  Implants, Clear Aligners (Invisalign/toothsi), Ceramic Crowns, and Full Mouth Rehab represent over 55% of clinic gross revenues.

• **Fast Urbanization**:
  High density of dental colleges creating thousands of modern, high-tech independent practices annually.
"""),
        ("SOM // SERVICEABLE OBTAINABLE MARKET", "₹650 Cr ($80M+ USD)", COLOR_PAYU_TINT, COLOR_GREEN, """
• **Initial Point-of-Care Financing Target**:
  Financing GMV across top **15,000 private multi-chair clinics** in Tier-1 & Tier-2 urban hubs over the next 3–4 years.

• **Clinic Penetration Objective**:
  Average 10–15 financed treatment cases per clinic per month (₹4L–₹7L monthly financed volume per partner practice).

• **Clinaza Software Take**:
  Generates ₹18 Cr to ₹24 Cr in annual net transaction and subscription revenue.
""")
    ]

    for idx, (tag, title, bg_c, text_c, content) in enumerate(tam_cards):
        cx = Inches(0.65) + idx * Inches(4.05)
        card = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, top_y, col_w, col_h)
        card.fill.solid()
        card.fill.fore_color.rgb = bg_c
        card.line.color.rgb = COLOR_BORDER

        hdr = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, top_y, col_w, Inches(0.65))
        hdr.fill.solid()
        hdr.fill.fore_color.rgb = bg_c
        hdr.line.color.rgb = COLOR_BORDER
        htf = hdr.text_frame
        p = htf.paragraphs[0]
        p.text = tag
        p.font.name = FONT_NAME
        p.font.size = Pt(9.5)
        p.font.bold = True
        p.font.color.rgb = text_c
        p2 = htf.add_paragraph()
        p2.text = title
        p2.font.name = FONT_NAME
        p2.font.size = Pt(12)
        p2.font.bold = True
        p2.font.color.rgb = COLOR_TEXT_PRIMARY

        body_tf = slide5.shapes.add_textbox(cx + Inches(0.2), top_y + Inches(0.75), col_w - Inches(0.4), col_h - Inches(0.85)).text_frame
        populate_card_text(body_tf, content)

    # ═════════════════════════════════════════════════════════════
    # SLIDE 6: BUSINESS MODEL & UNIT ECONOMICS
    # ═════════════════════════════════════════════════════════════
    slide6 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide6)
    add_chrome(slide6, "Business Model & Unit Economics: High-Margin Software & Take Rates", "Business Model", 6)

    card_l6 = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.65), top_y, left_w, card_h_split)
    card_l6.fill.solid()
    card_l6.fill.fore_color.rgb = COLOR_CARD_WHITE
    card_l6.line.color.rgb = COLOR_BORDER

    hl6 = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.65), top_y, left_w, Inches(0.6))
    hl6.fill.solid()
    hl6.fill.fore_color.rgb = COLOR_BLUE_TINT
    hl6.line.color.rgb = COLOR_BORDER
    pl6 = hl6.text_frame.paragraphs[0]
    pl6.text = "REVENUE STREAMS & MONETIZATION"
    pl6.font.name = FONT_NAME
    pl6.font.size = Pt(11)
    pl6.font.bold = True
    pl6.font.color.rgb = COLOR_BLUE

    tfl6 = slide6.shapes.add_textbox(Inches(0.85), top_y + Inches(0.7), left_w - Inches(0.4), card_h_split - Inches(0.85)).text_frame
    populate_card_text(tfl6, """
• **1. NBFC Lending Payout (1.5% – 2.5%)**:
  Lending partners pay Clinaza an origination commission upon successful loan disbursement.

• **2. Clinic Subvention / MDR (1.5% – 2.5%)**:
  Clinic pays a low subvention fee to sponsor low-interest or zero-cost monthly installments for the patient.

• **3. Blended Take Rate (2.5% – 3.5%)**:
  Net realized take rate of **₹1,500 – ₹2,500 per funded patient treatment** on an average ₹65,000 ticket.

• **4. Clinic SaaS Subscription (Recurring ARR)**:
  ₹999 to ₹2,499 / month / clinic for premium chairside CRM, WhatsApp automated drops follow-up, and multi-branch analytics.
""")

    card_r6 = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), top_y, right_w, card_h_split)
    card_r6.fill.solid()
    card_r6.fill.fore_color.rgb = COLOR_CARD_WHITE
    card_r6.line.color.rgb = COLOR_BORDER

    hr6 = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), top_y, right_w, Inches(0.6))
    hr6.fill.solid()
    hr6.fill.fore_color.rgb = COLOR_PAYU_TINT
    hr6.line.color.rgb = COLOR_BORDER
    pr6 = hr6.text_frame.paragraphs[0]
    pr6.text = "UNIT ECONOMICS: 100 CLINIC COHORT EXAMPLE"
    pr6.font.name = FONT_NAME
    pr6.font.size = Pt(11)
    pr6.font.bold = True
    pr6.font.color.rgb = COLOR_GREEN

    tfr6 = slide6.shapes.add_textbox(Inches(7.0), top_y + Inches(0.7), right_w - Inches(0.4), card_h_split - Inches(0.85)).text_frame
    populate_card_text(tfr6, """
• **Cohort Size**: 100 Active Partner Dental Practices
• **Average Ticket Size**: ₹65,000 (Dental Implants / Aligners)
• **Financed Cases / Month / Clinic**: 6 Cases
• **Monthly Financing Volume / Clinic**: ₹3,90,000
• **Cohort Monthly GMV**: **₹3.90 Crores / month**

• **Monthly Revenue Breakdown**:
  - Net Take Rate (3.0%): **₹11.7 Lakhs / month**
  - Clinic SaaS Subscriptions (₹1,499/mo): **₹1.5 Lakhs / month**
  - **Total Cohort Revenue: ₹13.2 Lakhs / month** (₹1.58 Cr ARR)

• **Gross Margins**: **82%+** (Zero hardware capex, pure software routing).
""")

    # ═════════════════════════════════════════════════════════════
    # SLIDE 7: COMPETITIVE ADVANTAGE & MOAT
    # ═════════════════════════════════════════════════════════════
    slide7 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide7)
    add_chrome(slide7, "Competitive Landscape: Long-Tail Aggregator Moat vs Incumbents", "Competitive Moat", 7)

    comp_features = [
        ("DIMENSION", "CLINAZA HEALTHCARE", "BAJAJ FINSERV / HEALTH EMI", "SAVEIN / CAREPAY"),
        ("Clinic Target", "The 95% standalone independent dental clinics", "Large corporate hospital chains (Apollo, Fortis)", "Selective tier-1 metro clinics with ₹15L+ billing"),
        ("Hardware Setup", "100% Zero Hardware (Web QR & chairside link)", "Mandatory proprietary POS terminal machine", "Heavy tablet/hardware or field-sales dependent"),
        ("Clinic Liability", "100% Non-Recourse (Lenders absorb credit risk)", "Chargeback risk & recovery disputes on merchants", "Selective merchant recourse clauses"),
        ("Clinic Onboarding Fee", "₹0 Setup & ₹0 Platform Fee for clinics", "₹5,000 to ₹15,000 terminal fee & security deposit", "Platform setup fees charged to merchants"),
        ("Lending Rails", "Universal Waterfall: Flexmoney, PayU, DPanda", "Single proprietary NBFC (Bajaj Finance)", "Limited proprietary NBFC lending partners")
    ]

    # Render as a styled grid table
    t_top = top_y + Inches(0.2)
    tbl_shape = slide7.shapes.add_table(len(comp_features), 4, Inches(0.65), t_top, Inches(12.0), Inches(4.5))
    tbl = tbl_shape.table
    tbl.columns[0].width = Inches(2.2)
    tbl.columns[1].width = Inches(3.6)
    tbl.columns[2].width = Inches(3.1)
    tbl.columns[3].width = Inches(3.1)

    for r_idx, row in enumerate(comp_features):
        for c_idx, val in enumerate(row):
            cell = tbl.cell(r_idx, c_idx)
            cell.vertical_anchor = MSO_ANCHOR.MIDDLE
            cp = cell.text_frame.paragraphs[0]
            cp.text = val
            cp.font.name = FONT_NAME
            
            if r_idx == 0:
                cell.fill.solid()
                cell.fill.fore_color.rgb = COLOR_HEADER_NAVY if c_idx != 1 else COLOR_BLUE
                cp.font.bold = True
                cp.font.size = Pt(11)
                cp.font.color.rgb = COLOR_WHITE
            else:
                cell.fill.solid()
                if c_idx == 1:
                    cell.fill.fore_color.rgb = COLOR_BLUE_TINT
                    cp.font.bold = True
                    cp.font.color.rgb = COLOR_NAVY
                    cp.font.size = Pt(10)
                else:
                    cell.fill.fore_color.rgb = COLOR_CARD_WHITE if r_idx % 2 == 1 else COLOR_CARD_TINT
                    cp.font.bold = False
                    cp.font.color.rgb = COLOR_TEXT_SECONDARY
                    cp.font.size = Pt(9.5)

    # ═════════════════════════════════════════════════════════════
    # SLIDE 8: TRACTION & PIPELINE
    # ═════════════════════════════════════════════════════════════
    slide8 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide8)
    add_chrome(slide8, "Traction & Pipeline: 25 Verified Clinics & Lending Partnerships", "Traction & Distribution", 8)

    trac_cards = [
        ("LIVE PRODUCT INFRASTRUCTURE", "Production Web Platform", COLOR_CARD_WHITE, COLOR_NAVY, """
• **Live at clinaza.in**:
  Production-ready responsive web application, chairside treatment cost simulator, and doctor onboarding portal.

• **Eligibility Engine**:
  Functional 2-minute pre-qualification workflow testing live with doctor consult rooms.

• **Zero Hardware Deployment**:
  Instant clinic QR generation deployed in seconds without field engineers.
"""),
        ("MERCHANT PIPELINE", "25 Verified Pilot Clinics", COLOR_BLUE_TINT, COLOR_BLUE, """
• **Diverse Geographic Footprint**:
  Signed clinic pipeline across **Pune, Bengaluru, Hyderabad, Mumbai, Delhi NCR, and Patna**.

• **Projected Initial GMV**:
  Conservative **₹35L to ₹45L / month** financing throughput across the initial 25-clinic cohort.

• **High-Ticket Specialization**:
  Participating clinics average ₹40,000 to ₹1,00,000 ticket sizes across implants, crowns, and aligners.
"""),
        ("LENDING PARTNERSHIPS", "Multi-Rail Agreement Pipeline", COLOR_TEAL_TINT, COLOR_TEAL, """
• **PayU Affordability**:
  Approved for zero-cost merchant onboarding covering Tier-1 credit/debit card EMI rails.

• **Flexmoney (InstaCred)**:
  9-year established cardless EMI network connecting 55+ NBFCs and banks for non-card holders.

• **DPanda FastEMI & Easebuzz**:
  Pre-approved zero-cost merchant agreement structuring for instant point-of-care checkout.
""")
    ]

    for idx, (tag, title, bg_c, text_c, content) in enumerate(trac_cards):
        cx = Inches(0.65) + idx * Inches(4.05)
        card = slide8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, top_y, col_w, col_h)
        card.fill.solid()
        card.fill.fore_color.rgb = bg_c
        card.line.color.rgb = COLOR_BORDER

        hdr = slide8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, top_y, col_w, Inches(0.65))
        hdr.fill.solid()
        hdr.fill.fore_color.rgb = bg_c
        hdr.line.color.rgb = COLOR_BORDER
        htf = hdr.text_frame
        p = htf.paragraphs[0]
        p.text = tag
        p.font.name = FONT_NAME
        p.font.size = Pt(9.5)
        p.font.bold = True
        p.font.color.rgb = text_c
        p2 = htf.add_paragraph()
        p2.text = title
        p2.font.name = FONT_NAME
        p2.font.size = Pt(12)
        p2.font.bold = True
        p2.font.color.rgb = COLOR_TEXT_PRIMARY

        body_tf = slide8.shapes.add_textbox(cx + Inches(0.2), top_y + Inches(0.75), col_w - Inches(0.4), col_h - Inches(0.85)).text_frame
        populate_card_text(body_tf, content)

    # ═════════════════════════════════════════════════════════════
    # SLIDE 9: FINANCIAL PROJECTIONS (5-YEAR)
    # ═════════════════════════════════════════════════════════════
    slide9 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide9)
    add_chrome(slide9, "Financial Roadmap: 5-Year Scaling Trajectory & Breakeven", "Financial Projections", 9)

    fin_data = [
        ("METRIC / TIMELINE", "YEAR 1", "YEAR 2", "YEAR 3", "YEAR 4", "YEAR 5"),
        ("Active Partner Clinics", "50", "250", "750", "1,800", "3,500+"),
        ("Financed Disbursal Volume (GMV)", "₹4.5 Crores", "₹24 Crores", "₹85 Crores", "₹220 Crores", "₹480 Crores"),
        ("Net Transaction Take Revenue (3%)", "₹13.5 Lakhs", "₹72 Lakhs", "₹2.55 Crores", "₹6.6 Crores", "₹14.4 Crores"),
        ("Clinic SaaS Subscriptions ARR", "₹7.5 Lakhs", "₹45 Lakhs", "₹1.5 Crores", "₹3.8 Crores", "₹8.5 Crores"),
        ("Total Net Revenue", "₹21 Lakhs", "₹1.17 Crores", "₹4.05 Crores", "₹10.4 Crores", "₹22.9 Crores"),
        ("Operating EBITDA Margin", "-45% (Seed Stage)", "+12% (Break-even M18)", "+35% (Profitable)", "+42% (Scaling)", "+48% (Market Leader)")
    ]

    t_top9 = top_y + Inches(0.2)
    tbl_shape9 = slide9.shapes.add_table(len(fin_data), 6, Inches(0.65), t_top9, Inches(12.0), Inches(4.5))
    tbl9 = tbl_shape9.table
    tbl9.columns[0].width = Inches(3.2)
    tbl9.columns[1].width = Inches(1.7)
    tbl9.columns[2].width = Inches(1.8)
    tbl9.columns[3].width = Inches(1.7)
    tbl9.columns[4].width = Inches(1.8)
    tbl9.columns[5].width = Inches(1.8)

    for r_idx, row in enumerate(fin_data):
        for c_idx, val in enumerate(row):
            cell = tbl9.cell(r_idx, c_idx)
            cell.vertical_anchor = MSO_ANCHOR.MIDDLE
            cp = cell.text_frame.paragraphs[0]
            cp.text = val
            cp.font.name = FONT_NAME
            
            if r_idx == 0:
                cell.fill.solid()
                cell.fill.fore_color.rgb = COLOR_HEADER_NAVY
                cp.font.bold = True
                cp.font.size = Pt(10.5)
                cp.font.color.rgb = COLOR_WHITE
            elif r_idx == 5: # Total revenue highlight
                cell.fill.solid()
                cell.fill.fore_color.rgb = COLOR_PAYU_TINT
                cp.font.bold = True
                cp.font.color.rgb = COLOR_GREEN if c_idx > 0 else COLOR_NAVY
                cp.font.size = Pt(10)
            else:
                cell.fill.solid()
                cell.fill.fore_color.rgb = COLOR_CARD_WHITE if r_idx % 2 == 1 else COLOR_CARD_TINT
                cp.font.bold = (c_idx == 0)
                cp.font.color.rgb = COLOR_TEXT_PRIMARY if c_idx == 0 else COLOR_TEXT_SECONDARY
                cp.font.size = Pt(9.5)

    # ═════════════════════════════════════════════════════════════
    # SLIDE 10: TEAM, USE OF FUNDS & THE ASK
    # ═════════════════════════════════════════════════════════════
    slide10 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide10)
    add_chrome(slide10, "Leadership & The Ask: Raising ₹50 Lakhs Seed Capital", "The Ask & Team", 10)

    ask_cards = [
        ("THE FOUNDER", "Pratyush Raj — Founder & CEO", COLOR_CARD_WHITE, COLOR_NAVY, """
• **5+ Years Founder Experience**:
  Founder of Mellowprints (e-commerce & logistics infrastructure). Deep experience in lean bootstrapped scaling, supplier negotiations, and digital checkout workflows.

• **Full-Stack Systems Engineer**:
  Sole architect of Clinaza's front-desk application, treatment cost simulator, and lender integration protocols.

• **Direct Doctor Network**:
  Proprietary distribution access across 1,200+ private practices in Tier-1 and Tier-2 Indian hubs.
"""),
        ("USE OF FUNDS (₹50 LAKHS)", "18-Month Runway Allocation", COLOR_BLUE_TINT, COLOR_BLUE, """
• **Product & API Integrations (35% — ₹17.5L)**:
  Direct NBFC API SDKs, automated underwriting fallbacks, and mobile app for receptionists.

• **Clinic Network Expansion (35% — ₹17.5L)**:
  Onboarding 250 verified clinics across Pune, Bengaluru, NCR, and Hyderabad.

• **Risk & Lending Compliance (20% — ₹10L)**:
  NBFC security covenants, escrow legal structuring, and regulatory licensing.

• **Working Capital & Reserves (10% — ₹5L)**:
  Operational cushion and server infrastructure.
"""),
        ("18-MONTH MILESTONES", "Clear Path to Break-Even", COLOR_PAYU_TINT, COLOR_GREEN, """
• **250 Live Partner Practices**:
  Active daily chairside usage across 4 major dental hubs.

• **₹24 Crores Cumulative Disbursals**:
  Demonstrating strong repeat volume and zero clinic default rates.

• **Month-18 Operational Breakeven**:
  Reaching **₹10L+ monthly net revenue** on pure software transaction margins.

• **Direct Contact**:
  📞 **+91 7292984244**
  ✉️ **pratyushraj@outlook.com** | **support@clinaza.in**
  🌐 **https://clinaza.in**
""")
    ]

    for idx, (tag, title, bg_c, text_c, content) in enumerate(ask_cards):
        cx = Inches(0.65) + idx * Inches(4.05)
        card = slide10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, top_y, col_w, col_h)
        card.fill.solid()
        card.fill.fore_color.rgb = bg_c
        card.line.color.rgb = COLOR_BORDER

        hdr = slide10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, top_y, col_w, Inches(0.65))
        hdr.fill.solid()
        hdr.fill.fore_color.rgb = bg_c
        hdr.line.color.rgb = COLOR_BORDER
        htf = hdr.text_frame
        p = htf.paragraphs[0]
        p.text = tag
        p.font.name = FONT_NAME
        p.font.size = Pt(9.5)
        p.font.bold = True
        p.font.color.rgb = text_c
        p2 = htf.add_paragraph()
        p2.text = title
        p2.font.name = FONT_NAME
        p2.font.size = Pt(12)
        p2.font.bold = True
        p2.font.color.rgb = COLOR_TEXT_PRIMARY

        body_tf = slide10.shapes.add_textbox(cx + Inches(0.2), top_y + Inches(0.75), col_w - Inches(0.4), col_h - Inches(0.85)).text_frame
        populate_card_text(body_tf, content)

    output_pptx = "/Users/pratyushraj/Desktop/Clinaza_Pitch_Deck_PayU_Style.pptx"
    prs.save(output_pptx)
    print(f"Presentation saved successfully as {output_pptx}")
    return output_pptx

if __name__ == "__main__":
    create_deck()
