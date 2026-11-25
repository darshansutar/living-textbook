# Welding hazards: focus-standard sample (2026-11-25)

One chapter of the E1 welding safety job ("Make the welding area safe") rebuilt in the Starling workbench focus language.
Open `index.html` in Chrome (runs from `file://`, no network, no audio).

Compare with the current lab: `projects/iti-fitter-m4-welding/package/labs/weld-shop-hazards/` (whole room, ~25 props, 8 steps).
This sample: a small isometric bay on a plinth, 8 objects, 4 steps. Originals were not touched.

## What is here
| File | What |
|---|---|
| `index.html` | Starling markup (title, HUD, glass card, readout pill, end card) |
| `workbench.css` | Starling player CSS, copied unchanged from starling.en2.ai (panel, HUD, buttons, chips, pointer) |
| `bay.css` | Our palette, materials, lit/dim focus, glows, state switches |
| `lab.js` | New: figure builder (isometric SVG in code), named camera views, chips, pointer, 4 steps, end card |
| `test_playwright.py` | Headless run through every step incl. wrong taps (needs Chrome + playwright) |

## How it maps to the four rules
1. **Colour economy.** Charcoal / steel base (three flat shades + hairline edge per material). Colour only for meaning:
   red = danger (live lamp + red live-glow, extinguisher, fire-risk ring) · amber = the tap target (workbench `--primary`) ·
   green = made safe (dry mat, extinguisher spot, final pill) · blue-white = arc light · orange = hot stubs and sparks.
2. **Lit target.** While a step is on, `svg[data-focus]` dims every object to 50% and `data-lit` parts brighten with a white hairline
   (step 1 machine; step 2 wet patch + cable; step 3 cotton + bin; step 4 extinguisher + bench).
3. **One verb, one close view.** 4 steps (switch off, dry the floor, clear the cotton, choose where the extinguisher stays), each with its own
   named view (`machine`, `floor`, `cotton`, `ext`) that eases the viewBox over 0.9 s into the area the card leaves free (same `fitAspect` idea as Starling).
4. **Light that behaves.** The live machine has a red halo and a lamp; the arc at the plate has a blue-white pool, flicker and sparks;
   stubs glow orange. All of it fades when the machine is switched off (the lever drops). Wet patch dries to a green-edged mat.
   Cotton goes into the bin. The extinguisher slides to its marked spot, which turns green.

## Wording
Steps 2 and 3 and the extinguisher question use `script_e1.json` (screen 3) verbatim. Step 1 ("Switch the machine off") is new: the original
puts switch-off last (step 8); here it comes first so the live-arc reaction is visible and the later checks happen on a dead machine.
Electrode stubs are in the scene (orange hot tips) but are a decoy, not a step. The "who may weld" and soapstone steps are not in this sample.

## Update 2 (2026-11-25): start setup + natural effects
**Start setup.** Title and the end card show the whole bay on its plinth (centred left, title block + scrim on the right, as in the smart-switch lab).
The plinth is now lit (lighter top, hairline edges, a soft light pool, faint floor grid). **Start the job** eases the camera ~1.15 s from the overview
into the step-1 view; each step keeps its own named view. The end card can **Back to the overview** (eased zoom-out) or **Do it again**.
There is no separate chapter menu: this sample has one chapter, so Start goes straight in (as the smart-switch demo does).

**Water** (`lab.js` `puddlePath`, `dryPuddle`; `bay.css` "natural water"): an irregular puddle outline (sine lobes + noise, smoothed), a dark gradient body,
a wet-sheen rim, soft streak highlights, an SVG `feTurbulence` + `feSpecularLighting` shimmer whose noise animates slowly, three expanding ripples,
and soft red / blue reflections of the machine and the arc (they fade when the machine is switched off). Drying shrinks the outline irregularly
(each vertex lags differently), drifts it slightly, fades the sheen and leaves a faint, noise-displaced damp stain. The green mat is gone.

**Cotton waste** (`cottonMarkup`): a soft contact shadow, a blurred irregular mass, oil stains, ~95 thin curved fibres in off-white / grey /
dark-oil colours through a fuzz filter (`feTurbulence` + `feDisplacementMap`), and a few loose strands lifting off. Picked up, it lifts, tilts, arcs
over the cable into the bin (Web Animations), shrinks and fades; a few fibres are then left over the bin rim.

**Sparks / arc / bead** (`fxLoop`): a pooled particle system (max 110, two lines each), gravity, bounce on the plate (up to 3), random bursts and
occasional showers, white-hot to orange to red to dark-ember colour ramp with short velocity trails and a soft glow line, screen-blended.
The arc has a blue-white bloom, a flickering core and a jagged bolt (JS each frame). The weld bead glows orange while ON and cools over 6 s after
switch-off, 8 static embers dim on the bead, and three soft smoke wisps rise while ON. Everything is skipped when the arc is outside the camera view.

Test hook: `window.__camSlow = n` slows camera eases n times (used to capture mid-zoom frames).

## Not done on purpose
No voice (no external calls), no Hindi/Kannada strings, no embed contract (`lab-intro` / `lab-done`), not wired into the player.
