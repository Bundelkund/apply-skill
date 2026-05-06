# Phase 3: Research + cover letter

## 3a: Company research (mandatory — do not skip!)

**Before every cover letter:**

1. **WebSearch**: `"{{company}} mission values products"`
2. **WebFetch**: read the company's site (About, Careers, Blog)
3. **WebSearch**: `"{{company}} interview founder"` — what are the founders saying?
4. **Optional**: query a knowledge graph (e.g. Neo4j) if the company exists there (culture profile, tech stack)

**Core question to answer**: which concrete problem does this company have that I have already solved?

**Note down**:
- the company's problem / challenge
- values and culture
- a fitting example from my own experience
- what fascinates me about this company / industry

## 3b: Find a contact (Hunter.io) — mandatory

**When**: always. Skip only if a concrete contact (name + role + email) is already named in the posting.

**Prerequisite**: `HUNTER_API_KEY` in `.env` (Free plan: 50 searches/month, max `limit=10`).

**Lookup script**: ship a small Python helper at `scripts/hunter-contact-lookup.py` (not included by default — copy from your private skill repo or write a few lines of `httpx` against `https://api.hunter.io/v2/domain-search`).

**Contact selection (priority)**:
1. HR Business Partner / Talent Acquisition / Recruiter
2. Head of HR / Chief People Officer
3. Co-founder / CEO (only at companies < 50 FTE)
4. Functional contact (department head of the target team)

**Use the result**:
- best contact -> `empfaenger` header in the cover letter (`z.Hd. [Name]`)
- personalize the salutation (`Sehr geehrte/r Frau/Herr [Lastname]`)
- email -> INDEX.md column `Email`
- LinkedIn -> note for later networking

**Free-plan limits**: `limit` must be <= 10. 50 searches/month total.

## 3c: Write the cover letter

**Load context**:
- `references/agent-prompt-template.md` — structure, tone, rules (single source of truth)
- `${CAREER_DIR}/applications/{{company}}-{{role}}/job-fit-analysis.md` — fit + keywords
- research notes from 3a

The cover letter follows the structure and rules from `agent-prompt-template.md`.

**YAML header**:
```yaml
---
empfaenger: |
  {{Company}} GmbH\
  z.Hd. Herr/Frau {{Contact}}\
  {{Address if known}}\
  {{ZIP City}}
datum: "{{City}}, {{Date}}"
betreff: "Bewerbung als {{Role}}"
---
```

**Salutation rules** (German market default):
- formal (default): "Sehr geehrte/r Frau/Herr {{Lastname}}"
- informal (Du-culture): "Hallo," WITHOUT a name
- forbidden: first name in salutation ("Lieber Kevin"), first name in body or closing
- never "Lieber/Liebe {{Name}}" — too personal without prior contact

**Language**: all umlauts as UTF-8 (ä/ö/ü/ß), NEVER ASCII replacements. Em dashes as `—` (not `--`).

**Post-write validation** (run right after writing):
```bash
# Umlaut check (German)
grep -cP '(ueber|koennen|fuer |Gruesse|Maerz|Gespraech|Loesung|Einfuehrung|Veraenderung|wuerde|darueber|Haekchen|Pruefung|geloest|Lucke|heisst|laesst)' anschreiben.md
# First-name check
grep -P '(Lieber |Liebe |, [A-Z][a-z]+\.$)' anschreiben.md
```

**Output**: `${CAREER_DIR}/applications/{{company}}-{{role}}/anschreiben.md`
