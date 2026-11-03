---
name: lt-review
description: Review every Living Textbook EN2 render - detect real cut times, re-time before repairing, inspect each shot against its storyboard panel, record a verdict, and allow one repair render per clip.
---

# Living Textbook - Review and Repair

## 1. Technical pass

```
python pipeline/review_cuts.py --project projects/<slug>
```

For each `renders/<clip>.mp4`: FFmpeg scene detection finds hard cuts (score >= 0.3) and soft transitions, compares them with plan.json `cut_times`, flags drift over 0.5 s, and writes a 2-fps timestamped frame sheet `renders/<clip>.review.png`. Results go to `renders/cuts.json`.

## 2. Visual pass (a person / the assistant looking)

Open the frame sheet and play the clip. Check every shot against its panel:

- correct shot order and hard cuts (no dissolves, mixed panels, borders, captions or storyboard layout in the picture)
- exact inventory: no extra, duplicated or missing objects; **no people unless the script has them**
- layout identical to the scene master (left/right positions, camera side, lighting)
- the labelled action happens (start state, motion, settled state) and the camera move
- style and colours match the assets; particle designs consistent

Record in `review.json` per clip: `visual_status` (`verified`, `verified_with_retime`, `needs_fix`, `unverified`), per-shot notes, observed cuts, and what was actually inspected. A frame sheet alone is a diagnosis aid; say so if full playback was not done.

## 3. Cut drift: re-time first

EN2 often moves cuts by a few tenths of a second and sometimes by seconds. Before calling a repair, run `build_edit.py`: it rebuilds the spans from the observed cuts and carries any shortfall of one shot into the next shot. If it succeeds, the clip is `verified_with_retime` (the cut lands slightly before a sentence boundary, which is fine). Only if the footage cannot cover the narration does the clip become `needs_fix`.

## 4. Repair (once per clip)

For a real picture defect: keep the original and its job ID (`renders/rejected/`), fix the cause at its stage (panel, asset or prompt), inspect the fresh board, write a simpler, clearer prompt for the same beat, and submit one Ultra replacement under the same logical clip ID. Review it completely. If it fails again, stop and show the user both versions.

Minor issues that do not change the meaning (a faint detail, a molecule stopping at a pore) are noted, not repaired.
