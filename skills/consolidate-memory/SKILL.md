---
name: consolidate-memory
description: Consolidate, prune, and reorganize the memory system — like a dream cycle. Use when user says "dream", "consolidate memory", "clean up memory", "prune memory", or "organize memory". Also trigger when memory files feel cluttered, contradictory, or stale. Think of this as REM sleep for the memory system — it strengthens what matters and discards what doesn't.
---

# Consolidate Memory Skill

## Purpose
Review all memory files, prune stale entries, resolve contradictions, deduplicate, convert relative dates to absolute, and reorganize — keeping the memory system clean and useful.

## Memory System Location
`<MEMORY_PATH>`

## Process

### Phase 1: Orient
Read the full memory directory to understand current state:
1. Read `MEMORY.md` — the index and recent context
2. Read `USER.md` — user profile
3. List and skim all files in `Projects/`, `People/`, `Knowledge/`, `Decisions/`
4. Note file sizes, last-updated dates, and cross-references

### Phase 2: Identify Issues
Scan for these problems across all files:

- **Stale entries** — references to projects marked complete long ago, people no longer relevant, tools no longer used
- **Contradictions** — conflicting facts across files (e.g., "uses Express" in one file, "migrated to Fastify" in another)
- **Relative dates** — "yesterday", "last week", "recently" that have lost meaning. Convert to absolute dates using the current date and the file's last-modified context
- **Duplicates** — same information repeated across multiple files
- **Orphaned links** — `[[links]]` pointing to files that don't exist
- **Oversized files** — any single file over 200 lines should be split or trimmed

### Phase 3: Consolidate
For each issue found, fix it at the source:

- **Prune** stale entries — delete them, don't just mark them. If an entire file becomes empty after pruning, delete the file and remove its link from parent README.md
- **Resolve contradictions** — newer information wins. When in doubt, keep both with a note asking the user to clarify
- **Convert dates** — replace relative dates with absolute: `- 2026-03-27: Decided to use Fastify` not `- yesterday: Decided to use Fastify`
- **Deduplicate** — merge overlapping entries into the most appropriate file. Keep the richer version
- **Fix links** — remove broken `[[links]]`, add missing ones where files reference each other
- **Split large files** — if a category README.md has grown too large, extract topics into dedicated files (e.g., `Projects/Acme.md`)

### Phase 4: Prune and Index
Update `MEMORY.md` to reflect the current state:
1. Keep it under 200 lines — it's an index, not a dump
2. Remove pointers to deleted files
3. Add pointers to new files created during consolidation
4. Update the "Recent Context" section — archive entries older than 30 days
5. Move archived context to `.archive/YYYY-MM-DD-consolidation.md`

### Phase 5: Re-index and Stamp
After all changes:
1. Refresh the knowledge base:
```
knowledge update --path "<MEMORY_PATH>" --name "My Memory"
```
2. Update the dream timestamp so hooks know when consolidation last ran:
```bash
date +%s > "<MEMORY_PATH>/.last-dream"
```
3. Reset the session counter:
```bash
echo "0" > "<MEMORY_PATH>/.session-count"
```

### Phase 6: Report
Tell the user what changed. Be specific and brief:
- Files pruned or deleted
- Contradictions resolved
- Entries deduplicated
- Dates converted
- Size before/after for MEMORY.md

## Guidelines
- Be surgical — don't rewrite files that don't need changes
- When unsure if something is stale, leave it and note the uncertainty
- Preserve the user's voice — don't rephrase their notes into corporate speak
- Always timestamp the consolidation: add `- YYYY-MM-DD: Memory consolidated` to MEMORY.md
