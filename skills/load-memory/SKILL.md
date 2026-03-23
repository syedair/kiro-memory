---
name: load-memory
description: Load relevant context from the memory system based on user's current topic or question. Use when starting a new conversation, when user asks about past context, references previous work, mentions a project or person by name, or when background knowledge would improve your response. Also use when user says "what do you remember", "load context", or "check memory". Trigger this proactively whenever prior context would help — don't wait for the user to ask.
---

# Load Memory Skill

## Purpose
Retrieve relevant information from the memory system so you can respond with full context about the user, their projects, preferences, and past decisions.

## Memory System Location
`<MEMORY_PATH>`

## How to Load Context

### Step 1: Always read MEMORY.md for temporal/general queries
If the user asks about "recent" activity, "what's going on", "what have I been working on", or anything time-based, read `MEMORY.md` directly first — it has timestamped recent context that semantic search often misses.

### Step 2: Search the knowledge base
Use the `knowledge` tool to search for relevant content across all knowledge bases. If you need to target "My Memory" specifically, run `knowledge show` first to get the current context ID.

```
knowledge search --query "<topic keywords>"
```

### Step 3: Read specific files based on results
If the search points to specific files, read them for full context. Also read these files when broadly relevant:

| File | When to read |
|------|-------------|
| `MEMORY.md` | Always — contains recent context, key decisions, ongoing threads |
| `USER.md` | When user preferences, role, or profile matter |
| `Work/` | Work projects, meetings, customer engagements |
| `Technical/` | Technical solutions, tool configs, code patterns |
| `Personal/` | Personal notes |
| `Reference/` | Reference materials, links, documentation |

Category directories may contain topic-specific markdown files (e.g., `Work/Project-Name.md`). Read those when the search or conversation points to them.

### Step 4: Synthesize naturally
Weave loaded context into your response naturally — don't dump raw memory contents. Reference past decisions, ongoing threads, and user preferences as if you remember them. If you find relevant context, acknowledge it briefly (e.g., "Based on your previous work on...").

## Important Notes
- The memory system uses bidirectional `[[links]]` between files — follow these links when you need deeper context on a referenced topic.
- If the knowledge base search returns nothing useful, fall back to reading `MEMORY.md` directly — it has the most recent context.
- Don't tell the user you're "loading memory" or "searching the knowledge base" — just use the context seamlessly.
