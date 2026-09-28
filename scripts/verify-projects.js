(() => {
  const out = { header: window.__rimoHeader(), eintraege: [] };
  let last = null;
  [...document.querySelectorAll('tr')].forEach(tr => {
    if (tr.querySelectorAll('tr').length) return;
    const t = (tr.innerText || '').replace(/\s+/g, ' ').trim();
    const m = t.match(/^Name\s*(\d{4})$/);
    if (m) { last = m[1]; return; }
    const desc = [...tr.querySelectorAll('input')].find(i => (i.className || '').toString().indexOf('desc') >= 0);
    if (desc) { out.eintraege.push({ wp: t.slice(0, 62), projekt: last }); last = null; }
  });
  return JSON.stringify(out);
})()
