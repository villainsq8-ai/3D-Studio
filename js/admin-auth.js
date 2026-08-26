/**
 * Drives the login gate + Orders/Products tab switching on admin.html.
 *
 * If Supabase isn't configured yet (see js/supabase-client.js), the admin
 * panel falls back to its original prototype behavior: the Orders tab works
 * straight away against this browser's local storage, no login required,
 * and the Products tab explains that it needs Supabase set up first.
 *
 * Once Supabase IS configured, both tabs sit behind a real login — only
 * accounts you create yourself in the Supabase dashboard (Authentication ->
 * Users) can sign in. There is no public sign-up form anywhere on the site.
 */
(function () {
  function showOnly(viewId) {
    ["admin-login-view", "admin-dashboard"].forEach((id) => {
      qs(`#${id}`).style.display = id === viewId ? "" : "none";
    });
  }

  function initTabs() {
    const tabs = qsa("#admin-main-tabs .chip");
    tabs.forEach((btn) => {
      btn.addEventListener("click", () => {
        tabs.forEach((b) => b.classList.toggle("active", b === btn));
        const tab = btn.dataset.mainTab;
        qs("#admin-orders-panel").style.display = tab === "orders" ? "" : "none";
        qs("#admin-products-panel").style.display = tab === "products" ? "" : "none";
        if (tab === "products") window.initAdminProducts && window.initAdminProducts();
      });
    });
  }

  function showDashboard() {
    showOnly("admin-dashboard");
    window.initAdminOrders && window.initAdminOrders();
  }

  function showLogin(message) {
    showOnly("admin-login-view");
    const err = qs("#admin-login-error");
    if (message) { err.textContent = message; err.style.display = "block"; }
    else { err.style.display = "none"; }
  }

  async function initUnconfigured() {
    // No Supabase project connected yet — keep the dashboard usable exactly
    // like before (orders only, no login), and explain Products needs setup.
    qs("#admin-unconfigured").style.display = "block";
    showOnly("admin-dashboard");
    qs("#admin-products-panel").innerHTML = `<div class="empty-state"><p class="empty-title">Product manager isn't set up yet</p><p class="empty-sub">Follow the Supabase setup steps in README.md, then reload this page.</p></div>`;
    window.initAdminOrders && window.initAdminOrders();
  }

  async function initConfigured() {
    initTabs();
    qs("#admin-login-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = qs("#admin-login-email").value.trim();
      const password = qs("#admin-login-password").value;
      const btn = qs("#admin-login-btn");
      btn.disabled = true; btn.textContent = "LOGGING IN...";
      const { error } = await window.supabaseClient.auth.signInWithPassword({ email, password });
      btn.disabled = false; btn.textContent = "LOG IN";
      if (error) { showLogin(error.message || "Login failed. Check your email and password."); return; }
      showDashboard();
    });

    qs("#admin-logout-btn").addEventListener("click", async () => {
      await window.supabaseClient.auth.signOut();
      showLogin();
    });

    const { data: { session } } = await window.supabaseClient.auth.getSession();
    if (session) showDashboard(); else showLogin();

    window.supabaseClient.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") showLogin();
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (!qs("#admin-login-view")) return; // not on admin.html
    if (window.SUPABASE_CONFIGURED && window.supabaseClient) initConfigured();
    else initUnconfigured();
  });
})();
