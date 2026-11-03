"""Technical review of downloaded EN2 renders: real cut times, drift and review sheets.

For each clip in plan.json with a render at renders/<clip id>.mp4 this script:
  * detects hard cuts with FFmpeg scene detection (and flags soft transitions),
  * compares them with the planned cut_times,
  * writes renders/<clip id>.review.png (2 fps frame sheet with timestamps) for visual review,
  * stores everything in renders/cuts.json, used by build_edit.py.

It does not judge picture content: a person still inspects every shot against its panel and
records the verdict in review.json (see skills/lt-review).

    python pipeline/review_cuts.py --project projects/plants
"""
import argparse
import json
import re
import subprocess
from pathlib import Path


def probe_duration(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
                         capture_output=True, text=True).stdout.strip()
    return round(float(out), 3)


def scene_cuts(path, threshold):
    err = subprocess.run(["ffmpeg", "-i", str(path), "-vf", f"select='gt(scene,{threshold})',metadata=print", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    times = [float(t) for t in re.findall(r"pts_time:([0-9.]+)", err)]
    scores = [float(s) for s in re.findall(r"scene_score=([0-9.]+)", err)]
    return [(round(t, 3), round(s, 3)) for t, s in zip(times, scores)]


def sheet(path, out):
    dur = probe_duration(path)
    rows = max(1, int((dur * 2 + 3) // 4))
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(path), "-vf",
                    "fps=2,scale=480:-1,drawtext=text='%{pts\\:hms}':x=8:y=8:fontsize=22:fontcolor=white:box=1:boxcolor=black@0.6,"
                    f"tile=4x{rows}:padding=4", "-frames:v", "1", str(out)], check=False)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--project", required=True)
    ap.add_argument("--threshold", type=float, default=0.12)
    ap.add_argument("--drift", type=float, default=0.5, help="seconds of cut drift that triggers a flag")
    args = ap.parse_args()
    project = Path(args.project).resolve()
    plan = json.loads((project / "plan.json").read_text(encoding="utf-8"))
    results = {}
    for clip in plan["clips"]:
        video = project / "renders" / f"{clip['id']}.mp4"
        if not video.exists():
            continue
        cuts = scene_cuts(video, args.threshold)
        hard = [t for t, s in cuts if s >= 0.3]
        soft = [t for t, s in cuts if s < 0.3]
        planned = clip["cut_times"]
        flags = []
        if len(hard) != len(planned):
            flags.append(f"expected {len(planned)} hard cuts, found {len(hard)} (soft transitions at {soft})")
        for p, o in zip(planned, hard):
            if abs(p - o) > args.drift:
                flags.append(f"cut planned {p}s observed {o}s (drift {o - p:+.2f}s): re-time spans before repairing")
        sheet(video, project / "renders" / f"{clip['id']}.review.png")
        results[clip["id"]] = {"duration": probe_duration(video), "cuts_planned": planned, "cuts_observed": hard, "soft_transitions": soft, "flags": flags}
        print(clip["id"], results[clip["id"]])
    (project / "renders" / "cuts.json").write_text(json.dumps(results, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
