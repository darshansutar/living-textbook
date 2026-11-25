# Lab style: focus standard (2026-11-25)

Derived from the Starling workbench (starling.en2.ai/workbench) after playing its arc-welding and MCB jobs.

## Four rules
1. **Colour economy** - near-monochrome charcoal base; colour only for meaning. Welding / operator labs: amber = tap target, red = danger, green = safe, blue-white = arc, orange = hot or spark. Science keeps full colour (students respond to it): see `labs/iodine-test-3d`.
2. **Lit target** - only the objects the current step uses are bright; everything else dims (about 0.4 s fade).
3. **One verb, one close view per step** - 3-4 steps per chapter. The title and end card show the whole model on its plinth; Start eases the camera into the step's named view.
4. **Light that behaves** - screen-blend glow for arc, flame, heat; natural water, cotton, sparks, smoke (no plain geometry for these).

## Where things are
- `labs/weld-shop-hazards`, `labs/weld-ppe-shade`: Episode 1 welding labs in this style (steps, wording, audio keys and embed messages unchanged).
- `labs/iodine-test-3d`: colourful three.js iodine lab (shadows, orbit/zoom, drag, live reactions).
- `labs/_samples/`: one sample each for science (`science-colourful`, `science-iodine` dark variant), welding and smart switch, with READMEs and honest weaknesses.

## Notes
- Welding answer cards are drawn from the labs themselves (`projects/.../redesign/cards`); images are ignored by Git here, they ship in the lesson package.
- Narration mp3 files are ignored by Git; lab lines live in `media/audio/<screen id with _>_<key>.mp3` and the lab screen sets `lines`.
