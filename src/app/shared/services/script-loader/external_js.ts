import { environment } from 'src/environments/environment';

/**GTM loading script */
export const gtm_script: string = `
  (function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js'
    });
    var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s),
      dl = l != 'dataLayer' ? '&l=' + l : '';
    // j.async = true;
    j.defered = true;
    j.setAttribute('rel', 'preconnect');
    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
    j.addEventListener('load', function() {
      var _ge = new CustomEvent('gtm_loaded', { bubbles: true });
      d.dispatchEvent(_ge);
    });
    f.parentNode.insertBefore(j, f);
  })(window, document, 'script', 'dataLayer', '${environment.gtm_id}');
`;

/**Clever Tap loading script */
export const clevertap_script: string = `
  var clevertap = {event:[], profile:[], account:[], onUserLogin:[], notifications:[], privacy:[], region: 'in1'};
  clevertap.account.push({"id": '${environment.clevertap_id}'});
  clevertap.privacy.push({optOut: false}); //set the flag to true, if the user of the device opts out of sharing their data
  clevertap.privacy.push({useIP: false}); //set the flag to true, if the user agrees to share their IP data
  (function () {
    var wzrk = document.createElement('script');
    wzrk.type = 'text/javascript';
    wzrk.async = true;
    wzrk.defered = true;
    wzrk.setAttribute('rel', 'preconnect');
    wzrk.src = ('https:' == document.location.protocol ? 'https://d2r1yp2w7bby2u.cloudfront.net' : 'http://static.clevertap.com') + '/js/clevertap.min.js';
    var s = document.getElementsByTagName('script')[0];
    s.addEventListener('load', function() {
      var _ct = new CustomEvent('ct_loaded', { bubbles: true });
      document.dispatchEvent(_ct);
    });
    s.parentNode.insertBefore(wzrk, s);
  })();
`;

export const microsoft_clarity: string = `
(function (c, l, a, r, i, t, y) {
  c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments) };
  t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
  y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
  t.addEventListener('load', function() {
    var _ct = new CustomEvent('clarity_loaded', { bubbles: true });
    document.dispatchEvent(_ct);
  });
})(window, document, "clarity", "script", '${environment.microsoft_clarity}');
`;
