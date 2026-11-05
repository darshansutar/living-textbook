# Mandatory production intake

Applies before script building, audio generation, image generation or video submission, including direct specialist invocation. Infrastructure edits and read-only reviews do not start this intake. Ask the questions below and wait for explicit answers. Existing answers for the same source/version count; do not ask again at every stage.

1. **Source:** Are we building from a Starling roleplay link, or following your finalized script document?
2. **Style:** For a source roleplay link, shall we use its actual visual style and references? For a finalized document, please provide a style reference image or a Starling reference link.
3. **Voices:** Which ElevenLabs voice ID or voice name should each speaking character and narrator use? If reusing final recordings, explicitly confirm that choice instead. For a genuinely silent source, explicitly confirm no speech.

Read-only intake inspection of the supplied document or Starling source is permitted to identify the complete cast and retrieve style evidence. If the cast is not yet known, ask the initial voice question, inspect the source, then present the complete speaker list for the user to map. Do not build the script or generate media before the required responses are complete. A request for a voice name is not permission to choose a similar voice: resolve it through ElevenLabs; clarify multiple matches.

## Source authority

- `starling_link`: use Starling MCP to retrieve the complete available source, including every beat, branch, choice, recovery lane, consequence, ending, cast entry and visual reference. Save actual responses and IDs. Resolve pagination or linked content. Inspect the actual style images; text descriptions alone are insufficient. Report missing/inaccessible source elements rather than inventing them.
- `finalized_document`: keep the document's words, speakers, scenes, choices and routes authoritative. A supplied Starling reference provides style and relevant beat/visual context. Map that context to the document; resolve conflicts with the user instead of importing another story. A style image alone does not supply additional story events.

## Recorded gate

Save `intake.json` with `schema_version: "1.0"`, `mode`, `source`, `style`, `speakers`, `voices`, `audio_mode`, `answers`, `confirmed_by: "user"` and `status: "complete"`.

- `source`: user-supplied URI/path plus hashed local source/inspection artifacts in `artifacts`.
- `style`: `kind` (`starling_link` or `reference_image`), URI/path, and at least one inspected local image artifact with `path` and `sha256` in `artifacts`.
- `speakers`: complete unique speaking IDs, including narrator when applicable.
- `voices`: one entry per speaker with `speaker_id`, `selection_type` (`id` or `name`), `requested` and `resolved_voice_id`; or `selection_type: "recording"`, `requested` identifying the explicitly selected final recording.
- `audio_mode`: `generate`, `supplied` or `silent`. Mixed supplied/generated speech uses `generate` with per-speaker recording entries where applicable.
- `answers`: `source`, `style`, `voices` containing actual user instructions or conversation references, not invented confirmation.

Record with `python pipeline/runtime.py --project PROJECT intake PROJECT_RELATIVE_JSON`. The runtime checks structure, file hashes and speaker coverage, not whether a human truly answered or an image was inspected. The active host owns that evidence. Changes require renewed answers only for affected choices. Changed source identity requires reconciliation of cast and routes.

The production master owns intake orchestration. Script Rebuilder consumes the completed record and produces script artifacts. Audio Pack owns voice resolution and speech. Visual skills consume approved style references. All generation entry points must check the same record.
