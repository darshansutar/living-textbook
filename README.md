# Living Textbook

Turns an **NCERT chapter PDF** (any subject, Classes 5-10) into an interactive, narrated, animated lesson that a teacher projects to the class. Each chapter becomes a short series of episodes; each concept is taught with one of three flows (**Story**, **Challenge**, **Wonder**): a real rural-Indian hook, a class vote, the NCERT explanation and a check. Activities run as live do-alongs, on-screen simulators or take-home missions. One generic HTML player plays every chapter.

```
Chapter PDF -> Analyse -> Episode plan -> [approval] -> Script -> Activities -> Narration -> Visual plan
           -> Assets + storyboards -> Stills -> EN2 Ultra -> Review -> Edit -> chapter.json + player -> ZIP
```

Design: [docs/Living_Textbook_Flow_Report.pdf](docs/Living_Textbook_Flow_Report.pdf) · Pipeline: [docs/WORKFLOW.md](docs/WORKFLOW.md) · Agent rules: [AGENTS.md](AGENTS.md)

## Contents

| Path | What it is |
|---|---|
| `skills/` | 14 skills: master, intake, chapter analysis, episode plan, script (+ `flows.md`), activities, audio, visual plan, images, stills, animation, review, assembly, package (+ `chapter-schema.md`) |
| `pipeline/` | Scripts for the mechanical steps (below) |
| `player/` | The one generic offline HTML player (`index.html`, `player.js`, `player.css`) - copied unchanged into every package |
| `templates/` | Example `intake`, `analysis`, `episodes`, `script`, `plan`, `chapter` JSON and Codex / EN2 prompt templates |
| `docs/` | Design report (PDF + HTML source) and workflow summary |

## Providers

| Need | Provider |
|---|---|
| Chapter text and page pictures | PyMuPDF (`extract_chapter.py`) |
| Images: character sheets, scenes, sheets, storyboards, stills | Codex native image generation (`codex exec`) |
| Narration | ElevenLabs `eleven_v3` through Codex's connected ElevenLabs app |
| Animation | EN2 reference-to-video, Ultra |
| Edit | FFmpeg |

## Pipeline scripts

| Script | Stage | Does |
|---|---|---|
| `extract_chapter.py` | intake / analysis | Chapter text per page, page pictures, outline of sections, activities, figures, NCERT boxes |
| `codex_run.py` | images, audio | Runs one Codex step with a prompt file and attached references |
| `harvest_audio.py` | audio | Downloads the ElevenLabs files Codex generated, measures durations and pauses |
| `assemble_boards.py` | storyboards | Stacks panels and prints SHOT/time/CAMERA/ACTION strips from `plan.json` |
| `en2_upload.mjs` / `en2_submit.mjs` / `en2_collect.mjs` | animation | Hash-checked uploads, submission, polling and download |
| `review_cuts.py` | review | Real cut times, drift flags, frame sheets |
| `build_edit.py` / `assemble_edit.py` | edit | Spans from observed cuts; narrated (or silent wonder) clip segments; one file per video screen in `output/screens/` |
| `build_chapter.py` | package | `script.json` + measured narration + edit timing + media -> `package/chapter.json` (captions, overlays, activities), player and media copied in |
| `package.py` | package | Validates `chapter.json`, media and the unchanged player, writes `chapter.js` and the lesson ZIP (+ production record) |

The player, `build_chapter.py` and the per-screen edit were tested end to end on a synthetic project (all 11 screen types, the 3 activity modes and the 4 simulators, played through in headless Chrome). The next step is the first real pilot episode.

## Setup

1. Python 3.10+ with Pillow and PyMuPDF (`pip install pillow pymupdf`), Node 18+, FFmpeg and ffprobe on PATH.
2. Codex CLI signed in, with image generation and the ElevenLabs app connected, and the EN2 video MCP configured (`[mcp_servers.en2_video]` in `~/.codex/config.toml`, or `EN2_MCP_URL`). The MCP URL contains a personal token: never commit it.
3. Read `AGENTS.md` and `skills/living-textbook-master/SKILL.md`.

## Start a production

```
python pipeline/extract_chapter.py --project projects/<slug> "<chapter.pdf>"
# then follow skills/living-textbook-master/SKILL.md stage by stage; stop at the episode-plan checkpoint
```
