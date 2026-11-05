---
name: starling-cinematography
description: Plan and verify Starling shot geometry, perspective, scale, physical contact and continuity across narration storyboards and complete video.
---

# Starling Cinematography

**Owner:** Claude, for planning and for image and prompt review. Complete video review belongs to the user; Claude records the user's verdicts. See [roles and handoff](../starling-production-master/SKILL.md#roles-and-handoff).

Apply [buffered timing and visual review](../starling-animation-pack/references/timing-and-visual-review.md) for storyboard/prompt timing, per-output visual checks, bounded repair and the user-owned manual lip-sync check.

Follow the [scene-matched reference selection](../starling-animation-pack/references/reference-bundle.md), including its failed-output repair exception.

Read [visual routing](../starling-animation-pack/references/visual-routing.md), [narration storyboards](../starling-animation-pack/references/narration-pairs.md) and the authoritative [spatial fidelity checklist](references/spatial-fidelity.md). Own framing, geometry, depth and shot continuity. Preserve source meaning and approved design.

Record output aspect/dimensions and all illustrated picture-area boxes separately from caption strips. Every narration clip uses 1-3 related compositions in the fixed-format board built by `pipeline/storyboard.py` (1024 wide, one 1024 x 464 picture per shot above an identical ivory caption strip; 1, 2 or 3 shots chosen from the narration length, see [auto-edit rules](../starling-auto-edit/references/rules.md) B1); a single full-frame narration scene is invalid. Camera/action/time labels sit below storyboard pictures. Final video displays each picture as an edge-to-edge colour shot with a direct hard cut. Dialogue is one clean full-frame scene. Verify geometry on actual files.

For quiet narration prefer a slow zoom-in of about 3-5 percent; use a small pan only within established scene content. Preserve subject/object states within each shot. Keep time of day, sky colour, sun position, exposure and shadow direction/length constant unless a source-supported transition is planned. Reject day/night cycling or lighting drift during otherwise continuous shots.

Choose useful shot sizes/angles, clear introductions and readable relevant detail. Maintain room axis, eyelines, screen direction, proportional scale, depth ordering, movement clearance and supported body/object contact. Different viewpoints may change apparent size legitimately; compare actual reference geometry and perspective. Preserve coherent front/back object faces and occlusion.

Approve a scene master before related panels. Keep named characters on their recorded screen sides, preserve chair/table orientation and scale, and keep the camera on the established side of the axis unless the script shows a motivated crossing. A speaking turn never authorizes a side swap or mirrored panel. Reject furniture growth, inconsistent sitting direction and changed background geometry during image review.

Every storyboard panel needs a distinct source-supported purpose: progression of the same action, a meaningful expression or blocking change, important evidence/object, environment detail, or a supported location/time change. In one location, keep the established camera axis, screen positions, set, props, time and lighting while panels advance supported action. Do not introduce an unsupported human subject, portrait or reaction. Do not cut from a table composition to a closer duplicate of the same table merely to fill a panel. Permit a detail insert only when it reveals script-supported evidence and preserves spatial orientation on return.

For narration immediately before dialogue, compare the final narration panel and clean dialogue scene side by side. Require a silent final panel of the same set (a detail, an establishing view or a character from behind) with the same scene master, environment/time, lighting, camera axis and set/prop state; it never shows the speakers face to face, because EN2 animates that pose as speech, and the dialogue clip's own wide shot opens the conversation; reject side swaps, mirrored staging or set redesign. Narration after dialogue needs no handoff with the preceding dialogue scene and is mainly B-roll and subject action; a panel that returns to the dialogue location keeps its established geography.

For subject action, keep the camera fixed unless another move is explicitly planned. For quiet narration without subject action, use the subtle camera-only move defined in storyboard planning; preserve scene geometry and object states. A narration board defines three full-screen shots, each with a distinct purpose at its measured hard cut. Keep scene geometry and identities coherent across views. In the [detailed shot description](../starling-animation-pack/references/scene-preservation.md), state the actual camera side, seating/left-right relationships, depth, prop orientation and support. Prefer top-down coverage for document-only inserts when it makes the layout clearer; pages face their intended reader. Put matching action timing in the below-picture labels, metadata and animation prompt. Verify full-frame presentation: fades, overlays, borders, mixed panels and printed labels are defects.

Review all pictures, labels and their relationship, then complete animation for camera stability, timing, spatial continuity and physically plausible movement. Sampled frames cannot establish whole-clip correctness. Record cinematography_review.json with source/output hashes, dimensions, shot roles and picture boxes, actual inspected intervals, findings and minimum corrections. Repairs return to the owning production skill.
