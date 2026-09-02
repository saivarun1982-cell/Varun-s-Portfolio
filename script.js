/* =========================================================================
   SAIVARUN PORTFOLIO — SCRIPT
   -------------------------------------------------------------------------
   EASIEST THINGS TO EDIT LIVE RIGHT HERE AT THE TOP:
     - CONFIG.email / chatEndpoint / contactEndpoint
     - ROLES: the words that type/cycle under the hero eyebrow
     - CHAT_FAQ: canned answers the chat widget gives if the AI backend
       (see api/chat.js) isn't configured yet — keep these true to your
       real skills/projects so the widget never has to guess.
   Everything else in this file is behaviour (menus, animations, form
   handling) and shouldn't need to change unless you're adding a feature.
   ========================================================================= */

const CONFIG = {
  email: "saivarun1982@gmail.com",
  chatEndpoint: "/api/chat",
  contactEndpoint: "/api/contact"
};

// Words that type in and out under the hero eyebrow. Add/remove as you like.
const ROLES = ["AI Developer", "Software Engineer", "Problem Solver", "Lifelong Learner"];

// Fallback answers the chat widget uses locally if /api/chat isn't reachable
// yet (for example, before GEMINI_API_KEY is set on Vercel — see README.md).
// Keep "keywords" lowercase. The first match wins, so put more specific
// entries first.
const CHAT_FAQ = [
  {
    keywords: ["skill", "tech", "stack", "language", "tool", "know"],
    answer: "Core skills: Python, JavaScript, TypeScript, HTML/CSS, React, Next.js, Node.js, Express, PostgreSQL, MongoDB, Redis, Supabase, Git, Docker, Figma, and Vercel — with a focus on AI & automation."
  },
  {
    keywords: ["project", "work", "built", "portfolio", "app", "build"],
    answer: "Take a look at the Projects section above, or the GitHub profile linked in Contact for the most current repositories and demos."
  },
  {
    keywords: ["resume", "cv"],
    answer: "You can view or download the resume from the Resume section above, or the button in the navigation bar."
  },
  {
    keywords: ["contact", "email", "reach", "hire", "connect", "collaborat"],
    answer: `The fastest way to connect is by email at ${CONFIG.email}, or through the GitHub and LinkedIn links in the Contact section.`
  },
  {
    keywords: ["experience", "background", "who", "about"],
    answer: "AnkiReddyPalli SaiVarunTejaReddy is an AI Developer & Software Engineer focused on combining software engineering, AI, and thoughtful design to build useful digital products."
  }
];
const CHAT_FALLBACK_DEFAULT = "I can share details on skills, projects, resume, or how to get in touch — try asking about one of those, or use the Contact section for anything else.";
const CHAT_OFFLINE_PREFIX = "The full AI assistant isn't connected yet, but here's what I can tell you from the portfolio:\n\n";

/* ---------------------------------------------------------------------
   Mobile nav toggle
--------------------------------------------------------------------- */
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
navToggle?.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});
document.querySelectorAll(".nav-links a").forEach((link) => link.addEventListener("click", () => navLinks?.classList.remove("open")));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navLinks?.classList.contains("open")) {
    navLinks.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
    navToggle?.focus();
  }
});

/* ---------------------------------------------------------------------
   Scroll-triggered reveal animation
--------------------------------------------------------------------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

/* ---------------------------------------------------------------------
   Active-section highlighting in the nav bar
--------------------------------------------------------------------- */
const sections = document.querySelectorAll("main section[id]");
const navLinkByHash = new Map();
document.querySelectorAll(".nav-links a[href^='#']").forEach((a) => navLinkByHash.set(a.getAttribute("href"), a));

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const link = navLinkByHash.get(`#${entry.target.id}`);
    if (!link) return;
    if (entry.isIntersecting) {
      navLinkByHash.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
    }
  });
}, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
sections.forEach((section) => sectionObserver.observe(section));

/* ---------------------------------------------------------------------
   Cursor glow (desktop, fine pointer only)
--------------------------------------------------------------------- */
const cursorGlow = document.querySelector(".cursor-glow");
const finePointer = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (cursorGlow && finePointer) {
  window.addEventListener("pointermove", (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  }, { passive: true });
}

/* ---------------------------------------------------------------------
   Hero photo tilt — the one deliberate "wow" interaction on the page.
   Skipped entirely on touch devices and when reduced motion is requested.
--------------------------------------------------------------------- */
const photoCard = document.querySelector(".photo-card");
const heroVisual = document.querySelector(".hero-visual");
if (photoCard && heroVisual && finePointer && !reducedMotion) {
  heroVisual.addEventListener("pointermove", (event) => {
    const rect = heroVisual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    photoCard.classList.add("tilting");
    photoCard.style.transform = `rotate(2deg) rotateY(${x * 14}deg) rotateX(${y * -14}deg) translateZ(10px)`;
  });
  heroVisual.addEventListener("pointerleave", () => {
    photoCard.classList.remove("tilting");
    photoCard.style.transform = "";
  });
}

/* ---------------------------------------------------------------------
   Typewriter role cycle under the hero eyebrow
--------------------------------------------------------------------- */
const roleEl = document.getElementById("roleCycle");
if (roleEl) {
  if (reducedMotion || ROLES.length <= 1) {
    roleEl.textContent = ROLES[0] || roleEl.textContent;
  } else {
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;
    const TYPE_MS = 65, DELETE_MS = 35, HOLD_MS = 1500, GAP_MS = 400;

    const tick = () => {
      const word = ROLES[roleIndex];
      if (!deleting) {
        charIndex++;
        roleEl.textContent = word.slice(0, charIndex);
        if (charIndex === word.length) {
          deleting = true;
          setTimeout(tick, HOLD_MS);
          return;
        }
        setTimeout(tick, TYPE_MS);
      } else {
        charIndex--;
        roleEl.textContent = word.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % ROLES.length;
          setTimeout(tick, GAP_MS);
          return;
        }
        setTimeout(tick, DELETE_MS);
      }
    };
    setTimeout(tick, 900);
  }
}

/* ---------------------------------------------------------------------
   Scroll progress bar + back-to-top button + header border-on-scroll
--------------------------------------------------------------------- */
const progressBar = document.getElementById("scrollProgress");
const toTopBtn = document.getElementById("toTopBtn");
const header = document.querySelector(".site-header");

function onScroll() {
  const scrollTop = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (scrollTop / max) * 100 : 0;
  if (progressBar) progressBar.style.width = `${pct}%`;
  if (header) header.style.borderBottomColor = scrollTop > 20 ? "rgba(154,183,218,.12)" : "transparent";
  if (toTopBtn) toTopBtn.classList.toggle("show", scrollTop > 700);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

toTopBtn?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
});

/* ---------------------------------------------------------------------
   Footer year
--------------------------------------------------------------------- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------------------------------------------------------------------
   Gallery image fallbacks (mirrors the hero photo pattern) — wired here
   instead of inline HTML so both slots share one bit of logic.
--------------------------------------------------------------------- */
document.querySelectorAll("[data-fallback-for]").forEach((fallbackEl) => {
  const img = document.getElementById(fallbackEl.dataset.fallbackFor);
  if (!img) return;
  img.addEventListener("error", () => {
    img.classList.add("has-error");
    fallbackEl.classList.add("show");
  });
});

/* ---------------------------------------------------------------------
   Copy-email button + toast feedback
--------------------------------------------------------------------- */
const toast = document.getElementById("toast");
let toastTimer = null;
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

document.getElementById("copyEmailBtn")?.addEventListener("click", async (event) => {
  const btn = event.currentTarget;
  try {
    await navigator.clipboard.writeText(CONFIG.email);
    showToast("Email address copied.");
    btn.classList.add("copied");
    btn.setAttribute("aria-label", "Email copied");
    setTimeout(() => { btn.classList.remove("copied"); btn.setAttribute("aria-label", "Copy email address"); }, 1600);
  } catch {
    showToast("Couldn't copy — email is " + CONFIG.email);
  }
});

/* ---------------------------------------------------------------------
   Contact form: never show success until our server confirms delivery.
--------------------------------------------------------------------- */
const form = document.getElementById("contactForm");
const note = document.getElementById("formNote");
const formSubmit = document.getElementById("formSubmit");
const messageField = form?.elements?.message;
const charCount = document.getElementById("charCount");

function updateCharCount() {
  if (!charCount || !messageField) return;
  const max = Number(messageField.maxLength) || 4000;
  const len = messageField.value.length;
  charCount.textContent = `${len} / ${max}`;
  charCount.classList.toggle("limit-near", len > max * 0.9);
}
messageField?.addEventListener("input", updateCharCount);
updateCharCount();

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = form.elements.name?.value.trim();
  const email = form.elements.email?.value.trim();
  const message = form.elements.message?.value.trim();
  const honeypot = form.elements.website?.value.trim();

  if (honeypot) return; // silently drop likely-bot submissions
  if (!name || !email || !message) {
    if (note) { note.classList.add("error"); note.textContent = "Please complete your name, email, and message."; }
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    if (note) { note.classList.add("error"); note.textContent = "Please enter a valid email address."; }
    return;
  }

  if (note) { note.classList.remove("error"); note.textContent = "Sending your message…"; }
  if (formSubmit) { formSubmit.disabled = true; formSubmit.setAttribute("aria-busy", "true"); }

  try {
    const response = await fetch(CONFIG.contactEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ name, email, message, website: honeypot })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data?.error || "We couldn't send your message.");
    form.reset();
    updateCharCount();
    if (note) note.textContent = "Message sent successfully. I’ll get back to you soon.";
  } catch (error) {
    if (note) {
      note.classList.add("error");
      note.innerHTML = `${escapeHtml(error.message || "We couldn't send your message.")} <a href="mailto:${CONFIG.email}">Email me directly</a>.`;
    }
  } finally {
    if (formSubmit) { formSubmit.disabled = false; formSubmit.removeAttribute("aria-busy"); }
  }
});

/* ---------------------------------------------------------------------
   Chatbot widget
--------------------------------------------------------------------- */
const chatToggle = document.getElementById("chatToggle");
const chatBox = document.getElementById("chatBox");
const chatClose = document.getElementById("chatClose");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");
const chatSend = chatForm?.querySelector("button");
const chatStatus = document.getElementById("chatStatus");
let chatOfflineNoticeShown = false;

function setChatOpen(open) {
  chatBox?.classList.toggle("open", open);
  chatBox?.setAttribute("aria-hidden", String(!open));
  chatToggle?.setAttribute("aria-expanded", String(open));
  if (open) setTimeout(() => chatInput?.focus(), 50);
}
chatToggle?.addEventListener("click", () => setChatOpen(!chatBox.classList.contains("open")));
chatClose?.addEventListener("click", () => { setChatOpen(false); chatToggle?.focus(); });

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && chatBox?.classList.contains("open")) {
    setChatOpen(false);
    chatToggle?.focus();
  }
});

function syncChatButton() {
  const hasText = Boolean(chatInput?.value.trim());
  if (chatSend) chatSend.disabled = !hasText;
}
chatInput?.addEventListener("input", syncChatButton);
syncChatButton();

function localAnswer(question) {
  const q = question.toLowerCase();
  const match = CHAT_FAQ.find((entry) => entry.keywords.some((word) => q.includes(word)));
  return (chatOfflineNoticeShown ? "" : CHAT_OFFLINE_PREFIX) + (match ? match.answer : CHAT_FALLBACK_DEFAULT);
}

chatForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const userText = chatInput?.value.trim();
  if (!userText) {
    if (chatStatus) chatStatus.textContent = "Type a message first.";
    return;
  }
  if (userText.length > 800) {
    if (chatStatus) chatStatus.textContent = "Please keep your question under 800 characters.";
    return;
  }

  appendMessage(userText, "user");
  chatInput.value = "";
  syncChatButton();
  const loadingMsg = appendTypingIndicator();
  if (chatSend) chatSend.disabled = true;

  try {
    const response = await fetch(CONFIG.chatEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ message: userText })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data?.error || "The assistant is temporarily unavailable.");
    if (loadingMsg) loadingMsg.textContent = data.reply || "I couldn't find an answer.";
  } catch (error) {
    // The live AI backend isn't reachable (not deployed yet, key not set, or
    // a network hiccup) — fall back to a locally-answered FAQ so the widget
    // still feels useful instead of just erroring out.
    if (loadingMsg) loadingMsg.textContent = localAnswer(userText);
    chatOfflineNoticeShown = true;
    if (chatStatus) chatStatus.textContent = "";
  } finally {
    syncChatButton();
    chatInput?.focus();
  }
});

function appendMessage(text, sender) {
  if (!chatMessages) return null;
  const msg = document.createElement("div");
  msg.className = `chat-msg ${sender}`;
  msg.textContent = text;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return msg;
}

function appendTypingIndicator() {
  if (!chatMessages) return null;
  const msg = document.createElement("div");
  msg.className = "chat-msg bot";
  msg.innerHTML = '<span class="typing-dots"><span></span><span></span><span></span></span>';
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return msg;
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[char]));
}
