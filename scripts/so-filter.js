(() => {
  const lb = document.getElementById('co_ajaxLightbox');
  if (!lb) return JSON.stringify({ ok: false, why: 'kein Dialog' });
  const sel = [...lb.querySelectorAll('select')].find(s => s.name === '460') || lb.querySelector('select');
  const inp = lb.querySelector('input.searchBox');
  if (!sel || !inp) return JSON.stringify({ ok: false, why: 'Suchfelder fehlen' });
  const opt = [...sel.options].find(o => o.textContent.trim() === '__FELD__');
  if (!opt) return JSON.stringify({ ok: false, why: 'Suchfeld-Option fehlt', opts: [...sel.options].map(o => o.textContent.trim()) });
  window.__rimoSet(sel, opt.value);
  window.__rimoSet(inp, '__SUCHE__');
  const filter = [...lb.querySelectorAll('a')].find(a => (a.getAttribute('title') || '') === 'Filter');
  if (filter) { filter.onclick ? filter.onclick() : filter.click(); }
  return JSON.stringify({ ok: true, feld: opt.textContent.trim(), suchtext: inp.value, filterGeklickt: !!filter });
})()
