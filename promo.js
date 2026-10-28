/* ─────────────────────────────────────────────────────────────
   סרטון התדמית האנכי (9:16), נבנה בקוד ומצויר על canvas בזמן אמת.
   החומרים (סרטונים, הדמיות, מוזיקה) מוגדרים ב-media.js תחת promo.
   CutPromo.create(canvas, { scale, loop }) מחזיר נגן עם play / pause / seek / renderAt.
   ───────────────────────────────────────────────────────────── */
(function () {
  var W = 1080, H = 1920, DUR = 30;
  var INK = '#1f1f1b', TEAL = '#17a398', WHITE = '#ffffff';
  var FONT = "'Heebo', Arial, sans-serif";

  // ── עזרי תנועה ──
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function prog(t, a, b) { return clamp((t - a) / (b - a), 0, 1); }
  function outCubic(p) { return 1 - Math.pow(1 - p, 3); }
  function outExpo(p) { return p >= 1 ? 1 : 1 - Math.pow(2, -10 * p); }
  function inOut(p) { return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; }
  function lerp(a, b, p) { return a + (b - a) * p; }
  // שקיפות של שכבה שנכנסת ב-a ויוצאת ב-b, עם זמני מעבר.
  function life(t, a, b, fin, fout) {
    return Math.min(prog(t, a, a + (fin || 0.3)), 1 - prog(t, b - (fout || 0.3), b));
  }

  // ── ציור תמונה או וידאו במילוי מלא (cover), עם זום והזזה ──
  function drawCover(ctx, src, zoom, px, py, rot) {
    var sw = src.videoWidth || src.naturalWidth || src.width, sh = src.videoHeight || src.naturalHeight || src.height;
    if (!sw || !sh) return false;
    var s = Math.max(W / sw, H / sh) * (zoom || 1);
    var dw = sw * s, dh = sh * s;
    var ox = (dw - W) / 2 * clamp(px || 0, -1, 1), oy = (dh - H) / 2 * clamp(py || 0, -1, 1);
    ctx.save();
    if (rot) { ctx.translate(W / 2, H / 2); ctx.rotate(rot * Math.PI / 180); ctx.translate(-W / 2, -H / 2); }
    ctx.drawImage(src, (W - dw) / 2 + ox, (H - dh) / 2 + oy, dw, dh);
    ctx.restore();
    return true;
  }

  // ── טקסט קינטי: מילה אחרי מילה, מימין לשמאל ──
  function kinetic(ctx, text, x, y, size, t, start, opts) {
    opts = opts || {};
    var words = text.split(' '), gap = size * 0.28, stagger = opts.stagger || 0.09, dur = opts.dur || 0.55;
    ctx.save();
    ctx.font = (opts.weight || 800) + ' ' + size + 'px ' + FONT;
    ctx.direction = 'rtl'; ctx.textAlign = 'right'; ctx.textBaseline = 'alphabetic';
    var widths = words.map(function (w) { return ctx.measureText(w).width; });
    var total = widths.reduce(function (a, b) { return a + b; }, 0) + gap * (words.length - 1);
    var cx = opts.align === 'right' ? x : x + total / 2;
    var out = opts.out != null ? 1 - outCubic(prog(t, opts.out, opts.out + 0.35)) : 1;
    for (var i = 0; i < words.length; i++) {
      var p = outExpo(prog(t, start + i * stagger, start + i * stagger + dur));
      var a = p * out;
      if (a > 0.001) {
        ctx.globalAlpha = a * (opts.alpha == null ? 1 : opts.alpha);
        var dy = (1 - p) * size * 0.55 - (1 - out) * size * 0.3;
        if (opts.shadow !== false) { ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = size * 0.35; ctx.shadowOffsetY = size * 0.06; }
        ctx.fillStyle = opts.color || WHITE;
        ctx.fillText(words[i], cx, y + dy);
      }
      cx -= widths[i] + gap;
    }
    ctx.restore();
    return total;
  }

  // פס הדגשה בטורקיז שנמתח מימין לשמאל מאחורי שורת טקסט.
  function highlight(ctx, x, y, w, h, p, color) {
    if (p <= 0) return;
    ctx.save();
    ctx.fillStyle = color || TEAL;
    var ww = w * outExpo(p);
    ctx.fillRect(x + w - ww, y, ww, h);
    ctx.restore();
  }

  function measure(ctx, text, size, weight) {
    ctx.save(); ctx.font = (weight || 800) + ' ' + size + 'px ' + FONT;
    var w = ctx.measureText(text).width; ctx.restore(); return w;
  }

  // תגית קטנה: נקודה טורקיז וטקסט במרווח רחב.
  function tag(ctx, text, x, y, a, dark) {
    if (a <= 0) return;
    ctx.save();
    ctx.globalAlpha = a;
    ctx.font = '500 34px ' + FONT; ctx.direction = 'rtl'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    var w = ctx.measureText(text).width + 90;
    ctx.fillStyle = dark ? 'rgba(31,31,27,0.06)' : 'rgba(255,255,255,0.12)';
    ctx.strokeStyle = dark ? 'rgba(31,31,27,0.18)' : 'rgba(255,255,255,0.35)';
    ctx.lineWidth = 2;
    roundRect(ctx, x - w / 2, y - 32, w, 64, 32); ctx.fill(); ctx.stroke();
    ctx.fillStyle = TEAL; ctx.beginPath(); ctx.arc(x + w / 2 - 34, y, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = dark ? INK : WHITE; ctx.fillText(text, x - 8, y + 2);
    ctx.restore();
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }

  // ── תאורה ──
  // פס אור אלכסוני שעובר על המסך (p מ-0 עד 1).
  function sweep(ctx, p, a, color) {
    if (p <= 0 || p >= 1) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = (a == null ? 0.5 : a) * Math.sin(p * Math.PI);
    ctx.translate(W / 2, H / 2); ctx.rotate(-0.42);
    var x = lerp(-W * 1.3, W * 1.3, inOut(p));
    var g = ctx.createLinearGradient(x - 260, 0, x + 260, 0);
    var c = color || '255,255,255';
    g.addColorStop(0, 'rgba(' + c + ',0)'); g.addColorStop(0.5, 'rgba(' + c + ',0.9)'); g.addColorStop(1, 'rgba(' + c + ',0)');
    ctx.fillStyle = g; ctx.fillRect(-W * 2, -H * 2, W * 4, H * 4);
    ctx.restore();
  }

  // דליפת אור חמה/טורקיז בפינה.
  function leak(ctx, t, a, x, y, warm) {
    if (a <= 0) return;
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = a * (0.75 + 0.25 * Math.sin(t * 2.1));
    var r = 900 + 120 * Math.sin(t * 1.3);
    var g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, warm ? 'rgba(255,190,120,0.75)' : 'rgba(80,220,205,0.7)');
    g.addColorStop(0.5, warm ? 'rgba(255,140,60,0.18)' : 'rgba(23,163,152,0.18)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  function flash(ctx, a, color) {
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = clamp(a, 0, 1); ctx.fillStyle = color || WHITE; ctx.fillRect(0, 0, W, H); ctx.restore();
  }

  // הבזק לבן קצר סביב זמן חיתוך.
  function cutFlash(t, at, len, peak) { var d = Math.abs(t - at); return d > len ? 0 : (1 - d / len) * (peak || 0.7); }

  function shade(ctx, top, bottom) {
    ctx.save();
    var g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, 'rgba(10,12,11,' + top + ')'); g.addColorStop(0.35, 'rgba(10,12,11,0)');
    g.addColorStop(0.55, 'rgba(10,12,11,0)'); g.addColorStop(1, 'rgba(10,12,11,' + bottom + ')');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  // גריידינג: צללים כחלחלים-טורקיז, אור חם, ויניטה.
  function grade(ctx, strength) {
    ctx.save();
    ctx.globalCompositeOperation = 'soft-light';
    ctx.globalAlpha = 0.35 * strength;
    var g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, '#ffb874'); g.addColorStop(1, '#0d6f68');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = strength;
    var v = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.75);
    v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  // גרעין פילם: כמה מרקמי רעש קטנים שמתחלפים בכל פריים.
  var grainTiles = null;
  function makeGrain() {
    grainTiles = [];
    for (var k = 0; k < 4; k++) {
      var c = document.createElement('canvas'); c.width = c.height = 192;
      var g = c.getContext('2d'), d = g.createImageData(192, 192);
      for (var i = 0; i < d.data.length; i += 4) { var n = Math.random() * 255 | 0; d.data[i] = d.data[i + 1] = d.data[i + 2] = n; d.data[i + 3] = 255; }
      g.putImageData(d, 0, 0); grainTiles.push(c);
    }
  }
  function grain(ctx, t, a) {
    if (!grainTiles) makeGrain();
    ctx.save();
    ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = a;
    var tile = grainTiles[Math.floor(t * 24) % 4];
    var pat = ctx.createPattern(tile, 'repeat');
    var o = Math.floor(t * 24) * 37 % 192;
    ctx.translate(-o, -o); ctx.fillStyle = pat; ctx.fillRect(0, 0, W + 192, H + 192);
    ctx.restore();
  }

  // ── ציר הזמן ──
  // כל סרטון: מתי הוא על המסך, ומאיזו שנייה בקובץ המקור מתחילים.
  var VIDEO_LAYERS = [
    { key: 'main', a: 3.4, b: 8.6, src: 14 },
    { key: 'y38', a: 16.8, b: 21.8, src: 9 }
  ];
  var CUTS = ['tower', 'villa', 'penthouse', 'aerial', 'kitchen', 'tower'];
  var CUT_A = 21.6, CUT_LEN = 0.74;

  function render(ctx, A, t, logo) {
    ctx.save();
    ctx.fillStyle = '#0f1110'; ctx.fillRect(0, 0, W, H);

    // 1. פתיח: מוכרים פרויקט שעוד לא קיים?
    if (t < 3.6) {
      var o = life(t, 0, 3.6, 0.01, 0.3);
      ctx.globalAlpha = o;
      if (A.street) drawCover(ctx, A.street, lerp(1.22, 1.06, outCubic(prog(t, 0, 3.6))), 0.15, 0);
      ctx.globalAlpha = 1;
      grade(ctx, 0.7);
      ctx.save(); ctx.fillStyle = 'rgba(10,12,11,0.28)'; ctx.fillRect(0, 0, W, H); ctx.restore();
      shade(ctx, 0.35, 0.6);
      sweep(ctx, prog(t, 0.15, 1.6), 0.35, '120,230,215');
      var lw = 260 * outExpo(prog(t, 0.2, 1.0));
      ctx.fillStyle = TEAL; ctx.globalAlpha = o; ctx.fillRect(W / 2 - lw / 2, 700, lw, 8); ctx.globalAlpha = 1;
      tag(ctx, 'CUT productions', W / 2, 600, outCubic(prog(t, 0.2, 0.7)) * (1 - prog(t, 2.9, 3.3)));
      kinetic(ctx, 'מוכרים פרויקט', W / 2, 900, 132, t, 0.45, { out: 3.0 });
      kinetic(ctx, 'שעוד לא קיים?', W / 2, 1060, 132, t, 1.05, { out: 3.05, color: '#5fd8cc' });
      kinetic(ctx, 'ככה מראים אותו לקונים', W / 2, 1210, 54, t, 1.9, { weight: 400, out: 3.1, alpha: 0.85 });
    }

    // 2. הסרטון הראשי (נדל״ן לעצמי)
    if (t >= 3.3 && t < 8.7) {
      var z = lerp(1.04, 1.14, prog(t, 3.4, 8.6));
      if (A.main) drawCover(ctx, A.main, z, 0, -0.1);
      grade(ctx, 0.8);
      shade(ctx, 0.35, 0.85);
      tag(ctx, 'סרטוני פרויקט', W / 2, 190, life(t, 3.7, 8.4, 0.4, 0.3));
      var hw = measure(ctx, 'שמחתימות דיירים', 104) + 70;
      highlight(ctx, W / 2 - hw / 2, 1528, hw, 140, prog(t, 4.5, 5.1) * (1 - prog(t, 8.1, 8.45)));
      kinetic(ctx, 'הדמיות', W / 2, 1460, 150, t, 4.0, { out: 8.1 });
      kinetic(ctx, 'שמחתימות דיירים', W / 2, 1636, 104, t, 4.6, { out: 8.15, shadow: false });
    }

    // 3. פנים: לובי וסלון
    if (t >= 8.4 && t < 12.6) {
      if (t < 10.5) {
        if (A.lobby) drawCover(ctx, A.lobby, 1.14, lerp(0.9, -0.5, inOut(prog(t, 8.4, 10.6))), 0);
      } else if (A.living) {
        drawCover(ctx, A.living, lerp(1.04, 1.22, outCubic(prog(t, 10.4, 12.6))), -0.2, 0);
      }
      grade(ctx, 0.7);
      leak(ctx, t, 0.55 * life(t, 8.4, 12.6, 0.6, 0.4), W * 0.9, H * 0.18, true);
      sweep(ctx, prog(t, 10.2, 10.85), 0.7);
      shade(ctx, 0.3, 0.7);
      tag(ctx, 'חוץ · פנים · לובי', W / 2, 190, life(t, 8.6, 12.4, 0.4, 0.3));
      kinetic(ctx, 'לובי', W / 2, 1560, 190, t, 8.7, { out: 10.15 });
      kinetic(ctx, 'סלון', W / 2, 1560, 190, t, 10.55, { out: 12.2 });
      kinetic(ctx, 'כל חלל, כמו שהוא ייראה באמת', W / 2, 1680, 50, t, 9.0, { weight: 400, out: 12.2, alpha: 0.9 });
    }

    // 4. לפני ואחרי
    if (t >= 12.4 && t < 17.0) {
      if (A.before) drawCover(ctx, A.before, lerp(1.1, 1.16, prog(t, 12.4, 17)), 0, 0);
      var wp = inOut(prog(t, 13.3, 15.3));
      var lineX = W * (1 - wp);
      if (A.after && wp > 0) {
        ctx.save(); ctx.beginPath(); ctx.rect(lineX, 0, W - lineX, H); ctx.clip();
        drawCover(ctx, A.after, lerp(1.1, 1.16, prog(t, 12.4, 17)), 0, 0);
        ctx.restore();
      }
      grade(ctx, 0.6);
      shade(ctx, 0.55, 0.8);
      if (wp > 0 && wp < 1) {
        ctx.save();
        ctx.shadowColor = '#5fd8cc'; ctx.shadowBlur = 40; ctx.fillStyle = WHITE; ctx.fillRect(lineX - 3, 0, 6, H);
        ctx.restore();
        leak(ctx, t, 0.4, lineX, H * 0.5, false);
      }
      var la = life(t, 12.6, 16.7, 0.3, 0.3);
      ctx.save(); ctx.globalAlpha = la; ctx.font = '700 46px ' + FONT; ctx.textBaseline = 'middle'; ctx.direction = 'rtl';
      ctx.fillStyle = WHITE; ctx.textAlign = 'left'; ctx.fillText('לפני', 70, 300);
      ctx.globalAlpha = la * outCubic(prog(t, 14.2, 14.7)); ctx.fillStyle = '#5fd8cc'; ctx.textAlign = 'right'; ctx.fillText('אחרי', W - 70, 300);
      ctx.restore();
      tag(ctx, 'התחדשות עירונית', W / 2, 190, la);
      kinetic(ctx, 'מראים לדיירים', W / 2, 1500, 112, t, 13.0, { out: 16.6 });
      kinetic(ctx, 'את הבית החדש', W / 2, 1640, 112, t, 13.35, { out: 16.65, color: '#5fd8cc' });
    }

    // 5. סרטון Y38
    if (t >= 16.7 && t < 21.9) {
      if (A.y38) drawCover(ctx, A.y38, lerp(1.12, 1.02, outCubic(prog(t, 16.8, 21.8))), 0, 0);
      grade(ctx, 0.8);
      leak(ctx, t, 0.35 * life(t, 16.8, 21.8, 0.8, 0.5), W * 0.1, H * 0.85, false);
      shade(ctx, 0.35, 0.85);
      tag(ctx, 'רילס וסרטוני השקה', W / 2, 190, life(t, 17.0, 21.5, 0.4, 0.3));
      kinetic(ctx, 'סרטונים', W / 2, 1480, 150, t, 17.2, { out: 21.2 });
      kinetic(ctx, 'שעוצרים את הגלילה', W / 2, 1630, 92, t, 17.75, { out: 21.25, weight: 700 });
    }

    // 6. חיתוכים מהירים בין זוויות
    if (t >= CUT_A && t < 26.1) {
      var idx = clamp(Math.floor((t - CUT_A) / CUT_LEN), 0, CUTS.length - 1);
      var lt = t - CUT_A - idx * CUT_LEN;
      var im = A[CUTS[idx]];
      var dir = idx % 2 ? 1 : -1;
      if (im) drawCover(ctx, im, lerp(1.32, 1.1, outExpo(clamp(lt / CUT_LEN, 0, 1))), dir * lerp(0.6, 0.1, lt / CUT_LEN), 0, dir * lerp(2.2, 0, outExpo(lt / CUT_LEN)));
      grade(ctx, 0.6);
      shade(ctx, 0.15, 0.35);
      kinetic(ctx, 'כל זווית.', W / 2, 1000, 170, t, 21.85, { out: 23.7, stagger: 0.12 });
      kinetic(ctx, 'כל אור.', W / 2, 1000, 170, t, 23.85, { out: 25.75, stagger: 0.12, color: '#5fd8cc' });
      for (var c = 1; c < CUTS.length; c++) flash(ctx, cutFlash(t, CUT_A + c * CUT_LEN, 0.09, 0.45));
    }

    // 7. כרטיס סיום לבן
    if (t >= 25.7) {
      var e = prog(t, 25.7, 26.2);
      ctx.save(); ctx.globalAlpha = e; ctx.fillStyle = WHITE; ctx.fillRect(0, 0, W, H); ctx.restore();
      // גלים עדינים בטורקיז ברקע
      ctx.save(); ctx.globalAlpha = 0.07 * e;
      var gg = ctx.createRadialGradient(W * 0.8, H * 0.15, 0, W * 0.8, H * 0.15, 900);
      gg.addColorStop(0, TEAL); gg.addColorStop(1, 'rgba(23,163,152,0)'); ctx.fillStyle = gg; ctx.fillRect(0, 0, W, H);
      ctx.restore();
      if (logo && logo.naturalWidth) {
        var lp = outExpo(prog(t, 26.0, 26.9));
        var lwid = 620 * lerp(0.86, 1, lp), lh = lwid * logo.naturalHeight / logo.naturalWidth;
        ctx.save(); ctx.globalAlpha = lp; ctx.drawImage(logo, W / 2 - lwid / 2, 640 - lh / 2 + (1 - lp) * 40, lwid, lh); ctx.restore();
      }
      var ul = 300 * outExpo(prog(t, 26.5, 27.3));
      ctx.fillStyle = TEAL; ctx.fillRect(W / 2 - ul / 2, 860, ul, 8);
      kinetic(ctx, 'הפרויקט שלכם,', W / 2, 1060, 104, t, 26.6, { color: INK, shadow: false });
      kinetic(ctx, 'לפני שהוא קיים', W / 2, 1190, 104, t, 26.95, { color: '#0e7f76', shadow: false });
      kinetic(ctx, 'הדמיות · סרטוני פרויקט · לפני ואחרי', W / 2, 1320, 42, t, 27.5, { weight: 400, color: '#5e615c', shadow: false, stagger: 0.05 });
      var ca = outCubic(prog(t, 28.0, 28.6));
      ctx.save(); ctx.globalAlpha = ca;
      roundRect(ctx, W / 2 - 330, 1560, 660, 120, 60); ctx.fillStyle = INK; ctx.fill();
      ctx.font = '700 50px ' + FONT; ctx.fillStyle = WHITE; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.direction = 'ltr';
      ctx.fillText('050-3838810', W / 2, 1622);
      ctx.font = '400 38px ' + FONT; ctx.fillStyle = '#5e615c'; ctx.fillText('@tzarich_ai', W / 2, 1750);
      ctx.restore();
    }

    // מעברים והבזקים בנקודות החיתוך הגדולות
    flash(ctx, cutFlash(t, 3.4, 0.22, 0.85));
    flash(ctx, cutFlash(t, 12.45, 0.2, 0.6));
    flash(ctx, cutFlash(t, 16.8, 0.22, 0.75));
    flash(ctx, cutFlash(t, 21.62, 0.18, 0.7));
    flash(ctx, cutFlash(t, 8.45, 0.18, 0.5), '#bff3ec');

    grain(ctx, t, t >= 26 ? 0.05 : 0.11);
    // דעיכה לשחור/לבן בתחילת ובסוף הלופ
    flash(ctx, 1 - prog(t, 0, 0.35), '#0f1110');
    ctx.restore();
  }

  // ── טעינת חומרים ──
  function loadImage(src) {
    return new Promise(function (res) {
      if (!src) return res(null);
      var im = new Image(); im.decoding = 'async';
      im.onload = function () { res(im); }; im.onerror = function () { res(null); };
      im.src = src;
    });
  }
  function makeVideo(src) {
    if (!src) return null;
    var v = document.createElement('video');
    v.muted = true; v.playsInline = true; v.setAttribute('playsinline', '');
    v.preload = 'auto'; v.src = src;
    return v;
  }
  function seekTo(v, time) {
    return new Promise(function (res) {
      if (!v) return res();
      var done = false, fin = function () { if (!done) { done = true; res(); } };
      var go = function () {
        if (Math.abs(v.currentTime - time) < 0.02 && v.readyState >= 2) return fin();
        v.addEventListener('seeked', fin, { once: true });
        setTimeout(fin, 4000);
        v.currentTime = time;
      };
      if (v.readyState >= 1) go(); else { v.addEventListener('loadedmetadata', go, { once: true }); setTimeout(fin, 8000); }
    });
  }

  function create(canvas, opts) {
    opts = opts || {};
    var P = (window.SITE_MEDIA && window.SITE_MEDIA.promo) || {};
    var scale = opts.scale || 1;
    canvas.width = Math.round(W * scale); canvas.height = Math.round(H * scale);
    var ctx = canvas.getContext('2d');
    var A = {}, vids = {}, logo = null, music = null;
    var playing = false, t0 = 0, cur = 0, raf = 0, listeners = [];

    VIDEO_LAYERS.forEach(function (L) { vids[L.key] = makeVideo(P[L.key]); A[L.key] = vids[L.key]; });
    if (P.music) { music = new Audio(); music.preload = 'auto'; music.src = P.music; music.muted = opts.muted !== false; }

    var imgKeys = ['street', 'lobby', 'living', 'before', 'after', 'tower', 'villa', 'penthouse', 'aerial', 'kitchen'];
    var ready = Promise.all(imgKeys.map(function (k) { return loadImage(P[k]).then(function (im) { A[k] = im; }); })
      .concat([loadImage(P.logo || 'images/logo.png').then(function (im) { logo = im; })])
      .concat([document.fonts && document.fonts.load ? Promise.all([document.fonts.load('800 100px Heebo'), document.fonts.load('400 40px Heebo')]).catch(function () {}) : Promise.resolve()]))
      .then(function () { draw(cur); });

    function draw(t) {
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      render(ctx, A, t, logo);
      listeners.forEach(function (fn) { fn(t); });
    }

    // סנכרון הסרטונים לשעון בזמן ניגון
    function syncVideos(t) {
      VIDEO_LAYERS.forEach(function (L) {
        var v = vids[L.key]; if (!v) return;
        var want = L.src + (t - L.a);
        if (t >= L.a - 1.2 && t < L.a) {
          if (!v.paused) v.pause();
          if (!L.primed) { L.primed = true; try { v.currentTime = L.src; } catch (e) {} }
        } else if (t >= L.a && t < L.b) {
          L.primed = false;
          if (v.paused) { try { v.currentTime = want; } catch (e) {} var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }
          else if (Math.abs(v.currentTime - want) > 0.35) { try { v.currentTime = want; } catch (e) {} }
        } else {
          L.primed = false;
          if (!v.paused) v.pause();
        }
      });
    }

    function tick() {
      if (!playing) return;
      var t = (performance.now() - t0) / 1000;
      if (t >= DUR) {
        if (opts.loop === false) { cur = DUR - 0.001; draw(cur); api.pause(); if (opts.onEnd) opts.onEnd(); return; }
        t0 = performance.now(); t = 0;
        if (music) { try { music.currentTime = 0; } catch (e) {} }
      }
      cur = t;
      syncVideos(t);
      draw(t);
      raf = requestAnimationFrame(tick);
    }

    var api = {
      duration: DUR, width: W, height: H, ready: ready, canvas: canvas, music: music,
      play: function () {
        if (playing) return;
        if (cur >= DUR - 0.05) cur = 0;
        playing = true; t0 = performance.now() - cur * 1000;
        if (music) { try { music.currentTime = cur; } catch (e) {} var p = music.play(); if (p && p.catch) p.catch(function () {}); }
        raf = requestAnimationFrame(tick);
      },
      pause: function () {
        playing = false; cancelAnimationFrame(raf);
        if (music) music.pause();
        Object.keys(vids).forEach(function (k) { if (vids[k]) vids[k].pause(); });
      },
      seek: function (t) { cur = clamp(t, 0, DUR); t0 = performance.now() - cur * 1000; if (music) { try { music.currentTime = cur; } catch (e) {} } if (!playing) draw(cur); },
      // ציור פריים מדויק בזמן t (מחכה שהסרטונים יגיעו לפריים הנכון).
      renderAt: function (t) {
        return ready.then(function () {
          return Promise.all(VIDEO_LAYERS.map(function (L) {
            return t >= L.a - 0.2 && t < L.b ? seekTo(vids[L.key], L.src + Math.max(0, t - L.a)) : null;
          }));
        }).then(function () { cur = t; draw(t); });
      },
      setMuted: function (m) { if (music) { music.muted = m; if (!m && playing && music.paused) music.play().catch(function () {}); } },
      isPlaying: function () { return playing; },
      onFrame: function (fn) { listeners.push(fn); },
      time: function () { return cur; }
    };
    return api;
  }

  window.CutPromo = { create: create, duration: DUR, width: W, height: H };
})();
