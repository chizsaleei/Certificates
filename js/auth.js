// Email magic link + sign out + session check
window.Auth = (function () {
  async function sendMagic(email, redirect = "/index.html") {
    return supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `https://chizsaleei.com${redirect}` }
    });
  }
  async function getUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user || null;
  }
  async function signOut() { await supabase.auth.signOut(); location.reload(); }
  return { sendMagic, getUser, signOut };
})();

