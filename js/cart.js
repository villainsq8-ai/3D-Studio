/**
 * Cart store (localStorage-backed) + cart drawer / cart-page rendering.
 * Cart item shape:
 *  { cartItemId, productId, name, image, price, qty, purchaseType, options: {...} }
 */
const CART_KEY = "cart_v1";

function getCart() { return getLS(CART_KEY, []); }
function saveCart(items) {
  setLS(CART_KEY, items);
  updateCartBadge();
  renderCartDrawer();
}

function cartCount() { return getCart().reduce((sum, i) => sum + i.qty, 0); }
function cartSubtotal() {
  return getCart().reduce((sum, i) => sum + (i.price || 0) * i.qty, 0);
}
function cartDelivery() {
  const items = getCart();
  if (!items.length) return 0;
  const subtotal = cartSubtotal();
  return subtotal >= CONFIG.freeDeliveryThreshold ? 0 : CONFIG.deliveryPrice;
}
function cartTotal() { return cartSubtotal() + cartDelivery(); }

function optionsSignature(options) {
  return JSON.stringify(options || {});
}

function addToCart(product, options, qty) {
  qty = qty || 1;
  options = options || {};
  const items = getCart();
  const existing = items.find((i) => i.productId === product.id && optionsSignature(i.options) === optionsSignature(options));
  if (existing) {
    existing.qty += qty;
  } else {
    items.push({
      cartItemId: uid("ci"),
      productId: product.id,
      name: product.name,
      image: (product.images && product.images[0]) || "",
      price: product.price || 0,
      purchaseType: product.purchaseType,
      options,
      qty,
    });
  }
  saveCart(items);
  toast(`${t("added")}: ${product.name}`);
}

function updateCartQty(cartItemId, qty) {
  const items = getCart();
  const item = items.find((i) => i.cartItemId === cartItemId);
  if (!item) return;
  item.qty = Math.max(1, qty);
  saveCart(items);
  renderCartPageIfPresent();
}

function removeFromCart(cartItemId) {
  const items = getCart().filter((i) => i.cartItemId !== cartItemId);
  saveCart(items);
  renderCartPageIfPresent();
  toast("Removed from cart");
}

function clearCart() {
  saveCart([]);
  renderCartPageIfPresent();
}

function updateCartBadge() {
  qsa("[data-cart-badge]").forEach((b) => {
    const count = cartCount();
    b.textContent = count;
    b.style.display = count > 0 ? "flex" : "none";
  });
}

function optionsLabel(options) {
  return Object.entries(options || {})
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join(" · ");
}

function cartItemRow(item, { compact } = {}) {
  const row = el("div", { class: "cart-row" }, [
    el("img", { src: item.image, alt: item.name, "data-fallback-label": item.name, "data-fallback-theme": "orange" }),
    el("div", { class: "cart-row-info" }, [
      el("p", { class: "cart-row-name" }, [item.name]),
      item.options && Object.keys(item.options).length
        ? el("p", { class: "cart-row-options" }, [optionsLabel(item.options)]) : null,
      el("p", { class: "cart-row-price" }, [formatKWD(item.price)]),
    ]),
    el("div", { class: "cart-row-actions" }, [
      el("div", { class: "qty-control" }, [
        el("button", { "aria-label": "Decrease quantity", onclick: () => updateCartQty(item.cartItemId, item.qty - 1) }, ["−"]),
        el("span", {}, [String(item.qty)]),
        el("button", { "aria-label": "Increase quantity", onclick: () => updateCartQty(item.cartItemId, item.qty + 1) }, ["+"]),
      ]),
      el("button", { class: "cart-row-remove", "aria-label": "Remove item", onclick: () => confirmModal({
        title: "Remove item?", body: `Remove "${item.name}" from your cart?`, confirmLabel: "Remove",
        onConfirm: () => removeFromCart(item.cartItemId),
      }) }, ["Remove"]),
    ]),
  ]);
  wireImageFallbacks(row);
  return row;
}

function renderCartDrawer() {
  const list = qs("#cart-drawer-items");
  if (!list) return;
  const items = getCart();
  list.innerHTML = "";
  const empty = qs("#cart-drawer-empty");
  if (!items.length) {
    if (empty) empty.style.display = "flex";
    list.style.display = "none";
  } else {
    if (empty) empty.style.display = "none";
    list.style.display = "block";
    items.forEach((item) => list.appendChild(cartItemRow(item, { compact: true })));
  }
  const sub = qs("#cart-drawer-subtotal"); if (sub) sub.textContent = formatKWD(cartSubtotal());
  const del = qs("#cart-drawer-delivery"); if (del) del.textContent = cartDelivery() === 0 ? "Free" : formatKWD(cartDelivery());
  const tot = qs("#cart-drawer-total"); if (tot) tot.textContent = formatKWD(cartTotal());
}

function renderCartPageIfPresent() {
  if (typeof renderCartPage === "function" && qs("#cart-page-items")) renderCartPage();
}

function openCartDrawer() {
  const drawer = qs("#cart-drawer");
  const overlay = qs("#cart-drawer-overlay");
  if (!drawer) return;
  renderCartDrawer();
  drawer.classList.add("open");
  overlay.classList.add("open");
  document.body.classList.add("no-scroll");
}
function closeCartDrawer() {
  const drawer = qs("#cart-drawer");
  const overlay = qs("#cart-drawer-overlay");
  if (!drawer) return;
  drawer.classList.remove("open");
  overlay.classList.remove("open");
  document.body.classList.remove("no-scroll");
}
