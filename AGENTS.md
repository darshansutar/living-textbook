# Living Textbook workspace

For production requests read `skills/living-textbook-master/SKILL.md`, then the owning stage skill in `skills/`. `docs/WORKFLOW.md` summarises the flow.

- Ask the three intake questions (script, style reference, narrator voice) and record real answers before building or generating anything.
- The script decides the cast. A style reference supplies look only - never its character. A science script with no characters gets no people anywhere.
- Images: Codex native image generation via `pipeline/codex_run.py`. Narration: ElevenLabs `eleven_v3` via Codex, downloaded by `pipeline/harvest_audio.py`. Animation: EN2 reference-to-video, Ultra only. Edit: FFmpeg. Do not substitute providers and do not build animation in code.
- One timing table (`plan.json`) drives board captions, prompts, render length and edit spans.
- Inspect everything you generate before anything depends on it; never claim listening or review you did not do.
- Record every paid job ID, submit each clip once, never resubmit a slow job, keep rejected media and IDs.
- Re-time to observed cuts before calling a repair; one repair render per clip, then stop for the user.
- Productions live in `projects/` (ignored by Git). Never commit media, credentials or the EN2 MCP URL.
- Building or editing this infrastructure does not authorize a production run.
