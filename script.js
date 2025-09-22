"use strict";

/* 
  Robust image loader:
  - We define each certificate once.
  - For each item we compute filename variants and auto-fallback on error.
  - This handles spaces, underscores, commas, and "&" vs "and".
*/

const LIST = [
  // Specialization 1: Google Digital Marketing & E-commerce
  {group:"spec", order:1,  title:"Google Digital Marketing & E-commerce - Specialization", key:"8_Specialization_Google_Digital_Marketing_&_E-commerce", url:"https://coursera.org/verify/professional-cert/XJ7RPDFF5YPZ"},
  {group:"course", order:2, title:"Foundations of Digital Marketing and E-commerce", key:"1_Foundations_of_Digital_Marketing_and_E-commerce", url:"https://coursera.org/verify/GM1CSXON3K4E"},
  {group:"course", order:3, title:"Attract and Engage Customers with Digital Marketing", key:"2_Attract_and_Engage_Customers_with_Digital_Marketing", url:"https://coursera.org/verify/CA0DKR2K4KER"},
  {group:"course", order:4, title:"From Likes to Leads - Interact with Customers Online", key:"3_From_Likes_to_Leads_Interact_with_Customers_Online", url:"https://coursera.org/verify/ZKJMTULN8K6V"},
  {group:"course", order:5, title:"Think Outside the Inbox - Email Marketing", key:"4_Think_Outside_the_Inbox_Email_Marketing", url:"https://coursera.org/verify/WH2JUU05W30K"},
  {group:"course", order:6, title:"Assess for Success - Marketing Analytics and Measurement", key:"5_Assess_for_Success_Marketing_Analytics_and_Measurement", url:"https://coursera.org/verify/R5UKAYGD3M9N"},
  {group:"course", order:7, title:"Make the Sale - Build, Launch, and Manage E-commerce Stores", key:"6_Make_the_Sale_Build,_Launch,_and_Manage_E-commerce_Stores", url:"https://coursera.org/verify/25PYRQODAXIR"},
  {group:"course", order:8, title:"Satisfaction Guaranteed - Develop Customer Loyalty Online", key:"7_Satisfaction_Guaranteed_Develop_Customer_Loyalty_Online", url:"https://coursera.org/verify/12UY7SCJULY0"},

  // Specialization 2: Organizational Leadership
  {group:"spec", order:9, title:"Organizational Leadership - Specialization", key:"20_Organizational_Leadership_Specialization", url:"https://coursera.org/verify/specialization/TIUGTCYXP6RO"},
  {group:"course", order:10, title:"High Performance Collaboration - Leadership, Teamwork, and Negotiation", key:"14_High_Performance_Collaboration_Leadership,_Teamwork,_and_Negotiation", url:"https://coursera.org/verify/P4TJA54N28F0"},
  {group:"course", order:11, title:"Leadership Communication for Maximum Impact - Storytelling", key:"15_Leadership_Communication_for_Maximum_Impact__Storytelling", url:"https://coursera.org/verify/BDMN8VO12J36"},
  {group:"course", order:12, title:"Leadership Through Social Influence", key:"16_Leadership_Through_Social_Influence", url:"https://coursera.org/verify/B5ERT4J3VWGU"},
  {group:"course", order:13, title:"Leadership Through Marketing", key:"17_Leadership_Through_Marketing", url:"https://coursera.org/verify/2WKNKZ2SYV84"},
  {group:"course", order:14, title:"Leadership Through Design Innovation", key:"18_Leadership_Through_Design_Innovation", url:"https://coursera.org/verify/ZOEY4S79TMQN"},
  {group:"course", order:15, title:"Organizational Leadership Capstone", key:"19_Organizational_Leadership_Capstone", url:"https://coursera.org/verify/55WTX8PE08IG"},

  // Specialization 3: Building AI Agents and Agentic Workflows
  {group:"spec", order:16, title:"Building AI Agents and Agentic Workflows - Specialization", key:"26_Building_AI_Agents_and_Agentic_Workflows", url:"https://coursera.org/verify/specialization/V8WOU8TOCPNM"},
  {group:"course", order:17, title:"Fundamentals of Building AI Agents", key:"23_Fundamentals_of_Building_AI_Agents", url:"https://coursera.org/verify/FT2JAV8QC5I9"},
  {group:"course", order:18, title:"Agentic AI with LangChain and LangGraph", key:"24_Agentic_AI_with_LangChain_and_LangGraph", url:"https://coursera.org/verify/FQGRMFA1FD41"},
  {group:"course", order:19, title:"Agentic AI with LangGraph, CrewAI, AutoGen and BeeAI", key:"25_Agentic_AI_with_LangGraph,_CrewAI,_AutoGen_and_BeeAI", url:"https://coursera.org/verify/DOBGBW0VXH3D"},

  // Other courses
  {group:"other", order:20, title:"Google AI Essentials", key:"9_Google_AI_Essentials", url:"https://coursera.org/verify/H9BH284HGAG4"},
  {group:"other", order:21, title:"Build your business brand using Canva", key:"10_Build_your_business_brand_using_Canva", url:"https://coursera.org/verify/Q4NSV9GC49Z6"},
  {group:"other", order:22, title:"Model Thinking", key:"11_Model_Thinking_University_of_Michigan", url:"https://coursera.org/verify/Q1QX7DMOA7JP"},
  {group:"other", order:23, title:"Bayesian Statistics - From Concept to Data Analysis", key:"12_Bayesian_Statistics_From_Concept_to_Data_Analysis", url:"https://coursera.org/verify/6EZC9YZ41XMJ"},
  {group:"other", order:24, title:"A Crash Course in Causality - Inferring Causal Effects from Observational Data", key:"13_A_Crash_Course_in_Causality_Inferring_Causal_Effects_from_Observational_Data", url:"https://coursera.org/verify/B09N90KYJLJL"},
  {group:"other", order:25, title:"Python for Data Science, AI & Development", key:"21_Python_for_Data_Science,_AI_&_Development", url:"https://coursera.org/verify/5ZGJJM3SBYQQ"},
  {group:"other", order:26, title:"Develop Generative AI Applications - Get Started", key:"22_Develop_Generative_AI_Applications_Get_Started", url:"https://coursera.org/verify/PYY6K9GVOCNU"},
  {group:"other", order:27, title:"Mastering Sales - From Fundamentals to Career Success", key:"27_Mastering_Sales_From_Fundamentals_to_Career_Success", url:"https://coursera.org/verify/7C0BKDYHCEPY"},
  {group:"other", order:28, title:"What is Data Science?", key:"28_What_is_Data_Science", url:"https://coursera.org/verify/0EKRYCN9ROOJ"}
];

const grid = document.getElementById("grid");
const tabs = document.querySelectorAll(".tab");

function buildSrcVariants(key){
  // canonical with underscores
  const base = `certificates/${key}.jpg`;

  const variants = new Set();

  variants.add(base);

  // underscores to spaces
  variants.add(base.replaceAll("_"," "));
  // compress double underscores
  variants.add(base.replaceAll("__","_"));
  // remove some commas
  variants.add(base.replaceAll(",",""));
  // & and and variants
  variants.add(base.replaceAll("_and_","_&_"));
  variants.add(base.replaceAll("_&_","_and_"));
  variants.add(base.replaceAll("&","and"));
  // mix: spaces + remove commas
  variants.add(base.replaceAll("_"," ").replaceAll(",",""));
  // hyphenated e-commerce variants
  variants.add(base.replaceAll("E-commerce","E commerce"));
  variants.add(base.replaceAll("E commerce","E-commerce"));

  return Array.from(variants);
}

function render(filter="all"){
  grid.innerHTML = "";
  const items = LIST.filter(i => filter==="all" ? true : i.group===filter)
                    .sort((a,b)=>a.order-b.order);

  for(const item of items){
    const card = document.createElement("article");
    card.className = "card";

    const link = document.createElement("a");
    link.href = item.url;
    link.target = "_blank";
    link.rel = "noopener";
    link.setAttribute("aria-label", `${item.title} – open verification`);

    const wrap = document.createElement("div");
    wrap.className = "thumb-wrap";

    const img = document.createElement("img");
    img.loading = "lazy";
    img.alt = item.title;

    // try variants until one loads
    const candidates = buildSrcVariants(item.key);
    let idx = 0;
    function tryNext(){
      if(idx >= candidates.length){
        // fallback placeholder if none found
        img.src = "images/certificate-fallback.jpg";
        return;
      }
      img.src = candidates[idx++];
    }
    img.onerror = tryNext;
    tryNext();

    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = item.group === "spec" ? "Specialization" : "Course";

    const meta = document.createElement("div");
    meta.className = "meta";

    const title = document.createElement("div");
    title.className = "title";
    title.textContent = item.title;

    const cap = document.createElement("div");
    cap.className = "caption";
    cap.textContent = "Click to verify";

    wrap.appendChild(img);
    wrap.appendChild(badge);
    link.appendChild(wrap);
    meta.appendChild(title);
    meta.appendChild(cap);
    link.appendChild(meta);
    card.appendChild(link);
    grid.appendChild(card);
  }
}

// tabs
for(const t of tabs){
  t.addEventListener("click", ()=>{
    tabs.forEach(x=>x.classList.remove("active"));
    t.classList.add("active");
    render(t.dataset.filter);
  });
}

render();
