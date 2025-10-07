/* File: /js/lemon.js
   Paste your real Supabase Invoke URL for create-checkout-session */
const API_CHECKOUT = "https://<https://gwlwctytwendsixwvnvu.supabase.co>.functions.supabase.co/create-checkout-session";
const AUTH_URL     = "https://chizsaleei.com/auth/index.html";

/* Map your real Lemon Squeezy Variant IDs here */
const VARIANT_IDS = {
  proMonthly: "REPLACE_WITH_LS_VARIANT_PRO_MONTHLY",
  // Optional singles or coaching
  speakingDrills: "REPLACE_WITH_LS_VARIANT_SPEAKING",
  medEnglishLabs: "REPLACE_WITH_LS_VARIANT_MED_ENGLISH",
  businessBriefs: "REPLACE_WITH_LS_VARIANT_BUSINESS",
  coaching25: "REPLACE_WITH_LS_VARIANT_COACH_25",
  coaching50: "REPLACE_WITH_LS_VARIANT_COACH_50",
};

/* Auth helpers */
async function getUserId() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user?.id ?? null;
  } catch { return null; }
}
async function requireLogin() {
  const uid = await getUserId();
  if (!uid) {
    location.href = `${AUTH_URL}?next=${encodeURIComponent(location.pathname + location.search)}`;
    return null;
  }
  return uid;
}

/* Core checkout */
async function startLsCheckout({ variantId, metadata = {}, requireAuth = true }) {
  if (!variantId || String(variantId).startsWith("REPLACE_")) {
    alert("Set your Lemon Squeezy variant ID first.");
    return;
  }
  let userId = null;
  if (requireAuth) {
    userId = await requireLogin();
    if (!userId) return;
  }
  const res = await fetch(API_CHECKOUT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      provider: "lemonsqueezy",
      variantId,
      metadata: { userId, ...metadata }
    })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data?.url) { alert("Checkout error. Please try again."); return; }
  location.href = data.url;
}

/* Public helpers (no “international”) */
async function buyProMonthly() {
  return startLsCheckout({ variantId: VARIANT_IDS.proMonthly, metadata: { product: "tools-pass" } });
}
async function useVariant(variantId) {
  return startLsCheckout({ variantId, metadata: { product: "single-variant" } });
}
async function useTool(toolKey) {
  const variantId = VARIANT_IDS[toolKey];
  return startLsCheckout({ variantId, metadata: { product: "single-tool", toolKey } });
}
async function bookCoaching(lengthKey) {
  const variantId = VARIANT_IDS[lengthKey];
  return startLsCheckout({ variantId, metadata: { product: "coaching", lengthKey } });
}

/* Data-attribute hooks so you do not need inline onclick */
document.addEventListener("click", e => {
  const el = e.target.closest("[data-buy-pro-monthly],[data-use-variant],[data-use-tool],[data-book-coaching]");
  if (!el) return;
  e.preventDefault();
  el.disabled = true;

  const done = (p) => p.finally(() => (el.disabled = false));

  if (el.hasAttribute("data-buy-pro-monthly")) return done(buyProMonthly());
  if (el.hasAttribute("data-use-variant"))     return done(useVariant(el.dataset.useVariant));
  if (el.hasAttribute("data-use-tool"))        return done(useTool(el.dataset.useTool));
  if (el.hasAttribute("data-book-coaching"))   return done(bookCoaching(el.dataset.bookCoaching));
});

/* Expose if you want to call in JS */
window.buyProMonthly = buyProMonthly;
window.useVariant    = useVariant;
window.useTool       = useTool;
window.bookCoaching  = bookCoaching;

/* Expose IDs so you can set them from console during setup */
window.LEMON_VARIANTS = VARIANT_IDS;

