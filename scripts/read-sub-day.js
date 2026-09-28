(() => {
  const out = { header: window.__rimoHeader(), rows: [], inputs: [] };
  [...document.querySelectorAll('form')].forEach(f => {
    [...f.querySelectorAll('tr')].forEach(tr => {
      if (tr.querySelectorAll('tr').length) return;
      const ins = [...tr.querySelectorAll('input')];
      const desc = ins.filter(i => (i.className || '').toString().indexOf('desc') >= 0);
      if (!desc.length) return;
      out.rows.push({
        txt: (tr.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 200),
        inputs: ins.map(i => ({ t: i.type, v: i.value, cls: (i.className || '').toString().slice(0, 20), dis: i.disabled, ro: i.readOnly }))
      });
    });
  });
  out.statusAlle = [...document.querySelectorAll('input[type=text]')].map(i => i.value).filter(v => v === 'SUB' || v === 'NEW');
  return JSON.stringify(out);
})()
