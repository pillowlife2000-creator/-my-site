/* Ad tracking: Meta Pixel + LinkedIn Insight Tag.
   Fill in the two IDs below to turn tracking on. While an ID is empty, nothing loads.
   Meta Pixel ID:      Meta Events Manager → Connect data source → Web
   LinkedIn Partner ID: LinkedIn Campaign Manager → Analyze → Insight Tag */
(function () {
  var META_PIXEL_ID = '';
  var LINKEDIN_PARTNER_ID = '';
  var GOOGLE_TAG_ID = ''; // Google Ads (AW-...) or GA4 (G-...): Google Ads → Tools → Google tag

  if (GOOGLE_TAG_ID) {
    var g = document.createElement('script');
    g.async = true; g.src = 'https://www.googletagmanager.com/gtag/js?id=' + GOOGLE_TAG_ID;
    document.head.appendChild(g);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', GOOGLE_TAG_ID);
  }

  if (META_PIXEL_ID) {
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', META_PIXEL_ID);
    fbq('track', 'PageView');
  }

  if (LINKEDIN_PARTNER_ID) {
    window._linkedin_partner_id = LINKEDIN_PARTNER_ID;
    window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
    window._linkedin_data_partner_ids.push(LINKEDIN_PARTNER_ID);
    var s = document.getElementsByTagName('script')[0];
    var b = document.createElement('script');
    b.type = 'text/javascript'; b.async = true;
    b.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js';
    s.parentNode.insertBefore(b, s);
  }

  // Called after a lead form is submitted successfully.
  window.trackLead = function (label) {
    if (window.fbq) fbq('track', 'Lead', { content_name: label || 'lead' });
    if (window.gtag) gtag('event', 'generate_lead', { event_label: label || 'lead' });
  };
})();
