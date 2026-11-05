# Living Textbook

Turns an **NCERT chapter PDF** (any subject, Classes 5-10) into an interactive, narrated, animated lesson that a teacher projects to the class. Each chapter becomes a short series of episodes; each concept is taught with one simple, fully narrated loop: a story video from rural India, a class vote, the answer video with the NCERT activity, and one check. Production follows the Starling skills in `starling/`. One generic HTML player (styled like the Starling player) plays every chapter.

```
Chapter PDF -> Analyse -> Episode plan -> [approval] -> Script -> Narration -> Visual plan
           -> Assets + storyboards -> Stills -> EN2 Ultra (pilot, then batch) -> Review -> Edit -> chapter.json + player -> ZIP
```

Pipeline: [docs/WORKFLOW.md](docs/WORKFLOW.md) · Agent rules: [AGENTS.md](AGENTS.md)

## Contents

| Path | What it is |
|---|---|
| `skills/` | 13 skills: master, intake, chapter analysis, episode plan, script (+ `flows.md`), audio, visual plan, images, stills, animation, review, assembly, package (+ `chapter-schema.md`) |
| `starling/` | The Starling production skills used as written (prompt-pack, director, cinematography, image-pack-generator, panel-corrector, animation-pack) and the board compositor `storyboard.py`; see `starling/README.md` |
| `pipeline/` | Scripts for the mechanical steps (below) |
| `player/` | The one generic offline HTML player (`index.html`, `player.js`, `player.css`) - copied unchanged into every package |
| `templates/` | Example `intake`, `analysis`, `episodes`, `script`, `plan`, `chapter` JSON and Codex prompt templates |
| `docs/` | Workflow summary |

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
| `starling/pipeline/storyboard.py` | storyboards | Composes the fixed-format 1-3 shot boards from one picture per shot and checks images |
| `join_narration.py` | visual plan | Joins two short consecutive narration lines into one clip's audio |
| `en2_upload.mjs` / `en2_submit.mjs` / `en2_collect.mjs` | animation | Hash-checked uploads, submission, polling and download |
| `review_cuts.py` | review | Real cut times, drift flags, frame sheets |
| `build_edit.py` / `assemble_edit.py` | edit | Spans from observed cuts; narrated clip segments; one file per video screen in `output/screens/` |
| `build_chapter.py` | package | `script.json` + measured narration + edit timing + media -> `package/chapter.json` (captions, overlays, question audio), player and media copied in |
| `package.py` | package | Validates `chapter.json`, media and the unchanged player, writes `chapter.js` and the lesson ZIP (+ production record) |

The pilot is Science Class 7 Chapter 10, Episode 1 (rebuilt as the simple loop on 5 November 2026).

## Setup

1. Python 3.10+ with Pillow and PyMuPDF (`pip install pillow pymupdf`), Node 18+, FFmpeg and ffprobe on PATH.
2. Codex CLI signed in, with image generation and the ElevenLabs app connected, and the EN2 video MCP configured (`[mcp_servers.en2_video]` in `~/.codex/config.toml`, or `EN2_MCP_URL`). The MCP URL contains a personal token: never commit it.
3. Read `AGENTS.md` and `skills/living-textbook-master/SKILL.md`.

## Start a production

```
python pipeline/extract_chapter.py --project projects/<slug> "<chapter.pdf>"
# then follow skills/living-textbook-master/SKILL.md stage by stage; stop at the episode-plan checkpoint
```
