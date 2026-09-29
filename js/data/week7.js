(window.CURRICULUM = window.CURRICULUM || []).push(
{ week: 7, theme: `Olympiad Toolkit I`,
  blurb: `Classic olympiad tools: Gauss pairing, careful counting, patterns, ordering logic, and number puzzles.`,
  lessons: [
{ t: `Gauss Pairing`, sk: `Clever addition`,
  goal: `Add lists of consecutive numbers by pairing ends.`,
  key: `1+2+...+10: pairs 1+10, 2+9 ... each 11. 5 pairs = 55.`,
  learn: [
    `Young Gauss added 1 to 100 in seconds. His trick: <b>pair the ends</b>.`,
    `1 + 2 + 3 + ... + 10. Pair 1 + 10 = 11, 2 + 9 = 11, 3 + 8 = 11, 4 + 7 = 11, 5 + 6 = 11. Five pairs of 11 = <b>55</b>.`,
    `[[bar:11,11,11,11,11|55]]`,
    `<b>1 to 100:</b> 50 pairs of 101 = 5050.`,
    `<b>Handshakes:</b> 5 friends each shake hands once with everyone else. First person: 4, next: 3, then 2, then 1. 4 + 3 + 2 + 1 = 10 handshakes.`
  ],
  do: `<b>Hands-on:</b> Write 1 to 10 in two rows (second row backwards). Add each column. What do you notice?`,
  tip: `<b>Olympiad tip:</b> If numbers go up by the same step, pair first with last. Number of pairs = how many numbers / 2.`,
  parent: `Tell the Gauss story. Kids love learning that a boy beat his teacher with a trick.`,
  q: [
    { l:`b`, q:`1 + 2 + 3 + 4 + 5 = ?`, a:`15` },
    { l:`b`, q:`2 + 4 + 6 + 8 + 10 = ?`, a:`30` },
    { l:`c`, q:`1 + 2 + 3 + ... + 10 = ?`, a:`55` },
    { l:`c`, q:`10 + 9 + 8 + ... + 1 = ?`, a:`55` },
    { l:`s`, q:`1 + 2 + 3 + ... + 20 = ?`, a:`210`, h:`10 pairs of 21.`, s:`1+20 = 21, 2+19 = 21 ... 10 pairs of 21 = 210.` },
    { l:`o`, q:`5 friends each shake hands once with each of the others. How many handshakes are there in total?`, a:`10`, h:`First person shakes 4 hands. Then?`, s:`4 + 3 + 2 + 1 = 10.` }
  ]},
{ t: `Counting Carefully`, sk: `Fence-post counting`,
  goal: `Count items in lists and along lines without off-by-one errors.`,
  key: `Numbers from A to B (including both) = B - A + 1.`,
  learn: [
    `<b>How many numbers from 5 to 12?</b> 12 - 5 = 7, but both ends count, so <b>8</b> numbers.`,
    `<b>Fence posts:</b> a 20 m fence with posts every 5 m, one at each end: posts at 0, 5, 10, 15, 20 = <b>5 posts</b> (not 4!). Always 1 more post than gaps.`,
    `[[bar:5,5,5,5|20]]`,
    `<b>Trees along a road:</b> 10 m road, trees every 1 m, both ends: 11 trees.`,
    `<b>From 10 to 99:</b> 99 - 10 + 1 = 90 numbers.`
  ],
  do: `<b>Hands-on:</b> Line up 6 toys. How many gaps between them? Now 10 toys. What is the pattern?`,
  tip: `<b>Olympiad tip:</b> Two counts: gaps and posts differ by 1. Always ask "am I counting posts or gaps?".`,
  parent: `This off-by-one skill is the most commonly missed olympiad idea. Do it with real toys.`,
  q: [
    { l:`b`, q:`How many numbers are there from 5 to 12 (counting both 5 and 12)?`, a:`8` },
    { l:`b`, q:`Ann reads from page 3 to page 9, including both. How many pages?`, a:`7` },
    { l:`c`, q:`Trees are planted 1 m apart along a 10 m road, with a tree at both ends. How many trees?`, a:`11` },
    { l:`c`, q:`There are 6 posts in a straight line. How many gaps between them?`, a:`5` },
    { l:`s`, q:`How many whole numbers are there from 10 to 99?`, a:`90` },
    { l:`o`, q:`A 20 m fence has posts every 5 m, with a post at each end. How many posts are needed?`, a:`5` }
  ]},
{ t: `Sequences & Patterns`, sk: `Find the rule`,
  goal: `Find the rule in number and shape patterns.`,
  key: `Look at gaps and ratios. Repeating patterns: divide by the length of the block.`,
  learn: [
    `<b>Add the same:</b> 3, 6, 9, 12, ? adds 3. Next: 15.`,
    `<b>Double:</b> 1, 2, 4, 8, ? Next: 16.`,
    `<b>Add the last two:</b> 1, 1, 2, 3, 5, 8, 13. (Fibonacci. Nature loves this!)`,
    `<b>Growing gaps:</b> 20, 18, 15, 11, 6: gaps are 2, 3, 4, 5.`,
    `<b>Square numbers:</b> 1, 4, 9, 16, 25: gaps 3, 5, 7, 9.`,
    `<b>Repeating blocks:</b> A B B A B B A B B ... The block is ABB (3 long). The 10th letter: 10 = 3 + 3 + 3 + 1, so it is the 1st of the block: A.`
  ],
  do: `<b>Hands-on:</b> Make a pattern with coloured blocks. Give it to a parent and ask them to say the 20th block.`,
  tip: `<b>Olympiad tip:</b> Nth item in a repeating pattern: remainder after dividing by block length tells the position.`,
  parent: `Ask "what's the rule?" before "what's next?".`,
  q: [
    { l:`b`, q:`3, 6, 9, 12, ?`, a:`15` },
    { l:`b`, q:`1, 2, 4, 8, ?`, a:`16` },
    { l:`c`, q:`1, 1, 2, 3, 5, 8, ?`, a:`13` },
    { l:`c`, q:`20, 18, 15, 11, ?`, a:`6`, h:`Gaps: 2, 3, 4.`, s:`The next gap is 5: 11 - 5 = 6.` },
    { l:`s`, q:`The pattern A B B A B B A B B ... repeats. What is the 10th letter?`, a:`a`, h:`Block of 3: ABB.`, s:`10 = 9 + 1, so it is the 1st letter of a block: A.` },
    { l:`o`, q:`1, 4, 9, 16, ?`, a:`25`, h:`Look at the gaps: 3, 5, 7...`, s:`Gaps grow by 2: next gap 9. 16 + 9 = 25.` }
  ]},
{ t: `Ordering & Logic Puzzles`, sk: `Reasoning with clues`,
  goal: `Order people and objects from clues and solve position puzzles.`,
  key: `Draw a line of dots and place each clue. For a person in a queue: from front + from back - 1 = total.`,
  learn: [
    `<b>Ann is taller than Ben. Ben is taller than Cal.</b> Line them up: Ann, Ben, Cal. Shortest is Cal.`,
    `<b>Queue trick:</b> Zoe is 4th from the front and 6th from the back. Total = 4 + 6 - 1 = 9 (Zoe was counted twice).`,
    `<b>In between:</b> Ann is 3rd, Bob is 9th. Between them: 9 - 3 - 1 = 5.`,
    `<b>Race clues:</b> A before B. C after B. D before A. Order: D, A, B, C. 3rd is B.`
  ],
  do: `<b>Hands-on:</b> Line up 5 stuffed toys. Give clues to your parent ("bear is left of rabbit, elephant at the end").`,
  tip: `<b>Olympiad tip:</b> Draw a row of boxes. Put each clue in as it comes. Erase mistakes.`,
  parent: `Play "guess who?" style logic games. It builds deduction skills.`,
  q: [
    { l:`b`, q:`Ann is taller than Ben. Ben is taller than Cal. Who is the shortest?`, o:[`Ann`,`Ben`,`Cal`], a:`Cal` },
    { l:`b`, q:`Ben is 2nd tallest of 5 children. How many are taller than him?`, a:`1` },
    { l:`c`, q:`Zoe is 4th from the front and 6th from the back in a queue. How many children are in the queue?`, a:`9` },
    { l:`c`, q:`Ali is 3rd from the front and 3rd from the back. How many children in the queue?`, a:`5` },
    { l:`s`, q:`In a race, A finishes before B. C finishes after B. D finishes before A. Who is 3rd?`, o:[`A`,`B`,`C`,`D`], a:`B` },
    { l:`o`, q:`In a line, Ann is 3rd from the front and Bob is 9th from the front. How many children are between Ann and Bob?`, a:`5` }
  ]},
{ t: `Number Puzzles & Magic Squares`, sk: `Missing-digit puzzles`,
  goal: `Solve missing-number puzzles and magic squares.`,
  key: `Use rows adding to the magic total. For digit puzzles, test one place at a time.`,
  learn: [
    `<b>Missing number:</b> box + 7 = 15. Box = 15 - 7 = 8.`,
    `<b>Magic square:</b> each row, column and diagonal adds to 15.`,
    `[[bond:15|4,3,8]]`,
    `Row is 4, box, 8. 4 + 8 = 12, so box = 3.`,
    `<b>Same digit in each box:</b> 3[] + []4 = 78. If the box is 4: 34 + 44 = 78. It works!`,
    `<b>Biggest minus smallest:</b> use 1, 2, 3 once each. Biggest 321. Smallest 123. 321 - 123 = 198.`
  ],
  do: `<b>Hands-on:</b> Try this 3x3 magic square: 2 7 6 / 9 5 1 / 4 3 8. Check that every row adds to 15.`,
  tip: `<b>Olympiad tip:</b> Try the middle number of a magic square first. It is the most powerful.`,
  parent: `Puzzle time: try to make your own magic square with the digits 1 to 9.`,
  q: [
    { l:`b`, q:`? + 7 = 15`, a:`8` },
    { l:`b`, q:`? - 6 = 9`, a:`15` },
    { l:`c`, q:`In a magic square every row adds to 15. A row is 4, ?, 8. What is the missing number?`, a:`3` },
    { l:`c`, q:`Two numbers are 9 and 6. Add them and then subtract 4. What do you get?`, a:`11` },
    { l:`s`, q:`The same digit goes in both boxes: 3[] + []4 = 78. What digit is in the box?`, a:`4`, h:`Try the digit 4 and check.`, s:`34 + 44 = 78.` },
    { l:`o`, q:`Use the digits 1, 2, 3 once each to make the biggest 3-digit number. Then make the smallest. What is the biggest minus the smallest?`, a:`198`, s:`321 - 123 = 198.` }
  ]}
]});
