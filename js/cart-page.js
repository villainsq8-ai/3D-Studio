/**
 * Drives cart.html — full cart view built on top of the shared cart store.
 */
function renderCartPage() {
  const container = qs("#cart-page-items");
  if (!container) return;
  const items = getCart();
  const empty = qs("#cart-page-empty");
  const summary = qs("#cart-summary");

  if (!items.length) {
    empty.style.display = "flex";
    container.style.display = "none";
    summary.style.display = "none";
    return;
  }
  empty.style.display = "none";
  container.style.display = "block";
  summary.style.display = "block";

  container.innerHTML = "";
  items.forEach((item) => container.appendChild(cartItemRow(item)));

  qs("#summary-subtotal").textContent = formatKWD(cartSubtotal());
  const delivery = cartDelivery();
  qs("#summary-delivery").textContent = delivery === 0 ? "Free" : formatKWD(delivery);
  qs("#summary-total").textContent = formatKWD(cartTotal());
  qs("#free-delivery-note").style.display = cartSubtotal() >= CONFIG.freeDeliveryThreshold ? "none" : "block";
}

document.addEventListener("DOMContentLoaded", () => {
  if (!qs("#cart-page-items")) return;
  renderCartPage();
  qs("#clear-cart-btn")?.addEventListener("click", () => {
    confirmModal({
      title: "Clear cart?",
      body: "This will remove all items from your cart.",
      confirmLabel: "Clear",
      onConfirm: () => { clearCart(); toast("Cart cleared"); },
    });
  });
});
