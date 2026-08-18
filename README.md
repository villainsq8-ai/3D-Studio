# 3 Studio — 3D Printing & Custom Neon (Kuwait)

A complete, clickable e-commerce **frontend prototype** for a Kuwait-based 3D printing
and custom neon studio. Built with plain **HTML5, CSS3 and vanilla JavaScript** —
no build step, no framework, no backend required to run it.

It covers browsing and buying ready-made 3D print / neon products, a fully custom
"send us your idea" order flow with file upload, a cart + checkout, order tracking,
WhatsApp integration, and a prototype admin dashboard — in English and Arabic (RTL),
with KWD pricing throughout.

---

## 1. How to run it

No build tools, no `npm install`. Either:

- **Open directly**: double-click `index.html` (works fully; images use a graceful
  placeholder system so nothing is ever a broken-image icon).
- **Or run a tiny local server** (recommended, avoids any browser file:// quirks):

  ```bash
  # from the project root
  python3 -m http.server 8080
  # then open http://localhost:8080
  ```

  Any static server works (`npx serve`, VS Code "Live Server", etc.).

There is nothing to install and nothing to configure to see the whole site working.

---

## 2. Project structure

```
/
├── index.html            Homepage
├── 3d-prints.html        3D print catalog (filterable)
├── neon.html              Neon catalog (filterable)
├── product.html            Product detail (3D options / neon live configurator)
├── customize.html          "Customize Your Own" custom order flow
├── cart.html                Full cart page
├── checkout.html            Contact / delivery / payment / place order
├── order-success.html       Order confirmation
├── orders.html               "My Orders" list
├── order.html                 Single order detail + timeline + quotation
├── admin.html                  Prototype admin / order dashboard
├── gallery.html                 Filterable portfolio + lightbox
├── favorites.html                Saved products
├── about.html                     About page
├── contact.html                    Contact page + form
│
├── css/
│   ├── variables.css      Design tokens (colors, spacing, radius, motion)
│   ├── reset.css           Minimal modern reset
│   ├── global.css           Header, footer, hero, buttons, layout
│   ├── components.css        Cards, modals, drawer, toasts, forms, tabs, timeline...
│   ├── shop.css                Listing/detail/gallery/neon-configurator layouts
│   ├── admin.css                 Admin dashboard styles
│   └── responsive.css              Mobile-first breakpoints
│
├── js/
│   ├── config.js            Business info, WhatsApp number, delivery price...
│   ├── utils.js               formatKWD, DOM helpers, image-fallback system
│   ├── translations.js          EN/AR dictionary + language switching
│   ├── products.js                Product catalog + shared product-card renderer
│   ├── favorites.js                 Favorites (localStorage)
│   ├── cart.js                       Cart store + cart drawer
│   ├── orders.js                       Unified order store (product + custom orders)
│   ├── whatsapp.js                       wa.me link builders
│   ├── app.js                              Header/footer/menu/search/toasts/modals
│   ├── home.js, shop-listing.js,             Page-specific rendering — one file per
│   │   product-page.js, cart-page.js,          page, so nothing is a giant monolith
│   │   checkout.js, custom-orders.js,
│   │   orders-page.js, order-detail.js,
│   │   admin.js, gallery.js,
│   │   favorites-page.js, contact.js
│
└── assets/                 Images, organized by section (see below)
```

Every page shares the same header/footer/cart-drawer/search-overlay/toast system —
they're injected once by `app.js`, so there is a single place to change navigation,
not fifteen copies of the same markup.

---

## 3. Replacing your logo and photos

- **Logo**: replace `assets/logo/logo.svg` with your own file (keep the filename,
  or update `CONFIG.logo` in `js/config.js`). It's used in the header, footer,
  mobile menu and the intro loader automatically.
- **Product photos**: drop real photos into the matching `assets/3d/...` or
  `assets/neon/...` subfolder using the filenames already referenced in
  `js/products.js` (e.g. `assets/3d/deck-boxes/deck-box-01.jpg`). As soon as a
  file with that exact path exists, it replaces the placeholder automatically —
  no code changes needed.
- **No broken images, ever**: if a photo is missing, a branded gradient
  placeholder card ("PRODUCT NAME — IMAGE COMING SOON") is shown instead, via a
  global image-error handler in `js/utils.js`. This is intentional and can stay
  in place permanently as a safety net even after you add real photos.

Asset folders:
```
assets/logo/        assets/3d/deck-boxes/   assets/neon/gaming/
assets/hero/         assets/3d/car/          assets/neon/business/
assets/gallery/       assets/3d/gaming/       assets/neon/cafe/
assets/icons/          assets/3d/office/       assets/neon/office/
                        assets/3d/organizers/   assets/neon/events/
                                                  assets/neon/wedding/
```

---

## 4. Adding / editing products

All products live in **one file**: `js/products.js`. Each product is a plain object:

```js
{
  id: "deck-box-01",              // unique, used in product.html?id=...
  type: "3d",                     // "3d" or "neon"
  category: "deck-boxes",         // must match a tab slug in 3d-prints.html / neon.html
  name: "Custom Trading Card Deck Box",
  price: 12.000,                  // KD, or null for quote-only products
  purchaseType: "direct",         // "direct" (Add to Cart) or "quote" (Request Quote)
  customizable: true,
  rating: 4.9, reviews: 38,
  images: ["assets/3d/deck-boxes/deck-box-01.jpg", ...],
  colors: ["Black", "White", "Orange", "Grey", "Custom"],
  materials: ["PLA", "PETG"],
  description: "...",
  tags: ["deck box", "cards", "gaming"],
}
```

Add a new object to the `PRODUCTS` array and it automatically appears in the
homepage featured grids (if `featured: true`), the relevant catalog page, search,
and gets a working product page at `product.html?id=your-id` — nothing else to wire up.

**To change a price**, edit the `price` field. **To change delivery cost or the
free-delivery threshold**, edit `deliveryPrice` / `freeDeliveryThreshold` in
`js/config.js` (see below).

---

## 5. Configuration (`js/config.js`)

```js
const CONFIG = {
  businessName: "3",
  businessFullName: "3 Studio",
  whatsapp: "96512345678",   // digits only, country code first, no + and no spaces
  email: "hello@3neon.com",
  instagram: "@3.studio.kw",
  tiktok: "@3.studio.kw",
  currency: "KD",
  deliveryPrice: 2.000,
  freeDeliveryThreshold: 30.000,
  defaultLanguage: "en",
  logo: "assets/logo/logo.svg",
};
```

Change the **WhatsApp number** here and every WhatsApp button/link across the whole
site (floating button, product pages, cart, checkout success, order tracking,
custom order confirmation, admin) updates automatically — there is only one
source of truth (`js/whatsapp.js` builds every `wa.me` link from this value).

Change **Instagram / TikTok / email** the same way — they feed the footer and
contact page automatically.

---

## 6. How orders currently work (important)

This is a **frontend-only prototype**. Orders, custom requests, favorites and cart
contents are stored in the browser's `localStorage` — there is no server and no
database. That means:

- Orders are only visible on the same browser/device that created them.
- Clearing browser data clears all orders.
- The "Admin Dashboard" (`admin.html`) reads the **same localStorage**, so on one
  browser you actually can walk through the full loop: place an order → open
  `admin.html` → change its status or send a quotation → the customer's
  `orders.html` / `order.html` reflects it immediately. That's genuinely working,
  it's just scoped to one browser rather than shared across devices.
- **`admin.html` has no authentication.** It's a UI/UX prototype only — anyone
  with the URL can open it. Do not deploy it publicly as-is. See §8.

All order/cart/favorites persistence goes through a small set of functions
(`getOrders`, `saveOrder`, `updateOrderStatus`, `saveQuotation`, `getCart`,
`addToCart`, etc. in `js/orders.js` and `js/cart.js`) — deliberately written so the
`localStorage` calls inside them are the *only* thing that needs to change to
swap in a real backend (see §8). No page markup or UI logic depends on
`localStorage` directly.

---

## 7. Deployment

Since this is fully static, it deploys anywhere that serves static files:
Netlify, Vercel, GitHub Pages, Cloudflare Pages, S3 + CloudFront, or a plain
Nginx/Apache server. There is no server-side build step — just upload the folder.

---

## 8. Recommended production architecture (next steps)

To turn this prototype into a live store, the frontend stays essentially as-is;
you're mainly replacing the `localStorage` calls with real API calls and adding
three things this prototype intentionally does not include:

```
Frontend (this project)
        │
        ├── Supabase / Firebase   → products, orders, custom requests, quotations
        │                            (replaces localStorage read/write in
        │                             orders.js, cart.js, custom-orders.js)
        │
        ├── Authentication         → customer accounts ("My Orders" tied to a
        │   (Supabase/Firebase Auth)  real user, not just a browser) AND a
        │                             protected login for admin.html
        │
        ├── Cloud Storage           → uploaded reference files/images from the
        │   (Supabase Storage / S3)    custom order form, instead of storing
        │                              base64 data URLs in localStorage
        │
        ├── Payment Gateway         → KNET / card / Apple Pay processing.
        │   (MyFatoorah, Tap, etc.)    checkout.html already has the payment
        │                              method UI and explicitly does NOT fake
        │                              card processing — it's structured so a
        │                              real gateway's redirect/webhook flow
        │                              slots in where "Place Order" currently
        │                              writes straight to localStorage.
        │
        └── WhatsApp Business API   → optional upgrade from wa.me deep links to
                                        automated order notifications.
```

Suggested order of work: swap `orders.js`/`cart.js` storage functions for API
calls → add auth → protect `/admin.html` behind it → move file uploads to cloud
storage → connect a real payment gateway.

---

## 9. Notable prototype behaviors (by design, not bugs)

- **Google Fonts load non-blocking**: if Space Grotesk / Inter / IBM Plex Sans
  Arabic can't be reached (offline, restricted network), the site falls back to
  system fonts immediately rather than hanging — see the `media="print"` swap
  trick in every page's `<head>`.
- **Quote-only products** (`purchaseType: "quote"`, e.g. large business/restaurant
  neon signs) show "Request Quote" instead of "Add to Cart" and open a
  pre-filled WhatsApp message instead of going through checkout — matches how
  those items are actually priced in real life.
- **Contact form** has no email backend, so submitting it opens a pre-filled
  WhatsApp chat instead of a fake "message sent" confirmation.
- **Demo reviews** on the homepage are explicitly labeled "Demo review" and
  should be replaced with real customer feedback before launch.

---

## 10. Credits / stack

Vanilla HTML5, CSS3 (custom properties, Grid/Flexbox, no preprocessor) and
vanilla JavaScript (ES2017+, no framework, no bundler). Fonts: Space Grotesk +
Inter (Google Fonts) for Latin text, IBM Plex Sans Arabic for Arabic/RTL.
