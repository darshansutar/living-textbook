---
name: lt-episode-plan
description: Plan a Living Textbook chapter - group analysed concepts into class-period episodes, choose the Story / Challenge / Wonder flow (or mini loop / fact card) per concept, design one rural-Indian story world and its non-speaking cast, sort every activity into do-along / simulator / mission, and get the user's approval before any production.
---

# Living Textbook - Episode Plan and Checkpoint

Input: `analysis.json`, `intake.json`. Output: `episodes.json` (template `templates/episodes.example.json`), approved by the user.

## 1. Story world (one per chapter)

One setting and one problem that runs through the whole chapter and can only be solved with its concepts.

- **Place** in the intake region: a real kind of village or small-town setting (chilli nursery near Haveri; fishing village in Kutch; Zilla Parishad school sports day near Satara). Specific crops, food, festivals, tools, weather and building materials of that place.
- **Problem** that runs across episodes: seedlings must be ready for market day; will Abba sail before the storm; who wins sports day.
- **Cast**: 1 main child (Class-appropriate age) + at most 2 supporting people (family, teacher, shopkeeper). Original characters, never NCERT's own; respectful and specific regional dress; no stereotypes. They act, react and point - **they never speak**; the narrator tells the story. A chapter in Wonder flow may need no recurring cast at all.
- The payoff: how the problem is resolved in the finale using all the concepts.

## 2. Flow per concept

| Concept size | Use |
|---|---|
| big | a full loop in one of the three flows |
| small | mini loop (hook still -> explain -> MCQ) |
| fact | "Did you know?" fact card placed between loops |

Choose the flow for each **big** concept:

| Choose | When the concept... | Typical subjects |
|---|---|---|
| **Story** | is best met through a person's situation or decision; little hands-on work | Social Science, history, civics, geography; any chapter's opener |
| **Challenge** | is a tool or method that solves a practical problem; a wrong attempt is natural and safe | Maths, measurement, map/data reading, practical Social |
| **Wonder** | starts from a surprising observable phenomenon and has an NCERT activity that investigates it | Science; experiment-heavy chapters |

Rules: stay in the chapter's story world whatever the flow (a Wonder hook can be something the main child notices); vary the flow when two big concepts sit in one episode if that suits the content; never pick a flow whose key step the concept cannot fill (no Challenge without a real decision; no Wonder without something to observe).

## 3. Episodes

- Keep book order. Group 1-2 big concepts (plus any small concepts and fact cards near them) per episode.
- Target **10-15 min of screen time** per episode (full loop 3-5 min, mini loop 1-2 min, fact 20 s, recap 15 s, cliffhanger 10 s, live do-along time on top). One episode = one 40-minute class period, leaving time for the teacher.
- Episode 1 starts with the **opener** (30-60 s: story world + chapter big question). Every later episode starts with a **recap** (15 s + one recall MCQ on the previous episode). Every episode except the last ends with a **cliffhanger** that points at the next concept.
- The last episode ends with the **finale**: story payoff -> practice activities -> chapter MCQ round (8-10 questions from the end-of-chapter questions, rewritten into rural-Indian scenarios) -> score.

## 4. Activity modes

Sort every activity from the analysis:

| Mode | Rule | Examples |
|---|---|---|
| **do_along** | safe for students, under ~10 min, household or school materials | Betadine on potato and leaf; measure screws with a ruler; wet cloth open vs covered |
| **simulator** | too slow (overnight, weeks), unsafe (flame, alcohol, caustic soda, "demonstration activity", Caution box) or costly; and fits a simulator template | 3 pots over 2 weeks; half-leaf in caustic-soda bottle; barometer reading; ruler zoom |
| **video** | unsafe/slow but no simulator template fits | leaf peel under a microscope; oxygen-test matchstick |
| **mission** | needs days, home or community (family, elders, field, market) | brick on grass for 5 days; ask elders for weather sayings; kirana bill |

Simulator templates available (no others): `compare_setups`, `zoom_scale`, `dial`, `tap_diagram` (lt-activities). Each activity is placed either in its concept loop (Wonder: investigate step) or in the finale (practice).

## 5. Checkpoint (mandatory)

Show the user a short plan, as a table per episode: concepts (with NCERT refs), flow, hook in one line, activities and modes, estimated screen time; plus the story world and cast in three lines. **Stop and wait for approval.** Record `approved_by`, the date and the user's words in `episodes.json.checkpoint`. Nothing in lt-script or later starts before this. Changes after approval invalidate only the affected episodes.
