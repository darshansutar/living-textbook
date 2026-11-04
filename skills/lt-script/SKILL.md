---
name: lt-script
description: Write the Living Textbook script - every screen of every episode following the approved flow templates, every narration line, vote options built from misconceptions with reveal lines, MCQs with feedback, recaps, cliffhangers and fact cards - into script.json, checked against the NCERT chapter.
---

# Living Textbook - Script

Input: approved `episodes.json`, `analysis.json`, the chapter text. Output: `script.json` (template `templates/script.example.json`). Follow `flows.md` (same folder) exactly for screen order.

## Voice of the narration

- Spoken to a whole Class 5-10 room by a warm teacher-narrator. Short sentences (<= 18 words), present tense, plain words; every new term said once, then defined the book's way.
- Indian English that translates cleanly: no idioms, puns or rhymes that only work in English; numbers said the way they are written on screen ("three point four five").
- The story is told about the characters ("Ravi lifts the stone..."), never in their voice. No dialogue, no quotes from characters.
- Facts, definitions, equations and units exactly as the chapter states them. Indian names for local things where natural (gud, shandy, kolhu), explained on first use.

## 1. Screens

For every episode, list its screens in order. Each screen gets: `id` (`e1.c2.s3`: episode, concept, screen), `type`, `role` (for video), and its content:

| Type | Script must give |
|---|---|
| `title` | title text, subtitle |
| `video` | role, narration line IDs (none for `wonder`), what must be shown (beats), story state before/after |
| `still` | narration line ID, what the picture shows |
| `vote` | question text, options (`text`, `idea`, `correct`), reveal line ID per option, optional `consequence` video beats |
| `reveal` | (built from its vote) |
| `question_cards` | prompt line ID, 3 cards (text <= 8 words), which card the explanation answers (all lead to the same explain) |
| `mcq` | question text, scenario (what the picture shows, if any), options, answer, feedback line ID per option |
| `activity` | activity ID from episodes.json (lt-activities fills the details) |
| `fact` | narration line ID, picture idea, NCERT ref |
| `recap` | narration line ID + one recall `mcq` |
| `score` | end line ID |

On-screen text (titles, questions, options, card text, overlays) lives in the screen as strings; **it is never in a picture**. Numbers, equations and labels a video needs are listed as `overlays` with the time they appear (lt-assembly / player draws them).

## 2. Narration lines

One list `narration[]`, one line per audio file: `id` (screen id + suffix, e.g. `e1.c2.s1.n1`), exact text, screen, and `purpose` (story, explain, reveal-A, feedback-2, recap...). Split long explanations into several lines at sentence boundaries; a video clip covers about 11 s of narration or less (lt-visual-plan joins clips into one screen video).

## 3. Questions

- Every vote and MCQ distractor comes from the concept's `misconceptions` (cite it). One correct answer.
- Finale MCQs come from the chapter's end questions, rewritten into the story world or another rural-Indian setting, keeping what the book asks. Record the source question.
- Feedback lines are short (one or two sentences), kind, and explain why.

## 4. Fidelity check

Before hand-off, compare against `analysis.json`: every concept has its screens; every key fact appears in an explain narration; every activity is placed; every end question is used or listed in teacher notes; no fact contradicts or exceeds the chapter. Record the result in `script.json.source_check`. Then show the user the script of the episode being produced (narration + questions) and get a yes before lt-audio.
