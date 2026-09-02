// api/contact.js — serverless function backing the contact form.
// Sends mail through Resend (https://resend.com) so no client-side email
// address or third-party form key is ever exposed in the page source.
//
// REQUIRED SETUP (see README.md "Email setup" for full steps):
//   1. Create a free Resend account and API key.
//   2. In Vercel: Project Settings → Environment Variables → add
//      RESEND_API_KEY (required), and optionally CONTACT_TO / MAIL_FROM.
//   3. Redeploy. Until RESEND_API_KEY is set, the form shows a clear
//      "email service not configured yet" message with a mailto fallback
//      instead of silently pretending the message was sent.

function getOriginAllowed(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  try {
    const originUrl = new URL(origin);
    const host = req.headers.host || "";
    return originUrl.host === host || originUrl.hostname.endsWith(".vercel.app");
  } catch { return false; }
}

function clean(value, max) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });
  if (!getOriginAllowed(req)) return res.status(403).json({ error: "Forbidden origin." });
  if (!process.env.RESEND_API_KEY) return res.status(503).json({ error: "Email service is not configured yet." });

  const name = clean(req.body?.name, 80);
  const email = clean(req.body?.email, 160);
  const message = clean(req.body?.message, 4000);
  const website = clean(req.body?.website, 100); // honeypot

  if (website) return res.status(200).json({ ok: true }); // pretend success to bots
  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Please provide a valid name, email, and message." });
  }

  // EDIT: change the fallback recipient/sender here, or (preferred) set
  // CONTACT_TO / MAIL_FROM as Vercel environment variables instead.
  const to = process.env.CONTACT_TO || "saivarun1982@gmail.com";
  const from = process.env.MAIL_FROM || "Portfolio Contact <onboarding@resend.dev>";
  const subject = `Portfolio contact from ${name}`;
  const text = `New portfolio contact\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
  const html = `
    <h2>New portfolio contact</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Message:</strong></p>
    <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
  `;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ from, to: [to], reply_to: email, subject, text, html })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error("Resend error:", data);
      return res.status(502).json({ error: "The email service rejected the message. Please email directly." });
    }
    return res.status(200).json({ ok: true, id: data.id });
  } catch (error) {
    console.error("Contact error:", error);
    return res.status(502).json({ error: "The email service is temporarily unavailable." });
  }
};
