# Living Textbook workflow

Contract date: 3 November 2026. Base: the Starling automation storyboard method, narration-only.

## The flow

| # | Stage | Who / what | Output |
|---|---|---|---|
| 1 | **Intake** | Ask: script (Google Doc or Starling link), style reference image, narrator voice | `intake.json` |
| 2 | **Script** | Narration lines, clip split (<= ~11 s of narration per clip), choice mapping for Predict-Observe-Explain, static image list, cast from the script only | `script.json` |
| 3 | **Narration audio** | Codex -> ElevenLabs `eleven_v3`; `harvest_audio.py` downloads and measures | `audio/*.mp3`, `audio/narration.json` |
| 4 | **Visual plan** | One timing table: per clip a 1x2/1x3 board; per shot required interval (measured), 1-2 s buffer, generated/action/hold ranges, camera, action, visible inventory | `plan.json` |
| 5 | **Assets** | Codex images: scene masters, prop / macro / cutaway sheets (characters only if the script has them) | `assets/` |
| 6 | **Storyboards** | Codex draws black-and-white panels; `assemble_boards.py` stacks them and prints the captions from plan.json | `storyboards/` |
| 7 | **Static images** | Codex: cover page, answer / reason / confidence / check images, no text | `static/` |
| 8 | **Animation** | Six-section EN2 prompts from the inspected boards; `en2_upload.mjs` (hash-checked); `video_generate` Ultra; `en2_collect.mjs` | `prompts/`, `renders/` |
| 9 | **Review** | `review_cuts.py` (cuts, drift, frame sheets) + visual check per shot; re-time first; one repair per clip | `renders/cuts.json`, `review.json` |
| 10 | **Edit and stitch** | `build_edit.py` (spans from observed cuts, optional cover opener) and `assemble_edit.py` | `edit.json`, `output/` |
| 11 | **Package** | `package.py`: roleplay.json + ZIP + SHA-256 manifest | `<slug>-living-textbook-<date>.zip` |

## What changed from Starling

| Starling | Living Textbook |
|---|---|
| Dialogue scenes with lip-synced speech | Removed - narration only |
| Narration-to-dialogue handoff panels | Removed |
| Character voices per speaker | One narrator voice |
| Native ChatGPT images in the session | Codex native images through `codex exec` (`codex_run.py`) |
| ElevenLabs in the session | ElevenLabs through Codex; `harvest_audio.py` downloads |
| References via Google Drive URLs | Direct EN2 upload through the EN2 MCP (`en2_upload.mjs`), verified by content hash |
| Captions drawn on the board image | Captions printed in code from plan.json (exact text) |
| Planned cut times trusted | Observed cuts measured; spans re-timed before any repair |
| - | Static images: cover, answer, reason, confidence, check (`roleplay.json`) |
| - | Science shot types: macro, cutaway, cross-section, process close-up, experiment close-up |

## Rules that never bend

1. The script decides the cast. A style reference is style only.
2. Audio first; one timing table.
3. Inspect every generated image, board and render; record what was inspected.
4. Ultra renders; each clip submitted once; every job ID recorded; rejected media kept.
5. Re-time before repair; one repair render per clip; then the user decides.
6. Narration is never stretched; footage is trimmed to it.

## Pilot evidence (stomata, 3 Nov 2026)

- Codex produced 6 colour assets and 9 black-and-white panels in the style reference's faceted low-poly look.
- EN2 Ultra followed the boards: correct layouts, actions, colour from monochrome boards, clean hard cuts, no leaked captions.
- Observed cuts: C1 3.71 / 8.29 (planned 4 / 8), C2 3.75 (planned 6), C3 3.04 (planned 3). C2 was re-timed, not repaired.
- Mistake caught and fixed: a character was invented from the style reference; both affected clips were rejected and redone without people. The rule is now in every skill.
- ElevenLabs via Codex generated the narration (7.92 s, 13.68 s); Codex's sandbox could not download it, so `harvest_audio.py` was added.
