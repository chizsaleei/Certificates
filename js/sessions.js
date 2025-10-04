// Daily Prebuilt with simple country check for VooV fallback
(async function(){
  const user = await Auth.getUser();
  if (!user) { location.href = "/index.html"; return; }

  // Create or find a room URL. For MVP, use a static Daily room you created in your Daily dashboard.
  const DAILY_ROOM = "https://YOUR-SUBDOMAIN.daily.co/your-room"; // Precreated room
  const voovLink   = "https://voovmeeting.com/s/your-meeting-id";  // Your VooV meeting

  // Basic country check
  let country = "XX";
  try {
    const res = await fetch("https://ipapi.co/country/");
    if (res.ok) country = (await res.text()).trim();
  } catch(_) {}

  const isCN = country === "CN";
  const iframe = document.getElementById("room");
  const fallback = document.getElementById("fallback");
  const controls = document.getElementById("controls");

  if (!isCN) {
    iframe.src = DAILY_ROOM;
    iframe.style.display = "block";
    controls.innerHTML = "If the embed does not load, <a href='"+DAILY_ROOM+"' target='_blank' rel='noopener'>open in a new tab</a>.";
  } else {
    fallback.innerHTML = `
      <p>For your region, please use VooV Meeting.</p>
      <p><a class="btn" href="${voovLink}" target="_blank" rel="noopener">Open VooV meeting</a></p>`;
    fallback.style.display = "block";
  }
})();

