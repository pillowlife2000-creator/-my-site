/* Shared behaviour for the landing pages built by tools/build.py.
   Each page sets window.SITE_MEDIA (scroll video, poster, gallery, videos) before loading this file. */
(function () {
  var M = window.SITE_MEDIA || {};
  function $(id) { return document.getElementById(id); }
  function el(tag, attrs, html) { var e = document.createElement(tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (html) e.innerHTML = html; return e; }
  function esc(t) { return String(t || '').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  var nav = $('nav');

  // ── Scroll fly-through: the video's time follows the scroll position ──
  var fly = $('top'), vid = $('flyVideo'), bar = $('flyBar'), hint = $('flyHint');
  var steps = fly.querySelectorAll('.fly-step');
  $('flyPoster').src = M.scrollPoster || '';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var target = 0, current = 0;
  var isStatic = !M.scrollVideo || reduce;
  if (isStatic) fly.classList.add('static');
  if (isStatic && !M.scrollPoster) fly.classList.add('plain');
  var scrollSrc = (window.innerWidth < 900 && M.scrollVideoMobile) || M.scrollVideo;
  if (!isStatic) {
    // Load the whole file into memory so seeking is instant; fall back to streaming if the host blocks it.
    fetch(scrollSrc).then(function (r) { if (!r.ok) throw 0; return r.blob(); })
      .then(function (b) { vid.src = URL.createObjectURL(b); })
      .catch(function () { vid.src = scrollSrc; });
    vid.addEventListener('loadeddata', function () { vid.classList.add('ready'); });
    // iOS only allows seeking after the video has been "played" once.
    var unlock = function () { vid.play().then(function () { vid.pause(); }).catch(function () {}); window.removeEventListener('touchstart', unlock); };
    window.addEventListener('touchstart', unlock, { passive: true });
  }
  function progress() {
    var r = fly.getBoundingClientRect(), span = fly.offsetHeight - window.innerHeight;
    return Math.min(1, Math.max(0, -r.top / span));
  }
  function onScroll() {
    nav.classList.toggle('solid', window.scrollY > 40);
    if (isStatic) { document.body.classList.toggle('past-fly', window.scrollY > window.innerHeight * 0.6); return; }
    var p = progress();
    document.body.classList.toggle('past-fly', p >= 1);
    bar.style.setProperty('--p', p);
    hint.style.opacity = p > 0.03 ? 0 : 1;
    steps.forEach(function (s) { s.classList.toggle('on', p >= +s.dataset.from && p < +s.dataset.to); });
    if (vid.duration) target = p * (vid.duration - 0.05);
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  (function tick() {
    if (vid.duration && Math.abs(target - current) > 0.01) {
      current += (target - current) * 0.15;
      if (!vid.seeking) vid.currentTime = current;
    }
    requestAnimationFrame(tick);
  })();

  // ── Videos play by themselves (muted, looping) while on screen, and pause off screen ──
  var vio = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { var p = e.target.play(); if (p && p.catch) p.catch(function () {}); } else e.target.pause(); });
  }, { threshold: 0.15 }) : null;
  function watchVideos(root) {
    root.querySelectorAll('video.auto').forEach(function (v) {
      v.muted = true; v.defaultMuted = true;
      if (vio) vio.observe(v); else v.play().catch(function () {});
    });
  }

  // ── Portfolio videos: the first plays by itself, the rest open with controls ──
  var vgrid = $('vgrid');
  if (vgrid) {
    (M.videos || []).forEach(function (v, i) {
      var f = el('figure', { 'class': 'reveal' + (v.wide ? ' wide' : '') });
      var tag = v.autoplay
        ? '<video class="auto" src="' + esc(v.src) + '" muted loop playsinline preload="metadata"></video>'
        : '<video src="' + esc(v.src) + '#t=0.1" controls playsinline preload="metadata"></video>';
      f.innerHTML = tag + '<figcaption><b>' + esc(v.title) + '</b>' + (v.sub ? '<span>' + esc(v.sub) + '</span>' : '') + '</figcaption>';
      vgrid.appendChild(f);
    });
    if (!(M.videos || []).length) vgrid.hidden = true;
  }

  // ── Gallery ──
  var sizeClass = { lg: 'w-lg', md: 'w-md', sm: 'w-sm', third: 'w-third', full: 'w-full' }, gal = $('gallery');
  if (gal) {
    (M.gallery || []).forEach(function (g, i) {
      var cls = sizeClass[g.size] || (i === 0 ? 'w-lg' : (i % 5 === 1 ? 'w-sm' : 'w-third'));
      var fig = el('figure', { 'class': 'work reveal ' + cls });
      fig.innerHTML = '<img src="' + esc(g.src) + '" alt="' + esc(g.title || 'עבודה') + '" loading="lazy" />'
        + ((g.title || g.sub) ? '<figcaption><b>' + esc(g.title) + '</b>' + esc(g.sub) + '</figcaption>' : '');
      fig.addEventListener('click', function () { openModal('<img src="' + esc(g.src) + '" alt="' + esc(g.title) + '">'); });
      gal.appendChild(fig);
    });
  }

  watchVideos(document);

  // ── Reveal on scroll ──
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px' }) : null;
  document.querySelectorAll('.reveal').forEach(function (e) { io ? io.observe(e) : e.classList.add('in'); });

  // ── Lightbox ──
  var modal = $('modal'), mbody = $('modalBody');
  function openModal(html) { mbody.innerHTML = html; modal.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeModal() { modal.classList.remove('open'); mbody.innerHTML = ''; document.body.style.overflow = ''; }
  $('modalX').addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

  // ── Remember the campaign that brought the visitor (UTM) for the lead form ──
  var q = new URLSearchParams(location.search), u = ['utm_source', 'utm_medium', 'utm_campaign'].map(function (k) { return q.get(k) || ''; });
  try { if (u[0]) sessionStorage.setItem('utm', u.join('/')); } catch (e) {}
})();
