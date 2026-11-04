# chapter.json - the content contract between the pipeline and the player

The player engine (`player/`) is generic. Everything chapter-specific is in `chapter.json` and `media/`. `chapter.js` (`window.CHAPTER = <chapter.json>;`) is written next to it by build_chapter.py / package.py so the player opens from file:// without a server. Paths are relative to the package folder. All visible text is in this file (never in pictures), so a translation replaces strings and audio only. Full example: `templates/chapter.example.json`.

## Top level

```json
{
  "schema": "living-textbook/chapter@1",
  "language": "en",
  "chapter": {
    "id": "g7-sci-10", "book": "Curiosity", "class": 7, "subject": "Science",
    "number": 10, "title": "Life Processes in Plants",
    "cover": "media/stills/cover.png",
    "story_world": "Ravi's chilli nursery near Haveri, Karnataka"
  },
  "concepts": [ { "id": "c1", "title": "Plants need light", "icon": "media/stills/map_c1.png" } ],
  "episodes": [ { "id": "e1", "title": "The Yellow Grass", "concepts": ["c1", "c2"], "screens": [ ... ] } ],
  "settings": { "vote_seconds": 10, "captions": true }
}
```

`settings`: `vote_seconds`, `captions` (default on), optional `ui` (player button and hint strings, for a translated package).

`concepts` drive the chapter map (the player fills it in as each concept's first screen is reached). Every screen has `id`, `type`, optional `concept` and optional `teacher_note` (shown only in teacher view).

## Screen types (the complete list - no others)

| type | Fields | Player behaviour |
|---|---|---|
| `title` | `title`, `subtitle`, `image` | Title card; Next to continue |
| `video` | `role`, `src`, `captions[]` ({start,end,text}), `overlays[]` ({text, at, until, anchor, style}) | Plays the screen video; captions and overlays drawn on top; continues at the end |
| `still` | `image`, `audio`, `captions[]`, `overlays[]` | Shows the picture while the narration plays |
| `vote` | `question`, `audio` (optional prompt), `options[]` ({text, image, correct, reveal_audio, reveal_text, consequence_src?}), `observation` (true for "what did you see?"), `seconds` | Shows options with a countdown; teacher taps the class's majority; stores the choice for `reveal` |
| `reveal` | `vote` (id of the vote screen) | Highlights the correct option; plays the chosen option's `consequence_src` (if any) then its `reveal_audio` |
| `question_cards` | `prompt`, `audio`, `cards[]` ({text, image}) | Class picks a card; the choice is shown again in the next explain screen header |
| `mcq` | `question`, `image` (scenario), `options[]` ({text, image?, feedback_audio, feedback_text}), `answer` (index) | Teacher taps the class's answer; right/wrong shown with that option's feedback; counts toward the score |
| `activity` | `mode` (`do_along` / `simulator` / `mission`) + mode fields below | See below |
| `fact` | `title` ("Did you know?"), `text`, `image`, `audio`, `source` (NCERT ref) | Fact card with narration |
| `recap` | `audio`, `image`, `text`, then an embedded `mcq` | Short recall before an episode |
| `score` | `audio`, `text`, optional `scope` (`chapter`) | Shows MCQ results for the episode (or the whole chapter) |

### Activity fields

- `do_along`: `title`, `audio?` (intro), `materials[]`, `safety`, `steps[]` ({text, still, timer_s?, audio?}), `observe` (a vote object), `expected` ({text, result_still, result_video?, result_audio?}). The player runs intro -> steps -> observe -> result; "Show result" jumps to the result.
- `simulator`: `template` (`compare_setups` | `zoom_scale` | `dial` | `tap_diagram`), optional `title` and `audio`, and `config` as defined in `skills/lt-activities/SKILL.md`. Player-side names: compare_setups `setups[]` {label, conditions, start, result, states?[] {conditions, result}}, `run_label`; zoom_scale `min`, `max`, `unit`, `levels[]`, `marks[]` {value, label, still?}; dial `min`, `max`, `unit`, `start`, `step?`, `zones[]` {from, to, label, still, audio?}; tap_diagram `image`, `hotspots[]` {x, y, w, h, label, audio?}
- `mission`: `task`, `days`, `record[]` (column names), `report_back`, `still`, `audio?`

## Overlays

`{ "text": "3.45 m", "at": 4.2, "until": 9.0, "anchor": "centre", "style": "number" }` - `anchor` is top / bottom / left / right / centre, or `{ "x": 62, "y": 40 }` in % of the frame; `style` is `number`, `label` or `equation`. Use `<sub>`/`<sup>` in equation text (CO<sub>2</sub>).

## Rules

- Media keys are `src`, `image`, `audio`, `still`, `icon`, `result_still`, `result_video`, `consequence_src`, `reveal_audio`, `feedback_audio`; `package.py` checks every path exists.
- Screen ids are unique across the chapter (`e1.c2.s3`).
- A vote has exactly one `correct` option unless `observation` is true (then mark the expected one `correct`).
- New needs are met with existing types. If something truly cannot be expressed, stop and discuss a schema version change with the user - never patch the player for one chapter.
