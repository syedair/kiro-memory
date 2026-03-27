#!/usr/bin/env bash
# stop hook: stamps the last-dream timestamp after consolidation runs
# This is called after every assistant turn — we use it to track session activity

MEMORY_PATH="<MEMORY_PATH>"
DREAM_FILE="$MEMORY_PATH/.last-dream"

# Read the hook event from stdin
EVENT=$(cat)

# Check if the assistant just ran a consolidation (look for the marker in MEMORY.md)
# We detect this by checking if .last-dream was updated in the last 60 seconds
if [ -f "$DREAM_FILE" ]; then
  last=$(cat "$DREAM_FILE")
  now=$(date +%s)
  if [ $((now - last)) -le 60 ]; then
    # Recently consolidated — reset session counter
    echo "0" > "$MEMORY_PATH/.session-count"
  fi
fi
