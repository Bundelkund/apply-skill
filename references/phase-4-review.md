# Phase 4: Review

## GATE — artifact check (mandatory before Phase 4)

Confirm that all of the following in-conversation artifacts exist from prior phases:

- [ ] job posting (Phase 1)
- [ ] job-fit-analysis (Phase 2a)
- [ ] cv-anpassung (Phase 2b)
- [ ] cv (Phase 2c)
- [ ] anschreiben (Phase 3c)

If any is missing: stop. Ask the user whether to produce it or skip.

## 4a: Review against the template

Check the cover letter against `references/agent-prompt-template.md`:

- [ ] Structure matches the template (4 paragraphs by default)
- [ ] All DON'Ts from the template respected
- [ ] Keyword reconciliation comment at the bottom (HTML comment format)
- [ ] Every must-have keyword from `job-fit-analysis` covered
- [ ] Cover letter <= 1 page
- [ ] Recipient and subject correct
- [ ] No spelling errors
- [ ] **Salutation present**: first line after `---` is a real salutation
- [ ] **Closing correct**: umlauts present, no backslash before name
- [ ] **Umlauts throughout**: no ASCII replacements
- [ ] **No first name** of the contact in salutation or body
- [ ] **No unchecked anglicisms** (e.g. German "Adoption" → "Adaption" or "Annahme")

## 4a.5: Adversarial review (Generator-Verifier gate)

> **Optional, recommended for**: high-interest postings (job-fit >= 70), leadership roles, or when the user passes `/apply --thorough`.
> **Skip for**: low job-fit, or `/apply --fast`.

**Pattern**: Generator-Verifier — the cover letter is the generated artifact, reviewed in-context with a sceptic persona.

**Steps**:

1. **Adopt the reviewer perspective** — re-read the cover letter with a sceptical eye, against the posting. Your job is to find weaknesses, NOT to confirm it is good.

2. **Score 4 criteria** (1–10, threshold 7):

   - **posting-match**: every must-have requirement from the posting is addressed in the cover letter. Count missing keywords. Test: compare posting paragraph by paragraph with the letter.
   - **authenticity**: no generic filler, concrete examples with numbers / context, no "I am highly motivated" style. Test: mark every sentence that would also fit another role.
   - **jonas-rule (problem-solution)**: paragraphs 2–3 show concrete value for the company, not just what the candidate can do. Test: check that "Sie/Ihr/your company" appears more often than "Ich/I/my".
   - **no-donts**: none of the DON'Ts in `writing_style` (from `get_my_profile()`) are violated. Test: check against the DON'T list.

3. **Feedback loop** — max 2 rounds:
   - Round 1: score all 4 criteria
   - On FAILs (score < 7): rewrite the affected paragraphs in the cover letter directly
   - Round 2: re-score only the failed criteria
   - After round 2 still FAILs → ask the user

4. **Result** — append a short note at the end of the cover letter Markdown:

```
<!-- Adversarial Review: PASS | R1: posting-match 5->8, authenticity 8, jonas-rule 7, no-donts 9 -->
```

## 4b: PDF rendering — TBD on Desktop

**PDF rendering — TBD on Desktop.** The desktop variant outputs the final cover letter + CV as polished Markdown; PDF export path is not yet wired (see project backlog). To create a PDF: copy the final Markdown into your preferred editor (e.g. Typora, VS Code + markdown-pdf, or a word processor) and export from there.
