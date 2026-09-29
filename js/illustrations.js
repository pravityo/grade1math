/* More illustrations, registered as [[kind:args]] tokens (see render.js). */
(function () {
  const V = window.Visuals.kinds;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const fig = (inner, cls, cap) => `<figure class="ill ${cls || ''}">${inner}${cap ? `<figcaption>${cap}</figcaption>` : ''}</figure>`;
  const svg = (vb, inner, label) => `<svg viewBox="${vb}" role="img" aria-label="${esc(label)}">${inner}</svg>`;
  const rng = n => Array.from({ length: n }, (_, i) => i);

  /* number line with jumps: line:0,20|8,10,13 */
  V.line = arg => {
    const [r, m] = arg.split('|'); const [a, b] = r.split(',').map(Number);
    const pts = (m || '').split(',').filter(Boolean).map(Number), span = b - a;
    const x = v => 24 + (v - a) / span * 552, t = span <= 20 ? 1 : span <= 60 ? 5 : 10;
    let s = `<line class="s-line" x1="${x(a)}" y1="70" x2="${x(b)}" y2="70" stroke-width="3"/>`;
    for (let v = a; v <= b; v += t) {
      s += `<line class="s-line" x1="${x(v)}" y1="64" x2="${x(v)}" y2="76" stroke-width="2"/>`;
      if (span <= 20 || v % 10 === 0) s += `<text class="s-mut" x="${x(v)}" y="92" text-anchor="middle" font-size="13">${v}</text>`;
    }
    pts.forEach((p, i) => {
      s += `<circle class="s-acc" cx="${x(p)}" cy="70" r="7"/>`;
      if (i) {
        const q = pts[i - 1], d = p - q, mid = (x(p) + x(q)) / 2;
        s += `<path class="s-line" fill="none" stroke-width="2.5" d="M${x(q)} 62 Q${mid} 6 ${x(p)} 62"/><text class="s-txt" x="${mid}" y="26" text-anchor="middle" font-size="15" font-weight="700">${d > 0 ? '+' : '-'}${Math.abs(d)}</text>`;
      }
      s += `<text class="s-txt" x="${x(p)}" y="112" text-anchor="middle" font-size="16" font-weight="800">${p}</text>`;
    });
    return fig(svg('0 0 600 122', s, 'number line'), 'wide');
  };

  /* equal groups: groups:3,4,🍪 */
  V.groups = arg => {
    const [n, k, e] = arg.split(',');
    return fig(rng(+n).map(() => `<div class="grp">${Array(+k).fill(`<span>${e}</span>`).join('')}</div>`).join(''), 'groups', `${n} groups of ${k}`);
  };

  /* analogue clocks: clock:4,30;3,0 */
  const clock = (h, m) => {
    const ang = d => d * Math.PI / 180, hx = ((h % 12) + m / 60) * 30, mx = m * 6;
    const p = (deg, len) => `${60 + len * Math.sin(ang(deg))} ${60 - len * Math.cos(ang(deg))}`;
    let s = `<circle class="s-face" cx="60" cy="60" r="55" stroke-width="4"/>`;
    for (let i = 1; i <= 12; i++) s += `<text class="s-txt" x="${60 + 43 * Math.sin(ang(i * 30))}" y="${64 + 43 * -Math.cos(ang(i * 30))}" text-anchor="middle" font-size="12" font-weight="700">${i}</text>`;
    s += `<line class="s-acc2" x1="60" y1="60" x2="${p(hx, 28).split(' ')[0]}" y2="${p(hx, 28).split(' ')[1]}" stroke-width="5" stroke-linecap="round"/>`;
    s += `<line class="s-line" x1="60" y1="60" x2="${p(mx, 44).split(' ')[0]}" y2="${p(mx, 44).split(' ')[1]}" stroke-width="3" stroke-linecap="round"/><circle class="s-acc" cx="60" cy="60" r="4"/>`;
    return `<div class="one">${svg('0 0 120 120', s, `clock showing ${h}:${String(m).padStart(2, '0')}`)}<span>${h}:${String(m).padStart(2, '0')}</span></div>`;
  };
  V.clock = arg => fig(arg.split(';').map(t => clock(...t.split(',').map(Number))).join(''), 'row');

  /* Singapore coins: coins:5,10,20,50,100 */
  V.coins = arg => fig(arg.split(',').map(v => {
    v = +v; const r = { 5: 17, 10: 19, 20: 22, 50: 25, 100: 28 }[v] || 20, lab = v >= 100 ? '$1' : v + 'c';
    return `<div class="one">${svg('0 0 60 60', `<circle class="s-coin" cx="30" cy="30" r="${r}" stroke-width="3"/><text class="s-txt" x="30" y="36" text-anchor="middle" font-size="16" font-weight="800">${lab}</text>`, lab + ' coin')}</div>`;
  }).join(''), 'row');

  /* flat shapes: shapes:triangle,square */
  V.shapes = arg => fig(arg.split(',').map(n => {
    const sides = { triangle: 3, square: 4, rectangle: 4, pentagon: 5, hexagon: 6, circle: 0 }[n];
    let body;
    if (n === 'square') body = '<rect class="s-shape" x="18" y="18" width="54" height="54" stroke-width="3"/>';
    else if (n === 'rectangle') body = '<rect class="s-shape" x="8" y="26" width="74" height="38" stroke-width="3"/>';
    else if (n === 'circle') body = '<circle class="s-shape" cx="45" cy="45" r="33" stroke-width="3"/>';
    else body = `<polygon class="s-shape" stroke-width="3" points="${rng(sides).map(i => { const a = (-90 + i * 360 / sides) * Math.PI / 180; return `${45 + 37 * Math.cos(a)},${48 + 37 * Math.sin(a)}`; }).join(' ')}"/>`;
    return `<div class="one">${svg('0 0 90 90', body, n)}<span>${n}${sides ? `<br>${sides} sides` : '<br>0 sides'}</span></div>`;
  }).join(''), 'row');

  /* solids: cube, sphere, cylinder */
  V.solids = () => fig(`
    <div class="one">${svg('0 0 100 100', '<polygon class="s-shape" stroke-width="3" points="15,38 15,85 62,85 62,38"/><polygon class="s-shape2" stroke-width="3" points="15,38 38,18 85,18 62,38"/><polygon class="s-shape3" stroke-width="3" points="62,38 85,18 85,65 62,85"/>', 'cube')}<span>cube<br>6 faces</span></div>
    <div class="one">${svg('0 0 100 100', '<circle class="s-shape" cx="50" cy="50" r="36" stroke-width="3"/><ellipse class="s-line" cx="50" cy="50" rx="36" ry="10" fill="none" stroke-width="1.5" stroke-dasharray="4 3"/>', 'sphere')}<span>sphere<br>rolls</span></div>
    <div class="one">${svg('0 0 100 100', '<path class="s-shape" stroke-width="3" d="M22 25 v50 a28 10 0 0 0 56 0 v-50 z"/><ellipse class="s-shape2" cx="50" cy="25" rx="28" ry="10" stroke-width="3"/>', 'cylinder')}<span>cylinder<br>2 circles</span></div>`, 'row');

  /* dice faces: dice:1,6,2,5 */
  V.dice = arg => {
    const P = { 1: [[30, 30]], 2: [[18, 18], [42, 42]], 3: [[18, 18], [30, 30], [42, 42]], 4: [[18, 18], [42, 18], [18, 42], [42, 42]], 5: [[18, 18], [42, 18], [30, 30], [18, 42], [42, 42]], 6: [[18, 16], [42, 16], [18, 30], [42, 30], [18, 44], [42, 44]] };
    return fig(arg.split(',').map(v => `<div class="one">${svg('0 0 60 60', `<rect class="s-die" x="3" y="3" width="54" height="54" rx="10" stroke-width="3"/>${P[v].map(([x, y]) => `<circle class="s-acc" cx="${x}" cy="${y}" r="5"/>`).join('')}`, 'dice ' + v)}</div>`).join(''), 'row');
  };

  /* fraction circles: pie:1,2;3,4 */
  V.pie = arg => fig(arg.split(';').map(f => {
    const [n, d] = f.split(',').map(Number), pt = a => `${50 + 42 * Math.cos(a)} ${50 + 42 * Math.sin(a)}`;
    const body = rng(d).map(i => { const a0 = (-90 + i * 360 / d) * Math.PI / 180, a1 = (-90 + (i + 1) * 360 / d) * Math.PI / 180; return `<path class="${i < n ? 's-on' : 's-off'}" stroke-width="3" d="M50 50 L${pt(a0)} A42 42 0 0 1 ${pt(a1)} Z"/>`; }).join('');
    return `<div class="one">${svg('0 0 100 100', body, `${n} of ${d} parts`)}<span>${n}/${d}</span></div>`;
  }).join(''), 'row');

  /* hundred chart: hundred:5 (multiples) or hundred:end7 */
  V.hundred = arg => {
    const end = /^end(\d)$/.exec(arg), k = end ? +end[1] : +arg;
    return fig(`<div class="h100">${rng(100).map(i => { const v = i + 1, on = end ? v % 10 === k : v % k === 0; return `<span class="${on ? 'on' : ''}">${v}</span>`; }).join('')}</div>`, '', end ? `numbers ending in ${k}` : `count by ${k}s`);
  };

  /* venn: venn:3,2,2|Cats,Dogs (only A, both, only B) */
  V.venn = arg => {
    const [c, l] = arg.split('|'), [a, b, d] = c.split(','), [na, nb] = l.split(',');
    return fig(svg('0 0 300 170', `<circle class="s-venn1" cx="115" cy="90" r="64" stroke-width="3"/><circle class="s-venn2" cx="185" cy="90" r="64" stroke-width="3"/>
      <text class="s-txt" x="80" y="98" text-anchor="middle" font-size="24" font-weight="800">${a}</text><text class="s-txt" x="150" y="98" text-anchor="middle" font-size="24" font-weight="800">${b}</text><text class="s-txt" x="220" y="98" text-anchor="middle" font-size="24" font-weight="800">${d}</text>
      <text class="s-mut" x="85" y="16" text-anchor="middle" font-size="15" font-weight="700">${esc(na)}</text><text class="s-mut" x="215" y="16" text-anchor="middle" font-size="15" font-weight="700">${esc(nb)}</text>`, 'Venn diagram'), '', 'the middle is "both"');
  };

  /* queue: queue:9,4 */
  V.queue = arg => {
    const [n, p] = arg.split(',').map(Number), show = n > 14 ? [...rng(13).map(i => i + 1), '…', n] : rng(n).map(i => i + 1);
    return fig(`<div class="queue"><small>front</small>${show.map(v => `<span class="${v === p ? 'you' : ''} ${v === '…' ? 'gap' : ''}">${v}</span>`).join('')}<small>back</small></div>`, '', p ? `child number ${p} is highlighted` : '');
  };

  /* fence posts or rope cuts: fence:20,5 or fence:12,3|cut */
  V.fence = arg => {
    const [c, mode] = arg.split('|'), [L, st] = c.split(',').map(Number), x = v => 20 + v / L * 560, cnt = L / st;
    let s = `<line class="s-line" x1="20" y1="50" x2="580" y2="50" stroke-width="${mode ? 12 : 4}" stroke-linecap="round"/>`;
    for (let v = 0; v <= L; v += st) {
      const inner = v > 0 && v < L;
      if (mode) { if (inner) s += `<text x="${x(v)}" y="46" text-anchor="middle" font-size="22">✂️</text>`; }
      else s += `<rect class="s-acc" x="${x(v) - 5}" y="26" width="10" height="48" rx="3"/>`;
      s += `<text class="s-mut" x="${x(v)}" y="92" text-anchor="middle" font-size="13">${v}</text>`;
    }
    return fig(svg('0 0 600 100', s, mode ? 'rope' : 'fence'), 'wide', mode ? `${cnt - 1} cuts make ${cnt} pieces` : `${cnt + 1} posts, ${cnt} gaps`);
  };

  /* tally marks: tally:8 */
  V.tally = arg => {
    const n = +arg, g = Math.floor(n / 5), r = n % 5; let s = '';
    const grp = (x, k, slash) => { for (let i = 0; i < k; i++) s += `<line class="s-line" x1="${x + i * 11}" y1="10" x2="${x + i * 11}" y2="60" stroke-width="4" stroke-linecap="round"/>`; if (slash) s += `<line class="s-line" x1="${x - 6}" y1="52" x2="${x + 50}" y2="18" stroke-width="4" stroke-linecap="round"/>`; };
    rng(g).forEach(i => grp(14 + i * 70, 4, true)); if (r) grp(14 + g * 70, r, false);
    return fig(svg(`0 0 ${Math.max(1, g + (r ? 1 : 0)) * 70 + 10} 70`, s, `${n} tally marks`));
  };

  /* ruler with pencil: ruler:3,11 */
  V.ruler = arg => {
    const [a, b] = arg.split(',').map(Number), x = v => 24 + v * 46;
    let s = `<rect class="s-ruler" x="14" y="62" width="574" height="44" rx="4" stroke-width="2"/>`;
    rng(13).forEach(v => { s += `<line class="s-line" x1="${x(v)}" y1="62" x2="${x(v)}" y2="82" stroke-width="2"/><text class="s-txt" x="${x(v)}" y="99" text-anchor="middle" font-size="13">${v}</text>`; });
    s += `<rect class="s-pencil" x="${x(a)}" y="20" width="${x(b) - x(a)}" height="26" stroke-width="2"/><polygon class="s-pencil" points="${x(b)},20 ${x(b) + 24},33 ${x(b)},46" stroke-width="2"/>`;
    return fig(svg('0 0 620 116', s, 'pencil on a ruler'), 'wide', `the pencil starts at ${a} and ends at ${b}`);
  };

  /* base-ten blocks: blocks:345 */
  V.blocks = arg => {
    const n = +arg, h = Math.floor(n / 100), t = Math.floor(n / 10) % 10, o = n % 10;
    return fig(`<div class="blocks">${rng(h).map(() => '<i class="bh"></i>').join('')}${rng(t).map(() => '<i class="bt"></i>').join('')}<span class="ones">${rng(o).map(() => '<i class="bo"></i>').join('')}</span></div>`, '', `${n} = ${h ? h + ' hundred' + (h > 1 ? 's' : '') + ' ' : ''}${t} ten${t === 1 ? '' : 's'} ${o} one${o === 1 ? '' : 's'}`);
  };

  /* handshakes: handshake:5 */
  V.handshake = arg => {
    const n = +arg, pos = i => [100 + 72 * Math.cos((-90 + i * 360 / n) * Math.PI / 180), 100 + 72 * Math.sin((-90 + i * 360 / n) * Math.PI / 180)];
    let s = '';
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { const [x1, y1] = pos(i), [x2, y2] = pos(j); s += `<line class="s-line" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="2"/>`; }
    for (let i = 0; i < n; i++) { const [x, y] = pos(i); s += `<circle class="s-coin" cx="${x}" cy="${y}" r="14" stroke-width="2"/><text class="s-txt" x="${x}" y="${y + 5}" text-anchor="middle" font-size="14" font-weight="800">${String.fromCharCode(65 + i)}</text>`; }
    return fig(svg('0 0 200 200', s, 'handshake lines'), 'small', `${n} friends, ${n * (n - 1) / 2} lines (handshakes)`);
  };

  /* picture graph: graph:apples 5,bananas 3 */
  V.graph = arg => {
    const rows = arg.split(',').map(x => { const p = x.trim().split(' '); return [p[0], +p[1]]; }), max = Math.max(...rows.map(r => r[1]));
    return fig(`<div class="graph">${rows.map(([n, v]) => `<div><b>${esc(n)}</b><span style="width:${v / max * 100}%"><i>${v}</i></span></div>`).join('')}</div>`);
  };

  /* magic square: magic:2,7,6,9,5,1,4,3,8 */
  V.magic = arg => fig(`<div class="magic">${arg.split(',').map(v => `<span>${v}</span>`).join('')}</div>`, '', 'every row, column and diagonal adds to 15');

  /* odd/even pairs: evenodd:13 */
  V.evenodd = arg => {
    const n = +arg;
    return fig(`<div class="pairs">${rng(Math.floor(n / 2)).map(() => '<span class="pair"><i></i><i></i></span>').join('')}${n % 2 ? '<span class="pair"><i class="lone"></i></span>' : ''}</div>`, '', n % 2 ? `${n} is odd: one is left over` : `${n} is even: everyone has a partner`);
  };

  /* Gauss pairing: gauss:10 */
  V.gauss = arg => {
    const n = +arg, x = i => 30 + (i - 1) * (540 / (n - 1)); let s = '';
    for (let i = 1; i <= n / 2; i++) {
      const j = n + 1 - i, hgt = 16 * (n / 2 - i + 1), mid = (x(i) + x(j)) / 2;
      s += `<path class="s-line" fill="none" stroke-width="2" d="M${x(i)} 112 Q${mid} ${112 - 2 * hgt} ${x(j)} 112"/>`;
    }
    for (let i = 1; i <= n; i++) s += `<text class="s-txt" x="${x(i)}" y="132" text-anchor="middle" font-size="15" font-weight="700">${i}</text>`;
    return fig(svg('0 0 600 140', s + `<text class="s-acc-t" x="300" y="16" text-anchor="middle" font-size="18" font-weight="800">each pair = ${n + 1}</text>`, 'pairs that add to ' + (n + 1)), 'wide', `every pair adds to ${n + 1}, and there are ${n / 2} pairs`);
  };

  /* step-by-step flow: flow:16,8,5|half spent,-$3 */
  V.flow = arg => {
    const [v, o] = arg.split('|'), vals = v.split(','), ops = (o || '').split(',');
    return fig(`<div class="flow">${vals.map((x, i) => `<b>${esc(x)}</b>${i < vals.length - 1 ? `<span>${esc(ops[i] || '')}<em>➜</em></span>` : ''}`).join('')}</div>`);
  };

  /* outfit grid: combo:👕,👚|🩳,👖,🩱 */
  V.combo = arg => {
    const [t, b] = arg.split('|').map(x => x.split(','));
    return fig(`<div class="combo" style="grid-template-columns:repeat(${b.length},1fr)">${t.map(a => b.map(c => `<span>${a}${c}</span>`).join('')).join('')}</div>`, '', `${t.length} x ${b.length} = ${t.length * b.length} outfits`);
  };
})();
