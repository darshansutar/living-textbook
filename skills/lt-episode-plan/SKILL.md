---
name: lt-episode-plan
description: Plan a Living Textbook chapter - group analysed concepts into class-period episodes, plan one four-screen topic loop per big concept in its flow (Story, Challenge or Wonder), design one rural-Indian story world and its non-speaking cast, place every NCERT activity inside a loop's video, and get the user's approval before any production.
---

# Living Textbook - Episode Plan and Checkpoint

Input: `analysis.json`, `intake.json`. Output: `episodes.json` (template `templates/episodes.example.json`), approved by the user.

## 1. Story world (one per chapter)

One setting and one problem that runs through the whole chapter and can only be solved with its concepts.

- **Place** in the intake region: a real kind of village or small-town setting (chilli nursery near Haveri; fishing village in Kutch; Zilla Parishad school sports day near Satara). Specific crops, food, festivals, tools, weather and building materials of that place.
- **Problem** that runs across episodes: seedlings must be ready for market day; will Abba sail before the storm; who wins sports day.
- **Cast**: 1 main child (Class-appropriate age) + at most 2 supporting people (family, teacher, shopkeeper). Original characters, never NCERT's own; respectful and specific regional dress; no stereotypes. They act, react and point - **they never speak**; the narrator tells the story.
- The payoff: how the problem is resolved in the finale using all the concepts.

## 2. Flow per concept

Every big concept becomes one **topic loop** of four screens (`skills/lt-script/flows.md`): hook video -> vote -> explain video -> check. Give each loop a `flow` in `episodes.json` (`loops[].flow`):

- **`challenge`** for skills and procedures (most Maths). The hook is a job the child must do now; the explain video teaches the tool and then solves the job.
- **`wonder`** for phenomena with a visible surprise (much of Science). The hook is a narrated surprising sight; the explain video shows the NCERT activity as the investigation.
- **`story`** for ideas that live in people's lives and choices (much of Social Science, and the default). The hook is a character's moment that ends on the question.

The flow changes what the screens do and what the player calls the steps; the screens stay the same. A small concept is folded into the nearest loop's explain video. NCERT fact boxes become one narrated line in an explain video or a recap.

## 3. Episodes

- Keep book order. Group 1-2 big concepts (plus any small concepts folded into them) per episode.
- Target **4-8 min of screen time** per episode (one loop is about 2-3 min; the title is 10 s; the recap is 20 s). Classroom voting and discussion fill the rest of a 40-minute period.
- Every episode is: **episode title** (narrated welcome; in Episode 1 it also sets up the story world and the chapter's big question, and later episodes recall last time in a line) -> 1-2 loops -> **recap + next time** (a narrated still or animated still that ends on the open question for the next episode).
- The last episode's recap is the story payoff. The end-of-chapter questions become the loops' checks (rewritten into rural-Indian scenarios); any not used are listed in teacher notes. There are no MCQ rounds or score screens.

## 4. Activities

Every NCERT activity becomes a **lab** (`skills/lt-lab`): the class does it on the projector, between the vote and the explain video. Name the lab in the loop (`loops[].lab`: the activity, its id, who guides it). The hook video no longer stages the activity: no set-up scenes (first aid, kitchen accidents) that only exist to reach a test. Use a video only for what a lab cannot show (a real place, a long time-lapse in nature). In Maths, the tool the topic teaches is the lab. The teacher may also run a safe activity live in class; note it in the plan.

## 5. Checkpoint (mandatory)

Show the user a short plan, as a table per episode: concepts (with NCERT refs), flow (story / challenge / wonder), hook in one line, activities and how each is shown, estimated screen time; plus the story world and cast in three lines. **Stop and wait for approval.** Record `approved_by`, the date and the user's words in `episodes.json.checkpoint`. Nothing in lt-script or later starts before this. Changes after approval invalidate only the affected episodes.
