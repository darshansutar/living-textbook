---
name: lt-animation
description: Write six-section EN2 reference prompts from the inspected Living Textbook storyboards following the Starling animation-pack skill, upload references with hash checks, render one pilot for the user, then submit the episode's clips once on Ultra and collect the renders.
---

# Living Textbook - Animation (EN2, Ultra)

Follow `starling/starling-animation-pack` and its references as written:

| Reference | Covers |
|---|---|
| `animation-template.md` | the six-section prompt |
| `reference-bundle.md` | reference choice and order |
| `scene-preservation.md` | describing the actual panels |
| `timing-and-visual-review.md` | buffered timing, review and the one repair |
| `narration-pairs.md` | the board and the pilot gate |
| `en2-submission.md` | submission and collection |

The Living Textbook differences are in `starling/README.md`. Read the live EN2 guide (`video_guide mode=reference`) and `gpu_timing` once per session.

## Rules that caused failures before (Sci7 Ch10 E1, 2026-11-05)

- **References give identity and material only.** The storyboard is the per-shot composition authority. Environment subjects describe materials, colours and light, never a list of items. Prop sheets are "used only for the items the storyboard shows".
- **Use the clean scene masters** (no loose props) as environment references. EN2 copies objects from reference pictures whatever the text says.
- **No stock wording** repeated in every shot; it plants objects.
- **Silence:** every visible character "stays silent, lips completely closed, with no speech-like mouth or jaw movement". Animals chew with closed mouths.
- **Camera:** moves end on the panel's framing, and quiet shots get a 3-5 % push-in.
- **Actions:** write each as start state, then movement, then settled state. Objects keep their size and stay held.
- **Use the labelled board**, not loose clean panels. Loose panels made EN2 open on the grey planning picture.
- **Preflight:** before uploading, read every prompt next to its board (people, objects, action, camera, timing).

## Steps

1. **Prompts:** write one `prompts/en2/<clip>.txt` per clip, generated from `plan.json` by the project's prompt builder. Order the references: visible characters, clean environment(s), visible props, storyboard last.
2. **Check and upload:**
   - Run `python starling/pipeline/storyboard.py check-image <file>` on every reference.
   - The EN2 MCP rejects request bodies over about 2 MB, so upload full-resolution JPEG copies (quality 95, no chroma subsampling, same pixel size) from `renders/upload_cache/`.
   - Upload with `node pipeline/en2_upload.mjs <files> > renders/uploads.json`. Uploads are named `en2ref_<sha256[:16]>`; confirm every hash matches.
3. **Pilot:** submit one representative clip on Ultra. The user reviews it at normal speed before the batch is released.
4. **Batch:** run `node pipeline/en2_submit.mjs <render_plan.json> <uploads.json> renders/jobs.json`.
   - Submit every clip once, with `quality=true` and the folder `Living Textbook/<Chapter>/<Episode>`.
   - Record every job ID, and never resubmit a slow job.
   - Tell the user `studio_queue`'s estimate in plain words.
5. **Collect:** `node pipeline/en2_collect.mjs renders/jobs.json` saves `renders/<clip>.mp4`. It overwrites existing files, so copy earlier versions to `renders/<round>/` first. Hand each clip to lt-review.

## Recap animation (since Sci7 Ch10 E1, 2026-11-06)

The recap `still` may be animated so the episode does not end on a frozen picture. Starling production uses reference mode only, and `image` (first frame) cannot be combined with `refs`. So:

- **References:**
  1. The visible character sheet(s), for identity only.
  2. The approved recap still as the full-frame composition authority (`<Picture n> is the approved full-frame scene`).
  Upload a JPEG q95 copy of the still from `renders/upload_cache/stills__<id>.jpg`.
- **One shot, no cuts.** Write small, slow actions timed to the recap narration: a breeze, turning or lifting the held object, a curious head tilt, a slow 4 % push-in, lips closed. Describe positions by frame side ("her raised hand on the right of the frame") rather than "left hand / right hand".
- **Length:** the recap narration is often 20-25 s, but one render is at most 15 s. Either render 15 s and let the player hold the last frame, or continue it: take the last frame (`video_continue`), use it as the composition authority of a second clip, and join the two.
- **Delivery:**
  - Record the job in `renders/jobs_<ep>_recap.json` and review it like any clip.
  - Write the silent result (no narration; trimmed or joined) to `output/screens/<recap-screen-id>.mp4`.
  - `build_chapter.py` then adds it as the still's `video`, and the player plays it once under the narration.
