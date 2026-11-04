---
name: lt-visual-plan
description: Build the Living Textbook timing table (plan.json) - every video screen of the episode split into EN2 clips, each a 1x2 or 1x3 storyboard with measured required intervals, buffered generated ranges, camera, action, exact visible inventory and player overlays - for story, explanation, silent wonder and activity shots across Science, Social Science and Maths.
---

# Living Textbook - Visual Plan

Input: `script.json` (approved episode), `audio/narration.json` (accepted), `episodes.json` (story world, cast), intake style. Output: `plan.json` (see `templates/plan.example.json`). This one table drives board captions, animation prompts, render length and the edit.

## Which screens need video

Only `video` screens (roles opener, hook, wonder, explain, solve, investigate, consequence, cliffhanger, payoff) become EN2 clips. `still`, `vote`, `reveal`, `mcq`, `fact`, `recap`, `question_cards`, `activity` and `title` screens use stills (lt-stills).

A video screen becomes **one or more clips** played back to back as one screen file (lt-assembly). Record `screen` on every clip, and `narration` (the narration.json key, e.g. `e1_c2_s5_n1`) with its `audio_interval` on every narrated clip; silent wonder clips have no `narration`. A consequence clip for a vote option is the video screen `<vote-id>.opt<k>`.

## Clip and shot rules (Starling storyboard method)

- Every clip is a labelled black-and-white **1x2 or 1x3** storyboard; choose 2 or 3 shots by meaning: each shot carries a distinct beat.
- Narrated clips: each shot gets the narration interval it covers (`required`, measured cues) plus a **1-2 s buffer**; whole-second `generated`, `action`, `hold` ranges; `cut_times` = generated starts of shots 2..n. Plan about 11 s of narration per clip or less.
- **Silent wonder clips** have no narration: choose the length (10-15 s) and give each shot a required interval long enough to look (>= 4 s).
- `render_seconds` = end of the last generated range, 4-15 s.
- `camera`: one move with direction, extent and speed. `action_text`: start state, visible motion, settled state.
- `visible`: exact inventory per shot.

## Shot types

| Type | Use | Subjects |
|---|---|---|
| Establishing | the story-world place (nursery, harbour, school ground) | all |
| Character action | the main child doing, noticing, reacting (no speaking, mouth closed or neutral) | all |
| Experiment / activity close-up | NCERT set-up doing its thing; layout from the book's figure | Science, Social (instruments) |
| Macro / cutaway / cross-section | small or hidden structures (stomata, xylem, inside soil) | Science |
| Process close-up | particles or quantities changing (CO2 + water -> glucose) | Science |
| Instrument / measurement | gauge, ruler, tape, stopwatch, barometer close-up; **reading drawn by overlay** | Social, Maths |
| Map / landscape | region, coast, monsoon winds - plain, label-free | Social |
| Diagram build | a clean label-free diagram whose parts appear in order (place-value columns, plant transport paths) | Maths, Science |
| Wide return | back to the set after an insert | all |

Keep recurring designs identical across shots (CO2 = dark sphere between two red spheres; water = blue drop; glucose = white hexagon; the same ruler and tape design).

## Overlays (exact text and numbers)

Generated pictures contain **no text, digits or labels**. Where the narration needs them on screen (3.45 m, 996 mb, CO2 + water -> glucose + oxygen, labels on a diagram), add `overlays[]` to the shot: `text`, `at` and `until` (seconds on the same clock as the shot's `required` interval: the narration file's time for narrated clips, clip time for silent clips - build_chapter.py converts them to screen time), `anchor` (top / bottom / left / right / centre or x,y %), `style` (number, label, equation). Plan an empty, calm area in the shot where the overlay goes and describe it in the shot (e.g. "the tape's reading window is blank and centred").

## Cast and continuity

- Characters only from `episodes.json`, drawn from their approved character sheets. They never speak: describe gestures, gaze, reactions; mouths closed or neutral.
- One approved scene master per location fixes camera side, layout (left/right of every object) and light direction; every later shot keeps it. Record layouts in `plan.json.locations`.
- Regional accuracy: clothing, houses, crops, tools, vehicles and weather of the chosen region.

## Hand-off check

Every video screen is covered; narrated required intervals tile each line with no gaps; generated ranges are whole seconds; 2-3 shots per clip; renders 4-15 s; inventories contain only planned subjects; every on-screen number or label is an overlay, never a picture detail.
