#!/bin/bash
# SPDX-License-Identifier: GPL-3.0-or-later
# SPDX-FileCopyrightText: 2024 fmatsos
#
# Test script to demonstrate real-time sync
# This script updates the OpenCode stats file and the extension should update immediately

STATS_FILE="$HOME/.local/share/opencode/stats.json"

echo "======================================"
echo "Real-time Sync Test"
echo "======================================"
echo ""
echo "This script will update the OpenCode stats file every 5 seconds."
echo "Watch the GNOME extension popup to see it update in real-time!"
echo ""
echo "Press Ctrl+C to stop."
echo ""

# Ensure directory exists
mkdir -p "$(dirname "$STATS_FILE")"

# Function to generate random stats
generate_stats() {
    local session_tokens=$((RANDOM % 5000 + 1000))
    local daily_tokens=$((RANDOM % 50000 + 10000))
    local total_tokens=$((RANDOM % 200000 + 50000))
    local timestamp=$(date +%s)000
    
    cat > "$STATS_FILE" << EOF
{
  "session": {
    "totalTokens": $session_tokens,
    "tokensByModel": {
      "gpt-4-turbo": $((session_tokens * 60 / 100)),
      "claude-3-opus": $((session_tokens * 40 / 100))
    },
    "lastActivity": $timestamp,
    "startTime": $(($timestamp - 3600000))
  },
  "daily": {
    "totalTokens": $daily_tokens,
    "tokensByModel": {
      "gpt-4-turbo": $((daily_tokens * 55 / 100)),
      "claude-3-opus": $((daily_tokens * 35 / 100)),
      "gpt-3.5-turbo": $((daily_tokens * 10 / 100))
    },
    "date": "$(date +%Y-%m-%d)"
  },
  "total": {
    "totalTokens": $total_tokens,
    "tokensByModel": {
      "gpt-4-turbo": $((total_tokens * 50 / 100)),
      "claude-3-opus": $((total_tokens * 30 / 100)),
      "gpt-3.5-turbo": $((total_tokens * 15 / 100)),
      "gemini-pro": $((total_tokens * 5 / 100))
    },
    "installDate": $(($timestamp - 2592000000))
  }
}
EOF
    echo "Updated stats: Session=$session_tokens, Daily=$daily_tokens, Total=$total_tokens"
}

# Main loop
counter=1
while true; do
    echo "[$counter] Updating stats file..."
    generate_stats
    echo "    File updated at $(date '+%H:%M:%S')"
    echo "    👀 Check the GNOME extension - it should update immediately!"
    echo ""
    sleep 5
    counter=$((counter + 1))
done
