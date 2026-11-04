---
name: lt-audio
description: Ask for the Living Textbook narrator voice, generate every narration line of the approved episode script with ElevenLabs through Codex, download with the harvester, listen, and measure durations and pauses that drive all timing.
---

# Living Textbook - Narration Audio

Audio comes before any visual planning. Codex has the ElevenLabs app connected; Claude cannot call ElevenLabs directly here, and Codex's sandbox cannot download the result, so the step is split in two.

## 0. Ask the voice (once per chapter)

"Which ElevenLabs narrator voice should we use (name or ID)?" Suggest a warm, clear Indian-English teacher voice suited to projection in a classroom. Record voice ID, name and model `eleven_v3` in `intake.json.narrator` with the user's words. A later language version gets its own voice question.

## 1. Generate (Codex)

Write `prompts/codex-audio.md` from `templates/codex-audio.md`:

- voice ID, model `eleven_v3`
- one file per narration line of the episode being produced: `audio/<line-id>.mp3` (dots in IDs become underscores: `audio/e1_c2_s1_n1.mp3`), text copied exactly from `script.json`
- the reply must END with a JSON array: `[{"file": "audio/e1_c2_s1_n1.mp3", "generation_id": "...", "history_id": "...", "voice_id": "...", "model": "eleven_v3"}]`

```
python pipeline/codex_run.py --project projects/<slug> --prompt prompts/codex-audio.md --name audio-e1
```

Codex will report that it generated the audio but could not save it. That is expected.

## 2. Harvest and measure

```
python pipeline/harvest_audio.py --project projects/<slug> --name audio-e1
```

Downloads each MP3 from the signed URL in the Codex log and writes `audio/narration.json` with `seconds` and `pauses` (FFmpeg silence detection, -35 dB, 0.18 s). Download soon after generation; signed links expire.

## 3. Listen and accept

Listen to every file completely: exact words, pronunciation of Indian names and terms (gud, Haveri, Kutch, millibar), numbers said as written, pace suitable for a classroom, nothing cut off. Record `accepted: true` and `listened_by` per file in narration.json. Regenerate only failing lines.

## 4. Cues for planning

Sentence boundaries are the midpoints of measured pauses. A cue inside a sentence is an estimate; mark it `estimated` in plan.json. Reveal, feedback, stuck, recap and fact lines play over stills in the player - they need no video timing, only their measured length.

Keep the original speed. Never stretch or squeeze narration to fit footage; footage is trimmed to the narration.
