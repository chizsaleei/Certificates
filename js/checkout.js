/* File: /js/checkout.js
   Replace <PROJECT-REF> with your real Supabase project ref */
const API_CHECKOUT = "https://<https://gwlwctytwendsixwvnvu.supabase.co>.functions.supabase.co/create-checkout-session";


/* Single action for everyone */
async function use(variantId) {
  const res = await fetch(API_CHECKOUT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ provider: "lemonsqueezy", variantId })
  });
  const { url, error } = await res.json().catch(() => ({}));
  if (error || !url) { alert("Could not start checkout. Please try again."); return; }
  location.href = url;
}

/* Optional data attribute handler
   Usage: <button data-use data-variant="12345">Use</button>
*/
document.addEventListener("click", e => {
  const el = e.target.closest("[data-use]");
  if (!el) return;
  e.preventDefault();
  el.disabled = true;
  use(el.dataset.variant).finally(() => (el.disabled = false));
});

/* Optional inline usage
   <button onclick="use('12345')">Use</button>
*/
window.use = use;
