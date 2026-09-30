/* Spelling bee training: word list, review boxes, daily session, points, ranks and trophies. Pure functions on the saved state
   (S.bee), so tests/bee.test.js can check them in Node. The screens are in js/beeview.js. */
(function (root) {
  'use strict';
  const GAPS = [1, 2, 4, 7, 14, 30];                 // days until a word comes back, by box (0 = shaky ... 5 = solid)
  const RANKS = [[0, 'Word Page', '🪶'], [150, 'Word Squire', '📜'], [400, 'Word Knight', '⚔️'], [900, 'Word Champion', '🏅'], [1800, 'Word Wizard', '🧙']];
  const iso = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const parse = s => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || ''); return m ? new Date(+m[1], m[2] - 1, +m[3]) : null; };
  const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return iso(d); };
  const daysBetween = (a, b) => Math.round((parse(b) - parse(a)) / 864e5);

  /* Fresh, normalised bee state. */
  const blank = () => ({ date: null, start: null, words: {}, xp: 0, drills: 0, perfect: 0, days: [], friends: [], trophies: {}, mockBest: 0, maxCombo: 0, custom: [], mode: 'tiles', size: 10, newMax: 6, sound: true, setAt: 0 });
  function norm(B) { const b = Object.assign(blank(), B || {}); ['words', 'trophies'].forEach(k => { b[k] = b[k] || {}; }); ['days', 'friends', 'custom'].forEach(k => { b[k] = Array.isArray(b[k]) ? b[k] : []; }); return b; }

  /* One flat list: the parent's own words first, then the built-in groups in order. */
  function flatten(groups, custom) {
    const out = [], seen = new Set();
    (custom || []).forEach(c => { if (!seen.has(c[0])) { seen.add(c[0]); out.push({ w: c[0], def: c[1] || '', sent: c[2] || '', tier: 2, gid: 'custom', gname: 'Your own words', tip: 'Words from your grown-up.', emoji: '📝', custom: true }); } });
    groups.forEach((g, gi) => g.words.forEach(x => { if (!seen.has(x[0])) { seen.add(x[0]); out.push({ w: x[0], def: x[1], sent: x[2], tier: g.tier, gid: g.id, gname: g.name, tip: g.tip, emoji: g.emoji, gi }); } }));
    return out;
  }
  /* "word | meaning | sentence" per line. Only letters allowed in the word. */
  function parseCustom(text) {
    const added = [], skipped = [];
    String(text || '').split(/\r?\n/).forEach(line => {
      const parts = line.split('|').map(s => s.trim()); const w = (parts[0] || '').toLowerCase();
      if (!w) return;
      if (!/^[a-z]{2,20}$/.test(w)) { skipped.push(parts[0]); return; }
      if (!added.some(a => a[0] === w)) added.push([w, (parts[1] || '').slice(0, 120), (parts[2] || '').slice(0, 160)]);
    });
    return { added, skipped };
  }

  /* outcome: 'first' (right first try), 'second' (right on a second try) or 'miss'. */
  function record(B, word, outcome, today) {
    const e = B.words[word] = B.words[word] || { box: 0, due: today, ok: 0, miss: 0, first: 0, seen: today, last: today };
    if (outcome === 'first') { e.box = Math.min(5, e.box + 1); e.ok++; e.first++; }
    else if (outcome === 'second') { e.box = Math.max(1, e.box); e.ok++; }
    else { e.box = Math.max(0, e.box - 2); e.miss++; }
    e.last = today; e.due = addDays(today, GAPS[e.box]);
    return e;
  }
  const isMastered = e => !!e && e.box >= 4;
  const status = e => !e ? 'new' : isMastered(e) ? 'mastered' : 'learning';
  const counts = (B, list) => { let seen = 0, mastered = 0; list.forEach(x => { const e = B.words[x.w]; if (e) { seen++; if (isMastered(e)) mastered++; } }); return { seen, mastered, total: list.length }; };

  /* Points: 10 for a first try, 5 for a second, 1 for trying. A run of first tries adds a bonus of 2 per word (up to 10). */
  function score(outcome, combo) {
    if (outcome === 'first') { const c = combo + 1; return { pts: 10 + Math.min(10, (c - 1) * 2), combo: c }; }
    return { pts: outcome === 'second' ? 5 : 1, combo: 0 };
  }
  function rank(xp) {
    let k = 0; RANKS.forEach((r, j) => { if (xp >= r[0]) k = j; });
    const next = RANKS[k + 1];
    return { name: RANKS[k][1], icon: RANKS[k][2], next: next ? { name: next[1], at: next[0], left: next[0] - xp } : null, pct: next ? Math.round((xp - RANKS[k][0]) / (next[0] - RANKS[k][0]) * 100) : 100 };
  }

  /* Countdown and pace. */
  const daysLeft = (B, today) => B.date ? daysBetween(today, B.date) : null;
  function sessionsLeft(B, today) {   // school-day sessions left, keeping the last 2 days for calm review
    if (!B.date) return 30; let n = 0; const end = addDays(B.date, -2);
    for (let d = today; d <= end; d = addDays(d, 1)) { const wd = parse(d).getDay(); if (wd !== 0 && wd !== 6) n++; if (n > 400) break; }
    return Math.max(1, n);
  }
  const newPerDay = (unseen, left, lo, hi) => Math.max(unseen ? 1 : 0, Math.min(unseen, Math.min(hi || 8, Math.max(lo || 3, Math.ceil(unseen / Math.max(1, left))))));
  function pace(B, list, today) {
    if (!B.date || !B.start) return null;
    const total = daysBetween(B.start, B.date), done = daysBetween(B.start, today); if (total <= 0) return null;
    const c = counts(B, list), time = Math.min(1, Math.max(0, done / total)), learned = c.seen / c.total;
    // words are introduced until 7 days before the bee, so compare with that target
    const target = Math.min(1, time * total / Math.max(1, total - 7));
    return { status: learned >= target - 0.05 ? (learned > target + 0.15 ? 'ahead' : 'on track') : 'behind', learned, target };
  }

  function shuffle(a, rnd) { a = a.slice(); rnd = rnd || Math.random; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  /* Today's drill: some new words plus words that are due for another look. */
  function buildSession(B, list, today, opts) {
    opts = opts || {}; const size = opts.size || B.size || 10, rnd = opts.rnd, hi = opts.newMax || B.newMax || 6;
    const unseen = list.filter(x => !B.words[x.w]), seen = list.filter(x => B.words[x.w]);
    const left = daysLeft(B, today), lastWeek = left != null && left <= 7;
    const due = seen.filter(x => B.words[x.w].due <= today).sort((a, b) => (B.words[a.w].box - B.words[b.w].box) || B.words[a.w].due.localeCompare(B.words[b.w].due));
    let newN = lastWeek ? 0 : Math.min(unseen.length, size, opts.newCount != null ? opts.newCount : newPerDay(unseen.length, sessionsLeft(B, today), 3, hi));
    let revN = Math.min(due.length, size - newN);
    if (!lastWeek && newN + revN < size && unseen.length > newN) newN = Math.min(unseen.length, hi, newN + (size - newN - revN));   // not much to review yet: meet a few more new words
    revN = Math.min(due.length, size - newN);
    const fresh = unseen.slice(0, newN), review = due.slice(0, revN);
    let extra = [];
    if (fresh.length + review.length < size) {     // top up with the shakiest words that are not due yet
      const used = new Set(fresh.concat(review).map(x => x.w));
      extra = seen.filter(x => !used.has(x.w)).sort((a, b) => B.words[a.w].box - B.words[b.w].box).slice(0, size - fresh.length - review.length);
    }
    return { fresh, review, extra, order: shuffle(fresh.concat(review, extra), rnd) };
  }
  /* A mock bee: rounds get harder (tier 1, then 2, then 3). Prefers words already met, so it feels fair. */
  function mockWords(B, list, rnd, per) {
    per = per || 4; const out = [];
    [1, 2, 3].forEach(t => {
      const pool = list.filter(x => x.tier === t || (t === 2 && x.custom)), met = pool.filter(x => B.words[x.w]), rest = pool.filter(x => !B.words[x.w]);
      out.push(...shuffle(met, rnd).concat(shuffle(rest, rnd)).slice(0, per));
    });
    return out;
  }
  const hardWords = (B, list) => list.filter(x => { const e = B.words[x.w]; return e && (e.miss > e.first || e.box <= 1) && e.miss > 0; });

  /* Trophies: earned when the condition holds; the date is kept once earned. */
  const TROPHIES = [
    { id: 'first', name: 'First Buzz', emoji: '🐝', desc: 'Finish your first drill.', ok: c => c.B.drills >= 1 },
    { id: 'learn25', name: '25 Words Met', emoji: '📖', desc: 'Meet 25 different words.', ok: c => c.seen >= 25 },
    { id: 'learn100', name: '100 Words Met', emoji: '📚', desc: 'Meet 100 different words.', ok: c => c.seen >= 100 },
    { id: 'master25', name: '25 Words Mastered', emoji: '⭐', desc: 'Master 25 words.', ok: c => c.mastered >= 25 },
    { id: 'master100', name: '100 Words Mastered', emoji: '🌟', desc: 'Master 100 words.', ok: c => c.mastered >= 100 },
    { id: 'master250', name: '250 Words Mastered', emoji: '💫', desc: 'Master 250 words.', ok: c => c.mastered >= 250 },
    { id: 'flawless', name: 'Flawless', emoji: '💎', desc: 'A whole drill with no mistakes.', ok: c => c.B.perfect >= 1 },
    { id: 'combo10', name: 'Word Storm', emoji: '⚡', desc: '10 right in a row on the first try.', ok: c => c.B.maxCombo >= 10 },
    { id: 'streak3', name: 'Three-Day Buzz', emoji: '🔥', desc: 'Practise 3 days in a row.', ok: c => c.streak >= 3 },
    { id: 'streak7', name: 'Week of Words', emoji: '🗓️', desc: 'Practise 7 days in a row.', ok: c => c.streak >= 7 },
    { id: 'streak14', name: 'Fortnight Fighter', emoji: '🛡️', desc: 'Practise 14 days in a row.', ok: c => c.streak >= 14 },
    { id: 'tier1', name: 'Easy Round Champion', emoji: '🥉', desc: 'Master every tier 1 word.', ok: c => c.tier1 },
    { id: 'mock', name: 'Bee Ready', emoji: '🏆', desc: 'Get 9 or more in a mock bee.', ok: c => c.B.mockBest >= 9 },
    { id: 'drills10', name: 'Ten Drills', emoji: '🐉', desc: 'Finish 10 drills.', ok: c => c.B.drills >= 10 }
  ];
  /* Returns the trophies newly earned (and records them). */
  function award(B, list, today, streak) {
    const cn = counts(B, list), t1 = list.filter(x => x.tier === 1);
    const ctx = { B, seen: cn.seen, mastered: cn.mastered, streak: streak || 0, tier1: t1.length > 0 && t1.every(x => isMastered(B.words[x.w])) };
    const fresh = [];
    TROPHIES.forEach(t => { if (!B.trophies[t.id] && t.ok(ctx)) { B.trophies[t.id] = today; fresh.push(t); } });
    return fresh;
  }
  root.Bee = { GAPS, RANKS, TROPHIES, blank, norm, flatten, parseCustom, record, isMastered, status, counts, score, rank, daysLeft, sessionsLeft, newPerDay, pace, buildSession, mockWords, hardWords, award, shuffle, addDays, daysBetween, iso };
})(typeof window !== 'undefined' ? window : globalThis);
