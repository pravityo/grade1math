/* Illustrations for English and Science lessons. */
(function () {
  const V = window.Visuals.kinds;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const fig = (inner, cls, cap) => `<figure class="ill ${cls || ''}">${inner}${cap ? `<figcaption>${cap}</figcaption>` : ''}</figure>`;
  const svg = (vb, inner, label) => `<svg viewBox="${vb}" role="img" aria-label="${esc(label)}">${inner}</svg>`;
  const item = s => { const m = /^(\S+)\s+(.*)$/.exec(s.trim()); return m ? [m[1], m[2]] : ['', s.trim()]; };

  V.cards = arg => fig(arg.split(',').map(item).map(([e, l]) => `<div class="pcard"><span class="em">${e}</span><b>${esc(l)}</b></div>`).join(''), 'row');
  V.seq = arg => fig(arg.split(',').map(item).map(([e, l], i, a) => `<div class="pcard"><span class="em">${e}</span><b>${esc(l)}</b></div>${i < a.length - 1 ? '<span class="arr">➜</span>' : ''}`).join(''), 'row seq');
  V.cycle = arg => {
    const it = arg.split(',').map(item), c = ([e, l]) => `<div class="pcard"><span class="em">${e}</span><b>${esc(l)}</b></div>`;
    return fig(`<div class="cyc">${c(it[0])}<span class="arr">➜</span>${c(it[1])}<span class="arr">⬆</span><span></span><span class="arr">⬇</span>${c(it[3])}<span class="arr">⬅</span>${c(it[2])}</div>`, '', 'then it starts again');
  };
  V.sentence = arg => {
    const [w, p] = arg.split('|');
    return fig(`<div class="tiles">${w.split(',').map(x => `<span class="tile-w">${esc(x)}</span>`).join('')}${p ? `<span class="tile-w punc">${esc(p)}</span>` : ''}</div>`);
  };
  V.blend = arg => {
    const p = arg.split(',');
    return fig(`<div class="tiles">${p.map((x, i) => `<span class="tile-w">${esc(x)}</span>${i < p.length - 1 ? '<span class="plus">+</span>' : ''}`).join('')}<span class="plus">=</span><span class="tile-w word">${esc(p.join(''))}</span></div>`);
  };
  V.table = arg => {
    const rows = arg.split('|').map(r => r.split(',').map(c => c.trim()));
    const head = rows.shift();
    return fig(`<table class="tbl"><thead><tr>${head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`);
  };

  V.states = () => {
    const dots = (pts, cls) => pts.map(([x, y]) => `<circle class="${cls}" cx="${x}" cy="${y}" r="6"/>`).join('');
    const grid = [], loose = [[20, 75], [38, 80], [58, 72], [76, 82], [30, 92], [52, 90], [70, 95], [18, 96]], gas = [[20, 20], [70, 30], [45, 55], [80, 70], [25, 80], [55, 15], [85, 40], [35, 40]];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) grid.push([20 + c * 20, 40 + r * 15 + 0]);
    const box = (inner, l) => `<div class="one">${svg('0 0 100 110', `<rect class="s-shape" x="3" y="3" width="94" height="104" rx="8" stroke-width="3"/>${inner}`, l)}<span>${l}</span></div>`;
    return fig(box(dots(grid, 's-acc'), 'solid: fixed shape') + box(dots(loose, 's-acc'), 'liquid: flows') + box(dots(gas, 's-acc'), 'gas: spreads out'), 'row');
  };

  V.plant = () => fig(svg('0 0 320 260', `
    <rect x="0" y="150" width="320" height="110" fill="#c9a37a" opacity=".45"/>
    <line x1="160" y1="150" x2="160" y2="60" stroke="#2e9c4a" stroke-width="7" stroke-linecap="round"/>
    <ellipse cx="125" cy="105" rx="30" ry="13" fill="#3fb45c" transform="rotate(-25 125 105)"/>
    <ellipse cx="195" cy="90" rx="30" ry="13" fill="#3fb45c" transform="rotate(25 195 90)"/>
    <circle cx="160" cy="48" r="10" fill="#f5b400"/>${[0, 72, 144, 216, 288].map(a => `<ellipse cx="${160 + 20 * Math.sin(a * Math.PI / 180)}" cy="${48 - 20 * Math.cos(a * Math.PI / 180)}" rx="9" ry="9" fill="#ef6a8a"/>`).join('')}
    <circle cx="160" cy="48" r="8" fill="#f5b400"/>
    <path d="M160 150 L130 210 M160 150 L160 225 M160 150 L190 210 M145 180 L115 200 M175 180 L205 200" stroke="#8a5a2b" stroke-width="4" fill="none" stroke-linecap="round"/>
    <g class="s-txt" font-size="14" font-weight="700"><text x="215" y="45">flower</text><text x="225" y="95">leaf</text><text x="175" y="128">stem</text><text x="205" y="220">roots</text></g>`, 'labelled plant'));

  V.magnet = () => {
    const mag = (x, y, l, r) => `<rect x="${x}" y="${y}" width="50" height="24" fill="${l}"/><rect x="${x + 50}" y="${y}" width="50" height="24" fill="${r}"/>`;
    const lab = (x, y, t) => `<text x="${x}" y="${y}" text-anchor="middle" font-size="14" font-weight="800" fill="#fff">${t}</text>`;
    const R = '#e0403a', B = '#3b6fe0', arrow = (x1, x2, y) => `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" class="s-line" stroke-width="3"/><path d="M${x2 - (x2 > x1 ? 8 : -8)} ${y - 6} L${x2} ${y} L${x2 - (x2 > x1 ? 8 : -8)} ${y + 6}" class="s-line" stroke-width="3"/>`;
    return fig(svg('0 0 460 180', `
      ${mag(20, 20, R, B)}${lab(45, 38, 'N')}${lab(95, 38, 'S')}
      ${mag(230, 20, R, B)}${lab(255, 38, 'N')}${lab(305, 38, 'S')}
      ${arrow(126, 168, 32)}${arrow(224, 182, 32)}
      <text class="s-txt" x="230" y="80" text-anchor="middle" font-size="15" font-weight="700">opposite poles face each other: they attract</text>
      ${mag(20, 105, R, B)}${lab(45, 123, 'N')}${lab(95, 123, 'S')}
      ${mag(230, 105, B, R)}${lab(255, 123, 'S')}${lab(305, 123, 'N')}
      ${arrow(168, 126, 117)}${arrow(182, 224, 117)}
      <text class="s-txt" x="230" y="166" text-anchor="middle" font-size="15" font-weight="700">like poles face each other: they repel</text>`, 'magnets attracting and repelling'));
  };

  V.shadow = () => fig(svg('0 0 420 170', `
    <circle cx="40" cy="70" r="20" fill="#ffd84d" stroke="#b98600" stroke-width="3"/>
    ${[40, 70, 100].map(y => `<line x1="62" y1="70" x2="200" y2="${y}" stroke="#f5b400" stroke-width="2" stroke-dasharray="6 4"/>`).join('')}
    <rect x="150" y="50" width="26" height="70" class="s-shape" stroke-width="3"/>
    <rect x="176" y="118" width="215" height="10" fill="#333" opacity=".55"/>
    <line x1="10" y1="128" x2="410" y2="128" class="s-line" stroke-width="3"/>
    <g class="s-txt" font-size="14" font-weight="700"><text x="40" y="112" text-anchor="middle">light</text><text x="163" y="145" text-anchor="middle">object</text><text x="290" y="150" text-anchor="middle">shadow</text></g>`, 'light, object and shadow'), '', 'light travels in straight lines and cannot pass through the object');

  V.planets = () => {
    const P = [['Mercury', 6, '#b0a99f'], ['Venus', 10, '#e6c07b'], ['Earth', 10, '#3b82f6'], ['Mars', 8, '#d1583a'], ['Jupiter', 24, '#d9a066'], ['Saturn', 20, '#e5cf8a'], ['Uranus', 14, '#7fd6d6'], ['Neptune', 14, '#4a5fd6']];
    let x = 70, s = `<circle cx="-10" cy="60" r="50" fill="#f5b400"/><text class="s-txt" x="12" y="20" font-size="12" font-weight="700">Sun</text>`;
    P.forEach(([n, r, c], i) => { x += i ? P[i - 1][1] + r + 12 : 0; s += `<circle cx="${x}" cy="60" r="${r}" fill="${c}"/>${n === 'Saturn' ? `<ellipse cx="${x}" cy="60" rx="${r + 8}" ry="4" fill="none" stroke="#a88a40" stroke-width="2"/>` : ''}<text class="s-txt" x="${x}" y="${105 + (i % 2) * 14}" text-anchor="middle" font-size="11" font-weight="700">${n}</text>`; });
    return fig(svg('0 0 400 130', s, 'planets in order'), '', 'sizes are not to scale');
  };

  V.moon = () => {
    const ph = (inner, l) => `<div class="one">${svg('0 0 100 100', `<circle cx="50" cy="50" r="40" fill="#2b2a4c"/>${inner}<circle cx="50" cy="50" r="40" fill="none" stroke="#8a86c9" stroke-width="2"/>`, l)}<span>${l}</span></div>`;
    return fig(
      ph('', 'new moon') +
      ph('<path d="M50 10 A40 40 0 0 1 50 90 A22 40 0 0 0 50 10 Z" fill="#fff3c4"/>', 'crescent') +
      ph('<path d="M50 10 A40 40 0 0 1 50 90 Z" fill="#fff3c4"/>', 'half moon') +
      ph('<circle cx="50" cy="50" r="40" fill="#fff3c4"/>', 'full moon'), 'row');
  };

  V.circuit = () => fig(svg('0 0 340 200', `
    <rect x="40" y="40" width="260" height="120" rx="6" fill="none" class="s-line" stroke-width="4"/>
    <rect x="30" y="78" width="20" height="44" fill="var(--card)"/><line x1="26" y1="88" x2="54" y2="88" stroke="#e0403a" stroke-width="5"/><line x1="34" y1="108" x2="46" y2="108" stroke="#333" stroke-width="5"/>
    <circle cx="170" cy="40" r="20" fill="#fff3c4" stroke="#b98600" stroke-width="3"/><path d="M158 28 L182 52 M182 28 L158 52" stroke="#b98600" stroke-width="2"/>
    <rect x="160" y="150" width="40" height="20" fill="var(--card)"/><circle cx="165" cy="160" r="4" class="s-acc"/><circle cx="195" cy="160" r="4" class="s-acc"/><line x1="165" y1="160" x2="190" y2="140" class="s-line" stroke-width="4"/>
    <g class="s-txt" font-size="13" font-weight="700"><text x="12" y="150">battery</text><text x="170" y="15" text-anchor="middle">bulb</text><text x="230" y="185" text-anchor="middle">switch</text></g>`, 'simple circuit'), '', 'the loop must be closed for the bulb to light');

  V.lever = () => fig(svg('0 0 340 170', `
    <polygon points="170,120 145,150 195,150" class="s-shape" stroke-width="3"/>
    <rect x="30" y="112" width="280" height="10" rx="4" fill="#c9a37a" stroke="#8a5a2b" stroke-width="2" transform="rotate(-10 170 117)"/>
    <rect x="248" y="52" width="30" height="30" class="s-shape2" stroke-width="3" transform="rotate(-10 263 67)"/>
    <text x="263" y="72" text-anchor="middle" font-size="12" class="s-txt" font-weight="800">load</text>
    <path d="M60 60 L60 100" class="s-line" stroke-width="4"/><path d="M52 92 L60 102 L68 92" class="s-line" stroke-width="4"/>
    <g class="s-txt" font-size="13" font-weight="700"><text x="60" y="50" text-anchor="middle">push here</text><text x="170" y="167" text-anchor="middle">pivot</text></g>`, 'lever'), '', 'a lever turns on a pivot');
})();
