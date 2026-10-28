#!/usr/bin/env python3
"""Builds the landing pages (index, fashion, food, saas, skill) from one template.

Run from the repo root:  python3 tools/build.py
- The text of each page lives in tools/pages.py.
- The images and videos of each page live in media-<slug>.js (created once from tools/assets.json,
  then yours to edit: rebuilding never overwrites an existing media file).
nadlan.html (real estate) is a separate hand-made page and is not touched.
"""
import html, json, os, sys, urllib.parse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pages import PAGES  # noqa: E402

WA_NUMBER = '972503838810'
e = html.escape


def wa(text):
    return 'https://api.whatsapp.com/send?phone=%s&text=%s' % (WA_NUMBER, urllib.parse.quote(text))


def href(p, target):
    return wa(p['wa_text']) if target == 'wa' else target


def link_attrs(url):
    return ' target="_blank" rel="noopener"' if url.startswith('http') else ''


def btn(p, label, target, cls='btn-solid', icon=''):
    url = href(p, target)
    return '<a href="%s" class="btn %s"%s>%s%s</a>' % (e(url), cls, link_attrs(url), e(label), icon)


def head(p):
    out = ['<span class="eyebrow">%s</span>' % e(p['eyebrow'])] if p.get('eyebrow') else []
    out.append('<h2>%s</h2>' % p['h2'])
    if p.get('lead'):
        out.append('<p class="lead">%s</p>' % e(p['lead']))
    return '<div class="head reveal">%s</div>' % ''.join(out)


def section(sid, inner, soft=False, extra=''):
    return '<section class="sec%s" id="%s"%s>\n  <div class="wrap">\n%s\n  </div>\n</section>\n' % (' soft' if soft else '', sid, extra, inner)


def render(p):
    h = p['hero']
    arrow = ' <i class="fas fa-arrow-left"></i>'
    nav = ''.join('<li><a href="%s">%s</a></li>' % (e(u), e(t)) for t, u in p['nav'])
    c1, c2 = h['cap1'], h['cap2']
    hero = '''<section class="fly" id="top" aria-label="%(aria)s">
  <div class="fly-stick">
    <img class="fly-poster" id="flyPoster" alt="" fetchpriority="high" />
    <video id="flyVideo" muted playsinline preload="auto" aria-hidden="true"></video>
    <div class="fly-shade"></div>
    <div class="fly-copy">
      <div class="wrap fly-step on" data-from="0" data-to="0.3">
        <span class="eyebrow">%(eyebrow)s</span>
        <h1>%(h1)s</h1>
        <p>%(sub)s</p>
        <div class="hero-ctas static-only">%(b1)s%(b2)s</div>
      </div>
      <div class="wrap fly-step" data-from="0.3" data-to="0.68">
        <span class="eyebrow">%(l1)s</span>
        <h2>%(t1)s</h2>
        <p>%(p1)s</p>
      </div>
      <div class="wrap fly-step" data-from="0.68" data-to="1.01">
        <span class="eyebrow">%(l2)s</span>
        <h2>%(t2)s</h2>
        <p>%(p2)s</p>
        <div class="hero-ctas">%(b1)s%(b2)s</div>
      </div>
    </div>
    <div class="fly-hint" id="flyHint">גללו<span></span></div>
    <div class="fly-bar"><i id="flyBar"></i></div>
  </div>
</section>
''' % dict(aria=e(h['eyebrow']), eyebrow=e(h['eyebrow']), h1=e(h['h1']), sub=e(h['sub']),
           b1=btn(p, h['cta1'], h.get('cta1_href', 'wa'), 'btn-solid', arrow),
           b2=btn(p, h['cta2'], h.get('cta2_href', '#work'), 'btn-ghost'),
           l1=e(c1[0]), t1=e(c1[1]), p1=e(c1[2]), l2=e(c2[0]), t2=e(c2[1]), p2=e(c2[2]))

    body = [hero]
    body.append('<div class="strip">\n  <ul class="wrap">%s</ul>\n</div>\n' % ''.join('<li>%s</li>' % e(s) for s in p['strip']))

    w = p['work']
    work = head(w) + '\n    <div class="vgrid" id="vgrid"></div>\n    <div class="works" id="gallery" style="margin-top:1rem"></div>'
    if w.get('note'):
        work += '\n    <p class="note">%s</p>' % e(w['note'])
    body.append(section('work', work))

    if p.get('fields'):
        f = p['fields']
        cards = ''.join('<a class="field-card" href="%s"><img src="%s" alt="%s" loading="lazy" /><div class="fc-in"><h3>%s</h3><p>%s</p><span class="go">לדף התחום <i class="fas fa-arrow-left"></i></span></div></a>'
                        % (e(c['href']), e(c['img']), e(c['title']), e(c['title']), e(c['text'])) for c in f['cards'])
        body.append(section('fields', head(f) + '\n    <div class="fields reveal">%s</div>' % cards, soft=True))

    y = p['why']
    stats = ''.join('<div class="stat"><b>%s</b><span>%s</span></div>' % (e(b), e(s)) for b, s in y['stats'])
    body.append(section('why', head(y) + '\n    <div class="stats reveal">%s</div>' % stats))

    s = p['services']
    cards = ''.join('<div class="svc"><i class="fas %s"></i><h3>%s</h3><p>%s</p></div>' % (ic, e(t), e(d)) for ic, t, d in s['cards'])
    body.append(section('services', head(s) + '\n    <div class="services reveal">%s</div>' % cards, soft=bool(p.get('fields')) is False))

    if p.get('gets'):
        g = p['gets']
        items = ''.join('<div class="get"><h3>%s</h3><p>%s</p></div>' % (e(t), e(d)) for t, d in g['items'])
        body.append(section('gets', head(g) + '\n    <div class="gets reveal">%s</div>' % items))

    if p.get('audiences'):
        a = p['audiences']
        cards = ''.join('<div><h3>%s</h3><p>%s</p></div>' % (e(t), e(d)) for t, d in a['cards'])
        body.append(section('audiences', head(a) + '\n    <div class="aud reveal">%s</div>' % cards))

    pr = p['process']
    steps = ''.join('<div class="step"><h3>%s</h3><p>%s</p></div>' % (e(t), e(d)) for t, d in pr['steps'])
    body.append(section('process', head(pr) + '\n    <div class="steps reveal">%s</div>' % steps, soft=True))

    if p.get('pricing'):
        q = p['pricing']
        box = '<div class="price-box reveal"><span class="eyebrow">%s</span><div class="amount">%s</div><p>%s</p><p class="small">%s</p>%s</div>' % (
            e(q['eyebrow']), e(q['price']), e(q['line']), e(q['note']), btn(p, q['cta'], 'wa', 'btn-solid', arrow))
        body.append(section('pricing', head({'h2': q['h2']}) + '\n    ' + box))

    about = ''.join('<p>%s</p>' % (('<strong>%s</strong>' % e(t)) if i == 0 else e(t)) for i, t in enumerate(p['about']))
    body.append('''<section class="sec" id="about">
  <div class="wrap about">
    <img src="images/me.png" alt="שליו רביבו" loading="lazy" class="reveal" />
    <div class="reveal"><span class="eyebrow">אודות</span><h2>היי, אני שליו רביבו</h2>%s</div>
  </div>
</section>
''' % about)

    faq = ''.join('<details><summary>%s</summary><p>%s</p></details>' % (e(qq), e(aa)) for qq, aa in p['faq'])
    body.append(section('faq', head({'eyebrow': 'שאלות נפוצות', 'h2': 'לפני שמתחילים'}) + '\n    <div class="faq reveal">%s</div>' % faq, soft=True))

    c = p['contact']
    opts = ''.join('<option value="%s">%s</option>' % (e(o), e(o)) for o in c['options'])
    body.append('''<section class="sec" id="contact">
  <div class="wrap contact">
    <div class="contact-side reveal">
      <span class="eyebrow">יצירת קשר</span>
      <h2>%(h2)s</h2>
      <p>%(sub)s</p>
      <div class="contact-links">
        <a href="%(wa)s" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i>וואטסאפ: 050-3838810</a>
        <a href="https://www.instagram.com/tzarich_ai" target="_blank" rel="noopener"><i class="fab fa-instagram"></i>@tzarich_ai</a>
      </div>
    </div>
    <div class="reveal">
      <form id="leadForm" novalidate data-page="%(page)s">
        <div class="field"><label for="name">שם מלא</label><input id="name" type="text" autocomplete="name" /><div class="err" id="nameErr">נא להזין שם</div></div>
        <div class="field"><label for="phone">טלפון</label><input id="phone" type="tel" autocomplete="tel" placeholder="050-0000000" /><div class="err" id="phoneErr">נא להזין מספר טלפון תקין</div></div>
        <div class="field"><label for="company">שם העסק</label><input id="company" type="text" autocomplete="organization" /></div>
        <div class="field"><label for="role">סוג העסק</label><select id="role"><option value="">בחרו...</option>%(opts)s</select><div class="err" id="roleErr">נא לבחור סוג עסק</div></div>
        <button class="btn btn-solid" type="submit" id="submitBtn">שליחה</button>
        <p style="font-size:0.8rem;color:var(--muted);margin-top:0.9rem">בשליחת הטופס אתם מאשרים שניצור איתכם קשר. <a href="privacy.html">מדיניות פרטיות</a></p>
      </form>
      <div class="success" id="success"><h3>הפנייה התקבלה</h3><p>אחזור אליכם בהקדם.</p></div>
    </div>
  </div>
</section>
''' % dict(h2=c['h2'], sub=e(c['sub']), wa=e(wa(p['wa_text'])), page=e(p['label']), opts=opts))

    others = ' · '.join('<a href="%s" style="color:inherit">%s</a>' % (u, t) for t, u in [
        ('ראשי', 'index.html'), ('נדל״ן', 'nadlan.html'), ('תכשיטים ואופנה', 'fashion.html'),
        ('מסעדות ואוכל', 'food.html'), ('אפליקציות ו-SaaS', 'saas.html'), ('סקיל לדפי נחיתה', 'skill.html')])
    body.append('''<footer>
  <div class="wrap">
    <span class="f-brand">CUT<span>.</span> productions</span>
    <span>%s</span>
    <span>© 2026 · שליו רביבו · <a href="privacy.html" style="color:inherit">מדיניות פרטיות</a></span>
  </div>
</footer>
<div class="sticky">%s</div>
<a class="wa-float" href="%s" target="_blank" rel="noopener" aria-label="וואטסאפ"><i class="fab fa-whatsapp"></i></a>
<div class="modal" id="modal" role="dialog" aria-modal="true"><button class="modal-x" id="modalX" aria-label="סגירה">&times;</button><div id="modalBody"></div></div>
''' % (others, btn(p, p['sticky'], 'wa'), e(wa(p['wa_text']))))

    return '''<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>%(title)s</title>
  <meta name="description" content="%(desc)s" />
  <meta property="og:title" content="%(title)s" />
  <meta property="og:description" content="%(desc)s" />
  <meta property="og:image" content="%(og)s" />
  <link rel="icon" type="image/png" href="images/favicon.png" />
  <script src="tracking.js"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;800&display=swap" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
  <link rel="stylesheet" href="site.css" />
</head>
<body>
<!-- Built by tools/build.py from tools/pages.py. Edit the text there, the media in media-%(slug)s.js. -->
<nav id="nav">
  <div class="wrap nav-in">
    <a href="index.html" class="brand"><img src="images/logo.png" alt="CUT productions" width="737" height="332" /></a>
    <ul class="nav-links">%(nav)s</ul>
    %(navcta)s
  </div>
</nav>

%(body)s
<script src="media-%(slug)s.js"></script>
<script src="site.js"></script>
<script type="module" src="lead.js"></script>
</body>
</html>
''' % dict(title=e(p['title']), desc=e(p['desc']), og=e(p.get('og', 'images/logo.png')), slug=p['slug'], nav=nav,
           navcta=btn(p, p.get('nav_cta', 'לשיחה קצרה'), '#contact', 'btn-solid nav-cta'), body='\n'.join(body))


def media_js(slug, a):
    return ('/* התמונות והסרטונים של הדף %s.html.\n'
            '   להחלפה: מחליפים קישור. להסרה: מוחקים שורה. הקובץ לא נדרס כשבונים מחדש את הדפים. */\n'
            'window.SITE_MEDIA = %s;\n') % (slug if slug != 'index' else 'index', json.dumps(a, ensure_ascii=False, indent=2))


def main():
    assets = json.load(open(os.path.join(ROOT, 'tools', 'assets.json'), encoding='utf-8'))
    for p in PAGES:
        out = 'index.html' if p['slug'] == 'index' else p['slug'] + '.html'
        open(os.path.join(ROOT, out), 'w', encoding='utf-8').write(render(p))
        mpath = os.path.join(ROOT, 'media-%s.js' % p['slug'])
        if not os.path.exists(mpath) or '--media' in sys.argv:
            open(mpath, 'w', encoding='utf-8').write(media_js(p['slug'], assets['hub' if p['slug'] == 'index' else p['slug']]))
        print('built', out)


if __name__ == '__main__':
    main()
