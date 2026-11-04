---
name: lt-activities
description: Specify Living Textbook activity screens - do-along (class does it live with on-screen steps and timers), simulator (one of four reusable templates configured by data), video fallback, and village mission (take-home task) - from the NCERT activities, with safety and local substitutes.
---

# Living Textbook - Activities

Activities are a different mode from the lesson film: the screen becomes a **coach or a tool**, not a story. Input: activity modes in `episodes.json`, activity details in `analysis.json`. Output: each `activity` screen in `script.json` filled in. No new player code is ever written for an activity.

## Do-along (live in class)

| Field | Content |
|---|---|
| `materials` | household / school items, with local names (Betadine, katori, steel plate, ruler) |
| `safety` | one line if anything needs care; never flames, alcohol, strong chemicals or blades for students |
| `steps[]` | 3-7 steps: `text` (<= 15 words, imperative), `still` (picture of the step, no text), optional `timer_s` |
| `observe` | a `vote`: "What did you see?" with observation options; the expected result marked |
| `expected` | what should happen and why, in one line (also the fallback if the class cannot do it today) |
| `narration` | intro line ID(s); per step `line` (optional); `expected.result_line` |

The teacher can tap **"Show result"** when the class cannot do the activity; the player then shows the expected-result still or clip. Every do-along has one.

## Simulator (on screen, four templates only)

| Template | Shows | Config |
|---|---|---|
| `compare_setups` | 2-4 set-ups side by side; toggles for conditions; "run" shows each outcome | `setups[]`: label, conditions (e.g. light/water/CO2 on-off), outcome still per state; `run_label` ("2 weeks later") |
| `zoom_scale` | a ruler, gauge or number line the class zooms into (units -> tenths -> hundredths) | `min`, `max`, `unit`, `levels` (1, 0.1, 0.01), `marks[]` to place (value, label still) |
| `dial` | an instrument dial or column whose value the teacher drags; zones change the outcome | `min`, `max`, `unit`, `zones[]` (from, to, label, outcome still), `start` |
| `tap_diagram` | a still with hotspots; tap reveals a label and one narration line | `image`, `hotspots[]` (x, y, w, h as %, label, narration line ID) |

Optional for `compare_setups`: `states[]` per set-up (`conditions`, `result` still) lets the teacher toggle conditions and see that outcome. Simulator screens may also have a `title` and an intro `narration`; `tap_diagram` hotspots give their narration as `line`.

All pictures inside a simulator are text-free stills from lt-stills; labels and numbers are drawn by the player. If an activity fits none of the templates, use **video** (role `investigate`) instead.

## Video (fallback)

A short clip of the NCERT set-up doing its thing (20-40 s, narrated), planned like any video screen. Use for unsafe or slow activities that need real motion (microscope peel, matchstick test).

## Mission (take-home)

| Field | Content |
|---|---|
| `task` | one sentence the child can do at home or in the village |
| `days` | how long |
| `record` | what to note (a small table: day, observation) |
| `report_back` | the question the teacher asks next class (becomes that episode's recap prompt when possible) |
| `still` | a picture of the task in the story world |

## Rules

- Keep the NCERT steps and expected observation; change only materials (to safe local substitutes) and context.
- Teacher-demonstration activities and anything with a Caution box are never do-along for students.
- Every activity says which concept it serves and where it sits (loop investigate step or finale practice).
