import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

type ApiGatewayEvent = {
  body?: string | null;
  headers?: Record<string, string | undefined>;
  isBase64Encoded?: boolean;
  requestContext?: { http?: { method?: string } };
};

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  company?: unknown;
  openedAt?: unknown;
};

const sender = process.env.SENDER_EMAIL;
const recipient = process.env.RECIPIENT_EMAIL;
const allowedOrigins = new Set(
  (process.env.ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
);
const ses = new SESv2Client({});
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const response = (statusCode: number, body: Record<string, boolean | string>, origin?: string) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
    ...(origin && allowedOrigins.has(origin) ? { "Access-Control-Allow-Origin": origin, Vary: "Origin" } : {}),
  },
  body: JSON.stringify(body),
});

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");
const headerText = (value: string) => value.replace(/[\r\n]/g, " ");

export const handler = async (event: ApiGatewayEvent) => {
  const origin = event.headers?.origin ?? event.headers?.Origin;
  const method = event.requestContext?.http?.method;

  if (method === "OPTIONS") {
    return response(204, {}, origin);
  }

  if (method !== "POST") {
    return response(405, { ok: false, error: "Method not allowed" }, origin);
  }

  if (!sender || !recipient || allowedOrigins.size === 0) {
    console.error("Contact endpoint is missing required configuration.");
    return response(500, { ok: false, error: "Service unavailable" }, origin);
  }

  if (!event.body || event.body.length > 10_000) {
    return response(400, { ok: false, error: "Invalid request" }, origin);
  }

  let payload: ContactPayload;
  try {
    const body = event.isBase64Encoded
      ? Buffer.from(event.body, "base64").toString("utf8")
      : event.body;
    payload = JSON.parse(body) as ContactPayload;
  } catch {
    return response(400, { ok: false, error: "Invalid request" }, origin);
  }

  if (text(payload.company)) {
    return response(200, { ok: true }, origin);
  }

  const openedAt = typeof payload.openedAt === "number" ? payload.openedAt : 0;
  if (openedAt && Date.now() - openedAt < 2_500) {
    return response(400, { ok: false, error: "Please try again" }, origin);
  }

  const name = text(payload.name);
  const email = text(payload.email);
  const message = text(payload.message);

  if (!name || name.length > 100 || !emailPattern.test(email) || email.length > 254 || message.length < 10 || message.length > 5_000) {
    return response(400, { ok: false, error: "Invalid contact details" }, origin);
  }

  try {
    await ses.send(
      new SendEmailCommand({
        FromEmailAddress: sender,
        Destination: { ToAddresses: [recipient] },
        ReplyToAddresses: [email],
        Content: {
          Simple: {
            Subject: { Data: `Portfolio contact from ${headerText(name)}`, Charset: "UTF-8" },
            Body: {
              Text: {
                Data: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
                Charset: "UTF-8",
              },
            },
          },
        },
      }),
    );
  } catch (error) {
    console.error("SES contact delivery failed", error);
    return response(500, { ok: false, error: "Unable to send message" }, origin);
  }

  return response(200, { ok: true }, origin);
};
