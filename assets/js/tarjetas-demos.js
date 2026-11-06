/**
 * ============================================================
 *  DEMOSTRACIONES POR RUBRO — datos FICTICIOS
 * ============================================================
 *  Cada rubro de la sección "Demostraciones interactivas".
 *  - label / desc / redes: lo que se ve en la tarjeta del listado.
 *  - el resto: la tarjeta digital de ejemplo que se abre al tocar "Ver ejemplo".
 *  Campos:
 *    style   "classic" | "dark" | "grad"     person  true = muestra iniciales
 *    hours   uno de los horarios de HOURS (abajo) o un objeto { hours, schedule }
 *    cta     botón extra de agenda/cotización: { label, icon }
 *  Redes disponibles: facebook, instagram, tiktok, linkedin, x, github, gitlab,
 *  figma, pinterest, behance, youtube
 */
(function () {
  "use strict";

  /* schedule: índice 0 = domingo … 6 = sábado → [apertura, cierre] o null */
  var W = function (a, b) { return [a, b]; };
  var HOURS = {
    office: { hours: [["Lunes a viernes", "09:00 – 18:00"], ["Sábado", "09:00 – 13:00"]], schedule: [null, W(9, 18), W(9, 18), W(9, 18), W(9, 18), W(9, 18), W(9, 13)] },
    clinic: { hours: [["Lunes a viernes", "08:00 – 20:00"], ["Sábado", "08:00 – 13:00"]], schedule: [null, W(8, 20), W(8, 20), W(8, 20), W(8, 20), W(8, 20), W(8, 13)] },
    shop: { hours: [["Lunes a sábado", "09:00 – 20:00"], ["Domingo", "Cerrado"]], schedule: [null, W(9, 20), W(9, 20), W(9, 20), W(9, 20), W(9, 20), W(9, 20)] },
    salon: { hours: [["Martes a sábado", "10:00 – 20:00"], ["Domingo y lunes", "Cerrado"]], schedule: [null, null, W(10, 20), W(10, 20), W(10, 20), W(10, 20), W(10, 20)] },
    gym: { hours: [["Lunes a viernes", "06:00 – 22:00"], ["Sábado", "08:00 – 14:00"]], schedule: [null, W(6, 22), W(6, 22), W(6, 22), W(6, 22), W(6, 22), W(8, 14)] },
    events: { hours: [["Atención", "Lunes a sábado · 09:00 – 19:00"], ["Eventos", "Fines de semana y feriados"]], schedule: [null, W(9, 19), W(9, 19), W(9, 19), W(9, 19), W(9, 19), W(9, 19)] },
    urgent: { hours: [["Lunes a sábado", "08:00 – 19:00"], ["Urgencias", "24 horas"]], schedule: [W(0, 24), W(0, 24), W(0, 24), W(0, 24), W(0, 24), W(0, 24), W(0, 24)] }
  };

  var CATS = [
    { id: "prof", label: "Profesionales" },
    { id: "salud", label: "Salud" },
    { id: "belleza", label: "Belleza y bienestar" },
    { id: "comercio", label: "Comercios y ventas" },
    { id: "gastro", label: "Gastronomía" },
    { id: "oficios", label: "Oficios" },
    { id: "arte", label: "Arte y entretenimiento" }
  ];

  var LIST = [
    /* ---------------- Profesionales ---------------- */
    { id: "profesionales", cat: "prof", label: "Profesionales", desc: "Tarjeta digital personal con todos tus contactos.",
      redes: ["linkedin", "instagram", "facebook", "x"], icon: "user", style: "dark", person: true,
      name: "Lic. Mariana Vega", tagline: "Consultora en marketing", c1: "#0d9488", c2: "#134e4a",
      about: "Ayudo a pequeñas y medianas empresas a ordenar su marca y vender más en redes sociales.",
      catalogTitle: "Servicios", catalog: [
        { t: "Consultoría de marca", d: "Diagnóstico y plan de acción" },
        { t: "Estrategia digital", d: "Redes sociales y contenidos" },
        { t: "Capacitaciones", d: "Talleres para equipos de venta" }],
      hours: "office", cta: { label: "Agendar reunión", icon: "calendar" } },

    { id: "ingenieros", cat: "prof", label: "Ingenieros", desc: "Proyectos realizados, CV y perfiles técnicos (LinkedIn, GitHub).",
      redes: ["linkedin", "github", "gitlab", "figma"], icon: "code", style: "dark", person: true,
      name: "Ing. Carlos Méndez", tagline: "Ingeniero de software", c1: "#2563eb", c2: "#0f172a",
      about: "Desarrollo aplicaciones web y móviles. Aquí encontrarás mis proyectos, mi CV y mis perfiles técnicos.",
      catalogTitle: "Proyectos", catalog: [
        { t: "Sistema de inventarios", d: "Aplicación web · React y Node.js" },
        { t: "App de pedidos", d: "Android e iOS" },
        { t: "Integración de pagos", d: "API REST" },
        { t: "Currículum (CV)", d: "Experiencia y certificaciones" }],
      hours: "office", cta: { label: "Descargar CV", icon: "text" } },

    { id: "abogados", cat: "prof", label: "Abogados", desc: "Áreas de práctica y agenda de consultas.",
      redes: ["linkedin", "facebook", "x"], icon: "scale", style: "dark", person: true,
      name: "Dra. Lucía Paredes", tagline: "Abogada · Derecho civil y familiar", c1: "#b08d57", c2: "#3b2f1e",
      about: "Asesoría legal clara y cercana. Primera consulta para evaluar tu caso.",
      catalogTitle: "Áreas de práctica", catalog: [
        { t: "Derecho de familia", d: "Divorcios, pensiones y custodia" },
        { t: "Contratos civiles", d: "Redacción y revisión" },
        { t: "Sucesiones y herencias", d: "Trámites y declaratorias" },
        { t: "Asesoría a empresas", d: "Constitución y contratos" }],
      hours: "office", cta: { label: "Agendar consulta", icon: "calendar" } },

    { id: "contadores", cat: "prof", label: "Contadores", desc: "Servicios contables, calendario tributario y consultas.",
      redes: ["linkedin", "facebook", "instagram"], icon: "calculator", style: "classic", person: true,
      name: "Lic. Jorge Salinas", tagline: "Contador público", c1: "#0891b2", c2: "#164e63",
      about: "Llevo la contabilidad de tu negocio al día para que no te preocupes por vencimientos ni multas.",
      catalogTitle: "Servicios", catalog: [
        { t: "Contabilidad mensual", d: "Para comercios y empresas" },
        { t: "Declaraciones de impuestos", d: "Presentación a tiempo" },
        { t: "Calendario tributario", d: "Recordatorios de vencimientos" },
        { t: "Planillas y sueldos", d: "Cálculo y presentación" }],
      hours: "office", cta: { label: "Agendar consulta", icon: "calendar" } },

    { id: "profesional", cat: "prof", label: "Arquitectos y constructoras", desc: "Portafolio de obras, renders y cotización de proyectos.",
      redes: ["instagram", "pinterest", "linkedin", "behance"], icon: "ruler", style: "grad", person: true,
      name: "Arq. Daniel Rojas", tagline: "Arquitectura e interiores", c1: "#4f46e5", c2: "#0891b2",
      about: "Diseño de viviendas, remodelaciones e interiores. Atención con cita previa en oficina o a domicilio.",
      catalogTitle: "Obras", catalog: [
        { t: "Casa Los Álamos", d: "Vivienda unifamiliar · 280 m²" },
        { t: "Renders 3D", d: "Visualiza tu proyecto antes de construir" },
        { t: "Remodelaciones", d: "Cocinas, baños y ampliaciones" },
        { t: "Planos y trámites", d: "Aprobación municipal" }],
      hours: { hours: [["Lunes a viernes", "09:00 – 18:00"], ["Fines de semana", "Con cita"]], schedule: [null, W(9, 18), W(9, 18), W(9, 18), W(9, 18), W(9, 18), null] },
      cta: { label: "Cotizar proyecto", icon: "pen" } },

    /* ---------------- Salud ---------------- */
    { id: "medicos", cat: "salud", label: "Médicos", desc: "Perfil profesional y reserva de turnos.",
      redes: ["instagram", "facebook", "linkedin", "youtube"], icon: "stethoscope", style: "classic", person: true,
      name: "Dr. Andrés Rocha", tagline: "Médico internista", c1: "#0284c7", c2: "#0c4a6e",
      about: "Atención integral del adulto, chequeos preventivos y control de enfermedades crónicas.",
      catalogTitle: "Consultas", catalog: [
        { t: "Consulta general", d: "Presencial en consultorio" },
        { t: "Chequeo preventivo", d: "Con orden de laboratorio" },
        { t: "Control de enfermedades crónicas", d: "Diabetes, presión arterial" },
        { t: "Teleconsulta", d: "Por videollamada" }],
      hours: "clinic", cta: { label: "Reservar turno", icon: "calendar" } },

    { id: "odontologos", cat: "salud", label: "Odontólogos", desc: "Turnos, tratamientos y urgencias dentales.",
      redes: ["instagram", "facebook", "tiktok", "youtube"], icon: "tooth", style: "classic",
      name: "Sonrisa Clara", tagline: "Clínica odontológica", c1: "#06b6d4", c2: "#0e7490",
      about: "Cuidamos tu sonrisa con tecnología moderna y atención sin dolor para toda la familia.",
      catalogTitle: "Tratamientos", catalog: [
        { t: "Limpieza dental", d: "Profilaxis y control" },
        { t: "Ortodoncia", d: "Brackets y alineadores" },
        { t: "Blanqueamiento", d: "En una sesión" },
        { t: "Urgencias dentales", d: "Atención el mismo día" }],
      hours: "clinic", cta: { label: "Reservar turno", icon: "calendar" } },

    { id: "fisioterapeutas", cat: "salud", label: "Fisioterapeutas", desc: "Tratamientos, reserva de sesiones y ubicación del consultorio.",
      redes: ["instagram", "tiktok", "youtube", "facebook"], icon: "activity", style: "grad",
      name: "MoviCentro", tagline: "Fisioterapia y rehabilitación", c1: "#16a34a", c2: "#0d9488",
      about: "Recupera tu movilidad con planes de tratamiento personalizados y seguimiento en cada sesión.",
      catalogTitle: "Tratamientos", catalog: [
        { t: "Rehabilitación de lesiones", d: "Rodilla, hombro, columna" },
        { t: "Fisioterapia deportiva", d: "Prevención y recuperación" },
        { t: "Masaje terapéutico", d: "Sesiones de 50 minutos" },
        { t: "Evaluación inicial", d: "Diagnóstico y plan" }],
      hours: "clinic", cta: { label: "Reservar sesión", icon: "calendar" } },

    { id: "psicologos", cat: "salud", label: "Psicólogos", desc: "Agenda de sesiones presenciales y online, con discreción.",
      redes: ["instagram", "facebook", "linkedin", "youtube"], icon: "heart", style: "grad", person: true,
      name: "Lic. Sofía Arce", tagline: "Psicóloga clínica", c1: "#8b5cf6", c2: "#6366f1",
      about: "Un espacio seguro y confidencial para acompañarte. Sesiones presenciales y por videollamada.",
      catalogTitle: "Sesiones", catalog: [
        { t: "Terapia individual", d: "Adultos y adolescentes" },
        { t: "Terapia de pareja", d: "Presencial u online" },
        { t: "Sesiones online", d: "Por videollamada, con total privacidad" },
        { t: "Primera entrevista", d: "Para conocernos" }],
      hours: "office", cta: { label: "Agendar sesión", icon: "calendar" } },

    { id: "opticas", cat: "salud", label: "Ópticas", desc: "Catálogo de monturas, lentes de contacto y examen visual.",
      redes: ["instagram", "facebook", "tiktok"], icon: "glasses", style: "classic",
      name: "Óptica Visión Clara", tagline: "Monturas, lentes y examen visual", c1: "#0ea5e9", c2: "#1e40af",
      about: "Encuentra la montura ideal y realiza tu examen visual computarizado en el mismo lugar.",
      catalogTitle: "Catálogo", catalog: [
        { t: "Monturas de receta", d: "Clásicas y modernas" },
        { t: "Lentes de sol", d: "Con protección UV" },
        { t: "Lentes de contacto", d: "Diarios y mensuales" },
        { t: "Examen visual", d: "Computarizado" }],
      hours: "shop", cta: { label: "Reservar examen visual", icon: "calendar" } },

    { id: "farmacia", cat: "salud", label: "Farmacias", desc: "Pedidos por WhatsApp, delivery y farmacia de turno.",
      redes: ["facebook", "instagram", "tiktok"], icon: "pill", style: "classic",
      name: "Farmacia Vida Sana", tagline: "Tu salud, cerca de casa", c1: "#0f9f8f", c2: "#0b5f7a",
      about: "Medicamentos, cuidado personal y atención farmacéutica con trato cercano. Hacemos entregas a domicilio dentro de la zona.",
      catalogTitle: "Servicios", catalog: [
        { t: "Pedidos por WhatsApp", d: "Envía tu receta y te confirmamos" },
        { t: "Entrega a domicilio", d: "Dentro de la zona" },
        { t: "Farmacia de turno", d: "Consulta las fechas de turno" },
        { t: "Control de presión arterial", d: "Sin cita previa" }],
      hours: { hours: [["Lunes a sábado", "08:00 – 22:00"], ["Domingo", "09:00 – 14:00"]], schedule: [W(9, 14), W(8, 22), W(8, 22), W(8, 22), W(8, 22), W(8, 22), W(8, 22)] } },

    { id: "veterinarias", cat: "salud", label: "Veterinarias", desc: "Turnos, urgencias, vacunas y pet shop.",
      redes: ["instagram", "facebook", "tiktok", "youtube"], icon: "paw", style: "classic",
      name: "Huellitas", tagline: "Clínica veterinaria y pet shop", c1: "#f59e0b", c2: "#b45309",
      about: "Cuidamos a tu mascota como parte de la familia: consultas, vacunas, urgencias y todo lo que necesita.",
      catalogTitle: "Servicios", catalog: [
        { t: "Consultas y vacunas", d: "Perros y gatos" },
        { t: "Urgencias", d: "Atención las 24 horas" },
        { t: "Baño y peluquería", d: "Con reserva previa" },
        { t: "Pet shop", d: "Alimentos y accesorios" }],
      hours: "urgent", cta: { label: "Reservar turno", icon: "calendar" } },

    /* ---------------- Belleza y bienestar ---------------- */
    { id: "salones", cat: "belleza", label: "Salones de belleza", desc: "Servicios, fotos de trabajos y reserva de turnos.",
      redes: ["instagram", "tiktok", "pinterest", "facebook"], icon: "spark", style: "grad",
      name: "Glow Studio", tagline: "Salón de belleza", c1: "#ec4899", c2: "#f97316",
      about: "Cortes, color, uñas y maquillaje. Mira nuestros trabajos y reserva tu turno en segundos.",
      catalogTitle: "Servicios", catalog: [
        { t: "Corte y peinado", d: "Incluye lavado", p: "Bs 80" },
        { t: "Coloración", d: "Tinte o mechas", p: "Bs 250" },
        { t: "Manicure", d: "Esmaltado semipermanente", p: "Bs 60" },
        { t: "Maquillaje social", d: "Para eventos", p: "Bs 150" }],
      hours: "salon", cta: { label: "Reservar turno", icon: "calendar" } },

    { id: "barberias", cat: "belleza", label: "Barberías", desc: "Reserva de turnos, galería de cortes y precios.",
      redes: ["instagram", "tiktok", "facebook", "youtube"], icon: "scissors", style: "dark",
      name: "Barbería El Clásico", tagline: "Cortes y barba", c1: "#d97706", c2: "#78350f",
      about: "Cortes clásicos y modernos, barba y buena conversación. Reserva y no hagas fila.",
      catalogTitle: "Precios", catalog: [
        { t: "Corte clásico", d: "Tijera o máquina", p: "Bs 40" },
        { t: "Corte + barba", d: "Con toalla caliente", p: "Bs 60" },
        { t: "Perfilado de barba", d: "Navaja", p: "Bs 25" },
        { t: "Corte infantil", d: "Hasta 12 años", p: "Bs 30" }],
      hours: "salon", cta: { label: "Reservar turno", icon: "calendar" } },

    { id: "gimnasios", cat: "belleza", label: "Gimnasios y entrenadores", desc: "Planes, horarios, clase de prueba y rutinas.",
      redes: ["instagram", "tiktok", "youtube", "facebook"], icon: "dumbbell", style: "dark",
      name: "Fuerza Gym", tagline: "Gimnasio y entrenamiento personal", c1: "#ef4444", c2: "#7f1d1d",
      about: "Entrena con guía profesional, rutinas a tu medida y clases grupales todos los días.",
      catalogTitle: "Planes", catalog: [
        { t: "Plan mensual", d: "Acceso libre a sala" },
        { t: "Entrenamiento personal", d: "Rutina a tu medida" },
        { t: "Clases grupales", d: "Funcional y spinning" },
        { t: "Clase de prueba", d: "Agenda tu primera clase" }],
      hours: "gym", cta: { label: "Pedir clase de prueba", icon: "calendar" } },

    /* ---------------- Comercios y ventas ---------------- */
    { id: "empresas", cat: "comercio", label: "Empresas", desc: "Tarjetas digitales para todo tu equipo de trabajo.",
      redes: ["linkedin", "facebook", "instagram", "youtube"], icon: "building", style: "classic",
      name: "Nexo Soluciones", tagline: "Soluciones para empresas", c1: "#2563eb", c2: "#1e3a8a",
      about: "Cada integrante del equipo tiene su propia tarjeta digital con la imagen de la empresa.",
      catalogTitle: "Equipo", catalog: [
        { t: "Ana Torres", d: "Gerente comercial" },
        { t: "Luis Paz", d: "Ventas corporativas" },
        { t: "Carla Ríos", d: "Atención al cliente" },
        { t: "Una tarjeta por persona", d: "Con el mismo diseño de marca" }],
      hours: "office", cta: { label: "Solicitar reunión", icon: "calendar" } },

    { id: "emprendedores", cat: "comercio", label: "Emprendedores", desc: "Catálogo de servicios y pedidos por WhatsApp.",
      redes: ["instagram", "tiktok", "facebook", "pinterest"], icon: "rocket", style: "grad",
      name: "Dulce Hogar Deco", tagline: "Decoración hecha a mano", c1: "#f97316", c2: "#e11d48",
      about: "Piezas de decoración hechas a mano. Elige del catálogo y haz tu pedido por WhatsApp.",
      catalogTitle: "Catálogo", catalog: [
        { t: "Velas aromáticas", d: "Set de 3", p: "Bs 35" },
        { t: "Cuadros decorativos", d: "30 × 40 cm", p: "Bs 90" },
        { t: "Macramé", d: "Para pared", p: "Bs 70" },
        { t: "Pedidos personalizados", d: "Consulta por WhatsApp" }],
      hours: "shop" },

    { id: "vendedores", cat: "comercio", label: "Vendedores", desc: "Presentación comercial y catálogo.",
      redes: ["linkedin", "instagram", "facebook", "tiktok"], icon: "trending", style: "dark", person: true,
      name: "Diego Fernández", tagline: "Asesor comercial", c1: "#0ea5a4", c2: "#1d4ed8",
      about: "Te asesoro para elegir el producto correcto y te acompaño después de la compra.",
      catalogTitle: "Catálogo", catalog: [
        { t: "Línea hogar", d: "Electrodomésticos" },
        { t: "Línea oficina", d: "Mobiliario y equipos" },
        { t: "Promociones del mes", d: "Precios especiales" },
        { t: "Cotización a medida", d: "Para empresas" }],
      hours: "office", cta: { label: "Solicitar cotización", icon: "pen" } },

    { id: "inmobiliaria", cat: "comercio", label: "Inmobiliarias", desc: "Perfil de agentes y sus propiedades.",
      redes: ["facebook", "instagram", "youtube", "tiktok"], icon: "home", style: "dark",
      name: "Horizonte Propiedades", tagline: "Compra, venta y alquiler", c1: "#1e40af", c2: "#0f172a",
      about: "Te acompañamos a encontrar, vender o alquilar tu propiedad con asesoría personalizada en cada paso.",
      catalogTitle: "Propiedades", catalog: [
        { t: "Departamento de 2 dormitorios", d: "Zona Norte · Venta" },
        { t: "Casa con jardín", d: "Zona Sur · Venta" },
        { t: "Oficina amoblada", d: "Centro · Alquiler" },
        { t: "Terreno de 300 m²", d: "Afueras · Venta" }],
      hours: "office", cta: { label: "Agendar visita", icon: "calendar" } },

    { id: "ferreterias", cat: "comercio", label: "Ferreterías", desc: "Catálogo, cotización de materiales y envíos a obra.",
      redes: ["facebook", "instagram", "tiktok", "youtube"], icon: "hammer", style: "classic",
      name: "Ferretería El Constructor", tagline: "Materiales y herramientas", c1: "#ea580c", c2: "#7c2d12",
      about: "Todo para tu obra en un solo lugar. Cotiza tus materiales y te los llevamos.",
      catalogTitle: "Catálogo", catalog: [
        { t: "Cemento y fierro", d: "Por bolsa o por quintal" },
        { t: "Herramientas eléctricas", d: "Taladros, amoladoras" },
        { t: "Pinturas", d: "Interior y exterior" },
        { t: "Envíos a obra", d: "Consulta tu zona" }],
      hours: "shop", cta: { label: "Cotizar materiales", icon: "pen" } },

    { id: "ropa", cat: "comercio", label: "Tiendas de ropa en TikTok", desc: "Catálogo de prendas, pedidos por WhatsApp y aviso de tus lives.",
      redes: ["tiktok", "instagram", "facebook", "pinterest"], icon: "shirt", style: "grad",
      name: "Moda Luna", tagline: "Ropa y accesorios", c1: "#ec4899", c2: "#8b5cf6",
      about: "Prendas nuevas cada semana. Pide por WhatsApp y no te pierdas nuestros lives de ofertas.",
      catalogTitle: "Prendas", catalog: [
        { t: "Blusas", d: "Varios colores", p: "Bs 70" },
        { t: "Jeans", d: "Tallas 34 a 44", p: "Bs 150" },
        { t: "Vestidos", d: "Nueva temporada", p: "Bs 180" },
        { t: "Live de ofertas", d: "Martes y viernes · 20:00 en TikTok" }],
      hours: "shop", cta: { label: "Avísame del próximo live", icon: "tiktok" } },

    /* ---------------- Gastronomía ---------------- */
    { id: "restaurante", cat: "gastro", label: "Restaurantes", desc: "Menú digital, reservas y redes sociales.",
      redes: ["instagram", "tiktok", "facebook", "youtube"], icon: "food", style: "classic",
      name: "La Brasa del Valle", tagline: "Parrilla y comida casera", c1: "#e2552b", c2: "#9a2a16",
      about: "Carnes a la parrilla, platos caseros y un ambiente familiar. Reserva tu mesa o pide para llevar por WhatsApp.",
      catalogTitle: "Menú", catalog: [
        { t: "Parrillada para dos", d: "Carnes surtidas con guarniciones", p: "Bs 120" },
        { t: "Pollo a la brasa", d: "Con papas y ensalada", p: "Bs 55" },
        { t: "Ensalada de la casa", d: "Verduras frescas de temporada", p: "Bs 30" },
        { t: "Limonada natural", d: "Jarra de 1 litro", p: "Bs 18" }],
      hours: { hours: [["Martes a domingo", "12:00 – 23:00"], ["Lunes", "Cerrado"]], schedule: [W(12, 23), null, W(12, 23), W(12, 23), W(12, 23), W(12, 23), W(12, 23)] },
      cta: { label: "Reservar mesa", icon: "calendar" } },

    { id: "reposteros", cat: "gastro", label: "Reposteros", desc: "Catálogo de tortas, pedidos por WhatsApp y reserva de fechas.",
      redes: ["instagram", "tiktok", "facebook", "pinterest"], icon: "cake", style: "classic",
      name: "Dulce Momento", tagline: "Tortas y postres por encargo", c1: "#ec4899", c2: "#9d174d",
      about: "Tortas personalizadas para cumpleaños, bodas y toda ocasión especial. Reserva tu fecha con anticipación.",
      catalogTitle: "Tortas", catalog: [
        { t: "Torta de chocolate", d: "Para 15 personas", p: "Bs 120" },
        { t: "Torta temática", d: "Diseño personalizado", p: "Desde Bs 200" },
        { t: "Cupcakes", d: "Docena decorada", p: "Bs 60" },
        { t: "Mesa dulce", d: "Para eventos · Consulta" }],
      hours: "shop", cta: { label: "Reservar fecha", icon: "calendar" } },

    /* ---------------- Oficios ---------------- */
    { id: "tecnicos", cat: "oficios", label: "Electricistas, plomeros y técnicos", desc: "Visitas técnicas, urgencias y presupuestos.",
      redes: ["facebook", "instagram", "tiktok"], icon: "zap", style: "classic",
      name: "TecnoHogar Servicios", tagline: "Electricidad, plomería y mantenimiento", c1: "#ca8a04", c2: "#713f12",
      about: "Soluciones rápidas y garantizadas para tu casa o negocio. Atendemos urgencias.",
      catalogTitle: "Servicios", catalog: [
        { t: "Instalaciones eléctricas", d: "Tableros, tomas, iluminación" },
        { t: "Plomería y fugas", d: "Reparación e instalación" },
        { t: "Mantenimiento general", d: "Casas y oficinas" },
        { t: "Urgencias", d: "Atención las 24 horas" }],
      hours: "urgent", cta: { label: "Pedir presupuesto", icon: "pen" } },

    { id: "motos", cat: "oficios", label: "Talleres de motos", desc: "Servicios, turnos de revisión y ubicación del taller.",
      redes: ["facebook", "instagram", "tiktok", "youtube"], icon: "bike", style: "dark",
      name: "MotoTaller Ruta", tagline: "Mecánica de motos", c1: "#f97316", c2: "#7c2d12",
      about: "Mecánica general, repuestos y revisión completa para que tu moto esté siempre lista.",
      catalogTitle: "Servicios", catalog: [
        { t: "Mantenimiento general", d: "Revisión completa" },
        { t: "Cambio de aceite", d: "Con filtro" },
        { t: "Frenos y suspensión", d: "Diagnóstico y reparación" },
        { t: "Revisión antes de viajar", d: "Checklist de seguridad" }],
      hours: "shop", cta: { label: "Agendar revisión", icon: "calendar" } },

    /* ---------------- Arte y entretenimiento ---------------- */
    { id: "dj", cat: "arte", label: "Eventos y DJ", desc: "Reserva de fechas, paquetes y galería de eventos.",
      redes: ["instagram", "tiktok", "youtube", "facebook"], icon: "disc", style: "dark", person: true,
      name: "DJ Nico Beats", tagline: "Música para eventos", c1: "#7c3aed", c2: "#db2777",
      about: "Música, sonido e iluminación para que tu evento sea inolvidable.",
      catalogTitle: "Paquetes", catalog: [
        { t: "Bodas", d: "Ceremonia y fiesta" },
        { t: "Quinceañeros", d: "Con show de luces" },
        { t: "Eventos corporativos", d: "Sonido profesional" },
        { t: "Luces y efectos", d: "Adicionales" }],
      hours: "events", cta: { label: "Reservar fecha", icon: "calendar" } },

    { id: "baile", cat: "arte", label: "Escuelas de baile", desc: "Perfil de la academia, horarios y redes sociales.",
      redes: ["instagram", "tiktok", "youtube", "facebook"], icon: "music", style: "classic",
      name: "Montuno Studio", tagline: "Escuela de baile", c1: "#9333ea", c2: "#db2777",
      about: "Clases para todas las edades y niveles. Aprende a bailar en un ambiente divertido, desde cero.",
      catalogTitle: "Clases", catalog: [
        { t: "Salsa", d: "Lunes y miércoles · 19:00" },
        { t: "Bachata", d: "Martes y jueves · 19:00" },
        { t: "Danza urbana juvenil", d: "Sábados · 10:00" },
        { t: "Clase de prueba", d: "Consulta fechas por WhatsApp" }],
      hours: { hours: [["Lunes a viernes", "16:00 – 21:00"], ["Sábado", "09:00 – 13:00"]], schedule: [null, W(16, 21), W(16, 21), W(16, 21), W(16, 21), W(16, 21), W(9, 13)] },
      cta: { label: "Inscribirme", icon: "calendar" } },

    { id: "profesor-baile", cat: "arte", label: "Profesores de baile", desc: "Perfil individual con clases y contacto.",
      redes: ["instagram", "tiktok", "youtube", "facebook"], icon: "music", style: "grad", person: true,
      name: "Prof. Valeria Cruz", tagline: "Profesora de salsa y bachata", c1: "#f43f5e", c2: "#f59e0b",
      about: "Clases particulares y grupales para que bailes con confianza en cualquier fiesta.",
      catalogTitle: "Clases", catalog: [
        { t: "Clases particulares", d: "A domicilio o en estudio" },
        { t: "Clases grupales", d: "Principiantes e intermedios" },
        { t: "Coreografías para eventos", d: "Bodas y quinceañeros" },
        { t: "Clase de prueba", d: "Sin compromiso" }],
      hours: "events", cta: { label: "Reservar clase", icon: "calendar" } },

    { id: "fotografos", cat: "arte", label: "Fotógrafos", desc: "Galería de trabajos y reserva de sesiones.",
      redes: ["instagram", "behance", "pinterest", "facebook"], icon: "camera", style: "dark", person: true,
      name: "Martín Ortiz", tagline: "Fotografía de retratos y eventos", c1: "#64748b", c2: "#0f172a",
      about: "Capturo momentos reales con un estilo natural. Mira mi galería y reserva tu sesión.",
      catalogTitle: "Sesiones", catalog: [
        { t: "Retratos", d: "Estudio o exteriores" },
        { t: "Bodas", d: "Cobertura completa" },
        { t: "Fotografía de productos", d: "Para catálogos y redes" },
        { t: "Sesión familiar", d: "1 hora" }],
      hours: "events", cta: { label: "Reservar sesión", icon: "calendar" } },

    { id: "creadores", cat: "arte", label: "TikTokers y creadores de contenido", desc: "Tu link en la bio: media kit, colaboraciones con marcas y todos tus enlaces.",
      redes: ["tiktok", "instagram", "youtube"], icon: "video", style: "grad", person: true,
      name: "Laura Viaja", tagline: "Creadora de contenido de viajes", c1: "#06b6d4", c2: "#8b5cf6",
      statusText: "Disponible para colaboraciones",
      about: "Comparto destinos, consejos y experiencias de viaje. Si eres una marca, trabajemos juntos.",
      catalogTitle: "Enlaces", catalog: [
        { t: "Media kit", d: "Audiencia y tarifas" },
        { t: "Colaboraciones con marcas", d: "Escríbeme para propuestas" },
        { t: "Mi último video", d: "Ver en TikTok" },
        { t: "Código de descuento", d: "Para mis seguidores" }],
      hours: { hours: [["Respuesta a marcas", "En 24 a 48 horas"], ["Contenido nuevo", "Lunes, miércoles y viernes"]], schedule: null },
      cta: { label: "Trabajemos juntos", icon: "chat" } }
  ];

  /* Rubros que se muestran primero (antes de "Ver todos") */
  var FEATURED = ["farmacia", "restaurante", "medicos", "salones", "inmobiliaria", "profesionales", "ferreterias", "creadores"];

  /* Datos de contacto ficticios generados */
  var STREETS = ["Av. Principal #123", "Calle Los Pinos #45", "Edificio Central, Of. 4B", "Calle Sucre #210", "Av. Las Américas #890", "Calle Bolívar #77", "Av. Libertad #1500", "Pasaje Las Flores #12"];
  LIST.forEach(function (d, i) {
    var h = typeof d.hours === "string" ? HOURS[d.hours] : d.hours;
    d.schedule = h.schedule;
    d.hours = h.hours;
    d.social = d.redes;
    d.summary = d.desc;
    var slug = d.name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/^(arq|lic|dr|dra|ing|prof)\.\s*/, "").replace(/[^a-z0-9]+/g, "");
    d.phone = d.phone || "+591 700 00 " + String(100 + i).slice(-3);
    d.email = d.email || (d.person ? "hola@" : "contacto@") + slug + ".ejemplo";
    d.address = d.address || STREETS[i % STREETS.length];
  });

  window.TD_DEMOS = { CATS: CATS, LIST: LIST, FEATURED: FEATURED };
})();
