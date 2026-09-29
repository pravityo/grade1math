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
  const doneLine = r => `Completed ${fmtDate(r.when)}`;
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
  function tile(L) {
    const done = S.done[L.id], nx = nextIdx(SUBJ[L.subj]) === L.n;
    return h('a', { class: 'tile ' + (done ? 'done ' : '') + (nx ? 'next' : ''), href: '#/lesson/' + L.id },
      h('small', {}, `Week ${L.week} · ${DAYS[L.day - 1]}`), h('b', {}, (done ? '✅ ' : nx ? '▶ ' : '') + L.t),
      done ? h('small', {}, `${done.correct}/${done.total} correct`) : '',
      done && done.when ? h('span', { class: 'stamp' }, '✔ ' + doneLine(done)) : '');
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
  function subjCard(sb, primary) {
    const n = nextIdx(sb), L = sb.lessons[n];
    if (!L) return h('section', { class: 'card hero ' + sb.key }, h('h2', {}, `${sb.icon} ${sb.name}`), h('p', {}, `🎓 All ${sb.lessons.length} lessons done!`), h('a', { class: 'btn light', href: '#/map/' + sb.key }, 'See the map'));
    const cont = S.pos && S.pos.id === L.id && S.pos.step > 0;
    return h('section', { class: 'card hero ' + sb.key + (primary ? '' : ' optional') },
      h('span', { class: 'pill' }, `${sb.icon} ${sb.name} · Week ${L.week} · ${DAYS[L.day - 1]}${primary ? '' : ' · optional'}`),
      h('h2', {}, L.t), h('p', {}, L.goal),
      h('a', { class: 'btn light', href: '#/lesson/' + L.id }, cont ? '▶ Continue where you stopped' : primary ? '▶ Start today\'s lesson' : '▶ Start this lesson'));
  }

  function viewHome() {
    setNav('home');
    const frag = h('div'), plan = todayPlan();
    frag.append(h('h1', {}, (S.name ? `Hi ${S.name}! ` : 'Hi there! ') + (plan.weekend ? '🌴 Weekend' : '📅 Today\'s plan')));
    if (plan.weekend) frag.append(h('p', { class: 'muted' }, 'Rest is good. If you feel like it, pick anything below or do a Look Back.'));
    else frag.append(h('p', { class: 'muted' }, 'About 25 minutes each. Do the first card, then the second if there is time.'));
    plan.main.forEach(k => frag.append(subjCard(SUBJ[k], true)));
    if (plan.optional.length) {
      frag.append(h('h2', { style: 'margin-top:36px' }, plan.main.length ? 'Extra, if you want more' : 'Pick a subject'));
      plan.optional.forEach(k => frag.append(subjCard(SUBJ[k], false)));
    }
    frag.append(h('div', { class: 'stats' },
      h('div', { class: 'stat' }, h('b', {}, `${doneCount()}/${ALL.length}`), 'lessons done'),
      h('div', { class: 'stat' }, h('b', {}, '⭐ ' + starCount()), 'stars earned'),
      h('div', { class: 'stat' }, h('b', {}, '🔥 ' + streak()), 'day streak')));
    frag.append(h('div', { class: 'subj-progress' }, SUBJECTS.map(sb => h('div', {}, h('span', {}, `${sb.icon} ${sb.name}`), h('div', { class: 'meter' }, h('i', { class: sb.key, style: `width:${doneCount(sb) / sb.lessons.length * 100}%` })), h('small', { class: 'muted' }, `${doneCount(sb)}/${sb.lessons.length}`)))));
    // look back: one or two reminders from each subject being studied today
    const rc = h('section', { class: 'card' }, h('h2', {}, '🔁 Look Back'));
    const picks = [];
    (plan.main.length ? plan.main : SUBJECTS.map(x => x.key)).forEach(k => { const sb = SUBJ[k], L = sb.lessons[Math.min(nextIdx(sb), sb.lessons.length - 1)]; if (doneCount(sb)) picks.push(...lookBackQs(L).slice(0, 2)); });
    if (!picks.length) rc.append(h('p', { class: 'muted' }, 'After your first lesson, old topics will show up here so they stay fresh.'));
    else {
      rc.append(h('p', { class: 'muted' }, 'Quick reminders from earlier lessons:'));
      picks.forEach(x => rc.append(h('div', { class: 'recap' }, h('span', {}, `📌 ${SUBJ[x.L.subj].icon} ${x.L.t}: ${x.L.key}`), h('a', { class: 'btn alt small', href: '#/lesson/' + x.L.id }, 'Open'))));
      rc.append(h('p', {}, h('a', { class: 'btn', href: '#/review' }, 'Try a mixed review quiz')));
    }
    frag.append(rc);
    const recent = ALL.filter(l => S.done[l.id]).sort((a, b) => (S.done[b.id].when || '').localeCompare(S.done[a.id].when || '') || b.n - a.n).slice(0, 6);
    if (recent.length) frag.append(h('section', { class: 'card' }, h('h2', {}, '✅ Completed lessons'),
      h('ul', { class: 'recent', style: 'list-style:none;padding:0' }, recent.map(l => h('li', {}, h('a', { href: '#/lesson/' + l.id }, `${SUBJ[l.subj].icon} ${l.t}`), h('span', { class: 'muted' }, `${fmtDate(S.done[l.id].when)} · ${S.done[l.id].correct}/${S.done[l.id].total}`))))));
    frag.append(h('section', { class: 'card' }, h('h2', {}, '🕰️ Evening routine (about 25 minutes per subject)'),
      h('ol', {}, h('li', {}, '5 min: Look Back questions from earlier lessons'), h('li', {}, '8 min: Learn the new idea with the pictures and do the hands-on activity'),
        h('li', {}, '8 min: Practice (warm-up and core questions)'), h('li', {}, '4 min: Challenge (stretch and olympiad puzzles). Wrong is fine. Thinking is the point!'))));
    app(frag);
  }

  function viewMap(key) {
    setNav('map');
    const sb = SUBJ[key] || SUBJECTS[0];
    const frag = h('div', {}, h('h1', {}, '🗺️ Learning Map'), subjTabs('map', sb.key), h('p', { class: 'muted' }, `${sb.blurb} 8 weeks, 5 lessons a week. Tap any lesson to open it.`));
    sb.weeks.forEach(w => {
      const wl = sb.lessons.filter(l => l.week === w.week), wd = wl.filter(l => S.done[l.id]);
      const last = wd.map(l => S.done[l.id].when).sort().pop();
      frag.append(h('div', { class: 'weekh' }, h('h2', {}, `Week ${w.week}: ${w.theme}`),
        h('span', { class: 'wk' + (wd.length === wl.length ? ' ok' : '') }, wd.length === wl.length ? `✅ Week complete ${fmtDate(last)}` : `${wd.length}/${wl.length} done`)), h('p', { class: 'muted' }, w.blurb));
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
      if (S.done[id]) wrap.append(h('div', { class: 'badge-done' }, `✅ ${doneLine(S.done[id])} · ${S.done[id].correct}/${S.done[id].total} correct`));
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
    app(h('section', { class: 'card hero ' + L.subj }, h('h1', {}, '🎉 Lesson complete!'), h('p', {}, `${SUBJ[L.subj].icon} ${L.t}: ${r ? r.correct + '/' + r.total : ''} correct`),
      nx ? h('p', {}, 'Next time: ' + nx.t) : h('p', {}, `🎓 That was the last ${SUBJ[L.subj].name} lesson!`), h('a', { class: 'btn light', href: '#/' }, 'Back home')));
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
    SUBJECTS.forEach(sb => {
      const t = h('table', {}, h('tr', {}, h('th', {}, 'Lesson'), h('th', {}, 'Score'), h('th', {}, 'Completed'), h('th', {}, 'Answers')));
      sb.lessons.forEach(L => t.append(h('tr', {}, h('td', {}, `W${L.week}·${DAYS[L.day - 1]} ${L.t}`), h('td', {}, S.done[L.id] ? `${S.done[L.id].correct}/${S.done[L.id].total}` : '-'), h('td', {}, S.done[L.id] ? fmtDate(S.done[L.id].when) : '-'), h('td', {}, h('a', { href: '#/key/' + L.id }, 'Key')))));
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
