(() => {
  const out = {};
  out.header = (document.body.innerText.match(/(Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag), \d{2}\.\d{2}\.\d{4}/) || [null])[0];
  const toolbar = [...document.querySelectorAll('a')]
    .map(a => ({ title: a.title || '', t: (a.textContent || '').trim().slice(0, 30) }))
    .filter(x => /Zeit hinzufügen|Änderungen speichern|Tag freigeben|Periode freigeben/.test(x.title));
  out.toolbar = toolbar;
  return JSON.stringify(out);
})()
