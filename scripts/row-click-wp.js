(() => {
  const tin = tr => [...tr.querySelectorAll('input[type=text]')].filter(i => !i.disabled && !i.readOnly);
  const rows = window.__rimoRows();
  const tr = rows.find(r => { const x = tin(r); return x[0] && x[0].value === '__VON__' && x[1] && x[1].value === '__BIS__'; });
  if (!tr) return JSON.stringify({ ok: false, why: 'Zeile ' + '__VON__' + '-' + '__BIS__' + ' nicht gefunden' });
  const wl = window.__rimoWpLink(tr);
  if (!wl) return JSON.stringify({ ok: false, why: 'WP-Link nicht zuordenbar' });
  wl.a.onclick ? wl.a.onclick() : wl.a.click();
  return JSON.stringify({ ok: true, distanz: Math.round(wl.d) });
})()
