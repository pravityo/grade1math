/* Family records: several parents (each with their own Google account) share one progress record.
   Pure functions, so tests/family.test.js can check them in Node. The record: { members:[uid], emails:{uid:email}, pending:[email], owner, state, v }. */
(function (root) {
  'use strict';
  const MAX_PENDING = 5, MAX_MEMBERS = 6;
  const normEmail = e => String(e == null ? '' : e).trim().toLowerCase();
  const validEmail = e => /^[^@\s,;]+@[^@\s,;]+\.[^@\s,;]{2,}$/.test(normEmail(e)) && normEmail(e).length <= 120;
  const isMember = (fam, uid) => !!fam && Array.isArray(fam.members) && fam.members.includes(uid);
  function newId() { const a = new Uint8Array(15); (root.crypto || require('crypto').webcrypto).getRandomValues(a); return Array.from(a, b => 'abcdefghijkmnpqrstuvwxyz23456789'[b % 32]).join(''); }
  const newFamily = (uid, email, state) => ({ members: [uid], emails: { [uid]: normEmail(email) }, pending: [], owner: uid, state: state || '{}', v: 2 });
  const clone = f => JSON.parse(JSON.stringify(f));

  function invite(fam, email) {
    email = normEmail(email);
    if (!validEmail(email)) return { ok: false, reason: 'That does not look like an email address.' };
    if (Object.values(fam.emails || {}).includes(email)) return { ok: false, reason: 'That parent already has access.' };
    if ((fam.pending || []).includes(email)) return { ok: false, reason: 'That parent is already invited.' };
    if ((fam.pending || []).length >= MAX_PENDING) return { ok: false, reason: 'Too many open invites. Cancel one first.' };
    if ((fam.members || []).length >= MAX_MEMBERS) return { ok: false, reason: 'A family can have up to ' + MAX_MEMBERS + ' parents.' };
    const f = clone(fam); f.pending = (f.pending || []).concat(email); return { ok: true, fam: f, email };
  }
  /* The invited person joins: added to members, their invite removed. */
  function accept(fam, uid, email) {
    const f = clone(fam); email = normEmail(email);
    if (!isMember(f, uid)) { f.members.push(uid); }
    f.emails = Object.assign({}, f.emails, { [uid]: email }); f.pending = (f.pending || []).filter(e => e !== email);
    return f;
  }
  const revoke = (fam, email) => { const f = clone(fam); f.pending = (f.pending || []).filter(e => e !== normEmail(email)); return f; };
  /* Any parent may remove another parent, never themselves, and never the last one. */
  function removeMember(fam, uid, byUid) {
    if (!isMember(fam, uid)) return { ok: false, reason: 'That person is not a parent in this family.' };
    if (uid === byUid) return { ok: false, reason: 'You cannot remove yourself. Use Sign out instead.' };
    if (!isMember(fam, byUid)) return { ok: false, reason: 'Only a parent in this family can remove someone.' };
    const f = clone(fam); f.members = f.members.filter(m => m !== uid); delete f.emails[uid];
    if (f.owner === uid) f.owner = f.members[0];
    return { ok: true, fam: f };
  }
  const list = (fam, myUid) => ((fam && fam.members) || []).map(uid => ({ uid, email: (fam.emails || {})[uid] || 'a parent', you: uid === myUid, owner: fam.owner === uid }));
  root.Family = { normEmail, validEmail, isMember, newId, newFamily, invite, accept, revoke, removeMember, list, MAX_PENDING, MAX_MEMBERS };
})(typeof window !== 'undefined' ? window : globalThis);
