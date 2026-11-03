"""Pack a finished Living Textbook project into one delivery ZIP.

Includes the final video and per-clip segments, the static roleplay images (cover, answer,
reason, confidence and check images), narration audio and cues, storyboards and panels,
assets, animation prompts, the timing plan, edit plan, job IDs and the review record, plus a
MANIFEST.json with a SHA-256 for every file.

    python pipeline/package.py --project projects/plants
"""
import argparse
import hashlib
import json
import zipfile
from datetime import date
from pathlib import Path

INCLUDE = ["output", "static", "audio", "storyboards", "assets", "prompts", "renders/jobs*.json", "renders/cuts.json",
           "plan.json", "edit.json", "review.json", "intake.json", "roleplay.json"]
SKIP_SUFFIX = {".review.png"}


def files(project):
    for pattern in INCLUDE:
        for p in sorted(project.glob(pattern)):
            if p.is_dir():
                yield from (f for f in sorted(p.rglob("*")) if f.is_file() and "rejected" not in f.parts)
            elif p.is_file():
                yield p


def write_roleplay(project):
    """roleplay.json: which static image belongs to which roleplay element, plus the video segments."""
    plan = json.loads((project / "plan.json").read_text(encoding="utf-8"))
    edit = json.loads((project / "edit.json").read_text(encoding="utf-8")) if (project / "edit.json").exists() else {"segments": []}
    items = plan.get("static", [])
    missing = [s["file"] for s in items if not (project / s["file"]).exists()]
    if missing:
        raise SystemExit(f"static images missing: {missing}")
    by_kind = {}
    for s in items:
        by_kind.setdefault(s["kind"], []).append({k: s[k] for k in ("id", "text", "file") if k in s})
    segs = sorted((project / "output" / "segments").glob("*.mp4"))
    roleplay = {
        "title": plan.get("title") or plan.get("project"),
        "cover": next((s["file"] for s in items if s["kind"] == "cover"), None),
        "answers": by_kind.get("answer", []),
        "reasons": by_kind.get("reason", []),
        "confidence": by_kind.get("confidence", []),
        "checks": by_kind.get("check", []),
        "other_stills": by_kind.get("other", []),
        "clips": [{"clip": s["clip"], "segment": next((str(p.relative_to(project)).replace("\\", "/") for p in segs if p.stem.endswith(s["clip"])), None)}
                  for s in edit["segments"]],
        "final_video": edit.get("output"),
    }
    (project / "roleplay.json").write_text(json.dumps(roleplay, indent=2), encoding="utf-8")
    print(f"wrote roleplay.json ({len(items)} stills)")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--project", required=True)
    args = ap.parse_args()
    project = Path(args.project).resolve()
    if not (project / "output" / "final.mp4").exists():
        raise SystemExit("output/final.mp4 missing: run assemble_edit.py first")
    write_roleplay(project)
    zpath = project / f"{project.name}-living-textbook-{date.today().isoformat()}.zip"
    manifest = {}
    with zipfile.ZipFile(zpath, "w", zipfile.ZIP_DEFLATED) as z:
        for f in files(project):
            if any(f.name.endswith(s) for s in SKIP_SUFFIX):
                continue
            rel = str(f.relative_to(project)).replace("\\", "/")
            z.write(f, rel)
            manifest[rel] = hashlib.sha256(f.read_bytes()).hexdigest()
        z.writestr("MANIFEST.json", json.dumps(manifest, indent=2))
    print(f"wrote {zpath.name}: {len(manifest)} files, {zpath.stat().st_size / 1e6:.1f} MB")


if __name__ == "__main__":
    main()
