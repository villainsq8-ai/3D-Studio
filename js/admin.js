/**
 * Drives admin.html — prototype order-management dashboard.
 * NOTE: this page has no real authentication or server-side authorization.
 * Before deploying to production, put it behind real auth (see README).
 */
(function () {
  const FILTER_GROUPS = {
    pending: ["Pending Review", "Waiting for Approval", "Payment Pending", "Order Received"],
    quotation: ["Quotation Sent"],
    production: ["Paid", "Design Stage", "In Production", "Quality Check"],
    ready: ["Ready", "Out for Delivery"],
    delivered: ["Delivered"],
    cancelled: ["Cancelled"],
  };

  function orderAmount(order) {
    if (order.kind === "product") return order.totals.total;
    if (order.quotation) return order.quotation.price;
    return null;
  }

  function renderStats() {
    const orders = getOrders();
    const count = (group) => orders.filter((o) => FILTER_GROUPS[group].includes(o.status)).length;
    const revenue = orders.reduce((sum, o) => {
      if (o.status === "Cancelled") return sum;
      const amount = orderAmount(o);
      return sum + (amount || 0);
    }, 0);
    const stats = [
      ["Total Orders", orders.length],
      ["Pending Requests", count("pending") + count("quotation")],
      ["In Production", count("production")],
      ["Ready", count("ready")],
      ["Delivered", count("delivered")],
      ["Revenue", formatKWD(revenue)],
    ];
    const wrap = qs("#admin-stats");
    wrap.innerHTML = "";
    stats.forEach(([label, value]) => {
      wrap.appendChild(el("div", { class: "stat-card" }, [el("div", { class: "stat-value" }, [String(value)]), el("div", { class: "stat-label" }, [label])]));
    });
  }

  function matchesFilter(order, filter) {
    if (filter === "all") return true;
    return (FILTER_GROUPS[filter] || []).includes(order.status);
  }

  function renderTable() {
    const tbody = qs("#admin-table-body");
    const filter = qs("#admin-filter-tabs .chip.active")?.dataset.filter || "all";
    const query = (qs("#admin-search").value || "").trim().toLowerCase();

    let orders = getOrders().filter((o) => matchesFilter(o, filter));
    if (query) {
      orders = orders.filter((o) => o.id.toLowerCase().includes(query) || o.customer.name.toLowerCase().includes(query));
    }

    tbody.innerHTML = "";
    if (!orders.length) {
      tbody.appendChild(el("tr", { class: "admin-empty-row" }, [el("td", { colspan: "7" }, ["No orders match this view."])]));
      return;
    }
    orders.forEach((order) => {
      const amount = orderAmount(order);
      tbody.appendChild(el("tr", {}, [
        el("td", {}, [order.id]),
        el("td", {}, [order.customer.name]),
        el("td", {}, [order.kind === "custom" ? `Custom · ${order.custom.type}` : "Product"]),
        el("td", {}, [new Date(order.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })]),
        el("td", {}, [amount == null ? "—" : formatKWD(amount)]),
        el("td", {}, [el("span", { class: `status-chip ${statusClass(order.status)}` }, [order.status])]),
        el("td", {}, [el("a", { href: `admin.html?id=${order.id}`, class: "btn btn-outline btn-sm" }, ["VIEW"])]),
      ]));
    });
  }

  function initList() {
    const tabsWrap = qs("#admin-filter-tabs");
    ["all", "pending", "quotation", "production", "ready", "delivered", "cancelled"].forEach((f) => {
      const btn = el("button", { class: `chip${f === "all" ? " active" : ""}`, "data-filter": f }, [f.toUpperCase()]);
      btn.addEventListener("click", () => { qsa(".chip", tabsWrap).forEach((c) => c.classList.remove("active")); btn.classList.add("active"); renderTable(); });
      tabsWrap.appendChild(btn);
    });
    qs("#admin-search").addEventListener("input", debounce(renderTable, 150));
    renderStats();
    renderTable();
  }

  /* ------------------------------------------------------------- Detail */
  function renderDetail(order) {
    qs("#admin-list-view").style.display = "none";
    qs("#admin-detail-view").style.display = "block";
    qs("#admin-detail-id").textContent = order.id;
    const chip = qs("#admin-detail-status-chip");
    chip.textContent = order.status;
    chip.className = `status-chip ${statusClass(order.status)}`;

    const infoWrap = qs("#admin-customer-info");
    infoWrap.innerHTML = "";
    [["Name", order.customer.name], ["Phone", order.customer.phone], ["Email", order.customer.email || "—"]].forEach(([k, v]) => {
      infoWrap.appendChild(el("div", { class: "detail-row" }, [el("span", { class: "k" }, [k]), el("span", {}, [v])]));
    });

    const productWrap = qs("#admin-product-info");
    if (order.kind === "product") {
      productWrap.style.display = "block";
      productWrap.querySelector(".rows").innerHTML = "";
      order.items.forEach((item) => {
        productWrap.querySelector(".rows").appendChild(el("div", { class: "detail-row" }, [
          el("span", { class: "k" }, [`${item.name} × ${item.qty}${item.options && Object.keys(item.options).length ? ` (${optionsLabel(item.options)})` : ""}`]),
          el("span", {}, [formatKWD(item.price * item.qty)]),
        ]));
      });
      productWrap.querySelector(".rows").appendChild(el("div", { class: "detail-row" }, [el("span", { class: "k" }, ["Total"]), el("span", {}, [formatKWD(order.totals.total)])]));
      productWrap.querySelector(".rows").appendChild(el("div", { class: "detail-row" }, [el("span", { class: "k" }, ["Delivery"]), el("span", {}, [order.delivery.method === "delivery" ? `${order.delivery.area}, Block ${order.delivery.block}` : "Pickup"])]));
      productWrap.querySelector(".rows").appendChild(el("div", { class: "detail-row" }, [el("span", { class: "k" }, ["Payment"]), el("span", {}, [order.payment.method])]));
    } else {
      productWrap.style.display = "none";
    }

    const customWrap = qs("#admin-custom-info");
    if (order.kind === "custom") {
      customWrap.style.display = "block";
      const c = order.custom;
      const dims = c.dimensions && !c.dimensions.unknown ? `${c.dimensions.width || "?"} × ${c.dimensions.height || "?"} × ${c.dimensions.depth || "?"} ${c.dimensions.unit}` : "To be advised";
      const rows = [["Product Type", c.type], ["Description", c.description], ["Dimensions", dims], ["Budget", c.budget], ["Deadline", c.deadline], ["Quantity", c.quantity], ["Delivery Method", c.deliveryMethod]];
      const rowsWrap = customWrap.querySelector(".rows");
      rowsWrap.innerHTML = "";
      rows.forEach(([k, v]) => rowsWrap.appendChild(el("div", { class: "detail-row" }, [el("span", { class: "k" }, [k]), el("span", {}, [String(v)])])));

      const filesWrap = customWrap.querySelector(".files");
      filesWrap.innerHTML = "";
      (c.files || []).forEach((f) => {
        filesWrap.appendChild(f.dataUrl
          ? el("img", { src: f.dataUrl, alt: f.name, class: "upload-thumb", style: "width:60px;height:60px;" })
          : el("div", { class: "upload-thumb upload-thumb-file", style: "width:60px;height:60px;" }, [f.name.split(".").pop().toUpperCase()]));
      });
      filesWrap.style.display = (c.files || []).length ? "flex" : "none";
    } else {
      customWrap.style.display = "none";
    }

    const statusSelect = qs("#admin-status-select");
    statusSelect.innerHTML = "";
    ORDER_STATUSES.forEach((s) => statusSelect.appendChild(el("option", { value: s, selected: s === order.status ? "selected" : null }, [s])));

    qs("#admin-whatsapp-btn").onclick = () => openWhatsApp(`Hello ${order.customer.name}, this is regarding your order ${order.id} (status: ${order.status}).`);
    qs("#admin-save-status-btn").onclick = () => {
      updateOrderStatus(order.id, statusSelect.value);
      toast(`Status updated to "${statusSelect.value}"`);
      order = getOrderById(order.id);
      renderDetail(order);
    };

    const quotationCard = qs("#admin-quotation-card");
    quotationCard.style.display = "block";
    qs("#quote-price-input").value = order.quotation ? order.quotation.price : "";
    qs("#quote-time-input").value = order.quotation ? order.quotation.productionTime : "";
    qs("#quote-notes-input").value = order.quotation ? order.quotation.notes : "";
    qs("#admin-send-quote-btn").onclick = () => {
      const price = parseFloat(qs("#quote-price-input").value);
      if (!price || price <= 0) { toast("Enter a valid quoted price", "error"); return; }
      saveQuotation(order.id, { price, productionTime: qs("#quote-time-input").value.trim(), notes: qs("#quote-notes-input").value.trim() });
      toast("Quotation sent to customer");
      order = getOrderById(order.id);
      renderDetail(order);
    };
  }

  function initDetail(id) {
    const order = getOrderById(id);
    if (!order) {
      qs("#admin-detail-view").innerHTML = `<div class="empty-state"><p class="empty-title">Order not found</p><a href="admin.html" class="btn btn-primary">Back to Dashboard</a></div>`;
      qs("#admin-detail-view").style.display = "block";
      qs("#admin-list-view").style.display = "none";
      return;
    }
    renderDetail(order);
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (!qs("#admin-stats")) return;
    const id = getParam("id");
    if (id) initDetail(id); else initList();
  });
})();
