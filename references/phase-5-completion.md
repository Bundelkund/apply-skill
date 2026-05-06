# Phase 5: Completion

## 5a: Tracker update (deduplication safeguard)

If the posting came from your tracker DB (Supabase, Postgres, sqlite, …):

> **Status values in `user_job_data.application_status`** (recommended convention):
> - `new` — unprocessed (default)
> - `skipped` — auto-dismissed
> - `applied` — application sent
>
> **Rule**: only flip `new` -> `applied`.

```sql
-- Find the job
SELECT id FROM jobs WHERE url = '{{job_url}}' OR external_id = '{{external_id}}' LIMIT 1;

-- Upsert user_job_data
INSERT INTO user_job_data (user_id, job_id, application_status, applied_at, updated_at)
VALUES ('{{user_id}}', '{{job_id}}', 'applied', NOW(), NOW())
ON CONFLICT (user_id, job_id) DO UPDATE SET
  application_status = 'applied', applied_at = NOW(), updated_at = NOW();
```

If you do not run a tracker DB, skip this step — the file-based INDEX.md update in 5c is enough.

## 5b: Application channel research (mandatory)

**Step 1 — read the posting**: portal link? email? explicit instructions?

**Step 2 — find the company's careers page** (when unclear):
- WebSearch: `"{{company}} careers"`
- Typical patterns: `{{company}}.jobs.personio.de`, `jobs.ashbyhq.com/{{company}}`, `{{company}}.teamtailor.com`

**Step 3 — classify the result**:
| Channel | Meaning |
|---------|---------|
| `Portal` | Company-owned ATS with a direct link |
| `Email` | Apply by email |
| `Check` | No portal / email found |

**Important**: Indeed / Glassdoor / LinkedIn links are NOT valid application channels.

## 5c: Update the tracker overview

**Primary (if you run a tracker DB)**:

```sql
INSERT INTO applyskill_tracker (
  user_id, company, role, score, status, contact_person, contact_title, phone, email,
  contact_linkedin, channel, portal_url, deadline, questions, hints, folder_name
) VALUES (
  '{{user_id}}', '{{Company}}', '{{Role}}', {{Score}}, 'created',
  '{{Contact}}', '{{Title}}', '{{Phone}}', '{{Email}}', '{{LinkedIn}}',
  '{{portal/email/check}}', '{{Portal-URL}}', '{{Deadline}}', '{{Questions}}', '{{Hints}}',
  '{{company}}-{{role}}'
);
```

**Secondary (always)**: `${CAREER_DIR}/applications/INDEX.md` — Markdown backup, append a row.

## 5c-2 (optional): ApplyReview content sync

> **Only if** you run a review frontend with tables `apply_content`, `apply_review_status` and a `apply-files` storage bucket.
> **Failure mode**: sync errors are non-blocking — skip and continue.

**Step 1**: resolve `tracker_id`
**Step 2**: insert into `apply_content` (5 records: anschreiben, job_fit_analysis, cv_anpassung, cv, stellenanzeige)
**Step 3**: upload to `apply-files` bucket (4 files: cover letter + CV as HTML + PDF)
**Step 4**: insert into `apply_review_status` (`unreviewed`)

## 5d: Backup files (optional)

If `BACKUP_DIR` is set in `.env`, copy the application bundle there:

```bash
DEST="${BACKUP_DIR}/{{company}}-{{role}}"
mkdir -p "$DEST"
cp ${CAREER_DIR}/applications/{{company}}-{{role}}/output/*.pdf "$DEST/"
cp ${CAREER_DIR}/applications/{{company}}-{{role}}/anschreiben.md "$DEST/"
cp ${CAREER_DIR}/applications/{{company}}-{{role}}/cv.md "$DEST/"
cp ${CAREER_DIR}/applications/{{company}}-{{role}}/job-fit-analysis.md "$DEST/"
```

## 5e: Prepare company-specific questions

1. **Load `${CAREER_DIR}/profile/fragen.md`** — base question catalog
2. **Add company context** — research from Phase 3a
3. **Formulate 2-3 questions**: 1x role, 1x culture, 1x optional strategic
4. **Persist to your tracker + INDEX.md**

## 5f: Next steps for the user

1. Show the PDFs to the user
2. Mention any extra requirements (videos, portfolio, …)
3. State the application channel (portal link or email)
4. Show the prepared questions
5. Remind the user: open the PDFs locally, eyeball them, then submit
