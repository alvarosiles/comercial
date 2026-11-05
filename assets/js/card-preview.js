/* =========================================================
   Prototipo interactivo de la Tarjeta Digital (tarjetas-digitales.html)
   Muestra solo lo que incluye cada plan:
     .lv-2 → aparece desde el Paquete Recomendado
     .lv-3 → aparece solo en el Paquete Avanzado
   ========================================================= */
(function () {
  "use strict";

  var root = document.querySelector(".card-proto");
  if (!root) return;

  var phone = root.querySelector(".cp-phone");
  var screen = root.querySelector(".cp-screen");
  var radios = Array.prototype.slice.call(root.querySelectorAll('[role="radio"]'));
  var themeBtn = root.querySelector("[data-cp-theme]");
  var langBtn = root.querySelector("[data-cp-lang]");
  var title = root.querySelector("[data-cp-title]");
  var desc = root.querySelector("[data-cp-desc]");
  var hint = root.querySelector("[data-cp-hint]");

  var PLANS = {
    1: {
      title: "Plan Inicial",
      desc: "Incluye foto, datos, WhatsApp, llamadas, correo, redes sociales y código QR.",
      hint: "Desliza dentro del teléfono para ver toda la tarjeta."
    },
    2: {
      title: "Paquete Recomendado",
      desc: "Suma disponibilidad, ubicación en Google Maps, agenda de reuniones, proyectos y modo claro/oscuro.",
      hint: "Prueba el botón de modo claro/oscuro arriba a la derecha."
    },
    3: {
      title: "Paquete Avanzado",
      desc: "Suma métodos de pago y apoyo, cambio de idioma, QR con tu marca y diseño personalizado.",
      hint: "Prueba el cambio de idioma ES / EN."
    }
  };

  var level = 1;
  var lang = "es";

  /* ---------- Código QR decorativo (determinista) ---------- */
  function buildQR() {
    var box = root.querySelector(".cp-qr");
    var N = 21, seed = 7, cells = "";
    function rand() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
    function inFinder(x, y) {
      return (x < 7 && y < 7) || (x > N - 8 && y < 7) || (x < 7 && y > N - 8);
    }
    for (var y = 0; y < N; y++) {
      for (var x = 0; x < N; x++) {
        if (!inFinder(x, y) && rand() > 0.52) cells += '<rect x="' + x + '" y="' + y + '" width="1" height="1"/>';
      }
    }
    function finder(x, y) {
      return '<rect x="' + x + '" y="' + y + '" width="7" height="7"/>' +
        '<rect x="' + (x + 1) + '" y="' + (y + 1) + '" width="5" height="5" class="qr-bg"/>' +
        '<rect x="' + (x + 2) + '" y="' + (y + 2) + '" width="3" height="3"/>';
    }
    var svg = '<svg viewBox="0 0 ' + N + " " + N + '" shape-rendering="crispEdges">' +
      cells + finder(0, 0) + finder(N - 7, 0) + finder(0, N - 7) + "</svg>";
    box.insertAdjacentHTML("afterbegin", svg);
  }

  /* ---------- Idioma ---------- */
  function setLang(next) {
    lang = next;
    root.querySelectorAll("[data-es]").forEach(function (el) {
      el.textContent = el.getAttribute("data-" + lang);
    });
    langBtn.textContent = lang.toUpperCase();
  }

  /* ---------- Modo claro / oscuro ---------- */
  function setLight(light) {
    phone.classList.toggle("light", light);
    themeBtn.setAttribute("aria-label", light ? "Cambiar a modo oscuro" : "Cambiar a modo claro");
    themeBtn.querySelector("use").setAttribute("href", light ? "#i-sun" : "#i-moon");
  }

  /* ---------- Cambio de plan ---------- */
  function setLevel(next, focus) {
    var prev = level;
    level = next;

    radios.forEach(function (r) {
      var on = Number(r.getAttribute("data-level")) === next;
      r.setAttribute("aria-checked", String(on));
      r.tabIndex = on ? 0 : -1;
      if (on && focus) r.focus();
    });

    phone.setAttribute("data-level", String(next));
    root.setAttribute("data-level", String(next));

    // Reset de funciones que el plan ya no incluye
    if (next < 2) setLight(false);
    if (next < 3 && lang !== "es") setLang("es");

    title.textContent = PLANS[next].title;
    desc.textContent = PLANS[next].desc;
    hint.textContent = PLANS[next].hint;

    // Resaltar lo nuevo y desplazar el teléfono hasta ahí
    root.querySelectorAll(".is-new").forEach(function (el) { el.classList.remove("is-new"); });
    if (next > prev) {
      var added = [];
      for (var l = prev + 1; l <= next; l++) {
        added = added.concat(Array.prototype.slice.call(root.querySelectorAll(".cp-phone .lv-" + l)));
      }
      added.forEach(function (el) {
        void el.offsetWidth; // reinicia la animación
        el.classList.add("is-new");
      });
      var firstBlock = added.filter(function (el) { return el.classList.contains("cp-block"); })[0];
      if (firstBlock) screen.scrollTo({ top: Math.max(firstBlock.offsetTop - 80, 0), behavior: "smooth" });
    } else {
      screen.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  radios.forEach(function (r, i) {
    r.addEventListener("click", function () { setLevel(Number(r.getAttribute("data-level"))); });
    r.addEventListener("keydown", function (e) {
      var j = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") j = (i + 1) % radios.length;
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") j = (i - 1 + radios.length) % radios.length;
      if (j !== null) { e.preventDefault(); setLevel(Number(radios[j].getAttribute("data-level")), true); }
    });
  });

  themeBtn.addEventListener("click", function () { setLight(!phone.classList.contains("light")); });
  langBtn.addEventListener("click", function () { setLang(lang === "es" ? "en" : "es"); });

  // Enlaces "Ver vista previa" desde las tarjetas de planes
  document.querySelectorAll("[data-preview-level]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      root.scrollIntoView({ block: "center" });
      setLevel(Number(btn.getAttribute("data-preview-level")));
    });
  });

  buildQR();
})();
