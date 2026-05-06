# Auto-apply automation

> Optional: daily auto-apply via cron (Linux/macOS) or Windows Task Scheduler.

## Architecture

```
09:00  scheduler
  -> scripts/auto-apply.sh   (or .bat on Windows)
    -> claude -p "Read .claude/routines/auto-apply.md ..."
      -> Discovery Engine / Supabase: top jobs (score >= MIN_SCORE)
      -> dedup against tracker + existing application folders
      -> /apply with the best job (all 5 phases)
```

## Components

| File | Purpose |
|------|---------|
| `routines/auto-apply.md` | Prompt for Claude CLI — DB query, job selection, /apply trigger |
| `scripts/auto-apply.sh` (or `.bat`) | Wrapper invoked by the scheduler |
| `~/.claude/logs/auto-apply.log` | Execution log |

> The skill ships the prompt + scripts as templates. The user wires them into their scheduler of choice.

## Scheduling

### Linux / macOS (cron)

```bash
# Open crontab
crontab -e

# Append:
0 9 * * * /path/to/scripts/auto-apply.sh >> ~/.claude/logs/auto-apply.log 2>&1
```

### Windows (Task Scheduler)

```powershell
# Status
schtasks /query /tn "Apply Skill Auto-Apply"

# Run now
schtasks /run /tn "Apply Skill Auto-Apply"

# Pause / resume
schtasks /change /tn "Apply Skill Auto-Apply" /disable
schtasks /change /tn "Apply Skill Auto-Apply" /enable

# Delete
schtasks /delete /tn "Apply Skill Auto-Apply" /f

# Create (daily 09:00)
schtasks /create /tn "Apply Skill Auto-Apply" \
  /tr "C:\path\to\scripts\auto-apply.bat" \
  /sc daily /st 09:00 /f
```

## Optional: post-merge hook

If the routine runs in draft-PR mode (creates an `auto-apply/{{slug}}` branch instead of committing directly), a `PostToolUse:Bash` hook can pick up merges and finish Phase 4+5:

- fill HTML templates (cover letter + CV)
- run Chrome PDF generation
- update the tracker DB
- copy backup files
- update INDEX.md

The hook is only needed for the draft-PR flow. In direct-commit mode, `/apply` runs all 5 phases inline.

## Flow diagram

```
DB (jobs)
  | score >= MIN_SCORE
  v
Claude CLI (auto-apply.md)
  | dedup against tracker
  | best unprocessed job
  v
/apply skill
  | Phase 1: stellenanzeige.md
  | Phase 2: job-fit, cv-anpassung, cv
  | Phase 3: research, anschreiben
  | Phase 4: HTML -> Chrome -> PDF
  | Phase 5: tracker, INDEX.md, backup
  v
Finished application in ${CAREER_DIR}/applications/{{company}}-{{role}}/
```

## Thresholds

| Parameter | Default | Configurable in |
|-----------|---------|-----------------|
| Minimum score for selection | 75 | `routines/auto-apply.md` SQL |
| Minimum job-fit for application | 50 | Phase 2 gate in this skill |
| Max applications per run | 1 | `routines/auto-apply.md` rules |
| Schedule | Daily 09:00 | Scheduler |
