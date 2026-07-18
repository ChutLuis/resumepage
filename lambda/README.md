# Contact Lambda

This TypeScript Lambda receives portfolio contact-form submissions and sends them
to `me@lfortiz.com` through Amazon SES. It has no access keys: Lambda uses an IAM
execution role to send email.

The Lambda is integrated with an API Gateway HTTP API in `us-east-1`. The public
site posts to its `/contact` route through the `VITE_CONTACT_ENDPOINT` Amplify
environment variable.

## Build the upload file

From this directory:

```bash
npm install
npm run package
```

This creates `function.zip`. Upload that file through the AWS Lambda Console.

## Update an existing function

After changing Lambda source:

1. Run `npm install` and `npm run package` in this directory.
2. In AWS Lambda, open `lfortiz-contact` in `us-east-1`.
3. Choose **Upload from** > **.zip file** and upload the new `function.zip`.
4. Run the test event below and confirm delivery before deploying the frontend.

Do not upload `node_modules`, `dist/`, or `function.zip` to Git. They are ignored
because `function.zip` is reproducible from the committed source and lockfile.

## AWS Console setup

Use **US East (N. Virginia) / us-east-1** for every AWS resource below.

1. In **Lambda**, create a function named `lfortiz-contact` using the Node.js 20.x runtime.
2. In the function's **Code** tab, choose **Upload from** > **.zip file** and upload `function.zip`.
3. In **Runtime settings**, set the handler to `index.handler`.
4. In **Configuration** > **General configuration**, set memory to 128 MB and timeout to 10 seconds.
5. In **Configuration** > **Environment variables**, add:

   ```text
   SENDER_EMAIL=me@lfortiz.com
   RECIPIENT_EMAIL=me@lfortiz.com
   ALLOWED_ORIGINS=https://lfortiz.com,https://www.lfortiz.com
   ```

6. In **Configuration** > **Permissions**, open the execution role and add this inline policy. It permits only the email-sending action the function needs:

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": "ses:SendEmail",
         "Resource": "*",
         "Condition": {
           "StringEquals": {
             "ses:FromAddress": "me@lfortiz.com"
           }
         }
       }
     ]
   }
   ```

7. In **API Gateway**, create an **HTTP API**. Add your `lfortiz-contact` Lambda as the integration and create a route: `POST /contact`.
8. In the API's **CORS** settings, configure:

   ```text
   Allowed origins: https://lfortiz.com, https://www.lfortiz.com
   Allowed methods: POST
   Allowed headers: content-type
   Max age: 600
   ```

   API Gateway will handle `OPTIONS` preflight automatically.

9. Deploy using the `$default` stage, then copy its **Invoke URL** and append `/contact`.
10. Put it in the portfolio host's environment as `VITE_CONTACT_ENDPOINT`, rebuild, and redeploy the site.

## Test before connecting the site

In Lambda, create a test event with this payload:

```json
{
  "version": "2.0",
  "headers": { "origin": "https://lfortiz.com" },
  "requestContext": { "http": { "method": "POST" } },
  "body": "{\"name\":\"Test User\",\"email\":\"me@lfortiz.com\",\"message\":\"This is a contact endpoint test.\",\"company\":\"\",\"openedAt\":0}",
  "isBase64Encoded": false
}
```

It should return `200` with `{"ok":true}` and deliver an email to
`me@lfortiz.com`. Do not add `localhost` to CORS unless you need to test the
browser form locally; remove it again afterward.

## Endpoint behavior

- Only `POST` requests are accepted.
- Requests are validated server-side for name, email, and message length.
- A hidden `company` field acts as a honeypot; filled submissions are accepted
  without sending email so bots receive no signal.
- The visitor email is set as `Reply-To`; it is never used as the SES sender.
- The execution role requires only `ses:SendEmail` and restricts the sender to
  `me@lfortiz.com`.
