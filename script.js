"use strict";

/* -------- global config -------- */
const KOFI_BASE = "https://ko-fi.com/lifebalanceq/shop"; // replace with exact product links
const CALENDAR_URL = "https://calendly.com/your-link";    // replace with your calendar if used

/* -------- simple router for top nav -------- */
const links = document.querySelectorAll(".navlink");
const sections = document.querySelectorAll(".section");
function showSection(id) {
  sections.forEach(s => s.classList.toggle("active-section", s.id === id));
  links.forEach(a => a.classList.toggle("active", a.dataset.target === id));
  if (location.hash.replace("#","") !== id) history.replaceState(null, "", `#${id}`);
}
links.forEach(a => a.addEventListener("click", e => {
  e.preventDefault();
  showSection(a.dataset.target);
}));
if (location.hash) {
  const target = location.hash.replace("#", "");
  const found = document.getElementById(target);
  if (found) showSection(target);
}

/* -------- COACHING: category cards + modal offers -------- */
const CATALOG = [
  {id:"healthcare", icon:"🩺", title:"Healthcare",
   blurb:"Doctors, residents, nurses, allied health. OSCE, OET, patient dialogue, M&M, grand rounds.",
   offers:[
     {name:"OSCE or OET Role-play Pack", info:"3 sessions x 60 min, station drills, feedback, transcripts", price:"₱8,500", url:KOFI_BASE},
     {name:"Patient Communication Mastery", info:"2 sessions x 75 min, empathy, structure, risk explanation", price:"₱6,500", url:KOFI_BASE},
     {name:"Grand Rounds Slide and Story", info:"Slide polish, narrative arc, delivery coaching, 1 revision", price:"₱5,500", url:KOFI_BASE}
   ],
   note:"Best for ICU, surgery, hematology, pediatrics, ophthalmology, and internal medicine."
  },
  {id:"scipharm", icon:"🧪", title:"Science and Pharma",
   blurb:"Chemists, QA, RA, CRAs, medical writers. Technical writing and reviews.",
   offers:[
     {name:"Regulatory Writing Clinic", info:"Abstracts, protocols, IFUs, clarity edits, reviewer mindset", price:"₱6,900", url:KOFI_BASE},
     {name:"QA Report Sprint", info:"1 live session plus async rewrite within 48 h", price:"₱5,900", url:KOFI_BASE},
     {name:"Med-Copy Portfolio Critique", info:"Copywriter guidance for healthcare brands", price:"₱4,900", url:KOFI_BASE}
   ],
   note:"Bring a real sample for fastest gains."
  },
  {id:"business", icon:"📈", title:"Business and Corporate",
   blurb:"Sales, procurement, CS, PMs, ops. High stakes communication and demos.",
   offers:[
     {name:"Sales Demo Rehearsal", info:"Discovery script, demo flow, objection drills, call review", price:"₱5,900", url:KOFI_BASE},
     {name:"Executive Presentation Tune-up", info:"Deck structure, message map, speaking reps", price:"₱6,500", url:KOFI_BASE},
     {name:"Negotiation Role-play", info:"BATNA prep, live practice, talk tracks", price:"₱5,500", url:KOFI_BASE}
   ],
   note:"Great before a quarterly review or expo."
  },
  {id:"admissions", icon:"🎓", title:"Academia and Admissions",
   blurb:"Graduate, MBA, and PhD applicants. Researchers and thesis defenses.",
   offers:[
     {name:"Statement of Purpose Sprint", info:"Outline, line edits, polish, final proof", price:"₱7,500", url:KOFI_BASE},
     {name:"Mock Interview Intensive", info:"90 min panel style, rubric scoring, action plan", price:"₱4,500", url:KOFI_BASE},
     {name:"Research Abstract Polish", info:"Clarity, concision, keywords, reviewer check", price:"₱3,900", url:KOFI_BASE}
   ],
   note:"Add journal targeting if needed."
  },
  {id:"techdata", icon:"💻", title:"Tech and Data",
   blurb:"Pitches, demos, and data stories for tech teams and founders.",
   offers:[
     {name:"Data Story Coaching", info:"From chart to story, decisions and tradeoffs", price:"₱5,900", url:KOFI_BASE},
     {name:"Pitch Rebuild", info:"Narrative, problem, solution, proof, ask, timing", price:"₱7,900", url:KOFI_BASE},
     {name:"Stakeholder Update Pack", info:"Template, cadence, crisp status writing", price:"₱3,500", url:KOFI_BASE}
   ],
   note:"Bring a deck or repo link if possible."
  },
  {id:"education", icon:"📚", title:"Education and Coaching",
   blurb:"Teachers, trainers, facilitators. Sessions that land and stick.",
   offers:[
     {name:"Workshop Design Lab", info:"Objectives, flow, activities, pacing, slides", price:"₱5,500", url:KOFI_BASE},
     {name:"Lesson Clarity Check", info:"Cognitive load, prompts, outcomes, rubrics", price:"₱3,500", url:KOFI_BASE},
     {name:"Facilitation Skills Coaching", info:"Presence, questioning, debrief, energy", price:"₱4,900", url:KOFI_BASE}
   ],
   note:"Useful before high visibility classes."
  },
  {id:"creators", icon:"🧭", title:"Creators and Consultants",
   blurb:"Offers, service pages, proposals, discovery calls.",
   offers:[
     {name:"Offer Page Teardown", info:"Positioning, proof, UX skim, conversion checklist", price:"₱3,900", url:KOFI_BASE},
     {name:"Discovery Call Script", info:"Qualifying questions, flow, objection notes", price:"₱3,200", url:KOFI_BASE},
     {name:"Proposal Polish", info:"Scope, outcomes, pricing logic, close", price:"₱4,200", url:KOFI_BASE}
   ],
   note:"Pair with a 2 week accountability check."
  },
  {id:"mobility", icon:"✈️", title:"Global Mobility",
   blurb:"IELTS and workplace English for overseas roles.",
   offers:[
     {name:"IELTS Fast Track", info:"4 x 60 min. Speaking, Writing Task 2, feedback, band plan", price:"₱7,900", url:KOFI_BASE},
     {name:"Workplace English Pack", info:"Emails, meetings, negotiations, templates", price:"₱5,900", url:KOFI_BASE},
     {name:"Interview Max-Out", info:"Behavioral and case, story bank, STAR drills", price:"₱4,900", url:KOFI_BASE}
   ],
   note:"Fits nurses and doctors moving abroad."
  },
  {id:"youth", icon:"🌱", title:"Young Learners",
   blurb:"Junior and senior high. Interviews, presentations, and study skills.",
   offers:[
     {name:"Teen Interview Practice", info:"Gentle coaching, confidence drills, Q bank", price:"₱2,900", url:KOFI_BASE},
     {name:"Presentation Builder", info:"Structure, slides, delivery practice", price:"₱2,700", url:KOFI_BASE},
     {name:"Study Strategy Session", info:"Habits, spaced recall, weekly plan", price:"₲2,400", url:KOFI_BASE}
   ],
   note:"Parent briefing on request."
  }
];

const cg = document.getElementById("coachingGrid");
CATALOG.forEach(cat => {
  const el = document.createElement("article");
  el.className = "card";
  el.tabIndex = 0;
  el.setAttribute("role", "button");
  el.setAttribute("data-id", cat.id);
  el.innerHTML = `
    <div class="emoji" aria-hidden="true">${cat.icon}</div>
    <div>
      <h3>${cat.title}</h3>
      <p>${cat.blurb}</p>
    </div>
    <span class="badge">View offers</span>
  `;
  el.addEventListener("click", () => openCoachModal(cat.id));
  el.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openCoachModal(cat.id); }});
  cg.appendChild(el);
});

/* coaching modal */
const coachBackdrop = document.getElementById("coachBackdrop") || (() => {
  // create a minimal modal if not present (kept for safety)
  const bd = document.createElement("div"); bd.id = "coachBackdrop"; bd.className = "modal-backdrop";
  bd.innerHTML = `<div class="modal"><header><h2 id="coachModalTitle">Category</h2><button class="xbtn" id="coachCloseBtn" aria-label="Close">✕</button></header><div class="options" id="coachOptions"></div><div class="hint" id="coachHint"></div></div>`;
  document.body.appendChild(bd); return bd;
})();
const coachTitle = document.getElementById("coachModalTitle");
const coachOptions = document.getElementById("coachOptions");
const coachHint = document.getElementById("coachHint");
const coachCloseBtn = document.getElementById("coachCloseBtn");

function openCoachModal(id) {
  const cat = CATALOG.find(c => c.id === id);
  if (!cat) return;
  coachTitle.textContent = `${cat.title} offers`;
  coachOptions.innerHTML = cat.offers.map(o => `
    <div class="opt">
      <div>
        <h4>${o.name}</h4>
        <p>${o.info}</p>
      </div>
      <a class="cta" href="${o.url}" target="_blank" rel="noopener">Buy or Book • ${o.price}</a>
    </div>
  `).join("");
  coachHint.textContent = cat.note || "";
  coachBackdrop.style.display = "flex";
  coachCloseBtn.focus();
}
function closeCoachModal(){ coachBackdrop.style.display = "none"; }
coachBackdrop.addEventListener("click", e => { if (e.target === coachBackdrop) closeCoachModal(); });
coachCloseBtn.addEventListener("click", closeCoachModal);
document.addEventListener("keydown", e => { if (e.key === "Escape") closeCoachModal(); });

/* -------- CORE TYPE: 10 cards -------- */
const TYPES = [
  {id:"builder",    title:"The Builder → Shadow Track",    blurb:"A lightweight journal app that logs effort, decisions, and tradeoffs, then auto generates weekly behind the scenes reports to make unseen work visible."},
  {id:"analyst",    title:"The Analyst → Decision Lab",    blurb:"A facilitation sprint where analysts ship one bet per week using pre committed criteria, public postmortems, and tiny A/B tests to reduce fear of being wrong."},
  {id:"connector",  title:"The Connector → Inner Circle Audit", blurb:"A 30 day relationship reset that maps value flows, sets boundaries, and creates a tiered access system so loyalty is clear without constant favors."},
  {id:"creator",    title:"The Creator → Idea Reservoir",  blurb:"A capture and seed system with prompts, swipe files, and a 3 stage pipeline that keeps a backlog full and removes the worry that the well will dry."},
  {id:"caregiver",  title:"The Caregiver → Care Plan for You", blurb:"A concierge self care program that schedules non negotiables, assigns a care buddy, and tracks recovery metrics so their needs get equal priority."},
  {id:"leader",     title:"The Leader → Truth Council",    blurb:"A private advisory circle of 3 to 5 peers with anonymous 360 inputs and monthly hot seats to cure isolation and surface blind spots."},
  {id:"strategist", title:"The Strategist → 70-20-10 Field Kit", blurb:"A planning pack that forces 70 percent execution, 20 percent controlled experiments, 10 percent exploration, with live dashboards to catch real world noise."},
  {id:"explorer",   title:"The Explorer → Depth Contract", blurb:"A 12 week commitment container with a single focus, weekly stakes, and public progress logs to convert curiosity into mastery."},
  {id:"performer",  title:"The Performer → Offstage Studio", blurb:"A coaching program that builds identity beyond applause through reflective writing, small room workshops, and service projects tied to their message."},
  {id:"finisher",   title:"The Finisher → Good Enough Gate", blurb:"A shipping tool with predefined acceptance criteria, time boxed polishing, and an auto ship trigger once quality thresholds are met."},
];
const typeGrid = document.getElementById("typeCards");
typeGrid.innerHTML = TYPES.map(t => `
  <article class="type-card">
    <h3>${t.title}</h3>
    <p>${t.blurb}</p>
    <div class="row">
      <a class="btn" href="${KOFI_BASE}" target="_blank" rel="noopener">Get the pack</a>
      <a class="pill" href="${CALENDAR_URL}" target="_blank" rel="noopener">Book consult</a>
    </div>
  </article>
`).join("");

/* -------- TRAINING: certificates grid and filters -------- */
const OVERRIDES = { /* add entries if a filename fails */ };

const LIST = [/* keep your full certificates list here, unchanged */];
// ... keep the same renderTraining function from the previous version ...

const tgrid = document.getElementById("trainingGrid");
const tabs = document.querySelectorAll(".tabs .tab");

function buildSrcVariants(key){
  if (OVERRIDES[key]) return [OVERRIDES[key]];
  const base = `certificates/${key}.jpg`;
  const variants = new Set([base]);
  const reps = s => s.replaceAll("__","_").replaceAll(" ,",",").replaceAll(",","").replaceAll("&","and");
  variants.add(reps(base.replaceAll("_"," ")));
  variants.add(reps(base));
  variants.add(base.replaceAll("_"," ").replaceAll("__","_"));
  variants.add(base.replaceAll("E-commerce","E commerce"));
  variants.add(base.replaceAll("E commerce","E-commerce"));
  variants.add(reps(base.replaceAll("_","  ")));
  return Array.from(variants);
}
function renderTraining(filter="all"){
  tgrid.innerHTML = "";
  const items = LIST.filter(i => filter==="all" ? true : i.group===filter)
                    .sort((a,b)=>a.order-b.order);
  for(const item of items){
    const card = document.createElement("article");
    card.className = "card";
    const link = document.createElement("a");
    link.href = item.url; link.target = "_blank"; link.rel = "noopener";
    link.setAttribute("aria-label", `${item.title} open verification`);

    const wrap = document.createElement("div"); wrap.className = "thumb-wrap";
    const img = document.createElement("img"); img.loading = "lazy"; img.alt = item.title;

    const candidates = buildSrcVariants(item.key);
    let idx = 0;
    function tryNext(){
      if(idx >= candidates.length){ img.src = "images/certificate-fallback.jpg"; return; }
      img.src = candidates[idx++];
    }
    img.onerror = tryNext; tryNext();

    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = item.group === "spec" ? "Specialization" : (item.group === "course" ? "Course" : "Other");

    const meta = document.createElement("div"); meta.className = "meta";
    const title = document.createElement("div"); title.className = "title"; title.textContent = item.title;
    const cap = document.createElement("div"); cap.className = "caption"; cap.textContent = "Click to verify";

    wrap.appendChild(img); wrap.appendChild(badge);
    link.appendChild(wrap); meta.appendChild(title); meta.appendChild(cap); link.appendChild(meta);
    card.appendChild(link); tgrid.appendChild(card);
  }
}
tabs.forEach(t => t.addEventListener("click", ()=>{
  tabs.forEach(x=>x.classList.remove("active"));
  t.classList.add("active");
  renderTraining(t.dataset.filter);
}));
renderTraining();
