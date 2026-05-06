# Phase 2: Analysis

## 2a: Job-fit check

Compare the posting against the user's CV:

1. **Keyword analysis**: extract every must-have requirement, status per requirement (Strong / Medium / Gap) with evidence
2. **Gap analysis**: name potential gaps and propose mitigation
3. **Fit score**: strengths + risks, total 0–100
4. **Recommendation**: apply yes/no with reasoning
5. **Keywords for the CV**: list of terms that must appear in the CV / cover letter

**Output**: `${CAREER_DIR}/applications/{{company}}-{{role}}/job-fit-analysis.md`

**Gate**: at score < 50, ask the user whether to continue.

> **Note**: this score is the LLM-generated job-fit score (the skill's own analysis), NOT the keyword-based score from Discovery Engine. If the posting came from DE, store the DE score in `job-fit-analysis.md` for reference.

## 2b: CV tailoring (bullet-point upgrade)

Based on 2a:

1. **Prioritize experiences**: which positions are most relevant for this role?
2. **Rewrite bullet points**:
   - start with a verb -> name the impact -> use numbers
   - max 2 lines per bullet
   - embed ATS keywords from the posting
3. **Two variants** per bullet
4. **Skills section** tailored to the posting

**Output**: `${CAREER_DIR}/applications/{{company}}-{{role}}/cv-anpassung.md`

## 2c: Build the CV in Markdown

From `cv-anpassung.md`, pick the best variants and write the final CV in LaTeX-compatible Markdown (uses `\section{}`, `\cveintrag{}`, `\begin{itemize}` etc. when feeding the pandoc pipeline).

**Output**: `${CAREER_DIR}/applications/{{company}}-{{role}}/cv.md`
