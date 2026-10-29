/* Página del QR de las mesas: idioma, "abierto ahora" y enlace de WhatsApp. Usa el horario de js/data.js. */
(function () {
'use strict';
const { HOURS } = window.NAYAM_DATA;
const T = {
  es:{sub:'Restaurant · Poblenou, Barcelona',ask:'¿Qué te apetece?',
    bTag:'Desde 08:00',bTitle:'Desayunos',bText:'Marroquí, francés, español y tostadas',
    fTag:'Comida y cena',fTitle:'Carta',fText:'Burgers, pasta, carnes, pizzas y postres',
    book:'Reservar por WhatsApp',viewWeb:'Ver la web',map:'Cómo llegar',ig:'Instagram',tt:'TikTok',rev:'Déjanos tu reseña',
    open:'Abierto ahora · hasta las ',closed:'Cerrado ahora · abre a las ',
    wa:'¡Hola Nayam! Quiero reservar una mesa.\nNombre: \nDía y hora: \nNº de personas: '},
  en:{sub:'Restaurant · Poblenou, Barcelona',ask:'What are you in the mood for?',
    bTag:'From 08:00',bTitle:'Breakfast',bText:'Moroccan, French, Spanish and toasts',
    fTag:'Lunch & dinner',fTitle:'Menu',fText:'Burgers, pasta, meats, pizzas and desserts',
    book:'Book on WhatsApp',viewWeb:'See the website',map:'Directions',ig:'Instagram',tt:'TikTok',rev:'Leave us a review',
    open:'Open now · until ',closed:'Closed now · opens at ',
    wa:'Hello Nayam! I would like to book a table.\nName: \nDay and time: \nNumber of people: '}
};
const $ = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
let lang = (navigator.language||'es').toLowerCase().startsWith('en') ? 'en' : 'es';
try{ lang = localStorage.getItem('nayam.lang') || lang; }catch(e){}
const t = k => T[lang][k];

function hm(s){ const [h,m]=s.split(':').map(Number); return h*60+m; }
function renderStatus(){
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Madrid',weekday:'short',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date()).map(x=>[x.type,x.value]));
  const today = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].indexOf(p.weekday);
  const m = (+p.hour)*60+(+p.minute), h = HOURS[today], o = hm(h[0]);
  let c = hm(h[1]); if(c<=o) c += 1440;
  const prev = HOURS[(today+6)%7], pc = hm(prev[1]);
  const fromPrev = pc<=hm(prev[0]) && m<pc && pc>0;
  const isOpen = fromPrev || (m>=o && m<c);
  const st = $('#status'); st.hidden = false; st.classList.toggle('closed',!isOpen);
  $('span',st).textContent = isOpen ? t('open')+(fromPrev?prev[1]:h[1]) : t('closed')+(m<o?h[0]:HOURS[(today+1)%7][0]);
}
function apply(){
  document.documentElement.lang = lang;
  $$('[data-i18n]').forEach(el=>el.textContent = t(el.dataset.i18n));
  $('#lang').textContent = lang==='es' ? 'EN' : 'ES';
  $('#wa').href = 'https://wa.me/34673327809?text='+encodeURIComponent(t('wa'));
  renderStatus();
}
$('#lang').addEventListener('click',()=>{ lang = lang==='es'?'en':'es'; try{localStorage.setItem('nayam.lang',lang)}catch(e){} apply(); });
apply();

/* Fondo: el vídeo del local (si el visitante no pide «reducir movimiento» ni «ahorro de datos») */
(function(){
  const v = $('#bgvid'); if(!v) return;
  const calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saver = navigator.connection && navigator.connection.saveData;
  if(calm || saver){ v.remove(); return; }
  v.defaultPlaybackRate = 0.5; v.playbackRate = 0.5;   // el vídeo de fondo va a media velocidad
  v.addEventListener('playing',()=>v.classList.add('on'));
  const go = ()=>{ v.src = window.matchMedia('(max-width: 760px)').matches ? '../assets/video/hero-reel-m.mp4' : '../assets/video/hero-reel.mp4'; v.play().catch(()=>{}); };
  if(document.readyState==='complete') setTimeout(go,150); else window.addEventListener('load',()=>setTimeout(go,150));
})();

/* El vídeo de la tarjeta Desayunos se reproduce en bucle y sin sonido (no con «reducir movimiento» ni «ahorro de datos») */
(function(){
  const vs = $$('.cvid'); if(!vs.length) return;
  const calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saver = navigator.connection && navigator.connection.saveData;
  if(calm || saver) return;
  vs.forEach(v=>{ v.defaultPlaybackRate = 0.7; v.playbackRate = 0.7; v.addEventListener('playing',()=>v.classList.add('on')); });
  const go = ()=>vs.forEach(v=>v.play().catch(()=>{}));
  if(document.readyState==='complete') go(); else window.addEventListener('load',go);
})();

/* NAYAM aparece letra a letra (si el visitante no pide reducir movimiento) */
(function(){
  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const h = $('.brand h1'); if(!h) return;
  const txt = h.textContent; h.setAttribute('aria-label',txt); h.textContent = '';
  [...txt].forEach((c,i)=>{ const s=document.createElement('span'); s.className='ch'; s.setAttribute('aria-hidden','true'); s.textContent=c; s.style.setProperty('--i',i); h.appendChild(s); });
})();
})();
