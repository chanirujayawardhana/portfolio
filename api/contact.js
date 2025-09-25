// /api/contact.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { name, email, subject, message } = req.body || {};
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true", // true for 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const to = process.env.TO_EMAIL;
    const from = process.env.FROM_EMAIL || process.env.SMTP_USER;

    const text = `
New message from your website:

Name: ${name}
Email: ${email}
Subject: ${subject}

${message}
`.trim();

    await transporter.sendMail({
      from: `"Portfolio Contact" <${from}>`,
      to,
      replyTo: email,
      subject: `Website Contact: ${subject}`,
      text,
      html: text.replace(/\n/g, "<br>")
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return res.status(500).json({ error: "Mail server error." });
  }
}
