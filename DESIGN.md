# Clinaza Design System (DESIGN.md)

> **Official Semantic Design System & Brand Specification**  
> Tailored for Clinaza (`@clinaza.in`) — India's Point-of-Care Patient Healthcare Financing & Dental Practice OS.

---

## 1. Aesthetic Identity & Design Philosophy

Clinaza's visual language bridges **institutional medical trust** with **high-velocity modern fintech**. It rejects generic SaaS layouts, flat plain colors, and low-contrast palettes in favor of:
* **Medical Credibility**: Clean white canvases (`#FFFFFF`, `#F8FAFC`) grounded by institutional navy (`#0B2450`).
* **Fintech Conversion**: Vibrant electric blue accents (`#0867E8`) with subtle pulse indicators and high-contrast typography.
* **Precision Depth**: Frosted-glass layered surfaces (`backdrop-blur-xl bg-white/90 border border-slate-200/90`) with soft atmospheric drop shadows (`shadow-[0_8px_32px_rgba(15,23,42,0.08)]`).
* **Mobile-First Touch Ergonomics**: Minimum `44px` interactive touch targets, minimum `16px` font size on inputs to avoid iOS Safari auto-zoom, and zero horizontal scroll.

---

## 2. Color Palette & Semantic Tokens

### Primary Institutional Palette
* **Navy Hero / Text Primary**: `#0B2450` — Used for headlines, brand text, high-emphasis text, and dark institutional banners.
* **Fintech Electric Blue (Primary Action)**: `#0867E8` (Hover: `#0756C7`, Active: `#0647A6`) — Used for primary CTAs, active procedure chips, selection rings, and brand highlights.
* **Pine Labs Emerald (Verified / Growth / Success)**: `#10B981` (Accent: `#059669`, Subtitle: `#0f7a75`) — Used for live status pulses, gateway badges, verified checkmarks, and T+1 disbursement indicators.
* **Neutral Slate Surface**: `#F8FAFC` (Page Background), `#F1F5F9` (Muted Cards), `#E2E8F0` (Borders).

### Color Token Reference Table
| Token Name | Hex Code | OKLCH Equivalent | Usage |
| :--- | :--- | :--- | :--- |
| `--brand-navy` | `#0B2450` | `oklch(0.24 0.08 260)` | Main headings, brand mark, dark container cards |
| `--brand-blue` | `#0867E8` | `oklch(0.55 0.22 260)` | Primary buttons, active state chips, links |
| `--brand-blue-hover` | `#0756C7` | `oklch(0.48 0.21 260)` | Button hover state |
| `--brand-emerald` | `#10B981` | `oklch(0.72 0.17 160)` | Success indicators, live pulse, verified tags |
| `--surface-bg` | `#F8FAFC` | `oklch(0.98 0.005 240)` | Body background |
| `--surface-card` | `#FFFFFF` | `oklch(1.00 0.000 0)` | Card containers, floating pill navbar |
| `--border-subtle` | `#E2E8F0` | `oklch(0.92 0.008 240)` | Dividers, card borders, pill borders |
| `--text-muted` | `#64748B` | `oklch(0.56 0.025 240)` | Secondary body, metadata, captions |

---

## 3. Typography & Hierarchy

### Font Families
* **Interface & Body (`font-jakarta`)**: `Plus Jakarta Sans`, `-apple-system`, `BlinkMacSystemFont`, `system-ui`, `sans-serif`
  - High legibility at small sizes (10px–13px) for dense medical charts, financial tables, and mobile nav.
* **Editorial & Institutional Headings (`font-editorial`)**: `Cormorant Garamond`, `Georgia`, `serif`
  - Used sparingly for prestige clinic headlines and healthcare authority banners.
* **Metrics & Financial Numbers (`font-sora` / `font-mono`)**: `Sora`, `DM Mono`, `monospace`
  - Tabular numeric alignment for loan amounts (₹30,000–₹5,00,000), monthly EMIs, and interest calculations.

### Type Scale (Mobile to Desktop)
* **Hero Hook Headline**: `text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight` (Line-height: 1.1)
* **Section Headers (H2)**: `text-2xl sm:text-4xl font-extrabold tracking-tight text-[#0B2450]`
* **Sub-headers & Card Titles (H3)**: `text-lg sm:text-xl font-bold text-[#0B2450]`
* **Body Text**: `text-sm sm:text-base text-slate-600 leading-relaxed`
* **Micro-Pills & Badges**: `text-[9px] sm:text-[11px] font-black uppercase tracking-wider`
* **Button Labels**: `text-xs sm:text-sm font-extrabold tracking-wider`

---

## 4. Component Patterns

### 1. Floating Pill Navigation
* **Container**: `fixed top-3 sm:top-5 inset-x-0 z-50 max-w-7xl mx-auto px-3 sm:px-6 pointer-events-none`
* **Nav Element**: `pointer-events-auto bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-full px-3.5 sm:px-5 py-2 sm:py-2.5 shadow-[0_8px_32px_rgba(15,23,42,0.08)] flex items-center justify-between gap-2 sm:gap-3`
* **Breakpoints**:
  - `< 640px` (Mobile): Icon logo + Login button + "Onboard" CTA.
  - `640px – 1023px` (Tablet): Full brand text + "Doctor Login" + "Onboard • ₹999".
  - `>= 1024px` (Laptop/Desktop): Center navigation links visible with `whitespace-nowrap shrink-0`.
  - `>= 1280px` (Widescreen): Full subtitle `"Point-of-Care Patient Financing"` + `"Onboard Clinic • ₹999"`.

### 2. Procedure Preset Chips (1-Tap Switchers)
* Interactive quick-switchers for top dental procedures (Implants, Aligners, Full Arch, Smile Makeovers):
* **Active State**: `bg-[#0867E8] text-white border-transparent shadow-[0_4px_16px_rgba(8,103,232,0.25)]`
* **Inactive State**: `bg-white/80 hover:bg-slate-100 text-slate-700 border-slate-200`
* **Layout**: `flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all`

### 3. Front-Desk WhatsApp Live Simulator
* Clean two-tone chat preview with authentic WhatsApp header (Emerald `#075E54` / `#128C7E`), authentic outgoing chat bubbles (`#E7FFDB`), and 1-tap deep links with prefilled templates.

### 4. Categorized FAQ Search & Accordion
* Pill tabs for audience segments: **Dental Clinics**, **Patients**, and **RBI / Lending Compliance**.
* Real-time search query filtering with instant highlight.

---

## 5. Layout & Spacing Rules

* **Page Content Container**: `max-w-6xl mx-auto px-4 sm:px-6`
* **Floating Header Container**: `max-w-7xl mx-auto px-3 sm:px-6`
* **Touch Target Constraint**: Every clickable element (`<button>`, `<a>`, `<input>`) must maintain a minimum bounding box of `min-h-[44px]` on mobile devices.
* **Form Inputs**: Inputs must have `text-base sm:text-sm` (font-size >= 16px on viewports < 640px) to prevent iOS Safari auto-zoom.

---

## 6. Motion & Micro-Interactions

* **Hover Scale**: `group-hover:scale-105 active:scale-95 transition-transform duration-200`
* **Live Pulse**: `w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse`
* **Section Entrance**: Smooth cubic-bezier transitions `[transition-timing-function:cubic-bezier(0.22,1,0.36,1)]`
* **Accessibility**: Respects `prefers-reduced-motion: reduce` across all animated elements.

---

## 7. Regulatory & Messaging Guardrails

* **Financing Terms**: **NEVER claim 0% interest or zero-interest EMIs**. Always frame financing as *flexible monthly EMIs*, *easy paperless EMIs*, *instant front-desk patient financing*, or *subvented merchant EMIs*.
* **Lender Compliance**: Clearly state Pine Labs (`MID: 111077`) as the official technology infrastructure partner and 55+ RBI-regulated commercial banks / NBFCs as the credit grantors.
* **Payment Collection**: Razorpay is strictly the payment collector for clinic onboarding fees (₹999).
