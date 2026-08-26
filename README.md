# 3 Studio — 3D Printing & Custom Neon (Kuwait)

A complete, clickable e-commerce **frontend prototype** for a Kuwait-based 3D printing
and custom neon studio. Built with plain **HTML5, CSS3 and vanilla JavaScript** —
no build step, no framework, no backend required to run it.

It covers browsing and buying ready-made 3D print / neon products, a fully custom
"send us your idea" order flow with file upload, a cart + checkout, order tracking,
WhatsApp integration, and a prototype admin dashboard — in English and Arabic (RTL),
with KWD pricing throughout.

It's also an installable **PWA (Progressive Web App)** — customers can add it to
their home screen on iOS or Android and it opens full-screen like a native app,
works offline after the first visit, and needs nothing from the App Store or
Play Store. See §1a.

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

## 1a. Install it as an app (iOS / Android)

The site is a PWA — a real browser-installable app, no App Store/Play Store needed.
It must be served over **HTTPS** (or `localhost`) for this to work — `file://` and
plain `http://` won't register the service worker, so use the live GitHub Pages URL
or a local server, not double-clicking the HTML file, for this part.

- **Android (Chrome)**: open the site → tap the **⋮** menu → **"Install app"** (or
  **"Add to Home screen"**). Chrome may also show an automatic install banner.
- **iOS (Safari)**: open the site → tap the **Share** icon → **"Add to Home Screen"**.
  iOS has no automatic install prompt; this manual step is the only way to install
  any web app on iOS, by design.
- **Desktop (Chrome/Edge)**: an install icon appears in the address bar.

Once installed it opens full-screen (no browser chrome/URL bar), uses the app icon
and name defined in `manifest.webmanifest`, and — thanks to `sw.js` — keeps working
if the connection drops after the first visit (product pages, cart, and previously
viewed pages are all available offline; placing a new order still needs a network
connection to reach WhatsApp/the eventual backend).

**Regenerating icons**: `assets/icons/*.png` are rasterized from `assets/logo/logo.svg`.
If you replace the logo, regenerate the PNGs at the same sizes/names (192, 512,
a padded 512 maskable version, and a 180px Apple touch icon) with any SVG-to-PNG
tool, then bump `CACHE_VERSION` in `sw.js` so installed apps pick up the change.

---

## 1b. Set up the admin panel (Supabase)

This is what turns `admin.html` into a **real, password-protected panel** where
you and your partner can add, edit and delete products and prices yourselves —
no code, no developer needed after this one-time setup. It uses
[Supabase](https://supabase.com), a free hosting service for exactly this kind
of small database + login. Free tier is enough for this site's scale — no
credit card required to start.

This is a one-time job for one of you to do. It takes about 10–15 minutes.

1. **Create a Supabase account** at [supabase.com](https://supabase.com) →
   "Start your project" → sign up (GitHub or email both work).
2. **Create a new project**: give it any name (e.g. "3 Studio"), set a database
   password (Supabase generates one for you — click to reveal it and save it
   somewhere safe, like a notes app; you won't need it day-to-day, but keep it
   just in case), and pick the region closest to Kuwait. Click **Create new
   project** and wait a minute or two while it's provisioned.
3. **Create the database + login system in one paste**: in the left sidebar,
   open **SQL Editor** → **New query**. Open the file `supabase/schema.sql`
   from this project (in GitHub: `supabase/schema.sql`), copy its entire
   contents, paste into the query box, and click **Run**. This creates the
   products table, turns on the security rules that let everyone browse the
   shop but only logged-in users make changes, sets up photo storage, and
   loads in the products already on the site today — so nothing changes on
   the live site yet.
4. **Create your two login accounts**: sidebar → **Authentication** → **Users**
   → **Add user** → **Create new user**. The login screen on `admin.html`
   just asks for a **username** (not an email), so when Supabase asks for an
   "Email" here, type your chosen username followed by `@3studio.local` — for
   example, if your username is `ali`, enter `ali@3studio.local`. Pick a
   password, and make sure **"Auto Confirm User"** is switched on (so you can
   log in immediately, without a confirmation email). Repeat for your
   partner (e.g. `sara@3studio.local`). Day-to-day, you'll each just type
   your plain username (`ali`, `sara`, ...) and password on the login screen
   — the `@3studio.local` part is only something you type once, here, while
   creating the account. These are the only two accounts that will ever be
   able to log into `admin.html` — there's no public sign-up anywhere on the
   site.
5. **Copy your project's connection details**: sidebar → **Project Settings**
   (gear icon) → **API**. You'll need the **Project URL** and the
   **`anon` `public`** key (a long string) — both are safe to share, they
   don't grant any access on their own.
6. **Connect the site to it** — either:
   - Send me (in this chat) the Project URL and anon key, and I'll paste them
     into `js/supabase-client.js` and redeploy for you, **or**
   - Open `js/supabase-client.js` in the repo yourself, replace
     `"YOUR_SUPABASE_URL"` and `"YOUR_SUPABASE_ANON_KEY"` with your two values,
     save, commit and push.
7. **Done.** Reload `admin.html` on the live site, log in with the account you
   created in step 4, and open the **Products** tab.

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
├── manifest.webmanifest    PWA manifest (name, icons, standalone display)
├── sw.js                    Service worker (offline caching, installability)
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

**Recommended: use the admin panel — no code, no redeploying.** Once you've done
the one-time Supabase setup in §1b, go to `admin.html`, log in, open the
**Products** tab, and add/edit/delete items and prices directly — changes go
live on the site within seconds for every visitor, on any device.

Until §1b is set up (or if you'd rather edit code directly), products live in
**one file**: `js/products.js`. Each product is a plain object:

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

Add a new object to the `FALLBACK_PRODUCTS` array and it automatically appears in
the homepage featured grids (if `featured: true`), the relevant catalog page,
search, and gets a working product page at `product.html?id=your-id` — nothing
else to wire up.

**Note:** once Supabase is configured (§1b), the live catalog comes from the
Supabase `products` table, not from this file — `FALLBACK_PRODUCTS` only matters
as a safety net if Supabase is ever unreachable. Once you're set up, use the
admin panel (above) instead of editing this file.

**To change delivery cost or the free-delivery threshold**, edit
`deliveryPrice` / `freeDeliveryThreshold` in `js/config.js` (see below).

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
- **Orders/cart/favorites are still localStorage-only** — that part hasn't
  changed. **Products are the exception**: once §1b is set up, the product
  catalog lives in a real shared Supabase database (not localStorage), so
  price/catalog changes made in the admin panel are visible to every visitor
  everywhere, instantly.
- **`admin.html`'s login is real once §1b is set up** — Supabase Auth, only the
  two accounts you create yourself can sign in. Until §1b is done, it falls
  back to its original no-login prototype behavior (Orders tab only) — don't
  rely on that state for a public launch. See §8 for what's still prototype
  (orders/cart/checkout).

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

Products and the admin login (§1b) are now backed by a real database —
that part is done once you complete the Supabase setup. What's left to turn
the rest of this prototype into a live store:

```
Frontend (this project)
        │
        ├── ✅ Products database    → DONE (§1b) — Supabase table + admin panel
        │      + admin login
        │
        ├── Orders / cart / custom  → still localStorage — replace with the
        │   requests / quotations     same Supabase project (add "orders" and
        │                             "custom_orders" tables, replace the
        │                             localStorage read/write in orders.js,
        │                             cart.js, custom-orders.js with Supabase
        │                             calls, same pattern as products.js)
        │
        ├── Customer accounts        → optional — ties "My Orders" to a real
        │   (Supabase Auth)            login instead of just a browser
        │
        ├── Cloud Storage            → uploaded reference files/images from the
        │   (Supabase Storage)         custom order form, instead of storing
        │                              base64 data URLs in localStorage — the
        │                              product-images bucket from §1b can be
        │                              reused, or add a second bucket
        │
        ├── Payment Gateway          → KNET / card / Apple Pay processing.
        │   (MyFatoorah, Tap, etc.)     checkout.html already has the payment
        │                               method UI and explicitly does NOT fake
        │                               card processing — it's structured so a
        │                               real gateway's redirect/webhook flow
        │                               slots in where "Place Order" currently
        │                               writes straight to localStorage.
        │
        └── WhatsApp Business API    → optional upgrade from wa.me deep links to
                                         automated order notifications.
```

Suggested order of work: move orders/cart/custom-order storage into the same
Supabase project (mirroring how products.js now works) → move file uploads to
Supabase Storage → connect a real payment gateway → optionally add customer
accounts.

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
