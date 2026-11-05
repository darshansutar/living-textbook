---
name: starling-production-master
description: Coordinate Starling production from mandatory intake through script, accepted audio, labelled narration storyboards, EN2 rendering, review and node assembly.
---

# Starling Production Master

Apply [buffered timing and visual review](../starling-animation-pack/references/timing-and-visual-review.md) for storyboard/prompt timing, per-output visual checks, bounded repair and the user-owned manual lip-sync check.

Follow the [scene-matched reference selection](../starling-animation-pack/references/reference-bundle.md), including its failed-output repair exception.

Read [the workflow](../pipeline/WORKFLOW.md) and use its runtime for scopes, evidence, handoffs and job history. Each stage has a fixed owner, recorded in `pipeline/workflow_lock.json` and returned by `runtime.py next`. Instructions do not run background work. Infrastructure edits and review-only requests do not authorize generation.

## Roles and handoff

| Work | Done by |
|---|---|
| Intake questions and recording | Claude, with the user's answers |
| Script (Script Rebuilder) | ChatGPT through Codex |
| Google Doc | Claude |
| Audio (Audio Pack) | ChatGPT through Codex |
| Image prompt pack: Director, Cinematography, Prompt Pack | Claude |
| Image generation and image edits | ChatGPT through Codex |
| Image, storyboard and prompt review (Panel Corrector, Verification) | Claude |
| Animation prompts, EN2 uploads, submission and collection | Claude |
| Complete video review and lip-sync | The user |
| FFmpeg assembly and auto-edit (`starling-auto-edit`, `pipeline/auto_edit.py`) | Claude, automatically after the last render downloads; the user reviews the edited node videos |

Claude coordinates every stage. For ChatGPT-owned work Claude writes one exact request to a file and runs `codex exec --skip-git-repo-check --sandbox workspace-write -C <project directory> - < request.md` (the request goes on stdin: passing it as an argument through `codex.cmd` truncates it at characters such as `>` and `%`; add `-c sandbox_workspace_write.network_access=true` when Codex must download provider files): the owning skill, the input files, the expected output paths and the acceptance criteria. Codex generates only. It does not copy files out of its own folders, approve its own output or operate desktop applications; tell it so in every request. Generated images land in `~/.codex/generated_images/<session>/`; Claude copies each one into the project, records its hash and dimensions, inspects it and writes the verdict.

Image handoff files in the project:

- `visuals/image-requests.json` (Claude writes): per image, the request ID, prompt, ordered reference files, canvas size, caption text and the shot plan it serves.
- `visuals/image_manifest.json` (Claude writes after collection): each collected file's source path, project path, SHA-256, dimensions, request ID and version.
- `visuals/image-review.json` (Claude writes): pass or fail per image, with exact repair instructions for failures. ChatGPT edits only from these instructions, and every edited version returns to Claude for complete re-review.

Claude never records a listening, viewing or lip-sync verdict that it did not perform. Complete video verdicts come from the user.

## Intake before building

Follow [mandatory intake](../pipeline/INTAKE.md). Ask and record source mode, style source and every character/narrator voice ID or name before script building or generation. Read-only inspection can identify speakers and fetch actual source/style references. Wait for complete answers; reuse answered choices for the same source/version. Resolve voice names through ElevenLabs. Supplied final recordings and silent sources require explicit selection of that mode.

For a source Starling link, retrieve all beats, branches, recovery content, consequences, endings, cast and actual visual references through MCP. For a finalized document, keep its content authoritative and use the supplied image or Starling link for style and compatible beat/visual context. Resolve conflicting mapping with the user. Resolve Script Rebuilder from the installed personal catalog.

## Execute the requested scope

Before related panels, require one approved scene master and a continuity map for camera axis, named left/right positions, seating/furniture geometry, fixed landmarks, props and lighting. Generate later panels from that authority and reject swaps, mirrors, changed sitting orientation, furniture growth and background drift before animation. Every narration clip uses the fixed-format board built by `pipeline/storyboard.py` (1024 wide, one 1024 x 464 picture per shot above an identical ivory caption strip; 1, 2 or 3 shots chosen from the narration length, see [auto-edit rules](../starling-auto-edit/references/rules.md) B1), covering 4-15 seconds (10-15 for three shots); no character talks in a narration panel; a single full-frame narration scene is invalid. Each shot carries one distinct source-supported purpose without unsupported people, duplicate frames or a reset of continuous geography. When narration directly precedes dialogue, require a passed side-by-side handoff whose final panel is a silent final panel of the same set (a detail, an establishing view or a character from behind) with the same scene master, environment/time, lighting, camera axis and set/prop state; it never shows the speakers face to face, because EN2 animates that pose as speech, and the dialogue clip's own wide shot opens the conversation. Dialogue animation receives exactly one approved clean scene plus accepted audio.

All production references use original files stored through the confirmed `darshan@en2.ai` Drive connection. Record Drive IDs, fetchable URLs, hashes, EN2 upload names and a visual-match check before paid submission. Apply the fixed order: visible characters, matching environment, visible props, composition authority last.

| Stage | Skills | Exit evidence |
|---|---|---|
| Script | starling-script-rebuilder | Source ledger, stable graph, matching Word/JSON and source comparison |
| Docs | Google Drive and Google Docs skills | Confirmed darshan@en2.ai account, real native document ID/URL and matching readback |
| Audio | starling-audio-pack | Complete accepted speech, speakers, listening and measured cues |
| Visual plan | starling-prompt-pack, director, cinematography | Full inventory and audio-timed source coverage |
| Images | image-pack-generator, panel-corrector | Approved scene masters, continuity maps, fixed-format 1-3 shot narration storyboards, and clean dialogue scenes |
| Animation preflight | starling-animation-pack | Exact approved inputs/uploads, prompts, shot mapping and measured timing |
| Submit and collect | animation-pack, animation-monitor | All ready clips submitted once, real IDs and downloaded outputs or explicit failures |
| Review and repair | verification, director, cinematography | The user's complete video and sound review and lip-sync verdicts, recorded by Claude; targeted replacements rechecked |
| Auto-edit | starling-auto-edit | Edited node videos, auto-edit report and inspected narration review sheets; re-render list for anything the edit cannot fix |
| Assembly | animation-pack and postproduction | Verified nodes, original audio, branch/word/join checks and final ZIP |

At animation preflight, require scene-matched references and a concrete description of each actual panel and its labelled action/camera/timing, following Animation Pack. Detailed prompting still requires complete output review. Apply image review immediately after generation; foundational assets pass before dependent scenes. Use [visual routing](../starling-animation-pack/references/visual-routing.md) and [spatial fidelity](../starling-cinematography/references/spatial-fidelity.md). Submit all approved clips in one ordered pass respecting capacity, review each completed output promptly while continuing collection of the remaining scope. Failed/unverified clips cannot enter final stitching. After an initial visual failure, follow Animation Pack: redesign the scene once to match the same script beat, inspect fresh images and submit one EN2 Ultra replacement. If it fails, stop for user review. Match explicit 2D, 2.5D or 3D animation wording to the inspected visuals. During assembly, narration, filler, establishing and ending clips discard rendered sound and use accepted external narration. Dialogue and conversation clips retain the verified audio embedded in their selected video so speech remains aligned to the rendered lip movement; do not replace that interval with the standalone dialogue file. Measure the selected dialogue video's usable picture/audio duration and keep it through the completed final utterance. If it runs longer than the earlier standalone-audio timing, extend the node timeline rather than cutting speech. FFmpeg handles technical checks, trimming, normalization, audio routing and export; still-image video replacements are disabled.

## Providers and authority

Use Starling MCP retrieval, ElevenLabs eleven_v3 with selected voices, ChatGPT image generation through Codex, EN2 MCP Ultra (`quality=true`), the selected Google account and local FFmpeg. Discover live schemas at execution. Preserve source words/routes, approved style, aspect and endpoint. Record hashes, inspection methods, provider IDs, voice/reference mappings and source versus assembly offsets. Receipts are reviewer attestations; missing listening or complete playback leaves required checks unverified. Publishing or external player changes require an explicit request.

## Resume and completion

Reconcile existing jobs before submission. Uncertain outcomes remain held until provider history resolves them. Preserve originals, paid IDs and prior reviews. Updated skills do not rerender media. Reconcile historical manifests and current scope explicitly before project adoption. Keep branches separate, including Bad Outcomes and canonical retry controls. Review final picture, sound, words, joins and all branches. Deliver actual outputs and exact blocks. Monitoring requires a demonstrated persistent runner and real recorded ID. Honor narrower endpoints without triggering later stages.
