---
name: update-memory
description: Process conversation content or notes.md and update the memory system with categorized, linked information. Use when user says "remember this", "update memory", "save to memory", "store this", or asks you to remember any piece of information. Also trigger when the user shares important decisions, preferences, project details, or reference material that should persist across sessions — even if they don't explicitly say "save". If the user corrects you, shares a preference, mentions a new project, introduces a person, or makes a technical decision, that's a signal to save it. Don't wait for permission — important context that would help future sessions should be captured proactively.
---

# Memory Update Skill

## Purpose
Capture important information from the current conversation or `notes.md` and persist it into the structured memory system so it's available in future sessions.

The value of this skill compounds over time — every piece of context you save makes future sessions smarter. The cost of saving something unnecessary is low (it can be pruned later during consolidation), but the cost of forgetting something important is high (the user has to repeat themselves). When in doubt, save it.

## Memory System Location
`<MEMORY_PATH>`

## Process

### 1. Identify what to save
Determine the source and extract key information:

- **From conversation**: Look for facts, decisions, preferences, or context worth persisting. The user might say "remember this" explicitly, or they might just share something important in passing.
- **From notes.md**: Read `notes.md` — if it has content beyond the empty template, process it.

These types of information are worth capturing:
- Decisions and their rationale (why something was chosen, not just what)
- Project details and status updates
- People, roles, and relationships
- Technical solutions and configurations
- User preferences and corrections (especially corrections — if the user corrects you, that's high-signal)
- Reference links and resources

### 2. Categorize the content
Route information to the right file based on what it is:

| Category | File/Directory | What goes here |
|----------|---------------|----------------|
| Recent context | `MEMORY.md` | Always update — add timestamped entries under "Recent Context" |
| Agent behavior | `AGENT.md` | Communication style, behavioral rules, learned preferences. Update when the user corrects your tone, format, or approach — or when you notice a pattern that works well |
| Soul / identity | `SOUL.md` | Core purpose, principles, identity. Rarely updated — only when the user explicitly redefines the agent's mission or values |
| User profile | `USER.md` | Preferences, role changes, personal details |
| Projects | `Personal/Projects/` | Non-customer projects — personal, internal, or org-level work |
| People | `People/` | Contacts, teams, roles, relationships |
| Knowledge | `Knowledge/` | Technical solutions, tool configs, reference docs, links |
| Decisions | `Decisions/` | Decisions with rationale and related context |
| Customers | `Customers/` | Customer companies and their engagements. Create a subdirectory per company with a `README.md` for company overview and separate files per engagement (e.g., `Customers/Acme/README.md` for company info, `Customers/Acme/Redesign.md` for an engagement) |
| Personal | `Personal/` | Life, interests, goals, hobbies, health, habits (projects go in `Personal/Projects/`) |
| Reference | `Reference/` | Articles, documentation, bookmarks, useful URLs |
| Technical | `Technical/` | Code snippets, debugging solutions, environment configs, architecture notes |
| Work | `Work/` | Meetings, processes, team dynamics, org context |

For category directories: use `README.md` for brief or general entries. Create a dedicated file for substantial topics — e.g., `Personal/Projects/Internal-Tool.md` or `People/Jane-Smith.md`. For customers, create a subdirectory per company — e.g., `Customers/Acme/README.md` for the company and `Customers/Acme/Redesign.md` for an engagement.

### 3. Update files
When writing updates:

- **Add, don't replace** — append new information under the appropriate section. Only modify existing entries when correcting or updating them.
- **Use bidirectional links** — reference related files with `[[filename]]` syntax (e.g., `[[Customers/Acme/Redesign.md]]`). These links help the load-memory skill follow connections between topics.
- **Timestamp entries** — prefix with date: `- 2026-03-27: Decided to use Fastify for the API layer`. Absolute dates age well; relative dates ("yesterday") become meaningless after a few days.
- **Deduplicate** — search existing content first (via `knowledge search` or by reading the target file). Don't add information that's already captured. Update existing entries if the new info refines or supersedes them.
- **Keep entries concise** — capture the essence, not the full conversation. A good memory entry reads like a useful note to your future self.

**Example of a good entry:**
```
- 2026-03-27: Switched API from Express to Fastify for better performance.
  Rationale: benchmarks showed 2x throughput. See [[Decisions/README.md]].
```

**Example of a customer engagement structure:**
```
# Customers/Acme/README.md  (company overview)
## Engagements
- [[Customers/Acme/Website-Redesign.md]] — active
- [[Customers/Acme/API-Migration.md]] — completed 2026-02

# Customers/Acme/Website-Redesign.md  (engagement detail)
## Website Redesign
- Status: Active
- Started: 2026-03-01
- Key contacts: [[People/Jane-Smith.md]]
```

**Example of a bad entry:**
```
- 2026-03-27: The user and I had a long discussion about API frameworks
  and after considering several options including Express, Koa, and Fastify,
  we ultimately decided that Fastify would be the best choice because...
```

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
Briefly tell the user what you saved and where. Keep it short:

**Good:** "Saved the Fastify decision to Decisions/ and updated the project status in Personal/Projects/Internal-Tool.md."
**Bad:** "I have updated the following files in your memory system: MEMORY.md (added 2 entries), Decisions/README.md (added 1 entry), Customers/Acme/Redesign.md (modified status field)..."
