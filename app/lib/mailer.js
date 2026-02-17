import nodemailer from "nodemailer";

let transport;

export function getTransport() {
  if (!transport) {
    const port = Number(process.env.SMTP_PORT || 587);
    transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: process.env.SMTP_USER
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        : undefined
    });
  }
  return transport;
}

export async function sendInquiryNotification({
  to,
  subject,
  html,
  replyTo
}) {
  const transporter = getTransport();
  return transporter.sendMail({
    from: process.env.MAIL_FROM || "Maya Bliss Tours <no-reply@himalayanblisstours.com>",
    to,
    subject,
    html,
    replyTo
  });
}
