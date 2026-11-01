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
- `lambda/src/index.ts` is the API Gateway HTTP API handler. It validates input,
  uses the honeypot, and sends through SES; no email credentials belong in the
  frontend.

## Design system (Refined Aurora v2)

- Flat, editorial, dark-violet. **1px hairline borders, no shadows/glows.** Tokens
  live in `tailwind.config.ts` + CSS vars in `src/index.css` (page `#0a0a12`, card
  `#0e0e16`, border `#2a2a40`, accent `#8b5cf6`/`#a78bfa`).
- Fonts: `font-display` Space Grotesk, `font-sans` Inter, `font-mono` IBM Plex Mono
  (eyebrows/dates/stacks/captions), `font-serif` Newsreader (testimonial quotes and the single hero headline accent).
- Hero is a centred stardust poster: meta row (role, edition year, live Guatemala time), standfirst intro + CTAs top-left, and the two-part masked headline (`headlineLead` / Newsreader-italic `headlineAccent`) set huge across the bottom. On desktop the whole stage is the scene anchor. Hebe is rendered as a ~90k-particle point cloud (36k on mobile) sampled from `hebe.glb` over an invisible depth-only occluder: she assembles from stardust after the constellation draws, her base turns to drifting dust, scrolling away blows her into stardust, and a fine pointer gently parts the particles. Constellation edges are stippled; a faint dust field drifts in depth behind her. The full `headline` string stays as the screen-reader text.
- Build sections with `Section` / `Reveal` / `SectionHead` from
  `src/components/ui/primitives.tsx` (one subtle fade-up per section). Sections open with
  `SectionHead` — a hairline, a mono index `01`–`06` plus label rail over 3 columns, and a
  Space Grotesk 500 title over 9 columns — and content sits in columns 4–12 on desktop.
  Shared `buttonClass` / `textLinkClass` / `ArrowRight` keep CTAs consistent.
  Weights: hero h1 600, section h2 500, item h3 500. Accent violet is reserved for CTAs,
  links, the hero accent word, section indices, and the scene. Section ids:
  `work`, `experience`, `tech`, `about`, `testimonials`, `contact`.
- The **only** 3D is the Aquarius constellation in `src/components/canvas/SceneLayer.tsx`
  (@react-three/fiber), mounted once as a fixed full-viewport scene behind page content.
  This is a user-approved exception to “no WebGL background”: geometry is still anchored
  to the desktop hero stage or the mobile statue stage via the three-free `sceneStore`, so it stays
  visually locked during scroll. Its ticker subscriber runs after Lenis on the shared
  `src/lib/ticker.ts`; it plays a one-time draw-in and edge pulses. `Hero.tsx` keeps the
  matching SVG fallback in the anchor until the scene is ready, with a short crossfade,
  and shows it again if WebGL is lost.
  A separate document-pixel River (body, bright core filament, spray edges, travelling surges) follows section anchors, widening and brightening downstream, then falls as an accelerating sheet onto Contact's top hairline at centre. From that hairline to the end of the page (behind the footer) a full-bleed particle lake fills the background: a meniscus line on the hairline, a plunge glow, travelling ripple rings, slow downstream drift, twinkling glints, splash, and the reflected Aquarius in the open water below the form. A calm mask softens the lake behind the Contact text and footer. Reduced motion shows the lake settled; the static SVG fallback stays in `#river-pool`.
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
