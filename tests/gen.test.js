/* Run: node tests/gen.test.js  (checks every randomised generator many times) */
global.window = {}; const fs = require('fs'), path = require('path');
for (const f of ['js/gen.js', 'js/data/gens.js']) eval(fs.readFileSync(path.join(__dirname, '..', f), 'utf8'));
const G = window.GEN, used = [...new Set(Object.values(window.GENS))];
let bad = 0; const fail = (n, m, o) => { if (bad++ < 40) console.log('FAIL', n, m, JSON.stringify(o).slice(0, 300)); };
const missing = used.filter(n => !G[n]); if (missing.length) { console.log('unknown generators', missing); process.exit(1); }
const N = 1500;
const evalExpr = e => Function('"use strict";return (' + e.replace(/x/g, '*').replace(/\//g, '/') + ')')();
const clockMin = t => { const [h, m] = t.split(':').map(Number); return ((h % 12) * 60 + m); };
for (const n of used) {
  const seen = new Set();
  for (let i = 0; i < N; i++) {
    const o = G[n]();
    seen.add(o.q);
    const a0 = [].concat(o.a)[0];
    if (o.a == null || o.q == null || /undefined|NaN|Infinity|null/.test(JSON.stringify(o))) { fail(n, 'bad fields', o); continue; }
    if (/^-?\d+$/.test(String(a0)) && (+a0 < 0 || +a0 > 5000)) fail(n, 'answer out of range', o);
    if (o.o && !o.o.map(String).includes(String(o.a))) fail(n, 'answer not in options', o);
    if (o.o && new Set(o.o).size !== o.o.length) fail(n, 'duplicate options', o);
    // independent arithmetic check
    let m = /^Work out: ([\d\s+\-x/]+) = \?$/.exec(o.q);
    if (m && evalExpr(m[1]) !== +o.a) fail(n, 'arith mismatch', o);
    m = /^Find the missing number: (.*\?.*)$/.exec(o.q);
    if (m) { const sols = []; for (let x = 0; x <= 600; x++) { const [l, r] = m[1].replace(/\?/g, x).split('='); if (evalExpr(l) === evalExpr(r)) sols.push(x); } if (sols.length !== 1 || sols[0] !== +o.a) fail(n, 'missing-number mismatch ' + sols, o); }
    m = /^Double (\d+) = \?/.exec(o.q); if (m && 2 * m[1] !== +o.a) fail(n, 'double', o);
    m = /^Half of (\d+) = \?/.exec(o.q); if (m && m[1] / 2 !== +o.a) fail(n, 'half', o);
    // semantic checks
    if (n === 'handshakes' || n === 'hs') { const k = +/(\d+) friends/.exec(o.q)[1]; let c = 0; for (let x = 0; x < k; x++) for (let y = x + 1; y < k; y++) c++; if (c !== +o.a) fail(n, 'handshake', o); }
    if (n === 'countRange' || n === 'count2d' || n === 'countPages') { const [, a, b] = /(\d+)[^\d]+(\d+)/.exec(o.q.replace(/^.*?(from|reads from page) /, '')) || []; if (b - a + 1 !== +o.a) fail(n, 'range', o); }
    if (n === 'digitMake') { const ds = /digits ([\d, ]+) once/.exec(o.q)[1].split(', ').map(Number); const big = /biggest/.test(o.q); const perms = []; const rec = (p, r) => { if (!r.length) perms.push(p); r.forEach((d, i) => rec(p.concat(d), r.filter((_, j) => j !== i))); }; rec([], ds); const vals = perms.filter(p => p[0] !== 0).map(p => +p.join('')); if ((big ? Math.max(...vals) : Math.min(...vals)) !== +o.a) fail(n, 'digitMake', o); }
    if (n === 'bigSmall') { const ds = /digits ([\d, ]+) once/.exec(o.q)[1].split(', ').map(Number).sort((a, b) => a - b); if (+[...ds].reverse().join('') - +ds.join('') !== +o.a) fail(n, 'bigSmall', o); }
    if (n === 'smallest4') { const list = /smallest: ([\d, ]+)\?/.exec(o.q)[1].split(', ').map(Number); if (Math.min(...list) !== +o.a) fail(n, 'smallest', o); }
    if (n === 'fewestCoins') { const amt = +/make (\d+) cents/.exec(o.q)[1], best = Array(amt + 1).fill(1e9); best[0] = 0; for (let v = 1; v <= amt; v++) [5, 10, 20, 50, 100].forEach(c => { if (v >= c) best[v] = Math.min(best[v], best[v - c] + 1); }); if (best[amt] !== +o.a) fail(n, 'coins', o); }
    if (n === 'dayAfter') { const D = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']; const mm = /Today is (\w+)\. What day will it be in (\d+) days/.exec(o.q); if (D[(D.indexOf(mm[1].toLowerCase()) + +mm[2]) % 7] !== o.a) fail(n, 'day', o); }
    if (n === 'timeAfter') { const mm = /(\d+) hours? and 30 minutes after (\d+:\d+)/.exec(o.q); if ((clockMin(mm[2]) + mm[1] * 60 + 30) % 720 !== clockMin(o.a)) fail(n, 'timeAfter', o); }
    if (n === 'timeEnd') { const mm = /starts at (\d+:\d+) and lasts (\d+) hours and 30/.exec(o.q); if ((clockMin(mm[1]) + mm[2] * 60 + 30) % 720 !== clockMin(o.a)) fail(n, 'timeEnd', o); }
    if (n === 'digitsNoRep') { const ds = /digits ([\d, ]+),/.exec(o.q)[1].split(', ').map(Number); let c = 0; ds.forEach(x => ds.forEach(y => { if (x !== y) c++; })); if (c !== +o.a) fail(n, 'digitsNoRep', o); }
    if (n === 'digitsRep') { const ds = /digits ([\d, ]+) \(/.exec(o.q)[1].split(', '); if (ds.length ** 2 !== +o.a) fail(n, 'digitsRep', o); }
    if (n === 'headsLegs') { const [, H, L] = /has (\d+) animals.*?There are (\d+) legs/.exec(o.q); const r = +o.a; if (4 * r + 2 * (H - r) !== +L) fail(n, 'headsLegs', o); }
    if (n === 'bikeTrike') { const [, V, W] = /There are (\d+) vehicles.*?There are (\d+) wheels/.exec(o.q); const t = +o.a; if (3 * t + 2 * (V - t) !== +W) fail(n, 'bikeTrike', o); }
    if (n === 'sumDiff') { const [, S, d] = /have (\d+) \w+ altogether\. \w+ has (\d+) more/.exec(o.q); const first = /How many \w+ does (\w+) have/.exec(o.q)[1], x = /^(\w+) and/.exec(o.q)[1]; const big = (+S + +d) / 2, small = (+S - d) / 2; if ((first === x ? big : small) !== +o.a) fail(n, 'sumDiff', o); }
    if (n === 'moreStickers') { const [, d, S] = /has (\d+) more stickers.*?have (\d+) stickers/.exec(o.q); if (2 * o.a + +d !== +S) fail(n, 'moreStickers', o); }
    if (n === 'fruitMore') { const [, S, d] = /(\d+) fruits in all. There are (\d+) more/.exec(o.q); if (2 * o.a + +d !== +S) fail(n, 'fruitMore', o); }
    if (n === 'skipSeq') { const step = +/Count by (\d+)s/.exec(o.q)[1], seq = /number: (.*)$/.exec(o.q)[1].split(', '), i = seq.indexOf('?'); const ref = i > 0 ? +seq[i - 1] + step : +seq[i + 1] - step; if (ref !== +o.a) fail(n, 'skipSeq', o); }
    if (n === 'trees') { const [, k, L] = /planted (\d+) m apart along a (\d+) m/.exec(o.q); if (L / k + 1 !== +o.a) fail(n, 'trees', o); }
    if (n === 'repeat') { const b = /The block is (\w+)/.exec(o.h)[1], k = +/letter number (\d+)/.exec(o.q)[1]; if (b[(k - 1) % b.length] !== o.a) fail(n, 'repeat', o); }
    if (n === 'vennBoth') { const mm = /group of (\d+) children, (\d+) have .* and (\d+) have/.exec(o.q); if (+mm[2] + +mm[3] - +mm[1] !== +o.a || o.a < 1) fail(n, 'vennBoth', o); }
    if (n === 'kim') { const [, s, r] = /\$(\d+) on a snack.*?\$(\d+) left/.exec(o.q); if (o.a / 2 - +s !== +r) fail(n, 'kim', o); }
    if (n === 'threeStep') { const [, a, r] = /add (\d+), then double. I get (\d+)/.exec(o.q); if ((o.a / 2 + +a) * 2 !== +r) fail(n, 'threeStep', o); }
    if (n === 'undo1') { const [, a, b, r] = /add (\d+), then subtract (\d+)\. I get (\d+)/.exec(o.q); if (+o.a + +a - +b !== +r) fail(n, 'undo1', o); }
    if (n === 'undo2') { const [, a, b, r] = /subtract (\d+) from a number, then add (\d+)\. I get (\d+)/.exec(o.q); if (+o.a - a + +b !== +r) fail(n, 'undo2', o); }
    if (n === 'ageSum') { const [, S, d] = /add up to (\d+)\. Mum is (\d+) years/.exec(o.q); if (2 * o.a + +d !== +S) fail(n, 'ageSum', o); }
    if (n === 'marbles') { const g = +/other (\d+) are green/.exec(o.q)[1]; if (o.a !== 4 * g) fail(n, 'marbles', o); }
    if (n === 'buns') { const t = +/bakes (\d+) buns/.exec(o.q)[1]; if (t - t / 3 - t / 4 !== +o.a) fail(n, 'buns', o); }
    if (n === 'animals') { const [, d, mult, fw] = /There are (\d+) dogs.*?(twice|three times).*?There are (\d+) fewer/.exec(o.q); const c = d * (mult === 'twice' ? 2 : 3); if (+d + c + c - fw !== +o.a) fail(n, 'animals', o); }
    if (n === 'fence' && /closed loop/.test(o.q)) { const [, P, k] = /is (\d+) m around. Posts are (\d+) m apart/.exec(o.q); if (P / k !== +o.a) fail(n, 'loop fence', o); }
    if (n === 'ropeCuts' || n === 'ribbonCuts') { const [, L, k] = /(?:A|ribbon) (\d+)(?: m rope| cm long)?.*?(?:of|into) (\d+)/.exec(o.q) || []; }
    if (!Number.isInteger(+a0) && !isNaN(+a0)) fail(n, 'non-integer', o);
  }
  if (seen.size < 8 && !['dbl', 'sides', 'cubeFact', 'diceOpp', 'socks', 'pigeon', 'parity'].includes(n)) console.log('LOW VARIETY', n, seen.size);
}
console.log(bad ? `${bad} failures` : `all ${used.length} generators passed ${N} runs each`);
process.exit(bad ? 1 : 0);
