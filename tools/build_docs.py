"""Build the Living Textbook documents.

  * docs/skill-documents/<skill>.docx - one Word document per SKILL.md (python-docx)
  * docs/Living_Textbook_Workflow.pdf - illustrated workflow explanation (HTML printed by headless Chrome),
    using pilot images from a project folder when available

    python tools/build_docs.py [--pilot tests/stomata-style1] [--chrome PATH]
"""
import argparse
import base64
import io
import json
import re
import subprocess
import tempfile
from pathlib import Path

import markdown
from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.shared import Pt, RGBColor
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SKILL_ORDER = ["living-textbook-master", "lt-intake", "lt-script", "lt-audio", "lt-visual-plan", "lt-images",
               "lt-static-images", "lt-animation", "lt-review", "lt-assembly"]


def split_frontmatter(text):
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", text, re.S)
    meta = {}
    if not m:
        return meta, text
    for line in m.group(1).splitlines():
        if ":" in line:
            k, v = line.split(":", 1)
            meta[k.strip()] = v.strip()
    return meta, m.group(2)


# ---------------- Word ----------------
INLINE = re.compile(r"(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)")


def add_runs(par, text):
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    for part in INLINE.split(text):
        if not part:
            continue
        if part.startswith("**"):
            par.add_run(part[2:-2]).bold = True
        elif part.startswith("`"):
            r = par.add_run(part[1:-1])
            r.font.name = "Consolas"
            r.font.size = Pt(9.5)
        elif part.startswith("*") and len(part) > 2:
            par.add_run(part[1:-1]).italic = True
        else:
            par.add_run(part)


def md_to_docx(meta, body, out):
    doc = Document()
    style = doc.styles["Normal"]
    style.font.name = "Calibri"
    style.font.size = Pt(10.5)
    title = doc.add_heading(meta.get("name", out.stem), level=0)
    if meta.get("description"):
        p = doc.add_paragraph()
        r = p.add_run(meta["description"])
        r.italic = True
        r.font.color.rgb = RGBColor(0x55, 0x55, 0x55)
    p = doc.add_paragraph()
    r = p.add_run(f"Source: skills/{out.stem}/SKILL.md · Living Textbook workflow · 3 November 2026")
    r.font.size = Pt(8.5)
    r.font.color.rgb = RGBColor(0x88, 0x88, 0x88)

    lines = body.splitlines()
    i = 0
    while i < len(lines):
        line = lines[i]
        if not line.strip():
            i += 1
            continue
        if line.startswith("```"):
            code = []
            i += 1
            while i < len(lines) and not lines[i].startswith("```"):
                code.append(lines[i])
                i += 1
            p = doc.add_paragraph()
            r = p.add_run("\n".join(code))
            r.font.name = "Consolas"
            r.font.size = Pt(9)
            i += 1
            continue
        h = re.match(r"^(#{1,4})\s+(.*)", line)
        if h:
            level = len(h.group(1))
            doc.add_heading(re.sub(r"[*`]", "", h.group(2)), level=min(level, 3))
            i += 1
            continue
        if line.startswith("|"):
            rows = []
            while i < len(lines) and lines[i].startswith("|"):
                cells = [c.strip() for c in lines[i].strip().strip("|").split("|")]
                if not all(re.fullmatch(r":?-{2,}:?", c) for c in cells):
                    rows.append(cells)
                i += 1
            table = doc.add_table(rows=len(rows), cols=max(len(r) for r in rows))
            table.style = "Light Grid Accent 1"
            for ri, row in enumerate(rows):
                for ci, cell in enumerate(row):
                    par = table.cell(ri, ci).paragraphs[0]
                    add_runs(par, cell)
                    if ri == 0:
                        for run in par.runs:
                            run.bold = True
            doc.add_paragraph()
            continue
        b = re.match(r"^(\s*)[-*]\s+(.*)", line)
        n = re.match(r"^(\s*)\d+\.\s+(.*)", line)
        if b or n:
            m = b or n
            depth = len(m.group(1)) // 2
            style_name = ("List Bullet" if b else "List Number") + (" 2" if depth else "")
            par = doc.add_paragraph(style=style_name)
            add_runs(par, m.group(2))
            i += 1
            continue
        para = [line]
        i += 1
        while i < len(lines) and lines[i].strip() and not re.match(r"^(#|\||```|\s*[-*]\s|\s*\d+\.\s)", lines[i]):
            para.append(lines[i])
            i += 1
        add_runs(doc.add_paragraph(), " ".join(s.strip() for s in para))
    doc.save(out)


# ---------------- PDF ----------------
def img_tag(path, width=1600, caption=None, cls=""):
    if not path or not Path(path).exists():
        return ""
    im = Image.open(path).convert("RGB")
    im.thumbnail((width, width * 3))
    buf = io.BytesIO()
    im.save(buf, "JPEG", quality=82)
    data = base64.b64encode(buf.getvalue()).decode()
    cap = f"<figcaption>{caption}</figcaption>" if caption else ""
    return f'<figure class="{cls}"><img src="data:image/jpeg;base64,{data}">{cap}</figure>'


def grid(paths, cols, width=700, caption=None):
    cells = "".join(img_tag(p, width) for p in paths if Path(p).exists())
    cap = f"<figcaption>{caption}</figcaption>" if caption else ""
    return f'<figure><div class="grid" style="grid-template-columns:repeat({cols},1fr)">{cells}</div>{cap}</figure>' if cells else ""


CSS = """
@page { size: A4; margin: 16mm 15mm; }
body { font-family: 'Segoe UI', Arial, sans-serif; color: #1f2328; font-size: 10.5pt; line-height: 1.45; }
h1 { font-size: 26pt; margin: 0 0 6pt; } h2 { font-size: 16pt; border-bottom: 2px solid #1f6f5c; padding-bottom: 3pt; margin-top: 18pt; page-break-after: avoid; }
h3 { font-size: 12.5pt; margin: 12pt 0 4pt; page-break-after: avoid; } code { font-family: Consolas, monospace; font-size: 9pt; background: #f2f4f3; padding: 0 3px; }
pre { background: #f2f4f3; padding: 8px 10px; font-size: 8.6pt; white-space: pre-wrap; border-radius: 4px; }
table { border-collapse: collapse; width: 100%; margin: 6pt 0 10pt; font-size: 9.3pt; page-break-inside: auto; }
th, td { border: 1px solid #c9d1cd; padding: 4px 6px; vertical-align: top; text-align: left; } th { background: #e6efeb; }
tr { page-break-inside: avoid; }
figure { margin: 8pt 0 12pt; page-break-inside: avoid; } figure img { width: 100%; border-radius: 4px; display: block; }
figcaption { font-size: 8.8pt; color: #59636e; margin-top: 3pt; }
.grid { display: grid; gap: 6px; } .grid figure { margin: 0; }
.cover { height: 250mm; display: flex; flex-direction: column; justify-content: center; page-break-after: always; }
.cover .kicker { letter-spacing: .25em; color: #1f6f5c; font-weight: 700; font-size: 10pt; }
.cover p.lead { font-size: 13pt; color: #444; max-width: 150mm; }
.flow { display: flex; flex-wrap: wrap; gap: 6px; margin: 10pt 0; }
.flow div { background: #1f6f5c; color: #fff; border-radius: 6px; padding: 6px 9px; font-size: 9pt; font-weight: 600; }
.flow span { align-self: center; color: #1f6f5c; font-weight: 700; }
.note { background: #fff7e6; border-left: 4px solid #e0a100; padding: 6px 10px; margin: 8pt 0; }
.skill { page-break-before: always; } .meta { color: #59636e; font-style: italic; }
.half { width: 62%; }
"""


def build_pdf(pilot, chrome, out):
    md = lambda t: markdown.markdown(t, extensions=["tables", "fenced_code"])
    P = (ROOT / pilot) if pilot else None
    p = lambda rel: str(P / rel) if P else ""
    workflow = (ROOT / "docs" / "WORKFLOW.md").read_text(encoding="utf-8")
    stages = ["Intake", "Script", "Narration audio", "Visual plan", "Assets", "Storyboards", "Static images",
              "Animation (EN2 Ultra)", "Review", "Edit + stitch", "ZIP"]
    flow = "<div class='flow'>" + "<span>→</span>".join(f"<div>{i + 1}. {s}</div>" for i, s in enumerate(stages)) + "</div>"
    review = json.loads((P / "review.json").read_text(encoding="utf-8")) if P and (P / "review.json").exists() else {}
    cuts = json.loads((P / "renders" / "cuts.json").read_text(encoding="utf-8")) if P and (P / "renders" / "cuts.json").exists() else {}
    cut_rows = "".join(f"<tr><td>{k}</td><td>{v['cuts_planned']}</td><td>{v['cuts_observed']}</td><td>{review.get(k, {}).get('visual_status', '')}</td></tr>" for k, v in cuts.items())

    html = [f"<html><head><meta charset='utf-8'><style>{CSS}</style></head><body>"]
    html.append("<section class='cover'><div class='kicker'>EN2 · STARLING AUTOMATION</div><h1>Living Textbook</h1>"
                "<p class='lead'>A narration-only workflow that turns a lesson script into an animated, interactive roleplay: "
                "Codex images and ElevenLabs narration, the Starling storyboard method, EN2 Ultra animation, static cover and option images, "
                "FFmpeg assembly and a delivery ZIP.</p><p>Workflow explanation · 3 November 2026</p>" + flow + "</section>")
    html.append("<h2>1. The flow at a glance</h2>" + md(workflow.split("## What changed from Starling")[0].split("## The flow", 1)[1]))
    html.append("<h2>2. What changed from Starling</h2>" + md("## x" + workflow.split("## What changed from Starling", 1)[1].split("## Rules that never bend")[0]).replace("<h2>x</h2>", ""))
    html.append("<h2>3. Rules that never bend</h2>" + md(workflow.split("## Rules that never bend", 1)[1].split("## Pilot evidence")[0]))

    if P:
        html.append("<h2>4. Walkthrough: the stomata pilot</h2>")
        html.append("<h3>Intake: style reference (style only)</h3><p>The style reference supplies the faceted low-poly look. It never supplies a character: this lesson has no cast, so nothing in the production shows people.</p>")
        html.append("<p><i>Style used: faceted low-poly 3D with hard-edged planes, painterly warm shading on each facet, saturated colours "
                    "and bold flat backgrounds. The reference image itself is not reproduced in this public document.</i></p>")
        html.append("<h3>Narration audio first</h3><p>ElevenLabs eleven_v3 (Ritika) through Codex; harvest_audio.py downloaded the files and measured the sentence pauses that set every shot boundary: N1 7.92 s, N2 13.68 s (pauses at 4.28, 9.52, 11.23 s).</p>")
        html.append("<h3>Assets from Codex</h3>")
        html.append(grid([p("assets/env_study_master.png"), p("assets/prop_leaf_macro.png"), p("assets/prop_plant_cutaway.png"),
                          p("assets/prop_chloroplast.png"), p("assets/prop_elodea_beaker.png")], 3, 600,
                         "Scene master and science sheets (macro, cutaway, cross-section, experiment). Particle designs stay fixed across every shot."))
        html.append("<h3>Storyboards: panels by Codex, captions by code</h3><p>Codex draws each black-and-white panel; assemble_boards.py stacks them and prints the SHOT / time / CAMERA / ACTION strip from plan.json so the text is exact and matches the prompt.</p>")
        html.append(img_tag(p("storyboards/C1-stomata_storyboard.png"), 900, "C1 stomata, 1x3 board: leaf tips up → stomata take in CO2 → water rises from the roots.", "half"))
        html.append("<h3>Static roleplay images</h3><p>The cover and one text-free picture per option; the player overlays the option text. Right and wrong options get equal visual weight.</p>")
        html.append(grid([p("static/cover.png")], 1, 1200, "Cover page."))
        html.append(grid([p(f"static/option_{k}.png") for k in "ABCD"], 4, 500, "Answer options A-D."))
        html.append(grid([p(f"static/option_r{k}.png") for k in range(1, 6)], 5, 400, "Reason options r1-r5."))
        html.append("<h3>EN2 Ultra render and review</h3>")
        html.append(img_tag(p("renders/C1-stomata.review.png"), 1200, "C1 render at 2 frames per second: three shots, hard cuts at 3.71 s and 8.29 s."))
        html.append(f"<table><tr><th>Clip</th><th>Planned cuts (s)</th><th>Observed cuts (s)</th><th>Verdict</th></tr>{cut_rows}</table>")
        html.append("<div class='note'>EN2 placed the C2 cut 2.25 s early. build_edit.py rebuilt the spans from the observed cut and carried the shortfall into the next shot, so the clip was kept without a repair render. Re-time first, repair second.</div>")
        html.append("<h3>Edit, stitch, package</h3><p>assemble_edit.py trims each shot's buffer, joins the shots with hard cuts, discards EN2 sound and lays the original narration underneath; the optional cover opens the video. package.py writes roleplay.json and the ZIP with a SHA-256 manifest.</p>")
        html.append(img_tag(p("output/final.contact.png"), 1200, "Final stitched video (cover + three clips), one frame per second."))

    html.append("<h2>5. Pilot evidence</h2>" + md(workflow.split("## Pilot evidence", 1)[1].split("\n", 1)[1]))
    for name in SKILL_ORDER:
        meta, body = split_frontmatter((ROOT / "skills" / name / "SKILL.md").read_text(encoding="utf-8"))
        html.append(f"<section class='skill'><h2>Skill: {name}</h2><p class='meta'>{meta.get('description', '')}</p>{md(body)}</section>")
    html.append("</body></html>")

    with tempfile.TemporaryDirectory() as tmp:
        page = Path(tmp) / "workflow.html"
        page.write_text("".join(html), encoding="utf-8")
        subprocess.run([chrome, "--headless=new", "--disable-gpu", "--no-pdf-header-footer", f"--print-to-pdf={out}", page.as_uri()],
                       check=True, capture_output=True)
    print(f"wrote {out.relative_to(ROOT)} ({out.stat().st_size / 1e6:.1f} MB)")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--pilot", help="repo-relative project folder with pilot media for illustrations")
    ap.add_argument("--chrome", default="C:/Program Files/Google/Chrome/Application/chrome.exe")
    args = ap.parse_args()
    out_dir = ROOT / "docs" / "skill-documents"
    out_dir.mkdir(parents=True, exist_ok=True)
    for name in SKILL_ORDER:
        meta, body = split_frontmatter((ROOT / "skills" / name / "SKILL.md").read_text(encoding="utf-8"))
        md_to_docx(meta, body, out_dir / f"{name}.docx")
        print(f"wrote docs/skill-documents/{name}.docx")
    build_pdf(args.pilot, args.chrome, ROOT / "docs" / "Living_Textbook_Workflow.pdf")


if __name__ == "__main__":
    main()
