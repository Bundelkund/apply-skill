# Phase 3: Research + cover letter

## 3a: Company research (mandatory — do not skip!)

**Before every cover letter:**

1. **Web search**: `"{{company}} mission values products"` — use Claude's built-in web capability
2. **Web search**: `"{{company}} about careers"` — read the company's public pages (About, Careers, Blog)
3. **Web search**: `"{{company}} interview founder"` — what are the founders saying?

**Core question to answer**: which concrete problem does this company have that I have already solved?

**Note down**:
- the company's problem / challenge
- values and culture
- a fitting example from my own experience
- what fascinates me about this company / industry

## 3b: Find a contact (web research)

**When**: always. Skip only if a concrete contact (name + role) is already named in the posting.

Search for the hiring contact via web research: `"{{company}} recruiter" OR "{{company}} talent acquisition" OR "{{company}} head of HR"`.

**Contact selection (priority)**:
1. HR Business Partner / Talent Acquisition / Recruiter
2. Head of HR / Chief People Officer
3. Co-founder / CEO (only at companies < 50 FTE)
4. Functional contact (department head of the target team)

If no contact is found, address the cover letter generically (e.g. "Sehr geehrte Damen und Herren,").

**Use the result**:
- best contact → `empfaenger` header in the cover letter (`z.Hd. [Name]`)
- personalize the salutation (`Sehr geehrte/r Frau/Herr [Lastname]`)

## 3c: Write the cover letter

**Load context**:
- `references/agent-prompt-template.md` — structure, tone, rules (single source of truth)
- `get_my_profile()` fields — positioning, achievements, writing_style
- `job-fit-analysis` from Phase 2a — fit + keywords
- research notes from 3a

The cover letter follows the structure and rules from `agent-prompt-template.md`.

**YAML header** (include at the top of the cover letter Markdown):
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
- forbidden: first name in salutation, body, or closing
- never "Lieber/Liebe {{Name}}" — too personal without prior contact

**Language**: all umlauts as UTF-8 (ä/ö/ü/ß), NEVER ASCII replacements. Em dashes as `—` (not `--`).

**Post-write validation** (check inline before presenting):
- Umlaut check: scan for ASCII replacements (ueber, koennen, fuer, Gruesse, Maerz, Gespraech, Loesung, etc.)
- First-name check: no "Lieber ", "Liebe " or ", [Firstname]." in salutation or body

**Output**: in-conversation Markdown block labelled `anschreiben`.
