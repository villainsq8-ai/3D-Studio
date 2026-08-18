/**
 * Small shared helpers used across every page.
 */

/** Format a number as Kuwaiti Dinar with 3 decimals, e.g. formatKWD(12.5) -> "KD 12.500" */
function formatKWD(value) {
  const n = Number(value) || 0;
  return `${CONFIG.currency} ${n.toFixed(3)}`;
}

function qs(sel, root) { return (root || document).querySelector(sel); }
function qsa(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

function el(tag, attrs, children) {
  const node = document.createElement(tag);
  attrs = attrs || {};
  Object.keys(attrs).forEach((k) => {
    if (k === "class") node.className = attrs[k];
    else if (k === "html") node.innerHTML = attrs[k];
    else if (k.startsWith("on") && typeof attrs[k] === "function") node.addEventListener(k.slice(2), attrs[k]);
    else if (attrs[k] === null || attrs[k] === undefined || attrs[k] === false) { /* omit falsy attrs entirely */ }
    else node.setAttribute(k, attrs[k] === true ? "" : attrs[k]);
  });
  (children || []).forEach((c) => {
    if (c === null || c === undefined) return;
    const isNode = c instanceof Node;
    node.appendChild(isNode ? c : document.createTextNode(String(c)));
  });
  return node;
}

/** Read the ?param=value from the current URL */
function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function uid(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

/** Sequential, human-readable order IDs: ORD-2026-00125 / CST-2026-00041 */
function nextSequentialId(prefix, storeKey) {
  const year = new Date().getFullYear();
  const counters = JSON.parse(localStorage.getItem("id_counters") || "{}");
  const key = `${prefix}-${year}`;
  counters[key] = (counters[key] || 0) + 1;
  localStorage.setItem("id_counters", JSON.stringify(counters));
  return `${prefix}-${year}-${String(counters[key]).padStart(5, "0")}`;
}

function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait || 250);
  };
}

function escapeHtml(str) {
  return String(str || "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

/**
 * Premium gradient placeholder used whenever a real product photo is missing.
 * Renders a small SVG data-URI so there is never a broken-image icon.
 */
function placeholderImage(label, theme) {
  const themes = {
    orange: ["#3a2308", "#0d0906"],
    neon: ["#2a0f3d", "#07131a"],
    cyan: ["#062a30", "#050d10"],
    default: ["#1a1f26", "#0b0e12"],
  };
  const [c1, c2] = themes[theme] || themes.default;
  const text = escapeHtml((label || "3 STUDIO").toUpperCase());
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="600" height="600">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${c1}"/>
        <stop offset="100%" stop-color="${c2}"/>
      </linearGradient>
      <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
        <path d="M30 0H0V30" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="600" height="600" fill="url(#g)"/>
    <rect width="600" height="600" fill="url(#grid)"/>
    <circle cx="300" cy="255" r="70" fill="none" stroke="rgba(255,152,0,0.35)" stroke-width="2"/>
    <text x="300" y="265" font-family="Arial" font-size="20" fill="rgba(255,152,0,0.55)" text-anchor="middle">3</text>
    <foreignObject x="60" y="330" width="480" height="180">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:Arial,sans-serif;color:#9EA7B3;text-align:center;font-size:22px;font-weight:700;letter-spacing:1px;line-height:1.4;">
        ${text}<br/><span style="color:#5b6672;font-size:15px;font-weight:400;">IMAGE COMING SOON</span>
      </div>
    </foreignObject>
  </svg>`.trim();
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Global, capture-phase fallback for every <img data-fallback-label="...">.
 * Registered here (utils.js is loaded synchronously in <head>, before any
 * <img> in <body> is parsed) so it never loses the race against fast local
 * 404s the way a per-element / DOMContentLoaded-time listener would.
 * "error" does not bubble, so this must use the capture phase.
 */
document.addEventListener("error", (e) => {
  const img = e.target;
  if (img && img.tagName === "IMG" && img.dataset.fallbackLabel && !img.dataset.fallbackApplied) {
    img.dataset.fallbackApplied = "1";
    img.src = placeholderImage(img.dataset.fallbackLabel, img.dataset.fallbackTheme);
  }
}, true);

/** No-op kept for call-site compatibility — fallback wiring is global now (see above). */
function wireImageFallbacks() {}

function getLS(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}
function setLS(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
