---
name: living-textbook-master
description: Coordinate a Living Textbook chapter production end to end - an NCERT chapter PDF becomes a classroom-projected, narrated, episode-based interactive lesson (Story / Challenge / Wonder flows) rooted in rural Indian examples, built with Codex images, ElevenLabs narration, EN2 Ultra animation and one generic HTML player.
---

# Living Textbook - Production Master

Living Textbook turns **one NCERT chapter (any subject, Classes 5-10)** into an interactive lesson that a **teacher projects to the whole class**. The class votes by show of hands; the teacher taps the majority answer. Everything is **narration-led** (one narrator voice; characters appear but never speak), **rooted in rural Indian life** (Karnataka, Maharashtra, Gujarat first) and **faithful to the NCERT text**: the same concepts, activities and end questions, in the same order.

The design is explained for people in `docs/Living_Textbook_Flow_Report.pdf`. This skill is the operating contract.

## The lesson model (fixed)

```
CHAPTER = OPENER (once) -> EPISODE 1 ... EPISODE n -> FINALE
EPISODE = RECAP -> 1-2 CONCEPT LOOPS -> CLIFFHANGER        (one class period, 10-15 min of screen time)
CONCEPT LOOP = one of three flows
   Story     : story video -> vote -> explain -> reveal -> MCQ
   Challenge : challenge video -> vote (try) -> stuck -> learn -> solve -> new-challenge MCQ
   Wonder    : silent wonder -> question cards -> investigate (activity) -> vote -> explain -> apply MCQ
   Mini loop : hook still -> explain -> MCQ          (small concepts)
   Fact card : "Did you know?" between loops        (NCERT fact boxes)
FINALE  = story payoff -> practice activities (do-along / mission) -> chapter MCQ round -> score
```

Exact screen sequences: `skills/lt-script/flows.md`. Screen types and the content file: `skills/lt-package/chapter-schema.md`.

## Stages and owners

| # | Stage | Skill | Exit evidence |
|---|---|---|---|
| 1 | Intake | lt-intake | `intake.json`: chapter PDF, class, subject, region, style reference |
| 2 | Chapter analysis | lt-chapter-analysis | `source/` extraction + `analysis.json`: concepts, sizes, activities, questions, fact boxes, misconceptions |
| 3 | Episode plan | lt-episode-plan | `episodes.json`: episodes, flow per concept, story world and cast, activity modes |
| ✓ | **Checkpoint** | lt-episode-plan | the user approves `episodes.json` (recorded) - nothing is produced before this |
| 4 | Script | lt-script | `script.json`: every screen of every episode, every narration line, vote options, MCQs |
| 5 | Activities | lt-activities | activity screens specified in `script.json` (do-along steps, simulator config, missions) |
| 6 | Narration audio | lt-audio | ask the voice; `audio/*.mp3` + `audio/narration.json` measured and listened to |
| 7 | Visual plan | lt-visual-plan | `plan.json` timing table for every video screen |
| 8 | Assets + storyboards | lt-images | character sheets, scene masters, prop sheets, labelled boards, inspected |
| 9 | Stills | lt-stills | every still the player shows: covers, vote cards, MCQ images, fact cards, activity pictures |
| 10 | Animation | lt-animation | EN2 prompts, hash-checked uploads, Ultra renders, job IDs |
| 11 | Review | lt-review | cuts measured, every clip inspected, re-time before one repair |
| 12 | Edit | lt-assembly | one narrated video file per video screen |
| 13 | Package | lt-package | `chapter.json` + media in the standard player, validated, ZIP |

Work **one episode at a time** after the checkpoint: script, audio, visuals, renders and package for Episode 1 first, then the next. The opener and finale belong to the first and last episode.

## Providers (fixed)

| Need | Provider | How |
|---|---|---|
| Chapter text and page pictures | Local PyMuPDF | `pipeline/extract_chapter.py` |
| Images (assets, boards, stills) | Codex native image generation | `pipeline/codex_run.py` |
| Narration | ElevenLabs `eleven_v3` via Codex | `codex_run.py`, then `pipeline/harvest_audio.py` |
| Animation | EN2 reference-to-video, **Ultra only** | `en2_upload.mjs`, `video_generate`, `en2_collect.mjs` |
| Edit | Local FFmpeg | `review_cuts.py`, `build_edit.py`, `assemble_edit.py` (one file per video screen) |
| Package | Local | `build_chapter.py` (writes `chapter.json`), `package.py` (validates, ZIPs) |
| Player | One generic offline HTML player (never edited per chapter) | `player/` + `chapter.json` |

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
