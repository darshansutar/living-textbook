---
name: lt-images
description: Make Living Textbook visual assets and storyboards with Codex native images - scene masters, prop and macro sheets, black-and-white storyboard panels - then assemble the labelled boards in code and inspect them.
---

# Living Textbook - Assets and Storyboards

All pictures are made by **Codex native image generation** through `pipeline/codex_run.py`. Attach the style reference first on every call. Never generate animation or diagrams in code.

## 1. Assets (colour)

Write `prompts/codex-assets.md` (template `templates/codex-assets.md`). Make only what the plan's visible inventories need:

- **Scene master** per location: full-frame, no people (unless the script has a cast), fixed layout described left to right, lighting direction.
- **Prop / apparatus sheets** for experiment set-ups.
- **Macro / cutaway / cross-section sheets** for science inserts, with the particle designs fixed.
- **Character sheets** only for script characters (front, three-quarter, side; lips closed).

Prompt rules: the style reference is style only ("do not draw this person"); 16:9; no text, labels or watermarks; one palette and light direction across all assets. Codex copies each PNG from `~/.codex/generated_images/` to the exact project path.

```
python pipeline/codex_run.py --project projects/<slug> --prompt prompts/codex-assets.md --ref refs/style.jpg --name assets
```

**Inspect every asset** before continuing: style match, no invented people, layout as described, particle designs, no text. Regenerate only what fails.

## 2. Storyboard panels (black and white)

Write `prompts/codex-panels.md` (template `templates/codex-panels.md`): one panel per shot, saved as `storyboards/panels/<CLIP>_P<n>.png` where `<CLIP>` is the clip id before the first dash. Attach the style reference, then the assets each panel uses (scene master, sheets).

Panel rules: black, white and grayscale only; 16:9 edge to edge; no text, arrows or motion marks; exact visible inventory from plan.json; the scene master's layout and light; physical actions that make sense (supports, contacts, directions).

## 3. Assemble the boards (labels in code)

```
python pipeline/assemble_boards.py --project projects/<slug>
```

Stacks the panels top to bottom (Shot 1 on top), forces grayscale and 16:9, and prints a white strip under each picture: `SHOT n   g0-g1 s (action a0-a1 s, hold h0-h1 s)`, `CAMERA: ...`, `ACTION: ...` - all from plan.json. Writes `storyboards/boards.json` with hashes and picture boxes.

## 4. Inspect the boards

For each board check: one distinct beat per panel; layout identical to the scene master; inventory exactly as planned (no extra people or objects); physical logic; captions match plan.json. A failed panel is regenerated as a new version; move the rejected file to `storyboards/panels/rejected/` and rebuild only that board. Record the inspection in plan.json `board_review`.
