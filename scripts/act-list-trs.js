(() => {
  const f = window.__rimoForm();
  if (!f) return JSON.stringify({ ok: false, why: 'kein Formular' });
  const trs = [...f.querySelectorAll('tr')].map((tr, i) => ({
    i, top: Math.round(tr.getBoundingClientRect().top),
    nested: tr.querySelectorAll('tr').length,
    nSel: tr.querySelectorAll('select').length,
    txt: (tr.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 130)
  })).filter(t => t.txt);
  return JSON.stringify({ header: window.__rimoHeader(), formId: f.id, trs });
})()
