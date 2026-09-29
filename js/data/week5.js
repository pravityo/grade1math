(window.CURRICULUM = window.CURRICULUM || []).push(
{ week: 5, theme: `Shapes, Length, Time & Money`,
  blurb: `Real-world maths: shapes you can hold, clocks you can read, and Singapore dollars.`,
  lessons: [
{ t: `2D Shapes`, sk: `Properties of shapes`,
  goal: `Name shapes by their sides and corners, and count shapes hidden inside bigger ones.`,
  key: `Triangle 3 sides. Square/rectangle 4. Pentagon 5. Hexagon 6.`,
  learn: [
    `A <b>side</b> is a straight edge. A <b>corner</b> is where two sides meet. Triangle: 3 sides, 3 corners. Square: 4 sides, 4 corners. Pentagon: 5. Hexagon: 6.`,
    `<b>Square vs rectangle:</b> all 4 sides of a square are equal. A rectangle has 2 long and 2 short sides.`,
    `<b>Cut a rectangle along its diagonal</b> and you get two triangles.`,
    `<b>Hidden shapes:</b> A big triangle has a line from its top corner to the middle of the bottom. Now there are 3 triangles: left small, right small, and the big one.`
  ],
  do: `<b>Hands-on:</b> Cut a paper square along a diagonal. Cut a rectangle in two. Make a house out of a square and a triangle.`,
  tip: `<b>Olympiad tip:</b> To count hidden shapes, count small ones first, then two together, then three together.`,
  parent: `Go on a shape hunt in the home: windows, plates, signs.`,
  q: [
    { l:`b`, q:`How many sides does a triangle have?`, a:`3` },
    { l:`b`, q:`How many sides does a hexagon have?`, a:`6` },
    { l:`c`, q:`2 triangles and 1 square. How many sides in total?`, a:`10`, s:`3 + 3 + 4 = 10.` },
    { l:`c`, q:`A rectangle is cut along a diagonal. What two shapes do you get?`, o:[`2 squares`,`2 triangles`,`2 circles`], a:`2 triangles` },
    { l:`s`, q:`A square has 4 equal sides of 5 cm. What is the total length around it?`, a:`20`, u:`cm`, s:`5 + 5 + 5 + 5 = 20.` },
    { l:`o`, q:`A big triangle has a line from its top corner to the middle of the bottom side. How many triangles can you count altogether?`, a:`3`, h:`Small left, small right, and the whole thing.`, s:`1 left + 1 right + 1 big = 3.` }
  ]},
{ t: `3D Shapes`, sk: `Solid shapes`,
  goal: `Know faces, edges and corners of a cube, and dice logic.`,
  key: `Cube: 6 faces, 12 edges, 8 corners. Opposite faces of a dice add to 7.`,
  learn: [
    `<b>3D shapes</b> are solid. A <b>face</b> is a flat side. An <b>edge</b> is where 2 faces meet. A <b>corner</b> is where edges meet.`,
    `<b>Cube:</b> 6 faces, 12 edges, 8 corners. <b>Ball (sphere):</b> rolls, no flat faces. <b>Cylinder:</b> 2 flat circles and 1 curved surface.`,
    `<b>Dice:</b> opposite faces add to 7. (1 opposite 6, 2 opposite 5, 3 opposite 4.) Total on all 6 faces = 21.`
  ],
  do: `<b>Hands-on:</b> Find boxes, cans, and balls at home. Sort into "rolls" and "stacks". Look at a real dice: check that opposite faces add to 7.`,
  tip: `<b>Olympiad tip:</b> Dice puzzles: use the total of 21 and the "opposite adds to 7" rule.`,
  parent: `Build a cube from 12 straws and 8 balls of clay to see edges and corners.`,
  q: [
    { l:`b`, q:`A cube has ___ faces.`, a:`6` },
    { l:`b`, q:`Which of these rolls? cube, ball, box`, o:[`cube`,`ball`,`box`], a:`ball` },
    { l:`c`, q:`How many corners does a cube have?`, a:`8` },
    { l:`c`, q:`How many edges does a cube have?`, a:`12` },
    { l:`s`, q:`On a dice, the number opposite 2 is ...`, a:`5`, s:`Opposite faces add to 7.` },
    { l:`o`, q:`A dice is on the table with 4 on top. What do the 4 side faces add up to? (You cannot see the bottom.)`, a:`14`, h:`Total of all faces is 21. What is the bottom face?`, s:`Bottom is 7 - 4 = 3. Sides = 21 - 4 - 3 = 14.` }
  ]},
{ t: `Length & Measuring`, sk: `Centimetres & metres`,
  goal: `Measure with a ruler and reason about lengths.`,
  key: `Line up 0 with the start. Use cm for small things, m for big.`,
  learn: [
    `A <b>ruler</b> measures in <b>centimetres (cm)</b>. Start at <b>0</b>, not 1.`,
    `Use <b>cm</b> for a pencil and <b>m</b> (metre) for a room. 1 m = 100 cm.`,
    `<b>Broken ruler:</b> a pencil starts at 3 and ends at 11. Its length is 11 - 3 = 8 cm.`,
    `[[cmp:25,16|Tom's rope,Ann's rope]]`
  ],
  do: `<b>Hands-on:</b> Measure 5 items at home in cm. Rank them longest to shortest. Then measure your foot with paper clips.`,
  tip: `<b>Olympiad tip:</b> A broken ruler: subtract the start from the end. Do not count the marks.`,
  parent: `Lay a ruler beside objects and always say "start at zero".`,
  q: [
    { l:`b`, q:`A 12 cm ribbon is cut into two equal pieces. How long is each piece?`, a:`6`, u:`cm` },
    { l:`b`, q:`Which unit would you use to measure a classroom?`, o:[`cm`,`m`], a:`m` },
    { l:`c`, q:`A line is 8 cm. Another line is 5 cm longer. How long is the second line?`, a:`13`, u:`cm` },
    { l:`c`, q:`Tom's rope is 25 cm. Ann's rope is 9 cm shorter. How long is Ann's rope?`, a:`16`, u:`cm` },
    { l:`s`, q:`3 books are stacked. Each is 4 cm thick. How tall is the stack?`, a:`12`, u:`cm` },
    { l:`o`, q:`A pencil starts at the 3 cm mark of a ruler and ends at the 11 cm mark. How long is the pencil?`, a:`8`, u:`cm`, s:`11 - 3 = 8 cm.` }
  ]},
{ t: `Telling the Time`, sk: `Hours, half hours, quarter hours`,
  goal: `Read the clock to the hour, half hour and quarter hour, and work out how long things take.`,
  key: `Short hand = hours. Long hand = minutes. 30 min = half hour.`,
  learn: [
    `The <b>short hand</b> shows hours. The <b>long hand</b> shows minutes.`,
    `<b>O'clock:</b> long hand on 12. <b>Half past:</b> long hand on 6 (30 minutes). <b>Quarter past:</b> long hand on 3 (15 min). <b>Quarter to:</b> long hand on 9 (45 min).`,
    `<b>Duration:</b> School from 8:00 to 1:00 is 5 hours (8 to 12 is 4 hours, then 1 more).`,
    `<b>Days of the week cycle every 7 days.</b> If today is Wednesday, in 7 days it is Wednesday again. In 10 days it is 3 days later: Saturday.`
  ],
  do: `<b>Hands-on:</b> Use a paper plate clock. Show times your child does daily (wake up, dinner, math time).`,
  tip: `<b>Olympiad tip:</b> Days-of-week puzzles: subtract full weeks (7) and count the rest.`,
  parent: `Ask "what time will it be in an hour?" at every routine moment.`,
  q: [
    { l:`b`, q:`Write half past 4 as a digital time (like 4:00).`, a:[`4:30`,`430`] },
    { l:`b`, q:`How many minutes are in a half hour?`, a:`30` },
    { l:`c`, q:`What time is it 1 hour after 7:30?`, a:`8:30` },
    { l:`c`, q:`School starts at 8:00 and finishes at 1:00. How many hours?`, a:`5`, u:`hours` },
    { l:`s`, q:`A film starts at 2:30 and lasts 2 hours. What time does it end?`, a:`4:30` },
    { l:`o`, q:`Today is Wednesday. What day will it be in 10 days?`, a:`saturday`, h:`7 days later is Wednesday again.`, s:`10 - 7 = 3. Three days after Wednesday: Thursday, Friday, Saturday.` }
  ]},
{ t: `Singapore Money`, sk: `Coins and dollars`,
  goal: `Add and give change with cents and dollars.`,
  key: `100 cents = 1 dollar. Change = money given - price.`,
  learn: [
    `Singapore coins: <b>5c, 10c, 20c, 50c, $1</b>. 100 cents = $1.`,
    `<b>Adding coins:</b> 20c + 10c + 5c = 35c.`,
    `<b>Change:</b> an apple costs 60c. You pay $1 (100c). Change = 100 - 60 = 40c.`,
    `<b>Fewest coins:</b> use the biggest coin that fits first. 35c with 5c, 10c, 20c coins: 20 + 10 + 5 = 3 coins.`
  ],
  do: `<b>Hands-on:</b> Set up a pretend shop with price tags in cents. Take turns being shopkeeper giving change.`,
  tip: `<b>Olympiad tip:</b> Fewest-coins puzzles: try the largest coin first, then fill the rest.`,
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
