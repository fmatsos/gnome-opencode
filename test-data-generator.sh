#!/bin/bash
# Test data generator for GNOME OpenCode Statistics Extension
# This script creates mock OpenCode statistics for testing purposes

STATS_DIR="$HOME/.local/share/opencode"
STATS_FILE="$STATS_DIR/stats.json"

# Create directory if it doesn't exist
mkdir -p "$STATS_DIR"

# Get current timestamp in milliseconds
CURRENT_TIME=$(date +%s)000
SESSION_START=$((CURRENT_TIME - 3600000))  # 1 hour ago
INSTALL_DATE=$((CURRENT_TIME - 2592000000))  # 30 days ago

# Generate random token counts for variety
SESSION_TOKENS=$((RANDOM % 5000 + 500))
DAILY_TOKENS=$((RANDOM % 20000 + 5000))
TOTAL_TOKENS=$((RANDOM % 500000 + 50000))

# Calculate model-specific tokens
GPT4_SESSION=$((SESSION_TOKENS * 60 / 100))
CLAUDE_SESSION=$((SESSION_TOKENS - GPT4_SESSION))

GPT4_DAILY=$((DAILY_TOKENS * 55 / 100))
CLAUDE_DAILY=$((DAILY_TOKENS * 35 / 100))
GPT35_DAILY=$((DAILY_TOKENS - GPT4_DAILY - CLAUDE_DAILY))

GPT4_TOTAL=$((TOTAL_TOKENS * 50 / 100))
CLAUDE_TOTAL=$((TOTAL_TOKENS * 30 / 100))
GPT35_TOTAL=$((TOTAL_TOKENS * 15 / 100))
GEMINI_TOTAL=$((TOTAL_TOKENS - GPT4_TOTAL - CLAUDE_TOTAL - GPT35_TOTAL))

# Create the statistics JSON file
cat > "$STATS_FILE" << EOF
{
  "session": {
    "totalTokens": $SESSION_TOKENS,
    "tokensByModel": {
      "gpt-4-turbo": $GPT4_SESSION,
      "claude-3-opus": $CLAUDE_SESSION
    },
    "lastActivity": $CURRENT_TIME,
    "startTime": $SESSION_START
  },
  "daily": {
    "totalTokens": $DAILY_TOKENS,
    "tokensByModel": {
      "gpt-4-turbo": $GPT4_DAILY,
      "claude-3-opus": $CLAUDE_DAILY,
      "gpt-3.5-turbo": $GPT35_DAILY
    },
    "date": "$(date +%Y-%m-%d)"
  },
  "total": {
    "totalTokens": $TOTAL_TOKENS,
    "tokensByModel": {
      "gpt-4-turbo": $GPT4_TOTAL,
      "claude-3-opus": $CLAUDE_TOTAL,
      "gpt-3.5-turbo": $GPT35_TOTAL,
      "gemini-pro": $GEMINI_TOTAL
    },
    "installDate": $INSTALL_DATE
  }
}
EOF

echo "✓ Created mock OpenCode statistics at: $STATS_FILE"
echo ""
echo "Statistics Summary:"
echo "  Session: $SESSION_TOKENS tokens"
echo "  Daily:   $DAILY_TOKENS tokens"
echo "  Total:   $TOTAL_TOKENS tokens"
echo ""
echo "You can now test the GNOME extension with this data."
echo "Run this script again to generate new random values."
