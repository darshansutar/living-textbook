---
name: lt-assembly
description: Edit verified Living Textbook clips under the original narration with FFmpeg - spans from observed cuts, one segment per clip, then one MP4 per video screen (silent wonder clips without narration) - ready for the player package.
---

# Living Textbook - Edit

The player plays **one video file per video screen**. A screen's video is built from its clips, each cut to its narration.

## 1. Edit plan

```
python pipeline/build_edit.py --project projects/<slug>
```

Builds `edit.json` from plan.json, `renders/cuts.json`, `review.json` and `audio/narration.json`. Only `verified*` clips are included (`--include-unverified` for previews only). Each shot's span starts at its observed cut and is as long as its narration interval; shortfalls carry into the next shot; narration is never stretched. Every segment carries its clip's `screen`. Silent wonder clips (no `narration` in plan.json) get spans from their planned `required` lengths.

## 2. Segments and screen files

```
python pipeline/assemble_edit.py --project projects/<slug> [--screen e1.c1.s5] [--no-preview]
```

Trims the spans, joins them with hard cuts, scales/pads to the project size and fps, discards EN2's sound and lays the narration underneath (silent clips get a silent track). Writes `output/segments/NN_<clip>.mp4`, then joins each screen's segments in edit order into **`output/screens/<screen-id>.mp4`** - the files the player uses. `--screen` rebuilds only the named screens (after a repair). `output/final.mp4` is only a preview of everything joined.

## 3. Overlays

Overlays (numbers, labels, equations) are **not** burnt in; the player draws them from `chapter.json` so they stay exact and translatable.

## 4. Check

Play every screen file completely: every cut, every narration word, no gaps or doubled audio, the picture matches what the narration says, overlay areas clear at their times. Record the check per screen in `review.json.screens`.
