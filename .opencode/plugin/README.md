# GNOME Stats Exporter - OpenCode Plugin

This OpenCode plugin automatically tracks token usage from your OpenCode sessions and exports statistics to a file that the [GNOME OpenCode Statistics Extension](../../README.md) can read and display.

## What It Does

The plugin:
- **Tracks token usage** from all AI model interactions in OpenCode
- **Maintains three levels of statistics**:
  - **Session**: Tokens used in the current OpenCode session
  - **Daily**: Tokens used today (resets at midnight)
  - **Total**: Cumulative tokens since first use
- **Exports data** to `~/.local/share/opencode/stats.json`
- **Per-model breakdown**: Tracks usage separately for each AI model (GPT-4, Claude, etc.)
- **Real-time updates**: Statistics update immediately after each AI interaction
- **Real-time idle detection**: Proactively notifies GNOME extension when session becomes idle (15+ minutes)
- **Automatic idle flag management**: Sets/clears idle status automatically based on activity

## Installation

### Method 1: Project-Level Plugin

If you want the plugin to work only for a specific project:

1. Copy this plugin directory to your project:
   ```bash
   mkdir -p .opencode/plugin
   cp -r /path/to/gnome-opencode/.opencode/plugin/* .opencode/plugin/
   ```

2. The plugin will be automatically loaded when you start OpenCode in that project.

### Method 2: Global Plugin

To enable the plugin for all OpenCode sessions:

1. Copy the plugin to the global OpenCode config directory:
   ```bash
   mkdir -p ~/.config/opencode/plugin
   cp /path/to/gnome-opencode/.opencode/plugin/gnome-stats-exporter.ts ~/.config/opencode/plugin/
   ```

2. The plugin will be loaded for all OpenCode sessions.

## How It Works

The plugin uses OpenCode's `chat.message` hook to intercept assistant messages and extract token usage information. It uses Bun's native APIs for file operations:

```typescript
"chat.message": async (input, output) => {
  const message = output.message;
  if (message.role === "assistant") {
    const tokens = message.tokens;
    // Track input, output, reasoning, and cache tokens
    // Update session, daily, and total statistics
    // Save to ~/.local/share/opencode/stats.json using Bun.write()
  }
}
```

## Statistics File Format

The plugin exports data in the following JSON format:

```json
{
  "session": {
    "totalTokens": 1500,
    "tokensByModel": {
      "gpt-4-turbo": 1000,
      "claude-3-opus": 500
    },
    "lastActivity": 1704384000000,
    "startTime": 1704380400000
  },
  "daily": {
    "totalTokens": 5000,
    "tokensByModel": {
      "gpt-4-turbo": 3000,
      "claude-3-opus": 2000
    },
    "date": "2024-01-04"
  },
  "total": {
    "totalTokens": 50000,
    "tokensByModel": {
      "gpt-4-turbo": 30000,
      "claude-3-opus": 15000,
      "gpt-3.5-turbo": 5000
    },
    "installDate": 1701792000000
  }
}
```

## Token Counting

The plugin counts all tokens including:
- **Input tokens**: Tokens in your prompts and context
- **Output tokens**: Tokens in AI responses
- **Reasoning tokens**: Tokens used for model reasoning (if applicable)
- **Cache tokens**: Both read and write cache tokens

Total tokens = input + output + reasoning + cache (read + write)

## Session Management

- A **session** starts when OpenCode starts and the plugin loads
- Session stats reset to 0 when OpenCode restarts
- The `lastActivity` timestamp updates with each AI interaction
- The `startTime` is set when the session begins

## Real-time Idle Detection

The plugin actively monitors session activity and notifies the GNOME extension when the session becomes idle:

- **Idle Threshold**: 15 minutes of inactivity
- **Check Interval**: Monitors activity every 30 seconds
- **Idle Flag**: Sets `isIdle: true` in stats file when threshold exceeded
- **Automatic Reset**: Clears idle flag when activity resumes

**Benefits:**
- GNOME extension receives idle notifications within 1-2 seconds (vs up to 60 seconds with polling)
- More accurate idle detection from the source of truth
- Fallback polling still works for backward compatibility

**Stats File Addition:**
```json
{
  "session": {
    "isIdle": true,              // Set when session becomes idle
    "idleSince": 1704384900000   // Timestamp when idle started
  }
}
```

## Daily Reset

- Daily statistics automatically reset at midnight (00:00 local time)
- The plugin checks the date on each message and resets if needed
- Historical daily data is not preserved (only current day)

## Compatibility

- **Runtime**: Requires Bun (OpenCode's runtime)
- **OpenCode**: Works with OpenCode versions that support plugins
- **AI Models**: Tracks all AI models supported by OpenCode
- **Operating Systems**: Linux, macOS (Windows users should adjust the stats file path)

## Configuration

The stats file location is hardcoded to:
```
~/.local/share/opencode/stats.json
```

To change the location, edit `gnome-stats-exporter.ts` and modify:
```typescript
const statsDir = path.join(os.homedir(), ".local", "share", "opencode");
```

## Troubleshooting

### Plugin Not Loading

1. Check OpenCode logs for plugin errors:
   ```bash
   # Check OpenCode output for plugin loading messages
   ```

2. Verify the plugin file location:
   ```bash
   ls -la .opencode/plugin/gnome-stats-exporter.ts
   # or
   ls -la ~/.config/opencode/plugin/gnome-stats-exporter.ts
   ```

### Stats File Not Created

1. Check directory permissions:
   ```bash
   ls -la ~/.local/share/opencode/
   ```

2. The directory will be created automatically if it doesn't exist

3. Check OpenCode logs for write errors

### Statistics Not Updating

1. Ensure the plugin is loaded:
   - Check OpenCode startup logs for plugin loading messages

2. Verify you're using OpenCode:
   - Statistics only update when you interact with AI models through OpenCode

3. Check file timestamps:
   ```bash
   ls -la ~/.local/share/opencode/stats.json
   ```

## Development

### Plugin Structure

```
.opencode/plugin/
├── gnome-stats-exporter.ts  # Main plugin code
├── package.json             # Plugin metadata
└── README.md               # This file
```

### Extending the Plugin

You can extend the plugin to:
- Add cost tracking based on model pricing
- Export to different file formats (CSV, XML)
- Send statistics to a remote server
- Track additional metrics (response times, error rates)

### Testing

To test the plugin:

1. Start OpenCode with the plugin installed
2. Have a conversation with an AI model
3. Check the stats file:
   ```bash
   cat ~/.local/share/opencode/stats.json
   ```
4. Verify statistics update after each message

## Integration with GNOME Extension

This plugin is designed to work seamlessly with the GNOME OpenCode Statistics Extension:

1. Install this plugin in your OpenCode configuration
2. Install the GNOME Shell extension
3. Start using OpenCode
4. View real-time statistics in your GNOME top bar

The GNOME extension reads the `~/.local/share/opencode/stats.json` file every 60 seconds and displays the data in a convenient system tray indicator.

## License

GPL-3.0-or-later - Same as the GNOME OpenCode Statistics Extension

## Links

- [GNOME OpenCode Statistics Extension](https://github.com/fmatsos/gnome-opencode)
- [OpenCode](https://github.com/sst/opencode)
- [OpenCode Plugin Documentation](https://github.com/sst/opencode/tree/main/packages/plugin)

## Support

For issues with:
- **This plugin**: Open an issue on the [gnome-opencode repository](https://github.com/fmatsos/gnome-opencode/issues)
- **OpenCode itself**: See the [OpenCode repository](https://github.com/sst/opencode)
- **The GNOME extension**: See the [main README](../../README.md)
