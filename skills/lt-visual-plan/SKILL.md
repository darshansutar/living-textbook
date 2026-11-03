---
name: lt-visual-plan
description: Build the Living Textbook timing table (plan.json) - every narration clip as a 1x2 or 1x3 storyboard with measured required intervals, buffered generated ranges, camera, action and an exact visible inventory, using science-friendly shot types.
---

# Living Textbook - Visual Plan

Input: script.json, audio/narration.json (accepted), intake style description. Output: `plan.json` (see `templates/plan.example.json`). This one table drives the board captions, the animation prompt, the render duration and the edit.

## Clip and shot rules (Starling storyboard method)

- Every narration clip is a labelled black-and-white **1x2 or 1x3** storyboard. A single full-frame narration scene is invalid. Choose 2 or 3 shots by meaning, not by length: each shot carries a distinct beat of the line.
- Each shot gets the narration interval it covers (`required`, in the narration file's clock, from measured cues) and a **1-2 s buffer**. Whole-second generated ranges: `generated`, `action`, `hold`. `cut_times` = the generated starts of shots 2..n.
- `render_seconds` = end of the last generated range. EN2 renders 4-15 s; split the clip at a measured pause if it would exceed 15 s.
- `camera`: one move with direction, extent and speed (slow push-in about 5 %, slow tilt up, static close-up, slow pull-back). `action_text`: the start state, the visible motion and the settled state, in one sentence.
- `visible`: the exact inventory for that shot. An empty insert stays empty.

## Science shot types

| Type | Use for | Notes |
|---|---|---|
| Establishing / environment | the place the lesson happens (windowsill, field, lab bench) | from the scene master; no people unless the script has them |
| Experiment close-up | apparatus doing the thing (bubbles rising, a reading changing) | apparatus layout must match the scene master exactly |
| Macro insert | surfaces and small structures (leaf underside, stomata) | from a macro prop sheet |
| Cutaway | inside an object (stem, soil, pipe) | plain background, centred subject |
| Cross-section / cell view | inside tissue, cells, layers | keep the molecule/particle designs from the sheet |
| Process close-up | particles moving and changing (CO2 + water -> sugar) | state what enters, what leaves, what appears |
| Wide return | back to the set after an insert | same scene master, same layout |

Keep molecule and particle designs identical across shots (e.g. CO2 = dark sphere between two red spheres; water = blue drop; sugar = white hexagon).

## Cast

Characters only if script.json lists them. No people for a cast-free script - plan nature, apparatus and macro shots instead. A style reference never adds a character.

## Continuity

One approved scene master per location fixes the camera side, layout (left/right of every object), furniture and lighting direction. Every later shot of that location keeps it. Record the layout in plan.json `locations`.

## Hand-off check

Every narration line is covered; required intervals tile each clip's audio interval with no gaps; every generated range is whole seconds; shot counts are 2 or 3; renders are 4-15 s; visible inventories contain only script-supported subjects.
