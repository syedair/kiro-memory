# Kiro Memory Skill

A persistent memory system for [Kiro CLI](https://kiro.dev) that lets your AI assistant remember context across sessions. It stores structured notes about your work, projects, people, decisions, and preferences — and retrieves them automatically when relevant.

## How It Works

Two skills work together:
- **load-memory** — Automatically retrieves relevant context from your memory when you start a conversation or reference past work
- **update-memory** — Saves important information from conversations into categorized, linked markdown files

All memory is stored as plain markdown files in a folder you control, indexed via Kiro's `knowledge` tool for semantic search.

## Setup

### Quick Install (recommended)

```bash
npx kiro-memory-skill
```

This will walk you through:
- Creating the memory folder (default `~/Memory`)
- Copying template files
- Installing the skills to `~/.kiro/skills/`
- Patching the memory path in both skill files

After that, just follow the on-screen next steps to index the folder and optionally create an agent.

### Manual Install

<details>
<summary>Click to expand manual setup steps</summary>

#### 1. Create the memory folder

```bash
mkdir -p ~/Memory/{Projects,People,Knowledge,Decisions,.archive}
```

#### 2. Initialize the memory files

```bash
# Copy the template files
cp -r memory-template/* ~/Memory/
```

Or create them manually — see [Memory Folder Structure](#memory-folder-structure) below.

#### 3. Install the skills

```bash
cp -r skills/load-memory ~/.kiro/skills/
cp -r skills/update-memory ~/.kiro/skills/
```

#### 4. Update paths

Edit both skill files to point to your memory folder:

- `~/.kiro/skills/load-memory/SKILL.md` — update the `Memory System Location` path
- `~/.kiro/skills/update-memory/SKILL.md` — update the `Memory System Location` path

#### 5. Index the memory folder

There are two types of Knowledge Bases:

1. Fast (Lexical — bm25):
```bash
kiro-cli settings knowledge.indexType Fast
```

2. Best (Semantic — all-minilm-l6-v2):
```bash
kiro-cli settings knowledge.indexType Best
```

For more details, see the [Knowledge Management docs](https://kiro.dev/docs/cli/experimental/knowledge-management/).

Then add your memory folder as a knowledge base in Kiro CLI:
```
/knowledge add --name "My Memory" --value "~/Memory"
```

#### 6. Create your agent (optional)

If you want a dedicated agent for this:

```bash
kiro-cli chat --agent <name-of-your-agent>
```

Update the agent config with the skill resources:

```json
{
  "resources": [
    "skill://~/.kiro/skills/load-memory/SKILL.md",
    "skill://~/.kiro/skills/update-memory/SKILL.md"
  ]
}
```

The agent config will be stored in:
`.kiro/agents/<name-of-your-agent>`

If you would like to not include the default list of MCPs, you can set this in the agent config:

```json
{
  "includeMcpJson": false
}
```

#### 7. Start chatting with your agent

> Note: Using `--trust-all-tools` skips confirmation prompts when the agent updates memory. You can omit it for added supervision.

```bash
kiro-cli chat --agent <name-of-your-agent> --trust-all-tools
```

</details>


## Memory Folder Structure

```
~/Memory/
├── README.md              # Index of all files
├── MEMORY.md              # Rolling context log — recent activity, active threads
├── USER.md                # Your profile, preferences, role
├── notes.md               # Raw notes drop zone (processed by update-memory)
├── Projects/              # One file per project or engagement
│   └── README.md          # Active projects index
├── People/                # One file per person or team
│   └── README.md          # Contacts index
├── Knowledge/             # Technical solutions, tools, reference docs
│   └── README.md
├── Decisions/             # Decision log with rationale
│   └── README.md
└── .archive/              # Processed notes archive
    └── YYYY-MM-DD-notes.md
```

### Key Files

| File | Purpose |
|------|---------|
| `MEMORY.md` | Rolling context — recent activity and active threads |
| `USER.md` | Your profile — name, role, timezone, preferences |
| `notes.md` | Drop raw notes here — the skill processes and distributes them |
| `Projects/README.md` | Active projects index with status |
| `Projects/<Name>.md` | Detailed file per project or engagement |
| `People/README.md` | Contacts, teams, and relationships |
| `Knowledge/README.md` | Technical solutions, tool configs, reference links |
| `Decisions/README.md` | Decision log with rationale and related context |

### Conventions

- **Timestamps**: Entries prefixed with `- YYYY-MM-DD: <content>`
- **Bidirectional links**: Reference related files with `[[filename]]` syntax
- **Append, don't replace**: New info is added, existing entries updated only when correcting
- **Deduplicate**: Search before adding to avoid duplicates

## Usage

### Saving to memory

Just say:
- "remember this"
- "update memory"
- "save to memory"

Or share important context and the skill triggers automatically when it detects decisions, project details, or reference material worth persisting.

### Loading from memory

Happens automatically when you:
- Start a new conversation about a known topic
- Reference a project, person, or past decision
- Say "what do you remember about X"
- Say "load context" or "check memory"

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

Update the path in both `SKILL.md` files and re-index:
```
/knowledge update --name "My Memory" --value "/your/new/path"
```

## License

MIT — use it however you want.
