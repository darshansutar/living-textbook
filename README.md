# Living Textbook

An automation workflow that turns a finished lesson script into a **narrated, animated, interactive roleplay** for the Starling player. It is the [Starling automation](https://github.com/darshansutar/starling-automation) storyboard method, adapted for narration-only educational content:

- **No dialogue.** Every clip is narration over picture: no speaking characters, no lip-sync.
- **Storyboards, not code.** Science content (stomata, cells, experiments) is made with the standard Starling storyboard method: Codex images, labelled black-and-white 1x2/1x3 boards, EN2 Ultra animation.
- **Static roleplay images.** The cover page and one text-free picture per answer, reason, confidence level and check question, mapped in `roleplay.json`.

```
Intake -> Script -> Narration audio -> Visual plan -> Assets -> Storyboards -> Static images
       -> Animation prompts -> EN2 Ultra renders -> Review (re-time / one repair) -> Edit + stitch -> ZIP
```

Full explanation: [docs/Living_Textbook_Workflow.pdf](docs/Living_Textbook_Workflow.pdf) and [docs/WORKFLOW.md](docs/WORKFLOW.md). Each skill is also exported as a Word document in [docs/skill-documents](docs/skill-documents).

## Contents

| Path | What it is |
|---|---|
| `skills/` | 10 skills: master, intake, script, audio, visual plan, images, static images, animation, review, assembly |
| `pipeline/` | Tested scripts for every mechanical step (below) |
| `templates/` | intake / script / plan examples and prompt templates for Codex (assets, panels, static images, audio) and EN2 |
| `examples/stomata-pilot/` | The first pilot: plan, prompts, boards list, job IDs, cut detection, review and edit plan (text only) |
| `docs/` | Workflow PDF, workflow markdown, skill Word documents |

## Providers

| Need | Provider |
|---|---|
| Images: assets, storyboard panels, cover and option images | Codex native image generation (`codex exec`) |
| Narration | ElevenLabs `eleven_v3` through Codex's connected ElevenLabs app |
| Animation | EN2 reference-to-video, Ultra (`quality=true`) |
| Edit | FFmpeg |

## Pipeline scripts

| Script | Stage | Does |
|---|---|---|
| `codex_run.py` | images, audio | Runs one Codex step with a prompt file and attached references, sandboxed to the project |
| `harvest_audio.py` | audio | Downloads the ElevenLabs files Codex generated (Codex's sandbox cannot), measures durations and pauses |
| `assemble_boards.py` | storyboards | Stacks panels and prints SHOT/time/CAMERA/ACTION strips from `plan.json` |
| `en2_upload.mjs` | animation | Uploads references to EN2 through its MCP; upload names are checked against SHA-256 |
| `en2_collect.mjs` | animation | Polls EN2 jobs and downloads finished renders |
| `review_cuts.py` | review | Detects real cut times, flags drift, writes timestamped frame sheets |
| `build_edit.py` | assembly | Builds edit spans from the observed cuts so every shot covers its narration |
| `assemble_edit.py` | assembly | Trims, joins and lays the narration under each clip; optional cover opener; final video |
| `package.py` | delivery | Writes `roleplay.json` and the delivery ZIP with a SHA-256 manifest |

## Setup

1. Python 3.10+ with Pillow (`pip install pillow`), Node 18+, FFmpeg and ffprobe on PATH.
2. Codex CLI signed in, with image generation and the ElevenLabs app connected, and the EN2 video MCP configured (`[mcp_servers.en2_video]` in `~/.codex/config.toml`, or set `EN2_MCP_URL`). The MCP URL contains a personal token: never commit it.
3. An assistant session (Claude Code or Codex) with the EN2 video MCP for `video_generate` / `video_status`, and the Google Drive connector to read script documents.
4. Read `AGENTS.md` and `skills/living-textbook-master/SKILL.md`.

## Start a production

```
mkdir projects/<slug>            # media stays out of Git
copy templates/*.json projects/<slug>/
# then follow skills/living-textbook-master/SKILL.md stage by stage
python pipeline/codex_run.py --project projects/<slug> --prompt prompts/codex-audio.md --name audio
python pipeline/harvest_audio.py --project projects/<slug> --name audio
...
python pipeline/package.py --project projects/<slug>
```

## Pilot results (3 Nov 2026)

"Do Plants Eat Soil?" explanation lines, faceted low-poly style, no characters. Three EN2 Ultra clips (stomata 11 s, chlorophyll 12 s, oxygen 7 s) followed their boards with clean hard cuts, correct layouts and no leaked storyboard text. EN2 placed one cut 2.25 s early; `build_edit.py` re-timed the spans and no repair render was needed. Details in `examples/stomata-pilot/`.
