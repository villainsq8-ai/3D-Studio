/**
 * Product catalog. This is the single source of truth rendered by
 * 3d-prints.html, neon.html, product.html, gallery.html and the homepage.
 * purchaseType: "direct" -> Add to Cart works normally.
 * purchaseType: "quote"  -> customer sends a quote request instead of buying directly.
 */
const PRODUCTS = [
  // ---------------------------------------------------------------- 3D PRINTS
  {
    id: "deck-box-01", type: "3d", category: "deck-boxes",
    name: "Custom Trading Card Deck Box",
    price: 12.000, purchaseType: "direct", customizable: true, featured: true,
    rating: 4.9, reviews: 38,
    images: ["assets/3d/deck-boxes/deck-box-01.jpg", "assets/3d/deck-boxes/deck-box-02.jpg", "assets/3d/deck-boxes/deck-box-03.jpg"],
    colors: ["Black", "White", "Orange", "Grey", "Custom"],
    materials: ["PLA", "PETG"],
    description: "A precision 3D-printed deck box for trading card games — sized for double-sleeved cards, with a magnetic-friction lid and clean layer-free finish. Add your own name or logo for a personal touch.",
    tags: ["deck box", "cards", "gaming", "storage"],
  },
  {
    id: "car-phone-holder", type: "3d", category: "car",
    name: "Custom Car Phone Holder",
    price: 8.000, purchaseType: "direct", customizable: true, featured: true,
    rating: 4.7, reviews: 21,
    images: ["assets/3d/car/car-phone-holder-01.jpg", "assets/3d/car/car-phone-holder-02.jpg"],
    colors: ["Black", "Grey", "Custom"],
    materials: ["PETG", "TPU"],
    description: "A vent- or dash-mounted phone holder, custom-fitted to your vehicle and phone size for a snug, rattle-free grip.",
    tags: ["car", "phone holder", "accessory"],
  },
  {
    id: "car-cup-organizer", type: "3d", category: "car",
    name: "Car Cup Holder Organizer",
    price: 6.500, purchaseType: "direct", customizable: false,
    rating: 4.6, reviews: 14,
    images: ["assets/3d/car/car-cup-organizer-01.jpg"],
    colors: ["Black", "Grey"],
    materials: ["PLA", "PETG"],
    description: "Keep loose coins, cards and small items organized in your cup holder instead of rolling around the cabin.",
    tags: ["car", "organizer"],
  },
  {
    id: "car-interior-clip", type: "3d", category: "car",
    name: "Custom Car Interior Clip",
    price: 3.000, purchaseType: "direct", customizable: true,
    rating: 4.5, reviews: 9,
    images: ["assets/3d/car/car-interior-clip-01.jpg"],
    colors: ["Black"],
    materials: ["Nylon", "PETG"],
    description: "Replacement clips and small interior fasteners, reverse-engineered and reprinted for your exact vehicle.",
    tags: ["car", "replacement part"],
  },
  {
    id: "controller-stand", type: "3d", category: "gaming",
    name: "Gaming Controller Stand",
    price: 7.500, purchaseType: "direct", customizable: true, featured: true,
    rating: 4.8, reviews: 27,
    images: ["assets/3d/gaming/controller-stand-01.jpg", "assets/3d/gaming/controller-stand-02.jpg"],
    colors: ["Black", "White", "Orange", "Custom"],
    materials: ["PLA", "PETG"],
    description: "A clean desk stand for your controller with cable pass-through and a stable weighted base.",
    tags: ["gaming", "controller", "desk"],
  },
  {
    id: "headphone-stand", type: "3d", category: "gaming",
    name: "Headphone Stand",
    price: 9.000, purchaseType: "direct", customizable: true,
    rating: 4.9, reviews: 33,
    images: ["assets/3d/gaming/headphone-stand-01.jpg"],
    colors: ["Black", "White", "Orange", "Grey", "Custom"],
    materials: ["PLA", "PETG"],
    description: "A sturdy headset stand with optional name plate on the base — built to hold weight without tipping.",
    tags: ["gaming", "headphones", "desk"],
  },
  {
    id: "cable-organizer", type: "3d", category: "organizers",
    name: "Cable Management Organizer",
    price: 4.000, purchaseType: "direct", customizable: false,
    rating: 4.4, reviews: 12,
    images: ["assets/3d/office/cable-organizer-01.jpg"],
    colors: ["Black", "White"],
    materials: ["PLA"],
    description: "Modular clips to route and tidy desk cables — chargers, monitor cables and peripherals kept in place.",
    tags: ["desk", "organizer", "cables"],
  },
  {
    id: "name-plate", type: "3d", category: "office",
    name: "Custom Name Plate",
    price: 5.500, purchaseType: "direct", customizable: true,
    rating: 4.7, reviews: 18,
    images: ["assets/3d/office/name-plate-01.jpg"],
    colors: ["Black", "White", "Orange", "Custom"],
    materials: ["PLA", "PETG"],
    description: "A desk or door name plate with raised or engraved text, finished in your choice of color.",
    tags: ["office", "desk", "gift"],
  },
  {
    id: "dashboard-accessory", type: "3d", category: "car",
    name: "Custom Dashboard Accessory",
    price: 6.000, purchaseType: "quote", customizable: true,
    rating: 4.6, reviews: 7,
    images: ["assets/3d/car/dashboard-accessory-01.jpg"],
    colors: ["Black", "Custom"],
    materials: ["PETG", "TPU"],
    description: "One-off dashboard accessories designed around your make, model and year — send us photos or measurements.",
    tags: ["car", "custom part"],
  },

  // ------------------------------------------------------------------ NEON
  {
    id: "neon-gaming-controller", type: "neon", category: "gaming",
    name: "Gaming Controller Neon",
    price: 25.000, purchaseType: "direct", customizable: true, featured: true,
    rating: 4.9, reviews: 16,
    images: ["assets/neon/gaming/neon-controller-01.jpg", "assets/neon/gaming/neon-controller-02.jpg"],
    neonColors: ["Purple", "Cyan", "Pink", "Blue"],
    description: "A wall-mounted controller-shaped neon sign for gaming rooms and setups. Fully configurable text, size and color.",
    tags: ["neon", "gaming", "controller"],
  },
  {
    id: "neon-custom-name", type: "neon", category: "custom-text",
    name: "Custom Gamer Name",
    price: 20.000, purchaseType: "direct", customizable: true, featured: true,
    rating: 5.0, reviews: 41,
    images: ["assets/neon/gaming/neon-gamer-name-01.jpg"],
    neonColors: ["Orange", "Cyan", "Purple", "Pink", "Cool White"],
    description: "Your name or gamertag, custom-shaped in neon. Choose the font, size, color and mounting style.",
    tags: ["neon", "custom text", "name"],
  },
  {
    id: "neon-business-logo", type: "neon", category: "business-logos",
    name: "Business Logo Neon",
    price: null, purchaseType: "quote", customizable: true,
    rating: 4.8, reviews: 11,
    images: ["assets/neon/business/neon-business-logo-01.jpg"],
    neonColors: ["Orange", "Warm White", "Cool White", "Custom"],
    description: "Your company logo recreated as an illuminated neon sign for reception areas, storefronts and offices.",
    tags: ["neon", "business", "logo"],
  },
  {
    id: "neon-restaurant-wall", type: "neon", category: "cafes-restaurants",
    name: "Restaurant Wall Logo",
    price: null, purchaseType: "quote", customizable: true,
    rating: 4.7, reviews: 8,
    images: ["assets/neon/cafe/neon-restaurant-wall-01.jpg"],
    neonColors: ["Warm White", "Orange", "Red", "Custom"],
    description: "A statement wall piece for restaurants — logo, tagline or signature dish name in glowing neon.",
    tags: ["neon", "restaurant", "wall art"],
  },
  {
    id: "neon-cafe-quote", type: "neon", category: "cafes-restaurants",
    name: "Café Neon Quote",
    price: 35.000, purchaseType: "direct", customizable: true,
    rating: 4.8, reviews: 19,
    images: ["assets/neon/cafe/neon-cafe-quote-01.jpg"],
    neonColors: ["Warm White", "Pink", "Yellow"],
    description: "A cozy custom quote or phrase in neon script, perfect for café interiors and photo corners.",
    tags: ["neon", "cafe", "quote"],
  },
  {
    id: "neon-office-reception", type: "neon", category: "offices",
    name: "Office Reception Logo",
    price: null, purchaseType: "quote", customizable: true,
    rating: 4.9, reviews: 6,
    images: ["assets/neon/office/neon-office-reception-01.jpg"],
    neonColors: ["Cool White", "Orange", "Cyan", "Custom"],
    description: "A minimal, premium logo sign for reception walls — built to match your brand guidelines.",
    tags: ["neon", "office", "logo"],
  },
  {
    id: "neon-exhibition-booth", type: "neon", category: "events",
    name: "Exhibition Booth Logo",
    price: null, purchaseType: "quote", customizable: true,
    rating: 4.6, reviews: 5,
    images: ["assets/neon/events/neon-exhibition-booth-01.jpg"],
    neonColors: ["Custom"],
    description: "Lightweight, freestanding or hanging neon signage built for exhibition booths and pop-up events.",
    tags: ["neon", "events", "booth"],
  },
  {
    id: "neon-wedding-name", type: "neon", category: "weddings",
    name: "Custom Wedding Name",
    price: 30.000, purchaseType: "direct", customizable: true,
    rating: 5.0, reviews: 23,
    images: ["assets/neon/wedding/neon-wedding-name-01.jpg"],
    neonColors: ["Warm White", "Pink", "Cool White"],
    description: "Elegant script neon featuring the couple's names — a statement backdrop for weddings and engagement events.",
    tags: ["neon", "wedding", "event"],
  },
];

const NEON_CONFIG_OPTIONS = {
  fonts: ["Modern", "Script", "Bold", "Classic", "Gaming", "Minimal"],
  colors: [
    { name: "Warm White", hex: "#FFE9C7" }, { name: "Cool White", hex: "#EAF6FF" },
    { name: "Orange", hex: "#FF9800" }, { name: "Red", hex: "#EA5455" },
    { name: "Pink", hex: "#FF66C4" }, { name: "Purple", hex: "#A855F7" },
    { name: "Blue", hex: "#4285F4" }, { name: "Cyan", hex: "#00E5FF" },
    { name: "Green", hex: "#28C76F" }, { name: "Yellow", hex: "#FFC247" },
  ],
  sizes: ["40 cm", "60 cm", "80 cm", "100 cm", "120 cm", "Custom"],
  mounting: ["Wall Mounted", "Hanging", "Freestanding", "Booth Installation"],
  backboard: ["Clear Acrylic", "Black Acrylic", "Cut-to-Shape", "No Backboard"],
};

function getProductById(id) { return PRODUCTS.find((p) => p.id === id); }
function getRelatedProducts(product, count) {
  return PRODUCTS.filter((p) => p.id !== product.id && p.type === product.type).slice(0, count || 4);
}

function starsHtml(rating) {
  const full = Math.round(rating || 0);
  return "★".repeat(full) + "☆".repeat(5 - full);
}

function priceLabel(product) {
  if (product.purchaseType === "quote" || product.price == null) return "Request Quote";
  return formatKWD(product.price);
}

/** Builds the reusable product card used on the homepage, listing pages and gallery. */
function productCardEl(product) {
  const theme = product.type === "neon" ? "neon" : "orange";
  const img1 = product.images[0];
  const img2 = product.images[1] || product.images[0];
  const isFav = isFavorite(product.id);

  const card = el("article", { class: "product-card", "data-product-id": product.id }, [
    el("div", { class: "product-media" }, [
      el("a", { href: `product.html?id=${product.id}` }, [
        el("img", { class: "img-primary", src: img1, alt: product.name, loading: "lazy", "data-fallback-label": product.name, "data-fallback-theme": theme }),
        el("img", { class: "img-hover", src: img2, alt: "", "aria-hidden": "true", loading: "lazy", "data-fallback-label": product.name, "data-fallback-theme": theme }),
      ]),
      el("div", { class: "product-badges" }, [
        product.customizable ? el("span", { class: "badge badge-custom" }, ["Customizable"]) : null,
        product.purchaseType === "quote" ? el("span", { class: "badge badge-quote" }, ["Quote"]) : null,
      ]),
      el("button", { class: `fav-btn${isFav ? " active" : ""}`, "data-fav-id": product.id, "aria-label": "Save to favorites", html: ICONS.heart, onclick: (e) => { e.preventDefault(); toggleFavorite(product.id); } }, []),
      el("div", { class: "product-quick-actions" }, [
        el("a", { href: `product.html?id=${product.id}`, class: "btn btn-ghost btn-sm", style: "flex:1" }, [t("view_product")]),
        product.purchaseType === "direct"
          ? el("button", { class: "btn btn-primary btn-sm", style: "flex:1", onclick: (e) => { e.preventDefault(); addToCart(product, {}, 1); } }, [t("add_to_cart")])
          : el("a", { href: `product.html?id=${product.id}`, class: "btn btn-primary btn-sm", style: "flex:1" }, [t("request_quote")]),
      ]),
    ]),
    el("div", { class: "product-body" }, [
      el("span", { class: "product-cat" }, [product.category.replace(/-/g, " ")]),
      el("h3", { class: "product-title" }, [el("a", { href: `product.html?id=${product.id}` }, [product.name])]),
      el("div", { class: "product-rating" }, [starsHtml(product.rating), el("span", { class: "count" }, [` (${product.reviews || 0})`])]),
      el("div", { class: "product-price-row" }, [
        el("span", { class: "product-price" }, [
          product.purchaseType === "direct" ? el("span", { class: "from" }, ["Starting from"]) : null,
          priceLabel(product),
        ]),
      ]),
    ]),
  ]);
  wireImageFallbacks(card);
  return card;
}

function renderProductGrid(container, products) {
  if (!container) return;
  container.innerHTML = "";
  if (!products.length) {
    container.parentElement.querySelector(".empty-state")?.remove();
    container.insertAdjacentHTML("afterend", `<div class="empty-state"><p class="empty-title">No results found</p><p class="empty-sub">Try a different category or search term.</p></div>`);
    return;
  }
  products.forEach((p) => container.appendChild(productCardEl(p)));
}
