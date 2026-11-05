# Storyboard-grounded animation prompts

Inspect the actual pictures, below-picture labels and accepted audio before writing. Use [scene preservation](scene-preservation.md) for the detailed shot description and [reference selection](reference-bundle.md) for the attachments. Describe the approved composition and action precisely, using affirmative instructions. Omit unrelated stock wording and subjects absent from the shot.

Discover the live EN2 reference guide before submission. Its current format has six sections in this order: subject_definitions, summary, retention_analysis, detailed_description, overall_soundscape, non_diegetic_music. Historical five-section prompts remain archived; new prompts use the current provider format. If the live contract changes, reconcile the template and validator before submitting.

## Reference definitions

Define reusable identities, environments and props as <Subject N> sourced from their actual <Picture N>. Give the storyboard or clean scene its own <Picture N> entry as the composition anchor. Use <Audio N> for accepted dialogue recordings. Number each label category consistently and rebuild indexes after attachments change. Define only selected references; save filenames, hashes, upload names and per-shot visibility outside the prompt.

For narration, explicitly map the storyboard pictures in top-to-bottom order to Shot 1, Shot 2 and, for 1x3, Shot 3. State in the prompt that the "storyboard is the per-shot composition authority," that asset sheets provide "identity and material only," and that the last shot must match the "final storyboard panel." The storyboard supplies the complete environment, blocking, relative depth, visible inventory, shot order and printed action/camera/timing plan. Never describe a sheet, turnaround, neutral-background group or prop plate as a scene. Final footage presents each storyboard picture as one edge-to-edge colour shot. The board layout and caption strips remain production guidance.

## Narration structure

Use the official [MiniMax H3 reference guide](https://huggingface.co/MiniMaxAI/MiniMax-H3/blob/main/docs/VIDEO_PROMPT_WRITING_GUIDE_ref_en.md) for the six-section reference structure and its shared [base guide speaker rules](https://huggingface.co/MiniMaxAI/MiniMax-H3/blob/main/docs/VIDEO_PROMPT_WRITING_GUIDE_base_en.md#44-speakers-dialogue-and-singing) for voiceover. Default narration remains external: do not put narration speech or audio into a silent EN2 render. In each shot name the visible characters and state that they stay silent, lips completely closed, with no speech-like mouth/jaw movement. Silent characters get no speaker ID.

Only when generated voiceover is explicitly requested, use `says in an off-screen voiceover` for every line. Put only the language tag and exact spoken words inside `<d>...</d>`; put speaker description, stable ID, action and delivery outside. Immediately after every voiceover block state that each visible character's lips remain completely closed. Describe the vocal identity on first use and retain its ID across shots. For speech crossing a cut, put `<scenetrans>` at both connecting points and state that it continues seamlessly. Preserve the complete script; do not impose a word-count cap. Keep speech out of overall_soundscape. The official guide specifies `non_diegetic_music: N/A` for no music. If prompt rewriting is used, inspect the rewritten result for these per-line constraints.

The reusable example below uses three shots; for a one- or two-shot board drop the extra shot paragraphs and cut times. Replace every placeholder with inspected scene facts and measured timing.

Replace the placeholders with inspected scene facts and measured timing. Definitions and indexes vary with the selected bundle; an environment-only sequence has no character or prop-sheet definitions.

```text
subject_definitions:
[Define only visible identities and relevant environment/prop subjects from the actual images.]
<Picture N> is the inspected storyboard. Its pictures, top to bottom, define Shots 1, 2 and 3 (as many as the board has), including composition, visible inventory and printed CAMERA/DEFINING ACTION/timing instructions.

summary:
[reference generation] [Duration]-second [2D, 2.5D or 3D] sequence showing [source-supported scene]. Three full-frame shots follow <Picture N>, with hard cuts at [cut time 1] and [cut time 2].

retention_analysis:
[For each selected Subject, state its assigned appearance role and the shots where it is visible.]
<Picture N>: fully_preserved - the storyboard is the per-shot composition authority. Preserve all three compositions, visible inventories, spatial relationships and planned actions. Other references provide identity and material only. Render one edge-to-edge scene at a time; the sheet layout and captions serve only as production guidance. The last shot matches the final storyboard panel.

detailed_description:
[Animation style, colours, materials, depth and lighting from the inspected colour references.]
[Shot 1] [Detailed top-picture composition: visible cast, positions, expression/pose/gaze, props and support/orientation, background and camera side.] [In natural sentences: from [start] to [action end] the exact supported movement from the caption, its starting state and final pose; the camera's printed move and extent, or that it stays still; then the settled hold to [end].] [Scene-specific relationships that remain unchanged. Name every visible character whose lips stay completely closed; no speaking or lip-sync.]
[Shot 2] At [MM:SS.mmm], hard cut to [detailed middle-picture composition]. [Natural sentences for the captioned movement and final pose, the camera behaviour and the settled hold.] [Continuity with Shot 1. Repeat the silence and closed-lips rule.]
[Shot 3] At [MM:SS.mmm], hard cut to [detailed bottom-picture composition]. [Natural sentences for the single captioned movement and final pose, the camera behaviour and the settled hold.] [Continuity or dialogue handoff requirements. Repeat the silence and closed-lips rule.]

overall_soundscape:
Silent visual sequence; approved original narration is added during assembly.

non_diegetic_music:
N/A
```

Make `detailed_description` 350-500 English words for narration, as EN2's live reference guide recommends, spread across the shots by information load. Every narration prompt states that everyone keeps closed lips and nobody speaks (the runtime requires "closed lips"). Write action, camera and settling holds as natural English sentences inside each shot; do not print `ACTION:`, `CAMERA:` or `BUFFER:` labels in the prompt. State concrete observable motion. For a camera-only document insert, the camera reveals the existing rows while papers remain supported and unchanged. For an environment-only pond shot, describe the pictured shore, water level, inlet, steps and light, then the labelled ripples or trickle and camera movement. Do not introduce activity merely to fill time.

For an eight-second example with three seconds of required action per shot and one-second buffers: Shot 1 action 0–3, hold 3–4; hard cut at 4; Shot 2 action 4–7, hold 7–8. Print those same ranges below the pictures. Assembly source_spans [[0,3],[4,7]] retain six seconds without stretching narration. Follow the [timing contract](timing-and-visual-review.md).

## Dialogue adaptation

Use the same six sections, with the inspected clean scene as the composition anchor and the accepted speech as reference audio. Describe the actual visible participants, their separate positions and hand/prop contacts. Every spoken line uses a pixel-locked static tripod for its entire duration. Repeat "static tripod," "zero camera movement" and "no automatic reframing" in the summary, retention analysis and detailed description. Prohibit pan, tilt, zoom/push/pull, dolly, track, orbit, crane, handheld/stabilization drift, automatic recentering/reframing and focal-length changes. Preserve subject scale, framing and background landmarks; only mouth, eyes, blinks, breathing and restrained source-supported gestures move.

Assign speaker IDs in order of actual vocal events. An example binding is: `<Audio 1> is the approved speech for <Subject 1> (S1).` In detailed_description use `<Subject 1> (S1) says, <d>[English] Exact approved words.</d>`, keeping the original language and all source words. Preserve source-required off-screen speech without adding an unseen person to the image bundle.

For complete accepted audio reuse, begin summary with `[reference generation + audio reuse]` and use the audio retention marker `fully_copy`; preserve the recording from its beginning, including pauses and its final utterance, at original speed. Use `partially_copy` or `reference` only when that is the actual approved audio relationship. Visible reference roles use the provider's visual markers such as `fully_preserved`; do not apply visual retention markers to audio. overall_soundscape describes the approved sound layers; non_diegetic_music states N/A unless a score is explicitly planned.

## Preflight

Compare every written shot description, visible subject, object, movement, contact, camera instruction and timing against the corresponding actual picture and labels. Record shot_inventory_match with image hashes and observations. Check complete accepted speech and speaker mapping for dialogue. Follow [submission](en2-submission.md) for payloads and provider limits. Prompt detail and structural validation cannot replace complete rendered-picture and sound review.
