/**
 * Drives order.html — single order/quote-request detail with status
 * timeline, customer & product/custom info, and quotation accept/decline.
 */
(function () {
  let order = null;

  function renderTimeline() {
    const wrap = qs("#order-timeline");
    wrap.innerHTML = "";
    if (order.status === "Cancelled") {
      qs("#cancelled-banner").style.display = "block";
      wrap.style.display = "none";
      return;
    }
    const steps = orderTimeline(order);
    const currentIndex = steps.indexOf(order.status);
    steps.forEach((step, i) => {
      let cls = "";
      if (currentIndex === -1) cls = i === 0 ? "done" : "";
      else if (i < currentIndex) cls = "done";
      else if (i === currentIndex) cls = "current";
      const marker = cls === "done" ? "✓" : cls === "current" ? "●" : "○";
      wrap.appendChild(el("div", { class: `timeline-step ${cls}` }, [
        el("div", { class: "timeline-marker" }, [marker]),
        el("div", { class: "timeline-label" }, [step]),
      ]));
    });
  }

  function renderHeader() {
    qs("#order-detail-id").textContent = order.id;
    qs("#order-detail-date").textContent = new Date(order.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
    const chip = qs("#order-detail-status");
    chip.textContent = order.status;
    chip.className = `status-chip ${statusClass(order.status)}`;
  }

  function renderCustomer() {
    const wrap = qs("#customer-info");
    wrap.innerHTML = "";
    [["Name", order.customer.name], ["Phone", order.customer.phone], ["Email", order.customer.email || "—"]].forEach(([k, v]) => {
      wrap.appendChild(el("div", { class: "detail-row" }, [el("span", { class: "k" }, [k]), el("span", {}, [v])]));
    });
  }

  function renderProductOrder() {
    const items = qs("#items-card");
    items.style.display = "block";
    const list = qs("#order-items-list");
    order.items.forEach((item) => {
      list.appendChild(el("div", { class: "detail-row" }, [
        el("span", { class: "k" }, [`${item.name} × ${item.qty}${item.options && Object.keys(item.options).length ? ` (${optionsLabel(item.options)})` : ""}`]),
        el("span", {}, [formatKWD(item.price * item.qty)]),
      ]));
    });
    qs("#order-subtotal").textContent = formatKWD(order.totals.subtotal);
    qs("#order-delivery").textContent = order.totals.delivery === 0 ? "Free" : formatKWD(order.totals.delivery);
    qs("#order-total").textContent = formatKWD(order.totals.total);

    const deliveryCard = qs("#delivery-info");
    deliveryCard.style.display = "block";
    const d = order.delivery;
    const rows = d.method === "delivery"
      ? [["Method", "Kuwait Delivery"], ["Area", d.area], ["Block", d.block], ["Street", d.street], ["Avenue", d.avenue || "—"], ["Building", d.building], ["Floor", d.floor || "—"], ["Apartment", d.apartment || "—"], ["Notes", d.instructions || "—"]]
      : [["Method", "Pickup"]];
    rows.push(["Payment", paymentLabel(order.payment.method)]);
    rows.forEach(([k, v]) => qs("#delivery-info-rows").appendChild(el("div", { class: "detail-row" }, [el("span", { class: "k" }, [k]), el("span", {}, [v])])));
  }

  function paymentLabel(method) {
    return { cash: "Cash / On Pickup", knet: "KNET", card: "Visa / Mastercard", applepay: "Apple Pay", link: "Payment Link" }[method] || method;
  }

  function renderCustomOrder() {
    const card = qs("#custom-info-card");
    card.style.display = "block";
    const c = order.custom;
    const dims = c.dimensions && !c.dimensions.unknown ? `${c.dimensions.width || "?"} × ${c.dimensions.height || "?"} × ${c.dimensions.depth || "?"} ${c.dimensions.unit}` : "To be advised";
    const rows = [
      ["Type", c.type], ["Quantity", c.quantity], ["Dimensions", dims], ["Budget", c.budget],
      ["Deadline", c.deadline], ["Delivery Method", c.deliveryMethod], ["Description", c.description],
    ];
    const wrap = qs("#custom-info-rows");
    rows.forEach(([k, v]) => wrap.appendChild(el("div", { class: "detail-row" }, [el("span", { class: "k" }, [k]), el("span", {}, [v])])));

    if (c.files && c.files.length) {
      const filesWrap = qs("#custom-files");
      filesWrap.style.display = "flex";
      c.files.forEach((f) => {
        filesWrap.appendChild(
          f.dataUrl
            ? el("img", { src: f.dataUrl, alt: f.name, class: "upload-thumb", style: "width:64px;height:64px;" })
            : el("div", { class: "upload-thumb upload-thumb-file", style: "width:64px;height:64px;" }, [f.name.split(".").pop().toUpperCase()])
        );
      });
    }
  }

  function renderQuotation() {
    if (!order.quotation) return;
    const box = qs("#quotation-box");
    box.style.display = "block";
    qs("#quotation-price").textContent = formatKWD(order.quotation.price);
    qs("#quotation-time").textContent = order.quotation.productionTime || "—";
    qs("#quotation-notes").textContent = order.quotation.notes || "—";

    const actions = qs("#quotation-actions");
    actions.innerHTML = "";
    if (order.status === "Quotation Sent") {
      actions.appendChild(el("button", { class: "btn btn-primary", onclick: () => {
        respondToQuotation(order.id, true);
        toast("Quotation accepted");
        refresh();
      } }, ["ACCEPT QUOTATION"]));
      actions.appendChild(el("button", { class: "btn btn-outline", onclick: () => {
        confirmModal({ title: "Decline quotation?", body: "This will cancel your order request.", confirmLabel: "Decline", onConfirm: () => { respondToQuotation(order.id, false); toast("Quotation declined"); refresh(); } });
      } }, ["DECLINE"]));
      actions.appendChild(el("button", { class: "btn btn-ghost", onclick: () => openWhatsApp(`Hello, I have a question about the quotation for order ${order.id}.`) }, ["ASK A QUESTION"]));
    }
  }

  function refresh() {
    order = getOrderById(order.id);
    qs("#order-timeline").style.display = "flex";
    qs("#cancelled-banner").style.display = "none";
    qs("#quotation-box").style.display = "none";
    qs("#quotation-actions").innerHTML = "";
    renderHeader();
    renderTimeline();
    renderQuotation();
  }

  function init() {
    const wrap = qs("#order-detail-wrap");
    if (!wrap) return;
    const id = getParam("id");
    order = id ? getOrderById(id) : null;
    if (!order) {
      wrap.innerHTML = `<div class="empty-state"><p class="empty-title">Order not found</p><p class="empty-sub">Check the link or view all your orders.</p><a href="orders.html" class="btn btn-primary">My Orders</a></div>`;
      return;
    }

    initBreadcrumbs([{ label: "Home", href: "index.html" }, { label: "My Orders", href: "orders.html" }, { label: order.id, href: `order.html?id=${order.id}` }]);
    renderHeader();
    renderTimeline();
    renderCustomer();
    if (order.kind === "custom") renderCustomOrder(); else renderProductOrder();
    renderQuotation();

    qs("#contact-order-btn").addEventListener("click", () => openWhatsApp(orderStatusWhatsAppMessage(order)));
  }

  document.addEventListener("DOMContentLoaded", init);
})();
