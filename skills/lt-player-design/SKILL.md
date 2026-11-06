---
name: lt-player-design
description: The Living Textbook player UI/UX - the Starling monsoon design system (Rajdhani + Noto Sans, warm dark field, one gold primary, frosted step rail, picture cards, split check), how every screen of the simple topic loop looks and behaves, the classroom interaction rules, and how to change and test the one generic player. Read before touching player/ or judging how a lesson looks.
---

# Living Textbook - Player design (UI/UX)

The player is one offline HTML page (`player/index.html`, `player.js`, `player.css`, `fonts/`) that plays every chapter from `chapter.json`. **It is never edited for one chapter.** A design change is made in `player/` for all chapters, then every packaged chapter is rebuilt (`build_chapter.py`) and re-tested.

**Reference:** https://starling.en2.ai/v2/monsoon.html (stylesheet `/v2/player/poe.css`). The user chose it on 2026-11-06 ("this is nice ui and ux"). When in doubt, do what that page does, within the classroom rules below.

## Classroom rules (fixed by the user)

1. **Projected to a whole class.** Everything reads from the back of a room: headings at least 2.3rem, captions 1.7rem, option text 1.15-1.55rem.
2. **Only Back and Next are visible to the class.**
   - Back is a glass pill at bottom left; Next is the gold button at bottom right.
   - Teacher tools (chapter home, replay, captions, chapter map, teacher notes, full screen) sit in one **Menu** pill at the right end of the rail.
   - The controls fade after 3.5 s without the mouse.
3. **Every screen is narrated**, with captions on by default.
4. **No dead ends.** A video screen moves to the next screen about 0.9 s after it ends (`settings.auto_advance`, on by default). Votes and checks wait for the teacher's tap.
5. **Each run starts clean.** Votes and check answers live in memory only: a refresh or a fresh start of an episode clears them, while Back within a run still shows the class's pick. Only the captions preference and map progress are stored.
6. **Pictures are shown whole.** Vote and check pictures are 16:9 and never cropped; text never covers them.
7. **The chapter map never opens by itself.** It opens only from the Menu or with M.
8. **No production notes on screen** (story_world, beats, misconceptions).

## Design tokens (`player.css` `:root`)

| Token | Value | Use |
|---|---|---|
| `--bg` / `--bg-deep` | `#0c0a08` / `#0a0807` | warm near-black field, card fill |
| `--ink` / `--ink-2` / `--dim` | `#f5f0eb` / `#dcd5cc` / `#9e9287` | text, secondary text, hints |
| `--primary` / `--primary-ink` | `#f5be73` / `#2f1904` | the one gold accent: Next, current step, kicker, ticks |
| `--right` / `--miss` | `#6fd08f` / `#ee7f62` | right answer / class's wrong pick |
| `--line` / `--line-2` | white 12 % / 24 % | hairlines, card rings |
| `--glass` / `--glass-2` | dark 58 % / 62 % + blur 14-24 px | rail, pills, menu, feedback, list options |
| `--head` | Rajdhani 600/700 | every heading, step names, option text on picture cards, big numbers |
| `--text` | Noto Sans (variable) | body, captions, hints, list options |

**Sizing.** The stage is a letterboxed 16:9 box. `player.js` sets `--u` (1 % of the stage width) and the root font size (`1rem` = 1.17u, about 16 px on a 1366 px stage), so the whole screen scales as one picture. New CSS uses rem. The gutter is `--gut` 2.6rem and the rail is `--rail` 4.4rem.

**Fonts** ship in `player/fonts/` (latin subsets, OFL; see `fonts/LICENSE.txt`) and are copied into every package, so lessons work offline. Never link Google Fonts from the player.

**Motion.** Use the `--ease` curve `cubic-bezier(.22,.8,.24,1)`. Titles rise in over 1.2 s, ticks pop in with a slight overshoot, and Next gives a gentle wake-up pulse when the screen is done. Nothing loops or flashes.

## Screens

| Screen | Look | Behaviour |
|---|---|---|
| Chapter home (only when the chapter has 2+ episodes) | Full-bleed cover under a 35-degree dark scrim. Left title block: gold kicker "Class 7 · Science · Chapter 10" and a big Rajdhani chapter title. One button per episode: the first is gold, the others glass ("Episode 2 / title"). | A one-episode chapter skips home and opens on the episode title. |
| Episode title (`title`) | Same scrim and left block: kicker "Episode 1", the **episode name** big, and a sub line "Class 7 Science · Chapter 10 · <chapter>". Along the bottom, the loop line of the episode's first topic, named after its flow (Story/Vote/Answer/Check, Challenge/Try/Learn/New challenge or Wonder/Guess/Find out/Check), each with a short description. | Welcome narration. Never repeat the home layout; the two must look different. |
| Step rail (every lesson screen except titles) | Frosted bar at the top: four numbered steps named after the topic's `flow` (see the schema's Topic flow table), each with a thin bar (done = gold ring, current = gold disc). On the right, "Topic n · <concept title>" and the Menu pill. Over video it turns into a dark gradient with text shadow. | The current step's bar fills with the video's progress. Topics are numbered within the episode. The recap shows all four steps done. |
| Story / Answer (`video`) | Full-frame video, captions centred low in dark rounded boxes, and a 0.28rem gold progress line at the very bottom. A **story opens on a topic card**: a huge gold numeral, "TOPIC 1" and the concept title in Rajdhani 4rem over a 20-degree shade. It fades after about 4 s. | Tap the video to pause. Auto-advance at the end. |
| Vote (`vote`) | Blurred copy of the first option picture as backdrop. Rajdhani question, a dim hint line and a row of picture cards: the whole 16:9 picture on top, the option text in Rajdhani below, and a frosted letter tag A-D. The question, cards and answer sit as one block centred on the screen. | The question is read aloud. On the teacher's tap, the right card gets a green ring and tick, the class's wrong pick gets a coral ring, and the rest dim. A "Class chose" tag appears and the reveal line plays in a glass feedback box below. Keys 1-4 pick. |
| Check (`mcq`) | Split screen. On the left (52 %), the whole scene picture with a soft shadow over its blurred copy. On the right, a darker panel with the Rajdhani question, a hint and list options (letter mark A-C plus text). | On a pick, the right option turns green and the wrong pick coral, and the feedback line plays in a box below the options. |
| Recap (`still`, role `cliffhanger`) | The full picture, or its silent animation (`video`, played once over the picture and holding its last frame), with captions. All rail steps are done and the topic label reads "Recap". | Narration: recap, then next time. Next leads to "Episode complete". |

## Changing the player

1. Make the change in `player/` only, using the tokens above. Reuse `.btn`, `.btn.ghost`, `.choice`, `.kicker`, `.feedback` and the rail; do not add a second accent colour or a new font.
2. Any new chapter data goes into `skills/lt-package/chapter-schema.md` first, optional, with a default that keeps old chapters working.
3. Run `node --check player/player.js`, then rebuild every packaged chapter with `build_chapter.py` and `package.py`. `package.py` refuses a package whose player or fonts differ from `player/`.

## Testing what it looks like

- **Use a real browser session, not `chrome --screenshot`.** Chrome's `--screenshot` mode does not run CSS animations, so the risen title blocks look empty. Drive headless Chrome over the DevTools protocol instead: navigate, wait about 2.5 s, optionally click (`document.querySelector('.choice').click()`), then `Page.captureScreenshot`.
- Open screens directly with `index.html?ep=e1&screen=<screen-id>` (add `&teacher=1` for the notes).
- **Check at 1366x768 and at a 4:3 projector size:**
  - the title block and loop line do not touch, and captions do not cover the title block;
  - the topic card clears the first caption;
  - the vote cards show whole pictures, and the check picture is whole;
  - the rail text is readable over bright skies;
  - after a refresh, no option is pre-picked.
- Then do the lt-package teacher test (every screen, every option, offline from the unzipped folder).
