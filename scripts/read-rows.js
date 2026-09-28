(() => {
  const rows = window.__rimoRows();
  return JSON.stringify({
    header: window.__rimoHeader(),
    formId: (window.__rimoForm() || {}).id || null,
    nRows: rows.length,
    rows: rows.map(tr => window.__rimoRowInfo(tr))
  });
})()
