const LAG_FONT_SOURCES = {
  'Cormorant Garamond': 'Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400',
  'Bodoni Moda': 'Bodoni+Moda:opsz,wght@6..96,400;6..96,500;6..96,600',
  'Playfair Display': 'Playfair+Display:wght@400;500;600',
  'Libre Baskerville': 'Libre+Baskerville:wght@400;700',
  'DM Sans': 'DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600',
  'Manrope': 'Manrope:wght@300;400;500;600',
  'Montserrat': 'Montserrat:wght@300;400;500;600',
  'Inter': 'Inter:wght@300;400;500;600'
};
function lagLoadFonts(names=[]){
  const unique=[...new Set(names.filter(Boolean))];
  const families=unique.map(n=>LAG_FONT_SOURCES[n]).filter(Boolean);
  if(!families.length)return;
  let link=document.getElementById('lag-google-fonts');
  if(!link){link=document.createElement('link');link.id='lag-google-fonts';link.rel='stylesheet';document.head.appendChild(link);}
  link.href='https://fonts.googleapis.com/css2?'+families.map(f=>'family='+f).join('&')+'&display=swap';
}
function lagApplyDesign(d={}){
  lagLoadFonts([d.display_font,d.body_font]);
  const r=document.documentElement.style;
  const n=(v,f)=>Number.isFinite(Number(v))?Number(v):f;
  r.setProperty('--display-font',`"${d.display_font||'Cormorant Garamond'}", Georgia, serif`);
  r.setProperty('--body-font',`"${d.body_font||'Inter'}", Arial, Helvetica, sans-serif`);
  r.setProperty('--logo-width',`${n(d.logo_width_desktop,220)}px`);
  r.setProperty('--logo-height',`${n(d.logo_height_desktop,140)}px`);
  r.setProperty('--logo-width-mobile',`${n(d.logo_width_mobile,110)}px`);
  r.setProperty('--logo-height-mobile',`${n(d.logo_height_mobile,80)}px`);
  r.setProperty('--hero-title-max',`${n(d.hero_title_max_px,128)}px`);
  r.setProperty('--section-title-max',`${n(d.section_title_max_px,74)}px`);
  r.setProperty('--service-title-max',`${n(d.service_title_max_px,42)}px`);
  r.setProperty('--body-size',`${n(d.body_font_size_px,15)}px`);
  r.setProperty('--hero-description-size',`${n(d.hero_description_size_px,14)}px`);
  r.setProperty('--nav-size',`${n(d.nav_font_size_px,10)}px`);
  r.setProperty('--meta-size',`${n(d.meta_font_size_px,10)}px`);
}
async function lagFetchDesign(stamp=Date.now()){
  try{
    const r=await fetch(`data/design.json?v=${stamp}`);
    if(!r.ok)throw new Error('design.json');
    const d=await r.json(); lagApplyDesign(d); return d;
  }catch(e){console.warn('LAG design settings could not load:',e);lagApplyDesign({});return {};}
}
