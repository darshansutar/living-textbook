---
name: lt-stills
description: Make every still image the Living Textbook player shows - chapter cover, episode title cards, vote and question cards, MCQ scenario pictures, still screens (stuck, recap, cliffhanger, mini-loop hooks), fact cards, activity step and result pictures, simulator states, mission cards and chapter-map icons - text-free, with Codex in the approved style.
---

# Living Textbook - Stills

## Starling skills (adopted 2026-11-05)

Review every still with `starling/starling-panel-corrector`: identity, anatomy, hands, props, scale, contact and the exact visible inventory the screen needs. A vote or quiz picture shows exactly what its option or question says and nothing that gives the answer away. Pictures are 16:9 so the player shows them whole.

The player shows many screens that are not video. Their pictures are made here; the player overlays all text, so **no still contains text, letters, digits or labels**.

## What to make (from script.json, one episode at a time)

| File | For | Content |
|---|---|---|
| `stills/cover.png` | chapter title screen | hero image of the story world; calm upper third for the title |
| `stills/<ep>_title.png` | episode title card | the episode's key moment, calm area for the title |
| `stills/<screen>_opt<k>.png` | vote options | the idea of each option drawn the way a student imagines it; right and wrong options get equal care and weight |
| `stills/<screen>_card<k>.png` | question cards | small icon-like picture of each question's subject |
| `stills/<screen>.png` | still screens (stuck, recap, cliffhanger, mini-loop hook, reveal backdrop) | the moment in the story world |
| `stills/<screen>_scene.png` | MCQ scenario | the new situation the question asks about |
| `stills/<screen>_opt<k>.png` | MCQ options (only where pictures help) | as vote options |
| `stills/<screen>_fact.png` | fact cards | the scientist, place, object or text tradition, respectfully drawn (no photo-likeness claims) |
| `stills/<activity>_step<k>.png`, `_result.png` | do-along | each step's hands-and-materials view; the expected result |
| `stills/<activity>_<setup>_<state>.png` | simulators | one picture per set-up per outcome state; blank dials and scales |
| `stills/<activity>_mission.png` | missions | the task in the story world |
| `stills/map_<concept>.png` | chapter map | a simple round icon for each concept |

Reuse a frame from an approved render instead of a new still when it shows exactly the moment needed (`ffmpeg -ss <t> -frames:v 1`); record the source clip and time.

## Make them

Write `prompts/codex-stills-<ep>.md` from `templates/codex-stills.md`. Attach the style reference (style only), the relevant character sheets, the scene master and sheets. Rules: colour, 16:9 (icons 1:1), edge to edge; no text, letters, digits or labels; characters on-model with closed mouths; one palette; correct answers never visually favoured.

```
python pipeline/codex_run.py --project projects/<slug> --prompt prompts/codex-stills-e1.md --ref refs/style.jpg --ref assets/<scene_master>.png --name stills-e1
```

## Inspect

Each still shows its idea without words; no text or digits; characters consistent; regional details right; set consistent; overlay areas clear; the right option not favoured. Regenerate only failures and record the inspection in `plan.json.stills_review`.
