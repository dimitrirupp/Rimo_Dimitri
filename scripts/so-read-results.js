(() => {
  const lb = document.getElementById('co_ajaxLightbox');
  if (!lb) return JSON.stringify({ ok: false, why: 'kein Dialog' });
  const tbl = [...lb.querySelectorAll('table')].find(t => /SalesOrderNumber/.test(t.innerText || '')) || [...lb.querySelectorAll('table')].pop();
  const rows = [...tbl.querySelectorAll('tr')].filter(tr => tr.querySelectorAll('tr').length === 0)
    .map(tr => ({ cells: [...tr.children].map(td => (td.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 34)), rd: tr.querySelectorAll('div.rd, input[type=radio]').length }))
    .filter(r => r.cells.some(c => c));
  return JSON.stringify({
    ok: true,
    anzahl: (lb.innerText.match(/(\d+) von (\d+)/) || [])[0] || null,
    rows: rows.slice(0, 15)
  });
})()
