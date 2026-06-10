# Apply Skill — Desktop Variant

> Claude Desktop Agent Skill: cover-letter + CV generator from job posting to polished in-conversation Markdown.

## What

A 5-phase workflow that turns a job posting into a finished application (cover letter + CV as Markdown, plus tracker entry). Writing logic is identical to the Claude Code original; only I/O has changed — local filesystem access, shell commands, and PDF generation are replaced by four MCP tools.

## The 4 MCP tools (all personal I/O flows through these)

| Tool | Direction | Purpose |
|------|-----------|---------|
| `get_my_matches(min_score?, limit?)` | read | Ranked job list: `{count, matches:[{job_id, score, job_title, company, url, location}]}` |
| `get_job(job_id)` | read | Full posting text (`description` + metadata) — mandatory before Phase 2 |
| `get_my_profile()` | read | 5-field profile: `{positioning, cv_text, achievements, skills_matrix, writing_style}` — replaces all `profile/*.md` files 1:1 |
| `save_application({job_id, status, company?, role?, notes?})` | write | Tracker entry; `status` ∈ `drafted \| applied \| interview \| offer \| rejected \| paused` |

Identity is the caller's MCP API key (resolved server-side to `profile_id`). The skill never hardcodes a profile id or user name.

## Conventions

| Rule | Forbidden | Required |
|------|-----------|----------|
| Single source of truth for tone | Inline writing rules in SKILL.md | Tone rules live in `references/agent-prompt-template.md` |
| Personal data | Real names / numbers in committed files | `{{placeholders}}` only; live data via MCP tools at runtime |
| Phase tracking | Skipping phases silently | After Phase 1, present the 9-item checkbox list and tick as you go |
| Mandatory steps | Cover letter without company research | Web research in Phase 3a, every time |
| Artifacts | Writing without calling `get_job` first | Always call `get_job(job_id)` before Phase 2 |

## Where to look

| Topic | File |
|-------|------|
| Skill entry point | [SKILL.md](SKILL.md) |
| Connector + profile setup | [references/setup.md](references/setup.md) |
| Writing rules | [references/agent-prompt-template.md](references/agent-prompt-template.md) |
| Review (no PDF) | [references/phase-4-review.md](references/phase-4-review.md) |
| Tracker update | [references/phase-5-completion.md](references/phase-5-completion.md) |
| Fictional example | [examples/acme-solutions-architect/](examples/acme-solutions-architect/) |
