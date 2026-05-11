---
name: consolidate-memory
description: Consolidate, prune, and reorganize the memory system — like a dream cycle. Use when user says "dream", "consolidate memory", "clean up memory", "prune memory", "organize memory", or "tidy up memory". Also trigger when the user complains about stale context, contradictory information, or when memory files feel cluttered. If the session-start hook reports that consolidation is overdue, and the user acknowledges it, use this skill.
---

# Consolidate Memory Skill

## Purpose
Review all memory files, prune stale entries, resolve contradictions, deduplicate, convert relative dates to absolute, and reorganize — keeping the memory system clean and useful over time.

## Memory System Location
`<MEMORY_PATH>`

## Process

### Phase 1: Orient
Read the full memory directory to understand current state.

1. Read `SOUL.md`, `AGENT.md`, `MEMORY.md`, `USER.md`
2. List all files across all category dirs:

```bash
find <MEMORY_PATH> -name "*.md" | sort
```

3. Read files that appear large or recently modified

### Phase 2: Identify Issues
- **Stale entries** — completed projects long ago, people no longer relevant, tools no longer used
- **Contradictions** — conflicting facts across files (newer entry usually wins)
- **Relative dates** — "yesterday", "last week" that have lost meaning
- **Duplicates** — same info repeated across files
- **Orphaned links** — `[[links]]` pointing to non-existent files
- **Oversized files** — over 1000 lines should be split
- **Misplaced content** — files outside expected structure:
  - Root: `SOUL.md`, `AGENT.md`, `USER.md`, `MEMORY.md`, `notes.md`
  - Category folders: `Customers/`, `Personal/`, `Personal/Projects/`, `People/`, `Knowledge/`, `Decisions/`, `Reference/`, `Technical/`, `Work/`, `.archive/`

### Phase 3: Consolidate
- **Preserve before pruning** — verify detail exists in category sub-folder before removing from MEMORY.md
- **Prune** stale entries. Delete empty files afterward.
- **Resolve contradictions** — newer wins. When uncertain: `<!-- Conflict: verify with user -->`
- **Annotate superseded entries** rather than deleting:
  ```
  - 2026-03-20: Chose Express (superseded — migrated to Fastify 2026-03-26)
  - 2026-03-26: Switched to Fastify for better performance
  ```
- **Convert relative dates** to absolute using today's date
- **Deduplicate** — merge overlapping entries, keep the richer version
- **Fix links** — remove broken `[[links]]`, add missing ones
- **Split large files** — extract topics into dedicated files, leave link in README
- **Relocate misplaced content** — move files to correct location, update `[[links]]`

### Phase 4: Update MEMORY.md
1. Keep under 1000 lines
2. Remove pointers to deleted files, add pointers to new files
3. Archive "Recent Context" entries older than 30 days to `.archive/YYYY-MM-DD-consolidation.md`

### Phase 5: Stamp the consolidation

```bash
date +%s > <MEMORY_PATH>/.last-dream
echo "0" > <MEMORY_PATH>/.session-count
```

Add to MEMORY.md under Recent Context:
```
- YYYY-MM-DD: Memory consolidated
```

### Phase 6: Report
Tell the user what changed — briefly:
- Files pruned/deleted
- Contradictions resolved
- Entries deduplicated
- Dates converted
- MEMORY.md size before/after

## Guidelines
- Be surgical — don't rewrite files that don't need changes
- When unsure if something is stale, leave it with a comment rather than deleting
- Preserve the user's voice — don't rephrase their notes into formal language
