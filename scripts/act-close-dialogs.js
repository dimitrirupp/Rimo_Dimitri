(() => {
  const geschlossen = [];
  for (let i = 0; i < 5; i++) {
    const lb = document.getElementById('co_ajaxLightbox');
    if (!lb) break;
    const a = [...lb.querySelectorAll('a')].find(x => /^(Abbrechen|OK|Close|Schließen)$/i.test((x.textContent || '').trim()));
    if (!a) { lb.style.display = 'none'; geschlossen.push('(erzwungen versteckt)'); break; }
    a.onclick ? a.onclick() : a.click();
    geschlossen.push(a.textContent.trim());
  }
  // Stale Masken (§9.1 der Automatisierungs-Doku)
  let masken = 0;
  [...document.querySelectorAll('div.mask')].forEach(m => {
    if (getComputedStyle(m).display !== 'none') { m.style.pointerEvents = 'none'; m.style.display = 'none'; masken++; }
  });
  return JSON.stringify({
    ok: true, geschlossen, maskenEntfernt: masken,
    lightboxJetzt: !!document.getElementById('co_ajaxLightbox'),
    header: window.__rimoHeader()
  });
})()
