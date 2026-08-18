/**
 * Global site configuration.
 * Edit these values to rebrand, change contact details, or adjust pricing rules.
 */
const CONFIG = {
  businessName: "3",
  businessFullName: "3 Studio",
  whatsapp: "96512345678",          // digits only, country code first — no +, no spaces
  email: "hello@3neon.com",
  instagram: "@3.studio.kw",
  tiktok: "@3.studio.kw",
  location: "Kuwait",
  currency: "KD",
  deliveryPrice: 2.000,
  freeDeliveryThreshold: 30.000,
  defaultLanguage: "en",
  logo: "assets/logo/logo.svg",
};

// Kuwait governorates, used by the checkout delivery-area selector.
const KUWAIT_AREAS = [
  "Al Asimah (Capital)",
  "Hawalli",
  "Farwaniya",
  "Mubarak Al-Kabeer",
  "Ahmadi",
  "Jahra",
];

if (typeof module !== "undefined") module.exports = { CONFIG, KUWAIT_AREAS };
