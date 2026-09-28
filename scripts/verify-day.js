(() => {
  const out = { header: window.__rimoHeader(), eintraege: [], statusAlle: [] };
  out.statusAlle = [...document.querySelectorAll('input[type=text]')].map(i => i.value).filter(v => v === 'SUB' || v === 'NEW');
  [...document.querySelectorAll('tr')].forEach(tr => {
    if (tr.querySelectorAll('tr').length) return;
    const desc = [...tr.querySelectorAll('input')].find(i => (i.className || '').toString().indexOf('desc') >= 0);
    if (!desc) return;
    let projekt = null;
    let el = tr;
    for (let k = 0; k < 4 && el.parentElement; k++) {
      el = el.parentElement;
      const flat = (el.innerText || '').replace(/\s+/g, ' ');
      if (flat.length > 1400) break;
      const m = flat.match(/Name\s*(\d{4})/);
      if (m) { projekt = m[1]; break; }
    }
    out.eintraege.push({ wp: (tr.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 60), projekt });
  });
  // Kalender
  const cells = [...document.querySelectorAll('div.day')];
  if (cells.length) {
    let tbl = cells[0]; while (tbl && tbl.tagName !== 'TABLE') tbl = tbl.parentElement;
    const trs = [...tbl.querySelectorAll('tr')];
    out.kalender = { tage: trs[1] ? [...trs[1].children].map(td => td.innerText.trim()) : [], summen: trs[2] ? [...trs[2].children].map(td => td.innerText.trim()) : [] };
  }
  return JSON.stringify(out);
})()
