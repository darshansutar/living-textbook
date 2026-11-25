# Smart switch: focus sample (2026-11-25)

Open `index.html` in Chrome (runs from `file://`, no server, no network). One chapter, **"Wire it, power it, test it"**, 4 steps, cut from the
9-step job in `iti-smart-switch-living-textbook/labs/smart-switch/` (that folder is untouched). Same figure, same lines, same narration files
(`audio/`, plays on the first tap; `Hear again` replays).

| Step | Verb | Close view | Taps |
|---|---|---|---|
| 1 Feed the switch | connect | `terminals` | red wire to L, black wire to N |
| 2 Connect the lamps | connect | `terminals` | hall wire to L1, balcony wire to L2 |
| 3 Power on | switch on | `mcb` then `plate` | lights MCB |
| 4 Test by phone | test | `lamps` | Balcony light in the app |

Colour call: charcoal everywhere; **amber** = what to tap (and where it goes); **warm yellow** only while a lamp is on; **red** only for live/danger;
**green** only for "safe to touch"; **blue** only for Wi-Fi and the app. Wire colours stay because the lesson is about wire colours.

## Audit: original against the four rules

| Rule | Before (original, played end to end) | After (this sample) |
|---|---|---|
| 1 Colour economy | Charcoal base and the amber/red/green/blue semantics were already right. But the cream socket, switch plate and breakers were the brightest things on screen at every step, whether or not they mattered. | Same palette. Anything outside the step's focus is darkened (`brightness(.24)`), conduits always, so the only bright things are the target, its destination and the part the step is about. |
| 2 Lit target dims the rest | **Absent.** The target got a thin amber outline that was hard to see (on the terminal step the wire to tap was not visibly lit; only the destination screw glowed, faintly). Look-alike breakers were equally bright. | Target gets a pulsing amber glow (drop-shadow); the destination terminal gets a pulsing amber ring; the two look-alike breakers step back to 50 %; everything off-focus is dimmed with a 0.7 s fade. A hand points after 9 s of nothing (before: only on Show me). |
| 3 One verb, one close view, 3-4 steps | One chapter of **9 steps**; step 6 held four taps under one title. Views were loose: the MCB step kept a lamp in frame, the terminal step carried the socket, the phone step the router and socket. | 4 steps, one verb each, 4 tight views (`terminals`, `mcb`, `plate`, `lamps`) framed on the part and its context only. |
| 4 Light that behaves | Lamp pool and a blinking Wi-Fi light existed. A lamp came on as a flat fade; the Wi-Fi light was a 3 px dot; the blue state was easy to miss. | Lamp *strikes* (flicker, then settles warm) with a second wide warm wash; Wi-Fi light gets a blue halo (screen blend) and slow rings: fast blink while pairing, steady when online. Power-off tag, MCB lever, bulb and pill all change together. |
| Status pill | "Danger: power ON" stayed identical through pairing and online. | One fact per state: "Power OFF · safe to touch" (green), "Danger: power ON" (red, pulsing), "Power ON · switch pairing", "Power ON · switch online". Larger. |
| Console | Failed audio requests when opened without `?lines=` (silent 404s). | Zero errors: narration ships in `audio/`, lines without a recording stay silent. |

## What changed (files)
- `lesson.js`: regenerated (4 steps, `prelude` ops so the chapter starts mid-job with power off, tag on, neutral fitted). Lines unchanged.
- `focus.js` (new): the four views, per-view focus rectangles, the dim pass, destination rings, lamp strike + wash, Wi-Fi halo and rings.
- `sample.css` (new): dim, amber pulse, light and pill styles.
- `wb.js`: five small hooks (glow lights target **and** destination; idle hand; `FIG.onView` / `FIG.onGlow`; `prelude`; silent when no recording).
- `adapter.js`: narration prefix and folder default to the bundled `audio/`.
- `figure.js`, `figscript.js`, `workbench.css`, `fig.css`: unchanged copies.
- `shots/`: before/after pairs.

## Limits (honest)
- Focus rectangles are hand-set per view in SVG units; a new chapter needs its own. Dimming is by bounding box, so long pieces are judged by their middle.
- It is still a flat isometric drawing: the warm wash is an ellipse behind the figure, so light never falls on foreground objects, and "dimmed" means darkened, not unlit.
- One chapter only: the safety steps before it (gloves, MCB off, test-then-touch) are not in this sample.
- English only; Hindi and Kannada were dropped from this cut.
- Verified headless (software rendering). Real projector-laptop speed and the actual sound were not checked.
