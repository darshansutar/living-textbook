# Living Textbook workflow

Contract date: 4 November 2026. Design explained in `docs/Living_Textbook_Flow_Report.pdf`.

## The lesson model

```
CHAPTER  = OPENER -> EPISODE 1 ... EPISODE n -> FINALE
EPISODE  = RECAP -> 1-2 CONCEPT LOOPS -> CLIFFHANGER          (one class period, 10-15 min screen time)
LOOP     = Story | Challenge | Wonder | mini loop | fact card  (skills/lt-script/flows.md)
FINALE   = payoff -> practice activities -> chapter MCQ round -> score
```

The teacher projects; the class votes by hand; the teacher taps the majority.

## The pipeline

| # | Stage | Skill | Output |
|---|---|---|---|
| 1 | Intake | lt-intake | `intake.json`, `source/` (extract_chapter.py) |
| 2 | Chapter analysis | lt-chapter-analysis | `analysis.json` - concepts, sizes, activities, questions, misconceptions |
| 3 | Episode plan | lt-episode-plan | `episodes.json` - episodes, flow per concept, story world, cast, activity modes |
| ✓ | **Checkpoint** | lt-episode-plan | user approval recorded |
| 4 | Script | lt-script | `script.json` - every screen and narration line |
| 5 | Activities | lt-activities | do-along / simulator / video / mission screens |
| 6 | Narration | lt-audio | voice asked; `audio/*.mp3`, `narration.json` |
| 7 | Visual plan | lt-visual-plan | `plan.json` for every video screen, with overlays |
| 8 | Assets + boards | lt-images | character sheets, scene masters, sheets, storyboards |
| 9 | Stills | lt-stills | every still the player shows |
| 10 | Animation | lt-animation | EN2 Ultra renders + job IDs |
| 11 | Review | lt-review | cuts, visual verdicts, re-time / one repair |
| 12 | Edit | lt-assembly | `output/screens/<screen-id>.mp4` (build_edit.py, assemble_edit.py) |
| 13 | Package | lt-package | `package/` (player + `chapter.json` + media) via build_chapter.py, validated ZIP via package.py |

After the checkpoint, stages 4-13 run **one episode at a time**.

## Rules that never bend

1. NCERT first; rooted in rural India.
2. Approval before production.
3. Characters come from the episode plan and never speak; a style reference is style only.
4. No text in generated media; the player draws all text.
5. Distractors are real misconceptions.
6. Audio first; one timing table; narration never stretched.
7. Inspect everything; Ultra; each clip once; job IDs kept; re-time before one repair.
8. One player for all chapters.

## Status

- Skills, templates and all pipeline scripts are built for this model: `extract_chapter.py`, the per-screen edit (`build_edit.py`, `assemble_edit.py` -> `output/screens/<screen-id>.mp4`), `build_chapter.py` (-> `package/chapter.json`) and `package.py` (validate + ZIP).
- The generic player (`player/`) plays every screen type offline from the ZIP; it was tested end to end on a synthetic project.
- **Next:** produce the pilot episode (Science Ch 10, Episode 1) and test it in a classroom.
