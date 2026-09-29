/* Visual helpers: turn [[kind:args]] tokens into Singapore-style pictures. */
(function () {
  const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const num = s => (isNaN(parseFloat(s)) ? 1 : Math.max(parseFloat(s), 1));

  function bar(arg) {
    const [partsStr, total] = arg.split('|');
    const parts = partsStr.split(',');
    const cells = parts.map(p => `<div class="cell ${p === '?' ? 'q' : ''}" style="flex:${p === '?' ? 3 : num(p)}">${esc(p)}</div>`).join('');
    return `<div class="bar"><div class="cell total">${esc(total || '?')}</div><div class="row">${cells}</div></div>`;
  }
  function cmp(arg) {
    const [nums, names] = arg.split('|');
    const [a, b] = nums.split(',').map(Number);
    const [na, nb] = (names || 'A,B').split(',');
    const max = Math.max(a, b);
    const row = (n, v) => `<div class="cmp-row"><span class="lbl">${esc(n)}</span><div class="cell" style="width:${(v / max) * 100}%">${v}</div></div>`;
    const diff = `<div class="cmp-diff">difference = ${Math.abs(a - b)}</div>`;
    return `<div class="cmp">${row(na, a)}${row(nb, b)}${diff}</div>`;
  }
  function bond(arg) {
    const [whole, partsStr] = arg.split('|');
    const [p1, p2] = partsStr.split(',');
    const c = (t, cls) => `<div class="circ ${cls} ${t === '?' ? 'q' : ''}">${esc(t)}</div>`;
    return `<div class="bond"><div class="top">${c(whole, 'w')}</div><svg viewBox="0 0 120 30" preserveAspectRatio="none"><line x1="60" y1="0" x2="20" y2="30"/><line x1="60" y1="0" x2="100" y2="30"/></svg><div class="bot">${c(p1, 'p')}${c(p2, 'p')}</div></div>`;
  }
  function frame(arg) {
    const n = parseInt(arg, 10);
    const frames = n > 10 ? 2 : 1;
    let out = '';
    for (let f = 0; f < frames; f++) {
      const filled = Math.min(10, Math.max(0, n - f * 10));
      let cells = '';
      for (let i = 0; i < 10; i++) cells += `<span class="fc ${i < filled ? 'on' : ''}"></span>`;
      out += `<div class="tf">${cells}</div>`;
    }
    return `<div class="frames">${out}<div class="cap">${n} counters</div></div>`;
  }
  const kinds = { bar, cmp, bond, frame };
  window.Visuals = {
    kinds,
    expand: html => html.replace(/\[\[(\w+):([^\]]*)\]\]/g, (m, k, a) => (kinds[k] ? kinds[k](a) : ''))
  };
})();
