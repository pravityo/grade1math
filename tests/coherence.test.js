/* Run: node tests/coherence.test.js
   Automated flow checks on the Learn material so later edits cannot bring back the problems found in the audit:
   1. a picture never opens a lesson and always has a text paragraph directly around it that points at it
   2. no parent-directed wording in text the child reads
   3. no paragraph or worked example is copy-pasted into two lessons of the same subject
   4. a question that says "picture" or "graph" actually has one attached
   5. outside links are well formed, https, titled and not repeated in a lesson */
globalThis.window = globalThis; const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, '..', 'js', 'data');
const files = ['helpers', 'deep-helpers', 'deep-math-a', 'deep-math-b', 'deep-eng-a', 'deep-eng-b', 'deep-sci-a', 'deep-sci-b', 'links', ...[1, 2, 3, 4, 5, 6, 7, 8].flatMap(i => ['week' + i, 'english' + i, 'science' + i]), 'pics', 'gens'];
for (const f of files) eval(fs.readFileSync(path.join(dir, f + '.js'), 'utf8'));
let bad = 0; const fail = (...a) => { bad++; console.log('FAIL', ...a); };
const subjects = [['math', '', window.CURRICULUM], ['eng', 'e', window.ENGLISH], ['sci', 's', window.SCIENCE]];
const isToken = p => /^\s*\[\[[a-z]+:[^\]]*\]\]\s*$/.test(p);
const strip = p => p.replace(/<[^>]+>/g, '').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
const POINTS = /\b(below|above|picture|diagram|drawing|shown|shows?|showing|look at|here is|here are|the (bar|chart|frame|graph|table|blocks|number line|model|bond|cards?|clock|coins|circuit|cycle|square|key|list)\b|in the (bar|chart|table|frame|graph|picture)|this chart|these cards)/i;
const PARENT = /\b(your child|the child|children can|teach them|just teach|parents?|grown-ups? should)\b/i;
const numsOf = t => (t.match(/\d+/g) || []);
const wordsOf = t => (t.toLowerCase().match(/[a-z]{4,}/g) || []);
const seenPara = new Map(), seenWorked = new Map();

for (const [subj, prefix, weeks] of subjects) {
  let n = 0;
  weeks.forEach(w => w.lessons.forEach(L => {
    const id = prefix + (n++), tag = `${subj} ${id} "${L.t}"`;
    // build the sequence the child sees: paragraphs plus (for maths) pictures inserted after a paragraph
    const seq = [];
    L.learn.forEach((p, i) => {
      seq.push({ tok: isToken(p), raw: p });
      if (subj === 'math') ((window.PICS || {})[n - 1] || []).filter(x => x[0] === i).forEach(x => seq.push({ tok: true, raw: x[1], pic: true }));
    });
    if (seq[0].tok) fail(tag, 'opens with a picture instead of a sentence');
    seq.forEach((it, k) => {
      if (!it.tok) return;
      // walk to the nearest text paragraph before and after this picture (skipping other pictures)
      let a = k - 1; while (a >= 0 && seq[a].tok) a--;
      let z = k + 1; while (z < seq.length && seq[z].tok) z++;
      const lead = a >= 0 ? strip(seq[a].raw) : '', after = z < seq.length ? strip(seq[z].raw) : '', near = lead + ' ' + after;
      if (!lead) return fail(tag, 'picture with no sentence before it:', it.raw);
      const args = it.raw.replace(/^\s*\[\[[a-z]+:|\]\]\s*$/g, '');
      const shared = numsOf(args).filter(x => new RegExp('\\b' + x + '\\b').test(near)).length + wordsOf(args).filter(x => near.toLowerCase().includes(x)).length;
      if (!POINTS.test(near) && shared < 1) fail(tag, 'nothing in the neighbouring sentences points at the picture', it.raw.slice(0, 50), '| before:', lead.slice(0, 70));
      // a picture must sit next to the sentence about it: not more than 1 other text paragraph between
    });
    L.learn.forEach(p => {
      const t = strip(p);
      if (!isToken(p) && PARENT.test(t)) fail(tag, 'parent-directed wording in child text:', t.slice(0, 80));
      if (t.length >= 50) { const k = subj + '|' + t; if (seenPara.has(k)) fail(tag, 'paragraph copied from', seenPara.get(k), ':', t.slice(0, 60)); else seenPara.set(k, id); }
    });
    const d = (window.DEEP || {})[id];
    if (d && d.worked && d.worked.t) { const k = subj + '|' + d.worked.t.toLowerCase(); if (seenWorked.has(k)) fail(tag, 'same worked example title as', seenWorked.get(k), ':', d.worked.t); else seenWorked.set(k, id); }
    L.q.forEach((q, qi) => {
      const hasPic = q.p || (subj === 'math' && (window.QPICS || {})[(n - 1) + ':' + qi]) || (subj === 'math' && (window.GENS || {})[(n - 1) + ':' + qi]);
      if (/\b(picture|graph|diagram|number line)\b/i.test(q.q) && !hasPic && !/draw|imagine|picture (a|an|the)? ?(line|queue)|in your head/i.test(q.q)) fail(tag, 'question mentions a picture but has none:', q.q.slice(0, 70));
    });
    const links = (window.LINKS || {})[id] || [], urls = new Set();
    links.forEach(l => {
      if (!/^https:\/\/[^ ]+\.[^ ]+/.test(l[1])) fail(tag, 'link is not a full https URL:', l[1]);
      if (!l[0] || l[0].length < 6 || !l[2]) fail(tag, 'link missing title or description:', l[1]);
      if (urls.has(l[1])) fail(tag, 'link repeated in the same lesson:', l[1]); urls.add(l[1]);
    });
  }));
}
console.log(bad ? bad + ' coherence problems' : 'coherence checks OK'); process.exit(bad ? 1 : 0);
