/* File: Coaching/js/auth.js */

/* 1) Init Supabase client
   Replace the two values below with your project URL and anon key */
const SUPABASE_URL = "https://gwlwctytwendsixwvnvu.supabase.co";        // <- replace
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3bHdjdHl0d2VuZHNpeHd2bnZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NzM2ODQsImV4cCI6MjA3NTE0OTY4NH0.0fg92ZPHU4EoLYv6KDxZzlS12y_y54qRfSQ6CPAHhpo";               // <- replace

// If the CDN script loaded, a global `supabase` object exists
window.supabase = window.supabase || supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* 2) Simple auth helpers */
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

  async function getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session || null;
  }

  async function signOut() {
    await supabase.auth.signOut();
    location.reload();
  }

  return { sendMagic, getUser, getSession, signOut };
})();
