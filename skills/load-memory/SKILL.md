---
name: load-memory
description: Load relevant context from the memory system based on user's current topic or question. Use when starting a new conversation, when user asks about past context, references previous work, mentions a project or person by name, or when background knowledge would improve your response. Also use when user says "what do you remember", "load context", or "check memory". Trigger this proactively whenever prior context would help — don't wait for the user to ask. Even if the user hasn't explicitly asked for memory, use this skill whenever you suspect knowing their history, preferences, past decisions, or project context would make your response better. Err on the side of loading context — it's cheap and the user benefits from continuity.
---

# Load Memory Skill

## Purpose
Retrieve relevant information from the memory system so you can respond with full context about the user, their projects, preferences, and past decisions.

The goal is continuity — the user should feel like you genuinely remember them across sessions, not like they're starting fresh every time. This means weaving context in naturally, not announcing that you "loaded" anything.

## Memory System Location
`<MEMORY_PATH>`

## How to Load Context

### Step 1: Read MEMORY.md first for temporal queries
Start here for anything time-related — "what have I been working on", "what's going on", "recently". MEMORY.md has timestamped entries that semantic search often ranks poorly because the keywords don't match the query well.

### Step 2: Search the knowledge base
Use the `knowledge` tool to find relevant content by topic. This catches things spread across multiple files that you wouldn't know to look for.

```
knowledge search --query "<topic keywords>"
```

If you need to target the memory knowledge base specifically, run `knowledge show` first to get the context ID.

### Step 3: Read specific files for depth
Search results point you to files — read the ones that matter. Use this as a guide for when each file is worth reading:

| File | When it helps |
|------|--------------|
| `MEMORY.md` | Almost always — recent context and active threads |
| `USER.md` | When preferences, role, communication style, or timezone matter |
| `Projects/` | When the conversation touches on any project or engagement |
| `People/` | When names, teams, or relationships come up |
| `Knowledge/` | When technical solutions, tool configs, or reference material is relevant |
| `Decisions/` | When past choices or their rationale would inform the current discussion |

Category directories often contain topic-specific files (e.g., `Projects/Acme-Redesign.md`). Follow `[[links]]` between files when you need deeper context on a referenced topic — the memory system uses bidirectional links for exactly this purpose.

### Step 4: Synthesize naturally
Weave what you found into your response as if you remember it. Reference past decisions, ongoing threads, and preferences conversationally.

**Good:** "Since you switched to Fastify last month, you'll want to update the route handlers..."
**Bad:** "According to my memory files, on 2026-03-15 you decided to use Fastify."

If memory entries contain relative dates like "yesterday" or "last week," don't repeat them verbatim — they were written at a different time and are likely stale. Use the absolute timestamps from the entries instead, or phrase things relative to today's date.

**Bad:** "You fixed the auth bug last week" (repeating a stale relative date from the file)
**Good:** "You fixed the auth bug around March 21st" (using the actual timestamp)

If the knowledge base search returns nothing useful, fall back to reading `MEMORY.md` directly — it always has the most recent context.

Don't tell the user you're "loading memory" or "searching the knowledge base." The magic is in the seamlessness.
