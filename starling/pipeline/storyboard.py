"""Fixed-format narration storyboard compositor and image integrity checks.

ChatGPT generates the shot pictures with no text. This module builds the
board so every storyboard has identical geometry, caption colour and type.
The shot count follows the narration it covers (see BOARD_SECONDS):

    1 shot  = storyboard_1x1: canvas 1024 x 512   (narration under ~4 s)
    2 shots = storyboard_1x2: canvas 1024 x 1024  (about 4-8 s; the "2x1 grid")
    3 shots = storyboard_1x3: canvas 1024 x 1536  (about 8-15 s)
    each block = picture 1024 x 464 + ivory caption strip 1024 x 48
    caption: SHOT n | start-end s | CAMERA | DEFINING ACTION

Usage:
    python pipeline/storyboard.py compose SPEC.json
    python pipeline/storyboard.py verify BOARD.png
    python pipeline/storyboard.py check-image IMAGE [--min-width N --min-height N]

Requires Pillow (imported lazily so the stdlib-only runtime stays importable).
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

WIDTH, HEIGHT = 1024, 1536          # HEIGHT is the three-shot board; boards are 512 px per shot
BOARD_SECONDS = {1: (4.0, 15.0), 2: (6.0, 15.0), 3: (10.0, 15.0)}   # generated length allowed per shot count
BLOCK_H, PICTURE_H, STRIP_H = 512, 464, 48
IVORY = (0xFB, 0xEC, 0xD8)
TEXT = (0x32, 0x12, 0x0B)
FONT_PATH = Path("C:/Windows/Fonts/bahnschrift.ttf")
FONT_VARIATION = b"Bold Condensed"
FALLBACK_FONT = Path("C:/Windows/Fonts/arialbd.ttf")
CAPTION_FONT, SIDE_MARGIN = 24, 20
SEPARATOR = "  |  "
MIN_SOURCE_WIDTH = 1024


class StoryboardError(ValueError):
    pass


def require(condition, message):
    if not condition:
        raise StoryboardError(message)


def _pil():
    try:
        from PIL import Image, ImageDraw, ImageFont, ImageStat
    except ImportError as exc:  # pragma: no cover - environment dependent
        raise StoryboardError("Pillow is required: python -m pip install pillow") from exc
    return Image, ImageDraw, ImageFont, ImageStat


def sha256(path) -> str:
    h = hashlib.sha256()
    with Path(path).open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def picture_boxes(count=3):
    """Return the fixed [left, top, right, bottom] picture and strip boxes for a 1-3 shot board."""
    return [
        {
            "shot": i + 1,
            "picture": [0, i * BLOCK_H, WIDTH, i * BLOCK_H + PICTURE_H],
            "caption": [0, i * BLOCK_H + PICTURE_H, WIDTH, (i + 1) * BLOCK_H],
        }
        for i in range(count)
    ]


# ---------------------------------------------------------------- integrity

def check_image(path, min_width=1, min_height=1):
    """Fully decode an image and reject truncated, undersized or damaged files.

    Returns a dict of facts. Raises StoryboardError on any failure.
    """
    Image, _, _, ImageStat = _pil()
    path = Path(path)
    require(path.is_file(), f"Missing image: {path}")
    data = path.read_bytes()
    require(len(data) > 1024, f"Image file is too small to be complete: {path.name}")
    if data[:8] == b"\x89PNG\r\n\x1a\n":
        require(b"IEND" in data[-32:], f"PNG is truncated (no IEND chunk): {path.name}")
        kind = "png"
    elif data[:3] == b"\xff\xd8\xff":
        require(data.rstrip(b"\x00")[-2:] == b"\xff\xd9", f"JPEG is truncated (no end marker): {path.name}")
        kind = "jpeg"
    elif data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        kind = "webp"
    else:
        raise StoryboardError(f"Unsupported or corrupt image format: {path.name}")
    try:
        with Image.open(path) as im:
            im.load()  # full decode; raises on truncated data
            rgb = im.convert("RGB")
    except StoryboardError:
        raise
    except Exception as exc:
        raise StoryboardError(f"Image does not decode completely: {path.name}: {exc}") from exc
    w, h = rgb.size
    require(w >= min_width and h >= min_height, f"Image {path.name} is {w}x{h}; at least {min_width}x{min_height} required")
    # A half-loaded image usually ends in a flat grey/single-colour band.
    band = rgb.crop((0, int(h * 0.88), w, h))
    stat = ImageStat.Stat(band)
    flat = max(stat.stddev) < 3.0
    require(not flat, f"Image {path.name} ends in a flat single-colour band (likely half-loaded or damaged)")
    whole = ImageStat.Stat(rgb)
    require(max(whole.stddev) > 8.0, f"Image {path.name} is nearly uniform (blank, grey or failed generation)")
    return {"path": str(path), "format": kind, "width": w, "height": h, "bytes": len(data), "sha256": sha256(path)}


# ---------------------------------------------------------------- composing

def _font(size):
    _, _, ImageFont, _ = _pil()
    if FONT_PATH.is_file():
        font = ImageFont.truetype(str(FONT_PATH), size)
        try:
            font.set_variation_by_name(FONT_VARIATION)
        except Exception:
            pass
        return font
    return ImageFont.truetype(str(FALLBACK_FONT), size)


def caption_text(shot):
    camera = str(shot["camera"]).strip().upper()
    action = str(shot["action"]).strip().upper()
    require(camera and action, f"Shot {shot.get('shot')} needs CAMERA and DEFINING ACTION text")
    return SEPARATOR.join([
        f"SHOT {shot['shot']}",
        f"{shot['start']:.2f}-{shot['end']:.2f} s",
        camera,
        action,
    ])


def _fit_font(draw, text):
    """Every caption uses the same fixed size; overflow is an error, never a smaller font."""
    font = _font(CAPTION_FONT)
    left, _, right, _ = draw.textbbox((0, 0), text, font=font)
    require(right - left <= WIDTH - 2 * SIDE_MARGIN,
            f"Caption is too long for one line at {CAPTION_FONT}px; shorten CAMERA or ACTION: {text}")
    return font, CAPTION_FONT


def _fit_picture(source, focus_y):
    """Scale to 1024 wide and crop a 1024x464 window around focus_y (0 top - 1 bottom)."""
    Image, _, _, _ = _pil()
    w, h = source.size
    scale = WIDTH / w
    new_h = round(h * scale)
    require(new_h >= PICTURE_H, f"Shot picture is too wide for the {WIDTH}x{PICTURE_H} window ({w}x{h})")
    resized = source.resize((WIDTH, new_h), Image.LANCZOS)
    spare = new_h - PICTURE_H
    top = round(spare * min(max(float(focus_y), 0.0), 1.0))
    return resized.crop((0, top, WIDTH, top + PICTURE_H))


def validate_spec(spec):
    shots = spec.get("shots")
    require(isinstance(shots, list) and len(shots) in BOARD_SECONDS, "A narration storyboard needs 1, 2 or 3 shots")
    previous_end = 0.0
    for index, shot in enumerate(shots, start=1):
        require(shot.get("shot") == index, f"Shots must be numbered from 1 in order (got {shot.get('shot')})")
        start, end = shot.get("start"), shot.get("end")
        require(isinstance(start, (int, float)) and isinstance(end, (int, float)), f"Shot {index} needs numeric start and end")
        require(abs(start - previous_end) < 1e-6, f"Shot {index} must start exactly where the previous shot ends ({previous_end:.2f})")
        require(end > start, f"Shot {index} must end after it starts")
        require(shot.get("image"), f"Shot {index} needs an image path")
        previous_end = end
    total = shots[-1]["end"]
    low, high = BOARD_SECONDS[len(shots)]
    require(low <= total <= high, f"A {len(shots)}-shot narration board covers {total:.2f} s; it must be {low:g}-{high:g} s "
                                  "(choose the shot count from the narration length, or split longer narration into another board)")


def compose(spec, base_dir=None):
    """Build a board from a spec dict. Returns the sidecar record."""
    Image, ImageDraw, _, _ = _pil()
    validate_spec(spec)
    base = Path(base_dir or ".")
    out = base / spec["out"]
    count = len(spec["shots"])
    board = Image.new("RGB", (WIDTH, count * BLOCK_H), IVORY)
    draw = ImageDraw.Draw(board)
    inputs, fonts = [], []
    for shot, box in zip(spec["shots"], picture_boxes(count)):
        source_path = base / shot["image"]
        facts = check_image(source_path, min_width=MIN_SOURCE_WIDTH, min_height=PICTURE_H)
        with Image.open(source_path) as im:
            picture = _fit_picture(im.convert("RGB"), shot.get("focus_y", 0.5))
        board.paste(picture, tuple(box["picture"][:2]))
        text = caption_text(shot)
        font, size = _fit_font(draw, text)
        left, top, right, bottom = box["caption"]
        draw.rectangle((left, top, right - 1, bottom - 1), fill=IVORY)
        tl, tt, tr, tb = draw.textbbox((0, 0), text, font=font)
        x = (WIDTH - (tr - tl)) // 2 - tl
        y = top + (STRIP_H - (tb - tt)) // 2 - tt
        draw.text((x, y), text, font=font, fill=TEXT)
        inputs.append({"shot": shot["shot"], "path": shot["image"], "sha256": facts["sha256"],
                       "width": facts["width"], "height": facts["height"], "focus_y": shot.get("focus_y", 0.5)})
        fonts.append(size)
    out.parent.mkdir(parents=True, exist_ok=True)
    board.save(out, format="PNG")
    record = {
        "format": f"storyboard_1x{count}_fixed",
        "board": spec["out"],
        "board_sha256": sha256(out),
        "width": WIDTH, "height": count * BLOCK_H,
        "boxes": picture_boxes(count),
        "captions": [caption_text(s) for s in spec["shots"]],
        "caption_font_px": fonts,
        "timing": [{"shot": s["shot"], "start": s["start"], "end": s["end"]} for s in spec["shots"]],
        "cut_times": [s["end"] for s in spec["shots"][:-1]],
        "duration": spec["shots"][-1]["end"],
        "inputs": inputs,
    }
    out.with_suffix(".layout.json").write_text(json.dumps(record, indent=2), encoding="utf-8")
    return record


# ---------------------------------------------------------------- verification

def verify_board(path):
    """Check a board's size and that every caption strip is the fixed ivory with dark text."""
    Image, _, _, ImageStat = _pil()
    facts = check_image(path, min_width=WIDTH, min_height=BLOCK_H)
    count = facts["height"] // BLOCK_H
    require(facts["width"] == WIDTH and facts["height"] == count * BLOCK_H and count in BOARD_SECONDS,
            f"Board must be {WIDTH} wide and 512, 1024 or 1536 high (1, 2 or 3 shots); got {facts['width']}x{facts['height']}")
    with Image.open(path) as im:
        rgb = im.convert("RGB")
    for box in picture_boxes(count):
        left, top, right, bottom = box["caption"]
        # top and bottom 4 rows of the strip carry no text and must be pure ivory
        for y0 in (top, bottom - 4):
            edge = ImageStat.Stat(rgb.crop((left, y0, right, y0 + 4)))
            mean = [round(v) for v in edge.mean]
            require(all(abs(m - c) <= 6 for m, c in zip(mean, IVORY)) and max(edge.stddev) < 6,
                     f"Shot {box['shot']} caption strip is not the fixed ivory #FBECD8 at rows {y0}-{y0 + 4} (mean {mean})")
        strip = rgb.crop((left, top, right, bottom))
        darkest, _ = strip.convert("L").getextrema()
        require(darkest < 70,f"Shot {box['shot']} caption strip has no dark caption text")
    return {**facts, "format": f"storyboard_1x{count}_fixed", "shot_count": count, "verified": True}


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = parser.add_subparsers(dest="command", required=True)
    c = sub.add_parser("compose"); c.add_argument("spec"); c.add_argument("--base-dir")
    v = sub.add_parser("verify"); v.add_argument("board")
    k = sub.add_parser("check-image"); k.add_argument("image")
    k.add_argument("--min-width", type=int, default=1); k.add_argument("--min-height", type=int, default=1)
    args = parser.parse_args(argv)
    try:
        if args.command == "compose":
            spec_path = Path(args.spec)
            spec = json.loads(spec_path.read_text(encoding="utf-8"))
            result = compose(spec, args.base_dir or spec_path.parent)
        elif args.command == "verify":
            result = verify_board(args.board)
        else:
            result = check_image(args.image, args.min_width, args.min_height)
    except StoryboardError as exc:
        print(json.dumps({"ok": False, "error": str(exc)}, indent=2))
        return 1
    print(json.dumps({"ok": True, **result}, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
