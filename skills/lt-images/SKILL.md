---
name: lt-images
description: Make Living Textbook visual assets and narration storyboards with Codex native images following the Starling image-pack-generator and panel-corrector skills - character sheets for the approved non-speaking cast, clean scene masters, prop sheets, one colour picture per shot - then compose the fixed-format boards with starling/pipeline/storyboard.py and inspect everything.
---

# Living Textbook - Assets and Storyboards

Follow `starling/starling-image-pack-generator` for generation order, requests and collection, and `starling/starling-panel-corrector` for inspection and exact repairs. Use `starling/starling-animation-pack/references/narration-pairs.md` for the board format. The Living Textbook differences are in `starling/README.md`.

All pictures are made by **Codex native image generation** through `pipeline/codex_run.py`. Reference files are attached with `--ref`. Codex copies each PNG from `~/.codex/generated_images/` to the exact project path. Attach the style reference first on every call; it supplies rendering style only, never its people. Never draw pictures or diagrams in code.

## 1. Assets, in dependency order

1. **Character sheets** for each cast member in `episodes.json`: front, three-quarter, side and back; full body; closed mouth; regional clothing. Characters are original, never the style reference's or NCERT's.
2. **Clean scene masters**, one per location. A scene master is also an EN2 reference, and EN2 copies every object it sees. So it shows **only the fixed set**: walls, floor, furniture, landscape and light. It has no loose props (baskets, cans, pots, plates, bottles or apparatus).
3. **Prop sheets**, only for objects the shots show: experiment set-ups following the NCERT figure, instruments with blank dials, and states such as a blue-black potato.

Rules: 16:9; **no text, letters, digits or labels**; one palette and one light direction per chapter. Inspect every asset before anything depends on it.

## 2. One picture per shot (colour)

For every shot in `plan.json`, write a request in `visuals/image-requests.json` with:
- the request ID `<clip>_S<n>`;
- the prompt;
- the ordered references: style, visible characters, clean scene master, visible props.

Each picture follows these rules:
- **Size:** 1536x1024, full colour, with **no text, captions, borders or arrows**.
- **People:** the exact person count is stated (zero for inserts). Every person is silent and doing a silent action, and nobody faces another in a conversation pose.
- **Objects:** objects keep their real size and either rest on a surface or are firmly held.
- **Framing:** important subjects stay in the middle horizontal band, because the board crops each picture to 1024x464.
- **Moment:** draw the first moment of the shot's defining action.

Save each as `visuals/panels/<clip>_S<n>.png`.

## 3. Compose the boards

```
python starling/pipeline/storyboard.py compose visuals/boards/<clip>.board.json --base-dir projects/<slug>
python starling/pipeline/storyboard.py verify projects/<slug>/storyboards/<clip>_storyboard.png
```

The spec lists, for each shot:
- the picture;
- the generated start and end times from `plan.json`;
- CAMERA and DEFINING ACTION, which must fit one 24 px line (shorten the text if it overflows);
- an optional `focus_y`.

Codex never draws a board or a caption.

## 4. Inspect (Panel Corrector, Director, Cinematography)

Inspect every picture at a useful size:
- identity against the character sheet;
- the exact cast and objects;
- anatomy and hands;
- scale, contact and support;
- light and continuity across the board;
- that the action is possible from the pose;
- no text.

Record verdicts and exact repair instructions in `visuals/image-review.json`. Regenerate or edit only the failed picture as a new version, keep the old one in `visuals/panels/rejected/`, and recompose that board. All boards must pass before animation.
