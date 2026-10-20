# Nayam Restaurante · Poblenou, Barcelona

Web estática del restaurante Nayam: portada, carta completa con fotos (comida, cena y desayunos), reseñas, el local, reservas por WhatsApp, horario y contacto. Español e inglés, modo claro y oscuro, pensada primero para el móvil.

No usa frameworks, ni servidor, ni base de datos, ni cookies. Son archivos HTML, CSS y JavaScript que se publican tal cual.

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
| Teléfono de reservas (WhatsApp) | `js/data.js` (`WA`, solo dígitos con prefijo) y los enlaces `tel:` de `index.html` |
| Textos de la web | `js/i18n.js` |
| Colores | variables al principio de `css/styles.css` |
| Dirección, email, redes | `index.html` (sección contacto, pie y bloque JSON-LD) y `js/main.js` (redes del pie) |

**Fotos nuevas:** convierte la foto a WebP y guarda dos copias en `assets/img/`: `plato-s.webp` (unos 560 px de ancho) y `plato-l.webp` (unos 1200 px). Luego usa `plato` como primer valor del plato en `js/data.js`. Un plato sin foto se muestra como lista de precios.

## Seguridad

Esta web no tiene formularios que envíen datos ni servidor, por lo que la superficie de ataque es mínima. Aun así:

- **Content Security Policy** estricta en `index.html`: solo se ejecutan scripts, estilos, fuentes e imágenes del propio sitio. No hay scripts ni estilos en línea, no se permiten conexiones de red desde el JavaScript y no hay formularios que envíen datos.
- **Sin terceros:** las fuentes están alojadas en el propio repositorio y no hay analítica, cookies, mapas incrustados ni librerías externas. Por eso no hace falta banner de cookies y se evita el problema de privacidad (RGPD) de cargar Google Fonts.
- **Enlaces externos** con `rel="noopener"`.
- **Sin secretos:** no hay claves ni tokens en el código. `.gitignore` bloquea `.env`, claves y certificados para que nunca se suban por error. No añadas aquí contraseñas ni claves de API.
- **Reservas por WhatsApp:** el formulario solo compone un enlace `wa.me` con el mensaje. Los datos del cliente no pasan por ningún servidor de la web.
- **Workflow de GitHub** con permisos mínimos y versiones fijas de las acciones; Dependabot avisa de actualizaciones.
- **Cabeceras HTTP:** GitHub Pages no permite configurarlas. Si el restaurante pasa a Netlify o Cloudflare Pages, el archivo `_headers` ya incluye CSP completa con `frame-ancestors`, HSTS, `nosniff` y `Permissions-Policy`.
- Activa en GitHub **Settings → Code security** (Dependabot alerts) y, en la cuenta, la verificación en dos pasos.

Si añades algo nuevo (un mapa de Google, analítica, un formulario con servicio externo) tendrás que ampliar la CSP del `<head>` y de `_headers`, y avisar de ello en la política de privacidad.

## Antes de publicar

- Confirma con el restaurante que los **precios, el horario y el teléfono** son los vigentes.
- Las fotos y los textos proceden de la web actual del restaurante. Confirma que tienes permiso para reutilizarlos.
- El texto de las reseñas es el publicado en Google. Mantén el enlace a las reseñas originales.
- Añade una **política de privacidad** si más adelante incorporas formularios, analítica o mapas.

## Créditos

Fuentes: Cormorant Garamond, DM Sans y Yellowtail (SIL Open Font License).
