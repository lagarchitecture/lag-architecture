const translations={
  tr:{nav_projects:'PROJELER',nav_studio:'STÜDYO',nav_services:'HİZMETLER',nav_contact:'İLETİŞİM',selected_projects:'01 — SEÇİLİ PROJELER',studio_label:'02 — STÜDYO',services_label:'03 — HİZMETLER',contact_label:'04 — İLETİŞİM'},
  en:{nav_projects:'PROJECTS',nav_studio:'STUDIO',nav_services:'SERVICES',nav_contact:'CONTACT',selected_projects:'01 — SELECTED PROJECTS',studio_label:'02 — STUDIO',services_label:'03 — SERVICES',contact_label:'04 — CONTACT'}
};
let lang=localStorage.getItem('lag-lang')||'tr';
let siteData=null,projectsData=[];
const $=id=>document.getElementById(id);
const htmlLines=value=>(value||'').replace(/\n/g,'<br>');

function render(){
  document.documentElement.lang=lang;
  document.querySelectorAll('[data-i18n]').forEach(el=>{el.textContent=translations[lang][el.dataset.i18n]||el.textContent});
  const b=$('lang'); if(b)b.textContent=lang==='tr'?'TR / EN':'EN / TR';
  if(!siteData)return;
  $('site-logo').src=siteData.logo||'assets/logo.png';
  $('hero').style.backgroundImage=`url("${siteData.hero_image||'assets/iqvia.jpg'}")`;
  $('hero-kicker').textContent=siteData[`hero_kicker_${lang}`]||'';
  $('hero-title').innerHTML=htmlLines(siteData[`hero_title_${lang}`]||'');
  $('hero-description').textContent=siteData[`hero_description_${lang}`]||'';
  $('projects-location').textContent=siteData[`projects_location_${lang}`]||'';
  $('studio-heading').textContent=siteData[`studio_heading_${lang}`]||'';
  $('studio-body-1').textContent=siteData[`studio_body_1_${lang}`]||'';
  $('studio-body-2').textContent=siteData[`studio_body_2_${lang}`]||'';
  $('services-list').innerHTML=(siteData.services||[]).map(s=>`<div class="service">${escapeHtml(s[lang]||s.tr||'')}</div>`).join('');
  $('contact-heading').textContent=siteData[`contact_heading_${lang}`]||'';
  $('contact-intro').textContent=siteData[`contact_intro_${lang}`]||'';
  $('contact-email').textContent=siteData.email||''; $('contact-email').href=`mailto:${siteData.email||''}`;
  $('contact-location').textContent=siteData[`location_${lang}`]||'';
  $('footer-tagline').textContent=siteData.footer_tagline||'';
  if(siteData.phone){$('contact-phone-wrap').hidden=false;$('contact-phone').textContent=siteData.phone;$('contact-phone').href=`tel:${siteData.phone.replace(/\s/g,'')}`;}else $('contact-phone-wrap').hidden=true;
  if(siteData.instagram){$('contact-instagram-wrap').hidden=false;$('contact-instagram').href=siteData.instagram;}else $('contact-instagram-wrap').hidden=true;
  renderProjects();
}
function escapeHtml(s=''){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function renderProjects(){
  const grid=$('projects-grid'); if(!grid)return;
  grid.innerHTML=projectsData.filter(p=>p.published!==false).map(p=>{
    const title=p[`title_${lang}`]||p.title_tr||'';
    const cat=p[`category_${lang}`]||p.category_tr||'';
    const meta=[cat,p.year].filter(Boolean).join(' · ');
    return `<a class="project" href="project.html?project=${encodeURIComponent(p.slug)}"><figure><img src="${escapeHtml(p.cover||'')}" alt="${escapeHtml(title)}"></figure><div class="meta"><span>${escapeHtml(title)}</span><span>${escapeHtml(meta)}</span></div></a>`;
  }).join('');
}
async function load(){
  try{
    const stamp=Date.now();
    const designPromise=lagFetchDesign(stamp);
    [siteData,projectsData]=await Promise.all([
      fetch(`data/site.json?v=${stamp}`).then(r=>{if(!r.ok)throw new Error('site.json');return r.json()}),
      fetch(`data/projects.json?v=${stamp}`).then(r=>{if(!r.ok)throw new Error('projects.json');return r.json()})
    ]);
    await designPromise;
    render();
  }catch(e){console.error('LAG content load error:',e);}
}
$('lang').addEventListener('click',()=>{lang=lang==='tr'?'en':'tr';localStorage.setItem('lag-lang',lang);render();});
load();
