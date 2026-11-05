# Physical plausibility and spatial continuity

Maintain physically plausible scene geometry and spatial continuity. People, objects and environments must have consistent proportions, perspective, orientation, depth ordering, clearance and supported contact. Solid surfaces remain distinct, with correct visible and hidden faces. Preserve these relationships across related storyboard shots and throughout animation; changes must follow the planned action and viewpoint.

## Required checks

| Check ID | Inspect against source references and shot geometry |
|---|---|
| scale_proportion | Human/object/environment size relationships, allowing actual large objects and perspective-induced apparent size differences |
| perspective_depth | Camera viewpoint, planes, relative distances, screen placement and consistent perspective within each shot |
| separation_clearance | Distinct solid geometry and adequate space for bodies, furniture, equipment and required movement |
| support_contact | Credible weight, seating, grounded feet, hand grips and attachment; contact changes follow the planned action |
| orientation_construction | Correct front/back faces, handedness, hinges, joints, clothing/accessories and object construction |
| occlusion_order | Near surfaces correctly hide farther ones; hidden surfaces appear only with justified viewpoint or orientation changes |
| spatial_continuity | Consistent identities, proportions, ownership, state and screen relationships across cuts and throughout motion |

Plan only scene-relevant relationships in prompts. Review all applicable checks on the actual output; explain genuinely inapplicable checks. A different shot may change apparent size and visibility legitimately. Judge against camera depth and actual object proportions, not a universal human-to-object pixel ratio. Do not force realistic proportions where an approved style deliberately exaggerates them; preserve the approved design consistently.

Examples explaining the general rule: a seated person is supported by the chair with credible clearance beneath the table; solid furniture does not pass through the body. A large machine and nearby worker retain their reference scale and correct depth relationship. A held object's rear face does not display its hidden front content; its grip and orientation remain consistent. These examples do not restrict the check to those objects.

Record panel/region or actual video time range, source/output hashes, observation, expected relationship, verdict and smallest correction. Full-motion acceptance requires complete playback; samples can demonstrate a defect but cannot certify a whole clip.

Terminology references: [Adobe perspective, occlusion and relative size](https://helpx.adobe.com/after-effects/desktop/work-with-3d-composition/stereoscopic-3d/stereoscopic-3d-effects.html), [Adobe reference for scale](https://lightroom.adobe.com/academy/principles/composition/scale-reference), [Autodesk collision and interpenetration](https://help.autodesk.com/cloudhelp/2022/ENU/Maya-SimulationEffects/files/GUID-76020851-DBB2-40F3-8BDF-0561976D519A.htm). The checklist combines these established concepts for this workflow; it is not one formal cinematography standard.

For adjacent people, require clearly separated body silhouettes, distinct standing positions and gesture clearance in every storyboard picture and throughout motion. See [reference bundle and spacing](../../starling-animation-pack/references/reference-bundle.md).
