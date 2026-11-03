---
name: lt-script
description: Turn a Living Textbook source script into script.json - every narration line split into renderable clips, the choice-to-narration mapping for Predict-Observe-Explain lessons, and the list of static images the roleplay needs.
---

# Living Textbook - Script

Read the complete source (intake). Keep its words exactly; do not rewrite narration unless the user asks. Produce `script.json` (see `templates/script.example.json`).

## 1. Narration lines

List every spoken line with a stable ID (`N1`, `N2`, ...), the exact text, where it plays (step, branch or option) and what it must show. One audio file per line. Visible text on screen (option labels, captions) is interface text, not narration.

## 2. Clips

A clip is one EN2 render: a 1x2 or 1x3 storyboard covering one narration line or one part of it. EN2 renders at most 15 s, and every shot carries a 1-2 s buffer, so plan a clip at about 11 s of narration or less. Split longer lines at sentence boundaries (the measured pauses from lt-audio confirm the split). Record for each clip: ID (`C1-stomata`), narration ID, which sentences it covers, and the beats it must show.

## 3. Choice mapping (Predict-Observe-Explain)

For choice-based lessons record, per option, which narration plays. The default Living Textbook mapping:

- Group every answer and reason by the **idea** behind it (soil, water, sunlight, correct, not sure ...).
- Six cases decide what plays: both right; same wrong idea twice (one merged clip); right answer + wrong reason; wrong answer + right reason; two different wrong ideas; not sure.
- Narration is built from short pieces: `SAY_<option>` ("You said ..."), `LOOK_<idea>` ("Look again: ..." pointing at evidence from the Observe film), `RIGHT`, `WHY` (the "but why ...?" bridge), `POINTS_<answer>`, `NEXT`, `NOT_SURE`, then the common explanation.
- Write the playback order for every answer x reason combination.

If the lesson's player plays one opener only, also record the single-clip fallback (one rendered clip per combination).

## 4. Static images

List every still the roleplay shows (lt-static-images makes them):

| Kind | One per | Example source field |
|---|---|---|
| cover | lesson | title / hook |
| answer | answer option | option text |
| reason | reason option | reason text |
| confidence | confidence level | level text |
| check | check question (and its scenario) | question text |
| other | any still the script asks for (diagram card, end card) | as written |

Give each an ID, the exact option text it illustrates and the idea it must show without words.

## 5. Inventory

List the on-screen cast **from the script only** (usually none for science lessons), the locations, and the key props/evidence (experiment set-ups, specimens, diagrams). Never add a character because the style reference is a portrait.

## Check before handing on

Compare script.json with the source line by line: every narration line, option, feedback line and route is present and identical. Record the comparison in script.json `source_check`.
