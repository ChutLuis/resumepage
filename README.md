# Luis Ortiz — Developer Portfolio

Personal portfolio / resume site for **Luis Ortiz**, a Senior Full-Stack Engineer.
Single-page React app — **"Refined Aurora v2"**: a flat, editorial, dark-violet
design with one custom three.js moment (an Aquarius constellation hero).

Live site: <https://www.lfortiz.com/>

## Tech stack

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** with a token-driven design system (`tailwind.config.ts` + CSS
  vars in `src/index.css`)
- **Framer Motion** for a single subtle fade-up per section
- **three.js** via **@react-three/fiber** — used only for the lazy-loaded Aquarius
  constellation hero (`src/components/canvas/AquariusCanvas.tsx`)
- **English/Spanish i18n** with browser-language detection and a persistent
  language preference
- **AWS Amplify Hosting** (auto-builds `main`)
- **AWS Lambda + API Gateway + Amazon SES** for secure contact-form delivery

## Getting started

Requires Node.js (this repo uses **npm** and nvm).

```bash
npm install
npm run dev      # start the Vite dev server (set VITE_CONTACT_ENDPOINT for the form)
```

## Scripts

| Command           | Description                                  |
| ----------------- | -------------------------------------------- |
| `npm run dev`     | Start the local dev server with HMR          |
| `npm run build`   | Type-check (`tsc`) and build for production  |
| `npm run preview` | Preview the production build locally         |
| `npm run lint`    | Run ESLint (fails on warnings)               |

## Environment variables

The contact form posts to a Lambda API. Create a `.env` file in the project root:

```bash
VITE_CONTACT_ENDPOINT=https://your-api-id.execute-api.us-east-1.amazonaws.com/contact
```

This URL is public by design. The Lambda holds no browser-exposed credentials.

## Languages and content

The site supports English and Spanish. On a first visit, Spanish is selected when
the browser language starts with `es`; otherwise English. Visitors can override
this from the language toggle, and the preference is stored locally as
`lfortiz-locale`.

Translations and locale-aware metadata live in `src/i18n/`. Resume content is
localized through `getLocalizedContent()` in `src/constants/index.ts`. **Every
user-facing string must exist in both `en` and `es`.**

## Project structure

```
src/
  components/          UI sections: Navbar, Hero, Works, Experience, Tech, About, Feedbacks, Contact, Footer
    canvas/            AquariusCanvas — @react-three/fiber constellation hero (lazy-loaded)
    ui/                primitives.tsx (Section / Reveal / Eyebrow), LanguageToggle, ScrollProgress
  constants/           Selected Work items, experience, testimonials, tech groups (+ getLocalizedContent)
  i18n/                Locale context + EN/ES dictionaries + runtime metadata/JSON-LD updates
  hooks/               useActiveSection (nav active-state)
  assets/              Images, tech icons, project screenshots (*-showcase.jpg), LF logo
  lib/                 scrollState (Lenis velocity/progress)
  types/               Shared types
lambda/                TypeScript SES contact endpoint and deployment instructions
public/                resume.pdf, robots.txt, sitemap.xml, lf-logo.svg, lf-logo-512.png
```

To update resume content (Selected Work, experience, skills, testimonials), edit
`src/constants/index.ts` and the matching copy in `src/i18n/translations.ts`.

## Design system (Refined Aurora v2)

- Flat surfaces, **1px hairline borders, no shadows/glows**. Page `#0a0a12`, cards
  `#0e0e16`, border `#2a2a40`, accent violet `#8b5cf6` / `#a78bfa`.
- Fonts: **Space Grotesk** (display), **Inter** (body), **IBM Plex Mono**
  (eyebrows, dates, stacks, captions), **Newsreader** italic (testimonial quotes).
- Sections are built with `Section` / `Reveal` / `Eyebrow` from
  `src/components/ui/primitives.tsx`. Section ids: `work`, `experience`, `tech`,
  `about`, `testimonials`, `contact`.

## Deployment

AWS Amplify builds and hosts `main` — **every push auto-deploys**. Add
`VITE_CONTACT_ENDPOINT` to the Amplify branch environment; Vite embeds it at build
time. The endpoint URL is public, but AWS credentials must never be added to
`VITE_*` variables.

See [`DEPLOYMENT.md`](DEPLOYMENT.md) for the Amplify release process and the
contact-form verification checklist.

## Contact API

The `lambda/` directory contains the TypeScript contact-form endpoint. It validates
submissions, discards honeypot spam, and sends mail with Amazon SES. See
[`lambda/README.md`](lambda/README.md) for the build and AWS Console setup steps.
