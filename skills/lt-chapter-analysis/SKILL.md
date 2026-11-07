---
name: lt-chapter-analysis
description: Analyse an NCERT chapter for Living Textbook - list every concept in book order with its NCERT section, size it (big / small / fact), and attach its activities, in-text questions, figures, fact boxes, end-of-chapter questions and the misconceptions students hold - producing analysis.json.
---

# Living Textbook - Chapter Analysis

Input: `source/chapter.txt`, `source/pages/`, `source/outline.json` (lt-intake). Output: `analysis.json` (template `templates/analysis.example.json`).

Read the **whole chapter text and look at every page picture**. `outline.json` is only a finder; Social Science headings are often unnumbered and box headings can be missed.

## 1. Chapter anatomy

New NCERT books share one structure. Find each part:

| Part | Science (Curiosity) | Social (Exploring Society) | Maths (Ganita Prakash) |
|---|---|---|---|
| Opening hook / big question | intro questions, children's speech bubbles | "The Big Questions", opening scene | opening story (e.g. Sonu and the screws) |
| Concepts | numbered sections 10.1, 10.2.1 ... | unnumbered headings | numbered sections 3.1, 3.2 ... |
| In-text prompts | questions in the text, speech bubbles | THINK ABOUT IT, LET'S EXPLORE | Math Talk, Try This |
| Activities | Activity n.n (some "demonstration activity", Caution boxes) | LET'S EXPLORE tasks (make, ask, map) | measuring, Figure it Out |
| Fact boxes | FASCINATING FACTS, KNOW A SCIENTIST | DON'T MISS OUT | history / Indian notes in the text |
| Summary | In a Nutshell | Before we move on | (often none) |
| End questions | Let Us Enhance Our Learning | Questions and activities | Figure it Out blocks |

## 2. Concepts

One concept = one idea a student must understand, usually one (sub)section. Merge sections that teach one idea; split a section that teaches two. For each concept record:

- `id` (`c1`...), `title`, `ncert_ref` (section and pages), a one-sentence `idea` in the book's own terms
- `key_facts`: the facts, terms, units, formulas or equations the chapter states (exact wording for definitions)
- `size`:
  - **big** - core idea with its own evidence or method (photosynthesis needs CO2; comparing decimals; air pressure) -> full loop, 3-5 min
  - **small** - supporting idea, a definition or unit (what weather is; mm-cm conversion) -> mini loop, 1-2 min
  - **fact** - a box with no new skill (Know a Scientist, IKS note, IMD motto) -> teacher note (not narrated; no fact cards since 2026-11-07)
- `activities`, `prompts`, `figures`, `end_questions`: IDs of the items below that belong to it
- `misconceptions`: 2-4 beliefs students commonly hold about this idea, each with why it is tempting (e.g. "3.45 > 3.5 because 45 > 5"; "plants take food from soil"; "below 1000 mb is normal"). Use the book's own wrong ideas first (children's speech bubbles), then well-known ones for the topic. These become every vote and MCQ distractor.
- `prior_knowledge`: what the book says students know from earlier grades
- `local_hooks`: 2-3 ideas for real rural-Indian situations that show the concept (seen by a village child in the chosen region)

## 3. Activities

For every activity or hands-on task: `id` (book number or `a1`...), title, concept, the steps and materials **as the book gives them**, duration (minutes / overnight / days / weeks), safety (book Caution, "demonstration activity", flames, chemicals, sharp tools), expected observation, and a household or village substitute for lab material when one is safe (Betadine for iodine solution, plastic bottle rain gauge, ruler for scale).

## 4. Questions

- In-text prompts (with page) - candidates for votes and question cards.
- End-of-chapter questions, each mapped to its concept(s), with type (MCQ-able, short answer, design-an-experiment, discussion, data reading). Most become finale MCQs; discussion questions go to the teacher notes.

## 5. Visual inventory

Figures, set-ups, maps, tables and diagrams the chapter relies on, with page numbers - lt-visual-plan reuses their layouts (e.g. pots A/B/C, rain gauge parts, place-value chart).

## Check

Every section, activity, box and end question of the chapter appears in `analysis.json` exactly once (or is marked `skipped` with a reason). Record the count check in `analysis.json.coverage`.
