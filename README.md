# Luis Ortiz — Developer Portfolio

Personal portfolio / resume site for **Luis Ortiz**, a Full-Stack Software Engineer.
Built as a single-page React app with interactive 3D visuals.

Live site: <https://www.lfortiz.com/>

## Tech stack

- **React 18** + **TypeScript** + **Vite**
- **Three.js** via **@react-three/fiber** and **@react-three/drei** (3D models, particle background, animated globe)
- **Tailwind CSS** for styling
- **Framer Motion** for section/scroll animations
- **English/Spanish i18n** with browser-language detection and a persistent language preference
- **AWS Amplify Hosting** for the static site
- **AWS Lambda + API Gateway + Amazon SES** for secure contact-form delivery

## Getting started

Requires Node.js (see `.nvmrc` if present). This project uses **npm**.

```bash
npm install
npm run dev      # start the Vite dev server
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
the browser language starts with `es`; otherwise English is selected. Visitors can
override this from the language toggle, and their preference is stored locally as
`lfortiz-locale`.

Translations and locale-aware metadata live in `src/i18n/`. Resume content is
localized through `getLocalizedContent()` in `src/constants/index.ts`.

## Project structure

```
src/
  components/        UI sections (Hero, About, Experience, Works, Contact, ...)
    canvas/          Three.js canvases (Computers, Earth, Ball, Stars)
  constants/         Resume content: experience, projects, testimonials, tech
  assets/            Images and logos
  hoc/               Section wrapper HOC
  utils/             Animation helpers
  i18n/              Locale context and English/Spanish dictionaries
lambda/               TypeScript SES contact endpoint and deployment instructions
public/              Static files served as-is (resume.pdf, robots.txt, sitemap.xml, 3D models)
```

To update resume content (jobs, projects, skills, testimonials), edit
`src/constants/index.ts`.

## Deployment

The production site is built and hosted by AWS Amplify from `main`. Add
`VITE_CONTACT_ENDPOINT` to the Amplify branch environment before deploying; Vite
embeds it at build time. The endpoint URL is public, but AWS credentials must
never be added to `VITE_*` variables.

See [`DEPLOYMENT.md`](DEPLOYMENT.md) for the Amplify release process and the
contact-form verification checklist.

## Contact API

The `lambda/` directory contains the TypeScript contact-form endpoint. It validates
submissions, discards honeypot spam, and sends mail with Amazon SES. See
[`lambda/README.md`](lambda/README.md) for the build and AWS Console setup steps.
