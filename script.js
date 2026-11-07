/* =========================================================
   Naseer Ahmad | Portfolio scripts
   ========================================================= */

(function () {
  "use strict";

  // CHANGE THIS to your real email address. The contact form opens
  // the visitor's email app with their message addressed to it.
  var CONTACT_EMAIL = "your-email@example.com";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Email icon ---------- */
  var emailLink = document.getElementById("emailLink");
  if (emailLink) emailLink.setAttribute("href", "mailto:" + CONTACT_EMAIL);

  /* ---------- Navbar: shadow on scroll ---------- */
  var navbar = document.getElementById("navbar");
  function onScroll() {
    navbar.classList.toggle("scrolled", window.scrollY > 10);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Navbar: mobile menu ---------- */
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");

  function setMenu(open) {
    links.classList.toggle("open", open);
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  toggle.addEventListener("click", function () {
    setMenu(!links.classList.contains("open"));
  });

  links.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () { setMenu(false); });
  });

  document.addEventListener("click", function (e) {
    if (!navbar.contains(e.target)) setMenu(false);
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 720) setMenu(false);
  });

  /* ---------- Navbar: highlight the section being viewed ---------- */
  var navAnchors = Array.prototype.slice.call(links.querySelectorAll("a"));
  var sections = navAnchors
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  function setActive() {
    var line = window.scrollY + window.innerHeight * 0.35;
    var current = sections[0];
    sections.forEach(function (s) {
      if (s.offsetTop <= line) current = s;
    });
    // At the very bottom, the last section is active
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
      current = sections[sections.length - 1];
    }
    navAnchors.forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("href") === "#" + current.id);
    });
  }
  window.addEventListener("scroll", setActive, { passive: true });
  window.addEventListener("resize", setActive);
  setActive();

  /* ---------- Typing effect in hero ---------- */
  var typedEl = document.getElementById("typed");
  var roles = [
    "BS Computer Science student",
    "Web developer",
    "Flutter developer",
    "Learning SAP ABAP"
  ];

  if (typedEl) {
    if (reduceMotion) {
      typedEl.textContent = roles[0];
    } else {
      var roleIndex = 0, charIndex = 0, deleting = false;

      (function type() {
        var word = roles[roleIndex];
        typedEl.textContent = word.substring(0, charIndex);

        var delay = deleting ? 40 : 85;

        if (!deleting && charIndex === word.length) {
          deleting = true;
          delay = 1600;
        } else if (deleting && charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          delay = 400;
        } else {
          charIndex += deleting ? -1 : 1;
        }
        setTimeout(type, delay);
      })();
    }
  }

  /* ---------- Skill bars fill when scrolled into view ---------- */
  var fills = document.querySelectorAll(".bar-fill");

  function fillBar(el) { el.style.width = el.getAttribute("data-level") + "%"; }

  if ("IntersectionObserver" in window && !reduceMotion) {
    var barObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          fillBar(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    fills.forEach(function (f) { barObserver.observe(f); });
  } else {
    fills.forEach(fillBar);
  }

  /* ---------- Profile photo fallback ---------- */
  var profileImg = document.getElementById("profileImg");
  var photoFrame = profileImg ? profileImg.parentElement : null;

  function showFallback() { if (photoFrame) photoFrame.classList.add("no-photo"); }

  if (profileImg) {
    profileImg.addEventListener("error", showFallback);
    if (profileImg.complete && profileImg.naturalWidth === 0) showFallback();
  }

  /* ---------- Certificate viewer ---------- */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxTitle = document.getElementById("lightboxTitle");
  var lightboxClose = document.getElementById("lightboxClose");
  var lastFocus = null;

  function openLightbox(src, title) {
    lastFocus = document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = title;
    lightboxTitle.textContent = title;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = "";
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }

  document.querySelectorAll(".cert").forEach(function (card) {
    card.addEventListener("click", function () {
      openLightbox(card.getAttribute("data-full"), card.getAttribute("data-title"));
    });
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
  });

  /* ---------- Contact form ---------- */
  var form = document.getElementById("contactForm");
  var statusEl = document.getElementById("formStatus");

  function setError(id, message) {
    var input = document.getElementById(id);
    document.getElementById(id + "Error").textContent = message;
    input.parentElement.classList.toggle("invalid", Boolean(message));
    input.setAttribute("aria-invalid", message ? "true" : "false");
    return !message;
  }

  function validate() {
    var name = form.elements.name.value.trim();
    var email = form.elements.email.value.trim();
    var message = form.elements.message.value.trim();
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

    var okName = setError("name", name.length < 2 ? "Enter your name." : "");
    var okEmail = setError("email", !email ? "Enter your email address." : (emailOk ? "" : "Enter a valid email, like name@example.com."));
    var okMsg = setError("message", message.length < 10 ? "Write a message of at least 10 characters." : "");

    return okName && okEmail && okMsg;
  }

  if (form) {
    ["name", "email", "message"].forEach(function (id) {
      document.getElementById(id).addEventListener("input", function () {
        if (this.parentElement.classList.contains("invalid")) validate();
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      statusEl.className = "form-status";
      statusEl.textContent = "";

      if (!validate()) {
        statusEl.classList.add("fail");
        statusEl.textContent = "Fix the highlighted fields and try again.";
        return;
      }

      var name = form.elements.name.value.trim();
      var email = form.elements.email.value.trim();
      var message = form.elements.message.value.trim();

      var subject = "Portfolio message from " + name;
      var body = message + "\n\nFrom: " + name + " (" + email + ")";

      window.location.href =
        "mailto:" + CONTACT_EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      statusEl.classList.add("ok");
      statusEl.textContent = "Your email app is opening. Press send there to finish.";
      form.reset();
    });
  }
})();