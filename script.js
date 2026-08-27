// ============================================================
// MOBILE NAV TOGGLE
// ============================================================
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Close mobile menu after tapping a link
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ============================================================
// ACTIVE LINK HIGHLIGHT ON SCROLL
// ============================================================
const sections = document.querySelectorAll('main section[id]');
const navAnchors = document.querySelectorAll('.nav-link');

const highlightNav = () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navAnchors.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--text)' : '';
  });
};
window.addEventListener('scroll', highlightNav);

// ============================================================
// FOOTER YEAR
// ============================================================
document.getElementById('year').textContent = new Date().getFullYear();

// ============================================================
// CONTACT FORM (static site — no backend wired up)
// EDIT: replace this handler with a real submission, e.g. by
// pointing the <form> at a service like Formspree, or wiring
// this fetch() call up to your own API endpoint.
// ============================================================
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  formNote.textContent = "This is a static demo form — connect it to a service like Formspree or your own API to actually send messages.";
  contactForm.reset();
});
