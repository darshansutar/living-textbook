# Science sample: iodine test, Starling "focus" look

Open `index.html` in Chrome (runs from file://). Same 8 steps, narration hooks and embed contract as `labs/iodine-test-3d` (the 3D demo this was copied from; originals untouched).

## What changed vs iodine-test-3d
- **Stage:** near-black background and fog, neutral key light, cool rim light (lower), soft shadows kept. Wood grain, warm room, wall and green board removed (wall/board hidden). Vignette overlay added in CSS.
- **Colour economy:** every prop is charcoal/grey (bench, tripod, gauze, lamp, rack, bowl, plate, bottle, bulb). Colour is left only for meaning: amber = tap target (outline, ring, label), leaf green -> pale -> blue-black, orange flame + heat pool, brown iodine drops, a faint cool tint for water and alcohol, green wisps/alcohol while the colour leaves the leaf.
- **Lit target:** each step lists the objects it uses (`LIT` in lab.js). The others fade (about 0.4 s) to dark and desaturated (shader uniform per object group, `DIM`). Labels show only for the object to tap (or on hover).
- **Light pools:** a soft pool under the step's object (`pool`), and an orange breathing pool around the lit lamp (`flamePool`) on top of the flame glow sprite. Flame cone made more transparent.
- **Quieter controls:** orbit / zoom / drag / Reset view are kept; the hint strip is small and faint until hovered.
- Glass pieces now own their rim-line material so dimmed glassware dims fully.

## Files
`lab.js` (scene, steps), `lab.css`, `index.html`, `vendor/` (three r158, gsap), `fonts/`.
