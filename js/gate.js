/* The Grown-ups gate. A grown-up signs in with their own Google account (js/cloud.js); the area then stays open for 10 minutes
   and locks itself again. Only a parent in this device's family can get in. */
(function () {
  const MINUTES = 10; let memory = 0;
  const now = () => Date.now();
  const read = () => { try { return +sessionStorage.getItem('grownupsUntil') || 0; } catch (e) { return memory; } };
  const write = v => { memory = v; try { sessionStorage.setItem('grownupsUntil', String(v)); } catch (e) { /* private mode */ } };
  function isUnlocked() { return read() > now(); }
  function touch() { if (isUnlocked()) write(now() + MINUTES * 60000); }
  function lock() { write(0); }

  function require(onOk, onCancel) {
    if (isUnlocked()) { touch(); return onOk(); }
    const back = document.createElement('div'); back.className = 'gate-back';
    back.innerHTML = `<div class="gate" role="dialog" aria-modal="true" aria-labelledby="gate-title">
      <h2 id="gate-title">🏰 Halt! Grown-ups only</h2>
      <p>The gate guard needs a grown-up to sign in with Google. It also keeps your child's progress safe.</p>
      <p class="gate-msg" role="status"></p>
      <div class="gate-row"><button class="btn" data-ok disabled>Getting ready...</button><button class="btn alt" data-cancel>Back to the quest</button></div>
    </div>`;
    const ok = back.querySelector('[data-ok]'), msg = back.querySelector('.gate-msg');
    const previousFocus = document.activeElement;
    const close = () => { back.remove(); document.removeEventListener('keydown', onKey); if (previousFocus && previousFocus.isConnected) previousFocus.focus(); };
    const cancel = () => { close(); onCancel(); };
    const onKey = e => {
      if (e.key === 'Escape') return cancel();
      if (e.key === 'Tab') {
        const controls = Array.from(back.querySelectorAll('button:not(:disabled)'));
        if (!controls.length) return;
        const index = controls.indexOf(document.activeElement);
        if ((e.shiftKey && index <= 0) || (!e.shiftKey && (index < 0 || index === controls.length - 1))) { e.preventDefault(); controls[e.shiftKey ? controls.length - 1 : 0].focus(); }
      }
    };
    // the Google window must open straight from the tap, so the sign-in code is loaded first
    (window.Cloud ? Cloud.preload() : Promise.resolve()).then(() => { ok.disabled = false; ok.textContent = 'Sign in with Google'; const s = window.Cloud && Cloud.status(); if (s && s.state === 'error') msg.textContent = s.message; });
    ok.addEventListener('click', () => {
      if (!window.Cloud) return;
      ok.disabled = true; msg.textContent = 'Opening Google...';
      Cloud.authenticate().then(r => {
        if (r.ok) { write(now() + MINUTES * 60000); close(); onOk(); }
        else { ok.disabled = false; msg.textContent = r.reason || ''; }
      });
    });
    back.querySelector('[data-cancel]').addEventListener('click', cancel);
    document.addEventListener('keydown', onKey);
    document.body.appendChild(back);
    back.querySelector('[data-cancel]').focus();
  }
  window.GATE = { require, isUnlocked, touch, lock };
})();
