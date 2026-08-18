/**
 * WhatsApp deep-link helpers. Change CONFIG.whatsapp in js/config.js to your
 * business number (digits only, country code first, no leading +).
 */
function buildWhatsAppLink(message) {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;
}

function openWhatsApp(message) {
  window.open(buildWhatsAppLink(message), "_blank", "noopener");
}

function orderWhatsAppMessage(order) {
  const lines = [
    "Hello, I placed an order on your website.",
    `Order ID: ${order.id}`,
    `Name: ${order.customer.name}`,
    `Items: ${order.items.map((i) => `${i.name} x${i.qty}`).join(", ")}`,
    `Total: ${formatKWD(order.totals.total)}`,
    "Please confirm my order.",
    "Thank you.",
  ];
  return lines.join("\n");
}

function customOrderWhatsAppMessage(order) {
  const c = order.custom;
  const dims = c.dimensions && !c.dimensions.unknown
    ? `${c.dimensions.width || "?"} × ${c.dimensions.height || "?"} × ${c.dimensions.depth || "?"} ${c.dimensions.unit || "cm"}`
    : "To be advised";
  const lines = [
    "Hello,",
    "I submitted a custom order through your website.",
    `Order ID: ${order.id}`,
    `Name: ${order.customer.name}`,
    `Type: ${c.type}`,
    `Quantity: ${c.quantity}`,
    `Dimensions: ${dims}`,
    "Description:",
    c.description,
    "Please review my request.",
    "Thank you.",
  ];
  return lines.join("\n");
}

function orderStatusWhatsAppMessage(order) {
  return `Hello, I'd like an update on my order ${order.id} (current status: ${order.status}). Thank you.`;
}
