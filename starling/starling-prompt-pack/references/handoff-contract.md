# Shared production handoff

Read [mandatory intake](../../pipeline/INTAKE.md), [visual routing](../../starling-animation-pack/references/visual-routing.md) and [spatial fidelity](../../starling-cinematography/references/spatial-fidelity.md). Keep requirements in those owning references rather than copying alternate rules into skills.

## Authority and IDs

Canonical source controls words, cast, choices, routes and outcomes. Accepted audio controls measured timing. Approved style and scene images control visual identity/composition. Preserve node/branch/line/asset/board/panel/clip IDs. Source roleplay retrieval includes all available content. A finalized document remains authoritative over a style-reference roleplay.

## Durable artifacts

Record intake, source snapshot/hash and coverage ledger; native Docs ID/account/readback; audio manifests/cues; full asset inventory; shot plan; image manifests/panel boxes; prompt/payload files; actual uploaded names/hashes; render intents/provider IDs; output hashes; full review evidence; assembly plan and selections. Track source offsets separately from assembly positions. Store the underlying files, not only manifests pointing to untracked artifacts.

Use pending, needs_fix, unverified, verified, blocked or stale with concrete evidence. Passes bind exact file versions and inspected scope. Changed sources invalidate affected acceptance while preserving history and paid IDs. The runtime conservatively invalidates dependent stages; reviewers decide valid reuse explicitly.

## Current production order

Completed intake -> source-faithful script -> accepted measured audio -> buffered visual plan -> reviewed assets/boards/scenes -> animation preflight -> submit all ready once -> collect and review each completed output -> targeted EN2 repairs -> re-review -> node stitching -> final review/ZIP. Follow [buffered timing and visual review](../../starling-animation-pack/references/timing-and-visual-review.md) for identical storyboard/prompt timings, generated versus edit clocks, per-shot source_spans and the separate user-owned manual lip-sync verdict.

Foundational assets pass before dependent scenes. All narration storyboard pictures, below-picture labels and shot mapping pass before animation. Relevant refs are mapped explicitly; only dialogue passes speech to EN2. Raw narration review and final assembled-audio review are distinct. Complete output review cannot be replaced by sampled frames, metadata or provider completion.

## Branch-aware assembly

Use canonical graph/node order, not filename order. Preserve original speech speed, all words/pauses and mapped turns. Keep Bad Outcomes and mutually exclusive endings separate; UI choices/buttons stay in the graph. Preserve true outcome states and useful opening/closing coverage. Stitch accepted EN2 outputs only; FFmpeg is an editing/export tool, not an animation replacement. Final package requires every required branch and join reviewed.

Existing projects require a versioned assembly-manifest reconciliation before using new IDs. Record runtime_clip_id explicitly for each assembly clip, source hashes, input files, audio units, used duration and output selection. Never infer a renamed clip from a similar filename.
