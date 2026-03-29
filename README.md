# Kiro Memory Skill

A persistent memory system for [Kiro CLI](https://kiro.dev) that lets your AI assistant remember context across sessions — and consolidate it like REM sleep.

## What's New in v2

- **Dream consolidation** — a third skill that prunes stale entries, resolves contradictions, deduplicates, and converts relative dates to absolute. Say "dream" or "consolidate memory" to trigger it.
- **Agent hooks** — `agentSpawn` auto-loads your recent memory into context and nudges you when consolidation is overdue. `stop` resets session tracking after a dream cycle.
- **Knowledge base resource** — memory folder is auto-indexed on agent spawn via Kiro's built-in knowledgeBase resource. No manual `/knowledge add` step needed.

## How It Works

Three skills work together:
- **load-memory** — Retrieves relevant context from your memory when you start a conversation or reference past work
- **update-memory** — Saves important information from conversations into categorized, linked markdown files
- **consolidate-memory** — Prunes, deduplicates, and reorganizes memory files (the "dream" cycle)

Two hooks automate the lifecycle:
- **agentSpawn** — Loads `MEMORY.md` into context on startup, checks if consolidation is overdue
- **stop** — Resets session counter after consolidation runs

All memory is stored as plain markdown files in a folder you control.

## Setup

### Quick Install (recommended)

```bash
npx kiro-memory-skill
```

This walks you through:
- Creating the memory folder (default `~/Memory`)
- Copying template files
- Installing all three skills to `~/.kiro/skills/`
- Installing hook scripts to `~/.kiro/memory-hooks/`
- Configuring the knowledge base index type
- Creating an agent with hooks and knowledgeBase resource pre-configured

### Manual Install

<details>
<summary>Click to expand manual setup steps</summary>

#### 1. Create the memory folder

```bash
mkdir -p ~/Memory/{People,Knowledge,Decisions,Customers,Personal,Personal/Projects,Reference,Technical,Work,.archive}
```

#### 2. Initialize the memory files

```bash
cp -r memory-template/* ~/Memory/
```

#### 3. Install the skills

```bash
cp -r skills/load-memory ~/.kiro/skills/
cp -r skills/update-memory ~/.kiro/skills/
cp -r skills/consolidate-memory ~/.kiro/skills/
```

#### 4. Update paths

Edit all three skill files to point to your memory folder — replace `<MEMORY_PATH>` with your path (e.g., `~/Memory`).

#### 5. Install hooks

```bash
mkdir -p ~/.kiro/memory-hooks
cp hooks/*.sh ~/.kiro/memory-hooks/
chmod +x ~/.kiro/memory-hooks/*.sh
```

Edit the hook scripts to replace `<MEMORY_PATH>` with your expanded memory path (e.g., `/Users/you/Memory`).

#### 6. Create your agent

```bash
kiro-cli agent create
```

Use this agent config as a reference:

```json
{
  "name": "mnemo",
  "description": "Kiro Memory — persistent context with dream consolidation",
  "tools": ["*"],
  "resources": [
    "skill://~/.kiro/skills/load-memory/SKILL.md",
    "skill://~/.kiro/skills/update-memory/SKILL.md",
    "skill://~/.kiro/skills/consolidate-memory/SKILL.md",
    {
      "type": "knowledgeBase",
      "source": "file://~/Memory",
      "name": "My Memory",
      "description": "User's persistent memory system",
      "indexType": "best",
      "autoUpdate": true
    }
  ],
  "hooks": {
    "agentSpawn": [
      { "command": "bash ~/.kiro/memory-hooks/agent-spawn.sh" }
    ],
    "stop": [
      { "command": "bash ~/.kiro/memory-hooks/stop.sh" }
    ]
  }
}
```

#### 7. Start chatting

```bash
kiro-cli chat --agent mnemo --trust-all-tools
```

</details>

## Memory Folder Structure

```
~/Memory/
├── README.md              # Index of all files
├── SOUL.md                # Agent's core identity, purpose, and principles
├── AGENT.md               # Agent's behavioral rules and communication style
├── MEMORY.md              # Rolling context log — recent activity, active threads
├── USER.md                # Your profile, preferences, role
├── notes.md               # Raw notes drop zone (processed by update-memory)
├── .last-dream            # Timestamp of last consolidation (managed by hooks)
├── .session-count         # Session counter (managed by hooks)
├── Personal/              # Life, interests, goals, habits
│   └── Projects/          #   Personal, internal, org-level projects
├── People/                # One file per person or team
├── Knowledge/             # Technical solutions, tools, reference docs
├── Decisions/             # Decision log with rationale
├── Customers/             # One subdirectory per customer company
│   └── <Company>/         #   README.md = company overview, plus engagement files
├── Personal/              # Life, interests, goals, habits
├── Reference/             # Links, articles, bookmarks, resources
├── Technical/             # Code snippets, configs, architecture notes
├── Work/                  # Meetings, processes, team dynamics, org context
└── .archive/              # Processed notes and consolidation archives
```

## Usage

### Saving to memory

Just say:
- "remember this"
- "update memory"
- "save to memory"

Or share important context — the skill triggers automatically when it detects decisions, project details, or reference material worth persisting.

### Loading from memory

Happens automatically via the `agentSpawn` hook (loads `MEMORY.md` into context) and the `load-memory` skill (semantic search for deeper context).

### Dream consolidation

Say:
- "dream"
- "consolidate memory"
- "clean up memory"

The agent will also nudge you when consolidation is overdue (3+ days and 5+ sessions since last dream).

The consolidation skill:
1. Reads all memory files
2. Prunes stale entries
3. Resolves contradictions (newer wins)
4. Converts relative dates → absolute
5. Deduplicates across files
6. Enforces a 200-line cap on MEMORY.md
7. Re-indexes the knowledge base

### Raw notes workflow

1. Drop rough notes into `notes.md`
2. Say "process my notes" or "update memory"
3. The skill categorizes and distributes content to the right files
4. Original notes archived to `.archive/YYYY-MM-DD-notes.md`
5. `notes.md` reset to empty template

## Customization

### Adding categories

Create new subdirectories in your memory folder and add them to the categorization table in `update-memory/SKILL.md`.

### Changing the memory path

Update the path in all three `SKILL.md` files and both hook scripts, then re-index:
```
/knowledge update --name "My Memory" --value "/your/new/path"
```

### Adjusting consolidation thresholds

Edit `~/.kiro/memory-hooks/agent-spawn.sh` — change the `3` (days) and `5` (sessions) thresholds to your preference.

## License

MIT — use it however you want.
