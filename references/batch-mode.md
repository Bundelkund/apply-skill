# Batch mode (subagents)

For batch runs with multiple applications:

- inject the **agent-prompt template** as context prefix: `references/agent-prompt-template.md`
- the template contains profile context, structure, tone, and all rules (single source of truth)
- saves ~50% tokens per subagent (~80 vs. ~400 lines of context)
- max **3 parallel agents** (rate-limit strategy)
- on edge cases (missing evidence, unclear fit) -> reload the full profile files

## Batch PDF generation (HTML pipeline)

`templates/generate-cvs.js` natively supports multiple applications in one run:

1. Add a new config per application to the `configs` array
2. Run `node templates/generate-cvs.js` once -> generates all CV HTMLs
3. Chrome calls for PDFs can run in parallel (3 at a time)

```bash
# Generate all CV HTMLs
node templates/generate-cvs.js

# All PDFs in parallel (cover letter + CVs)
for dir in firma1-rolle firma2-rolle firma3-rolle; do
  "$CHROME_BIN" --headless --disable-gpu --no-sandbox \
    --print-to-pdf="${CAREER_DIR}/applications/$dir/output/Anschreiben_${AUTHOR}.pdf" --no-margins \
    "file://${CAREER_DIR}/applications/$dir/output/Anschreiben_${AUTHOR}.html" &
  "$CHROME_BIN" --headless --disable-gpu --no-sandbox \
    --print-to-pdf="${CAREER_DIR}/applications/$dir/output/CV_${AUTHOR}.pdf" --no-margins \
    "file://${CAREER_DIR}/applications/$dir/output/CV_${AUTHOR}.html" &
done
wait
```
