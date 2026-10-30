/* Aviso informativo de cookies. La web no usa cookies: el aviso lo explica y enlaza a la política de privacidad.
   Al pulsar «Entendido» se guarda esa elección en el navegador (nayam.cookies) para no volver a mostrarlo. */
(function () {
'use strict';
const KEY = 'nayam.cookies';
const me = document.currentScript;
const policy = (me && me.dataset.policy) || 'privacidad/#cookies';
const T = {
  es:{title:'Esta web no usa cookies',text:'Solo recordamos tu idioma en tu dispositivo y medimos las visitas sin cookies ni datos personales. Aquí tienes los detalles.',ok:'Entendido',more:'Más información',label:'Aviso de cookies'},
  en:{title:'This website does not use cookies',text:'We only remember your language on your device and we count visits without cookies or personal data. Here are the details.',ok:'Got it',more:'More information',label:'Cookie notice'}
};
let seen = false;
try{ seen = localStorage.getItem(KEY) === '1'; }catch(e){}
if(seen) return;

const L = () => ((document.documentElement.lang||'es').toLowerCase().startsWith('en')) ? 'en' : 'es';
const box = document.createElement('div');
box.className = 'ckn'; box.setAttribute('role','region');
box.innerHTML = '<div class="ckn-tx"><b class="ckn-t"></b><p class="ckn-p"></p></div><div class="ckn-bt"><a class="ckn-more" href=""></a><button type="button" class="ckn-ok"></button></div>';
const fill = () => { const t = T[L()]; box.setAttribute('aria-label',t.label); box.querySelector('.ckn-t').textContent = t.title; box.querySelector('.ckn-p').textContent = t.text;
  const a = box.querySelector('.ckn-more'); a.textContent = t.more; a.href = policy; box.querySelector('.ckn-ok').textContent = t.ok; };
fill();
box.querySelector('.ckn-ok').addEventListener('click',()=>{
  try{ localStorage.setItem(KEY,'1'); }catch(e){}
  box.classList.add('out'); setTimeout(()=>box.remove(),350);
});
new MutationObserver(fill).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
const show = () => { document.body.appendChild(box); requestAnimationFrame(()=>box.classList.add('in')); };
if(document.readyState==='complete') setTimeout(show,600); else window.addEventListener('load',()=>setTimeout(show,600));
})();
