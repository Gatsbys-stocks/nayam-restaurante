/* Lógica de la página: idioma, carta, galería, reservas por WhatsApp y horario. Sin dependencias. */
(function () {
'use strict';
const { WA, MENU, STRIP, REVS, HOURS, VIDEOS, GPHOTOS, STATS } = window.NAYAM_DATA;
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

let cat = null;
function renderMenu(){
  const cats = MENU[tab], l = L_();
  if(!cat || !cats.some(c=>c.id===cat)) cat = cats[0].id;
  $$('#tabs button').forEach(b=>{ const on=b.dataset.tab===tab; b.setAttribute('aria-selected',String(on)); b.tabIndex = on?0:-1; });
  $('#tab-food').textContent = t('tabFood'); $('#tab-breakfast').textContent = t('tabBreak');
  $('#chips').innerHTML = cats.map(c=>`<button type="button" role="tab" class="mcat" data-cat="${c.id}" aria-selected="${c.id===cat}">${c.t[l]}</button>`).join('');
  const plist = (arr)=>`<ul class="plist">${arr.map(x=>`<li><span class="n">${esc(x.n[l])}${x.d?`<small>${esc(x.d[l])}</small>`:''}</span><span class="dots"></span><span class="price">${price(x.p)}</span></li>`).join('')}</ul>`;
  const c = cats.find(x=>x.id===cat);
  let body = '';
  if(c.items) body += `<div class="mlist">${c.items.map((x,i)=>`<article class="dish">
      <button type="button" class="ph" data-open="${c.id}:${i}" aria-label="${esc(x.n[l])}: ${t('zoom')}"><img src="${img(x.i)}" alt="" loading="lazy" width="560" height="420"></button>
      <div class="body"><div class="row1"><h4>${esc(x.n[l])}</h4><span class="dots"></span><span class="price">${price(x.p)}</span></div>${x.d[l]?`<p>${esc(x.d[l])}</p>`:''}</div></article>`).join('')}</div>`;
  if(c.list) body += plist(c.list);
  if(c.extra) body += `<h3 class="sub-title">${c.extra.t[l]}</h3>`+plist(c.extra.list);
  $('#menu').innerHTML = `<div role="tabpanel" aria-label="${esc(c.t[l])}">${body}</div>` + (tab==='breakfast'?`<p class="note">${t('breakNote')}</p>`:'');
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

$('#tabs').addEventListener('click',e=>{ const b=e.target.closest('[data-tab]'); if(b){ tab=b.dataset.tab; cat=null; renderMenu(); } });
$('#chips').addEventListener('click',e=>{ const b=e.target.closest('[data-cat]'); if(b){ cat=b.dataset.cat; renderMenu(); } });
$$('.moment[data-tab]').forEach(a=>a.addEventListener('click',()=>{ tab=a.dataset.tab; cat=null; renderMenu(); }));

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

/* Vídeos: un clip grande que se reproduce solo (sin sonido) al verse y miniaturas para cambiar de clip */
let ttIndex = 0, ttUserPaused = false;
const calmMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
const ttNf = () => new Intl.NumberFormat(lang==='es'?'es-ES':'en-GB',{notation:'compact',maximumFractionDigits:1});
const ttVid = () => $('#ttvideo');
const vTitle = v => v.t ? v.t[lang==='es'?0:1] : v.title;
function renderVideos(){
  const nf = ttNf();
  $('#tt').innerHTML = VIDEOS.map((v,i)=>`<button type="button" role="listitem" class="ttthumb" data-i="${i}" aria-label="${t('ttPlay')}: ${esc(vTitle(v))}" ${i===ttIndex?'aria-current="true"':''}>
    <img src="assets/img/tiktok-${v.id}.webp" alt="" loading="lazy" width="270" height="480">
    <span class="ttico" aria-hidden="true"><svg class="i" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor" stroke="none"/></svg></span>
    <span class="ttviews">${v.own?t('ttNew'):nf.format(v.views)}</span></button>`).join('');
  renderCaption(); renderSound();
  $('#ttpp').setAttribute('aria-label', ttVid().paused ? t('ttPlay') : t('ttPause'));
}
function renderCaption(){
  const v = VIDEOS[ttIndex];
  $('#ttcap').innerHTML = `${esc(vTitle(v))}` + (v.own ? '' : `<small>${ttNf().format(v.views)} ${t('ttViews')}</small>`);
  const lk = $('#ttlink'); lk.hidden = !!v.own;
  if(!v.own) lk.href = 'https://www.tiktok.com/@nayambarcelona/video/'+encodeURIComponent(v.id);
}
function renderSound(){
  const m = ttVid().muted;
  $('#ttsound').setAttribute('aria-pressed', String(!m));
  $('#ttsound').setAttribute('aria-label', m ? t('ttUnmute') : t('ttMute'));
  $('#ttwave').style.display = m ? 'none' : '';
}
function loadVideo(i, autoplay){
  ttIndex = i;
  const v = VIDEOS[i], el = ttVid();
  el.poster = 'assets/img/tiktok-'+v.id+'.webp';
  el.src = 'assets/video/'+v.id+'.mp4';
  $$('.ttthumb').forEach(b=>{ if(+b.dataset.i===i) b.setAttribute('aria-current','true'); else b.removeAttribute('aria-current'); });
  renderCaption();
  if(autoplay){ ttUserPaused = false; el.play().catch(()=>{}); }
}
function nextVideo(){ loadVideo((ttIndex+1)%VIDEOS.length, true); }
(function(){
  const el = ttVid(), frame = $('#ttframe');
  el.addEventListener('play',()=>{ frame.classList.add('playing'); $('#ttpp').setAttribute('aria-label',t('ttPause')); });
  el.addEventListener('pause',()=>{ frame.classList.remove('playing'); $('#ttpp').setAttribute('aria-label',t('ttPlay')); });
  el.addEventListener('timeupdate',()=>{ if(el.duration) $('#ttprog').style.width = (100*el.currentTime/el.duration)+'%'; });
  el.addEventListener('ended',()=>{ if(!calmMotion) nextVideo(); });
  el.addEventListener('volumechange',renderSound);
  const toggle = ()=>{ if(el.paused){ ttUserPaused=false; el.play().catch(()=>{}); } else { ttUserPaused=true; el.pause(); } };
  $('#ttpp').addEventListener('click',toggle);
  el.addEventListener('click',toggle);
  $('#ttsound').addEventListener('click',()=>{ el.muted = !el.muted; });
  $('#tt').addEventListener('click',e=>{ const b=e.target.closest('.ttthumb'); if(b) loadVideo(+b.dataset.i, true); });
  loadVideo(0,false);
  // arranca al ver el vídeo y se pausa al salir de pantalla
  if('IntersectionObserver' in window){
    new IntersectionObserver(es=>{
      es.forEach(en=>{
        if(en.isIntersecting && en.intersectionRatio>=.5){ if(!calmMotion && !ttUserPaused && el.paused) el.play().catch(()=>{}); }
        else if(!el.paused){ el.pause(); }
      });
    },{threshold:[0,.5]}).observe(frame);
  }
})();

/* Cifras: se cuentan desde 0 cuando entran en pantalla */
function statFmt(s, v){
  const o = {minimumFractionDigits:s.dec, maximumFractionDigits:s.dec};
  if(s.compact){ o.notation='compact'; o.maximumFractionDigits=1; o.minimumFractionDigits=0; }
  return new Intl.NumberFormat(lang==='es'?'es-ES':'en-GB',o).format(v);
}
function renderStats(){
  $('#statsList').innerHTML = STATS.map((s,i)=>`<li><b data-s="${i}">${statFmt(s,s.v)}</b><span>${esc(s.l[L_()])}</span></li>`).join('');
}
function countStats(){
  if(calmMotion) return;
  $$('#statsList b').forEach(b=>{
    const s = STATS[+b.dataset.s], t0 = performance.now(), dur = 1400;
    const step = now=>{ const p = Math.min(1,(now-t0)/dur), e = 1-Math.pow(1-p,3); b.textContent = statFmt(s, s.v*e); if(p<1) requestAnimationFrame(step); else b.textContent = statFmt(s, s.v); };
    requestAnimationFrame(step);
  });
}
if('IntersectionObserver' in window){
  const sio = new IntersectionObserver(es=>{ if(es.some(x=>x.isIntersecting)){ sio.disconnect(); countStats(); } },{threshold:.4});
  sio.observe($('#stats'));
}

/* Fotos de clientes de Google: cinta que se desplaza sola (se repite para el bucle) */
function renderGP(){
  const l = L_();
  const one = (g,dup)=>`<button type="button" class="gp ${g[2]}${dup?' dup':''}" data-g="${GPHOTOS.indexOf(g)}" ${dup?'aria-hidden="true" tabindex="-1"':`aria-label="${esc(g[1][l])}"`}><img src="${img(g[0])}" alt="" loading="lazy"></button>`;
  $('#track').innerHTML = GPHOTOS.map(g=>one(g,false)).join('') + GPHOTOS.map(g=>one(g,true)).join('');
}
$('#track').addEventListener('click',e=>{ const b=e.target.closest('[data-g]'); if(!b) return; const g=GPHOTOS[+b.dataset.g]; openLbSimple([g[0],g[1]]); });

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
  renderVideos(); renderGP(); renderStats(); renderMenu(); renderHours(); fillForm(); setHH();
}
$('#lang').onclick = ()=>{ lang = lang==='es'?'en':'es'; try{localStorage.setItem('nayam.lang',lang)}catch(e){} applyLang(); };
function closeNav(){ $('#mnav').hidden=true; $('#burger').setAttribute('aria-expanded','false'); setHH(); }
$('#burger').onclick = ()=>{ const o=$('#mnav').hidden; $('#mnav').hidden=!o; $('#burger').setAttribute('aria-expanded',String(o)); setHH(); };
function setHH(){ document.documentElement.style.setProperty('--hh', $('#top').offsetHeight+'px'); }
addEventListener('resize',setHH);
if(document.fonts&&document.fonts.ready) document.fonts.ready.then(setHH);
applyLang();

/* Enlaces directos: #carta abre la carta de comida y #desayunos abre los desayunos (los usa el QR de las mesas) */
function openFromHash(first){
  const h = location.hash;
  if(h!=='#desayunos' && h!=='#breakfast' && h!=='#carta') return;
  tab = (h==='#carta') ? 'food' : 'breakfast'; cat = null; renderMenu();
  const el = $('#carta'); if(el) el.scrollIntoView({behavior:first?'instant':'smooth',block:'start'});
}
window.addEventListener('hashchange',()=>openFromHash(false));
openFromHash(true);

/* Animaciones: presentación de fotos en la portada y aparición suave al hacer scroll */
(function(){
  const calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(calm) return;
  const imgs = $$('#slides img');
  if(imgs.length>1){
    let k = 0;
    setInterval(()=>{
      if(document.hidden) return;
      imgs[k].classList.remove('on'); k = (k+1)%imgs.length;
      const n = imgs[k]; n.style.animation='none'; void n.offsetWidth; n.style.animation=''; n.classList.add('on');
    }, 6500);
  }
  if(!('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('js-anim');
  const els = $$('.head,.stats,.marquee,.moment,.card,.room figure,.facade,.revs,.ttwrap,.rate,.about,.bookgrid');
  const io = new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('is-in'); io.unobserve(e.target); } }),{rootMargin:'0px 0px -8% 0px',threshold:.05});
  els.forEach(el=>{ el.classList.add('reveal'); const sib=[...el.parentElement.children].indexOf(el); el.style.transitionDelay=(Math.min(sib,4)*70)+'ms'; io.observe(el); });
})();

/* Tarjetas con vídeo (Desayunos y brunch, Café y buen ambiente): se mueven al verse; quietas con «reducir movimiento» o «ahorro de datos» */
(function(){
  const vs = $$('.mvid'); if(!vs.length) return;
  const calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saver = navigator.connection && navigator.connection.saveData;
  if(calm || saver || !('IntersectionObserver' in window)) return;
  vs.forEach(v=>v.addEventListener('playing',()=>v.classList.add('on')));
  const io = new IntersectionObserver(es=>es.forEach(en=>{
    const v = en.target;
    if(en.isIntersecting){ v.play().catch(()=>{}); } else if(!v.paused){ v.pause(); }
  }),{threshold:.3});
  vs.forEach(v=>io.observe(v));
})();

/* Portada: el vídeo del local sustituye al pase de fotos (se queda el pase de fotos con «reducir movimiento» o «ahorro de datos») */
(function(){
  const v = $('#heroVideo'), hero = $('.hero'), btn = $('#heroPause'); if(!v||!hero) return;
  const calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saver = navigator.connection && navigator.connection.saveData;
  if(calm || saver){ btn.hidden = true; v.remove(); return; }
  let userPaused = false;
  const icon = ()=>{ $('#heroPauseIcon').setAttribute('d', v.paused ? 'M8 5v14l11-7z' : 'M8 5v14M16 5v14'); btn.setAttribute('aria-pressed', String(v.paused)); btn.setAttribute('aria-label', v.paused ? t('heroPlay') : t('heroPause')); };
  v.addEventListener('playing',()=>{ v.classList.add('on'); hero.classList.add('vid'); icon(); });
  v.addEventListener('pause',icon);
  btn.addEventListener('click',()=>{ if(v.paused){ userPaused=false; v.play().catch(()=>{}); } else { userPaused=true; v.pause(); } });
  const start = ()=>{
    if(!v.src){ v.src = window.matchMedia('(max-width: 760px)').matches ? 'assets/video/hero-reel-m.mp4' : 'assets/video/hero-reel.mp4'; }
    if(!userPaused) v.play().catch(()=>{});
  };
  if(document.readyState==='complete') setTimeout(start,200); else window.addEventListener('load',()=>setTimeout(start,200));
  if('IntersectionObserver' in window){
    new IntersectionObserver(es=>es.forEach(en=>{ if(en.isIntersecting){ if(v.src) start(); } else if(!v.paused){ v.pause(); } }),{threshold:.1}).observe(hero);
  }
  icon();
})();
})();
