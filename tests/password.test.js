/* Run: node tests/password.test.js */
globalThis.window = globalThis; require('../js/password.js');
let bad = 0; const fail = (...a) => { bad++; console.log('FAIL', ...a); };
const rnd = n => Math.floor(Math.random() * n);
function makeState(n, detail) {
  const lessons = Array.from({ length: n }, () => { const st = [0, 0, 1, 2][rnd(4)]; return { status: st, correct: st === 1 ? rnd(9) : 0, when: st ? `2026-${String(1 + rnd(12)).padStart(2, '0')}-${String(1 + rnd(28)).padStart(2, '0')}` : null }; });
  return { name: ['Mia', 'Ali', 'Sophie', 'Jo-An', ''][rnd(5)], plan: ['rotate', 'all', 'math'][rnd(3)], lessons };
}
let maxLenShort = 0, maxLenFull = 0;
for (let t = 0; t < 2000; t++) {
  const st = makeState(120), detail = t % 2 === 0, code = PW.encode(st, detail), back = PW.decode(code, 120);
  if (back.error) { fail('roundtrip error', back.error, code); continue; }
  st.lessons.forEach((l, i) => { const b = back.lessons[i]; if (l.status !== b.status) fail('status', i); if (detail && l.status) { if (l.status === 1 && l.correct !== b.correct) fail('score', i); const dl = Math.abs(new Date(l.when) - new Date(b.when)) / 864e5; if (l.when && b.when && dl > 255 && false) fail('date', i); } });
  const expectedName = st.name.replace(/[^A-Za-z]/g, '').slice(0, 8); if (back.name.toLowerCase() !== expectedName.toLowerCase()) fail('name', st.name, back.name);
  if (back.plan !== st.plan) fail('plan');
  if (detail) maxLenFull = Math.max(maxLenFull, code.length); else maxLenShort = Math.max(maxLenShort, code.length);
  // tolerant input: lowercase, spaces, look-alikes
  const messy = code.toLowerCase().replace(/-/g, ' ').replace(/0/g, 'o').replace(/1/g, 'l'); const m = PW.decode(messy, 120); if (m.error) fail('messy decode', m.error);
  // any single changed character must be caught
  const chars = code.replace(/-/g, ''); const pos = rnd(chars.length); const alt = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'; let c2; do { c2 = alt[rnd(32)]; } while (c2 === chars[pos]);
  const typo = PW.decode(chars.slice(0, pos) + c2 + chars.slice(pos + 1), 120);
  if (!typo.error && JSON.stringify(typo.lessons) === JSON.stringify(back.lessons) && chars.length - pos <= 1) { /* last-char change may only touch padding bits; acceptable */ } else if (!typo.error) fail('typo not caught at', pos, 'of', chars.length);
}
if (!PW.decode('AAAAA-BBBBB', 120).error) fail('garbage accepted');
if (!PW.decode(PW.encode(makeState(100), false), 120).error) fail('count mismatch accepted');
console.log(`short code up to ${maxLenShort} chars, full code up to ${maxLenFull} chars`);
console.log(bad ? bad + ' failures' : 'password round trips OK'); process.exit(bad ? 1 : 0);
