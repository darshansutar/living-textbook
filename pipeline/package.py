"""Validate and pack a Living Textbook lesson.

The shippable lesson is the folder projects/<slug>/package/:
    index.html, player.js, player.css     the standard player (copied unchanged from player/)
    chapter.json                           the chapter content (schema: skills/lt-package/chapter-schema.md)
    chapter.js                             chapter.json as a script (rewritten here) so file:// works offline
    media/                                 screen videos, narration audio, stills

Checks before packing:
  * chapter.json parses and has chapter/episodes/screens
  * every screen id is unique and every screen type is a known type
  * every media path referenced anywhere in chapter.json exists inside package/
  * every vote / mcq has exactly one correct option and an answer index in range
  * every activity has a known mode (and simulator template); every reveal points at a vote
  * the player files match player/ in this repo (the player is never edited per chapter)

Writes:
  <slug>-lesson-<date>.zip       package/ + MANIFEST.json (SHA-256 per file)  -> what goes to schools
  <slug>-production-<date>.zip   only with --archive: the production record (analysis, episodes,
                                 script, plan, prompts, boards, job IDs, review)

    python pipeline/package.py --project projects/<slug> [--archive]
"""
import argparse
import hashlib
import json
import zipfile
from datetime import date
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
MODES = {"do_along", "simulator", "mission"}
TEMPLATES = {"compare_setups", "zoom_scale", "dial", "tap_diagram"}
TYPES = {"title", "video", "still", "vote", "reveal", "question_cards", "mcq", "activity", "fact", "recap", "score"}
MEDIA_KEYS = {"src", "image", "audio", "still", "icon", "result_still", "result_video", "consequence_src",
              "reveal_audio", "feedback_audio"}
ARCHIVE = ["intake.json", "analysis.json", "episodes.json", "script.json", "plan.json", "edit.json", "review.json",
           "audio/narration.json", "prompts", "storyboards", "renders/jobs*.json", "renders/cuts.json", "source/outline.json"]


def walk_media(node, found):
    """Collect media references: values of the known media keys, and any string under media/
    (simulator configs use their own keys, e.g. setups[].start / result)."""
    if isinstance(node, dict):
        for k, v in node.items():
            if isinstance(v, str) and (k in MEDIA_KEYS or v.startswith("media/")):
                found.add(v)
            else:
                walk_media(v, found)
    elif isinstance(node, list):
        for v in node:
            if isinstance(v, str) and v.startswith("media/"):
                found.add(v)
            else:
                walk_media(v, found)


def validate(pkg):
    cj = pkg / "chapter.json"
    if not cj.exists():
        raise SystemExit(f"{cj} missing")
    ch = json.loads(cj.read_text(encoding="utf-8"))
    errors, ids, reveals = [], set(), []
    if not ch.get("chapter") or not ch.get("episodes"):
        errors.append("chapter.json needs 'chapter' and 'episodes'")
    for ep in ch.get("episodes", []):
        for sc in ep.get("screens", []):
            sid = sc.get("id")
            if sid in ids:
                errors.append(f"duplicate screen id {sid}")
            ids.add(sid)
            if sc.get("type") not in TYPES:
                errors.append(f"{sid}: unknown type {sc.get('type')}")
            if sc.get("type") == "activity":
                if sc.get("mode") not in MODES:
                    errors.append(f"{sid}: activity mode {sc.get('mode')} unknown")
                elif sc["mode"] == "simulator" and sc.get("template") not in TEMPLATES:
                    errors.append(f"{sid}: simulator template {sc.get('template')} unknown")
            if sc.get("type") == "reveal":
                reveals.append((sid, sc.get("vote")))
            if sc.get("type") in ("vote", "mcq"):
                opts = sc.get("options", [])
                if sc["type"] == "vote" and sum(1 for o in opts if o.get("correct")) != 1 and not sc.get("observation"):
                    errors.append(f"{sid}: vote needs exactly one correct option")
                if sc["type"] == "mcq" and not (isinstance(sc.get("answer"), int) and 0 <= sc["answer"] < len(opts)):
                    errors.append(f"{sid}: mcq answer index out of range")
    votes = {sc.get("id") for ep in ch.get("episodes", []) for sc in ep.get("screens", []) if sc.get("type") == "vote"}
    errors += [f"{sid}: reveal points at unknown vote {v}" for sid, v in reveals if v not in votes]
    media = set()
    walk_media(ch, media)
    missing = sorted(m for m in media if not (pkg / m).exists())
    errors += [f"missing media: {m}" for m in missing]
    for f in ("index.html", "player.js", "player.css"):
        if not (pkg / f).exists():
            errors.append(f"player file missing: {f}")
        elif (REPO / "player" / f).exists() and (pkg / f).read_bytes() != (REPO / "player" / f).read_bytes():
            errors.append(f"{f} differs from player/{f}; copy the standard player (build_chapter.py does) - never edit it per chapter")
    if errors:
        raise SystemExit("package invalid:\n  " + "\n  ".join(errors))
    (pkg / "chapter.js").write_text("window.CHAPTER = " + cj.read_text(encoding="utf-8").strip() + ";\n", encoding="utf-8")
    n = sum(len(ep.get("screens", [])) for ep in ch["episodes"])
    print(f"chapter.json ok: {len(ch['episodes'])} episodes, {n} screens, {len(media)} media files")


def zip_dir(zpath, root, files):
    manifest = {}
    with zipfile.ZipFile(zpath, "w", zipfile.ZIP_DEFLATED) as z:
        for f in files:
            rel = str(f.relative_to(root)).replace("\\", "/")
            z.write(f, rel)
            manifest[rel] = hashlib.sha256(f.read_bytes()).hexdigest()
        z.writestr("MANIFEST.json", json.dumps(manifest, indent=2))
    print(f"wrote {zpath.name}: {len(manifest)} files, {zpath.stat().st_size / 1e6:.1f} MB")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--project", required=True)
    ap.add_argument("--archive", action="store_true", help="also write the production-record ZIP")
    args = ap.parse_args()
    project = Path(args.project).resolve()
    pkg = project / "package"
    validate(pkg)
    today = date.today().isoformat()
    zip_dir(project / f"{project.name}-lesson-{today}.zip", pkg, sorted(f for f in pkg.rglob("*") if f.is_file()))
    if args.archive:
        files = []
        for pattern in ARCHIVE:
            for p in sorted(project.glob(pattern)):
                files += [f for f in sorted(p.rglob("*")) if f.is_file() and "rejected" not in f.parts] if p.is_dir() else [p]
        zip_dir(project / f"{project.name}-production-{today}.zip", project, files)


if __name__ == "__main__":
    main()
