---
name: starling-image-pack-generator
description: Generate foundational assets, labelled narration storyboards and clean dialogue scenes with ChatGPT images through Codex, with Claude writing requests and reviewing every output.
---

# Starling Image Pack Generator

**Owner:** split. ChatGPT generates and edits images through `codex exec`; Claude writes every request, collects the outputs, records them and reviews them. See [roles and handoff](../starling-production-master/SKILL.md#roles-and-handoff).

Apply [buffered timing and visual review](../starling-animation-pack/references/timing-and-visual-review.md) for storyboard/prompt timing, per-output visual checks, bounded repair and the user-owned manual lip-sync check.

Follow the [scene-matched reference selection](../starling-animation-pack/references/reference-bundle.md), including its failed-output repair exception.

Check [mandatory intake](../pipeline/INTAKE.md), accepted audio and the approved Prompt Pack. Read [visual routing](../starling-animation-pack/references/visual-routing.md), [narration storyboards](../starling-animation-pack/references/narration-pairs.md) and [spatial fidelity](../starling-cinematography/references/spatial-fidelity.md). ChatGPT generates and edits images through `codex exec`, one request at a time, from the entries in `visuals/image-requests.json` that Claude writes. Each request names the reference files to attach and states that Codex generates only: it does not copy files, approve output or operate desktop applications. Claude collects each output from `~/.codex/generated_images/<session>/` into the project, records it in `image_manifest.json` and reviews it before any dependent request is sent. This skill owns image production, not video or script rewriting.

Generate assets in strict dependency order: sheets for visible characters, one scene-specific environment in two consistent views, only the required visible props, then the final storyboard. Inspect and approve each asset before using it downstream. For every narration storyboard, generate each of its 1-3 shots as a separate 1536 x 1024 landscape picture with no text, captions, borders or arrows, keeping important subjects inside the central band that the board keeps. Claude composes them into the fixed-format board built by `pipeline/storyboard.py` (1024 wide, one 1024 x 464 picture per shot above an identical ivory caption strip; 1, 2 or 3 shots chosen from the narration length, see [auto-edit rules](../starling-auto-edit/references/rules.md) B1); ChatGPT never draws the board or its captions. No character talks in a narration picture: no face-to-face conversation poses; give everyone a silent action. Keep prompts specific to visible subjects, composition and physically plausible interactions.

Each narration board stacks the three pictures top to bottom with the caption `SHOT | exact start-end time | CAMERA | DEFINING ACTION` typed by the compositor from the timing table, so colour, type, size and heights never vary. Keep artwork free of arrows and motion symbols. The compositor saves the picture boxes and caption metadata in the board's `.layout.json`. Each picture defines one complete shot and one defining action; Animation Pack turns it into edge-to-edge colour footage with hard cuts at the printed times.

Match time of day, sky, light sources, exposure and shadow direction/length across related shots. A zoom or pan keeps the same moment and lighting; depict a time transition only when the source explicitly calls for it.

Build each prompt from that shot's explicit cast and object inventory. Include character-specific clothing and prop-orientation details only when that character or prop belongs in the shot; generic example wording can accidentally introduce absent subjects. State the exact visible person count, including zero for inserts.

Bind each visible character to the approved identity reference across all shot sizes. Carry the actual hairstyle (shape, length, tie/bun position and hairline), face and PPE into that character's prompt. Compare close-ups with the identity reference and adjacent shots; matching the storyboard views alone does not establish character continuity.

Claude immediately inspects the full output and all storyboard pictures and labels at useful resolution, applying Panel Corrector plus Director/Cinematography checks, including anatomy, identity, scale, perspective, contact, clearance, front/back orientation, occlusion and shot continuity. Verdicts and repair instructions go in `visuals/image-review.json`. ChatGPT repairs only the observed defects from those instructions, using the actual image and required references; Claude reinspects the complete replacement.

Save durable originals and corrected versions with real file type, dimensions, SHA-256, picture boxes and shot/label mapping, source IDs, input/reference mappings, generation provenance and review evidence in image_manifest.json. Validate JPEG delivery where required by the upload contract; changing a filename is not conversion. All pictures, caption accuracy and their narrative relationship must pass before animation. Unresolved checks stay unverified; preserve earlier versions and paid-job history.
