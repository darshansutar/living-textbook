---
name: lt-intake
description: Living Textbook intake - collect and record the NCERT chapter PDF, class, subject, regional focus and style reference before any analysis or generation. The narrator voice is asked later, at the audio stage.
---

# Living Textbook - Intake

Ask for these and wait for real answers. Reuse answers already given for the same chapter.

1. **Chapter:** "Please share the NCERT chapter PDF." (A chapter split over several PDFs is fine; keep the book's page order.)
2. **Class and subject:** read them from the PDF (running head, e.g. "Curiosity | Textbook of Science | Grade 7") and confirm with the user rather than asking cold.
3. **Region:** "Which region should the examples come from?" Default when the user has no preference: rural Karnataka, Maharashtra and Gujarat, one region per chapter story world.
4. **Style:** "Please share the style reference image." If none is given, propose the house default and get a yes: *NCERT-illustration-inspired, enhanced - clean 2D illustration, soft cel shading with gentle depth, warm natural Indian daylight, earthy saturated palette, simple readable shapes for projection.*

The narrator voice is **not** asked here; lt-audio asks it once the script is approved.

## Reading the chapter

```
python pipeline/extract_chapter.py --project projects/<slug> "<chapter.pdf>"
```

Writes `source/chapter.pdf`, `source/chapter.txt` (text per page), `source/pages/pNN.png` (page pictures) and `source/outline.json` (sections, activities, figures, tables, NCERT box headings). Look at the page pictures: the figures, the illustration style and the characters the book uses.

## Style reference

Save it to `refs/`, look at it and write a one-paragraph style description (shapes, shading, palette, lighting, background). It supplies **style only**: never its character, face, identity or props. The book's own illustrations are inspiration for the house style; never copy NCERT's characters.

## Record

`intake.json` (template `templates/intake.example.json`):

- `chapter`: book, class, subject, chapter number and title, PDF path(s) and SHA-256
- `region`: the chosen state(s) and any user notes (village, crops, festivals)
- `language`: `"en"` (narration is built for later translation)
- `style`: reference path, SHA-256, written description, `"use": "style_only"`
- `answers`: the user's actual words per question; `confirmed_by: "user"`, `status: "complete"`

Do not invent confirmations.
