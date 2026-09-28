(() => {
  const out = {};
  out.header = (document.body.innerText.match(/(Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag), \d{2}\.\d{2}\.\d{4}/) || [null])[0];
  out.url = location.href.replace(/_s=[^&]*/, '_s=X').replace(/_k=[^&]*/, '_k=X');
  out.readyState = document.readyState;
  out.forms = [...document.querySelectorAll('form')].map(f => f.id || '(ohne)');
  out.selectCount = document.querySelectorAll('select').length;
  out.inputTextCount = document.querySelectorAll('input[type=text]').length;
  out.trCount = document.querySelectorAll('tr').length;
  out.trs = [...document.querySelectorAll('tr')].map((tr, i) => ({
    i, top: Math.round(tr.getBoundingClientRect().top),
    sels: tr.querySelectorAll('select').length,
    ins: tr.querySelectorAll('input').length,
    txt: (tr.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 80)
  })).filter(r => r.sels || r.ins || r.txt);
  // Kalenderwerte
  const dayCells = [...document.querySelectorAll('div.day')];
  if (dayCells.length) {
    let tbl = dayCells[0]; while (tbl && tbl.tagName !== 'TABLE') tbl = tbl.parentElement;
    const trs = [...tbl.querySelectorAll('tr')];
    out.kalenderSummen = (trs[2] ? [...trs[2].children].map(td => td.innerText.trim()).join(' | ') : null);
  }
  return JSON.stringify(out);
})()
