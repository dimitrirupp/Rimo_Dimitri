(() => {
  const out = { header: window.__rimoHeader(), trs: [] };
  [...document.querySelectorAll('tr')].forEach((tr, i) => {
    if (tr.querySelectorAll('tr').length) return;
    const t = (tr.innerText || '').replace(/\s+/g, ' ').trim();
    if (!t) return;
    const nIn = tr.querySelectorAll('input').length;
    const nSel = tr.querySelectorAll('select').length;
    out.trs.push({ i, top: Math.round(tr.getBoundingClientRect().top), nIn, nSel, txt: t.slice(0, 150) });
  });
  return JSON.stringify(out);
})()
