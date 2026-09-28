(() => {
  const btn = [...document.querySelectorAll('a')].find(a => (a.getAttribute('title') || '').startsWith('Zeit hinzufügen'));
  if (!btn) return JSON.stringify({ ok: false, why: 'Button fehlt' });
  btn.onclick ? btn.onclick() : btn.click();
  return JSON.stringify({ ok: true, header: window.__rimoHeader() });
})()
