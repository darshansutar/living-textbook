"""Stitch accepted EN2 clips with the original narration (FFmpeg).

Reads edit.json (from build_edit.py). For each segment the listed video spans are trimmed,
joined with hard cuts and laid over the matching narration interval at its original speed;
the rendered EN2 sound is discarded. Every segment is written to output/segments/<clip>.mp4
and then all are joined into the final video. An optional cover image opens the video as a
silent still (the cover page option).

    python pipeline/assemble_edit.py --project projects/plants
"""
import argparse
import json
import subprocess
from pathlib import Path


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
    a0, a1 = seg["audio_in"]
    total = sum(e - s for s, e in seg["spans"])
    if abs(total - (a1 - a0)) > 0.05:
        raise SystemExit(f"{seg['clip']}: spans total {total:.3f}s but narration interval is {a1 - a0:.3f}s")
    parts = []
    for i, (s, e) in enumerate(seg["spans"]):
        parts.append(f"[0:v]trim=start={s}:end={e},setpts=PTS-STARTPTS,scale={w}:{h}:force_original_aspect_ratio=decrease,"
                     f"pad={w}:{h}:(ow-iw)/2:(oh-ih)/2,fps={fps},setsar=1[v{i}]")
    joined = "".join(f"[v{i}]" for i in range(len(seg["spans"])))
    graph = ";".join(parts) + f";{joined}concat=n={len(seg['spans'])}:v=1:a=0[v];" \
            f"[1:a]atrim=start={a0}:end={a1},asetpts=PTS-STARTPTS,aresample=48000[a]"
    run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(project / seg["video"]), "-i", str(project / seg["audio"]),
         "-filter_complex", graph, "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-crf", "16", "-preset", "medium",
         "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-shortest", str(out)])


def cover_clip(project, cover, size, fps, out):
    w, h = size
    run(["ffmpeg", "-y", "-loglevel", "error", "-loop", "1", "-t", str(cover["seconds"]), "-i", str(project / cover["image"]),
         "-f", "lavfi", "-t", str(cover["seconds"]), "-i", "anullsrc=r=48000:cl=stereo",
         "-vf", f"scale={w}:{h}:force_original_aspect_ratio=increase,crop={w}:{h},fps={fps},setsar=1,format=yuv420p",
         "-c:v", "libx264", "-crf", "16", "-c:a", "aac", "-b:a", "192k", "-shortest", str(out)])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--project", required=True)
    args = ap.parse_args()
    project = Path(args.project).resolve()
    edit = json.loads((project / "edit.json").read_text(encoding="utf-8"))
    size, fps = edit["size"], edit["fps"]
    seg_dir = project / "output" / "segments"
    seg_dir.mkdir(parents=True, exist_ok=True)
    pieces = []
    if edit.get("cover"):
        out = seg_dir / "00_cover.mp4"
        cover_clip(project, edit["cover"], size, fps, out)
        pieces.append(out)
    for i, seg in enumerate(edit["segments"], 1):
        out = seg_dir / f"{i:02d}_{seg['clip']}.mp4"
        segment(project, seg, size, fps, out)
        print(f"{out.name}: {probe(out)} s")
        pieces.append(out)
    inputs = []
    for p in pieces:
        inputs += ["-i", str(p)]
    graph = "".join(f"[{i}:v][{i}:a]" for i in range(len(pieces))) + f"concat=n={len(pieces)}:v=1:a=1[v][a]"
    final = project / edit["output"]
    run(["ffmpeg", "-y", "-loglevel", "error", *inputs, "-filter_complex", graph, "-map", "[v]", "-map", "[a]",
         "-c:v", "libx264", "-crf", "16", "-preset", "medium", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k",
         "-movflags", "+faststart", str(final)])
    print(f"final: {final.relative_to(project)} {probe(final)} s")


if __name__ == "__main__":
    main()
