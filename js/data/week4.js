(window.CURRICULUM = window.CURRICULUM || []).push(
{ week: 4, theme: `Beyond 100, Doubles, First Multiplication`,
  blurb: `Hundreds, mental tricks, and the first steps into multiplication and division.`,
  lessons: [
{ t: `Hundreds, Tens and Ones`, sk: `Place value to 1000`,
  goal: `Read and build 3-digit numbers.`,
  key: `345 = 3 hundreds + 4 tens + 5 ones.`,
  learn: [
    `Ten tens make one <b>hundred</b>. 345 is <b>3 hundreds, 4 tens, 5 ones</b>.`,
    `[[bond:345|300,45]]`,
    `<b>The number after 199</b> is 200 (1 hundred 9 tens 9 ones + 1 = 2 hundreds).`,
    `<b>Biggest number from digits 4, 9, 1:</b> put the biggest digit in the highest place: 941.`
  ],
  do: `<b>Hands-on:</b> Draw 3 columns (H, T, O). Roll a die three times to fill them. Read the number aloud.`,
  tip: `<b>Olympiad tip:</b> "How many numbers have a 7?" Count separately: 7 in the tens place, 7 in the ones place. Watch for numbers counted twice (77).`,
  parent: `Use house numbers or car plates as reading practice.`,
  q: [
    { l:`b`, q:`3 hundreds, 4 tens and 5 ones make what number?`, a:`345` },
    { l:`b`, q:`200 + 50 + 7 = ?`, a:`257` },
    { l:`c`, q:`How many tens are in 120?`, a:`12`, s:`120 = 12 tens.` },
    { l:`c`, q:`What number comes right after 199?`, a:`200` },
    { l:`s`, q:`What is the biggest 3-digit number you can make using the digits 4, 9 and 1 once each?`, a:`941` },
    { l:`o`, q:`How many whole numbers from 1 to 100 have the digit 7?`, a:`19`, h:`Count 70-79 (10 numbers) then count the ones-digit 7s outside that.`, s:`70 to 79 is 10. Others ending in 7: 7, 17, 27, 37, 47, 57, 67, 87, 97 = 9. Total 19.` }
  ]},
{ t: `Smart Mental Maths`, sk: `Compensation & near-numbers`,
  goal: `Add and subtract cleverly by changing numbers to friendly ones.`,
  key: `Round up and fix: 48 + 9 = 48 + 10 - 1 = 57.`,
  learn: [
    `<b>Add 9:</b> add 10 then take 1 back. 48 + 9 = 57.`,
    `<b>Subtract from 100:</b> 100 - 38 = 62 (38 needs 62 more).`,
    `<b>Add near-100:</b> 98 + 47 = 100 + 45 = 145.`,
    `<b>Middle number trick:</b> 25 + 26 + 27 + 28 + 29: the middle is 27, and there are 5 numbers. 27 x 5 = 135. (The numbers balance around the middle.)`
  ],
  do: `<b>Hands-on:</b> Play "make it friendly". Give your child a hard sum (e.g. 99 + 34) and ask which number could be changed to make it easy.`,
  tip: `<b>Olympiad tip:</b> Numbers in an evenly spaced list have the same total as "middle x how many".`,
  parent: `Do one mental sum a day at dinner. Ask "how did you do it?" and accept every method.`,
  q: [
    { l:`b`, q:`70 + 60 = ?`, a:`130` },
    { l:`b`, q:`48 + 9 = ?`, a:`57` },
    { l:`c`, q:`98 + 47 = ?`, a:`145` },
    { l:`c`, q:`100 - 38 = ?`, a:`62` },
    { l:`s`, q:`199 + 199 = ?`, a:`398`, h:`Each is 1 less than 200.`, s:`200 + 200 = 400, take away 2 = 398.` },
    { l:`o`, q:`25 + 26 + 27 + 28 + 29 = ?`, a:`135`, h:`Balance around the middle.`, s:`Middle is 27, five numbers, 27 x 5 = 135.` }
  ]},
{ t: `Doubles & Halves`, sk: `Doubling and halving`,
  goal: `Double and halve numbers within 100.`,
  key: `Double = x2. Half = share into 2 equal groups.`,
  learn: [
    `<b>Double</b> means two equal groups. Double 35: double 30 = 60, double 5 = 10. 60 + 10 = 70.`,
    `<b>Half</b> means split into 2 equal parts. Half of 86: half of 80 = 40, half of 6 = 3, so 43.`,
    `[[bond:18|9,9]]`,
    `Halving is the reverse of doubling.`,
    `<b>Equal-parts puzzle:</b> "double a number then add 3 gives 27". Undo: 27 - 3 = 24, half = 12.`
  ],
  do: `<b>Hands-on:</b> Share 18 counters equally between two people. Then between two people with 7 left over. What does that leftover mean?`,
  tip: `<b>Olympiad tip:</b> A halving question with an odd number leaves a leftover. Watch out for it.`,
  parent: `Halve everyday quantities (biscuits, minutes). Doubling and halving are the base of multiplication tables.`,
  q: [
    { l:`b`, q:`Double 8 = ?`, a:`16` },
    { l:`b`, q:`Half of 18 = ?`, a:`9` },
    { l:`c`, q:`Double 35 = ?`, a:`70` },
    { l:`c`, q:`Half of 50 = ?`, a:`25` },
    { l:`s`, q:`Half of 86 = ?`, a:`43`, s:`Half of 80 = 40, half of 6 = 3.` },
    { l:`o`, q:`I double a number and add 3. The answer is 27. What is the number?`, a:`12`, h:`Undo the steps in reverse.`, s:`27 - 3 = 24, half of 24 = 12.` }
  ]},
{ t: `Equal Groups: Multiplication`, sk: `Multiplication as equal groups`,
  goal: `Understand "3 groups of 4" as 3 x 4 = 12.`,
  key: `3 x 4 means 3 groups of 4: 4 + 4 + 4 = 12.`,
  learn: [
    `<b>Equal groups:</b> 3 plates with 4 cookies each. Total = 4 + 4 + 4 = 12. We write <b>3 x 4 = 12</b>.`,
    `[[bar:4,4,4|12]]`,
    `<b>Order doesn't matter:</b> 3 x 4 = 4 x 3.`,
    `<b>Chickens and rabbits:</b> 5 animals and 14 legs. Guess 5 chickens = 10 legs (need 4 more). Each swap of a chicken to a rabbit adds 2 legs. So we need 2 swaps: <b>2 rabbits, 3 chickens</b>.`
  ],
  do: `<b>Hands-on:</b> Make 3 groups of 4 with counters. Now 4 groups of 3. Same total?`,
  tip: `<b>Olympiad tip:</b> Guess-and-check with smart adjustments solves "heads and legs" puzzles.`,
  parent: `Say "groups of" rather than "times" at first. The picture is more important than the symbol.`,
  q: [
    { l:`b`, q:`3 groups of 4. What is 3 x 4?`, a:`12` },
    { l:`b`, q:`5 bags with 2 apples each. How many apples?`, a:`10` },
    { l:`c`, q:`2 x 9 = ?`, a:`18` },
    { l:`c`, q:`4 x 4 = ?`, a:`16` },
    { l:`s`, q:`6 plates have 3 cakes each. 5 cakes are eaten. How many cakes are left?`, a:`13`, s:`6 x 3 = 18, 18 - 5 = 13.` },
    { l:`o`, q:`A farm has 5 animals, some chickens (2 legs) and some rabbits (4 legs). There are 14 legs in total. How many rabbits?`, a:`2`, h:`Guess all chickens first, then swap.`, s:`5 chickens = 10 legs. Need 4 more legs; each swap adds 2 legs so 2 swaps = 2 rabbits. Check: 2x4 + 3x2 = 14.` }
  ]},
{ t: `Sharing & Grouping: Division`, sk: `Division as sharing and grouping`,
  goal: `See division as sharing equally or making equal groups.`,
  key: `12 shared among 3 = 4 each. 12 made into groups of 3 = 4 groups.`,
  learn: [
    `<b>Sharing:</b> 12 sweets shared equally among 3 children. Each gets 4. 12 / 3 = 4.`,
    `<b>Grouping:</b> 15 sweets in bags of 5. Number of bags = 3. 15 / 5 = 3.`,
    `[[bar:5,5,5|15]]`,
    `Division undoes multiplication. 4 x 3 = 12, so 12 / 3 = 4.`,
    `<b>Cutting puzzle:</b> A rope 12 m long is cut every 3 m. That makes 4 pieces but only <b>3 cuts</b>.`
  ],
  do: `<b>Hands-on:</b> Share 20 counters between 4 cups, one at a time. Then make groups of 5 from the same 20.`,
  tip: `<b>Olympiad tip:</b> Pieces and cuts: the number of cuts is always 1 less than the number of pieces.`,
  parent: `Ask "share or group?" for every division story so the picture forms.`,
  q: [
    { l:`b`, q:`12 sweets are shared equally among 3 children. How many does each get?`, a:`4` },
    { l:`b`, q:`15 sweets are put in bags of 5. How many bags?`, a:`3` },
    { l:`c`, q:`20 / 4 = ?`, a:`5` },
    { l:`c`, q:`18 / 2 = ?`, a:`9` },
    { l:`s`, q:`24 cookies are packed in bags of 6. How many bags are needed?`, a:`4` },
    { l:`o`, q:`A 12 m rope is cut into pieces of 3 m each. How many cuts are needed?`, a:`3`, h:`Draw the rope and mark each cut.`, s:`12 / 3 = 4 pieces. Pieces need 4 - 1 = 3 cuts.` }
  ]}
]});
