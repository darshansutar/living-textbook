---
name: living-textbook-master
description: Coordinate a Living Textbook chapter production end to end - an NCERT chapter PDF becomes a classroom-projected, narrated, episode-based interactive lesson rooted in rural Indian examples, built with Codex images, ElevenLabs narration, EN2 Ultra animation and one generic HTML player.
---

# Living Textbook - Production Master

## Starling skills (adopted 2026-11-05)

**Starling skills.** The production stages follow the Starling skills copied in `starling/` (see `starling/README.md` for the mapping and the Living Textbook differences): production-master, prompt-pack, director, cinematography, image-pack-generator, panel-corrector, animation-pack and the board compositor `starling/pipeline/storyboard.py`.

Living Textbook turns **one NCERT chapter (any subject, Classes 5-10)** into an interactive lesson that a **teacher projects to the whole class**. The class votes by show of hands; the teacher taps the majority answer. Everything is **narration-led** (one narrator voice; characters appear but never speak), **rooted in rural Indian life** (Karnataka, Maharashtra, Gujarat first) and **faithful to the NCERT text**: the same concepts, activities and end questions, in the same order.

This skill is the operating contract.

## The lesson model (fixed)

```
CHAPTER = EPISODE 1 ... EPISODE n                     (book order; one class period each, 8-15 min of screen time)
EPISODE = TITLE (narrated welcome) -> 1-2 TOPIC LOOPS -> RECAP + NEXT TIME (narrated still)
TOPIC LOOP (four screens, the same every time; the topic's flow sets what each does and is called):
   1. hook video    - Story: a character's moment | Challenge: a job to do now | Wonder: a narrated surprise; ends on the question
   2. vote          - question read aloud; the teacher taps the class's choice; right answer + reveal line on the same screen
                      (Vote | Try | Guess)
   3. explain video - the NCERT concept with its activity or figure as evidence, tied back to the hook
                      (Answer | Learn + solve the challenge | Find out)
   4. check         - one MCQ in a new situation, question read aloud, feedback per option (Check | New challenge | Check)
```

Flow per topic: Challenge for skills and procedures (most Maths), Wonder for visible phenomena (much of Science), Story for ideas in people's lives (much of Social Science, the default).

Every screen is narrated, and videos flow into the next screen by themselves. The class sees only Back and Next; teacher tools (captions, map, full screen, notes, home) sit in one Menu. NCERT activities are shown inside the videos (demonstrations by the teacher, slow experiments as time-lapse). The recap still may be a silent animation.

Exact screen sequences and pacing: `skills/lt-script/flows.md`. Screen types and the content file: `skills/lt-package/chapter-schema.md`. How the player looks and behaves (Starling monsoon design): `skills/lt-player-design/SKILL.md`.

## Stages and owners

| # | Stage | Skill | Exit evidence |
|---|---|---|---|
| 1 | Intake | lt-intake | `intake.json`: chapter PDF, class, subject, region, style reference |
| 2 | Chapter analysis | lt-chapter-analysis | `source/` extraction + `analysis.json`: concepts, sizes, activities, questions, fact boxes, misconceptions |
| 3 | Episode plan | lt-episode-plan | `episodes.json`: episodes, flow per concept, story world and cast, activity modes |
| ✓ | **Checkpoint** | lt-episode-plan | the user approves `episodes.json` (recorded) - nothing is produced before this |
| 4 | Script | lt-script | `script.json`: every screen of every episode, every narration line, vote options, MCQs |
| 6 | Narration audio | lt-audio | ask the voice; `audio/*.mp3` + `audio/narration.json` measured and listened to |
| 7 | Visual plan | lt-visual-plan | `plan.json` timing table for every video screen |
| 8 | Assets + storyboards | lt-images | character sheets, clean scene masters, prop sheets, one picture per shot, fixed-format boards (storyboard.py), inspected |
| 9 | Stills | lt-stills | every still the player shows: cover, title, vote option pictures, check scenes, recap |
| 10 | Animation | lt-animation | EN2 prompts, hash-checked uploads, Ultra renders, job IDs |
| 11 | Review | lt-review | cuts measured, every clip inspected, re-time before one repair |
| 12 | Edit | lt-assembly | one narrated video file per video screen |
| 13 | Package | lt-package | `chapter.json` + media in the standard player, validated, ZIP |
| - | Player design | lt-player-design | only when the player itself changes: all chapters rebuilt and re-tested |

Work **one episode at a time** after the checkpoint: script, audio, visuals, renders and package for Episode 1 first, then the next. Episode 1's title sets up the story world; the last episode's recap is the story payoff.

## Providers (fixed)

| Need | Provider | How |
|---|---|---|
| Chapter text and page pictures | Local PyMuPDF | `pipeline/extract_chapter.py` |
| Images (assets, boards, stills) | Codex native image generation | `pipeline/codex_run.py` |
| Narration | ElevenLabs `eleven_v3` via Codex | `codex_run.py`, then `pipeline/harvest_audio.py` |
| Animation | EN2 reference-to-video, **Ultra only** | `en2_upload.mjs`, `video_generate`, `en2_collect.mjs` |
| Edit | Local FFmpeg | `review_cuts.py`, `build_edit.py`, `assemble_edit.py` (one file per video screen) |
| Package | Local | `build_chapter.py` (writes `chapter.json`), `package.py` (validates, ZIPs) |
| Player | One generic offline HTML player (never edited per chapter), Starling monsoon design | `player/` + `chapter.json`; lt-player-design |

Do not substitute providers. Never build animation in code.

## Hard rules

- **NCERT first.** Every concept, activity and end question of the chapter is covered, in the book's order. Facts come from the chapter; never teach beyond or against it.
- **Rooted in India.** Every hook, example, name, place, crop, food and object comes from Indian, preferably rural, life. Foreign examples only when the NCERT text itself uses them.
- **The episode plan decides the cast.** Characters exist only if `episodes.json` names them. They are original (inspired by the NCERT illustration style, never NCERT's own characters), **never speak** and never lip-sync. A style reference supplies look only - never its character.
- **No text in generated pictures or video.** Numbers, labels, equations, option text and captions are drawn by the player (overlays) so they are exact and translatable. This matters most in Maths.
- **Wrong options are misconceptions.** Every vote and MCQ distractor is a belief students really hold, taken from `analysis.json`.
- **Narration only, one voice.** All spoken words are narration lines in `script.json`; translation = new audio + new strings, same video.
- **Audio first; one timing table.** `plan.json` drives boards, prompts, render length and edit.
- **Inspect everything you generate** before anything depends on it; record what was inspected; never claim a review you did not do.
- **Paid jobs:** Ultra, each clip submitted once, every job ID recorded, rejected media kept, never resubmit a slow job.
- **Repairs:** re-time first; one repair render per clip; then the user decides.
- **The player never changes per chapter.** If a chapter seems to need new player code, use an existing screen type or a video instead and tell the user.

## Project layout

```
projects/<slug>/
  intake.json  analysis.json  episodes.json  script.json  plan.json  review.json  edit.json
  source/          chapter.pdf, chapter.txt, outline.json, pages/
  refs/            style reference (style only)
  audio/           <line-id>.mp3, narration.json
  assets/          character sheets, scene masters, prop / macro / diagram sheets
  storyboards/     panels/, <clip>_storyboard.png, boards.json
  stills/          every still image the player shows
  prompts/         codex-*.md, <clip>.txt
  renders/         jobs.json, <clip>.mp4, cuts.json, rejected/
  output/screens/  one MP4 per video screen
  package/         chapter.json + media + player (what ships)
  logs/
```

Start from `templates/`. Run every pipeline script from the repo root with `--project projects/<slug>`.
