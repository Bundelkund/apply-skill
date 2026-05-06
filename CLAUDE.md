# Apply Skill

> Claude Code skill: cover-letter + CV generator from job posting to ready-to-send PDF.

This file is the project-level CLAUDE.md. It tells any Claude Code session entering this repo what the project is, what conventions apply, and where the deep dives live.

## What

A 5-phase workflow that turns a job posting into a finished application bundle (cover letter + CV as PDF, plus tracker entry). Phase 0 is a one-time onboarding that personalizes the companion project Discovery Engine.

## Companion project

[**Discovery Engine**](https://github.com/Bundelkund/discovery-engine-public) — single-tenant FastAPI service that scrapes + ranks ATS postings.

- This skill **writes** `${DE_REPO}/config/scoring-profile.local.yaml` during Phase 0 onboarding
- Discovery Engine **reads** that file to drive Stage-1 scoring (`app/config.py::load_scoring_profile`)
- Both projects are MIT-licensed and useful standalone

## Conventions

| Rule | Forbidden | Required |
|------|-----------|----------|
| Single source of truth for tone | Inline writing rules in SKILL.md | Tone rules live in `references/agent-prompt-template.md` |
| Personal data hygiene | Real names / numbers in committed files | `{{placeholders}}` only; user fills `${CAREER_DIR}/profile/*.md` (gitignored) |
| Phase tracking | Skipping phases silently | After Phase 1, present the 8-item checkbox list and tick as you go |
| Mandatory steps | Cover letter without company research | WebSearch + WebFetch in Phase 3a, every time |
| PDFs | Cover letter without CV (or vice versa) | Both PDFs are generated and validated in Phase 4 |
| Anglicisms | "Adoption" in German text | Prefer "Adaption" or "Annahme" |

## Where to look

| Topic | File |
|-------|------|
| Skill entry point | [SKILL.md](SKILL.md) |
| First-run setup | [references/phase-0-onboarding.md](references/phase-0-onboarding.md) |
| Writing rules | [references/agent-prompt-template.md](references/agent-prompt-template.md) |
| PDF pipeline | [references/phase-4-review-pdf.md](references/phase-4-review-pdf.md) |
| Daily automation | [references/automation.md](references/automation.md) |
| Fictional example | [examples/acme-solutions-architect/](examples/acme-solutions-architect/) |

## Anti-patterns

- Loading all profile files into context up-front. Use the agent-prompt-template (~80 lines) as the prefix; load full profiles only on edge cases.
- Putting personal data in this repo. The whole point is that this repo is publicly forkable; user data lives in `${CAREER_DIR}` and `.env`.
- Skipping Phase 0 with a hand-written `scoring-profile.local.yaml`. Phase 0's questions encode the trade-offs the user should make explicitly.
