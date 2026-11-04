"""Extract an NCERT chapter PDF for analysis (lt-chapter-analysis).

Writes into projects/<slug>/source/:
  chapter.pdf            copy of the input (or the first input when several are joined)
  chapter.txt            full text, one "=== PAGE n (book page p) ===" block per page
  pages/p<NN>.png        one picture per page (for looking at figures, characters and layout)
  outline.json           machine-found markers with page numbers: numbered sections, activities,
                         figures, tables, NCERT box headings (Think about it, Math Talk, Know a
                         Scientist ...) and the end-of-chapter question block

The outline is a starting point for the analysis, not the analysis itself: the analyst still reads
the whole text and the page pictures.

    python pipeline/extract_chapter.py --project projects/<slug> path/to/chapter.pdf [more.pdf ...]
"""
import argparse
import hashlib
import json
import re
import shutil
from pathlib import Path

try:
    import pymupdf
except ImportError:  # older installs
    import fitz as pymupdf

# Box headings used across the new NCERT books (Curiosity, Exploring Society, Ganita Prakash).
BOXES = [
    "THINK ABOUT IT", "LET'S EXPLORE", "LET’S EXPLORE", "LET'S REMEMBER", "LET’S REMEMBER",
    "DON'T MISS OUT", "DON’T MISS OUT", "FASCINATING FACTS", "KNOW A SCIENTIST", "DIVE DEEPER",
    "Math Talk", "Figure it Out", "Try This", "Puzzle", "Game", "In a Nutshell", "Before we move on",
    "The Big Questions", "Let Us Enhance Our Learning", "Questions and activities", "Exploratory Projects",
    "Caution",
]
END_BLOCKS = ["Let Us Enhance Our Learning", "Questions and activities", "Figure it Out", "Exercises"]

SECTION_RE = re.compile(r"^(\d{1,2}(?:\.\d{1,2}){1,2})\s+([A-Z][A-Za-z‘’'̀-ͯ ,:?!-]{2,80})$")
ACTIVITY_RE = re.compile(r"^Activity\s+(\d{1,2}\.\d{1,2})\s*:?\s*(.*)$", re.I)
FIG_RE = re.compile(r"^Fig\.?\s*(\d{1,2}\.\d{1,2}(?:\.\d)?)\s*:?\s*(.*)$", re.I)
TABLE_RE = re.compile(r"^Table\s+(\d{1,2}\.\d{1,2})\s*:?\s*(.*)$", re.I)
BOOK_PAGE_RE = re.compile(r"^\d{1,3}$")


def norm(s):
    return re.sub(r"\s+", " ", s.replace("ﬁ", "fi").replace("ﬂ", "fl").replace(" ", " ")).strip()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--project", required=True)
    ap.add_argument("--dpi", type=int, default=80)
    ap.add_argument("pdfs", nargs="+")
    a = ap.parse_args()

    proj = Path(a.project)
    src = proj / "source"
    pages_dir = src / "pages"
    pages_dir.mkdir(parents=True, exist_ok=True)

    text_out, outline, page_no = [], {"sections": [], "activities": [], "figures": [], "tables": [],
                                      "boxes": [], "end_questions_page": None}, 0
    inputs = []
    for pdf in a.pdfs:
        p = Path(pdf)
        inputs.append({"file": str(p), "sha256": hashlib.sha256(p.read_bytes()).hexdigest()})
        doc = pymupdf.open(p)
        for page in doc:
            page_no += 1
            raw = page.get_text()
            lines = [norm(l) for l in raw.splitlines()]
            lines = [l for l in lines if l]
            book_page = next((l for l in lines[:3] + lines[-3:] if BOOK_PAGE_RE.match(l)), None)
            text_out.append(f"=== PAGE {page_no} (book page {book_page or '?'}) ===\n" + "\n".join(lines))
            page.get_pixmap(dpi=a.dpi).save(str(pages_dir / f"p{page_no:02d}.png"))
            for i, l in enumerate(lines):
                pair = l + " " + lines[i + 1] if i + 1 < len(lines) else l  # headings split over two lines
                for rx, key in ((ACTIVITY_RE, "activities"), (FIG_RE, "figures"), (TABLE_RE, "tables")):
                    m = rx.match(l)
                    if m:
                        outline[key].append({"id": m.group(1), "title": m.group(2)[:100], "page": page_no})
                m = SECTION_RE.match(l)
                if m and not l.lower().startswith(("fig", "table", "activity")) and not re.search(r"\d\s*[+\-x×=]\s*\d", l):
                    outline["sections"].append({"id": m.group(1), "title": m.group(2)[:100], "page": page_no})
                for b in BOXES:
                    if any(x.lower() == b.lower() or x.lower().startswith(b.lower() + " ") for x in (l, pair))                             and not (i and (lines[i - 1] + " " + l).lower().startswith(b.lower())):
                        outline["boxes"].append({"box": b.replace("’", "'"), "page": page_no})
                        if b in END_BLOCKS and b != "Figure it Out" and outline["end_questions_page"] is None:
                            outline["end_questions_page"] = page_no
        if len(inputs) == 1:
            shutil.copyfile(p, src / "chapter.pdf")

    # de-duplicate (titles repeat in running heads)
    for key in ("sections", "activities", "figures", "tables"):
        seen, keep = set(), []
        for item in outline[key]:
            if item["id"] not in seen:
                seen.add(item["id"])
                keep.append(item)
        outline[key] = keep

    (src / "chapter.txt").write_text("\n\n".join(text_out), encoding="utf-8")
    outline["inputs"] = inputs
    outline["page_count"] = page_no
    (src / "outline.json").write_text(json.dumps(outline, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"{page_no} pages -> {src}")
    print(f"sections {len(outline['sections'])}, activities {len(outline['activities'])}, "
          f"figures {len(outline['figures'])}, tables {len(outline['tables'])}, boxes {len(outline['boxes'])}, "
          f"end questions page {outline['end_questions_page']}")


if __name__ == "__main__":
    main()
