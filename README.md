# Nayam Restaurante · Poblenou, Barcelona

Web estática del restaurante Nayam: portada, carta completa con fotos (comida, cena y desayunos), reseñas, el local, reservas por WhatsApp, horario y contacto. Español e inglés, modo claro y oscuro, pensada primero para el móvil.

No usa frameworks, ni servidor, ni base de datos. Son archivos HTML, CSS y JavaScript que se publican tal cual. Incluye estadísticas de visitas con GoatCounter (sin cookies) y una sección de vídeos de TikTok con uno grande en reproducción y miniaturas para cambiar.

## Estructura

```
nayam-restaurante/
├── index.html              Página única (SEO, datos estructurados y seguridad en el <head>)
├── css/
│   ├── styles.css          Diseño y colores (modo claro y oscuro)
│   └── fonts.css           Fuentes propias (sin llamadas a Google)
├── js/
│   ├── data.js             CARTA, precios, horario y reseñas  ← lo que más se edita
│   ├── i18n.js             Textos en español e inglés
│   └── main.js             Lógica: idioma, carta, galería, reservas, "abierto ahora"
├── assets/
│   ├── img/                Fotos en WebP (NOMBRE-s.webp miniatura, NOMBRE-l.webp grande)
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
| Reseñas | `js/data.js` (`REVS`) |
| Fotos que rotan en la portada | `index.html`, bloque `<div class="slides">` (usa fotos de `assets/img/`) |
| Fotos de clientes de Google | `js/data.js` (`GPHOTOS`) y `assets/img/google-N-s.webp` / `-l.webp` |
| Vídeos de TikTok | `js/data.js` (`VIDEOS`): `id` es el número al final de la URL del vídeo; la portada va en `assets/img/tiktok-ID.webp` (vertical 9:16) |
| Teléfono de reservas (WhatsApp) | `js/data.js` (`WA`, solo dígitos con prefijo) y los enlaces `tel:` de `index.html` |
| Textos de la web | `js/i18n.js` |
| Colores | variables al principio de `css/styles.css` |
| Dirección, email, redes | `index.html` (sección contacto, pie y bloque JSON-LD) y `js/main.js` (redes del pie) |

**Fotos nuevas:** convierte la foto a WebP y guarda dos copias en `assets/img/`: `plato-s.webp` (unos 560 px de ancho) y `plato-l.webp` (unos 1200 px). Luego usa `plato` como primer valor del plato en `js/data.js`. Un plato sin foto se muestra como lista de precios.

## Vídeo en la portada (opcional)

Las animaciones actuales son un pase de fotos con zoom suave en la portada, aparición al hacer scroll, el neón parpadeando y los vídeos de TikTok. Todo se desactiva si el visitante pide «reducir movimiento» en su dispositivo.

Si el restaurante te da un vídeo propio (MP4 en H.264, vertical u horizontal, de 5 a 15 segundos y menos de 4 MB):
1. Guárdalo como `assets/video/portada.mp4`.
2. En `index.html`, dentro de `<div class="slides">`, añade como primer elemento:
   `<video class="on" autoplay muted loop playsinline poster="assets/img/local-banqueta-l.webp"><source src="assets/video/portada.mp4" type="video/mp4"></video>`
3. En `css/styles.css`, la regla `.hero .slides img` también debe aplicarse a `video` (añade `.hero .slides video` al selector).

La política de seguridad ya permite vídeo propio (`media-src 'self'`).

## Seguridad

Esta web no tiene formularios que envíen datos ni servidor, por lo que la superficie de ataque es mínima. Aun así:

- **Content Security Policy** estricta en `index.html`: solo se ejecutan scripts, estilos, fuentes e imágenes del propio sitio, más dos excepciones concretas: el script de GoatCounter (`gc.zgo.at`) con su endpoint (`9-s.goatcounter.com`) y el reproductor de TikTok (`frame-src https://www.tiktok.com`). No hay scripts ni estilos en línea y no hay formularios que envíen datos.
- **Pocos terceros, bien acotados:** las fuentes están alojadas en el propio repositorio y no hay mapas incrustados ni librerías externas.
  - **GoatCounter** cuenta visitas sin cookies ni datos personales. Las estadísticas se ven en https://9-s.goatcounter.com. Ese código de sitio es el mismo que usa otro proyecto: si quieres estadísticas separadas, crea un sitio nuevo en GoatCounter y cambia las dos URLs `9-s.goatcounter.com` en `index.html` y `_headers`.
  - **TikTok:** el vídeo grande se carga solo, sin sonido, cuando el visitante llega a esa sección. Las demás miniaturas son imágenes guardadas en el propio repositorio y no cargan nada de TikTok hasta que se pulsan. El reproductor va en un `iframe` con `sandbox`, y TikTok puede usar sus propias cookies al cargarse; la web lo avisa debajo de los vídeos. Si prefieres que no cargue nada hasta pulsar play, cambia en `js/main.js` el bloque «el vídeo grande empieza solo».
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
- Los vídeos de TikTok son contenido del propio restaurante. Revisa que quienes salen en ellos estén de acuerdo en que se muestren en la web.
- Añade una **política de privacidad** que mencione GoatCounter y TikTok. Cualquier formulario, mapa o analítica nueva debe constar ahí también.

## Créditos

Fuentes: Cormorant Garamond, DM Sans y Yellowtail (SIL Open Font License).
