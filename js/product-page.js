/**
 * Drives product.html — works for both "3d" (color/material swatches +
 * optional personalization) and "neon" (full live-preview configurator)
 * products, sharing the same image gallery / lightbox / tabs / related grid.
 */
(function () {
  let product = null;
  let currentImage = 0;
  let selected = {}; // chosen options, built up as the customer picks
  let qty = 1;

  function priceForSelection() {
    if (!product) return 0;
    if (product.type !== "neon") return product.price || 0;
    const base = product.price || 20;
    const sizeMultiplier = { "40 cm": 0.7, "60 cm": 0.85, "80 cm": 1, "100 cm": 1.25, "120 cm": 1.6, "Custom": 1.8 };
    const size = selected.size || "80 cm";
    return Math.round(base * (sizeMultiplier[size] || 1) * 1000) / 1000;
  }

  /* --------------------------------------------------------------- Gallery */
  function renderGallery() {
    const mainImg = qs("#gallery-main-img");
    mainImg.src = product.images[currentImage];
    mainImg.alt = product.name;
    mainImg.dataset.fallbackLabel = product.name;
    mainImg.dataset.fallbackTheme = product.type === "neon" ? "neon" : "orange";

    const thumbs = qs("#gallery-thumbs");
    thumbs.innerHTML = "";
    product.images.forEach((src, i) => {
      const thumb = el("button", { class: `gallery-thumb${i === currentImage ? " active" : ""}`, "aria-label": `Photo ${i + 1}`, onclick: () => { currentImage = i; renderGallery(); } }, [
        el("img", { src, alt: "", loading: "lazy", "data-fallback-label": product.name, "data-fallback-theme": product.type === "neon" ? "neon" : "orange" }),
      ]);
      thumbs.appendChild(thumb);
    });
  }

  function nextImage(dir) {
    currentImage = (currentImage + dir + product.images.length) % product.images.length;
    renderGallery();
    if (qs("#lightbox").classList.contains("open")) renderLightbox();
  }

  function renderLightbox() {
    qs("#lightbox-img").src = product.images[currentImage];
    qs("#lightbox-caption").textContent = `${product.name} — ${currentImage + 1} / ${product.images.length}`;
  }
  function openLightbox() {
    renderLightbox();
    qs("#lightbox").classList.add("open");
    document.body.classList.add("no-scroll");
  }
  function closeLightbox() {
    qs("#lightbox").classList.remove("open");
    document.body.classList.remove("no-scroll");
  }

  function initGalleryEvents() {
    qs("#gallery-prev").addEventListener("click", (e) => { e.stopPropagation(); nextImage(-1); });
    qs("#gallery-next").addEventListener("click", (e) => { e.stopPropagation(); nextImage(1); });
    qs("#gallery-main").addEventListener("click", openLightbox);
    qs("#gallery-main").addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLightbox(); } });
    qs("#lightbox-close").addEventListener("click", closeLightbox);
    qs("#lightbox-prev").addEventListener("click", () => nextImage(-1));
    qs("#lightbox-next").addEventListener("click", () => nextImage(1));
    qs("#lightbox").addEventListener("click", (e) => { if (e.target.id === "lightbox") closeLightbox(); });
    document.addEventListener("keydown", (e) => {
      if (!qs("#lightbox").classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") nextImage(-1);
      if (e.key === "ArrowRight") nextImage(1);
    });
    let touchStartX = null;
    const stage = qs("#lightbox-img");
    stage.addEventListener("touchstart", (e) => { touchStartX = e.touches[0].clientX; });
    stage.addEventListener("touchend", (e) => {
      if (touchStartX === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) nextImage(dx > 0 ? -1 : 1);
      touchStartX = null;
    });
  }

  /* ----------------------------------------------------------------- Info */
  function swatchRow(name, options, groupKey, isColor) {
    const wrap = el("div", { class: "swatch-row" });
    options.forEach((opt) => {
      const label = typeof opt === "string" ? opt : opt.name;
      const btn = el("button", { type: "button", class: "swatch", "data-value": label }, [
        isColor ? el("span", { class: "swatch-dot", style: `background:${colorHex(label)}` }) : null,
        label,
      ]);
      btn.addEventListener("click", () => {
        selected[groupKey] = label;
        qsa(".swatch", wrap).forEach((s) => s.classList.toggle("selected", s.dataset.value === label));
        onSelectionChange();
      });
      wrap.appendChild(btn);
    });
    return wrap;
  }

  function colorHex(name) {
    const found = NEON_CONFIG_OPTIONS.colors.find((c) => c.name === name);
    if (found) return found.hex;
    const basic = { Black: "#111", White: "#eee", Orange: "#FF9800", Grey: "#888", Custom: "#666" };
    return basic[name] || "#666";
  }

  function renderInfo3D() {
    const info = qs("#product-info");
    info.innerHTML = "";
    info.appendChild(el("h1", {}, [product.name]));
    info.appendChild(el("div", { class: "product-info-rating" }, [starsHtml(product.rating), el("span", {}, [` ${product.rating} (${product.reviews} reviews)`])]));
    info.appendChild(el("p", { class: "product-info-price", id: "info-price" }, [priceLabel(product)]));
    info.appendChild(el("p", { class: "product-info-desc" }, [product.description]));

    if (product.colors && product.colors.length) {
      const g = el("div", { class: "option-group" }, [el("label", {}, ["Color"])]);
      selected.color = product.colors[0];
      g.appendChild(swatchRow("Color", product.colors, "color", true));
      info.appendChild(g);
    }
    if (product.materials && product.materials.length) {
      const g = el("div", { class: "option-group" }, [el("label", {}, ["Material"])]);
      selected.material = product.materials[0];
      g.appendChild(swatchRow("Material", product.materials, "material", false));
      info.appendChild(g);
    }

    const qtyGroup = el("div", { class: "option-group" }, [el("label", {}, ["Quantity"])]);
    qtyGroup.appendChild(buildQtyStepper());
    info.appendChild(qtyGroup);

    if (product.customizable) {
      const box = el("div", { class: "personalize-box" }, [
        el("div", { class: "field" }, [
          el("label", {}, ["Add Name / Text (optional)"]),
          el("input", { type: "text", id: "personalize-text", placeholder: "e.g. Mohammad" }),
        ]),
        el("div", { class: "field", style: "margin-bottom:0;" }, [
          el("label", {}, ["Upload Logo / Reference Image (optional)"]),
          el("input", { type: "file", id: "personalize-file", accept: "image/*" }),
        ]),
      ]);
      info.appendChild(box);
    }

    info.appendChild(buildActionRow());
    info.appendChild(el("div", { class: "product-meta-row" }, [
      el("span", {}, [`Category: ${product.category.replace(/-/g, " ")}`]),
      el("span", {}, ["Made to order"]),
      el("span", {}, ["Kuwait delivery available"]),
    ]));
    selectFirstSwatches();
  }

  function selectFirstSwatches() {
    qsa(".swatch-row").forEach((row) => { row.firstElementChild?.classList.add("selected"); });
  }

  function buildQtyStepper() {
    const stepper = el("div", { class: "qty-stepper" }, [
      el("button", { type: "button", "aria-label": "Decrease quantity", onclick: () => { qty = Math.max(1, qty - 1); qs("#qty-display").textContent = qty; } }, ["−"]),
      el("span", { id: "qty-display" }, [String(qty)]),
      el("button", { type: "button", "aria-label": "Increase quantity", onclick: () => { qty += 1; qs("#qty-display").textContent = qty; } }, ["+"]),
    ]);
    return stepper;
  }

  function buildActionRow() {
    const row = el("div", { class: "product-actions-row" });
    if (product.purchaseType === "direct") {
      row.appendChild(el("button", { class: "btn btn-primary btn-lg", id: "add-cart-btn" }, [t("add_to_cart")]));
      row.appendChild(el("button", { class: "btn btn-outline btn-lg", id: "buy-now-btn" }, [t("buy_now")]));
    } else {
      row.appendChild(el("button", { class: "btn btn-primary btn-lg", id: "request-quote-btn" }, [t("request_quote")]));
    }
    row.appendChild(el("button", { class: "btn btn-ghost btn-lg", id: "ask-whatsapp-btn" }, ["ASK ON WHATSAPP"]));
    return row;
  }

  /* ----------------------------------------------------------- Neon panel */
  function renderInfoNeon() {
    selected = { text: product.name.toUpperCase(), font: "Modern", color: "Cyan", size: "80 cm", mounting: "Wall Mounted", backboard: "Clear Acrylic" };
    const info = qs("#product-info");
    info.innerHTML = "";
    info.appendChild(el("h1", {}, [product.name]));
    info.appendChild(el("div", { class: "product-info-rating" }, [starsHtml(product.rating), el("span", {}, [` ${product.rating} (${product.reviews} reviews)`])]));
    info.appendChild(el("p", { class: "product-info-desc" }, [product.description]));

    const preview = el("div", { class: "neon-preview-stage" }, [
      el("div", {}, [
        el("p", { class: "neon-preview-text", id: "neon-preview-text" }, [selected.text]),
        el("p", { class: "neon-preview-note" }, ["Live preview — actual glow intensity varies by room lighting"]),
      ]),
    ]);
    info.appendChild(preview);

    const estimate = el("div", { class: "neon-price-estimate" }, [
      el("span", {}, ["Estimated Price"]),
      el("span", { class: "amount", id: "neon-price" }, [product.price ? formatKWD(priceForSelection()) : "Quote on request"]),
    ]);
    info.appendChild(estimate);

    const textField = el("div", { class: "field" }, [
      el("label", {}, ["Text"]),
      el("input", { type: "text", id: "neon-text-input", value: selected.text, maxlength: "24" }),
    ]);
    info.appendChild(textField);

    const fontGroup = el("div", { class: "option-group" }, [el("label", {}, ["Font Style"])]);
    const fontRow = el("div", { class: "chip-row" });
    NEON_CONFIG_OPTIONS.fonts.forEach((f) => {
      const chip = el("button", { type: "button", class: `chip${f === selected.font ? " active" : ""}`, "data-value": f }, [f]);
      chip.addEventListener("click", () => {
        selected.font = f;
        qsa(".chip", fontRow).forEach((c) => c.classList.toggle("active", c.dataset.value === f));
        updateNeonPreview();
      });
      fontRow.appendChild(chip);
    });
    fontGroup.appendChild(fontRow);
    info.appendChild(fontGroup);

    const colorGroup = el("div", { class: "option-group" }, [el("label", {}, ["Neon Color"])]);
    const colorRow = el("div", { class: "neon-color-row" });
    NEON_CONFIG_OPTIONS.colors.forEach((c) => {
      const dot = el("button", { type: "button", class: `neon-color-dot${c.name === selected.color ? " selected" : ""}`, style: `background:${c.hex}`, "aria-label": c.name, "data-value": c.name });
      dot.addEventListener("click", () => {
        selected.color = c.name;
        qsa(".neon-color-dot", colorRow).forEach((d) => d.classList.toggle("selected", d.dataset.value === c.name));
        updateNeonPreview();
      });
      colorRow.appendChild(dot);
    });
    colorGroup.appendChild(colorRow);
    info.appendChild(colorGroup);

    info.appendChild(selectGroup("Size", NEON_CONFIG_OPTIONS.sizes, "size", selected.size, () => { updatePriceEstimate(); }));
    info.appendChild(selectGroup("Mounting", NEON_CONFIG_OPTIONS.mounting, "mounting", selected.mounting));
    info.appendChild(selectGroup("Backboard", NEON_CONFIG_OPTIONS.backboard, "backboard", selected.backboard));

    const qtyGroup = el("div", { class: "option-group" }, [el("label", {}, ["Quantity"])]);
    qtyGroup.appendChild(buildQtyStepper());
    info.appendChild(qtyGroup);

    info.appendChild(buildActionRow());

    qs("#neon-text-input").addEventListener("input", (e) => { selected.text = e.target.value || product.name.toUpperCase(); updateNeonPreview(); });
    updateNeonPreview();
  }

  function selectGroup(label, options, key, defaultVal, onChange) {
    const group = el("div", { class: "option-group" }, [el("label", {}, [label])]);
    const select = el("select", { "aria-label": label });
    options.forEach((opt) => select.appendChild(el("option", { value: opt, selected: opt === defaultVal ? "selected" : null }, [opt])));
    select.addEventListener("change", (e) => { selected[key] = e.target.value; onChange && onChange(); });
    group.appendChild(select);
    return group;
  }

  function updateNeonPreview() {
    const textEl = qs("#neon-preview-text");
    if (!textEl) return;
    textEl.textContent = selected.text;
    textEl.className = `neon-preview-text font-${(selected.font || "modern").toLowerCase()}`;
    const hex = colorHex(selected.color);
    textEl.style.color = hex;
    textEl.style.textShadow = `0 0 10px ${hex}, 0 0 24px ${hex}, 0 0 46px ${hex}88`;
    updatePriceEstimate();
  }
  function updatePriceEstimate() {
    const priceEl = qs("#neon-price");
    if (priceEl) priceEl.textContent = product.price ? formatKWD(priceForSelection()) : "Quote on request";
  }

  function onSelectionChange() { /* reserved for future price-by-option logic on 3D products */ }

  /* ---------------------------------------------------------------- Tabs */
  function renderTabs() {
    const tabDefs = [
      { key: "description", label: "DESCRIPTION", body: `<p>${escapeHtml(product.description)}</p>` },
      { key: "specifications", label: "SPECIFICATIONS", body: specsHtml() },
      { key: "customization", label: "CUSTOMIZATION", body: `<p>${product.customizable ? "This product supports custom colors, text and logo personalization. Options are available above, or send us a fully custom brief via the Customize page." : "This product ships as shown. For a fully custom version, use the Customize page."}</p>` },
      { key: "delivery", label: "DELIVERY", body: `<p>Delivery is available across Kuwait for ${formatKWD(CONFIG.deliveryPrice)} (free above ${formatKWD(CONFIG.freeDeliveryThreshold)}), or choose pickup at checkout. Production time varies by item and customization.</p>` },
      { key: "faq", label: "FAQ", body: `<p>Questions about this product? Use "Ask on WhatsApp" above and we'll respond directly.</p>` },
    ];
    const tabsWrap = qs("#product-tabs");
    const panelsWrap = qs("#product-tab-panels");
    tabDefs.forEach((tab, i) => {
      tabsWrap.appendChild(el("button", { class: `tab-btn${i === 0 ? " active" : ""}`, "data-tab": tab.key }, [tab.label]));
      panelsWrap.appendChild(el("div", { class: `tab-panel${i === 0 ? " active" : ""}`, "data-tab": tab.key, html: tab.body }));
    });
  }
  function specsHtml() {
    const rows = [
      ["Technology", product.type === "neon" ? "Custom Neon (LED)" : "FDM 3D Printing"],
      ["Materials", product.type === "neon" ? "Flex LED neon, acrylic backboard" : (product.materials || []).join(", ")],
      ["Custom Colors", "Available"],
      ["Production", "Made to order"],
    ];
    return `<table class="spec-table">${rows.map(([k, v]) => `<tr><td>${k}</td><td>${escapeHtml(v)}</td></tr>`).join("")}</table>`;
  }

  /* ------------------------------------------------------------- Actions */
  function collectOptions() {
    if (product.type === "neon") {
      return { Text: selected.text, Font: selected.font, Color: selected.color, Size: selected.size, Mounting: selected.mounting, Backboard: selected.backboard };
    }
    const opts = {};
    if (selected.color) opts.Color = selected.color;
    if (selected.material) opts.Material = selected.material;
    const personalizeText = qs("#personalize-text")?.value;
    if (personalizeText) opts.Text = personalizeText;
    const file = qs("#personalize-file")?.files?.[0];
    if (file) opts.Logo = file.name;
    return opts;
  }

  function wireActions() {
    const cartProduct = { ...product, price: priceForSelection() };
    qs("#add-cart-btn")?.addEventListener("click", () => addToCart(cartProduct, collectOptions(), qty));
    qs("#buy-now-btn")?.addEventListener("click", () => { addToCart(cartProduct, collectOptions(), qty); window.location.href = "checkout.html"; });
    qs("#request-quote-btn")?.addEventListener("click", () => {
      const msg = `Hello, I'd like a quote for "${product.name}".\nOptions: ${optionsLabel(collectOptions()) || "Standard"}\nQuantity: ${qty}`;
      openWhatsApp(msg);
    });
    qs("#ask-whatsapp-btn")?.addEventListener("click", () => {
      openWhatsApp(`Hello, I have a question about "${product.name}".`);
    });
  }

  /* --------------------------------------------------------------- Related */
  function renderRelated() {
    renderProductGrid(qs("#related-grid"), getRelatedProducts(product, 4));
  }

  /* ----------------------------------------------------------------- Init */
  function notFound() {
    qs("main").innerHTML = `<div class="container"><div class="empty-state"><p class="empty-title">Product not found</p><p class="empty-sub">This product may have been removed or the link is incorrect.</p><a href="3d-prints.html" class="btn btn-primary">Browse Products</a></div></div>`;
  }

  async function init() {
    if (!qs("#gallery-main-img")) return;
    await window.productsReady;
    const id = getParam("id");
    product = getProductById(id);
    if (!product) { notFound(); return; }

    document.title = `${product.name} | ${CONFIG.businessFullName}`;
    initBreadcrumbs([
      { label: "Home", href: "index.html" },
      { label: product.type === "neon" ? "Neon Lights" : "3D Prints", href: product.type === "neon" ? "neon.html" : "3d-prints.html" },
      { label: product.name, href: `product.html?id=${product.id}` },
    ]);

    renderGallery();
    initGalleryEvents();
    if (product.type === "neon") renderInfoNeon(); else renderInfo3D();
    renderTabs();
    initTabs();
    renderRelated();
    wireActions();

    qs("#mobile-buy-price").textContent = priceLabel(product);
    qs("#mobile-buy-btn").textContent = product.purchaseType === "direct" ? t("add_to_cart") : t("request_quote");
    qs("#mobile-buy-btn").addEventListener("click", () => {
      if (product.purchaseType === "direct") addToCart({ ...product, price: priceForSelection() }, collectOptions(), qty);
      else openWhatsApp(`Hello, I'd like a quote for "${product.name}".`);
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
