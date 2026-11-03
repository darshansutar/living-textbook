---
name: lt-audio
description: Generate Living Textbook narration with ElevenLabs through Codex, download it with the harvester, and measure durations and sentence pauses that drive all shot timing.
---

# Living Textbook - Narration Audio

Audio comes before any visual planning. Codex has the ElevenLabs app connected; Claude cannot call ElevenLabs directly here, and Codex's sandbox cannot download the result, so the step is split in two.

## 1. Generate (Codex)

Write `prompts/codex-audio.md` from `templates/codex-audio.md`:

- voice ID from intake, model `eleven_v3`
- one file per narration line, path `audio/<N-id>.mp3`, text copied exactly from script.json
- the reply must END with a JSON array: `[{"file": "audio/N1.mp3", "generation_id": "...", "history_id": "...", "voice_id": "...", "model": "eleven_v3"}]`

Run:

```
python pipeline/codex_run.py --project projects/<slug> --prompt prompts/codex-audio.md --name audio
```

Codex will report that it generated the audio but could not save it. That is expected.

## 2. Harvest and measure

```
python pipeline/harvest_audio.py --project projects/<slug> --name audio
```

The harvester reads the JSON block, finds each generation's signed URL in the Codex log, downloads the MP3 and writes `audio/narration.json` with `seconds` and `pauses` (FFmpeg silence detection, -35 dB, 0.18 s). Download soon after generation; the signed links expire.

## 3. Listen and accept

Listen to every file completely. Check the words match script.json exactly, pronunciation, pace and that nothing is cut off. Record the verdict per file in narration.json (`accepted: true`, `listened_by`). Regenerate only the failing line.

## 4. Cues for planning

Sentence boundaries are the midpoints of the measured pauses. A cue inside a sentence (no pause) is an estimate; mark it `estimated` in plan.json. If a narration line is too long for one clip, split it at a measured pause (lt-script).

Keep the original speed. Never stretch or squeeze narration to fit footage; footage is trimmed to the narration (lt-assembly).
