/**
 * ============================================================
 *  CONFIGURACIÓN DEL SITIO — completa estos valores
 * ============================================================
 *  Todo lo que dice "TODO" es un valor de ejemplo que debes
 *  reemplazar por tus datos reales. El resto del sitio toma
 *  la información desde aquí, no hace falta tocar el HTML.
 */
window.SITE_CONFIG = {
  /* Nombre que aparece en el sitio y en los mensajes */
  name: "Alvaro Siles",
  role: "Ingeniero de Sistemas · Full Stack Developer",

  /* WhatsApp: código de país + número, SOLO dígitos, sin "+" ni espacios.
     Ejemplo Bolivia: "59170000000". TODO: reemplazar */
  whatsapp: "59177181073",

  /* Texto visible del teléfono (opcional). TODO */
  phoneLabel: "+591 77181073",

  /* Correo de contacto. TODO */
  email: "alvarosiles.developer@gmail.com",

  /* Ciudad / país (texto libre). TODO */
  location: "Santa Cruz, Bolivia",

  /* Redes: deja "" para ocultar el ícono. TODO */
  social: {
    linkedin: "",
    github: "",
    instagram: "",
    facebook: "",
    tiktok: ""
  },

  /* Precios de los planes (texto libre, ej: "Bs 800", "Desde $150").
     Vacío = se muestra "A cotizar". TODO: completar si quieres publicar precios */
  plans: {
    portafolios: { inicial: "", recomendado: "", avanzado: "" },
    tarjetas:    { inicial: "", recomendado: "", avanzado: "" },
    sistemas:    { inicial: "", recomendado: "", avanzado: "" }
  },

  /* Ruta a tu fotografía (ej: "assets/img/perfil.jpg"). Vacío = iniciales. */
  photo: "assets/img/alvaro-siles.jpg",

  /* Endpoint opcional para el formulario (Formspree, Getform, tu API…).
     Si queda vacío, el formulario envía la solicitud por WhatsApp o correo
     (se abre la app con el mensaje armado; no se simula ningún envío). */
  formEndpoint: ""
};
