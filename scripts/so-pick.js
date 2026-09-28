(() => {
  const lb = document.getElementById('co_ajaxLightbox');
  if (!lb) return JSON.stringify({ ok: false, why: 'kein Dialog' });
  const want = '__SO__';
  const tbl = [...lb.querySelectorAll('table')].find(t => /SalesOrderNumber/.test(t.innerText || '')) || [...lb.querySelectorAll('table')].pop();
  const rows = [...tbl.querySelectorAll('tr')].filter(tr => tr.querySelectorAll('tr').length === 0);
  const cellsOf = tr => [...tr.children].map(td => (td.innerText || '').replace(/\s+/g, ' ').trim());
  const hit = rows.find(tr => cellsOf(tr).some(x => x === want));
  if (!hit) {
    return JSON.stringify({
      ok: false, why: 'SO "' + want + '" nicht in der Trefferliste',
      treffer: rows.map(cellsOf).filter(c => c.some(x => x)).slice(0, 25)
    });
  }
  const rd = hit.querySelector('div.rd') || hit.querySelector('input[type=radio]');
  if (rd) {
    if (rd.tagName === 'INPUT') { rd.checked = true; rd.dispatchEvent(new Event('change', { bubbles: true })); }
    if (typeof rd.click === 'function') rd.click();
  } else { hit.click ? hit.click() : null; }
  return JSON.stringify({ ok: true, zellen: cellsOf(hit), radio: !!rd, klasse: hit.className });
})()
