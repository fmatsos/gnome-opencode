# OpenCode Integration Guide

This document explains how the GNOME OpenCode Statistics Extension integrates with OpenCode to retrieve usage statistics.

## Overview

The extension reads token usage statistics from OpenCode's local data directory. Since OpenCode doesn't currently expose a built-in statistics file, this extension provides a foundation for such integration.

## Data Flow

```
OpenCode Session → stats.json (event-driven, session.idle) → GNOME Extension (real-time monitor) → User Interface
```

## Statistics File Location

The extension looks for statistics at:
```
~/.local/share/opencode/stats.json
```

## Statistics File Format

The extension expects a JSON file with the following structure:

```json
{
  "session": {
    "totalTokens": 1500,
    "tokensByModel": {
      "gpt-4-turbo": 1000,
      "claude-3-opus": 500
    },
    "lastActivity": 1234567890000,
    "startTime": 1234567800000
  },
  "daily": {
    "totalTokens": 5000,
    "tokensByModel": {
      "gpt-4-turbo": 3000,
      "claude-3-opus": 2000
    },
    "date": "2024-01-15"
  },
  "total": {
    "totalTokens": 50000,
    "tokensByModel": {
      "gpt-4-turbo": 30000,
      "claude-3-opus": 15000,
      "gpt-3.5-turbo": 5000
    },
    "installDate": 1234567890000
  }
}
```

## Field Descriptions

### Session Statistics

- `totalTokens` (number): Total tokens used in the current session
- `tokensByModel` (object): Token usage broken down by model name
- `lastActivity` (number): Unix timestamp (milliseconds) of last activity
- `startTime` (number): Unix timestamp (milliseconds) when session started

### Daily Statistics

- `totalTokens` (number): Total tokens used today
- `tokensByModel` (object): Today's token usage by model
- `date` (string): ISO date string (YYYY-MM-DD)

### Total Statistics

- `totalTokens` (number): Cumulative tokens since installation
- `tokensByModel` (object): All-time token usage by model
- `installDate` (number): Unix timestamp (milliseconds) of first use

## Integration Options

### Option 1: OpenCode Plugin/Extension (RECOMMENDED)

**This repository includes a ready-to-use OpenCode plugin!**

The `gnome-stats-exporter` plugin is located in `.opencode/plugin/` and automatically tracks token usage and writes to the stats file. To use it:

**Project-level installation:**
```bash
# The plugin is already in this repository
# Just use OpenCode in this project directory
```

**Global installation:**
```bash
# Copy to your global OpenCode config
mkdir -p ~/.config/opencode/plugin
cp .opencode/plugin/gnome-stats-exporter.ts ~/.config/opencode/plugin/
```

The plugin tracks token usage using the `chat.message` hook:

```typescript
// Simplified example from .opencode/plugin/gnome-stats-exporter.ts
import type { Plugin } from "@opencode-ai/plugin";

export const GnomeStatsExporter: Plugin = async ({ client, project, directory, worktree, $ }) => {
  return {
    "chat.message": async (input, output) => {
      const message = output.message;
      if (message.role === "assistant") {
        const tokens = message.tokens;
        // Track input, output, reasoning, and cache tokens
        // Update session, daily, and total statistics
        // Save to ~/.local/share/opencode/stats.json
      }
    },
  };
};
```

See [.opencode/plugin/README.md](.opencode/plugin/README.md) for full documentation.

### Option 2: External Monitor Script

Run a background script that monitors OpenCode's activity and generates statistics:

```javascript
// monitor-opencode.js
const fs = require('fs');
const path = require('path');

const STATS_FILE = path.join(
  process.env.HOME,
  '.local/share/opencode/stats.json'
);

// Monitor OpenCode logs/activity and update stats
// Implementation depends on OpenCode's logging mechanism
```

### Option 3: Direct API Integration

If OpenCode exposes an API endpoint for statistics:

```javascript
// Fetch from OpenCode API
const response = await fetch('http://localhost:8080/api/stats');
const stats = await response.json();
```

## Updating the Extension

The extension automatically checks for updates every 60 seconds. You can also manually trigger an update by clicking "Refresh Statistics" in the extension menu.

## Token Counting

The extension expects token counts to include:

- Input tokens (prompt)
- Output tokens (completion)
- Reasoning tokens (if applicable)
- Cache tokens (if applicable)

Total tokens = input + output + reasoning + cache

## Model Names

Use consistent model naming across OpenCode sessions. Examples:

- `gpt-4-turbo`
- `gpt-4`
- `gpt-3.5-turbo`
- `claude-3-opus`
- `claude-3-sonnet`
- `claude-3-haiku`
- `gemini-pro`
- Custom models: use provider-prefixed names like `anthropic/claude-3-opus`

## Session Management

A "session" is defined as:
- Starts when OpenCode begins running
- Ends when OpenCode is stopped or crashes
- Resets to 0 tokens on new session start

The extension uses both the `lastActivity` timestamp and the OpenCode `session.idle` event for idle detection. If more than 15 minutes pass without activity, or if a `session.idle` event is received, an idle warning is shown immediately. This enables real-time idle detection and notification.

## Daily Reset

Daily statistics automatically reset at midnight (00:00 local time). The extension handles date changes automatically.

## Example Implementation

Here's a simple bash script that creates mock statistics for testing:

```bash
#!/bin/bash

STATS_DIR="$HOME/.local/share/opencode"
STATS_FILE="$STATS_DIR/stats.json"

mkdir -p "$STATS_DIR"

cat > "$STATS_FILE" << EOF
{
  "session": {
    "totalTokens": 1500,
    "tokensByModel": {
      "gpt-4-turbo": 1000,
      "claude-3-opus": 500
    },
    "lastActivity": $(date +%s)000,
    "startTime": $(($(date +%s) - 3600))000
  },
  "daily": {
    "totalTokens": 5000,
    "tokensByModel": {
      "gpt-4-turbo": 3000,
      "claude-3-opus": 2000
    },
    "date": "$(date +%Y-%m-%d)"
  },
  "total": {
    "totalTokens": 50000,
    "tokensByModel": {
      "gpt-4-turbo": 30000,
      "claude-3-opus": 15000,
      "gpt-3.5-turbo": 5000
    },
    "installDate": 1704067200000
  }
}
EOF

echo "Created mock statistics at $STATS_FILE"
```

## Future Enhancements

Potential improvements for OpenCode integration:

1. **Real-time WebSocket updates**: Push notifications when token usage changes
2. **Cost tracking**: Include cost calculations based on model pricing
3. **Historical data**: Store daily statistics for trend analysis
4. **Usage limits**: Alert when approaching token/cost limits
5. **Multi-workspace support**: Track statistics per OpenCode workspace
6. **Export functionality**: Export statistics to CSV or other formats

## Contributing

If you're developing OpenCode integrations, please consider:

1. Following the statistics file format defined in this document
2. Writing to `~/.local/share/opencode/stats.json` atomically
3. Including timestamps in milliseconds (Unix epoch)
4. Using consistent model naming conventions
5. Updating statistics in real-time or near-real-time

## Support

For questions about integration:
- Open an issue on [GitHub](https://github.com/fmatsos/gnome-opencode/issues)
- Refer to [OpenCode documentation](https://github.com/sst/opencode)
