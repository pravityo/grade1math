/* Spelling bee screens: Bee HQ, the daily drill battle, mock bee, word trail, and the grown-ups settings.
   Logic is in js/bee.js and the words in js/data/beewords.js. Sound uses the browser's built-in speech (Safari included). */
(function () {
  'use strict';
  const kit = () => window.AppKit, h = (...a) => kit().h(...a);
  const today = () => kit().todayStr();
  const bee = () => { const S = kit().S; if (!S.bee || !S.bee.words) S.bee = Bee.norm(S.bee); return S.bee; };
  const save = () => { bee().setAt = bee().setAt || 0; kit().save(); };
  let cache = null;
  const list = () => { const n = bee().custom.length; if (!cache || cache.n !== n || cache.first !== (bee().custom[0] || [])[0]) cache = { n, first: (bee().custom[0] || [])[0], items: Bee.flatten(BEE_GROUPS, bee().custom) }; return cache.items; };
  const byWord = w => list().find(x => x.w === w);
  const MONSTER_NAMES = () => Monsters.LIST.map(m => m.name);

  /* ---------- speech ---------- */
  const Speech = (() => {
    const ok = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
    let voice = null;
    const pick = () => { if (!ok) return; const vs = speechSynthesis.getVoices(); if (!vs.length) return; voice = vs.find(v => /^en[-_]US$/i.test(v.lang) && /samantha|ava|allison|nicky|zoe|google us|female|aaron/i.test(v.name)) || vs.find(v => /^en[-_]US$/i.test(v.lang)) || vs.find(v => /^en/i.test(v.lang)) || null; };
    if (ok) { pick(); speechSynthesis.onvoiceschanged = pick; }
    const on = () => ok && bee().sound !== false;
    function say(text, rate, done) {
      if (!on()) { if (done) done(); return; }
      try {
        speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = 'en-US'; u.rate = rate || 0.85; if (voice) u.voice = voice;
        if (done) { u.onend = done; u.onerror = done; } speechSynthesis.speak(u);
      } catch (e) { if (done) done(); }
    }
    function spell(word, done) {   // letter by letter, then the word
      if (!on()) { if (done) done(); return; }
      try {
        speechSynthesis.cancel(); const seq = word.toUpperCase().split('').concat([word]);
        seq.forEach((t, i) => { const u = new SpeechSynthesisUtterance(i < word.length ? t + '.' : t); u.lang = 'en-US'; u.rate = i < word.length ? 0.7 : 0.85; if (voice) u.voice = voice; if (i === seq.length - 1 && done) { u.onend = done; u.onerror = done; } speechSynthesis.speak(u); });
      } catch (e) { if (done) done(); }
    }
    return { ok, on, say, spell, stop() { if (ok) try { speechSynthesis.cancel(); } catch (e) { /* ignore */ } } };
  })();

  /* ---------- little pieces ---------- */
  const meter = (pct, cls) => h('div', { class: 'meter ' + (cls || '') }, h('i', { style: `width:${Math.max(0, Math.min(100, pct))}%` }));
  const letters = (w, cls) => h('span', { class: 'bee-letters ' + (cls || '') }, w.split('').map((c, i) => h('span', { class: 'bl bl' + (i % 5) }, c)));
  const blanked = (text, w) => text.replace(new RegExp(w, 'ig'), '_ _ _');
  const wordOf = x => x.w;
  const monsterIdx = n => (n * 7 + 3) % Monsters.LIST.length;

  /* Buttons that say the word, its meaning and a sentence, like a bee pronouncer. */
  function pronouncer(item, big) {
    const row = h('div', { class: 'pron' });
    const b = (label, fn, cls) => row.append(h('button', { class: 'btn alt ' + (cls || ''), onclick: fn }, label));
    b('🔊 Word', () => Speech.say(item.w, 0.8), big ? 'big' : '');
    if (item.def) b('📖 Meaning', () => Speech.say('Meaning: ' + item.def + '.', 0.9));
    if (item.sent) b('💬 Sentence', () => Speech.say(item.sent, 0.9));
    b('🔁 Again', () => Speech.say(item.w, 0.7));
    return row;
  }
  /* Without sound, a grown-up can read the word: the screen shows the meaning and a sentence with a gap, and a hidden word to peek at. */
  function silentHelp(item) {
    if (Speech.on()) return '';
    const peek = h('span', { class: 'peek' }, '••••');
    return h('div', { class: 'silent' }, h('p', {}, Speech.ok ? '🔇 Sound is off. ' : '🔇 This device cannot speak. ', 'A grown-up can read the word aloud.'),
      item.def ? h('p', {}, h('b', {}, 'Meaning: '), item.def) : '', item.sent ? h('p', {}, h('b', {}, 'Sentence: '), blanked(item.sent, item.w)) : '',
      h('button', { class: 'linkbtn', onclick: () => { peek.textContent = item.w; setTimeout(() => { peek.textContent = '••••'; }, 3000); } }, 'Grown-up: show the word for 3 seconds'), peek);
  }

  /* Letter tiles: tap to build the word. A couple of extra letters make it a puzzle. */
  function tilesInput(item, onSubmit, opts) {
    opts = opts || {}; const w = item.w, n = w.length;
    const extra = 'abcdefghijklmnopqrstuvwxyz'.split('').filter(c => !w.includes(c));
    const decoys = Bee.shuffle(extra).slice(0, item.tier === 1 ? 1 : 2);
    const bank = Bee.shuffle(w.split('').concat(decoys)).map((c, i) => ({ c, i, used: false }));
    const slots = Array(n).fill(null), box = h('div', { class: 'bee-build' }), row = h('div', { class: 'slots' }), tray = h('div', { class: 'tray' });
    const check = h('button', { class: 'btn', onclick: () => finish() }, opts.label || '✔ Check');
    const draw = () => {
      row.replaceChildren(...slots.map((t, k) => h('button', { class: 'bee-slot' + (t ? ' full' : ''), 'aria-label': t ? 'letter ' + t.c + ', tap to remove' : 'empty', onclick: () => { if (t) { t.used = false; slots[k] = null; draw(); } } }, t ? t.c : '')));
      tray.replaceChildren(...bank.map(t => h('button', { class: 'tile-l' + (t.used ? ' used' : ''), onclick: () => { if (t.used) return; const k = slots.indexOf(null); if (k < 0) return; t.used = true; slots[k] = t; draw(); } }, t.c)));
      check.disabled = slots.includes(null);
    };
    const finish = () => { if (slots.includes(null)) return; onSubmit(slots.map(t => t.c).join('')); };
    draw(); box.append(row, tray, h('div', { class: 'ans' }, check, h('button', { class: 'btn alt', onclick: () => { bank.forEach(t => { t.used = false; }); slots.fill(null); draw(); } }, '↺ Clear')));
    return box;
  }
  function typeInput(item, onSubmit, opts) {
    opts = opts || {};
    const input = h('input', { type: 'text', class: 'bee-input', autocomplete: 'off', autocorrect: 'off', autocapitalize: 'none', spellcheck: 'false', 'aria-label': 'Type the word', placeholder: 'Type the word' });
    const go = () => { const v = input.value.trim().toLowerCase(); if (v) onSubmit(v); };
    input.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
    setTimeout(() => input.focus(), 50);
    return h('div', { class: 'ans' }, input, h('button', { class: 'btn', onclick: go }, opts.label || '✔ Check'));
  }

  /* ---------- Bee HQ ---------- */
  function statusLine() {
    const B = bee(), left = Bee.daysLeft(B, today()), c = Bee.counts(B, list());
    if (left == null) return h('p', { class: 'bee-count' }, h('b', {}, '🗓️ No bee date yet. '), 'A grown-up can set it in the Grown-ups area.');
    if (left < 0) return h('p', { class: 'bee-count' }, h('b', {}, 'The big bee day has passed. '), 'Great work! Keep practising for the next one.');
    const p = Bee.pace(B, list(), today());
    return h('div', { class: 'bee-count' }, h('div', { class: 'big-count' }, left === 0 ? 'Today is the big bee!' : left), left === 0 ? '' : h('span', {}, left === 1 ? 'day until the big bee' : 'days until the big bee'),
      p ? h('span', { class: 'pace ' + p.status.replace(' ', '-') }, p.status === 'ahead' ? '🚀 Ahead of plan' : p.status === 'on track' ? '✅ On track' : '⏳ A little behind') : '');
  }
  function homeCard() {
    if (!window.Bee) return h('span');
    const B = bee(), done = B.days.includes(today()), r = Bee.rank(B.xp), st = Adapt.streak(B.days, today());
    return h('a', { class: 'beecard', href: '#/bee' }, h('span', { class: 'bc-icon' }, '🐝'),
      h('span', { class: 'bc-body' }, h('b', {}, 'Spelling Bee training'), h('br'), done ? `✅ Today's drill is done. ${st} day${st === 1 ? '' : 's'} in a row!` : (Bee.daysLeft(B, today()) != null && Bee.daysLeft(B, today()) >= 0 ? `${Bee.daysLeft(B, today())} days to go. Today's drill is waiting!` : 'Today\'s drill is waiting!'),
        h('br'), h('small', {}, `${r.icon} ${r.name} · ${B.xp} points`)), h('span', { class: 'bc-go' }, done ? 'More' : 'Start'));
  }
  function view(sub, arg) {
    const K = kit(); K.setNav('bee');
    if (sub === 'drill') return startDrill(); if (sub === 'mock') return startMock(); if (sub === 'words') return trail();
    if (sub === 'group') return groupView(arg); if (sub === 'hard') return startHard();
    const B = bee(), L = list(), c = Bee.counts(B, L), r = Bee.rank(B.xp), st = Adapt.streak(B.days, today()), doneToday = B.days.includes(today());
    const wrap = h('div', { class: 'bee' });
    wrap.append(h('h1', {}, '🐝 Spelling Bee Training'),
      h('section', { class: 'card bee-hero' }, statusLine(),
        h('div', { class: 'bee-prog' }, h('div', { class: 'row' }, h('b', {}, `${c.mastered} of ${c.total} words mastered`), h('small', {}, `${c.seen} met`)), h('div', { class: 'meter dbl' }, h('i', { class: 'a', style: `width:${c.seen / c.total * 100}%` }), h('i', { class: 'b', style: `width:${c.mastered / c.total * 100}%` }))),
        h('div', { class: 'bee-rank' }, h('b', {}, `${r.icon} ${r.name}`), meter(r.pct, 'gold'), h('small', { class: 'muted' }, r.next ? `${r.next.left} points to become a ${r.next.name}` : 'The top rank!')),
        h('div', { class: 'chips small' }, h('div', { class: 'chip' }, h('b', {}, '🔥 ' + st), st === 1 ? 'day in a row' : 'days in a row'), h('div', { class: 'chip' }, h('b', {}, B.xp), 'points'), h('div', { class: 'chip' }, h('b', {}, B.drills), B.drills === 1 ? 'drill done' : 'drills done'))));
    const pv = Bee.buildSession(B, L, today());
    wrap.append(h('a', { class: 'drillbtn', href: '#/bee/drill' }, h('span', { class: 'db-mon', html: Monsters.svg(monsterIdx(B.drills)) }), h('span', { class: 'db-body' }, h('b', {}, doneToday ? '⚔️ Extra drill' : "⚔️ Today's drill"), h('br'), `${pv.order.length} words · ${pv.fresh.length} new, ${pv.order.length - pv.fresh.length} to remember`, h('br'), h('small', {}, `${MONSTER_NAMES()[monsterIdx(B.drills)]} the word monster is waiting`)), h('span', { class: 'db-go' }, 'Go!')));
    if (doneToday) wrap.append(h('p', { class: 'muted center' }, '✅ You already did today\'s drill. An extra drill is a great bonus.'));
    const hard = Bee.hardWords(B, L);
    wrap.append(h('div', { class: 'bee-tiles' },
      h('a', { class: 'bee-bt', href: '#/bee/mock' }, h('span', {}, '🏆'), h('b', {}, 'Mock Bee'), h('small', {}, `12 words, 3 lives. Best: ${B.mockBest}/12`)),
      h('a', { class: 'bee-bt', href: '#/bee/words' }, h('span', {}, '🗺️'), h('b', {}, 'Word Trail'), h('small', {}, 'All the word groups')),
      hard.length ? h('a', { class: 'bee-bt', href: '#/bee/hard' }, h('span', {}, '🎯'), h('b', {}, 'Tricky words'), h('small', {}, `${hard.length} to practise`)) : ''));
    // settings that a child can flip
    wrap.append(h('section', { class: 'card' }, h('h2', {}, 'How do you want to spell?'), modeChips(() => view()),
      h('label', { class: 'soundtoggle' }, h('input', Object.assign({ type: 'checkbox', onchange: e => { bee().sound = e.target.checked; save(); if (!e.target.checked) Speech.stop(); } }, B.sound !== false ? { checked: 'checked' } : {})), ' 🔊 Say the words out loud'),
      Speech.ok ? '' : h('p', { class: 'muted small' }, 'This device cannot speak, so a grown-up will need to read the words.')));
    // trophies
    wrap.append(h('section', { class: 'card' }, h('h2', {}, '🏆 Trophy shelf'), h('div', { class: 'trophies' }, Bee.TROPHIES.map(t => { const got = B.trophies[t.id]; return h('div', { class: 'bee-trophy' + (got ? ' got' : '') }, h('span', { class: 't-emoji' }, got ? t.emoji : '🔒'), h('b', {}, t.name), h('small', {}, got ? 'Earned!' : t.desc)); }))));
    // tamed word monsters
    const fr = B.friends;
    wrap.append(h('section', { class: 'card' }, h('h2', {}, '🐲 Word monsters you tamed'), fr.length ? h('div', { class: 'friends' }, fr.map((i, k) => h('div', { class: 'friend', title: MONSTER_NAMES()[i] }, h('span', { html: Monsters.svg(i, { tamed: true }) }), h('small', {}, MONSTER_NAMES()[i])))) : h('p', { class: 'muted' }, 'Win a drill with a heart left to tame your first word monster.')));
    wrap.append(h('p', { class: 'muted small center' }, 'These are practice words for grade 1, in our own list. The words at the real bee may be different. A grown-up can add the official word list in the Grown-ups area.'));
    K.app(wrap);
  }
  function modeChips(after) {
    const B = bee();
    return h('div', { class: 'bee-modes' }, [['tiles', '🔤 Letter tiles', 'Tap the letters'], ['type', '⌨️ Type it', 'Use the keyboard'], ['say', '🗣️ Say it', 'Spell out loud']].map(([k, a, b]) => h('button', { class: 'bee-mode' + (B.mode === k ? ' on' : ''), onclick: () => { B.mode = k; save(); if (after) after(); } }, h('b', {}, a), h('small', {}, b))));
  }

  /* ---------- word trail ---------- */
  function trail() {
    const B = bee(), K = kit(), wrap = h('div', { class: 'bee' });
    wrap.append(h('a', { href: '#/bee' }, '◀ Bee HQ'), h('h1', {}, '🗺️ Word Trail'), h('p', { class: 'muted' }, 'Word groups from easy to tricky. Tap a group to see its words or practise it.'));
    const groups = (B.custom.length ? [{ id: 'custom', name: 'Your own words', tier: 2, emoji: '📝', words: B.custom }] : []).concat(BEE_GROUPS);
    groups.forEach(g => {
      const ws = g.words.map(x => x[0]), mast = ws.filter(w => Bee.isMastered(B.words[w])).length, met = ws.filter(w => B.words[w]).length;
      wrap.append(h('a', { class: 'group', href: '#/bee/group/' + g.id }, h('span', { class: 'g-emoji' }, g.emoji), h('span', { class: 'g-body' }, h('b', {}, g.name), h('small', {}, ` tier ${g.tier}`), h('br'), meter(mast / ws.length * 100, 'gold'), h('small', {}, `${mast} mastered · ${met} met · ${ws.length} words`))));
    });
    K.app(wrap);
  }
  function groupView(id) {
    const B = bee(), K = kit(), L = list(), items = L.filter(x => x.gid === id), g = BEE_GROUPS.find(x => x.id === id) || { name: 'Your own words', emoji: '📝', tip: 'Words from your grown-up.' };
    if (!items.length) return K.go('#/bee/words');
    const wrap = h('div', { class: 'bee' }, h('a', { href: '#/bee/words' }, '◀ Word Trail'), h('h1', {}, `${g.emoji} ${g.name}`), h('p', { class: 'key' }, '💡 ' + g.tip),
      h('button', { class: 'btn', onclick: () => runSession({ kind: 'group', title: g.name, words: Bee.shuffle(items), fresh: [], hearts: 0 }) }, '⚔️ Practise this group'));
    wrap.append(h('div', { class: 'wordgrid' }, items.map(x => { const e = B.words[x.w], s = Bee.status(e); return h('div', { class: 'bee-wchip ' + s, title: x.def }, h('b', {}, x.w), h('small', {}, s === 'new' ? 'new' : s === 'mastered' ? '⭐ mastered' : 'learning')); })));
    K.app(wrap);
  }

  /* ---------- starting sessions ---------- */
  function startDrill() {
    const B = bee(), s = Bee.buildSession(B, list(), today());
    if (!B.start) { B.start = today(); save(); }
    runSession({ kind: 'drill', title: "Today's drill", words: s.order, fresh: s.fresh, hearts: 5 });
  }
  function startMock() { runSession({ kind: 'mock', title: 'Mock Bee', words: Bee.mockWords(bee(), list()), fresh: [], hearts: 3 }); }
  function startHard() { const w = Bee.hardWords(bee(), list()).slice(0, 10); if (!w.length) return kit().go('#/bee'); runSession({ kind: 'hard', title: 'Tricky words', words: Bee.shuffle(w), fresh: [], hearts: 0 }); }

  /* ---------- the session: meet new words, then battle ---------- */
  function runSession(cfg) {
    const K = kit(), B = bee(), wrap = h('div', { class: 'bee' });
    const monIdx = cfg.kind === 'drill' ? monsterIdx(B.drills) : (cfg.kind === 'mock' ? 9 : (B.drills + 5) % 20), boss = (cfg.kind === 'drill' && (B.drills + 1) % 5 === 0) || cfg.kind === 'mock';
    const monName = (boss ? 'Boss ' : '') + MONSTER_NAMES()[monIdx];
    const total = cfg.words.length;
    const st = { hearts: cfg.hearts, maxHearts: cfg.hearts, combo: 0, best: 0, xp: 0, i: 0, outcomes: [], queue: cfg.words.slice(), retried: new Set(), out: false };
    const show = node => { Speech.stop(); K.app(h('div', { class: 'bee' }, node)); };

    /* meet the new words */
    function study(k) {
      if (k >= cfg.fresh.length) return battle();
      const x = cfg.fresh[k], shell = h('div', {});
      const cover = h('div', {}), fully = h('div', { class: 'card studycard' });
      fully.append(h('div', { class: 'muted small' }, `New word ${k + 1} of ${cfg.fresh.length}`), h('div', { class: 'sw' }, letters(x.w, 'huge')), pronouncer(x, true),
        h('div', { class: 'ans center' }, h('button', { class: 'btn alt', onclick: () => Speech.spell(x.w) }, '🔤 Say the letters')),
        x.def ? h('p', {}, h('b', {}, 'Meaning: '), x.def) : '', x.sent ? h('p', { class: 'sentence' }, h('b', {}, 'Sentence: '), x.sent) : '', h('p', { class: 'key' }, `${x.emoji} ${x.tip}`), silentHelp(x),
        h('p', { class: 'muted' }, 'Look at it, say it, then cover it and try to spell it from memory.'),
        h('button', { class: 'btn', onclick: () => { fully.replaceChildren(h('h3', {}, 'Cover and spell'), h('p', { class: 'muted' }, 'The word is hidden. Spell it from memory.'), pronouncer(x), memory(x, k)); } }, '🙈 Cover it and spell'));
      shell.append(fully); show(shell);
      Speech.say(x.w, 0.8);
    }
    function memory(x, k) {
      const done = ok => h('div', { class: 'bee-feedback ' + (ok ? 'ok' : 'no') }, ok ? '✅ Perfect memory!' : ['Look again: ', letters(x.w)], h('div', { class: 'ans' }, h('button', { class: 'btn', onclick: () => study(k + 1) }, k + 1 < cfg.fresh.length ? 'Next new word ➜' : 'Start the battle ⚔️')));
      const holder = h('div', {});
      const submit = v => { holder.replaceChildren(done(v === x.w)); };
      holder.append(B.mode === 'type' ? typeInput(x, submit) : tilesInput(x, submit));
      return holder;
    }

    /* the battle */
    function battle() { if (st.i >= st.queue.length) return finish(); word(); }
    function arena() {
      const left = st.queue.length - st.i;
      return h('div', { class: 'arena realm-math bee-arena' + (boss ? ' boss' : ''), id: 'bee-arena' },
        h('div', { class: 'ar-realm' }, `${boss ? '👑 ' : '⚔️ '}${cfg.title}`),
        h('div', { class: 'ar-scene' }, h('div', { class: 'ar-knight', html: K.knightHtml() }), h('div', { class: 'ar-vs' }, 'VS'), h('div', { class: 'ar-foe', html: Monsters.svg(monIdx, { boss }) })),
        h('div', { class: 'ar-calm' }, h('span', {}, monName), meter(left / st.queue.length * 100, 'foe'), h('span', {}, `${left} left`)),
        h('div', { class: 'bee-hud' }, cfg.hearts ? h('span', { class: 'hearts', 'aria-label': st.hearts + ' hearts' }, '❤️'.repeat(st.hearts) + '🖤'.repeat(st.maxHearts - st.hearts)) : h('span', {}), h('span', { class: 'xp' }, `⭐ ${st.xp}`), st.combo > 1 ? h('span', { class: 'bee-combo' }, `🔥 x${st.combo}`) : h('span', {})));
    }
    function word() {
      const x = st.queue[st.i], sect = h('div', {}), fb = h('div', {}), inputBox = h('div', {});
      let tries = 0;
      const mode = B.mode || 'tiles';
      const again = st.retried.has(x.w);   // a word missed earlier and asked once more counts as practice, not a fresh first try
      const finishWord = outcome0 => {
        const outcome = again && outcome0 === 'first' ? 'second' : outcome0;
        Bee.record(B, x.w, outcome, today());
        const sc = Bee.score(outcome, st.combo); st.combo = sc.combo; st.best = Math.max(st.best, st.combo); st.xp += sc.pts; B.xp += sc.pts; B.maxCombo = Math.max(B.maxCombo || 0, st.best); st.outcomes.push({ x, outcome });
        if (outcome === 'miss') { if (cfg.hearts) st.hearts--; if (cfg.kind === 'drill' && !again) { st.retried.add(x.w); st.queue.push(x); } }
        save();
        const hit = outcome !== 'miss', a = document.getElementById('bee-arena'); if (a) { a.classList.remove('hit'); void a.offsetWidth; if (hit) a.classList.add('hit'); }
        const over = cfg.kind === 'mock' && st.hearts <= 0;
        fb.replaceChildren(h('div', { class: 'bee-feedback ' + (hit ? 'ok' : 'no') }, hit ? (outcome === 'first' ? `✅ Correct! +${sc.pts}${st.combo > 1 ? `  🔥 combo x${st.combo}` : ''}` : `✅ You got it! +${sc.pts}`) : `The word is: `, hit ? '' : letters(x.w),
          hit ? '' : h('p', { class: 'muted' }, cfg.kind === 'mock' ? 'That is a miss. Keep going!' : 'Now spell it once to remember it.'),
          hit || cfg.kind === 'mock' ? '' : retype()),
          hit || cfg.kind === 'mock' ? next(over) : '');
        inputBox.replaceChildren();
        const hu = document.querySelector('.bee-hud'); if (hu) hu.replaceWith(arena().querySelector('.bee-hud'));
        if (!hit) Speech.spell(x.w); else Speech.say(['Nice!', 'Great job!', 'Correct!', 'Awesome!'][st.i % 4], 1);
      };
      const next = over => h('div', { class: 'ans' }, h('button', { class: 'btn', onclick: () => { st.i++; if (over) return finish(); battle(); } }, st.i + 1 >= st.queue.length ? 'Finish ➜' : 'Next word ➜'));
      const retype = () => { const holder = h('div', {}); const sub = v => { if (v === x.w) { holder.replaceChildren(h('p', { class: 'good' }, '✅ That is it!'), next(false)); } else { holder.replaceChildren(h('p', { class: 'muted' }, 'Almost. Look at the word above and try again.'), input2()); } }; const input2 = () => (mode === 'type' ? typeInput(x, sub, { label: '✔ Check' }) : tilesInput(x, sub)); holder.append(input2()); return holder; };
      const submit = v => {
        tries++;
        if (v === x.w) return finishWord(tries === 1 ? 'first' : 'second');
        if (tries === 1 && cfg.kind !== 'mock') {   // one more go, with the first letter as a clue
          fb.replaceChildren(h('div', { class: 'bee-feedback try' }, `Not quite. Try again! It starts with "${x.w[0]}".`)); Speech.say('Try again', 1); inputBox.replaceChildren(input()); return;
        }
        finishWord('miss');
      };
      const input = () => mode === 'type' ? typeInput(x, submit) : tilesInput(x, submit);
      const sayMode = () => {
        const reveal = h('div', {});
        return h('div', {}, h('p', { class: 'muted' }, 'Spell the word out loud, letter by letter. Then check.'), h('div', { class: 'ans' }, h('button', { class: 'btn', onclick: () => { reveal.replaceChildren(h('div', { class: 'reveal' }, letters(x.w)), h('div', { class: 'ans' }, h('button', { class: 'btn', onclick: () => finishWord('first') }, '✅ I spelled it right'), h('button', { class: 'btn alt', onclick: () => finishWord('miss') }, '❌ Not yet'))); Speech.spell(x.w); } }, '👀 Show me the letters')), reveal);
      };
      inputBox.append(mode === 'say' ? sayMode() : input());
      sect.append(arena(), h('div', { class: 'card wordcard' }, h('div', { class: 'muted small' }, `Word ${Math.min(st.i + 1, st.queue.length)} of ${st.queue.length}${cfg.kind === 'mock' ? ' · Round ' + (Math.floor(st.i / 4) + 1) : ''}`), h('h2', {}, cfg.kind === 'mock' ? '🐝 Spell the word' : 'Spell the word'), pronouncer(x, true), silentHelp(x), modeSwitch(), inputBox, fb));
      show(sect); Speech.say(x.w, 0.8);
    }
    const modeSwitch = () => h('div', { class: 'bee-modes small' }, [['tiles', '🔤'], ['type', '⌨️'], ['say', '🗣️']].map(([k, e]) => h('button', { class: 'bee-mode' + (B.mode === k ? ' on' : ''), 'aria-label': k, onclick: () => { B.mode = k; save(); word(); } }, e)));

    /* the end */
    function finish() {
      Speech.stop();
      const outs = st.outcomes, firsts = outs.filter(o => o.outcome === 'first').length, misses = outs.filter(o => o.outcome === 'miss').length, tamed = cfg.hearts ? st.hearts > 0 && !(cfg.kind === 'mock' && st.out) : true;
      let bonus = 0, fresh = [], line = '';
      const eliminated = cfg.kind === 'mock' && st.hearts <= 0;
      if (cfg.kind === 'drill') {
        B.drills++; const perfect = outs.length > 0 && outs.every(o => o.outcome === 'first'); if (perfect) B.perfect++;
        bonus = 20 + (perfect ? 30 : 0); if (tamed) { B.friends.push(monIdx); }
        line = perfect ? 'A flawless drill!' : tamed ? `You tamed ${monName}!` : `${monName} got away this time. Try again tomorrow!`;
      } else if (cfg.kind === 'mock') {
        const score = outs.filter(o => o.outcome !== 'miss').length; B.mockBest = Math.max(B.mockBest, score); bonus = 10;
        line = eliminated ? `Out in round ${Math.floor(Math.max(0, st.i - 1) / 4) + 1}. That is how real bees go, and you learned from it!` : score === total ? 'A perfect mock bee!' : 'You made it through every round!';
      } else line = 'Nice practice!';
      B.xp += bonus; st.xp += bonus;
      if (!B.days.includes(today())) B.days.push(today());
      kit().markDay();
      fresh = Bee.award(B, list(), today(), Adapt.streak(B.days, today()));
      save();
      const r = Bee.rank(B.xp), c = Bee.counts(B, list());
      const summary = []; outs.forEach(o => { const f = summary.find(y => y.x.w === o.x.w); if (!f) summary.push({ x: o.x, outcome: o.outcome }); else if (o.outcome === 'miss' || f.outcome === 'miss') f.outcome = 'miss'; else if (o.outcome === 'second') f.outcome = 'second'; });
      const sp = h('div', { class: 'sparkles', 'aria-hidden': 'true' }, ['✨', '⭐', '🐝', '✨', '🎉', '🐝', '✨', '⭐'].map((e, k) => h('span', { style: `left:${8 + k * 12}%;animation-delay:${(k % 4) * 0.25}s` }, e)));
      show(h('div', {}, h('section', { class: 'card hero bee-done' }, h('h1', {}, eliminated ? '🐝 Good try!' : tamed ? '🏆 Victory!' : '🐝 Nice work!'), h('p', {}, line),
        cfg.kind === 'drill' || cfg.kind === 'mock' ? h('div', { class: 'newmon' }, h('span', { class: 'newmon-face', html: Monsters.svg(monIdx, { boss, tamed: tamed && !eliminated }) }), h('span', {}, h('b', {}, `${st.xp} points earned`), h('br'), `${firsts} of ${total} right on the first try`)) : h('p', {}, h('b', {}, `${st.xp} points earned`)),
        sp, h('p', {}, `${r.icon} ${r.name}` + (r.next ? ` · ${r.next.left} points to ${r.next.name}` : '')), h('p', {}, `${c.mastered} of ${c.total} words mastered`)),
        fresh.length ? h('div', { class: 'news' }, h('b', {}, '🏆 New trophy: '), fresh.map(t => `${t.emoji} ${t.name}`).join(', ')) : '',
        h('section', { class: 'card' }, h('h3', {}, 'Your words'), h('div', { class: 'wordgrid' }, summary.map(o => h('div', { class: 'bee-wchip ' + (o.outcome === 'first' ? 'mastered' : 'learning') }, h('b', {}, o.x.w), h('small', {}, o.outcome === 'first' ? '✅ first try' : o.outcome === 'second' ? '✅ second try' : '📌 keep practising')))),
          h('div', { class: 'ans' }, h('a', { class: 'btn', href: '#/bee' }, '🐝 Bee HQ'), misses ? h('button', { class: 'btn alt', onclick: () => runSession({ kind: 'hard', title: 'Missed words', words: Bee.shuffle([...new Set(outs.filter(o => o.outcome === 'miss').map(o => o.x))]), fresh: [], hearts: 0 }) }, 'Practise the missed words') : '', h('a', { class: 'btn alt', href: cfg.kind === 'mock' ? '#/bee/mock' : '#/bee/drill' }, cfg.kind === 'mock' ? 'Try the mock bee again' : 'One more drill')))));
    }
    if (!total) return kit().go('#/bee');
    if (cfg.fresh.length) { const intro = h('section', { class: 'card' }, h('h2', {}, `⚔️ ${cfg.title}`), h('p', {}, `${monName} blocks the way! First, meet ${cfg.fresh.length} new word${cfg.fresh.length === 1 ? '' : 's'}. Then it is battle time.`), h('button', { class: 'btn', onclick: () => study(0) }, 'Meet the new words ➜')); show(intro); } else battle();
  }

  /* ---------- Grown-ups: settings, own word list, and how it is going ---------- */
  function parentCard() {
    if (!window.Bee) return h('span');
    const B = bee(), L = list(), c = Bee.counts(B, L), box = h('section', { class: 'card' });
    const date = h('input', { type: 'date', value: B.date || '', style: 'font:inherit;padding:8px 12px;border-radius:10px;border:2px solid var(--line)' });
    const sel = (opts, cur) => h('select', { style: 'font:inherit;padding:8px 12px;border-radius:10px;border:2px solid var(--line)' }, opts.map(([v, t]) => h('option', Object.assign({ value: v }, String(cur) === String(v) ? { selected: 'selected' } : {}), t)));
    const size = sel([[8, '8 words'], [10, '10 words'], [12, '12 words'], [15, '15 words']], B.size), newMax = sel([[3, '3 new words'], [4, '4 new words'], [6, '6 new words'], [8, '8 new words'], [10, '10 new words']], B.newMax);
    const area = h('textarea', { rows: 6, style: 'width:100%', placeholder: 'One word per line. Optional: word | meaning | sentence\nexample: friend | someone you like | My friend came to play.' });
    const msg = h('p', { class: 'muted' });
    const weak = Bee.hardWords(B, L).slice(0, 12);
    box.append(h('h2', {}, '🐝 Spelling Bee'),
      h('p', { class: 'muted' }, `${c.mastered} of ${c.total} words mastered, ${c.seen} met. ${B.drills} drills done, ${B.xp} points.`),
      h('div', { class: 'ans' }, h('label', {}, 'Bee date: '), date, h('button', { class: 'btn', onclick: () => { B.date = date.value || null; if (!B.start) B.start = today(); B.setAt = Date.now(); save(); alert('Saved'); } }, 'Save date')),
      h('div', { class: 'ans', style: 'margin-top:14px' }, h('label', {}, 'Words per drill: '), size, h('label', {}, ' New words per day (at most): '), newMax, h('button', { class: 'btn', onclick: () => { B.size = +size.value; B.newMax = +newMax.value; B.setAt = Date.now(); save(); alert('Saved'); } }, 'Save')),
      h('p', { class: 'muted small' }, 'Each drill mixes new words with words that are due for review. In the last 7 days before the bee there are no new words, only review of the words already met.'),
      weak.length ? h('p', {}, h('b', {}, 'Words that need more practice: '), weak.map(x => x.w).join(', ')) : '',
      h('h3', { style: 'margin-top:20px' }, 'Add the official word list or your own words'), h('p', { class: 'muted small' }, `The built-in list is our own grade 1 practice list (${BEE_GROUPS.reduce((n, g) => n + g.words.length, 0)} words), not the official Scripps list, which is copyrighted. Paste the organisers' list here. Words you add are taught first. Without a meaning and sentence, the app only says the word.`),
      area, h('div', { class: 'ans' }, h('button', { class: 'btn', onclick: () => { const r = Bee.parseCustom(area.value); if (!r.added.length) { msg.textContent = 'No valid words found. Use letters only, one word per line.'; return; } const have = new Set(B.custom.map(x => x[0])); const add = r.added.filter(x => !have.has(x[0])); B.custom = B.custom.concat(add); B.setAt = Date.now(); save(); area.value = ''; msg.textContent = `Added ${add.length} word${add.length === 1 ? '' : 's'}.${r.skipped.length ? ' Skipped: ' + r.skipped.join(', ') : ''} You now have ${B.custom.length} of your own words.`; } }, 'Add words'),
        B.custom.length ? h('button', { class: 'btn alt', onclick: () => { if (confirm(`Remove your ${B.custom.length} own words?`)) { B.custom = []; B.setAt = Date.now(); save(); msg.textContent = 'Removed.'; } } }, 'Remove my words') : ''), msg,
      h('p', {}, h('button', { class: 'btn alt small', onclick: () => { if (confirm('Erase all spelling bee progress, points and trophies? This cannot be undone.')) { const keep = { date: B.date, custom: B.custom }; Object.assign(kit().S, { bee: Object.assign(Bee.blank(), keep, { setAt: Date.now() }) }); save(); alert('Spelling bee progress was reset.'); kit().go('#/parent'); } } }, 'Reset spelling bee progress')));
    return box;
  }

  window.BeeUI = { view, homeCard, parentCard, Speech };
})();
