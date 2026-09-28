(() => {
  const tin = tr => [...tr.querySelectorAll('input[type=text]')].filter(i => !i.disabled && !i.readOnly);
  const rows = window.__rimoRows();
  const tr = rows.find(r => { const x = tin(r); return x[0] && x[0].value === '__VON__' && x[1] && x[1].value === '__BIS__'; })
    || window.__rimoOpenRow();
  if (!tr) return JSON.stringify({ ok: false, why: 'Zeile nicht gefunden' });
  const a = [...tr.querySelectorAll('a')].find(x => (x.getAttribute('title') || '') === 'Search SO');
  if (!a) return JSON.stringify({ ok: false, why: 'Search-SO-Link fehlt', links: [...tr.querySelectorAll('a')].map(x => x.title || (x.textContent || '').trim()) });
  a.onclick ? a.onclick() : a.click();
  return JSON.stringify({ ok: true });
})()
