/**
 * Drives checkout.html: contact info, delivery method + Kuwait address,
 * payment method selector (prototype — no real processing), order review,
 * and final order placement into the unified order store.
 */
(function () {
  function renderAreaOptions() {
    const select = qs("#area");
    if (!select) return;
    KUWAIT_AREAS.forEach((area) => select.appendChild(el("option", { value: area }, [area])));
  }

  function renderReview() {
    const items = getCart();
    const list = qs("#review-items");
    list.innerHTML = "";
    items.forEach((item) => {
      list.appendChild(el("div", { class: "detail-row" }, [
        el("span", { class: "k" }, [`${item.name} × ${item.qty}${item.options && Object.keys(item.options).length ? ` (${optionsLabel(item.options)})` : ""}`]),
        el("span", {}, [formatKWD(item.price * item.qty)]),
      ]));
    });
    qs("#review-subtotal").textContent = formatKWD(cartSubtotal());
    const delivery = cartDelivery();
    qs("#review-delivery").textContent = delivery === 0 ? "Free" : formatKWD(delivery);
    qs("#review-total").textContent = formatKWD(cartTotal());
  }

  function toggleDeliveryFields() {
    const isDelivery = qs('input[name="delivery-method"]:checked').value === "delivery";
    qs("#delivery-address-fields").style.display = isDelivery ? "block" : "none";
    qsa("#delivery-address-fields [data-required]").forEach((f) => { f.required = isDelivery; });
  }

  function selectPaymentCard(value) {
    qsa(".payment-card").forEach((c) => c.classList.toggle("selected", c.dataset.value === value));
    qs("#payment-note").style.display = value === "cash" ? "none" : "block";
  }

  function validate(form) {
    let valid = true;
    const requiredFields = ["name", "phone", "email"];
    const isDelivery = qs('input[name="delivery-method"]:checked').value === "delivery";
    if (isDelivery) requiredFields.push("area", "block", "street", "building");
    requiredFields.forEach((name) => {
      const field = form.elements[name];
      if (!field) return;
      const isEmpty = !field.value.trim();
      field.classList.toggle("input-error", isEmpty);
      if (isEmpty) valid = false;
    });
    if (!getCart().length) valid = false;
    return valid;
  }

  function init() {
    const form = qs("#checkout-form");
    if (!form) return;

    if (!getCart().length) {
      qs("#checkout-layout").innerHTML = `<div class="empty-state"><p class="empty-title">Your cart is empty</p><p class="empty-sub">Add a product before checking out.</p><a href="3d-prints.html" class="btn btn-primary">Browse Products</a></div>`;
      return;
    }

    renderAreaOptions();
    renderReview();
    toggleDeliveryFields();

    qsa('input[name="delivery-method"]').forEach((r) => r.addEventListener("change", toggleDeliveryFields));
    qsa(".payment-card").forEach((card) => card.addEventListener("click", () => {
      qs(`input[name="payment"][value="${card.dataset.value}"]`).checked = true;
      selectPaymentCard(card.dataset.value);
    }));
    selectPaymentCard("cash");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validate(form)) { toast("Please complete the required fields", "error"); return; }

      const isDelivery = qs('input[name="delivery-method"]:checked').value === "delivery";
      const customer = { name: form.elements.name.value.trim(), phone: form.elements.phone.value.trim(), email: form.elements.email.value.trim() };
      const delivery = {
        method: isDelivery ? "delivery" : "pickup",
        area: isDelivery ? form.elements.area.value : "",
        block: isDelivery ? form.elements.block.value.trim() : "",
        street: isDelivery ? form.elements.street.value.trim() : "",
        avenue: isDelivery ? form.elements.avenue.value.trim() : "",
        building: isDelivery ? form.elements.building.value.trim() : "",
        floor: isDelivery ? form.elements.floor.value.trim() : "",
        apartment: isDelivery ? form.elements.apartment.value.trim() : "",
        instructions: isDelivery ? form.elements.instructions.value.trim() : "",
      };
      const payment = { method: form.elements.payment.value };
      const totals = { subtotal: cartSubtotal(), delivery: cartDelivery(), total: cartTotal() };
      const order = buildProductOrder(customer, delivery, payment, getCart(), totals);
      saveOrder(order);
      clearCart();
      window.location.href = `order-success.html?id=${order.id}`;
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
