/* Authoring shortcuts for the English and Science data files. */
window.MC = (l, q, o, a, h, s) => ({ l, q, o, a, h, s });   // multiple choice: a must be one of o
window.TP = (l, q, a, h, s) => ({ l, q, a, h, s });         // typed answer
window.LS = (t, sk, goal, key, learn, doit, tip, parent, q) => ({ t, sk, goal, key, learn, do: doit, tip, parent, q });
