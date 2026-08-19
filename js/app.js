/**
 * Global chrome: header, mobile menu, footer, cart drawer shell, search
 * overlay, toasts, modals, WhatsApp float button, scroll-to-top, intro
 * loader. Injected on every page so header/footer/nav only live in one place.
 */

const NAV_ITEMS = [
  { key: "home", href: "index.html", label: "nav_home" },
  { key: "3d", href: "3d-prints.html", label: "nav_3d" },
  { key: "neon", href: "neon.html", label: "nav_neon" },
  { key: "customize", href: "customize.html", label: "nav_customize" },
  { key: "gallery", href: "gallery.html", label: "nav_gallery" },
  { key: "how", href: "index.html#how-it-works", label: "nav_how" },
  { key: "orders", href: "orders.html", label: "nav_orders" },
  { key: "about", href: "about.html", label: "nav_about" },
];

const ICONS = {
  search: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>',
  user: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>',
  cart: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1.5"/><circle cx="19" cy="21" r="1.5"/><path d="M1 1h3l2.5 13h11L20 6H5.5"/></svg>',
  heart: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-4.5-9.5-9C1 8 2 4 6 4c2 0 4 1.5 6 4 2-2.5 4-4 6-4 4 0 5 4 3.5 8-2.5 4.5-9.5 9-9.5 9z"/></svg>',
  whatsapp: '<svg width="26" height="26" viewBox="0 0 32 32" fill="currentColor"><path d="M16 3C9.4 3 4 8.4 4 15c0 2.4.7 4.6 1.9 6.5L4 29l7.7-1.9c1.8 1 3.9 1.5 6.3 1.5 6.6 0 12-5.4 12-12S22.6 3 16 3zm0 21.8c-2 0-3.9-.5-5.6-1.5l-.4-.2-4.6 1.2 1.2-4.5-.3-.5C5.4 17.6 5 16.3 5 15c0-6.1 5-11 11-11s11 4.9 11 11-4.9 11-11 11zm6-8.2c-.3-.2-2-1-2.3-1.1-.3-.1-.5-.2-.8.2-.2.3-.9 1.1-1.1 1.3-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.7-1.7-1-.9-1.7-2-1.9-2.3-.2-.3 0-.5.1-.7.2-.2.3-.4.5-.6.1-.2.2-.4.3-.6.1-.2 0-.5 0-.6-.1-.2-.8-1.9-1-2.6-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8 0 1.7 1.2 3.3 1.4 3.5.2.2 2.4 3.6 5.8 5 .8.3 1.4.6 1.9.7.8.3 1.5.2 2.1.1.6-.1 2-.8 2.2-1.6.3-.8.3-1.4.2-1.6-.1-.1-.3-.2-.6-.4z"/></svg>',
  close: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>',
};

function currentPageKey() { return document.body.dataset.page || ""; }

function navLinksHtml(mobile) {
  return NAV_ITEMS.map((item) => {
    const active = currentPageKey() === item.key ? " active" : "";
    return `<a href="${item.href}" class="${mobile ? "mobile-nav-link" : "nav-link"}${active}" data-i18n="${item.label}">${t(item.label)}</a>`;
  }).join("");
}

function headerHtml() {
  return `
  <div class="header-inner container">
    <a href="index.html" class="logo-link" aria-label="${CONFIG.businessFullName} — Home">
      <img src="${CONFIG.logo}" alt="${CONFIG.businessFullName} logo" class="logo-img" width="44" height="44" />
      <span class="logo-word">${CONFIG.businessFullName}</span>
    </a>
    <nav class="main-nav" aria-label="Main navigation">${navLinksHtml(false)}</nav>
    <div class="header-actions">
      <button class="icon-btn" id="search-trigger" aria-label="Search">${ICONS.search}</button>
      <a class="icon-btn" href="favorites.html" aria-label="Favorites">${ICONS.heart}</a>
      <a class="icon-btn" href="orders.html" aria-label="My orders / account">${ICONS.user}</a>
      <button class="icon-btn cart-btn" id="cart-trigger" aria-label="Open cart">
        ${ICONS.cart}<span class="cart-badge" data-cart-badge>0</span>
      </button>
      <div class="lang-switch" role="group" aria-label="Language">
        <button data-lang-toggle="en">EN</button>
        <button data-lang-toggle="ar">عربي</button>
      </div>
      <button class="hamburger" id="mobile-menu-trigger" aria-label="Open menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>`;
}

function mobileMenuHtml() {
  return `
  <div class="mobile-menu-panel" role="dialog" aria-modal="true" aria-label="Menu">
    <div class="mobile-menu-head">
      <a href="index.html" class="logo-link"><img src="${CONFIG.logo}" alt="${CONFIG.businessFullName}" width="36" height="36"/></a>
      <button class="icon-btn" id="mobile-menu-close" aria-label="Close menu">${ICONS.close}</button>
    </div>
    <nav class="mobile-nav" aria-label="Mobile">${navLinksHtml(true)}</nav>
    <div class="mobile-menu-foot">
      <div class="lang-switch" role="group" aria-label="Language">
        <button data-lang-toggle="en">EN</button>
        <button data-lang-toggle="ar">عربي</button>
      </div>
      <a class="btn btn-primary btn-block" href="contact.html">Contact Us</a>
    </div>
  </div>`;
}

function footerHtml() {
  return `
  <div class="container footer-grid">
    <div class="footer-col footer-brand">
      <a href="index.html" class="logo-link">
        <img src="${CONFIG.logo}" alt="${CONFIG.businessFullName}" width="40" height="40"/>
        <span class="logo-word">${CONFIG.businessFullName}</span>
      </a>
      <p>Ideas made real. 3D printing and custom neon in ${CONFIG.location}.</p>
      <div class="footer-social">
        <a href="https://instagram.com/${CONFIG.instagram.replace('@','')}" target="_blank" rel="noopener" aria-label="Instagram">IG</a>
        <a href="https://tiktok.com/${CONFIG.tiktok.replace('@','')}" target="_blank" rel="noopener" aria-label="TikTok">TT</a>
        <a href="#" id="footer-whatsapp" aria-label="WhatsApp">WA</a>
      </div>
    </div>
    <div class="footer-col">
      <h4>Shop</h4>
      <a href="3d-prints.html">3D Prints</a>
      <a href="neon.html">Neon Lights</a>
      <a href="customize.html">Custom Orders</a>
      <a href="gallery.html">Gallery</a>
    </div>
    <div class="footer-col">
      <h4>Help</h4>
      <a href="index.html#how-it-works">How It Works</a>
      <a href="checkout.html">Delivery</a>
      <a href="index.html#faq">FAQ</a>
      <a href="orders.html">My Orders</a>
      <a href="contact.html">Contact</a>
    </div>
    <div class="footer-col">
      <h4>Follow</h4>
      <a href="https://instagram.com/${CONFIG.instagram.replace('@','')}" target="_blank" rel="noopener">Instagram</a>
      <a href="https://tiktok.com/${CONFIG.tiktok.replace('@','')}" target="_blank" rel="noopener">TikTok</a>
      <a href="#" id="footer-whatsapp-2">WhatsApp</a>
    </div>
  </div>
  <div class="footer-bottom container">
    <p>&copy; 2026 ${CONFIG.businessFullName}. <span data-i18n="footer_rights">All rights reserved.</span></p>
    <div class="footer-legal">
      <a href="#" data-legal="privacy">Privacy Policy</a>
      <a href="#" data-legal="terms">Terms</a>
      <a href="#" data-legal="returns">Returns</a>
    </div>
  </div>`;
}

function cartDrawerHtml() {
  return `
  <aside id="cart-drawer" class="cart-drawer" aria-label="Shopping cart" aria-hidden="true">
    <div class="cart-drawer-head">
      <h3 data-i18n="cart_title">Your Cart</h3>
      <button class="icon-btn" id="cart-drawer-close" aria-label="Close cart">${ICONS.close}</button>
    </div>
    <div id="cart-drawer-empty" class="cart-empty">
      <p class="empty-title" data-i18n="cart_empty">Your cart is empty</p>
      <p class="empty-sub" data-i18n="cart_empty_sub">Looks like you haven't added anything yet.</p>
      <button class="btn btn-outline" id="cart-drawer-continue" data-i18n="cart_continue">Continue Shopping</button>
    </div>
    <div id="cart-drawer-items" class="cart-drawer-items"></div>
    <div class="cart-drawer-foot">
      <div class="cart-summary-row"><span data-i18n="cart_subtotal">Subtotal</span><span id="cart-drawer-subtotal">KD 0.000</span></div>
      <div class="cart-summary-row"><span data-i18n="cart_delivery">Delivery</span><span id="cart-drawer-delivery">KD 0.000</span></div>
      <div class="cart-summary-row cart-summary-total"><span data-i18n="cart_total">Total</span><span id="cart-drawer-total">KD 0.000</span></div>
      <a href="cart.html" class="btn btn-outline btn-block" data-i18n="cart_view">View Cart</a>
      <a href="checkout.html" class="btn btn-primary btn-block" data-i18n="cart_checkout">Checkout</a>
    </div>
  </aside>
  <div id="cart-drawer-overlay" class="drawer-overlay" aria-hidden="true"></div>`;
}

function searchOverlayHtml() {
  return `
  <div id="search-overlay" class="search-overlay" aria-hidden="true">
    <div class="search-overlay-inner">
      <div class="search-input-row">
        ${ICONS.search}
        <input id="search-input" type="search" data-i18n-ph="search_placeholder" placeholder="${t('search_placeholder')}" aria-label="Search products" autocomplete="off"/>
        <button class="icon-btn" id="search-close" aria-label="Close search">${ICONS.close}</button>
      </div>
      <div id="search-results" class="search-results"></div>
    </div>
  </div>`;
}

function scaffoldChrome() {
  const header = qs("#site-header");
  if (header) { header.innerHTML = headerHtml(); header.classList.add("site-header"); }

  document.body.insertAdjacentHTML("beforeend", `<div id="mobile-menu-overlay" class="mobile-menu-overlay" aria-hidden="true"></div>`);
  document.body.insertAdjacentHTML("beforeend", mobileMenuHtml());
  document.body.insertAdjacentHTML("beforeend", cartDrawerHtml());
  document.body.insertAdjacentHTML("beforeend", searchOverlayHtml());
  document.body.insertAdjacentHTML("beforeend", `<div id="toast-container" class="toast-container" aria-live="polite"></div>`);
  document.body.insertAdjacentHTML("beforeend", `
    <a id="whatsapp-float" class="whatsapp-float" href="#" aria-label="Chat on WhatsApp" target="_blank" rel="noopener">
      ${ICONS.whatsapp}<span class="wa-tooltip" data-i18n="whatsapp_tooltip">${t('whatsapp_tooltip')}</span>
    </a>`);
  document.body.insertAdjacentHTML("beforeend", `<button id="scroll-top-btn" class="scroll-top-btn" aria-label="Scroll to top">↑</button>`);

  const footer = qs("#site-footer");
  if (footer) { footer.innerHTML = footerHtml(); footer.classList.add("site-footer"); }
}

/* ---------------------------------------------------------------- Toasts */
function toast(message, type) {
  const container = qs("#toast-container");
  if (!container) return;
  const node = el("div", { class: `toast toast-${type || "default"}` }, [message]);
  container.appendChild(node);
  requestAnimationFrame(() => node.classList.add("show"));
  setTimeout(() => {
    node.classList.remove("show");
    setTimeout(() => node.remove(), 250);
  }, 3000);
}

/* ---------------------------------------------------------------- Modals */
function confirmModal({ title, body, confirmLabel, cancelLabel, onConfirm }) {
  const overlay = el("div", { class: "modal-overlay open" });
  const modal = el("div", { class: "modal confirm-modal", role: "alertdialog", "aria-modal": "true" }, [
    el("h3", {}, [title || "Are you sure?"]),
    el("p", {}, [body || ""]),
    el("div", { class: "modal-actions" }, [
      el("button", { class: "btn btn-ghost", onclick: () => overlay.remove() }, [cancelLabel || "Cancel"]),
      el("button", { class: "btn btn-danger", onclick: () => { onConfirm && onConfirm(); overlay.remove(); } }, [confirmLabel || "Confirm"]),
    ]),
  ]);
  overlay.appendChild(modal);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}

/* --------------------------------------------------------------- Wiring */
function wireHeaderAndDrawers() {
  qs("#cart-trigger")?.addEventListener("click", openCartDrawer);
  qs("#cart-drawer-close")?.addEventListener("click", closeCartDrawer);
  qs("#cart-drawer-overlay")?.addEventListener("click", closeCartDrawer);
  qs("#cart-drawer-continue")?.addEventListener("click", closeCartDrawer);

  const menuOverlay = qs("#mobile-menu-overlay");
  const menuPanel = qs(".mobile-menu-panel");
  function openMenu() {
    menuOverlay.classList.add("open"); menuPanel.classList.add("open");
    qs("#mobile-menu-trigger").setAttribute("aria-expanded", "true");
    document.body.classList.add("no-scroll");
  }
  function closeMenu() {
    menuOverlay.classList.remove("open"); menuPanel.classList.remove("open");
    qs("#mobile-menu-trigger").setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
  }
  qs("#mobile-menu-trigger")?.addEventListener("click", openMenu);
  qs("#mobile-menu-close")?.addEventListener("click", closeMenu);
  menuOverlay?.addEventListener("click", closeMenu);
  qsa(".mobile-nav-link").forEach((a) => a.addEventListener("click", closeMenu));

  const searchOverlay = qs("#search-overlay");
  function openSearch() {
    searchOverlay.classList.add("open");
    document.body.classList.add("no-scroll");
    setTimeout(() => qs("#search-input").focus(), 50);
  }
  function closeSearch() { searchOverlay.classList.remove("open"); document.body.classList.remove("no-scroll"); }
  qs("#search-trigger")?.addEventListener("click", openSearch);
  qs("#search-close")?.addEventListener("click", closeSearch);
  qs("#search-input")?.addEventListener("input", debounce((e) => renderSearchResults(e.target.value), 150));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeSearch(); closeCartDrawer(); closeMenu(); } });

  qsa("[data-lang-toggle]").forEach((btn) => btn.addEventListener("click", () => {
    applyLanguage(btn.dataset.langToggle);
    document.body.insertAdjacentHTML("beforeend", "");
    location.reload();
  }));

  const waHref = buildWhatsAppLink("Hello, I have a question about your products.");
  const waFloat = qs("#whatsapp-float"); if (waFloat) waFloat.href = waHref;
  const waFoot = qs("#footer-whatsapp"); if (waFoot) waFoot.href = waHref;
  const waFoot2 = qs("#footer-whatsapp-2"); if (waFoot2) waFoot2.href = waHref;

  qsa("[data-legal]").forEach((a) => a.addEventListener("click", (e) => {
    e.preventDefault();
    toast("This is a prototype — legal pages are placeholders.");
  }));

  const scrollBtn = qs("#scroll-top-btn");
  window.addEventListener("scroll", debounce(() => {
    scrollBtn.classList.toggle("visible", window.scrollY > 500);
    qs(".site-header")?.classList.toggle("scrolled", window.scrollY > 20);
  }, 50));
  scrollBtn?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

function renderSearchResults(query) {
  const results = qs("#search-results");
  if (!results) return;
  query = (query || "").trim().toLowerCase();
  if (!query) { results.innerHTML = `<p class="search-hint">Try: deck box, car holder, gaming, neon, office logo</p>`; return; }
  const matches = PRODUCTS.filter((p) => {
    const haystack = `${p.name} ${p.category} ${(p.tags || []).join(" ")}`.toLowerCase();
    return haystack.includes(query);
  }).slice(0, 8);
  if (!matches.length) {
    results.innerHTML = `<div class="empty-state"><p class="empty-title" data-i18n="search_empty">No results found</p></div>`;
    return;
  }
  results.innerHTML = "";
  matches.forEach((p) => {
    const a = el("a", { class: "search-result", href: `product.html?id=${p.id}` }, [
      el("img", { src: p.images[0], alt: p.name, "data-fallback-label": p.name, "data-fallback-theme": p.type === "neon" ? "neon" : "orange" }),
      el("div", {}, [
        el("p", { class: "search-result-name" }, [p.name]),
        el("p", { class: "search-result-price" }, [p.price ? formatKWD(p.price) : "Request Quote"]),
      ]),
    ]);
    results.appendChild(a);
  });
  wireImageFallbacks(results);
}

/* ---------------------------------------------------------- Intro loader */
function runIntroLoader() {
  if (sessionStorage.getItem("intro_shown")) return;
  sessionStorage.setItem("intro_shown", "1");
  const loader = el("div", { class: "intro-loader" }, [
    el("img", { src: CONFIG.logo, alt: CONFIG.businessFullName, class: "intro-logo" }),
  ]);
  document.body.appendChild(loader);
  document.body.classList.add("no-scroll");
  requestAnimationFrame(() => loader.classList.add("show"));
  setTimeout(() => {
    loader.classList.add("hide");
    document.body.classList.remove("no-scroll");
    setTimeout(() => loader.remove(), 500);
  }, 700);
}

/* ------------------------------------------------------------- Reveal-in */
function initScrollReveal() {
  const targets = qsa("[data-reveal]");
  if (!("IntersectionObserver" in window) || !targets.length) {
    targets.forEach((t2) => t2.classList.add("revealed"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("revealed"); io.unobserve(entry.target); }
    });
  }, { threshold: 0.01, rootMargin: "0px 0px 120px 0px" });
  targets.forEach((t2) => io.observe(t2));
}

/* --------------------------------------------------------------- Init -- */
function initBreadcrumbs(items) {
  const nav = qs("#breadcrumbs");
  if (!nav) return;
  nav.innerHTML = items.map((it, i) => {
    if (i === items.length - 1) return `<span class="crumb-current" aria-current="page">${escapeHtml(it.label)}</span>`;
    return `<a href="${it.href}">${escapeHtml(it.label)}</a><span class="crumb-sep">/</span>`;
  }).join("");
}

/* ------------------------------------------------------------- Accordion */
function initAccordions() {
  qsa(".accordion-item").forEach((item) => {
    const trigger = qs(".accordion-trigger", item);
    const panel = qs(".accordion-panel", item);
    if (!trigger || !panel) return;
    trigger.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      item.parentElement.querySelectorAll(".accordion-item.open").forEach((other) => {
        if (other !== item) { other.classList.remove("open"); qs(".accordion-panel", other).style.maxHeight = null; }
      });
      item.classList.toggle("open", !isOpen);
      panel.style.maxHeight = !isOpen ? `${panel.scrollHeight}px` : null;
    });
  });
}

/* ------------------------------------------------------------------ Tabs */
function initTabs(root) {
  qsa(".tabs", root).forEach((tabs) => {
    const panelGroup = tabs.nextElementSibling;
    qsa(".tab-btn", tabs).forEach((btn) => {
      btn.addEventListener("click", () => {
        qsa(".tab-btn", tabs).forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        qsa(".tab-panel", panelGroup).forEach((p) => p.classList.toggle("active", p.dataset.tab === btn.dataset.tab));
      });
    });
  });
}

/* --------------------------------------------------------- Before/After */
function initBeforeAfterSliders() {
  qsa(".before-after").forEach((el2) => {
    const after = qs(".after-layer", el2);
    const handle = qs(".before-after-handle", el2);
    function setPos(clientX) {
      const rect = el2.getBoundingClientRect();
      let pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      const rtl = document.documentElement.dir === "rtl";
      after.style.clipPath = rtl ? `inset(0 ${pct}% 0 0)` : `inset(0 0 0 ${pct}%)`;
      handle.style.left = `${rtl ? 100 - pct : pct}%`;
    }
    let dragging = false;
    el2.addEventListener("pointerdown", (e) => { dragging = true; setPos(e.clientX); });
    window.addEventListener("pointermove", (e) => { if (dragging) setPos(e.clientX); });
    window.addEventListener("pointerup", () => { dragging = false; });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  runIntroLoader();
  scaffoldChrome();
  applyLanguage();
  wireHeaderAndDrawers();
  updateCartBadge();
  renderCartDrawer();
  initScrollReveal();
  initAccordions();
  initTabs();
  initBeforeAfterSliders();
  wireImageFallbacks(document);
  registerServiceWorker();
});

/* ------------------------------------------------------- PWA / installable */
function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  if (location.protocol !== "https:" && location.hostname !== "localhost" && location.hostname !== "127.0.0.1") return;
  navigator.serviceWorker.register("sw.js").catch(() => { /* offline support is a progressive enhancement */ });
}
