(function () {
  'use strict';
  const $app = document.getElementById('app');
  const KEY = 'grade1math.v1';
  const LV = { b: ['Warm-up', '🌱'], c: ['Core', '⭐'], s: ['Stretch', '🚀'], o: ['Olympiad', '🏆'] };

  /* ---------- data ---------- */
  const LESSONS = [];
  window.CURRICULUM.forEach(w => w.lessons.forEach((l, d) => LESSONS.push(Object.assign({ n: LESSONS.length, week: w.week, day: d + 1, theme: w.theme }, l))));
  const WEEKS = window.CURRICULUM;
  /* Questions wired to a generator (js/data/gens.js) get fresh numbers each time they are asked. */
  function resolve(L, qi) {
    const base = L.q[qi], name = (window.GENS || {})[L.n + ':' + qi], gen = name && window.GEN[name];
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
    S.done = S.done || {}; S.right = S.right || {}; S.days = S.days || []; S.name = S.name || '';
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
  const nextIdx = () => { const i = LESSONS.findIndex(l => !S.done[l.n]); return i < 0 ? LESSONS.length : i; };
  const doneCount = () => Object.keys(S.done).length;
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
  function lookBackQs(n) {
    const out = [];
    [1, 3, 7, 14].forEach((k, i) => {
      const L = LESSONS[n - k]; if (!L) return;
      const pool = L.q.map((q, qi) => ({ q, qi })).filter(x => (i < 3 ? 'bc' : 'so').includes(x.q.l));
      const pick = pool[(n + k) % pool.length];
      out.push({ L, qi: pick.qi, q: resolve(L, pick.qi), ago: k });
    });
    return out;
  }
  function mixedQs(upTo, count) {
    const all = [];
    LESSONS.slice(0, Math.max(upTo, 1)).forEach(L => L.q.forEach((q, qi) => all.push({ L, qi, q: resolve(L, qi) })));
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
    const qp = q.gen ? q.p : (window.QPICS || {})[(item.n != null ? item.n : item.L && item.L.n) + ':' + item.qi];
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
      q.o.forEach(o => wrap.append(h('button', { onclick: e => { if (solved) return; submit(o); e.target.classList.add(solved && box.classList.contains('right') ? 'good' : 'picked'); } }, o)));
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
  function tile(L) {
    const done = S.done[L.n], nx = nextIdx() === L.n;
    return h('a', { class: 'tile ' + (done ? 'done ' : '') + (nx ? 'next' : ''), href: '#/lesson/' + L.n },
      h('small', {}, `Week ${L.week} · ${DAYS[L.day - 1]}`), h('b', {}, (done ? '✅ ' : nx ? '▶ ' : '') + L.t),
      done ? h('small', {}, `${done.correct}/${done.total} correct`) : '',
      done && done.when ? h('span', { class: 'stamp' }, '✔ ' + doneLine(done)) : '');
  }

  function viewHome() {
    setNav('home');
    const n = nextIdx(), L = LESSONS[n], frag = h('div');
    const hi = S.name ? `Hi ${S.name}! ` : 'Hi there! ';
    if (!L) {
      frag.append(h('section', { class: 'card hero' }, h('h1', {}, '🎓 You finished all 40 lessons!'), h('p', {}, 'Amazing. Use Look Back to keep everything sharp.'), h('a', { class: 'btn light', href: '#/review' }, 'Go to Look Back')));
    } else {
      frag.append(h('section', { class: 'card hero' },
        h('span', { class: 'pill' }, `Week ${L.week} · ${DAYS[L.day - 1]} · ${L.theme}`),
        h('h1', {}, hi + 'Today: ' + L.t),
        h('p', {}, L.goal),
        isWeekend() ? h('p', {}, '🌴 It is the weekend. Rest is good, but you can still start the next lesson or do a Look Back.') : '',
        h('a', { class: 'btn light', href: '#/lesson/' + n }, S.pos && S.pos.n === n && S.pos.step > 0 ? '▶ Continue where you stopped' : '▶ Start today\'s lesson')));
    }
    frag.append(h('div', { class: 'stats' },
      h('div', { class: 'stat' }, h('b', {}, `${doneCount()}/${LESSONS.length}`), 'lessons done'),
      h('div', { class: 'stat' }, h('b', {}, '⭐ ' + starCount()), 'stars earned'),
      h('div', { class: 'stat' }, h('b', {}, '🔥 ' + streak()), 'day streak')));
    // look back
    const lb = L ? lookBackQs(n) : [];
    const rc = h('section', { class: 'card' }, h('h2', {}, '🔁 Look Back'));
    if (!doneCount()) rc.append(h('p', { class: 'muted' }, 'After your first lesson, old topics will show up here so they stay fresh.'));
    else {
      rc.append(h('p', { class: 'muted' }, 'Quick reminders from earlier lessons:'));
      lb.slice(0, 3).forEach(x => rc.append(h('div', { class: 'recap' }, h('span', {}, `📌 ${x.L.t}: ${x.L.key}`), h('a', { class: 'btn alt small', href: '#/lesson/' + x.L.n }, 'Open'))));
      rc.append(h('p', {}, h('a', { class: 'btn', href: '#/review' }, 'Try a mixed review quiz')));
    }
    frag.append(rc);
    const recent = LESSONS.filter(l => S.done[l.n]).sort((a, b) => (S.done[b.n].when || '').localeCompare(S.done[a.n].when || '') || b.n - a.n).slice(0, 5);
    if (recent.length) frag.append(h('section', { class: 'card' }, h('h2', {}, '✅ Completed lessons'),
      h('ul', { class: 'recent', style: 'list-style:none;padding:0' }, recent.map(l => h('li', {}, h('a', { href: '#/lesson/' + l.n }, l.t), h('span', { class: 'muted' }, `${fmtDate(S.done[l.n].when)} · ${S.done[l.n].correct}/${S.done[l.n].total}`))))));
    frag.append(h('section', { class: 'card' }, h('h2', {}, '🕰️ Evening routine (about 30 minutes)'),
      h('ol', {}, h('li', {}, '5 min: Look Back questions from earlier lessons'), h('li', {}, '8 min: Learn the new idea with the pictures and do the hands-on activity'),
        h('li', {}, '12 min: Practice (warm-up and core questions)'), h('li', {}, '5 min: Challenge (stretch and olympiad puzzles). Wrong is fine. Thinking is the point!'))));
    app(frag);
  }

  function viewMap() {
    setNav('map');
    const frag = h('div', {}, h('h1', {}, '🗺️ Learning Map'), h('p', { class: 'muted' }, '8 weeks, 5 evenings a week. Tap any lesson to open it.'));
    WEEKS.forEach(w => {
      const wl = LESSONS.filter(l => l.week === w.week), wd = wl.filter(l => S.done[l.n]);
      const last = wd.map(l => S.done[l.n].when).sort().pop();
      frag.append(h('div', { class: 'weekh' }, h('h2', {}, `Week ${w.week}: ${w.theme}`),
        h('span', { class: 'wk' + (wd.length === wl.length ? ' ok' : '') }, wd.length === wl.length ? `✅ Week complete ${fmtDate(last)}` : `${wd.length}/${wl.length} done`)), h('p', { class: 'muted' }, w.blurb));
      frag.append(h('div', { class: 'grid' }, LESSONS.filter(l => l.week === w.week).map(tile)));
    });
    app(frag);
  }

  function viewLesson(n) {
    setNav('home');
    const L = LESSONS[n]; if (!L) return go('#/');
    const steps = [['🔁 Look Back', 'lb'], ['📖 Learn', 'learn'], ['✏️ Practice', 'prac'], ['🚀 Challenge', 'chal'], ['🏁 Wrap-up', 'wrap']];
    let cur = S.pos && S.pos.n === n ? Math.min(S.pos.step | 0, steps.length - 1) : 0; const seen = new Set();
    const wrap = h('div');
    const right = S.right[n] = S.right[n] || {};
    const Q = L.q.map((_, qi) => resolve(L, qi)); // fixed for this visit so numbers do not change between steps
    const counts = () => Object.keys(right).length;
    function draw() {
      wrap.replaceChildren();
      wrap.append(h('span', { class: 'pill dark' }, `Week ${L.week} · ${DAYS[L.day - 1]} · ${L.theme}`), h('h1', {}, L.t));
      if (S.done[n]) wrap.append(h('div', { class: 'badge-done' }, `✅ ${doneLine(S.done[n])} · ${S.done[n].correct}/${S.done[n].total} correct`));
      wrap.append(h('div', { class: 'steps' }, steps.map((s, i) => h('button', { class: (i === cur ? 'on ' : '') + (seen.has(i) && i !== cur ? 'done' : ''), onclick: () => { cur = i; draw(); window.scrollTo(0, 0); } }, s[0]))));
      seen.add(cur); S.pos = { n, step: cur }; save();
      const body = h('section', { class: 'card' });
      const kind = steps[cur][1];
      if (kind === 'lb') {
        const qs = lookBackQs(n);
        body.append(h('h2', {}, '🔁 Look Back'));
        if (!qs.length) body.append(h('p', {}, 'This is the very first lesson, so there is nothing to look back on yet. Let us begin!'));
        else {
          body.append(h('p', { class: 'muted' }, 'Before something new, remember something old.'));
          qs.forEach(x => body.append(h('div', { class: 'callout' }, h('b', {}, x.L.t + ': '), x.L.key), questionEl(x, { tag: `from ${x.ago} lesson${x.ago > 1 ? 's' : ''} ago` })));
        }
      } else if (kind === 'learn') {
        body.append(h('h2', {}, '📖 Today we learn: ' + L.sk), h('div', { class: 'key' }, '🎯 Goal: ' + L.goal));
        const pics = (window.PICS || {})[n] || [];
        L.learn.forEach((p, i) => {
          body.append(h('div', { class: 'learn-p', html: vis(p) }));
          pics.filter(x => x[0] === i).forEach(x => body.append(h('div', { html: vis(x[1]) })));
        });
        body.append(h('div', { class: 'key' }, '🔑 Remember: ' + L.key), h('div', { class: 'callout do', html: L.do }), h('div', { class: 'callout oly', html: L.tip }),
          h('div', { class: 'callout small', html: '<b>Parent note:</b> ' + L.parent }));
      } else if (kind === 'prac' || kind === 'chal') {
        const set = Q.map((q, qi) => ({ q, qi })).filter(x => (kind === 'prac' ? 'bc' : 'so').includes(x.q.l));
        body.append(h('h2', {}, kind === 'prac' ? '✏️ Practice' : '🚀 Challenge time'),
          h('p', { class: 'muted' }, kind === 'prac' ? 'Draw a picture if you get stuck.' : 'These are harder. Think, draw, try. Use hints if you need them.'));
        set.forEach(x => {
          const el = questionEl({ q: x.q, qi: x.qi, n }, { onRight: () => { right[x.qi] = true; markDay(); save(); } });
          if (right[x.qi]) el.append(h('div', { class: 'muted small' }, '⭐ You solved this one before.'));
          body.append(el);
        });
      } else {
        const total = L.q.length, got = counts();
        body.append(h('h2', {}, '🏁 Wrap-up'),
          h('p', { class: 'bigstars' }, '⭐'.repeat(Math.round((got / total) * 5)) + '☆'.repeat(5 - Math.round((got / total) * 5))),
          h('p', {}, `You solved ${got} of ${total} questions in this lesson.`),
          h('div', { class: 'key' }, '🔑 ' + L.key), h('p', {}, 'Tell a grown-up in your own words what you learned today.'),
          got < total ? h('p', { class: 'muted' }, 'Go back to Practice or Challenge to try the unsolved ones. You can also finish now and revisit them later on the Look Back page.') : '');
        body.append(h('button', { class: 'btn', onclick: () => { S.done[n] = { correct: counts(), total, when: (S.done[n] && S.done[n].when) || todayStr(), last: todayStr() }; S.pos = { n: n + 1, step: 0 }; markDay(); save(); go(n + 1 < LESSONS.length ? '#/done/' + n : '#/'); } }, S.done[n] ? 'Save again' : '✅ Finish lesson'));
      }
      wrap.append(body);
      const nav = h('div', { class: 'ans' });
      if (cur > 0) nav.append(h('button', { class: 'btn alt', onclick: () => { cur--; draw(); window.scrollTo(0, 0); } }, '◀ Back'));
      if (cur < steps.length - 1) nav.append(h('button', { class: 'btn', onclick: () => { cur++; draw(); window.scrollTo(0, 0); } }, 'Next ▶'));
      wrap.append(nav);
    }
    draw(); app(wrap);
  }

  function viewDone(n) {
    setNav('home');
    const L = LESSONS[n], nx = LESSONS[n + 1], r = S.done[n];
    app(h('section', { class: 'card hero' }, h('h1', {}, '🎉 Lesson complete!'), h('p', {}, `${L ? L.t : ''}: ${r ? r.correct + '/' + r.total : ''} correct`),
      nx ? h('p', {}, 'Next time: ' + nx.t) : '', h('a', { class: 'btn light', href: '#/' }, 'Back home')));
  }

  function viewReview() {
    setNav('review');
    const upTo = Math.max(nextIdx(), 1), frag = h('div', {}, h('h1', {}, '🔁 Look Back'));
    const doneList = LESSONS.filter(l => S.done[l.n]);
    frag.append(h('p', { class: 'muted' }, 'Revisit old ideas. Spaced repetition (seeing things again after some days) is how memory sticks.'));
    const quiz = h('section', { class: 'card' }, h('h2', {}, '🎲 Mixed review quiz'), h('p', {}, 'Six random questions from lessons you have already started.'));
    const qbox = h('div');
    quiz.append(h('button', { class: 'btn', onclick: () => { qbox.replaceChildren(...mixedQs(upTo, 6).map(x => questionEl(x, { tag: 'from: ' + x.L.t }))); } }, 'Start quiz'), qbox);
    frag.append(quiz);
    frag.append(h('section', { class: 'card' }, h('h2', {}, '📚 Recap cards'),
      doneList.length ? doneList.map(L => h('div', { class: 'recap', style: 'margin:8px 0' }, h('span', {}, h('b', {}, `${L.t}: `), L.key, h('br'), h('small', { class: 'muted' }, '✔ ' + doneLine(S.done[L.n]))), h('a', { class: 'btn alt small', href: '#/lesson/' + L.n }, 'Redo'))) : h('p', { class: 'muted' }, 'Finish a lesson and its recap card appears here.')));
    app(frag);
  }

  function viewParent() {
    setNav('parent');
    const frag = h('div', {}, h('h1', {}, '👨‍👩‍👧 Parent corner'));
    const nm = h('input', { type: 'text', value: S.name, placeholder: 'Child\'s name', style: 'font:inherit;padding:8px 12px;border-radius:10px;border:2px solid var(--line)' });
    frag.append(h('section', { class: 'card' }, h('h2', {}, 'Setup'), h('div', { class: 'ans' }, nm, h('button', { class: 'btn', onclick: () => { S.name = nm.value.trim(); save(); alert('Saved'); } }, 'Save name'))));
    frag.append(h('section', { class: 'card' }, h('h2', {}, 'How this curriculum works'),
      h('ul', {}, h('li', {}, h('b', {}, 'Method: '), 'Singapore-style concrete, pictorial, abstract (CPA). Every lesson has a hands-on task, a picture (bar model, number bond, ten-frame), then symbols.'),
        h('li', {}, h('b', {}, 'Beyond school level: '), 'reaches 3-digit numbers, intro multiplication/division, fractions of sets, and Venn diagrams, usually taught in P2 or P3.'),
        h('li', {}, h('b', {}, 'Olympiad sprinkles: '), 'parity, Gauss pairing, fence posts, working backwards, pigeonhole, combinations. Each lesson ends with a 🏆 puzzle.'),
        h('li', {}, h('b', {}, 'Rhythm: '), 'Mon to Fri, 25-30 minutes. Progress is lesson-based, so missed days do not skip content.'),
        h('li', {}, h('b', {}, 'Coach tips: '), 'Ask "How do you know?", let them draw, praise effort, and never rush the ten-frame or bar model.'),
        h('li', {}, h('b', {}, 'Levels: '), '🌱 Warm-up, ⭐ Core, 🚀 Stretch, 🏆 Olympiad.'))));
    const t = h('table', {}, h('tr', {}, h('th', {}, 'Lesson'), h('th', {}, 'Score'), h('th', {}, 'Completed'), h('th', {}, 'Answers')));
    LESSONS.forEach(L => t.append(h('tr', {}, h('td', {}, `W${L.week}·${DAYS[L.day - 1]} ${L.t}`), h('td', {}, S.done[L.n] ? `${S.done[L.n].correct}/${S.done[L.n].total}` : '-'), h('td', {}, S.done[L.n] ? fmtDate(S.done[L.n].when) : '-'), h('td', {}, h('a', { href: '#/key/' + L.n }, 'Key')))));
    frag.append(h('section', { class: 'card' }, h('h2', {}, 'Progress and answer keys'), t));
    const io = h('textarea', { rows: 3, style: 'width:100%', placeholder: 'Paste saved progress here to restore' });
    frag.append(h('section', { class: 'card' }, h('h2', {}, 'Backup / new device'),
      h('button', { class: 'btn alt', onclick: () => { io.value = JSON.stringify(S); io.select(); } }, 'Show progress code'), ' ',
      h('button', { class: 'btn alt', onclick: () => { try { const o = JSON.parse(io.value); if (!o.done) throw 0; S = o; load2(); save(); alert('Restored'); go('#/'); } catch (e) { alert('That code was not valid.'); } } }, 'Restore from code'), io,
      h('p', {}, h('button', { class: 'btn', style: 'background:var(--bad)', onclick: () => { if (confirm('Erase all progress?')) { S = {}; load2(); save(); go('#/'); } } }, 'Reset all progress'))));
    app(frag);
  }
  function load2() { S.done = S.done || {}; S.right = S.right || {}; S.days = S.days || []; S.name = S.name || ''; }

  function viewKey(n) {
    setNav('parent');
    const L = LESSONS[n]; if (!L) return go('#/parent');
    app(h('div', {}, h('a', { href: '#/parent' }, '◀ Parent corner'), h('h1', {}, `Answer key: ${L.t}`),
      h('section', { class: 'card', html: '<p><b>Olympiad tip:</b> ' + L.tip.replace(/^<b>Olympiad tip:<\/b>\s*/, '') + '</p>' }),
      h('section', { class: 'card' }, h('p', { class: 'muted small' }, 'Questions marked "random" get new numbers every time. The answer and working are shown to your child after they answer; below is one example.'), L.q.map((_, i) => { const q = resolve(L, i); return h('div', { style: 'margin:14px 0' }, h('b', {}, `${i + 1}. ${LV[q.l][1]} `), q.gen ? h('span', { class: 'pill dark' }, 'random') : '', ' ', q.q, h('div', {}, h('b', {}, 'Answer: '), answerText(q)), q.s ? h('div', { class: 'muted small' }, q.s) : ''); }))));
  }

  /* ---------- router ---------- */
  function app(node) { $app.replaceChildren(node); window.scrollTo(0, 0); }
  function go(hash) { if (location.hash === hash) route(); else location.hash = hash; }
  function route() {
    const p = (location.hash || '#/').slice(2).split('/');
    const n = parseInt(p[1], 10);
    ({ '': viewHome, map: viewMap, lesson: () => viewLesson(n), done: () => viewDone(n), review: viewReview, parent: viewParent, key: () => viewKey(n) }[p[0]] || viewHome)();
  }
  window.addEventListener('hashchange', route);
  route();
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
})();
