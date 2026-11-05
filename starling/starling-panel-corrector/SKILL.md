---
name: starling-panel-corrector
description: Inspect and repair Starling assets, labelled narration storyboards and dialogue scenes for source fidelity and physically plausible geometry.
---

# Starling Panel Corrector

**Owner:** Claude reviews and writes repair instructions; ChatGPT performs the image edits through `codex exec`. See [roles and handoff](../starling-production-master/SKILL.md#roles-and-handoff).

Apply [buffered timing and visual review](../starling-animation-pack/references/timing-and-visual-review.md) for storyboard/prompt timing, per-output visual checks, bounded repair and the user-owned manual lip-sync check.

Follow the [scene-matched reference selection](../starling-animation-pack/references/reference-bundle.md), including its failed-output repair exception.

Read [visual routing](../starling-animation-pack/references/visual-routing.md) and [spatial fidelity](../starling-cinematography/references/spatial-fidelity.md). Compare the actual image against canonical source, approved style/assets and shot plan. Review-only invocation returns findings; image edits require an authorized production/repair scope and completed intake.

Inspect the complete asset/scene and all storyboard pictures and labels of each narration clip. Enlarge uncertain details. Check identity, visible cast count, wardrobe/accessories, anatomy, hands, props, ownership, set/light, expression, action readiness and branch state. Apply every applicable spatial check: scale/proportion, perspective/depth, separation/clearance, support/contact, orientation/construction, occlusion and continuity. Different viewpoints can legitimately change apparent size and visible faces.

Check picture-area dimensions, top-to-bottom shot order, readable SHOT/time/CAMERA/ACTION labels below each picture, matching metadata and action-ready staging. Check that artwork contains no arrows or motion symbols. A source-supported action must be possible from the pictured staging. Reconcile mismatches among the picture, printed ACTION/CAMERA labels and the detailed animation description before submission; correct the defective source rather than describing an imaginary fix in the animation prompt. Source image quality and completed animation quality are separate gates.

Record exact file hash, panel/region, observed versus expected state, severity and smallest repair. Write each repair as an exact edit instruction in `visuals/image-review.json`; ChatGPT performs it through `codex exec` with the defective version and relevant references attached, preserving correct content. Reinspect the entire corrected board/scene and rerun affected Director/Cinematography checks. All pictures, label accuracy and shot-continuity checks must pass. Bound repairs to observed defects; report unresolved problems rather than polishing indefinitely.

Save panel_qa.json and version lineage; update affected manifests and invalidate dependent prompts for review without changing or resubmitting existing paid jobs. Do not rewrite speech or outcomes to accommodate a visual defect.

Follow [narration storyboard production](../starling-animation-pack/references/narration-pairs.md) for audio-led beat coverage, the fixed 1-3 shot board layout, exact caption fields, one defining action per shot and source-faithful continuity.
