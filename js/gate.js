/* Grown-ups gate. A pop-up shows the hint for a "-ology" (the study of ...) and the grown-up types the word to get in.
   This keeps a young child out; it is not real security (the words are in this file). */
(function () {
  const POOL = [
    ['birds', 'ornithology'], ['the mind and how people behave', 'psychology'], ['ancient people, found by digging up what they left behind', 'archaeology', 'archeology'],
    ['living things', 'biology'], ['rocks and how the Earth is made', 'geology'], ['weather', 'meteorology'], ['insects', 'entomology'],
    ['fish', 'ichthyology'], ['earthquakes', 'seismology'], ['animals', 'zoology'], ['how people live together in groups', 'sociology'],
    ['how living things and their surroundings depend on each other', 'ecology'], ['where words come from and how their meanings changed', 'etymology'],
    ['the heart', 'cardiology'], ['skin', 'dermatology'], ['the brain and nerves', 'neurology'], ['medicines and drugs', 'pharmacology'],
    ['caves', 'speleology'], ['snakes, lizards and frogs', 'herpetology'], ['bones', 'osteology'], ['eyes', 'ophthalmology'],
    ['cells', 'cytology'], ['gods, religion and belief', 'theology'], ['ancient stories about gods and heroes', 'mythology'],
    ['volcanoes', 'volcanology'], ['fossils and dinosaurs', 'paleontology', 'palaeontology'], ['ancient Egypt', 'egyptology'],
    ['poisons', 'toxicology'], ['the body\'s defence against germs', 'immunology'], ['crime and criminals', 'criminology'],
    ['hearing', 'audiology'], ['the order in which events happened', 'chronology'], ['trees', 'dendrology'], ['fungi such as mushrooms', 'mycology'],
    ['the way the body works', 'physiology'], ['how the universe began and grew', 'cosmology'], ['diseases', 'pathology'], ['teeth', 'odontology']
  ];
  const MINUTES = 10; let memory = 0;
  const now = () => Date.now();
  const read = () => { try { return +sessionStorage.getItem('grownupsUntil') || 0; } catch (e) { return memory; } };
  const write = v => { memory = v; try { sessionStorage.setItem('grownupsUntil', String(v)); } catch (e) { /* private mode */ } };
  const pick = avoid => { let e; do { e = POOL[Math.floor(Math.random() * POOL.length)]; } while (POOL.length > 1 && e === avoid); return e; };

  function isUnlocked() { return read() > now(); }
  function touch() { if (isUnlocked()) write(now() + MINUTES * 60000); }
  function lock() { write(0); }

  function require(onOk, onCancel) {
    if (isUnlocked()) { touch(); return onOk(); }
    let entry = pick(), tries = 0;
    const back = document.createElement('div'); back.className = 'gate-back';
    back.innerHTML = `<div class="gate" role="dialog" aria-modal="true" aria-labelledby="gate-title">
      <h2 id="gate-title">Grown-ups only</h2>
      <p>To open this area, type the <b>-ology</b> word for this:</p>
      <p class="gate-hint"></p>
      <input class="gate-input" type="text" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" aria-label="The -ology word" placeholder="Type the word here">
      <p class="gate-msg" role="status"></p>
      <div class="gate-row"><button class="btn" data-ok>Open</button><button class="btn alt" data-cancel>Back to Home</button></div>
    </div>`;
    const hint = back.querySelector('.gate-hint'), input = back.querySelector('.gate-input'), msg = back.querySelector('.gate-msg');
    const show = () => { hint.textContent = 'The study of ' + entry[0] + '.'; input.value = ''; };
    const close = () => { back.remove(); document.removeEventListener('keydown', onKey); };
    const cancel = () => { close(); onCancel(); };
    const submit = () => {
      const v = input.value.trim().toLowerCase().replace(/\s+/g, '');
      if (entry.slice(1).includes(v)) { write(now() + MINUTES * 60000); close(); return onOk(); }
      tries++;
      if (tries >= 3) { entry = pick(entry); tries = 0; show(); msg.textContent = 'Not quite. Here is a different one.'; }
      else msg.textContent = `Not quite. It starts with "${entry[1].slice(0, 3)}" and has ${entry[1].length} letters.`;
      input.select();
    };
    const onKey = e => { if (e.key === 'Escape') cancel(); };
    back.querySelector('[data-ok]').addEventListener('click', submit);
    back.querySelector('[data-cancel]').addEventListener('click', cancel);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
    document.addEventListener('keydown', onKey);
    show(); document.body.appendChild(back); setTimeout(() => input.focus(), 30);
  }
  window.GATE = { require, isUnlocked, touch, lock, pool: POOL };
})();
