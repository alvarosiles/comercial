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
     [data-pv-persona] perfiles de ejemplo; datos en <script type="application/json" data-pv-personas>
                      y campos marcados con [data-pv-field]
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

    /* ---------- Perfiles de ejemplo (rubro / tipo de cliente) ---------- */
    var personaData = null;
    var personaScript = root.querySelector("script[data-pv-personas]");
    if (personaScript) {
      try { personaData = JSON.parse(personaScript.textContent); } catch (e) { personaData = null; }
    }
    var personaBtns = toArray(document.querySelectorAll("[data-pv-persona]"));

    function setPersona(key) {
      var p = personaData && personaData[key];
      if (!p) return;
      device.style.setProperty("--pa", p.accent);
      device.style.setProperty("--pa2", p.accent2);
      device.classList.toggle("is-logo", Boolean(p.logo));
      device.setAttribute("data-persona", key);
      Object.keys(p).forEach(function (field) {
        if (!Array.isArray(p[field])) return;
        var es = p[field][0], en = p[field][1] || es;
        toArray(root.querySelectorAll('[data-pv-field="' + field + '"]')).forEach(function (el) {
          el.setAttribute("data-es", es);
          el.setAttribute("data-en", en);
          el.textContent = lang === "en" ? en : es;
        });
      });
      // Ícono del botón principal (por defecto, calendario)
      var ctaIcon = root.querySelector('[data-pv-field="cta"]');
      ctaIcon = ctaIcon && ctaIcon.parentElement.querySelector("use");
      if (ctaIcon) ctaIcon.setAttribute("href", "#i-" + (p.ctaIcon || "calendar"));

      renderBranches(p.branches);

      // Íconos dinámicos (ej.: segundo canal de contacto: Instagram, Messenger, Telegram…)
      if (p.icons) {
        Object.keys(p.icons).forEach(function (k) {
          toArray(root.querySelectorAll('[data-pv-icon="' + k + '"]')).forEach(function (u) {
            u.setAttribute("href", "#i-" + p.icons[k]);
          });
        });
      }

      // Botones personalizados (portafolio web, GitHub, Figma, tienda online…)
      var linksBox = root.querySelector("[data-pv-links]");
      if (linksBox) {
        linksBox.innerHTML = (p.links || []).map(function (l) {
          var es = esc(l[1]), en = esc(l[2] || l[1]);
          return '<span class="cp-linkbtn"><svg class="icon" aria-hidden="true"><use href="#i-' + l[0] + '"/></svg>' +
            '<span data-es="' + es + '" data-en="' + en + '">' + (lang === "en" ? en : es) + "</span>" +
            '<svg class="icon cp-go" aria-hidden="true"><use href="#i-arrow"/></svg></span>';
        }).join("") + (p.links && p.links.length
          ? '<span class="cp-linkbtn cp-add"><svg class="icon" aria-hidden="true"><use href="#i-plus"/></svg>' +
            '<span data-es="Agrega tus propios enlaces" data-en="Add your own links">' +
            (lang === "en" ? "Add your own links" : "Agrega tus propios enlaces") + "</span></span>"
          : "");
        linksBox.parentElement.hidden = !(p.links && p.links.length);
      }

      // Redes sociales propias de cada perfil (ej.: TikTok para tiendas, GitHub para programadores)
      var socialRow = root.querySelector("[data-pv-social]");
      if (socialRow && Array.isArray(p.social)) {
        var NAMES = { linkedin: "LinkedIn", github: "GitHub", gitlab: "GitLab", figma: "Figma", instagram: "Instagram",
          facebook: "Facebook", tiktok: "TikTok", youtube: "YouTube", x: "X", pinterest: "Pinterest", behance: "Behance" };
        socialRow.innerHTML = p.social.map(function (k) {
          var n = NAMES[k] || k;
          return '<span title="' + n + '" role="img" aria-label="' + n + '"><svg class="icon" aria-hidden="true"><use href="#i-' + k + '"/></svg></span>';
        }).join("");
      }
      personaBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-pv-persona") === key)); });

      // Si el perfil está en otra categoría del selector, mostrar esa categoría
      var chip = document.querySelector('.persona-chips [data-pv-persona="' + key + '"]');
      if (chip && chip.hidden) {
        var box = chip.closest("[data-cat-filter]");
        var tab = box && box.querySelector('[data-cat-tab="' + chip.getAttribute("data-cat") + '"]');
        if (tab) tab.click();
      }
      if (screen) screen.scrollTo({ top: 0, behavior: "smooth" });
      var avatar = root.querySelector(".cp-avatar");
      if (avatar) { avatar.classList.remove("is-new"); void avatar.offsetWidth; avatar.classList.add("is-new"); }
    }

    /* ---------- «Guardar contacto»: descarga una vCard con los datos del perfil ---------- */
    var vcardBtn = root.querySelector("[data-pv-vcard]");
    var toast = root.querySelector("[data-pv-toast]");
    var toastTimer = null;

    function showToast(es, en) {
      if (!toast) return;
      toast.textContent = lang === "en" ? en : es;
      toast.classList.add("show");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 2600);
    }

    function fieldText(name) {
      var el = root.querySelector('[data-pv-field="' + name + '"]');
      return el ? el.textContent.trim() : "";
    }

    function vEsc(t) { return String(t).replace(/\\/g, "\\\\").replace(/([,;])/g, "\\$1"); }

    if (vcardBtn) {
      vcardBtn.addEventListener("click", function () {
        var name = fieldText("name") || "Contacto";
        var site = fieldText("site");
        var vcf = [
          "BEGIN:VCARD", "VERSION:3.0",
          "FN:" + vEsc(name),
          "N:" + vEsc(name) + ";;;;",
          "TITLE:" + vEsc(fieldText("role")),
          site ? "URL:https://" + site : "",
          "NOTE:" + vEsc("Contacto de ejemplo generado por la vista previa de la tarjeta digital"),
          "END:VCARD"
        ].filter(Boolean).join("\r\n");
        try {
          var url = URL.createObjectURL(new Blob([vcf], { type: "text/vcard;charset=utf-8" }));
          var a = document.createElement("a");
          a.href = url;
          a.download = "contacto-ejemplo.vcf";
          document.body.appendChild(a);
          a.click();
          a.remove();
          setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
          showToast("✓ Contacto de ejemplo descargado", "✓ Sample contact downloaded");
        } catch (e) {
          showToast("No se pudo generar el contacto", "Could not create the contact");
        }
      });
    }

    /* ---------- Mapa con varias sucursales ---------- */
    var mapBox = root.querySelector("[data-pv-map]");
    var branchList = root.querySelector("[data-pv-branches]");
    // Posiciones de los pines dentro del mapa (en %)
    var PIN_POS = [[28, 38], [70, 30], [46, 72], [82, 74]];

    function esc(t) {
      return String(t).replace(/[&<>"]/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
      });
    }

    function selectBranch(i) {
      if (!mapBox) return;
      toArray(mapBox.querySelectorAll(".cp-pin")).forEach(function (pin, j) { pin.classList.toggle("active", j === i); });
      toArray(branchList.querySelectorAll("[data-branch]")).forEach(function (b, j) {
        b.setAttribute("aria-pressed", String(j === i));
      });
    }

    function renderBranches(list) {
      if (!mapBox || !branchList) return;
      if (!Array.isArray(list) || !list.length) {
        mapBox.classList.remove("multi");
        mapBox.innerHTML = '<svg class="icon"><use href="#i-pin"/></svg>';
        branchList.innerHTML = "";
        branchList.hidden = true;
        return;
      }
      mapBox.classList.add("multi");
      mapBox.innerHTML = list.map(function (b, i) {
        var pos = PIN_POS[i % PIN_POS.length];
        return '<span class="cp-pin" style="left:' + pos[0] + "%;top:" + pos[1] + '%">' + (i + 1) + "</span>";
      }).join("");
      branchList.innerHTML = list.map(function (b, i) {
        var es = esc(b[0]), en = esc(b[1] || b[0]);
        return '<li><button type="button" data-branch="' + i + '" aria-pressed="false">' +
          '<span class="cp-num">' + (i + 1) + "</span>" +
          '<span class="cp-branch-txt"><b data-es="' + es + '" data-en="' + en + '">' + (lang === "en" ? en : es) + "</b>" +
          "<small>" + esc(b[2] || "") + "</small></span></button></li>";
      }).join("");
      branchList.hidden = false;
      selectBranch(0);
    }

    if (branchList) {
      branchList.addEventListener("click", function (e) {
        var btn = e.target.closest("[data-branch]");
        if (btn) selectBranch(Number(btn.getAttribute("data-branch")));
      });
    }

    personaBtns.forEach(function (b) {
      b.addEventListener("click", function () {
        setPersona(b.getAttribute("data-pv-persona"));
        // Si el prototipo no está a la vista (ej.: «Ver ejemplo» más abajo), llevar hasta él
        var r = device.getBoundingClientRect();
        if (r.top < 0 || r.bottom > window.innerHeight) device.scrollIntoView({ block: "center" });
      });
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

    // Cargar el perfil marcado por defecto (redes, colores y textos coherentes desde el inicio)
    var initialPersona = personaBtns.filter(function (b) { return b.getAttribute("aria-pressed") === "true"; })[0];
    if (initialPersona) setPersona(initialPersona.getAttribute("data-pv-persona"));

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
