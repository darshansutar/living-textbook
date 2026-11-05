# EN2 submission and collection

Discover live EN2 upload, generation, status and reference-guide tools in the active session. Use the installed connector, not undocumented endpoints or extracted browser credentials. Local Python returns handoffs and cannot execute MCP calls.

## Before submission

Narration always uses the mandatory storyboard method: `visual_format=storyboard_1x1`, `storyboard_1x2` or `storyboard_1x3` with the matching `shot_count` and one measured cut time between shots. A single-scene narration plan is invalid. Every panel must have a distinct source-supported purpose while preserving continuous scene geography and the required dialogue-boundary handoffs. Dialogue uses `visual_format=dialogue_scene`, exactly one approved clean-scene ref, accepted ref_audios, and a passed scene-continuity record containing scene-master hash, camera side and named screen positions.

Reference transport is Drive-backed: confirm `darshan@en2.ai`, preserve the original image, record Drive file ID/fetchable URL/hash, upload through EN2, and visually compare the returned upload with the original. Use returned upload names in character, environment, visible-prop, composition-anchor order. Do not replace an approved storyboard/scene input with an extracted video frame.

Check completed intake, source/audio acceptance, inspected images, spatial/director/cinematography reviews and measured timing. Save shot_inventory_match and real uploaded-byte evidence. Follow [routing](visual-routing.md).

Narration plans use visual_format storyboard_1x1, storyboard_1x2 or storyboard_1x3 with the matching shot_count and shot_count - 1 measured cut_times inside the generated interval. Follow [buffered timing and visual review](timing-and-visual-review.md); storyboard labels and prompt must share the same generated ranges, action/hold durations and hard cut. Select only the applicable groups under [scene-matched reference selection](reference-bundle.md), with per-shot visibility and rebuilt indexes; use refs and the reference template. Verify the concrete description of each panel and its labelled action/camera/timing against the actual image before submission. Keep narration external. Dialogue retains visual_format=dialogue_scene, refs and accepted ref_audios, explicit speaker/turn mapping and current reference prompting. Record actual reference_seconds and live provider limits. All requests use Ultra quality=true. Local manifest fields stay outside the API payload.

Budget 1–2 seconds per narration/establishing shot before drawing or prompting, completing each action in its required interval and reserving its buffer as a hold. Submit whole-second render durations within live limits, recording extra rounding hold separately. Split/replan if the buffered total exceeds the limit. Preserve required edit timing and ordered source_spans in the manifest; do not confuse a per-shot buffer with rounding only at the end of the whole render.

## Submit all ready once

Honor an explicit user-selected rolling handoff: when the user asks to submit each completed pair immediately, inspect and accept that pair, record its intent, submit once, and continue image generation without waiting for that video's completion. Record the requested policy in project history. A generated pair with unresolved defects is not ready. Existing paid jobs remain tracked; changing submission cadence does not resubmit them.

Call prepare-render per approved clip, save its intent, invoke the exact returned connected tool once, then record the real provider ID immediately. Submit in canonical order respecting service capacity. There is no review hold between initial groups. Input acceptance, duplicate prevention and repair limits still apply. Hold uncertain submissions and reconcile history instead of submitting again.

## Collect then review

Poll known scoped IDs during the active session, save real snapshots and download complete outputs atomically. Retain pending jobs and explicit failures; an omitted job is not failed. Retry downloads without regenerating. Once the initial scoped pass is accounted for, verify every available complete video and repair failures. Unresolved jobs block final completion but need not prevent inspection of available files. Preserve all attempts and real paid IDs.

Use an explicit runtime_clip_id per assembly clip; reconcile source hashes, timelines and retained dialogue before attaching a new production scope. Never infer ID migrations. Follow pipeline/POSTPRODUCTION.md for complete review and stitching. Background polling requires a demonstrated runner; all-ready submission alone is not monitoring.
