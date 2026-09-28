(() => {
  const target = '__DAY__';
  const cell = [...document.querySelectorAll('div.day')].find(e => e.textContent.trim() === target);
  if (!cell) return JSON.stringify({ ok: false, why: 'Tageszelle ' + target + ' nicht gefunden' });
  const td = cell.parentElement;
  const oc = td.getAttribute('onclick') || '';
  if (!oc) return JSON.stringify({ ok: false, why: 'kein onclick an Eltern-TD' });
  td.onclick();
  return JSON.stringify({ ok: true, clicked: target });
})()
