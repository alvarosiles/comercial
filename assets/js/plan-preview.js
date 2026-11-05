/* =========================================================
   Prototipos interactivos por plan (tarjetas y portafolios)

   Estructura esperada:
     [data-plan-preview]                 contenedor
       [role=radio][data-level]          selector de plan (data-title / data-desc / data-hint)
       .pv-device[data-level]            dispositivo que cambia según el plan
         .pv-screen                      área con scroll
         .lv-2 / .lv-3                   visible desde el plan 2 / solo en el plan 3
       [data-pv-title] [data-pv-desc] [data-pv-hint]   leyenda
   Opcionales:
     [data-pv-theme]  modo claro/oscuro (plan 2+)
     [data-pv-lang]   idioma ES/EN (plan 3) — textos con data-es / data-en
     [data-pv-view]   vista escritorio / celular
     [data-pv-open="id"] / [data-pv-close]  paneles de detalle
     [data-pv-go="id"] / [data-pv-page="id"] navegación entre secciones (mini-app)
     [data-pv-role]   cambio de rol; oculta [data-admin-only] con data-role="seller"
     [data-pv-branch] cambio de sucursal; textos con data-b1 / data-b2
     .pv-qr           código QR decorativo
     [data-preview-level] (fuera del contenedor) enlaces "Ver vista previa"
   ========================================================= */
(function () {
  "use strict";

  var toArray = function (list) { return Array.prototype.slice.call(list); };

  function buildQR(box) {
    var N = 21, seed = 7, cells = "";
    function rand() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
    function inFinder(x, y) { return (x < 7 && y < 7) || (x > N - 8 && y < 7) || (x < 7 && y > N - 8); }
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
    box.insertAdjacentHTML("afterbegin",
      '<svg viewBox="0 0 ' + N + " " + N + '" shape-rendering="crispEdges">' +
      cells + finder(0, 0) + finder(N - 7, 0) + finder(0, N - 7) + "</svg>");
  }

  function initPreview(root) {
    var device = root.querySelector(".pv-device");
    var screen = root.querySelector(".pv-screen");
    var radios = toArray(root.querySelectorAll('[role="radio"][data-level]'));
    var themeBtn = root.querySelector("[data-pv-theme]");
    var langBtn = root.querySelector("[data-pv-lang]");
    var title = root.querySelector("[data-pv-title]");
    var desc = root.querySelector("[data-pv-desc]");
    var hint = root.querySelector("[data-pv-hint]");
    var level = 1;
    var lang = "es";

    function setLang(next) {
      lang = next;
      toArray(root.querySelectorAll("[data-es]")).forEach(function (el) {
        el.textContent = el.getAttribute("data-" + lang);
      });
      if (langBtn) langBtn.textContent = lang.toUpperCase();
    }

    function setLight(light) {
      if (!themeBtn) return;
      device.classList.toggle("light", light);
      themeBtn.setAttribute("aria-label", light ? "Cambiar a modo oscuro" : "Cambiar a modo claro");
      themeBtn.querySelector("use").setAttribute("href", light ? "#i-sun" : "#i-moon");
    }

    /* ---------- Mini-app: secciones, roles y sucursales ---------- */
    var navs = toArray(root.querySelectorAll("[data-pv-go]"));
    var pages = toArray(root.querySelectorAll("[data-pv-page]"));
    var roleBtns = toArray(root.querySelectorAll("[data-pv-role]"));
    var branchBtns = toArray(root.querySelectorAll("[data-pv-branch]"));
    var currentPage = navs.length ? navs[0].getAttribute("data-pv-go") : null;

    function isShown(el) { return window.getComputedStyle(el).display !== "none"; }

    function goTo(id) {
      if (!pages.length) return;
      currentPage = id;
      pages.forEach(function (p) { p.hidden = p.getAttribute("data-pv-page") !== id; });
      navs.forEach(function (n) {
        if (n.getAttribute("data-pv-go") === id) n.setAttribute("aria-current", "page");
        else n.removeAttribute("aria-current");
      });
      if (screen) screen.scrollTop = 0;
    }

    // Si la sección actual ya no está disponible (plan o rol), volver al inicio
    function ensurePage() {
      if (!navs.length) return;
      var cur = navs.filter(function (n) { return n.getAttribute("data-pv-go") === currentPage; })[0];
      if (!cur || !isShown(cur)) goTo(navs[0].getAttribute("data-pv-go"));
    }

    function setPressed(list, value, attr) {
      list.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute(attr) === value)); });
    }

    function setRole(role) {
      device.setAttribute("data-role", role);
      setPressed(roleBtns, role, "data-pv-role");
      ensurePage();
    }

    function setBranch(n) {
      toArray(root.querySelectorAll("[data-b1]")).forEach(function (el) {
        el.textContent = el.getAttribute("data-b" + n);
      });
      setPressed(branchBtns, n, "data-pv-branch");
    }

    navs.forEach(function (n) {
      n.addEventListener("click", function () { goTo(n.getAttribute("data-pv-go")); });
    });
    roleBtns.forEach(function (b) {
      b.addEventListener("click", function () { setRole(b.getAttribute("data-pv-role")); });
    });
    branchBtns.forEach(function (b) {
      b.addEventListener("click", function () { setBranch(b.getAttribute("data-pv-branch")); });
    });

    function closePanels() {
      toArray(root.querySelectorAll(".pv-panel.open")).forEach(function (p) { p.classList.remove("open"); });
    }

    function setLevel(next, focus) {
      var prev = level;
      level = next;

      radios.forEach(function (r) {
        var on = Number(r.getAttribute("data-level")) === next;
        r.setAttribute("aria-checked", String(on));
        r.tabIndex = on ? 0 : -1;
        if (on) {
          if (focus) r.focus();
          if (title) title.textContent = r.getAttribute("data-title") || "";
          if (desc) desc.textContent = r.getAttribute("data-desc") || "";
          if (hint) hint.textContent = r.getAttribute("data-hint") || "";
        }
      });

      device.setAttribute("data-level", String(next));
      root.setAttribute("data-level", String(next));

      // Desactivar funciones que el plan elegido no incluye
      if (next < 2) setLight(false);
      if (next < 3) { if (lang !== "es") setLang("es"); closePanels(); }
      if (next < 2 && roleBtns.length) setRole("admin");
      if (next < 3 && branchBtns.length) setBranch("1");
      if (navs.length) goTo(navs[0].getAttribute("data-pv-go"));

      toArray(root.querySelectorAll(".is-new")).forEach(function (el) { el.classList.remove("is-new"); });
      if (next > prev) {
        var added = [];
        for (var l = prev + 1; l <= next; l++) {
          added = added.concat(toArray(device.querySelectorAll(".lv-" + l)));
        }
        added.forEach(function (el) { void el.offsetWidth; el.classList.add("is-new"); });
        var target = added.filter(function (el) { return el.hasAttribute("data-pv-scroll"); })[0];
        if (target && screen) screen.scrollTo({ top: Math.max(target.offsetTop - 70, 0), behavior: "smooth" });
      } else if (screen) {
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

    if (themeBtn) themeBtn.addEventListener("click", function () { setLight(!device.classList.contains("light")); });
    if (langBtn) langBtn.addEventListener("click", function () { setLang(lang === "es" ? "en" : "es"); });

    // Vista escritorio / celular
    toArray(root.querySelectorAll("[data-pv-view]")).forEach(function (btn, _, all) {
      btn.addEventListener("click", function () {
        var mobile = btn.getAttribute("data-pv-view") === "mobile";
        device.classList.toggle("is-mobile", mobile);
        all.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
      });
    });

    // Paneles de detalle (ej.: página de cada proyecto)
    toArray(root.querySelectorAll("[data-pv-open]")).forEach(function (el) {
      el.addEventListener("click", function () {
        if (level < 3) return;
        var panel = root.querySelector('[data-pv-panel="' + el.getAttribute("data-pv-open") + '"]');
        if (!panel) return;
        panel.classList.add("open");
        panel.scrollTop = 0;
        var close = panel.querySelector("[data-pv-close]");
        if (close) close.focus();
      });
    });
    toArray(root.querySelectorAll("[data-pv-close]")).forEach(function (el) {
      el.addEventListener("click", closePanels);
    });

    toArray(root.querySelectorAll(".pv-qr")).forEach(buildQR);

    // Enlaces "Ver vista previa de este plan"
    toArray(document.querySelectorAll("[data-preview-level]")).forEach(function (btn) {
      btn.addEventListener("click", function () {
        root.scrollIntoView({ block: "center" });
        setLevel(Number(btn.getAttribute("data-preview-level")));
      });
    });
  }

  toArray(document.querySelectorAll("[data-plan-preview]")).forEach(initPreview);
})();
