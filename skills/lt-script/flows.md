# Flow - the simple loop (the only flow, since 2026-11-05)

On 2026-11-05 the user played the first pilot (22 screens, 9 screen types, a map before every topic, 8 buttons, silent clips, questions not read aloud) and found it confusing. Every episode now uses one repeating loop, and **every screen is narrated**. Screen types are defined in `skills/lt-package/chapter-schema.md`.

## Episode

| # | Screen | Type | Content | Time |
|---|---|---|---|---|
| 0 | Title | `title` + narration | Welcome line: where we are and what we will find out | 6-10 s |
| | *1-2 topic loops* | | | |
| end | Recap + next time | `still` + narration | What we found today, then the open question for the next episode | 10-20 s |

## Topic loop

| # | Screen | Type | Content | Time |
|---|---|---|---|---|
| 1 | Story | `video` (role `hook`) | The narrated story moment that raises the topic's question (a surprise or a problem in the story world). Ends on the question. | 20-45 s |
| 2 | Vote | `vote` | The question **read aloud** (`prompt_line`). 2-4 options: the right idea plus real misconceptions. The teacher taps the class's choice; the right answer and that option's reveal line appear on the same screen. | 20-30 s |
| 3 | Answer | `video` (role `explain`) | The NCERT concept with its activity or figure as evidence, tied back to the story | 45-90 s |
| 4 | Check | `mcq` | Same idea, new situation. The question **read aloud** (`question_line`), a feedback line per option. | 20-30 s |

## Rules

- NCERT activities appear inside the story or answer videos: teacher demonstrations (the teacher alone, medium shot), slow experiments as time-lapse. No activity screens.
- Vote pictures show the set-up, never the result; option pictures are 16:9 and match the option text exactly.
- Option text is 6 words or fewer; one right option; every other option is a misconception from `analysis.json`, never a joke.
- Reveal line per option: right -> confirm and say why in one sentence; wrong -> name the belief kindly, then the evidence ("Many people think water is enough. But..."). Never "Wrong!".
- Feedback line per check option, in the same style.
- The chapter map is never shown automatically; the teacher opens it from the Menu.
