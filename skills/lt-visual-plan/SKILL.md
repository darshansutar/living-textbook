---
name: lt-visual-plan
description: Build the Living Textbook timing table (plan.json) following the Starling prompt-pack, director and cinematography skills - every video screen split into EN2 clips, each a fixed-format 1-3 shot narration storyboard with measured required intervals, buffered generated ranges, camera, one defining action, exact visible inventory and player overlays.
---

# Living Textbook - Visual Plan

Follow these Starling skills:
- `starling/starling-prompt-pack`;
- `starling/starling-director`;
- `starling/starling-cinematography` (with `references/spatial-fidelity.md`);
- `starling/starling-animation-pack/references/narration-pairs.md`.

The Living Textbook differences are in `starling/README.md`.

- **Input:** `script.json`, `audio/narration.json` (accepted and measured), and `episodes.json` (story world and cast).
- **Output:** `plan.json`, the one timing table behind the board captions, image requests, animation prompts, render lengths and the edit.

## Clips

- Only `video` screens become EN2 clips. `title`, `vote`, `mcq` and `still` screens use stills (lt-stills).
- A video screen is one or more clips played back to back as one screen file. Every clip records `screen`, `narration` (the narration.json key) and `audio_interval`.
- A clip carries one narration file of at most about 12 s. To give two short consecutive lines of the same screen one clip, join them first: `python pipeline/join_narration.py --project projects/<slug> --group a,b`.
- **The shot count follows the narration** (Starling rule B1): under 4 s gives one shot, 4-8 s two, 8-15 s three. Every shot covers at least 2 s of narration, and splits fall on line joins or measured pauses.
- `render_seconds` is 4-15 s, within the range for the board's shot count.

Each shot records:

| Field | Content |
|---|---|
| `required` | its narration interval, on the narration clock |
| `generated` | whole seconds, including a 1-2 s buffer |
| `action`, `hold` | the action and settle ranges |
| `camera` | one move or static; quiet shots get a 3-5 % push-in |
| `action_text` | one defining action, short enough for one caption line |
| description | the full shot description |
| `characters`, `props` | who and what is visible |
| `people` | cast, hands or none |

## Staging rules (Director, Cinematography)

- **Board order:** establish, then develop, then resolve. Each shot has one distinct defining action that is possible from the pictured pose.
- **Classify each action** as stable acting, simple movement or complex interaction, and use the simplest staging that tells the beat. Show a complex interaction (handoffs, lifting and carrying, objects changing owner) by its preparation or its result unless it is essential.
- **No character talks.** Everyone has a silent action. Close shots of people are side, back or over-the-shoulder views, or show only hands and objects. Classroom demonstrations show the teacher alone.
- **One clean scene master per location** fixes the camera side, layout and light. Objects keep their size and state across shots.
- **No text, digits or labels in pictures.** On-screen numbers and labels are `overlays[]` on the shot (text, at/until on the narration clock, anchor, style). Plan a calm, empty area where each overlay sits.
