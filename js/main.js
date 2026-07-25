// ChakataStat marketing site — no dependencies, no third-party requests.

document.getElementById("year").textContent = new Date().getFullYear();

// Theme. Three states, not two: "light", "dark", and no stored preference at
// all — which follows the system and is the default. The toggle flips between
// the two explicit states, starting from whichever one is currently showing,
// so the first click always visibly does something.
const THEME_KEY = "chakatastat-theme";
const themeToggle = document.querySelector(".theme-toggle");
const systemDark = window.matchMedia("(prefers-color-scheme: dark)");

function storedTheme() {
  try {
    const t = localStorage.getItem(THEME_KEY);
    return t === "light" || t === "dark" ? t : null;
  } catch (e) {
    return null; // Private mode, or storage disabled.
  }
}

function activeTheme() {
  return storedTheme() || (systemDark.matches ? "dark" : "light");
}

// The hero shot is a <picture> whose dark <source> matches on
// prefers-color-scheme — which the toggle cannot change. Rewriting the
// source's media query is what keeps the image in step with an explicit
// choice; without this the page would go dark around a light screenshot.
function syncHeroShot(theme) {
  const source = document.querySelector(".app-frame source");
  if (!source) return;
  const stored = storedTheme();
  if (!stored) {
    source.media = "(prefers-color-scheme: dark)";
  } else {
    source.media = theme === "dark" ? "all" : "not all";
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  syncHeroShot(theme);
  if (themeToggle) {
    themeToggle.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to the light theme" : "Switch to the dark theme",
    );
  }
}

if (themeToggle) {
  applyTheme(activeTheme());
  themeToggle.addEventListener("click", () => {
    const next = activeTheme() === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (e) {
      // Not fatal: the choice just will not survive the next page load.
    }
    applyTheme(next);
  });
  // Keep following the system while no explicit choice has been stored.
  systemDark.addEventListener("change", () => {
    if (!storedTheme()) applyTheme(activeTheme());
  });
}

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
