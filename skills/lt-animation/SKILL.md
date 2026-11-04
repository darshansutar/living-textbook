---
name: lt-animation
description: Write six-section EN2 reference prompts from the inspected Living Textbook storyboards (with the non-speaking cast's character sheets), upload references with hash checks, submit all clips of an episode once on Ultra, and collect the renders.
---

# Living Textbook - Animation (EN2, Ultra)

Inputs: inspected boards (boards.json), inspected assets, plan.json. Read the live EN2 reference guide (`video_guide mode=reference`) and `gpu_timing` once per session.

## 1. Choose references

Order: visible characters' sheets (only cast from `episodes.json`) -> matching environment / scene master -> props, instrument, macro and diagram sheets actually visible in the clip -> **storyboard last**. Attach only what the clip's shots show. An environment-free science clip (e.g. cell cross-section) may be just its sheet + the board.

## 2. Write the prompt (one per clip, `prompts/<clip>.txt`)

Use the six sections in order (`templates/en2-prompt-template.txt`):

1. `subject_definitions` - `<Subject N>` for each environment / sheet with the features to keep, from `<Picture N>`; the board is its own `<Picture N>` mapping top-to-bottom pictures to Shot 1..3.
2. `summary` - `[reference generation]`, duration, 3D/2.5D/2D style from the assets, the shots, the hard-cut times.
3. `retention_analysis` - one line per Subject / Picture with `fully_preserved` or `partially_preserved` and the shots it appears in.
4. `detailed_description` - a style sentence, then: "Render each illustrated scene individually as an edge-to-edge, full-frame colour shot. At the specified time, switch directly to the next fully formed shot using a hard cut. Treat the storyboard layout and caption strips exclusively as production guidance." Then per shot: generated range, the **actual inspected panel** described in detail (composition, positions, objects, background, light), `ACTION a0-a1 s` (start state, motion, settled state), `CAMERA` (move and extent), `HOLD h0-h1 s`. Shots 2+ begin `At 00:0X.000, hard cut to ...`. Characters never speak: add "No one speaks; mouths stay closed or relaxed; no lip movement." For shots without the cast add "No people appear." Where an overlay will sit, describe the blank area and add "All dials, scales, boards and papers are blank: no text, letters or digits anywhere."
5. `overall_soundscape: Silent visual sequence; approved original narration is added during assembly.`
6. `non_diegetic_music: N/A`

Affirmative instructions only. Timings must equal plan.json and the printed board labels.

## 3. Upload (hash-checked)

```
cd projects/<slug>
node ../../pipeline/en2_upload.mjs assets/<...>.png storyboards/<clip>_storyboard.png > uploads.json
```

The uploader calls the EN2 MCP `video_upload` with the file bytes (the MCP URL is read from `EN2_MCP_URL` or `~/.codex/config.toml` and never printed). EN2 names uploads `en2ref_<first 16 hex of SHA-256>`; confirm every name matches the local hash.

## 4. Submit once, Ultra

`video_generate` with `refs` in the recorded order, `duration = render_seconds`, **`quality = true`**, `folder = "Living Textbook/<Chapter>/<Episode>"`. Submit every ready clip back to back so they share warm GPUs. Record each response in `renders/jobs.json` (job ID, refs, duration, seed, folder). Never resubmit a slow job; a cold start adds minutes. Tell the user `studio_queue`'s estimate in plain words.

## 5. Collect

```
node ../../pipeline/en2_collect.mjs renders/jobs.json
```

Polls `video_status` every 30 s and saves `renders/<clip>.mp4`. Hand each finished clip to lt-review straight away.
