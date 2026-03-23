---
name: update-memory
description: Process conversation content or notes.md and update the memory system with categorized, linked information. Use when user says "remember this", "update memory", "save to memory", "store this", or asks you to remember any piece of information. Also trigger when the user shares important decisions, preferences, project details, or reference material that should persist across sessions — even if they don't explicitly say "save".
---

# Memory Update Skill

## Purpose
Capture important information from the current conversation or `notes.md` and persist it into the structured memory system so it's available in future sessions.

## Memory System Location
`<MEMORY_PATH>`

## Process

### 1. Identify what to save
Determine the source and extract key information:

- **From conversation**: When user says "remember this" or similar, identify the specific facts, decisions, preferences, or context to save.
- **From notes.md**: Read `notes.md` — if it has content beyond the template, process it.

Extract these types of information:
- Decisions and their rationale
- Project details and status updates
- People, roles, and relationships
- Technical solutions and configurations
- User preferences and corrections
- Reference links and resources

### 2. Categorize the content
Decide which files to update based on the content:

| Category | File/Directory | What goes here |
|----------|---------------|----------------|
| Recent context | `MEMORY.md` | Always update — add timestamped entries under "Recent Context" |
| User profile | `USER.md` | Preferences, role changes, personal details |
| Work | `Work/` | Projects, meetings, customer engagements, work decisions |
| Technical | `Technical/` | Solutions, tool configs, code patterns, technical learnings |
| Personal | `Personal/` | Personal notes, non-work items |
| Reference | `Reference/` | Links, documentation, reference materials |

For category directories: use `README.md` for general/short entries, or create a dedicated file for substantial topics (e.g., `Work/Project-Name.md`).

### 3. Update files
When writing updates:

- **Add, don't replace** — append new information under the appropriate section. Only modify existing entries if correcting or updating them.
- **Use bidirectional links** — reference related files with `[[filename]]` syntax (e.g., `[[Work/Project-Name.md]]`).
- **Timestamp entries** — prefix with date: `- YYYY-MM-DD: <content>`.
- **Deduplicate** — search existing content first (via `knowledge search` on "My Memory" KB or by reading the target file). Don't add information that's already captured. Update existing entries if the new info refines or supersedes them.
- **Keep entries concise** — capture the essence, not the full conversation transcript.

### 4. Handle notes.md (if processing notes)
If the source was `notes.md`:
1. Process and distribute content to the appropriate files
2. Archive the original to `.archive/YYYY-MM-DD-notes.md`
3. Reset `notes.md` to its empty template:
```markdown
# Raw Notes

<!-- Add your rough notes here. The memory skill will process and organize them. -->

---
*Created: YYYY-MM-DD*
```

### 5. Re-index the knowledge base
After updating files, refresh the knowledge base so future searches find the new content:

```
knowledge update --path "<MEMORY_PATH>" --name "My Memory"
```

### 6. Confirm to the user
Briefly tell the user what you saved and where. Keep it short — e.g., "Saved the project meeting notes to Work/ and updated MEMORY.md with the key decisions."
