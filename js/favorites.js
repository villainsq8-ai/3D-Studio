/**
 * Favorites (heart icon) store — localStorage list of product IDs.
 */
const FAVORITES_KEY = "favorites_v1";

function getFavorites() { return getLS(FAVORITES_KEY, []); }
function isFavorite(productId) { return getFavorites().includes(productId); }

function toggleFavorite(productId) {
  let favs = getFavorites();
  const isFav = favs.includes(productId);
  favs = isFav ? favs.filter((id) => id !== productId) : [...favs, productId];
  setLS(FAVORITES_KEY, favs);
  qsa(`[data-fav-id="${productId}"]`).forEach((btn) => btn.classList.toggle("active", !isFav));
  toast(isFav ? "Removed from favorites" : "Added to favorites");
  return !isFav;
}
