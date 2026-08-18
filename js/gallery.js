/**
 * Drives gallery.html — filterable masonry portfolio + lightbox.
 */
const GALLERY_ITEMS = [
  { id: "g1", src: "assets/3d/deck-boxes/deck-box-01.jpg", title: "Custom Trading Card Deck Box", category: "3d", categoryLabel: "3D Prints", theme: "orange" },
  { id: "g2", src: "assets/neon/gaming/neon-gamer-name-01.jpg", title: "Gaming Name Neon", category: "neon", categoryLabel: "Neon", theme: "neon" },
  { id: "g3", src: "assets/3d/car/car-phone-holder-01.jpg", title: "Car Phone Holder", category: "car", categoryLabel: "Car", theme: "orange" },
  { id: "g4", src: "assets/neon/cafe/neon-cafe-quote-01.jpg", title: "Café Wall Neon", category: "cafes", categoryLabel: "Cafés", theme: "neon" },
  { id: "g5", src: "assets/3d/gaming/controller-stand-01.jpg", title: "Gaming Controller Stand", category: "gaming", categoryLabel: "Gaming", theme: "orange" },
  { id: "g6", src: "assets/neon/office/neon-office-reception-01.jpg", title: "Office Reception Logo", category: "business", categoryLabel: "Business", theme: "neon" },
  { id: "g7", src: "assets/neon/events/neon-exhibition-booth-01.jpg", title: "Exhibition Booth Logo", category: "events", categoryLabel: "Events", theme: "neon" },
  { id: "g8", src: "assets/3d/office/name-plate-01.jpg", title: "Custom Name Plate", category: "3d", categoryLabel: "3D Prints", theme: "orange" },
  { id: "g9", src: "assets/3d/car/car-cup-organizer-01.jpg", title: "Car Cup Holder Organizer", category: "car", categoryLabel: "Car", theme: "orange" },
  { id: "g10", src: "assets/neon/business/neon-business-logo-01.jpg", title: "Business Logo Neon", category: "business", categoryLabel: "Business", theme: "neon" },
  { id: "g11", src: "assets/3d/gaming/headphone-stand-01.jpg", title: "Headphone Stand", category: "gaming", categoryLabel: "Gaming", theme: "orange" },
  { id: "g12", src: "assets/neon/wedding/neon-wedding-name-01.jpg", title: "Custom Wedding Name", category: "events", categoryLabel: "Events", theme: "neon" },
  { id: "g13", src: "assets/neon/cafe/neon-restaurant-wall-01.jpg", title: "Restaurant Wall Logo", category: "cafes", categoryLabel: "Cafés", theme: "neon" },
  { id: "g14", src: "assets/3d/car/dashboard-accessory-01.jpg", title: "Custom Dashboard Accessory", category: "car", categoryLabel: "Car", theme: "orange" },
];

(function () {
  let currentIndex = 0;
  let currentItems = GALLERY_ITEMS;

  function renderGrid(filter) {
    const grid = qs("#gallery-grid");
    currentItems = filter === "all" ? GALLERY_ITEMS : GALLERY_ITEMS.filter((i) => i.category === filter);
    grid.innerHTML = "";
    currentItems.forEach((item, idx) => {
      const node = el("div", { class: "masonry-item", tabindex: "0", role: "button", "aria-label": `View ${item.title}` }, [
        el("img", { src: item.src, alt: item.title, loading: "lazy", "data-fallback-label": item.title, "data-fallback-theme": item.theme }),
        el("div", { class: "masonry-caption" }, [`${item.title} — ${item.categoryLabel}`]),
      ]);
      node.addEventListener("click", () => openLightboxAt(idx));
      node.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLightboxAt(idx); } });
      grid.appendChild(node);
    });
  }

  function openLightboxAt(idx) {
    currentIndex = idx;
    updateLightbox();
    qs("#gallery-lightbox").classList.add("open");
    document.body.classList.add("no-scroll");
  }
  function closeLightbox() {
    qs("#gallery-lightbox").classList.remove("open");
    document.body.classList.remove("no-scroll");
  }
  function updateLightbox() {
    const item = currentItems[currentIndex];
    qs("#gallery-lightbox-img").src = item.src;
    qs("#gallery-lightbox-img").dataset.fallbackLabel = item.title;
    qs("#gallery-lightbox-img").dataset.fallbackTheme = item.theme;
    qs("#gallery-lightbox-caption").textContent = `${item.title} — ${item.categoryLabel}`;
  }
  function step(dir) {
    currentIndex = (currentIndex + dir + currentItems.length) % currentItems.length;
    updateLightbox();
  }

  function init() {
    if (!qs("#gallery-grid")) return;
    const tabsWrap = qs("#gallery-filter-tabs");
    const filters = [
      ["all", "ALL"], ["3d", "3D PRINTS"], ["car", "CAR"], ["gaming", "GAMING"],
      ["neon", "NEON"], ["business", "BUSINESS"], ["cafes", "CAFÉS"], ["events", "EVENTS"],
    ];
    filters.forEach(([slug, label]) => {
      const btn = el("button", { class: `chip${slug === "all" ? " active" : ""}`, "data-filter": slug }, [label]);
      btn.addEventListener("click", () => { qsa(".chip", tabsWrap).forEach((c) => c.classList.remove("active")); btn.classList.add("active"); renderGrid(slug); });
      tabsWrap.appendChild(btn);
    });
    renderGrid("all");

    qs("#gallery-lightbox-close").addEventListener("click", closeLightbox);
    qs("#gallery-lightbox-prev").addEventListener("click", () => step(-1));
    qs("#gallery-lightbox-next").addEventListener("click", () => step(1));
    qs("#gallery-lightbox").addEventListener("click", (e) => { if (e.target.id === "gallery-lightbox") closeLightbox(); });
    document.addEventListener("keydown", (e) => {
      if (!qs("#gallery-lightbox").classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
