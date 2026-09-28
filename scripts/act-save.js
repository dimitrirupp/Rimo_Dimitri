(() => {
  const a = [...document.querySelectorAll('a')].find(x => (x.getAttribute('title') || '').startsWith('Änderungen speichern'));
  if (!a) return JSON.stringify({ ok: false, why: 'Speichern-Button fehlt' });
  a.onclick ? a.onclick() : a.click();
  return JSON.stringify({ ok: true, header: window.__rimoHeader() });
})()
