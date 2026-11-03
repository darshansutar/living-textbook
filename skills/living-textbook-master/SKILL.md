---
name: living-textbook-master
description: Coordinate a Living Textbook production end to end - narration-only educational roleplays built with the Starling storyboard method, Codex images and ElevenLabs audio, EN2 Ultra animation, static cover/option images, FFmpeg stitching and a delivery ZIP.
---

# Living Textbook - Production Master

Living Textbook turns a finished lesson script (a Google Doc or a Starling roleplay link) into a narrated, animated interactive roleplay. It is the Starling workflow with three changes:

1. **No dialogue.** Every clip is narration over picture. There are no speaking characters, no lip-sync, no clean dialogue scenes and no narration-to-dialogue handoffs.
2. **Static roleplay images.** Besides the animated clips, the production makes the cover page and one text-free image for every answer, reason, confidence and check option, because the player shows these as stills.
3. **Science shot types.** Macro inserts, cutaways, cross-sections and experiment close-ups are first-class storyboard shots (see lt-visual-plan).

Everything else follows the Starling storyboard method: audio first, scene masters, labelled black-and-white 1x2/1x3 storyboards, six-section EN2 reference prompts, Ultra renders, full review, one repair, FFmpeg assembly.

## Stages and owners

| # | Stage | Skill | Exit evidence |
|---|---|---|---|
| 1 | Intake | lt-intake | intake.json with source, style reference, narrator voice, answered by the user |
| 2 | Script | lt-script | script.json: every narration line, clip split, choice mapping and static-image list, matching the source word for word |
| 3 | Narration audio | lt-audio | audio/*.mp3 from ElevenLabs (via Codex) + audio/narration.json with measured durations and pauses |
| 4 | Visual plan | lt-visual-plan | plan.json timing table: clips, shots, required/generated ranges, camera, action, visible inventory |
| 5 | Assets | lt-images | scene masters and prop/macro sheets, inspected |
| 6 | Storyboards | lt-images | panels + assembled labelled boards (storyboards/*.png, boards.json), inspected |
| 7 | Static images | lt-static-images | static/cover.png and option images, inspected |
| 8 | Animation | lt-animation | prompts/*.txt, uploads.json (hash-matched), renders/jobs.json with real job IDs |
| 9 | Review | lt-review | renders/cuts.json + review.json with a verdict for every clip |
| 10 | Assembly | lt-assembly | edit.json, output/final.mp4, output/segments/, delivery ZIP |

Finish and inspect each stage before starting the next. A correction updates its own stage and invalidates only what depends on it.

## Providers (fixed)

| Need | Provider | How |
|---|---|---|
| Images (assets, panels, cover, options) | Codex native image generation | `pipeline/codex_run.py` (`codex exec` with the style reference and asset refs attached) |
| Narration | ElevenLabs via Codex's connected ElevenLabs app, model eleven_v3 | `codex_run.py` then `pipeline/harvest_audio.py` (Codex's sandbox cannot download; the harvester does) |
| Animation | EN2 reference-to-video, **Ultra only** (`quality=true`) | prompts by hand from inspected boards; `pipeline/en2_upload.mjs`, `video_generate`, `pipeline/en2_collect.mjs` |
| Edit | Local FFmpeg | `review_cuts.py`, `build_edit.py`, `assemble_edit.py`, `package.py` |

Do not silently substitute providers. Never build animation in code (three.js / anime.js); the storyboard method covers science content.

## Hard rules

- **The script decides the cast.** A style reference supplies look only - never its character. A science script with no characters gets no people anywhere: not in clips, not on the cover, not in option images.
- **Audio first.** Shot timing comes from measured narration, never from word-count guesses once audio exists.
- **One timing table.** plan.json drives the board captions, the animation prompt, the render length and the edit spans. Mismatches block submission.
- **Labels in code.** Panels come from Codex without text; `assemble_boards.py` prints the SHOT/time/CAMERA/ACTION strips.
- **Inspect everything you generate** before anything depends on it. Record what you looked at; never claim a review you did not do.
- **Paid jobs:** submit each ready clip once, record the real job ID, never resubmit a slow job, keep rejected renders and their IDs.
- **Repairs:** first re-time the edit to the observed cuts (lt-review). Only a real picture defect gets one repair render; a second failure stops for the user.

## Project layout

```
projects/<slug>/
  intake.json            script.json          plan.json
  refs/                  style reference (style only)
  audio/                 N*.mp3, narration.json
  assets/                scene masters, prop/macro sheets
  storyboards/panels/    <CLIP>_P<n>.png from Codex
  storyboards/           <clip>_storyboard.png, boards.json
  static/                cover.png, option_*.png, confidence_*.png, check_*.png
  prompts/               codex-*.md (image/audio steps), <clip>.txt (EN2 prompts)
  uploads.json           EN2 upload names + hashes
  renders/               jobs.json, <clip>.mp4, cuts.json, rejected/
  review.json            edit.json     output/     logs/
```

Start from `templates/`. Run every pipeline script from the repo root with `--project projects/<slug>`.

## Delivery

The ZIP from `package.py` contains the final video, per-clip segments, static images and `roleplay.json` (which image belongs to which option), narration audio and cues, boards, prompts, plan, edit plan, job IDs, review record and a SHA-256 manifest.
