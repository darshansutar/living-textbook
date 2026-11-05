# Scene preservation and animation prompt contract

Approved panels control the full composition and visible state of their corresponding shots, including environment, blocking, relative depth and inventory. Asset references reinforce only their assigned identities/materials and never serve as scenes or keyframes.

Read [visual routing](visual-routing.md), [narration storyboards](narration-pairs.md) and [spatial fidelity](../../starling-cinematography/references/spatial-fidelity.md). Canonical script/audio control meaning and timing. Approved panels control actual composition and visible state. Asset references reinforce only their assigned identities/materials.

## Plan each shot from the inspected image

Write a concrete description of each actual picture in detailed_description, not just "follow the storyboard" or a summary of the story. Map the top, middle and bottom pictures to Shots 1, 2 and 3. For a clean dialogue scene, describe that single composition. Include the scene-relevant facts:

- Visible cast and count, including zero people; identity, expression, posture, gaze and left/right placement.
- Framing and camera side; relative depth, background landmarks, time of day and lighting.
- Visible objects and their states, positions, ownership, orientation and physical support. For documents, describe which way the pages face and how the book, papers and file lie on the table; for seated people, preserve their side of the table, chairs and spacing across cuts.
- The printed ACTION as a timed start, movement and final pose. Describe what visibly changes and what stays fixed; a broad emotion alone is not an action.
- The printed CAMERA instruction, separately from subject action, plus exact generated ranges, hard cut and settling buffers from the timing plan.
- The approved scene-master relationships: camera axis, named character screen sides, seating orientation, furniture dimensions/proportion, fixed landmarks, prop locations and lighting direction.

Select references using [the visible-inventory rules](reference-bundle.md). Include only relevant detail: an empty landscape needs landscape geometry and supported environmental movement, not facial, clothing or tabletop instructions. Required motion must be possible from the depicted pose and contacts. If the actual image, printed labels and saved plan disagree, repair/reconcile them before submission; do not conceal the mismatch by inventing content in the prompt. Source words and branch outcomes remain authoritative.

Movement stays within each shot and follows source meaning. Quiet object coverage may remain still. Human activity should be restrained and supported, not repeated gestures added to fill time. Preserve contact, balance, clearance, depth, scale and object orientation through the complete action. All unassigned background elements retain their approved state.

## Mode-specific prompt

Dialogue uses exactly one approved clean scene plus its accepted speech. Its camera remains a pixel-locked static tripod for the entire spoken line: zero camera movement, stabilization drift, automatic recentering/reframing or focal-length change. Any reframing is a blocking failure.

Every narration clip follows its mandatory fixed storyboard: exactly three related shots, each with a recorded semantic purpose. A single full-frame narration scene is invalid. A closer duplicate of the same table, people or object is not a new beat; advance supported action, expression, blocking or evidence instead. Dialogue uses exactly one approved clean scene plus its accepted speech.

Narration panels do not add unsupported human subjects, portraits or reactions. When narration precedes dialogue, record and inspect the final-panel-to-dialogue handoff: a silent shot of the same set (never the speakers face to face), same scene master, environment/time, lighting, camera axis, set geometry, prop state and character screen-position map. Narration after dialogue is mainly B-roll and subject action and needs no handoff with the preceding dialogue scene.

Both routes use the [reference template](animation-template.md) aligned with the live provider guide. Narration follows [storyboard planning](narration-pairs.md): three related full-frame shots and two measured hard cuts and relevant ordered refs. Caption strips guide production. Express the target positively. Dialogue retains approved speech and exact turn mapping. Save shot_inventory_match by comparing each written shot description, action and camera instruction against the corresponding actual picture and labels. Detailed prompting does not establish output fidelity; inspect all motion before acceptance.

## Complete review and targeted repair

After collection inspect the whole picture and sound against the approved plan, including action progression, spatial fidelity, intermediate contact, cut time, fixed framing, identity, branch outcome and absence of unintended overlays or speech. Save actual methods/time ranges and source/output hashes. Samples can locate a defect; they cannot pass a complete-motion check.

Use the Animation Pack's one-time scene-redesign rule after an initial visual failure: retain the script beat and approved style, generate and inspect different staging, then submit one EN2 Ultra replacement. Record the failed output, defect, redesigned scene's source/audio mapping, new image hashes, prompt and replacement ID under the same logical clip. A second failure stops for user review; do not loop through scenes, prompts or seeds. A provider error or unknown submission is not a visual failure: reconcile its status before any further action, without using it to reset attempt history. FFmpeg still-image animation replacements are disabled; preserve historical alternatives without selecting them for current production.
