/* =========================================================
   Lógica del sitio — sin dependencias
   ========================================================= */
(function () {
  "use strict";

  var CONFIG = window.SITE_CONFIG || {};
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  var SOCIAL_LABELS = { linkedin: "LinkedIn", github: "GitHub", instagram: "Instagram", facebook: "Facebook" };

  /* ---------- Helpers de contacto ---------- */
  function cleanNumber(n) { return String(n || "").replace(/\D/g, ""); }
  function hasWhatsApp() { return cleanNumber(CONFIG.whatsapp).length >= 8; }
  function hasEmail() { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(CONFIG.email || ""); }

  function waUrl(message) {
    return "https://wa.me/" + cleanNumber(CONFIG.whatsapp) + "?text=" + encodeURIComponent(message);
  }
  function mailUrl(subject, body) {
    return "mailto:" + CONFIG.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  }
  function quoteMessage(product) {
    return product
      ? "Hola " + (CONFIG.name || "") + ", me interesa solicitar una cotización para: " + product + "."
      : "Hola " + (CONFIG.name || "") + ", me gustaría recibir información sobre tus servicios.";
  }

  /* ---------- 1. Aplicar configuración ---------- */
  function applyConfig() {
    $$("[data-text]").forEach(function (el) {
      var v = CONFIG[el.getAttribute("data-text")];
      if (v) el.textContent = v;
    });

    $$('[data-link="whatsapp"]').forEach(function (el) {
      if (hasWhatsApp()) el.href = waUrl(quoteMessage(""));
      else { el.removeAttribute("target"); el.href = "#contacto"; }
    });
    $$('[data-link="email"]').forEach(function (el) {
      if (hasEmail()) el.href = "mailto:" + CONFIG.email;
    });

    var social = CONFIG.social || {};
    $$("[data-social]").forEach(function (row) {
      Object.keys(SOCIAL_LABELS).forEach(function (key) {
        if (!social[key]) return;
        var a = document.createElement("a");
        a.href = social[key];
        a.target = "_blank";
        a.rel = "noopener";
        a.setAttribute("aria-label", SOCIAL_LABELS[key]);
        a.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#i-' + key + '"/></svg>';
        row.appendChild(a);
      });
    });

    if (CONFIG.photo) {
      $$("[data-photo]").forEach(function (box) {
        var img = new Image();
        img.alt = "Fotografía de " + (CONFIG.name || "perfil");
        img.width = 128; img.height = 128;
        img.onload = function () { box.innerHTML = ""; box.appendChild(img); };
        img.src = CONFIG.photo;
      });
    }

    $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  /* ---------- 2. Header y navegación ---------- */
  function initNav() {
    var header = $(".site-header");
    var nav = $("#nav");
    var toggle = $(".nav-toggle");

    function setOpen(open) {
      nav.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    }
    toggle.addEventListener("click", function () { setOpen(!nav.classList.contains("open")); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) { setOpen(false); toggle.focus(); }
    });
    window.matchMedia("(min-width: 960px)").addEventListener("change", function () { setOpen(false); });

    function onScroll() { header.classList.toggle("scrolled", window.scrollY > 8); }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Enlace activo según la sección visible
    if (!("IntersectionObserver" in window)) return;
    var links = $$(".nav-link");
    var map = {};
    links.forEach(function (l) { map[l.getAttribute("href").slice(1)] = l; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        if (id === "detalle") id = "productos";
        if (id === "metodologia" || id === "tecnologias") id = "servicios";
        if (id === "faq") id = "sobre-mi";
        links.forEach(function (l) { l.classList.remove("active"); l.removeAttribute("aria-current"); });
        if (map[id]) { map[id].classList.add("active"); map[id].setAttribute("aria-current", "true"); }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").forEach(function (s) { spy.observe(s); });
  }

  /* ---------- 3. Tabs de detalle de producto ---------- */
  var activateTab;
  function initTabs() {
    var tabs = $$('[role="tab"]');

    activateTab = function (tab, focus) {
      tabs.forEach(function (t) {
        var selected = t === tab;
        t.setAttribute("aria-selected", String(selected));
        t.tabIndex = selected ? 0 : -1;
        document.getElementById(t.getAttribute("aria-controls")).hidden = !selected;
      });
      if (focus) tab.focus();
    };

    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { activateTab(tab); });
      tab.addEventListener("keydown", function (e) {
        var next = null;
        if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
        else if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (e.key === "Home") next = tabs[0];
        else if (e.key === "End") next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); activateTab(next, true); }
      });
    });

    // Botones "Ver detalles"
    $$("[data-detail]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var tab = document.getElementById("tab-" + btn.getAttribute("data-detail"));
        if (!tab) return;
        activateTab(tab);
        document.getElementById("detalle").scrollIntoView();
      });
    });
  }

  /* ---------- 4. Acciones comerciales ---------- */
  function goToForm(product) {
    var select = $("#f-product");
    if (product && select) {
      var match = $$("option", select).filter(function (o) { return o.value === product; })[0];
      if (match) select.value = product;
    }
    document.getElementById("contacto").scrollIntoView();
    var name = $("#f-name");
    if (name) setTimeout(function () { name.focus({ preventScroll: true }); }, 450);
  }

  function initActions() {
    // "Solicitar información" → formulario con el producto preseleccionado
    $$("[data-request]").forEach(function (btn) {
      btn.addEventListener("click", function () { goToForm(btn.getAttribute("data-request")); });
    });

    // "Cotizar por WhatsApp" → abre WhatsApp con el mensaje armado
    $$("[data-wa]").forEach(function (el) {
      var product = el.getAttribute("data-wa");
      if (el.tagName === "A" && hasWhatsApp()) {
        el.href = waUrl(quoteMessage(product));
        el.target = "_blank";
        el.rel = "noopener";
        return;
      }
      el.addEventListener("click", function (e) {
        e.preventDefault();
        if (hasWhatsApp()) window.open(waUrl(quoteMessage(product)), "_blank", "noopener");
        else goToForm(product);
      });
    });
  }

  /* ---------- 5. Formulario de contacto ---------- */
  function initForm() {
    var form = $("#contact-form");
    if (!form) return;
    var status = $(".form-status", form);
    var primaryBtn = $('[data-channel="primary"]', form);
    var emailBtn = $('[data-channel="email"]', form);
    var useEndpoint = Boolean(CONFIG.formEndpoint);
    var lastChannel = "primary";

    if (useEndpoint) {
      $("[data-primary-label]", primaryBtn).textContent = "Enviar solicitud";
      primaryBtn.querySelector("use").setAttribute("href", "#i-arrow");
    } else if (!hasWhatsApp()) {
      primaryBtn.hidden = true;
    }
    if (!hasEmail()) emailBtn.hidden = true;
    if (primaryBtn.hidden && emailBtn.hidden) {
      setStatus("El formulario aún no tiene un canal de envío configurado (WhatsApp, correo o endpoint en assets/js/config.js).", "err");
    }

    $$("[data-channel]", form).forEach(function (b) {
      b.addEventListener("click", function () { lastChannel = b.getAttribute("data-channel"); });
    });

    var rules = {
      nombre: function (v) { return v.length < 2 ? "Ingresa tu nombre." : ""; },
      correo: function (v) {
        if (!v) return "Ingresa tu correo electrónico.";
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "" : "Ingresa un correo válido (ej: nombre@empresa.com).";
      },
      producto: function (v) { return v ? "" : "Selecciona el producto o servicio de interés."; },
      mensaje: function (v) { return v.length < 15 ? "Cuéntame un poco más sobre tu proyecto (mínimo 15 caracteres)." : ""; }
    };

    function validateField(field) {
      var rule = rules[field.name];
      if (!rule) return true;
      var msg = rule(field.value.trim());
      var err = document.getElementById(field.getAttribute("aria-describedby"));
      field.setAttribute("aria-invalid", msg ? "true" : "false");
      if (err) err.textContent = msg;
      return !msg;
    }

    $$("input, select, textarea", form).forEach(function (field) {
      field.addEventListener("blur", function () { if (field.value) validateField(field); });
      field.addEventListener("input", function () {
        if (field.getAttribute("aria-invalid") === "true") validateField(field);
      });
    });

    function setStatus(msg, type) {
      status.textContent = msg;
      status.className = "form-status field-full" + (type ? " " + type : "");
    }

    function collect() {
      return {
        nombre: form.nombre.value.trim(),
        correo: form.correo.value.trim(),
        empresa: form.empresa.value.trim(),
        producto: form.producto.value,
        mensaje: form.mensaje.value.trim()
      };
    }

    function buildText(d) {
      return [
        "Hola " + (CONFIG.name || "") + ", quiero solicitar una cotización.",
        "",
        "• Nombre: " + d.nombre,
        "• Correo: " + d.correo,
        d.empresa ? "• Empresa/negocio: " + d.empresa : null,
        "• Producto de interés: " + d.producto,
        "",
        "Proyecto:",
        d.mensaje
      ].filter(function (l) { return l !== null; }).join("\n");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var channel = (e.submitter && e.submitter.getAttribute("data-channel")) || lastChannel;

      var fields = $$("[name]", form).filter(function (f) { return rules[f.name]; });
      var firstInvalid = null;
      fields.forEach(function (f) { if (!validateField(f) && !firstInvalid) firstInvalid = f; });
      if (firstInvalid) {
        setStatus("Revisa los campos marcados.", "err");
        firstInvalid.focus();
        return;
      }

      var data = collect();

      if (channel === "email") {
        window.location.href = mailUrl("Solicitud de cotización — " + data.producto, buildText(data));
        setStatus("Se abrió tu aplicación de correo con la solicitud. Envíala desde allí para completar el contacto.", "ok");
        return;
      }

      if (useEndpoint) {
        primaryBtn.disabled = true;
        setStatus("Enviando…", "");
        fetch(CONFIG.formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(data)
        })
          .then(function (res) {
            if (!res.ok) throw new Error("HTTP " + res.status);
            form.reset();
            setStatus("¡Solicitud enviada! Te responderé a la brevedad.", "ok");
          })
          .catch(function () {
            setStatus("No se pudo enviar la solicitud. Intenta nuevamente o escríbeme por WhatsApp o correo.", "err");
          })
          .then(function () { primaryBtn.disabled = false; });
        return;
      }

      if (hasWhatsApp()) {
        window.open(waUrl(buildText(data)), "_blank", "noopener");
        setStatus("Se abrió WhatsApp con tu solicitud. Solo falta presionar «Enviar» en la conversación.", "ok");
      }
    });
  }

  /* ---------- 6. Animaciones de aparición ---------- */
  function initReveal() {
    var items = $$(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        io.unobserve(el);
        el.classList.add("visible");
        // Al terminar, se limpian clases y retardo para no interferir con los efectos hover
        setTimeout(function () {
          el.classList.remove("reveal", "visible");
          el.style.transitionDelay = "";
        }, 1000);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach(function (el, i) {
      // Escalonado sutil dentro de grillas
      var siblings = el.parentElement ? el.parentElement.children.length : 1;
      if (siblings > 2) el.style.transitionDelay = Math.min((i % 4) * 70, 210) + "ms";
      io.observe(el);
    });
  }

  applyConfig();
  initNav();
  initTabs();
  initActions();
  initForm();
  initReveal();
})();
