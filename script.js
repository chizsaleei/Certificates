/* ==========================================
   CHIZSA | COACHING — Global behavior
   - Active nav state
   - External link safety
   - Smooth anchor scroll with reduced-motion respect
   - Service worker registration
   - UTM capture (session)
   ========================================== */

(function () {
  const $ = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

  // 1) Mark active nav item
  try {
    const path = location.pathname.replace(/\/+$/, '') || '/';
    $$('.site-nav a').forEach(a => {
      const href = a.getAttribute('href') || '';
      const h = href.replace(/\/+$/, '');
      if (h && h !== '#' && path.startsWith(h)) {
        a.setAttribute('aria-current','page');
      }
    });
  } catch(e){ /* no-op */ }

  // 2) External link safety
  try {
    $$('a[href^="http"]').forEach(a => {
      const url = new URL(a.href);
      if (url.host !== location.host) {
        a.setAttribute('target','_blank');
        a.setAttribute('rel','noopener');
      }
    });
  } catch(e){}

  // 3) Smooth anchor scroll (respect reduced motion)
  try {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) {
      $$('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
          const id = a.getAttribute('href');
          const el = $(id);
          if (el) {
            e.preventDefault();
            el.scrollIntoView({behavior:'smooth',block:'start'});
            history.pushState(null,'',id);
          }
        });
      });
    }
  } catch(e){}

  // 4) Capture UTM once per session for simple analytics
  try {
    const params = new URLSearchParams(location.search);
    const utm = ['utm_source','utm_medium','utm_campaign','utm_content'].reduce((acc,k)=>{
      const v = params.get(k); if (v) acc[k]=v; return acc;
    }, {});
    if (Object.keys(utm).length) sessionStorage.setItem('utm', JSON.stringify(utm));
  } catch(e){}

  // 5) Service worker registration
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(()=>{ /* ignore */ });
    });
  }

  // 6) Tiny helper exposed for pages that want it
  window.Site = {
    getUTM(){ try { return JSON.parse(sessionStorage.getItem('utm')||'{}'); } catch(e){ return {}; } },
    // gold hover utility for buttons rendered at runtime
    ripple(el){
      if(!el) return;
      el.addEventListener('pointerdown', ()=> el.style.transform='translateY(1px)');
      el.addEventListener('pointerup',   ()=> el.style.transform='');
      el.addEventListener('pointerleave',()=> el.style.transform='');
    }
  };
})();
