/* Marc Arboleda — Portfolio. Vanilla JS, no dependencies. */
(function () {
  "use strict";
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return [].slice.call((c || document).querySelectorAll(s)); }

  /* ---------- Theme toggle ---------- */
  var themeBtn = $(".theme-btn");
  var metaTheme = $('meta[name="theme-color"]');
  function applyTheme(t) {
    root.setAttribute("data-theme", t);
    if (metaTheme) metaTheme.setAttribute("content", t === "dark" ? "#0c1512" : "#eef0ec");
    try { localStorage.setItem("theme", t); } catch (e) {}
  }
  if (metaTheme && root.getAttribute("data-theme") === "dark") metaTheme.setAttribute("content", "#0c1512");
  if (themeBtn) themeBtn.addEventListener("click", function () {
    applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
  });

  /* ---------- Mobile menu ---------- */
  var menuBtn = $(".menu-btn");
  var navLinks = $("#nav-links");
  function setMenu(open) {
    if (!menuBtn) return;
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    navLinks.classList.toggle("open", open);
  }
  if (menuBtn) {
    menuBtn.addEventListener("click", function () { setMenu(menuBtn.getAttribute("aria-expanded") !== "true"); });
    navLinks.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
  }

  /* ---------- Landing: split the name into letters ---------- */
  $$("[data-split]").forEach(function (line, li) {
    var text = line.textContent;
    line.textContent = "";
    line.classList.add("split");
    var base = 250 + li * 320;
    text.split("").forEach(function (ch, i) {
      var s = document.createElement("span");
      s.className = "char" + (ch === " " ? " sp" : "");
      s.style.setProperty("--i", i);
      s.style.setProperty("--base", base + "ms");
      s.setAttribute("aria-hidden", "true");
      s.textContent = ch === " " ? " " : ch;
      line.appendChild(s);
    });
  });

  /* ---------- Landing: rotating role words ---------- */
  var words = $$(".rotator span");
  if (words.length > 1 && !reduce) {
    var wi = 0;
    setInterval(function () {
      var cur = words[wi];
      wi = (wi + 1) % words.length;
      cur.classList.remove("on");
      cur.classList.add("off");
      words[wi].classList.remove("off");
      words[wi].classList.add("on");
      setTimeout(function () { cur.classList.remove("off"); }, 650);
    }, 2600);
  }

  /* ---------- Landing: soft mouse parallax ---------- */
  var landing = $("#landing");
  if (landing && finePointer && !reduce) {
    landing.addEventListener("pointermove", function (e) {
      var r = landing.getBoundingClientRect();
      landing.style.setProperty("--mx", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
      landing.style.setProperty("--my", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
    });
    landing.addEventListener("pointerleave", function () {
      landing.style.setProperty("--mx", 0);
      landing.style.setProperty("--my", 0);
    });
  }

  /* ---------- Tools marquee: clone for a seamless loop ---------- */
  $$(".marquee .track").forEach(function (track) {
    var items = [].slice.call(track.children);
    for (var n = 0; n < 2; n++) {
      items.forEach(function (li) {
        var c = li.cloneNode(true);
        c.setAttribute("aria-hidden", "true");
        track.appendChild(c);
      });
    }
  });

  /* ---------- Reveal on scroll ---------- */
  var reveals = $$(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Scroll spy + progress bar ---------- */
  var sections = $$("[data-section]");
  var links = {};
  $$("[data-spy]").forEach(function (a) { links[a.getAttribute("data-spy")] = a; });
  var pbar = $(".progress i");
  var ticking = false;
  function update() {
    ticking = false;
    var vh = window.innerHeight, y = window.scrollY, current = null;
    sections.forEach(function (s) {
      if (s.getBoundingClientRect().top <= vh * 0.4) current = s.getAttribute("data-section");
    });
    if (vh + y >= document.documentElement.scrollHeight - 4) current = sections[sections.length - 1].getAttribute("data-section");
    Object.keys(links).forEach(function (id) { links[id].classList.toggle("is-active", id === current); });
    if (pbar) {
      var max = document.documentElement.scrollHeight - vh;
      pbar.style.transform = "scaleX(" + (max > 0 ? Math.min(1, y / max) : 0).toFixed(3) + ")";
    }
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();

  /* ---------- Project cards: gentle 3D tilt + open case study ---------- */
  $$(".work").forEach(function (card) {
    if (finePointer && !reduce) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty("--ry", (px * 5).toFixed(2) + "deg");
        card.style.setProperty("--rx", (-py * 5).toFixed(2) + "deg");
      });
      card.addEventListener("pointerleave", function () {
        card.style.setProperty("--ry", "0deg");
        card.style.setProperty("--rx", "0deg");
      });
    }
    function open() {
      var dlg = document.getElementById(card.getAttribute("data-open"));
      if (dlg && dlg.showModal) { dlg.showModal(); root.classList.add("lock"); }
    }
    card.addEventListener("click", open);
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
    });
  });

  /* ---------- Dialogs ---------- */
  $$("dialog.case").forEach(function (dlg) {
    function stopMedia() { $$("video", dlg).forEach(function (v) { v.pause(); }); }
    dlg.addEventListener("close", function () { stopMedia(); root.classList.remove("lock"); });
    dlg.addEventListener("click", function (e) {
      if (e.target === dlg) dlg.close(); // click on backdrop
    });
    var x = $(".case-close", dlg);
    if (x) x.addEventListener("click", function () { dlg.close(); });
  });

  /* ---------- Screen gallery (dairy farm case study) ---------- */
  $$("[data-gallery]").forEach(function (g) {
    var img = $("img", g);
    var btns = $$(".shot-tabs button", g);
    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        if (b.getAttribute("aria-pressed") === "true") return;
        btns.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        img.classList.add("is-swapping");
        var next = new Image();
        next.onload = function () {
          img.src = b.getAttribute("data-src");
          img.alt = b.getAttribute("data-alt");
          img.classList.remove("is-swapping");
        };
        next.src = b.getAttribute("data-src");
      });
    });
  });

  /* ---------- Email button: copy on click, fall back to mailto ---------- */
  var mail = $("#mail-btn");
  if (mail && navigator.clipboard && window.isSecureContext) {
    var label = $(".mail-text", mail);
    var original = label.textContent;
    mail.addEventListener("click", function (e) {
      e.preventDefault();
      navigator.clipboard.writeText(mail.getAttribute("data-email")).then(function () {
        label.textContent = "Copied to clipboard ✓";
        setTimeout(function () { label.textContent = original; }, 1800);
      }, function () { window.location.href = mail.href; });
    });
    mail.setAttribute("title", "Click to copy my email");
  }
})();

/* autoplay previews: play only while visible (battery friendly) */
(function () {
  var vids = document.querySelectorAll("video.autoplay");
  if (!vids.length) return;
  function go(v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
  if (!("IntersectionObserver" in window)) { vids.forEach(go); return; }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) go(e.target); else e.target.pause(); });
  }, { threshold: 0.2 });
  vids.forEach(function (v) { v.muted = true; io.observe(v); });
})();
