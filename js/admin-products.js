/**
 * Drives the "Products" tab on admin.html — full CRUD against the Supabase
 * `products` table (see supabase/schema.sql), with photo uploads going to
 * the `product-images` storage bucket. Only runs once Supabase is
 * configured and the owner is logged in (see js/admin-auth.js).
 */
(function () {
  let currentImages = [];
  let pendingDeleteId = null;
  let initialized = false;

  function slugify(value) {
    return String(value || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }
  function splitList(value) {
    return String(value || "").split(",").map((s) => s.trim()).filter(Boolean);
  }

  async function fetchProducts() {
    const { data, error } = await window.supabaseClient.from("products").select("*").order("created_at", { ascending: true });
    if (error) { toast("Couldn't load products: " + error.message, "error"); return []; }
    return data || [];
  }

  function renderTable(rows) {
    const tbody = qs("#admin-products-table-body");
    tbody.innerHTML = "";
    if (!rows.length) {
      tbody.appendChild(el("tr", { class: "admin-empty-row" }, [el("td", { colspan: "7" }, ["No products yet — click “+ ADD PRODUCT” to create your first one."])]));
      return;
    }
    rows.forEach((p) => {
      tbody.appendChild(el("tr", {}, [
        el("td", {}, [
          p.images && p.images[0]
            ? el("img", { src: p.images[0], alt: p.name, class: "upload-thumb" })
            : el("div", { class: "upload-thumb upload-thumb-file" }, ["—"]),
        ]),
        el("td", {}, [p.name]),
        el("td", {}, [p.type === "neon" ? "Neon" : "3D Print"]),
        el("td", {}, [p.category || "—"]),
        el("td", {}, [p.price == null ? "Quote" : formatKWD(p.price)]),
        el("td", {}, [p.featured ? "Yes" : "—"]),
        el("td", { style: "display:flex;gap:8px;" }, [
          el("button", { type: "button", class: "btn btn-outline btn-sm", onclick: () => openForm(p) }, ["EDIT"]),
          el("button", { type: "button", class: "btn btn-ghost btn-sm", onclick: () => confirmDelete(p) }, ["DELETE"]),
        ]),
      ]));
    });
  }

  async function refresh() {
    renderTable(await fetchProducts());
  }

  /* ------------------------------------------------------------- Form */
  function toggleTypeFields() {
    const isNeon = qs("#pf-type").value === "neon";
    qs("#pf-colors-field").style.display = isNeon ? "none" : "";
    qs("#pf-materials-field").style.display = isNeon ? "none" : "";
    qs("#pf-neon-colors-field").style.display = isNeon ? "" : "none";
  }

  function renderImageList() {
    const wrap = qs("#pf-image-list");
    wrap.innerHTML = "";
    currentImages.forEach((url, i) => {
      const item = el("div", { style: "position:relative;display:inline-block;margin:0 8px 8px 0;" }, [
        el("img", { src: url, alt: "", class: "upload-thumb", style: "width:60px;height:60px;" }),
        el("button", { type: "button", "aria-label": "Remove photo", style: "position:absolute;top:-6px;right:-6px;width:20px;height:20px;border-radius:50%;background:var(--error);color:#fff;border:none;font-size:12px;line-height:1;cursor:pointer;", onclick: () => { currentImages.splice(i, 1); renderImageList(); } }, ["✕"]),
      ]);
      wrap.appendChild(item);
    });
  }

  async function handleImageUpload(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const idHint = qs("#pf-id").value.trim() || `tmp-${Date.now()}`;
    for (const file of files) {
      const path = `${slugify(idHint)}/${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ""))}${(file.name.match(/\.[^.]+$/) || [""])[0]}`;
      const { error } = await window.supabaseClient.storage.from("product-images").upload(path, file);
      if (error) { toast("Upload failed: " + error.message, "error"); continue; }
      const { data } = window.supabaseClient.storage.from("product-images").getPublicUrl(path);
      currentImages.push(data.publicUrl);
    }
    renderImageList();
    e.target.value = "";
  }

  function resetForm() {
    qs("#admin-product-form").reset();
    qs("#pf-original-id").value = "";
    qs("#pf-id").disabled = false;
    currentImages = [];
    renderImageList();
    qs("#pf-error").style.display = "none";
    qs("#pf-rating").value = "5";
    qs("#pf-reviews").value = "0";
    toggleTypeFields();
  }

  function openForm(product) {
    resetForm();
    qs("#admin-product-modal-title").textContent = product ? "EDIT PRODUCT" : "ADD PRODUCT";
    if (product) {
      qs("#pf-original-id").value = product.id;
      qs("#pf-id").value = product.id;
      qs("#pf-id").disabled = true; // primary key — don't let it change under an existing product
      qs("#pf-type").value = product.type;
      qs("#pf-name").value = product.name;
      qs("#pf-category").value = product.category || "";
      qs("#pf-price").value = product.price == null ? "" : product.price;
      qs("#pf-purchase-type").value = product.purchase_type;
      qs("#pf-rating").value = product.rating ?? 5;
      qs("#pf-reviews").value = product.reviews ?? 0;
      qs("#pf-customizable").checked = !!product.customizable;
      qs("#pf-featured").checked = !!product.featured;
      qs("#pf-description").value = product.description || "";
      qs("#pf-colors").value = (product.colors || []).join(", ");
      qs("#pf-materials").value = (product.materials || []).join(", ");
      qs("#pf-neon-colors").value = (product.neon_colors || []).join(", ");
      qs("#pf-tags").value = (product.tags || []).join(", ");
      currentImages = [...(product.images || [])];
      renderImageList();
      toggleTypeFields();
    }
    qs("#admin-product-modal").classList.add("open");
  }

  function closeForm() {
    qs("#admin-product-modal").classList.remove("open");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errEl = qs("#pf-error");
    errEl.style.display = "none";

    const id = slugify(qs("#pf-id").value);
    const name = qs("#pf-name").value.trim();
    if (!id || !name) { errEl.textContent = "Product ID and Name are required."; errEl.style.display = "block"; return; }

    const priceRaw = qs("#pf-price").value;
    const row = {
      id,
      type: qs("#pf-type").value,
      category: qs("#pf-category").value.trim(),
      name,
      price: priceRaw === "" ? null : parseFloat(priceRaw),
      purchase_type: qs("#pf-purchase-type").value,
      customizable: qs("#pf-customizable").checked,
      featured: qs("#pf-featured").checked,
      rating: parseFloat(qs("#pf-rating").value) || 5,
      reviews: parseInt(qs("#pf-reviews").value, 10) || 0,
      images: currentImages,
      colors: splitList(qs("#pf-colors").value),
      materials: splitList(qs("#pf-materials").value),
      neon_colors: splitList(qs("#pf-neon-colors").value),
      description: qs("#pf-description").value.trim(),
      tags: splitList(qs("#pf-tags").value),
    };

    const originalId = qs("#pf-original-id").value;
    const btn = qs("#pf-save-btn");
    btn.disabled = true; btn.textContent = "SAVING...";
    const query = originalId
      ? window.supabaseClient.from("products").update(row).eq("id", originalId)
      : window.supabaseClient.from("products").insert(row);
    const { error } = await query;
    btn.disabled = false; btn.textContent = "SAVE PRODUCT";

    if (error) { errEl.textContent = error.message; errEl.style.display = "block"; return; }
    toast(originalId ? "Product updated" : "Product added");
    closeForm();
    await refresh();
    window.reloadProducts && window.reloadProducts();
  }

  function confirmDelete(product) {
    pendingDeleteId = product.id;
    qs("#admin-delete-product-name").textContent = `Delete "${product.name}"? This will remove it from the live catalog. This can't be undone.`;
    qs("#admin-confirm-delete-modal").classList.add("open");
  }

  async function handleDeleteConfirm() {
    if (!pendingDeleteId) return;
    const { error } = await window.supabaseClient.from("products").delete().eq("id", pendingDeleteId);
    qs("#admin-confirm-delete-modal").classList.remove("open");
    if (error) { toast("Couldn't delete: " + error.message, "error"); return; }
    toast("Product deleted");
    pendingDeleteId = null;
    await refresh();
    window.reloadProducts && window.reloadProducts();
  }

  /** Called by admin-auth.js the first time the Products tab is opened. */
  window.initAdminProducts = function () {
    if (initialized) { refresh(); return; }
    initialized = true;
    qs("#admin-add-product-btn").addEventListener("click", () => openForm(null));
    qs("#pf-cancel-btn").addEventListener("click", closeForm);
    qs("#admin-product-modal").addEventListener("click", (e) => { if (e.target.id === "admin-product-modal") closeForm(); });
    qs("#pf-type").addEventListener("change", toggleTypeFields);
    qs("#pf-image-upload").addEventListener("change", handleImageUpload);
    qs("#admin-product-form").addEventListener("submit", handleSubmit);
    qs("#admin-delete-cancel-btn").addEventListener("click", () => { qs("#admin-confirm-delete-modal").classList.remove("open"); pendingDeleteId = null; });
    qs("#admin-delete-confirm-btn").addEventListener("click", handleDeleteConfirm);
    refresh();
  };
})();
