/* SNES-style progress passwords. The password IS the saved data (no server, no account):
   type the same password on any device or browser to bring progress across.
   Layout (bits): version 4 | lesson count 8 | detail flag 1 | plan 2 | name length 4 + 5 per letter |
   status 2 per lesson (0 none, 1 done, 2 marked known) | [detail: base date 13, then per finished lesson date offset 8 (+ score 4 if done)] |
   checksum 16. Written in an alphabet without look-alike letters, in groups of 5. */
(function () {
  const ALPHA = '0123456789ABCDEFGHJKMNPQRSTVWXYZ', VERSION = 1, EPOCH = Date.UTC(2024, 0, 1) / 86400000;
  const PLANS = ['rotate', 'all', 'math'];
  const toDay = iso => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || ''); return m ? Math.round(Date.UTC(+m[1], m[2] - 1, +m[3]) / 86400000) : null; };
  const fromDay = n => { const d = new Date(n * 86400000); return d.getUTCFullYear() + '-' + String(d.getUTCMonth() + 1).padStart(2, '0') + '-' + String(d.getUTCDate()).padStart(2, '0'); };

  function Writer() { this.bits = []; }
  Writer.prototype.put = function (v, n) { for (let i = n - 1; i >= 0; i--) this.bits.push((v >> i) & 1); };
  function Reader(bits) { this.bits = bits; this.i = 0; }
  Reader.prototype.get = function (n) { if (this.i + n > this.bits.length) throw new Error('short'); let v = 0; for (let k = 0; k < n; k++) v = (v << 1) | this.bits[this.i++]; return v; };

  function checksum(bits) { // 16-bit Fletcher-style over 8-bit groups (zero padded)
    let a = 1, b = 0;
    for (let i = 0; i < bits.length; i += 8) { let v = 0; for (let k = 0; k < 8; k++) v = (v << 1) | (bits[i + k] || 0); a = (a + v) % 251; b = (b + a) % 251; }
    return (b << 8) | a;
  }
  function toText(bits) {
    const b = bits.slice(); while (b.length % 5) b.push(0);
    let out = ''; for (let i = 0; i < b.length; i += 5) out += ALPHA[(b[i] << 4) | (b[i + 1] << 3) | (b[i + 2] << 2) | (b[i + 3] << 1) | b[i + 4]];
    return out.match(/.{1,5}/g).join('-');
  }
  function fromText(text) {
    const clean = String(text).toUpperCase().replace(/[^0-9A-Z]/g, '').replace(/O/g, '0').replace(/[IL]/g, '1').replace(/U/g, 'V');
    const bits = [];
    for (const ch of clean) { const v = ALPHA.indexOf(ch); if (v < 0) throw new Error('char'); for (let i = 4; i >= 0; i--) bits.push((v >> i) & 1); }
    return bits;
  }

  /* state: { name, plan, lessons: [ { status: 0|1|2, correct, when } ... in fixed order ] } */
  function encode(state, detail) {
    const w = new Writer(), n = state.lessons.length;
    w.put(VERSION, 4); w.put(n, 8); w.put(detail ? 1 : 0, 1); w.put(Math.max(0, PLANS.indexOf(state.plan)), 2);
    const name = (state.name || '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 8); w.put(name.length, 4); for (const ch of name) w.put(ch.charCodeAt(0) - 64, 5);
    state.lessons.forEach(l => w.put(l.status, 2));
    if (detail) {
      const days = state.lessons.filter(l => l.status && toDay(l.when) != null).map(l => toDay(l.when)), base = days.length ? Math.min(...days) : EPOCH;
      w.put(Math.min(8191, Math.max(0, base - EPOCH)), 13);
      state.lessons.forEach(l => {
        if (!l.status) return;
        const d = toDay(l.when); w.put(d == null ? 0 : Math.min(255, Math.max(0, d - base)), 8);
        if (l.status === 1) w.put(Math.min(15, l.correct | 0), 4);
      });
    }
    const sum = checksum(w.bits); w.put(sum, 16);
    return toText(w.bits);
  }

  function decode(text, expectedCount) {
    let bits; try { bits = fromText(text); } catch (e) { return { error: 'That password has a letter or number that is not allowed. Check what you typed.' }; }
    if (bits.length < 60) return { error: 'That password is too short.' };
    try {
      // padding bits (0-4) at the end are ignored by trying each possible payload length
      for (let pad = 0; pad < 5; pad++) {
        const body = bits.slice(0, bits.length - pad - 16); if (body.length < 30) continue;
        const r = new Reader(bits.slice(0, bits.length - pad)); const sumBits = bits.slice(bits.length - pad - 16, bits.length - pad);
        const sum = sumBits.reduce((a, b) => (a << 1) | b, 0);
        if (sum !== checksum(body)) continue;
        const rd = new Reader(body), ver = rd.get(4);
        if (ver !== VERSION) return { error: 'This password comes from a different version of the app.' };
        const n = rd.get(8), detail = rd.get(1), plan = PLANS[rd.get(2)] || 'rotate';
        if (expectedCount && n !== expectedCount) return { error: `This password was made for ${n} lessons but this app has ${expectedCount}. Ask for an updated password from the older device or website.` };
        const nl = rd.get(4); let name = ''; for (let i = 0; i < nl; i++) name += String.fromCharCode(64 + rd.get(5));
        const lessons = []; for (let i = 0; i < n; i++) lessons.push({ status: rd.get(2), correct: 0, when: null });
        if (lessons.some(l => l.status > 2)) return { error: 'This password is not valid.' };
        if (detail) {
          const base = EPOCH + rd.get(13);
          lessons.forEach(l => { if (!l.status) return; l.when = fromDay(base + rd.get(8)); if (l.status === 1) l.correct = rd.get(4); });
        }
        return { name: name.charAt(0) + name.slice(1).toLowerCase(), plan, detail: !!detail, lessons };
      }
      return { error: 'That password does not match. It may have a typo, or it may be incomplete. Check every group of letters.' };
    } catch (e) { return { error: 'That password could not be read.' }; }
  }

  window.PW = { encode, decode };
})();
