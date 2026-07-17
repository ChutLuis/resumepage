# Luis Ortiz — Developer Portfolio

Personal portfolio / resume site for **Luis Ortiz**, a Full-Stack Software Engineer.
Built as a single-page React app with interactive 3D visuals.

Live site: <https://www.lfortiz.com/>

## Tech stack

- **React 18** + **TypeScript** + **Vite**
- **Three.js** via **@react-three/fiber** and **@react-three/drei** (3D models, particle background, animated globe)
- **Tailwind CSS** for styling
- **Framer Motion** for section/scroll animations
- **AWS Lambda + Amazon SES** for secure contact-form delivery

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

## Project structure

```
src/
  components/        UI sections (Hero, About, Experience, Works, Contact, ...)
    canvas/          Three.js canvases (Computers, Earth, Ball, Stars)
  constants/         Resume content: experience, projects, testimonials, tech
  assets/            Images and logos
  hoc/               Section wrapper HOC
  utils/             Animation helpers
public/              Static files served as-is (resume.pdf, robots.txt, sitemap.xml, 3D models)
```

To update resume content (jobs, projects, skills, testimonials), edit
`src/constants/index.ts`.

## Deployment

`npm run build` outputs static files to `dist/`, deployable to any static host.
An `.htaccess` is included for Apache-based SPA routing.

## Contact API

The `lambda/` directory contains the TypeScript contact-form endpoint. It validates
submissions, discards honeypot spam, and sends mail with Amazon SES. See
[`lambda/README.md`](lambda/README.md) for the build and AWS Console setup steps.
