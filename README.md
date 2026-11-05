# Sitio comercial · Alvaro Siles — Software & Tech

Sitio web estático (HTML + CSS + JavaScript, sin frameworks ni build) para presentar y vender:

1. Portafolios Web Profesionales
2. Tarjetas Digitales de Presentación
3. Sistemas de Gestión Empresarial

y los servicios tecnológicos complementarios.

## Estructura

```
index.html                 Portada: hero, productos, servicios, metodología, tecnologías, sobre mí, FAQ, contacto
portafolios-web.html       Página del Producto 01
tarjetas-digitales.html    Página del Producto 02
sistemas-de-gestion.html   Página del Producto 03
privacidad.html            Política de privacidad
assets/css/styles.css      Estilos (mobile-first, tokens en :root)
assets/js/config.js        ⚙️ DATOS CONFIGURABLES (WhatsApp, correo, redes, foto…)
assets/js/icons.js         Íconos SVG compartidos por todas las páginas
assets/js/main.js          Menú, WhatsApp, validación y envío del formulario
assets/img/favicon.svg  Ícono del sitio
robots.txt, sitemap.xml SEO básico
```

## Cómo ejecutarlo

Abrir `index.html` en el navegador, o servirlo localmente:

```bash
npx serve .
# o
python -m http.server 8080
```

Para publicarlo basta con subir la carpeta a cualquier hosting estático (GitHub Pages, Netlify, Vercel, cPanel…).

## Configuración pendiente

Editar **`assets/js/config.js`**:

| Campo          | Descripción |
|----------------|-------------|
| `whatsapp`     | Número con código de país, solo dígitos (ej. `59170000000`). Mientras esté vacío, los botones de WhatsApp llevan al formulario. |
| `phoneLabel`   | Teléfono tal como se muestra en pantalla. |
| `email`        | Correo de contacto (también habilita “Enviar por correo”). |
| `location`     | Ciudad / país. |
| `social`       | URLs de LinkedIn, GitHub, Instagram, Facebook (vacío = oculto). |
| `photo`        | Ruta a tu foto (ej. `assets/img/perfil.jpg`). |
| `formEndpoint` | Opcional: URL de Formspree/Getform/tu API para recibir el formulario por POST (JSON). |

Además:

- Reemplazar `https://www.tudominio.com/` en `index.html` (canonical y Open Graph), `robots.txt` y `sitemap.xml`.
- Crear `assets/img/og-image.png` (1200×630) y descomentar la etiqueta `og:image` en `index.html`.
- Revisar el texto de `privacidad.html` según la normativa de tu país.

## Páginas de producto

Cada producto tiene su propia página con: problema que resuelve, funcionalidades, público objetivo,
beneficios, preguntas frecuentes y llamado a la acción. El formulario vive en la portada; los botones
«Solicitar información» de cada página llevan a `index.html?producto=…#contacto`, que deja el producto
preseleccionado.

## Envío del formulario

No hay backend: el formulario **no simula envíos**. Según la configuración:

- con `formEndpoint` → envía los datos por POST y muestra éxito o error según la respuesta real;
- sin endpoint → abre WhatsApp o la app de correo con la solicitud ya redactada para que el cliente la envíe.
