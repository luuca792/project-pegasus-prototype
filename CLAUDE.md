# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A UI prototype for **NTN Gaming**, an internet cafe / gaming lounge store in Trà Vinh, Vietnam. Currently a single landing page ("front page") built to hook prospective guests — hero, venue photo gallery, services, pricing teaser, footer with contact info. All copy is in Vietnamese. Pricing and some contact details are placeholder/illustrative — flag this when discussing them, don't treat them as real business data without confirming with the user.

Scaffolded to match the stack and conventions of a sibling project, `project-odysseus-prototype` (different app, different visual style — do not copy its design, only its tooling conventions).

## Commands

```bash
npm run dev       # start Vite dev server (http://localhost:5173/)
npm run build     # tsc -b && vite build
npm run lint      # oxlint
npm run preview   # preview the production build
```

No test suite is configured yet. There is no `.git` repo initialized in this directory yet — do not assume git history is available.

## Stack

- React 19 + TypeScript, Vite 6
- **CSS Modules** for styling (`*.module.css` next to each component) — not Tailwind, not styled-components
- **react-router-dom** for routing (currently a single `/` route)
- **lucide-react** for icons — check that an icon name actually exists in the installed version before using it (see gotcha below)
- **oxlint** for linting (`.oxlintrc.json`)

## Architecture

- `src/main.tsx` — entry point, wraps `<App />` in `<BrowserRouter>`, imports `styles/global.css`
- `src/App.tsx` — route table (`react-router-dom` `<Routes>`)
- `src/pages/LandingPage/LandingPage.tsx` — composes the front page from section components in declared order (Header, Hero, Gallery, Services, Pricing, Footer)
- `src/components/<Name>/<Name>.tsx` + `<Name>.module.css` — one folder per component/section, colocated styles
- `src/styles/tokens.css` — all design tokens (colors, spacing, typography, radius, shadow) as CSS custom properties on `:root`. **Every color, spacing value, and font in the app should flow through these tokens** — don't hardcode hex colors or px values in component CSS.
- `src/styles/global.css` — resets, base element styles, imports `fonts.css` and `tokens.css`
- `src/styles/fonts.css` — Google Fonts `@import`
- `src/assets/images/` — store photography and logo, copied in from `data/` at project root (see below)

### Design tokens / theme

Single dark theme (no light/dark toggle — this is a nightlife/gaming venue, dark is the only look). Brand colors are red/black, taken from `data/logo.png`. Key tokens in `tokens.css`:

- `--color-primary` / `-light` / `-dark` — the brand red
- `--color-bg`, `--color-surface`, `--color-surface-alt` — dark neutrals for background layering
- `--font-heading` — **Barlow Condensed** (tall/condensed esports look)
- `--font-body` — **Be Vietnam Pro** (Vietnamese-native font, full diacritic support)
- `--space-1` through `--space-9` — spacing scale
- `--content-width` — max page width for section inner containers

**Font gotcha:** the original heading font (Rajdhani) broke on several Vietnamese diacritic combinations (e.g. ề, ặ, ữ rendered as missing/broken glyphs). It was replaced with Barlow Condensed, which has full Vietnamese coverage and a similar tall/condensed feel. If changing `--font-heading` again, verify Vietnamese glyph support first — don't assume a Google Font supports the `vietnamese` subset just because it looks like a fit stylistically.

### Assets

`data/` at the project root holds the source-of-truth store assets provided by the user (logo + venue photos), and is *not* imported from directly. Working copies live in `src/assets/images/` (`logo.png`, `store-1.jpg` … `store-4.jpg`) and `public/favicon.png`. If the user provides new/replacement photos in `data/`, copy them into `src/assets/images/` under descriptive names before importing them into components — don't import straight from `data/`.

## Known gotchas

- **lucide-react brand icons are gone.** This installed version does not export social/brand icons like `Facebook` — importing one throws a runtime `SyntaxError` (module doesn't provide that export) that only surfaces in the browser console, not at build/lint time. Use a generic icon (e.g. `MessageCircle`) or an inline SVG instead when you need a brand mark.
- After any UI change, actually load the page (dev server + browser) and check the console — several classes of error here (missing icon exports, broken font glyphs) don't show up as TypeScript or lint errors.
