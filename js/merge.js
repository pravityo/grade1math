/* Merging two copies of the saved progress (this device and the cloud). Pure, so tests/merge.test.js can check it in Node.
   Rules: nothing a child earned is lost, except a lesson someone deliberately marked "not done" AFTER it was done (a tombstone in S.removed wins over an older completion). */
(function (root) {
  'use strict';
  const clone = o => JSON.parse(JSON.stringify(o == null ? null : o));
  const num = x => +x || 0;

  /* Pick the better of two completion records for the same lesson. */
  function betterDone(a, b) {
    if (!a) return b; if (!b) return a;
    if (!!a.skipped !== !!b.skipped) return a.skipped ? b : a;           // a real score beats "already known"
    if (num(a.at) !== num(b.at)) return num(a.at) > num(b.at) ? a : b;   // newer wins
    return num(a.correct) >= num(b.correct) ? a : b;
  }
  const later = (a, b) => ((a && a.last) || '') >= ((b && b.last) || '') ? a : b;

  function merge(local, remote) {
    local = local || {}; if (!remote) return clone(local);
    const out = {};
    // tombstones: newest time per lesson
    out.removed = {};
    [local.removed, remote.removed].forEach(m => Object.entries(m || {}).forEach(([id, t]) => { out.removed[id] = Math.max(num(out.removed[id]), num(t)); }));
    // completed lessons
    out.done = {};
    new Set([...Object.keys(local.done || {}), ...Object.keys(remote.done || {})]).forEach(id => {
      const tomb = num(out.removed[id]);
      const alive = e => e && (!tomb || num(e.at) > tomb);
      const pick = betterDone(alive((local.done || {})[id]) ? local.done[id] : null, alive((remote.done || {})[id]) ? remote.done[id] : null);
      if (pick) out.done[id] = clone(pick);
    });
    // stars: keep everything solved anywhere
    out.right = {};
    new Set([...Object.keys(local.right || {}), ...Object.keys(remote.right || {})]).forEach(id => { out.right[id] = Object.assign({}, (remote.right || {})[id], (local.right || {})[id]); });
    out.days = [...new Set([...(local.days || []), ...(remote.days || [])])].sort();
    // review boxes: the more recently practised record wins
    out.skills = {};
    new Set([...Object.keys(local.skills || {}), ...Object.keys(remote.skills || {})]).forEach(id => {
      const a = (local.skills || {})[id], b = (remote.skills || {})[id];
      out.skills[id] = clone(!a ? b : !b ? a : ((a.last || '') !== (b.last || '') ? later(a, b) : (num(a.ok) + num(a.miss) >= num(b.ok) + num(b.miss) ? a : b)));
    });
    out.placed = Object.assign({}, remote.placed, local.placed);
    // knight: the one further along keeps its outfit
    const lh = local.hero || {}, rh = remote.hero || {};
    out.hero = clone(num(rh.seen) > num(lh.seen) ? rh : lh); out.hero.seen = Math.max(num(lh.seen), num(rh.seen));
    // settings: newest save wins (falls back to this device)
    const useLocal = num(local.setAt) >= num(remote.setAt);
    const s = useLocal ? local : remote, t = useLocal ? remote : local;
    out.name = s.name || t.name || ''; out.plan = s.plan || t.plan || 'rotate'; out.goal = s.goal || t.goal || 3; out.setAt = Math.max(num(local.setAt), num(remote.setAt));
    out.pos = clone(local.pos == null ? remote.pos : local.pos);          // where you were belongs to this device
    return out;
  }
  /* Two copies are "the same" if merging changes nothing (used to skip needless writes and reloads). */
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  root.Merge = { merge, betterDone, same };
})(typeof window !== 'undefined' ? window : globalThis);
