# Starling skills used by Living Textbook

These are copies of the Starling production skills, taken unchanged from `darshansutar/starling-automation`. The source is the local checkout `Downloads/roleplay/github/starling-automation` at commit `dbed442` (2026-11-02), which is newer than GitHub `main` (`629f2a7`). The user asked on 2026-11-05 that Living Textbook use them directly: "take all the animation skill, director skill, image and panel corrector, production skill, prompt skill from starling workflow automation".

| Starling skill | Living Textbook stage that follows it |
|---|---|
| `starling-production-master` | `living-textbook-master`: stage order, roles, review gates |
| `starling-prompt-pack` (+ `references/handoff-contract.md`) | `lt-visual-plan`: shot plan, image prompts, `visuals/image-requests.json` |
| `starling-director` | `lt-visual-plan` / `lt-review`: meaning, staging and supported action per shot |
| `starling-cinematography` (+ `references/spatial-fidelity.md`) | `lt-visual-plan` / `lt-images` / `lt-review`: framing, geometry, scale, contact, continuity |
| `starling-image-pack-generator` | `lt-images` / `lt-stills`: Codex generation order, one clean picture per shot, collection and manifest |
| `starling-panel-corrector` | `lt-images` / `lt-stills`: inspection and exact repair instructions (`visuals/image-review.json`) |
| `starling-animation-pack` (+ references) | `lt-animation` / `lt-review`: six-section EN2 prompt, reference bundle, scene preservation, timing, one repair |
| `starling-auto-edit/references/rules.md` | storyboard shot count (B1) and the narration editing rules |
| `pipeline/storyboard.py` | composes every narration board: run `python starling/pipeline/storyboard.py compose SPEC.json` |

`pipeline/INTAKE.md`, `WORKFLOW.md` and `POSTPRODUCTION.md` are included so the skills' links resolve. Living Textbook keeps its own intake (`lt-intake`), runtime and edit scripts.

## What differs in Living Textbook

Where a Starling rule does not apply, the Living Textbook rule wins. Everything else is followed as written.

- **Narration only.** Characters never speak, so the dialogue route (clean dialogue scene, `ref_audios`, lip-sync, handoff to dialogue) is never used. Every clip is a narration storyboard clip.
- **Lessons, not branching roleplays.** The source is the NCERT chapter, `analysis.json`, `episodes.json` and `script.json`, not a Starling link. Branches, Bad Outcomes and retry nodes do not exist; votes and quizzes are player screens.
- **No text in pictures.** Option text, labels and numbers are drawn by the player.
- **Reference transport.** References are uploaded to EN2 directly with hash checks (`pipeline/en2_upload.mjs`). The MCP body limit is about 2 MB, so uploads are full-resolution JPEG copies (quality 95, no chroma subsampling) of the approved PNGs. Starling's Google Drive transport is not used yet.
- **Environment references must be clean.** EN2 copies every object it sees in a reference picture, so scene masters used as EN2 references show only the fixed set (no loose baskets, watering cans or pots). The objects come from the panels (lesson learned 2026-11-05).
- **Player.** Finished clips go into the generic Living Textbook player (`player/`), styled after the Starling rehearsal player.
