---
name: lt-images
description: Make Living Textbook visual assets and storyboards with Codex native images - character sheets for the approved non-speaking cast, regional scene masters, prop / instrument / macro / diagram sheets, black-and-white storyboard panels - then assemble the labelled boards in code and inspect them.
---

# Living Textbook - Assets and Storyboards

All pictures are made by **Codex native image generation** through `pipeline/codex_run.py`. Attach the style reference first on every call. Never generate animation or diagrams in code.

## 1. Assets (colour), once per chapter, extended per episode

Write `prompts/codex-assets.md` (template `templates/codex-assets.md`). Make only what `plan.json` inventories need:

- **Character sheets** for each cast member in `episodes.json`: front, three-quarter, side and back; full body; regional everyday clothing; neutral closed mouth; one consistent face, hair and outfit. Original characters in the house style - never the style reference's person and never NCERT's characters.
- **Scene master** per location: full-frame, fixed layout described left to right, light direction, regional detail (house type, crops, trees, sky, season).
- **Prop / instrument sheets**: experiment set-ups following the NCERT figure layout; instruments (barometer, rain gauge, ruler, tape, stopwatch) with **blank** dials and scales.
- **Macro / cutaway / cross-section / diagram sheets** with recurring designs fixed (particles, arrows-free flow paths, empty place-value columns).

Prompt rules: style reference is style only ("do not draw this person"); 16:9; **no text, letters, digits, labels or watermarks**; one palette and light direction across the chapter. Codex copies each PNG from `~/.codex/generated_images/` to the exact project path.

```
python pipeline/codex_run.py --project projects/<slug> --prompt prompts/codex-assets.md --ref refs/style.jpg --name assets
```

**Inspect every asset**: style match; character identity consistent across views; regional accuracy and respectful depiction; layout as described; no text or digits; no extra people. Regenerate only what fails.

## 2. Storyboard panels (black and white)

Write `prompts/codex-panels.md` (template `templates/codex-panels.md`): one panel per shot, saved as `storyboards/panels/<CLIP>_P<n>.png`. Attach the style reference, then the character sheets and assets each panel uses.

Panel rules: black, white and grayscale only; 16:9 edge to edge; no text, arrows or motion marks; exact visible inventory from plan.json; scene master layout and light; characters matching their sheets, mouths closed; physically sensible actions; the blank calm area where an overlay will sit.

## 3. Assemble the boards (labels in code)

```
python pipeline/assemble_boards.py --project projects/<slug>
```

Stacks panels (Shot 1 on top), forces grayscale and 16:9, prints `SHOT n  g0-g1 s (action, hold)`, `CAMERA:`, `ACTION:` strips from plan.json, and writes `storyboards/boards.json`.

## 4. Inspect the boards

One distinct beat per panel; layout as the scene master; inventory exact; characters on-model; physical logic; captions match plan.json. Regenerate a failed panel as a new version, move the old one to `storyboards/panels/rejected/`, rebuild only that board. Record the inspection in `plan.json.board_review`.
