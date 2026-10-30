/* Escribe en index.html el texto en español de cada elemento con data-i18n (y los alt de las fotos), para que
   la página ya tenga texto antes de cargar JavaScript: mejor para Google y sin saltos al cargar.
   Uso: node tools/prerender.js   (repítelo si cambias textos en js/i18n.js) */
const fs = require('fs');
global.window = {};
require('../js/i18n.js');
const T = window.NAYAM_I18N.es;
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
let html = fs.readFileSync('index.html','utf8'), n = 0, miss = [];
html = html.replace(/(<(\w+)(?=[^>]*\sdata-i18n="([^"]+)")[^>]*>)([\s\S]*?)(<\/\2>)/g,(m,open,tag,key,inner,close)=>{
  if(!(key in T) || Array.isArray(T[key])){ miss.push(key); return m; }
  if(/<\w/.test(inner)){ miss.push(key+' (tiene etiquetas dentro)'); return m; }
  n++; return open+esc(T[key])+close;
});
html = html.replace(/(<img\b[^>]*?)\salt="[^"]*"([^>]*?\sdata-alt="([^"]+)"[^>]*>)/g,(m,a,b,key)=> key in T ? `${a} alt="${esc(T[key])}"${b}` : m);
html = html.replace(/(<img\b[^>]*?\sdata-alt="([^"]+)"[^>]*?)\salt="[^"]*"/g,(m,a,key)=> key in T ? `${a} alt="${esc(T[key])}"` : m);
fs.writeFileSync('index.html',html);
console.log('textos escritos:',n, miss.length?'sin escribir: '+miss.join(', '):'');
