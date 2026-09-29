# Learning Adventure: Grade 1 Home Curriculum

A no-build web app for a 6-year-old to study Maths, English and Science at home on weekday evenings.
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

## Deploy

GitHub Pages via `.github/workflows/pages.yml` (repo Settings > Pages > Source: GitHub Actions).
Live at https://pravityo.github.io/grade1math/ . On iPad/iPhone Safari use Share > Add to Home Screen so progress is not evicted.

## Randomised questions

Most warm-up, core and stretch questions are generated with fresh numbers every time a lesson is opened
(`js/gen.js`, wired up in `js/data/gens.js` as `"lesson:question" -> generator`). The static question in
`weekN.js` stays as the fallback and defines the level. Run `node tests/gen.test.js` to check every generator
1,500 times against independent calculations.

## Subjects

Each subject has 8 weeks x 5 lessons (`js/data/weekN.js` for maths, `englishN.js`, `scienceN.js`). English and Science use the
authoring helpers in `js/data/helpers.js` (`MC`, `TP`, `LS`) and illustration tokens from `js/illustrations2.js`
(`cards, seq, cycle, table, sentence, blend, states, plant, magnet, shadow, planets, moon, circuit, lever`).
Home shows a daily plan (Maths every weekday, plus English on Mon/Wed/Fri or Science on Tue/Thu; change it in Parent corner).
Run `node tests/data.test.js` to validate all lesson data.

## Learn tab depth and outside resources

Each lesson's Learn tab also shows: an "Explain it more" section, a worked example, common mistakes, talk prompts and vocabulary
(`js/data/deep-*.js`, keyed by lesson id) and free outside resources (`js/data/links.js`, found by web search). Lesson ids are
`0`-`39` (maths), `e0`-`e39` (English) and `s0`-`s39` (science). `node tests/data.test.js` checks every lesson has both.
Outside links are not verified by the tests and can change, so re-check them occasionally.

## Progress passwords

The Parent tab can create an SNES-style password (`js/password.js`) that holds progress: which lessons are done or marked known, the
first name, the daily plan and, in the full version, scores and completion dates. Enter it on any device or browser to carry on. It is
data, not a login, so nothing is stored on a server. `node tests/password.test.js` checks round trips and typo detection.

## Grown-ups gate

The Grown-ups tab and the answer keys open only after typing an "-ology" word for a hint shown in a pop-up (`js/gate.js`, 38 words).
It unlocks for 10 minutes after the last use. It keeps a young child out; it is not real security because the words are in the source.

## Adaptive learning (`js/adapt.js`)
Every answered question updates a review box for that lesson's skill (`S.skills`). A miss drops the box two levels and
remembers the question; a first-try correct answer moves it up. Boxes come due after 1, 2, 4, 7, 14 and 30 days, and
Look Back and the Quiz page ("Skills to practise") bring tricky or due skills back first. After two wrong tries a
question offers an easier one from the same lesson. Challenge stays locked until 60% of Practice is solved. Each subject
has a quick placement check (`#/placement/<subject>`, 2 questions from every 5th lesson, stops at the first miss) that
can mark earlier lessons as already known.

## Streaks, weekly goal and knight armour (`js/knightwear.js`)
The home page shows the streak (weekends never break it, one missed weekday in five is forgiven) and progress towards
the weekly goal (parent-set, 1 to 5 evenings). The little knight earns one of 12 pieces of armour for every 3 study days (days with a
solved question or finished lesson) and wears it straight away; the child can change outfits under "Open the armoury".
Study days live on the device, so accessories are not part of the progress password.
`node tests/adapt.test.js` covers all of this.

## Content checks
`node tests/coherence.test.js` checks that every picture has a text paragraph around it that points at it, that there is
no parent-directed wording in child text and no copied paragraphs or worked examples. `node tests/links.check.js` checks
that every outside link returns HTTP 200 (needs internet; use the "Check outside links" GitHub Action, optionally with
"prune" to remove dead ones).

## Theme and wording
The app is "Monster Knights": a little knight (js/knightwear.js) who earns armour, a monster buddy, one monster friend per
finished lesson, and quest wording. Child-facing lesson text in all three subjects is written for a 6-year-old:
short sentences, "you", no jargon without an explanation. Adult-facing text (parent notes, Explain it more) stays adult.
