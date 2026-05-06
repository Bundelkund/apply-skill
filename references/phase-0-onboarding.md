# Phase 0 — Onboarding

> First-run questionnaire that personalizes [Discovery Engine](https://github.com/Bundelkund/discovery-engine-public) for the user. Writes two YAML files DE reads at scrape time. After this, `/scrape/{source}` produces ranked jobs that match the user's profile instead of empty-default scoring.

## When to run

- First time the user installs the skill
- User says `/apply --onboarding`, "onboard me", "set up my profile"
- A `${DE_REPO}/config/scoring-profile.local.yaml` does not yet exist

## Prerequisites

- Discovery Engine cloned locally (path resolves via `${DE_REPO}` env var or default `../discovery-engine`)
- `${DE_REPO}/config/archetypes.yaml` exists (shipped with DE)

If DE is not present, ask the user whether to clone it now (`gh repo clone Bundelkund/discovery-engine-public ../discovery-engine`) or to skip Phase 0 — without DE the rest of the skill still works against a manually maintained `${CAREER_DIR}/applications/INDEX.md`.

## Output files

| File | Purpose |
|------|---------|
| `${DE_REPO}/config/scoring-profile.local.yaml` | Stage-1 scoring profile (archetypes, keywords, locations) |
| `${DE_REPO}/config/portals.local.yaml` | Companies + ATS portals to scrape |

Both are gitignored in DE (see DE `.gitignore`).

---

## The questionnaire

### Q1 — Identity (1 question)

```
What's your first name (used as the profile id and as the filename author)?
> _________
```

Stored as `id` and `name` in `scoring-profile.local.yaml`.

### Q2 — Archetypes (presented as a list)

Read `${DE_REPO}/config/archetypes.yaml` and present each archetype as a row:

```
Which archetypes match the kind of role you want? Weight each on a 0.0–1.0 scale (0 = skip, 1 = strong match).

  bridge-builder   — Connects technology and business. Translates between teams.   weight: ___
  enabler          — Enables people and teams. L&D, training, onboarding.          weight: ___
  coach            — Agile, systemic, team coaching.                                weight: ___
  change-agent     — Drives organizational change, transformation.                  weight: ___
  consultant       — Senior advisory with domain expertise.                          weight: ___
  trainer          — AI/GenAI workshops and education.                               weight: ___
  strategist       — Innovation, strategy, vision.                                   weight: ___
  product-lead     — Product ownership with AI/tech focus.                           weight: ___
  facilitator      — Workshops, design thinking, retrospectives.                     weight: ___
```

Skip rows the user weights as 0. Include only archetype keys that exist in the user's `archetypes.yaml` — if the user customized DE's archetype catalog, present their list.

### Q3 — ATS portals (free-form URL input)

```
Which company career pages should we track? Paste one URL per line. Leave blank to use the demo set.

Examples:
  https://job-boards.greenhouse.io/anthropic
  https://jobs.ashbyhq.com/elevenlabs
  https://jobs.lever.co/mistral
  https://acmegmbh.jobs.personio.de
```

For each URL, auto-detect the platform via regex:

| Pattern | Platform | API URL template |
|---------|----------|------------------|
| `job-boards.greenhouse.io/{slug}` or `boards.greenhouse.io/{slug}` | greenhouse | `https://boards-api.greenhouse.io/v1/boards/{slug}/jobs` |
| `jobs.ashbyhq.com/{slug}` | ashby | careers_url is enough |
| `jobs.lever.co/{slug}` | lever | careers_url is enough |
| `{slug}.jobs.personio.de` | personio | careers_url is enough |

If detection fails, ask the user to paste the company name and continue with `scan_method: websearch`.

### Q4 — Free-form filters

```
Positive keywords (boost matches in title/description, comma-separated):
> AI, Coaching, Transformation

Negative keywords (penalize):
> Sales, Vertrieb

Locations of interest (exact match -> 100, remote -> 75, EU/DACH -> 50):
> Berlin, Remote, Hamburg

Seniority — promote (titles you want):
> Senior, Lead, Head, Principal

Seniority — penalize (titles you don't want):
> Junior, Intern, Trainee

Target roles (primary; ranked higher than secondary):
> Solutions Architect, AI Adoption Lead

Target roles (secondary):
> Engineering Manager, Solutions Consultant
```

---

## Writing the YAMLs

### `${DE_REPO}/config/scoring-profile.local.yaml`

Use the schema from `${DE_REPO}/app/scoring/types.py::ScoringProfile`. Example output:

```yaml
id: "{{name}}"
name: "{{Name}}"

archetypes:
  bridge-builder: 0.9
  coach: 0.7
  consultant: 0.6

keywords_positive:
  - "AI"
  - "Coaching"
  - "Transformation"

keywords_negative:
  - "Sales"
  - "Vertrieb"

seniority_boost: ["Senior", "Lead", "Head", "Principal"]
seniority_penalty: ["Junior", "Intern", "Trainee", "Werkstudent"]

target_roles_primary:
  - "Solutions Architect"
  - "AI Adoption Lead"

target_roles_secondary:
  - "Engineering Manager"
  - "Solutions Consultant"

target_locations:
  - "Berlin"
  - "Remote"
  - "Hamburg"

negative_domains: []
```

### `${DE_REPO}/config/portals.local.yaml`

Use the schema from `${DE_REPO}/config/portals.yaml`. Inherit `title_filter` from the demo file unless the user wants to override it. Example output for two answers:

```yaml
title_filter:
  positive:
    - "AI"
    - "Solutions Architect"
    - "Coaching"
  negative:
    - "Junior"
    - "Intern"

tracked_companies:
  - name: "Anthropic"
    careers_url: "https://job-boards.greenhouse.io/anthropic"
    api: "https://boards-api.greenhouse.io/v1/boards/anthropic/jobs"
    notes: "Detected via greenhouse pattern"
    enabled: true

  - name: "ElevenLabs"
    careers_url: "https://jobs.ashbyhq.com/elevenlabs"
    notes: "Detected via ashby pattern"
    enabled: true
```

---

## Validation

After writing both files:

1. **Pydantic validation** — `cd ${DE_REPO} && python -c "from app.config import load_scoring_profile; print(load_scoring_profile())"` must print a populated profile (not None, no validation error).
2. **DE health check** — if DE is running locally, `curl ${DE_BASE_URL}/health` should return 200.
3. **Optional initial scrape** — ask the user whether to trigger `POST ${DE_BASE_URL}/scrape/greenhouse` (or whichever first portal pattern matched) so the database is non-empty before Phase 1.

---

## Re-running

`/apply --onboarding` always overwrites the local YAMLs. To preserve answers and only update specific fields, edit `${DE_REPO}/config/scoring-profile.local.yaml` directly — DE picks up changes on the next scrape (the `lru_cache` invalidates on process restart only; `docker compose restart de` or process restart is enough).

## Anti-patterns

- Writing into `${DE_REPO}/config/scoring-profile.yaml` (the non-`.local` file) — that's a shipped example, not a user file
- Asking the user 30 questions before `/apply` is useful — keep Phase 0 to the four blocks above, defer everything else to per-application phases
- Persisting any answer outside `${DE_REPO}/config/*.local.yaml` — onboarding writes nothing into the user's home directory or this skill's repo
