---
name: starling-prompt-pack
description: Plan audio-timed labelled narration storyboards and clean dialogue scene prompts from the complete approved Starling script and visual references.
---

# Starling Prompt Pack

**Owner:** Claude. Claude writes the image prompt pack and the `image-requests.json` that ChatGPT generates from. See [roles and handoff](../starling-production-master/SKILL.md#roles-and-handoff).

Apply [buffered timing and visual review](../starling-animation-pack/references/timing-and-visual-review.md) for storyboard/prompt timing, per-output visual checks, bounded repair and the user-owned manual lip-sync check.

Follow the [scene-matched reference selection](../starling-animation-pack/references/reference-bundle.md), including its failed-output repair exception.

Check completed [intake](../pipeline/INTAKE.md) and read [the handoff contract](references/handoff-contract.md). Own visual planning and image prompts. Read Director and Cinematography for their review responsibilities. Accepted audio and actual style images are required for generation-ready planning.

## Plan the coverage

Stay inside the production order `script -> audio -> prompts -> images -> animation prompts -> renders -> assembly`. Finish and accept the owning stage before starting the next one. A correction updates the current stage and invalidates only its dependent artifacts; it does not authorize skipping ahead, changing the narration method, regenerating approved audio, or submitting animation before corrected images and manifests are accepted.

Before drawing panels for a continuous location, create and approve one full-frame scene master. Record the camera axis, character screen-position map, seating/standing orientation, furniture dimensions and placement, fixed background landmarks, prop state and lighting direction. The first panel uses required appearance references with the scene master last; later panels use the same master or previous approved panel last as composition anchor. Reject mirrored/swapped characters, changed seating, furniture growth, moved landmarks and unjustified perspective changes before animation.

Use the mandatory storyboard method for every narration clip. Plan 1-3 source-supported shots (by narration length) for the fixed-format board built by `pipeline/storyboard.py` (1024 wide, one 1024 x 464 picture per shot above an identical ivory caption strip; 1, 2 or 3 shots chosen from the narration length, see [auto-edit rules](../starling-auto-edit/references/rules.md) B1), covering 4-15 seconds of generated footage; never replace narration with one full-frame scene. When narration remains in one location, preserve continuous geography and use the panels to progress supported action, expression, blocking, prop state or evidence without crossing the camera axis or resetting the set. Do not add unsupported people, portraits, reactions, props or locations, and do not use arbitrary duplicate frames merely to satisfy the panel count. No character talks in a narration panel: nobody faces another character in a conversation pose, every person has a silent action (typing, reading, carrying, pointing, walking, listening), and close shots of people use a back, side or over-the-shoulder view, or hands and objects.

When narration is immediately followed by dialogue, design its final panel together with the clean dialogue scene so the cut into lip-synced dialogue is continuous: it is a silent final panel of the same set (a detail, an establishing view or a character from behind) with the same scene master, environment/time, lighting, camera axis and set/prop state; it never shows the speakers face to face, because EN2 animates that pose as speech, and the dialogue clip's own wide shot opens the conversation. Review that pair side by side. When narration follows dialogue, plan its panels mainly as source-supported B-roll and subject action that justify the narrated scene; it needs no handoff with the preceding dialogue scene, while identities, style and time of day stay consistent. Narration between two dialogues applies the after-dialogue rule at its start and the before-dialogue handoff at its final panel. Opening and ending narration use the normal audio-led storyboard method.

Read all source branches and accepted audio/cues. Map each meaningful beat to exact lines, speakers, node/branch, audio source/assembly intervals and required visual information. Classify narration, dialogue and speech-free coverage. Inventory every visible character, environment and prop. Use extracted Starling style references when selected; a finalized document controls story content over any reference link.

Validate depicted tasks and physical actions before approving a storyboard. Check participant roles, count, orientation, contact, direction of travel and real-world spatial sequence against the action being shown. For any structured activity, state the required action geometry and reject a panel whose roles or positions make the activity impossible, even when the characters and style look correct. A correction becomes a new version; keep the rejected version out of active manifests, Drive/EN2 inputs and downstream prompts.

Apply [narration storyboard planning](../starling-animation-pack/references/narration-pairs.md). First verify the transcript and measured audio cues. Plan exactly three sequential semantic shots: establish, develop, resolve or hand off. Record SHOT, exact time range, CAMERA and a DEFINING ACTION short enough for one 24 px caption line; the compositor prints them. Each shot's image request asks for a 1536 x 1024 picture with no text, arrows or planning marks. Preserve every essential beat and measured audio interval. Dialogue uses one clean full-frame scene derived from the approved scene master. Mixed nodes retain canonical order and continuity handoffs.

For quiet narration, plan a subtle camera-only zoom or pan within each quiet shot and unchanged subject/object states. State the sole permitted movement and the fixed visible inventory. Keep time of day, sky, lighting and shadows consistent throughout; add a time transition only when explicitly required by the script.

Introduce named characters with recognizable faces. Plan distinct source-supported setting/task B-roll where useful. Include opening orientation, orientation at meaningful location changes and closing coverage for actual endings and completed Bad Outcomes. Mark additional coverage production_staging within existing nodes; preserve the actual proposed/completed state. Fit under meaningful narration or explicitly budget a brief speech-free interval.

## Write concise image prompts

Plan only the character and prop assets required by the visible inventory, followed by labelled narration storyboards and clean dialogue scenes. Use the shared reference-selection rules for each request, rather than attaching the complete project asset pack. Define style and assigned reference roles, actual visible cast/count, set/lighting, composition, relevant object states and supported action staging. Keep the spoken narration in metadata; write matching camera/action/time labels below all storyboard pictures. Use affirmative image and animation instructions. Use [spatial fidelity](../starling-cinematography/references/spatial-fidelity.md) to specify only relevant scale, depth, clearance, orientation and contact relationships. Avoid repeated negative lists and generic cinematic embellishment.

Inspect/reuse approved identities and environments. Character sheets can show multiple views of one person; those views do not authorize extra cast. Changing carried objects belong in prop references. Keep clear ownership and state. Do not add people to empty inserts merely to create movement.

Save the complete inventory, source/audio map, per-shot action purposes, visible inventory, picture-area boxes and image dimensions, image prompts, reference hashes, permitted actions and director/cinematography findings. Generation starts only when required planning checks pass.

Write every generation request into `visuals/image-requests.json` (request ID, prompt, ordered reference files, canvas size, caption text, the shot plan it serves) for ChatGPT to generate through Codex. Send foundational assets first and wait for Claude's approval of each before sending requests that depend on it.

Use 1K-class images for ordinary character/environment/prop references and labelled storyboards. Record actual pixel dimensions; do not describe an image as 4K unless its delivered dimensions actually meet the chosen 4K frame size. Generate 4K only when the user explicitly requests it or a reviewed downstream need justifies it. Resolution does not relax identity, text, action-geometry, storyboard or transport checks.

## Scene redesign after a failed animation

When Animation Pack requests its single scene redesign after a failed initial animation, choose different, simpler staging that still communicates the same script beat. Retain the approved visual style, identities, branch facts and audio interval. Generate fresh labelled storyboards or the clean dialogue scene for inspection before rebuilding the animation prompt; retain the logical clip ID and existing attempt history. The replacement animation is the final automatic attempt.
