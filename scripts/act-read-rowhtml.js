(() => {
  const rows = window.__rimoRows();
  return JSON.stringify({
    header: window.__rimoHeader(),
    kalender: window.__rimoCalSums(),
    rows: rows.map(tr => ({
      info: window.__rimoRowInfo(tr),
      txt: (tr.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 200),
      html: window.__rimoMask(tr.outerHTML).replace(/\s+/g, ' ').slice(0, 2200)
    }))
  });
})()
