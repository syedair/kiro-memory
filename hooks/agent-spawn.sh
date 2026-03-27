#!/usr/bin/env bash
# agentSpawn hook: loads MEMORY.md into context and checks consolidation staleness
# STDOUT is injected into the agent's context automatically by Kiro

MEMORY_PATH="<MEMORY_PATH>"
MEMORY_FILE="$MEMORY_PATH/MEMORY.md"
DREAM_FILE="$MEMORY_PATH/.last-dream"
SESSION_FILE="$MEMORY_PATH/.session-count"

# Load MEMORY.md into context
if [ -f "$MEMORY_FILE" ]; then
  echo "=== Memory Context (auto-loaded) ==="
  head -200 "$MEMORY_FILE"
  echo "=== End Memory Context ==="
fi

# Increment session counter
count=0
[ -f "$SESSION_FILE" ] && count=$(cat "$SESSION_FILE" 2>/dev/null || echo 0)
count=$((count + 1))
echo "$count" > "$SESSION_FILE"

# Check staleness
if [ -f "$DREAM_FILE" ]; then
  last_dream=$(cat "$DREAM_FILE")
  now=$(date +%s)
  age=$(( (now - last_dream) / 86400 ))
  if [ "$age" -ge 3 ] && [ "$count" -ge 5 ]; then
    echo ""
    echo "⚠ Memory hasn't been consolidated in ${age} days (${count} sessions). Consider saying 'dream' or 'consolidate memory' to clean up."
  fi
else
  if [ "$count" -ge 5 ]; then
    echo ""
    echo "⚠ Memory has never been consolidated (${count} sessions so far). Consider saying 'dream' or 'consolidate memory'."
  fi
fi
