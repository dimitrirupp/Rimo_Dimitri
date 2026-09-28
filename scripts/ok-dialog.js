(() => {
  const lb = document.getElementById('co_ajaxLightbox');
  const btns = lb ? [...lb.querySelectorAll('a')].filter(a => /^(OK|Abbrechen)$/i.test((a.textContent || '').trim())) : [];
  const all = [...document.querySelectorAll('a')].filter(a => /^(OK|Abbrechen)$/i.test((a.textContent || '').trim()));
  const target = btns.find(a => /^OK$/i.test(a.textContent.trim())) || all.find(a => /^OK$/i.test(a.textContent.trim()));
  if (!target) return JSON.stringify({ ok: false, why: 'kein OK-Button gefunden', kandidaten: all.length });
  target.onclick ? target.onclick() : target.click();
  return JSON.stringify({ ok: true });
})()
