# Agent prompt template — /apply subagents

> Condensed context block for subagents in batch mode. Instead of loading 5 profile files (~400 lines), inject this block (~80 lines). Saves ~50% tokens.

## How to use

When spawning `/apply` subagents, prepend this block as a context prefix:

```
Read references/agent-prompt-template.md and use it as context for the
following application task: [...]
```

The user fills the `## Profile context` section below from their own
`${CAREER_DIR}/profile/*.md` files. The skill never edits this file at
runtime — it is the source of truth for tone and structure.

---

## Profile context ({{Author Name}})

> Replace the placeholders below with content from `${CAREER_DIR}/profile/`.
> The blocks marked `{{...}}` are the only personal data in this file.
> An onboarding helper can be added that extracts these from `positioning.md`,
> `achievements.md`, and `writing-style.md`.

### Positioning (from `${CAREER_DIR}/profile/positioning.md`)

{{positioning paragraph — three sentences, three pillars, one USP}}

**Three pillars**:
1. **{{Pillar 1 — e.g. Tech}}**: {{one-liner with evidence}}
2. **{{Pillar 2 — e.g. Mediation}}**: {{one-liner with evidence}}
3. **{{Pillar 3 — e.g. Systemic / Agile}}**: {{one-liner with evidence}}

**USP**: {{the unique combination — e.g. "X + Y. I can do A AND explain B."}}

### Key achievements (from `${CAREER_DIR}/profile/achievements.md`)

> Quantified wins, one per row. Numbers + context + source.

| Evidence | Numbers | Context |
|----------|---------|---------|
| {{achievement 1}} | {{number}} | {{org / year}} |
| {{achievement 2}} | {{number}} | {{org / year}} |
| {{achievement 3}} | {{number}} | {{org / year}} |
| {{achievement 4}} | {{number}} | {{org / year}} |

> **Composition rules**: see `${CAREER_DIR}/profile/achievements.md`. Achievements
> from different periods MUST NOT be linked as causality unless evidence supports
> it ("X went up BECAUSE of Y" requires a documented chain). Add explicit
> separation rules in `achievements.md` for any pair that is often confused.

### Tone (from `${CAREER_DIR}/profile/writing-style.md`)

- **{{Voice — e.g. "north-German dry"}}**: {{key descriptors}}
- **DO**: concrete numbers, active verbs, name the impact, own projects as evidence
- **DON'T**: abstract buzzwords ("synergies"), therapy language, passive constructions, exaggeration, frameworks without context, unchecked anglicisms (in German text)

### The "Jonas rule" (cover-letter core)

> Describe how you have already solved this company's problem.

1. Name the company's problem (shows understanding)
2. A concrete example of how you solved exactly that problem
3. What the company gets from it (NOT: what you can do)

**No** achievement parade. Examples only as evidence for problem-solution.

### Three-pillar composition

Every cover letter has ONE leading pillar. The others serve it.

| Posting type | Leading pillar | Serving |
|--------------|----------------|---------|
| L&D / training / upskilling | Mediation | Tech as evidence, Agile as change-skill |
| Innovation / AI consulting | Tech | Mediation as differentiator, Agile as method |
| Agile coach / change | Systemic / Agile | Mediation as facilitation, Tech as context |

**Rules**:
1. Every paragraph connects at least 2 pillars
2. Tech projects are context, not parade
3. Red thread = company problem -> my solution -> company benefit
4. Closing paragraph = what the company gets (NOT: why I want to apply)

### Language rules (mandatory for German output)

- **Umlauts**: ALWAYS UTF-8 (ä, ö, ü, ß). NEVER ASCII replacements (ae, oe, ue, ss).
- **Salutation**:
  - formal (default): "Sehr geehrte/r Frau/Herr {{Lastname}}"
  - informal (Du-culture): "Hallo," WITHOUT a name
  - forbidden: first name in salutation, body, or closing
  - never "Lieber/Liebe {{Name}}" — too personal
- **Em dashes**: always `—`, never `--`

### Cover-letter structure (4 paragraphs, max 1 page)

1. **Opening** (2-3 sentences): name the company's problem
2. **Mediation evidence** (4-5 sentences): concrete example with numbers (lean into the leading pillar)
3. **Second pillar** (3-4 sentences): the serving pillar reinforces
4. **What the company gets** (2-3 sentences): concrete benefit + invitation

### Motivation block (always personalize!)

> {{One paragraph from `${CAREER_DIR}/profile/motivation.md` — what drives you, in your own voice. Always tie it back to the concrete company.}}

### Anti-positioning (DO NOT use)

- Generic role labels with no evidence
- "Therapeutic AI trainer" / "Functional AI consultant" / "Digital transformation expert" — every cover letter has them, none of them mean anything
- Buzzwords without a concrete project as evidence

---

## Mandatory steps (do not skip)

1. **Company research before the cover letter** (WebSearch + WebFetch)
2. **Pick the leading pillar** (from posting type -> three-pillar table)
3. **Generate both PDFs** (cover letter + CV)
4. **Keyword reconciliation** (HTML comment at the bottom of the cover letter: every must-have keyword OK / NOT OK with reasoning)
5. **PDF validation** (page count, file size, must-have keywords)
6. **Tracker update** (if the job came from a tracker DB)
7. **INDEX.md update**

## File references

| What | Path |
|------|------|
| Full profile files | `${CAREER_DIR}/profile/*.md` |
| LaTeX / HTML templates | `templates/` |
| Application tracker | `${CAREER_DIR}/applications/INDEX.md` |
| Skill documentation | `SKILL.md` |

> When in doubt (unclear tone, missing evidence) -> reload the profile files.
