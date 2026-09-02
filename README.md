# SaiVarun Portfolio

A single-page portfolio (plain HTML/CSS/JS + two Vercel serverless functions
for the chat widget and contact form — no build step required).

---

## What changed in this pass

### Bugs fixed
- **Contact "Sending…" button never disabled.** `script.js` looked for a
  button with `id="formSubmit"`, but no element in `index.html` had that id,
  so the button stayed clickable and never showed its "sending" state. Fixed
  by adding `id="formSubmit"` to the button.
- **Chat window's Send and Close buttons were unstyled.** `styles.css`
  defined `.chat-send-btn` and `.chat-close-btn` rules, but the buttons in
  `index.html` never had those classes attached, so they rendered as plain
  default browser buttons instead of matching the rest of the UI. Fixed by
  adding the classes in the HTML.
- **Duplicate, conflicting CSS.** The chat widget's styles were defined
  twice in `styles.css` (once fully, once again partway down the file).
  Consolidated into one block.
- **`robots.txt` / `sitemap.xml` pointed at a placeholder domain**
  (`YOUR-DOMAIN.example`) instead of the real deployed URL. Fixed to use
  `https://varun-s-portfolio-henna.vercel.app`.
- **Unpinned dependency.** `package.json` pinned `@google/genai` to
  `"latest"`, which can silently pull in a breaking major version on a
  future deploy. Pinned to `^2.19.0`.
- **Missing social preview tags.** The README claimed "SEO/Open Graph
  basics" were done, but `index.html` had no `og:image`, `og:url`,
  Twitter card tags, canonical URL, or structured data. Added all of them
  (using the existing `assets/og-image.svg`).
- **Honeypot spam field was nested inside the "Message" `<label>`**,
  which is invalid markup (a label should wrap one field) and could
  confuse screen readers. Moved it into its own hidden container.

### About the AI chatbot specifically
The Gemini API call in `api/chat.js` (`ai.interactions.create(...)`) was
already using the correct, current Gemini SDK syntax — that part wasn't the
problem. If the widget looked "broken" for you, it's almost certainly one of
these:
1. **`GEMINI_API_KEY` isn't set in Vercel yet** — the code deliberately shows
   *"Assistant is not configured yet"* instead of a fake reply in this case.
   See **Chat setup** below.
2. The Send/Close buttons were unstyled (see bug list above), which can look
   broken even though the widget worked.

To make sure visitors always get *something* useful even before you set up
the key, the widget now also has a **local fallback**: if `/api/chat` isn't
reachable or isn't configured, it answers common questions (skills,
projects, resume, contact) from a small FAQ built into `script.js`
(`CHAT_FAQ`), instead of just showing an error. The full AI takes over
automatically the moment `GEMINI_API_KEY` is set.

### New features
- **Gallery section** with 2 new photo slots (see "Adding your photos" below) — this was requested specifically.
- **Typewriter role text** in the hero ("AI Developer" → "Software Engineer" → …), editable in one array.
- **Active-section highlighting** in the nav bar as you scroll.
- **Scroll progress bar** and a **back-to-top button**.
- **3D tilt effect** on the hero photo card that follows the cursor (skipped automatically on touch devices and for visitors with reduced-motion enabled).
- **Copy-email button** with a toast confirmation, next to the Email contact link.
- **Live character counter** on the contact form's message field.
- **Animated "typing…" dots** in the chat widget instead of a static line.
- **Resume button** added to the header nav (the CSS for this already existed but wasn't used anywhere).

Everything above respects the site's existing look — same colors, type,
and structure — and respects `prefers-reduced-motion` and keyboard
navigation throughout.

---

## Deploy

1. Import this folder into Vercel (or push it to the GitHub repo Vercel is
   already watching).
2. Add environment variables — see **Chat setup** and **Email setup** below.
3. Redeploy.
4. Go through the **Before going live checklist** at the bottom of this file.

---

## Chat setup

The chat widget calls `api/chat.js`, which needs one environment variable:

| Variable | Where to get it |
|---|---|
| `GEMINI_API_KEY` | Free at [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |

Add it in **Vercel → Project Settings → Environment Variables**, then
redeploy. Never put this key in frontend code (`index.html`/`script.js`) —
it must only exist as a server-side environment variable.

## Email setup

The contact form posts to `api/contact.js`, which sends mail through
[Resend](https://resend.com):

| Variable | Required? | Notes |
|---|---|---|
| `RESEND_API_KEY` | Yes | A Resend sending key. Server-side only. |
| `CONTACT_TO` | No | Defaults to `saivarun1982@gmail.com`. |
| `MAIL_FROM` | No | Defaults to Resend's shared test sender, which can only deliver to the email on your Resend account. Once you verify your own domain in Resend, switch this to an address on it. |

If `RESEND_API_KEY` isn't set, the form shows a real error and a direct
`mailto:` link — it never pretends a message was sent.

---

## Where to edit what

Everything below is content — you don't need to touch `script.js`'s logic
or `styles.css` to update any of it. Look for `<!-- EDIT: ... -->` comments
in `index.html`; they mark every editable spot directly.

| Want to change… | File | Where |
|---|---|---|
| Name, title, headline, intro text | `index.html` | `<section id="home">` |
| The cycling role words ("AI Developer", etc.) | `script.js` | `ROLES` array, near the top |
| Main profile photo | `assets/varun.jpeg` | replace the file (keep the filename, or update the `src` in the hero `<img>`) |
| About text | `index.html` | `<section id="about">` |
| The 4 "AI / WEB / UI / ∞" stat cards | `index.html` | `.stats-grid` inside `<section id="about">` |
| **The 2 gallery photos (new)** | `assets/gallery-1.jpg`, `assets/gallery-2.jpg` | add files with these exact names — captions are in `<section id="gallery">` |
| Skills & tags | `index.html` | `<section id="skills">` — copy a `.skill-card` block to add a category |
| Projects | `index.html` | `<section id="projects">` — copy a `.project-card` block to add one; update the icon, title, description, tags, and link |
| Resume file | `assets/resume.pdf` | replace the file (keep the filename) |
| Contact links (GitHub/LinkedIn/Email) | `index.html` | `<section id="contact">`, `.contact-links` |
| Email address used site-wide | `script.js` | `CONFIG.email`, near the top |
| Chat FAQ fallback answers | `script.js` | `CHAT_FAQ` array, near the top |
| What the AI assistant knows about you | `api/chat.js` | `portfolioContext` string near the top |
| Site colors | `styles.css` | `:root { ... }` at the very top |
| Page title / description / social preview text | `index.html` | `<head>`, the `<meta>` and `<title>` tags |

## Adding your photos

- **Main photo:** save it as `assets/varun.jpeg` (replacing the existing
  file). Portrait orientation, 800×1000px or larger, works best.
- **Gallery photo 1:** save as `assets/gallery-1.jpg`.
- **Gallery photo 2:** save as `assets/gallery-2.jpg`.
- Landscape (4:3) photos look best in the gallery slots — they're cropped
  to fill the frame automatically.
- Until a file exists at one of these paths, a clean placeholder shows
  instead — nothing looks broken in the meantime.
- Prefer different filenames or `.png`/`.webp`? Just update the matching
  `src="..."` attribute in `index.html`.

## The placeholder resume

`assets/resume.pdf` currently contains only the facts present in the
original supplied source (name, contact info, skills) — no invented
projects, employers, education, or dates. **Replace it with your real
resume** before using this site for actual applications.

---

## Before going live checklist

- [ ] `GEMINI_API_KEY` set in Vercel (chat widget)
- [ ] `RESEND_API_KEY` set in Vercel (contact form)
- [ ] Replaced `assets/varun.jpeg` with your real photo (if not already live)
- [ ] Added `assets/gallery-1.jpg` and `assets/gallery-2.jpg`
- [ ] Replaced `assets/resume.pdf` with your real resume
- [ ] Added real project details in `<section id="projects">`
- [ ] If you add a custom domain, update the 3 URLs in `index.html`'s
      `<head>` (`canonical`, `og:url`, `og:image`) and the domain in
      `robots.txt` / `sitemap.xml`
- [ ] Test on mobile: menu, chat widget, contact form
- [ ] Test the contact form end-to-end (a real email arrives)
- [ ] Test the chat widget end-to-end (a real AI reply comes back)
