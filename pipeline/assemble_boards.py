"""Assemble Starling narration storyboards from Codex-generated panel pictures.

Each board stacks its panels top to bottom (Shot 1 at the top). Every picture is cropped to
16:9 and forced to grayscale; a white caption strip BELOW each picture prints SHOT, the
whole-second generated range, CAMERA and ACTION from plan.json, so the printed labels and the
animation prompt always come from one timing table. Image models garble text, so labels are
never drawn by the image model.

Panels are read from <project>/storyboards/panels/<CLIP>_P<shot>.png where <CLIP> is the part of
the clip id before the first "-" (C1-stomata -> C1).

    python pipeline/assemble_boards.py --project projects/plants [--clip C1-stomata]
"""
import argparse
import hashlib
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps

W, H = 1344, 756   # 16:9 picture area
STRIP = 132        # white caption strip


def font(size, bold=False):
    names = ["arialbd.ttf", "DejaVuSans-Bold.ttf"] if bold else ["arial.ttf", "DejaVuSans.ttf"]
    for name in names:
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            continue
    return ImageFont.load_default()


def wrap(draw, text, f, max_w):
    lines, line = [], ""
    for word in text.split():
        test = f"{line} {word}".strip()
        if draw.textlength(test, font=f) > max_w and line:
            lines.append(line)
            line = word
        else:
            line = test
    lines.append(line)
    return lines


def build(project, clip):
    shots = clip["shots"]
    if len(shots) not in (2, 3):
        raise SystemExit(f"{clip['id']}: narration boards need 2 or 3 shots")
    board = Image.new("RGB", (W, (H + STRIP) * len(shots)), "white")
    draw = ImageDraw.Draw(board)
    boxes = []
    key = clip["id"].split("-")[0]
    for i, s in enumerate(shots):
        panel = project / "storyboards" / "panels" / s.get("panel", f"{key}_P{s['shot']}.png")
        pic = ImageOps.fit(ImageOps.grayscale(Image.open(panel)).convert("RGB"), (W, H), Image.LANCZOS)
        y = i * (H + STRIP)
        board.paste(pic, (0, y))
        boxes.append([0, y, W, y + H])
        g0, g1 = s["generated"]
        a0, a1 = s["action"]
        h0, h1 = s["hold"]
        draw.text((24, y + H + 12), f"SHOT {s['shot']}   {g0}-{g1} s   (action {a0}-{a1} s, hold {h0}-{h1} s)", fill="black", font=font(28, True))
        ty = y + H + 50
        lines = wrap(draw, f"CAMERA: {s['camera']}", font(23), W - 48)[:1] + wrap(draw, f"ACTION: {s['action_text']}", font(23), W - 48)[:2]
        for line in lines:
            draw.text((24, ty), line, fill="black", font=font(23))
            ty += 26
    out = project / "storyboards" / f"{clip['id']}_storyboard.png"
    board.save(out)
    digest = hashlib.sha256(out.read_bytes()).hexdigest()
    print(out.name, board.size, digest[:16])
    return {"path": str(out.relative_to(project)).replace("\\", "/"), "sha256": digest, "size": board.size, "picture_boxes": boxes}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--project", required=True)
    ap.add_argument("--clip", action="append", help="only these clip ids")
    args = ap.parse_args()
    project = Path(args.project).resolve()
    plan = json.loads((project / "plan.json").read_text(encoding="utf-8"))
    path = project / "storyboards" / "boards.json"
    out = json.loads(path.read_text(encoding="utf-8")) if path.exists() else {}
    for clip in plan["clips"]:
        if args.clip and clip["id"] not in args.clip:
            continue
        out[clip["id"]] = build(project, clip)
    path.write_text(json.dumps(out, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
