const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

window.addEventListener("load", () => {
  setTimeout(() => $("#pageLoader")?.classList.add("hide"), 500);
});

const header = $("#siteHeader");
const backTop = $("#backTop");
const menuToggle = $("#menuToggle");
const navMenu = $("#navMenu");

function updateScrollUI() {
  const y = window.scrollY;
  header?.classList.toggle("scrolled", y > 30);
  backTop?.classList.toggle("show", y > 500);

  const sections = $$("main section[id]");
  const links = $$(".nav-link");
  let current = "home";

  sections.forEach(section => {
    const top = section.offsetTop - 150;
    if (y >= top) current = section.id;
  });

  links.forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
}

window.addEventListener("scroll", updateScrollUI, { passive: true });
updateScrollUI();

menuToggle?.addEventListener("click", () => {
  const open = navMenu.classList.toggle("open");
  menuToggle.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("menu-open", open);
});

$$(".nav-link, .nav-book").forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    menuToggle.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  });
});

backTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

$$(".reveal").forEach(el => observer.observe(el));

const counters = $$(".counter");
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const el = entry.target;
    const target = Number(el.dataset.target);
    const isDecimal = !Number.isInteger(target);
    const duration = 1300;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = isDecimal ? value.toFixed(1) : Math.floor(value);
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.6 });

counters.forEach(counter => counterObserver.observe(counter));

const reviews = $$(".review-card");
let reviewIndex = 0;

function showReview(index) {
  reviewIndex = (index + reviews.length) % reviews.length;
  reviews.forEach((review, i) => review.classList.toggle("active", i === reviewIndex));
}

$("#prevReview")?.addEventListener("click", () => showReview(reviewIndex - 1));
$("#nextReview")?.addEventListener("click", () => showReview(reviewIndex + 1));

setInterval(() => {
  if (document.visibilityState === "visible") showReview(reviewIndex + 1);
}, 6000);

$("#whatsappBtn")?.addEventListener("click", () => {
  const message = encodeURIComponent(
    "Hi Infinity The Family Salon, I would like to book an appointment."
  );
  window.open(`https://wa.me/917567176784?text=${message}`, "_blank", "noopener");
});
