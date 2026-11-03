You are the narration-audio step of the Living Textbook workflow. Use your connected ElevenLabs tool (text-to-speech) to generate one file per line below. Use voice ID <VOICE_ID> and model eleven_v3. Speak each text exactly as written, with no additions.

1. audio/N1.mp3 — "<exact narration text N1>"
2. audio/N2.mp3 — "<exact narration text N2>"

Try to save each returned audio file into this working directory at the given path. If you cannot download it (the sandbox may block the download host), that is fine: do not retry other ways.

END your reply with a JSON array and nothing after it, one object per file:
[{"file": "audio/N1.mp3", "generation_id": "<id>", "history_id": "<id or null>", "voice_id": "<voice>", "model": "<model>"}]

If no ElevenLabs tool is available to you, say so plainly and stop. Do not modify any other files.
