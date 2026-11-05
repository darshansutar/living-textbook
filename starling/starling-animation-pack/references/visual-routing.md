# Current visual routing

| Content | Images | EN2 inputs | Speech |
|---|---|---|---|
| Narration, including narrated establishing and endings | Mandatory fixed-format 1-3 shot board from `pipeline/storyboard.py` (shot count from narration length), 4-15 seconds; no character talks; every panel has a distinct source-supported purpose while preserving continuous geography | Visible characters, environment, visible props, storyboard last; Ultra quality=true | Accepted narration added during assembly |
| Speech-free filler, establishing and ending | One approved full-frame scene, or a fixed 1-3 shot storyboard when multiple shots are source-supported | Visible characters, environment, visible props, composition anchor last; Ultra quality=true | No speech |
| Dialogue | One approved clean full-frame scene derived from the scene master | Exactly that one scene ref plus approved ref_audios; Ultra quality=true | Existing speaker, turn and lip-sync workflow |

Follow [narration storyboard production](narration-pairs.md) and the [reference template](animation-template.md). Every narration clip uses exactly three storyboard shots. When the story remains in one scene, panels progress the supported action, expression, blocking or evidence without changing the established camera axis, screen positions, set, props, time or lighting. Labels guide generation and remain outside the finished picture. Preserve canonical order in mixed nodes, accepted speech, original media and paid IDs. Reconcile versioned manifests before reuse; a skill update does not authorize new renders.

Default planning/reference resolution is 1K-class. Record delivered dimensions and use 4K only when explicitly requested or justified by a reviewed downstream need. Before routing any panel, validate real-world action geometry as well as style and identity; reject impossible participant roles, directions, contacts or task sequences. Only the latest accepted version may enter manifests, Drive transport or EN2 inputs.
