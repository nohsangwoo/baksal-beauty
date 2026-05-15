---
name: baksal-beauty-design-system
description: Preserve and extend the BAKSAL Beauty plastic surgery website design system. Use when Codex adds or modifies BAKSAL Beauty pages, components, sections, forms, service cards, blog pages, doctor profiles, inquiry flows, or any frontend UI so future work keeps the same luxury Korean aesthetic clinic visual language, spacing, typography, colors, motion, and content tone.
---

# BAKSAL Beauty Design System

Use this skill whenever editing UI in this repository. The goal is not to recreate a template; it is to keep every new feature aligned with the first homepage direction.

## Core Direction

- Build a premium Korean plastic surgery and aesthetic medicine experience.
- Keep the mood refined, calm, clinical, and luxurious.
- Prefer deep wine, warm black, champagne gold, ivory, and restrained rose accents.
- Use real or generated editorial medical/aesthetic photography as a first-class design material.
- Avoid SaaS dashboards, generic landing-page gradients, decorative blobs, playful icons, and loud marketing composition.

## Visual Rules

- Use dark full-width sections, not nested page cards.
- Use cards only for repeated items, doctors, products, blog entries, forms, and framed tools.
- Keep card radius at `8px` or less.
- Use `Cormorant Garamond` for large editorial headings and `Noto Sans KR` for Korean body/interface text.
- Keep letter spacing at `0` for display text; use uppercase tracking only for small eyebrow labels.
- Use gold only as emphasis, not as a full-page dominant color.
- Use rose CTA buttons sparingly for primary actions.
- Use lucide icons for buttons and form/action affordances.
- Keep section rhythm generous: desktop vertical padding around `py-24 md:py-32`, constrained content with `.section-shell`.

## Component Patterns

- Hero: full-bleed photographic background, dark overlay, brand visible in the first viewport, CTA pair.
- Philosophy: editorial image plus large principle-led copy; avoid feature explanations inside visible UI.
- Services: interactive tabs or structured treatment cards with photography, short lists, and consultation CTA.
- Before/after: use an interactive slider, clear labels, and conservative copy that avoids guaranteed outcomes.
- Inquiry: keep the form simple: name, phone, interest, preferred channel, message.
- Doctors: dark cards, circular portraits, specialty label, profile CTA.
- Blog: image-first cards with category, title, and read-more action.
- Footer: include LUDGI company details unless a final hospital legal footer replaces it.

## Copy Tone

- Korean copy should sound premium and restrained, not salesy.
- Avoid guaranteed results, exaggerated efficacy, "best", "No.1", "discount", "event price", or aggressive comparison.
- For medical/procedure cost sections, prefer Korean wording equivalent to "guided after consultation", "may vary by individual scope", and "provided after medical consultation".
- Keep user-facing text about the clinic, not about implementation details.

## Files To Check

- `src/app/globals.css` for tokens and reusable classes.
- `src/i18n/dictionaries.ts` for localized content.
- `src/components/home-interactions.tsx` for client-side UI patterns.
- `public/images/` for generated and source visual assets.

Read `references/visual-system.md` when changing colors, spacing, typography, motion, or section composition.
