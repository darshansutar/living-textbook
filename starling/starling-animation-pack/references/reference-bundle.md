# Scene-matched animation references

Inspect the actual storyboard pictures or clean dialogue scene before choosing references. Attach only references needed by the visible inventory. The storyboard controls staging and action; appearance references do not add occupants or objects.

| Visible content | Reference selection |
|---|---|
| One character | Only that character's approved sheet, matching environment, relevant visible prop sheets and storyboard or clean scene |
| Multiple characters | Only the sheets for those visible characters, matching environment, relevant visible prop sheets and storyboard or clean scene |
| Environment only | Matching environment and storyboard; omit character and prop sheets. Describe the visible landscape, fixed structures, lighting and supported environmental movement. |
| Person-free prop/document insert | Matching environment or surface, relevant prop sheets and storyboard; omit character sheets. An insert of a book or file is not an environment-only shot. |

Preserve this order among the applicable groups: visible character sheets in stable cast order, matching environment, relevant visible prop sheets, then the composition authority last. The composition authority is the approved scene master or previous approved panel during panel generation, and the approved full-frame scene or storyboard during animation. Appearance references provide identity and material only. They never override seating, left/right placement, camera side, relative depth, environment, furniture geometry or object layout, and they are never candidate scenes or keyframes. Omit absent groups rather than supplying unrelated context sheets. A sheet, turnaround, neutral-background group or prop plate must never appear as a rendered shot.

Dialogue animation is the strict exception: pass exactly one approved clean full-frame dialogue scene plus accepted reference audio and speaker/turn mapping. Do not also attach character sheets, environment sheets, props or a storyboard; the clean scene already resolves those facts. A source-required off-screen speaker supplies audio without adding a visual character.

## Google Drive transport

Store each approved original reference in Google Drive under the confirmed `darshan@en2.ai` connection. Record the Drive file ID, a fetchable HTTPS image URL, original filename and SHA-256. Send that URL through the EN2 media uploader, record the returned upload name, and visually compare the uploaded result with the approved original before any paid batch. A Drive preview page is not an image. Do not convert or recompress a reference merely to make transport succeed. The EN2 payload uses the returned upload names in the same role order recorded above.

Save one transport record per input: role, Drive file ID/URL, local hash, EN2 upload name, upload evidence and visual-match verdict. Rebuild Picture/Subject indexes after any omission or reorder.

References apply to the entire render request. For a multi-shot clip, take the union of the visible identities and relevant props across all its pictures and explicitly record visibility per shot. A character visible only in Shot 1 supplies a reference for Shot 1, not permission to appear in an empty Shot 2. Separate requests use their own inventories; do not inherit the whole scene's cast. Keep the approved shot timing unless a source-supported replan is needed.

For first submissions, approved sheets may be used for selected visible characters and props only as identity/material references. A sheet's multiple views describe one identity/object, never multiple occupants or a scene. Reuse suitable assets; generate and inspect a missing reference only when the visible scene needs it. The repair exception below allows scene-specific individual references after an incorrect animation output.

Save ordered roles, filenames, hashes, upload names and per-shot visibility. After any attachment change, rebuild all Picture/Subject indexes and remove definitions and prose for omitted subjects. Check every prompted identity/object against the actual pictures. If the selected bundle exceeds the provider limit, consolidate compatible references or split at a source-supported cue while preserving coverage and timing. Preserve already-submitted payloads and paid IDs; a revised reference plan does not alter a queued job or authorize a duplicate.

## Scene master and panel continuity

Before the first panel of a continuous location, approve a full-frame scene master that fixes room/landscape geometry, furniture dimensions and orientation, character seats or standing marks, camera side, background landmarks, prop locations and lighting direction. Record a stable screen-position map. Generate the first panel from visible character references, environment, relevant props and the scene master last. Generate later panels from the same required appearance references with the previous approved panel or scene master last as composition anchor.

Do not mirror or swap characters between panels. A speaker does not move to the preferred side or centre merely because their turn begins. Change only the source-required expression, gesture or action. Reject a panel before animation if it crosses the camera axis, changes seating orientation, resizes furniture without perspective justification, moves fixed props/background landmarks, or breaks the recorded screen-position map.

## People standing together

Stage adjacent people with a clear visible gap between their shoulders, torsos, arms, hips and feet. Give each a separate standing position and enough room for the planned gesture. This applies to every pairing, including a woman and a man. Preserve believable conversational distance, eyelines and shared perspective. Intentional contact must be supported by the script and explicitly staged. Check both storyboard pictures and the entire animation for merged silhouettes, body intersections or loss of the planned gap.

## Repair-only individual references

When inspection of a generated animation identifies an incorrect output, record needs_fix, the visible defect and the original job ID. For that failed clip, generate and inspect scene-specific single-character references, individual prop references and a matching environment from the approved sheets, style and script. Keep identity, costume, object state, scale, lighting and layout consistent. Use only subjects relevant to the inspected storyboard; a new reference does not add a subject to the scene.

Select the repair bundle by the same visible-inventory rules above, using individual references only when they cannot be misread as full scene compositions, and keep the applicable groups in order. Prefer scene-matched full-frame references and a simplified storyboard-first bundle when prior output promoted a sheet into a scene. Dialogue retains exactly one clean scene as its full-frame visual plus accepted speech and turn mapping. Correct the storyboard when it contains the defect, then analyze it again and rewrite the affirmative animation prompt against the actual replacement images. For narration, compare every generated shot to the corresponding storyboard panel; the final shot must match the final storyboard panel, never a group reference. Rebuild Picture indexes, record reference hashes and preserve originals and paid-job IDs.

This exception is only for a reviewed failed output, not routine first generation. It uses the existing single repair attempt; it does not add another automatic retry cycle. Review the complete repaired picture and sound. If it remains incorrect, retain needs_fix and report it rather than continuing automatic regeneration. Review-only skills identify the repair and route it to production; they do not generate media.
