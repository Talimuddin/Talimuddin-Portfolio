/* Talimuddin Portfolio — script.js */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;

  /* ---------- Toast ---------- */
  var toast = $('#toast'), toastTimer;
  function showToast(msg) {
    toast.textContent = msg; toast.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2400);
  }

  /* ---------- Theme: light by default, dark only on user choice ---------- */
  var themeBtn = $('#themeToggle'), themeMeta = $('#themeColor');
  function applyTheme(t) {
    root.dataset.theme = t;
    themeMeta.setAttribute('content', t === 'dark' ? '#090b18' : '#f7f7fb');
    themeBtn.setAttribute('aria-label', t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }
  applyTheme(root.dataset.theme === 'dark' ? 'dark' : 'light');
  themeBtn.addEventListener('click', function () {
    var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('talimuddin-theme', next); } catch (e) {}
  });

  /* ---------- Mobile menu ---------- */
  var menuBtn = $('#menuToggle'), links = $('#navLinks');
  function closeMenu() { links.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.setAttribute('aria-label', 'Open navigation menu'); }
  menuBtn.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  });
  $$('a', links).forEach(function (a) { a.addEventListener('click', closeMenu); });
  document.addEventListener('click', function (e) { if (links.classList.contains('open') && !links.contains(e.target) && !menuBtn.contains(e.target)) closeMenu(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', function () { if (window.innerWidth > 860) closeMenu(); });

  /* ---------- Typing effect ---------- */
  var typing = $('#typingText');
  var roles = ['Java Full Stack Developer', 'Backend Developer', 'Spring Boot Learner', 'Problem Solver'];
  if (typing && !reduce) {
    var ri = 0, ci = roles[0].length, del = true;
    var tick = function () {
      var word = roles[ri];
      ci += del ? -1 : 1;
      typing.textContent = word.slice(0, ci);
      var wait = del ? 38 : 80;
      if (!del && ci === word.length) { del = true; wait = 1900; }
      else if (del && ci === 0) { del = false; ri = (ri + 1) % roles.length; wait = 320; }
      setTimeout(tick, wait);
    };
    setTimeout(tick, 2200); // first role stays visible briefly
  }

  /* ---------- Marquee: duplicate once for a seamless loop ---------- */
  var track = $('#marqueeTrack');
  if (track) {
    $$('span', track).forEach(function (s) { var c = s.cloneNode(true); c.setAttribute('aria-hidden', 'true'); track.appendChild(c); });
  }

  /* ---------- Reveal on scroll + counters ---------- */
  function countUp(el) {
    var target = +el.dataset.count, suffix = el.dataset.suffix || '';
    if (reduce) { el.textContent = target + suffix; return; }
    var start = performance.now(), dur = 1300;
    (function step(now) {
      var p = Math.min((now - start) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    })(start);
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-visible');
        $$('[data-count]', en.target).forEach(countUp);
        io.unobserve(en.target);
      });
    }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    $$('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
    $$('[data-count]').forEach(function (el) { el.textContent = el.dataset.count; });
  }

  /* ---------- Project filters ---------- */
  var filterBtns = $$('.filter-btn'), cards = $$('.project-card');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.dataset.filter;
      filterBtns.forEach(function (b) { var on = b === btn; b.classList.toggle('active', on); b.setAttribute('aria-pressed', String(on)); });
      cards.forEach(function (c) { c.classList.toggle('hide', f !== 'all' && c.dataset.category.split(' ').indexOf(f) === -1); });
    });
  });

  /* ---------- Spotlight on cards ---------- */
  $$('.spot').forEach(function (el) {
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* ---------- Scroll: progress bar, back-to-top, active link ---------- */
  var bar = $('#progress'), toTop = $('#backToTop'), ticking = false;
  function onScroll() {
    var h = root.scrollHeight - window.innerHeight;
    bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(window.scrollY / h, 1) : 0) + ')';
    toTop.classList.toggle('show', window.scrollY > 700);
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
  toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });

  var navAnchors = $$('.nav-links a[href^="#"]');
  var sections = navAnchors.map(function (a) { return $(a.getAttribute('href')); }).filter(Boolean);
  if ('IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navAnchors.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { so.observe(s); });
  }

  /* ---------- Resume viewer ---------- */
  var dlg = $('#resumeDialog'), frame = $('#resumeFrame');
  $$('[data-resume-view]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (!(typeof dlg.showModal === 'function' && navigator.pdfViewerEnabled && window.innerWidth >= 900)) return; // new tab fallback
      e.preventDefault();
      if (!frame.getAttribute('src')) frame.setAttribute('src', 'assets/resume.pdf#view=FitH');
      closeMenu();
      dlg.showModal();
    });
  });
  $('#resumeClose').addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });

  /* ---------- Contact: copy email + mailto form ---------- */
  var EMAIL = 'talimuddin2000@gmail.com';
  $('#copyEmail').addEventListener('click', function () {
    function ok() { showToast('Email copied: ' + EMAIL); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(EMAIL).then(ok, function () { showToast(EMAIL); });
    else { var t = document.createElement('textarea'); t.value = EMAIL; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); ok(); } catch (e) { showToast(EMAIL); } t.remove(); }
  });
  var form = $('#contactForm'), note = $('#formNote');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = $('#cfName'), mail = $('#cfEmail'), msg = $('#cfMsg'), bad = false;
    [name, mail, msg].forEach(function (f) { var v = f.value.trim(); var invalid = !v || (f === mail && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)); f.classList.toggle('invalid', invalid); if (invalid) bad = true; });
    if (bad) { note.textContent = 'Please fill in all fields with a valid email.'; return; }
    var subject = 'Portfolio enquiry from ' + name.value.trim();
    var body = msg.value.trim() + '\n\n— ' + name.value.trim() + '\n' + mail.value.trim();
    window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    note.textContent = 'Opening your email app… if nothing opens, use the Copy email button.';
  });

  var yr = $('#year'); if (yr) yr.textContent = new Date().getFullYear();
})();
