(async function () {
  const user = await Auth.getUser();
  const gated = document.querySelectorAll("[data-gated='true']");
  gated.forEach(el => el.style.display = user ? "block" : "none");
  const signinBtn = document.getElementById("btn-signin");
  signinBtn?.addEventListener("click", async () => {
    const email = prompt("Enter your email to get a magic sign in link:");
    if (!email) return;
    const { error } = await Auth.sendMagic(email, "/index.html");
    alert(error ? error.message : "Check your email for the sign in link.");
  });
  document.getElementById("btn-signout")?.addEventListener("click", Auth.signOut);
})();

