(() => {
  const tin = tr => [...tr.querySelectorAll('input[type=text]')].filter(i => !i.disabled && !i.readOnly);
  const rows = window.__rimoRows();
  const tr = rows.find(r => { const x = tin(r); return x[0] && x[0].value === '__VON__' && x[1] && x[1].value === '__BIS__'; });
  if (!tr) return JSON.stringify({ ok: false, why: 'Zeile ' + '__VON__' + '-' + '__BIS__' + ' nicht gefunden', rows: rows.map(r => window.__rimoRowInfo(r)) });
  const sel = tr.querySelector('select');
  const opt = [...sel.options].find(o => o.textContent.trim().indexOf('__PROJ__') === 0);
  if (!opt) return JSON.stringify({ ok: false, why: 'Projekt nicht im Dropdown', opts: [...sel.options].map(o => o.textContent.trim()) });
  window.__rimoSet(sel, opt.value);
  return JSON.stringify({ ok: true, gesetzt: opt.textContent.trim() });
})()
