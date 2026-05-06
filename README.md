# Apply Skill

> Cover-letter + CV generator from job posting to ready-to-send PDF. Built as a Claude Code skill, designed as the companion to [Discovery Engine](https://github.com/Bundelkund/discovery-engine-public).

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## What it does

You hand the skill a job posting (text, URL, or row from a tracker DB). The skill walks through five phases:

1. **Input & setup** — write `stellenanzeige.md`, scaffold the application directory
2. **Analysis** — keyword + gap analysis, fit score, CV tailoring
3. **Research + cover letter** — company research, contact lookup, cover letter following the "Jonas rule" (problem -> solution -> benefit)
4. **Review + PDF** — template review, optional adversarial review at fit >= 70, HTML/Chrome or pandoc/XeLaTeX PDF generation
5. **Completion** — tracker update, channel research, prepared questions for the hiring team

Plus a one-time **Phase 0 — Onboarding** that personalizes [Discovery Engine](https://github.com/Bundelkund/discovery-engine-public) by writing a `scoring-profile.local.yaml` it consumes during scraping.

## Requirements

- [Claude Code](https://docs.anthropic.com/claude/docs/claude-code) (CLI, desktop, or IDE extension)
- Node.js 18+ (for `templates/generate-cvs.js`, the CV HTML generator)
- Headless Chrome **or** pandoc + XeLaTeX (for PDF generation)
- Optional but recommended:
  - [Discovery Engine](https://github.com/Bundelkund/discovery-engine-public) running locally — provides ranked job postings and consumes the scoring profile this skill writes
  - Hunter.io API key (free plan: 50 searches/month) — used by Phase 3b for contact lookup
  - A tracker DB (Supabase / Postgres / sqlite) — optional; INDEX.md is the file-based fallback

## Installation

### 1. Clone the skill into your Claude Code skills directory

```bash
# Project-local (recommended):
cd /your/project
mkdir -p .claude/skills
git clone https://github.com/Bundelkund/apply-skill.git .claude/skills/apply

# OR globally (~/.claude is read by every Claude Code session):
git clone https://github.com/Bundelkund/apply-skill.git ~/.claude/skills/apply
```

### 2. Set up your environment

```bash
cd .claude/skills/apply
cp .env.example .env
# Edit .env — set DE_BASE_URL, APPLY_API_KEY (if using Discovery Engine), HUNTER_API_KEY (optional)

cp templates/metadata.yaml.example $CAREER_DIR/metadata.yaml
# Edit metadata.yaml — set author, contact details
```

### 3. Populate your profile

The skill reads structured profile data from `${CAREER_DIR}/profile/`. Copy the skeletons and fill them in:

```bash
mkdir -p $CAREER_DIR/profile
cp templates/profile/*.md $CAREER_DIR/profile/
# Edit each file — replace {{placeholders}} with your own positioning, achievements, etc.
```

The six profile files:

| File | What goes in it |
|------|-----------------|
| `positioning.md` | Three sentences, three pillars, one USP |
| `cv-text.md` | Your CV in Markdown |
| `achievements.md` | Quantified wins, one per row |
| `skills-matrix.md` | Skills + evidence (not a self-assessment scale) |
| `writing-style.md` | Tone, DON'Ts, language rules |
| `fragen.md` | Base questions for the hiring team |

### 4. (Optional) Connect Discovery Engine

If you have [Discovery Engine](https://github.com/Bundelkund/discovery-engine-public) running locally:

```bash
# In Claude Code:
/apply --onboarding
```

Phase 0 walks you through 4 questions (identity, archetypes, ATS portals, free-form filters) and writes:

- `${DE_REPO}/config/scoring-profile.local.yaml` — Stage-1 scoring profile
- `${DE_REPO}/config/portals.local.yaml` — companies to scrape

Both are gitignored in DE.

## Usage

### Apply to a specific posting

```
/apply <paste posting text or URL>
```

Or, with a posting in your tracker DB:

```
/apply <job-id-from-tracker>
```

The skill creates `${CAREER_DIR}/applications/{{company}}-{{role}}/` and runs all 5 phases. Output: 2 PDFs in `output/` plus all intermediate Markdown files.

### Apply to the top job (no argument)

```
/apply
```

The skill queries your tracker DB (or Discovery Engine + Supabase) for the highest-scoring unprocessed job and runs the workflow.

### Revise an existing application

```
/apply --revise {{slug}}
```

See `references/revision-mode.md` for the workflow.

### Daily auto-apply

See `references/automation.md` for cron / Task Scheduler wiring.

## Repository layout

```
apply-skill/
├── SKILL.md                              — entry point, read by Claude Code
├── README.md                             — this file
├── LICENSE                               — MIT
├── .env.example                          — environment template
├── .gitignore
├── references/                           — one file per phase, read on demand
│   ├── phase-0-onboarding.md
│   ├── phase-2-analysis.md
│   ├── phase-3-research-letter.md
│   ├── phase-4-review-pdf.md
│   ├── phase-5-completion.md
│   ├── agent-prompt-template.md          — condensed context for subagents
│   ├── automation.md                     — daily auto-apply
│   ├── batch-mode.md                     — parallel agents
│   └── revision-mode.md                  — /apply --revise
├── templates/
│   ├── anschreiben.html / .tex           — cover letter templates
│   ├── cv.html / .tex                    — CV templates
│   ├── generate-cvs.js                   — CV HTML generator
│   ├── metadata.yaml.example             — author + contact defaults
│   └── profile/                          — profile skeletons (positioning, cv-text, …)
└── examples/
    └── acme-solutions-architect/         — fictional end-to-end example
```

## Companion project: Discovery Engine

[Discovery Engine](https://github.com/Bundelkund/discovery-engine-public) is the upstream system that finds + ranks job postings. The two projects are loosely coupled:

| What | Discovery Engine | Apply Skill |
|------|------------------|-------------|
| Scrape ATS portals | yes | no |
| Score postings | yes (Stage-1 keyword + archetype) | no |
| Persist jobs | yes (Supabase) | reads via DE/Supabase |
| Generate CV/cover letter | no | yes |
| Write `scoring-profile.local.yaml` | no | **yes** (Phase 0 onboarding) |
| Read `scoring-profile.local.yaml` | **yes** (Stage-1 scoring) | no |

You can use either project standalone. They are nicest together.

## Security and data handling

- The skill writes to `${CAREER_DIR}` (your local file tree) and `${DE_REPO}/config/*.local.yaml` (gitignored in DE). Nothing leaves your machine unless you explicitly run a tracker-DB or Hunter.io call.
- `.env` and `${CAREER_DIR}/profile/` are gitignored. Do not commit them.
- The fictional example uses `Alex Beispiel` / `Acme GmbH` — all names and numbers are invented.
- Phase 0 onboarding **only** writes into Discovery Engine's `config/*.local.yaml` files. It never writes into the user's home directory or this skill's repo.

## Contributing

PRs welcome. Issues: please include the smallest reproducible example.

## License

MIT — see [LICENSE](LICENSE).
