# Contact Lambda

This TypeScript Lambda receives portfolio contact-form submissions and sends them
to `me@lfortiz.com` through Amazon SES. It has no access keys: Lambda uses an IAM
execution role to send email.

## Build the upload file

From this directory:

```bash
npm install
npm run package
```

This creates `function.zip`. Upload that file through the AWS Lambda Console.

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
