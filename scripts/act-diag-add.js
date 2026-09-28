(() => {
  const btns = [...document.querySelectorAll('a')].filter(a => (a.getAttribute('title') || '').startsWith('Zeit hinzufügen'));
  const masks = [...document.querySelectorAll('div.mask')].map(m => ({
    d: getComputedStyle(m).display, pe: getComputedStyle(m).pointerEvents
  }));
  const lb = document.getElementById('co_ajaxLightbox');
  return JSON.stringify({
    header: window.__rimoHeader(),
    nBtns: btns.length,
    btns: btns.map(a => ({
      oc: window.__rimoMask(a.getAttribute('onclick') || '').slice(0, 220),
      sichtbar: a.getBoundingClientRect().width > 0,
      top: Math.round(a.getBoundingClientRect().top),
      cls: (a.className || '').toString().slice(0, 40)
    })),
    masks,
    lightbox: !!lb,
    lightboxText: lb ? (lb.innerText || '').replace(/\s+/g, ' ').slice(0, 250) : null,
    bodyTail: (document.body.innerText || '').replace(/\s+/g, ' ').slice(-300)
  });
})()
