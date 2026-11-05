"""Run one Codex step (images or ElevenLabs audio) for a Living Textbook project.

Codex owns two provider calls in this workflow:
  * native image generation (assets, storyboard panels, cover and option images)
  * ElevenLabs text-to-speech through its connected ElevenLabs app

    python pipeline/codex_run.py --project projects/plants --prompt prompts/codex-assets.md \
        --ref refs/style.jpg --ref assets/env_master.png --name assets

The prompt and refs are project-relative. Output goes to <project>/logs/codex-<name>.log and
<project>/logs/codex-<name>-last.md (Codex's final message). Codex runs with a workspace-write
sandbox rooted at the project, so it can only write inside the project folder.
"""
import argparse
import subprocess
import sys
from pathlib import Path


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--project", required=True)
    ap.add_argument("--prompt", required=True, help="project-relative prompt file")
    ap.add_argument("--ref", action="append", default=[], help="project-relative image to attach (repeatable, in order)")
    ap.add_argument("--name", required=True, help="step name for the log files")
    ap.add_argument("--codex", default="codex")
    args = ap.parse_args()

    project = Path(args.project).resolve()
    prompt = project / args.prompt
    if not prompt.exists():
        sys.exit(f"prompt not found: {prompt}")
    for r in args.ref:
        if not (project / r).exists():
            sys.exit(f"reference not found: {project / r}")
    logs = project / "logs"
    logs.mkdir(exist_ok=True)
    log = logs / f"codex-{args.name}.log"
    last = logs / f"codex-{args.name}-last.md"

    cmd = [args.codex, "exec", "--skip-git-repo-check", "-C", str(project), "-s", "workspace-write"]
    for r in args.ref:
        cmd += ["-i", r]
    cmd += ["-o", str(last), "-"]
    # projects/ is git-ignored, so `rg --files` inside a project lists nothing and Codex
    # wrongly concludes the attached references are missing. Tell it up front.
    note = ""
    if args.ref:
        note = ("NOTE: every attached reference file exists in this working directory: "
                + ", ".join(args.ref)
                + ". This folder is git-ignored, so `rg --files` will not list it; check files with "
                "Test-Path / Get-ChildItem or just use the attached images. Never stop because a "
                "reference seems missing.\n\n")
    payload = note.encode("utf-8") + prompt.read_bytes()
    with log.open("wb") as out:
        code = subprocess.run(cmd, input=payload, stdout=out, stderr=subprocess.STDOUT, shell=(sys.platform == "win32")).returncode
    print(f"codex exit {code}; log {log.relative_to(project)}")
    if last.exists():
        print(last.read_text(encoding="utf-8", errors="replace")[-2000:])
    sys.exit(code)


if __name__ == "__main__":
    main()
