"""Build edit.json from the plan, the measured narration and the OBSERVED cuts.

EN2 does not always cut exactly where the prompt asks. Each shot must show its narration
interval, so spans are computed from the real cut positions:

  for every shot: need = narration length of the shot + any shortfall carried from the shot before
                  take = min(need, footage available until the observed next cut / clip end)
                  span = [shot start, shot start + take]; carry the rest into the next shot

The narration therefore keeps its original speed and the cut may land slightly before a sentence
boundary (fine editorially). If the last shot still cannot cover its narration the clip needs a
repair, and the script stops with a clear message.

    python pipeline/build_edit.py --project projects/plants [--cover static/cover.png --cover-seconds 3]
"""
import argparse
import json
from pathlib import Path


def spans_for(clip, observed, duration):
    starts = [0.0] + list(observed)
    ends = list(observed) + [duration]
    if len(starts) != len(clip["shots"]):
        raise SystemExit(f"{clip['id']}: {len(clip['shots'])} shots planned but {len(starts)} found in the render; review needed")
    spans, carry = [], 0.0
    for shot, s, e in zip(clip["shots"], starts, ends):
        r0, r1 = shot["required"]
        need = (r1 - r0) + carry
        take = min(need, e - s)
        carry = round(need - take, 3)
        spans.append([round(s, 3), round(s + take, 3)])
    if carry > 0.04:
        raise SystemExit(f"{clip['id']}: footage is {carry}s short of the narration; needs a repair render")
    return spans


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--project", required=True)
    ap.add_argument("--cover", help="project-relative cover image to open the video with")
    ap.add_argument("--cover-seconds", type=float, default=3.0)
    ap.add_argument("--include-unverified", action="store_true", help="preview only: include clips not yet verified")
    args = ap.parse_args()
    project = Path(args.project).resolve()
    plan = json.loads((project / "plan.json").read_text(encoding="utf-8"))
    cuts = json.loads((project / "renders" / "cuts.json").read_text(encoding="utf-8"))
    review_path = project / "review.json"
    review = json.loads(review_path.read_text(encoding="utf-8")) if review_path.exists() else {}
    narr = json.loads((project / "audio" / "narration.json").read_text(encoding="utf-8"))

    segments = []
    for clip in plan["clips"]:
        status = review.get(clip["id"], {}).get("visual_status", "unverified")
        if not status.startswith("verified") and not args.include_unverified:
            print(f"skip {clip['id']}: visual_status={status}")
            continue
        c = cuts[clip["id"]]
        a0, a1 = clip["audio_interval"]
        spans = spans_for(clip, c["cuts_observed"], c["duration"])
        segments.append({
            "clip": clip["id"],
            "video": f"renders/{clip['id']}.mp4",
            "spans": spans,
            "audio": narr[clip["narration"]]["file"],
            "audio_in": [a0, a1],
            "visual_status": status,
        })
        print(clip["id"], spans)
    edit = {"size": plan.get("size", [1344, 768]), "fps": plan.get("fps", 24), "segments": segments, "output": "output/final.mp4"}
    if args.cover:
        edit["cover"] = {"image": args.cover, "seconds": args.cover_seconds}
    (project / "edit.json").write_text(json.dumps(edit, indent=2), encoding="utf-8")
    print("wrote edit.json")


if __name__ == "__main__":
    main()
