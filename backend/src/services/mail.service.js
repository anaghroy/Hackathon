import { BrevoClient, BrevoEnvironment } from "@getbrevo/brevo";
import { config } from "../config/config.js";

const client = new BrevoClient({
  apiKey: config.BREVO_API_KEY,
  environment: BrevoEnvironment.Production,
});

export async function sendEmail({ to, subject, html, text }) {
  if (!to || !subject) {
    throw new Error("sendEmail: 'to' and 'subject' are required");
  }

  const data = await client.transactionalEmails.sendTransacEmail({
    sender: {
      name: "CogniCode",
      email: config.BREVO_SENDER_EMAIL,
    },
    to: [{ email: to }],
    subject,
    htmlContent: html,
    ...(text && { textContent: text }),
  });

  console.log("Email sent to:", to, "| Message ID:", data.messageId);
  return data;
}