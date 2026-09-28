(() => {
  const mask = s => String(s || '').replace(/_s=[^&"']*/g, '_s=X').replace(/_k=[^&"']*/g, '_k=X');
  const masks = [...document.querySelectorAll('div.mask')].map(m => ({
    disp: getComputedStyle(m).display, op: getComputedStyle(m).opacity, pe: getComputedStyle(m).pointerEvents
  }));
  // Sichtbare Dialog-Container (position fixed/absolute, gross)
  const dialogs = [...document.querySelectorAll('div')].filter(d => {
    const r = d.getBoundingClientRect();
    const st = getComputedStyle(d);
    return r.width > 300 && r.height > 150 && (st.position === 'fixed' || st.position === 'absolute') && st.display !== 'none' && st.visibility !== 'hidden';
  }).slice(0, 6).map(d => ({
    id: d.id, cls: (d.className || '').toString().slice(0, 60),
    rect: (r => `${Math.round(r.left)},${Math.round(r.top)} ${Math.round(r.width)}x${Math.round(r.height)}`)(d.getBoundingClientRect()),
    text: (d.innerText || '').replace(/\s+/g, ' ').slice(0, 500)
  }));
  // Tabellen in Dialogen
  const tables = [...document.querySelectorAll('table')].map(t => {
    const r = t.getBoundingClientRect();
    if (r.width < 200) return null;
    const rows = [...t.querySelectorAll('tr')].filter(tr => tr.querySelectorAll('tr').length === 0);
    return { n: rows.length, first: rows.slice(0, 12).map(tr => [...tr.children].map(td => (td.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 40)).join(' | ')) };
  }).filter(Boolean);
  return JSON.stringify({ masks, dialogs, tables });
})()
