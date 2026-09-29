(window.CURRICULUM = window.CURRICULUM || []).push(
{ week: 5, theme: `Shapes, Length, Time & Money`,
  blurb: `Real-world maths: shapes you can hold, clocks you can read, and Singapore dollars.`,
  lessons: [
{ t: `2D Shapes`, sk: `Flat shapes: sides and corners`,
  goal: `Name shapes by their sides and corners, and count shapes hidden inside bigger ones.`,
  key: `Triangle 3 sides. Square/rectangle 4. Pentagon 5. Hexagon 6.`,
  learn: [
    `A <b>side</b> is a straight edge. A <b>corner</b> is where two sides meet. A triangle has 3 sides and 3 corners. A square has 4 sides and 4 corners. A pentagon has 5 sides. A hexagon has 6 sides.`,
    `<b>Square or rectangle?</b> All 4 sides of a square are the same length. A rectangle has 2 long sides and 2 short sides.`,
    `Cut a rectangle from one corner to the opposite corner, and you get two triangles.`,
    `<b>Hidden shapes:</b> draw a line from the top corner of a big triangle to the middle of the bottom. Now there are 3 triangles: a small one on the left, a small one on the right, and the big one.`
  ],
  do: `<b>Hands-on:</b> Cut a paper square along a diagonal. Cut a rectangle in two. Make a house out of a square and a triangle.`,
  tip: `<b>Olympiad tip:</b> To count hidden shapes, count the small ones first. Then count two joined together, then three joined together.`,
  parent: `Go on a shape hunt in the home: windows, plates, signs.`,
  q: [
    { l:`b`, q:`How many sides does a triangle have?`, a:`3` },
    { l:`b`, q:`How many sides does a hexagon have?`, a:`6` },
    { l:`c`, q:`2 triangles and 1 square. How many sides in total?`, a:`10`, s:`3 + 3 + 4 = 10.` },
    { l:`c`, q:`A rectangle is cut along a diagonal. What two shapes do you get?`, o:[`2 squares`,`2 triangles`,`2 circles`], a:`2 triangles` },
    { l:`s`, q:`A square has 4 equal sides of 5 cm. What is the total length around it?`, a:`20`, u:`cm`, s:`5 + 5 + 5 + 5 = 20.` },
    { l:`o`, q:`A big triangle has a line from its top corner to the middle of the bottom side. How many triangles can you count altogether?`, a:`3`, h:`Small left, small right, and the whole thing.`, s:`1 left + 1 right + 1 big = 3.` }
  ]},
{ t: `3D Shapes`, sk: `Solid shapes and dice`,
  goal: `Know faces, edges and corners of a cube, and dice logic.`,
  key: `Cube: 6 faces, 12 edges, 8 corners. Opposite faces of a dice add to 7.`,
  learn: [
    `3D shapes are solid, not flat. A <b>face</b> is a flat side. An <b>edge</b> is where 2 faces meet. A <b>corner</b> is where edges meet.`,
    `A <b>cube</b> has 6 faces, 12 edges and 8 corners. A <b>ball</b> (sphere) rolls and has no flat faces. A <b>cylinder</b> has 2 flat circles and 1 curved surface. Look at the picture below to spot each solid.`,
    `<b>Dice:</b> the faces opposite each other add up to 7. 1 is opposite 6, 2 is opposite 5, and 3 is opposite 4. All 6 faces together add up to 21.`
  ],
  do: `<b>Hands-on:</b> Find boxes, cans, and balls at home. Sort into "rolls" and "stacks". Look at a real dice: check that opposite faces add to 7.`,
  tip: `<b>Olympiad tip:</b> For dice puzzles, use two facts: all the faces add up to 21, and opposite faces add up to 7.`,
  parent: `Build a cube from 12 straws and 8 balls of clay to see edges and corners.`,
  q: [
    { l:`b`, q:`How many faces does a cube have?`, a:`6` },
    { l:`b`, q:`Which of these shapes can roll? a cube, a ball or a box`, o:[`cube`,`ball`,`box`], a:`ball` },
    { l:`c`, q:`How many corners does a cube have?`, a:`8` },
    { l:`c`, q:`How many edges does a cube have?`, a:`12` },
    { l:`s`, q:`On a dice, the numbers on opposite faces add up to 7. What number is opposite the 2?`, a:`5`, s:`Opposite faces add to 7.` },
    { l:`o`, q:`A dice sits on a table with 4 on top. The bottom face is hidden. Opposite faces add up to 7, and all six faces add up to 21. What do the four side faces add up to?`, a:`14`, h:`Total of all faces is 21. What is the bottom face?`, s:`Bottom is 7 - 4 = 3. Sides = 21 - 4 - 3 = 14.` }
  ]},
{ t: `Length & Measuring`, sk: `Measuring length`,
  goal: `Measure with a ruler and reason about lengths.`,
  key: `Line up 0 with the start. Use cm for small things, m for big.`,
  learn: [
    `A <b>ruler</b> measures in <b>centimetres (cm)</b>. Start at <b>0</b>, not 1.`,
    `Use cm (centimetres) for small things like a pencil, and m (metres) for big things like a room. 1 m = 100 cm.`,
    `<b>Pencil on a ruler:</b> a pencil starts at the 3 mark and ends at the 11 mark. Its length is 11 - 3 = 8 cm.`,
    `<b>Comparing lengths:</b> Tom's rope is 25 cm long and Ann's rope is 16 cm long. The difference is 25 - 16 = 9 cm, so Tom's rope is 9 cm longer.`,
    `[[cmp:25,16|Tom's rope,Ann's rope]]`
  ],
  do: `<b>Hands-on:</b> Measure 5 items at home in cm. Rank them longest to shortest. Then measure your foot with paper clips.`,
  tip: `<b>Olympiad tip:</b> If an object starts at 3 on a ruler, take the start away from the end. Do not count the marks.`,
  parent: `Lay a ruler beside objects and always say "start at zero".`,
  q: [
    { l:`b`, q:`A 12 cm ribbon is cut into two equal pieces. How long is each piece?`, a:`6`, u:`cm` },
    { l:`b`, q:`Which unit would you use to measure a classroom?`, o:[`cm`,`m`], a:`m` },
    { l:`c`, q:`A line is 8 cm. Another line is 5 cm longer. How long is the second line?`, a:`13`, u:`cm` },
    { l:`c`, q:`Tom's rope is 25 cm. Ann's rope is 9 cm shorter. How long is Ann's rope?`, a:`16`, u:`cm` },
    { l:`s`, q:`3 books are stacked. Each is 4 cm thick. How tall is the stack?`, a:`12`, u:`cm` },
    { l:`o`, q:`A pencil starts at the 3 cm mark of a ruler and ends at the 11 cm mark. How long is the pencil?`, a:`8`, u:`cm`, s:`11 - 3 = 8 cm.` }
  ]},
{ t: `Telling the Time`, sk: `Telling the time`,
  goal: `Read the clock to the hour, half hour and quarter hour, and work out how long things take.`,
  key: `Short hand = hours. Long hand = minutes. 30 min = half hour.`,
  learn: [
    `The <b>short hand</b> shows hours. The <b>long hand</b> shows minutes.`,
    `<b>O'clock:</b> the long hand points to 12. <b>Half past:</b> the long hand points to 6 (30 minutes). <b>Quarter past:</b> the long hand points to 3 (15 minutes). <b>Quarter to:</b> the long hand points to 9 (45 minutes).`,
    `<b>How long?</b> School from 8:00 to 1:00 is 5 hours. From 8 to 12 is 4 hours, then 1 more.`,
    `<b>Time also repeats in days.</b> The days of the week cycle every 7 days. If today is Wednesday, in 7 days it is Wednesday again. In 10 days it is 3 days later: Saturday.`
  ],
  do: `<b>Hands-on:</b> Use a paper plate clock. Show the times you do things every day, like waking up, dinner and maths time.`,
  tip: `<b>Olympiad tip:</b> For days-of-the-week puzzles, take away whole weeks (7 days) and count the rest.`,
  parent: `Ask "what time will it be in an hour?" at every routine moment.`,
  q: [
    { l:`b`, q:`Write half past 4 as a digital time (like 4:00).`, a:[`4:30`,`430`] },
    { l:`b`, q:`How many minutes are in a half hour?`, a:`30` },
    { l:`c`, q:`What time is it 1 hour after 7:30?`, a:`8:30` },
    { l:`c`, q:`School starts at 8:00 in the morning and finishes at 1:00 in the afternoon. How many hours is that?`, a:`5`, u:`hours` },
    { l:`s`, q:`A film starts at 2:30 and lasts 2 hours. What time does it end?`, a:`4:30` },
    { l:`o`, q:`Today is Wednesday. What day will it be in 10 days?`, a:`saturday`, h:`7 days later is Wednesday again.`, s:`10 - 7 = 3. Three days after Wednesday: Thursday, Friday, Saturday.` }
  ]},
{ t: `Singapore Money`, sk: `Coins, dollars and change`,
  goal: `Add and give change with cents and dollars.`,
  key: `100 cents = 1 dollar. Change = money given - price.`,
  learn: [
    `Singapore coins: <b>5c, 10c, 20c, 50c, $1</b>. 100 cents = $1.`,
    `<b>Adding coins:</b> 20c + 10c + 5c = 35c.`,
    `<b>Change:</b> an apple costs 60c and you pay $1 (100c). Your change is 100 - 60 = 40c.`,
    `<b>Fewest coins:</b> use the biggest coin that fits first. To make 35c with 5c, 10c and 20c coins: 20 + 10 + 5 = 3 coins.`
  ],
  do: `<b>Hands-on:</b> Set up a pretend shop with price tags in cents. Take turns being shopkeeper giving change.`,
  tip: `<b>Olympiad tip:</b> In fewest-coins puzzles, try the biggest coin first, then fill in the rest.`,
  parent: `Give real coins for real errands. Money makes the maths meaningful.`,
  q: [
    { l:`b`, q:`20c + 10c + 5c = ? cents`, a:`35`, u:`cents` },
    { l:`b`, q:`A pen costs $2 and an eraser costs $3. How many dollars altogether?`, a:`5`, u:`dollars` },
    { l:`c`, q:`An apple costs 60c. You pay $1. How many cents change?`, a:`40`, u:`cents` },
    { l:`c`, q:`How many 20c coins make $1?`, a:`5`, s:`20, 40, 60, 80, 100.` },
    { l:`s`, q:`Mei has 3 coins of 50c and 2 coins of 20c. How many cents does she have?`, a:`190`, u:`cents`, s:`150 + 40 = 190.` },
    { l:`o`, q:`You have lots of 5c, 10c and 20c coins. What is the fewest number of coins needed to make 35c?`, a:`3`, h:`Use the biggest coin first.`, s:`20 + 10 + 5 = 35 uses 3 coins.` }
  ]}
]});
