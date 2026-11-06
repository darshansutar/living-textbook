---
name: lt-script
description: Write the Living Textbook script in the four-screen topic loop and each topic's flow (Story, Challenge or Wonder) - title, then per topic hook video -> vote -> explain video -> check, then a narrated recap - every narration line, vote options built from misconceptions with reveal lines, checks with feedback - into script.json, checked against the NCERT chapter.
---

# Living Textbook - Script

Input: approved `episodes.json`, `analysis.json`, the chapter text. Output: `script.json` (template `templates/script.example.json`). Follow `flows.md` (same folder) exactly for screen order and pacing; `skills/lt-player-design/SKILL.md` shows how each screen will look.

## Voice of the narration

- Spoken to a whole Class 5-10 room by a warm teacher-narrator. Short sentences (<= 18 words), present tense, plain words; every new term said once, then defined the book's way.
- Indian English that translates cleanly: no idioms, puns or rhymes that only work in English; numbers said the way they are written on screen ("three point four five").
- The story is told about the characters ("Ravi lifts the stone..."), never in their voice. No dialogue, no quotes from characters.
- Facts, definitions, equations and units exactly as the chapter states them. Indian names for local things where natural (gud, shandy, kolhu), explained on first use.

## 1. Screens

For every episode, list its screens in order. Each screen gets: `id` (`e1.c2.s3`: episode, concept, screen), `type`, `role` (for video), and its content:

| Type | Script must give |
|---|---|
| `title` | title text, subtitle, welcome narration line ID, the picture (the episode's world, calm space at lower left for the title) |
| `video` | `concept`, role (`hook` or `explain`), narration line IDs, what must be shown (beats); a hook ends on the vote's question |
| `vote` | `concept`, question text, `prompt_line` (the question read aloud), 3-4 options (`text`, `idea`, `correct`, `image`), reveal line ID per option |
| `mcq` | `concept`, question text, `question_line` (read aloud), scenario (what the one picture shows), options, answer, feedback line ID per option |
| `still` | role `cliffhanger` for the recap, narration line IDs, what the picture shows (recap + next time); say whether it should be animated |

Screen ids for the loop: `e1.title`, then per topic `e1.c1.story`, `e1.c1.vote`, `e1.c1.explain`, `e1.c1.check`, and finally `e1.recap`. The ids are the same in every flow. What each screen does follows the topic's `flow` from `episodes.json` (`flows.md`: Story / Challenge / Wonder); add `flow` to a screen only to override the plan.

On-screen text (titles, questions, options, card text, overlays) lives in the screen as strings; **it is never in a picture**. Numbers, equations and labels a video needs are listed as `overlays` with the time they appear (lt-assembly / player draws them).

Checklist per episode, before writing narration: one title; per topic exactly story -> vote -> explain -> check; one recap; every screen has narration; every topic's concept title reads as a 3-9 word headline (the player shows it big at the start of the story).

## 2. Narration lines

One list `narration[]`, one line per audio file: `id` (screen id + suffix, e.g. `e1.c2.s1.n1`), exact text, screen, and `purpose` (story, explain, reveal-A, feedback-2, recap...). Split long explanations into several lines at sentence boundaries; a video clip covers 5-13 s of narration (lt-visual-plan joins clips into one screen video). A story's last line is the question the vote asks; nothing trails after it, because the player moves on by itself when the video ends.

## 3. Questions

- Every vote and MCQ distractor comes from the concept's `misconceptions` (cite it). One correct answer.
- Finale MCQs come from the chapter's end questions, rewritten into the story world or another rural-Indian setting, keeping what the book asks. Record the source question.
- Feedback lines are short (one or two sentences), kind, and explain why.

## 4. Fidelity check

Before hand-off, compare against `analysis.json`: every concept has its screens; every key fact appears in an explain narration; every activity is placed; every end question is used or listed in teacher notes; no fact contradicts or exceeds the chapter. Record the result in `script.json.source_check`. Then show the user the script of the episode being produced (narration + questions) and get a yes before lt-audio.
