"""Download the ElevenLabs narration Codex generated, then measure it.

Codex's sandbox cannot reach the ElevenLabs download host, so the audio step asks Codex to
END its reply with a JSON block like:

    [{"file": "audio/N1.mp3", "generation_id": "SpPk...", "voice_id": "...", "model": "eleven_v3"}]

This script reads that block from logs/codex-<name>-last.md, finds each generation's signed
URL in logs/codex-<name>.log, downloads the MP3 into the project, and writes
audio/narration.json with duration and pause-based sentence cues for every file.

    python pipeline/harvest_audio.py --project projects/plants --name audio
"""
import argparse
import json
import re
import subprocess
import urllib.request
from pathlib import Path

URL_RE = re.compile(r"https://elevenlabsusercontent\.com/[^\s\"')\]]+")


def duration(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
                         capture_output=True, text=True).stdout.strip()
    return round(float(out), 3)


def pauses(path, noise="-35dB", min_len=0.18):
    err = subprocess.run(["ffmpeg", "-i", str(path), "-af", f"silencedetect=noise={noise}:d={min_len}", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    starts = [float(x) for x in re.findall(r"silence_start: ([0-9.]+)", err)]
    ends = [float(x) for x in re.findall(r"silence_end: ([0-9.]+)", err)]
    return [[round(s, 3), round(e, 3)] for s, e in zip(starts, ends)]


def manifest_from_last(text):
    blocks = re.findall(r"\[\s*\{.*?\}\s*\]", text, flags=re.S)
    for b in reversed(blocks):
        try:
            data = json.loads(b)
            if isinstance(data, list) and all("file" in d for d in data):
                return data
        except json.JSONDecodeError:
            continue
    raise SystemExit("no JSON manifest found at the end of Codex's reply; ask Codex to print it")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--project", required=True)
    ap.add_argument("--name", default="audio")
    args = ap.parse_args()
    project = Path(args.project).resolve()
    log = (project / "logs" / f"codex-{args.name}.log").read_text(encoding="utf-8", errors="ignore")
    last = (project / "logs" / f"codex-{args.name}-last.md").read_text(encoding="utf-8", errors="ignore")
    urls = sorted(set(URL_RE.findall(log)))
    records = {}
    for item in manifest_from_last(last):
        gen = item.get("generation_id") or item.get("history_id")
        url = item.get("url") or next((u for u in urls if gen and f"/{gen}/" in u), None)
        if not url:
            raise SystemExit(f"no download URL for {item['file']} (generation {gen})")
        out = project / item["file"]
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_bytes(urllib.request.urlopen(url, timeout=120).read())
        rec = {k: v for k, v in item.items() if k != "url"}
        rec.update(seconds=duration(out), pauses=pauses(out))
        records[Path(item["file"]).stem] = rec
        print(f"{item['file']}: {rec['seconds']} s, pauses {rec['pauses']}")
    path = project / "audio" / "narration.json"
    existing = json.loads(path.read_text(encoding="utf-8")) if path.exists() else {}
    existing.update(records)
    path.write_text(json.dumps(existing, indent=2), encoding="utf-8")
    print(f"wrote {path.relative_to(project)}")


if __name__ == "__main__":
    main()
