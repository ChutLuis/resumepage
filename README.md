# Luis Ortiz — Developer Portfolio

Personal portfolio / resume site for **Luis Ortiz**, a Full-Stack Software Engineer.
Built as a single-page React app with interactive 3D visuals.

Live site: <https://www.lfortiz.com/>

## Tech stack

- **React 18** + **TypeScript** + **Vite**
- **Three.js** via **@react-three/fiber** and **@react-three/drei** (3D models, particle background, animated globe)
- **Tailwind CSS** for styling
- **Framer Motion** for section/scroll animations
- **EmailJS** for the contact form (no backend required)

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

The contact form uses EmailJS. Create a `.env` file in the project root:

```bash
VITE_SERVICE_ID=your_emailjs_service_id
VITE_TEMPLATE_ID=your_emailjs_template_id
VITE_PKEY=your_emailjs_public_key
VITE_TO_EMAIL=your_destination_email
```

`.env` files are gitignored. **Never commit real keys.**

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
