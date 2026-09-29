/* Run: node tests/theme.test.js  (monsters, bosses and knight ranks) */
globalThis.window = globalThis; const fs = require('fs'), path = require('path');
eval(fs.readFileSync(path.join(__dirname, '..', 'js', 'monsters.js'), 'utf8'));
let bad = 0; const eq = (name, got, want) => { if (JSON.stringify(got) !== JSON.stringify(want)) { bad++; console.log('FAIL', name, 'got', JSON.stringify(got), 'want', JSON.stringify(want)); } };
const M = Monsters;
eq('ten monsters', M.LIST.length, 10); eq('unique names', new Set(M.LIST.map(m => m.name)).size, 10); eq('unique looks', new Set(M.LIST.map(m => [m.c, m.shape, m.eyes, m.top, m.mouth].join())).size, 10);
for (let i = 0; i < 10; i++) { const s = M.svg(i); eq('svg ' + i + ' is one svg', (s.match(/<svg/g) || []).length, 1); eq('svg ' + i + ' closes', /<\/svg>$/.test(s), true); eq('boss has crown', M.svg(i, { boss: true }).includes('#ffd84d'), true); eq('tamed has hearts', M.svg(i, { tamed: true }).includes('#ff7a90'), true); }
eq('sprite has every symbol', (M.sprite().match(/<symbol/g) || []).length, 20);
eq('use references the sprite', M.use(3, true).includes('#monb-3'), true); eq('use wraps around', M.use(13).includes('#mon-3'), true);
// lessons cycle through all ten monsters and day 5 is a boss
const seen = { math: new Set(), eng: new Set(), sci: new Set() };
for (const subj of ['math', 'eng', 'sci']) for (let n = 0; n < 40; n++) { const L = { subj, n, day: (n % 5) + 1 }, f = M.forLesson(L); seen[subj].add(f.i); eq(`${subj}${n} boss only on day 5`, f.boss, L.day === 5); eq('boss name prefix', f.name.startsWith('Boss '), f.boss); }
eq('math uses all ten', seen.math.size, 10); eq('english uses all ten', seen.eng.size, 10); eq('science uses all ten', seen.sci.size, 10);
eq('neighbouring lessons differ', M.forLesson({ subj: 'math', n: 0, day: 1 }).i !== M.forLesson({ subj: 'math', n: 1, day: 2 }).i, true);
eq('same lesson number differs by subject', new Set(['math', 'eng', 'sci'].map(s => M.forLesson({ subj: s, n: 4, day: 5 }).i)).size, 3);
// ranks
eq('starts as a page', M.rank(0).name, 'Page'); eq('9 is still a page', M.rank(9).name, 'Page'); eq('10 squire', M.rank(10).name, 'Squire'); eq('30 knight', M.rank(30).name, 'Knight'); eq('60 champion', M.rank(60).name, 'Champion'); eq('100 dragon knight', M.rank(100).name, 'Dragon Knight'); eq('120 top rank has no next', M.rank(120).next, null);
eq('progress to next', M.rank(20).pct, 50); eq('quests left', M.rank(25).next.left, 5); eq('top rank pct', M.rank(110).pct, 100);
console.log(bad ? bad + ' failures' : 'monster, boss and rank tests OK'); process.exit(bad ? 1 : 0);
