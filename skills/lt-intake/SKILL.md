---
name: lt-intake
description: Mandatory Living Textbook intake - ask for and record the script source, the style reference image and the narrator voice before any script building or generation.
---

# Living Textbook - Intake

Ask these three questions and wait for real answers before building the script or generating anything. Reuse answers already given for the same source and version.

1. **Script:** "Which script are we building from - a Google Doc, or a Starling roleplay link?"
2. **Style:** "Please share the style reference image (or a Starling link whose look we should match)."
3. **Narration:** "Which ElevenLabs voice (ID or name) should narrate?" If the script names a narrator voice, confirm it rather than assuming.

There are no character voices in this workflow. If the script contains dialogue, stop and ask whether to convert it into narration or to route that production to the Starling dialogue workflow.

## Reading the source

- **Google Doc:** read it through the Google Drive connector (`read_file_content` with comments). The doc is authoritative for words, choices, routes and feedback.
- **Starling link:** read the story through the Starling MCP, or the public story API (`https://starling.en2.ai/api/v1/stories/<slug>`) when MCP is unavailable. Save the JSON. Inspect its actual images (poster, option images) - a text description is not enough.
- **Style reference:** download it to `refs/`, look at it and write a one-paragraph style description (geometry, shading, palette, lighting, background treatment). The reference supplies **style only**: never take its character, face, identity or props into the production.

## Record

Save `intake.json` (template in `templates/intake.example.json`):

- `source`: kind (`google_doc` | `starling_link`), URI, local copy path and SHA-256
- `style`: reference path, SHA-256, the written style description, `"use": "style_only"`
- `narrator`: voice ID, name, model (`eleven_v3`)
- `cast_from_script`: the on-screen characters the script actually contains (often none)
- `answers`: the user's actual words or message references for each question
- `confirmed_by: "user"`, `status: "complete"`

Do not invent confirmations. Changed answers invalidate only the stages that depend on them.
