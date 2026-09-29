/* Owl accessories. One is earned for every 3 different days the child studies. Pure data + helpers (tested in tests/adapt.test.js).
   State: S.owl = { worn: { head, face, neck, back }, seen: number of accessories already celebrated } */
(function (root) {
  'use strict';
  const EVERY = 3;
  // Unlock order mixes slots so the owl changes in a new way each time.
  const ACC = [
    { id: 'party', name: 'Party hat', slot: 'head', svg: '<path d="M46 24 L60 -14 L74 24 Z" fill="#ff7a90" stroke="#fff" stroke-width="2.5" stroke-linejoin="round"/><path d="M51 12 L69 12 M48 19 L72 19" stroke="#fff" stroke-width="2.5"/><circle cx="60" cy="-14" r="5.5" fill="#ffd84d" stroke="#fff" stroke-width="2"/>' },
    { id: 'glasses', name: 'Round glasses', slot: 'face', svg: '<circle cx="44" cy="52" r="19" fill="none" stroke="#2b2a4c" stroke-width="3.5"/><circle cx="76" cy="52" r="19" fill="none" stroke="#2b2a4c" stroke-width="3.5"/><path d="M63 50 Q60 46 57 50" fill="none" stroke="#2b2a4c" stroke-width="3.5"/>' },
    { id: 'bowtie', name: 'Bow tie', slot: 'neck', svg: '<path d="M60 92 L44 82 L44 102 Z M60 92 L76 82 L76 102 Z" fill="#e0475f" stroke="#fff" stroke-width="2.5" stroke-linejoin="round"/><circle cx="60" cy="92" r="5" fill="#ffd84d" stroke="#fff" stroke-width="2"/>' },
    { id: 'cape', name: 'Hero cape', slot: 'back', behind: true, svg: '<path d="M30 70 Q6 100 12 128 L60 118 L108 128 Q114 100 90 70 Z" fill="#7c5cff" stroke="#fff" stroke-width="2.5" stroke-linejoin="round"/>' },
    { id: 'crown', name: 'Golden crown', slot: 'head', svg: '<path d="M38 26 L38 2 L50 14 L60 -4 L70 14 L82 2 L82 26 Z" fill="#ffd84d" stroke="#e0a800" stroke-width="2.5" stroke-linejoin="round"/><circle cx="38" cy="2" r="3.5" fill="#ff7a90"/><circle cx="60" cy="-4" r="3.5" fill="#7fe0c2"/><circle cx="82" cy="2" r="3.5" fill="#ff7a90"/>' },
    { id: 'shades', name: 'Cool sunglasses', slot: 'face', svg: '<path d="M26 44 H94 L92 50 Q90 68 76 68 Q62 68 60 50 Q58 68 44 68 Q30 68 28 50 Z" fill="#2b2a4c" stroke="#fff" stroke-width="2" stroke-linejoin="round"/><path d="M34 50 L42 50 M68 50 L76 50" stroke="#8fd3ff" stroke-width="3" stroke-linecap="round"/>' },
    { id: 'scarf', name: 'Cosy scarf', slot: 'neck', svg: '<path d="M26 90 Q60 108 94 90 L92 102 Q60 120 28 102 Z" fill="#ff9f43" stroke="#fff" stroke-width="2.5" stroke-linejoin="round"/><path d="M76 104 L84 130 L96 126 L90 100 Z" fill="#ff9f43" stroke="#fff" stroke-width="2.5" stroke-linejoin="round"/><path d="M40 98 L44 108 M54 102 L58 112 M68 102 L72 111" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>' },
    { id: 'pack', name: 'Little backpack', slot: 'back', behind: true, svg: '<rect x="76" y="60" width="34" height="50" rx="12" fill="#3aa0d8" stroke="#fff" stroke-width="2.5"/><rect x="82" y="80" width="22" height="16" rx="5" fill="#2478a8"/><path d="M84 62 Q76 84 84 108" fill="none" stroke="#fff" stroke-width="3"/>' },
    { id: 'wizard', name: 'Wizard hat', slot: 'head', svg: '<path d="M30 28 Q60 38 90 28 Q60 20 30 28 Z" fill="#4b3aa8" stroke="#fff" stroke-width="2.5"/><path d="M42 26 Q52 6 64 -16 Q68 8 80 26 Q60 32 42 26 Z" fill="#5e4ad0" stroke="#fff" stroke-width="2.5" stroke-linejoin="round"/><path d="M62 4 l2 5 5 0 -4 3 2 5 -5 -3 -5 3 2 -5 -4 -3 5 0 z" fill="#ffd84d"/>' },
    { id: 'medal', name: 'Gold medal', slot: 'neck', svg: '<path d="M46 86 L60 108 L74 86" fill="none" stroke="#e0475f" stroke-width="6"/><circle cx="60" cy="112" r="10" fill="#ffd84d" stroke="#e0a800" stroke-width="2.5"/><path d="M60 106 l2.4 4.8 5.3.8 -3.8 3.7 .9 5.3 -4.8 -2.5 -4.8 2.5 .9 -5.3 -3.8 -3.7 5.3 -.8 z" fill="#fff"/>' },
    { id: 'flower', name: 'Flower', slot: 'head', svg: '<g transform="translate(88 20)"><circle cx="0" cy="-8" r="6" fill="#ff7a90"/><circle cx="8" cy="-2" r="6" fill="#ff7a90"/><circle cx="5" cy="7" r="6" fill="#ff7a90"/><circle cx="-5" cy="7" r="6" fill="#ff7a90"/><circle cx="-8" cy="-2" r="6" fill="#ff7a90"/><circle cx="0" cy="0" r="5.5" fill="#ffd84d"/></g>' },
    { id: 'hearts', name: 'Heart cheeks', slot: 'face', svg: '<path d="M30 68 q-6-6 0-10 q4-2 6 2 q2-4 6-2 q6 4 0 10 l-6 6 z" fill="#ff7a90"/><path d="M78 68 q-6-6 0-10 q4-2 6 2 q2-4 6-2 q6 4 0 10 l-6 6 z" fill="#ff7a90"/>' }
  ];
  const SLOTS = ['head', 'face', 'neck', 'back'];
  const byId = id => ACC.find(a => a.id === id);
  const earned = studyDays => Math.min(ACC.length, Math.floor(Math.max(0, studyDays) / EVERY));
  const untilNext = studyDays => earned(studyDays) >= ACC.length ? 0 : EVERY - (Math.max(0, studyDays) % EVERY);
  /* Wear every newly earned item straight away (it replaces the one in the same slot). Returns the new items. */
  function sync(owl, studyDays) {
    owl.worn = owl.worn || {}; owl.seen = owl.seen | 0;
    const n = earned(studyDays), fresh = [];
    for (let i = owl.seen; i < n; i++) { owl.worn[ACC[i].slot] = ACC[i].id; fresh.push(ACC[i]); }
    owl.seen = Math.max(owl.seen, n);
    // ignore anything worn that is not (or no longer) earned, e.g. after progress was reset on another device
    SLOTS.forEach(s => { const a = byId(owl.worn[s]); if (a && ACC.indexOf(a) >= n) delete owl.worn[s]; });
    return fresh;
  }
  /* Put an earned item on, or take it off if already on. */
  function toggle(owl, id, studyDays) {
    const a = byId(id), n = earned(studyDays); if (!a || ACC.indexOf(a) >= n) return false;
    owl.worn = owl.worn || {};
    if (owl.worn[a.slot] === id) delete owl.worn[a.slot]; else owl.worn[a.slot] = id;
    return true;
  }
  /* Wrap the owl drawing (inner SVG markup) with what is worn. There is extra room above for hats. */
  function svg(worn, body, label) {
    worn = worn || {};
    const parts = SLOTS.map(s => byId(worn[s])).filter(Boolean);
    return `<svg class="owl" viewBox="0 -18 120 150" role="img" aria-label="${label || 'A friendly owl waving hello'}">${parts.filter(a => a.behind).map(a => a.svg).join('')}${body}${parts.filter(a => !a.behind).map(a => a.svg).join('')}</svg>`;
  }
  root.OwlWear = { ACC, SLOTS, EVERY, byId, earned, untilNext, sync, toggle, svg };
})(typeof window !== 'undefined' ? window : globalThis);
