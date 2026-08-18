/**
 * Drives favorites.html — saved products list.
 */
document.addEventListener("DOMContentLoaded", () => {
  const grid = qs("#favorites-grid");
  if (!grid) return;
  const empty = qs("#favorites-empty");
  const favIds = getFavorites();
  const products = PRODUCTS.filter((p) => favIds.includes(p.id));

  if (!products.length) {
    empty.style.display = "flex";
    grid.style.display = "none";
    return;
  }
  empty.style.display = "none";
  grid.style.display = "grid";
  renderProductGrid(grid, products);

  // Removing a favorite here should drop its card immediately.
  grid.addEventListener("click", (e) => {
    if (e.target.closest(".fav-btn")) {
      setTimeout(() => {
        const remaining = PRODUCTS.filter((p) => getFavorites().includes(p.id));
        if (!remaining.length) { empty.style.display = "flex"; grid.style.display = "none"; }
        else renderProductGrid(grid, remaining);
      }, 200);
    }
  });
});
