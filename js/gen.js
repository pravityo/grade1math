/* Randomised question generators. Each returns { q, a, h?, s?, u?, o?, p? } and is called
   every time a lesson is opened, so numbers change from evening to evening.
   Slots are wired to generators in js/data/gens.js ("lessonIndex:questionIndex" -> name). */
(function () {
  const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[R(0, a.length - 1)];
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = R(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const NAMES = ['Ali', 'Ben', 'Cara', 'Dan', 'Eva', 'Mei', 'Sam', 'Tia', 'Lin', 'Zoe', 'Kim', 'Raj', 'Nia', 'Leo'];
  const two = () => { const a = pick(NAMES); let b = pick(NAMES); while (b === a) b = pick(NAMES); return [a, b]; };
  const ones = n => n % 10, tens = n => Math.floor(n / 10) % 10;
  const G = {};

  /* ---------- week 1 ---------- */
  G.bond10 = () => {
    const t = R(0, 2);
    if (t === 2) { const a = R(1, 6), b = R(1, 8 - a); return { q: `Find the missing number: ${a} + ${b} + ? = 10`, a: 10 - a - b, h: `Add ${a} + ${b} first.`, s: `${a} + ${b} = ${a + b}, and ${a + b} + ${10 - a - b} = 10.` }; }
    const a = R(1, 9);
    return { q: t ? `Find the missing number: 10 = ? + ${a}` : `Find the missing number: ${a} + ? = 10`, a: 10 - a, h: 'Picture a ten-frame.', s: `${a} + ${10 - a} = 10.` };
  };
  G.bond20 = () => {
    let n; do { n = R(4, 16); } while (n === 10);
    return R(0, 1) ? { q: `Find the missing number: ${n} + ? = 20`, a: 20 - n, s: `${n} + ${20 - n} = 20.` } : { q: `Work out: 20 - ${n} = ?`, a: 20 - n, s: `${n} + ${20 - n} = 20, so 20 - ${n} = ${20 - n}.` };
  };
  const cross = (la, ha, lb, hb, max) => () => {
    let a, b; do { a = R(la, ha); b = R(lb, hb); } while (a + b <= 10 || a + b > max);
    const [x, y] = R(0, 1) ? [a, b] : [b, a], big = Math.max(a, b), small = Math.min(a, b);
    return { q: `Work out: ${x} + ${y} = ?`, a: a + b, h: `Make 10 first: how many does ${big} need?`, s: `${big} + ${10 - big} = 10, and ${small} - ${10 - big} = ${small - (10 - big)} left, so 10 + ${small - (10 - big)} = ${a + b}.` };
  };
  G.cross10 = cross(6, 9, 4, 9, 18);
  G.cross20 = cross(7, 9, 6, 11, 20);
  G.threeTen = () => {
    const x = R(1, 9), z = 10 - x, y = R(3, 9), ord = shuffle([x, y, z]);
    return { q: `Work out: ${ord.join(' + ')} = ?`, a: 10 + y, h: 'Look for two numbers that make 10.', s: `${x} + ${z} = 10, then 10 + ${y} = ${10 + y}.` };
  };
  G.threeAdd = () => {
    let a, b, c; do { a = R(4, 9); b = R(4, 9); c = R(4, 9); } while (a + b + c < 17);
    return { q: `Work out: ${a} + ${b} + ${c} = ?`, a: a + b + c, h: 'Look for a double or a pair that makes 10.', s: `${a} + ${b} = ${a + b}, and ${a + b} + ${c} = ${a + b + c}.` };
  };
  G.nearDouble = () => {
    const k = R(6, 9), t = R(0, 2);
    if (t === 0) return { q: `Work out: ${k} + ${k} = ?`, a: 2 * k, s: `Double ${k} is ${2 * k}.` };
    const b = t === 1 ? k + 1 : k - 1, [x, y] = R(0, 1) ? [k, b] : [b, k];
    return { q: `Work out: ${x} + ${y} = ?`, a: k + b, h: 'Is it a near-double?', s: `${k} + ${k} = ${2 * k}, then ${t === 1 ? 'add 1' : 'take away 1'} = ${k + b}.` };
  };
  G.sub20 = () => {
    const n = R(12, 18), m = R(n - 9, 9);
    return { q: `Work out: ${n} - ${m} = ?`, a: n - m, h: `Think: ${m} + ? = ${n}`, s: `${m} + ${10 - m} = 10, then ${n - 10} more, so ${10 - m} + ${n - 10} = ${n - m}.` };
  };
  G.sub20b = () => {
    if (R(0, 1)) { const x = R(4, 17); return { q: `Work out: 20 - ${x} = ?`, a: 20 - x, s: `${x} + ${20 - x} = 20.` }; }
    const n = R(15, 18), m = R(6, 9); return { q: `Work out: ${n} - ${m} = ?`, a: n - m, s: `${n} - ${m} = ${n - m}.` };
  };
  G.sub3 = () => {
    let a, b, c; do { a = R(15, 20); b = R(3, 8); c = R(3, 8); } while (a - b - c < 1);
    return { q: `Work out: ${a} - ${b} - ${c} = ?`, a: a - b - c, h: `Add ${b} + ${c} first.`, s: `${b} + ${c} = ${b + c}, ${a} - ${b + c} = ${a - b - c}.` };
  };
  G.missingAdd = () => { const a = R(6, 13), n = R(a + 3, 20); return { q: `Find the missing number: ${a} + ? = ${n}`, a: n - a, s: `${n} - ${a} = ${n - a}.` }; };
  G.missingSub = () => { const n = R(12, 20), m = R(4, n - 4); return { q: `Find the missing number: ${n} - ? = ${m}`, a: n - m, h: `${m} + ? = ${n}`, s: `${m} + ${n - m} = ${n}.` }; };
  G.sumDiff = () => {
    const small = R(4, 30), d = R(2, 9), big = small + d, S = small + big, big_ = R(0, 1);
    const item = pick(['birds', 'marbles', 'stickers', 'sweets']);
    const [x, y] = two();
    return { q: `${x} and ${y} have ${S} ${item} altogether. ${x} has ${d} more than ${y}. How many ${item} does ${big_ ? y : x} have?`, a: big_ ? small : big,
      h: `Take away the extra ${d}, then share equally.`, s: `${S} - ${d} = ${S - d}, half is ${small} (the smaller). The bigger is ${small} + ${d} = ${big}.` };
  };

  /* ---------- week 2 ---------- */
  G.tensOnes = () => { const t = R(3, 9), o = R(1, 9); return { q: `${t} tens and ${o} ones make what number?`, a: 10 * t + o, s: `${t * 10} + ${o} = ${10 * t + o}.` }; };
  G.tensMore = () => {
    const n = R(31, 89), k = R(1, 3) * 10, more = R(0, 1);
    return { q: `What is ${k} ${more ? 'more' : 'less'} than ${n}?`, a: more ? n + k : n - k, s: `Only the tens digit changes: ${more ? n + k : n - k}.` };
  };
  G.tensOnesBig = () => { const t = R(2, 6), o = R(11, 19); return { q: `${t} tens and ${o} ones make what number?`, a: 10 * t + o, h: `${o} ones is 1 ten and ${o - 10} ones.`, s: `${t * 10} + ${o} = ${10 * t + o}.` }; };
  G.skipSeq = () => {
    const step = pick([2, 3, 4, 5, 10]), start = step === 10 ? R(11, 59) : step === 5 ? 5 * R(2, 12) : R(1, 30), hole = R(2, 4);
    const seq = [0, 1, 2, 3, 4].map(i => start + i * step), a = seq[hole], txt = seq.map((v, i) => i === hole ? '?' : v).join(', ');
    return { q: `Count by ${step}s. Find the missing number: ${txt}`, a, s: `Each number is ${step} more than the one before.` };
  };
  G.skipWord = () => {
    const [f, k] = pick([[n => `How many fingers are on ${n} hands?`, 5], [n => `How many legs do ${n} chickens have?`, 2], [n => `How many wheels do ${n} cars have?`, 4], [n => `How many legs do ${n} cats have?`, 4], [n => `Each spider has 8 legs. How many legs do ${n} spiders have?`, 8], [n => `Each bicycle has 2 wheels. How many wheels do ${n} bicycles have?`, 2]]);
    const n = k >= 8 ? R(3, 6) : R(6, 9);
    return { q: f(n), a: n * k, h: 'Count in groups.', s: `${n} groups of ${k}: ${n} x ${k} = ${n * k}.` };
  };
  G.cmpRev = () => {
    let d1 = R(1, 9), d2 = R(1, 9); while (d1 === d2) d2 = R(1, 9);
    const a = 10 * d1 + d2, b = 10 * d2 + d1;
    return { q: `Which is bigger: ${a} or ${b}?`, o: [String(a), String(b)], a: String(Math.max(a, b)), s: 'Compare the tens first.' };
  };
  G.smallest4 = () => {
    const ds = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3), [x, y, z] = ds, nums = shuffle([10 * x + y, 10 * y + x, 10 * x + z, 10 * z + x]);
    return { q: `Which is the smallest: ${nums.join(', ')}?`, a: Math.min(...nums), h: 'Compare the tens digits first.', s: `The smallest tens digit wins.` };
  };
  G.digitMake = () => {
    const ds = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3), big = R(0, 1), sorted = ds.slice().sort((a, b) => a - b);
    let a;
    if (big) a = +sorted.reverse().join('');
    else { const nz = sorted.findIndex(d => d > 0), arr = sorted.slice(); const f = arr.splice(nz, 1)[0]; a = +[f, ...arr].join(''); }
    return { q: `Use the digits ${shuffle(ds).join(', ')} once each. What is the ${big ? 'biggest' : 'smallest'} 3-digit number you can make? (A number cannot start with 0.)`, a, h: big ? 'Biggest digit goes first.' : 'Smallest digit (that is not 0) goes first.', s: `The ${big ? 'biggest' : 'smallest'} number is ${a}.` };
  };
  G.addTens = () => { const a = R(12, 79), b = 10 * R(2, 6); return { q: `Work out: ${a} + ${b} = ?`, a: a + b, s: `Only the tens digit changes.` }; };
  G.addBridge = () => { const a = R(35, 88), b = 10 * R(4, 9); return { q: `Work out: ${a} + ${b} = ?`, a: a + b, h: 'Crossing 100 is fine: tens add just like ones.', s: `${Math.floor(a / 10)} tens + ${b / 10} tens = ${Math.floor(a / 10) + b / 10} tens, plus ${ones(a)} ones = ${a + b}.` }; };
  G.addTens3 = () => { const a = R(12, 60), b = 10 * R(2, 5), c = R(2, 9); return { q: `Work out: ${a} + ${b} + ${c} = ?`, a: a + b + c, s: `${a} + ${b} = ${a + b}, then + ${c} = ${a + b + c}.` }; };
  G.parity = () => { const n = R(20, 99); return { q: `Is the number ${n} odd or even?`, o: ['odd', 'even'], a: n % 2 ? 'odd' : 'even', h: 'Look at the last digit.', s: `${n} ends in ${ones(n)}.` }; };
  G.parity2 = () => {
    const a = R(11, 59), b = R(11, 59), op = '+';
    return { q: `Without adding: is ${a} + ${b} odd or even?`, o: ['odd', 'even'], a: (a + b) % 2 ? 'odd' : 'even', h: 'Think odd + odd, even + odd...', s: `${a} is ${a % 2 ? 'odd' : 'even'}, ${b} is ${b % 2 ? 'odd' : 'even'}. The sum is ${(a + b) % 2 ? 'odd' : 'even'}.` };
  };
  G.growGap = () => {
    const s = R(1, 6), g = R(1, 3), seq = [s, s + g, s + 2 * g + 1, s + 3 * g + 3];
    // gaps: g, g+1, g+2, then g+3
    const v = [s]; for (let i = 0; i < 4; i++) v.push(v[i] + g + i);
    return { q: `Look at the pattern: ${v.slice(0, 4).join(', ')}, ? What number comes next?`, a: v[4], h: 'Look at the gaps between numbers.', s: `Gaps: ${g}, ${g + 1}, ${g + 2}, so next gap is ${g + 3}: ${v[3]} + ${g + 3} = ${v[4]}.` };
  };

  /* ---------- week 3 ---------- */
  const add2 = (carry) => {
    for (;;) {
      const a = R(12, 89), b = R(12, 89), c = ones(a) + ones(b) >= 10;
      if (carry ? c && ones(a) && ones(b) && a + b < 200 : (!c && ones(a) && ones(b) && tens(a) + tens(b) <= 9)) return [a, b];
    }
  };
  G.add2nc = () => { const [a, b] = add2(false); return { q: `Work out: ${a} + ${b} = ?`, a: a + b, s: `Tens: ${tens(a) + tens(b)}, ones: ${ones(a) + ones(b)}. Answer ${a + b}.` }; };
  G.add3d = () => { const h = R(1, 6), a = R(21, 59); let x = 100 * h + a, y; do { y = R(11, 39); } while (ones(x) + ones(y) >= 10 || tens(x) + tens(y) >= 10); return { q: `Work out: ${x} + ${y} = ?`, a: x + y, h: 'Add hundreds, tens and ones separately.', s: `${x} + ${y} = ${x + y}.` }; };
  G.add3nc = () => { let a, b, c; do { a = R(101, 399); b = R(11, 49); c = R(11, 49); } while (ones(a) + ones(b) + ones(c) >= 10 || tens(a) + tens(b) + tens(c) >= 10); return { q: `Work out: ${a} + ${b} + ${c} = ?`, a: a + b + c, s: `${a} + ${b} = ${a + b}, then + ${c} = ${a + b + c}.` }; };
  G.addWordNC = () => { const [n] = two(), [a, b] = add2(false), thing = pick(['pages', 'stickers', 'marbles', 'cards']), v = pick(['read', 'collected', 'found', 'saved']); return { q: `${n} ${v} ${a} ${thing} on Monday and ${b} on Tuesday. How many ${thing} altogether?`, a: a + b, s: `${a} + ${b} = ${a + b}.` }; };
  G.digitPuzzle = () => {
    const o = R(1, 5), d = R(2, 4), t = o + d;
    return { q: `A 2-digit number has digits that add up to ${t + o}. The tens digit is ${d} more than the ones digit. What is the number?`, a: 10 * t + o, h: 'Try a few numbers.', s: `${t + o} - ${d} = ${t + o - d}, half is ${o} (ones). Tens = ${o} + ${d} = ${t}. Number is ${10 * t + o}.` };
  };
  G.add2c = () => { const [a, b] = add2(true); return { q: `Work out: ${a} + ${b} = ?`, a: a + b, h: 'Jump to the next ten first.', s: `${a} + ${10 - ones(a)} = ${a + 10 - ones(a)}, then + ${b - (10 - ones(a))} = ${a + b}.` }; };
  G.add2cBig = () => { let a, b; do { a = R(46, 89); b = R(46, 89); } while (ones(a) + ones(b) < 10 || !ones(a) || !ones(b)); return { q: `Work out: ${a} + ${b} = ?`, a: a + b, h: 'The answer will be more than 100.', s: `${a} + ${b} = ${a + b}.` }; };
  G.add3c = () => { let a, b, c; do { a = R(15, 65); b = R(15, 65); c = R(15, 65); } while (a + b + c > 190 || ones(a) + ones(b) < 10 || !ones(c)); return { q: `Work out: ${a} + ${b} + ${c} = ?`, a: a + b + c, s: `${a} + ${b} = ${a + b}, then + ${c} = ${a + b + c}.` }; };
  const sub2 = borrow => {
    for (;;) {
      const a = R(22, 99), b = R(11, a - 5), bo = ones(a) < ones(b);
      if (borrow ? bo && ones(b) : (!bo && ones(b) && ones(a) !== ones(b))) return [a, b];
    }
  };
  G.sub2nb = () => { const [a, b] = sub2(false); return { q: `Work out: ${a} - ${b} = ?`, a: a - b, s: `Tens: ${tens(a)} - ${tens(b)}, ones: ${ones(a)} - ${ones(b)}. Answer ${a - b}.` }; };
  G.sub3dnb = () => { let a, b; do { a = R(120, 399); b = R(11, 89); } while (ones(a) < ones(b) || tens(a) < tens(b) || !ones(b) || ones(a) === ones(b)); return { q: `Work out: ${a} - ${b} = ?`, a: a - b, s: `${a} - ${b} = ${a - b}.` }; };
  G.diffBig = () => { const d = R(6, 19), big = R(30, 60); const s = big - d; return { q: `Two numbers differ by ${d}. The bigger number is ${big}. What is their sum?`, a: big + s, h: 'Find the smaller number first.', s: `Smaller = ${big} - ${d} = ${s}. Sum = ${big} + ${s} = ${big + s}.` }; };
  G.subB = () => { const [a, b] = sub2(true); return { q: `Work out: ${a} - ${b} = ?`, a: a - b, h: 'Count up from the small number.', s: `${b} + ${a - b} = ${a}, so ${a} - ${b} = ${a - b}.` }; };
  G.subBBig = () => { let a, b; do { a = R(101, 190); b = R(31, 89); } while (ones(a) >= ones(b) || a - b < 10); return { q: `Work out: ${a} - ${b} = ?`, a: a - b, h: 'You may need to break a ten.', s: `${a} - ${b} = ${a - b}.` }; };
  G.from100 = () => { const b = R(11, 89); return { q: `Work out: 100 - ${b} = ?`, a: 100 - b, s: `${b} + ${100 - b} = 100.` }; };
  G.giveBack = () => { const [x, y] = two(), a = R(50, 95), b = R(11, 35), c = R(3, 10); return { q: `${x} has ${a} stickers. ${x} gives ${b} to ${y}. Then ${y} gives ${c} back. How many stickers does ${x} have now?`, a: a - b + c, s: `${a} - ${b} = ${a - b}, then + ${c} = ${a - b + c}.` }; };
  G.undo2 = () => { const a = R(11, 30), b = R(11, 30), n = R(31, 80); return { q: `I subtract ${a} from a number, then add ${b}. I get ${n - a + b}. What was the number?`, a: n, h: 'Undo the steps in reverse order.', s: `${n - a + b} - ${b} = ${n - a}, then + ${a} = ${n}.` }; };
  G.undo1 = () => { const a = R(3, 9), b = R(2, 7), n = R(4, 30); return { q: `I think of a number. I add ${a}, then subtract ${b}. I get ${n + a - b}. What was my number?`, a: n, h: 'Work backwards: undo the last step first.', s: `${n + a - b} + ${b} = ${n + a}, then - ${a} = ${n}.` }; };
  const w = {
    more: () => { const [x, y] = two(), a = R(20, 80), b = R(11, 39), t = pick(['marbles', 'stickers', 'cards']); return { q: `${x} has ${a} ${t}. ${y} has ${b} more. How many ${t} does ${y} have?`, a: a + b, s: `${a} + ${b} = ${a + b}.` }; },
    fewer: () => { const [x, y] = two(), a = R(40, 95), b = R(11, a - 12), t = pick(['stickers', 'marbles', 'cards']); return { q: `${x} has ${a} ${t}. ${y} has ${b} fewer. How many ${t} does ${y} have?`, a: a - b, s: `${a} - ${b} = ${a - b}.` }; },
    diff: () => { const [x, y] = two(), a = R(35, 90), b = R(16, a - 8), t = pick(['cards', 'stickers', 'coins']); return { q: `${x} has ${a} ${t}. ${y} has ${b} ${t}. How many more ${t} does ${x} have?`, a: a - b, s: `${a} - ${b} = ${a - b}.` }; },
    total: () => { const [x, y] = two(), a = R(25, 60), b = R(11, 25), t = pick(['stickers', 'marbles', 'cards']); return { q: `${x} has ${a} ${t}. ${y} has ${b} fewer than ${x}. How many ${t} do they have altogether?`, a: a + a - b, s: `${y}: ${a} - ${b} = ${a - b}. Together: ${a} + ${a - b} = ${2 * a - b}.` }; },
    left: () => { const [x] = two(), t = R(80, 120), r = R(31, 70); return { q: `A book has ${t} pages. ${x} has read ${r}. How many pages are left to read?`, a: t - r, s: `${t} - ${r} = ${t - r}.` }; }
  };
  G.word14b = () => pick([w.more, w.fewer])();
  G.word14c = () => pick([w.diff, w.total])();
  G.word14s = () => pick([w.left, G.giveBack])();
  G.queueBehind = () => { const n = R(25, 50), p = R(8, n - 6), [x] = two(); return { q: `${n} children stand in a line. ${x} is ${p}th from the front. How many children are behind ${x}?`, a: n - p, h: `${x} is counted in the first ${p}.`, s: `${n} - ${p} = ${n - p}.` }; };

  /* ---------- week 4 ---------- */
  G.hundreds = () => { const h = R(1, 9), t = R(0, 9), o = R(0, 9); return { q: `${h} hundreds, ${t} tens and ${o} ones make what number?`, a: 100 * h + 10 * t + o, s: `${h * 100} + ${t * 10} + ${o} = ${100 * h + 10 * t + o}.` }; };
  G.tensIn = () => { const n = 10 * R(11, 45); return { q: `How many tens are in ${n}?`, a: n / 10, s: `${n} = ${n / 10} tens.` }; };
  G.near9 = () => { const k = pick([9, 19, 29, 39]), a = R(21, 69); return { q: `Work out: ${a} + ${k} = ?`, a: a + k, h: `Add ${k + 1} and take 1 away.`, s: `${a} + ${k + 1} = ${a + k + 1}, minus 1 = ${a + k}.` }; };
  G.near100 = () => {
    const t = R(0, 2), a = R(23, 88);
    if (t === 0) return { q: `Work out: ${a} + 98 = ?`, a: a + 98, h: 'Add 100 then take away 2.', s: `${a} + 100 = ${a + 100}, minus 2 = ${a + 98}.` };
    if (t === 1) return { q: `Work out: ${a} + 99 = ?`, a: a + 99, h: 'Add 100 then take away 1.', s: `${a} + 100 = ${a + 100}, minus 1 = ${a + 99}.` };
    const b = R(101, 189); return { q: `Work out: ${b} - 99 = ?`, a: b - 99, h: 'Take away 100, then add 1 back.', s: `${b} - 100 = ${b - 100}, plus 1 = ${b - 99}.` };
  };
  G.near200 = () => { const a = R(101, 299), k = pick([199, 198, 299]); return { q: `Work out: ${a} + ${k} = ?`, a: a + k, h: `${k} is almost ${k > 250 ? 300 : 200}.`, s: `${a} + ${k > 250 ? 300 : 200} = ${a + (k > 250 ? 300 : 200)}, then take away ${(k > 250 ? 300 : 200) - k}.` }; };
  G.fiveConsec = () => { const s = R(11, 60); return { q: `Work out: ${s} + ${s + 1} + ${s + 2} + ${s + 3} + ${s + 4} = ?`, a: 5 * (s + 2), h: 'The middle number is a helper.', s: `Middle is ${s + 2}, five numbers: ${s + 2} x 5 = ${5 * (s + 2)}.` }; };
  G.double2 = () => { const n = R(21, 49); return { q: `Double ${n} = ?`, a: 2 * n, s: `Double ${Math.floor(n / 10) * 10} = ${2 * Math.floor(n / 10) * 10}, double ${ones(n)} = ${2 * ones(n)}. Total ${2 * n}.` }; };
  G.half2 = () => { const n = 2 * R(20, 49); return { q: `Half of ${n} = ?`, a: n / 2, s: `Half of ${n} is ${n / 2}.` }; };
  G.half3 = () => { const n = 2 * R(60, 149); return { q: `Half of ${n} = ?`, a: n / 2, h: 'Halve the hundreds, tens and ones.', s: `Half of ${n} is ${n / 2}.` }; };
  G.doubleThen = () => { const n = R(6, 30), a = R(3, 12); return { q: `I double a number and add ${a}. The answer is ${2 * n + a}. What is the number?`, a: n, h: 'Undo the steps in reverse.', s: `${2 * n + a} - ${a} = ${2 * n}, half of ${2 * n} = ${n}.` }; };
  G.multGroups = () => { const a = R(3, 6), b = R(3, 9), [thing, where] = pick([['cookies', 'plates'], ['apples', 'bags'], ['stickers', 'pages'], ['pencils', 'boxes']]); return { q: `${a} ${where} have ${b} ${thing} each. How many ${thing} are there in total?`, a: a * b, h: `${a} groups of ${b}.`, s: `${a} x ${b} = ${a * b}.` }; };
  G.mult = () => { const a = R(6, 9), b = R(3, 9); return { q: `Work out: ${a} x ${b} = ?`, a: a * b, h: `${b} groups of ${a}, or count on.`, s: `${a} x ${b} = ${a * b}.` }; };
  G.multStory = () => { const a = R(5, 9), b = R(3, 8), c = R(3, 12), [x] = two(); return { q: `${a} plates have ${b} cakes each. ${c} cakes are eaten. How many cakes are left?`, a: a * b - c, s: `${a} x ${b} = ${a * b}, then ${a * b} - ${c} = ${a * b - c}.` }; };
  G.headsLegs = () => { const H = R(6, 12), r = R(2, H - 3), L = 2 * H + 2 * r; return { q: `A farm has ${H} animals, some chickens (2 legs) and some rabbits (4 legs). There are ${L} legs in total. How many rabbits are there?`, a: r, h: 'Guess that all are chickens first, then swap.', s: `All chickens: ${2 * H} legs. Extra legs: ${L - 2 * H}. Each swap adds 2, so ${r} rabbits. Check: ${r} x 4 + ${H - r} x 2 = ${L}.` }; };
  G.divShare = () => { const k = R(3, 6), e = R(4, 9), [t, who] = pick([['sweets', 'children'], ['stickers', 'friends'], ['grapes', 'kids']]); return { q: `${k * e} ${t} are shared equally among ${k} ${who}. How many does each get?`, a: e, h: `${k} x ? = ${k * e}`, s: `${k * e} / ${k} = ${e}.` }; };
  G.div = () => { const k = R(3, 9), e = R(4, 9); return { q: `Work out: ${k * e} / ${k} = ?`, a: e, h: `${k} x ? = ${k * e}`, s: `${k} x ${e} = ${k * e}.` }; };
  G.divBags = () => { const k = R(4, 9), e = R(4, 9), t = pick(['cookies', 'sweets', 'stickers']); return { q: `${k * e} ${t} are packed in bags of ${k}. How many bags are needed?`, a: e, s: `${k * e} / ${k} = ${e}.` }; };
  G.ropeCuts = () => { const k = R(2, 4), p = R(4, 9); return { q: `A ${k * p} m rope is cut into pieces of ${k} m each. How many cuts are needed?`, a: p - 1, h: 'Draw the rope and mark each cut.', s: `${k * p} / ${k} = ${p} pieces. ${p} pieces need ${p} - 1 = ${p - 1} cuts.` }; };

  /* ---------- week 5 ---------- */
  const SH = [['triangle', 3], ['square', 4], ['pentagon', 5], ['hexagon', 6], ['octagon', 8]];
  G.sides = () => { const [n, k] = pick(SH); return { q: `How many sides does a ${n} have?`, a: k, s: `A ${n} has ${k} sides.` }; };
  G.sidesMix = () => { const [n1, k1] = pick(SH.slice(0, 3)), [n2, k2] = pick(SH.slice(3)), a = R(2, 4), b = R(2, 3); return { q: `${a} ${n1}s and ${b} ${n2}s. How many sides are there in total?`, a: a * k1 + b * k2, s: `${a} x ${k1} = ${a * k1}, ${b} x ${k2} = ${b * k2}. Total ${a * k1 + b * k2}.` }; };
  G.perimeter = () => { const [n, k] = pick(SH), x = R(3, 9); return { q: `A ${n} has all its sides equal, each ${x} cm long. How long is the distance all the way around it?`, a: k * x, u: 'cm', s: `${k} sides of ${x} cm: ${k} x ${x} = ${k * x}.` }; };
  G.cubeFact = () => { const [w_, v] = pick([['faces', 6], ['edges', 12], ['corners', 8]]); return { q: `How many ${w_} does a cube have?`, a: v, s: `A cube has ${v} ${w_}.` }; };
  G.cubesTotal = () => { const [w_, v] = pick([['faces', 6], ['edges', 12], ['corners', 8]]), n = R(2, 5); return { q: `A cube has ${v} ${w_}. How many ${w_} do ${n} cubes have altogether?`, a: n * v, s: `${n} x ${v} = ${n * v}.` }; };
  G.diceOpp = () => { const v = R(1, 6); return { q: `On a dice, the numbers on opposite faces add up to 7. What number is opposite the ${v}?`, a: 7 - v, s: `${v} + ${7 - v} = 7.` }; };
  G.diceSides = () => { const t = R(1, 6); return { q: `A dice sits on a table with ${t} on top. The bottom face is hidden. Opposite faces add up to 7, and all six faces add up to 21. What do the four side faces add up to?`, a: 14, h: 'What is the bottom face?', s: `Bottom is 7 - ${t} = ${7 - t}. Sides = 21 - ${t} - ${7 - t} = 14. It is always 14!` }; };
  G.ribbon = () => { const k = R(2, 6), p = R(3, 9); return { q: `A ${k * p} cm ribbon is cut into ${k} equal pieces. How long is each piece?`, a: p, u: 'cm', s: `${k * p} / ${k} = ${p}.` }; };
  G.longer = () => { const [x, y] = two(), a = R(15, 60), b = R(6, 14), lon = R(0, 1); return { q: `${x}'s rope is ${a} cm. ${y}'s rope is ${b} cm ${lon ? 'longer' : 'shorter'}. How long is ${y}'s rope?`, a: lon ? a + b : a - b, u: 'cm', s: `${a} ${lon ? '+' : '-'} ${b} = ${lon ? a + b : a - b}.` }; };
  G.stack = () => { const n = R(3, 9), t = R(3, 9); return { q: `${n} books are stacked. Each is ${t} cm thick. How tall is the stack?`, a: n * t, u: 'cm', s: `${n} x ${t} = ${n * t}.` }; };
  G.brokenRuler = () => { const a = R(2, 7), l = R(4, 12); return { q: `A pencil starts at the ${a} cm mark of a ruler and ends at the ${a + l} cm mark. How long is the pencil?`, a: l, u: 'cm', p: `[[ruler:${a},${a + l}]]`, s: `${a + l} - ${a} = ${l} cm.` }; };
  const clk = (h, m) => { h = ((h - 1) % 12 + 12) % 12 + 1; return `${h}:${String(m).padStart(2, '0')}`; };
  G.timeWrite = () => {
    const t = R(0, 2), h = R(1, 12);
    if (t === 0) return { q: `Write half past ${h} as a digital time (like 4:00).`, a: [clk(h, 30), clk(h, 30).replace(':', '')], s: `Half past ${h} is ${clk(h, 30)}.` };
    if (t === 1) return { q: `Write quarter past ${h} as a digital time (like 4:00).`, a: [clk(h, 15), clk(h, 15).replace(':', '')], s: `Quarter past ${h} is ${clk(h, 15)}.` };
    return { q: `Write quarter to ${h} as a digital time (like 4:00).`, a: [clk(h - 1, 45), clk(h - 1, 45).replace(':', '')], h: 'Quarter to means 15 minutes before.', s: `Quarter to ${h} is ${clk(h - 1, 45)}.` };
  };
  G.timeAfter = () => { const h = R(1, 12), k = R(1, 4), m = pick([0, 30]); return { q: `What time is it ${k} hour${k > 1 ? 's' : ''} and 30 minutes after ${clk(h, m)}?`, a: (() => { let hh = h + k, mm = m + 30; if (mm >= 60) { mm -= 60; hh++; } return clk(hh, mm); })(), h: 'Add the hours, then the 30 minutes.', s: 'Add hours first, then 30 minutes.' }; };
  G.timeEnd = () => { const h = R(1, 11), d = R(2, 4), m = pick([0, 30]); return { q: `A film starts at ${clk(h, m)} and lasts ${d} hours and 30 minutes. What time does it end?`, a: (() => { let hh = h + d, mm = m + 30; if (mm >= 60) { mm -= 60; hh++; } return clk(hh, mm); })(), s: `${d} hours later is ${clk(h + d, m)}, plus 30 minutes.` }; };
  const DAYS7 = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  G.dayAfter = () => { const i = R(0, 6), n = R(9, 30), cap = s => s[0].toUpperCase() + s.slice(1); return { q: `Today is ${cap(DAYS7[i])}. What day will it be in ${n} days?`, a: DAYS7[(i + n) % 7], h: 'Every 7 days it is the same day again.', s: `${n} = ${Math.floor(n / 7)} weeks and ${n % 7} days. ${n % 7} days after ${cap(DAYS7[i])} is ${cap(DAYS7[(i + n) % 7])}.` }; };
  G.coinSum = () => { const cs = [50, 20, 10, 5], n = R(3, 4), pickc = Array.from({ length: n }, () => pick(cs)), tot = pickc.reduce((a, b) => a + b, 0); return { q: `${pickc.map(c => c + 'c').join(' + ')} = ? cents`, a: tot, u: 'cents', s: `Total ${tot} cents.` }; };
  G.change = () => { const c = 5 * R(5, 19), pay = R(0, 1) ? 100 : 200, cost = pay === 100 ? c : 5 * R(21, 39); return { q: `An item costs ${cost} cents. You pay ${pay === 100 ? '$1' : '$2'}. How many cents change do you get?`, a: pay - cost, u: 'cents', h: `${pay === 100 ? '$1' : '$2'} is ${pay} cents.`, s: `${pay} - ${cost} = ${pay - cost}.` }; };
  G.coinMix = () => { const a = R(2, 4), b = R(2, 4), c = R(2, 5), [x] = two(); return { q: `${x} has ${a} coins of 50c, ${b} coins of 20c and ${c} coins of 10c. How many cents does ${x} have?`, a: 50 * a + 20 * b + 10 * c, u: 'cents', s: `${50 * a} + ${20 * b} + ${10 * c} = ${50 * a + 20 * b + 10 * c}.` }; };
  G.fewestCoins = () => { const amt = 5 * R(11, 39); let r = amt, n = 0; [100, 50, 20, 10, 5].forEach(c => { n += Math.floor(r / c); r %= c; }); return { q: `You have lots of 5c, 10c, 20c, 50c and $1 coins. What is the fewest number of coins needed to make ${amt} cents?`, a: n, h: 'Use the biggest coin first.', s: `Biggest coins first uses ${n} coins.` }; };

  /* ---------- week 6 ---------- */
  G.halfOf = () => { const n = 2 * R(7, 45); return { q: `Half of ${n} = ?`, a: n / 2, s: `Half of ${n} is ${n / 2}.` }; };
  G.halfHalf = () => { const n = 4 * R(3, 25); return { q: `Half of half of ${n} = ?`, a: n / 4, s: `Half of ${n} is ${n / 2}, half of that is ${n / 4}.` }; };
  G.quarterOf = () => { const n = 4 * R(3, 25); return { q: `A quarter of ${n} = ?`, a: n / 4, s: `${n} / 4 = ${n / 4}.` }; };
  G.threeQuarters = () => { const n = 4 * R(3, 20); return { q: `3/4 of ${n} = ?`, a: 3 * n / 4, h: 'Find one quarter first.', s: `A quarter is ${n / 4}, so 3 quarters is ${3 * n / 4}.` }; };
  G.quarterUnknown = () => { const q = R(4, 15); return { q: `One quarter of a number is ${q}. What is the number?`, a: 4 * q, s: `4 equal parts of ${q}: ${4 * q}.` }; };
  G.quartersIn = () => { const w_ = R(3, 9); return { q: `How many quarters are in ${w_} whole pizzas?`, a: 4 * w_, s: `4 quarters in each whole: ${w_} x 4 = ${4 * w_}.` }; };
  G.fracSet = () => { const [d] = pick([[3], [5], [3], [6]]), n = d * R(3, 12); return { q: `1/${d} of ${n} = ?`, a: n / d, s: `${n} / ${d} = ${n / d}.` }; };
  G.fracSet2 = () => { const [d, k] = pick([[3, 2], [4, 3], [5, 2], [5, 3], [6, 5]]), n = d * R(2, 9); return { q: `${k}/${d} of ${n} = ?`, a: k * n / d, h: `Find 1/${d} first.`, s: `1/${d} of ${n} is ${n / d}, so ${k}/${d} is ${k * n / d}.` }; };
  G.buns = () => { const m = R(1, 4); return { q: `Mum bakes ${12 * m} buns. The family eats 1/3 of them and a friend eats 1/4 of them. How many buns are left?`, a: 5 * m, s: `1/3 is ${4 * m}, 1/4 is ${3 * m}. ${12 * m} - ${4 * m} - ${3 * m} = ${5 * m}.` }; };
  G.marbles = () => { const g = R(3, 9); return { q: `Half of my marbles are red, a quarter are blue, and the other ${g} are green. How many marbles do I have?`, a: 4 * g, h: 'What fraction is green?', s: `Half + quarter = 3/4. Green = 1/4 = ${g}. Total = ${4 * g}.` }; };
  const FR = [['apples', 'bananas', 'grapes'], ['cats', 'dogs', 'fish'], ['cars', 'buses', 'bikes']];
  const gdata = () => { const nm = pick(FR); let v; do { v = [R(2, 9), R(2, 9), R(2, 9)]; } while (new Set(v).size < 3); return { nm, v, tx: nm.map((n, i) => `${n} ${v[i]}`).join(', '), pic: `[[graph:${nm.map((n, i) => n + ' ' + v[i]).join(',')}]]` }; };
  G.graphTotal = () => { const d = gdata(); return { q: `A picture graph shows ${d.tx}. How many are there in total?`, a: d.v[0] + d.v[1] + d.v[2], p: d.pic, s: `${d.v.join(' + ')} = ${d.v[0] + d.v[1] + d.v[2]}.` }; };
  G.graphMost = () => { const d = gdata(), i = d.v.indexOf(Math.max(...d.v)); return { q: `A picture graph shows ${d.tx}. Which one has the most?`, o: d.nm, a: d.nm[i], p: d.pic, s: `${d.nm[i]} has ${d.v[i]}, the most.` }; };
  G.graphDiff = () => { const d = gdata(), i = d.v.indexOf(Math.max(...d.v)), j = d.v.indexOf(Math.min(...d.v)); return { q: `A picture graph shows ${d.tx}. How many more ${d.nm[i]} than ${d.nm[j]}?`, a: d.v[i] - d.v[j], p: d.pic, s: `${d.v[i]} - ${d.v[j]} = ${d.v[i] - d.v[j]}.` }; };
  G.graphAdd = () => { const d = gdata(), k = R(3, 7); return { q: `A picture graph shows ${d.tx}. If ${k} more ${d.nm[1]} are added, how many ${d.nm[1]} are there now?`, a: d.v[1] + k, p: d.pic, s: `${d.v[1]} + ${k} = ${d.v[1] + k}.` }; };
  G.tallyRead = () => { const g = R(1, 4), r = R(1, 4); return { q: `A tally has ${g} bundle${g > 1 ? 's' : ''} of five (four lines with a slash across them) and then ${r} more line${r > 1 ? 's' : ''}. What number is that?`, a: 5 * g + r, p: `[[tally:${5 * g + r}]]`, s: `${g} x 5 = ${5 * g}, plus ${r} = ${5 * g + r}.` }; };
  G.animals = () => { const d = R(3, 8), t = R(2, 3), m = R(2, 5); return { q: `There are ${d} dogs. There are ${t === 2 ? 'twice' : 'three times'} as many cats as dogs. There are ${m} fewer birds than cats. How many pets altogether?`, a: d + t * d + (t * d - m), h: 'Find the cats first, then the birds.', s: `Cats ${t * d}, birds ${t * d - m}. ${d} + ${t * d} + ${t * d - m} = ${d + t * d + t * d - m}.` }; };
  const TOP = [['cats', 'dogs'], ['swimming', 'cycling'], ['pizza', 'noodles'], ['football', 'chess']];
  const vd = () => { const [n1, n2] = pick(TOP), a = R(6, 15), b = R(5, 14), x = R(2, Math.min(a, b) - 2); return { n1, n2, a, b, x }; };
  G.vennAny = () => { const d = vd(); return { q: `In a class, ${d.a} children like ${d.n1} and ${d.b} children like ${d.n2}. ${d.x} children like both (they are counted in the ${d.a} and in the ${d.b}). How many children like at least one of them?`, a: d.a + d.b - d.x, h: 'Do not count the "both" children twice.', s: `${d.a} + ${d.b} = ${d.a + d.b}, minus ${d.x} counted twice = ${d.a + d.b - d.x}.` }; };
  G.vennOnly = () => { const d = vd(); return { q: `In a class, ${d.a} children like ${d.n1} and ${d.b} children like ${d.n2}. ${d.x} children like both (they are counted in the ${d.a} and in the ${d.b}). How many children like ONLY ${d.n1}?`, a: d.a - d.x, s: `${d.a} - ${d.x} = ${d.a - d.x}.` }; };
  G.vennBoth = () => { const T = R(10, 30), a = R(Math.ceil(T / 2) + 1, T - 2), b = R(T - a + 2, T - 1), [n1, n2] = pick([['glasses', 'a watch'], ['a dog', 'a cat'], ['swim', 'cycle']]); return { q: `In a group of ${T} children, ${a} have ${n1} and ${b} have ${n2}. Every child has at least one of them. How many children have both?`, a: a + b - T, h: 'Add them, then see how many too many you counted.', s: `${a} + ${b} = ${a + b}. That is ${a + b - T} more than ${T}, so ${a + b - T} have both.` }; };

  /* ---------- week 7 ---------- */
  G.gaussSmall = () => { const n = R(6, 9); return { q: `Work out: 1 + 2 + 3 + ... + ${n} = ?`, a: n * (n + 1) / 2, h: 'Pair the first and last.', s: `Pairs of ${n + 1}. Answer ${n * (n + 1) / 2}.` }; };
  G.gaussMid = () => { const n = R(10, 20), rev = R(0, 1); return { q: rev ? `Work out: ${n} + ${n - 1} + ... + 2 + 1 = ?` : `Work out: 1 + 2 + 3 + ... + ${n} = ?`, a: n * (n + 1) / 2, h: 'Pair the first and last numbers.', s: `Pairs adding to ${n + 1}. ${n} numbers make ${n / 2} pairs: ${n * (n + 1) / 2}.` }; };
  G.gaussBig = () => { const n = 2 * R(11, 25); return { q: `Work out: 1 + 2 + 3 + ... + ${n} = ?`, a: n * (n + 1) / 2, h: `Pairs that add to ${n + 1}.`, s: `${n / 2} pairs of ${n + 1}: ${n / 2} x ${n + 1} = ${n * (n + 1) / 2}.` }; };
  G.evenSum = () => { const n = R(5, 12); return { q: `Work out: 2 + 4 + 6 + ... + ${2 * n} = ?`, a: n * (n + 1), h: 'Pair the first and last.', s: `2 x (1 + 2 + ... + ${n}) = 2 x ${n * (n + 1) / 2} = ${n * (n + 1)}.` }; };
  G.handshakes = () => { const n = R(5, 10); return { q: `${n} friends each shake hands once with each of the others. How many handshakes are there in total?`, a: n * (n - 1) / 2, h: 'First person shakes hands with all the others.', s: `${[...Array(n - 1)].map((_, i) => n - 1 - i).join(' + ')} = ${n * (n - 1) / 2}.` }; };
  G.countRange = () => { const a = R(3, 25), b = a + R(6, 22); return { q: `How many numbers are there from ${a} to ${b} (counting both ${a} and ${b})?`, a: b - a + 1, s: `${b} - ${a} + 1 = ${b - a + 1}.` }; };
  G.countPages = () => { const [x] = two(), a = R(3, 30), b = a + R(6, 40); return { q: `${x} reads from page ${a} to page ${b}, including both. How many pages is that?`, a: b - a + 1, s: `${b} - ${a} + 1 = ${b - a + 1}.` }; };
  G.trees = () => { const k = pick([2, 3, 4, 5]), n = R(4, 9); return { q: `Trees are planted ${k} m apart along a ${k * n} m road, with a tree at both ends. How many trees?`, a: n + 1, h: 'Count the gaps, then add 1.', s: `${n} gaps means ${n + 1} trees.` }; };
  G.gaps = () => { const n = R(8, 25); return { q: `There are ${n} posts in a straight line. How many gaps are there between them?`, a: n - 1, s: `${n} - 1 = ${n - 1}.` }; };
  G.count2d = () => { const a = R(10, 40), b = R(60, 99); return { q: `How many whole numbers are there from ${a} to ${b}, counting both ${a} and ${b}?`, a: b - a + 1, s: `${b} - ${a} + 1 = ${b - a + 1}.` }; };
  G.fence = () => {
    if (R(0, 1)) { const k = pick([2, 3, 4, 5]), n = R(4, 9); return { q: `A ${k * n} m fence has posts every ${k} m, with a post at each end. How many posts are needed?`, a: n + 1, p: `[[fence:${k * n},${k}]]`, h: 'Gaps + 1.', s: `${n} gaps, ${n + 1} posts.` }; }
    const k = pick([2, 3, 4, 5]), n = R(5, 10); return { q: `A fence goes all the way around a round pond (a closed loop) that is ${k * n} m around. Posts are ${k} m apart. There is no start or end. How many posts are needed?`, a: n, h: 'On a loop the last gap joins the first post.', s: `${k * n} / ${k} = ${n} posts. On a loop there are as many posts as gaps.` };
  };
  G.arith = () => { const a = R(2, 20), s = R(2, 9), st = [0, 1, 2, 3, 4].map(i => a + i * s); return { q: `${st.join(', ')}, ? What number comes next?`, a: a + 5 * s, h: 'What is added each time?', s: `Add ${s} each time: ${st[4]} + ${s} = ${a + 5 * s}.` }; };
  G.dbl = () => { const a = R(1, 5), m = pick([2, 3]), v = [a, a * m, a * m * m, a * m * m * m]; return { q: `${v.join(', ')}, ? What number comes next?`, a: a * m ** 4, h: `Each number is ${m} times the one before.`, s: `${v[3]} x ${m} = ${a * m ** 4}.` }; };
  G.fibLike = () => { const a = R(1, 4), b = R(1, 4), v = [a, b]; for (let i = 2; i < 7; i++) v.push(v[i - 1] + v[i - 2]); return { q: `${v.slice(0, 6).join(', ')}, ? What number comes next? (Each number is the two before it added together.)`, a: v[6], s: `${v[4]} + ${v[5]} = ${v[6]}.` }; };
  G.decGap = () => { const s = R(20, 40), d = R(1, 2), v = [s]; for (let i = 0; i < 4; i++) v.push(v[i] - (d + i)); return { q: `${v.slice(0, 4).join(', ')}, ? What number comes next?`, a: v[4], h: 'Look at the gaps.', s: `Gaps ${d}, ${d + 1}, ${d + 2}, next ${d + 3}: ${v[3]} - ${d + 3} = ${v[4]}.` }; };
  G.repeat = () => { const blocks = ['ABB', 'AAB', 'ABC', 'ABBB', 'AABB'], b = pick(blocks), n = R(10, 25); return { q: `The pattern ${[...b.repeat(4)].slice(0, 9).join(' ')} ... keeps repeating. What is letter number ${n}?`, o: [...new Set([...b])].sort(), a: b[(n - 1) % b.length], h: `The block is ${b} (${b.length} letters long).`, s: `${n} - 1 = ${n - 1}. Divide by ${b.length}: remainder ${(n - 1) % b.length}. So it is the letter at place ${(n - 1) % b.length + 1} of ${b}: ${b[(n - 1) % b.length]}.` }; };
  G.squares = () => { const m = R(1, 5), v = [0, 1, 2, 3].map(i => (m + i) ** 2); return { q: `${v.join(', ')}, ? What number comes next?`, a: (m + 4) ** 2, h: 'Look at the gaps: they go up by 2 each time.', s: `The gaps go up by 2 each time. The next square is ${(m + 4) ** 2}.` }; };
  G.queueTotal = () => { const k = R(3, 9), m = R(3, 9), [x] = two(); return { q: `${x} is ${k}th from the front and ${m}th from the back in a queue. How many children are in the queue?`, a: k + m - 1, h: `${x} is counted twice.`, s: `${k} + ${m} - 1 = ${k + m - 1}.` }; };
  G.queueBetween = () => { const a = R(2, 8), b = a + R(4, 12), [x, y] = two(); return { q: `In a line, ${x} is ${a}th from the front and ${y} is ${b}th from the front. How many children are between ${x} and ${y}?`, a: b - a - 1, s: `${b} - ${a} - 1 = ${b - a - 1}.` }; };
  G.rankOrder = () => { const [x, y, z] = shuffle(NAMES).slice(0, 3), t = R(0, 1); return { q: `${x} is ${t ? 'taller' : 'faster'} than ${y}. ${y} is ${t ? 'taller' : 'faster'} than ${z}. Who is the ${t ? 'shortest' : 'slowest'}?`, o: shuffle([x, y, z]), a: z, s: `Order: ${x}, ${y}, ${z}.` }; };
  G.missingAddBig = () => { const a = R(6, 39), n = a + R(8, 40); return { q: `Find the missing number: ? + ${a} = ${n}`, a: n - a, s: `${n} - ${a} = ${n - a}.` }; };
  G.missingSubBig = () => { const b = R(6, 39), n = R(b + 6, b + 50); return { q: `Find the missing number: ? - ${b} = ${n - b}`, a: n, s: `${n - b} + ${b} = ${n}.` }; };
  G.magicRow = () => { const S = pick([15, 15, 18, 21, 24]), a = R(3, S / 2 - 2), b = R(3, S - a - 1); return { q: `In a magic square, every row adds up to ${S}. One row is ${a}, ?, ${b}. What is the missing number?`, a: S - a - b, s: `${a} + ${b} = ${a + b}, and ${S} - ${a + b} = ${S - a - b}.` }; };
  G.addSub = () => { const a = R(9, 30), b = R(8, 30), c = R(3, 9); return { q: `Two numbers are ${a} and ${b}. Add them and then subtract ${c}. What do you get?`, a: a + b - c, s: `${a} + ${b} = ${a + b}, then - ${c} = ${a + b - c}.` }; };
  G.digitBoxes = () => { const d = R(2, 8), t = R(1, 8), c = R(1, 9), A = 10 * t + d, B = 10 * d + c; return { q: `Both boxes hide the same digit. ${t}\u25A1 means ${t} tens and some ones. \u25A1${c} means some tens and ${c} ones. If ${t}\u25A1 + \u25A1${c} = ${A + B}, what digit is in the box?`, a: d, h: 'Try a digit and check.', s: `${A} + ${B} = ${A + B}, so the box is ${d}.` }; };
  G.bigSmall = () => { const ds = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3).sort((a, b) => a - b), big = +[...ds].reverse().join(''), small = +ds.join(''); return { q: `Use the digits ${shuffle(ds).join(', ')} once each to make the biggest 3-digit number. Then make the smallest. What is the biggest minus the smallest?`, a: big - small, s: `${big} - ${small} = ${big - small}.` }; };

  /* ---------- week 8 ---------- */
  G.ageOlder = () => { const [x, y] = two(), a = R(5, 12), g = R(2, 6); return { q: `${x} is ${a}. ${y} is ${g} years older. How old is ${y}?`, a: a + g, s: `${a} + ${g} = ${a + g}.` }; };
  G.ageWhen = () => { const [x, y] = two(), a = R(8, 12), b = R(3, a - 2), n = R(2, 6); return { q: `${x} is ${a} and ${x}'s sister ${y} is ${b}. How old will ${y} be when ${x} is ${a + n}?`, a: b + n, s: `${n} years pass. ${b} + ${n} = ${b + n}.` }; };
  G.ageFuture = () => { const a = R(5, 8), g = R(2, 5), n = R(3, 8), [x, y] = two(); return { q: `${x} is ${a}. ${y} is ${g} years older. How old will ${y} be in ${n} years?`, a: a + g + n, s: `${y} is ${a + g} now, in ${n} years ${a + g + n}.` }; };
  G.ageGap = () => { const g = R(24, 34), a = R(5, 8), n = R(6, 12), [x] = two(); return { q: `Dad is ${g} years older than ${x}. ${x} is ${a}. How much older is Dad than ${x} when ${x} is ${a + n}?`, a: g, s: 'The gap never changes.' }; };
  G.ageSum = () => { const a = R(5, 10), d = R(24, 34), S = 2 * a + d, [x] = two(); return { q: `${x} and ${x}'s mum have ages that add up to ${S}. Mum is ${d} years older than ${x}. How old is ${x}?`, a: a, h: 'Take away the extra years, then share equally.', s: `${S} - ${d} = ${S - d}; ${S - d} / 2 = ${a}.` }; };
  G.ageBack = () => { const [x] = two(), now = R(6, 10), n = R(2, 4), k = R(2, 5); return { q: `In ${n} years ${x} will be ${now + n}. How old was ${x} ${k} years ago?`, a: now - k, h: 'Find how old they are now.', s: `Now: ${now + n} - ${n} = ${now}. ${k} years ago: ${now - k}.` }; };
  G.dblAdd = () => { const n = R(4, 25), a = R(3, 12); return { q: `I double a number and add ${a}. I get ${2 * n + a}. What is my number?`, a: n, s: `${2 * n + a} - ${a} = ${2 * n}, half = ${n}.` }; };
  G.halfAdd = () => { const n = 2 * R(4, 20), a = R(3, 9); return { q: `I halve a number, then add ${a}. I get ${n / 2 + a}. What is my number?`, a: n, s: `${n / 2 + a} - ${a} = ${n / 2}, double = ${n}.` }; };
  G.moreStickers = () => { const [x, y] = two(), b = R(6, 25), d = R(3, 9); return { q: `${x} has ${d} more stickers than ${y}. Together they have ${2 * b + d} stickers. How many does ${y} have?`, a: b, s: `${2 * b + d} - ${d} = ${2 * b}, half is ${b}.` }; };
  G.fruitMore = () => { const p = R(3, 12), d = R(2, 6), [f1, f2] = pick([['apples', 'pears'], ['oranges', 'lemons']]); return { q: `A bowl has ${f1} and ${f2}, ${2 * p + d} fruits in all. There are ${d} more ${f1} than ${f2}. How many ${f2} are there?`, a: p, s: `${2 * p + d} - ${d} = ${2 * p}, half is ${p}.` }; };
  G.bikeTrike = () => { const V = R(5, 10), t = R(2, V - 2); return { q: `There are ${V} vehicles, some bikes (2 wheels) and some tricycles (3 wheels). There are ${2 * V + t} wheels altogether. How many tricycles are there?`, a: t, h: 'Guess all bikes first.', s: `${V} bikes = ${2 * V} wheels. Extra ${t}, each swap adds 1, so ${t} tricycles.` }; };
  G.threeStep = () => { const n = 2 * R(4, 15), a = R(3, 9); return { q: `I think of a number. I halve it, add ${a}, then double. I get ${n + 2 * a}. What was my number?`, a: n, h: 'Undo each step in reverse order.', s: `${n + 2 * a} / 2 = ${n / 2 + a}, minus ${a} = ${n / 2}, double = ${n}.` }; };
  G.kim = () => { const [x] = two(), r = R(3, 12), s = R(2, 9); return { q: `${x} spent half of the money on a book, then $${s} on a snack. ${x} has $${r} left. How many dollars did ${x} start with?`, a: 2 * (r + s), s: `${r} + ${s} = ${r + s}, double it: ${2 * (r + s)}.` }; };
  G.socks = () => { const k = pick([2, 3, 4]), c = ['red and blue', 'red, blue and green', 'red, blue, green and yellow'][k - 2]; return { q: `A bag has ${c} socks. What is the fewest socks you must take (without looking) to be sure of a matching pair?`, a: k + 1, h: 'Imagine the unluckiest draw.', s: `Worst case: one of each colour (${k}). The next sock must match: ${k + 1}.` }; };
  G.pigeon = () => { const n = R(5, 12); return { q: `${n} children are in a class. Must at least two of them have been born on the same day of the week? (There are only 7 days in a week.)`, o: ['yes', 'no'], a: n > 7 ? 'yes' : 'no', s: n > 7 ? `${n} children, 7 days, so two must share.` : `${n} children could each have a different day.` }; };
  G.blueSocks = () => { const r = R(3, 8), b = R(3, 8); return { q: `A bag has ${r} red socks and ${b} blue socks. What is the fewest you must take to be sure of a pair of BLUE socks?`, a: r + 2, h: 'Worst case: all the red ones first.', s: `${r} red first, then 2 blue = ${r + 2}.` }; };
  G.hs = () => { const n = R(4, 9); return { q: `${n} friends each shake hands once with every other friend. How many handshakes are there in total?`, a: n * (n - 1) / 2, s: `${[...Array(n - 1)].map((_, i) => n - 1 - i).join(' + ')} = ${n * (n - 1) / 2}.` }; };
  G.outfits = () => { const a = R(2, 5), b = R(2, 5), [n1, n2] = pick([['shirts', 'shorts'], ['tops', 'skirts'], ['hats', 'scarves']]); return { q: `${a} ${n1} and ${b} ${n2}. How many different outfits (one of each)?`, a: a * b, s: `${a} x ${b} = ${a * b}.` }; };
  G.menu = () => { const a = R(2, 5), b = R(2, 4), c = R(2, 4); return { q: `A menu has ${a} mains, ${b} drinks and ${c} desserts. How many different meals (one of each)?`, a: a * b * c, s: `${a} x ${b} x ${c} = ${a * b * c}.` }; };
  G.arrange = () => { const n = pick([3, 4]), L = 'ABCD'.slice(0, n); return { q: `In how many different ways can ${n} children ${[...L].join(', ')} stand in a line?`, a: n === 3 ? 6 : 24, h: 'Choose the first child, then the second...', s: n === 3 ? '3 x 2 x 1 = 6.' : '4 x 3 x 2 x 1 = 24.' }; };
  G.digitsNoRep = () => { const ds = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3); return { q: `How many 2-digit numbers can you make using the digits ${ds.join(', ')}, if you may NOT use the same digit twice in a number?`, a: 6, s: `3 choices for tens, 2 for ones: 3 x 2 = 6.` }; };
  G.digitsRep = () => { const ds = shuffle([1, 2, 3, 4, 5]).slice(0, 2 + R(0, 1)); return { q: `How many 2-digit numbers can you make using only the digits ${ds.join(', ')} (you may repeat a digit)?`, a: ds.length ** 2, s: `${ds.length} choices for tens and ${ds.length} for ones: ${ds.length ** 2}.` }; };
  G.ribbonCuts = () => { const k = R(3, 6), p = R(4, 9); return { q: `A ribbon ${k * p} cm long is cut into ${k} cm pieces. How many cuts are needed?`, a: p - 1, s: `${p} pieces need ${p - 1} cuts.` }; };
  G.venn39 = () => { const T = R(20, 35), a = R(T / 2 + 2 | 0, T - 3), b = R(T - a + 2, T - 2); return { q: `${T} children: ${a} like football, ${b} like swimming, everyone likes at least one. How many like both?`, a: a + b - T, s: `${a} + ${b} = ${a + b}. ${a + b} - ${T} = ${a + b - T}.` }; };

  window.GEN = G;
})();
