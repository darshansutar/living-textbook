"""Join consecutive narration lines into one audio file so one EN2 clip can carry them.

An EN2 clip is at most ~13-15 s; most narration lines are 4-9 s. Pairing two short consecutive
lines of the same video screen roughly halves the number of paid clips. The lines keep their
original speed; only a short natural gap is put between them.

    python pipeline/join_narration.py --project projects/<slug> --group e1_op_n1,e1_op_n2 [--group ...] [--gap 0.5]
    python pipeline/join_narration.py --project projects/<slug> --groups prompts/join_groups.json

Writes audio/joined/<first>__<last>.mp3 and adds an entry to audio/narration.json under the key
"<first>__<last>" with seconds, pauses (measured on the joined file) and
"parts": [{"line": "<narration key>", "at": <start s>, "seconds": <len>}].
A plan.json clip uses the joined key as its `narration`; build_edit.py and assemble_edit.py treat it
like any other file, and build_chapter.py places each part's captions at its `at` offset.
"""
import argparse
import json
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from harvest_audio import duration, pauses  # noqa: E402


def join(project, keys, narr, gap):
    for k in keys:
        if k not in narr:
            raise SystemExit(f"{k} not in audio/narration.json")
        if "parts" in narr[k]:
            raise SystemExit(f"{k} is already a joined entry")
    key = f"{keys[0]}__{keys[-1]}"
    out = project / "audio" / "joined" / f"{key}.mp3"
    out.parent.mkdir(parents=True, exist_ok=True)
    inputs, filt, parts, t = [], [], [], 0.0
    for i, k in enumerate(keys):
        inputs += ["-i", str(project / narr[k]["file"])]
        filt.append(f"[{i}:a]aresample=44100,aformat=channel_layouts=mono[a{i}]")
        parts.append({"line": k, "at": round(t, 3), "seconds": narr[k]["seconds"]})
        t += narr[k]["seconds"] + gap
    chain, n = [], 0
    for i in range(len(keys)):
        chain.append(f"[a{i}]")
        if i < len(keys) - 1:
            filt.append(f"anullsrc=r=44100:cl=mono,atrim=0:{gap}[g{i}]")
            chain.append(f"[g{i}]")
        n += 2 if i < len(keys) - 1 else 1
    filt.append("".join(chain) + f"concat=n={n}:v=0:a=1[out]")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *inputs, "-filter_complex", ";".join(filt),
                    "-map", "[out]", "-c:a", "libmp3lame", "-q:a", "2", str(out)], check=True)
    rec = {"file": out.relative_to(project).as_posix(), "parts": parts,
           "seconds": duration(out), "pauses": pauses(out), "gap": gap}
    return key, rec


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--project", required=True)
    ap.add_argument("--group", action="append", default=[], help="comma-separated narration keys, in order")
    ap.add_argument("--groups", help="project-relative JSON list of lists of narration keys")
    ap.add_argument("--gap", type=float, default=0.5)
    args = ap.parse_args()
    project = Path(args.project).resolve()
    path = project / "audio" / "narration.json"
    narr = json.loads(path.read_text(encoding="utf-8"))
    groups = [g.split(",") for g in args.group]
    if args.groups:
        groups += json.loads((project / args.groups).read_text(encoding="utf-8"))
    for g in groups:
        g = [k.strip().replace(".", "_") for k in g if k.strip()]
        if len(g) < 2:
            raise SystemExit(f"a group needs at least two lines: {g}")
        key, rec = join(project, g, narr, args.gap)
        narr[key] = rec
        print(f"{key}: {rec['seconds']} s from {len(g)} lines")
    path.write_text(json.dumps(narr, indent=2), encoding="utf-8")
    print(f"wrote {path.relative_to(project)}")


if __name__ == "__main__":
    main()
