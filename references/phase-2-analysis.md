# Phase 2: Analysis

**Profile source**: all profile data comes from `get_my_profile()` — the five fields (`positioning`, `cv_text`, `achievements`, `skills_matrix`, `writing_style`) replace the old `profile/*.md` files exactly 1:1.

## 2a: Job-fit check

Compare the posting (loaded via `get_job`) against `cv_text` and `achievements` from the profile:

1. **Keyword analysis**: extract every must-have requirement, status per requirement (Strong / Medium / Gap) with evidence
2. **Gap analysis**: name potential gaps and propose mitigation
3. **Fit score**: strengths + risks, total 0–100
4. **Recommendation**: apply yes/no with reasoning
5. **Keywords for the CV**: list of terms that must appear in the CV / cover letter

**Output**: in-conversation Markdown block labelled `job-fit-analysis`.

**Gate**: at score < 50, ask the user whether to continue.

> **Note**: this score is the LLM-generated job-fit score (the skill's own analysis). If the posting came from `get_my_matches`, store the match score from that response in the analysis for reference — it is the upstream keyword-based score, distinct from this fit score.

## 2b: CV tailoring (bullet-point upgrade)

Based on 2a and using `cv_text`, `achievements`, `skills_matrix` from the profile:

1. **Prioritize experiences**: which positions are most relevant for this role?
2. **Rewrite bullet points**:
   - start with a verb → name the impact → use numbers
   - max 2 lines per bullet
   - embed ATS keywords from the posting
3. **Two variants** per bullet
4. **Skills section** tailored to the posting

**Output**: in-conversation Markdown block labelled `cv-anpassung`.

## 2c: Build the CV in Markdown

From `cv-anpassung`, pick the best variants and write the final CV as polished Markdown. Follow the section layout from `references/templates.md`.

**Output**: in-conversation Markdown block labelled `cv`.
