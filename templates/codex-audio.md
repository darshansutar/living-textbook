You are the narration-audio step of the Living Textbook workflow. Use your connected ElevenLabs tool (text-to-speech) to generate one file per line below. Use voice ID <VOICE_ID> and model eleven_v3. Speak each text exactly as written, with no additions.

1. audio/e1_c1_s1_n1.mp3 — "<exact narration text of line e1.c1.s1.n1>"
2. audio/e1_c1_s1_n2.mp3 — "<exact narration text of line e1.c1.s1.n2>"

Speak as a warm teacher-narrator addressing a whole classroom: clear, unhurried, Indian English. Say numbers exactly as written (3.45 = "three point four five").

Generate every line, in order; do not skip any. After each generation, write the exact download URL the tool returned on its own line in your reply as `URL <file> <url>` (the harvest script finds the files only through these URLs). Try to save each returned audio file into this working directory at the given path. If you cannot download it (the sandbox may block the download host), that is fine: do not retry other ways.

END your reply with a JSON array and nothing after it, one object per file:
[{"file": "audio/e1_c1_s1_n1.mp3", "generation_id": "<id>", "history_id": "<id or null>", "voice_id": "<voice>", "model": "<model>"}]

If no ElevenLabs tool is available to you, say so plainly and stop. Do not modify any other files.
