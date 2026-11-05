# Living Textbook workflow

Updated 5 November 2026: simple topic loop, Starling production skills (`starling/`), Starling-style player.

## The lesson model

```
CHAPTER = EPISODE 1 ... EPISODE n                     (book order; one class period each, 8-15 min of screen time)
EPISODE = TITLE (narrated welcome) -> 1-2 TOPIC LOOPS -> RECAP + NEXT TIME (narrated still)
TOPIC LOOP (the simple loop, the same every time):
   1. story video   - narrated story moment that raises the topic's question
   2. vote          - question read aloud; the teacher taps the class's choice; right answer + reveal line on the same screen
   3. answer video  - the NCERT concept, its activity or figure shown as evidence, tied back to the story
   4. check         - one MCQ in a new situation, question read aloud, feedback per option
```

Every screen is narrated. The class sees only Back and Next; teacher tools (captions, map, full screen, notes, home) sit in one Menu. NCERT activities are shown inside the videos (demonstrations by the teacher, slow experiments as time-lapse).

The teacher projects; the class votes by hand; the teacher taps the class's choice.

## The pipeline

| # | Stage | Skill | Output |
|---|---|---|---|
| 1 | Intake | lt-intake | `intake.json`, `source/` (extract_chapter.py) |
| 2 | Chapter analysis | lt-chapter-analysis | `analysis.json` - concepts, activities, questions, misconceptions |
| 3 | Episode plan | lt-episode-plan | `episodes.json` - episodes, topic loops, story world, cast |
| ✓ | **Checkpoint** | lt-episode-plan | user approval recorded |
| 4 | Script | lt-script | `script.json` - every screen and narration line (simple loop) |
| 5 | Narration | lt-audio | `audio/*.mp3`, `narration.json` (measured) |
| 6 | Visual plan | lt-visual-plan + Starling prompt-pack / director / cinematography | `plan.json` - clips, 1-3 shot boards, timing, actions |
| 7 | Assets + boards | lt-images + Starling image-pack-generator / panel-corrector | clean scene masters, one picture per shot, boards via `starling/pipeline/storyboard.py` |
| 8 | Stills | lt-stills | title, vote option pictures, check scenes, recap |
| 9 | Animation | lt-animation + Starling animation-pack | EN2 Ultra: pilot first, then the batch; job IDs |
| 10 | Review | lt-review + Starling director / cinematography | cuts, verdicts, re-time, one scene redesign per clip |
| 11 | Edit | lt-assembly | `output/screens/<screen-id>.mp4` (build_edit.py, assemble_edit.py) |
| 12 | Package | lt-package | `package/` (player + `chapter.json` + media), validated ZIP |

After the checkpoint, stages 4-12 run **one episode at a time**.

## Rules that never bend

1. NCERT first; rooted in rural India.
2. Approval before production; the user reviews a pilot clip before a paid batch.
3. Characters come from the episode plan and never speak; a style reference is style only.
4. No text in generated media; the player draws all text.
5. Distractors are real misconceptions.
6. Audio first; one timing table; narration never stretched.
7. Inspect everything; EN2 Ultra; each clip once; job IDs kept; re-time before one repair.
8. One player for all chapters.
