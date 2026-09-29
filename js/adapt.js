/* Adaptive learning helpers. Pure functions on the saved state object, so they can be tested in Node (tests/adapt.test.js).
   State used: S.skills[lessonId] = { box, due, ok, miss, missed:{qi:1}, last }
   A "skill" is one lesson (each lesson teaches one skill, lesson.sk). box is a Leitner box: 0 = shaky ... 5 = solid. */
(function (root) {
  'use strict';
  const GAPS = [1, 2, 4, 7, 14, 30]; // days until a skill is due again, by box
  const iso = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const parse = s => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s); return m ? new Date(+m[1], m[2] - 1, +m[3]) : null; };
  const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return iso(d); };
  const daysBetween = (a, b) => Math.round((parse(b) - parse(a)) / 864e5);
  const isWeekday = d => ![0, 6].includes(d.getDay());

  /* Remember how a question went. firstTry = solved without a wrong attempt or reveal. */
  function record(S, id, qi, firstTry, today) {
    S.skills = S.skills || {};
    const e = S.skills[id] = S.skills[id] || { box: 0, due: today, ok: 0, miss: 0, missed: {}, last: today };
    e.missed = e.missed || {};
    if (firstTry) { e.ok++; e.box = Math.min(5, e.box + 1); delete e.missed[qi]; }
    else { e.miss++; e.box = Math.max(0, e.box - 2); e.missed[qi] = 1; }
    e.last = today; e.due = addDays(today, GAPS[e.box]);
    return e;
  }
  const isWeak = e => !!e && (Object.keys(e.missed || {}).length > 0 || (e.box <= 1 && e.miss > e.ok));

  /* Skills to revisit: due today or earlier (or weak), never the lesson being studied. Weakest and most overdue first. */
  function dueSkills(S, today, exceptId) {
    const out = [];
    Object.entries(S.skills || {}).forEach(([id, e]) => {
      if (id === exceptId) return;
      const late = daysBetween(e.due, today);
      if (late >= 0 || (isWeak(e) && late >= -1)) out.push({ id, e, late, weak: isWeak(e) });
    });
    out.sort((a, b) => (b.weak - a.weak) || (a.e.box - b.e.box) || (b.late - a.late) || a.id.localeCompare(b.id));
    return out;
  }
  /* Which question of a lesson to re-ask: one that was missed if any, else a level that suits the skill's box. */
  function pickQuestion(lesson, e, salt) {
    const missed = Object.keys((e && e.missed) || {}).map(Number).filter(i => lesson.q[i]);
    if (missed.length) return missed[(salt | 0) % missed.length];
    const levels = e && e.box >= 4 ? 'so' : 'bc';
    const pool = lesson.q.map((q, i) => [q, i]).filter(x => levels.includes(x[0].l));
    const list = pool.length ? pool : lesson.q.map((q, i) => [q, i]);
    return list[(salt | 0) % list.length][1];
  }

  /* Challenge opens once Practice is mostly solved (60%, at least 2 questions), or the lesson is already finished. */
  function practiceSolid(practiceTotal, practiceSolved) { return practiceTotal === 0 || practiceSolved >= Math.max(2, Math.ceil(practiceTotal * 0.6)) || practiceSolved >= practiceTotal; }

  /* An easier question from the same lesson: a lower level than the one that stumped the child, not already tried. */
  const ORDER = 'bcso';
  function easierIndex(lesson, qi, tried) {
    const lv = ORDER.indexOf(lesson.q[qi].l), used = new Set(tried || []); used.add(qi);
    for (let l = lv - 1; l >= 0; l--) {
      const c = lesson.q.map((q, i) => i).filter(i => lesson.q[i].l === ORDER[l] && !used.has(i));
      if (c.length) return c[0];
    }
    return -1;
  }

  /* Placement check: probe every 5th lesson, 2 questions each. The first failed probe stops the check. */
  function probes(n) { const out = []; for (let i = 4; i < n - 1; i += 5) out.push(i); return out; }
  /* passed = array of booleans, one per probe asked (in order). Returns how many leading lessons can be skipped. */
  function placement(probeIdx, passed) {
    let last = -1;
    for (let i = 0; i < passed.length && passed[i]; i++) last = probeIdx[i];
    return last + 1;
  }

  /* Streaks: consecutive study days. Weekends never break it, and one missed weekday is forgiven per 5 weekdays. */
  function streak(days, todayIso) {
    const set = new Set(days); const d = parse(todayIso); let n = 0, sinceGrace = 99, run = 0;
    if (!set.has(todayIso)) d.setDate(d.getDate() - 1);
    for (let i = 0; i < 500; i++) {
      const s = iso(d);
      if (set.has(s)) { n++; sinceGrace++; run++; }
      else if (isWeekday(d)) {
        // forgive a single missed weekday only if the day before it (older) was a study day, and no grace used recently
        const prev = new Date(d); prev.setDate(prev.getDate() - 1); while (!isWeekday(prev)) prev.setDate(prev.getDate() - 1);
        if (sinceGrace >= 5 && run > 0 && set.has(iso(prev))) { sinceGrace = 0; } else break;
      }
      d.setDate(d.getDate() - 1);
    }
    return n;
  }
  /* Monday-Friday of the week containing todayIso, with whether each day was a study day. Weekend study counts too, as an extra. */
  function week(days, todayIso) {
    const t = parse(todayIso), set = new Set(days), mon = new Date(t); mon.setDate(t.getDate() - ((t.getDay() + 6) % 7));
    const list = []; let count = 0;
    for (let i = 0; i < 7; i++) { const d = new Date(mon); d.setDate(mon.getDate() + i); const s = iso(d), on = set.has(s); if (on) count++; if (i < 5) list.push({ iso: s, on, today: s === todayIso }); }
    return { days: list, count };
  }

  root.Adapt = { GAPS, iso, addDays, daysBetween, record, isWeak, dueSkills, pickQuestion, practiceSolid, easierIndex, probes, placement, streak, week };
})(typeof window !== 'undefined' ? window : globalThis);
