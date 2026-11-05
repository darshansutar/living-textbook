# Starling auto-edit rules

Agreed with the user on 2026-11-02 while finishing the PAI roleplay (English and Hindi). Numbers here are the defaults in `pipeline/auto_edit.py`.

## A. Never touch

1. Approved narration and dialogue audio is never cut inside, sped up, reordered or replaced.
2. Original renders and paid job IDs are preserved; edits are new files.
3. Each script node is its own video; branch outcomes are never joined.

## B. Storyboards (planning, before render)

1. **Shot count follows the narration** a board covers:

   | Narration on the board | Board | Generated length |
   |---|---|---|
   | under 4 s | `storyboard_1x1` (one narration panel) | 4-15 s |
   | 4-8 s | `storyboard_1x2` (two shots, the "2x1 grid") | 6-15 s |
   | 8-15 s | `storyboard_1x3` (three shots) | 10-15 s |
   | over 15 s | split at a measured sentence pause into several boards | - |

   Every shot covers at least 2 seconds of narration.
2. **No character talks in a narration panel.** Nobody faces another character in a conversation pose; every person has a silent action (typing, reading, carrying, pointing, walking, listening). Close shots of people use a back, side or over-the-shoulder view, or hands and objects.
3. **Narration before dialogue ends on a silent shot of the same set** (same scene master, light and camera side) - a detail, an establishing view, or a character from behind - never the speakers face to face. The dialogue clip's own wide shot opens the conversation.
4. Every narration prompt carries the hard lock "everyone keeps closed lips; nobody speaks or mouths words" (the runtime rejects narration prompts without "closed lips").

## C. Narration editing

1. Shot windows come from the real cuts in each render (ffmpeg scene detection); storyboard caption times are never trusted.
2. Each shot starts at its real cut and runs for its phrase of the narration.
3. **Minimum shot 2.0 s.** A shorter shot is dropped and its time goes to a neighbour with spare footage; B-roll may play down to **0.8x** speed.
4. **A narration line under 3.75 s plays as one narration panel** - the first panel with enough footage, never the dialogue picture.
5. The last shot before a dialogue is kept, except under rule C4 or a flag.
6. Extra shots EN2 adds outside the needed time are cut out.

## D. Dialogue editing

1. Picture and lip-synced speech always stay together.
2. **One spoken copy of the line:** start 0.15 s before the first word; end 0.30 s after the approved line's length. Anything EN2 says after that (a repeat or extra words) is cut.
3. **Jump-cut cover:** the first line of each run of dialogue stays wide; every following line pushes in **115%** toward the speaker, whose side comes from the scene master.

## E. Faults

1. A fault inside a shot's buffer is trimmed away.
2. A fault inside the needed time is fixed in the edit when possible: zoom out side or top bars or an edge sign (up to 15%), blur a small invented number, freeze a screen so a chart stops moving, drop a shot flagged for talking, or start a shot later to skip a hallucinated opening (flag `trim_head`), passing the time it can no longer cover to the next shot.
3. Black frames or fades in a used shot, bars too large to zoom, lips moving that cannot be dropped, garbled text, wrong objects or vanishing props go on the re-render list with reason and timestamp. **Paid re-renders need the user's approval.**
4. A re-render keeps the same storyboard method; redesign the panel when the fault came from the picture (for example a face-to-face pose that EN2 animated as speech).

## F. Language versions

1. Silent narration renders are reused; shots are re-fitted to the new narration at measured pauses, moving a cut by up to 1.5 s into a neighbour with footage.
2. Re-render a board only when the language reverses its picture order or a phrase does not fit.
3. Dialogue is always re-rendered for lip-sync.

## G. Review

1. Claude reads the report and inspects every review sheet.
2. The user reviews the complete edited videos, sound and lip-sync. Only the user's verdicts are recorded.

## Later (not installed)

Automatic mouth-movement detection (MediaPipe) and on-screen text detection (EasyOCR) were considered and left out on 2026-11-02 because of their download size; Claude's review-sheet inspection covers them.
