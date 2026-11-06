# Flows - three flows on one four-screen loop (since 2026-11-06)

**History.** The first pilot (2026-11-05) had 22 screens of 9 types, a map before every topic, 8 buttons, silent clips and questions that were not read aloud. The user found it confusing. Every topic since uses the same four screens, and **every screen is narrated**. Sci7 Ch10 E1 v3 was built this way and the user said "this works well".

The three flows from the episode plan (**Story**, **Challenge**, **Wonder**) stay. They now change *what each of the four screens does and is called*, not which screens exist. Screen types: `skills/lt-package/chapter-schema.md`. How the screens look: `skills/lt-player-design/SKILL.md`.

## Episode

| # | Screen | Type | Content | Time |
|---|---|---|---|---|
| 0 | Episode title | `title` + narration | Welcome line: where we are and what we will find out. The player shows the **episode** name big, the chapter as context, and the loop line of the episode's first topic. | 6-10 s |
| | *1-2 topic loops* | | Each topic uses its flow (below). The flows may differ between topics. | |
| end | Recap + next time | `still` + narration (+ optional silent animation) | What we found today, then the open question for the next episode, over one picture of the story world. | 15-25 s |

A chapter with several episodes also has a chapter home: the chapter title and one button per episode. The home never repeats the episode title. A one-episode chapter opens straight on the episode title.

## The four screens (same ids and types in every flow)

| # | id | Type | Story flow | Challenge flow | Wonder flow |
|---|---|---|---|---|---|
| 1 | `e1.c1.story` | `video` role `hook` | **Story** - a character meets something they cannot explain or decide. Ends on the question. | **Challenge** - a real job the main child must do *now* (pick the heavier bag, share the money, read the rain gauge). Ends on "How should she decide?" | **Wonder** - a surprising real sight, **narrated** (never silent), held long enough to look. Ends on "Why...?" |
| 2 | `e1.c1.vote` | `vote` | **Vote** - predict the answer | **Try** - the class tries it with what they already know. The reveal lines name the disagreement ("Many of you said 0.45 - but look at the tenths place..."); this replaces the old "Stuck" screen. | **Guess** - the class guesses why it happened or what the test will show (the observation vote) |
| 3 | `e1.c1.explain` | `video` role `explain` | **Answer** - the NCERT concept in the book's terms, with its figure or evidence, tied back to the story | **Learn** - the concept arrives as the missing tool, then **the same video returns to the challenge and solves it** (this replaces the old separate "Solve" video) | **Find out** - the NCERT activity as a **lab** the class does on the projector, then a short Answer video with the concept only (a time-lapse video only when a lab cannot show it) |
| 4 | `e1.c1.check` | `mcq` | **Check** - same idea, new situation | **New challenge** - the same tool on a new problem; numbers and working come from the player (option text, overlays), never from the picture | **Check** - the same idea near the child's home |

**Labs.** When the topic has an NCERT activity, or a Maths tool to learn, add a `lab` screen (`e1.c1.lab`) between the vote and the explain video (`skills/lt-lab`). The class does the activity on the projector. The explain video then covers the concept only, and its demonstration scenes are dropped. In the Challenge flow the lab is the Learn step itself and ends by solving the challenge, so Maths topics need no explain video and no storyboard animation; their hook can be a narrated still. The rail names the lab step after the flow (Find out / Learn).

Give each topic its `flow` in `episodes.json` (`loops[].flow`). Put it in `script.json` screens only to override that. The player names the steps after it (Story/Vote/Answer/Check, Challenge/Try/Learn/New challenge, Wonder/Guess/Find out/Check).

**Choosing a flow.** Pick the flow that gives the concept its strongest opening:
- **Challenge** for skills and procedures (most Maths).
- **Wonder** for phenomena with a visible surprise (much of Science).
- **Story** for ideas that live in people's lives and choices (much of Social Science, and the default).

A chapter may mix flows.

**What the three flows no longer use.** These were in the 2026-11-04 templates and are now dropped for every flow:
- Question cards (Wonder).
- Activity and simulator screens. NCERT activities appear inside the videos.
- The separate Reveal, Stuck and Solve screens.
- Silent wonder clips.
- Mini loops, fact cards and score screens.

A fact box becomes one line of an answer video, or it moves to a later episode. A small concept is folded into a neighbouring topic's answer video.

## Pacing rules (what made E1 v3 feel finished)

- **No dead ends.** A video screen flows into the next screen about a second after it ends (player `auto_advance`, on by default). So step 1 ends exactly on the question the vote asks, never on a trailing pause. Votes and checks wait for the teacher's tap.
- **Every screen speaks.** Title, step 1, the question, each reveal, step 3, the check question, each feedback and the recap all have narration lines.
- **One clip covers 5-13 s of narration** (two short sentences at most). Several clips are joined into one screen video. Leave 1-2 s of footage beyond the narration in the last shot of each clip; EN2 often cuts early and the edit needs the slack.
- **Times.**
  - Step 1 runs 20-50 s.
  - Step 2 runs 20-30 s.
  - Step 3 runs 45-90 s, and for Challenge it includes the 10-20 s solve.
  - Step 4 runs 20-30 s.
  - E1 v3 actuals: 37 s and 48 s stories, 47 s and 55 s answers.
- **Topic titles are headlines.** The player opens each step-1 video on a big topic card. Each concept title in `script.json` `concepts` / `analysis.json` must read well as a 3-9 word headline, e.g. "Plants need both sunlight and water to grow".
- **The recap picture can move.** If the recap still shows a character, animate it (lt-animation, "Recap animation").

## Content rules

- **NCERT activities become labs** (`skills/lt-lab`), placed after the vote. Videos never stage them. A video shows an activity only when a lab cannot, such as a slow change in nature, and then as a time-lapse (a teacher demonstration shows the teacher alone in a medium shot).
- **No set-up scenes.** Cut any scene that exists only to reach a test or a fact, such as first aid on a knee or a kitchen accident before the iodine test (user feedback, 2026-11-06). A Wonder hook is one surprising sight and the question, about 15 s. Verified footage from earlier clips may be reused for it.
- **Keep the chapter's heritage facts.** Fact boxes such as Vrikshayurveda (Science Ch10, p.140) go at the end of the topic's Answer video. Do not move them to "a later episode".
- Vote pictures show the set-up, never the result. Option pictures are 16:9 and match the option text exactly (the player shows them whole). In Maths, a vote can be text-only options (numbers drawn by the player) with the scene in the step 1 video.
- 2-4 options, each 6 words or fewer, with one right option. Every other option is a misconception from `analysis.json`, never a joke. The player labels options A-D, so the narration may say "Hands up for A".
- **Reveal line per option:**
  - Right option: confirm it and say why in one sentence.
  - Wrong option: name the belief kindly, then give the evidence ("Many people think water is enough. But..."). Never say "Wrong!".
  - The right option's reveal line may bridge into step 3 ("Let us see why.").
- **Feedback line per check option**, in the same style.
- **Prediction votes (`predict: true`)** come before a lab. The class picks and the pick is marked, but there is no right or wrong. Every option's reveal line is the same neutral bridge ("Let us test it. Iodine finds starch, a kind of food.").
- **Nothing gives the answer before the reveal:**
  - the bridge line names no part of the answer (not "...test a leaf");
  - a lab's predict step never states the rule it tests (not "where there is starch, iodine turns blue-black");
  - the right option is not always A;
  - the topic heading shows the question until the Answer video (the player does this).
  (User feedback, 2026-11-06.)
- No text, letters or digits in pictures or videos; the player draws them.
- The chapter map is never shown automatically; the teacher opens it from the Menu.
