/**
 * Homepage-only rendering: featured 3D + neon product grids.
 */
document.addEventListener("DOMContentLoaded", async () => {
  await window.productsReady;
  const grid3d = qs("#featured-3d-grid");
  if (grid3d) renderProductGrid(grid3d, PRODUCTS.filter((p) => p.type === "3d" && p.featured).slice(0, 4));

  const gridNeon = qs("#featured-neon-grid");
  if (gridNeon) renderProductGrid(gridNeon, PRODUCTS.filter((p) => p.type === "neon" && p.featured).slice(0, 4));
});
