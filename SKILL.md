---
name: apply
description: Cover-letter + CV generator from job posting to ready-to-send PDF. Orchestrates job-fit analysis, CV tailoring, company research, contact lookup, review and PDF export via headless Chrome (preferred) or pandoc/XeLaTeX (fallback). Companion to Discovery Engine — Phase 0 onboarding writes a scoring profile that DE consumes for Stage-1 scoring. Use when user says "apply", "Bewerbung", "cover letter", "Anschreiben", "/apply".
---

# /apply — Application Builder

> From job posting to a ready-to-send PDF (cover letter + CV). Companion to [Discovery Engine](https://github.com/Bundelkund/discovery-engine-public).

## When to use

Use this skill when:
- User has a job posting (text, URL, or a row in their tracker DB)
- User says "apply", "Bewerbung schreiben", "cover letter", "/apply"
- User runs `/apply` without an argument → list top jobs from their Discovery Engine instance

Do **not** use for:
- Open-ended job hunting without a concrete posting
- Editing the user's profile data directly (edit `${CAREER_DIR}/profile/*.md`)
- Editing templates (edit `templates/`)

---

## Prerequisites

Before the first run, populate `${CAREER_DIR}/profile/` from the skeletons in `templates/profile/`. The skill expects:

- `positioning.md` — core narrative (~3 sentences, three pillars)
- `cv-text.md` — full CV as Markdown
- `achievements.md` — quantified wins, one per row
- `skills-matrix.md` — skills with evidence
- `writing-style.md` — tone, language rules, DON'Ts
- `fragen.md` — questions to ask the hiring team
- `metadata.yaml` — author + contact defaults (copy from `templates/metadata.yaml.example`)

**PDF pipeline**: HTML + headless Chrome (preferred) or pandoc + XeLaTeX (fallback). The skill picks whichever is available.

---

## Workflow

### Phase 0: Onboarding (first run only)

The skill is a single-tenant companion to [Discovery Engine](https://github.com/Bundelkund/discovery-engine-public). On the first run, it asks four questions and writes the answers into the DE config files DE reads at scrape time. After this, `/scrape` produces ranked jobs that match your profile.

Read `references/phase-0-onboarding.md` for the full questionnaire and the YAML it writes.

### Phase 1: Input & setup

0. **Job suggestions** (when `/apply` is called without a posting): query DE/Supabase for top jobs with score >= a configurable threshold (default 40)
1. **Receive the posting** (text, URL via WebFetch, or DB row)
2. **Create the working directory**: `mkdir -p "${CAREER_DIR}/applications/{{company}}-{{role}}/output"`
3. **Write `stellenanzeige.md`** (mandatory — input to all later phases)
4. **Load profile files**: positioning, cv-text, achievements, skills-matrix, writing-style

### Phase tracking (mandatory after Phase 1)

```
- [ ] stellenanzeige.md created (Phase 1)
- [ ] job-fit-analysis.md created (Phase 2a)
- [ ] cv-anpassung.md created (Phase 2b)
- [ ] cv.md created (Phase 2c)
- [ ] Company research done (Phase 3a)
- [ ] Hunter.io contact lookup done (Phase 3b)
- [ ] anschreiben.md created (Phase 3c)
- [ ] PDFs generated + validated (Phase 4)
- [ ] Tracker + INDEX.md updated (Phase 5)
```

### Phase 2: Analysis

Job-fit check, CV tailoring (bullet-point upgrade), CV as Markdown.

Read `references/phase-2-analysis.md` for steps and scoring.

### Phase 3: Research + cover letter

Company research (mandatory), Hunter.io contact lookup, cover letter using the writing rules in `references/agent-prompt-template.md`.

Read `references/phase-3-research-letter.md` for the research checklist, contact lookup, and writing rules.

### Phase 4: Review + PDF

File-existence gate, template review, optional adversarial review (Generator-Verifier gate at job-fit >= 70), PDF generation via Chrome or pandoc, validation.

Read `references/phase-4-review-pdf.md` for the review checklist, adversarial review (4a.5), browser/pandoc commands, and validation.

### Phase 5: Completion

Tracker update (Supabase or local INDEX.md), application channel research, questions for the hiring team, next steps for the user.

Read `references/phase-5-completion.md` for the completion checklist.

---

## Revision mode: `/apply --revise [slug]`

Reworks an existing application based on review feedback.

Read `references/revision-mode.md` for the workflow (R1-R6).

---

## Principles

1. **Template = single source of truth.** Tone and structure live in `references/agent-prompt-template.md` — not in SKILL.md.
2. **Company research is mandatory.** Never write a cover letter without it.
3. **Both PDFs are mandatory.** Cover letter + CV.
4. **Profile files = data source.** Every claim in the cover letter must be traceable to `${CAREER_DIR}/profile/`.
5. **`stellenanzeige.md` is mandatory.** Input file for every later phase.

## Anti-patterns

- Inline writing rules in SKILL.md (they belong in `references/agent-prompt-template.md`)
- Skipping company research
- CV without PDF, cover letter > 1 page
- Forgetting `stellenanzeige.md`

## Application directory layout

```
${CAREER_DIR}/applications/{{company}}-{{role}}/
├── stellenanzeige.md       (Phase 1)
├── job-fit-analysis.md     (Phase 2a)
├── cv-anpassung.md         (Phase 2b)
├── cv.md                   (Phase 2c)
├── anschreiben.md          (Phase 3c)
└── output/
    ├── Anschreiben_{{author}}.html/.pdf  (Phase 4)
    └── CV_{{author}}.html/.pdf           (Phase 4)
```

## Batch mode

Read `references/batch-mode.md` for parallel agent runs and batch PDF generation.

## Automation

The skill ships with a routine that can run daily (e.g. via cron or Windows Task Scheduler) to apply to the highest-scoring unprocessed job. Read `references/automation.md` for setup.

## Related skills

- `pandoc` — document conversion (fallback pipeline)
- `deep-research` — deeper company research

## Reference index

| File | Purpose |
|------|---------|
| `references/phase-0-onboarding.md` | First-run questionnaire writing into Discovery Engine |
| `references/agent-prompt-template.md` | Condensed context for subagents (writing rules) |
| `references/phase-2-analysis.md` | Job-fit + CV tailoring |
| `references/phase-3-research-letter.md` | Company research, contact lookup, cover letter |
| `references/phase-4-review-pdf.md` | Review, adversarial review, PDF generation |
| `references/phase-5-completion.md` | Tracker, INDEX.md, channel research |
| `references/revision-mode.md` | Revision workflow |
| `references/batch-mode.md` | Parallel agents + batch PDF generation |
| `references/automation.md` | Daily auto-apply routine |
| `templates/metadata.yaml.example` | Author + contact defaults |
| `templates/generate-cvs.js` | CV-HTML generator |
