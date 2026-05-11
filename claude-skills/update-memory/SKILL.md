---
name: update-memory
description: Process conversation content and update the memory system with categorized, linked information. Use when user says "remember this", "update memory", "save to memory", "store this", or asks you to remember any piece of information. Also trigger when the user shares important decisions, preferences, project details, or reference material that should persist across sessions — even if they don't explicitly say "save". If the user corrects you, shares a preference, mentions a new project, introduces a person, or makes a technical decision, that's a signal to save it. Don't wait for permission — important context that would help future sessions should be captured proactively.
---

# Memory Update Skill

## Purpose
Capture important information from the current conversation and persist it into the structured memory system so it's available in future sessions.

The value of this skill compounds over time — every piece of context you save makes future sessions smarter. When in doubt, save it.

## Memory System Location
`<MEMORY_PATH>`

## Process

### 1. Identify what to save
Extract these types of information:
- Decisions and their rationale (why something was chosen, not just what)
- Project details and status updates
- People, roles, and relationships
- Technical solutions and configurations
- User preferences and corrections (especially corrections — high signal)
- Reference links and resources

### 2. Check for existing content
Before writing, grep to avoid duplicates:

```bash
grep -r "<keyword>" <MEMORY_PATH> --include="*.md" -l
```

Read matching files to understand what's already captured. Update existing entries if the new info refines or supersedes them.

### 3. Categorize the content

| Category | File/Directory | What goes here |
|----------|---------------|----------------|
| Recent context | `MEMORY.md` | Always update — add timestamped entries under "Recent Context" |
| Agent behavior | `AGENT.md` | Communication style, behavioral rules, learned preferences |
| Soul / identity | `SOUL.md` | Core purpose, principles, identity. Rarely updated |
| User profile | `USER.md` | Preferences, role changes, personal details |
| Projects | `Personal/Projects/` | Non-customer projects |
| People | `People/` | Contacts, teams, roles, relationships |
| Knowledge | `Knowledge/` | Technical solutions, tool configs, reference docs |
| Decisions | `Decisions/` | Decisions with rationale and related context |
| Customers | `Customers/` | Customer companies and their engagements |
| Personal | `Personal/` | Life, interests, goals, hobbies, health, habits |
| Reference | `Reference/` | Articles, documentation, bookmarks, useful URLs |
| Technical | `Technical/` | Code snippets, debugging solutions, environment configs |
| Work | `Work/` | Meetings, processes, team dynamics, org context |

For category directories: use `README.md` for brief or general entries. Create a dedicated file for substantial topics — e.g., `Personal/Projects/Internal-Tool.md` or `People/Jane-Smith.md`. For customers, create a subdirectory per company — e.g., `Customers/Acme/README.md`.

### 4. Update files
- **Add, don't replace** — append new information. Only modify existing entries when correcting or updating.
- **Use bidirectional links** — reference related files with `[[filename]]` syntax.
- **Timestamp entries** — prefix with date: `- 2026-03-27: Decided to use Fastify`.
- **Keep entries concise** — capture the essence, not the full conversation.

### 5. Handle notes.md (if processing notes)
If the source was `notes.md`:
1. Process and distribute content to appropriate files
2. Archive to `.archive/YYYY-MM-DD-notes.md`
3. Reset `notes.md` to its empty template

### 6. Confirm to the user
Briefly tell the user what you saved and where.

**Good:** "Saved the Fastify decision to Decisions/ and updated the project status in Personal/Projects/."
**Bad:** "I have updated the following files in your memory system: MEMORY.md (added 2 entries)..."
