(window.CURRICULUM = window.CURRICULUM || []).push(
{ week: 2, theme: `Numbers to 100`,
  blurb: `Tens and ones, skip counting, comparing, and the first olympiad pattern day.`,
  lessons: [
{ t: `Tens and Ones`, sk: `Tens and ones`,
  goal: `Read any number to 100 as tens and ones.`,
  key: `47 = 4 tens + 7 ones = 40 + 7.`,
  learn: [
    `Ten ones make one <b>ten</b>. We write 47 as <b>4 tens</b> and <b>7 ones</b>.`,
    `[[bond:47|40,7]]`,
    `The digit's <b>place</b> tells its value. In 47, the 4 is worth 40 and the 7 is worth 7.`,
    `<b>10 more</b> changes only the tens digit: 47 becomes 57. <b>10 less</b>: 37.`
  ],
  do: `<b>Hands-on:</b> Bundle 10 straws with a rubber band to make tens. Show 34 with 3 bundles and 4 singles. Show 10 more, 10 less.`,
  tip: `<b>Olympiad tip:</b> When you count numbers that have the digit 5, check the tens place and the ones place separately. Then you never miss one.`,
  parent: `Use money-like language: "3 ten-dollar notes and 4 coins". Place value is the base of all column work.`,
  q: [
    { l:`b`, q:`4 tens and 7 ones make what number?`, a:`47` },
    { l:`b`, q:`Work out: 60 + 3 = ?`, a:`63` },
    { l:`c`, q:`What is 10 more than 47?`, a:`57`, s:`Only the tens digit goes up by 1.` },
    { l:`c`, q:`How many tens are in 90?`, a:`9` },
    { l:`s`, q:`3 tens and 15 ones make what number?`, a:`45`, h:`15 ones is 1 ten and 5 ones.`, s:`30 + 15 = 45.` },
    { l:`o`, q:`How many whole numbers from 1 to 50 have the digit 5 in them?`, a:`6`, h:`List: 5, 15, ... and don't forget 50.`, s:`5, 15, 25, 35, 45, 50 = 6 numbers.` }
  ]},
{ t: `Skip Counting`, sk: `Counting in 2s, 5s and 10s`,
  goal: `Count fluently by 2, 5, 10 and start 3s. This is the road to multiplication.`,
  key: `Skip counting = repeated addition. Fingers: 5, 10, 15, 20 ...`,
  learn: [
    `<b>Count by 2:</b> 2, 4, 6, 8, 10 ... <b>by 5:</b> 5, 10, 15, 20 ... <b>by 10:</b> 10, 20, 30 ... The hundred chart below colours the numbers you land on when counting by 5, and the number line shows hops of 2.`,
    `Each count adds the same amount. 5 hands have <b>5 + 5 + 5 + 5 + 5 = 25</b> fingers.`,
    `<b>Try 3s:</b> 3, 6, 9, 12, 15. A frog that jumps 3 at a time lands only on these numbers, the coloured squares on this chart.`,
    `The numbers you land on when counting by 2 are called <b>even</b> numbers. They end in 0, 2, 4, 6 or 8.`
  ],
  do: `<b>Hands-on:</b> Walk a number line on the floor. Jump in 2s, then 5s, then 3s. Mark where you land with sticky notes.`,
  tip: `<b>Olympiad tip:</b> Skip counting is fast counting. To count 6 groups of 5, you do not need to count one by one.`,
  parent: `Do it on stairs or while walking: clap on every second step.`,
  q: [
    { l:`b`, q:`2, 4, 6, ?, 10. What is the missing number?`, a:`8` },
    { l:`b`, q:`Count by 5: 35, 40, ? What number comes next?`, a:`45` },
    { l:`c`, q:`How many fingers are on 6 hands?`, a:`30`, s:`5, 10, 15, 20, 25, 30.` },
    { l:`c`, q:`How many legs do 7 chickens have?`, a:`14`, s:`Each chicken has 2 legs: 2, 4, 6, 8, 10, 12, 14.` },
    { l:`s`, q:`A frog starts at 0 and jumps 3 steps each time. Which of these numbers will it land on?`, o:[`12`,`14`,`16`,`20`], a:`12`, s:`3, 6, 9, 12. Only 12 is on the list.` },
    { l:`o`, q:`I count 2, 4, 6, ... all the way to 20. How many numbers did I say?`, a:`10`, h:`Each number is 2 apart; think 10 twos make 20.`, s:`2 x 10 = 20 so there are 10 numbers.` }
  ]},
{ t: `Comparing & Ordering`, sk: `Which number is bigger?`,
  goal: `Compare two-digit numbers and build the largest or smallest from digit cards.`,
  key: `Compare tens first. If tens match, compare ones.`,
  learn: [
    `To compare 58 and 85, look at the <b>tens first</b>: 8 tens is more than 5 tens, so <b>85 &gt; 58</b>. The blocks below show it: 58 is 5 tens and 8 ones, 85 is 8 tens and 5 ones.`,
    `If the tens are equal, compare the ones: 63 vs 67. Same tens, so 67 &gt; 63.`,
    `<b>Digit cards:</b> use 3 and 7 to make the biggest number: 73 (put the biggest digit in the tens).`,
    `<b>Between:</b> the number between 46 and 48 is 47.`
  ],
  do: `<b>Hands-on:</b> Write digits 0-9 on cards. Draw 2 cards each. Make the biggest 2-digit number you can. Who wins?`,
  tip: `<b>Olympiad tip:</b> When a puzzle asks how many numbers are between A and B, do not count A or B.`,
  parent: `Ask "how do you know?" every time. Reasoning matters more than the answer.`,
  q: [
    { l:`b`, q:`Which is bigger: 58 or 85?`, o:[`58`,`85`], a:`85` },
    { l:`b`, q:`What number is between 46 and 48?`, a:`47` },
    { l:`c`, q:`Which is the smallest: 39, 93, 29, 92?`, a:`29` },
    { l:`c`, q:`What is the biggest 2-digit number you can make with the digits 3 and 7?`, a:`73` },
    { l:`s`, q:`Using two of the digits 4, 0, 8, what is the smallest 2-digit number you can make? (A number cannot start with 0.)`, a:`40`, s:`Try 04? That is just 4. So the smallest is 40.` },
    { l:`o`, q:`How many whole numbers are more than 34 and less than 41?`, a:`6`, h:`List them: 35, 36, ...`, s:`35, 36, 37, 38, 39, 40 = 6 numbers.` }
  ]},
{ t: `Adding Tens and Ones`, sk: `Adding tens in your head`,
  goal: `Add tens to a number without writing.`,
  key: `30 + 40 = 3 tens + 4 tens = 7 tens = 70.`,
  learn: [
    `<b>Tens are like ones:</b> 3 tens + 4 tens = 7 tens. So 30 + 40 = 70.`,
    `<b>Add a tens number to any number:</b> 45 + 20. Only the tens digit changes: 4 tens + 2 tens = 6 tens. So 65.`,
    `[[bond:57|50,7]]`,
    `<b>Add ones to a tens number:</b> 50 + 7 = 57. On the hundred chart, the numbers ending in 7 line up in one column.`,
    `Big jumps in tens are easy: start 7, add 10 each time: 7, 17, 27, 37. The ones digit stays 7!`
  ],
  do: `<b>Hands-on:</b> Use a hundred chart. Start on 7, jump down (+10) each time. See the ones digit stay the same.`,
  tip: `<b>Olympiad tip:</b> When you keep adding 10, the ones digit never changes. Use this to spot which numbers you can reach.`,
  parent: `Use a 100-chart on the wall. Coloured pencil paths make patterns visible.`,
  q: [
    { l:`b`, q:`Work out: 30 + 40 = ?`, a:`70` },
    { l:`b`, q:`Work out: 50 + 7 = ?`, a:`57` },
    { l:`c`, q:`Work out: 45 + 20 = ?`, a:`65` },
    { l:`c`, q:`Find the missing number: 60 + ? = 90`, a:`30`, s:`9 tens - 6 tens = 3 tens.` },
    { l:`s`, q:`Work out: 34 + 30 + 5 = ?`, a:`69`, s:`34 + 30 = 64, plus 5 = 69.` },
    { l:`o`, q:`Start at 7 and keep adding 10 (7, 17, 27 ...). Which of these numbers will you land on?`, o:[`37`,`45`,`52`,`60`], a:`37`, s:`7, 17, 27, 37. Every number ends in 7.` }
  ]},
{ t: `Olympiad Day: Odd, Even & Patterns`, sk: `Odd, even and patterns`,
  goal: `Use odd and even rules and spot patterns. These are two clever tools for puzzles.`,
  key: `Even + even = even. Odd + odd = even. Odd + even = odd.`,
  learn: [
    `<b>Even</b> numbers can be paired up with none left over: 2, 4, 6, 8, 10. <b>Odd</b> numbers always have one left over: 1, 3, 5, 7, 9.`,
    `Odd and even rules: even + even = even. odd + odd = even (the two leftovers pair up!). odd + even = odd. Below, 13 and 14 are paired up: 13 has one left over, 14 has none.`,
    `<b>Number patterns:</b> look at the <i>gaps</i>. 2, 4, 7, 11: gaps are 2, 3, 4, so the next gap is 5.`,
    `<b>Odd or even without adding:</b> 1 + 3 + 5 + 7 + 9 has five odd numbers. Five odds leave one odd leftover, so the total is odd.`
  ],
  do: `<b>Hands-on:</b> Pair up 13 buttons. Is there a leftover? Now 14. Tell a grown-up why odd + odd is always even.`,
  tip: `<b>Olympiad tip:</b> When a puzzle asks "can you...?", check odd and even first. It can quickly show that something is impossible.`,
  parent: `This is the first true "olympiad" thinking day. Praise the reasoning, even if the answer is wrong.`,
  q: [
    { l:`b`, q:`Is the number 38 odd or even?`, o:[`odd`,`even`], a:`even` },
    { l:`b`, q:`1, 3, 5, 7, ? What number comes next?`, a:`9` },
    { l:`c`, q:`When you add two odd numbers, is the answer odd or even?`, o:[`odd`,`even`], a:`even`, s:`3 + 5 = 8, 7 + 1 = 8. The leftovers pair up.` },
    { l:`c`, q:`Can you share 13 sweets equally between 2 children with none left over?`, o:[`yes`,`no`], a:`no`, s:`13 is odd, so one sweet is left over.` },
    { l:`s`, q:`Look at the pattern: 2, 4, 7, 11, ? What number comes next?`, a:`16`, h:`Look at the gaps between numbers.`, s:`Gaps: 2, 3, 4, next gap 5. 11 + 5 = 16.` },
    { l:`o`, q:`Ann adds 1 + 3 + 5 + 7 + 9. Is her total odd or even?`, o:[`odd`,`even`], a:`odd`, h:`How many odd numbers are being added?`, s:`Five odd numbers: pairs make even, one left over makes odd. (Check: 25.)` }
  ]}
]});
