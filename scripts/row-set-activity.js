(() => {
  const tin = tr => [...tr.querySelectorAll('input[type=text]')].filter(i => !i.disabled && !i.readOnly);
  const rows = window.__rimoRows();
  const tr = rows.find(r => { const x = tin(r); return x[0] && x[0].value === '__VON__' && x[1] && x[1].value === '__BIS__'; });
  if (!tr) return JSON.stringify({ ok: false, why: 'Zeile ' + '__VON__' + '-' + '__BIS__' + ' nicht gefunden' });
  const act = [...tr.querySelectorAll('select')][1];
  if (!act) return JSON.stringify({ ok: false, why: 'kein Tätigkeits-Select' });
  const goal = ('__JOB__'.indexOf('__') === 0) ? 'Arbeitszeit/ Montage' : '__JOB__';
  const opt = [...act.options].find(o => o.textContent.trim() === goal);
  if (!opt) return JSON.stringify({ ok: false, why: 'Option "' + goal + '" fehlt', opts: [...act.options].map(o => o.textContent.trim()) });
  window.__rimoSet(act, opt.value);
  return JSON.stringify({ ok: true, gesetzt: opt.textContent.trim() });
})()
