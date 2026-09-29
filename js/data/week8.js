(window.CURRICULUM = window.CURRICULUM || []).push(
{ week: 8, theme: `Olympiad Toolkit II & Mock Challenge`,
  blurb: `Age problems, working backwards, pigeonhole, combinations, and a final mixed challenge.`,
  lessons: [
{ t: `Age & Difference Problems`, sk: `Constant difference`,
  goal: `Understand that the age gap between two people never changes.`,
  key: `The difference between two ages stays the same forever.`,
  learn: [
    `<b>Amy is 6. Her brother is 3 years older.</b> He is 9. In 5 years: Amy 11, brother 14.`,
    `[[cmp:9,6|Brother,Amy]]`,
    `The gap is always 3. When Amy is 11 the brother is 14.`,
    `<b>Sum and difference:</b> Ann and Mum's ages add to 40. Mum is 28 years older. 40 - 28 = 12, half is 6. Ann = 6, Mum = 34.`,
    `<b>In 3 years Ben will be 9.</b> So now he is 6. 4 years ago he was 2.`
  ],
  do: `<b>Hands-on:</b> Make a family table with ages now, in 5 years, and 10 years ago. What stays constant?`,
  tip: `<b>Olympiad tip:</b> Age problems: find "now" first. Then move forward or backward.`,
  parent: `Use family members. Ask, "when I am 10, how old will Grandpa be?"`,
  q: [
    { l:`b`, q:`Amy is 6. Her brother is 3 years older. How old is he?`, a:`9` },
    { l:`b`, q:`Ali is 7 and his sister is 4. How old will his sister be when Ali is 12?`, a:`9` },
    { l:`c`, q:`Dad is 30 years older than Jia. Jia is 6. How much older is Dad than Jia when Jia is 16?`, a:`30`, s:`The gap never changes.` },
    { l:`c`, q:`Amy is 6. Her brother is 3 years older. How old will her brother be in 5 years?`, a:`14` },
    { l:`s`, q:`Ann and her mum have ages that add up to 40. Mum is 28 years older than Ann. How old is Ann?`, a:`6`, s:`40 - 28 = 12; 12 / 2 = 6.` },
    { l:`o`, q:`In 3 years Ben will be 9. How old was Ben 4 years ago?`, a:`2`, h:`Find how old he is now.`, s:`Now: 9 - 3 = 6. Four years ago: 6 - 4 = 2.` }
  ]},
{ t: `Guess, Check & Work Backwards`, sk: `Problem-solving heuristics`,
  goal: `Choose between "guess and check" and "work backwards".`,
  key: `Working backwards: undo each step, starting from the end.`,
  learn: [
    `<b>Guess and check:</b> make a smart guess, check, then adjust.`,
    `<b>Work backwards:</b> Kim spent half of her money on a book, then $3 on a snack. She has $5 left. Undo: 5 + 3 = 8 (before snack). Undo half: 8 x 2 = 16. She started with <b>$16</b>.`,
    `<b>Number tricks:</b> "I double a number and add 5. I get 17." Undo: 17 - 5 = 12, half of 12 = 6.`,
    `<b>Bikes (2 wheels) and tricycles (3 wheels):</b> 5 vehicles, 13 wheels. Guess 5 bikes = 10 wheels; need 3 more, and each swap adds 1. So <b>3 tricycles</b>, 2 bikes.`
  ],
  do: `<b>Hands-on:</b> Make your own "I think of a number" riddle for a parent, then solve it backwards together.`,
  tip: `<b>Olympiad tip:</b> Steps in a story? Draw arrows forward. Undo by arrows going backwards.`,
  parent: `Ask "which strategy is best here?" to develop flexible thinking.`,
  q: [
    { l:`b`, q:`I double a number and add 5. I get 17. What is my number?`, a:`6` },
    { l:`b`, q:`I halve a number, then add 3. I get 10. What is my number?`, a:`14` },
    { l:`c`, q:`Ann has 3 more stickers than Bo. Together they have 21 stickers. How many does Bo have?`, a:`9` },
    { l:`c`, q:`A bowl has apples and pears, 10 fruits in all. There are 2 more apples than pears. How many pears?`, a:`4` },
    { l:`s`, q:`There are 5 vehicles, some bikes (2 wheels) and some tricycles (3 wheels). There are 13 wheels altogether. How many tricycles are there?`, a:`3` },
    { l:`o`, q:`Kim spent half of her money on a book, then $3 on a snack. She has $5 left. How many dollars did she start with?`, a:`16`, s:`5 + 3 = 8, 8 x 2 = 16.` }
  ]},
{ t: `Pigeonhole & Handshakes`, sk: `Worst-case thinking`,
  goal: `Use worst-case reasoning to guarantee results.`,
  key: `To guarantee a match, plan for the worst luck, then add one.`,
  learn: [
    `<b>Socks in the dark:</b> a drawer has red and blue socks. To <b>guarantee</b> a matching pair, take 3. (Worst case: red, blue, then any third matches one.)`,
    `<b>Three colours:</b> take 4 to guarantee a pair (red, blue, green, then anything).`,
    `<b>7 days of the week:</b> with 8 children, at least two share a birthday weekday.`,
    `<b>Harder:</b> 4 red and 4 blue socks. To guarantee a <b>blue pair</b>, worst luck: 4 red first, then 2 blue. That is <b>6</b>.`,
    `<b>Handshakes for 4 friends:</b> 3 + 2 + 1 = 6. For 6 friends: 5 + 4 + 3 + 2 + 1 = 15.`
  ],
  do: `<b>Hands-on:</b> Put 3 red and 3 blue socks in a bag. Take without looking. What's the fewest to guarantee a pair?`,
  tip: `<b>Olympiad tip:</b> "Guarantee" means worst luck. Imagine the unluckiest possible draw, then add one.`,
  parent: `Ask "what's the worst that could happen?" and then plan around it.`,
  q: [
    { l:`b`, q:`A drawer has red and blue socks. What is the fewest socks you must take (without looking) to guarantee a matching pair?`, a:`3` },
    { l:`b`, q:`A bag has red, blue and green balls. Fewest balls you must take to guarantee two of the same colour?`, a:`4` },
    { l:`c`, q:`8 children are in a class. There are 7 days in a week. Is it true that at least two were born on the same day of the week?`, o:[`yes`,`no`], a:`yes`, s:`Only 7 days for 8 children, so two share.` },
    { l:`c`, q:`4 friends shake hands once with each other. How many handshakes?`, a:`6` },
    { l:`s`, q:`6 friends shake hands once with each other. How many handshakes?`, a:`15`, s:`5 + 4 + 3 + 2 + 1 = 15.` },
    { l:`o`, q:`A bag has 4 red socks and 4 blue socks. What is the fewest you must take to guarantee a pair of BLUE socks?`, a:`6`, h:`Worst case: all the red ones first.`, s:`4 red first, then 2 blue = 6.` }
  ]},
{ t: `Combinations`, sk: `Counting choices`,
  goal: `Count outfit-type combinations systematically.`,
  key: `Choices multiply: 2 shirts x 3 shorts = 6 outfits.`,
  learn: [
    `<b>2 shirts and 3 shorts:</b> each shirt goes with 3 shorts. 3 + 3 = 6 outfits (2 x 3).`,
    `<b>Menu:</b> 2 mains and 3 drinks = 6 meals.`,
    `<b>Arranging:</b> A and B in a line: AB, BA = 2 ways. A, B, C: ABC, ACB, BAC, BCA, CAB, CBA = 6 ways.`,
    `<b>Digits:</b> using 1 and 2 (repeats allowed): 11, 12, 21, 22 = 4 numbers.`,
    `<b>3 shirts, 2 shorts, 2 hats:</b> 3 x 2 x 2 = 12.`
  ],
  do: `<b>Hands-on:</b> Cut out 2 shirts and 3 shorts from paper. Make every outfit. Count them.`,
  tip: `<b>Olympiad tip:</b> Make a tree: first choices as branches, then second choices on each branch. Count the ends.`,
  parent: `Ask your child to dress a doll in every possible way. They will find the pattern.`,
  q: [
    { l:`b`, q:`2 shirts and 3 shorts. How many different outfits?`, a:`6` },
    { l:`b`, q:`A menu has 2 mains and 3 drinks. How many different meals?`, a:`6` },
    { l:`c`, q:`In how many different ways can 2 children A and B stand in a line?`, a:`2` },
    { l:`c`, q:`How many 2-digit numbers can you make using only the digits 1 and 2 (you may repeat a digit)?`, a:`4` },
    { l:`s`, q:`In how many different ways can 3 children A, B and C stand in a line?`, a:`6` },
    { l:`o`, q:`You have 3 shirts, 2 shorts and 2 hats. How many different outfits (one of each)?`, a:`12`, s:`3 x 2 x 2 = 12.` }
  ]},
{ t: `Grand Challenge Day`, sk: `Mixed olympiad`,
  goal: `A full mixed review, olympiad style. Take your time and draw pictures.`,
  key: `Draw. Look for patterns. Check. You are ready for more.`,
  learn: [
    `<b>Your toolkit:</b> bar models, make-ten, odd/even, pairing, gaps and posts, working backwards, worst-case, and listing systematically.`,
    `Before each question, ask: <b>Can I draw it? Is there a pattern? Can I work backwards?</b>`,
    `Take a breath, be proud of how far you have come, and enjoy the puzzles!`
  ],
  do: `<b>Hands-on:</b> Choose your favourite puzzle from the last 8 weeks and teach it to someone.`,
  tip: `<b>Olympiad tip:</b> In competitions, skip a hard one, finish the others, and come back. Never freeze.`,
  parent: `After this, keep going with the review page and mixed practice. Consistency wins.`,
  q: [
    { l:`b`, q:`47 + 26 = ?`, a:`73` },
    { l:`b`, q:`81 - 35 = ?`, a:`46` },
    { l:`c`, q:`Half of 90 = ?`, a:`45` },
    { l:`c`, q:`1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10 = ?`, a:`55` },
    { l:`s`, q:`A ribbon 30 cm long is cut into 5 cm pieces. How many cuts are needed?`, a:`5`, s:`30 / 5 = 6 pieces, so 5 cuts.` },
    { l:`s`, q:`Tom is 8. His dad is 30 years older. How old will Dad be in 4 years?`, a:`42` },
    { l:`o`, q:`25 children: 14 like football, 17 like swimming, everyone likes at least one. How many like both?`, a:`6`, s:`14 + 17 = 31. 31 - 25 = 6.` },
    { l:`o`, q:`I think of a number. I halve it, add 7, then double. I get 30. What was my number?`, a:`16`, h:`Undo each step in reverse order.`, s:`30 / 2 = 15, 15 - 7 = 8, 8 x 2 = 16.` }
  ]}
]});
