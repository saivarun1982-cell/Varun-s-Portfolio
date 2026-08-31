const CONFIG = {
  email: "saivarun1982@gmail.com",
  chatEndpoint: "/api/chat",
  contactEndpoint: "/api/contact"
};

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

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

const cursorGlow = document.querySelector(".cursor-glow");
if (cursorGlow && window.matchMedia("(hover:hover) and (pointer:fine)").matches) {
  window.addEventListener("pointermove", (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  }, { passive: true });
}

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const header = document.querySelector(".site-header");
window.addEventListener("scroll", () => {
  if (header) header.style.borderBottomColor = window.scrollY > 20 ? "rgba(154,183,218,.12)" : "transparent";
}, { passive: true });

// Contact form: never show success until our server confirms delivery to the email provider.
const form = document.getElementById("contactForm");
const note = document.getElementById("formNote");
const formSubmit = document.getElementById("formSubmit");

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = form.elements.name?.value.trim();
  const email = form.elements.email?.value.trim();
  const message = form.elements.message?.value.trim();
  const honeypot = form.elements.website?.value.trim();

  if (honeypot) return;
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

const chatToggle = document.getElementById("chatToggle");
const chatBox = document.getElementById("chatBox");
const chatClose = document.getElementById("chatClose");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");
const chatSend = chatForm?.querySelector("button");
const chatStatus = document.getElementById("chatStatus");

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

chatForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const userText = chatInput?.value.trim();
  if (!userText) {
    chatStatus.textContent = "Type a message first.";
    return;
  }
  if (userText.length > 800) {
    chatStatus.textContent = "Please keep your question under 800 characters.";
    return;
  }

  appendMessage(userText, "user");
  chatInput.value = "";
  syncChatButton();
  const loadingMsg = appendMessage("Thinking…", "bot");
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
    if (loadingMsg) loadingMsg.textContent = "The assistant is temporarily unavailable. Please try again in a moment.";
    chatStatus.textContent = error.message || "Assistant connection failed.";
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

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[char]));
}
