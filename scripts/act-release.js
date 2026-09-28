(() => {
  const a = [...document.querySelectorAll('a')].find(x => (x.getAttribute('title') || '').startsWith('Tag freigeben'));
  if (!a) return JSON.stringify({ ok: false, why: 'Freigeben-Button fehlt', header: window.__rimoHeader() });
  a.onclick ? a.onclick() : a.click();
  return JSON.stringify({ ok: true, header: window.__rimoHeader() });
})()
