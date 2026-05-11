---
name: load-memory
description: Load relevant context from the memory system based on user's current topic or question. Use when starting a new conversation, when user asks about past context, references previous work, mentions a project or person by name, or when background knowledge would improve your response. Also use when user says "what do you remember", "load context", "check memory", or "who am I". Trigger this proactively whenever prior context would help — don't wait for the user to ask.
---

# Load Memory Skill

## Purpose
Retrieve relevant information from the memory system so you can respond with full context about the user, their projects, preferences, and past decisions.

The goal is continuity — the user should feel like you genuinely remember them across sessions. Weave context in naturally, never announce that you "loaded" anything.

## Memory System Location
`<MEMORY_PATH>`

## How to Load Context

### Step 1: Read MEMORY.md first
Start here for anything time-related — "what have I been working on", "what's going on", "recently". MEMORY.md has timestamped entries with recent context and active threads.

### Step 2: Keyword search across memory files
Use grep to find relevant content by topic:

```bash
grep -r "<topic keywords>" <MEMORY_PATH> --include="*.md" -l
grep -ri "<synonym or related term>" <MEMORY_PATH> --include="*.md" -l
```

Run multiple searches with different keyword variations. This catches things spread across multiple files.

### Step 3: Read specific files for depth

| File | When it helps |
|------|--------------|
| `SOUL.md` | Agent identity and principles |
| `AGENT.md` | Behavioral rules and communication style |
| `USER.md` | User preferences, role, timezone |
| `MEMORY.md` | Recent context and active threads |
| `Personal/Projects/` | Personal and internal projects |
| `People/` | When names, teams, or relationships come up |
| `Knowledge/` | Technical solutions, tool configs, reference material |
| `Decisions/` | Past choices and their rationale |
| `Customers/` | Customer companies and engagements |
| `Reference/` | Saved links, articles, bookmarks |
| `Technical/` | Code snippets, configs, architecture notes |
| `Work/` | Meetings, processes, org context |

Follow `[[links]]` between files when you need deeper context on a referenced topic.

### Step 4: Synthesize naturally
Weave what you found into your response as if you remember it.

**Good:** "Since you switched to Fastify last month, you'll want to update the route handlers..."
**Bad:** "According to my memory files, on 2026-03-15 you decided to use Fastify."

If memory entries contain relative dates like "yesterday" or "last week," use the absolute timestamps instead — relative dates in files are stale.

If grep returns nothing useful, read `MEMORY.md` directly — it always has the most recent context.
