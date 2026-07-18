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

## Deployment Constraints

- AWS Amplify builds and hosts `main`. `VITE_CONTACT_ENDPOINT` is a build-time,
  public endpoint URL, so changing it requires an Amplify rebuild. Never put AWS
  credentials in a `VITE_*` variable.
- The contact API is API Gateway `POST /contact` -> Lambda -> SES in `us-east-1`.
  Keep Lambda CORS and `ALLOWED_ORIGINS` limited to `https://lfortiz.com` and
  `https://www.lfortiz.com` unless temporarily testing localhost.
- Lambda deployment details, IAM limits, and test event are in `lambda/README.md`;
  the production release checklist is in `DEPLOYMENT.md`.
