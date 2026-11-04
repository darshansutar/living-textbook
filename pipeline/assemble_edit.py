"""Stitch accepted EN2 clips with the original narration (FFmpeg) into one file per video screen.

Reads edit.json (from build_edit.py). For each segment the listed video spans are trimmed,
joined with hard cuts and laid over the matching narration interval at its original speed;
the rendered EN2 sound is discarded. Silent segments (wonder clips, no `audio`) get a silent
track so every file has the same streams. Each segment is written to output/segments/NN_<clip>.mp4.

The segments are then grouped by their `screen` (in edit order) and joined into
output/screens/<screen-id>.mp4 - the files the player uses. A preview of everything joined
(output/final.mp4, optionally opened by a cover still) is written too unless --no-preview.

    python pipeline/assemble_edit.py --project projects/<slug> [--screen e1.c1.s5] [--no-preview]
"""
import argparse
import json
import subprocess
from pathlib import Path

ENC_V = ["-c:v", "libx264", "-crf", "16", "-preset", "medium", "-pix_fmt", "yuv420p"]
ENC_A = ["-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2"]


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        raise SystemExit(f"ffmpeg failed: {' '.join(cmd[:6])} ...\n{r.stderr[-1500:]}")


def probe(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
                         capture_output=True, text=True).stdout.strip()
    return round(float(out), 3)


def segment(project, seg, size, fps, out):
    w, h = size
    total = sum(e - s for s, e in seg["spans"])
    parts = []
    for i, (s, e) in enumerate(seg["spans"]):
        parts.append(f"[0:v]trim=start={s}:end={e},setpts=PTS-STARTPTS,scale={w}:{h}:force_original_aspect_ratio=decrease,"
                     f"pad={w}:{h}:(ow-iw)/2:(oh-ih)/2,fps={fps},setsar=1[v{i}]")
    joined = "".join(f"[v{i}]" for i in range(len(seg["spans"])))
    graph = ";".join(parts) + f";{joined}concat=n={len(seg['spans'])}:v=1:a=0[v];"
    if seg.get("audio"):
        a0, a1 = seg["audio_in"]
        if abs(total - (a1 - a0)) > 0.05:
            raise SystemExit(f"{seg['clip']}: spans total {total:.3f}s but narration interval is {a1 - a0:.3f}s")
        audio_in = ["-i", str(project / seg["audio"])]
        graph += f"[1:a]atrim=start={a0}:end={a1},asetpts=PTS-STARTPTS,aresample=48000[a]"
    else:  # silent wonder clip
        audio_in = ["-f", "lavfi", "-t", f"{total:.3f}", "-i", "anullsrc=r=48000:cl=stereo"]
        graph += "[1:a]anull[a]"
    run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(project / seg["video"]), *audio_in,
         "-filter_complex", graph, "-map", "[v]", "-map", "[a]", *ENC_V, *ENC_A, "-t", f"{total:.3f}", str(out)])


def cover_clip(project, cover, size, fps, out):
    w, h = size
    run(["ffmpeg", "-y", "-loglevel", "error", "-loop", "1", "-t", str(cover["seconds"]), "-i", str(project / cover["image"]),
         "-f", "lavfi", "-t", str(cover["seconds"]), "-i", "anullsrc=r=48000:cl=stereo",
         "-vf", f"scale={w}:{h}:force_original_aspect_ratio=increase,crop={w}:{h},fps={fps},setsar=1,format=yuv420p",
         *ENC_V, *ENC_A, "-shortest", str(out)])


def card_clip(project, seg, size, fps, out):
    """Narration over a still inside a video screen (e.g. a transition line over a card)."""
    w, h = size
    a0, a1 = seg.get("audio_in", [0, None]) or [0, None]
    a1 = a1 if a1 is not None else probe(project / seg["audio"])
    d = a1 - a0 + seg.get("pad", 0.4)
    run(["ffmpeg", "-y", "-loglevel", "error", "-loop", "1", "-t", f"{d:.3f}", "-i", str(project / seg["card"]),
         "-i", str(project / seg["audio"]), "-filter_complex",
         f"[0:v]scale={w}:{h}:force_original_aspect_ratio=increase,crop={w}:{h},fps={fps},setsar=1,format=yuv420p[v];"
         f"[1:a]atrim=start={a0}:end={a1},asetpts=PTS-STARTPTS,aresample=48000,apad[a]",
         "-map", "[v]", "-map", "[a]", "-t", f"{d:.3f}", *ENC_V, *ENC_A, str(out)])


def insert_clip(project, seg, size, fps, out):
    """A pre-assembled piece, normalised to the edit format."""
    w, h = size
    run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(project / seg["insert"]), "-vf",
         f"scale={w}:{h}:force_original_aspect_ratio=decrease,pad={w}:{h}:(ow-iw)/2:(oh-ih)/2,fps={fps},setsar=1,format=yuv420p",
         *ENC_V, *ENC_A, str(out)])


def join(pieces, out, faststart=True):
    if len(pieces) == 1:
        run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(pieces[0]), "-c", "copy",
             *(["-movflags", "+faststart"] if faststart else []), str(out)])
        return
    inputs = []
    for p in pieces:
        inputs += ["-i", str(p)]
    graph = "".join(f"[{i}:v][{i}:a]" for i in range(len(pieces))) + f"concat=n={len(pieces)}:v=1:a=1[v][a]"
    run(["ffmpeg", "-y", "-loglevel", "error", *inputs, "-filter_complex", graph, "-map", "[v]", "-map", "[a]",
         *ENC_V, *ENC_A, *(["-movflags", "+faststart"] if faststart else []), str(out)])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--project", required=True)
    ap.add_argument("--screen", action="append", help="only build these screen ids (repeatable)")
    ap.add_argument("--no-preview", action="store_true", help="skip the joined output/final.mp4 preview")
    args = ap.parse_args()
    project = Path(args.project).resolve()
    edit = json.loads((project / "edit.json").read_text(encoding="utf-8"))
    size, fps = edit["size"], edit["fps"]
    seg_dir = project / "output" / "segments"
    scr_dir = project / edit.get("screens_dir", "output/screens")
    seg_dir.mkdir(parents=True, exist_ok=True)
    scr_dir.mkdir(parents=True, exist_ok=True)

    preview, screens = [], {}
    if edit.get("cover") and not args.screen:
        out = seg_dir / "00_cover.mp4"
        cover_clip(project, edit["cover"], size, fps, out)
        preview.append(out)
    for i, seg in enumerate(edit["segments"], 1):
        if args.screen and seg.get("screen") not in args.screen:
            continue
        name = seg.get("clip") or seg.get("name") or f"part{i}"
        out = seg_dir / f"{i:02d}_{name}.mp4"
        if "card" in seg:
            card_clip(project, seg, size, fps, out)
        elif "insert" in seg:
            insert_clip(project, seg, size, fps, out)
        else:
            segment(project, seg, size, fps, out)
        print(f"{out.name}: {probe(out)} s  -> {seg.get('screen', '(no screen)')}")
        preview.append(out)
        if seg.get("screen"):
            screens.setdefault(seg["screen"], []).append(out)

    for sid, pieces in screens.items():
        out = scr_dir / f"{sid}.mp4"
        join(pieces, out)
        print(f"screen {sid}: {len(pieces)} segment(s), {probe(out)} s -> {out.relative_to(project)}")
    if not screens:
        print("no segment has a 'screen'; rebuild edit.json with build_edit.py")

    if preview and not args.no_preview and not args.screen:
        final = project / edit["output"]
        join(preview, final)
        print(f"preview: {final.relative_to(project)} {probe(final)} s (not used by the player)")


if __name__ == "__main__":
    main()
