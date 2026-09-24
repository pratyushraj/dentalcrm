# Clinaza Instagram Carousel Design Guidelines & Preferences

When the user asks to generate an Instagram carousel post for Clinaza (`@clinaza.in`), adhere strictly to the following verified design preferences:

## 1. Visual & Photographic Style
- **Real Authentic Photography**: Never use empty, flat plain-colored backgrounds or generic low-contrast templates. Every slide must feature or integrate authentic, photorealistic clinic photography (Indian dentists, reception areas, patient consultations, or clinical signage).
- **No Recycled Old Reel Assets**: Do not reuse the generic `assets/reel/*` photos from previous campaigns. Use fresh or specialized clinic assets from `assets/carousel_v2/` or real clinic photography.
- **High Visual Contrast & Readability**: Always use gradient overlays (`linear-gradient(180deg, rgba(2,6,23,0.92) ...)`) behind floating cards so white and colored text pops crisply on mobile screens.

## 2. Typography & Text Hierarchy (Mobile-Optimized)
- **Large Text Only**: No small, wall-of-text copy or long paragraphs. Dentists scroll fast on mobile Instagram.
  - **Slide 1 Hook Headline**: 54px - 60px bold/black font.
  - **Secondary Headers**: 44px - 54px.
  - **Dialogue Quotes / Key Script lines**: 24px - 28px bold.
  - **Card Titles**: 22px - 26px bold.
  - **Card Body / Explanations**: 18px - 20px semi-bold.
  - **CTA Button Text**: 22px - 26px bold.
- **Punchy Formats**: Use comparison chips, strike-through price reframing (e.g. ~~₹55,000~~ vs ₹2,400/mo), and quick 1-sentence takeaways with clear emoji markers (❌, ✅, 💡, 👉).

## 3. Brand Identity & Logo Prominence
- **Clinaza Logo Size**: Keep the Clinaza logo prominent in the top bar (`width: 58px, height: 58px` or larger, rounded corners, drop shadow).
- **Brand Text**: "CLINAZA" in 24px+ bold lettering with a clear uppercase category badge (e.g. `DENTAL REVENUE`, `WHAT NOT TO DO`, `THE 10-SECOND SCRIPT`).
- **Footer**: Include `@clinaza.in` pill badge and clear swipe/save action indicators.

## 4. Content Angles & Messaging
- Focus on practical, clinic-revenue pain points: overcoming patient price objections, eliminating clinic discounts, stopping bad clinic debt (*khata*), and enabling instant point-of-care patient healthcare EMIs.
- **Never claim 0% interest or zero-interest EMIs**: Always frame financing as *flexible monthly EMIs*, *easy paperless EMIs*, or *instant front-desk patient financing* unless explicitly instructed.
- Do not make generic NABH or compliance-heavy content unless explicitly requested.

## 5. Remotion Technical Rendering
- **Dimensions**: Standard 4:5 Instagram Portrait: `1080 x 1350`.
- **Render Command**: Always pass `--gl=angle` when running `npx remotion still` on macOS to avoid GPU shader crashes:
  ```bash
  npx remotion still src/remotion.entry.tsx <CompositionId> <OutputPath> --gl=angle
  ```
