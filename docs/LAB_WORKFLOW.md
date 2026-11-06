# Lab workflow - NCERT activities as interactive simulations

Written 6 November 2026, after the first lab (`labs/iodine-test`, Class 7 Science Activity 10.2) was approved. The rules for building a lab are in `skills/lt-lab/SKILL.md`.

## What a lab is

An NCERT activity done on the projector. The teacher taps what the class names (the spirit lamp, the test tube, the iodine). Each tap animates the real change. A wrong tap gets a kind correction, a safety question has to be answered right, and the class predicts before the result.

Labs are built with three.js (3D scene) and GSAP (motion), with all objects made in code, and run offline from the lesson folder.

## Where it goes in a lesson

```
hook video  ->  vote (predict)  ->  LAB (find out / learn)  ->  short answer video  ->  check
```

| Flow | Lab step is called | After the lab |
|---|---|---|
| Wonder (Science) | Find out | a short Answer video: the concept only, the demo is already done |
| Story (Social Science) | Find out | a short Answer video |
| Challenge (Maths) | Learn | nothing: the lab ends by solving the challenge; then New challenge |

Each lab replaces the longest demonstration scenes of an Answer video, so a topic needs fewer paid EN2 clips.

## Stages

| # | Stage | Who / tool | Output | Gate |
|---|---|---|---|---|
| 1 | Pick the activity | lt-chapter-analysis, lt-episode-plan | `episodes.json`: which loop gets a lab and which NCERT activity it is | user approves `episodes.json` |
| 2 | Design the steps | lt-lab, lt-script | `script.json` lab screen with `steps`: one tap, choose, predict or watch per step, 5-9 steps, the NCERT order and safety notes | user approves with the script |
| 3 | Narration | lt-audio (ElevenLabs via Codex) | one line per step, per feedback and per wrong choice, in the chapter's narrator voice | the lines are listened to |
| 4 | Build the scene | lt-lab (`labs/<id>/`) | objects in code, close camera views per step, effects as GSAP timelines, `STEPS` data | - |
| 5 | Automated run | headless Chrome over DevTools | every step played, including wrong taps, wrong choices and a wrong prediction; no console errors; screenshots of every key moment | all checks pass |
| 6 | Visual review | the assistant looks at every screenshot | framing, readable motion, clear tap targets, no overlaps | fixes are made and re-run |
| 7 | User test | the user plays it in Chrome or Edge | feedback | the user's yes |
| 8 | Into the lesson | build_chapter.py, package.py | the lab screen in `chapter.json`, `labs/<id>/` copied into the package, embedded check (Next locked until `lab-done`) | the lt-package teacher test |

## The rules learned from the first lab (user feedback, 6 Nov 2026)

1. **Camera:** a close view of the object for every step, and the camera follows the action after the tap.
2. **Physical motion:** cause before effect. A dropper squeezes, the drop swells, falls, splashes, then the colour spreads from each drop.
3. **Never make the teacher guess what to tap:**
   - a gold pulsing outline, a gold ring on the bench and a bobbing "Tap: …" label, with every other label faded;
   - a hand cursor on hover;
   - a pointing hand after 6 idle seconds, after a wrong tap or on Show me.
4. **Every step's text is also narrated,** with no silent screens.
5. **Inside a lesson the lab waits on its intro** until the teacher presses Next or Start.
6. **A prediction never states the rule it tests,** and nothing on screen (topic heading, bridge line) gives the answer before the reveal.

## Effort and cost (first lab)

| | Iodine test lab |
|---|---|
| Steps | 8 (6 taps, 1 safety choice, 1 class prediction) |
| Class time | about 4-5 minutes |
| Size | about 0.8 MB (three.js is most of it), no model files |
| Paid renders | none |
| Build | 1 day for the first lab, including the feedback round. Later labs reuse the kit: about half a day each. |

## Next engineering steps

- [ ] Move the shared parts into `labs/_kit/` when the second lab starts: vendor, fonts, css, step runner, targets, camera, the embed contract.
- [x] Each step's narration plays in the lab, with a Hear again button (done 2026-11-06, Science E1).
- [ ] Tidy the gold outline on glass objects: inner shells show through, as on the spirit lamp.
- [ ] Try it on a projector-class laptop and at 4:3.
- [ ] Add a time-slider step kind for slow activities (the three pots over two weeks).
