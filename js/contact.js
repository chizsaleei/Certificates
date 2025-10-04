(async function(){
  const form = document.getElementById("contact-form");
  if (!form) return;
  const status = document.getElementById("contact-status");
  const submitBtn = document.getElementById("contact-submit");
  const { id: user_id } = (await Auth.getUser()) || {};

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    submitBtn.disabled = true; status.textContent = "Sending...";
    const name = document.getElementById("c-name").value.trim();
    const email = document.getElementById("c-email").value.trim();
    const message = document.getElementById("c-msg").value.trim();
    const { error } = await supabase.from("contact_messages").insert([{ user_id, name, email, message }]);
    status.textContent = error ? `Error: ${error.message}` : "Message sent. I will reply via email.";
    if (!error) form.reset();
    submitBtn.disabled = false;
  });
})();

