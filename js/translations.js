/**
 * Central EN / AR dictionary + language switching.
 * Any element with data-i18n="key" gets its text replaced.
 * Any element with data-i18n-ph="key" gets its placeholder replaced.
 * Add new keys here rather than hard-coding strings in individual pages.
 */
const TRANSLATIONS = {
  en: {
    nav_home: "Home", nav_3d: "3D Prints", nav_neon: "Neon Lights", nav_customize: "Customize",
    nav_gallery: "Gallery", nav_how: "How It Works", nav_orders: "My Orders", nav_about: "About", nav_contact: "Contact",
    search_placeholder: "Search products, categories, tags...",
    cart_title: "Your Cart", cart_empty: "Your cart is empty", cart_empty_sub: "Looks like you haven't added anything yet.",
    cart_continue: "Continue Shopping", cart_view: "View Cart", cart_checkout: "Checkout",
    cart_subtotal: "Subtotal", cart_delivery: "Delivery", cart_total: "Total",
    hero_kicker: "3D PRINTING • CUSTOM NEON",
    hero_title_1: "DESIGN IT.", hero_title_2: "WE MAKE IT.",
    hero_sub: "Custom 3D prints and neon creations built around your ideas. From gaming setups and car accessories to business logos, cafés, offices and one-of-a-kind designs.",
    hero_cta_3d: "SHOP 3D PRINTS", hero_cta_neon: "SHOP NEON LIGHTS", hero_cta_custom: "CREATE YOUR OWN →",
    add_to_cart: "Add to Cart", added: "Added", view_product: "View", request_quote: "Request Quote", buy_now: "Buy Now",
    footer_rights: "All rights reserved.",
    whatsapp_tooltip: "Need help? Chat with us.",
  },
  ar: {
    nav_home: "الرئيسية", nav_3d: "طباعة 3D", nav_neon: "إضاءة نيون", nav_customize: "صمم طلبك",
    nav_gallery: "معرض الأعمال", nav_how: "كيف نعمل", nav_orders: "طلباتي", nav_about: "من نحن", nav_contact: "تواصل معنا",
    search_placeholder: "ابحث عن المنتجات والفئات...",
    cart_title: "سلة التسوق", cart_empty: "سلتك فارغة", cart_empty_sub: "لم تقم بإضافة أي منتج بعد.",
    cart_continue: "متابعة التسوق", cart_view: "عرض السلة", cart_checkout: "إتمام الطلب",
    cart_subtotal: "المجموع الفرعي", cart_delivery: "التوصيل", cart_total: "الإجمالي",
    hero_kicker: "طباعة 3D • نيون مخصص",
    hero_title_1: "صمّمها.", hero_title_2: "نحن ننفذها.",
    hero_sub: "منتجات مطبوعة ثلاثية الأبعاد وإبداعات نيون مصممة حسب فكرتك. من إعدادات الألعاب وإكسسوارات السيارات إلى شعارات الأعمال والمقاهي والمكاتب والتصاميم الفريدة.",
    hero_cta_3d: "تسوق منتجات 3D", hero_cta_neon: "تسوق إضاءة النيون", hero_cta_custom: "أنشئ تصميمك الخاص ←",
    add_to_cart: "أضف إلى السلة", added: "تمت الإضافة", view_product: "عرض", request_quote: "اطلب عرض سعر", buy_now: "اشترِ الآن",
    footer_rights: "جميع الحقوق محفوظة.",
    whatsapp_tooltip: "تحتاج مساعدة؟ راسلنا.",
  },
};

function getLang() {
  return localStorage.getItem("lang") || CONFIG.defaultLanguage || "en";
}

function t(key) {
  const lang = getLang();
  return (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) || TRANSLATIONS.en[key] || key;
}

function applyLanguage(lang) {
  lang = lang || getLang();
  localStorage.setItem("lang", lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.body.classList.toggle("lang-ar", lang === "ar");

  qsa("[data-i18n]").forEach((n) => { n.textContent = t(n.dataset.i18n); });
  qsa("[data-i18n-ph]").forEach((n) => { n.setAttribute("placeholder", t(n.dataset.i18nPh)); });
  qsa("[data-lang-toggle]").forEach((n) => n.classList.toggle("active", n.dataset.langToggle === lang));
}
