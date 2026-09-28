(() => {
  let entfernt = 0;
  const lb = document.getElementById('co_ajaxLightbox');
  if (lb) { lb.remove(); entfernt++; }
  [...document.querySelectorAll('div.mask')].forEach(m => { m.remove(); entfernt++; });
  [...document.querySelectorAll('.SDAjaxLightboxV2')].forEach(m => { m.remove(); entfernt++; });
  return JSON.stringify({
    ok: true, entfernt,
    lightbox: !!document.getElementById('co_ajaxLightbox'),
    masken: document.querySelectorAll('div.mask').length,
    header: window.__rimoHeader()
  });
})()
