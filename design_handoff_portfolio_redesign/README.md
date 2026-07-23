# Handoff: lfortiz.com Portfolio Redesign ("Refined Aurora v2")

## Overview
Full redesign of Luis Ortiz's portfolio (lfortiz.com). Goal: keep the existing dark violet "aurora" identity but make it read senior and professional — cut effect overload, replace the tutorial-famous 3D gaming-desk model with a custom, personal three.js hero (the Aquarius constellation), lead with work, and trim inflated metrics.

The target codebase is the existing site repo: **React 18 + TypeScript + Vite + Tailwind + @react-three/fiber + Framer Motion + i18n (EN/ES)**. This redesign is a restyle/restructure of that app, not a new stack.

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes showing the intended look and behavior, NOT production code to copy directly. The task is to **recreate these designs inside the existing repo** (`src/components/*`, Tailwind config, i18n dictionaries) using its established patterns:
- Keep `getLocalizedContent()` / `src/constants/index.ts` as the content source; every copy change below must be made in BOTH `en` and `es` dictionaries in `src/i18n/translations.ts`.
- Rebuild the three.js visuals with **@react-three/fiber** (the repo's existing pattern), not the vanilla-three web component used in the prototype. `hero3d.js` in this bundle is reference logic (geometry math, animation constants) — port it, don't ship it.
- Keep existing accessibility patterns: reduced-motion handling, aria labels, focus rings, the honeypot contact form.

## Fidelity
**High-fidelity.** Colors, typography, spacing, and copy in `Redesign 1a v2.dc.html` are final. Recreate pixel-perfectly with the repo's Tailwind tokens (extend the config where values are new). Exception: the two project screenshots marked as striped placeholders (SocialHub, Jersey Guatemala) await real assets.

## What gets REMOVED from the current site
- 3D gaming-desk computer model (`ComputersCanvas`, `public/desktop_pc/`) and the Earth model (`EarthCanvas`, `public/planet/`) — delete assets, big payload win
- Custom cursor, aurora WebGL background shader + particle stars (`GlobalBackground`), tilt cards (`react-tilt`), magnetic buttons, marquee tech rows, `react-vertical-timeline-component`
- Gradient text animation on the name, gradient borders, glow shadows
- Stat-counter band (4+ years / 20+ projects / 2 languages / 4 areas)
- 5-star ratings on testimonials
- "Hi, I'm Luis Ortiz" greeting headline

Keep: Lenis smooth scroll (optional), scroll progress bar (optional), language toggle, section-based nav with active state.

## Design Tokens
Colors:
- `bg`: #0a0a12 (page)
- `bg-2` / card surface: #0e0e16
- hairline border: #2a2a40
- row divider (subtler): #16161f
- heading text: #ecebf4
- body text: #9ea0b8
- secondary body: #c9c8d6
- accent: #8b5cf6 (buttons, numbers)
- accent-light: #a78bfa (mono eyebrows, links hover #ddd6fe, links #c4b5fd)
- status green: #34d399
- serif quote text: #d6d4e4
- hero radial: `radial-gradient(70% 60% at 30% 0%, rgba(139,92,246,0.14), transparent 65%)`
- about card radial: `radial-gradient(60% 80% at 90% 0%, rgba(139,92,246,0.10), transparent 60%)`

Typography (Google Fonts):
- Display: **Space Grotesk** 600/700 — headlines, project/role names
- Body/UI: **Inter** 400–700
- Metadata: **IBM Plex Mono** 400–600 — eyebrows, dates, stacks, numbers, captions
- Quotes only: **Newsreader** italic 400 (opsz axis) — testimonial pull quotes

Scale: h1 62px/1.08, section h2 44px, work-row h3 26px, experience h3 19px, quote 21px/1.55, body 14–15px/1.65–1.7, mono meta 11–13px. Letter-spacing: headlines -0.02em; mono eyebrows +0.08–0.1em.

Radii: buttons 10px, cards/thumbnails 8–16px. No shadows anywhere except none — flat surfaces + 1px borders only.

Layout: max-width 1200px, 40px side padding, sections stacked with ~72px top padding.

## Screens / Sections (single page, in order)

### 1. Navbar (sticky)
`rgba(10,10,18,0.85)` + backdrop blur, 1px bottom border rgba(255,255,255,0.06). Left: existing logo.svg 20px + "Luis Ortiz" Space Grotesk 700 16px. Right (gap 28px, 14px): Work, Experience, About, Contact (#9ea0b8, white on hover/active), "EN · ES" language toggle, Resume pill (#c4b5fd text, 1px rgba(139,92,246,0.4) border, radius 8px, links /resume.pdf download).

### 2. Hero
Two-column grid 1.3fr/1fr, gap 48px, padding 110px 40px 90px, hero radial background.
Left column:
- Eyebrow (mono 13px #a78bfa): "Senior Full-Stack Engineer — TELUS Digital · Remote, worldwide"
- H1 (Space Grotesk 700 62px): "I build web and mobile products that businesses run on."
- Sub (18px #9ea0b8, max 560px): "React, TypeScript, and Node — from customer-facing apps to the internal tools that keep operations moving. Currently leading a React Native migration at TELUS; selectively taking on project work."
- Buttons: primary "Start a conversation" (#8b5cf6 bg, white, radius 10, 13×26px padding) → #contact; secondary "View work ↓" (1px #2a2a40 border) → #work
Right column: **Aquarius constellation canvas**, 440px tall, caption below right-aligned (mono 11px #6d6a85): "AQUARIUS — BORN FEBRUARY". See "Three.js hero" below.

### 3. Selected Work — numbered index
Eyebrow "SELECTED WORK" (mono 12px). Top border 1px #2a2a40; each row bottom border #16161f.
Row grid: `64px 1.1fr 1fr 320px`, gap 32px, padding 30px 0, vertically centered.
- Col 1: number "01"… mono 22px #8b5cf6
- Col 2: name (Space Grotesk 700 26px) + optional status chip inline (mono 11px #34d399 "● production"/"● live"); one-line descriptor (14px #9ea0b8); stack line (mono 12px #a78bfa)
- Col 3: one honest paragraph (14px #9ea0b8) + link
- Col 4: 320×160px thumbnail, radius 8px, 1px #2a2a40 border

Rows (exact copy in the HTML file):
1. **SocialHub** — production — nextjs 15 · nestjs · redis/bullmq · s3 — link app.lfortiz.com — *placeholder image, awaiting real screenshot*
2. **Jersey Guatemala** — live — astro 7 · typescript · i18n — *placeholder image*
3. **Portfolio Analytics** — react · nestjs · postgresql — GitHub link — uses `PortfolioShowcase.png`
4. **Socializa.io** — react · typescript · tailwind — landing.socializa.io — uses `SocializaShowcase.png`
5. **ERP for SMEs** — nextjs · typescript · prisma — GitHub link — uses `erp-showcase.png`

### 4. Experience
Eyebrow "EXPERIENCE" + h2 "Where I've worked." Row grid `220px 56px 1fr` gap 24px, padding 26px 0, dividers #16161f, top border #2a2a40.
Cols: mono date · 44px company logo (radius 10px) · title "Role · Company" (19px, company in #a78bfa) + ONE summary sentence (14px #9ea0b8, max-width 680px).
**Important copy change**: each role keeps at most one metric (TELUS ~30% timeline; Holland ~70% operational time; HMD two-week deadline; Adslive 12+ sites / 8+ AR experiences). Do NOT port the old multi-bullet, many-percentage lists. Exact sentences in the HTML file; translate for `es`.

### 5. Tech Stack
Eyebrow "TECH STACK". Three cards (grid 3 cols, gap 20px, #0e0e16 bg, 1px #2a2a40 border, radius 12px, padding 24px): `frontend`, `backend`, `infra & tools` (mono 12px #a78bfa labels). Inside: chips (flex wrap, gap 10px) — 18px tech icon + name, 13px #c9c8d6, 1px #2a2a40 border, radius 8px, 7×12px padding. Icons from `src/assets/tech/`. No marquee, no animation.
Groups: frontend = JavaScript, TypeScript, React, Angular, Remix, Redux, Tailwind; backend = Node.js, NestJS, Express, GraphQL; infra = AWS, Docker, Terraform, Git, Figma.

### 6. About
One card (1px #2a2a40, radius 16px, padding 44px, #0e0e16 + about radial), two columns split by a 1px left border on col 2 (padding-left 48px).
Left: eyebrow "ABOUT", h2 34px "Engineer first, with an eye for product.", two bio paragraphs (existing bioLead/bioSecondary content, 15px/1.7), buttons "Download resume" (primary) + "Let's talk →" (secondary).
Right: mono label "currently @ TELUS", 3 dash-prefixed lines (existing currentlyPoints), divider, note "Open to select project-based work alongside my full-time role."

### 7. Testimonials — serif pull quotes
Eyebrow "WHAT OTHERS SAY". Top border #2a2a40; 3 equal columns separated by 1px #16161f column rules (no cards, no avatars, no stars).
Quote: **Newsreader italic 21px/1.55 #d6d4e4**. Attribution 13px: name #ecebf4 600, rest #9ea0b8. Quotes trimmed to their strongest sentence(s) — exact text in HTML file.

### 8. Contact
Two columns gap 48px. Left: eyebrow "START A PROJECT", h2 "Tell me what you're building.", intro paragraph, "Prefer email? me@lfortiz.com", line "GitHub · LinkedIn — replies within 2 business days."
Right: form card (#0e0e16, 1px border, radius 16px, padding 32px): Name, Email, About the project (textarea rows 5) — inputs #0a0a12 bg, 1px #2a2a40 (focus: #a78bfa border), radius 8px, 13×16px padding; submit "Send message" primary button.
**Keep existing form logic**: validation, honeypot `company` field, `VITE_CONTACT_ENDPOINT` POST, success/error alerts, aria attributes. No Earth canvas.

### 9. Footer
Single bar, 1px top border: "© {year} Luis Ortiz" left; right links: Work, Resume, GitHub (github.com/chutluis), LinkedIn (linkedin.com/in/luis-ortiz-3b5454195), me@lfortiz.com. 13px #9ea0b8. Drop the old 3-column footer.

## Three.js hero — Aquarius constellation
Port `hero3d.js` variant `aquarius` to a @react-three/fiber component (replace `ComputersCanvas`). Reference implementation is in the bundle; key spec:
- Transparent canvas, PerspectiveCamera fov 45 at z=7
- 15 stars at real approximate positions (RA hours, Dec degrees) mapped `x = -(ra-22.05)*2.1`, `y = (dec+8.5)*0.21`, random z in ±0.4 for parallax depth. Full table + edge list (traditional stick figure incl. water-jar asterism) in `hero3d.js`.
- Bright stars (Sadalsuud β, Sadalmelik α, Skat δ) white and larger; others #a78bfa
- Lines: #a78bfa at 0.4 opacity; background starfield ~160 random faint points behind (z -1.5..-4.5)
- **Twinkle**: per star, size ±22% and opacity 0.75–1.0 on `sin(t*speed+phase)` with random speed 0.8–2.6 and phase; plus occasional flare: `max(0, sin(t*speed*0.31+phase*2.7)-0.92)*8` added to size/opacity
- Group motion: `rotation.y = sin(t*0.15)*0.18`, `rotation.x = sin(t*0.11)*0.06`, `position.y = sin(t*0.35)*0.1`; starfield `rotation.z = t*0.008`
- Cursor parallax: camera.x → mouse.x*0.8, camera.y → -mouse.y*0.5, lerp 0.04, lookAt origin
- prefers-reduced-motion: render one static frame (t≈1.5), no loop
- On mobile: hide or place behind hero text at reduced opacity — never push CTAs below the fold

## Interactions & Behavior
- Nav links smooth-scroll to sections; active section highlighted (existing `useActiveSection`)
- Section entrances: keep Framer Motion but subtle — single fade-up (24px, 0.6s ease-out) per section, no staggered spring cascades
- Buttons: background lightens on hover (#8b5cf6 → #a78bfa), 0.2s; no glow, no magnetic effect
- Work-row thumbnails: optional slight brightness raise on row hover; rows are not tilt cards
- Language toggle: existing behavior (localStorage `lfortiz-locale`)
- All external links `target="_blank" rel="noopener noreferrer"`

## State Management
No new state beyond existing: locale context, active section, contact form state. Delete state tied to removed features (cursor position, canvas loaders for removed models).

## Assets
- `assets/logo.svg`, tech icons, company logos (telus/hmd/ho/adslive), project shots (Socializa, Portfolio, ERP) — all already in the repo under `src/assets/`
- NEEDED from Luis: real screenshots of SocialHub and Jersey Guatemala (1280×640+ landscape)
- Delete: `public/desktop_pc/`, `public/planet/`, `herobg.png`

## Files in this bundle
- `Redesign 1a v2.dc.html` — **the final design** (open in a browser; sections marked with `data-screen-label`)
- `hero3d.js` — vanilla three.js reference for the Aquarius visual (variant "aquarius"; other variants can be ignored)
- `Current Site.dc.html` — recreation of the site before redesign, for diffing intent
- `assets/` — images used by the prototypes

## Suggested implementation order
1. Tailwind token updates + font swaps (add IBM Plex Mono, Newsreader; keep Space Grotesk/Inter)
2. Strip removed components/effects and their deps (`react-tilt`, `react-vertical-timeline-component`)
3. Rebuild sections top-to-bottom against the HTML reference
4. Aquarius R3F component + reduced-motion path
5. i18n: update `en` + `es` dictionaries for all new copy
6. Lighthouse pass — the payload drop from removing the GLTF models should be significant
