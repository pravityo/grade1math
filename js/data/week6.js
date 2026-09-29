(window.CURRICULUM = window.CURRICULUM || []).push(
{ week: 6, theme: `Fractions, Data & Logic Sorting`,
  blurb: `Halves, quarters, thirds of sets, graphs, and the Venn-diagram thinking that olympiads love.`,
  lessons: [
{ t: `Halves`, sk: `Equal parts`,
  goal: `Understand a half as one of 2 EQUAL parts.`,
  key: `Half = 1 of 2 equal parts. Half of 10 is 5.`,
  learn: [
    `A <b>half</b> is one of <b>two equal</b> parts. The parts must be equal!`,
    `Half of 10 is 5. Half of 16 is 8. We write it as <b>1/2</b>.`,
    `<b>Half of a half:</b> Ali eats half a pizza. Ben eats half of what is left. Ben ate 1/4 of the whole pizza, so 1/4 is left too.`,
    `1/2 is bigger than 1/4 because the whole is cut into fewer pieces, so the pieces are bigger.`
  ],
  do: `<b>Hands-on:</b> Fold a paper in half. Fold that in half again. How many equal parts now? Colour one.`,
  tip: `<b>Olympiad tip:</b> Fractions are always of the <b>same whole</b>. Look for what the whole is.`,
  parent: `Cut food into unequal parts and ask "is this a half?" to test understanding.`,
  q: [
    { l:`b`, q:`Half of 10 = ?`, a:`5` },
    { l:`b`, q:`Half of 16 = ?`, a:`8` },
    { l:`c`, q:`Which is bigger: 1/2 or 1/4 of the same cake?`, o:[`1/2`,`1/4`], a:`1/2` },
    { l:`c`, q:`Half of half of 12 = ?`, a:`3`, s:`Half of 12 is 6, half of 6 is 3.` },
    { l:`s`, q:`A pizza is cut into 2 pieces but one piece is bigger. Is each piece a half?`, o:[`yes`,`no`], a:`no`, s:`Halves must be equal.` },
    { l:`o`, q:`Ali eats half a pizza. Ben eats half of what is left. What fraction of the pizza is still left? (Write like 1/4.)`, a:[`1/4`,`¼`], h:`Draw the pizza and cross out what is eaten.`, s:`Ali: 1/2. Left 1/2. Ben eats half of that = 1/4. Left = 1/4.` }
  ]},
{ t: `Quarters`, sk: `Fourths`,
  goal: `Understand quarters and use them with numbers.`,
  key: `Quarter = 1 of 4 equal parts. 4 quarters = 1 whole.`,
  learn: [
    `A <b>quarter</b> is one of <b>four equal</b> parts. 1/4. Four quarters make 1 whole.`,
    `Quarter of 8 is 2. Quarter of 20 is 5. <b>Trick:</b> half of a half.`,
    `<b>3/4</b> means 3 of the 4 parts. 3/4 of 12: quarter is 3, so 3 quarters is 9. In the bar below, 12 is cut into four quarters of 3, and 3 of them are 3 + 3 + 3 = 9.`,
    `[[bar:3,3,3,3|12]]`,
    `<b>How many quarters in 3 wholes?</b> 4 in each whole, so 12.`
  ],
  do: `<b>Hands-on:</b> Cut a paper circle into quarters. Rebuild it. Colour 3/4.`,
  tip: `<b>Olympiad tip:</b> "1/4 of a number is 6" means one bar of 4 equal bars is 6. Total = 4 x 6 = 24.`,
  parent: `Use fraction language when cutting sandwiches and clocks ("quarter past").`,
  q: [
    { l:`b`, q:`A quarter of 8 = ?`, a:`2` },
    { l:`b`, q:`A quarter of 20 = ?`, a:`5` },
    { l:`c`, q:`How many quarters make one whole?`, a:`4` },
    { l:`c`, q:`3/4 of 12 = ?`, a:`9` },
    { l:`s`, q:`One quarter of a number is 6. What is the number?`, a:`24`, s:`4 equal parts of 6: 6 x 4 = 24.` },
    { l:`o`, q:`How many quarters are in 3 whole pizzas?`, a:`12` }
  ]},
{ t: `Fractions of a Set`, sk: `Fraction of a quantity`,
  goal: `Find 1/3, 1/5 and 2/3 of a group.`,
  key: `Divide into equal groups, then count the ones you need.`,
  learn: [
    `<b>1/3 of 9:</b> share 9 into 3 equal groups. Each group is 3. So 1/3 of 9 = 3.`,
    `<b>2/3 of 9:</b> 2 groups of 3 = 6. The picture above shows the groups, and the bar below shows 9 cut into three parts of 3.`,
    `[[bar:3,3,3|9]]`,
    `1/2 of 14 = 7. 1/5 of 20 = 4.`,
    `<b>Puzzle:</b> "Half of my marbles are red, a quarter are blue, the other 5 are green." Half + quarter = 3/4, so green is 1/4 = 5. The whole is 4 x 5 = 20.`
  ],
  do: `<b>Hands-on:</b> Use 12 counters. Find 1/2, 1/3, 1/4, 1/6. What did you notice?`,
  tip: `<b>Olympiad tip:</b> Work out what is <i>left</i>. "The rest is 5" often is a fraction of the whole.`,
  parent: `Turn fractions into real sharing: "give 1/3 of the grapes to your sister".`,
  q: [
    { l:`b`, q:`1/3 of 9 = ?`, a:`3` },
    { l:`b`, q:`1/2 of 14 = ?`, a:`7` },
    { l:`c`, q:`1/5 of 20 = ?`, a:`4` },
    { l:`c`, q:`2/3 of 9 = ?`, a:`6` },
    { l:`s`, q:`Mum bakes 12 buns. The family eats 1/3 of them and a friend eats 1/4 of them. How many buns are left?`, a:`5`, s:`1/3 of 12 = 4, 1/4 of 12 = 3. 12 - 4 - 3 = 5.` },
    { l:`o`, q:`Half of my marbles are red, a quarter are blue, and the other 5 are green. How many marbles do I have?`, a:`20`, h:`What fraction is green?`, s:`Half + quarter = 3/4. Green = 1/4 = 5. Total = 5 x 4 = 20.` }
  ]},
{ t: `Picture Graphs & Tallies`, sk: `Data handling`,
  goal: `Read data and reason about it.`,
  key: `Tally: four lines and a slash = 5. Compare using subtraction.`,
  learn: [
    `<b>Tally marks:</b> group in 5s. |||| with a slash across it is 5. Then add the remaining lines.`,
    `<b>Picture graph:</b> each picture stands for 1 (or more) item. Fruit: apples 5, bananas 3, grapes 7. Total = 15. Most = grapes. Grapes more than bananas = 4.`,
    `<b>Puzzle data:</b> Dogs 6, cats twice as many, birds 3 fewer than cats. Cats = 12, birds = 9. Total = 6 + 12 + 9 = 27. The bar below puts the three amounts side by side.`,
    `[[bar:6,12,9|27]]`
  ],
  do: `<b>Hands-on:</b> Tally the colours of cars that pass your window in 10 minutes. Draw a picture graph.`,
  tip: `<b>Olympiad tip:</b> "Twice as many" means two equal bars. Draw it to avoid mistakes.`,
  parent: `Do a family survey (favourite fruit) and make a graph together.`,
  q: [
    { l:`b`, q:`A picture graph shows apples 5, bananas 3 and grapes 7. How many fruits are there in total?`, a:`15` },
    { l:`b`, q:`A picture graph shows apples 5, bananas 3 and grapes 7. Which fruit is the most?`, o:[`apples`,`bananas`,`grapes`], a:`grapes` },
    { l:`c`, q:`A picture graph shows apples 5, bananas 3 and grapes 7. How many more grapes than bananas?`, a:`4` },
    { l:`c`, q:`A tally shows one bundle of five (four lines with a slash across them) and then 3 more lines. What number is that?`, a:`8` },
    { l:`s`, q:`A picture graph shows apples 5, bananas 3 and grapes 7. If 4 more bananas are added, how many bananas are there now?`, a:`7` },
    { l:`o`, q:`There are 6 dogs. There are twice as many cats as dogs. There are 3 fewer birds than cats. How many pets altogether?`, a:`27`, h:`Cats first, then birds.`, s:`Cats 12, birds 9. 6 + 12 + 9 = 27.` }
  ]},
{ t: `Sorting & Venn Diagrams`, sk: `Logic sets`,
  goal: `Handle overlapping groups: some are in both.`,
  key: `Both counted once: total = A + B - both.`,
  learn: [
    `<b>Sorting</b> means finding the rule that puts things into groups. <b>Odd one out:</b> in 3, 5, 7, 8 only 8 is even, so it does not belong.`,
    `<b>Venn diagram:</b> two circles that overlap. The middle is for things in <i>both</i>.`,
    `5 like cats, 4 like dogs, 2 like both. Cats only: 5 - 2 = 3. Dogs only: 4 - 2 = 2. At least one: 3 + 2 + 2 = 7.`,
    `<b>Formula idea:</b> If you add 5 + 4 you counted the "both" children twice, so subtract 2 once: 9 - 2 = 7.`,
    `<b>Everyone does at least one:</b> 20 kids, 12 swim, 15 cycle. 12 + 15 = 27. That is 7 too many, so <b>7 do both</b>.`
  ],
  do: `<b>Hands-on:</b> Two hula hoops overlapping on the floor. Sort toys: "soft" and "red". Which go in the middle?`,
  tip: `<b>Olympiad tip:</b> Total counted too many? The extra is exactly the number in both.`,
  parent: `Ask "does this belong in both circles?" with everyday sorting.`,
  q: [
    { l:`b`, q:`Which number does not belong with the others? 3, 5, 7, 8`, a:`8` },
    { l:`b`, q:`How many even numbers are in this list? 3, 4, 8, 11, 12`, a:`3` },
    { l:`c`, q:`In a class, 5 children like cats and 4 children like dogs. 2 children like both cats and dogs (they are counted in the 5 and in the 4). How many children like at least one of them?`, a:`7` },
    { l:`c`, q:`In a class, 5 children like cats and 4 children like dogs. 2 children like both cats and dogs (they are counted in the 5 and in the 4). How many children like ONLY cats?`, a:`3` },
    { l:`s`, q:`In a group of 10 children, 6 wear glasses and 7 wear a watch. Everyone wears at least one of them. How many children wear both?`, a:`3`, s:`6 + 7 = 13, that is 3 more than 10, so 3 wear both.` },
    { l:`o`, q:`20 children: 12 can swim, 15 can cycle, and everyone can do at least one. How many can do both?`, a:`7` }
  ]}
]});
