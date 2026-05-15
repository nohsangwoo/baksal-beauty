# BAKSAL Beauty Visual System

## Palette

- Background: `#1f1715`, `#241b18`, `#160d12`, `#0d0b0c`
- Ink/black: `#110d0f`
- Wine: `#3b0719`
- Rose CTA: `#d62f55`
- Blush accent: `#e38aa0`
- Champagne gold: `#dec47b`
- Sand/skin neutral: `#d9c1ad`
- Muted body text: `#b6aaa6`

Use these through CSS variables in `src/app/globals.css` where possible.

## Typography

- Display: `Cormorant Garamond`
- Interface/body: `Noto Sans KR`
- Mono: `Geist Mono`

Display headings can be large and editorial. Compact panels, buttons, nav, and forms must use smaller Noto Sans KR text for legibility.

## Layout

- Use `.section-shell` for constrained inner content.
- Prefer full-width bands for major sections.
- Keep desktop grids simple: 2-column editorial sections and 3/4-column repeated cards.
- Mobile should stack naturally; keep primary CTAs full width when helpful.
- Do not place UI cards inside other UI cards.

## Imagery

- Use realistic, elegant, medically appropriate adult subjects.
- Avoid explicit nudity, sensational before/after claims, or images that imply guaranteed medical results.
- Generated images should contain no text, logos, watermarks, UI, labels, or frames.

## Motion

- Use subtle hover scale on images.
- Use marquee only for treatment exploration, and respect `prefers-reduced-motion`.
- Avoid excessive entrance animations; this brand should feel composed.
