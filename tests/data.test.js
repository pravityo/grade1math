/* Run: node tests/data.test.js  (validates lesson data for all subjects) */
globalThis.window = globalThis; const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, '..', 'js', 'data');
const files = ['helpers', 'deep-helpers', 'deep-math-a', 'deep-math-b', 'deep-eng-a', 'deep-eng-b', 'deep-sci-a', 'deep-sci-b', 'links', ...[1, 2, 3, 4, 5, 6, 7, 8].flatMap(i => ['week' + i, 'english' + i, 'science' + i]), 'pics', 'gens'];
for (const f of files) eval(fs.readFileSync(path.join(dir, f + '.js'), 'utf8'));
let bad = 0; const fail = (...a) => { bad++; console.log('FAIL', ...a); };
const subjects = { maths: window.CURRICULUM, english: window.ENGLISH, science: window.SCIENCE };
for (const [name, weeks] of Object.entries(subjects)) {
  let lessons = 0;
  weeks.forEach(w => w.lessons.forEach(l => {
    lessons++;
    for (const k of ['t', 'sk', 'goal', 'key', 'learn', 'do', 'tip', 'parent', 'q']) if (!l[k]) fail(name, l.t, 'missing', k);
    if (l.q.length < 6) fail(name, l.t, 'fewer than 6 questions');
    if (!['b', 'c', 's', 'o'].every(lv => l.q.some(q => q.l === lv))) fail(name, l.t, 'needs all four levels');
    l.q.forEach(q => {
      if (!q.q || q.a == null) fail(name, l.t, 'question without text or answer');
      if (q.o && !q.o.includes(q.a)) fail(name, l.t, 'answer not in options:', q.q.slice(0, 50));
      if (q.o && new Set(q.o).size !== q.o.length) fail(name, l.t, 'duplicate options:', q.q.slice(0, 50));
      if (/\b(same class|same graph|above|previous question)\b/.test(q.q)) fail(name, l.t, 'refers to other text:', q.q.slice(0, 50));
    });
    l.learn.join(' ').replace(/\[\[(\w+):/g, (m, k) => { if (!['bar', 'cmp', 'bond', 'frame', 'line', 'groups', 'clock', 'coins', 'shapes', 'solids', 'dice', 'pie', 'hundred', 'venn', 'queue', 'fence', 'tally', 'ruler', 'blocks', 'handshake', 'graph', 'magic', 'evenodd', 'gauss', 'flow', 'combo', 'cards', 'seq', 'cycle', 'sentence', 'blend', 'table', 'states', 'plant', 'magnet', 'shadow', 'planets', 'moon', 'circuit', 'lever'].includes(k)) fail(name, l.t, 'unknown token', k); return m; });
  }));
  console.log(name, weeks.length, 'weeks', lessons, 'lessons');
}
const ids = [...Array(40).keys()].flatMap(n => [String(n), 'e' + n, 's' + n]);
ids.forEach(id => {
  const d = window.DEEP[id], l = window.LINKS[id];
  if (!d) fail('no deep content for', id); else {
    if (d.why.length < 2 || d.worked.s.length < 4 || d.watch.length < 2 || d.talk.length < 3 || d.words.length < 2) fail('deep content too thin for', id);
  }
  if (!l || !l.length) fail('no links for', id); else l.forEach(x => { if (!/^https:\/\//.test(x[1]) || !x[0] || !x[2]) fail('bad link', id, x[1]); });
});
console.log(bad ? bad + ' problems' : 'all lesson data OK'); process.exit(bad ? 1 : 0);
