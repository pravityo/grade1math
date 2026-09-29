/* Run: node tests/adapt.test.js  (adaptive learning, streaks, weekly goal, knight accessories) */
globalThis.window = globalThis; const fs = require('fs'), path = require('path');
for (const f of ['adapt', 'knightwear']) eval(fs.readFileSync(path.join(__dirname, '..', 'js', f + '.js'), 'utf8'));
let bad = 0; const eq = (name, got, want) => { if (JSON.stringify(got) !== JSON.stringify(want)) { bad++; console.log('FAIL', name, 'got', JSON.stringify(got), 'want', JSON.stringify(want)); } };
const A = Adapt, W = KnightWear;

/* ---- spaced repetition ---- */
let S = {};
A.record(S, '5', 0, true, '2025-03-03'); eq('first correct -> box 1', S.skills['5'].box, 1); eq('due in 2 days', S.skills['5'].due, '2025-03-05');
A.record(S, '5', 0, true, '2025-03-05'); A.record(S, '5', 0, true, '2025-03-09'); eq('box 3 after three', S.skills['5'].box, 3); eq('due in 7 days', S.skills['5'].due, '2025-03-16');
A.record(S, '5', 2, false, '2025-03-16'); eq('miss drops two boxes', S.skills['5'].box, 1); eq('miss remembers question', S.skills['5'].missed, { 2: 1 }); eq('weak after a miss', A.isWeak(S.skills['5']), true);
A.record(S, '5', 2, true, '2025-03-17'); eq('solving it clears the miss', S.skills['5'].missed, {});
for (let i = 0; i < 9; i++) A.record(S, '6', 0, true, '2025-04-01'); eq('box capped at 5', S.skills['6'].box, 5);
A.record(S, '9', 1, false, '2025-05-01'); eq('new skill missed starts at box 0', S.skills['9'].box, 0); eq('missed skill due tomorrow', S.skills['9'].due, '2025-05-02');

S = { skills: {} };
A.record(S, 'a', 0, true, '2025-06-01'); A.record(S, 'b', 3, false, '2025-06-01'); A.record(S, 'c', 0, true, '2025-06-01');
eq('nothing due on the same day except weak-tomorrow', A.dueSkills(S, '2025-06-01').map(d => d.id), ['b']);
eq('after 2 days: weak first, then by box', A.dueSkills(S, '2025-06-03').map(d => d.id), ['b', 'a', 'c']);
eq('current lesson excluded', A.dueSkills(S, '2025-06-03', 'b').map(d => d.id), ['a', 'c']);
eq('empty state', A.dueSkills({}, '2025-06-03'), []);

const lesson = { q: [{ l: 'b' }, { l: 'c' }, { l: 'c' }, { l: 's' }, { l: 'o' }, { l: 'b' }] };
eq('re-ask a missed question', A.pickQuestion(lesson, { box: 0, missed: { 3: 1 } }, 0), 3);
eq('low box uses easy levels', ['b', 'c'].includes(lesson.q[A.pickQuestion(lesson, { box: 1, missed: {} }, 7)].l), true);
eq('high box uses hard levels', ['s', 'o'].includes(lesson.q[A.pickQuestion(lesson, { box: 5, missed: {} }, 7)].l), true);

/* ---- easier question ---- */
eq('easier than olympiad is stretch', lesson.q[A.easierIndex(lesson, 4, [])].l, 's');
eq('easier than core is warm-up', lesson.q[A.easierIndex(lesson, 1, [])].l, 'b');
eq('warm-up has nothing easier', A.easierIndex(lesson, 0, []), -1);
eq('does not repeat a tried one', A.easierIndex(lesson, 1, [0]), 5);
eq('nothing left after all tried', A.easierIndex(lesson, 1, [0, 5]), -1);

/* ---- challenge unlock ---- */
eq('no practice questions -> open', A.practiceSolid(0, 0), true);
eq('0 of 4 locked', A.practiceSolid(4, 0), false); eq('2 of 4 locked', A.practiceSolid(4, 2), false); eq('3 of 4 open', A.practiceSolid(4, 3), true);
eq('1 of 2 locked', A.practiceSolid(2, 1), false); eq('2 of 2 open', A.practiceSolid(2, 2), true); eq('1 of 1 open', A.practiceSolid(1, 1), true);

/* ---- placement ---- */
const pr = A.probes(40); eq('probes every 5th lesson', pr, [4, 9, 14, 19, 24, 29, 34]);
eq('fail first probe -> skip none', A.placement(pr, [false]), 0);
eq('pass two then fail -> skip through lesson 10', A.placement(pr, [true, true, false]), 10);
eq('pass all -> skip 35', A.placement(pr, [true, true, true, true, true, true, true]), 35);
eq('stopped early after one pass', A.placement(pr, [true]), 5);
eq('no answers', A.placement(pr, []), 0);

/* ---- streaks (Mon 2025-03-03 .. Sun 2025-03-09) ---- */
eq('no days', A.streak([], '2025-03-05'), 0);
eq('today only', A.streak(['2025-03-05'], '2025-03-05'), 1);
eq('not yet today keeps yesterday streak', A.streak(['2025-03-03', '2025-03-04'], '2025-03-05'), 2);
eq('weekend does not break', A.streak(['2025-02-28', '2025-03-03'], '2025-03-03'), 2);
eq('one missed weekday forgiven', A.streak(['2025-03-03', '2025-03-05', '2025-03-06'], '2025-03-06'), 3);
eq('two missed weekdays break', A.streak(['2025-03-03', '2025-03-06'], '2025-03-06'), 1);
eq('grace not repeated within 5 days', A.streak(['2025-03-03', '2025-03-05', '2025-03-07'], '2025-03-07'), 2);
eq('missed leading weekday is not forgiven', A.streak(['2025-03-03'], '2025-03-05'), 0);
eq('extra weekend study counts', A.streak(['2025-03-01', '2025-03-03'], '2025-03-03'), 2);

/* ---- weekly goal ---- */
const wk = A.week(['2025-03-03', '2025-03-05', '2025-03-08', '2025-03-10'], '2025-03-06');
eq('week starts Monday', wk.days[0].iso, '2025-03-03'); eq('5 weekdays', wk.days.length, 5);
eq('marks studied days', wk.days.map(d => d.on), [true, false, true, false, false]); eq('count includes weekend, not next week', wk.count, 3); eq('today flagged', wk.days.findIndex(d => d.today), 3);
eq('Sunday belongs to the week before', A.week([], '2025-03-09').days[0].iso, '2025-03-03');

/* ---- knight accessories: one per 3 study days ---- */
eq('12 accessories', W.ACC.length, 12); eq('unique ids', new Set(W.ACC.map(a => a.id)).size, 12);
eq('every slot valid', W.ACC.every(a => W.SLOTS.includes(a.slot) && /^</.test(a.svg)), true);
[[0, 0], [2, 0], [3, 1], [5, 1], [6, 2], [35, 11], [36, 12], [99, 12]].forEach(([d, n]) => eq(`${d} days -> ${n} earned`, W.earned(d), n));
eq('2 more days to next', W.untilNext(4), 2); eq('3 days to next after a gift', W.untilNext(3), 3); eq('all collected', W.untilNext(36), 0);
let knight = {}; let fresh = W.sync(knight, 2); eq('nothing new at 2 days', fresh.length, 0);
fresh = W.sync(knight, 3); eq('first gift at 3 days', fresh.map(a => a.id), ['plume']); eq('worn at once', knight.worn.head, 'plume');
eq('celebrated only once', W.sync(knight, 4).length, 0);
fresh = W.sync(knight, 9); eq('two gifts at once when days jump', fresh.map(a => a.id), ['glasses', 'scarf']);
W.sync(knight, 15); eq('new crown replaces the plume', knight.worn.head, 'crown');
eq('can put the plume back on', W.toggle(knight, 'plume', 15), true); eq('now worn', knight.worn.head, 'plume');
eq('take it off', W.toggle(knight, 'plume', 15) && knight.worn.head, undefined);
eq('cannot wear a locked item', W.toggle(knight, 'medal', 15), false);
const hero2 = { worn: { head: 'wizard' }, seen: 12 }; W.sync(hero2, 6); eq('unearned item dropped after progress reset', hero2.worn.head, undefined);
const body = '<circle r="1"/>';
eq('svg has the knight body', W.svg({}, body).includes(body), true);
const capeSvg = W.svg({ back: 'cape', head: 'plume' }, body); eq('cape is drawn behind the body', capeSvg.indexOf(W.byId('cape').svg) < capeSvg.indexOf(body), true); eq('hat is drawn in front', capeSvg.indexOf(W.byId('plume').svg) > capeSvg.indexOf(body), true);
eq('svg is well formed', (W.svg({ head: 'crown', face: 'shades', neck: 'medal', back: 'wings' }, body).match(/<svg/g) || []).length, 1);
console.log(bad ? bad + ' failures' : 'adaptive, streak, goal and knight tests OK'); process.exit(bad ? 1 : 0);
