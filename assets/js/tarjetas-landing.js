/**
 * Landing de Tarjetas Digitales — interacciones.
 * - Datos de contacto: se leen de assets/js/config.js (window.SITE_CONFIG).
 * - Demostraciones: datos FICTICIOS definidos en DEMOS.
 * Sin dependencias, salvo qrcode-generator (CDN) para los códigos QR (opcional).
 */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
   * Configuración
   * ------------------------------------------------------------------ */
  var CFG = window.SITE_CONFIG || {};
  var SOCIAL = CFG.social || {};

  /* ------------------------------------------------------------------
   * Utilidades
   * ------------------------------------------------------------------ */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function icon(name) {
    return '<svg class="ic" aria-hidden="true"><use href="#i-' + name + '"/></svg>';
  }
  function pageUrl() { return location.href.split("#")[0]; }

  /** URL de contacto real: WhatsApp si está configurado; si no, correo. */
  function contactUrl(msg) {
    var wa = String(CFG.whatsapp || "").replace(/\D/g, "");
    if (wa) return "https://wa.me/" + wa + "?text=" + encodeURIComponent(msg);
    if (CFG.email) {
      return "mailto:" + CFG.email + "?subject=" + encodeURIComponent("Solicitud de tarjeta digital") +
        "&body=" + encodeURIComponent(msg);
    }
    return "#contacto";
  }
  function setContactLink(a, msg) {
    var url = contactUrl(msg);
    a.setAttribute("href", url);
    if (url.indexOf("https://") === 0) { a.target = "_blank"; a.rel = "noopener"; }
    else { a.removeAttribute("target"); }
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy") ? resolve() : reject(); } catch (e) { reject(e); }
      document.body.removeChild(ta);
    });
  }

  /** Genera un QR en SVG. Devuelve "" si la librería no está disponible. */
  function qrSvg(text, dark) {
    if (typeof window.qrcode !== "function") return "";
    try {
      var qr = window.qrcode(0, "M");
      qr.addData(text); qr.make();
      var n = qr.getModuleCount(), m = 2, d = "";
      for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) if (qr.isDark(r, c)) d += "M" + (c + m) + " " + (r + m) + "h1v1h-1z";
      var s = n + m * 2;
      return '<svg viewBox="0 0 ' + s + " " + s + '" shape-rendering="crispEdges" aria-hidden="true"><rect width="100%" height="100%" fill="#fff"/><path d="' + d + '" fill="' + (dark || "#0b1626") + '"/></svg>';
    } catch (e) { return ""; }
  }
  function qrFallback() {
    return '<div class="qr-fallback">' + icon("qr") + "<span>Código QR</span></div>";
  }

  /* ------------------------------------------------------------------
   * Datos de demostración (FICTICIOS)
   * schedule: índice 0 = domingo … 6 = sábado → [horaApertura, horaCierre] o null
   * ------------------------------------------------------------------ */
  var DEMOS = {
    farmacia: {
      label: "Farmacia", icon: "pill",
      name: "Farmacia Vida Sana", tagline: "Tu salud, cerca de casa",
      c1: "#0f9f8f", c2: "#0b5f7a",
      summary: "Servicios, entregas a domicilio y horario visible.",
      about: "Medicamentos, cuidado personal y atención farmacéutica con trato cercano. Hacemos entregas a domicilio dentro de la zona.",
      phone: "+591 700 00 001", email: "contacto@vidasana.ejemplo", address: "Av. Principal #123, Zona Centro",
      hours: [["Lunes a sábado", "08:00 – 22:00"], ["Domingo", "09:00 – 14:00"]],
      schedule: [[9, 14], [8, 22], [8, 22], [8, 22], [8, 22], [8, 22], [8, 22]],
      catalogTitle: "Servicios",
      catalog: [
        { t: "Medicamentos con y sin receta", d: "Consulta disponibilidad por WhatsApp" },
        { t: "Control de presión arterial", d: "Sin cita previa" },
        { t: "Aplicación de inyectables", d: "Con personal capacitado" },
        { t: "Entrega a domicilio", d: "Dentro de la zona" }
      ],
      social: ["facebook", "instagram"]
    },
    restaurante: {
      label: "Restaurante", icon: "food",
      name: "La Brasa del Valle", tagline: "Parrilla y comida casera",
      c1: "#e2552b", c2: "#9a2a16",
      summary: "Menú con precios, reservas por WhatsApp y ubicación.",
      about: "Carnes a la parrilla, platos caseros y un ambiente familiar. Reserva tu mesa o pide para llevar por WhatsApp.",
      phone: "+591 700 00 002", email: "reservas@labrasa.ejemplo", address: "Calle Los Pinos #45, Zona Sur",
      hours: [["Martes a domingo", "12:00 – 23:00"], ["Lunes", "Cerrado"]],
      schedule: [[12, 23], null, [12, 23], [12, 23], [12, 23], [12, 23], [12, 23]],
      catalogTitle: "Menú",
      catalog: [
        { t: "Parrillada para dos", d: "Carnes surtidas con guarniciones", p: "Bs 120" },
        { t: "Pollo a la brasa", d: "Con papas y ensalada", p: "Bs 55" },
        { t: "Ensalada de la casa", d: "Verduras frescas de temporada", p: "Bs 30" },
        { t: "Limonada natural", d: "Jarra de 1 litro", p: "Bs 18" }
      ],
      social: ["facebook", "instagram", "tiktok"]
    },
    inmobiliaria: {
      label: "Inmobiliaria", icon: "home",
      name: "Horizonte Propiedades", tagline: "Compra, venta y alquiler",
      c1: "#1e40af", c2: "#0f172a",
      summary: "Propiedades destacadas y contacto directo con el asesor.",
      about: "Te acompañamos a encontrar, vender o alquilar tu propiedad con asesoría personalizada en cada paso.",
      phone: "+591 700 00 003", email: "asesor@horizonte.ejemplo", address: "Edificio Central, Of. 4B",
      hours: [["Lunes a viernes", "09:00 – 18:00"], ["Sábado", "09:00 – 13:00"]],
      schedule: [null, [9, 18], [9, 18], [9, 18], [9, 18], [9, 18], [9, 13]],
      catalogTitle: "Propiedades",
      catalog: [
        { t: "Departamento de 2 dormitorios", d: "Zona Norte · Venta" },
        { t: "Casa con jardín", d: "Zona Sur · Venta" },
        { t: "Oficina amoblada", d: "Centro · Alquiler" },
        { t: "Terreno de 300 m²", d: "Afueras · Venta" }
      ],
      social: ["facebook", "instagram"]
    },
    baile: {
      label: "Escuela de baile", icon: "music",
      name: "Ritmo Studio", tagline: "Escuela de baile",
      c1: "#9333ea", c2: "#db2777",
      summary: "Clases y horarios, inscripción por WhatsApp y redes.",
      about: "Clases para todas las edades y niveles. Aprende a bailar en un ambiente divertido, desde cero.",
      phone: "+591 700 00 004", email: "hola@ritmostudio.ejemplo", address: "Calle Sucre #210, 2.º piso",
      hours: [["Lunes a viernes", "16:00 – 21:00"], ["Sábado", "09:00 – 13:00"]],
      schedule: [null, [16, 21], [16, 21], [16, 21], [16, 21], [16, 21], [9, 13]],
      catalogTitle: "Clases",
      catalog: [
        { t: "Salsa", d: "Lunes y miércoles · 19:00" },
        { t: "Bachata", d: "Martes y jueves · 19:00" },
        { t: "Danza urbana juvenil", d: "Sábados · 10:00" },
        { t: "Clase de prueba", d: "Consulta fechas por WhatsApp" }
      ],
      social: ["instagram", "tiktok", "facebook"]
    },
    profesional: {
      label: "Profesional independiente", icon: "briefcase",
      name: "Arq. Daniel Rojas", tagline: "Arquitectura e interiores",
      c1: "#334155", c2: "#0f172a",
      summary: "Servicios, atención con cita y guardar contacto.",
      about: "Diseño de viviendas, remodelaciones e interiores. Atención con cita previa en oficina o a domicilio.",
      phone: "+591 700 00 005", email: "daniel@rojasarq.ejemplo", address: "Av. Las Américas #890",
      hours: [["Lunes a viernes", "09:00 – 18:00"], ["Fines de semana", "Con cita"]],
      schedule: [null, [9, 18], [9, 18], [9, 18], [9, 18], [9, 18], null],
      catalogTitle: "Servicios",
      catalog: [
        { t: "Diseño de viviendas", d: "Proyecto completo" },
        { t: "Planos y trámites", d: "Aprobación municipal" },
        { t: "Remodelaciones", d: "Cocinas, baños y ampliaciones" },
        { t: "Diseño de interiores", d: "Espacios funcionales" }
      ],
      social: ["instagram", "facebook"]
    },
    otro: {
      label: "Tu negocio", icon: "store",
      name: "Mi Negocio", tagline: "Atención de calidad cerca de ti",
      c1: "#0ea5a4", c2: "#1d4ed8",
      summary: "",
      about: "Aquí va una breve descripción de tu negocio: qué ofreces y por qué tus clientes deberían elegirte.",
      phone: "+591 700 00 000", email: "contacto@tunegocio.ejemplo", address: "Dirección de tu local",
      hours: [["Lunes a viernes", "08:30 – 18:30"], ["Sábado", "09:00 – 13:00"]],
      schedule: [null, [8, 19], [8, 19], [8, 19], [8, 19], [8, 19], [9, 13]],
      catalogTitle: "Catálogo",
      catalog: [
        { t: "Tu producto o servicio principal", d: "Descripción breve" },
        { t: "Segundo servicio", d: "Descripción breve" },
        { t: "Promoción del mes", d: "Detalle de la oferta" }
      ],
      social: ["facebook", "instagram", "tiktok"]
    }
  };
  var DEMO_ORDER = ["farmacia", "restaurante", "inmobiliaria", "baile", "profesional"];

  var COLORS = [
    { name: "Turquesa", c1: "#0ea5a4", c2: "#1d4ed8" },
    { name: "Azul", c1: "#2563eb", c2: "#1e1b4b" },
    { name: "Verde", c1: "#16a34a", c2: "#065f46" },
    { name: "Naranja", c1: "#ea580c", c2: "#9a3412" },
    { name: "Morado", c1: "#9333ea", c2: "#db2777" },
    { name: "Rojo", c1: "#dc2626", c2: "#7f1d1d" },
    { name: "Grafito", c1: "#334155", c2: "#0f172a" }
  ];

  /* ------------------------------------------------------------------
   * Estado de apertura
   * ------------------------------------------------------------------ */
  function openStatus(d) {
    var now = new Date(), slot = d.schedule && d.schedule[now.getDay()];
    var h = now.getHours() + now.getMinutes() / 60;
    if (slot && h >= slot[0] && h < slot[1]) {
      return { open: true, text: "Abierto ahora · cierra " + String(slot[1]).padStart(2, "0") + ":00" };
    }
    return { open: false, text: "Cerrado ahora" };
  }

  /* ------------------------------------------------------------------
   * Render de una tarjeta digital
   * ------------------------------------------------------------------ */
  function renderCard(d, opts) {
    opts = opts || {};
    var st = openStatus(d);
    var initials = d.name.replace(/^(Arq|Lic|Dr|Dra|Ing)\.\s*/i, "").split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0); }).join("").toUpperCase();

    var catalog = d.catalog.map(function (it) {
      return '<li><div><strong>' + esc(it.t) + "</strong><span>" + esc(it.d) + "</span></div>" +
        (it.p ? '<em class="dc-price">' + esc(it.p) + "</em>" : "") + "</li>";
    }).join("");

    var hours = d.hours.map(function (h) {
      return "<li><span>" + esc(h[0]) + "</span><strong>" + esc(h[1]) + "</strong></li>";
    }).join("");

    var social = d.social.map(function (s) {
      var labels = { facebook: "Facebook", instagram: "Instagram", tiktok: "TikTok" };
      return '<button type="button" class="dc-soc" data-act="social" data-net="' + s + '" aria-label="' + labels[s] + '">' + icon(s) + "</button>";
    }).join("");

    return '' +
      '<div class="dc" style="--c1:' + d.c1 + ";--c2:" + d.c2 + '">' +
        '<div class="dc-cover">' +
          '<span class="dc-badge">' + esc(opts.badge || "Ejemplo · datos ficticios") + "</span>" +
        "</div>" +
        '<div class="dc-head">' +
          '<div class="dc-logo" aria-hidden="true">' + icon(d.icon) + "</div>" +
          '<h3 class="dc-name">' + esc(d.name) + "</h3>" +
          '<p class="dc-tag">' + esc(d.tagline) + "</p>" +
          '<span class="dc-status ' + (st.open ? "is-open" : "is-closed") + '">' + esc(st.text) + "</span>" +
        "</div>" +
        '<div class="dc-actions">' +
          '<button type="button" data-act="call">' + icon("phone") + "<span>Llamar</span></button>" +
          '<button type="button" data-act="whatsapp" class="is-wa">' + icon("whatsapp") + "<span>WhatsApp</span></button>" +
          '<button type="button" data-act="mail">' + icon("mail") + "<span>Correo</span></button>" +
          '<button type="button" data-act="map">' + icon("pin") + "<span>Mapa</span></button>" +
        "</div>" +
        '<div class="dc-tabs" role="tablist">' +
          '<button type="button" role="tab" data-tab="info" aria-selected="true">Inicio</button>' +
          '<button type="button" role="tab" data-tab="catalog" aria-selected="false">' + esc(d.catalogTitle) + "</button>" +
          '<button type="button" role="tab" data-tab="hours" aria-selected="false">Horarios</button>' +
        "</div>" +
        '<div class="dc-panel" data-panel="info">' +
          '<div class="dc-photo" aria-hidden="true"><span>' + esc(initials) + "</span>" + icon("image") + "</div>" +
          "<p>" + esc(d.about) + "</p>" +
          '<p class="dc-line">' + icon("pin") + esc(d.address) + "</p>" +
          '<p class="dc-line">' + icon("mail") + esc(d.email) + "</p>" +
        "</div>" +
        '<div class="dc-panel" data-panel="catalog" hidden><ul class="dc-list">' + catalog + "</ul></div>" +
        '<div class="dc-panel" data-panel="hours" hidden><ul class="dc-hours">' + hours + "</ul></div>" +
        '<div class="dc-social">' + social + "</div>" +
        '<div class="dc-cta">' +
          '<button type="button" class="dc-save" data-act="save">' + icon("user-plus") + "Guardar contacto</button>" +
          '<button type="button" class="dc-share" data-act="share" aria-label="Compartir y ver código QR">' + icon("qr") + "</button>" +
        "</div>" +
        '<p class="dc-foot">Tarjeta digital de demostración</p>' +
      "</div>";
  }

  /* Cada teléfono guarda los datos de la tarjeta que muestra */
  var phoneData = new WeakMap();

  function mountCard(phone, data, opts) {
    var screen = $(".phone-screen", phone);
    var activeTab = (function () {
      var t = $('.dc-tabs [aria-selected="true"]', screen);
      return t ? t.getAttribute("data-tab") : null;
    })();
    screen.innerHTML = renderCard(data, opts);
    phoneData.set(phone, data);
    if (activeTab && opts && opts.keepTab) selectTab(phone, activeTab);
    if (!$(".phone-layer", phone)) {
      var layer = document.createElement("div");
      layer.className = "phone-layer";
      layer.innerHTML = '<div class="p-toast" role="status" aria-live="polite"></div>' +
        '<div class="p-sheet" hidden><div class="p-sheet-card">' +
          '<button type="button" class="p-sheet-close" data-act="close-sheet" aria-label="Cerrar">' + icon("x") + "</button>" +
          '<strong class="p-sheet-title">Comparte esta tarjeta</strong>' +
          '<div class="p-qr"></div>' +
          '<p class="p-sheet-note">Escanéalo con la cámara de otro celular.</p>' +
          '<button type="button" class="btn btn-primary btn-sm btn-block" data-act="copy">' + icon("copy") + " Copiar enlace</button>" +
        "</div></div>";
      phone.appendChild(layer);
    }
    closeSheet(phone);
  }

  function selectTab(phone, tab) {
    $$(".dc-tabs [role=tab]", phone).forEach(function (b) {
      b.setAttribute("aria-selected", String(b.getAttribute("data-tab") === tab));
    });
    $$(".dc-panel", phone).forEach(function (p) { p.hidden = p.getAttribute("data-panel") !== tab; });
  }

  var toastTimers = new WeakMap();
  function toast(phone, html) {
    var el = $(".p-toast", phone);
    if (!el) return;
    el.innerHTML = html;
    el.classList.add("show");
    clearTimeout(toastTimers.get(phone));
    toastTimers.set(phone, setTimeout(function () { el.classList.remove("show"); }, 3600));
  }

  function openSheet(phone) {
    var sheet = $(".p-sheet", phone);
    var url = pageUrl() + "#demos";
    var svg = qrSvg(url);
    $(".p-qr", sheet).innerHTML = svg || qrFallback();
    sheet.hidden = false;
    requestAnimationFrame(function () { sheet.classList.add("open"); });
  }
  function closeSheet(phone) {
    var sheet = $(".p-sheet", phone);
    if (!sheet) return;
    sheet.classList.remove("open");
    sheet.hidden = true;
  }

  /* vCard real (datos ficticios) para "Guardar contacto" */
  function downloadVCard(d) {
    var vcf = [
      "BEGIN:VCARD", "VERSION:3.0",
      "FN:" + d.name + " (ejemplo)",
      "ORG:" + d.name,
      "TITLE:" + d.tagline,
      "TEL;TYPE=CELL:" + d.phone.replace(/\s/g, ""),
      "EMAIL:" + d.email,
      "ADR;TYPE=WORK:;;" + d.address + ";;;;",
      "NOTE:Contacto de demostración con datos ficticios.",
      "END:VCARD"
    ].join("\r\n");
    var blob = new Blob([vcf], { type: "text/vcard;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = d.name.replace(/[^\wÀ-ÿ]+/g, "-").replace(/^-|-$/g, "") + "-ejemplo.vcf";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1500);
  }

  var ACTION_MSG = {
    call: function (d) { return icon("phone") + "<span>En tu tarjeta real, esto <b>inicia una llamada</b> a tu número (" + esc(d.phone) + ").</span>"; },
    whatsapp: function () { return icon("whatsapp") + "<span>En tu tarjeta real, se <b>abre WhatsApp</b> con un mensaje listo: “Hola, vi su tarjeta digital…”.</span>"; },
    mail: function (d) { return icon("mail") + "<span>En tu tarjeta real, se <b>abre el correo</b> dirigido a " + esc(d.email) + ".</span>"; },
    map: function () { return icon("pin") + "<span>En tu tarjeta real, se <b>abre Google Maps</b> con la ruta hasta tu local.</span>"; },
    social: function (d, net) {
      var n = { facebook: "Facebook", instagram: "Instagram", tiktok: "TikTok" }[net] || "tu red social";
      return icon(net) + "<span>En tu tarjeta real, se <b>abre tu perfil de " + n + "</b>.</span>";
    }
  };

  /* Delegación de eventos para todas las tarjetas */
  document.addEventListener("click", function (e) {
    var phone = e.target.closest(".phone");
    if (!phone) return;
    var data = phoneData.get(phone);
    if (!data) return;

    var tabBtn = e.target.closest("[data-tab]");
    if (tabBtn) { selectTab(phone, tabBtn.getAttribute("data-tab")); return; }

    var btn = e.target.closest("[data-act]");
    if (!btn) return;
    var act = btn.getAttribute("data-act");

    if (act === "save") {
      downloadVCard(data);
      toast(phone, icon("check") + "<span>Contacto descargado. Ábrelo para <b>guardarlo en tu agenda</b>.</span>");
    } else if (act === "share") {
      openSheet(phone);
    } else if (act === "close-sheet") {
      closeSheet(phone);
    } else if (act === "copy") {
      copyText(pageUrl() + "#demos").then(function () {
        toast(phone, icon("check") + "<span>Enlace copiado. Pégalo en WhatsApp para compartirlo.</span>");
      }, function () {
        toast(phone, icon("info") + "<span>No se pudo copiar automáticamente.</span>");
      });
      closeSheet(phone);
    } else if (ACTION_MSG[act]) {
      toast(phone, ACTION_MSG[act](data, btn.getAttribute("data-net")));
    }
  });

  /* ------------------------------------------------------------------
   * Tarjetas estáticas (hero y comparación)
   * ------------------------------------------------------------------ */
  $$(".phone[data-card]").forEach(function (p) {
    var d = DEMOS[p.getAttribute("data-card")];
    if (d) mountCard(p, d);
  });

  /* ------------------------------------------------------------------
   * Galería de demostraciones + modal
   * ------------------------------------------------------------------ */
  var grid = $("#demoGrid");
  grid.innerHTML = DEMO_ORDER.map(function (id) {
    var d = DEMOS[id];
    return '<article class="demo-card reveal" style="--c1:' + d.c1 + ";--c2:" + d.c2 + '">' +
      '<div class="demo-top"><span class="demo-ic">' + icon(d.icon) + "</span>" +
        '<span class="demo-mini" aria-hidden="true"><i></i><i></i><i></i></span></div>' +
      '<div class="demo-body">' +
        '<span class="demo-label">' + esc(d.label) + "</span>" +
        "<h3>" + esc(d.name) + "</h3>" +
        "<p>" + esc(d.summary) + "</p>" +
        '<button type="button" class="btn btn-light btn-block" data-open-demo="' + id + '">' + icon("eye") + " Ver tarjeta</button>" +
      "</div></article>";
  }).join("");

  var modal = $("#demoModal");
  var modalPhone = $("#modalPhone");
  var lastFocus = null;

  function showDemo(id) {
    var d = DEMOS[id];
    mountCard(modalPhone, d);
    $(".phone-screen", modalPhone).scrollTop = 0;
    $("#modalTitle").textContent = d.label + ": " + d.name;
    $("#modalDesc").textContent = d.summary + " Pruébala como lo haría tu cliente.";
    var cta = $("#modalCta");
    var msg = "Hola, vi la demostración de " + d.label.toLowerCase() + " y quiero una tarjeta digital para mi negocio.";
    cta.setAttribute("data-msg", msg);
    setContactLink(cta, msg);
    $("#modalSwitch").innerHTML = DEMO_ORDER.map(function (k) {
      return '<button type="button" class="chip' + (k === id ? " active" : "") + '" data-open-demo="' + k + '" aria-pressed="' + (k === id) + '">' +
        icon(DEMOS[k].icon) + esc(DEMOS[k].label) + "</button>";
    }).join("");
  }

  function openModal(id) {
    lastFocus = document.activeElement;
    showDemo(id);
    modal.hidden = false;
    document.body.classList.add("no-scroll");
    requestAnimationFrame(function () { modal.classList.add("open"); });
    $(".modal-close", modal).focus();
  }
  function closeModal() {
    modal.classList.remove("open");
    document.body.classList.remove("no-scroll");
    setTimeout(function () { modal.hidden = true; }, 200);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.addEventListener("click", function (e) {
    var opener = e.target.closest("[data-open-demo]");
    if (opener) {
      var id = opener.getAttribute("data-open-demo");
      if (modal.hidden) openModal(id); else showDemo(id);
      return;
    }
    if (e.target.closest("[data-close]")) closeModal();
  });

  document.addEventListener("keydown", function (e) {
    if (modal.hidden) return;
    if (e.key === "Escape") { closeModal(); return; }
    if (e.key === "Tab") {
      var f = $$('button, [href], input, select, [tabindex]:not([tabindex="-1"])', modal).filter(function (el) { return el.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ------------------------------------------------------------------
   * Constructor "Arma tu tarjeta"
   * ------------------------------------------------------------------ */
  var form = $("#builderForm");
  var builderPhone = $("#builderPhone");
  var swatchBox = $("#swatches");
  var colorIdx = 0;

  swatchBox.innerHTML = COLORS.map(function (c, i) {
    return '<button type="button" class="swatch" role="radio" aria-checked="' + (i === 0) + '" aria-label="' + c.name + '" data-color="' + i + '" style="--c1:' + c.c1 + ";--c2:" + c.c2 + '"></button>';
  }).join("");

  function builderData() {
    var base = DEMOS[form.rubro.value] || DEMOS.otro;
    var c = COLORS[colorIdx];
    var name = form.elements.name.value.trim();
    var tag = form.tagline.value.trim();
    return Object.assign({}, base, {
      name: name || (form.rubro.value === "otro" ? "Mi Negocio" : base.name),
      tagline: tag || base.tagline,
      c1: c.c1, c2: c.c2,
      label: base.label
    });
  }

  function updateBuilder(keepTab) {
    var d = builderData();
    mountCard(builderPhone, d, { badge: "Vista previa", keepTab: keepTab });
    var rubroText = form.rubro.options[form.rubro.selectedIndex].text;
    var msg = "Hola, quiero solicitar una tarjeta digital.\n" +
      "• Negocio: " + (form.elements.name.value.trim() || "(por definir)") + "\n" +
      "• Rubro: " + rubroText + "\n" +
      (form.tagline.value.trim() ? "• Eslogan: " + form.tagline.value.trim() + "\n" : "") +
      "• Color preferido: " + COLORS[colorIdx].name;
    setContactLink($("#builderSend"), msg);
  }

  form.addEventListener("input", function () { updateBuilder(true); });
  form.addEventListener("submit", function (e) { e.preventDefault(); });
  swatchBox.addEventListener("click", function (e) {
    var b = e.target.closest(".swatch");
    if (!b) return;
    colorIdx = +b.getAttribute("data-color");
    $$(".swatch", swatchBox).forEach(function (s) { s.setAttribute("aria-checked", String(s === b)); });
    updateBuilder(true);
  });
  swatchBox.addEventListener("keydown", function (e) {
    if (["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].indexOf(e.key) < 0) return;
    e.preventDefault();
    var dir = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1;
    var next = (colorIdx + dir + COLORS.length) % COLORS.length;
    var btn = $('[data-color="' + next + '"]', swatchBox);
    btn.click(); btn.focus();
  });
  updateBuilder(false);

  /* ------------------------------------------------------------------
   * Compartir: enlace y QR de esta página
   * ------------------------------------------------------------------ */
  var shareUrl = $("#shareUrl");
  shareUrl.textContent = location.protocol.indexOf("http") === 0 ? location.host + location.pathname : "tunegocio.com/tu-tarjeta";

  $("#copyLink").addEventListener("click", function () {
    var btn = this, original = btn.innerHTML;
    copyText(pageUrl()).then(function () {
      btn.innerHTML = icon("check") + " ¡Enlace copiado!";
      btn.classList.add("ok");
    }, function () {
      btn.innerHTML = icon("info") + " No se pudo copiar";
    });
    setTimeout(function () { btn.innerHTML = original; btn.classList.remove("ok"); }, 2200);
  });

  function paintPageQr() {
    var box = $("#pageQr");
    box.innerHTML = qrSvg(pageUrl()) || qrFallback();
  }
  if (typeof window.qrcode === "function") paintPageQr();
  else window.addEventListener("load", paintPageQr);

  /* ------------------------------------------------------------------
   * Contacto (desde config.js)
   * ------------------------------------------------------------------ */
  $$(".js-contact").forEach(function (a) { setContactLink(a, a.getAttribute("data-msg")); });

  (function buildContactLinks() {
    var list = $("#contactLinks");
    var items = [];
    var wa = String(CFG.whatsapp || "").replace(/\D/g, "");
    if (wa) items.push({ ic: "whatsapp", label: "WhatsApp", value: CFG.phoneLabel || "+" + wa, href: contactUrl("Hola, quiero información sobre las tarjetas digitales.") });
    if (CFG.email) items.push({ ic: "mail", label: "Correo", value: CFG.email, href: "mailto:" + CFG.email + "?subject=" + encodeURIComponent("Tarjeta digital") });
    if (SOCIAL.facebook) items.push({ ic: "facebook", label: "Facebook", value: "Síguenos", href: SOCIAL.facebook });
    if (SOCIAL.instagram) items.push({ ic: "instagram", label: "Instagram", value: "Síguenos", href: SOCIAL.instagram });
    if (SOCIAL.tiktok) items.push({ ic: "tiktok", label: "TikTok", value: "Síguenos", href: SOCIAL.tiktok });
    if (SOCIAL.linkedin) items.push({ ic: "briefcase", label: "LinkedIn", value: "Perfil profesional", href: SOCIAL.linkedin });

    /* Pie de página: contacto en texto */
    var fc = $("#footerContact");
    fc.innerHTML = items.map(function (it) {
      var ext = it.href.indexOf("http") === 0;
      return '<li><a href="' + esc(it.href) + '"' + (ext ? ' target="_blank" rel="noopener"' : "") + ">" + esc(it.label === "Correo" ? it.value : it.label) + "</a></li>";
    }).join("") + (CFG.location ? "<li>" + esc(CFG.location) + "</li>" : "");

    /* Botón flotante de WhatsApp */
    if (wa) {
      var fl = $("#waFloat");
      setContactLink(fl, "Hola, quiero información sobre las tarjetas digitales.");
      fl.hidden = false;
    }

    if (CFG.location) items.push({ ic: "pin", label: "Ubicación", value: CFG.location, href: "" });
    list.innerHTML = items.map(function (it) {
      if (!it.href) {
        return '<li><div class="cl-static"><span class="cl-ic ' + it.ic + '">' + icon(it.ic) + "</span>" +
          "<span><small>" + esc(it.label) + "</small><strong>" + esc(it.value) + "</strong></span></div></li>";
      }
      var ext = it.href.indexOf("http") === 0;
      return '<li><a href="' + esc(it.href) + '"' + (ext ? ' target="_blank" rel="noopener"' : "") + ">" +
        '<span class="cl-ic ' + it.ic + '">' + icon(it.ic) + "</span>" +
        "<span><small>" + esc(it.label) + "</small><strong>" + esc(it.value) + "</strong></span>" +
        icon("arrow") + "</a></li>";
    }).join("");
    if (!items.length) list.hidden = true;
  })();

  /* ------------------------------------------------------------------
   * Quién soy (desde config.js)
   * ------------------------------------------------------------------ */
  if (CFG.name) $$(".js-name").forEach(function (el) { el.textContent = CFG.name; });
  if (CFG.role) $$(".js-role").forEach(function (el) { el.textContent = CFG.role; });
  if (CFG.name) {
    $("#aboutInitials").textContent = CFG.name.split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0); }).join("").toUpperCase();
  }
  if (CFG.photo) {
    var img = new Image();
    img.alt = "Foto de " + (CFG.name || "perfil");
    img.onload = function () { var box = $("#aboutPhoto"); box.innerHTML = ""; box.appendChild(img); };
    img.src = CFG.photo;
  }
  var loc = $("#aboutLoc");
  if (CFG.location) $("span", loc).textContent = CFG.location; else loc.hidden = true;
  $("#year").textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------
   * Formulario de contacto
   * Sin backend: arma el mensaje y abre WhatsApp o el correo para que el
   * cliente lo envíe. Si config.formEndpoint existe, envía por POST (JSON).
   * ------------------------------------------------------------------ */
  (function contactForm() {
    var f = $("#contactForm");
    var status = $("#cfStatus");
    var waNum = String(CFG.whatsapp || "").replace(/\D/g, "");
    if (!waNum) $("#cfWa").hidden = true;
    if (!CFG.email) $("#cfMail").hidden = true;
    if (!waNum && !CFG.email && !CFG.formEndpoint) { $("#cfMail").hidden = false; }
    if (CFG.formEndpoint) {
      $("#cfWa").hidden = true;
      $("#cfMail").hidden = false;
      $("#cfMail").innerHTML = icon("send") + " Enviar solicitud";
      $(".cf-legal", f).innerHTML = 'Al enviar aceptas la <a href="privacidad.html">política de privacidad</a>.';
    } else if (!waNum && CFG.email) {
      $("#cfMail").className = "btn btn-primary";
    }

    /* Plan/rubro preseleccionado desde los botones de la página */
    $$("[data-plan]").forEach(function (b) {
      b.addEventListener("click", function () { f.plan.value = b.getAttribute("data-plan"); });
    });

    var MSG = {
      valueMissing: "Este campo es obligatorio.",
      tooShort: "Escribe un poco más, por favor."
    };
    function check(el) {
      var err = el.closest(".cf-field") && $(".cf-error", el.closest(".cf-field"));
      var ok = el.checkValidity();
      el.classList.toggle("invalid", !ok);
      if (err) err.textContent = ok ? "" : (el.validity.valueMissing ? MSG.valueMissing : MSG.tooShort);
      return ok;
    }
    $$("input, select, textarea", f).forEach(function (el) {
      el.addEventListener("blur", function () { if (el.value) check(el); });
      el.addEventListener("input", function () { if (el.classList.contains("invalid")) check(el); });
    });

    function compose() {
      return "Hola, quiero solicitar una tarjeta digital.\n" +
        "• Nombre: " + f.nombre.value.trim() + "\n" +
        (f.negocio.value.trim() ? "• Negocio: " + f.negocio.value.trim() + "\n" : "") +
        "• Tipo de negocio: " + f.rubro.value + "\n" +
        "• Plan de interés: " + (f.plan.value || "Aún no lo sé") + "\n" +
        (f.nfc.checked ? "• Me interesa la tarjeta física con NFC\n" : "") +
        "• Detalle: " + f.mensaje.value.trim();
    }

    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var fields = $$("[required]", f);
      var valid = fields.map(check).every(Boolean);
      if (!valid) {
        status.className = "cf-status err";
        status.textContent = "Revisa los campos marcados.";
        var first = $(".invalid", f); if (first) first.focus();
        return;
      }
      var channel = e.submitter ? e.submitter.getAttribute("data-channel") : (waNum ? "whatsapp" : "email");
      var text = compose();

      if (CFG.formEndpoint) {
        status.className = "cf-status"; status.textContent = "Enviando…";
        fetch(CFG.formEndpoint, {
          method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ nombre: f.nombre.value, negocio: f.negocio.value, rubro: f.rubro.value, plan: f.plan.value, nfc: f.nfc.checked, mensaje: f.mensaje.value })
        }).then(function (r) {
          if (!r.ok) throw new Error(r.status);
          status.className = "cf-status ok"; status.textContent = "¡Gracias! Recibimos tu solicitud y te responderemos pronto.";
          f.reset();
        }).catch(function () {
          status.className = "cf-status err"; status.textContent = "No se pudo enviar. Inténtalo de nuevo o escríbenos directamente.";
        });
        return;
      }

      var url;
      if (channel === "whatsapp" && waNum) {
        url = "https://wa.me/" + waNum + "?text=" + encodeURIComponent(text);
        window.open(url, "_blank", "noopener");
      } else if (CFG.email) {
        url = "mailto:" + CFG.email + "?subject=" + encodeURIComponent("Solicitud de tarjeta digital") + "&body=" + encodeURIComponent(text);
        location.href = url;
      } else {
        status.className = "cf-status err";
        status.textContent = "Aún no hay un canal de contacto configurado.";
        return;
      }
      status.className = "cf-status ok";
      status.textContent = channel === "whatsapp" && waNum
        ? "Se abrió WhatsApp con tu mensaje. Solo presiona enviar."
        : "Se abrió tu correo con el mensaje listo. Solo presiona enviar.";
    });
  })();

  /* ------------------------------------------------------------------
   * Navegación móvil y cabecera
   * ------------------------------------------------------------------ */
  var toggle = $("#navToggle"), links = $("#navLinks"), header = $(".site-header");
  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  links.addEventListener("click", function (e) {
    if (e.target.closest("a")) { links.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); }
  });
  function onScroll() { header.classList.toggle("scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------------------------------
   * Animaciones de aparición
   * ------------------------------------------------------------------ */
  var reveals = $$(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 70 + "ms";
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }
})();
