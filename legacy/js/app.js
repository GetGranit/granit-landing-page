// ═══ STATE ═══
let discSector = 'all';
let discCat = 'all';
let discVisible = 10;

// ═══ RENDER ═══
function renderDiscover(){
  // Sidebar
  let sb='<div class="disc-sb-title">'+(LANG==='fr'?'Secteur':'Sector')+'</div>';
  sectors.forEach(s=>{sb+=`<div class="disc-tag ${discSector===s.id?'act':''}" onclick="setDiscFilter('${s.id}',null)">${s.icon?s.icon+' ':''}${s[LANG]}</div>`});
  sb+='<div class="disc-sb-title">'+(LANG==='fr'?'Type':'Type')+'</div>';
  ucTypes.forEach(u=>{sb+=`<div class="disc-tag ${discCat===u.id?'act':''}" onclick="setDiscFilter(null,'${u.id}')">${u[LANG]}</div>`});
  document.getElementById('discSidebar').innerHTML=sb;

  // Filter agents
  let filtered=agents;
  if(discSector!=='all')filtered=filtered.filter(a=>a.sector===discSector);
  if(discCat!=='all')filtered=filtered.filter(a=>a.cat===discCat);

  document.getElementById('discCount').innerHTML=`${filtered.length} agents`;

  const visible=filtered.slice(0,discVisible);
  const sf=LANG==='fr'?'sf':'se', cf=LANG==='fr'?'cf':'ce';
  document.getElementById('discGrid').innerHTML=visible.map(a=>`<div class="ag"><div class="ag-top"><div class="ag-name">${a.n[LANG]}</div><span class="ag-sector" style="background:${a.c};color:${a.tc}">${a[cf]}</span></div><div class="ag-desc">${a.d[LANG]}</div><div class="ag-foot"><span class="ag-mi">${a.m}</span><span class="ag-badge">${a.icon} ${a[sf]}</span><span class="ag-by"><span class="ag-by-dot">G</span> by Granit</span></div></div>`).join('');

  document.getElementById('loadMore').style.display=discVisible<filtered.length?'block':'none';
}

function setDiscFilter(sector,cat){
  if(sector!==null)discSector=sector;
  if(cat!==null)discCat=cat;
  discVisible=10;
  renderDiscover();
}

function loadMoreAgents(){discVisible+=10;renderDiscover()}

// ═══ NAV ═══
const pageTitles = {
  home: {fr:'Granit - Vos équipes soignent. Granit gère le reste.', en:'Granit - Your teams care. Granit handles the rest.'},
  discover: {fr:'Nos agents IA - Granit', en:'Our AI agents - Granit'},
};

function go(page,param){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('page-'+page).classList.add('active');
  document.querySelectorAll('.na').forEach(a=>a.classList.remove('act'));
  const navPage=document.querySelector(`.na[data-page="${page}"]`);
  if(navPage)navPage.classList.add('act');
  window.scrollTo(0,0);
  document.title=pageTitles[page]?.[LANG]||pageTitles.home[LANG];
  if(page==='discover'){if(param)discSector=param;else{discSector='all';discCat='all'}discVisible=10;renderDiscover()}
}

function goDemo(){
  const isHome=document.getElementById('page-home').classList.contains('active');
  if(!isHome){
    go('home');
    setTimeout(()=>document.getElementById('demo').scrollIntoView({behavior:'smooth'}),80);
  } else {
    document.getElementById('demo').scrollIntoView({behavior:'smooth'});
  }
}

async function submitDemo(e){
  e.preventDefault();
  const form=document.getElementById('demoForm');
  const btn=form.querySelector('.form-submit');
  btn.disabled=true;
  const data=Object.fromEntries(new FormData(form));
  data.lang=LANG;
  try{
    const res=await fetch('/api/demo',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
    if(!res.ok)throw new Error('server');
    form.style.display='none';
    document.getElementById('formSuccess').style.display='block';
  }catch{
    btn.disabled=false;
    alert(T['alert.error'][LANG]);
  }
}

// ═══ LANG SWITCH HIGHLIGHT ═══
(function(){
  const el=document.getElementById(LANG==='en'?'langEn':'langFr');
  if(el)el.classList.add('active');
})();
