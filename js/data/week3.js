(window.CURRICULUM = window.CURRICULUM || []).push(
{ week: 3, theme: `Add & Subtract Within 100`,
  blurb: `Regrouping in addition and subtraction, and story problems with bar models.`,
  lessons: [
{ t: `Adding Two-Digit Numbers`, sk: `Addition without regrouping`,
  goal: `Add tens to tens and ones to ones.`,
  key: `23 + 41: tens 2+4=6, ones 3+1=4, so 64.`,
  learn: [
    `Split each number into tens and ones. <b>23 + 41</b>: 20 + 40 = 60 and 3 + 1 = 4. Then 60 + 4 = <b>64</b>.`,
    `[[bond:64|60,4]]`,
    `Column method: line up tens under tens, ones under ones. Add ones first.`,
    `Three numbers: 14 + 25 + 30. Tens 1 + 2 + 3 = 6, ones 4 + 5 = 9. Answer 69.`
  ],
  do: `<b>Hands-on:</b> Use base-ten blocks (or bundles of straws) to build 23 and 41 together and count.`,
  tip: `<b>Olympiad tip:</b> For digit puzzles, use "tens digit" and "ones digit" as two mini-unknowns.`,
  parent: `Let the child pick "split" or "column". Both are correct.`,
  q: [
    { l:`b`, q:`Work out: 23 + 41 = ?`, a:`64` },
    { l:`b`, q:`Work out: 52 + 37 = ?`, a:`89` },
    { l:`c`, q:`Work out: 70 + 18 = ?`, a:`88` },
    { l:`c`, q:`Mia read 24 pages on Monday, 35 on Tuesday. How many pages in total?`, a:`59` },
    { l:`s`, q:`Work out: 14 + 25 + 30 = ?`, a:`69` },
    { l:`o`, q:`A 2-digit number has digits that add to 9. The tens digit is 3 more than the ones digit. What is the number?`, a:`63`, h:`Two digits add to 9; one is 3 bigger.`, s:`9 - 3 = 6, half is 3 (ones), so tens = 6. Number is 63.` }
  ]},
{ t: `Adding with Regrouping`, sk: `Make-a-ten addition`,
  goal: `Add two-digit numbers when the ones make more than 10.`,
  key: `27 + 15: 7 + 5 = 12 ones = 1 ten + 2 ones. 20 + 10 + 10 + 2 = 42.`,
  learn: [
    `<b>27 + 15.</b> Ones: 7 + 5 = 12. That is 1 ten and 2 ones. Regroup the ten. Tens: 2 + 1 + 1 = 4. Answer <b>42</b>.`,
    `<b>Number-line jump:</b> 27 + 15 = 27 + 3 = 30, then + 12 = 42.`,
    `[[bar:27,15|?]]`,
    `<b>Making tens:</b> 38 + 24: 38 needs 2 to reach 40. 24 = 2 + 22. So 40 + 22 = 62.`
  ],
  do: `<b>Hands-on:</b> Build 27 and 15 with tens sticks and unit cubes. Trade 10 unit cubes for a tens stick.`,
  tip: `<b>Olympiad tip:</b> Sum-and-difference: two numbers total 50, one is 8 more. Take 8 away (42), split (21 each), then add 8 to the bigger one.`,
  parent: `Encourage "jump to the next ten" as the favourite method. It works mentally.`,
  q: [
    { l:`b`, q:`Work out: 27 + 15 = ?`, a:`42` },
    { l:`b`, q:`Work out: 38 + 24 = ?`, a:`62` },
    { l:`c`, q:`Work out: 46 + 38 = ?`, a:`84` },
    { l:`c`, q:`Work out: 59 + 26 = ?`, a:`85`, s:`59 + 1 = 60, 60 + 25 = 85.` },
    { l:`s`, q:`Work out: 48 + 25 + 17 = ?`, a:`90`, h:`Notice 48 + 2 = 50.`, s:`48 + 25 = 73, 73 + 17 = 90.` },
    { l:`o`, q:`Two numbers add to 50. One is 8 more than the other. What is the smaller number?`, a:`21`, h:`Remove the extra 8 first.`, s:`50 - 8 = 42, 42 / 2 = 21. Smaller is 21, bigger 29.` }
  ]},
{ t: `Subtracting Two-Digit Numbers`, sk: `Subtraction without regrouping`,
  goal: `Subtract tens from tens and ones from ones, and use the difference idea.`,
  key: `68 - 34: 60-30 = 30, 8-4 = 4, so 34.`,
  learn: [
    `<b>68 - 34:</b> tens 6 - 3 = 3, ones 8 - 4 = 4. Answer <b>34</b>.`,
    `[[bar:34,?|68]]`,
    `<b>Difference</b> means "how many more". 68 and 34: 68 is 34 more than 34.`,
    `<b>Subtract ones from a two-digit number:</b> 86 - 5 = 81 (only the ones digit changes).`
  ],
  do: `<b>Hands-on:</b> Show 68 with blocks. Take away 34 (3 tens and 4 ones). Count what's left.`,
  tip: `<b>Olympiad tip:</b> If two numbers differ by 12 and the bigger is 40, the smaller is 28. Their total is 40 + 28 = 68.`,
  parent: `Ask whether the answer is "bigger or smaller than 68" as a quick check.`,
  q: [
    { l:`b`, q:`Work out: 68 - 34 = ?`, a:`34` },
    { l:`b`, q:`Work out: 75 - 21 = ?`, a:`54` },
    { l:`c`, q:`Work out: 90 - 40 = ?`, a:`50` },
    { l:`c`, q:`Work out: 86 - 5 = ?`, a:`81` },
    { l:`s`, q:`Work out: 99 - 45 - 12 = ?`, a:`42`, s:`99 - 45 = 54, 54 - 12 = 42.` },
    { l:`o`, q:`Two numbers differ by 12. The bigger number is 40. What is their sum?`, a:`68`, h:`Find the smaller number first.`, s:`Smaller = 40 - 12 = 28. Sum = 40 + 28 = 68.` }
  ]},
{ t: `Subtracting with Regrouping`, sk: `Subtract across tens`,
  goal: `Subtract when ones are not enough. Use "count up" or "break a ten".`,
  key: `52 - 17: 17 up to 20 is 3, 20 up to 52 is 32. So 35.`,
  learn: [
    `<b>52 - 17.</b> Can't take 7 ones from 2 ones. <b>Break a ten:</b> 52 = 4 tens and 12 ones. Ones: 12 - 7 = 5. Tens: 4 - 1 = 3. Answer <b>35</b>.`,
    `<b>Count up:</b> from 17 to 20 is 3, then from 20 to 52 is 32. 3 + 32 = 35.`,
    `[[bar:17,?|52]]`,
    `<b>From 100:</b> 100 - 37 is the number that goes with 37 to make 100: 63.`
  ],
  do: `<b>Hands-on:</b> Show 52 with 5 tens and 2 ones. Trade one tens stick for 10 ones, then subtract 17.`,
  tip: `<b>Olympiad tip:</b> Working backwards. To undo "subtract 15 then add 20", do "subtract 20 then add 15".`,
  parent: `Both methods are right. Let your child choose but insist on checking with addition.`,
  q: [
    { l:`b`, q:`Work out: 52 - 17 = ?`, a:`35` },
    { l:`b`, q:`Work out: 71 - 28 = ?`, a:`43` },
    { l:`c`, q:`Work out: 60 - 34 = ?`, a:`26` },
    { l:`c`, q:`Work out: 83 - 47 = ?`, a:`36` },
    { l:`s`, q:`Lin has 62 stickers. She gives 18 to Ben. Ben gives 9 back. How many stickers does Lin have now?`, a:`53`, s:`62 - 18 = 44, 44 + 9 = 53.` },
    { l:`o`, q:`I subtract 15 from a number, then add 20. I get 60. What was the number?`, a:`55`, h:`Undo the steps in reverse order.`, s:`60 - 20 = 40, 40 + 15 = 55. Check: 55 - 15 + 20 = 60.` }
  ]},
{ t: `Word Problems with Bar Models`, sk: `Model drawing`,
  goal: `Solve "more than", "fewer than" and "how many more" using bars.`,
  key: `Draw a longer bar for the bigger amount. The extra piece is the difference.`,
  learn: [
    `<b>Ben has 24 marbles. Cara has 13 more.</b>`,
    `[[cmp:24,37|Ben,Cara]]`,
    `Cara = 24 + 13 = <b>37</b>.`,
    `<b>Sam has 28 cards, Tia has 19. How many more does Sam have?</b> The difference is 28 - 19 = 9.`,
    `<b>Position problems:</b> 30 children in a line. Ann is 12th from the front. Children behind her = 30 - 12 = 18.`
  ],
  do: `<b>Hands-on:</b> Make your own story problem using two toys. Draw the bars first, then solve.`,
  tip: `<b>Olympiad tip:</b> In line problems, first draw dots for everyone, then mark the person. Don't count the person twice.`,
  parent: `Insist on a picture before the sum. Kids who skip the picture get more mistakes.`,
  q: [
    { l:`b`, q:`Ben has 24 marbles. Cara has 13 more. How many marbles does Cara have?`, a:`37` },
    { l:`b`, q:`Dan has 45 stickers. Eva has 18 fewer. How many does Eva have?`, a:`27` },
    { l:`c`, q:`Sam has 28 cards. Tia has 19 cards. How many more cards does Sam have?`, a:`9` },
    { l:`c`, q:`Amy has 32 stickers. Bo has 15 fewer than Amy. How many stickers do they have altogether?`, a:`49`, s:`Bo: 32 - 15 = 17. Together: 32 + 17 = 49.` },
    { l:`s`, q:`A book has 90 pages. Lia has read 47. How many pages does she still have to read?`, a:`43` },
    { l:`o`, q:`30 children stand in a line. Ann is 12th from the front. How many children are behind her?`, a:`18`, h:`Ann is counted in the first 12.`, s:`30 - 12 = 18.` }
  ]}
]});
