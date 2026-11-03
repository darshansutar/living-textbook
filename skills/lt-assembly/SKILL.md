---
name: lt-assembly
description: Stitch verified Living Textbook clips under the original narration with FFmpeg - spans from observed cuts, optional cover page opener, per-clip segments, final video - and pack the delivery ZIP with roleplay.json.
---

# Living Textbook - Edit, Stitch and Package

## 1. Edit plan

```
python pipeline/build_edit.py --project projects/<slug> [--cover static/cover.png --cover-seconds 3]
```

Builds `edit.json` from plan.json, `renders/cuts.json`, `review.json` and `audio/narration.json`. Only `verified*` clips are included (`--include-unverified` for previews only). Each shot's span starts at its observed cut and is as long as its narration interval; shortfalls carry into the next shot; the narration is never stretched.

## 2. Stitch

```
python pipeline/assemble_edit.py --project projects/<slug>
```

For every segment: trim the spans, join with hard cuts, scale/pad to the project size and fps, discard EN2's sound and lay the narration interval underneath. Writes `output/segments/NN_<clip>.mp4` (one per clip, useful when the player plays clips separately - e.g. choice openers) and `output/final.mp4` (all segments in order, the cover first if requested).

## 3. Check the result

Play the final video completely: every cut, every narration word, no gaps or doubled audio, picture matches the narration it sits under, cover (if any) correct. Note the check in review.json `final_check`.

## 4. Package

```
python pipeline/package.py --project projects/<slug>
```

Creates `<slug>-living-textbook-<date>.zip` with: output video and segments, static images and `roleplay.json` (cover + every option with its text, kind and image), narration MP3s and narration.json, boards and panels, assets, prompts, plan.json, edit.json, job IDs, cuts.json, review.json, intake.json, and `MANIFEST.json` (SHA-256 per file). Rejected media stays out of the ZIP but remains in the project.
