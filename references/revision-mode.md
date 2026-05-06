# Revision mode: `/apply --revise [slug]`

> Reworks an existing application based on review feedback (e.g. from a review frontend or a manual review pass).

## When to use

- User runs `/apply --revise {{slug}}` or says "revise", "rework"
- There are open `apply_revisions` records with `status = 'pending'` in the tracker DB

## Workflow

### R1: Load the revision request

Skip this step if you do not run a tracker DB — instead read review feedback directly from `${CAREER_DIR}/applications/{{slug}}/review.md`.

```sql
SELECT r.id, r.instructions, r.comment_ids, r.created_at
FROM apply_revisions r
JOIN applyskill_tracker t ON r.tracker_id = t.id
WHERE t.folder_name = '{{slug}}'
  AND r.status = 'pending'
ORDER BY r.created_at ASC;
```

If no open revisions -> tell the user.

### R2: Load comments

```sql
SELECT id, content_type, paragraph_index, paragraph_label, comment_text
FROM apply_comments
WHERE id = ANY('{{comment_ids_array}}'::uuid[]);
```

### R3: Resolve current version

```sql
SELECT MAX(version) as current_version
FROM apply_content
WHERE tracker_id = (SELECT id FROM applyskill_tracker WHERE folder_name = '{{slug}}')
  AND content_type = 'anschreiben';
```

### R4: Apply the revision

1. Load local files: `${CAREER_DIR}/applications/{{slug}}/anschreiben.md`, `job-fit-analysis.md`, …
2. Load profile files (as in Phase 1)
3. Apply the instructions from the revision + comments
4. Save the reworked files locally
5. Re-run the template review (Phase 4a)
6. Re-generate the PDFs (Phase 4b)

### R5: Sync back to the tracker DB (if applicable)

> **Failure mode**: sync errors are non-blocking — log and continue.

```sql
-- New version
INSERT INTO apply_content (tracker_id, content_type, markdown, frontmatter, version)
VALUES ('{{tracker_id}}', 'anschreiben', '{{new_markdown}}', '{{frontmatter}}', {{new_version}});

-- Mark revision completed
UPDATE apply_revisions SET status = 'completed', result_version = {{new_version}}, completed_at = NOW()
WHERE id = '{{revision_id}}';

-- Resolve comments
UPDATE apply_comments SET resolved = true, resolved_at = NOW()
WHERE id = ANY('{{comment_ids}}'::uuid[]);

-- Reset review status
UPDATE apply_review_status SET review_state = 'needs_review', updated_at = NOW()
WHERE tracker_id = '{{tracker_id}}';
```

**File upload**: same 4 files as the first submission, with `upsert: true`.

### R6: Wrap up

1. Show the PDFs via the Read tool
2. Tell the user: "Version {{N}} created, {{X}} comments resolved"
3. Refresh the optional `BACKUP_DIR` copy
