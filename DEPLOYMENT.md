# Deployment and Operations

## Architecture

The portfolio is a static Vite application hosted by AWS Amplify. Its contact
form calls an API Gateway HTTP API, which invokes a TypeScript Lambda function in
`us-east-1`. The function sends the message through Amazon SES to
`me@lfortiz.com` and sets the visitor's email as `Reply-To`.

```text
Visitor -> AWS Amplify site -> API Gateway POST /contact -> Lambda -> Amazon SES -> me@lfortiz.com
```

Only the public API URL is embedded in the frontend. SES permissions are granted
to the Lambda execution role; AWS credentials must never be placed in frontend
code or `VITE_*` variables.

## Amplify Release Process

1. Confirm `main` contains the intended change.
2. In Amplify, open the production branch and set this environment variable:

   ```text
   VITE_CONTACT_ENDPOINT=https://your-api-id.execute-api.us-east-1.amazonaws.com/contact
   ```

3. Push to `main`, or choose **Redeploy this version** in Amplify after changing
   the environment variable.
4. Wait for the Amplify deployment to reach **Succeeded**.
5. Open `https://www.lfortiz.com/` in an incognito window and verify the release.

Vite substitutes `VITE_*` values during the build. A variable change requires a
new Amplify build; changing it after deployment does not modify the existing site.

## Production Verification

After a frontend or API release, verify:

1. The English/Spanish switch works on desktop and mobile navigation.
2. A language preference persists after a page refresh.
3. `document.documentElement.lang`, title, description, Open Graph values, and
   JSON-LD update when the language changes.
4. A valid contact submission shows the success state and arrives at
   `me@lfortiz.com`.
5. Replying to that message sends mail to the visitor's form address.
6. The API rejects invalid input and does not send mail for a filled honeypot.

## Contact API Operations

The Lambda source and packaging instructions are in
[`lambda/README.md`](lambda/README.md). Keep these production constraints in
place:

- Region: `us-east-1`, matching the verified SES identity.
- CORS origins: `https://lfortiz.com` and `https://www.lfortiz.com` only.
- Lambda environment: `SENDER_EMAIL`, `RECIPIENT_EMAIL`, and `ALLOWED_ORIGINS`.
- IAM: `ses:SendEmail` only, restricted to `me@lfortiz.com` as the sender.
- API Gateway route: `POST /contact`.

If you need local browser form testing, temporarily add `http://localhost:5173`
to both `ALLOWED_ORIGINS` and API Gateway CORS. Remove it after testing.

## Routine Maintenance

- Run `npm run lint` and `npm run build` before pushing frontend changes.
- Run `npm run package` in `lambda/` before uploading API changes.
- Update `public/sitemap.xml` whenever the public site structure changes.
- Review SES and Lambda logs if a submitted form does not arrive.
- Rotate or remove obsolete service configuration instead of retaining unused
  client-side email providers.
