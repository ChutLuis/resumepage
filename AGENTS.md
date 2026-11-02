# Repository Guide

## Validation

- Root frontend checks: `npm run lint && npm run build`. `npm run build` runs the
  TypeScript check before the Vite production build.
- The contact Lambda is a separate package. For Lambda changes run:
  `cd lambda && npm install && npx tsc --noEmit && npm run package`.
  This produces the ignored `lambda/function.zip` upload artifact.

## Structure

- `src/main.tsx` mounts the application. `src/App.tsx` lazy-loads portfolio
  sections; preserve this split when changing section-level components.
- `src/i18n/` owns EN/ES dictionaries, locale persistence (`lfortiz-locale`), and
  runtime metadata/JSON-LD updates. Locale-aware resume data is created by
  `getLocalizedContent()` in `src/constants/index.ts`; do not add user-facing copy
  to only one locale.
- `src/hooks/useGuatemalaTime.ts` is the single source of the live Guatemala
  clock, used by both the hero meta row and Contact's local-time note.
  `src/components/work/PlatformSchematic.tsx` renders the featured case study's
  layer diagram (screen → platform → server) from `t.work.schematic`.
- `lambda/src/index.ts` is the API Gateway HTTP API handler. It validates input,
  uses the honeypot, and sends through SES; no email credentials belong in the
  frontend.

## Design system (Refined original)

- Flat, dark-violet, premium-portfolio restraint. **1px borders, no shadows/glows/gradients.**
  Tokens live in `tailwind.config.ts` + CSS vars in `src/index.css` (page `#0a0a12`, surface
  `#0e0e16`, border `#2a2a40`, control `#5f5c78` for input borders and link underlines,
  caption `#7c7996`, accent `#a78bfa`/`#c4b5fd`). Radii: `rounded-md` (6px) on buttons,
  images, tags and inputs; `rounded-xl` (12px) on panels.
- Fonts: `font-display` Space Grotesk (500; 600 only for the hero h1 and nav wordmark),
  `font-sans` Inter for all other text, `font-mono` IBM Plex Mono **only** for dates, times
  and stack strings (13px, lowercase, never uppercase or tracked). No serif or italic display.
- Type scale is the named `fontSize` tokens in `tailwind.config.ts` — use them, not arbitrary
  `text-[Npx]`: `text-display-hero` (84→44), `-mailto` (60→32), `-section` (44→32), `-stat`,
  `-feature` (32→26), `-statement` (28→22), `-item` (24→20), `text-lead` 18, `text-copy` 16,
  `text-small` 14, `text-label` 13. Display sizes are width-fluid only; the hero is always the
  largest type on the page.
- Primary CTA is `buttonClass` (white fill, ink text); `buttonSmClass` in the nav;
  `textLinkClass` for secondary links; `tagClass` for stack/schematic tags; `ArrowUpRight` for
  outbound links. Violet is reserved for links, section labels, small status dots and the scene.
- Hero is a centred stardust poster: meta row (role, edition year, live Guatemala time), standfirst intro + CTAs top-left, the two-part masked headline (`headlineLead` in heading colour / `headlineAccent` in muted colour, same face) across the bottom, and a four-stat proof strip (`hero.proof`) under it. On desktop the whole stage is the scene anchor. Hebe is rendered as a ~90k-particle point cloud (36k on mobile) sampled from `hebe.glb` over an invisible depth-only occluder: she assembles from stardust after the constellation draws, her base turns to drifting dust, scrolling away blows her into stardust, and a fine pointer gently parts the particles. Constellation edges are stippled; a faint dust field drifts in depth behind her. The full `headline` string stays as the screen-reader text.
- Build sections with `Section` / `Reveal` / `SectionHead` from
  `src/components/ui/primitives.tsx`. `SectionHead` is a direct child of `Section`, *outside*
  `Reveal`: it plays the hero's own motion language — the hairline draws in, then the title
  words rise out of a mask — and the body content keeps one subtle fade-up (`Reveal`). It
  renders a sentence-case violet label over a 44px Space Grotesk 500 title, plus an optional
  `aside` note (e.g. `fillTemplate(t.work.extent, { count })`). No numbered indices. Its rule is
  an absolutely-positioned `motion.span`, not a border, and the header's top edge is the
  surface SceneLayer measures Contact's hairline from — keep `SectionHead` the first in-flow
  child of `#contact`. Shared `buttonClass` / `textLinkClass` / `tagClass` / `ArrowRight` /
  `ArrowUpRight` / `StatusDot` / `EASE` keep CTAs and motion consistent. Weights: hero h1 600,
  section h2 500, item h3 500. Each section keeps one signature device: the hero proof strip,
  the featured Work layer panel plus equal 16:10 project cards, dated role rows (Experience),
  tool tags with "used in" notes (Tech), the statement plus quick-facts strip (About), the lead
  quote plus quote panels (Testimonials), and the large mailto finale (Contact). Section ids:
  `work`, `experience`, `tech`, `about`, `testimonials`, `contact`.
- Elements tagged `data-scene-calm` are measured by `SceneLayer` and passed to the River
  shader so the stream dims behind body text instead of crossing it. Tag **content wrappers
  only**, never the hero, Contact or Footer, and keep the total at or under
  `MAX_RIVER_CALM_RECTS` (8).
- The **only** 3D is the Aquarius constellation in `src/components/canvas/SceneLayer.tsx`
  (@react-three/fiber), mounted once as a fixed full-viewport scene behind page content.
  This is a user-approved exception to “no WebGL background”: geometry is still anchored
  to the desktop hero stage or the mobile statue stage via the three-free `sceneStore`, so it stays
  visually locked during scroll. Its ticker subscriber runs after Lenis on the shared
  `src/lib/ticker.ts`; it plays a one-time draw-in and edge pulses. `Hero.tsx` keeps the
  matching SVG fallback in the anchor until the scene is ready, with a short crossfade,
  and shows it again if WebGL is lost.
  A separate document-pixel River (body, bright core filament, spray edges, travelling surges) follows section anchors, widening and brightening downstream, then narrows into discrete strands and falls as an accelerating sheet onto Contact's top hairline at centre. It dims to 35% behind anything tagged `data-scene-calm`, so the stream passes under body text rather than across it. From that hairline to the end of the page (behind the footer) a full-bleed particle lake fills the background: a meniscus line that is bright at the impact and fades out before the gutters, a plunge glow, perspective-flattened ripple rings, horizontal shimmer streaks, twinkling glints, splash, and the reflected Aquarius in the open water — each reflected star smearing downwards into a short streak. A calm mask darkens the lake behind the Contact text and footer, and a `#contact-reflection` band anchors the reflection. Reduced motion shows the lake settled; the static SVG fallback stays in `#river-pool`.
  The footer colophon credits the Hebe scan (Bertel Thorvaldsen, SMK) via `footer.colophon*` keys.
  The one approved model exception is `src/assets/hebe.glb`, loaded only by the lazy scene
  with GLTFLoader + MeshoptDecoder; the SVG fallback remains statue-free. Credit: Bertel
  Thorvaldsen, Hebe, 1816 (plaster cast KAS 2918), SMK – Statens Museum for Kunst,
  open.smk.dk/artwork/image/KAS2918, Public Domain Mark; 3D scan by SMK.
  Mobile layer alpha is dimmed in the shaders. Reduced motion uses native scrolling and
  renders a static settled frame only when scroll, layout, resize, or ready state is dirty.
  Soft star halos and particle glow are allowed **only inside this scene** (UI keeps no shadows/glows/
  gradients). No drei / postprocessing. Keep it lean.
- Selected Work rows come from `workItems` in `src/constants/index.ts`; thumbnails
  are `src/assets/*-showcase.jpg`.

## Deployment Constraints

- AWS Amplify builds and hosts `main`. `VITE_CONTACT_ENDPOINT` is a build-time,
  public endpoint URL, so changing it requires an Amplify rebuild. Never put AWS
  credentials in a `VITE_*` variable.
- The contact API is API Gateway `POST /contact` -> Lambda -> SES in `us-east-1`.
  Keep Lambda CORS and `ALLOWED_ORIGINS` limited to `https://lfortiz.com` and
  `https://www.lfortiz.com` unless temporarily testing localhost.
- Lambda deployment details, IAM limits, and test event are in `lambda/README.md`;
  the production release checklist is in `DEPLOYMENT.md`.
