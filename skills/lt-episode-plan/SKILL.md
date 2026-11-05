---
name: lt-episode-plan
description: Plan a Living Textbook chapter - group analysed concepts into class-period episodes, plan one simple topic loop (story video, vote, answer video, check) per big concept, design one rural-Indian story world and its non-speaking cast, place every NCERT activity inside a loop's video, and get the user's approval before any production.
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

Every big concept becomes one **topic loop** (`skills/lt-script/flows.md`): story video -> vote -> answer video -> check. A small concept is folded into the nearest loop's answer video. NCERT fact boxes become one narrated line in an answer video or a recap.

## 3. Episodes

- Keep book order. Group 1-2 big concepts (plus any small concepts and fact cards near them) per episode.
- Target **10-15 min of screen time** per episode (full loop 3-5 min, mini loop 1-2 min, fact 20 s, recap 15 s, cliffhanger 10 s, live do-along time on top). One episode = one 40-minute class period, leaving time for the teacher.
- Episode 1 starts with the **opener** (30-60 s: story world + chapter big question). Every later episode starts with a **recap** (15 s + one recall MCQ on the previous episode). Every episode except the last ends with a **cliffhanger** that points at the next concept.
- The last episode ends with the **finale**: story payoff -> practice activities -> chapter MCQ round (8-10 questions from the end-of-chapter questions, rewritten into rural-Indian scenarios) -> score.

## 4. Activities

Every NCERT activity is shown inside a video of its loop: a teacher demonstration (teacher alone, medium shot) for anything unsafe or teacher-only, a time-lapse for slow experiments, or the story child doing it when it is safe. The teacher may also run a safe activity live in class; that is noted in the episode plan, not built as a screen.

## 5. Checkpoint (mandatory)

Show the user a short plan, as a table per episode: concepts (with NCERT refs), flow, hook in one line, activities and modes, estimated screen time; plus the story world and cast in three lines. **Stop and wait for approval.** Record `approved_by`, the date and the user's words in `episodes.json.checkpoint`. Nothing in lt-script or later starts before this. Changes after approval invalidate only the affected episodes.
