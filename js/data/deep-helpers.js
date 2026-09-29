/* Longer explanations shown under the Learn tab. D(id, why[], [workedTitle, ...steps], watch[], talk[], words[[word, meaning]]) */
window.DEEP = window.DEEP || {};
window.D = (id, why, worked, watch, talk, words) => { window.DEEP[id] = { why, worked: { t: worked[0], s: worked.slice(1) }, watch, talk, words }; };
