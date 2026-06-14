(function () {
  "use strict";

  /* ── THEME ──────────────────────────────────────────────── */
  const body = document.body;
  const themeBtn = document.getElementById("themeBtn");
  const ICON = themeBtn ? themeBtn.querySelector(".theme-icon") : null;

  function applyTheme(theme) {
    if (theme === "light") {
      body.classList.add("light");
      body.classList.remove("dark");
      if (ICON) ICON.textContent = "🌙";
    } else {
      body.classList.add("dark");
      body.classList.remove("light");
      if (ICON) ICON.textContent = "☀️";
    }
  }

  // Load saved preference or default to dark
  const saved = localStorage.getItem("portfolio-theme") || "dark";
  applyTheme(saved);

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const current = body.classList.contains("light") ? "light" : "dark";
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      localStorage.setItem("portfolio-theme", next);
    });
  }

  /* ── MOBILE NAV ─────────────────────────────────────────── */
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close when a link is clicked
    navLinks.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ── ACTIVE NAV LINK (scroll spy) ──────────────────────── */
  const sections = document.querySelectorAll("section[id], header[id]");
  const links = document.querySelectorAll(".nav-link");

  function updateActiveLink() {
    let current = "";
    const scrollY = window.scrollY + 100;

    sections.forEach((section) => {
      if (scrollY >= section.offsetTop) {
        current = section.id;
      }
    });

    links.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${current}`,
      );
    });
  }

  /* ── SCROLL REVEAL ──────────────────────────────────────── */
  const revealEls = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger children within the same parent
          setTimeout(
            () => {
              entry.target.classList.add("visible");
            },
            80 * (entry.target.dataset.delay || 0),
          );
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );

  // Add stagger delays to sibling groups
  function assignStaggerDelays() {
    const staggerParents = [
      ".projects-grid",
      ".about-cards",
      ".certs-grid",
      ".hero-actions",
      ".skill-groups",
      ".contact-grid",
    ];
    staggerParents.forEach((selector) => {
      const parent = document.querySelector(selector);
      if (!parent) return;
      const children = parent.querySelectorAll(".reveal");
      children.forEach((el, i) => {
        el.dataset.delay = i;
      });
    });
  }

  assignStaggerDelays();
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ── BACK TO TOP ────────────────────────────────────────── */
  const toTop = document.getElementById("toTop");

  function handleScroll() {
    const scrolled = window.scrollY;

    // Back-to-top visibility
    if (toTop) {
      toTop.hidden = scrolled < 400;
    }

    // Active nav link
    updateActiveLink();
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  // Run once on load
  handleScroll();

  /* ── FOOTER YEAR ────────────────────────────────────────── */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── CONTACT FORM (graceful mailto fallback) ────────────── */
  document
    .getElementById("contactForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const form = e.target;

      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        window.location.href = "thanks.html";
      }
    });

  /* ── NAV BACKDROP ON SCROLL ─────────────────────────────── */
  const nav = document.querySelector(".nav");
  if (nav) {
    const scrollObserver = new IntersectionObserver(
      ([entry]) => {
        nav.style.boxShadow = entry.isIntersecting
          ? "none"
          : "0 4px 24px rgba(0,0,0,0.2)";
      },
      { threshold: 0 },
    );
    const sentinel = document.createElement("div");
    sentinel.style.cssText =
      "position:absolute;top:1px;left:0;width:1px;height:1px;pointer-events:none;";
    document.body.prepend(sentinel);
    scrollObserver.observe(sentinel);
  }
})();
