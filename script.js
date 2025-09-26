/* =========================================================
   Chiza Site Script
   Modern, minimal, and page-agnostic helpers
   ========================================================= */

/* -------------------------------
   0) Small helpers
-------------------------------- */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const isExternal = (href) => {
  try {
    const u = new URL(href, location.href);
    return u.origin !== location.origin;
  } catch { return false; }
};

/* -------------------------------
   1) Mark the active nav item
-------------------------------- */
(function markActiveNav() {
  const path = location.pathname.split("/").pop() || "index.html";
  const links = $$(".nav a");
  links.forEach(a => {
    const href = a.getAttribute("href");
    if (!href) return;
    // match index.html or root
    const isHome = (path === "" || path === "index.html") && (href === "index.html");
    if (isHome || href === path) a.classList.add("active");
  });
})();

/* -------------------------------
   2) Tabs with filter support
   Works for any .tabs group. It looks for:
   - data-filter on the clicked button
   - a target grid to filter:
       a) via data-target on the .tabs element (selector)
       b) or an element with id #grid, #t-grid, or .cert-grid
   Expects items in the grid to have:
       data-type  or  data-category
-------------------------------- */
(function enableTabs() {
  $$(".tabs").forEach(tabsEl => {
    const getTargetGrid = () => {
      const sel = tabsEl.getAttribute("data-target");
      if (sel) return $(sel);
      return $("#grid") || $("#t-grid") || $(".cert-grid") || $(".grid-training");
    };

    const grid = getTargetGrid();
    if (!grid) return;

    tabsEl.addEventListener("click", (e) => {
      const btn = e.target.closest(".tab");
      if (!btn) return;
      const filter = btn.dataset.filter || "all";
      // visual state
      $$(".tab", tabsEl).forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // if grid has dynamic renderer elsewhere, just publish an event
      const ev = new CustomEvent("tabs:filter", { detail: { filter, grid } });
      document.dispatchEvent(ev);

      // fallback filter for static cards
      const children = Array.from(grid.children);
      const attr = children.some(x => x.hasAttribute("data-type")) ? "data-type" : "data-category";
      children.forEach(card => {
        const val = card.getAttribute(attr);
        card.style.display = (filter === "all" || val === filter) ? "" : "none";
      });
    });
  });
})();

/* -------------------------------
   3) Freebie success state
   Shows the success notice when redirected with ?sent=1
-------------------------------- */
(function freebieSuccess() {
  const params = new URLSearchParams(location.search);
  if (params.get("sent") === "1") {
    const form = $("#freebie-form");
    const ok   = $("#success");
    if (form && ok) {
      form.hidden = true;
      ok.hidden = false;
    }
  }
})();

/* -------------------------------
   4) External link hygiene
   Ensures target and rel on external anchors
-------------------------------- */
(function secureExternalLinks() {
  $$("a[href]").forEach(a => {
    const href = a.getAttribute("href");
    if (href && isExternal(href)) {
      a.target = a.target || "_blank";
      const rel = new Set((a.getAttribute("rel") || "").split(/\s+/).filter(Boolean));
      rel.add("noopener"); rel.add("noreferrer");
      a.setAttribute("rel", Array.from(rel).join(" "));
    }
  });
})();

/* -------------------------------
   5) Lazy fade-in on scroll
   Adds .reveal when elements enter viewport
-------------------------------- */
(function revealOnScroll() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("reveal");
        io.unobserve(e.target);
      }
    });
  }, { threshold: .15 });

  $$(".card, .product, .t-card, .testi-card, .hero, .section").forEach(el => io.observe(el));
})();

/* -------------------------------
   6) Smooth scroll for same-page anchors
-------------------------------- */
(function smoothAnchors() {
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href");
    if (id.length <= 1) return;
    const target = $(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.pushState(null, "", id);
  });
})();

/* -------------------------------
   7) Image fallback helper
   Use: <img data-fallback="images/certificate-fallback.jpg">
-------------------------------- */
(function imageFallback() {
  $$("img[data-fallback]").forEach(img => {
    const fallback = img.getAttribute("data-fallback");
    img.addEventListener("error", () => {
      if (img.dataset.failed) return; // avoid loops
      img.dataset.failed = "1";
      img.src = fallback;
    }, { once: true });
  });
})();

/* -------------------------------
   8) Lightweight analytics ping (optional)
   Adds a data-action label to Ko-fi buttons for future use
-------------------------------- */
(function tagCtas() {
  $$('a[href*="ko-fi.com"]').forEach(a => {
    a.dataset.action = a.dataset.action || "kofi";
  });
})();
