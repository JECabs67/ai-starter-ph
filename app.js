// ===== CONFIG: edit here. Add affiliate params to URLs later. =====
const CONFIG = {
  showSponsorBanner: false, // set true to show the top sponsor banner
  sponsorBannerText: "Example sponsor message here. (Placeholder)",
  tools: {
    chatgpt:    { name: "ChatGPT",    url: "https://chatgpt.com/",            color: "#10a37f" },
    gemini:     { name: "Gemini",     url: "https://gemini.google.com/",      color: "#4285f4" },
    claude:     { name: "Claude",     url: "https://claude.ai/",              color: "#d97757" },
    perplexity: { name: "Perplexity", url: "https://www.perplexity.ai/",      color: "#1f8a99" },
    canva:      { name: "Canva",      url: "https://www.canva.com/",          color: "#7d2ae8" },
    capcut:     { name: "CapCut",     url: "https://www.capcut.com/",         color: "#111111" },
    notebooklm: { name: "NotebookLM", url: "https://notebooklm.google.com/",  color: "#5f6368" },
    grammarly:  { name: "Grammarly",  url: "https://www.grammarly.com/",      color: "#15c39a" }
  },
  // Paid placement per role. Placeholder until a real sponsor pays.
  featured: { name: "Your Tool Here (Example)", color: "#f5b83d", url: "#", text: "Example lang ito. Dito lalabas ang featured tool ng partner namin." }
};

const ROLES = {
  student: { icon:"🎓", label:"Student",
    tools:[["chatgpt","Pang-explain ng mahirap na lesson."],["notebooklm","I-upload ang notes mo. Gagawa ito ng reviewer."],["perplexity","Research na may sources."]],
    today:"Kunin ang pinakamahirap na topic mo ngayon. Sabihin sa ChatGPT: \"Explain mo ito na parang Grade 6 ako.\"",
    days:["Gumawa ng ChatGPT account at magtanong ng isang lesson.","I-upload ang notes mo sa NotebookLM.","Gumawa ng 10-item quiz gamit ang AI.","Mag-research ng isang topic sa Perplexity.","Ipa-check sa AI ang outline ng essay mo.","Gumawa ng study schedule para sa linggo.","Balikan kung ano ang pinaka nakatulong. Ulitin ito."] },
  va: { icon:"💼", label:"VA / Freelancer",
    tools:[["chatgpt","Pang-draft ng emails at proposals."],["claude","Maganda sa mahahabang docs at summary."],["canva","Mabilis na graphics para sa client."]],
    today:"Isulat ang isang proposal gamit ang ChatGPT. Ikaw pa rin ang mag-edit bago i-send.",
    days:["Gumawa ng account sa ChatGPT at Claude.","Gumawa ng email template para sa clients.","Ipa-summarize sa Claude ang isang mahabang doc.","Gumawa ng social post design sa Canva.","Ilista ang 3 tasks mo na pwedeng bilisan ng AI.","I-update ang profile mo. Ilagay ang AI skills.","Mag-apply sa isang gig na may AI skill."] },
  seller: { icon:"🛒", label:"Online Seller",
    tools:[["chatgpt","Pang-sulat ng Taglish captions."],["canva","Product photos at posters."],["capcut","Short videos para sa TikTok at Reels."]],
    today:"Pumili ng isang product. Ipagawa sa ChatGPT ang 3 Taglish captions para dito.",
    days:["Gumawa ng 3 captions para sa best seller mo.","Linisin ang product photo sa Canva.","Gumawa ng 15-second video sa CapCut.","Gumawa ng auto-reply template para sa FAQs.","Mag-isip ng promo idea kasama ang AI.","Mag-post ng isang AI-made na content.","Tingnan kung alin ang may pinakamaraming views."] },
  gamer: { icon:"🎮", label:"Gamer / Creator",
    tools:[["capcut","Edit ng clips na may auto captions."],["canva","Thumbnails na pang-click."],["gemini","Ideas para sa content at titles."]],
    today:"Kunin ang best clip mo. I-edit sa CapCut na may auto captions.",
    days:["Mag-download ng CapCut at i-try ang auto captions.","Gumawa ng thumbnail sa Canva.","Humingi sa Gemini ng 10 video ideas.","Ipagawa ang title at hashtags sa AI.","Gumawa ng short clip mula sa long video.","Mag-post at tingnan ang reactions.","Gumawa ng simpleng content plan para sa susunod na linggo."] },
  office: { icon:"🏢", label:"Office Worker",
    tools:[["gemini","Tulong sa emails at Google Docs."],["chatgpt","Pang-draft ng reports at slides outline."],["grammarly","Check ng grammar bago mag-send."]],
    today:"Kunin ang isang email na mahirap isulat. Ipa-draft sa Gemini. Ikaw ang mag-final check.",
    days:["Mag-draft ng isang email gamit ang AI.","Ipa-summarize ang mahabang meeting notes.","Gumawa ng report outline sa ChatGPT.","I-check ang grammar ng doc mo sa Grammarly.","Gumawa ng formula sa spreadsheet sa tulong ng AI.","Ilista ang paulit-ulit mong tasks.","Pumili ng isang task na laging gagawin mo with AI."] }
};

const initials = n => n.replace(/[^A-Z]/g,"").slice(0,2) || n.slice(0,2);

function toolRow(t, note, sponsored){
  const bg = sponsored ? "linear-gradient(135deg,#f5b83d,#ff7aa2)" : t.color;
  return `<div class="tool"><span class="badge" style="background:${bg}">${initials(t.name)}</span>
    <div class="info"><b>${t.name}</b><small>${note}</small></div>
    <a class="try" href="${t.url}" target="_blank" rel="sponsored noopener">Subukan →</a></div>`;
}

function render(id, scroll){
  const r = ROLES[id];
  document.querySelectorAll(".role").forEach(b=>b.classList.toggle("active", b.dataset.id===id));
  const f = CONFIG.featured, key = "aisph-"+id;
  const done = JSON.parse(localStorage.getItem(key) || "[]");
  const plan = document.getElementById("plan");
  plan.innerHTML = `
    <div class="plan-head"><h2>${r.icon} Starter plan mo: ${r.label}</h2><p class="muted">Simple lang. Isang hakbang kada araw.</p></div>
    <div class="plan-grid">
      <div class="card today wide"><h3>✅ Gawin mo ngayon</h3><p>${r.today}</p></div>
      <div class="card"><h3>🧰 3 libreng AI tools</h3>${r.tools.map(t=>toolRow(CONFIG.tools[t[0]],t[1])).join("")}</div>
      <div class="card"><h3>📅 7-day path mo</h3><div class="progress"><div id="bar"></div></div>
        <ol class="timeline">${r.days.map((d,i)=>`<li class="${done.includes(i)?"done":""}"><input type="checkbox" id="d${i}" data-i="${i}" ${done.includes(i)?"checked":""}><label for="d${i}"><b>Day ${i+1}:</b> ${d}</label></li>`).join("")}</ol></div>
      <div class="card featured wide"><h3><span class="tag">Sponsored</span>Featured tool</h3>${toolRow(f, f.text, true)}</div>
    </div>`;
  const bar = () => document.getElementById("bar").style.width = (plan.querySelectorAll(".timeline input:checked").length/7*100)+"%";
  bar();
  plan.querySelectorAll(".timeline input").forEach(c=>c.onchange=()=>{
    const d=[...plan.querySelectorAll(".timeline input:checked")].map(x=>+x.dataset.i);
    localStorage.setItem(key, JSON.stringify(d)); c.closest("li").classList.toggle("done", c.checked); bar();
  });
  if (scroll) plan.scrollIntoView({behavior:"smooth", block:"start"});
}

document.getElementById("role-list").innerHTML = Object.entries(ROLES).map(([id,r])=>
  `<button class="role" data-id="${id}"><span>${r.icon}</span>${r.label}</button>`).join("");
document.querySelectorAll(".role").forEach(b=>b.onclick=()=>render(b.dataset.id, true));
if (CONFIG.showSponsorBanner){ const s=document.getElementById("sponsor-banner"); s.hidden=false; document.getElementById("sponsor-text").textContent=CONFIG.sponsorBannerText; }
render(new URLSearchParams(location.search).get("role") || "student");
