# Buffered shot timing and visual review

This is the shared contract for Prompt Pack, image generation, panel correction, Animation Pack, Monitor and Verification. Apply it to new plans and replacements; preserve historical media and paid-job records.

## Plan the buffer before drawing

For every narration, filler, establishing or ending shot, record required edit duration and an additional 1–2 seconds of generated footage. Default to one second; use two when the planned action needs more settling room. Complete the required action within the required duration and use the buffer for a settled pose or the already approved restrained camera movement. Do not invent action, characters or objects to fill it. Dialogue timing remains tied to complete accepted speech.

Use one timing table as the source for the storyboard captions, animation prompt and render duration. Record each shot's required duration, buffer, generated start/end and action end, plus generated cut_times and assembly cut times separately. Printed SHOT | exact time | CAMERA | DEFINING ACTION labels must state the same ranges and action/hold plan used by the animation prompt. Metadata alone is not enough: inspect the actual printed labels. Any mismatch blocks submission.

General example: three equal semantic intervals produce Shot 1 from 0.00-4.00 seconds, Shot 2 from 4.00-8.00 seconds, and Shot 3 from 8.00-12.00 seconds, with hard cuts at 4.00 and 8.00 seconds. Each shot completes one defining action and settles within its own range. Actual timings come from the accepted audio cues and need not be equal. The approved narration stays at its original speed; do not stretch or compress it to fill generated footage.

Storyboard labels display exact sequential start-end times, including decimals when required by measured cues. The next shot starts exactly where the prior shot ends, with no gaps or overlaps. Use the same ranges and hard-cut times in the board, animation prompt, render plan and assembly mapping. Reserve any required settling hold inside the labelled range without shortening the defining action. Do not round accepted audio or assembly cues merely for display. Check current provider duration limits before submission and split longer coverage at a measured semantic cue into another board.

## Review each completed output

As soon as a clip is downloaded and technically readable, hand it to visual review against its exact approved panels, visible inventories, references and timing table. Continue accounting for other pending jobs. Initial ready submissions need not wait for each review. Provider completion and decode success do not imply visual acceptance.

Inspect the entire picture in motion, including buffers and transitions, with closer checks of suspicious intervals. Compare every shot: exact cast/count, identity and clothing; exact props and ownership; anatomy and separation; background and lighting; supported action/contact and object states; camera motion; spatial fidelity; shot order and hard-cut timing. Flag extra, duplicated or missing characters/objects, temporary appearances, merging or distorted bodies, invented content revealed by camera movement, ghosting, dissolves, mixed panels, labels and borders. Reference sheets supply appearance only; the approved scene inventory determines what is present. An empty insert remains empty.

Record visual_status as verified, needs_fix or unverified, with output hash, panel/shot, observed timestamp range, expected versus observed state and repair owner. Sampled frames or contact sheets support diagnosis but cannot certify complete motion. If full inspection is unavailable, retain unverified. These descriptive fields supplement existing runtime review fields; they do not bypass overall acceptance gates.

Lip-sync is the user's manual check. Record it separately with owner=user, exact output hash, verdict and the user's actual evidence. Do not fail or regenerate a visually correct clip merely because manual lip-sync is pending. Do not claim dialogue is fully verified or select it for final assembly until the user's check and other required checks pass. Full speech/content and audio routing checks still apply. Narration visual review does not require character lip-sync.

## Repair and recheck

For an observed visual defect, preserve the original and paid ID, record needs_fix and route the smallest source-faithful correction to the owning stage. Within authorized production, permit one automatic replacement per logical clip: simplify staging, correct and inspect the board/scene, use the reference-bundle repair procedure, rebuild prompt/indexes/timing and submit through a recorded runtime intent. Reinspect the complete replacement, not only the formerly defective region. A second visual failure stops for user review; new scene names do not reset the limit. Additional attempts require explicit user authorization. Review-only or collection-only scope does not authorize paid generation.

## Assemble the reviewed spans

For buffered narration, put source_spans in each assembly-plan clip, as ordered [start,end] pairs in generated-video seconds. The total retained duration must equal that clip's edit interval. Trim each shot's buffer independently, then join with hard cuts; truncating only the end of the whole render would leave the first buffer and cut off later coverage. Never use these spans to trim dialogue speech. Review the final cuts, all retained action and original narration after assembly. Instructions and local state validation do not install an unattended perceptual reviewer or scheduler.
