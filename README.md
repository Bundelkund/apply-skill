# Apply Skill — Desktop Variant

> Cover-letter + CV generator from job posting to polished Markdown. Built as a Claude Desktop Agent Skill. Requires the `tenant-mcp` connector for personal data.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## What it does

You give the skill a job posting (pasted text or a `job_id` from your ranked matches). The skill walks through five phases entirely in-conversation:

1. **Input & setup** — load the posting via `get_job`, load your profile via `get_my_profile`
2. **Analysis** — keyword + gap analysis, fit score, CV tailoring
3. **Research + cover letter** — company research, hiring-contact lookup, cover letter following the "Jonas rule" (problem → solution → benefit)
4. **Review** — template review, optional adversarial review at fit >= 70
5. **Completion** — tracker update via `save_application`, channel research, prepared questions for the hiring team

All artifacts (job-fit analysis, CV, cover letter) are produced as in-conversation Markdown — no files written to disk.

## Requirements

- [Claude Desktop](https://claude.ai/download) with Agent Skills support
- `tenant-mcp` connector installed in Claude Desktop (`tenant-mcp.mcpb`) with a provisioned API key
- Your profile populated via `PUT /my/profile` (done by the tenant owner during onboarding)

No Node.js, no local filesystem, no PDF toolchain required.

## Installation

### 1. Add the skill to Claude Desktop

Upload this skill folder (`apply-skill-desktop/`) to Claude Desktop via **Settings → Agent Skills → Add Skill**. Claude Desktop reads `SKILL.md` as the entry point.

Alternatively, point Claude Desktop at the GitHub repository URL directly if your Desktop version supports remote skills.

### 2. Install the tenant-mcp connector

The skill needs four MCP tools to read/write personal data:

| Tool | What it does |
|------|-------------|
| `get_my_matches` | Your ranked job list |
| `get_job(job_id)` | Full posting text |
| `get_my_profile()` | Your 5-field application profile |
| `save_application(...)` | Write a tracker entry |

These tools are provided by the `tenant-mcp` connector. Install it in Claude Desktop:

1. Obtain `tenant-mcp.mcpb` from the tenant owner (provisioned out-of-band)
2. In Claude Desktop: **Settings → MCP Connectors → Install from file** → select `tenant-mcp.mcpb`
3. Enter your provisioned API key when prompted

### 3. Verify the connection

After installation, open a new Claude Desktop conversation and type:

```
get_my_matches
```

You should see a JSON list of your ranked jobs. If it returns an error, check your API key (see `references/setup.md`).

## Usage

### Apply to a job from your match list

```
/apply
```

The skill calls `get_my_matches`, presents your top jobs, you pick one, and the workflow runs.

### Apply to a specific job

```
/apply <job_id>
```

Or paste the job posting text directly:

```
/apply
[paste posting text here]
```

### Revise the current draft

```
/apply --revise
```

See `references/revision-mode.md` for the workflow.

## Profile setup (first time)

The skill reads your profile exclusively from `get_my_profile()`. Before your first application, the tenant owner must populate five fields via `PUT /my/profile`:

| Field | What goes in it |
|-------|-----------------|
| `positioning` | Three sentences, three pillars, one USP |
| `cv_text` | Your CV in Markdown |
| `achievements` | Quantified wins, one per row |
| `skills_matrix` | Skills + evidence |
| `writing_style` | Tone, DON'Ts, language rules |

See `references/setup.md` for the full onboarding walkthrough.

## Repository layout

```
apply-skill-desktop/
├── SKILL.md                              — entry point, read by Claude Desktop
├── README.md                             — this file
├── LICENSE                               — MIT
├── .gitignore
├── references/
│   ├── setup.md                          — first-time connector + profile setup
│   ├── agent-prompt-template.md          — writing rules (tone, Jonas-Regel, structure)
│   ├── phase-2-analysis.md               — job-fit + CV tailoring
│   ├── phase-3-research-letter.md        — company research, contact, cover letter
│   ├── phase-4-review.md                 — review + adversarial review
│   ├── phase-5-completion.md             — tracker, channel research
│   ├── revision-mode.md                  — /apply --revise
│   └── templates.md                      — CV + cover-letter Markdown structure
└── examples/
    └── acme-solutions-architect/         — fictional end-to-end example
```

## Security and data handling

- Personal data (profile, job matches) is fetched at runtime via MCP tools — it never lives in this repository.
- The API key is stored in Claude Desktop's connector config, not in this skill folder.
- The fictional example uses `Alex Beispiel` / `Acme GmbH` — all names and numbers are invented.

## Contributing

PRs welcome. Issues: please include the smallest reproducible example.

## License

MIT — see [LICENSE](LICENSE).
