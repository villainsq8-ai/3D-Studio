/**
 * Unified order store (product orders + custom quote requests) backed by localStorage.
 * This is a prototype persistence layer — see README "Connecting a real backend"
 * for how to swap getOrders/saveOrder/etc. for real API calls without touching
 * any page markup.
 */
const ORDERS_KEY = "orders_v1";

const ORDER_STATUSES = [
  "Pending Review", "Quotation Sent", "Waiting for Approval", "Order Received",
  "Payment Pending", "Paid", "Design Stage", "In Production", "Quality Check",
  "Ready", "Out for Delivery", "Delivered", "Cancelled",
];

const PRODUCT_TIMELINE = ["Order Received", "Payment Pending", "Paid", "In Production", "Quality Check", "Ready", "Out for Delivery", "Delivered"];
const CUSTOM_TIMELINE = ["Pending Review", "Quotation Sent", "Waiting for Approval", "Payment Pending", "Paid", "Design Stage", "In Production", "Quality Check", "Ready", "Delivered"];

function orderTimeline(order) {
  return order.kind === "custom" ? CUSTOM_TIMELINE : PRODUCT_TIMELINE;
}

function statusClass(status) {
  if (status === "Delivered") return "status-success";
  if (status === "Cancelled") return "status-error";
  if (["Paid", "Design Stage", "In Production", "Quality Check"].includes(status)) return "status-purple";
  if (["Order Received", "Ready", "Out for Delivery"].includes(status)) return "status-info";
  return "status-pending";
}

function getOrders() {
  return getLS(ORDERS_KEY, []);
}

function getOrderById(id) {
  return getOrders().find((o) => o.id === id) || null;
}

function saveOrder(order) {
  const orders = getOrders();
  orders.unshift(order);
  setLS(ORDERS_KEY, orders);
  return order;
}

function updateOrder(id, patch) {
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return null;
  orders[idx] = { ...orders[idx], ...patch, updatedAt: new Date().toISOString() };
  setLS(ORDERS_KEY, orders);
  return orders[idx];
}

function updateOrderStatus(id, status) {
  return updateOrder(id, { status });
}

function saveQuotation(id, quotation) {
  return updateOrder(id, {
    quotation: { ...quotation, sentAt: new Date().toISOString() },
    status: "Quotation Sent",
  });
}

function respondToQuotation(id, accepted) {
  return updateOrder(id, { status: accepted ? "Payment Pending" : "Cancelled" });
}

function generateOrderId() { return nextSequentialId("ORD"); }
function generateCustomOrderId() { return nextSequentialId("CST"); }

/** Build a fresh product-purchase order from the current cart + checkout form data. */
function buildProductOrder(customer, delivery, payment, cartItems, totals) {
  return {
    id: generateOrderId(),
    kind: "product",
    createdAt: new Date().toISOString(),
    status: "Order Received",
    customer, delivery, payment,
    items: cartItems,
    totals,
    quotation: null,
  };
}

/** Build a fresh custom-order (quote request) record. */
function buildCustomOrder(data) {
  return {
    id: generateCustomOrderId(),
    kind: "custom",
    createdAt: new Date().toISOString(),
    status: "Pending Review",
    customer: { name: data.name, phone: data.phone, email: data.email },
    custom: data,
    quotation: null,
  };
}
