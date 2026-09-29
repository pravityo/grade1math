(window.CURRICULUM = window.CURRICULUM || []).push(
{ week: 1, theme: `Number Bonds & Making 10`,
  blurb: `The single most important skill in Singapore maths: seeing every number as two parts.`,
  lessons: [
{ t: `Number Bonds to 10`, sk: `Number bonds (part-whole)`,
  goal: `See 10 as two parts in every possible way, instantly.`,
  key: `Two parts make a whole. 10 = 1+9 = 2+8 = 3+7 = 4+6 = 5+5.`,
  learn: [
    `<b>Big idea:</b> every number is a whole that can be split into two parts. Singapore maths calls this a <b>number bond</b>.`,
    `[[bond:10|3,7]]`,
    `Here the whole is 10 and the parts are 3 and 7. If you know the whole and one part, the other part is a <b>missing part</b>.`,
    `[[frame:6]]`,
    `6 counters are on the ten-frame. How many empty spaces are there? 4! So <b>6 and 4 make 10</b>.`,
    `[[bar:6,?|10]]`,
    `The same idea drawn as a <b>bar model</b>: the top bar is the whole, the bottom bars are the parts.`
  ],
  do: `<b>Hands-on:</b> Take 10 coins or buttons. Split them into two piles in every way you can. Write each split down (e.g. 3 and 7). How many splits do you find? Did you notice a pattern?`,
  tip: `<b>Olympiad tip:</b> Always find <i>all</i> the pairs, in order. Systematic listing (1+9, 2+8, 3+7...) is how olympiad kids never miss an answer.`,
  parent: `Ask "How many more to make 10?" during the day (stairs, fingers, snacks). Fluency here powers everything later.`,
  q: [
    { l:`b`, q:`6 + ? = 10`, a:`4`, h:`Use the ten-frame: 6 filled, how many empty?`, s:`6 + 4 = 10.` },
    { l:`b`, q:`10 = 3 + ?`, a:`7`, s:`3 + 7 = 10.` },
    { l:`c`, q:`4 + ? + 3 = 10`, a:`3`, h:`First add 4 + 3.`, s:`4 + 3 = 7, and 7 + 3 = 10.` },
    { l:`c`, q:`List pairs that make 10, using numbers 1 to 9. 1+9 and 9+1 count as different. How many pairs are there?`, a:`9`, h:`Start 1+9, 2+8, ... and keep going to 9+1.`, s:`The first number can be 1,2,3,4,5,6,7,8,9 so there are 9 pairs.` },
    { l:`s`, q:`Two numbers make 10. They differ by 2. What is the bigger number?`, a:`6`, h:`Try 5+5, then 6+4...`, s:`6 + 4 = 10 and 6 is 2 more than 4. So the bigger number is 6.` },
    { l:`o`, q:`Pick three different numbers from 1, 2, 3, 4, 5 that add to 10. How many different sets of three can you find? (1,4,5 and 5,4,1 are the same set.)`, a:`2`, h:`Try the biggest number 5 first.`, s:`1+4+5 = 10 and 2+3+5 = 10. No other set works, so 2 sets.` }
  ]},
{ t: `Bonds to 20 & Making 10`, sk: `Making 10 strategy`,
  goal: `Use bonds to 10 to add across ten, e.g. 8 + 5.`,
  key: `To add across ten, fill up the 10 first: 8 + 5 = 8 + 2 + 3 = 10 + 3 = 13.`,
  learn: [
    `<b>Making 10</b> is the Singapore secret weapon. To add 8 + 5, take 2 from the 5 to make 10 with the 8.`,
    `[[frame:13]]`,
    `8 + 5: fill the first frame (8 + 2 = 10). We used 2 of the 5, so 3 are left. 10 + 3 = <b>13</b>.`,
    `[[bond:5|2,3]]`,
    `We split 5 into 2 and 3, then added the 2 to the 8. Bonds to 20 work the same way: 20 = 12 + 8, since 12 needs 8 more to reach 20.`
  ],
  do: `<b>Hands-on:</b> Put 9 counters in one ten-frame and 6 in another. Move counters until one frame is full. Read the total. Repeat with 8 and 7, and 9 and 4.`,
  tip: `<b>Olympiad tip:</b> When two numbers add to a total and you know how much bigger one is, "take away the extra, then share equally".`,
  parent: `Let your child say the steps out loud ("8 needs 2 to make 10"). Explaining is the learning.`,
  q: [
    { l:`b`, q:`10 + 6 = ?`, a:`16`, s:`10 and 6 more is 16.` },
    { l:`b`, q:`20 = 12 + ?`, a:`8`, h:`How many more from 12 to reach 20?`, s:`12 + 8 = 20.` },
    { l:`c`, q:`8 + 7 = ? (Make 10 first.)`, a:`15`, s:`8 + 2 = 10, 7 = 2 + 5, so 10 + 5 = 15.` },
    { l:`c`, q:`9 + 6 = ?`, a:`15`, h:`9 needs 1 to make 10.`, s:`9 + 1 = 10, then 10 + 5 = 15.` },
    { l:`s`, q:`7 + 5 + 3 = ?`, a:`15`, h:`Find the pair that makes 10 first.`, s:`7 + 3 = 10, then 10 + 5 = 15.` },
    { l:`o`, q:`20 birds sit in two trees. The left tree has 4 more birds than the right tree. How many birds are in the left tree?`, a:`12`, h:`Take away the extra 4, then share the rest equally.`, s:`20 - 4 = 16. Share 16 equally: 8 each. Left tree = 8 + 4 = 12. Check: 12 + 8 = 20.` }
  ]},
{ t: `Adding Within 20`, sk: `Doubles & near-doubles`,
  goal: `Add quickly using make-ten and doubles.`,
  key: `Know doubles (6+6=12). Near-double: 7+8 = 7+7+1.`,
  learn: [
    `<b>Doubles</b> are easy to remember: 1+1=2, 2+2=4, 3+3=6, 4+4=8, 5+5=10, 6+6=12, 7+7=14, 8+8=16, 9+9=18.`,
    `<b>Near-doubles:</b> 7 + 8 is one more than 7 + 7. So 7 + 8 = 14 + 1 = 15.`,
    `[[bar:7,8|?]]`,
    `<b>Three numbers:</b> look for a pair that makes 10 first. 6 + 7 + 4: 6 + 4 = 10, then 10 + 7 = 17.`
  ],
  do: `<b>Hands-on:</b> Roll two dice, add them using the fastest strategy (double? near-double? make ten?). Play 10 rounds and race a parent.`,
  tip: `<b>Olympiad tip:</b> Before you add, scan for helpful pairs. Smart ordering beats hard work.`,
  parent: `Time it playfully. The goal is knowing which strategy is quickest, not memorising by force.`,
  q: [
    { l:`b`, q:`6 + 6 = ?`, a:`12`, s:`Double 6 is 12.` },
    { l:`b`, q:`8 + 5 = ?`, a:`13`, s:`8 + 2 = 10, plus 3 more = 13.` },
    { l:`c`, q:`7 + 8 = ?`, a:`15`, h:`Near-double of 7 + 7.`, s:`7 + 7 = 14, one more = 15.` },
    { l:`c`, q:`9 + 8 = ?`, a:`17`, s:`Double 8 = 16, plus 1 = 17.` },
    { l:`s`, q:`5 + 6 + 7 = ?`, a:`18`, h:`5 + 6 is a near-double. Or find 5 + 7 first.`, s:`5 + 6 = 11, 11 + 7 = 18.` },
    { l:`o`, q:`Ali has 8 marbles. Ben has 5 more than Ali. How many marbles do they have together?`, a:`21`, h:`Find Ben's marbles first.`, s:`Ben: 8 + 5 = 13. Together: 8 + 13 = 21.` }
  ]},
{ t: `Subtracting Within 20`, sk: `Subtraction as part-whole`,
  goal: `Subtract by thinking "what goes with this part to make the whole?".`,
  key: `15 - 9: the whole is 15, one part is 9, the missing part is 6.`,
  learn: [
    `Subtraction is finding a <b>missing part</b>. 15 - 9 = ? means "15 is the whole, 9 is one part, what is the other part?"`,
    `[[bond:15|9,?]]`,
    `<b>Strategy 1: think addition.</b> 9 + ? = 15. 9 + 1 = 10, then 5 more. That is 6.`,
    `<b>Strategy 2: take away via 10.</b> 13 - 5: take 3 to reach 10, then take 2 more. 10 - 2 = 8.`,
    `[[bar:?,5|13]]`
  ],
  do: `<b>Hands-on:</b> Start with 15 counters. Hide some under a cup, show the rest. Your child works out how many are hidden. Swap roles.`,
  tip: `<b>Olympiad tip:</b> Puzzles often say "I think of a number...". Undo each step backwards to find it.`,
  parent: `Say the "think addition" strategy often. It makes subtraction easier than counting backwards.`,
  q: [
    { l:`b`, q:`15 - 9 = ?`, a:`6`, s:`9 + 6 = 15.` },
    { l:`b`, q:`13 - 5 = ?`, a:`8`, s:`13 - 3 = 10, 10 - 2 = 8.` },
    { l:`c`, q:`17 - 8 = ?`, a:`9`, s:`8 + 9 = 17.` },
    { l:`c`, q:`20 - 12 = ?`, a:`8`, s:`12 + 8 = 20.` },
    { l:`s`, q:`16 - 7 - 4 = ?`, a:`5`, h:`Do 7 + 4 first, then take from 16.`, s:`7 + 4 = 11, 16 - 11 = 5.` },
    { l:`o`, q:`I think of a number. I add 6, then subtract 4. I get 12. What was my number?`, a:`10`, h:`Work backwards: undo the last step first.`, s:`Undo -4 by +4: 12 + 4 = 16. Undo +6 by -6: 16 - 6 = 10. Check: 10+6-4 = 12.` }
  ]},
{ t: `Fact Families & Bar Models`, sk: `Bar model (part-whole)`,
  goal: `Turn a story into a bar model and choose the right operation.`,
  key: `Whole = part + part. Draw the bar first, then decide add or subtract.`,
  learn: [
    `A <b>fact family</b> uses three numbers: 6, 9, 15. Four facts: 6+9=15, 9+6=15, 15-6=9, 15-9=6.`,
    `<b>Bar model:</b> Mei has 9 stickers. She gets some more and now has 15. How many did she get?`,
    `[[bar:9,?|15]]`,
    `Whole = 15, one part = 9, missing part = 15 - 9 = 6.`,
    `<b>Comparison model:</b> Amy has 8 apples. Ben has 5 fewer.`,
    `[[cmp:8,3|Amy,Ben]]`
  ],
  do: `<b>Hands-on:</b> Write three-number fact families for (4, 7, 11), (8, 9, 17), (6, 6, 12). Draw a bar model for each.`,
  tip: `<b>Olympiad tip:</b> Sum and difference: if two numbers add to 14 and differ by 2, the bigger is (14 + 2) / 2 = 8. Draw two bars to see why.`,
  parent: `Always ask "Can you draw it?" before "What is the answer?". The bar model is the habit that carries to P6.`,
  q: [
    { l:`b`, q:`9 + ? = 15`, a:`6`, s:`15 - 9 = 6.` },
    { l:`b`, q:`Fact family of 8, 7, 15. What is 15 - 7?`, a:`8`, s:`8 + 7 = 15 so 15 - 7 = 8.` },
    { l:`c`, q:`12 - ? = 5`, a:`7`, h:`5 + ? = 12.`, s:`5 + 7 = 12.` },
    { l:`c`, q:`Amy has 8 apples. Ben has 5 fewer than Amy. How many apples do they have altogether?`, a:`11`, h:`Find Ben's apples first.`, s:`Ben: 8 - 5 = 3. Together: 8 + 3 = 11.` },
    { l:`s`, q:`Tom has 7 red cars and 5 blue cars. He gives 4 cars away. How many cars are left?`, a:`8`, s:`7 + 5 = 12. 12 - 4 = 8.` },
    { l:`o`, q:`Two numbers add up to 14. The bigger is 2 more than the smaller. What is the bigger number?`, a:`8`, h:`Take away the 2 extra, share 12 equally, then add 2 back.`, s:`14 - 2 = 12, half is 6 (smaller). Bigger = 6 + 2 = 8. Check: 8 + 6 = 14.` }
  ]}
]});
