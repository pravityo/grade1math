# Math Adventure: Grade 1 Home Curriculum

A no-build web app for a 6-year-old to study maths at home, Monday to Friday evenings.
Singapore-style (concrete, pictorial, abstract) with material pushed beyond the usual
P1 level, plus olympiad-style thinking in every lesson.

## Run

Open `index.html` in a browser, or serve the folder: `npx http-server .`
Progress is saved in the browser's localStorage (no accounts, no network).

## Structure

- 8 weeks x 5 lessons = 40 lessons, 242 questions (`js/data/week1.js` ... `week8.js`)
- Each lesson: Look Back (spaced review of 1, 3, 7, 14 lessons ago) -> Learn (pictures, hands-on task, olympiad tip, parent note) -> Practice -> Challenge -> Wrap-up
- Question levels: Warm-up, Core, Stretch, Olympiad
- Home page shows the next unfinished lesson, so missed days never skip content
- Look Back page: mixed random quiz and recap cards; Parent page: answer keys, progress backup

| Week | Theme |
|---|---|
| 1 | Number bonds, making 10, bar models |
| 2 | Numbers to 100, skip counting, odd/even |
| 3 | Add and subtract within 100, word problems |
| 4 | Hundreds, mental maths, first multiplication and division |
| 5 | Shapes, length, time, Singapore money |
| 6 | Fractions, data, Venn diagrams |
| 7 | Olympiad I: Gauss, counting, patterns, logic, puzzles |
| 8 | Olympiad II: ages, working backwards, pigeonhole, combinations, mock |

## Add lessons

Append to `window.CURRICULUM` in a new `js/data/weekN.js` and include it in `index.html`.
Question fields: `l` level (b/c/s/o), `q`, `a` (string or array), optional `o` options, `h` hint, `s` solution, `u` unit.
Visual tokens in `learn`: `[[bond:10|3,7]]`, `[[bar:6,?|10]]`, `[[cmp:8,3|Amy,Ben]]`, `[[frame:13]]`.
