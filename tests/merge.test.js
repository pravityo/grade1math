/* Run: node tests/merge.test.js  (merging progress from two devices) */
globalThis.window = globalThis; const fs = require('fs'), path = require('path');
eval(fs.readFileSync(path.join(__dirname, '..', 'js', 'merge.js'), 'utf8'));
let bad = 0; const eq = (name, got, want) => { if (JSON.stringify(got) !== JSON.stringify(want)) { bad++; console.log('FAIL', name, '\n  got ', JSON.stringify(got), '\n  want', JSON.stringify(want)); } };
const M = Merge;
const A = { done: { 0: { correct: 5, total: 6, when: '2025-03-01', at: 100 } }, right: { 0: { 0: true, 1: true } }, days: ['2025-03-01', '2025-03-03'], skills: { 0: { box: 2, last: '2025-03-03', ok: 3, miss: 0 } }, name: 'Mia', plan: 'rotate', goal: 3, setAt: 10, hero: { worn: { head: 'plume' }, seen: 1 }, pos: { id: '1', step: 2 }, placed: {} };
const B = { done: { 0: { correct: 6, total: 6, when: '2025-03-02', at: 200 }, 1: { correct: 4, total: 6, when: '2025-03-02', at: 210 } }, right: { 0: { 2: true }, 1: { 0: true } }, days: ['2025-03-02'], skills: { 0: { box: 1, last: '2025-03-05', ok: 4, miss: 1 } }, name: 'Mia K', plan: 'all', goal: 4, setAt: 20, hero: { worn: { head: 'crown' }, seen: 2 }, pos: { id: '9', step: 0 }, placed: { math: '2025-03-02' } };
const m = M.merge(A, B);
eq('lessons from both', Object.keys(m.done).sort(), ['0', '1']);
eq('newer completion wins', m.done[0].at, 200);
eq('stars are combined', Object.keys(m.right[0]).sort(), ['0', '1', '2']); eq('stars from other lesson kept', m.right[1], { 0: true });
eq('days are combined and sorted', m.days, ['2025-03-01', '2025-03-02', '2025-03-03']);
eq('recent practice wins', m.skills[0].box, 1);
eq('newer settings win', [m.name, m.plan, m.goal], ['Mia K', 'all', 4]);
eq('further along knight wins', [m.hero.worn.head, m.hero.seen], ['crown', 2]);
eq('position stays on this device', m.pos, { id: '1', step: 2 }); eq('placement kept', m.placed, { math: '2025-03-02' });
eq('merge is symmetric for lessons', Object.keys(M.merge(B, A).done).sort(), ['0', '1']);
eq('merge twice changes nothing', M.same(M.merge(m, B), M.merge(M.merge(m, B), B)), true);
eq('no remote copy', M.merge(A, null).done[0].at, 100);
// real score beats "already known", any order
const known = { done: { 5: { skipped: true, when: '2025-03-01', at: 500 } } }, real = { done: { 5: { correct: 4, total: 6, when: '2025-03-01', at: 100 } } };
eq('real score beats known (local known)', M.merge(known, real).done[5].skipped, undefined); eq('real score beats known (remote known)', M.merge(real, known).done[5].skipped, undefined);
// unlearn on one device is not undone by the other
const before = { done: { 3: { correct: 6, total: 6, at: 100 } } }, unlearned = { done: {}, removed: { 3: 300 } };
eq('unlearn wins over older completion', Object.keys(M.merge(before, unlearned).done), []); eq('unlearn wins the other way round', Object.keys(M.merge(unlearned, before).done), []);
eq('tombstone survives', M.merge(before, unlearned).removed[3], 300);
const redone = { done: { 3: { correct: 6, total: 6, at: 400 } }, removed: { 3: 300 } };
eq('finishing again after an unlearn counts', Object.keys(M.merge(redone, unlearned).done), ['3']);
const old = { done: { 3: { correct: 6, total: 6 } } };   // saved before timestamps existed
eq('old records without a time lose to a tombstone', Object.keys(M.merge(old, unlearned).done), []); eq('old records survive with no tombstone', Object.keys(M.merge(old, {}).done), ['3']);
// settings tie and empty cases
eq('empty remote name falls back', M.merge({ name: '', setAt: 5 }, { name: 'Zed', setAt: 1 }).name, 'Zed');
eq('does not mutate inputs', JSON.stringify(A).length > 0 && A.name, 'Mia');
// spelling bee state
const b1 = { date: '2026-11-13', start: '2026-10-01', words: { cat: { box: 2, last: '2026-10-03', ok: 3, miss: 0 }, dog: { box: 1, last: '2026-10-02', ok: 1, miss: 1 } }, xp: 120, drills: 3, days: ['2026-10-01', '2026-10-03'], friends: [3], trophies: { first: '2026-10-01' }, custom: [['zip', 'a fastener', 'Zip it.']], setAt: 5, mockBest: 4, maxCombo: 6, perfect: 0 };
const b2 = { date: '2026-11-20', start: '2026-09-30', words: { cat: { box: 3, last: '2026-10-05', ok: 4, miss: 0 }, hat: { box: 1, last: '2026-10-04', ok: 1, miss: 0 } }, xp: 90, drills: 5, days: ['2026-10-02'], friends: [3, 8], trophies: { first: '2026-09-30', flawless: '2026-10-04' }, custom: [['zip'], ['yak', 'x', 'y']], setAt: 9, mockBest: 9, maxCombo: 3, perfect: 1 };
const mb = M.merge({ bee: b1 }, { bee: b2 }).bee;
eq('bee: words from both, newer practice wins', [Object.keys(mb.words).sort(), mb.words.cat.box], [['cat', 'dog', 'hat'], 3]);
eq('bee: best numbers kept', [mb.xp, mb.drills, mb.mockBest, mb.maxCombo, mb.perfect], [120, 5, 9, 6, 1]);
eq('bee: days, friends and trophies combined', [mb.days, mb.friends, mb.trophies], [['2026-10-01', '2026-10-02', '2026-10-03'], [3, 8], { first: '2026-09-30', flawless: '2026-10-04' }]);
eq('bee: own words combined once (legacy custom migrated)', mb.lists[0].words.map(c => c[0]), ['zip', 'yak']); eq('bee: newer list choice wins', [mb.active, mb.tiers], [['grade1'], [1, 2, 3]]); eq('bee: newer settings win, earliest start', [mb.date, mb.start], ['2026-11-20', '2026-09-30']);
eq('bee: only one side has it', M.merge({}, { bee: b2 }).bee.xp, 90); eq('bee: merging twice changes nothing', M.same(M.merge({ bee: mb }, { bee: b1 }).bee, M.merge(M.merge({ bee: mb }, { bee: b1 }), { bee: b2 }).bee), true);
console.log(bad ? bad + ' failures' : 'merge tests OK'); process.exit(bad ? 1 : 0);
