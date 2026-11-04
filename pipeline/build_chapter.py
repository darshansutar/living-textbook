"""Write package/chapter.json (and the player package) from script.json and the finished media.

Reads, from projects/<slug>/:
    intake.json              chapter metadata (book, class, subject, number, title)
    analysis.json            concept titles for the chapter map (script.json `concepts` overrides)
    episodes.json            episode titles, story world, which concepts each episode teaches
    script.json              the screens and narration lines (or several files via --script)
    audio/narration.json     measured narration (seconds, pauses) from harvest_audio.py
    plan.json, edit.json     clip -> screen mapping, shot overlays, segment timing (video captions)
    output/screens/<id>.mp4  one file per video screen (assemble_edit.py)
    stills/*.png             every still (lt-stills naming)

Writes projects/<slug>/package/:
    index.html player.js player.css   copied unchanged from player/
    chapter.json                      schema living-textbook/chapter@1 (skills/lt-package/chapter-schema.md)
    chapter.js                        the same data as a script, so index.html works from file:// offline
    media/screens, media/audio, media/stills

Episodes already in package/chapter.json are kept; the episodes in the given script(s) replace
theirs. Missing media are listed at the end (package.py refuses to pack until they exist).

Still naming (lt-stills):  cover, <ep>_title, <screen> (still/recap), <screen>_opt<k> (vote options,
optional for MCQ), <screen>_card<k>, <screen>_scene (MCQ, optional), <screen>_fact, map_<concept>.
Consequence clips are video screens with id <vote-id>.opt<k> (output/screens/<vote-id>.opt<k>.mp4).

    python pipeline/build_chapter.py --project projects/<slug> [--script script.json ...] [--no-compress]
"""
import argparse
import json
import re
import shutil
import subprocess
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
PLAYER_FILES = ("index.html", "player.js", "player.css")
IMG_EXT = (".png", ".jpg", ".jpeg", ".webp")
STILL_KEYS = {"image", "still", "result_still", "start", "result", "icon", "cover"}
VIDEO_KEYS = {"src", "result_video", "consequence_src"}
SENT_RE = re.compile(r"(?<=[.?!])\s+(?=[A-Z0-9\"'(])")


def load(path, default=None):
    if path.exists():
        return json.loads(path.read_text(encoding="utf-8"))
    if default is not None:
        return default
    raise SystemExit(f"{path} missing")


def stem(line_id):
    return line_id.replace(".", "_")


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        raise SystemExit(f"command failed: {' '.join(map(str, cmd[:6]))} ...\n{r.stderr[-1200:]}")


def probe(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
                         capture_output=True, text=True).stdout.strip()
    return round(float(out), 3) if out else 0.0


class Builder:
    def __init__(self, project, compress=True):
        self.p = project
        self.pkg = project / "package"
        self.compress = compress
        self.missing = []
        self.warnings = []
        self.narr = load(project / "audio" / "narration.json", {})
        self.lines = {}        # line id -> text
        self.plan = load(project / "plan.json", {"clips": []})
        self.edit = load(project / "edit.json", {"segments": []})

    # ---------- media ----------
    def _need(self, rel):
        if rel not in self.missing:
            self.missing.append(rel)

    def _fresh(self, src, dst):
        return dst.exists() and dst.stat().st_mtime >= src.stat().st_mtime

    def find_still(self, name):
        """name: 'stills/x.png', 'x.png' or a base name 'x'. Returns the source Path or None."""
        name = name.replace("\\", "/")
        if name.startswith("media/"):
            return None
        if name.startswith("stills/"):
            name = name[len("stills/"):]
        base = name.rsplit(".", 1)[0] if name.lower().endswith(IMG_EXT) else name
        for ext in IMG_EXT:
            f = self.p / "stills" / (base + ext)
            if f.exists():
                return f
        return None

    def still(self, name, optional=False):
        """Copy (and compress) a still into media/stills; return its package path, or None if optional and absent."""
        if not name:
            return None
        if name.startswith("media/"):
            return name
        src = self.find_still(name)
        base = Path(name.replace("\\", "/")).name
        base = base.rsplit(".", 1)[0] if base.lower().endswith(IMG_EXT) else base
        icon = base.startswith("map_")
        rel = f"media/stills/{base}{'.png' if icon or not self.compress else '.jpg'}"
        if src is None:
            if optional:
                return None
            self._need(f"stills/{base}.png")
            return rel
        if not self.compress:
            rel = f"media/stills/{base}{src.suffix.lower()}"
        dst = self.pkg / rel
        dst.parent.mkdir(parents=True, exist_ok=True)
        if not self._fresh(src, dst):
            if not self.compress:
                shutil.copy2(src, dst)
            elif icon:
                run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(src), "-vf",
                     "scale=256:256:force_original_aspect_ratio=decrease", str(dst)])
            else:
                run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(src), "-vf",
                     "scale='min(1600,iw)':-2", "-q:v", "3", str(dst)])
        return rel

    def video(self, screen_id, optional=False):
        src = self.p / "output" / "screens" / f"{screen_id}.mp4"
        rel = f"media/screens/{screen_id}.mp4"
        if not src.exists():
            if optional:
                return None
            self._need(f"output/screens/{screen_id}.mp4")
            return rel
        dst = self.pkg / rel
        dst.parent.mkdir(parents=True, exist_ok=True)
        if not self._fresh(src, dst):
            shutil.copy2(src, dst)
        return rel

    def video_path(self, value):
        """A video given by path in the script (activity result clips)."""
        v = value.replace("\\", "/")
        if v.startswith("media/"):
            return v
        name = Path(v).name
        sid = name[:-4] if name.endswith(".mp4") else name
        src = self.p / v if (self.p / v).exists() else self.p / "output" / "screens" / f"{sid}.mp4"
        rel = f"media/screens/{sid}.mp4"
        if not src.exists():
            self._need(v)
            return rel
        dst = self.pkg / rel
        dst.parent.mkdir(parents=True, exist_ok=True)
        if not self._fresh(src, dst):
            shutil.copy2(src, dst)
        return rel

    def seconds(self, line_id):
        rec = self.narr.get(stem(line_id))
        if rec:
            if rec.get("accepted") is False:
                self.warnings.append(f"narration {line_id} is marked not accepted")
            return rec.get("seconds") or 0.0
        f = self.p / "audio" / f"{stem(line_id)}.mp3"
        return probe(f) if f.exists() else 0.0

    def audio(self, line_ids, name=None):
        """One line -> media/audio/<stem>.mp3. Several lines -> joined into media/audio/<name>.mp3."""
        if not line_ids:
            return None
        if isinstance(line_ids, str):
            line_ids = [line_ids]
        srcs = [self.p / "audio" / f"{stem(l)}.mp3" for l in line_ids]
        for l, s in zip(line_ids, srcs):
            if not s.exists():
                self._need(f"audio/{stem(l)}.mp3")
        if len(line_ids) == 1:
            rel = f"media/audio/{stem(line_ids[0])}.mp3"
            if srcs[0].exists():
                dst = self.pkg / rel
                dst.parent.mkdir(parents=True, exist_ok=True)
                if not self._fresh(srcs[0], dst):
                    shutil.copy2(srcs[0], dst)
            return rel
        rel = f"media/audio/{stem(name or line_ids[0])}.mp3"
        if all(s.exists() for s in srcs):
            dst = self.pkg / rel
            dst.parent.mkdir(parents=True, exist_ok=True)
            if not dst.exists() or any(s.stat().st_mtime > dst.stat().st_mtime for s in srcs):
                inputs = []
                for s in srcs:
                    inputs += ["-i", str(s)]
                graph = "".join(f"[{i}:a]" for i in range(len(srcs))) + f"concat=n={len(srcs)}:v=0:a=1[a]"
                run(["ffmpeg", "-y", "-loglevel", "error", *inputs, "-filter_complex", graph, "-map", "[a]",
                     "-c:a", "libmp3lame", "-q:a", "2", str(dst)])
        return rel

    # ---------- captions ----------
    def line_captions(self, line_id, offset=0.0):
        text = self.lines.get(line_id)
        if text is None:
            self.warnings.append(f"narration line {line_id} not in script.json")
            return []
        dur = self.seconds(line_id)
        if dur <= 0:
            return [{"start": round(offset, 2), "end": round(offset + 4, 2), "text": text}]
        sents = [s.strip() for s in SENT_RE.split(text) if s.strip()]
        bounds = []
        if len(sents) > 1:
            rec = self.narr.get(stem(line_id), {})
            inner = [p for p in rec.get("pauses", []) if p[0] > 0.15 and p[1] < dur - 0.15]
            if len(inner) >= len(sents) - 1:
                inner = sorted(sorted(inner, key=lambda p: p[0] - p[1])[:len(sents) - 1])
                bounds = [(p[0] + p[1]) / 2 for p in inner]
            else:  # proportional to text length
                total = sum(len(s) for s in sents)
                acc = 0
                for s in sents[:-1]:
                    acc += len(s)
                    bounds.append(dur * acc / total)
        edges = [0.0] + bounds + [dur]
        return [{"start": round(offset + a, 2), "end": round(offset + b, 2), "text": s}
                for s, a, b in zip(sents, edges[:-1], edges[1:])]

    def lines_captions(self, line_ids):
        caps, t = [], 0.0
        for l in line_ids or []:
            caps += self.line_captions(l, t)
            t += self.seconds(l)
        return caps

    # ---------- video screen timing ----------
    def screen_timeline(self, sid):
        """[(segment, start time in the screen file, duration)] from edit.json, in order."""
        out, t = [], 0.0
        for seg in self.edit.get("segments", []):
            if seg.get("screen") != sid:
                continue
            if "spans" in seg:
                d = sum(e - s for s, e in seg["spans"])
            elif "card" in seg:
                a0, a1 = (seg.get("audio_in") or [0, None])
                a1 = a1 if a1 is not None else probe(self.p / seg["audio"])
                d = a1 - a0 + seg.get("pad", 0.4)
            else:
                d = probe(self.p / seg["insert"]) if "insert" in seg else 0.0
            out.append((seg, t, d))
            t += d
        return out

    def video_timing(self, sc):
        """Captions and overlays for a video screen, in screen time."""
        sid = sc["id"]
        timeline = self.screen_timeline(sid)
        line_start = {}
        if timeline:
            by_stem = {stem(l): l for l in self.lines}
            for seg, t, _ in timeline:
                if seg.get("audio"):
                    a0 = (seg.get("audio_in") or [0])[0]
                    lid = by_stem.get(Path(seg["audio"]).stem)
                    if lid and lid not in line_start:
                        line_start[lid] = t - a0
        else:  # no edit.json yet: lines back to back from 0
            t = 0.0
            for l in sc.get("narration", []):
                line_start[l] = t
                t += self.seconds(l)
        captions = []
        for l in sc.get("narration", []):
            if l in line_start:
                captions += self.line_captions(l, line_start[l])
            elif timeline:
                self.warnings.append(f"{sid}: narration {l} is not in any edit segment of this screen")
        overlays = []
        clips = {c["id"]: c for c in self.plan.get("clips", []) if c.get("screen") == sid}
        for seg, t, _ in timeline:
            clip = clips.get(seg.get("clip"))
            if not clip:
                continue
            a0 = clip["audio_interval"][0] if clip.get("narration") else 0.0
            for shot in clip.get("shots", []):
                for ov in shot.get("overlays", []):
                    o = dict(ov)
                    o["at"] = round(t + ov["at"] - a0, 2)
                    o["until"] = round(t + ov["until"] - a0, 2)
                    overlays.append(o)
        if not overlays:
            for ov in sc.get("overlays", []):
                o = {k: v for k, v in ov.items() if k != "during_line"}
                l = ov.get("during_line")
                if l and l in line_start:
                    o.setdefault("at", round(line_start[l] + 0.2, 2))
                    o.setdefault("until", round(line_start[l] + self.seconds(l), 2))
                if "at" in o:
                    overlays.append(o)
                else:
                    self.warnings.append(f"{sid}: overlay '{ov.get('text')}' has no time")
        return captions, sorted(overlays, key=lambda o: o["at"])

    # ---------- screens ----------
    def narration_of(self, sc):
        n = sc.get("narration") or []
        return [n] if isinstance(n, str) else list(n)

    def text_of(self, line_ids):
        return " ".join(self.lines.get(l, "") for l in line_ids).strip()

    def build_vote(self, sc, img_prefix=None, images_optional=False):
        sid = sc["id"]
        img_prefix = img_prefix or f"{sid}_opt"
        out = {"question": sc.get("question", "")}
        prompt = sc.get("prompt_line") or sc.get("question_line")
        if prompt:
            out["audio"] = self.audio(prompt)
        if sc.get("observation"):
            out["observation"] = True
        if sc.get("seconds"):
            out["seconds"] = sc["seconds"]
        opts = []
        for k, o in enumerate(sc.get("options", []), 1):
            o = {"text": o} if isinstance(o, str) else o
            opt = {"text": o.get("text", ""),
                   "image": self.still(o.get("image") or f"{img_prefix}{k}", optional=images_optional and not o.get("image")),
                   "correct": bool(o.get("correct"))}
            if opt["image"] is None:
                del opt["image"]
            if o.get("reveal_line"):
                opt["reveal_audio"] = self.audio(o["reveal_line"])
                opt["reveal_text"] = self.lines.get(o["reveal_line"], "")
            if o.get("consequence"):
                opt["consequence_src"] = self.video(f"{sid}.opt{k}")
            opts.append(opt)
        out["options"] = opts
        return out

    def build_mcq(self, sc):
        sid = sc["id"]
        out = {"question": sc.get("question", ""), "answer": sc.get("answer", 0)}
        img = self.still(sc.get("image") or f"{sid}_scene", optional=not sc.get("scenario") and not sc.get("image"))
        if img:
            out["image"] = img
        fb = sc.get("feedback", [])
        opts = []
        for k, o in enumerate(sc.get("options", [])):
            o = {"text": o} if isinstance(o, str) else dict(o)
            opt = {"text": o.get("text", "")}
            im = self.still(o.get("image") or f"{sid}_opt{k + 1}", optional=not o.get("image"))
            if im:
                opt["image"] = im
            line = o.get("feedback_line") or (fb[k] if k < len(fb) else None)
            if line:
                opt["feedback_audio"] = self.audio(line)
                opt["feedback_text"] = self.lines.get(line, "")
            opts.append(opt)
        out["options"] = opts
        return out

    def convert_activity(self, node, sid, key=None):
        """Rewrite an lt-activities screen: stills -> media/stills, clips -> media/screens,
        *line / *_line ids -> *audio, narration [] -> audio, observe -> a vote object."""
        if isinstance(node, list):
            return [self.convert_activity(v, sid, key) for v in node]
        if not isinstance(node, dict):
            if isinstance(node, str) and key in STILL_KEYS and (node.lower().endswith(IMG_EXT) or self.find_still(node)):
                return self.still(node)
            if isinstance(node, str) and key in VIDEO_KEYS:
                return self.video_path(node)
            return node
        out = {}
        for k, v in node.items():
            if k == "observe" and isinstance(v, dict):
                vote = dict(v, id=f"{sid}.observe")
                out[k] = self.build_vote(vote, img_prefix=f"{sid}_obs", images_optional=True)
            elif k == "narration" and v:
                ids = [v] if isinstance(v, str) else v
                out["audio"] = self.audio(ids, name=f"{sid}.intro")
            elif (k == "line" or k.endswith("_line")) and isinstance(v, str):
                ak = "audio" if k == "line" else k[:-5] + "_audio"
                out[ak] = self.audio(v)
                tk = "narration_text" if k == "line" else k[:-5] + "_text"
                out.setdefault(tk, self.lines.get(v, ""))
            else:
                out[k] = self.convert_activity(v, sid, k)
        return out

    def build_screen(self, sc, ep_id):
        t = sc.get("type")
        sid = sc["id"]
        out = {"id": sid, "type": t}
        for k in ("concept", "role", "teacher_note"):
            if sc.get(k):
                out[k] = sc[k]
        narr = self.narration_of(sc)
        if t == "title":
            out.update(title=sc.get("title", ""), subtitle=sc.get("subtitle", ""),
                       image=self.still(sc.get("image") or f"{ep_id}_title"))
        elif t == "video":
            out["src"] = self.video(sid)
            out["captions"], out["overlays"] = self.video_timing(sc)
        elif t == "still":
            out["image"] = self.still(sc.get("image") or sid)
            out["audio"] = self.audio(narr, name=sid)
            out["captions"] = self.lines_captions(narr)
            out["overlays"] = sc.get("overlays_timed", [])
        elif t == "vote":
            out.update(self.build_vote(sc))
        elif t == "reveal":
            out["vote"] = sc["vote"]
        elif t == "question_cards":
            out["prompt"] = sc.get("prompt", "")
            if sc.get("prompt_line"):
                out["audio"] = self.audio(sc["prompt_line"])
            out["cards"] = []
            for k, c in enumerate(sc.get("cards", []), 1):
                c = {"text": c} if isinstance(c, str) else c
                out["cards"].append({"text": c.get("text", ""), "image": self.still(c.get("image") or f"{sid}_card{k}")})
        elif t == "mcq":
            out.update(self.build_mcq(sc))
        elif t == "activity":
            if not sc.get("mode"):
                self.warnings.append(f"{sid}: activity {sc.get('activity')} has no mode yet (run lt-activities)")
                out.update(mode="mission", task=f"Activity {sc.get('activity', '')} is not specified yet", days=0, record=[])
            else:
                body = {k: v for k, v in sc.items() if k not in ("id", "type", "concept", "role", "teacher_note", "activity")}
                out.update(self.convert_activity(body, sid))
                if sc.get("activity"):
                    out["activity_ref"] = sc["activity"]
        elif t == "fact":
            text = sc.get("text") or re.sub(r"^\s*Did you know\?\s*", "", self.text_of(narr))
            out.update(title=sc.get("title", "Did you know?"), text=text,
                       image=self.still(sc.get("image") or f"{sid}_fact"),
                       audio=self.audio(narr, name=sid), source=sc.get("source", ""))
        elif t == "recap":
            out.update(audio=self.audio(narr, name=sid), image=self.still(sc.get("image") or sid),
                       text=sc.get("text") or self.text_of(narr))
            if sc.get("mcq"):
                m = dict(sc["mcq"], id=sc["mcq"].get("id", f"{sid}.q"))
                out["mcq"] = dict(self.build_mcq(m), id=m["id"])
        elif t == "score":
            out.update(text=sc.get("text", ""), audio=self.audio(narr, name=sid))
            if sc.get("scope"):
                out["scope"] = sc["scope"]
        else:
            self.warnings.append(f"{sid}: unknown screen type {t}")
        return {k: v for k, v in out.items() if v is not None}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--project", required=True)
    ap.add_argument("--script", action="append", help="script file(s), project-relative (default script.json)")
    ap.add_argument("--no-compress", action="store_true", help="copy stills unchanged instead of 1600 px JPG / 256 px icons")
    args = ap.parse_args()
    project = Path(args.project).resolve()
    b = Builder(project, compress=not args.no_compress)
    intake = load(project / "intake.json", {})
    analysis = load(project / "analysis.json", {})
    episodes = load(project / "episodes.json", {})
    scripts = [load(project / s) for s in (args.script or ["script.json"])]
    for s in scripts:
        for line in s.get("narration", []):
            b.lines[line["id"]] = line["text"]

    b.pkg.mkdir(parents=True, exist_ok=True)
    for f in PLAYER_FILES:
        src = REPO / "player" / f
        if not src.exists():
            raise SystemExit(f"player/{f} missing in the repo")
        shutil.copy2(src, b.pkg / f)

    existing = load(b.pkg / "chapter.json", {})
    meta = intake.get("chapter", {})
    world = episodes.get("story_world", {})
    chapter_id = scripts[0].get("chapter") or episodes.get("chapter") or project.name
    concepts_src = scripts[0].get("concepts") or [
        {"id": c["id"], "title": c.get("map_title") or c.get("title", c["id"])} for c in analysis.get("concepts", [])]
    concepts = []
    for c in concepts_src:
        icon = b.still(c.get("icon") or f"map_{c['id']}", optional=True)
        concepts.append({"id": c["id"], "title": c["title"], **({"icon": icon} if icon else {})})
    known_concepts = {c["id"] for c in concepts}

    ep_meta = {e["id"]: e for e in episodes.get("episodes", [])}
    order = [e["id"] for e in episodes.get("episodes", [])]
    built = {}
    for s in scripts:
        eps = s["episodes"] if "episodes" in s else [{"id": s.get("episode", "e1"), "screens": s.get("screens", [])}]
        for e in eps:
            m = ep_meta.get(e["id"], {})
            screens = [b.build_screen(sc, e["id"]) for sc in e["screens"]]
            used = []
            for sc in screens:
                c = sc.get("concept")
                if c in known_concepts and c not in used:
                    used.append(c)
            built[e["id"]] = {"id": e["id"], "title": e.get("title") or m.get("title", e["id"]),
                              "concepts": used, "screens": screens}

    merged = {ep["id"]: ep for ep in existing.get("episodes", [])}
    merged.update(built)
    ep_list = sorted(merged.values(), key=lambda ep: (order.index(ep["id"]) if ep["id"] in order else 999, ep["id"]))

    chapter = {
        "schema": "living-textbook/chapter@1",
        "language": intake.get("language", existing.get("language", "en")),
        "chapter": {
            "id": chapter_id,
            "book": meta.get("book", ""), "class": meta.get("class"), "subject": meta.get("subject", ""),
            "number": meta.get("number"), "title": meta.get("title", ""),
            "cover": b.still("cover"),
            "story_world": world.get("short") or world.get("place", ""),
        },
        "concepts": concepts,
        "settings": existing.get("settings", {"vote_seconds": 10, "captions": True}),
        "episodes": ep_list,
    }
    (b.pkg / "chapter.json").write_text(json.dumps(chapter, indent=2, ensure_ascii=False), encoding="utf-8")
    write_chapter_js(b.pkg)
    n = sum(len(ep["screens"]) for ep in ep_list)
    print(f"wrote package/chapter.json: {len(ep_list)} episode(s), {n} screens (built: {', '.join(built)})")
    for w in b.warnings:
        print("warning:", w)
    if b.missing:
        print(f"missing media ({len(b.missing)}) - produce these, then run build_chapter.py again:")
        for m in b.missing:
            print("  ", m)


def write_chapter_js(pkg):
    """chapter.js = chapter.json as a script, so the player works from file:// (no fetch needed)."""
    data = (pkg / "chapter.json").read_text(encoding="utf-8")
    json.loads(data)
    (pkg / "chapter.js").write_text("window.CHAPTER = " + data.strip() + ";\n", encoding="utf-8")


if __name__ == "__main__":
    main()
