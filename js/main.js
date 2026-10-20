/* Lógica de la página: idioma, carta, galería, reservas por WhatsApp y horario. Sin dependencias. */
(function () {
'use strict';
const { WA, MENU, STRIP, REVS, HOURS } = window.NAYAM_DATA;
const T = window.NAYAM_I18N;
const IC = {
  ig:'<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".8" fill="currentColor"/>',
  tt:'<path d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5M14 4c.4 2.4 2 4 4.5 4.2"/>',
  fb:'<path d="M14 8h2.2V4H13.5A3.5 3.5 0 0 0 10 7.5V10H8v4h2v6h4v-6h2.2l.8-4H14V8z"/>',
  x:'<path d="M5 4l14 16M19 4L5 20"/>',wa:'<path d="M4 20l1.3-4A8 8 0 1 1 8 18.7L4 20z"/>'};
const svg = n => '<svg class="i" viewBox="0 0 24 24" aria-hidden="true">'+IC[n]+'</svg>';
const $ = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>[...r.querySelectorAll(s)];

let lang = (navigator.language||'es').toLowerCase().startsWith('en') ? 'en' : 'es';
try{ lang = localStorage.getItem('nayam.lang') || lang; }catch(e){}
let tab = 'food';
const L_ = () => lang==='es' ? 0 : 1;
const t = k => T[lang][k];
const money = n => new Intl.NumberFormat(lang==='es'?'es-ES':'en-GB',{style:'currency',currency:'EUR'}).format(n);
const price = p => Array.isArray(p) ? p.map(money).join(' / ') : money(p);
const esc = s => String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const img = (n,s='s') => 'assets/img/'+n+'-'+s+'.webp';

function renderMenu(){
  const cats = MENU[tab], l = L_();
  $$('#tabs button').forEach(b=>{ const on=b.dataset.tab===tab; b.setAttribute('aria-selected',String(on)); b.tabIndex = on?0:-1; });
  $('#tab-food').textContent = t('tabFood'); $('#tab-breakfast').textContent = t('tabBreak');
  $('#chips').innerHTML = cats.map((c,i)=>`<a class="cchip" href="#c-${c.id}" data-cat="${c.id}" ${i===0?'aria-current="true"':''}>${c.t[l]}</a>`).join('');
  const plist = (arr)=>`<ul class="plist">${arr.map(x=>`<li><span class="n">${esc(x.n[l])}${x.d?`<small>${esc(x.d[l])}</small>`:''}</span><span class="dots"></span><span class="price">${price(x.p)}</span></li>`).join('')}</ul>`;
  $('#menu').innerHTML = cats.map(c=>{
    let body = '';
    if(c.items) body += `<div class="items">${c.items.map((x,i)=>{
      const inner = `<span class="ph"><img src="${img(x.i)}" alt="" loading="lazy" width="560" height="420"></span>
        <span class="tx"><span class="row1"><h4>${esc(x.n[l])}</h4><span class="price">${price(x.p)}</span></span>${x.d[l]?`<p>${esc(x.d[l])}</p>`:''}</span>`;
      return `<button type="button" class="item" data-open="${c.id}:${i}" aria-label="${esc(x.n[l])}, ${price(x.p)}">${inner}</button>`;}).join('')}</div>`;
    if(c.list) body += plist(c.list);
    if(c.extra) body += `<h3 class="sub-title">${c.extra.t[l]}</h3>`+plist(c.extra.list);
    return `<div class="cat" id="c-${c.id}"><h3>${c.t[l]}</h3>${body}</div>`;
  }).join('') + (tab==='breakfast'?`<p class="note">${t('breakNote')}</p>`:'');
  watchCats();
}
const findItem = key => { const [cid,i]=key.split(':'); const c=MENU[tab].find(x=>x.id===cid); return c.items[+i]; };
function openLb(x){
  const l=L_(); $('#lbi').src=img(x.i,'l'); $('#lbi').alt=x.n[l]; $('#lbn').textContent=x.n[l]; $('#lbd').textContent=x.d[l]||''; $('#lbp').textContent=price(x.p);
  $('#lb').hidden=false; document.body.classList.add('lock'); lastFocus=document.activeElement; $('#lbx').focus();
}
let lastFocus=null;
function closeLb(){ $('#lb').hidden=true; document.body.classList.remove('lock'); if(lastFocus&&lastFocus.focus) lastFocus.focus(); }
$('#menu').addEventListener('click',e=>{ const b=e.target.closest('[data-open]'); if(b) openLb(findItem(b.dataset.open)); });
$('#strip').addEventListener('click',e=>{ const b=e.target.closest('[data-strip]'); if(!b) return; const s=STRIP[+b.dataset.strip]; const x={i:s[0],n:s[1],d:['',''],p:null}; openLbSimple(s); });
function openLbSimple(s){ const l=L_(); $('#lbi').src=img(s[0],'l'); $('#lbi').alt=s[1][l]; $('#lbn').textContent=s[1][l]; $('#lbd').textContent=''; $('#lbp').textContent=''; $('#lb').hidden=false; document.body.classList.add('lock'); lastFocus=document.activeElement; $('#lbx').focus(); }
$('#lbx').onclick = closeLb;
$('#lb').addEventListener('click',e=>{ if(e.target.id==='lb') closeLb(); });
document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ if(!$('#lb').hidden) closeLb(); else closeNav(); } });

$('#tabs').addEventListener('click',e=>{ const b=e.target.closest('[data-tab]'); if(b){ tab=b.dataset.tab; renderMenu(); } });
$$('.moment[data-tab]').forEach(a=>a.addEventListener('click',()=>{ tab=a.dataset.tab; renderMenu(); }));

let io;
function watchCats(){
  if(io) io.disconnect();
  if(!('IntersectionObserver' in window)) return;
  io = new IntersectionObserver(es=>{
    es.forEach(en=>{ if(en.isIntersecting){ const id=en.target.id.slice(2);
      $$('.cchip').forEach(c=>c.setAttribute('aria-current',String(c.dataset.cat===id)));
      const a=$('.cchip[aria-current="true"]'); if(a) $('#chips').scrollTo({left:a.offsetLeft-16,behavior:'smooth'}); } });
  },{rootMargin:'-30% 0px -60% 0px'});
  $$('.cat').forEach(c=>io.observe(c));
}

/* WhatsApp booking */
function waUrl(){
  const m=t('waMsg'), n=$('#fName').value.trim(), d=$('#fDate').value, tm=$('#fTime').value, p=$('#fPeople').value;
  let day=''; if(d){ const [y,mo,da]=d.split('-'); day=`${da}/${mo}/${y}`; }
  const txt = [m[0], m[1]+n, m[2]+[day,tm].filter(Boolean).join(' '), m[3]+p].join('\n');
  return 'https://wa.me/'+WA+'?text='+encodeURIComponent(txt);
}
function fillForm(){
  const tm=$('#fTime'), pp=$('#fPeople'), keepT=tm.value, keepP=pp.value;
  let opts=''; for(let h=8;h<=23;h++) for(const m of ['00','30']){ const v=String(h).padStart(2,'0')+':'+m; opts+=`<option>${v}</option>`; }
  tm.innerHTML=opts; tm.value = keepT || '14:00';
  let po=''; for(let i=1;i<=12;i++) po+=`<option value="${i}">${i} ${i===1?t('person')[0]:t('person')[1]}</option>`;
  pp.innerHTML=po; pp.value = keepP || '2';
  const d=$('#fDate'); const today=new Date(); const iso=new Date(today.getTime()-today.getTimezoneOffset()*60000).toISOString().slice(0,10); d.min=iso; if(!d.value) d.value=iso;
  updWa();
}
function updWa(){ $('#wa').href = waUrl(); }
['fName','fDate','fTime','fPeople'].forEach(id=>$('#'+id).addEventListener('input',updWa));

/* hours + open now */
function hm(s){const [h,m]=s.split(':').map(Number);return h*60+m}
function renderHours(){
  const parts=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Madrid',weekday:'short',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date()).map(x=>[x.type,x.value]));
  const today=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].indexOf(parts.weekday);
  $('#hours').innerHTML = HOURS.map((h,i)=>`<tr class="${i===today?'today':''}"><th scope="row">${t('days')[i]}</th><td>${h[0]} – ${h[1]}</td></tr>`).join('');
  const m=(+parts.hour)*60+(+parts.minute), h=HOURS[today], o=hm(h[0]); let c=hm(h[1]); if(c<=o) c+=1440;
  const prev=HOURS[(today+6)%7], pc=hm(prev[1]); // closing after midnight spills into today
  const openFromPrev = pc<=hm(prev[0]) && m<pc && pc>0;
  const isOpen = openFromPrev || (m>=o && m<c);
  const st=$('#status'); st.hidden=false; st.classList.toggle('closed',!isOpen);
  $('span',st).textContent = isOpen ? t('open')+(openFromPrev?prev[1]:h[1]) : t('closed')+(m<o?h[0]:HOURS[(today+1)%7][0]);
}

function applyLang(){
  document.documentElement.lang = lang;
  $$('[data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n));
  $$('[data-alt]').forEach(el=>el.alt=t(el.dataset.alt));
  $('#lang').textContent = lang==='es'?'EN':'ES';
  $('#bookTop').textContent = t('book');
  const nav=t('nav'); $('#nav').innerHTML = nav.map(n=>`<a href="${n[0]}">${n[1]}</a>`).join('');
  $('#mnavLinks').innerHTML = nav.map(n=>`<a href="${n[0]}">${n[1]}</a>`).join('');
  $$('#mnavLinks a').forEach(a=>a.addEventListener('click',closeNav));
  const waHref = 'https://wa.me/'+WA+'?text='+encodeURIComponent(t('waMsg')[0]);
  const hb=$('#heroBook'); hb.href=waHref; hb.innerHTML=svg('wa')+t('bookLong');
  $('#wa').innerHTML = svg('wa')+t('bookLong');
  $('#lbx').setAttribute('aria-label',t('close'));
  $('#strip').innerHTML = STRIP.map((s,i)=>`<button type="button" data-strip="${i}" aria-label="${esc(s[1][L_()])}"><img src="${img(s[0])}" alt="" loading="lazy" width="560" height="420"><span>${esc(s[1][L_()])}</span></button>`).join('');
  $('#revs').innerHTML = REVS.map(r=>`<figure class="rev"><div class="stars" aria-hidden="true">★★★★★</div><p>“${esc(r[1].trim())}”</p><figcaption class="who"><span class="av" aria-hidden="true">${esc(r[0][0])}</span><span><b>${esc(r[0])}</b>${t('revSrc')}</span></figcaption></figure>`).join('');
  $('#soc').innerHTML = [['https://www.instagram.com/nayambarcelona','Instagram','ig'],['https://www.tiktok.com/@nayambarcelona','TikTok','tt'],['https://www.facebook.com/nayambarcelona','Facebook','fb'],['https://x.com/nayambarcelona','X','x']]
    .map(s=>`<a href="${s[0]}" target="_blank" rel="noopener" aria-label="${s[1]}">${svg(s[2])}</a>`).join('');
  renderMenu(); renderHours(); fillForm(); setHH();
}
$('#lang').onclick = ()=>{ lang = lang==='es'?'en':'es'; try{localStorage.setItem('nayam.lang',lang)}catch(e){} applyLang(); };
function closeNav(){ $('#mnav').hidden=true; $('#burger').setAttribute('aria-expanded','false'); setHH(); }
$('#burger').onclick = ()=>{ const o=$('#mnav').hidden; $('#mnav').hidden=!o; $('#burger').setAttribute('aria-expanded',String(o)); setHH(); };
function setHH(){ document.documentElement.style.setProperty('--hh', $('#top').offsetHeight+'px'); }
addEventListener('resize',setHH);
if(document.fonts&&document.fonts.ready) document.fonts.ready.then(setHH);
applyLang();
})();
