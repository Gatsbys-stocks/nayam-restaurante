# Nayam Restaurante · Poblenou, Barcelona

Web estática del restaurante Nayam: portada, carta completa con fotos (comida, cena y desayunos), reseñas, el local, reservas por WhatsApp, horario y contacto. Español e inglés, modo claro y oscuro, pensada primero para el móvil.

No usa frameworks, ni servidor, ni base de datos. Son archivos HTML, CSS y JavaScript que se publican tal cual. Incluye estadísticas de visitas con GoatCounter (sin cookies) y una sección de vídeos con un clip grande en reproducción y miniaturas para cambiar.

## Estructura

```
nayam-restaurante/
├── index.html              Página única (SEO, datos estructurados y seguridad en el <head>)
├── qrmesa/
│   └── index.html          Página del QR de las mesas: elegir Desayunos o Carta (nayam.daylli9s.site/qrmesa/)
├── mesa/
│   └── index.html          Redirige a /qrmesa/ (por si se hubiera impreso la dirección anterior)
├── css/
│   ├── styles.css          Diseño y colores (modo claro y oscuro)
│   ├── qrmesa.css          Diseño y animaciones de la página del QR
│   └── fonts.css           Fuentes propias (sin llamadas a Google)
├── js/
│   ├── data.js             CARTA, precios, horario y reseñas  ← lo que más se edita
│   ├── i18n.js             Textos en español e inglés
│   ├── qrmesa.js           Idioma, «abierto ahora» y WhatsApp de la página del QR
│   └── main.js             Lógica: idioma, carta, galería, reservas, "abierto ahora"
├── assets/
│   ├── img/                Fotos en WebP (NOMBRE-s.webp miniatura, NOMBRE-l.webp grande)
│   ├── video/              Clips verticales en MP4 (ID.mp4), sacados del TikTok del restaurante
│   ├── fonts/              Cormorant Garamond, DM Sans y Yellowtail (licencia OFL)
│   └── favicon.svg
├── _headers                Cabeceras de seguridad para Netlify o Cloudflare Pages
├── robots.txt
├── .nojekyll
└── .github/
    ├── workflows/pages.yml Publicación automática en GitHub Pages
    └── dependabot.yml      Avisos de actualización de las acciones de GitHub
```

## Publicar en GitHub Pages

1. Crea un repositorio nuevo en GitHub (por ejemplo `nayam-restaurante`). Puede ser público.
2. Sube **el contenido de esta carpeta** a la raíz del repositorio (que `index.html` quede en la raíz, no dentro de otra carpeta).
   ```bash
   git init -b main
   git add .
   git commit -m "Web de Nayam Restaurante"
   git remote add origin https://github.com/TU-USUARIO/nayam-restaurante.git
   git push -u origin main
   ```
3. En GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. El workflow `pages.yml` publica la web en cada `push` a `main`. En la pestaña **Actions** verás el progreso. La URL será `https://TU-USUARIO.github.io/nayam-restaurante/`.

Para ver la web en tu ordenador sin publicar, abre `index.html` en el navegador o ejecuta `python3 -m http.server 8000` dentro de la carpeta y entra en `http://localhost:8000`.

### Dominio propio

En **Settings → Pages → Custom domain** escribe el dominio y activa **Enforce HTTPS**. Después añade en `index.html` las etiquetas `og:url` y `og:image` (con la URL absoluta de `assets/img/local-banqueta-l.webp`) y la línea `Sitemap:` en `robots.txt`.

## Cómo cambiar el contenido

| Quiero cambiar… | Dónde |
|---|---|
| Precios, platos, descripciones | `js/data.js` (objeto `MENU`, con texto en español e inglés) |
| Horario | `js/data.js` (`HOURS`, lunes primero) **y** el bloque JSON-LD de `index.html` |
| Tira «Del desayuno a la cena» | `js/data.js` (`STRIP`): foto, nombre, pestaña, categoría y posición del plato al que lleva al tocarla |
| Reseñas | `js/data.js` (`REVS`) |
| Fotos que rotan en la portada | `index.html`, bloque `<div class="slides">` (usa fotos de `assets/img/`) |
| Fotos de clientes de Google | `js/data.js` (`GPHOTOS`) y `assets/img/google-N-s.webp` / `-l.webp` |
| Vídeos (sección TikTok) | `js/data.js` (`VIDEOS`): `id` es el número al final de la URL del vídeo en TikTok; el clip va en `assets/video/ID.mp4` y la portada en `assets/img/tiktok-ID.webp` (vertical 9:16) |
| Teléfono de reservas (WhatsApp) | `js/data.js` (`WA`, solo dígitos con prefijo) y los enlaces `tel:` de `index.html` |
| Textos de la web | `js/i18n.js` |
| Colores | variables al principio de `css/styles.css` |
| Dirección, email, redes | `index.html` (sección contacto, pie y bloque JSON-LD) y `js/main.js` (redes del pie) |

**Fotos nuevas:** convierte la foto a WebP y guarda dos copias en `assets/img/`: `plato-s.webp` (unos 560 px de ancho) y `plato-l.webp` (unos 1200 px). Luego usa `plato` como primer valor del plato en `js/data.js`. Un plato sin foto se muestra como lista de precios.

## Vídeos propios del restaurante

Hay vídeos grabados por el restaurante usados como fondo y en tarjetas (no son los de TikTok, que siguen en su sección):
- **Portada de la web:** `hero-reel.mp4` (ordenador) y `hero-reel-m.mp4` (móvil), un montaje de 26 segundos con fachada, neón, sala, desayuno, brunch, crepes y batidos. Va sin sonido y en bucle, con botón de pausa. El pase de fotos queda como respaldo.
- **Tarjetas «Para cada momento del día»:** bucles `moment-brunch-loop.mp4` y `moment-cafe-loop.mp4`. «Comida y cena» (y la tarjeta Carta del QR) usa de momento un bucle del brunch (`carta-loop.mp4`) hasta que haya un vídeo de platos de comida o cena. En la página del QR los vídeos van a cámara lenta (el de fondo a 0,5x y los de las tarjetas a 0,7x; se cambia en `js/qrmesa.js`).
- **Contacto:** `local-loop.mp4` (fachada, neón y sala) en lugar de la foto.
- **Página del QR:** el montaje de la portada de fondo y `desayuno-nayam-loop.mp4` en la tarjeta Desayunos.

Todos se quedan quietos (con la foto de respaldo) si el visitante tiene activado «reducir movimiento» o «ahorro de datos».

Importante: los vídeos originales venían de un editor gratuito con marca de agua (clideo.com). Se han recortado por abajo para ocultarla; si el restaurante pasa las versiones sin marca, hay que volver a generar el montaje y los bucles.

## Añadir o cambiar un vídeo

1. Recorta el vídeo a 10–15 segundos, vertical 9:16, y comprímelo en H.264 (unos 1,5 MB):
   `ffmpeg -i original.mp4 -t 14 -vf "scale=540:960,format=yuv420p" -c:v libx264 -crf 28 -profile:v main -movflags +faststart -c:a aac -b:a 64k -ac 1 ID.mp4`
2. Guárdalo en `assets/video/ID.mp4` y haz una portada `assets/img/tiktok-ID.webp` (540×960).
3. Añádelo a `VIDEOS` en `js/data.js`.

El clip grande se reproduce solo y sin sonido al llegar a esa sección, pasa al siguiente al terminar y se pausa al salir de pantalla. Con «reducir movimiento» activado no arranca solo.

## QR de las mesas

El QR de las mesas apunta a **https://nayam.daylli9s.site/qrmesa/**, una página pensada para el móvil con dos opciones grandes (**Desayunos** y **Carta** de comida y cena) y debajo los enlaces de siempre: reservar por WhatsApp y «Ver la web» (botones destacados), y cómo llegar, Instagram, TikTok y reseña de Google. Tiene animaciones suaves (neón que se enciende, fotos con zoom lento, brillos) que se desactivan con «reducir movimiento».

- Cada opción lleva directo a su carta: `/#desayunos` abre la pestaña de Desayunos y `/#carta` la de Comida y cena.
- Si cambias precios o platos en `js/data.js`, el QR no cambia: sigue llevando a la misma página.
- Usa el mismo horario que la web (`HOURS` en `js/data.js`) para el aviso «Abierto ahora».
- GoatCounter cuenta esta página aparte (`/qrmesa/`), así que en tus estadísticas se ve cuánta gente escanea el QR frente a la que entra por la web.
- Para añadir o quitar un enlace, edita la lista `<ul class="links">` de `qrmesa/index.html` y, si hace falta, los textos en `js/qrmesa.js`.

## Móvil

En pantallas estrechas la web cambia así: «Para cada momento del día» y las reseñas se deslizan de lado, las categorías de la carta quedan fijas bajo la cabecera, aparece una barra inferior con «Ver la carta» y «Reservar» (se esconde en la portada, en reservas y en contacto) y se quitan los pasos repetidos de reservas. Todo está en la parte final de `css/styles.css` (bloque «mejoras para móvil») y en `js/main.js` (barra inferior).

## Rendimiento y comprobaciones

- El texto en español de `index.html` está escrito ya en el HTML (lo genera `node tools/prerender.js` a partir de `js/i18n.js`), de modo que la página tiene contenido antes de cargar JavaScript y no «salta» al cargar. Si cambias textos en `js/i18n.js`, ejecuta ese comando y sube el resultado.
- La foto principal de la portada tiene tres tamaños (`local-banqueta-s/m/l.webp`) y se precarga; las demás fotos del pase se descargan cuando la página ya ha cargado.
- `robots.txt` y `sitemap.xml` apuntan a `https://nayam.daylli9s.site/`. Al publicar el aviso legal y la política de privacidad, añádelos al `sitemap.xml`.
- Para medir: Lighthouse (Chrome → F12 → Lighthouse) o https://pagespeed.web.dev/ con la dirección de la web.

## Cifras bajo la portada

Se editan en `js/data.js` (`STATS`). Vienen de Google Maps y TikTok a fecha de la última revisión, así que actualízalas de vez en cuando.

## Textos legales (RGPD y LSSI)

Hay dos páginas: `aviso-legal/` y `privacidad/` (política de privacidad y cookies), enlazadas desde el pie de la web y de la página del QR. Los datos del titular (nombre, NIF y domicilio) salen de la factura del restaurante y están escritos en ambas páginas. Si cambian (por ejemplo, si el negocio pasa a una sociedad), hay que actualizarlos en las dos y cambiar la fecha de «Última actualización».

La web no usa cookies, no tiene formularios y mide visitas con GoatCounter sin cookies, por eso no lleva banner de cookies. Si se añade algo que use cookies (mapas, vídeos o píxeles de terceros), hay que actualizar la política y pedir consentimiento. Los textos son una base redactada a partir de lo que hace la web; conviene que el restaurante o su gestoría los revise.

## Seguridad

Esta web no tiene formularios que envíen datos ni servidor, por lo que la superficie de ataque es mínima. Aun así:

- **Content Security Policy** estricta en `index.html`: solo se ejecutan scripts, estilos, fuentes, imágenes y vídeo del propio sitio, más una excepción concreta: el script de GoatCounter (`gc.zgo.at`) con su endpoint (`9-s.goatcounter.com`). No hay scripts ni estilos en línea, no se permiten `iframe` y no hay formularios que envíen datos.
- **Pocos terceros, bien acotados:** las fuentes y los vídeos están alojados en el propio repositorio y no hay mapas incrustados ni librerías externas.
  - **GoatCounter** cuenta visitas sin cookies ni datos personales. Las estadísticas se ven en https://9-s.goatcounter.com. Ese código de sitio es el mismo que usa otro proyecto: si quieres estadísticas separadas, crea un sitio nuevo en GoatCounter y cambia las dos URLs `9-s.goatcounter.com` en `index.html` y `_headers`.
  - **TikTok:** los clips de la sección de vídeos son archivos propios (`assets/video/`), así que la web no carga el reproductor de TikTok ni sus cookies. Cada clip enlaza al vídeo original en TikTok.
- **Enlaces externos** con `rel="noopener"`.
- **Sin secretos:** no hay claves ni tokens en el código. `.gitignore` bloquea `.env`, claves y certificados para que nunca se suban por error. No añadas aquí contraseñas ni claves de API.
- **Reservas por WhatsApp:** el formulario solo compone un enlace `wa.me` con el mensaje. Los datos del cliente no pasan por ningún servidor de la web.
- **Workflow de GitHub** con permisos mínimos y versiones fijas de las acciones; Dependabot avisa de actualizaciones.
- **Cabeceras HTTP:** GitHub Pages no permite configurarlas. Si el restaurante pasa a Netlify o Cloudflare Pages, el archivo `_headers` ya incluye CSP completa con `frame-ancestors`, HSTS, `nosniff` y `Permissions-Policy`.
- Activa en GitHub **Settings → Code security** (Dependabot alerts) y, en la cuenta, la verificación en dos pasos.

Si añades algo nuevo (un mapa de Google, otra analítica, un formulario con servicio externo) tendrás que ampliar la CSP del `<head>` y de `_headers`, y avisar de ello en la política de privacidad.

## Antes de publicar

- Confirma con el restaurante que los **precios, el horario y el teléfono** son los vigentes.
- Las fotos y los textos proceden de la web actual del restaurante. Confirma que tienes permiso para reutilizarlos.
- El texto de las reseñas es el publicado en Google. Mantén el enlace a las reseñas originales.
- Las fotos de la galería «Desde Google» las publicaron clientes en Google Maps (se quitaron sus metadatos). Pide permiso al restaurante, y si puedes a los autores, o cámbialas por fotos propias del local.
- Los clips proceden del TikTok del restaurante, con personas conocidas en varios. Antes de publicar, confirma con el restaurante que puedes usarlos en su web, y si prefieres, quita los que no quiera de `VIDEOS` y de `assets/video/`.
- Añade una **política de privacidad** que mencione GoatCounter y TikTok. Cualquier formulario, mapa o analítica nueva debe constar ahí también.

## Créditos

Fuentes: Cormorant Garamond, DM Sans y Yellowtail (SIL Open Font License).
