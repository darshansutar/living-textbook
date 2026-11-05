# Narration storyboard production

Every narration clip uses one fixed-format storyboard board, built by `pipeline/storyboard.py` from 1, 2 or 3 separately generated shot pictures. The shot count follows the narration the board covers: under 4 s one panel (`storyboard_1x1`), 4-8 s two shots (`storyboard_1x2`, the "2x1 grid"), 8-15 s three shots (`storyboard_1x3`); every shot covers at least 2 s of narration. Every board is identical in layout, caption colour and type:

| Element | Fixed value |
|---|---|
| Canvas | 1024 wide; 512 px high per shot (1024 x 512, 1024 x 1024 or 1024 x 1536) |
| Blocks | one 512 px block per shot, stacked top to bottom, never side by side |
| Picture window | 1024 x 464 at y = 0, 512 and 1024 (as many as there are shots) |
| Caption strip | 1024 x 48 directly below each picture, ivory `#FBECD8`, no border |
| Caption text | dark brown `#32120B`, Bahnschrift Bold Condensed, 24 px, uppercase, centred on one line |
| Caption fields | `SHOT 1  \|  0.00-3.61 s  \|  SLOW PUSH IN  \|  DEFINING ACTION` |

A full-frame scene image without the board, a landscape sheet, a board drawn by the image model with its own captions, or an unlabeled board is not a substitute. `python pipeline/storyboard.py verify BOARD` must pass before a board is reviewed. Dialogue keeps its separate clean-scene and accepted-audio workflow.

## 1. Understand the narration before drawing

Analyse the accepted narration audio and its verified transcript before planning images: the measured duration, the cue time of each phrase or sentence, and what each part of the narration says. ChatGPT or the user owns listening; Claude works from the accepted audio manifest, transcript and measured cues and never claims to have listened. Divide the narration into one, two or three sequential, gap-free semantic intervals (by the length rule above) that follow the meaning of the words at their measured times.

Each board covers **4-15 seconds** of generated footage (6-15 for two shots, 10-15 for three), including the 1-2 second shot buffers; short boards take longer buffers. The compositor and the runtime both reject a board outside its range. If the audio cannot be truthfully covered by three shots in 15 seconds, split it at a measured semantic cue into additional boards. Never speed up, omit, or rewrite accepted narration to fit.

Use this narrative progression unless the source requires a more precise equivalent:

1. **Establish** the supported place, people, and situation.
2. **Develop** the central action, discovery, decision, or change.
3. **Resolve or hand off** to the supported consequence or following dialogue composition.

Every shot has one distinct defining action. Do not repeat the same composition merely to fill time. A detail insert is justified only when narration identifies that evidence. Do not invent people, props, locations, reactions, signage, or actions.

Save the timing table (each shot's start, end, required duration, buffer, camera and defining action) before writing any image prompt. The same table produces the captions, the animation prompt and the render duration.

## 2. Generate only the required assets

Create and approve assets in this order:

1. character sheets for characters visible in the board's shots;
2. one scene-specific environment shown in two useful views;
3. only the props visibly required by the scene;
4. the three shot pictures for the board.

The environment views establish the same place, geometry, time, and lighting; they are not two different locations. The scene master for a continuous location is the approved full-frame composition built on that environment; it fixes camera axis, screen positions, furniture and lighting for the shots. Character sheets and prop plates define identity and material only. The board remains the composition authority.

Each shot picture is generated as its own landscape image (1536 x 1024 from ChatGPT image generation) with **no text, captions, borders, arrows or motion symbols**. Compose it so every important subject sits inside the central horizontal band that survives the board crop: the compositor scales the picture to 1024 wide and keeps a 1024 x 464 window, centred unless the spec sets `focus_y` (0 = top, 1 = bottom). Keep the full original as well; it is the full-frame record of that shot.

## 3. Compose the fixed board

Write a board spec with the output path and, for each shot, the picture path, exact start and end times from the timing table, the CAMERA move or `STATIC`, the short DEFINING ACTION and an optional `focus_y`. Run:

```powershell
python pipeline/storyboard.py compose visuals/boards/CLIP.board.json
python pipeline/storyboard.py verify visuals/boards/CLIP.png
```

The compositor rejects anything other than 1-3 shots numbered from 1, a gap or overlap between shots, a board outside the range for its shot count, a picture smaller than 1024 x 464 (it never upscales), a damaged or half-loaded picture, and a caption too long for one 24 px line (shorten the text; the font never shrinks). It writes `CLIP.layout.json` with the fixed picture and caption boxes, caption text, cut times and input hashes. Names and source-required text use exact spelling.

Preserve camera axis, screen direction, character positions, environment geometry, fixed landmarks, lighting, wardrobe, and prop state wherever the scene is continuous. No character talks in a narration panel: nobody faces another character in a conversation pose, every person has a silent action (typing, reading, carrying, pointing, walking, listening), and close shots of people use a back, side or over-the-shoulder view, or hands and objects. For narration immediately before dialogue, the last shot is a silent final panel of the same set (a detail, an establishing view or a character from behind) with the same scene master, environment/time, lighting, camera axis and set/prop state; it never shows the speakers face to face, because EN2 animates that pose as speech, and the dialogue clip's own wide shot opens the conversation. Inspect the board and clean dialogue scene side by side.

## 4. Control difficult physical actions

Classify each defining action before drawing it:

- **stable acting:** expression, posture, gaze, or restrained gesture;
- **simple movement:** one character or object follows one clear path;
- **complex interaction:** rapid contact, handoff, projectile, crowd, multi-person coordination, or changing object ownership.

Use the simplest source-faithful staging that communicates the beat. When a complex interaction is not essential, represent its clear preparation or consequence as a stable tableau. When it is essential, give it one action axis, one subject-object relationship, an unambiguous starting state, and a settled ending state. Do not combine multiple defining actions in one shot.

## 5. Inspect, then transport at full quality

Inspect every picture and every caption field at useful resolution. Confirm source coverage, distinct actions, exact timing, identity, anatomy, perspective, physical support/contact, object orientation, and continuity. A failed shot is regenerated or edited on its own and the board is recomposed; recheck the entire board.

Select animation references in this fixed order: visible character identities, matching environment, visible props, storyboard last. Before any upload, run `python pipeline/storyboard.py check-image FILE` on every reference: it fully decodes the file and rejects truncated files, flat grey or single-colour bands from half-loaded images, blank images and undersized images. Upload the approved original at full resolution. Never send a downscaled, re-compressed or "upload-safe" copy; if a provider requires JPEG, convert at the original pixel size with quality 95 or higher and record both hashes. After upload, retrieve the provider copy when supported and compare its pixel dimensions and SHA-256 (or a visual comparison when bytes are re-encoded). Stop if a reference is corrupt, cropped, grey, incomplete, smaller than the original, or visually different.

## 6. Analyze the board, then write the animation prompt

Do not draft motion from the script alone. First describe what each approved storyboard shot actually depicts and what its caption requires. Then write one animation prompt for that one scene using the current structured provider sections in `animation-template.md`. Use affirmative target language. Visible narration characters remain silent with relaxed closed lips; accepted narration is added during assembly.

For every shot, define the composition, visible inventory, one defining action, camera behavior, timing range, and settled end state. Render each storyboard picture as an individual edge-to-edge colour shot. Switch to the next complete shot with a hard cut at the printed time. The storyboard layout and caption strips are production guidance only.

## 7. Pilot and review gate

Before a paid batch, render one representative narration pilot using verified references and normal production settings. The user reviews the entire result at normal speed for composition, action, identity, geometry, timing, hard cuts, silence, and transport fidelity. Release the remaining batch only after the pilot is accepted. Provider completion, technical decode, or a contact sheet is not final acceptance.
