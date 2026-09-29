/* Monsters: ten friendly monsters drawn from a few parts, one per lesson (cycling), and a Big Boss crown for the last lesson of each week.
   Also the knight's rank. Pure functions so tests/theme.test.js can check them in Node. */
(function (root) {
  'use strict';
  const SHAPES = {
    blob: 'M50 14 C80 14 92 38 90 60 C88 84 72 94 50 94 C28 94 12 84 10 60 C8 38 20 14 50 14Z',
    tall: 'M50 6 C74 6 84 30 82 56 C80 84 68 94 50 94 C32 94 20 84 18 56 C16 30 26 6 50 6Z',
    wide: 'M50 24 C86 22 97 44 95 62 C93 84 74 94 50 94 C26 94 7 84 5 62 C3 44 14 22 50 24Z'
  };
  const LIST = [
    { name: 'Blip', c: '#8f6bff', c2: '#b9a2ff', dark: '#7551e6', shape: 'blob', eyes: 2, top: 'horns', mouth: 'teeth', extra: 'spots' },
    { name: 'Boo', c: '#dfe8ff', c2: '#ffffff', dark: '#b7c6ee', shape: 'tall', eyes: 2, top: 'tuft', mouth: 'smile', extra: 'none', ghost: true },
    { name: 'Ember', c: '#ff7a4d', c2: '#ffc19a', dark: '#e0562a', shape: 'blob', eyes: 2, top: 'spikes', mouth: 'fangs', extra: 'none' },
    { name: 'Rex', c: '#38b26b', c2: '#9be3b5', dark: '#1e8a4c', shape: 'wide', eyes: 2, top: 'spikes', mouth: 'teeth', extra: 'spots' },
    { name: 'Inky', c: '#3b82f6', c2: '#9cc2ff', dark: '#2760c4', shape: 'tall', eyes: 2, top: 'ears', mouth: 'smile', extra: 'stripes' },
    { name: 'Ollie', c: '#ff7aa8', c2: '#ffc2d8', dark: '#e0568a', shape: 'blob', eyes: 3, top: 'none', mouth: 'tongue', extra: 'spots' },
    { name: 'Bolt', c: '#8fa3bd', c2: '#c9d6e6', dark: '#6b7f96', shape: 'wide', eyes: 1, top: 'antenna', mouth: 'smile', extra: 'none' },
    { name: 'Zog', c: '#a4d63a', c2: '#d6f08a', dark: '#7fae1c', shape: 'blob', eyes: 3, top: 'antenna', mouth: 'smile', extra: 'stripes' },
    { name: 'Long-Neck', c: '#f2c53d', c2: '#fbe59a', dark: '#c99a10', shape: 'tall', eyes: 2, top: 'ears', mouth: 'smile', extra: 'spots' },
    { name: 'Drako', c: '#d6455d', c2: '#f2929f', dark: '#a82c42', shape: 'wide', eyes: 2, top: 'horns', mouth: 'teeth', extra: 'stripes' }
  ];
  const EYES = { 1: [[50, 46, 15]], 2: [[37, 46, 12], [63, 46, 12]], 3: [[30, 52, 9.5], [50, 36, 9.5], [70, 52, 9.5]] };
  const CREAM = 'fill="#f4ead2" stroke="#c9b98f" stroke-width="2.5" stroke-linejoin="round"';
  const TOP = {
    none: () => '',
    horns: () => `<path d="M22 32 L28 6 L44 26 Z M78 32 L72 6 L56 26 Z" ${CREAM}/>`,
    spikes: m => `<path d="M30 24 L36 6 L44 22 Z M44 20 L50 2 L56 20 Z M56 22 L64 6 L70 24 Z" fill="${m.dark}" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/>`,
    ears: m => `<circle cx="20" cy="30" r="11" fill="${m.c}"/><circle cx="80" cy="30" r="11" fill="${m.c}"/><circle cx="20" cy="30" r="5.5" fill="${m.c2}"/><circle cx="80" cy="30" r="5.5" fill="${m.c2}"/>`,
    antenna: m => `<path d="M40 20 Q36 8 28 5 M60 20 Q64 8 72 5" fill="none" stroke="${m.dark}" stroke-width="3.5" stroke-linecap="round"/><circle cx="28" cy="5" r="4.5" fill="#ffd84d"/><circle cx="72" cy="5" r="4.5" fill="#ffd84d"/>`,
    tuft: m => `<path d="M44 16 Q40 2 50 0 Q60 2 56 16 Z" fill="${m.dark}"/>`
  };
  const MOUTH = {
    teeth: () => '<path d="M34 68 Q50 86 66 68 Z" fill="#3b1f66"/><path d="M42 69.5 V75 M58 69.5 V75" stroke="#fff" stroke-width="5" stroke-linecap="round"/>',
    smile: () => '<path d="M36 68 Q50 82 64 68" fill="none" stroke="#3b1f66" stroke-width="4" stroke-linecap="round"/>',
    tongue: () => '<path d="M34 68 Q50 86 66 68 Z" fill="#3b1f66"/><path d="M44 76 Q50 90 56 76 Z" fill="#ff8fb0"/>',
    fangs: () => '<path d="M34 68 Q50 80 66 68" fill="none" stroke="#3b1f66" stroke-width="4" stroke-linecap="round"/><path d="M40 71 L43 79 L46 72 M54 72 L57 79 L60 71" fill="#fff" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/>'
  };
  const EXTRA = {
    none: () => '',
    spots: m => `<circle cx="22" cy="46" r="4" fill="${m.dark}"/><circle cx="80" cy="40" r="3.4" fill="${m.dark}"/><circle cx="76" cy="62" r="3" fill="${m.dark}"/>`,
    stripes: m => `<path d="M16 58 Q24 62 20 70 M84 58 Q76 62 80 70 M24 26 Q34 22 40 26" fill="none" stroke="${m.dark}" stroke-width="3.5" stroke-linecap="round"/>`
  };
  const CROWN = '<path d="M30 16 L30 -2 L40 8 L50 -8 L60 8 L70 -2 L70 16 Z" fill="#ffd84d" stroke="#e0a800" stroke-width="2.5" stroke-linejoin="round"/><circle cx="30" cy="-2" r="3" fill="#e0475f"/><circle cx="50" cy="-8" r="3" fill="#7fe0c2"/><circle cx="70" cy="-2" r="3" fill="#e0475f"/>';

  /* inner drawing, viewBox 0 0 100 100 (the crown reaches a little above). */
  function body(i, opts) {
    const m = LIST[((i % LIST.length) + LIST.length) % LIST.length]; opts = opts || {};
    const eyes = EYES[m.eyes].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/><circle class="pupil" cx="${x + 2}" cy="${y + 2}" r="${(r * 0.5).toFixed(1)}" fill="#2b2a4c"/><circle cx="${x + 3.6}" cy="${y - 0.6}" r="${(r * 0.17).toFixed(1)}" fill="#fff"/>`).join('');
    const feet = m.ghost ? '' : `<ellipse cx="32" cy="94" rx="12" ry="6" fill="#ff9f43"/><ellipse cx="68" cy="94" rx="12" ry="6" fill="#ff9f43"/>`;
    const hearts = opts.tamed ? '<path d="M14 24 q-6-6 0-10 q3-2 5 2 q2-4 5-2 q6 4 0 10 l-5 5 z" fill="#ff7a90"/><path d="M78 16 q-5-5 0-8.5 q3-2 4.5 1.6 q1.8-3.6 4.5-1.6 q5 3.5 0 8.5 l-4.5 4.5 z" fill="#ff7a90"/>' : '';
    return `${TOP[m.top](m)}${feet}<path d="${SHAPES[m.shape]}" fill="${m.c}"${m.ghost ? ' stroke="#b7c6ee" stroke-width="2.5"' : ''}/>${m.shape === 'tall' ? '' : `<ellipse cx="50" cy="76" rx="26" ry="15" fill="${m.c2}" opacity=".85"/>`}${EXTRA[m.extra](m)}${eyes}${MOUTH[m.mouth](m)}${opts.boss ? CROWN : ''}${hearts}`;
  }
  const svg = (i, opts) => `<svg class="mon${opts && opts.boss ? ' boss' : ''}${opts && opts.tamed ? ' tamed' : ''}" viewBox="0 -12 100 112" aria-hidden="true">${body(i, opts)}</svg>`;
  /* One hidden sprite sheet, so 120 small pictures can reuse each drawing with <use>. */
  const sprite = () => `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>${LIST.map((m, i) => `<symbol id="mon-${i}" viewBox="0 -12 100 112">${body(i)}</symbol><symbol id="monb-${i}" viewBox="0 -12 100 112">${body(i, { boss: true })}</symbol>`).join('')}</defs></svg>`;
  const use = (i, boss, cls) => `<svg class="mon ${cls || ''}" viewBox="0 -12 100 112" aria-hidden="true"><use href="#${boss ? 'monb' : 'mon'}-${((i % LIST.length) + LIST.length) % LIST.length}"/></svg>`;

  /* Which monster guards a lesson: cycles through all ten. The last lesson of a week (day 5) is a Big Boss. */
  const SHIFT = { math: 0, eng: 1, sci: 2 };
  const forLesson = L => { const i = (L.n * 3 + (SHIFT[L.subj] || 0)) % LIST.length, boss = L.day === 5; return { i, boss, name: (boss ? 'Boss ' : '') + LIST[i].name, base: LIST[i].name }; };

  const RANKS = [[0, 'Page', '🧒'], [10, 'Squire', '🛡️'], [30, 'Knight', '⚔️'], [60, 'Champion', '🏅'], [100, 'Dragon Knight', '🐉']];
  function rank(done) {
    let k = 0; RANKS.forEach((r, j) => { if (done >= r[0]) k = j; });
    const next = RANKS[k + 1];
    return { name: RANKS[k][1], icon: RANKS[k][2], next: next ? { name: next[1], at: next[0], left: next[0] - done } : null, pct: next ? Math.round((done - RANKS[k][0]) / (next[0] - RANKS[k][0]) * 100) : 100 };
  }
  root.Monsters = { LIST, body, svg, sprite, use, forLesson, rank, RANKS };
})(typeof window !== 'undefined' ? window : globalThis);
