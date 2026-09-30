/* Spelling bee training: word list, review boxes, daily session, points, ranks and trophies. Pure functions on the saved state
   (S.bee), so tests/bee.test.js can check them in Node. The screens are in js/beeview.js. */
(function (root) {
  'use strict';
  const GAPS = [1, 2, 4, 7, 14, 30];                 // days until a word comes back, by box (0 = shaky ... 5 = solid)
  const TIERS = { 1: { name: 'Simple', emoji: '🟢' }, 2: { name: 'Advanced', emoji: '🟡' }, 3: { name: 'Expert', emoji: '🔴' } };
  const TIER_TIP = { 1: 'Short words that mostly follow the sound rules.', 2: 'Longer words with blends, vowel teams or a tricky part.', 3: 'Long or tricky words. Say them in chunks.' };
  const RANKS = [[0, 'Word Page', '🪶'], [150, 'Word Squire', '📜'], [400, 'Word Knight', '⚔️'], [900, 'Word Champion', '🏅'], [1800, 'Word Wizard', '🧙']];
  const iso = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const parse = s => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || ''); return m ? new Date(+m[1], m[2] - 1, +m[3]) : null; };
  const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return iso(d); };
  const daysBetween = (a, b) => Math.round((parse(b) - parse(a)) / 864e5);

  /* Fresh, normalised bee state. */
  const blank = () => ({ date: null, start: null, words: {}, xp: 0, drills: 0, perfect: 0, days: [], friends: [], trophies: {}, mockBest: 0, maxCombo: 0, lists: [], active: ['grade1'], tiers: [1, 2, 3], mode: 'tiles', size: 10, newMax: 6, sound: true, setAt: 0 });
  function norm(B) {
    const b = Object.assign(blank(), B || {}); ['words', 'trophies'].forEach(k => { b[k] = b[k] || {}; }); ['days', 'friends', 'lists'].forEach(k => { b[k] = Array.isArray(b[k]) ? b[k] : []; });
    if (Array.isArray(b.custom) && b.custom.length) { b.lists.push({ id: 'own', name: 'Your own words', words: b.custom }); } delete b.custom;   // older saves had one flat list of own words
    if (!Array.isArray(b.active) || !b.active.length) b.active = ['grade1']; if (!Array.isArray(b.tiers) || !b.tiers.length) b.tiers = [1, 2, 3];
    return b;
  }
  /* A judgement of how hard a word is for a young speller: length, number of beats, and spelling traps such as silent letters,
     ph, gh, tion, ie/ei, double letters. 1 = simple, 2 = advanced, 3 = expert. */
  const TRAPS = [/ph/, /gh/, /kn/, /wr/, /gn/, /mb$/, /tion|sion|cian/, /ough|augh|eigh/, /ei|ie/, /ce$|ge$|dge/, /(.)\1/, /[aeiou]{3}/, /^ps|^pn/, /que$|gue$/, /ough|ei[gn]/, /ti[ao]|ci[ao]/];
  // common words that break the sound rules: harder than their length suggests
  const IRREGULAR = new Set('people island answer friend once could would should laugh enough busy build guess heart earth learn scissors castle listen whistle wrist knife knock thumb climb lamb comb ghost school chorus choir yacht bury sugar eye colonel sword two four eight one walk talk half calf chalk shoe move prove love done gone none some come does doesn\'t toward business beauty beautiful because although through thought though tough enough bought caught daughter neighbor weight height straight'.split(' '));
  const syllables = w => { const g = w.toLowerCase().replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '').match(/[aeiouy]{1,2}/g); return Math.max(1, g ? g.length : 1); };
  function autoTier(word) {
    const w = String(word).toLowerCase(), n = w.length; let sc = n <= 4 ? 0 : n <= 6 ? 1 : n <= 8 ? 2 : 3;
    const sy = syllables(w); sc += sy >= 4 ? 2 : sy === 3 ? 1 : 0;
    sc += Math.min(2, TRAPS.filter(t => t.test(w)).length) + (IRREGULAR.has(w) ? 1 : 0);
    return sc <= 1 ? 1 : sc <= 3 ? 2 : 3;
  }
  const tierOf = t => { const v = String(t == null ? '' : t).trim().toLowerCase(); return /^(1|simple|easy)$/.test(v) ? 1 : /^(2|advanced|medium)$/.test(v) ? 2 : /^(3|expert|hard)$/.test(v) ? 3 : 0; };

  /* One flat list. Each word remembers every list it belongs to (item.lists). The built-in grade 1 list is "grade1"; the rest are the parent's own lists. */
  function flatten(groups, lists) {
    const out = [], at = new Map();
    const add = (it, listId) => { const k = at.get(it.w); if (k) { if (!k.lists.includes(listId)) k.lists.push(listId); } else { it.lists = [listId]; at.set(it.w, it); out.push(it); } };
    groups.forEach((g, gi) => g.words.forEach(x => add({ w: x[0], def: x[1], sent: x[2], tier: g.tier, gid: g.id, gname: g.name, tip: g.tip, emoji: g.emoji, gi }, 'grade1')));
    (lists || []).forEach(l => (l.words || []).map(x => ({ x, t: tierOf(x[3]) || autoTier(x[0]) })).sort((a, b) => a.t - b.t).forEach(({ x, t }) => add({ w: x[0], def: x[1] || '', sent: x[2] || '', tier: t, gid: `${l.id}-t${t}`, gname: `${l.name}: ${TIERS[t].name}`, tip: TIER_TIP[t], emoji: TIERS[t].emoji, custom: true, listName: l.name }, l.id)));
    return out;
  }
  /* The words to practise now: the chosen lists and difficulty levels. */
  const pool = (B, all) => all.filter(x => x.lists.some(id => B.active.includes(id)) && B.tiers.includes(x.tier));
  /* "word | meaning | sentence | level" per line (level: simple, advanced, expert or 1 to 3; blank = worked out automatically). Only letters in the word. */
  function parseWords(text) {
    const added = [], skipped = [];
    String(text || '').split(/\r?\n/).forEach(line => {
      const parts = line.split('|').map(s => s.trim()); const w = (parts[0] || '').toLowerCase();
      if (!w) return;
      if (!/^[a-z]{2,24}$/.test(w)) { skipped.push(parts[0]); return; }
      if (!added.some(a => a[0] === w)) added.push([w, (parts[1] || '').slice(0, 120), (parts[2] || '').slice(0, 160), tierOf(parts[3]) || autoTier(w)]);
    });
    return { added, skipped };
  }
  /* Rows of cells from pasted or file text: one row per line, cells split at tabs, commas, bars or wide gaps. */
  const rowsFromText = text => String(text || '').split(/\r?\n/).map(l => l.split(/\t|\||,|\s{2,}/).map(c => c.trim()).filter(Boolean)).filter(r => r.length);
  /* Candidate words from rows. mode 'row': the first word of each row (word + meaning tables); 'cell': the first word of every cell
     (word lists in columns); 'all': every word. Only plain letters; duplicates dropped. */
  function extractFromRows(rows, mode, minLen) {
    minLen = minLen || 3; const seen = new Set(), out = [];
    const take = tok => { const w = String(tok).toLowerCase(); if (/^[a-z]+$/.test(w) && w.length >= minLen && w.length <= 24 && !seen.has(w)) { seen.add(w); out.push(w); } };
    const toks = c => c.match(/[A-Za-z][A-Za-z'’-]*/g) || [];
    rows.forEach(r => {
      if (mode === 'all') r.forEach(c => toks(c).forEach(take));
      else if (mode === 'cell') r.forEach(c => { const t = toks(c)[0]; if (t) take(t); });
      else { const t = toks(r[0] || '')[0]; if (t) take(t); }
    });
    return out;
  }
  const addList = (B, name, words, id) => {
    name = String(name || '').trim().slice(0, 40) || 'My list'; id = id || ('l' + Date.now().toString(36) + Math.floor(Math.random() * 1e3));
    const have = B.lists.find(l => l.id === id || l.name.toLowerCase() === name.toLowerCase());
    if (have) { const s = new Set(have.words.map(x => x[0])); words.forEach(x => { if (!s.has(x[0])) { have.words.push(x); s.add(x[0]); } }); return have; }
    const l = { id, name, words: words.slice() }; B.lists.push(l); return l;
  };

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
      const pool = list.filter(x => x.tier === t), met = pool.filter(x => B.words[x.w]), rest = pool.filter(x => !B.words[x.w]);
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
    { id: 'tier1', name: 'Simple Words Champion', emoji: '🥉', desc: 'Master every simple word in the grade 1 list.', ok: c => c.tier1 },
    { id: 'tier2', name: 'Advanced Words Champion', emoji: '🥈', desc: 'Master every advanced word in the grade 1 list.', ok: c => c.tier2 },
    { id: 'mock', name: 'Bee Ready', emoji: '🏆', desc: 'Get 9 or more in a mock bee.', ok: c => c.B.mockBest >= 9 },
    { id: 'drills10', name: 'Ten Drills', emoji: '🐉', desc: 'Finish 10 drills.', ok: c => c.B.drills >= 10 }
  ];
  /* Returns the trophies newly earned (and records them). */
  function award(B, list, today, streak) {
    const cn = counts(B, list), t1 = list.filter(x => x.tier === 1 && x.lists.includes('grade1'));
    const ctx = { B, seen: cn.seen, mastered: cn.mastered, streak: streak || 0, tier1: t1.length > 0 && t1.every(x => isMastered(B.words[x.w])), tier2: (() => { const t2 = list.filter(x => x.tier === 2 && x.lists.includes('grade1')); return t2.length > 0 && t2.every(x => isMastered(B.words[x.w])); })() };
    const fresh = [];
    TROPHIES.forEach(t => { if (!B.trophies[t.id] && t.ok(ctx)) { B.trophies[t.id] = today; fresh.push(t); } });
    return fresh;
  }
  root.Bee = { GAPS, RANKS, TIERS, TIER_TIP, TROPHIES, blank, norm, flatten, pool, parseWords, parseCustom: parseWords, rowsFromText, extractFromRows, addList, autoTier, tierOf, record, isMastered, status, counts, score, rank, daysLeft, sessionsLeft, newPerDay, pace, buildSession, mockWords, hardWords, award, shuffle, addDays, daysBetween, iso };
})(typeof window !== 'undefined' ? window : globalThis);
