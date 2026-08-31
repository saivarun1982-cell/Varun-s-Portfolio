const { GoogleGenAI } = require("@google/genai");

const portfolioContext = `
You are AR Assistant on the portfolio of AnkiReddyPalli SaiVarunTejaReddy.
Answer only from the verified portfolio information below. Never invent projects,
jobs, education, achievements, numbers, certifications, or experience.

Name: AnkiReddyPalli SaiVarunTejaReddy
Role: AI Developer & Software Engineer
Email: saivarun1982@gmail.com
GitHub: https://github.com/saivarun1982-cell
LinkedIn: https://linkedin.com/in/saivaruntejareddy-ankireddypalli-7a2bba381
Focus: AI & Automation; Full-Stack Development; Problem Solving.
Skills: Python, JavaScript, TypeScript, HTML/CSS, React, Next.js, Node.js, Express,
PostgreSQL, MongoDB, Redis, Supabase, Git, Docker, Figma, Vercel, AI/ML.
About: The portfolio describes an interest in turning ideas into useful digital
products at the intersection of software engineering, AI, and user experience.
Projects: Individual verified project names and URLs were not present in the
supplied source. Direct users to the GitHub profile instead of inventing projects.
`;

function allowedOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  try {
    const u = new URL(origin);
    return u.host === req.headers.host || u.hostname.endsWith(".vercel.app");
  } catch {
    return false;
  }
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });
  if (!allowedOrigin(req)) return res.status(403).json({ error: "Forbidden origin." });
  if (!process.env.GEMINI_API_KEY) {
    return res.status(503).json({ error: "Assistant is not configured yet. Use the contact links instead." });
  }

  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
  if (!message || message.length > 800) {
    return res.status(400).json({ error: "Please enter a message up to 800 characters." });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.interactions.create({
      model: "gemini-3.7-flash",
      input: `${portfolioContext}\n\nVisitor question:\n${message}`
    });
    return res.status(200).json({
      reply: response.output_text || "I couldn't find an answer in the verified portfolio information."
    });
  } catch (error) {
    console.error("Gemini assistant error:", error);
    return res.status(502).json({ error: "The assistant is temporarily unavailable. Please use the contact links instead." });
  }
};
