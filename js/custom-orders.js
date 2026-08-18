/**
 * Drives customize.html: type selection, drag-and-drop file upload with
 * FileReader previews, dimensions, quantity, budget, deadline, delivery
 * method and final submission into the unified order store.
 */
(function () {
  const ACCEPTED_EXT = ["jpg", "jpeg", "png", "webp", "pdf", "svg", "stl", "obj", "3mf"];
  let uploadedFiles = []; // { id, name, size, type, dataUrl? }
  let selectedType = null;
  let quantity = 1;
  let selectedBudget = null;

  function initTypeCards() {
    const cards = qsa("#custom-type-cards .type-card");
    cards.forEach((card) => {
      card.addEventListener("click", () => {
        cards.forEach((c) => c.classList.remove("selected"));
        card.classList.add("selected");
        selectedType = card.dataset.type;
        const hidden = qs("#custom-type-value");
        if (hidden) hidden.value = selectedType;
        const err = qs("#type-error"); if (err) err.style.display = "none";
      });
    });
  }

  function humanSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function renderFileList() {
    const list = qs("#upload-list");
    if (!list) return;
    list.innerHTML = "";
    uploadedFiles.forEach((f) => {
      const row = el("div", { class: "upload-item" }, [
        f.dataUrl
          ? el("img", { src: f.dataUrl, alt: f.name, class: "upload-thumb" })
          : el("div", { class: "upload-thumb upload-thumb-file" }, [f.name.split(".").pop().toUpperCase()]),
        el("div", { class: "upload-item-info" }, [
          el("p", { class: "upload-item-name" }, [f.name]),
          el("p", { class: "upload-item-size" }, [humanSize(f.size)]),
        ]),
        el("button", { class: "upload-item-remove", type: "button", "aria-label": `Remove ${f.name}`, onclick: () => {
          uploadedFiles = uploadedFiles.filter((x) => x.id !== f.id);
          renderFileList();
        } }, ["✕"]),
      ]);
      list.appendChild(row);
    });
  }

  function handleFiles(fileList) {
    Array.from(fileList).forEach((file) => {
      const ext = file.name.split(".").pop().toLowerCase();
      if (!ACCEPTED_EXT.includes(ext)) {
        toast(`Unsupported file type: ${file.name}`, "error");
        return;
      }
      const record = { id: uid("file"), name: file.name, size: file.size, type: file.type };
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          record.dataUrl = e.target.result;
          uploadedFiles.push(record);
          renderFileList();
        };
        reader.readAsDataURL(file);
      } else {
        uploadedFiles.push(record);
        renderFileList();
      }
    });
    toast("File(s) added");
  }

  function initUpload() {
    const dropzone = qs("#upload-dropzone");
    const input = qs("#upload-input");
    if (!dropzone || !input) return;
    dropzone.addEventListener("click", () => input.click());
    dropzone.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") input.click(); });
    input.addEventListener("change", () => handleFiles(input.files));
    ["dragenter", "dragover"].forEach((ev) => dropzone.addEventListener(ev, (e) => {
      e.preventDefault(); dropzone.classList.add("dragover");
    }));
    ["dragleave", "drop"].forEach((ev) => dropzone.addEventListener(ev, (e) => {
      e.preventDefault(); dropzone.classList.remove("dragover");
    }));
    dropzone.addEventListener("drop", (e) => { if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files); });
  }

  function initQuantity() {
    const valueEl = qs("#custom-qty-value");
    if (!valueEl) return;
    qs("#custom-qty-minus").addEventListener("click", () => {
      quantity = Math.max(1, quantity - 1); valueEl.textContent = quantity;
    });
    qs("#custom-qty-plus").addEventListener("click", () => {
      quantity += 1; valueEl.textContent = quantity;
    });
  }

  function initBudget() {
    const buttons = qsa("#budget-options .chip-option");
    buttons.forEach((btn) => btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedBudget = btn.dataset.value;
    }));
  }

  function initDeadline() {
    const noDeadline = qs("#no-deadline");
    const dateInput = qs("#deadline-date");
    if (!noDeadline || !dateInput) return;
    noDeadline.addEventListener("change", () => {
      dateInput.disabled = noDeadline.checked;
      if (noDeadline.checked) dateInput.value = "";
    });
  }

  function initDimensionsUnknown() {
    const cb = qs("#dims-unknown");
    if (!cb) return;
    const fields = qsa(".dims-field");
    cb.addEventListener("change", () => {
      fields.forEach((f) => { f.disabled = cb.checked; if (cb.checked) f.value = ""; });
    });
  }

  function validate(form) {
    let valid = true;
    if (!selectedType) {
      qs("#type-error").style.display = "block";
      valid = false;
    }
    ["name", "phone", "description"].forEach((name) => {
      const field = form.elements[name];
      const errorEl = qs(`[data-error-for="${name}"]`);
      const isEmpty = !field.value.trim();
      if (errorEl) errorEl.style.display = isEmpty ? "block" : "none";
      field.classList.toggle("input-error", isEmpty);
      if (isEmpty) valid = false;
    });
    return valid;
  }

  function initSubmit() {
    const form = qs("#custom-order-form");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validate(form)) {
        toast("Please complete the required fields", "error");
        return;
      }
      const dimsUnknown = qs("#dims-unknown").checked;
      const deliveryMethod = form.querySelector('input[name="custom-delivery"]:checked');
      const data = {
        type: selectedType,
        name: form.elements.name.value.trim(),
        phone: form.elements.phone.value.trim(),
        email: form.elements.email.value.trim(),
        description: form.elements.description.value.trim(),
        dimensions: {
          width: form.elements.width.value,
          height: form.elements.height.value,
          depth: form.elements.depth.value,
          unit: form.elements.unit.value,
          unknown: dimsUnknown,
        },
        quantity,
        budget: selectedBudget || "Not Sure",
        deadline: qs("#no-deadline").checked ? "No specific deadline" : (qs("#deadline-date").value || "No specific deadline"),
        deliveryMethod: deliveryMethod ? deliveryMethod.value : "Discuss Later",
        files: uploadedFiles,
      };
      const order = buildCustomOrder(data);
      saveOrder(order);
      toast("Custom order submitted");
      openCustomOrderConfirmation(order);
      form.reset();
      uploadedFiles = []; renderFileList();
      qsa("#custom-type-cards .type-card").forEach((c) => c.classList.remove("selected"));
      selectedType = null; quantity = 1; selectedBudget = null;
      qs("#custom-qty-value").textContent = "1";
    });
  }

  function openCustomOrderConfirmation(order) {
    const modal = qs("#custom-confirm-modal");
    if (!modal) return;
    qs("#custom-confirm-id", modal).textContent = order.id;
    modal.classList.add("open");
    qs("#custom-confirm-view", modal).onclick = () => { window.location.href = `order.html?id=${order.id}`; };
    qs("#custom-confirm-whatsapp", modal).onclick = () => openWhatsApp(customOrderWhatsAppMessage(order));
    qs("#custom-confirm-close", modal).onclick = () => modal.classList.remove("open");
  }

  function preselectFromQuery() {
    const type = getParam("type");
    if (!type) return;
    const card = qsa("#custom-type-cards .type-card").find((c) => c.dataset.type === type);
    if (card) card.click();
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (!qs("#custom-order-form")) return;
    initTypeCards(); initUpload(); initQuantity(); initBudget(); initDeadline(); initDimensionsUnknown(); initSubmit();
    preselectFromQuery();
  });
})();
