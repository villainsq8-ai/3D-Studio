/**
 * Drives orders.html — the customer-facing "My Orders" list.
 * Orders live in this browser's localStorage only (see README).
 */
document.addEventListener("DOMContentLoaded", () => {
  const container = qs("#orders-list");
  if (!container) return;
  const orders = getOrders();
  const empty = qs("#orders-empty");

  if (!orders.length) {
    empty.style.display = "flex";
    container.style.display = "none";
    return;
  }
  empty.style.display = "none";
  container.style.display = "block";

  orders.forEach((order) => {
    const total = order.kind === "custom" ? (order.quotation ? formatKWD(order.quotation.price) : "Pending Quote") : formatKWD(order.totals.total);
    const typeLabel = order.kind === "custom" ? `Custom · ${order.custom.type}` : order.items.map((i) => i.name).join(", ");
    const row = el("div", { class: "order-row" }, [
      el("div", { class: "order-row-main" }, [
        el("div", {}, [
          el("p", { class: "order-row-id" }, [order.id]),
          el("p", { class: "order-row-type" }, [typeLabel]),
        ]),
        el("span", { class: `status-chip ${statusClass(order.status)}` }, [order.status]),
      ]),
      el("div", { class: "order-row-meta" }, [
        el("span", {}, [new Date(order.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })]),
        el("span", { class: "order-row-total" }, [total]),
        el("a", { href: `order.html?id=${order.id}`, class: "btn btn-outline btn-sm" }, ["VIEW"]),
      ]),
    ]);
    container.appendChild(row);
  });
});
