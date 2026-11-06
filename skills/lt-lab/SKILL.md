---
name: lt-lab
description: Build a Living Textbook lab - an NCERT activity turned into an interactive three.js simulation the teacher plays on the projector (tap the object the class names, watch the change, predict before the reveal), with Starling-style guide card, clear tap targets, close camera per step, narrated steps, and the embed contract that puts it inside a lesson as a "lab" screen. Use for every NCERT activity, practical or manipulative; Maths topics use labs instead of storyboard animation.
---

# Living Textbook - Labs (interactive simulations)

A **lab** is one NCERT activity done on screen. The teacher projects it and taps what the class tells them to use. Each correct tap animates the real change (water boils, colour drains, iodine turns the leaf blue-black). Wrong taps get a kind correction, and the class predicts before the result.

- **Reference lab:** `labs/iodine-test/`, Activity 10.2 of Class 7 Science. The user approved it on 2026-11-06 ("this is working cool").
- **Inspiration:** https://starling.en2.ai/v2/smart-switch.html.
- **Workflow:** `docs/LAB_WORKFLOW.md`.

## Where a lab sits in the loop

The lab is the third step of the topic loop, after the class has committed to a prediction (`skills/lt-script/flows.md`):

| Flow | 1 hook video | 2 vote | 3 **lab** | then | 4 check |
|---|---|---|---|---|---|
| Wonder (Science) | the surprise | Guess | **Find out**: do the NCERT activity | short Answer video (the concept, no demo) | Check |
| Story (Social Science) | the story moment | Vote | **Find out**: measure or read the instrument | short Answer video | Check |
| Challenge (Maths) | the job to do (a narrated still is enough) | Try | **Learn**: the tool as a manipulative, then solve the job in the lab | none; the lab ends on the solved job | New challenge |

The vote before a lab is a **prediction** (`predict: true`): the class commits to an answer, nothing is revealed, and a neutral line leads into the lab.

In `script.json` a lab is a screen `{ "id": "e1.c2.lab", "type": "lab", "lab": "iodine-test", "concept": "c2", "narration": ["e1.c2.lab.s1.say", ...] }`. `build_chapter.py` copies `labs/<id>/` into the package. The player shows it full screen and unlocks Next when the lab reports it is finished.

## Design the lab (before any code)

Write a steps table in the script (`script.json` screen `type: "lab"`, field `steps`) and get the user's yes together with the script. Each step must be one of these four kinds:

| Kind | What the teacher does | Rule |
|---|---|---|
| **tap** | taps one object on the bench | One object, named in the hint ("Tap the spirit lamp"). The change it causes is visible within 1 s. |
| **choose** | taps the class's answer to a safety or method question | One right option; the wrong ones are real mistakes, corrected kindly. Next stays locked until the right one is picked. |
| **predict** | taps the answer most of the class chose | There is no right or wrong yet. The question never states the rule being tested (not "where there is starch, iodine turns blue-black"); the reveal teaches it. The right option is not always A. The reveal step names the class's choice ("Many of you said..."). |
| **watch** | nothing, while a slow change plays or a time slider moves | Use it for slow activities (two weeks in a pot) and keep it under 8 s. |

- **Length:** 5-9 steps, 3-6 minutes in class. Follow the NCERT activity's own order and materials. Facts and safety notes come from the chapter.
- **Narration:** every step's guide line and every feedback line is a narration line in `script.json`, generated with the chapter's narrator voice (lt-audio). Keys per step: `sN.say` (guide line, spoken when the step opens), `sN.ok` (result), `sN.optA`/`optB` (choice feedback), `sN.pick` (after the class prediction), `sN.right`/`sN.wrong` (the reveal, depending on the prediction), plus `end` (summary) and `miss` (wrong tap). The on-screen text and the spoken words are identical. `build_chapter.py` copies the lines to `media/audio/` and passes the prefix (`lines`). The lab plays `<prefix><key>.mp3` and has a Hear again button.
- **Guide:** a character from the episode's cast who would really run this activity, e.g. Shanta Teacher for a school demonstration. The guide never speaks in the story videos; in the lab the guide's lines are narration.
- **No text in the 3D scene.** Labels, numbers and readouts are HTML on top of the scene, so they stay exact and translatable.

## Build it

One folder per lab, `labs/<id>/`, that runs offline from `file://`:

```
labs/<id>/
  index.html   page shell: title, step bar, guide card, status pill
  lab.css      Starling tokens (lt-player-design); embed rules at the end
  lab.js       scene, objects, views, effects, STEPS
  vendor/      three.min.js (r158, classic build) and gsap.min.js (3.12.5); both run from file://
  fonts/       Rajdhani + Noto Sans (copied from player/fonts)
```

Copy `labs/iodine-test/` as the starting point. When the second lab is built, move the shared parts (vendor, fonts, css, the step runner, the target and camera helpers) into `labs/_kit/`, so each lab is only its scene and steps.

**Objects are built in code** from simple shapes (lathe, cylinder, box, extruded outlines):
- Glassware: beakers, test tubes, flasks, tripod and gauze, spirit lamp, droppers, plates, bowls.
- Instruments: rain gauge, thermometers, balance, ruler.
- Number manipulatives: place-value blocks, number lines.

Style:
- Toon shading with a 3-tone ramp and a dark outline (a back-face shell), so labs match the painted lessons.
- Glass is a faint tint plus a light outline.
- Liquids are inner meshes whose colour and level animate.
- Contact shadows are soft dark discs.

**Outside models are allowed only if** the licence allows web delivery (prefer CC0: Poly Haven, Kenney, ambientCG). A Fab asset needs its licence checked one by one, because a web lesson ships the file to every browser. Reduce any model to a few thousand triangles and convert it to glTF. Record every source and licence in `labs/<id>/ASSETS.md`.

### Camera

- Every step has its own close view of the object to tap (`VIEWS`, `view(name)`), framed left of the guide card.
- After the tap, the camera follows the action. It moves into the water bath to watch the colour change, and goes close on the leaf for the drops, with room above it for the dropper.
- Never leave the object being talked about small or off-screen. This was the user's first feedback on the prototype.

### Showing what to tap

All of these are required (user feedback, 2026-11-06):
- The target gets a **pulsing gold outline**, a **pulsing gold ring** on the bench under it, and a **gold bobbing label** "Tap: Spirit lamp" with a hand icon. Every other label fades.
- On a computer, the cursor shows a hand over any tappable object.
- A **pointing hand** lands on the target after 6 idle seconds, after a wrong tap, or on "Show me".
- A wrong tap flashes that object red and says "Not that one. Tap the spirit lamp: it is glowing gold."

### Motion must look physical

- Use GSAP timelines with easing that suits the action: falling uses `power2.in`, settling uses `power2.out`, slow colour change uses `sine.inOut`.
- Show the cause before the effect. For example, a dropper is lifted out of the bottle, its bulb squeezes, a drop swells at the tip, falls, splashes flat with a ripple, then the colour spreads outward from each drop. (The prototype's first drops "felt off" because they appeared in mid-air and the colour changed all at once.)
- A tween that sets a start state must not show it before its turn (`immediateRender: false` on `fromTo` in a timeline).

### State and the guide card

- **Status pill:** shows the current state in plain words ("Leaf: pale · Alcohol: green").
- **Guide card:** step title, guide line, tap hint with "Show me", choices, feedback, Next.
- **Step bar:** one pip per step.

## The embed contract (inside a lesson)

- The player opens `labs/<id>/index.html?embed=1`.
- In embed mode the lab skips its own title and starts at step 1. Its step bar and guide card sit below the lesson's rail (`top: calc(5.2vw + .8rem)`), and the status pill sits above the lesson's Back button.
- When the class finishes, the lab sends `window.parent.postMessage({ lt: 'lab-done', lab: '<id>' }, '*')`. The player then unlocks and pulses Next.
- At the end, the lab's own button reads **Continue** in embed mode and posts `{ lt: 'lab-next' }`; the player moves the lesson on. It never restarts the lab inside a lesson (user feedback, 2026-11-06). On its own the button reads "Do it again".
- The lab also works on its own (no `embed`), for teachers and for testing.

## Test it (before showing the user)

1. `node --check labs/<id>/lab.js`.
2. **An automated run in headless Chrome over the DevTools protocol**, not `chrome --screenshot`, which does not run animations. Play every step, including:
   - one wrong tap per tap step;
   - every wrong choice;
   - a wrong class prediction.
   Then check that the feedback, the locked or unlocked Next, and the status text are right, and that there are **no console errors**.
3. **Screenshots of every key moment** (the target highlighted, the pointer after a wrong tap, each change mid-way and at the end), looked at for:
   - framing: the object is large and clear of the card;
   - motion that reads correctly;
   - labels that do not overlap.
4. **Embedded check:** a copy of the package with the lab screen inserted. The rail shows the right step name, Next is locked until `lab-done`, and nothing overlaps.
5. **Size and speed:** under about 1.5 MB per lab without narration. It should run smoothly on a projector-class laptop (pixel ratio is capped at 1.5, no shadows, low-poly).

## Subject notes

- **Science:** NCERT activities with apparatus (most chapters). The safety choices come from the chapter's own cautions.
- **Social Science:** instruments and measurement (thermometer, rain gauge, wind vane, maps and scale), reading data tables and charts, choosing a site or a route. NCERT end questions that ask "decide" or "find" make good labs.
- **Maths:** manipulatives (place-value blocks, number lines that zoom, balances, rulers, fraction strips, money). The lab is the Learn step and ends by solving the episode's challenge with exact numbers drawn as HTML overlays. Maths topics do not need storyboard animation: the hook can be a narrated still, and the concept lives in the lab.
