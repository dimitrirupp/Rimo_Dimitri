(() => {
  const lb = document.getElementById('co_ajaxLightbox');
  if (!lb) return JSON.stringify({ ok: false, why: 'kein Dialog (co_ajaxLightbox)' });
  const psp = '__PSP__';
  const rows = [...lb.querySelectorAll('tr')].filter(tr => tr.querySelectorAll('tr').length === 0);
  const cellsOf = tr => [...tr.children].map(td => (td.innerText || '').replace(/\s+/g, ' ').trim());

  // Zeile, in der irgendeine Zelle exakt dem PSP-Code entspricht (und die >=5 Zellen hat)
  const hit = rows.find(tr => {
    const c = cellsOf(tr);
    return c.length >= 5 && c.some(x => x === psp);
  });
  if (!hit) {
    return JSON.stringify({
      ok: false, why: 'PSP ' + psp + ' nicht im Dialog',
      verfuegbar: rows.map(cellsOf).filter(c => c.length >= 5).map(c => c.join(' | ')).slice(0, 40),
      dialogText: (lb.innerText || '').replace(/\s+/g, ' ').slice(0, 250)
    });
  }
  const rd = hit.querySelector('div.rd') || hit.querySelector('input[type=radio]');
  if (rd) {
    if (rd.tagName === 'INPUT') { rd.checked = true; rd.dispatchEvent(new Event('change', { bubbles: true })); }
    if (typeof rd.click === 'function') rd.click();
  } else {
    hit.click ? hit.click() : null;
  }
  return JSON.stringify({
    ok: true,
    zellen: cellsOf(hit),
    radioGefunden: !!rd,
    klasseNachKlick: hit.className,
    selectedZeilen: [...lb.querySelectorAll('tr.selected')].length
  });
})()
