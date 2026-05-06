# Phase 4: Review + PDF

**Variable**: `AUTHOR` = `author` from `${CAREER_DIR}/metadata.yaml` (e.g. "Alex Beispiel"). All filenames use `${AUTHOR}`.

## GATE — file-existence check (mandatory before Phase 4)

```bash
APPLY_DIR="${CAREER_DIR}/applications/{{company}}-{{role}}"
for f in stellenanzeige.md job-fit-analysis.md cv-anpassung.md cv.md anschreiben.md; do
  test -f "$APPLY_DIR/$f" && echo "OK: $f" || echo "MISSING: $f"
done
```

If files are missing: stop. Ask the user whether to fill them in or skip.

## 4a: Review against the template

Check the cover letter against `references/agent-prompt-template.md`:

- [ ] Structure matches the template (4 paragraphs by default)
- [ ] All DON'Ts from the template respected
- [ ] Keyword reconciliation as an HTML comment at the bottom
- [ ] Every must-have keyword from `job-fit-analysis.md` covered
- [ ] Cover letter <= 1 page
- [ ] Recipient and subject correct
- [ ] No spelling errors
- [ ] **Salutation present**: first line after `---` is a real salutation
- [ ] **Closing correct**: umlauts present, no backslash before name
- [ ] **Umlauts throughout**: no ASCII replacements
- [ ] **No first name** of the contact in salutation or body
- [ ] **No unchecked anglicisms** (e.g. German "Adoption" -> "Adaption" or "Annahme")

## 4a.5: Adversarial review (Generator-Verifier gate)

> **Optional, recommended for**: high-interest postings (job-fit >= 70), leadership roles, or when the user passes `/apply --thorough`.
> **Skip for**: batch mode, low job-fit, or `/apply --fast`.

**Pattern**: Generator-Verifier — the cover letter is the generated artifact, a fresh reviewer attacks it against the posting.

**Steps**:

1. **Spawn reviewer** as a subagent with a sceptic persona:

```
Agent({
  prompt: "
    You are a sceptical application reviewer. Your job is to find weaknesses
    in the cover letter — NOT to confirm it is good.

    ## Criteria (score 1-10, threshold 7)

    - posting-match:
        Check: every must-have requirement from the posting is addressed in
        the cover letter. Count missing keywords.
        how_to_test: compare posting paragraph by paragraph with the letter.

    - authenticity:
        Check: no generic filler, concrete examples with numbers / context,
        no 'I am highly motivated' style.
        how_to_test: mark every sentence that would also fit another role.

    - jonas-rule (problem-solution):
        Check: paragraphs 2-3 show concrete value for the company, not just
        what the candidate can do.
        how_to_test: check that 'Sie/Ihr/your company' appears more often
        than 'Ich/I/my'.

    - no-donts:
        Check: none of the DON'Ts in writing-style.md are violated.
        how_to_test: check against the DON'T list.

    ## Input
    Posting: <stellenanzeige.md inline>
    Cover letter: <anschreiben.md inline>
    Writing-style: <${CAREER_DIR}/profile/writing-style.md inline>
    Job-fit: <job-fit-analysis.md inline>

    Output ONLY as a YAML block (scores + evidence).
  "
})
```

2. **Feedback loop** — max 2 rounds:
   - Round 1: score all 4 criteria
   - On FAILs: lead agent rewrites `anschreiben.md` directly
   - Round 2: re-score only the failed criteria
   - After round 2 still FAILs -> ask the user

3. **Result** — short note at the end of `anschreiben.md`:

```markdown
<!-- Adversarial Review: PASS | R1: posting-match 5->8, authenticity 8, jonas-rule 7, no-donts 9 -->
```

**To revert**: just skip this step — it only edits `anschreiben.md` (content tweaks) and adds an HTML comment. No structural changes to the skill.

## 4b: Generate PDFs

### Pipeline A: HTML + headless Chrome (preferred)

Design templates with photo, sidebar, color accents, skill pills.

**Chrome path** (configure via `CHROME_BIN` env):
- Linux: `/usr/bin/google-chrome`
- macOS: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`
- Windows: `C:/Program Files/Google/Chrome/Application/chrome.exe`

**Step 1: cover-letter HTML**

Template: `templates/anschreiben.html`
- **All placeholders MUST be replaced**: `{{SUBTITLE}}`, `{{DATUM}}`, `{{EMPFAENGER}}`, `{{BETREFF}}`, `{{ANREDE}}`, `{{ABSAETZE}}`, `{{GRUSSFORMEL}}`
- **Post-replacement check** (mandatory): `grep -c '{{' output/Anschreiben*.html` must be `0`
- Umlauts as HTML entities (`&auml;`, `&ouml;`, `&uuml;`, `&szlig;`)
- For more than 4 paragraphs: shrink font size (e.g. 9.5pt)

Output: `${CAREER_DIR}/applications/{{company}}-{{role}}/output/Anschreiben_${AUTHOR}.html`

**Step 2: CV HTML**

Generator script: `templates/generate-cvs.js`
- Reads `templates/cv.html` as base
- Per-application config: `subtitle`, `profil`, `page1Jobs`, `page2Jobs`, `sidebarSkills`, `page2SidebarSkills`, `erfolge`, `certs`
- Design: 2 columns (33% dark sidebar + 67% white main), 2 pages

**Add a new entry to `generate-cvs.js`**:
```js
{
  name: '{{company}}-{{role}}',
  subtitle: 'Role &amp; context',
  profil: 'Profile text...',
  page1Jobs: [
    { title: '...', date: '...', company: '...', bullets: ['...'] }
  ],
  page2Jobs: [...],
  sidebarSkills: [
    { label: 'Category', pills: ['*Highlighted', 'Normal'] }
  ],
  page2SidebarSkills: [...],
  erfolge: ['...'],
  certs: ['...']
}
```

Then: `node templates/generate-cvs.js`

Output: `${CAREER_DIR}/applications/{{company}}-{{role}}/output/CV_${AUTHOR}.html`

**Step 3: HTML -> PDF**

```bash
# Cover letter
"$CHROME_BIN" --headless --disable-gpu --no-sandbox \
  --print-to-pdf="[output-path]/Anschreiben_${AUTHOR}.pdf" --no-margins \
  "file://[html-path]/Anschreiben_${AUTHOR}.html"

# CV
"$CHROME_BIN" --headless --disable-gpu --no-sandbox \
  --print-to-pdf="[output-path]/CV_${AUTHOR}.pdf" --no-margins \
  "file://[html-path]/CV_${AUTHOR}.html"
```

**Important**: `--no-margins` is required (margins are defined inside the HTML).

### Pipeline B: pandoc + XeLaTeX (fallback)

Use only when Chrome is not available.

```bash
# Cover letter
pandoc "${CAREER_DIR}/applications/{{company}}-{{role}}/anschreiben.md" \
  -o "${CAREER_DIR}/applications/{{company}}-{{role}}/output/Anschreiben_${AUTHOR}.pdf" \
  --template="templates/anschreiben.tex" \
  --metadata-file="templates/metadata.yaml" \
  --pdf-engine=xelatex

# CV
pandoc "${CAREER_DIR}/applications/{{company}}-{{role}}/cv.md" \
  -o "${CAREER_DIR}/applications/{{company}}-{{role}}/output/CV_${AUTHOR}.pdf" \
  --template="templates/cv.tex" \
  --pdf-engine=xelatex
```

## 4c: PDF validation (automatic)

```bash
APPLY_DIR="${CAREER_DIR}/applications/{{company}}-{{role}}/output"
test -s "$APPLY_DIR/Anschreiben_${AUTHOR}.pdf" && echo "OK" || echo "FAIL"
test -s "$APPLY_DIR/CV_${AUTHOR}.pdf" && echo "OK" || echo "FAIL"
ls -la "$APPLY_DIR/"*.pdf
# Expected sizes: cover letter ~45-55KB, CV ~130-140KB (with photo)
```

## 4d: Visual review

Load both PDFs via the Read tool and check:
- Cover letter: clean layout? recipient correct? text fits 1 page?
- CV: sidebar colors correct? photo visible? skill pills readable?
