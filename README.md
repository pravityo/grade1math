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

## Grown-ups gate

The Grown-ups tab and the answer keys open only after a parent signs in with Google (see below). They stay open for 10 minutes after the last use, then lock again.

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
Study days and armour are saved with the rest of the progress when a parent is signed in.
`node tests/adapt.test.js` covers all of this.

## Content checks
`node tests/coherence.test.js` checks that every picture has a text paragraph around it that points at it, that there is
no parent-directed wording in child text and no copied paragraphs or worked examples. `node tests/links.check.js` checks
that every outside link returns HTTP 200 (needs internet; use the "Check outside links" GitHub Action, optionally with
"prune" to remove dead ones).

## Theme and wording
The app is "Grade 1 Training Grounds": a little knight (js/knightwear.js) who earns armour, a monster buddy, one monster friend per
finished lesson, and quest wording. Child-facing lesson text in all three subjects is written for a 6-year-old:
short sentences, "you", no jargon without an explanation. Adult-facing text (parent notes, Explain it more) stays adult.

## Monsters and bosses (`js/monsters.js`)
Twenty monsters, each with its own body plan (ghost, flame, dino, octopus, robot, alien, mushroom, jellyfish, rock golem, fuzzball, caterpillar, bat, snail, pumpkin, cloud, cactus and more), cycle through the lessons. The
last lesson of every level (week) is a Big Boss with a crown. Each lesson opens with a battle scene: the knight against the
lesson's monster, whose "calm" bar fills as puzzles are solved until it becomes a friend in the monster book. The map,
subject cards, questions, rank (Page, Squire, Knight, Champion, Dragon Knight) and the skyline at the bottom of each page
change with the realm (Number Keep, Story Forest, Dragon Lab). `node tests/theme.test.js` checks all of it.

## Google sign-in, parents and cloud save
There are no passwords. Every parent signs in with their own Google account (`js/cloud.js`), which unlocks the Grown-ups
area for 10 minutes (`js/gate.js`) and keeps progress in a shared family record in Firestore (Firebase project
`grade-1-training-grounds`, config in `js/firebase-config.js`).
- A family record holds the parents' Google IDs, invited emails and the progress (`js/family.js`). The first parent to sign in creates it.
- A parent invites another by Gmail address; only that account can accept (an `invites/<email>` document points at the family).
- A device belongs to one family. An account that is not a parent of that family cannot open the Grown-ups area on it.
- `js/merge.js` combines two copies of progress: nothing earned is lost, except that a lesson marked "not done" on purpose stays not done.
- Progress stays in localStorage first, so the app works offline and for children without any sign-in.
- Publish the rules in `firestore.rules` in the Firebase console (Firestore Database, Rules). `pravityo.github.io` must be under
  Authentication, Settings, Authorized domains.
- Tests: `node tests/merge.test.js`, `node tests/family.test.js`. The Firestore rules themselves are not covered by the offline tests.

## Spelling Bee training (`js/bee.js`, `js/beeview.js`, `js/data/beewords.js`)
A "Bee" tab prepares for a grade 1 spelling bee. The built-in list is our own 360 practice words in 30 pattern groups (tiers 1
to 3), not the official Scripps list, which is copyrighted; a parent can paste the organisers' list in the Grown-ups area
(one word per line, optionally `word | meaning | sentence`), and those words are taught first.
- **Daily drill:** about 10 words, some new (at most 6 a day, set by the parent) and the rest due for review in Leitner boxes (1, 2, 4, 7, 14, 30 days). The last 7 days before the bee date have no new words, only review.
- **Ways to answer:** letter tiles, typing, or saying it out loud with a self-check. Words are spoken with the browser's speech (a pronouncer: word, meaning, sentence, repeat); without sound a grown-up reads it.
- **Game:** each drill is a fight with a word monster (5 hearts); points (10 first try, 5 second, 1 for trying, plus a combo bonus), ranks (Word Page to Word Wizard), 14 trophies, tamed monsters, streaks, and a Mock Bee (12 words in 3 harder rounds, 3 lives).
- **Countdown:** the parent sets the bee date; the app shows days left and whether the child is on track.
- Progress syncs with the rest of the saved progress (`js/merge.js`). Tests: `node tests/bee.test.js`.

### Word lists and levels
Words are graded **Simple, Advanced or Expert** (built-in groups by hand, imported words by `Bee.autoTier`: length, syllables, spelling traps such as silent letters, ph, gh, double letters, plus a set of common irregular words). Add `| 1`, `| 2` or `| 3` after a line to set a level yourself. The Bee page has tick boxes to choose which lists and levels to practise; the mock bee runs Simple, Advanced, then Expert rounds.
Grown-ups can add extra lists (school list, Scripps "Words of the Champions") from **Grown-ups > Spelling Bee**: paste words, or choose a .txt/.csv/.pdf file (PDFs are read in the browser with pdf.js from cdnjs). A preview lets you choose "first word of each line / column / every word" and edit the result before saving. Official lists are copyrighted, so they are not bundled in the repo; imported lists are saved only in the family's progress.
