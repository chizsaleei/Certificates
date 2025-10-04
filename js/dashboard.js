(async function(){
  const who = document.getElementById("who");
  const list = document.getElementById("items");
  const user = await Auth.getUser();
  if (!user) { who.textContent = "Please sign in from the home page."; return; }
  who.textContent = `Signed in as ${user.email}`;
  // Example: show latest quiz results
  const { data, error } = await supabase.from("quiz_results")
    .select("*").eq("user_id", user.id).order("created_at", { ascending:false }).limit(10);
  if (error) { list.innerHTML = `<li>${error.message}</li>`; return; }
  list.innerHTML = data?.length
    ? data.map(r => `<li>${r.quiz_slug} • score ${r.score ?? "n/a"} • ${new Date(r.created_at).toLocaleString()}</li>`).join("")
    : "<li>No activity yet.</li>";
  document.getElementById("btn-signout").addEventListener("click", Auth.signOut);
})();
