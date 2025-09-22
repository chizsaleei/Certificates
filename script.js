"use strict";
// Group 4 - Other courses
{id:9, group:"other", order:20, title:"Google AI Essentials", img:"certificates/9_Google_AI_Essentials.jpg", url:"https://coursera.org/verify/H9BH284HGAG4"},
{id:10, group:"other", order:21, title:"Build your business brand using Canva", img:"certificates/10_Build_your_business_brand_using_Canva.jpg", url:"https://coursera.org/verify/Q4NSV9GC49Z6"},
{id:11, group:"other", order:22, title:"Model Thinking", img:"certificates/11_Model_Thinking_University_of_Michigan.jpg", url:"https://coursera.org/verify/Q1QX7DMOA7JP"},
{id:12, group:"other", order:23, title:"Bayesian Statistics - From Concept to Data Analysis", img:"certificates/12_Bayesian_Statistics_From_Concept_to_Data_Analysis.jpg", url:"https://coursera.org/verify/6EZC9YZ41XMJ"},
{id:13, group:"other", order:24, title:"A Crash Course in Causality - Inferring Causal Effects from Observational Data", img:"certificates/13_A_Crash_Course_in_Causality_Inferring_Causal_Effects_from_Observational_Data.jpg", url:"https://coursera.org/verify/B09N90KYJLJL"},
{id:21, group:"other", order:25, title:"Python for Data Science, AI & Development", img:"certificates/21_Python_for_Data_Science_AI_and_Development.jpg", url:"https://coursera.org/verify/5ZGJJM3SBYQQ"},
{id:22, group:"other", order:26, title:"Develop Generative AI Applications - Get Started", img:"certificates/22_Develop_Generative_AI_Applications_Get_Started.jpg", url:"https://coursera.org/verify/PYY6K9GVOCNU"},
{id:27, group:"other", order:27, title:"Mastering Sales - From Fundamentals to Career Success", img:"certificates/27_Mastering_Sales_From_Fundamentals_to_Career_Success.jpg", url:"https://coursera.org/verify/7C0BKDYHCEPY"},
{id:28, group:"other", order:28, title:"What is Data Science?", img:"certificates/28_What_is_Data_Science.jpg", url:"https://coursera.org/verify/0EKRYCN9ROOJ"}
];


const grid = document.getElementById("grid");
const tabs = document.querySelectorAll('.tab');


function render(filter="all"){
grid.innerHTML = "";
const items = DATA
.filter(i => filter === "all" ? true : i.group === filter)
.sort((a,b) => a.order - b.order);


for(const item of items){
const card = document.createElement('article');
card.className = 'card';


const link = document.createElement('a');
link.href = item.url;
link.target = '_blank';
link.rel = 'noopener';
link.setAttribute('aria-label', `${item.title} - open verification`);


const wrap = document.createElement('div');
wrap.className = 'thumb-wrap';


const img = document.createElement('img');
img.loading = 'lazy';
img.src = item.img; // expects a JPG in /certificates
img.alt = item.title;


const badge = document.createElement('span');
badge.className = 'badge';
badge.textContent = item.group === 'spec' ? 'Specialization' : (item.group === 'course' ? 'Course' : 'Course');


const meta = document.createElement('div');
meta.className = 'meta';


const h3 = document.createElement('div');
h3.className = 'title';
h3.textContent = item.title;


const cap = document.createElement('div');
cap.className = 'caption';
cap.textContent = 'Click to verify on Coursera';


wrap.appendChild(img);
wrap.appendChild(badge);
link.appendChild(wrap);
meta.appendChild(h3);
meta.appendChild(cap);
link.appendChild(meta);
card.appendChild(link);
grid.appendChild(card);
}
}


// Tabs logic
for(const t of tabs){
t.addEventListener('click', () => {
tabs.forEach(x => x.classList.remove('active'));
t.classList.add('active');
render(t.dataset.filter);
});
}


render();
