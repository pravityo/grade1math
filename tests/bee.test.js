/* Run: node tests/bee.test.js  (spelling bee word bank, review boxes, sessions, points, ranks, trophies) */
globalThis.window = globalThis; const fs = require('fs'), path = require('path');
for (const f of ['data/beewords', 'bee']) eval(fs.readFileSync(path.join(__dirname, '..', 'js', f + '.js'), 'utf8'));
let bad = 0; const eq = (name, got, want) => { if (JSON.stringify(got) !== JSON.stringify(want)) { bad++; console.log('FAIL', name, '\n  got ', JSON.stringify(got), '\n  want', JSON.stringify(want)); } };
const B0 = Bee, list = B0.flatten(BEE_GROUPS, []);

/* ---- the word bank ---- */
eq('30 groups', BEE_GROUPS.length, 30); eq('360 words', list.length, 360);
eq('every word is plain lower-case letters', list.filter(x => !/^[a-z]{2,12}$/.test(x.w)).map(x => x.w), []);
eq('no duplicate words', new Set(list.map(x => x.w)).size, list.length);
eq('every word has a meaning and a sentence', list.filter(x => !x.def || !x.sent).map(x => x.w), []);
eq('every sentence uses its word', list.filter(x => !x.sent.toLowerCase().includes(x.w)).map(x => x.w), []);
eq('meanings do not spell out the word', list.filter(x => x.def.toLowerCase().split(/\W+/).includes(x.w)).map(x => x.w), []);
eq('tiers are 1 to 3', [...new Set(list.map(x => x.tier))].sort(), [1, 2, 3]); eq('tiers never go backwards', list.every((x, i) => i === 0 || x.tier >= list[i - 1].tier), true);
eq('groups have 12 words and a tip', BEE_GROUPS.every(g => g.words.length === 12 && g.tip && g.emoji && g.name), true);
eq('US spelling', ['color', 'favorite', 'neighbor'].every(w => !list.some(x => x.w === w.replace('or', 'our'))), true);

/* ---- review boxes ---- */
let B = B0.blank();
B0.record(B, 'cat', 'first', '2026-10-01'); eq('first try moves up', [B.words.cat.box, B.words.cat.due], [1, '2026-10-03']);
B0.record(B, 'cat', 'second', '2026-10-03'); eq('second try keeps the box', B.words.cat.box, 1);
B0.record(B, 'cat', 'first', '2026-10-03'); B0.record(B, 'cat', 'first', '2026-10-06'); B0.record(B, 'cat', 'first', '2026-10-13'); eq('four in a row is mastered', [B.words.cat.box, B0.isMastered(B.words.cat)], [4, true]);
B0.record(B, 'cat', 'miss', '2026-11-01'); eq('a miss drops two boxes', B.words.cat.box, 2); eq('missed word comes back in 4 days', B.words.cat.due, '2026-11-05');
B0.record(B, 'dog', 'miss', '2026-10-01'); eq('new word missed starts at 0', [B.words.dog.box, B.words.dog.due], [0, '2026-10-02']);
eq('status', [B0.status(undefined), B0.status(B.words.dog), B0.status({ box: 5 })], ['new', 'learning', 'mastered']);

/* ---- points, rank ---- */
eq('first try worth 10', B0.score('first', 0), { pts: 10, combo: 1 }); eq('combo bonus grows', B0.score('first', 3), { pts: 16, combo: 4 }); eq('combo bonus is capped', B0.score('first', 30).pts, 20);
eq('second try', B0.score('second', 5), { pts: 5, combo: 0 }); eq('a miss still earns a point', B0.score('miss', 5), { pts: 1, combo: 0 });
eq('rank at 0', B0.rank(0).name, 'Word Page'); eq('rank at 150', B0.rank(150).name, 'Word Squire'); eq('rank at 1800', [B0.rank(1800).name, B0.rank(1800).next, B0.rank(1800).pct], ['Word Wizard', null, 100]); eq('progress to next', B0.rank(75).pct, 50);

/* ---- countdown and planning ---- */
const bee = Object.assign(B0.blank(), { date: '2026-11-13', start: '2026-09-30' });
eq('days left', B0.daysLeft(bee, '2026-09-30'), 44); eq('no date, no countdown', B0.daysLeft(B0.blank(), '2026-09-30'), null);
eq('school-day sessions until 2 days before', B0.sessionsLeft(bee, '2026-09-30') > 25 && B0.sessionsLeft(bee, '2026-09-30') < 35, true); eq('never below 1', B0.sessionsLeft(bee, '2026-11-20'), 1);
eq('new words per day is capped', [B0.newPerDay(360, 30), B0.newPerDay(360, 30, 3, 9)], [8, 9]); eq('few words left', B0.newPerDay(2, 30), 2); eq('none left', B0.newPerDay(0, 30), 0); eq('mid pace', B0.newPerDay(90, 30), 3);

/* ---- a daily session ---- */
const rnd = (() => { let s = 7; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
let S1 = B0.buildSession(bee, list, '2026-09-30', { rnd });
eq('day one: 6 new words (the daily maximum)', [S1.order.length, S1.fresh.length, S1.review.length], [6, 6, 0]);
eq('new words come from the start of the list', S1.fresh.map(x => x.w).slice(0, 3), ['cat', 'hat', 'mat']);
S1.order.forEach(x => B0.record(bee, x.w, 'first', '2026-09-30'));
let S2 = B0.buildSession(bee, list, '2026-10-01', { rnd });
eq('day two has 10 words and no repeats', [S2.order.length, new Set(S2.order.map(x => x.w)).size], [10, 10]);
eq('day two words are not due yet, so they are new (or topped up)', S2.order.every(x => x.w), true);
let S3 = B0.buildSession(bee, list, '2026-10-02', { rnd });
eq('after two days the day-one words are due again', S3.review.length > 0, true); eq('session never has more than size', S3.order.length <= 10, true);
// a missed word comes first among the reviews
B0.record(bee, 'fan', 'miss', '2026-10-02'); const S4 = B0.buildSession(bee, list, '2026-10-03', { rnd });
eq('a missed word is reviewed', S4.review.some(x => x.w === 'fan'), true);
// the last week has no new words
const late = Object.assign(B0.blank(), { date: '2026-10-06', start: '2026-09-01' }); ['cat', 'hat', 'mat', 'bat', 'sad', 'fan'].forEach(w => B0.record(late, w, 'first', '2026-09-20'));
const S5 = B0.buildSession(late, list, '2026-10-01', { rnd }); eq('last week: only words already met', [S5.fresh.length, S5.order.every(x => late.words[x.w])], [0, true]);
eq('last week session is small when few words are known', S5.order.length, 6);
// an empty list of due words is topped up with the shakiest ones
const top = B0.blank(); B0.record(top, 'cat', 'first', '2026-10-01'); const S6 = B0.buildSession(Object.assign(top, { date: '2026-12-01', start: '2026-10-01' }), list, '2026-10-01', { rnd, size: 4 });
eq('small size respected', S6.order.length, 4);

/* ---- mock bee ---- */
const mock = B0.mockWords(B0.blank(), list, rnd); eq('mock bee has 12 words in 3 rounds', [mock.length, mock.slice(0, 4).every(x => x.tier === 1), mock.slice(4, 8).every(x => x.tier === 2), mock.slice(8).every(x => x.tier === 3)], [12, true, true, true]);
eq('hard words are the ones missed', B0.hardWords(bee, list).map(x => x.w).includes('fan'), true);

/* ---- custom words ---- */
const cu = B0.parseCustom('Elephant | a big animal | The elephant is big.\nbee\nbad word!\n  \nbee | dupe\nx1y\nzebra|striped|');
eq('custom words parsed', cu.added.map(a => a[0]), ['elephant', 'bee', 'zebra']); eq('bad words skipped', cu.skipped, ['bad word!', 'x1y']);
const withCustom = B0.flatten(BEE_GROUPS, cu.added); eq('custom words come first and are not duplicated', [withCustom[0].w, withCustom.filter(x => x.w === 'elephant').length, withCustom.length], ['elephant', 1, 360 + 1]);

/* ---- trophies ---- */
const T = Object.assign(B0.blank(), { drills: 1 }); let got = B0.award(T, list, '2026-10-01', 1); eq('first drill earns First Buzz', got.map(t => t.id), ['first']);
eq('trophies are only awarded once', B0.award(T, list, '2026-10-02', 1).length, 0);
for (let i = 0; i < 30; i++) { T.words[list[i].w] = { box: 5, due: '2027-01-01', ok: 5, miss: 0, first: 5 }; } T.maxCombo = 10; T.perfect = 1;
eq('milestones', B0.award(T, list, '2026-10-05', 7).map(t => t.id).sort(), ['combo10', 'flawless', 'learn25', 'master25', 'streak3', 'streak7']);
console.log(bad ? bad + ' failures' : 'spelling bee tests OK'); process.exit(bad ? 1 : 0);
