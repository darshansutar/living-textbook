# Flow templates - exact screen sequences

Screen types are defined in `skills/lt-package/chapter-schema.md`. Times are targets. "Narration" means one or more narration lines in `script.json`. Every `vote` gets a reveal line per option; every `mcq` gets a feedback line per option.

## Story (interest from a character)

| # | Screen | Type | Content | Time |
|---|---|---|---|---|
| 1 | Story | `video` (role `hook`) | A moment in the story world; the main child faces something they cannot explain or decide. **Ends on the question.** | 30-60 s |
| 2 | Vote | `vote` | The question + 2-3 options = the right idea and the concept's misconceptions | 15 s |
| 3 | Explain | `video` (role `explain`) | The NCERT concept, in the book's terms, with its figure or evidence, tied back to the story | 60-90 s |
| 4 | Reveal | `reveal` | Right option highlighted; a short line for whichever option the class chose | 8-15 s |
| 5 | Check | `mcq` x1-2 | Same idea, new situation | 20-40 s |

## Challenge (interest from a problem)

| # | Screen | Type | Content | Time |
|---|---|---|---|---|
| 1 | Challenge | `video` (role `hook`) | A real job the main child must do now (announce the winner, pack for the trip, weigh the vegetables) | 20-30 s |
| 2 | Try | `vote` | The class decides with what they already know; distractors = misconceptions | 15 s |
| 3 | Stuck | `still` | Narration names the disagreement ("Half of you said..., half said... Who is right?") over a still of the moment. One line covers all outcomes. | 8-12 s |
| 4 | Learn | `video` (role `explain`) | The concept arrives as the missing tool | 45-90 s |
| 5 | Solve | `video` (role `solve`) | Back to the challenge, solved with the tool; the story moves on | 10-20 s |
| 6 | New challenge | `mcq` x1-3 | Same tool, new situation | 20-60 s |

## Wonder (interest from a surprise)

| # | Screen | Type | Content | Time |
|---|---|---|---|---|
| 1 | Wonder | `video` (role `wonder`, **no narration**) | A surprising real sight, held long enough to look | 10-15 s |
| 2 | Question | `question_cards` | "What do you want to find out?" 3 question cards (children's own kinds of question); the class picks one | 20 s |
| 3 | Investigate | `activity` (do_along / simulator) or `video` (role `investigate`) | The NCERT activity that answers it | sim 1-2 min, live 3-5 min, video 20-40 s |
| 4 | What did you see? | `vote` | Observation options (what changed, which turned blue-black) | 15 s |
| 5 | Explain | `video` (role `explain`) | The concept, answering the picked question | 60-90 s |
| 6 | Apply | `mcq` x1-2 (+ optional `activity` mission) | New situation, preferably near the child's home | 20-40 s |

## Mini loop (small concepts)

`still` (one hook line, 5-10 s) -> `video` explain (20-45 s) -> `mcq` x1.

## Fact card

`fact`: a still + one narration line (15-25 s). No vote. Placed between loops.

## Episode frame

| Position | Screen | Type | Content |
|---|---|---|---|
| Episode 1 start | Opener | `title` + `video` (role `opener`) | Chapter title card, then the story world and the chapter's big question (30-60 s) |
| Later episodes start | Recap | `recap` | "Last time..." line (10-15 s) + one recall MCQ on the previous episode |
| Each loop | Map | (player) | The chapter map advances automatically; not authored |
| End (not last episode) | Cliffhanger | `still` or `video` (role `cliffhanger`) | A new unanswered problem that leads into the next concept (8-12 s) |
| Last episode end | Finale | `video` (role `payoff`) -> `activity` (practice / missions) -> `mcq` x8-10 -> `score` | Problem solved with all concepts; chapter round |

## Vote and reveal rules

- 2-3 options (4 only for observation votes). Option text <= 6 words; the player shows the text, the still shows the idea.
- One right option; every other option is a misconception from `analysis.json` - never a joke or an obviously silly answer.
- Reveal line per option: right -> confirm + why in one sentence; wrong -> name the belief kindly, then the evidence ("Many people think 45 is bigger than 5 - but look at the tenths place..."). Never "Wrong!".
- Optional `consequence` video (<= 8 s) for one wrong option that shows what would happen (the Bandersnatch moment). Budget: at most 2 consequence clips per episode, chosen in the episode plan.
