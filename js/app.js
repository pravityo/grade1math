(function () {
  'use strict';
  const $app = document.getElementById('app');
  const KEY = 'grade1math.v1';
  const LV = { b: ['Warm-up', '🌱'], c: ['Core', '⭐'], s: ['Stretch', '🚀'], o: ['Olympiad', '🏆'] };

  /* ---------- data ---------- */
  /* Three subjects. Maths keeps plain numeric ids ("0".."39") so progress saved before English/Science existed still works. */
  const SUBJECTS = [
    { key: 'math', name: 'Maths', icon: '🧮', prefix: '', weeks: window.CURRICULUM || [], blurb: 'Singapore-style maths beyond school level, with olympiad thinking.' },
    { key: 'eng', name: 'English', icon: '📚', prefix: 'e', weeks: window.ENGLISH || [], blurb: 'Phonics, grammar, reading and word puzzles.' },
    { key: 'sci', name: 'Science', icon: '🔬', prefix: 's', weeks: window.SCIENCE || [], blurb: 'Living things, materials, forces, Earth and how scientists think.' }
  ];
  const SUBJ = {}; const BYID = {};
  SUBJECTS.forEach(sb => {
    sb.lessons = []; SUBJ[sb.key] = sb;
    sb.weeks.forEach(w => w.lessons.forEach((l, d) => { const L = Object.assign({ subj: sb.key, n: sb.lessons.length, week: w.week, day: d + 1, theme: w.theme }, l); L.id = sb.prefix + L.n; sb.lessons.push(L); BYID[L.id] = L; }));
  });
  const ALL = SUBJECTS.flatMap(sb => sb.lessons);
  /* Questions wired to a generator (js/data/gens.js) get fresh numbers each time they are asked. */
  function resolve(L, qi) {
    const base = L.q[qi], name = L.subj === 'math' && (window.GENS || {})[L.n + ':' + qi], gen = name && window.GEN[name];
    if (!gen) return base;
    try {
      const out = gen();
      if (!out || out.a == null || /undefined|NaN|Infinity/.test(JSON.stringify(out))) return base;
      return Object.assign({ l: base.l, gen: name }, out);
    } catch (e) { return base; }
  }
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  /* ---------- state ---------- */
  let S;
  function load() {
    try { S = JSON.parse(localStorage.getItem(KEY)); } catch (e) { S = null; }
    if (!S || typeof S !== 'object') S = {};
    S.done = S.done || {}; S.right = S.right || {}; S.days = S.days || []; S.name = S.name || ''; S.plan = S.plan || 'rotate';
    if (S.pos && S.pos.id == null && S.pos.n != null) S.pos = { id: String(S.pos.n), step: S.pos.step | 0 }; // saved before subjects existed
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* storage blocked */ } }
  load();
  // Safari can drop site data after ~7 idle days unless storage is persisted or the app is added to the Home Screen.
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) { /* unsupported */ }
  // Flush on every way Safari can background or close the page (iOS rarely fires unload).
  window.addEventListener('pagehide', save);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') save(); });

  const todayStr = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  const isWeekend = () => [0, 6].includes(new Date().getDay());
  const nextIdx = sb => { const i = sb.lessons.findIndex(l => !S.done[l.id]); return i < 0 ? sb.lessons.length : i; };
  const doneCount = sb => sb ? sb.lessons.filter(l => S.done[l.id]).length : Object.keys(S.done).length;
  const starCount = () => Object.values(S.right).reduce((a, r) => a + Object.keys(r).length, 0);
  function markDay() { const t = todayStr(); if (!S.days.includes(t)) { S.days.push(t); save(); } }
  function streak() {
    // consecutive weekdays with activity, weekends never break a streak
    const set = new Set(S.days); let n = 0; const d = new Date();
    if (!set.has(todayStr())) d.setDate(d.getDate() - 1);
    for (let i = 0; i < 400; i++) {
      const s = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
      if (set.has(s)) n++; else if (![0, 6].includes(d.getDay())) break;
      d.setDate(d.getDate() - 1);
    }
    return n;
  }

  /* ---------- helpers ---------- */
  const h = (tag, attrs, ...kids) => {
    const e = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k, v]) => {
      if (k === 'class') e.className = v; else if (k === 'html') e.innerHTML = v;
      else if (k.startsWith('on')) e.addEventListener(k.slice(2), v); else e.setAttribute(k, v);
    });
    kids.flat().forEach(c => e.append(c && c.nodeType ? c : document.createTextNode(c == null ? '' : c)));
    return e;
  };
  const vis = html => Visuals.expand(html);
  const fmtDate = iso => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || ''); return m ? new Date(+m[1], m[2] - 1, +m[3]).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''; };
  const doneLine = r => (r.skipped ? 'Marked as already known' : 'Completed') + (r.when ? ' ' + fmtDate(r.when) : '');
  const scoreText = r => r.skipped ? 'already known' : r.noscore ? 'done (score not saved)' : `${r.correct}/${r.total} correct`;
  const scoreShort = r => r.skipped ? 'known' : r.noscore ? 'done' : `${r.correct}/${r.total}`;
  /* "Already learned elsewhere": mark lessons done without any answers. Stars and streak are not affected, and real results are never overwritten. */
  const markKnown = L => { if (S.done[L.id]) return false; S.done[L.id] = { correct: 0, total: L.q.length, when: todayStr(), skipped: true }; return true; };
  const unmarkKnown = L => { if (S.done[L.id] && S.done[L.id].skipped) { delete S.done[L.id]; return true; } return false; };
  /* "Unlearn": undo a completion (real or marked known). Stars for solved questions stay unless the lesson is started over. */
  const unmarkDone = L => { if (S.done[L.id]) { delete S.done[L.id]; return true; } return false; };
  const startOver = L => { unmarkDone(L); delete S.right[L.id]; };
  const lessonsUpTo = (sb, week) => sb.lessons.filter(l => l.week <= week);
  const norm = s => String(s).trim().toLowerCase().replace(/\s+/g, '').replace(/[.!]+$/, '');
  function isCorrect(q, given) {
    const g = norm(given); if (!g) return false;
    const answers = [].concat(q.a).map(norm);
    if (answers.includes(g)) return true;
    const gm = g.match(/^\$?(-?\d+(?:\.\d+)?)[a-z$¢]*$/); // allow "8cm", "$5"
    return !!gm && answers.some(a => /^-?\d+(\.\d+)?$/.test(a) && parseFloat(a) === parseFloat(gm[1]));
  }
  const answerText = q => [].concat(q.a)[0] + (q.u ? ' ' + q.u : '');

  /* ---------- review picking ---------- */
  function lookBackQs(L0) {
    const out = [], n = L0.n, list = SUBJ[L0.subj].lessons;
    [1, 3, 7, 14].forEach((k, i) => {
      const L = list[n - k]; if (!L) return;
      const pool = L.q.map((q, qi) => ({ q, qi })).filter(x => (i < 3 ? 'bc' : 'so').includes(x.q.l));
      const pick = pool[(n + k) % pool.length];
      out.push({ L, qi: pick.qi, q: resolve(L, pick.qi), ago: k });
    });
    return out;
  }
  function mixedQs(lessons, count) {
    const all = [];
    lessons.forEach(L => L.q.forEach((q, qi) => all.push({ L, qi, q: resolve(L, qi) })));
    for (let i = all.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [all[i], all[j]] = [all[j], all[i]]; }
    return all.slice(0, count);
  }

  /* ---------- question widget ---------- */
  function questionEl(item, opts) {
    const { q } = item; opts = opts || {};
    let tries = 0, solved = false;
    const box = h('div', { class: 'q' });
    const lv = LV[q.l];
    const fb = h('div', { class: 'fb' });
    const extra = h('div');
    box.append(h('span', { class: 'lv ' + q.l }, lv[1] + ' ' + lv[0]));
    if (opts.tag) box.append(' ', h('span', { class: 'muted small' }, opts.tag));
    box.append(h('div', { class: 'text' }, q.q));
    const qp = q.gen ? q.p : (q.p || (item.L.subj === 'math' ? (window.QPICS || {})[item.L.n + ':' + item.qi] : null));
    if (qp) box.append(h('div', { class: 'qpic', html: vis(qp) }));

    function showSol() { if (q.s) extra.append(h('div', { class: 'sol' }, '💡 ' + q.s)); }
    function win() {
      solved = true; box.classList.remove('wrong'); box.classList.add('right');
      fb.className = 'fb ok'; fb.textContent = ['Yes! ', 'Great job! ', 'Correct! ', 'Awesome! '][(item.qi + tries) % 4] + '✅';
      extra.replaceChildren(); showSol();
      if (opts.onRight) opts.onRight();
      box.querySelectorAll('input,button.chk').forEach(x => x.disabled = true);
    }
    function lose() {
      tries++; box.classList.add('wrong'); fb.className = 'fb no';
      fb.textContent = tries === 1 ? 'Not quite. Have another go!' : 'Still not it. Look at the hint or show the answer.';
      extra.replaceChildren();
      const bar = h('div', { class: 'ans', style: 'margin-top:8px' });
      if (q.h) bar.append(h('button', { class: 'btn alt small', onclick: () => { hintEl.style.display = 'block'; } }, '💭 Hint'));
      if (tries >= 2) bar.append(h('button', { class: 'btn alt small', onclick: reveal }, 'Show answer'));
      extra.append(bar);
      if (q.h) extra.append(hintEl);
    }
    const hintEl = h('div', { class: 'hint', style: 'display:none' }, '💭 ' + (q.h || ''));
    function reveal() {
      solved = true; fb.className = 'fb'; fb.textContent = 'Answer: ' + answerText(q);
      extra.replaceChildren(); showSol();
      box.querySelectorAll('input,button.chk,.opts button').forEach(x => x.disabled = true);
    }
    function submit(val) { if (solved) return; if (isCorrect(q, val)) win(); else lose(); }

    if (q.o) {
      const wrap = h('div', { class: 'opts' });
      // Shuffle choices so the right answer is not always in the same spot, but keep naturally ordered sets (numbers, yes/no, odd/even, single letters) as written.
      const fixed = q.o.every(o => /^\d+$/.test(o) || o.length <= 1) || ['yes', 'no', 'odd', 'even', 'true', 'false', 'cm', 'm'].some(w => q.o.includes(w) && q.o.length === 2);
      (fixed ? q.o : q.o.map(o => [Math.random(), o]).sort((x, y) => x[0] - y[0]).map(x => x[1])).forEach(o => wrap.append(h('button', { onclick: e => { if (solved) return; submit(o); e.target.classList.add(solved && box.classList.contains('right') ? 'good' : 'picked'); } }, o)));
      box.append(wrap);
    } else {
      const input = h('input', { type: 'text', inputmode: (/^\d+$/.test(String([].concat(q.a)[0])) ? 'numeric' : 'text'), autocomplete: 'off', 'aria-label': 'Your answer', placeholder: 'Answer' });
      input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(input.value); });
      box.append(h('div', { class: 'ans' }, input, q.u ? h('span', { class: 'muted' }, q.u) : '', h('button', { class: 'btn chk', onclick: () => submit(input.value) }, 'Check')));
    }
    box.append(fb, extra);
    return box;
  }

  /* ---------- views ---------- */
  function setNav(name) { document.querySelectorAll('[data-nav]').forEach(a => a.classList.toggle('on', a.dataset.nav === name)); }
  const pillOf = L => `${SUBJ[L.subj].icon} ${SUBJ[L.subj].name} · Week ${L.week} · ${DAYS[L.day - 1]} · ${L.theme}`;
  let pick = null; // Set of lesson ids while choosing lessons to mark as known on the map
  function tile(L) {
    const done = S.done[L.id], nx = nextIdx(SUBJ[L.subj]) === L.n, choosing = !!pick;
    const a = h('a', { class: 'tile ' + (done ? 'done ' : '') + (nx ? 'next ' : '') + (choosing ? 'pickable ' : '') + (choosing && pick.has(L.id) ? 'picked' : ''), href: '#/lesson/' + L.id },
      h('small', {}, `Week ${L.week} · ${DAYS[L.day - 1]}`), h('b', {}, (done ? '✅ ' : nx && !pick ? '▶ ' : '') + L.t),
      done ? h('small', {}, scoreText(done)) : '',
      done && done.when ? h('span', { class: 'stamp' }, '✔ ' + doneLine(done)) : '');
    if (choosing) a.addEventListener('click', e => { e.preventDefault(); if (pick.has(L.id)) pick.delete(L.id); else pick.add(L.id); route(); });
    return a;
  }
  function subjTabs(base, cur, withAll) {
    return h('div', { class: 'subj-tabs' }, (withAll ? [{ key: 'all', icon: '🌟', name: 'All' }] : []).concat(SUBJECTS).map(sb => h('a', { class: sb.key === cur ? 'on ' + sb.key : sb.key, href: '#/' + base + '/' + sb.key }, `${sb.icon} ${sb.name}`)));
  }
  /* Which subjects are "today's" work. Maths every weekday; English on Mon/Wed/Fri and Science on Tue/Thu (the plan can be changed in Parent corner). */
  function todayPlan() {
    const dow = new Date().getDay(), weekend = dow === 0 || dow === 6, plan = S.plan || 'rotate';
    let main = ['math'];
    if (plan === 'all') main = ['math', 'eng', 'sci'];
    else if (plan === 'rotate') main = ['math', [1, 3, 5].includes(dow) ? 'eng' : 'sci'];
    return { weekend, main: weekend ? [] : main, optional: SUBJECTS.map(x => x.key).filter(k => weekend || !main.includes(k)) };
  }
  /* ---- home: friendly owl, big adventure cards, sticker book ---- */
  const OWL = `<svg class="owl" viewBox="0 0 120 132" role="img" aria-label="A friendly owl waving hello">
    <path d="M20 46 L28 12 L52 34 Z M100 46 L92 12 L68 34 Z" fill="#8a5730"/>
    <ellipse cx="60" cy="82" rx="42" ry="44" fill="#a86a3c"/><ellipse cx="60" cy="92" rx="26" ry="29" fill="#f6dcae"/>
    <circle cx="60" cy="52" r="37" fill="#b9793f"/>
    <circle cx="44" cy="52" r="16" fill="#fff"/><circle cx="76" cy="52" r="16" fill="#fff"/>
    <circle class="pupil" cx="46" cy="54" r="7" fill="#2b2a4c"/><circle class="pupil" cx="74" cy="54" r="7" fill="#2b2a4c"/>
    <circle cx="48.5" cy="51" r="2.4" fill="#fff"/><circle cx="76.5" cy="51" r="2.4" fill="#fff"/>
    <path d="M53 64 L60 77 L67 64 Z" fill="#f5a623"/>
    <path d="M14 88 Q4 104 22 112 Q22 96 30 86 Z" fill="#8a5730"/>
    <g class="wave"><path d="M106 88 Q118 72 112 58 Q104 66 98 84 Z" fill="#8a5730"/></g>
    <ellipse cx="46" cy="124" rx="10" ry="5" fill="#f5a623"/><ellipse cx="74" cy="124" rx="10" ry="5" fill="#f5a623"/></svg>`;
  const ICONS = {
    math: `<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="18" y="6" width="26" height="26" rx="6" fill="#7fe0c2" stroke="#fff" stroke-width="3"/><rect x="4" y="34" width="26" height="26" rx="6" fill="#ffd84d" stroke="#fff" stroke-width="3"/><rect x="34" y="34" width="26" height="26" rx="6" fill="#ff7a90" stroke="#fff" stroke-width="3"/><g font-family="ui-rounded,system-ui" font-weight="800" font-size="20" fill="#fff" text-anchor="middle"><text x="31" y="27">3</text><text x="17" y="55">1</text><text x="47" y="55">2</text></g></svg>`,
    eng: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M6 14 Q32 4 32 14 V56 Q32 46 6 56 Z" fill="#fff"/><path d="M58 14 Q32 4 32 14 V56 Q32 46 58 56 Z" fill="#ffe6a3"/><path d="M32 14 V56" stroke="#0f9d8a" stroke-width="3"/><text x="19" y="42" font-family="ui-rounded,system-ui" font-weight="800" font-size="22" fill="#0f9d8a" text-anchor="middle">A</text><text x="45" y="42" font-family="ui-rounded,system-ui" font-weight="800" font-size="22" fill="#e0862b" text-anchor="middle">b</text></svg>`,
    sci: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M25 6 h14 v18 l15 27 q4 9 -6 9 h-32 q-10 0 -6 -9 l15 -27 z" fill="#fff" fill-opacity=".92"/><path d="M17 44 h30 l7 12 q1 3 -3 3 h-38 q-4 0 -3 -3 z" fill="#7fe0c2"/><circle cx="28" cy="38" r="3" fill="#fff"/><circle cx="37" cy="30" r="2.4" fill="#fff"/><circle cx="34" cy="46" r="2" fill="#fff"/></svg>`
  };
  const greeting = () => { const hr = new Date().getHours(); return hr < 12 ? 'Good morning' : hr < 18 ? 'Good afternoon' : 'Good evening'; };
  function subjCard(sb, primary) {
    const n = nextIdx(sb), L = sb.lessons[n], icon = h('div', { class: 'sc-icon', html: ICONS[sb.key] });
    if (!L) return h('section', { class: 'sc ' + sb.key }, icon, h('div', { class: 'sc-body' }, h('h2', {}, sb.name), h('p', {}, 'You finished every lesson!')), h('a', { class: 'go', href: '#/map/' + sb.key }, 'Map'));
    const cont = S.pos && S.pos.id === L.id && S.pos.step > 0;
    const card = h('section', { class: 'sc ' + sb.key + (primary ? '' : ' extra') }, icon,
      h('div', { class: 'sc-body' }, h('span', { class: 'sc-tag' }, sb.name + (primary ? '' : ' · extra')), h('h2', {}, L.t),
        h('div', { class: 'meter light' }, h('i', { style: `width:${doneCount(sb) / sb.lessons.length * 100}%` })), h('small', {}, `Lesson ${n + 1} of ${sb.lessons.length}`)),
      h('a', { class: 'go', href: '#/lesson/' + L.id }, cont ? 'Keep going' : 'Go!'));
    const skip = h('button', { class: 'linkbtn', onclick: () => { if (confirm(`Mark "${L.t}" as already known? It will count as done without any questions. You can undo this.`)) { markKnown(L); const nx = sb.lessons.find(l => !S.done[l.id]); S.pos = nx ? { id: nx.id, step: 0 } : null; save(); route(); } } }, 'I already know this one');
    return h('div', { class: 'sc-wrap' }, card, skip);
  }

  function viewHome() {
    setNav('home');
    const frag = h('div'), plan = todayPlan();
    frag.append(h('section', { class: 'hello' }, h('div', { class: 'owl-wrap', html: OWL }),
      h('div', { class: 'bubble' }, h('h1', {}, `${greeting()}, ${S.name || 'friend'}!`),
        h('p', {}, plan.weekend ? 'It is the weekend. Pick anything you like!' : 'Your adventures for today are waiting.'))));
    frag.append(h('h2', { class: 'sect' }, plan.weekend ? 'Pick an adventure' : 'Today\'s adventures'));
    plan.main.forEach(k => frag.append(subjCard(SUBJ[k], true)));
    if (plan.optional.length) {
      frag.append(h('h2', { class: 'sect' }, plan.main.length ? 'Want more?' : 'All adventures'));
      plan.optional.forEach(k => frag.append(subjCard(SUBJ[k], false)));
    }
    frag.append(h('div', { class: 'chips' },
      h('div', { class: 'chip' }, h('b', {}, starCount()), 'stars'),
      h('div', { class: 'chip' }, h('b', {}, streak()), streak() === 1 ? 'day in a row' : 'days in a row'),
      h('div', { class: 'chip' }, h('b', {}, `${doneCount()}/${ALL.length}`), 'lessons done')));
    frag.append(h('a', { class: 'quick', href: '#/review' }, h('span', { class: 'quick-die', html: '🎲' }), h('span', {}, h('b', {}, 'Quick game'), h('br'), 'Questions from lessons you have done')));
    const book = h('section', { class: 'book' }, h('h2', { class: 'sect' }, 'My sticker book'));
    SUBJECTS.forEach(sb => {
      const nx = nextIdx(sb);
      book.append(h('div', { class: 'book-row' }, h('div', { class: 'book-label' }, h('b', {}, sb.name), h('small', {}, `${doneCount(sb)} of ${sb.lessons.length}`)),
        h('div', { class: 'stickers' }, sb.lessons.map(L => { const r = S.done[L.id]; return h('a', { class: `stk ${sb.key} ${r ? (r.skipped ? 'known' : 'got') : ''} ${L.n === nx ? 'next' : ''}`, href: '#/lesson/' + L.id, title: L.t, 'aria-label': L.t + (r ? ' (done)' : '') }, r ? (r.skipped ? '✓' : '★') : ''); }))));
    });
    frag.append(book);
    app(frag);
  }

  function viewMap(key) {
    setNav('map');
    const sb = SUBJ[key] || SUBJECTS[0];
    if (pick && pick.subj !== sb.key) pick = null;
    const frag = h('div', {}, h('h1', {}, 'Adventure Map'), subjTabs('map', sb.key), h('p', { class: 'muted' }, `${sb.blurb} 8 weeks, 5 lessons a week. Tap any lesson to open it.`));
    if (!pick) frag.append(h('div', { class: 'known-card' }, h('span', {}, 'Learned some already, or pressed done by mistake?'), h('button', { class: 'btn', onclick: () => { pick = new Set(); pick.subj = sb.key; route(); } }, 'Choose lessons to change')));
    else {
      const ids = [...pick], toKnow = ids.filter(id => !S.done[id]), toReset = ids.filter(id => S.done[id]);
      frag.append(h('div', { class: 'pickbar' }, h('b', {}, ids.length ? `${ids.length} chosen` : 'Tap the lessons to change'),
        h('button', Object.assign({ class: 'btn', onclick: () => { if (confirm(`Mark ${toKnow.length} lesson${toKnow.length > 1 ? 's' : ''} as already known? They will count as done without any questions. You can undo this.`)) { toKnow.forEach(id => markKnown(BYID[id])); pick = null; save(); route(); } } }, toKnow.length ? {} : { disabled: 'disabled' }), `Mark as known${toKnow.length ? ' (' + toKnow.length + ')' : ''}`),
        h('button', Object.assign({ class: 'btn alt', onclick: () => { if (confirm(`Mark ${toReset.length} lesson${toReset.length > 1 ? 's' : ''} as not done? Scores and dates for them are removed. Stars for solved questions are kept.`)) { toReset.forEach(id => unmarkDone(BYID[id])); pick = null; save(); route(); } } }, toReset.length ? {} : { disabled: 'disabled' }), `↩ Mark as not done${toReset.length ? ' (' + toReset.length + ')' : ''}`),
        h('button', { class: 'btn alt', onclick: () => { pick = null; route(); } }, 'Cancel')));
    }
    sb.weeks.forEach(w => {
      const wl = sb.lessons.filter(l => l.week === w.week), wd = wl.filter(l => S.done[l.id]);
      const last = wd.map(l => S.done[l.id].when).sort().pop();
      const todo = wl.filter(l => !S.done[l.id]), known = wl.filter(l => S.done[l.id] && S.done[l.id].skipped);
      frag.append(h('div', { class: 'weekh' }, h('h2', {}, `Week ${w.week}: ${w.theme}`),
        h('span', { class: 'wk' + (wd.length === wl.length ? ' ok' : '') }, wd.length === wl.length ? `✅ Week complete ${fmtDate(last)}` : `${wd.length}/${wl.length} done`)), h('p', { class: 'muted' }, w.blurb),
        h('div', { class: 'known-row' },
          todo.length ? h('button', { class: 'btn alt small', onclick: () => { if (confirm(`Mark the ${todo.length} unfinished lesson${todo.length > 1 ? 's' : ''} in Week ${w.week} as already known? They will count as done without questions. You can undo this.`)) { todo.forEach(markKnown); save(); route(); } } }, `✔ Already know all of Week ${w.week}`) : '',
          known.length ? h('button', { class: 'btn alt small', onclick: () => { known.forEach(unmarkKnown); save(); route(); } }, `↩ Undo ${known.length} marked as known`) : '',
          wd.length ? h('button', { class: 'btn alt small', onclick: () => { if (confirm(`Mark all ${wd.length} finished lesson${wd.length > 1 ? 's' : ''} in Week ${w.week} as not done? Scores and dates for them are removed. Stars for solved questions are kept.`)) { wd.forEach(unmarkDone); save(); route(); } } }, `↩ Mark Week ${w.week} as not done`) : ''));
      frag.append(h('div', { class: 'grid' }, wl.map(tile)));
    });
    app(frag);
  }

  /* Longer explanation, worked example, common mistakes, talk prompts and vocabulary (js/data/deep-*.js). */
  function deepSections(L, body) {
    const d = (window.DEEP || {})[L.id]; if (!d) return;
    const sec = (cls, title, ...kids) => body.append(h('section', { class: 'deep ' + cls }, h('h3', {}, title), ...kids));
    sec('why', '🔍 Explain it more', d.why.map(p => h('p', { html: p })));
    sec('worked', '✍️ Try it step by step: ' + d.worked.t, h('ol', {}, d.worked.s.map(t => h('li', { html: t }))));
    sec('watch', '⚠️ Watch out for', h('ul', {}, d.watch.map(t => h('li', { html: t }))));
    sec('talk', '🗣️ Talk about it', h('ul', {}, d.talk.map(t => h('li', { html: t }))));
    sec('words', '📖 Words to know', h('div', { class: 'wordlist' }, d.words.map(w => h('div', { class: 'word' }, h('b', {}, w[0]), h('span', {}, w[1])))));
  }
  /* Free outside resources found by web search (js/data/links.js). */
  function linkSection(L, body) {
    const ls = (window.LINKS || {})[L.id]; if (!ls || !ls.length) return;
    body.append(h('section', { class: 'deep links' }, h('h3', {}, '🔗 Explore more (free websites)'),
      h('ul', {}, ls.map(x => h('li', {}, h('a', { href: x[1], target: '_blank', rel: 'noopener noreferrer' }, x[0]), h('span', { class: 'muted' }, ' · ' + x[2])))),
      h('p', { class: 'muted small' }, 'These are outside websites. A grown-up should open them first. Some pages have adverts, and pages can change or move.')));
  }

  function viewLesson(id) {
    setNav('home');
    const L = BYID[id]; if (!L) return go('#/');
    const sb = SUBJ[L.subj];
    const steps = [['🔁 Look Back', 'lb'], ['📖 Learn', 'learn'], ['✏️ Practice', 'prac'], ['🚀 Challenge', 'chal'], ['🏁 Wrap-up', 'wrap']];
    let cur = S.pos && S.pos.id === id ? Math.min(S.pos.step | 0, steps.length - 1) : 0; const seen = new Set();
    const wrap = h('div');
    const right = S.right[id] = S.right[id] || {};
    const Q = L.q.map((_, qi) => resolve(L, qi)); // fixed for this visit so numbers do not change between steps
    const counts = () => Object.keys(right).length;
    function draw() {
      wrap.replaceChildren();
      wrap.append(h('span', { class: 'pill dark ' + L.subj }, pillOf(L)), h('h1', {}, L.t));
      if (S.done[id]) {
        wrap.append(h('div', { class: 'badge-done' }, `✅ ${doneLine(S.done[id])}${S.done[id].skipped ? '' : ' · ' + scoreText(S.done[id])}`));
        wrap.append(h('div', { class: 'known-row' },
          h('button', { class: 'btn alt small', onclick: () => { if (confirm('Mark this lesson as not done? The score and date are removed. Stars for solved questions are kept.')) { unmarkDone(L); save(); draw(); } } }, '↩ Mark as not done'),
          Object.keys(S.right[id] || {}).length ? h('button', { class: 'btn alt small', onclick: () => { if (confirm('Start this lesson over? The score, date and all stars for this lesson are removed.')) { startOver(L); Object.keys(right).forEach(k => delete right[k]); save(); draw(); } } }, '🔄 Start this lesson over') : ''));
      } else {
        wrap.append(h('div', { class: 'known-card' }, h('span', {}, 'Learned this before, somewhere else?'), h('button', { class: 'btn', onclick: () => { if (confirm('Mark this lesson as already known? It will count as done without any questions. You can undo this.')) { markKnown(L); S.pos = { id: (sb.lessons[L.n + 1] || L).id, step: 0 }; save(); go('#/map/' + L.subj); } } }, '✔ I already know this')));
      }
      wrap.append(h('div', { class: 'steps' }, steps.map((st, i) => h('button', { class: (i === cur ? 'on ' : '') + (seen.has(i) && i !== cur ? 'done' : ''), onclick: () => { cur = i; draw(); window.scrollTo(0, 0); } }, st[0]))));
      seen.add(cur); S.pos = { id, step: cur }; save();
      const body = h('section', { class: 'card' });
      const kind = steps[cur][1];
      if (kind === 'lb') {
        const qs = lookBackQs(L);
        body.append(h('h2', {}, '🔁 Look Back'));
        if (!qs.length) body.append(h('p', {}, 'This is one of the first lessons, so there is nothing to look back on yet. Let us begin!'));
        else {
          body.append(h('p', { class: 'muted' }, 'Before something new, remember something old.'));
          qs.forEach(x => body.append(h('div', { class: 'callout' }, h('b', {}, x.L.t + ': '), x.L.key), questionEl(x, { tag: `from ${x.ago} lesson${x.ago > 1 ? 's' : ''} ago` })));
        }
      } else if (kind === 'learn') {
        body.append(h('h2', {}, '📖 Today we learn: ' + L.sk), h('div', { class: 'key' }, '🎯 Goal: ' + L.goal));
        const pics = L.subj === 'math' ? (window.PICS || {})[L.n] || [] : [];
        L.learn.forEach((p, i) => {
          body.append(h('div', { class: 'learn-p', html: vis(p) }));
          pics.filter(x => x[0] === i).forEach(x => body.append(h('div', { html: vis(x[1]) })));
        });
        deepSections(L, body);
        body.append(h('div', { class: 'key' }, '🔑 Remember: ' + L.key), h('div', { class: 'callout do', html: L.do }), h('div', { class: 'callout oly', html: L.tip }),
          h('div', { class: 'callout small', html: '<b>Parent note:</b> ' + L.parent }));
        linkSection(L, body);
      } else if (kind === 'prac' || kind === 'chal') {
        const set = Q.map((q, qi) => ({ q, qi })).filter(x => (kind === 'prac' ? 'bc' : 'so').includes(x.q.l));
        body.append(h('h2', {}, kind === 'prac' ? '✏️ Practice' : '🚀 Challenge time'),
          h('p', { class: 'muted' }, kind === 'prac' ? (L.subj === 'math' ? 'Draw a picture if you get stuck.' : 'Read each question slowly, twice.') : 'These are harder. Think, try, and use hints if you need them.'));
        set.forEach(x => {
          const el = questionEl({ q: x.q, qi: x.qi, L }, { onRight: () => { right[x.qi] = true; markDay(); save(); } });
          if (right[x.qi]) el.append(h('div', { class: 'muted small' }, '⭐ You solved this one before.'));
          body.append(el);
        });
      } else {
        const total = L.q.length, got = counts(), nx = sb.lessons[L.n + 1];
        body.append(h('h2', {}, '🏁 Wrap-up'),
          h('p', { class: 'bigstars' }, '⭐'.repeat(Math.round((got / total) * 5)) + '☆'.repeat(5 - Math.round((got / total) * 5))),
          h('p', {}, `You solved ${got} of ${total} questions in this lesson.`),
          h('div', { class: 'key' }, '🔑 ' + L.key), h('p', {}, 'Tell a grown-up in your own words what you learned today.'),
          got < total ? h('p', { class: 'muted' }, 'Go back to Practice or Challenge to try the unsolved ones. You can also finish now and revisit them later on the Look Back page.') : '');
        body.append(h('button', { class: 'btn', onclick: () => { S.done[id] = { correct: counts(), total, when: (S.done[id] && S.done[id].when) || todayStr(), last: todayStr() }; S.pos = { id: nx ? nx.id : id, step: 0 }; markDay(); save(); go('#/done/' + id); } }, S.done[id] ? 'Save again' : '✅ Finish lesson'));
      }
      wrap.append(body);
      const nav = h('div', { class: 'ans' });
      if (cur > 0) nav.append(h('button', { class: 'btn alt', onclick: () => { cur--; draw(); window.scrollTo(0, 0); } }, '◀ Back'));
      if (cur < steps.length - 1) nav.append(h('button', { class: 'btn', onclick: () => { cur++; draw(); window.scrollTo(0, 0); } }, 'Next ▶'));
      wrap.append(nav);
    }
    draw(); app(wrap);
  }

  function viewDone(id) {
    setNav('home');
    const L = BYID[id]; if (!L) return go('#/');
    const nx = SUBJ[L.subj].lessons[L.n + 1], r = S.done[id];
    app(h('section', { class: 'card hero ' + L.subj }, h('h1', {}, '🎉 Lesson complete!'), h('p', {}, `${SUBJ[L.subj].icon} ${L.t}: ${r ? scoreText(r) : ''}`),
      nx ? h('p', {}, 'Next time: ' + nx.t) : h('p', {}, `🎓 That was the last ${SUBJ[L.subj].name} lesson!`), h('a', { class: 'btn light', href: '#/' }, 'Back home'), h('p', { class: 'small', style: 'margin-top:20px' }, 'Playing on another device? ', h('a', { href: '#/parent', style: 'color:#fff;text-decoration:underline' }, 'Get your progress password'))));
  }

  function viewReview(key) {
    setNav('review');
    const frag = h('div', {}, h('h1', {}, '🔁 Look Back'), subjTabs('review', key || 'all', true));
    const pool = ALL.filter(l => (!key || key === 'all' || l.subj === key) && (S.done[l.id] || (S.pos && S.pos.id === l.id)));
    const doneList = pool.filter(l => S.done[l.id]);
    frag.append(h('p', { class: 'muted' }, 'Revisit old ideas. Spaced repetition (seeing things again after some days) is how memory sticks.'));
    const quiz = h('section', { class: 'card' }, h('h2', {}, '🎲 Mixed review quiz'), h('p', {}, 'Six random questions from lessons you have already started.'));
    const qbox = h('div');
    quiz.append(h('button', { class: 'btn', onclick: () => { const qs = mixedQs(pool, 6); qbox.replaceChildren(...(qs.length ? qs.map(x => questionEl(x, { tag: 'from: ' + x.L.t })) : [h('p', { class: 'muted' }, 'Finish a lesson first, then come back.')])); } }, 'Start quiz'), qbox);
    frag.append(quiz);
    frag.append(h('section', { class: 'card' }, h('h2', {}, '📚 Recap cards'),
      doneList.length ? doneList.map(L => h('div', { class: 'recap', style: 'margin:8px 0' }, h('span', {}, h('b', {}, `${SUBJ[L.subj].icon} ${L.t}: `), L.key, h('br'), h('small', { class: 'muted' }, '✔ ' + doneLine(S.done[L.id]))), h('a', { class: 'btn alt small', href: '#/lesson/' + L.id }, 'Redo'))) : h('p', { class: 'muted' }, 'Finish a lesson and its recap card appears here.')));
    app(frag);
  }

  /* ---- progress passwords (js/password.js) ---- */
  const pwState = () => ({ name: S.name, plan: S.plan, lessons: ALL.map(L => { const r = S.done[L.id]; return r ? { status: r.skipped ? 2 : 1, correct: r.correct | 0, when: r.when } : { status: 0, correct: 0, when: null }; }) });
  function applyPassword(dec, merge) {
    const today = todayStr();
    ALL.forEach((L, i) => {
      const p = dec.lessons[i], cur = S.done[L.id];
      if (!merge) { delete S.done[L.id]; delete S.right[L.id]; }
      if (!p.status) return;
      if (merge && cur) { // keep real results over "known", the better score, and the earlier date
        if (cur.skipped && p.status === 1) delete S.done[L.id]; else { if (!cur.skipped && p.status === 1 && dec.detail && p.correct > cur.correct) { cur.correct = p.correct; S.right[L.id] = Object.fromEntries([...Array(p.correct).keys()].map(k => [k, true])); } if (p.when && (!cur.when || p.when < cur.when)) cur.when = p.when; return; }
      }
      const rec = { correct: dec.detail ? p.correct : 0, total: L.q.length, when: p.when || (dec.detail ? today : '') };
      if (p.status === 2) rec.skipped = true; else if (!dec.detail) rec.noscore = true;
      S.done[L.id] = rec;
      if (p.status === 1 && dec.detail) S.right[L.id] = Object.fromEntries([...Array(Math.min(p.correct, L.q.length)).keys()].map(k => [k, true]));
    });
    if (dec.name && (!merge || !S.name)) S.name = dec.name;
    if (!merge) S.plan = dec.plan;
    const firstOpen = SUBJECTS[0].lessons.find(l => !S.done[l.id]); S.pos = firstOpen ? { id: firstOpen.id, step: 0 } : null;
    save();
  }
  function passwordCard() {
    const out = h('textarea', { readonly: 'readonly', rows: 3, class: 'pw-box', 'aria-label': 'Your progress password', placeholder: 'Your password appears here' });
    const note = h('p', { class: 'muted small' });
    const show = detail => { out.value = PW.encode(pwState(), detail); note.textContent = `${out.value.replace(/-/g, '').length} characters. Write it down or copy it. Anyone with this password can load this progress, and it never expires.`; };
    const copy = h('button', { class: 'btn alt', onclick: () => { if (!out.value) return; out.select(); try { navigator.clipboard.writeText(out.value); } catch (e) { document.execCommand && document.execCommand('copy'); } note.textContent = 'Copied.'; } }, 'Copy');
    const inp = h('textarea', { rows: 3, class: 'pw-box', 'aria-label': 'Enter a password', placeholder: 'Type or paste a password (spaces, dashes and capitals do not matter)' });
    const msg = h('p', { class: 'fb' });
    const load = merge => {
      const dec = PW.decode(inp.value, ALL.length);
      if (dec.error) { msg.className = 'fb no'; msg.textContent = dec.error; return; }
      const done = dec.lessons.filter(l => l.status === 1).length, known = dec.lessons.filter(l => l.status === 2).length;
      const who = dec.name ? ` for ${dec.name}` : '';
      if (!confirm(`This password${who} has ${done} finished and ${known} marked-as-known lessons${dec.detail ? ', with scores and dates' : ' (no scores or dates)'}.\n\n${merge ? 'Merge it with the progress on this device?' : 'Replace the progress on this device with it?'}`)) return;
      applyPassword(dec, merge); alert('Progress loaded. Open Today or the Map to see it.'); route();
    };
    return h('section', { class: 'card' }, h('h2', {}, '🔑 Progress password'),
      h('p', { class: 'muted' }, 'Like an old video game: the password holds your progress. Get one here, then type it on another device or browser to carry on where you left off. No account or internet is needed.'),
      h('div', { class: 'ans' }, h('button', { class: 'btn', onclick: () => show(false) }, 'Short password (progress only)'), h('button', { class: 'btn', onclick: () => show(true) }, 'Full password (with scores and dates)')),
      out, h('div', { class: 'ans' }, copy), note,
      h('h3', { style: 'margin-top:28px' }, 'Load a password'), inp,
      h('div', { class: 'ans' }, h('button', { class: 'btn', onclick: () => load(false) }, 'Load (replace this device)'), h('button', { class: 'btn alt', onclick: () => load(true) }, 'Merge with this device')), msg,
      h('p', { class: 'muted small' }, 'A password carries which lessons are done or marked known, the child\'s first name (letters only, up to 8), the daily plan, and, in the full version, scores and completion dates. It does not carry the streak or half-finished lessons. Save it after each week.'));
  }

  function viewParent() {
    setNav('parent');
    const frag = h('div', {}, h('h1', {}, '👨‍👩‍👧 Parent corner'));
    const nm = h('input', { type: 'text', value: S.name, placeholder: 'Child\'s name', style: 'font:inherit;padding:8px 12px;border-radius:10px;border:2px solid var(--line)' });
    const pl = h('select', { style: 'font:inherit;padding:8px 12px;border-radius:10px;border:2px solid var(--line);max-width:100%' },
      [['rotate', 'Maths every day + English (Mon, Wed, Fri) or Science (Tue, Thu)'], ['all', 'All three subjects every day'], ['math', 'Maths every day, others optional']].map(([v, t]) => h('option', Object.assign({ value: v }, S.plan === v ? { selected: 'selected' } : {}), t)));
    frag.append(h('section', { class: 'card' }, h('h2', {}, 'Setup'), h('div', { class: 'ans' }, nm, h('button', { class: 'btn', onclick: () => { S.name = nm.value.trim(); save(); alert('Saved'); } }, 'Save name')),
      h('h3', { style: 'margin-top:24px' }, 'Daily plan'), h('div', { class: 'ans' }, pl, h('button', { class: 'btn', onclick: () => { S.plan = pl.value; save(); alert('Saved'); } }, 'Save plan')),
      h('p', { class: 'muted small' }, 'Each subject moves forward one lesson at a time, so a subject that is studied 3 times a week takes about 13 weeks to finish.')));
    frag.append(h('section', { class: 'card' }, h('h2', {}, 'How the curriculum works'),
      h('ul', {}, h('li', {}, h('b', {}, 'Maths: '), 'Singapore-style concrete, pictorial, abstract (CPA) with bar models, number bonds and ten-frames. Goes beyond P1 into 3-digit numbers, multiplication, fractions of sets and Venn diagrams, plus olympiad tools (parity, Gauss pairing, working backwards, pigeonhole).'),
        h('li', {}, h('b', {}, 'English: '), 'phonics, sight words, sentences, grammar (nouns, verbs, tenses, pronouns), reading comprehension, vocabulary, and olympiad-style analogies, spelling puzzles and idioms.'),
        h('li', {}, h('b', {}, 'Science: '), 'living things, plants, body, materials, forces, Earth and sky, the environment, and fair-test thinking. Beyond school level at this age, and each lesson has a safe hands-on activity.'),
        h('li', {}, h('b', {}, 'Rhythm: '), 'About 25 minutes per subject. Progress is lesson-based, so missed days do not skip content.'),
        h('li', {}, h('b', {}, 'Coach tips: '), 'Ask "How do you know?", let them draw, praise effort, and read questions aloud together for English and Science.'),
        h('li', {}, h('b', {}, 'Levels: '), '🌱 Warm-up, ⭐ Core, 🚀 Stretch, 🏆 Olympiad.'))));
    frag.append(h('section', { class: 'card' }, h('h2', {}, 'A good evening (about 25 minutes per subject)'),
      h('ol', {}, h('li', {}, '5 min: Look Back questions from earlier lessons'), h('li', {}, '8 min: Learn the new idea with the pictures and do the hands-on activity'),
        h('li', {}, '8 min: Practice (warm-up and core questions)'), h('li', {}, '4 min: Challenge (stretch and olympiad puzzles). Wrong answers are fine, thinking is the point.'))));
    frag.append(passwordCard());
    const skipSel = h('select', { style: 'font:inherit;padding:8px 12px;border-radius:10px;border:2px solid var(--line);max-width:100%' }, SUBJECTS.map(sb => h('option', { value: sb.key }, `${sb.icon} ${sb.name}`)));
    const weekSel = h('select', { style: 'font:inherit;padding:8px 12px;border-radius:10px;border:2px solid var(--line)' }, [1, 2, 3, 4, 5, 6, 7, 8].map(n => h('option', { value: n }, `Weeks 1 to ${n}`)));
    frag.append(h('section', { class: 'card' }, h('h2', {}, 'Already learned some of this, or marked by mistake?'),
      h('p', { class: 'muted' }, 'Mark lessons as done without questions when your child has already learned them elsewhere. Lessons already completed here keep their real scores. Marked lessons still appear in Look Back so old ideas are refreshed, and you can undo any time from the map.'),
      h('div', { class: 'ans' }, skipSel, weekSel, h('button', { class: 'btn', onclick: () => {
        const sb = SUBJ[skipSel.value], list = lessonsUpTo(sb, +weekSel.value).filter(l => !S.done[l.id]);
        if (!list.length) return alert('Everything in that range is already done.');
        if (confirm(`Mark ${list.length} ${sb.name} lesson${list.length > 1 ? 's' : ''} (weeks 1 to ${weekSel.value}) as already known?`)) { list.forEach(markKnown); const nx = sb.lessons.find(l => !S.done[l.id]); if (nx) S.pos = { id: nx.id, step: 0 }; save(); alert(`Done. ${list.length} lesson${list.length > 1 ? 's' : ''} marked.`); route(); }
      } }, 'Mark as known'), h('button', { class: 'btn alt', onclick: () => {
        const sb = SUBJ[skipSel.value], list = lessonsUpTo(sb, +weekSel.value).filter(l => S.done[l.id]);
        if (!list.length) return alert('Nothing in that range is marked done.');
        if (confirm(`Mark ${list.length} ${sb.name} lesson${list.length > 1 ? 's' : ''} (weeks 1 to ${weekSel.value}) as not done? Scores and dates for them are removed. Stars for solved questions are kept.`)) { list.forEach(unmarkDone); save(); alert(`Done. ${list.length} lesson${list.length > 1 ? 's' : ''} reset.`); route(); }
      } }, '↩ Mark as not done'))));
    SUBJECTS.forEach(sb => {
      const t = h('table', {}, h('tr', {}, h('th', {}, 'Lesson'), h('th', {}, 'Score'), h('th', {}, 'Completed'), h('th', {}, 'Answers')));
      sb.lessons.forEach(L => t.append(h('tr', {}, h('td', {}, `W${L.week}·${DAYS[L.day - 1]} ${L.t}`), h('td', {}, S.done[L.id] ? scoreShort(S.done[L.id]) : '-'), h('td', {}, S.done[L.id] ? fmtDate(S.done[L.id].when) : '-'), h('td', {}, h('a', { href: '#/key/' + L.id }, 'Key')))));
      frag.append(h('section', { class: 'card' }, h('h2', {}, `${sb.icon} ${sb.name}: progress and answer keys`), t));
    });
    const io = h('textarea', { rows: 3, style: 'width:100%', placeholder: 'Paste saved progress here to restore' });
    frag.append(h('section', { class: 'card' }, h('h2', {}, 'Backup / new device'),
      h('button', { class: 'btn alt', onclick: () => { io.value = JSON.stringify(S); io.select(); } }, 'Show progress code'), ' ',
      h('button', { class: 'btn alt', onclick: () => { try { const o = JSON.parse(io.value); if (!o.done) throw 0; S = o; load2(); save(); alert('Restored'); go('#/'); } catch (e) { alert('That code was not valid.'); } } }, 'Restore from code'), io,
      h('p', {}, h('button', { class: 'btn', style: 'background:var(--bad)', onclick: () => { if (confirm('Erase all progress?')) { S = {}; load2(); save(); go('#/'); } } }, 'Reset all progress'))));
    app(frag);
  }
  function load2() { S.done = S.done || {}; S.right = S.right || {}; S.days = S.days || []; S.name = S.name || ''; S.plan = S.plan || 'rotate'; if (S.pos && S.pos.id == null && S.pos.n != null) S.pos = { id: String(S.pos.n), step: S.pos.step | 0 }; }

  function viewKey(id) {
    setNav('parent');
    const L = BYID[id]; if (!L) return go('#/parent');
    app(h('div', {}, h('a', { href: '#/parent' }, '◀ Parent corner'), h('h1', {}, `Answer key: ${L.t}`),
      h('section', { class: 'card', html: '<p>' + L.tip + '</p>' }),
      h('section', { class: 'card' }, L.subj === 'math' ? h('p', { class: 'muted small' }, 'Questions marked "random" get new numbers every time. The answer and working are shown to your child after they answer; below is one example.') : '',
        L.q.map((_, i) => { const q = resolve(L, i); return h('div', { style: 'margin:14px 0' }, h('b', {}, `${i + 1}. ${LV[q.l][1]} `), q.gen ? h('span', { class: 'pill dark' }, 'random') : '', ' ', h('span', { style: 'white-space:pre-line' }, q.q), h('div', {}, h('b', {}, 'Answer: '), answerText(q)), q.s ? h('div', { class: 'muted small' }, q.s) : ''); }))));
  }

  /* ---------- router ---------- */
  function app(node) { $app.replaceChildren(node); window.scrollTo(0, 0); }
  function go(hash) { if (location.hash === hash) route(); else location.hash = hash; }
  function route() {
    const p = (location.hash || '#/').slice(2).split('/');
    ({ '': viewHome, map: () => viewMap(p[1]), lesson: () => viewLesson(p[1]), done: () => viewDone(p[1]), review: () => viewReview(p[1]), parent: viewParent, key: () => viewKey(p[1]) }[p[0]] || viewHome)();
  }
  window.addEventListener('hashchange', route);
  route();
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
})();
