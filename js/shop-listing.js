/**
 * Drives 3d-prints.html and neon.html. Both pages set `window.LISTING_TYPE`
 * ("3d" or "neon") and `window.LISTING_CATEGORIES` (ordered tab list) before
 * this script runs.
 */
(function () {
  function init() {
    const grid = qs("#listing-grid");
    if (!grid || !window.LISTING_TYPE) return;

    const tabsWrap = qs("#category-tabs");
    const resultCount = qs("#result-count");
    const sortSelect = qs("#sort-select");
    let activeCategory = getParam("category") || "all";

    LISTING_CATEGORIES.forEach((cat) => {
      const btn = el("button", { class: `chip${cat.slug === activeCategory ? " active" : ""}`, "data-cat": cat.slug }, [cat.label]);
      btn.addEventListener("click", () => { activeCategory = cat.slug; render(); qsa(".chip", tabsWrap).forEach((c) => c.classList.toggle("active", c.dataset.cat === activeCategory)); });
      tabsWrap.appendChild(btn);
    });

    function render() {
      let items = PRODUCTS.filter((p) => p.type === window.LISTING_TYPE);
      if (activeCategory !== "all") items = items.filter((p) => p.category === activeCategory);

      const sort = sortSelect ? sortSelect.value : "featured";
      if (sort === "price-asc") items = [...items].sort((a, b) => (a.price ?? 9999) - (b.price ?? 9999));
      if (sort === "price-desc") items = [...items].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));

      renderProductGrid(grid, items);
      if (resultCount) resultCount.textContent = `${items.length} product${items.length === 1 ? "" : "s"}`;
    }

    sortSelect?.addEventListener("change", render);
    render();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
