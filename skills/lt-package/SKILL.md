---
name: lt-package
description: Package a Living Textbook episode or chapter for classrooms - write chapter.json from script.json and the finished media following the fixed schema, place it with the unchanged standard HTML player, validate every reference, test it as a teacher would, and ZIP it for offline use.
---

# Living Textbook - Package and Player

One generic player plays every chapter of every subject. **The player code is never edited for a chapter.** Contract: `chapter-schema.md` (same folder). Example: `templates/chapter.example.json`.

## 1. Build the package

```
python pipeline/build_chapter.py --project projects/<slug> [--script script.json ...]
```

Writes:

```
projects/<slug>/package/
  index.html  player.js  player.css      copied unchanged from player/ in this repo
  chapter.json                           built from script.json (schema below)
  chapter.js                             the same data as a script, so index.html opens from file:// offline
  media/screens/<screen-id>.mp4          from output/screens/
  media/audio/<line-id>.mp3              still, vote-reveal, MCQ-feedback, fact, recap and activity narration
  media/stills/...                        from stills/ (compressed JPG 1600 px wide, map icons PNG 256 px)
```

Episodes already in `package/chapter.json` are kept; the episodes in the given script(s) replace theirs. The script lists every missing still, audio or screen file at the end; produce them (or fix names) and run it again. Read its warnings: they name narration that is not accepted, overlays without a time and activities lt-activities has not filled.

## 2. What build_chapter.py maps (check it)

It maps `script.json` screen by screen into the schema:

- `video` screens -> `src` = the screen file; `captions` per sentence from the narration lines' measured times within the screen (edit.json segments; sentence breaks from measured pauses); `overlays` from plan.json shots (narration-clock times converted to screen time), else from the script's `during_line` overlays.
- `still`, `fact`, `recap` -> picture + narration audio + caption text.
- `vote` -> options with text, picture, `correct`, `reveal_audio`/`reveal_text`; a `reveal` screen follows it referencing the vote id.
- `mcq` -> question, scenario picture, options with feedback audio/text, `answer` index.
- `activity` -> mode fields from lt-activities.
- `activity` -> the lt-activities fields; `stills/...` paths become `media/stills/...`, `line`/`*_line` narration IDs become `audio`/`*_audio` (+ text), `narration` becomes the intro `audio`, `observe` becomes a vote.
- `concepts` -> id, title (`script.json` `concepts` overrides `analysis.json`), map icon `stills/map_<id>`. Text strings exactly as in `script.json`.

Picture names follow lt-stills: `cover`, `<ep>_title`, `<screen>` (still, recap), `<screen>_opt<k>`, `<screen>_card<k>`, `<screen>_scene`, `<screen>_fact`, `map_<concept>`. A vote option's consequence clip is the video screen `<vote-id>.opt<k>`.

Produce one `chapter.json` per chapter; add episodes to it as they are finished (an unfinished episode is simply absent).

## 3. Validate and pack

```
python pipeline/package.py --project projects/<slug> [--archive]
```

Checks the schema basics, unique screen ids, known screen types, activity modes and simulator templates, one correct vote option, MCQ answer indexes, reveals pointing at votes, that every referenced media file exists and that the player files are identical to `player/`. Rewrites `chapter.js` from `chapter.json`. Writes `<slug>-lesson-<date>.zip` (what goes to schools, with a SHA-256 manifest) and, with `--archive`, the production record ZIP.

## 4. Teacher test (mandatory before delivery)

Open `index.html` from the unzipped folder, offline, in Chrome or Edge on a projector-sized window, and play the episode as a teacher would: every screen, every vote with a different majority choice, every MCQ right and wrong, the activity screens (timers, "Show result", simulator controls), the chapter map, captions on and off, teacher view, keyboard controls (Right/Space next, Left back, 1-9 choose, R replay, C captions, M map, T teacher view, F full screen, H home). `index.html?screen=<id>&teacher=1` opens any screen directly for re-checks. Note any failure against its screen id in `review.json.package_test`. Content problems go back to their stage; a player bug is fixed in `player/` for **all** chapters and re-tested on every packaged chapter.
