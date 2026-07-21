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
  (eyebrows/dates/stacks/captions), `font-serif` Newsreader (testimonial quotes).
- Build sections with `Section` / `Reveal` / `Eyebrow` from
  `src/components/ui/primitives.tsx` (one subtle fade-up per section). Section ids:
  `work`, `experience`, `tech`, `about`, `testimonials`, `contact`.
- The **only** 3D is `src/components/canvas/AquariusCanvas.tsx` (@react-three/fiber
  Aquarius constellation): lazy-loaded, desktop right-column + faint mobile
  backdrop, with a reduced-motion static frame. No drei / GLTF models / WebGL
  background. Keep it lean.
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
