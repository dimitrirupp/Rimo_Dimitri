(() => {
  const tin = tr => [...tr.querySelectorAll('input[type=text]')].filter(i => !i.disabled && !i.readOnly);
  const rows = window.__rimoRows();
  const tr = rows.find(r => { const x = tin(r); return x[0] && x[0].value === '__VONALT__' && x[1] && x[1].value === '__BISALT__'; });
  if (!tr) return JSON.stringify({ ok: false, why: 'Zeile ' + '__VONALT__' + '-' + '__BISALT__' + ' nicht gefunden', rows: rows.map(r => window.__rimoRowInfo(r)) });
  const x = tin(tr);
  if (x.length < 2) return JSON.stringify({ ok: false, why: 'Von/Bis fehlen' });
  window.__rimoSet(x[0], '__VON__');
  window.__rimoSet(x[1], '__BIS__');
  return JSON.stringify({ ok: true, von: x[0].value, bis: x[1].value });
})()
