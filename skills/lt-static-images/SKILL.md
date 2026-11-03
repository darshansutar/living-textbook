---
name: lt-static-images
description: Make the static images a Living Textbook roleplay shows as stills - the cover page and one text-free image per answer, reason, confidence and check option - with Codex in the approved style, and map them in roleplay.json.
---

# Living Textbook - Cover Page and Option Images

The interactive player shows several pictures that are not video: the cover (poster) on the title screen, one picture per answer option, per reason option, per confidence level and per check question. The player overlays the option text, so the pictures carry **no text at all** and must explain each idea visually.

Reference: the Starling monsoon story uses `poster.jpg` (2560 px wide) and `option_A.jpg`, `option_r1.jpg`, `confidence_sure.jpg`, `plateau.jpg` (check) at about 1600 x 900.

## Make them

Write `prompts/codex-static.md` from `templates/codex-static.md`, one entry per item in script.json `static`:

| File | Content |
|---|---|
| `static/cover.png` | Hero image of the lesson's subject in the scene master's world, with calm space in the upper third for the title overlay |
| `static/option_<A..>.png` | The idea of that answer, drawn literally (a wrong idea is drawn as the learner imagines it, not as a correction) |
| `static/option_r<n>.png` | The idea of that reason |
| `static/confidence_<level>.png` | A calm visual of that confidence level, matching the lesson world |
| `static/check_<n>.png` | The check question's scenario |

Rules: colour, 16:9, edge to edge; no text, letters, numbers or labeled arrows; no people unless the script has a cast; the approved style reference (style only) plus the scene master and relevant sheets as refs; one palette across the set. Do not reveal the correct answer: right and wrong options get the same visual weight and polish.

```
python pipeline/codex_run.py --project projects/<slug> --prompt prompts/codex-static.md --ref refs/style.jpg --ref assets/<scene_master>.png --name static
```

## Inspect

Each image shows its own idea without words; none contains text or extra people; the set looks consistent; the correct option is not visually favoured; the cover has room for the title. Regenerate only failures.

## Cover page option in the video

`build_edit.py --cover static/cover.png --cover-seconds 3` opens the stitched video on the cover as a silent still. Leave it out when the player shows the cover itself.

## roleplay.json

`package.py` writes `roleplay.json` from plan.json `static`: for every option its ID, exact text, kind and image path, plus the cover. Use it to load the images into the player (Starling story data: `poster`, `answers[].image`, `reasons[].image`, `sures`, `check.image`).
