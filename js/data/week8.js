(window.CURRICULUM = window.CURRICULUM || []).push(
{ week: 8, theme: `Olympiad Toolkit II & Mock Challenge`,
  blurb: `Age problems, working backwards, pigeonhole, combinations, and a final mixed challenge.`,
  lessons: [
{ t: `Age & Difference Problems`, sk: `Age puzzles`,
  goal: `Understand that the age gap between two people never changes.`,
  key: `The difference between two ages stays the same forever.`,
  learn: [
    `Amy is 6. Her brother is 3 years older, so he is 9. In 5 years, Amy will be 11 and her brother will be 14.`,
    `[[cmp:9,6|Brother,Amy]]`,
    `The gap is always 3. When Amy is 11, her brother is 14.`,
    `<b>Two clues:</b> Ann and Mum's ages add up to 40, and Mum is 28 years older. Take away the 28: 40 - 28 = 12. Half of 12 is 6. So Ann is 6 and Mum is 34.`,
    `<b>Looking forward and back:</b> in 3 years Ben will be 9, so now he is 6. 4 years ago he was 2.`
  ],
  do: `<b>Hands-on:</b> Make a family table with ages now, in 5 years, and 10 years ago. What stays constant?`,
  tip: `<b>Olympiad tip:</b> In age puzzles, find out how old they are now first. Then go forwards or backwards.`,
  parent: `Use family members. Ask, "when I am 10, how old will Grandpa be?"`,
  q: [
    { l:`b`, q:`Amy is 6. Her brother is 3 years older. How old is he?`, a:`9` },
    { l:`b`, q:`Ali is 7 and his sister is 4. How old will his sister be when Ali is 12?`, a:`9` },
    { l:`c`, q:`Dad is 30 years older than Jia. Jia is 6. How much older is Dad than Jia when Jia is 16?`, a:`30`, s:`The gap never changes.` },
    { l:`c`, q:`Amy is 6. Her brother is 3 years older. How old will her brother be in 5 years?`, a:`14` },
    { l:`s`, q:`Ann and her mum have ages that add up to 40. Mum is 28 years older than Ann. How old is Ann?`, a:`6`, s:`40 - 28 = 12; 12 / 2 = 6.` },
    { l:`o`, q:`In 3 years Ben will be 9. How old was Ben 4 years ago?`, a:`2`, h:`Find how old he is now.`, s:`Now: 9 - 3 = 6. Four years ago: 6 - 4 = 2.` }
  ]},
{ t: `Guess, Check & Work Backwards`, sk: `Guess and check, or work backwards`,
  goal: `Choose between "guess and check" and "work backwards".`,
  key: `Working backwards: undo each step, starting from the end.`,
  learn: [
    `<b>Guess and check:</b> make a smart guess, check it, then change it.`,
    `<b>Work backwards:</b> Kim spent half of her money on a book, then $3 on a snack. She has $5 left. Undo the snack: 5 + 3 = 8. Undo the half: 8 x 2 = 16. She started with $16.`,
    `<b>Number puzzle:</b> "I double a number and add 5. I get 17." Undo the steps: 17 - 5 = 12, and half of 12 is 6.`,
    `<b>Bikes and tricycles:</b> bikes have 2 wheels and tricycles have 3. There are 5 vehicles and 13 wheels. Guess that all 5 are bikes: that is 10 wheels, and we need 3 more. Each swap from a bike to a tricycle adds 1 wheel. So there are 3 tricycles and 2 bikes.`
  ],
  do: `<b>Hands-on:</b> Make your own "I think of a number" riddle for a grown-up, then solve it backwards together.`,
  tip: `<b>Olympiad tip:</b> If a story has steps, draw arrows going forwards. Then undo them with arrows going backwards.`,
  parent: `Ask "which strategy is best here?" to develop flexible thinking.`,
  q: [
    { l:`b`, q:`I double a number and add 5. I get 17. What is my number?`, a:`6` },
    { l:`b`, q:`I halve a number, then add 3. I get 10. What is my number?`, a:`14` },
    { l:`c`, q:`Ann has 3 more stickers than Bo. Together they have 21 stickers. How many does Bo have?`, a:`9` },
    { l:`c`, q:`A bowl has apples and pears, 10 fruits in all. There are 2 more apples than pears. How many pears?`, a:`4` },
    { l:`s`, q:`There are 5 vehicles, some bikes (2 wheels) and some tricycles (3 wheels). There are 13 wheels altogether. How many tricycles are there?`, a:`3` },
    { l:`o`, q:`Kim spent half of her money on a book, then $3 on a snack. She has $5 left. How many dollars did she start with?`, a:`16`, s:`5 + 3 = 8, 8 x 2 = 16.` }
  ]},
{ t: `Pigeonhole & Handshakes`, sk: `The worst-luck trick`,
  goal: `Use the worst-luck trick to be sure of an answer.`,
  key: `To guarantee a match, plan for the worst luck, then add one.`,
  learn: [
    `<b>Socks in the dark:</b> a drawer has red socks and blue socks. To be sure of a matching pair, take 3. In the worst case you get one red and one blue first, but the third sock must match one of them.`,
    `<b>Three colours:</b> take 4 to be sure of a pair. In the worst case you get red, blue and green, and then any 4th sock matches.`,
    `There are only 7 days in a week. So with 8 children, at least two of them were born on the same day of the week.`,
    `<b>A harder one:</b> with 4 red and 4 blue socks, how many must you take to be sure of a blue pair? The worst luck is 4 red socks first, and then 2 blue socks. That is 6.`,
    `<b>Handshakes again</b> (the adding trick from Gauss Day). For 4 friends: 3 + 2 + 1 = 6. For 6 friends: 5 + 4 + 3 + 2 + 1 = 15.`
  ],
  do: `<b>Hands-on:</b> Put 3 red and 3 blue socks in a bag. Take without looking. What's the fewest to guarantee a pair?`,
  tip: `<b>Olympiad tip:</b> To be sure, think about the worst luck. Imagine the unluckiest pick, then add one more.`,
  parent: `Ask "what's the worst that could happen?" and then plan around it.`,
  q: [
    { l:`b`, q:`A drawer has red and blue socks. What is the fewest socks you must take (without looking) to guarantee a matching pair?`, a:`3` },
    { l:`b`, q:`A bag has red, blue and green balls. What is the fewest balls you must take (without looking) to guarantee two of the same colour?`, a:`4` },
    { l:`c`, q:`8 children are in a class. Must at least two of them have been born on the same day of the week? (There are only 7 days in a week.)`, o:[`yes`,`no`], a:`yes`, s:`Only 7 days for 8 children, so two share.` },
    { l:`c`, q:`4 friends each shake hands once with every other friend. How many handshakes are there in total?`, a:`6` },
    { l:`s`, q:`6 friends each shake hands once with every other friend. How many handshakes are there in total?`, a:`15`, s:`5 + 4 + 3 + 2 + 1 = 15.` },
    { l:`o`, q:`A bag has 4 red socks and 4 blue socks. What is the fewest you must take to guarantee a pair of BLUE socks?`, a:`6`, h:`Worst case: all the red ones first.`, s:`4 red first, then 2 blue = 6.` }
  ]},
{ t: `Combinations`, sk: `Counting outfits and choices`,
  goal: `Count outfit-type combinations systematically.`,
  key: `Choices multiply: 2 shirts x 3 shorts = 6 outfits.`,
  learn: [
    `With 2 shirts and 3 pairs of shorts, each shirt goes with 3 shorts. That is 3 + 3 = 6 outfits, or 2 x 3. The picture below lists every outfit.`,
    `<b>Menu:</b> 2 mains and 3 drinks make 6 different meals.`,
    `<b>Standing in a line:</b> A and B can stand as AB or BA, so that is 2 ways. A, B and C can stand as ABC, ACB, BAC, BCA, CAB or CBA, so that is 6 ways.`,
    `<b>Making numbers:</b> with the digits 1 and 2 (you can use a digit twice) you can make 11, 12, 21 and 22. That is 4 numbers.`,
    `<b>Three choices:</b> 3 shirts, 2 shorts and 2 hats make 3 x 2 x 2 = 12 outfits.`
  ],
  do: `<b>Hands-on:</b> Cut out 2 shirts and 3 shorts from paper. Make every outfit. Count them.`,
  tip: `<b>Olympiad tip:</b> Draw a tree: the first choices are the branches, then add the second choices on each branch. Count the ends.`,
  parent: `Ask your child to dress a doll in every possible way. They will find the pattern.`,
  q: [
    { l:`b`, q:`2 shirts and 3 shorts. How many different outfits?`, a:`6` },
    { l:`b`, q:`A menu has 2 mains and 3 drinks. How many different meals?`, a:`6` },
    { l:`c`, q:`In how many different ways can 2 children A and B stand in a line?`, a:`2` },
    { l:`c`, q:`How many 2-digit numbers can you make using only the digits 1 and 2 (you may repeat a digit)?`, a:`4` },
    { l:`s`, q:`In how many different ways can 3 children A, B and C stand in a line?`, a:`6` },
    { l:`o`, q:`You have 3 shirts, 2 shorts and 2 hats. How many different outfits (one of each)?`, a:`12`, s:`3 x 2 x 2 = 12.` }
  ]},
{ t: `Grand Challenge Day`, sk: `Grand challenge`,
  goal: `A big mixed review of puzzles. Take your time and draw pictures.`,
  key: `Draw. Look for patterns. Check. You are ready for more.`,
  learn: [
    `<b>Your toolkit:</b> bar models, making ten, odd and even, pairing, gaps and posts, working backwards, the worst-luck trick, and listing everything in order.`,
    `Before each question, ask: <b>Can I draw it? Is there a pattern? Can I work backwards?</b>`,
    `Take a breath, be proud of how far you have come, and enjoy the puzzles!`
  ],
  do: `<b>Hands-on:</b> Choose your favourite puzzle from the last 8 weeks and teach it to someone.`,
  tip: `<b>Olympiad tip:</b> If a puzzle is too hard, skip it, finish the others, and come back later.`,
  parent: `After this, keep going with the review page and mixed practice. Consistency wins.`,
  q: [
    { l:`b`, q:`Work out: 47 + 26 = ?`, a:`73` },
    { l:`b`, q:`Work out: 81 - 35 = ?`, a:`46` },
    { l:`c`, q:`Half of 90 = ?`, a:`45` },
    { l:`c`, q:`Work out: 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10 = ?`, a:`55` },
    { l:`s`, q:`A ribbon 30 cm long is cut into 5 cm pieces. How many cuts are needed?`, a:`5`, s:`30 / 5 = 6 pieces, so 5 cuts.` },
    { l:`s`, q:`Tom is 8. His dad is 30 years older. How old will Dad be in 4 years?`, a:`42` },
    { l:`o`, q:`25 children: 14 like football, 17 like swimming, everyone likes at least one. How many like both?`, a:`6`, s:`14 + 17 = 31. 31 - 25 = 6.` },
    { l:`o`, q:`I think of a number. I halve it, add 7, then double. I get 30. What was my number?`, a:`16`, h:`Undo each step in reverse order.`, s:`30 / 2 = 15, 15 - 7 = 8, 8 x 2 = 16.` }
  ]}
]});
