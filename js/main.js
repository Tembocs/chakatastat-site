// ChakataStat marketing site — no dependencies, no third-party requests.

document.getElementById("year").textContent = new Date().getFullYear();

const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");

navToggle.addEventListener("click", () => {
  const isOpen = header.classList.toggle("nav-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    header.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// Screenshot lightbox: click a screenshot to enlarge it, click anywhere
// outside the enlarged image (or the close button, or Esc) to dismiss.
const lightbox = document.getElementById("lightbox");
const lightboxImg = lightbox.querySelector("img");
const lightboxClose = lightbox.querySelector(".lightbox-close");
let lastFocused = null;

function openLightbox(img) {
  lastFocused = document.activeElement;
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  lightboxClose.focus();
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImg.src = "";
  document.body.style.overflow = "";
  if (lastFocused) lastFocused.focus();
}

// Bound to the button rather than the image, so Enter and Space open the
// lightbox as well as a click — the image alone was mouse-only.
document.querySelectorAll(".shot-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    openLightbox(trigger.querySelector("img"));
  });
});

lightboxClose.addEventListener("click", closeLightbox);

// Keep Tab inside the dialog while it is open. The lightbox holds exactly one
// focusable control, so the whole trap is "put focus back on it" — without
// this, Tab walks off into the page behind the overlay, which is still there
// and still clickable even though it looks dismissed.
lightbox.addEventListener("keydown", (event) => {
  if (event.key === "Tab") {
    event.preventDefault();
    lightboxClose.focus();
  }
});

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox.classList.contains("open")) {
    closeLightbox();
  }
});
