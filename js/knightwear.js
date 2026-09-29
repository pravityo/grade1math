/* The little knight and the armour it earns: one item for every 3 different days the child studies. Pure data + helpers (tested in tests/adapt.test.js).
   State: S.hero = { worn: { head, face, neck, back }, seen: number of items already celebrated } */
(function (root) {
  'use strict';
  const EVERY = 3;
  /* The knight itself (inner SVG, viewBox 0 0 120 132). Blinking eyes use class "pupil", the waving sword arm uses class "wave". */
  const BODY = `<rect x="42" y="118" width="15" height="11" rx="5" fill="#6b7f96"/><rect x="63" y="118" width="15" height="11" rx="5" fill="#6b7f96"/>
    <rect x="32" y="74" width="56" height="48" rx="16" fill="#a3b6cb"/>
    <path d="M42 76 H78 V120 H42 Z" fill="#5b5bd6"/><rect x="32" y="103" width="56" height="8" fill="#f5b400"/><rect x="55" y="102" width="10" height="10" rx="2" fill="#ffd84d"/>
    <path d="M60 84 l3.2 6.4 7 1 -5.1 5 1.2 7 -6.3 -3.3 -6.3 3.3 1.2 -7 -5.1 -5 7 -1 z" fill="#ffd84d"/>
    <path d="M6 82 H36 V104 Q36 118 21 125 Q6 118 6 104 Z" fill="#e0475f" stroke="#fff" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M21 90 V116 M10 100 H32" stroke="#ffd84d" stroke-width="3.5" stroke-linecap="round"/>
    <g class="wave"><path d="M84 84 Q100 82 104 62" fill="none" stroke="#a3b6cb" stroke-width="10" stroke-linecap="round"/><circle cx="105" cy="57" r="6.5" fill="#f8d2a8"/>
      <rect x="103.6" y="16" width="3.6" height="38" rx="1.6" fill="#e9f0f8" stroke="#8ea3b8" stroke-width="1"/><rect x="98" y="52" width="14.6" height="4" rx="2" fill="#f5b400"/></g>
    <circle cx="60" cy="50" r="35" fill="#b4c5d8"/><path d="M27 50 A33 33 0 0 1 60 17 V33 Q38 34 30 52 Z" fill="#c9d6e5"/>
    <path d="M60 15 V33" stroke="#8ea3b8" stroke-width="4.5" stroke-linecap="round"/><circle cx="60" cy="14" r="4.5" fill="#ffd84d"/>
    <rect x="38" y="36" width="44" height="34" rx="16" fill="#f8d2a8" stroke="#8ea3b8" stroke-width="3"/>
    <circle cx="50" cy="52" r="4.6" class="pupil" fill="#2b2a4c"/><circle cx="70" cy="52" r="4.6" class="pupil" fill="#2b2a4c"/>
    <circle cx="51.6" cy="50.4" r="1.4" fill="#fff"/><circle cx="71.6" cy="50.4" r="1.4" fill="#fff"/>
    <path d="M52 60 Q60 68 68 60" fill="none" stroke="#2b2a4c" stroke-width="3" stroke-linecap="round"/>`;
  // Unlock order mixes slots so the knight changes in a new way each time.
  const ACC = [
    { id: 'plume', name: 'Red plume', slot: 'head', svg: '<path d="M60 16 Q40 -10 78 -8 Q62 4 68 17 Z" fill="#e0475f" stroke="#fff" stroke-width="2.5" stroke-linejoin="round"/><path d="M62 12 Q60 2 70 -2" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>' },
    { id: 'glasses', name: 'Clever glasses', slot: 'face', svg: '<circle cx="50" cy="52" r="8.6" fill="rgba(255,255,255,.35)" stroke="#2b2a4c" stroke-width="2.4"/><circle cx="70" cy="52" r="8.6" fill="rgba(255,255,255,.35)" stroke="#2b2a4c" stroke-width="2.4"/><path d="M58.6 51 Q60 49.6 61.4 51" fill="none" stroke="#2b2a4c" stroke-width="2.4"/>' },
    { id: 'scarf', name: 'Cosy scarf', slot: 'neck', svg: '<path d="M30 86 Q60 104 90 86 L88 98 Q60 116 32 98 Z" fill="#ff9f43" stroke="#fff" stroke-width="2.5" stroke-linejoin="round"/><path d="M74 104 L82 128 L94 124 L88 98 Z" fill="#ff9f43" stroke="#fff" stroke-width="2.5" stroke-linejoin="round"/><path d="M42 98 L45 108 M55 102 L58 112 M68 102 L71 111" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>' },
    { id: 'cape', name: 'Hero cape', slot: 'back', behind: true, svg: '<path d="M30 74 Q4 106 10 130 L60 122 L110 130 Q116 106 90 74 Z" fill="#7c5cff" stroke="#fff" stroke-width="2.5" stroke-linejoin="round"/>' },
    { id: 'crown', name: 'Golden crown', slot: 'head', svg: '<path d="M40 24 L40 4 L50 15 L60 -2 L70 15 L80 4 L80 24 Z" fill="#ffd84d" stroke="#e0a800" stroke-width="2.5" stroke-linejoin="round"/><circle cx="40" cy="4" r="3.5" fill="#e0475f"/><circle cx="60" cy="-2" r="3.5" fill="#7fe0c2"/><circle cx="80" cy="4" r="3.5" fill="#e0475f"/>' },
    { id: 'shades', name: 'Cool shades', slot: 'face', svg: '<path d="M38 46 H82 L81 51 Q80 62 71 62 Q62 62 60.5 52 Q59 62 49 62 Q40 62 39 51 Z" fill="#2b2a4c" stroke="#fff" stroke-width="2" stroke-linejoin="round"/><path d="M43 51 L48 51 M66 51 L71 51" stroke="#8fd3ff" stroke-width="2.6" stroke-linecap="round"/>' },
    { id: 'medal', name: 'Gold medal', slot: 'neck', svg: '<path d="M46 86 L60 108 L74 86" fill="none" stroke="#e0475f" stroke-width="6"/><circle cx="60" cy="112" r="10" fill="#ffd84d" stroke="#e0a800" stroke-width="2.5"/><path d="M60 106 l2.4 4.8 5.3.8 -3.8 3.7 .9 5.3 -4.8 -2.5 -4.8 2.5 .9 -5.3 -3.8 -3.7 5.3 -.8 z" fill="#fff"/>' },
    { id: 'wings', name: 'Dragon wings', slot: 'back', behind: true, svg: '<path d="M38 82 Q-8 74 0 14 Q16 34 24 48 Q22 30 34 24 Q34 50 46 66 Z" fill="#38b26b" stroke="#fff" stroke-width="2.5" stroke-linejoin="round"/><path d="M82 82 Q128 74 120 14 Q104 34 96 48 Q98 30 86 24 Q86 50 74 66 Z" fill="#38b26b" stroke="#fff" stroke-width="2.5" stroke-linejoin="round"/>' },
    { id: 'horns', name: 'Monster horns', slot: 'head', svg: '<path d="M32 32 Q10 30 14 2 Q26 14 40 24 Z" fill="#f4ead2" stroke="#c9b98f" stroke-width="2.5" stroke-linejoin="round"/><path d="M88 32 Q110 30 106 2 Q94 14 80 24 Z" fill="#f4ead2" stroke="#c9b98f" stroke-width="2.5" stroke-linejoin="round"/>' },
    { id: 'hearts', name: 'Heart cheeks', slot: 'face', svg: '<path d="M39 63 q-5-5 0-8.5 q3.5-2 5.4 1.6 q2-3.6 5.4-1.6 q5 3.5 0 8.5 l-5.4 5 z" fill="#ff7a90"/><path d="M71 63 q-5-5 0-8.5 q3.5-2 5.4 1.6 q2-3.6 5.4-1.6 q5 3.5 0 8.5 l-5.4 5 z" fill="#ff7a90"/>' },
    { id: 'bowtie', name: 'Royal bow tie', slot: 'neck', svg: '<path d="M60 92 L43 82 L43 102 Z M60 92 L77 82 L77 102 Z" fill="#7c5cff" stroke="#fff" stroke-width="2.5" stroke-linejoin="round"/><circle cx="60" cy="92" r="5" fill="#ffd84d" stroke="#fff" stroke-width="2"/>' },
    { id: 'wizard', name: 'Wizard hat', slot: 'head', svg: '<path d="M26 30 Q60 42 94 30 Q60 20 26 30 Z" fill="#4b3aa8" stroke="#fff" stroke-width="2.5"/><path d="M40 28 Q52 4 66 -18 Q70 10 82 28 Q60 34 40 28 Z" fill="#5e4ad0" stroke="#fff" stroke-width="2.5" stroke-linejoin="round"/><path d="M63 6 l2 5 5 0 -4 3 2 5 -5 -3 -5 3 2 -5 -4 -3 5 0 z" fill="#ffd84d"/>' }
  ];
  const SLOTS = ['head', 'face', 'neck', 'back'];
  const byId = id => ACC.find(a => a.id === id);
  const earned = studyDays => Math.min(ACC.length, Math.floor(Math.max(0, studyDays) / EVERY));
  const untilNext = studyDays => earned(studyDays) >= ACC.length ? 0 : EVERY - (Math.max(0, studyDays) % EVERY);
  /* Wear every newly earned item straight away (it replaces the one in the same slot). Returns the new items. */
  function sync(hero, studyDays) {
    hero.worn = hero.worn || {}; hero.seen = hero.seen | 0;
    const n = earned(studyDays), fresh = [];
    for (let i = hero.seen; i < n; i++) { hero.worn[ACC[i].slot] = ACC[i].id; fresh.push(ACC[i]); }
    hero.seen = Math.max(hero.seen, n);
    // ignore anything worn that is not (or no longer) earned, e.g. after progress was reset on another device
    SLOTS.forEach(s => { const a = byId(hero.worn[s]); if (a && ACC.indexOf(a) >= n) delete hero.worn[s]; else if (hero.worn[s] && !a) delete hero.worn[s]; });
    return fresh;
  }
  /* Put an earned item on, or take it off if already on. */
  function toggle(hero, id, studyDays) {
    const a = byId(id), n = earned(studyDays); if (!a || ACC.indexOf(a) >= n) return false;
    hero.worn = hero.worn || {};
    if (hero.worn[a.slot] === id) delete hero.worn[a.slot]; else hero.worn[a.slot] = id;
    return true;
  }
  /* The knight wearing what is worn. There is extra room above for plumes and hats. */
  function svg(worn, body, label) {
    worn = worn || {};
    const parts = SLOTS.map(s => byId(worn[s])).filter(Boolean);
    return `<svg class="kn" viewBox="0 -20 120 152" role="img" aria-label="${label || 'A friendly little knight waving hello'}">${parts.filter(a => a.behind).map(a => a.svg).join('')}${body || BODY}${parts.filter(a => !a.behind).map(a => a.svg).join('')}</svg>`;
  }
  root.KnightWear = { ACC, SLOTS, EVERY, BODY, byId, earned, untilNext, sync, toggle, svg };
})(typeof window !== 'undefined' ? window : globalThis);
