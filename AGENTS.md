# Living Textbook workspace

For production requests read `skills/living-textbook-master/SKILL.md`, then the owning stage skill in `skills/`. Visual planning, images, panel review and animation follow the Starling skills copied in `starling/` (mapping and Living Textbook differences: `starling/README.md`). `docs/WORKFLOW.md` summarises the flow.

- Input is an NCERT chapter PDF (any subject, Classes 5-10). Run intake (chapter, class/subject, region, style) before anything else; ask the narrator voice at the audio stage.
- Analyse the whole chapter, plan episodes as simple topic loops (story video, vote, answer video, check; every screen narrated), and **stop for the user's approval of `episodes.json`** before scripting or generating anything.
- NCERT first: every concept, activity and end question is covered in book order; facts never exceed or contradict the chapter.
- Rooted in rural India: hooks, names, places, crops, food and objects from the chosen region.
- The episode plan decides the cast. Characters are original, regionally accurate and **never speak**; a style reference supplies look only.
- No text, letters or digits in any generated picture or video; the player draws numbers, labels, equations and option text.
- Every vote and MCQ distractor is a real student misconception from `analysis.json`.
- Images: Codex native image generation via `pipeline/codex_run.py`. Narration: ElevenLabs `eleven_v3` via Codex, downloaded by `pipeline/harvest_audio.py`. Animation: EN2 reference-to-video, Ultra only. Edit: FFmpeg. Labs (interactive NCERT activities and Maths manipulatives): three.js + GSAP, objects built in code (`skills/lt-lab`, `docs/LAB_WORKFLOW.md`). Do not substitute providers; story and answer visuals are never built in code.
- One timing table (`plan.json`) drives board captions, prompts, render length and edit spans.
- Inspect everything you generate before anything depends on it; never claim listening or review you did not do.
- Record every paid job ID, submit each clip once, never resubmit a slow job, keep rejected media and IDs.
- Re-time to observed cuts before calling a repair; one repair render per clip, then stop for the user.
- One generic player for every chapter (`chapter.json` contract in `skills/lt-package/chapter-schema.md`); never change the player for one chapter.
- Productions live in `projects/` (ignored by Git). Never commit media, credentials or the EN2 MCP URL.
- Building or editing this infrastructure does not authorize a production run.
