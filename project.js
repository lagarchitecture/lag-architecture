let lang=localStorage.getItem('lag-lang')||'tr',siteData=null,project=null;
const $=id=>document.getElementById(id);
const esc=s=>String(s||'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
function render(){
  document.documentElement.lang=lang;
  $('lang').textContent=lang==='tr'?'TR / EN':'EN / TR';
  $('nav-projects').textContent=lang==='tr'?'PROJELER':'PROJECTS'; $('nav-studio').textContent=lang==='tr'?'STÜDYO':'STUDIO'; $('nav-contact').textContent=lang==='tr'?'İLETİŞİM':'CONTACT';
  $('project-label').textContent=lang==='tr'?'PROJE':'PROJECT'; $('about-label').textContent=lang==='tr'?'PROJE HAKKINDA':'ABOUT THE PROJECT'; $('back-link').textContent=lang==='tr'?'← TÜM PROJELER':'← ALL PROJECTS';
  if(siteData){$('site-logo').src=siteData.logo||'assets/logo.png';$('footer-tagline').textContent=siteData.footer_tagline||'';}
  if(!project)return;
  const title=project[`title_${lang}`]||project.title_tr||'';
  document.title=`${title} — LAG Architecture`;
  $('project-title').textContent=title;
  $('project-facts').innerHTML=[project[`location_${lang}`]||project.location_tr,project.year,project[`category_${lang}`]||project.category_tr].filter(Boolean).map(x=>`<span>${esc(x)}</span>`).join('');
  $('project-cover').src=project.cover||'';$('project-cover').alt=title;
  $('project-summary').textContent=project[`summary_${lang}`]||project.summary_tr||'';
  $('project-description').textContent=project[`description_${lang}`]||project.description_tr||'';
  const gallery=(project.gallery&&project.gallery.length?project.gallery:[project.cover]).filter(Boolean);
  const layouts=Array.isArray(project.gallery_layout)?project.gallery_layout:[];
  const allowedSize=new Set(['full','large','medium','small','pair']);
  const allowedAlign=new Set(['left','center','right']);
  $('project-gallery').innerHTML=gallery.map((src,i)=>{
    const cfg=layouts[i]||{};
    const size=allowedSize.has(cfg.size)?cfg.size:(i%3===0?'full':'pair');
    const align=allowedAlign.has(cfg.align)?cfg.align:'center';
    const caption=cfg[`caption_${lang}`]||cfg.caption_tr||'';
    return `<figure class="gallery-item size-${size} align-${align}"><img src="${esc(src)}" alt="${esc(title)}${i?` ${i+1}`:''}" loading="lazy">${caption?`<figcaption>${esc(caption)}</figcaption>`:''}</figure>`;
  }).join('');
}
async function load(){
  try{
    const slug=new URLSearchParams(location.search).get('project'); const stamp=Date.now();
    const designPromise=lagFetchDesign(stamp);
    const [site,projects]=await Promise.all([fetch(`data/site.json?v=${stamp}`).then(r=>r.json()),fetch(`data/projects.json?v=${stamp}`).then(r=>r.json())]);
    await designPromise;
    siteData=site; project=projects.find(p=>p.slug===slug&&p.published!==false);
    if(!project){$('not-found').hidden=false;return;}
    $('project-content').hidden=false; render();
  }catch(e){console.error(e);$('not-found').hidden=false;}
}
$('lang').addEventListener('click',()=>{lang=lang==='tr'?'en':'tr';localStorage.setItem('lag-lang',lang);render();});
load();
