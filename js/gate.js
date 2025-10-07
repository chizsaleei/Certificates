/* File: /js/gate.js */

/* CONFIG - replace only if these paths change */
const ENTITLEMENTS_URL = "https://gwlwctytwendsixwvnvu.supabase.co/functions/v1/entitlements";
const SIGNIN_URL       = "https://chizsaleei.com/auth/index.html";
const PRICING_URL      = "https://chizsaleei.com/pricing.html";

/* Require sign in only */
async function requireLoginOnly() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    location.href = `${SIGNIN_URL}?next=${encodeURIComponent(location.pathname)}`;
    return false;
  }
  return true;
}

/* Require entitlement for a product code, else send to pricing */
async function requireAccess(productCode) {
  const ok = await requireLoginOnly(); if (!ok) return false;
  const { data: { session } } = await supabase.auth.getSession();
  const r = await fetch(ENTITLEMENTS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: session.user.id, productCode })
  });
  const { allowed } = await r.json();
  if (!allowed) location.href = `${PRICING_URL}?tool=${encodeURIComponent(productCode)}`;
  return allowed;
}

/* Intercept gated links sitewide */
document.addEventListener("click", async e => {
  const a = e.target.closest("a[data-auth],a[data-gate]");
  if (!a) return;
  e.preventDefault();
  if (a.dataset.auth === "required") {
    if (await requireLoginOnly()) location.href = a.href;
    return;
  }
  if (a.dataset.gate) {
    if (await requireAccess(a.dataset.gate)) location.href = a.href;
  }
});

/* Export helpers so pages can call them on load */
window.requireLoginOnly = requireLoginOnly;
window.requireAccess = requireAccess;

/* Simple UI wiring for sign in, sign out, and showing gated elements after login */
(async function () {
  const { data: { user } } = await supabase.auth.getUser();

  /* Show elements only for signed in users */
  document.querySelectorAll("[data-gated='true']")
    .forEach(el => { el.style.display = user ? "" : "none"; });

  /* Sign in button - just go to your auth page */
  const signinBtn = document.getElementById("btn-signin");
  signinBtn?.addEventListener("click", () => {
    location.href = `${SIGNIN_URL}?next=${encodeURIComponent(location.pathname)}`;
  });

  /* Sign out button */
  const signoutBtn = document.getElementById("btn-signout");
  signoutBtn?.addEventListener("click", async () => {
    await supabase.auth.signOut();
    location.reload();
  });
})();

/* Page specific usage examples (put on each page, not here):
   Find Your Archetype: sign in only
   <script>document.addEventListener("DOMContentLoaded", () => requireLoginOnly());</script>

   Choose Your Profile: Pro only
   <script>document.addEventListener("DOMContentLoaded", () => requireAccess("pro"));</script>

   Select Your Focus: Pro only
   <script>document.addEventListener("DOMContentLoaded", () => requireAccess("pro"));</script>
*/
