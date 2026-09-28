// Rimo-Helfer (werden vor jede Aktion geladen). Keine Secrets.
(function () {
  window.__rimoMask = s => String(s || '').replace(/_s=[^&"']*/g, '_s=X').replace(/_k=[^&"']*/g, '_k=X');

  const has70008 = tr => [...tr.querySelectorAll('select')]
    .some(s => [...s.options].some(o => /^70008/.test(o.textContent.trim())));
  const hasProjectSelect = f => [...f.querySelectorAll('select')]
    .some(s => [...s.options].some(o => /^70008/.test(o.textContent.trim())));
  // Innermost trs mit Projekt-Select (Zeilen enthalten oft eine verschachtelte Tabelle)
  const entryTrs = f => {
    const cands = [...f.querySelectorAll('tr')].filter(has70008);
    return cands.filter(tr => !cands.some(o => o !== tr && tr.contains(o)));
  };
  const isEntryTr = tr => has70008(tr) && ![...tr.querySelectorAll('tr')].some(has70008);

  // LEBENDES Zeiterfassungs-Formular: bevorzugt das Formular MIT Eintragszeilen
  window.__rimoForm = function () {
    const forms = [...document.querySelectorAll('form')];
    const withEntry = forms.filter(f => [...f.querySelectorAll('tr')].some(isEntryTr));
    if (withEntry.length) return withEntry[withEntry.length - 1];
    const withSel = forms.filter(hasProjectSelect);
    return withSel.length ? withSel[withSel.length - 1] : null;
  };

  window.__rimoRows = function () {
    const f = window.__rimoForm(); if (!f) return [];
    return [...f.querySelectorAll('tr')].filter(isEntryTr);
  };

  // Offene Zeile = Projekt-Select auf Platzhalter (selectedIndex 0)
  window.__rimoOpenRow = function () {
    return window.__rimoRows().find(tr => {
      const s = tr.querySelector('select');
      return s && s.selectedIndex === 0;
    }) || null;
  };

  window.__rimoWpLink = function (tr) {
    const f = tr.closest('form') || window.__rimoForm(); if (!f) return null;
    const top = tr.getBoundingClientRect().top;
    const c = [...f.querySelectorAll('a')].filter(a => /Ticket \/ WP/i.test(a.textContent || ''))
      .map(a => ({ a, d: Math.abs(a.getBoundingClientRect().top - top) })).sort((x, y) => x.d - y.d);
    return c.length && c[0].d < 80 ? c[0] : null;
  };

  // Erste Zeile UNTER dem Eintrag (WP-Label oder "Ticket / WP wählen")
  window.__rimoUnterZeile = function (tr) {
    const f = tr.closest('form') || window.__rimoForm(); if (!f) return null;
    const top = tr.getBoundingClientRect().top;
    const c = [...f.querySelectorAll('tr')]
      .filter(o => o !== tr && !tr.contains(o) && o.querySelectorAll('tr').length === 0)
      .map(o => ({ o, d: o.getBoundingClientRect().top - top }))
      .filter(x => x.d > 5 && x.d < 80).sort((x, y) => x.d - y.d);
    return c.length ? { d: Math.round(c[0].d), txt: (c[0].o.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 140) } : null;
  };

  window.__rimoRowInfo = function (tr) {
    const sels = [...tr.querySelectorAll('select')];
    const allText = [...tr.querySelectorAll('input[type=text]')];
    const tin = allText.filter(i => !i.disabled && !i.readOnly);
    const un = window.__rimoUnterZeile(tr);
    return {
      top: Math.round(tr.getBoundingClientRect().top),
      von: tin[0] ? tin[0].value : null,
      bis: tin[1] ? tin[1].value : null,
      std: allText.filter(i => i.disabled).map(i => i.value)[0] || null,
      projekt: sels[0] ? (sels[0].options[sels[0].selectedIndex] || {}).textContent.trim() : null,
      projektIdx: sels[0] ? sels[0].selectedIndex : null,
      taetigkeit: sels[1] ? (sels[1].options[sels[1].selectedIndex] || {}).textContent.trim() : null,
      nTaetigOpts: sels[1] ? sels[1].options.length : 0,
      status: allText.map(i => i.value).filter(v => v === 'NEW' || v === 'SUB')[0] || null,
      unterZeile: un ? un.txt : null
    };
  };

  window.__rimoSet = function (el, v) {
    const proto = el.tagName === 'SELECT' ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, v);
    ['input', 'change', 'blur'].forEach(t => el.dispatchEvent(new Event(t, { bubbles: true })));
  };

  window.__rimoHeader = function () {
    const m = document.body.innerText.match(/(Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag), \d{2}\.\d{2}\.\d{4}/);
    return m ? m[0] : null;
  };

  window.__rimoCalSums = function () {
    const cells = [...document.querySelectorAll('div.day')];
    if (!cells.length) return null;
    let tbl = cells[0]; while (tbl && tbl.tagName !== 'TABLE') tbl = tbl.parentElement;
    const trs = [...tbl.querySelectorAll('tr')];
    return { days: trs[1] ? [...trs[1].children].map(td => td.innerText.trim()) : [],
             sums: trs[2] ? [...trs[2].children].map(td => td.innerText.trim()) : [] };
  };
})();
