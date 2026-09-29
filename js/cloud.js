/* Optional Google sign-in that keeps progress in the cloud (Firebase Auth + Firestore), so it follows the child across devices
   without typing a password. The app works exactly as before when signed out. Progress stays in localStorage first; the cloud
   copy is merged in (js/merge.js) and written back a few seconds after each save.
   The Firebase scripts load only when a grown-up opens the sign-in card, or when this browser was already signed in. */
(function () {
  'use strict';
  const V = '10.12.5', BASE = `https://www.gstatic.com/firebasejs/${V}/`;
  const FLAG = 'grade1math.cloud'; // "1" once someone has signed in on this browser
  let hooks = null, fb = null, auth = null, db = null, user = null, loading = null, timer = null, busy = false, again = false;
  const st = { state: 'off', message: '', at: 0 };
  const listeners = [];
  const say = (state, message) => { st.state = state; st.message = message || ''; if (state === 'synced') st.at = Date.now(); listeners.forEach(f => { try { f(); } catch (e) { /* ignore */ } }); };
  const flag = v => { try { if (v == null) return localStorage.getItem(FLAG) === '1'; v ? localStorage.setItem(FLAG, '1') : localStorage.removeItem(FLAG); } catch (e) { /* private mode */ } return false; };

  function loadScript(src) { return new Promise((ok, no) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = () => no(new Error('Could not load ' + src)); document.head.appendChild(s); }); }
  /* Load the Firebase SDK once (compat build, so no bundler is needed). */
  function load() {
    if (loading) return loading;
    say('loading', 'Getting ready...');
    loading = loadScript(BASE + 'firebase-app-compat.js').then(() => loadScript(BASE + 'firebase-auth-compat.js')).then(() => loadScript(BASE + 'firebase-firestore-compat.js')).then(() => {
      fb = window.firebase; fb.initializeApp(window.FIREBASE_CONFIG); auth = fb.auth(); db = fb.firestore();
      auth.onAuthStateChanged(u => { user = u; if (u) { flag(true); syncNow(); } else say('out', ''); });
    }).catch(e => { loading = null; say('error', navigator.onLine ? 'Could not reach Google. Try again in a moment.' : 'You are offline. Sign-in needs internet.'); throw e; });
    return loading;
  }

  /* Merge the cloud copy into this device and write the result back, in one transaction so two devices cannot overwrite each other. */
  async function syncNow() {
    if (!user || !hooks) return;
    if (busy) { again = true; return; }
    busy = true; say('syncing', 'Saving...');
    try {
      const ref = db.collection('users').doc(user.uid);
      const merged = await db.runTransaction(async tx => {
        const snap = await tx.get(ref); let remote = null;
        if (snap.exists) { try { remote = JSON.parse(snap.data().state); } catch (e) { remote = null; } }
        const m = remote ? Merge.merge(hooks.get(), remote) : hooks.get();
        tx.set(ref, { state: JSON.stringify(m), updated: fb.firestore.FieldValue.serverTimestamp(), v: 1 });
        return m;
      });
      if (!Merge.same(merged, hooks.get())) hooks.apply(merged);
      say('synced');
    } catch (e) {
      say('error', e && e.code === 'permission-denied' ? 'The cloud rules do not allow this yet. Ask the app owner to publish the Firestore rules.' : (navigator.onLine ? 'Could not save just now. It will retry.' : 'You are offline. It will save when you are back online.'));
    } finally { busy = false; if (again) { again = false; pushSoon(); } }
  }
  function pushSoon() { if (!user) return; clearTimeout(timer); timer = setTimeout(syncNow, 4000); }

  async function signIn() {
    await load();
    say('signing', 'Opening Google...');
    try { await auth.signInWithPopup(new fb.auth.GoogleAuthProvider()); }
    catch (e) {
      if (e && (e.code === 'auth/popup-blocked' || e.code === 'auth/operation-not-supported-in-this-environment')) { try { await auth.signInWithRedirect(new fb.auth.GoogleAuthProvider()); return; } catch (e2) { e = e2; } }
      say(user ? 'synced' : 'out', e && e.code === 'auth/popup-closed-by-user' ? '' : e && e.code === 'auth/unauthorized-domain' ? 'This web address is not allowed yet. Add it under Authentication, Settings, Authorized domains.' : 'Sign-in did not work. Please try again.');
    }
  }
  async function signOut() { flag(false); if (auth) await auth.signOut(); user = null; say('out', ''); }

  window.Cloud = {
    attach(h) { hooks = h; if (flag()) load().catch(() => {}); },                 // resume quietly if this browser signed in before
    preload() { return load().catch(() => {}); },                                   // so the sign-in click can open the popup instantly
    signIn, signOut, syncNow, pushSoon,
    status: () => Object.assign({ email: user ? user.email : '', signedIn: !!user }, st),
    onChange(f) { listeners.push(f); },
    offChange(f) { const i = listeners.indexOf(f); if (i >= 0) listeners.splice(i, 1); }
  };
  window.addEventListener('online', () => { if (user) syncNow(); });
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && user) syncNow(); });
})();
