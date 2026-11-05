---
name: starling-auto-edit
description: Monitor and edit raw Starling EN2 renders into finished node videos - narration pacing, dialogue turn-taking, jump-cut cover, fault fixes and language re-fits - before the user's video review.
---

# Starling Auto-Edit

**Owner:** Claude runs it and reviews its report and frame sheets. **Reviewer:** the user watches the complete edited videos, sound and lip-sync; Claude records only the user's verdicts. See [roles and handoff](../starling-production-master/SKILL.md#roles-and-handoff).

**When:** automatically, as soon as the last raw render of a project (or of a repair batch) has downloaded, and again after any re-render. The edited videos, not the raw clips, go to the user for review.

**Tool:** `python pipeline/auto_edit.py PROJECT [--min-shot 2.0] [--push 1.15] [--out "Auto-Edit v1"]`. It needs only ffmpeg and Python; no model downloads or heavy packages. It never requests a render.

Follow the exact numbers in [the editing rules](references/rules.md).

## Inputs

- `animation/v1/preview-assembly.json`: the per-node timeline written by the project's assembler - for every clip its source render, and for narration the source start and length of each shot plus the narration audio window.
- `canonical-script.json` (speakers), `audio/audio_manifest.json` (approved narration and dialogue audio).
- Optional `animation/v1/auto-edit-flags.json`: per narration clip, `drop_shots` (for example lips moving during narration) and `trim_head` (seconds to skip at a shot's start when its opening is hallucinated), each with a reason.

## What it does

1. **Checks every used shot** with ffmpeg: real scene cuts, black frames or fades, and side or top bars.
2. **Paces narration:** real cuts only, a 2-second minimum shot, merges with up to 0.8x B-roll slow-down, one narration panel for lines under 3.75 seconds, no dialogue picture used as narration, extra EN2 shots cut out.
3. **Edits dialogue:** one spoken copy of each line (0.15 s lead, 0.30 s tail, anything EN2 says after the approved line is cut); the first line of a run stays wide and following lines push in 115% toward the speaker.
4. **Fixes faults in the edit** when it can (zoom out bars or edge signs up to 15%, drop a flagged shot when its neighbours can cover the time) and lists the rest for re-render.
5. **Writes** the edited node videos, `animation/v1/auto-edit-report.json` (every trim, merge, speed, fault and flag with its reason) and `review-sheets/` (three frames per narration shot).

## Claude's review after each run

- Read the report. Every flagged fault is either fixed in the edit or put on the re-render list with its reason and timestamp.
- Inspect every review sheet for: anyone's lips apart or moving during narration, invented text or signs, wrong objects, duplicates, wrong device orientation. Treat a dark scene flagged as "possible bars" as a check, not a fault.
- Lips moving during narration: add the shot to `auto-edit-flags.json` and re-run if the other shots can cover its time; otherwise put the board on the re-render list with a redesign (see rules, section B).
- Never claim to have watched the videos or listened. Paid re-renders need the user's approval.

## Language versions

Narration renders are silent, so a new language reuses them: re-fit each board's shots to the new narration at measured pauses, shifting a cut by up to 1.5 seconds into a neighbour that has footage. Re-render a board only when the language reverses the order of its pictures or a phrase still does not fit. Dialogue is always re-rendered for lip-sync. Then run the auto-edit on the new version.

## Never

- Cut inside, speed up, reorder or replace approved audio.
- Overwrite or delete original renders, edited sources or paid job IDs; every edit is a new file.
- Join branch outcomes; every script node is its own video.
- Record a video, sound or lip-sync verdict the user did not give.
