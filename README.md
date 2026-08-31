# SaiVarun Portfolio — Finished Build

## Fixed
- CSS/JS filename consistency
- Broken profile image markup
- Duplicate form closing tag
- Chatbot HTML/CSS/JS selector mismatch
- Missing chat input ID
- Exposed Gemini key removed from frontend
- Secure `/api/chat` serverless endpoint added
- Resume View + Download added
- Resume PDF added from facts present in the supplied source
- Contact form loading/success/error states and honeypot
- Keyboard focus, Escape handling, reduced motion, mobile cursor handling
- SEO/Open Graph basics, favicon, structured data
- Vercel configuration and security headers
- Honest project presentation: no invented project claims

## Required before deployment
The Gemini key previously present in the frontend must be treated as compromised. Create a replacement key and store it only as the Vercel environment variable `GEMINI_API_KEY`. Never put it in public JS/HTML.

The supplied source did not contain verified individual project names, project URLs, experience, education, achievements, or certifications. Those are deliberately not invented. Add them before using the portfolio for formal applications.

## Deploy
1. Import this folder into Vercel.
2. Add `GEMINI_API_KEY` in Project Settings → Environment Variables.
3. Redeploy.
4. Replace the placeholder domain in robots.txt and sitemap.xml.
5. Test resume, contact form, chatbot, GitHub, LinkedIn, mobile navigation, and all buttons.


## Email setup
The contact form no longer depends on an unknown Formspree endpoint. It posts to `/api/contact`, which sends through Resend from the server. Set these Vercel environment variables:
- `RESEND_API_KEY` — a Resend sending key (keep it server-side).
- `CONTACT_TO` — defaults to `saivarun1982@gmail.com`.
- `MAIL_FROM` — preferably an address on a domain verified in Resend.

If the email provider is not configured, the UI shows a real error and offers the direct email address instead of falsely saying the message was sent.

## Chat setup
The chatbot also requires `GEMINI_API_KEY` on the server. When the site is opened as a local `file://` page, `/api/chat` cannot exist; deploy the folder to Vercel (or run it behind a server) to enable the assistant. The UI now shows a friendly temporary-unavailable message instead of `Failed to fetch`.


## Zero-cost email setup

For the current no-domain setup, use Resend's shared test sender:

- `RESEND_API_KEY`: your Resend API key (Vercel only)
- `CONTACT_TO`: the exact email address used for your Resend account
- `MAIL_FROM`: `Portfolio Contact <onboarding@resend.dev>`

Resend restricts the shared `onboarding@resend.dev` sender to the account owner's email address. When a custom domain is available later, replace `MAIL_FROM` with a sender on that verified domain.
