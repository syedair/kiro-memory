---
name: consolidate-memory
description: Consolidate, prune, and reorganize the memory system — like a dream cycle. Use when user says "dream", "consolidate memory", "clean up memory", "prune memory", "organize memory", or "tidy up memory". Also trigger when the user complains about stale context, contradictory information, or when memory files feel cluttered. If the agentSpawn hook reports that consolidation is overdue, and the user acknowledges it, use this skill. Think of this as REM sleep for the memory system — it strengthens what matters and discards what doesn't. Even a casual "my memory is getting messy" should trigger this.
---

# Consolidate Memory Skill

## Purpose
Review all memory files, prune stale entries, resolve contradictions, deduplicate, convert relative dates to absolute, and reorganize — keeping the memory system clean and useful over time.

Without periodic consolidation, memory files accumulate noise: contradictory entries pile up, relative dates like "yesterday" lose meaning, and duplicate information spreads across files. This skill is the cleanup cycle that prevents memory from degrading.

## Memory System Location
`<MEMORY_PATH>`

## Process

### Phase 1: Orient
Read the full memory directory to understand current state. This prevents creating duplicates or missing context during consolidation.

1. Read `MEMORY.md` — the index and recent context
2. Read `USER.md` — user profile
3. List and skim all files in `Projects/`, `People/`, `Knowledge/`, `Decisions/`
4. Note file sizes, last-updated dates, and cross-references

### Phase 2: Identify Issues
Scan for these problems across all files:

- **Stale entries** — references to projects marked complete long ago, people no longer relevant, tools no longer used. A project completed 6 months ago with no recent references is a candidate for archival.
- **Contradictions** — conflicting facts across files. For example, one file says "uses Express" while another says "migrated to Fastify." The newer entry is usually correct.
- **Relative dates** — "yesterday", "last week", "recently" that have lost meaning. These are fine when first written but become confusing after a few days. Convert them using the current date and the file's context.
- **Duplicates** — same information repeated across multiple files. Common when the user mentions the same thing in different conversations.
- **Orphaned links** — `[[links]]` pointing to files that don't exist.
- **Oversized files** — any single file over 200 lines should be split or trimmed. Large files are harder to search and slower to load.

### Phase 3: Consolidate
Fix each issue at the source:

- **Prune** stale entries — remove them entirely. If an entire file becomes empty after pruning, delete the file and remove its link from the parent README.md.
- **Resolve contradictions** — newer information wins. When genuinely uncertain, keep both with a brief note: `<!-- Conflict: verify with user whether Express or Fastify is current -->`.
- **Convert dates** — replace relative with absolute.

  **Before:** `- yesterday: Decided to use Fastify`
  **After:** `- 2026-03-26: Decided to use Fastify`

- **Deduplicate** — merge overlapping entries into the most appropriate file. Keep the richer version, discard the thinner one.
- **Fix links** — remove broken `[[links]]`, add missing ones where files clearly reference each other.
- **Split large files** — if a category README.md has grown too large, extract topics into dedicated files (e.g., `Projects/Acme.md`) and leave a link in the README.

### Phase 4: Prune and Index
Update `MEMORY.md` to reflect the current state:
1. Keep it under 200 lines — it's an index and recent-context log, not a dump. The agentSpawn hook loads this file into context at startup, so keeping it lean means faster, cleaner session starts.
2. Remove pointers to deleted files.
3. Add pointers to new files created during consolidation.
4. Archive "Recent Context" entries older than 30 days to `.archive/YYYY-MM-DD-consolidation.md`. These aren't lost — they're still searchable via the knowledge base — but they don't need to take up space in the active index.

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

**Example report:**
```
Consolidated memory:
- Pruned 3 stale project entries from Projects/README.md
- Resolved Express/Fastify contradiction in Knowledge/README.md (kept Fastify)
- Converted 7 relative dates to absolute
- Deduplicated 2 entries between MEMORY.md and Decisions/README.md
- MEMORY.md: 187 → 142 lines
```

## Guidelines
- Be surgical — don't rewrite files that don't need changes. If a file is clean, leave it alone.
- When unsure if something is stale, leave it and add a comment noting the uncertainty. It's better to ask the user than to delete something they still care about.
- Preserve the user's voice — don't rephrase their notes into formal language. If they wrote "this API is janky," keep it that way.
- Timestamp the consolidation: add `- YYYY-MM-DD: Memory consolidated` to MEMORY.md under Recent Context.
